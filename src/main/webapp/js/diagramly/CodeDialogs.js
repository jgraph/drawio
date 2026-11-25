/**
 * Copyright (c) 2026, JGraph Holdings Ltd
 * Copyright (c) 2026, draw.io AG
 */
/**
 * Edit Diagram, Insert › Mermaid, Insert › Advanced › From Text, SQL,
 * PlantUML and CSV on the Code template in Classic and Simple (Fusion ideas
 * in Simple and Classic; Edit Diagram and Insert › Mermaid also in Sketch,
 * Minimal and Atlas since 22 November 2026): the headline and the page,
 * the code field of CodeField.js (line numbers and the colours of XML or
 * Mermaid, as the code of Edit Style), the options below it and the footer
 * of the dialogs (help and the secondary actions on the left, Cancel and the
 * primary action on the right). The dialogs stay the EditDiagramDialog and
 * the ParseDialog (and the SimpleTextareaDialog of CSV): their text area
 * and their buttons move into the new
 * layout with their listeners, so they do what they did before. The Classic
 * skin follows docs/dialog-style-guide.md (lists and checkboxes, the colors
 * of the theme light and dark, its CSS in grapheditor.css under
 * .geCodeDialog); Fusion has its own layout in SimpleCode.js and shares the
 * code field.
 *
 * Since 23 November 2026 the dialogs of Fusion in every theme (the driver:
 * "die vorschau bitte auch in den anderen themes aktivieren, auch für from
 * text. also d.h. neuen fusion dialog dort verwenden"): the live preview of
 * what Insert adds or of the page next to the code (createCodePreview and
 * the previews of LayoutCode.js, which Fusion shares), the examples above
 * it (From Text, Mermaid, PlantUML, SQL and CSV) and the errors that keep
 * the last good preview with the line of the error marked in the code
 * (CodeExamples.js), each in the Classic skin.
 *
 * Behind the rows editDiagramDialog, mermaidDialog, fromTextDialog,
 * sqlDialog, plantUmlDialog and csvDialog of Editor.featureDefaults; where
 * they are off the dialogs of before are
 * shown.
 */
var CodeDialogs = {};

/**
 * Size of the content of the code dialogs in the Classic skin (the frame
 * adds 48), limited to the window.
 */
CodeDialogs.size = {width: 800, height: 540};

/**
 * Smallest size of the content of the code dialogs in the Classic skin,
 * which can be resized.
 */
CodeDialogs.minSize = {width: 480, height: 320};

/**
 * Space between the frame of the dialog and the window in the Classic skin.
 */
CodeDialogs.windowMargin = 32;

/**
 * Returns true if Edit Diagram shows the Code template: the feature
 * editDiagramDialog of Editor.featureDefaults (editDiagramDialog in the
 * configuration and the URL), on in Classic, Simple, Sketch, Minimal and
 * Atlas in the web app (the desktop app, Confluence, Jira and the embed mode
 * keep the dialog of before unless it is switched on). The theme Fusion
 * always has it.
 */
Editor.isEditDiagramDialogEnabled = function()
{
	return Editor.isFeatureEnabled('editDiagramDialog');
};

/**
 * Returns true if Insert › Mermaid shows the Code template: the feature
 * mermaidDialog of Editor.featureDefaults (as editDiagramDialog).
 */
Editor.isMermaidDialogEnabled = function()
{
	return Editor.isFeatureEnabled('mermaidDialog');
};

/**
 * Returns true if the given UI shows the Classic skin of the code dialog of
 * the given feature: the feature is on and the theme is not Fusion, which
 * has its own layout.
 */
CodeDialogs.isClassic = function(ui, feature)
{
	// A positive check of Fusion (see "The seam" in docs/claude/fusion.md)
	return (typeof Editor.isSimpleModern === 'function' && Editor.isSimpleModern()) ? false :
		!ui.editor.isChromelessView() && Editor.isFeatureEnabled(feature);
};

/**
 * Returns the size of a code dialog in the Classic skin for the window
 * ({width, height, minSize, key}, see showDialog).
 */
CodeDialogs.getSize = function(key)
{
	var ww = window.innerWidth || document.documentElement.clientWidth;
	var wh = window.innerHeight || document.documentElement.clientHeight;
	var margin = 48 + ((ww < 640) ? 0 : CodeDialogs.windowMargin);
	var width = Math.max(Math.min(CodeDialogs.size.width, ww - margin), 240);
	var height = Math.max(Math.min(CodeDialogs.size.height, wh - margin), 240);

	return {width: width, height: height, minSize: new mxRectangle(0, 0,
		Math.min(CodeDialogs.minSize.width, width), Math.min(CodeDialogs.minSize.height, height)),
		key: key};
};

/**
 * Returns what a code dialog acts on: the name of the current page if the
 * file has more than one, else the title of the file or the name of the page,
 * or the title of the new file of a dialog of New (newFileTitle, see
 * showNewFileFromTextDialog).
 */
CodeDialogs.getSubtitle = function(ui)
{
	if (ui.newFileTitle != null)
	{
		return ui.newFileTitle;
	}

	var page = (ui.currentPage != null) ? ui.currentPage.getName() : null;
	var file = (typeof ui.getCurrentFile === 'function') ? ui.getCurrentFile() : null;
	var title = (file != null && typeof file.getTitle === 'function') ? file.getTitle() : null;

	return (page != null && (ui.pages == null || ui.pages.length > 1 || title == null)) ? page : title;
};

/**
 * Returns the side of a code dialog with the live preview in the Classic skin
 * (createCodePreview in LayoutCode.js): the pane with the image and the
 * caption below it. With errors an error keeps the last image without an
 * error, dimmed, with its message and line in a box at the bottom of the
 * pane (see CodeDialogs.installErrors), else the caption says Invalid input.
 */
CodeDialogs.createPreview = function(ui, errors)
{
	var classes = {side: 'geCodeSide', pane: 'geCodePane', caption: 'geDialogHint geCodeCaption',
		paused: 'geCodePaused', example: 'geCodeExample'};

	if (errors)
	{
		classes.error = 'geCodeError';
		classes.errorBody = 'geCodeErrorBody';
		classes.errorText = 'geCodeErrorText';
		classes.errorLine = 'geCodeErrorAt';
		classes.stale = 'geCodeStale';
	}

	return ui.createCodePreview(classes);
};

/**
 * Returns a button of the Classic skin with the given class and label that
 * calls the given function.
 */
CodeDialogs.createButton = function(className, label, fn)
{
	var btn = document.createElement('button');
	btn.setAttribute('type', 'button');
	btn.className = className;
	mxUtils.write(btn, label);

	mxEvent.addListener(btn, 'click', function(evt)
	{
		fn(evt);
		mxEvent.consume(evt);
	});

	return btn;
};

/**
 * The skin of the examples above the preview in the Classic skin (see
 * addCodeExamples in CodeExamples.js): the head Examples as the section
 * heads of the side of Edit Outline, small chips that wrap and Undo below
 * them as a link.
 */
CodeDialogs.examplesSkin = {
	classes: {chips: 'geCodeChips', on: 'geCodeOn'},
	createRow: function(label, control, undo)
	{
		var row = document.createElement('div');
		row.className = 'geCodeExamples';
		var head = document.createElement('div');
		head.className = 'geCodeSideHead';
		head.setAttribute('aria-hidden', 'true');
		mxUtils.write(head, label);
		row.appendChild(head);
		row.appendChild(control);
		row.appendChild(undo);

		return row;
	},
	createChip: function(label, fn)
	{
		return CodeDialogs.createButton('geCodeChip', label, fn);
	},
	createUndo: function(label, fn)
	{
		return CodeDialogs.createButton('geCodeUndo', label, fn);
	}
};

/**
 * Adds the examples of the given kind of dialog (CodeExamples.sets) above the
 * preview of the given side in the Classic skin. Options as addCodeExamples
 * in CodeExamples.js (kind, text, select, preview, changed, getState).
 * Returns the row or null.
 */
CodeDialogs.addExamples = function(ui, side, opts)
{
	opts.skin = CodeDialogs.examplesSkin;
	var row = ui.addCodeExamples(side, opts);

	if (row != null)
	{
		side.insertBefore(row, side.pane);
	}

	return row;
};

/**
 * Returns true if the code of a dialog can open the dialog of the given
 * language (mermaid or plantUml) of the given UI: its action is there and
 * enabled, Mermaid where it is supported, and not in the dialogs of New
 * (which insert into a new file).
 */
CodeDialogs.canSwitchTo = function(ui, lang)
{
	var action = ui.actions.get(lang);

	return ui.newFileTitle == null && action != null && action.isEnabled() &&
		(lang != 'mermaid' || EditorUi.isMermaidSupported());
};

/**
 * Closes the dialog of the given UI and opens the dialog of the given
 * language (the name of its action) with the given code.
 */
CodeDialogs.switchTo = function(ui, lang, code)
{
	ui.hideDialog();
	ui.actions.get(lang).funct();
	var text = (ui.dialog != null && ui.dialog.container != null) ?
		ui.dialog.container.querySelector('textarea') : null;

	if (text != null)
	{
		text.value = code;
		text.dispatchEvent(new Event('input'));
		text.setSelectionRange(0, 0);
	}
};

/**
 * Adds the errors of the preview of the given side (created with errors) to
 * the code field of the given layout (installCodeErrors of CodeExamples.js):
 * the line is marked in the code, and with switchable code of another
 * language in Mermaid or PlantUML offers its dialog with the code.
 */
CodeDialogs.installErrors = function(ui, side, layout, kind, switchable)
{
	var text = layout.editor.querySelector('textarea');

	ui.installCodeErrors(side, {text: text, editor: layout.editor, kind: kind,
		switchTo: (switchable) ? function(lang)
		{
			CodeDialogs.switchTo(ui, lang, text.value);
		} : null,
		canSwitchTo: function(lang)
		{
			return CodeDialogs.canSwitchTo(ui, lang);
		},
		createAction: function(label, fn)
		{
			return CodeDialogs.createButton('geCodeErrorAction', label, fn);
		}});
};

/**
 * Replaces the layout of the given content of a code dialog with the Code
 * template in the Classic skin. Options: title, subtitle, language (see
 * CodeField.languages), options (elements below the code field), footer
 * (the elements of the footer on the left: help and the secondary actions),
 * side (the column of the live preview next to the code, see
 * CodeDialogs.createPreview) and onChange (called after the code has
 * changed, see CodeField.attach). Returns the parts ({head, body, editor,
 * field, note, options, side}) or null if the content has changed and keeps
 * its layout. Null entries of the footer are left out.
 */
EditorUi.prototype.createCodeDialogLayout = function(elt, opts)
{
	var hd = elt.querySelector('h3');
	var text = elt.querySelector('textarea');
	var buttons = elt.lastChild;

	// Keeps the previous layout if the dialog has changed
	if (hd == null || text == null || buttons == null || hd.parentNode != elt ||
		text.parentNode != elt || buttons == text)
	{
		return null;
	}

	elt.classList.add('geCodeDialog');

	// The headline and the page
	var head = document.createElement('div');
	head.className = 'geCodeHead';
	var h3 = document.createElement('h3');
	mxUtils.write(h3, opts.title);
	head.appendChild(h3);

	if (opts.subtitle != null && opts.subtitle.length > 0)
	{
		var sub = document.createElement('div');
		sub.className = 'geDialogHint geCodeSubtitle';
		mxUtils.write(sub, opts.subtitle);
		head.appendChild(sub);
	}

	elt.replaceChild(head, hd);

	// The code field: line numbers, the text area and the colours, with a
	// side the code and its options in a column next to the side
	var body = document.createElement('div');
	body.className = 'geCodeBody';
	elt.insertBefore(body, buttons);
	var main = body;

	if (opts.side != null)
	{
		body.classList.add('geCodeSplit');
		main = document.createElement('div');
		main.className = 'geCodeMain';
		body.appendChild(main);
		body.appendChild(opts.side);
	}

	var editor = document.createElement('div');
	editor.className = 'geCodeEditor geCodeLines';
	var gutter = document.createElement('div');
	gutter.className = 'geCodeGutter';
	gutter.setAttribute('aria-hidden', 'true');
	editor.appendChild(gutter);
	editor.appendChild(text);
	main.appendChild(editor);

	text.style.flex = '';
	text.style.width = '';
	text.style.height = '';
	text.style.minHeight = '';
	text.style.boxSizing = '';
	text.setAttribute('wrap', 'off');

	if (!text.hasAttribute('aria-label'))
	{
		text.setAttribute('aria-label', opts.title);
	}

	// The options and the note of long code below the field
	var options = document.createElement('div');
	options.className = 'geCodeOptions';
	main.appendChild(options);

	if (opts.options != null)
	{
		for (var i = 0; i < opts.options.length; i++)
		{
			options.appendChild(opts.options[i]);
		}
	}

	var note = document.createElement('div');
	note.className = 'geDialogHint geCodeNote';
	note.setAttribute('role', 'status');
	note.hidden = true;
	options.appendChild(note);

	var field = CodeField.attach(editor, gutter, text, {skin: CodeField.skins.classic,
		language: opts.language, note: note, onChange: opts.onChange});
	editor.codeField = field;

	// The footer: the elements on the left, then the others as before
	buttons.classList.add('geCodeFooter');
	buttons.style.justifyContent = 'flex-end';

	if (opts.footer != null)
	{
		var left = [];

		for (var j = 0; j < opts.footer.length; j++)
		{
			if (opts.footer[j] != null)
			{
				left.push(opts.footer[j]);
			}
		}

		// 8 apart, the last pushes the others to the right
		for (var k = left.length - 1; k >= 0; k--)
		{
			left[k].style.marginLeft = (k > 0) ? '8px' : '0px';
			left[k].style.marginRight = '';
			buttons.insertBefore(left[k], buttons.firstChild);
		}

		if (left.length > 0)
		{
			left[left.length - 1].classList.add('geCodeFooterStart');
		}
	}

	var layout = {head: head, body: body, editor: editor, field: field, note: note, options: options,
		side: opts.side};
	elt.codeLayout = layout;

	return layout;
};

/**
 * Lays out the given Edit Diagram dialog on the Code template in the Classic
 * skin where the feature editDiagramDialog is on (Fusion lays it out in
 * SimpleCode.js, when the dialog is made) and returns its size: the live
 * preview of the page next to the code (as Fusion: no examples, an error
 * says Invalid input), help and the list of the actions (copy, new window,
 * ...) on the left of the footer, Cancel and Apply on the right. Else the
 * size of the dialog of before. Code longer than CodeField.fillLaterLength
 * is put into the field after the dialog is shown.
 */
(function()
{
	var editorUiLayoutEditDiagramDialog = EditorUi.prototype.layoutEditDiagramDialog;

	EditorUi.prototype.layoutEditDiagramDialog = function(dlg)
	{
		var result = editorUiLayoutEditDiagramDialog.apply(this, arguments);

		if (CodeDialogs.isClassic(this, 'editDiagramDialog'))
		{
			try
			{
				var elt = dlg.container;
				var buttons = elt.lastChild;
				var help = (buttons != null) ? buttons.querySelector('.geHelpIcon') : null;
				var select = (buttons != null) ? buttons.querySelector('select') : null;
				var primary = (buttons != null) ? buttons.querySelector('.gePrimaryBtn') : null;
				var text = elt.querySelector('textarea');
				var code = (text != null) ? text.value : '';

				// The XML is put into the field after the dialog is shown
				if (text != null && code.length > CodeField.fillLaterLength)
				{
					text.value = '';
				}

				// The live preview of the page in a graph of its own
				var ui = this;
				var side = CodeDialogs.createPreview(this, false);
				var generation = 0;

				var update = function(force)
				{
					var current = ++generation;

					// Not after the dialog is closed
					if (document.body.contains(elt))
					{
						try
						{
							ui.createSimpleDiagramPreview(text.value, force, function(src)
							{
								// The fonts of the labels may load first
								if (current == generation && document.body.contains(elt))
								{
									side.show(src);
								}
							});
						}
						catch (e)
						{
							side.show(null, e);
						}
					}
				};

				var schedule = this.createSimplePreviewScheduler(update, side);

				var layout = this.createCodeDialogLayout(elt, {title: mxResources.get('editDiagram'),
					subtitle: CodeDialogs.getSubtitle(this), language: 'xml',
					footer: [(help != null && help.parentNode == buttons) ? help : null, select],
					side: side, onChange: function()
					{
						schedule();
					}});

				if (layout != null)
				{
					if (select != null)
					{
						select.setAttribute('aria-label', mxResources.get('moreOptions', null, 'More options'));
					}

					CodeField.fillLater(text, code, layout.note, [primary, select]);

					// After the dialog is shown
					schedule(0);
					result = CodeDialogs.getSize('editDiagramCode');
				}
				else if (text != null && text.value != code)
				{
					text.value = code;
				}
			}
			catch (e)
			{
				// The XML stays in the field if it is not put into it later
				if (text != null && code != null && !text.readOnly && text.value != code)
				{
					text.value = code;
				}

				EditorUi.debug('EditorUi.layoutEditDiagramDialog', [this], 'error', [e]);
			}
		}

		return result;
	};
})();

/**
 * Lays out the given ParseDialog of Insert › Mermaid, From Text, SQL and
 * PlantUML on the Code template in the Classic skin where the feature of the
 * type is on (CodeDialogs.parseFeatures; Fusion lays them out in
 * SimpleCode.js) and returns its size: the type as a list and Editable (From
 * Text) below the code, the examples and the live preview of what Insert
 * adds next to it (with the errors that keep the last good preview), help,
 * Preview and the link to report PlantUML issues on the left of the footer,
 * Cancel (which asks before it drops changes, as Close did) and Insert on
 * the right. Else the size of the dialog of before.
 */
CodeDialogs.parseFeatures = {mermaid: 'mermaidDialog', fromText: 'fromTextDialog',
	formatSql: 'sqlDialog', plantUml: 'plantUmlDialog'};

/**
 * Languages of the code field of the ParseDialog by type (CodeField.languages).
 */
CodeDialogs.parseLanguages = {mermaid: 'mermaid'};

(function()
{
	var editorUiLayoutParseDialog = EditorUi.prototype.layoutParseDialog;

	EditorUi.prototype.layoutParseDialog = function(dlg, type)
	{
		var result = editorUiLayoutParseDialog.apply(this, arguments);

		var feature = (type != null && Object.prototype.hasOwnProperty.call(
			CodeDialogs.parseFeatures, type)) ? CodeDialogs.parseFeatures[type] : null;

		if (feature != null && CodeDialogs.isClassic(this, feature))
		{
			try
			{
				var elt = dlg.container;
				var buttons = elt.lastChild;
				var hd = elt.querySelector('h3');
				var help = (buttons != null) ? buttons.querySelector('.geHelpIcon') : null;
				var select = (buttons != null) ? buttons.querySelector('select') : null;
				var cancel = (buttons != null) ? buttons.querySelector('button[title="Escape"]') : null;
				var preview = null;
				var btns = (buttons != null) ? buttons.querySelectorAll('button.geBtn') : [];

				for (var i = 0; i < btns.length; i++)
				{
					if (mxUtils.trim(btns[i].textContent) == mxResources.get('preview'))
					{
						preview = btns[i];
					}
				}

				// The type as a list with its label
				var options = [];

				if (select != null && select.style.display != 'none' && select.options.length > 1)
				{
					var label = document.createElement('label');
					select.id = 'geCodeType-' + Editor.guid();
					label.setAttribute('for', select.id);
					mxUtils.write(label, mxResources.get('type'));
					select.classList.remove('geBtn');
					select.style.marginLeft = '';
					select.style.marginRight = '';
					options.push(label, select);
				}

				// Editable of From Text as a check row next to the type
				var editable = (buttons != null) ? buttons.querySelector('.geDialogCheckRow') : null;

				if (editable != null && editable.parentNode == buttons)
				{
					editable.style.marginRight = '';
					editable.classList.add('geCodeCheck');
					options.push(editable);
				}

				// The link to report PlantUML issues (the first div of the footer)
				var report = (buttons != null) ? buttons.querySelector('a[href]') : null;
				report = (report != null && report.parentNode.parentNode == buttons) ?
					report.parentNode : null;

				if (report != null)
				{
					report.style.fontSize = '';
					report.classList.add('geCodeLink');
				}

				// The live preview: the cells that Insert adds, in a graph of its
				// own (see createSimpleParsePreview in LayoutCode.js)
				var ui = this;
				var text = elt.querySelector('textarea');
				var check = (editable != null) ? editable.querySelector('input[type="checkbox"]') : null;
				var side = (select != null && text != null) ? CodeDialogs.createPreview(this, true) : null;
				var title = mxResources.get(type);
				var generation = 0;

				var update = function(force)
				{
					var current = ++generation;

					// Not after the dialog is closed
					if (!document.body.contains(elt))
					{
						return;
					}
					else if (!force && ui.isSimpleParsePreviewLimited(select.value, text.value))
					{
						side.pause();

						return;
					}

					// The error is about the code that was parsed, which may have
					// changed before the next update
					var value = text.value;

					ui.createSimpleParsePreview(title, type, select.value, value, function(src, error)
					{
						if (current == generation && elt.parentNode != null)
						{
							side.show(src, error, value);
						}
					}, force, (check != null) ? check.checked : null);
				};

				var schedule = (side != null) ? this.createSimplePreviewScheduler(update, side) : null;

				var layout = this.createCodeDialogLayout(elt, {title: (hd != null) ?
					mxUtils.trim(hd.textContent) : mxResources.get(type),
					subtitle: CodeDialogs.getSubtitle(this),
					language: CodeDialogs.parseLanguages[type], options: options,
					footer: [(help != null && help.parentNode == buttons) ? help : null,
						preview, report], side: side,
					onChange: (schedule != null) ? function()
					{
						schedule();
					} : null});

				if (layout != null)
				{
					// Close asks before it drops changes, it is Cancel of the template
					if (cancel != null)
					{
						cancel.textContent = mxResources.get('cancel');
					}

					if (side != null)
					{
						// The type and Editable change what Insert adds
						mxEvent.addListener(select, 'change', function()
						{
							schedule(0);
						});

						if (check != null)
						{
							mxEvent.addListener(check, 'change', function()
							{
								schedule(0);
							});
						}

						// The errors in the preview and the code, the examples above it
						CodeDialogs.installErrors(this, side, layout, type,
							type == 'mermaid' || type == 'plantUml');

						CodeDialogs.addExamples(this, side, {kind: type, text: text, select: select,
							preview: function(example, exampleType, fn)
							{
								ui.createSimpleParsePreview(title, type, exampleType,
									CodeExamples.getText(example), fn, false,
									(check != null) ? check.checked : null);
							},
							changed: function()
							{
								schedule(0);
							},
							getState: function()
							{
								return (check != null) ? String(check.checked) : '';
							}});

						// After the dialog is shown
						schedule(0);
					}

					result = CodeDialogs.getSize(type + 'Code');
				}
			}
			catch (e)
			{
				EditorUi.debug('EditorUi.layoutParseDialog', [this], 'error', [e]);
			}
		}

		return result;
	};
})();

/**
 * Lays out the CSV dialog (Arrange › Insert › CSV, a SimpleTextareaDialog) on
 * the Code template in the Classic skin where the feature csvDialog is on
 * (Fusion lays it out in SimpleCode.js) and returns its size: the headline
 * CSV and the page it is imported into, the examples and the live preview of
 * what Import adds next to the code (with the errors that keep the last
 * good preview), help on the left of the footer, Cancel and Import on the
 * right. Else the size of the dialog of before. The dialog is kept, so a
 * dialog of the other layout is created again, and the preview is made
 * again each time it is shown (the styles of the page may have changed).
 */
(function()
{
	var editorUiShowImportCsvDialog = EditorUi.prototype.showImportCsvDialog;

	EditorUi.prototype.showImportCsvDialog = function()
	{
		if (this.importCsvDialog != null && this.importCsvDialog.container != null &&
			(this.importCsvDialog.container.codeLayout != null) !=
			CodeDialogs.isClassic(this, 'csvDialog'))
		{
			this.importCsvDialog = null;
		}

		return editorUiShowImportCsvDialog.apply(this, arguments);
	};

	var editorUiLayoutImportCsvDialog = EditorUi.prototype.layoutImportCsvDialog;

	EditorUi.prototype.layoutImportCsvDialog = function(dlg)
	{
		var result = editorUiLayoutImportCsvDialog.apply(this, arguments);

		if (dlg != null && dlg.container != null && CodeDialogs.isClassic(this, 'csvDialog'))
		{
			try
			{
				var elt = dlg.container;
				var subtitle = CodeDialogs.getSubtitle(this);

				if (elt.codeLayout == null)
				{
					var ui = this;
					var buttons = elt.lastChild;
					var help = (buttons != null) ? buttons.querySelector('.geHelpIcon') : null;
					var text = elt.querySelector('textarea');
					var side = CodeDialogs.createPreview(this, true);
					var generation = 0;

					// The live preview: the cells that Import adds, in a graph of its own
					var update = function(force)
					{
						var current = ++generation;

						// Not after the dialog is closed
						if (!document.body.contains(elt) || text == null)
						{
							return;
						}
						else if (!force && ui.isSimplePreviewOverBudget(text.value))
						{
							side.pause();
						}
						else if (mxUtils.trim(text.value).length == 0)
						{
							side.show(null);
						}
						else
						{
							// The error is about the code that was parsed
							var value = text.value;

							ui.createSimpleCsvPreview(value, function(src, error)
							{
								if (current == generation && elt.parentNode != null)
								{
									side.show(src, error, value);
								}
							}, force);
						}
					};

					var schedule = this.createSimplePreviewScheduler(update, side);

					// The headline that the template replaces
					var hd = document.createElement('h3');
					mxUtils.write(hd, mxResources.get('csv'));
					elt.insertBefore(hd, elt.firstChild);

					var layout = this.createCodeDialogLayout(elt, {title: mxResources.get('csv'),
						subtitle: subtitle, language: null, footer: [(help != null &&
						help.parentNode == buttons) ? help : null], side: side,
						onChange: function()
						{
							schedule();
						}});

					if (layout == null)
					{
						elt.removeChild(hd);
					}
					else
					{
						// The errors in the preview and the code, the examples above it
						CodeDialogs.installErrors(this, side, layout, 'csv', false);

						var examples = CodeDialogs.addExamples(this, side, {kind: 'csv', text: text,
							select: null, preview: function(example, type, fn)
							{
								ui.createSimpleCsvPreview(CodeExamples.getText(example), fn);
							},
							changed: function()
							{
								schedule(0);
							}});

						// The preview after each show, the images of the examples again
						layout.refresh = function()
						{
							if (examples != null)
							{
								examples.codeExamples.clearCache();
							}

							schedule(0);
						};
					}
				}
				else
				{
					// The page may have changed since it was shown
					var sub = elt.codeLayout.head.querySelector('.geCodeSubtitle');

					if (sub == null && subtitle != null && subtitle.length > 0)
					{
						sub = document.createElement('div');
						sub.className = 'geDialogHint geCodeSubtitle';
						elt.codeLayout.head.appendChild(sub);
					}

					if (sub != null)
					{
						sub.textContent = (subtitle != null) ? subtitle : '';
					}
				}

				if (elt.codeLayout != null)
				{
					if (elt.codeLayout.refresh != null)
					{
						elt.codeLayout.refresh();
					}

					result = CodeDialogs.getSize('csvCode');
				}
			}
			catch (e)
			{
				EditorUi.debug('EditorUi.layoutImportCsvDialog', [this], 'error', [e]);
			}
		}

		return result;
	};
})();
