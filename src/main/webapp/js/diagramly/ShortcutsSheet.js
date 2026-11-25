/**
 * Copyright (c) 2026, JGraph Holdings Ltd
 * Copyright (c) 2026, draw.io AG
 */
/**
 * Keyboard Shortcuts as a sheet of the actions in every look that has it
 * (Fusion ideas in Simple, package 5): the actions of the menus that have a
 * shortcut, grouped by their place in the menus (the entries of the
 * omnibox, Omnibox.createEntries, so actions that the configuration hides
 * are not listed), the keys of the look first, with a search of the names
 * and the keys.
 *
 * The groups (EditorUi.getShortcutGroups) and the sheet
 * (EditorUi.showShortcutsSheet) take a skin: the Classic skin
 * (ShortcutsSheet.skins.classic, docs/dialog-style-guide.md, its CSS in
 * grapheditor.css under .geShortcuts, which takes the colors, the font and
 * the corners of the other dialogs of the theme) for Simple behind the
 * feature shortcutsDialog of Editor.featureDefaults
 * (Editor.isShortcutsDialogEnabled), or the skin of Fusion, which
 * SimpleHelp.js adds (ShortcutsSheet.skins.fusion), so the code exists once.
 * Where the feature is off, or without the omnibox (a bundle without
 * Omnibox.js), Help › Keyboard Shortcuts opens shortcuts.svg as before.
 */
var ShortcutsSheet = {};

/**
 * Size of the content of the sheet (the frame adds 48), limited to the
 * window in the Classic skin.
 */
ShortcutsSheet.width = 552;
ShortcutsSheet.height = 560;

/**
 * Space between the frame of the dialog and the window in the Classic skin.
 */
ShortcutsSheet.windowMargin = 32;

/**
 * The skins of the sheet. A skin has the classes of the parts and the
 * builders of its parts (see ShortcutsSheet.skins.classic). The skin of
 * Fusion is added by SimpleHelp.js.
 */
ShortcutsSheet.skins = {};

/**
 * The Classic skin (docs/dialog-style-guide.md), for Simple: the headline of
 * the dialogs, a search field, the titles of the sections of the Preview
 * template, the rows of the name and the keys in a key box, the colors of the
 * dialogs light and dark and the focus rings as outlines inside of the
 * controls. The CSS is in grapheditor.css under .geShortcuts.
 */
ShortcutsSheet.skins.classic = {
	name: 'classic',
	classes: {list: 'geShortcutsList', row: 'geShortcutRow', label: 'geShortcutLabel',
		keys: 'geShortcutKeys', empty: 'geShortcutsEmpty'},
	/**
	 * Adds the keys of the look that are not in the menus to the given
	 * function (title, label, keys, order): the keys of the in-place editor
	 * of labels (Ctrl+Enter applies and Enter adds a line, or Shift+Enter
	 * applies in Safari, see isStopEditingEvent in EditorUi; Enter applies
	 * and Shift+Enter adds a line where enterStopsCellEditing is on, except
	 * in Safari, where Shift+Enter applies too, so no key for a new line is
	 * listed). The Hand tool is in the View menu.
	 */
	addGeneral: function(ui, add)
	{
		var general = mxResources.get('general');
		var enter = ui.editor.graph.isEnterStopsCellEditing();
		var apply = (enter) ? 'Enter' : ((mxClient.IS_SF) ?
			Editor.shiftKey : Editor.ctrlKey) + '+Enter';
		add(general, mxResources.get('applyLabel'), apply, -1);

		if (!enter || !mxClient.IS_SF)
		{
			add(general, mxResources.get('labelNewLine'), (enter) ?
				Editor.shiftKey + '+Enter' : 'Enter', -1);
		}
	},
	/**
	 * Returns the given name of an action as it is shown in the rows.
	 */
	getLabel: function(label)
	{
		return label;
	},
	/**
	 * Returns the parts of the sheet in the given dialog ({elt, body, section,
	 * show}), or null if the sheet cannot be shown.
	 */
	createSheet: function(ui, dlg, title)
	{
		var elt = dlg.container;
		var content = elt.firstChild.firstChild;
		elt.classList.add('geShortcutsDialog');
		content.className = 'geShortcuts';

		var head = document.createElement('h3');
		mxUtils.write(head, title);
		content.appendChild(head);

		// The sections scroll below the search, the buttons stay below them
		var body = document.createElement('div');
		body.className = 'geShortcutsBody';
		content.appendChild(body);
		elt.lastChild.style.marginTop = '16px';

		return {elt: elt, body: body,
			// The search above the sections
			addSearch: function(search)
			{
				content.insertBefore(search, body);
			},
			// Returns the head of a section with the given title, the list of
			// its rows follows it in its parent
			section: function(name)
			{
				var section = document.createElement('div');
				section.className = 'geShortcutsSection';
				var h = document.createElement('div');
				h.className = 'gePreviewSectionTitle geShortcutsHead';
				h.setAttribute('role', 'heading');
				h.setAttribute('aria-level', '3');
				mxUtils.write(h, name);
				section.appendChild(h);
				body.appendChild(section);

				return h;
			},
			// Shows the dialog in the size of the sheet limited to the window
			show: function()
			{
				var ww = window.innerWidth || document.documentElement.clientWidth;
				var wh = window.innerHeight || document.documentElement.clientHeight;
				var margin = 48 + ((ww < 640) ? 16 : ShortcutsSheet.windowMargin);

				ui.showDialog(elt, Math.max(Math.min(ShortcutsSheet.width, ww - margin), 240),
					Math.max(Math.min(ShortcutsSheet.height, wh - margin), 240), true, true);
			}};
	},
	/**
	 * Returns a search field (an input of the type search, named by its
	 * placeholder) that calls fn with its value on each input and clears with
	 * Escape before Escape closes the dialog. The field is the returned
	 * element and its input.
	 */
	createSearch: function(placeholder, fn)
	{
		var input = document.createElement('input');
		input.className = 'geShortcutsSearch';
		input.setAttribute('type', 'search');
		input.setAttribute('placeholder', placeholder);
		input.setAttribute('aria-label', placeholder);
		input.setAttribute('autocomplete', 'off');
		input.setAttribute('spellcheck', 'false');

		mxEvent.addListener(input, 'input', function()
		{
			fn(input.value);
		});

		mxEvent.addListener(input, 'keydown', function(evt)
		{
			if (evt.key == 'Escape' && input.value != '')
			{
				input.value = '';
				fn('');
				mxEvent.consume(evt);
			}
		});

		input.input = input;

		return input;
	}
};

/**
 * Returns the skin of the sheet for the current theme: the skin of Fusion in
 * Fusion (if its scripts are loaded), else the Classic skin.
 */
ShortcutsSheet.getSkin = function()
{
	return (typeof Editor.isSimpleModern === 'function' && Editor.isSimpleModern() &&
		ShortcutsSheet.skins.fusion != null) ? ShortcutsSheet.skins.fusion :
		ShortcutsSheet.skins.classic;
};

/**
 * Returns true if Help › Keyboard Shortcuts shows the sheet: the feature
 * shortcutsDialog of Editor.featureDefaults (shortcutsDialog in the
 * configuration and the URL), on in Simple (the driver, 18 November 2026:
 * the dialogs of Fusion for Simple), off in Classic, Sketch, Minimal and
 * Atlas. The theme Fusion always has it.
 */
Editor.isShortcutsDialogEnabled = function()
{
	return Editor.isFeatureEnabled('shortcutsDialog');
};

/**
 * Returns true if Help › Keyboard Shortcuts shows the sheet in the Classic
 * skin: the feature is on, the theme is not Fusion (which shows its own skin,
 * SimpleHelp.js) and the omnibox, which has the actions, is loaded.
 */
EditorUi.prototype.isShortcutsSheetEnabled = function()
{
	return !this.editor.isChromelessView() && Editor.isShortcutsDialogEnabled() &&
		ShortcutsSheet.getSkin() == ShortcutsSheet.skins.classic &&
		this.getOmnibox() != null;
};

/**
 * Returns the groups of the shortcuts sheet as [{title, rows: [{label,
 * keys}]}] in the given skin: the keys of the look (skin.addGeneral), then
 * the actions with a shortcut that the omnibox lists (visible, not hidden by
 * the configuration) by their place in the menus (the order of the menus),
 * then the others.
 */
EditorUi.prototype.getShortcutGroups = function(skin)
{
	var omnibox = this.getOmnibox();
	var groups = [];
	var byTitle = Object.create(null);
	var seen = Object.create(null);

	var add = function(title, label, keys, order)
	{
		var group = byTitle[title];

		if (group == null)
		{
			group = {title: title, rows: [], order: order};
			byTitle[title] = group;
			groups.push(group);
		}

		group.rows.push({label: label, keys: keys});
	};

	skin.addGeneral(this, add);
	var entries = [];

	try
	{
		entries = (omnibox != null) ? omnibox.createEntries() : [];
	}
	catch (e)
	{
		// ignores the entries if the menus fail
	}

	// The order of the menus (eg. File, Insert, Share, More, Settings)
	var titles = [];
	var names = (omnibox != null) ? omnibox.getMenuNames() : null;

	for (var i = 0; names != null && i < names.length; i++)
	{
		titles.push(omnibox.getMenuTitle(names[i]));
	}

	for (var i = 0; i < entries.length; i++)
	{
		var entry = entries[i];

		if (entry.group == 'actions' && entry.action != null && typeof entry.shortcut === 'string' &&
			entry.shortcut.length > 0 && typeof entry.label === 'string' && seen[entry.action] == null)
		{
			seen[entry.action] = true;
			var path = (entry.path != null && entry.path.length > 0) ? entry.path : null;
			var index = (path != null) ? mxUtils.indexOf(titles, path[0]) : -1;
			add((path != null) ? path.join(' › ') : mxResources.get('other'),
				entry.label.replace(/(\.\.\.|…)$/, ''), entry.shortcut,
				(path == null) ? titles.length + 1 : ((index >= 0) ? index : titles.length));
		}
	}

	// Groups in the order of the menus, then by their titles; rows by label
	groups.sort(function(a, b)
	{
		return (a.order != b.order) ? a.order - b.order :
			((a.order < 0) ? 0 : a.title.localeCompare(b.title));
	});

	for (var i = 0; i < groups.length; i++)
	{
		if (groups[i].order >= 0)
		{
			groups[i].rows.sort(function(a, b)
			{
				return a.label.localeCompare(b.label);
			});
		}
	}

	return groups;
};

/**
 * Shows the shortcuts sheet (see getShortcutGroups) in the given skin with a
 * search of the names and keys.
 */
EditorUi.prototype.showShortcutsSheet = function(skin)
{
	var groups = this.getShortcutGroups(skin);
	var content = document.createElement('div');
	var dlg = new CustomDialog(this, content, null, null, mxResources.get('close'), null, null, true);
	var sheet = skin.createSheet(this, dlg, mxResources.get('keyboardShortcuts'));

	if (sheet == null)
	{
		return;
	}

	var cls = skin.classes;
	var heads = [];
	var empty = document.createElement('div');
	empty.className = cls.empty;
	empty.setAttribute('role', 'status');

	var filter = function(value)
	{
		var terms = mxUtils.trim(value.toLowerCase()).split(/\s+/).filter(function(term)
		{
			return term.length > 0;
		});

		var count = 0;

		for (var i = 0; i < heads.length; i++)
		{
			var shown = 0;

			for (var j = 0; j < heads[i].rows.length; j++)
			{
				var row = heads[i].rows[j];
				var match = true;

				for (var k = 0; k < terms.length && match; k++)
				{
					match = row.text.indexOf(terms[k]) >= 0;
				}

				row.elt.style.display = (match) ? '' : 'none';
				shown += (match) ? 1 : 0;
			}

			// Groups without rows are hidden with their head
			heads[i].elt.style.display = (shown > 0) ? '' : 'none';
			heads[i].list.style.display = (shown > 0) ? '' : 'none';
			count += shown;
		}

		empty.textContent = '';

		if (count == 0)
		{
			mxUtils.write(empty, mxResources.get('noResultsFor', [mxUtils.trim(value)]));
		}

		empty.style.display = (count == 0) ? '' : 'none';
	};

	// The field filters on each input and clears with Escape
	var search = skin.createSearch(mxResources.get('search'), filter);
	sheet.addSearch(search);

	for (var i = 0; i < groups.length; i++)
	{
		var head = sheet.section(groups[i].title);
		var list = document.createElement('div');
		list.className = cls.list;
		list.setAttribute('role', 'list');
		head.parentNode.appendChild(list);
		var group = {elt: head, list: list, rows: []};
		heads.push(group);

		for (var j = 0; j < groups[i].rows.length; j++)
		{
			var r = groups[i].rows[j];
			var row = document.createElement('div');
			row.className = cls.row;
			row.setAttribute('role', 'listitem');
			var label = document.createElement('span');
			label.className = cls.label;
			mxUtils.write(label, skin.getLabel(r.label));
			row.appendChild(label);
			var keys = document.createElement('span');
			keys.className = cls.keys;
			mxUtils.write(keys, r.keys);
			row.appendChild(keys);
			list.appendChild(row);
			group.rows.push({elt: row, text: (r.label + ' ' + r.keys).toLowerCase()});
		}
	}

	sheet.body.appendChild(empty);
	filter('');

	sheet.show();
	search.input.focus();
};
