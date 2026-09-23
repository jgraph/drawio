# Persistence and notification regression coverage

Base: `origin/rt-v7` at `4880118b4d7402e790a086995c1af10f780fc6c6`.
The test additions and application fixes on `rt-v7` cover the defects below.

## Automated cases

All cases below participate in `node run.js --scenarios all --seeds 1`.
Use `--timing real` to exercise production flush/receive/cleanup timers.
Scripted race phases intentionally hold autosaves so an unrelated successful
save cannot hide a lost notification. Autosave is restored for quiescence.

| Cases | What must be true |
|---|---|
| `save-outcomes` | Busy, injected no-op/failure/conflict and timeout are distinguishable from a durable commit. `mustCommit` rejects a successful no-op callback. Receipts identify exact committed bytes. |
| `notify-save-success` | A foreign revision committed while another save's ack is held is deferred, then caught up after the ack. |
| `notify-save-failure` | A foreign save notification received during a failing save is replayed through real descriptor/cache catchup. |
| `notify-save-conflict` | A commit-time 412 runs real `fileConflict`, catches up and then persists the surviving local edit. |
| `notify-order` | Duplicate and reversed notifications cannot apply a saved range twice or move the descriptor backward. |
| `cache-range-catchup` | One cache response containing two encoded revisions reaches one production merge call with both patches. |
| `cache-delayed` | An initially absent cache entry is retried and later consumed without a full-file reload. |
| `cache-fallback-401`, `-503`, `-410`, `-empty`, `-malformed`, `-checksum`, `-future`, `-old-app`, `-oversize` | Each cache failure reaches exactly one real `reload -> updateFile -> mergeFile` using actual saved bytes, preserving a pending local edit for the next successful save. Oversize omits cache data through the real max-entry-size check. The old-app case explicitly enables a minimum-version gate. |
| `metadata-name`, `-vars`, `-format`, `-fold` | Checksum-invisible page name, file vars, page format and folding-enabled setting survive the cache patch, shadow, visible state and cold byte parse. `fold` tests the page folding setting, not a cell-collapse geometry change. |
| `descriptor-fast-forward` | Both matching clean state and dirty local vars use full-file catchup when patches are unavailable. Local vars must survive without being silently confirmed. |
| `notify-socket` | A save uses real P2PCollab.sendNotification and the receiver enters descriptor/cache catchup over the fake socket server. |
| `crash-commit-no-ack` | Storage commits before the frame dies. Reopen reads that revision and its vars; the delayed old-frame callback cannot run against the replacement session. |
| `join-third-no-replay` | A/B are already connected. C loads saved bytes with no replay; its pre-save live availability is recorded separately. After A commits, C must adopt the named saved revision and can contribute edits. |
| `join-first-peer-resend` | A is initially alone. Its first peer receives the real resend before any additional save; a strict revision assertion prevents storage from hiding a missing resend. |
| `descriptor-fast-forward-metadata` | With cache unavailable and a missed live rename, a matching page checksum must not hide stale saved metadata. |
| `undo-connection-same`, `-api`, `-tab` | Same-page and quiet API page changes preserve a collaborator edge through redo-delete/undo. An ordinary page-tab DOM event records navigation and truncates the pending delete redo. No constructor is used to search live foreign roots. |
| `conflict-budget-optimistic`, `-cached` | The conflict retry budget counts the consecutive catchup attempts of ONE episode. A confirmed save returns the full budget on every file, including the `isOptimisticSync` files whose save never reaches `DrawioFileSync.fileSaved`. |
| `optimistic-notify` | An optimistic OneDrive notification processed before the provider write becomes visible must eventually adopt the committed revision. |
| `optimistic-notify-after-commit` | The same real OneDrive save/notification path succeeds when its notification is delivered after commit. Timing control for the preceding regression. |

The ordinary-tab case dispatches DOM mouse events through the actual page-tab
handler. It is not evidence of OS mouse/keyboard automation. Same-page/API
cases invoke the application's undo/redo actions. The latest branch passes all
three; the earlier quiet-page edge failure is no longer present on this base.

The twelve `vars-*` lifecycle cases cover RT-off edits, reconnect resends,
foreign ownership, save intervals and saves without a sync object. The seven
original failures are repaired without weakening their live/saved assertions.
`revoked-file-vars` seeds 1–20 remain separate ownership and revoke controls.

## Optimistic notification repair

The early-notification test runs real `OneDriveFile.save -> doSave -> saveFile`
and `OneDriveClient.saveFile`, holding only its HTTP write. Real `fileSaving`
sends `{m, type: 'optimistic'}`. A completed read of the precommit revision is
required before the test releases storage; the peer must then retry and adopt
the new etag without another notification or manual refresh.

`DrawioFileSync.handleMessageData` now forwards the payload to
`fileChangedNotify`, and a deferred optimistic hint survives the receiver's
in-flight save. `optimistic-notify-save-success` holds a real OneDrive write
acknowledgement; `optimistic-notify-save-failure` injects an HTTP write error.
Both require the deferred path to read the old revision and then retry after
the sender commits. The after-commit case remains a timing control.

## Metadata catchup repair

A matching content checksum cannot prove that a clean document has the saved
page names, format, folding setting or file vars. Catchup now loads the actual
saved file whenever cache patches are unavailable. This costs one full-file
read per new revision in that mode; cached patch catchup is unchanged.

`descriptor-fast-forward-metadata` requires a missed persisted page rename
in both UI and shadow. `metadata-no-cache-vars`, `metadata-no-cache-format`
and `metadata-no-cache-fold` repeat the missed-live scenario for the remaining
checksum-invisible fields. They verify the saved bytes, shadow and visible
state, and require the full-file path. `descriptor-fast-forward` also verifies
that dirty local vars are not silently confirmed by that fallback.

## Reproduction

From `etc/rt-test`:

```sh
node run.js --scenarios all --seeds 1 --extra trace=always
node run.js --scenarios notify-save-success,notify-save-failure,notify-save-conflict,notify-order,cache-range-catchup,descriptor-fast-forward,crash-commit-no-ack,join-third-no-replay --seeds 1 --timing real --extra trace=always
node run.js --scenarios optimistic-notify,optimistic-notify-after-commit,optimistic-notify-save-success,optimistic-notify-save-failure --seeds 1 --timing real --extra trace=always
node run.js --scenarios adoption-race,crash-reload --seeds 1-3 --timing real
```

Inspect the resulting `results-<pid>.jsonl`. A record includes `provenance.head`,
`fixtureSha256`, browser/version/platform, effective timer values, request
history for new scenarios, and receipt summaries. `fixtureUnchangedDuringRun`
identifies evidence collected while test files were being edited; repeat those
runs for a stable final artifact. App byte identity follows from the base commit
and a test-only diff. The fixture fingerprint does not fingerprint arbitrary
uncommitted application-source changes.

## Validation on 2026-09-15

Google Chrome 152.0.7977.83, macOS, Node 22.14.0; seed 1 unless noted.
The reviewed application sources were unchanged throughout these runs.

| Run | Result |
|---|---|
| Full 115-scenario inventory, controlled timing | 114 exercised and passed; `sync-latency` skipped as designed |
| `sync-latency`, real timing | 1/1 passed |
| All twelve vars lifecycle cases, four optimistic cases, five no-cache metadata/catchup cases, three save-notification cases, `save-fail`, `adoption-race`, `crash-reload`, `nasty`; real timing | 28/28 passed |
| Existing `revoked-file-vars` ownership controls, seeds 1–20 | 20/20 passed |

The real profile uses 300 ms flush, 50 ms receive, 15 s cleanup and 1.5 s
autosave timers. Scripted persistence races hold autosaves until quiescence;
`nasty`, `save-fail` and `sync-latency` exercise automatic storage writes.
The harness normally sets remote grace to zero; the latency case explicitly
uses 5 s grace and 12 s of ongoing typing. These are local storage/socket
fixtures, not deployed-provider acceptance results.

Source syntax checks, `git diff --check` and a separate security review passed.
No new rendering sinks, dynamic production URLs, credential handling or
untrusted object-key merging were introduced.

## Browser/provider acceptance tests (not executed by this local harness)

These are explicit remaining integration tests, not claims of automated
coverage. Use disposable shared diagrams, two authorized editing sessions and
an optional third session. Record app revision, browser versions, actual storage
revision/etag, exact reproduction steps, screenshots, exported XML and a hash
of each downloaded provider revision. Save a baseline before each case.

Run the core cases in Chrome/Chrome and Chrome/Firefox on the staging provider;
repeat representative editing and background-tab cases with Safari. Run on
Google Drive, then OneDrive, with the intended deployed socket/cache service.
Changing constants inside one app build does not satisfy mixed-build coverage.

| Case | Steps and independent pass condition |
|---|---|
| List adoption and save order | A adds a List and children. While A's save is delayed, B reorders/relabels received children and saves first. Save A next. B's order/labels must remain in both downloaded revisions and after cold reopen. |
| Page/container adoption | A adds an unsaved page/container; B edits descendants. Save B then A; compare page membership, descendant geometry, labels and edge endpoints in downloaded XML. |
| Save outcome and notification | Delay B's PUT; A saves a disjoint edit. Release B's success, transient failure, then 412 in separate runs. Both confirmed edits must appear after retry, without needing an unrelated later save. |
| Notification before OneDrive commit | Delay A's PUT response/visibility, allow its optimistic notification through, then complete the write. B must load the resulting etag without manual refresh. The local fixture passes; provider visibility behavior still needs this deployed check. |
| Reconnect/third client | Disconnect A, make/flush an edit and reconnect. Open C from stored bytes. Verify current peer resend and eventual persistence; do not assume the service stores an unsaved live history. Include file-vars add/change/removal. |
| Crash before acknowledgement | Hold the saving client's response after the provider records a new revision, close that tab, reopen from the provider. The committed cells and vars must survive, and the old undo history must not. |
| Permission loss | Revoke A's write access through the provider after unsaved local edits. Verify effective read-only state, rollback of solely revoked work and preservation of collaborators' edits. A transient 403 with write access retained must not cause rollback. |
| Actual page-tab undo | Delete/undo a terminal; B adds an edge to it. Exercise normal tab navigation and keyboard/menu undo/redo. Record whether navigation replaced redo, rather than inferring API-only reachability. Verify endpoints after reopen. |
| Background throttling | Keep B in a background tab through editing/save/reconnect. Foreground it; assert eventual saved revision and semantic content, and measure delay separately from correctness. |
| Mixed application builds | Use two immutable deployed builds with different supported protocol/app versions. Verify incompatible live payloads are rejected and saved-file recovery remains available without silently accepting unknown patches. |

Acceptance requires no unexplained exceptions/checksum recoveries, no loss of
expected semantic content, and provider-downloaded bytes matching each required
save. Record expected injected failures individually. Do not treat identical
page checksums as proof that names, format, folding settings or file vars match.
