/**
 * Copyright (c) 2026, JGraph Holdings Ltd
 * Copyright (c) 2026, draw.io AG
 */
/**
 * The Form template and the layouts of Fusion's dialogs in every look that
 * has them (the driver, 18 November 2026: every dialog of Fusion in the
 * Simple theme), one FormTemplate with one skin per look for all of them:
 *
 * - Edit Link and Save as (createLinkLayout, createSaveLayout): the headline
 *   with what the dialog acts on, the kind of the link as a choice with the
 *   field of the chosen kind (the URL, the page or the custom action), Open
 *   in New Window, and for Save as the name, the format and the place of the
 *   file. The controls of LinkDialog and SaveDialog move into the new layout
 *   with their listeners (or stay hidden and are driven, see their
 *   controls), so the dialogs link and save as before.
 * - Edit Geometry (EditGeometryDialog) and the custom font (FontDialog) on
 *   the Form template (createGeometryLayout, createFontLayout): the headline
 *   and what the dialog acts on, rows with a label column and the rest
 *   behind More options.
 * - Edit Connection Points (ConnectionPointsDialog) and Insert and Edit
 *   Polygon (PolygonDialog) as shape editors (createConnectionPointsLayout,
 *   createPolygonLayout): the Preview template (PreviewDialog.createLayout)
 *   with the canvas of the dialog and a bar of its tools on the left and the
 *   options on the right.
 * - The color dialog (ColorDialog: the color window and the modal dialog of
 *   pickColorModal, addColorSections): the color with its field, the dark
 *   color, Recent, Swatches and Custom (the pad of the picker) in sections,
 *   as an order of CSS, as the color window outlives a switch of the theme.
 * - Page Setup (PageSetupDialog: Paper with its size and orientation,
 *   Background, Grid, then More options), Edit Data (EditDataDialog: the
 *   headline and what it edits, the ID with Copy, the properties, one field
 *   to add a property with the common names as its suggestions,
 *   Placeholders with a hint and Export on the left of the footer) and the
 *   dialog of Edit Tooltip and Edit Note (MarkupDialog: the headline and the
 *   shape, the formatting toolbar with Formatted and HTML and the text in a
 *   field) on the Form template (createPageSetupLayout,
 *   createEditDataLayout, createMarkupLayout).
 *
 * Each layout moves the controls of its dialog into new rows with their
 * listeners, or keeps them hidden and drives them, so every option applies
 * what it applied before. Each layout takes a skin: the Classic skin
 * (FormTemplate.skins.classic, docs/dialog-style-guide.md, which takes the
 * colors, the font and the corners of the other dialogs of the theme; its
 * CSS is in grapheditor.css under .geFormTemplate for Edit Link and Save as
 * and under .geForm for the others) behind the rows linkDialog, saveDialog,
 * geometryDialog, connectionPointsDialog, polygonDialog, colorDialog,
 * fontDialog, pageSetupDialog, editDataDialog and markupDialog of
 * Editor.featureDefaults (on in Simple in the web app), or the
 * skin of Fusion, which SimpleForms.js adds (FormTemplate.skins.fusion, the
 * parts of the color dialog in SimpleColor.js), so the code exists once. The
 * dialogs of before are shown as they were where a row is off.
 */
var FormTemplate = {};

/**
 * The prototype of LinkDialog of the app: dialogs of other classes (eg. the
 * one of the Confluence plugin, which adds rows to the dialog after it is
 * built) keep their layout.
 */
FormTemplate.linkDialogPrototype = (typeof LinkDialog === 'function') ? LinkDialog.prototype : null;

/**
 * The rows of Editor.featureDefaults of the dialogs by their kind (the kind
 * that their constructors pass to EditorUi.installFormTemplate or
 * installFormLayout).
 */
FormTemplate.features = {geometry: 'geometryDialog', connectionPoints: 'connectionPointsDialog',
	polygon: 'polygonDialog', color: 'colorDialog', font: 'fontDialog', pageSetup: 'pageSetupDialog',
	editData: 'editDataDialog', markup: 'markupDialog'};

/**
 * Names of the data of the page that its own dialogs edit (style rules,
 * data sources, the animation).
 */
FormTemplate.pageSettingNames = [Graph.styleRulesAttribute, Graph.dataSourcesAttribute, 'animation'];

/**
 * The sizes of the dialogs in the Classic skin (the content, the frame adds
 * 48; a height of null is the height of the content), limited to the window
 * (FormTemplate.getSize). min is the smallest size of the dialogs that can
 * be resized.
 */
FormTemplate.sizes = {geometry: {width: 360, height: null},
	connectionPoints: {width: 720, height: 560, min: {width: 560, height: 420}},
	polygon: {width: 760, height: 560, min: {width: 560, height: 420}},
	font: {width: 420, height: null}};

/**
 * Space between the frame and the window in the Classic skin.
 */
FormTemplate.windowMargin = 32;

/**
 * Below this width of the window the shape editors show the canvas above the
 * options (see .gePreviewBody in grapheditor.css), so their height grows by
 * the height of the canvas there (narrowCanvasHeight).
 */
FormTemplate.narrowWidth = 700;

FormTemplate.narrowCanvasHeight = 240;

/**
 * Sample of the font preview after the name of the font.
 */
FormTemplate.fontSample = 'AaBbCc 0123456789';

/**
 * Returns true if the dialogs of the given kind (see FormTemplate.features)
 * show the layout: the row of the kind in Editor.featureDefaults (its key
 * in the configuration and the URL), on in Simple, off in Classic, Sketch,
 * Minimal and Atlas (the driver, 18 November 2026, named only Simple). The
 * theme Fusion always has them.
 */
FormTemplate.isEnabled = function(kind)
{
	return Object.prototype.hasOwnProperty.call(FormTemplate.features, kind) &&
		Editor.isFeatureEnabled(FormTemplate.features[kind]);
};

/**
 * The skins of the Form template and the layouts. A skin has the classes of
 * the parts and the builders of the parts that differ (see
 * FormTemplate.skins.classic): for Edit Link and Save as initForm,
 * initFooter, fit, getCellsSubtitle, getPageSubtitle, getFileTitle,
 * createSubtitle, createPanel, createRow, initReset, createPages, addKinds,
 * addOption, createPlaces, decoratePrimary, placeReset and, optionally,
 * createToggleGroup (the format of Save as as buttons, else the list of the
 * dialog); for the other layouts the builders of their forms, shape editors
 * and the color dialog. The skin of Fusion is added by SimpleForms.js.
 */
FormTemplate.skins = {};

/**
 * Returns the skin of the layouts for the current theme: the skin of Fusion
 * in Fusion (if its scripts are loaded), else the Classic skin.
 */
FormTemplate.getSkin = function()
{
	return (typeof Editor.isSimpleModern === 'function' && Editor.isSimpleModern() &&
		FormTemplate.skins.fusion != null) ? FormTemplate.skins.fusion :
		FormTemplate.skins.classic;
};

/**
 * Returns true if the given kind of dialog is laid out in the Classic skin:
 * the switch of the kind is on and the theme is not Fusion (which lays the
 * dialogs out itself, see SimpleForms.js).
 */
FormTemplate.isClassic = function(ui, kind)
{
	return ui != null && ui.editor != null && !ui.editor.isChromelessView() &&
		FormTemplate.getSkin() == FormTemplate.skins.classic &&
		FormTemplate.isEnabled(kind);
};

/**
 * Returns the size of the dialogs of the given kind in the Classic skin,
 * limited to the window.
 */
FormTemplate.getSize = function(kind)
{
	var size = FormTemplate.sizes[kind];
	var ww = window.innerWidth || document.documentElement.clientWidth;
	var wh = window.innerHeight || document.documentElement.clientHeight;
	var margin = 48 + ((ww < 640) ? 16 : FormTemplate.windowMargin);

	var height = (size.height != null && ww < FormTemplate.narrowWidth) ?
		size.height + FormTemplate.narrowCanvasHeight : size.height;

	return {width: Math.max(Math.min(size.width, ww - margin), 240),
		height: (height != null) ? Math.max(Math.min(height, wh - margin), 240) : null,
		min: (size.min != null) ? new mxRectangle(0, 0, Math.min(size.min.width, ww - margin),
			Math.min(size.min.height, wh - margin)) : null};
};

/**
 * Dispatches a click with the modifiers of the given event on the given
 * element (the tools of the dialogs are links or buttons with click
 * listeners).
 */
FormTemplate.clickControl = function(elt, evt)
{
	if (elt != null)
	{
		elt.dispatchEvent(new MouseEvent('click', {bubbles: true, cancelable: true,
			shiftKey: evt != null && evt.shiftKey, altKey: evt != null && evt.altKey,
			ctrlKey: evt != null && evt.ctrlKey, metaKey: evt != null && evt.metaKey}));
	}
};

/**
 * Calls the given function when the attributes of the given element change
 * (the state of a control that the dialog sets on its old controls).
 */
FormTemplate.observeControl = function(elt, fn, options)
{
	if (elt != null && window.MutationObserver != null)
	{
		new MutationObserver(fn).observe(elt, (options != null) ? options :
			{attributes: true, attributeFilter: ['style', 'disabled', 'class']});
	}
};

/**
 * Returns the container of the given graph of a dialog as a target of the
 * focus (with a tab index), or null.
 */
FormTemplate.getCanvas = function(graph)
{
	var container = (graph != null) ? graph.container : null;

	if (container != null && !container.hasAttribute('tabindex'))
	{
		container.setAttribute('tabindex', '0');
	}

	return container;
};

/**
 * Enter runs the primary action of the given dialog element in single-line
 * fields and on its canvas, Ctrl+Enter (Cmd+Enter) also in text areas.
 */
FormTemplate.addEnter = function(elt, primary)
{
	mxEvent.addListener(elt, 'keydown', function(evt)
	{
		var target = mxEvent.getSource(evt);

		if (evt.keyCode == 13 && !evt.shiftKey && !evt.altKey && !evt.defaultPrevented &&
			primary != null && !primary.disabled && target != null &&
			target.nodeName != 'BUTTON' && target.nodeName != 'SELECT' && target.nodeName != 'A' &&
			target.getAttribute('role') != 'radio' && target.getAttribute('role') != 'button' &&
			(target.nodeName != 'TEXTAREA' || mxEvent.isControlDown(evt) || mxEvent.isMetaDown(evt)) &&
			(target.nodeName != 'INPUT' || /^(text|number|search|url|email|)$/.test(target.type || '')))
		{
			// Fields apply their value before (their change listeners)
			if (target.nodeName == 'INPUT')
			{
				target.dispatchEvent(new Event('change', {bubbles: true}));
			}

			// Text areas click it themselves for Ctrl+Enter (without consuming
			// the event); Cmd+Enter is clicked here unless a listener of the
			// text area handled it (it consumes the event)
			if (target.nodeName != 'TEXTAREA' || (mxEvent.isMetaDown(evt) && !mxEvent.isControlDown(evt)))
			{
				primary.click();
			}

			mxEvent.consume(evt);
		}
	});
};

/**
 * Returns true if the font preview may load the given URL: absolute http(s)
 * URLs with a host and a path, as the font dialog accepts (not the
 * beginning of a URL that is typed, nor relative URLs).
 */
FormTemplate.isFontPreviewUrl = function(url)
{
	return /^https?:\/\/[^\/\s?#@]+\/\S/i.test(url) && Graph.isValidFontUrl(url);
};

/**
 * Returns the given constraint of a connection point (see
 * ConnectionPointsDialog) as text: X and Y in percent of the size of the
 * shape, each with its offset in points if it has one. Values that are not
 * numbers (crafted styles) are a question mark.
 */
FormTemplate.formatConnectionPoint = function(constraint)
{
	var part = function(name, value, offset)
	{
		var v = parseFloat(value);
		var d = parseFloat(offset);

		return name + ' ' + ((isFinite(v)) ? parseFloat((v * 100).toFixed(1)) : '?') + ' %' +
			((isFinite(d) && d != 0) ? ' ' + ((d > 0) ? '+' : '') + parseFloat(d.toFixed(1)) + ' pt' : '');
	};

	return part('X', constraint.x, constraint.dx) + ', ' + part('Y', constraint.y, constraint.dy);
};

/**
 * Returns the given value as a text to show, or null if there is none.
 */
FormTemplate.getText = function(value)
{
	var text = (value != null) ? mxUtils.trim(String(value)) : '';

	return (text.length > 0) ? text : null;
};

/**
 * Returns the given numbers of shapes and connectors as a text without the
 * ones that are 0 ("2 shapes", "2 shapes · 1 connector").
 */
FormTemplate.getCountText = function(shapes, connectors)
{
	var parts = [];

	if (shapes > 0 || connectors == 0)
	{
		parts.push((shapes == 1) ? mxResources.get('toastOneShape') :
			mxResources.get('toastShapes', [shapes]));
	}

	if (connectors > 0)
	{
		parts.push((connectors == 1) ? mxResources.get('toastOneConnector') :
			mxResources.get('toastConnectors', [connectors]));
	}

	return PreviewDialog.joinList(parts);
};

/**
 * Returns the subtitle of the dialogs of the given cells: the label and the
 * type of one cell, or the numbers of shapes and connectors. The label is
 * plain text (written as text).
 */
FormTemplate.getCellsSubtitle = function(graph, cells)
{
	if (cells.length > 1)
	{
		var edges = 0;

		for (var i = 0; i < cells.length; i++)
		{
			edges += (graph.model.isEdge(cells[i])) ? 1 : 0;
		}

		return FormTemplate.getCountText(cells.length - edges, edges);
	}
	else if (cells.length == 1 && cells[0] != null)
	{
		var label = mxUtils.trim(graph.getPlainLabel(cells[0], 40) || '');
		var type = (typeof graph.getCellTypeName === 'function') ? graph.getCellTypeName(cells[0]) : null;

		return (label.length > 0 && type != null && label != type) ? PreviewDialog.joinList([label, type]) :
			((label.length > 0) ? label : type);
	}

	return null;
};

/**
 * Returns the subtitle of the dialogs of the current page of the given
 * EditorUi, which names the one thing they act on (concept 3.9): the page of
 * a file with more than one page, else the file, else This page (a page
 * without a name names the file, a new file without a title, which it has
 * none until it is saved, the page).
 */
FormTemplate.getPageSubtitle = function(ui)
{
	// A dialog of New names the new file (see showNewFileFromTextDialog)
	var name = FormTemplate.getText(ui.newFileTitle);

	if (name != null)
	{
		return name;
	}

	name = (ui.currentPage != null && ui.pages != null && ui.pages.length > 1) ?
		FormTemplate.getText(ui.currentPage.getName()) : null;

	if (name == null)
	{
		name = FormTemplate.getFileTitle(ui.getCurrentFile());
	}

	return (name != null) ? name : mxResources.get('thisPageTitle');
};

/**
 * Returns the title of the given file, or null if it has none: a new file
 * has no title until it is saved (LocalFile.getTitle returns null).
 */
FormTemplate.getFileTitle = function(file)
{
	return (file != null) ? FormTemplate.getText(file.getTitle()) : null;
};

/**
 * Resizes the dialog of the given content to its content after it changed
 * (as addAdvancedSection): Edit Link, Save as and the dialogs with the
 * height of their content, not those with a height (formTemplateSize, see
 * FormTemplate.sizes).
 */
FormTemplate.fitDialog = function(elt)
{
	var dlg = (elt != null) ? elt.closest('.geDialog') : null;

	// The content of the dialog, or the wrapper that holds it
	var wrapper = (dlg != null) ? ((elt.parentNode == dlg) ? elt : dlg.firstElementChild) : null;

	if (wrapper != null && (elt.formTemplateSize == null || elt.formTemplateSize.height == null))
	{
		// The top stays where it is, so the control that changed the content
		// stays under the pointer (Dialog.setFrameHeight)
		var top = dlg.getBoundingClientRect().top;
		dlg.style.height = '';
		Dialog.setFrameHeight(dlg, Dialog.getFrameHeight(dlg, wrapper.scrollHeight), top);
	}
};

/**
 * Moves the focus to the control that the given function returns once the
 * dialog of the given content is shown, unless the focus is in the dialog.
 */
FormTemplate.focusDialog = function(elt, fn)
{
	window.setTimeout(function()
	{
		var div = elt.parentNode;

		if (div != null && div.parentNode != null && !div.contains(document.activeElement))
		{
			var target = fn();

			if (target != null && target.offsetParent != null && !target.disabled)
			{
				target.focus();
			}
		}
	}, 0);
};

/**
 * The images of the tools of the shape editors in the Classic skin (the
 * images of the dialogs of before).
 */
FormTemplate.getClassicImage = function(name)
{
	var images = {minus: Editor.zoomOutImage, plus: Editor.zoomInImage, fit: Editor.zoomFitImage,
		gridLines: Editor.thinGridImage, trash: Editor.trashImage, undo: Editor.undoImage,
		redo: Editor.redoImage};

	return (Object.prototype.hasOwnProperty.call(images, name)) ? images[name] : null;
};

/**
 * The Classic skin (docs/dialog-style-guide.md), for Simple and, for Edit
 * Link and Save as, Classic and the other themes: the headline of the
 * dialogs, what they act on in gray, rows of geDialogFormRow in
 * geDialogSection cards, More options as the collapsible section of the
 * dialogs (addAdvancedSection), checkboxes instead of switches, lists
 * instead of toggle groups and tiles, the shape editors on the Preview
 * template in its Classic skin, the buttons without glyphs and the focus
 * rings as outlines inside of the controls. Edit Link and Save as have the
 * head of the Preview template, one card with the rows, the pages of the
 * file and the places of Save as as the lists of the dialog (the logo of the
 * chosen storage in the list) and the footer of the dialog. The CSS is in
 * grapheditor.css under .geFormTemplate (Edit Link and Save as) and .geForm.
 */
FormTemplate.skins.classic = {
	name: 'classic',
	toggleGroups: false,
	switches: false,
	fontFallback: 'sans-serif',
	sectionsKey: 'formSections',
	/**
	 * Sections are cards that hold their rows.
	 */
	cards: true,
	/**
	 * Add Property stays a button with its name (Fusion has a plus).
	 */
	replaceAddButton: false,
	/**
	 * Page Setup keeps the rows of the animation, the style rules and the
	 * data sources of the page.
	 */
	pageActions: true,
	/**
	 * On touch the dialog itself takes the focus, as every dialog of Classic
	 * and Simple (no keyboard opens, see EditorUi.focusDialogStart), not the
	 * first control of the form (see EditorUi.focusForm).
	 */
	touchFocus: true,
	/**
	 * The rows of a text of Edit Data keep the height of the dialog.
	 */
	dataRows: null,
	classes: {head: 'gePreviewHead', subtitle: 'geDialogHint gePreviewSubtitle', replaced: 'geFormReplaced',
		linkBody: 'geDialogSection geFormBody', placeBody: 'geDialogSection geFormBody', urlRow: 'geFormLinkUrl',
		actionRow: 'geFormLinkAction', actionSummary: 'geFormLinkActionSummary',
		filenameRow: 'geFormPlaceFilename', formatRow: null,
		on: 'geFormOn', unit: 'geDialogHint geFormUnit',
		rowGroup: null, editorHint: 'geDialogHint geFormEmpty', geometry: 'geFormGeometry',
		connectionPoints: 'geFormConnectionPoints', connectionPoint: 'geFormConnectionPoint',
		pointList: 'geFormPointList', pointRow: 'geFormPointRow', pointChoice: 'geFormPointChoice',
		pointNumber: 'geFormPointNumber', polygon: 'geFormPolygon', polygonPoints: 'geFormPolygonPoints',
		polygonRow: 'geFormPolygonRow', font: 'geFormFont', fontPreview: 'geFormFontPreview',
		fontSample: 'geFormFontSample', fontSample2: 'geFormFontSample2',
		fontCaption: 'geDialogHint geFormFontCaption', color: 'geFormColor', colorNoRecent: 'geFormColorNoRecent',
		colorPad: 'geFormColorPad', colorCurrent: 'geFormColorCurrent', colorPalettes: 'geFormColorPalettes',
		colorInherit: 'geFormColorInherit', colorDark: 'geFormColorDark', colorAdvanced: 'geFormColorAdvanced',
		colorAdvancedToggle: 'geFormColorAdvancedToggle', colorHead: 'geFormColorHead',
		colorRecentHead: 'geFormColorRecentHead', colorCustomHead: 'geFormColorCustomHead',
		colorDialog: 'geFormColorDialog',
		form: 'geForm', formHead: 'geFormHead', formSubtitle: 'geDialogHint geFormSubtitle',
		row: 'geDialogFormRow', label: 'geDialogFormLabel', control: 'gePreviewControl',
		hint: 'geDialogHint geFormHint', rowTop: 'geDialogFormRowTop', pageSetup: 'geFormPageSetup',
		paper: 'geFormPaper', orientation: 'geFormOrientation', pageBackground: 'geFormPageBackground',
		swatch: 'geFormSwatch', none: 'geFormNone', pageBackgroundText: 'geFormPageBackgroundText',
		pageView: 'geFormPageView', editData: 'geFormEditData', idRow: 'geFormIdRow', id: 'geFormId',
		props: 'geFormProps', dataRow: 'geFormDataRow', remove: 'geFormRemove', dataAdd: 'geFormDataAdd',
		dataNames: 'geFormDataNames', dataOptions: 'geFormDataOptions', footer: 'geFormFooter',
		footerStart: 'geFormFooterStart', markup: 'geFormMarkup', markupBar: 'geFormMarkupBar',
		markupMode: 'geFormMarkupMode', markupField: 'geFormMarkupField'},
	/**
	 * Adds the classes of the template and of the given kind (link or place)
	 * to the given container.
	 */
	initForm: function(ui, elt, kind)
	{
		elt.classList.add('geFormTemplate', (kind == 'link') ? 'geFormLink' : 'geFormPlace');
	},
	/**
	 * The spacing of the buttons of CustomDialog (docs/dialog-style-guide.md,
	 * Button Spacing).
	 */
	initFooter: function(buttons, elt)
	{
		buttons.style.marginTop = '34px';
		elt.style.paddingBottom = '10px';
	},
	/**
	 * Fits the height of the dialog of the given content to its content
	 * after it changed (FormTemplate.fitDialog).
	 */
	fit: function(ui, elt)
	{
		FormTemplate.fitDialog(elt);
	},
	/**
	 * Returns the subtitle of the dialogs of the given cells.
	 */
	getCellsSubtitle: function(ui, graph, cells)
	{
		return FormTemplate.getCellsSubtitle(graph, cells);
	},
	/**
	 * Returns the subtitle of the dialogs of the current page: the page of a
	 * file with more than one page, else the file, else This page.
	 */
	getPageSubtitle: function(ui)
	{
		return FormTemplate.getPageSubtitle(ui);
	},
	/**
	 * Returns the title of the given file, or null for a new file that has no
	 * title yet.
	 */
	getFileTitle: function(ui, file)
	{
		return FormTemplate.getFileTitle(file);
	},
	/**
	 * Returns the subtitle with the given text, or null if there is no text.
	 * className is the class of the subtitle (default classes.subtitle, the
	 * forms have classes.formSubtitle).
	 */
	createSubtitle: function(text, className)
	{
		text = FormTemplate.getText(text);
		var sub = null;

		if (text != null)
		{
			sub = document.createElement('div');
			sub.className = (className != null) ? className : this.classes.subtitle;
			mxUtils.write(sub, text);
		}

		return sub;
	},
	/**
	 * Returns the part of a kind of link (its rows are rows of the card).
	 */
	createPanel: function()
	{
		var panel = document.createElement('div');
		panel.className = 'geFormPanel';

		return panel;
	},
	/**
	 * Adds a row with the given label and control to the given parent and
	 * returns the element that holds the control (the rows of the Preview
	 * template).
	 */
	createRow: function(parent, label, control, className)
	{
		return PreviewDialog.skins.classic.createRow(label, control, className, parent);
	},
	/**
	 * Reset of the URL as a button of 24 after the field.
	 */
	initReset: function(cross)
	{
		cross.classList.add('geFormLinkReset');
		cross.style.width = '';
		cross.style.height = '';
	},
	/**
	 * The pages as the list of the dialog (with Page not found for a link to
	 * a deleted page). Returns pick, which chooses the page of the given
	 * value, and getFocus, the control of the pages.
	 */
	createPages: function(ui, c, panel)
	{
		c.pages.style.flex = '';
		c.pages.style.minWidth = '';
		c.pages.style.marginLeft = '';
		this.createRow(panel, mxResources.get('page'), c.pages);

		return {
			pick: function(value)
			{
				for (var i = 0; i < c.pages.options.length; i++)
				{
					if (c.pages.options[i].value == value && !c.pages.options[i].disabled)
					{
						c.pages.value = value;
						c.pages.dispatchEvent(new Event('change'));
						c.page.checked = true;

						return true;
					}
				}

				return false;
			},
			getFocus: function()
			{
				return c.pages;
			}};
	},
	/**
	 * The kind of the link as a list in the first row of the card. Returns
	 * the list (setValue).
	 */
	addKinds: function(body, items, value, fn, label)
	{
		var select = PreviewDialog.skins.classic.createChoice(items, value, fn, label);
		var ctl = this.createRow(body, label, select, 'geFormLinkKinds');
		body.insertBefore(ctl.parentNode, body.firstChild);

		return select;
	},
	/**
	 * An option of the link as a checkbox.
	 */
	addOption: function(body, input, label)
	{
		return PreviewDialog.skins.classic.createCheckRow(input, label, null, body);
	},
	/**
	 * The place of the file: the list of the dialog with the logo of the
	 * chosen storage inside it. Returns the function that updates the logo.
	 */
	createPlaces: function(ui, c, body)
	{
		var pick = document.createElement('div');
		pick.className = 'geFormPlacePick';
		var logo = document.createElement('img');
		logo.setAttribute('alt', '');
		pick.appendChild(logo);
		c.storage.style.gridColumn = '';
		c.storage.classList.add('geFormPlaceSelect');
		c.storage.setAttribute('aria-label', mxResources.get('where'));
		pick.appendChild(c.storage);
		var ctl = this.createRow(body, mxResources.get('where'), pick);
		PreviewDialog.labelControl(ctl.previousSibling, c.storage);

		return function()
		{
			var value = c.storage.value || '';
			var pickFolder = value.substring(0, 11) == 'pickFolder-';
			var entry = (pickFolder) ? null : c.getEntry(value);
			var mode = (pickFolder) ? value.substring(11) : ((entry != null) ? entry.mode : null);
			var storage = (mode != null && typeof App !== 'undefined' && App.storages != null) ?
				App.storages[mode] : null;
			var src = (storage != null && storage.logo != null) ? IMAGE_PATH + '/' + storage.logo : null;

			if (src != null)
			{
				if (logo.getAttribute('src') != src)
				{
					logo.setAttribute('src', src);
				}

				logo.style.display = '';
			}
			else
			{
				logo.removeAttribute('src');
				logo.style.display = 'none';
			}

			pick.classList.toggle('geFormPlaceLogo', src != null);
		};
	},
	decoratePrimary: function(btn)
	{
		// The label of the button only
	},
	placeReset: function(c)
	{
		// Reset stays in the footer of the dialog
	},
	/**
	 * The delay of the font preview after typing (EditorUi.previewDelay).
	 */
	getPreviewDelay: function()
	{
		return EditorUi.previewDelay;
	},
	/**
	 * Returns the text of a headline.
	 */
	getTitle: function(title)
	{
		return title;
	},
	/**
	 * Returns a glyph of the given name (none: the buttons of the Classic
	 * skin have none).
	 */
	createIcon: function(name)
	{
		return null;
	},
	/**
	 * Returns a button that calls fn: with the image of the given name (see
	 * getClassicImage) and the given label as its name (the tools of the
	 * shape editors, Delete), else a button with the label (Copy of Edit
	 * Data). className is added to its classes.
	 */
	createIconButton: function(name, label, fn, className)
	{
		var src = FormTemplate.getClassicImage(name);
		var btn = null;

		if (src != null)
		{
			btn = document.createElement('button');
			btn.setAttribute('type', 'button');
			btn.className = 'geFormIconBtn' + ((className != null) ? ' ' + className : '');
			btn.setAttribute('title', label);
			btn.setAttribute('aria-label', label);
			var img = document.createElement('img');
			img.setAttribute('src', src);
			img.setAttribute('alt', '');
			img.className = 'geAdaptiveAsset';
			btn.appendChild(img);

			mxEvent.addListener(btn, 'click', function(evt)
			{
				fn(evt);
			});
		}
		else
		{
			btn = mxUtils.button(label, function(evt)
			{
				fn(evt);
				mxEvent.consume(evt);
			});

			btn.className = 'geBtn' + ((className != null) ? ' ' + className : '');
			btn.setAttribute('type', 'button');
		}

		return btn;
	},

	/**
	 * Returns a list (select) for the given items ({value, label}), with
	 * setValue, which calls fn with the value of a change (toggle groups of
	 * Fusion are lists here).
	 */
	createChoice: function(items, value, fn, label)
	{
		return PreviewDialog.skins.classic.createChoice(items, value, fn, label);
	},
	/**
	 * Turns the given checkbox and its row into a check row (the checkbox,
	 * then its label). Returns the row.
	 */
	createSwitchRow: function(ui, input, hint)
	{
		var row = (input.checkRow != null) ? input.checkRow : input.parentNode;
		row.classList.add('geDialogCheckRow');
		row.style.paddingLeft = '';
		row.style.marginTop = '';
		input.style.marginRight = '';
		input.style.marginTop = '';

		if (row.firstChild != input)
		{
			row.insertBefore(input, row.firstChild);
		}

		return row;
	},
	/**
	 * Lays out the given content of a dialog (a CustomDialog or a dialog with
	 * the title first and the buttons last) as a form with the given headline
	 * and subtitle. The parts of before (the first child) are hidden. Returns
	 * the functions that add its parts (see EditorUi.createSimpleForm), or
	 * null if the dialog has another structure.
	 */
	createForm: function(ui, elt, title, subtitle)
	{
		var first = elt.firstChild;
		var buttons = elt.lastChild;

		if (first == null || first == buttons || buttons.nodeName != 'DIV')
		{
			return null;
		}

		elt.classList.add(this.classes.form);
		first.classList.add(this.classes.replaced);
		var head = this.createHead(title, subtitle);
		elt.insertBefore(head.head, first);

		var body = document.createElement('div');
		body.className = 'geFormBody';
		elt.insertBefore(body, buttons);

		var skin = this;
		var parent = body;
		var card = null;

		// The rows go into the card of the current section
		var getCard = function()
		{
			if (card == null)
			{
				card = PreviewDialog.skins.classic.createSection(null, parent).content;
			}

			return card;
		};

		return {body: body, head: head.head, buttons: buttons,
			fitLabels: function()
			{
				// Labels grow with their text (geDialogFormLabel)
			},
			section: function(name)
			{
				var h = skin.createSectionHead(name);
				parent.appendChild(h);
				card = null;

				return h;
			},
			row: function(label, control, className)
			{
				return PreviewDialog.skins.classic.createRow(label, control, className, getCard());
			},
			// More options: the collapsible section of the dialogs, which fits
			// the height of the dialog when it opens or closes
			more: function()
			{
				var advanced = ui.addAdvancedSection(body, 'moreOptions');
				parent = advanced.wrapper;
				card = advanced.content;

				return advanced.content;
			}};
	},

	/**
	 * Lays out the given content of a shape editor on the Preview template:
	 * the head, the canvas pane with a bar of tools and the options. Returns
	 * the functions that add its parts (see createSimpleEditorLayout).
	 */
	createEditor: function(ui, elt, title, subtitle, className)
	{
		elt.classList.add('geFormEditor');

		if (className != null)
		{
			elt.classList.add(className);
		}

		// The dialogs place their content absolutely
		elt.style.position = '';
		elt.style.left = '';
		elt.style.right = '';
		elt.style.top = '';
		elt.style.bottom = '';
		elt.style.height = '';
		elt.style.width = '';

		var skin = PreviewDialog.skins.classic;
		var layout = PreviewDialog.createLayout(skin, {title: title,
			subtitle: (subtitle != null && subtitle.length > 0) ? subtitle : null,
			paneClass: 'geFormEditorPane', paneHidden: false});
		elt.classList.add(skin.classes.template);
		var pane = layout.pane;
		var options = layout.options;

		var tools = document.createElement('div');
		tools.className = 'geFormEditorTools';
		tools.setAttribute('role', 'toolbar');
		tools.setAttribute('aria-label', title);

		var parent = options;
		var card = null;

		var getCard = function()
		{
			if (card == null)
			{
				card = skin.createSection(null, parent).content;
			}

			return card;
		};

		return {head: layout.head, body: layout.body, pane: pane, tools: tools, options: options,
			canvas: function(canvas)
			{
				canvas.classList.add('geFormCanvas');
				pane.appendChild(canvas);
			},
			// A tool that clicks the given control of the dialog and follows its
			// state (disabled by its opacity or pointer events)
			tool: function(name, label, control, isEnabled)
			{
				var btn = FormTemplate.skins.classic.createIconButton(name, label, function(evt)
				{
					FormTemplate.clickControl(control, evt);
				});
				btn.classList.add('geFormTool');

				if (isEnabled != null)
				{
					var update = function()
					{
						btn.disabled = !isEnabled();
					};

					FormTemplate.observeControl(control, update);
					update();
				}

				tools.appendChild(btn);
				pane.appendChild(tools);

				return btn;
			},
			separator: function()
			{
				var sep = document.createElement('span');
				sep.className = 'geFormToolSep';
				tools.appendChild(sep);
			},
			section: function(name)
			{
				var s = skin.createSection(name, parent);
				card = s.content;

				return s.head;
			},
			append: function(child)
			{
				getCard().appendChild(child);
			},
			row: function(label, control, className)
			{
				return skin.createRow(label, control, className, getCard());
			},
			switchRow: function(label, checkbox, hint)
			{
				return skin.createCheckRow(checkbox, label, hint, getCard());
			},
			hint: function(text)
			{
				return skin.createHint(text, getCard());
			},
			group: function()
			{
				var g = document.createElement('div');
				options.appendChild(g);
				parent = g;
				card = null;

				return g;
			},
			end: function()
			{
				parent = options;
				card = null;
			}};
	},
	/**
	 * Moves the given buttons into the given footer of a shape editor: help
	 * and the other actions on the left, Cancel and the primary on the right
	 * in the order of the theme (cancelFirst).
	 */
	setEditorFooter: function(ui, footer, help, start, cancel, primary, primaryLabel, icon)
	{
		footer.innerHTML = '';
		footer.style.cssText = '';
		footer.className = 'geFormFooter';

		if (help != null)
		{
			footer.appendChild(help);
		}

		for (var i = 0; i < start.length; i++)
		{
			if (start[i] != null)
			{
				start[i].className = 'geBtn';
				start[i].style.cssText = '';
				footer.appendChild(start[i]);
			}
		}

		var gap = document.createElement('span');
		gap.className = 'geFormFooterGap';
		footer.appendChild(gap);

		if (primary != null)
		{
			primary.style.cssText = '';

			if (primaryLabel != null)
			{
				primary.innerHTML = '';
				mxUtils.write(primary, primaryLabel);
			}
		}

		if (cancel != null)
		{
			cancel.style.cssText = '';
		}

		var order = (ui.editor.cancelFirst) ? [cancel, primary] : [primary, cancel];

		for (var i = 0; i < order.length; i++)
		{
			if (order[i] != null)
			{
				footer.appendChild(order[i]);
			}
		}

		return footer;
	},
	/**
	 * Names the dialog of the given content after the headline of the layout
	 * if it was shown before the layout (dialogs that build their content in
	 * init, see Dialog).
	 */
	updateEditorFrame: function(ui, elt)
	{
		var div = elt.parentNode;
		var title = elt.querySelector('.gePreviewHead > h3');

		if (div != null && title != null && div.getAttribute('role') == 'dialog' &&
			div.getAttribute('aria-labelledby') == null)
		{
			if (title.id == '')
			{
				title.id = 'geDialogTitle' + Dialog.titleCount++;
			}

			div.setAttribute('aria-labelledby', title.id);
			div.removeAttribute('aria-label');
		}
	},
	/**
	 * Enter runs the given primary button in the fields and on the canvas.
	 */
	addEnter: function(elt, primary)
	{
		FormTemplate.addEnter(elt, primary);
	},
	/**
	 * Focuses the control that fn returns once the dialog is shown.
	 */
	focusDialog: function(elt, fn)
	{
		FormTemplate.focusDialog(elt, fn);
	},
	/**
	 * Ends a form with its primary button and Cancel (the footer of the
	 * dialog stays as it is).
	 */
	finishForm: function(ui, buttons, primary, cancel)
	{
		buttons.classList.add('geFormButtons');
	},
	/**
	 * Returns the head of a section of the color dialog with the given title.
	 */
	createColorHead: function(title)
	{
		var head = document.createElement('div');
		head.className = 'gePreviewSectionTitle';
		head.setAttribute('role', 'heading');
		head.setAttribute('aria-level', '3');
		mxUtils.write(head, title);

		return head;
	},
	/**
	 * Returns true while the sections of the color dialog in this skin are
	 * shown (the color window outlives a switch of the theme).
	 */
	isColorActive: function()
	{
		return FormTemplate.getSkin() == this;
	},
	/**
	 * The headline of the modal color dialog (pickColorModal) with the name
	 * of the color.
	 */
	addColorTitle: function(ui, dlg, title)
	{
		var h3 = document.createElement('h3');
		mxUtils.write(h3, title);
		dlg.container.insertBefore(h3, dlg.container.firstChild);
	},
	/**
	 * Adds the classes of the given kind of dialog (pageSetup, editData or
	 * markup) to its given content.
	 */
	prepare: function(ui, elt, kind, c)
	{
		elt.classList.add(this.classes.form, this.classes[kind]);

		if (c != null && c.buttons != null)
		{
			c.buttons.classList.add(this.classes.footer);
		}
	},
	/**
	 * Returns the given name of a row with its colon.
	 */
	getLabel: function(text)
	{
		return text + ':';
	},
	/**
	 * Returns the given text (Fusion writes the names of fields in sentence
	 * case).
	 */
	toSentenceCase: function(text)
	{
		return text;
	},
	/**
	 * Returns the given label of a property of Edit Data (with its colon).
	 */
	getDataName: function(text)
	{
		return text;
	},
	/**
	 * Returns the head with the given title and subtitle ({head, title,
	 * subtitle}, subtitle is null if there is no text).
	 */
	createHead: function(title, subtitle)
	{
		var head = document.createElement('div');
		head.className = this.classes.formHead;
		var h3 = document.createElement('h3');
		mxUtils.write(h3, title);
		head.appendChild(h3);
		var sub = this.createSubtitle(subtitle, this.classes.formSubtitle);

		if (sub != null)
		{
			head.appendChild(sub);
		}

		return {head: head, title: h3, subtitle: sub};
	},
	/**
	 * Returns a heading with the given title (the titles of the sections of
	 * the Preview template).
	 */
	createSectionHead: function(title)
	{
		var head = document.createElement('div');
		head.className = 'gePreviewSectionTitle';
		head.setAttribute('role', 'heading');
		head.setAttribute('aria-level', '3');
		mxUtils.write(head, title);

		return head;
	},
	/**
	 * Adds the given heading to the given section: before its card, shown
	 * while the card is shown (Edit Data hides it without properties).
	 */
	addSectionHead: function(head, section)
	{
		section.parentNode.insertBefore(head, section);

		var update = function()
		{
			head.style.display = (section.style.display == 'none') ? 'none' : '';
		};

		update();

		if (window.MutationObserver != null)
		{
			new MutationObserver(update).observe(section, {attributes: true, attributeFilter: ['style']});
		}
	},
	/**
	 * Shows the image of the given Delete of a property, which has its name
	 * (aria-label) and is a button for the keyboard.
	 */
	decorateRemove: function(remove)
	{
		var img = remove.querySelector('img');

		// The name of the button describes it
		if (img != null)
		{
			img.setAttribute('alt', '');
		}
	},
	/**
	 * Adds the given hint of Placeholders to its given row (the checkbox of
	 * the dialog, its label and the help) as the hint of a check row of the
	 * Preview template, which describes the checkbox.
	 */
	decoratePlaceholders: function(row, input, label, hint)
	{
		if (label != null)
		{
			PreviewDialog.labelControl(label, input);
			var h = document.createElement('span');
			h.className = 'geDialogHint gePreviewCheckHint geFormCheckHint';
			h.setAttribute('id', PreviewDialog.createId('geFormCheckHint'));
			mxUtils.write(h, hint);
			row.appendChild(h);
			var ids = mxUtils.trim(input.getAttribute('aria-describedby') || '');
			input.setAttribute('aria-describedby', ((ids.length > 0) ? ids + ' ' : '') + h.id);
		}
	},
	/**
	 * Moves Export (the data as JSON) of Edit Data to the left of the footer.
	 */
	decorateExport: function(btn, buttons)
	{
		btn.classList.add(this.classes.footerStart);
		buttons.insertBefore(btn, buttons.firstChild);
	}
};

/**
 * Returns true if Edit Link and Insert Link show the Form template: the
 * feature linkDialog of Editor.featureDefaults (linkDialog in the
 * configuration and the URL), on in Simple in the web app. The theme Fusion
 * always has it.
 */
Editor.isLinkDialogEnabled = function()
{
	return Editor.isFeatureEnabled('linkDialog');
};

/**
 * Returns true if Save as (and Make a Copy, Move to Folder and the place of
 * an export) show the Form template: the feature saveDialog of
 * Editor.featureDefaults (saveDialog in the configuration and the URL), on in
 * Simple in the web app. The theme Fusion always has it.
 */
Editor.isSaveDialogEnabled = function()
{
	return Editor.isFeatureEnabled('saveDialog');
};

/**
 * Fits the height of the given dialog in the Classic skin to its content
 * after it is shown (the callers of Save as give the height of the dialog of
 * before).
 */
EditorUi.prototype.fitFormOnInit = function(dlg)
{
	var ui = this;
	var init = dlg.init;

	dlg.init = function()
	{
		FormTemplate.skins.classic.fit(ui, dlg.container);

		if (init != null)
		{
			init.apply(this, arguments);
		}
	};
};

/**
 * Lays out the given link dialog on the Form template in the Classic skin
 * where the feature is on (Fusion lays it out in SimpleForms.js). Called at
 * the end of the constructor of LinkDialog.
 */
EditorUi.prototype.installLinkLayout = function(dlg)
{
	if (!this.editor.isChromelessView() && Editor.isLinkDialogEnabled() &&
		FormTemplate.getSkin() == FormTemplate.skins.classic &&
		Object.getPrototypeOf(dlg) == FormTemplate.linkDialogPrototype)
	{
		try
		{
			if (this.createLinkLayout(dlg, FormTemplate.skins.classic) != null)
			{
				this.fitFormOnInit(dlg);
			}
		}
		catch (e)
		{
			EditorUi.debug('EditorUi.installLinkLayout', [this], 'error', [e]);
		}
	}
};

/**
 * Lays out the given Save dialog on the Form template in the Classic skin
 * where the feature is on (Fusion lays it out in SimpleForms.js). Called at
 * the end of the constructor of SaveDialog.
 */
EditorUi.prototype.installSaveLayout = function(dlg)
{
	if (!this.editor.isChromelessView() && Editor.isSaveDialogEnabled() &&
		FormTemplate.getSkin() == FormTemplate.skins.classic)
	{
		try
		{
			if (this.createSaveLayout(dlg, FormTemplate.skins.classic) != null)
			{
				this.fitFormOnInit(dlg);
			}
		}
		catch (e)
		{
			EditorUi.debug('EditorUi.installSaveLayout', [this], 'error', [e]);
		}
	}
};

/**
 * Edit Link on the Form template in the given skin: what the link opens
 * (Page, URL, Action) as a choice, the field of the chosen kind (the URL with
 * Reset, the pages, the action with its summary and Insert or Edit, which
 * opens CustomActionDialog as before), and Open in New Window. Returns the
 * body of the form, or null if the dialog has another structure.
 */
EditorUi.prototype.createLinkLayout = function(dlg, skin)
{
	var ui = this;
	var c = dlg.controls;
	var elt = dlg.container;
	var graph = this.editor.graph;
	var classes = skin.classes;

	// Keeps the previous layout if the dialog has changed
	if (c == null || c.title == null || c.section == null || c.buttons == null ||
		c.link == null || c.title.parentNode != elt)
	{
		return null;
	}

	skin.initForm(this, elt, 'link');

	// The headline and the shape of the link
	var head = document.createElement('div');
	head.className = classes.head;
	elt.replaceChild(head, c.title);
	head.appendChild(c.title);
	var cells = graph.getSelectionCells();

	// Edit Link edits the links of the selection (it passes mixed), Insert
	// Link and the links of text insert a link. A page or an action link
	// leaves the field of the URL empty (the link hint of a label changes
	// such a link), so it is never Insert Link.
	var editing = c.mixed == null && graph.isEditing() && graph.cellEditor.getEditingCell() != null;
	var inserting = c.mixed == null && !editing && c.link.value == '' &&
		!(c.page != null && c.page.checked) && !(c.action != null && c.action.checked);
	var sub = document.createElement('div');
	sub.className = classes.subtitle;

	if (c.mixed != null && cells.length > 0)
	{
		mxUtils.write(sub, skin.getCellsSubtitle(this, graph, cells));
		head.appendChild(sub);
	}
	// A link in the text of a label names the shape, Insert Link the page
	else if (c.mixed == null)
	{
		var target = (editing) ? [graph.cellEditor.getEditingCell()] :
			((!inserting && cells.length > 0) ? cells : null);
		mxUtils.write(sub, (target != null) ? skin.getCellsSubtitle(this, graph, target) :
			skin.getPageSubtitle(this));
		head.appendChild(sub);

		if (inserting && mxUtils.trim(c.title.textContent) == mxResources.get('editLink'))
		{
			c.title.textContent = mxResources.get('insertLink');
		}
	}

	var body = document.createElement('div');
	body.className = classes.linkBody;
	elt.insertBefore(body, c.section);
	c.section.classList.add(classes.replaced);

	// The URL: the field and Reset
	var urlPanel = skin.createPanel();
	var urlCtl = skin.createRow(urlPanel, mxResources.get('url'), c.link, classes.urlRow);
	c.link.setAttribute('aria-label', mxResources.get('url'));

	if (c.cross != null)
	{
		c.cross.style.marginLeft = '';
		c.cross.style.marginRight = '';
		skin.initReset(c.cross);
		c.cross.setAttribute('role', 'button');
		c.cross.setAttribute('aria-label', mxResources.get('reset'));
		urlCtl.appendChild(c.cross);
	}

	body.appendChild(urlPanel);
	var pages = null;

	var fit = function()
	{
		skin.fit(ui, elt);
	};

	// Pages, the action and the choice of the kind only where the dialog
	// has them
	if (c.kinds && c.pages != null && c.page != null && c.action != null)
	{
		var pagePanel = skin.createPanel();
		pages = skin.createPages(this, c, pagePanel);
		body.appendChild(pagePanel);

		var actionPanel = skin.createPanel();
		var actionCtl = skin.createRow(actionPanel, mxResources.get('action'), null, classes.actionRow);

		if (c.actionSummary != null && c.actionButton != null)
		{
			c.actionSummary.style.marginLeft = '';
			c.actionSummary.classList.add(classes.actionSummary);
			actionCtl.appendChild(c.actionSummary);
			c.actionButton.style.marginLeft = '';
			actionCtl.appendChild(c.actionButton);
		}

		body.appendChild(actionPanel);

		var getKind = function()
		{
			return (c.action.checked) ? 'action' : ((c.page.checked) ? 'page' : 'url');
		};

		var panels = {url: urlPanel, page: pagePanel, action: actionPanel};

		var show = function(kind)
		{
			for (var key in panels)
			{
				panels[key].style.display = (key == kind) ? '' : 'none';
			}
		};

		var kinds = skin.addKinds(body, [{value: 'page', label: mxResources.get('page')},
			{value: 'url', label: mxResources.get('url')}, {value: 'action', label: mxResources.get('action')}],
			getKind(), function(v)
			{
				var radio = c[v];
				radio.checked = true;
				radio.dispatchEvent(new Event('change'));
				show(v);
				fit();
			}, mxResources.get('link'));
		show(getKind());

		// The dialog has the height of the tallest kind, so the switch and the
		// buttons stay where they are (decorateSimpleDialog of Fusion). The
		// panel of the chosen kind stays shown, out of the flow, while the
		// others are measured, so a field in it keeps the focus
		elt.simpleFitKinds = function(measure)
		{
			var current = panels[getKind()];
			var height = measure();

			for (var key in panels)
			{
				if (panels[key] != current)
				{
					current.style.position = 'absolute';
					panels[key].style.display = '';
					height = Math.max(height, measure());
					panels[key].style.display = 'none';
					current.style.position = '';
				}
			}

			measure();

			return height;
		};

		// Edit link (the suggestion of Fusion) opens on Page with the next
		// page picked (simpleLinkStartPage); the focus goes to it (init)
		var startPage = ui.simpleLinkStartPage;
		ui.simpleLinkStartPage = null;

		if (startPage != null && pages.pick('data:page/id,' + startPage.getId()))
		{
			kinds.setValue(getKind());
			show(getKind());
		}

		// Typing a URL or picking a page checks its radio (see
		// Dialog.checkRadioOnInput)
		mxEvent.addListener(c.link, 'input', function()
		{
			kinds.setValue(getKind());
		});

		// The pickers of a URL (Select... of the files) check the URL radio
		// with Dialog.checkRadioOnInput, which sets its attribute: the view
		// follows the checked radios
		if (window.MutationObserver != null)
		{
			var observer = new MutationObserver(function()
			{
				var kind = getKind();
				kinds.setValue(kind);

				if (panels[kind].style.display == 'none')
				{
					show(kind);
					fit();
				}
			});

			var radios = [c.url, c.page, c.action];

			for (var i = 0; i < radios.length; i++)
			{
				if (radios[i] != null)
				{
					observer.observe(radios[i], {attributes: true, attributeFilter: ['checked']});
				}
			}
		}
	}

	// Open in New Window
	if (c.newWindow != null)
	{
		skin.addOption(body, c.newWindow, mxResources.get('openInNewWindow'));
	}

	// The primary action is a verb: Apply for Edit Link and the links of
	// text, Insert for Insert Link
	var primary = c.buttons.querySelector('.gePrimaryBtn');

	if (primary != null && mxUtils.trim(primary.textContent) == mxResources.get('ok'))
	{
		primary.textContent = mxResources.get((inserting) ? 'insert' : 'apply');
	}

	// The focus goes to the control of the kind of the link (the dialog
	// focuses the list of pages or the field, which may be hidden)
	var init = dlg.init;

	dlg.init = function()
	{
		if (init != null)
		{
			init.apply(this, arguments);
		}

		var target = c.link;

		if (c.kinds && c.action != null && c.action.checked)
		{
			target = c.actionButton;
		}
		else if (c.kinds && c.page != null && c.page.checked)
		{
			target = (pages != null) ? pages.getFocus() : null;
		}

		if (target != null && target.offsetParent != null)
		{
			target.focus();
		}
	};

	skin.initFooter(c.buttons, elt);

	return body;
};

/**
 * Save as on the Form template in the given skin: the headline (Save as,
 * Make a Copy, Move to Folder or Create) with the file, the name, the format
 * and the places of the dialog (the storages, their recent folders, Pick a
 * Folder, the device, the browser, Download and Open in New Window). The
 * places choose the option of the list of the dialog, which saves as
 * before. Returns the body of the form, or null if the dialog has another
 * structure.
 */
EditorUi.prototype.createSaveLayout = function(dlg, skin)
{
	var c = dlg.controls;
	var elt = dlg.container;
	var classes = skin.classes;

	// Keeps the previous layout if the dialog has changed
	if (c == null || c.table == null || c.name == null || c.storage == null || c.buttons == null ||
		c.save == null || c.table.parentNode != elt)
	{
		return null;
	}

	var file = this.getCurrentFile();
	skin.initForm(this, elt, 'place');
	elt.style.whiteSpace = '';
	elt.style.flexWrap = '';

	var head = document.createElement('div');
	head.className = classes.head;
	// The headline names what the dialog is for: Move to folder (a folder
	// picker), Make a copy (OK), the place of a new file, or Save as
	var h3 = document.createElement('h3');
	mxUtils.write(h3, mxResources.get((c.folderPicker) ? 'moveToFolder' :
		((c.saveLabel == mxResources.get('ok')) ? 'makeCopy' : ((c.defaultMode != null &&
		c.data == null && c.saveLabel == null) ? 'create' : 'saveAs'))));
	head.appendChild(h3);

	// The file, or nothing for a new file that has no title yet
	var sub = skin.createSubtitle(skin.getFileTitle(this, file));

	if (sub != null)
	{
		head.appendChild(sub);
	}

	elt.insertBefore(head, elt.firstChild);
	c.table.classList.add(classes.replaced);

	var body = document.createElement('div');
	body.className = classes.placeBody;
	elt.insertBefore(body, c.table);

	// The picture of an export (its click opened it in a new window, which
	// is a place of the list where popups are allowed)
	if (c.preview != null)
	{
		c.preview.classList.add(classes.replaced);
	}

	// The name (not for a folder picker, whose dialog has no name)
	if (!c.folderPicker)
	{
		c.name.style.width = '';
		skin.createRow(body, mxResources.get('filename'), c.name, classes.filenameRow);
		c.name.setAttribute('aria-label', mxResources.get('filename'));
	}

	// The format as a toggle group of the extensions (up to five) in a skin
	// that has one, else the list of the dialog
	var types = this.editor.diagramFileTypes;

	if (c.type != null && skin.createToggleGroup != null && types != null &&
		types.length > 0 && types.length <= 5)
	{
		var items = [];

		for (var i = 0; i < types.length; i++)
		{
			items.push({value: String(i), label: '.' + types[i].extension,
				title: mxResources.get(types[i].description)});
		}

		var format = skin.createToggleGroup(items, c.type.value, function(v)
		{
			c.type.value = v;
			c.type.dispatchEvent(new Event('change'));
		}, mxResources.get('format'));
		skin.createRow(body, mxResources.get('format'), format, classes.formatRow);

		// The name changes the type without an event (see
		// FilenameDialog.createFileTypes), also after Reset
		var syncFormat = function()
		{
			format.setValue(c.type.value);
		};

		mxEvent.addListener(c.name, 'keyup', syncFormat);
		mxEvent.addListener(c.name, 'change', syncFormat);
		mxEvent.addListener(c.name, 'input', syncFormat);
	}
	else if (c.type != null)
	{
		c.type.style.width = '';
		skin.createRow(body, mxResources.get('format'), c.type);
	}

	// The places of the list of the dialog
	var updatePlaces = skin.createPlaces(this, c, body);

	// The label of Save (the dialog writes it again when the place changes)
	var updatePrimary = function()
	{
		// The primary action is a verb: the dialog says OK for Make a Copy,
		// folder pickers, Download and Open in New Window
		var label = (c.save.lastChild != null && c.save.lastChild.nodeType == mxConstants.NODETYPE_TEXT) ?
			c.save.lastChild : null;

		if (label != null && mxUtils.trim(label.nodeValue) == mxResources.get('ok'))
		{
			label.nodeValue = mxResources.get((c.saveLabel == mxResources.get('ok')) ? 'makeCopy' :
				((c.folderPicker) ? 'move' : ((c.storage.value == 'download') ? 'download' : 'open')));
		}

		skin.decoratePrimary(c.save);
	};

	updatePlaces();
	updatePrimary();

	// The list changes after Pick Folder and Reset
	if (window.MutationObserver != null)
	{
		new MutationObserver(function()
		{
			updatePlaces();
			updatePrimary();
		}).observe(c.storage, {childList: true, subtree: true, attributes: true});
	}

	mxEvent.addListener(c.storage, 'change', function()
	{
		updatePlaces();
		updatePrimary();
	});

	skin.placeReset(c);
	skin.initFooter(c.buttons, elt);

	return body;
};

/**
 * Returns a hint of the unit of a field with the given text.
 */
FormTemplate.createUnit = function(skin, text, hidden)
{
	var hint = document.createElement('span');
	hint.className = skin.classes.unit;

	if (hidden)
	{
		hint.setAttribute('aria-hidden', 'true');
	}

	mxUtils.write(hint, text);

	return hint;
};

/**
 * Lays out the given dialog of the given kind in the Classic skin where its
 * switch is on (Fusion lays them out in SimpleForms.js): Edit Geometry, the
 * polygon and the font at the end of their constructors, Edit Connection
 * Points in its init (it builds its content there), the color dialog at the
 * end of its constructor (EditorUi.decorateColorDialog). args are the
 * arguments of the constructor after the EditorUi. The size of the dialog
 * is set on its content (formTemplateSize, see showDialog).
 */
EditorUi.prototype.installFormTemplate = function(kind, dlg, args)
{
	if (dlg != null && dlg.container != null && FormTemplate.isClassic(this, kind))
	{
		var ui = this;
		var skin = FormTemplate.skins.classic;

		if (FormTemplate.sizes[kind] != null)
		{
			dlg.container.formTemplateSize = FormTemplate.getSize(kind);
		}

		var run = function(fn)
		{
			try
			{
				fn();
			}
			catch (e)
			{
				EditorUi.debug('EditorUi.installFormTemplate', [ui, kind], 'error', [e]);
			}
		};

		if (kind == 'geometry')
		{
			run(function() { ui.createGeometryLayout(dlg, skin); });
		}
		else if (kind == 'connectionPoints')
		{
			var init = dlg.init;

			dlg.init = function()
			{
				var result = init.apply(this, arguments);

				if (dlg.controls != null)
				{
					run(function() { ui.createConnectionPointsLayout(dlg, args[0], skin); });
				}

				return result;
			};
		}
		else if (kind == 'polygon')
		{
			run(function() { ui.createPolygonLayout(dlg, args[0], args[1], skin); });
		}
		else if (kind == 'font')
		{
			run(function() { ui.createFontLayout(dlg, args[2], skin); });
		}
		else if (kind == 'color')
		{
			run(function() { ui.addColorSections(dlg, skin); });
		}
		else if (kind == 'pageSetup')
		{
			run(function() { ui.createPageSetupLayout(dlg, skin); });
		}
		else if (kind == 'editData')
		{
			run(function()
			{
				ui.createEditDataLayout(dlg, skin);
				var c = dlg.controls;

				// Edit Data of the page is the page data (as in Fusion)
				if (dlg.formParts != null && c.graph == ui.editor.graph && c.cells.length == 1 &&
					c.graph.model.isRoot(c.cells[0]))
				{
					ui.createPageDataLayout(dlg, skin);
				}
			});
		}
		else if (kind == 'markup')
		{
			run(function() { ui.createMarkupLayout(dlg, skin); });
		}
	}
};

/**
 * Lays out the given dialog of the given kind (pageSetup, editData or
 * markup) on the Form template in the Classic skin where its switch is on
 * (installFormTemplate; Fusion lays them out in SimpleForms.js and
 * SimpleMoreForms.js). Called at the end of the constructors of
 * PageSetupDialog, EditDataDialog and MarkupDialog of grapheditor (a hook
 * that EditorUi.js of grapheditor defines empty).
 */
EditorUi.prototype.installFormLayout = function(dlg, kind)
{
	this.installFormTemplate(kind, dlg);
};

/**
 * The color dialog in the Classic skin where its switch is on (called at
 * the end of the constructor of ColorDialog): the sections and, in the
 * modal dialog, the headline with the name of the color (pickColorModal).
 */
EditorUi.prototype.decorateColorDialog = function(dlg)
{
	this.installFormTemplate('color', dlg);
	var c = dlg.controls;

	if (dlg.formSections != null && c != null && !c.liveApply && c.buttons != null &&
		c.buttons.parentNode == dlg.container)
	{
		dlg.container.classList.add(FormTemplate.skins.classic.classes.colorDialog);

		if (this.formColorTitle != null)
		{
			FormTemplate.skins.classic.addColorTitle(this, dlg, this.formColorTitle);
		}
	}
};

/**
 * The dialogs of the Classic skin take their size (formTemplateSize of
 * their content, see installFormTemplate).
 */
var formTemplateShowDialog = EditorUi.prototype.showDialog;

EditorUi.prototype.showDialog = function(elt, w, h, modal, closable, onClose, noScroll, transparent,
	minSize, ignoreBgClick, persistenceKey)
{
	if (elt != null && elt.formTemplateSize != null)
	{
		var size = elt.formTemplateSize;
		w = size.width;
		h = size.height;
		minSize = (size.min != null) ? size.min : null;
	}

	return formTemplateShowDialog.call(this, elt, w, h, modal, closable, onClose, noScroll,
		transparent, minSize, ignoreBgClick, persistenceKey);
};

/**
 * The modal color dialog in the Classic skin: the name of the color is its
 * headline (an h3 instead of the bold line above the picker, see
 * decorateColorDialog).
 */
var formTemplatePickColorModal = EditorUi.prototype.pickColorModal;

EditorUi.prototype.pickColorModal = function(color, apply, defaultColor, defaultColorValue,
	singleColorMode, title, cancelFn, allowInherit)
{
	if (FormTemplate.isClassic(this, 'color'))
	{
		this.formColorTitle = (title != null) ? title : mxResources.get('color');

		try
		{
			return formTemplatePickColorModal.call(this, color, apply, defaultColor, defaultColorValue,
				singleColorMode, null, cancelFn, allowInherit);
		}
		finally
		{
			this.formColorTitle = null;
		}
	}
	else
	{
		return formTemplatePickColorModal.apply(this, arguments);
	}
};

/**
 * The color window gets the sections of the Classic skin when it is shown
 * (once, also if it was made in another theme).
 */
var formTemplatePickColor = EditorUi.prototype.pickColor;

EditorUi.prototype.pickColor = function()
{
	var result = formTemplatePickColor.apply(this, arguments);
	this.updateColorWindowSections();

	return result;
};

/**
 * Shows the sections of the Classic skin in the shown color window only
 * while its switch is on in the current theme: the window outlives a switch
 * of the theme without a restart (Simple and Classic), so the class of the
 * sections (classes.color, which all their CSS needs) is toggled when the
 * window is shown and when the theme changes. The sections are added once.
 */
EditorUi.prototype.updateColorWindowSections = function()
{
	var ui = this;
	var wnd = this.colorWindow;

	if (wnd != null && wnd.colorDialog != null && wnd.colorDialog.container != null &&
		wnd.window != null)
	{
		if (!wnd.formThemeListener)
		{
			wnd.formThemeListener = true;

			this.addListener('currentThemeChanged', function()
			{
				ui.updateColorWindowSections();
			});
		}

		if (wnd.window.isVisible())
		{
			var dlg = wnd.colorDialog;
			var skin = FormTemplate.skins.classic;
			var cls = dlg.container.classList;
			var shown = cls.contains(skin.classes.color);

			if (FormTemplate.isClassic(this, 'color'))
			{
				this.addColorSections(dlg, skin);
			}
			else
			{
				cls.remove(skin.classes.color);
			}

			if (shown != cls.contains(skin.classes.color) && typeof wnd.fitHeight === 'function')
			{
				wnd.fitHeight();
			}
		}
	}
};

/**
 * Edit Geometry on the Form template: the shape, then Left, Top, Width,
 * Height and Rotation as rows with their units, and Relative, Dx and Dy in
 * More options, in the given skin.
 */
EditorUi.prototype.createGeometryLayout = function(dlg, skin)
{
	var graph = this.editor.graph;
	var c = dlg.controls;
	var elt = dlg.container;

	// Keeps the previous layout if the dialog has changed
	if (c == null || c.cells == null || c.cells.length == 0 || c.x == null || c.y == null ||
		c.dx == null || c.dy == null || c.width == null || c.height == null || c.rotation == null ||
		c.relative == null || c.relative.parentNode == null)
	{
		return;
	}

	var form = skin.createForm(this, elt, mxResources.get('editGeometry'),
		skin.getCellsSubtitle(this, graph, c.cells));

	if (form == null)
	{
		return;
	}

	elt.classList.add(skin.classes.geometry);

	var field = function(key, input, unit)
	{
		var ctl = form.row(mxResources.get(key), input);
		input.setAttribute('aria-label', mxResources.get(key));
		ctl.appendChild(FormTemplate.createUnit(skin, unit, true));
	};

	field('left', c.x, 'pt');
	field('top', c.y, 'pt');
	field('width', c.width, 'pt');
	field('height', c.height, 'pt');
	field('rotation', c.rotation, '°');

	// More options: relative positions and the offset
	var box = form.more();
	box.appendChild(skin.createSwitchRow(this, c.relative));
	field('dx', c.dx, 'pt');
	field('dy', c.dy, 'pt');

	// Enter on a button presses it (the dialog applies for Enter
	// anywhere else, see EditGeometryDialog)
	mxEvent.addListener(elt, 'keydown', function(evt)
	{
		var source = mxEvent.getSource(evt);

		if (evt.keyCode == 13 && source.nodeName == 'BUTTON')
		{
			evt.preventDefault();
			source.click();
		}
	});
};

/**
 * Returns the list of the points of Edit Connection Points for the given
 * controls of the dialog in the given skin: a row per point in the order of
 * the canvas with its number and position (see formatConnectionPoint). A
 * row selects its point (Shift, Ctrl or Cmd adds or removes it), the bin and
 * Delete remove it. The list is one stop of Tab (the arrow keys, Home and
 * End move in it) and follows the changes and the selection of the canvas.
 */
EditorUi.prototype.createConnectionPointList = function(c, skin)
{
	var graph = c.graph;
	var model = graph.model;
	var classes = skin.classes;
	var list = document.createElement('div');
	list.className = classes.pointList;
	list.setAttribute('role', 'list');
	list.setAttribute('aria-label', mxResources.get('connectionPoints'));
	var points = [];
	var rows = [];
	var current = 0;

	// The row that Tab goes to
	var setCurrent = function(index)
	{
		current = Math.max(0, Math.min(rows.length - 1, index));

		for (var i = 0; i < rows.length; i++)
		{
			rows[i].setAttribute('tabindex', (i == current) ? '0' : '-1');
		}
	};

	var focusRow = function(index)
	{
		if (rows.length > 0)
		{
			setCurrent(index);
			rows[current].focus();
		}
	};

	var remove = function(cell)
	{
		graph.deleteCells([cell]);
	};

	// The list scrolls to the first selected row
	var updateSelection = function()
	{
		var first = null;

		for (var i = 0; i < rows.length; i++)
		{
			var on = graph.isCellSelected(points[i]);
			rows[i].classList.toggle(classes.on, on);
			rows[i].setAttribute('aria-pressed', (on) ? 'true' : 'false');
			first = (on && first == null) ? rows[i] : first;
		}

		if (first != null && list.clientHeight > 0)
		{
			if (first.offsetTop < list.scrollTop)
			{
				list.scrollTop = first.offsetTop;
			}
			else if (first.offsetTop + first.offsetHeight > list.scrollTop + list.clientHeight)
			{
				list.scrollTop = first.offsetTop + first.offsetHeight - list.clientHeight;
			}
		}
	};

	var update = function()
	{
		var focused = list.contains(document.activeElement);
		var parent = graph.getDefaultParent();
		var childCount = model.getChildCount(parent);
		list.textContent = '';
		points = [];
		rows = [];

		for (var i = 0; i < childCount; i++)
		{
			var child = model.getChildAt(parent, i);

			if (child.cp)
			{
				points.push(child);
			}
		}

		if (points.length == 0)
		{
			var hint = document.createElement('div');
			hint.className = classes.editorHint;
			mxUtils.write(hint, mxResources.get('none'));
			list.appendChild(hint);
		}

		for (var i = 0; i < points.length; i++)
		{
			(function(cell, index)
			{
				var item = document.createElement('div');
				item.className = classes.pointRow;
				item.setAttribute('role', 'listitem');

				var text = FormTemplate.formatConnectionPoint(c.getConstraint(cell));
				var btn = document.createElement('button');
				btn.setAttribute('type', 'button');
				btn.className = classes.pointChoice;
				btn.setAttribute('aria-label', mxResources.get('point') + ' ' + (index + 1) + ': ' + text);
				btn.setAttribute('aria-keyshortcuts', 'Delete');
				var number = document.createElement('span');
				number.className = classes.pointNumber;
				mxUtils.write(number, String(index + 1));
				btn.appendChild(number);
				mxUtils.write(btn, text);
				item.appendChild(btn);

				mxEvent.addListener(btn, 'click', function(evt)
				{
					setCurrent(index);

					if (mxEvent.isShiftDown(evt) || mxEvent.isControlDown(evt) || mxEvent.isMetaDown(evt))
					{
						if (graph.isCellSelected(cell))
						{
							graph.removeSelectionCell(cell);
						}
						else
						{
							graph.addSelectionCell(cell);
						}
					}
					else
					{
						graph.setSelectionCell(cell);
					}
				});

				mxEvent.addListener(btn, 'keydown', function(evt)
				{
					var key = evt.key;

					if (key == 'ArrowDown' || key == 'ArrowUp' || key == 'Home' || key == 'End')
					{
						focusRow((key == 'Home') ? 0 : ((key == 'End') ? rows.length - 1 :
							index + ((key == 'ArrowDown') ? 1 : -1)));
						mxEvent.consume(evt);
					}
					else if ((key == 'Delete' || key == 'Backspace') && !mxEvent.isControlDown(evt) &&
						!mxEvent.isMetaDown(evt) && !mxEvent.isAltDown(evt))
					{
						current = index;
						remove(cell);
						mxEvent.consume(evt);
					}
				});

				// The bin for the mouse (Delete for the keyboard)
				var del = skin.createIconButton('trash', mxResources.get('delete'), function()
				{
					current = index;
					remove(cell);
				});
				del.setAttribute('tabindex', '-1');
				del.setAttribute('aria-hidden', 'true');
				item.appendChild(del);

				list.appendChild(item);
				rows.push(btn);
			})(points[i], i);
		}

		setCurrent(current);
		updateSelection();

		// The focus stays in the list (on the row with the number of the
		// removed point or the last row) or goes to Add
		if (focused)
		{
			if (rows.length > 0)
			{
				focusRow(current);
			}
			else if (c.addBtn != null)
			{
				c.addBtn.focus();
			}
		}
	};

	model.addListener(mxEvent.CHANGE, update);
	graph.getSelectionModel().addListener(mxEvent.CHANGE, updateSelection);
	update();

	return list;
};

/**
 * Edit Connection Points (Alt+Shift+K) in the given skin: the shape with its
 * points (drag, double-click, Delete) next to Add points, the list of the
 * points, the selected point and the connectable option.
 */
EditorUi.prototype.createConnectionPointsLayout = function(dlg, cell, skin)
{
	var c = dlg.controls;
	var elt = dlg.container;
	var graph = this.editor.graph;
	var classes = skin.classes;
	var help = c.buttons.querySelector('.geHelpIcon');

	if (c.graphDiv == null || c.graphDiv.parentNode != elt || c.applyBtn == null)
	{
		return;
	}

	var layout = skin.createEditor(this, elt, mxResources.get('editConnectionPoints'),
		skin.getCellsSubtitle(this, graph, [cell]), classes.connectionPoints);

	// The canvas and its tools
	c.graphDiv.style.border = '';
	c.graphDiv.style.borderStyle = '';
	c.graphDiv.style.borderWidth = '';
	c.graphDiv.style.flex = '';
	layout.canvas(c.graphDiv);
	layout.tool('minus', mxResources.get('zoomOut'), c.zoomOutBtn);
	layout.tool('plus', mxResources.get('zoomIn'), c.zoomInBtn);
	layout.tool('fit', mxResources.get('fit'), c.zoomFitBtn);
	layout.separator();

	// Shift+click and double click change the size of the grid
	var gridTool = layout.tool('gridLines', mxResources.get('grid'), c.gridBtn);
	mxEvent.addListener(gridTool, 'dblclick', function(evt)
	{
		c.gridBtn.dispatchEvent(new MouseEvent('dblclick', {bubbles: true}));
		mxEvent.consume(evt);
	});

	var updateGrid = function()
	{
		var on = c.graph.isGridEnabled();
		gridTool.classList.toggle(classes.on, on);
		gridTool.setAttribute('aria-pressed', (on) ? 'true' : 'false');
	};

	mxEvent.addListener(gridTool, 'click', function()
	{
		window.setTimeout(updateGrid, 0);
	});

	// The grid also changes after the prompt of the size (Shift+click,
	// double click)
	var graphSetGridEnabled = c.graph.setGridEnabled;

	c.graph.setGridEnabled = function()
	{
		graphSetGridEnabled.apply(this, arguments);
		updateGrid();
	};

	updateGrid();

	// Delete is enabled with a selection (the dialog sets the opacity)
	layout.tool('trash', mxResources.get('delete'), c.deleteBtn, function()
	{
		return c.graph.getSelectionCount() > 0;
	});

	// Add points: the side, the number and Add
	layout.section(mxResources.get('add'));

	if (skin.toggleGroups)
	{
		var sides = [];

		for (var i = 0; i < c.sideSelect.options.length; i++)
		{
			sides.push({value: c.sideSelect.options[i].value, label: c.sideSelect.options[i].textContent});
		}

		var sideGroup = skin.createChoice(sides, c.sideSelect.value, function(value)
		{
			c.sideSelect.value = value;
			c.sideSelect.dispatchEvent(new Event('change'));
		}, mxResources.get('side'));
		c.sideSelect.classList.add(classes.replaced);
		c.sideSelect.setAttribute('aria-hidden', 'true');
		c.sideSelect.setAttribute('tabindex', '-1');
		layout.row(mxResources.get('side'), sideGroup, classes.rowGroup).appendChild(c.sideSelect);
	}
	else
	{
		// The list of the dialog
		c.sideSelect.style.cssText = '';
		layout.row(mxResources.get('side'), c.sideSelect);
	}

	c.pCount.style.cssText = '';
	var count = layout.row(mxResources.get('points'), c.pCount);
	c.addBtn.style.cssText = '';
	var plus = skin.createIcon('plus');

	if (plus != null)
	{
		c.addBtn.insertBefore(plus, c.addBtn.firstChild);
	}

	count.appendChild(c.addBtn);

	// The points as a list (the dialog reads their constraints)
	if (typeof c.getConstraint === 'function')
	{
		layout.section(skin.getTitle(mxResources.get('connectionPoints')));
		layout.append(this.createConnectionPointList(c, skin));
	}

	// The selected point (shown when one point is selected)
	var point = layout.group();
	point.className = classes.connectionPoint;
	layout.section(mxResources.get('position'));

	var pointRow = function(label, input, unit, offset, offsetUnit)
	{
		input.style.cssText = '';
		offset.style.cssText = '';
		var ctl = layout.row(label, input);
		ctl.appendChild(FormTemplate.createUnit(skin, unit));
		ctl.appendChild(offset);
		offset.setAttribute('aria-label', label + ' (' + offsetUnit + ')');
		ctl.appendChild(FormTemplate.createUnit(skin, offsetUnit));
	};

	pointRow('X', c.xInput, '%', c.dxInput, 'pt');
	pointRow('Y', c.yInput, '%', c.dyInput, 'pt');
	layout.end();

	var updatePoint = function()
	{
		point.style.display = (c.pointPropsDiv.style.visibility == 'hidden') ? 'none' : '';
	};

	FormTemplate.observeControl(c.pointPropsDiv, updatePoint);
	updatePoint();
	c.pointPropsDiv.classList.add(classes.replaced);

	// Options: connectable
	layout.section(mxResources.get('options'));
	layout.switchRow(mxResources.get('connectable'), c.connectableCb);
	layout.hint(mxResources.get('connectionPointsHint'));

	// Head, body and the footer
	c.zoomBtns.classList.add(classes.replaced);
	elt.insertBefore(layout.head, elt.firstChild);
	elt.insertBefore(layout.body, c.buttons);
	c.connectableLabel.parentNode.removeChild(c.connectableLabel);
	skin.setEditorFooter(this, c.buttons, help, [c.resetBtn], c.cancelBtn, c.applyBtn);
	skin.addEnter(elt, c.applyBtn);
	skin.updateEditorFrame(this, elt);

	// The focus starts on the canvas of the dialog (its keys move and
	// delete points, Enter applies)
	skin.focusDialog(elt, function()
	{
		return FormTemplate.getCanvas(c.graph) || c.applyBtn;
	});

	// The canvas has its size now
	window.setTimeout(function()
	{
		c.graph.sizeDidChange();
		c.graph.fit(8);
		c.graph.center();
	}, 0);
};

/**
 * Edit Polygon and Insert Polygon in the given skin: the polygon with its
 * points and handles next to the list of points and the options.
 */
EditorUi.prototype.createPolygonLayout = function(dlg, cell, insertFn, skin)
{
	var c = dlg.controls;
	var elt = dlg.container;
	var graph = this.editor.graph;
	var classes = skin.classes;

	if (c == null || c.svgContainer == null || c.listPanel == null || c.bottomBar == null)
	{
		return;
	}

	var layout = skin.createEditor(this, elt, mxResources.get((insertFn != null) ? 'polygon' : 'editPolygon'),
		(insertFn != null || cell == null) ? skin.getPageSubtitle(this) :
		skin.getCellsSubtitle(this, graph, [cell]), classes.polygon);

	// The canvas and its tools
	c.svgContainer.style.border = '';
	c.svgContainer.style.borderRadius = '';
	c.svgContainer.style.minWidth = '';
	c.svgContainer.style.position = '';
	layout.canvas(c.svgContainer);

	var isEnabled = function(btn)
	{
		return function()
		{
			return btn.style.pointerEvents != 'none';
		};
	};

	layout.tool('undo', mxResources.get('undo'), c.undoBtn, isEnabled(c.undoBtn));
	layout.tool('redo', mxResources.get('redo'), c.redoBtn, isEnabled(c.redoBtn));
	layout.separator();
	layout.tool('minus', mxResources.get('zoomOut'), c.zoomOutBtn);
	layout.tool('plus', mxResources.get('zoomIn'), c.zoomInBtn);
	layout.tool('fit', mxResources.get('fit'), c.zoomFitBtn);

	// The points: the rows of the dialog in the new look (they are built
	// again on each change)
	layout.section(mxResources.get('points'));
	c.listPanel.style.cssText = '';
	c.listPanel.className = classes.polygonPoints;
	layout.append(c.listPanel);

	var updateRows = function()
	{
		var rows = c.listPanel.children;

		for (var i = 0; i < rows.length; i++)
		{
			var row = rows[i];

			// The hint of an empty list is the hint below the points
			// (shown once)
			if (row.getAttribute('data-idx') == null)
			{
				row.className = classes.replaced;
			}
			else if (!row.classList.contains(classes.polygonRow))
			{
				var selected = row.style.backgroundColor != '';
				row.className = classes.polygonRow + ((selected) ? ' ' + classes.on : '');
				row.style.backgroundColor = '';
				row.style.padding = '';
				row.style.gap = '';
				row.style.borderRadius = '';
				row.style.marginBottom = '';
				row.style.fontSize = '';
				row.setAttribute('aria-current', (selected) ? 'true' : 'false');

				var inputs = row.querySelectorAll('input');

				for (var j = 0; j < inputs.length; j++)
				{
					if (inputs[j].type == 'checkbox')
					{
						if (skin.switches)
						{
							inputs[j].setAttribute('role', 'switch');
						}

						inputs[j].setAttribute('aria-label', mxResources.get('curved'));
					}
					else
					{
						inputs[j].style.width = '';
						inputs[j].style.fontSize = '';
						inputs[j].style.padding = '';
						inputs[j].setAttribute('aria-label', inputs[j].title + ' ' + (i + 1));
					}
				}

				// Delete as a button with the icon of the look
				var img = row.querySelector('img');

				if (img != null)
				{
					img.classList.add(classes.replaced);

					(function(img)
					{
						row.appendChild(skin.createIconButton('trash',
							mxResources.get('delete'), function(evt)
						{
							img.click();
						}));
					})(img);
				}
			}
		}
	};

	FormTemplate.observeControl(c.listPanel, updateRows, {childList: true});
	updateRows();
	layout.hint(mxResources.get('clickToAdd'));

	// Options: the grid and the closed path
	layout.section(mxResources.get('options'));
	layout.switchRow(mxResources.get('grid'), c.snapCb);
	layout.switchRow(mxResources.get('closePath'), c.closeCb);

	// Head, body and footer
	c.contentDiv.classList.add(classes.replaced);
	c.bottomBar.classList.add(classes.replaced);
	elt.insertBefore(layout.head, elt.firstChild);
	elt.appendChild(layout.body);
	var footer = document.createElement('div');
	elt.appendChild(footer);
	var trash = skin.createIcon('trash');

	if (trash != null)
	{
		c.deleteAllBtn.insertBefore(trash, c.deleteAllBtn.firstChild);
	}

	skin.setEditorFooter(this, footer, null, [c.deleteAllBtn], c.cancelBtn, c.applyBtn,
		(insertFn != null) ? mxResources.get('insert') : null);
	skin.addEnter(elt, c.applyBtn);

	// Panes smaller than the drawing area (phones) show all points
	var init = dlg.init;

	dlg.init = function()
	{
		init.apply(this, arguments);
		var rect = c.svgContainer.getBoundingClientRect();

		if (rect.width > 0 && rect.height > 0 && (rect.width < 440 || rect.height < 440))
		{
			FormTemplate.clickControl(c.zoomFitBtn);
		}
	};
};

/**
 * Adds the sections of the given skin to the given color dialog (once per
 * skin): the color with its field, the dark color (always shown: Advanced
 * showed only its field and list), Recent (hidden while there are no
 * recent colors), Swatches and Custom (the pad and the slider of the
 * picker). The parts of the dialog are not moved: the sections are an
 * order of CSS and heads, as the color window outlives a switch of the
 * theme.
 */
EditorUi.prototype.addColorSections = function(dlg, skin)
{
	var ui = this;
	var c = dlg.controls;
	var elt = dlg.container;
	var classes = skin.classes;

	// Keeps the previous layout if the dialog has changed
	if (c == null || c.picker == null || c.center == null || c.recent == null ||
		c.picker.parentNode != elt || c.center.parentNode != elt)
	{
		return;
	}

	elt.classList.add(classes.color);

	// Recent is hidden while there are no recent colors (the dialog shows
	// white then), the focus of Reset goes to the swatches
	var updateRecent = function()
	{
		var hide = ColorDialog.recentColors.length == 0;
		var recent = c.recent();
		var focused = hide && recent != null && mxUtils.isAncestorNode(recent, document.activeElement);
		elt.classList.toggle(classes.colorNoRecent, hide);

		if (focused && recent.nextSibling != null && recent.nextSibling.nextSibling != null &&
			recent.nextSibling.nextSibling.querySelector != null)
		{
			var swatch = recent.nextSibling.nextSibling.querySelector('[tabindex="0"]');

			if (swatch != null)
			{
				swatch.focus();
			}
		}
	};

	updateRecent();

	if (dlg[skin.sectionsKey] != null)
	{
		if (skin.updateColorIcons != null)
		{
			skin.updateColorIcons(this, elt);
		}

		return;
	}

	dlg[skin.sectionsKey] = true;

	if (skin.initColorIcons != null)
	{
		skin.initColorIcons(this, elt);
	}

	c.picker.classList.add(classes.colorPad);
	c.wrapper.classList.add(classes.colorCurrent);
	c.center.classList.add(classes.colorPalettes);
	c.inherit.classList.add(classes.colorInherit);

	if (c.dark != null)
	{
		c.dark.classList.add(classes.colorDark);
	}

	// The dark color is always shown (CSS, also after the window is reused
	// for a color without a dark color, where the dialog hides the row and
	// the swap, copy and opacity): Advanced, which showed only its field and
	// list, is hidden and its row has no click of its own
	if (c.advanced != null && c.advanced.firstChild != null &&
		c.advanced.firstChild.nodeName == 'SPAN')
	{
		c.advanced.classList.add(classes.colorAdvanced);
		c.advanced.firstChild.classList.add(classes.colorAdvancedToggle);
	}

	// Recent and Swatches: heads in the palettes (the table of the recent
	// colors is replaced in place when they change)
	var recent = c.recent();

	if (recent != null && recent.parentNode == c.center)
	{
		var head = skin.createColorHead(mxResources.get('recent'));
		head.classList.add(classes.colorHead, classes.colorRecentHead);
		c.center.insertBefore(head, recent);

		if (window.MutationObserver != null)
		{
			new MutationObserver(function()
			{
				if (skin.isColorActive())
				{
					updateRecent();
				}
			}).observe(c.center, {childList: true});
		}

		var next = recent.nextSibling;

		if (next != null)
		{
			head = skin.createColorHead(mxResources.get('swatches'));
			head.classList.add(classes.colorHead);
			c.center.insertBefore(head, next);
		}
	}

	// Custom: a head for the pad and the slider of the picker (for the
	// pointer only, the field and the system picker are the accessible way),
	// which are always shown. The head follows the palettes in the DOM,
	// where the order of CSS shows it.
	var customHead = skin.createColorHead(mxResources.get('custom'));
	customHead.classList.add(classes.colorHead, classes.colorCustomHead);
	elt.insertBefore(customHead, c.center.nextSibling);

	// The skin may give the pad the width of the dialog
	if (skin.getColorPadWidth != null && dlg.picker != null && dlg.picker.setPadWidth != null &&
		typeof window.ResizeObserver === 'function')
	{
		new ResizeObserver(function()
		{
			var cs = window.getComputedStyle(elt);
			var w = elt.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);

			if (w > 0)
			{
				dlg.picker.setPadWidth(skin.getColorPadWidth(w));
			}
		}).observe(elt);
	}
};

/**
 * The custom font (FontDialog) on the Form template in the given skin: the
 * kind of the font (system, Google or web font) as a choice that checks the
 * radios of the dialog, the name and the URL of the chosen kind, and a
 * preview of the font.
 */
EditorUi.prototype.createFontLayout = function(dlg, curType, skin)
{
	var ui = this;
	var graph = this.editor.graph;
	var elt = dlg.container;
	var c = dlg.controls;
	var classes = skin.classes;

	if (c == null || c.title == null || c.sections == null || c.buttons == null)
	{
		return;
	}

	var cells = (graph.isEditing()) ? [graph.cellEditor.getEditingCell()] : graph.getSelectionCells();
	var form = skin.createForm(this, elt, mxUtils.trim(c.title.textContent),
		(cells.length > 0 && cells[0] != null) ? skin.getCellsSubtitle(this, graph, cells) :
		skin.getPageSubtitle(this));

	// Keeps the previous layout if the dialog has changed
	if (form == null || c.buttons != form.buttons)
	{
		return;
	}

	elt.classList.add(classes.font);
	elt.simpleFitContent = true;
	elt.style.paddingBottom = '';

	// The sections of the dialog are replaced (the title is the first
	// child, see createForm)
	for (var i = 0; i < c.sections.length; i++)
	{
		c.sections[i].classList.add(classes.replaced);
	}

	// The kinds that the dialog shows
	var kinds = [{value: 's', label: mxResources.get('sysFonts'), radio: c.system, name: c.systemName}];

	if (c.sections[1].parentNode == elt)
	{
		kinds.push({value: 'g', label: mxResources.get('googleFonts'), radio: c.google, name: c.googleName});
	}

	if (c.sections[2].parentNode == elt)
	{
		kinds.push({value: 'w', label: mxResources.get('webfonts'), radio: c.web, name: c.webName});
	}

	var getKind = function()
	{
		for (var i = 0; i < kinds.length; i++)
		{
			if (kinds[i].radio.checked)
			{
				return kinds[i];
			}
		}

		return kinds[0];
	};

	var group = null;
	var nameRows = [];

	// The kind, the name of each kind (one shown) and the URL of web fonts
	if (kinds.length > 1)
	{
		group = skin.createChoice(kinds, null, function(value)
		{
			for (var i = 0; i < kinds.length; i++)
			{
				if (kinds[i].value == value)
				{
					kinds[i].radio.checked = true;
				}
			}

			show();
			getKind().name.focus();
		}, mxResources.get('type'));

		var groupRow = form.row(mxResources.get('type'), group, classes.rowGroup);

		if (classes.rowGroup != null)
		{
			groupRow.parentNode.classList.add(classes.rowGroup);
		}
	}

	for (var i = 0; i < kinds.length; i++)
	{
		kinds[i].name.style.border = '';
		nameRows.push(form.row(mxResources.get('name'), kinds[i].name).parentNode);
	}

	var urlRow = (kinds[kinds.length - 1].value == 'w') ?
		form.row(mxResources.get('url'), c.webUrl).parentNode : null;

	// The preview: the name and a sample in the font
	var pane = document.createElement('div');
	pane.className = classes.fontPreview;
	pane.setAttribute('aria-hidden', 'true');
	var sample = document.createElement('div');
	sample.className = classes.fontSample;
	pane.appendChild(sample);
	var sample2 = document.createElement('div');
	sample2.className = classes.fontSample2;
	mxUtils.write(sample2, FormTemplate.fontSample);
	pane.appendChild(sample2);
	form.body.appendChild(pane);
	var caption = document.createElement('div');
	caption.className = classes.fontCaption;
	mxUtils.write(caption, mxResources.get('preview'));
	form.body.appendChild(caption);

	// Fonts of the preview are loaded into the dialog (not into the
	// document or exports, see Graph.addFont), one at a time
	var fonts = Object.create(null);
	var current = null;

	var setFont = function(key)
	{
		if (current != null && current != key)
		{
			var entry = fonts[current];

			if (entry != null && entry.elt != null && entry.elt.parentNode != null)
			{
				entry.elt.parentNode.removeChild(entry.elt);
			}

			delete fonts[current];
		}

		current = key;
	};

	var updatePreview = function()
	{
		var kind = getKind();
		var fontName = mxUtils.trim(kind.name.value);
		sample.textContent = (fontName.length > 0) ? fontName : mxResources.get('font');
		var family = (fontName.length > 0) ? '"' + Graph.escapeCssString(fontName) + '", ' : '';
		var url = null;

		if (kind.value == 'g')
		{
			url = Editor.GOOGLE_FONTS + encodeURIComponent(fontName).replace(/%20/g, '+');
		}
		else if (kind.value == 'w')
		{
			url = mxUtils.trim(c.webUrl.value);
		}

		if (url != null && fontName.length > 0 && urlParams['lockdown'] != '1' &&
			FormTemplate.isFontPreviewUrl(url) &&
			Graph.customFontElements[fontName.toLowerCase()] == null)
		{
			setFont(fontName.toLowerCase());
			Graph.addFont(fontName, url, null, fonts);
			var entry = fonts[current];

			if (entry != null && entry.elt != null && entry.elt.parentNode != pane)
			{
				pane.appendChild(entry.elt);
			}
		}
		else
		{
			setFont(null);
		}

		// Each kind has its own name, the fallback is the font of the UI
		pane.style.fontFamily = family + skin.fontFallback;
	};

	var thread = null;

	var schedule = function()
	{
		window.clearTimeout(thread);
		thread = window.setTimeout(function()
		{
			// Not after the dialog is closed
			if (document.body.contains(elt))
			{
				updatePreview();
			}
		}, skin.getPreviewDelay());
	};

	var showRows = function(kind)
	{
		for (var i = 0; i < kinds.length; i++)
		{
			nameRows[i].style.display = (kinds[i] == kind) ? '' : 'none';
		}

		if (urlRow != null)
		{
			urlRow.style.display = (kind.value == 'w') ? '' : 'none';
		}
	};

	// The rows of the given kind (Web fonts has the row of the URL)
	var getRows = function(kind)
	{
		var rows = [nameRows[mxUtils.indexOf(kinds, kind)]];

		if (urlRow != null && kind.value == 'w')
		{
			rows.push(urlRow);
		}

		return rows;
	};

	// The dialog has the height of the tallest kind, so the switch and the
	// buttons stay where they are (decorateSimpleDialog of Fusion). The rows
	// of the chosen kind stay shown, out of the flow, while the others are
	// measured, so a field in them keeps the focus
	elt.simpleFitKinds = function(measure)
	{
		var kind = getKind();
		var current = getRows(kind);
		var height = measure();

		var setStyle = function(rows, key, value)
		{
			for (var i = 0; i < rows.length; i++)
			{
				rows[i].style[key] = value;
			}
		};

		for (var i = 0; i < kinds.length; i++)
		{
			if (kinds[i] != kind)
			{
				var rows = getRows(kinds[i]);
				setStyle(current, 'position', 'absolute');
				setStyle(rows, 'display', '');
				height = Math.max(height, measure());
				setStyle(rows, 'display', 'none');
				setStyle(current, 'position', '');
			}
		}

		measure();

		return height;
	};

	var show = function()
	{
		var kind = getKind();
		showRows(kind);

		if (group != null)
		{
			group.setValue(kind.value);
		}

		updatePreview();
		skin.fit(ui, elt);
	};

	for (var i = 0; i < kinds.length; i++)
	{
		mxEvent.addListener(kinds[i].name, 'input', schedule);
	}

	mxEvent.addListener(c.webUrl, 'input', schedule);

	// The kind of the font before init checks its radio
	var initial = (curType == 'g' || (curType == 'w' && Editor.enableWebFonts)) ? curType : 's';

	for (var i = 0; i < kinds.length; i++)
	{
		if (kinds[i].value == initial)
		{
			kinds[i].radio.checked = true;
		}
	}

	show();

	// Init checks the radio of the font and focuses its name
	var init = dlg.init;

	dlg.init = function()
	{
		init.apply(this, arguments);
		show();
	};

	skin.finishForm(this, c.buttons, c.apply, c.cancel);
};

/**
 * The height that the head of the form adds to the dialogs of the given kind
 * in the Classic skin, whose callers give the height of the dialogs of
 * before (Edit Data had no headline, Edit Tooltip and Edit Note no subtitle;
 * the page data of Edit Data adds the choice, the name and the tags of the
 * page, so its properties keep their room).
 */
FormTemplate.headHeight = {editData: 64, markup: 20, pageData: 160};

(function()
{
	/**
	 * Edit Data, Edit Tooltip and Edit Note on the form in the Classic skin are
	 * higher by their head, so their fields keep the height of before. Their
	 * saved size (persistenceKey) is the size of the dialog of before, which
	 * Classic and the switch off share with the form: the form adds its head
	 * to the saved height and saves its height without the head.
	 */
	var editorUiShowDialog = EditorUi.prototype.showDialog;

	EditorUi.prototype.showDialog = function(elt, w, h, modal, closable, onClose, noScroll, transparent, minSize,
		ignoreBgClick, persistenceKey)
	{
		var args = arguments;
		var cls = FormTemplate.skins.classic.classes;
		var extra = 0;

		if (h != null && elt != null && elt.nodeType == mxConstants.NODETYPE_ELEMENT &&
			elt.classList.contains(cls.form))
		{
			extra = (elt.classList.contains(cls.editData)) ? ((elt.classList.contains(
				FormTemplate.skins.classic.pageData.classes.pageData)) ? FormTemplate.headHeight.pageData :
				FormTemplate.headHeight.editData) : ((elt.classList.contains(cls.markup)) ?
				FormTemplate.headHeight.markup : 0);

			if (extra > 0)
			{
				args = Array.prototype.slice.call(arguments);
				args[2] = h + extra;

				if (minSize != null)
				{
					args[8] = new mxRectangle(minSize.x, minSize.y, minSize.width, minSize.height + extra);
				}
			}
		}

		var result = editorUiShowDialog.apply(this, args);
		var dlg = this.dialog;

		// The dialog has a saved size where showDialog installed onResize
		if (extra > 0 && persistenceKey != null && minSize != null && dlg != null &&
			dlg.container != null && typeof dlg.onResize === 'function' &&
			typeof mxSettings !== 'undefined' && mxSettings.getWindowState != null)
		{
			var state = mxSettings.getWindowState(persistenceKey);

			if (state != null && state.w != null && state.h != null)
			{
				dlg.container.style.height = (Math.max(minSize.height, state.h) + extra) + 'px';
			}

			var onResize = dlg.onResize;

			dlg.onResize = function(newW, newH)
			{
				onResize.call(this, newW, newH - extra);
			};
		}

		return result;
	};
})();

/**
 * Returns the names of the data of the cells of the page of the given
 * graph by the number of cells that have them (the most first), without
 * the given names, the reserved ones and the tags and settings of the
 * page. Looks at the first 2000 cells.
 */
EditorUi.prototype.getFormDataNames = function(graph, without)
{
	var counts = {};
	var names = [];
	var seen = 0;
	var cells = graph.model.cells;
	var root = graph.model.getRoot();

	for (var id in cells)
	{
		if (seen++ > 2000)
		{
			break;
		}

		var value = (cells[id] != null) ? cells[id].value : null;

		if (mxUtils.isNode(value) && value.attributes != null)
		{
			for (var i = 0; i < value.attributes.length; i++)
			{
				var name = value.attributes[i].nodeName;

				if (!Graph.isReservedDataName(name) && !Graph.isDataSourceBaseAttribute(name) &&
					mxUtils.indexOf(without, name) < 0 && (cells[id] != root || (name != 'tags' &&
					mxUtils.indexOf(FormTemplate.pageSettingNames, name) < 0)))
				{
					if (counts['$' + name] == null)
					{
						counts['$' + name] = 0;
						names.push(name);
					}

					counts['$' + name]++;
				}
			}
		}
	}

	names.sort(function(a, b)
	{
		return counts['$' + b] - counts['$' + a];
	});

	return names;
};

/**
 * Enter runs the given primary button of a form (concept 13.1) in fields,
 * selects, switches and checkboxes; not in text areas, rich text, buttons
 * and links, not with a modifier key and not while an input method
 * composes. ignore returns true for controls that use Enter themselves.
 * The field is committed first, so its change and blur listeners (limits,
 * custom sizes) run before the primary button. The optional function before
 * runs first (Background skips the change of its URL there, as Apply loads
 * the image itself, see BackgroundImageDialog.addEnter). The Enter of the
 * shape editors, Edit Geometry and the custom font is FormTemplate.addEnter.
 */
EditorUi.prototype.addFormEnter = function(elt, primary, ignore, before)
{
	var buttons = ['button', 'submit', 'reset', 'file', 'image'];

	mxEvent.addListener(elt, 'keydown', function(evt)
	{
		var source = mxEvent.getSource(evt);
		var type = (source.nodeName == 'INPUT') ? String(source.getAttribute('type') || 'text').toLowerCase() : null;

		if (evt.keyCode == 13 && !evt.isComposing && !evt.defaultPrevented && !mxEvent.isConsumed(evt) &&
			!mxEvent.isControlDown(evt) && !mxEvent.isMetaDown(evt) && !mxEvent.isAltDown(evt) &&
			!mxEvent.isShiftDown(evt) && primary != null && !primary.disabled &&
			(source.nodeName == 'SELECT' || (type != null && mxUtils.indexOf(buttons, type) < 0)) &&
			(ignore == null || !ignore(source)))
		{
			if (before != null)
			{
				before();
			}

			if (document.activeElement == source && typeof source.blur === 'function')
			{
				source.blur();
			}

			if (!primary.disabled)
			{
				primary.click();
			}

			mxEvent.consume(evt);
		}
	});
};

/**
 * Moves the focus to the given control of a form once the dialog is shown,
 * unless the dialog has focused one of its controls. If touch is true, a
 * coarse pointer leaves the focus to the dialog itself (see touchFocus of
 * the Classic skin and EditorUi.focusDialogStart, which runs after this).
 */
EditorUi.prototype.focusForm = function(elt, target, touch)
{
	window.setTimeout(function()
	{
		if (target != null && elt.parentNode != null && target.offsetParent != null &&
			(document.activeElement == null || !elt.contains(document.activeElement)) &&
			!(touch && window.matchMedia != null && window.matchMedia('(pointer: coarse)').matches))
		{
			target.focus();
		}
	}, 0);
};

/**
 * Page setup on the Form template in the given skin: Paper (size and
 * orientation), Background (the color or image of the page, changed in its
 * dialog), Grid (its size), then More options (adaptive colors, drawing
 * scale, initial view, the text alternative of the page and, in skins with
 * pageActions, the animation, the style rules and the data sources of the
 * page). Fusion has style rules, data sources and animation in the page
 * view of its panel (Data and rules), so its form does not repeat them.
 */
EditorUi.prototype.createPageSetupLayout = function(dlg, skin)
{
	var ui = this;
	var graph = this.editor.graph;
	var cls = skin.classes;
	var c = dlg.controls;
	var elt = dlg.container;
	var portrait = (c != null && c.paper != null) ? c.paper.querySelector('input[value="portrait"]') : null;
	var landscape = (c != null && c.paper != null) ? c.paper.querySelector('input[value="landscape"]') : null;
	var paperSelect = (c != null && c.paper != null) ? c.paper.querySelector('select') : null;

	// Keeps the previous layout if the dialog has changed
	if (c == null || c.paper == null || c.gridSize == null || c.background == null ||
		portrait == null || landscape == null || paperSelect == null)
	{
		return;
	}

	var form = skin.createForm(this, elt, mxResources.get('pageSetup'), FormTemplate.getPageSubtitle(this));

	if (form == null)
	{
		return;
	}

	elt.classList.add(cls.pageSetup);

	// The buttons of the dialog in the footer of the form (Classic)
	if (cls.footer != null)
	{
		form.buttons.classList.add(cls.footer);
	}

	// Paper: size (and the custom size) and orientation
	form.section(mxResources.get('paper'));
	c.paper.classList.add(cls.paper);
	c.paper.style.marginLeft = '';
	form.row(mxResources.get('size'), c.paper);
	paperSelect.setAttribute('aria-label', mxResources.get('paperSize'));
	portrait.parentNode.classList.add(cls.replaced);

	var orientation = skin.createChoice([{value: 'portrait', label: mxResources.get('portrait')},
		{value: 'landscape', label: mxResources.get('landscape')}], (landscape.checked) ? 'landscape' : 'portrait',
		function(v)
		{
			var radio = (v == 'landscape') ? landscape : portrait;
			radio.checked = true;
			radio.dispatchEvent(new Event('change'));
		}, mxResources.get('orientation'));
	var orientationRow = form.row(mxResources.get('orientation'), orientation, cls.orientation).parentNode;

	var updatePaper = function()
	{
		orientation.setValue((landscape.checked) ? 'landscape' : 'portrait');

		// Custom sizes have no orientation (as in the dialog)
		orientationRow.style.display = (paperSelect.value == 'custom') ? 'none' : '';
	};

	// The select of the paper consumes its change events (see
	// PageSetupDialog.addPageFormatPanel), the radios and fields bubble
	mxEvent.addListener(paperSelect, 'change', updatePaper);
	mxEvent.addListener(c.paper, 'change', updatePaper);
	updatePaper();

	// Background: the color and the image of the page, changed in their dialog
	form.section(mxResources.get('background'));
	var bg = document.createElement('div');
	bg.className = cls.pageBackground;
	var swatch = document.createElement('span');
	swatch.className = cls.swatch;
	swatch.setAttribute('aria-hidden', 'true');
	bg.appendChild(swatch);
	var bgText = document.createElement('span');
	bgText.className = cls.pageBackgroundText;
	bg.appendChild(bgText);
	c.background.style.margin = '';
	bg.appendChild(c.background);
	form.row(mxResources.get('background'), bg, cls.rowGroup);

	var updateBackground = function(color, image)
	{
		var none = color == null || color == mxConstants.NONE;
		swatch.style.backgroundColor = (none) ? '' : mxUtils.getLightDarkColor(color).cssText;
		swatch.classList.toggle(cls.none, none);
		var text = (none) ? mxResources.get('none') : color;

		if (image != null)
		{
			text = PreviewDialog.joinList([text, mxResources.get('image')]);
		}

		bgText.textContent = text;
	};

	updateBackground(graph.background, graph.backgroundImage);

	// Follows the choice in the dialog of the background while the form is
	// open (the callback of the dialog keeps the new values for Apply)
	var showBackgroundImageDialog = this.showBackgroundImageDialog;
	var own = Object.prototype.hasOwnProperty.call(this, 'showBackgroundImageDialog');

	this.showBackgroundImageDialog = function(apply, img, color, showColor, gradient)
	{
		var args = Array.prototype.slice.call(arguments);
		args[0] = function(image, failed, newColor)
		{
			apply.apply(this, arguments);
			updateBackground(newColor, (failed) ? img : image);
		};

		return showBackgroundImageDialog.apply(this, args);
	};

	var restore = function(sender, evt)
	{
		var d = evt.getProperty('dialog');

		if (d != null && d.container != null && d.container.firstChild == elt)
		{
			if (own)
			{
				ui.showBackgroundImageDialog = showBackgroundImageDialog;
			}
			else
			{
				delete ui.showBackgroundImageDialog;
			}

			ui.editor.removeListener(restore);
		}
	};

	this.editor.addListener('hideDialog', restore);

	// Grid: its size in the unit of the diagram
	form.section(mxResources.get('grid'));
	var gridCtl = form.row(mxResources.get('size'), c.gridSize);
	c.gridSize.setAttribute('aria-label', skin.toSentenceCase(mxResources.get('gridSize')));
	c.gridSize.style.marginLeft = '';

	if (c.gridUnit != null)
	{
		c.gridUnit.className = cls.hint;
		c.gridUnit.style.marginLeft = '';
		gridCtl.appendChild(c.gridUnit);
	}

	// More options: adaptive colors, drawing scale, initial view, alt text
	form.more();

	if (c.adaptive != null)
	{
		c.adaptive.style.marginLeft = '';
		var adaptiveCtl = form.row(mxResources.get('adaptiveColors'), c.adaptive);

		if (c.adaptiveHelp != null)
		{
			c.adaptiveHelp.style.marginLeft = '';
			adaptiveCtl.appendChild(c.adaptiveHelp);
		}
	}

	if (c.scale != null)
	{
		var scaleCtl = form.row(mxResources.get('drawingScale'), null);

		if (c.scalePrefix != null)
		{
			c.scalePrefix.className = cls.hint;
			c.scalePrefix.style.marginLeft = '';
			scaleCtl.appendChild(c.scalePrefix);
		}

		scaleCtl.appendChild(c.scale);
		c.scale.setAttribute('aria-label', mxResources.get('drawingScale'));
	}

	if (c.view != null)
	{
		c.view.style.marginLeft = '';
		c.view.classList.add(cls.pageView);
		form.row(mxResources.get('initialView'), c.view, cls.rowTop);
	}

	// The text alternative of the page (EditorUi.addPageSetupOptions)
	var alt = (c.options != null) ? c.options.querySelector('textarea') : null;

	if (alt != null)
	{
		alt.style.marginLeft = '';
		form.row(mxResources.get('altText'), alt, cls.rowTop);
	}

	// The animation, the style rules and the data sources of the page (their
	// buttons open their dialogs, see PageSetupDialog)
	if (skin.pageActions && c.actions != null)
	{
		for (var i = 0; i < c.actions.length; i++)
		{
			if (c.actions[i].content != c.view)
			{
				c.actions[i].content.style.marginLeft = '';
				c.actions[i].content.classList.add(cls.pageView);
				form.row(mxResources.get(c.actions[i].name), c.actions[i].content, cls.rowTop);
			}
		}
	}

	// Enter applies (concept 13.1), the focus starts on the paper
	this.addFormEnter(elt, form.buttons.querySelector('.gePrimaryBtn'));
	this.focusForm(elt, paperSelect, skin.touchFocus);
};

/**
 * Edit Data on the Form template in the given skin (mockup 10): the
 * headline and what it edits, the ID with Copy, the properties as rows of a
 * name, the value and Delete, one field to add a property with the common
 * names as its suggestions (calm variant, Part E), the placeholders with a
 * hint, and Export (the data as JSON) on the left of the footer.
 */
EditorUi.prototype.createEditDataLayout = function(dlg, skin)
{
	var ui = this;
	var cls = skin.classes;
	var c = dlg.controls;
	var elt = dlg.container;

	// Keeps the previous layout if the dialog has changed
	if (c == null || c.properties == null || c.propsSection == null || c.addSection == null ||
		c.nameInput == null || c.addButton == null || c.buttons == null || c.applyButton == null)
	{
		return;
	}

	var graph = c.graph;
	var cells = c.cells;
	var cell = cells[0];
	var model = graph.getModel();
	skin.prepare(this, elt, 'editData', c);

	// The headline and what is edited: the page, a shape or the selection
	var subtitle = null;

	if (cells.length > 1)
	{
		var vertices = 0;

		for (var i = 0; i < cells.length; i++)
		{
			vertices += (model.isVertex(cells[i])) ? 1 : 0;
		}

		subtitle = FormTemplate.getCountText(vertices, cells.length - vertices);
	}
	else if (model.isRoot(cell) || model.getParent(cell) == null)
	{
		subtitle = FormTemplate.getPageSubtitle(this);
	}
	// A layer (Layers › Edit Data)
	else if (model.getParent(cell) == model.getRoot())
	{
		var layerName = mxUtils.trim(graph.getPlainLabel(cell, 40) || '');
		subtitle = (layerName.length > 0) ? PreviewDialog.joinList([layerName, mxResources.get('layer')]) :
			mxResources.get('layer');
	}
	// The data of the diagram (File › Properties › Edit Data)
	else if (graph != this.editor.graph)
	{
		// A new file has no title until it is saved
		subtitle = FormTemplate.getFileTitle(this.getCurrentFile()) || mxResources.get('diagram');
	}
	else
	{
		var label = mxUtils.trim(graph.getPlainLabel(cell, 40) || '');
		var type = graph.getCellTypeName(cell);
		subtitle = (label.length > 0 && label != type) ? PreviewDialog.joinList([label, type]) : type;
	}

	var head = document.createElement('div');
	head.className = cls.formHead;
	var h3 = document.createElement('h3');
	mxUtils.write(h3, mxResources.get('editData'));
	head.appendChild(h3);
	var sub = document.createElement('div');
	sub.className = cls.formSubtitle;
	mxUtils.write(sub, subtitle);
	head.appendChild(sub);
	elt.insertBefore(head, elt.firstChild);

	// The ID with Copy (a double click edits it, as before)
	if (c.id != null && c.idSection != null)
	{
		var idRow = document.createElement('div');
		idRow.className = cls.row + ' ' + cls.idRow;
		var idLabel = document.createElement('label');

		if (cls.label != null)
		{
			idLabel.className = cls.label;
		}

		mxUtils.write(idLabel, skin.getLabel(mxResources.get('id')));
		idRow.appendChild(idLabel);
		var idCtl = document.createElement('div');
		idCtl.className = cls.control;
		idRow.appendChild(idCtl);
		c.id.classList.add(cls.id);
		c.id.style.cursor = '';
		idCtl.appendChild(c.id);

		if (navigator.clipboard != null && typeof navigator.clipboard.writeText === 'function')
		{
			idCtl.appendChild(skin.createIconButton('copy', mxResources.get('copy'), function()
			{
				navigator.clipboard.writeText(c.id.textContent).then(function()
				{
					ui.announce(mxResources.get('copiedToClipboard'));
				}, function()
				{
					// ignore
				});
			}));
		}

		// The row stays in the card of the ID or replaces it
		if (skin.cards)
		{
			c.idSection.replaceChild(idRow, c.idSection.firstChild);
		}
		else
		{
			c.idSection.parentNode.replaceChild(idRow, c.idSection);
		}
	}

	// Properties: the rows of the dialog, restyled as they are added
	var heading = skin.createSectionHead(mxResources.get('properties'));

	if (skin.cards)
	{
		skin.addSectionHead(heading, c.propsSection);
	}
	else
	{
		c.propsSection.insertBefore(heading, c.propsSection.firstChild);
	}

	c.propsSection.classList.add(cls.props);

	var updateRow = function(row)
	{
		if (row.nodeType != mxConstants.NODETYPE_ELEMENT || row.classList.contains(cls.dataRow))
		{
			return;
		}

		row.classList.add(cls.dataRow);
		var name = row.querySelector('.geDialogFormLabel');
		var text = row.querySelector('textarea');
		var remove = row.querySelector('a.geButton');
		var plain = (name != null) ? name.textContent.replace(/:$/, '') : null;

		if (name != null)
		{
			name.textContent = skin.getDataName(name.textContent);
			name.setAttribute('title', plain);
		}

		if (text != null)
		{
			if (skin.dataRows != null)
			{
				text.setAttribute('rows', (text.value.indexOf('\n') >= 0) ? '3' : String(skin.dataRows));
			}

			if (name != null)
			{
				text.setAttribute('aria-label', plain);
			}
		}

		if (remove != null)
		{
			remove.classList.add(cls.remove);
			skin.decorateRemove(remove);
			remove.setAttribute('role', 'button');
			remove.setAttribute('tabindex', '0');
			remove.setAttribute('aria-label', mxResources.get('delete') +
				((name != null) ? ' ' + plain : ''));

			mxEvent.addListener(remove, 'keydown', function(evt)
			{
				// Ctrl+Enter applies the dialog (see EditDataDialog)
				if ((evt.key == 'Enter' || evt.key == ' ') && !mxEvent.isControlDown(evt) &&
					!evt.metaKey && !evt.altKey)
				{
					remove.click();
					mxEvent.consume(evt);
				}
			});
		}
	};

	for (var i = 0; i < c.properties.children.length; i++)
	{
		updateRow(c.properties.children[i]);
	}

	if (window.MutationObserver != null)
	{
		new MutationObserver(function(records)
		{
			for (var i = 0; i < records.length; i++)
			{
				for (var j = 0; j < records[i].addedNodes.length; j++)
				{
					updateRow(records[i].addedNodes[j]);
				}
			}

			updateSuggestions();

			// The dialog grows and shrinks with its rows
			if (ui.dialog != null && ui.dialog.container.firstChild == elt &&
				ui.dialog.simpleFit != null)
			{
				ui.dialog.simpleFit(true);
			}
		}).observe(c.properties, {childList: true});
	}

	// Add a property: one field (mockup 10, calm variant, Part E) with the
	// common names as its suggestions (tooltip, link and the names of the
	// page); Enter or the button after it adds the property. In skins that
	// replace Add Property (Fusion) the field starts with the names of the
	// rows and its plus is in the column of their Remove (the driver, 12
	// November 2026: all left edges in one line), and Add Property of the
	// dialog stays hidden and does the work
	c.addSection.classList.add(cls.dataAdd);
	var addRow = c.nameInput.parentNode;

	// A suggestion picked from the list fires only input, the dialog
	// enables Add Property on keyup and change: enables it for every value,
	// so the button and Enter add a picked name
	var updateAdd = function()
	{
		if (c.nameInput.value.length > 0)
		{
			c.addButton.removeAttribute('disabled');
		}
		else
		{
			c.addButton.setAttribute('disabled', 'disabled');
		}
	};

	mxEvent.addListener(c.nameInput, 'input', updateAdd);

	if (skin.replaceAddButton)
	{
		var plus = skin.createIconButton('plus', mxResources.get('addProperty'), function()
		{
			if (c.nameInput.value != '')
			{
				updateAdd();
				c.addButton.click();
			}
			else
			{
				c.nameInput.focus();
			}
		}, cls.plus);
		addRow.insertBefore(plus, c.nameInput.nextSibling);
		c.addButton.classList.add(cls.replaced);
	}

	c.nameInput.setAttribute('aria-label', mxResources.get('addProperty'));

	var suggestions = document.createElement('datalist');
	suggestions.className = cls.dataNames;
	suggestions.id = cls.dataNames + '-' + Editor.guid();
	c.addSection.appendChild(suggestions);
	c.nameInput.setAttribute('list', suggestions.id);
	c.nameInput.setAttribute('autocomplete', 'off');

	var getNames = function()
	{
		var names = [];
		var labels = c.properties.querySelectorAll('.geDialogFormLabel');

		for (var i = 0; i < labels.length; i++)
		{
			names.push(labels[i].textContent.replace(/:$/, ''));
		}

		return names;
	};

	// The page, layers and the diagram get the names of the data of the
	// page (a tooltip or link of them shows nowhere)
	var shape = model.isVertex(cell) || model.isEdge(cell);
	var common = ((shape) ? ['tooltip', 'link'] : []).concat(this.getFormDataNames(
		this.editor.graph, ['tooltip', 'link']));

	// The suggestions are the common names that are not rows yet; the
	// placeholder names the first three
	var updateSuggestions = function()
	{
		var names = getNames();
		var shown = [];
		suggestions.textContent = '';

		for (var i = 0; i < common.length && shown.length < 8; i++)
		{
			if (mxUtils.indexOf(names, common[i]) < 0 && mxUtils.indexOf(shown, common[i]) < 0)
			{
				var option = document.createElement('option');
				option.value = common[i];
				suggestions.appendChild(option);
				shown.push(common[i]);
			}
		}

		c.nameInput.setAttribute('placeholder', (shown.length > 0) ? mxResources.get('addAPropertyExamples',
			[shown.slice(0, 3).join(', ')]) : mxResources.get('addAProperty'));
	};

	updateSuggestions();

	// Placeholders with a hint (a switch in Fusion, a checkbox in Classic)
	if (c.optSection != null && c.placeholders != null)
	{
		c.optSection.classList.add(cls.dataOptions);
		var names = getNames();
		skin.decoratePlaceholders(c.placeholders.parentNode, c.placeholders,
			c.placeholders.parentNode.querySelector('label'), mxResources.get('placeholdersHint',
			['%' + ((names.length > 0) ? names[0] : 'name') + '%']));
	}

	// Export (the data as JSON) on the left of the footer
	if (c.exportButton != null)
	{
		skin.decorateExport(c.exportButton, c.buttons);
	}

	// The parts of the form for layouts that extend it (the page data of
	// Fusion, see SimplePageData.js)
	dlg.formParts = {head: head, title: h3, subtitle: sub, idRow: (idRow != null) ?
		idRow : null, heading: heading, suggestions: suggestions,
		getNames: getNames, updateSuggestions: updateSuggestions};

	// Enter applies (concept 13.1), except in the name of a new property,
	// where it adds the property (see EditDataDialog), also in the data of
	// the diagram that the page data shows in this form
	this.addFormEnter(elt, c.applyButton, function(source)
	{
		return source.value != '' && (source == c.nameInput || (source.nodeName == 'INPUT' &&
			source.parentNode != null && source.closest('.' + cls.dataAdd) != null));
	});
};

/**
 * The page data (Edit Data with nothing selected, concept 13.2, mockups 52
 * and 53) in the given skin: Page or Whole diagram as a choice, the ID of
 * the page with Copy, the name of the page, its properties (usable as
 * placeholders in labels), its tags as chips, the data that Style Rules and
 * Data Sources keep in the page under More options, and Color by Data...
 * (Style Rules) in the footer. Whole diagram shows the data of the file
 * (File › Properties › Edit Data). The rows, fields and buttons of the
 * dialogs stay theirs, so Apply changes the data as before; the name and
 * the tags drive the same model (a rename of the page and the tags property
 * of the page) in the same undoable edit. Fusion has it in its skin
 * (SimplePageData.js), Simple in the Classic skin with Edit Data (the row
 * editDataDialog of Editor.featureDefaults, the driver, 20 November 2026:
 * what Simple lost with the panels of batch 15). The functions below came
 * from SimplePageData.js, which keeps their names of before.
 */

/**
 * Returns the tags in the given string (separated by spaces).
 */
FormTemplate.parseTags = function(value)
{
	var tokens = (value != null) ? mxUtils.trim(value).split(/\s+/) : [];
	var result = [];

	for (var i = 0; i < tokens.length; i++)
	{
		if (tokens[i].length > 0 && mxUtils.indexOf(result, tokens[i]) < 0)
		{
			result.push(tokens[i]);
		}
	}

	return result;
};

/**
 * Returns the row of the given property in the given containers of rows of
 * Edit Data.
 */
FormTemplate.findDataRow = function(containers, name)
{
	for (var i = 0; i < containers.length; i++)
	{
		if (containers[i] != null)
		{
			var labels = containers[i].querySelectorAll('.geDialogFormLabel');

			for (var j = 0; j < labels.length; j++)
			{
				if (labels[j].textContent.replace(/:$/, '') == name)
				{
					return labels[j].parentNode;
				}
			}
		}
	}

	return null;
};

/**
 * Returns the variables of the diagram in the given JSON (the vars of the
 * file node) as an object without a prototype, or an empty one.
 */
FormTemplate.parseVars = function(json)
{
	var result = Object.create(null);

	try
	{
		var vars = (json != null && json.length > 0) ? JSON.parse(json) : null;

		if (vars != null && typeof vars === 'object' && !Array.isArray(vars))
		{
			for (var key in vars)
			{
				if (Object.prototype.hasOwnProperty.call(vars, key))
				{
					result[key] = String(vars[key]);
				}
			}
		}
	}
	catch (e)
	{
		// empty
	}

	return result;
};

/**
 * Returns the given current variables with the rows that the form changed
 * from the shown to the written variables (added, changed or deleted).
 */
FormTemplate.mergeVars = function(shown, written, current)
{
	var result = Object.create(null);

	for (var key in current)
	{
		result[key] = current[key];
	}

	for (var key in written)
	{
		if (shown[key] !== written[key])
		{
			result[key] = written[key];
		}
	}

	for (var key in shown)
	{
		if (!(key in written))
		{
			delete result[key];
		}
	}

	return result;
};

/**
 * Calls the given function with the hiding of dialogs turned off, eg. to
 * click Apply of a dialog in another dialog.
 */
EditorUi.prototype.withoutHideDialog = function(fn)
{
	var own = Object.prototype.hasOwnProperty.call(this, 'hideDialog');
	var hideDialog = this.hideDialog;
	this.hideDialog = function() {};

	try
	{
		fn();
	}
	finally
	{
		if (own)
		{
			this.hideDialog = hideDialog;
		}
		else
		{
			delete this.hideDialog;
		}
	}
};

/**
 * Returns FilePropertiesDialog.createDataDialog for the data of the
 * diagram. Names of the data that are no attribute names (a crafted file)
 * would make the dialog throw: it shows the other names, and the skipped
 * ones are kept when it writes the data.
 */
EditorUi.prototype.createDiagramDataDialog = function()
{
	var ui = this;
	var attr = this.fileNode.getAttribute('vars');
	var valid = Object.create(null);
	var skipped = null;

	try
	{
		var vars = (attr != null && attr.length > 0) ? JSON.parse(attr) : null;

		if (vars != null && typeof vars === 'object')
		{
			for (var key in vars)
			{
				if (Object.prototype.hasOwnProperty.call(vars, key))
				{
					if (EditDataDialog.isValidAttributeName(key))
					{
						valid[key] = vars[key];
					}
					else
					{
						skipped = skipped || Object.create(null);
						skipped[key] = vars[key];
					}
				}
			}
		}
	}
	catch (e)
	{
		// The dialog ignores data it cannot read
	}

	if (skipped == null)
	{
		return FilePropertiesDialog.createDataDialog(this);
	}

	var dlg = null;
	this.fileNode.setAttribute('vars', JSON.stringify(valid));

	try
	{
		dlg = FilePropertiesDialog.createDataDialog(this);
	}
	finally
	{
		this.fileNode.setAttribute('vars', attr);
	}

	// After the listener of the dialog, which writes the data it shows
	dlg.controls.graph.getModel().addListener(mxEvent.CHANGE, function(sender, evt)
	{
		var changes = evt.getProperty('edit').changes;

		for (var i = 0; i < changes.length; i++)
		{
			if (changes[i] instanceof mxValueChange)
			{
				var merged = Object.create(null);

				try
				{
					var current = ui.fileNode.getAttribute('vars');
					var parsed = (current != null && current.length > 0) ? JSON.parse(current) : null;

					for (var key in parsed)
					{
						if (Object.prototype.hasOwnProperty.call(parsed, key))
						{
							merged[key] = parsed[key];
						}
					}
				}
				catch (e)
				{
					// Only the skipped names
				}

				for (var key in skipped)
				{
					if (!(key in merged))
					{
						merged[key] = skipped[key];
					}
				}

				ui.fileNode.setAttribute('vars', JSON.stringify(merged));
				ui.updateFileVars();

				break;
			}
		}
	});

	return dlg;
};

/**
 * Makes Apply of the given dialog of the data of the diagram
 * (FilePropertiesDialog.createDataDialog, which writes all of its rows)
 * write only the rows that changed onto the variables of the file if they
 * were changed elsewhere since the form showed them (ch8e S4). The click
 * of Apply (a capture listener on the button, which the page data moves
 * out of the dialog) keeps the variables before it, and the change of the
 * model of the dialog, after the one that writes the rows, merges them.
 */
EditorUi.prototype.installVarsMerge = function(diagramDlg)
{
	var ui = this;
	var c = diagramDlg.controls;
	var button = (c != null) ? c.applyButton : null;
	var model = (c != null && c.graph != null) ? c.graph.getModel() : null;
	var shown = (this.fileNode != null) ? this.fileNode.getAttribute('vars') || '' : '';
	var before = null;

	if (button == null || model == null || model == this.editor.graph.getModel())
	{
		return;
	}

	button.addEventListener('click', function()
	{
		before = (ui.fileNode != null) ? ui.fileNode.getAttribute('vars') || '' : null;
	}, true);

	model.addListener(mxEvent.CHANGE, function()
	{
		var prev = before;
		before = null;

		if (prev != null && ui.fileNode != null)
		{
			var written = ui.fileNode.getAttribute('vars') || '';

			if (written != prev)
			{
				var form = shown;
				shown = written;

				if (prev != form)
				{
					var json = JSON.stringify(FormTemplate.mergeVars(FormTemplate.parseVars(form),
						FormTemplate.parseVars(written), FormTemplate.parseVars(prev)));

					if (json == '{}')
					{
						ui.fileNode.removeAttribute('vars');
					}
					else
					{
						ui.fileNode.setAttribute('vars', json);
					}

					ui.updateFileVars();
					ui.editor.graph.refresh();
					var file = ui.getCurrentFile();

					if (file != null)
					{
						file.fileChanged();
					}
				}
			}
		}
	});
};

/**
 * The fewest options of a box that More options hides (fewer stand inline,
 * as SimpleUi.minExpanderOptions of Fusion).
 */
FormTemplate.minExpanderOptions = 3;

/**
 * Applies the rule of expanders to the given disclosure (an element with
 * aria-expanded whose click shows and hides the given box by its display):
 * with fewer than minExpanderOptions options in the box (count returns
 * their number) the disclosure is hidden and the box is shown inline (with
 * the given class), without options both are hidden, else the disclosure is
 * shown and the box follows its aria-expanded. changed is called with the
 * new state (none, inline or expander). Follows the changes of the rows of
 * the box. Returns the function that applies the rule again (the rule of
 * SimpleUi.applyExpanderRule of Fusion).
 */
FormTemplate.applyExpanderRule = function(btn, box, changed, count, inlineClass)
{
	var state = null;

	var update = function()
	{
		var n = count();
		var next = (n == 0) ? 'none' : ((n < FormTemplate.minExpanderOptions) ? 'inline' : 'expander');
		var display = (next == 'inline' || (next == 'expander' &&
			btn.getAttribute('aria-expanded') == 'true')) ? '' : 'none';
		var btnDisplay = (next == 'expander') ? '' : 'none';

		if (btn.style.display != btnDisplay)
		{
			btn.style.display = btnDisplay;
		}

		// A box that was inline closes with its disclosure
		if ((next != state || next != 'expander') && box.style.display != display)
		{
			box.style.display = display;
		}

		if (box.classList.contains(inlineClass) != (next == 'inline'))
		{
			box.classList.toggle(inlineClass, next == 'inline');
		}

		if (next != state)
		{
			state = next;

			if (changed != null)
			{
				changed(next);
			}
		}
	};

	if (window.MutationObserver != null)
	{
		new MutationObserver(update).observe(box, {childList: true, subtree: true,
			attributes: true, attributeFilter: ['style', 'class', 'hidden']});
	}

	update();

	return update;
};

/**
 * The page data in the Classic skin (docs/dialog-style-guide.md, the CSS in
 * grapheditor.css under .geFormPageData): Page or Whole diagram as a list
 * with the ID of the page and Copy on its right and the name below it on a
 * card, the head of Properties with the hint of the placeholders on its
 * right, the tags of the page as toggle buttons on a card, More options as
 * the collapsible title of the dialogs, and Color by Data... as a button
 * after Export on the left of the footer. The dialog opens with the height
 * of its content (up to the window, see fit) and stays resizable.
 */
FormTemplate.skins.classic.pageData = {
	classes: {pageData: 'geFormPageData', scope: 'geDialogSection geFormPageDataScope',
		scopeRow: 'geDialogFormRow geFormPageDataScopeRow', off: 'geFormPageDataOff',
		id: 'geFormPageDataId', idValue: 'geFormPageDataIdValue', propsHead: 'geFormPageDataPropsHead',
		hint: 'geDialogHint geFormPageDataHint', hidden: 'geFormPageDataHidden', empty: 'geFormPageDataEmpty',
		tagInput: 'geFormPageDataTagInput', moreOpen: 'geExpanded'},
	/**
	 * The name of the page is a row of the card of the choice.
	 */
	nameInScope: true,
	/**
	 * The dialog grows where its content does not fit (when it opens and eg.
	 * for More options), up to the window, where the content scrolls and the
	 * footer stays in view. It never shrinks (the user resizes it).
	 */
	fit: function(ui, elt)
	{
		var dlg = (elt.parentNode != null) ? elt.closest('.geDialog') : null;

		if (dlg != null)
		{
			// The rows the properties hide in their scroll area count (the
			// properties of the page or, in Whole diagram, of the file: a
			// hidden list adds nothing)
			var props = elt.querySelectorAll('.geFormProps');
			var height = elt.scrollHeight;

			for (var i = 0; i < props.length; i++)
			{
				height += Math.max(0, props[i].scrollHeight - props[i].clientHeight);
			}

			if (height > elt.clientHeight + 1)
			{
				Dialog.setFrameHeight(dlg, Dialog.getFrameHeight(dlg, height),
					dlg.getBoundingClientRect().top);
			}
		}
	},
	/**
	 * The dialog fits its content when it opens (fit).
	 */
	fitOnInit: true,
	/**
	 * Returns the row of the name of the page ({row, input}).
	 */
	createNameRow: function(ui, skin, label)
	{
		var row = document.createElement('div');
		row.className = 'geDialogFormRow geFormPageDataName';
		var lbl = document.createElement('label');
		lbl.className = skin.classes.label;
		mxUtils.write(lbl, skin.getLabel(label));
		row.appendChild(lbl);
		var ctl = document.createElement('div');
		ctl.className = skin.classes.control;
		row.appendChild(ctl);
		var input = document.createElement('input');
		input.setAttribute('type', 'text');
		input.id = 'geFormPageDataName-' + Editor.guid();
		lbl.setAttribute('for', input.id);
		ctl.appendChild(input);

		return {row: row, input: input};
	},
	/**
	 * Returns More options ({button, box}): the collapsible title of the
	 * dialogs and a card for the rows.
	 */
	createMore: function(ui)
	{
		var btn = document.createElement('div');
		btn.className = 'geCollapsibleTitle geFormPageDataMoreTitle';
		mxUtils.write(btn, mxResources.get('moreOptions'));
		ui.initKeyboardButton(btn);
		btn.setAttribute('aria-expanded', 'false');
		var box = document.createElement('div');
		box.className = 'geDialogSection geFormPageDataMore';
		box.style.display = 'none';

		return {button: btn, box: box};
	},
	/**
	 * More options for three settings or more, else they stand inline (the
	 * rule of Fusion).
	 */
	applyExpanderRule: function(btn, box, changed)
	{
		return FormTemplate.applyExpanderRule(btn, box, changed, function()
		{
			return Array.prototype.filter.call(box.children, function(row)
			{
				return row.style.display != 'none';
			}).length;
		}, 'geFormPageDataInline');
	},
	/**
	 * Returns the section of the tags with the given title ({section,
	 * chips}): the title of the sections and the tags on a card.
	 */
	createTags: function(ui, skin, title)
	{
		var section = document.createElement('div');
		section.className = 'geFormPageDataTags';
		section.appendChild(skin.createSectionHead(title));
		var chips = document.createElement('div');
		chips.className = 'geDialogSection geFormPageDataChips';
		chips.setAttribute('role', 'group');
		chips.setAttribute('aria-label', title);
		section.appendChild(chips);

		return {section: section, chips: chips};
	},
	/**
	 * Returns the toggle button of the given tag (on if the page has it).
	 */
	createTagChip: function(tag, on, fn)
	{
		var chip = document.createElement('button');
		chip.setAttribute('type', 'button');
		chip.className = 'geBtn geFormPageDataChip';
		chip.classList.toggle('geFormPageDataChipOn', on);
		chip.setAttribute('aria-pressed', (on) ? 'true' : 'false');
		chip.setAttribute('title', tag);
		mxUtils.write(chip, tag);

		mxEvent.addListener(chip, 'click', function(evt)
		{
			fn(evt);
			mxEvent.consume(evt);
		});

		return chip;
	},
	/**
	 * Returns Add tag (a button with its name).
	 */
	createAddTag: function(label, fn)
	{
		var add = mxUtils.button(label, function(evt)
		{
			fn(evt);
			mxEvent.consume(evt);
		});

		add.setAttribute('type', 'button');
		add.className = 'geBtn geFormPageDataAddTag';

		return add;
	},
	/**
	 * Returns Color by Data... after Export on the left of the footer.
	 */
	addRulesButton: function(skin, link, c)
	{
		var start = skin.classes.footerStart;
		link.className = 'geBtn geFormPageDataRules ' + start;

		if (c.exportButton != null && c.exportButton.parentNode == c.buttons)
		{
			// The button after Export pushes the others to the right
			c.exportButton.classList.remove(start);
			c.buttons.insertBefore(link, c.exportButton.nextSibling);
		}
		else
		{
			c.buttons.insertBefore(link, c.buttons.firstChild);
		}
	}
};

/**
 * Lays out the given Edit Data of the page (after createEditDataLayout,
 * whose parts are dlg.formParts) as the page data in the given skin (its
 * pageData has the classes and the builders of the parts).
 */
EditorUi.prototype.createPageDataLayout = function(dlg, skin)
{
	var ui = this;
	var pd = skin.pageData;
	var pc = pd.classes;
	var c = dlg.controls;
	var p = dlg.formParts;
	var elt = dlg.container;
	var graph = c.graph;
	var model = graph.getModel();
	var page = (this.pages != null) ? this.currentPage : null;
	var dirty = false;

	elt.classList.add(pc.pageData);
	elt.setAttribute('aria-label', mxResources.get('pageData'));
	p.title.textContent = '';
	mxUtils.write(p.title, mxResources.get('pageData'));
	var pageSubtitle = p.subtitle.textContent;

	// The parts of the page and of the diagram stay children of the dialog,
	// so that the properties scroll in small windows (see EditDataDialog)
	var pageParts = [];
	var diagramParts = [];

	var addPart = function(part, parts)
	{
		elt.insertBefore(part, c.buttons);
		parts.push(part);
	};

	var contains = function(parts, node)
	{
		for (var i = 0; i < parts.length; i++)
		{
			if (parts[i].contains(node))
			{
				return true;
			}
		}

		return false;
	};

	// Changes of the page (to apply them before another dialog opens)
	mxEvent.addListener(elt, 'input', function(evt)
	{
		var source = mxEvent.getSource(evt);

		if (source != c.nameInput && !source.classList.contains(pc.tagInput) &&
			contains(pageParts, source))
		{
			dirty = true;
		}
	});

	// This page or the whole diagram, and the ID of the page with Copy (the
	// heading of the properties stays with them, see below)
	var scope = document.createElement('div');
	scope.className = pc.scope;
	elt.insertBefore(scope, (p.heading != null && p.heading.parentNode == elt) ?
		p.heading : c.propsSection);
	var scopeRow = scope;

	// The choice and the ID are a row of the card of the scope
	if (pc.scopeRow != null)
	{
		scopeRow = document.createElement('div');
		scopeRow.className = pc.scopeRow;
		scope.appendChild(scopeRow);
	}

	var diagramDlg = null;
	var diagramDirty = false;
	var group = null;
	var scopeValue = 'page';
	var setScope = null;

	var fit = function()
	{
		pd.fit(ui, elt);
	};

	// The data of the diagram is in the file (see FilePropertiesDialog)
	if (this.fileNode != null && typeof FilePropertiesDialog !== 'undefined' &&
		typeof FilePropertiesDialog.createDataDialog === 'function')
	{
		var file = this.getCurrentFile();

		setScope = function(value)
		{
			var diagram = value == 'diagram';
			scopeValue = value;

			if (diagram && diagramDlg == null)
			{
				diagramDlg = ui.createDiagramDataDialog();
				ui.installVarsMerge(diagramDlg);
				var dc = diagramDlg.controls;
				var dp = diagramDlg.formParts;

				// The heading of the properties of skins with cards stands
				// before them (Fusion shows the properties without it)
				if (skin.cards && dp != null && dp.heading != null &&
					dp.heading.parentNode != dc.propsSection)
				{
					addPart(dp.heading, diagramParts);
				}

				addPart(dc.propsSection, diagramParts);
				addPart(dc.addSection, diagramParts);

				if (dc.exportButton != null)
				{
					c.buttons.insertBefore(dc.exportButton, c.buttons.firstChild);
				}

				mxEvent.addListener(elt, 'input', function(evt)
				{
					var source = mxEvent.getSource(evt);

					if (source != dc.nameInput && contains(diagramParts, source))
					{
						diagramDirty = true;
					}
				});

				if (window.MutationObserver != null)
				{
					new MutationObserver(function()
					{
						diagramDirty = true;
						fit();
					}).observe(dc.properties, {childList: true});
				}
			}

			for (var i = 0; i < pageParts.length; i++)
			{
				pageParts[i].classList.toggle(pc.off, diagram);
			}

			for (var i = 0; i < diagramParts.length; i++)
			{
				diagramParts[i].classList.toggle(pc.off, !diagram);
			}

			scopeId.style.display = (diagram) ? 'none' : '';
			p.subtitle.textContent = '';
			mxUtils.write(p.subtitle, (diagram) ? (skin.getFileTitle(ui, file) ||
				mxResources.get('diagram')) : pageSubtitle);

			// The Export of the shown scope (the class, so that the footer
			// keeps the first visible tertiary action on the left)
			if (c.exportButton != null)
			{
				c.exportButton.classList.toggle(pc.off, diagram);
			}

			if (diagramDlg != null && diagramDlg.controls.exportButton != null)
			{
				diagramDlg.controls.exportButton.classList.toggle(pc.off, !diagram);
			}

			fit();
		};

		group = skin.createChoice([
			{value: 'page', label: mxResources.get('thisPageTitle')},
			{value: 'diagram', label: mxResources.get('wholeDiagram')}], 'page',
			function(value)
		{
			setScope(value);
		}, mxResources.get('pageData'));

		// Enter in the list of the scope (the Classic skin) only switches
		// what is shown and does not apply (see addFormEnter, as the
		// buttons of the choice of Fusion), without preventing what the
		// browser does with it
		mxEvent.addListener(group, 'keydown', function(evt)
		{
			if (evt.keyCode == 13 && mxEvent.getSource(evt).nodeName == 'SELECT')
			{
				mxEvent.consume(evt, false, false);
			}
		});

		scopeRow.appendChild(group);
	}

	// The ID of the page: a double click edits it, as before
	var scopeId = document.createElement('div');
	scopeId.className = pc.id;
	scopeRow.appendChild(scopeId);

	if (p.idRow != null)
	{
		var idLabel = document.createElement('span');
		mxUtils.write(idLabel, mxResources.get('pageId'));
		scopeId.appendChild(idLabel);
		c.id.classList.remove(skin.classes.id);
		c.id.classList.add(pc.idValue);
		scopeId.appendChild(c.id);
		var copy = p.idRow.querySelector('button');

		if (copy != null)
		{
			scopeId.appendChild(copy);
		}

		p.idRow.parentNode.removeChild(p.idRow);

		// The card of the ID of skins with cards
		if (c.idSection != null && c.idSection.parentNode != null && c.idSection.firstChild == null)
		{
			c.idSection.parentNode.removeChild(c.idSection);
		}
	}

	// The name of the page (a rename of the page when it applies)
	var nameInput = null;
	var initialName = null;

	// The user changed the name: a page that was renamed elsewhere while the
	// form is shown (eg. by another user) keeps that name unless the field
	// was changed
	var isNameChanged = function()
	{
		return nameInput != null && page != null && nameInput.value != initialName &&
			nameInput.value != page.getName();
	};

	if (page != null)
	{
		var name = pd.createNameRow(this, skin, mxResources.get('name'));
		nameInput = name.input;
		nameInput.value = page.getName() || '';
		initialName = nameInput.value;

		if (pd.nameInScope)
		{
			scope.appendChild(name.row);
			pageParts.push(name.row);
		}
		else
		{
			addPart(name.row, pageParts);
		}

		// Enter applies (a field of one line)
		mxEvent.addListener(nameInput, 'keydown', function(evt)
		{
			if (evt.key == 'Enter' && !evt.isComposing)
			{
				c.applyButton.click();
				mxEvent.consume(evt);
			}
		});
	}

	// Properties, usable as placeholders in labels: the heading with the
	// hint (in the section of the properties, or before it in skins with
	// cards)
	var propsHead = document.createElement('div');
	propsHead.className = pc.propsHead;
	var headInSection = p.heading != null && p.heading.parentNode == c.propsSection;

	if (!headInSection)
	{
		addPart(propsHead, pageParts);
	}

	addPart(c.propsSection, pageParts);
	addPart(c.addSection, pageParts);

	if (headInSection)
	{
		c.propsSection.insertBefore(propsHead, p.heading);
	}

	if (p.heading != null)
	{
		propsHead.appendChild(p.heading);
	}

	var hint = document.createElement('span');
	hint.className = pc.hint;
	propsHead.appendChild(hint);

	var updateHint = function()
	{
		var names = p.getNames();
		var name = 'name';

		for (var i = 0; i < names.length; i++)
		{
			if (names[i] != 'tags' && mxUtils.indexOf(FormTemplate.pageSettingNames, names[i]) < 0)
			{
				name = names[i];
				break;
			}
		}

		hint.textContent = '';
		mxUtils.write(hint, mxResources.get('pageDataHint', ['%' + name + '%']));
	};

	// The data that the dialogs of the page keep (style rules, data sources,
	// the animation) is under More options if the page has all three, else
	// their rows stand inline (the rule of expanders, the driver, 12
	// November 2026)
	var more = pd.createMore(this);
	var moreBtn = more.button;
	var moreBox = more.box;

	var setMoreOpen = function(open)
	{
		moreBox.style.display = (open) ? '' : 'none';
		moreBtn.setAttribute('aria-expanded', (open) ? 'true' : 'false');

		if (pc.moreOpen != null)
		{
			moreBtn.classList.toggle(pc.moreOpen, open);
		}

		fit();
	};

	mxEvent.addListener(moreBtn, 'click', function()
	{
		setMoreOpen(moreBox.style.display == 'none');
	});

	for (var i = 0; i < FormTemplate.pageSettingNames.length; i++)
	{
		var settingRow = FormTemplate.findDataRow([c.properties], FormTemplate.pageSettingNames[i]);

		if (settingRow != null)
		{
			moreBox.appendChild(settingRow);
		}
	}

	// A setting is one option (its row has the value and Delete). Inline,
	// the settings follow the rows of the properties (before Add a
	// property), else More options and its box end the page. The rows are
	// in the box before the rule is applied, so that it places the box now:
	// a move in its observer, after the focus was restored into the new
	// form, would take the focus out of the box.
	pd.applyExpanderRule(moreBtn, moreBox, function(state)
	{
		if (state == 'inline' && moreBox.previousSibling != c.properties)
		{
			c.properties.parentNode.insertBefore(moreBox, c.properties.nextSibling);
		}
		else if (state != 'inline' && moreBtn.parentNode != null && moreBox.previousSibling != moreBtn)
		{
			moreBtn.parentNode.insertBefore(moreBox, moreBtn.nextSibling);
		}

		if (typeof updateRows === 'function')
		{
			updateRows();
		}

		fit();
	});

	// The rows of the page: the tags have their chips, the hint and the head
	// follow the rows
	var updateRows = function()
	{
		var tagsRow = FormTemplate.findDataRow([c.properties], 'tags');

		if (tagsRow != null)
		{
			tagsRow.classList.add(pc.hidden);
		}

		// With the settings inline (see applyExpanderRule above)
		var visible = (moreBox.parentNode == c.properties.parentNode) ? moreBox.children.length : 0;

		for (var i = 0; i < c.properties.children.length; i++)
		{
			visible += (c.properties.children[i].classList.contains(pc.hidden)) ? 0 : 1;
		}

		// EditDataDialog hides the section once its container has no row
		// (updatePropsSection), the settings inline are rows of the section
		c.propsSection.style.display = (visible == 0) ? 'none' : '';
		c.propsSection.classList.toggle(pc.empty, visible == 0);

		// The heading of skins with cards stands before the section
		if (propsHead.parentNode != c.propsSection)
		{
			propsHead.classList.toggle(pc.empty, visible == 0);
		}

		updateHint();
	};

	if (window.MutationObserver != null)
	{
		var observer = function()
		{
			dirty = true;
			updateRows();
			fit();
		};

		new MutationObserver(observer).observe(c.properties, {childList: true});
		new MutationObserver(observer).observe(moreBox, {childList: true});
	}

	// Tags of this page: chips that turn the tags of the page on and off
	// (the tags property of the page), the tags of the shapes of the page
	// to add, and Add tag
	var tags = pd.createTags(this, skin, mxResources.get('pageTags'));
	var tagChips = tags.chips;
	addPart(tags.section, pageParts);

	var getTagsRow = function()
	{
		return FormTemplate.findDataRow([c.properties, moreBox], 'tags');
	};

	var getTags = function()
	{
		var row = getTagsRow();

		return FormTemplate.parseTags((row != null) ? row.querySelector('textarea').value : '');
	};

	var addingTags = false;

	// Writes the tags into the row of the tags (added or deleted as needed)
	var setTags = function(tags)
	{
		var row = getTagsRow();
		var active = document.activeElement;

		if (tags.length == 0)
		{
			if (row != null)
			{
				row.querySelector('a.geButton').click();
			}
		}
		else
		{
			if (row == null)
			{
				var typed = c.nameInput.value;
				addingTags = true;

				try
				{
					c.nameInput.value = 'tags';
					c.nameInput.dispatchEvent(new Event('change'));
					c.addButton.click();
				}
				finally
				{
					addingTags = false;
				}

				c.nameInput.value = typed;
				c.nameInput.dispatchEvent(new Event('change'));
				row = getTagsRow();
			}

			if (row != null)
			{
				row.classList.add(pc.hidden);
				row.querySelector('textarea').value = tags.join(' ');
			}
		}

		dirty = true;

		if (active != null && active != document.activeElement && active.parentNode != null)
		{
			active.focus();
		}
	};

	// The tags of the page first, then those of the shapes of the page
	var offered = getTags();
	var others = graph.getAllTags();

	for (var i = 0; i < others.length && offered.length < 12; i++)
	{
		if (mxUtils.indexOf(offered, others[i]) < 0)
		{
			offered.push(others[i]);
		}
	}

	var tagInput = null;
	var addChip = null;

	// Moves the focus to Add tag after updateTags (not a string, as a tag
	// named add focuses its chip)
	var focusAddTag = {};

	// Adds the tags typed into Add tag (separated by spaces), returns true
	// if there were tags
	var commitTagInput = function()
	{
		var added = (tagInput != null) ? FormTemplate.parseTags(tagInput.value) : [];

		if (tagInput != null)
		{
			tagInput.value = '';
		}

		if (added.length > 0)
		{
			var current = getTags();

			for (var i = 0; i < added.length; i++)
			{
				if (mxUtils.indexOf(offered, added[i]) < 0)
				{
					offered.push(added[i]);
				}

				if (mxUtils.indexOf(current, added[i]) < 0)
				{
					current.push(added[i]);
				}
			}

			setTags(current);
		}

		return added.length > 0;
	};

	var updateTags = function(focus)
	{
		var tags = getTags();
		tagChips.textContent = '';
		addChip = null;

		for (var i = 0; i < offered.length; i++)
		{
			(function(tag)
			{
				var chip = pd.createTagChip(tag, mxUtils.indexOf(tags, tag) >= 0, function()
				{
					var current = getTags();
					var index = mxUtils.indexOf(current, tag);

					if (index >= 0)
					{
						current.splice(index, 1);
					}
					else
					{
						current.push(tag);
					}

					setTags(current);
					updateTags(tag);
				});

				chip.setAttribute('data-tag', tag);
				tagChips.appendChild(chip);

				if (focus === tag)
				{
					chip.focus();
				}
			})(offered[i]);
		}

		// Add tag: a field in place of the chip, Enter adds the tags (separated
		// by spaces), Escape or leaving it empty closes it
		if (tagInput != null)
		{
			tagChips.appendChild(tagInput);

			if (focus == tagInput)
			{
				tagInput.focus();
			}
		}
		else
		{
			addChip = pd.createAddTag(mxResources.get('addTag'), function()
			{
				tagInput = document.createElement('input');
				tagInput.setAttribute('type', 'text');
				tagInput.className = pc.tagInput;
				tagInput.setAttribute('placeholder', mxResources.get('addTag'));
				tagInput.setAttribute('aria-label', mxResources.get('addTag'));

				var close = function(focusAdd)
				{
					tagInput = null;
					updateTags((focusAdd) ? focusAddTag : null);
					fit();
				};

				mxEvent.addListener(tagInput, 'keydown', function(evt)
				{
					// Ctrl+Enter applies the dialog with the typed tags (see
					// EditDataDialog and Apply below)
					if (evt.key == 'Enter' && !evt.isComposing &&
						!mxEvent.isControlDown(evt) && !evt.metaKey)
					{
						if (commitTagInput())
						{
							updateTags(tagInput);
							fit();
						}
						else
						{
							close(true);
						}

						mxEvent.consume(evt);
					}
					else if (evt.key == 'Escape')
					{
						tagInput.value = '';
						close(true);
						mxEvent.consume(evt);
					}
				});

				mxEvent.addListener(tagInput, 'blur', function()
				{
					// Ignores the blur of a field that the chips replaced
					if (tagInput != null && tagInput.parentNode == tagChips)
					{
						window.setTimeout(function()
						{
							if (tagInput != null && document.activeElement != tagInput)
							{
								commitTagInput();
								close(false);
							}
						}, 0);
					}
				});

				updateTags(tagInput);
				fit();
			});

			tagChips.appendChild(addChip);

			if (focus === focusAddTag)
			{
				addChip.focus();
			}
		}
	};

	// A property named tags is added as a tag
	c.addButton.addEventListener('click', function(evt)
	{
		var name = mxUtils.trim(c.nameInput.value);

		if (!addingTags && name == 'tags')
		{
			evt.stopImmediatePropagation();
			c.nameInput.value = '';
			c.nameInput.dispatchEvent(new Event('change'));

			if (addChip != null)
			{
				addChip.click();
			}
			else if (tagInput != null)
			{
				tagInput.focus();
			}
		}
		// Shows the row of a setting of the page that is added again
		else if (FormTemplate.findDataRow([moreBox], name) != null)
		{
			setMoreOpen(true);
		}
	}, true);

	updateTags();

	// Color by Data... (Style Rules) in the footer, after Export (calm
	// variant, Part E, mockup 52). It changes the page, so the page data is
	// applied first (if it was changed) and closed.
	var rules = this.actions.get('styleRules');

	if (rules != null && rules.isEnabled())
	{
		var link = mxUtils.button(mxResources.get('colorByData') + '...', function(evt)
		{
			// A tag that was typed but not added yet (a tap blurs the
			// field after the click)
			commitTagInput();

			if (dirty || diagramDirty || isNameChanged())
			{
				c.applyButton.click();
			}
			else
			{
				ui.hideDialog();
			}

			rules.funct();
			mxEvent.consume(evt);
		});

		pd.addRulesButton(skin, link, c);
		pageParts.push(link);
	}

	addPart(moreBtn, pageParts);

	// Inline, the box is already in the properties (see above)
	if (moreBox.parentNode == null)
	{
		addPart(moreBox, pageParts);
	}
	else
	{
		pageParts.push(moreBox);
	}

	updateRows();

	// Apply: the data of the diagram (if it was changed, written to the
	// file as before), then the data and the name of the page in one edit
	var applying = false;

	c.applyButton.addEventListener('click', function(evt)
	{
		if (!applying)
		{
			evt.stopImmediatePropagation();
			applying = true;

			try
			{
				// A tag that was typed but not added yet (a tap blurs the
				// field after the click)
				commitTagInput();

				if (diagramDlg != null && diagramDirty)
				{
					ui.withoutHideDialog(function()
					{
						diagramDlg.controls.applyButton.click();
					});
				}

				model.beginUpdate();

				try
				{
					// The click of the dialog (click() does nothing during a click)
					c.applyButton.dispatchEvent(new MouseEvent('click', {bubbles: true}));

					if (isNameChanged() && nameInput.value.length > 0 &&
						mxUtils.indexOf(ui.pages, page) >= 0)
					{
						model.execute(new RenamePage(ui, page, nameInput.value));
					}
				}
				finally
				{
					model.endUpdate();
				}
			}
			catch (e)
			{
				ui.handleError(e);
			}
			finally
			{
				applying = false;
			}
		}
	}, true);

	// The parts of the page for the host Data of Fusion (see
	// createSimpleDataHost): the data of the diagram once it is shown, the
	// scope and More options
	p.pageName = nameInput;
	p.moreBox = moreBox;
	p.moreButton = moreBtn;

	p.getDiagramControls = function()
	{
		return (diagramDlg != null) ? diagramDlg.controls : null;
	};

	p.isDiagramScope = function()
	{
		return group != null && scopeValue == 'diagram';
	};

	p.showDiagramScope = function()
	{
		if (group != null && !p.isDiagramScope())
		{
			if (group.buttons != null)
			{
				group.buttons[1].click();
			}
			else
			{
				group.setValue('diagram');
				setScope('diagram');
			}
		}
	};

	// The focus starts on the name (skins with touchFocus leave it to the
	// dialog on touch, so no keyboard opens)
	if (nameInput != null)
	{
		dlg.init = function()
		{
			if (pd.fitOnInit)
			{
				fit();
			}

			if (!(skin.touchFocus && window.matchMedia != null &&
				window.matchMedia('(pointer: coarse)').matches))
			{
				nameInput.focus();
			}
		};
	}
};

/**
 * Edit Tooltip and Edit Note on the Form template in the given skin
 * (concept 13.2, M): the headline and the shape, the formatting toolbar
 * with Formatted and HTML as a choice, and the text in a field. Ctrl+Enter
 * applies.
 */
EditorUi.prototype.createMarkupLayout = function(dlg, skin)
{
	var graph = this.editor.graph;
	var cls = skin.classes;
	var c = dlg.controls;
	var elt = dlg.container;

	// Keeps the previous layout if the dialog has changed
	if (c == null || c.title == null || c.toolbar == null || c.textarea == null || c.wysiwyg == null ||
		c.source == null || c.buttons == null || c.title.parentNode != elt)
	{
		return;
	}

	skin.prepare(this, elt, 'markup', c);

	// The headline without its colon and the shape
	var title = mxUtils.trim(c.title.textContent).replace(/:$/, '');
	var head = document.createElement('div');
	head.className = cls.formHead;
	elt.replaceChild(head, c.title);
	c.title.textContent = title;
	head.appendChild(c.title);
	var cell = graph.getSelectionCell();

	if (cell != null)
	{
		var sub = document.createElement('div');
		sub.className = cls.formSubtitle;
		mxUtils.write(sub, FormTemplate.getCellsSubtitle(graph, [cell]));
		head.appendChild(sub);
	}

	// The toolbar: named buttons that Enter and Space press, then
	// Formatted and HTML
	c.toolbar.classList.add(cls.markupBar);
	c.toolbar.setAttribute('role', 'toolbar');
	c.toolbar.setAttribute('aria-label', mxResources.get('format'));
	var btns = c.toolbar.querySelectorAll('.geMarkupTbBtn');

	for (var i = 0; i < btns.length; i++)
	{
		(function(btn)
		{
			if (btn != c.source)
			{
				btn.setAttribute('role', 'button');
				btn.setAttribute('tabindex', '0');
				btn.setAttribute('aria-label', btn.getAttribute('title'));

				mxEvent.addListener(btn, 'keydown', function(evt)
				{
					if ((evt.key == 'Enter' || evt.key == ' ') && !mxEvent.isControlDown(evt) &&
						!mxEvent.isMetaDown(evt) && !mxEvent.isAltDown(evt))
					{
						btn.click();
						mxEvent.consume(evt);
					}
				});
			}
		})(btns[i]);
	}

	c.source.classList.add(cls.replaced);

	var mode = skin.createChoice([{value: 'text', label: mxResources.get('formatted')},
		{value: 'html', label: mxResources.get('html')}], 'text', function(v)
		{
			if ((v == 'html') != c.source.classList.contains('geActiveItem'))
			{
				c.source.click();
			}
		}, mxResources.get('format'));
	mode.classList.add(cls.markupMode);
	c.toolbar.appendChild(mode);

	// The text in a field (the rich text or its HTML)
	var field = document.createElement('div');
	field.className = cls.markupField;
	elt.insertBefore(field, c.textarea);
	field.appendChild(c.wysiwyg);
	field.appendChild(c.textarea);
	c.wysiwyg.setAttribute('role', 'textbox');
	c.wysiwyg.setAttribute('aria-multiline', 'true');
	c.wysiwyg.setAttribute('aria-label', title);
	c.textarea.setAttribute('aria-label', title + ' (' + mxResources.get('html') + ')');
};
