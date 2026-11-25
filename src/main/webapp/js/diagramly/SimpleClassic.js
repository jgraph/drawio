/**
 * Copyright (c) 2020-2025, JGraph Holdings Ltd
 * Copyright (c) 2020-2025, draw.io AG
 */
/**
 * Installing themes.
 */
Editor.themes.unshift('simple');
Editor.themes.push('sketch');
Editor.themes.push('atlas');

(function()
{
	/**
	 *
	 */
	EditorUi.prototype.switchCssForTheme = function(value)
	{
		var node = (mxUtils.isAncestorNode(document.body, this.container)) ?
			this.container : this.editor.graph.container;
		
		if (node != null)
		{
			if (value == 'kennedy')
			{
				node.classList.add('geClassic');
			}
			else
			{
				node.classList.remove('geClassic');
			}

			if (value == 'sketch')
			{
				node.classList.add('geSketch');
			}

			if (value == 'simple' || value == 'sketch')
			{
				node.classList.add('geSimple');
			}
			else
			{
				node.classList.remove('geSimple');
			}
		}
	};
	
	/**
	 * Width of the icon that File had before its label, with the gap: the
	 * status in the middle of the top bar of the simple theme has room for it
	 * at every width (getSimpleFileExtraWidth, simpleToolbarRooms).
	 */
	EditorUi.prototype.simpleFileIconWidth = 36;

	/**
	 * Gap between the buttons of the top bar of the simple theme (the gap of
	 * .geSimpleMainMenu in grapheditor.css).
	 */
	EditorUi.prototype.simpleToolbarGap = 8;

	/**
	 * Window width below which the simple theme hides its File button, after
	 * every other button that hides (File is in the … menu), later only where
	 * its label needs more room (getSimpleFileShift).
	 */
	EditorUi.prototype.simpleFileButtonMinWidth = 250;

	/**
	 * Room that the status in the middle of the top bar of the simple theme
	 * has at the window width from which a button is shown, with the icon that
	 * File had before its label and the buttons of the narrower widths (undo
	 * for undo and redo, search for the omnibox; 16 px of padding of the
	 * status are not room). The bar keeps the widths of before, and a button
	 * comes only later by what the label of File needs more than this room
	 * (getSimpleFileShift; the driver, 17 November 2026): in English undo
	 * and redo from 365 px and Share from 399 px, in German File from 253,
	 * undo and redo from 377 and Share from 411 px. From 680 px the status
	 * has at least 124 px (with comments), more than the widest label needs
	 * (120 px, 92 more than the icon), so those buttons keep their widths.
	 * Select and the Hand tool (simpleHandToolMinWidth) leave less: tools is
	 * the least room from there, at 800 px where Rectangle comes, and more
	 * than the label of every language needs, so they come at 700 px in every
	 * language; a wider label (up to the 120 px of the CSS) shows them, the
	 * zoom, Text and Rectangle later together by what it needs more.
	 * Where the page tabs replace the Pages button, there is only more room.
	 * The test simple-file-button measures these values.
	 */
	EditorUi.prototype.simpleToolbarRooms = {file: 22, 'delete': 34, insert: 37,
		undo: 8, share: 11, pages: 60, search: 27, shapes: 52, comments: 39, tools: 66};

	/**
	 * Window width (plus the width of the buttons of embeds) from which the
	 * top bar of the simple theme has Select and the Hand tool before its
	 * tools that insert (simpleSelectElt, simpleHandElt). Tablets in portrait
	 * and phones in landscape have them, narrower windows such as phones have
	 * View > Hand Tool instead (isSimpleHandButtonShown) and H. A label of
	 * File wider than any language has shows them later (tools in
	 * simpleToolbarRooms).
	 */
	EditorUi.prototype.simpleHandToolMinWidth = 700;

	/**
	 * Returns true if the toolbar of the simple theme starts with File, the
	 * button of the File menu: where the … menu has File (see the menu diagram:
	 * not in the desktop app, Confluence and Jira or with noFileMenu=1) and the
	 * configuration does not hide it (hideMenus, hideMenuItems).
	 */
	EditorUi.prototype.isSimpleFileButtonVisible = function()
	{
		return urlParams['noFileMenu'] != '1' && !mxClient.IS_CHROMEAPP &&
			!EditorUi.isElectronApp && (typeof App === 'undefined' ||
			this.mode != App.MODE_ATLAS) && this.menus.get('file') != null &&
			(this.menus.hiddenMenuItems == null || !this.menus.hiddenMenuItems['file']) &&
			(this.menus.defaultMenuItems == null ||
			mxUtils.indexOf(this.menus.defaultMenuItems, 'file') >= 0);
	};

	/**
	 * Returns the width that the toolbar of the simple theme needs in addition
	 * to its buttons: the buttons of embeds (getSimpleEmbedButtonsWidth), the
	 * bell of new notifications while it is shown (getSimpleNotificationWidth)
	 * and, if file is true, the File button. Buttons hide below their window
	 * width plus the offset without File (and plus getSimpleFileShift), as the
	 * status in the middle has room for the icon of File of before, except
	 * share, which adds the icon: it goes into the overflow menu first where
	 * the status would get too small (narrow phones), so that undo, redo,
	 * delete and insert stay.
	 */
	EditorUi.prototype.getSimpleToolbarOffset = function(file)
	{
		var eo = this.getSimpleEmbedButtonsWidth() +
			this.getSimpleNotificationWidth();

		return eo + ((file && this.simpleFileElt != null) ?
			this.simpleFileIconWidth + this.getSimpleFileShift('share') : 0);
	};

	/**
	 * Returns the width of the buttons of embeds in the top bar of the simple
	 * theme (buttonContainer, 300 while it is not shown), 0 outside embeds.
	 * The title of the host in it (setEmbedTitle) shrinks with an ellipsis
	 * where the bar has no room for it (grapheditor.css): while the buttons
	 * are in the bar of the simple theme (not in the top bar of Fusion), the
	 * width counts the whole title, as before it could shrink, so that the
	 * steps of the bar do not depend on how far the title has shrunk at the
	 * last refresh.
	 */
	EditorUi.prototype.getSimpleEmbedButtonsWidth = function()
	{
		var w = 0;

		if (urlParams['embed'] == '1' && this.buttonContainer != null)
		{
			w = this.buttonContainer.offsetWidth;
			var title = this.embedFilenameSpan;

			if (w > 0 && title != null && title.parentNode == this.buttonContainer &&
				this.sketchMenubarElt != null && this.buttonContainer.parentNode == this.sketchMenubarElt)
			{
				w += Math.max(0, title.scrollWidth - title.clientWidth);
			}
			else if (w == 0)
			{
				w = 300;
			}
		}

		return w;
	};

	/**
	 * The room that the top bar of the simple theme needs in embeds besides
	 * its button container where it shows the fewest buttons: View, Insert,
	 * the status, … (Diagram), Format and » with their gaps and the padding of
	 * the bar (measured: Save, Save & Exit and Exit in English are 262 px and
	 * fit down to a window of 480 px). Narrower windows fold the buttons of
	 * the host into one menu (updateSimpleEmbedMenu).
	 */
	EditorUi.prototype.simpleEmbedMenuMinWidth = 218;

	/**
	 * Returns the buttons of the host in the button container of embeds
	 * (Save, Save & Exit, Exit or Publish and Close, as the host configured
	 * them, see addEmbedButtons) in their order.
	 */
	EditorUi.prototype.getSimpleEmbedButtons = function()
	{
		var result = [];

		if (this.buttonContainer != null)
		{
			for (var i = 0; i < this.buttonContainer.children.length; i++)
			{
				var child = this.buttonContainer.children[i];

				if (child.classList.contains('geEmbedBtn'))
				{
					result.push(child);
				}
			}
		}

		return result;
	};

	/**
	 * Returns the width of the button container of embeds in the top bar of
	 * the simple theme with the buttons of the host and without the title of
	 * the host (which shrinks) and the menu of the folded buttons, or 0 while
	 * the bar is not shown.
	 */
	EditorUi.prototype.getSimpleEmbedUnfoldedWidth = function()
	{
		var container = this.buttonContainer;
		var cs = window.getComputedStyle(container);
		var w = 0;

		for (var i = 0; i < container.children.length; i++)
		{
			var child = container.children[i];

			if (child != this.embedFilenameSpan && child != this.simpleEmbedMenuElt)
			{
				var r = child.getBoundingClientRect();

				if (r.width > 0)
				{
					var ccs = window.getComputedStyle(child);
					w += r.width + (parseFloat(ccs.marginLeft) || 0) + (parseFloat(ccs.marginRight) || 0);
				}
			}
		}

		return (w > 0) ? Math.round(w + (parseFloat(cs.paddingLeft) || 0) +
			(parseFloat(cs.paddingRight) || 0)) : 0;
	};

	/**
	 * Folds the buttons of the host in the top bar of the simple theme in
	 * embeds into one menu (simpleEmbedMenuElt, with their labels, shortcuts
	 * and actions, see addSimpleEmbedMenuItems) where the window is narrower
	 * than the bar with their whole labels (simpleEmbedMenuMinWidth plus the
	 * width of the container with the buttons), so that View, Insert, …,
	 * Format and the actions of the host stay in the window; wider windows
	 * show the buttons as before. The title of the host stays in the bar. The
	 * width of the buttons is measured while they are shown (and again with
	 * remeasure, after the buttons were made again), so the fold does not
	 * depend on the steps of the bar, which run after it and count the menu
	 * (getSimpleEmbedButtonsWidth). Returns true if the buttons were folded or
	 * unfolded.
	 */
	EditorUi.prototype.updateSimpleEmbedMenu = function(remeasure)
	{
		var container = this.buttonContainer;
		var result = false;

		if (container != null)
		{
			var folded = container.classList.contains('geSimpleEmbedFolded');
			var fold = false;

			if (urlParams['embed'] == '1' && urlParams['embedInline'] != '1' &&
				Editor.currentTheme == 'simple' && this.sketchMenubarElt != null &&
				container.parentNode == this.sketchMenubarElt &&
				this.getSimpleEmbedButtons().length > 0)
			{
				if (!folded || remeasure)
				{
					container.classList.remove('geSimpleEmbedFolded');
					var w = this.getSimpleEmbedUnfoldedWidth();

					if (w > 0)
					{
						this.simpleEmbedUnfoldedWidth = w;
					}
				}

				var iw = window.innerWidth || document.documentElement.clientWidth ||
					document.body.clientWidth;
				fold = this.simpleEmbedUnfoldedWidth > 0 && iw <
					this.simpleEmbedMenuMinWidth + this.simpleEmbedUnfoldedWidth;
			}

			if (fold)
			{
				if (this.simpleEmbedMenuElt == null)
				{
					this.simpleEmbedMenuElt = this.createSimpleEmbedMenu();
				}

				if (this.simpleEmbedMenuElt.parentNode != container)
				{
					container.appendChild(this.simpleEmbedMenuElt);
				}

				// The tooltip names the actions in the menu
				var labels = this.getSimpleEmbedButtons().map(function(btn)
				{
					return btn.textContent;
				});

				this.simpleEmbedMenuElt.setAttribute('title', labels.join(', '));
			}
			else if (this.simpleEmbedMenuElt != null &&
				this.currentMenuElt == this.simpleEmbedMenuElt)
			{
				this.hideCurrentMenu();
			}

			container.classList.toggle('geSimpleEmbedFolded', fold);
			result = fold != folded;
		}

		return result;
	};

	/**
	 * Returns the menu button of the folded buttons of the host in the top
	 * bar of the simple theme (updateSimpleEmbedMenu): an icon like View and
	 * …, which opens its menu with a click, Enter, Space or the arrow keys
	 * (addMenuHandler).
	 */
	EditorUi.prototype.createSimpleEmbedMenu = function()
	{
		var elt = document.createElement('a');
		elt.className = 'geButton geSimpleEmbedMenu';
		elt.style.backgroundImage = 'url(' + Editor.thinSaveImage + ')';

		this.addMenuHandler(elt, mxUtils.bind(this, function(menu, parent)
		{
			this.addSimpleEmbedMenuItems(menu, parent);
		}));

		return elt;
	};

	/**
	 * Adds the buttons of the host to the given menu with their labels and
	 * shortcuts: an item clicks its button, so it runs the same action and
	 * sends the same messages to the host, and is disabled while its button is.
	 */
	EditorUi.prototype.addSimpleEmbedMenuItems = function(menu, parent)
	{
		var buttons = this.getSimpleEmbedButtons();

		for (var i = 0; i < buttons.length; i++)
		{
			(mxUtils.bind(this, function(btn)
			{
				var label = btn.textContent;
				var item = menu.addItem(label, null, function()
				{
					btn.click();
				}, parent, null, !btn.disabled);

				// The shortcut from the tooltip of the button, label (shortcut)
				// (see createEmbedButton)
				var title = btn.getAttribute('title') || '';
				var prefix = label + ' (';

				if (item != null && title.length > prefix.length + 1 &&
					title.substring(0, prefix.length) == prefix &&
					title.charAt(title.length - 1) == ')')
				{
					this.menus.addShortcut(item, {shortcut: title.substring(
						prefix.length, title.length - 1)}, menu.hideShortcuts);
				}
			}))(buttons[i]);
		}
	};

	/**
	 * Returns the room that the bell of new notifications takes in the top bar
	 * of the simple theme (App.showNotification, App.updateButtonContainer puts
	 * it before the search): its width with its margin and the gap (32 px), 0
	 * while it is not in the bar or hidden. The bar shows it from 480 px, where
	 * the search comes (grapheditor.css), so that phones keep their tools, and
	 * from there its buttons come later by this room while the bell is shown
	 * (getSimpleToolbarOffset), as by the buttons of embeds, so that the bell
	 * never pushes » out of the window. Keeps the last measured room while the
	 * bar is not shown.
	 */
	EditorUi.prototype.getSimpleNotificationWidth = function()
	{
		var bell = this.notificationBtn;
		var w = 0;

		if (bell != null && this.sketchMenubarElt != null &&
			bell.parentNode == this.sketchMenubarElt &&
			bell.style.display != 'none')
		{
			var cs = window.getComputedStyle(bell);

			if (cs.display != 'none')
			{
				w = bell.offsetWidth;

				if (w > 0)
				{
					w = Math.ceil(w + parseFloat(cs.marginLeft) + parseFloat(cs.marginRight) +
						(parseFloat(window.getComputedStyle(this.sketchMenubarElt).columnGap) || 0));
					this.simpleNotificationWidth = w;
				}
				else
				{
					w = this.simpleNotificationWidth || 0;
				}
			}
		}

		return w;
	};

	/**
	 * Returns the width of the File button of the simple theme with its gap:
	 * as wide as its label, which depends on the language (at most 120 px,
	 * see grapheditor.css). Measures File also while it is hidden in a narrow
	 * window, so that the refreshes of the top bar get its width in any order
	 * (eg. the first resize after an open in a hidden frame or a change of the
	 * language while File is hidden). Keeps the last measured width while the
	 * bar is not shown, and is the width of the icon of before until File was
	 * measured (Fusion hides the bar).
	 */
	EditorUi.prototype.getSimpleFileButtonWidth = function()
	{
		var w = 0;

		if (this.simpleFileElt != null)
		{
			var display = this.simpleFileElt.style.display;

			// Shown only for the measurement and hidden again at once (no
			// paint in between)
			if (display == 'none')
			{
				this.simpleFileElt.style.display = '';
			}

			// Rounded up, as a label of 40.4 px needs 41 px
			w = Math.ceil(this.simpleFileElt.getBoundingClientRect().width);
			this.simpleFileElt.style.display = display;
		}

		if (w > 0)
		{
			this.simpleFileButtonWidth = w + this.simpleToolbarGap;
		}

		return (this.simpleFileButtonWidth != null) ?
			this.simpleFileButtonWidth : this.simpleFileIconWidth;
	};

	/**
	 * Returns the width that File of the simple theme needs more than its
	 * icon of before (simpleFileIconWidth), 0 without File (13 px in English,
	 * 25 in German): the buttons of the top bar come later by what this needs
	 * more than the room of the status (getSimpleFileShift), so that the
	 * label never pushes the bar out of the window.
	 */
	EditorUi.prototype.getSimpleFileExtraWidth = function()
	{
		return (this.simpleFileElt != null) ? Math.max(0,
			this.getSimpleFileButtonWidth() - this.simpleFileIconWidth) : 0;
	};

	/**
	 * Returns true if the toolbar of the simple theme has the Pages button
	 * (on windows of at least 480 px plus the width of the buttons of embeds,
	 * below in the overflow menu): only while the tabs of the pages are hidden,
	 * as the tabs start with the menu of the pages like in Classic while they
	 * are shown (the driver, 17 November 2026; updateTabContainer in Pages.js).
	 * View > Page Tabs switches between both without a restart
	 * (tabContainerVisibleChanged).
	 */
	EditorUi.prototype.isSimplePagesButtonVisible = function()
	{
		return this.tabContainer == null || !this.isTabContainerVisible();
	};

	/**
	 * Returns how much later than with the icon of File of before the button
	 * of the top bar of the simple theme with the given name of
	 * simpleToolbarRooms is shown: what the label of File needs more than the
	 * room of the status at that width, 0 where the label fits and without
	 * File. The given extra width is getSimpleFileExtraWidth if it is null.
	 */
	EditorUi.prototype.getSimpleFileShift = function(name, extra)
	{
		var room = this.simpleToolbarRooms[name];

		return (room != null) ? Math.max(0, ((extra != null) ? extra :
			this.getSimpleFileExtraWidth()) - room) : 0;
	};

	/**
	 * Window width from which Share of the simple theme is a button with the
	 * share glyph and its label; below, it is an icon, and at 360 px plus the
	 * icon of File of before and below (396 px, 398 in English and 410 in
	 * German, see getSimpleToolbarOffset) it goes into the overflow menu.
	 */
	EditorUi.prototype.simpleShareLabelMinWidth = 900;

	/**
	 * Updates Share of the simple theme (shareElt): on windows of at least
	 * simpleShareLabelMinWidth a button with the share glyph of Share in Fusion
	 * and the label Share in the colors of primary buttons (like Share of
	 * Classic, the driver, 13 November 2026; the glyph left of the label as in
	 * Fusion, the driver, 17 November 2026; the switch shareMenu of
	 * Editor.featureDefaults), below the standard share icon of the theme
	 * (Editor.thinShareImage, as the menu also exports and presents), else,
	 * without the switch and while the network has a state (offline, errors of
	 * realtime) the icon of before, the network icon with the state in the
	 * tooltip. Standalone apps (desktop, Chrome app, offline=1) keep the share
	 * icon at every width whatever the switch says, as their menu has no
	 * Share... (Menus.getShareMenuGroups). Rebuilds the button only if its
	 * mode, label or state changed.
	 */
	EditorUi.prototype.updateSimpleShareButton = function()
	{
		var elt = this.shareElt;

		if (elt != null)
		{
			var iw = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
			var standalone = this.isStandaloneApp();
			var status = (standalone) ? null : this.getNetworkStatus();
			var menu = Editor.isFeatureEnabled('shareMenu');
			var label = mxResources.get('share');
			var title = (status != null) ? label + ' (' + status + ')' : label;
			var wide = status == null && !standalone && menu &&
				iw >= this.simpleShareLabelMinWidth + this.getSimpleToolbarOffset(false);
			var state = [wide, menu, title].join('|');

			if (elt.getAttribute('data-share-state') != state)
			{
				elt.setAttribute('data-share-state', state);
				elt.setAttribute('title', title);
				elt.innerHTML = '';

				if (wide)
				{
					// The inner button has the colors of the toolbar buttons (inverted
					// in dark mode), the outer one those of primary buttons; the glyph
					// has the color of the label
					elt.className = 'geBtn gePrimaryBtn geSimpleShareBtn';
					elt.style.backgroundImage = '';

					var inner = document.createElement('div');
					inner.className = 'geButton';
					inner.appendChild(this.menus.createShareMenuGlyph(
						this.menus.getShareMenuGlyph('share')));

					var span = document.createElement('span');
					mxUtils.write(span, label);
					inner.appendChild(span);
					elt.appendChild(inner);
				}
				else
				{
					elt.className = 'geButton';
					elt.style.backgroundImage = 'url(' + ((status != null) ? Editor.thinUserFlashImage :
						((standalone || menu) ? Editor.thinShareImage : Editor.thinUserAddImage)) + ')';
				}
			}
		}
	};

	/**
	 * Adds the export entry of the simple theme to the given menu and returns
	 * its item, in the File button, in the … menu and in Share: Export...
	 * with the short menus, in File and … followed by Embed ▸, which is the
	 * last submenu of Export as ▸ in this theme, and alone in Share (noEmbed,
	 * like Share of Fusion), else Export as ▸ (see Menus.addExportEntry, which
	 * adds both and nothing if Export as ▸ is hidden).
	 */
	EditorUi.prototype.addSimpleExportEntry = function(menu, parent, noEmbed)
	{
		return this.menus.addExportEntry(menu, parent, noEmbed);
	};

	/**
	 *
	 */
	var editorUiCreateMainMenuForTheme = EditorUi.prototype.createMainMenuForTheme;

	EditorUi.prototype.createMainMenuForTheme = function(value)
	{
		if (value == 'simple' || value == 'sketch')
		{
			if (this.sketchMainMenuElt == null)
			{
				this.sketchMainMenuElt = document.createElement('div');

				// File is the first button of the simple theme, as it is the most
				// clicked named control; the … menu keeps File. Its label File
				// like File of Fusion (decision 12 of the style guide: a labelled
				// File menu that people find, no icon), as the icon of a document
				// looked like the one of Pages (the driver, 17 November 2026)
				if (value == 'simple' && this.isSimpleFileButtonVisible())
				{
					this.simpleFileElt = this.createMenu('file', null, 'geButton geSimpleFileBtn');
					this.simpleFileElt.style.flexShrink = '0';
					this.sketchMainMenuElt.appendChild(this.simpleFileElt);
				}

				var elt = this.createMenu((value == 'simple') ? 'view' : 'diagram',
					(value == 'simple') ? Editor.thinViewImage : Editor.menuImage);
				this.sketchMainMenuElt.appendChild(elt);

				// An open View menu closes where the Hand button comes or goes
				// (initPicker)
				this.simpleViewMenuElt = (value == 'simple') ? elt : null;

				var deleteElt = this.createMenuItem('delete', Editor.trashImage);
				var undoElt = this.createMenuItem('undo', Editor.undoImage);
				var redoElt = this.createMenuItem('redo', Editor.redoImage);

				this.dependsOnLanguage(mxUtils.bind(this, function()
				{
					elt.setAttribute('title', mxResources.get(
						(value == 'simple') ? 'view' : 'diagram'));

					if (this.simpleFileElt != null)
					{
						// The label in a span, which ends in an ellipsis if a
						// translation is longer than the button may be
						var fileLabel = document.createElement('span');
						mxUtils.write(fileLabel, mxResources.get('file'));
						this.simpleFileElt.textContent = '';
						this.simpleFileElt.appendChild(fileLabel);
						this.simpleFileElt.setAttribute('title', mxResources.get('file'));
					}

					// Keeps the reason of disabled buttons (see setControlTooltip)
					this.setControlTooltip(deleteElt, mxResources.get('delete'));
					this.setControlTooltip(undoElt, mxResources.get('undo'));
					this.setControlTooltip(redoElt, mxResources.get('redo'));
				}));

				if (value == 'simple')
				{
					this.sketchMainMenuElt.className = 'geToolbarContainer geSimpleMainMenu';
				}
				else
				{
					this.container.appendChild(this.sketchMainMenuElt);
					this.sketchMainMenuElt.className = 'geToolbarContainer geSketchMainMenu';
					this.sketchMainMenuElt.appendChild(deleteElt);
					this.sketchMainMenuElt.appendChild(undoElt);
					this.sketchMainMenuElt.appendChild(redoElt);
				}

				this.container.appendChild(this.sketchMainMenuElt);
			}
		}
		else
		{
			editorUiCreateMainMenuForTheme.apply(this, arguments);
		}		
	};
	
	/**
	 *
	 */
	var editorUiCreateFooterMenuForTheme = EditorUi.prototype.createFooterMenuForTheme;

	EditorUi.prototype.createFooterMenuForTheme = function(value)
	{
		if (value == 'simple' || value == 'sketch')
		{
			if (this.sketchFooterMenuElt == null)
			{
				var pageMenu = this.createPageMenuTab(false, value != 'simple');
				var pagesElt = this.createMenu('pages', Editor.thinNoteImage);
				var undoElt = this.createMenuItem('undo', Editor.thinUndoImage);
				var redoElt = this.createMenuItem('redo', Editor.thinRedoImage);
				var deleteElt = this.createMenuItem('delete', Editor.thinDeleteImage);
				var zoomOutElt = this.createMenuItem('zoomOut', Editor.zoomOutImage);
				var zoomInElt = this.createMenuItem('zoomIn', Editor.zoomInImage);
				var fullscreenElt = this.createMenuItem('fullscreen', Editor.fullscreenImage);
				var exitElt = this.createMenuItem('exit', Editor.closeImage);
	
				this.dependsOnLanguage(mxUtils.bind(this, function()
				{
					pagesElt.setAttribute('title', mxResources.get('pages'));

					// Keeps the reason of disabled buttons (see setControlTooltip)
					this.setControlTooltip(undoElt, mxResources.get('undo'));
					this.setControlTooltip(redoElt, mxResources.get('redo'));
					this.setControlTooltip(deleteElt, mxResources.get('delete'));
					this.setControlTooltip(zoomOutElt, mxResources.get('zoomOut'));
					this.setControlTooltip(zoomInElt, mxResources.get('zoomIn'));
					this.setControlTooltip(fullscreenElt, mxResources.get('fullscreen'));
					this.setControlTooltip(exitElt, mxResources.get('exit'));
				}));
				
				this.sketchFooterMenuElt = document.createElement('div');
				this.sketchFooterMenuElt.className = 'geToolbarContainer geFooterToolbar';
				var footer = this.sketchFooterMenuElt;

				if (value != 'simple')
				{
					pageMenu.className = 'geButton gePageMenu';
					pageMenu.style.backgroundImage = 'url(' + Editor.arrowDownImage + ')';
					footer.appendChild(pageMenu);

					var pageName = document.createElement('span');
					pageMenu.innerText = '';
					pageMenu.appendChild(pageName);
					
					var updatePageName = mxUtils.bind(this, function()
					{
						pageName.innerText = '';

						if (this.currentPage != null)
						{
							mxUtils.write(pageName, this.currentPage.getName());
							var n = (this.pages != null) ? this.pages.length : 1;
							var idx = this.getPageIndex(this.currentPage);
							idx = (idx != null) ? idx + 1 : 1;
							var id = this.currentPage.getId();
							pageMenu.setAttribute('title', this.currentPage.getName() +
								' (' + idx + '/' + n + ')' + ((id != null) ?
								' [' + id + ']' : ''));
						}
					});

					this.editor.addListener('pagesPatched', updatePageName);
					this.editor.addListener('pageSelected', updatePageName);
					this.editor.addListener('pageRenamed', updatePageName);
					this.editor.addListener('fileLoaded', updatePageName);
					updatePageName();

					// Page menu only visible for multiple pages
					var pagesVisibleChanged = mxUtils.bind(this, function()
					{
						pageMenu.style.display = (this.isPageMenuVisible()) ? '' : 'none';
					});

					this.addListener('editInlineStart', mxUtils.bind(this, function()
					{
						pagesVisibleChanged();
						updatePageName();
					}));
					
					this.addListener('fileDescriptorChanged', pagesVisibleChanged);
					this.addListener('pagesVisibleChanged', pagesVisibleChanged);
					this.editor.addListener('pagesPatched', pagesVisibleChanged);
					pagesVisibleChanged();

					footer.appendChild(zoomOutElt);
				}

				var zoomInput = this.createZoomInput(value != 'simple');
				footer.appendChild(zoomInput);

				if (value == 'simple')
				{
					undoElt.style.marginLeft = 'auto';
					this.simplePagesElt = pagesElt;
					footer.appendChild(pagesElt);
					footer.appendChild(undoElt);
					footer.appendChild(redoElt);
					footer.appendChild(deleteElt);

					// Pages only without the tabs of the pages, which have its menu
					var refreshMenu = mxUtils.bind(this, function()
					{
						// The buttons of the host fold into a menu before the steps
						this.updateSimpleEmbedMenu();
						var iw = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
						var eo = this.getSimpleToolbarOffset(false);
						var fo = this.getSimpleFileExtraWidth();

						// The widths of before, later where the label of File
						// needs more room (getSimpleFileShift)
						pagesElt.style.display = (iw < 480 + eo + this.getSimpleFileShift('pages', fo) ||
							!this.isSimplePagesButtonVisible()) ? 'none' : '';
						zoomInput.style.display = (iw < 750 + eo + this.getSimpleFileShift('tools', fo)) ? 'none' : '';
						deleteElt.style.display = (iw < 290 + eo + this.getSimpleFileShift('delete', fo)) ? 'none' : '';
						undoElt.style.display = (iw < 360 + eo + this.getSimpleFileShift('undo', fo)) ? 'none' : '';
						redoElt.style.display = undoElt.style.display;
					});

					mxEvent.addListener(window, 'resize', refreshMenu);
					this.addListener('tabContainerVisibleChanged', refreshMenu);

					// The label of File has the width of the language
					this.addListener('languageChanged', refreshMenu);

					// The bell of new notifications takes room
					this.addListener('simpleNotificationChanged', refreshMenu);

					// The buttons of the host were folded or unfolded
					this.addListener('simpleEmbedMenuChanged', refreshMenu);

					// A switch back from Fusion or Classic, whose resizes unfold the
					// buttons of the host and skip the steps of the top bar
					this.addListener('currentThemeChanged', refreshMenu);
					refreshMenu();
				}

				if (value != 'simple')
				{
					footer.appendChild(zoomInElt);
				}

				if (urlParams['embedInline'] == '1')
				{
					footer.appendChild(fullscreenElt);

					var inlineFullscreenChanged = mxUtils.bind(this, function()
					{
						fullscreenElt.style.backgroundImage = 'url(' + ((!Editor.inlineFullscreen) ?
							Editor.fullscreenImage : Editor.fullscreenExitImage) + ')';
						this.inlineSizeChanged();
						this.editor.graph.refresh();
						this.fitWindows();
					});

					this.addListener('editInlineStart', mxUtils.bind(this, function()
					{
						fullscreenElt.style.backgroundImage = 'url(' + ((!Editor.inlineFullscreen) ?
							Editor.fullscreenImage : Editor.fullscreenExitImage) + ')';
					}));
					
					this.addListener('inlineFullscreenChanged', inlineFullscreenChanged);
					footer.appendChild(exitElt);
				}

				if (value == 'simple')
				{
					this.sketchFooterMenuElt.style.cssText = 'position:relative;gap:6px;' +
						'flex-shrink:0;flex-grow:0.5;';
					this.sketchMainMenuElt.appendChild(this.sketchFooterMenuElt);
				}
				else
				{
					this.container.appendChild(this.sketchFooterMenuElt);
				}
			}
		}
		else
		{
			editorUiCreateFooterMenuForTheme.apply(this, arguments);
		}
	};

	/**
	 * Creates Select and the Hand tool of the top bar of the simple theme
	 * (simpleSelectElt, simpleHandElt) for the tools of the given picker, which
	 * start with them from simpleHandToolMinWidth, like the pair of the tool
	 * pill of Fusion (the driver, 17 November 2026): a click on the Hand tool
	 * turns it on (EditorUi.setPanMode, which replaces Read-only in Simple;
	 * Classic, Sketch and Minimal keep View > Read-only), a click on Select
	 * turns it off and ends drawing, and H turns it on and off. Select is
	 * pressed while neither the Hand tool nor a tool of Draw is on, the Hand
	 * tool while it is on and the given Freehand of the picker while Draw
	 * draws (geActiveItem like Format, aria-pressed). The other tools of the
	 * picker leave the Hand tool before their own handlers run, as their
	 * letters do (they insert shapes, which the Hand tool does not drop), but
	 * not while they are disabled, and Escape from the picker leaves it
	 * (isHandToolEscapeSource). Returns the Hand tool.
	 */
	EditorUi.prototype.createSimpleHandButton = function(picker, freehandElt)
	{
		var graph = this.editor.graph;
		var selectElt = this.createToolbarButton(Editor.thinCursorImage,
			mxResources.get('select'), mxUtils.bind(this, function()
		{
			this.setPanMode(false);
			this.stopDrawing();
		}));
		var elt = this.createToolbarButton(Editor.thinHandImage, null, mxUtils.bind(this, function()
		{
			this.setPanMode(true);
		}));
		this.simpleSelectElt = selectElt;
		this.simpleHandElt = elt;

		var update = mxUtils.bind(this, function()
		{
			var drawing = this.isDrawing();
			var pan = this.isPanMode();
			var tie = this.tieTool != null && this.tieTool.isActive();
			var states = [[selectElt, !pan && !drawing], [elt, pan && !drawing],
				[freehandElt, drawing && !tie]];

			for (var i = 0; i < states.length; i++)
			{
				if (states[i][0] != null)
				{
					states[i][0].classList.toggle('geActiveItem', states[i][1]);
					states[i][0].setAttribute('aria-pressed', (states[i][1]) ? 'true' : 'false');
				}
			}
		});

		this.addListener('panModeChanged', update);
		graph.addListener('freehandStateChanged', update);
		graph.addListener('polygonStateChanged', update);
		graph.addListener('tieToolStateChanged', update);
		update();

		// A disabled tool (eg. in a read-only diagram) does nothing, so it
		// keeps the Hand tool
		var isDisabled = function(source)
		{
			while (source != null && source != picker)
			{
				if (source.nodeType == mxConstants.NODETYPE_ELEMENT && (source.classList.contains('mxDisabled') ||
					source.hasAttribute('disabled')))
				{
					return true;
				}

				source = source.parentNode;
			}

			return false;
		};

		var leaveHand = mxUtils.bind(this, function(evt)
		{
			var source = mxEvent.getSource(evt);

			if (this.isPanMode() && source != null && source != picker && !elt.contains(source) &&
				!isDisabled(source) && (evt.type != 'keydown' || evt.keyCode == 13 || evt.keyCode == 32))
			{
				this.setPanMode(false);
			}
		});

		picker.addEventListener((mxClient.IS_POINTER) ? 'pointerdown' : 'mousedown', leaveHand, true);
		picker.addEventListener('touchstart', leaveHand, true);
		picker.addEventListener('keydown', leaveHand, true);

		return elt;
	};

	/**
	 * Escape also leaves the Hand tool from the tools of the top bar of the
	 * simple theme (createSimpleHandButton).
	 */
	var editorUiIsHandToolEscapeSource = EditorUi.prototype.isHandToolEscapeSource;

	EditorUi.prototype.isHandToolEscapeSource = function(source)
	{
		return editorUiIsHandToolEscapeSource.apply(this, arguments) ||
			(source != null && this.simpleHandElt != null && this.sketchPickerMenuElt != null &&
			mxUtils.isAncestorNode(this.sketchPickerMenuElt, source));
	};

	/**
	 * Returns true if the top bar of the simple theme shows the Hand tool
	 * (createSimpleHandButton), which it does from simpleHandToolMinWidth: the
	 * View menu has Hand Tool only where it does not (the driver, 22 November
	 * 2026).
	 */
	EditorUi.prototype.isSimpleHandButtonShown = function()
	{
		return this.simpleHandElt != null && document.body != null &&
			document.body.contains(this.simpleHandElt) &&
			this.simpleHandElt.offsetWidth > 0;
	};

	/**
	 *
	 */
	var editorUiCreatePickerMenuForTheme = EditorUi.prototype.createPickerMenuForTheme;

	EditorUi.prototype.createPickerMenuForTheme = function(value)
	{
		if (value == 'simple' || value == 'sketch')
		{
			if (this.sketchPickerMenuElt == null)
			{
				var graph = this.editor.graph;
				this.sketchPickerMenuElt = document.createElement('div');
				this.sketchPickerMenuElt.className = 'geToolbarContainer';

				if (value == 'sketch')
				{
					this.sketchPickerMenuElt.classList.add('geVerticalToolbar');
				}

				var picker = this.sketchPickerMenuElt;

				var foldImg = document.createElement('a');
				foldImg.className = 'geButton';
				foldImg.style.height = '18px';
				foldImg.style.opacity = '0.4';
				foldImg.style.backgroundImage = 'url(' + Editor.expandMoreImage + ')';
				foldImg.setAttribute('title', mxResources.get('collapseExpand'));
				
				var freehandElt = this.createMenuItem('insertFreehand', (value == 'simple') ?
					Editor.thinGestureImage : Editor.freehandImage, true);
				var insertElt = this.createMenu('insert', (value == 'simple') ?
					Editor.thinAddCircleImage : Editor.addBoxImage);
				var shapesElt = insertElt.cloneNode(true);
				shapesElt.style.backgroundImage = 'url(' + ((value == 'simple') ?
					Editor.thinShapesImage : Editor.shapesImage) + ')';
				shapesElt.setAttribute('title', mxResources.get('shapes'));
				this.addShapePicker(shapesElt, value == 'simple');
				var handElt = (value == 'simple') ? this.createSimpleHandButton(picker, freehandElt) : null;
				var collapsed = false;
				var tw = 28;
				var th = 28;
	
				var initPicker = mxUtils.bind(this, function(force)
				{
					if (force || (document.body != null &&
						document.body.contains(picker)))
					{
						// The titles of the language (this runs on languageChanged)
						insertElt.setAttribute('title', mxResources.get('insert'));
						shapesElt.setAttribute('title', mxResources.get('shapes'));
						foldImg.setAttribute('title', mxResources.get('collapseExpand'));

						if (!graph.isEnabled() && urlParams['embedInline'] != '1')
						{
							freehandElt.classList.add('mxDisabled');
							insertElt.classList.add('mxDisabled');
							shapesElt.classList.add('mxDisabled');
						}
						else
						{
							freehandElt.classList.remove('mxDisabled');
							insertElt.classList.remove('mxDisabled');
							shapesElt.classList.remove('mxDisabled');
						}

						function addKey(elt, key, kx, ky)
						{
							if (elt != null)
							{
								kx = (kx != null) ? kx : 30;
								ky = (ky != null) ? ky : 26;

								if (elt.querySelector('.geShortcutKey') == null)
								{
									var div = document.createElement('div');
									div.className = 'geShortcutKey';
									mxUtils.write(div, key);
									elt.appendChild(div);
								}
							}
						};
						
						function addElt(elt, title, cursor, key, kx, ky)
						{
							if (title != null)
							{
								elt.setAttribute('title', title);
							}
							
							// Shapes in the toolbar are controls for Tab (see Sidebar.addClickHandler)
							elt.setAttribute('tabindex', '0');
							picker.appendChild(elt);

							if (value != 'simple' && key != null)
							{
								addKey(elt, key, kx, ky);
							}

							if (!graph.isEnabled() && urlParams['embedInline'] != '1')
							{
								elt.classList.add('mxDisabled');
							}
							
							return elt;
						};

						// Hand Tool of the View menu follows the Hand button (see below)
						var handShown = handElt != null && handElt.parentNode == picker;
						picker.innerText = '';
						
						if (!collapsed)
						{
							var iw = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
							var fo = this.getSimpleFileExtraWidth();
							var eo = this.getSimpleToolbarOffset(false);
							var ts = this.getSimpleFileShift('tools', fo);

							// Thinner previews in simple toolbar
							if (value == 'simple')
							{
								this.sidebar.graph.cellRenderer.minSvgStrokeWidth = 0.9;

								// Select and the Hand tool first, as in the tool pill of Fusion
								if (handElt != null && this.isHandToolEnabled() &&
									iw >= this.simpleHandToolMinWidth + eo + ts)
								{
									var handAction = this.actions.get('handTool');
									this.simpleSelectElt.setAttribute('title', mxResources.get('select'));
									handElt.setAttribute('title', mxResources.get('handTool') +
										((handAction.shortcut != null) ? ' (' + handAction.shortcut + ')' : ''));
									picker.appendChild(this.simpleSelectElt);
									picker.appendChild(handElt);
								}
							}

							if (value != 'simple' || iw >= 780 + eo + ts)
							{
								var textElt = this.sidebar.createVertexTemplate(graph.appendFontSize(Editor.defaultTextStyle,
									graph.vertexFontSize), 60, 30, 'Text', mxResources.get('text') + ' (A)', true, false,
									null, value != 'simple', null, tw, th, value == 'simple' ?
										Editor.thinTextImage : null, true);
								addElt(textElt, mxResources.get('text') + ' (A)', null, 'A', 32);
							}

							var boxElt = this.sidebar.createVertexTemplate('rounded=0;whiteSpace=wrap;html=1;', 160, 80, '',
								mxResources.get('rectangle') + ' (D)', true, false, null, value != 'simple', null, tw, th,
								(value == 'simple') ? Editor.thinRectangleImage : null)

							if (value == 'simple')
							{
								if (iw >= 800 + eo + ts)
								{
									addElt(boxElt, mxResources.get('rectangle') + ' (D)', null, 'D');
								}

								if (iw >= 540 + eo + this.getSimpleFileShift('shapes', fo))
								{
									this.sketchPickerMenuElt.appendChild(shapesElt);
								}

								if (iw >= 680 + eo)
								{
									addElt(freehandElt, mxResources.get('freehand') + ' (X)', null, 'X');
								}
							}
							else
							{
								addElt(this.sidebar.createVertexTemplate(Editor.defaultNoteStyle, 160, 160, '',
									mxResources.get('note') + ' (S)', true, false, null, true, null, tw, th),
									mxResources.get('note') + ' (S)', null, 'S');
								addElt(boxElt, mxResources.get('rectangle') + ' (D)', null, 'D');
								addElt(this.sidebar.createVertexTemplate('ellipse;whiteSpace=wrap;html=1;shapeInside=1;', 160, 100, '',
									mxResources.get('ellipse') + ' (F)', true, false, null, true, null, tw, th),
									mxResources.get('ellipse') + ' (F)', null, 'F');

								var edgeStyle = 'edgeStyle=none;orthogonalLoop=1;jettySize=auto;html=1;';
								var cell = new mxCell('', new mxGeometry(0, 0, this.editor.graph.defaultEdgeLength + 20, 0), edgeStyle);
								cell.geometry.setTerminalPoint(new mxPoint(0, 0), true);
								cell.geometry.setTerminalPoint(new mxPoint(cell.geometry.width, 0), false);
								cell.geometry.points = [];
								cell.geometry.relative = true;
								cell.edge = true;
								
								addElt(this.sidebar.createEdgeTemplateFromCells([cell],
									cell.geometry.width, cell.geometry.height, mxResources.get('line') + ' (C)',
									true, null, value != 'simple', false, null, tw, th),
									mxResources.get('line') + ' (C)', null, 'C');
								
								cell = cell.clone();
								cell.style = edgeStyle + 'shape=flexArrow;rounded=1;startSize=8;endSize=8;';
								cell.geometry.width = this.editor.graph.defaultEdgeLength + 20;
								cell.geometry.setTerminalPoint(new mxPoint(0, 20), true);
								cell.geometry.setTerminalPoint(new mxPoint(cell.geometry.width, 20), false);
								
								addElt(freehandElt, mxResources.get('freehand') + ' (X)', null, 'X');
								this.sketchPickerMenuElt.appendChild(shapesElt);
							}
							
							if (value != 'simple' || iw > 320 + this.getSimpleFileShift('insert', fo))
							{
								this.sketchPickerMenuElt.appendChild(insertElt);
							}
						}

						if (value != 'simple' && urlParams['embedInline'] != '1')
						{
							picker.appendChild(foldImg);
						}

						this.sidebar.graph.cellRenderer.minSvgStrokeWidth = this.sidebar.minThumbStrokeWidth;

						// An open View menu has Hand Tool for the top bar of before
						// (isSimpleHandButtonShown, eg. opened before the resize or in
						// the 200 ms until this runs): it closes where the Hand button
						// came or went (Codex review of #1503)
						if (handElt != null && (handElt.parentNode == picker) != handShown &&
							this.currentMenu != null && this.simpleViewMenuElt != null &&
							this.currentMenuElt == this.simpleViewMenuElt)
						{
							this.hideCurrentMenu();
						}
					}
				});
				
				mxEvent.addListener(foldImg, 'click', mxUtils.bind(this, function()
				{
					var focused = document.activeElement == foldImg;

					if (collapsed)
					{
						picker.classList.remove('geCollapsedToolbar');
						foldImg.style.backgroundImage = 'url(' + Editor.expandMoreImage + ')';
						collapsed = false;
						initPicker();
					}
					else
					{				
						picker.innerText = '';
						picker.appendChild(foldImg);
						picker.classList.add('geCollapsedToolbar');
						foldImg.style.backgroundImage = 'url(' + Editor.expandLessImage + ')';
						collapsed = true;
					}

					// Keeps the focus for the keyboard as the toolbar is created again
					if (focused)
					{
						foldImg.focus();
					}
				}));

				this.initKeyboardButton(foldImg);
				
				var lastWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
				var currentThread = null;
				
				mxEvent.addListener(window, 'resize', function()
				{
					var currentWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;

					if (currentWidth != lastWidth)
					{
						lastWidth = currentWidth;

						if (currentThread != null)
						{
							window.clearTimeout(currentThread);
						}

						currentThread = window.setTimeout(function()
						{
							currentThread = null;
							initPicker();
						}, 200);
					}
				});

				this.editor.addListener('fileLoaded', initPicker);
				this.addListener('sketchModeChanged', initPicker);
				this.addListener('currentThemeChanged', initPicker);
				this.addListener('languageChanged', initPicker);
				this.addListener('lockedChanged', initPicker);
				this.addListener('simpleNotificationChanged', initPicker);

				initPicker(true);

				if (value == 'simple')
				{
					this.sketchPickerMenuElt.style.cssText = 'position:relative;white-space:nowrap;user-select:none;' +
						'display:flex;align-items:center;justify-content:flex-end;flex-grow:1;gap:6px;' +
						'flex-shrink:0;';
					this.sketchMainMenuElt.appendChild(this.sketchPickerMenuElt);
				}
				else
				{
					this.container.appendChild(this.sketchPickerMenuElt);
				}

				// Disables built-in pan and zoom on touch devices
				if (mxClient.IS_POINTER)
				{
					this.sketchPickerMenuElt.style.touchAction = 'none';
				}
			}
		}
		else
		{
			editorUiCreatePickerMenuForTheme.apply(this, arguments);
		}
	};

	/**
	 * Tab order of the simple and sketch themes: the toolbars at the top and
	 * left, the shapes, the diagram, the format panel and the page tabs or the
	 * zoom at the bottom (see EditorUi.getTabStops).
	 */
	var editorUiGetTabRegions = EditorUi.prototype.getTabRegions;

	EditorUi.prototype.getTabRegions = function()
	{
		var sidebar = (this.sidebar != null) ? this.sidebar.container : null;
		var graph = this.editor.graph;

		if (Editor.currentTheme == 'simple')
		{
			return [this.sketchMainMenuElt, this.sketchFooterMenuElt, this.sketchPickerMenuElt,
				this.sketchMenubarElt, sidebar, graph.container, this.getFormatRegion(),
				this.tabContainer];
		}
		else if (Editor.currentTheme == 'sketch')
		{
			return [this.sketchMainMenuElt, this.sketchMenubarElt, this.sketchPickerMenuElt,
				sidebar, graph.container, this.getFormatRegion(), this.tabContainer,
				this.sketchFooterMenuElt];
		}
		else
		{
			return editorUiGetTabRegions.apply(this, arguments);
		}
	};

	/**
	 *
	 */
	var editorUiCreateMenubarForTheme = EditorUi.prototype.createMenubarForTheme;

	EditorUi.prototype.createMenubarForTheme = function(value)
	{
		if (value == 'simple' || value == 'sketch')
		{
			if (this.sketchMenubarElt == null)
			{
				this.sketchMenubarElt = document.createElement('div');
				this.sketchMenubarElt.className = 'geToolbarContainer';

				var css = 'display:flex;white-space:nowrap;user-select:none;justify-content:flex-end;' +
					'align-items:center;flex-wrap:nowrap;gap:6px;';

				if (value == 'simple')
				{
					// Embeds: the buttons of the host, … and Format keep their
					// width and the title of the host shrinks with an ellipsis
					// where the bar has no room for it (grapheditor.css), so
					// that no button leaves the window. Its smallest width is
					// that of its buttons (no min-width:0), as the title has no
					// minimum in its container
					this.sketchMenubarElt.style.cssText = 'position:relative;' +
						((urlParams['embed'] != '1') ? 'flex-grow:0.5;overflow:visible;flex-shrink:0;' :
						'flex-shrink:1;') + css;

					// Opens the omnibox, the search for actions and settings
					if (this.omniboxElt == null && this.actions.get('searchActions').isEnabled())
					{
						this.omniboxElt = this.createMenuItem('searchActions', Editor.thinSearchImage, true);
						this.omniboxElt.style.backgroundSize = '24px';
						this.omniboxElt.style.flexShrink = '0';
					}

					if (this.commentElt == null)
					{
						this.commentElt = this.createMenuItem('comments', Editor.thinCommentImage, true);
						this.commentElt.style.backgroundSize = '24px';

						// Shows the number of unresolved comments of the file
						this.addCommentsBadge(this.commentElt);

						// Dragging the button to the canvas starts a comment
						// on the shape or point it is dropped on
						this.installCommentDragSource(this.commentElt);
					}

					if (this.shareElt == null && urlParams['embed'] != '1' &&
						this.getServiceName() == 'draw.io')
					{
						// Share with its label on wide windows, else an icon, offline the
						// network icon (see updateSimpleShareButton)
						this.shareElt = this.createMenu('share', Editor.thinUserAddImage);
						this.shareElt.style.backgroundSize = '24px';
						this.shareElt.style.flexShrink = '0';

						if (!this.isStandaloneApp())
						{
							var networkListener = mxUtils.bind(this, function()
							{
								this.updateSimpleShareButton();
							});

							this.addListener('realtimeStateChanged', networkListener);
							this.editor.addListener('statusChanged', networkListener);
							mxEvent.addListener(window, 'offline', networkListener);
							mxEvent.addListener(window, 'online', networkListener);
						}

						this.updateSimpleShareButton();
					}
				}
				else
				{
					this.sketchMenubarElt.style.cssText = 'position:absolute;right:12px;top:10px;height:44px;' +
						'border-radius:4px;overflow:hidden;user-select:none;max-width:calc(100% - 170px);' +
						'box-sizing:border-box;justify-content:flex-end;z-index:1;padding:7px 12px;' + css;
					this.container.appendChild(this.sketchMenubarElt);
				}

				if (urlParams['embedInline'] != '1')
				{
					// Moves menu away if picker overlaps
					var refreshMenu = mxUtils.bind(this, function()
					{
						if (Editor.currentTheme == 'sketch')
						{
							var overflow = (this.sketchPickerMenuElt.offsetTop -
								this.sketchPickerMenuElt.offsetHeight / 2 < 58);
							this.sketchMainMenuElt.style.left = (overflow) ? '70px' : '10px';
							this.sketchMenubarElt.style.maxWidth = (overflow) ? 
								'calc(100% - 230px)' : 'calc(100% - 170px)';
						}
						else if (Editor.currentTheme == 'simple')
						{
							// The buttons of the host fold into a menu before the steps
							this.updateSimpleEmbedMenu();
							var iw = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
							var eo = this.getSimpleToolbarOffset(false);
							var off = this.getSimpleToolbarOffset(true);
							var fo = this.getSimpleFileExtraWidth();

							if (this.simpleFileElt != null)
							{
								this.simpleFileElt.style.display = (iw < this.simpleFileButtonMinWidth + eo +
									this.getSimpleFileShift('file', fo)) ? 'none' : '';
							}

							if (this.omniboxElt != null)
							{
								this.omniboxElt.style.display = (iw > 480 + eo + this.getSimpleFileShift('search', fo)) ? '' : 'none';
							}

							if (this.commentElt != null)
							{
								this.commentElt.style.display = (iw > 560 + eo + this.getSimpleFileShift('comments', fo) &&
									this.commentsSupported()) ? '' : 'none';
							}

							if (this.shareElt != null)
							{
								this.shareElt.style.display = (iw > 360 + off) ? '' : 'none';
								this.updateSimpleShareButton();
							}

							if (this.overflowMenuElt != null)
							{
								this.overflowMenuElt.style.display = (iw < 750 + eo +
									this.getSimpleFileShift('tools', fo)) ? '' : 'none';
							}
						}
					});

					refreshMenu();
					mxEvent.addListener(window, 'resize', refreshMenu);
					this.editor.addListener('fileLoaded', refreshMenu);

					// The label of File and Share have the width of the language
					this.addListener('languageChanged', refreshMenu);
					this.addListener('simpleNotificationChanged', refreshMenu);
					this.addListener('simpleEmbedMenuChanged', refreshMenu);

					// A switch back from Fusion or Classic: the menu bar exists, so
					// it was not built again, and the buttons of the host are in it
					// again (they were not at the first refresh above), but folded as
					// the resizes of the other theme left them (updateSimpleEmbedMenu)
					this.addListener('currentThemeChanged', refreshMenu);
				}

				if (urlParams['embed'] != '1' && this.getServiceName() != 'atlassian')
				{
					this.installStatusMinimizer(this.sketchMenubarElt);
				}

				this.dependsOnLanguage(mxUtils.bind(this, function()
				{
					if (this.omniboxElt != null)
					{
						// Names the key / first, which the input of the omnibox
						// shows (Omnibox.keyHint), then the shortcut of the action
						var action = this.actions.get('searchActions');
						this.omniboxElt.setAttribute('title', action.getTitle() + ' (' +
							mxResources.get('shortcutOr', ['/', action.shortcut], '{1}, {2}') + ')');
					}

					if (this.commentElt != null)
					{
						this.commentElt.setAttribute('title', mxResources.get('comments'));
					}

					if (this.shareElt != null)
					{
						this.updateSimpleShareButton();
					}

					if (this.mainMenuElt != null)
					{
						this.mainMenuElt.setAttribute('title', mxResources.get('diagram'));
					}

					if (this.formatElt != null)
					{
						this.formatElt.setAttribute('title', mxResources.get('format'));
					}
				}));
			}

			if (value == 'simple')
			{
				if (this.omniboxElt != null)
				{
					this.sketchMenubarElt.appendChild(this.omniboxElt);
				}

				if (this.commentElt != null)
				{
					this.sketchMenubarElt.appendChild(this.commentElt);
				}

				if (this.buttonContainer != null)
				{
					this.sketchMenubarElt.appendChild(this.buttonContainer);
				}
				
				if (this.shareElt != null)
				{
					this.sketchMenubarElt.appendChild(this.shareElt);
				}
				
				if (this.mainMenuElt == null)
				{
					this.mainMenuElt = this.createMenu('diagram', Editor.thinMenuImage);
				}

				this.sketchMenubarElt.appendChild(this.mainMenuElt);

				if (this.formatElt == null)
				{
					this.formatElt = this.createMenuItem('format', Editor.thinFormatImage, true);
					this.formatElt.style.marginLeft = (urlParams['embed'] != '1') ? 'auto' : '0';

					var updateFormatElt = mxUtils.bind(this, function()
					{
						if (this.formatWidth > 0)
						{
							this.formatElt.classList.add('geActiveItem');
						}
						else
						{
							this.formatElt.classList.remove('geActiveItem');
						}
					});

					this.addListener('formatWidthChanged', updateFormatElt);
					updateFormatElt();
				}

				this.sketchMenubarElt.appendChild(this.formatElt);
			}

			if (this.statusContainer != null)
			{
				this.statusContainer.style.flexGrow = '1';
				this.statusContainer.style.flexShrink = '1';
				this.statusContainer.style.marginTop = '0px';

				if (value != 'simple')
				{
					this.sketchMenubarElt.appendChild(this.statusContainer);
				}
				else
				{
					this.statusContainer.style.justifyContent = 'center';
					this.statusContainer.style.minWidth = '0';
					this.statusContainer.style.overflow = 'hidden';

					if (urlParams['embed'] != '1')
					{
						this.statusContainer.style.width = '22%';
					}
				}
			}
			
			if (value == 'simple')
			{
				if (this.overflowMenuElt == null)
				{
					this.overflowMenuElt = this.createMenu('dynamicAppearance', Editor.thinDoubleArrowRightImage);
					this.overflowMenuElt.style.backgroundSize = '24px';
					this.overflowMenuElt.style.display = 'inline-block';
					this.overflowMenuElt.style.flexShrink = '0';
					this.overflowMenuElt.style.display = 'none';
					this.overflowMenuElt.removeAttribute('title');
				}

				this.sketchMenubarElt.appendChild(this.overflowMenuElt);
				this.sketchMainMenuElt.appendChild(this.statusContainer);
				this.sketchMainMenuElt.appendChild(this.sketchMenubarElt);
			}
			else if (this.buttonContainer != null)
			{
				this.sketchMenubarElt.appendChild(this.buttonContainer);
			}
		}
		else
		{
			editorUiCreateMenubarForTheme.apply(this, arguments);
		}
	};

	/**
	 * Fires simpleNotificationChanged where the room of the bell of new
	 * notifications in the top bar of the simple theme changed (it came or
	 * went, getSimpleNotificationWidth), so that the bar shows its buttons at
	 * the widths with or without it without a resize.
	 */
	if (typeof App !== 'undefined')
	{
		var wrapNotification = function(name)
		{
			var funct = App.prototype[name];

			if (funct != null)
			{
				App.prototype[name] = function()
				{
					var w = this.getSimpleNotificationWidth();
					var result = funct.apply(this, arguments);

					if (w != this.getSimpleNotificationWidth())
					{
						this.fireEvent(new mxEventObject('simpleNotificationChanged'));
					}

					return result;
				};
			}
		};

		wrapNotification('updateButtonContainer');
		wrapNotification('showNotification');
	}

	/**
	 * Measures the buttons of the host in the top bar of the simple theme
	 * again after they were made (with the load of the host and for each
	 * language), folds them into a menu where the window has no room for them
	 * (updateSimpleEmbedMenu) and fires simpleEmbedMenuChanged where that
	 * changed, so that the steps of the bar count the menu without a resize.
	 */
	var editorUiAddEmbedButtons = EditorUi.prototype.addEmbedButtons;

	EditorUi.prototype.addEmbedButtons = function()
	{
		editorUiAddEmbedButtons.apply(this, arguments);

		// Runs after the buttons of the language (see addEmbedButtons)
		this.dependsOnLanguage(mxUtils.bind(this, function()
		{
			if (this.updateSimpleEmbedMenu(true))
			{
				this.fireEvent(new mxEventObject('simpleEmbedMenuChanged'));
			}
		}));
	};

})();
