/**
 * Copyright (c) 2026, JGraph Holdings Ltd
 * Copyright (c) 2026, draw.io AG
 */
/**
 * The start screen of Fusion in every look that has it (concept "Fusion
 * ideas in Simple and Classic"): the storage dialog of the first start
 * (StorageDialog of App.showSplash: Save diagrams to, the storages as tiles,
 * the recent files as rows, the Terms of Use, Decide Later and Choose) and
 * the splash dialog after it (SplashDialog: the storage as a card with
 * Change Storage, Change User, the recent files, the language and Sign out,
 * Open Existing Diagram and Create New Diagram). The controls of the dialogs
 * stay in the DOM, hidden, and the new layout drives them (the controls of
 * StorageDialog and SplashDialog), so every choice calls what it called
 * before.
 *
 * The layout (EditorUi.createStartStorageLayout and createStartSplashLayout)
 * takes a skin: the Classic skin (StartScreen.skins.classic,
 * docs/dialog-style-guide.md, its CSS in grapheditor.css under .geStart,
 * which takes the colors, the font and the corners of the other dialogs of
 * the theme) for Simple, behind the feature startScreen of
 * Editor.featureDefaults (Editor.isStartScreenEnabled), or the skin of
 * Fusion, which SimpleOpen.js adds (StartScreen.skins.fusion), so the code
 * exists once. The dialogs of before are shown as they were where the
 * feature is off.
 */
var StartScreen = {};

/**
 * Width of the content in the Classic skin (the frame adds 48), limited to
 * the window (EditorUi.getStartScreenSize).
 */
StartScreen.width = 520;

/**
 * Space between the frame and the window in the Classic skin.
 */
StartScreen.windowMargin = 32;

/**
 * Most recent files of the start screen (App.addRecent keeps 10).
 */
StartScreen.recentLimit = 5;

/**
 * Adds the given class to the children of the given content of a dialog
 * (the layout of before), except the given ones.
 */
StartScreen.hideOthers = function(elt, keep, className)
{
	for (var i = 0; i < elt.childNodes.length; i++)
	{
		var child = elt.childNodes[i];

		if (child.nodeType == mxConstants.NODETYPE_ELEMENT && mxUtils.indexOf(keep, child) < 0)
		{
			child.classList.add(className);
		}
	}
};

/**
 * Returns the logo of the given storage (App.storages) as the dialogs of
 * before and the New dialog in the Classic skin show it, or null.
 */
StartScreen.getStorageLogo = function(mode)
{
	var storage = (mode != null && typeof App !== 'undefined' && App.storages != null &&
		(typeof App.isKnownMode !== 'function' || App.isKnownMode(mode))) ? App.storages[mode] : null;

	return (storage != null && storage.logo != null) ? IMAGE_PATH + '/' + storage.logo : null;
};

/**
 * The skins of the start screen. A skin has the classes of the parts
 * (footer is optional) and the builders of its parts (see
 * StartScreen.skins.classic). The skin of Fusion is added by SimpleOpen.js.
 */
StartScreen.skins = {};

/**
 * The Classic skin (docs/dialog-style-guide.md), for Simple: the colors of
 * its dialogs light and dark, the logos of the storages as the dialogs of
 * before show them, the headline of the dialogs, the titles of the Preview
 * template, the buttons without glyphs and the focus rings as outlines
 * inside of the controls. The CSS is in grapheditor.css under .geStart.
 */
StartScreen.skins.classic = {
	name: 'classic',
	classes: {body: 'geStartBody', tiles: 'geStartTiles', on: 'geStartOn', recent: 'geStartRecent',
		notice: 'geStartNotice', card: 'geStartCard', cardIcon: 'geStartCardIcon', cardText: 'geStartCardText',
		cardName: 'geStartCardName', cardMeta: 'geDialogHint geStartCardMeta', user: 'geStartUser',
		userControl: 'geStartUserControl', footer: 'geStartFooter', replaced: 'geStartReplaced'},
	/**
	 * Lays out the given content of the dialog as the start screen.
	 */
	prepare: function(elt)
	{
		elt.classList.add('geStart');
		elt.style.textAlign = '';
		elt.style.whiteSpace = '';
	},
	/**
	 * Hides the given children of the given content (the layout of before),
	 * except the given ones.
	 */
	hideOthers: function(elt, keep)
	{
		StartScreen.hideOthers(elt, keep, this.classes.replaced);
	},
	/**
	 * Returns the headline with the given title.
	 */
	createHead: function(ui, title)
	{
		var head = document.createElement('h3');
		mxUtils.write(head, title);

		return head;
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
	 * Returns the image of the tile of the given storage (its logo).
	 */
	getStorageImage: function(ui, mode)
	{
		return StartScreen.getStorageLogo(mode);
	},
	/**
	 * Returns the logo of the given storage for the card of the storage.
	 */
	createStorageIcon: function(ui, mode, storage)
	{
		return this.createImage((storage != null && storage.logo != null) ?
			IMAGE_PATH + '/' + storage.logo : null);
	},
	/**
	 * Returns an image (alt is empty, its name is next to it) for the given
	 * URL, or the glyph of a page (a mask in the color of the text) if there
	 * is none.
	 */
	createImage: function(src)
	{
		var img = null;

		if (src != null)
		{
			img = document.createElement('img');
			img.setAttribute('src', src);
			img.setAttribute('alt', '');
		}
		else if (typeof TemplateBrowser !== 'undefined')
		{
			img = TemplateBrowser.skins.classic.createIcon('page');
		}

		return img;
	},
	/**
	 * Returns a tile (a radio) with the given image, name and hint. The tile
	 * has setHint (see EditorUi.createStartTiles).
	 */
	createTile: function(ui, image, name, hint)
	{
		var tile = document.createElement('button');
		tile.setAttribute('type', 'button');
		tile.setAttribute('role', 'radio');
		tile.setAttribute('aria-checked', 'false');
		tile.className = 'geStartTile';

		var icon = document.createElement('span');
		icon.className = 'geStartTileIcon';
		var img = this.createImage(image);

		if (img != null)
		{
			icon.appendChild(img);
		}

		tile.appendChild(icon);

		var text = document.createElement('span');
		text.className = 'geStartTileText';
		var span = document.createElement('span');
		span.className = 'geStartTileName';
		mxUtils.write(span, name);
		text.appendChild(span);
		tile.appendChild(text);

		/**
		 * Sets the hint below the name (none for null).
		 */
		tile.setHint = function(value)
		{
			var h = text.querySelector('.geStartTileHint');

			if (value == null && h != null)
			{
				text.removeChild(h);
			}
			else if (value != null)
			{
				if (h == null)
				{
					h = document.createElement('span');
					h.className = 'geStartTileHint';
					text.appendChild(h);
				}

				h.textContent = value;
			}

			tile.setAttribute('title', (value != null) ? name + ' (' + value + ')' : name);
		};

		tile.setHint(hint);

		return tile;
	},
	/**
	 * Returns the row of the given recent file with the given title and hint
	 * (the name of its storage): the logo of its storage, the name with an
	 * ellipsis and the storage, the name and the storage in its title.
	 */
	createRecentRow: function(ui, entry, title, hint, fn)
	{
		var row = document.createElement('button');
		row.setAttribute('type', 'button');
		row.className = 'geStartRow';

		var icon = document.createElement('span');
		icon.className = 'geStartRowIcon';
		var img = this.createImage(StartScreen.getStorageLogo(entry.mode));

		if (img != null)
		{
			icon.appendChild(img);
		}

		row.appendChild(icon);

		var name = document.createElement('span');
		name.className = 'geStartRowName';
		mxUtils.write(name, title);
		row.appendChild(name);

		if (hint != null && hint != '')
		{
			var h = document.createElement('span');
			h.className = 'geDialogHint geStartRowHint';
			mxUtils.write(h, hint);
			row.appendChild(h);
			row.setAttribute('title', title + ': ' + hint);
		}
		else
		{
			row.setAttribute('title', title);
		}

		mxEvent.addListener(row, 'click', function(evt)
		{
			fn(evt);
			mxEvent.consume(evt);
		});

		return row;
	},
	/**
	 * Returns the left part of the footer for the given elements, or null.
	 */
	createTools: function(elts)
	{
		var tools = null;

		for (var i = 0; i < elts.length; i++)
		{
			if (elts[i] != null)
			{
				if (tools == null)
				{
					tools = document.createElement('div');
					tools.className = 'geStartTools';
				}

				tools.appendChild(elts[i]);
			}
		}

		return tools;
	},
	/**
	 * Returns a button with the given label that clicks the given hidden
	 * control (the buttons of the Classic skin have no glyphs).
	 */
	createLinkButton: function(label, target, icon)
	{
		var btn = mxUtils.button(label, function()
		{
			target.click();
		});
		btn.className = 'geBtn geStartLinkBtn';

		return btn;
	},
	/**
	 * Returns a button of the footer with the given label (primary is the
	 * button of the default action).
	 */
	createButton: function(label, fn, icon, primary)
	{
		var btn = mxUtils.button(label, fn);
		btn.className = (primary) ? 'geBtn gePrimaryBtn' : 'geBtn';

		return btn;
	},
	/**
	 * Moves the language button of the given dialog (addLanguageMenu, the
	 * desktop app) into the footer and returns it.
	 */
	createLanguageButton: function(elt)
	{
		if (elt == null)
		{
			return null;
		}

		// The button keeps its listener (the menu opens at its position) and
		// is shown again (hideOthers hid the children of the dialog)
		elt.style.position = '';
		elt.style.right = '';
		elt.style.bottom = '';
		elt.style.opacity = '';
		elt.classList.remove(StartScreen.skins.classic.classes.replaced);
		elt.classList.add('geStartLanguage');
		elt.setAttribute('role', 'button');
		elt.setAttribute('tabindex', '0');
		elt.setAttribute('aria-label', mxResources.get('language'));

		mxEvent.addListener(elt, 'keydown', function(evt)
		{
			if (evt.key == 'Enter' || evt.key == ' ')
			{
				elt.click();
				mxEvent.consume(evt);
			}
		});

		return elt;
	},
	/**
	 * Fits the height of the dialog of the given content after a change
	 * (the dialog has the height of its content, see getStartScreenSize).
	 */
	fit: function(ui, elt)
	{
		if (ui.dialog != null && ui.dialog.container.firstChild == elt)
		{
			ui.dialog.container.style.height = Dialog.getFrameHeight(
				ui.dialog.container, elt.scrollHeight) + 'px';
		}
	},
	/**
	 * Focuses the given element once the dialog of the given content is
	 * shown (Enter then runs it), unless the focus is already in the dialog.
	 * Not on touch devices, which have no Enter.
	 */
	focusLater: function(elt, fn)
	{
		window.setTimeout(function()
		{
			var focus = (mxClient.IS_TOUCH) ? null : fn();

			if (focus != null && document.body.contains(elt) && !elt.contains(document.activeElement))
			{
				focus.focus();
			}
		}, 0);
	}
};

/**
 * Returns the skin of the start screen for the current theme: the skin of
 * Fusion in Fusion (if its scripts are loaded), else the Classic skin.
 */
StartScreen.getSkin = function()
{
	return (typeof Editor.isSimpleModern === 'function' && Editor.isSimpleModern() &&
		StartScreen.skins.fusion != null) ? StartScreen.skins.fusion :
		StartScreen.skins.classic;
};

/**
 * Returns true if the storage dialog and the splash dialog of the start
 * show the start screen: the feature startScreen of Editor.featureDefaults
 * (startScreen in the configuration and the URL), on in Simple (the driver,
 * 17 November 2026: the start screen of Fusion for Simple), off in Classic,
 * Sketch, Minimal and Atlas. The theme Fusion always has it.
 */
Editor.isStartScreenEnabled = function()
{
	return Editor.isFeatureEnabled('startScreen');
};

/**
 * Lays out the given storage dialog (kind storage) or splash dialog (kind
 * splash) as the start screen in the Classic skin where the feature is on
 * (Fusion lays them out in SimpleOpen.js). Called at the end of the
 * constructors of StorageDialog and SplashDialog.
 */
EditorUi.prototype.installStartScreen = function(dlg, kind)
{
	if (!this.editor.isChromelessView() && Editor.isStartScreenEnabled() &&
		StartScreen.getSkin() == StartScreen.skins.classic)
	{
		try
		{
			if (kind == 'storage')
			{
				this.createStartStorageLayout(dlg, StartScreen.skins.classic);
			}
			else if (kind == 'splash')
			{
				this.createStartSplashLayout(dlg, StartScreen.skins.classic);
			}
		}
		catch (e)
		{
			EditorUi.debug('EditorUi.installStartScreen', [this], 'error', [e]);
		}
	}
};

/**
 * Returns the size of the content of the given storage or splash dialog:
 * the width of the start screen (StartScreen.width) limited to the window
 * and the height of its content (null) if the dialog is laid out in the
 * Classic skin, else the given size. Fusion sizes its frame itself.
 */
EditorUi.prototype.getStartScreenSize = function(dlg, width, height)
{
	if (dlg != null && dlg.startScreen != null &&
		dlg.startScreen.skin == StartScreen.skins.classic)
	{
		var ww = window.innerWidth || document.documentElement.clientWidth;
		var margin = 48 + ((ww < 640) ? 16 : StartScreen.windowMargin);

		width = Math.max(Math.min(StartScreen.width, ww - margin), 240);
		height = null;
	}

	return {width: width, height: height};
};

/**
 * Returns the grid of tiles for the given entries ({image, name, hint,
 * target}, target is the hidden control of the dialog that the entry
 * clicks) in the given skin. A click chooses a tile, a double click and
 * Enter choose it and run the primary action (run). The tiles follow the
 * targets: disabled while their storage loads, hidden when it fails. The
 * grid has update and getChosen.
 */
EditorUi.prototype.createStartTiles = function(entries, chosen, run, label, skin)
{
	var classes = skin.classes;
	var tiles = document.createElement('div');
	tiles.className = classes.tiles;
	tiles.setAttribute('role', 'radiogroup');
	tiles.setAttribute('aria-label', label);

	var isShown = function(entry)
	{
		return entry.target == null || entry.target.style.display != 'none';
	};

	var isEnabled = function(entry)
	{
		return isShown(entry) && (entry.target == null || !entry.target.hasAttribute('disabled'));
	};

	var choose = function(entry)
	{
		chosen = entry;
		tiles.update();
	};

	tiles.update = function()
	{
		// A chosen storage that fails to load is not chosen
		if (chosen != null && !isShown(chosen))
		{
			chosen = null;
		}

		for (var i = 0; i < entries.length; i++)
		{
			var on = entries[i] == chosen;
			entries[i].tile.classList.toggle(classes.on, on);
			entries[i].tile.setAttribute('aria-checked', (on) ? 'true' : 'false');
			var enabled = isEnabled(entries[i]);

			// Storages that load later say so (see addLogo of the dialogs)
			if (enabled != !entries[i].tile.disabled)
			{
				entries[i].tile.disabled = !enabled;
				entries[i].tile.setHint((enabled) ? entries[i].hint : mxResources.get('loading') + '...');
			}

			entries[i].tile.style.display = (isShown(entries[i])) ? '' : 'none';
		}

		if (tiles.onChange != null)
		{
			tiles.onChange(chosen);
		}
	};

	tiles.getChosen = function()
	{
		return (chosen != null && isEnabled(chosen)) ? chosen : null;
	};

	for (var i = 0; i < entries.length; i++)
	{
		(function(entry)
		{
			var tile = skin.createTile(this, entry.image, entry.name, entry.hint);
			entry.tile = tile;

			mxEvent.addListener(tile, 'click', function()
			{
				choose(entry);
			});

			mxEvent.addListener(tile, 'dblclick', function()
			{
				choose(entry);
				run();
			});

			// Enter chooses the tile and runs the primary action, Space chooses
			mxEvent.addListener(tile, 'keydown', function(evt)
			{
				if (evt.key == 'Enter' && !tile.disabled)
				{
					choose(entry);
					run();
					mxEvent.consume(evt);
				}
			});

			tiles.appendChild(tile);
		}).call(this, entries[i]);
	}

	tiles.update();
	EditorUi.addRovingRadios(tiles);

	return tiles;
};

/**
 * Returns the recent files as rows (a section head and the rows) in the
 * given skin, null if there are none. fn is called with the entry of a row.
 */
EditorUi.prototype.createStartRecentRows = function(fn, skin)
{
	var recent = (typeof this.getRecent === 'function' && isLocalStorage) ? this.getRecent() : null;
	var file = this.getCurrentFile();
	var div = null;

	if (recent != null)
	{
		for (var i = 0, n = 0; i < recent.length && n < StartScreen.recentLimit; i++)
		{
			(function(entry)
			{
				if (entry != null && entry.id != null && entry.title != null &&
					(file == null || entry.id != file.getHash()) &&
					this.isStartRecentAvailable(entry))
				{
					if (div == null)
					{
						div = document.createElement('div');
						div.className = skin.classes.recent;
						div.appendChild(skin.createSectionHead(mxResources.get('recent')));
					}

					// Google and OneDrive use other keys
					var key = (entry.mode == App.MODE_GOOGLE) ? 'googleDrive' :
						((entry.mode == App.MODE_ONEDRIVE) ? 'oneDrive' : entry.mode);
					var hint = (key != null) ? mxResources.get(key, null, key) : null;

					div.appendChild(skin.createRecentRow(this, entry, String(entry.title), hint, function()
					{
						fn(entry);
					}));
					n++;
				}
			}).call(this, recent[i]);
		}
	}

	return div;
};

/**
 * Returns true if the storage of the given recent file is known and
 * enabled or loaded (stored entries may be for a storage that has been
 * removed, eg. dropbox, or that is off, ch8e S5). The recent files of the
 * desktop app are paths.
 */
EditorUi.prototype.isStartRecentAvailable = function(entry)
{
	if (EditorUi.isElectronApp || typeof App === 'undefined' || typeof App.isKnownMode !== 'function')
	{
		return true;
	}

	var mode = entry.mode;

	return App.isKnownMode(mode) && (mode == App.MODE_BROWSER || mode == App.MODE_DEVICE ||
		(typeof this.isModeEnabled === 'function' && this.isModeEnabled(mode)) ||
		(typeof this.getServiceForName === 'function' && this.getServiceForName(mode) != null));
};

/**
 * Opens the given recent file. The recent files of the desktop app are
 * paths that open like its Open Recent menu.
 */
EditorUi.prototype.openStartRecent = function(entry)
{
	var ui = this;
	var start = this.dialog;

	// A file that cannot be opened shows its error: if no file is open when
	// it (or another dialog of the load) closes, the start screen comes back
	// (ch8e S5)
	var done = function()
	{
		ui.editor.removeListener(listener);
		ui.editor.removeListener(done);
	};

	var listener = function(sender, evt)
	{
		if (ui.getCurrentFile() != null)
		{
			done();
		}
		else if (evt.getProperty('dialog') != start)
		{
			window.setTimeout(function()
			{
				if (ui.getCurrentFile() != null)
				{
					done();
				}
				else if (ui.dialog == null)
				{
					done();

					if (typeof ui.showSplash === 'function')
					{
						ui.showSplash();
					}
				}
			}, 0);
		}
	};

	this.editor.addListener('hideDialog', listener);
	this.editor.addListener('fileLoaded', done);

	if (EditorUi.isElectronApp && typeof this.loadArgs === 'function')
	{
		this.loadArgs({args: [entry.id]});
	}
	else
	{
		this.loadFile(entry.id);
	}
};

/**
 * Replaces the layout of the given storage dialog (StorageDialog, the
 * first start without a storage) with the start screen in the given skin:
 * Save diagrams to, the storages as tiles, the recent files as rows, the
 * Terms of Use, Decide Later on the left and Choose, which clicks the
 * button of the chosen storage in the dialog. Returns the layout ({skin,
 * head, body, tiles, recent, footer}) and puts it on the dialog
 * (startScreen), or returns null if the dialog has changed.
 */
EditorUi.prototype.createStartStorageLayout = function(dlg, skin)
{
	var ui = this;
	var c = dlg.controls;
	var elt = dlg.container;
	var classes = skin.classes;

	// Keeps the previous layout if the dialog has changed
	if (c == null || c.buttons == null || c.logos == null || c.later == null || c.title == null ||
		c.buttons.parentNode != elt || c.later.parentNode != elt)
	{
		return null;
	}

	skin.prepare(elt);
	elt.style.paddingBottom = '';
	skin.hideOthers(elt, []);

	var head = skin.createHead(this, mxResources.get('saveDiagramsTo'));
	var body = document.createElement('div');
	body.className = classes.body;

	var entries = [];

	for (var i = 0; i < c.logos.length; i++)
	{
		entries.push({mode: c.logos[i].mode, image: skin.getStorageImage(this, c.logos[i].mode),
			name: c.logos[i].title, target: c.logos[i].button});
	}

	var buttons = document.createElement('div');

	if (classes.footer != null)
	{
		buttons.className = classes.footer;
	}

	var primary = mxUtils.button(mxResources.get('choose'), function()
	{
		var entry = tiles.getChosen();

		if (entry != null)
		{
			entry.target.click();
		}
	});
	primary.className = 'geBtn gePrimaryBtn';

	// One storage is chosen, else the user chooses
	var tiles = this.createStartTiles(entries, (entries.length == 1) ? entries[0] : null, function()
	{
		primary.click();
	}, mxResources.get('saveDiagramsTo'), skin);
	body.appendChild(tiles);

	tiles.onChange = function(entry)
	{
		primary.disabled = entry == null || entry.tile.disabled;
	};

	tiles.update();

	if (window.MutationObserver != null)
	{
		new MutationObserver(function()
		{
			tiles.update();
		}).observe(c.buttons, {attributes: true, subtree: true, attributeFilter: ['disabled', 'style']});
	}

	// Opening a recent file continues like the other choices
	var recent = this.createStartRecentRows(function(entry)
	{
		if (dlg.notice != null)
		{
			ui.acceptTerms((entry.mode == App.MODE_GOOGLE) ? ui.drive : null);
		}

		ui.hideDialog();
		ui.openStartRecent(entry);
	}, skin);

	if (recent != null)
	{
		body.appendChild(recent);
	}

	// The Terms of Use (text and links), below the choices
	if (dlg.notice != null)
	{
		dlg.notice.classList.remove(classes.replaced);
		dlg.notice.classList.add(classes.notice);
		dlg.notice.style.margin = '';
		dlg.notice.style.lineHeight = '';
		body.appendChild(dlg.notice);
	}

	var tools = skin.createTools([skin.createLinkButton(mxUtils.trim(c.later.textContent), c.later)]);
	buttons.appendChild(tools);
	buttons.appendChild(primary);

	elt.insertBefore(head, elt.firstChild);
	elt.insertBefore(body, head.nextSibling);
	elt.insertBefore(buttons, body.nextSibling);

	// The hint for a missing Google Drive (added after 5 s) goes into the body
	if (c.missing != null && window.MutationObserver != null)
	{
		var observer = new MutationObserver(function()
		{
			if (c.missing.parentNode == elt)
			{
				observer.disconnect();
				c.missing.style.marginTop = '';
				c.missing.style.padding = '';
				c.missing.classList.add(classes.notice);
				body.appendChild(c.missing);
				skin.fit(ui, elt);
			}
		});

		observer.observe(elt, {childList: true});
	}

	dlg.startScreen = {skin: skin, head: head, body: body, tiles: tiles, recent: recent, footer: buttons};

	return dlg.startScreen;
};

/**
 * Replaces the layout of the given splash dialog (SplashDialog) with the
 * start screen in the given skin: the storage as a card with Change Storage
 * (or the user to change), the recent files as rows, the language and Sign
 * out on the left, Open Existing Diagram and Create New Diagram, which click
 * the buttons of the dialog. Returns the layout ({skin, head, body, recent,
 * footer}) and puts it on the dialog (startScreen), or returns null if the
 * dialog has changed.
 */
EditorUi.prototype.createStartSplashLayout = function(dlg, skin)
{
	var ui = this;
	var c = dlg.controls;
	var elt = dlg.container;
	var classes = skin.classes;

	// Keeps the previous layout if the dialog has changed
	if (c == null || c.create == null || c.open == null || c.buttons == null ||
		c.buttons.parentNode != elt)
	{
		return null;
	}

	skin.prepare(elt);
	skin.hideOthers(elt, []);

	var service = (c.storage != null) ? mxResources.get(c.storage.title) : null;
	var peer = (c.storage != null && c.storage.client != null) ? this[c.storage.client] : null;
	var user = (peer != null && typeof peer.getUser === 'function') ? peer.getUser() : null;
	var userName = (user != null && user.displayName != null) ? String(user.displayName) : null;
	var head = skin.createHead(this, this.getServiceName());
	var body = document.createElement('div');
	body.className = classes.body;

	// The storage as a card with Change Storage
	if (c.change != null && c.storage != null)
	{
		var card = document.createElement('div');
		card.className = classes.card;
		var icon = document.createElement('div');
		icon.className = classes.cardIcon;
		var img = skin.createStorageIcon(this, this.mode, c.storage);

		if (img != null)
		{
			icon.appendChild(img);
		}

		card.appendChild(icon);
		var text = document.createElement('div');
		text.className = classes.cardText;
		var name = document.createElement('div');
		name.className = classes.cardName;
		mxUtils.write(name, service);
		text.appendChild(name);

		if (userName != null)
		{
			var meta = document.createElement('div');
			meta.className = classes.cardMeta;
			mxUtils.write(meta, mxResources.get('signedInAs', [userName]));
			text.appendChild(meta);
		}

		card.appendChild(text);
		card.appendChild(skin.createLinkButton(mxUtils.trim(c.change.textContent), c.change, 'swap'));
		body.appendChild(card);
	}

	// Change User (Google Drive with more than one account)
	if (c.users != null)
	{
		var r = document.createElement('div');
		r.className = classes.user;
		var l = document.createElement('label');
		mxUtils.write(l, mxResources.get('changeUser'));
		r.appendChild(l);
		var ctl = document.createElement('div');
		ctl.className = classes.userControl;
		c.users.style.marginLeft = '';
		c.users.style.width = '';
		ctl.appendChild(c.users);
		r.appendChild(ctl);
		body.appendChild(r);
	}

	var recent = this.createStartRecentRows(function(entry)
	{
		ui.hideDialog();
		ui.openStartRecent(entry);
	}, skin);

	if (recent != null)
	{
		body.appendChild(recent);
	}

	var buttons = document.createElement('div');

	if (classes.footer != null)
	{
		buttons.className = classes.footer;
	}

	var tools = skin.createTools([skin.createLanguageButton(c.language), (c.logout != null) ?
		skin.createLinkButton(mxUtils.trim(c.logout.textContent), c.logout) : null]);

	if (tools != null)
	{
		buttons.appendChild(tools);
	}

	var open = skin.createButton(mxUtils.trim(c.open.textContent), function()
	{
		c.open.click();
	}, 'open', false);
	buttons.appendChild(open);

	var create = skin.createButton(mxUtils.trim(c.create.textContent), function()
	{
		c.create.click();
	}, 'add', true);
	buttons.appendChild(create);

	elt.insertBefore(head, elt.firstChild);
	elt.insertBefore(body, head.nextSibling);
	elt.insertBefore(buttons, body.nextSibling);

	// Create New Diagram has the focus, Enter runs it
	skin.focusLater(elt, function()
	{
		return create;
	});

	dlg.startScreen = {skin: skin, head: head, body: body, recent: recent, footer: buttons};

	return dlg.startScreen;
};
