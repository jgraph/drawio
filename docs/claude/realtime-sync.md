# Realtime sync: model copies, convergence, invariants

State of 2026-07-24 after the canonical-order/adoption/livelock stream
(commits `5fdc39a27f`..`c05b0133d0`). Read together with
[collab-checksum.md](collab-checksum.md) (checksum debugging) and
[../../etc/rt-test/README.md](../../etc/rt-test/README.md) (regression
harness, finding history). Core files: `DrawioFileSync.js`,
`DiffSync.js`, `DrawioFile.js` (all `js/diagramly/`).

## Model copies per client

| Copy | Holds | Advanced by |
|---|---|---|
| `ui.pages` | visible document | user edits, `file.patch` of live diffs and saves |
| `sync.snapshot` | last flushed state | RAW patch result on receive; flush residue = `diffPages(snapshot, pages)` |
| `file.ownPages` | file state + own pending changes | own flushes (`patchPages` of resolve), `patchRealtime` on merges |
| `file.theirPages` | remote live state | incoming live diffs |
| shadow pages | last saved/merged file state | save/merge cycle |
| `sync.snapshotVars` | last flushed/applied `mxfile vars` string, including null | local flush and foreign file patches; pending edits stay diffable across save completion |
| `file.observedFileVars` | last observed local or foreign vars, including null | local mutation and foreign file patches, even without sync |
| `file.pendingFileVars` | own vars write plus the saved/foreign string it displaced | local mutation; cleared by a foreign vars write, confirmed save, replacement or revoke |
| `file.savingFileVars` | ownership interval serialized by the in-flight save | `updateFileData`; identity prevents an old completion confirming a later interval |

## Convergence model (the load-bearing decisions)

- **Canonical order rebuild** (`patchCellRecursive`, mirrored in
  `patchPages`): every cell/page has exactly one anchor (explicit
  `previous` from the patch, else its current local predecessor);
  claimants per anchor apply in fixed order (inserts in patch order,
  explicit moves id-sorted, implicit follower); depth-first walk.
  Exact diffs are byte-identical by construction (single claimant per
  anchor) — shadow and checksum paths stay stable.
- **Losslessness, not pre-save order equality**: for entangled
  crossing moves the per-patch rebuild is deterministic per base but
  base-dependent — cross-client order converges only through the save
  cycle (adopted by cleanup, gated on `!localFileWasChanged`). Tests
  must gate on losslessness + fixpoint, never pre-save order.
- **Reactive layout deltas are stateful local changes** (design #4):
  the snapshot keeps the raw patch result so the layout's delta stays
  diffable and is flushed/saved like a user edit. Reactive-only
  pending changes ride the debounced flush (armed-once trigger) and
  skip the eager flush in `doReceiveRemoteChanges` — flushing them per
  delivered message amplifies concurrent recomputation into a
  correction storm (jitter livelock, ~8.6k msgs/240s pre-fix).
- **Dirty-page flush**: `sendLocalChanges` diffs only pages marked
  dirty per undoable edit (`markLocalChanges`); unknown change sources
  fall back to all-pages. 20p/10k-cell file: ~200ms → ~8.5ms. A
  `ChangePage` marks its RELATED page (the one inserted or removed) and
  is tested before `SelectPage`, which it extends — a restore brings a
  page of the same id back with different content, so the insert must
  mark it.
- **The lazy cleanup is postponed by activity ON PURPOSE**: every
  delivered live diff, save, merge, catchup, local edit and save data
  generation resets its timer to the full delay, so it runs in the
  first lull only. Arming it once (firing every 15s during traffic) was
  tried and reverted: the grace stamp marks the OLDEST unconfirmed
  arrival and is cleared only when a merge leaves screen == own pages,
  which continuous traffic never does, so a mid-traffic cleanup expels
  content that arrived seconds ago (the came/went/came-back flicker),
  and at 8 clients under production timers the fleet never reached
  quiescence. The cost is that never-saved live content stays on
  screen until the lull; everything that IS saved is bounded by the
  save cycle plus grace (rt-test README, `sync-latency`).
- **Diff page inserts serialize the live root** (`getPageXmlForDiff`):
  a page insert is encoded from the root when the cached node is stale,
  for `diagramModified` (the page was drawn on without a switch) AND
  `needsUpdate` (the root was patched, eg. an own page a save merge
  brought cells into). The cleanup used to insert such a page from the
  pre-merge node, so the screen copy missed the merged cells until the
  next full diff repaired it silently (`reorder`/1 `single-pass-cleanup`).

## Merge invariants (patchRealtime)

`patchRealtime` applies `[savePatches]` WITH `mergeInserts`, then
`[stripPendingInserts(pending), localRemoves]` WITHOUT — this two-call
split is load-bearing and must never be collapsed:

- **Colliding inserts merge content and reposition ONLY under
  `mergeInserts`** (save merges, where the entry is the authoritative
  saved state). Live messages use the existing `[resolve, patch]`
  pair with per-patch cell merge flags `[false, true]`: resolve inserts
  only supply missing references and must preserve newer content,
  position AND terminals for cells already present; actual edits and
  unconfirmed resends (`[{}, patch]`) still merge colliding cell
  inserts, carrying offline edits to peers that hold an older copy.
  `applyPatches` accepts a boolean or an array of booleans; missing
  array entries are false. Applying the pair in one `file.patch`
  transaction keeps reactive layouts and snapshot patching aligned.
  The wire format is unchanged; direct single-patch live calls keep
  their existing merge behavior. Locked by `stale-resolve`.
- **Pending insert entries are stripped on cell AND page level**
  (with removed-id resurrection: local change wins over remote
  remove). Unstripped they re-merge the stale local copy of adopted
  cells/pages over the applied save (ping-pong).
- **Edited-later veto**: pending insert cells whose own copy equals
  the visible state carry edits flushed after the incoming save was
  computed — the collision keeps its content-skip for them (the cell
  still takes the insert position; skipping entirely would orphan it
  from the claimant walk). Connected-peers-only: without live traffic
  own==ui trivially and the veto would disable the stale-copy merge.
- **Pending adopted-page edits**: a whole-page insert hides its cell
  updates from the cell-insert veto. Before merging a save, extract fields
  that differ between remote and own pages and still match the visible
  state, then replay those updates after stripping pending inserts. This
  preserves local label/style edits while allowing independent saved
  fields on the same cell, other cells and page order to merge
  (`page-adoption-edit-race`). This check also runs during disconnected
  file catchup: unchanged stale fields have no delta from the remote copy,
  so they still adopt saved content.
- **Root swap before the walk**: a page root change (an external
  rewrite, or a stray parentless cell the parser picks as the root)
  diffs as a full re-insert rooted at the new id. The root is built
  from its entry WITHOUT children, its layers are separate insert
  entries the recursive walk adds afterwards, so `patchPage` installs
  the new root first and the collision pre-scan runs after the swap
  (the old tree is unregistered by then). The layer invariant is
  checked AFTER the walk: only a crafted root insert with no children
  ends without a layer, and the previous root with its intact subtree
  is restored for it. Refusing an empty root before the walk rejected
  every legitimate root change (31.5.0, `root-change`).
- **Cycle guard**: moves that would place a cell under its own
  descendant (crafted `previous`/`parent` refs; `mxGraphModel.add`
  has no cycle check) are ignored with a debug entry.
- **Terminal sanitizer**: after a patch's remove pass, any edge whose
  terminal object is no longer the model's object for that id is
  disconnected. The edge-list based disconnect covers the direct
  case; crossing windows under loss and reorder (an edge
  re-materialized while its terminal still lives, the terminal
  removed through another window) can leave a dangling OBJECT
  reference that diffs and clones cannot represent — it permanently
  diverges the copies (8-client stress find, `undo-stale` case 5).
- **Flush sanitizer** (`DrawioFileSync.sanitizePageTerminals`): the
  patch-side sanitizer only runs when a patch removes cells on that
  page — a LOCAL interaction can still connect an edge to a terminal
  object a concurrent remote patch has already removed (the
  connection handler holds the target object across the gesture;
  `conflict`/5 @8C find). The receiver side resolves the stale id to
  null on apply, but the originator keeps the dangling pointer: its
  snapshot CLONE drops the reference while `diffPages` on the live
  page serializes the dead object's id — every flush re-echoes the
  same update and the copies never converge. `sendLocalChanges`
  therefore disconnects dangling terminals on the dirty pages before
  computing the flush diff.
- All diff maps keyed by cell/page ids use null prototypes
  (`__proto__` id would silently drop the entry).

Locally inserted children can reference unsaved remote parents missing from
own pages. If the initial local patch skipped such a child, the residual
own-to-visible insert diff still contains it. Cross-reference resolution
adopts that local cell together with its ancestor chain; adopting only the
parent would omit the local child (or the last edge of the flush) from the
next save. Locked by `revoked-child` and `revoked-descendants` before their
revocation phase.

## Undo repair at execute time (EditorUi.js / Pages.js wraps)

Undoable edits reference cell and page OBJECTS, not ids. A remote
patch that removes a cell or materializes a NEW object for a known
id makes those references stale; replaying such an edit unrepaired
restored the stale object — a dangling terminal, a duplicate id in
the tree (cross-page undo bypasses `cellAdded`'s collision rename
because `parentForCellChanged` checks containment against the
current page's root) or a ghost cell from that rename. All of these
permanently diverge the model copies (dangling refs and duplicates
are unrepresentable in diffs/clones).

The history stays COMPLETE across external patches (dropping edits
cost undo steps and could never serve a later revival). Instead,
`mxTerminalChange`/`mxChildChange` (EditorUi.js) and
`ChangePage`/`SelectPage`/`RenamePage`/`MovePage` (Pages.js) execute
wraps resolve their references FRESH on EVERY replay:

- the object still lives → used unchanged
- its id is taken by a NEW object → redirected to the canonical
  object (a remote undo re-adding the cell reconnects the local redo
  to it — `undo-stale` case 9; resolution is per execution, the
  recorded ids survive in `change.repairIntent`)
- the id is gone → TRANSIENT fallback for this execution only: a
  terminal becomes null plus a terminal point at the dead object's
  last absolute position (removed again when a later replay
  reconnects); a child whose target parent is gone first goes back
  into the frozen parent object and is relocated to its nearest
  living ancestor (ids canonicalized) or the default layer, keeping
  its absolute position, only once the WHOLE edit replayed and the
  parent is still outside the document (`drainRepairParents` — a
  composite edit restores a container after the children removed
  from it separately, so deciding per change moved those children
  into the default layer on every plain undo; `editor-semantics`
  `delete-group-with-connections`); a page remove replay becomes a
  no-op, an insert replay of a present page too

A replay can become cyclic after a peer legally reverses a container
relation (A moves X out of G; B moves G under X; A undoes its drag).
`mxUndoableEdit` is wrapped in the application layer to preflight child
changes in execution order using read-only parent/children overlays,
canonical resolution and simulated page/root switches. A conflicting
composite and its opposite replay are both inert, consuming one history
step each while leaving every sibling's private toggle state untouched.
The next retry of the rejected direction resolves fresh and can succeed
after the peer makes the hierarchy safe. Skipping only the parent write
would still replay incompatible drag geometry. The final child-execute
guard also stops direct replay callers before pruning or queueing a
fallback; individual replay advances its frozen direction because it
has no composite pair (`undo-ancestry-cycle`, bounded model probe).
The preflight must track the live resolver's semantics: changes to page
provenance or canonical lookup require updating both paths and running
their semantic regressions together.
It resolves the child in its retained source page and the parent in the
directional destination page, including page additions/removals earlier
in the same replay. Missing-page changes are skipped individually before
cycle checks. Virtual page roots track departing-page state on selection;
lazy roots are decoded into private copies so rejected edits cannot
materialize or normalize the live page (`revived-ancestry-cycle`).

Terminal repair positions are captured in unscaled graph coordinates,
but `mxGeometry` terminal points are relative to the edge parent. The
terminal replay subtracts the parent's absolute origin before writing
both the immediate point and the post-edit repair queue. Otherwise an
edge inside a translated group jumps by that group's offset on every
client and in the saved file (`nested-undo-endpoint`: nested groups,
source/target, zoom/translation and compound geometry replay).

The first execution of every change is transparent (fresh references
by construction, live-reference fast path = one map lookup) — a
pasted cell with a colliding id must reach `cellAdded`'s rename, not
be redirected. Cross-page replays resolve through a read-only tree
search in their own root (no mxGraphModel wrapper — its cellAdded
sweep renames colliding ids). Regression scenarios: `undo-stale`
cases 1-9 (case 9 is the resolution proof; the random repro is
destroyed by any probe's timing shift).

Cell history also retains its owning **file object and page ID**, captured
before its first mutation. A remote page deletion and undo replaces the
`DiagramPage` and its root; searching an old root by cell ID updates only
the abandoned tree. Replays first resolve the current owning page, then its
cells, including when a different page is selected. A runtime WeakMap keeps
provenance for detached subtrees; no cell or serialized XML gains metadata.
Child changes keep separate source/destination contexts. Replays invalidate
the affected page's XML cache, while the normal change listener derives the
dirty page from the canonical changed objects. A restored edge's endpoints
are canonicalized after sibling restorations, and inbound-edge capture and
restoration use that same page rather than the current model's cell map.

A missing page makes its **cell changes inert**, advancing their frozen
direction without mutating its abandoned objects or entering missing-parent
fallback. Other pages in a composite still replay. An explicit page-delete
undo retains its existing restoration semantics. Once the same page ID is
restored in the same file, retained history applies its original intentions
to the live cells, including overwriting intervening peer values. This does
not change the existing cell-level structural resurrection policy (such as
undoing a local deletion); treating a same-ID page as a different incarnation
would require an additional identity or deliberate history invalidation.
`page-revival-undo` locks these semantics and offscreen saved readback.

A `SelectPage` replay (also the select part of a `ChangePage`) walks
by DIRECTION: the undo returns to the page viewed before the first
execution, the redo to the target, each resolved by id; a destination
outside the document keeps the current page. The base toggle
(`previousPage` is the next destination, swapped on every executed
switch) broke as soon as one replay was inert — its destination stayed
put and the next replay walked the wrong way. In the undo of a
wholesale replacement the inert step is the rule, so the redo of a
restore ended on the last page (`restore-undo`); the redo of a page
insert after a peer re-inserted the page stayed on the old page
(`undo-stale` case 6). A current page that a replay left outside
`ui.pages` is healed ONCE per undo/redo (`EditorUi.healCurrentPage`
in `EditorUi.undo/redo`), not per replayed `ChangePage`: the undo of
a restore passed through one such state per page and rendered each
(`phantom-current-page` holds the heal, `restore-undo` the single
page switch per undo and redo).

The replay severing of live inbound edges (`repairEdgeRefs`) runs for
replays only — on a first execution `removeCells` has already
disconnected everything that stays — and every repair refreshes the
view ONCE per undo/redo (`drainRepairPoints` clears the touched states
and validates once; a `graph.refresh` per severed edge made the undo
of a 1000-cell delete take 13 s, `perf-gate` `deleteUndo`).

Wholesale replacements (`replaceFileData`: revision restore, external
merge, conflict path) are ONE undoable step. The removes are recorded
before the inserts: the page replays resolve by id and a restore
re-materializes the same ids, so with the inserts first the undo
skipped the old pages as "already present" and then removed their
restored twins — an empty document, flushed to every collaborator
(`restore-undo`, `editor-semantics` `restore-file-data`). The viewed page stays selected
when the new document holds a page of the same id (a restore keeps
the page ids), matching the collaborators who receive the replacement
as a patch; otherwise the first page is selected (`restore-undo`).

## Version gating (PROTOCOL 7)

Every message carries `v` (protocol) and `av` (app version).
`msg.v > local` → update dialog; `msg.v < local` → payload ignored +
file fallback. PROTOCOL bumps also on SEMANTIC incompatibility (v7:
v6 clients produced checksum-valid but wrong saves — page loss under
crossing moves, adoption reverts — undetectable by self-healing).

The gates live in ONE place, `DrawioFileSync.handleRemoteMessage`, and
EVERY transport enters through it: the cache/pusher channel via
`changeListener` and the socket via `P2PCollab.processMsg` (both the
`diff` and the `notify` case). This is load-bearing, not tidiness —
the gates used to sit inside `changeListener` alone, which production
live diffs never traverse (they go over the socket), so the semantic
protection the v7 bump exists for was absent exactly where it ships
while `mixed-version` certified it on the cache path. Locked by
`p2p-version-gate`, which drives the REAL P2PCollab.

**The payload field is `p` since v7 (was `d`)**, and that rename is the
protection for the already deployed v6 clients, which the gate above
cannot reach: their socket path hands `msg.d` to
`receiveRemoteChanges` / `handleMessageData` without any version check,
so a v7 payload under the old name could be applied with incompatible
semantics. With no `d` those handlers throw inside their try/catch and
ignore the message. The old decoder first inflates UTF-8 correctly, then
unconditionally URI-decodes it: Unicode survives, `%41` becomes `A`, and
bare/malformed percent text can throw before any version check. A cache
notification can prompt an upgrade only if decoding succeeds and the
notification reaches that tab. Cache catchup rejects incompatible patches
by reloading **file data**, which does not replace old JavaScript.

`rollout-mixed-source` loads the entire pinned v6 application alongside
candidate v7 clients and exercises their real P2PCollab and codecs with
AES on/off. It checks live isolation and exact saved labels, with an
unsafe `d`-envelope control proving the old colour-only adoption/save
corruption. `mixed-version` remains a same-source gate test; changing its
protocol constant does not substitute for historical code. Neither the
rename nor a socket policy prevents old direct-provider writes. Follow
[realtime-rollout.md](realtime-rollout.md) before activating shared files.

The conflict state is gated there as well: while a rejected save is
being reconciled (412 until the catchup's merge clears
`file.inConflictState`) only live diffs (`p.a == 'change'`) pass, since
they touch the visible and the remote pages, which the save conflict
does not; a notify or descriptor message waits, it would start a
second catchup chain. Every message used to be dropped in that state,
in `changeListener` and in `handleRemoteMessage`, so an insert sent
into a peer's conflict window (a second or more, on every crossing save
of two autosaving clients) reached that peer only through the sender's
save into the own pages and then waited for the cleanup behind the
grace period - a production find of an insert visible after 70 s
(`conflict-window-diff`; the harness save stub models the state on
412 like the providers do).

Two more receive-side rules from the 2026-09-10 review: a notification
deferred during a save (`remoteFileChanged`, `remoteDescriptorChanged`)
is replayed on BOTH save outcomes (`flushRemoteFileChanged` and
`flushRemoteDescriptor` from `handleFileError`, the success path from
`handleFileSuccess`), and the receive batch applies every message in
its own try/catch (`receiveRemoteChanges`) so one failing message does
not silently drop the rest of its batch (`deferred-notify`,
`batch-isolation`). Late joiners receive unsaved live content only from
a peer that was alone (`sendUnconfirmedChanges` on the first peer); the
socket protocol replays nothing, so a third client waits for the next
save (bounded, documented in the harness README).

Cursor and selection are deliberately NOT gated. They are view state,
never enter the model, own pages, snapshot or file, so a version
mismatch cannot corrupt anything through them; gating them would make
an outdated collaborator invisible while they keep editing and saving,
which is worse than seeing where they are. Asserted by that scenario's
phase 2b.

`DrawioFileSync.prototype.minRemoteAppVersion` (default null)
additionally gates on `av` at message and catchup level via
`isRemoteAppOutdated`, degrading affected senders to file sync.
It is set by `fast-rt` admission responses and policy changes. Joins
advertise `pv` (protocol) and `av` (numeric app version). The worker stores
an authenticated per-document minimum in Durable Object storage, drains
incompatible open connections and rejects reconnects and relays. Missing
metadata is rejected when a policy is active; no policy retains legacy
behavior. Versions are compatibility claims, not user authentication.

A new client receiving `upgradeRequired` or close code 4001 latches
`file.appUpgradeRequired`, stops collaboration/autosave and refuses new
base save requests, including overwrite and a save waiting for fonts.
Canceling the upgrade preserves the modified model for local export;
queued receive batches and file catchup remain stopped. Saves already
past the base preparation callback, provider requests already in flight,
and old clients that lack this code are outside that local guard. The
operator still needs a writer-retirement procedure at the storage boundary.

## Wire encoding (since PROTOCOL 7)

`objectToString`/`stringToObject` deflate the message JSON directly
(UTF-8) instead of the legacy `deflateRaw(encodeURIComponent(json))`
— ~10-14% smaller payloads, ~2x faster codec (jgraph/drawio#584).
The optional AES layer wraps the base64 unchanged. `stringToObject`
still reads legacy payloads (cache entries written by older clients
survive a deploy): after inflate, URI-encoded JSON starts with `%`,
direct JSON with `{`/`[`. The FILE format (`Graph.compress`) is
deliberately untouched. The rt-test broker transports the real
encoding sender-frame → receiver-frame, so every suite run exercises
the codec cross-realm.

## Write revoke (permanent 403)

A client that loses the write permission mid-session keeps sending
live diffs, but no save can ever confirm its changes — by the
single-source-of-truth model they are invalid.
`DrawioFile.handleWriteRevoked` (triggered from `handleFileError`
via `isWriteRevokedError`, provider-refinable) rolls the visible
document back to the last confirmed file state, sends the
retraction as a final live diff (it carries the file state, so it
only aids convergence), clears the undo history, aligns
`theirPages` and marks the file read-only (`writeRevoked` gates
`isEditable`). Transient save failures keep the retry path.
Regression scenarios: `write-revoked`, `revoked-child`,
`revoked-descendants`. Retraction keeps
ancestors needed by foreign descendants, including inside a retained new
page, while removing own-only branches. A peer can later confirm content
already adopted into its own pending page; revocation does not undo that
ownership transfer.

File variables need separate ownership because the page copies omit them:
`file.pendingFileVars` remembers the value displaced by the current own write,
including null; a foreign vars write supersedes that ownership even if
its string is identical. Revoke includes only that pending `f.vars`
retraction, preserving a newer peer value. Cached and optimistic saves
confirm vars extracted from their actual saved bytes (also from embedded
mxfile data in SVG/HTML), and only advance the ownership interval present
when the write was serialized. Unflushed vars edits during a save remain
diffable. Ownership is recorded by `fileChanged` before a sync object needs
to exist, so RT-off edits and removals survive realtime off/on. A save without
sync also confirms its serialized interval. Reconnect resends include only
this pending attribute (including null), never an adopted foreign value.
Authoritative file replacement clears ownership. Regression `revoked-file-vars` seeds 1–20
assert the live attr and the next authorized peer's saved bytes.
Side find: `patchCell` now
applies `style: null` (style removals were unpatchable, which left
any rollback to a style-less state silently incomplete).

## Notifications and metadata catchup

Timestamp notifications retain their payload so `type: 'optimistic'` selects
retrying reads. A receiver saving its own file retains this hint until success
or failure completion replays the notification; a plain later notice cannot
erase a deferred optimistic hint. The regression requires an old-revision read
before the remote write becomes visible, then adoption without another notice.

For a different saved revision, a matching page checksum is insufficient to
fast-forward the descriptor: names, page format, folding and file vars are
outside that hash. With cache patches unavailable, catchup must read and merge
the saved bytes. This adds a full-file read in that mode and preserves both
remote metadata and pending local vars. Cached patch catchup is unchanged.

## Self-healing boundary

Checksum verify + reload heals structural DIVERGENCE between clients.
It cannot heal consistently-wrong saves (checksums prove agreement,
not correctness) — that class is closed by the protocol bump, not by
the fallback.

## Testing

`etc/rt-test`: 49 scenarios × seeds and 9 verdicts (the scenario table
and the full finding history live in `etc/rt-test/README.md` — keep the
counts there, not here). Random mix includes undo/redo, per-PID
results, `--extra clients=8` for stress and `--extra timing=real` for
production timers. Run the real-timing pass before landing anything:
the mock timers set the sync's wallclock timers to infinity, so a whole
class of ordering bugs is invisible to the default sweep (the
current-page heal that corrupted `replaceFileData` was caught there and
nowhere else). Permanent locks: single-pass-cleanup existence lock,
page-order-race, page-adoption-race, adoption-edit-race, undo-stale,
live-page-insert-revert, poison-live-diff, phantom-current-page,
p2p-version-gate, roundtrip property test (3000 permutations) for any
walker change.
