# Realtime sync multi-client test harness

Automated, seeded, repeatable multi-client tests for the fast-sync
(realtime) stack in `js/diagramly/DrawioFile.js` / `DrawioFileSync.js`.
Built as the regression gate for snapshot/flush optimizations (incremental
snapshot patching, dirty-page flush): the sweep must be green before and
after such changes.

## How it works

`orchestrator.html` boots N **full draw.io apps** as same-origin iframes
(`?dev=1&test=1&sockets=0`), swaps a realtime-enabled `LocalFile` test
double into each (`isRealtimeSupported=true`, no-op autosave, simulated
async save) and replaces the transport with a parent-side **broker**:

- Outgoing live diffs are captured via a fake `p2pCollab.sendDiff` (the
  real `doSendLocalChanges` branch) and delivered to the other clients
  through the real `sync.receiveRemoteChanges` (exercises the batch
  window, per-sender msg-id sort and duplicate dropping).
- Saves run the real chain `save -> updateFileData (flush + createData
  from ownPages) -> fileSaved -> sync.fileSaved`; the harness computes
  the save diff like the cache-enabled branch (`diffPages(shadow,
  pages)` + checksum) and the receivers apply it through the real
  `sync.merge` (checksum verify + `patchRealtime` into ownPages). This
  is the production path that advances receiver `ownPages`; without it,
  `cleanup` reverts everything (verified while building this).
- Delivery policy per scenario: per-message delay, cross-sender (and
  optionally same-sender) reordering, duplicates. All randomness is
  seeded (mulberry32) — a failing run reproduces exactly from its seed.

Wallclock timers of the sync (flush debounce, cleanup delay, autosave)
are set to infinity; the scenario script drives flush/cleanup/save
explicitly, so timing is adversarial by construction, not by luck.

Ops per round and client (through the real editing APIs, so change
events, undo history and the sync listener behave like user edits):
nested vertices/containers (`addChild`), edges with terminals,
style/geometry/label updates, cross-parent moves, subtree deletes, page
insert/rename/switch, conflicting concurrent edits on the same cell
(style/label/geometry/delete-vs-edit), and reactive-layout content:
stackLayout List containers (`addStack`) plus reorder/resize/relabel/
insert of their children (`stackChild`), so mxLayoutManager fires on
the live model during patches (the 'Snapshot out of sync' bug class).
containerType=tree ops are deliberately deferred while Trees.js is
being modified in a parallel work stream.

## Verdicts (all must hold at quiescence)

1. **Convergence**: canonical XML of every client's pages is identical
   (plus `getHashValueForPages` equality).
2. **Snapshot invariant**: `diffPages(sync.snapshot, ui.pages)` empty on
   every client without pending local changes (echo-loop precondition).
3. **Realtime alignment**: `ownPages == ui.pages` and
   `theirPages == ownPages` per client.
4. **Echo probe**: three idle flush+cleanup rounds must produce zero
   outgoing messages and zero visible patches.
5. **Marker liveness**: non-conflict cells exist on all clients or none.
6. **No errors**: `window.onerror`, `EditorUi.logError`, `ui.alert`
   (catches the mid-run test=1 snapshot assertion in DrawioFile.patch,
   which fires BEFORE the quiescence anchors heal the drift) and
   merge/save/cleanup error callbacks all fail the run.
7. **Render consistency**: converging models are not enough - the
   screens must show them. Every visible cell of the current page has
   a view state, edges with both ends determined render with non-null
   endpoints, and no state survives for a cell that left the model
   (the invisible-edge manual find: a repair mutated without
   invalidation, the models converged but one screen kept the edge
   invisible). Fail details carry map/children membership bits
   (edge=/src=/trg=, M/m cells map, C/c parent children) so a rare
   timing hit self-diagnoses.
8. **History shape**: a remote patch never changes the undo history
   LENGTH, and one undo or redo moves the index by exactly one (see
   the findings below).
9. **Current page**: `ui.currentPage` is an element of `ui.pages` on
   every client. A page that left the document still renders and
   accepts edits, but they belong to no page in any diff, so they
   reach neither a flush nor a save and vanish without a trace when
   the next patch heals the dangling reference - invisible to every
   content-comparing verdict, because all clients agree on the loss.

10. **No checksum reloads**: `stats.reloads` must stay within
   `reloadBudget` (0 everywhere today). A checksum mismatch answers
   itself with a reload, so no error hook fires and every content
   verdict then runs on the HEALED state - the primary detector for
   "an exact patch path invented something" was switched off. Measured
   before locking: the whole matrix and both real-timing sweeps do
   exactly zero reloads.
11. **Saved file**: the persisted bytes, read back and canonicalized,
   hold the converged document. Every other verdict compares live
   clients to EACH OTHER, so a save that consistently omits or
   scrambles content produces receivers that agree with the sender and
   the suite stays green. `skipSavedFile` opts a scenario out;
   `desktop-merge` uses it because it merges external file versions
   straight into the file, which never pass the broker.

The verdict is a JSON object (`window.__RT_RESULT`, `document.title`
RTPASS/RTFAIL, POSTed to the runner) with seed, stats and failures.

## Running

Headless sweep (regression gate):

    node run.js                          # default: 5 scenarios x seeds 1-5
    node run.js --scenarios nasty --seeds 1-50
    node run.js --serve-only             # server only, for browser runs

Failing seeds print a repro URL; per-run JSON goes to `results.jsonl`.
Interactive repro (watch the clients live):

    node run.js --serve-only --port 8123
    open "http://127.0.0.1:8123/rt-test/orchestrator.html?scenario=nasty&seed=7"

URL knobs: `scenario`, `seed`, `clients`, `rounds`, `ops`,
`skipops=op1,op2`, `report=1` (POST verdict to runner), `grace=<ms>`
(remote grace under `--timing real`, default 0), `trace=always` (trace
in passing verdicts too), `trace=tail` (keep the end of a long trace).

Latency measurement under production timers (numbers, not a lock; the
PASS line prints them, `results.jsonl` keeps them in `stats.latency`):

    node run.js --timing real --scenarios sync-latency --seeds 1-3
    node run.js --timing real --scenarios sync-latency --extra 'grace=60000&typing=20000'

## File-variable lifecycle regressions

The `vars-*` scenarios cover edits first made with realtime disabled,
reconnect resends and ownership/saving controls. Each name selects one
explicit case; seeds do not change its meaning. They supplement the
existing `revoked-file-vars` seeds 1–20 without replacing them. Tracked in
[drawio-dev#685](https://github.com/jgraph/drawio-dev/issues/685).

The original eleven cases exposed seven failures on rt-v7 `1114479d6c`.
They now pass with ownership tracked on `DrawioFile` at local mutation time
and included in reconnect resends. The live and saved-value assertions remain
unchanged. A twelfth case covers a successful save without a sync object,
followed by a new local edit and revocation.

| Scenario | Intent |
|---|---|
| `vars-off-revoke` | RT-off local edit is retracted after rejoin and verified revocation, including after peer save/cleanup |
| `vars-off-reedit-revoke` | A later RT edit must not make the earlier unsaved RT-off value its rollback baseline |
| `vars-off-remove-revoke` | Same sequence with an RT-off attribute removal |
| `vars-off-save` | Authorized save propagates an edit first made with RT off |
| `vars-before-sync-revoke` | Local mutation without a sync object still needs ownership before rejoin/revoke |
| `vars-before-sync-save-revoke` | Saving without sync confirms the rollback baseline for a subsequent local edit |
| `vars-reconnect` | An already-flushed disconnected vars write reaches peers without a save, and the next peer save includes it |
| `vars-reconnect-remove` | An already-flushed removal is explicitly resent as null |
| `vars-reconnect-unflushed` | A not-yet-flushed vars write is sent by the reconnect's initial flush |
| `vars-reconnect-foreign` | Three peers: an equal foreign write supersedes ownership; stale adopted vars must not overwrite a later peer value during resend or save |
| `vars-p2p-reconnect` | Actual P2PCollab drop/rejoin and first-peer callback resends flushed vars without a save |
| `vars-save-interval` | Old save completion cannot change the rollback base of a fresh local interval opened after a foreign write |

Run the full focused group:

```sh
node run.js --scenarios vars-off-revoke,vars-off-reedit-revoke,vars-off-remove-revoke,vars-off-save,vars-before-sync-revoke,vars-before-sync-save-revoke,vars-reconnect,vars-reconnect-remove,vars-reconnect-unflushed,vars-reconnect-foreign,vars-p2p-reconnect,vars-save-interval --seeds 1 --extra trace=always
```

Repeat with `--timing real`. These cases deliberately hold automatic
storage saves in **both** timer modes so autosave cannot hide the missing
resend. Production flush, receive, cleanup and reconnect timers still run;
explicit saves use the normal harness save chain. The save-interval case
holds success at `fileSaved` until the foreign and new local writes have
occurred, instead of relying on a fixed save latency.

Every case checks file-node attrs, resolved `%reviewVar%` labels and
actual saved XML. Page checksums alone do not cover file vars. The
tests click File Properties → Edit Data and apply a value edit through
its temporary model, exercising the real file-vars mutation callback
without typing into the data form. `vars-before-sync-revoke`
temporarily detaches sync at mutation time; `vars-before-sync-save-revoke`
also saves while detached. Neither simulates a fresh provider bootstrap.
`vars-p2p-reconnect` uses real P2PCollab with the fake socket server; other
cases use the broker. No live provider or deployed socket service is used.

The foreign control deliberately avoids inventing an extra live write to
simulate an unsafe implementation: it exercises the real resend method.
It catches a future UI-minus-shadow shortcut by requiring B/C's newer value
to survive both that resend and B's save.

## Scenarios

| Name | Clients | Delivery | Notes |
|---|---|---|---|
| instant | 2 | in-order, no delay | sanity baseline |
| jitter | 3 | 90ms jitter, reorder, 10% dup | laggy flushes (30% skip) |
| reorder | 3 | cross-sender reorder, 15% dup | + duplicates |
| conflict | 3 | 60ms jitter, reorder | conflicting edits every round |
| nasty | 3 | 130ms jitter, cross-sender reorder, 20% dup | + saves racing live traffic |
| layout-race | 2 | scripted, in-order | deterministic stackLayout incident repro (below) |
| adoption-race | 2 | scripted, in-order | ownPages adoption of unsaved remote containers, then the creator merges and saves over the adopter's save (stale-copy collision) |
| layout-passive | 2 | scripted, in-order | passive client saves last while the layout runner never saves (stale-layout-in-file incident) |
| page-order-race | 2 | scripted, in-order | entangled crossing page moves; pre-rebuild the patchPages chain walk dropped one page per client |
| page-adoption-race | 2 | scripted, in-order | adopted unsaved page: creator merges the adopter's save; content must survive merge and next save |
| page-adoption-edit-race | 2 | scripted, crossing save | newer label/style edits (including style removal) inside an adopted page survive crossing saves and disconnected catchup; independent creator fields/cells merge and assertions cover own pages, persisted bytes and final state |
| live-page-insert-revert | 2 | scripted, crossing window | a colliding PAGE insert on the live path must stay a skip and must merge additively on the save path; also locks that a page created and drawn on without a switch carries its cells in the insert |
| phantom-current-page | 2 | scripted, in-order | a page-switch replay whose target a peer deleted stays inert, but must not leave the client viewing a page that was just spliced out |
| detached-subtree-undo | 2 | scripted, in-order | replays resolving against a subtree a peer removed: the frozen parent inside a removed ancestor must fall through to the live model instead of passing for a foreign page, and the revived-subtree prune must resolve in the destination tree |
| repair-adoption | 2 | scripted, in-order | injected (unconfirmed) content must not become durable through the edge repair: the repair of an unconfirmed cell stays out of the flush and the own pages |
| signal-impersonation | 2 | REAL P2PCollab on the fake socket server | a relayed WebRTC signal carries the server-stamped sender, not the payload's claim; the receiver keys its peer connection and roster on it |
| poison-live-diff | 3 | scripted, hostile input | malformed but decodable live diffs delivered through the production entry: none may throw out of the batch timer, the receive latch must stay drained and the channel must keep carrying legitimate traffic |
| p2p-version-gate | 2 | REAL P2PCollab on the fake socket server | the protocol and app-version gates on the transport production actually uses; presence (cursor/selection) must survive the payload gate |
| adoption-edit-race | 2 | scripted, in-order | edited-later LWW: local edit flushed after the incoming save was computed must win the colliding merge |
| editor-semantics | 2 | scripted, in-order | base editor behavior: 18 fundamental ops (vertex/edge/connect/reconnect/waypoints/delete incl. delete with connections and delete of a collapsed group/group/reparent/order/style/label/geometry/paste/page ops) each survive op -> undo -> redo -> undo by exact XML compare |
| undo-stale | 2 | scripted, in-order | undo/redo replays after remote delete/replace of the referenced objects: execute-time resolution repairs them (canonical redirect, transient terminal points, no-op page replays) - cases 1-10; case 9 proves the redo reconnects to a re-added terminal, case 10 that a null intention stays a legitimate disconnect/remove |
| undo-ancestry-cycle | 2 | scripted, in-order | cyclic container-drag replay skips the composite and its opposite; frozen retries, mixed reparenting, ordered composites, custom siblings and page identity |
| revived-ancestry-cycle | 2 | scripted, in-order | combined page revival and cycle rejection: canonical lookup, private lazy-root preflight, safe retry and independent live-page edits while the conflicting page is absent |
| page-revival-undo | 2 | scripted, live and save delivery | cell history follows a remotely revived page by stable page/file identity: properties, terminals, reparent, intentional deletion restore, absent-page no-ops, repeated replay, ordinary navigation, matching IDs across pages, canonical foreign-page inbound edges, mixed-page edits and offscreen saved readback |
| nested-undo-endpoint | 2 | scripted, in-order | missing-terminal undo keeps the original rendered attachment in edge-parent coordinates; source/target, nested groups, zoom/translation, compound drag-disconnect, repeated replay and persisted XML |
| rollout-mixed-source | 3 | real historical v6 + candidate v7; fake sockets/storage | p-envelope isolation, Unicode/percent saved bytes, old unsafe adoption control, cache/fallback behavior, upgrade cancellation/export, save preparation and reconnect denial |
| mixed-version | 3 | scripted, in-order | v6 simulant among v7 peers: live diffs gated both ways (redirect latch on the old client), convergence via the save cycle; plus the minRemoteAppVersion av gate |
| join-mid-session | 3 | scripted, in-order | late joiner: saved base + live-log catchup (production cache role), then full participation with the unsaved live diffs visible |
| desktop-merge | 2 | scripted, in-order | non-realtime mergeFile branch (desktop watcher, drawio-desktop#2382): external remove/re-insert vs preserved undo history; ghost/duplicate/dangling scans (the full rollback+echo red repro and the stale-rewrite guard live in `desktop2382/`) |
| drill-in | 2 | scripted, in-order | peer deletes the drilled-into container (currentRoot is transient view state pointing at a dead object) |
| collapsed-insert | 2 | scripted, in-order | remote insert into a collapsed container must render after expanding (the render verdict skips collapsed subtrees) |
| edge-label | 2 | scripted, in-order | relative-geometry edge label moved, peer deletes the edge, replays across death and revival |
| page-delete-undo | 2 | scripted, in-order | page delete raced by edits on that page, then undone; both fates of the raced edit must agree across clients |
| cross-page-undo | 2 | scripted, in-order | undo fired from another page repairs into the edited page's tree while the peer deleted the target |
| group-race | 2 | scripted, in-order | group/ungroup replays raced by a peer moving a member out |
| dual-resend | 2 | scripted, in-order | both clients edited while mutually unjoined; the crossed resends must keep both sides |
| revision-restore | 2 | scripted, in-order | wholesale restore of an older revision racing live peer edits (RevisionDialog path incl. fileRestored) |
| web-echo | 2 | scripted, in-order | client with pending local changes receives a save echoing its own earlier content |
| p2p-join-race | 2 | REAL P2PCollab on the fake socket server | lost newClient: phase 0 proves the roster deadlock with the announce disabled (built-in red proof), phase 1 proves announce + resend heal it |
| p2p-offline-rejoin | 2 | REAL P2PCollab on the fake socket server | socket drop mid-edit; rejoin backoff + first-peer resend must deliver the offline edits without any save |
| hostile-content | 2 | scripted, hostile input | labels, user objects, styles and file variables are parsed and RENDERED on every receiver: entity expansion, external entity, script in label and user object, javascript/data image and link styles, hostile file variables through a placeholder. Asserts nothing executes, nothing lands in the DOM as a handler or javascript: url, no pollution and bounded parse time |
| delivery-matrix | 2 | scripted, three delivery paths | the same structural sequence (reparent, peer delete, peer revive, redo) over live, save+cleanup and duplicate delivery - the path decides whether a cell keeps its object identity, and all paths must produce the same end state. `resend` is deliberately not a path: after a delete and its undo the peer holds nothing unconfirmed against the file |
| remote-grace | 2 | scripted, in-order | live-delivered content is HELD while its sender can still save it (cleanups during the grace period must not touch it), and dropped once the grace passed without confirmation |
| transient-revert | 2 | scripted, in-order | the documented transient revert as an assertion: a cleanup before the sender's save may revert live-delivered content, but the save must bring it back and the peer's own flushed work must survive |
| restore-undo | 2 | scripted, in-order | undo across a wholesale file replacement (the history spans the restore, so the replays run every repair path at once); nothing may exist twice and the session must keep syncing; the viewed page (not the last one) survives the restore, comes back with the undo and again with the redo, one page switch each |
| adversarial-patch | 3 | scripted, hostile input | eleven malicious patches over the collab channel (prototype-pollution keys, root/layer removal, duplicate ids, broken previous chains, wrong types, garbage geometry); receiver must survive unpolluted, innocent clients keep syncing, and the cleanup must remove every injected cell again so the client converges with the others - hostile content has a bounded lifetime because it never reaches the own pages |
| undo-fuzz | 3 | random, undo/redo boosted to ~half of all ops | autonomous search of the replay-interleaving space (the manual finds were all interleavings no scripted case had anticipated) |
| solo-resend | 2 | scripted, in-order | changes made while no peer was connected are skipped by the transport; the first peer in the roster must get them resent, or two clients loading simultaneously end up with different documents |
| join-visibility | 2 | scripted, in-order | a change broadcast while a peer is still loading never reaches it live; the save merge that finally carries it must reconcile the screen at once instead of leaving the joiner blind until the lazy cleanup |
| stale-resolve | 3 | scripted, cross-sender delay | an adopter's delayed full-cell resolution must preserve the creator's newer label/style/geometry and an adopted edge's newer endpoint, while applying the adopter's new edge/label; assertions run before saves can hide a visible revert. A subsequent real unconfirmed resend must still merge label/geometry/terminal edits |
| write-revoked | 2 | scripted, in-order | client loses the write permission mid-session: a lone 403 stays transient (descriptor verification reports still-editable, retry succeeds), only a descriptor-confirmed read-only rolls the transient edits back, retracts them live and turns the file read-only |
| revoked-child | 2 | scripted, in-order | minimal single-container revoke: the peer child survives live retraction, the next peer save and cleanup (red base loses it permanently) |
| revoked-descendants | 2 | scripted, in-order | nested peer vertices and their edge survive another author's write revocation on a saved and an unsaved page, including the peer's next saved XML and cleanup; own-only branches retract |
| revoked-file-vars | 2 | scripted, in-order; seeds 1–20 select cases | vars retraction after descriptor-confirmed revoke: absent/saved/null values, flushed/unflushed/repeated edits, peer writes before/after/equal to own writes, in-flight cached and optimistic saves, peer confirmation, full-file fallback, realtime toggle, editable SVG/HTML; asserts live attrs and the next authorized peer’s saved bytes |
| currentpage-delete | 2 | scripted, in-order | remote deletes the viewed page (both directions, crossing edits): the viewer lands on a survivor, deletion wins, undo/redo stays inert for the dead page, the session stays editable |
| paste-ids | 2 | scripted, in-order | concurrent pastes mint fresh ids: disjoint ids, exactly-once replication, own paste stays undoable/redoable through a crossing save merge (history entry survives) |
| crash-reload | 3 | scripted + seeded storm | hard crash + reload from last save + live log: unflushed work lost everywhere alike, flushed/saved work survives, fresh history, full re-participation; a committed-but-unacked own save is the reload base |
| revoke-storm | 3 | scripted + seeded storm | 403 revoke mid-storm: rollback and retraction race crossing peer edits; only own changes are retracted, own pages with foreign work are kept, peer histories stay functional, the revoked client keeps receiving |
| perf-gate | 2 | scripted, in-order | order-of-magnitude budgets on diff/patch/hash/undo-redo/e2e flush for a 900-cell page (trips on complexity regressions, not machine variance) |
| offline-rejoin | 3 | scripted, in-order | client offline (dead socket, roster reports disconnected), edits locally, others save; rejoin catches up via the real mergeFile without losing either side |
| root-change | 2 | scripted, in-order | a saved page whose root id changed (an external rewrite; a stray parentless cell no longer causes one, see `stray-root`) is merged by both clients through the real mergeFile: the full re-insert under the new root must pass the checksum, keep content and edge terminals, update the shadow, and the next live edit and save must work on the new root (31.5.0 regression: refusing the still-empty freshly built root failed every root change) |
| stray-root | 2 | scripted, in-order | the saved file is rewritten outside the model with a cell whose parent is not in the page (what external tools produce): both clients must keep the page instead of letting that cell become the root, adopt it into the default layer, and the next save must write a file where it names a real parent |
| lossy-net | 3 | 90ms jitter, reorder, 10% dup, 8% DROP | live diffs vanish, saves always arrive; convergence via save/merge |
| save-fail | 3 | nasty delivery | every 3rd save write fails (injected); file stays modified, later cycles retry |
| conflict-window-diff | 2 | scripted, in-order | a live diff sent while the receiver's rejected save is being reconciled (412 until the catchup merge, `file.inConflictState`) must reach its screen; the save stub models the conflict state on 412 for every scenario |
| deferred-notify | 2 | scripted, unit-style | a file-changed notification deferred during a save (`remoteFileChanged`) must be replayed when the save FAILS, not only when it succeeds; the catchup trigger is counted instead of run (the harness bypasses the notify chain) |
| conflict-budget-optimistic | 2 | scripted, unit-style | isolated save conflicts, each fully recovered by the host's retry and followed by a confirmed save, must never consume the retry budget of a LATER conflict. Runs the real host loop (`sync.fileConflict` -> `fileChanged` -> `catchup` -> retry) against a file with `isOptimisticSync`, the shape of every EmbedFile integration and of `OneDriveFile`: `catchupRetryCount` used to be reset only in `DrawioFileSync.fileSaved`, which `DrawioFile.fileSaved` skips for those files, so the maxCatchupRetries-th conflict OF THE SESSION was refused with ERROR_TIMEOUT without attempting a catchup |
| conflict-budget-cached | 2 | scripted, unit-style | the same sequence on a file that writes a cache patch (the path that always reached `DrawioFileSync.fileSaved`): the control that the reset was only ever missing on the optimistic branch |
| batch-isolation | 2 | scripted, injected failure | a message that throws while being applied must not take the rest of its receive batch down; the failure is reported |
| sync-latency | 2 | scripted, production timers | MEASUREMENT (requires `--timing real`, skipped otherwise): how long the screen stays behind the file while the peer keeps typing - a crossing relabel conflict resolved through the save cycle (`conflictVisibleMs` per client) and a live diff whose sender never saves (`expelMs`); `grace=` and `typing=` URL knobs |
| contradicting-ops | 3 | scripted, in-order | concurrent, CONTRADICTING operations from two active clients with a passive observer: group vs delete, connect vs delete, group vs group, reparent vs reparent, delete vs edit, connect into a deleted group, ungroup vs add child, reconnect vs reconnect, delete edge vs reconnect, three-way (group, delete and connect on one shape). Each case crosses on the live channel and then replays its histories against each other: the crossing undone and redone as a crossing, a follow-up edit per author on the contested cells, undo and redo stepped one client at a time with every step delivered before the next (each replay lands on the peers as a remote change), and everything undone and redone crossing again - 8 phases per case, run plain and with a save racing every delivery (revives and reparents arrive through the save path too). Convergence, singleness and renderable edges are asserted per phase; the quiescence cycles per phase land in `stats.contradicting` |
| contradicting-ops-net | 3 | 90ms jitter, cross-sender reorder, 15% dup | the same cases under adversarial delivery (the seed varies the timing) |

## Known issues found by this harness

- **The conflict retry budget was a lifetime counter on every
  optimistic-sync file** (`conflict-budget-optimistic`,
  `embed-conflict.html`, 31.5.x production, 2026-09-22):
  `catchupRetryCount` is meant to bound the CONSECUTIVE catchup attempts
  of one conflict episode, but it was reset in
  `DrawioFileSync.fileSaved` only - the branch `DrawioFile.fileSaved`
  takes when `isOptimisticSync()` is false. Every file with optimistic
  sync (`OneDriveFile` and the EmbedFile integrations in
  `plugins/cConf-1-4-8.js`, `monday.js`, `nextcloud.js`) never reaches
  it, so the counter only ever grew: the maxCatchupRetries-th conflict
  of the SESSION went straight to the timeout branch, no catchup was
  attempted at all, `error({code: App.ERROR_TIMEOUT})` went back to the
  host, the save was abandoned and the file stayed in conflict state
  (which also stops autosave and makes the sync drop every non-diff
  message). The counter then reset, so the next 14 conflicts worked and
  the 15th failed again. The release telemetry shows the arithmetic: on
  the embed hosts EVERY `conflict-timeout` report lands on an exact
  multiple of `maxCatchupRetries - 1` (14, 28, 42, 56, 70 with the
  default 15; 11, 22, 33, 44 with the 12 the Confluence Cloud plugin
  sets), while Drive, whose saves do reach `DrawioFileSync.fileSaved`,
  reports timeouts at scattered counts and rides 105 conflicts in one
  session without one. A confirmed save now returns the budget in
  `DrawioFile.fileSaved`, which is the one place every file and every
  host integration passes through.

- **One stray cell silently emptied a page** (`stray-root`, 2026-09-21,
  drawio-dev#696): `mxModelCodec.decodeRoot` rooted the model on the LAST
  cell that decoded without a parent. A cell with no `parent` attribute,
  or one naming an id that is not in the page, therefore became the root;
  the real root, its layers and all their content were unreachable from
  it, `updatePageRoot` added an empty layer underneath and the next save
  wrote the emptied page back. Nothing on that path reports anything -
  the model is perfectly consistent, it is just not the file's. Found
  while decoding the checksum report of the 31.5.0 root-change regression
  above, whose page was exactly this shape. The root is now the
  conventional id `0`, else the first candidate that is neither a vertex
  nor an edge, else the first, and the remaining candidates are adopted
  into the default layer in document order instead of being dropped, so
  the next save repairs the file. A page with ONE parentless cell (every
  well-formed page) decodes exactly as before, which is why this needs no
  protocol bump: only malformed files read differently, and the first
  save by a fixed client ends the disagreement permanently. Red-proven -
  on the old decoder both clients lose the content with no error at all,
  and with the root-change fix in place the merge even succeeds while
  doing it.

- **Every page root change failed the mergeFile checksum** (31.5.0
  production, 2026-09-21, `root-change`): `diffCells` re-inserts the
  whole page under the new root id when the root ids differ, and
  `patchPage` builds the new root from its entry WITHOUT children (the
  layers are separate insert entries the walk adds). The guard added on
  2026-08-06 against a hostile empty root insert refused the swap
  whenever the new root had no children - which is every legitimate
  root change - so the walk ran on the old root, nothing was applied
  and the checksum failed (nine "Checksum error in mergeFile" in the
  first 41 h, all with `bytes` about the page size; one decoded
  checksum report was exactly a two-cell re-insert). Root ids change
  through external tools and through `mxModelCodec.decodeRoot`, which
  takes the LAST parentless cell of a page as its root, so a single
  cell with no or a dangling `parent` flips the root (and
  `updatePageRoot` then adds an empty layer, dropping the old content
  on the next save - a pre-existing data-loss hazard, not fixed here).
  Fix: swap the root before the walk, run the collision pre-scan after
  the swap (the old tree is unregistered by then and the pre-scan
  skipped the terminals of the re-inserted edges), and enforce the
  layer invariant AFTER the walk by restoring the previous root. The
  hostile case is now locked in `adversarial-patch` (`root insert
  without children` plus a no-layer assertion after every attack).
  Never generated by the random op mix: draw.io's own editing never
  changes a root id. `checksum-cases.html` (hand-built XML pairs) and
  `checksum-roundtrip.html` (random edits on a fixture) evaluate the
  mergeFile invariant in the current app AND the pinned v6 app side by
  side, which is how the regression was isolated to the patch engine.

- **Delayed cell resolution reverted newer live content** (`stale-resolve`,
  2026-09-14 review): A creates unsaved cells; C adopts them by adding an
  edge or an edge label. Hold C's resolve, deliver A's newer edits to B,
  then release C's older full copies. The generic live insert merge
  overwrote label/style/geometry on A and B. The wire already separates
  `[resolve, patch]`, so receive now uses per-patch merge flags
  `[false, true]` in one patch transaction. Skipped colliding inserts
  must also skip their terminal pass, which otherwise reconnected an
  adopted edge to its old endpoint. The genuine update patch remains
  active, as does `[{}, patch]` unconfirmed resend merging; the scenario
  explicitly proves offline label/geometry/terminal updates still reach
  every client. The wire encoding and the save-merge flags are unchanged.

All three original findings are RESOLVED in the dev tree (2026-07-23,
gate 35/35 across all scenarios x seeds 1-5, verified on a stable tree):

- **Reactive layout deltas** (the 'Snapshot out of sync' incident,
  `layout-race`): broadcasting the deltas as local changes was
  disproved BY THIS HARNESS (self-sustaining correction storm on
  nasty:2 — stack geometry is a function of LOCAL child order, so
  diverged clients counter-correct forever); the landed design absorbs
  the current page's reactive delta silently into ownPages AND
  theirPages and re-clones the page into the snapshot; peers converge
  through their own layout runs, order converges via saves.
- **Stale edge-terminal references** (`jitter:2`, `reorder:4/5`):
  patchPage's remove pass now disconnects surviving edges of removed
  terminals before `model.remove`. Caveat for mixed old/new clients:
  an old client's save can persist a dangling terminal ref that a new
  client's patched shadow nulls -> checksumError reload (safe but
  noisy); dev-only exposure today.
- **ownPages adoption gap** (dropped updates for unsaved remote cells,
  `adoption-race`): fixed in the parallel ownPages-drift stream
  together with an inserts-win insert-ordering precedence in
  patchPages/patchCellRecursive.
- **Stale-copy revert after an adopter's save** (`adoption-race`
  phases 4/5): when a remote save inserts cells that exist locally as
  pending unsaved copies (the creator merging the adopter's save),
  the colliding inserts were ignored, the creator's ownPages kept the
  stale copies and its next save reverted the adopter's changes
  (last-save-wins ping-pong, converged on the stale state, visible
  revert on the adopter's screen). patchRealtime now applies the save
  patches with merge semantics (patchCellRecursive merges colliding
  inserts via diffCell/patchCell and honors the insert's previous
  reference; cells with an insert entry are excluded from the implicit
  order chain) and drops cell inserts from the re-asserted pending
  patch (they never apply — the own pages are the pending diff's base —
  but their previous references would scramble the merged order; cells
  removed by the save patches keep their entries so local copies are
  restored). Exact-diff paths (shadow, checksum verify) and the live
  ui.pages patching keep the ignore semantics: exact diffs cannot
  collide, and on the screen the save patch trails the live diffs, so
  merging there would revert newer live state (duplicate delivery).

- **Page loss under entangled page moves** (`page-order-race`; root
  cause of the "lossy single-pass patchPages" observation): when an
  explicit page move claimed the same predecessor that an existing
  page followed implicitly, the chain walk never reached the displaced
  page and silently DROPPED it from the rebuilt pages array — crossing
  page moves lost one page on each client until a later re-diff pass
  restored it. Resolved by the canonical page-order rebuild in
  patchPages (backbone of unconstrained pages + claimant chains with
  fixed tie-breaks, mirroring patchCellRecursive): every existing
  non-removed page is retained by construction, explicit previous
  references win over the implicit order, orphaned chains append
  deterministically. Colliding page inserts still merge in place;
  only with mergeInserts does the insert reposition the page.

- **Adopted-page ping-pong** (`page-adoption-race`; the page-level
  sibling of the stale-copy revert): two stacked defects. (1) The
  colliding page insert content merge was a silent no-op — the
  pages-level diff was passed to patchPage's cells parameter — so an
  adopter's saved page content never reached the creator's own pages;
  the creator's next save reverted the adoption. Fixed by unwrapping
  the page's update entry, applied ONLY under mergeInserts: on the
  live path the no-op is load-bearing (a colliding insert there is a
  trailing stale re-assertion, eg. a flush's resolve patch — merging
  it would revert fresh cells, verified by this scenario's live
  ping-pong pre-fix) and is now an explicit skip. (2) Pending PAGE
  insert entries were re-asserted after the save patches; the
  page-level stripPendingInserts analog now drops them with the same
  removed-page resurrection as the cell level.

- **Dangling terminal via crossing remove windows** (8-client stress
  soaks with per-round conflicts, ~1/30 runs: `lossy-net:2`
  `m7_275.source=m2_35`, `nasty:2` `m2_113.source=m5_104` — the
  terminal there itself an edge; never reproducible solo): the remove
  pass disconnects surviving edges via the removed cell's edge list,
  but crossing windows under loss and reorder (an adoption echo
  re-materializes a removed edge while its terminal still lives
  locally, the terminal is removed through another window that no
  longer knows the edge) leave a dangling terminal OBJECT that diffs
  and clones cannot represent — the snapshot clone drops it, the
  flush asserts on the permanent field residue. Fixed by the terminal
  sanitizer behind the remove pass: any edge whose terminal is no
  longer the model's object for that id is disconnected. Locked by
  `undo-stale` case 5 (planted mxCell-level detach, mirrored in the
  snapshot; an unsaved plant is masked by B's adoption echo - save
  first). Verified: 3x30 stress soaks 90/90 (previously 1 hit per 30).

- **Stale-undo restoration** (`undo-stale`; found by the soak's
  dirty-tracking assertions as jitter:13 / reorder:13, 2026-07-24):
  the undo history holds cell OBJECT references, but remote patches
  removed or replaced objects of the same id without ever invalidating
  the history. Undoing such an edit restored stale objects, in three
  flavors: a reconnect undone after a remote subtree delete restored
  the deleted terminal as a dangling reference (unrepresentable in
  diffs and clones — permanent snapshot divergence, flush assertion);
  an order change undone after a remote delete + resurrect re-added
  the old object while the id was taken, yielding a duplicate id in
  the tree (cross-page undo: `parentForCellChanged`'s contains checks
  run against the CURRENT page's root, so no `cellAdded` collision
  handling runs) or a ghost cell silently renamed by `cellAdded`'s
  id-collision loop (`m0_30` -> `2`) on the next root sweep. The
  duplicate was cloned into the snapshot by the flush advance and
  healed on screen by the rename — diverging all copies. Pre-existing
  production bug, exposed by the new op mix. Fixed at the root:
  `DrawioFile.patch` collects the ids of cells the patch actually
  removes (with subtrees) or newly materializes (colliding inserts
  excluded — they keep the local object) and drops the undoable edits
  referencing those objects (`invalidateReplacedEdits`); page-level
  removes clear the history. Extremely timing-sensitive to reproduce
  randomly (any probe turned the runs green); the scripted scenario
  pins both flavors deterministically.
  SUPERSEDED 2026-07-27: the drop-based invalidation was replaced by
  execute-time repair (history stays complete, references resolve
  fresh per replay - see realtime-sync.md, undo-stale case 9).

- **Edited-later changes inside an adopted page** (`page-adoption-edit-race`):
  a whole-page pending insert hid cell edits from the cell-insert freshness
  check. A crossing creator save merged its old label/style over those
  edits, and stripping the pending page insert erased the only remaining
  copy before the adopter's next save. The merge now extracts cell fields
  that differ between remote and own pages and still match the visible
  state, then replays them after the additive save merge. Other saved
  fields on the same cell, new cells and the incoming page order still
  merge. The scenario runs label, style and style-removal edits with the
  adopter's live message delivered both before and after the creator save;
  two more cases lose connectivity after flushing and catch up through
  `mergeFile` before the RT channel rejoins. All eight check editing intent
  in own pages, saved bytes and final documents. This field-level check
  does not need the cell-insert veto's connected-only guard: unchanged
  stale fields have no delta from the remote copy.

- **Edited-later LWW race** (`adoption-edit-race`): local edits
  flushed after an incoming save was computed were overwritten by the
  colliding insert merge (the older saved value won and nothing
  re-broadcast the newer edit). patchRealtime now computes a merge
  veto for pending insert cells whose own copy equals the visible
  state (= fresher than the save) and the collision keeps its skip
  semantics for those cells. Connected-only: without live peers own
  trivially equals ui and the veto would disable the stale-copy
  merge.

- **Offline catch-up stripped missed cells from the screen**
  (`offline-rejoin`): mergeFile appends patchRealtime's return value
  to the visible patches so LOCAL deletes of remote shapes win on
  screen — but it returned the raw shadow-vs-ui removes, and after a
  disconnect the cells saved by others while away are absent from
  the visible pages WITHOUT being locally deleted: the merge removed
  its own additions right again (own pages and file stayed correct,
  the user just did not see the content until the next cleanup).
  patchRealtime now returns the theirPages-filtered removes
  (extractLocal): locally deleted remote cells reached theirPages,
  missed cells never did.

- **Write-revoke left file variables behind** (`revoked-file-vars`):
  the retraction diff covered pages and cells only, so a revoked
  writer's `mxfile vars` remained live and was persisted by the next
  authorized peer. Vars now keep their own pending ownership interval:
  the first own write remembers its displaced value (including null),
  later own writes retain that base, and any foreign vars write clears
  ownership even when its string is equal. Revoke adds the pending
  `f.vars` retraction; vars remain one whole-string last-writer-wins
  attribute, without per-key merging. A known interval survives a
  realtime off/on transition; authoritative file replacement clears it.
  Successful cached and optimistic saves confirm the vars in the
  actual saved bytes, including the inner mxfile in editable SVG/HTML,
  not an edit made while that write was in flight. A pending edit stays
  diffable, and a late save only advances the interval it serialized,
  never the base of an intervening foreign write.
  Seeds 1–20 select: absent base, unflushed edit, removal, earlier peer,
  later peer, equal peer, repeated own edits, unflushed in-flight edit,
  earlier peer removal, no pending edit, flushed in-flight edit, peer
  then own edit during save, peer confirmation, full-file value,
  full-file removal, optimistic confirmation, optimistic in-flight
  edit, realtime toggle, editable SVG, editable HTML. The harness's
  simulated save diff now includes vars from the persisted bytes,
  since page XML/checksum comparisons cannot detect this class.

- **Write-revoke retraction ate foreign work** (`revoke-storm`,
  seeds with crossing traffic): handleWriteRevoked diffed the VISIBLE
  pages against the shadow, so the rollback patch carried removes for
  the peers' unsaved live edits — visibly retracting their work on the
  revoked client and broadcasting r-ids that hit the peers' histories —
  and own unconfirmed PAGES were removed even when peers already had
  unsaved work on them. Fixed: the retraction diffs ownPages vs shadow
  (own changes only), own unconfirmed pages that carry foreign work are
  kept (only the own cells on them are retracted; the next saver
  confirms the page) and theirPages keeps the foreign state instead of
  falling back to the file state.

- **Write-revoke removed foreign descendants through their own ancestors**
  (`revoked-child`, `revoked-descendants`): even an own-only removal list recursively deleted
  peer cells nested inside the author's unsaved containers. The rollback now
  retains just the ancestor chains required by visible cells absent from the
  author's own pages. This applies both to saved pages and to new pages kept
  by the existing page-level protection. Own-only sibling branches still
  retract. The scenario checks nested geometry and edge connectivity before
  and after the peer saves, plus the saved XML itself.

  The minimal persistence check also exposed an adoption-order defect: the
  local insert is initially patched before its missing remote parent is
  adopted, so the insert is skipped. Resolving only the parent leaves the
  last child/edge of the flush absent from own pages and the next save.
  The resolver now adopts a locally inserted cell that is still in the
  residual own-to-visible insert map together with its ancestor chain.
  Both regressions assert local content is present in own pages before
  revocation; the nested case inserts its vertices and edge in ONE flush.

  Whole-page adoption still copies unrelated siblings into the peer's
  pending page, so that peer may re-confirm them after the visible
  retraction. Permanent pruning of already adopted new-page siblings is
  a separate ownership policy question and is not claimed by this fix.

- **Remote page delete cleared the whole undo history**
  (`revoke-storm` seeds 1/4, latent since the stale-undo fix):
  DrawioFile.patch cleared the ENTIRE undo history whenever a
  non-undoable patch removed pages ("removed pages take their cell ids
  with them"). Any remote page delete cost every receiver its complete
  history. Now each removed page contributes its page id and its
  content cell ids (collectPageCellIds — root/layer ids excluded, they
  repeat on every page) to replacedIds BEFORE the patch applies, and
  invalidateReplacedEdits stays selective: entries on surviving pages
  survive. currentpage-delete locks the inert-undo side, revoke-storm
  the selectivity. SUPERSEDED by the execute-time repair merge: the
  history now stays complete, dead-page replays resolve to no-ops.

- **Field swap erased frozen replay intentions** (the manual find
  that parked the repair branch, completed 2026-07-29 in the merge):
  mxTerminalChange/mxChildChange execute() hand `previous` the LIVE
  model value on every replay, so a remote change between replays
  rewrote the recorded intention — a redo after a remote disconnect
  turned into a disconnect, and the lost-id reconstruction turned a
  connect-undo into a no-op. Both replay intentions (terminal ids,
  child parent ids and indices, plus position objects for transient
  points) are now frozen at the first execution and alternate by
  step parity; a null intention stays a legitimate disconnect or
  remove. undo-stale case 9 (redo reconnects to the re-added
  terminal) and case 10 (null-intent semantics) lock this. Case 11
  (manual find): the transient point survives sibling geometry
  replays of the same composite edit via a post-replay drain, and
  it sits at the frozen RENDERED attachment point of the dead
  terminal (captured mid-edit from the pre-edit view state, center
  fallback) - the edge keeps looking exactly like before the
  delete instead of aiming at the shape's middle. Case 12 (manual
  find): contradictory undos duplicated content - a peer moved a
  shape out of a container and undid that while this client undid
  its delete of the container, so the restored subtree still held a
  stale copy of the now-live shape and `cellAdded`'s id-collision
  loop renamed it into a second, independently replicating cell.
  The invariant is now explicit: **a replay must never mint an id**
  (a firing rename loop IS a duplicate). Restored subtrees are
  pruned of stale copies of live ids before the add - the live
  object is canonical, as it already was for the changed cell
  itself - so the shape survives exactly once and only its
  placement is decided by the merge.

- **Revoked client split-brain** (`revoke-storm` seed 2 @8 clients):
  a read-only client froze on a diverged order forever. Three stacked
  causes: reactive layout deltas ran the full local-change path
  (modified + flush) on a client whose save is permanently denied;
  every save merge re-asserted `diff(shadow, ownPages)` as pending own
  changes, preserving the retraction-window order residue on each
  merge (minimal patches never repair a residue that predates them);
  and the only self-healing anchor for such residues is the client's
  own next save - which a revoked client never has. Fixed: a
  non-editable file takes reactive deltas snapshot-only (no modified,
  no flush - own absorption would revert every incoming save's order,
  the removed-absorption storm class), sync.merge passes no pending
  for non-editable files and mirrors own/their wholesale from the
  merged shadow (mergeFile does the same on the reload path), and
  handleWriteRevoked is idempotent so denied-save retries cannot
  re-broadcast the retraction against a meanwhile-updated state.

- **Unrenderable edges** (manual find, then `render-consistency`
  everywhere): an end that is neither a terminal nor a terminal point
  cannot be drawn - the edge silently disappears while every model
  copy stays consistent, so no convergence verdict could see it. Three
  layers, deliberately different because the architecture demands it:
  LOCAL disconnects (`sanitizePageTerminals`,
  `sanitizeRealtimeTerminals`, `mxGraph.cellsRemoved` for terminals
  without a view state) leave a geometry-derived point, and that point
  travels in the diff like any other local change; the EXACT patch
  paths (`patchPage` remove pass and terminal sanitizer, `patchCell`)
  invent NOTHING - patching the shadow and checksumming it against the
  sender means anything the sender lacks forces a reload (proven: the
  first attempt produced reload storms and a 300s timeout); and what a
  patch leaves undetermined on the VISIBLE page is repaired in
  `DrawioFile.patch` (`repairUnrenderableEdges`) as a first-class
  local change, idempotent, so it flushes and propagates.
  The repair also runs `view.validate()`: marking a cell invalid does
  NOT create its state, which is the lost-invalidation half of the
  same symptom (`healsOnRevalidate=true` in the verdict).

- **Replay resolved to a DEAD object** (`undo-stale` cases 13/14,
  manual find): a replay resolves its frozen ids in the context of
  the frozen object so cross-page edits stay on their own page. When
  a peer removed that object, the frozen context is an orphan whose
  root is ITSELF - and searching that one-node tree for its own id
  answers with the dead object. The redo then moved the shape into a
  container that is no longer in the document and the shape was gone,
  with both clients agreeing on the loss (no convergence verdict can
  see that). A context that walks up to itself now lets the live
  model decide; a context inside a real foreign tree keeps using it,
  because the root and layer ids repeat on every page and a plain
  model lookup would leak dead-page replays onto the current page
  (`currentpage-delete` catches exactly that). Case 13 covers the
  peer restoring the container (the shape lands inside it), case 14
  the container staying deleted (the intention is unfulfillable, but
  the shape survives in the document).

- **Joiner stayed blind until the lazy cleanup** (`join-visibility`,
  manual find): a change broadcast while a client is still loading
  never reaches it live - it subscribes afterwards and live diffs are
  ephemeral. The content then arrives with the next save merge, which
  only reaches the own pages: `merge` patches the visible document
  only when NOT realtime-connected, assuming the live diffs already
  delivered it. Being connected NOW says nothing about having been
  connected WHEN the diff was sent, so the screen stayed stale for
  the full cleanup delay (measured 15s on Drive). A merge that brings
  content the visible pages lack now reconciles through an immediate
  cleanup - restricted to clients without pending state of their own,
  because with local or reactive changes in flight the lazy
  choreography is load-bearing (an immediate cleanup races the layout
  recomputation, caught by `adoption-race`).

- **Field swap made replays apply foreign values** (`undo-stale` cases
  15/16, manual find): every property change swaps its field with the
  LIVE model value on execute, so whatever stands in the model between
  two replays becomes the recorded intention. Two writers do exactly
  that: the repairs above rebase geometries to keep a shape in place,
  and remote patches change the same properties concurrently. Measured
  consequences: after a peer restored a container the redo put the
  shape inside it at its ABSOLUTE position, and a redo after a remote
  style change re-applied the REMOTE style and broadcast it back.
  Both intentions are now frozen as VALUES at the first execution and
  alternate by step parity - via one shared wrap for geometry, value,
  style, visible and collapsed; the terminal and child changes keep
  their own wraps because they additionally resolve object identity.

- **Changes made while alone were never resent** (`solo-resend`,
  manual find, PRE-EXISTING ON DEV): the transport skips outgoing
  diffs while the roster reports no peers, since nobody would consume
  them. A client joining right after such a skip never learns about
  those changes - the diff is gone and only the next save carries it.
  Two clients loading simultaneously hit this reliably: each roster is
  confirmed before the other client registers, so both believe they
  are alone ("skipped message while alone" with peers actually
  present). The selection has always been flushed when the first peer
  appears; the document content now is too, by resending everything no
  save has confirmed yet (the peer just loaded the saved state, so the
  unsaved delta is exactly what it lacks).

- **Exploratory automation found two product bugs on day one** (the
  scenarios assert invariants FIRST instead of locking known bugs):
  (1) *Insert collision froze pre-drop copies*: the roster resend
  re-broadcasts unconfirmed content as inserts; a receiver already
  holding an older copy of such a cell ignored the insert, so offline
  renames never arrived (`p2p-offline-rejoin`). Live diffs now apply
  with mergeInserts, which also makes duplicate delivery idempotent -
  the save-merge path used mergeInserts for the same reason already.
  (2) *Revision restore bypassed the sync layer*: the RevisionDialog
  replaced the visible pages wholesale without telling the sync - no
  live diff was sent, the restore leaked only via the next save's
  shadow diff, and the stale own pages made the next cleanup revert
  legitimate peer content from the screen (`revision-restore`).
  Restores now flow through `DrawioFileSync.fileRestored` as a
  regular local change.

- **Live content is held for a grace period** (`remote-grace`, was the
  "transient cleanup revert" design note until a production report of
  a collaborator's colours arriving, vanishing and coming back):
  content received as a live diff is in the visible and their pages
  but enters the own pages only with the NEXT save merge, so a cleanup
  in that window used to converge the screen to the own pages and
  revert it. The cleanup now DEFERS while such content is younger than
  `remoteGraceDelay` (60s in production) and reschedules itself to the
  end of the window; the sender's save confirms it before that in the
  normal case, and content nobody ever confirms is still expelled
  afterwards. Both properties therefore survive - only the expulsion
  is delayed. The alternative (converging to their pages plus the own
  pending delta) would have required redefining the ui==own cleanup
  fixpoint that `single-pass-cleanup` and `ownpages-misaligned`
  encode, and those have caught real bugs; the grace window leaves the
  invariant untouched and only delays when it is enforced. The
  scenarios keep `remoteGraceDelay` at 0 so every existing invariant
  stays sharp, and `remote-grace` asserts the held and the dropped
  case explicitly. Unchanged trade-off: a local save during the grace
  window still writes only the own pages, so unconfirmed foreign
  content is not persisted by this client.

- **Real P2P layer** (`FakeRtServer` + `P2PCollab.createSocket` hook):
  the p2p-* scenarios run the REAL P2PCollab inside the frames against
  an in-memory socket server with injectable faults (dropNewClient,
  dropClient). Everything else keeps the transport stub. The
  `join-announce=0` url param is the announce kill switch (pattern:
  alone-gate) and powers the built-in red proof of p2p-join-race.

- **Verdict 8 - history shape** (generalized from case 17): a remote
  patch must never change the undo history LENGTH, and one undo or
  redo moves the index by exactly one. The phantom-step class (a
  repair recording itself as an edit, one delete suddenly needing two
  undos) was invisible to every document-comparing verdict; this one
  runs in every scenario via the Client wraps around file.patch and
  ui.undo/redo. Red-proven against the case 17 fix (disabling the
  history suppression trips it immediately). The `boostOps` config
  (scenario or `boostops` url param) raises the share of chosen ops -
  undo-fuzz uses it to make undo/redo about half of all operations.

- **A script scheme reached an href attribute through a cell style**
  (`hostile-content`): `image=javascript:...` in a style was rendered
  as `xlink:href="javascript:..."` in the SVG - in the editor and in
  every exported file, where nothing checks it at display time. Links
  have been sanitized for a long time (`Graph.sanitizeLink`), images
  were not. `mxSvgCanvas2D.image` now drops script schemes
  (javascript, vbscript, livescript, control characters stripped
  before the check) and leaves data, blob and relative sources
  untouched. Browsers do not execute a javascript: image source, so
  this is defense in depth rather than a live exploit - but the value
  travelled from any collaborator into every viewer's DOM. Everything
  else the scenario throws at the receiver was already repelled: no
  entity expansion, no external entity resolution, no executable
  content from labels, user objects or file variables.

- **Verdict 8 audits system operations too**: replaceFileData, the
  terminal sanitizer, cleanup, merge, flush and the edge repair must
  all be history-NEUTRAL. Recording them turns one user action into
  two undo steps and lets a later replay undo the system's own work,
  which is exactly how the restore bug below destroyed sessions.

- **One undo after a revision restore wiped the whole session**
  (`restore-undo`, found on the scenario's first run): a wholesale
  replacement rebuilds every page through ChangePage edits, which the
  model records as UNDOABLE steps. Undoing them removed the pages
  themselves, and the resulting flush deleted every page on every
  collaborator - the trace showed the restorer broadcasting
  `{r: [page-a, page-b]}` and the peer left with an endless
  create-and-remove page churn. The cause was the page wrap's same-id
  no-op meeting the recorded order: the restore inserted the new pages
  BEFORE removing the old ones, so the undo re-inserted the old pages
  while their restored twins (same ids) were still present - skipped
  as "already there" - and then removed the twins. replaceFileData
  first hid the whole replacement from the history; since 2026-09-07
  it records the removes before the inserts instead, so the reversed
  replay removes the restored pages first and the old page objects
  return cleanly, and the restore (like the external merge and the
  conflict path, which use the same function) is ONE undoable step
  again, as it was before the repair wraps. The viewed page is the
  select target of its own removal and comes back selected. Locked by
  `editor-semantics` `restore-file-data` (exact round trip) and the
  one-undo/one-redo assertions in `restore-undo` (the peer follows).
  Those locks immediately found a second defect: `getPageIdForChange`
  tested `instanceof SelectPage` before `ChangePage`, which extends it,
  so no page insert or remove ever marked a page dirty. Harmless while
  a page id only appeared or vanished (the page arrays are always
  diffed), but the undo of a restore brings a page of the SAME id back
  with different content, and the flush skipped its cell diff - the
  snapshot fell out of sync and the peer never received the undo. The
  inserted or removed page is marked dirty now.

- **Malformed patch shapes destroyed saved content** (same scenario):
  a list arriving as a STRING where an array is expected was iterated
  character by character - every character became an insert entry with
  undefined id and parent, which scrambled the canonical order rebuild
  and dropped a shared, already SAVED cell from the document, with no
  cleanup bringing it back. `EditorUi.patchList` now normalizes every
  list read (seven sites): anything that is not an array is treated as
  absent, and non-object entries are skipped. A cell value arriving as
  an object was accepted into the model and the first reader expecting
  an XML node called getAttribute on it and threw - labels are
  primitives now, user objects travel as xmlValue as before.

- **Self-healing is the invariant, not divergence**: content that
  reaches only one client and is never saved lives in its visible
  pages but never in its own pages, so the cleanup - which converges
  the screen to the own pages - removes it again. The scenario asserts
  exactly that and then requires full convergence with the innocent
  clients, which makes the bounded lifetime of injected content a
  tested property rather than an assumption.

- **Hostile patch could destroy a collaborator's document**
  (`adversarial-patch`, found on the scenario's first run): a patch
  removing the page root and the layer ('0'/'1') left the receiver
  with a null model root - the next walk dereferenced it and took the
  editor with it, reachable by any collaborator (or anyone holding
  the channel id) with a single message. The remove pass now refuses
  removes that would leave a page without its root or without a
  layer; legitimate layer removals are unaffected because the insert
  pass has already added the replacement. Nine of the eleven attacks
  were repelled by the existing guards (no prototype pollution from
  `__proto__`/`constructor` cell and page ids, no exception on
  duplicate ids, broken previous chains, wrong types or garbage
  geometry) - those are now held by the test.

- **The version gate was absent on the transport production uses**
  (`p2p-version-gate`, found by the 2026-08-05 code review): the
  protocol and app-version checks lived in `changeListener`, which is
  bound to the cache/pusher channel. Production live diffs never take
  that path - they travel over the socket into `P2PCollab.processMsg`,
  which handed the payload straight to `receiveRemoteChanges`. So the
  gate PROTOCOL 7 was minted for (a v6 save is checksum valid but
  semantically wrong, which self-healing cannot detect because it
  compares agreement, not correctness) did not exist where it ships,
  and `mixed-version` certified it on a path production does not use.
  Both entry points now share `DrawioFileSync.handleRemoteMessage`.
  DELIBERATELY NOT GATED: cursor and selection. They are view state,
  never reach the model, own pages, snapshot or file, and hiding an
  outdated collaborator would make them invisible while they keep
  editing and saving - strictly worse than seeing where they are.
  Phase 2b asserts presence survives the payload gate, red-proven.

- **Content drawn on a new page never reached collaborators live**
  (`live-page-insert-revert` setup phase): the page insert entry is
  serialized from the CACHED page node, which is only rewritten when a
  page is switched away from. A page created and drawn on without ever
  leaving it therefore shipped an EMPTY insert, and once that was out
  every later diff compared roots, found them equal and never resent
  the cells - the content stayed invisible until a save.
  `getPageXmlForDiff` encodes the live root when the node is stale,
  without mutating the page (the caller may be diffing a clone).

- **One flag decided two different questions** (`live-page-insert-revert`):
  the live receive path was switched to `mergeInserts=true` for a
  CELL-level reason (the offline-rejoin insert collision), which
  silently switched on the PAGE-level collision merge as well - the
  branch whose own comment records that the live path must skip it.
  It reverted the creator's freshly flushed cells and labels. Split
  into `mergeInserts` and `mergePageInserts`.

- **A colliding page insert deleted the adopter's own work** (same
  scenario, the sibling of the stale-copy revert in the OTHER
  direction): the merge applied the full `diffPages` result, so it
  removed cells the local copy had and the sender's copy lacked. When
  the page creator saved first, that wiped the adopter's own FLUSHED
  cells from its own pages - and because the deletion never appears in
  the patch, `stripPendingInserts` could not know to restore them, so
  the adopter's next save published the loss to everyone. The merge is
  additive now, mirroring the colliding CELL insert; real deletions
  still travel as removes in the page's update entry.

- **A malformed live diff froze the receive channel forever**
  (`poison-live-diff`): the hardening wave normalized patch LISTS but
  not the update MAPS, whose values were dereferenced blind
  (`update[id].previous`, `temp.previous`, `'value' in diff` - `in`
  throws on a primitive by spec). The TypeError escaped through
  `patchPages`/`DrawioFile.patch` (both only have `finally`) and out of
  the receive batch's `setTimeout`, so `receivedData` was never reset:
  every later live message queued into an array nothing drains and the
  client silently stopped applying remote work while still
  broadcasting its own. `EditorUi.patchMap` now normalizes the maps at
  the five sites that read remote patches, and the batch body runs in
  `try/finally` so no future throw can wedge the channel again.
  `adversarial-patch` could not see this: it calls
  `doReceiveRemoteChanges` directly inside its own try/catch, which
  bypasses both the latch and the timer.

- **A page-switch replay left the client on a deleted page**
  (`phantom-current-page`): `SelectPage.execute` pivots on
  `previousPage` - it indexes the pages array AND becomes the new
  current page - while `this.page` is only a non-null marker. After a
  peer deleted the target, the index was -1 and the body was skipped,
  which is the INTENDED inert replay; the damage was that the undo had
  just spliced the viewed page out, so `ui.currentPage` pointed outside
  `ui.pages`. Everything typed there reached no flush and no save and
  was dropped when the next patch healed the reference.
  The fix is `EditorUi.healCurrentPage`: a quiet select of a survivor,
  history-neutral, drained ONCE per undo/redo (`EditorUi.undo/redo`) -
  per replayed `ChangePage` it rendered one intermediate page per page
  of a wholesale replacement, the undo of a restore took seconds.
  Verdict 9 generalizes it to every scenario.
  NOTE on the `SelectPage` replay: it walks by DIRECTION (undo to the
  page viewed before the first execution, redo to the target, each
  resolved by id; a destination outside the document keeps the current
  page). The base toggle went wrong after one inert replay, which left
  the redo of a restore on the last page (`restore-undo`). A replay
  whose destination EXISTS is active now even where the stale object
  made it inert before - `undo-stale` case 6 (redo of a page insert
  after the peer re-inserted the page) views that page again, and its
  follow-up cases went red with "reconnected to a dead terminal object"
  until the scenario selected the first page explicitly. A red
  `undo-stale` after a page-replay change is first of all a scenario
  that assumes the current page; check that before the repair paths.
  SECOND TRAP, caught by `save-fail` under `timing=real` only (the mock
  timers never produced it): the heal must run for REPLAYS ONLY.
  `replaceFileData` - the external merge, the conflict path and the
  revision restore - rebuilds every page through FIRST executions of
  ChangePage and passes through intermediate states where the current
  page is legitimately not in ui.pages yet. Healing there swaps the
  model root underneath the rebuild and corrupts it; the symptom was a
  RangeError out of `isObjectEqual`'s JSON.stringify on two of three
  clients, ~2 runs in 3, and it vanished as soon as a probe was added
  to that function (the Heisenbug rule again). Bisected against a
  worktree of the previous commit: 3/3 green there, 2/3 red here.

- **The grace window aged FRESH content out of its hold**
  (`remote-grace` phase 3, from the 2026-08-05 review): the timestamp
  marks the oldest unconfirmed remote arrival, but it was set once and
  cleared ONLY by a completed cleanup convergence pass - and a session
  with continuous traffic never lets one run, because every delivery
  re-arms the lazy timer. So the stamp of the session's FIRST live diff
  decided the fate of content that had arrived seconds ago: at the
  first lull the cleanup measured a stale age past the grace and
  expelled the sender's unsaved edits, which reappeared with their next
  save. That is precisely the came/went/came-back symptom the grace
  window was built to remove. `merge` now clears the stamp when the
  save brought everything into the own pages (the unconfirmed delta is
  empty), so the next live diff starts a fresh window; content nobody
  ever confirms keeps its original stamp and is still expelled.

- **The revoke verification could overwrite a committed revision**
  (`write-revoked`, unit-level lock): `DriveFile.verifyWriteRevoked`
  loads a descriptor to check whether the write permission is really
  gone, and adopted it with `setDescriptor`. A descriptor also carries
  the head revision, the checksum and the secret, so if a peer had
  committed a revision since the last merge, the known revision moved
  PAST content the shadow never saw. The peer's save notification then
  died in `doCatchup` as already seen (source == target) and the next
  save committed the stale base over it - a silent lost update, and the
  transient path (a routine rate-limit 403 on an autosave-heavy shared
  file) is the common case. It now answers from the loaded descriptor
  WITHOUT adopting it; the revision belongs to the save and merge
  chain, and a confirmed revocation is recorded in `writeRevoked`,
  which gates `isEditable` on its own.
  NOTE ON COVERAGE: no scenario reaches this method - the file double
  stubs it out and the harness runs `LocalFile` (see Harness
  limitations). The lock is therefore a unit-level assertion that calls
  the REAL `DriveFile.prototype.verifyWriteRevoked` against a stubbed
  descriptor load and asserts the known revision does not move. A
  descriptor-flow scenario would cover the surrounding chain.

- **Replays resolved against trees that had left the document**
  (`detached-subtree-undo`, two findings of the 2026-08-05 review):
  `mxGraphModel` detaches only the TOPMOST removed cell and leaves its
  descendants attached to it, so a subtree a peer deleted is
  structurally identical to a live foreign page - a tree whose root is
  not this model's root. Only the document knows the difference, hence
  the difference - but the test is exact without asking it: a page root
  is never a vertex or an edge, while a removed group or container
  always is, so a tree terminating in a CONTENT cell is detached.
  (1) `repairResolve`'s orphan rule only recognised a context that is
  its OWN root, so a frozen parent inside a removed ANCESTOR passed for
  a foreign tree and the search answered with the DEAD container. The
  replay then moved a LIVE shape into a container that had left the
  document, which took the shape out of the document too - on every
  client, so no convergence verdict could see it. The tree now has to
  terminate in a page root; a detached one lets the live model decide,
  which is the documented orphan behaviour (undo-stale cases 13/14).
  DELIBERATELY NARROW: a removed PAGE tree keeps the foreign-tree
  treatment. Its root and layer ids repeat on every page, so handing
  its replays to the model lookup lands them on the LIVE page and
  resurrects deleted content - `currentpage-delete` goes red on every
  seed, which is how the first, broader attempt (any tree that is not
  in `ui.pages` counts as detached) was caught.
  KNOWN BOUNDARY of the flag test: it is exact for every page root the
  app itself builds (`model.createRoot` leaves vertex/edge unset), but
  a page root decoded from crafted XML could carry `vertex="1"` and a
  crafted flag-less container could pass for a page root. Both only
  MISROUTE a replay inside a document the same collaborator already
  controls - they move no trust boundary - so the predicate stays flag
  based rather than pulling the document into this layer.
  (2) `repairPruneRevivedSubtree` decided liveness with
  `model.getCell`, i.e. in the CURRENT page's cell map, while a
  cross-page replay restores the subtree into a FOREIGN page. Nothing
  matched there, the stale copy survived the prune and the id existed
  twice in that page - unrepresentable in a diff, so the hashes
  disagree forever and the checksum reloads never heal it. Liveness is
  resolved in the destination tree now (the same `repairResolve` the
  sibling steps already used - the asymmetry was an oversight, not a
  trade-off). Case 12 covers the same-page variant and stays green.
  Scenario construction note: the cross-page variant needs the
  CONTRADICTORY-undo setup of case 12 (the peer's undo re-materializes
  the shape so it is live again on the restoring client). A plain
  "peer moves the shape out" does not reproduce it: the receiver
  deleted the cell with the container, so the move arrives as an update
  for a cell it does not have and is skipped.

OPEN, rare, real-timing only: **stack overflow out of `isObjectEqual`**
(`save-fail` seed 1 under `timing=real`, `RangeError: Maximum call
stack size exceeded` on two of three clients). `diffCell`
JSON.stringifies the two geometries, so something builds an object
graph far deeper than an mxGeometry's handful of levels. History: it
appeared at a HIGH rate (2 of 3 isolated runs) while the current-page
heal still ran on first executions, and restricting that heal to
replays removed the dominant cause - 8 isolated runs green afterwards.
It then reappeared ONCE in a full sweep, while the same commit and its
predecessor were each 4/4 green in isolation, so a residual, rarer path
exists and the earlier "fixed" was too strong a claim. Do NOT hunt it
with a probe in the hot path: a `try/catch` around the stringify and
even a single assignment next to it both made it vanish (the Heisenbug
rule). Instead the error hook now calls `Client.describeDeepCells`,
which runs ONLY after an error has fired and names the deepest cell
property across ui/own/their/snapshot with its chain - the next natural
hit, in a sweep or in CI, identifies the cell without a hunt.

- **Two blind spots closed by verdicts 10 and 11** (2026-08-05 review):
  the reload counter was recorded and read nowhere, and nothing ever
  looked at the persisted bytes. Both were red-proven by sabotage that
  the previous suite passed completely: corrupting the checksum the
  broker sends produced four self-healing reloads with every other
  verdict green, and mangling a value in the saved bytes only
  (`instant`) left all client-to-client comparisons green as well. That
  is the shape of the class - agreement is not correctness.

- **Four more patch-shape defects** (`adversarial-patch`, 2026-08-05
  review): (1) a page insert whose payload cannot be read threw out of
  the middle of the patch - a parser error, or `atob` on a diagram body
  that is not valid base64 - leaving the pages half applied; the parse
  is isolated now and an unreadable page counts as absent. (2) When the
  entry's announced id and the payload's id disagreed, the ANNOUNCED
  page had already been taken out of the implicit order as a collision
  while the payload added a DIFFERENT page, so the announced one
  vanished with nobody claiming it; such entries are dropped. (3) An
  insert without an id reached `cellAdded` with `undefined` and made it
  MINT one - a different one per model copy. The replay invariant
  applies to patches too: an insert states an identity, it never
  creates one. (4) After the merge, `patchPage` re-applied the terminals
  of every insert entry, including cells the `realtimeMergeVeto` had
  just protected, which reinstated exactly the stale connection the veto
  keeps out. Red proof: without the fixes the new attacks do not merely
  throw, they leave the receiver non-converged after six quiescence
  cycles with a hash and XML divergence.

- **Three replay-repair defects** (`detached-subtree-undo` phase 3 and
  the existing replay locks, 2026-08-05 review): (1) the severed-edge
  references were only overwritten `if (refs.length > 0)`, so a later
  removal replay that severed nothing kept the OLD ones and the next
  restore reconnected an edge a peer had legitimately disconnected in
  between - undoing their edit. (2) The point planted for a severed end
  added the terminal's own offset TWICE: `repairAbsoluteOrigin` starts
  at the cell, so it already carries `geo.x/geo.y`, while the reference
  implementation `EditorUi.disconnectTerminal` correctly uses
  `to + width / 2`. The dangling end landed at roughly twice the offset
  on every client (red proof: 540,720 instead of 440,670 for a terminal
  at 100,50 inside a container at 300,600). (3) The terminal wrap and
  the five property wraps never resolved the CHANGED cell, although
  mxChildChange has done so all along: after a save merge replaced the
  object under the same id, the replay wrote the frozen value into the
  dead object - nothing moved on screen while the history index still
  advanced, so the undo looked broken.
  Scenario note: the edge for phase 3 must be attached by the PEER.
  Attaching it locally truncates the redo stack, and the replay under
  test becomes a no-op.

- **Six more findings of the 2026-08-05 review, and a fix that had to
  be fixed** (`repair-adoption`, `write-revoked`): the grace hold
  triggered on ANY non-empty patch, including a purely ADDITIVE one -
  which is the join-visibility reconciliation and can revert nothing,
  so missed content stayed invisible for up to the full grace window;
  `isAdditiveOnly` now skips the hold there (sound because unconfirmed
  remote content is on screen but not in the own pages, so it always
  appears as a remove). The immediate-cleanup latch guarded only
  `lazy == true`, leaving the far more common unlabelled schedulers
  (a delivered live diff, the post-merge reschedule) to clear it and
  re-arm at the full delay. The revoke callback did not re-check that
  the file is still the current one after its async descriptor hop, so
  it could clear the undo history of a file the user had switched away
  from. And the retraction diffed `ownPages` without flushing first, so
  edits inside the debounce window escaped it entirely and stayed on
  screen as durable work on a file that can never save again.
  THE EDGE REPAIR was the interesting one. It is a first-class local
  change, and for an edge that arrived as an unconfirmed live diff the
  flush runs it through the cross-reference resolution, which pulls the
  edge AND its ancestors into the own pages - the next save then
  persists injected content that must instead expire with the next
  cleanup. The FIRST fix gated it on "is any repaired cell confirmed"
  across all pages, which the security pass took apart: one legitimate
  edge unlocks the flush for every cell repaired alongside it, and an
  id from another page counts as confirmation. Worse, the same repair
  runs a second time in `sanitizePageTerminals`, right before the flush
  diff and with no gate at all, so the door was still open. Both paths
  now share `absorbUnconfirmedRepairs`, which works PER CELL and PER
  PAGE: the repaired geometry of an unconfirmed cell is mirrored into
  the snapshot, so the screen keeps the repair while the outgoing diff
  stays empty for it.
  SCENARIO NOTE: `repair-adoption` injects onto a page the victim is
  NOT viewing. `DrawioFile.patch` only repairs the current page, so a
  same-page injection is already handled there and the scenario goes
  green for the wrong reason - it cannot see the ungated flush repair
  at all. Red-proven in the retargeted form: the injected content
  reaches the file and the cleanup can no longer expel it.

- **Unrenderable edges survived on pages nobody was viewing** (found
  by the new all-pages check within minutes of adding it): the three
  repair layers left a hole between them. `DrawioFile.patch` repaired
  the CURRENT page only, and the flush sanitizer visits only pages the
  user changed - but a patch removes terminals wherever it lands, and
  the exact paths must not invent a point (it would break the sender's
  checksum). An edge left undetermined on an untouched page therefore
  stayed undrawable for the rest of the session, identically on every
  client, so no convergence verdict could see it. The repair now runs
  over every PATCHED page with the same per-cell absorption, and
  markLocalChanges accepts a page id as the change source.
  Bisected before fixing, because the obvious suspect was the fresh
  absorbUnconfirmedRepairs: it is not the cause - with the absorption
  disabled the failure rate goes UP (4/4 instead of 1/2).

- **The rest of the 2026-08-05 review, triaged first**: of the 32
  never-verified findings only 20 were real - three had been fixed the
  same day (including the persisted-bytes verdict), six were refuted
  against the current code and three are documented trade-offs. Fixed
  here: the live-diff dedup was keyed on the payload's own `from`
  field, so anyone on the channel could claim a victim's id with a huge
  counter and every later genuine message of that victim was dropped as
  a duplicate - a silent mute, now keyed on the server-supplied sender;
  the insert path could replace a page root through the door the remove
  pass guards; `getCellForJson` parsed geometry, xmlValue and value
  untyped while `patchCell` had required strings since the hardening
  wave; `stripPendingInserts` read remote lists without patchList; the
  retraction map was a plain object keyed by remote page ids; a failed
  rollback was swallowed without a trace; the orphan drain rescanned
  the claimant map per orphan; ChangePageView had no repair wrap
  although RenamePage has one; a deferred descriptor reload was dropped
  when the save failed; a superseded join could still adopt its socket;
  and in mxGraph the disconnect fallback declined relative terminals
  (ports, label children, edge-as-terminal) outright - the very
  undrawable end it exists to prevent - while its sibling branch
  disagreed on the edge origin.
  Harness: `--scenarios all` (parsed from the orchestrator, so a new
  scenario joins the gate by existing), `--timing real` as a flag, an
  unhandledrejection hook, the all-pages edge check, and page deletes,
  fold/collapse and edge labels in the random op mix (57/88/36 hits
  across 15 runs, so they are actually exercised).
  The page-root insert guard was believed to be defense in depth ("no
  patch that reaches that branch with an empty root could be
  constructed") - wrong: EVERY root change reaches it with an empty
  root, see the 2026-09-21 entry above; locked now by `root-change`
  and the `root insert without children` attack.

- **Impersonation on the WebRTC signalling path** (`signal-impersonation`,
  the sibling the dedup fix's security pass pointed at): `broadcast`
  has always stamped the authenticated sender, but `sendSignal` relayed
  the payload verbatim - and the payload's `from` is written by whoever
  sent it. A signal goes to ONE target, and the receiver keys its peer
  connection AND its roster entry on that field, so any client on the
  channel could claim another's identity in the negotiation. The worker
  stamps `socket.id` over the claim now, exactly as `broadcast` does.
  NEEDS A WORKER DEPLOY to take effect (same pipeline as the newClient
  broadcast fix); until then the field stays spoofable in production.
  The FakeRtServer mirrors `sendSignal` including the stamp, so the
  harness models the real protocol rather than only the message path.
  `P2PCollab.getPeers` was added as a read-only roster view for it.
  The local half - ignoring a signal with no sender or one claiming to
  be this client - is defense in depth for the P2P-ENABLED path
  (`createPeer`/`newClients` key on the id); the roster itself is
  already safe because `addPeer` refuses null and self, so the harness,
  which runs with p2p off, cannot red-prove that half.

- **Error hooks are scoped to their own frame** (`crash-reload` under
  `timing=real`, ~1 run in 4): `crash()` destroys the client frame
  while requests may still be in flight, and the browser then fails
  them with "Document is already detached" - reported as save-error and
  logError against a client the scenario had deliberately destroyed.
  The hooks now compare against the client's CURRENT window rather than
  a crashed flag, so a reloaded frame's hooks stay armed. Verified in
  both directions: the flaky red is gone (3/3) and a real error in a
  LIVE frame is still reported (re-enabled the update-map poison and
  poison-live-diff went red on window-error as before). A flaky red in
  the gate is not cosmetic - it teaches readers to ignore it.

- **Undo re-parented restored children into the default layer**
  (`editor-semantics` `delete-group-with-connections` /
  `delete-collapsed-group`, 2026-09-07 review, SINGLE-USER regression
  of the execute-time repair): a removal lists a container BEFORE the
  children taken out of it separately (delete with connections appends
  the internal edges, a collapsed group its hidden ones), so the undo
  restores such a child while its container is still detached and
  comes back with the next change of the same edit. The repair took
  the detached parent for gone and substituted the first layer on the
  spot - on every plain Ctrl+Delete of a group with connected children.
  The child now goes back into the frozen parent object, as the
  unwrapped change always did, and `drainRepairParents` relocates only
  what is still outside the document once the whole edit replayed
  (undo-stale 13/14 keep their fallback, one step later). Found by the
  same review: the replay severing ran on FIRST executions and every
  severed edge cost a full `graph.refresh` on the following undo -
  Select All, Delete, Ctrl+Z on 1000 cells took 13s instead of 0.2s
  (`perf-gate` `deleteUndo`); the severing is replay-only now and the
  repairs validate the view once. And `patchCellRecursive` rebuilt the
  normalized update map for every visited cell (cells x updates per
  patch, ~0.6s for 10k cells with 1k updates in the copies alone); it
  is normalized once in `patchPage`.

- **Contradicting concurrent operations, old against new** (`contradicting-ops`,
  `contradicting-ops-net`, 2026-09-07): the same harness run against
  `origin/dev` (the tree without the realtime rework) fails every run
  of both presets, in two classes. (1) An edge whose terminal a peer
  deleted in the same window ends with neither a terminal nor a
  terminal point on ALL three clients, so the models converge while the
  edge is invisible everywhere and stays so for the rest of the session
  (`connect-vs-delete`, `connect-into-deleted-group`, `three-way`; the
  consistently-wrong class no convergence verdict can see, caught by
  the render verdict). (2) After the contradicting REPLAYS a cell
  exists twice on every client: the peer undoes its delete and revives
  the shape while the author undoes the grouping that held a copy of
  it, the id-collision rename mints a second cell and all clients agree
  on the duplicate (`group-vs-delete` and `three-way` in every run,
  `group-vs-group` in every plain run and half of the racing-save runs;
  caught by the singleness check only). Every other phase converges on
  the old code as well. The current tree passes every run, all 160
  phases per run within one quiescence cycle, with and without the
  racing save and under jitter, reorder and duplicates.

- **Three review leftovers, closed** (2026-09-07): the immediate-cleanup
  latch was only reset by its own timer, so a cleanup that ran directly
  (synchronizeFile, resetRealtime) after an immediate request stranded
  it and every later lazy request returned early - the client stopped
  reconciling until the next immediate one (`join-visibility`, unit
  check). The top-level patch list of a live message was never
  normalized: an object with a huge length property spun the receiver
  inside the socket handler (`poison-live-diff`). And the custom-property
  catch-all of `patchCell` / `getCellForJson` copied any unknown key onto
  the live cell, so a remote `{"getId": 1}` shadowed the method and broke
  every later encode and flush of the session (`adversarial-patch`); keys
  that live on `mxCell.prototype` are refused now.

Accepted parity notes (documented decisions, no action planned):
malformed diffs with null-id children or parent-only update entries
fall out of the canonical backbone and claimant chains and drift to
the end of their container — the previous chain walk broke on the
same inputs. An insert skipped as a duplicate outside merge mode
yields no cell, so chains keyed on it apply late (order-only
degradation, no loss). Crafted ancestor-under-descendant moves are
ignored with a debug entry (cycle guard in patchCellRecursive).

- **Arming the lazy cleanup once instead of postponing it was tried
  and REVERTED** (`sync-latency`, 2026-09-10/11): every delivered live
  diff, save, merge and catchup resets the 15s cleanup timer to the
  full delay, and so do local edits and the save's data generation, so
  under production timers a typing peer or a typing user postpones the
  cleanup for as long as the session is active - a resolved conflict
  stays visibly wrong and never-saved live content stays on screen
  until the first lull. Arming the timer only if none is pending
  (`armCleanup`) fixed the measurement (`--timing real`, grace 5s, the
  peer typing for 12s during each window, ms, seed 1):

  | number | postponed | armed once |
  |---|---|---|
  | conflictVisibleMs client0 (save cycle) | 2992 | 2935 |
  | conflictVisibleMs client1 (grace end) | 6290 | 4989 |
  | expelMs (never-saved live content) | 27908 | 4976 |
  | cleanups on the typing client | 1 | 2 |

  The conflict numbers are bounded by the save cycle and the grace and
  did not move; only the expulsion of content nobody ever saves went
  from "typing end plus the full delay" to the grace floor, which in
  production (grace 60s) is no gain at all. The price showed up in the
  8-client pass under production timers (`jitter` seed 1,
  `--extra clients=8`): with the cleanup firing every 15s DURING
  traffic the run never reached quiescence (watchdog at 870s, about
  20 messages per op instead of 1-2), while the same run converged in
  165s on the sources right before the change. The mechanism is the
  grace stamp: it marks the OLDEST unconfirmed arrival and is only
  cleared when a merge leaves the screen equal to the own pages, which
  continuous traffic never does, so after a minute every cleanup
  expels content that arrived seconds ago - the came/went/came-back
  flicker the grace window exists to prevent, re-enabled on every busy
  session. With the cleanup postponed to the first lull the stale
  stamp is harmless, so the scheduling is back to postponing;
  `sync-latency` stays as the measurement of the cost. (A per-page
  cleanup diff was prototyped alongside and dropped: it saves CPU on
  large files at the price of a marking contract on every copy
  mutation, which the little-used realtime mode does not justify; it
  did surface the stale page insert below.)

- **8 clients under production timers are outside the validated
  envelope of this harness** (2026-09-11): the same `jitter` seed 1 run
  also livelocks on the sources BEFORE the armed-once change once the
  save stub models the conflict state (`inConflictState` on 412, since
  `conflict-window-diff`): with eight autosaving clients someone is
  always in the 412 window, one client monopolizes the save chain, the
  other seven fall more than a hundred revisions behind and replay
  every missed revision as a separate merge from the lagging broker
  queue (production catches up with ONE merge over all missed patches,
  or reloads), so the fleet saturates the single Chrome process and
  never confirms its order claims. Mock timers at 8 clients are green
  (24/24 incl. `revoke-storm`), production timers are validated up to
  4 clients (16/16). Diagnosis knobs added for this: `grace=<ms>`
  restores the production grace under `--timing real` (the scenarios
  otherwise run with 0), `trace=tail` keeps the END of a long trace
  instead of its first 5000 lines.

  SIDE FIND: `adoption-race` is flaky under `--timing real` on this
  machine INDEPENDENT of the change (2/5 green with the previous sources,
  2/5 with these, in a separate worktree without other load): the peer's
  layout-heal flush lands between the creator's phase-5 cleanup and its
  save, so the saved stack order no longer matches the healed geometry
  (`creator-final-save`). The mock run is deterministic and green; the
  real-timing failure is a scenario pacing issue, not a sync bug. The
  same holds for `crash-reload` under real timing ("reload lost the own
  committed save", 2 of 3 red on the previous sources AND the previous
  harness, 3 of 3 green on the current ones in the same worktree
  comparison): the explicit pre-crash save races the peers' autosaves
  and is rejected, so it never becomes the reload base. Seed 3 of the
  same scenario is deterministically red under real timing ("reload
  missed the while-down edit cr_b2", 3 of 3 on the current tree, 2 of 2
  each on the rt-v7 tip and on the sources before the fast branch):
  the peer's while-down insert is still an unconfirmed live diff when
  the crashed client reloads, because its autosave has not fired yet
  at this seed's pacing, so the reload base (the OTHER peer's save)
  cannot contain it - it arrives with the next save and cleanup, after
  the assertion. Seeds 1, 2, 4 and 5 are green.

- **Live diffs were dropped while a save conflict was being reconciled**
  (`conflict-window-diff`, production find 2026-09-10 on test.draw.io,
  two Drive clients): a client whose save got a 412 is in
  `inConflictState` until its catchup merged the peer's save, about
  1.5 s in the log and longer with catchup retries, and two autosaving
  clients cross saves constantly. `changeListener` and
  `handleRemoteMessage` dropped EVERY message in that state, live diffs
  included. The peer's insert sent into the window (log: received
  13:34:39.372, no `DrawioFile.patch`) reached the client only with the
  peer's save into the own pages; the screen then waited for the
  cleanup, which the grace period of unrelated unconfirmed content held
  for 60 s - the insert appeared at 13:35:49, and the peer's later
  updates of it logged `Updated cell not found` in between. Live diffs
  now pass the gate in conflict state (they touch the visible and the
  remote pages, which the save conflict does not), everything else
  still waits (a notify would start a second catchup chain). The
  harness had never modeled the state: its save stub now sets
  `inConflictState` on a 412 like the providers, so every scenario with
  crossing saves runs through it, and the scenario holds the peer's
  save back in the broker queue so the live diff lands inside the
  window like the production race. The second half of that find, a
  confirmed insert waiting behind the grace of unrelated content, is
  the per-cell grace (idea 2), still open.

- **A file-changed notification deferred during a save was dropped when
  the save failed** (`deferred-notify`, found 2026-09-10 by reading the
  gates after the conflict-window find): `fileChangedNotify` defers a
  notification that arrives while a save is in flight
  (`remoteFileChanged`) and only `handleFileSuccess` replayed it. A
  save that failed with anything but a conflict (a transient network
  error, say) left the flag set and nothing acted on it: the peer's save
  was never merged, so the own pages lacked its content while the
  screen showed it as unconfirmed live content, and the cleanup expelled
  it after the grace period - came, went, and came back only with the
  client's next successful save (412, catchup). The descriptor deferral
  had been fixed for exactly this asymmetry (`flushRemoteDescriptor`);
  `flushRemoteFileChanged` is its twin, called from the same place in
  `handleFileError`. Invisible to the harness because saves reach peers
  as direct merges, never through the notify chain - the lock counts the
  catchup trigger at its entry instead.

- **One failing message took the rest of its receive batch down**
  (`batch-isolation`): live diffs within the 50ms receive window are
  applied in one loop, and the loop aborted at the first exception, so
  every message batched behind it was lost for the screen (the save
  merge and the cleanup caught up later). The poison hardening made all
  known malformed shapes not throw, which is why `poison-live-diff` -
  which checks that the NEXT message, in a later batch, still passes -
  could not see it. Each message is applied in its own try/catch now and
  a failure is reported through `EditorUi.logError`; the lock injects
  the failure.

- **Late joiners get unsaved live content only from a peer that was
  alone** (reading, not fixed): `sendUnconfirmedChanges` runs when the
  roster grows from zero to one peer (`socketPeerCount == 1`); the
  socket protocol has no replay of live diffs and a `join` announcement
  only heals rosters. So a THIRD client joining a session with two
  active peers sees their unsaved live content only with their next
  save, when the merge's join-visibility cleanup paints it - a bounded
  delay of one autosave cycle, not a loss. NOTE: `join-mid-session`
  replays the broker's `liveLog` to the joiner "like the production
  cache", which production does not do; the scenario certifies a
  catchup that does not exist. Resending on every `newClient` would
  close the gap at the price of a broadcast per join.

- **The cleanup's page insert carried a stale page** (`reorder` seed 1
  `single-pass-cleanup`, surfaced 2026-09-10 by a per-page cleanup diff
  prototype): `getPageXmlForDiff` re-encoded the root only for
  `diagramModified` pages, not for `needsUpdate` ones - the flag
  `patchPages` sets on an own page whose cells a save merge changed. A
  page that the visible document lacked was therefore inserted from the
  own page's cached node, which predates the merge, so the screen copy
  missed the merged cells. The next FULL cleanup diff silently repaired
  it, which is why no lock ever saw it; the prototype trusted a
  convergence pass to be exact and skipped the page afterwards, so the
  stale copy stayed. `needsUpdate` now triggers the re-encoding as well
  (the page is not mutated, as before).

## Reactive layout deltas are stateful (2026-07-24 incident fix)

Layout results (childLayout=stackLayout etc.) belong to the diff of the
client that triggered them: peers on other pages never run the layout,
and the last saver would persist a state the layout can never produce
(the "page Blank" incident: cloud overlapping Item 2, container 50px
short, permanent client divergence). DrawioFile.patch therefore treats
a non-empty reactive delta on the current page as a first-class local
change: `fileChanged(null, 'currentPage')` (modified + autosave + dirty
marking + debounced flush); the snapshot keeps the raw patch result so
the delta stays diffable. Silent client-local absorption is REMOVED —
it was disproved by `layout-passive` (deterministic incident repro:
concurrent conflicting reorders, layout runner saves first and never
again, passive client saves last; asserts final-saver file consistency
via assertFinalStackConsistent + cross-client convergence). Quiescence
saves are production-faithful now: only modified clients save (an
artificial save of an unmodified client masked exactly this bug).

RESOLVED (canonical order rebuild, Gaudenz's design call): the child
order in patchCellRecursive is rebuilt as a deterministic anchor-graph
walk — every cell has exactly one anchor (explicit previous from the
patch, or implicitly its current local predecessor), claimant order
per anchor is [inserts in patch order, explicit moves by ID, implicit
follower]; createParentLookup keeps multi-claimant lists (competing
claims were last-write-wins dropped before). Exact diffs round-trip
(3000-case randomized property test); crossing reorders converge via
the save-serialized constraint chain, adopted on screen by cleanup —
which now flushes first and gates on !localFileWasChanged instead of
!isModified() (the modified-gate starved cleanup while reactive
deltas kept files modified). All former order-duel seeds green.

RESOLVED (2026-07-24, gate 40/40 on the damped tree): the runaway was
the eager sendLocalChanges at the top of doReceiveRemoteChanges — it
bypassed the flush debounce, so every delivered message emitted the
freshly recomputed reactive delta and correction cascades amplified
under latency (jitter:2/3 livelock, ~8.6k msgs in 240s, zero
cleanups). Reactive-only pending changes (marked via the reactive
flag from DrawioFile.patch) now skip that eager flush and ride an
armed-once debounce trigger; jitter:2/3 converge in ~8s at 57-66
msgs with normal cleanup/save counts. Default time budgets suffice.

## Phase 2: dirty-page flush (2026-07-24)

`sendLocalChanges` tracks locally changed pages (dirtyPageIds in
DrawioFileSync, fed per undoable edit through fileChanged; unknown
change sources fall back to all-pages) and diffs/clones only those:
`diffPages` gained a `skipCells` parameter that skips cell diffing for
guaranteed-unchanged pages (order/name/view state still compared).
Under `test=1` every incremental flush asserts the snapshot equals the
pages afterwards ("Dirty page tracking out of sync" via ui.alert, so
the alert-hook verdict arms it in every harness run). Reactive layout
deltas that arrive while local changes are pending mark the current
page dirty (absorption is skipped in that case, the delta rides the
flush). Measured on a 20-page/10k-cell file with one changed page:
flush ~200ms -> ~8.5ms; the skip-diff patch is byte-identical to the
full diff. Sweep 35/35 before and after, convergenceRounds unchanged.

## Nested missing-terminal undo coordinates

`nested-undo-endpoint` reproduces an undo reconnecting to a terminal
that a peer deleted. With an edge inside a group at `(300,200)`, the
frozen graph attachment `(440,250)` was written straight into the
edge geometry. Terminal points are relative to the edge's parent, so
this saved `(440,250)` instead of `(140,50)` and shifted the rendered
end on both clients. Convergence and edge visibility alone passed.

The terminal replay now subtracts the edge parent's absolute origin
before storing the point or queuing its restoration after sibling
geometry changes. The named scenario uses ordinary connect/remove/
undo/redo APIs on two full editors and checks both endpoint geometry
and rendered position, then parses the saved file. Five variants cover
a root-level control, one and two group levels, source and target
ends, zoom and translation, and a composite drag-disconnect whose
geometry replay overwrites the initial repair. Repeated undo/redo also
checks that a living reconnect clears the transient point.

    node run.js --scenarios nested-undo-endpoint --seeds 1
    node run.js --scenarios nested-undo-endpoint --seeds 1 --timing real

## Conflicting ancestry during undo and redo

`undo-ancestry-cycle` uses real container drags: A moves X out of G,
then B moves G under X. Undoing A's drag would put X under its own
child G. The core parent setter writes that cycle before walking
containment, so the old replay hangs. Ignoring only the parent write
is insufficient: the drag's sibling geometry changes still run and
apply coordinates from inside G to X on the layer.

The application now preflights each composite's child changes in
execution order against read-only parent/children overlays, including
canonical object replacement, detached-parent restoration, duplicate
subtree pruning and page/root switches. A cyclic composite is inert:
no parent, geometry, terminal or custom sibling change executes.
The history cursor still moves one step. Its opposite replay is also
inert, preserving all changes' private toggle state. The next retry
of the rejected direction resolves the current hierarchy again, so
it can succeed after a peer makes the destination safe. This policy
also avoids reapplying geometry for a drag whose undo did nothing.
It deliberately skips any unrelated changes grouped into the same
composite; no conflict notification is added in this change.

A final `mxChildChange.execute` guard prevents direct callers from
creating a cycle. Such individual replays have no composite to pair:
they advance that change's frozen direction, leave parent/geometry
untouched, and may apply their next legal intention. The guard runs
before subtree pruning and before deferred-parent work is queued.
The preflight follows standard model/page changes; arbitrary custom
code that mutates parent pointers outside those change types remains
responsible for its own invariants.

The browser regression checks undo and geometry-before-child redo,
repeated conflicts, the inert opposite after a peer fixes the hierarchy,
successful retries, mixed local/remote reparenting, legal ordered
multi-move edits, custom toggle siblings and a grouped page switch with
same-id content on another page. Exact document and geometry assertions
supplement the normal convergence, history, rendering and saved-file
gates. A browser interlock counts and suppresses unsafe parent writes
so the unchanged source fails promptly rather than hanging Chrome;
with the fix, the interlock must never be reached.

`undo-ancestry-cycle-model.js` separately runs the real model and replay
wrappers without that interlock under a 1.5-second VM deadline per case.
It covers composite/direct/deep/self cycles, detached direct replay,
canonical-parent replacement, detached-parent restoration, canonical
subtree pruning and model-root switching. The combined page-revival
controls cover canonical revived-page cycles, absent-page mixed edits,
file identity and real `ChangePage` restoration/replacement order.
An optional source-tree
argument allows the same tests to certify a failing baseline. On the
rt-v7 base the cycle cases time out; on the fix they all pass.

`revived-ancestry-cycle` reverses ancestry only after remote page revival,
so the abandoned tree cannot supply the correct cycle verdict. It checks
whole-edit rejection, including a page switch; rejection of a lazy page
without materializing its real root; a safe retry against canonical cells;
and a mixed edit whose absent cyclic page must not block its live sibling.
The independently based fixes require the preflight to follow page/file
provenance, rather than inspecting the old cell tree. A merge retaining
tree-only preflight fails the revived-page, absent-page and file controls.

    node undo-ancestry-cycle-model.js
    node run.js --scenarios undo-ancestry-cycle --seeds 1 --timeout 60000
    node run.js --scenarios undo-ancestry-cycle --seeds 1 --timing real --timeout 90000
    node run.js --scenarios revived-ancestry-cycle,page-revival-undo --seeds 1 --timing real --timeout 150000

## Persistence and notification coverage

See [COVERAGE.md](COVERAGE.md) for the new regression groups, timing contracts,
the repaired notification/metadata defects, and the browser/provider acceptance
matrix. These tests run against normal application sources. The accompanying
`DrawioFile` and `DrawioFileSync` fixes preserve file-variable ownership across
RT-off/no-sync edits, retry optimistic notifications (including deferred ones),
and load saved metadata when cache patches are unavailable.

`Client.save()` now returns an explicit outcome (`committed`, `failed`,
`conflict`, `busy`, `noop`, or `timeout`). A commit receipt includes its attempt,
base revision, committed revision, SHA-256 of the exact persisted bytes, and
whether the callback reached the original frame. `mustCommit()` rejects every
other outcome and rehashes the stored bytes. A timeout is a verdict failure
unless the scenario explicitly injects one to test the harness. The global
saved-file oracle also checks file-level vars.

Adoption/crash phase waits now drain in-flight broker deliveries and the
receive/merge queues. Their explicit required saves use `mustCommit()` and
hold autosaves during scripted races. Production timer mode still uses actual
flush/receive/cleanup values; it is not an assertion that every scenario lets
autosave choose its phase order. Each result records effective timer values,
backend, browser, git HEAD, and a fingerprint of the loaded test files.

## Harness limitations

- Legacy scenarios still use direct save-patch delivery. New `descriptor`
  scenarios run `notify -> changeListener -> fileChangedNotify -> fileChanged
  -> catchup -> merge/reload` with fixture descriptor/cache HTTP responses.
  They do not exercise a deployed cache or a live Drive account.
- `notify-socket` uses real P2PCollab with the fake socket server. This checks
  application socket handling, not Cloudflare deployment/authentication.
- `optimistic-notify*` instantiate real OneDriveFile and execute the real
  OneDriveClient save serializer. Only HTTP reads/writes use local fixtures;
  no Microsoft login, SDK, throttling, upload session, or real provider is used.
- `join-mid-session` and the legacy `crash-reload` explicitly opt into an
  artificial live-log replay. That log is not a production guarantee.
  `join-third-no-replay` opens saved bytes with A/B already connected;
  `join-first-peer-resend` separately checks the zero-save first-peer resend;
  `crash-commit-no-ack` reopens durable bytes without replaying a live log.
- `mixed-version` changes protocol/app constants to model compatibility gates;
  it saves its fixture before the newer message sets a refresh latch.
  `rollout-mixed-source` separately loads the full historical v6 application
  from Git commit `c6c7ce5b31bb7b1f1377f97a9e25d4b94be0c073`. It uses real
  codecs, model/adoption, serializer and P2PCollab, with fake transport/storage
  and descriptor/cache request spies. It does not prove deployed-worker or
  provider-write exclusion. Its unsafe control inspects serialized old bytes;
  the safe candidate save uses the backend commit receipt and a fresh parse.
- File-level vars and view-state operations have scripted semantic coverage;
  they are not yet part of the random operation generator. The live browser,
  actual provider and deployed-worker matrix remains separate.

## Files

- `harness.js` — broker, client bootstrap/stubs, op generator, asserts
- `backend.js` — storage attempts, commit receipts, phase barriers
- `descriptor-backend.js` — cache/descriptor and OneDrive HTTP fixtures
- `coverage.js` — persistence, notification and reachability regressions
- `rollout.js` — real historical-source compatibility and upgrade regression
- `COVERAGE.md` — coverage contracts and manual acceptance matrix
- `orchestrator.html` — scenario presets and the run script
- `run.js` — zero-dependency node server + headless Chrome sweep runner
- `embed-conflict.html` — REAL embed editors (`?embed=1&proto=json`)
  driven over the embed message protocol, with a realtime `EmbedFile`
  whose `saveFile` is the host conflict loop of the integrations
  (`plugins/cConf-1-4-8.js`, `monday.js`, `nextcloud.js`). One host
  document behind a conditional write, so only a stale etag is a
  conflict. Phase 1 saves repeatedly with one injected conflict per
  episode, phase 2 saves from two clients concurrently; no save may end
  in the catchup timeout. Open via `run.js --serve-only`, the verdict is
  `document.title` EMBEDPASS/EMBEDFAIL and `window.__EMBED_RESULT`
- `checksum-cases.html` — hand-built XML pairs through the mergeFile
  checksum invariant in the current app AND the pinned v6 app (served
  from `/rt-v6/`), side by side; open via `run.js --serve-only`
- `checksum-roundtrip.html` — seeded random edits on a fixture
  (`?fixture=<path under etc/rt-test>&rounds=&ops=&seed=&chain=1`), the
  invariant evaluated in both apps per round; fixtures are not committed


## Rollout compatibility gate

A normal Git clone must contain the pinned v6 commit above (shallow/public
mirror clones may need the internal history). The runner serves its webapp
under `/rt-v6/` with a fixed revision; the iframe loads historical pako,
Graph, P2PCollab, DrawioFileSync, DiffSync and DrawioFile together. This is
not a handcrafted legacy decoder. The synthetic AES key is public test data.

```sh
node etc/rt-test/run.js --scenarios rollout-mixed-source --seeds 1
node etc/rt-test/run.js --scenarios rollout-mixed-source --seeds 1 --extra encrypted=0
node etc/rt-test/run.js --scenarios rollout-mixed-source --seeds 1 --timing real
node --test src/main/server/cf/cf-workers/fast-rt/test/admission.test.mjs
```

The browser scenario deliberately pauses autosaves to assert each delivery,
then performs an explicit candidate commit; `--timing real` preserves real
receive batching. A fallback request is counted, not delivered through a
real cloud account. Old catchup executes the historical implementation
against HTTP/descriptor/reload spies, covering equal-checksum fast-forward,
cache disabled, v7 patches, percent decode failure and HTTP 503. Upgrade
tests run the actual cancel callback and base save preparation; they do not
navigate away or update a real service worker. The Node tests instantiate
the actual Worker Document class with storage/socket doubles and verify
persistent admission, draining and concurrency. They do not deploy Cloudflare.

The remaining production acceptance gate, activation and rollback procedure
are in [realtime-rollout.md](../../docs/claude/realtime-rollout.md).
