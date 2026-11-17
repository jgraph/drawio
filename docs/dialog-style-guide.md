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
