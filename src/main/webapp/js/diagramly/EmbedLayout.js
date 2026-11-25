/**
 * Copyright (c) 2026, JGraph Holdings Ltd
 * Copyright (c) 2026, draw.io AG
 */
/**
 * Publish › Link and Embed (IFrame, Notion, HTML, Image and SVG) on the Form
 * template of Fusion, and the dialog of their result (EmbedDialog: the link
 * or the code to embed, also of Export as › URL, Extract Text and the data of
 * Edit Data) on the Form or the Code template: the headline and the file,
 * what the link opens, the options, More options (appearance, edit, layers,
 * tags, icons), and for the result the link or the code in a monospace field
 * with Copy as the primary action and Preview, Export and Email on the left.
 * The controls of the dialogs (publishControls, htmlControls and
 * embedImageControls of the content of showPublishLinkDialog, showHtmlDialog
 * and showEmbedImageDialog, the controls of EmbedDialog) move into the new
 * rows with their listeners, so the dialogs create the same links and code as
 * before.
 *
 * The layouts take a skin: the Classic skin (EmbedLayout.skins.classic,
 * docs/dialog-style-guide.md, its CSS in grapheditor.css under .geEmbedForm
 * and .geEmbedResult: the colors of the theme light and dark, checkboxes
 * instead of switches, the Advanced section of the guide for More options)
 * for Simple behind the rows publishLinkDialog and embedDialog of
 * Editor.featureDefaults, or the skin of Fusion, which SimpleMoreForms.js adds
 * (EmbedLayout.skins.fusion), so the code exists once. The dialogs of before
 * are shown where the rows are off.
 */
var EmbedLayout = {};

/**
 * Width of the content of the forms in the Classic skin (the frame adds 48),
 * limited to the window.
 */
EmbedLayout.width = 400;

/**
 * Space between the frame of the dialog and the window in the Classic skin.
 */
EmbedLayout.windowMargin = 32;

/**
 * The skins of the layouts. A skin has the classes of the parts (an entry
 * that is null adds no class) and the builders of the parts that differ (see
 * EmbedLayout.skins.classic). The skin of Fusion is added by
 * SimpleMoreForms.js.
 */
EmbedLayout.skins = {};

/**
 * Returns true if Publish › Link shows the Form template: the feature
 * publishLinkDialog of Editor.featureDefaults (publishLinkDialog in the
 * configuration and the URL), on in Simple, off in Classic, Sketch, Minimal
 * and Atlas unless it is switched on. The theme Fusion always has it.
 */
Editor.isPublishLinkDialogEnabled = function()
{
	return Editor.isFeatureEnabled('publishLinkDialog');
};

/**
 * Returns true if Embed (IFrame, Notion, HTML, Image and SVG) and the dialog
 * of the link or the code to embed (EmbedDialog) show the templates of
 * Fusion: the feature embedDialog of Editor.featureDefaults (as
 * publishLinkDialog).
 */
Editor.isEmbedDialogEnabled = function()
{
	return Editor.isFeatureEnabled('embedDialog');
};

/**
 * Returns true if the given UI shows the Classic skin of the dialogs of the
 * given feature: the feature is on and the theme is not Fusion, which adds
 * its own skin when it shows the dialogs (SimpleMoreForms.js).
 */
EmbedLayout.isClassic = function(ui, feature)
{
	// A positive check of Fusion (see "The seam" in docs/claude/fusion.md)
	return (typeof Editor.isSimpleModern === 'function' && Editor.isSimpleModern()) ? false :
		!ui.editor.isChromelessView() && Editor.isFeatureEnabled(feature);
};

/**
 * Returns the width of the content of a form in the Classic skin for the
 * window.
 */
EmbedLayout.getWidth = function()
{
	var ww = window.innerWidth || document.documentElement.clientWidth;
	var margin = 48 + ((ww < 640) ? 0 : EmbedLayout.windowMargin);

	return Math.max(Math.min(EmbedLayout.width, ww - margin), 240);
};

/**
 * Adds the classes of the given space separated list (a class of a skin) to
 * the given element. Null adds nothing.
 */
EmbedLayout.addClasses = function(elt, classes)
{
	if (elt != null && classes != null)
	{
		var names = String(classes).split(' ');

		for (var i = 0; i < names.length; i++)
		{
			if (names[i].length > 0)
			{
				elt.classList.add(names[i]);
			}
		}
	}
};

/**
 * Enter runs the given primary button of a form in fields, selects and
 * checkboxes; not in text areas, buttons and links, not with a modifier key
 * and not while an input method composes. The field is committed first, so
 * its change and blur listeners run before the primary button.
 */
EmbedLayout.addEnter = function(elt, primary)
{
	var buttons = ['button', 'submit', 'reset', 'file', 'image'];

	mxEvent.addListener(elt, 'keydown', function(evt)
	{
		var source = mxEvent.getSource(evt);
		var type = (source.nodeName == 'INPUT') ? String(source.getAttribute('type') || 'text').toLowerCase() : null;

		if (evt.keyCode == 13 && !evt.isComposing && !evt.defaultPrevented && !mxEvent.isConsumed(evt) &&
			!mxEvent.isControlDown(evt) && !mxEvent.isMetaDown(evt) && !mxEvent.isAltDown(evt) &&
			!mxEvent.isShiftDown(evt) && primary != null && !primary.disabled &&
			(source.nodeName == 'SELECT' || (type != null && mxUtils.indexOf(buttons, type) < 0)))
		{
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
 * The Classic skin (docs/dialog-style-guide.md), for Simple: the head of the
 * Preview template (the title and the file), the sections of the form as
 * titled section cards of form rows and checkbox rows, More options as the
 * Advanced section of the guide, the checkboxes stay checkboxes and the
 * buttons have no glyphs. The result shows the link or the code in a field
 * with the colors of the theme. The CSS is in grapheditor.css under
 * .geEmbedForm and .geEmbedResult.
 */
EmbedLayout.skins.classic = {
	name: 'classic',
	classes: {form: 'geEmbedForm', publish: 'geEmbedPublish', html: 'geEmbedHtml',
		embedImage: 'geEmbedImage', rowGroup: 'geEmbedRowGroup', edit: 'geEmbedEdit',
		subSwitch: 'geEmbedSub', shareRow: 'geEmbedShare', footer: 'geEmbedFooterLink',
		linkBtn: null, result: 'geEmbedResult', resultCode: 'geEmbedResultCode',
		resultForm: 'geEmbedResultForm', head: 'gePreviewHead geEmbedHead',
		subtitle: 'geDialogHint gePreviewSubtitle', field: 'geEmbedField',
		status: 'geEmbedStatus', statusOn: 'geEmbedStatusOn', replaced: 'geEmbedReplaced',
		tertiary: 'geEmbedTertiary'},
	/**
	 * Replaces the content of the given CustomDialog container with a form
	 * with the given headline and subtitle in the scrolling part of the
	 * dialog. Returns the functions that add its parts (see
	 * EditorUi.createSimpleForm of Fusion), or null if the dialog has another
	 * structure.
	 */
	createForm: function(ui, elt, title, subtitle)
	{
		var scroll = elt.firstChild;
		var buttons = elt.lastChild;
		var content = (scroll != null) ? scroll.firstChild : null;

		if (scroll == null || scroll == buttons || content == null || buttons.nodeName != 'DIV')
		{
			return null;
		}

		elt.classList.add('geEmbedForm');
		buttons.classList.add('geEmbedButtons');
		buttons.style.marginTop = '';
		var body = document.createElement('div');
		body.className = 'geEmbedFormBody';

		var head = document.createElement('div');
		head.className = 'gePreviewHead geEmbedHead';
		var h3 = document.createElement('h3');
		mxUtils.write(h3, title);
		head.appendChild(h3);

		if (subtitle != null && subtitle.length > 0)
		{
			var sub = document.createElement('div');
			sub.className = 'geDialogHint gePreviewSubtitle';
			mxUtils.write(sub, subtitle);
			head.appendChild(sub);
		}

		body.appendChild(head);
		scroll.insertBefore(body, content);

		// The rest of the content of before (its emptied rows) is not shown
		content.classList.add('geEmbedReplaced');
		var parent = body;

		return {body: body, head: head, buttons: buttons,
			// The section title of the Preview template and a card for the rows
			section: function(name)
			{
				var h = document.createElement('div');
				h.className = 'gePreviewSectionTitle';
				h.setAttribute('role', 'heading');
				h.setAttribute('aria-level', '3');
				mxUtils.write(h, name);
				body.appendChild(h);
				parent = document.createElement('div');
				parent.className = 'geDialogSection';
				body.appendChild(parent);

				return h;
			},
			// A row with the label (with a colon) and a box of the control
			row: function(label, control, className)
			{
				var r = document.createElement('div');
				r.className = 'geDialogFormRow' + ((className != null) ? ' ' + className : '');
				var l = document.createElement('label');
				l.className = 'geDialogFormLabel';
				mxUtils.write(l, label + ':');
				r.appendChild(l);
				var c = document.createElement('div');
				c.className = 'geEmbedControl';
				r.appendChild(c);

				if (control != null)
				{
					c.appendChild(control);

					if (control.nodeName == 'INPUT' || control.nodeName == 'SELECT' ||
						control.nodeName == 'TEXTAREA')
					{
						if (control.id == null || control.id == '')
						{
							control.id = 'geEmbedField-' + Editor.guid();
						}

						l.setAttribute('for', control.id);
					}
				}

				parent.appendChild(r);

				return c;
			},
			// Adds the given row to the current section
			add: function(row)
			{
				parent.appendChild(row);

				return row;
			},
			// More options: the Advanced section of the guide, collapsed
			more: function()
			{
				var advanced = ui.addAdvancedSection(body, 'moreOptions');
				parent = advanced.content;

				return parent;
			}};
	},
	/**
	 * Returns the row of the given checkbox (the check row of
	 * EditorUi.addCheckbox, or the row of the checkbox, its label and other
	 * controls) as a checkbox row with the given hint below its label.
	 */
	createCheckRow: function(ui, input, hint)
	{
		var row = (input.checkRow != null) ? input.checkRow : input.parentNode;
		row.classList.add('geDialogCheckRow');
		row.style.paddingLeft = '';
		row.style.marginTop = '';
		var label = row.querySelector('label');

		if (label != null)
		{
			if (label.getAttribute('for') == null)
			{
				if (input.id == null || input.id == '')
				{
					input.id = 'geEmbedField-' + Editor.guid();
				}

				label.setAttribute('for', input.id);
			}

			if (hint != null)
			{
				var h = document.createElement('span');
				h.className = 'geDialogHint geEmbedHint';
				mxUtils.write(h, hint);
				label.appendChild(h);
			}
		}

		return row;
	},
	/**
	 * Adds the links (the target and the border color of addLinkSection) to
	 * the given form: the target and the color as form rows.
	 */
	addLinkRows: function(ui, form, links)
	{
		if (links.select != null)
		{
			links.select.className = '';
			links.select.style.width = '';
			links.select.style.padding = '';
			links.select.style.marginRight = '';
			form.row(mxResources.get('links'), links.select);
		}

		if (links.colorButton != null)
		{
			var title = mxResources.get('borderColor');
			links.colorButton.style.marginLeft = '';
			links.colorButton.style.top = '';
			links.colorButton.setAttribute('title', title);
			links.colorButton.setAttribute('aria-label', title);
			form.row(title, links.colorButton, 'geEmbedColorRow');
		}
	},
	/**
	 * Adds the row of Edit (addEditButton) to the given form: the checkbox and
	 * what Edit opens, as in the dialog of before.
	 */
	addEditRow: function(ui, form, edit)
	{
		var row = edit.getEditRow();
		var editSelect = edit.getEditSelect();
		editSelect.className = '';
		editSelect.setAttribute('aria-label', mxResources.get('edit'));
		row.classList.add('geEmbedEdit');
		form.add(row);
	},
	/**
	 * Returns a button with the given label.
	 */
	createButton: function(label, fn)
	{
		var btn = mxUtils.button(label, fn);
		btn.className = 'geBtn';

		return btn;
	},
	/**
	 * The buttons have no glyphs.
	 */
	addIcon: function(btn, name) { },
	/**
	 * Enter runs the primary action.
	 */
	addEnter: function(ui, elt, primary)
	{
		EmbedLayout.addEnter(elt, primary);
	},
	/**
	 * The dialog focuses its first field itself (showDialog).
	 */
	focus: function(ui, elt, target)
	{
		window.setTimeout(function()
		{
			if (target != null && elt.parentNode != null && target.offsetParent != null &&
				(document.activeElement == null || !elt.contains(document.activeElement)))
			{
				target.focus();
			}
		}, 0);
	},
	/**
	 * The size of the result is the size of the caller, the field takes the
	 * rest of its height.
	 */
	prepareResult: function(ui, dlg, code)
	{
		dlg.container.classList.add('geEmbedResult', (code) ? 'geEmbedResultCode' : 'geEmbedResultForm');

		if (dlg.controls != null && dlg.controls.buttons != null)
		{
			dlg.controls.buttons.classList.add('geEmbedButtons');
		}
	},
	/**
	 * What Copy did has no glyph.
	 */
	createStatusIcon: function()
	{
		return null;
	}
};

/**
 * Returns the skin of the layouts for the current theme: the skin of Fusion in
 * Fusion (if its scripts are loaded), else the Classic skin.
 */
EmbedLayout.getSkin = function()
{
	return (typeof Editor.isSimpleModern === 'function' && Editor.isSimpleModern() &&
		EmbedLayout.skins.fusion != null) ? EmbedLayout.skins.fusion : EmbedLayout.skins.classic;
};

/**
 * Adds the given checkboxes of addCheckbox as checkbox rows (switches in
 * Fusion) to the current section of the given form, the given sub option
 * indented below the one before it.
 */
EditorUi.prototype.addEmbedCheckRows = function(form, inputs, sub, skin)
{
	for (var i = 0; i < inputs.length; i++)
	{
		if (inputs[i] != null && inputs[i].checkRow != null)
		{
			var row = skin.createCheckRow(this, inputs[i]);

			if (skin.classes.subSwitch != null)
			{
				row.classList.toggle(skin.classes.subSwitch, inputs[i] == sub);
			}

			form.add(row);
		}
	}
};

/**
 * Adds the appearance (the list of the theme of the viewer) to the given form.
 */
EditorUi.prototype.addEmbedThemeRow = function(form, theme)
{
	if (theme != null)
	{
		theme.style.maxWidth = '';
		form.row(mxResources.get('appearance'), theme);
	}
};

/**
 * Replaces the layout of the given content of Publish › Link, Embed › IFrame
 * and Embed › Notion (showPublishLinkDialog) with the form in the given skin:
 * what the link opens, then the options (the size of the frame, the links,
 * the pages, the lightbox), then More options (appearance, edit, layers,
 * tags, icons). Returns the form or null if the dialog has changed and keeps
 * its layout.
 */
EditorUi.prototype.createPublishLinkLayout = function(elt, c, skin)
{
	var file = this.getCurrentFile();
	var classes = skin.classes;

	// Keeps the previous layout if the dialog has changed
	if (c.title == null || c.link == null || c.linkSection == null || c.pages == null ||
		c.lightbox == null || c.edit == null || c.button == null)
	{
		return null;
	}

	var form = skin.createForm(this, elt, mxUtils.trim(c.title.textContent),
		(file != null) ? file.getTitle() : null);

	if (form == null)
	{
		return null;
	}

	EmbedLayout.addClasses(elt, classes.publish);

	// What the link opens: a copy of the diagram, the file or its public URL
	form.section(mxResources.get('link'));
	c.link.className = '';
	c.link.style.margin = '';
	c.link.style.width = '';
	form.row(mxResources.get('link'), c.link, classes.rowGroup);
	c.link.setAttribute('aria-label', mxResources.get('link'));

	// Options: the size of the frame, the links, the pages and the lightbox
	form.section(mxResources.get('options'));

	if (c.width != null && c.height != null)
	{
		form.row(mxResources.get('width'), c.width);
		form.row(mxResources.get('height'), c.height);
	}

	skin.addLinkRows(this, form, c.linkSection);

	if (c.transparent != null && c.transparent.checkRow != null)
	{
		form.add(skin.createCheckRow(this, c.transparent));
	}

	// The pages only for links with a copy of the diagram (see
	// showPublishLinkDialog)
	if (c.pages.row != null && c.pages.select != null)
	{
		c.pages.select.style.maxWidth = '';
		var pagesRow = form.row(mxResources.get('pages'), c.pages.select).parentNode;

		var updatePages = function()
		{
			pagesRow.style.display = c.pages.row.style.display;
		};

		mxEvent.addListener(c.link, 'change', updatePages);
		updatePages();
	}

	if (c.initialPage != null)
	{
		c.initialPage.style.maxWidth = '';
		form.row(mxResources.get('initialPage'), c.initialPage);
	}

	// Frames have no lightbox (the dialog hides it)
	if (c.lightbox.checkRow != null && c.lightbox.checkRow.style.display != 'none')
	{
		form.add(skin.createCheckRow(this, c.lightbox));
	}

	// More options: appearance, edit, layers, tags and icons
	form.more();
	this.addEmbedThemeRow(form, c.theme);
	skin.addEditRow(this, form, c.edit);
	this.addEmbedCheckRows(form, [c.layers, c.tags, c.useTagSettings, c.linkIcons,
		c.tooltipIcons], c.useTagSettings, skin);

	// The footer of the caller (the link to the extension of Notion, at the
	// bottom of the dialog) as a tertiary action on the left
	if (c.footer != null && c.footer.parentNode != null)
	{
		EmbedLayout.addClasses(c.footer, classes.footer);
		c.footer.style.position = '';
		c.footer.style.bottom = '';
		c.footer.style.left = '';
		c.footer.style.width = '';
		c.footer.style.textAlign = '';
	}

	// Create with the glyph of a link, Enter creates
	skin.addIcon(c.button, 'link');
	skin.addEnter(this, elt, c.button);

	return form;
};

/**
 * Replaces the layout of the given content of Embed › HTML (showHtmlDialog)
 * with the form in the given skin: where the HTML gets the diagram (a copy or
 * the public URL, Share for files on Google Drive), the options (the links,
 * the pages, zoom, fit, the lightbox) and More options (appearance, edit,
 * layers, tags, icons). Returns the form or null.
 */
EditorUi.prototype.createHtmlLayout = function(elt, c, skin)
{
	var file = this.getCurrentFile();
	var classes = skin.classes;

	// Keeps the previous layout if the dialog has changed
	if (c.title == null || c.link == null || c.linkSection == null || c.pages == null ||
		c.zoom == null || c.zoomInput == null || c.fit == null || c.lightbox == null ||
		c.button == null)
	{
		return null;
	}

	var form = skin.createForm(this, elt, mxUtils.trim(c.title.textContent),
		(file != null) ? file.getTitle() : null);

	if (form == null)
	{
		return null;
	}

	EmbedLayout.addClasses(elt, classes.html);

	// The diagram: a copy in the HTML or the public URL of the file
	form.section(mxResources.get('diagram'));
	c.link.className = '';
	c.link.style.margin = '';
	c.link.style.width = '';
	form.row(mxResources.get('diagram'), c.link, classes.rowGroup);
	c.link.setAttribute('aria-label', mxResources.get('diagram'));

	// Share (files on Google Drive without a public URL) as a button that
	// clicks the link of the dialog
	if (c.share != null)
	{
		var share = skin.createButton(mxResources.get('share'), function()
		{
			c.share.click();
		});

		EmbedLayout.addClasses(share, classes.linkBtn);
		skin.addIcon(share, 'share');
		var shareRow = document.createElement('div');
		EmbedLayout.addClasses(shareRow, classes.shareRow);
		shareRow.appendChild(share);
		form.add(shareRow);
	}

	// Options: the links, the pages, zoom, fit and the lightbox
	form.section(mxResources.get('options'));
	skin.addLinkRows(this, form, c.linkSection);

	if (c.pages.row != null && c.pages.select != null)
	{
		c.pages.select.style.maxWidth = '';
		form.row(mxResources.get('pages'), c.pages.select);
	}

	// Zoom: the field before the switch (after the checkbox in Classic)
	c.zoomInput.style.width = '';
	c.zoomInput.style.marginLeft = '';
	c.zoomInput.setAttribute('aria-label', mxResources.get('zoom'));
	var zoomRow = skin.createCheckRow(this, c.zoom);
	var zoomText = zoomRow.querySelector('label>span:not(.geDialogHint)') || zoomRow.querySelector('label');

	if (zoomText != null)
	{
		zoomText.textContent = mxResources.get('zoom');
	}

	form.add(zoomRow);
	this.addEmbedCheckRows(form, [c.fit, c.lightbox], null, skin);

	// More options: appearance, edit, layers, tags and icons
	form.more();
	this.addEmbedThemeRow(form, c.theme);

	if (c.edit != null)
	{
		skin.addEditRow(this, form, c.edit);
	}

	this.addEmbedCheckRows(form, [c.layers, c.tags, c.useTagSettings, c.linkIcons,
		c.tooltipIcons], c.useTagSettings, skin);

	// The primary action with the glyph of code, Enter runs it
	skin.addIcon(c.button, 'code');
	skin.addEnter(this, elt, c.button);

	return form;
};

/**
 * Replaces the layout of the given content of Embed › Image and Embed › SVG
 * (showEmbedImageDialog) with the form in the given skin: the options (the
 * pages, fit, shadow, the image or retina, the lightbox) and More options
 * (appearance, edit, layers, icons). Returns the form or null.
 */
EditorUi.prototype.createEmbedImageLayout = function(elt, c, skin)
{
	var file = this.getCurrentFile();
	var classes = skin.classes;

	// Keeps the previous layout if the dialog has changed
	if (c.fit == null || c.shadow == null || c.image == null || c.lightbox == null ||
		c.edit == null || c.button == null)
	{
		return null;
	}

	var form = skin.createForm(this, elt, (c.title != null) ? mxUtils.trim(c.title.textContent) :
		mxResources.get('embed'), (file != null) ? file.getTitle() : null);

	if (form == null)
	{
		return null;
	}

	EmbedLayout.addClasses(elt, classes.embedImage);

	// Options: the pages, fit, shadow, the image and the lightbox
	form.section(mxResources.get('options'));

	if (c.pages != null && c.pages.row != null && c.pages.select != null)
	{
		c.pages.select.style.maxWidth = '';
		form.row(mxResources.get('pages'), c.pages.select);
	}

	this.addEmbedCheckRows(form, [c.fit, c.shadow, c.image, c.lightbox], null, skin);

	// More options: appearance, edit, layers and icons
	form.more();
	this.addEmbedThemeRow(form, c.theme);
	skin.addEditRow(this, form, c.edit);
	this.addEmbedCheckRows(form, [c.layers, c.linkIcons, c.tooltipIcons], null, skin);

	// Embed with the glyph of code, Enter embeds, the focus starts on the
	// first option (the dialog focuses nothing)
	skin.addIcon(c.button, 'code');
	skin.addEnter(this, elt, c.button);
	skin.focus(this, elt, (c.pages != null && c.pages.row != null) ? c.pages.select : c.fit);

	return form;
};

/**
 * Replaces the layout of the given EmbedDialog with the Form or the Code
 * template in the given skin: the headline and the size (with the file, the
 * hint to paste the code or the name of the data), the link or the code in a
 * monospace field, Copy as the primary action (it says in the dialog that it
 * copied instead of an alert), Preview, Export and Email on the left.
 * Ctrl+Enter in the field runs the primary action. Returns true if the
 * layout was replaced.
 */
EditorUi.prototype.createEmbedResultLayout = function(dlg, filename, skin)
{
	var c = dlg.controls;
	var elt = dlg.container;
	var classes = skin.classes;

	// Keeps the previous layout if the dialog has changed
	if (c == null || c.header == null || c.size == null || c.text == null || c.buttons == null ||
		c.header.parentNode != elt || c.text.parentNode != elt)
	{
		return false;
	}

	var code = c.title != null;
	skin.prepareResult(this, dlg, code);

	// The headline and the size (with the file, the hint to paste the code
	// or the name of the data)
	var file = this.getCurrentFile();
	var head = document.createElement('div');
	EmbedLayout.addClasses(head, classes.head);
	var h3 = document.createElement('h3');
	mxUtils.write(h3, (code) ? c.title :
		mxResources.get((c.tooLarge) ? 'preview' : ((c.validUrl) ? 'link' : 'embed')));
	head.appendChild(h3);
	var parts = [];

	if (!code && !c.validUrl && !c.tooLarge)
	{
		parts.push(mxResources.get('mainEmbedNotice'));
	}
	else if (code && filename != null)
	{
		parts.push(filename);
	}
	else if (file != null)
	{
		parts.push(file.getTitle());
	}

	parts.push(mxUtils.trim(c.size.textContent));
	var sub = document.createElement('div');
	EmbedLayout.addClasses(sub, classes.subtitle);
	mxUtils.write(sub, PreviewDialog.joinList(parts));
	head.appendChild(sub);
	elt.insertBefore(head, c.header);
	EmbedLayout.addClasses(c.header, classes.replaced);

	// The link or the code in a monospace field
	var field = document.createElement('div');
	EmbedLayout.addClasses(field, classes.field);
	elt.insertBefore(field, c.text);
	field.appendChild(c.text);
	c.text.style.marginTop = '';
	c.text.style.flex = '';
	c.text.style.fontFamily = '';
	c.text.setAttribute('aria-label', h3.textContent);

	// Text and data wrap at words, links and code anywhere
	if (code)
	{
		c.text.style.wordBreak = '';
	}

	// The field shows the start of the text that the dialog selects (the
	// selection scrolls to its end)
	if (typeof dlg.init === 'function')
	{
		var init = dlg.init;

		dlg.init = function()
		{
			init.apply(this, arguments);

			window.setTimeout(function()
			{
				c.text.scrollTop = 0;
			}, 0);
		};
	}

	// Says that it copied (screen readers hear it)
	var status = document.createElement('div');
	EmbedLayout.addClasses(status, classes.status);
	status.setAttribute('role', 'status');
	field.appendChild(status);

	// Preview, Export and Email on the left
	var tertiary = [[c.preview, 'eye'], [c.download, 'download'], [c.email, 'mail']];
	var prev = null;

	for (var i = 0; i < tertiary.length; i++)
	{
		var btn = tertiary[i][0];

		if (btn != null && btn.parentNode == c.buttons && !btn.classList.contains('gePrimaryBtn'))
		{
			// Email: the name instead of the image
			if (btn == c.email)
			{
				btn.textContent = '';
				mxUtils.write(btn, mxResources.get('email'));
				btn.style.verticalAlign = '';
				btn.style.paddingTop = '';
				btn.style.minWidth = '';
			}

			EmbedLayout.addClasses(btn, classes.linkBtn);
			EmbedLayout.addClasses(btn, classes.tertiary);
			skin.addIcon(btn, tertiary[i][1]);
			c.buttons.insertBefore(btn, (prev != null) ? prev.nextSibling : c.buttons.firstChild);
			prev = btn;
		}
	}

	// Copy copies the text as before, without the alert
	if (c.copy != null)
	{
		skin.addIcon(c.copy, 'copy');
		var statusThread = null;

		c.copy.addEventListener('click', function(evt)
		{
			var copied = false;
			c.text.focus();
			c.text.select();

			try
			{
				copied = document.execCommand('copy');
			}
			catch (e)
			{
				// ignore
			}

			status.textContent = '';

			if (copied)
			{
				var icon = skin.createStatusIcon();

				if (icon != null)
				{
					status.appendChild(icon);
				}
			}

			mxUtils.write(status, mxResources.get((copied) ? 'copiedToClipboard' : 'error'));
			EmbedLayout.addClasses(status, classes.statusOn);
			window.clearTimeout(statusThread);

			statusThread = window.setTimeout(function()
			{
				status.classList.remove(classes.statusOn);
			}, 3000);

			evt.stopImmediatePropagation();
			evt.preventDefault();
		}, true);
	}

	// Ctrl+Enter in the field runs the primary action
	mxEvent.addListener(c.text, 'keydown', function(evt)
	{
		if (evt.keyCode == 13 && (mxEvent.isControlDown(evt) || mxEvent.isMetaDown(evt)))
		{
			var primary = c.buttons.querySelector('.gePrimaryBtn');

			if (primary != null)
			{
				primary.click();
				mxEvent.consume(evt);
			}
		}
	});

	c.buttons.style.paddingTop = '';

	return true;
};

/**
 * Hook of the dialogs of Publish › Link, Embed › IFrame, Notion, HTML, Image
 * and SVG (showPublishLinkDialog, showHtmlDialog, showEmbedImageDialog): lays
 * out the given CustomDialog container with the given controls (kind is
 * publishLink for Publish › Link, publish for IFrame and Notion, html or
 * embedImage) in the Classic skin where the row of the dialog is on
 * (publishLinkDialog for Publish › Link, else embedDialog) and
 * returns the width of the dialog, else the given width. Not for the options
 * of Export as › URL and HTML in the Export dialog (exportPending), which
 * have its layout. Fusion lays out the dialogs when they are shown
 * (decorateSimpleDialog in SimpleMoreForms.js).
 */
EditorUi.prototype.layoutEmbedOptionsDialog = function(elt, kind, controls, width)
{
	var feature = (kind == 'publishLink') ? 'publishLinkDialog' : 'embedDialog';
	var pending = this.exportPending;

	if (controls != null && EmbedLayout.isClassic(this, feature) &&
		(pending == null || Date.now() - pending.time >= 30000 ||
		typeof this.isExportFormatDialog !== 'function' ||
		!this.isExportFormatDialog(elt, pending.format)))
	{
		try
		{
			var form = null;
			var skin = EmbedLayout.skins.classic;

			if (kind == 'publishLink' || kind == 'publish')
			{
				form = this.createPublishLinkLayout(elt, controls, skin);
			}
			else if (kind == 'html')
			{
				form = this.createHtmlLayout(elt, controls, skin);
			}
			else if (kind == 'embedImage')
			{
				form = this.createEmbedImageLayout(elt, controls, skin);
			}

			if (form != null)
			{
				width = EmbedLayout.getWidth();
			}
		}
		catch (e)
		{
			// Keeps the dialog
			EditorUi.debug('EditorUi.layoutEmbedOptionsDialog', [this], 'error', [e]);
		}
	}

	return width;
};

/**
 * Lays out the given EmbedDialog in the Classic skin where the row
 * embedDialog is on (Fusion lays it out in SimpleMoreForms.js when the dialog
 * is made). Called at the end of the constructor.
 */
EmbedDialog.prototype.installLayout = function(editorUi, filename)
{
	if (EmbedLayout.isClassic(editorUi, 'embedDialog'))
	{
		try
		{
			editorUi.createEmbedResultLayout(this, filename, EmbedLayout.skins.classic);
		}
		catch (e)
		{
			EditorUi.debug('EmbedDialog.installLayout', [this], 'error', [e]);
		}
	}
};
