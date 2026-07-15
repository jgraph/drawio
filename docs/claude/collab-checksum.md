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

Paths already traced correct (don't re-investigate): `moved`-chain reordering,
cross-parent moves (`createParentLookup`), `backgroundImage`/`extFonts`
normalization, `clonePage` completeness, attr XOR order-independence,
`mxCodec` reuse.

**Key files**: `DrawioFile.js` (mergeFile 384, checksumError 606);
`DiffSync.js` (diffPages 807, diffCells 998, patchPages 110,
patchCellRecursive 518, viewStateProperties 34); `EditorUi.js`
(getHashValueForPages 3611, hashValue 3680); `Pages.js` (saveViewState 761,
updatePageRoot 1057, clonePage 1506).
