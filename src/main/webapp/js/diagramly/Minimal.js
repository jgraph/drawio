/**
 * Copyright (c) 2020-2025, JGraph Holdings Ltd
 * Copyright (c) 2020-2025, draw.io AG
 */
/**
 * Installing theme.
 */
Editor.themes.push('min');

/**
 * Testing dockable windows.
 */
EditorUi.windowed = urlParams['windows'] != '0';

/**
 * Code for the minimal UI theme.
 */
EditorUi.initMinimalTheme = function()
{
	// Disabled in lightbox and chromeless mode
	if (urlParams['lightbox'] == '1' || urlParams['chrome'] == '0' || typeof window.Format === 'undefined' || typeof window.Menus === 'undefined')
	{
		window.uiTheme = null;
		
		return;
	}
	
	var iw = 0;

	try
	{
		iw = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
	}
	catch (e)
	{
		// ignore
	}

	Menus.prototype.autoPopup = false;

	function toggleFormat(ui, visible)
	{
		if (EditorUi.windowed)
		{
			var graph = ui.editor.graph;
			graph.popupMenuHandler.hideMenu();
			
			if (ui.formatWindow == null)
			{
				var x = Math.max(10, ui.diagramContainer.clientWidth - 248);
				var y = 60;
				var h = Math.min(600, graph.container.clientHeight - 10);

				ui.formatWindow = new WrapperWindow(ui, '', x, y, 240, h,
					function(container)
				{
					container.className = 'geSidebarContainer geFormatContainer';
					var format = ui.createFormat(container);
					format.init();
				});

				ui.dependsOnLanguage(mxUtils.bind(this, function()
				{
					ui.formatWindow.window.setTitle(mxResources.get('format'));
				}));

				ui.formatWindow.window.addListener(mxEvent.SHOW, mxUtils.bind(this, function()
				{
					ui.formatWindow.window.fit();
				}));
				
				ui.formatWindow.window.minimumSize = new mxRectangle(0, 0, 240, 80);
			}
			else
			{
				ui.formatWindow.window.setVisible((visible != null) ?
					visible : !ui.formatWindow.window.isVisible());
			}
		}
		else
		{
			if (ui.formatElt == null)
			{
				ui.formatElt = ui.createSidebarContainer();
				var format = ui.createFormat(ui.formatElt);
				format.init();
				ui.formatElt.style.border = 'none';
				ui.formatElt.style.width = '240px';
				ui.formatElt.style.borderLeftWidth = '1px';
				ui.formatElt.style.borderLeftStyle = 'solid';
				ui.formatElt.style.right = '0px';
			}

			var wrapper = ui.diagramContainer.parentNode;

			if (ui.formatElt.parentNode != null)
			{
				ui.formatElt.parentNode.removeChild(ui.formatElt);
				wrapper.style.right = '0px';
			}
			else
			{
				wrapper.parentNode.appendChild(ui.formatElt);
				wrapper.style.right = ui.formatElt.style.width;
			}
		}
	};

	function toggleShapes(ui, visible)
	{
		if (EditorUi.windowed)
		{
			var graph = ui.editor.graph;
			graph.popupMenuHandler.hideMenu();
	
			if (ui.sidebarWindow == null)
			{
				var w = Math.min(graph.container.clientWidth - 10, 218);
				var h = Math.min(graph.container.clientHeight - 40, 650);
				
				ui.sidebarWindow = new WrapperWindow(ui, '', 10, 56, w - 6, h - 6,
					function(container)
				{
					ui.createShapesPanel(container);
				});

				ui.dependsOnLanguage(mxUtils.bind(this, function()
				{
					ui.sidebarWindow.window.setTitle(mxResources.get('shapes'));
				}));
				
				ui.sidebarWindow.window.addListener(mxEvent.SHOW, mxUtils.bind(this, function()
				{
					ui.sidebarWindow.window.fit();
				}));
	
				ui.sidebarWindow.window.minimumSize = new mxRectangle(0, 0, 90, 90);
				ui.sidebarWindow.window.setVisible(true);

				if (isLocalStorage)
				{
					ui.getLocalData('sidebar', function(value)
					{
						ui.sidebar.showEntries(value, null, true);
					});
				}
				
				ui.restoreLibraries();
			}
			else
			{
				ui.sidebarWindow.window.setVisible((visible != null) ?
					visible : !ui.sidebarWindow.window.isVisible());
			}
		}
		else
		{
			if (ui.sidebarElt == null)
			{
				ui.sidebarElt = ui.createSidebarContainer();
				ui.createShapesPanel(ui.sidebarElt);
				ui.sidebarElt.style.border = 'none';
				ui.sidebarElt.style.width = '210px';
				ui.sidebarElt.style.borderRight = '1px solid gray';
			}

			var wrapper = ui.diagramContainer.parentNode;

			if (ui.sidebarElt.parentNode != null)
			{
				ui.sidebarElt.parentNode.removeChild(ui.sidebarElt);
				wrapper.style.left = '0px';
			}
			else
			{
				wrapper.parentNode.appendChild(ui.sidebarElt);
				wrapper.style.left = ui.sidebarElt.style.width;
			}
		}
	};
	
    // Changes colors for some UI elements
	var fill = '#29b6f2';
	mxConstraintHandler.prototype.pointImage = Graph.createSvgImage(5, 5,
		'<path d="m 0 0 L 5 5 M 0 5 L 5 0" stroke-width="2" style="stroke-opacity:0.4" stroke="#ffffff"/>' +
		'<path d="m 0 0 L 5 5 M 0 5 L 5 0" stroke="' + fill + '"/>');
	mxOutline.prototype.sizerImage = null;
	
	mxConstants.VERTEX_SELECTION_COLOR = '#C0C0C0';
	mxConstants.EDGE_SELECTION_COLOR = '#C0C0C0';
	mxConstants.CONNECT_HANDLE_FILLCOLOR = '#cee7ff';
	mxConstants.DEFAULT_VALID_COLOR = fill;
	mxConstants.GUIDE_COLOR = '#C0C0C0';
	mxConstants.OUTLINE_COLOR = '#29b6f2';
	mxConstants.OUTLINE_HANDLE_FILLCOLOR = '#29b6f2';
	mxConstants.OUTLINE_HANDLE_STROKECOLOR = '#fff';

	Graph.prototype.svgShadowColor = '#3D4574';
	Graph.prototype.svgShadowOpacity = '0.4';
	Graph.prototype.svgShadowSize = '0.6';
	Graph.prototype.svgShadowBlur = '1.2';
	
	mxRubberband.prototype.defaultOpacity = 50;
	HoverIcons.prototype.inactiveOpacity = 25;
	EditorUi.prototype.closableScratchpad = false;
	Graph.prototype.editAfterInsert = !mxClient.IS_IOS && !mxClient.IS_ANDROID;
	
	/**
     * Sets the XML node for the current diagram.
     */
    Editor.prototype.isChromelessView = function()
    {
    	return false;
    };

    /**
     * Sets the XML node for the current diagram.
     */
    Graph.prototype.isLightboxView = function()
    {
    	return false;
    };
	
    // Overridden to update save menu state
	/**
	 * Updates action states depending on the selection.
	 */
	var editorUiUpdateActionStates = EditorUi.prototype.updateActionStates;
	
	EditorUi.prototype.updateActionStates = function()
	{
		editorUiUpdateActionStates.apply(this, arguments);

		this.menus.get('save').setEnabled(this.getCurrentFile() != null || urlParams['embed'] == '1');
	};

    // Hides keyboard shortcuts in menus
    var menusAddShortcut = Menus.prototype.addShortcut; 
    
    Menus.prototype.addShortcut = function(item, action)
    {
        if (action.shortcut != null && iw < 900 && !mxClient.IS_IOS)
        {
            var td = item.firstChild.nextSibling;
            td.setAttribute('title', action.shortcut);
        }
        else
        {
        	menusAddShortcut.apply(this, arguments);
        }
    };
	
    // Overridden to toggle window instead
    EditorUi.prototype.toggleFormatPanel = function(visible)
    {
        if (this.formatWindow != null)
        {
        	this.formatWindow.window.setVisible((visible != null) ?
        		visible : !this.formatWindow.window.isVisible());
        }
        else
        {
        	toggleFormat(this);
        }
    };
	
    EditorUi.prototype.isFormatPanelVisible = function()
    {
		return (this.formatWindow != null && this.formatWindow.window.isVisible()) ||
			(this.formatWindow == null && this.formatWidth > 0);
    };
	
	// Initializes the user interface
	var editorUiDestroy = EditorUi.prototype.destroy;
	EditorUi.prototype.destroy = function()
	{
		this.destroyWindows();
		editorUiDestroy.apply(this, arguments);
	};
	
	// Hides windows when a file is closed
	var editorUiSetGraphEnabled = EditorUi.prototype.setGraphEnabled;
	
	EditorUi.prototype.setGraphEnabled = function(enabled)
	{
		editorUiSetGraphEnabled.apply(this, arguments);
		
		if (!enabled)
		{
			if (this.sidebarWindow != null)
            {
            	this.sidebarWindow.window.setVisible(false);
            }

            if (this.formatWindow != null)
            {
            	this.formatWindow.window.setVisible(false);
            }
		}
		else
		{
			var iw = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;

			if (iw >= 1000 && this.sidebarWindow != null && this.sidebarEnabled)
            {
                this.sidebarWindow.window.setVisible(true);
            }
            
            if (this.formatWindow != null && iw >= 1000)
            {
            	this.formatWindow.window.setVisible(true);
            }
		}
	};
	
    // Disables centering of graph after iframe resize
	EditorUi.prototype.chromelessWindowResize = function() {};
	
	// Installs the format toolbar
	EditorUi.prototype.installFormatToolbar = function(container)
	{
		var graph = this.editor.graph;
		var div = document.createElement('div');
		
		div.style.cssText = 'position:absolute;top:10px;z-index:1;border-radius:4px;' +
			'box-shadow:0px 0px 3px 1px #d1d1d1;padding:6px;white-space:nowrap;background-color:#fff;' +
			'transform:translate(-50%, 0);left:50%;';
		
		graph.getSelectionModel().addListener(mxEvent.CHANGE, mxUtils.bind(this, function(sender, evt)
		{
			if (graph.getSelectionCount() > 0)
			{
				container.appendChild(div);
				div.innerHTML = 'Selected: ' + graph.getSelectionCount();
			}
			else if (div.parentNode != null)
			{
				div.parentNode.removeChild(div);
			}
		}));
	};

	var formatWindowInitialized = false;

	EditorUi.prototype.initFormatWindow = function()
	{
		if (!formatWindowInitialized && this.formatWindow != null)
		{
			formatWindowInitialized = true;

			var toggleMinimized = this.formatWindow.window.toggleMinimized;
			var w = 240;
			
			this.formatWindow.window.toggleMinimized = function()
			{
				toggleMinimized.apply(this, arguments);
				
				if (this.minimized)
				{
					w = parseInt(this.div.style.width);
					this.div.style.width = '140px';
					this.table.style.width = '140px';
					this.div.style.left = (parseInt(this.div.style.left) + w - 140) + 'px';
				}
				else
				{
					this.div.style.width = w + 'px';
					this.table.style.width = this.div.style.width;
					this.div.style.left = (Math.max(0, parseInt(this.div.style.left) - w + 140)) + 'px';
				}
				
				this.fit();
			};
			
			mxEvent.addListener(this.formatWindow.window.title, 'dblclick', mxUtils.bind(this, function(evt)
			{
				if (mxEvent.getSource(evt) == this.formatWindow.window.title)
				{
					this.formatWindow.window.toggleMinimized();
				}
			}));
		}
	};
	
	// Initializes the user interface
	var editorUiInit = EditorUi.prototype.init;

	EditorUi.prototype.init = function()
	{
		editorUiInit.apply(this, arguments);

		var node = (mxUtils.isAncestorNode(document.body, this.container)) ?
			this.container : this.editor.graph.container;
		
		if (node != null)
		{
			node.classList.add('geSimple');
			node.classList.add('geMinimal');
			node.classList.remove('geClassic');
		}
		
		this.sidebar = this.createSidebar(this.sidebarContainer);
		
		if (urlParams['sidebar'] != '0' && (iw >= 1000 || urlParams['clibs'] != null || urlParams['libs'] != null ||
			urlParams['search-shapes'] != null))
		{
			toggleShapes(this, true);
			
			if (this.sidebar != null && urlParams['search-shapes'] != null && this.sidebar.searchShapes != null)
			{
				this.sidebar.searchShapes(urlParams['search-shapes']);
				this.sidebar.showEntries('search');
			}
		}
		
		if (this.formatEnabled && EditorUi.windowed && iw >= 1000)
		{
			toggleFormat(this, true);
			this.formatWindow.window.setVisible(true);
		}
        
		// Needed for creating elements in Format panel
		var ui = this;
		var graph = ui.editor.graph;
		ui.toolbar = this.createToolbar(ui.createDiv('geToolbar'));
		var menubar = document.createElement('div');
		menubar.className = 'geMenubarContainer';
		var menuObj = new Menubar(ui, menubar);

		function addMenu(id, small, img)
		{
			var menu = ui.menus.get(id);

			var elt = menuObj.addMenu(mxResources.get(id), mxUtils.bind(this, function(popupMenu, parent)
			{
				menu.funct.apply(this, arguments);
				ui.menus.appendPluginMenuItems(id, popupMenu, parent);
			}));
            
			elt.className = 'geButton';
			elt.setAttribute('title', mxResources.get(id));
			ui.menus.menuCreated(menu, elt, 'geButton');
            
			if (img != null)
			{
				elt.style.backgroundImage = 'url(' + img + ')';
				elt.innerText = '';
			}

			return elt;
		};
        
		function addMenuItem(label, fn, small, tooltip, action, img)
		{
			var btn = document.createElement('a');
			btn.className = 'geButton';
			menubar.appendChild(btn);
            
			if (img != null)
			{
				btn.style.backgroundImage = 'url(' + img + ')';
			}
			else
			{
				mxUtils.write(btn, label);
			}
            
            mxEvent.addListener(btn, 'click', function(evt)
            {
            	if (btn.getAttribute('disabled') != 'disabled')
            	{
            		fn(evt);
            	}
            	
                mxEvent.consume(evt);
            });

			mxEvent.preventDefault(btn);
            
            if (tooltip != null)
            {
                btn.setAttribute('title', tooltip);
            }

            if (action != null)
            {
                function updateState()
                {
                    if (action.isEnabled())
                    {
                        btn.removeAttribute('disabled');
                    }
                    else
                    {
                        btn.setAttribute('disabled', 'disabled');
                    }
                };
                
                action.addListener('stateChanged', updateState);
				graph.addListener('enabledChanged', updateState);
                updateState();
            }
           
            return btn;
        };
        
        function createGroup(btns, op, container)
        {
            var btnGroup = document.createElement('div');
            btnGroup.className = 'geButtonGroup';

            for (var i = 0; i < btns.length; i++)
            {
            	if (btns[i] != null)
            	{
	                btnGroup.appendChild(btns[i]);
            	}
            }
            
			menubar.appendChild(btnGroup);
            
            return btnGroup;
        };
		
		function updateTitle()
		{
			var file = ui.getCurrentFile();
			
			if (file != null && file.getTitle() != null)
			{
				var mode = file.getMode();
				
				if (mode == 'google')
				{
					mode = 'googleDrive';
				}
				else if (mode == 'github')
				{
					mode = 'gitHub';
				}
				else if (mode == 'gitlab')
				{
					mode = 'gitLab';
				}
				else if (mode == 'onedrive')
				{
					mode = 'oneDrive';
				}
				
				mode = mxResources.get(mode);
				menubar.setAttribute('title', file.getTitle() + ((mode != null) ? ' (' + mode + ')' : ''));
			}
			else
			{
				menubar.removeAttribute('title');
			}
		};
		
		// Hides popup menus
		var uiHideCurrentMenu = ui.hideCurrentMenu;

		ui.hideCurrentMenu = function()
		{
			uiHideCurrentMenu.apply(this, arguments);

			if (this.editor != null)
			{
				this.editor.graph.popupMenuHandler.hideMenu();
			}
		};

		// Connects the status bar to the editor status
		var uiDescriptorChanged = ui.descriptorChanged;
		
		ui.descriptorChanged = function()
		{
			uiDescriptorChanged.apply(this, arguments);
			updateTitle();
		};
		
		ui.setStatusText(ui.editor.getStatus());
		menubar.appendChild(ui.statusContainer);

		ui.buttonContainer = this.createButtonContainer();
		menubar.appendChild(ui.buttonContainer);
		
		// Container for the user element
		ui.menubarContainer = ui.buttonContainer;
		ui.tabContainer = this.createTabContainer();

		// Overrides tab container to append zoom input
		var zoomElt = this.createZoomInput(true);

		var updateTabContainer = ui.updateTabContainer;

		ui.updateTabContainer = function()
		{
			updateTabContainer.apply(this, arguments);
			ui.tabContainer.appendChild(zoomElt);
		};

		var insertImage = Editor.addBoxImage;
		
		// Hides hover icons if freehand is active
		if (ui.hoverIcons != null)
		{
			var hoverIconsUpdate = ui.hoverIcons.update;
			
			ui.hoverIcons.update = function()
			{
				if (!graph.freehand.isDrawing())
				{
					hoverIconsUpdate.apply(this, arguments);
				}
			};
		}
	
		// Removes sketch style from freehand shapes
		if (graph.freehand != null)
		{
			var freehandCreateStyle = graph.freehand.createStyle;
			
			graph.freehand.createStyle = function(stencil)
			{
				return freehandCreateStyle.apply(this, arguments) + 'sketch=0;';
			};
		}
		
		// Connects the status bar to the editor status
		ui.editor.addListener('statusChanged', mxUtils.bind(this, function()
		{
			ui.setStatusText(ui.editor.getStatus());
		}));
		
		ui.setStatusText(ui.editor.getStatus());

		var fitFunction = function(evt)
		{
			if (mxEvent.isAltDown(evt))
			{
				ui.hideCurrentMenu();
				ui.actions.get('customZoom').funct();
				mxEvent.consume(evt);
			}
			else
			{
				ui.hideCurrentMenu();
				ui.actions.get('smartFit').funct();
				mxEvent.consume(evt);
			}
		};

		var zoomInAction = ui.actions.get('zoomIn');
		var zoomOutAction = ui.actions.get('zoomOut');
		var resetViewAction = ui.actions.get('resetView');
		var undoAction = ui.actions.get('undo');
		var redoAction = ui.actions.get('redo');
		var undoElt = addMenuItem('', undoAction.funct, null, '', undoAction, Editor.undoImage);
		var redoElt = addMenuItem('', redoAction.funct, null, '', redoAction, Editor.redoImage);
		var fitElt = addMenuItem('', fitFunction, true, '', resetViewAction, Editor.zoomFitImage);
		
		ui.actions.get('toggleShapes').funct = mxUtils.bind(this, function()
		{
			toggleShapes(ui, null);
		});
		
		ui.container.appendChild(ui.tabContainer);
		ui.container.appendChild(menubar);
		ui.updateTabContainer();

		if (this.formatEnabled && !EditorUi.windowed && iw >= 1000)
		{
			toggleFormat(this, true);
		}
		
        function refreshMenu()
        {
			iw = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
			
			// Measure embed button width before clearing menubar
			var embedOffset = 0;

			if (urlParams['embed'] == '1' && ui.buttonContainer != null)
			{
				embedOffset = ui.buttonContainer.offsetWidth || 300;
			}

			menubar.innerHTML = '';
			var small = iw < 1000 + embedOffset;
			var appElt = addMenu('diagram', null, (small) ? Editor.menuImage : null);

			createGroup([appElt, addMenuItem(mxResources.get('shapes'), ui.actions.get('toggleShapes').funct, null,
				mxResources.get('shapes'), ui.actions.get('image'), (small) ? Editor.shapesImage : null),
				addMenuItem(mxResources.get('format'), ui.actions.get('format').funct, null,
				mxResources.get('format') + ' (' + ui.actions.get('format').shortcut + ')', ui.actions.get('image'),
				(small) ? Editor.formatImage : null)]);

			var insertElt = addMenu('insert', true, (small) ? insertImage : null);
			createGroup([insertElt, addMenuItem(mxResources.get('delete'), ui.actions.get('delete').funct,
				null, mxResources.get('delete'), ui.actions.get('delete'),
				(small) ? Editor.trashImage : null)]);

			if (!graph.isEnabled())
			{
				insertElt.setAttribute('disabled', 'disabled');
			}

			undoElt.setAttribute('title', mxResources.get('undo') +
				' (' + undoAction.shortcut + ')');
			redoElt.setAttribute('title', mxResources.get('redo') +
				' (' + redoAction.shortcut + ')');
			fitElt.setAttribute('title', mxResources.get('fit') +
				' (' + Editor.ctrlKey + '+H)');

			if (iw >= 411 + embedOffset)
			{
				createGroup([undoElt, redoElt]);

				if (iw >= 520 + embedOffset)
				{
					createGroup([fitElt,
						(iw >= 640 + embedOffset) ? addMenuItem('', zoomInAction.funct, true,
							mxResources.get('zoomIn') + ' (' + Editor.ctrlKey + ' +)',
							zoomInAction, Editor.zoomInImage) : null,
						(iw >= 640 + embedOffset) ? addMenuItem('', zoomOutAction.funct, true,
							mxResources.get('zoomOut') + ' (' + Editor.ctrlKey + ' -)',
							zoomOutAction, Editor.zoomOutImage) : null]);
				}
			}

			menubar.appendChild(ui.statusContainer);
			menubar.appendChild(ui.buttonContainer);
        };
        
        refreshMenu();
		ui.addListener('lockedChanged', refreshMenu);
		ui.addListener('languageChanged', refreshMenu);
		ui.editor.graph.addListener('enabledChanged', refreshMenu);
        
        mxEvent.addListener(window, 'resize', function()
		{
        	refreshMenu();
        	
            if (ui.sidebarWindow != null)
            {
                ui.sidebarWindow.window.fit();
            }
            
            if (ui.formatWindow != null)
            {
            	ui.formatWindow.window.fit();
            }

            if (ui.actions.outlineWindow != null)
            {
            	ui.actions.outlineWindow.window.fit();
            }

            if (ui.actions.layersWindow != null)
            {
            	ui.actions.layersWindow.window.fit();
            }

            if (ui.menus.chatWindow != null)
            {
            	ui.menus.chatWindow.window.fit();
            }

            if (ui.menus.tagsWindow != null)
            {
            	ui.menus.tagsWindow.window.fit();
            }

            if (ui.menus.findWindow != null)
            {
            	ui.menus.findWindow.window.fit();
            }

            if (ui.menus.findReplaceWindow != null)
            {
            	ui.menus.findReplaceWindow.window.fit();
            }
		});
	};
};

(function()
{
	var initialized = false;
	
	// ChromeApp has async local storage
	if (uiTheme == 'min' && !initialized && !mxClient.IS_CHROMEAPP)
	{
		EditorUi.initMinimalTheme();
		initialized = true;
	}
	
	var uiInitTheme = EditorUi.initTheme;
	
	// For async startup like chromeos
	EditorUi.initTheme = function()
	{
		uiInitTheme.apply(this, arguments);
		
		if (uiTheme == 'min' && !initialized)
		{
			this.initMinimalTheme();
			initialized = true;
		}
	};
})();
