/**
 * Adds the parts of draw.io to the omnibox (see grapheditor/Omnibox.js): the
 * menus of the themes, the pages, Find in Diagram, the rows of the property
 * table of the format panel and the search button of the format panel in the
 * simple theme.
 */
(function()
{
	/**
	 * Actions of draw.io that are not offered.
	 */
	Omnibox.prototype.hiddenActions = Omnibox.prototype.hiddenActions.concat(['about',
		'showBoundingBox', 'createSidebarEntry', 'downloadDesktop', 'toggleGoogleFonts',
		'exportOptionsDisabled']);

	/**
	 * Returns the menus of the toolbars in the simple, sketch and minimal
	 * themes.
	 */
	var omniboxGetMenuNames = Omnibox.prototype.getMenuNames;

	Omnibox.prototype.getMenuNames = function()
	{
		var theme = Editor.currentTheme;

		if (theme == 'simple' || theme == 'sketch' || theme == 'min')
		{
			return ['diagram', 'insert', 'view', 'pages', 'share'];
		}
		else
		{
			return omniboxGetMenuNames.apply(this, arguments);
		}
	};

	/**
	 * Adds the pages.
	 */
	var omniboxCreateEntries = Omnibox.prototype.createEntries;

	Omnibox.prototype.createEntries = function()
	{
		var entries = omniboxCreateEntries.apply(this, arguments);
		this.addPageEntries(entries);

		return entries;
	};

	/**
	 * Number of pages from which the pages of the file are entries (Fusion
	 * also lists the only page of a file, see EditorUi.configureOmnibox).
	 */
	Omnibox.prototype.minPageEntries = 2;

	/**
	 * Returns true if the pages of the file are entries (minPageEntries).
	 */
	Omnibox.prototype.hasPageEntries = function()
	{
		var ui = this.editorUi;

		return ui.pages != null && ui.pages.length > 0 &&
			ui.pages.length >= this.minPageEntries;
	};

	/**
	 * Adds the pages of the file as entries that select the page. The current
	 * page says so (Current page) and ranks after the other pages, as it is
	 * already shown; pages in a group have the name of the group as their
	 * path if the tabs show the groups.
	 */
	Omnibox.prototype.addPageEntries = function(entries)
	{
		var ui = this.editorUi;

		if (this.hasPageEntries())
		{
			var groups = typeof ui.isPageGroupsEnabled === 'function' && ui.isPageGroupsEnabled();

			for (var i = 0; i < ui.pages.length; i++)
			{
				(function(page, index)
				{
					var name = page.getName();
					var current = page == ui.currentPage;
					var group = (groups && typeof page.getGroup === 'function') ? page.getGroup() : null;

					if (name == null || name.length == 0)
					{
						name = mxResources.get('pageWithNumber', [index + 1]);
					}

					entries.push({id: 'page:' + page.getId(), group: 'pages', label: name,
						keys: [], path: (group != null) ? [group] : null,
						detail: (current) ? mxResources.get('currentPage') : null,
						current: current, rank: (current) ? 0.5 : 1, enabled: true, run: function()
						{
							ui.selectPage(page);
						}});
				})(ui.pages[i], i);
			}
		}
	};

	/**
	 * Returns true if the words of the label of the given entry are the given
	 * words (the words of the text joined by spaces, see Omnibox.getWords).
	 */
	Omnibox.prototype.isNamedEntry = function(entry, phrase)
	{
		return entry != null && entry.label != null && phrase != null && phrase.length > 0 &&
			Omnibox.getWords(entry.label).join(' ') == phrase;
	};

	/**
	 * The page whose name is the text is the first of the pages, also the
	 * current page, which else ranks after the pages whose names start with
	 * the text (Page-10 for page-1 on Page-1, where Enter opened Page-10), and
	 * a page that the group did not show as more pages start with the text.
	 * Of pages with that name the first that is not the current page.
	 */
	var omniboxGetResults = Omnibox.prototype.getResults;

	Omnibox.prototype.getResults = function(text)
	{
		var result = omniboxGetResults.apply(this, arguments);
		var pages = (result != null && result.groups != null) ? result.groups.pages : null;
		var phrase = (pages != null && result.query != null) ? Omnibox.getWords(result.query).join(' ') : '';

		if (phrase.length > 0 && this.entries != null)
		{
			var named = null;

			for (var i = 0; i < this.entries.length && (named == null || named.current); i++)
			{
				var entry = this.entries[i];

				if (entry.group == 'pages' && this.isNamedEntry(entry, phrase) &&
					this.isInScope(entry, result.scope))
				{
					named = (named == null || !entry.current) ? entry : named;
				}
			}

			if (named != null && pages[0] != named)
			{
				var index = mxUtils.indexOf(pages, named);

				if (index >= 0)
				{
					pages.splice(index, 1);
				}
				else if (pages.length >= this.getGroupLimit('pages'))
				{
					pages.pop();
				}

				pages.unshift(named);
			}
		}

		return result;
	};

	/**
	 * A page whose name is the text (Page-1, Flow) comes before the settings
	 * and the actions that only have the words in their labels, keywords or
	 * paths (Fit page for page-1), so Enter opens the page whose name was typed
	 * in full (the first of the pages, see getResults; the current page stays
	 * open), unless an enabled setting or action has the same name.
	 */
	var omniboxGetGroupOrder = Omnibox.prototype.getGroupOrder;

	Omnibox.prototype.getGroupOrder = function(groups, query)
	{
		var order = omniboxGetGroupOrder.apply(this, arguments);
		var phrase = (query != null) ? Omnibox.getWords(query).join(' ') : '';
		var index = mxUtils.indexOf(order, 'pages');

		if (phrase.length > 0 && index > 0 && groups != null && groups.pages != null &&
			this.isNamedEntry(groups.pages[0], phrase))
		{
			var first = index;

			for (var i = 0; i < index; i++)
			{
				var entries = groups[order[i]];

				if (order[i] != 'recent' && entries != null && entries.length > 0)
				{
					if (entries.some(mxUtils.bind(this, function(entry)
					{
						return entry.enabled && this.isNamedEntry(entry, phrase);
					})))
					{
						return order;
					}

					first = Math.min(first, i);
				}
			}

			if (first < index)
			{
				order = order.slice();
				order.splice(index, 1);
				order.splice(first, 0, 'pages');
			}
		}

		return order;
	};

	/**
	 * Adds Find in Diagram.
	 */
	var omniboxGetSearchEntries = Omnibox.prototype.getSearchEntries;

	Omnibox.prototype.getSearchEntries = function(query)
	{
		var result = omniboxGetSearchEntries.apply(this, arguments);
		var ui = this.editorUi;

		if (ui.actions.get('findReplace') != null)
		{
			result.push({group: 'search', icon: Editor.magnifyImage, label: mxResources.get('findInDiagramFor', [query]),
				enabled: true, run: function()
				{
					ui.showSearchWindow(ui.editor.graph.isEnabled(), query);
				}});
		}

		return result;
	};

	/**
	 * Returns the index of Pages in the given path of a menu item if the
	 * item is in the pages menu (also as a submenu of a menu, eg. … ›
	 * Pages), else -1.
	 */
	Omnibox.prototype.getPagesMenuIndex = function(path)
	{
		return (path != null) ? path.slice(0, 2).indexOf(mxResources.get('pages')) : -1;
	};

	/**
	 * Returns the names of the pages in the pages menu (keys of an object
	 * without a prototype, as they are user text).
	 */
	Omnibox.prototype.getPageMenuNames = function()
	{
		var ui = this.editorUi;
		var names = Object.create(null);

		for (var i = 0; i < ui.pages.length; i++)
		{
			names[ui.getShortPageName(ui.pages[i])] = true;
		}

		return names;
	};

	/**
	 * Returns the index of the name of a page in the given path of a menu
	 * item of the pages menu (… › Pages › Page-1, or … › Pages › Group ›
	 * Page-1 if the file has page groups), else -1. The names are the result
	 * of getPageMenuNames.
	 */
	Omnibox.prototype.getPageNameIndex = function(path, names)
	{
		var index = this.getPagesMenuIndex(path);

		if (index >= 0)
		{
			var ui = this.editorUi;
			var groups = typeof ui.isPageGroupsEnabled === 'function' && ui.isPageGroupsEnabled();
			var last = Math.min(path.length - 1, index + ((groups) ? 2 : 1));

			for (var i = index + 1; i <= last; i++)
			{
				if (names[path[i]] == true)
				{
					return i;
				}
			}
		}

		return -1;
	};

	/**
	 * Leaves out the items of the pages menu that have the name of a page,
	 * which are entries of the pages group, and the items of the submenu of
	 * a page (… › Pages › Page-1 › Open in New Window on phones, also below
	 * the group of the page), whose path has the name of the page, so the name
	 * found them before the page.
	 */
	var omniboxAddMenuEntries = Omnibox.prototype.addMenuEntries;

	Omnibox.prototype.addMenuEntries = function(entries, items)
	{
		if (this.hasPageEntries())
		{
			var names = this.getPageMenuNames();

			items = items.filter(mxUtils.bind(this, function(item)
			{
				return this.getPagesMenuIndex(item.path) < 0 || (names[item.title] != true &&
					this.getPageNameIndex(item.path, names) < 0);
			}));
		}

		omniboxAddMenuEntries.call(this, entries, items);
	};

	/**
	 * Actions in the submenu of a page (… › Pages › Page-1 › Remove Page on
	 * phones, also … › Pages › Group › Page-1 › Remove Page) have the path of
	 * the pages menu without the group and the name of the page: else the name
	 * of the page found Remove Page before the page, and Enter removed it.
	 * These actions act on the current page.
	 */
	var omniboxAddActionEntries = Omnibox.prototype.addActionEntries;

	Omnibox.prototype.addActionEntries = function(entries, paths, hidden, enabled)
	{
		if (paths != null && this.hasPageEntries())
		{
			var names = this.getPageMenuNames();
			var result = Object.create(null);

			for (var key in paths)
			{
				var path = paths[key];
				result[key] = (this.getPageNameIndex(path, names) >= 0) ?
					path.slice(0, this.getPagesMenuIndex(path) + 1) : path;
			}

			paths = result;
		}

		omniboxAddActionEntries.call(this, entries, paths, hidden, enabled);
	};

	/**
	 * Returns true if the search box of the shapes is showing (see
	 * EditorUi.focusOmniSearch).
	 */
	Omnibox.prototype.isShapeSearchVisible = function()
	{
		var input = document.getElementById('geOmniSearch');

		return input != null && input.clientWidth > 30;
	};

	/**
	 * Offers the search for shapes only if the shapes can be shown.
	 */
	var omniboxCanSearchShapes = Omnibox.prototype.canSearchShapes;

	Omnibox.prototype.canSearchShapes = function()
	{
		var ui = this.editorUi;
		var action = ui.actions.get('toggleShapes');

		return omniboxCanSearchShapes.apply(this, arguments) && (this.isShapesVisible() ||
			ui.sidebarWindow != null || (action != null && action.isEnabled() && action.visible));
	};

	/**
	 * Returns true if the shapes are showing: the shapes window of the sketch
	 * and minimal themes or the shapes panel, also if its search is hidden
	 * with View > Search.
	 */
	Omnibox.prototype.isShapesVisible = function()
	{
		var ui = this.editorUi;
		var action = ui.actions.get('toggleShapes');

		if (ui.sidebarWindow != null)
		{
			return ui.sidebarWindow.window.isVisible();
		}
		else if (ui.sidebarElt != null)
		{
			return ui.sidebarElt.parentNode != null;
		}
		else if (Editor.currentTheme == 'sketch' || Editor.currentTheme == 'min')
		{
			// The shapes of these themes are in a window that does not exist
			// yet, also if the split of the editor is left from another theme
			return false;
		}
		else
		{
			return (action != null) ? action.isSelected() == true : ui.isShapesPanelVisible();
		}
	};

	/**
	 * Shows the shapes and their search before the search for shapes: the
	 * shapes window of the sketch and minimal themes, which the Shapes action
	 * of these themes creates if it does not exist, or the shapes panel, and
	 * the search if it is hidden with View > Search.
	 */
	var omniboxSearchShapes = Omnibox.prototype.searchShapes;

	Omnibox.prototype.searchShapes = function(query)
	{
		var ui = this.editorUi;
		var shown = false;

		if (!this.isShapesVisible())
		{
			if (ui.sidebarWindow != null)
			{
				ui.sidebarWindow.window.setVisible(true);
			}
			else if (ui.actions.get('toggleShapes') != null)
			{
				ui.actions.get('toggleShapes').funct();
			}

			shown = true;
		}

		// Shows the search for this time without changing the setting
		if (ui.sidebar != null && typeof ui.sidebar.isEntryVisible === 'function' &&
			!ui.sidebar.isEntryVisible('search'))
		{
			ui.sidebar.showPalette('search', true);
			shown = true;
		}

		omniboxSearchShapes.apply(this, arguments);

		// Focuses the search box after the transition of the shapes panel
		if (shown && !this.isShapeSearchVisible())
		{
			window.setTimeout(function()
			{
				ui.focusOmniSearch();
			}, Editor.transitionDelay * 1000 + 100);
		}
	};

	/**
	 * Adds the rows of the property table.
	 */
	Omnibox.prototype.formatControlSelector += ', tr.gePropNonHeaderRow';

	/**
	 * Returns the name of the property in the rows of the property table and
	 * ignores the controls inside the table.
	 */
	var omniboxGetFormatControl = Omnibox.prototype.getFormatControl;

	Omnibox.prototype.getFormatControl = function(elt, panel)
	{
		var row = (elt.nodeName == 'TR') ? elt : null;
		var parent = elt.parentNode;

		while (row == null && parent != null && parent != panel)
		{
			if (parent.nodeName == 'TABLE' && parent.classList.contains('geProperties'))
			{
				return null;
			}

			parent = parent.parentNode;
		}

		if (row != null)
		{
			var name = row.getAttribute('data-pName');
			var cells = row.getElementsByTagName('td');

			if (name == null || cells.length < 2 || row.getAttribute('data-index') != null)
			{
				return null;
			}

			var input = cells[1].getElementsByTagName('input');
			var value = mxUtils.trim(cells[1].textContent);
			var checked = null;

			if (input.length > 0 && input[0].getAttribute('type') == 'checkbox')
			{
				checked = input[0].checked == true;
				value = null;
			}

			return {label: mxUtils.trim(cells[0].textContent), names: [name],
				value: (value != null && value.length > 0) ? value : null,
				checked: checked, enabled: true};
		}
		else
		{
			return omniboxGetFormatControl.apply(this, arguments);
		}
	};

	/**
	 * Rows of the property table are in the section of the table.
	 */
	var omniboxGetFormatSections = Omnibox.prototype.getFormatSections;

	Omnibox.prototype.getFormatSections = function(elt, panel)
	{
		var path = omniboxGetFormatSections.apply(this, arguments);

		if (elt.nodeName == 'TR')
		{
			path.push(mxResources.get('property'));
		}

		return path;
	};

	/**
	 * Rows of the property table are hidden in a collapsed table.
	 */
	var omniboxIsFormatControlHidden = Omnibox.prototype.isFormatControlHidden;

	Omnibox.prototype.isFormatControlHidden = function(elt, panel)
	{
		return omniboxIsFormatControlHidden.call(this,
			(elt.nodeName == 'TR') ? elt.parentNode : elt, panel);
	};

	/**
	 * Expands the property table and removes its filter for a row.
	 */
	var omniboxExpandFormatControl = Omnibox.prototype.expandFormatControl;

	Omnibox.prototype.expandFormatControl = function(elt, container)
	{
		var result = omniboxExpandFormatControl.apply(this, arguments);

		if (!result && elt.nodeName == 'TR')
		{
			var table = elt.parentNode;

			while (table != null && table.nodeName != 'TABLE')
			{
				table = table.parentNode;
			}

			if (table != null)
			{
				if (this.editorUi.propertiesCollapsed)
				{
					var header = table.querySelector('.gePropHeader');

					if (header != null)
					{
						header.click();
					}
				}

				if (elt.style.display == 'none')
				{
					var filter = table.querySelector('tr.gePropNonHeaderRow:not([data-pName]) input');

					if (filter != null && filter.value.length > 0)
					{
						filter.value = '';
						filter.dispatchEvent(new Event('input'));
					}
				}
			}

			result = elt.style.display != 'none';
		}

		return result;
	};

	/**
	 * Highlights the row of a property.
	 */
	Omnibox.prototype.getFormatControlFocus = (function(getFormatControlFocus)
	{
		return function(elt)
		{
			if (elt.nodeName == 'TR')
			{
				var input = elt.querySelector('input, select');

				return (input != null) ? input : null;
			}
			else
			{
				return getFormatControlFocus.apply(this, arguments);
			}
		};
	})(Omnibox.prototype.getFormatControlFocus);

	/**
	 * The omnibox is part of the new look of the Simple theme (the theme modern),
	 * and the developer switch omnibox=1 shows it in all themes: without them
	 * the app has no omnibox, as before (no Ctrl+Alt+P, no search buttons in
	 * the toolbar and the format panel of the Simple theme, no entry in the
	 * action search of the sidebar).
	 */
	EditorUi.prototype.isOmniboxEnabled = function()
	{
		return typeof Omnibox !== 'undefined' && (urlParams['omnibox'] == '1' ||
			(typeof Editor.isSimpleModern === 'function' && Editor.isSimpleModern()));
	};

	/**
	 * Shows the search button of the format panel in the simple theme. The
	 * new look has no search in the panel: the omnibox of its top bar lists
	 * the settings of the selection first.
	 */
	EditorUi.prototype.isFormatSearchVisible = function()
	{
		return this.isOmniboxEnabled() && Editor.isSimpleClassic() && // SIMPLE-CLASSIC
			!this.editor.chromeless && typeof Omnibox !== 'undefined';
	};

	/**
	 * Maximum number of the recently used entries that are stored.
	 */
	Omnibox.prototype.maxStoredRecent = 5;

	/**
	 * Returns the recently used entries of this browser (mxSettings, never
	 * sent anywhere).
	 */
	var omniboxGetRecentEntries = Omnibox.prototype.getRecentEntries;

	Omnibox.prototype.getRecentEntries = function()
	{
		if (!this.recentLoaded && typeof mxSettings !== 'undefined' && mxSettings.settings != null)
		{
			this.recentLoaded = true;
			var stored = mxSettings.settings.omniboxRecent;

			if (Array.isArray(stored))
			{
				this.recent = stored.filter(function(id)
				{
					return typeof id === 'string' && id.length < 500;
				}).slice(0, this.maxStoredRecent);
			}
		}

		return omniboxGetRecentEntries.apply(this, arguments);
	};

	/**
	 * Stores the recently used entries.
	 */
	var omniboxAddRecent = Omnibox.prototype.addRecent;

	Omnibox.prototype.addRecent = function(entry)
	{
		this.getRecentEntries();
		omniboxAddRecent.apply(this, arguments);

		if (entry.id != null && typeof mxSettings !== 'undefined' && mxSettings.settings != null)
		{
			mxSettings.settings.omniboxRecent = this.recent.slice(0, this.maxStoredRecent);
			mxSettings.save();
		}
	};
})();
