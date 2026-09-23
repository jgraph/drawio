# Desktop merge duplicate-edge repro (jgraph/drawio-desktop#2382)

Deterministic reproduction of "Duplicate edges pasted at random places"
on the desktop app with OneDrive-style external file rewrites. Confirmed
RED against the shipped 30.0.4 bundle and against current dev sources
(2026-07-28, rt-v7) — the bug is alive; the realtime-campaign patch
hardening does not apply because no cell id ever collides.

## Mechanism

1. The user pastes an edge (paste always mints a fresh id, `X-1`) and
   the file is saved (`disk_A`).
2. The sync client rewrites the file with an **older** version
   (rollback). `fs.watchFile` (5s stat poll) fires, the app shows "The
   file has been modified. Click here to synchronize.", the user
   clicks: `mergeFile` faithfully removes `X-1` from the canvas. To the
   user their paste silently vanished.
3. The user pastes again — compensation — creating `X-2` (unsaved).
4. The sync client rewrites the file again with `disk_A` (the delayed
   **echo** of the first save). The user synchronizes again:
   `patches = diff(shadow, disk_A)` re-inserts `X-1` (its id is absent
   locally, so no collision guard applies), while LAST_WRITE_WINS
   replays the unsaved local insert of `X-2`.
   Result: `X-1` and `X-2` — two identical, unattached edges.
5. The next save persists both, so the duplicates survive reopening
   (the issue's second repro path). The mergeFile checksum stays valid
   throughout: the merge is internally consistent; the duplication is
   semantic (external whole-file rollback+echo vs. user compensation),
   so no existing guard can see it.

Every observable in the issue matches: exact copies (style, label,
direction), floating/unattached only, appears "with a delay" (watch
poll + sync-client latency), OneDrive local sync, worse in
heavily-edited files (more saves, more rollback/echo windows).

## Fix (shipped with this rig)

`LocalFile` in `js/desktop/ElectronApp.js` keeps a session ring of own
content hashes (load + every save, `recordOwnState`). The
`synchronizeFile` override — both conflict entry points converge there —
detects an on-disk state that equals an older own state and asks
(`fileReplacedByOlder` resource) instead of merging silently:
*Overwrite* writes the current version back to disk (neutralizes the
echo and the silent rollback loss), *Synchronize* adopts the older
state as an explicit choice. Genuinely new external content (hash not
in the ring) merges exactly as before. Residual gap: an echo from a
previous session (ring is session-scoped) falls back to today's
behavior; an `mxfile` revision counter would close that exactly if
field reports demand it.

With the fix, `dup` exercises the dialog on both steps (D2 rollback →
Synchronize, D4 echo → Overwrite), asserts no duplicate and that a
genuinely newer external content still merges dialog-free (D6), and
ends with `RESULT: GREEN (stale-rewrite guard active, ...)`. Reverting
the ElectronApp.js guard turns it back to `RESULT: RED`.

## Usage

Requires a `drawio-desktop` checkout with `node_modules` installed as a
sibling of this repo (or set `DRAWIO_DESKTOP`). Runs Electron with an
isolated `APPDATA` (no impact on the real installation), drives the
renderer via CDP on port 9333 (no app modification), and simulates the
sync client by rewriting the open file directly.

    node drive2382.js dup             # deterministic red repro (above)
    node drive2382.js probe           # mechanics walkthrough, no verdict
    node drive2382.js storm --seed 3 --rounds 30   # randomized hunt
    node drive2382.js dup --dev 1     # run against dev sources: point
                                      # the desktop drawio submodule (or
                                      # a junction) at this repo first

`dup` ends with `RESULT: RED (duplicate reproduced)` when the model and
the saved file contain the twin edges (verdicts `R2 identical twins` +
`R1 ghost floating edge`); `expected-red-file.xml` is a reference red
output. Runtime artifacts (`work/`, `appdata/`, `snaps/`, `log-*.txt`)
stay untracked.
