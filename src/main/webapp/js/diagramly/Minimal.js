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
	
    var iw = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;

    try
    {
       var style = document.createElement('style')
       style.type = 'text/css';
       style.innerHTML = '* { -webkit-font-smoothing: antialiased; }' +
       	   'html body .mxWindow button.geBtn { font-size:12px !important; margin-left: 0;}' +
           'html body div.diagramContainer button, html body button.geBtn { font-size:14px; font-weight:700;border-radius: 5px; }' +
           'html body button.geBtn:active { opacity: 0.6; }' +
           '.geDialog input, .geToolbarContainer input, .mxWindow input {padding:2px !important;display:inline-block !important; }' +
           'div.geDialog { border-radius: 5px; }' +
           'html body div.geDialog button.geBigButton { color: #fff !important; }' +
           '.mxWindow button, .geDialog select, .mxWindow select { display:inline-block; }' +
           'html body .mxWindow .geColorBtn, html body .geDialog .geColorBtn { background: none; }' +
           'html body div.diagramContainer button, html body .mxWindow button, html body .geDialog button { min-width: 0px; border-radius: 5px; color: #353535 !important; border-color: rgb(216, 216, 216); }' +
           'div.diagramContainer button.geBtn, .mxWindow button.geBtn, .geDialog button.geBtn { min-width:72px; font-weight: 600; background: none; }' +
           'div.diagramContainer button.geBtn:hover, .mxWindow button.geBtn:hover, .geDialog button.geBtn:hover { box-shadow: none; border-color: rgb(216, 216, 216); }' +
           'div.diagramContainer button.gePrimaryBtn, .mxWindow button.gePrimaryBtn, .geDialog button.gePrimaryBtn, html body .gePrimaryBtn { background: #29b6f2; color: #fff !important; border: none; box-shadow: none; }' +
           'html body .gePrimaryBtn:hover { background: #29b6f2; border: none; box-shadow: inherit; }' +
           'html body button.gePrimaryBtn:hover { background: #29b6f2; border: none; }' +
           '.geBtn button { min-width:72px !important; }' +
           'div.geToolbarContainer a.geButton { margin:2px; padding: 0 2px 4px 2px; } ' +
           '.geDialog, .mxWindow td.mxWindowPane *, div.geSprite, td.mxWindowTitle, .geDiagramContainer { box-sizing:content-box; }' +
           '.mxWindow div button.geStyleButton { box-sizing: border-box; }' +
           'table.mxWindow td.mxWindowPane button.geColorBtn { padding:0px; box-sizing: border-box; }' +
           'td.mxWindowPane .geSidebarContainer button { padding:2px 0 2px 0; box-sizing: border-box; }' +
           // Make geItem look like a button
           'html body .geMenuItem { font-size:14px; text-decoration: none; font-weight: normal; padding: 6px 10px 6px 10px; border: none; border-radius: 5px; color: #353535; box-shadow: inset 0 0 0 1px rgba(0,0,0,.11), inset 0 -1px 0 0 rgba(0,0,0,.08), 0 1px 2px 0 rgba(0,0,0,.04); }' +
           'a.geMenuItem:active { opacity: 0.4; }' +
           // Styling for Minimal
           '.geToolbarContainer { background:#fff !important; }' +
           'div.mxWindow .geSidebarContainer .geTitle { background-color:#fdfdfd; }' +
           'div.mxWindow .geSidebarContainer .geTitle:hover { background-color:#fafafa; }' +
           'div.geSidebar { background-color: #fff !important;}' +
           'div.mxWindow td.mxWindowPane button { background-image: none; float: none; }' +
           'td.mxWindowTitle { height: 22px !important; background: none !important; font-size: 13px !important; text-align:center !important; border-bottom:1px solid lightgray; }' +
           'div.mxWindow, div.mxWindowTitle { background-image: none !important; background-color:#fff !important; }' +
           'div.mxWindow { border-radius:5px; box-shadow: 0px 0px 2px #C0C0C0 !important;}' +
           'div.mxWindow * { font-family: inherit !important; }' +
           // Minimal Style UI
           'html div.geVerticalHandle { position:absolute;bottom:0px;left:50%;cursor:row-resize;width:11px;height:11px;background:white;margin-bottom:-6px; margin-left:-6px; border: none; border-radius: 6px; box-shadow: inset 0 0 0 1px rgba(0,0,0,.11), inset 0 -1px 0 0 rgba(0,0,0,.08), 0 1px 2px 0 rgba(0,0,0,.04); }' +
           'html div.geInactivePage { background: rgb(249, 249, 249) !important; color:lightgray !important; } ' +
           'html div.geActivePage { background: white !important;color: #353535 !important; } ' +
           'html div.mxRubberband { border:1px solid; border-color: #29b6f2 !important; background:rgba(41,182,242,0.5) !important; } ' +
           'html body div.mxPopupMenu { border-radius:5px; border:1px solid #c0c0c0; padding:5px 0 5px 0; box-shadow: 0px 4px 17px -4px rgba(96,96,96,1); } ' +
           'html table.mxPopupMenu td.mxPopupMenuItem { color: #353535; font-size: 14px; padding-top: 4px; padding-bottom: 4px; }' +
           'html table.mxPopupMenu tr.mxPopupMenuItemHover { background-color: #29b6f2; }' +
           'html tr.mxPopupMenuItemHover td.mxPopupMenuItem, html tr.mxPopupMenuItemHover td.mxPopupMenuItem span { color: #fff !important; }' +
           'html tr.mxPopupMenuItem, html td.mxPopupMenuItem { transition-property: none !important; }' +
           'html table.mxPopupMenu hr { height: 2px; background-color: rgba(0,0,0,.07); margin: 5px 0; }';
       document.getElementsByTagName('head')[0].appendChild(style);
    }
    catch (e)
    {
       // ignore
    }
    
	/**
	 * 
	 */
	var WrapperWindow = function(editorUi, title, x, y, w, h, fn)
	{
	    var graph = editorUi.editor.graph;
	    
	    var div = document.createElement('div');
	    div.className = 'geSidebarContainer';
	    div.style.position = 'absolute';
	    div.style.width = '100%';
	    div.style.height = '100%';
	    div.style.border = '1px solid whiteSmoke';
	    div.style.overflowX = 'hidden';
	    div.style.overflowY = 'auto';
	    
	    fn(div);

	    this.window = new mxWindow(title, div, x, y, w, h, true, true);
	    this.window.destroyOnClose = false;
	    this.window.setMaximizable(false);
	    this.window.setResizable(true);
	    this.window.setClosable(true);
	    this.window.setVisible(true);
	    
	    this.window.setLocation = function(x, y)
	    {
	    	var iiw = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
	        var ih = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
	        
	        x = Math.max(0, Math.min(x, iiw - this.table.clientWidth));
	        y = Math.max(0, Math.min(y, ih - this.table.clientHeight - 48));

	        if (this.getX() != x || this.getY() != y)
	        {
	            mxWindow.prototype.setLocation.apply(this, arguments);
	        }
	    };
	};

	function toggleFormat(ui)
	{
		var graph = ui.editor.graph;
	    graph.popupMenuHandler.hideMenu();
	    
	    if (ui.formatWindow == null)
	    {
	        ui.formatWindow = new WrapperWindow(ui, mxResources.get('format'),
	           Math.max(20, ui.diagramContainer.clientWidth - 240 - 12), 56,
	           240, Math.min(550, graph.container.clientHeight - 10), function(container)
	        {
	            var format = ui.createFormat(container);
	            format.init();
	            
	            return format;
	        });
	        
	        ui.formatWindow.window.minimumSize = new mxRectangle(0, 0, 240, 80);
	        ui.formatWindow.window.setVisible(true);
	    }
	    else
	    {
	        ui.formatWindow.window.setVisible(!ui.formatWindow.window.isVisible());
	    }

        if (ui.formatWindow.window.isVisible())
        {
            ui.formatWindow.window.fit();
        }
	};

	function toggleShapes(ui)
	{
		var graph = ui.editor.graph;
	    graph.popupMenuHandler.hideMenu();
	    var rect = new mxRectangle();

	    if (ui.sidebarWindow == null)
	    {
	        var w = Math.min(graph.container.clientWidth - 10, 266);
	        
	        ui.sidebarWindow = new WrapperWindow(ui, mxResources.get('shapes'), 10, 56,
	           w - 6, Math.min(650, graph.container.clientHeight - 30),
	           function(container)
	        {
	            var div = document.createElement('div');
	            div.style.cssText = 'position:absolute;left:0;right:0;border-top:1px solid lightgray;' +
	                'height:24px;bottom:31px;text-align:center;cursor:pointer;padding:6px 0 0 0;';
	            div.className = 'geTitle';
	            mxUtils.write(div, mxResources.get('moreShapes'));
	            container.appendChild(div);
	            
	            mxEvent.addListener(div, 'click', function()
	            {
	                ui.actions.get('shapes').funct();
	            });

	            var menuObj = new Menubar(ui, container);
	            
	            function addMenu(id, label)
	            {
	                var menu = ui.menus.get(id);
	                
	                var elt = menuObj.addMenu(label, mxUtils.bind(this, function()
	                {
	                    // Allows extensions of menu.functid
	                    menu.funct.apply(this, arguments);
	                }));

	                elt.style.cssText = 'position:absolute;border-top:1px solid lightgray;width:50%;' +
	                	'height:24px;bottom:0px;text-align:center;cursor:pointer;padding:6px 0 0 0;';
	                elt.className = 'geTitle';
		            container.appendChild(elt);
	                
	                return elt;
	            }
	            
				if (Editor.enableCustomLibraries && (urlParams['embed'] != '1' || urlParams['libraries'] == '1'))
	            {
					// Defined in native apps together with openLibrary
					if (ui.actions.get('newLibrary') != null)
					{
			            var div = document.createElement('div');
			            div.style.cssText = 'position:absolute;left:0px;width:50%;border-top:1px solid lightgray;' +
			                'height:30px;bottom:0px;text-align:center;cursor:pointer;padding:0px;';
			            div.className = 'geTitle';
			            var span = document.createElement('span');
			            span.style.cssText = 'position:relative;top:6px;';
			            mxUtils.write(span, mxResources.get('newLibrary'));
			            div.appendChild(span);
			            container.appendChild(div);
			            
			            mxEvent.addListener(div, 'click', ui.actions.get('newLibrary').funct);

			            var div = document.createElement('div');
			            div.style.cssText = 'position:absolute;left:50%;width:50%;border-top:1px solid lightgray;' +
			                'height:30px;bottom:0px;text-align:center;cursor:pointer;padding:0px;border-left: 1px solid lightgray;';
			            div.className = 'geTitle';
			            var span = document.createElement('span');
			            span.style.cssText = 'position:relative;top:6px;';
			            mxUtils.write(span, mxResources.get('openLibrary'));
			            div.appendChild(span);
			            container.appendChild(div);
			            
			            mxEvent.addListener(div, 'click', ui.actions.get('openLibrary').funct);
					}
					else
					{
						var elt = addMenu('newLibrary', mxResources.get('newLibrary'));
			            elt.style.left = '0';
			            
			            var elt = addMenu('openLibraryFrom', mxResources.get('openLibraryFrom'));
			            elt.style.borderLeft = '1px solid lightgray';
			            elt.style.left = '50%';
					}
	            }
				else
				{
					div.style.bottom = '0';
				}

	            container.appendChild(ui.sidebar.container);
	            container.style.overflow = 'hidden';
	            
	            return container;
	        });
	        
	        ui.sidebarWindow.window.minimumSize = new mxRectangle(0, 0, 90, 90);
	        ui.sidebarWindow.window.setVisible(true);
	        
	        ui.getLocalData('sidebar', function(value)
	        {
	            ui.sidebar.showEntries(value, null, true);
	        });
	        
	        ui.restoreLibraries();
	    }
	    else
	    {
    		ui.sidebarWindow.window.setVisible(!ui.sidebarWindow.window.isVisible());
	    }
        
        if (ui.sidebarWindow.window.isVisible())
        {
            ui.sidebarWindow.window.fit();
        }
	};
	
    // Changes colors for some UI elements
    var fill = '#29b6f2';
    var stroke = '#ffffff';
    
    Editor.checkmarkImage = Graph.createSvgImage(22, 18, '<path transform="translate(4 0)" d="M7.181,15.007a1,1,0,0,1-.793-0.391L3.222,10.5A1,1,0,1,1,4.808,9.274L7.132,12.3l6.044-8.86A1,1,0,1,1,14.83,4.569l-6.823,10a1,1,0,0,1-.8.437H7.181Z" fill="' + fill + '"/>').src;
    mxWindow.prototype.closeImage = Graph.createSvgImage(18, 10, '<path d="M 5 1 L 13 9 M 13 1 L 5 9" stroke="#C0C0C0" stroke-width="2"/>').src;
    mxWindow.prototype.minimizeImage = Graph.createSvgImage(14, 10, '<path d="M 3 7 L 7 3 L 11 7" stroke="#C0C0C0" stroke-width="2" fill="#ffffff"/>').src;
    mxWindow.prototype.normalizeImage = Graph.createSvgImage(14, 10, '<path d="M 3 3 L 7 7 L 11 3" stroke="#C0C0C0" stroke-width="2" fill="#ffffff"/>').src;
    mxConstraintHandler.prototype.pointImage = Graph.createSvgImage(5, 5, '<path d="m 0 0 L 5 5 M 0 5 L 5 0" stroke="' + fill + '"/>');
    mxOutline.prototype.sizerImage = null;
    
    mxConstants.VERTEX_SELECTION_COLOR = '#C0C0C0';
    mxConstants.EDGE_SELECTION_COLOR = '#C0C0C0';
    mxConstants.CONNECT_HANDLE_FILLCOLOR = '#cee7ff';
    
    mxConstants.DEFAULT_VALID_COLOR = fill;
    mxConstants.GUIDE_COLOR = '#C0C0C0';

    mxConstants.HIGHLIGHT_STROKEWIDTH = 5;
    mxConstants.HIGHLIGHT_OPACITY = 35;
    mxConstants.OUTLINE_COLOR = '#29b6f2';
    mxConstants.OUTLINE_HANDLE_FILLCOLOR = '#29b6f2';
    mxConstants.OUTLINE_HANDLE_STROKECOLOR = '#fff';
    
    Graph.prototype.svgShadowColor = '#3D4574';
    Graph.prototype.svgShadowOpacity = '0.4';
    Graph.prototype.svgShadowSize = '0.6';
    Graph.prototype.svgShadowBlur = '1.2';
    
    Format.prototype.inactiveTabBackgroundColor = '#f0f0f0';
    mxGraphHandler.prototype.previewColor = '#C0C0C0';
    mxRubberband.prototype.defaultOpacity = 50;
    HoverIcons.prototype.inactiveOpacity = 25;
    Format.prototype.showCloseButton = false;
	EditorUi.prototype.closableScratchpad = false;
    EditorUi.prototype.toolbarHeight = 46;
	EditorUi.prototype.footerHeight = 0;
	Graph.prototype.editAfterInsert = true;

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
    
    // Overridden to ignore tabContainer height for diagramContainer
    var editorUiUpdateTabContainer = EditorUi.prototype.updateTabContainer;
    
    EditorUi.prototype.updateTabContainer = function()
    {
    	if (this.tabContainer != null)
        {
        	// Makes room for view zoom menu
        	this.tabContainer.style.right = '70px';
        	this.diagramContainer.style.bottom = '30px';
        }
    	
    	editorUiUpdateTabContainer.apply(this, arguments);
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

    var appUpdateUserElement = App.prototype.updateUserElement;
    
    App.prototype.updateUserElement = function()
    {
    	appUpdateUserElement.apply(this, arguments);
    	
		if (this.userElement != null)
		{
			var elt = this.userElement;
    		elt.style.cssText = 'display:inline-block;position:relative;margin-right:4px;';
    		elt.className = '';
    		elt.innerHTML = '';
			elt.style.backgroundImage = 'url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBkPSJNMTIgMTJjMi4yMSAwIDQtMS43OSA0LTRzLTEuNzktNC00LTQtNCAxLjc5LTQgNCAxLjc5IDQgNCA0em0wIDJjLTIuNjcgMC04IDEuMzQtOCA0djJoMTZ2LTJjMC0yLjY2LTUuMzMtNC04LTR6Ii8+PC9zdmc+)';
        	elt.style.backgroundPosition = 'center center';
        	elt.style.backgroundRepeat = 'no-repeat';
        	elt.style.backgroundSize = '24px 24px';
        	elt.style.height = '24px';
        	elt.style.width = '24px';
        	mxUtils.setOpacity(elt, 30);
        	elt.setAttribute('title', mxResources.get('changeUser'));
		}
    };
    
    var appUpdateButtonContainer = App.prototype.updateButtonContainer;
    
    App.prototype.updateButtonContainer = function()
    {
    	appUpdateButtonContainer.apply(this, arguments);
    	
    	if (this.shareButton != null)
		{
    		var elt = this.shareButton;
    		elt.style.cssText = 'display:inline-block;position:relative;box-sizing:border-box;margin-right:4px;cursor:pointer;';
    		elt.className = '';
    		elt.innerHTML = '';
			elt.style.backgroundImage = 'url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBkPSJNMTggMTYuMDhjLS43NiAwLTEuNDQuMy0xLjk2Ljc3TDguOTEgMTIuN2MuMDUtLjIzLjA5LS40Ni4wOS0uN3MtLjA0LS40Ny0uMDktLjdsNy4wNS00LjExYy41NC41IDEuMjUuODEgMi4wNC44MSAxLjY2IDAgMy0xLjM0IDMtM3MtMS4zNC0zLTMtMy0zIDEuMzQtMyAzYzAgLjI0LjA0LjQ3LjA5LjdMOC4wNCA5LjgxQzcuNSA5LjMxIDYuNzkgOSA2IDljLTEuNjYgMC0zIDEuMzQtMyAzczEuMzQgMyAzIDNjLjc5IDAgMS41LS4zMSAyLjA0LS44MWw3LjEyIDQuMTZjLS4wNS4yMS0uMDguNDMtLjA4LjY1IDAgMS42MSAxLjMxIDIuOTIgMi45MiAyLjkyIDEuNjEgMCAyLjkyLTEuMzEgMi45Mi0yLjkycy0xLjMxLTIuOTItMi45Mi0yLjkyeiIvPjwvc3ZnPg==)';
        	elt.style.backgroundPosition = 'center center';
        	elt.style.backgroundRepeat = 'no-repeat';
        	elt.style.backgroundSize = '24px 24px';
        	elt.style.height = '24px';
        	elt.style.width = '24px';
        	mxUtils.setOpacity(elt, 30);
        	elt.setAttribute('title', mxResources.get('share'));
		}
    };
    
	EditorUi.prototype.addEmbedButtons = function()
	{
		if (this.buttonContainer != null)
		{
			var div = document.createElement('div');
			div.style.display = 'inline-block';
			div.style.position = 'relative';
			div.style.marginTop = '2px';
			
			var button = document.createElement('button');
			mxUtils.write(button, mxResources.get('save'));
			button.setAttribute('title', mxResources.get('save') + ' (' + Editor.ctrlKey + '+S)');
			button.className = (urlParams['saveAndExit'] == '1') ? 'geMenuItem' : 'geMenuItem gePrimaryBtn';
			button.style.fontSize = '14px';
			button.style.padding = '6px';
			button.style.borderRadius = '3px';
			button.style.marginLeft = '8px';
			button.style.cursor = 'pointer';
			
			mxEvent.addListener(button, 'click', mxUtils.bind(this, function()
			{
				this.actions.get('save').funct();
			}));
			
			div.appendChild(button);
			
			if (urlParams['saveAndExit'] == '1')
			{
				button = document.createElement('a');
				mxUtils.write(button, mxResources.get('saveAndExit'));
				button.setAttribute('title', mxResources.get('saveAndExit'));
				button.className = 'geMenuItem gePrimaryBtn';
				button.style.fontSize = '14px';
				button.style.marginLeft = '6px';
				button.style.padding = '6px';
				button.style.cursor = 'pointer';
				
				mxEvent.addListener(button, 'click', mxUtils.bind(this, function()
				{
					this.actions.get('saveAndExit').funct();
				}));
				
				div.appendChild(button);
			}

			button = document.createElement('a');
			mxUtils.write(button, mxResources.get('exit'));
			button.setAttribute('title', mxResources.get('exit'));
			button.className = 'geMenuItem';
			button.style.fontSize = '14px';
			button.style.marginLeft = '6px';
			button.style.padding = '6px';
			button.style.cursor = 'pointer';
			
			mxEvent.addListener(button, 'click', mxUtils.bind(this, function()
			{
				this.actions.get('exit').funct();
			}));
			
			div.appendChild(button);
			this.buttonContainer.appendChild(div);
			this.buttonContainer.style.top = '6px';
		}
	};
	
    // Fixes sidebar tooltips (previews)
    Sidebar.prototype.getTooltipOffset = function()
    {
        var off = mxUtils.getOffset(this.editorUi.sidebarWindow.window.div);
        off.y += 40;
        
        return off;
    };
    
    // Adds context menu items
    var menuCreatePopupMenu = Menus.prototype.createPopupMenu;
    
    Menus.prototype.createPopupMenu = function(menu, cell, evt)
    {
        var graph = this.editorUi.editor.graph;
        menu.smartSeparators = true;
        menuCreatePopupMenu.apply(this, arguments);

        var promptSpacing = mxUtils.bind(this, function(defaultValue, fn)
        {
            var dlg = new FilenameDialog(this.editorUi, defaultValue, mxResources.get('apply'), function(newValue)
            {
                fn(parseFloat(newValue));
            }, mxResources.get('spacing'));
            this.editorUi.showDialog(dlg.container, 300, 80, true, true);
            dlg.init();
        });
        
        if (graph.getSelectionCount() == 1)
        {
            this.addMenuItems(menu, ['editTooltip', '-', 'editStyle', 'editGeometry', '-'], null, evt);

            if (graph.isCellFoldable(graph.getSelectionCell()))
            {
                this.addMenuItems(menu, (graph.isCellCollapsed(cell)) ? ['expand'] : ['collapse'], null, evt);
            }
            
            this.addMenuItems(menu, ['collapsible', '-', 'lockUnlock', 'enterGroup'], null, evt);
            menu.addSeparator();
            this.addSubmenu('layout', menu);
        }
        else if (graph.isSelectionEmpty() && graph.isEnabled())
        {
            menu.addSeparator();
            this.addMenuItems(menu, ['editData'], null, evt);
        	menu.addSeparator();
            this.addSubmenu('insert', menu);
            this.addSubmenu('layout', menu);
            menu.addSeparator();
            this.addSubmenu('view', menu, null, mxResources.get('options'));
            this.addMenuItems(menu, ['-', 'exitGroup'], null, evt);
        }
        else if (graph.isEnabled())
        {
            this.addMenuItems(menu, ['-', 'lockUnlock'], null, evt);
        }
    };
    
    // Overridden to toggle window instead
    EditorUi.prototype.toggleFormatPanel = function(forceHide)
    {
        if (this.formatWindow != null)
        {
        	this.formatWindow.window.setVisible((forceHide) ?
               false : !this.formatWindow.window.isVisible());
        }
        else
        {
        	toggleFormat(this);
        }
    };

    DiagramFormatPanel.prototype.isMathOptionVisible = function()
    {
        return true;
    };
    
	// Initializes the user interface
	var editorUiDestroy = EditorUi.prototype.destroy;
	EditorUi.prototype.destroy = function()
	{
        if (this.sidebarWindow != null)
        {
            this.sidebarWindow.window.setVisible(false);
            this.sidebarWindow.window.destroy();
            this.sidebarWindow = null;
        }
        
        if (this.formatWindow != null)
        {
        	this.formatWindow.window.setVisible(false);
        	this.formatWindow.window.destroy();
        	this.formatWindow = null;
        }

        if (this.actions.outlineWindow != null)
        {
        	this.actions.outlineWindow.window.setVisible(false);
        	this.actions.outlineWindow.window.destroy();
        	this.actions.outlineWindow = null;
        }

        if (this.actions.layersWindow != null)
        {
        	this.actions.layersWindow.window.setVisible(false);
        	this.actions.layersWindow.window.destroy();
        	this.actions.layersWindow = null;
        }

        if (this.menus.tagsWindow != null)
        {
        	this.menus.tagsWindow.window.setVisible(false);
        	this.menus.tagsWindow.window.destroy();
        	this.menus.tagsWindow = null;
        }

        if (this.menus.findWindow != null)
        {
        	this.menus.findWindow.window.setVisible(false);
        	this.menus.findWindow.window.destroy();
        	this.menus.findWindow = null;
        }

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
	};
	
    // Disables centering of graph after iframe resize
	EditorUi.prototype.chromelessWindowResize = function() {};
	
	// Adds actions and menus
	var menusInit = Menus.prototype.init;
	Menus.prototype.init = function()
	{
		menusInit.apply(this, arguments);
		
        var ui = this.editorUi;
        var graph = ui.editor.graph;
        
        ui.actions.get('insertText').label = mxResources.get('text');
        ui.actions.get('insertText').label = mxResources.get('text');
        ui.actions.get('editDiagram').label = mxResources.get('formatXml') + '...';
        ui.actions.get('insertRectangle').label = mxResources.get('rectangle');
        ui.actions.get('insertEllipse').label = mxResources.get('ellipse');
        ui.actions.get('insertRhombus').label = mxResources.get('rhombus');
        ui.actions.get('insertImage').label = mxResources.get('image') + '...';
        ui.actions.get('insertLink').label = mxResources.get('link') + '...';
        ui.actions.get('createShape').label = mxResources.get('shape') + '...';
        ui.actions.get('outline').label = mxResources.get('outline') + '...';
        ui.actions.get('layers').label = mxResources.get('layers') + '...';
        
        ui.actions.put('importFile', new Action('File...', function()
        {
            graph.popupMenuHandler.hideMenu();
            var input = document.createElement('input');
            input.setAttribute('type', 'file');
            
            mxEvent.addListener(input, 'change', function()
            {
                if (input.files != null)
                {
                    // Using null for position will disable crop of input file
                    ui.importFiles(input.files, null, null, ui.maxImageSize);
                }
            });

            input.click();
        }));
        ui.actions.put('importCsv', new Action(mxResources.get('csv') + '...', function()
        {
            graph.popupMenuHandler.hideMenu();
            ui.showImportCsvDialog();
        }));
        ui.actions.put('importText', new Action(mxResources.get('text') + '...', function()
        {
            var dlg = new ParseDialog(ui, 'Insert from Text');
            ui.showDialog(dlg.container, 620, 420, true, false);
            dlg.init();
        }));
        ui.actions.put('formatSql', new Action(mxResources.get('formatSql') + '...', function()
        {
            var dlg = new ParseDialog(ui, 'Insert from Text', 'formatSql');
            ui.showDialog(dlg.container, 620, 420, true, false);
            dlg.init();
        }));

        ui.actions.put('toggleShapes', new Action(mxResources.get('shapes') + '...', function()
        {
        	toggleShapes(ui);
        }));
        ui.actions.put('toggleFormat', new Action(mxResources.get('format') + '...', function()
        {
        	toggleFormat(ui);
        }));
        
        if (EditorUi.enablePlantUml && !ui.isOffline())
        {
	        ui.actions.put('plantUml', new Action(mxResources.get('plantUml') + '...', function()
	        {
	            var dlg = new ParseDialog(ui, 'Insert from Text', 'plantUml');
	            ui.showDialog(dlg.container, 620, 420, true, false);
	            dlg.init();
	        }));
        }

        this.put('diagram', new Menu(mxUtils.bind(this, function(menu, parent)
        {
        	ui.menus.addSubmenu('extras', menu, parent, mxResources.get('preferences'));
			menu.addSeparator(parent);

			if (mxClient.IS_CHROMEAPP || EditorUi.isElectronApp)
			{
				ui.menus.addMenuItems(menu, ['new', 'open', '-', 'save', 'saveAs', '-'], parent);
			}
			else if (urlParams['embed'] == '1')
			{
				ui.menus.addMenuItems(menu, ['-', 'save'], parent);

				if (urlParams['saveAndExit'] == '1')
				{
					ui.menus.addMenuItems(menu, ['saveAndExit'], parent);
				}
				
				menu.addSeparator(parent);
			}
			else
			{
	        	ui.menus.addMenuItems(menu, ['new'], parent);
				ui.menus.addSubmenu('openFrom', menu, parent);
				menu.addSeparator(parent);
				ui.menus.addSubmenu('save', menu, parent);
			}
			
			ui.menus.addSubmenu('exportAs', menu, parent);

			var file = ui.getCurrentFile();
			
			if (file != null && file.constructor == DriveFile)
			{
				ui.menus.addMenuItems(menu, ['-', 'share'], parent);

				if (file.realtime != null)
				{
					ui.menus.addMenuItems(menu, ['chatWindowTitle'], parent);
				}
				
				menu.addSeparator(parent);
			}
			
			ui.menus.addMenuItems(menu, ['-', 'outline', 'layers', '-', 'find', 'tags'], parent);
			
			// Cannot use print in standalone mode on iOS as we cannot open new windows
			if (!mxClient.IS_IOS || !navigator.standalone)
			{
				ui.menus.addMenuItems(menu, ['-', 'print', '-'], parent);
			}
			
            ui.menus.addSubmenu('help', menu, parent);
            
            if (urlParams['embed'] == '1')
			{
				ui.menus.addMenuItems(menu, ['-', 'exit'], parent);
			}
			else
			{
				ui.menus.addMenuItems(menu, ['-', 'close']);
			}
        })));

		if (isLocalStorage)
		{
			var openFromMenu = this.get('openFrom');
			var oldFunct = openFromMenu.funct;
			
			openFromMenu.funct = function(menu, parent)
			{
				oldFunct.apply(this, arguments);
				
				menu.addSeparator(parent);
				ui.menus.addSubmenu('openRecent', menu, parent);
			};
		}

		this.put('save', new Menu(mxUtils.bind(this, function(menu, parent)
        {
			var file = ui.getCurrentFile();
			
			if (file != null && file.constructor == DriveFile)
			{
				ui.menus.addMenuItems(menu, ['createRevision', 'makeCopy', '-', 'rename', 'moveToFolder'], parent);
			}
			else
			{
				ui.menus.addMenuItems(menu, ['save', 'saveAs', '-', 'rename'], parent);
				
				if (ui.isOfflineApp())
				{
					if (navigator.onLine && urlParams['stealth'] != '1')
					{
						this.addMenuItems(menu, ['upload'], parent);
					}
				}
				else
				{
					ui.menus.addMenuItems(menu, ['makeCopy'], parent);
				}
			}

			if (file != null && (file.constructor == DriveFile || file.constructor == DropboxFile))
			{
				ui.menus.addMenuItems(menu, ['-', 'revisionHistory'], parent);
			}
			
			ui.menus.addMenuItems(menu, ['-', 'autosave'], parent);
        })));
        
        // Augments the existing export menu
        var exportAsMenu = this.get('exportAs');
        
        this.put('exportAs', new Menu(mxUtils.bind(this, function(menu, parent)
        {
        	exportAsMenu.funct(menu, parent);

    		if (!mxClient.IS_CHROMEAPP && !EditorUi.isElectronApp)
    		{
	            // Publish menu contains only one element by default...
	            //ui.menus.addSubmenu('publish', menu, parent); 
	            ui.menus.addMenuItems(menu, ['publishLink'], parent);
    		}
    		
            menu.addSeparator(parent);
            ui.menus.addSubmenu('embed', menu, parent);
        })));

        var langMenu = this.get('language');

        // Extras menu is labelled preferences but keeps ID for extensions
        this.put('extras', new Menu(mxUtils.bind(this, function(menu, parent)
        {
			if (urlParams['embed'] != '1')
			{
				ui.menus.addSubmenu('theme', menu, parent);
			}
			
			if (langMenu != null)
			{
				ui.menus.addSubmenu('language', menu, parent);
			}
			
			menu.addSeparator(parent);
			ui.menus.addMenuItems(menu, ['scrollbars', 'tooltips'], parent);
            
			if (urlParams['embed'] != '1' && (isLocalStorage || mxClient.IS_CHROMEAPP))
			{
				ui.menus.addMenuItems(menu, ['-', 'search', 'scratchpad', '-', 'showStartScreen'], parent);
			}

			if (!ui.isOfflineApp() && isLocalStorage)
			{
				menu.addSeparator(parent);
	        	ui.menus.addMenuItem(menu, 'plugins', parent);
			}
        })));
        
        this.put('insertAdvanced', new Menu(mxUtils.bind(this, function(menu, parent)
        {
            ui.menus.addMenuItems(menu, ['importText', 'plantUml', '-', 'formatSql', 'importCsv', '-', 'createShape', 'editDiagram'], parent);
        })));
        
        mxResources.parse('insertLayout=' + mxResources.get('layout'));
        mxResources.parse('insertAdvanced=' + mxResources.get('advanced'));
        
        this.put('insert', new Menu(mxUtils.bind(this, function(menu, parent)
        {
            ui.menus.addMenuItems(menu, ['insertRectangle', 'insertEllipse', 'insertRhombus', '-', 'insertText',
                                         'insertLink', '-', 'insertImage'], parent);
            
            if (mxClient.IS_CHROMEAPP || EditorUi.isElectronApp)
            {
            	ui.menus.addMenuItems(menu, ['import'], parent);
            }
            else
            {
            	ui.menus.addSubmenu('importFrom', menu, parent);
            }
            
            menu.addSeparator(parent);
            ui.menus.addSubmenu('insertLayout', menu, parent);
            ui.menus.addSubmenu('insertAdvanced', menu, parent);
        })));

        var methods = ['horizontalFlow', 'verticalFlow', '-', 'horizontalTree', 'verticalTree',
                       'radialTree', '-', 'organic', 'circle'];

        var addInsertItem = function(menu, parent, title, method)
        {
            menu.addItem(title, null, mxUtils.bind(this, function()
            {
                var dlg = new CreateGraphDialog(ui, title, method);
                ui.showDialog(dlg.container, 620, 420, true, false);
                // Executed after dialog is added to dom
                dlg.init();
            }), parent);
        };

        this.put('insertLayout', new Menu(mxUtils.bind(this, function(menu, parent)
        {
            for (var i = 0; i < methods.length; i++)
            {
                if (methods[i] == '-')
                {
                    menu.addSeparator(parent);
                }
                else
                {
                    addInsertItem(menu, parent, mxResources.get(methods[i]) + '...', methods[i]);
                }
            }
        })));

        // Overrides view for plugins but label it options
        this.put('view', new Menu(mxUtils.bind(this, function(menu, parent)
        {
            ui.menus.addMenuItems(menu, ['grid', 'guides', '-', 'connectionArrows', 'connectionPoints', '-'], parent);
            
			if (typeof(MathJax) !== 'undefined')
			{
				var item = ui.menus.addMenuItem(menu, 'mathematicalTypesetting', parent);
				ui.menus.addLinkToItem(item, 'https://desk.draw.io/support/solutions/articles/16000032875');
			}
			
            ui.menus.addMenuItems(menu, ['copyConnect', 'collapseExpand', '-', 'pageScale'], parent);
        })));
	};
	
	// Initializes the user interface
	var editorUiInit = EditorUi.prototype.init;
	
	EditorUi.prototype.init = function()
	{
		editorUiInit.apply(this, arguments);

        var div = document.createElement('div');
        div.style.cssText = 'position:absolute;left:0px;right:0px;top:0px;overflow-y:auto;overflow-x:hidden;';
        div.style.bottom = (urlParams['embed'] != '1' || urlParams['libraries'] == '1') ? '63px' : '32px';
        this.sidebar = this.createSidebar(div);

        // Needed for creating elements in Format panel
        var ui = this;
        var graph = ui.editor.graph;
        ui.toolbar = this.createToolbar(ui.createDiv('geToolbar'));
        ui.defaultLibraryName = mxResources.get('untitledLibrary');
        
        var menubar = document.createElement('div');
        menubar.style.cssText = 'position:absolute;left:0px;right:0px;top:0px;height:30px;padding:8px;border-bottom:1px solid lightgray;background-color:#ffffff;text-align:left;white-space:nowrap;';
        
        var before = null;
        var menuObj = new Menubar(ui, menubar);
        
        function addMenu(id, small, img, opacity)
        {
            var menu = ui.menus.get(id);
            
            var elt = menuObj.addMenu(mxResources.get(id), mxUtils.bind(this, function()
            {
                // Allows extensions of menu.functid
                menu.funct.apply(this, arguments);
            }), before);
            
            elt.className = 'geMenuItem';
            elt.style.display = 'inline-block';
            elt.style.boxSizing = 'border-box';
            elt.style.top = '6px';
            elt.style.marginRight = '6px';
            elt.style.height = '30px';
            elt.style.paddingTop = '6px';
            elt.style.paddingBottom = '6px';
            elt.setAttribute('title', mxResources.get(id));
            ui.menus.menuCreated(menu, elt, 'geMenuItem');
            
            if (img != null)
            {
            	elt.style.backgroundImage = 'url(' + img + ')';
            	elt.style.backgroundPosition = 'center center';
            	elt.style.backgroundRepeat = 'no-repeat';
            	elt.style.backgroundSize = '24px 24px';
            	elt.style.width = '34px';
            	elt.innerHTML = '';
            	mxUtils.setOpacity(elt, opacity || 40);
            }
            else if (!small)
            {
            	elt.style.backgroundImage = 'url(' + mxWindow.prototype.normalizeImage + ')';
            	elt.style.backgroundPosition = 'right 6px center';
            	elt.style.backgroundRepeat = 'no-repeat';
            	elt.style.paddingRight = '22px';
            } 

            return elt;
        };
        
        function addMenuItem(label, fn, small, tooltip, action, img)
        {
            var btn = document.createElement('a');
            btn.setAttribute('href', 'javascript:void(0)');
            btn.className = 'geMenuItem';
            btn.style.display = 'inline-block';
            btn.style.boxSizing = 'border-box';
            btn.style.height = '30px';
            btn.style.padding = '6px';
            btn.style.position = 'relative';
            btn.style.verticalAlign = 'top';
            btn.style.top = '0px';
            
            if (ui.statusContainer != null)
            {
            	menubar.insertBefore(btn, ui.statusContainer);
            }
            else
            {
            	menubar.appendChild(btn);
            }
            
            if (img != null)
            {
            	btn.style.backgroundImage = 'url(' + img + ')';
            	btn.style.backgroundPosition = 'center center';
            	btn.style.backgroundRepeat = 'no-repeat';
            	btn.style.backgroundSize = '24px 24px';
                btn.style.width = '34px';
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
            
            if (small == null)
            {
                btn.style.marginRight = '4px';
            }
            
            if (tooltip != null)
            {
                btn.setAttribute('title', tooltip);
            }

            mxUtils.setOpacity(btn, (img != null) ? 40 : 100);
            
            if (action != null)
            {
                function updateState()
                {
                    if (action.isEnabled())
                    {
                        btn.removeAttribute('disabled');
                        mxUtils.setOpacity(btn, (img != null) ? 40 : 100);
                        btn.style.cursor = '';
                    }
                    else
                    {
                        btn.setAttribute('disabled', 'disabled');
                        mxUtils.setOpacity(btn, (img != null) ? 10 : 20);
                        btn.style.cursor = 'default';
                    }
                };
                
                action.addListener('stateChanged', updateState);
                updateState();
            }
            
            return btn;
        };
        
        function createGroup(btns)
        {
            var btnGroup = document.createElement('div');
            btnGroup.className = 'geMenuItem';
            btnGroup.style.display = 'inline-block';
            btnGroup.style.verticalAlign = 'top';
            btnGroup.style.marginRight = '6px';
            btnGroup.style.padding = '0 4px 0 4px';
            btnGroup.style.height = '30px';
            btnGroup.style.position = 'relative';
            btnGroup.style.top = '0px';
            
            for (var i = 0; i < btns.length; i++)
            {
            	if (btns[i] != null)
            	{
            		btns[i].style.margin = '0px';
	                btns[i].style.boxShadow = 'none';
	                btnGroup.appendChild(btns[i]);
            	}
            }

            if (ui.statusContainer != null)
            {
            	menubar.insertBefore(btnGroup, ui.statusContainer);
            }
            else
            {
            	menubar.appendChild(btnGroup);
            }
            
            return btnGroup;
        };

		ui.statusContainer = ui.createStatusContainer();
		ui.statusContainer.style.position = 'relative';
		ui.statusContainer.style.maxWidth = '';
		ui.statusContainer.style.marginTop = '7px';
		ui.statusContainer.style.marginLeft = '6px';
		ui.statusContainer.style.color = 'gray';
		ui.statusContainer.style.cursor = 'default';
		
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
		
		// Connects the status bar to the editor status
		ui.editor.addListener('statusChanged', mxUtils.bind(this, function()
		{
			ui.setStatusText(ui.editor.getStatus());
		}));
		
		// Connects the status bar to the editor status
		var uiDescriptorChanged = ui.descriptorChanged;
		
		ui.descriptorChanged = function()
		{
			uiDescriptorChanged.apply(this, arguments);
			updateTitle();
		};
		
		ui.setStatusText(ui.editor.getStatus());
		menubar.appendChild(ui.statusContainer);

		ui.buttonContainer = document.createElement('div');
		ui.buttonContainer.style.cssText = 'position:absolute;right:40px;top:12px;white-space:nowrap;';
		menubar.appendChild(ui.buttonContainer);
		
		// Container for the user element
		ui.menubarContainer = ui.buttonContainer;

        ui.tabContainer = document.createElement('div');
        ui.tabContainer.style.cssText = 'position:absolute;left:0px;right:0px;bottom:0px;height:30px;white-space:nowrap;' +
            'border-bottom:1px solid lightgray;background-color:#ffffff;border-top:1px solid lightgray;margin-bottom:-2px;' +
            'visibility:hidden;';

        var previousParent = ui.diagramContainer.parentNode;

        var wrapper = document.createElement('div');
        wrapper.style.cssText = 'position:absolute;top:0px;left:0px;right:0px;bottom:0px;overflow:hidden;';
        ui.diagramContainer.style.top = '47px';

        var viewZoomMenu = ui.menus.get('viewZoom');
        var viewZoomMenuElt = null;
		
		if (viewZoomMenu != null)
		{
			this.tabContainer.style.right = '70px';
			var elt = menuObj.addMenu('100%', viewZoomMenu.funct);
			elt.setAttribute('title', mxResources.get('zoom') + ' (Alt+Mousewheel)');
			elt.style.whiteSpace = 'nowrap';
        	elt.style.backgroundImage = 'url(' + mxWindow.prototype.minimizeImage + ')';
        	elt.style.backgroundPosition = 'right 6px center';
        	elt.style.backgroundRepeat = 'no-repeat';
			elt.style.backgroundColor = '#ffffff';
        	elt.style.paddingRight = '10px';
			elt.style.display = 'block';
			elt.style.position = 'absolute';
			elt.style.textDecoration = 'none';
			elt.style.textDecoration = 'none';
			elt.style.right = '0px';
			elt.style.bottom = '0px';
			elt.style.overflow = 'hidden';
			elt.style.visibility = 'hidden';
			elt.style.textAlign = 'center';
			elt.style.color = '#000';
			elt.style.fontSize = '12px';
			elt.style.color = '#707070';
			elt.style.width = '59px';
			elt.style.borderTop = '1px solid lightgray';
			elt.style.borderLeft = '1px solid lightgray';
			elt.style.height = (parseInt(ui.tabContainer.style.height) - 1) + 'px';
			elt.style.lineHeight = (parseInt(ui.tabContainer.style.height) + 1) + 'px';
			wrapper.appendChild(elt);
	        
	    	// Updates the label if the scale changes
	    	var updateZoom = mxUtils.bind(this, function()
	    	{
	    		elt.innerHTML = Math.round(ui.editor.graph.view.scale * 100) + '%';
	    	});

	    	ui.editor.graph.view.addListener(mxEvent.EVENT_SCALE, updateZoom);
	    	ui.editor.addListener('resetGraphView', updateZoom);
	    	ui.editor.addListener('pageSelected', updateZoom);
	    	
	    	// Augments setGraphEnabled to update visible state
	    	var uiSetGraphEnabled = ui.setGraphEnabled;
	    	
	    	ui.setGraphEnabled = function()
	    	{
	    		uiSetGraphEnabled.apply(this, arguments);
	    		
	    		if (this.tabContainer != null)
	    		{
	    			elt.style.visibility = this.tabContainer.style.visibility;
    	        	this.diagramContainer.style.bottom = (this.tabContainer.style.visibility != 'hidden') ? '30px' : '0px';
	    		}
	    	};
		}
        
        wrapper.appendChild(ui.tabContainer);
        wrapper.appendChild(menubar);
        wrapper.appendChild(ui.diagramContainer);
        previousParent.appendChild(wrapper);
        ui.updateTabContainer();
        
        function refreshMenu()
        {
        	// Removes all existing menu items
        	var node = menubar.firstChild;
        	
        	while (node != null)
        	{
        		var temp = node.nextSibling;
        		
        		if (node.className == 'geMenuItem' || node.className == 'geItem')
        		{
        			node.parentNode.removeChild(node);
        		}
        		
        		node = temp;
        	}
        	
        	before = menubar.firstChild;
	        iw = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
	        var small = iw < 900;
	 
	        if (!small)
	        {
	        	addMenu('diagram');
	        }
	        
	        createGroup([((small) ? addMenu('diagram', null, IMAGE_PATH + '/drawlogo-gray.svg', 100) : null),
	        		addMenuItem(mxResources.get('shapes'), ui.actions.get('toggleShapes').funct, null, mxResources.get('shapes'), ui.actions.get('image'),
	        			(small) ? 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBkPSJNMTMgMTN2OGg4di04aC04ek0zIDIxaDh2LThIM3Y4ek0zIDN2OGg4VjNIM3ptMTMuNjYtMS4zMUwxMSA3LjM0IDE2LjY2IDEzbDUuNjYtNS42Ni01LjY2LTUuNjV6Ii8+PC9zdmc+' : null),
	                     addMenuItem(mxResources.get('format'), ui.actions.get('toggleFormat').funct, null,
	                    		 mxResources.get('format') + ' (' + ui.actions.get('formatPanel').shortcut + ')', ui.actions.get('image'),
	                    (small) ? 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBkPSJNMTIgM2MtNC45NyAwLTkgNC4wMy05IDlzNC4wMyA5IDkgOWMuODMgMCAxLjUtLjY3IDEuNS0xLjUgMC0uMzktLjE1LS43NC0uMzktMS4wMS0uMjMtLjI2LS4zOC0uNjEtLjM4LS45OSAwLS44My42Ny0xLjUgMS41LTEuNUgxNmMyLjc2IDAgNS0yLjI0IDUtNSAwLTQuNDItNC4wMy04LTktOHptLTUuNSA5Yy0uODMgMC0xLjUtLjY3LTEuNS0xLjVTNS42NyA5IDYuNSA5IDggOS42NyA4IDEwLjUgNy4zMyAxMiA2LjUgMTJ6bTMtNEM4LjY3IDggOCA3LjMzIDggNi41UzguNjcgNSA5LjUgNXMxLjUuNjcgMS41IDEuNVMxMC4zMyA4IDkuNSA4em01IDBjLS44MyAwLTEuNS0uNjctMS41LTEuNVMxMy42NyA1IDE0LjUgNXMxLjUuNjcgMS41IDEuNVMxNS4zMyA4IDE0LjUgOHptMyA0Yy0uODMgMC0xLjUtLjY3LTEuNS0xLjVTMTYuNjcgOSAxNy41IDlzMS41LjY3IDEuNSAxLjUtLjY3IDEuNS0xLjUgMS41eiIvPjwvc3ZnPg==' : null)]);
	        var elt = addMenu('insert', true, (small) ? 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBkPSJNMTkgMTNoLTZ2NmgtMnYtNkg1di0yaDZWNWgydjZoNnYyeiIvPjwvc3ZnPg==' : null, 40);
	        createGroup([elt, addMenuItem(mxResources.get('delete'), ui.actions.get('delete').funct, null, mxResources.get('delete'), ui.actions.get('delete'),
	        		(small) ? 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBkPSJNNiAxOWMwIDEuMS45IDIgMiAyaDhjMS4xIDAgMi0uOSAyLTJWN0g2djEyek0xOSA0aC0zLjVsLTEtMWgtNWwtMSAxSDV2MmgxNFY0eiIvPjwvc3ZnPg==' : null)]);
	        
	        if (iw >= 411)
	        {
	        	var undoAction = ui.actions.get('undo');
	        	var redoAction = ui.actions.get('redo');
	        	
		        var undoElt = addMenuItem('', undoAction.funct, null, mxResources.get('undo') + ' (' + undoAction.shortcut + ')', undoAction,
		       		'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBkPSJNMTIuNSA4Yy0yLjY1IDAtNS4wNS45OS02LjkgMi42TDIgN3Y5aDlsLTMuNjItMy42MmMxLjM5LTEuMTYgMy4xNi0xLjg4IDUuMTItMS44OCAzLjU0IDAgNi41NSAyLjMxIDcuNiA1LjVsMi4zNy0uNzhDMjEuMDggMTEuMDMgMTcuMTUgOCAxMi41IDh6Ii8+PC9zdmc+');
		        var redoElt = addMenuItem('', redoAction.funct, null, mxResources.get('redo') + ' (' + redoAction.shortcut + ')', redoAction,
		       		'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBkPSJNMTguNCAxMC42QzE2LjU1IDguOTkgMTQuMTUgOCAxMS41IDhjLTQuNjUgMC04LjU4IDMuMDMtOS45NiA3LjIyTDMuOSAxNmMxLjA1LTMuMTkgNC4wNS01LjUgNy42LTUuNSAxLjk1IDAgMy43My43MiA1LjEyIDEuODhMMTMgMTZoOVY3bC0zLjYgMy42eiIvPjwvc3ZnPg==');
		
		        createGroup([undoElt, redoElt]);
	
		        if (iw >= 480)
		        {
		        	var zoomInAction = ui.actions.get('zoomIn');
		        	var zoomOutAction = ui.actions.get('zoomOut');
		        	var resetViewAction = ui.actions.get('resetView');
		        	
			        createGroup([addMenuItem('', function()
			        {
			            graph.popupMenuHandler.hideMenu();
			
			        	var scale = graph.view.scale;
			            var tx = graph.view.translate.x;
			            var ty = graph.view.translate.y;
			
			        	ui.actions.get('resetView').funct();
			        	
			            // Toggle scale if nothing has changed
			            if (Math.abs(scale - graph.view.scale) < 0.00001 && tx == graph.view.translate.x && ty == graph.view.translate.y)
			            {
			            	ui.actions.get((graph.pageVisible) ? 'fitPage' : 'fitWindow').funct();
			            }
			        }, true, mxResources.get('fit') + ' (' + Editor.ctrlKey + '+H)', resetViewAction,
			        	'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBkPSJNMyA1djRoMlY1aDRWM0g1Yy0xLjEgMC0yIC45LTIgMnptMiAxMEgzdjRjMCAxLjEuOSAyIDIgMmg0di0ySDV2LTR6bTE0IDRoLTR2Mmg0YzEuMSAwIDItLjkgMi0ydi00aC0ydjR6bTAtMTZoLTR2Mmg0djRoMlY1YzAtMS4xLS45LTItMi0yeiIvPjwvc3ZnPg=='),
			        (iw >= 640) ? addMenuItem('', zoomInAction.funct, true, mxResources.get('zoomIn') + ' (' + Editor.ctrlKey + ' +)', zoomInAction,
			       		'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBkPSJNMTUuNSAxNGgtLjc5bC0uMjgtLjI3QzE1LjQxIDEyLjU5IDE2IDExLjExIDE2IDkuNSAxNiA1LjkxIDEzLjA5IDMgOS41IDNTMyA1LjkxIDMgOS41IDUuOTEgMTYgOS41IDE2YzEuNjEgMCAzLjA5LS41OSA0LjIzLTEuNTdsLjI3LjI4di43OWw1IDQuOTlMMjAuNDkgMTlsLTQuOTktNXptLTYgMEM3LjAxIDE0IDUgMTEuOTkgNSA5LjVTNy4wMSA1IDkuNSA1IDE0IDcuMDEgMTQgOS41IDExLjk5IDE0IDkuNSAxNHptMi41LTRoLTJ2Mkg5di0ySDdWOWgyVjdoMXYyaDJ2MXoiLz48L3N2Zz4=') : null,
			        (iw >= 640) ? addMenuItem('', zoomOutAction.funct, true, mxResources.get('zoomOut') + ' (' + Editor.ctrlKey + ' -)', zoomOutAction,
			        	'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBkPSJNMTUuNSAxNGgtLjc5bC0uMjgtLjI3QzE1LjQxIDEyLjU5IDE2IDExLjExIDE2IDkuNSAxNiA1LjkxIDEzLjA5IDMgOS41IDNTMyA1LjkxIDMgOS41IDUuOTEgMTYgOS41IDE2YzEuNjEgMCAzLjA5LS41OSA0LjIzLTEuNTdsLjI3LjI4di43OWw1IDQuOTlMMjAuNDkgMTlsLTQuOTktNXptLTYgMEM3LjAxIDE0IDUgMTEuOTkgNSA5LjVTNy4wMSA1IDkuNSA1IDE0IDcuMDEgMTQgOS41IDExLjk5IDE0IDkuNSAxNHpNNyA5aDV2MUg3eiIvPjwvc3ZnPg==') : null]);
		        }
	        }
	        
	        var langMenu = ui.menus.get('language');

			if (langMenu != null && !mxClient.IS_CHROMEAPP &&
				!EditorUi.isElectronApp && iw >= 540)
			{
				var elt = menuObj.addMenu('', langMenu.funct);
				elt.setAttribute('title', mxResources.get('language'));
				
				elt.style.backgroundImage = 'url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBkPSJNMTEuOTkgMkM2LjQ3IDIgMiA2LjQ4IDIgMTJzNC40NyAxMCA5Ljk5IDEwQzE3LjUyIDIyIDIyIDE3LjUyIDIyIDEyUzE3LjUyIDIgMTEuOTkgMnptNi45MyA2aC0yLjk1Yy0uMzItMS4yNS0uNzgtMi40NS0xLjM4LTMuNTYgMS44NC42MyAzLjM3IDEuOTEgNC4zMyAzLjU2ek0xMiA0LjA0Yy44MyAxLjIgMS40OCAyLjUzIDEuOTEgMy45NmgtMy44MmMuNDMtMS40MyAxLjA4LTIuNzYgMS45MS0zLjk2ek00LjI2IDE0QzQuMSAxMy4zNiA0IDEyLjY5IDQgMTJzLjEtMS4zNi4yNi0yaDMuMzhjLS4wOC42Ni0uMTQgMS4zMi0uMTQgMiAwIC42OC4wNiAxLjM0LjE0IDJINC4yNnptLjgyIDJoMi45NWMuMzIgMS4yNS43OCAyLjQ1IDEuMzggMy41Ni0xLjg0LS42My0zLjM3LTEuOS00LjMzLTMuNTZ6bTIuOTUtOEg1LjA4Yy45Ni0xLjY2IDIuNDktMi45MyA0LjMzLTMuNTZDOC44MSA1LjU1IDguMzUgNi43NSA4LjAzIDh6TTEyIDE5Ljk2Yy0uODMtMS4yLTEuNDgtMi41My0xLjkxLTMuOTZoMy44MmMtLjQzIDEuNDMtMS4wOCAyLjc2LTEuOTEgMy45NnpNMTQuMzQgMTRIOS42NmMtLjA5LS42Ni0uMTYtMS4zMi0uMTYtMiAwLS42OC4wNy0xLjM1LjE2LTJoNC42OGMuMDkuNjUuMTYgMS4zMi4xNiAyIDAgLjY4LS4wNyAxLjM0LS4xNiAyem0uMjUgNS41NmMuNi0xLjExIDEuMDYtMi4zMSAxLjM4LTMuNTZoMi45NWMtLjk2IDEuNjUtMi40OSAyLjkzLTQuMzMgMy41NnpNMTYuMzYgMTRjLjA4LS42Ni4xNC0xLjMyLjE0LTIgMC0uNjgtLjA2LTEuMzQtLjE0LTJoMy4zOGMuMTYuNjQuMjYgMS4zMS4yNiAycy0uMSAxLjM2LS4yNiAyaC0zLjM4eiIvPjwvc3ZnPg==)';
	        	elt.style.backgroundPosition = 'center center';
	        	elt.style.backgroundRepeat = 'no-repeat';
	        	elt.style.backgroundSize = '24px 24px';
				elt.style.position = 'absolute';
	        	elt.style.height = '24px';
	        	elt.style.width = '24px';
				elt.style.zIndex = '1';
				elt.style.top = '11px';
				elt.style.right = '14px';
				mxUtils.setOpacity(elt, 30);
				
				menubar.appendChild(elt);
				ui.buttonContainer.style.right = '40px';
			}
			else
			{
				ui.buttonContainer.style.right = '14px';
			}
        };
        
        refreshMenu();
        
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

            if (ui.menus.tagsWindow != null)
            {
            	ui.menus.tagsWindow.window.fit();
            }

            if (ui.menus.findWindow != null)
            {
            	ui.menus.findWindow.window.fit();
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
