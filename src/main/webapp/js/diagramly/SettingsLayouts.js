/**
 * Copyright (c) 2026, JGraph Holdings Ltd
 * Copyright (c) 2026, draw.io AG
 */
/**
 * The dialogs of the settings of Fusion in every look that has them:
 * Plugins (PluginsDialog), Configuration (showConfigurationEditorDialog),
 * the languages available offline (showLanguageDialog) and the Settings
 * dialog (showSettingsDialog, All settings... of Simple). This part is
 * Plugins: the built-in plugins as checkboxes, the others as a list with
 * Delete and Add Plugin.
 *
 * The layout takes a skin: the Classic skin (PluginsLayout.skins.classic,
 * docs/dialog-style-guide.md, its CSS in grapheditor.css) for Simple, behind
 * the feature pluginsDialog of Editor.featureDefaults (Editor.isPluginsDialogEnabled), or
 * the skin of Fusion, which SimpleSettings.js adds (PluginsLayout.skins.fusion), so
 * the code exists once. The dialog of before is shown where the feature is
 * off.
 */
var PluginsLayout = {};

/**
 * The skins of the layout (the skin of Fusion is added by SimpleSettings.js).
 */
PluginsLayout.skins = {};

/**
 * Returns the skin of the current look: the skin of Fusion in the theme
 * Fusion, else the Classic skin.
 */
PluginsLayout.getSkin = function()
{
	return (typeof Editor.isSimpleModern === 'function' && Editor.isSimpleModern() &&
		PluginsLayout.skins.fusion != null) ? PluginsLayout.skins.fusion :
		PluginsLayout.skins.classic;
};

/**
 * Returns true if the dialog shows the layout of Fusion: the feature pluginsDialog
 * of Editor.featureDefaults (pluginsDialog in the configuration and the URL), on in
 * Simple, off in Classic, Sketch, Minimal and Atlas. The theme Fusion always
 * has it.
 */
Editor.isPluginsDialogEnabled = function()
{
	return Editor.isFeatureEnabled('pluginsDialog');
};

/**
 * Width of the content of Plugins in the Classic skin (the frame adds 48).
 */
PluginsLayout.width = 440;

/**
 * Returns a glyph of the Classic skin for the given image (a data URI of the
 * glyphs of Editor): a mask in the color of the text, so it follows dark mode.
 */
PluginsLayout.createGlyph = function(image)
{
	var glyph = document.createElement('span');
	glyph.className = 'geSettingsGlyph';
	glyph.style.setProperty('--ge-settings-glyph', 'url(\'' + image + '\')');
	glyph.setAttribute('aria-hidden', 'true');

	return glyph;
};

/**
 * Returns a heading of a section with the given title (the titles of the
 * sections of the Preview template).
 */
PluginsLayout.createSectionHead = function(title)
{
	var head = document.createElement('div');
	head.className = 'gePreviewSectionTitle';
	head.setAttribute('role', 'heading');
	head.setAttribute('aria-level', '3');
	mxUtils.write(head, title);

	return head;
};

/**
 * Returns a new checkbox row with the given label, hint and state; fn is
 * called with the new state. The row is {row, input}.
 */
PluginsLayout.createCheckRow = function(label, hint, checked, fn)
{
	var row = document.createElement('div');
	row.className = 'geSettingsCheck';
	var input = document.createElement('input');
	input.setAttribute('type', 'checkbox');
	input.id = 'geSettingsCheck-' + Editor.guid();
	input.checked = checked;
	row.appendChild(input);

	var l = document.createElement('label');
	l.setAttribute('for', input.id);
	var name = document.createElement('span');
	name.className = 'geSettingsCheckName';
	mxUtils.write(name, label);
	l.appendChild(name);

	if (hint != null && hint != '')
	{
		var h = document.createElement('span');
		h.className = 'geDialogHint geSettingsCheckHint';
		mxUtils.write(h, hint);
		l.appendChild(h);
	}

	row.appendChild(l);

	mxEvent.addListener(input, 'change', function()
	{
		fn(input.checked);
	});

	return {row: row, input: input};
};

/**
 * The Classic skin of Plugins (docs/dialog-style-guide.md), for Simple: the
 * headline of the dialogs with when the changes take effect, the built-in
 * plugins as checkboxes with their file, the other plugins as rows of a list
 * with Delete, Add Plugin... as a button and the buttons of the dialog. The
 * CSS is in grapheditor.css under .gePlugins.
 */
PluginsLayout.skins.classic = {
	name: 'classic',
	classes: {head: 'gePluginsHead', subtitle: 'geDialogHint gePluginsSubtitle', body: 'gePluginsBody',
		group: 'gePluginsGroup', list: 'gePluginsList', row: 'gePluginsRow', name: 'gePluginsName',
		remove: 'gePluginsDelete', empty: 'geDialogHint gePluginsEmpty', replaced: 'gePluginsReplaced'},
	/**
	 * Lays out the given content of the dialog as the form.
	 */
	prepare: function(div)
	{
		div.classList.add('gePlugins');
	},
	/**
	 * Prepares the buttons of the dialog for the footer.
	 */
	prepareButtons: function(buttons)
	{
		buttons.classList.add('gePluginsFooter');
		buttons.style.marginTop = '';
	},
	createSectionHead: function(title)
	{
		return PluginsLayout.createSectionHead(title);
	},
	/**
	 * Returns the row of a built-in plugin: a checkbox (on: the plugin is in
	 * the list) with its name and its file.
	 */
	createSwitch: function(ui, label, hint, checked, fn)
	{
		return PluginsLayout.createCheckRow(label, hint, checked, fn);
	},
	/**
	 * Returns Add Plugin..., which runs fn (the prompt or the file picker of
	 * the dialog).
	 */
	createAddButton: function(label, fn)
	{
		var btn = mxUtils.button(label + '...', function(evt)
		{
			fn(evt);
			mxEvent.consume(evt);
		});
		btn.className = 'geBtn gePluginsAdd';

		return btn;
	},
	/**
	 * Returns Delete of a plugin with the given title.
	 */
	createRemoveButton: function(title, fn)
	{
		var btn = document.createElement('button');
		btn.setAttribute('type', 'button');
		btn.className = 'gePluginsDelete';
		btn.setAttribute('title', title);
		btn.setAttribute('aria-label', title);
		btn.appendChild(PluginsLayout.createGlyph(Editor.trashImage));

		mxEvent.addListener(btn, 'click', function(evt)
		{
			fn(evt);
			mxEvent.consume(evt);
		});

		return btn;
	},
	/**
	 * Fits the height of the dialog to the given content after the list of
	 * the plugins has changed (as addAdvancedSection does; max-height keeps
	 * it in the window).
	 */
	fit: function(ui, div)
	{
		var dlg = div.parentNode;

		if (dlg != null && dlg.nodeType == mxConstants.NODETYPE_ELEMENT &&
			dlg.classList.contains('geDialog') && dlg.firstElementChild == div)
		{
			// The top stays where it is (Dialog.setFrameHeight)
			var top = dlg.getBoundingClientRect().top;
			dlg.style.height = '';
			Dialog.setFrameHeight(dlg, Dialog.getFrameHeight(dlg, div.scrollHeight), top);
		}
	}
};

/**
 * Lays out the given plugins dialog in the Classic skin where the feature is
 * on (Fusion lays it out in SimpleSettings.js). Called at the end of the
 * constructor of PluginsDialog. The dialog is shown PluginsLayout.width wide
 * (see the showDialog of this file).
 */
EditorUi.prototype.installPluginsLayout = function(dlg)
{
	if (!this.editor.isChromelessView() && Editor.isPluginsDialogEnabled() &&
		PluginsLayout.getSkin() == PluginsLayout.skins.classic)
	{
		try
		{
			if (this.createPluginsLayout(dlg, PluginsLayout.skins.classic))
			{
				dlg.container.settingsLayoutSize = {width: PluginsLayout.width, height: null};
			}
		}
		catch (e)
		{
			EditorUi.debug('EditorUi.installPluginsLayout', [this], 'error', [e]);
		}
	}
};

/**
 * Replaces the layout of the given plugins dialog with a form in the given
 * skin: the built-in plugins as switches or checkboxes (on: the plugin is in
 * the list), the other plugins of the list as rows with Delete, Add plugin
 * (a URL, or the file picker of the desktop app), and when the changes take
 * effect. The list of the dialog stays the source: switches add with its Add
 * button and remove with its function, so Apply stores the same plugins (see
 * PluginsDialog.controls). Returns true if the dialog was laid out.
 */
EditorUi.prototype.createPluginsLayout = function(dlg, skin)
{
	var ui = this;
	var c = dlg.controls;
	var div = dlg.container;
	var cls = skin.classes;

	// Keeps the previous layout if the dialog has changed
	if (c == null || c.title == null || c.list == null || c.plugins == null || c.remove == null ||
		c.buttons == null || c.title.parentNode != div || c.buttons.parentNode != div)
	{
		return false;
	}

	skin.prepare(div);

	// The headline and when the changes take effect
	var head = document.createElement('div');
	head.className = cls.head;
	div.insertBefore(head, c.title);
	head.appendChild(c.title);
	var sub = document.createElement('div');
	sub.className = cls.subtitle;
	mxUtils.write(sub, mxResources.get('restartForChangeRequired'));
	head.appendChild(sub);

	var body = document.createElement('div');
	body.className = cls.body;
	div.insertBefore(body, c.buttons);
	c.list.classList.add(cls.replaced);

	if (c.addRow != null)
	{
		c.addRow.classList.add(cls.replaced);
	}

	if (c.addButton != null)
	{
		c.addButton.classList.add(cls.replaced);
	}

	skin.prepareButtons(c.buttons);

	// The built-in plugins as switches (the app adds them from its list)
	var builtin = {};
	var switches = [];

	if (c.select != null && c.add != null && typeof App !== 'undefined' &&
		App.publicPlugin != null && App.pluginRegistry != null)
	{
		body.appendChild(skin.createSectionHead(mxResources.get('builtinPluginsCaption')));
		var group = document.createElement('div');
		group.className = cls.group;
		body.appendChild(group);

		for (var i = 0; i < App.publicPlugin.length; i++)
		{
			(function(key)
			{
				var url = App.pluginRegistry[key];

				if (url != null)
				{
					builtin[url] = key;

					var s = skin.createSwitch(ui, key, url, mxUtils.indexOf(c.plugins, url) >= 0, function(on)
					{
						var index = mxUtils.indexOf(c.plugins, url);

						if (on && index < 0)
						{
							c.select.value = key;
							c.select.dispatchEvent(new Event('change'));
							c.add.click();
						}
						else if (!on && index >= 0)
						{
							c.remove(index);
						}
					});

					s.url = url;
					switches.push(s);
					group.appendChild(s.row);
				}
			})(App.publicPlugin[i]);
		}
	}

	// The other plugins of the list (URLs, files of the desktop app)
	body.appendChild(skin.createSectionHead(mxResources.get((switches.length > 0) ?
		'custom' : 'plugins')));
	var list = document.createElement('div');
	list.className = cls.list;
	list.setAttribute('role', 'list');
	body.appendChild(list);

	// Add plugin: the URL prompt of the dialog, or its Add button (desktop)
	var addTarget = (c.custom != null) ? c.custom : c.addButton;
	var addBtn = null;

	if (addTarget != null)
	{
		addBtn = skin.createAddButton(mxResources.get('addPlugin'), function()
		{
			addTarget.click();
		});

		body.appendChild(addBtn);
	}

	var observer = null;

	var update = function()
	{
		for (var i = 0; i < switches.length; i++)
		{
			switches[i].input.checked = mxUtils.indexOf(c.plugins, switches[i].url) >= 0;
		}

		list.textContent = '';
		var count = 0;

		for (var i = 0; i < c.plugins.length; i++)
		{
			(function(index, name, pos)
			{
				if (builtin[name] == null || switches.length == 0)
				{
					var row = document.createElement('div');
					row.className = cls.row;
					row.setAttribute('role', 'listitem');
					var text = document.createElement('span');
					text.className = cls.name;
					text.setAttribute('title', name);
					mxUtils.write(text, name);
					row.appendChild(text);

					row.appendChild(skin.createRemoveButton(mxResources.get('delete') + ' ' + name, function()
					{
						// Asks first, like the list of the previous look
						ui.confirm(mxResources.get('delete') + ' "' + name + '"?', function()
						{
							c.remove(index);

							// The rows are built again now and the records of the
							// observer are dropped (it would build them again after
							// this handler and remove the focused button), then the
							// focus goes to the row in the same place (or Add plugin)
							update();

							if (observer != null)
							{
								observer.takeRecords();
							}

							var btns = list.querySelectorAll('.' + cls.remove);
							var next = (btns.length > 0) ? btns[Math.min(pos, btns.length - 1)] : addBtn;

							// After the confirmation returns the focus (hideDialog does
							// it in a timeout)
							window.setTimeout(function()
							{
								if (next != null)
								{
									next.focus();
								}
							}, 0);
						});
					}));

					list.appendChild(row);
					count++;
				}
			})(i, c.plugins[i], count);
		}

		if (count == 0)
		{
			var empty = document.createElement('div');
			empty.className = cls.empty;
			mxUtils.write(empty, mxResources.get('noPlugins'));
			list.appendChild(empty);
		}

		skin.fit(ui, div);
	};

	// Follows the list of the dialog (refresh writes it again)
	if (window.MutationObserver != null)
	{
		observer = new MutationObserver(update);
		observer.observe(c.list, {childList: true});
	}

	update();

	return true;
};

/**
 * Shows the dialogs of this file that are laid out in the Classic skin in
 * their size: settingsLayoutSize of their content is the width and the
 * height (null for the height of the content).
 */
(function()
{
	var editorUiShowDialog = EditorUi.prototype.showDialog;

	EditorUi.prototype.showDialog = function(elt, w, h)
	{
		var args = arguments;

		if (elt != null && elt.settingsLayoutSize != null)
		{
			args = Array.prototype.slice.call(arguments);
			args[1] = elt.settingsLayoutSize.width;
			args[2] = elt.settingsLayoutSize.height;
		}

		return editorUiShowDialog.apply(this, args);
	};
})();

/**
 * Configuration (showConfigurationEditorDialog): the sections of the editor
 * as categories, a search and the settings as rows, JSON as a second view.
 *
 * The layout takes a skin: the Classic skin (ConfigLayout.skins.classic,
 * docs/dialog-style-guide.md, its CSS in grapheditor.css) for Simple, behind
 * the feature configDialog of Editor.featureDefaults (Editor.isConfigDialogEnabled), or
 * the skin of Fusion, which SimpleSettings.js adds (ConfigLayout.skins.fusion), so
 * the code exists once. The dialog of before is shown where the feature is
 * off.
 */
var ConfigLayout = {};

/**
 * The skins of the layout (the skin of Fusion is added by SimpleSettings.js).
 */
ConfigLayout.skins = {};

/**
 * Returns the skin of the current look: the skin of Fusion in the theme
 * Fusion, else the Classic skin.
 */
ConfigLayout.getSkin = function()
{
	return (typeof Editor.isSimpleModern === 'function' && Editor.isSimpleModern() &&
		ConfigLayout.skins.fusion != null) ? ConfigLayout.skins.fusion :
		ConfigLayout.skins.classic;
};

/**
 * Returns true if the dialog shows the layout of Fusion: the feature configDialog
 * of Editor.featureDefaults (configDialog in the configuration and the URL), on in
 * Simple, off in Classic, Sketch, Minimal and Atlas. The theme Fusion always
 * has it.
 */
Editor.isConfigDialogEnabled = function()
{
	return Editor.isFeatureEnabled('configDialog');
};

/**
 * Size of the content of Configuration in the Classic skin (the frame adds
 * 48), limited to the window (EditorUi.getConfigLayoutSize).
 */
ConfigLayout.size = {width: 960, height: 640};

/**
 * Space between the frame and the window in the Classic skin.
 */
ConfigLayout.windowMargin = 32;

/**
 * The Classic skin (docs/dialog-style-guide.md), for Simple: the headline of
 * the dialogs with when the changes take effect in gray, Editor and JSON as
 * a list, the categories on the left as in the New dialog, the three states
 * of each setting (default, on, off) as a list, the colors of the dialogs of
 * the theme light and dark and the focus rings as outlines inside of the
 * controls. The CSS is in grapheditor.css under .geCfg.
 */
ConfigLayout.skins.classic = {
	name: 'classic',
	classes: {head: 'geCfgHead', titles: 'geCfgTitles', subtitle: 'geDialogHint geCfgSubtitle',
		body: 'geCfgBody', json: 'geCfgJson', nav: 'geCfgNav', category: 'geCfgCategory', on: 'geCfgOn',
		main: 'geCfgMain', search: 'geCfgSearch', editor: 'geCfgEditor', text: 'geCfgText',
		hidden: 'geCfgHidden', replaced: 'geCfgReplaced'},
	/**
	 * Lays out the given content of the dialog as the layout.
	 */
	prepare: function(ui, elt)
	{
		elt.classList.add('geCfg');
		elt.style.cssText = '';

		// The text of JSON shows the focus ring of the skin
		if (elt.configControls != null && elt.configControls.textarea != null)
		{
			elt.configControls.textarea.style.outline = '';
		}
	},
	/**
	 * Returns the choice of the view (the given items, value is chosen) as a
	 * list with the given label; fn is called with the new value.
	 */
	createView: function(ui, items, value, fn, label)
	{
		var view = document.createElement('label');
		view.className = 'geCfgView';
		mxUtils.write(view, label);

		var select = document.createElement('select');

		for (var i = 0; i < items.length; i++)
		{
			var option = document.createElement('option');
			option.setAttribute('value', items[i].value);
			mxUtils.write(option, items[i].label);
			select.appendChild(option);
		}

		select.value = value;
		view.appendChild(select);

		mxEvent.addListener(select, 'change', function(evt)
		{
			fn(select.value, evt);
		});

		return view;
	},
	/**
	 * Adds the parts of the skin to the given search box with the given input.
	 */
	initSearch: function(ui, box, input)
	{
		// Nothing to add: the field has its placeholder
	},
	/**
	 * Replaces the given three states of a setting (tri-toggle of
	 * ConfigEditor.js) with a list (default, on, off) named after the given
	 * name of the setting; the list clicks the button of its state, so the
	 * editor changes the configuration as before.
	 */
	initToggle: function(ui, toggle, name)
	{
		var select = document.createElement('select');
		select.className = 'geCfgState';
		var states = [['unset', 'default'], ['true', 'on'], ['false', 'off']];

		for (var i = 0; i < states.length; i++)
		{
			var option = document.createElement('option');
			option.setAttribute('value', states[i][0]);
			mxUtils.write(option, mxResources.get(states[i][1]));
			select.appendChild(option);
		}

		if (name != null)
		{
			if (name.id == '')
			{
				name.id = 'geCfgName-' + Editor.guid();
			}

			select.setAttribute('aria-labelledby', name.id);
		}

		mxEvent.addListener(select, 'change', function()
		{
			var btn = toggle.querySelector('button[data-value="' + select.value + '"]');

			if (btn != null)
			{
				btn.click();
			}
		});

		toggle.classList.add(this.classes.replaced);
		toggle.parentNode.insertBefore(select, toggle.nextSibling);
		toggle.cfgSelect = select;
	},
	/**
	 * Shows the state of the given three states of a setting in its list.
	 */
	updateToggle: function(ui, toggle)
	{
		var select = toggle.cfgSelect;
		var active = toggle.querySelector('button[class^="active--"]');

		if (select != null)
		{
			select.value = (active != null) ? active.getAttribute('data-value') : 'unset';
		}
	},
	/**
	 * Lays out the given footer: help and the given buttons of the dialog on
	 * the left, Close and Apply in their order on the right.
	 */
	layoutFooter: function(ui, btns, left, c)
	{
		var first = btns.firstChild;
		var start = (left.length > 0) ? left[left.length - 1] :
			((first != null && first != c.close && first != c.apply) ? first : null);
		btns.classList.add('geCfgFooter');

		if (start != null)
		{
			start.classList.add('geCfgFooterStart');
		}
	}
};

/**
 * Lays out the content of the given Configuration dialog in the Classic skin
 * where the feature configDialog is on (Fusion lays it out in
 * SimpleSettings.js) and returns the size of its content, or null if the
 * dialog keeps the layout of before. Called by showConfigurationEditorDialog
 * before it shows the dialog.
 */
EditorUi.prototype.installConfigLayout = function(elt)
{
	if (!this.editor.isChromelessView() && Editor.isConfigDialogEnabled() &&
		ConfigLayout.getSkin() == ConfigLayout.skins.classic && elt != null &&
		elt.configControls != null)
	{
		try
		{
			if (this.createConfigLayout(elt, elt.configControls, ConfigLayout.skins.classic))
			{
				return this.getConfigLayoutSize();
			}
		}
		catch (e)
		{
			EditorUi.debug('EditorUi.installConfigLayout', [this], 'error', [e]);
		}
	}

	return null;
};

/**
 * Returns the size of the content of Configuration in the Classic skin: the
 * size of the layout (ConfigLayout.size) limited to the window.
 */
EditorUi.prototype.getConfigLayoutSize = function()
{
	var ww = window.innerWidth || document.documentElement.clientWidth;
	var wh = window.innerHeight || document.documentElement.clientHeight;
	var margin = 48 + ((ww < 640) ? 0 : ConfigLayout.windowMargin);

	return {width: Math.max(Math.min(ConfigLayout.size.width, ww - margin), 240),
		height: Math.max(Math.min(ConfigLayout.size.height, wh - margin), 240)};
};

/**
 * Lays out the given content of the Configuration dialog with the given
 * controls (configControls of showConfigurationEditorDialog) in the given
 * skin (ConfigLayout.skins): the headline and when changes take effect,
 * Editor and JSON as the view (the tabs of the dialog), the sections of the
 * editor as categories on the left, the search above the settings, the
 * settings as sections of rows (the three states of each setting as the
 * skin shows them: default, on, off), the buttons of the dialog (Reset,
 * Plugins, Link, Preferences) on the left of the footer, Close and Apply on
 * the right. The editor and the text of the dialog are moved, so Apply
 * stores what it did. Returns false if the dialog has changed and keeps the
 * layout of before.
 */
EditorUi.prototype.createConfigLayout = function(elt, c, skin)
{
	if (c == null || c.tabBar == null || c.editor == null || c.json == null || c.buttons == null ||
		c.apply == null || c.tabBar.parentNode != elt || c.buttons.parentNode != elt)
	{
		return false;
	}

	var ui = this;
	var cls = skin.classes;
	skin.prepare(this, elt);

	// The head: the headline, when changes take effect and the view
	var head = document.createElement('div');
	head.className = cls.head;
	var titles = document.createElement('div');
	titles.className = cls.titles;
	var h3 = document.createElement('h3');
	mxUtils.write(h3, mxResources.get('configuration'));
	titles.appendChild(h3);
	var sub = document.createElement('div');
	sub.className = cls.subtitle;
	mxUtils.write(sub, mxResources.get('restartForChangeRequired'));
	titles.appendChild(sub);
	head.appendChild(titles);

	var body = document.createElement('div');
	body.className = cls.body;

	var view = skin.createView(this, [
		{value: 'editor', label: mxUtils.trim(c.editorTab.textContent)},
		{value: 'json', label: mxUtils.trim(c.jsonTab.textContent)}], 'editor', function(value)
	{
		((value == 'json') ? c.jsonTab : c.editorTab).click();
		body.classList.toggle(cls.json, value == 'json');
	}, mxResources.get('view'));
	head.appendChild(view);
	elt.insertBefore(head, elt.firstChild);
	c.tabBar.classList.add(cls.replaced);

	// The categories: the sections of the editor
	var nav = document.createElement('div');
	nav.className = cls.nav;
	nav.setAttribute('role', 'list');
	nav.setAttribute('aria-label', mxResources.get('configuration'));
	body.appendChild(nav);

	var main = document.createElement('div');
	main.className = cls.main;
	body.appendChild(main);
	elt.insertBefore(body, c.buttons);

	// The search of the editor above the settings
	var searchBox = c.editor.querySelector('.search-box');
	var searchInput = (searchBox != null) ? searchBox.querySelector('input') : null;

	if (searchBox != null)
	{
		searchBox.className = cls.search;
		skin.initSearch(this, searchBox, searchInput);
		main.appendChild(searchBox);

		if (searchInput != null)
		{
			searchInput.setAttribute('type', 'search');
			searchInput.setAttribute('aria-label', searchInput.getAttribute('placeholder') ||
				mxResources.get('search'));
		}
	}

	c.editor.style.cssText = '';
	c.editor.classList.add(cls.editor);
	main.appendChild(c.editor);
	c.json.style.cssText = 'display:none;';
	c.json.classList.add(cls.text);
	main.appendChild(c.json);

	var sections = c.editor.querySelectorAll('.config-section');
	var items = [];
	var current = null;

	var select = function(section, focus)
	{
		current = section;

		for (var i = 0; i < sections.length; i++)
		{
			sections[i].classList.toggle(cls.hidden, section != null && sections[i] != section);
		}

		for (var i = 0; i < items.length; i++)
		{
			var on = items[i].section == section;
			items[i].btn.classList.toggle(cls.on, on);

			if (on)
			{
				items[i].btn.setAttribute('aria-current', 'true');
			}
			else
			{
				items[i].btn.removeAttribute('aria-current');
			}
		}

		c.editor.scrollTop = 0;
	};

	var addItem = function(label, section)
	{
		var btn = document.createElement('button');
		btn.setAttribute('type', 'button');
		btn.className = cls.category;
		mxUtils.write(btn, label);
		var wrapper = document.createElement('div');
		wrapper.setAttribute('role', 'listitem');
		wrapper.appendChild(btn);
		nav.appendChild(wrapper);
		var item = {btn: btn, section: section};
		items.push(item);

		mxEvent.addListener(btn, 'click', function(evt)
		{
			// A category shows all of its settings
			if (searchInput != null && searchInput.value != '')
			{
				searchInput.value = '';
				searchInput.dispatchEvent(new Event('input'));
			}

			select(section);
			mxEvent.consume(evt);
		});

		// Up and down move between the categories
		mxEvent.addListener(btn, 'keydown', function(evt)
		{
			var index = mxUtils.indexOf(items, item);
			var next = (evt.key == 'ArrowDown') ? index + 1 : ((evt.key == 'ArrowUp') ? index - 1 :
				((evt.key == 'Home') ? 0 : ((evt.key == 'End') ? items.length - 1 : null)));

			if (next != null && items[next] != null)
			{
				items[next].btn.focus();
				mxEvent.consume(evt);
			}
		});
	};

	addItem(mxResources.get('allSettings'), null);

	for (var i = 0; i < sections.length; i++)
	{
		var title = sections[i].querySelector('.card__title');

		if (title != null && !sections[i].classList.contains('config-excluded'))
		{
			addItem(mxUtils.trim(title.textContent), sections[i]);
		}
	}

	select(null);

	// A search runs over all categories
	if (searchInput != null)
	{
		mxEvent.addListener(searchInput, 'input', function()
		{
			if (searchInput.value != '' && current != null)
			{
				select(null);
			}
		});
	}

	// The three states of a setting as the skin shows them: default, on, off
	var updateToggles = function()
	{
		var toggles = c.editor.querySelectorAll('.tri-toggle');

		for (var i = 0; i < toggles.length; i++)
		{
			var t = toggles[i];

			if (!t.configLayout)
			{
				t.configLayout = true;
				var field = t.closest('.toggle-field');
				skin.initToggle(ui, t, (field != null) ? field.querySelector('.toggle-field__name') : null);
			}

			skin.updateToggle(ui, t);
		}
	};

	if (window.MutationObserver != null)
	{
		new MutationObserver(updateToggles).observe(c.editor, {attributes: true,
			attributeFilter: ['class'], subtree: true, childList: true});
	}

	updateToggles();

	// The footer: help and the buttons of the dialog on the left, Close and
	// Apply on the right
	var btns = c.buttons;
	btns.style.cssText = '';
	var left = [];

	for (var i = 0; i < btns.children.length; i++)
	{
		var child = btns.children[i];

		if (child.nodeName == 'BUTTON' && child != c.close && child != c.apply)
		{
			left.push(child);
		}
	}

	skin.layoutFooter(this, btns, left, c);

	return true;
};

/**
 * The languages available offline (showLanguageDialog): a search and the
 * languages as rows.
 *
 * The layout takes a skin: the Classic skin (LanguagesLayout.skins.classic,
 * docs/dialog-style-guide.md, its CSS in grapheditor.css) for Simple, behind
 * the feature languageDialog of Editor.featureDefaults (Editor.isLanguageDialogEnabled), or
 * the skin of Fusion, which SimpleSettings.js adds (LanguagesLayout.skins.fusion), so
 * the code exists once. The dialog of before is shown where the feature is
 * off.
 */
var LanguagesLayout = {};

/**
 * The skins of the layout (the skin of Fusion is added by SimpleSettings.js).
 */
LanguagesLayout.skins = {};

/**
 * Returns the skin of the current look: the skin of Fusion in the theme
 * Fusion, else the Classic skin.
 */
LanguagesLayout.getSkin = function()
{
	return (typeof Editor.isSimpleModern === 'function' && Editor.isSimpleModern() &&
		LanguagesLayout.skins.fusion != null) ? LanguagesLayout.skins.fusion :
		LanguagesLayout.skins.classic;
};

/**
 * Returns true if the dialog shows the layout of Fusion: the feature languageDialog
 * of Editor.featureDefaults (languageDialog in the configuration and the URL), on in
 * Simple, off in Classic, Sketch, Minimal and Atlas. The theme Fusion always
 * has it.
 */
Editor.isLanguageDialogEnabled = function()
{
	return Editor.isFeatureEnabled('languageDialog');
};

/**
 * Returns the given text in lower case without accents, for the search.
 */
LanguagesLayout.normalize = function(text)
{
	text = String((text != null) ? text : '').toLowerCase();

	try
	{
		text = text.normalize('NFKD').replace(/[\u0300-\u036f]/g, '');
	}
	catch (e)
	{
		// ignores missing normalize
	}

	return text;
};

/**
 * The Classic skin of the languages available offline
 * (docs/dialog-style-guide.md), for Simple: the headline of the dialogs, a
 * search field with the glyph of the search of the Template Browser, the
 * languages as checkboxes in a list that scrolls (Current in gray after the
 * name of the language of the app), Cancel and Apply. The CSS is in
 * grapheditor.css under .geLanguages.
 */
LanguagesLayout.skins.classic = {
	name: 'classic',
	classes: {head: 'geLanguagesHead', empty: 'geDialogHint geLanguagesEmpty', search: 'geLanguagesSearch',
		box: 'geLanguagesBox', list: 'geLanguagesList', row: 'geLanguagesRow', cell: 'geLanguagesCheck',
		grid: 'geLanguagesGrid', replaced: 'geLanguagesReplaced'},
	/**
	 * Lays out the given content of the dialog as the list.
	 */
	prepare: function(elt)
	{
		elt.classList.add('geLanguages');
		elt.style.cssText = '';
	},
	/**
	 * Prepares the buttons of the dialog for the footer.
	 */
	prepareButtons: function(buttons)
	{
		buttons.style.cssText = '';
		buttons.classList.add('geLanguagesFooter');
	},
	/**
	 * Returns the search field with the given placeholder: fn is called with
	 * the value on each input, Escape clears it. The input is its property
	 * input.
	 */
	createSearchField: function(placeholder, fn)
	{
		var field = document.createElement('div');
		var image = (typeof TemplateBrowser !== 'undefined') ? TemplateBrowser.getGlyphImage('search') : null;

		if (image != null)
		{
			field.appendChild(PluginsLayout.createGlyph(image));
		}

		var input = document.createElement('input');
		input.setAttribute('type', 'search');
		input.setAttribute('placeholder', placeholder);
		input.setAttribute('aria-label', placeholder);
		input.setAttribute('autocomplete', 'off');
		input.setAttribute('spellcheck', 'false');
		field.appendChild(input);

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

		field.input = input;

		return field;
	},
	/**
	 * Cancel is before Apply where the dialogs of the app have it first.
	 */
	isCancelFirst: function(ui)
	{
		return ui.editor.cancelFirst;
	},
	/**
	 * The checkboxes stay checkboxes.
	 */
	prepareBox: function(box) { },
	/**
	 * Returns the mark of the language of the app (after the name, see
	 * .geLanguagesCurrent).
	 */
	createCurrentBadge: function(text)
	{
		var badge = document.createElement('span');
		badge.className = 'geDialogHint geLanguagesCurrent';
		mxUtils.write(badge, text);

		return badge;
	}
};

/**
 * Lays out the content of the languages dialog (showLanguageDialog) in the
 * Classic skin where the feature is on (Fusion lays it out in
 * SimpleSettings.js). Called before the dialog is shown.
 */
EditorUi.prototype.installLanguagesLayout = function(elt)
{
	if (!this.editor.isChromelessView() && Editor.isLanguageDialogEnabled() &&
		LanguagesLayout.getSkin() == LanguagesLayout.skins.classic &&
		elt != null && elt.languageControls != null)
	{
		try
		{
			this.createLanguagesLayout(elt, elt.languageControls, LanguagesLayout.skins.classic);
		}
		catch (e)
		{
			EditorUi.debug('EditorUi.installLanguagesLayout', [this], 'error', [e]);
		}
	}
};

/**
 * The offline languages on the template of a list in the given skin: the
 * headline, a search field, the languages as rows with a switch or a
 * checkbox (on: available offline; English and the current language cannot
 * be removed), Cancel and Apply. The switches are the checkboxes of the
 * dialog: their changes wait for Apply, which sends them to the listeners of
 * the dialog, so installing and removing work as before (report 13.1: one
 * primary action with a verb, Cancel changes nothing). Returns true if the
 * dialog was laid out.
 */
EditorUi.prototype.createLanguagesLayout = function(elt, c, skin)
{
	var ui = this;
	var cls = skin.classes;

	if (c.content == null || c.buttons == null || c.close == null || c.content.parentNode != elt ||
		c.buttons.parentNode != elt)
	{
		return false;
	}

	skin.prepare(elt);

	var head = document.createElement('div');
	head.className = cls.head;
	var h3 = document.createElement('h3');
	mxUtils.write(h3, mxResources.get('offlineLanguages'));
	head.appendChild(h3);
	elt.insertBefore(head, elt.firstChild);

	var rows = [];
	var empty = document.createElement('div');
	empty.className = cls.empty;
	empty.style.display = 'none';

	var filter = function(value)
	{
		var q = LanguagesLayout.normalize(mxUtils.trim(value));
		var shown = 0;

		for (var i = 0; i < c.rows.length; i++)
		{
			var r = c.rows[i];
			var match = q == '' || LanguagesLayout.normalize(r.row.textContent).indexOf(q) >= 0 ||
				LanguagesLayout.normalize(r.code).indexOf(q) == 0;
			r.row.style.display = (match) ? '' : 'none';
			shown += (match) ? 1 : 0;
		}

		empty.textContent = '';
		mxUtils.write(empty, mxResources.get('noResultsFor', [mxUtils.trim(value)]));
		empty.style.display = (shown == 0 && c.rows.length > 0) ? '' : 'none';
	};

	var search = skin.createSearchField(mxResources.get('search'), filter);
	search.classList.add(cls.search);
	elt.insertBefore(search, c.content);

	// The list scrolls in a box, so the frame keeps the height of the
	// dialog (it measures what scrolls in its children)
	var box = document.createElement('div');
	box.className = cls.box;
	elt.insertBefore(box, c.content);
	box.appendChild(c.content);
	c.content.style.cssText = '';
	c.content.classList.add(cls.list);
	skin.prepareButtons(c.buttons);

	// The changes of the checkboxes of the rows wait for Apply: a change
	// event of a row is stopped before it reaches the listener of the
	// dialog (which installs or removes at once), Apply sends it again for
	// the checkboxes that differ from the start
	var applying = false;
	var initial = {};

	var isRowBox = function(elt)
	{
		for (var i = 0; i < rows.length; i++)
		{
			if (rows[i].box == elt)
			{
				return true;
			}
		}

		return false;
	};

	c.content.addEventListener('change', function(evt)
	{
		var source = mxEvent.getSource(evt);

		if (!applying && source != null && isRowBox(source))
		{
			evt.stopPropagation();
		}
	}, true);

	var cancel = mxUtils.button(mxResources.get('cancel'), function()
	{
		ui.hideDialog();
	});
	cancel.className = 'geBtn';

	if (skin.isCancelFirst(ui))
	{
		c.buttons.insertBefore(cancel, c.close);
	}
	else
	{
		c.buttons.appendChild(cancel);
	}

	c.close.textContent = mxResources.get('apply');
	c.close.removeAttribute('title');
	c.close.addEventListener('click', function()
	{
		applying = true;

		try
		{
			for (var i = 0; i < c.rows.length; i++)
			{
				var r = c.rows[i];

				if (initial[r.code] != null && r.box.checked != initial[r.code])
				{
					r.box.dispatchEvent(new Event('change'));
				}
			}
		}
		finally
		{
			applying = false;
		}
	}, true);

	// Restyles the rows when the languages are known
	var current = (urlParams['lang'] == null && isLocalStorage && typeof mxSettings !== 'undefined') ?
		mxSettings.settings.language : mxLanguage;

	var restyle = function()
	{
		for (var i = rows.length; i < c.rows.length; i++)
		{
			var r = c.rows[i];
			var cell = r.box.parentNode;
			initial[r.code] = r.box.checked;
			r.row.style.cssText = '';
			r.row.classList.add(cls.row);
			skin.prepareBox(r.box);

			if (cell != null && cell.parentNode == r.row)
			{
				cell.style.width = '';
				cell.style.height = '';
				cell.style.margin = '';
				cell.classList.add(cls.cell);
			}

			if (r.code == current)
			{
				var badge = skin.createCurrentBadge(mxResources.get('current'));
				r.row.insertBefore(badge, cell);
			}

			var grid = r.row.parentNode;

			if (grid != null && !grid.classList.contains(cls.grid))
			{
				grid.style.cssText = '';
				grid.classList.add(cls.grid);

				// The help text of the dialog is the headline
				if (grid.previousSibling != null)
				{
					grid.previousSibling.classList.add(cls.replaced);
				}

				grid.parentNode.appendChild(empty);
			}

			rows.push(r);
		}

		if (search.input.value != '')
		{
			filter(search.input.value);
		}
	};

	if (window.MutationObserver != null)
	{
		new MutationObserver(restyle).observe(c.content, {childList: true});
	}

	restyle();

	return true;
};

/**
 * The Settings dialog (#12 of the UI clean-up of Fusion; batch 16 of the
 * plan of 13 November 2026 for Simple, which the driver limited to Simple on
 * 13 November 2026): the items of a menu as sections (Appearance, Language,
 * Units, Editing, Saving, Advanced) on the Form template, each row runs its
 * item. Fusion shows it for … › Settings… (the menu simpleSettings of
 * SimpleMenus.js), Simple for All settings..., the last item of its Settings
 * menu (the menu allSettings: the items of the Settings menu and Autosave).
 *
 * The layout (EditorUi.showSettingsDialog) takes a skin: the Classic skin
 * (SettingsDialogLayout.skins.classic, docs/dialog-style-guide.md, its CSS
 * in grapheditor.css under .geFormSettings, the Form template of Page Setup
 * with the colors, the font and the corners of the other dialogs of the
 * theme) for Simple, behind the feature settingsDialog of
 * Editor.featureDefaults (Editor.isSettingsDialogEnabled), or the skin of
 * Fusion, which SimpleSettings.js adds (SettingsDialogLayout.skins.fusion),
 * so the code exists once. Where the feature is off Simple has no All
 * settings... and its Settings menu is as before.
 */
var SettingsDialogLayout = {};

/**
 * The skins of the layout (the skin of Fusion is added by SimpleSettings.js).
 * A skin has the classes of the parts (action, actions), the builders of the
 * parts that differ (createForm, prepare, createSwitch, show), isActive
 * (true while a new language opens the dialog again in the skin) and,
 * optionally, sections, choices and choiceToggles, which add to those of
 * SettingsDialogLayout.
 */
SettingsDialogLayout.skins = {};

/**
 * Width of the content of the dialog in the Classic skin (the frame adds
 * 48), limited to the window.
 */
SettingsDialogLayout.width = 420;

/**
 * Space between the frame and the window in the Classic skin.
 */
SettingsDialogLayout.windowMargin = 32;

/**
 * Sections of the Settings dialog (#12 of the UI clean-up, decision 4 of
 * 6 November 2026) by the actions and submenus of the menu of the dialog.
 * Other items go to Advanced (eg. the items that plugins add to the
 * Settings menu).
 */
SettingsDialogLayout.sections = {theme: 'appearance', highContrast: 'appearance',
	language: 'language', diagramLanguage: 'language', units: 'units', tooltips: 'editing',
	collapseExpand: 'editing', animations: 'editing', zoomWheel: 'editing', spellCheck: 'editing',
	googleFonts: 'editing', hideInlineToolbar: 'editing', autosave: 'saving', autoBkp: 'saving', drafts: 'saving'};

/**
 * Order and headlines of the sections of the Settings dialog.
 */
SettingsDialogLayout.order = ['appearance', 'language', 'units', 'editing', 'saving', 'advanced'];

SettingsDialogLayout.titles = {appearance: 'appearance', language: 'language', units: 'units',
	editing: 'editingSection', saving: 'savingSection', advanced: 'advanced'};

/**
 * Labels of the selects of the submenus of the Settings dialog.
 */
SettingsDialogLayout.labels = {units: 'showSizesIn'};

/**
 * Submenus whose items are one choice, shown as selects. Other submenus
 * (eg. the toggles of a plugin) are sections of their own with their items.
 */
SettingsDialogLayout.choices = {theme: true, language: true, units: true, diagramLanguage: true};

/**
 * Labels of the current choice of a submenu of one choice where none of its
 * items has the checkmark: the code that Language Code... of Diagram
 * language ▸ of Simple set, Automatic of Appearance ▸ where hideMenuItems
 * hides it. The select shows the label as its selected option, which runs
 * nothing, so every item of the submenu can be chosen (other submenus show
 * an empty option).
 */
SettingsDialogLayout.currentChoices = {
	diagramLanguage: function(ui)
	{
		return (!Graph.translateDiagram) ? null : ((Graph.diagramLanguage != null &&
			Graph.diagramLanguage != '') ? Graph.diagramLanguage : mxResources.get('enabled'));
	},
	appearance: function(ui)
	{
		return (typeof ui.isAutoDarkMode === 'function' && ui.isAutoDarkMode(true)) ?
			mxResources.get('automatic') : null;
	}
};

/**
 * Returns true if Simple has All settings... (the Settings dialog in the
 * Classic skin): the feature settingsDialog of Editor.featureDefaults
 * (settingsDialog in the configuration and the URL), on in Simple, off in
 * Classic, Sketch, Minimal and Atlas. Fusion has its own Settings… (the
 * theme Fusion always has the dialog).
 */
Editor.isSettingsDialogEnabled = function()
{
	return Editor.isFeatureEnabled('settingsDialog');
};

/**
 * The Classic skin (docs/dialog-style-guide.md), for Simple: the Form
 * template of Page Setup (the headline of the dialogs, the section titles
 * of the Preview template, the rows of each section in a card), the toggles
 * as checkboxes, the commands as buttons of the dialogs and Done in the
 * footer. Appearance ▸ of the Settings menu of Simple (Automatic, Light and
 * Dark) is a list in Appearance with High Contrast as a checkbox after it.
 * The CSS is in grapheditor.css under .geFormSettings.
 */
SettingsDialogLayout.skins.classic = {
	name: 'classic',
	classes: {dialog: 'geFormSettings', action: 'geBtn geSettingsDialogAction',
		actions: 'geSettingsDialogActions', footer: 'geFormFooter'},
	sections: {appearance: 'appearance'},
	choices: {appearance: true},
	choiceToggles: {highContrast: true},
	/**
	 * Lays out the given content of a CustomDialog as a form with the given
	 * headline (the form of the Classic skin of FormTemplate.js). Returns
	 * the functions that add its parts (section, row, add), or null.
	 */
	createForm: function(ui, elt, title)
	{
		var form = FormTemplate.skins.classic.createForm(ui, elt, title);

		if (form == null)
		{
			return null;
		}

		var card = null;

		// The rows of a section go into its card
		var getCard = function()
		{
			if (card == null)
			{
				card = PreviewDialog.skins.classic.createSection(null, form.body).content;
			}

			return card;
		};

		return {body: form.body, head: form.head, buttons: form.buttons,
			section: function(name)
			{
				var head = form.section(name);
				card = null;

				return head;
			},
			row: function(label, control)
			{
				return PreviewDialog.skins.classic.createRow(label, control, null, getCard());
			},
			add: function(head, elt)
			{
				getCard().appendChild(elt);
			}};
	},
	/**
	 * Adds the classes of the dialog to its given content and footer.
	 */
	prepare: function(ui, elt, form)
	{
		elt.classList.add(this.classes.dialog);
		form.buttons.classList.add(this.classes.footer);
	},
	/**
	 * Returns a checkbox row with the given label, hint and state (the check
	 * rows of the Preview template); fn is called with the new state. The
	 * row is {row, input}.
	 */
	createSwitch: function(ui, label, hint, checked, fn)
	{
		var input = document.createElement('input');
		var row = PreviewDialog.skins.classic.createCheckRow(input, label, hint,
			document.createDocumentFragment());
		input.checked = checked;

		mxEvent.addListener(input, 'change', function()
		{
			fn(input.checked);
		});

		return {row: row, input: input};
	},
	/**
	 * Shows the dialog SettingsDialogLayout.width wide and as high as its
	 * content, both limited to the window with SettingsDialogLayout.windowMargin
	 * around it (16 on phones); where the window is lower the sections scroll
	 * between the head and the footer.
	 */
	show: function(ui, elt, form)
	{
		var ww = window.innerWidth || document.documentElement.clientWidth;
		var wh = window.innerHeight || document.documentElement.clientHeight;
		var margin = 48 + ((ww < 640) ? 16 : SettingsDialogLayout.windowMargin);
		ui.showDialog(elt, Math.max(Math.min(SettingsDialogLayout.width, ww - margin), 240),
			null, true, true);
		var dlg = elt.parentNode;

		if (dlg != null && dlg.nodeType == mxConstants.NODETYPE_ELEMENT &&
			dlg.classList.contains('geDialog'))
		{
			Dialog.setFrameHeight(dlg, Dialog.getFrameHeight(dlg,
				Math.max(Math.min(elt.scrollHeight, wh - margin), 160)));
		}
	},
	/**
	 * A new language opens the dialog again where Simple still has it.
	 */
	isActive: function(ui)
	{
		return ui.isAllSettingsShown();
	}
};

/**
 * Returns the items of the given menu (simpleSettings of Fusion, see
 * SimpleMenus.js, or allSettings of Simple) as they are shown now: the
 * items at the top as {title, funct, enabled, action} and submenus as
 * {title, submenu, items} with the items of the submenu ({title, funct,
 * enabled, checked, action} or submenus; a submenu that a plugin builds
 * with a row of its own as the parent of its items has direct instead of
 * submenu). Hidden items (hideMenuItems) are not in the menu.
 */
EditorUi.prototype.getSettingsEntries = function(menuName)
{
	var menus = this.menus;
	var entries = [];

	if (menus == null || menus.get(menuName) == null)
	{
		return entries;
	}

	var menu = new mxPopupMenu(function() {});
	menu.showDisabled = true;
	var actionKey = null;
	var submenuName = null;
	var recorded = [];

	var ownAddMenuItem = Object.prototype.hasOwnProperty.call(menus, 'addMenuItem');
	var ownAddSubmenu = Object.prototype.hasOwnProperty.call(menus, 'addSubmenu');
	var addMenuItem = menus.addMenuItem;
	var addSubmenu = menus.addSubmenu;
	var addItem = menu.addItem;
	var addCheckmark = menu.addCheckmark;

	// The action and the submenu of the next item (also when the items of
	// a menu add others, see addSimpleSettingsTools)
	menus.addMenuItem = function(m, key)
	{
		var previous = actionKey;
		actionKey = key;

		try
		{
			return addMenuItem.apply(this, arguments);
		}
		finally
		{
			actionKey = previous;
		}
	};

	menus.addSubmenu = function(name)
	{
		var previous = submenuName;
		submenuName = name;

		try
		{
			return addSubmenu.apply(this, arguments);
		}
		finally
		{
			submenuName = previous;
		}
	};

	menu.addItem = function(title, image, funct, parent, iconCls, enabled)
	{
		var tr = addItem.apply(this, arguments);

		if (tr != null && title != null)
		{
			var entry = {title: String(title), funct: funct, enabled: enabled != false,
				action: actionKey, tr: tr};

			// Submenus, also in submenus (Toolbar ▸ in Viewer ▸ of a plugin)
			if (funct == null)
			{
				entry.items = [];
				tr.simpleSettingsEntry = entry;

				if (submenuName != null)
				{
					entry.submenu = submenuName;
					submenuName = null;
				}
				else
				{
					// A row that is the parent of the next items without
					// addSubmenu (a submenu that a plugin builds itself, as
					// the groups of Pages ▸) is a submenu where it has items
					entry.direct = true;
				}
			}

			if (parent == null)
			{
				entries.push(entry);
			}
			else if (parent.simpleSettingsEntry != null)
			{
				parent.simpleSettingsEntry.items.push(entry);
			}

			recorded.push(entry);
		}

		return tr;
	};

	menu.addCheckmark = function(item)
	{
		item.simpleSettingsChecked = true;

		return addCheckmark.apply(this, arguments);
	};

	try
	{
		menus.addMenu(menuName, menu);
	}
	catch (e)
	{
		// ignores the items of a menu that fails
	}
	finally
	{
		if (ownAddMenuItem)
		{
			menus.addMenuItem = addMenuItem;
		}
		else
		{
			delete menus.addMenuItem;
		}

		if (ownAddSubmenu)
		{
			menus.addSubmenu = addSubmenu;
		}
		else
		{
			delete menus.addSubmenu;
		}
	}

	for (var i = 0; i < recorded.length; i++)
	{
		recorded[i].checked = recorded[i].tr.simpleSettingsChecked == true;
		delete recorded[i].tr;
	}

	// Rows without items that are no item of addSubmenu (eg. a message
	// of a menu) are not in the entries
	var prune = function(list)
	{
		for (var i = list.length - 1; i >= 0; i--)
		{
			if (list[i].items != null)
			{
				prune(list[i].items);

				if (list[i].direct && list[i].items.length == 0)
				{
					list.splice(i, 1);
				}
			}
		}
	};

	prune(entries);
	menu.destroy();

	return entries;
};

/**
 * Shows the Settings dialog of the items of the given menu in the given skin
 * (#12 of the UI clean-up of Fusion: the settings of … › Settings, Theme ▸,
 * Language ▸ and Autosave of File of before; in Simple the items of its
 * Settings menu and Autosave) as sections (Appearance, Language, Units,
 * Editing, Saving, Advanced) on the Form template. The rows run the items of
 * the menu, so a setting does what its item did, at once (Done closes the
 * dialog).
 * Submenus of one choice are selects, other submenus (eg. Viewer ▸ of a
 * plugin and its submenus) are sections of their own before Advanced. The
 * theme closes the dialog first, a command closes it unless it shows a
 * dialog, which is then over this one, and a new language opens it again
 * in that language.
 */
EditorUi.prototype.showSettingsDialog = function(menuName, skin)
{
	var ui = this;
	var entries = this.getSettingsEntries(menuName);
	var content = document.createElement('div');
	var dlg = new CustomDialog(this, content, null, null, mxResources.get('done'), null, null, true);
	var elt = dlg.container;
	var form = skin.createForm(this, elt, mxResources.get('settings'));

	if (form == null)
	{
		return;
	}

	// The names of menus and actions are no keys of the prototype
	var own = function(map, key)
	{
		return (map != null && key != null && Object.prototype.hasOwnProperty.call(map, key)) ? map[key] : null;
	};

	// The skin can add to the sections and the choices (Appearance ▸ of Simple)
	var getSection = function(key)
	{
		var section = own(skin.sections, key);

		return (section != null) ? section : own(SettingsDialogLayout.sections, key);
	};

	var isChoice = function(key)
	{
		return own(skin.choices, key) != null || own(SettingsDialogLayout.choices, key) != null;
	};

	skin.prepare(this, elt, form);

	// Calls fn when the settings are the dialog on top again after the
	// dialog of a command over them closed (after its callback, which
	// FilenameDialog calls after it closed)
	var whenBack = function(top, fn)
	{
		var listener = function()
		{
			if (ui.dialog === top || ui.dialogs == null || mxUtils.indexOf(ui.dialogs, top) < 0)
			{
				ui.editor.removeListener(listener);

				if (ui.dialog === top)
				{
					window.setTimeout(function()
					{
						if (ui.dialog === top)
						{
							fn();
						}
					}, 0);
				}
			}
		};

		ui.editor.addListener('hideDialog', listener);
	};

	var run = function(entry, evt, close, stack, back)
	{
		var top = ui.dialog;

		if (close && !stack)
		{
			ui.hideDialog();
		}

		try
		{
			entry.funct(evt);
		}
		catch (e)
		{
			ui.handleError(e);
		}

		// A command that shows a dialog (Plugins..., Configuration...,
		// Offline languages...) shows it over this one, so closing it
		// goes back to the settings where they were, other commands
		// close the settings as before (the way back, fusion-style-guide.md)
		if (close && stack && top != null)
		{
			if (ui.dialog === top)
			{
				ui.hideDialog();
			}
			else if (back != null && ui.dialogs != null &&
				mxUtils.indexOf(ui.dialogs, top) >= 0)
			{
				whenBack(top, back);
			}
		}
	};

	// The rows are added to their section, the sections then in their order
	var parents = [];

	var addRow = function(name, label, control)
	{
		parents.push({section: name, label: label, control: control});
	};

	var addAction = function(name, entry, label, back)
	{
		var btn = document.createElement('button');
		btn.setAttribute('type', 'button');
		btn.className = skin.classes.action;
		mxUtils.write(btn, label || entry.title);
		btn.disabled = !entry.enabled;

		mxEvent.addListener(btn, 'click', function(evt)
		{
			run(entry, evt, true, true, back);
		});

		parents.push({section: name, action: btn});
	};

	// All switches show the state of their action after a switch ran (the
	// items of a submenu of a plugin can be one choice)
	var updates = [];

	var addSwitch = function(name, entry)
	{
		var action = (entry.action != null) ? ui.actions.get(entry.action) : null;
		var checked = function()
		{
			return (action != null && action.toggleAction) ? action.isSelected() : entry.checked;
		};

		var s = skin.createSwitch(ui, entry.title, null, checked(), function()
		{
			run(entry, null, false);

			for (var i = 0; i < updates.length; i++)
			{
				updates[i]();
			}
		});

		updates.push(function()
		{
			s.input.checked = checked();
		});

		s.input.disabled = !entry.enabled;
		parents.push({section: name, row: s.row});
	};

	// Submenus that are not one choice (simpleSettingsChoices) are sections
	// of their own after Saving with the path of the submenu as their
	// headline, their submenus after their items
	var menuSections = [];
	var menuTitles = Object.create(null);

	var addMenuSection = function(entry, title)
	{
		var name = 'menu' + menuSections.length;
		var nested = [];
		menuSections.push(name);
		menuTitles[name] = title;

		for (var i = 0; i < entry.items.length; i++)
		{
			if (entry.items[i].items != null)
			{
				nested.push(entry.items[i]);
			}
			else
			{
				addEntry(name, entry.items[i]);
			}
		}

		for (var i = 0; i < nested.length; i++)
		{
			addMenuSection(nested[i], title + ' › ' + nested[i].title);
		}
	};

	var addEntry = function(name, entry)
	{
		var action = (entry.action != null) ? ui.actions.get(entry.action) : null;

		if (entry.items != null)
		{
			if (isChoice(entry.submenu))
			{
				addSelect(name, entry);
			}
			else
			{
				addMenuSection(entry, entry.title);
			}
		}
		else if (action != null && action.toggleAction)
		{
			addSwitch(name, entry);
		}
		else
		{
			addAction(name, entry);
		}
	};

	var addSelect = function(name, entry)
	{
		var select = document.createElement('select');
		var options = [];
		var placeholder = null;
		var current = null;
		var commands = [];
		var toggles = [];
		var nested = [];

		// Toggles of the skin in a submenu of one choice (High Contrast of
		// Appearance ▸ in Simple) are switches after the select, commands of
		// a submenu (Manage... of Language) are buttons after the select
		var isToggle = function(item)
		{
			return own(skin.choiceToggles, item.action) != null;
		};

		var isCommand = function(item)
		{
			return /(\.\.\.|…)$/.test(item.title);
		};

		// The other items of the submenu are the options, the checked one
		// selected, or the current choice that is none of them
		var fill = function(items)
		{
			var selected = null;
			options = [];
			placeholder = null;

			while (select.firstChild != null)
			{
				select.removeChild(select.firstChild);
			}

			for (var i = 0; i < items.length; i++)
			{
				var item = items[i];

				if (item.items == null && !isToggle(item) && !isCommand(item))
				{
					var opt = document.createElement('option');
					opt.setAttribute('value', String(options.length));
					mxUtils.write(opt, item.title);
					opt.disabled = !item.enabled;
					select.appendChild(opt);

					if (item.checked)
					{
						selected = opt;
					}

					options.push(item);
				}
			}

			if (selected == null && options.length > 0)
			{
				var fn = own(SettingsDialogLayout.currentChoices, entry.submenu);
				var label = (fn != null) ? fn(ui) : null;
				placeholder = document.createElement('option');
				placeholder.setAttribute('value', '');
				placeholder.disabled = true;
				mxUtils.write(placeholder, (label != null) ? String(label) : '');
				select.insertBefore(placeholder, select.firstChild);
				selected = placeholder;
			}

			if (selected != null)
			{
				selected.selected = true;
			}

			current = select.value;
		};

		for (var i = 0; i < entry.items.length; i++)
		{
			var item = entry.items[i];

			if (item.items != null)
			{
				nested.push(item);
			}
			else if (isToggle(item))
			{
				toggles.push(item);
			}
			else if (isCommand(item))
			{
				commands.push(item);
			}
		}

		fill(entry.items);

		// A select of one choice is not shown (Diagram language of a
		// diagram without translations in Fusion) unless a command of the
		// submenu can change the choice (Language Code... of Simple)
		if (select.options.length > 1 || (options.length > 0 && commands.length > 0))
		{
			mxEvent.addListener(select, 'change', function(evt)
			{
				var item = (select.value != '') ? options[parseInt(select.value)] : null;

				if (item != null)
				{
					current = select.value;

					// The current choice that was none of the items is gone
					if (placeholder != null && placeholder.parentNode == select)
					{
						select.removeChild(placeholder);
						placeholder = null;
					}

					if (entry.submenu == 'language')
					{
						// Dialogs close for the new language, this one opens again
						ui.settingsDialogReopen = {time: Date.now(), menuName: menuName, skin: skin};
					}

					run(item, evt, entry.submenu == 'theme');
				}
				else
				{
					select.value = current;
				}
			});

			var key = own(SettingsDialogLayout.labels, entry.submenu);
			addRow(name, (key != null) ? mxResources.get(key) : entry.title, select);
		}

		for (var i = 0; i < toggles.length; i++)
		{
			addSwitch(name, toggles[i]);
		}

		// The select shows what a command changed once its dialog over the
		// settings closed (the code of Language Code..., the languages of
		// Offline languages...)
		var refresh = function()
		{
			var find = function(list)
			{
				for (var i = 0; i < list.length; i++)
				{
					if (list[i].items != null)
					{
						var result = (list[i].submenu == entry.submenu) ? list[i] : find(list[i].items);

						if (result != null)
						{
							return result;
						}
					}
				}

				return null;
			};

			var fresh = find(ui.getSettingsEntries(menuName));

			if (fresh != null)
			{
				fill(fresh.items);
			}
		};

		for (var i = 0; i < commands.length; i++)
		{
			addAction(name, commands[i], (entry.submenu == 'language') ?
				mxResources.get('offlineLanguages') + '...' : null, refresh);
		}

		for (var i = 0; i < nested.length; i++)
		{
			addMenuSection(nested[i], entry.title + ' › ' + nested[i].title);
		}
	};

	for (var i = 0; i < entries.length; i++)
	{
		var entry = entries[i];
		var key = (entry.submenu != null) ? entry.submenu : entry.action;
		var section = getSection(key);
		addEntry((section != null) ? section : 'advanced', entry);
	}

	// The sections in their order, each with its headline, the sections of
	// submenus before Advanced
	var order = SettingsDialogLayout.order.slice();
	var index = mxUtils.indexOf(order, 'advanced');
	Array.prototype.splice.apply(order, [(index >= 0) ? index : order.length, 0].concat(menuSections));

	for (var i = 0; i < order.length; i++)
	{
		var section = order[i];
		var actions = null;
		var head = null;

		for (var j = 0; j < parents.length; j++)
		{
			var p = parents[j];

			if (p.section == section)
			{
				if (head == null)
				{
					head = form.section((menuTitles[section] != null) ? menuTitles[section] :
						mxResources.get(SettingsDialogLayout.titles[section]));
				}

				if (p.action != null)
				{
					if (actions == null)
					{
						actions = document.createElement('div');
						actions.className = skin.classes.actions;
						form.add(head, actions);
					}

					actions.appendChild(p.action);
				}
				else
				{
					actions = null;

					if (p.row != null)
					{
						form.add(head, p.row);
					}
					else
					{
						form.row(p.label, p.control);
					}
				}
			}
		}
	}

	// A new language opens the dialog again in the skin it had
	// (setAndPersistLanguage closes all dialogs)
	if (this.settingsDialogLanguageListener == null)
	{
		this.settingsDialogLanguageListener = function()
		{
			var reopen = ui.settingsDialogReopen;
			ui.settingsDialogReopen = null;

			if (reopen != null && Date.now() - reopen.time < 60000 && ui.dialog == null &&
				reopen.skin.isActive(ui))
			{
				ui.showSettingsDialog(reopen.menuName, reopen.skin);
			}
		};

		this.addListener('languageChanged', this.settingsDialogLanguageListener);
	}

	skin.show(this, elt, form);
};

/**
 * Returns true if the Settings menu of Simple ends with All settings...: the
 * feature settingsDialog (Editor.isSettingsDialogEnabled) in the themes
 * whose Settings menu is the menu extras of Simple (Simple, and Sketch and
 * Minimal where the configuration or the URL turn it on), not in Fusion,
 * which has Settings… in its … menu, not in the viewer and not where the
 * configuration hides the Settings menu (hideMenuItems with extras, as
 * Menus.addSubmenu and isSimpleSettingsMenuShown of Fusion do), so the
 * action search and the shape search do not offer it either.
 */
EditorUi.prototype.isAllSettingsShown = function()
{
	// Menus.init asks before this.menus is set (hideMenuItems is on the
	// prototype, see Editor.configure)
	var hidden = ((this.menus != null) ? this.menus : Menus.prototype).hiddenMenuItems;

	// Simple without Fusion; Sketch and Minimal are never Fusion
	return (Editor.isSimpleClassic() || // SIMPLE-CLASSIC
		Editor.currentTheme == 'sketch' || Editor.currentTheme == 'min') &&
		!this.editor.isChromelessView() && Editor.isSettingsDialogEnabled() &&
		(hidden == null || !hidden['extras']);
};

/**
 * Shows the Settings dialog of Simple in the Classic skin: the items of its
 * Settings menu and Autosave (the menu allSettings).
 */
EditorUi.prototype.showAllSettingsDialog = function()
{
	this.showSettingsDialog('allSettings', SettingsDialogLayout.skins.classic);
};

/**
 * All settings... of Simple: the action allSettings (see the menu extras
 * of Menus.js) and the menu allSettings, which the dialog reads and which is
 * not shown: the items of the Settings menu without All settings... and
 * Autosave of File, so the configuration (hideMenuItems) and plugins that
 * add items to the Settings menu keep their effect.
 */
(function()
{
	var menusAddMenu = Menus.prototype.addMenu;

	/**
	 * All settings... stays the last item of the Settings menu of Simple
	 * where plugins add items to it (after menu.funct of extras or with
	 * addPluginMenuItems): the menu extras of Menus.js records its place
	 * (allSettingsPlace), the item follows Configuration... where nothing
	 * came after it, or else the items of the plugins after a separator.
	 */
	Menus.prototype.addMenu = function(name, popupMenu, parent)
	{
		if (name != 'extras')
		{
			return menusAddMenu.apply(this, arguments);
		}

		var previous = this.allSettingsPlace;
		var place = {count: null};
		this.allSettingsPlace = place;

		try
		{
			menusAddMenu.apply(this, arguments);
		}
		finally
		{
			this.allSettingsPlace = previous;
		}

		if (place.count != null)
		{
			if (popupMenu.itemCount == place.count)
			{
				// The separator before the item as it was at its place, the one
				// for plugins after it (menus without smart separators have it
				// before the item)
				if (popupMenu.smartSeparators)
				{
					(parent || popupMenu).willAddSeparator = place.separator;
				}

				this.addMenuItem(popupMenu, 'allSettings', parent);

				if (popupMenu.smartSeparators)
				{
					popupMenu.addSeparator(parent);
				}
			}
			else
			{
				popupMenu.addSeparator(parent);
				this.addMenuItem(popupMenu, 'allSettings', parent);
			}
		}
	};

	var menusInit = Menus.prototype.init;

	Menus.prototype.init = function()
	{
		menusInit.apply(this, arguments);

		var menus = this;
		var ui = this.editorUi;

		var action = ui.actions.addAction('allSettings...', function()
		{
			if (ui.isAllSettingsShown())
			{
				ui.showAllSettingsDialog();
			}
		});

		// Not listed where the Settings menu has no All settings... (eg. in
		// the action search of Classic)
		var updateVisible = function()
		{
			action.visible = ui.isAllSettingsShown();
		};

		updateVisible();
		ui.addListener('currentThemeChanged', updateVisible);

		this.put('allSettings', new Menu(function(menu, parent)
		{
			var previous = menus.allSettingsMenu;
			menus.allSettingsMenu = true;

			try
			{
				// Like the Settings menu, which addSubmenu hides (hideMenuItems)
				if (menus.hiddenMenuItems == null || !menus.hiddenMenuItems['extras'])
				{
					menus.addMenu('extras', menu, parent);
				}
			}
			finally
			{
				menus.allSettingsMenu = previous;
			}

			if (urlParams['embed'] != '1')
			{
				menus.addMenuItems(menu, ['autosave'], parent);
			}
		}));
	};
})();
