/**
 * Copyright (c) 2026, JGraph Holdings Ltd
 * Copyright (c) 2026, draw.io AG
 */
/**
 * Layout Settings and the options of the layouts on the layout of Fusion in
 * every look that has it (the driver, 18 November 2026: "bring ALL Fusion
 * dialogs into the Simple theme", package 5): the options of a layout (the
 * ELK layouts of ElkLayout.runWithDialog: flows, trees, radial and organic;
 * Org Chart of showOrgChartConfigDialog; Balloon Tree and Mindmap of
 * showLayoutDialog; also Edit Layout of a layout container and the Add list
 * of the custom layout) are a form with the headline and what the layout acts
 * on, the options in sections (Layout, Connectors, Options) as a grid of two
 * columns with their labels above and the options of yes or no as rows below,
 * and Layout Settings (LayoutPicker.js) gets the headline with what it acts on
 * as the subtitle and Ctrl+Enter in Edit as JSON applies. The controls of the
 * dialogs (layoutControls of ElkLayout.js and EditorUi.js, the .geLayoutForm
 * of Layout Settings) move into the new layout with their listeners or stay
 * hidden, so the dialogs write their options as before (Edit Layout only the
 * changed ones).
 *
 * The layout (EditorUi.createLayoutForm and the functions that use it) takes
 * a skin: the Classic skin (LayoutForms.skins.classic,
 * docs/dialog-style-guide.md, its CSS in grapheditor.css under .geLayoutForms:
 * lists instead of toggle groups, checkboxes instead of switches, the colors
 * of the dialogs of the theme, outlines as focus rings) for Simple behind the
 * features layoutDialogs and layoutSettingsDialog of Editor.featureDefaults
 * (Editor.isLayoutDialogsEnabled, Editor.isLayoutSettingsDialogEnabled), or
 * the skin of Fusion, which SimpleLayouts.js adds (LayoutForms.skins.fusion),
 * so the code exists once. The dialogs of before are shown as they were where
 * the features are off.
 */
var LayoutForms = {};

/**
 * Width of the content of the options of a layout in the Classic skin (the
 * frame adds 48), limited to the window (LayoutForms.getWidth).
 */
LayoutForms.width = 440;

/**
 * Space between the frame of the dialog and the window in the Classic skin.
 */
LayoutForms.windowMargin = 32;

/**
 * Headlines of the dialogs of showLayoutDialog by the name of the layout.
 */
LayoutForms.titles = {'BalloonTreeLayout': 'balloonTree', 'MindmapLayout': 'mindmap'};

/**
 * Returns the width of the content of the options of a layout in the Classic
 * skin for the size of the window.
 */
LayoutForms.getWidth = function()
{
	var ww = window.innerWidth || document.documentElement.clientWidth;
	var margin = 48 + ((ww < 640) ? 16 : LayoutForms.windowMargin);

	return Math.max(Math.min(LayoutForms.width, ww - margin), 240);
};

/**
 * Returns the given shapes and connectors as a text: the label and the type
 * of one cell, or the numbers of shapes and connectors.
 */
LayoutForms.getCellsText = function(graph, cells)
{
	if (cells.length > 1)
	{
		var edges = 0;

		for (var i = 0; i < cells.length; i++)
		{
			edges += (graph.model.isEdge(cells[i])) ? 1 : 0;
		}

		var shapes = cells.length - edges;
		var parts = [];

		if (shapes > 0 || edges == 0)
		{
			parts.push((shapes == 1) ? mxResources.get('toastOneShape') :
				mxResources.get('toastShapes', [shapes]));
		}

		if (edges > 0)
		{
			parts.push((edges == 1) ? mxResources.get('toastOneConnector') :
				mxResources.get('toastConnectors', [edges]));
		}

		return PreviewDialog.joinList(parts);
	}
	else
	{
		var label = mxUtils.trim(graph.getPlainLabel(cells[0], 40) || '');
		var type = graph.getCellTypeName(cells[0]);

		return (label.length > 0 && label != type) ? PreviewDialog.joinList([label, type]) : type;
	}
};

/**
 * Returns what a dialog of the current page acts on: the page of a file with
 * more than one page, else the file, else This page.
 */
LayoutForms.getPageText = function(ui)
{
	var name = (ui.currentPage != null && ui.pages != null && ui.pages.length > 1) ?
		mxUtils.trim(String(ui.currentPage.getName() || '')) : '';

	if (name.length == 0)
	{
		var file = ui.getCurrentFile();
		name = (file != null && file.getTitle() != null) ? mxUtils.trim(String(file.getTitle())) : '';
	}

	return (name.length > 0) ? name : mxResources.get('thisPageTitle');
};

/**
 * Returns the subtitle of the options of a layout in the Classic skin: the
 * layout container it edits, the custom layout it adds to, else the
 * selection or the page.
 */
LayoutForms.getSubtitle = function(ui, cell, add)
{
	var graph = ui.editor.graph;

	if (cell != null && graph.model.contains(cell))
	{
		var label = mxUtils.trim(graph.getPlainLabel(cell, 40) || '');

		return (label.length > 0) ? PreviewDialog.joinList([label, mxResources.get('container')]) :
			mxResources.get('container');
	}
	else if (add)
	{
		return mxResources.get('addToCustomLayout');
	}
	else
	{
		var cells = graph.getSelectionCells();

		return (cells.length > 0) ? LayoutForms.getCellsText(graph, cells) : LayoutForms.getPageText(ui);
	}
};

/**
 * The skins of the layout. A skin has the classes of the parts and the
 * builders of its parts (see LayoutForms.skins.classic). The skin of Fusion
 * is added by SimpleLayouts.js.
 */
LayoutForms.skins = {};

/**
 * The Classic skin (docs/dialog-style-guide.md), for Simple: the head of the
 * Preview template (the headline and a gray subtitle), the sections as
 * geDialogSection cards with a title, the fields in a grid of two columns with
 * their labels above, lists instead of toggle groups, checkbox rows
 * (geDialogCheckRow) instead of switches, the buttons of the dialog and the
 * Enter and the focus of the dialogs of the theme (installDialogEnter,
 * focusDialogStart). The CSS is in grapheditor.css under .geLayoutForms.
 */
LayoutForms.skins.classic = {
	name: 'classic',
	classes: {form: 'geLayoutForms', fields: 'geLayoutFormsFields', field: 'geLayoutFormsField',
		wide: 'geLayoutFormsWide', settings: 'geLayoutFormsSettings', head: 'gePreviewHead geLayoutFormsHead',
		subtitle: 'geDialogHint gePreviewSubtitle', json: null},
	/**
	 * Prefix of the IDs that the labels of the fields refer to.
	 */
	idPrefix: 'geLayoutFormsField-',
	/**
	 * Replaces the layout of the given CustomDialog container with a form
	 * with the given headline and subtitle. Returns the parts of the form
	 * (body, head, buttons, section and more), or null if the dialog has
	 * another structure.
	 */
	createForm: function(ui, elt, title, subtitle)
	{
		var scrollWrapper = elt.firstChild;
		var buttons = elt.lastChild;

		if (scrollWrapper == null || scrollWrapper == buttons || buttons.nodeName != 'DIV')
		{
			return null;
		}

		scrollWrapper.classList.add('geLayoutFormsReplaced');

		var head = document.createElement('div');
		head.className = this.classes.head;
		var h3 = document.createElement('h3');
		mxUtils.write(h3, title);
		head.appendChild(h3);

		if (subtitle != null && mxUtils.trim(String(subtitle)).length > 0)
		{
			var sub = document.createElement('div');
			sub.className = this.classes.subtitle;
			sub.setAttribute('title', subtitle);
			mxUtils.write(sub, subtitle);
			head.appendChild(sub);
		}

		elt.insertBefore(head, scrollWrapper);

		var body = document.createElement('div');
		body.className = 'geLayoutFormsBody';
		elt.insertBefore(body, buttons);

		return {body: body, head: head, buttons: buttons,
			// A section: its title and the card of its rows
			section: function(name)
			{
				var h = document.createElement('div');
				h.className = 'gePreviewSectionTitle';
				h.setAttribute('role', 'heading');
				h.setAttribute('aria-level', '3');
				mxUtils.write(h, name);
				body.appendChild(h);

				var content = document.createElement('div');
				content.className = 'geDialogSection';
				body.appendChild(content);

				return {head: h, content: content};
			},
			// More options: the collapsible section of the dialogs
			more: function()
			{
				return ui.addAdvancedSection(body, 'moreOptions').content;
			}};
	},
	/**
	 * Lays out the given content of a dialog as the options of a layout.
	 */
	prepareForm: function(elt)
	{
		elt.classList.add(this.classes.form);
	},
	/**
	 * Returns the control of a choice of the given items of the given select,
	 * or null for the select itself (lists instead of toggle groups).
	 */
	createChoice: function(items, select, label)
	{
		return null;
	},
	/**
	 * Returns the row of the given checkbox with the given label after it.
	 */
	createCheckRow: function(label, checkbox)
	{
		var r = document.createElement('div');
		r.className = 'geDialogCheckRow';
		var l = document.createElement('label');
		mxUtils.write(l, label);

		if (checkbox.id == null || checkbox.id == '')
		{
			checkbox.id = this.idPrefix + Editor.guid();
		}

		l.setAttribute('for', checkbox.id);
		r.appendChild(checkbox);
		r.appendChild(l);

		return r;
	},
	/**
	 * Keeps Reset of the dialog where it is (a button after the help).
	 */
	prepareReset: function(btn)
	{
		// Keeps the button of the dialog
	},
	/**
	 * Enter and the focus of the dialogs of the theme (installDialogEnter and
	 * focusDialogStart of showDialog) are kept.
	 */
	finish: function(ui, elt, primary)
	{
		// Keeps the Enter and the focus of the dialogs
	},
	/**
	 * Returns the subtitle of the options of a layout.
	 */
	getSubtitle: function(ui, cell, add)
	{
		return LayoutForms.getSubtitle(ui, cell, add);
	},
	/**
	 * Returns what Layout Settings acts on if it has no scope of its own.
	 */
	getPageSubtitle: function(ui)
	{
		return LayoutForms.getPageText(ui);
	},
	/**
	 * Lays out the given content of Layout Settings.
	 */
	prepareSettings: function(elt)
	{
		elt.classList.add(this.classes.settings);
	},
	/**
	 * The rows of Layout Settings keep the labels of the dialog.
	 */
	watchSettings: function(ui, elt, form)
	{
		// Keeps the rows of the dialog
	},
	/**
	 * Layout Settings keeps the focus on its first type and the Enter of the
	 * dialogs of the theme.
	 */
	finishSettings: function(ui, elt, form, primary)
	{
		// Keeps the focus and the Enter of the dialog
	}
};

/**
 * Returns the skin of the layout for the current theme: the skin of Fusion
 * in Fusion (if its scripts are loaded), else the Classic skin.
 */
LayoutForms.getSkin = function()
{
	return (typeof Editor.isSimpleModern === 'function' && Editor.isSimpleModern() &&
		LayoutForms.skins.fusion != null) ? LayoutForms.skins.fusion :
		LayoutForms.skins.classic;
};

/**
 * Returns true if the options of the layouts (ELK, Org Chart, Balloon Tree,
 * Mindmap) are shown as the form of Fusion: the feature layoutDialogs of
 * Editor.featureDefaults (layoutDialogs in the configuration and the URL), on
 * in Simple, off in Classic, Sketch, Minimal and Atlas. The theme Fusion
 * always has it.
 */
Editor.isLayoutDialogsEnabled = function()
{
	return Editor.isFeatureEnabled('layoutDialogs');
};

/**
 * Returns true if Layout Settings is shown on the layout of Fusion: the
 * feature layoutSettingsDialog of Editor.featureDefaults
 * (layoutSettingsDialog in the configuration and the URL), on in Simple, off
 * in Classic, Sketch, Minimal and Atlas. The theme Fusion always has it.
 */
Editor.isLayoutSettingsDialogEnabled = function()
{
	return Editor.isFeatureEnabled('layoutSettingsDialog');
};

(function()
{
	/**
	 * The dialogs get their layout in the Classic skin before the dialog is
	 * shown, where the features are on (Fusion lays them out in
	 * SimpleLayouts.js, before its frame measures them). The options of a
	 * layout take the width of the form (LayoutForms.getWidth).
	 */
	var editorUiShowDialog = EditorUi.prototype.showDialog;

	EditorUi.prototype.showDialog = function(elt, w)
	{
		var args = arguments;

		if (elt != null && elt.querySelector != null && !this.editor.isChromelessView() &&
			LayoutForms.getSkin() == LayoutForms.skins.classic)
		{
			try
			{
				if (this.installLayoutForms(elt) == 'options')
				{
					args = Array.prototype.slice.call(arguments);
					args[1] = LayoutForms.getWidth();
				}
			}
			catch (e)
			{
				// Keeps the dialog of before
				EditorUi.debug('EditorUi.installLayoutForms', [this], 'error', [e]);
			}
		}

		return editorUiShowDialog.apply(this, args);
	};

	/**
	 * Lays out the given content of a dialog in the Classic skin if it is the
	 * dialog of the options of a layout (see layoutControls) or Layout
	 * Settings and its feature is on. Returns options or settings for the
	 * dialog that was laid out, else null.
	 */
	EditorUi.prototype.installLayoutForms = function(elt)
	{
		var skin = LayoutForms.skins.classic;
		var wrapper = elt.firstChild;
		var content = (wrapper != null) ? wrapper.firstChild : null;
		var lc = (content != null) ? content.layoutControls : null;

		if (lc != null)
		{
			if (Editor.isLayoutDialogsEnabled() && !elt.classList.contains(skin.classes.form) &&
				this.createLayoutDialogForm(elt, lc, skin) != null)
			{
				return 'options';
			}
		}
		else if (Editor.isLayoutSettingsDialogEnabled() && !elt.classList.contains(skin.classes.settings))
		{
			var form = elt.querySelector('.geLayoutForm');

			if (form != null && this.createLayoutSettingsLayout(elt, form, skin) != null)
			{
				return 'settings';
			}
		}

		return null;
	};

	/**
	 * Lays out the given content of the dialog of the options of a layout
	 * with the given controls (see layoutControls) in the given skin: the ELK
	 * dialog, Org Chart, Balloon Tree and Mindmap. Returns the form or null
	 * (eg. for the other dialogs with layoutControls).
	 */
	EditorUi.prototype.createLayoutDialogForm = function(elt, lc, skin)
	{
		if (lc.algorithm != null && lc.inputs != null)
		{
			return this.createElkLayoutForm(elt, lc, skin);
		}
		else if (lc.typeSelect != null && lc.parentChildSpacing != null)
		{
			return this.createOrgChartLayoutForm(elt, lc, skin);
		}
		else if (lc.dialog != null && lc.inputs != null)
		{
			return this.createLayoutOptionsForm(elt, lc, skin);
		}

		return null;
	};

	/**
	 * Returns the functions of the form of the options of a layout in the
	 * given dialog in the given skin: a grid of fields with their labels
	 * above, choices (a toggle group or the select, see skin.createChoice),
	 * rows of checkboxes or switches (skin.createCheckRow). Returns null if
	 * the dialog is not a CustomDialog.
	 */
	EditorUi.prototype.createLayoutForm = function(elt, title, subtitle, primaryLabel, resetBtn, skin)
	{
		var form = skin.createForm(this, elt, title, subtitle);

		if (form == null)
		{
			return null;
		}

		skin.prepareForm(elt);
		var classes = skin.classes;
		var grid = null;
		var container = form.body;

		var result = {form: form,
			section: function(name)
			{
				var s = form.section(name);
				container = s.content;
				grid = null;

				return s.head;
			},
			more: function()
			{
				container = form.more();
				grid = null;

				return container;
			},
			// A field with its label above in the grid of two columns
			field: function(label, control, wide)
			{
				if (grid == null)
				{
					grid = document.createElement('div');
					grid.className = classes.fields;
					container.appendChild(grid);
				}

				var cell = document.createElement('div');
				cell.className = classes.field + ((wide) ? ' ' + classes.wide : '');
				var l = document.createElement('label');
				mxUtils.write(l, label);
				cell.appendChild(l);

				if (control.nodeName == 'INPUT' || control.nodeName == 'SELECT')
				{
					if (control.id == null || control.id == '')
					{
						control.id = skin.idPrefix + Editor.guid();
					}

					l.setAttribute('for', control.id);
					control.style.width = '';
					control.style.marginLeft = '';
					control.style.verticalAlign = '';
				}
				else
				{
					l.setAttribute('aria-hidden', 'true');
				}

				cell.appendChild(control);
				grid.appendChild(cell);

				return cell;
			},
			// A select of the dialog as the control of the skin (the select
			// stays hidden and is driven), else the select
			choice: function(label, select, wide)
			{
				var items = [];

				for (var i = 0; i < select.options.length; i++)
				{
					if (!select.options[i].disabled)
					{
						items.push({value: select.options[i].value, label: select.options[i].textContent});
					}
				}

				var group = skin.createChoice(items, select, label);

				if (group != null)
				{
					return result.field(label, group, wide || items.length > 2);
				}
				else
				{
					return result.field(label, select, wide);
				}
			},
			// A checkbox of the dialog as a row of the skin
			switchRow: function(label, checkbox)
			{
				var r = skin.createCheckRow(label, checkbox);
				container.appendChild(r);
				grid = null;

				return r;
			}};

		if (resetBtn != null)
		{
			skin.prepareReset(resetBtn);
		}

		var primary = form.buttons.querySelector('.gePrimaryBtn');

		if (primary != null)
		{
			// The primary says what it does
			if (primaryLabel != null)
			{
				primary.innerHTML = '';
				mxUtils.write(primary, primaryLabel);
			}

			skin.finish(this, elt, primary);
		}

		return result;
	};

	/**
	 * The ELK dialog of Arrange › Layout (ElkLayout.runWithDialog) in the
	 * given skin: Layout (the method of organic layouts, the spacings and the
	 * strategies), Connectors and Options (also preserve origin and the group
	 * padding).
	 */
	EditorUi.prototype.createElkLayoutForm = function(elt, lc, skin)
	{
		var add = typeof lc.onApply === 'function' && lc.onCancel != null && lc.edit == null;
		var f = this.createLayoutForm(elt, (lc.title != null) ? lc.title.textContent : mxResources.get('layout'),
			skin.getSubtitle(this, (lc.edit != null) ? lc.edit.cell : null, add),
			(add) ? mxResources.get('add') : null, lc.resetBtn, skin);

		if (f == null)
		{
			return null;
		}

		f.section(mxResources.get('layout'));

		if (lc.methodSelect != null)
		{
			f.choice(mxResources.get('method'), lc.methodSelect, true);
		}

		var padding = null;

		for (var i = 0; i < lc.fields.length; i++)
		{
			var entry = lc.inputs[lc.fields[i].key];

			if (entry != null)
			{
				if (lc.fields[i].key == 'groupPadding')
				{
					padding = entry.input;
				}
				else if (entry.type == 'select')
				{
					f.choice(mxResources.get(lc.fields[i].label), entry.input);
				}
				else
				{
					f.field(mxResources.get(lc.fields[i].label), entry.input);
				}
			}
		}

		f.section(mxResources.get('connectors'));

		if (lc.connectorSelect != null)
		{
			f.choice(mxResources.get('connector'), lc.connectorSelect, true);
		}

		if (lc.edgeStyleSelect != null)
		{
			f.choice(mxResources.get('edgeStyle'), lc.edgeStyleSelect, true);
		}

		f.choice(mxResources.get('corners'), lc.cornersSelect, true);

		if (lc.sharedStemsCb != null)
		{
			f.switchRow(mxResources.get('sharedStems'), lc.sharedStemsCb);
		}

		f.section(mxResources.get('options'));
		f.switchRow(mxResources.get('resizeNodes'), lc.resizeCb);

		if (lc.rootCb != null)
		{
			var rootLabel = elt.querySelector('label[for="' + lc.rootCb.id + '"]');
			f.switchRow((rootLabel != null) ? rootLabel.textContent : mxResources.get('useSelectionAsRoot'), lc.rootCb);
		}

		// Preserve origin and the group padding in Options: two options are no
		// More options (SimpleUi.minExpanderOptions, the driver, 12 November 2026)
		f.switchRow(mxResources.get('preserveOrigin'), lc.preserveOriginCb);

		if (padding != null)
		{
			padding.setAttribute('placeholder', mxResources.get('automatic'));
			f.field(mxResources.get('groupPadding'), padding);
		}

		return f;
	};

	/**
	 * The Org Chart dialog (showOrgChartConfigDialog) in the given skin: the
	 * type, the spacings and the stack level.
	 */
	EditorUi.prototype.createOrgChartLayoutForm = function(elt, lc, skin)
	{
		var add = lc.onCancel != null && lc.values == null;
		var cell = (lc.values != null) ? this.editor.graph.getSelectionCell() : null;

		// Values of a layout container (Edit layout) or of the tile Org chart of
		// Arrange my diagram, which acts on the selection or the page
		// (showSimpleOrgChartOptions): only a layout container is named
		if (cell != null && !this.isLayoutContainer(cell))
		{
			cell = null;
		}

		var f = this.createLayoutForm(elt, mxResources.get('orgChart'),
			skin.getSubtitle(this, cell, add), (add) ? mxResources.get('add') : null, lc.resetBtn, skin);

		if (f != null)
		{
			f.section(mxResources.get('layout'));
			f.field(mxResources.get('orgChartType'), lc.typeSelect, true);
			f.field(mxResources.get('parentChildSpacing'), lc.parentChildSpacing);
			f.field(mxResources.get('siblingSpacing'), lc.siblingSpacing);
			f.field(mxResources.get('stackFromLevel'), lc.stackLevel);
		}

		return f;
	};

	/**
	 * The dialogs of the layouts with simple options (showLayoutDialog:
	 * Balloon Tree, Mindmap) in the given skin: the numbers in the grid, the
	 * checkboxes or switches below.
	 */
	EditorUi.prototype.createLayoutOptionsForm = function(elt, lc, skin)
	{
		var add = lc.onCancel != null && lc.values == null;
		var key = LayoutForms.titles[lc.name];
		var f = this.createLayoutForm(elt, mxResources.get((key != null) ? key : 'layout'),
			skin.getSubtitle(this, (lc.values != null) ? this.editor.graph.getSelectionCell() : null, add),
			(add) ? mxResources.get('add') : null, lc.resetBtn, skin);

		if (f != null)
		{
			var fields = lc.dialog.fields;
			var switches = [];
			f.section(mxResources.get('layout'));

			for (var i = 0; i < fields.length; i++)
			{
				var input = lc.inputs[fields[i][0]];

				if (input != null)
				{
					if (input.type == 'checkbox')
					{
						switches.push(i);
					}
					else
					{
						f.field(mxResources.get(fields[i][1]), input);
					}
				}
			}

			if (switches.length > 0)
			{
				f.section(mxResources.get('connectors'));

				for (var i = 0; i < switches.length; i++)
				{
					f.switchRow(mxResources.get(fields[switches[i]][1]), lc.inputs[fields[switches[i]][0]]);
				}
			}
		}

		return f;
	};

	/**
	 * Lays out the given content of Layout Settings (LayoutPicker.js: Arrange ›
	 * Layout settings… and the settings of Arrange my diagram) with the given
	 * form (.geLayoutForm) in the given skin: the headline with what the
	 * layout acts on (the container, the selection, else the file and the
	 * page) as the subtitle, and Ctrl+Enter in Edit as JSON applies. The
	 * dialog renders its options again when the type changes, so the rows get
	 * the look by CSS. Returns the head or null.
	 */
	EditorUi.prototype.createLayoutSettingsLayout = function(elt, form, skin)
	{
		var hd = form.querySelector('h3');
		var btns = elt.lastChild;
		var primary = (btns != null) ? btns.querySelector('.gePrimaryBtn') : null;

		if (hd == null || primary == null)
		{
			return null;
		}

		skin.prepareSettings(elt);

		var head = document.createElement('div');
		head.className = skin.classes.head;
		form.insertBefore(head, hd);
		head.appendChild(hd);

		// What the layout acts on: the hint of the dialog, else the page
		var scope = form.querySelector('.geLayoutFormScope');
		var sub = document.createElement('div');
		sub.className = skin.classes.subtitle;
		mxUtils.write(sub, (scope != null) ? mxUtils.trim(scope.textContent) : skin.getPageSubtitle(this));
		head.appendChild(sub);

		if (scope != null)
		{
			scope.parentNode.removeChild(scope);
		}

		// Edit as JSON is a disclosure
		var json = form.querySelector('.geCollapsibleTitle');

		if (json != null && skin.classes.json != null)
		{
			json.classList.add(skin.classes.json);
		}

		skin.watchSettings(this, elt, form);

		// Ctrl+Enter in Edit as JSON applies: the Enter of the dialog leaves it
		// to the text area, which has no handler of its own
		mxEvent.addListener(elt, 'keydown', function(evt)
		{
			var target = mxEvent.getSource(evt);

			if (evt.keyCode == 13 && mxEvent.isControlDown(evt) && !evt.shiftKey &&
				!evt.altKey && !evt.defaultPrevented && target != null &&
				target.nodeName == 'TEXTAREA' && !primary.disabled)
			{
				primary.click();
			}
		});

		skin.finishSettings(this, elt, form, primary);

		return head;
	};
})();
