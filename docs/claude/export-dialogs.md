# Export/print dialogs: per-session settings memory

(July 2026, [jgraph/drawio#5653]) `showExportDialog` (PNG/JPEG/WEBP/SVG),
`showRemoteExportDialog` (server fallback), `showAnimatedGifExportDialog` and
the print/PDF dialog re-open with the last CONFIRMED values — saved on OK
only, never on cancel; `EditorUi.lastExport*`/`lastPrint*` instance fields =
session scope (deliberately not `mxSettings`, so derived defaults aren't
permanently dead).

Settings with DERIVED defaults (transparent bg — constant false in the image
dialog since 2018, page background in the remote dialog; appearance from
`Editor.isDarkMode()`/'auto'; shadow from `graph.shadowVisible`;
size/exportType from the selection) store the override ONLY while it differs
from the derived default computed at dialog-open and reset to null when the
confirmed value matches it again — untouched settings keep tracking page/theme
changes, and re-picking the derived value resumes tracking (no reset UI
needed).

Saves are gated on the control being applicable (visible/enabled for the
format): an unconditional save from a dialog where the control is hidden
clobbers another format's override (the historic `lastEmbedImages` bug — a PNG
export cleared SVG's Embed Images default). Values restored into a `<select>`
must validate via `selectedIndex < 0` fallback ('auto' appearance is SVG-only;
a custom DPI needs the custom input toggled visible).

Dialog look & feel (CustomDialog, CSS classes, spacing, dark mode):
`docs/dialog-style-guide.md`.
