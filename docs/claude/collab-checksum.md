# Realtime collaboration & checksum debugging

`DrawioFile.mergeFile` (line 384) verifies the round-trip invariant
`patchPages(clonePages(shadow), diffPages(shadow, serverPages)) ==
serverPages`; both sides are hashed via `getHashValueForPages` and compared. A
mismatch means the diff/patch cycle is lossy for that file state.

`checksumError` (DrawioFile.js:606) encodes metadata in URL params: `expected`
(hash of patched shadow), `current` (hash of server pages = ground truth),
`rev` (`hashValue(getCurrentRevisionId())`), `latest`/`latestRev` (fresh fetch
of latest), `latestVersion`/`latestType` (`version`/`type` attrs of `<mxfile>`
root, type defaults "unknown"), `bytes` (patch JSON size; data included only
if <1000), `patches` (count), `size` (file size). When `current==latest` &&
`rev==latestRev` the server is consistent — the bug is purely in the
diff/patch round-trip.

**Hash** (`getHashValueForPages`, EditorUi.js:3611) is over XML, not JS
objects: attrs XOR-combined (order-independent); children order-dependent
(`((hash<<5)-hash+child)<<0`); geometry x/y/w/h `Math.round()`ed;
`pageWidth`/`pageHeight` removed; transient view state (`grid`, `guides`, …)
skipped (`ignoreTransient`); `mxCell.previous` ignored.

**Known causes (check in order)**:

1. view-state null asymmetry (DiffSync.js:1058 — `diffViewState` needs both
   sides non-null; else no diff but `saveViewState` defaults differ)
2. root ID change (DiffSync.js:1005 — skips `diffCellRecursive`, insertions
   only)
3. null cell IDs (DiffSync.js:915,948 — ignored in diff, hashed via
   `mxCellPath`)
4. external tools adding non-round-tripping XML
5. version property drift (props absent from `viewStateProperties`,
   DiffSync.js:34 — hashed, not diffed; check when `latestVersion` differs)
6. **page root id change** (`diffCells`: `newRoot.id != oldRoot.id` skips
   the walk and re-inserts EVERY cell under the new root, so `bytes` is
   about the page size). 31.5.0 (rt-v7) refused every root swap in
   `patchPage` because the root built from its entry has no children
   before the walk — nine mergeFile checksum errors in 41 h, all root
   changes; fixed by swapping first and checking the layer invariant
   after the walk (`root-change`).
   The usual SOURCE of a root id change was `mxModelCodec.decodeRoot`
   taking the LAST parentless cell as the root, so one cell with a
   missing or dangling `parent` flipped the root and the page's real
   content was dropped (drawio-dev#696). It now picks `0`, else the
   first non-vertex/non-edge candidate, else the first, and adopts the
   others into the default layer (`stray-root`). A file with one
   parentless cell — every well-formed file — decodes exactly as before.
   Both engines are exercised side by side against the pinned v6 app in
   `etc/rt-test/checksum-cases.html`.
   A checksum *report* (bytes < 1000) carries the anonymized patch as
   `-json_<Graph.compress>`: `gcloud logging read` the line, restore `+`
   for spaces, base64 → raw inflate → URL-decode.

Paths already traced correct (don't re-investigate): `moved`-chain reordering,
cross-parent moves (`createParentLookup`), `backgroundImage`/`extFonts`
normalization, `clonePage` completeness, attr XOR order-independence,
`mxCodec` reuse.

**Key files**: `DrawioFile.js` (mergeFile 384, checksumError 606);
`DiffSync.js` (diffPages 807, diffCells 998, patchPages 110,
patchCellRecursive 518, viewStateProperties 34); `EditorUi.js`
(getHashValueForPages 3611, hashValue 3680); `Pages.js` (saveViewState 761,
updatePageRoot 1057, clonePage 1506).
