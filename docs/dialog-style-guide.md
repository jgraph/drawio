# Dialog Style Guide

All new dialogs using `CustomDialog` should follow these patterns for consistent
appearance. CSS classes are defined in `/src/main/webapp/styles/grapheditor.css`.

**Which guide applies.** This guide covers the markup of dialogs and their
look in Classic, Sketch, Minimal and the previous look of Simple. In Fusion
(the theme Fusion, `ui=fusion`, `Editor.isSimpleModern()`) the same dialogs
are shown in the frame of `SimpleDialogs.js`, and their look (sizes S to XL,
insets, headline, footer, phone sheets, templates) follows
[claude/fusion-style-guide.md](claude/fusion-style-guide.md).
Build a dialog to this guide; check how it looks in Fusion against that
one.

## Auto-Height

Pass `null` for the height parameter in `showDialog()`. The `Dialog` constructor
measures `elt.scrollHeight` after the element is in the DOM and sizes the dialog
automatically. Never compute dialog heights manually with `height += N` increments.

```javascript
var dlg = new CustomDialog(this, div, okFn, null, mxResources.get('export'), helpLink);
this.showDialog(dlg.container, 360, null, true, true);
```

## Changes After Opening: Nothing Moves Under the Pointer

A control the user clicks stays where it is (the driver, 19 November 2026,
like Export in Apple's Pages): a dialog never re-centers after it is shown.
The one exception is Advanced of Print (the driver, 22 November 2026): its
height changes visibly, so the dialog is centered again when Advanced opens
or closes. `createPrintLayout` marks the content of Print with
`geDialogCenterAdvanced`, and `addAdvancedSection` then passes `center` to
`Dialog.setFrameHeight(div, height, top, center)`. The segments of Print
still switch in place, and every other dialog keeps its top, the Export
dialog included. Tests: `print-advanced-centers` and
`dialog-switches-in-place` in test/classic-simple.

- **Content that grows or shrinks** (a section that opens, rows that a
  choice adds) sets the frame's new height with
  `Dialog.setFrameHeight(div, height, top)` (grapheditor `Editor.js`),
  never with `div.style.height` alone: the frame keeps its top and grows or
  shrinks at its bottom. Where the window has no room below the top, the
  frame ends at the bottom of its room (`max-height`) and its content
  scrolls (see Viewport Overflow); a resize of the window centers it again
  with the full height. `addAdvancedSection`, `EditorUi.updateDialogHeight`
  (Layout Settings), `DataSourcesDialog.fit`, the color dialog and the
  `fit` of Fusion's `decorateSimpleDialog` use it.
- **Switches between kinds or formats** (tabs, segments, the formats of
  Export) keep the height of the dialog: it is sized once for its tallest
  kind, with more empty space below the kinds with fewer rows. The Export
  dialog has a fixed height (`PreviewDialog.exportHeight`, see Preview
  Template); the forms of Fusion measure each kind
  (`elt.simpleFitKinds(measure)`, Edit Link, Fonts). Frames with the class
  `geDialogFixedHeight` never change their height: `addAdvancedSection` and
  the `fit` of Fusion leave them alone, and their sections scroll.
- **A chosen segment or format is bold** and reserves that width in every
  state: a pseudo-element with `content: attr(...)`, `height: 0`,
  `visibility: hidden` and `font-weight: 600` (the `::after` of
  `data-label` of the formats of Export in Classic, the `::before` of
  `data-sm-text` of `SimpleUi.createToggleGroup` in the dialogs of Fusion,
  whose `::after` is the hit area of 44 on touch screens), so choosing one
  moves no other.
- **The label column** of Fusion's Layout settings only grows while the
  dialog is open (`SimpleUi.fitLabels(labels, cls, share, minColumn)`), so
  a type with shorter labels does not move the types and the controls.
- **Only changes the user causes keep the top**: the frame of a dialog
  records its last click or key (`frameInputTime`, capture listeners of the
  `Dialog` constructor), and `setFrameHeight` keeps the top within
  `Dialog.frameInputDelay` (1000 ms) of it; content that loads while the
  dialog opens (eg. the list of Layout settings) centers the frame as
  before, so it does not scroll where the window has room.

`dialog-switches-in-place` (`test/classic-simple/tests/19-dialog-switches.js`)
clicks every tab, segment and section of Print, Publish Link, Page Setup,
Insert › Template, Edit Link, Fonts, Layout Settings and the code dialogs in
Classic, Simple and Fusion; `export-dialog-fixed-height` (`04-export-dialog.js`) switches
through all formats of Export.

## Viewport Overflow

`.geDialog` is capped at viewport height by `max-height: 100%`. When the natural
dialog height exceeds the viewport (small screens, expanded sections), the
content area becomes scrollable so the footer stays reachable:

- **CustomDialog**: the wrapper is a flex column. Content sits in a scrollable
  middle region (`flex: 1 1 auto; min-height: 0; overflow-y: auto`). The button
  row is `flex: 0 0 auto` and stays pinned at the bottom.
- **Other dialogs**: a CSS safety net (`.geDialog > :first-child`) applies
  `max-height: 100%; overflow-y: auto` so the content scrolls if it overflows
  — buttons inside scroll with the content but remain reachable.
- **Close button (`.geButton`)**: positioned-absolute sibling of the content,
  so it stays at the top-right regardless of scroll.

## Spacing (handled by CustomDialog and Dialog)

- **Dialog padding**: 24px on all sides (`.geDialog` CSS)
- **Title margin-bottom**: 16px (`.geDialog h3` CSS)
- **Buttons margin-top**: 34px (default in `CustomDialog`)
- **Container padding-bottom**: 10px (`CustomDialog` adds this to prevent margin collapse)
- **Dialog chrome**: `Dialog` constructor adds 48px to both width and height for padding

These produce equal visual spacing above (34px) and below (34px = 10px + 24px) the
button row. Do not override these values in individual dialogs.

## Sections (`geDialogSection`)

Group related controls in rounded section containers:

```javascript
var section = document.createElement('div');
section.className = 'geDialogSection';
// ... add rows to section ...
div.appendChild(section);
```

**Row spacing is uniform and CSS-driven.** Every row inside a section
(`geDialogFormRow`, `geDialogCheckRow`, `geDialogInlineFields`) is spaced a
uniform `6px` from the previous one; the first visible row sits flush against the
section's 10px top padding. This is handled centrally in `grapheditor.css` — do
**not** add per-row `margin-top` (it only breaks the uniform rhythm). Because the
gap is between rows regardless of type, a section can freely mix form rows, check
rows and inline fields and they stay evenly spaced.

For the same reason, always wrap controls in a proper row class (or use
`addCheckbox(..., useCheckRow=true)`): row classes carry `min-height: 28px`, so
mixing a bare `addCheckbox` (no `useCheckRow`, which appends a raw
`<input><label><br>`) with row-based controls in one section yields inconsistent
row heights. A bare checkbox gets the same 6px fallback gap, but prefer
`useCheckRow=true` everywhere. If a first row can be hidden conditionally, remove
it from the DOM (e.g. `cb.checkRow.parentNode.removeChild(cb.checkRow)`) rather
than `display:none` — otherwise the now-visually-first row still loses its
`:first-child` top reset.

## Collapsible "Advanced" Section (`addAdvancedSection`)

For options that aren't needed in the common case (e.g. Edit / Layers / Tags
in the Publish Link, HTML Embed, and Embed Image dialogs), use
`EditorUi.addAdvancedSection(parent)`. It renders the same collapsible header
the Format panel uses (`.geCollapsibleTitle` + rotating CSS triangle, content
wrapped in `.geCollapsibleContent`) and the inner container is a regular
`geDialogSection` so checkbox rows look identical to the always-visible
section above it.

```javascript
var advanced = this.addAdvancedSection(div);            // labelKey defaults to 'advanced'
var advSection = advanced.content;                       // geDialogSection inside

this.addCheckbox(advSection, mxResources.get('layers'),
    true, null, null, null, null, null, true);
this.addCheckbox(advSection, mxResources.get('tags'),
    true, null, null, null, null, null, true);
```

Collapsed by default. The helper recomputes the enclosing `.geDialog`'s
height on every toggle so the new rows are not clipped by the dialog's
`overflow:hidden` (the Dialog constructor only measures once, at open time).
The frame keeps its top, so the title of the section stays under the pointer
(`Dialog.setFrameHeight`); frames with `geDialogFixedHeight` (the Export
dialog) keep their height and the section scrolls in its column.
Do not pass an explicit height to `showDialog` — keep `null` so the initial
measurement covers the collapsed state cleanly.

To keep multiple separate section cards inside the collapsed area, append
additional `geDialogSection` divs to `advanced.wrapper` (the collapsible
container); `advanced.content` then serves as the first card (see the
Page Setup dialog).

## Form Rows (`geDialogFormRow`)

Use for label + input pairs (text fields, selects):

```javascript
var row = document.createElement('div');
row.className = 'geDialogFormRow';

var lbl = document.createElement('span');
lbl.className = 'geDialogFormLabel';
mxUtils.write(lbl, mxResources.get('zoom') + ':');
row.appendChild(lbl);

var input = document.createElement('input');
input.setAttribute('type', 'text');
row.appendChild(input);

section.appendChild(row);
```

## Checkbox Rows (`geDialogCheckRow`)

Use `addCheckbox` with `useCheckRow=true` (9th parameter) for consistent checkbox
layout with flex alignment:

```javascript
var cb = this.addCheckbox(section, mxResources.get('shadow'),
    false, null, null, null, null, null, true);
```

For indented sub-options (e.g., "Layers" under "Lightbox"):

```javascript
cb.checkRow.style.paddingLeft = '24px';
```

## Inline Fields (`geDialogInlineFields` / `geDialogInlineField`)

Use for side-by-side fields (e.g., Width + Height):

```javascript
var row = document.createElement('div');
row.className = 'geDialogInlineFields';

var field = document.createElement('div');
field.className = 'geDialogInlineField';
// ... add label + input to field ...
row.appendChild(field);

section.appendChild(row);
```

## Preview Template (`PreviewDialog.js`)

Dialogs that show a picture of their result (Export, Print, and later the
dialogs of Classic and Simple that use it) use the Preview template of
`js/diagramly/PreviewDialog.js` (in app.min.js): the head with the title
and an optional subtitle, the preview on the left, the fields on the right
and the footer of `CustomDialog` below. Below 700 px the preview is above
the fields (`@media (max-width: 699px)`). The CSS is in `grapheditor.css`
under `.gePreviewTemplate`; Fusion uses the same functions in its own skin
(`PreviewDialog.skins.fusion` in `SimpleDialogs.js`, `fusion.css`).

```javascript
var dlg = ui.createPreviewDialog(mxResources.get('export'), mxResources.get('export'), function(dlg)
{
	// Returns false to keep the dialog, or a promise during which the
	// primary button is busy
});
var layout = dlg.layout;
layout.section(mxResources.get('options'));      // a geDialogSection card
layout.row(mxResources.get('what'), layout.choice(items, 'page', fn, mxResources.get('what')));
layout.checkRow(checkbox, mxResources.get('transparentBackground'));
ui.showDialog(dlg.container, 640, null, true, true);
dlg.init();                                        // Tab in the shown order
```

The Classic skin (`PreviewDialog.skins.classic`) follows this guide: a
section is a `geDialogSection` card with an optional title
(`gePreviewSectionTitle`), rows are `geDialogFormRow` with a
`geDialogFormLabel` that names the field (`for`) and `geDialogCheckRow`, a
choice of a few values is a list (`select`, not a toggle group) and an
option is a checkbox, not a switch; the hint of a check row
(`gePreviewCheckHint`) is in the `aria-describedby` of its checkbox.
Groups of tiles (`layout.tiles`, `gePreviewTile`) are one stop of Tab with
the arrow keys (`EditorUi.addRovingRadios`).

- **Picture**: `ui.createExportPreview(pane, img, getOptions, skin)` makes
  the SVG of what is exported (`Graph.getSvg`, which sanitizes the labels;
  the image shows it as a data URI) after the dialog is shown, and only
  when the options change; `getExportPreviewOptions` reads them from the
  controls of `showExportDialog`. `PreviewDialog.installRefresh(container,
  fn, ready)` refreshes at once for `change` and after typing rests for
  `input` (`EditorUi.previewDelay`, 150 ms).
- **Busy**: `dlg.setBusy(true)` (`PreviewDialog.setBusy`) puts a spinner
  (`geDialogSpinner`) before the text of the primary button, keeps its
  width, sets `aria-busy` and `aria-disabled` and ignores clicks;
  `setBusy(false)` restores it. The spinner stops with reduced motion.
- **Field errors**: `dlg.setFieldError(input, message)`
  (`PreviewDialog.setFieldError`) gives the field a red border
  (`geDialogFieldInvalid`, `aria-invalid`) and shows the message as text
  below it (`geDialogFieldError`, in `aria-describedby`); null removes both.
  Use it for errors of a field instead of an alert.
- **Tab order**: `dlg.init()` installs `installDialogTabOrder`: Tab follows
  the order in which the dialog shows its controls (CSS `order` and
  reversed flex directions) and the focus trap uses it for its ends.
- **Print** (batch 5 of the plan "Fusion ideas in Classic and Simple"):
  `PrintDialog.prototype.create` puts Print on the template in the Classic
  skin (`EditorUi.createPrintLayout`, 720 wide, `PreviewDialog.printWidth`)
  if `Editor.isPrintPreviewEnabled()` (the configuration `printPreview`;
  by default every theme in the web app, Sketch, Minimal and Atlas since
  17 November 2026, not the desktop app, Confluence and Jira or
  `embed=1`); it has the colors, the font and the corners of the other
  dialogs of the theme. The head has the title
  and what is printed (`getPrintSubtitle`: the file, the selection, the
  pages), the pane the first sheet of the page in the picture with the
  diagram where the output has it, the tiles of up to six sheets and a
  caption (`createPrintPreview`, classes `gePrintSheet`, `gePrintArea`,
  `gePrintSheets`, `gePrintSheetTile`; sheets are white paper, also in dark
  mode; the pane is at least 360 high where the window has room, a strut
  of the body (`.gePrint .gePreviewBody::before`) that the body clips, so
  in a lower window the pane shrinks and clips its sheets below and only
  the column of the fields scrolls, never the content of the dialog as
  well: the driver, 22 November 2026), and the column the fields of the dialog in their order with a
  Paper card (the size and orientation of Page Setup) before Advanced. The
  fields keep their IDs and handlers, so printing is unchanged. A change of
  the paper is one undoable edit that Cancel, Escape and closing take back
  and Print and Preview keep (`createPaperChanges`); the paper is disabled
  where Page Setup is. Fusion uses the same functions in its skin for its
  own controls (`createSimplePrintLayout`). PDF is a format of the Export
  dialog (below) with the same layout and the remote export of `fn`.
- **Export** (batch 4 of the plan "Fusion ideas in Classic and Simple"):
  File › Export... (the action `simpleExport`, `Menus.addExportEntry`)
  opens one Export dialog for all formats if `Editor.isExportDialogEnabled()`
  (the configuration `exportDialog`, by default Classic, Simple, Sketch,
  Minimal and Atlas in the web app, always Fusion; Sketch, Minimal and
  Atlas since 17 November 2026, like Print) and replaces Export as ▸ in the
  File button and the … menu of Simple while `Editor.isShortMenusEnabled()`
  (on in Simple in the web app, `shortMenus: false` brings the submenu
  back). Classic, Sketch, Minimal and Atlas keep Export as ▸ with its items
  of before, with Export... (`lastExport`) right before it (the driver, 16
  November 2026: new dialog, old menu; `shortMenus: true` gives them
  Export... alone): each
  item opens the Export dialog with its format, VSDX of one page too (the
  trigger `exportAs` of its item, `installExportDialogActions`); it has no
  Advanced... (the advanced export was removed). Embed ▸, the last submenu
  of Export as ▸ in Simple, Sketch and Minimal, follows Export... there
  (`Menus.isEmbedInExportAs`), once in the File menu of embeds, and both
  are hidden with `hideMenuItems: ['exportAs']`. The search offers
  Export... only while the dialog is on. The actions
  of the formats still open their dialogs: `showDialog` gives the dialog of
  the format that an action opens the layout of the template
  (`EditorUi.createExportLayout`, 720 wide, `PreviewDialog.exportWidth`)
  with the title Export, the file and page as the subtitle, the row of
  formats (`createExportFormatRow`, `gePreviewFormatRow`: buttons
  `gePreviewFormat` in a `gePreviewFormats` radio group with `aria-checked`,
  and More, a `select.gePreviewMoreFormats` with `gePreviewFormatOn` while
  one of its formats is chosen) and the purpose of the format below it, the
  picture, the Options card (What, Size 1×/2×/3× with the size in pixels,
  Look, Transparent Background; the fields of the dialog that they replace
  are hidden with `gePreviewReplaced` and changed through their events),
  More options with the rest of the fields of the dialog, Copy (PNG of the
  page or selection, where the clipboard takes images) and the primary
  button Export {format}. The fields keep their IDs and handlers, so the
  files are those of the dialogs of before byte for byte (test
  `export-dialog-bytes` in `test/classic-simple`). The row shows the
  formats by their clicks (`EditorUi.exportFormats`: PNG, PDF, JPEG, SVG,
  XML, HTML, WebP, JSON, VSDX where it can be exported, Animation, URL) as
  long as they fit on one line; the format with the highest rank goes to
  More first (URL, Animation, JSON, WebP, VSDX, HTML, …), VSDX is first in
  More when it has no room and PNG is always shown. More is there only
  while a format has no room; a focused format that goes to More leaves the
  focus on More, a focused More that goes away on the chosen format of the
  row. Another format closes the dialog and runs the action of
  its format with the changed choices of What, Size, Look, the border and
  Transparent (`chooseExportFormat`, `getExportChoices`), so the restricted
  files (`exportAs` disabled), the desktop app and the hidden items of
  `hideMenuItems` keep their rules. More has no Advanced...: the advanced
  export (`ExportDialog` of grapheditor) was removed, as the Export dialog
  has all its fields (the driver, 17 November 2026), and the action
  `export` opens the Export dialog (test `export-dialog-no-advanced` in
  `test/classic-simple`; see "The advanced export was removed" in
  [claude/export-dialogs.md](claude/export-dialogs.md)). The search finds
  the formats with the path of Export... and Export and Export as as
  keywords (Omnibox.js). The picture embeds the fonts of the labels once
  they are loaded (`createExportPreview`, as the print preview), so the
  hand-drawn font of Sketch and the fonts of the file show as in the file.
  The dialog has one height for all formats (the driver, 19 November 2026,
  as Export in Apple's Pages): `PreviewDialog.fixExportHeight` gives the
  frame the height of the tallest format, `PreviewDialog.exportHeight`
  (530, PDF; `exportNarrowHeight` 700 below 700 px, Animation), or the
  natural height of the first format where it is taller, with the class
  `geDialogFixedHeight` (the template fills it, More options scrolls in its
  column), and `chooseExportFormat` gives the dialog of the next format the
  height of the one it replaces, so the frame and the row of formats stay
  where they are. Each format reserves the width of its bold name
  (`data-label`, `.gePreviewFormat::after`). Fusion keeps its template L
  (`elt.simpleFixedHeight` of `createSimpleExportLayout`). Test
  `export-dialog-fixed-height` in `test/classic-simple`.

## Dialogs of Fusion in Simple (`Dialogs.js`)

Since 18 November 2026 (the driver: every dialog of Fusion in the Simple
theme, in the order of use) the dialogs of Fusion are laid out once in the
main app code, each with a Classic skin (this guide: sections, form rows,
checkboxes instead of switches, lists instead of toggle groups, the colors
of the dialogs light and dark, focus rings) and the skin of Fusion, which
its `Simple*.js` file adds, so the code exists once. Each has a row of
`Editor.featureDefaults` (on in Simple, fixed on in Fusion, off in Classic,
Sketch, Minimal and Atlas unless it is switched on) with its toggle in the
Configuration dialog; off, the dialog keeps its layout of before. Share of
files on Google Drive (`DriveClient.showPermissions`) is the share dialog
of Google, which Fusion does not replace, so it is not here.

### Revision History (`RevisionDialog.createLayout`, `revisionDialog`)

File › Revision History of Simple (the row `revisionDialog`: on in Simple,
fixed on in Fusion, off in Classic, Sketch, Minimal and Atlas) uses the
layout of Revision history of Fusion (the Preview template, mockup 57) in
the Classic skin: `RevisionDialog.createLayout(ui, dlg, skin)` of
`js/diagramly/Dialogs.js` (in app.min.js) lays the `RevisionDialog` out
again from its `controls` (the title, the rows of the table, the graph and
the compare graph, the tools, the buttons), which keep their listeners: the
new rows click the rows of the dialog, which load the versions, so Restore
(with its confirmation and the restore function of the storage), Open in
New Window, Create Revision, Compare, Merge, the pages and the zoom work as
before. `RevisionDialog.install` at the end of the constructor installs the
Classic skin (`RevisionDialog.skins.classic`) where the switch is on;
Fusion calls the same function with `RevisionDialog.skins.fusion` in
`SimpleFiles.js` (`createSimpleRevisionLayout`), whose classes and builders
(the dots, the glyphs, the badge of the version shown, the size L) keep its
look. `revisionDialog: false` or `revisionDialog=0` shows the dialog of
before.

- **Size**: 912 × 632 like Fusion (`RevisionDialog.size`, 960 × 680 with
  the frame), limited to the window by `RevisionDialog.getSize(dlg, 640,
  480)` where File › Revision History shows it (`Menus.js`); the dialog of
  before keeps 640 × 480.
- **Head**: the headline Revision History (`.gePreviewHead`, `h3`) and
  "file · storage" below it (`.geDialogHint.gePreviewSubtitle`, the title of
  the file and the title of its storage in `App.storages`).
- **Versions** (`.geRevisionDlgSide`, 240 wide): the section title Versions
  (`.gePreviewSectionTitle`), then the list `.geRevisionDlgList`
  (`role="listbox"`, `aria-label`, a hairline border
  `--field-border-color` / `--dark-field-border-color`, radius 8, padding 4
  for the rings, scrolls). Rows `.geRevisionDlgRow` (`role="option"`,
  roving tabindex, min-height 40, padding 4 8, radius 6): the time
  (`.geRevisionDlgDate`, 600 when chosen; `getSimpleTimeTitle`, the date
  of before in skins without the captions), who changed it and the size as
  text (`.geRevisionDlgHint`, 12px, the secondary text `#5f5f63` /
  `--dark-secondary-text-color`; names go through `mxUtils.write`, never
  HTML) and the pill Current on the newest (`.geRevisionDlgBadge`). Hover
  tints the row, the chosen row is `.geRevisionDlgOn` (`aria-selected`,
  16 % of the focus color, its text in the focus color, 4.5:1 in both
  modes); the focus ring is the outline of the dialogs (2px, the focus
  color, inside the row). The arrow keys, Home and End choose, Enter
  restores, Space chooses, a double click opens the version in a new
  window (the double click of the dialog). The table of before stays in the
  dialog, hidden (`.geRevisionDlgReplaced`). The rows are grouped by day
  like the panel Versions of Fusion: a group `.geRevisionDlgGroup`
  (`role="group"`, `aria-label` the caption) per day with its caption
  `.geRevisionDlgDay` (Today, Yesterday, else the weekday and the date,
  with the year if it is not this year: `EditorUi.getSimpleDayTitle`,
  shared with Fusion in `EditorUi.js`; 12px, 600, the secondary text,
  padding 10 8 2, 4 at the top of the first, `aria-hidden` as the group
  is named after it).
- **Preview** (`.geRevisionDlgMain`): the pane `.gePreviewPane.geRevisionDlgPane`
  with the graph and the compare graph of the dialog (`.geRevisionDlgGraph`,
  inset 0, the background of the page); without versions the text of the
  dialog (No revisions, Not available) in the pane (`.geRevisionDlgEmpty`).
  Below it the tools of the dialog as a row (`.geRevisionDlgTools`, gap 4,
  min-height 32): the version shown (`.geDialogHint`, its date and who),
  Compare, the zoom, the pages (up to 160) and Merge.
- **Comparison** (the comparison of the panel Versions of Fusion,
  `RevisionDialog.createCompare`, only with the classes of the comparison
  of the Classic skin and two versions or more; Fusion keeps its dialog
  and compares in its panel): between the pane and the tools the row
  `.geRevisionDlgCompare` (flex, wraps, gap 4 8, min-height 28) with
  Compare with (a `label` for the select, the secondary text), the select
  (up to 240: Current, the current diagram of the dialog, then the other
  versions as "day · time"; the shown version is off) and on the right
  the count `.geRevisionDlgCount` (`role="status"`, 12px, the secondary
  text, `.geRevisionDlgError` in the error color): Differences: n
  (`versionDifferences`), Page not found if the current diagram has not
  the shown page, Not in this version if the version compared with has
  not it, Loading... and Error loading file; empty for the current version
  with the current diagram. The cells that are added, removed, changed or
  moved in the order of their siblings (eg. To Front: of the siblings in
  both, the fewest that keep the others in their order) between the shown
  page and the page with its ID in the other version
  (`RevisionDialog.getCellXml`, `getChanges`, shared with Fusion; a version
  without pages is the first page) are counted, and the shapes and connectors among them are framed in the
  preview (`.geRevisionDlgMarks` above the graph in its container, so
  they move while it is panned, redrawn on zoom and pan;
  `.geRevisionDlgMark`: 2px in the focus color, 4 outside the bounds,
  radius 4, `RevisionDialog.addChangeMarks`). The version compared with
  has the pill Compare (`.geRevisionDlgBadge`), and Compare of the tools
  shows it (or the current diagram) instead of the shown page while it is
  pressed with the pointer or Space or Enter is held on it
  (`controls.getCompare`, the page of the count with the background of
  its page), with its frames and its name in the information; pressed
  while the version loads it shows Loading... and then the version. A
  click on the version compared with compares it with the current diagram
  again.
- **Footer** (`.geRevisionDlgFooter`): Open in New Window (the button Open
  of the dialog, relabelled) and Create Revision (Google Drive) on the left
  (`.geRevisionDlgFooterStart`), Cancel and Restore (the primary) on the
  right in the order of the theme (`Editor.cancelFirst`).
- **Phones** (below 640): the preview above the versions, the list up to
  200 high.
- **Dark mode**: only `light-dark()` colors and the dark tokens; the
  buttons of the tools invert like every `.geButton`.

### More Shapes (`MoreShapesDialog.createLayout`, `moreShapesDialog`)

More Shapes (`MoreShapesDialog`, the menu Shapes › More Shapes) on the
Browser template of Fusion (concept 13.2): the headline More Shapes with
how many libraries are on below it, Enabled (the libraries that are on,
with their number, live) and the sections of the dialog as categories (a
vertical `tablist`, one tab stop, arrows, Home and End choose; the first
section is chosen), Search libraries over all sections (every word in the
name, the ID or the section, accents and case do not matter, 150 ms after
typing; Escape and Reset clear it, a category ends it; the head says the
category and its count, Results for or No results for), the libraries as
tiles (the top of the preview of the library on white paper as in the
dialog of before, a glyph for Search Shapes, the scratchpad and libraries
without a picture, the name 600 and the description or the section, the
checkbox of the dialog on the right; checked tiles have a tint of the
accent) and Labels and Remember this setting as checkboxes on the left of
the footer, Cancel and Apply on the right in the order of the theme
(`editor.cancelFirst`). A click on a tile (not on its checkbox) shows the
preview of the dialog with Back, the name and the checkbox above it
(Shift+Arrow Left in the preview goes back); offline (the compact dialog)
there is no preview and a click on a tile switches its library. Enter
applies, also in the search field.

The layout is `MoreShapesDialog.createLayout(ui, dlg, skin)` in
`Dialogs.js` (with `createCats` and `createSearch`); it rebuilds the dialog
from `MoreShapesDialog.controls` (the checkboxes, Labels, Remember this
setting and the buttons move into the layout with their listeners, the
list and the table of before stay hidden with `geBrowserReplaced`), so
Apply sets the same libraries, labels and scratchpad as before.
`MoreShapesDialog.install` at the end of the constructor installs the
Classic skin (`MoreShapesDialog.skins.classic`) where the switch is on;
Menus.js and the plugin of Confluence Cloud (`plugins/cConf-1-4-8.js`)
size the dialog with `MoreShapesDialog.getSize` (the size of New, 1132 ×
692, limited to the window; the size of the caller for the dialog of
before). Fusion calls the same layout with
`MoreShapesDialog.skins.fusion` (`SimpleLibraries.js`: switches, the frame
XL, sentence case). Labels and descriptions of libraries come from the
configuration and are written as text; pictures are only shown for data,
http(s) and relative URLs.

The CSS reuses the Browser template of New (`.geBrowser`: the head, the
categories, the search, the footer) and adds `.geShapesDlg` in
`grapheditor.css` (after the marker "More Shapes in the Classic skin"):
the grid of tiles (260 and more, gap 8, cards with a border 1, radius 8,
56 high; the picture 104 × 42 with a border; below 640 px one column, the
picture 64 wide, the options above the buttons), the preview (a card with
a border 1, radius 8) and the options. The glyphs are those of the Browser
template and `MoreShapesDialog.glyphs` (check, note, back) as masks in the
color of the text; the focus rings are outlines in the accent of the
dialogs, so dark mode keeps them. Tests: `more-shapes-*` in
`test/classic-simple` (`tests/20-more-shapes-dialog.js`).

### Create Shape and Edit Shape (`EditShapeDialog.createLayout`, `editShapeDialog`)

Create Shape (Insert › Shape…) and Edit Shape of Simple use
the shape editor of Fusion in the Classic skin:
`EditShapeDialog.createLayout(ui, dlg, cell, skin)` of
`js/diagramly/Dialogs.js` (in app.min.js) lays the `EditShapeDialog` out
again from its own controls (`dlg.controls`: the text area, the preview,
Preview, Apply and Cancel keep their listeners; the old title, the old
content and Preview are hidden with `geEditShapeDlgReplaced`), so Apply,
Insert and Ctrl+Enter set the same stencil as before (`editShapeDialog=0`).
`EditShapeDialog.install` at the end of the constructor installs the
Classic skin (`EditShapeDialog.skins.classic`) where the switch is on and
sets `dlg.width`, `dlg.height` and `dlg.minSize`, which the actions of
`Menus.js` pass to `showDialog`: 800 x 520 (`EditShapeDialog.size`),
limited to the window, resizable down to 480 x 360. Fusion calls the same
function with `EditShapeDialog.skins.fusion` in `SimplePreview.js`
(`createSimpleEditShapeLayout`; its builders `createLayout`, `getSubtitle`,
`createCodeField` and `arrangeFooter` make its DOM of before).

The parts: the headline Edit Shape or Create Shape (the `h3` of the Preview
template that names the dialog), the code `.geEditShapeDlgCode` on the left
(55 %, the XML in a monospace field of 12/18 without wrapping or spell
check, named Code; the errors `.geEditShapeDlgStatus` below it, Contains
validation errors in red, `light-dark(#c62828, #ff8a80)`, hidden while
empty), the preview `.geEditShapeDlgPane` on the right (45 %, the pane of
the Preview template: border 1, radius 8, white in light and
`--dark-color` in dark; the shape fitted with a border of 32) and the
footer `.geEditShapeDlgFooter` (help on the left, Cancel and Apply, or
Insert for a new shape, in the order of `Editor.cancelFirst`, 16 below).
Typing valid XML updates the preview after 400 ms
(`EditShapeDialog.previewDelay`, which clicks the hidden Preview); invalid
XML only shows the error below the code, and a coordinate of a drawing
command that is not a number (`EditShapeDialog.coordinates`) is not
painted. Below 700 px the preview (160 high) is above the code. Tests:
`edit-shape-dialog-*` in `test/classic-simple`
(`tests/20-edit-shape-dialog.js`).

### Background image (`BackgroundImageDialog.createLayout`, `backgroundDialog`)

The background of the page (`BackgroundImageDialog`: Background in the
Diagram tab of the Format panel, the background image of Page Setup) of
Simple is the layout of Fusion in the Classic skin:
`BackgroundImageDialog.createLayout(ui, dlg, skin)` in `Dialogs.js` lays
the dialog out again from its `controls` (the radios URL and Page, the URL
with its file input, Width and Height, the list of the pages, the fill and
its gradient, Reset, Cancel and Apply), which stay in the DOM where they
are not moved (`geBackgroundDlgReplaced` hides the rest) and keep their
handlers, so every option does what it did before. `install` at the end of
the constructor installs `BackgroundImageDialog.skins.classic` where the
switch is on (not in the chromeless viewer); Fusion calls the same function
with `skins.fusion` (`SimpleMoreForms.js`, `createSimpleBackgroundLayout`),
which keeps its subtitle (the page), its toggle group, switches and link
button. `dlg.layoutSkin` is the skin that laid the dialog out. The row
`backgroundDialog` is on in Simple on every platform, fixed on in Fusion,
and on online in Classic, Sketch, Minimal and Atlas since 22 November 2026
(the driver: "alles was im classic ist solle auch in min, sketch und atlas
sein, also … background image dialog"; online first, as every new default
of these themes).

- **Headline**: the `<h3>` Background, no subtitle.
- **Image** (`gePreviewSectionTitle` and a `geDialogSection` card): Type:
  as a list URL / Page (only where the file has more than one page; it
  checks the radio of before), then URL: with Open (Choose a File...) on
  its right and Width: and Height: with `px` (`geBackgroundDlgUnit`), or
  Page: with the list of the pages. The rows are `geDialogFormRow` with
  labels that name their field (`for=`); typing or dropping a URL chooses
  URL again (the observer of the radios keeps list and rows in step).
- **Fill** (only where the dialog has the fill): Fill Color and Gradient
  as `geDialogCheckRow` checkboxes (named with `aria-label`) with their
  color buttons (bordered, `title` and `aria-label` the name of the
  color) and the direction of the gradient as a list; disabled as before.
- **Footer**: Reset on the left, Cancel and Apply in the order of
  `Editor.cancelFirst` on the right (`geBackgroundDlgFooter`).
- **Enter** in a field, list or checkbox applies
  (`BackgroundImageDialog.addEnter`, in app.min.js; Enter on a button stays
  the button's). The dialog skips the change of the URL first
  (`controls.ignoreChange`, as the pointer down on Apply), as Apply loads
  the image and its size itself: the image loads once and an image that is
  not found shows its error once; Fusion's form does the same
  (`addSimpleFormEnter` with the same function before the blur).
- **Size**: 400 wide, the height of its content (`fit` when Type changes);
  the color buttons have the ring of the dialogs outside the swatch
  (outline 2, offset 2).

The CSS is in `grapheditor.css` under "The background image of the page in
the Classic skin" with the colors of the dialogs through `light-dark()`.
Tests: `tests/20-background-dialog.js` of
[test/classic-simple](../test/classic-simple/README.md) (Fusion:
`dialog-form-more` and `dialog-background-enter` of
[test/simple-modern](../test/simple-modern/README.md)).

## Template Browser (`TemplateBrowser.js`)

New and Insert › Template of Classic, Simple, Sketch, Minimal and Atlas
(the row `newDialog` of `Editor.featureDefaults`, on in these themes in
the web app, the desktop app and `embed=1`, off in Confluence and Jira
(`atlas=1`); the driver, 17 November 2026: Simple first, then "Use the
new New dialog in all themes", then "Also Desktop und Embed bekommen den
neuen Dialog, nur Confluence und Jira nicht") use the Browser template of
Fusion in the Classic skin, with
the colors, the font and the corners of the other dialogs of the theme:
`EditorUi.createTemplateBrowser(dlg, callback, skin)` of
`js/diagramly/TemplateBrowser.js` (in app.min.js) lays the `NewDialog` out
again from its `controls` (they move into the new layout with their
listeners or stay hidden with `geBrowserReplaced` and are driven),
so it creates and inserts as before. `installTemplateBrowser` at the end of
the `NewDialog` constructor installs the Classic skin
(`TemplateBrowser.skins.classic`) where the switch is on; the callers size
the dialog with `getNewDialogSize` (1132 × 692, limited to the window).
Fusion calls the same function with `TemplateBrowser.skins.fusion` in
`SimpleBrowser.js`. The compact dialog (offline, stealth and lockdown) is
not changed, and `newDialog: false` or `newDialog=0` (also in the configure
message of an embedding host) shows the dialog of before, which stays below
the browser. In the embed mode the footer has no place of the file, as the
host keeps it (the template message, `EditorUi.js`); the desktop app shows
Device alone. Where the app offers several storages
(`getNewDialogStorages`: those of Save as without Download and Open in New
Window), the place is a list of them (`createNewDialogPlace`, named Where,
the storage of the app chosen) that sets where Create makes the file
(`NewDialog.controls.setMode`); with one storage it shows its logo and name.

The CSS is in `grapheditor.css` under `.geBrowser`: the headline,
the categories on the left (200 wide, rows of 30, the glyph
16 as a mask in the color of the text, the name with an ellipsis, the
number 12 secondary; the chosen one tinted with the accent text color, 600),
the search (a field of 32 with the glyph and the clear button), Start from
(a row of chips of 30, card and border; Generate shows its form and
result below the row; From a template, the last chip with a chevron,
`.geBrowserStartMenu`, accent border while its menu of the places of File ›
Open from and URL is open, menus without icons; the chosen file at the right
end of the row, `.geBrowserStartFile`, up to 220 wide with an ellipsis and
Remove 18 `.geBrowserStartRemove`; below 640 wide, where the row scrolls,
a chosen file is scrolled into view; see `createNewDialogTemplateFile` and
From a template in `docs/claude/fusion-style-guide.md`), the tiles (a grid of 160 and more, gap 12, cards with a border 1,
radius 8; the picture 110 high on white paper, which dark mode inverts
with it as the dialog of before (`.geDarkMode .geAdaptiveAsset` on the
`.geTemplatePreview` of NewDialog, also the result of Generate, and the
large preview (the magnifier) on a picture with it; the images of hosts,
their magnifier and the glyphs are not inverted), the name 600
with an ellipsis; chosen: the accent border and a tint; the focus ring an
outline inside, so dark mode keeps it) and the footer (the name, the format,
the place and Import on the left (From Template URL is From a template in
Start from since 20 November 2026), Cancel and the
primary button on the right; the place `.geBrowserPlace` is 30 high with
the logo 20 at 9 and the name `.geBrowserPlaceName` at 37, trimmed to its
capitals with `text-box` so they are centered on the axis of the logo; the
list `select.geBrowserPlaceSelect` of several storages has the logo of the
chosen one inside it at the same place; the left of the footer wraps
instead of cutting its parts). The glyphs (`TemplateBrowser.glyphs`, the
24 px outline icons of Fusion) are data URIs in `--ge-browser-glyph`. Below
640 px the categories and Start from are rows that scroll above two columns
of tiles, and the name spans the footer. The subcategories of a category
show while it is chosen, and those above the chosen category stay open
(the driver, 19 November 2026: a click on a category may not move it away
under the pointer), so only rows below the chosen category move. Tests:
`new-dialog-*` in `test/classic-simple` (`tests/14-new-dialog.js`) and
`dialog-switches-in-place` (`tests/19-dialog-switches.js`).

## Start Screen (`StartScreen.js`)

The storage dialog of the first start (`StorageDialog` of
`App.showSplash`) and the splash dialog after it (`SplashDialog`) of Simple
use the start screen of Fusion ("Save diagrams to") in the Classic skin
(the row `startScreen` of `Editor.featureDefaults`: on in Simple online and
in the desktop app, fixed on in Fusion, off in Classic, Sketch, Minimal and
Atlas; the driver, 17 November 2026, named only Simple; the embed mode,
Confluence and Jira show neither dialog):
`EditorUi.createStartStorageLayout(dlg, skin)` and
`createStartSplashLayout(dlg, skin)` of `js/diagramly/StartScreen.js` (in
app.min.js) lay the dialogs out again from their `controls`, which stay in
the DOM hidden with `geStartReplaced` and are driven, so every choice calls
what it called before (`acceptTerms`, `setMode`, the next step, New and
Open). `installStartScreen` at the end of both constructors installs the
Classic skin (`StartScreen.skins.classic`) where the switch is on, and
`App.showSplash` sizes the dialog with `getStartScreenSize` (520 wide,
limited to the window, the height of its content). Fusion calls the same
functions with `StartScreen.skins.fusion` in `SimpleOpen.js`; the recent
files (`createStartRecentRows`, at most `StartScreen.recentLimit`, the
current file and storages that are off left out), opening one
(`openStartRecent`: the start screen comes back if it fails; paths in the
desktop app open like Open Recent) and the tiles (`createStartTiles`: a
radio group with the arrow keys, Enter and a double click run Choose,
storages that load later are disabled with Loading...) are shared.

The CSS is in `grapheditor.css` under `.geStart`, with the colors of the
other dialogs of the theme through `light-dark()` of the palette
(`--card-color`, `--field-border-color`, `--strong-text-color`,
`--focus-color` and their dark ones): the headline is the `<h3>` of the
dialog; the storages are tiles in a grid of three columns (two below 640
px), gap 8, cards with a border 1, radius 8, the logo 28 of the dialogs of
before and the name 600 (two lines at most); chosen: the accent border and
a tint; the recent files are rows of 36 under the section title of the
Preview template (`gePreviewSectionTitle`) with the logo 20 of the storage
(the glyph of a page in the desktop app), the name with an ellipsis and the
storage in gray `geDialogHint`, the name and the storage in the title of
the row; the splash has the storage as a card with the user and Change
Storage on the right and Change User as a row with the list; the Terms of
Use are 12 gray with links in the accent text color; the footer has Decide
Later (or the globe of the language menu of the desktop app and Sign out)
on the left and the buttons of the dialog on the right, without glyphs.
Focus rings are outlines inside of the tiles, the rows and the globe.
`startScreen: false` or `startScreen=0` shows the dialogs of before. Tests:
`start-screen-*` in `test/classic-simple` (`tests/18-start-screen.js`).
## Form Template (`FormTemplate.js`)

Edit Link (and Insert Link and the links of text, `LinkDialog`) and Save
as (also Make a Copy, Move to Folder and the place of an export,
`SaveDialog`) of Simple use the Form template of Fusion in the Classic skin
(the rows `linkDialog` and `saveDialog` of `Editor.featureDefaults`, on in
Simple in the web app, off in Classic, Sketch, Minimal and Atlas, where
`linkDialog: true` / `saveDialog: true` in the configuration or
`linkDialog=1` / `saveDialog=1` show it, fixed on in Fusion; the driver,
18 November 2026). `EditorUi.createLinkLayout(dlg, skin)` and
`createSaveLayout(dlg, skin)` of `js/diagramly/FormTemplate.js` (in
app.min.js) lay the dialog out again from its `controls`, which move into
the new layout with their listeners or stay hidden with `geFormReplaced`
and are driven, so the dialog links and saves as before.
`installLinkLayout` and `installSaveLayout` at the end of the constructors
install the Classic skin (`FormTemplate.skins.classic`) where the switch is
on (not for subclasses of `LinkDialog`, eg. the Confluence plugin's);
Fusion calls the same functions with `FormTemplate.skins.fusion` in
`SimpleForms.js`. `linkDialog: false` / `saveDialog: false` or `=0` show
the dialogs of before.

The Classic skin is the Preview template: the head (`gePreviewHead`, the
title and the shape, the page or the file as the subtitle), one section
(`geDialogSection geFormBody`) of form rows and the footer of the dialog
with the spacing of CustomDialog. Edit Link: Link (the kind, a list of
Page, URL and Action where the dialog has pages), then only the rows of the
chosen kind (`geFormPanel`, `display: contents`): the URL with Reset (a
button of 24, `geFormLinkReset`), the list of the pages, or the action with
its summary and Insert or Edit (which opens `CustomActionDialog` as before),
and Open in New Window as a checkbox row; the primary button is Apply
(Insert for Insert Link). Save as: the headline (Save as, Make a Copy, Move
to Folder or Create) with the file, Filename (not for Move to Folder),
Format (the list of the dialog) and Where (the list of the places with the
logo of the chosen storage inside it, `geFormPlacePick`); the picture of
an export is not shown, and the primary button names the action (Save,
Make a Copy, Move, Download, Open). Fusion's skin shows the kinds and the
formats as toggle groups, the pages and places as tiles and the options as
switches. In dark mode the fields and lists of the template show the focus
ring as an outline (see Keyboard Focus). Tests: `link-save-*`,
`link-form-*` and `save-form-*` in `test/classic-simple`
(`tests/19-link-save-forms.js`).

## Edit Style (`EditStyle.js`)

Edit Style of Classic, Simple, Sketch, Minimal and Atlas (the row
`editStyleDialog` of `Editor.featureDefaults`, on online in each, fixed in
Fusion; the driver, 17 November 2026: "Stil bearbeiten jetzt für Simple und
Classic zusammen bauen, mit Checkbox nach Regel", and since 22 November
2026 for Sketch, Minimal and Atlas: "edit style dialog können wir in allen
themes den neuen nehmen"; the desktop app, Confluence, Jira and the embed
mode keep the dialog of before for now) uses the Code template of
Fusion in the Classic skin: `EditorUi.createEditStyleLayout(dlg, skin)` of
`js/diagramly/EditStyle.js` (in app.min.js) lays the `TextareaDialog` of
the action `editStyle...` out again (the text area and the buttons move
into the new layout with their listeners, the lines are joined in a capture
listener of Apply, so the style is applied as before). The action asks
`EditorUi.layoutEditStyleDialog(dlg, cells)` (a hook of grapheditor that
keeps the dialog of before at 420 × 300) for the layout and its size; the
override of `EditStyle.js` installs `EditStyle.skins.classic` where the
switch is on and opens the dialog at 672 × 452 (limited to the window,
resizable down to 480 × 320, its size stored under `editStyleCode`, not
the key of the dialog of before). Fusion calls the same function with
`EditStyle.skins.fusion` in `SimpleForms.js`; the colours of the code
(`EditStyle.addCodeColors`, `EditStyle.fillCode`) and the format of the
style (`EditStyle.formatStyle`) are shared too. Semicolons separate the
properties, and so does a line break where the next line starts a property
(a key and `=` or the name of a style, `EditStyle.nextSeparator`); other
lines continue the value before them, so a value on several lines (a
`points` array of JSON) stays one property. The preview renders the draft
with its fonts in a lookup of its own, so a `fontSource` of the draft never
replaces a font of the document (Codex's review of #1502).

The Classic skin follows this guide: the plain `<h3>` with a hint below
that names the shape (`Start (Rectangle)`, or `2 shapes, 1 connector`),
One property per line as a checkbox row (`geDialogCheckRow`, a switch only
in Fusion), Copy Style a `geBtn` on the left of the footer, Cancel and
Apply on the right. The CSS is in `grapheditor.css` under `.geEditStyle`:
the code field (the field color, a border, radius 6, 13 px monospace, rows
of 20) with the line numbers in a gutter of 40, the keys in the accent text
color, the separators `=` and `;` and the line numbers in the hint gray
(each at least 4.5:1 on the field light and dark), colors with swatches of
12 after their line (one property per line) or underlined in their color
(one line), the preview (208 wide, 120 high, white paper in light mode, the
dark color in dark mode, the shape rendered in the mode). The ring of the
focus of the code field is the accent border with an outline inside, as
dark mode removes shadows. Below 640 px the preview is below the code. The
search of the properties stays in Fusion (`SimpleFormParts.js`). Tests:
`edit-style-*` in `test/classic-simple` (`tests/19-edit-style.js`).

The swatches are buttons in both skins (the driver, 23 November 2026:
"color boxes in the editor dialogs should be clickable";
`EditStyle.addSwatchButtons`): the inert layer of the colours lets the
pointer through, so a toolbar `.geEditStyleSwatches` (named Swatches)
under it holds a transparent button of 20 × the line on each swatch
(hover and pressed a tint of the text, the ring an outline of 2 inside,
the title Color Picker, the name `key=value`); a click, a tap, Enter or
Space opens the color dialog of the Format panel over Edit Style
(`EditStyle.pickColor`, `EditorUi.pickColor` stacks the modal dialog) with
the value and the key as its headline. Apply replaces exactly that value
(`EditStyle.replaceColor`: typed with `insertText`, so Undo of the text
area takes it back and then what was typed before it, and the caret is
after the value; after a tap the text area has the focus only while the
value is typed, with `inputmode` none, as the keyboard of a phone would
come up, and the focus goes back, and the code keeps its scrolling, which
Firefox and Safari would move to the caret, far from a swatch after a long
line, as far as the swatch stays in view: a shorter or longer value moves
the swatch with the end of its line, and the code then scrolls only as far
as it takes to show it with the margin of the focus); Cancel and the same color change
nothing. The buttons are one stop of Tab (the arrow keys, Home and End
move between them and scroll the code to them, buttons out of view are
hidden, the focus comes back to the swatch after the dialog). The places
of the buttons are measured without a transform of the dialog (the
pop-in of Fusion scales it). With a coarse pointer the target is 44 wide
(`::after` 4 before and 20 after it; a swatch after another one on its
line, code with several colors on a line, has none before it, which would
cover the end of the swatch before it: `data-after-swatch`); the line of
20 limits its height, as a taller target would cover the text of the
lines above and below (WCAG 2.5.8, a target constrained by the line
height of text). No
swatch for none, default, inherit, transparent and values that are no
color; one line has no swatches. Tests: `edit-style-swatch-*`
(`tests/34-edit-style-swatches.js`).

## Code Dialogs (`CodeDialogs.js`, `CodeField.js`)

Edit Diagram and Insert › Mermaid of Classic, Simple, Sketch, Minimal and
Atlas (the rows `editDiagramDialog` and `mermaidDialog` of
`Editor.featureDefaults`, on online in each, fixed in Fusion; the driver, 18
November 2026 for Classic and Simple, and since 22 November 2026 for
Sketch, Minimal and Atlas as Edit Style: "fusion edit diagram dialog auch in
den anderen themes, wie edit style"; the desktop app, Confluence, Jira and
the embed mode keep the dialogs of before for now) use the Code template
with the code field of Edit Style in the Classic skin: `EditorUi.createCodeDialogLayout(elt, opts)` of
`js/diagramly/CodeDialogs.js` (in app.min.js after `EditStyle.js`) lays the
`EditDiagramDialog` and the `ParseDialog` of Mermaid out again (the text
area and the buttons move into the new layout with their listeners, so
Apply and Insert do what they did before). The actions ask the hooks
`EditorUi.layoutEditDiagramDialog(dlg)` (grapheditor, 620 × 420 for the
dialog of before) and `EditorUi.layoutParseDialog(dlg, type)` (diagramly,
640 × 420) for the layout and the size: 800 × 540 limited to the window,
resizable down to 480 × 320, stored under `editDiagramCode` and
`mermaidCode`.

The Classic skin shares the CSS of Edit Style (`.geCodeDialog` next to
`.geEditStyle` in `grapheditor.css`): the plain `<h3>` with a hint below
that names the file (or the page if the file has several), the code field
with the line numbers in a gutter of 40 (wider for five digits and more),
the colours of XML (tag names `.geCodeTag` orange, attribute names
`.geCodeKey` in the accent text color, values `.geCodeValue` green, the
marks `<`, `/>`, `=` and the quotes and comments in the hint gray) and of
Mermaid (the type of the diagram and the directions as tags, keywords as
keys, strings and `|labels|` as values, arrows and brackets as marks, `%%`
comments); each at least 4.5:1 on the field light and dark. Below the
field the options row `.geCodeOptions` (the Type list of Mermaid with its
`<label>`) and the note `.geCodeNote` (hint, at the right, `role=status`);
the row is hidden while it has nothing to show. Footer: help and the
secondary actions (the list of Edit Diagram, Preview of Mermaid) on the
left, 8 apart, Cancel and the primary on the right; Close of Mermaid is
Cancel (it asks before it drops changes, as before).

The code field (`CodeField.attach`) keeps the text area of the browser
(search, undo, the keyboard, the clipboard) and shows only the numbers and
the colours of the lines in view (and 40 lines around them) in a layer
without pointer events, so diagrams of many megabytes stay fast; above
`CodeField.maxLength` (10 MB) colours and numbers are off and the note says
so, and code above `CodeField.fillLaterLength` (1 MB) is put into the
field after the dialog is shown ("Loading… (5.2 MB)"), with Apply off until
then. Limits and measurements: `docs/claude/code-field.md`. Fusion keeps
its layout (`SimpleCode.js`) with the same code field
(`CodeField.skins.fusion`). Tests: `code-dialogs-*`, `edit-diagram-*` and
`mermaid-layout` in `test/classic-simple` (`tests/20-code-dialogs.js`).

Insert › Advanced › From Text, SQL and PlantUML (the same `ParseDialog`)
and Arrange › Insert › CSV (the `SimpleTextareaDialog` of
`showImportCsvDialog`) use the same template in Simple: the rows
`fromTextDialog`, `sqlDialog`, `plantUmlDialog` and `csvDialog` (the
driver, 18 November 2026, "bring ALL Fusion dialogs into the Simple
theme", package 1: on online in Simple, off in Classic, Sketch, Minimal
and Atlas unless the URL or the configuration switch them on, fixed in
Fusion; `CodeDialogs.parseFeatures` names the row of each type; PlantUML
also on online in Classic, Sketch, Minimal and Atlas since 22 November
2026, the driver: "alles was im classic ist solle auch in min, sketch und
atlas sein, also … plantuml"; From Text, SQL and CSV too since 23 November
2026, with the live preview, see below). The
options row has the Type list with its `<label>` (From Text, PlantUML)
and Editable of From Text as a checkbox row (`.geCodeCheck`, remembered
as before); SQL and CSV have none. Footer: help (PlantUML and CSV, as
before), Preview and the link to report PlantUML issues (`.geCodeLink`,
12 px) on the left, Cancel (Close before, it still asks before it drops
changes) and Insert or Import on the right. Sizes as Mermaid, stored under
`fromTextCode`, `formatSqlCode`, `plantUmlCode` and `csvCode`. CSV asks the
hook `EditorUi.layoutImportCsvDialog(dlg)` (640 × 520 for the dialog of
before) each time it is shown, as the dialog is kept (a dialog of the
other layout is made again; the page in the hint is updated). The
languages without colours (From Text, SQL, PlantUML, CSV) show the line
numbers only.

### The live preview, the examples and the errors (23 November 2026)

The driver, 23 November 2026: "die vorschau bitte auch in den anderen
themes aktivieren, auch für from text. also d.h. neuen fusion dialog dort
verwenden". The code dialogs of Classic, Simple, Sketch, Minimal and Atlas
are the dialogs of Fusion in the Classic skin: From Text, SQL and CSV are
on online in every theme as Mermaid, PlantUML and Edit Diagram (the rows of
`Editor.featureDefaults`; none has `publicBuild`, so the public build keeps
the dialogs of before), and each has the live preview of Fusion next to the
code:

- **Layout**: `createCodeDialogLayout(elt, {side, onChange, ...})` makes
  the body `.geCodeBody.geCodeSplit`, a grid of the code with its options
  (`.geCodeMain`: the field and the options row below it, the Type list and
  Editable stay there) and the side `.geCodeSide` (11 : 9, 16 apart).
  Below 640 px the side is below the code (the pane 120 high) and the chips
  are one row that scrolls sideways; a short window (eg. 390 × 360) scrolls
  the body, so the code (at least 120 with its options) and the preview stay
  above the footer.
- **Preview** (`CodeDialogs.createPreview`, `createCodePreview` of
  `LayoutCode.js` with the classes `geCodePane`, `geCodeCaption`,
  `geCodePaused`, `geCodeExample`): the paper of Edit Style (border 1,
  radius 8, white light, the dark color dark, the diagram rendered in the
  mode), at least 96 high and growing with the dialog, the caption below it
  (`geDialogHint`, centred, `role=status`: Preview, Preview paused, Example:
  …, Last valid preview or Invalid input). The previews are those of Fusion
  (`createSimpleParsePreview`, `createSimpleCsvPreview` and
  `createSimpleDiagramPreview` of `LayoutCode.js`): what Insert or Import
  adds, or the page that Apply of Edit Diagram takes (the first page of a
  whole file, `getSimpleDiagramPreviewModel`), in a graph of its own, with the budget
  and the pause of Fusion. The code is a draft until it is inserted or applied,
  so the graph of every preview of code (also Edit Style) goes through
  `EditorUi.isolateSimplePreview`: its fonts stay out of the fonts of the
  document and it loads no images but data URIs. Edit Diagram has no examples and no error state
  (as Fusion: an error says Invalid input).
- **Examples** (`CodeDialogs.addExamples`, `addCodeExamples` of
  `CodeExamples.js` with `CodeDialogs.examplesSkin`) of From Text (11),
  Mermaid (8), PlantUML (8), SQL (3) and CSV (2) above the preview: the
  head Examples (12, 600, hint gray, as the section heads of Edit Outline),
  chips `.geCodeChip` (24 high, padding 0 8, radius 12, border of the
  field, 12/16, the hover tint; the loaded example `geCodeOn` with the
  accent border and text, 600, `aria-current`) and Undo `.geCodeUndo` (a
  link in the accent text color, 600). Pointing at a chip or focusing it
  shows its example with the edge of the pane in the accent (border and an
  outline of 1 inside, as dark mode removes shadows).
- **Errors** (`CodeDialogs.installErrors`, `installCodeErrors` of
  `CodeExamples.js`): the last good preview stays, dimmed (0.32, gray),
  with the box `.geCodeError` at the bottom of the pane (8 from its edges,
  border and tint of the error color of the fields `--es-error`, light
  `#c62828`, dark `#ff8a80`, radius 6, 12/16, at most 4 lines), "Line N:"
  in the error color and 600, and for Mermaid code in PlantUML (or the
  other way) the link `.geCodeErrorAction` that opens the other dialog
  with the code (not in the dialogs of New). The line is marked in the code
  field (`CodeField.skins.classic`: `geCodeErrorBand`, a band of 14 % of the
  error color, and `geCodeErrorNumber`), and the text area gets
  `aria-invalid` and `aria-describedby` of the box.

Focus rings are outlines of 2 inside (chips, Undo, the link, the paused
pane). Fusion keeps its layout (`SimpleCode.js`, `fusion.css`). Tests:
`code-previews-*` in `test/classic-simple` (`tests/33-code-previews.js`).

## Embed Dialogs (`EmbedLayout.js`)

Publish › Link (the row `publishLinkDialog`), Embed › IFrame, Notion,
HTML, Image and SVG and the link or the code to embed of `EmbedDialog`
after them (the row `embedDialog`; both on online in Simple, off in
Classic, Sketch, Minimal and Atlas unless switched on, fixed in Fusion;
package 1 as above) use the Form template of Fusion in the Classic skin.
One layout per dialog in `js/diagramly/EmbedLayout.js` (in app.min.js
after `CodeDialogs.js`): `createPublishLinkLayout`, `createHtmlLayout`,
`createEmbedImageLayout` and `createEmbedResultLayout` take a skin
(`EmbedLayout.skins.classic` here, `EmbedLayout.skins.fusion` in
`SimpleMoreForms.js`) and move the controls of the dialog of before
(`publishControls`, `htmlControls`, `embedImageControls`,
`EmbedDialog.controls`) with their listeners, so Create, Embed and Copy
pass what they passed before. The show functions ask the hook
`EditorUi.layoutEmbedOptionsDialog(elt, kind, controls, width)` for the
layout and the width (400 limited to the window, the height follows the
content); `EmbedDialog` calls `installLayout` at the end of its
constructor. The options of Export as › URL and HTML (`exportPending`)
keep the layout of the Export dialog.

The Classic skin: the head of the Preview template (`gePreviewHead`, the
title and the file as a hint), section titles (`gePreviewSectionTitle`,
`role=heading`) with a `geDialogSection` card of form rows
(`geDialogFormRow`, the label with a colon and `for`, the control in
`.geEmbedControl`) and checkbox rows (`geDialogCheckRow`; a hint below the
label as `.geEmbedHint`, the option below another indented by 24 as
`.geEmbedSub`); a section with one list hides the label of its row
(`.geEmbedRowGroup`, the list keeps its `aria-label`); More options is
`addAdvancedSection` (collapsed). The footer `.geEmbedButtons` is a flex
row: help and the link of the Notion extension (`.geEmbedFooterLink`) on
the left, Cancel and the primary on the right. In dark mode, which removes
the shadows, the lists and fields of the form show the ring of the focus
as a 1 px outline. The result: the headline (Link, Embed or the title of
the code), the file or the name and the size as the hint, the text in
`.geEmbedField` (the colours and the ring of the code field, monospace),
Preview, Export and Email on the left (`.geEmbedTertiary`), Close and Copy
on the right; Copy says what it did in the field (`.geEmbedStatus`,
`role=status`) instead of an alert. Fusion keeps its skin (switches,
toggle groups, glyphs). Tests: `simple-dialogs-1-*`,
`code-dialogs-more-layout`, `embed-dialogs-layout` and
`embed-result-layout` in `test/classic-simple`
(`tests/21-simple-dialogs-1.js`).

## Message Template (`MessageTemplate.js`)

Rename of files, pages and groups of pages in Simple (the row
`renameDialog` of `Editor.featureDefaults`, on online in Simple, off in
Classic, Sketch, Minimal and Atlas; the driver, 18 November 2026: Fusion's
Rename in Simple, only Simple named) shows the `FilenameDialog` on the
Message template of Fusion in the Classic skin:
`EditorUi.createPromptLayout(dlg, filename, buttonText, label, content,
skin)` of `js/diagramly/MessageTemplate.js` (in app.min.js) lays the
prompt out again in place: the headline (the label, or the verb of the
button if it names what the prompt does) and, for Rename of the current
file, its name and storage as the subtitle in the head of the Preview
template (`gePreviewHead`, `geDialogHint gePreviewSubtitle`; File ›
Rename marks its prompt with `EditorUi.withRenameFile`, so a page or a
group with the name of the file has none), the name on
its own row across the dialog (its label is hidden and names the field
with `aria-label`), Type without its colon and the buttons of the dialog.
The controls stay in the grid of the dialog with their listeners, so the
validation, Enter, Escape, the file types and the rename of the storage
are those of before. `FilenameDialog` calls the hook
`EditorUi.installPromptLayout` at the end of its constructor, which applies
the Classic skin (`MessageTemplate.skins.classic`) to prompts whose button
is Rename and that have no content of their own where the switch is on;
`showDialog` gives them the width of the template (372, limited to the
window, `getPromptLayoutWidth`) and the height of their content. Every
other prompt (custom zoom, the prompts of embedding hosts, OK prompts)
keeps its layout outside Fusion. Fusion calls the same function with
`MessageTemplate.skins.fusion` for all its prompts (`SimpleMessages.js`).

The CSS is in `grapheditor.css` under `.geMessageTemplate`, whose colors
are its own light-dark variables (`--mt-field-line`, `--mt-field`,
`--mt-accent`, from the palette of the theme): the field 32 high with the
border and the radius 6 of the fields of dialogs; focused, its border and
an outline of 1 in the focus color, so dark mode, which removes shadows,
keeps the ring. Tests: `rename-dialog-*` in `test/classic-simple`
(`tests/19-rename-dialog.js`).

## Sign-in layout (`AuthLayout.js`)

The sign-in to a storage of Classic, Simple, Sketch, Minimal and Atlas (the
row `authDialog` of `Editor.featureDefaults`, on in these themes on every
platform but in Confluence and Jira (`atlas=1`), fixed in Fusion; the
driver, 18 November 2026) uses the layout of Fusion's message in the Classic
skin: the Authorize dialog (`AuthDialog`), the end of a sign-in of OneDrive
(`BtnDialog`, Done) and the access to a file of Google Drive
(`showDriveAccessDialog`). `js/diagramly/AuthLayout.js` (in app.min.js) has
one function per dialog, `createAuthLayout`, `createSignedInLayout` and
`createDriveAccessLayout`, each taking a skin; `installAuthLayout` at the end
of the constructors installs the Classic skin (`AuthLayout.skins.classic`)
where the switch is on and Fusion is not the theme, and Fusion calls the same
functions with `AuthLayout.skins.fusion` (`SimpleMessages.js`,
`SimpleFiles.js`). The functions lay the dialog out again from its
`controls`: the Authorize button and the box of Remember Me move into the
new layout with their listeners (the old title and row stay hidden with
`geAuthReplaced`), so every
flow (popup and redirect, remember, cancel, errors, the terms) stays as it
was. The callers size the dialog with `AuthLayout.getWidth` (320, Done 300,
so it fits a phone of 375) and `AuthLayout.getHeight` (null: auto-height).

The look: the title as `h3` (16 below it, Drive access with the subtitle
"Google Drive · the account" in 12 secondary), the text in the strong text
color, Remember Me as a checkbox row (`geDialogCheckRow geAuthRemember`, the
label after the box), the Terms of Use as a hint (12, `#5f5f63` /
the dark secondary text, the links in the accent text color), and the
buttons on the right 34 below the content (`geAuthButtons`: Cancel and the
primary button in the order of the theme, `cancelFirst`). The logo of the
storage is 18 × 18 before the label of the primary button (`img.geAuthLogo`);
the white logos are dark in light mode (`brightness(0) opacity(0.8)` on
the light blue `.gePrimaryBtn`) and white in dark mode. The content has 4
on its sides inside the area that scrolls, so the focus rings of the
checkbox and the links are not clipped. The text of Authorize drops the
colon at its end, as the button no longer follows it: the ASCII colon, the
full-width colon of Chinese (U+FF1A) and the colon before the closing mark
of right-to-left texts (U+202C in Hebrew and Persian), which stays. The
focus starts on the primary button. `authDialog: false` or `authDialog=0` shows the dialogs of before.
Tests: `auth-dialog-*` in `test/classic-simple` (`tests/19-auth-dialog.js`).

## Image Dialog (`ImageDialog.createLayout`)

Insert › Image and Edit Image of Simple (the row `imageDialog` of
`Editor.featureDefaults`: on in Simple, fixed on in Fusion, off in
Classic, Sketch, Minimal and Atlas; the driver, 18 November 2026: the image
dialog of Simple replaced by the new one of Fusion) use the Place template
of Fusion in the Classic skin: `ImageDialog.createLayout(ui, dlg, title,
initialValue, ignoreExisting, skin)` of `js/diagramly/Dialogs.js` (in
app.min.js) lays the `ImageDialog` out again from its own controls (the
field, Open, Reset, Crop, Embed, Cancel and the primary button keep their
listeners; the rest is hidden with `geImageDlgReplaced`), so every way to
get an image works as before (the URL, Open, drag and drop on the dialog,
paste in the field, the question to resize large files, Crop, Embed and
`ImageDialog.filePicked` of the pickers). `ImageDialog.install` at the end
of the constructor installs the Classic skin (`ImageDialog.skins.classic`)
where the switch is on; Fusion calls the same function with
`ImageDialog.skins.fusion` in `SimpleCode.js` (`createSimpleImageLayout`).
`showImageDialog` lets the Classic skin take the height of its content.
`imageDialog: false` or `imageDialog=0` shows the dialog of before.

The CSS is in `grapheditor.css` under `.geImageDlg`: the headline Insert
Image or Edit Image (the title for other callers), the drop zone
`.geImageDlgDrop` (a dashed border 1 of the strong border color, radius 8,
on the section color; the image glyph in a tile of 36 on the card color,
what can be dropped, Choose a File…), the URL `.geImageDlgUrl` (a form row,
the field across the row, Reset as the icon button `.geImageDlgClear` of 24
with a focus ring inside), the preview `.geImageDlgPreview` (160 high, 12
below, a border 1, radius 8, on white in light and the dialog color in
dark; No preview until an image loads, only for `data:image/` and
`http(s)` links, not in lockdown) and the footer `.geImageDlgFooter` (Crop
and Embed on the left in `.geImageDlgTools`, Cancel and Insert or Apply on
the right, 34 below the preview). The glyphs (`ImageDialog.glyphs`) are
data URIs in `--ge-image-glyph`, drawn as a mask in the color of the text.
Tests: `image-dialog-*` in `test/classic-simple`
(`tests/18-image-dialog.js`).

## Crop Dialog (`CropImageDialog.createLayout`)

Crop of Simple (Edit › Crop, Format › Image › Crop and the crop step of
Insert › Image and Edit Image; the row `cropDialog` of
`Editor.featureDefaults`: on in Simple, fixed on in Fusion, off in Classic,
Sketch, Minimal and Atlas; the driver, 18 November 2026: the crop dialog of
Simple replaced by the new one of Fusion) uses the layout of Crop of Fusion
in the Classic skin: `CropImageDialog.createLayout(ui, dlg, skin)` of
`js/diagramly/Dialogs.js` (in app.min.js) lays the `CropImageDialog` out
again from its own controls (the picture with the crop handles, the zoom,
the radios of the shape, the slider of the corners, the fields X, Y, W, H,
Reset, Cancel and Apply keep their listeners; the radios and the zoom bar
are hidden with `geCropDlgReplaced` and driven), so the crop handles, the
shapes, the corners, Reset, undo (one edit of the caller) and the style
`clipPath` that the dialog returns work as before. `CropImageDialog.install`
at the end of the constructor installs the Classic skin
(`CropImageDialog.skins.classic`) where the switch is on; Fusion calls the
same function with `CropImageDialog.skins.fusion` in `SimplePreview.js`
(`createSimpleCropLayout`). The dialog has its size in `width`, `height`
and `minSize`, which both callers pass to `showDialog`: the Classic skin is
720 wide (`CropImageDialog.width`) and takes the height of its content.
`cropDialog: false` or `cropDialog=0` shows the dialog of before.

It is the Preview template in the Classic skin (`PreviewDialog.createLayout`
with `PreviewDialog.skins.classic`, the section above): the headline Crop,
the picture in the pane (`.geCropDlgPane`, at least 320 high, 262 on
phones, where it is above the fields), filled by the editor of the dialog
(`.geCropDlgCanvas`, a target of the focus with a ring inside, Enter
crops) down to a strip of 42 at the bottom of the pane with the tools Zoom
Out, Zoom In and Fit on the right (`.geCropDlgTools`, buttons
`.geCropDlgTool` of 28 with the glyphs of `CropImageDialog.glyphs` as
masks in the color of the text; under the picture, so that they never
cover a handle of the crop), a card
without a title with the lists Shape and Aspect Ratio (`select`, not
toggle groups; their labels name the card) and Arc Size, the slider of the
browser in the accent color (`.geCropDlgSlider`, disabled unless the crop
is rounded, so the dialog keeps its size), the card Area with Position and
Size (two fields and px, `.geCropDlgUnit`), and the footer
`.geCropDlgFooter` (Reset on the left, Cancel and Crop on the right in the
order of `Editor.cancelFirst`, 34 below the body). An aspect ratio
(`CropImageDialog.ratios`) makes the crop the largest rectangle with it in
the middle of the crop and keeps it while the handles resize it. The
colors are the variables of the dialogs (`--cd-line`, `--cd-text-2`,
`--cd-accent`). Tests: `crop-dialog-*` in `test/classic-simple`
(`tests/19-crop-dialog.js`).

## Data Sources (`DataSourcesLayout.js`)

Data Sources (`DataSourcesDialog`) and Add Source and Edit of a source
(`DataSourceDialog`) of Simple use the layout of Fusion (the Rules and the
Form template) in the Classic skin (the row `dataSourcesDialog` of
`Editor.featureDefaults`: on in Simple online and in the desktop app, fixed
on in Fusion, off in Classic, Sketch, Minimal and Atlas; the driver, 18
November 2026, named only Simple):
`EditorUi.createDataSourcesLayout(dlg, skin)` and
`createDataSourceLayout(dlg, skin)` of `js/diagramly/DataSourcesLayout.js`
(in app.min.js) lay the dialogs out again from their `controls`, which move
into the new layout with their listeners (the title of before stays hidden
with `geDataSourcesReplaced`), so Refresh, Refresh All, Edit, Delete, Add
Source, Preview and OK call what they called before.
`installDataSourcesLayout` and `installDataSourceLayout` at the end of both
constructors install the Classic skin (`DataSourcesLayout.skins.classic`)
where the switch is on (`Editor.isDataSourcesDialogEnabled`); the dialogs
keep their widths of before (560 and 600) and fit their height to the
content (`DataSourcesDialog.fit`). Fusion calls the same functions with
`DataSourcesLayout.skins.fusion` in `SimpleRules.js` (the classes of the
Rules and the Form template, the icon buttons, missing rows and the shapes
as toggle groups that set the selects, the checkbox of the template as a
switch).

The CSS is in `grapheditor.css` under `.geDataSources` and
`.geDataSourceForm`, with the colors of the other dialogs of the theme
through `light-dark()` of the palette (`--card-color`,
`--field-border-color`, `--strong-text-color`, `--focus-color` and their
dark ones): the headline is the `<h3>` of the dialog with the page below it
as a `geDialogHint` (`geDataSourcesHead`: the page of a file with more than
one page, else the file, else This Page, `DataSourcesLayout.getSubtitle`),
then the hint of before; each source is a row on a card (border 1, radius
8, padding 10 12, gap 8 between the rows) with an icon tile of 32 (radius 8,
the sheet glyph 18 of the template browser), the name 600 (at most 200 with
an ellipsis) and the link 12 gray on one line (stacked below 640 px), the
key column, columns and shapes and the last refresh (or its error in the
error color) as `geDialogHint`, and Refresh, Edit and Delete on the right
as `geBtn` of 28 with the images of before and their names
(`aria-label`); Add Source is a `geBtn` without a glyph below the rows;
the footer (`geDataSourcesFooter`) has Close and Refresh All as the
primary action (off without sources). The form has the labels in a column
of 110 (`label` bound to its field, above the fields below 640 px), the
link with Preview on one line and its hints below, a divider before the
options, the key column, missing rows, the shapes and the property as
selects, the columns as checkboxes (a `role="group"` with its name), the
template in monospace 12, the first rows of the preview in a frame with a
border (focusable, radius 6) and the primary action Add Source or Apply.
Enter in a field applies, in the link it loads the preview, Ctrl+Enter in
the template applies. Focus rings are the outlines of `geBtn` and an
outline inside of the preview. `dataSourcesDialog: false` or
`dataSourcesDialog=0` shows the dialogs of before. Tests: `data-sources-*`
in `test/classic-simple` (`tests/20-data-sources.js`).

The rows of the Classic skin select the shapes of a source as the panel
Data Sources of Fusion (`selectShapes` of the skin; the driver, 20 November
2026, the panels Data of Fusion are not in Simple):
`EditorUi.addDataSourceSelection` makes the name a button (the look of the
name, `geDataSourcesSelect`, the whole name and Select Shapes as its
title, as the name is cut at its width, an outline of 2 as its focus ring) whose click selects the shapes of the source that the
canvas shows and that can be selected (not those in a hidden layer or a
collapsed group, `DataSourcesLayout.getSelectableCells`) and scrolls to
the first (Shift or Ctrl/Cmd adds them, a source
without shapes keeps the selection, the dialog stays open), whose double
click edits the source, and adds More actions (…, `aria-haspopup="menu"`,
the 28 of the other buttons, `DataSourcesLayout.moreImage`) after Delete:
the menu of the rows of Fusion (`DataSourcesLayout.showMenu`) with Refresh,
Edit..., Select (selects the shapes and closes the dialog, off without
shapes to select), a line and Delete, which call the buttons of the row.
`DataSourcesLayout.getSelectableCells` and `selectCells` are shared with the
panel of Fusion (`SimpleDataSources.js`); the skin of Fusion has no
`selectShapes`, so its dialog stays as it is. Tests: `data-select*` in
`test/classic-simple` (`tests/26-data-select-page-data.js`).

## Layout Settings and the Layout Options (`LayoutForms.js`)

The options of the layouts of Simple (the ELK layouts of
`ElkLayout.runWithDialog`: flows, trees, radial and organic; Org Chart of
`showOrgChartConfigDialog`; Balloon Tree and Mindmap of `showLayoutDialog`;
also Edit Layout of a layout container and the Add list of the custom
layout) and Layout Settings (`showLayoutSettings` of `LayoutPicker.js`) use
the forms of Fusion in the Classic skin (the rows `layoutDialogs` and
`layoutSettingsDialog` of `Editor.featureDefaults`: on in Simple online and
in the desktop app, fixed on in Fusion, off in Classic, Sketch, Minimal and
Atlas; the driver, 18 November 2026, package 5, named only Simple). A
wrapper of `EditorUi.showDialog` in `js/diagramly/LayoutForms.js` (in
app.min.js) calls `installLayoutForms` before the frame measures the
dialog: `createElkLayoutForm`, `createOrgChartLayoutForm` and
`createLayoutOptionsForm` (for the `layoutControls` of the dialog) build
the form with `createLayoutForm(elt, title, subtitle, primaryLabel,
resetBtn, skin)`, which moves the controls of the dialog with their
listeners into the form and hides the content of before
(`geLayoutFormsReplaced`), so Apply (Add in the Add list of the custom
layout) writes what it wrote before (Edit Layout only the changed keys);
`createLayoutSettingsLayout` gives Layout Settings the head with what the
layout acts on (its scope hint, else the page or the file) and Ctrl+Enter
in Edit as JSON. The options of a layout are `LayoutForms.width` (440)
wide, limited to the window. Fusion calls the same functions with
`LayoutForms.skins.fusion` (`SimpleLayouts.js`: the Form template, toggle
groups for two to four short choices, switches, Reset as a link).

The CSS is in `grapheditor.css` under `.geLayoutForms` and
`.geLayoutFormsSettings`, with the colors of the other dialogs of the
theme: the head of the Preview template (the `<h3>` of the dialog and the
gray subtitle `geDialogHint gePreviewSubtitle`: the container, the
selection, else the page or the file), the sections Layout, Connectors and
Options as `gePreviewSectionTitle` with a `geDialogSection` card, the
fields in a grid of two columns (gap 12 and 8) with their labels above in
`--strong-text-color` and the controls 28 high in the field color of the
dialogs (`--field-color`), long choices across both columns; lists
(`<select>`) instead of toggle groups, checkbox rows (`geDialogCheckRow`)
instead of switches; the buttons of the dialog with Reset after the help.
Layout Settings keeps its rows and its chips (`geLayoutSegments`). Focus
rings are outlines (2, inside of the fields, `outline-offset: -2px`; 1
outside of the checkboxes, whose accent fill would hide one inside), as
dark mode removes the box shadows. `layoutDialogs: false` /
`layoutDialogs=0` and `layoutSettingsDialog: false` /
`layoutSettingsDialog=0` show the dialogs of before. Tests:
`layout-forms*` and `layout-settings` in `test/classic-simple`
(`tests/21-layout-forms.js`).

## Custom Layout and Edit Outline (`LayoutCode.js`)

The custom layout (Arrange › Layout › Custom..., Edit Layout of the other
layouts and their Add list, `showCustomLayoutDialog`) and Edit Outline and
Edit Text of the boxes of From Text (`showOutlineDialog`) of Simple use the
Code template of Fusion in the Classic skin (the rows `layoutDialogs` and
`outlineDialog` of `Editor.featureDefaults`: on in Simple, fixed on in
Fusion; the driver, 18 November 2026: all dialogs of Fusion in Simple;
`outlineDialog` also on online in Classic, Sketch, Minimal and Atlas since
22 November 2026, the driver: "neuer dialog für … edit text";
`layoutDialogs` stays off there): the `showDialog` wrapper of
`js/diagramly/LayoutCode.js` (in app.min.js) finds the dialogs by their
`layoutControls`, lays them out with `createCustomLayoutCode(elt, textarea,
skin)` and `createOutlineCode(elt, lc, skin)` before the frame measures
them and gives them `LayoutCode.size` (672 × 452, limited to the window).
The text area, the Add list, Copy and the buttons of the dialogs move into
the layout (the title of before and the select of Add stay hidden with
`geLayoutCodeReplaced` and are driven), so Apply, Add, Copy and Ctrl+Enter
do what they did. Fusion calls the same functions with
`LayoutCode.skins.fusion` in `SimpleLayouts.js` (its names
`createSimpleLayoutCode`, `createSimpleCustomLayout`,
`createSimpleOutlineLayout` and `createSimpleOutlinePreview` are wrappers);
the live previews of code (the budget, the graph of their own, the
scheduler and the pane), Tab to indent and the fields with line numbers are
in `LayoutCode.js` too, with the names that the code dialogs of Fusion use.

The CSS is in `grapheditor.css` under `.geLayoutCode`, with the colors of
the other dialogs of the theme through `light-dark()` of the palette
(`--card-color`, `--field-border-color`, `--strong-text-color`,
`--focus-color`, `--error-color` and their dark ones): the headline is the
`<h3>` of the dialog on the left with what it acts on below it in gray
`geDialogHint` (the layout container, else the selection, else the page or
the file); the body is a grid of the code and a side of 208 (below 600 px
the side is below the code and scrolls). The code is a card with a border
1 and radius 4, the line numbers in a gutter of 40 and the text in
monospace 12/18, the errors of the JSON below it in the error color (a
`role="status"`). The side has the section head Add (12, 600, gray) with
the layouts to add as plain buttons (rows of 28, the hover tint), or the
preview of the box (a card of 160 with the caption Preview, paused above
the budget: the pane is then a button that refreshes it once) and the two
hints of outlines in gray 12 (the `aria-describedby` of the text area). The
type of a new outline, where a dialog has it, stays a select. The footer
has Copy on the left and the buttons of the dialog on the right. Focus
rings are outlines of 2 inside the text area, the buttons of the side, the
paused preview and the side when it scrolls. `layoutDialogs: false` /
`layoutDialogs=0` and `outlineDialog: false` / `outlineDialog=0` show the
dialogs of before. Tests: `layout-code-*` in `test/classic-simple`
(`tests/22-layout-code.js`).

## Keyboard Shortcuts (`ShortcutsSheet.js`)

Help › Keyboard Shortcuts of Simple shows the shortcuts sheet of Fusion in
the Classic skin instead of `shortcuts.svg` (the row `shortcutsDialog` of
`Editor.featureDefaults`: on in Simple, fixed on in Fusion, off in Classic,
Sketch, Minimal and Atlas; the driver, 18 November 2026):
`EditorUi.getShortcutGroups(skin)` and `showShortcutsSheet(skin)` of
`js/diagramly/ShortcutsSheet.js` (in app.min.js) list the actions with a
shortcut by their place in the menus, from the entries of the omnibox
(`Omnibox.createEntries`, so actions that the configuration hides are left
out), groups in the order of the menus and rows by name, with a search of
the names and the keys (Escape clears it before it closes the dialog). The
skin adds the keys that are not in the menus: the Classic skin
(`ShortcutsSheet.skins.classic`) the keys of the in-place editor of labels
(Apply label Ctrl+Enter, Shift+Enter in Safari, New line in label Enter; the
Hand tool is in the View menu), Fusion its own (`SimpleHelp.js`,
`ShortcutsSheet.skins.fusion`, called by `getSimpleShortcutGroups` and
`showSimpleShortcutsDialog`). The action `keyboardShortcuts` of `Menus.js`
shows the Classic skin where `isShortcutsSheetEnabled` (the row on, not
Fusion, not chromeless, the omnibox loaded); without it `shortcuts.svg`
opens as before (a dialog in the desktop app, a link elsewhere).

The CSS is in `grapheditor.css` under `.geShortcuts`, with the colors of
the other dialogs of the theme through `light-dark()` of the palette: the
headline is the `<h3>` of the dialog; the search is a field of 32 with the
border of the fields, radius 6; below it the sections scroll (the title of
the Preview template, `gePreviewSectionTitle`, then the rows in a card of
`--card-color` with a border 1, radius 8); a row is at least 32 high with
the name on the left and the keys on the right in a key cap (12, border 1,
radius 4, `--soft-color` light, the dark field color dark, the strong text
color); No results for '…' is gray in the middle. The sheet is 552 × 560,
limited to the window (16 from its edges below 640 px). Focus rings are
outlines of 2 inside of the search and the sections. `shortcutsDialog:
false` or `shortcutsDialog=0` keeps `shortcuts.svg`. Tests:
`shortcuts-sheet-*` in `test/classic-simple` (`tests/23-shortcuts-sheet.js`).

## Drafts and Recovery (`DraftLayout.js`)

The draft dialog (`DraftDialog`: one draft of the embed mode with Edit,
Discard and Ignore, or the drafts of `App.js` with Delete All) and the
recovery dialog (`RecoveryDialog` of `EditorUi.showRecoveryDialog`: the
candidates of a file that could not be opened) of Simple use the layout of
Fusion's Drafts and Recovery in the Classic skin (the row `draftDialog` of
`Editor.featureDefaults`: on in Simple, fixed on in Fusion, off in Classic,
Sketch, Minimal and Atlas): `EditorUi.createDraftLayout(dlg, drafts, skin)`
and `createRecoveryLayout(dlg, skin)` of `js/diagramly/DraftLayout.js` (in
app.min.js) lay the dialogs out again from their `controls`. The graph, the
message, the zoom buttons and the buttons of the dialog move into the
layout; the select of the drafts and the rows of the candidates stay in the
DOM hidden with `geDraftLayoutReplaced` and are driven (a row chooses in
the select, which loads the draft, Delete All is its last option, Open
clicks the row of the candidate), so every button calls what it called
before. `installDraftLayout` and `installRecoveryLayout` at the end of both
constructors install the Classic skin (`DraftLayout.skins.classic`) where
the switch is on, and the callers size the dialog with `getDraftLayoutSize`
(640 × 480, limited to the window). Fusion calls the same functions with
`DraftLayout.skins.fusion` in `SimpleFiles.js`; the preview pane
(`setPreviewGraph`, `setPreviewTools`), the first page of a candidate as an
SVG data URI image (`createFilePreview`, in the colors of the theme, so it
is not inverted) and the listbox (`createChoiceList`: the arrow keys, Home
and End choose, Enter and a double click run the primary action, the texts
are written as text) are shared with Revision history of Fusion. In the
Classic skin (`pausePreviews`) Recovery keeps to the budget of the live
previews (`EditorUi.simplePreviewBudget.cells`, 400): the first page of a
candidate with more cells (counted in its XML before it is decoded) is not
drawn when it is chosen, the pane says Preview paused, click to refresh
(12/16 in gray) and is a button (a click, Enter or Space draws it once, the
focus goes back to the chosen row). Fusion's skin draws every candidate as
before.

The CSS is in `grapheditor.css` under `.geDraftLayout`, with the colors of
the other dialogs of the theme through `light-dark()` of the palette
(`--card-color`, `--field-border-color`, `--strong-text-color`,
`--focus-color` and their dark ones): the headline is the `<h3>` of the
dialog (Draft, Drafts or Recover file); the message 14/20 in gray; the
preview is a card with a border 1, radius 8, the badge Preview (12, a pill
with a border) at the top left and the graph 40 below the top, 12 from the
other edges, with a line of 1; the zoom buttons below it; several drafts
and the candidates are rows of at least 52 in a column of 200 next to the
preview, gap 16 (below 640 px the preview on top, the rows below it, the
body scrolls): cards with a border 1, radius 8, the name 14/20 (600 where
chosen) and the dates or the description 12/16 in gray; chosen: the accent
border and a tint of 12 %; the footer has Discard, Ignore and Delete All on
the left and Cancel and Edit (or Open) on the right. Focus rings are
outlines of 2 inside the rows and the buttons; Edit (or the first
candidate) has the focus on desktops. `draftDialog: false` or
`draftDialog=0` shows the dialogs of before. Tests: `draft-dialog-*` in
`test/classic-simple` (`tests/24-draft-dialog.js`).

## My Diagrams (`HomeDialog.js`)

My diagrams of Google Drive (`HomeDialog`, `App.showHome`) of Simple has
the layout of Fusion's home screen in the Classic skin (the row
`homeDialog` of `Editor.featureDefaults`: on in Simple, fixed on in Fusion,
off in Classic, Sketch, Minimal and Atlas; the driver, 18 November 2026):
`HomeDialog.prototype.createLayout(skin)` at the end of
`js/diagramly/HomeDialog.js` moves the parts of the dialog (so the views,
the search, the listings, Add from Google Drive, opening a diagram and New
Diagram are the same) into the headline My Diagrams with the storage below
it, the search with its glyph, Grid or List after it
(`HomeDialog.createViewSwitch`, kept in the settings as `simpleHomeView`,
shared with Fusion), the views as categories and a footer with who is
signed in on the left and New Diagram on the right. The constructor
installs the Classic skin (`HomeDialog.skins.classic`) where
`Editor.isHomeDialogEnabled` and the theme is not Fusion; Fusion calls the
same function with `HomeDialog.skins.fusion` (`SimpleFiles.js`, the
decorator of `HomeDialog`, `createSimpleHomeLayout`).

The CSS is in `grapheditor.css` under `.geHomeLayout` on top of the rules
of `.geHome`, with the colors of the other dialogs of the theme through
`light-dark()` of the palette: the headline is the `<h3>` of the dialog,
the storage 12 below it in the gray of `geDialogHint` (`#5f5f63`, 4.5:1 on
the dialog); the title of before is hidden (`geHomeLayoutReplaced`); the
search is a field of 32 (border of the fields, radius 6) with the
magnifier of the editor as a mask of 16 in the gray; Grid or List is a
select of 32 after it; the views and the tiles keep the look of `.geHome`
(tiles of `--card-color` with the strong text color); List shows the
diagrams as rows of at least 56 with a picture of 56 × 40
(`geHomeLayoutList`); the footer has 16 above it. Narrow dialogs (below 600,
`geHomeNarrow`) keep the search and Grid or List in one row and wrap the
views. Focus rings are outlines of 2 inside of the search field, the
select, the views and the tiles. The size is that of `App.showHome`.
`homeDialog: false` or `homeDialog=0` shows the dialog of before. Tests:
`home-dialog-*` in `test/classic-simple` (`tests/25-home-dialog.js`).

## Text Outline (`TextOutlineLayout.js`)

The Text Outline window of Simple (`TextOutlineWindow`, Ctrl+Shift+O) has
the layout of Fusion's Text Outline panel in the Classic skin (the row
`textOutlineWindow` of `Editor.featureDefaults`: on in Simple, fixed on in
Fusion, off in Classic, Sketch and Minimal; the driver, 20 November 2026):
`EditorUi.createTextOutlineLayout(skin)` of
`js/diagramly/TextOutlineLayout.js` (in app.min.js) builds the tree of the
layers, containers, shapes and connectors with the filter over the whole
page (from `EditorUi.simpleOutlineFilterMin`, 8 items), the labels edited
in place by double click or F2 (`startSimpleRename`, one undoable edit,
labels with formatting, entities or line breaks open the editor on the
canvas), a glyph per kind (`getTextOutlineGlyph`), from … to for
connectors and the empty state. `createTextOutlineWindow` puts it in an
`mxWindow` of the same size and position as before; the global
`TextOutlineWindow` calls it where `isTextOutlineLayoutInstalled` (the
switch on, not chromeless, not Fusion) and keeps `TextOutlineWindow.maxItems`.
Fusion calls the same function with `TextOutlineLayout.skins.fusion`
(`SimplePanels.js`, `createSimpleTextOutlinePanel`), so the tree, its keys,
ARIA and limits are one code.

The CSS is in `grapheditor.css` under `.geTextOutlineLayout` on top of the
rules of `.geTextOutline`, with the colors of the palette through
`light-dark()`: the filter is sticky at the top in the color of the window
(`--ge-panel-color`, as `table.mxWindow`), padding 6 6 2, a search field of
28 (border of the fields, radius 6, 12 px), and rows that get the focus
scroll out from under it (`scroll-padding-top: 36px`); the glyphs are masks of 16 in
the secondary text color (`--ge-outline-glyph`, the SVG data URI of
`TextOutlineLayout.getGlyphImage`, the same paths as `SimpleUi.icons`), 6
before the name; the meta (the kind or from … to) is 11 px in the secondary
color and shrinks before the name; context items of the filter and the notes
are in the secondary color; on a selected row the name, the meta and the
glyph take the accent text in full (the meta of 11 px has 4.5:1 only so; it
was at 75 % until the review of Codex of PR 1466); on the hover of a row
the meta and the names around matches are a little darker in light mode
(the secondary color 80 % with the strong text), and on the hover of a
selected row the accent text is a little lighter in dark mode (70 % with
white), so the text keeps 4.5:1 there too; the field of a label is 22 high
(radius 4) over the name; the empty state is a column with a glyph of 24,
No shapes (13/600 in the strong text color) and the hint (at most 220
wide). Focus rings are outlines of 2 inside of the search and the field.
`textOutlineWindow: false` or `textOutlineWindow=0` shows the window of
before. Tests: `text-outline-*` in `test/classic-simple`
(`tests/26-text-outline.js`).

## Library Editor (`LibraryLayout.js`)

The library editor (`LibraryDialog`) of Simple uses the layout of Fusion in
the Classic skin (the row `libraryDialog` of `Editor.featureDefaults`: on in
Simple, fixed on in Fusion, off in Classic, Sketch, Minimal and Atlas; the
driver, 18 November 2026, named only Simple):
`EditorUi.createLibraryLayout(dlg, file, mode, skin)` of
`js/diagramly/LibraryLayout.js` (in app.min.js) lays the dialog out again
from its `controls` (the name, Compressed, the grid, the hint of the empty
library and the buttons): the controls move into the layout and keep their
handlers, so every edit is the edit of before (rename in place with a click
or Enter, Space to select, Delete and Backspace, the drag and drop of the
dialog, Import, Add Images, Export, Link, Cancel and Save); the delete
button of each entry stays in the DOM hidden with the `replaced` class and
is clicked by the button of the layout. `installLibraryLayout` at the end of
the constructor installs the Classic skin (`LibraryLayout.skins.classic`)
where the switch is on, and `showLibraryDialog` sizes the dialog with
`getLibraryDialogSize` (720 × 540, limited to the window, at least 240).
Fusion calls the same function with `LibraryLayout.skins.fusion` in
`SimpleLibraries.js` (`createSimpleLibraryLayout`), which adds its icons,
the switch for Compressed and the touch drag of its cards; the skins differ
only in their classes and these builders.

The CSS is in `grapheditor.css` under `.geLibEditor`, with the colors of
the other dialogs of the theme through `light-dark()` of the palette
(`--field-border-color`, `--card-color`, `--field-color`,
`--strong-text-color`, `--focus-color` and their dark ones): the headline
is the `<h3>` of the dialog with the storage under it in 12 gray; the name
is a form row with its label and the field (Compressed, only with
`Editor.enableUncompressedLibraries`, stays a checkbox); the hint 12 gray
with Import and Add Images on its right; the shapes are cards in a grid
(columns of at least 136, two below 640 px, gap 10) in a box with a border
1 and radius 8 (dashed while the library is empty, with the hint of the
dialog of before in its middle); a card has a border 1, radius 8, the card
color, the picture 100 × 100 and its name under it (a tint on hover, the
field color and an outline in the accent color while renamed in place);
selected: the accent border and a tint; Delete is a button 24 with the
glyph of the trash in the top right corner of the card, named "Delete:
<name>" for screen readers; the footer has Export (and Link) on the left and
Cancel and Save on the right, without glyphs. Focus rings are outlines
inside of the cards, Delete and the buttons. Alt+arrow keys move the
focused entry with the drag and drop of the dialog (also in Fusion).
`libraryDialog: false` or `libraryDialog=0` shows the dialog of before.
Tests: `library-dialog-*` in `test/classic-simple`
(`tests/20-library-dialog.js`).

## Plugins, Configuration and Offline Languages (`SettingsLayouts.js`)

Plugins (`PluginsDialog`), Configuration (`showConfigurationEditorDialog`)
and the languages available offline (`showLanguageDialog`) of Simple use
the layouts of Fusion in the Classic skin (the rows `pluginsDialog`,
`configDialog` and `languageDialog` of `Editor.featureDefaults`: on in
Simple, fixed on in Fusion, off in Classic, Sketch, Minimal and Atlas).

Plugins: `EditorUi.createPluginsLayout(dlg, skin)` of
`js/diagramly/SettingsLayouts.js` (in app.min.js) lays the dialog out again
from its `controls`, which stay in the DOM hidden with `gePluginsReplaced`
and are driven, so Apply stores what the dialog of before stored (the
built-in select and Add, the confirmed Delete, Custom... with its URL prompt
and the file picker of the desktop app, Cancel; the prompt closes only
itself, in every theme: since the built-in plugins are an inline row its
second `hideDialog` closed Plugins too and lost the plugin). `installPluginsLayout` at
the end of the constructor installs the Classic skin
(`PluginsLayout.skins.classic`) where the switch is on (not in the
chromeless view) and makes the dialog 440 wide (`settingsLayoutSize`, which
the wrapper of `showDialog` in the same file reads; the height of its
content). The headline is the `<h3>` of the dialog with when the changes
take effect in gray (`geDialogHint`); Built-in plugins are checkboxes in a
card of two columns (one below 640 px) with the name and the path in gray
with an ellipsis (`geSettingsCheck`); the other plugins (Custom, or Plugins
without built-in ones) are rows of 32 in a card with the URL as text with an
ellipsis (its title is the whole URL) and Delete (the trash of Editor, 24,
the URL in its label), "No plugins" in gray when there are none, and Add
plugin... below; the footer keeps the help icon, Cancel and Apply in the
order of `cancelFirst`. Fusion calls the same function with
`PluginsLayout.skins.fusion` in `SimpleSettings.js` (switches, the Form
template).

The languages available offline: `EditorUi.createLanguagesLayout(elt, c,
skin)` lays out the content of `showLanguageDialog` from
`elt.languageControls` (`installLanguagesLayout` before the dialog is
shown, the size of before, 480 x 460): the headline `<h3>`, a search field
(32 high, the glyph of the search, Escape clears it; "No results for" in
gray), the languages as checkboxes in two columns (one below 640 px) in a
card that scrolls, rows of 28 with a tint under the pointer, Current in
gray after the name of the current language; English and the current
language cannot be removed and, offline, the languages that are not
available cannot be checked (the listeners of the dialog of before). The
changes wait for Apply, which sends them to the listeners of the dialog, so
installing and removing work as before; Cancel changes nothing (as in
Fusion, `LanguagesLayout.skins.fusion`, which puts Cancel first).

The CSS is in `grapheditor.css` under `.gePlugins` and `.geLanguages`, with
the colors of the other dialogs of the theme through `light-dark()` of the
palette (`--card-color`, `--field-border-color`, `--strong-text-color`,
`--focus-color` and their dark ones, the gray of `geDialogHint`): cards with
a border 1 and radius 6, the section titles of the Preview template
(`gePreviewSectionTitle`), focus rings as outlines of 2 in the accent
(inside for Delete and the buttons, around the checkboxes, around the
search field while it has the focus), so dark mode, which removes shadows,
keeps them. Tests: `tests/20-settings-dialogs.js` in `test/classic-simple`.

Configuration: `EditorUi.createConfigLayout(elt, controls, skin)` lays the
content of `showConfigurationEditorDialog` out again from its
`configControls` (the tabs, the editor `DrawioConfigEditor` of
`ConfigEditor.js`, the JSON, the buttons, Close and Apply), which it moves
or hides with `geCfgReplaced`, so Apply, Reset, Plugins, Link, Preferences
and Close store and do what they did before. `installConfigLayout` in the
dialog installs the Classic skin (`ConfigLayout.skins.classic`) where the
switch is on and the editor is not the viewer, and the dialog takes the
size of `getConfigLayoutSize` (960 × 640, limited to the window with 32
around it, none on phones); an error keeps the dialog of before
(`EditorUi.debug`). Fusion calls the same function with
`ConfigLayout.skins.fusion` in `SimpleSettings.js`. The CSS is in
`grapheditor.css` under `.geCfg`, with the colors of the other dialogs of
the theme through `light-dark()` of the palette (the dialog color, the
sections in the gray of the editor, `#f0f0f0` and dark `#2a2a2a`, as in
the dialog of before of Classic, Sketch, Minimal and Atlas, only Fusion's
are white, with the borders of fields, the text
`--strong-text-color`, hints `#5f5f63` and `--dark-secondary-text-color`,
the accent `--focus-color`; the colors of more contrast of the editor stay):
the headline is the `<h3>` of the dialog with when the changes take effect
in gray `geDialogHint` below it in the middle and View with Editor and JSON
as a list on the right (below them on phones); the sections of the editor are categories on the left (All
settings first) like those of the New dialog (rows of 30, radius 6, the
chosen one with a tint and 600, the arrow keys, Home and End move between
them), a row above the settings below 640 px; the search above the
settings runs over all categories; the three states of each setting are a
list Default, On, Off named after the setting (`aria-labelledby`) instead
of the toggle group, which stays hidden and is clicked, so settings shown
twice stay the same; JSON shows the text alone. The footer has help, Reset,
Plugins, Link and Preferences on the left and Close and Apply on the
right. Focus rings are outlines inside of the controls, also in the
editor and the JSON. `configDialog: false` or `configDialog=0` shows the
dialog of before. Tests: `config-dialog*` in `test/classic-simple`
(`tests/20-config-dialog.js`).

## Settings (`SettingsLayouts.js`, All settings... of Simple)

All settings... is the last item of the Settings menu of Simple (`extras`;
batch 16 of the plan of 13 November 2026, the driver limited it to
Simple; also after the items that plugins add, which `Menus.addMenu` of
`SettingsLayouts.js` puts before it after a separator), behind the row `settingsDialog` of `Editor.featureDefaults` (on in
Simple, fixed on in Fusion, which has its own Settings dialog and no item,
off in Classic, Sketch, Minimal and Atlas; `EditorUi.isAllSettingsShown`).
It shows the Settings dialog of Fusion (`showSettingsDialog(menuName,
skin)` of `js/diagramly/SettingsLayouts.js`, in app.min.js) in the Classic
skin `SettingsDialogLayout.skins.classic`: the items of the menu
`allSettings` (the Settings menu without All settings..., with Autosave),
recorded by `getSettingsEntries`, so plugins, `hideMenus` and the desktop
items keep their effect. The form is the Classic Form template
(`FormTemplate.skins.classic.createForm`, `.geFormSettings`): the
headline Settings, the sections Appearance, Language, Units, Editing,
Saving and Advanced (`SettingsDialogLayout.sections` and `order`; items it
does not know, also those of plugins, are in Advanced) as section titles
with their rows in a card (`.geDialogSection`): submenus of one choice are
selects in a `geDialogFormRow` (Appearance, Theme, Language, Show sizes in,
Diagram Language; a current choice that no item has, the code of Language
Code... or Automatic hidden by `hideMenuItems`, is the selected option that
runs nothing, `SettingsDialogLayout.currentChoices`; after the dialog of a
command of the submenu the select shows what it changed), submenus that
plugins build with a row of their own are sections like their other
submenus, High Contrast is a checkbox under Appearance (`choiceToggles`), switches
are checkboxes (`.geDialogCheckRow`, focus ring as an outline), commands
are `.geBtn` buttons in a wrapping row (`.geSettingsDialogActions`) that
open their dialog over the settings (closing it goes back to them) or
close them and run. The footer has Done. The content is 420 wide (the
frame 468; below 640 px the frame is the window less 16 px), the frame
the height of its content up to the window less 32 px (16 px below
640 px), the sections scroll between the head and Done. After a change of the language
the dialog opens again in its skin. Fusion's dialog is the same layout in
`SettingsDialogLayout.skins.fusion` (`SimpleSettings.js`). Tests:
`settings-dialog*` in `test/classic-simple` (`tests/27-settings-dialog.js`).

## File Properties (`PropertiesLayout.js`)

File › Properties (`FilePropertiesDialog`) of Simple uses the layout of
Fusion in the Classic skin (the row `propertiesDialog` of
`Editor.featureDefaults`: on in Simple, fixed on in Fusion, off in Classic,
Sketch, Minimal and Atlas): `EditorUi.createPropertiesLayout(dlg, skin)` of
`js/diagramly/PropertiesLayout.js` (in app.min.js) lays the dialog out again
from its `controls` (title, settings, info, size, path, publicLink, buttons,
data). The controls stay the controls with their listeners and are moved,
so Apply, Cancel, Enter and Edit Data do what they did, and the info section
of before stays in the DOM hidden with `gePropsReplaced`.
`installPropertiesLayout` at the end of the constructor installs the
Classic skin (`PropertiesLayout.skins.classic`) where the switch is on and
the view is not chromeless (an error keeps the dialog of before and goes to
`EditorUi.debug`); File › Properties of the menu sizes the dialog with
`getPropertiesDialogWidth` (`PropertiesLayout.width` 420, limited to the
window, at least 240). Fusion calls the same function with
`PropertiesLayout.skins.fusion` in `SimpleForms.js` (the decorator of
`EditorUi.wrapSimpleDialog`); the hints of the options are shared
(`PropertiesLayout.optionHints`, Compressed: `compressedHint`).

The CSS is in `grapheditor.css` under `.geProps`, with the colors of the
other dialogs of the theme through `light-dark()` of the palette
(`--field-border-color`, `--card-color`, `--strong-text-color`,
`--focus-color`, `--accent-text-color` and their dark ones): the headline
is the `<h3>` of the dialog; the file is a card (border 1, radius 8,
padding 10 12, gap 12) with the logo 28 of its storage
(`StartScreen.getStorageLogo`), the name 600 and its size and path in gray
`geDialogHint` (each with an ellipsis and in its title, joined with ` · `)
and Rename (a `geBtn`) on the right where File › Rename is enabled, which
closes the dialog and runs it; the public link is a row of the form below
the card (its label with the colon of before, the link in the accent text
color with an ellipsis); the options are under the section title of the
Preview template (Options, `gePreviewSectionTitle`): the checkboxes of the
dialog stay checkboxes in front of their labels, the hint of Compressed in
gray `geDialogHint` below the name inside of the label, and the fields
(Zoom, Border Width) stay the rows of before, named by their label
(`aria-label`); the footer is a row with gap 8: Edit Data on the left
(`gePropsData`), Cancel and Apply on the right, without glyphs. Focus
rings are outlines (2 in the focus color) on the checkboxes, the buttons
keep theirs. Enter in a field applies (`installDialogEnter` of the dialogs).
`propertiesDialog: false` or `propertiesDialog=0` shows the dialog of
before. `FilePropertiesDialog.createDataDialog` (Edit Data, also used by
the page data of Fusion) is unchanged. Tests: `properties-dialog-*` in
`test/classic-simple` (`tests/20-properties-dialog.js`).

## Style Rules (`RulesLayout.js`)

Style Rules (`StyleRulesDialog`) of Simple uses the Rules template of Fusion
in the Classic skin (the row `styleRulesDialog` of `Editor.featureDefaults`:
on in Simple, fixed on in Fusion, off in Classic, Sketch, Minimal and
Atlas; the driver, 18 November 2026, named only Simple):
`EditorUi.createStyleRulesLayout(dlg, skin)` of `js/diagramly/RulesLayout.js`
(in app.min.js) lays the dialog out again from its `controls` and their
`decorateCard`, which move and restyle the fields of the dialog of before
with their listeners, so Apply and Insert Legend write the same rules (the
tests compare the model with `styleRulesDialog=0`). `installStyleRulesLayout`
at the end of the constructor installs the Classic skin
(`RulesLayout.skins.classic`) where the switch is on, and the action
`styleRules...` sizes the dialog with `getStyleRulesDialogSize` (840 × 520,
limited to the window; 760 × 440 as before where the switch is off). Fusion
calls the same function with `RulesLayout.skins.fusion` in `SimpleRules.js`
(`createSimpleStyleRulesLayout`); the readable operators
(`RulesLayout.operators`), the preview of a style (`RulesLayout.updatePreview`,
safe CSS colors only, text through `mxUtils.write`) and its colors
(`getRuleColor`) are shared.

The rules are cards (border 1, radius 8, the card color) with the row "When
property is value then style": the drag handle of the dialog of before (a
button: Arrow Up and Down move the rule), When and then in gray, the
property 140, the operator 120 with readable labels (is, is not, … with the
symbols as tooltips), the value 140, the preview of the style (28 high,
radius 6, the fill, line and font color of the rule, its font style, a
gradient for a scale, the names of the keys with an ellipsis) and the
number of shapes in gray `geDialogHint`, Delete as an icon button of 28.
The preview opens the style and the tags below the row (a hairline, at the
position of When; the card has the accent border): the rows of the dialog
of before with their key select 160, the values, the colors 40 × 24, Bold,
Italic, Underline and Strikethrough and the flags as checkboxes. Add Rule
and the shapes that all rules match are below the cards; Edit as JSON
(`aria-pressed`, a tint while it is on) shows the rules as JSON in a plain
monospace field that takes the height, an error stays in the dialog in the
error color. The footer has Edit as JSON and Insert Legend on the left and
Cancel and Apply on the right, without glyphs. The CSS is in
`grapheditor.css` under `.geRules`, with the colors of the other dialogs of
the theme through `light-dark()` of the palette (`--card-color`,
`--field-border-color`, `--field-color`, `--strong-text-color`,
`--focus-color` and their dark ones). Focus rings are outlines: inside of
the handle, the preview and the colors, next to the checkboxes; the fields
keep the focus of the fields of the dialogs. The row of a rule stays on
one line (the fields and the preview shrink); below 640 px it wraps, its
fields share the width, the style starts at the left and Edit as JSON and
Insert Legend share a line above Cancel and Apply. `styleRulesDialog:
false` or `styleRulesDialog=0` shows the dialog of before. Tests:
`style-rules-dialog*` in `test/classic-simple`
(`tests/20-style-rules-dialog.js`).

## Form Template: Edit Geometry, Connection Points, Polygon, color and font (`FormTemplate.js`)

Edit Geometry, Edit Connection Points, Insert and Edit Polygon, the color
dialog (the modal dialog of `pickColorModal` and the color window) and the
custom font (`FontDialog`) of Simple use the layouts of Fusion in the
Classic skin, each behind a row of `Editor.featureDefaults`
(`geometryDialog`, `connectionPointsDialog`, `polygonDialog`,
`colorDialog`, `fontDialog`: on in Simple on every platform, fixed on in
Fusion, off in Classic, Sketch, Minimal and Atlas; the driver, 18 November
2026, named only Simple). `js/diagramly/FormTemplate.js` (in app.min.js)
has one layout per dialog that takes a skin (`createGeometryLayout`,
`createConnectionPointsLayout`, `createPolygonLayout`, `addColorSections`,
`createFontLayout`): the layouts move the controls of the dialogs (its
`controls`) with their listeners into the new parts and hide the rest with
`geFormReplaced`, so every option applies what it applied before. The
dialogs call `editorUi.installFormTemplate(kind, this, args)` at their end
(the color dialog `decorateColorDialog`), which installs the Classic skin
(`FormTemplate.skins.classic`) where the switch is on; Fusion calls the
same layouts with `FormTemplate.skins.fusion` (`SimpleForms.js`). These
layouts and Edit Link and Save as (above) share one `FormTemplate`: one
Classic skin and one skin of Fusion with the builders of all of them, one
`getCountText`, `getCellsSubtitle` and `fitDialog`.

The Classic skin: Edit Geometry and the custom font are forms with the
`<h3>` of the dialog and the shapes (or the page) in gray below it, the
rows in `geDialogSection` cards under the section titles of the Preview
template (`gePreviewSectionTitle`), the units as hints after the fields,
More options of Edit Geometry (Relative, Dx and Dy) as the collapsible
section of the dialogs (`addAdvancedSection`), the type of a font as a list
(`select`) that checks the radios of the dialog and a preview of the font
in a card; Edit Connection Points and Polygon are shape editors on the
Preview template (`PreviewDialog.createLayout` with the Classic skin): the
canvas of the dialog fills the pane, its tools (the images of the dialogs
of before, 28 with 18 images) float in a bar at the bottom, the options are
on the right (below 700 px below a canvas of 240), the side of Add points is
the list of the dialog, the points are rows of 28 with their number, the
options are checkboxes (`geDialogCheckRow`), help and Reset or Delete All on
the left of the footer, Cancel and the primary button on the right in the
order of the theme. Sizes: Edit Geometry 360 and the font 420 wide with
the height of their content, Edit Connection Points 720 × 560 and Polygon
760 × 560, both resizable down to 560 × 420 and 240 higher below 700 px,
where the canvas is above the options (`FormTemplate.sizes`). The
color dialog and the color window show the color, the dark color (always,
Advanced is hidden), Recent (hidden without recent colors), Swatches and
Custom (the pad of the picker) as sections and Inherit, as an order of CSS,
so the parts of the dialog keep their places (the window outlives a switch
of the theme, so it has the class of the sections, `.geFormColor`, only
while the switch is on in the current theme: `updateColorWindowSections`
toggles it when the window is shown and when the theme changes, and all of
its CSS needs it); the modal dialog has the name of the color as its `<h3>`.
The CSS is in `grapheditor.css` under `.geForm`, with the colors of the
other dialogs of the theme through `light-dark()` of the palette
(`--field-border-color`, `--card-color`, `--strong-text-color`,
`--focus-color` and their dark ones); the CSS of the color dialog is
scoped to `body:not(.geSimpleModern)`. Focus rings are outlines inside of
the tools, the points and the buttons. `geometryDialog: false` or
`geometryDialog=0` (and so on) shows the dialog of before. Tests:
`form-dialogs-*` in `test/classic-simple` (`tests/19-form-dialogs.js`).

## Form Template: Page Setup, Edit Data, Edit Tooltip and Edit Note (`FormTemplate.js`)

Page Setup (`PageSetupDialog`), Edit Data (`EditDataDialog`) and Edit
Tooltip and Edit Note (`MarkupDialog`) of Simple use the forms of Fusion in
the Classic skin (the rows `pageSetupDialog`, `editDataDialog` and
`markupDialog` of `Editor.featureDefaults`: on in Simple online and in the
desktop app, fixed on in Fusion, off in Classic, Sketch, Minimal and Atlas;
the driver, 18 November 2026, named only Simple).
`EditorUi.createPageSetupLayout(dlg, skin)`, `createEditDataLayout` and
`createMarkupLayout` of `js/diagramly/FormTemplate.js` (in app.min.js after
`StartScreen.js`) lay the dialogs out again from their `controls`, which
stay in the DOM (hidden with `geFormReplaced` where the form has its own
control) and are driven, so Apply changes what it changed before. The
constructors call `installFormLayout(dlg, kind)` at their end (a hook of
`grapheditor/EditorUi.js` that does nothing there), which installs the
Classic skin (`FormTemplate.skins.classic`) where the switch is on; Fusion
calls the same functions with `FormTemplate.skins.fusion` (`SimpleForms.js`,
`SimpleMoreForms.js`) and keeps its look. These forms share the one
`FormTemplate` of the layouts above (one Classic skin, one skin of Fusion,
`getCountText`, `getCellsSubtitle`, `getPageSubtitle`, `getFileTitle` and
`fitDialog`); their head and subtitle have their own classes
(`formHead`, `formSubtitle` of the skin).

The headline is the `<h3>` of the dialog with what it acts on below it in
gray (`geFormSubtitle`: the file or the page, the label and the type of a
shape, "2 shapes", the layer, the file of File › Properties). Sections are
the titles of the Preview template (`gePreviewSectionTitle`) with
`geDialogSection` cards, rows `geDialogFormRow` with a
`geDialogFormLabel` and the control in `gePreviewControl`, More options the
collapsible section of the dialogs (`addAdvancedSection`); a choice of a few
values is a list (`select`: the orientation of Page Setup, Formatted and HTML
of the markup), an option a checkbox (Placeholders, with its hint after its
label as in the check rows), and the buttons have their names (Copy, Add
Property, Change...). Page Setup: Paper (Size, Orientation, hidden for a
custom size, whose width, height and unit are a line under the list that
wraps in narrow windows; its fields have no `type`, so the rules of the
fields also name `input:not([type])`), Background (a swatch of 16 with a diagonal for none, the color
and Image, Change...), Grid (Size), More options with every option of before
(adaptive colors, drawing scale, initial view, alt text, the animation, the
style rules and the data sources of the page, which Fusion has in its
panel). Edit Data: the ID with Copy (a double click edits it), the
properties under Properties with Delete as a named button, the field that
adds a property with the common names as its suggestions (a `datalist`),
Placeholders and Export on the left of the footer; it is 64 higher than the
dialog of before for its head (`FormTemplate.headHeight`, also 20 for the
markup), so the properties keep their room; the saved sizes (`editData`,
`editTooltip`, `editNote` of `mxSettings.getWindowState`) stay the sizes of
the dialog of before, which the switch off and Classic share: the form adds
the head to them and saves its height without it. The markup: the toolbar
(`role=toolbar`) with Formatted and HTML at its end, the text in its field.
The footer has the buttons of the dialog on the right (`geFormFooter`).

The CSS is in `grapheditor.css` under `.geForm`, with the colors of the
other dialogs of the theme through `light-dark()` of the palette. Focus
rings are outlines (checkboxes, Delete, the toolbar, and the fields in dark
mode, which removes the shadow of their focus). `pageSetupDialog: false`
(or `pageSetupDialog=0`, the same for the others) shows the dialog of
before. Tests: `form-page-*`, `form-edit-data` and `form-markup` in
`test/classic-simple` (the second set of `tests/19-form-dialogs.js`).

Edit Data with nothing selected (the data of the page) is the page data of
Fusion in the Classic skin (the row `editDataDialog`; the driver, 20
November 2026): `EditorUi.createPageDataLayout(dlg, skin)` of
`FormTemplate.js` after `createEditDataLayout`, which Fusion calls with
`FormTemplate.skins.fusion.pageData` (`SimplePageData.js`) and Simple with
`FormTemplate.skins.classic.pageData` (`geFormPageData`). The head reads
Page data with the file below it; a card has This page or Whole diagram as a
list with the ID of the page and Copy on its right and the name of the page
as a row below it; Properties has the hint of the placeholders (Usable as
%name% in labels) on its right; the settings of the page (style rules,
data sources, animation) stand inline below the properties, three or more
under More options (the collapsible title of the dialogs,
`FormTemplate.applyExpanderRule`; the section of the properties stays in
view while settings stand inline, also once the last property is deleted,
where `updatePropsSection` of `EditDataDialog` would hide it); the tags of the page and of its shapes
are toggle buttons on a card (`geFormPageDataChip`, radius 15, a tag that
is on has the background of the selection, an inset border of the focus
color and ✓) with Add tag, which turns into a field of 160 (Enter adds,
the field stays for the next tag); the footer has Export and Color by
Data... (Style Rules, which applies the page data first if it changed) on
the left and Cancel and Apply on the right. Whole diagram shows the data of
the file (the dialog of File › Properties › Edit Data in the same form,
its Export only); Enter in the list of the scope does not apply. Apply
writes the data and the name of the page in one edit (the name only if it
was changed in the form, so a rename elsewhere while the dialog is open is
kept) and the data of the file as before. The dialog opens with the height
of its content up to the window and grows for More options and for the rows
of the file in Whole diagram; where the
window is too low the form scrolls and the footer stays in view (`sticky`).
The helpers of the page data (`FormTemplate.parseTags`, `findDataRow`,
`parseVars`, `mergeVars`, `EditorUi.createDiagramDataDialog`,
`installVarsMerge`, `withoutHideDialog`) are in `FormTemplate.js`; the names
of Fusion (`EditorUi.parseSimpleTags`, ...) stay as aliases. Tests:
`page-data*` in `test/classic-simple` (`tests/26-data-select-page-data.js`),
`dialog-page-data` in `test/simple-modern` for Fusion.

## Dialog Title

A plain `<h3>` — all styling comes from the central `.geDialog h3` rule
(centered, 16px bottom margin, `flex-shrink: 0` for flex-column layouts):

```javascript
var hd = document.createElement('h3');
mxUtils.write(hd, title);
div.appendChild(hd);
```

Never set inline styles on dialog titles; if a special layout genuinely
needs different margins (e.g. a title inside a header row), the inline
override is the documented exception, not the norm.

## Edit Button (Lightbox Dialogs)

Use `addEditButton` which creates a `geDialogCheckRow` with an indented select:

```javascript
var editSection = this.addEditButton(optSection, lightbox);
var edit = editSection.getEditInput();
```

## Alignment of Dialog Items

Radio/checkbox rows (`geDialogCheckRow`) use flexbox with `align-items: center`.
When a radio button is followed by an input or select, both elements sit after
the radio's right margin (8px). The CSS rule `.geDialogCheckRow select` adds
`margin-left: 8px` by default — this is intended for selects that follow a
checkbox + label. When a select sits directly after a radio button (same position
as a text input in another row), reset the margin so both align:

```javascript
pageSelect.style.marginLeft = '0';
```

For `geDialogFormRow`, the `geDialogFormLabel` span provides a fixed-width left
column (`min-width: 100px`). All inputs and selects use `flex: 1` to fill the
remaining space. The row has a `column-gap: 8px` so the label never butts against
the control even when a long (e.g. German) label grows past the 100px column — do
not add per-control `marginLeft` inside a form row, and if a longer label needs
more room, increase the dialog width rather than overriding `min-width` on
individual labels.

## Multi-Line Rows (`geDialogFormRowTop`)

`geDialogFormRow` centers the label vertically, which is correct for
single-line rows. When the row's content spans multiple lines — stacked
controls (e.g. the Page Setup paper-size panel) or wrapping hint text —
add `geDialogFormRowTop` so the label top-aligns with the first content
line instead of floating against the middle of the block:

```javascript
row.className = 'geDialogFormRow geDialogFormRowTop';
```

The class sets `align-items: flex-start` and pads the label so it sits
optically on the first line. Do not top-align single-line rows — mixed
alignments within one dialog read as a bug.

## Typography

Dialogs inherit the app font (`.geEditor`, 14px system stack). Never set
font family, size or weight inline in a dialog — every text role has a
central rule:

| Role | Size / weight | Where it comes from |
|---|---|---|
| Title | ~16px bold | plain `<h3>` (see Dialog Title) |
| Labels, checkbox text, body | 14px normal | inherited — no styling needed |
| Controls (input, select, textarea) | 13px normal | `.geDialog` CSS; selects that borrow `.geBtn` for sizing are forced back to normal weight by `.geDialog select` |
| Buttons | 14px / weight 550 | `.geBtn` — buttons only, never text |
| Hint / muted secondary text | 12px muted | `.geDialogHint` |
| Collapsible section header | 13px | `addAdvancedSection` (`.geCollapsibleTitle`) |
| Toggle buttons (choices in a row) | 13px normal | `createLayoutSegments` (`.geLayoutSegments`, `aria-pressed`) |
| Name of a picture tile | 14px / weight 600 | `.geLayoutTileName` (Choose Layout) |

`geDialogHint` covers all muted secondary text: explanatory hints
describing what an option does (e.g. the lightbox-animation note in Page
Setup), unit suffixes next to compact inline inputs (e.g. "ms"),
de-emphasized checkbox labels in dense header rows, and empty-state
placeholders. The current *value* of an entry (e.g. the Initial View
status) is content, not a hint — it uses the regular text style.
Component stylesheets that define their own micro-typography (e.g. the
cell/tag selector chips in the Animation dialog) keep their own sizes
and weights but reuse the hint palette,
`light-dark(var(--secondary-text-color), var(--dark-secondary-text-color))`
— don't fork new muted grays.

**Truncated text**: `.geDialog` uses `line-height: 1em`, so an
auto-height element that truncates with `overflow: hidden;
text-overflow: ellipsis` clips glyph descenders (e.g. the "g" in
German "Vorgegeben"). Give such elements `line-height: normal` so the
line box has full glyph height; the ellipsis still handles horizontal
overflow.

If a new dialog needs a size or weight this table doesn't cover, add a
class and a table row — one-off inline font styles are how
inconsistencies creep in.

## Non-Resizable Dialogs

Most dialogs are non-resizable. Do **not** pass a `minSize` parameter to
`showDialog()` — this avoids adding a resize handler. Use `null` for the height
parameter so the dialog auto-sizes to its content:

```javascript
this.showDialog(dlg.container, 360, null, true, true);
```

Only pass `minSize` (a `mxRectangle`) when the dialog content is scrollable or
has a variable-height area that benefits from user resizing.

## Button Spacing (Manual Buttons)

When using `CustomDialog`, button spacing is handled automatically (34px
margin-top, 10px padding-bottom on the content wrapper). When building buttons
manually (e.g., dialogs with custom button arrangements like Reset + Open),
replicate the same values:

```javascript
// Content wrapper needs padding-bottom to prevent margin collapse
div.style.paddingBottom = '10px';

// Button row
var btns = document.createElement('div');
btns.style.marginTop = '34px';
btns.style.textAlign = 'right';
```

This produces equal visual spacing above (34px) and below (34px = 10px + 24px
dialog padding) the button row, matching `CustomDialog` exactly. Never use
other margin values (16px, 20px, 30px) for button rows.

## Dark Mode

All CSS uses `light-dark()` for color values. Never hardcode colors in JS — use
the CSS classes which handle both modes automatically.

Colors come from the theme palette defined in the `:root` block of
`styles/grapheditor.css` (`--strong-text-color`, `--field-color`,
`--field-border-color`, `--focus-color`, … and their `--dark-*`
counterparts). Always reference these variables instead of literal hex
values — user color schemes override the variables via the `css`
configuration property, and literals silently opt a component out of
theming. Alpha tints of an accent derive from it via
`color-mix(in srgb, var(--focus-color) 25%, transparent)`. The exception
is CSS injected by viewer-shared code (e.g. `geNoteBox` in `Graph.js`):
the viewer runs on third-party pages where the variables don't exist and
generic names could collide with host CSS, so literals stay there.

## Keyboard Focus

Modal dialogs keep Tab inside the dialog (`Dialog.installFocusTrap`): Tab on
the last control focuses the first, Shift+Tab on the first focuses the last,
and Tab while the focus is behind the dialog (diagram, search box) moves it
into the dialog. The trap uses the visible, enabled controls in document
order (`Dialog.getTabStops`), so don't use positive `tabindex` values. A
control that handles Tab itself (eg. an autocomplete) must consume the event
(`mxEvent.consume`) so the trap leaves it alone. Focus the first input in the
dialog's `init` — callers that focus something else afterwards must check
`document.activeElement` first (see `focusGraph` in
`Sidebar.addSearchPalette`).

Shift+arrow keys move the focus to the nearest control in that direction
(`EditorUi.focusTabStopInDirection`). Shift+Arrow Left and Right stay in the
row and continue with the previous or next control in the order of Tab at
its ends, eg. from the preview of the More Shapes dialog to its buttons.
Arrow keys without Shift scroll areas that scroll, so a part of a dialog that
scrolls and has no controls, eg. a preview, needs `tabindex="0"` for the
keyboard.

Buttons (`geBtn`, also `gePrimaryBtn`) and collapsible titles
(`geCollapsibleTitle`) show the keyboard focus as a 2px outline in the focus
color (`:focus-visible`). Dark mode removes all shadows (`body.geDarkMode *`
sets `box-shadow: none !important`), so a focus ring must be an outline,
never a box-shadow. The outline is inside of the element
(`outline-offset: -2px`): the content of dialogs scrolls
(`.geDialog > :first-child`), which would clip a ring outside of controls at
its edges.

Every dialog has `role="dialog"` (and `aria-modal` if modal), and screen
readers name it after the first `<h3>` or `.geDialogTitle` in its content
(`aria-labelledby`), so give dialogs a title of that kind. A dialog without
such a title sets `aria-label` on its content element (the one passed to
`showDialog`), which the dialog moves to itself (eg. Edit Data). When a dialog
closes, the focus goes back to the control that opened it with the keyboard
(`Dialog.getReturnFocus`: a button, checkbox or select outside the diagram
that matches `:focus-visible`, eg. in the format panel or in another
dialog). Otherwise it goes to the diagram or to the label being edited.

## Names, Images and Targets

Screen readers and the axe checks of the accessibility reports
(`security-privacy-legal`, `scripts/vpat_axe_test.js`) need:

- **A name for every field**: text before a field is no `<label>`, so set
  `aria-label` on inputs, selects and text areas (eg. the Filename field of
  the library dialog).
- **`alt` on every image**: `alt=""` for icons inside a named control or with
  a name next to them (droppers, resize grips), else a text (the preview of
  the More Shapes dialog).
- **Targets of 24px** (WCAG 2.5.8): icon buttons get padding up to 24px and a
  negative margin of the same size, so the row does not change (Swap, Copy
  and Opacity of the color window). Smaller targets need 24px from center to
  center (the dots of the color schemes).
- **Contrast of 4.5:1** for text: gray text uses `#5f5f63` in light mode and
  `#a0a0a0` in dark mode (`geMenuShortcut`), not `gray` or an opacity. Text
  on a color picks black or white by the relative luminance
  (`ColorDialog.hasDarkText`).

## Testing Dialogs

Use `?dev=1&ui=classic` to keep the menubar visible regardless of window size.
Test with both single-page and multi-page diagrams, as extra controls appear
when multiple pages exist.
