/**
 * Copyright (c) 2026, JGraph Holdings Ltd
 * Copyright (c) 2026, draw.io AG
 */
/**
 * The panel host of Simple: Layers, Tags and the Text Outline open as panels
 * in the place of the Format panel (batch 14 of the plan of 13 November 2026
 * for Classic and Simple, "Panel-Ablage, Ebenen und Tags", with the Text
 * Outline of batch 15; the driver, 20 November 2026), after the model of
 * Arrange my diagram (LayoutPanel in LayoutPicker.js), and the width of the
 * right panel can be dragged and is kept (H33 of batch 19).
 *
 * Theme-neutral (app.min.js): the windows of before (LayersWindow, TagsWindow
 * and TextOutlineWindow) are built as before and their whole element moves
 * into the host, as Fusion moves them into its panel (adoptSimpleHostWindow
 * in SimpleWindows.js), so ui.actions.layersWindow, ui.menus.tagsWindow and
 * ui.actions.textOutlineWindow keep their interface for plugins. The head
 * has the title (with the shortcut in its tooltip, H19), Back to the Format
 * panel when it was shown (Escape goes one level back, H24) and Close; Tags
 * without tags show a note (H8, the Text Outline has its own), and phones
 * show the panel as a sheet at the bottom.
 *
 * Each panel has a row in Editor.featureDefaults (layersPanel, tagsPanel,
 * textOutlinePanel; panelResize for the width), on in Simple in the web app
 * and off in Classic, Sketch, Minimal and Atlas unless the URL or the
 * configuration switches them on (Sketch and Minimal have the Format panel
 * in a window and keep the windows). Fusion has its own panels
 * (SimplePanels.js, fixed in the rows) and is not changed.
 */
(function()
{
	/**
	 * The panels of the host: the feature of Editor.featureDefaults, the key
	 * of the title, the action that toggles the window and the window. A
	 * panel with isEmpty shows the note of the key empty while it is empty.
	 */
	EditorUi.sidePanels = {
		layers: {feature: 'layersPanel', title: 'layers', action: 'layers',
			getWindow: function(ui)
			{
				return (ui.actions != null) ? ui.actions.layersWindow : null;
			}},
		tags: {feature: 'tagsPanel', title: 'tags', action: 'tags',
			getWindow: function(ui)
			{
				return (ui.menus != null) ? ui.menus.tagsWindow : null;
			},
			// The tag cloud of Graph.createTagsDialog has no rows without tags
			isEmpty: function(ui, wnd)
			{
				var cloud = (wnd.window.content != null) ? wnd.window.content.firstChild : null;

				return cloud != null && cloud.firstChild == null;
			},
			empty: 'noTagsInDiagram'},
		textOutline: {feature: 'textOutlinePanel', title: 'textOutline', action: 'textOutline',
			getWindow: function(ui)
			{
				return (ui.actions != null) ? ui.actions.textOutlineWindow : null;
			}}
	};

	/**
	 * The constructors of the windows of the panels.
	 */
	EditorUi.sidePanelWindows = {LayersWindow: 'layers', TagsWindow: 'tags',
		TextOutlineWindow: 'textOutline'};

	/**
	 * Least width of the editor in which the panels are in the place of the
	 * Format panel; narrower editors (phones) show them as a sheet at the
	 * bottom, as Arrange my diagram is a dialog there
	 * (EditorUi.layoutPanelMinWidth).
	 */
	EditorUi.sidePanelSheetWidth = 600;

	/**
	 * Least and largest width of the right panel in px: the default width of
	 * the Format panel (div.geFormatContainer in grapheditor.css) up to
	 * panelMaxWidth, and at most panelMaxRatio of the editor.
	 */
	EditorUi.panelMinWidth = 240;

	EditorUi.panelMaxWidth = 600;

	EditorUi.panelMaxRatio = 0.5;

	/**
	 * Steps in px of the arrow keys on the divider of the right panel.
	 */
	EditorUi.panelResizeStep = 16;

	/**
	 * Returns true if the given panel of EditorUi.sidePanels opens in the
	 * host: its feature is on, the editor has the Format panel as its last
	 * column (not the window of Sketch and Minimal, not the viewer) and the
	 * theme is not Fusion, which has its own panels.
	 */
	EditorUi.prototype.isSidePanelEnabled = function(id)
	{
		var cfg = (Object.prototype.hasOwnProperty.call(EditorUi.sidePanels, id)) ?
			EditorUi.sidePanels[id] : null;

		return cfg != null && Editor.getFeatureTheme() != 'fusion' &&
			this.editor != null && !this.editor.isChromelessView() &&
			this.formatContainer != null && this.container != null &&
			this.formatContainer.parentNode == this.container &&
			Editor.isFeatureEnabled(cfg.feature);
	};

	/**
	 * Returns true if the panels are a sheet at the bottom (phones).
	 */
	EditorUi.prototype.isSidePanelSheet = function()
	{
		return this.container != null && this.container.clientWidth < EditorUi.sidePanelSheetWidth;
	};

	/**
	 * Builds the windows of the panels as before and moves them into the host
	 * if their panel is enabled (see adoptSidePanelWindow). The prototypes and
	 * the static members stay those of the windows, so plugins and instanceof
	 * see no difference. Fusion wraps them again with its own hosts
	 * (EditorUi.wrapSimpleWindow), where isSidePanelEnabled is false.
	 *
	 * Called once at the start of the first editor (EditorUi.prototype.init
	 * below), not when this file loads, so the wrapper is the outermost one
	 * and wraps the constructors that the files after this one install. A
	 * constructor that builds its window in a new layout without calling the
	 * one before (the Text Outline of TextOutlineLayout.js, after this file
	 * in app.min.js) would else skip the adoption and open as a window.
	 */
	EditorUi.installSidePanelWindows = function()
	{
		if (EditorUi.sidePanelWindowsInstalled)
		{
			return;
		}

		EditorUi.sidePanelWindowsInstalled = true;

		for (var name in EditorUi.sidePanelWindows)
		{
			(function(name, id)
			{
				var base = window[name];

				if (typeof base !== 'function')
				{
					return;
				}

				var wrapper = function(editorUi)
				{
					base.apply(this, arguments);

					if (editorUi != null && this.window != null && this.window.div != null &&
						typeof editorUi.isSidePanelEnabled === 'function' &&
						editorUi.isSidePanelEnabled(id))
					{
						editorUi.adoptSidePanelWindow(id, this);
					}
				};

				wrapper.prototype = base.prototype;

				for (var key in base)
				{
					if (Object.prototype.hasOwnProperty.call(base, key))
					{
						wrapper[key] = base[key];
					}
				}

				window[name] = wrapper;
			})(name, EditorUi.sidePanelWindows[name]);
		}
	};

	/**
	 * Makes the given window (with its mxWindow in wnd.window) the panel of
	 * the given id: it keeps its element and its listeners, loses its place,
	 * size and title bar and is shown and hidden in the host. Its element
	 * stays in the document while it is hidden, as mxWindow.destroy removes
	 * it from its parent.
	 */
	EditorUi.prototype.adoptSidePanelWindow = function(id, wnd)
	{
		var ui = this;
		var win = wnd.window;
		var div = win.div;

		win.sidePanel = id;
		div.classList.add('geSidePanelWindow');

		// The host is the region named by the title
		div.removeAttribute('role');
		div.removeAttribute('aria-label');
		div.style.left = '';
		div.style.top = '';
		div.style.width = '';
		div.style.height = '';
		div.style.zIndex = '';
		div.style.display = 'none';
		win.table.style.width = '';
		win.table.style.height = '';
		win.contentWrapper.style.height = '';

		if (div.parentNode != document.body)
		{
			document.body.appendChild(div);
		}

		win.isVisible = function()
		{
			return ui.sidePanel != null && ui.sidePanel.wnd == wnd;
		};

		win.show = function()
		{
			ui.showSidePanel(id, wnd);
		};

		win.hide = function()
		{
			if (ui.sidePanel != null && ui.sidePanel.wnd == wnd)
			{
				ui.hideSidePanel();
			}
		};

		var noop = function() {};
		win.activate = noop;
		win.fit = noop;
		win.setLocation = noop;
		win.setSize = noop;

		var destroy = win.destroy;

		win.destroy = function()
		{
			if (ui.sidePanel != null && ui.sidePanel.wnd == wnd)
			{
				ui.removeSidePanel();
			}

			destroy.apply(this, arguments);
		};
	};

	/**
	 * Shows the window of the given panel in the host in the place of the
	 * Format panel (or as a sheet on phones). Another panel and Arrange my
	 * diagram close, and so does the window of Tidy up and Style my diagram,
	 * which is in the same place (see showLayoutPanel).
	 */
	EditorUi.prototype.showSidePanel = function(id, wnd)
	{
		var cfg = EditorUi.sidePanels[id];
		var win = wnd.window;
		var previous = null;

		// The panel before is removed now and hears of it (hide) once this
		// one is in its place, so a listener of hide that opens a panel (eg. a
		// plugin) replaces this one and leaves no panel behind
		if (this.sidePanel != null)
		{
			if (this.sidePanel.wnd == wnd)
			{
				return;
			}

			previous = this.removeSidePanel();
		}

		if (this.layoutPanel != null && !this.layoutPanel.hosted &&
			typeof this.hideLayoutPanel === 'function')
		{
			this.hideLayoutPanel();
		}

		if (this.tidyWindow != null && typeof this.tidyWindow.destroy === 'function')
		{
			this.tidyWindow.destroy();
		}

		var ui = this;
		var graph = this.editor.graph;
		var panel = {id: id, wnd: wnd, back: this.isFormatPanelVisible(),
			formatDisplay: this.formatContainer.style.display};

		var container = document.createElement('div');
		container.className = 'geSidePanel';
		container.setAttribute('role', 'region');
		panel.container = container;

		var header = document.createElement('div');
		header.className = 'geSidePanelHeader';
		container.appendChild(header);
		panel.header = header;

		var title = document.createElement('div');
		title.className = 'geSidePanelTitle';
		title.setAttribute('role', 'heading');
		title.setAttribute('aria-level', '2');
		title.id = 'geSidePanelTitle' + EditorUi.sidePanelCount++;
		container.setAttribute('aria-labelledby', title.id);
		header.appendChild(title);
		panel.title = title;

		// Close also hides the Format panel under a panel that came from it
		panel.closeButton = this.createSidePanelButton('geSidePanelClose', '×', function()
		{
			var back = panel.back;
			ui.hideSidePanel(true);

			if (back)
			{
				ui.toggleFormatPanel(false);
			}
		});
		header.appendChild(panel.closeButton);

		var body = document.createElement('div');
		body.className = 'geSidePanelBody';
		container.appendChild(body);
		panel.body = body;

		if (cfg.isEmpty != null)
		{
			panel.empty = document.createElement('div');
			panel.empty.className = 'geSidePanelEmpty';
			body.appendChild(panel.empty);
		}

		this.sidePanel = panel;
		this.updateSidePanelBack();

		// Escape goes one level back (to the Format panel if it was shown) and
		// the focus goes to the diagram, unless an element of the panel used it
		// (eg. renaming a layer)
		mxEvent.addListener(container, 'keydown', function(evt)
		{
			if (evt.keyCode == 27 /* Escape */ && !evt.defaultPrevented)
			{
				ui.hideSidePanel(true);
				mxEvent.consume(evt);
			}
		});

		// A tree (the Text Outline) uses Escape to give the focus to the
		// diagram, which the panel also does, so Escape in a tree goes back
		// before the tree consumes it. A field in the tree (eg. a label edited
		// in place in the Text Outline of TextOutlineLayout.js) keeps Escape,
		// which ends its edit
		panel.treeEscape = function(evt)
		{
			var target = evt.target;

			if (evt.keyCode == 27 /* Escape */ && !evt.defaultPrevented &&
				ui.sidePanel == panel && target != null && target.closest != null &&
				target.closest('[role="tree"]') != null && !ui.isTextInputElement(target))
			{
				ui.hideSidePanel(true);
				mxEvent.consume(evt);
			}
		};

		container.addEventListener('keydown', panel.treeEscape, true);

		// The note of an empty panel follows the diagram and the content of
		// the window, which also changes without an event (eg. Add of Tags
		// without a selection lists a new tag)
		if (panel.empty != null)
		{
			panel.update = function()
			{
				if (ui.sidePanel == panel)
				{
					ui.updateSidePanelEmpty();
				}
			};

			graph.getModel().addListener(mxEvent.CHANGE, panel.update);
			graph.getSelectionModel().addListener(mxEvent.CHANGE, panel.update);
			graph.addListener(mxEvent.REFRESH, panel.update);

			if (typeof MutationObserver !== 'undefined' && win.content != null)
			{
				panel.observer = new MutationObserver(panel.update);
				panel.observer.observe(win.content, {childList: true, subtree: true});
			}
		}

		body.appendChild(win.div);
		win.div.style.display = '';
		this.formatContainer.style.display = 'none';
		this.container.insertBefore(container, this.formatContainer.nextSibling);
		this.updateSidePanelSheet();
		graph.sizeDidChange();

		if (previous != null)
		{
			previous.wnd.window.fireEvent(new mxEventObject(mxEvent.HIDE));
		}

		// Unless a listener of hide opened another panel
		if (this.sidePanel == panel)
		{
			win.fireEvent(new mxEventObject(mxEvent.SHOW));
			this.updateSidePanelEmpty();
			this.updatePanelResizer();
		}
	};

	/**
	 * Counter for the IDs of the titles of the panels.
	 */
	EditorUi.sidePanelCount = 0;

	/**
	 * Creates a button of the head of the panels.
	 */
	EditorUi.prototype.createSidePanelButton = function(className, label, fn)
	{
		var btn = document.createElement('button');
		btn.setAttribute('type', 'button');
		btn.className = 'geSidePanelButton ' + className;
		mxUtils.write(btn, label);

		mxEvent.addListener(btn, 'click', function(evt)
		{
			fn();
			mxEvent.consume(evt);
		});

		return btn;
	};

	/**
	 * Updates the texts of the open panel: the title with the shortcut of its
	 * action in the tooltip (H19), Back and Close with Escape, the note of an
	 * empty panel (eg. in a new language, see rebuildPanels).
	 */
	EditorUi.prototype.updateSidePanelTexts = function()
	{
		var panel = this.sidePanel;

		if (panel != null)
		{
			var cfg = EditorUi.sidePanels[panel.id];
			var text = mxResources.get(cfg.title);
			var action = (this.actions != null) ? this.actions.get(cfg.action) : null;
			var esc = ' (Esc)';

			panel.title.textContent = text;
			panel.title.setAttribute('title', (action != null && action.shortcut != null) ?
				text + ' (' + action.shortcut + ')' : text);

			if (panel.backButton != null)
			{
				panel.backButton.setAttribute('aria-label', mxResources.get('back'));
				panel.backButton.setAttribute('title', mxResources.get('back') + esc);
				panel.closeButton.setAttribute('aria-label', mxResources.get('close'));
				panel.closeButton.setAttribute('title', mxResources.get('close'));
			}
			else
			{
				panel.closeButton.setAttribute('aria-label', mxResources.get('close'));
				panel.closeButton.setAttribute('title', mxResources.get('close') + esc);
			}

			if (panel.empty != null)
			{
				panel.empty.textContent = mxResources.get(cfg.empty);
			}
		}
	};

	/**
	 * Adds or removes Back in the head of the open panel: it goes back to the
	 * Format panel under the panel (one level back, H24), so it is there
	 * while the Format panel is shown under it (see toggleFormatPanel).
	 */
	EditorUi.prototype.updateSidePanelBack = function()
	{
		var panel = this.sidePanel;

		if (panel != null)
		{
			var ui = this;

			if (panel.back && panel.backButton == null)
			{
				panel.backButton = this.createSidePanelButton('geSidePanelBack', '‹', function()
				{
					ui.hideSidePanel(true);
				});
				panel.header.insertBefore(panel.backButton, panel.header.firstChild);
			}
			else if (!panel.back && panel.backButton != null)
			{
				// The focus on Back stays in the panel
				var focused = document.activeElement == panel.backButton;
				panel.backButton.parentNode.removeChild(panel.backButton);
				panel.backButton = null;

				if (focused)
				{
					panel.closeButton.focus();
				}
			}

			this.updateSidePanelTexts();
		}
	};

	/**
	 * Shows the note of the open panel while it is empty (H8).
	 */
	EditorUi.prototype.updateSidePanelEmpty = function()
	{
		var panel = this.sidePanel;

		if (panel != null && panel.empty != null)
		{
			var cfg = EditorUi.sidePanels[panel.id];
			panel.empty.style.display = (cfg.isEmpty(this, panel.wnd)) ? '' : 'none';
		}
	};

	/**
	 * Makes the open panel a sheet at the bottom in narrow editors (phones).
	 */
	EditorUi.prototype.updateSidePanelSheet = function()
	{
		if (this.sidePanel != null)
		{
			var sheet = this.isSidePanelSheet();

			if (sheet != this.sidePanel.container.classList.contains('geSidePanelSheet'))
			{
				this.sidePanel.container.classList.toggle('geSidePanelSheet', sheet);
				this.editor.graph.sizeDidChange();
			}
		}
	};

	/**
	 * Removes the open panel without events: its window goes back to the
	 * document, hidden, and the Format panel shows again as it was. Returns
	 * the removed panel.
	 */
	EditorUi.prototype.removeSidePanel = function()
	{
		var panel = this.sidePanel;

		if (panel != null)
		{
			var graph = this.editor.graph;
			var div = panel.wnd.window.div;
			this.sidePanel = null;

			if (panel.update != null)
			{
				graph.getModel().removeListener(panel.update);
				graph.getSelectionModel().removeListener(panel.update);
				graph.removeListener(panel.update);
			}

			if (panel.observer != null)
			{
				panel.observer.disconnect();
				panel.observer = null;
			}

			if (div != null)
			{
				div.style.display = 'none';
				document.body.appendChild(div);
			}

			mxEvent.release(panel.container);

			if (panel.treeEscape != null)
			{
				panel.container.removeEventListener('keydown', panel.treeEscape, true);
			}

			if (panel.container.parentNode != null)
			{
				panel.container.parentNode.removeChild(panel.container);
			}

			this.formatContainer.style.display = panel.formatDisplay || '';
			graph.sizeDidChange();
			this.updatePanelResizer();

			// The hidden Format panel skipped the changes of the selection (see
			// Format.immediateRefresh), so its controls would change the cells
			// that were selected before the panel opened
			if (this.format != null)
			{
				this.format.refresh();
			}
		}

		return panel;
	};

	/**
	 * Hides the open panel and fires hide on its window, so its action and
	 * the menus follow. The diagram gets the focus if focus is true, or if
	 * focus is null and the focus was in the panel (false leaves the focus to
	 * what comes next, eg. another panel).
	 */
	EditorUi.prototype.hideSidePanel = function(focus)
	{
		var panel = this.sidePanel;

		if (panel != null)
		{
			var focused = (focus != null) ? focus :
				panel.container.contains(document.activeElement);
			this.removeSidePanel();
			panel.wnd.window.fireEvent(new mxEventObject(mxEvent.HIDE));

			if (focused)
			{
				this.editor.graph.container.focus();
			}
		}
	};

	/**
	 * The open panel is the format region of the keyboard (see
	 * getTabRegions).
	 */
	var editorUiGetFormatRegion = EditorUi.prototype.getFormatRegion;

	EditorUi.prototype.getFormatRegion = function()
	{
		return (this.sidePanel != null) ? this.sidePanel.container :
			editorUiGetFormatRegion.apply(this, arguments);
	};

	/**
	 * Focusing the Format panel (Shift+Enter) focuses the open panel.
	 */
	var editorUiFocusFormatPanel = EditorUi.prototype.focusFormatPanel;

	EditorUi.prototype.focusFormatPanel = function()
	{
		if (this.sidePanel != null)
		{
			var wnd = this.sidePanel.wnd;

			if (typeof wnd.focus === 'function')
			{
				wnd.focus();
			}
			else
			{
				var elt = this.sidePanel.body.querySelector('button, input, select, ' +
					'textarea, a[href], [tabindex]:not([tabindex="-1"])');

				if (elt != null)
				{
					elt.focus();
				}
			}
		}
		else
		{
			editorUiFocusFormatPanel.apply(this, arguments);
		}
	};

	/**
	 * Showing or hiding the Format panel closes the panel in its place: the
	 * toggle shows the Format panel again (as with Arrange my diagram, see
	 * LayoutPicker.js). The toggles of the size of the window (see
	 * windowResized) keep the panel and show or hide the Format panel under
	 * it, where Back goes.
	 */
	var editorUiToggleFormatPanel = EditorUi.prototype.toggleFormatPanel;

	EditorUi.prototype.toggleFormatPanel = function(visible)
	{
		if (this.sidePanel != null)
		{
			if (this.sidePanelWindowResize && visible != null)
			{
				this.sidePanel.back = visible && this.format != null;
				this.updateSidePanelBack();
			}
			else
			{
				this.hideSidePanel();

				if (visible == null && this.formatWidth > 0)
				{
					return;
				}
			}
		}

		editorUiToggleFormatPanel.apply(this, arguments);
	};

	/**
	 * Marks the toggles of the Format panel of a change of the size of the
	 * window (Simple hides the Format panel below Editor.smallScreenWidth and
	 * shows it again above), which keep the open panel.
	 */
	var editorUiWindowResized = EditorUi.prototype.windowResized;

	EditorUi.prototype.windowResized = function()
	{
		var previous = this.sidePanelWindowResize;
		this.sidePanelWindowResize = true;

		try
		{
			return editorUiWindowResized.apply(this, arguments);
		}
		finally
		{
			this.sidePanelWindowResize = previous;
		}
	};

	/**
	 * Arrange my diagram in the place of the Format panel closes the open
	 * panel (and the other way, see showSidePanel).
	 */
	var editorUiShowLayoutPanel = EditorUi.prototype.showLayoutPanel;

	if (editorUiShowLayoutPanel != null)
	{
		EditorUi.prototype.showLayoutPanel = function()
		{
			// The panel hears of it (hide) once Arrange my diagram is in its
			// place (see showSidePanel)
			var previous = this.removeSidePanel();
			editorUiShowLayoutPanel.apply(this, arguments);
			this.updatePanelResizer();

			if (previous != null)
			{
				previous.wnd.window.fireEvent(new mxEventObject(mxEvent.HIDE));
			}
		};
	}

	var editorUiHideLayoutPanel = EditorUi.prototype.hideLayoutPanel;

	if (editorUiHideLayoutPanel != null)
	{
		EditorUi.prototype.hideLayoutPanel = function()
		{
			editorUiHideLayoutPanel.apply(this, arguments);
			this.updatePanelResizer();
		};
	}

	/**
	 * A new language updates the texts of the open panel.
	 */
	var editorUiRebuildPanels = EditorUi.prototype.rebuildPanels;

	EditorUi.prototype.rebuildPanels = function()
	{
		editorUiRebuildPanels.apply(this, arguments);
		this.updateSidePanelTexts();
		this.updatePanelResizer();
	};

	/**
	 * A change of the theme closes the open panel; the windows are destroyed
	 * (destroyWindows) and built again for the new theme.
	 */
	var editorUiSwitchTheme = EditorUi.prototype.switchTheme;

	if (editorUiSwitchTheme != null)
	{
		EditorUi.prototype.switchTheme = function(value)
		{
			if (this.sidePanel != null)
			{
				this.hideSidePanel(false);
			}

			editorUiSwitchTheme.apply(this, arguments);
		};
	}

	/**
	 * Windows in the host keep no place or size: their state in the settings
	 * stays the one of the window (as in Fusion, see SimpleWindows.js), and
	 * they are not opened at startup (restoreVisibleWindows), as the panel is
	 * opened by the user.
	 */
	var editorUiSaveWindowState = EditorUi.prototype.saveWindowState;

	if (editorUiSaveWindowState != null)
	{
		EditorUi.prototype.saveWindowState = function(name, wrapperWindow)
		{
			if (wrapperWindow == null || wrapperWindow.window == null ||
				wrapperWindow.window.sidePanel == null)
			{
				editorUiSaveWindowState.apply(this, arguments);
			}
		};
	}

	var editorUiRestoreWindowState = EditorUi.prototype.restoreWindowState;

	if (editorUiRestoreWindowState != null)
	{
		EditorUi.prototype.restoreWindowState = function(name, wrapperWindow)
		{
			return (wrapperWindow != null && wrapperWindow.window != null &&
				wrapperWindow.window.sidePanel != null) ? null :
				editorUiRestoreWindowState.apply(this, arguments);
		};
	}

	var editorUiRestoreVisibleWindows = EditorUi.prototype.restoreVisibleWindows;

	if (editorUiRestoreVisibleWindows != null)
	{
		EditorUi.prototype.restoreVisibleWindows = function()
		{
			var names = this.restoredWindows;

			if (names != null)
			{
				var own = Object.prototype.hasOwnProperty.call(this, 'restoredWindows');

				this.restoredWindows = names.filter(mxUtils.bind(this, function(name)
				{
					return !this.isSidePanelEnabled(name);
				}));

				try
				{
					editorUiRestoreVisibleWindows.apply(this, arguments);
				}
				finally
				{
					if (own)
					{
						this.restoredWindows = names;
					}
					else
					{
						delete this.restoredWindows;
					}
				}
			}
			else
			{
				editorUiRestoreVisibleWindows.apply(this, arguments);
			}
		};
	}

	/**
	 * A file with layers does not open the Layers panel when it is loaded, as
	 * it would take the place of the Format panel: the user opens the panels
	 * (as in Fusion, see showLayersDialog in SimpleWindows.js). An open panel
	 * stays open.
	 */
	var editorUiShowLayersDialog = EditorUi.prototype.showLayersDialog;

	if (editorUiShowLayersDialog != null)
	{
		EditorUi.prototype.showLayersDialog = function()
		{
			if (!this.isSidePanelEnabled('layers'))
			{
				editorUiShowLayersDialog.apply(this, arguments);
			}
		};
	}

	/**
	 * Returns true if the width of the right panel can be dragged: the feature
	 * panelResize where the Format panel is the last column of the editor
	 * (not in Fusion, which has its own panel).
	 */
	EditorUi.prototype.isPanelResizeEnabled = function()
	{
		return Editor.getFeatureTheme() != 'fusion' && this.editor != null &&
			!this.editor.isChromelessView() && this.formatContainer != null &&
			this.container != null && this.formatContainer.parentNode == this.container &&
			Editor.isFeatureEnabled('panelResize');
	};

	/**
	 * Returns the given width of the right panel in the bounds of the editor.
	 */
	EditorUi.prototype.clampPanelWidth = function(width)
	{
		var max = Math.min(EditorUi.panelMaxWidth, Math.floor(
			this.container.clientWidth * EditorUi.panelMaxRatio));

		return Math.round(Math.max(EditorUi.panelMinWidth, Math.min(max, width)));
	};

	/**
	 * Returns the width of the right panel: the stored width in the bounds of
	 * the editor, else the default.
	 */
	EditorUi.prototype.getPanelWidth = function()
	{
		var width = (typeof mxSettings !== 'undefined' && mxSettings.getPanelWidth != null) ?
			mxSettings.getPanelWidth() : null;

		return this.clampPanelWidth((width != null) ? width : EditorUi.panelMinWidth);
	};

	/**
	 * Sets the width of the right panel (the CSS variable --ge-panel-width of
	 * the editor, see .gePanelResizable in grapheditor.css). Null is the
	 * default width.
	 */
	EditorUi.prototype.setPanelWidth = function(width)
	{
		if (width == null || width == EditorUi.panelMinWidth)
		{
			this.container.style.removeProperty('--ge-panel-width');
		}
		else
		{
			this.container.style.setProperty('--ge-panel-width', width + 'px');
		}

		if (this.panelResizer != null)
		{
			var w = (width != null) ? width : EditorUi.panelMinWidth;
			this.panelResizer.setAttribute('aria-valuenow', w);
			this.panelResizer.setAttribute('aria-valuemin', EditorUi.panelMinWidth);
			this.panelResizer.setAttribute('aria-valuemax', this.clampPanelWidth(EditorUi.panelMaxWidth));
		}
	};

	/**
	 * Stores the given width of the right panel (null for the default).
	 */
	EditorUi.prototype.storePanelWidth = function(width)
	{
		if (typeof mxSettings !== 'undefined' && mxSettings.setPanelWidth != null)
		{
			mxSettings.setPanelWidth((width == null || width == EditorUi.panelMinWidth) ? null : width);
			mxSettings.save();
		}
	};

	/**
	 * Adds, shows or removes the divider on the left of the right panel that
	 * drags its width: shown with the Format panel and the panels of the host
	 * (not with Arrange my diagram, which has its own width, and not on
	 * phones, where the panels are a sheet).
	 */
	EditorUi.prototype.updatePanelResizer = function()
	{
		if (this.container == null)
		{
			return;
		}

		if (this.isPanelResizeEnabled())
		{
			this.container.classList.add('gePanelResizable');

			if (this.panelResizer == null)
			{
				this.panelResizer = this.createPanelResizer();
			}

			if (this.panelResizer.parentNode != this.container)
			{
				this.container.appendChild(this.panelResizer);
			}

			this.panelResizer.setAttribute('aria-label', mxResources.get('panelWidth'));
			this.panelResizer.setAttribute('title', mxResources.get('panelWidth'));
			this.setPanelWidth(this.getPanelWidth());

			var visible = (this.sidePanel != null) ? !this.isSidePanelSheet() :
				(this.layoutPanel == null && this.format != null && this.formatWidth > 0 &&
				this.formatContainer.style.display != 'none' && !this.isSidePanelSheet());
			this.panelResizer.style.display = (visible) ? '' : 'none';
		}
		else
		{
			this.container.classList.remove('gePanelResizable');
			this.container.style.removeProperty('--ge-panel-width');

			if (this.panelResizer != null && this.panelResizer.parentNode != null)
			{
				this.panelResizer.parentNode.removeChild(this.panelResizer);
			}

			// A drag of the detached divider ends here
			if (this.cancelPanelResize != null)
			{
				this.cancelPanelResize();
			}
		}
	};

	/**
	 * Creates the divider of the right panel: drag it with the mouse, touch or
	 * pen, move it with the arrow keys, Home and End, and double click it for
	 * the default width.
	 */
	EditorUi.prototype.createPanelResizer = function()
	{
		var ui = this;
		var graph = this.editor.graph;
		var elt = document.createElement('div');
		elt.className = 'gePanelResizer';
		elt.setAttribute('role', 'separator');
		elt.setAttribute('aria-orientation', 'vertical');
		elt.setAttribute('tabindex', '0');

		var frame = null;

		// The size of the diagram follows once per frame while dragging
		var sizeDidChange = function()
		{
			if (frame == null)
			{
				frame = window.requestAnimationFrame(function()
				{
					frame = null;
					graph.sizeDidChange();
				});
			}
		};

		var getWidth = function()
		{
			var panel = (ui.sidePanel != null) ? ui.sidePanel.container : ui.formatContainer;

			return (panel != null && panel.offsetWidth > 0) ? panel.offsetWidth : ui.getPanelWidth();
		};

		var apply = function(width, store)
		{
			width = ui.clampPanelWidth(width);
			ui.setPanelWidth(width);
			sizeDidChange();

			if (store)
			{
				ui.storePanelWidth(width);
				ui.fireEvent(new mxEventObject('panelWidthChanged'));
			}
		};

		var start = null;

		mxEvent.addListener(elt, 'pointerdown', function(evt)
		{
			if (evt.button == 0 || evt.pointerType != 'mouse')
			{
				start = {x: evt.clientX, w: getWidth(), id: evt.pointerId,
					before: ui.container.style.getPropertyValue('--ge-panel-width')};
				elt.classList.add('gePanelResizing');

				if (elt.setPointerCapture != null)
				{
					elt.setPointerCapture(evt.pointerId);
				}

				evt.preventDefault();
			}
		});

		// Ends a drag without storing its width (see updatePanelResizer)
		ui.cancelPanelResize = function()
		{
			if (start != null)
			{
				start = null;
				elt.classList.remove('gePanelResizing');
			}
		};

		// A pointer without buttons ended its drag where the divider did not
		// hear it (eg. while it was detached)
		mxEvent.addListener(elt, 'pointermove', function(evt)
		{
			if (start != null && evt.pointerId == start.id)
			{
				if (evt.buttons === 0)
				{
					ui.cancelPanelResize();
				}
				else
				{
					apply(start.w + start.x - evt.clientX, false);
				}
			}
		});

		// A drag that the system cancels returns to its width of before and
		// stores nothing
		var end = function(evt)
		{
			if (start != null && evt.pointerId == start.id)
			{
				var s = start;
				start = null;
				elt.classList.remove('gePanelResizing');

				if (evt.type == 'pointercancel')
				{
					apply((s.before != '') ? parseFloat(s.before) : null, false);
				}
				else
				{
					apply(s.w + s.x - evt.clientX, true);
				}
			}
		};

		mxEvent.addListener(elt, 'pointerup', end);
		mxEvent.addListener(elt, 'pointercancel', end);

		mxEvent.addListener(elt, 'dblclick', function(evt)
		{
			apply(EditorUi.panelMinWidth, true);
			mxEvent.consume(evt);
		});

		// Left widens the panel on the right, right narrows it; Escape goes one
		// level back as in the panel (see showSidePanel), whose sibling the
		// divider is
		mxEvent.addListener(elt, 'keydown', function(evt)
		{
			var width = null;

			if (evt.keyCode == 27 /* Escape */)
			{
				if (ui.sidePanel != null && !evt.defaultPrevented)
				{
					ui.hideSidePanel(true);
					mxEvent.consume(evt);
				}
			}
			else if (evt.keyCode == 37 /* Left */)
			{
				width = getWidth() + EditorUi.panelResizeStep;
			}
			else if (evt.keyCode == 39 /* Right */)
			{
				width = getWidth() - EditorUi.panelResizeStep;
			}
			else if (evt.keyCode == 36 /* Home */)
			{
				width = EditorUi.panelMinWidth;
			}
			else if (evt.keyCode == 35 /* End */)
			{
				width = EditorUi.panelMaxWidth;
			}

			if (width != null)
			{
				apply(width, true);
				mxEvent.consume(evt);
			}
		});

		return elt;
	};

	/**
	 * Wraps the windows of the panels (installSidePanelWindows) and adds the
	 * divider of the right panel after the start of the editor, which follows
	 * the theme, the size of the editor and the Format panel.
	 */
	var editorUiInit = EditorUi.prototype.init;

	EditorUi.prototype.init = function()
	{
		// The windows of the panels are wrapped before the start may build one
		EditorUi.installSidePanelWindows();
		editorUiInit.apply(this, arguments);

		var update = mxUtils.bind(this, function()
		{
			this.updateSidePanelSheet();
			this.updatePanelResizer();
		});

		this.addListener('formatWidthChanged', update);
		this.addListener('currentThemeChanged', update);
		this.panelHostResizeListener = update;
		mxEvent.addListener(window, 'resize', update);

		// The breakpoint of the sheet and the largest width follow the editor,
		// which an embedding page can resize without resizing the window
		if (typeof ResizeObserver !== 'undefined' && this.container != null)
		{
			this.panelHostObserver = new ResizeObserver(update);
			this.panelHostObserver.observe(this.container);
		}

		update();
	};

	var editorUiDestroy = EditorUi.prototype.destroy;

	EditorUi.prototype.destroy = function()
	{
		if (this.panelHostResizeListener != null)
		{
			mxEvent.removeListener(window, 'resize', this.panelHostResizeListener);
			this.panelHostResizeListener = null;
		}

		if (this.panelHostObserver != null)
		{
			this.panelHostObserver.disconnect();
			this.panelHostObserver = null;
		}

		this.removeSidePanel();
		editorUiDestroy.apply(this, arguments);
	};
})();
