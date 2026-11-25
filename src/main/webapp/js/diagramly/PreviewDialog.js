/**
 * Copyright (c) 2026, JGraph Holdings Ltd
 * Copyright (c) 2026, draw.io AG
 */
/**
 * The Preview template of dialogs in every theme (concept "Fusion ideas in
 * Simple and Classic", 5.3): the preview on the left, the fields on the
 * right and the footer below, with the parts that do not depend on a look:
 *
 * - the formats of the export (EditorUi.exportFormats, getExportFormats)
 * - the picture of an export (getExportPreviewOptions, createExportPreview)
 *   and its refresh after typing rests (PreviewDialog.installRefresh)
 * - the template (PreviewDialog.createLayout) in a skin: the Classic skin
 *   (PreviewDialog.skins.classic, docs/dialog-style-guide.md: sections,
 *   lists instead of toggle groups, checkboxes instead of switches, the
 *   preview above the fields below 700 px; its CSS is in grapheditor.css
 *   under .gePreviewTemplate) or the skin of Fusion, which SimpleDialogs.js
 *   adds (PreviewDialog.skins.fusion)
 * - the busy state of a button and the errors of fields
 *   (PreviewDialog.setBusy, setFieldError)
 * - the order of Tab as it is shown (EditorUi.installDialogTabOrder) and
 *   groups of radios that are one stop with the arrow keys
 *   (EditorUi.addRovingRadios)
 *
 * - Print with a preview of its sheets (EditorUi.createPrintLayout in the
 *   Classic skin, behind Editor.isPrintPreviewEnabled): the paper and its
 *   orientation as one undoable change that closing the dialog takes back
 *   (createPaperChanges), the sheets as the output has them
 *   (createPrintPreview) and the subtitle (getPrintSubtitle)
 *
 * Classic, Simple, Sketch, Minimal and Atlas use the template for Print in
 * the Classic skin, which takes the colors of their dialogs; the Export
 * dialog follows (createPreviewDialog). Fusion calls these functions from
 * SimpleExport.js, SimpleDialogs.js, SimplePreview.js and SimpleStates.js,
 * so the code exists once.
 */
var PreviewDialog = {};

/**
 * The formats of the Export dialog in their order: the action, the name,
 * the purpose, the icon, the titles of the dialog of the format (to
 * recognize it), row for the rank of a format in the row of formats (a
 * format without one is always in More), more for the place in More of a
 * format of the row that has no room (default its row) and async for
 * formats that open their dialog later.
 *
 * The order of the row and its ranks follow the clicks on the items of
 * Export as ▸ (app.diagrams.net, 1 % of the sessions, 6 days to 13 November
 * 2026): PNG 4,792, PDF 1,421, JPEG 1,119, SVG 403, XML 164, HTML 104,
 * WebP 34, JSON 25, VSDX none. The row shows as many formats as it has room
 * for (EditorUi.createExportFormatRow); the format with the highest rank
 * goes to More first. VSDX is the last file format of the row and goes to
 * More before WebP and JSON only after them (the driver, 13 November 2026:
 * VSDX stays in the row where there is room), so it is the first one of More
 * where there is no room for it. Animation and URL follow it at the end of
 * the row with the last ranks (the driver, 17 November 2026: More had only
 * these two left, they are formats of the row, and More is only there for
 * the formats that have no room), so they are the first to go to More.
 */
EditorUi.exportFormats = [
	{id: 'png', action: 'exportPng', name: 'formatPng', hint: 'exportHintPng', icon: 'image', titles: ['image'], row: 1},
	{id: 'pdf', action: 'exportPdf', name: 'formatPdf', hint: 'exportHintPdf', icon: 'file', titles: ['formatPdf'], row: 2},
	{id: 'jpeg', action: 'exportJpg', name: 'formatJpg', hint: 'exportHintJpg', icon: 'image', titles: ['image'], row: 3},
	{id: 'svg', action: 'exportSvg', name: 'formatSvg', hint: 'exportHintSvg', icon: 'code', titles: ['formatSvg'], row: 4},
	{id: 'xml', action: 'exportXml', name: 'formatXml', hint: 'exportHintXml', icon: 'code', titles: ['formatXml'], row: 5},
	{id: 'html', action: 'exportHtml', name: 'html', hint: 'exportHintHtml', icon: 'globe', titles: ['html'], row: 6, async: true},
	{id: 'webp', action: 'exportWebp', name: 'formatWebp', hint: 'exportHintWebp', icon: 'image', titles: ['image'], row: 8},
	{id: 'json', action: 'exportJson', name: 'formatJson', hint: 'exportHintJson', icon: 'code', titles: ['formatJson'], row: 9},
	{id: 'vsdx', action: 'exportVsdx', name: 'formatVsdx', hint: 'exportHintVsdx', icon: 'pages', titles: ['formatVsdx'], row: 7, more: 0},
	{id: 'gif', action: 'exportAnimatedGif', name: 'animation', hint: 'exportHintGif', icon: 'play', titles: ['animation', 'formatAnimatedGif'], row: 10},
	{id: 'url', action: 'exportUrl', name: 'url', hint: 'exportHintUrl', icon: 'link', titles: ['url'], row: 11}
];

/**
 * Returns the formats of EditorUi.exportFormats that can be exported here,
 * with the gates of the items of Export as ▸ (see Menus.js): the format is
 * available, its action exists and is enabled, and the configuration does
 * not hide it (hideMenuItems).
 */
EditorUi.prototype.getExportFormats = function()
{
	var canvas = this.editor.isExportToCanvas();
	var remote = !canvas && this.isRemoteExportEnabled() && (!mxClient.IS_IOS || !navigator.standalone);
	var available = {png: canvas || remote, jpeg: (canvas && Editor.jpgSupported) || remote,
		webp: canvas && Editor.webpSupported, gif: canvas, svg: true,
		pdf: this.isPrintPdfExport() || !mxClient.IS_IOS || !navigator.standalone,
		vsdx: this.vsdxExportEnabled() && (typeof(VsdxExport) !== 'undefined' || !this.isOffline()),
		html: true, xml: true, url: Editor.enableExportUrl, json: true};
	var hidden = (this.menus != null) ? this.menus.hiddenMenuItems : null;
	var result = [];

	for (var i = 0; i < EditorUi.exportFormats.length; i++)
	{
		var f = EditorUi.exportFormats[i];
		var action = this.actions.get(f.action);

		if (available[f.id] && action != null && action.isEnabled() &&
			(hidden == null || !hidden[f.action]))
		{
			result.push(f);
		}
	}

	return result;
};

/**
 * Returns the format of EditorUi.exportFormats with the given ID, or null.
 */
EditorUi.prototype.getExportFormat = function(id)
{
	for (var i = 0; i < EditorUi.exportFormats.length; i++)
	{
		if (EditorUi.exportFormats[i].id == id)
		{
			return EditorUi.exportFormats[i];
		}
	}

	return null;
};

/**
 * Milliseconds that previews wait for typing and dragging to rest before
 * they are made again.
 */
EditorUi.previewDelay = 150;

/**
 * Invokes the given function after the next frame is painted (an animation
 * frame, then two timeouts), so that a dialog shows and takes the focus
 * before its slow parts, such as a preview, are made.
 */
EditorUi.afterFrame = function(fn)
{
	var done = false;

	var run = function()
	{
		if (!done)
		{
			done = true;
			fn();
		}
	};

	// After the frame and two timeouts: the focus of a dialog that was just
	// shown comes first, as keys typed while the picture is made would go to
	// the diagram
	window.requestAnimationFrame(function()
	{
		window.setTimeout(function()
		{
			window.setTimeout(run, 0);
		}, 0);
	});

	// Hidden tabs have no frames
	window.setTimeout(run, 200);
};

/**
 * Returns true if the current page of the given graph has nothing to print
 * or export (no visible cells and no background image).
 */
EditorUi.prototype.isPreviewPageEmpty = function(graph)
{
	var bounds = graph.getGraphBounds();

	return graph.backgroundImage == null && bounds.width == 0 && bounds.height == 0;
};

/**
 * Returns the options of the export that the preview of an export shows,
 * read from the given controls of the dialog of the format (exportControls
 * of showExportDialog): svg (the zoom scales the SVG, not the border),
 * selection, allPages, theme, transparent, grid, border, type (Size), nocrop,
 * zoom (in percent) and shadow.
 */
EditorUi.prototype.getExportPreviewOptions = function(controls, format)
{
	// The zoom can have decimals, eg. for a width typed in the dialog
	var zoom = (controls != null) ? parseFloat(controls.zoom.value) : NaN;

	return {svg: format != null && format.id == 'svg', selection: controls != null && controls.selection.checked,
		allPages: controls != null && controls.pages != null && controls.pages.value == 'allPages',
		theme: (controls != null && controls.theme != null) ? controls.theme.value : 'light',
		transparent: controls != null && controls.transparent != null && controls.transparent.checked,
		// The grid is passed to the export as it is checked (it is unchecked
		// while disabled)
		grid: controls != null && controls.grid != null && controls.grid.checked,
		border: (controls != null) ? Math.max(0, parseInt(controls.border.value) || 0) : 0,
		type: (controls != null && controls.size != null) ? controls.size.value : null,
		nocrop: controls != null && controls.crop != null && !controls.crop.checked,
		zoom: (isFinite(zoom) && zoom > 0) ? zoom : 100,
		shadow: controls != null && controls.shadow != null && controls.shadow.checked};
};

/**
 * Creates the picture of an export in the given image of the given pane of
 * a preview in the given skin. getOptions returns the options of the export
 * (see getExportPreviewOptions). Returns an object with update, which makes
 * the picture again if the options changed and the preview is ready, sets
 * the states of the pane and returns {options, size} with the size of the
 * exported image in pixels (or null), and setReady, after which update
 * makes pictures (once the dialog is shown, see installRefresh).
 *
 * The picture is the SVG of what is exported in the look of the export, as
 * the callbacks of showExportDialog pass it to Graph.getSvg: the page, the
 * diagram or the selection (Size, and the crop of the selection). The border
 * is the padding of the image in the color of the background, the picture
 * has a border of 1 (0 for none, as Graph.getSvg adds 5 for shadows without
 * a border), so its size and twice the rest of the border is the size of
 * the export. A gradient of the page and the grid fill the border in
 * Graph.getSvg (and the grid of Editor.exportToCanvas the border of the
 * image), so with a gradient or the grid the picture keeps the border (at
 * most 100) and has no padding. The labels are in the SVG of Graph.getSvg,
 * which sanitizes them, and the image shows it as a data URI (no scripts),
 * with the fonts of the labels embedded once they are loaded.
 */
EditorUi.prototype.createExportPreview = function(pane, img, getOptions, skin)
{
	var ui = this;
	var graph = this.editor.graph;
	var imageKey = null;
	var imageSize = null;
	var imageBackground = null;
	var ready = false;
	PreviewDialog.preventDrag(pane);

	// The rest of the border (at most 100 in the picture) as the padding of
	// the image, scaled as the image is fitted into the pane
	var padImage = function(pad)
	{
		if (imageSize != null && pad > 0)
		{
			var cs = window.getComputedStyle(pane);
			var aw = pane.clientWidth - (parseFloat(cs.paddingLeft) || 0) - (parseFloat(cs.paddingRight) || 0);
			// A pane that has the height of the image fits only its width
			var ah = (skin.isPaneFitWidth != null && skin.isPaneFitWidth(pane)) ? Infinity :
				pane.clientHeight - (parseFloat(cs.paddingTop) || 0) - (parseFloat(cs.paddingBottom) || 0);
			var s = Math.max(0, Math.min(1, aw / (imageSize.width + 2 * pad), ah / (imageSize.height + 2 * pad)));
			img.style.boxSizing = 'border-box';
			img.style.padding = (s * pad) + 'px';
			img.style.backgroundColor = (imageBackground != null) ? imageBackground : '';
		}
		else
		{
			img.style.boxSizing = '';
			img.style.padding = '';
			img.style.backgroundColor = '';
		}
	};

	// The SVG of the picture in an image cannot load the fonts of its labels
	// (the hand-drawn font of Sketch, Google fonts, fontCss in the
	// configuration), which the export has, so they are embedded as in the
	// print preview (createPrintPreview) and the export of SVGs
	// (EditorUi.embedFonts, cached by the editor); the picture shows the
	// image without them until they are loaded, unless it changed since
	var embedImageFonts = function(svg, key)
	{
		if (typeof ui.embedFonts === 'function' && typeof graph.getCustomFonts === 'function' &&
			(ui.editor.fontCss != null || graph.getCustomFonts().length > 0))
		{
			var src = img.getAttribute('src');

			ui.embedFonts(svg, function()
			{
				if (imageKey == key && img.getAttribute('src') == src)
				{
					img.setAttribute('src', Editor.createSvgDataUri(mxUtils.getXml(svg)));
				}
			}, true);
		}
	};

	var update = function()
	{
		var o = getOptions();
		var selected = o.selection && !graph.isSelectionEmpty();
		var theme = o.theme;
		var transparent = o.transparent;
		var grid = o.grid;
		var exportBorder = o.border;
		var gradient = !transparent && graph.background != null && graph.background != mxConstants.NONE &&
			graph.getBackgroundGradient(graph.background) != null;
		var border = (exportBorder > 0) ? ((gradient || grid) ? Math.min(100, exportBorder) : 1) : 0;
		var type = o.type;
		var nocrop = o.nocrop;
		var scale = (o.zoom > 0) ? o.zoom / 100 : 1;
		// SVG scales the diagram and not the border, the other formats paint
		// the SVG at a scale of 1 and scale the image (Editor.exportToCanvas)
		var svgScale = (o.svg) ? scale : 1;
		var shadow = o.shadow;
		var key = [selected, theme, transparent, border, type, nocrop, svgScale, shadow, grid].join(',');
		pane.classList.toggle(skin.classes.transparent, transparent);
		// An empty page says so instead of its blank image of 1 x 1
		var empty = !selected && !o.allPages && ui.isPreviewPageEmpty(graph);
		pane.classList.toggle(skin.classes.empty, empty);

		if (key != imageKey && ready)
		{
			imageKey = key;
			imageSize = null;
			imageBackground = null;
			var bg = null;
			var look = (theme == 'auto') ? ((Editor.isDarkMode()) ? 'dark' : 'light') : theme;

			if (!transparent)
			{
				bg = (graph.background != null && graph.background != mxConstants.NONE) ?
					graph.background : Editor.getDefaultPageBackgroundColor();
				var ld = mxUtils.getLightDarkColor(bg);
				// Like Graph.getSvg: light if adaptive colors are none
				imageBackground = (look == 'dark' && graph.getAdaptiveColors() != 'none') ?
					ld.dark : ld.light;
			}

			try
			{
				// The grid as the export paints it, under the cells
				var svg = graph.getSvg(bg, svgScale, border, nocrop, null, !selected,
					null, null, null, (!o.svg) ? shadow : null, null, look, type,
					null, null, null, grid);

				// The shadow and its room, as exportSvg and exportToCanvas add them
				if (shadow)
				{
					graph.addSvgShadow(svg);
				}

				img.setAttribute('src', Editor.createSvgDataUri(mxUtils.getXml(svg)));
				var w = parseInt(svg.getAttribute('width'));
				var h = parseInt(svg.getAttribute('height'));

				if (w > 0 && h > 0)
				{
					imageSize = {width: w, height: h};
				}

				embedImageFonts(svg, key);
			}
			catch (e)
			{
				img.removeAttribute('src');
			}
		}

		var size = null;
		padImage(Math.min(100, exportBorder) - border);

		if (imageSize != null && (!empty || type == 'page'))
		{
			var extra = 2 * (exportBorder - border);
			size = {width: imageSize.width + extra, height: imageSize.height + extra};

			if (!o.svg)
			{
				var s = ui.editor.getMaxCanvasScale(size.width, size.height, scale);
				size = {width: Math.ceil(s * size.width), height: Math.ceil(s * size.height)};
			}
		}

		return {options: o, size: size};
	};

	return {update: update, setReady: function()
	{
		ready = true;
	}};
};

/**
 * Calls the given function now, at once for each change in the given
 * element of a dialog and after typing and dragging rest for each input
 * (EditorUi.previewDelay; not after the dialog was closed), and once more
 * after the dialog is shown (EditorUi.afterFrame), when it first calls the
 * given function ready. Returns the function that refreshes at once.
 */
PreviewDialog.installRefresh = function(elt, fn, ready)
{
	var thread = null;

	var refresh = function()
	{
		window.clearTimeout(thread);
		thread = null;
		fn();
	};

	mxEvent.addListener(elt, 'change', refresh);
	mxEvent.addListener(elt, 'input', function()
	{
		window.clearTimeout(thread);
		thread = window.setTimeout(function()
		{
			// No render for a dialog that was closed in the meantime
			if (document.body.contains(elt))
			{
				refresh();
			}
		}, EditorUi.previewDelay);
	});

	refresh();

	// The picture after the dialog is shown
	EditorUi.afterFrame(function()
	{
		if (document.body.contains(elt))
		{
			if (ready != null)
			{
				ready();
			}

			refresh();
		}
	});

	return refresh;
};

/**
 * Number of the next generated ID of a field or a message.
 */
PreviewDialog.idCount = 0;

/**
 * Returns a new ID with the given prefix.
 */
PreviewDialog.createId = function(prefix)
{
	return prefix + (PreviewDialog.idCount++);
};

/**
 * Keeps the pictures in the given pane of a preview from being dragged: the
 * browser lets the mouse drag an image (the diagram of the preview of Print
 * and of the Export dialog) as a picture of its own (Kym, 24 November 2026).
 * Clicks, the wheel and the scroll of the pane are not changed.
 */
PreviewDialog.preventDrag = function(pane)
{
	mxEvent.addListener(pane, 'dragstart', function(evt)
	{
		evt.preventDefault();
	});
};

/**
 * The skins of the Preview template. A skin has the classes of the parts
 * and the builders of its controls (see PreviewDialog.skins.classic):
 * createSection, createRow, createCheckRow, createChoice, createHint,
 * createEmpty and createSpinner, isPaneFitWidth (optional). The skin of
 * Fusion is added by SimpleDialogs.js.
 */
PreviewDialog.skins = {};

/**
 * The Classic skin (docs/dialog-style-guide.md), also for Simple and the
 * other themes: sections are geDialogSection cards with a title, rows are
 * geDialogFormRow and geDialogCheckRow, a choice of a few values is a list
 * (select) and an option a checkbox. The CSS is in grapheditor.css under
 * .gePreviewTemplate (below 700 px the preview is above the fields).
 */
PreviewDialog.skins.classic = {
	name: 'classic',
	classes: {template: 'gePreviewTemplate', head: 'gePreviewHead', subtitle: 'geDialogHint gePreviewSubtitle',
		body: 'gePreviewBody', pane: 'gePreviewPane', options: 'gePreviewOptions',
		transparent: 'gePreviewTransparent', empty: 'gePreviewIsEmpty', busy: 'geBusy', icon: null,
		fieldError: 'geDialogFieldError', field: null, invalid: 'geDialogFieldInvalid',
		tiles: 'gePreviewTiles', tile: 'gePreviewTile', formatRow: 'gePreviewFormatRow',
		formatGroup: 'gePreviewFormats', moreFormats: 'gePreviewMoreFormats', moreOn: 'gePreviewFormatOn',
		presets: 'gePreviewPresets'},
	/**
	 * The classes of the sheets of Print (see createPrintPreview) and the
	 * custom property of the aspect of a sheet.
	 */
	print: {sheet: 'gePrintSheet', area: 'gePrintArea', sheets: 'gePrintSheets', tile: 'gePrintSheetTile',
		on: 'gePrintSheetOn', landscape: 'gePrintLandscape', grid: 'gePrintGrid', ratio: '--ge-sheet-ratio'},
	/**
	 * Returns the section with the given title in the given column: the
	 * title (a heading) and the card that takes the rows that follow.
	 */
	createSection: function(title, parent)
	{
		var head = null;

		if (title != null)
		{
			head = document.createElement('div');
			head.className = 'gePreviewSectionTitle';
			head.setAttribute('role', 'heading');
			head.setAttribute('aria-level', '3');
			mxUtils.write(head, title);
			parent.appendChild(head);
		}

		var content = document.createElement('div');
		content.className = 'geDialogSection';
		parent.appendChild(content);

		return {head: head, content: content};
	},
	/**
	 * Adds a row with the given label and control to the given parent and
	 * returns the element that holds the control. The label names inputs,
	 * lists and text areas.
	 */
	createRow: function(label, control, className, parent)
	{
		var r = document.createElement('div');
		r.className = 'geDialogFormRow' + ((className != null) ? ' ' + className : '');
		var l = document.createElement('label');
		l.className = 'geDialogFormLabel';
		mxUtils.write(l, label + ':');
		r.appendChild(l);
		var c = document.createElement('div');
		c.className = 'gePreviewControl';
		r.appendChild(c);

		if (control != null)
		{
			c.appendChild(control);
			PreviewDialog.labelControl(l, control);
		}

		parent.appendChild(r);

		return c;
	},
	/**
	 * Adds a row with the given checkbox and label (and an optional hint) to
	 * the given parent and returns the row.
	 */
	createCheckRow: function(input, label, hint, parent)
	{
		var r = document.createElement('div');
		r.className = 'geDialogCheckRow';
		input.setAttribute('type', 'checkbox');
		input.removeAttribute('role');
		r.appendChild(input);

		var l = document.createElement('label');
		mxUtils.write(l, label);
		PreviewDialog.labelControl(l, input);
		r.appendChild(l);

		if (hint != null)
		{
			var h = document.createElement('span');
			h.className = 'geDialogHint gePreviewCheckHint';
			h.setAttribute('id', PreviewDialog.createId('gePreviewCheckHint'));
			mxUtils.write(h, hint);
			r.appendChild(h);

			// The hint is outside the label, so it describes the checkbox
			// (keeps the IDs of setFieldError)
			var ids = mxUtils.trim(input.getAttribute('aria-describedby') || '');
			input.setAttribute('aria-describedby', ((ids.length > 0) ? ids + ' ' : '') + h.id);
		}

		parent.appendChild(r);

		return r;
	},
	/**
	 * Returns a list for the given items ({value, label}) with the given
	 * value, which calls fn with the value and the event of a change.
	 */
	createChoice: function(items, value, fn, label)
	{
		var select = document.createElement('select');

		if (label != null)
		{
			select.setAttribute('aria-label', label);
		}

		for (var i = 0; i < items.length; i++)
		{
			var option = document.createElement('option');
			option.value = items[i].value;
			mxUtils.write(option, items[i].label);
			select.appendChild(option);
		}

		var current = null;

		select.setValue = function(v)
		{
			select.value = (v != null) ? v : '';

			// A value that is not in the list shows no choice
			if (select.value != v)
			{
				select.selectedIndex = -1;
			}

			current = select.value;
		};

		select.setDisabled = function(disabled)
		{
			select.disabled = disabled;
		};

		select.setItemDisabled = function(v, disabled)
		{
			for (var i = 0; i < select.options.length; i++)
			{
				if (select.options[i].value == v)
				{
					select.options[i].disabled = disabled;
				}
			}
		};

		mxEvent.addListener(select, 'change', function(evt)
		{
			if (select.value != current)
			{
				current = select.value;
				fn(select.value, evt);
			}
		});

		select.setValue(value);

		return select;
	},
	/**
	 * Returns the group of the formats of the Export dialog for the given
	 * items ({value, label}) with the given value, which calls fn with the
	 * value and the event of a change (see EditorUi.createExportFormatRow):
	 * small tiles of the names in a radio group, the buttons in the order of
	 * the items.
	 */
	createFormatGroup: function(items, value, fn, label)
	{
		var group = PreviewDialog.createTiles({classes: {tiles: 'gePreviewFormats',
			tile: 'gePreviewFormat'}}, items, value, fn, label);
		group.buttons = group.tiles;

		return group;
	},
	/**
	 * Adds the given hint to the given parent.
	 */
	createHint: function(text, parent)
	{
		var h = document.createElement('div');
		h.className = 'geDialogHint gePreviewHint';
		mxUtils.write(h, text);
		parent.appendChild(h);

		return h;
	},
	/**
	 * Returns the text that a preview of an empty page shows (the class
	 * empty of the pane shows it).
	 */
	createEmpty: function()
	{
		var empty = document.createElement('div');
		empty.className = 'gePreviewEmpty';
		mxUtils.write(empty, mxResources.get('pageIsEmpty'));

		return empty;
	},
	/**
	 * Returns the spinner of a busy button.
	 */
	createSpinner: function()
	{
		var spinner = document.createElement('span');
		spinner.className = 'geDialogSpinner';
		spinner.setAttribute('aria-hidden', 'true');

		return spinner;
	}
};

/**
 * Returns the skin of the Preview template for the current theme: the skin
 * of Fusion in Fusion (if its scripts are loaded), else the Classic skin.
 */
PreviewDialog.getSkin = function()
{
	return (typeof Editor.isSimpleModern === 'function' && Editor.isSimpleModern() &&
		PreviewDialog.skins.fusion != null) ? PreviewDialog.skins.fusion :
		PreviewDialog.skins.classic;
};

/**
 * Makes the given label name the given control if it is a field (an input,
 * a list or a text area), with a new ID if it has none.
 */
PreviewDialog.labelControl = function(label, control)
{
	if (control.nodeName == 'INPUT' || control.nodeName == 'SELECT' || control.nodeName == 'TEXTAREA')
	{
		if (control.id == null || control.id == '')
		{
			control.id = PreviewDialog.createId('gePreviewField');
		}

		label.setAttribute('for', control.id);
	}
};

/**
 * Creates the parts of the Preview template in the given skin: the head with
 * the title and the subtitle, and the body with the pane of the preview and
 * the column of the fields. The parts are not in a dialog yet (see attach).
 * config has the title (a text or an element), the subtitle (an element, a
 * text, true for an empty one, else none), paneClass (more classes of the
 * pane) and paneHidden (false if the pane is not hidden from screen readers;
 * a preview is a picture of what the fields say).
 *
 * Returns the layout: head, title, subtitle, body, pane, options, attach and
 * the builders of the column, which add to the current section (or to the
 * given parent): section, row, checkRow, hint, choice, tiles.
 */
PreviewDialog.createLayout = function(skin, config)
{
	config = (config != null) ? config : {};
	var classes = skin.classes;

	var head = document.createElement('div');
	head.className = classes.head;
	var title = null;

	if (config.title != null && config.title.nodeType == mxConstants.NODETYPE_ELEMENT)
	{
		title = config.title;
	}
	else
	{
		title = document.createElement('h3');
		mxUtils.write(title, (config.title != null) ? config.title : '');
	}

	head.appendChild(title);
	var subtitle = null;

	if (config.subtitle != null && config.subtitle !== false)
	{
		if (config.subtitle.nodeType == mxConstants.NODETYPE_ELEMENT)
		{
			subtitle = config.subtitle;
		}
		else
		{
			subtitle = document.createElement('div');
			subtitle.className = classes.subtitle;

			if (config.subtitle !== true)
			{
				mxUtils.write(subtitle, config.subtitle);
			}
		}

		head.appendChild(subtitle);
	}

	var body = document.createElement('div');
	body.className = classes.body;

	var pane = document.createElement('div');
	pane.className = classes.pane + ((config.paneClass != null) ? ' ' + config.paneClass : '');

	if (config.paneHidden !== false)
	{
		pane.setAttribute('aria-hidden', 'true');
	}

	body.appendChild(pane);

	var options = document.createElement('div');
	options.className = classes.options;
	body.appendChild(options);

	var current = options;

	var layout = {skin: skin, head: head, title: title, subtitle: subtitle, body: body, pane: pane, options: options,
		/**
		 * Puts the parts into the given element of a dialog: the head before
		 * the given node (or first), the body before the other given node (or
		 * last), and adds the class of the template.
		 */
		attach: function(elt, headBefore, bodyBefore)
		{
			elt.classList.add(classes.template);
			elt.insertBefore(head, (headBefore !== undefined) ? headBefore : elt.firstChild);
			elt.insertBefore(body, (bodyBefore != null) ? bodyBefore : null);
		},
		/**
		 * Adds a section with the given title to the given parent (or the
		 * column), which takes the rows that follow. Returns the parts of
		 * the section (head and content).
		 */
		section: function(name, parent)
		{
			var s = skin.createSection(name, (parent != null) ? parent : options);
			current = s.content;

			return s;
		},
		row: function(label, control, className, parent)
		{
			return skin.createRow(label, control, className, (parent != null) ? parent : current);
		},
		checkRow: function(input, label, hint, parent)
		{
			return skin.createCheckRow(input, label, hint, (parent != null) ? parent : current);
		},
		hint: function(text, parent)
		{
			return skin.createHint(text, (parent != null) ? parent : current);
		},
		choice: function(items, value, fn, label)
		{
			return skin.createChoice(items, value, fn, label);
		},
		tiles: function(items, value, fn, label)
		{
			return PreviewDialog.createTiles(skin, items, value, fn, label);
		},
		/**
		 * Rows that follow go into the given parent (or the current section).
		 */
		setParent: function(parent)
		{
			current = (parent != null) ? parent : options;
		}};

	return layout;
};

/**
 * Returns a group of tiles (a radio group that is one stop of Tab with the
 * arrow keys, see EditorUi.addRovingRadios) for the given items ({value,
 * label, hint, image}) with the given value, which calls fn with the value
 * and the event of a change. The names and hints are text.
 */
PreviewDialog.createTiles = function(skin, items, value, fn, label)
{
	// Skins without tiles (Fusion has its own) use those of the Classic skin
	var classes = (skin.classes.tiles != null) ? skin.classes : PreviewDialog.skins.classic.classes;
	var group = document.createElement('div');
	group.className = classes.tiles;
	group.setAttribute('role', 'radiogroup');

	if (label != null)
	{
		group.setAttribute('aria-label', label);
	}

	var tiles = [];
	var current = null;

	var setValue = function(v)
	{
		current = v;

		for (var i = 0; i < tiles.length; i++)
		{
			tiles[i].setAttribute('aria-checked', (items[i].value == v) ? 'true' : 'false');
		}
	};

	for (var i = 0; i < items.length; i++)
	{
		(function(item)
		{
			var tile = document.createElement('button');
			tile.setAttribute('type', 'button');
			tile.setAttribute('role', 'radio');
			tile.className = classes.tile;

			if (item.image != null)
			{
				var img = document.createElement('img');
				img.setAttribute('alt', '');
				img.setAttribute('src', item.image);
				tile.appendChild(img);
			}

			var name = document.createElement('span');
			name.className = classes.tile + 'Name';
			mxUtils.write(name, item.label);
			tile.appendChild(name);

			if (item.hint != null)
			{
				var hint = document.createElement('span');
				hint.className = classes.tile + 'Hint';
				mxUtils.write(hint, item.hint);
				tile.appendChild(hint);
			}

			mxEvent.addListener(tile, 'click', function(evt)
			{
				if (!tile.disabled && item.value != current)
				{
					setValue(item.value);
					fn(item.value, evt);
				}
			});

			tiles.push(tile);
			group.appendChild(tile);
		})(items[i]);
	}

	group.tiles = tiles;
	group.setValue = setValue;
	setValue(value);
	EditorUi.addRovingRadios(group);

	return group;
};

/**
 * Returns true if the given button is busy (see setBusy).
 */
PreviewDialog.isBusy = function(btn)
{
	return btn.previewBusy != null;
};

/**
 * Shows that the given button is busy in the given skin (the current one if
 * null): a spinner replaces its icon (or comes first) and the optional label
 * its text, it keeps at least its width, is named busy and ignores clicks
 * until setBusy(btn, false) restores it.
 */
PreviewDialog.setBusy = function(btn, busy, label, skin)
{
	skin = (skin != null) ? skin : PreviewDialog.getSkin();

	if (busy && btn.previewBusy == null)
	{
		var state = {nodes: [], minWidth: btn.style.minWidth, busyClass: skin.classes.busy};

		for (var c = btn.firstChild; c != null; c = c.nextSibling)
		{
			state.nodes.push(c);
		}

		if (btn.offsetWidth > 0)
		{
			btn.style.minWidth = btn.offsetWidth + 'px';
		}

		var spinner = skin.createSpinner();
		var icon = null;

		for (var i = 0; i < state.nodes.length && icon == null && skin.classes.icon != null; i++)
		{
			if (state.nodes[i].nodeType == mxConstants.NODETYPE_ELEMENT &&
				state.nodes[i].classList.contains(skin.classes.icon))
			{
				icon = state.nodes[i];
			}
		}

		if (label != null)
		{
			while (btn.firstChild != null)
			{
				btn.removeChild(btn.firstChild);
			}

			btn.appendChild(spinner);
			mxUtils.write(btn, label);
		}
		else if (icon != null)
		{
			btn.replaceChild(spinner, icon);
		}
		else
		{
			btn.insertBefore(spinner, btn.firstChild);
		}

		// Clicks and Enter do nothing while it is busy (listeners in the
		// capture phase of the target run first)
		state.blocker = function(evt)
		{
			evt.stopImmediatePropagation();
			evt.preventDefault();
		};

		btn.addEventListener('click', state.blocker, true);
		btn.previewBusy = state;
		btn.classList.add(state.busyClass);
		btn.setAttribute('aria-busy', 'true');
		btn.setAttribute('aria-disabled', 'true');
	}
	else if (!busy && btn.previewBusy != null)
	{
		var state = btn.previewBusy;
		btn.previewBusy = null;

		while (btn.firstChild != null)
		{
			btn.removeChild(btn.firstChild);
		}

		for (var i = 0; i < state.nodes.length; i++)
		{
			btn.appendChild(state.nodes[i]);
		}

		btn.removeEventListener('click', state.blocker, true);
		btn.style.minWidth = state.minWidth;
		btn.classList.remove(state.busyClass);
		btn.removeAttribute('aria-busy');
		btn.removeAttribute('aria-disabled');
	}
};

/**
 * Shows the given message under the given field in the given skin (the
 * current one if null) and gives the field the border of an error
 * (aria-invalid, the message describes the field). An empty or null message
 * removes them. The message is text. The field is the input or its wrapper
 * (the class field of the skin), the message follows it.
 */
PreviewDialog.setFieldError = function(input, message, skin)
{
	skin = (skin != null) ? skin : PreviewDialog.getSkin();
	var classes = skin.classes;
	var field = (classes.field != null && input.parentNode != null && input.parentNode.classList != null &&
		input.parentNode.classList.contains(classes.field)) ? input.parentNode : input;
	var msg = input.previewFieldError;
	var ids = mxUtils.trim(input.getAttribute('aria-describedby') || '');
	ids = (ids.length > 0) ? ids.split(/\s+/) : [];

	if (message != null && message != '')
	{
		if (msg == null)
		{
			msg = document.createElement('div');
			msg.className = classes.fieldError;
			msg.setAttribute('id', PreviewDialog.createId(classes.fieldError));

			if (skin.createErrorIcon != null)
			{
				msg.appendChild(skin.createErrorIcon());
			}

			msg.appendChild(document.createElement('span'));
			input.previewFieldError = msg;
		}

		msg.lastChild.textContent = '';
		mxUtils.write(msg.lastChild, message);

		if (field.parentNode != null && field.nextSibling != msg)
		{
			field.parentNode.insertBefore(msg, field.nextSibling);
		}

		if (mxUtils.indexOf(ids, msg.id) < 0)
		{
			ids.push(msg.id);
		}

		if (classes.invalid != null)
		{
			input.classList.add(classes.invalid);
		}

		input.setAttribute('aria-invalid', 'true');
		input.setAttribute('aria-describedby', ids.join(' '));
	}
	else
	{
		if (msg != null)
		{
			if (msg.parentNode != null)
			{
				msg.parentNode.removeChild(msg);
			}

			mxUtils.remove(msg.id, ids);
			input.previewFieldError = null;
		}

		if (classes.invalid != null)
		{
			input.classList.remove(classes.invalid);
		}

		input.removeAttribute('aria-invalid');

		if (ids.length > 0)
		{
			input.setAttribute('aria-describedby', ids.join(' '));
		}
		else
		{
			input.removeAttribute('aria-describedby');
		}
	}
};

/**
 * Makes the radios (role radio) of the given radio group one stop of Tab
 * (WAI-ARIA radio group, roving tab index), for groups of tiles and the
 * controls of other code: the checked radio, else the first enabled one, is
 * in the order of Tab, and the arrow keys, Home and End move the focus in
 * the group and click the radio they move to, or only move the focus if
 * manual is true (where a radio opens something, eg. Pick a folder…; Space
 * and Enter choose it). The stop follows the checked state and the radios
 * as they change.
 */
EditorUi.addRovingRadios = function(group, manual)
{
	var getRadios = function()
	{
		return Array.prototype.filter.call(group.querySelectorAll('[role="radio"]'), function(r)
		{
			return r.parentNode.closest('[role="radiogroup"]') == group;
		});
	};

	var isEnabled = function(r)
	{
		return !r.disabled && r.getAttribute('aria-disabled') != 'true' && r.style.display != 'none';
	};

	// The stop is the given radio, else the checked one, else the first
	var update = function(focused)
	{
		var radios = getRadios();
		var stop = (focused != null && mxUtils.indexOf(radios, focused) >= 0) ? focused : null;

		for (var i = 0; i < radios.length && stop == null; i++)
		{
			if (radios[i].getAttribute('aria-checked') == 'true' && isEnabled(radios[i]))
			{
				stop = radios[i];
			}
		}

		for (var i = 0; i < radios.length && stop == null; i++)
		{
			if (isEnabled(radios[i]))
			{
				stop = radios[i];
			}
		}

		for (var i = 0; i < radios.length; i++)
		{
			var index = (radios[i] == stop) ? '0' : '-1';

			if (radios[i].getAttribute('tabindex') != index)
			{
				radios[i].setAttribute('tabindex', index);
			}
		}
	};

	mxEvent.addListener(group, 'keydown', function(evt)
	{
		var radios = getRadios().filter(isEnabled);
		var index = mxUtils.indexOf(radios, document.activeElement);
		var next = null;

		// Shift+arrow keys move the focus between the controls (see the key
		// handler of EditorUi), as for radio buttons
		if (index >= 0 && !mxEvent.isControlDown(evt) && !mxEvent.isAltDown(evt) &&
			!mxEvent.isMetaDown(evt) && !mxEvent.isShiftDown(evt))
		{
			if (evt.key == 'ArrowRight' || evt.key == 'ArrowDown')
			{
				next = radios[(index + 1) % radios.length];
			}
			else if (evt.key == 'ArrowLeft' || evt.key == 'ArrowUp')
			{
				next = radios[(index + radios.length - 1) % radios.length];
			}
			else if (evt.key == 'Home')
			{
				next = radios[0];
			}
			else if (evt.key == 'End')
			{
				next = radios[radios.length - 1];
			}
		}

		if (next != null)
		{
			update(next);
			next.focus();

			if (!manual && next.getAttribute('aria-checked') != 'true')
			{
				next.click();
			}

			mxEvent.consume(evt);
		}
	});

	// Leaving the group, the stop is the checked radio again
	mxEvent.addListener(group, 'focusout', function(evt)
	{
		if (evt.relatedTarget == null || !group.contains(evt.relatedTarget))
		{
			update(null);
		}
	});

	if (window.MutationObserver != null)
	{
		new MutationObserver(function()
		{
			update((group.contains(document.activeElement)) ? document.activeElement : null);
		}).observe(group, {childList: true, subtree: true, attributes: true,
			attributeFilter: ['aria-checked', 'disabled', 'style']});
	}

	update(null);
};

/**
 * Tab follows the order in which the given dialog shows its controls (WCAG
 * 2.4.3): templates and frames show some parts in another order than the
 * DOM with CSS (order, reversed flex directions), and the focus trap of
 * Dialog uses the same order for its ends (getTabStops). The focus also
 * shows the whole control where it fits into its scrolling parents.
 */
EditorUi.prototype.installDialogTabOrder = function(dlg)
{
	var div = dlg.container;

	dlg.getTabStops = function()
	{
		return EditorUi.getShownTabStops(div);
	};

	// The focus shows the whole control where it fits into its scrolling
	// parents: the browser does not scroll a control that is partly shown
	// (rows that scroll sideways, whose inset the content clips:
	// scroll-padding-inline) and scrolls only the caret of a text area into
	// view. Up and down only for Tab, so a click does not move the content
	// under the pointer
	var tabbing = false;

	div.addEventListener('keydown', function(evt)
	{
		if (evt.keyCode == 9 /* Tab */)
		{
			tabbing = true;

			window.setTimeout(function()
			{
				tabbing = false;
			}, 0);
		}
	}, true);

	mxEvent.addListener(div, 'focusin', function(evt)
	{
		var r = evt.target.getBoundingClientRect();

		for (var p = evt.target.parentNode; p != null && p != div && p.nodeType == 1; p = p.parentNode)
		{
			var cs = window.getComputedStyle(p);
			var pr = p.getBoundingClientRect();
			var left = pr.left + p.clientLeft + (parseFloat(cs.scrollPaddingLeft) || 0);
			var right = pr.left + p.clientLeft + p.clientWidth - (parseFloat(cs.scrollPaddingRight) || 0);
			var top = pr.top + p.clientTop + (parseFloat(cs.scrollPaddingTop) || 0);
			var bottom = pr.top + p.clientTop + p.clientHeight - (parseFloat(cs.scrollPaddingBottom) || 0);

			if ((p.scrollWidth > p.clientWidth && /auto|scroll/.test(cs.overflowX) &&
				(r.left < left || r.right > right) && r.width <= right - left) ||
				(tabbing && p.scrollHeight > p.clientHeight && /auto|scroll/.test(cs.overflowY) &&
				(r.top < top || r.bottom > bottom) && r.height <= bottom - top))
			{
				evt.target.scrollIntoView({block: 'nearest', inline: 'nearest'});

				break;
			}
		}
	});

	// Moves only where the shown order is not the order of the DOM, so the
	// controls that handle Tab themselves keep it (bubbling)
	mxEvent.addListener(div, 'keydown', function(evt)
	{
		if (evt.keyCode == 9 /* Tab */ && !mxEvent.isConsumed(evt) && !evt.defaultPrevented &&
			!mxEvent.isControlDown(evt) && !mxEvent.isAltDown(evt) && !mxEvent.isMetaDown(evt))
		{
			var stops = EditorUi.getShownTabStops(div);
			var dom = EditorUi.getShownTabStops(div, true);
			var index = EditorUi.indexOfTabStop(stops, document.activeElement);

			if (index >= 0 && !EditorUi.isSameTabOrder(stops, dom))
			{
				var next = stops[(index + ((mxEvent.isShiftDown(evt)) ? stops.length - 1 : 1)) % stops.length];
				next.focus();
				mxEvent.consume(evt);
			}
		}
	});
};

/**
 * Returns the stops of Tab in the given container in the order in which
 * they are shown: the children of a flex or grid container in the order of
 * their order property, reversed in a reversed flex direction (or in the
 * order of the DOM if dom is true). The radio buttons of a name are one stop
 * (the checked one, else the first).
 */
EditorUi.getShownTabStops = function(container, dom)
{
	var stops = Dialog.getTabStops(container);
	var radios = {};

	stops = stops.filter(function(elt)
	{
		if (elt.nodeName == 'INPUT' && elt.type == 'radio' && elt.name != '')
		{
			var checked = (elt.form || container).querySelector('input[type="radio"][name="' +
				CSS.escape(elt.name) + '"]:checked');

			if ((checked != null && checked != elt && stops.indexOf(checked) >= 0) || radios[elt.name])
			{
				return false;
			}

			radios[elt.name] = true;
		}

		return true;
	});

	if (!dom)
	{
		var orders = new Map();

		// The shown index of each child of the given element
		var getOrder = function(parent)
		{
			var result = orders.get(parent);

			if (result == null)
			{
				result = new Map();
				var cs = window.getComputedStyle(parent);
				var children = Array.prototype.slice.call(parent.children);

				if (cs.display.indexOf('flex') >= 0 || cs.display.indexOf('grid') >= 0)
				{
					var keys = children.map(function(child, i)
					{
						return {child: child, order: parseInt(window.getComputedStyle(child).order) || 0, index: i};
					});

					keys.sort(function(a, b)
					{
						return (a.order != b.order) ? a.order - b.order : a.index - b.index;
					});

					if (cs.display.indexOf('flex') >= 0 && /-reverse$/.test(cs.flexDirection))
					{
						keys.reverse();
					}

					children = keys.map(function(k) { return k.child; });
				}

				for (var i = 0; i < children.length; i++)
				{
					result.set(children[i], i);
				}

				orders.set(parent, result);
			}

			return result;
		};

		var getPath = function(elt)
		{
			var path = [];

			for (var e = elt; e != null && e != container && e.parentNode != null; e = e.parentNode)
			{
				path.unshift(getOrder(e.parentNode).get(e));
			}

			return path;
		};

		var paths = new Map();

		for (var i = 0; i < stops.length; i++)
		{
			paths.set(stops[i], getPath(stops[i]));
		}

		stops.sort(function(a, b)
		{
			var pa = paths.get(a), pb = paths.get(b);

			for (var i = 0; i < Math.min(pa.length, pb.length); i++)
			{
				if (pa[i] != pb[i])
				{
					return pa[i] - pb[i];
				}
			}

			return pa.length - pb.length;
		});
	}

	return stops;
};

/**
 * Returns the index of the stop of the given element in the given stops (a
 * radio button is the stop of its name).
 */
EditorUi.indexOfTabStop = function(stops, elt)
{
	var index = mxUtils.indexOf(stops, elt);

	if (index < 0 && elt != null && elt.nodeName == 'INPUT' && elt.type == 'radio' && elt.name != '')
	{
		for (var i = 0; i < stops.length; i++)
		{
			if (stops[i].nodeName == 'INPUT' && stops[i].type == 'radio' && stops[i].name == elt.name)
			{
				return i;
			}
		}
	}

	return index;
};

/**
 * Returns true if the given lists of stops have the same order.
 */
EditorUi.isSameTabOrder = function(a, b)
{
	if (a.length != b.length)
	{
		return false;
	}

	for (var i = 0; i < a.length; i++)
	{
		if (a[i] != b[i])
		{
			return false;
		}
	}

	return true;
};

/**
 * Creates a dialog on the Preview template in the Classic skin, which the
 * dialogs of Classic and Simple use (the Export dialog and Print follow):
 * the given title and subtitle, the preview on the left (above the fields
 * below 700 px), the fields on the right and the footer with the help link,
 * Cancel and the primary button, which has the given verb (OK if null) and
 * calls fn with the dialog. The dialog closes after fn unless it returns
 * false. fn may return a promise-like object (then), during which the
 * primary button is busy (setBusy) and after which the dialog closes, unless
 * it is rejected or resolves with false. Returns the CustomDialog with its
 * layout (the parts and builders of PreviewDialog.createLayout), its primary
 * button and the functions setBusy(busy, label) and setFieldError(input,
 * message). Show it with showDialog(dlg.container, width, null, true, true)
 * (the height follows the content, see docs/dialog-style-guide.md), then
 * call init.
 */
EditorUi.prototype.createPreviewDialog = function(title, verb, fn, subtitle, helpLink)
{
	var ui = this;
	var skin = PreviewDialog.skins.classic;
	var layout = PreviewDialog.createLayout(skin, {title: title, subtitle: subtitle});
	var content = document.createElement('div');
	layout.attach(content, null, null);
	verb = (verb != null) ? verb : mxResources.get('ok');
	var dlg = new CustomDialog(this, content, null, null, verb, helpLink);

	// The Dialog that shows the given dialog (its container is the content of
	// the Dialog)
	var isShown = function()
	{
		return ui.dialog != null && ui.dialog.container.firstChild == dlg.container;
	};

	var close = function()
	{
		if (isShown())
		{
			ui.hideDialog(null, null, dlg.container);
		}
	};

	// The primary button of CustomDialog closes the dialog before or after
	// its function, this one when the result is there (and not false)
	var primary = mxUtils.button(verb, function()
	{
		var result = (fn != null) ? fn(dlg) : null;

		if (result != null && typeof result.then === 'function')
		{
			dlg.setBusy(true);

			result.then(function(value)
			{
				dlg.setBusy(false);

				if (value !== false)
				{
					close();
				}
			}, function()
			{
				dlg.setBusy(false);
			});
		}
		else if (result !== false)
		{
			close();
		}
	});

	primary.className = dlg.okButton.className;
	dlg.okButton.parentNode.replaceChild(primary, dlg.okButton);
	dlg.okButton = primary;

	dlg.container.classList.add('gePreviewDialog');
	dlg.layout = layout;
	dlg.primary = dlg.okButton;

	dlg.setBusy = function(busy, label)
	{
		PreviewDialog.setBusy(dlg.okButton, busy, label, skin);
	};

	dlg.setFieldError = function(input, message)
	{
		PreviewDialog.setFieldError(input, message, skin);
	};

	/**
	 * Installs the order of Tab as it is shown once the dialog is shown.
	 */
	dlg.init = function()
	{
		if (isShown())
		{
			ui.installDialogTabOrder(ui.dialog);
		}
	};

	return dlg;
};

/**
 * Returns the given texts joined with a middle dot, as subtitles and
 * captions write them ("A4 · Portrait · 2 sheets"); empty parts are left
 * out.
 */
PreviewDialog.joinList = function(parts)
{
	var result = [];

	for (var i = 0; i < parts.length; i++)
	{
		if (parts[i] != null && parts[i] !== '')
		{
			result.push(String(parts[i]));
		}
	}

	return result.join(' · ');
};

/**
 * Returns the language of the resources that the UI shows: the language of
 * the start (mxLanguage) or the one that mxResources.add loaded last
 * (SimpleUi.addedLanguage in FusionTheme.js, eg. after a switch of the
 * language) if it has resources of its own, else the default language
 * (English), as the app and mxResources.add load the default bundle for a
 * language without resources (eg. de-CH). Not mxClient.language, which is
 * the language of the browser if no language is set (eg. de-CH while the
 * resources are English), so texts built with it mixed two languages.
 */
PreviewDialog.getResourceLanguage = function()
{
	var lan = (typeof SimpleUi !== 'undefined' && SimpleUi.addedLanguage != null) ? SimpleUi.addedLanguage :
		((typeof mxLanguage !== 'undefined' && mxLanguage != null) ? String(mxLanguage) : '');

	return (lan != '' && mxResources.isLanguageSupported(lan)) ? lan : mxClient.defaultLanguage;
};

/**
 * Returns the given number with the separators of the given language or of
 * the language of the resources (getResourceLanguage), not of the browser
 * (a German browser showed 1.062 × 1.389 px in English), and of the region of
 * the browser if it has that language (de-CH for German).
 */
PreviewDialog.formatNumber = function(value, lan)
{
	try
	{
		lan = (lan != null) ? lan : PreviewDialog.getResourceLanguage();
		var locale = (window.Intl != null && Intl.NumberFormat != null) ?
			new Intl.NumberFormat().resolvedOptions().locale : null;

		if (locale != null && lan.split('-')[0].toLowerCase() == locale.split('-')[0].toLowerCase())
		{
			lan = locale;
		}

		return value.toLocaleString(lan);
	}
	catch (e)
	{
		return String(value);
	}
};

/**
 * Width of the content of Print on the Preview template in the Classic skin
 * (see EditorUi.showPrintDialog).
 */
PreviewDialog.printWidth = 720;

/**
 * Returns the name of the given page format (eg. A4 (210 mm x 297 mm)), or
 * its size in pixels if it is not one of the formats of Page Setup.
 */
EditorUi.prototype.getPaperName = function(format)
{
	var formats = PageSetupDialog.getFormats();
	var w = Math.min(format.width, format.height);
	var h = Math.max(format.width, format.height);

	for (var i = 0; i < formats.length; i++)
	{
		var f = formats[i].format;

		if (f != null && Math.abs(f.width - w) < 1 && Math.abs(f.height - h) < 1)
		{
			return formats[i].title;
		}
	}

	return Math.round(format.width) + ' × ' + Math.round(format.height) + ' px';
};

/**
 * Returns the changes of the paper in the print dialog of the given element
 * (Print, and the PDF of Export in Fusion): execute(format) changes the
 * paper of the page at once (an undoable ChangePageSetup, as in Page Setup,
 * so the preview shows it), and the dialog takes its changes back when it
 * closes without printing or previewing (Cancel, Escape, another format, Page
 * setup...): undo while the history ends with them, else one change back to
 * the paper it had, and the file is unmodified again if it was and nothing
 * saved it in between. The edits are compared by identity, not by their
 * index, as a full history drops its first edit for each new one, and edits
 * that undo took back in the dialog are left out. The primary button and
 * Preview of the given buttons keep the changes. close takes the changes back
 * unless they are kept (once); the dialog calls it when it closes if manual
 * is true, else a listener of hideDialog calls it. (Listeners that remove
 * themselves while an event is fired skip the next listener, so a dialog with
 * more cleanup should have one listener, see installPrintRefresh.)
 */
EditorUi.prototype.createPaperChanges = function(div, buttons, manual)
{
	var ui = this;
	var graph = this.editor.graph;
	var um = this.editor.undoManager;
	var file = this.getCurrentFile();
	var start = mxRectangle.fromRectangle(graph.pageFormat);
	var startModified = file == null || file.isModified();
	var startSaved = (file != null) ? file.lastSaved : null;
	var edits = [];
	var committed = false;
	var closed = false;

	var getLastEdit = function()
	{
		return (um.indexOfNextAdd > 0) ? um.history[um.indexOfNextAdd - 1] : null;
	};

	var startEdit = getLastEdit();

	// Print (or Export) and Preview of the print dialog, which shows the
	// paper the dialog has (PrintDialog.previewEnabled), keep the changes
	var btns = (buttons != null) ? buttons.querySelectorAll('button') : [];

	for (var i = 0; i < btns.length; i++)
	{
		if (btns[i].classList.contains('gePrimaryBtn') ||
			mxUtils.trim(btns[i].textContent) == mxResources.get('preview'))
		{
			// Before the handler of the button, which closes the dialog first
			btns[i].addEventListener('click', function()
			{
				committed = true;
			}, true);
		}
	}

	var revert = function()
	{
		// The changes that are still done (not undone or trimmed)
		var done = edits.filter(function(edit)
		{
			var index = mxUtils.indexOf(um.history, edit);

			return index >= 0 && index < um.indexOfNextAdd;
		});

		var n = done.length;
		var tail = n > 0 && um.indexOfNextAdd >= n && um.history.slice(um.indexOfNextAdd - n,
			um.indexOfNextAdd).every(function(edit, i)
		{
			return edit == done[i];
		});

		if (tail)
		{
			for (var i = 0; i < n; i++)
			{
				um.undo();
			}

			// No redo of the changes that were taken back
			um.trim();
		}
		else if (graph.pageFormat.width != start.width || graph.pageFormat.height != start.height)
		{
			var change = new ChangePageSetup(ui, null, null, start);
			change.ignoreColor = true;
			change.ignoreImage = true;
			graph.model.execute(change);
		}

		if (tail && !startModified && file == ui.getCurrentFile() && file.lastSaved == startSaved &&
			getLastEdit() === startEdit)
		{
			file.setModified(false);
			ui.editor.setModified(false);
			ui.editor.setStatus('');
		}
	};

	var close = function()
	{
		if (!closed)
		{
			closed = true;

			if (!committed && edits.length > 0 && graph.isEnabled())
			{
				revert();
			}
		}
	};

	if (!manual)
	{
		var listener = function(sender, evt)
		{
			var dlg = evt.getProperty('dialog');

			if (!closed && dlg != null && dlg.container != null && dlg.container.contains(div))
			{
				// Removed after the event, as a listener that removes itself
				// while the event is fired skips the next listener
				window.setTimeout(function()
				{
					ui.editor.removeListener(listener);
				}, 0);

				close();
			}
		};

		this.editor.addListener('hideDialog', listener);
	}

	return {close: close, execute: function(format)
	{
		var change = new ChangePageSetup(ui, null, null, format);
		change.ignoreColor = true;
		change.ignoreImage = true;
		var last = getLastEdit();
		graph.model.execute(change);
		var edit = getLastEdit();

		if (edit != null && edit !== last)
		{
			edits.push(edit);
		}
	}};
};

/**
 * Returns the controls of the given print dialog (PrintDialog.prototype.create
 * in diagramly/Editor.js): allPages, pages (the radio of the range), from,
 * to, selection, pageView, crop, fit, across, down, border, zoom, grid,
 * shadows, the title, the scrollWrapper with the fields, the buttons, the
 * pageCount and the currentPage (its number). Returns null if the dialog has
 * changed (files with one page have no page radios in the dialog).
 */
EditorUi.prototype.getPrintControls = function(div)
{
	var graph = this.editor.graph;

	var q = function(id)
	{
		return div.querySelector('#' + id);
	};

	var c = {allPages: q('gePrintDlgAllPages'), pages: q('gePrintDlgPages'),
		selection: q('gePrintDlgSelectionOnly'), pageView: q('gePrintDlgPageView'),
		crop: q('gePrintDlgCrop'), border: q('gePrintDlgBorder'), zoom: q('gePrintDlgZoom'),
		grid: q('gePrintDlgGrid'), shadows: q('gePrintDlgShadows'),
		fit: div.querySelector('input[name="printSize"]:not([id])'),
		scrollWrapper: div.firstChild, buttons: div.lastChild,
		pageCount: (this.pages != null) ? this.pages.length : 1};
	c.title = (c.scrollWrapper != null) ? c.scrollWrapper.querySelector('h3') : null;

	// Read-only diagrams have no selection in the dialog
	if (c.selection == null && !graph.isEnabled())
	{
		c.selection = {checked: false};
	}

	if (((c.allPages == null || c.pages == null) && c.pageCount > 1) || c.selection == null ||
		c.pageView == null || c.crop == null || c.border == null || c.zoom == null || c.grid == null ||
		c.shadows == null || c.fit == null || c.title == null || c.buttons == null ||
		c.scrollWrapper == c.buttons)
	{
		return null;
	}

	var range = (c.pages != null) ? c.pages.parentNode.querySelectorAll('input[type="number"]') : [];
	var sheets = c.fit.parentNode.querySelectorAll('input[type="number"]');
	c.from = range[0];
	c.to = range[1];
	c.across = sheets[0];
	c.down = sheets[1];
	var index = (this.currentPage != null) ? this.getPageIndex(this.currentPage) : null;
	c.currentPage = (index != null) ? index + 1 : 1;

	return c;
};

/**
 * Creates the preview of the sheets of Print in the given pane of the
 * Preview template in the given skin (its classes print): the first sheet of
 * the page in the picture as it is printed, in the shape of its paper (or of
 * the diagram if it is cropped) with the diagram where the output has it,
 * the tiles of up to 6 sheets and a caption with the page, the number of
 * sheets and the paper. c are the controls of the dialog (getPrintControls)
 * and remote is true for the PDF of the export service, which gets only the
 * selected cells. Returns update, which shows the sheets of the controls and
 * returns what is printed (page: the number of the page in the picture,
 * pages: the number of printed pages, first: the first printed page, count:
 * the number of sheets, paper: its name, empty: the page in the picture is
 * empty, waiting: its graph is not made yet), setReady, after which update
 * makes the pictures (once the dialog is shown, as they take seconds for
 * large diagrams), and destroy, which removes the graph of another page.
 *
 * The picture is the SVG of Graph.getSvg, which sanitizes the labels, shown
 * as a data URI in an image.
 */
EditorUi.prototype.createPrintPreview = function(pane, c, skin, remote)
{
	var ui = this;
	var graph = this.editor.graph;
	var classes = skin.print;
	var pageCount = c.pageCount;
	var currentPage = c.currentPage;
	var selection = c.selection;
	var allPages = c.allPages;
	var from = c.from, to = c.to, across = c.across, down = c.down;
	var zoom = c.zoom, crop = c.crop, fit = c.fit, border = c.border, grid = c.grid;

	var sheet = document.createElement('div');
	sheet.className = classes.sheet;
	pane.appendChild(sheet);
	pane.appendChild(skin.createEmpty());
	PreviewDialog.preventDrag(pane);

	// The part of a sheet that shows the diagram with the image of the diagram
	var createSheetArea = function(parent)
	{
		var area = document.createElement('div');
		area.className = classes.area;
		var img = document.createElement('img');
		img.setAttribute('alt', '');
		area.appendChild(img);
		parent.appendChild(area);

		return area;
	};

	var sheetArea = createSheetArea(sheet);

	var strip = document.createElement('div');
	strip.className = classes.sheets;
	pane.appendChild(strip);

	// The image of the diagram (or of the selection) with its size and its
	// origin in the coordinates of the view at a scale of 1 (the size and
	// the translate of Graph.getSvg). It is made after the dialog is shown
	// (ready), as it takes seconds for large diagrams
	var image = null;
	var imageKey = null;
	var ready = false;

	// The SVG of a page in an image cannot load the fonts of its labels (the
	// hand-drawn font of Sketch, Google fonts, fontCss in the configuration),
	// which the output has, so they are embedded as in the export of SVGs
	// (EditorUi.embedFonts, cached by the editor) with the fonts of the file
	// of the given graph (another page has its own, see createPageGraph); the
	// sheets show the image without them until they are loaded, unless
	// another image came first
	var embedImageFonts = function(g, svg, img)
	{
		if (typeof ui.embedFonts === 'function' && typeof g.getCustomFonts === 'function' &&
			(ui.editor.fontCss != null || g.getCustomFonts().length > 0))
		{
			ui.embedFonts(svg, function()
			{
				if (image == img)
				{
					var src = Editor.createSvgDataUri(mxUtils.getXml(svg));
					var imgs = pane.getElementsByTagName('img');

					for (var i = 0; i < imgs.length; i++)
					{
						if (imgs[i].getAttribute('src') == img.src)
						{
							imgs[i].setAttribute('src', src);
						}
					}

					img.src = src;
				}
			}, true, null, g);
		}
	};

	var updateImage = function(g, n)
	{
		if (!ready)
		{
			return;
		}

		var selected = g == graph && selection.checked && !graph.isSelectionEmpty();
		// The origin of the image includes the translate and the scale of the
		// view at the time, which page setup changes, so they are part of the key
		var key = n + ' ' + ((selected) ? 'selection' : 'diagram') + ' ' +
			g.view.translate.x + ' ' + g.view.translate.y + ' ' + g.view.scale;

		if (key != imageKey)
		{
			imageKey = key;
			image = null;

			try
			{
				var svg = g.getSvg(null, 1, 0, false, null, !selected,
					null, null, null, false, null, 'light');
				var vs = g.view.scale;
				var bounds = (selected) ? graph.getBoundingBox(graph.getSelectionCells()) : g.getGraphBounds();
				var temp = {src: Editor.createSvgDataUri(mxUtils.getXml(svg)),
					x: -Math.floor(mxUtils.unscale(-mxUtils.unscale(bounds.x, vs), 1)),
					y: -Math.floor(mxUtils.unscale(-mxUtils.unscale(bounds.y, vs), 1)),
					width: parseFloat(svg.getAttribute('width')),
					height: parseFloat(svg.getAttribute('height'))};

				if (isFinite(temp.x) && isFinite(temp.y) && temp.width > 0 && temp.height > 0)
				{
					image = temp;
					embedImageFonts(g, svg, temp);
				}
			}
			catch (e)
			{
				image = null;
			}
		}
	};

	// The sheets of the page in the preview as the output has them, computed
	// like EditorUi.print (printGraph) and mxPrintPreview.open: the size of a
	// sheet (the paper, or the diagram if it is cropped), the sheets across
	// and down, the scale and the coordinates of the view at a scale of 1 at
	// the origin of the first sheet, and the area of a sheet that shows the
	// diagram. That area is the SVG of a page, which the output centers in
	// the sheet: as wide as the sheet without the border on both sides, in
	// the aspect of its viewBox, and no higher than the sheet. The given
	// graph is that of the page in the picture (see getPictureGraph), each
	// page is printed with its own paper and diagram
	var getSheetLayout = function(g)
	{
		var vs = g.view.scale;
		var tr = g.view.translate;
		var selected = g == graph && selection.checked && !graph.isSelectionEmpty();
		var gb = g.getGraphBounds();
		var pf = mxRectangle.fromRectangle(g.pageFormat);
		var temp = Math.max(1, Math.min(1600, parseInt(zoom.value) || 100)) / 100;
		var autoOrigin = fit.checked || crop.checked || !g.pageVisible;
		var scale = temp;
		var x0 = 0;
		var y0 = 0;
		pf.width = pf.width * g.pageScale;
		pf.height = pf.height * g.pageScale;

		if (fit.checked)
		{
			pf.width = Math.ceil(pf.width * temp);
			pf.height = Math.ceil(pf.height * temp);
			scale = Math.min((pf.height * Math.max(1, parseInt(down.value) || 1)) / (gb.height / vs),
				(pf.width * Math.max(1, parseInt(across.value) || 1)) / (gb.width / vs));
		}

		if (!autoOrigin)
		{
			// The export service gets only the selected cells, so it starts at
			// the first page of the selection
			var layout = (selected && remote) ? graph.getPageLayout(graph.getBoundingBox(graph.getSelectionCells())) :
				g.getPageLayout();
			x0 -= layout.x * pf.width;
			y0 -= layout.y * pf.height;
		}

		if (crop.checked)
		{
			var cb = (selected) ? graph.getBoundingBox(graph.getSelectionCells()) : gb;

			if (cb != null)
			{
				pf.width = (cb.width + 1) * scale / vs;
				pf.height = (cb.height + 1) * scale / vs;
			}
		}

		var pb = (selected) ? graph.getBoundingBox(graph.getSelectionCells()) : gb;
		var result = {width: pf.width, height: pf.height, across: 1, down: 1, count: 1,
			cropped: crop.checked, scale: null, area: null};

		if (pb == null || !isFinite(scale) || scale <= 0 || !(pf.width > 0) || !(pf.height > 0) ||
			!isFinite(pf.width) || !isFinite(pf.height))
		{
			if (!(result.width > 0) || !(result.height > 0) || !isFinite(result.width) || !isFinite(result.height))
			{
				result.width = g.pageFormat.width;
				result.height = g.pageFormat.height;
			}

			return result;
		}

		var psc = vs / scale;
		var pbw = pb.width;
		var pbh = pb.height;
		var px0 = x0;
		var py0 = y0;
		result.x = pb.x / vs;
		result.y = pb.y / vs;

		if (!autoOrigin)
		{
			px0 -= tr.x * scale;
			py0 -= tr.y * scale;
			pbw += pb.x;
			pbh += pb.y;
			result.x = tr.x - x0 / scale;
			result.y = tr.y - y0 / scale;
		}

		result.across = Math.max(1, Math.ceil((pbw / psc + px0) / (pf.width + 1)));
		result.down = Math.max(1, Math.ceil((pbh / psc + py0) / (pf.height + 1)));
		result.count = result.across * result.down;
		result.scale = scale;

		// The viewBox of the SVG of a page is the sheet and 2 more
		var m = Math.max(0, parseInt(border.value) || 0);
		var vw = pf.width + 2;
		var vh = pf.height + 2;
		var w = pf.width - 2 * m;
		var h = w * vh / vw;

		if (h > pf.height)
		{
			h = pf.height;
			w = h * vw / vh;
		}

		if (w > 0 && h > 0)
		{
			result.area = {x: (pf.width - w) / 2, y: (pf.height - h) / 2, width: w, height: h,
				viewWidth: vw, viewHeight: vh};
		}

		return result;
	};

	// Shows the sheet with the given index of the given layout in the given
	// area: the image is where the output paints the diagram on that sheet
	// (each sheet starts one sheet, less the pixel that sheets share, after
	// the one before it, see mxPrintPreview.open)
	var updateSheetArea = function(area, layout, index)
	{
		var img = area.firstChild;
		var a = layout.area;

		if (image == null || a == null || layout.scale == null)
		{
			area.style.display = 'none';

			return;
		}

		var percent = function(value, total)
		{
			return (100 * value / total).toFixed(3) + '%';
		};

		var s = layout.scale;
		var col = index % layout.across;
		var row = Math.floor(index / layout.across);
		area.style.display = '';
		area.style.left = percent(a.x, layout.width);
		area.style.top = percent(a.y, layout.height);
		area.style.width = percent(a.width, layout.width);
		area.style.height = percent(a.height, layout.height);
		img.style.left = percent((image.x - layout.x) * s - col * (layout.width + 1 - s), a.viewWidth);
		img.style.top = percent((image.y - layout.y) * s - row * (layout.height + 1 - s), a.viewHeight);
		img.style.width = percent(image.width * s, a.viewWidth);
		img.style.height = percent(image.height * s, a.viewHeight);

		if (img.getAttribute('src') != image.src)
		{
			img.setAttribute('src', image.src);
		}
	};

	var getPrintedPages = function()
	{
		if (selection.checked || pageCount == 1)
		{
			return 1;
		}
		else if (allPages.checked)
		{
			return pageCount;
		}

		return Math.max(1, (parseInt(to.value) || 1) - (parseInt(from.value) || 1) + 1);
	};

	// The number of the page in the picture: the current page, or the first
	// printed page if a range does not have the current page
	var getPicturePage = function()
	{
		if (selection.checked || pageCount == 1 || allPages.checked)
		{
			return currentPage;
		}

		var first = parseInt(from.value) || 1;
		var last = parseInt(to.value) || first;

		return (currentPage >= first && currentPage <= last) ? currentPage :
			Math.max(1, Math.min(pageCount, first));
	};

	// The graph of the page with the given number: the graph of the editor
	// for the current page, else a temporary graph of the page as Print and
	// the exports have it (EditorUi.createPageGraph), made only after the
	// dialog is shown and kept until another page is in the picture or the
	// dialog closes. Null while it cannot be made.
	var pageGraph = null;
	var pageGraphNumber = null;

	var removePageGraph = function()
	{
		if (pageGraph != null)
		{
			if (pageGraph.container.parentNode != null)
			{
				pageGraph.container.parentNode.removeChild(pageGraph.container);
			}

			pageGraph.destroy();
			pageGraph = null;
			pageGraphNumber = null;
		}
	};

	var getPictureGraph = function(n)
	{
		if (n == currentPage)
		{
			return graph;
		}
		else if (pageGraphNumber != n && ready && ui.pages != null && ui.pages[n - 1] != null)
		{
			removePageGraph();

			try
			{
				pageGraph = ui.createPageGraph(ui.pages[n - 1], n - 1);
				pageGraphNumber = n;
			}
			catch (e)
			{
				removePageGraph();
			}
		}

		return (pageGraphNumber == n) ? pageGraph : null;
	};

	var update = function()
	{
		// The first sheet of the page in the picture as it is printed: in the
		// shape of its paper, or of the diagram if it is cropped, with the
		// diagram where the output has it
		var n = getPicturePage();
		var g = getPictureGraph(n);
		strip.textContent = '';

		// Another page than the current one is shown once its graph is made
		var waiting = g == null;

		if (waiting)
		{
			image = null;
			imageKey = null;
			sheetArea.style.display = 'none';
			g = graph;
		}
		else
		{
			updateImage(g, n);
		}

		// An empty page says so instead of a blank sheet, only if it is the
		// one page that is printed (the page in the picture)
		var empty = !waiting && ((selection.checked) ? graph.isSelectionEmpty() :
			getPrintedPages() == 1) && ui.isPreviewPageEmpty(g);
		pane.classList.toggle(skin.classes.empty, empty);
		var pageFormat = g.pageFormat;
		var layout = getSheetLayout(g);
		// The sheets have the background color of the page as it is printed
		// (light, without a gradient), the paper of the theme without one
		var bg = g.background;
		var paperColor = (bg != null && bg != mxConstants.NONE && Graph.isSafeCssColor(bg)) ?
			mxUtils.getLightDarkColor(bg).light : '';
		var ratio = layout.width / layout.height;
		sheet.style.aspectRatio = layout.width + ' / ' + layout.height;
		sheet.style.setProperty(classes.ratio, ratio.toFixed(4));
		sheet.classList.toggle(classes.landscape, layout.width > layout.height);
		sheet.classList.toggle(classes.grid, grid.checked);
		sheet.style.backgroundColor = paperColor;
		updateSheetArea(sheetArea, layout, 0);

		// Cropped sheets have the size of the diagram, not of the paper
		var count = layout.count;
		var pages = getPrintedPages();
		// (none for an empty page, which has no size)
		var paperName = (layout.cropped) ? ((empty) ? null :
			PreviewDialog.formatNumber(Math.round(layout.width)) + ' × ' +
			PreviewDialog.formatNumber(Math.round(layout.height)) + ' px') :
			PreviewDialog.joinList([ui.getPaperName(pageFormat),
			mxResources.get((pageFormat.width > pageFormat.height) ? 'landscape' : 'portrait')]);

		// The tiles of the sheets for more than one sheet
		for (var i = 0; i < Math.min((waiting) ? 0 : count, 6) && count > 1; i++)
		{
			var tile = document.createElement('div');
			tile.className = classes.tile + ((i == 0) ? ' ' + classes.on : '');
			tile.style.aspectRatio = layout.width + ' / ' + layout.height;
			tile.style.setProperty(classes.ratio, ratio.toFixed(4));
			tile.style.backgroundColor = paperColor;
			updateSheetArea(createSheetArea(tile), layout, i);
			strip.appendChild(tile);
		}

		// With several printed pages the sheets are those of the page in the
		// picture (each page is printed on its own sheets), one sheet has no
		// count
		if (!waiting)
		{
			var caption = document.createElement('span');
			mxUtils.write(caption, PreviewDialog.joinList([(pages > 1) ? mxResources.get('pageNumber', [n]) : null,
				(count > 1) ? mxResources.get('numberOfSheets', [count]) : null, paperName]));
			strip.appendChild(caption);
		}

		var all = pageCount > 1 && allPages.checked;
		var first = (all || selection.checked || pageCount == 1) ? 1 : (parseInt(from.value) || 1);

		return {page: n, pages: pages, first: first, count: count, paper: paperName,
			empty: empty, waiting: waiting};
	};

	return {update: update, destroy: removePageGraph, setReady: function()
	{
		ready = true;
	}};
};

/**
 * Returns what the given print dialog prints, for its subtitle: the title of
 * the file and the selection, the number of pages or the page ("Order
 * process · 3 pages"). info is the result of the update of the preview (see
 * createPrintPreview). Returns an empty string if there is nothing to say.
 */
EditorUi.prototype.getPrintSubtitle = function(c, info)
{
	var file = this.getCurrentFile();

	return PreviewDialog.joinList([(file != null) ? file.getTitle() : null,
		(c.selection.checked) ? mxResources.get('selection') : ((info.pages > 1) ?
		mxResources.get('pagesN', [info.pages]) : ((c.pageCount > 1) ?
		mxResources.get('pageNumber', [info.first]) : null))]);
};

/**
 * Updates the given print dialog with the given function now, at once for
 * each change in the given elements and after typing and dragging rest for
 * each input (EditorUi.previewDelay), when its paper changes (also by undo,
 * which the given accessor of the format panel then shows) and once more
 * after the dialog is shown, when the given preview (createPrintPreview)
 * gets ready. Nothing is updated after the dialog closed, the preview
 * removes the graph it made then and the given paper changes (see
 * createPaperChanges with manual) close, in one listener of hideDialog.
 * Returns the function that updates at once.
 */
EditorUi.prototype.installPrintRefresh = function(div, elts, update, preview, accessor, paperChanges)
{
	var ui = this;
	var graph = this.editor.graph;
	var thread = null;
	var closed = false;

	var updateNow = function()
	{
		window.clearTimeout(thread);
		thread = null;

		if (!closed)
		{
			update();
		}
	};

	for (var i = 0; i < elts.length; i++)
	{
		if (elts[i] != null)
		{
			mxEvent.addListener(elts[i], 'input', function()
			{
				window.clearTimeout(thread);
				thread = window.setTimeout(updateNow, EditorUi.previewDelay);
			});
			mxEvent.addListener(elts[i], 'change', updateNow);
		}
	}

	// Follows changes of the page format from elsewhere (undo)
	var formatListener = function()
	{
		if (accessor != null)
		{
			accessor.set(graph.pageFormat);
		}

		updateNow();
	};

	ui.addListener('pageFormatChanged', formatListener);

	var removeListener = function(sender, evt)
	{
		var dlg = evt.getProperty('dialog');

		if (!closed && dlg != null && dlg.container != null && dlg.container.contains(div))
		{
			ui.removeListener(formatListener);
			window.clearTimeout(thread);

			// Removed after the event, as a listener that removes itself while
			// the event is fired skips the next listener (the one of the row of
			// the formats of the Export dialog, see createExportFormatRow)
			window.setTimeout(function()
			{
				ui.editor.removeListener(removeListener);
			}, 0);
			closed = true;
			preview.destroy();

			if (paperChanges != null)
			{
				paperChanges.close();
			}
		}
	};

	ui.editor.addListener('hideDialog', removeListener);
	update();

	// The picture after the dialog is shown
	EditorUi.afterFrame(function()
	{
		if (!closed)
		{
			preview.setReady();
			update();
		}
	});

	return updateNow;
};

/**
 * Puts the given print dialog (PrintDialog.prototype.create in
 * diagramly/Editor.js) on the Preview template in the Classic skin, for
 * Print in Classic and Simple (Editor.isPrintPreviewEnabled, batch 5 of the
 * plan "Fusion ideas in Simple and Classic"), also in Sketch, Minimal and
 * Atlas (17 November 2026): the title and what is printed,
 * the preview of the sheets on the left (above the fields below 700 px) and
 * the fields of the dialog on the right in their order, with Paper before
 * Advanced (the size and orientation of Page Setup, see
 * createPaperChanges), and the footer with Cancel, Preview and Print. The
 * fields keep their behavior, so printing is unchanged (EditorUi.print).
 * The PDF of the Export dialog has the same layout (remote is true for the
 * PDF of the export service, see createPrintPreview). Returns the preview
 * (see createPrintPreview), or null if the dialog has changed and keeps its
 * layout.
 */
EditorUi.prototype.createPrintLayout = function(div, remote)
{
	var ui = this;
	var graph = this.editor.graph;
	var skin = PreviewDialog.skins.classic;
	var c = this.getPrintControls(div);

	if (c == null)
	{
		return null;
	}

	var layout = PreviewDialog.createLayout(skin, {title: c.title, subtitle: true});
	layout.attach(div, c.scrollWrapper, c.buttons);
	div.classList.add('gePrint');

	// The radio of Fit to is centred on the first line of its fields, next to
	// the field of the sheets across, not at the top of the field (the driver,
	// 22 November 2026; see .gePrintFitRadio in grapheditor.css)
	c.fit.style.marginTop = '';
	c.fit.classList.add('gePrintFitRadio');

	// Print is centered again when Advanced opens or closes, as its height
	// changes (the driver, 22 November 2026, an exception for Print only:
	// every other dialog keeps its top, see Dialog.setFrameHeight); the
	// segments of Print still switch in place
	if (!remote)
	{
		div.classList.add('geDialogCenterAdvanced');
	}

	// The fields of the dialog in the column in their order, Paper before
	// the Advanced section
	var advanced = null;

	for (var child = c.scrollWrapper.firstChild; child != null && advanced == null; child = child.nextSibling)
	{
		if (child.classList != null && child.classList.contains('geCollapsibleTitle'))
		{
			advanced = child;
		}
	}

	while (c.scrollWrapper.firstChild != null && c.scrollWrapper.firstChild != advanced)
	{
		layout.options.appendChild(c.scrollWrapper.firstChild);
	}

	// Paper: size and orientation of the page as in Page Setup (an undoable
	// change of the page setup), disabled where the page setup cannot be
	// changed (read-only files, locked diagrams)
	var pageSetupAction = this.actions.get('pageSetup');
	var editable = graph.isEnabled() && pageSetupAction != null && pageSetupAction.isEnabled();
	var paperChanges = this.createPaperChanges(div, c.buttons, true);
	var paper = document.createElement('div');
	paper.className = 'gePrintPaper';
	var accessor = PageSetupDialog.addPageFormatPanel(paper, 'printdialog', graph.pageFormat, function(format)
	{
		if (editable && format != null && (format.width != graph.pageFormat.width ||
			format.height != graph.pageFormat.height))
		{
			paperChanges.execute(format);
		}
	});

	// Enter of the dialog (installDialogEnter) sends change to the custom
	// width or height and then clicks Print, so the size is applied on change
	// too (after the field was removed it may not blur)
	if (accessor.update != null)
	{
		mxEvent.addListener(accessor.widthInput, 'change', accessor.update);
		mxEvent.addListener(accessor.heightInput, 'change', accessor.update);
	}

	layout.section(null);
	var paperCtl = layout.row(mxResources.get('paperSize'), paper, 'geDialogFormRowTop');
	var paperSelect = paper.querySelector('select');
	var fields = paper.querySelectorAll('input, select');

	if (paperSelect != null && paperCtl.previousSibling != null)
	{
		PreviewDialog.labelControl(paperCtl.previousSibling, paperSelect);
	}

	for (var i = 0; i < fields.length; i++)
	{
		fields[i].disabled = !editable;
	}

	while (c.scrollWrapper.firstChild != null)
	{
		layout.options.appendChild(c.scrollWrapper.firstChild);
	}

	c.scrollWrapper.parentNode.removeChild(c.scrollWrapper);
	layout.setParent(null);

	var preview = this.createPrintPreview(layout.pane, c, skin, remote == true);

	var update = function()
	{
		var text = ui.getPrintSubtitle(c, preview.update());
		layout.subtitle.textContent = text;
		layout.subtitle.style.display = (text != '') ? '' : 'none';
	};

	var updateNow = this.installPrintRefresh(div, [div], update, preview, accessor, paperChanges);

	// The handlers of some fields change others without an event (Current
	// Page, the rows of the sizes, the sheets) or stop the click, so clicks
	// update after their handlers
	div.addEventListener('click', function()
	{
		window.setTimeout(updateNow, 0);
	}, true);

	return preview;
};

/**
 * The Export dialog (batch 4 of the plan Fusion ideas in Classic and Simple,
 * Editor.isExportDialogEnabled): File › Export... and the actions of the
 * formats open the dialog of the format, as before, which gets the layout of
 * the Export dialog: the row of the formats and More, the picture of the
 * export, What, Size, Look and Transparent, the other fields of the format
 * under More options, Copy and the primary button with the verb. The fields
 * of the format stay and keep their handlers, so the exports are unchanged
 * (also the overrides of the desktop app and the lock of restricted files,
 * as the actions are called). Fusion calls the same functions with its skin
 * (SimpleExport.js).
 */
PreviewDialog.exportWidth = 720;

/**
 * The height of the content of the Export dialog in the Classic skin, the
 * same for every format (the driver, 19 November 2026: like Export of Pages,
 * the dialog does not change its height when another format is chosen, so
 * the row of the formats never moves away under the pointer; a format with
 * fewer options has more empty space): the tallest format, PDF, with its
 * options closed (526 on 19 November). Below 700 px, where the picture is
 * above the fields, exportNarrowHeight (the tallest, Animation, 693). A
 * dialog whose content is taller (eg. longer translations) keeps the height
 * of its content, and the formats chosen in it keep that height (see
 * fixExportHeight). The CSS limits it to the window, the options then
 * scroll; More options scroll in the column of the options.
 */
PreviewDialog.exportHeight = 530;

/**
 * The height of the content of the Export dialog in the Classic skin below
 * 700 px (see exportHeight).
 */
PreviewDialog.exportNarrowHeight = 700;

/**
 * Gives the given frame of the Export dialog in the Classic skin its fixed
 * height: the given height of the frame (the height of the dialog of the
 * format before, see chooseExportFormat), or the height of exportHeight
 * (exportNarrowHeight below 700 px) or of its content if that is taller.
 * The class geDialogFixedHeight keeps it: the template fills the frame and
 * the sections that open (addAdvancedSection) do not change its height.
 */
PreviewDialog.fixExportHeight = function(div, height)
{
	if (height == null || isNaN(height))
	{
		var narrow = window.matchMedia != null && window.matchMedia('(max-width: 699px)').matches;
		height = Math.max(parseFloat(div.style.height) || 0, Dialog.getFrameHeight(div,
			(narrow) ? PreviewDialog.exportNarrowHeight : PreviewDialog.exportHeight));
	}

	div.style.height = height + 'px';
	div.classList.add('geDialogFixedHeight');
};

/**
 * Returns true if the actions of the formats open the Export dialog (see
 * Editor.isExportDialogEnabled).
 */
EditorUi.prototype.isExportDialogEnabled = function()
{
	return Editor.isExportDialogEnabled != null && Editor.isExportDialogEnabled() &&
		!this.editor.isChromelessView();
};

/**
 * Returns true if the menus have File › Export... instead of Export as ▸
 * (the Export dialog and the short menus are on).
 */
EditorUi.prototype.isShortExportMenu = function()
{
	return this.isExportDialogEnabled() && Editor.isShortMenusEnabled != null &&
		Editor.isShortMenusEnabled() && this.actions.get('simpleExport') != null;
};

/**
 * Returns true if the Export dialog for the format with the given ID is being
 * opened (see PrintDialog.prototype.create).
 */
EditorUi.prototype.isExportPending = function(id)
{
	return this.exportPending != null && this.exportPending.format.id == id &&
		Date.now() - this.exportPending.time < 30000;
};

/**
 * Adds File › Export... (the action simpleExport, which opens the Export
 * dialog) and makes the actions of the formats open the Export dialog with
 * their format while it is on: they mark the dialog that they show as the
 * dialog of their format (exportPending), which then gets the layout of the
 * Export dialog (createExportLayout, or createSimpleExportLayout in Fusion).
 * So the items of Export as ▸, which Classic keeps (shortMenus), open the
 * Export dialog with their format, VSDX of one page too (the trigger
 * exportAs of its item). The action keeps the name it has in Fusion, where
 * it came from, as the menus, the search and configurations (hideMenuItems)
 * use it.
 */
EditorUi.prototype.installExportDialogActions = function()
{
	var ui = this;

	if (this.editor.isChromelessView() || this.actions.get('simpleExport') != null)
	{
		return;
	}

	// Export... opens the Export dialog with the format and the settings of
	// the last export while that is on (isLastExportEnabled), else with the
	// format of the last export of this session. It is the only export entry
	// of the short menus and of Share, without Export as next to it (the
	// driver, 17 November 2026: "Export... ist eine Action, Export As ist ein
	// Menü mit Unterpunkten für das Format")
	var exportAction = this.actions.addAction('simpleExport', function()
	{
		if (ui.isLastExportEnabled())
		{
			ui.showLastExportDialog();
		}
		else
		{
			ui.showExportFormatDialog();
		}
	});

	exportAction.label = mxResources.get('export') + '...';
	exportAction.isEnabled = function()
	{
		// Export as ▸ is disabled for restricted files (see EditorUi.updateUi)
		var exportAs = ui.menus.get('exportAs');

		return ui.isExportDialogEnabled() && (exportAs == null || exportAs.isEnabled());
	};

	// Export... with the last settings before Export as ▸ in Classic, which
	// keeps the submenu (addExportEntry). Its label is Export... without the
	// format of the last export (the driver, 17 November 2026: "Einfach nur
	// Export und Punkt, Punkt, Punkt")
	var lastAction = this.actions.addAction('lastExport', function()
	{
		ui.showLastExportDialog();
	});

	// The action export (Export... of grapheditor, which opened ExportDialog,
	// the advanced export) is in no menu: it opens what Export... opens, so
	// configurations (hideMenuItems), the search and plugins that use it keep
	// working (the driver, 17 November 2026: "Ist dieser Advanced-Export-Dialog
	// überhaupt noch nötig? Sonst würde ich ihn wegschmeissen"). While the
	// Export dialog is off that is the dialog of the format of the last export
	// of this session, PNG for the first (see showExportFormatDialog), which
	// has the fields of ExportDialog. ExportDialog itself stays for the
	// desktop app, which overrides ExportDialog.exportFile.
	var advanced = this.actions.get('export');

	if (advanced != null)
	{
		advanced.funct = function()
		{
			exportAction.funct();
		};

		advanced.isEnabled = function()
		{
			var exportAs = ui.menus.get('exportAs');

			return exportAs == null || exportAs.isEnabled();
		};
	}

	lastAction.label = mxResources.get('export') + '...';
	lastAction.isEnabled = function()
	{
		return ui.isLastExportEnabled() && exportAction.isEnabled();
	};

	for (var i = 0; i < EditorUi.exportFormats.length; i++)
	{
		(function(format)
		{
			var action = ui.actions.get(format.action);

			if (action != null)
			{
				var funct = action.funct;

				action.funct = function(trigger)
				{
					// The item of Export as ▸ passes the name of the menu: VSDX of
					// one page opens the Export dialog with VSDX, which exports it,
					// as it has no dialog of its own (see showExportFormatDialog)
					if (trigger === 'exportAs' && format.id == 'vsdx' && ui.isExportDialogEnabled() &&
						(ui.pages == null || ui.pages.length <= 1) &&
						mxUtils.indexOf(ui.getExportFormats(), format) >= 0)
					{
						ui.showExportFormatDialog(format.id);

						return;
					}

					// The marker keeps the height of the previous format for HTML,
					// which opens its dialog after chooseExportFormat returned
					ui.exportPending = (ui.isExportDialogEnabled()) ?
						{format: format, time: Date.now(), height: ui.exportDialogHeight} : null;

					try
					{
						return funct.apply(this, arguments);
					}
					finally
					{
						// Only HTML may open its dialog later (it gets the public URL first)
						if (!format.async)
						{
							ui.exportPending = null;
						}
					}
				};
			}
		})(EditorUi.exportFormats[i]);
	}
};

(function()
{
	var menusInit = Menus.prototype.init;

	Menus.prototype.init = function()
	{
		menusInit.apply(this, arguments);
		this.editorUi.installExportDialogActions();
	};

	/**
	 * Returns true if Export as ▸ ends with Embed ▸ (the condition of the
	 * menu exportAs in Menus.js): in Simple, Sketch and Minimal, but not in
	 * Confluence and Jira, with extAuth=1 or offline.
	 */
	Menus.prototype.isEmbedInExportAs = function()
	{
		var ui = this.editorUi;

		return (typeof App === 'undefined' || ui.mode != App.MODE_ATLAS) && urlParams['extAuth'] != '1' &&
			(Editor.currentTheme == 'simple' || Editor.currentTheme == 'sketch' ||
			Editor.currentTheme == 'min') && !ui.isOffline();
	};

	/**
	 * Adds Export... with the last settings (the action lastExport, see
	 * isLastExportEnabled) to the given menu and returns its item, or null if
	 * it is off or Export as ▸ is hidden (hideMenuItems), which hides every
	 * export entry. It comes before Export as ▸ in the menus that keep the
	 * submenu (Classic, the desktop app), as Save before Save as. The short
	 * menus and Share have Export... alone (simpleExport), which opens the
	 * last export itself.
	 */
	Menus.prototype.addLastExportItem = function(menu, parent)
	{
		return (this.editorUi.isLastExportEnabled() && (this.hiddenMenuItems == null ||
			!this.hiddenMenuItems['exportAs'])) ? this.addMenuItem(menu, 'lastExport', parent) : null;
	};

	/**
	 * Returns true if a menu that has Export... alone instead of Export as ▸
	 * (the short menus, Share) may show it: the Export dialog is on and
	 * Export... (the action simpleExport) is not hidden (hideMenuItems). Else
	 * the menu keeps Export as ▸ with the formats, as without the Export
	 * dialog, so that hiding simpleExport never hides every export entry.
	 */
	Menus.prototype.isSimpleExportItemShown = function()
	{
		var ui = this.editorUi;

		return ui.isExportDialogEnabled() && ui.actions.get('simpleExport') != null &&
			(this.hiddenMenuItems == null || !this.hiddenMenuItems['simpleExport']);
	};

	/**
	 * Adds the export entry of a menu and returns its item: File › Export...
	 * alone with the short menus (isShortExportMenu), which opens the last
	 * export while that is on (see installExportDialogActions), followed by
	 * Embed ▸ where it was the last submenu of Export as ▸ (isEmbedInExportAs,
	 * the item is exportEmbedItem) unless noEmbed is true, or Export as ▸
	 * alone if Export... is hidden (isSimpleExportItemShown), else Export as ▸
	 * after Export... with the last settings while that is on
	 * (addLastExportItem), as Classic keeps it. Nothing is added if Export as
	 * ▸ is hidden (hideMenuItems). Fusion replaces Export as ▸ in its menus
	 * itself (SimpleExport.js).
	 */
	Menus.prototype.addExportEntry = function(menu, parent, noEmbed)
	{
		var ui = this.editorUi;
		this.exportEmbedItem = null;

		// Fusion replaces Export as ▸ in its menus itself (SimpleExport.js)
		if (typeof Editor.isSimpleModern === 'function' && Editor.isSimpleModern())
		{
			return this.addSubmenu('exportAs', menu, parent);
		}

		if (ui.isShortExportMenu())
		{
			// Hidden with Export as ▸ (hideMenuItems), also Embed ▸ in it
			if (this.hiddenMenuItems != null && this.hiddenMenuItems['exportAs'])
			{
				return null;
			}

			// Export as ▸ with the formats, and Embed ▸ in it, while Export...
			// is hidden (hideMenuItems)
			if (!this.isSimpleExportItemShown())
			{
				return this.addSubmenu('exportAs', menu, parent);
			}

			var item = this.addMenuItem(menu, 'simpleExport', parent);

			if (!noEmbed && this.isEmbedInExportAs())
			{
				this.exportEmbedItem = this.addSubmenu('embed', menu, parent);
			}

			return item;
		}

		this.addLastExportItem(menu, parent);

		return this.addSubmenu('exportAs', menu, parent);
	};

	/**
	 * The dialog of a format that its action opens gets the layout of the
	 * Export dialog in the Classic skin (Fusion lays it out in
	 * decorateSimpleDialog, see SimpleExport.js).
	 */
	var editorUiShowDialog = EditorUi.prototype.showDialog;

	EditorUi.prototype.showDialog = function(elt, w, h, modal, closable, onClose, noScroll, transparent)
	{
		var args = arguments;
		var row = null;
		var height = null;

		if (PreviewDialog.getSkin() == PreviewDialog.skins.classic)
		{
			var pending = this.exportPending;
			this.exportPending = null;

			if (pending != null && Date.now() - pending.time < 30000 && elt != null &&
				elt.nodeType == mxConstants.NODETYPE_ELEMENT && !transparent &&
				!this.editor.isChromelessView() && this.isExportFormatDialog(elt, pending.format))
			{
				try
				{
					row = this.createExportLayout(elt, pending.format);

					if (row != null)
					{
						// The width of the template; the height of the content,
						// then the fixed height (see fixExportHeight)
						args = Array.prototype.slice.call(arguments);
						args[1] = PreviewDialog.exportWidth;
						args[2] = null;
						height = (this.exportDialogHeight != null) ?
							this.exportDialogHeight : pending.height;
					}
				}
				catch (e)
				{
					// Keeps the dialog of the format
					EditorUi.debug('EditorUi.createExportLayout', [this], 'error', [e]);
				}
			}
		}

		var result = editorUiShowDialog.apply(this, args);

		// The same height for every format, so the row of the formats stays
		// where it is (see exportHeight)
		if (row != null && this.dialog != null && this.dialog.container.firstChild == elt)
		{
			PreviewDialog.fixExportHeight(this.dialog.container, height);
		}

		// The formats that fit into the row once it has its width
		if (row != null && row.fitFormats != null)
		{
			row.fitFormats(true);
		}

		return result;
	};
})();

/**
 * Opens the Export dialog with the format with the given ID, or the format of
 * the last export of this session (PNG for the first): the action of the
 * format opens its dialog, which gets the layout of the Export dialog.
 */
EditorUi.prototype.showExportFormatDialog = function(id)
{
	var formats = this.getExportFormats();
	var format = null;
	id = (id != null) ? id : this.lastExportFormat;

	for (var i = 0; i < formats.length && format == null; i++)
	{
		if (formats[i].id == id)
		{
			format = formats[i];
		}
	}

	format = (format != null) ? format : formats[0];

	if (format != null)
	{
		var action = this.actions.get(format.action);

		// VSDX of one page has no dialog, it exports at once: the Export
		// dialog shows it without options, Export VSDX exports
		if (format.id == 'vsdx' && (this.pages == null || this.pages.length <= 1))
		{
			var div = document.createElement('div');
			var hd = document.createElement('h3');
			mxUtils.write(hd, mxResources.get(format.name));
			div.appendChild(hd);

			var dlg = new CustomDialog(this, div, function()
			{
				action.funct();
			}, null, mxResources.get('export'));

			this.exportPending = {format: format, time: Date.now(), height: this.exportDialogHeight};
			this.showDialog(dlg.container, 300, null, true, true);
			this.exportPending = null;
		}
		else
		{
			action.funct();
		}
	}
};

/**
 * Export with the last settings (the feature lastExport of
 * Editor.featureDefaults, on by default; the driver, 17 November 2026):
 * Export... opens the Export dialog with the format and the settings of the
 * last export, which the browser keeps for the user, not for the file
 * (mxSettings), or with PNG and its defaults if nothing was exported yet.
 * Classic has it before Export as ▸ (the action lastExport), which keeps its
 * items and what they do; the short menus of Simple and Fusion and Share
 * have Export... alone (simpleExport), which opens the last export while
 * this is on. There are no presets and no submenu. Returns true if it is
 * on: the feature and the Export dialog (isExportDialogEnabled).
 */
EditorUi.prototype.isLastExportEnabled = function()
{
	return this.isExportDialogEnabled() && Editor.isFeatureEnabled('lastExport');
};

/**
 * The settings of the dialogs of the formats that Export... with the last
 * settings stores with the format (the fields of EditorUi that the dialogs
 * read when they open and write when they export, see
 * docs/claude/export-dialogs.md) and the type of their values: boolean,
 * integer, number (a number or its text), zoom (a number or its text with
 * %) or the list of the allowed values. null is the default of the dialog.
 */
EditorUi.lastExportSettings = {lastExportSelectionOnly: 'boolean', lastExportZoom: 'zoom',
	lastExportBorder: 'number', lastExportTransparent: 'boolean', lastExportTheme: ['light', 'dark', 'auto'],
	lastExportShadow: 'boolean', lastExportGrid: 'boolean', lastExportLinkTarget: ['auto', 'blank', 'self'],
	lastExportDpi: 'integer', lastExportType: ['selectionOnly', 'diagram', 'page'],
	lastExportPages: ['allPages'], lastEmbedInclude: ['allPages', 'currentPage'],
	lastEmbedImages: 'boolean', lastEmbedFonts: 'boolean', lastEmbedCellMetadata: 'boolean',
	lastEmbedIcons: 'boolean', lastExportPngEditable: 'boolean', lastExportSvgEditable: 'boolean',
	lastExportAnimationSource: ['page', 'flow'], lastExportAnimationFormat: ['gif', 'mp4'],
	lastExportFps: 'integer', lastExportLoops: 'integer'};

/**
 * The settings of Print that the PDF uses (see PrintDialog.prototype.create
 * in diagramly/Editor.js), stored only with the PDF, as Print shares them.
 * The pages from and to are not stored, as they belong to a file.
 */
EditorUi.lastExportPrintSettings = {lastPrintZoom: 'zoom', lastPrintBorder: 'number',
	lastPrintGrid: 'boolean', lastPrintShadow: 'boolean', lastPrintTransparent: 'boolean',
	lastPrintInclude: 'boolean', lastPrintIcons: 'boolean', lastPrintSheetsAcross: 'number',
	lastPrintSheetsDown: 'number', lastPrintCropRadioChecked: 'boolean',
	lastPrintFitRadioChecked: 'boolean', lastPrintPagesRadioChecked: 'boolean',
	lastPrintSelectionOnlyChecked: 'boolean'};

/**
 * Returns true if the format and the settings of the last export can be
 * stored in the browser (mxSettings).
 */
EditorUi.isLastExportStorable = function()
{
	return typeof mxSettings !== 'undefined' && mxSettings.settings != null && isLocalStorage;
};

/**
 * Returns the given value of a setting with the given type (see
 * EditorUi.lastExportSettings), null for null, or undefined if the value is
 * not valid.
 */
EditorUi.sanitizeLastExportValue = function(value, type)
{
	var result = undefined;

	if (value === null)
	{
		result = null;
	}
	else if (Array.isArray(type))
	{
		result = (typeof value === 'string' && mxUtils.indexOf(type, value) >= 0) ? value : undefined;
	}
	else if (type == 'boolean')
	{
		result = (typeof value === 'boolean') ? value : undefined;
	}
	else if (type == 'integer')
	{
		result = (typeof value === 'number' && isFinite(value) && Math.round(value) == value &&
			value >= 0 && value <= 10000) ? value : undefined;
	}
	else if (type == 'number' || type == 'zoom')
	{
		var text = (typeof value === 'number') ? String(value) : value;
		var pattern = (type == 'zoom') ? /^\s*\d{1,6}(\.\d{1,8})?\s*%?\s*$/ :
			/^\s*\d{1,6}(\.\d{1,8})?\s*$/;

		result = (typeof text === 'string' && pattern.test(text) &&
			isFinite(parseFloat(text))) ? value : undefined;
	}

	return result;
};

/**
 * Returns a checked copy of the given stored format and settings of the last
 * export ({format, values}, see storeLastExport), or null if the format is
 * not one of EditorUi.exportFormats. Only the settings of the tables with a
 * valid value are copied, into an object without a prototype, the settings
 * of Print only for the PDF.
 */
EditorUi.sanitizeLastExport = function(stored)
{
	var result = null;

	if (stored != null && typeof stored === 'object' && !Array.isArray(stored) &&
		typeof stored.format === 'string')
	{
		var format = null;

		for (var i = 0; i < EditorUi.exportFormats.length && format == null; i++)
		{
			if (EditorUi.exportFormats[i].id === stored.format)
			{
				format = EditorUi.exportFormats[i].id;
			}
		}

		if (format != null)
		{
			var src = (stored.values != null && typeof stored.values === 'object' &&
				!Array.isArray(stored.values)) ? stored.values : null;
			var values = Object.create(null);
			var tables = [EditorUi.lastExportSettings];

			if (format == 'pdf')
			{
				tables.push(EditorUi.lastExportPrintSettings);
			}

			for (var i = 0; i < tables.length && src != null; i++)
			{
				for (var key in tables[i])
				{
					if (Object.prototype.hasOwnProperty.call(tables[i], key) &&
						Object.prototype.hasOwnProperty.call(src, key))
					{
						var value = EditorUi.sanitizeLastExportValue(src[key], tables[i][key]);

						if (value !== undefined)
						{
							values[key] = value;
						}
					}
				}
			}

			result = {format: format, values: values};
		}
	}

	return result;
};

/**
 * Stores the format with the given ID and the current settings of the dialogs
 * of the formats in the browser as the last export, if Export... with the last
 * settings is on (isLastExportEnabled). Called by the primary button of the
 * Export dialog after the dialog of the format has stored its settings for
 * the session, for the PDF by Print once it has written them
 * (PrintDialog.prototype.create in diagramly/Editor.js).
 */
EditorUi.prototype.storeLastExport = function(id)
{
	if (this.isLastExportEnabled() && EditorUi.isLastExportStorable())
	{
		var values = {};
		var tables = [EditorUi.lastExportSettings, EditorUi.lastExportPrintSettings];

		for (var i = 0; i < tables.length; i++)
		{
			for (var key in tables[i])
			{
				if (Object.prototype.hasOwnProperty.call(tables[i], key))
				{
					values[key] = (this[key] != null) ? this[key] : null;
				}
			}
		}

		var last = EditorUi.sanitizeLastExport({format: id, values: values});

		if (last != null)
		{
			var stored = {};

			for (var key in last.values)
			{
				stored[key] = last.values[key];
			}

			mxSettings.setLastExport({format: last.format, values: stored});
		}
	}
};

/**
 * Returns the format and the settings of the last export that the browser
 * keeps, checked (see EditorUi.sanitizeLastExport), or null.
 */
EditorUi.prototype.getLastExport = function()
{
	return (EditorUi.isLastExportStorable()) ?
		EditorUi.sanitizeLastExport(mxSettings.getLastExport()) : null;
};

/**
 * Opens the Export dialog with the format and the settings of the last export
 * (Export... with the last settings, see isLastExportEnabled). The settings
 * become those of the dialogs of the formats for this session, as if that
 * export had been made in it, so the other formats of the row show them too.
 * Without a stored export the dialog opens with the format of the last export
 * of this session or PNG (see showExportFormatDialog).
 */
EditorUi.prototype.showLastExportDialog = function()
{
	var last = this.getLastExport();

	if (last != null)
	{
		for (var key in last.values)
		{
			this[key] = last.values[key];
		}
	}

	this.showExportFormatDialog((last != null) ? last.format : null);
};

/**
 * Returns true if the given content of a dialog is the dialog of the given
 * format (its headline is one of the titles of the format, the dialogs of
 * images also have the format).
 */
EditorUi.prototype.isExportFormatDialog = function(elt, format)
{
	var content = (elt.firstChild != null) ? elt.firstChild.firstChild : null;

	if (content != null && content.exportControls != null)
	{
		return content.exportControls.format == format.id;
	}

	var title = elt.querySelector('h3');

	if (title != null && format.titles != null)
	{
		var text = mxUtils.trim(title.textContent);

		for (var i = 0; i < format.titles.length; i++)
		{
			if (text == mxResources.get(format.titles[i]))
			{
				return true;
			}
		}
	}

	return false;
};

/**
 * Closes the Export dialog and opens it with the format with the given ID and
 * the choices of the current format (what, size, look, border and
 * transparent that were changed or carried, see getExportChoices; the
 * settings of the last export are stored only by an export). The focus goes
 * to the control of the given selector and back to the control that opened
 * the first dialog when it closes.
 */
EditorUi.prototype.chooseExportFormat = function(id, selector)
{
	var dlg = this.dialog;
	var returnFocus = (dlg != null) ? dlg.returnFocus : null;
	var content = (dlg != null) ? dlg.container.firstChild : null;
	var carry = (content != null) ? this.getExportChoices(content) : null;

	// The dialog of the next format has the height of this one, so the row of
	// the formats stays under the pointer (see PreviewDialog.fixExportHeight)
	var height = (dlg != null && dlg.container.classList.contains('geDialogFixedHeight')) ?
		parseFloat(dlg.container.style.height) : null;
	this.hideDialog(true);
	this.exportChoices = carry;
	this.exportDialogHeight = height;

	try
	{
		this.showExportFormatDialog(id);
	}
	finally
	{
		this.exportChoices = null;
		this.exportPresetChoice = null;
		this.exportDialogHeight = null;
	}

	if (this.dialog != null && this.dialog != dlg && returnFocus != null)
	{
		this.dialog.returnFocus = returnFocus;
	}

	var next = (selector != null) ? document.querySelector(selector) : null;

	if (next != null)
	{
		window.setTimeout(function()
		{
			if (document.body.contains(next))
			{
				next.focus();
			}
		}, 0);
	}
};

/**
 * Returns the choices of the Export dialog with the given content that the
 * dialog of another format keeps (see chooseExportFormat), or null.
 */
EditorUi.prototype.getExportChoices = function(elt, all)
{
	var controls = elt.exportFormatControls;

	if (controls == null)
	{
		return null;
	}

	var result = {selection: controls.selection.checked, zoom: controls.zoom.value,
		border: controls.border.value, theme: controls.theme.value,
		transparent: (controls.transparent != null) ? controls.transparent.checked : null};

	var defaults = elt.exportFormatDefaults;
	var carried = elt.exportCarriedChoices;

	// Only the values that were chosen (changed here or carried from the
	// format before) go to the next format, which keeps its own defaults
	// (Automatic of SVG after Light of PNG), so an export without changes
	// writes the file of the dialog of that format
	if (!all && defaults != null)
	{
		for (var key in result)
		{
			if (result[key] === defaults[key] && (carried == null || carried[key] == null))
			{
				result[key] = null;
			}
		}
	}

	return result;
};

/**
 * Sets the given controls of the dialog of a format as the controls of the
 * given dialog, stores their defaults and applies the choices of the format
 * that was shown before (see chooseExportFormat).
 */
EditorUi.prototype.initExportChoices = function(elt, controls)
{
	elt.exportFormatControls = controls;

	if (controls != null)
	{
		elt.exportFormatDefaults = this.getExportChoices(elt, true);
		elt.exportCarriedChoices = this.exportChoices;

		if (this.exportChoices != null)
		{
			this.applyExportChoices(controls, this.exportChoices);
		}
	}

	// The preset that the presets of the row of the formats chose in the
	// dialog of another format (see addExportPresetsSelect), after the
	// choices of that format
	var preset = this.exportPresetChoice;

	if (controls != null && controls.presets != null && preset != null &&
		preset.format == controls.format)
	{
		controls.presets.selectPreset(preset.name);
	}

	this.exportChoices = null;
	this.exportPresetChoice = null;
};

/**
 * Fires a change of the given field, so that its handlers and the preview
 * see the new value.
 */
PreviewDialog.fireChange = function(input)
{
	input.dispatchEvent(new Event('change', {bubbles: true}));
};

/**
 * Applies the given choices of another format to the given controls of the
 * dialog of a format (values that it does not have are skipped).
 */
EditorUi.prototype.applyExportChoices = function(controls, choices)
{
	var graph = this.editor.graph;

	if (choices.selection != null && controls.selection.checked != choices.selection &&
		(!choices.selection || !graph.isSelectionEmpty()))
	{
		controls.selection.checked = choices.selection;
		PreviewDialog.fireChange(controls.selection);
	}

	var values = {zoom: choices.zoom, border: choices.border, theme: choices.theme};

	for (var key in values)
	{
		var input = controls[key];

		if (input != null && values[key] != null && input.value != values[key])
		{
			var previous = input.value;
			input.value = values[key];

			// A list without the value (Automatic of SVG in PNG) keeps its value
			if (input.nodeName == 'SELECT' && input.value != values[key])
			{
				input.value = previous;
			}
			else
			{
				PreviewDialog.fireChange(input);
			}
		}
	}

	if (controls.transparent != null && choices.transparent != null &&
		controls.transparent.checked != choices.transparent)
	{
		controls.transparent.checked = choices.transparent;
		PreviewDialog.fireChange(controls.transparent);
	}
};

/**
 * Returns what the given controls of the dialog of a format export: page,
 * selection or all (all pages of SVG and PNG).
 */
EditorUi.getExportWhat = function(controls)
{
	return (controls.selection.checked) ? 'selection' : ((controls.pages != null &&
		controls.pages.value == 'allPages') ? 'all' : 'page');
};

/**
 * Sets what the given controls of the dialog of a format export (see
 * getExportWhat).
 */
EditorUi.setExportWhat = function(controls, value)
{
	controls.selection.checked = value == 'selection';
	PreviewDialog.fireChange(controls.selection);

	if (controls.pages != null && value != 'selection')
	{
		controls.pages.value = (value == 'all') ? 'allPages' : 'currentPage';
		PreviewDialog.fireChange(controls.pages);
	}
};

/**
 * Returns the items of What for the given controls (see getExportWhat).
 */
EditorUi.getExportWhatItems = function(controls)
{
	var items = [{value: 'page', label: mxResources.get('currentPage')},
		{value: 'selection', label: mxResources.get('selection')}];

	if (controls.pages != null)
	{
		items.push({value: 'all', label: mxResources.get('allPages')});
	}

	return items;
};

/**
 * Returns the scale of the export of the given controls (its zoom, 1 for
 * 100 %).
 */
EditorUi.getExportScale = function(controls)
{
	return Math.max(0, parseFloat(controls.zoom.value) || 100) / 100;
};

/**
 * Sets the scale of the export of the given controls (see getExportScale).
 */
EditorUi.setExportScale = function(controls, scale)
{
	controls.zoom.value = (scale * 100) + '%';
	PreviewDialog.fireChange(controls.zoom);
};

/**
 * The items of Size: 1×, 2× and 3× of the zoom of the export.
 */
EditorUi.exportScaleItems = [{value: '1', label: '1×'}, {value: '2', label: '2×'}, {value: '3', label: '3×'}];

/**
 * Returns the item of Size for the given controls, or null for another zoom.
 */
EditorUi.getExportScaleItem = function(controls)
{
	var s = EditorUi.getExportScale(controls);

	return (s == 1 || s == 2 || s == 3) ? String(s) : null;
};

/**
 * Returns the given size of the exported image in pixels as text, or an
 * empty text.
 */
EditorUi.formatExportSize = function(size)
{
	return (size != null && size.width > 0 && size.height > 0) ?
		PreviewDialog.formatNumber(size.width) + ' × ' +
		PreviewDialog.formatNumber(size.height) + ' px' : '';
};

/**
 * Returns true if the Export dialog of the given format has Copy (a PNG of
 * what is exported to the clipboard, for pictures).
 */
EditorUi.prototype.isExportCopyEnabled = function(format)
{
	var copyAction = this.actions.get('copyAsImage');

	return (format.id == 'png' || format.id == 'jpeg' || format.id == 'webp' || format.id == 'svg') &&
		this.editor.isExportToCanvas() && navigator.clipboard != null &&
		typeof window.ClipboardItem === 'function' && copyAction != null &&
		copyAction.visible !== false && copyAction.isEnabled();
};

/**
 * Closes the Export dialog and copies what Export would save with the given
 * controls of the dialog of the format: the size, the border, the look and
 * the transparent background.
 */
EditorUi.prototype.copyExportImage = function(controls)
{
	var graph = this.editor.graph;
	var cells = (controls != null && controls.selection.checked) ?
		mxUtils.sortCells(graph.model.getTopmostCells(graph.getSelectionCells())) : [];
	// The zoom can have decimals, as in the export (see Menus.js)
	var zoom = (controls != null) ? parseFloat(controls.zoom.value) : NaN;
	var border = (controls != null) ? parseInt(controls.border.value) : NaN;
	var theme = (controls != null && controls.theme != null) ? controls.theme.value : null;
	this.hideDialog(true);
	this.copyImage(cells, null, (isFinite(zoom) && zoom > 0) ? zoom / 100 : null,
		(border >= 0) ? border : null, (controls != null && controls.transparent != null) ?
		controls.transparent.checked : null, (theme == 'auto') ?
		((Editor.isDarkMode()) ? 'dark' : 'light') : theme);
};

/**
 * Sets the minimum width of the given select that is shown to the width of
 * the text of its value with its font, padding and border, at most the width
 * of its row. Some browsers size a select narrower than its text, which then
 * ends in an ellipsis; with the minimum width the row of the formats gives
 * the room to More (and wraps it rather than cutting its text). If exact is
 * true the width is set instead, which the stylesheet bounds, so the select
 * is as wide as its value rather than its longest option (the presets of the
 * row of the formats, see addExportPresetsSelect): the width of a copy of
 * the select with only that option, which includes the arrow of a select
 * of the system.
 */
PreviewDialog.fitSelectText = function(select, exact)
{
	var opt = (select.selectedIndex >= 0) ? select.options[select.selectedIndex] : null;

	if (exact)
	{
		if (opt != null && select.parentNode != null && document.body.contains(select))
		{
			var copy = select.cloneNode(false);
			copy.removeAttribute('id');
			copy.setAttribute('aria-hidden', 'true');
			copy.style.width = '';
			copy.style.maxWidth = 'none';
			copy.style.display = '';
			copy.style.position = 'absolute';
			copy.style.visibility = 'hidden';
			copy.appendChild(opt.cloneNode(true));
			select.parentNode.appendChild(copy);
			var w = copy.getBoundingClientRect().width;
			select.parentNode.removeChild(copy);

			if (w > 0)
			{
				select.style.width = Math.ceil(w) + 'px';
			}
		}

		return;
	}

	var ctx = (opt != null && document.body.contains(select)) ?
		document.createElement('canvas').getContext('2d') : null;

	if (ctx != null)
	{
		var cs = window.getComputedStyle(select);
		ctx.font = [cs.fontStyle, cs.fontWeight, cs.fontSize, cs.fontFamily].join(' ');
		var w = ctx.measureText(mxUtils.trim(opt.textContent)).width;

		if (w > 0)
		{
			w = Math.ceil(w + 1 + (parseFloat(cs.paddingLeft) || 0) +
				(parseFloat(cs.paddingRight) || 0) + (parseFloat(cs.borderLeftWidth) || 0) +
				(parseFloat(cs.borderRightWidth) || 0));

			// Keeps the minimum width of the stylesheet for short texts
			select.style.minWidth = '';

			if (w > (parseFloat(window.getComputedStyle(select).minWidth) || 0))
			{
				select.style.minWidth = 'min(100%, ' + w + 'px)';
			}
		}
	}
};

/**
 * Makes the given select call commit for a choice: a pick with the pointer
 * chooses at once, the keys that move the value of a closed list (arrows,
 * Home, End, the page keys, letters) change it at once in some browsers, so
 * the choice is then made with Enter and stepping through the list does
 * nothing; a value that was only stepped to goes back to the value that
 * getCurrent returns on blur. commit gets the event of the choice: the
 * change event of the select, or the keydown event of Enter, after which no
 * change event follows.
 */
PreviewDialog.addSelectCommit = function(select, getCurrent, commit)
{
	var moved = false;

	mxEvent.addListener(select, 'keydown', function(evt)
	{
		if (evt.key == 'Enter')
		{
			moved = false;

			if (select.value != getCurrent())
			{
				commit(evt);
				mxEvent.consume(evt);
			}
		}
		else if (!evt.altKey && !mxEvent.isControlDown(evt) && !mxEvent.isMetaDown(evt) &&
			(/^(Arrow(Up|Down|Left|Right)|Home|End|PageUp|PageDown)$/.test(evt.key) ||
			(evt.key != null && evt.key.length == 1 && evt.key != ' ')))
		{
			moved = true;
		}
		else
		{
			moved = false;
		}
	});

	mxEvent.addListener(select, 'change', function(evt)
	{
		if (moved)
		{
			moved = false;
		}
		else
		{
			commit(evt);
		}
	});

	// A value that was only stepped to is not kept
	mxEvent.addListener(select, 'blur', function()
	{
		moved = false;
		select.value = getCurrent();
	});
};

/**
 * Returns the saved presets of the formats of the Export dialog that have
 * presets (EditorUi.exportPresetFormats, see getExportPresets in
 * EditorUi.js) as a list of {format, presets} in the order of the formats,
 * only formats that can be exported here (getExportFormats) and have at
 * least one preset.
 */
EditorUi.prototype.getExportPresetGroups = function()
{
	var formats = this.getExportFormats();
	var result = [];

	for (var i = 0; i < formats.length; i++)
	{
		if (this.isExportPresetsEnabled(formats[i].id))
		{
			var presets = this.getExportPresets(formats[i].id);

			if (presets.length > 0)
			{
				result.push({format: formats[i], presets: presets});
			}
		}
	}

	return result;
};

/**
 * Adds the saved presets of the Export dialog to the given row of the formats
 * of the given format and returns its select (the class presets of the given
 * classes of the skin): Presets, then the presets of each format under the
 * name of the format (EditorUi.getExportPresetGroups). It is shown only while
 * at least one preset is saved. A preset of the shown format is applied at
 * once, as a choice in the Presets row of More options (selectPreset of the
 * row, see createExportPresetsRow in EditorUi.js), a preset of another
 * format opens that format with it (chooseExportFormat, initExportChoices).
 * The select shows the preset that the Presets row has chosen and is in the
 * row only while it is shown, after More. The row of the presets is linked
 * with setExportPresetsRow of the select, whose updatePresets reads the
 * presets again. Saving and deleting stay in the Presets row.
 */
EditorUi.prototype.addExportPresetsSelect = function(row, format, classes)
{
	var ui = this;
	var select = document.createElement('select');
	select.className = classes.presets;
	select.setAttribute('aria-label', mxResources.get('presets'));
	select.style.display = 'none';

	var presetsRow = null;
	var choices = [];
	var current = '';

	var update = function()
	{
		var groups = ui.getExportPresetGroups();
		var name = (presetsRow != null) ? presetsRow.getPresetName() : null;
		var shown = select.style.display != 'none';
		choices = [];
		current = '';

		while (select.firstChild != null)
		{
			select.removeChild(select.firstChild);
		}

		var placeholder = document.createElement('option');
		placeholder.value = '';
		mxUtils.write(placeholder, mxResources.get('presets'));
		select.appendChild(placeholder);

		for (var i = 0; i < groups.length; i++)
		{
			var group = document.createElement('optgroup');
			group.setAttribute('label', mxResources.get(groups[i].format.name));

			for (var j = 0; j < groups[i].presets.length; j++)
			{
				var option = document.createElement('option');
				option.value = 'preset' + choices.length;
				option.setAttribute('data-format', groups[i].format.id);
				mxUtils.write(option, groups[i].presets[j].name);
				group.appendChild(option);

				if (name != null && groups[i].format.id == format.id &&
					groups[i].presets[j].name == name)
				{
					current = option.value;
				}

				choices.push({format: groups[i].format.id, name: groups[i].presets[j].name});
			}

			select.appendChild(group);
		}

		// Presets while none is chosen, then not a choice (as More)
		placeholder.disabled = current != '';
		placeholder.hidden = current != '';
		select.value = current;
		select.setAttribute('title', (current != '') ? name : mxResources.get('presets'));
		select.style.display = (choices.length > 0) ? '' : 'none';

		// In the row only while it is shown (the row is as before without
		// presets), at its end after More
		if (choices.length > 0 && select.parentNode != row)
		{
			row.appendChild(select);
		}
		else if (choices.length == 0 && select.parentNode == row)
		{
			row.removeChild(select);
		}

		// The formats of the row make room for it or take its room (the
		// select is as wide as the text of its value, see fit of the row)
		if ((shown || select.style.display != 'none') && row.fitFormats != null)
		{
			row.fitFormats(true);
		}
	};

	PreviewDialog.addSelectCommit(select, function()
	{
		return current;
	}, function(evt)
	{
		var choice = (select.value.substring(0, 6) == 'preset') ?
			choices[parseInt(select.value.substring(6))] : null;

		if (choice == null || select.value == current)
		{
			select.value = current;
		}
		else if (choice.format == format.id && presetsRow != null)
		{
			// Updates the select (onPresetsChange of the row); the change
			// event of the select then updates the preview
			if (!presetsRow.selectPreset(choice.name))
			{
				update();
			}
			else if (evt != null && evt.type == 'keydown')
			{
				// Enter sets the values without a change event (an arrow
				// fired it before with the old values): the preview and
				// the options follow as for a pick with the pointer, the
				// commit for this event leaves the select as it is now
				select.dispatchEvent(new Event('change', {bubbles: true}));
			}
		}
		else
		{
			ui.exportPresetChoice = choice;
			ui.chooseExportFormat(choice.format, '.' + classes.presets);
		}
	});

	select.setExportPresetsRow = function(r)
	{
		presetsRow = r;

		if (presetsRow != null)
		{
			presetsRow.onPresetsChange = update;
		}

		update();
	};

	select.updatePresets = update;
	update();

	return select;
};

/**
 * Creates the row of the formats of the Export dialog for the given format in
 * the given skin: the formats with a rank (EditorUi.exportFormats) as a group
 * of radios that the skin makes (skin.createFormatGroup) and More, a list of
 * the formats that have no room and of those without a rank. The row shows
 * as many formats as it has room for without scrolling or cramping them or
 * the presets at its end, measured whenever its width changes (fitFormats of
 * the row): the format with the highest rank goes to More first, where the
 * formats of the row follow in the order of their ranks before the others.
 * More is shown only while it has a format, so the row has no More where all
 * formats fit. Another format opens its dialog in the same frame
 * (chooseExportFormat). More is a choice while one of its formats is chosen.
 * The classes of the parts are formatRow, formatGroup, moreFormats and moreOn
 * of the skin.
 */
EditorUi.prototype.createExportFormatRow = function(format, skin)
{
	var ui = this;
	var classes = skin.classes;
	var formats = this.getExportFormats();
	var row = document.createElement('div');
	row.className = classes.formatRow;
	var ranked = [];
	var extra = [];

	for (var i = 0; i < formats.length; i++)
	{
		((formats[i].row != null) ? ranked : extra).push(formats[i]);
	}

	var group = null;
	var entries = [];

	if (ranked.length > 0)
	{
		group = skin.createFormatGroup(ranked.map(function(f)
		{
			return {value: f.id, label: mxResources.get(f.name)};
		}), format.id, function(id)
		{
			ui.chooseExportFormat(id, '.' + classes.formatGroup + ' [data-format="' + id + '"]');
		}, mxResources.get('format'));
		group.classList.add(classes.formatGroup);

		for (var i = 0; i < ranked.length; i++)
		{
			group.buttons[i].setAttribute('data-format', ranked[i].id);

			// The name of the format, whose bold width the button reserves,
			// so the chosen format does not move the others (::after of
			// .gePreviewFormat in grapheditor.css)
			group.buttons[i].setAttribute('data-label', mxResources.get(ranked[i].name));
			entries.push({format: ranked[i], button: group.buttons[i], shown: true, option: null});
		}

		row.appendChild(group);
	}

	var select = document.createElement('select');
	select.className = classes.moreFormats;
	select.setAttribute('aria-label', mxResources.get('moreFormats'));

	var createOption = function(value, label)
	{
		var option = document.createElement('option');
		option.value = value;
		mxUtils.write(option, label);

		return option;
	};

	// More while a format of the row is chosen, not a choice while one of
	// the list is
	var placeholder = createOption('', mxResources.get('more'));
	select.appendChild(placeholder);

	for (var i = 0; i < entries.length; i++)
	{
		entries[i].option = createOption(entries[i].format.id, mxResources.get(entries[i].format.name));
		entries[i].option.setAttribute('data-format', entries[i].format.id);
	}

	for (var i = 0; i < extra.length; i++)
	{
		select.appendChild(createOption(extra[i].id, mxResources.get(extra[i].name))).
			setAttribute('data-format', extra[i].id);
	}

	row.appendChild(select);
	var current = '';

	PreviewDialog.addSelectCommit(select, function()
	{
		return current;
	}, function()
	{
		var id = select.value;

		if (id == '' || id == format.id)
		{
			select.value = current;
		}
		else
		{
			ui.chooseExportFormat(id, '.' + classes.moreFormats);
		}
	});

	// The saved presets after More, at the end of the row (the driver, 17
	// November 2026: "nach dem More ... als Quick Select ... oben rechts als
	// Dropdown"), only while there is one (see addExportPresetsSelect)
	var presets = this.addExportPresetsSelect(row, format, classes);

	var isInRow = function(id)
	{
		for (var i = 0; i < entries.length; i++)
		{
			if (entries[i].format.id == id)
			{
				return entries[i].shown;
			}
		}

		return false;
	};

	// The formats that are not in the row follow More in the order of their
	// ranks (or their place in More, VSDX first), before the other formats
	var updateMore = function()
	{
		var place = function(f)
		{
			return (f.more != null) ? f.more : f.row;
		};

		var cut = entries.filter(function(e)
		{
			return !e.shown;
		}).sort(function(a, b)
		{
			return place(a.format) - place(b.format);
		});

		for (var i = 0; i < entries.length; i++)
		{
			if (entries[i].option.parentNode != null)
			{
				entries[i].option.parentNode.removeChild(entries[i].option);
			}
		}

		var ref = placeholder.nextSibling;

		for (var i = 0; i < cut.length; i++)
		{
			select.insertBefore(cut[i].option, ref);
		}

		var inMore = !isInRow(format.id);
		placeholder.disabled = inMore;
		placeholder.hidden = inMore;
		select.value = (inMore) ? format.id : '';
		select.classList.toggle(classes.moreOn, inMore);
		current = select.value;
		select.style.display = (select.options.length > 1) ? '' : 'none';
		PreviewDialog.fitSelectText(select);
	};

	var setShown = function(entry, shown)
	{
		if (entry.shown != shown)
		{
			entry.shown = shown;
			entry.button.disabled = !shown;

			if (shown)
			{
				var next = null;

				for (var i = mxUtils.indexOf(entries, entry) + 1; i < entries.length && next == null; i++)
				{
					if (entries[i].shown && entries[i].button.parentNode == group)
					{
						next = entries[i].button;
					}
				}

				group.insertBefore(entry.button, next);
			}
			else if (entry.button.parentNode != null)
			{
				entry.button.parentNode.removeChild(entry.button);
			}
		}
	};

	// The row overflows if a part ends after its content box or is wrapped
	// below the first part
	var overflows = function()
	{
		var r = row.getBoundingClientRect();
		var cs = window.getComputedStyle(row);
		var right = r.right - (parseFloat(cs.paddingRight) || 0) - (parseFloat(cs.borderRightWidth) || 0) + 0.5;
		var parts = (group != null) ? Array.prototype.slice.call(group.children) : [];
		var first = null;

		if (select.style.display != 'none')
		{
			parts.push(select);
		}

		if (presets.style.display != 'none')
		{
			parts.push(presets);
		}

		for (var i = 0; i < parts.length; i++)
		{
			var b = parts[i].getBoundingClientRect();

			if (b.width > 0)
			{
				if (b.right > right)
				{
					return true;
				}
				else if (first == null)
				{
					first = b;
				}
				else if (Math.abs((b.top + b.bottom) / 2 - (first.top + first.bottom) / 2) > first.height / 2)
				{
					return true;
				}
			}
		}

		return false;
	};

	var lastWidth = null;

	var fit = function(force)
	{
		var width = row.clientWidth;

		if (width > 0 && (force || width != lastWidth) && document.body.contains(row))
		{
			lastWidth = width;
			var focused = (row.contains(document.activeElement)) ? document.activeElement : null;
			PreviewDialog.fitSelectText(presets, true);

			for (var i = 0; i < entries.length; i++)
			{
				setShown(entries[i], true);
			}

			updateMore();

			// The first format of the row is never cut
			var order = entries.slice().sort(function(a, b)
			{
				return b.format.row - a.format.row;
			});

			for (var i = 0; i < order.length - 1 && overflows(); i++)
			{
				setShown(order[i], false);
				updateMore();
			}

			// A focused format that went to More leaves the focus on More, a
			// focused More that went away (all formats fit) on the chosen
			// format of the row, so that the focus stays in the dialog
			if (focused != null && (!row.contains(focused) || focused.getClientRects().length == 0))
			{
				var target = (select.style.display != 'none') ? select : null;

				for (var i = 0; i < entries.length && target == null; i++)
				{
					if (entries[i].shown && entries[i].button.getAttribute('aria-checked') == 'true')
					{
						target = entries[i].button;
					}
				}

				for (var i = 0; i < entries.length && target == null; i++)
				{
					if (entries[i].shown)
					{
						target = entries[i].button;
					}
				}

				if (target != null)
				{
					target.focus();
				}
			}
		}
	};

	updateMore();
	row.fitFormats = fit;
	row.formatGroup = group;
	row.moreFormats = select;
	row.exportPresets = presets;

	// Fits the row again when its width changes (the window, the frame) and
	// once the fonts are loaded, until its dialog is closed
	if (window.ResizeObserver != null)
	{
		var thread = null;

		// Changes the row after the observation, so that its new height does
		// not loop the observer
		var observer = new ResizeObserver(function()
		{
			if (thread == null)
			{
				thread = window.requestAnimationFrame(function()
				{
					thread = null;
					fit();
				});
			}
		});

		observer.observe(row);

		var hidden = false;

		var hideListener = function(sender, evt)
		{
			var dlg = evt.getProperty('dialog');

			if (!hidden && (dlg == null || dlg.container == null || dlg.container.contains(row) ||
				!document.body.contains(row)))
			{
				hidden = true;
				observer.disconnect();

				// Removed after the event: a listener that removes itself while
				// the event is fired skips the next listener (the one that takes
				// back the paper of PDF, see createPaperChanges)
				window.setTimeout(function()
				{
					ui.editor.removeListener(hideListener);
				}, 0);

				if (thread != null)
				{
					window.cancelAnimationFrame(thread);
					thread = null;
				}
			}
		};

		ui.editor.addListener('hideDialog', hideListener);
	}

	if (document.fonts != null && document.fonts.status != 'loaded')
	{
		document.fonts.ready.then(function()
		{
			fit(true);
		});
	}

	return row;
};

/**
 * Returns the subtitle of the Export dialog for the given options of the
 * export (getExportPreviewOptions): the selection, all pages, or the file and
 * the page.
 */
EditorUi.prototype.getExportSubtitle = function(o)
{
	var file = this.getCurrentFile();

	return (o.selection) ? mxResources.get('selection') : ((o.allPages) ?
		mxResources.get('allPages') : PreviewDialog.joinList([(file != null) ? file.getTitle() : null,
		(this.currentPage != null && this.pages != null && this.pages.length > 1) ?
		this.currentPage.getName() : null]));
};

/**
 * Gives the given dialog of a format the layout of the Export dialog in the
 * Classic skin (docs/dialog-style-guide.md, Preview template): the title
 * Export, the row of the formats with the purpose of the format below it, the
 * picture of the export on the left, and on the right the options of images
 * and SVG (What, Size with the size in pixels, Look, Transparent background)
 * with the other fields of the format under More options, or the fields of the
 * other formats; Copy for pictures and the primary button with the verb
 * ("Export PNG"). PDF has the layout of Print (createPrintLayout) with the row
 * of the formats. Returns the row of the formats, or null if the dialog has
 * another structure than a CustomDialog (content, then the buttons) and keeps
 * its layout.
 */
EditorUi.prototype.createExportLayout = function(elt, format)
{
	var ui = this;
	var skin = PreviewDialog.skins.classic;
	var print = elt.classList.contains('gePrint');
	var scrollWrapper = elt.firstChild;
	var buttons = elt.lastChild;

	if (buttons == null || buttons.nodeName != 'DIV' || elt.classList.contains('geExportDialog') ||
		(!print && (scrollWrapper == null || scrollWrapper == buttons ||
		scrollWrapper.classList.contains(skin.classes.head))))
	{
		return null;
	}

	var row = this.createExportFormatRow(format, skin);
	var bar = document.createElement('div');
	bar.className = 'gePreviewFormatBar';
	bar.appendChild(row);
	skin.createHint(mxResources.get(format.hint), bar);
	elt.classList.add('geExportDialog');

	// The primary button names the format, Export... opens the format of the
	// last export (with its settings, see storeLastExport). The dialog of the
	// format has stored its settings, as its listener was added before; the
	// PDF stores them itself, as Print may write them after the click
	// (PrintDialog.prototype.create in diagramly/Editor.js)
	var primary = buttons.querySelector('.gePrimaryBtn');

	if (primary != null)
	{
		mxEvent.addListener(primary, 'click', function()
		{
			ui.lastExportFormat = format.id;

			if (!print)
			{
				ui.storeLastExport(format.id);
			}
		});

		primary.textContent = '';
		mxUtils.write(primary, mxResources.get('exportFormat', [mxResources.get(format.name)]));
	}

	// PDF has the sheets of Print (see PrintDialog.prototype.create)
	if (print)
	{
		var title = elt.querySelector('.' + skin.classes.head + '>h3');

		if (title != null)
		{
			title.textContent = '';
			mxUtils.write(title, mxResources.get('export'));
		}

		elt.insertBefore(bar, elt.querySelector('.' + skin.classes.body));

		return row;
	}

	var heading = scrollWrapper.querySelector('h3');
	var layout = PreviewDialog.createLayout(skin, {title: mxResources.get('export'), subtitle: true});
	layout.attach(elt, scrollWrapper, buttons);
	elt.insertBefore(bar, layout.body);

	if (heading != null)
	{
		heading.parentNode.removeChild(heading);
	}

	// The picture of the page or the selection
	var pane = layout.pane;
	var img = document.createElement('img');
	img.setAttribute('alt', '');
	pane.appendChild(img);
	pane.appendChild(skin.createEmpty());

	var content = scrollWrapper.firstChild;
	var controls = (content != null) ? content.exportControls : null;
	var update = null;
	this.initExportChoices(elt, controls);
	row.exportPresets.setExportPresetsRow((controls != null) ? controls.presets : null);
	scrollWrapper.classList.add('gePreviewFormatContent');

	if (controls != null)
	{
		update = this.addExportOptions(layout, scrollWrapper, controls, format);
	}
	else if (mxUtils.trim(scrollWrapper.textContent) != '' ||
		scrollWrapper.querySelector('input, select, textarea, button') != null)
	{
		layout.section(mxResources.get('options'));
		layout.options.replaceChild(scrollWrapper, layout.options.lastChild);
	}
	else
	{
		scrollWrapper.style.display = 'none';
	}

	// Copy (a PNG of what is exported) for pictures
	if (this.isExportCopyEnabled(format))
	{
		var copy = mxUtils.button(mxResources.get('copy'), function()
		{
			ui.copyExportImage(controls);
		});

		copy.className = 'geBtn';
		var first = buttons.firstChild;
		buttons.insertBefore(copy, (first != null && first.nodeName != 'BUTTON') ? first.nextSibling : first);
	}

	// The picture of what is exported in the look of the export (see
	// createExportPreview), made after the dialog is shown and only for
	// changes of what it shows
	var exportPreview = this.createExportPreview(pane, img, function()
	{
		return ui.getExportPreviewOptions(controls, format);
	}, skin);

	PreviewDialog.installRefresh(elt, function()
	{
		var result = exportPreview.update();
		var text = ui.getExportSubtitle(result.options);
		layout.subtitle.textContent = text;
		layout.subtitle.style.display = (text != '') ? '' : 'none';

		if (update != null)
		{
			update(result.size);
		}
	}, function()
	{
		exportPreview.setReady();
	});

	return row;
};

/**
 * Adds the options of images and SVG to the column of the given layout in the
 * Classic skin: What, Size (1×, 2×, 3× with the size of the image in
 * pixels), Look and Transparent background, which drive the fields of the
 * format, and puts the other fields of the format (the given scroll wrapper
 * of its dialog) under More options with its sections open. Returns the
 * function that updates the new fields for the given size of the image.
 */
EditorUi.prototype.addExportOptions = function(layout, scrollWrapper, controls, format)
{
	var graph = this.editor.graph;

	var hideRow = function(input)
	{
		var row = (input != null) ? (input.checkRow || input.closest('.geDialogFormRow, .geDialogCheckRow')) : null;

		if (row != null)
		{
			row.classList.add('gePreviewReplaced');
		}
	};

	layout.section(mxResources.get('options'));

	// What: the page, the selection, all pages
	var what = layout.choice(EditorUi.getExportWhatItems(controls), EditorUi.getExportWhat(controls), function(v)
	{
		EditorUi.setExportWhat(controls, v);
	}, mxResources.get('what'));
	what.setItemDisabled('selection', graph.isSelectionEmpty());
	layout.row(mxResources.get('what'), what);
	hideRow(controls.selection);
	hideRow(controls.pages);

	// Size: 1×, 2×, 3× with the size in pixels
	var size = layout.choice(EditorUi.exportScaleItems, EditorUi.getExportScaleItem(controls), function(v)
	{
		EditorUi.setExportScale(controls, parseInt(v));
	}, mxResources.get('size'));
	var sizeCtl = layout.row(mxResources.get('size'), size);
	var pixels = document.createElement('span');
	pixels.className = 'geDialogHint';
	sizeCtl.appendChild(pixels);

	// Look: light, dark, automatic (SVG)
	var lookItems = [];

	for (var i = 0; i < controls.theme.options.length; i++)
	{
		var opt = controls.theme.options[i];
		lookItems.push({value: opt.value, label: opt.textContent});
	}

	var look = layout.choice(lookItems, controls.theme.value, function(v)
	{
		controls.theme.value = v;
		PreviewDialog.fireChange(controls.theme);
	}, mxResources.get('look'));
	layout.row(mxResources.get('look'), look);
	hideRow(controls.theme);

	// Transparent background
	var transparent = null;

	if (controls.transparent != null)
	{
		transparent = document.createElement('input');
		transparent.checked = controls.transparent.checked;
		layout.checkRow(transparent, mxResources.get('transparentBackground'));
		hideRow(controls.transparent);

		mxEvent.addListener(transparent, 'change', function(evt)
		{
			controls.transparent.checked = transparent.checked;
			PreviewDialog.fireChange(controls.transparent);
			mxEvent.consume(evt);
		});
	}

	layout.setParent(null);

	// More options: the rest of the dialog of the format with its sections
	// open; sections whose rows are all above are hidden
	var titles = scrollWrapper.querySelectorAll('.geCollapsibleTitle');

	for (var i = 0; i < titles.length; i++)
	{
		titles[i].classList.add('geExpanded', 'gePreviewReplaced');

		if (titles[i].nextSibling != null)
		{
			titles[i].nextSibling.classList.remove('geCollapsed');
		}
	}

	var sections = scrollWrapper.querySelectorAll('.geDialogSection');

	for (var i = 0; i < sections.length; i++)
	{
		var empty = true;

		for (var j = 0; j < sections[i].children.length && empty; j++)
		{
			var child = sections[i].children[j];
			empty = child.classList.contains('gePreviewReplaced') || child.style.display == 'none';
		}

		if (empty)
		{
			sections[i].classList.add('gePreviewReplaced');
		}
	}

	var more = this.addAdvancedSection(layout.options, 'moreOptions');
	more.wrapper.replaceChild(scrollWrapper, more.content);

	return function(s)
	{
		what.setValue(EditorUi.getExportWhat(controls));
		size.setValue(EditorUi.getExportScaleItem(controls));
		look.setValue(controls.theme.value);

		if (transparent != null)
		{
			transparent.checked = controls.transparent.checked;
		}

		pixels.textContent = EditorUi.formatExportSize(s);
	};
};
