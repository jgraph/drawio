/**
 * Copyright (c) 2026, JGraph Holdings Ltd
 * Copyright (c) 2026, draw.io AG
 */
/**
 * Data Sources of Fusion in every look that has it (package 5 of "Fusion
 * ideas in Simple and Classic"): Data Sources (DataSourcesDialog: the
 * sources of the page as rows with their link, columns, shapes and the last
 * refresh, Refresh, Edit and Delete at the end of each row, Add Source below
 * the rows, Close and Refresh All in the footer) and Add Source and Edit of
 * a source (DataSourceDialog: a form with the name and the link with
 * Preview, the key column, the columns, missing rows, the shapes, the
 * template and the first rows of the preview). The controls of the dialogs
 * move into the new layout with their listeners (the controls of
 * DataSourcesDialog and DataSourceDialog), so every action calls what it
 * called before.
 *
 * The layout (EditorUi.createDataSourcesLayout and createDataSourceLayout)
 * takes a skin: the Classic skin (DataSourcesLayout.skins.classic,
 * docs/dialog-style-guide.md, its CSS in grapheditor.css under
 * .geDataSources and .geDataSourceForm, which takes the colors, the font and
 * the corners of the other dialogs of the theme) for Simple, behind the
 * feature dataSourcesDialog of Editor.featureDefaults
 * (Editor.isDataSourcesDialogEnabled), or the skin of Fusion, which
 * SimpleRules.js adds (DataSourcesLayout.skins.fusion, the Rules and the
 * Form template), so the code exists once. The dialogs of before are shown
 * as they were where the feature is off. The Classic skin also selects the
 * shapes of a source as the panel Data Sources of Fusion (a click on the
 * name, Select in More actions, addDataSourceSelection; the driver, 20
 * November 2026).
 */
var DataSourcesLayout = {};

/**
 * The skins of the layout. A skin has the classes of the parts (a value
 * with spaces adds more than one class, null adds none) and the builders of
 * its parts: prepareSources and prepareForm (the size of the frame),
 * createHead (the headline and the subtitle), createAddIcon and
 * createSourceIcon (null for none), setIconButton (the buttons of a row) and
 * createChoice (a select of the form as another control, null keeps the
 * select), switches (the checkbox of the template as a switch) and
 * selectShapes (the name of a source selects its shapes and More actions
 * has Select, as in the panel Data Sources of Fusion).
 */
DataSourcesLayout.skins = {};

/**
 * The image of More actions (…) of a source, as the images of the buttons
 * of before (Editor.menuImage).
 */
DataSourcesLayout.moreImage = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGhlaWdodD0iMjRweCIgdmlld0JveD0iMCAtOTYwIDk2MCA5NjAiIHdpZHRoPSIyNHB4IiBmaWxsPSIjMDAwMDAwIj48cGF0aCBkPSJNMjQwLTQwMHEtMzMgMC01Ni41LTIzLjVUMTYwLTQ4MHEwLTMzIDIzLjUtNTYuNVQyNDAtNTYwcTMzIDAgNTYuNSAyMy41VDMyMC00ODBxMCAzMy0yMy41IDU2LjVUMjQwLTQwMFptMjQwIDBxLTMzIDAtNTYuNS0yMy41VDQwMC00ODBxMC0zMyAyMy41LTU2LjVUNDgwLTU2MHEzMyAwIDU2LjUgMjMuNVQ1NjAtNDgwcTAgMzMtMjMuNSA1Ni41VDQ4MC00MDBabTI0MCAwcS0zMyAwLTU2LjUtMjMuNVQ2NDAtNDgwcTAtMzMgMjMuNS01Ni41VDcyMC01NjBxMzMgMCA1Ni41IDIzLjVUODAwLTQ4MHEwIDMzLTIzLjUgNTYuNVQ3MjAtNDAwWiIvPjwvc3ZnPg==';

/**
 * Returns the given shapes of a source that can be selected: the visible
 * and selectable ones (the panel Data Sources of Fusion,
 * SimpleDataSources.js, and the Classic skin share it). A shape is visible
 * if it has a state in the view, which the view only has for the shapes it
 * shows: not for those in a hidden layer, a hidden or collapsed group or
 * outside the group that is entered, whose own visible flag is still on.
 */
DataSourcesLayout.getSelectableCells = function(graph, cells)
{
	var result = [];

	if (cells != null)
	{
		for (var i = 0; i < cells.length; i++)
		{
			if (graph.view.getState(cells[i]) != null && graph.isCellVisible(cells[i]) &&
				graph.isCellSelectable(cells[i]))
			{
				result.push(cells[i]);
			}
		}
	}

	return result;
};

/**
 * Selects the shapes of a source that can be selected and scrolls the first
 * into view; add adds them to the selection (Shift or Ctrl/Cmd). Returns
 * the number of shapes it selected.
 */
DataSourcesLayout.selectCells = function(graph, cells, add)
{
	cells = DataSourcesLayout.getSelectableCells(graph, cells);

	if (cells.length > 0)
	{
		if (add)
		{
			graph.addSelectionCells(cells);
		}
		else
		{
			graph.setSelectionCells(cells);
		}

		graph.scrollCellToVisible(cells[0]);
	}

	return cells.length;
};

/**
 * Shows the menu of a source below the given button (as the menus of the
 * rows of Fusion, EditorUi.showSimpleRowMenu): fn(menu, parent) adds the
 * items. With the keyboard the focus goes to the first item.
 */
DataSourcesLayout.showMenu = function(ui, btn, evt, fn)
{
	var menu = new mxPopupMenu(fn);
	menu.div.className += ' geMenubarMenu';
	menu.smartSeparators = true;
	menu.showDisabled = true;
	menu.autoExpand = true;
	menu.hideMenu = mxUtils.bind(menu, function()
	{
		mxPopupMenu.prototype.hideMenu.apply(this, arguments);
		this.destroy();
	});

	var r = btn.getBoundingClientRect();
	menu.popup(r.left, r.bottom + 4, null, evt);
	ui.setCurrentMenu(menu, btn);

	if (evt != null && evt.detail == 0 && typeof menu.focusFirstItem === 'function')
	{
		menu.focusFirstItem();
	}

	return menu;
};

/**
 * Adds the given classes (separated by spaces, null for none) to the given
 * element.
 */
DataSourcesLayout.addClasses = function(elt, classes)
{
	if (elt != null && classes != null && classes.length > 0)
	{
		var names = classes.split(' ');

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
 * Returns the subtitle of the dialogs, the one thing they act on: the page
 * of a file with more than one page, else the file, else the page (a new
 * file has no title until it is saved).
 */
DataSourcesLayout.getSubtitle = function(ui)
{
	var getText = function(value)
	{
		value = (value != null) ? mxUtils.trim(String(value)) : '';

		return (value.length > 0) ? value : null;
	};

	var name = (ui.currentPage != null && ui.pages != null && ui.pages.length > 1) ?
		getText(ui.currentPage.getName()) : null;

	if (name == null)
	{
		var file = ui.getCurrentFile();
		name = (file != null) ? getText(file.getTitle()) : null;
	}

	return (name != null) ? name : mxResources.get('thisPageTitle');
};

/**
 * The Classic skin (docs/dialog-style-guide.md), for Simple: the headline of
 * the dialogs with the page as a hint below it, the rows of the sources on
 * the cards of the theme with the sheet glyph of the template browser, the
 * images of the buttons of before (24 px and more, with their names), the
 * buttons without glyphs, the lists and the checkboxes of the dialog of
 * before and the focus rings as outlines inside of the controls. The CSS is
 * in grapheditor.css under .geDataSources and .geDataSourceForm.
 */
DataSourcesLayout.skins.classic = {
	name: 'classic',
	classes: {sources: 'geDataSources', head: 'geDataSourcesHead', body: 'geDataSourcesBody',
		intro: 'geDialogHint geDataSourcesIntro', list: 'geDataSourcesList', add: 'geDataSourcesAdd',
		footer: 'geDataSourcesFooter', card: 'geDataSourcesRow', row: 'geDataSourcesItem',
		icon: 'geDataSourcesIcon', text: 'geDataSourcesText', line: 'geDataSourcesTitle',
		name: 'geDataSourcesName', url: 'geDataSourcesUrl', info: 'geDialogHint geDataSourcesInfo',
		status: 'geDialogHint geDataSourcesInfo geDataSourcesStatus', error: 'geDataSourcesError',
		actions: 'geDataSourcesActions', form: 'geDataSourceForm', formBody: 'geDataSourceBody',
		section: 'geDataSourceSection', formRow: 'geDataSourceRow', formRowTop: 'geDataSourceRowTop',
		label: 'geDataSourceLabel', control: 'geDataSourceControl', field: 'geDataSourceField-',
		urlRow: 'geDataSourceUrlRow', hint: 'geDialogHint geDataSourceHint',
		state: 'geDialogHint geDataSourceHint geDataSourceState', shapes: 'geDataSourceShapes',
		count: 'geDialogHint geDataSourceCount', columns: 'geDataSourceColumns',
		template: 'geDataSourceTemplate', templateHint: 'geDialogHint geDataSourceHint',
		apply: 'geDialogHint geDataSourceApply', table: 'geDataSourceTable',
		consent: 'geDialogHint geDataSourceConsent', replaced: 'geDataSourcesReplaced',
		select: 'geDataSourcesSelect'},
	switches: false,
	/**
	 * A click on the name of a source selects its shapes (Shift or Ctrl/Cmd
	 * adds them), a double click edits the source and More actions (…) after
	 * Delete has Refresh, Edit..., Select and Delete, as the rows of the
	 * panel Data Sources of Fusion (the driver, 20 November 2026).
	 */
	selectShapes: true,
	/**
	 * Prepares the frame of Data Sources (the size of the dialog of before).
	 */
	prepareSources: function(ui, elt)
	{
		// Empty
	},
	/**
	 * Prepares the frame of the form (the size of the dialog of before).
	 */
	prepareForm: function(ui, elt)
	{
		// Empty
	},
	/**
	 * Returns the headline with the given title and the page below it.
	 */
	createHead: function(ui, title)
	{
		var head = document.createElement('div');
		head.className = 'geDataSourcesHead';

		var h3 = document.createElement('h3');
		mxUtils.write(h3, title);
		head.appendChild(h3);

		var sub = document.createElement('div');
		sub.className = 'geDialogHint';
		mxUtils.write(sub, DataSourcesLayout.getSubtitle(ui));
		head.appendChild(sub);

		return head;
	},
	/**
	 * Returns the glyph of Add Source (none, the buttons of the theme have
	 * no glyphs).
	 */
	createAddIcon: function()
	{
		return null;
	},
	/**
	 * Returns the glyph of a source (the sheet of the template browser) or
	 * null if there is none.
	 */
	createSourceIcon: function()
	{
		return (typeof TemplateBrowser !== 'undefined' && TemplateBrowser.skins != null &&
			TemplateBrowser.skins.classic != null) ?
			TemplateBrowser.skins.classic.createIcon('sheet') : null;
	},
	/**
	 * Makes the given button of a row (the image of before) a button of 24 px
	 * or more with its name for screen readers. Its listeners stay.
	 */
	setIconButton: function(ui, btn, name)
	{
		if (btn != null)
		{
			btn.removeAttribute('style');
			btn.className = 'geBtn geDataSourcesIconBtn';
			btn.setAttribute('type', 'button');
			btn.setAttribute('aria-label', btn.getAttribute('title') || '');

			var img = btn.querySelector('img');

			// The name is on the button
			if (img != null)
			{
				img.setAttribute('alt', '');
			}
		}

		return btn;
	},
	/**
	 * Keeps the given select of the form (null).
	 */
	createChoice: function(select, label)
	{
		return null;
	}
};

/**
 * Returns the skin of the dialogs for the current theme: the skin of Fusion
 * in Fusion (if its scripts are loaded), else the Classic skin.
 */
DataSourcesLayout.getSkin = function()
{
	return (typeof Editor.isSimpleModern === 'function' && Editor.isSimpleModern() &&
		DataSourcesLayout.skins.fusion != null) ? DataSourcesLayout.skins.fusion :
		DataSourcesLayout.skins.classic;
};

/**
 * Returns true if Data Sources and the form of a source have the layout of
 * Fusion: the feature dataSourcesDialog of Editor.featureDefaults
 * (dataSourcesDialog in the configuration and the URL), on in Simple (the
 * driver, 18 November 2026: the dialogs of Fusion for Simple), off in
 * Classic, Sketch, Minimal and Atlas. The theme Fusion always has it.
 */
Editor.isDataSourcesDialogEnabled = function()
{
	return Editor.isFeatureEnabled('dataSourcesDialog');
};

/**
 * Returns true if the dialogs of the data sources get the layout in the
 * Classic skin (Fusion lays them out in SimpleRules.js).
 */
EditorUi.prototype.isDataSourcesLayoutInstalled = function()
{
	return !this.editor.isChromelessView() && Editor.isDataSourcesDialogEnabled() &&
		DataSourcesLayout.getSkin() == DataSourcesLayout.skins.classic;
};

/**
 * Lays out the given Data Sources (DataSourcesDialog) in the Classic skin
 * where the feature is on. Called at the end of its constructor.
 */
EditorUi.prototype.installDataSourcesLayout = function(dlg)
{
	if (this.isDataSourcesLayoutInstalled())
	{
		try
		{
			this.createDataSourcesLayout(dlg, DataSourcesLayout.skins.classic);
		}
		catch (e)
		{
			EditorUi.debug('EditorUi.installDataSourcesLayout', [this], 'error', [e]);
		}
	}
};

/**
 * Lays out the given form of a source (DataSourceDialog) in the Classic
 * skin where the feature is on. Called at the end of its constructor.
 */
EditorUi.prototype.installDataSourceLayout = function(dlg)
{
	if (this.isDataSourcesLayoutInstalled())
	{
		try
		{
			this.createDataSourceLayout(dlg, DataSourcesLayout.skins.classic);
		}
		catch (e)
		{
			EditorUi.debug('EditorUi.installDataSourceLayout', [this], 'error', [e]);
		}
	}
};

/**
 * Lays out the given Data Sources (DataSourcesDialog) in the given skin:
 * the headline and the page, the sources as rows with their link, columns,
 * shapes and the last refresh, Refresh, Edit and Delete at the end of each
 * row, Add Source below the rows, Close and Refresh All, the primary action
 * (the sources are written when they are added, edited or deleted, so there
 * is nothing to apply), in the footer. Keeps the layout of before if the
 * dialog has changed.
 */
EditorUi.prototype.createDataSourcesLayout = function(dlg, skin)
{
	var ui = this;
	var c = dlg.controls;
	var elt = dlg.container;
	var scroll = elt.firstChild;
	var buttons = elt.lastChild;
	var classes = skin.classes;

	// Keeps the previous layout if the dialog has changed
	if (c == null || c.list == null || c.render == null || c.ok == null || c.add == null ||
		scroll == null || buttons == null || scroll == buttons || c.ok.parentNode != buttons)
	{
		return;
	}

	var content = c.list.parentNode;
	DataSourcesLayout.addClasses(elt, classes.sources);
	skin.prepareSources(this, elt);

	elt.insertBefore(skin.createHead(this, mxResources.get('dataSources')), scroll);
	c.title.classList.add(classes.replaced);
	DataSourcesLayout.addClasses(scroll, classes.body);
	c.hint.className = classes.intro;
	c.hint.removeAttribute('style');
	c.list.className = classes.list;

	var addRow = document.createElement('div');
	addRow.className = classes.add;
	content.insertBefore(addRow, c.add);
	addRow.appendChild(c.add);
	c.add.style.marginLeft = '';
	var addIcon = skin.createAddIcon();

	if (addIcon != null)
	{
		c.add.insertBefore(addIcon, c.add.firstChild);
	}

	// Refresh All is the primary action (a verb), Close the secondary one
	// (the dialog writes every change at once, report 13.1)
	if (c.refreshAll != null)
	{
		c.ok.classList.remove('gePrimaryBtn');
		c.refreshAll.classList.add('gePrimaryBtn');
		buttons.appendChild(c.refreshAll);
	}

	DataSourcesLayout.addClasses(buttons, classes.footer);

	c.decorateCard = function(card, p)
	{
		card.className = classes.card;
		var row = p.row;
		row.className = classes.row;
		row.removeAttribute('style');

		var icon = document.createElement('span');
		icon.className = classes.icon;
		var glyph = skin.createSourceIcon();

		if (glyph != null)
		{
			icon.appendChild(glyph);
		}

		var text = document.createElement('div');
		text.className = classes.text;
		p.name.className = classes.name;
		p.name.removeAttribute('style');
		p.url.className = classes.url;
		p.url.removeAttribute('style');
		var line = document.createElement('div');
		line.className = classes.line;
		line.appendChild(p.name);
		line.appendChild(p.url);
		text.appendChild(line);

		p.info.className = classes.info;
		p.info.removeAttribute('style');
		text.appendChild(p.info);

		if (p.status != null)
		{
			p.status.removeAttribute('style');
			p.status.className = classes.status +
				((p.state != null && p.state.error != null) ? ' ' + classes.error : '');
			text.appendChild(p.status);
		}

		var actions = document.createElement('div');
		actions.className = classes.actions;
		actions.appendChild(skin.setIconButton(ui, p.refresh, 'refresh'));
		actions.appendChild(skin.setIconButton(ui, p.edit, 'edit'));
		actions.appendChild(skin.setIconButton(ui, p.remove, 'trash'));

		if (skin.selectShapes && p.source != null)
		{
			ui.addDataSourceSelection(p, line, actions, skin);
		}

		while (card.firstChild != null)
		{
			card.removeChild(card.firstChild);
		}

		row.textContent = '';
		row.appendChild(icon);
		row.appendChild(text);
		row.appendChild(actions);
		card.appendChild(row);
	};

	c.render();

	// Refresh All only for pages with sources
	var updateRefresh = function()
	{
		if (c.refreshAll != null)
		{
			c.refreshAll.disabled = c.list.children.length == 0;
		}
	};

	updateRefresh();

	if (window.MutationObserver != null)
	{
		new MutationObserver(updateRefresh).observe(c.list, {childList: true});
	}
};

/**
 * Adds the selection of the shapes to the given parts of a source (p of
 * decorateCard) in the given line and actions, as the rows of the panel
 * Data Sources of Fusion (SimpleDataSources.js): the name is a button whose
 * click selects the shapes of the source that can be selected (Shift or
 * Ctrl/Cmd adds them to the selection) and whose double click edits the
 * source, and More actions (…) after Delete has Refresh, Edit..., Select
 * (selects the shapes and closes the dialog, so they are seen; off without
 * shapes to select), a line and Delete. The items call the buttons of the
 * row, so they do what the buttons do. The dialog is modal, so a click on
 * the name keeps it open (to add the shapes of more sources).
 */
EditorUi.prototype.addDataSourceSelection = function(p, line, actions, skin)
{
	var ui = this;
	var graph = this.editor.graph;
	var classes = skin.classes;
	var cells = p.linked || [];

	// The name of the source as a button, with its text as the name (the
	// source is a name the user typed: written as text). The tooltip has the
	// whole name, which the button cuts at its width, and the action
	var name = document.createElement('button');
	name.setAttribute('type', 'button');
	name.className = classes.name + ' ' + classes.select;
	name.setAttribute('title', p.source.id + ' \u2013 ' + mxResources.get('selectShapes'));
	mxUtils.write(name, p.source.id);

	mxEvent.addListener(name, 'click', function(evt)
	{
		if (!(evt.detail > 1))
		{
			DataSourcesLayout.selectCells(graph, cells, mxEvent.isShiftDown(evt) ||
				mxEvent.isControlDown(evt) || mxEvent.isMetaDown(evt));
		}

		mxEvent.consume(evt);
	});

	mxEvent.addListener(name, 'dblclick', function(evt)
	{
		p.edit.click();
		mxEvent.consume(evt);
	});

	line.replaceChild(name, p.name);
	p.name = name;

	var more = document.createElement('button');
	more.setAttribute('title', mxResources.get('moreActions'));
	more.setAttribute('aria-haspopup', 'menu');
	var img = document.createElement('img');
	img.className = 'geAdaptiveAsset';
	img.setAttribute('src', DataSourcesLayout.moreImage);
	more.appendChild(img);

	mxEvent.addListener(more, 'click', function(evt)
	{
		DataSourcesLayout.showMenu(ui, more, evt, function(menu, parent)
		{
			menu.addItem(mxResources.get('refresh'), null, function()
			{
				p.refresh.click();
			}, parent);

			menu.addItem(mxResources.get('edit') + '...', null, function()
			{
				p.edit.click();
			}, parent);

			menu.addItem(mxResources.get('select'), null, function()
			{
				if (DataSourcesLayout.selectCells(graph, cells) > 0)
				{
					ui.hideDialog();
				}
			}, parent, null, DataSourcesLayout.getSelectableCells(graph, cells).length > 0);

			menu.addSeparator(parent);

			menu.addItem(mxResources.get('delete'), null, function()
			{
				p.remove.click();
			}, parent);
		});

		mxEvent.consume(evt);
	});

	actions.appendChild(skin.setIconButton(this, more, 'more'));
	p.more = more;
};

/**
 * Lays out the given Add Source or Edit of a data source (DataSourceDialog)
 * in the given skin as a form: the name and the link with Preview, then the
 * key column, the columns, missing rows and the shapes (as the skin chooses),
 * the template as code and the first rows of the preview. The controls of
 * the dialog move into the rows, so OK writes the source as before. Keeps
 * the layout of before if the dialog has changed.
 */
EditorUi.prototype.createDataSourceLayout = function(dlg, skin)
{
	var c = dlg.controls;
	var elt = dlg.container;
	var scroll = elt.firstChild;
	var buttons = elt.lastChild;
	var classes = skin.classes;

	// Keeps the previous layout if the dialog has changed
	if (c == null || c.section == null || c.options == null || c.ok == null ||
		scroll == null || buttons == null || scroll == buttons || c.ok.parentNode != buttons)
	{
		return;
	}

	DataSourcesLayout.addClasses(elt, classes.form);
	skin.prepareForm(this, elt);

	elt.insertBefore(skin.createHead(this, (c.isNew) ? mxResources.get('addSource') :
		c.name.value), scroll);
	c.title.classList.add(classes.replaced);
	DataSourcesLayout.addClasses(scroll, classes.formBody);

	// The rows of the previous look become form rows
	var formRow = function(row, top)
	{
		var label = row.firstChild;
		row.className = classes.formRow + ((top) ? ' ' + classes.formRowTop : '');
		row.removeAttribute('style');
		var lbl = document.createElement('label');
		DataSourcesLayout.addClasses(lbl, classes.label);
		mxUtils.write(lbl, mxUtils.trim(label.textContent).replace(/:$/, ''));
		row.replaceChild(lbl, label);
		var ctl = document.createElement('div');
		ctl.className = classes.control;

		while (lbl.nextSibling != null)
		{
			ctl.appendChild(lbl.nextSibling);
		}

		row.appendChild(ctl);
		var field = ctl.querySelector('input:not([type="checkbox"]), select, textarea');

		if (field != null)
		{
			if (field.id == null || field.id == '')
			{
				field.id = classes.field + Editor.guid();
			}

			lbl.setAttribute('for', field.id);
		}

		return ctl;
	};

	var sections = [c.section, c.options];

	for (var i = 0; i < sections.length; i++)
	{
		sections[i].classList.remove('geDialogSection');
		DataSourcesLayout.addClasses(sections[i], classes.section);
		var rows = sections[i].querySelectorAll(':scope>.geDialogFormRow');

		for (var j = 0; j < rows.length; j++)
		{
			formRow(rows[j], rows[j].classList.contains('geDialogFormRowTop'));
		}
	}

	// The link: the field, Preview, the hint and the state of the preview
	var urlCtl = c.url.parentNode;
	DataSourcesLayout.addClasses(urlCtl, classes.urlRow);
	c.preview.style.flex = '';
	c.url.setAttribute('placeholder', 'https://');
	c.urlHint.className = classes.hint;
	c.urlHint.removeAttribute('style');
	c.status.className = classes.state;
	c.status.style.marginTop = '';
	c.status.setAttribute('aria-live', 'polite');

	// Missing rows and the shapes as the skin chooses (toggle groups that
	// set the selects in Fusion, the selects in the Classic skin)
	skin.createChoice(c.missing, mxResources.get('missingRows'));
	skin.createChoice(c.shapes, mxResources.get('shapes'));
	var shapesCtl = c.shapes.parentNode;
	DataSourcesLayout.addClasses(shapesCtl, classes.shapes);
	DataSourcesLayout.addClasses(shapesCtl.parentNode, classes.formRowTop);
	c.property.setAttribute('aria-label', mxResources.get('property'));
	c.linkCount.className = classes.count;
	c.linkCount.style.flex = '';
	c.linkCount.style.marginLeft = '';
	c.linkCount.style.whiteSpace = '';

	// The columns as chips (Fusion) or checkboxes (Classic)
	c.columns.className = classes.columns;
	c.columns.removeAttribute('style');
	c.columns.setAttribute('role', 'group');
	c.columns.setAttribute('aria-label', mxResources.get('columns'));

	// The template as code
	c.template.className = classes.template;
	c.template.style.fontFamily = '';
	c.template.style.fontSize = '';
	c.template.setAttribute('aria-label', mxResources.get('template'));
	c.templateHint.className = classes.templateHint;
	c.templateHint.style.marginTop = '';

	if (c.apply != null)
	{
		c.apply.classList.remove('geDialogHint');
		DataSourcesLayout.addClasses(c.apply, classes.apply);
		c.apply.style.gap = '';
		c.apply.style.marginTop = '';
		var cb = c.apply.querySelector('input[type="checkbox"]');

		if (cb != null && skin.switches)
		{
			cb.setAttribute('role', 'switch');
		}
	}

	// The first rows of the preview
	c.table.className = classes.table;
	c.table.removeAttribute('style');
	c.table.setAttribute('tabindex', '0');
	c.table.setAttribute('aria-label', mxResources.get('preview'));

	c.consent.className = classes.consent;

	// The primary action says what it does
	if (mxUtils.trim(c.ok.textContent) == mxResources.get('ok'))
	{
		c.ok.textContent = (c.isNew) ? mxResources.get('addSource') : mxResources.get('apply');
	}

	// Enter in a field applies, in the link it shows the preview
	mxEvent.addListener(elt, 'keydown', function(evt)
	{
		var target = mxEvent.getSource(evt);

		if (evt.key == 'Enter' && !evt.isComposing && target != null &&
			target.nodeName == 'INPUT' && target.type != 'checkbox')
		{
			if (target == c.url)
			{
				c.preview.click();
			}
			else
			{
				c.ok.click();
			}

			mxEvent.consume(evt);
		}
		else if (evt.key == 'Enter' && target == c.template &&
			(mxEvent.isControlDown(evt) || (mxClient.IS_MAC && evt.metaKey)))
		{
			c.ok.click();
			mxEvent.consume(evt);
		}
	});
};
