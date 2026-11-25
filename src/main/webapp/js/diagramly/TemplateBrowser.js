/**
 * Copyright (c) 2026, JGraph Holdings Ltd
 * Copyright (c) 2026, draw.io AG
 */
/**
 * The Browser template of the New dialog in every look (concept "Fusion
 * ideas in Simple and Classic", C5: File › New… with categories, search and
 * Start from): New diagram (File › New…, the start screen, the Home dialog)
 * and Insert › Template… as a large dialog with the headline, the
 * categories on the left, a search field, a row of chips to start from and
 * the tiles of the chosen category with their pictures, and the name, the
 * format and the place of the file in the footer. The controls of the
 * dialog move into the new layout with their listeners or stay hidden and
 * are driven (see NewDialog.controls), so the dialog creates and inserts as
 * before.
 *
 * The layout (EditorUi.createTemplateBrowser) takes a skin: the Classic
 * skin (TemplateBrowser.skins.classic, docs/dialog-style-guide.md, its CSS
 * in grapheditor.css under .geBrowser, which takes the colors, the font and
 * the corners of the other dialogs of the theme) for Classic, Simple,
 * Sketch, Minimal and Atlas, behind the feature newDialog of
 * Editor.featureDefaults (Editor.isNewDialogEnabled), or the skin of Fusion,
 * which SimpleBrowser.js adds (TemplateBrowser.skins.fusion), so the code
 * exists once. The dialog of before stays below the browser (its controls
 * are driven) and is shown as it was where the feature is off.
 */
var TemplateBrowser = {};

/**
 * Size of the content of the browser in the Classic skin (the frame adds
 * 48), limited to the window (EditorUi.getNewDialogSize).
 */
TemplateBrowser.size = {width: 1132, height: 692};

/**
 * Space between the frame of the browser and the window in the Classic skin.
 */
TemplateBrowser.windowMargin = 32;

/**
 * The outline glyphs of the browser (on a 24 grid, stroke 1.8, round caps),
 * as Fusion draws its icons (SimpleUi.createSvgIcon): Fusion shows the same
 * glyphs (SimpleUi.icons, the test new-dialog-glyphs of test/classic-simple
 * compares them) and builds the ones of the categories from this table
 * (SimpleBrowser.js).
 */
TemplateBrowser.glyphs = {
	shapes: '<circle cx="9" cy="9" r="5"/><path d="M11 13h8.5v7H11z" />',
	text: '<path d="M6 7V5h12v2M12 5v14M9.5 19h5"/>',
	cloud: '<path d="M7 18.5h10.5a4 4 0 0 0 .6-8 6 6 0 0 0-11.5 1.2A3.5 3.5 0 0 0 7 18.5z"/>',
	code: '<path d="M8.5 7l-5 5 5 5M15.5 7l5 5-5 5"/>',
	sheet: '<rect x="3.5" y="4.5" width="17" height="15" rx="1.5"/>' +
		'<path d="M3.5 9.5h17M3.5 14.5h17M9.5 4.5v15"/>',
	layout: '<rect x="3.5" y="4" width="7" height="5" rx="1.2"/>' +
		'<rect x="13.5" y="15" width="7" height="5" rx="1.2"/><path d="M7 9v8.5h6.5M13.5 6.5H20v8.5"/>',
	page: '<path d="M6.5 3.5h7.5l4 4v13h-11.5z"/><path d="M14 3.5v4h4"/>',
	plus: '<path d="M12 5v14M5 12h14"/>',
	list: '<path d="M8 6h12M8 12h12M8 18h12M4 6h.01M4 12h.01M4 18h.01"/>',
	search: '<circle cx="10.5" cy="10.5" r="6"/><path d="M15 15l5 5"/>',
	close: '<path d="M6 6l12 12M18 6L6 18"/>',
	sparkle: '<path d="M10 3.5l1.6 4.4 4.4 1.6-4.4 1.6L10 15.5l-1.6-4.4L4 9.5l4.4-1.6z' +
		'M17.5 13.5l.8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8z"/>',
	briefcase: '<rect x="3.5" y="7.5" width="17" height="12" rx="2"/>' +
		'<path d="M9 7.5v-2A1.5 1.5 0 0 1 10.5 4h3A1.5 1.5 0 0 1 15 5.5v2M3.5 12.5h17"/>',
	chart: '<path d="M4 20h16M7 16.5v-5M12 16.5v-10M17 16.5v-7"/>',
	flow: '<rect x="8.5" y="3" width="7" height="4.5" rx="1"/>' +
		'<path d="M12 7.5v3M12 10.5l3.5 3-3.5 3-3.5-3zM12 16.5V21"/>',
	map: '<path d="M9 4.5l-5 2v13l5-2 6 2 5-2v-13l-5 2z"/><path d="M9 4.5v13M15 6.5v13"/>',
	network: '<rect x="9.5" y="3.5" width="5" height="4" rx="1"/>' +
		'<rect x="3.5" y="16.5" width="5" height="4" rx="1"/><rect x="15.5" y="16.5" width="5" height="4" rx="1"/>' +
		'<path d="M12 7.5V12M6 16.5V12h12v4.5"/>',
	grid: '<rect x="4" y="4" width="6.5" height="6.5" rx="1.5"/>' +
		'<rect x="13.5" y="4" width="6.5" height="6.5" rx="1.5"/><rect x="4" y="13.5" width="6.5" height="6.5" rx="1.5"/>' +
		'<rect x="13.5" y="13.5" width="6.5" height="6.5" rx="1.5"/>',
	layers: '<path d="M12 4 3.5 8.5 12 13l8.5-4.5z"/><path d="M3.5 12.5 12 17l8.5-4.5"/>' +
		'<path d="M3.5 16.5 12 21l8.5-4.5"/>',
	venn: '<circle cx="9.5" cy="12" r="5.5"/><circle cx="14.5" cy="12" r="5.5"/>',
	window: '<rect x="3.5" y="4.5" width="17" height="15" rx="2"/>' +
		'<path d="M3.5 9h17M6.5 6.8h.01M9 6.8h.01"/>',
	folder: '<path d="M3.5 7A1.5 1.5 0 0 1 5 5.5h4l2 2h8A1.5 1.5 0 0 1 20.5 9v8.5A1.5 1.5 0 0 1 19 19H5a1.5 ' +
		'1.5 0 0 1-1.5-1.5z"/>',
	database: '<ellipse cx="12" cy="6" rx="7" ry="2.5"/><path d="M5 6v12c0 1.4 3.1 2.5 7 2.5s7-1.1 ' +
		'7-2.5V6M5 12c0 1.4 3.1 2.5 7 2.5s7-1.1 7-2.5"/>',
	mermaid: '<path d="M5 18.5V6l7 8 7-8v12.5"/>',
	cpu: '<rect x="7" y="7" width="10" height="10" rx="1.5"/><path d="M10 3.5V7M14 3.5V7M10 17v3.5' +
		'M14 17v3.5M3.5 10H7M3.5 14H7M17 10h3.5M17 14h3.5"/>',
	chevronDown: '<path d="M6 9.5l6 6 6-6"/>',
	drive: '<path d="M9 4h6l6 10.5-3 5H6l-3-5z"/><path d="M3 14.5h18M9 4l6 10.5M15 4 9 14.5"/>',
	branch: '<circle cx="6.5" cy="6" r="2.3"/><circle cx="6.5" cy="18" r="2.3"/>' +
		'<circle cx="17.5" cy="7.5" r="2.3"/><path d="M6.5 8.3v7.4M17.5 9.8c0 4.2-5.5 3.2-9.5 6.4"/>',
	gitlab: '<path d="M12 20 3.5 13l2.2-8 2.6 6.2h7.4L18.3 5l2.2 8z"/>',
	board: '<rect x="3.5" y="3.5" width="17" height="17" rx="2"/><rect x="6.5" y="6.5" width="4" height="10" rx=".8"/>' +
		'<rect x="13.5" y="6.5" width="4" height="6" rx=".8"/>',
	device: '<rect x="4.5" y="5.5" width="15" height="10" rx="1.5"/><path d="M2.5 18.5h19"/>',
	link: '<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"/>' +
		'<path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/>'
};

/**
 * The glyphs of the categories of templates (names of the glyphs); custom
 * categories have a folder, unknown ones a page.
 */
TemplateBrowser.categoryGlyphs = {basic: 'shapes', fromText: 'text', business: 'briefcase', charts: 'chart',
	cloud: 'cloud', engineering: 'cpu', flowcharts: 'flow', maps: 'map', network: 'network', other: 'grid',
	software: 'code', tables: 'sheet', uml: 'layers', venn: 'venn', wireframes: 'window', layout: 'layout'};

/**
 * The entries of Start from (the titles of the blank diagram, of the
 * entries of From Text and of Generate) with their glyph, their name in the
 * row of chips (the names of the concept: Blank, From text, From Mermaid,
 * From a sheet, Generate; the title of the entry if none), in the order of
 * the row. Entries of From Text that are not here (SQL, PlantUML) stay
 * in the category From Text, with their own names.
 */
TemplateBrowser.startTemplates = [
	{title: 'blankDiagram', icon: 'plus'},
	{title: 'text', name: 'fromText', icon: 'list'},
	{title: 'mermaid', name: 'fromMermaid', icon: 'mermaid'},
	{title: 'csv', name: 'fromSheet', icon: 'sheet'},
	{title: 'generate', icon: 'sparkle'}];

/**
 * The glyphs of the templates without a picture (the entries of From Text).
 */
TemplateBrowser.textTemplateGlyphs = {text: 'list', mermaid: 'mermaid', formatSql: 'database',
	csv: 'sheet', plantUml: 'code', blankDiagram: 'plus', generate: 'sparkle'};

/**
 * From a template in Start from (the driver, 20 November 2026, sketch yeag):
 * the glyph of its chip and the glyphs of the places of its menu and of the
 * chosen file (App.MODE_* and url; the storages of File › Open from, drawn
 * in the stroke of the glyphs, no logos).
 */
TemplateBrowser.templateFileGlyph = 'folder';

TemplateBrowser.templateFileGlyphs = {google: 'drive', onedrive: 'cloud', m365: 'grid', github: 'branch',
	gitlab: 'gitlab', trello: 'board', browser: 'window', device: 'device', url: 'link'};

/**
 * Returns the image of the given glyph (TemplateBrowser.glyphs) as a data
 * URI, or null if there is no such glyph.
 */
TemplateBrowser.getGlyphImage = function(name)
{
	return (name != null && Object.prototype.hasOwnProperty.call(TemplateBrowser.glyphs, name)) ?
		Editor.createSvgDataUri('<svg xmlns="http://www.w3.org/2000/svg" ' +
			'viewBox="0 0 24 24" fill="none" stroke="#000" stroke-width="1.8" ' +
			'stroke-linecap="round" stroke-linejoin="round">' +
			TemplateBrowser.glyphs[name] + '</svg>') : null;
};

/**
 * The skins of the browser. A skin has the classes of the parts (footer is
 * optional) and the
 * builders of its parts: createIcon (null for an unknown glyph),
 * createSectionHead, createClearButton, nameWithDetail, createPlaceIcon and
 * getSubtitle (see TemplateBrowser.skins.classic), and optionally
 * addMenuIcon (the glyph of an item of the menu of From a template; the
 * menus of Classic have none). The skin of Fusion is added by
 * SimpleBrowser.js.
 */
TemplateBrowser.skins = {};

/**
 * The Classic skin (docs/dialog-style-guide.md), for Classic, Simple,
 * Sketch, Minimal and Atlas: the colors of their dialogs light and dark,
 * the glyphs as masks in the color of the text, the headline of the
 * dialogs, the titles of the Preview template. The CSS
 * is in grapheditor.css under .geBrowser (below 640 px the
 * categories are a row above the tiles).
 */
TemplateBrowser.skins.classic = {
	name: 'classic',
	classes: {browser: 'geBrowser', head: 'geBrowserHead',
		subtitle: 'geDialogHint geBrowserSubtitle', body: 'geBrowserBody',
		cats: 'geBrowserCats', cat: 'geBrowserCat', sub: 'geBrowserSub',
		catName: 'geBrowserCatName', count: 'geBrowserCount', on: 'geBrowserOn',
		main: 'geBrowserMain', tabs: 'geBrowserTabs', search: 'geBrowserSearch',
		start: 'geBrowserStart', startTile: 'geBrowserStartTile',
		startMenu: 'geBrowserStartMenu', startFile: 'geBrowserStartFile',
		startFileName: 'geBrowserStartFileName', startRemove: 'geBrowserStartRemove',
		generate: 'geBrowserGenerate', gridHead: 'geBrowserGridHead',
		grid: 'geBrowserGrid', picture: 'geBrowserIcon', file: 'geBrowserFile',
		name: 'geBrowserName', type: 'geBrowserType', place: 'geBrowserPlace',
		placeName: 'geBrowserPlaceName', placePick: 'geBrowserPlacePick',
		placeSelect: 'geBrowserPlaceSelect',
		linkBtn: 'geBrowserLinkBtn', replaced: 'geBrowserReplaced',
		footer: 'geBrowserFooter'},
	/**
	 * Returns a new glyph of the given name: a mask in the color of the
	 * text, so that it follows dark mode, or null if there is no such glyph.
	 */
	createIcon: function(name)
	{
		var image = TemplateBrowser.getGlyphImage(name);
		var icon = null;

		if (image != null)
		{
			icon = document.createElement('span');
			icon.className = 'geBrowserGlyph';
			icon.style.setProperty('--ge-browser-glyph', 'url(\'' + image + '\')');
			icon.setAttribute('aria-hidden', 'true');
		}

		return icon;
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
	 * Returns the button that clears the search.
	 */
	createClearButton: function(title, fn)
	{
		var btn = document.createElement('button');
		btn.setAttribute('type', 'button');
		btn.className = 'geBrowserClear';
		btn.setAttribute('title', title);
		btn.setAttribute('aria-label', title);
		btn.appendChild(this.createIcon('close'));

		mxEvent.addListener(btn, 'click', function(evt)
		{
			fn(evt);
			mxEvent.consume(evt);
		});

		return btn;
	},
	/**
	 * Returns the given name with the given number, as the list of the
	 * dialog of before shows them.
	 */
	nameWithDetail: function(name, detail)
	{
		return name + ' (' + detail + ')';
	},
	/**
	 * Returns the logo of the given storage (App.storages), as the dialog of
	 * before shows it.
	 */
	createPlaceIcon: function(ui, storage, mode)
	{
		var img = null;

		if (storage != null && storage.logo != null)
		{
			img = document.createElement('img');
			img.setAttribute('src', IMAGE_PATH + '/' + storage.logo);
			img.setAttribute('alt', '');
		}

		return img;
	},
	/**
	 * Returns the subtitle of Insert › Template (none).
	 */
	getSubtitle: function(ui)
	{
		return null;
	}
};

/**
 * Returns the skin of the browser for the current theme: the skin of Fusion
 * in Fusion (if its scripts are loaded), else the Classic skin.
 */
TemplateBrowser.getSkin = function()
{
	return (typeof Editor.isSimpleModern === 'function' && Editor.isSimpleModern() &&
		TemplateBrowser.skins.fusion != null) ? TemplateBrowser.skins.fusion :
		TemplateBrowser.skins.classic;
};

/**
 * Returns true if New and Insert › Template show the Browser template: the
 * feature newDialog of Editor.featureDefaults (newDialog in the
 * configuration and the URL), on in Classic, Simple, Sketch, Minimal and
 * Atlas in the web app, the desktop app and the embed mode and off in
 * Confluence and Jira (atlas=1), which get it later. The theme Fusion
 * always has it.
 */
Editor.isNewDialogEnabled = function()
{
	return Editor.isFeatureEnabled('newDialog');
};

/**
 * Lays out the given New dialog on the Browser template in the Classic skin
 * where the feature is on (Fusion lays it out in SimpleBrowser.js). Called at
 * the end of the constructor of NewDialog. Dialogs that only ask for the
 * name (offline, stealth and lockdown) keep their layout.
 */
EditorUi.prototype.installTemplateBrowser = function(dlg, callback)
{
	if (!this.editor.isChromelessView() && Editor.isNewDialogEnabled() &&
		TemplateBrowser.getSkin() == TemplateBrowser.skins.classic)
	{
		try
		{
			this.createTemplateBrowser(dlg, callback, TemplateBrowser.skins.classic);
		}
		catch (e)
		{
			EditorUi.debug('EditorUi.installTemplateBrowser', [this], 'error', [e]);
		}
	}
};

/**
 * Returns the size of the content of the given New dialog: the size of the
 * browser (TemplateBrowser.size) limited to the window if the dialog is on
 * the Browser template in the Classic skin, else the given size. Fusion
 * sizes its frame itself.
 */
EditorUi.prototype.getNewDialogSize = function(dlg, width, height)
{
	if (dlg != null && dlg.templateBrowser != null &&
		dlg.templateBrowser.skin == TemplateBrowser.skins.classic)
	{
		var ww = window.innerWidth || document.documentElement.clientWidth;
		var wh = window.innerHeight || document.documentElement.clientHeight;
		var margin = 48 + ((ww < 640) ? 0 : TemplateBrowser.windowMargin);

		width = Math.max(Math.min(TemplateBrowser.size.width, ww - margin), 240);
		height = Math.max(Math.min(TemplateBrowser.size.height, wh - margin), 240);
	}

	return {width: width, height: height};
};

/**
 * Returns the name of the given category of templates.
 */
EditorUi.prototype.getTemplateCategoryName = function(cat)
{
	return mxResources.get(cat, null, cat.substring(0, 1).toUpperCase() + cat.substring(1));
};

/**
 * Replaces the layout of the given New dialog with the Browser template in
 * the given skin. Returns the layout ({skin, head, body, cats, main, search,
 * grid, file, templateFile: From a template, see createNewDialogTemplateFile,
 * or null}) and puts it on the dialog (templateBrowser), or returns null
 * if the dialog keeps its layout (it has changed or has no templates).
 */
EditorUi.prototype.createTemplateBrowser = function(dlg, callback, skin)
{
	var ui = this;
	var c = dlg.controls;
	var elt = dlg.container;
	var cls = skin.classes;

	// Keeps the previous layout if the dialog has changed or has no
	// templates (offline it only asks for the name)
	if (c == null || c.compact || c.templates == null || c.list == null || c.buttons == null ||
		c.templates.parentNode != elt || c.list.parentNode != elt || c.buttons.parentNode != elt ||
		c.search == null || c.addTemplate == null)
	{
		return null;
	}

	// The glyph of the given name, else the one of the fallback
	var createIcon = function(name, fallback)
	{
		var icon = skin.createIcon(name);

		return (icon == null && fallback != null) ? skin.createIcon(fallback) : icon;
	};

	var grid = c.templates;
	elt.classList.add.apply(elt.classList, cls.browser.split(' '));

	// The headline: New diagram, or Templates (insert into the page)
	var head = document.createElement('div');
	head.className = cls.head;
	var h3 = document.createElement('h3');
	mxUtils.write(h3, mxResources.get((c.name != null) ? 'newDiagram' : 'templates'));
	head.appendChild(h3);

	var subtitle = (c.name == null && callback != null && this.getCurrentFile() != null) ?
		skin.getSubtitle(this) : null;

	if (subtitle != null)
	{
		var sub = document.createElement('div');
		sub.className = cls.subtitle;
		mxUtils.write(sub, subtitle);
		head.appendChild(sub);
	}

	elt.insertBefore(head, elt.firstChild);

	var body = document.createElement('div');
	body.className = cls.body;
	elt.insertBefore(body, c.buttons);

	// The categories: rows that click the entries of the hidden list
	var cats = document.createElement('div');
	cats.className = cls.cats;
	cats.setAttribute('role', 'tablist');
	cats.setAttribute('aria-orientation', 'vertical');
	cats.setAttribute('aria-label', mxResources.get('templates'));
	body.appendChild(cats);

	var main = document.createElement('div');
	main.className = cls.main;
	body.appendChild(main);

	c.list.classList.add(cls.replaced);
	c.searchBox.classList.add(cls.replaced);

	if (c.header != null && c.header.parentNode == elt)
	{
		c.header.classList.add(cls.replaced);
	}

	// Recent and search of embeds (see EditorUi.js, action template)
	if (c.tabs != null && c.tabs.parentNode == elt)
	{
		c.tabs.style.cssText = '';
		c.tabs.classList.add(cls.tabs);
		main.appendChild(c.tabs);
	}

	// The search field with the input of the dialog, which searches as
	// the user types (the dialog searches on Enter)
	var search = document.createElement('div');
	search.className = cls.search;
	search.appendChild(createIcon('search'));
	c.search.style.cssText = '';
	c.search.setAttribute('placeholder', mxResources.get('searchTemplates'));
	c.search.setAttribute('aria-label', mxResources.get('searchTemplates'));
	c.search.setAttribute('autocomplete', 'off');
	c.search.setAttribute('spellcheck', 'false');
	search.appendChild(c.search);
	main.appendChild(search);

	var searched = '';
	var searchThread = null;

	var doSearch = function(value)
	{
		window.clearTimeout(searchThread);
		searchThread = null;

		if (value != searched)
		{
			searched = value;
			dlg.searchTemplates(value);
		}
	};

	// Clear always empties the field and shows the templates again, also
	// for terms the dialog was opened with (searchTemplates) and for text
	// whose search has not run yet
	var clear = skin.createClearButton(mxResources.get('reset'), function()
	{
		window.clearTimeout(searchThread);
		searchThread = null;
		searched = '';
		c.search.value = '';
		dlg.searchTemplates('');
		c.search.focus();
	});
	search.appendChild(clear);

	mxEvent.addListener(c.search, 'input', function()
	{
		window.clearTimeout(searchThread);
		searchThread = window.setTimeout(function()
		{
			doSearch(c.search.value);
		}, 250);
	});

	// Enter searches at once (the listener of the dialog)
	mxEvent.addListener(c.search, 'keydown', function(evt)
	{
		if (evt.keyCode == 13)
		{
			window.clearTimeout(searchThread);
			searchThread = null;
			searched = c.search.value;
		}
	});

	// Start from: the blank diagram, entries of From Text and Generate
	// as one row of chips (mockup 12, calm variant, Part E); they are
	// templates of the dialog (select, double click, Enter creates), so
	// they leave the categories (From Text keeps all)
	var categories = c.getCategories();
	var basic = categories['basic'] || [];
	var textEntries = categories['fromText'] || [];
	var starts = [];

	for (var i = 0; i < TemplateBrowser.startTemplates.length; i++)
	{
		var def = TemplateBrowser.startTemplates[i];
		var tmp = null;

		for (var j = 0; j < basic.length && tmp == null; j++)
		{
			if (basic[j].title == def.title && basic[j].url == null)
			{
				tmp = basic[j];
				basic.splice(j, 1);
			}
		}

		for (var j = 0; j < textEntries.length && tmp == null; j++)
		{
			if (textEntries[j].title == def.title)
			{
				tmp = {title: textEntries[j].title, action: textEntries[j].action};
			}
		}

		if (tmp != null)
		{
			starts.push({tmp: tmp, def: def});
		}
	}

	var startHead = null;
	var startRow = null;
	var generateTile = null;
	var generatePanel = null;
	var templateFile = null;

	if (starts.length > 0)
	{
		startHead = skin.createSectionHead(mxResources.get('startFrom'));
		main.appendChild(startHead);
		startRow = document.createElement('div');
		startRow.className = cls.start;
		main.appendChild(startRow);

		for (var i = 0; i < starts.length; i++)
		{
			var tile = c.addTemplate(starts[i].tmp);
			tile.classList.add(cls.startTile);

			// The name of the concept in the label of the dialog (its title,
			// the name of the entry in From Text, stays the tooltip)
			var label = (starts[i].def.name != null) ? tile.querySelector('span') : null;

			if (label != null)
			{
				label.textContent = '';
				mxUtils.write(label, mxResources.get(starts[i].def.name));
			}

			// The glyph before the name (calm variant: no hint, the title of
			// the template stays the tooltip)
			var glyph = createIcon(starts[i].def.icon);

			if (glyph != null)
			{
				tile.insertBefore(glyph, tile.firstChild);
			}

			startRow.appendChild(tile);

			if (starts[i].tmp.type == 'generative')
			{
				generateTile = tile;
			}
		}

		// From a template: a file of a storage or of a URL as the template, at
		// the end of the row (it replaces From Template URL of the footer)
		if (c.templateFile != null)
		{
			templateFile = this.createNewDialogTemplateFile(dlg, skin, startRow,
				(starts[0].def.title == 'blankDiagram') ? startRow.firstChild : null);
		}

		// The blank diagram is chosen first, as in the previous look
		var first = startRow.firstChild;

		if (starts[0].def.title == 'blankDiagram' && first != null)
		{
			first.click();
		}
	}

	// The form of Generate and its result below the row (the tile is too
	// small for them)
	if (generateTile != null && c.generate != null)
	{
		var g = c.generate;
		generatePanel = document.createElement('div');
		generatePanel.className = cls.generate;
		generatePanel.style.display = 'none';
		g.form.style.position = '';
		g.form.style.width = '';
		g.form.style.height = '';
		generatePanel.appendChild(g.preview);
		generatePanel.appendChild(g.form);
		generatePanel.appendChild(g.magnify);
		generatePanel.appendChild(g.edit);
		g.button.textContent = '';
		mxUtils.write(g.button, mxResources.get('generate'));
		g.button.setAttribute('title', mxResources.get('generate'));
		main.appendChild(generatePanel);

		var updateGenerate = function()
		{
			generatePanel.style.display = (generateTile.classList.contains('geTemplateSelected')) ? '' : 'none';
		};

		// Shown before the dialog focuses the description in the click
		// handler of the tile (capture phase)
		startRow.addEventListener('click', function(evt)
		{
			if (generateTile.contains(mxEvent.getSource(evt)))
			{
				generatePanel.style.display = '';
			}
		}, true);

		if (window.MutationObserver != null)
		{
			new MutationObserver(updateGenerate).observe(generateTile,
				{attributes: true, attributeFilter: ['class']});
		}

		updateGenerate();
	}

	// The tiles of the chosen category
	var gridHead = skin.createSectionHead('');
	gridHead.classList.add(cls.gridHead);
	main.appendChild(gridHead);
	grid.style.cssText = '';
	grid.classList.add(cls.grid);
	grid.setAttribute('role', 'tabpanel');
	main.appendChild(grid);

	// Templates without a picture (From Text) get the glyph of their entry
	// in the place of the picture, templates with an image (embeds) their
	// name
	var decorateTiles = function()
	{
		for (var i = 0; i < grid.children.length; i++)
		{
			var t = grid.children[i];

			if (t.classList.contains('geTemplate') && !t.browserDecorated)
			{
				t.browserDecorated = true;

				if (t.querySelector('.geTemplatePreview') == null &&
					t.querySelector('img:not(.geButton)') == null)
				{
					var name = t.querySelector('span');
					var key = null;

					for (var k in TemplateBrowser.textTemplateGlyphs)
					{
						if (name != null && name.textContent == mxResources.get(k, null, k))
						{
							key = k;
						}
					}

					var picture = document.createElement('span');
					picture.className = cls.picture;
					var glyph = createIcon((key != null) ? TemplateBrowser.textTemplateGlyphs[key] : 'page', 'page');

					if (glyph != null)
					{
						picture.appendChild(glyph);
					}

					t.insertBefore(picture, t.firstChild);
				}
				else if (t.querySelector('span') == null && t.getAttribute('title') != null)
				{
					var label = document.createElement('span');
					mxUtils.write(label, t.getAttribute('title'));
					t.appendChild(label);
				}
			}
		}
	};

	// Rows of the categories, built again when the list changes
	var rows = [];
	var rowsKey = null;
	var listHidden = false;
	var hiddenStart = null;

	// The chosen tile of Start from, if any
	var getChosenStart = function()
	{
		return (startRow != null) ? startRow.querySelector('.geTemplateSelected') : null;
	};
	var total = 0;

	var selectEntry = function(entry)
	{
		// A category ends the search first (the dialog restores the
		// category of before the search), also the terms the dialog was
		// opened with (searchTemplates), which never ran here, and
		// typed text whose search has not run yet
		if (c.search.value != '' || searched != '')
		{
			window.clearTimeout(searchThread);
			searchThread = null;
			searched = '';
			c.search.value = '';
			dlg.searchTemplates('');
		}

		if (c.getCurrentEntry() != entry)
		{
			entry.click();
		}
	};

	var moveFocus = function(row, delta)
	{
		var visible = rows.filter(function(r)
		{
			return r.style.display != 'none';
		});
		var i = visible.indexOf(row);
		var next = (delta == -Infinity) ? visible[0] : ((delta == Infinity) ?
			visible[visible.length - 1] : visible[i + delta]);

		if (next != null)
		{
			next.focus();
			next.click();
		}
	};

	var addRow = function(entry, info)
	{
		var row = document.createElement('button');
		row.setAttribute('type', 'button');
		row.setAttribute('role', 'tab');
		row.className = cls.cat + ((info.subCategory) ? ' ' + cls.sub : '');
		row.browserEntry = entry;
		row.browserInfo = info;

		var name = (info.subCategory) ? ui.getTemplateCategoryName(info.subCategory) :
			((info.custom) ? info.category : ui.getTemplateCategoryName(info.category));
		row.browserName = name;

		if (!info.subCategory)
		{
			var glyph = createIcon((info.custom) ? 'folder' :
				TemplateBrowser.categoryGlyphs[info.category], 'page');

			if (glyph != null)
			{
				row.appendChild(glyph);
			}
		}

		var label = document.createElement('span');
		label.className = cls.catName;
		mxUtils.write(label, name);
		row.appendChild(label);
		row.setAttribute('title', name);

		if (info.templates != null)
		{
			var count = document.createElement('span');
			count.className = cls.count;
			mxUtils.write(count, String(info.templates.length));
			row.appendChild(count);
		}

		mxEvent.addListener(row, 'click', function()
		{
			selectEntry(entry);
		});

		mxEvent.addListener(row, 'keydown', function(evt)
		{
			var delta = (evt.keyCode == 38) ? -1 : ((evt.keyCode == 40) ? 1 :
				((evt.keyCode == 36) ? -Infinity : ((evt.keyCode == 35) ? Infinity : 0)));

			if (delta != 0)
			{
				moveFocus(row, delta);
				mxEvent.consume(evt);
			}
		});

		cats.appendChild(row);
		rows.push(row);
	};

	var updateRows = function()
	{
		var nodes = c.list.querySelectorAll('*');
		var entries = [];

		for (var i = 0; i < nodes.length; i++)
		{
			if (nodes[i].templateEntry != null || (nodes[i].parentNode == c.list && nodes[i].nodeName == 'DIV'))
			{
				entries.push(nodes[i]);
			}
		}

		var key = entries.map(function(e)
		{
			return (e.templateEntry != null) ? e.templateEntry.category + '/' + (e.templateEntry.subCategory || '') +
				'/' + ((e.templateEntry.templates != null) ? e.templateEntry.templates.length : '') : '#' + e.textContent;
		}).join('\n');

		if (key != rowsKey)
		{
			rowsKey = key;
			var focused = (document.activeElement != null && document.activeElement.browserEntry != null) ?
				document.activeElement.browserEntry : null;
			cats.textContent = '';
			rows = [];
			total = 0;

			for (var i = 0; i < entries.length; i++)
			{
				var info = entries[i].templateEntry;

				if (info == null)
				{
					// Captions of the list (Custom and draw.io in embeds)
					cats.appendChild(skin.createSectionHead(entries[i].textContent));
				}
				// Categories without templates have no row (Basic without
				// its blank diagram)
				else if (info.templates == null || info.templates.length > 0)
				{
					addRow(entries[i], info);

					if (info.templates != null && !info.subCategory && info.category != 'fromText')
					{
						total += info.templates.length;
					}
				}
			}

			for (var i = 0; i < rows.length; i++)
			{
				if (rows[i].browserEntry == focused)
				{
					rows[i].focus();
				}
			}

			var placeholder = (total > 0) ? mxResources.get('searchNTemplates', [total]) :
				mxResources.get('searchTemplates');
			c.search.setAttribute('placeholder', placeholder);
			c.search.setAttribute('aria-label', placeholder);
		}

		update();
	};

	// Follows the chosen category or the search
	var update = function()
	{
		var cur = c.getCurrentEntry();
		var curInfo = (cur != null) ? cur.templateEntry : null;
		var curRow = null;

		// The first category with templates is chosen if the dialog shows
		// an empty one (Basic without its blank diagram)
		if (curInfo != null && curInfo.templates != null && curInfo.templates.length == 0 && rows.length > 0)
		{
			// The click on the category chooses its first template: a chosen
			// tile of Start from (the blank diagram) stays chosen
			var chosen = getChosenStart();
			rows[0].click();

			if (chosen != null)
			{
				chosen.click();
			}

			return;
		}

		var curIndex = -1;

		for (var i = 0; i < rows.length; i++)
		{
			if (rows[i].browserEntry == cur)
			{
				curIndex = i;
			}
		}

		for (var i = 0; i < rows.length; i++)
		{
			var row = rows[i];
			var on = row.browserEntry == cur;
			row.classList.toggle(cls.on, on);
			row.setAttribute('aria-selected', (on) ? 'true' : 'false');
			row.setAttribute('tabindex', (on) ? '0' : '-1');

			if (on)
			{
				curRow = row;
			}

			// Subcategories are shown below their chosen category. Those that
			// are open above the chosen category stay open until a category
			// above them is chosen, so the category that was clicked does not
			// move away under the pointer (the driver, 19 November 2026)
			if (row.browserInfo.subCategory)
			{
				var open = (curInfo != null && curInfo.category == row.browserInfo.category &&
					!curInfo.custom) || (i < curIndex && row.browserOpen === true);
				row.browserOpen = open;
				row.style.display = (open) ? '' : 'none';
			}
		}

		// One tab stop if no category is chosen (search)
		if (curRow == null && rows.length > 0)
		{
			rows[0].setAttribute('tabindex', '0');
		}

		// The caption of the tiles: the category and its number of templates
		// (a search shows its result in the grid)
		gridHead.textContent = '';

		if (curRow != null)
		{
			mxUtils.write(gridHead, (curInfo.templates != null) ?
				skin.nameWithDetail(curRow.browserName, curInfo.templates.length) : curRow.browserName);
			gridHead.style.display = '';
			grid.setAttribute('aria-label', curRow.browserName);
		}
		else
		{
			gridHead.style.display = 'none';
			grid.setAttribute('aria-label', mxResources.get('search'));
		}

		// The categories follow the list (hidden for the recent diagrams of
		// embeds), the search field follows the search box of the dialog
		cats.style.display = (c.list.style.display == 'none') ? 'none' : '';
		main.style.gridColumn = (c.list.style.display == 'none') ? '1 / -1' : '';
		search.style.display = (c.searchBox.style.display == 'none') ? 'none' : '';

		// Start from belongs to the templates: hidden with the categories
		// (the recent diagrams and the search of embeds, whose tabs disable
		// Create), its chosen tile is chosen again when they come back
		if (startRow != null)
		{
			var hidden = c.list.style.display == 'none';

			if (hidden && !listHidden)
			{
				hiddenStart = getChosenStart();
			}

			startHead.style.display = (hidden) ? 'none' : '';
			startRow.style.display = (hidden) ? 'none' : '';

			if (!hidden && listHidden && hiddenStart != null)
			{
				var tile = hiddenStart;
				hiddenStart = null;
				tile.click();
			}

			listHidden = hidden;
		}

		decorateTiles();
	};

	if (window.MutationObserver != null)
	{
		new MutationObserver(updateRows).observe(c.list, {childList: true, subtree: true});
		new MutationObserver(update).observe(grid, {childList: true});
		new MutationObserver(update).observe(c.list, {attributes: true, attributeFilter: ['style']});
		new MutationObserver(update).observe(c.searchBox, {attributes: true, attributeFilter: ['style']});
	}

	updateRows();

	// Phones: the sheet scrolls, so the dialog adds the next tiles when
	// the end of the sheet is reached (the grid does not scroll there)
	mxEvent.addListener(elt, 'scroll', function()
	{
		if (elt.scrollTop + elt.clientHeight >= elt.scrollHeight - 1 &&
			grid.scrollHeight <= grid.clientHeight)
		{
			grid.dispatchEvent(new Event('scroll'));
		}
	});

	// The footer: the name with the format and the place of the new file,
	// Import (and From Template URL without Start from) on the left, Cancel
	// and the primary action on the right
	var btns = c.buttons;
	btns.style.cssText = '';

	// The frame of Fusion has its own footer
	if (cls.footer != null)
	{
		btns.classList.add(cls.footer);
	}

	var file = document.createElement('div');
	file.className = cls.file;

	if (c.name != null)
	{
		c.name.style.marginLeft = '';
		c.name.style.width = '';
		c.name.classList.add(cls.name);
		file.appendChild(c.name);

		// The format (the name follows it and the other way round)
		if (c.type != null && c.type.parentNode == c.header)
		{
			c.type.style.marginLeft = '';
			c.type.style.width = '';
			c.type.classList.add(cls.type);
			file.appendChild(c.type);
		}

		// Where the file is created; in the embed mode the host keeps the
		// file (the template message, see EditorUi.js), so no place is shown
		if (c.storage != null && urlParams['embed'] != '1')
		{
			file.appendChild(this.createNewDialogPlace(dlg, skin));
		}
	}

	// From a template in Start from replaces From Template URL
	if (templateFile != null && c.fromUrl != null && c.fromUrl.parentNode == btns)
	{
		btns.removeChild(c.fromUrl);
	}

	var secondary = [c.fromUrl, c.importBtn];

	for (var i = 0; i < secondary.length; i++)
	{
		if (secondary[i] != null && secondary[i].parentNode == btns)
		{
			secondary[i].classList.add(cls.linkBtn);
			file.appendChild(secondary[i]);
		}
	}

	btns.insertBefore(file, btns.firstChild);

	var layout = {skin: skin, head: head, body: body, cats: cats, main: main,
		search: search, grid: grid, file: file, templateFile: templateFile};
	dlg.templateBrowser = layout;

	return layout;
};

/**
 * Returns the storages (App.MODE_*) that the place of the New dialog offers,
 * in the order of Save as: the storages that Save as (SaveDialog) offers for
 * the configuration, without its targets Download and Open in New Window,
 * which create no file. These are the cloud storages whose client is loaded,
 * while online (GitLab is no longer offered as a target), the device (not
 * with noDevice=1) and the browser storage (not with browser=0), and always
 * the given storage of the app. The desktop app has the device only.
 */
EditorUi.prototype.getNewDialogStorages = function(current)
{
	var modes = [];
	var all = [App.MODE_GOOGLE, App.MODE_ONEDRIVE, App.MODE_M365, App.MODE_GITHUB,
		App.MODE_GITLAB, App.MODE_TRELLO, App.MODE_DEVICE, App.MODE_BROWSER];
	var local = !EditorUi.isElectronApp && !mxClient.IS_CHROMEAPP;

	for (var i = 0; i < all.length; i++)
	{
		var mode = all[i];
		var offered = false;

		if (mode == App.MODE_DEVICE)
		{
			offered = urlParams['noDevice'] != '1';
		}
		else if (mode == App.MODE_BROWSER)
		{
			offered = local && isLocalStorage && urlParams['browser'] != '0';
		}
		else if (mode != App.MODE_GITLAB)
		{
			offered = local && this.getServiceForName(mode) != null &&
				!this.isOffline(mode == App.MODE_GOOGLE && urlParams['gapi-stealth'] == '1');
		}

		if ((offered || mode == current) && App.storages[mode] != null)
		{
			modes.push(mode);
		}
	}

	return modes;
};

/**
 * Returns the place of the new file in the footer of the given New dialog:
 * the glyph and the name of the storage of the app (the device if there is
 * none yet), or, where the app offers more than one storage
 * (getNewDialogStorages), a list of them with that storage chosen, which
 * sets where the dialog creates the file (NewDialog.controls.setMode). The
 * storage of the app keeps its mode, so a file without a storage yet is
 * created as before (decide later). Storages whose client loads while the
 * dialog is open are added.
 */
EditorUi.prototype.createNewDialogPlace = function(dlg, skin)
{
	var c = dlg.controls;
	var cls = skin.classes;
	var appMode = this.mode;
	var initial = (appMode != null && App.storages[appMode] != null) ? appMode : App.MODE_DEVICE;
	var where = mxResources.get('where');
	var place = document.createElement('span');
	var select = null;
	var icon = null;

	// The glyph and the tooltip of the chosen storage
	var update = mxUtils.bind(this, function()
	{
		var mode = (select != null && select.value != '') ? select.value : initial;
		var storage = App.storages[mode];
		var next = skin.createPlaceIcon(this, storage, mode);

		if (icon != null && icon.parentNode == place)
		{
			place.removeChild(icon);
		}

		icon = next;

		if (icon != null)
		{
			icon.setAttribute('aria-hidden', 'true');
			place.insertBefore(icon, place.firstChild);
		}

		place.setAttribute('title', where + ': ' + mxResources.get(storage.title));
	});

	var build = mxUtils.bind(this, function()
	{
		var modes = this.getNewDialogStorages(initial);
		var chosen = (select != null) ? select.value : initial;
		var focused = select != null && document.activeElement == select;

		while (place.firstChild != null)
		{
			place.removeChild(place.firstChild);
		}

		icon = null;
		select = null;

		if (modes.length > 1)
		{
			place.className = cls.place + ' ' + cls.placePick;
			select = document.createElement('select');
			select.className = cls.placeSelect;
			select.setAttribute('aria-label', where);

			for (var i = 0; i < modes.length; i++)
			{
				var option = document.createElement('option');
				option.setAttribute('value', modes[i]);
				mxUtils.write(option, mxResources.get(App.storages[modes[i]].title));
				select.appendChild(option);
			}

			select.value = (mxUtils.indexOf(modes, chosen) >= 0) ? chosen : initial;
			place.appendChild(select);

			mxEvent.addListener(select, 'change', function()
			{
				c.setMode((select.value == initial) ? appMode : select.value);
				update();
			});

			if (focused)
			{
				select.focus();
			}
		}
		else
		{
			place.className = cls.place;
			var name = document.createElement('span');
			name.className = cls.placeName;
			mxUtils.write(name, mxResources.get(App.storages[initial].title));
			place.appendChild(name);
		}

		c.setMode((select == null || select.value == initial) ? appMode : select.value);
		update();
	});

	build();

	// Clients load after the start (eg. Google Drive): their storages are
	// added while the dialog is open, until it closes (the dialog is shown
	// right after it is created; dialogs above it keep the place shown)
	var clientLoaded = mxUtils.bind(this, function()
	{
		build();
	});

	var hidden = mxUtils.bind(this, function()
	{
		if (!document.body.contains(place))
		{
			this.removeListener(clientLoaded);
			this.editor.removeListener(hidden);
		}
	});

	this.addListener('clientLoaded', clientLoaded);
	this.editor.addListener('hideDialog', hidden);

	return place;
};

/**
 * Returns the places of From a template in Start from of the New dialog
 * (the driver, 20 November 2026, sketch yeag): the storages of File › Open
 * from (Menus.js, openFrom) in its order and groups, and URL, as
 * {mode, name} with the mode App.MODE_* or url; null separates the groups.
 * Only what the app offers now: a client that is still loading is there
 * with loading (shown disabled, as Open from shows it), GitHub and GitLab
 * once loaded, the browser storage not with browser=0, the device not with
 * noDevice=1 and URL while online. The desktop app has the device and URL.
 */
EditorUi.prototype.getTemplateFileSources = function()
{
	var sources = [];
	var local = !EditorUi.isElectronApp && !mxClient.IS_CHROMEAPP;

	var add = mxUtils.bind(this, function(mode, whileLoading)
	{
		var name = mxResources.get(App.storages[mode].title);

		if (this.getServiceForName(mode) != null)
		{
			sources.push({mode: mode, name: name});
		}
		else if (whileLoading && typeof this.isModeEnabled === 'function' && this.isModeEnabled(mode))
		{
			sources.push({mode: mode, name: name, loading: true});
		}
	});

	if (local)
	{
		add(App.MODE_GOOGLE, true);
		add(App.MODE_ONEDRIVE, true);
		add(App.MODE_M365, true);
		sources.push(null);
		add(App.MODE_GITHUB, false);
		add(App.MODE_GITLAB, false);
		add(App.MODE_TRELLO, true);
		sources.push(null);

		if (isLocalStorage && urlParams['browser'] != '0')
		{
			sources.push({mode: App.MODE_BROWSER, name: mxResources.get(App.storages[App.MODE_BROWSER].title)});
		}
	}

	if (urlParams['noDevice'] != '1' && Graph.fileSupport)
	{
		sources.push({mode: App.MODE_DEVICE, name: mxResources.get(App.storages[App.MODE_DEVICE].title)});
	}

	if (!this.isOffline())
	{
		sources.push(null);
		sources.push({mode: 'url', name: mxResources.get('url')});
	}

	return sources;
};

/**
 * Shows the picker of the given place of From a template (App.MODE_* or
 * url, see getTemplateFileSources), the one of File › Open from and Import
 * from (the small URL dialog of From Template URL for url, with Select), and
 * passes the content of the chosen file to loaded (data, name, source: the
 * storage or the URL) without opening it. start is called once a file is
 * chosen and loads, error with the error if it does not load. Nothing is
 * called if the pick is cancelled.
 */
EditorUi.prototype.pickTemplateFile = function(mode, start, loaded, error)
{
	var storage = App.storages[mode];
	var source = (storage != null) ? mxResources.get(storage.title) : null;
	var service = (mode != 'url') ? this.getServiceForName(mode) : null;

	if (mode == 'url')
	{
		var dlg = new FilenameDialog(this, '', mxResources.get('select'), mxUtils.bind(this, function(url)
		{
			url = (url != null) ? mxUtils.trim(url) : '';

			if (url.length > 0)
			{
				// The last part of the path is the name, the URL is the source
				var name = url.replace(/[?#].*$/, '').replace(/\/+$/, '');
				name = name.substring(name.lastIndexOf('/') + 1);

				try
				{
					name = decodeURIComponent(name);
				}
				catch (e)
				{
					// keeps the name as it is
				}

				start();

				// Through the proxy as From Template URL. PNG and PDF load as
				// base64 (getTemplateFileXml): the proxy returns them so with
				// base64=1, which getProxiedUrl adds only for a URL that ends
				// with the extension (not for file.png?dl=1), and loadUrl reads
				// a URL that it does not proxy as binary for them
				var binary = /\.(png|pdf)$/i.test(name);
				var proxied = this.editor.getProxiedUrl(url);
				var base64 = proxied != url && /[?&]base64=1(&|$)/.test(proxied);

				if (binary && proxied != url && !base64)
				{
					proxied += '&base64=1';
					base64 = true;
				}

				this.editor.loadUrl(proxied, function(data)
				{
					loaded(data, (name.length > 0) ? name : url, url);
				}, error, binary && !base64, null, (/\.pdf$/i.test(name)) ?
					'data:application/pdf;base64,' : null);
			}
		}), mxResources.get('url'));
		this.showDialog(dlg.container, 300, 80, true, true);
		dlg.init();
	}
	else if (mode == App.MODE_DEVICE)
	{
		if (this.templateFileInputElt == null)
		{
			var elt = document.createElement('input');
			elt.setAttribute('type', 'file');
			elt.style.display = 'none';
			document.body.appendChild(elt);
			this.templateFileInputElt = elt;
		}

		var input = this.templateFileInputElt;

		input.onchange = function()
		{
			var file = (input.files != null && input.files.length > 0) ? input.files[0] : null;

			// The same file can be chosen again
			input.value = '';

			if (file != null)
			{
				start();
				var reader = new FileReader();

				reader.onload = function(e)
				{
					loaded(e.target.result, file.name, source);
				};

				reader.onerror = function()
				{
					error({message: mxResources.get('errorLoadingFile')});
				};

				// PNG and PDF carry the diagram in their binary data
				if (/\.(png|pdf)$/i.test(file.name) || file.type == 'image/png' ||
					file.type == 'application/pdf')
				{
					reader.readAsDataURL(file);
				}
				else
				{
					reader.readAsText(file);
				}
			}
		};

		input.click();
	}
	else if (mode == App.MODE_BROWSER)
	{
		// The Open dialog of the browser storage, as Import from › Browser
		// (importLocalFile), with the file passed to loaded
		window.openNew = false;
		window.openKey = 'open';

		window.listBrowserFiles = mxUtils.bind(this, function(success, error)
		{
			StorageFile.listFiles(this, 'F', success, error);
		});

		window.openBrowserFile = mxUtils.bind(this, function(title, success, error)
		{
			StorageFile.getFileContent(this, title, success, error);
		});

		window.deleteBrowserFile = mxUtils.bind(this, function(title, success, error)
		{
			StorageFile.deleteFile(this, title, success, error);
		});

		var prev = Editor.useLocalStorage;
		Editor.useLocalStorage = true;

		window.openFile = new OpenFile(mxUtils.bind(this, function(cancel)
		{
			this.hideDialog(cancel);
		}));

		window.openFile.setConsumer(function(data, filename)
		{
			start();
			loaded(data, filename, source);
		});

		this.showDialog(new OpenDialog(this).container, 640, 480, true, true, function()
		{
			Editor.useLocalStorage = prev;
			window.openFile = null;
		});
	}
	else if (service != null)
	{
		// As Import from (Menus.js, importFrom)
		service.pickFile(mxUtils.bind(this, function(id)
		{
			start();

			service.getFile(id, function(file)
			{
				loaded(file.getData(), file.getTitle(), source);
			}, error, service == this.drive);
		}), true);
	}
};

/**
 * Returns the diagram of the given content of a file chosen in From a
 * template as XML (an mxfile with all its pages or an mxGraphModel): the
 * diagram of a draw.io file, or the one in a PNG, PDF, SVG or HTML file
 * (PNG and PDF as data URIs or base64), or null if it has none.
 */
EditorUi.prototype.getTemplateFileXml = function(data, name)
{
	var xml = null;

	try
	{
		if (data != null && data.length > 0)
		{
			var text = data;

			// Markup is parsed as it is, whatever the name: Google Drive,
			// OneDrive, GitHub and Trello return the diagram of a PNG or PDF
			// as XML under its .png or .pdf name. Only other data (data URIs
			// or base64 of Device and URL) is a PNG or PDF, by the name or by
			// its first bytes in base64 (a URL such as download?file=plan.png
			// has no extension in its name)
			if (mxUtils.trim(data).charAt(0) != '<')
			{
				var base64 = (data.substring(0, 5) == 'data:') ? data.substring(data.indexOf(',') + 1) : data;

				if (/\.pdf$/i.test(name) || data.substring(0, 21) == 'data:application/pdf;' ||
					base64.substring(0, 7) == 'JVBERi0')
				{
					text = Editor.extractGraphModelFromPdf(data);
				}
				else if (/\.png$/i.test(name) || Editor.isPngDataUrl(data) ||
					base64.substring(0, 11) == 'iVBORw0KGgo')
				{
					text = Editor.extractGraphModelFromPng(data);
				}
			}

			if (text != null)
			{
				text = mxUtils.trim(text);

				if (text.charAt(0) == '<')
				{
					// As files are opened (a meta element without its slash)
					xml = this.getTemplateFileDiagram(mxUtils.parseXml(
						this.validateFileData(text)).documentElement);

					// An HTML file that is no XML (eg. void elements), parsed
					// as HTML in a document that runs and loads nothing
					if (xml == null && window.DOMParser != null &&
						/^<!doctype\s+html[\s>]|<html[\s>]/i.test(text.substring(0, 2048)))
					{
						xml = this.getTemplateFileDiagram(new DOMParser().parseFromString(
							text, 'text/html').documentElement);
					}
				}
			}
		}
	}
	catch (e)
	{
		// no diagram
	}

	return xml;
};

/**
 * Returns the diagram of the given root of a document of a file chosen in
 * From a template as XML (an mxfile or an mxGraphModel), or null if it has
 * none or a page that does not decode (eg. a corrupt compressed page, which
 * would otherwise fail only once the template is used).
 */
EditorUi.prototype.getTemplateFileDiagram = function(root)
{
	var xml = null;

	try
	{
		var node = (root != null) ? this.editor.extractGraphModel(root, true) : null;

		if (node != null && (node.nodeName == 'mxfile' || node.nodeName == 'mxGraphModel') &&
			node.getElementsByTagName('parsererror').length == 0)
		{
			var pages = (node.nodeName == 'mxfile') ? node.getElementsByTagName('diagram') : [];
			var valid = true;

			for (var i = 0; i < pages.length && valid; i++)
			{
				var model = Editor.parseDiagramNode(pages[i].cloneNode(true));
				valid = model != null && model.nodeName == 'mxGraphModel' &&
					model.getElementsByTagName('parsererror').length == 0;
			}

			xml = (valid) ? mxUtils.getXml(node) : null;
		}
	}
	catch (e)
	{
		// no diagram
	}

	return xml;
};

/**
 * Adds From a template to the given row of Start from of the given New
 * dialog (the driver, 20 November 2026, sketch yeag; it replaces From
 * Template URL of the footer): a chip with a chevron at the end of the row
 * that opens a menu of the places of File › Open from and URL
 * (getTemplateFileSources) and, once a file is chosen there
 * (pickTemplateFile), the file as a chip of its own at the right end of the
 * row with the glyph of its place, its name (an ellipsis if it is long; the
 * name and the place or the URL in the tooltip) and Remove. The chip of the
 * file is a template of the dialog (NewDialog.controls.templateFile): it is
 * chosen like the other entries, so Create (or Insert) uses its diagram with
 * all its pages, and double click and Enter create at once; another entry
 * leaves it in the row, not chosen. A new file replaces it; Remove takes it
 * away and chooses the given blank diagram again if the file was chosen. A
 * cancelled pick changes nothing, a file without a diagram shows Invalid or
 * missing file and keeps the choice, an error of the load shows its message;
 * while the file loads the spinner turns, Create is disabled and nothing
 * creates (NewDialog.controls.templateFile.setLoading), and closing the
 * dialog drops the load. The name is the button of the chip (it holds
 * Remove, a button of its own). Returns
 * {menu, getFile} (the chip of the menu, and the chip of the file or null).
 */
EditorUi.prototype.createNewDialogTemplateFile = function(dlg, skin, row, blank)
{
	var ui = this;
	var c = dlg.controls;
	var cls = skin.classes;
	var fileChip = null;
	var loading = null;
	var label = mxResources.get('fromATemplate');

	var createIcon = function(name, fallback)
	{
		var icon = skin.createIcon(name);

		return (icon == null && fallback != null) ? skin.createIcon(fallback) : icon;
	};

	var appendIcon = function(elt, name, fallback)
	{
		var icon = createIcon(name, fallback);

		if (icon != null)
		{
			icon.setAttribute('aria-hidden', 'true');
			elt.appendChild(icon);
		}
	};

	// The chip that opens the menu of the places
	var chip = document.createElement('div');
	chip.className = 'geTemplate ' + cls.startTile + ' ' + cls.startMenu;
	chip.setAttribute('title', label);
	chip.setAttribute('aria-haspopup', 'menu');
	chip.setAttribute('aria-expanded', 'false');
	appendIcon(chip, TemplateBrowser.templateFileGlyph);
	var name = document.createElement('span');
	mxUtils.write(name, label);
	chip.appendChild(name);
	appendIcon(chip, 'chevronDown');

	// While a file loads (the last pick wins) the spinner turns and nothing
	// creates (setLoading); closing the dialog ends the load, so its result
	// or error is dropped and the spinner stops with the dialog
	var endLoad = function()
	{
		if (loading != null)
		{
			loading = null;
			ui.editor.removeListener(closeListener);
			ui.spinner.stop();
			c.templateFile.setLoading(false);
		}
	};

	var closeListener = function(sender, evt)
	{
		var dlg = evt.getProperty('dialog');

		if (dlg != null && dlg.container != null && mxUtils.isAncestorNode(dlg.container, row))
		{
			endLoad();
		}
	};

	var startLoad = function()
	{
		if (loading == null)
		{
			c.templateFile.setLoading(true);
			ui.spinner.spin(document.body, mxResources.get('loading'));
			ui.editor.addListener('hideDialog', closeListener);
		}

		loading = {};

		return loading;
	};

	var chooseBlank = function()
	{
		var next = (blank != null && blank.parentNode == row) ? blank : row.querySelector('.geTemplate:not(.' +
			cls.startMenu + '):not(.' + cls.startFile + ')');

		if (next != null)
		{
			next.click();
		}
	};

	var removeFile = function()
	{
		if (fileChip != null)
		{
			var elt = fileChip;
			var chosen = elt.classList.contains('geTemplateSelected');
			var focused = elt.contains(document.activeElement);
			fileChip = null;
			elt.parentNode.removeChild(elt);

			if (chosen)
			{
				chooseBlank();
			}

			if (focused)
			{
				chip.focus();
			}
		}
	};

	var setFile = function(xml, mode, filename, source, realUrl)
	{
		var focused = fileChip != null && fileChip.contains(document.activeElement);

		if (fileChip != null && fileChip.parentNode != null)
		{
			fileChip.parentNode.removeChild(fileChip);
		}

		var elt = document.createElement('div');
		elt.className = 'geTemplate ' + cls.startTile + ' ' + cls.startFile;
		elt.setAttribute('title', filename + ' — ' + source);
		appendIcon(elt, TemplateBrowser.templateFileGlyphs[mode], 'page');

		// The name is the button of the chip, as the chip has Remove (the
		// name of the generative template is its control for the same
		// reason); the chip shows its focus ring
		var text = document.createElement('span');
		text.className = cls.startFileName;
		text.setAttribute('aria-label', filename + ', ' + source);
		mxUtils.write(text, filename);
		elt.appendChild(text);
		elt.templateControl = text;

		var remove = document.createElement('button');
		remove.setAttribute('type', 'button');
		remove.className = cls.startRemove;
		remove.setAttribute('title', mxResources.get('remove'));
		remove.setAttribute('aria-label', mxResources.get('remove') + ' ' + filename);
		appendIcon(remove, 'close');
		elt.appendChild(remove);

		var choose = function()
		{
			c.templateFile.select(elt, xml, realUrl);
		};

		mxEvent.addListener(elt, 'click', function(evt)
		{
			if (!remove.contains(mxEvent.getSource(evt)))
			{
				choose();
			}
		});

		mxEvent.addListener(elt, 'dblclick', function(evt)
		{
			if (!remove.contains(mxEvent.getSource(evt)))
			{
				choose();
				c.templateFile.create();
			}

			mxEvent.consume(evt);
		});

		// Space chooses it, Enter creates (as the other entries); Delete and
		// Backspace remove it
		Editor.initKeyboardButton(text, function(evt)
		{
			choose();

			if (evt.keyCode == 13)
			{
				c.templateFile.create();
			}
		}, true);

		Editor.addFocusRing(text, elt);

		mxEvent.addListener(text, 'keydown', function(evt)
		{
			if (evt.keyCode == 46 || evt.keyCode == 8)
			{
				removeFile();
				mxEvent.consume(evt);
			}
		});

		// Remove is a button of its own: its keys and clicks stay with it
		mxEvent.addListener(remove, 'keydown', function(evt)
		{
			evt.stopPropagation();
		});

		mxEvent.addListener(remove, 'click', function(evt)
		{
			removeFile();
			mxEvent.consume(evt);
		});

		fileChip = elt;
		row.appendChild(elt);
		choose();

		if (focused)
		{
			text.focus();
		}

		// Where the row scrolls (Classic and Simple below 640 wide) the
		// chosen file is scrolled into view
		if (typeof elt.scrollIntoView === 'function')
		{
			elt.scrollIntoView({block: 'nearest', inline: 'nearest'});
		}
	};

	var pick = function(mode)
	{
		var load = null;

		ui.pickTemplateFile(mode, function()
		{
			load = startLoad();
		}, function(data, filename, source)
		{
			if (load != null && load == loading)
			{
				endLoad();
				var xml = ui.getTemplateFileXml(data, filename);

				if (xml != null)
				{
					setFile(xml, mode, filename, source, (mode == 'url') ? source : null);
				}
				else
				{
					ui.handleError({message: mxResources.get('invalidOrMissingFile')});
				}
			}
		}, function(e)
		{
			if (load != null && load == loading)
			{
				endLoad();
				ui.handleError(e, (e != null) ? mxResources.get('errorLoadingFile') : null);
			}
		});
	};

	// The menu of the places, below the chip (as the menus of the page
	// overview and the dropdowns of the dialogs)
	var showMenu = function(evt)
	{
		ui.hideCurrentMenu();

		var keyboard = evt.type == 'keydown' || (evt.type == 'click' && evt.detail == 0);
		var bounds = chip.getBoundingClientRect();
		var menu = new mxPopupMenu(function(menu, parent)
		{
			var sources = ui.getTemplateFileSources();

			for (var i = 0; i < sources.length; i++)
			{
				if (sources[i] == null)
				{
					menu.addSeparator(parent);
				}
				else
				{
					(function(source)
					{
						var item = menu.addItem(source.name + ((source.loading) ? ' (' +
							mxResources.get('loading') + '...)' : '...'), null, function()
						{
							pick(source.mode);
						}, parent, null, !source.loading);

						if (typeof skin.addMenuIcon === 'function')
						{
							skin.addMenuIcon(menu, item, TemplateBrowser.templateFileGlyphs[source.mode]);
						}
					})(sources[i]);
				}
			}
		});

		menu.smartSeparators = true;
		menu.showDisabled = true;
		menu.autoExpand = true;

		menu.hideMenu = function()
		{
			mxPopupMenu.prototype.hideMenu.apply(menu, arguments);
			chip.setAttribute('aria-expanded', 'false');
			ui.resetCurrentMenu();
			menu.destroy();
		};

		menu.popup(bounds.left, bounds.bottom + 4, null, evt);
		ui.setCurrentMenu(menu, chip);
		chip.setAttribute('aria-expanded', 'true');

		// Escape returns to the chip
		menu.returnFocus = chip;

		if (keyboard && typeof menu.focusFirstItem === 'function')
		{
			menu.focusFirstItem();
		}
	};

	// A click on the chip of an open menu closes it (the press closes the
	// menu before the click, see EditorUi.isHideCurrentMenuEvent)
	var wasOpen = false;

	mxEvent.addGestureListeners(chip, function()
	{
		wasOpen = chip.getAttribute('aria-expanded') == 'true';
	});

	mxEvent.addListener(chip, 'click', function(evt)
	{
		if (wasOpen || chip.getAttribute('aria-expanded') == 'true')
		{
			ui.hideCurrentMenu();
		}
		else
		{
			showMenu(evt);
		}

		wasOpen = false;
		mxEvent.consume(evt);
	});

	// Enter, Space and the down arrow open the menu
	Editor.initKeyboardButton(chip, function(evt)
	{
		showMenu(evt);
	}, true);

	mxEvent.addListener(chip, 'keydown', function(evt)
	{
		if (evt.keyCode == 40 && chip.getAttribute('aria-expanded') != 'true')
		{
			showMenu(evt);
			mxEvent.consume(evt);
		}
	});

	row.appendChild(chip);

	return {menu: chip, getFile: function()
	{
		return fileChip;
	}};
};
