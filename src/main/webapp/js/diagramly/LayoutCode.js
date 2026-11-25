/**
 * Copyright (c) 2026, JGraph Holdings Ltd
 * Copyright (c) 2026, draw.io AG
 */
/**
 * LayoutCode.js: the Code template of Fusion (concept 13.1 and 13.2) for the
 * custom layout (Arrange › Layout › Custom..., Edit Layout of other layouts
 * and the Add list, showCustomLayoutDialog) and for Edit Outline and Edit
 * Text of the boxes of From Text (showOutlineDialog): the headline and what
 * the dialog acts on, the code with line numbers below it its errors, a side
 * with the layouts to add or with the live preview of the box and how
 * outlines are written, the secondary actions on the left of the footer.
 * The text area, the Add list and the buttons of the dialogs move into the
 * layout with their listeners (or stay hidden and are driven), so the
 * dialogs do what they did before.
 *
 * The Classic skin is for Simple behind the rows layoutDialogs and
 * outlineDialog of Editor.featureDefaults (on in Simple, off in Classic,
 * Sketch, Minimal and Atlas; .geLayoutCode in grapheditor.css); the theme
 * Fusion adds its skin in SimpleLayouts.js (fusion.css). The live previews
 * of code (the budget, the graph of its own, the scheduler and the pane, and
 * the previews of what From Text, Mermaid, PlantUML, SQL and CSV insert and
 * of the page of Edit Diagram), the fields with line numbers and Tab to
 * indent are here, so the code dialogs of Fusion (SimpleCode.js) and of the
 * other themes (CodeDialogs.js) share them.
 */
var LayoutCode = {};

/**
 * Width and height of the content of the dialogs in the Classic skin (the
 * frame adds 48; Fusion has EditorUi.simpleCodeSize).
 */
LayoutCode.size = new mxRectangle(0, 0, 672, 452);

/**
 * The skins of the layout: the classes of its parts and the functions that
 * make the parts that differ. Fusion adds LayoutCode.skins.fusion in
 * SimpleLayouts.js.
 */
LayoutCode.skins = {};

/**
 * The Classic skin (.geLayoutCode in grapheditor.css): the headline as h3
 * and the subtitle as the hint of the dialog, the layouts to add as plain
 * buttons, the type of a new outline as a select, the footer of the dialog.
 */
LayoutCode.skins.classic = {
	classes: {layout: 'geLayoutCode', head: 'geLayoutCodeHead', body: 'geLayoutCodeBody',
		code: 'geLayoutCodeColumn', status: 'geLayoutCodeStatus', side: 'geLayoutCodeSide',
		list: 'geLayoutCodeList', choice: 'geLayoutCodeChoice', on: 'geLayoutCodeOn',
		replaced: 'geLayoutCodeReplaced', hint: 'geLayoutCodeHint', preview: 'geLayoutCodePreview',
		numbered: {field: 'geLayoutCodeField', gutter: 'geLayoutCodeGutter'},
		pane: {side: 'geLayoutCodePreviewSide', pane: 'geLayoutCodePane',
			caption: 'geLayoutCodeCaption', paused: 'geLayoutCodePaused'}},
	// The type of a new outline stays a select (Fusion: a group of choices)
	typeChoices: false,
	// The size is set in showDialog (LayoutCode.size)
	setSize: function(elt)
	{
		// ignore
	},
	createSubtitle: function(text)
	{
		text = (text != null) ? mxUtils.trim(String(text)) : '';
		var sub = null;

		if (text.length > 0)
		{
			sub = document.createElement('div');
			sub.className = 'geDialogHint geLayoutCodeSubtitle';
			mxUtils.write(sub, text);
		}

		return sub;
	},
	createSectionHead: function(text)
	{
		var head = document.createElement('div');
		head.className = 'geLayoutCodeSectionHead';
		mxUtils.write(head, text);

		return head;
	},
	getSubtitle: function(ui, cell)
	{
		return LayoutCode.getSubtitle(ui, cell);
	},
	decorateCopy: function(btn)
	{
		btn.className = 'geBtn geLayoutCodeCopy';
		btn.style.cssText = '';
	},
	// The footer of the dialog below the body (kind is custom or outline)
	decorateFooter: function(buttons, kind)
	{
		buttons.style.cssText = '';
		buttons.classList.add('geLayoutCodeFooter');
	}};

/**
 * Returns the skin of the layout in the current theme: Fusion's in the theme
 * Fusion, else the Classic skin.
 */
LayoutCode.getSkin = function()
{
	return (typeof Editor.isSimpleModern === 'function' && Editor.isSimpleModern() &&
		LayoutCode.skins.fusion != null) ? LayoutCode.skins.fusion :
		LayoutCode.skins.classic;
};

/**
 * Returns true if the given kind of dialog (custom or outline) gets the
 * layout in the Classic skin: the rows layoutDialogs (the custom layout) and
 * outlineDialog (Edit Outline and Edit Text) of Editor.featureDefaults (the
 * configuration and the URL), on in Simple (the driver, 18 November 2026:
 * all dialogs of Fusion in Simple); Edit Outline and Edit Text also in
 * Classic, Sketch, Minimal and Atlas in the web app (since 22 November 2026),
 * the custom layout not. The theme Fusion always has them (its skin).
 */
LayoutCode.isEnabled = function(kind)
{
	return Editor.isFeatureEnabled((kind == 'outline') ? 'outlineDialog' : 'layoutDialogs');
};

/**
 * Returns the subtitle of the dialogs in the Classic skin: the layout
 * container it edits, else the selection, else the page of a file with more
 * than one page or the file (LayoutForms.getSubtitle, which the options of
 * the layouts show, as getSimpleLayoutSubtitle of Fusion).
 */
LayoutCode.getSubtitle = function(ui, cell)
{
	return LayoutForms.getSubtitle(ui, cell, false);
};

/**
 * Wraps the given text area of code in a field with line numbers with the
 * given classes (field and gutter). Returns the field; its update function
 * updates the numbers.
 */
LayoutCode.createNumberedField = function(textarea, classes)
{
	var field = document.createElement('div');
	field.className = classes.field;
	var gutter = document.createElement('div');
	gutter.className = classes.gutter;
	gutter.setAttribute('aria-hidden', 'true');
	field.appendChild(gutter);

	if (textarea.parentNode != null)
	{
		textarea.parentNode.replaceChild(field, textarea);
	}

	field.appendChild(textarea);
	textarea.style.cssText = '';
	textarea.setAttribute('wrap', 'off');
	textarea.setAttribute('spellcheck', 'false');

	var count = 0;

	field.update = function()
	{
		var lines = textarea.value.split('\n').length;

		if (lines != count)
		{
			var numbers = [];

			for (var i = 1; i <= lines; i++)
			{
				numbers.push(i);
			}

			gutter.textContent = numbers.join('\n');
			count = lines;
		}

		gutter.scrollTop = textarea.scrollTop;
	};

	mxEvent.addListener(textarea, 'input', field.update);
	mxEvent.addListener(textarea, 'scroll', function()
	{
		gutter.scrollTop = textarea.scrollTop;
	});

	field.update();

	return field;
};

/**
 * The live previews of code (moved from SimpleCode.js of Fusion with their
 * names, so the code dialogs of Fusion and the tests keep them; the previews
 * of the parse dialogs, of CSV and of Edit Diagram since 23 November 2026,
 * for the code dialogs of the other themes in CodeDialogs.js).
 */
(function()
{
	/**
	 * Delay of the live preview after typing (ms).
	 */
	EditorUi.simpleCodePreviewDelay = 300;

	/**
	 * The budget of all live previews of the code dialogs: the most characters
	 * and lines of the code before it is parsed and the most cells after
	 * (before the image is made). Above it the preview is paused ("Preview
	 * paused, click to refresh"), and a click on it refreshes it once. 300
	 * cells of Edit Diagram take about 0.25 s, 600 lines of a list in From
	 * Text 0.5 s. The refreshes after typing are also paused while the last
	 * refresh took longer than simpleCodePreviewDelay (see
	 * createSimplePreviewScheduler).
	 */
	EditorUi.simplePreviewBudget = {length: 50000, lines: 400, cells: 400};

	/**
	 * Most lines of From Text in the budget of the live preview for the types
	 * that are laid out (the layout runs on each preview, Insert runs it once;
	 * 100 lines of the organic layout take about 0.4 s, 200 lines 1.2 s).
	 */
	EditorUi.simpleLayoutPreviewMax = 100;

	/**
	 * Time after which a live preview that has not finished is dropped (ms).
	 */
	EditorUi.simplePreviewTimeout = 30000;

	/**
	 * Most time that a live preview waits for the web fonts of its labels
	 * the first time (ms, see createSimplePreviewSource): after it, the
	 * preview shows the fonts that have arrived, and the previews do not wait
	 * for the others again while they are still loading (a font host that
	 * hangs): they have the fallback font until the font is in the cache.
	 */
	EditorUi.simplePreviewFontTimeout = 3000;

	/**
	 * Indents (or outdents if outdent is true) the lines of the selection of
	 * the given text area by the given unit as one change that the undo of
	 * the text area takes back. Outdent removes up to one unit of spaces or
	 * a tab at the start of each line.
	 */
	EditorUi.indentSimpleLines = function(text, unit, outdent)
	{
		var value = text.value;
		var start = text.selectionStart;
		var end = text.selectionEnd;
		// lastIndexOf takes -1 as 0, which is past the caret before a first
		// empty line
		var first = (start > 0) ? value.lastIndexOf('\n', start - 1) + 1 : 0;

		// A selection that ends at the start of a line leaves that line
		var last = (end > start && value.charAt(end - 1) == '\n') ? end - 1 : end;
		var stop = value.indexOf('\n', last);
		stop = (stop < 0) ? value.length : stop;
		var lines = value.substring(first, stop).split('\n');
		var deltas = [];

		for (var i = 0; i < lines.length; i++)
		{
			var line = lines[i];
			var cut = 0;

			if (!outdent)
			{
				lines[i] = unit + line;
			}
			else if (line.charAt(0) == '\t')
			{
				cut = 1;
			}
			else
			{
				while (cut < unit.length && line.charAt(cut) == ' ')
				{
					cut++;
				}
			}

			lines[i] = lines[i].substring(cut);
			deltas.push((outdent) ? -cut : unit.length);
		}

		var block = lines.join('\n');
		var total = block.length - (stop - first);

		if (total != 0)
		{
			// insertText keeps the undo of the text area and fires input
			text.focus();
			text.setSelectionRange(first, stop);

			if (!document.execCommand('insertText', false, block) || text.value.substring(first,
				first + block.length) != block)
			{
				text.setRangeText(block, first, stop, 'end');
				text.dispatchEvent(new Event('input', {bubbles: true}));
			}

			// The caret moves with the text of its line, not before the line, and
			// a selection from the start of a line keeps the whole lines
			var newStart = (end > start && start == first) ? first : Math.max(first, start + deltas[0]);
			text.setSelectionRange(newStart, Math.max(newStart, (end > start) ? end + total : newStart));
		}
	};

	/**
	 * Tab and Shift+Tab indent and outdent the lines of the selection in the
	 * given text area by the given unit (two spaces by default). Escape
	 * releases Tab until the text area gets the focus or changes again, so
	 * the next Tab moves the focus; a second Escape is left to the dialog.
	 * Keys of the composition of an input method are left to it.
	 */
	EditorUi.addSimpleIndent = function(text, unit)
	{
		unit = (unit != null) ? unit : '  ';
		var released = false;

		var capture = function()
		{
			released = false;
		};

		mxEvent.addListener(text, 'focus', capture);
		mxEvent.addListener(text, 'input', capture);

		mxEvent.addListener(text, 'keydown', function(evt)
		{
			if (released || evt.defaultPrevented || EditorUi.isComposingKeyEvent(evt) ||
				mxEvent.isControlDown(evt) || mxEvent.isAltDown(evt) || mxEvent.isMetaDown(evt))
			{
				return;
			}

			if (evt.key == 'Escape')
			{
				released = true;
				mxEvent.consume(evt);
			}
			else if (evt.key == 'Tab')
			{
				EditorUi.indentSimpleLines(text, unit, mxEvent.isShiftDown(evt));
				mxEvent.consume(evt);
			}
		});
	};

	/**
	 * Returns the side of a code dialog with a live preview with the given
	 * classes (side, pane, caption and paused): the pane with the image and
	 * the caption below it. The side has setImage(src, hint, data),
	 * show(src, error, code, data) and pause() (the pane is then a button
	 * that refreshes the preview, see createSimplePreviewScheduler),
	 * setEnlarge(fn) (with the class zoom, a preview with data is then a
	 * button that shows it large), and showExample(src, hint)
	 * and hideExample() (an image in place of the preview while an example
	 * is pointed at, with the class example of the pane).
	 *
	 * With the classes error (the box of the message), errorBody (the column
	 * of its text and action), errorText (the text), errorLine (the line
	 * before it) and stale (the pane of an image that is kept), an error keeps the last image without an error, dimmed, and the
	 * pane shows the message with its line and an action of the dialog:
	 * describeError(error, code) of the side returns {message, line, action}
	 * for the code that was parsed (see show) and markError(info, box) is
	 * called with them and the box, or with nulls when the error is gone (see
	 * installCodeErrors in CodeExamples.js). An example shown over an error
	 * hides the box, but the code keeps its error (markError with the box).
	 * createErrorIcon of the classes returns the icon of the box. Without
	 * these classes an error empties the pane and the caption says Invalid
	 * input.
	 */
	EditorUi.prototype.createCodePreview = function(classes)
	{
		var ui = this;
		var side = document.createElement('div');
		side.className = classes.side;
		var pane = document.createElement('div');
		pane.className = classes.pane;
		pane.setAttribute('aria-hidden', 'true');
		var img = document.createElement('img');
		img.setAttribute('alt', '');
		pane.appendChild(img);
		side.appendChild(pane);
		var caption = document.createElement('div');
		caption.className = classes.caption;
		caption.setAttribute('role', 'status');
		mxUtils.write(caption, mxResources.get('preview'));
		side.appendChild(caption);

		// What the preview shows (image, error or paused), the last image
		// without an error, an example in its place and the box of an error
		var state = {kind: 'image', src: null, hint: null, error: null, code: null};
		var good = null;
		var example = null;
		var box = null;
		var errors = classes.error != null;

		// The function that shows the preview large (see side.setEnlarge)
		var enlarge = null;

		// The pane is a button while the preview is paused (refresh) and while
		// it shows a preview that can be enlarged (zoom)
		var setButton = function(kind)
		{
			side.paused = kind == 'paused';
			side.zoomable = kind == 'zoom';
			pane.classList.toggle(classes.paused, side.paused);

			if (classes.zoom != null)
			{
				pane.classList.toggle(classes.zoom, side.zoomable);
			}

			if (kind == 'zoom')
			{
				pane.setAttribute('title', mxResources.get('previewEnlarge'));
			}
			else
			{
				pane.removeAttribute('title');
			}

			if (kind != null)
			{
				pane.removeAttribute('aria-hidden');
				pane.setAttribute('role', 'button');
				pane.setAttribute('tabindex', '0');
				pane.setAttribute('aria-label', mxResources.get((kind == 'zoom') ?
					'previewEnlarge' : 'previewPaused'));
			}
			else
			{
				if (document.activeElement == pane)
				{
					// Keep the focus in the dialog instead of dropping it to the body
					var field = (side.parentNode != null) ? side.parentNode.querySelector('textarea, input') : null;

					if (field != null)
					{
						field.focus();
					}
					else
					{
						pane.blur();
					}
				}

				pane.setAttribute('aria-hidden', 'true');
				pane.removeAttribute('role');
				pane.removeAttribute('tabindex');
				pane.removeAttribute('aria-label');
			}
		};

		var setSource = function(src)
		{
			if (src != null)
			{
				img.setAttribute('src', src);
				img.style.display = '';
			}
			else
			{
				img.removeAttribute('src');
				img.style.display = 'none';
			}
		};

		// The box of an error: the icon, the line and the message (text), and
		// the action of the dialog
		var createBox = function(info)
		{
			var elt = document.createElement('div');
			elt.className = classes.error;
			elt.id = 'geCodeError-' + Editor.guid();

			if (classes.createErrorIcon != null)
			{
				elt.appendChild(classes.createErrorIcon());
			}

			var body = document.createElement('div');
			body.className = classes.errorBody;
			elt.appendChild(body);
			var msg = document.createElement('div');
			msg.className = classes.errorText;

			if (info.line != null)
			{
				var line = document.createElement('b');
				line.className = classes.errorLine;
				mxUtils.write(line, mxResources.get('errorLine', [info.line]));
				msg.appendChild(line);
				mxUtils.write(msg, ' ');
			}

			mxUtils.write(msg, info.message);
			body.appendChild(msg);

			if (info.action != null)
			{
				body.appendChild(info.action);
			}

			return elt;
		};

		// Shows the example, the preview, its error or the pause
		var paint = function()
		{
			var info = null;

			if (box != null)
			{
				box.parentNode.removeChild(box);
				box = null;
			}

			if (errors)
			{
				pane.classList.remove(classes.stale);
			}

			if (classes.example != null)
			{
				pane.classList.toggle(classes.example, example != null);
			}

			if (example != null)
			{
				setSource(example.src);
				caption.textContent = example.hint;
				setButton(null);

				// The code is unchanged and keeps its error: the box stays for
				// aria-describedby, hidden under the example (see the Tab of the
				// chips in addCodeExamples, which hides the example first)
				if (state.kind == 'error')
				{
					info = describe();
					box = createBox(info);
					box.style.display = 'none';
					pane.appendChild(box);
				}
			}
			else if (state.kind == 'paused')
			{
				setSource(null);
				caption.textContent = mxResources.get('previewPaused');
				setButton('paused');
			}
			else if (state.kind == 'error')
			{
				info = describe();
				setSource(good);
				pane.classList.toggle(classes.stale, good != null);
				caption.textContent = mxResources.get((good != null) ? 'lastValidPreview' : 'invalidInput');
				setButton(null);

				// The message is read, the image stays hidden (no alternative)
				box = createBox(info);
				pane.appendChild(box);
				pane.removeAttribute('aria-hidden');
			}
			else
			{
				setSource(state.src);
				caption.textContent = (state.hint != null) ? state.hint : mxResources.get('preview');
				setButton((enlarge != null && state.src != null && state.hint == null &&
					state.data != null) ? 'zoom' : null);
			}

			if (errors && side.markError != null)
			{
				side.markError(info, box);
			}
		};

		// The message, line and action of the error for the code it is about
		var describe = function()
		{
			return (side.describeError != null) ? side.describeError(state.error, state.code) :
				{message: mxResources.get('invalidInput'), line: null};
		};

		side.setImage = function(src, hint, data)
		{
			state = {kind: 'image', src: src, hint: hint, error: null, code: null, data: data};

			if (src != null && hint == null)
			{
				good = src;
			}

			paint();
		};

		/**
		 * Shows the given image or error of a preview of the given code (the
		 * code that was parsed, null for the code of the field): above the
		 * budget (simplePreviewPaused of the error) the preview is paused,
		 * other errors are Invalid input or, with the classes of errors, the
		 * last image dimmed with the message (see above). data is what the
		 * function of setEnlarge gets for the image (eg. the XML of its
		 * cells), with none it cannot be enlarged.
		 */
		side.show = function(src, error, code, data)
		{
			side.cost = Math.max(side.cost || 0, ui.simplePreviewCost || 0);

			if (error != null && error.simplePreviewPaused)
			{
				side.pause();
			}
			else if (error != null && errors)
			{
				state = {kind: 'error', src: null, hint: null, error: error,
					code: (code != null) ? code : null};
				paint();
			}
			else
			{
				side.setImage(src, (error != null) ? mxResources.get('invalidInput') : null,
					(error == null) ? data : null);
			}
		};

		/**
		 * Makes a preview with data (see show) a button that calls the given
		 * function with the data and the event (click, Enter or Space) to show
		 * it large, with the zoom class of the classes, the title and the
		 * label previewEnlarge. Null for none.
		 */
		side.setEnlarge = function(fn)
		{
			enlarge = fn;
			paint();
		};

		/**
		 * Pauses the preview: no image, the caption says that a click
		 * refreshes it (refresh of the scheduler).
		 */
		side.pause = function()
		{
			state = {kind: 'paused', src: null, hint: null, error: null, code: null};
			paint();
		};

		/**
		 * Shows the given image of an example with the given caption in place
		 * of the preview until hideExample.
		 */
		side.showExample = function(src, hint)
		{
			example = {src: src, hint: hint};
			paint();
		};

		side.hideExample = function()
		{
			if (example != null)
			{
				example = null;
				paint();
			}
		};

		/**
		 * Returns what the preview shows: image, error or paused.
		 */
		side.getState = function()
		{
			return (example != null) ? 'example' : state.kind;
		};

		var refresh = function(evt)
		{
			if (side.paused && side.refresh != null)
			{
				side.refresh();
				mxEvent.consume(evt);
			}
			else if (side.zoomable && enlarge != null)
			{
				enlarge(state.data, evt);
				mxEvent.consume(evt);
			}
		};

		mxEvent.addListener(pane, 'click', refresh);
		mxEvent.addListener(pane, 'keydown', function(evt)
		{
			if (evt.key == 'Enter' || evt.key == ' ')
			{
				refresh(evt);
			}
		});

		side.pane = pane;
		side.caption = caption;

		return side;
	};

	/**
	 * Returns an error that pauses a live preview (see createCodePreview).
	 */
	EditorUi.createSimplePreviewPausedError = function()
	{
		var e = new Error(mxResources.get('previewPaused'));
		e.simplePreviewPaused = true;

		return e;
	};

	/**
	 * Returns true if the given code is above the budget of the live previews
	 * (EditorUi.simplePreviewBudget): longer, or more lines than the budget or
	 * the given most lines (eg. simpleLayoutPreviewMax). The lines are counted
	 * up to the limit.
	 */
	EditorUi.prototype.isSimplePreviewOverBudget = function(text, maxLines)
	{
		var budget = EditorUi.simplePreviewBudget;
		maxLines = (maxLines != null) ? Math.min(maxLines, budget.lines) : budget.lines;

		if (text.length > budget.length)
		{
			return true;
		}

		var lines = 1;

		for (var i = text.indexOf('\n'); i >= 0 && lines <= maxLines; i = text.indexOf('\n', i + 1))
		{
			lines++;
		}

		return lines > maxLines;
	};

	/**
	 * Returns true if the given number of cells (or of cells in the given XML,
	 * counted up to the limit) is above the budget of the live previews.
	 */
	EditorUi.prototype.isSimplePreviewCellsOverBudget = function(cells)
	{
		var max = EditorUi.simplePreviewBudget.cells;

		if (typeof cells === 'string')
		{
			var xml = cells;
			cells = 0;

			for (var i = xml.indexOf('<mxCell'); i >= 0 && cells <= max; i = xml.indexOf('<mxCell', i + 1))
			{
				cells++;
			}
		}

		return cells > max;
	};

	/**
	 * Returns an SVG data URI of the given graph, or null if it has no cells.
	 * Labels are sanitized by the graph and the SVG is shown in an image, so
	 * code that the user types cannot run. Throws the error that pauses the
	 * preview if the graph has more cells than the budget, unless the preview
	 * is forced (a click on the paused preview, simplePreviewForced of the
	 * graph).
	 */
	EditorUi.prototype.getSimplePreviewSource = function(g)
	{
		var preview = this.getSimplePreviewSvg(g);

		return (preview != null) ? this.getSimplePreviewDataUri(preview,
			this.getSimplePreviewFontCss(preview.fonts)) : null;
	};

	/**
	 * Returns the SVG of the preview of the given graph and the web fonts of
	 * its labels (custom fonts and fontSource of the styles, as an export
	 * collects them, see getSvgWithFontLookup) as {svg, fonts}, or null if it
	 * has no cells. Throws the error that pauses the preview as
	 * getSimplePreviewSource.
	 */
	EditorUi.prototype.getSimplePreviewSvg = function(g)
	{
		if (!g.simplePreviewForced)
		{
			var count = 0;
			var max = EditorUi.simplePreviewBudget.cells;

			for (var id in g.model.cells)
			{
				if (++count > max + 2)
				{
					throw EditorUi.createSimplePreviewPausedError();
				}
			}
		}

		var bounds = g.getGraphBounds();

		if (g.model.getChildCount(g.getDefaultParent()) == 0 &&
			(bounds.width == 0 || bounds.height == 0))
		{
			return null;
		}

		var lookup = Object.create(null);
		var imgExport = g.createSvgImageExport();
		var svg = this.getSvgWithFontLookup(lookup, imgExport, function()
		{
			return g.getSvg(null, 1, 8, false, null, true, null, imgExport, null, false, null,
				(Editor.isDarkMode()) ? 'dark' : 'light');
		});

		return {svg: svg, fonts: g.getCustomFonts(lookup)};
	};

	/**
	 * Returns the data URI of the given preview (getSimplePreviewSvg) with the
	 * given CSS of its fonts.
	 */
	EditorUi.prototype.getSimplePreviewDataUri = function(preview, css)
	{
		if (css != null && css.length > 0)
		{
			css = EditorUi.filterSimplePreviewFontCss(css,
				mxUtils.getTextContent(preview.svg));

			if (css.length > 0)
			{
				this.editor.addFontCss(preview.svg, css);
			}
		}

		return Editor.createSvgDataUri(mxUtils.getXml(preview.svg));
	};

	/**
	 * Returns the given CSS of fonts without the @font-face rules whose
	 * unicode-range has no character of the given text: Google Fonts splits
	 * a font into subsets (latin, latin-ext, cyrillic, ...) and a preview
	 * needs only those of its labels (a quarter of the size for Latin text).
	 * Returns the CSS as it is if it cannot read it.
	 */
	EditorUi.filterSimplePreviewFontCss = function(css, text)
	{
		try
		{
			var codes = {};

			for (var i = 0; i < text.length; i++)
			{
				codes[text.codePointAt(i)] = true;
			}

			var keys = Object.keys(codes).map(Number);

			return css.replace(/@font-face\s*\{[^}]*\}/g, function(rule)
			{
				var range = /unicode-range\s*:\s*([^;}]+)/i.exec(rule);

				if (range == null)
				{
					return rule;
				}

				var parts = range[1].split(',');

				for (var j = 0; j < parts.length; j++)
				{
					var m = /^\s*U\+([0-9a-f?]+)(?:-([0-9a-f]+))?\s*$/i.exec(parts[j]);

					if (m == null)
					{
						return rule;
					}

					// U+4?? is the range of the wildcards
					var from = parseInt(m[1].replace(/\?/g, '0'), 16);
					var to = (m[2] != null) ? parseInt(m[2], 16) :
						parseInt(m[1].replace(/\?/g, 'f'), 16);

					for (var k = 0; k < keys.length; k++)
					{
						if (keys[k] >= from && keys[k] <= to)
						{
							return rule;
						}
					}
				}

				return '';
			});
		}
		catch (e)
		{
			return css;
		}
	};

	/**
	 * Calls fn with the data URI of the given preview (getSimplePreviewSvg,
	 * null for none) once the web fonts of its labels are in it as data URIs:
	 * the preview is an SVG in an image, which loads no fonts, so its labels
	 * would fall back to the serif font of the browser where the inserted
	 * cells have the web font (eg. Recursive of Mermaid). At once if the
	 * fonts are in the cache, else after they have loaded, at most
	 * simplePreviewFontTimeout.
	 */
	EditorUi.prototype.createSimplePreviewSource = function(preview, fn)
	{
		var ui = this;

		if (preview == null)
		{
			fn(null);
		}
		else
		{
			this.getSimplePreviewFontCss(preview.fonts, function(css)
			{
				fn(ui.getSimplePreviewDataUri(preview, css));
			});
		}
	};

	/**
	 * Returns the CSS of the given web fonts (Graph.getCustomFonts) with the
	 * fonts as data URIs from the cache of the previews and loads those that
	 * are not in it. With fn, calls fn with the CSS of all of them once they
	 * have loaded (at once if they are in the cache), at most after
	 * simplePreviewFontTimeout, and returns nothing. The fonts that have not
	 * arrived by then are late (setSimplePreviewFontLate): no preview waits
	 * for them again.
	 */
	EditorUi.prototype.getSimplePreviewFontCss = function(fonts, fn)
	{
		var ui = this;
		var css = [];
		var waiting = 0;
		var done = false;
		var timer = null;

		var finish = function()
		{
			if (!done)
			{
				done = true;
				window.clearTimeout(timer);
				fn(css.join(''));
			}
		};

		for (var i = 0; i < fonts.length; i++)
		{
			(function(index)
			{
				var cached = ui.loadSimplePreviewFont(fonts[index], (fn != null) ? function(value)
				{
					css[index] = value;
					waiting--;

					if (waiting == 0)
					{
						finish();
					}
				} : null);

				if (cached != null)
				{
					css[index] = cached;
				}
				else
				{
					waiting++;
				}
			})(i);
		}

		if (fn == null)
		{
			return css.join('');
		}
		else if (waiting == 0)
		{
			finish();
		}
		else
		{
			timer = window.setTimeout(function()
			{
				for (var i = 0; i < fonts.length; i++)
				{
					if (css[i] == null)
					{
						ui.setSimplePreviewFontLate(fonts[i]);
					}
				}

				finish();
			}, EditorUi.simplePreviewFontTimeout);
		}
	};

	/**
	 * Marks the given web font ({name, url}) as late if it is still loading
	 * (see loadSimplePreviewFont): a preview has waited for it for
	 * simplePreviewFontTimeout, so the next previews do not wait for it (each
	 * change would wait that long while the font host hangs), and they have
	 * it from the cache once it has arrived.
	 */
	EditorUi.prototype.setSimplePreviewFontLate = function(font)
	{
		var entry = (this.simplePreviewFonts != null) ?
			this.simplePreviewFonts[font.name + '\n' + font.url] : null;

		if (entry != null && typeof entry !== 'string')
		{
			entry.late = true;
		}
	};

	/**
	 * Returns true if a live preview may load the given font URL while the
	 * code is typed: Google Fonts (CORS, eg. Recursive of Mermaid) and the
	 * fonts of the app (relative URLs) or data URIs, not other hosts, which
	 * would see the code before it is inserted, nor hosts without CORS,
	 * which would go through the proxy (the preview has the fallback font).
	 * The scheme is read as the URL parser does (Graph.getUrlScheme), so a
	 * tab or line break in it does not make the URL of a host a relative one,
	 * and a relative URL with a query (eg. proxy?url=...) is no font of the
	 * app.
	 */
	EditorUi.isSimplePreviewFontUrl = function(url)
	{
		if (!Graph.isValidFontUrl(url))
		{
			return false;
		}

		var scheme = Graph.getUrlScheme(url);

		return Graph.isGoogleFontUrl(url) || ((scheme != null) ? scheme != 'http' &&
			scheme != 'https' : url.indexOf('?') < 0);
	};

	/**
	 * Returns true if a live preview may load the given web font ({name,
	 * url}) while the code is typed: its URL is one of isSimplePreviewFontUrl
	 * and neither its name nor its URL has url( in it. Editor.embedCssFonts
	 * fetches what follows every url( of the CSS of the font, which has the
	 * name and the URL in quotes, so "x url(https://host/y)" in a name of the
	 * code would load a URL that no check saw.
	 */
	EditorUi.isSimplePreviewFont = function(font)
	{
		return font != null && EditorUi.isSimplePreviewFontUrl(font.url) &&
			!/url\(/i.test(String(font.name)) && !/url\(/i.test(font.url);
	};

	/**
	 * Returns the CSS of the given web font ({name, url}) with the font as a
	 * data URI if it is in the cache of the previews (an empty string if it
	 * could not be loaded), else null: then it loads the font (see
	 * Editor.embedExtFonts, which fetches the CSS of Google Fonts) and calls
	 * the given function with its CSS once it is there. An empty string for
	 * a font that is late (setSimplePreviewFontLate), without the function.
	 */
	EditorUi.prototype.loadSimplePreviewFont = function(font, fn)
	{
		if (this.simplePreviewFonts == null)
		{
			this.simplePreviewFonts = Object.create(null);
		}

		var cache = this.simplePreviewFonts;
		var key = font.name + '\n' + font.url;
		var entry = cache[key];

		// Stealth and lockdown keep the fonts: the canvas loads them too
		// (Graph.addFont), and they come from the font host, not ours. Not in
		// the cache, so that the next preview loads them once it is online
		if (entry == null && (this.isOffline(true) ||
			!EditorUi.isSimplePreviewFont(font)))
		{
			return '';
		}
		else if (entry == null)
		{
			cache[key] = [];

			var store = function(css)
			{
				var waiters = cache[key];

				if (typeof waiters !== 'string')
				{
					cache[key] = (typeof css === 'string') ? css : '';

					for (var i = 0; i < waiters.length; i++)
					{
						waiters[i](cache[key]);
					}
				}
			};

			try
			{
				// Only this font, without the fonts of the file of the editor
				this.editor.embedExtFonts(store, null, {getCustomFonts: function()
				{
					return [font];
				}});
			}
			catch (e)
			{
				store('');
			}

			entry = cache[key];
		}

		if (typeof entry === 'string')
		{
			return entry;
		}
		else if (entry.late)
		{
			// Still loading after a preview waited for it: the fallback font
			// until it is in the cache
			return '';
		}
		else if (fn != null)
		{
			entry.push(fn);
		}

		return null;
	};

	/**
	 * Returns an SVG data URI of a graph of its own that the given function
	 * fills (it gets the graph), or null if the graph has no cells. With force
	 * the budget of the cells does not apply. The time it takes is in
	 * simplePreviewCost.
	 */
	EditorUi.prototype.createSimplePreviewImage = function(fill, force)
	{
		var preview = this.createSimplePreviewSvg(fill, force);

		return (preview != null) ? this.getSimplePreviewDataUri(preview,
			this.getSimplePreviewFontCss(preview.fonts)) : null;
	};

	/**
	 * Calls fn with the SVG data URI of a graph of its own that the given
	 * function fills (it gets the graph), or null if the graph has no cells,
	 * with the web fonts of its labels (see createSimplePreviewSource). The
	 * filling is synchronous, so an error of fill or of the budget is thrown
	 * here, before fn is called. With force the budget of the cells does not
	 * apply. The time it takes without the fonts is in simplePreviewCost.
	 */
	EditorUi.prototype.createSimplePreviewImageWithFonts = function(fill, force, fn)
	{
		this.createSimplePreviewSource(this.createSimplePreviewSvg(fill, force), fn);
	};

	/**
	 * Returns true if a live preview shows the given image: the preview is an
	 * SVG in an image, which loads nothing, so it shows only data URIs.
	 */
	EditorUi.isSimplePreviewImage = function(src)
	{
		return typeof src === 'string' && /^data:image\//i.test(src);
	};

	/**
	 * Returns true if the given CSS in a label of a live preview (style
	 * elements and attributes, attributes of SVG, eg. mask) loads nothing: all
	 * its URLs are data URIs or references in the label (#id). Escapes can
	 * hide a URL (eg. \75 rl) and are not allowed with a function. Stricter
	 * than Graph.isStyleAllowed, which checks the style attribute of every label
	 * after this, and linear in the length of the value.
	 */
	EditorUi.isSimplePreviewStyle = function(css)
	{
		return css.indexOf('(') < 0 || (css.indexOf('\\') < 0 &&
			!/(?:image-set|cross-fade|src)\s*\(|url\s*\((?!\s*["']?(?:#|data:))/i.test(css));
	};

	/**
	 * Hook of DOMPurify (uponSanitizeAttribute) for the labels of a live
	 * preview (see executeSimplePreview): removes the attributes that load an
	 * image, a media file, a style or an SVG, which the preview does not show.
	 * Images keep their place (transparentImage), links and references in the
	 * label itself (#id) are kept.
	 */
	EditorUi.sanitizeSimplePreviewAttribute = function(node, data)
	{
		var name = data.attrName;
		var value = mxUtils.trim(String(data.attrValue));
		var tag = node.nodeName.toLowerCase();
		var keep = true;

		if (name == 'srcset')
		{
			keep = false;
		}
		else if (name == 'src' && tag == 'img')
		{
			if (!EditorUi.isSimplePreviewImage(value))
			{
				data.attrValue = Editor.prototype.transparentImage;
			}
		}
		else if (name == 'src' || name == 'poster' || name == 'background')
		{
			keep = EditorUi.isSimplePreviewImage(value);
		}
		else if (name == 'href' || name == 'xlink:href')
		{
			keep = tag == 'a' || value.charAt(0) == '#' ||
				EditorUi.isSimplePreviewImage(value);
		}
		else
		{
			keep = EditorUi.isSimplePreviewStyle(value);
		}

		if (!keep)
		{
			data.keepAttr = false;
		}
	};

	/**
	 * Hook of DOMPurify (uponSanitizeElement) for the labels of a live preview
	 * (see executeSimplePreview): empties style elements that load a file.
	 */
	EditorUi.sanitizeSimplePreviewElement = function(node)
	{
		if (node.nodeName.toLowerCase() == 'style' &&
			!EditorUi.isSimplePreviewStyle(node.textContent))
		{
			node.textContent = '';
		}
	};

	/**
	 * Returns the result of the given function, which paints a live preview,
	 * and keeps what it paints to the preview, as its code is a draft that may
	 * never be inserted or applied (Cancel):
	 *
	 * - The fonts of styles and labels (fontSource and data-font-src, see
	 *   Graph.addFont) go into the given lookup, not into the fonts of the
	 *   document, where a new source of a font in use replaces the one of the
	 *   diagram, also after Cancel, and loads from any host. The image of the
	 *   preview cannot use the fonts of the document, those that it embeds are
	 *   collected in getSimplePreviewSvg (see isSimplePreviewFont).
	 * - Images are not loaded but for data URIs (isSimplePreviewImage), as the
	 *   preview shows no others: those of shapes and stencils, also for their
	 *   outline, and those of labels.
	 *
	 * The global functions are only replaced while the function runs, for all
	 * graphs, as dialogs and imports use graphs of their own (eg.
	 * Graph.updateCustomLinks).
	 */
	EditorUi.executeSimplePreview = function(fonts, fn)
	{
		var addFont = Graph.addFont;
		var paintImage = mxSvgCanvas2D.prototype.image;
		var getImageOutline = Graph.prototype.getImageOutline;

		Graph.addFont = function(name, url, callback, elementLookup)
		{
			return addFont.call(this, name, url, callback,
				(elementLookup != null) ? elementLookup : fonts);
		};

		mxSvgCanvas2D.prototype.image = function(x, y, w, h, src)
		{
			var args = Array.prototype.slice.call(arguments);
			args[4] = (EditorUi.isSimplePreviewImage(src)) ? src :
				Editor.prototype.transparentImage;

			return paintImage.apply(this, args);
		};

		// The box of other images, which is not cached for the diagram
		Graph.prototype.getImageOutline = function(src)
		{
			return (EditorUi.isSimplePreviewImage(src)) ?
				getImageOutline.apply(this, arguments) : null;
		};

		DOMPurify.addHook('uponSanitizeElement', EditorUi.sanitizeSimplePreviewElement);
		DOMPurify.addHook('uponSanitizeAttribute', EditorUi.sanitizeSimplePreviewAttribute);

		try
		{
			return fn();
		}
		finally
		{
			DOMPurify.removeHook('uponSanitizeAttribute', EditorUi.sanitizeSimplePreviewAttribute);
			DOMPurify.removeHook('uponSanitizeElement', EditorUi.sanitizeSimplePreviewElement);
			Graph.prototype.getImageOutline = getImageOutline;
			mxSvgCanvas2D.prototype.image = paintImage;
			Graph.addFont = addFont;
		}
	};

	/**
	 * Keeps what the given graph paints to a live preview (see
	 * executeSimplePreview), also later, as the graphs of some previews are
	 * painted asynchronously (CSV, ELK), when the diagram of the editor may be
	 * painted too. Returns the lookup of its fonts.
	 */
	EditorUi.isolateSimplePreview = function(g)
	{
		var fonts = Object.create(null);

		var isolate = function(obj, name)
		{
			var fn = obj[name];

			obj[name] = function()
			{
				var self = this;
				var args = arguments;

				return EditorUi.executeSimplePreview(fonts, function()
				{
					return fn.apply(self, args);
				});
			};
		};

		isolate(g, 'postProcessCellStyle');
		isolate(g, 'updateCustomLinks');
		isolate(g, 'getSvg');
		isolate(g.cellRenderer, 'getLabelValue');
		isolate(g.view, 'validate');

		return fonts;
	};

	/**
	 * Returns the SVG of a graph of its own that the given function fills
	 * and its web fonts (see getSimplePreviewSvg), or null if the graph has
	 * no cells. With force the budget of the cells does not apply. The time
	 * it takes is in simplePreviewCost.
	 */
	EditorUi.prototype.createSimplePreviewSvg = function(fill, force)
	{
		var g = Graph.createOffscreenGraph(this.editor.graph.getStylesheet());
		var container = g.container;
		var t0 = Date.now();
		g.simplePreviewForced = force == true;
		var fonts = EditorUi.isolateSimplePreview(g);
		document.body.appendChild(container);

		try
		{
			EditorUi.executeSimplePreview(fonts, function()
			{
				fill(g);
			});

			return this.getSimplePreviewSvg(g);
		}
		finally
		{
			this.simplePreviewCost = Date.now() - t0;
			g.destroy();

			if (container.parentNode != null)
			{
				container.parentNode.removeChild(container);
			}
		}
	};

	/**
	 * Calls fn with an SVG data URI of a graph of its own (or null) and the
	 * error, once the given function, which gets the graph and a function to
	 * call when it is done (with an error or nothing), has filled it. With
	 * force the budget of the cells does not apply. The time that it blocks
	 * the page (the call of fill and the source, without the waits for loads
	 * and timers) is in simplePreviewCost. The image has the web fonts of its
	 * labels (see createSimplePreviewSource).
	 */
	EditorUi.prototype.createSimplePreviewImageAsync = function(fill, fn, force)
	{
		var ui = this;
		var g = Graph.createOffscreenGraph(this.editor.graph.getStylesheet());
		var container = g.container;
		g.simplePreviewForced = force == true;
		var fonts = EditorUi.isolateSimplePreview(g);
		document.body.appendChild(container);
		var finished = false;
		var timeout = null;
		var filling = false;
		var fillCost = 0;
		var t0 = 0;

		var done = function(error)
		{
			if (!finished)
			{
				finished = true;
				window.clearTimeout(timeout);
				var preview = null;

				// Only the synchronous work counts (the call of fill and the
				// source), not the waits for loads and timers in between
				var t1 = (filling) ? t0 : Date.now();

				try
				{
					if (error == null)
					{
						preview = ui.getSimplePreviewSvg(g);
					}
				}
				catch (e)
				{
					error = e;
				}
				finally
				{
					ui.simplePreviewCost = ((filling) ? 0 : fillCost) + Date.now() - t1;
					g.destroy();

					if (container.parentNode != null)
					{
						container.parentNode.removeChild(container);
					}
				}

				if (error != null)
				{
					fn(null, error);
				}
				else
				{
					ui.createSimplePreviewSource(preview, function(src)
					{
						fn(src, null);
					});
				}
			}
		};

		timeout = window.setTimeout(function()
		{
			done(new Error(mxResources.get('timeout')));
		}, EditorUi.simplePreviewTimeout);

		try
		{
			filling = true;
			t0 = Date.now();

			EditorUi.executeSimplePreview(fonts, function()
			{
				fill(g, done);
			});
		}
		catch (e)
		{
			filling = false;
			fillCost = Date.now() - t0;
			done(e);
		}
		finally
		{
			if (filling)
			{
				filling = false;
				fillCost = Date.now() - t0;
			}
		}
	};

	/**
	 * Returns an object that acts as this editor for code that inserts into
	 * the given graph (a dialog or an import): no dialogs, no spinner, no
	 * animation, errors go to the given function.
	 */
	EditorUi.prototype.createSimpleParsePreviewUi = function(graph, handleError)
	{
		var preview = Object.create(this);
		preview.editor = Object.create(this.editor);
		preview.editor.graph = graph;
		preview.simpleParsePreview = true;
		preview.allowAnimation = false;
		preview.spinner = {spin: function() { return true; }, stop: function() {}};
		preview.hideDialog = function() {};
		preview.showDialog = function() {};
		preview.handleError = handleError;

		// New cells get the styles that Insert gives them on the current page
		// (the default styles and Calm, see pasteNewCellStyles)
		var current = this.editor.graph;
		graph.currentVertexStyle = mxUtils.clone(current.currentVertexStyle);
		graph.currentEdgeStyle = mxUtils.clone(current.currentEdgeStyle);
		graph.pasteEdgeStyle = current.pasteEdgeStyle;
		graph.pasteStylesToText = current.pasteStylesToText;

		var ui = this;

		// The copies of the current styles above are not the style that a
		// theme of the Diagram tab set, so the preview asks this editor
		if (typeof this.isCalmThemed === 'function')
		{
			preview.isCalmThemed = function()
			{
				return ui.isCalmThemed();
			};
		}

		// The theme of the Diagram tab (the session state of the page of this
		// editor and its current vertex style, see getChosenStyleTheme)
		if (typeof this.getChosenStyleTheme === 'function')
		{
			preview.getChosenStyleTheme = function()
			{
				return ui.getChosenStyleTheme();
			};
		}

		// The theme of the page that Style my diagram gave it (see
		// getNewCellStyles) is the one of this editor
		if (typeof this.getPageStyleTheme === 'function')
		{
			var pageTheme;

			preview.getPageStyleTheme = function()
			{
				if (pageTheme === undefined)
				{
					pageTheme = ui.getPageStyleTheme();
				}

				return pageTheme;
			};
		}

		if (typeof this.isCalmPage === 'function')
		{
			var calmPage = null;

			preview.isCalmPage = function()
			{
				if (calmPage == null)
				{
					calmPage = ui.isCalmPage();
				}

				return calmPage;
			};
		}

		graph.addListener('cellsInserted', function(sender, evt)
		{
			preview.pasteNewCellStyles(graph.includeDescendants(evt.getProperty('cells')));
		});

		return preview;
	};

	/**
	 * Returns a function that schedules the given update of a live preview
	 * after the given delay (default simpleCodePreviewDelay). With the given
	 * side (createCodePreview) a refresh is skipped while the last one
	 * took longer than simpleCodePreviewDelay (the preview is paused), and a
	 * click on the paused preview refreshes it once without the budget: the
	 * update then gets true (force).
	 */
	EditorUi.prototype.createSimplePreviewScheduler = function(update, side)
	{
		var ui = this;
		var thread = null;

		var schedule = function(delay, force)
		{
			window.clearTimeout(thread);
			thread = window.setTimeout(function()
			{
				if (side == null)
				{
					update();
				}
				else if (!force && side.cost > EditorUi.simpleCodePreviewDelay)
				{
					side.pause();
				}
				else
				{
					var t0 = Date.now();
					side.cost = 0;
					ui.simplePreviewCost = 0;

					try
					{
						update(force == true);
					}
					finally
					{
						side.cost = Math.max(side.cost, Date.now() - t0);
					}
				}
			}, (delay != null) ? delay : EditorUi.simpleCodePreviewDelay);
		};

		if (side != null)
		{
			side.refresh = function()
			{
				schedule(0, true);
			};
		}

		return schedule;
	};

	/**
	 * Returns true if the given code of the given type of the ParseDialog is
	 * above the budget of the live preview (isSimplePreviewOverBudget), with
	 * at most simpleLayoutPreviewMax lines for the types that are laid out.
	 */
	EditorUi.prototype.isSimpleParsePreviewLimited = function(type, text)
	{
		return this.isSimplePreviewOverBudget(text, (type == 'diagram' || type == 'circle' ||
			type == 'horizontalFlow' || type == 'verticalFlow' ||
			mxUtils.indexOf(EditorUi.OUTLINE_TYPES, type) >= 0) ?
			EditorUi.simpleLayoutPreviewMax : null);
	};

	/**
	 * Calls fn with an SVG data URI of what the ParseDialog with the given
	 * title and default type inserts for the given type and text, or null and
	 * the error. Mermaid and PlantUML are parsed as for Insert (the Preview of
	 * the dialog), the other types by a dialog of the same kind that inserts
	 * into a graph of its own, so the preview is exactly what Insert adds.
	 * With force the budget of the cells does not apply. editable is the
	 * state of Editable of the dialog (null for the stored one).
	 */
	EditorUi.prototype.createSimpleParsePreview = function(title, defaultType, type, text, fn, force, editable)
	{
		var ui = this;

		var error = function(e)
		{
			fn(null, (e != null) ? e : new Error(mxResources.get('invalidInput')));
		};

		if (mxUtils.trim(text).length == 0)
		{
			fn(null);
		}
		else if (type == 'mermaid' || type == 'mermaidImage')
		{
			if (EditorUi.isMermaidSupported())
			{
				// As the Preview of the dialog (see ParseDialog)
				this.parseMermaidDiagram(text, (type == 'mermaidImage' && !EditorUi.isMermaidConfigured()) ?
					mxUtils.clone(EditorUi.legacyMermaidConfig) : null, function(xml)
				{
					ui.createSimpleXmlPreview(xml, fn, force);
				}, error, null, EditorUi.getInsertMermaidVersion());
			}
			else
			{
				fn(null);
			}
		}
		else if (type == 'plantUmlDiagram' || type == 'plantUmlImage')
		{
			// Loads the converter on first use (only the dev mode and the
			// desktop app load it up front)
			var start = Date.now();

			var parse = function()
			{
				// Waits for a load in progress up to the timeout of the preview
				if (!EditorUi.isNativePlantUmlSupported() && ui.loadingPlantUml)
				{
					if (Date.now() - start < EditorUi.simplePreviewTimeout)
					{
						window.setTimeout(parse, 100);
					}
					else
					{
						fn(null);
					}
				}
				else
				{
					ui.parsePlantUmlDiagram(text, null, function(xml)
					{
						ui.createSimpleXmlPreview(xml, fn, force);
					}, function(e)
					{
						// No preview without the converter, Insert reports it
						if (EditorUi.isNativePlantUmlSupported())
						{
							error(e);
						}
						else
						{
							fn(null);
						}
					});
				}
			};

			parse();
		}
		else
		{
			var failed = null;
			var called = false;

			var done = function(src, e)
			{
				if (!called)
				{
					called = true;
					fn(src, e);
				}
			};

			try
			{
				this.createSimpleFontPreviewImage(function(g)
				{
					var preview = ui.createSimpleParsePreviewUi(g, function(e)
					{
						failed = e;
					});

					var twin = new ParseDialog(preview, title, defaultType);
					var elt = twin.container;
					var check = elt.querySelector('input[type="checkbox"]');
					elt.querySelector('select').value = type;
					elt.querySelector('textarea').value = text;

					if (check != null && editable != null)
					{
						check.checked = editable;
					}
					elt.querySelector('.gePrimaryBtn').click();

					if (failed != null)
					{
						throw failed;
					}
				}, force, function(src)
				{
					done(src);
				});
			}
			catch (e)
			{
				done(null, e);
			}
		}
	};

	/**
	 * Calls fn with an SVG data URI of the cells of the given XML (the result
	 * of a parser), null and the XML, or null and the error. Without force,
	 * XML with more cells than the budget pauses the preview before it is
	 * imported.
	 */
	EditorUi.prototype.createSimpleXmlPreview = function(xml, fn, force)
	{
		var ui = this;
		var graph = this.editor.graph;
		var called = false;

		var done = function(src, e)
		{
			if (!called)
			{
				called = true;
				fn(src, e, (src != null) ? xml : null);
			}
		};

		try
		{
			if (!force && this.isSimplePreviewCellsOverBudget(xml))
			{
				throw EditorUi.createSimplePreviewPausedError();
			}

			// The default styles that Insert gives the converted cells (see
			// importXml with getConvertedDiagramStyles in ParseDialog), eg.
			// sketch=1 of the default style of Sketch
			var styles = (typeof this.getConvertedDiagramStyles === 'function') ?
				this.getConvertedDiagramStyles() : null;

			this.createSimpleFontPreviewImage(function(g)
			{
				var cells = g.importCells(ui.stringToCells(xml));

				if (styles != null)
				{
					g.pasteCellStyles(g.includeDescendants(cells), graph.defaultVertexStyle,
						styles.edgeStyle, null, graph.pasteEdgeStyle, graph.pasteStylesToText);
				}
			}, force, function(src)
			{
				done(src);
			});
		}
		catch (e)
		{
			done(null, e);
		}
	};

	/**
	 * Calls fn with the SVG data URI of a graph of its own that the given
	 * function fills, or null if it has no cells, with the web fonts of its
	 * labels as in the inserted cells (createSimplePreviewImageWithFonts):
	 * at once if they are in the cache, else once they have loaded. Errors
	 * of fill and of the budget are thrown before fn is called.
	 */
	EditorUi.prototype.createSimpleFontPreviewImage = function(fill, force, fn)
	{
		this.createSimplePreviewImageWithFonts(fill, force, fn);
	};

	/**
	 * Calls fn with an SVG data URI of the cells that importing the given CSV
	 * adds, or null and the error. The import runs as for Insert › CSV, into
	 * a graph of its own. With force the budget of the cells does not apply.
	 */
	EditorUi.prototype.createSimpleCsvPreview = function(csv, fn, force)
	{
		var ui = this;

		this.createSimplePreviewImageAsync(function(g, done)
		{
			// The preview is an SVG in an image, which shows no external
			// images, so the graph loads none (the example has icons on
			// icons.diagrams.net, and the dialog loads nothing on open)
			g.getImage = function()
			{
				return null;
			};

			g.getIndicatorImage = function()
			{
				return null;
			};

			var preview = ui.createSimpleParsePreviewUi(g, function(e)
			{
				done((e != null) ? e : new Error(mxResources.get('invalidInput')));
			});

			preview.importCsv(csv, function()
			{
				done();
			}, g, true, {error: function(e)
			{
				done((e != null) ? e : new Error(mxResources.get('invalidInput')));
			}});
		}, fn, force);
	};

	/**
	 * Returns the mxGraphModel of the page that Apply of Edit Diagram takes
	 * from the given node (as updateDiagramData in Pages.js): the model, the
	 * first page of a file (compressed or not, also in HTML or the content
	 * of an SVG), a diagram or a root. Null if the node is no diagram. Before,
	 * a file went to the decoder of the model as it was and the preview was
	 * blank.
	 */
	EditorUi.prototype.getSimpleDiagramPreviewModel = function(node)
	{
		var diagrams = null;

		if (node != null && node.nodeName == 'diagram')
		{
			diagrams = [node];
		}
		else if (node != null && node.nodeName != 'mxGraphModel' &&
			node.nodeName != 'root')
		{
			node = this.editor.extractGraphModel(node, true, true);

			if (node != null && node.nodeName == 'mxfile')
			{
				var children = mxUtils.getChildNodes(node);
				diagrams = [];

				for (var i = 0; i < children.length; i++)
				{
					if (children[i].nodeName == 'diagram')
					{
						diagrams.push(children[i]);
					}
				}
			}
		}

		if (diagrams != null)
		{
			node = (diagrams.length > 0) ? Editor.parseDiagramNode(diagrams[0], true) : null;
		}

		if (node != null && node.nodeName == 'root')
		{
			var wrapper = node.ownerDocument.createElement('mxGraphModel');
			wrapper.appendChild(node);
			node = wrapper;
		}

		return (node != null && node.nodeName == 'mxGraphModel') ? node : null;
	};

	/**
	 * Calls fn with an SVG data URI of the page of the given XML of Edit
	 * Diagram (an mxGraphModel, a file, a diagram or a root, see
	 * getSimpleDiagramPreviewModel), or null for a page without cells,
	 * in a graph of its own with the web fonts of its labels (at once if they
	 * are in the cache, else once they have loaded, see
	 * createSimpleFontPreviewImage). Throws Invalid input for XML that is no
	 * diagram and the error that pauses the preview above the budget (the
	 * length and the cells of the XML are counted before it is parsed, the
	 * lines of a page are no measure of its cells), unless force is true.
	 */
	EditorUi.prototype.createSimpleDiagramPreview = function(value, force, fn)
	{
		if (!force && (value.length > EditorUi.simplePreviewBudget.length ||
			this.isSimplePreviewCellsOverBudget(value)))
		{
			throw EditorUi.createSimplePreviewPausedError();
		}

		var node = mxUtils.parseXml(Graph.zapGremlins(mxUtils.trim(value))).documentElement;
		var model = (node != null && !Editor.extractParserError(node)) ?
			this.getSimpleDiagramPreviewModel(node) : null;

		if (model == null)
		{
			throw new Error(mxResources.get('invalidInput'));
		}

		// The cells of a compressed page are counted once it is unpacked
		if (!force && model.getElementsByTagName('mxCell').length >
			EditorUi.simplePreviewBudget.cells)
		{
			throw EditorUi.createSimplePreviewPausedError();
		}

		this.createSimpleFontPreviewImage(function(g)
		{
			new mxCodec(model.ownerDocument).decode(model, g.getModel());
		}, force, fn);
	};

	/**
	 * Returns the parts of the Code template of a layout dialog in the given
	 * skin: the head, the body with the given text area in a code field with
	 * line numbers and the side. The content keeps the controls of the
	 * dialog.
	 */
	EditorUi.prototype.createLayoutCode = function(elt, title, subtitle, textarea, skin)
	{
		var classes = skin.classes;
		elt.classList.add(classes.layout);
		skin.setSize(elt);

		var head = document.createElement('div');
		head.className = classes.head;
		var h3 = document.createElement('h3');
		mxUtils.write(h3, title);
		head.appendChild(h3);

		var sub = skin.createSubtitle(subtitle);

		if (sub != null)
		{
			head.appendChild(sub);
		}

		var body = document.createElement('div');
		body.className = classes.body;
		var code = document.createElement('div');
		code.className = classes.code;
		body.appendChild(code);

		var field = LayoutCode.createNumberedField(textarea, classes.numbered);
		code.appendChild(field);

		var status = document.createElement('div');
		status.className = classes.status;
		status.setAttribute('role', 'status');
		code.appendChild(status);

		var side = document.createElement('div');
		side.className = classes.side;
		body.appendChild(side);

		return {head: head, body: body, field: field, status: status, side: side,
			// Rows of choices in the side (buttons, or radios of a group)
			choice: function(parent, label, fn, radio)
			{
				var btn = document.createElement('button');
				btn.setAttribute('type', 'button');
				btn.className = classes.choice;
				mxUtils.write(btn, label);

				if (radio)
				{
					btn.setAttribute('role', 'radio');
				}

				mxEvent.addListener(btn, 'click', function(evt)
				{
					fn(evt);
					mxEvent.consume(evt);
				});

				parent.appendChild(btn);

				return btn;
			}};
	};

	/**
	 * The custom layout (Arrange › Layout › Custom…, Edit Layout of other
	 * layouts) on the Code template in the given skin: the JSON with line
	 * numbers and its errors, the layouts to add in the side (the entries of
	 * the Add list of the dialog), Copy on the left of the footer. Returns
	 * true if the dialog has the layout.
	 */
	EditorUi.prototype.createCustomLayoutCode = function(elt, textarea, skin)
	{
		var classes = skin.classes;
		var lc = textarea.layoutControls;
		var top = elt.firstChild;
		var buttons = elt.lastChild;

		if (lc.addSelect == null || top == textarea || buttons == textarea)
		{
			return false;
		}

		var cell = this.getEditableLayoutContainer();
		var code = this.createLayoutCode(elt, mxResources.get('layout'),
			skin.getSubtitle(this, cell), textarea, skin);
		top.classList.add(classes.replaced);
		elt.insertBefore(code.head, top);
		elt.insertBefore(code.body, buttons);
		textarea.setAttribute('aria-label', mxResources.get('layout'));

		// The layouts to add: the entries of the Add list (a click chooses its
		// option, the dialog of the layout opens and appends it)
		var select = lc.addSelect;
		code.side.appendChild(skin.createSectionHead(mxResources.get('add')));
		var list = document.createElement('div');
		list.className = classes.list;
		list.setAttribute('role', 'group');
		list.setAttribute('aria-label', mxResources.get('add'));
		code.side.appendChild(list);

		for (var i = 0; i < select.options.length; i++)
		{
			if (!select.options[i].disabled)
			{
				(function(option)
				{
					code.choice(list, option.textContent, function()
					{
						select.value = option.value;
						select.dispatchEvent(new Event('change'));
					});
				})(select.options[i]);
			}
		}

		select.classList.add(classes.replaced);
		select.setAttribute('aria-hidden', 'true');
		select.setAttribute('tabindex', '-1');

		// Errors of the JSON below the code
		var check = function()
		{
			var text = mxUtils.trim(textarea.value);
			var message = '';

			if (text.length > 0)
			{
				try
				{
					JSON.parse(text);
				}
				catch (e)
				{
					message = mxResources.get('error') + ': ' + e.message;
				}
			}

			code.status.textContent = message;
		};

		var thread = null;

		mxEvent.addListener(textarea, 'input', function()
		{
			window.clearTimeout(thread);
			thread = window.setTimeout(check, 400);
		});

		// Copy on the left
		if (lc.copyBtn != null)
		{
			skin.decorateCopy(lc.copyBtn);
			buttons.insertBefore(lc.copyBtn, buttons.firstChild);
			var help = buttons.querySelector('.geHelpIcon');

			if (help != null)
			{
				buttons.insertBefore(help, buttons.firstChild);
			}
		}

		skin.decorateFooter(buttons, 'custom');

		return true;
	};

	/**
	 * Calls fn with an SVG data URI of the given box after the given text in
	 * the given format (see applyBoxText) is applied to a copy of the box (its
	 * cells and the connectors between them) in a graph of its own, or with
	 * null and the error. The model and the history of the diagram do not
	 * change. Boxes and texts above the budget of the live previews (the
	 * cells of the box, simpleLayoutPreviewMax lines) get the error that
	 * pauses the preview, unless the preview is forced.
	 */
	EditorUi.prototype.createOutlinePreview = function(container, text, format, fn, force)
	{
		var ui = this;
		var model = this.editor.graph.model;
		var cells = (model.contains(container)) ? model.getDescendants(container) : [];

		if (cells.length == 0)
		{
			fn(null);

			return;
		}
		else if (!force && (this.isSimplePreviewCellsOverBudget(cells.length) ||
			this.isSimpleParsePreviewLimited('verticalTree', text)))
		{
			fn(null, EditorUi.createSimplePreviewPausedError());

			return;
		}

		// The box and the connectors between its cells outside of it
		var inside = Object.create(null);
		var copy = [container];

		for (var i = 0; i < cells.length; i++)
		{
			inside[cells[i].id] = true;
		}

		for (var i = 0; i < cells.length; i++)
		{
			var edges = (model.isVertex(cells[i])) ? model.getEdges(cells[i]) : null;

			for (var j = 0; edges != null && j < edges.length; j++)
			{
				var source = model.getTerminal(edges[j], true);
				var target = model.getTerminal(edges[j], false);

				if (!inside[edges[j].id] && source != null && target != null &&
					inside[source.id] && inside[target.id])
				{
					inside[edges[j].id] = true;
					copy.push(edges[j]);
				}
			}
		}

		var clones = model.cloneCells(copy, true);

		this.createSimplePreviewImageAsync(function(g, done)
		{
			var failed = null;
			var preview = ui.createSimpleParsePreviewUi(g, function(e)
			{
				failed = e;
			});

			g.model.beginUpdate();
			try
			{
				g.addCells(clones, g.getDefaultParent());
			}
			finally
			{
				g.model.endUpdate();
			}

			g.executeWithoutLayoutLimits(function()
			{
				preview.applyBoxText(clones[0], text, format);
			});

			if (failed != null)
			{
				throw failed;
			}

			// ELK runs asynchronously while it loads (see scheduleAsyncLayout)
			var wait = function()
			{
				var running = false;

				for (var id in g.asyncLayoutsRunning)
				{
					running = true;
				}

				if (g.asyncLayoutsScheduled || running)
				{
					window.setTimeout(wait, 50);
				}
				else
				{
					done();
				}
			};

			wait();
		}, fn, force);
	};

	/**
	 * Edit Outline on the Code template in the given skin (a new outline is a
	 * type of From Text): the outline of the layout container with line
	 * numbers, Tab and Shift+Tab to indent, a live preview of the box and how
	 * outlines are written. The text of other boxes (lists, connections) is
	 * Edit Text without Tab and the hint. Returns true if the dialog has the
	 * layout.
	 */
	EditorUi.prototype.createOutlineCode = function(elt, lc, skin)
	{
		var ui = this;
		var classes = skin.classes;
		var scrollWrapper = elt.firstChild;
		var buttons = elt.lastChild;
		var textarea = lc.outline;
		var container = lc.container;
		var format = (lc.format != null) ? lc.format : 'outline';
		var outline = format == 'outline';

		if (scrollWrapper == buttons || buttons.nodeName != 'DIV')
		{
			return false;
		}

		var code = this.createLayoutCode(elt, mxResources.get((outline) ? 'editOutline' : 'editText'),
			skin.getSubtitle(this, container), textarea, skin);
		scrollWrapper.classList.add(classes.replaced);
		elt.insertBefore(code.head, scrollWrapper);
		elt.insertBefore(code.body, buttons);
		textarea.setAttribute('aria-label', mxResources.get((outline) ? 'outline' : 'editText'));

		// The live preview of the box with the text
		var preview = this.createCodePreview(classes.pane);
		preview.classList.add(classes.preview);
		code.side.appendChild(preview);
		var generation = 0;

		var updatePreview = function(force)
		{
			var current = ++generation;

			// Not after the dialog is closed
			if (document.body.contains(elt))
			{
				ui.createOutlinePreview(container, textarea.value, format, function(src, error)
				{
					if (current == generation && elt.parentNode != null)
					{
						preview.show(src, error);
					}
				}, force);
			}
		};

		var schedule = this.createSimplePreviewScheduler(updatePreview, preview);

		mxEvent.addListener(textarea, 'input', function()
		{
			schedule();
		});

		// After the dialog is shown
		schedule(0);

		// The type of a new outline drives the select of the dialog
		var select = lc.typeSelect;

		if (select != null && !skin.typeChoices)
		{
			// The select of the dialog in the side
			code.side.appendChild(skin.createSectionHead(mxResources.get('layout')));
			select.setAttribute('aria-label', mxResources.get('layout'));
			select.style.cssText = '';
			code.side.appendChild(select);
		}
		else if (select != null)
		{
			code.side.appendChild(skin.createSectionHead(mxResources.get('layout')));
			var list = document.createElement('div');
			list.className = classes.list;
			list.setAttribute('role', 'radiogroup');
			list.setAttribute('aria-label', mxResources.get('layout'));
			code.side.appendChild(list);
			var choices = [];

			var update = function()
			{
				for (var i = 0; i < choices.length; i++)
				{
					var on = choices[i].value == select.value;
					choices[i].btn.classList.toggle(classes.on, on);
					choices[i].btn.setAttribute('aria-checked', (on) ? 'true' : 'false');
					choices[i].btn.setAttribute('tabindex', (on) ? '0' : '-1');
				}
			};

			for (var i = 0; i < select.options.length; i++)
			{
				(function(option)
				{
					choices.push({value: option.value, btn: code.choice(list, option.textContent, function()
					{
						select.value = option.value;
						select.dispatchEvent(new Event('change'));
						update();
					}, true)});
				})(select.options[i]);
			}

			// The arrow keys choose the type (a radio group)
			mxEvent.addListener(list, 'keydown', function(evt)
			{
				var index = -1;

				for (var i = 0; i < choices.length; i++)
				{
					if (choices[i].btn == document.activeElement)
					{
						index = i;
					}
				}

				var next = (evt.key == 'ArrowDown' || evt.key == 'ArrowRight') ? index + 1 :
					((evt.key == 'ArrowUp' || evt.key == 'ArrowLeft') ? index - 1 : null);

				if (index >= 0 && next != null)
				{
					next = (next + choices.length) % choices.length;
					choices[next].btn.click();
					choices[next].btn.focus();
					mxEvent.consume(evt);
				}
			});

			update();
			select.classList.add(classes.replaced);
			select.setAttribute('aria-hidden', 'true');
			select.setAttribute('tabindex', '-1');
		}

		// How outlines are written and indented, read with the field (Tab
		// indents, Escape and Tab leave it)
		if (outline)
		{
			var ids = [];

			for (var i = 0; i < 2; i++)
			{
				var hint = document.createElement('div');
				hint.className = classes.hint;
				hint.id = classes.hint + '-' + Editor.guid();
				mxUtils.write(hint, mxResources.get((i == 0) ? 'outlineHint' : 'outlineTabHint'));
				code.side.appendChild(hint);
				ids.push(hint.id);
			}

			textarea.setAttribute('aria-describedby', ids.join(' '));
			EditorUi.addSimpleIndent(textarea);
		}

		// Ctrl+Enter (Cmd+Enter) runs the primary action
		var primary = buttons.querySelector('.gePrimaryBtn');

		if (primary != null)
		{
			mxEvent.addListener(textarea, 'keydown', function(evt)
			{
				if (evt.keyCode == 13 && (mxEvent.isControlDown(evt) || mxEvent.isMetaDown(evt)))
				{
					primary.click();
					mxEvent.consume(evt);
				}
			});
		}

		skin.decorateFooter(buttons, 'outline');

		return true;
	};

	/**
	 * Gives the given content of a dialog the Code template in the Classic
	 * skin if it is the custom layout (a text area with layoutControls) or
	 * Edit Outline (layoutControls with an outline) and its row of
	 * Editor.featureDefaults is on. Returns true if it has the layout.
	 */
	EditorUi.prototype.createLayoutCodeDialog = function(elt)
	{
		var skin = LayoutCode.skins.classic;
		var wrapper = elt.firstChild;
		var content = (wrapper != null) ? wrapper.firstChild : null;
		var lc = (content != null) ? content.layoutControls : null;

		if (elt.classList.contains(skin.classes.layout))
		{
			return false;
		}
		else if (lc != null)
		{
			return lc.outline != null && LayoutCode.isEnabled('outline') &&
				this.createOutlineCode(elt, lc, skin);
		}
		else
		{
			var textarea = null;

			for (var child = elt.firstChild; child != null; child = child.nextSibling)
			{
				if (child.nodeName == 'TEXTAREA' && child.layoutControls != null)
				{
					textarea = child;
				}
			}

			return textarea != null && LayoutCode.isEnabled('custom') &&
				this.createCustomLayoutCode(elt, textarea, skin);
		}
	};

	/**
	 * The custom layout and Edit Outline get the Code template in the Classic
	 * skin before the frame measures them (Fusion lays them out in
	 * createSimpleLayoutDialog, see SimpleLayouts.js).
	 */
	var editorUiShowDialog = EditorUi.prototype.showDialog;

	EditorUi.prototype.showDialog = function(elt, w, h, modal, closable, onClose, noScroll, transparent)
	{
		var args = arguments;

		if (elt != null && elt.nodeType == mxConstants.NODETYPE_ELEMENT && !transparent &&
			LayoutCode.getSkin() == LayoutCode.skins.classic && !this.editor.isChromelessView())
		{
			try
			{
				if (this.createLayoutCodeDialog(elt))
				{
					args = Array.prototype.slice.call(arguments);
					args[1] = LayoutCode.size.width;
					args[2] = LayoutCode.size.height;
				}
			}
			catch (e)
			{
				// Keeps the dialog
				EditorUi.debug('EditorUi.createLayoutCodeDialog', [this], 'error', [e]);
			}
		}

		return editorUiShowDialog.apply(this, args);
	};
})();
