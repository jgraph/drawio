/**
 * Copyright (c) 2026, JGraph Holdings Ltd
 * Copyright (c) 2026, draw.io AG
 */
/**
 * File › Properties of Fusion (FilePropertiesDialog) in every look that has
 * it: the file as a card (its name, its size and path and Rename), the
 * public link of the diagram as a row, the options of the file under
 * Options (the checkboxes with their hints, the fields as rows) and Edit
 * Data (the data of the diagram) on the left of the footer. The controls of
 * the dialog stay the controls with their listeners (FilePropertiesDialog
 * controls): the layout moves and restyles them, so Apply writes the same
 * options as before, and Rename and Edit Data open what they opened.
 *
 * The layout (EditorUi.createPropertiesLayout) takes a skin: the Classic
 * skin (PropertiesLayout.skins.classic, docs/dialog-style-guide.md, its CSS
 * in grapheditor.css under .geProps, which takes the colors, the font and
 * the corners of the other dialogs of the theme) for Simple, behind the
 * feature propertiesDialog of Editor.featureDefaults
 * (Editor.isPropertiesDialogEnabled), or the skin of Fusion, which
 * SimpleForms.js adds (PropertiesLayout.skins.fusion), so the code exists
 * once. The dialog of before is shown where the feature is off.
 */
var PropertiesLayout = {};

/**
 * Width of the content in the Classic skin (the frame adds 48), limited to
 * the window (EditorUi.getPropertiesDialogWidth).
 */
PropertiesLayout.width = 420;

/**
 * Space between the frame and the window in the Classic skin.
 */
PropertiesLayout.windowMargin = 32;

/**
 * Hints of the options of the file by the resource of their label.
 */
PropertiesLayout.optionHints = {compressed: 'compressedHint'};

/**
 * The skins of the layout. A skin has the classes of the parts (an entry
 * that is null adds no class) and the builders of the parts that differ
 * (see PropertiesLayout.skins.classic). The skin of Fusion is added by
 * SimpleForms.js.
 */
PropertiesLayout.skins = {};

/**
 * The Classic skin (docs/dialog-style-guide.md), for Simple: the headline of
 * the dialogs, the file as a card with the logo of its storage, the section
 * title of the Preview template, the checkboxes of the dialog with their
 * hints, the fields as the rows of before, Edit Data on the left of the
 * footer and the buttons without glyphs. The CSS is in grapheditor.css
 * under .geProps.
 */
PropertiesLayout.skins.classic = {
	name: 'classic',
	classes: {card: 'gePropsCard', cardIcon: 'gePropsCardIcon', cardText: 'gePropsCardText',
		cardName: 'gePropsCardName', cardMeta: 'geDialogHint gePropsCardMeta', linkRow: 'geDialogFormRow gePropsLink',
		linkLabel: 'geDialogFormLabel', control: 'gePropsControl', options: 'gePropsOptions',
		replaced: 'gePropsReplaced'},
	/**
	 * Lays out the given content of the dialog as the form.
	 */
	prepare: function(ui, elt)
	{
		elt.classList.add('geProps');
	},
	/**
	 * The headline of the dialog stays the title of before.
	 */
	createHead: function(ui, elt, title) { },
	/**
	 * Returns the logo of the storage of the given file as the dialogs of
	 * before show it, or null.
	 */
	createFileIcon: function(ui, file)
	{
		var mode = (file != null && typeof file.getMode === 'function') ? file.getMode() : null;
		var logo = (typeof StartScreen !== 'undefined') ? StartScreen.getStorageLogo(mode) : null;
		var img = null;

		if (logo != null)
		{
			img = document.createElement('img');
			img.setAttribute('src', logo);
			img.setAttribute('alt', '');
			img.setAttribute('draggable', 'false');
		}

		return img;
	},
	/**
	 * Returns a button without a glyph.
	 */
	createButton: function(label, fn)
	{
		var btn = mxUtils.button(label, fn);
		btn.className = 'geBtn';

		return btn;
	},
	/**
	 * Returns the label of a row (with the colon of the rows of before).
	 */
	getLabel: function(text)
	{
		return text + ':';
	},
	/**
	 * Returns the title of a section of the Preview template.
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
	 * The checkbox stays a checkbox in front of its label, the hint is below
	 * the name inside of the label.
	 */
	layoutCheckRow: function(ui, row, input, label, hint)
	{
		if (hint != null)
		{
			var h = document.createElement('span');
			h.className = 'geDialogHint gePropsHint';
			mxUtils.write(h, hint);
			label.appendChild(h);
		}
	},
	/**
	 * The field stays in the row of before, named by its label.
	 */
	layoutFormRow: function(ui, settings, row, label, field)
	{
		field.setAttribute('aria-label', label);
	},
	/**
	 * Edit Data is the first button of the footer, on its left.
	 */
	layoutDataButton: function(ui, btn, buttons)
	{
		btn.classList.add('gePropsData');
		buttons.insertBefore(btn, buttons.firstChild);
	},
	/**
	 * The buttons of the dialog in a row, Enter applies as in the other
	 * dialogs (EditorUi.installDialogEnter).
	 */
	finish: function(ui, elt, c)
	{
		c.buttons.classList.add('gePropsFooter');
	}
};

/**
 * Returns the skin of the current look: the skin of Fusion in the theme
 * Fusion, else the Classic skin.
 */
PropertiesLayout.getSkin = function()
{
	return (typeof Editor.isSimpleModern === 'function' && Editor.isSimpleModern() &&
		PropertiesLayout.skins.fusion != null) ? PropertiesLayout.skins.fusion :
		PropertiesLayout.skins.classic;
};

/**
 * Returns true if File › Properties shows the layout of Fusion: the feature
 * propertiesDialog of Editor.featureDefaults (propertiesDialog in the
 * configuration and the URL), on in Simple, off in Classic, Sketch, Minimal
 * and Atlas. The theme Fusion always has it.
 */
Editor.isPropertiesDialogEnabled = function()
{
	return Editor.isFeatureEnabled('propertiesDialog');
};

/**
 * Lays out the given File Properties dialog in the Classic skin where the
 * feature is on (Fusion lays it out in SimpleForms.js). Called at the end of
 * the constructor of FilePropertiesDialog.
 */
EditorUi.prototype.installPropertiesLayout = function(dlg)
{
	if (!this.editor.isChromelessView() && Editor.isPropertiesDialogEnabled() &&
		PropertiesLayout.getSkin() == PropertiesLayout.skins.classic)
	{
		try
		{
			this.createPropertiesLayout(dlg, PropertiesLayout.skins.classic);
		}
		catch (e)
		{
			EditorUi.debug('EditorUi.installPropertiesLayout', [this], 'error', [e]);
		}
	}
};

/**
 * Returns the width of the content of the given File Properties dialog: the
 * width of the layout (PropertiesLayout.width) limited to the window if the
 * dialog is laid out in the Classic skin, else the given width. Fusion sizes
 * its frame itself.
 */
EditorUi.prototype.getPropertiesDialogWidth = function(dlg, width)
{
	if (dlg != null && dlg.propertiesLayout != null &&
		dlg.propertiesLayout.skin == PropertiesLayout.skins.classic)
	{
		var ww = window.innerWidth || document.documentElement.clientWidth;
		var margin = 48 + ((ww < 640) ? 16 : PropertiesLayout.windowMargin);

		width = Math.max(Math.min(PropertiesLayout.width, ww - margin), 240);
	}

	return width;
};

/**
 * Replaces the layout of the given File Properties dialog with the form in
 * the given skin: the file as a card (its name, its size and path, Rename),
 * the public link as a row, the options (the checkboxes with their hints by
 * PropertiesLayout.optionHints, the fields as rows) under Options, and Edit
 * Data on the left of the footer. Keeps the dialog of before if its parts
 * have changed (see FilePropertiesDialog.controls).
 */
EditorUi.prototype.createPropertiesLayout = function(dlg, skin)
{
	var ui = this;
	var c = dlg.controls;
	var elt = dlg.container;
	var classes = skin.classes;

	// Keeps the previous layout if the dialog has changed
	if (c == null || c.title == null || c.settings == null || c.buttons == null ||
		c.title.parentNode != elt)
	{
		return;
	}

	var file = this.getCurrentFile();
	var title = (file != null && file.getTitle() != null) ? file.getTitle() : this.defaultFilename;
	dlg.propertiesLayout = {skin: skin};
	skin.prepare(this, elt);
	skin.createHead(this, elt, c.title);

	// The file: its name, size and place, and Rename
	var card = document.createElement('div');
	card.className = classes.card;
	var icon = skin.createFileIcon(this, file);

	if (icon != null)
	{
		var tile = document.createElement('span');
		tile.className = classes.cardIcon;
		tile.appendChild(icon);
		card.appendChild(tile);
	}

	var text = document.createElement('div');
	text.className = classes.cardText;
	var name = document.createElement('div');
	name.className = classes.cardName;
	mxUtils.write(name, title);
	name.setAttribute('title', title);
	text.appendChild(name);
	var meta = [];

	if (c.size != null)
	{
		meta.push(c.size.value);
	}

	if (c.path != null)
	{
		meta.push(c.path.value);
	}

	if (meta.length > 0)
	{
		var metaElt = document.createElement('div');
		metaElt.className = classes.cardMeta;
		mxUtils.write(metaElt, PreviewDialog.joinList(meta));
		metaElt.setAttribute('title', PreviewDialog.joinList(meta));
		text.appendChild(metaElt);
	}

	card.appendChild(text);
	var rename = this.actions.get('rename');

	if (rename != null && rename.isEnabled() && file != null)
	{
		card.appendChild(skin.createButton(mxResources.get('rename'), function()
		{
			ui.hideDialog();
			rename.funct();
		}, 'edit'));
	}

	elt.insertBefore(card, c.settings);

	// The public link stays a row below the card
	if (c.info != null)
	{
		c.info.classList.add(classes.replaced);

		if (c.publicLink != null)
		{
			var row = document.createElement('div');
			row.className = classes.linkRow;
			var label = document.createElement('label');

			if (classes.linkLabel != null)
			{
				label.className = classes.linkLabel;
			}

			mxUtils.write(label, skin.getLabel(mxResources.get('publicDiagramUrl')));
			row.appendChild(label);
			var ctl = document.createElement('div');
			ctl.className = classes.control;
			ctl.appendChild(c.publicLink);
			row.appendChild(ctl);
			elt.insertBefore(row, c.settings);
		}
	}

	// Options: the checkboxes with their hints, the fields as rows
	var settings = c.settings;
	settings.classList.add(classes.options);
	elt.insertBefore(skin.createSectionHead(mxResources.get('options')), settings);
	var rows = Array.prototype.slice.call(settings.children);

	for (var i = 0; i < rows.length; i++)
	{
		var r = rows[i];

		if (r.classList.contains('geDialogCheckRow'))
		{
			var input = r.querySelector('input[type="checkbox"]');
			var lbl = r.querySelector('label');

			if (input != null && lbl != null)
			{
				var hint = null;

				for (var res in PropertiesLayout.optionHints)
				{
					if (lbl.textContent == mxResources.get(res))
					{
						hint = mxResources.get(PropertiesLayout.optionHints[res]);
					}
				}

				skin.layoutCheckRow(this, r, input, lbl, hint);
			}
		}
		else if (r.classList.contains('geDialogFormRow'))
		{
			var flbl = r.querySelector('.geDialogFormLabel');
			var field = r.querySelector('input, select');

			if (flbl != null && field != null)
			{
				skin.layoutFormRow(this, settings, r, flbl.textContent.replace(/:$/, ''), field);
			}
		}
	}

	// Edit Data (the data of the diagram) on the left of the footer
	if (c.data != null)
	{
		skin.layoutDataButton(this, c.data, c.buttons);
	}

	skin.finish(this, elt, c);
};
