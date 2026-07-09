/**
 * Copyright (c) 2006-2012, JGraph Holdings Ltd
 */
/**
 * Constructs a new graph editor
 */
EditorUi = function(editor, container, lightbox)
{
	mxEventSource.call(this);
	
	this.destroyFunctions = [];
	this.editor = editor || new Editor();
	this.container = container || document.body;
	
	var ui = this;
	var graph = this.editor.graph;
	graph.lightbox = lightbox;

	// Overrides graph bounds to include background images
	var graphGetGraphBounds = graph.getGraphBounds;

	graph.getGraphBounds = function()
	{
		var bounds = graphGetGraphBounds.apply(this, arguments);
		var img = this.backgroundImage;
		
		if (img != null && img.width != null && img.height != null)
		{
			var t = this.view.translate;
			var s = this.view.scale;

			bounds = mxRectangle.fromRectangle(bounds);
			bounds.add(new mxRectangle(
				(t.x + img.x) * s, (t.y + img.y) * s,
				img.width * s, img.height * s));
		}

		return bounds;
	};

	// Faster scrollwheel zoom is possible with CSS transforms
	if (graph.useCssTransforms)
	{
		this.lazyZoomDelay = 0;
	}
	
	// Installs selection state listener
	this.selectionStateListener = mxUtils.bind(this, function(sender, evt)
	{
		this.clearSelectionState();
	});
	
	graph.getSelectionModel().addListener(mxEvent.CHANGE, this.selectionStateListener);
	graph.getModel().addListener(mxEvent.CHANGE, this.selectionStateListener);
	graph.addListener(mxEvent.EDITING_STARTED, this.selectionStateListener);
	graph.addListener(mxEvent.EDITING_STOPPED, this.selectionStateListener);
	graph.getView().addListener('unitChanged', this.selectionStateListener);

	// Disables graph and forced panning in chromeless mode
	if (this.editor.chromeless && !this.editor.editable)
	{
		graph.isEnabled = function() { return false; };

		// Enables text selection in lightbox
		graph.panningHandler.isForcePanningEvent = function(me)
		{
			var source = me.getSource();

			while (source != null && source != graph.container)
			{
				if (source.nodeName === 'foreignObject' ||
					source.nodeName === 'text')
				{
					return false;
				}

				source = source.parentNode;
			}

			return !mxEvent.isPopupTrigger(me.getEvent());
		};

		// Clears selection on start panning
		var panningHandlerStart = graph.panningHandler.start;

		graph.panningHandler.start = function()
		{
			panningHandlerStart.apply(this, arguments);
			mxUtils.clearSelection();
		};
	}
	
    // Creates the user interface
	this.actions = new Actions(this);
	this.menus = this.createMenus();
	
	if (!graph.standalone)
	{
		var vertexStyleIgnored = false;
		var edgeStyleIgnored = false;
		
		// Note: Everything that is not in styles is ignored (styles is augmented below)
		this.setDefaultStyle = function(cell)
		{
			try
			{
				var model = graph.getModel();

				// Edge labels (vertex children of edges) only update the text styles
				// of the edge default so they stay consistent with the edge's own
				// label and never touch the vertex default (see pasteCellStyles)
				var isEdgeLabel = model.isVertex(cell) && model.isEdge(model.getParent(cell));

				if (model.isEdge(cell) || isEdgeLabel)
				{
					edgeStyleIgnored = false;

					if (model.isEdge(cell))
					{
						graph.pasteEdgeStyle = false;
					}
				}
				else
				{
					vertexStyleIgnored = false;
				}

				var style = graph.getCellStyle(cell, false);
				var values = [];
				var keys = [];

				for (var key in style)
				{
					values.push(style[key]);
					keys.push(key);
				}

				// Resets current style
				if (model.isEdge(cell))
				{
					graph.currentEdgeStyle = {};
				}
				else if (!isEdgeLabel)
				{
					graph.currentVertexStyle = {}
				}

				this.fireEvent(new mxEventObject('styleChanged',
					'keys', keys, 'values', values, 'cells', [cell],
					'force', true, 'edgeLabel', isEdgeLabel));

				// Blocks update of default style with style changes
				// and allows change of edge style if default style
				// was changed using this function via app UI
				if (model.isEdge(cell) || isEdgeLabel)
				{
					edgeStyleIgnored = true;

					if (model.isEdge(cell))
					{
						graph.pasteEdgeStyle = true;
					}
				}
				else
				{
					vertexStyleIgnored = true;
				}
			}
			catch (e)
			{
				this.handleError(e);
			}
		};

		this.clearDefaultStyle = function()
		{
			graph.currentEdgeStyle = mxUtils.clone(graph.defaultEdgeStyle);
			graph.currentVertexStyle = mxUtils.clone(graph.defaultVertexStyle);
			graph.pasteEdgeStyle = false;
			edgeStyleIgnored = false;
			vertexStyleIgnored = false;
			
			// Updates UI
			this.fireEvent(new mxEventObject('styleChanged', 'keys', [], 'values', [], 'cells', []));
		};
		
		graph.addListener('cellsInserted', function(sender, evt)
		{
			graph.pasteCellStyles(graph.includeDescendants(evt.getProperty('cells')));
		});
		
		graph.addListener('textInserted', function(sender, evt)
		{
			graph.pasteCellStyles(evt.getProperty('cells'));
		});
		
		this.createDivs();
		this.createUi();
		this.refresh();

		// Disables HTML and text selection
		var textEditing =  mxUtils.bind(this, function(evt)
		{
			if (evt == null)
			{
				evt = window.event;
			}
			
			return graph.isEditing() || (evt != null && this.isSelectionAllowed(evt));
		});
		
		// macOS Cmd/Ctrl+rubberband selects the page text: focusing the contentEditable
		// clipboard element (see showTypingShim) while a drag contests focus lets the
		// browser extend a native selection out to document.body, which sits outside the
		// per-container onselectstart handlers below. The editor never selects the page
		// chrome, so cancel any selectstart that targets the body/root element.
		document.addEventListener('selectstart', function(evt)
		{
			var src = mxEvent.getSource(evt);

			if (src == document.body || src == document.documentElement)
			{
				evt.preventDefault();
			}
		}, true);

		// Disables text selection while not editing and no dialog visible
		if (this.container == document.body && (!this.editor.chromeless ||
			this.editor.editable))
		{
			this.menubarContainer.onselectstart = textEditing;
			this.menubarContainer.onmousedown = textEditing;
			this.toolbarContainer.onselectstart = textEditing;
			this.toolbarContainer.onmousedown = textEditing;
			this.diagramContainer.onselectstart = textEditing;
			this.diagramContainer.onmousedown = textEditing;
			this.sidebarContainer.onselectstart = textEditing;
			this.sidebarContainer.onmousedown = textEditing;
			this.formatContainer.onselectstart = textEditing;
			this.formatContainer.onmousedown = textEditing;
			
			if (this.tabContainer != null)
			{
				// Mouse down is needed for drag and drop
				this.tabContainer.onselectstart = textEditing;
			}

			// Workaround for rubberband selection on iPadOS 16
			// Avoid on previous versions to allow label editing
			if (mxClient.IS_IOS)
			{
				function iOSversion()
				{
					var result = null;

					if (/iP(hone|od|ad)/.test(navigator.platform))
					{
						// supports iOS 2.0 and later: <http://bit.ly/TJjs1V>
						var v = (navigator.appVersion).match(/OS (\d+)_(\d+)_?(\d+)?/);

						try
						{
							result = [parseInt(v[1], 10), parseInt(v[2], 10), parseInt(v[3] || 0, 10)];
						}
						catch (e)
						{
							// ignore
						}
					}

					return result;
				};
				
				var ver = iOSversion();
				
				if (ver != null && ver[0] >= 16)
				{
					mxUtils.setPrefixedStyle(this.menubarContainer.style, 'userSelect', 'none');
					mxUtils.setPrefixedStyle(this.diagramContainer.style, 'userSelect', 'none');
					mxUtils.setPrefixedStyle(this.sidebarContainer.style, 'userSelect', 'none');
					mxUtils.setPrefixedStyle(this.formatContainer.style, 'userSelect', 'none');

					if (this.tabContainer != null)
					{
						mxUtils.setPrefixedStyle(this.tabContainer.style, 'userSelect', 'none');
					}
				}
			}
		}
		
		// And uses built-in context menu while editing
		if (!this.editor.chromeless || this.editor.editable)
		{
			// Allows context menu for links in hints
			var linkHandler = function(evt)
			{
				if (evt != null)
				{
					var source = mxEvent.getSource(evt);
					
					if (source.nodeName == 'A')
					{
						while (source != null)
						{
							if (source.className == 'geHint')
							{
								return true;
							}
							
							source = source.parentNode;
						}
					}
				}
				
				return textEditing(evt);
			};
			
			// Allows browser context menu outside of diagram and sidebar
			this.diagramContainer.oncontextmenu = linkHandler;
		}
		else
		{
			graph.panningHandler.usePopupTrigger = false;
		}
	
		// Contains the main graph instance inside the given panel
		graph.init(this.diagramContainer);
		
	    // Improves line wrapping for in-place editor
	    if (mxClient.IS_SVG && graph.view.getDrawPane() != null)
	    {
	        var root = graph.view.getDrawPane().ownerSVGElement;
	        
	        if (root != null)
	        {
	            root.style.position = 'absolute';
	        }
	    }
	    
		// Creates hover icons
		this.hoverIcons = this.createHoverIcons();

		// Creates inline toolbar
		this.inlineToolbar = (Editor.enableInlineToolbar) ?
			this.createInlineToolbar() : null;

		// Zoom Preview
		this.editor.graph.addListener('zoomPreview', mxUtils.bind(this, function(sender, evt)
		{
			if (this.hoverIcons != null)
			{
				this.hoverIcons.reset();
			}

			if (this.inlineToolbar != null)
			{
				this.inlineToolbar.hide();
			}
		}));

		// Zoom Preview Complete
		this.editor.graph.addListener('zoomPreviewComplete', mxUtils.bind(this, function(sender, evt)
		{
			if (this.inlineToolbar != null)
			{
				this.inlineToolbar.updateSelection();
			}
		}));

		// Hides hover icons when cells are moved
		if (graph.graphHandler != null)
		{
			var graphHandlerStart = graph.graphHandler.start;

			graph.graphHandler.start = function(cell)
			{
				if (ui.hoverIcons != null)
				{
					ui.hoverIcons.reset();
				}

				if (ui.inlineToolbar != null && cell != null)
				{
					ui.inlineToolbar.hide();
				}

				graphHandlerStart.apply(this, arguments);
			};

			var graphHandlerMouseUp = graph.graphHandler.mouseUp;

			graph.graphHandler.mouseUp = function()
			{
				graphHandlerMouseUp.apply(this, arguments);

				if (ui.inlineToolbar != null)
				{
					ui.inlineToolbar.updateSelection();
				}
			};
		}

		// Hides inline toolbar when handles are being dragged
		var vertexHandlerStart = mxVertexHandler.prototype.start;

		mxVertexHandler.prototype.start = function()
		{
			if (ui.inlineToolbar != null)
			{
				ui.inlineToolbar.hide();
			}

			vertexHandlerStart.apply(this, arguments);
		};

		var vertexHandlerMouseUp2 = mxVertexHandler.prototype.mouseUp;

		mxVertexHandler.prototype.mouseUp = function()
		{
			vertexHandlerMouseUp2.apply(this, arguments);

			if (ui.inlineToolbar != null)
			{
				ui.inlineToolbar.updateSelection();
			}
		};

		var edgeHandlerStart = mxEdgeHandler.prototype.start;

		mxEdgeHandler.prototype.start = function()
		{
			if (ui.inlineToolbar != null)
			{
				ui.inlineToolbar.hide();
			}

			edgeHandlerStart.apply(this, arguments);
		};

		var edgeHandlerMouseUp2 = mxEdgeHandler.prototype.mouseUp;

		mxEdgeHandler.prototype.mouseUp = function()
		{
			edgeHandlerMouseUp2.apply(this, arguments);

			if (ui.inlineToolbar != null)
			{
				ui.inlineToolbar.updateSelection();
			}
		};

		// Adds tooltip when mouse is over scrollbars to show space-drag panning option
		mxEvent.addListener(this.diagramContainer, 'mousemove', mxUtils.bind(this, function(evt)
		{
			var off = mxUtils.getOffset(this.diagramContainer);
			
			if (mxEvent.getClientX(evt) - off.x - this.diagramContainer.clientWidth > 0 ||
				mxEvent.getClientY(evt) - off.y - this.diagramContainer.clientHeight > 0)
			{
				this.diagramContainer.setAttribute('title', mxResources.get('panTooltip'));
			}
			else
			{
				this.diagramContainer.removeAttribute('title');
			}
		}));
		
		// Overrides hovericons to disable while space key is pressed
		var hoverIconsIsResetEvent = this.hoverIcons.isResetEvent;
		
		this.hoverIcons.isResetEvent = function(evt, allowShift)
		{
			return ui.isSpaceDown() || hoverIconsIsResetEvent.apply(this, arguments);
		};
		
		this.keydownHandler = mxUtils.bind(this, function(evt)
		{
			// In passive scroll mode, only handle keyboard events when the
			// graph container or one of its children has focus.  This prevents
			// the embedded editor from capturing keystrokes meant for the host.
			if (Editor.passiveScroll)
			{
				var src = mxEvent.getSource(evt);

				if (graph.container == null || (src != graph.container && !graph.container.contains(src) &&
					!graph.isEditing()))
				{
					return;
				}
			}

			if (evt.which == 16 /* Shift */)
			{
				this.shiftDown = true;
			}
			else if (evt.which == 32 /* Space */ && !graph.isEditing())
			{
				var source = mxEvent.getSource(evt);

				if (source.nodeName != 'INPUT' && source.nodeName != 'TEXTAREA' &&
					source.nodeName != 'SELECT' && !source.isContentEditable)
				{
					this.spaceDown = true;
					this.hoverIcons.reset();

					if (graph.container != null)
					{
						graph.container.style.cursor = 'move';
					}

					mxEvent.consume(evt);
				}
			}
			else if (!mxEvent.isConsumed(evt) && evt.keyCode == 27 /* Escape */)
			{
				this.hideDialog(null, true);
			}
		});
	   	
		mxEvent.addListener(document, 'keydown', this.keydownHandler);
		
		this.keyupHandler = mxUtils.bind(this, function(evt)
		{
			if (graph.container != null)
			{
				graph.container.style.cursor = '';
			}

			this.spaceDown = false;
			this.shiftDown = false;
		});
	
		mxEvent.addListener(document, 'keyup', this.keyupHandler);
	    
	    // Forces panning for middle and right mouse buttons
		var panningHandlerIsForcePanningEvent = graph.panningHandler.isForcePanningEvent;
		graph.panningHandler.isForcePanningEvent = function(me)
		{
			if (graph.freehand != null && graph.freehand.isActive())
			{
				return false;
			}

			// Ctrl+left button is reported as right button in FF on Mac
			return panningHandlerIsForcePanningEvent.apply(this, arguments) ||
				ui.isSpaceDown() || (mxEvent.isMouseEvent(me.getEvent()) &&
				(this.usePopupTrigger || !mxEvent.isPopupTrigger(me.getEvent())) &&
				((!mxEvent.isControlDown(me.getEvent()) &&
				mxEvent.isRightMouseButton(me.getEvent())) ||
				mxEvent.isMiddleMouseButton(me.getEvent())));
		};
	
		// Ctrl/Cmd+Enter applies editing value except in Safari where Ctrl+Enter creates
		// a new line (while Enter creates a new paragraph and Shift+Enter stops)
		var cellEditorIsStopEditingEvent = graph.cellEditor.isStopEditingEvent;
		graph.cellEditor.isStopEditingEvent = function(evt)
		{
			return cellEditorIsStopEditingEvent.apply(this, arguments) ||
				(evt.keyCode == 13 && ((!mxClient.IS_SF && mxEvent.isControlDown(evt)) ||
				(mxClient.IS_MAC && mxEvent.isMetaDown(evt)) ||
				(mxClient.IS_SF && mxEvent.isShiftDown(evt))));
		};
				
		// Adds space+wheel for zoom
		var graphIsZoomWheelEvent = graph.isZoomWheelEvent;
		
		graph.isZoomWheelEvent = function()
		{
			return ui.isSpaceDown() || graphIsZoomWheelEvent.apply(this, arguments);
		};
		
		// Hides elements based on width
		var hideToolbarElements = mxUtils.bind(this, function()
		{
			if (this.toolbar != null)
			{
				var sw = window.innerWidth ||
					document.documentElement.clientWidth ||
					document.body.clientWidth;
				var temp = this.toolbar.container.firstChild;
				
				while (temp != null)
				{
					var minWidth = temp.getAttribute('data-min-width');

					if (minWidth != null && parseInt(minWidth) > sw)
					{
						temp.style.display = 'none';
					}
					else
					{
						temp.style.display = '';
					}

					temp = temp.nextSibling;
				}
			}
		});
		
		// Switches toolbar for text editing
		var textMode = false;
		var fontMenu = null;
		var sizeMenu = null;
		var nodes = null;
		
		var updateToolbar = mxUtils.bind(this, function()
		{
			if (this.toolbar != null && textMode != graph.cellEditor.isContentEditing())
			{
				var node = this.toolbar.container.firstChild;
				var newNodes = [];
				
				while (node != null)
				{
					var tmp = node.nextSibling;
					node.parentNode.removeChild(node);
					newNodes.push(node);
					node = tmp;
				}
				
				// Saves references to special items
				var tmp1 = this.toolbar.fontMenu;
				var tmp2 = this.toolbar.sizeMenu;
				
				if (nodes == null)
				{
					this.toolbar.createTextToolbar();
				}
				else
				{
					for (var i = 0; i < nodes.length; i++)
					{
						this.toolbar.container.appendChild(nodes[i]);
					}
					
					// Restores references to special items
					this.toolbar.fontMenu = fontMenu;
					this.toolbar.sizeMenu = sizeMenu;
				}
				
				textMode = graph.cellEditor.isContentEditing();
				fontMenu = tmp1;
				sizeMenu = tmp2;
				nodes = newNodes;
				hideToolbarElements();
			}
		});

		// Updates toolbar when the language changes
		this.addListener('languageChanged', mxUtils.bind(this, function()
		{
			this.destroyWindows(true);
			this.descriptorChanged();
			this.updateStatusAgain();
			updateToolbar();
		}));

		this.addListener('currentThemeChanged', hideToolbarElements);
		mxEvent.addListener(window, 'resize', hideToolbarElements);
		hideToolbarElements();

		// Blocks popup menu on touch devices when dialogs are showing
		graph.isTouchPopupMenuEnabled = function()
		{
			return ui.dialog == null;
		};
		
		// Overrides cell editor to update toolbar
		var cellEditorStartEditing = graph.cellEditor.startEditing;
		graph.cellEditor.startEditing = function()
		{
			cellEditorStartEditing.apply(this, arguments);
			updateToolbar();
			
			if (graph.cellEditor.isContentEditing())
			{
				var updating = false;
				
				var updateCssHandler = function()
				{
					if (!updating)
					{
						updating = true;
					
						window.setTimeout(function()
						{
							var node = graph.getSelectedEditingElement();

							if (node != null)
							{
								var css = mxUtils.getCurrentStyle(node);
		
								if (css != null && ui.toolbar != null)
								{
									ui.toolbar.setFontName(mxUtils.getCssFontFamily(css.fontFamily));
									ui.toolbar.setFontSize(parseInt(css.fontSize));
								}
							}
							
							updating = false;
						}, 0);
					}
				};
				
				mxEvent.addListener(graph.cellEditor.textarea, 'input', updateCssHandler)
				mxEvent.addListener(graph.cellEditor.textarea, 'touchend', updateCssHandler);
				mxEvent.addListener(graph.cellEditor.textarea, 'mouseup', updateCssHandler);
				mxEvent.addListener(graph.cellEditor.textarea, 'keyup', updateCssHandler);
				updateCssHandler();
			}
		};
		
		// Updates toolbar and handles possible errors
		var cellEditorStopEditing = graph.cellEditor.stopEditing;
		graph.cellEditor.stopEditing = function(cell, trigger)
		{
			try
			{
				cellEditorStopEditing.apply(this, arguments);
				updateToolbar();
			}
			catch (e)
			{
				ui.handleError(e);
			}
		};
		
	    // Enables scrollbars and sets cursor style for the container
		graph.container.setAttribute('tabindex', '0');
	   	graph.container.style.cursor = 'default';

		// Workaround for page scroll if embedded via iframe
		if (window.self === window.top && graph.container.parentNode != null)
		{
			try
			{
				graph.container.focus();
			}
			catch (e)
			{
				// ignores error in old versions of IE
			}
		}
	
	   	// Keeps graph container focused on mouse down
	   	var graphFireMouseEvent = graph.fireMouseEvent;
	   	graph.fireMouseEvent = function(evtName, me, sender)
	   	{
			try
			{
				if (evtName == mxEvent.MOUSE_DOWN)
				{
					this.container.focus();
				}
				
				graphFireMouseEvent.apply(this, arguments);
			}
			catch (e)
			{
				ui.handleError(e);
			}
	   	};

		// Adds error handling for foldCells
		var graphFoldCells = graph.foldCells;
		graph.foldCells = function(collapse, recurse, cells, checkFoldable, evt)
		{
			try
			{
				graphFoldCells.apply(this, arguments);
			}
			catch (e)
			{
				ui.handleError(e);
			}
		};
	
	   	// Configures automatic expand on mouseover
		graph.popupMenuHandler.autoExpand = true;
	
	    // Installs context menu
		if (this.menus != null)
		{
			graph.popupMenuHandler.factoryMethod = mxUtils.bind(this, function(menu, cell, evt)
			{
				this.menus.createPopupMenu(menu, cell, evt);
			});
		}
		
		// Hides context menu
		mxEvent.addGestureListeners(document, mxUtils.bind(this, function(evt)
		{
			graph.popupMenuHandler.hideMenu();
		}));
	
	    // Create handler for key events
		this.keyHandler = this.createKeyHandler(editor);
	    
		// Getter for key handler
		this.getKeyHandler = function()
		{
			return keyHandler;
		};

		graph.connectionHandler.addListener(mxEvent.CONNECT, function(sender, evt)
		{
			var cells = [evt.getProperty('cell')];
			
			if (evt.getProperty('terminalInserted'))
			{
				cells.push(evt.getProperty('terminal'));

				window.setTimeout(function()
				{
					if (ui.hoverIcons != null)
					{
						ui.hoverIcons.update(graph.view.getState(cells[cells.length - 1]));
					}
				}, 0);
			}
			
			graph.pasteCellStyles(cells);
		});

		// Shows current edge style and shape in toolbar
		var edgeStyleImage = null;
		var edgeShapeImage = null;

		var updateEdgeImages = mxUtils.bind(this, function()
		{
			if (this.toolbar != null)
			{
				var ss = this.getSelectionState();

				if (graph.isEnabled() && ss.edges.length > 0)
				{
					if (this.toolbar.edgeStyleMenu != null)
					{
						var src = this.getImageForEdgeStyle(ss.style);

						if (ss.edges.length == 1 && ss.style[mxConstants.STYLE_SHAPE] == 'arrow')
						{
							src = Format.straightImage.src;
						}

						this.toolbar.edgeStyleMenu.style.backgroundImage = 'url(' + src + ')';
					}

					if (this.toolbar.edgeShapeMenu != null)
					{
						this.toolbar.edgeShapeMenu.style.backgroundImage = 'url(' +
							this.getImageForEdgeShape(ss.style) + ')';
					}
				}
				else
				{
					if (this.toolbar.edgeStyleMenu != null)
					{
						this.toolbar.edgeStyleMenu.style.backgroundImage =
							'url(' + edgeStyleImage + ')';
					}

					if (this.toolbar.edgeShapeMenu != null)
					{
						this.toolbar.edgeShapeMenu.style.backgroundImage ='url(' + edgeShapeImage + ')';
					}
				}
			}
		});

		graph.selectionModel.addListener(mxEvent.CHANGE, updateEdgeImages);
		graph.getModel().addListener(mxEvent.CHANGE, updateEdgeImages);

		this.addListener('styleChanged', mxUtils.bind(this, function(sender, evt)
		{
			var force = evt.getProperty('force');
			
			// Checks if edges and/or vertices were modified
			if (this.updateDefaultStyle || force)
			{
				graph.copyCellStyles(evt.getProperty('cells'),
					evt.getProperty('keys'), evt.getProperty('values'),
					graph.currentVertexStyle, graph.currentEdgeStyle,
					vertexStyleIgnored, edgeStyleIgnored, evt.getProperty('edgeLabel'));
			}

			if (this.toolbar != null)
			{
				this.toolbar.setFontName(graph.currentVertexStyle['fontFamily'] ||
					Menus.prototype.defaultFont);
				this.toolbar.setFontSize(graph.currentVertexStyle['fontSize'] ||
					Menus.prototype.defaultFontSize);
				var ss = this.getSelectionState();
				
				if (this.toolbar.edgeStyleMenu != null)
				{
					edgeStyleImage = this.getImageForEdgeStyle(graph.currentEdgeStyle);

					if (ss.edges.length == 0)
					{
						this.toolbar.edgeStyleMenu.style.backgroundImage = 'url(' + edgeStyleImage + ')';
					}
				}
				
				if (this.toolbar.edgeShapeMenu != null)
				{
					edgeShapeImage = this.getImageForEdgeShape(graph.currentEdgeStyle);

					if (ss.edges.length == 0)
					{
						this.toolbar.edgeShapeMenu.style.backgroundImage = 'url(' + edgeShapeImage + ')';
					}
				}
			}
		}));
		
		// Update font size and font family labels
		if (this.toolbar != null)
		{
			var update = mxUtils.bind(this, function()
			{
				var ff = graph.currentVertexStyle['fontFamily'] || 'Helvetica';
				var fs = String(graph.currentVertexStyle['fontSize'] || '12');
			    	var state = graph.getView().getState(graph.getSelectionCell());
			    	
			    	if (state != null)
			    	{
			    		ff = state.style[mxConstants.STYLE_FONTFAMILY] || ff;
			    		fs = state.style[mxConstants.STYLE_FONTSIZE] || fs;
			    		
			    		if (ff.length > 10)
			    		{
			    			ff = ff.substring(0, 8) + '...';
			    		}
			    	}
			    	
			    	this.toolbar.setFontName(ff);
			    	this.toolbar.setFontSize(fs);
			});
			
		    graph.getSelectionModel().addListener(mxEvent.CHANGE, update);
		    graph.getModel().addListener(mxEvent.CHANGE, update);
		}
		
		// Makes sure the current layer is visible when cells are added
		graph.addListener(mxEvent.CELLS_ADDED, function(sender, evt)
		{
			var cells = evt.getProperty('cells');
			var parent = evt.getProperty('parent');
			
			if (parent != null && graph.getModel().isLayer(parent) &&
				!graph.isCellVisible(parent) && cells != null &&
				cells.length > 0)
			{
				graph.getModel().setVisible(parent, true);
			}
		});
		
		// Selects parent layer for current selection
		if (Graph.selectParentLayer)
		{
			graph.selectionModel.addListener(mxEvent.CHANGE, function()
			{
				if (graph.isEnabled() && !graph.isSelectionEmpty())
				{
					var layer = graph.getLayerForCells(graph.getSelectionCells());

					if (layer != null)
					{
						graph.setDefaultParent(layer);
					}
				}
			});
		}

		// Global handler to hide the current menu
		this.gestureHandler = mxUtils.bind(this, function(evt)
		{
			if (this.isHideCurrentMenuEvent(evt))
			{
				this.hideCurrentMenu();
			}
		});
		
		mxEvent.addGestureListeners(document, this.gestureHandler);
	
		// Updates the editor UI after the window has been resized or the orientation changes
		// Timeout is workaround for old IE versions which have a delay for DOM client sizes.
		var resizeThread = null;

		this.resizeHandler = mxUtils.bind(this, function()
	   	{
			if (resizeThread != null)
			{
				window.clearTimeout(resizeThread);
			}

			resizeThread = window.setTimeout(mxUtils.bind(this, function()
			{
				resizeThread = null;
				this.windowResized();
			}), 100);
	   	});
		
	   	mxEvent.addListener(window, 'resize', this.resizeHandler);
	   	
	   	this.orientationChangeHandler = mxUtils.bind(this, function()
	   	{
	   		this.refresh();
	   	});
	   	
	   	mxEvent.addListener(window, 'orientationchange', this.orientationChangeHandler);
	   	
		// Workaround for bug on iOS see
		// http://stackoverflow.com/questions/19012135/ios-7-ipad-safari-landscape-innerheight-outerheight-layout-issue
		if (mxClient.IS_IOS && !window.navigator.standalone && typeof Menus !== 'undefined')
		{
			this.scrollHandler = mxUtils.bind(this, function()
		   	{
		   		window.scrollTo(0, 0);
		   	});
			
		   	mxEvent.addListener(window, 'scroll', this.scrollHandler);
		}
	
		/**
		 * Sets the initial scrollbar locations after a file was loaded.
		 */
		this.editor.addListener('resetGraphView', mxUtils.bind(this, function()
		{
			this.resetScrollbars();
		}));
		
		/**
		 * Repaints the grid.
		 */
		this.addListener('gridEnabledChanged', mxUtils.bind(this, function()
		{
			graph.view.validateBackground();
		}));
		
		this.addListener('backgroundColorChanged', mxUtils.bind(this, function()
		{
			graph.view.validateBackground();
		}));
	
		/**
		 * Repaints the grid.
		 */
		graph.addListener('gridSizeChanged', mxUtils.bind(this, function()
		{
			if (graph.isGridEnabled())
			{
				graph.view.validateBackground();
			}
		}));
		
	   	// Resets UI, updates action and menu states
	   	this.editor.resetGraph();
	}

	this.init();
	
	if (!graph.standalone)
	{
		this.open();
	}
};

/**
 * Global config that specifies if the compact UI elements should be used.
 */
 EditorUi.compactUi = true;

 /**
  * Static method for pasing PNG files.
  */
 EditorUi.parsePng = function(f, fn, error)
 {
	 var pos = 0;
	 
	 function fread(d, count)
	 {
		 var start = pos;
		 pos += count;
		 
		 return d.substring(start, pos);
	 };
	 
	 // Reads unsigned long 32 bit big endian
	 function _freadint(d)
	 {
		 var bytes = fread(d, 4);
		 
		 return bytes.charCodeAt(3) + (bytes.charCodeAt(2) << 8) +
			 (bytes.charCodeAt(1) << 16) + (bytes.charCodeAt(0) << 24);
	 };
	 
	 // Checks signature
	 if (fread(f,8) != String.fromCharCode(137) + 'PNG' + String.fromCharCode(13, 10, 26, 10))
	 {
		 if (error != null)
		 {
			 error();
		 }
		 
		 return;
	 }
	 
	 // Reads header chunk
	 fread(f,4);
	 
	 if (fread(f,4) != 'IHDR')
	 {
		 if (error != null)
		 {
			 error();
		 }
		 
		 return;
	 }
	 
	 fread(f, 17);
	 
	 do
	 {
		 var n = _freadint(f);
		 var type = fread(f,4);
		 
		 if (fn != null)
		 {
			 if (fn(pos - 8, type, n))
			 {
				 break;
			 }
		 }
		 
		 value = fread(f,n);
		 fread(f,4);
		 
		 if (type == 'IEND')
		 {
			 break;
		 }
	 }
	 while (n);
 };
 
// Extends mxEventSource
mxUtils.extend(EditorUi, mxEventSource);

/**
 * Specifies the size of the split bar.
 */
EditorUi.prototype.splitSize = (mxClient.IS_TOUCH || mxClient.IS_POINTER) ? 12 : 8;

/**
 * Specifies the width of the format panel should be enabled. Default is true.
 */
EditorUi.prototype.formatEnabled = true;

/**
 * Specifies the width of the format panel. Default is 240.
 */
EditorUi.prototype.formatWidth = 240;

/**
 * Specifies the default sidebar width.
 */
EditorUi.prototype.defaultSidebarWidth = Math.min(screen.width / 2,
	(urlParams['sidebar-entries'] != 'large') ? 232 : 242);

/**
 * Specifies the position of the horizontal split bar.
 */
EditorUi.prototype.hsplitPosition = (screen.width <= Editor.smallScreenWidth) ? 0 :
	EditorUi.prototype.defaultSidebarWidth;

/**
 * Specifies if animations are allowed in <executeLayout>. Default is true.
 */
EditorUi.prototype.allowAnimation = true;

/**
 * Default is 2.
 */
EditorUi.prototype.lightboxMaxFitScale = 2;

/**
 * Default is 4.
 */
EditorUi.prototype.lightboxVerticalDivider = 4;

/**
 * Specifies if single click on horizontal split should collapse sidebar. Default is false.
 */
EditorUi.prototype.hsplitClickEnabled = false;

/**
 * Whether the default styles should be updated when styles are changed. Default is true.
 */
EditorUi.prototype.updateDefaultStyle = false;

/**
 * Whether the default styles should be updated when styles are changed. Default is true.
 */
EditorUi.prototype.spaceDown = false;

/**
 * Whether the default styles should be updated when styles are changed. Default is true.
 */
EditorUi.prototype.shiftDown = false;

/**
 * Installs the listeners to update the action states.
 */
EditorUi.prototype.init = function()
{
	var graph = this.editor.graph;
	
	if (!graph.standalone)
	{
		if (urlParams['shape-picker'] != '0')
		{
			this.installShapePicker();
		}
		
		// Hides tooltips and connection points when scrolling
		mxEvent.addListener(graph.container, 'scroll', mxUtils.bind(this, function()
		{
			graph.tooltipHandler.hide();

			if (graph.connectionHandler != null && graph.connectionHandler.constraintHandler != null)
			{
				graph.connectionHandler.constraintHandler.reset();
			}
		}));
		
		// Hides tooltip on escape
		graph.addListener(mxEvent.ESCAPE, mxUtils.bind(this, function()
		{
			graph.tooltipHandler.hide();
			var rb = graph.getRubberband();
			
			if (rb != null)
			{
				rb.cancel();
			}
		}));
		
		mxEvent.addListener(graph.container, 'keydown', mxUtils.bind(this, function(evt)
		{
			this.onKeyDown(evt);
			this.onKeyPress(evt);
		}));

		// Hidden textarea that captures keyboard input (including IME) when a
		// cell is selected but not being edited. This ensures the OS engages
		// IME from the very first keystroke on CJK and other input methods.
		this.installTypingShim();

		// Updates action states
		this.addUndoListener();
		this.addBeforeUnloadListener();
		
		graph.getSelectionModel().addListener(mxEvent.CHANGE, mxUtils.bind(this, function()
		{
			this.updateActionStates();
		}));
		
		graph.getModel().addListener(mxEvent.CHANGE, mxUtils.bind(this, function()
		{
			this.updateActionStates();
		}));
		
		// Changes action states after change of default parent
		var graphSetDefaultParent = graph.setDefaultParent;
		var ui = this;
		
		this.editor.graph.setDefaultParent = function()
		{
			graphSetDefaultParent.apply(this, arguments);
			ui.updateActionStates();
		};
		
		// Hack to make showLinkDialog and editLink available in vertex handler
		graph.showLinkDialog = mxUtils.bind(ui, ui.showLinkDialog);
		graph.editLink = ui.actions.get('editLink').funct;
		
		this.updateActionStates();

		// Clipboard overrides mxClipboard globally and must not be installed
		// by read-only chromeless instances (e.g. presentation mode, lightbox),
		// otherwise destroying them leaves mxClipboard.copy/cut/paste pointing
		// at a dead ui and breaks clipboard in the surviving editor.
		if (!this.editor.chromeless || this.editor.editable)
		{
			this.initClipboard();
		}

		this.initCanvas();
		
		if (this.format != null)
		{
			this.format.init();
		}
	}
};

/**
 * Returns information about the current selection.
 */
EditorUi.prototype.clearSelectionState = function()
{
	this.selectionState = null;
};

/**
 * Returns information about the current selection.
 */
EditorUi.prototype.getSelectionState = function()
{
	if (this.selectionState == null)
	{
		this.selectionState = this.createSelectionState();
	}
	
	return this.selectionState;
};

/**
 * Returns information about the current selection.
 */
EditorUi.prototype.createSelectionState = function()
{
	var graph = this.editor.graph;
	var cells = graph.getSelectionCells();
	var result = this.initSelectionState();
	var initial = true;
	
	for (var i = 0; i < cells.length; i++)
	{
		var style = graph.getCurrentCellStyle(cells[i]);
	
		if (mxUtils.getValue(style, mxConstants.STYLE_EDITABLE, '1') != '0')
		{
			this.updateSelectionStateForCell(result, cells[i], cells, initial);
			initial = false;
		}
	}

	this.updateSelectionStateForTableCells(result);

	if (Editor.enableCustomProperties)
	{
		result.customProperties = {};
		var vertices = result.vertices;
		var edges = result.edges;
		
		for (var i = 0; i < vertices.length; i++) 
		{
			this.findCommonProperties(vertices[i],
				result.customProperties,
				i == 0, result);
		}
		
		for (var i = 0; i < edges.length; i++) 
		{
			this.findCommonProperties(edges[i], result.customProperties,
				vertices.length == 0 && i == 0, result);
		}
	}
	
	return result;
};

/**
 * Returns information about the current selection.
 */
EditorUi.prototype.findCommonProperties = function(cell, properties, addAll, sstate)
{
	var addProperties = mxUtils.bind(this, function(custProperties)
	{
		if (custProperties != null)
		{
			if (addAll)
			{
				for (var i = 0; i < custProperties.length; i++)
				{
					properties[custProperties[i].name] = custProperties[i];
				}
			}
			else
			{
				for (var key in properties)
				{
					if (key != null)
					{
						var found = false;
						
						for (var i = 0; i < custProperties.length; i++)
						{
							if (custProperties[i].name == key &&
								custProperties[i].type == properties[key].type)
							{
								found = true;
								break;
							}
						}
						
						if (!found)
						{
							delete properties[key];
						}
					}
				}
			}
		}
	});
	
	var graph = this.editor.graph;
	var view = graph.view;
	var state = view.getState(cell);
	
	if (state != null && state.shape != null)
	{
		// Adds common properties to all shapes
		if (!state.shape.commonCustomPropAdded)
		{
			state.shape.commonCustomPropAdded = true;
			state.shape.customProperties = state.shape.customProperties || [];
			
			// Adds custom colors from stencils
			if (state.shape != null && state.shape.stencil != null &&
				state.shape.stencil.desc != null)
			{
				var stencil = state.shape.stencil
				var handledKeys = [];
				
				var getStencilColors = mxUtils.bind(this, function(nodeName)
				{
					var nodes = stencil.desc.getElementsByTagName(nodeName);
					var props = [];

					for (var i = 0; i < nodes.length; i++)
					{
						var name = nodes[i].getAttribute('color');

						if (!mxUtils.isValidColor(name) && !handledKeys[name] &&
							name != 'fill' && name != 'stroke' && name != 'font')
						{
							handledKeys[name] = true;
							var label = nodes[i].getAttribute('name');
							label = (label != null) ? label :
								Editor.getLabelForStylename(name);
							var defaultValue = nodes[i].getAttribute('default');
							var defaultColor = stencil.getDefaultColorValue(
								nodes[i], graph);
							var undefinedValue = defaultValue;

							// If the value of the default attribute is none then the
							// style when the color is checked in the UI is 'default'
							if (defaultValue == mxConstants.NONE)
							{
								defaultValue = 'default';
							}

							props.push({name: name, type: 'color', primary:
								nodes[i].getAttribute('primary') != 'false',
								defVal: defaultValue, defaultColor: defaultColor,
								undefinedColor: undefinedValue, dispName: label});
						}
					}
					
					return props;
				});

				Array.prototype.push.apply(state.shape.customProperties,
						getStencilColors('fillcolor'));
				Array.prototype.push.apply(state.shape.customProperties,
						getStencilColors('strokecolor'));
				Array.prototype.push.apply(state.shape.customProperties,
						getStencilColors('fontcolor'));

				// Adds boolean properties for conditional label bounds
				var lbNodes = stencil.desc.getElementsByTagName('labelBounds');

				for (var i = 0; i < lbNodes.length; i++)
				{
					var name = lbNodes[i].getAttribute('if');

					if (name != null && !handledKeys[name])
					{
						handledKeys[name] = true;
						state.shape.customProperties.push({name: name,
							dispName: (name == 'boundedLbl') ? 'Bounded Label' :
							Editor.getLabelForStylename(name),
							type: 'bool', defVal: false});
					}
				}
			}

			// Adds common vertex/edge properties
			if (state.cell.vertex)
			{
				Array.prototype.push.apply(state.shape.customProperties,
					Editor.commonVertexProperties);					
			}
			else
			{
				Array.prototype.push.apply(state.shape.customProperties,
					Editor.commonEdgeProperties);
			}
		}

		addProperties(state.shape.customProperties);
	}
	
	//This currently is not needed but let's keep it in case we needed in the future
	var userCustomProp = cell.getAttribute('customProperties');
	
	if (userCustomProp != null)
	{
		try
		{
			addProperties(JSON.parse(userCustomProp));
		}
		catch(e)
		{
			// ignore
		}
	}
};

/**
 * Returns information about the current selection.
 */
EditorUi.prototype.initSelectionState = function()
{
	return {vertices: [], edges: [], cells: [], x: null, y: null, width: null, height: null,
		style: {}, containsImage: false, containsLabel: false, fill: true, glass: true, html: true,
		rounded: true, autoSize: false, image: false, shadow: true, lineJumps: true, resizable: true,
		table: false, cell: false, row: false, movable: true, rotatable: true, stroke: true,
		swimlane: false, transparentBounds: false, unlocked: this.editor.graph.isEnabled(),
		connections: false, connectedEdges: false};
};

/**
 * Adds information about current selected table cells range.
 */
EditorUi.prototype.updateSelectionStateForTableCells = function(result)
{
	if (result.cells.length > 1 && result.cell)
	{
		var cells = mxUtils.sortCells(result.cells);
		var model = this.editor.graph.model;
		var parent = model.getParent(cells[0]);
		var table = model.getParent(parent);

		if (parent != null && table != null)
		{
			var col = parent.getIndex(cells[0]);
			var row = table.getIndex(parent);
			var lastspan = null;
			var colspan = 1;
			var rowspan = 1;
			var index = 0;

			var nextRowCell = (row < table.getChildCount() - 1) ?
				model.getChildAt(model.getChildAt(
					table, row + 1), col) : null;
			
			while (index < cells.length - 1)
			{
				var next = cells[++index];
				
				if (nextRowCell != null && nextRowCell == next &&
					(lastspan == null || colspan == lastspan))
				{
					lastspan = colspan;
					colspan = 0;
					rowspan++;
					parent = model.getParent(nextRowCell);
					nextRowCell = (row + rowspan < table.getChildCount()) ?
						model.getChildAt(model.getChildAt(
							table, row + rowspan), col) : null;
				}

				var state = this.editor.graph.view.getState(next);

				if (next == model.getChildAt(parent, col + colspan) && state != null &&
					mxUtils.getValue(state.style, 'colspan', 1) == 1 &&
					mxUtils.getValue(state.style, 'rowspan', 1) == 1)
				{
					colspan++;
				}
				else
				{
					break;
				}
			}

			if (index == rowspan * colspan - 1)
			{
				result.mergeCell = cells[0];
				result.colspan = colspan;
				result.rowspan = rowspan;
			}
		}
	}
};

/**
 * Returns information about the current selection.
 */
EditorUi.prototype.windowResized = function()
{
	window.setTimeout(mxUtils.bind(this, function()
	{
		if (this.editor != null && this.editor.graph != null)
		{
			this.editor.graph.sizeDidChange();
		}
	}), 0);
};

/**
 * Returns information about the current selection.
 */
EditorUi.prototype.createTimeout = function(timeout, fn, error)
{
	var acceptResponse = true;
	var result = null;

	var handleError = mxUtils.bind(this, function(e)
	{
		if (result.clear())
		{
			acceptResponse = false;
			e = (e != null) ? e : {code: App.ERROR_TIMEOUT,
				message: mxResources.get('timeout'),
				retry: mxUtils.bind(this, function()
				{
					this.createTimeout(timeout, fn, error);
				})};

			if (error != null)
			{
				error(e);
			}
			else
			{
				this.handleError(e);
			}
		}
	});
	
	var timeoutThread = window.setTimeout(handleError,
		(timeout != null) ? timeout : this.timeout);

	var result = {
		clear: function()
		{
			window.clearTimeout(timeoutThread);

			return acceptResponse;
		},
		isAlive: function()
		{
			return acceptResponse;
		}
	};

	if (fn != null)
	{
		this.tryAndHandle(mxUtils.bind(this, function()
		{
			fn(result);
		}), handleError);
	}

	return result;
};

/**
 * Returns information about the current selection.
 */
EditorUi.prototype.tryAndHandle = function(fn, error)
{
	try
	{
		fn();
	}
	catch (e)
	{
		if (error != null)
		{
			error(e);
		}
		else
		{
			this.handleError(e);
		}
	}
};

/**
 * Returns information about the current selection.
 */
EditorUi.prototype.removeUserDefinedDarkColors = function(cells, includeLabels, background)
{
	var graph = this.editor.graph;
	cells = (cells != null) ? cells : graph.getSelectionCells();
	var keys = Graph.colorStyles;

	// Element for parsing HTML labels and implementing dark mode colors
	var tempDiv = document.createElement('div');
	
	graph.model.beginUpdate();
	try
	{
		for (var i = 0; i < cells.length; i++)
		{
			if (graph.model.isEdge(cells[i]) || graph.model.isVertex(cells[i]))
			{
				// Removes user-defined dark colors in styles
				var style = graph.getCellStyle(cells[i], false);

				if (style != null)
				{
					for (var j = 0; j < keys.length; j++)
					{
						try
						{
							var value = style[keys[j]];

							if (mxUtils.isLightDarkColor(value))
							{
								var cssColor = mxUtils.getLightDarkColor(value);
								graph.setCellStyles(keys[j], cssColor.light, [cells[i]]);
							}
						}
						catch (e)
						{
							// ignore
						}
					}
				}

				// Removes user-defined dark colors in labels
				if (includeLabels && graph.isHtmlLabel(cells[i]) &&
					mxUtils.getValue(style, 'html', '0') != '0')
				{
					tempDiv.innerHTML = Graph.sanitizeHtml(graph.getLabel(cells[i]));
					
					if (Graph.addLightDarkColors(tempDiv, null, null, function(elt, key, value)
					{
						if (mxUtils.isLightDarkColor(value))
						{
							var cssColor = mxUtils.getLightDarkColor(value);
							elt.style.setProperty(key, cssColor.light);

							return true;
						}
						else
						{
							return false;
						}
					}))
					{
						graph.cellLabelChanged(cells[i], tempDiv.innerHTML);
					}
				}
			}
		}
		
		// Removes user-defined dark background color
		if (background && mxUtils.isLightDarkColor(graph.background))
		{
			var cssColor = mxUtils.getLightDarkColor(graph.background);
			var change = new ChangePageSetup(this, cssColor.light);
			change.ignoreImage = true;

			graph.model.execute(change);
		}
	}
	finally
	{
		graph.model.endUpdate();
	}

	return cells;
};

/**
 * Returns information about the current selection.
 */
EditorUi.prototype.updateSelectionStateForCell = function(result, cell, cells, initial)
{
	var graph = this.editor.graph;
	result.cells.push(cell);
	
	if (graph.getModel().isVertex(cell))
	{
		result.connections = graph.model.getEdgeCount(cell) > 0;
		result.unlocked = result.unlocked && !graph.isCellLocked(cell);
		result.resizable = result.resizable && graph.isCellResizable(cell);
		result.rotatable = result.rotatable && graph.isCellRotatable(cell);
		result.movable = result.movable && graph.isCellMovable(cell) &&
			!graph.isTableRow(cell) && !graph.isTableCell(cell);
		result.swimlane = result.swimlane || graph.isSwimlane(cell);
		result.transparentBounds = result.transparentBounds || graph.isTransparentBounds(cell);
		result.table = result.table || graph.isTable(cell);
		result.cell = result.cell || graph.isTableCell(cell);
		result.row = result.row || graph.isTableRow(cell);
		result.vertices.push(cell);
		var geo = graph.getCellGeometry(cell);
		
		if (geo != null)
		{
			if (geo.width > 0)
			{
				if (result.width == null)
				{
					result.width = geo.width;
				}
				else if (result.width != geo.width)
				{
					result.width = '';
				}
			}
			else
			{
				result.containsLabel = true;
			}
			
			if (geo.height > 0)
			{
				if (result.height == null)
				{
					result.height = geo.height;
				}
				else if (result.height != geo.height)
				{
					result.height = '';
				}
			}
			else
			{
				result.containsLabel = true;
			}
			
			if (!geo.relative || geo.offset != null)
			{
				var x = (geo.relative) ? geo.offset.x : geo.x;
				var y = (geo.relative) ? geo.offset.y : geo.y;
				
				if (result.x == null)
				{
					result.x = x;
				}
				else if (result.x != x)
				{
					result.x = '';
				}
				
				if (result.y == null)
				{
					result.y = y;
				}
				else if (result.y != y)
				{
					result.y = '';
				}
			}
		}
	}
	else if (graph.getModel().isEdge(cell))
	{
		result.edges.push(cell);
		result.connections = true;
		result.resizable = false;
		result.rotatable = false;
		result.movable = false;
		// Tracks edges with at least one connected end so that the turn action
		// can rotate fully unconnected edges by 90 degrees (see issue #5076)
		result.connectedEdges = result.connectedEdges ||
			graph.model.getTerminal(cell, true) != null ||
			graph.model.getTerminal(cell, false) != null;
	}

	var state = graph.view.getState(cell);
	
	if (state != null)
	{
		result.html = result.html && graph.isHtmlLabel(cell);
		result.autoSize = result.autoSize || graph.isAutoSizeState(state);
		result.glass = result.glass && graph.isGlassState(state);
		result.rounded = result.rounded && graph.isRoundedState(state);
		result.lineJumps = result.lineJumps && graph.isLineJumpState(state);
		result.image = result.image || graph.isImageState(state);
		result.shadow = result.shadow && graph.isShadowState(state);
		result.fill = result.fill && graph.isFillState(state);
		result.gradient = result.fill && graph.isGradientState(state);
		result.stroke = result.stroke && graph.isStrokeState(state);
		
		var shape = mxUtils.getValue(state.style, mxConstants.STYLE_SHAPE, null);
		result.containsImage = result.containsImage || shape == 'image';
		graph.mergeStyle(state.style, result.style, initial);
	}
};

/**
 * Returns true if the given event should start editing. This implementation returns true.
 */
EditorUi.prototype.installShapePicker = function()
{
	var graph = this.editor.graph;
	var ui = this;

	// Uses this event to process mouseDown to check the selection state before it is changed
	graph.addListener(mxEvent.FIRE_MOUSE_EVENT, mxUtils.bind(this, function(sender, evt)
	{
		if (evt.getProperty('eventName') == 'mouseDown')
		{
			ui.hideShapePicker();
		}
	}));

	var hidePicker = mxUtils.bind(this, function()
	{
		ui.hideShapePicker(true);
	});
	
	graph.addListener('wheel', hidePicker);
	graph.addListener(mxEvent.ESCAPE, hidePicker);
	graph.view.addListener(mxEvent.SCALE, hidePicker);
	graph.view.addListener(mxEvent.SCALE_AND_TRANSLATE, hidePicker);
	graph.getSelectionModel().addListener(mxEvent.CHANGE, hidePicker);
	
	// Counts as popup menu
	var popupMenuHandlerIsMenuShowing = graph.popupMenuHandler.isMenuShowing;
	 
	graph.popupMenuHandler.isMenuShowing = function()
	{
		return popupMenuHandlerIsMenuShowing.apply(this, arguments) ||
			ui.shapePicker != null || ui.currentMenu != null;
	};
	
	// Adds dbl click dialog for inserting shapes
	var graphDblClick = graph.dblClick;
	
	graph.dblClick = function(evt, cell)
	{
		if (this.isEnabled())
		{
			// Offers a shape to connect when double clicking an unconnected edge
			// terminal (edge line or an orthogonal/elbow terminal handle, which
			// routes here; straight-edge handles are handled via the edge handler)
			var terminal = (cell != null && ui.sidebar != null && !mxEvent.isShiftDown(evt) &&
				!graph.isCellLocked(cell) && graph.getLockedGroupAncestor(
				graph.model.getParent(cell)) == null) ?
				ui.getDoubleClickTerminalForEvent(evt, cell) : null;

			if (cell == null && ui.sidebar != null && !mxEvent.isShiftDown(evt) &&
				!graph.isCellLocked(graph.getDefaultParent()))
			{
				var pt = mxUtils.convertPoint(this.container, mxEvent.getClientX(evt), mxEvent.getClientY(evt));
				mxEvent.consume(evt);

				// Asynchronous to avoid direct insert after double tap
				window.setTimeout(mxUtils.bind(this, function()
				{
					ui.showShapePicker(pt.x, pt.y);
				}), 30);
			}
			else if (terminal != null)
			{
				mxEvent.consume(evt);

				// Asynchronous to avoid direct insert after double tap
				window.setTimeout(mxUtils.bind(this, function()
				{
					ui.showShapePickerForEdgeTerminal(cell, terminal.source, terminal.point);
				}), 30);
			}
			else
			{
				graphDblClick.apply(this, arguments);
			}
		}
	};

	// Shows the shape picker for double click on a straight-edge terminal handle
	// (fired by mxEdgeHandler.removePoint for unconnected terminals)
	graph.addListener('doubleClickEdgeTerminal', mxUtils.bind(this, function(sender, evt)
	{
		var cell = evt.getProperty('cell');
		var point = evt.getProperty('point');

		if (cell != null && point != null && !graph.isCellLocked(cell) &&
			graph.getLockedGroupAncestor(graph.model.getParent(cell)) == null)
		{
			var source = evt.getProperty('source');

			// Asynchronous to avoid direct insert after double tap
			window.setTimeout(mxUtils.bind(this, function()
			{
				ui.showShapePickerForEdgeTerminal(cell, source, point);
			}), 30);
		}
	}));

	if (this.hoverIcons != null)
	{
		this.hoverIcons.addListener('reset', mxUtils.bind(this, function()
		{
			if (this.hoverIcons.shapePickerHoverDiv != null)
			{
				this.hoverIcons.shapePickerHoverDiv = null;
				ui.hideShapePicker(true);
			}
		}));
		var hoverIconsDrag = this.hoverIcons.drag;
		
		this.hoverIcons.drag = function()
		{
			ui.hideShapePicker();
			hoverIconsDrag.apply(this, arguments);
		};
		
		var hoverIconsExecute = this.hoverIcons.execute;
		
		this.hoverIcons.execute = function(state, dir, me)
		{
			var evt = me.getEvent();
			
			if (!this.graph.isCloneEvent(evt) && !mxEvent.isShiftDown(evt))
			{
				this.graph.connectVertex(state.cell, dir, this.graph.defaultEdgeLength, evt, null, null, mxUtils.bind(this, function(x, y, execute)
				{
					var temp = graph.getCompositeParent(state.cell);
					var geo = graph.getCellGeometry(temp);
					me.consume();
					
					while (temp != null && graph.model.isVertex(temp) && geo != null && geo.relative)
					{
						cell = temp;
						temp = graph.model.getParent(cell)
						geo = graph.getCellGeometry(temp);
					}
					
					// Asynchronous to avoid direct insert after double tap
					window.setTimeout(mxUtils.bind(this, function()
					{
						this.shapePickerHoverDiv = ui.showShapePicker(
							me.getGraphX(), me.getGraphY(), temp, mxUtils.bind(this, function(cell)
							{
								execute(cell);
								
								if (ui.hoverIcons != null)
								{
									ui.hoverIcons.update(graph.view.getState(cell));
								}
							}), dir);
					}), 30);
				}), mxUtils.bind(this, function(result)
				{
					this.graph.selectCellsForConnectVertex(result, evt, this);
				}));
			}
			else
			{
				hoverIconsExecute.apply(this, arguments);
			}
		};

		var thread = null;

		this.hoverIcons.addListener('focus', mxUtils.bind(this, function(sender, evt)
		{
			if (thread != null)
			{
				window.clearTimeout(thread);
			}

			thread = window.setTimeout(mxUtils.bind(this, function()
			{
				var arrow = evt.getProperty('arrow');
				var dir = evt.getProperty('direction');
				var mouseEvent = evt.getProperty('event');

				var rect = arrow.getBoundingClientRect();
				var offset = mxUtils.getOffset(graph.container);
				var x = graph.container.scrollLeft + rect.x - offset.x;
				var y = graph.container.scrollTop + rect.y - offset.y;

				var temp = graph.getCompositeParent((this.hoverIcons.currentState != null) ?
					this.hoverIcons.currentState.cell : null);
				var div = ui.showShapePicker(x, y, temp, mxUtils.bind(this, function(cell)
				{
					if (cell != null)
					{
						graph.connectVertex(temp, dir, graph.defaultEdgeLength, mouseEvent, true, false, function(x, y, execute)
						{
							execute(cell);
								
							if (ui.hoverIcons != null)
							{
								ui.hoverIcons.update(graph.view.getState(cell));
							}
						}, function(cells)
						{
							graph.selectCellsForConnectVertex(cells);
						}, mouseEvent, this.hoverIcons);
					}
				}), dir, true);

				if (div != null)
				{
					this.centerShapePicker(div, rect, x, y, dir);
					this.hoverIcons.shapePickerHoverDiv = div;
					mxUtils.setOpacity(div, 30);

					mxEvent.addListener(div, 'mouseenter', function()
					{
						mxUtils.setOpacity(div, 100);
					});

					mxEvent.addListener(div, 'mouseleave', function()
					{
						ui.hideShapePicker();
					});
				}
			}), Editor.shapePickerHoverDelay);
		}));

		this.hoverIcons.addListener('blur', mxUtils.bind(this, function(sender, evt)
		{
			if (thread != null)
			{
				window.clearTimeout(thread);
			}
		}));
	}

	// Shows shape picker when connect handle is clicked (not dragged)
	var connectHandleDragged = false;

	graph.addMouseListener(
	{
		mouseDown: mxUtils.bind(this, function(sender, me)
		{
			connectHandleDragged = false;
		}),
		mouseMove: mxUtils.bind(this, function(sender, me)
		{
			if (graph.connectHandleClickState != null &&
				graph.connectionHandler != null &&
				graph.connectionHandler.shape != null)
			{
				connectHandleDragged = true;
			}
		}),
		mouseUp: mxUtils.bind(this, function(sender, me)
		{
			var state = graph.connectHandleClickState;
			graph.connectHandleClickState = null;

			if (state != null && !connectHandleDragged)
			{
				var evt = me.getEvent();

				if (!graph.isCloneEvent(evt) && !mxEvent.isShiftDown(evt))
				{
					var dir = mxConstants.DIRECTION_EAST;
					var temp = graph.getCompositeParent(state.cell);
					var geo = graph.getCellGeometry(temp);

					while (temp != null && graph.model.isVertex(temp) && geo != null && geo.relative)
					{
						temp = graph.model.getParent(temp);
						geo = graph.getCellGeometry(temp);
					}

					graph.connectVertex(state.cell, dir, graph.defaultEdgeLength, evt, null, true,
						mxUtils.bind(this, function(x, y, execute)
					{
						me.consume();

						// Asynchronous to avoid direct insert after double tap
						window.setTimeout(mxUtils.bind(this, function()
						{
							ui.showShapePicker(me.getGraphX(), me.getGraphY(), temp,
								mxUtils.bind(this, function(cell)
							{
								execute(cell);

								if (ui.hoverIcons != null)
								{
									ui.hoverIcons.update(graph.view.getState(cell));
								}
							}), dir);
						}), 30);
					}), mxUtils.bind(this, function(result)
					{
						graph.selectCellsForConnectVertex(result, evt);
					}));
				}
			}

			connectHandleDragged = false;
		})
	});
};

/**
 * Returns {point, source} for an unconnected terminal of the given edge cell
 * that is within tolerance of the given double click event, otherwise null.
 * The point is in absolute (scaled) coordinates as used by the shape picker.
 */
EditorUi.prototype.getDoubleClickTerminalForEvent = function(evt, cell)
{
	var graph = this.editor.graph;

	if (evt != null && cell != null && graph.model.isEdge(cell))
	{
		var state = graph.view.getState(cell);

		if (state != null && state.absolutePoints != null &&
			state.absolutePoints.length >= 2)
		{
			var pt = mxUtils.convertPoint(graph.container,
				mxEvent.getClientX(evt), mxEvent.getClientY(evt));
			var tol = graph.tolerance + mxConstants.HANDLE_SIZE;

			for (var i = 0; i < 2; i++)
			{
				var source = (i == 0);

				if (graph.model.getTerminal(cell, source) == null)
				{
					var abs = state.absolutePoints[source ? 0 :
						state.absolutePoints.length - 1];

					if (abs != null && Math.abs(abs.x - pt.x) <= tol &&
						Math.abs(abs.y - pt.y) <= tol)
					{
						return {point: abs.clone(), source: source};
					}
				}
			}
		}
	}

	return null;
};

/**
 * Shows the shape picker at an unconnected edge terminal and connects the
 * picked shape to that terminal. Replaces the default insert-label / remove-
 * point behaviour for double clicks on a dangling edge endpoint or its handle.
 * The point is in absolute (scaled) coordinates.
 */
EditorUi.prototype.showShapePickerForEdgeTerminal = function(edge, source, point)
{
	var ui = this;
	var graph = this.editor.graph;

	this.showShapePicker(point.x, point.y, null, mxUtils.bind(this, function(clone)
	{
		if (clone != null)
		{
			var geo = clone.geometry;

			if (geo != null)
			{
				// Centers the new shape on the edge terminal point
				geo.x = graph.snap(Math.round(point.x / graph.view.scale) -
					graph.view.translate.x - geo.width / 2);
				geo.y = graph.snap(Math.round(point.y / graph.view.scale) -
					graph.view.translate.y - geo.height / 2);
			}

			graph.model.beginUpdate();
			try
			{
				graph.addCell(clone);

				if (graph.model.isVertex(clone) && graph.isAutoSizeCell(clone))
				{
					graph.updateCellSize(clone);
				}

				// Connects the unconnected edge terminal to the new shape
				graph.model.setTerminal(edge, clone, source);

				// Clears the now obsolete fixed terminal point
				var egeo = graph.getCellGeometry(edge);

				if (egeo != null && egeo.getTerminalPoint(source) != null)
				{
					egeo = egeo.clone();
					egeo.setTerminalPoint(null, source);
					graph.model.setGeometry(edge, egeo);
				}
			}
			finally
			{
				graph.model.endUpdate();
			}

			graph.setSelectionCell(clone);
			graph.scrollCellToVisible(clone);
			graph.startEditing(clone);

			if (ui.hoverIcons != null)
			{
				ui.hoverIcons.update(graph.view.getState(clone));
			}
		}
	}), null, false, null, false, false,
		this.getCellsForShapePicker(null, false, false), {cell: edge, source: source});
};

/**
 * Creates a temporary graph instance for rendering off-screen content.
 */
EditorUi.prototype.centerShapePicker = function(div, rect, x, y, dir)
{
	if (dir == mxConstants.DIRECTION_EAST || dir == mxConstants.DIRECTION_WEST)
	{
		div.style.width = '40px';
	}

	var r2 = div.getBoundingClientRect();

	if (dir == mxConstants.DIRECTION_NORTH)
	{
		x -= r2.width / 2 - 10;
		y -= r2.height + 6;
	}
	else if (dir == mxConstants.DIRECTION_SOUTH)
	{
		x -= r2.width / 2 - 10;
		y += rect.height + 6;
	}
	else if (dir == mxConstants.DIRECTION_WEST)
	{
		x -= r2.width + 6;
		y -= r2.height / 2 - 10;
	}
	else if (dir == mxConstants.DIRECTION_EAST)
	{
		x += rect.width + 6;
		y -= r2.height / 2 - 10;
	}

	div.style.left = x + 'px';
	div.style.top = y + 'px';
};

/**
 * Creates a temporary graph instance for rendering off-screen content.
 */
EditorUi.prototype.showShapePicker = function(x, y, source, callback, direction, hovering,
	getInsertLocationFn, showEdges, startEditing, cells, connectEdge)
{
	var div = null;

	if (!this.editor.graph.freehand.isDrawing())
	{
		showEdges = showEdges || source == null;
		cells = (cells != null) ? cells :
			this.getCellsForShapePicker(source, hovering, showEdges);

		div = this.createShapePicker(x, y, source, callback, direction, mxUtils.bind(this, function()
		{
			this.hideShapePicker();
		}), cells, hovering, getInsertLocationFn, showEdges, startEditing, connectEdge);
		
		if (div != null)
		{
			if (this.hoverIcons != null && !hovering)
			{
				this.hoverIcons.reset();
			}
			
			var graph = this.editor.graph;
			graph.popupMenuHandler.hideMenu();
			graph.tooltipHandler.hideTooltip();
			this.hideCurrentMenu();
			this.hideShapePicker();
			
			this.shapePickerCallback = callback;
			this.shapePicker = div;
		}
	}

	return div;
};

/**
 * Creates a temporary graph instance for rendering off-screen content.
 */
EditorUi.prototype.createShapePicker = function(x, y, source, callback, direction,
	afterClick, cells, hovering, getInsertLocationFn, showEdges, startEditing, connectEdge)
{
	startEditing = (startEditing != null) ? startEditing : true;
	var graph = this.editor.graph;
	var div = null;

	getInsertLocationFn = (getInsertLocationFn != null) ? getInsertLocationFn : function(cells)
	{
		var cell = cells[0];
		var w = 0;
		var h = 0;
		var geo = cell.geometry;

		if (geo != null)
		{	
			if (graph.model.isEdge(cell))
			{
				var pt = geo.getTerminalPoint(false);
				geo = new mxRectangle(0, 0, pt.x, pt.y);
			}

			w = geo.width / 2;
			h = geo.height / 2;
		}

		return new mxPoint(graph.snap(Math.round(x / graph.view.scale) - graph.view.translate.x - w),
			graph.snap(Math.round(y / graph.view.scale) - graph.view.translate.y - h));
	};
	
	if (cells != null && cells.length > 0)
	{
		var ui = this;
		var graph = this.editor.graph;
		div = document.createElement('div');
		var sourceState = graph.view.getState(source);
		var style = (source != null && (sourceState == null ||
			!graph.isTransparentState(sourceState))) ?
			graph.copyStyle(source) : null;
		
		// Do not place entry under pointer for touch devices
		div.className = 'geShapePicker';
		div.setAttribute('title', mxResources.get('sidebarTooltip'));
		div.style.left = Math.round(x) + 'px';
		div.style.top = Math.round(y) + 'px';

		// Disables built-in pan and zoom on touch devices
		if (mxClient.IS_POINTER)
		{
			div.style.touchAction = 'none';
		}

		if (!hovering)
		{
			mxUtils.setPrefixedStyle(div.style, 'transform', 'translate(-22px,-22px)');
		}
		
		graph.container.appendChild(div);
		
		var addCell = mxUtils.bind(this, function(cell)
		{
			// Wrapper needed to catch events
			var node = document.createElement('a');
			div.appendChild(node);

			var fixed = cell.shapePickerKeepStyle;
			delete cell.shapePickerKeepStyle;

			if (!fixed)
			{
				if (style != null && urlParams['sketch'] != '1')
				{
					this.sidebar.graph.pasteStyle(style, [cell]);
				}
				else
				{
					this.sidebar.graph.pasteCellStyles([cell],
						graph.currentVertexStyle,
						graph.currentEdgeStyle);
				}
			}

			var geo = cell.geometry;
			
			if (graph.model.isEdge(cell))
			{
				var pt = geo.getTerminalPoint(false);
				geo = new mxRectangle(0, 0, pt.x, pt.y);
			}
			
			if (geo != null)
			{
				var temp = this.sidebar.createVertexTemplateFromCells([cell],
					geo.width, geo.height, '', true, false, null, true,
					mxUtils.bind(this, function(evt)
				{
					if (!mxEvent.isAltDown(evt) || graph.getSelectionCount() != 1)
					{
						if (mxEvent.isShiftDown(evt) && (source != null ||
							!graph.isSelectionEmpty()))
						{
							var temp = graph.getEditableCells((source != null) ?
								[source] : graph.getSelectionCells());
							graph.updateShapes(cell, temp);
						}
						else
						{
							var clone = graph.cloneCell(cell);

							if (callback != null)
							{
								callback(clone);
							}
							else
							{
								var pt = getInsertLocationFn([clone]);

								if (graph.model.isEdge(clone))
								{
									clone.geometry.translate(pt.x, pt.y);
								}
								else
								{
									clone.geometry.x = pt.x;
									clone.geometry.y = pt.y;
								}
								
								graph.model.beginUpdate();
								try
								{
									graph.addCell(clone);

									if (graph.model.isVertex(clone) &&
										graph.isAutoSizeCell(clone))
									{
										graph.updateCellSize(clone);
									}
								}
								finally
								{
									graph.model.endUpdate();
								}
								
								graph.setSelectionCell(clone);
								graph.scrollCellToVisible(clone);
								
								if (startEditing)
								{
									graph.startEditing(clone);
								}
								
								if (ui.hoverIcons != null)
								{
									ui.hoverIcons.update(graph.view.getState(clone));
								}
							}
						}
						
						if (afterClick != null)
						{
							afterClick(evt);
						}

						mxEvent.consume(evt);
					}
				}), 25, 25, null, null, source, connectEdge);
				temp.style.display = 'flex';
				temp.style.alignItems = 'center';
				temp.style.justifyContent = 'center';
				node.appendChild(temp);
			}
		});
		
		for (var i = 0; i < (hovering ? Math.min(cells.length, 4) : cells.length); i++)
		{
			addCell(cells[i]);
		}
		
		var b = graph.container.scrollTop + graph.container.offsetHeight;
		var dy = div.offsetTop + div.clientHeight - b;
		
		if (dy > 0)
		{
			div.style.top = Math.max(graph.container.scrollTop + 22, y - dy) + 'px';
		}
		
		var r = graph.container.scrollLeft + graph.container.offsetWidth;
		var dx = div.offsetLeft + div.clientWidth - r;
		
		if (dx > 0)
		{
			div.style.left = Math.max(graph.container.scrollLeft + 22, x - dx) + 'px';
		}
	}
	
	return div;
};

/**
 * Creates a temporary graph instance for rendering off-screen content.
 */
EditorUi.prototype.defaultShapePickerEntries = null;

/**
 * Creates cells for the shape picker popup.
 */
EditorUi.prototype.getCellsForShapePicker = function(cell, hovering, showEdges)
{
	var graph = this.editor.graph;

	var createVertex = mxUtils.bind(this, function(style, w, h, value)
	{
		return graph.createVertex(null, null, value || '', 0, 0, w || 120, h || 60, style, false);
	});

	var createEdge = mxUtils.bind(this, function(style, y, value)
	{
		var cell = new mxCell(value || '', new mxGeometry(0, 0, graph.defaultEdgeLength + 20, 0), style);
		cell.geometry.setTerminalPoint(new mxPoint(0, 0), true);
		cell.geometry.setTerminalPoint(new mxPoint(cell.geometry.width, (y != null) ? y : 0), false);
		cell.geometry.points = (y != null) ? [new mxPoint(cell.geometry.width / 2, y)] : [];
		cell.geometry.relative = true;
		cell.edge = true;

		return cell;
	});

	// Creates a clone of the source cell and moves it to the origin
	if (cell != null)
	{
		try
		{
			cell = graph.cloneCell(cell);

			if (graph.model.isVertex(cell) && cell.geometry != null)
			{
				cell.geometry.x = 0;
				cell.geometry.y = 0;
			}
		}
		catch (e)
		{
			cell = null;
		}
	}

	if (this.defaultShapePickerEntries != null)
	{
		var vertices = [];
		var edges = [];

		var createUserObject = function(value)
		{
			if (value != null && typeof value === 'object')
			{
				var doc = mxUtils.createXmlDocument();
				var obj = doc.createElement('UserObject');

				for (var key in value)
				{
					if (value.hasOwnProperty(key))
					{
						obj.setAttribute(key, value[key]);
					}
				}

				if (obj.getAttribute('label') == null)
				{
					obj.setAttribute('label', '');
				}

				return obj;
			}

			return value;
		};

		for (var i = 0; i < this.defaultShapePickerEntries.length; i++)
		{
			var entry = this.defaultShapePickerEntries[i];

			if (entry != null && entry.style != null)
			{
				var value = createUserObject(entry.value);

				if (entry.edge)
				{
					edges.push(createEdge(entry.style, entry.y, value));
				}
				else
				{
					var vertex = createVertex(entry.style, entry.width,
						entry.height, value);

					if (entry.keepStyle)
					{
						vertex.shapePickerKeepStyle = true;
					}

					vertices.push(vertex);
				}
			}
		}

		// Prepend cloned source cell or use first configured vertex entry
		if (cell != null)
		{
			vertices[0] = cell;
		}

		var cells = vertices;

		if (showEdges)
		{
			cells = cells.concat(edges);
		}

		return cells;
	}

	if (cell == null)
	{
		cell = createVertex(graph.appendFontSize(Editor.defaultTextStyle,
			graph.vertexFontSize), 60, 30, 'Text');
	}

	var cells = [cell, createVertex('whiteSpace=wrap;html=1;'),
		createVertex('ellipse;whiteSpace=wrap;html=1;', 80, 80),
		createVertex('rhombus;whiteSpace=wrap;html=1;', 80, 80),
		createVertex('rounded=1;whiteSpace=wrap;html=1;'),
		createVertex('shape=parallelogram;perimeter=parallelogramPerimeter;whiteSpace=wrap;html=1;fixedSize=1;'),
		createVertex('shape=trapezoid;perimeter=trapezoidPerimeter;whiteSpace=wrap;html=1;fixedSize=1;', 120, 60),
		createVertex('shape=hexagon;perimeter=hexagonPerimeter2;whiteSpace=wrap;html=1;fixedSize=1;', 120, 80),
		createVertex('shape=step;perimeter=stepPerimeter;whiteSpace=wrap;html=1;fixedSize=1;', 120, 80),
		createVertex('shape=process;whiteSpace=wrap;html=1;backgroundOutline=1;'),
		createVertex('triangle;whiteSpace=wrap;html=1;', 60, 80),
		createVertex('shape=document;whiteSpace=wrap;html=1;boundedLbl=1;', 120, 80),
		createVertex('shape=tape;whiteSpace=wrap;html=1;', 120, 100),
		createVertex('ellipse;shape=cloud;whiteSpace=wrap;html=1;', 120, 80),
		createVertex('shape=singleArrow;whiteSpace=wrap;html=1;arrowWidth=0.4;arrowSize=0.4;', 80, 60),
		createVertex('shape=waypoint;sketch=0;size=6;pointerEvents=1;points=[];fillColor=none;resizable=0;' +
			'rotatable=0;perimeter=centerPerimeter;snapToPoint=1;', 20, 20)];

	if (showEdges)
	{
		cells = cells.concat([
			createEdge('edgeStyle=none;orthogonalLoop=1;jettySize=auto;html=1;'),
			createEdge('edgeStyle=none;orthogonalLoop=1;jettySize=auto;html=1;endArrow=classic;startArrow=classic;endSize=8;startSize=8;'),
			createEdge('edgeStyle=none;orthogonalLoop=1;jettySize=auto;html=1;shape=flexArrow;rounded=1;startSize=8;endSize=8;'),
			createEdge('edgeStyle=segmentEdgeStyle;endArrow=classic;html=1;curved=0;rounded=0;endSize=8;startSize=8;sourcePerimeterSpacing=0;targetPerimeterSpacing=0;',
				this.editor.graph.defaultEdgeLength / 2)
		]);
	}

	return cells;
};

/**
 * Creates a temporary graph instance for rendering off-screen content.
 */
EditorUi.prototype.isShapePickerVisible = function(cancel)
{
	return this.shapePicker != null;
};

/**
 * Creates a temporary graph instance for rendering off-screen content.
 */
EditorUi.prototype.hideShapePicker = function(cancel)
{
	if (this.shapePicker != null)
	{
		this.shapePicker.parentNode.removeChild(this.shapePicker);
		this.shapePicker = null;

		if (this.hoverIcons != null &&
			this.hoverIcons.shapePickerHoverDiv != null)
		{
			this.hoverIcons.shapePickerHoverDiv = null;
		}
				
		if (!cancel && this.shapePickerCallback != null)
		{
			this.shapePickerCallback();
		}
		
		this.shapePickerCallback = null;
	}
};

/**
 * Whether the default styles should be updated when styles are changed. Default is true.
 */
EditorUi.prototype.isSpaceDown = function()
{
	return this.spaceDown;
};

/**
 * Whether the default styles should be updated when styles are changed. Default is true.
 */
EditorUi.prototype.isShiftDown = function()
{
	return this.shiftDown;
};

/**
 * Returns true if the given event should start editing. This implementation returns true.
 */
EditorUi.prototype.onKeyDown = function(evt)
{
	var graph = this.editor.graph;
	
	// Alt+tab for task switcher in Windows, ctrl+tab for tab control in Chrome
	if (evt.which == 9 && graph.isEnabled() && !mxEvent.isControlDown(evt))
	{
		if (graph.isEditing())
		{
			if (mxEvent.isAltDown(evt))
			{
				graph.stopEditing(false);
			}
			else
			{
				try
				{
					var nesting = graph.cellEditor.isContentEditing() && graph.cellEditor.isTextSelected();

					if (window.getSelection && graph.cellEditor.isContentEditing() &&
						!nesting)
					{
						var selection = window.getSelection();
						var container = (selection.rangeCount > 0) ? selection.getRangeAt(0).commonAncestorContainer : null;
						nesting = container != null && (container.nodeName == 'LI' || (container.parentNode != null &&
							container.parentNode.nodeName == 'LI'));
					}

					if (nesting)
					{
						// (Shift+)tab indents/outdents with text selection or inside list elements
						document.execCommand(mxEvent.isShiftDown(evt) ? 'outdent' : 'indent', false, null);
					}
					// Shift+tab applies value with cursor
					else if (mxEvent.isShiftDown(evt))
					{
						graph.stopEditing(false);
					}
					else
					{
						// Inserts tab character
						graph.cellEditor.insertTab(!graph.cellEditor.isContentEditing() ? 4 : null);
					}
				}
				catch (e)
				{
					// ignore
				}
			}
		}
		else if (mxEvent.isAltDown(evt))
		{
			graph.selectParentCell();
		}
		else
		{
			graph.selectCell(!mxEvent.isShiftDown(evt));
		}
			
		mxEvent.consume(evt);
	}
};

/**
 * Starts editing on keydown for the selected cell. This is a fallback for
 * when the typing shim is not active. The shim handles IME correctly by
 * keeping an invisible textarea focused so the OS engages IME from the
 * first keystroke.
 */
EditorUi.prototype.onKeyPress = function(evt)
{
	var graph = this.editor.graph;

	// Skip if the event came from the typing shim (the shim handles editing start)
	if (this.typingShim != null && mxEvent.getSource(evt) === this.typingShim)
	{
		return;
	}

	// KNOWN: Focus does not work if label is empty in quirks mode
	if (this.isImmediateEditingEvent(evt) && !graph.isEditing() && !graph.isSelectionEmpty() &&
		!mxEvent.isAltDown(evt) && !mxEvent.isControlDown(evt) && !mxEvent.isMetaDown(evt))
	{
		// evt.key.length === 1 identifies printable characters (excludes "Shift", "Enter", etc.)
		// keyCode 229 indicates IME is processing the input
		if ((evt.key != null && evt.key.length === 1) || evt.keyCode === 229)
		{
			// Defers to mxKeyHandler if it has a binding for this key
			// (e.g. "/" for omni search) to avoid intercepting shortcuts
			if (this.keyHandler != null && this.keyHandler.getFunction(evt) != null)
			{
				return;
			}

			graph.escape();
			graph.cellEditor.editByTyping = true;
			graph.startEditing();
		}
	}
};

/**
 * Creates and installs a hidden textarea ("typing shim") that stays focused
 * when a cell is selected but not being edited. Because the OS sees an editable
 * element with focus, it properly engages IME from the very first keystroke.
 * When input is detected (regular text or composed IME text), the shim starts
 * the real cell editing and injects the captured text.
 */
EditorUi.prototype.installTypingShim = function()
{
	var ui = this;
	var graph = this.editor.graph;

	var shim = document.createElement('textarea');
	shim.setAttribute('autocomplete', 'off');
	shim.setAttribute('autocorrect', 'off');
	shim.setAttribute('autocapitalize', 'off');
	shim.setAttribute('spellcheck', 'false');

	// Suppress virtual keyboard on touch devices (Android/iOS tablets).
	// The shim is for capturing keystrokes from physical keyboards and IME;
	// on touch-only devices focusing a textarea triggers the soft keyboard.
	if (mxClient.IS_ANDROID || mxClient.IS_IOS ||
		('ontouchstart' in document.documentElement && navigator.maxTouchPoints > 1))
	{
		shim.setAttribute('inputmode', 'none');
	}

	shim.tabIndex = -1;
	shim.className = 'mxTypingShim';
	shim.style.cssText = 'position:absolute;overflow:hidden;resize:none;' +
		'outline:none;border:none;padding:0;margin:0;z-index:1;' +
		'width:4px;height:1em;opacity:0;pointer-events:none;';

	this.typingShim = shim;
	var composing = false;

	// Captures text from the shim and starts editing
	var startEditingFromShim = mxUtils.bind(this, function()
	{
		if (!composing && shim.value.length > 0)
		{
			var text = shim.value;
			shim.value = '';
			this.hideTypingShim();

			graph.escape();
			graph.cellEditor.editByTyping = true;
			graph.startEditing(null, text);
		}
	});

	// Track IME composition state
	mxEvent.addListener(shim, 'compositionstart', function()
	{
		composing = true;
	});

	// Some browsers fire input before compositionend, so also
	// check for text to capture when composition finishes
	mxEvent.addListener(shim, 'compositionend', function()
	{
		composing = false;
		startEditingFromShim();
	});

	// Detect input and start editing with the captured text.
	// During composition, waits for compositionend first.
	mxEvent.addListener(shim, 'input', function()
	{
		startEditingFromShim();
	});

	// Handle keydown: let printable characters through to the shim,
	// but prevent non-printable keys from affecting the textarea
	// content while still allowing them to bubble for graph handling
	mxEvent.addListener(shim, 'keydown', mxUtils.bind(this, function(evt)
	{
		// IME processing: let through
		if (evt.keyCode === 229)
		{
			return;
		}

		// Ctrl/Meta modifier: let through for clipboard shortcuts (Ctrl+C/V/X)
		// and other modifier-based shortcuts. The clipboard textInput mechanism
		// in diagramly/EditorUi.js handles Ctrl/Meta by focusing a separate
		// contentEditable element, so these events must not be prevented.
		if (mxEvent.isControlDown(evt) || mxEvent.isMetaDown(evt))
		{
			return;
		}

		// Printable character without modifier: let it type into the shim
		if (evt.key != null && evt.key.length === 1 && !mxEvent.isAltDown(evt))
		{
			// But check for keyboard shortcuts bound to this key
			if (this.keyHandler != null && this.keyHandler.getFunction(evt) != null)
			{
				evt.preventDefault();
			}

			return;
		}

		// Non-printable key (arrows, delete, escape, tab, etc.):
		// prevent textarea behavior but let event bubble for graph handling
		evt.preventDefault();
	}));

	// Show/hide shim based on selection changes.
	// Also defer in case cell states are not yet available
	// (e.g., after programmatic cell insertion before view validation).
	graph.getSelectionModel().addListener(mxEvent.CHANGE, mxUtils.bind(this, function()
	{
		this.updateTypingShim();

		window.setTimeout(mxUtils.bind(this, function()
		{
			this.updateTypingShim();
		}), 0);
	}));

	// Hide shim when editing starts
	graph.addListener(mxEvent.EDITING_STARTED, mxUtils.bind(this, function()
	{
		this.hideTypingShim();
	}));

	// Re-show shim when editing ends if a cell is still selected
	graph.addListener(mxEvent.EDITING_STOPPED, mxUtils.bind(this, function()
	{
		// Defer to let focus settle after editing stops
		window.setTimeout(mxUtils.bind(this, function()
		{
			this.updateTypingShim();
		}), 0);
	}));

	// Redirect container focus to the shim. Many code paths call
	// graph.container.focus() after inserting cells or stopping
	// editing (Sidebar.itemClicked, mxDragSource.drop, etc.).
	// Make the container focusable so we can intercept this.
	if (graph.container.tabIndex == null || graph.container.tabIndex < 0)
	{
		graph.container.tabIndex = -1;
	}

	mxEvent.addListener(graph.container, 'focus', mxUtils.bind(this, function()
	{
		this.updateTypingShim();
	}));

	// Override focusContainer to redirect to shim after editing stops
	var cellEditorFocusContainer = graph.cellEditor.focusContainer;

	graph.cellEditor.focusContainer = mxUtils.bind(this, function()
	{
		if (!graph.isSelectionEmpty() && !graph.isEditing())
		{
			this.updateTypingShim();
		}
		else
		{
			cellEditorFocusContainer.apply(graph.cellEditor);
		}
	});
};

/**
 * Shows or hides the typing shim based on the current state.
 */
EditorUi.prototype.updateTypingShim = function()
{
	var graph = this.editor.graph;

	if (!graph.isEditing() && !graph.isSelectionEmpty() &&
		graph.isEnabled() && !graph.isCellLocked(graph.getSelectionCell()))
	{
		this.showTypingShim();
	}
	else
	{
		this.hideTypingShim();
	}
};

/**
 * Shows the typing shim, positions it near the selected cell, and focuses it.
 */
EditorUi.prototype.showTypingShim = function()
{
	var graph = this.editor.graph;
	var shim = this.typingShim;

	if (shim == null || graph.isEditing())
	{
		return;
	}

	var cell = graph.getSelectionCell();
	var state = graph.getView().getState(cell);

	if (state != null)
	{
		// Never steal focus from a text input or editable element that lives
		// outside the graph container (Find/Replace, Edit Data, ...). Checked
		// before either the clipboard element or the shim is focused: a
		// clipboard element left attached (e.g. after Ctrl+F, whose Ctrl/Meta
		// keyup teardown the Find dialog consumes) would otherwise grab the
		// next keystroke out of the search field.
		var ae = document.activeElement;

		if (ae != null && ae !== document.body && ae !== graph.container &&
			!graph.container.contains(ae))
		{
			return;
		}

		// Position near the cell so IME candidate window appears at the right location
		shim.style.left = Math.round(state.x) + 'px';
		shim.style.top = Math.round(state.y) + 'px';

		if (shim.parentNode !== graph.container)
		{
			graph.container.appendChild(shim);
		}

		shim.value = '';

		// If the native clipboard textInput is present (Ctrl/Meta is held),
		// keep focus on it so Ctrl+V/C/X reach its handlers instead of the
		// shim. Without this, Ctrl+click moves focus to graph.container,
		// focus events bring focus to the shim, and a subsequent Ctrl+V
		// pastes into the shim and triggers cell-edit-from-typing.
		if (this.clipboardElt != null && this.clipboardElt.parentNode != null)
		{
			// Safari ignores {preventScroll: true} when focusing the contentEditable
			// clipboard div and scrolls the container to it, so snapshot and restore the
			// scroll position around the focus/selectAll - the same workaround the
			// Ctrl/Meta keydown handler uses for this element.
			var sx = graph.container.scrollLeft;
			var sy = graph.container.scrollTop;

			this.clipboardElt.focus({preventScroll: true});

			// Select via a Range instead of execCommand('selectAll'): selectAll fires a
			// selectstart that, when focus is contended (eg. during a rubberband), targets
			// document.body and is cancelled by the body/root selectstart block - leaving
			// no selection, so a later Ctrl+V lands on body and is swallowed. A Range
			// fires no selectstart and is scoped to the clipboard element.
			try
			{
				var clipRange = document.createRange();
				clipRange.selectNodeContents(this.clipboardElt);
				var clipSel = window.getSelection();

				if (clipSel != null)
				{
					clipSel.removeAllRanges();
					clipSel.addRange(clipRange);
				}
			}
			catch (e)
			{
				// ignore
			}

			graph.container.scrollLeft = sx;
			graph.container.scrollTop = sy;

			return;
		}

		// External inputs are already handled by the early return above, so ae
		// is null/body/container/inside-container here. Still defer to a
		// contentEditable inside the container (e.g. the clipboard element).
		if (ae == null || ae.contentEditable !== 'true')
		{
			shim.focus({preventScroll: true});
		}
	}
};

/**
 * Hides and removes the typing shim from the DOM.
 */
EditorUi.prototype.hideTypingShim = function()
{
	var shim = this.typingShim;

	if (shim != null && shim.parentNode != null)
	{
		shim.parentNode.removeChild(shim);
	}
};

/**
 * Returns true if the given event should start editing. This implementation returns true.
 */
EditorUi.prototype.isImmediateEditingEvent = function(evt)
{
	return true;
};

/**
 * Updates the CSS for the given element to match the selection.
 */
EditorUi.prototype.updateCssForMarker = function(markerDiv, prefix, shape, marker, fill)
{
	var src = this.getImageForMarker(marker, fill, shape);
	markerDiv.innerHTML = '';

	if (src == null)
	{
		markerDiv.innerHTML = mxUtils.htmlEntities(mxResources.get('none'));
	}
	else
	{
		var img = document.createElement('img');
		img.setAttribute('src', src);

		if (prefix == 'end')
		{
			mxUtils.setPrefixedStyle(img.style, 'transform', 'scaleX(-1)');
		}

		markerDiv.appendChild(img);
	}
};

/**
 * Returns the image for the given marker, fill and shape.
 */
EditorUi.prototype.getImageForMarker = function(marker, fill, shape)
{
	var result = null;

	if (shape == 'flexArrow')
	{
		if (marker != null && marker != mxConstants.NONE)
		{
			result = Format.blockMarkerImage.src;
		}
		else
		{
			result = null;
		}
	}
	else if (marker == mxConstants.ARROW_CLASSIC)
	{
		result = (fill != '1') ? Format.classicMarkerImage.src :
			Format.classicFilledMarkerImage.src
	}
	else if (marker == mxConstants.ARROW_CLASSIC_THIN)
	{
		result = (fill != '1') ? Format.classicThinMarkerImage.src :
			Format.openThinFilledMarkerImage.src;
	}
	else if (marker == mxConstants.ARROW_OPEN)
	{
		result = Format.openFilledMarkerImage.src;
	}
	else if (marker == mxConstants.ARROW_OPEN_THIN)
	{
		result = Format.openThinFilledMarkerImage.src;
	}
	else if (marker == mxConstants.ARROW_BLOCK)
	{
		result = (fill != '1') ? Format.blockMarkerImage.src :
			Format.blockFilledMarkerImage.src;
	}
	else if (marker == mxConstants.ARROW_BLOCK_THIN)
	{
		result = (fill != '1') ? Format.blockThinMarkerImage.src :
			Format.blockThinFilledMarkerImage.src;
	}
	else if (marker == mxConstants.ARROW_OVAL)
	{
		result = (fill != '1') ? Format.ovalMarkerImage.src :
			Format.ovalFilledMarkerImage.src;
	}
	else if (marker == mxConstants.ARROW_DIAMOND)
	{
		result = (fill != '1') ? Format.diamondMarkerImage.src :
			Format.diamondFilledMarkerImage.src;
	}
	else if (marker == mxConstants.ARROW_DIAMOND_THIN)
	{
		result = (fill != '1') ? Format.diamondThinMarkerImage.src :
			Format.diamondThinFilledMarkerImage.src;
	}
	else if (marker == 'doubleBlock')
	{
		result = (fill != '1') ? Format.doubleBlockMarkerImage.src :
			Format.doubleBlockFilledMarkerImage.src;
	}
	else if (marker == 'box')
	{
		result = Format.boxMarkerImage.src;
	}
	else if (marker == 'halfCircle')
	{
		result = Format.halfCircleMarkerImage.src;
	}
	else if (marker == 'openAsync')
	{
		result = Format.openAsyncFilledMarkerImage.src;
	}
	else if (marker == 'async')
	{
		result = (fill != '1') ? Format.asyncMarkerImage.src :
			Format.asyncFilledMarkerImage.src;
	}
	else if (marker == 'dash')
	{
		result = Format.dashMarkerImage.src;
	}
	else if (marker == 'baseDash')
	{
		result = Format.baseDashMarkerImage.src;
	}
	else if (marker == 'cross')
	{
		result = Format.crossMarkerImage.src;
	}
	else if (marker == 'circle')
	{
		result = Format.circleMarkerImage.src;
	}
	else if (marker == 'circlePlus')
	{
		result = Format.circlePlusMarkerImage.src;
	}
	else if (marker == 'ERone')
	{
		result = Format.EROneMarkerImage.src;
	}
	else if (marker == 'ERmandOne')
	{
		result = Format.ERmandOneMarkerImage.src;
	}
	else if (marker == 'ERmany')
	{
		result = Format.ERmanyMarkerImage.src;
	}
	else if (marker == 'ERoneToMany')
	{
		result = Format.ERoneToManyMarkerImage.src;
	}
	else if (marker == 'ERzeroToOne')
	{
		result = Format.ERzeroToOneMarkerImage.src;
	}
	else if (marker == 'ERzeroToMany')
	{
		result = Format.ERzeroToManyMarkerImage.src;
	}
	else
	{
		result = null;
	}

	return result;
};

/**
 * Returns the image for the edge shape in the given style.
 */
EditorUi.prototype.getImageForEdgeShape = function(style)
{
	var result = Format.connectionImage.src;

	if (style.shape == 'link')
	{
		result = Format.linkEdgeImage.src;
	}
	else if (style.shape == 'flexArrow')
	{
		result = Format.arrowImage.src;
	}
	else if (style.shape == 'arrow')
	{
		result = Format.simpleArrowImage.src;
	}
	else if (style.shape == 'filledEdge')
	{
		result = Format.filledEdgeImage.src;
	}
	else if (style.shape == 'pipe')
	{
		result = Format.pipeEdgeImage.src;
	}
	else if (style.shape == 'wire')
	{
		result = Format.wireEdgeImage.src;
	}

	return result;
};

/**
 * Returns the image for the edge style in the given style.
 */
EditorUi.prototype.getImageForEdgeStyle = function(style)
{
	// libavoid auto-routing edges are orthogonal + the flag; show the distinct
	// obstacle-avoiding icon rather than the plain orthogonal one.
	if (mxUtils.getValue(style, 'libavoidRouting', null) == '1')
	{
		return Format.libavoidImage.src;
	}

	var result = Format.orthogonalImage.src;
	var es = mxUtils.getValue(style, mxConstants.STYLE_EDGE, null);
	
	if (mxUtils.getValue(style, mxConstants.STYLE_NOEDGESTYLE, null) == '1')
	{
		es = null;
	}

	if (es == 'orthogonalEdgeStyle' && mxUtils.getValue(style,
		mxConstants.STYLE_CURVED, null) == '1')
	{
		result = Format.curvedImage.src;
	}
	else if (es == 'straight' || es == 'none' || es == null)
	{
		result = Format.straightImage.src;
	}
	else if (es == 'entityRelationEdgeStyle')
	{
		result = Format.entityImage.src;
	}
	else if (es == 'elbowEdgeStyle')
	{
		result = (mxUtils.getValue(style, mxConstants.STYLE_ELBOW, null) == 'vertical') ?
			Format.verticalElbowImage.src : Format.horizontalElbowImage.src;
	}
	else if (es == 'isometricEdgeStyle')
	{
		result = (mxUtils.getValue(style, mxConstants.STYLE_ELBOW, null) == 'vertical') ?
			Format.verticalIsometricImage.src : Format.horizontalIsometricImage.src;
	}

	return result;
};

/**
 * Overridden in Menus.js
 */
EditorUi.prototype.createMenus = function()
{
	return null;
};

/**
 * Hook for allowing selection and context menu for certain events.
 */
EditorUi.prototype.updatePasteActionStates = function()
{
	var graph = this.editor.graph;
	var paste = this.actions.get('paste');
	var pasteHere = this.actions.get('pasteHere');
	
	paste.setEnabled(this.editor.graph.cellEditor.isContentEditing() ||
		((navigator.clipboard != null || !mxClipboard.isEmpty()) &&
		graph.isEnabled() && !graph.isCellLocked(graph.getDefaultParent())));
	pasteHere.setEnabled(paste.isEnabled());
};

/**
 * Hook for allowing selection and context menu for certain events.
 */
EditorUi.prototype.initClipboard = function()
{
	var ui = this;

	var mxClipboardCut = mxClipboard.cut;
	mxClipboard.cut = function(graph)
	{
		if (graph.cellEditor.isContentEditing())
		{
			document.execCommand('cut', false, null);
		}
		else
		{
			mxClipboardCut.apply(this, arguments);
		}
		
		ui.updatePasteActionStates();
	};
	
	mxClipboard.copy = function(graph)
	{
		var result = null;
		
		if (graph.cellEditor.isContentEditing())
		{
			document.execCommand('copy', false, null);
		}
		else
		{
			result = result || graph.getSelectionCells();
			result = graph.getExportableCells(graph.model.getTopmostCells(result));
			
			var cloneMap = new Object();
			var lookup = graph.createCellLookup(result);
			var clones = graph.cloneCells(result, null, cloneMap);
			
			// Uses temporary model to force new IDs to be assigned
			// to avoid having to carry over the mapping from object
			// ID to cell ID to the paste operation
			var model = new mxGraphModel();
			var parent = model.getChildAt(model.getRoot(), 0);
			
			for (var i = 0; i < clones.length; i++)
			{
				model.add(parent, clones[i]);
				
				// Checks for orphaned relative children and makes absolute				
				var state = graph.view.getState(result[i]);
				
				if (state != null)
				{
					var geo = graph.getCellGeometry(clones[i]);
				
					if (geo != null && geo.relative && !model.isEdge(result[i]) &&
						lookup[mxObjectIdentity.get(model.getParent(result[i]))] == null)
					{
						geo.offset = null;
						geo.relative = false;
						geo.x = state.x / state.view.scale - state.view.translate.x;
						geo.y = state.y / state.view.scale - state.view.translate.y;
					}
				}
			}
			
			graph.updateCustomLinks(graph.createCellMapping(cloneMap, lookup), clones);

			mxClipboard.insertCount = 1;
			mxClipboard.setCells(clones);
		}
		
		ui.updatePasteActionStates();
		
		return result;
	};

	var mxClipboardPaste = mxClipboard.paste;
	mxClipboard.paste = function(graph)
	{
		var result = null;
		
		if (graph.cellEditor.isContentEditing())
		{
			document.execCommand('paste', false, null);
		}
		else
		{
			result = mxClipboardPaste.apply(this, arguments);
		}
		
		ui.updatePasteActionStates();
		
		return result;
	};

	// Overrides cell editor to update paste action state
	var cellEditorStartEditing = this.editor.graph.cellEditor.startEditing;
	
	this.editor.graph.cellEditor.startEditing = function()
	{
		cellEditorStartEditing.apply(this, arguments);
		ui.updatePasteActionStates();
	};
	
	var cellEditorStopEditing = this.editor.graph.cellEditor.stopEditing;
	
	this.editor.graph.cellEditor.stopEditing = function(cell, trigger)
	{
		cellEditorStopEditing.apply(this, arguments);
		ui.updatePasteActionStates();
	};
	
	this.updatePasteActionStates();
};

/**
 * Delay between zoom steps when not using preview.
 */
EditorUi.prototype.lazyZoomDelay = 20;

/**
 * Delay before update of DOM when using preview.
 */
EditorUi.prototype.wheelZoomDelay = 500;

/**
 * Delay before update of DOM when using preview.
 */
EditorUi.prototype.buttonZoomDelay = 600;

/**
 * Initializes the infinite canvas.
 */
EditorUi.prototype.initCanvas = function()
{
	// Initial page layout view, scrollBuffer and timer-based scrolling
	var graph = this.editor.graph;
	graph.timerAutoScroll = true;

	/**
	 * Returns the padding for pages in page view with scrollbars.
	 */
	graph.getPagePadding = function()
	{
		return new mxPoint(Math.max(0, Math.round((graph.container.offsetWidth - 34) / graph.view.scale)),
				Math.max(0, Math.round((graph.container.offsetHeight - 34) / graph.view.scale)));
	};

	// Fits the number of background pages to the graph
	graph.view.getBackgroundPageBounds = function()
	{
		var layout = this.graph.getPageLayout();
		var page = this.graph.getPageSize();
		
		return new mxRectangle(this.scale * (this.translate.x + layout.x * page.width),
				this.scale * (this.translate.y + layout.y * page.height),
				this.scale * layout.width * page.width,
				this.scale * layout.height * page.height);
	};

	graph.getPreferredPageSize = function(bounds, width, height)
	{
		var pages = this.getPageLayout();
		var size = this.getPageSize();
		
		return new mxRectangle(0, 0, pages.width * size.width, pages.height * size.height);
	};
	
	// Scales pages/graph to fit available size
	var resize = null;
	var ui = this;
	
	if (this.editor.isChromelessView())
	{
        resize = mxUtils.bind(this, function(autoscale, maxScale, cx, cy)
        {
            if (graph.container != null && !graph.isViewer())
            {
                cx = (cx != null) ? cx : 0;
                cy = (cy != null) ? cy : 0;
                
                var bds = (graph.pageVisible) ?
					graph.view.getBackgroundPageBounds() :
					graph.getGraphBounds();
                var scroll = mxUtils.hasScrollbars(graph.container);
                var tr = graph.view.translate;
                var s = graph.view.scale;
                
                // Normalizes the bounds
                var b = mxRectangle.fromRectangle(bds);
                b.x = b.x / s - tr.x;
                b.y = b.y / s - tr.y;
                b.width /= s;
                b.height /= s;
                
                var st = graph.container.scrollTop;
                var sl = graph.container.scrollLeft;
                var sb = (document.documentMode >= 8) ? 20 : 14;
                
                if (document.documentMode == 8 || document.documentMode == 9)
                {
                    sb += 3;
                }
                
                var cw = graph.container.offsetWidth - sb;
                var ch = graph.container.offsetHeight - sb;
                
                var ns = (autoscale) ? Math.max(0.3, Math.min(maxScale || 1, cw / b.width)) : s;
                var dx = ((cw - ns * b.width) / 2) / ns;
                var dy = (this.lightboxVerticalDivider == 0) ? 0 : ((ch - ns * b.height) / this.lightboxVerticalDivider) / ns;
                
                if (scroll)
                {
                    dx = Math.max(dx, 0);
                    dy = Math.max(dy, 0);
                }

                if (scroll || bds.width < cw || bds.height < ch)
                {
                    graph.view.scaleAndTranslate(ns, Math.floor(dx - b.x), Math.floor(dy - b.y));
                    graph.container.scrollTop = st * ns / s;
                    graph.container.scrollLeft = sl * ns / s;
                }
                else if (cx != 0 || cy != 0)
                {
                    var t = graph.view.translate;
                    graph.view.setTranslate(Math.floor(t.x + cx / s), Math.floor(t.y + cy / s));
                }
            }
        });
		
		// Hack to make function available to subclassers
		this.chromelessResize = resize;

		// Hook for subclassers for override
		this.chromelessWindowResize = mxUtils.bind(this, function()
	   	{
			this.chromelessResize(false);
	   	});

		// Removable resize listener
		var autoscaleResize = mxUtils.bind(this, function()
	   	{
			this.chromelessWindowResize(false);
	   	});
		
	   	mxEvent.addListener(window, 'resize', autoscaleResize);
	   	
	   	this.destroyFunctions.push(function()
	   	{
	   		mxEvent.removeListener(window, 'resize', autoscaleResize);
	   	});
	   	
		this.editor.addListener('resetGraphView', mxUtils.bind(this, function()
		{
			this.chromelessResize(true);
		}));

		this.actions.get('zoomIn').funct = mxUtils.bind(this, function(evt)
		{
			graph.zoomIn();
			this.chromelessResize(false);
		});
		this.actions.get('zoomOut').funct = mxUtils.bind(this, function(evt)
		{
			graph.zoomOut();
			this.chromelessResize(false);
		});
		
		// Creates toolbar for viewer - do not use CSS here
		// as this may be used in a viewer that has no CSS
		if (urlParams['toolbar'] != '0')
		{
			var toolbarConfig = JSON.parse(decodeURIComponent(urlParams['toolbar-config'] || '{}'));
			
			this.chromelessToolbar = document.createElement('div');
			this.chromelessToolbar.style.position = 'fixed';
			this.chromelessToolbar.style.overflow = 'hidden';
			this.chromelessToolbar.style.boxSizing = 'border-box';
			this.chromelessToolbar.style.whiteSpace = 'nowrap';
			this.chromelessToolbar.style.padding = '10px 10px 8px 10px';
			this.chromelessToolbar.style.left = (graph.isViewer()) ? '0' : '50%';

			this.chromelessToolbar.style.backgroundColor = '#000000';
			
			mxUtils.setPrefixedStyle(this.chromelessToolbar.style, 'borderRadius', '16px');
			mxUtils.setPrefixedStyle(this.chromelessToolbar.style, 'transition', 'opacity 600ms ease-in-out');
			
			var updateChromelessToolbarPosition = mxUtils.bind(this, function()
			{
				var css = mxUtils.getCurrentStyle(graph.container);
				
				if (graph.isViewer())
				{
					this.chromelessToolbar.style.top = '0';
				}
				else
				{
				 	this.chromelessToolbar.style.bottom = ((css != null) ? parseInt(css['margin-bottom'] || 0) : 0) +
				 		((this.tabContainer != null) ? (20 + parseInt(this.tabContainer.style.height)) : 20) + 'px';
				} 
			});
			
			this.editor.addListener('resetGraphView', updateChromelessToolbarPosition);
			updateChromelessToolbarPosition();
			
			var btnCount = 0;
	
			var addButton = mxUtils.bind(this, function(fn, imgSrc, tip)
			{
				btnCount++;
				
				var a = document.createElement('span');
				a.style.paddingLeft = '8px';
				a.style.paddingRight = '8px';
				a.style.cursor = 'pointer';
				mxEvent.addListener(a, 'click', fn);
				
				if (tip != null)
				{
					a.setAttribute('title', tip);
				}
				
				var img = document.createElement('img');
				img.setAttribute('border', '0');
				img.setAttribute('src', imgSrc);
				img.style.width = '36px';
				img.style.filter = 'invert(100%)';
				
				a.appendChild(img);
				this.chromelessToolbar.appendChild(a);
				
				return a;
			});
			
			if (toolbarConfig.backBtn != null)
			{
				var backUrl = Graph.sanitizeLink(toolbarConfig.backBtn.url);

				if (backUrl != null)
				{
					addButton(mxUtils.bind(this, function(evt)
					{
						window.location.href = backUrl;
						mxEvent.consume(evt);
					}), Editor.backImage, mxResources.get('back', null, 'Back'));
				}
			}
			
			if (this.isPagesEnabled())
			{
				var prevButton = addButton(mxUtils.bind(this, function(evt)
				{
					this.actions.get('previousPage').funct();
					mxEvent.consume(evt);
				}), Editor.chevronLeftImage, mxResources.get('previousPage'));
				
				var pageInfo = document.createElement('div');
				pageInfo.style.fontFamily = Editor.defaultHtmlFont;
				pageInfo.style.display = 'inline-block';
				pageInfo.style.verticalAlign = 'top';
				pageInfo.style.fontWeight = 'bold';
				pageInfo.style.marginTop = '8px';
				pageInfo.style.fontSize = '14px';
				pageInfo.style.cursor = 'default';

				pageInfo.style.color = '#ffffff';

				this.chromelessToolbar.appendChild(pageInfo);
				
				var nextButton = addButton(mxUtils.bind(this, function(evt)
				{
					this.actions.get('nextPage').funct();
					mxEvent.consume(evt);
				}), Editor.chevronRightImage, mxResources.get('nextPage'));
				
				var updatePageInfo = mxUtils.bind(this, function()
				{
					if (this.pages != null && this.pages.length > 1 && this.currentPage != null)
					{
						pageInfo.innerText = '';
						var index = mxUtils.indexOf(this.pages, this.currentPage);
						mxUtils.write(pageInfo, (index + 1) + ' / ' + this.pages.length);
						pageInfo.setAttribute('title', mxResources.get('currentPage') + ': ' +
							this.currentPage.getName());
						prevButton.setAttribute('title', mxResources.get('previousPage') + ': ' +
							this.pages[mxUtils.mod(index - 1, this.pages.length)].getName());
						nextButton.setAttribute('title', mxResources.get('nextPage') + ': ' +
							this.pages[mxUtils.mod(index + 1, this.pages.length)].getName());
					}
				});
				
				prevButton.style.paddingLeft = '0px';
				prevButton.style.paddingRight = '4px';
				nextButton.style.paddingLeft = '4px';
				nextButton.style.paddingRight = '0px';
				
				var updatePageButtons = mxUtils.bind(this, function()
				{
					if (this.pages != null && this.pages.length > 1 && this.currentPage != null)
					{
						nextButton.style.display = '';
						prevButton.style.display = '';
						pageInfo.style.display = 'inline-block';
					}
					else
					{
						nextButton.style.display = 'none';
						prevButton.style.display = 'none';
						pageInfo.style.display = 'none';
					}
					
					updatePageInfo();
				});

				if (this.menus != null)
				{
					var pagesMenu = this.menus.get('pages');

					if (pagesMenu != null)
					{
						mxEvent.addListener(pageInfo, 'click', mxUtils.bind(this, function(evt)
						{
							var menu = new mxPopupMenu(pagesMenu.funct);
							menu.smartSeparators = true;
							menu.showDisabled = true;
							menu.autoExpand = true;
							
							// Disables autoexpand and destroys menu when hidden
							menu.hideMenu = mxUtils.bind(this, function()
							{
								mxPopupMenu.prototype.hideMenu.apply(menu, arguments);
								menu.destroy();
							});
			
							var offset = mxUtils.getOffset(pageInfo);
							menu.popup(offset.x, offset.y + pageInfo.offsetHeight, null, evt);

							mxEvent.addListener(menu.div, 'mouseleave', mxUtils.bind(this, function()
							{
								menu.hideMenu();
							}));
						}));
					}
				}
				
				this.editor.addListener('resetGraphView', updatePageButtons);
				this.editor.addListener('pageSelected', updatePageInfo);
			}
		
			addButton(mxUtils.bind(this, function(evt)
			{
				this.actions.get('zoomOut').funct();
				mxEvent.consume(evt);
			}), Editor.zoomOutImage, mxResources.get('zoomOut') + ' (Alt+Mousewheel)');
			
			addButton(mxUtils.bind(this, function(evt)
			{
				this.actions.get('zoomIn').funct();
				mxEvent.consume(evt);
			}), Editor.zoomInImage, mxResources.get('zoomIn') + ' (Alt+Mousewheel)');
			
			addButton(mxUtils.bind(this, function(evt)
			{
				this.actions.get('smartFit').funct();
				mxEvent.consume(evt);
			}), Editor.zoomFitImage, mxResources.get('fit'));
	
			// Changes toolbar opacity on hover
			var fadeThread = null;
			var fadeThread2 = null;
			
			var fadeOut = mxUtils.bind(this, function(delay)
			{
				if (fadeThread != null)
				{
					window.clearTimeout(fadeThread);
					fadeThread = null;
				}
				
				if (fadeThread2 != null)
				{
					window.clearTimeout(fadeThread2);
					fadeThread2 = null;
				}
				
				fadeThread = window.setTimeout(mxUtils.bind(this, function()
				{
				 	mxUtils.setOpacity(this.chromelessToolbar, 0);
					fadeThread = null;
				 	
					fadeThread2 = window.setTimeout(mxUtils.bind(this, function()
					{
						this.chromelessToolbar.style.display = 'none';
						fadeThread2 = null;
					}), 600);
				}), delay || 200);
			});
			
			var fadeIn = mxUtils.bind(this, function(opacity)
			{
				if (fadeThread != null)
				{
					window.clearTimeout(fadeThread);
					fadeThread = null;
				}
				
				if (fadeThread2 != null)
				{
					window.clearTimeout(fadeThread2);
					fadeThread2 = null;
				}
				
				this.chromelessToolbar.style.display = '';
				mxUtils.setOpacity(this.chromelessToolbar, opacity || 30);
			});
	
			if (urlParams['layers'] == '1')
			{
				this.layersDialog = null;
				
				var layersButton = addButton(mxUtils.bind(this, function(evt)
				{
					if (this.layersDialog != null)
					{
						this.layersDialog.parentNode.removeChild(this.layersDialog);
						this.layersDialog = null;
					}
					else
					{
						this.layersDialog = graph.createLayersDialog(mxUtils.bind(this, function()
						{
							if (this.chromelessResize)
							{
								this.chromelessResize();
							}
						}), true);
						
						mxEvent.addListener(this.layersDialog, 'mouseleave', mxUtils.bind(this, function()
						{
							this.layersDialog.parentNode.removeChild(this.layersDialog);
							this.layersDialog = null;
						}));
						
						var r = layersButton.getBoundingClientRect();
						
						mxUtils.setPrefixedStyle(this.layersDialog.style, 'borderRadius', '5px');
						this.layersDialog.style.position = 'fixed';
						this.layersDialog.style.fontFamily = Editor.defaultHtmlFont;
						this.layersDialog.style.width = '160px';
						this.layersDialog.style.padding = '4px 2px 4px 2px';
						this.layersDialog.style.left = r.left + 'px';
						this.layersDialog.style.bottom = parseInt(this.chromelessToolbar.style.bottom) +
							this.chromelessToolbar.offsetHeight + 4 + 'px';

						this.layersDialog.style.backgroundColor = '#000000';
						this.layersDialog.style.color = '#ffffff';
						mxUtils.setOpacity(this.layersDialog, 80);

						// Puts the dialog on top of the container z-index
						var style = mxUtils.getCurrentStyle(this.editor.graph.container);
						this.layersDialog.style.zIndex = style.zIndex;
						
						document.body.appendChild(this.layersDialog);
						this.editor.fireEvent(new mxEventObject('layersDialogShown'));
					}
					
					mxEvent.consume(evt);
				}), Editor.layersImage, mxResources.get('layers'));
				
				// Shows/hides layers button depending on content
				var model = graph.getModel();
	
				model.addListener(mxEvent.CHANGE, function()
				{
					layersButton.style.display = (model.getChildCount(model.root) > 1) ? '' : 'none';
				});
			}
	
			if (urlParams['openInSameWin'] != '1' || navigator.standalone)
			{
				this.addChromelessToolbarItems(addButton);
			}
	
			if (this.editor.editButtonLink != null || this.editor.editButtonFunc != null)
			{
				addButton(mxUtils.bind(this, function(evt)
				{
					if (this.editor.editButtonFunc != null) 
					{
						this.editor.editButtonFunc();
					} 
					else if (this.editor.editButtonLink == '_blank')
					{
						var pageId = (this.currentPage != null) ?
							this.currentPage.getId() : null;
						this.editor.editAsNew(this.getEditBlankXml(),
							null, null, pageId);
					}
					else
					{
						graph.openLink(this.editor.editButtonLink, 'editWindow');
					}
					
					mxEvent.consume(evt);
				}), Editor.editImage, mxResources.get('edit'));
			}
			
			if (this.lightboxToolbarActions != null)
			{
				for (var i = 0; i < this.lightboxToolbarActions.length; i++)
				{
					var lbAction = this.lightboxToolbarActions[i];
					lbAction.elem = addButton(lbAction.fn, lbAction.icon, lbAction.tooltip);
				}
			}

			if (toolbarConfig.refreshBtn != null)
			{
				var refreshUrl = (toolbarConfig.refreshBtn.url == null) ? null :
					Graph.sanitizeLink(toolbarConfig.refreshBtn.url);

				addButton(mxUtils.bind(this, function(evt)
				{
					if (refreshUrl != null)
					{
						window.location.href = refreshUrl;
					}
					else
					{
						window.location.reload();
					}
					
					mxEvent.consume(evt);
				}), Editor.refreshImage, mxResources.get('refresh', null, 'Refresh'));
			}

			if (toolbarConfig.fullscreenBtn != null && window.self !== window.top)
			{
				addButton(mxUtils.bind(this, function(evt)
				{
					if (toolbarConfig.fullscreenBtn.url)
					{
						graph.openLink(toolbarConfig.fullscreenBtn.url);
					}
					else
					{
						graph.openLink(window.location.href);
					}
					
					mxEvent.consume(evt);
				}), Editor.fullscreenImage, mxResources.get('openInNewWindow', null, 'Open in New Window'));
			}
			
			if (!toolbarConfig.noCloseBtn && ((toolbarConfig.closeBtn && window.self === window.top) ||
				(graph.lightbox && (urlParams['close'] == '1' || this.container != document.body))))
			{
				addButton(mxUtils.bind(this, function(evt)
				{
					if (urlParams['close'] == '1' || toolbarConfig.closeBtn)
					{
						window.close();
					}
					else
					{
						this.destroy();
						mxEvent.consume(evt);
					}
				}), Editor.closeImage, mxResources.get('close') + ' (Escape)');
			}
	
			// Initial state invisible
			this.chromelessToolbar.style.display = 'none';
			
			if (!graph.isViewer())
			{
				mxUtils.setPrefixedStyle(this.chromelessToolbar.style, 'transform', 'translate(-50%,0)');
			}
			
			graph.container.appendChild(this.chromelessToolbar);
			
			mxEvent.addListener(graph.container, (mxClient.IS_POINTER) ? 'pointermove' : 'mousemove', mxUtils.bind(this, function(evt)
			{
				if (!mxEvent.isTouchEvent(evt))
				{
					if (!mxEvent.isShiftDown(evt))
					{
						fadeIn(30);
					}
					
					fadeOut();
				}
			}));
			
			mxEvent.addListener(this.chromelessToolbar, (mxClient.IS_POINTER) ? 'pointermove' : 'mousemove', function(evt)
			{
				mxEvent.consume(evt);
			});
			
			mxEvent.addListener(this.chromelessToolbar, 'mouseenter', mxUtils.bind(this, function(evt)
			{
				graph.tooltipHandler.resetTimer();
				graph.tooltipHandler.hideTooltip();

				if (!mxEvent.isShiftDown(evt))
				{
					fadeIn(100);
				}
				else
				{
					fadeOut();
				}
			}));

			mxEvent.addListener(this.chromelessToolbar, 'mousemove',  mxUtils.bind(this, function(evt)
			{
				if (!mxEvent.isShiftDown(evt))
				{
					fadeIn(100);
				}
				else
				{
					fadeOut();
				}
				
				mxEvent.consume(evt);
			}));

			mxEvent.addListener(this.chromelessToolbar, 'mouseleave',  mxUtils.bind(this, function(evt)
			{
				if (!mxEvent.isTouchEvent(evt))
				{
					fadeIn(30);
				}
			}));

			// Shows/hides toolbar for touch devices
			var tol = graph.getTolerance();

			graph.addMouseListener(
			{
			    startX: 0,
			    startY: 0,
			    scrollLeft: 0,
			    scrollTop: 0,
			    mouseDown: function(sender, me)
			    {
			    	this.startX = me.getGraphX();
			    	this.startY = me.getGraphY();
				    this.scrollLeft = graph.container.scrollLeft;
				    this.scrollTop = graph.container.scrollTop;
			    },
			    mouseMove: function(sender, me) {},
			    mouseUp: function(sender, me)
			    {
			    	if (mxEvent.isTouchEvent(me.getEvent()))
			    	{
				    	if ((Math.abs(this.scrollLeft - graph.container.scrollLeft) < tol &&
				    		Math.abs(this.scrollTop - graph.container.scrollTop) < tol) &&
				    		(Math.abs(this.startX - me.getGraphX()) < tol &&
				    		Math.abs(this.startY - me.getGraphY()) < tol))
				    	{
				    		if (parseFloat(ui.chromelessToolbar.style.opacity || 0) > 0)
				    		{
				    			fadeOut();
				    		}
				    		else
				    		{
				    			fadeIn(30);
				    		}
						}
			    	}
			    }
			});
		} // end if toolbar

		// Installs handling of highlight and handling links to relative links and anchors
		if (!this.editor.editable)
		{
			this.addChromelessClickHandler();
		}
	}
	else if (this.editor.extendCanvas)
	{
		/**
		 * Guesses autoTranslate to avoid another repaint (see below).
		 * Works if only the scale of the graph changes or if pages
		 * are visible and the visible pages do not change. Uses
		 * geometries to guess the bounding box of the graph.
		 */
		var graphViewValidate = graph.view.validate;
		var zero = new mxPoint();
		var pageChanged = false;
		var lastPage = null;

		graph.view.validate = function()
		{
			if (graph.container != null &&
				mxUtils.hasScrollbars(graph.container))
			{
				// Sets initial state after page changes
				if (ui.currentPage != null &&
					lastPage != ui.currentPage)
				{
					lastPage = ui.currentPage;
					pageChanged = true;

					// Sets initial translate based on geometries
					// to avoid revalidation in sizeDidChange
					var bbox = graph.getBoundingBoxFromGeometry(
						graph.model.getCells(), true, null, true);
					
					// Handles blank diagrams
					if (bbox == null)
					{
						bbox = new mxRectangle(
							graph.view.translate.x * graph.view.scale,
							graph.view.translate.y * graph.view.scale);
					}

					var pageLayout = graph.getPageLayout(bbox, zero, 1);
					var tr = graph.getDefaultTranslate(pageLayout);
					this.x0 = pageLayout.x;
					this.y0 = pageLayout.y;
					
					if (tr.x != this.translate.x ||
						tr.y != this.translate.y)
					{
						this.invalidate();
						this.translate.x = tr.x;
						this.translate.y = tr.y;
					}
				}
				
				var pad = graph.getPagePadding();
				var size = graph.getPageSize();
				var tx = pad.x - (this.x0 || 0) * size.width;
				var ty = pad.y - (this.y0 || 0) * size.height;

				if (this.translate.x != tx || this.translate.y != ty)
				{
					this.invalidate();	
					this.translate.x = tx
					this.translate.y = ty
				}
			}
			
			graphViewValidate.apply(this, arguments);
		};
		
		if (!graph.isViewer())
		{
			var graphSizeDidChange = graph.sizeDidChange;

			graph.sizeDidChange = function()
			{
				var skipScroll = pageChanged;
				pageChanged = false;

				if (this.container != null &&
					mxUtils.hasScrollbars(this.container))
				{
					this.updateMinimumSize();

					if (!this.autoTranslate)
					{
						var pageLayout = this.getPageLayout();
						var tr = this.getDefaultTranslate(pageLayout);
						var tx = this.view.translate.x;
						var ty = this.view.translate.y;
						
						if (tr.x != tx || tr.y != ty)
						{
							this.view.x0 = pageLayout.x;
							this.view.y0 = pageLayout.y;

							// Requires full revalidation
							this.autoTranslate = true;
							this.view.setTranslate(tr.x, tr.y);
							this.autoTranslate = false;

							// Skipped if initial autoTranslate is wrong
							if (!skipScroll)
							{
								this.container.scrollLeft += Math.round((tr.x - tx) * this.view.scale);
								this.container.scrollTop += Math.round((tr.y - ty) * this.view.scale);
							}

							return;
						}
					}
					
					graphSizeDidChange.apply(this, arguments);
				}
				else
				{
					// Fires event but does not invoke superclass
					this.fireEvent(new mxEventObject(mxEvent.SIZE,
						'bounds', this.getGraphBounds()));
				}
			};
		}
	}
	
	// Accumulates the zoom factor while the rendering is taking place
	// so that not the complete sequence of zoom steps must be painted
	var bgGroup = graph.view.getBackgroundPane();
	var mainGroup = graph.view.getDrawPane();
	graph.cumulativeZoomFactor = 1;
	var updateZoomTimeout = null;
	var cursorPosition = null;
	var scrollPosition = null;
	var forcedZoom = null;
	var filter = null;
	var mult = 20;
	
	var scheduleZoom = function(delay)
	{
		if (updateZoomTimeout != null)
		{
			window.clearTimeout(updateZoomTimeout);
		}

		if (delay >= 0)
		{
			window.setTimeout(function()
			{
				if (!graph.isMouseDown || forcedZoom)
				{
					updateZoomTimeout = window.setTimeout(mxUtils.bind(this, function()
					{
						if (graph.isFastZoomEnabled())
						{
							// Transforms background page
							if (graph.view.backgroundPageShape != null && graph.view.backgroundPageShape.node != null)
							{
								mxUtils.setPrefixedStyle(graph.view.backgroundPageShape.node.style, 'transform-origin', null);
								mxUtils.setPrefixedStyle(graph.view.backgroundPageShape.node.style, 'transform', null);
							}
							
							// Transforms graph and background image
							mainGroup.style.transformOrigin = '';
							bgGroup.style.transformOrigin = '';

							// Workaround for no reset of transform in Safari
							if (mxClient.IS_SF)
							{
								mainGroup.style.transform = 'scale(1)';
								bgGroup.style.transform = 'scale(1)';
								
								window.setTimeout(function()
								{
									mainGroup.style.transform = '';
									bgGroup.style.transform = '';
								}, 0)
							}
							else
							{
								mainGroup.style.transform = '';
								bgGroup.style.transform = '';
							}
							
							// Shows interactive elements
							graph.view.getDecoratorPane().style.opacity = '';
							graph.view.getOverlayPane().style.opacity = '';

							var hints = graph.container.querySelectorAll('.geHint');

							for (var i = 0; i < hints.length; i++)
							{
								hints[i].style.opacity = '';
							}
						}
						
						var sp = new mxPoint(graph.container.scrollLeft, graph.container.scrollTop);
						var offset = mxUtils.getOffset(graph.container);
						var prev = graph.view.scale;
						var tx0 = graph.view.translate.x;
						var ty0 = graph.view.translate.y;
						var dx = 0;
						var dy = 0;
						
						if (cursorPosition != null)
						{
							dx = graph.container.offsetWidth / 2 - cursorPosition.x + offset.x;
							dy = graph.container.offsetHeight / 2 - cursorPosition.y + offset.y;
						}

						// Skips the built-in scroll reconciliation for editor (scrollbar)
						// mode so the exact zoom-to-cursor anchor can be applied below.
						// The chromeless/no-scrollbar path keeps the legacy behaviour.
						var exact = resize == null && mxUtils.hasScrollbars(graph.container);
						graph.zoom(graph.cumulativeZoomFactor, exact ? false : null,
							graph.isFastZoomEnabled() ? mult : null, exact);
						var s = graph.view.scale;

						if (s != prev)
						{
							if (exact)
							{
								// Exact zoom-to-cursor: keeps the world point under the
								// anchor pixel (cursor, else viewport centre) fixed as the
								// scale changes. Derived from holding the on-screen position
								// p = (w + translate) * scale - scroll constant, which gives
								// scroll' = scroll * f + p * (f - 1) + (translate' - translate) * s.
								// Uses the rounded scale s so the repaint lands on exactly the
								// previewed scale, and folds in any translate shift caused by
								// the canvas resize during the zoom.
								var f = s / prev;
								var px = (cursorPosition != null) ?
									cursorPosition.x - offset.x : graph.container.clientWidth / 2;
								var py = (cursorPosition != null) ?
									cursorPosition.y - offset.y : graph.container.clientHeight / 2;

								// Accounts for any pan/scroll that happened while the repaint
								// was pending (e.g. right-button pan): the CSS preview pivots
								// about a content point that moves with the scroll, so the
								// anchor pixel must follow it to match the preview at handoff.
								if (scrollPosition != null)
								{
									px -= sp.x - scrollPosition.x;
									py -= sp.y - scrollPosition.y;
								}

								graph.container.scrollLeft = Math.round(sp.x * f + px * (f - 1) +
									(graph.view.translate.x - tx0) * s);
								graph.container.scrollTop = Math.round(sp.y * f + py * (f - 1) +
									(graph.view.translate.y - ty0) * s);
							}
							else
							{
								if (scrollPosition != null)
								{
									dx += sp.x - scrollPosition.x;
									dy += sp.y - scrollPosition.y;
								}

								if (resize != null)
								{
									ui.chromelessResize(false, null, dx * (graph.cumulativeZoomFactor - 1),
										dy * (graph.cumulativeZoomFactor - 1));
								}

								if (mxUtils.hasScrollbars(graph.container) && (dx != 0 || dy != 0))
								{
									graph.container.scrollLeft -= dx * (graph.cumulativeZoomFactor - 1);
									graph.container.scrollTop -= dy * (graph.cumulativeZoomFactor - 1);
								}
							}
						}
						
						if (filter != null)
						{
							mainGroup.setAttribute('filter', filter);
						}
						
						graph.fireEvent(new mxEventObject('zoomPreviewComplete'));
						graph.cumulativeZoomFactor = 1;
						updateZoomTimeout = null;
						scrollPosition = null;
						cursorPosition = null;
						forcedZoom = null;
						filter = null;
					}), (delay != null) ? delay : ((graph.isFastZoomEnabled()) ? ui.wheelZoomDelay : ui.lazyZoomDelay));
				}
			}, 0);
		}
	};
	
	graph.lazyZoom = function(zoomIn, ignoreCursorPosition, delay, factor)
	{
		factor = (factor != null) ? factor : this.zoomFactor;

		// TODO: Fix ignored cursor position if scrollbars are disabled
		ignoreCursorPosition = ignoreCursorPosition || !graph.scrollbars;
		
		if (ignoreCursorPosition)
		{
			cursorPosition = new mxPoint(
				graph.container.offsetLeft + graph.container.clientWidth / 2,
				graph.container.offsetTop + graph.container.clientHeight / 2);
		}
		
		// Switches to 5% zoom steps below 15%
		if (zoomIn)
		{
			if (this.view.scale * this.cumulativeZoomFactor <= 0.15)
			{
				this.cumulativeZoomFactor *= (this.view.scale + 0.05) / this.view.scale;
			}
			else
			{
				this.cumulativeZoomFactor *= factor;
				this.cumulativeZoomFactor = Math.round(this.view.scale * this.cumulativeZoomFactor * 100) / 100 / this.view.scale;
			}
		}
		else
		{
			if (this.view.scale * this.cumulativeZoomFactor <= 0.15)
			{
				this.cumulativeZoomFactor *= (this.view.scale - 0.05) / this.view.scale;
			}
			else
			{
				this.cumulativeZoomFactor /= factor;
				this.cumulativeZoomFactor = Math.round(this.view.scale * this.cumulativeZoomFactor * 100) / 100 / this.view.scale;
			}
		}

		this.cumulativeZoomFactor = Math.max(0.05, Math.min(this.view.scale * this.cumulativeZoomFactor, 160)) / this.view.scale;

		if (graph.isFastZoomEnabled())
		{
			if (filter == null && mainGroup.getAttribute('filter') != '')
			{
				filter = mainGroup.getAttribute('filter');
				mainGroup.removeAttribute('filter');
			}

			scrollPosition = new mxPoint(graph.container.scrollLeft, graph.container.scrollTop);

			// Applies final rounding to preview
			var f = Math.round((Math.round(this.view.scale * this.cumulativeZoomFactor *
				100) / 100) * mult) / (mult * this.view.scale);
			
			var cx = (ignoreCursorPosition || cursorPosition == null) ?
				graph.container.scrollLeft + graph.container.clientWidth / 2 :
				cursorPosition.x + graph.container.scrollLeft - graph.container.offsetLeft;
			var cy = (ignoreCursorPosition || cursorPosition == null) ?
				graph.container.scrollTop + graph.container.clientHeight / 2 :
				cursorPosition.y + graph.container.scrollTop - graph.container.offsetTop;
			mainGroup.style.transformOrigin = cx + 'px ' + cy + 'px';
			mainGroup.style.transform = 'scale(' + f + ')';
			bgGroup.style.transformOrigin = cx + 'px ' + cy + 'px';
			bgGroup.style.transform = 'scale(' + f + ')';
			
			if (graph.view.backgroundPageShape != null && graph.view.backgroundPageShape.node != null)
			{
				var page = graph.view.backgroundPageShape.node;
				
				mxUtils.setPrefixedStyle(page.style, 'transform-origin',
					((ignoreCursorPosition || cursorPosition == null) ?
						((graph.container.clientWidth / 2 + graph.container.scrollLeft -
						page.offsetLeft) + 'px') : ((cursorPosition.x + graph.container.scrollLeft -
						page.offsetLeft - graph.container.offsetLeft) + 'px')) + ' ' +
					((ignoreCursorPosition || cursorPosition == null) ?
						((graph.container.clientHeight / 2 + graph.container.scrollTop -
						page.offsetTop) + 'px') : ((cursorPosition.y + graph.container.scrollTop -
						page.offsetTop - graph.container.offsetTop) + 'px')));
				mxUtils.setPrefixedStyle(page.style, 'transform', 'scale(' + f + ')');
			}
			else
			{
				graph.view.validateBackgroundStyles(f, cx, cy);
			}

			graph.view.getDecoratorPane().style.opacity = '0';
			graph.view.getOverlayPane().style.opacity = '0';

			var hints = graph.container.querySelectorAll('.geHint');

			for (var i = 0; i < hints.length; i++)
			{
				hints[i].style.opacity = '0';
			}

			graph.fireEvent(new mxEventObject('zoomPreview', 'factor', f));
		}
		
		scheduleZoom(graph.isFastZoomEnabled() ? delay : 0);
	};
	
	// Holds back repaint until after mouse gestures
	mxEvent.addGestureListeners(graph.container, function(evt)
	{
		if (updateZoomTimeout != null)
		{
			window.clearTimeout(updateZoomTimeout);
		}
	}, null, function(evt)
	{
		if (graph.cumulativeZoomFactor != 1)
		{
			scheduleZoom(0);
		}
	});
	
	// Holds back repaint until scroll ends
	mxEvent.addListener(graph.container, 'scroll', function(evt)
	{
		if (updateZoomTimeout != null && !graph.isMouseDown && graph.cumulativeZoomFactor != 1)
		{
			scheduleZoom(0);
		}
	});
	
	mxEvent.addMouseWheelListener(mxUtils.bind(this, function(evt, up, force, cx, cy)
	{
		graph.fireEvent(new mxEventObject('wheel'));

		if (graph.freehand != null && graph.freehand.isDrawing())
		{
			return;
		}

		// Passive scroll mode: forward non-zoom wheel events to
		// the parent frame for page scrolling instead of handling
		// them as diagram pan/scroll.  This allows the host
		// application to own the scroll behaviour while the
		// embedded editor remains fully interactive.
		if (Editor.passiveScroll && !force &&
			graph.isScrollWheelEvent(evt))
		{
			if (window.parent != null && window.parent != window)
			{
				var deltaY = (evt.deltaY != null) ? evt.deltaY :
					((up) ? -60 : 60);
				var deltaX = (evt.deltaX != null) ? evt.deltaX : 0;

				window.parent.postMessage(JSON.stringify({
					event: 'scrollWheel',
					deltaX: deltaX,
					deltaY: deltaY
				}), '*');
			}

			return;
		}

		if (this.dialogs == null || this.dialogs.length == 0)
		{
			// Scrolls with scrollbars turned off
			if (!graph.scrollbars && !force && graph.isScrollWheelEvent(evt))
            {
                var t = graph.view.getTranslate();
                var step = 40 / graph.view.scale;
				
                if (!mxEvent.isShiftDown(evt))
                {
                    graph.view.setTranslate(t.x, t.y + ((up) ? step : -step));
                }
                else
                {
                    graph.view.setTranslate(t.x + ((up) ? -step : step), t.y);
                }
            }
			else if (force || graph.isZoomWheelEvent(evt))
			{
				var source = mxEvent.getSource(evt);

				while (source != null)
				{
					if (source == graph.container)
					{
						graph.tooltipHandler.hideTooltip();
						var mousePos = (cx != null && cy != null) ? new mxPoint(cx, cy) :
							new mxPoint(mxEvent.getClientX(evt), mxEvent.getClientY(evt));
						var prevCursorPosition = (cursorPosition != null) ?
							new mxPoint(cursorPosition.x, cursorPosition.y) : null;
						var prevFactor = graph.cumulativeZoomFactor;
						cursorPosition = mousePos;
						forcedZoom = force;
						var factor = graph.zoomFactor;
						var delay = null;

						// Slower zoom for pinch gesture on trackpad with max delta to
						// filter out mouse wheel events in Brave browser for Windows
						if (evt.ctrlKey && evt.deltaY != null && Math.abs(evt.deltaY) < 40 &&
							Math.round(evt.deltaY) != evt.deltaY)
						{
							factor = 1 + (Math.abs(evt.deltaY) / 20) * (factor - 1);
						}
						// Slower zoom for pinch gesture on touch screens
						else if (evt.movementY != null && evt.type == 'pointermove')
						{
							factor = 1 + (Math.max(1, Math.abs(evt.movementY)) / 20) * (factor - 1);
							delay = -1;
						}

						graph.lazyZoom(up, null, delay, factor);

						// Computes combined zoom origin when mouse moves during
						// a zoom sequence to avoid viewport jump at the final DOM
						// update. Reapplies CSS transform-origin with the corrected
						// origin that represents the single equivalent zoom point
						// for all accumulated steps.
						if (prevCursorPosition != null && prevFactor != 1 &&
							graph.isFastZoomEnabled() && graph.scrollbars)
						{
							var newFactor = graph.cumulativeZoomFactor;
							var stepFactor = newFactor / prevFactor;
							var denom = 1 - newFactor;

							if (Math.abs(denom) > 0.001)
							{
								cursorPosition = new mxPoint(
									(mousePos.x * (1 - stepFactor) +
										stepFactor * prevCursorPosition.x *
										(1 - prevFactor)) / denom,
									(mousePos.y * (1 - stepFactor) +
										stepFactor * prevCursorPosition.y *
										(1 - prevFactor)) / denom);

								var ox = cursorPosition.x + graph.container.scrollLeft -
									graph.container.offsetLeft;
								var oy = cursorPosition.y + graph.container.scrollTop -
									graph.container.offsetTop;
								mainGroup.style.transformOrigin = ox + 'px ' + oy + 'px';
								bgGroup.style.transformOrigin = ox + 'px ' + oy + 'px';

								if (graph.view.backgroundPageShape != null &&
									graph.view.backgroundPageShape.node != null)
								{
									var page = graph.view.backgroundPageShape.node;

									mxUtils.setPrefixedStyle(page.style, 'transform-origin',
										(cursorPosition.x + graph.container.scrollLeft -
											page.offsetLeft - graph.container.offsetLeft) + 'px ' +
										(cursorPosition.y + graph.container.scrollTop -
											page.offsetTop - graph.container.offsetTop) + 'px');
								}
								else
								{
									var f = Math.round((Math.round(graph.view.scale *
										newFactor * 100) / 100) * mult) / (mult *
										graph.view.scale);
									graph.view.validateBackgroundStyles(f, ox, oy);
								}
							}
						}

						mxEvent.consume(evt);

						return false;
					}
					
					source = source.parentNode;
				}
			}
		}
	}), graph.container);
	
	// Uses fast zoom for pinch gestures on iOS
	graph.panningHandler.zoomGraph = function(evt)
	{
		graph.cumulativeZoomFactor = evt.scale;
		graph.lazyZoom(evt.scale > 0, true);
		mxEvent.consume(evt);
	};
};

/**
 * Creates a temporary graph instance for rendering off-screen content.
 */
EditorUi.prototype.addChromelessToolbarItems = function(addButton)
{
	if (urlParams['noPrint'] != '1')
	{
		addButton(mxUtils.bind(this, function(evt)
		{
			this.actions.get('print').funct();
			mxEvent.consume(evt);
		}), Editor.printImage, mxResources.get('print'));
	}
};

/**
 * Creates a temporary graph instance for rendering off-screen content.
 */
EditorUi.prototype.isPagesEnabled = function()
{
	return this.editor.editable || urlParams['hide-pages'] != '1';
};

/**
 * Creates a temporary graph instance for rendering off-screen content.
 */
EditorUi.prototype.createTemporaryGraph = function(stylesheet)
{
	return Graph.createOffscreenGraph(stylesheet);
};

/**
 * 
 */
EditorUi.prototype.addChromelessClickHandler = function()
{
	var hl = urlParams['highlight'];
	
	// Adds leading # for highlight color code
	if (hl != null && hl.length > 0)
	{
		hl = '#' + hl;
	}

	this.editor.graph.addClickHandler(hl);
};

/**
 * 
 */
EditorUi.prototype.toggleFormatPanel = function(visible)
{
	visible = (visible != null) ? visible : this.formatWidth == 0;

	if (this.format != null)
	{
		var delay = Editor.transitionDelay;
		mxUtils.setPrefixedStyle(this.formatContainer.style, 'transition', 'width ' + delay + 's ease-in-out');

		window.setTimeout(mxUtils.bind(this, function()
		{
			this.formatWidth = (visible) ? 240 : 0;
			this.hsplitPosition = Math.min(this.container.clientWidth -
				this.hsplit.clientWidth - this.formatWidth, this.hsplitPosition);
			this.refresh();

			window.setTimeout(mxUtils.bind(this, function()
			{
				mxUtils.setPrefixedStyle(this.formatContainer.style, 'transition', null);
				this.refresh(true);
				this.fireEvent(new mxEventObject('formatWidthChanged'));
			}), delay * 1000);
		}, 0));
	}
};

/**
 * 
 */
EditorUi.prototype.isFormatPanelVisible = function()
{
	return this.formatWidth > 0;
};

/**
 * Adds support for placeholders in labels.
 */
EditorUi.prototype.lightboxFit = function(maxHeight)
{
	if (this.isDiagramEmpty())
	{
		this.editor.graph.view.setScale(1);
	}
	else
	{
		var p = urlParams['border'];
		var border = 60;
		
		if (p != null)
		{
			border = parseInt(p);
		}
		
		// LATER: Use initial graph bounds to avoid rounding errors
		this.editor.graph.maxFitScale = this.lightboxMaxFitScale;
		this.editor.graph.fit(border, null, null, null, null, null, maxHeight);
		this.editor.graph.maxFitScale = null;
	}
};

/**
 * Translates this point by the given vector.
 * 
 * @param {number} dx X-coordinate of the translation.
 * @param {number} dy Y-coordinate of the translation.
 */
EditorUi.prototype.isDiagramEmpty = function()
{
	var model = this.editor.graph.getModel();
	
	return model.getChildCount(model.root) == 1 && model.getChildCount(model.getChildAt(model.root, 0)) == 0;
};

/**
 * Hook for allowing selection and context menu for certain events.
 */
EditorUi.prototype.isSelectionAllowed = function(evt)
{
	return mxEvent.getSource(evt).nodeName == 'SELECT' ||
		mxEvent.getSource(evt).nodeName == 'INPUT';
};

/**
 * Installs dialog if browser window is closed without saving
 * This must be disabled during save and image export.
 */
EditorUi.prototype.addBeforeUnloadListener = function()
{
	// Installs dialog if browser window is closed without saving
	// This must be disabled during save and image export
	window.onbeforeunload = mxUtils.bind(this, function()
	{
		if (!this.editor.isChromelessView())
		{
			return this.onBeforeUnload();
		}
	});
};

/**
 * Sets the onbeforeunload for the application
 */
EditorUi.prototype.onBeforeUnload = function()
{
	if (this.editor.modified)
	{
		return mxResources.get('allChangesLost');
	}
};

/**
 * Opens the current diagram via the window.opener if one exists.
 */
EditorUi.prototype.open = function()
{
	// Cross-domain window access is not allowed in FF, so if we
	// were opened from another domain then this will fail.
	try
	{
		if (window.opener != null && window.opener.openFile != null)
		{
			window.opener.openFile.setConsumer(mxUtils.bind(this, function(xml, filename)
			{
				try
				{
					var doc = mxUtils.parseXml(xml); 
					this.editor.setGraphXml(doc.documentElement);
					this.editor.setModified(false);
					this.editor.undoManager.clear();
					
					if (filename != null)
					{
						this.editor.setFilename(filename);
						this.updateDocumentTitle();
					}
					
					return;
				}
				catch (e)
				{
					mxUtils.alert(mxResources.get('invalidOrMissingFile') + ': ' + e.message);
				}
			}));
		}
	}
	catch(e)
	{
		// ignore
	}
	
	// Fires as the last step if no file was loaded
	this.editor.graph.view.validate();
	
	// Required only in special cases where an initial file is opened
	// and the minimumGraphSize changes and CSS must be updated.
	this.editor.graph.sizeDidChange();
	this.editor.fireEvent(new mxEventObject('resetGraphView'));
};

/**
 * 
 */
EditorUi.prototype.showPrintDialog = function(title, fn)
{
	this.showDialog(new PrintDialog(this, title, fn).container, 300, 180, true, true);
};

/**
 * Shows the given popup menu.
 */
EditorUi.prototype.showPopupMenu = function(fn, x, y, evt)
{
	this.editor.graph.popupMenuHandler.hideMenu();
	
	var menu = new mxPopupMenu(fn);
	menu.smartSeparators = true;
	menu.showDisabled = true;
	menu.autoExpand = true;
	
	// Disables autoexpand and destroys menu when hidden
	menu.hideMenu = mxUtils.bind(this, function()
	{
		mxPopupMenu.prototype.hideMenu.apply(menu, arguments);
		menu.destroy();
	});

	menu.popup(x, y, null, evt);
	
	// Allows hiding by clicking on document
	this.setCurrentMenu(menu);	
};

/**
 * Returns true if the given event should hide the current menu.
 */
EditorUi.prototype.isHideCurrentMenuEvent = function(evt)
{
	var source = mxEvent.getSource(evt);

	if (this.currentMenu != null)
	{
		if (source == this.currentMenu.div)
		{
			return false;
		}
		else
		{
			var activeRow = this.currentMenu.activeRow;

			while (activeRow != null)
			{
				if (source == activeRow.div)
				{
					return false;
				}

				activeRow = activeRow.activeRow;
			}
		}

		return true;
	}
	else
	{
		return false;
	}
};

/**
 * Sets the current menu and element.
 */
EditorUi.prototype.setCurrentMenu = function(menu, elt)
{
	this.currentMenuElt = elt;
	this.currentMenu = menu;
	this.hideShapePicker();
};

/**
 * Resets the current menu and element.
 */
EditorUi.prototype.resetCurrentMenu = function()
{
	this.currentMenuElt = null;
	this.currentMenu = null;
};

/**
 * Hides and destroys the current menu.
 */
EditorUi.prototype.hideCurrentMenu = function()
{
	if (this.currentMenu != null)
	{
		this.currentMenu.hideMenu();
		this.resetCurrentMenu();
	}
};

/**
 * Updates the document title.
 */
EditorUi.prototype.updateDocumentTitle = function()
{
	var title = this.editor.getOrCreateFilename();
	
	if (this.editor.appName != null)
	{
		title += ' - ' + this.editor.appName;
	}
	
	document.title = title;
};

/**
 * Updates the document title.
 */
EditorUi.prototype.createHoverIcons = function()
{
	return new HoverIcons(this.editor.graph);
};

/**
 * Hook for creating the inline toolbar.
 */
EditorUi.prototype.createInlineToolbar = function()
{
	return null;
};

/**
 * Returns the URL for a copy of this editor with no state.
 */
EditorUi.prototype.redo = function()
{
	try
	{
		var graph = this.editor.graph;
		
		if (graph.isEditing())
		{
			document.execCommand('redo', false, null);
		}
		else
		{
			this.editor.undoManager.redo();
		}
	}
	catch (e)
	{
		// ignore all errors
	}
};

/**
 * Returns the URL for a copy of this editor with no state.
 */
EditorUi.prototype.undo = function()
{
	try
	{
		var graph = this.editor.graph;
	
		if (graph.isEditing())
		{
			// Stops editing and executes undo on graph if native undo
			// does not affect current editing value
			var value = graph.cellEditor.textarea.innerHTML;
			document.execCommand('undo', false, null);
	
			if (value == graph.cellEditor.textarea.innerHTML)
			{
				graph.stopEditing(true);
				this.editor.undoManager.undo();
			}
		}
		else
		{
			this.editor.undoManager.undo();
		}
	}
	catch (e)
	{
		// ignore all errors
	}
};

/**
 * Returns the URL for a copy of this editor with no state.
 */
EditorUi.prototype.canRedo = function()
{
	return this.editor.graph.isEditing() || this.editor.undoManager.canRedo();
};

/**
 * Returns the URL for a copy of this editor with no state.
 */
EditorUi.prototype.canUndo = function()
{
	return this.editor.graph.isEditing() || this.editor.undoManager.canUndo();
};

/**
 * Returns the current page and XML for the given page.
 */
EditorUi.prototype.getDiagramSnapshot = function()
{
	return {node: this.editor.getGraphXml()};
};

/**
 * 
 */
EditorUi.prototype.updateDiagramData = function(snapshot, node)
{
	this.replaceDiagramData(xUtils.getXml(node));
};

/**
 * 
 */
EditorUi.prototype.replaceDiagramData = function(data)
{
	this.editor.graph.model.beginUpdate();
	try
	{
		this.editor.setGraphXml(mxUtils.parseXml(data).documentElement);
	}
	finally
	{
		this.editor.graph.model.endUpdate();				
	}
};

/**
 * 
 */
EditorUi.prototype.getEditBlankXml = function()
{
	return mxUtils.getXml(this.editor.getGraphXml());
};

/**
 * Returns the URL for a copy of this editor with no state.
 */
EditorUi.prototype.getUrl = function(pathname)
{
	var href = (pathname != null) ? pathname : window.location.pathname;
	var parms = (href.indexOf('?') > 0) ? 1 : 0;
	
	// Removes template URL parameter for new blank diagram
	for (var key in urlParams)
	{
		if (parms == 0)
		{
			href += '?';
		}
		else
		{
			href += '&';
		}
	
		href += key + '=' + urlParams[key];
		parms++;
	}
	
	return href;
};

/**
 * Specifies if the graph has scrollbars.
 */
EditorUi.prototype.setScrollbars = function(value)
{
	var graph = this.editor.graph;
	var prev = graph.container.style.overflow;
	graph.scrollbars = value;
	this.editor.updateGraphComponents();

	if (prev != graph.container.style.overflow)
	{
		graph.container.scrollTop = 0;
		graph.container.scrollLeft = 0;
		graph.view.scaleAndTranslate(1, 0, 0);
		this.resetScrollbars();
	}
	
	this.fireEvent(new mxEventObject('scrollbarsChanged'));
};

/**
 * Function: initialFitDiagram
 * 
 * Zooms the diagram to fit into the window.
 */
EditorUi.prototype.initialFitDiagram = function(maxScale)
{
	var b = (urlParams['border'] != null) ?
		parseInt(urlParams['border']) : 10;
	var bds = new mxRectangle(b, b, b, b);
	this.fitDiagramOrPages((maxScale != null) ?
		maxScale : 1, bds, true);
};

/**
 * Function: fitDiagramOrPages
 * 
 * Zooms the diagram to fit into the window.
 */
EditorUi.prototype.fitDiagramOrPages = function(maxScale, borders, ignorePages)
{
	var graph = this.editor.graph;

	if (graph.pageVisible && graph.isSelectionEmpty() && !ignorePages)
	{
		graph.fitPages(maxScale);
	}
	else
	{
		this.fitDiagramToWindow(maxScale, borders, ignorePages);
	}
};

/**
 * Function: fitDiagramToWindow
 * 
 * Zooms the diagram to fit into the window.
 */
EditorUi.prototype.fitDiagramToWindow = function(maxScale, borders, zoomOutOnly)
{
	var graph = this.editor.graph;
	var bounds = (graph.isSelectionEmpty()) ?
		mxRectangle.fromRectangle(graph.getGraphBounds()) :
		graph.getBoundingBox(graph.getSelectionCells());

	if (bounds == null)
	{
		return;
	}

	var t = graph.view.translate;
	var s = graph.view.scale;

	bounds.x = bounds.x / s - t.x;
	bounds.y = bounds.y / s - t.y;
	bounds.width /= s;
	bounds.height /= s;

	if (graph.backgroundImage != null)
	{
		bounds.add(new mxRectangle(0, 0,
			graph.backgroundImage.width,
			graph.backgroundImage.height));
	}

	if (bounds.width == 0 || bounds.height == 0)
	{
		graph.zoomTo(1);
		this.resetScrollbars();
	}
	else
	{
		var b = (borders != null) ? borders :
			Editor.fitWindowBorders;
		
		if (b != null)
		{
			bounds.x -= b.x;
			bounds.y -= b.y;
			bounds.width += b.width + b.x;
			bounds.height += b.height + b.y;
		}
		
		graph.fitWindow(bounds, null, maxScale, zoomOutOnly, zoomOutOnly);
	}
};

/**
 * Returns true if the graph has scrollbars.
 */
EditorUi.prototype.hasScrollbars = function()
{
	return this.editor.graph.scrollbars;
};

/**
 * Resets the state of the scrollbars.
 */
EditorUi.prototype.resetScrollbars = function()
{
	var graph = this.editor.graph;
	var c = graph.container;

	if (!this.editor.extendCanvas)
	{
		c.scrollTop = 0;
		c.scrollLeft = 0;
	
		if (!mxUtils.hasScrollbars(c))
		{
			graph.view.setTranslate(0, 0);
		}
	}
	else if (!this.editor.isChromelessView())
	{
		if (mxUtils.hasScrollbars(c))
		{
			if (graph.pageVisible)
			{
				var pad = graph.getPagePadding();
				c.scrollTop = Math.floor(pad.y);
				c.scrollLeft = Math.floor(Math.min(pad.x,
					(c.scrollWidth - c.clientWidth) / 2));

				// Scrolls graph to visible area
				var bounds = graph.getGraphBounds();
				
				if (bounds.width > 0 && bounds.height > 0)
				{
					if (bounds.x > c.scrollLeft + c.clientWidth * 0.9)
					{
						c.scrollLeft = Math.min(bounds.x + bounds.width - c.clientWidth, bounds.x - 10);
					}
					
					if (bounds.y > c.scrollTop + c.clientHeight * 0.9)
					{
						c.scrollTop = Math.min(bounds.y + bounds.height - c.clientHeight, bounds.y - 10);
					}
				}
			}
			else
			{
				var bounds = graph.getGraphBounds();

				if (bounds.width == 0 && bounds.height == 0)
				{
					c.scrollLeft = (c.scrollWidth - c.clientWidth) / 2;
					c.scrollTop = (c.scrollHeight - c.clientHeight) / 2;
				}
				else
				{
					var width = Math.max(bounds.width, graph.scrollTileSize.width * graph.view.scale);
					var height = Math.max(bounds.height, graph.scrollTileSize.height * graph.view.scale);

					c.scrollLeft = Math.floor(Math.max(0, bounds.x - Math.max(0, (c.clientWidth - width) / 2)));
					c.scrollTop = Math.floor(Math.max(0, bounds.y - Math.max(20, (c.clientHeight - height) / 4)));
				}
			}
		}
		else
		{
			var b = mxRectangle.fromRectangle((graph.pageVisible) ?
				graph.view.getBackgroundPageBounds() :
				graph.getGraphBounds())
			var tr = graph.view.translate;
			var s = graph.view.scale;
            b.x = b.x / s - tr.x;
            b.y = b.y / s - tr.y;
            b.width /= s;
            b.height /= s;

            var dy = (graph.pageVisible) ? 0 : Math.max(0, (c.clientHeight - b.height) / 4);

            if (urlParams['embedInline'] == '1')
            {
				graph.view.setTranslate(Math.floor(-b.x + 2),
					Math.floor(dy - b.y + 1));
            }
            else
            {
				graph.view.setTranslate(Math.floor(Math.max(0,
					(c.clientWidth - b.width) / 2) - b.x + 2),
					Math.floor(dy - b.y + 1));
            }
		}
	}
};

/**
 * Loads the stylesheet for this graph.
 */
EditorUi.prototype.setPageVisible = function(value)
{
	var graph = this.editor.graph;
	var hasScrollbars = mxUtils.hasScrollbars(graph.container);
	var tx = 0;
	var ty = 0;
	
	if (hasScrollbars)
	{
		tx = graph.view.translate.x * graph.view.scale - graph.container.scrollLeft;
		ty = graph.view.translate.y * graph.view.scale - graph.container.scrollTop;
	}
	
	graph.pageVisible = value;
	graph.pageBreaksVisible = value; 
	graph.preferPageSize = value;
	graph.view.validateBackground();

	// Workaround for possible handle offset
	if (hasScrollbars)
	{
		var cells = graph.getSelectionCells();
		graph.clearSelection();
		graph.setSelectionCells(cells);
	}
	
	// Calls updatePageBreaks
	graph.sizeDidChange();
	
	if (hasScrollbars)
	{
		graph.container.scrollLeft = graph.view.translate.x * graph.view.scale - tx;
		graph.container.scrollTop = graph.view.translate.y * graph.view.scale - ty;
	}
	
	graph.defaultPageVisible = value;
	this.fireEvent(new mxEventObject('pageViewChanged'));
};

/**
 * Loads the stylesheet for this graph.
 */
EditorUi.prototype.installResizeHandler = function(dialog, resizable, destroy)
{
	if (resizable)
	{
		dialog.window.setSize = function(w, h)
		{
			if (!this.minimized)
			{
				var iw = window.innerWidth || document.body.clientWidth || document.documentElement.clientWidth;
				var ih = window.innerHeight || document.body.clientHeight || document.documentElement.clientHeight;

				// Move the window to accommodate the new size before clamping
				var x = this.getX();
				var y = this.getY();
				var nx = (x + w > iw) ? Math.max(0, iw - w) : x;
				var ny = (y + h > ih) ? Math.max(0, ih - h) : y;

				if (nx != x || ny != y)
				{
					mxWindow.prototype.setLocation.call(this, nx, ny);
				}

				// Only clamp if still larger than entire viewport
				w = Math.min(w, iw);
				h = Math.min(h, ih);
			}

			mxWindow.prototype.setSize.apply(this, arguments);
		};
	}	

	dialog.window.setLocation = function(x, y)
	{
		if (this.div == null) return;

		var iw = window.innerWidth || document.body.clientWidth || document.documentElement.clientWidth;
		var ih = window.innerHeight || document.body.clientHeight || document.documentElement.clientHeight;

		var w = parseInt(this.div.style.width);
		var h = parseInt(this.div.style.height);

		// Move to keep the window within the viewport, preserving its size
		x = Math.max(0, Math.min(x, Math.max(0, iw - w)));
		y = Math.max(0, Math.min(y, Math.max(0, ih - h)));

		if (this.getX() != x || this.getY() != y)
		{
			mxWindow.prototype.setLocation.apply(this, arguments);
		}

		// Clamp size only if the window is still larger than the viewport
		if (resizable && !this.minimized)
		{
			var nw = Math.min(w, iw);
			var nh = Math.min(h, ih);

			if (nw != w || nh != h)
			{
				this.setSize(nw, nh);
			}
		}
	};
	
	var resizeListener = mxUtils.bind(this, function()
	{
		var x = dialog.window.getX();
		var y = dialog.window.getY();
		
		dialog.window.setLocation(x, y);
	});
	
	mxEvent.addListener(window, 'resize', resizeListener);

	dialog.destroy = function()
	{
		mxEvent.removeListener(window, 'resize', resizeListener);
		dialog.window.destroy();

		if (destroy != null)
		{
			destroy();
		}
	}
};

/**
 * Class: ChangeGridColor
 *
 * Undoable change to grid color.
 */
function ChangeGridColor(ui, color)
{
	this.ui = ui;
	this.color = color;
};

/**
 * Executes selection of a new page.
 */
ChangeGridColor.prototype.execute = function()
{
	var temp = this.ui.editor.graph.view.gridColor;
	this.ui.setGridColor(this.color);
	this.color = temp;
};

/**
 * Change types
 */
function ChangePageSetup(ui, color, image, format, pageScale)
{
	this.ui = ui;
	this.color = color;
	this.previousColor = color;
	this.image = image;
	this.previousImage = image;
	this.format = format;
	this.previousFormat = format;
	this.pageScale = pageScale;
	this.previousPageScale = pageScale;
	
	// Needed since null are valid values for color and image
	this.ignoreColor = false;
	this.ignoreImage = false;
}

/**
 * Implementation of the undoable page rename.
 */
ChangePageSetup.prototype.execute = function()
{
	var graph = this.ui.editor.graph;
	
	if (!this.ignoreColor)
	{
		this.color = this.previousColor;
		var tmp = graph.background;
		this.ui.setBackgroundColor(this.previousColor);
		this.previousColor = tmp;
	}
	
	if (!this.ignoreImage)
	{
		this.image = this.previousImage;
		var tmp = graph.backgroundImage;
		var img = this.previousImage;

		if (img != null && Graph.isPageLink(img.src))
		{
			img = this.ui.createImageForPageLink(img.src, this.ui.currentPage);
		}

		this.ui.setBackgroundImage(img);
		this.previousImage = tmp;
	}
	
	if (this.previousFormat != null)
	{
		this.format = this.previousFormat;
		var tmp = graph.pageFormat;
		
		if (this.previousFormat.width != tmp.width ||
			this.previousFormat.height != tmp.height)
		{
			this.ui.setPageFormat(this.previousFormat);
			this.previousFormat = tmp;
		}
	}

    if (this.foldingEnabled != null && this.foldingEnabled != this.ui.editor.graph.foldingEnabled)
    {
    	this.ui.setFoldingEnabled(this.foldingEnabled);
        this.foldingEnabled = !this.foldingEnabled;
    }

    if (this.previousPageScale != null)
    {
	    var currentPageScale = this.ui.editor.graph.pageScale;
	    
	    if (this.previousPageScale != currentPageScale)
	    {
	    	this.ui.setPageScale(this.previousPageScale);
	        this.previousPageScale = currentPageScale;
	    }
    }
};

/**
 * Loads the stylesheet for this graph.
 */
EditorUi.prototype.setBackgroundColor = function(value)
{
	this.editor.graph.background = value;
	this.editor.graph.view.validateBackground();

	this.fireEvent(new mxEventObject('backgroundColorChanged'));
};

/**
 * Loads the stylesheet for this graph.
 */
EditorUi.prototype.setFoldingEnabled = function(value)
{
	this.editor.graph.foldingEnabled = value;
	this.editor.graph.view.revalidate();
	
	this.fireEvent(new mxEventObject('foldingEnabledChanged'));
};

/**
 * Loads the stylesheet for this graph.
 */
EditorUi.prototype.setPageFormat = function(value, ignorePageVisible)
{
	ignorePageVisible = (ignorePageVisible != null) ? ignorePageVisible : urlParams['sketch'] == '1';
	this.editor.graph.pageFormat = value;
	
	if (!ignorePageVisible)
	{
		if (!this.editor.graph.pageVisible)
		{
			this.actions.get('pageView').funct();
		}
		else
		{
			this.editor.graph.view.validateBackground();
			this.editor.graph.sizeDidChange();
		}
	}

	this.fireEvent(new mxEventObject('pageFormatChanged'));
};

/**
 * Loads the stylesheet for this graph.
 */
EditorUi.prototype.setPageScale = function(value)
{
	this.editor.graph.pageScale = value;
	
	if (!this.editor.graph.pageVisible)
	{
		this.actions.get('pageView').funct();
	}
	else
	{
		this.editor.graph.view.validateBackground();
		this.editor.graph.sizeDidChange();
	}

	this.fireEvent(new mxEventObject('pageScaleChanged'));
};

/**
 * Loads the stylesheet for this graph.
 */
EditorUi.prototype.setGridColor = function(value, darkMode)
{
	darkMode = (darkMode != null) ? darkMode : Editor.isDarkMode();
	var graph = this.editor.graph;

	if (darkMode)
	{
		graph.view.defaultDarkGridColor = value;
	}
	else
	{
		graph.view.defaultGridColor = value;
	}

	graph.view.gridColor = 'light-dark(' +
		graph.view.defaultGridColor + ', ' +
		graph.view.defaultDarkGridColor + ')';
	graph.view.validateBackground();
	this.fireEvent(new mxEventObject('gridColorChanged'));
};

/**
 * Updates the states of the given undo/redo items.
 */
EditorUi.prototype.addUndoListener = function()
{
	var undoMgr = this.editor.undoManager;
	
    var undoListener = mxUtils.bind(this, function()
    {
		this.updateActionStates();
    });

    undoMgr.addListener(mxEvent.ADD, undoListener);
    undoMgr.addListener(mxEvent.UNDO, undoListener);
    undoMgr.addListener(mxEvent.REDO, undoListener);
    undoMgr.addListener(mxEvent.CLEAR, undoListener);
	
	// Overrides cell editor to update action states
	var cellEditorStartEditing = this.editor.graph.cellEditor.startEditing;
	
	this.editor.graph.cellEditor.startEditing = function()
	{
		cellEditorStartEditing.apply(this, arguments);
		undoListener();
	};
	
	var cellEditorStopEditing = this.editor.graph.cellEditor.stopEditing;
	
	this.editor.graph.cellEditor.stopEditing = function(cell, trigger)
	{
		cellEditorStopEditing.apply(this, arguments);
		undoListener();
	};
	
	// Updates the button states once
    undoListener();
};

/**
* Updates the states of the given toolbar items based on the selection.
*/
EditorUi.prototype.updateActionStates = function()
{
	var graph = this.editor.graph;
	var ss = this.getSelectionState();
    var unlocked = graph.isEnabled() && !graph.isCellLocked(graph.getDefaultParent());
	var editable = !this.editor.chromeless || this.editor.editable;

	// Updates action states
	var actions = ['cut', 'copy', 'bold', 'italic', 'underline', 'delete', 'duplicate',
	               'editStyle', 'editTooltip', 'editLink', 'backgroundColor', 'borderColor',
	               'edit', 'toFront', 'toBack', 'solid', 'dashed', 'pasteSize',
	               'dotted', 'fillColor', 'gradientColor', 'shadow', 'fontColor',
	               'formattedText', 'rounded', 'toggleRounded', 'strokeColor',
				   'sharp', 'snapToGrid'];
	
	for (var i = 0; i < actions.length; i++)
	{
		this.actions.get(actions[i]).setEnabled(ss.cells.length > 0);
	}

	this.actions.get('grid').setEnabled(editable);
	this.actions.get('undo').setEnabled(this.canUndo() && editable);
	this.actions.get('redo').setEnabled(this.canRedo() && editable);
	this.actions.get('swap').setEnabled(ss.cells.length == 2 && ss.vertices.length == 2);
	this.actions.get('pasteSize').setEnabled(this.copiedSize != null && ss.vertices.length > 0);
	this.actions.get('pasteData').setEnabled(this.copiedValue != null && ss.cells.length > 0);
	this.actions.get('setAsDefaultStyle').setEnabled(graph.getSelectionCount() == 1);
	this.actions.get('lockUnlock').setEnabled(!graph.isSelectionEmpty());
	this.actions.get('bringForward').setEnabled(ss.cells.length == 1);
	this.actions.get('sendBackward').setEnabled(ss.cells.length == 1);
	var alignDistributeActions = ['alignCellsLeft', 'alignCellsCenter', 'alignCellsRight',
		'alignCellsTop', 'alignCellsMiddle', 'alignCellsBottom',
		'distributeHorizontal', 'distributeVertical'];
	for (var ai = 0; ai < alignDistributeActions.length; ai++)
	{
		this.actions.get(alignDistributeActions[ai]).setEnabled(ss.unlocked && ss.vertices.length > 1);
	}
	this.actions.get('rotation').setEnabled(ss.vertices.length == 1);
	this.actions.get('wordWrap').setEnabled(ss.vertices.length == 1);
	this.actions.get('autosize').setEnabled(ss.vertices.length > 0);
	this.actions.get('copySize').setEnabled(ss.vertices.length == 1);
	this.actions.get('clearWaypoints').setEnabled(ss.connections);
	this.actions.get('clearAnchors').setEnabled(ss.connections);
	this.actions.get('curved').setEnabled(ss.edges.length > 0);
	this.actions.get('turn').setEnabled(ss.cells.length > 0);
	this.actions.get('group').setEnabled((ss.cells.length > 1 ||
		(ss.vertices.length == 1 && graph.model.getChildCount(ss.cells[0]) == 0 &&
		!graph.isContainer(ss.vertices[0]))));
	this.actions.get('ungroup').setEnabled(!ss.row && !ss.cell && !ss.table &&
		ss.vertices.length > 0 && (graph.isContainer(ss.vertices[0]) ||
		graph.getModel().getChildCount(ss.vertices[0]) > 0));
   	this.actions.get('removeFromGroup').setEnabled(ss.cells.length == 1 &&
   		graph.getModel().isVertex(graph.getModel().getParent(ss.cells[0])));
	this.actions.get('collapsible').setEnabled(ss.vertices.length == 1 &&
		(graph.model.getChildCount(ss.vertices[0]) > 0 ||
		graph.isContainer(ss.vertices[0])));
		this.actions.get('exitGroup').setEnabled(graph.view.currentRoot != null);
	this.actions.get('home').setEnabled(graph.view.currentRoot != null);
	this.actions.get('enterGroup').setEnabled(ss.cells.length == 1 &&
		graph.isValidRoot(ss.cells[0]));
	this.actions.get('copyData').setEnabled(ss.cells.length == 1);
	this.actions.get('copyAsText').setEnabled(ss.cells.length == 1);
	this.actions.get('editLink').setEnabled(ss.cells.length == 1);
	this.actions.get('editStyle').setEnabled(ss.cells.length > 0);
	this.actions.get('editTooltip').setEnabled(ss.cells.length == 1);
	this.actions.get('openLink').setEnabled(ss.cells.length == 1 &&
		graph.getLinkForCell(ss.cells[0]) != null);
	this.actions.get('guides').setEnabled(graph.isEnabled());
    this.actions.get('selectVertices').setEnabled(unlocked);
    this.actions.get('selectEdges').setEnabled(unlocked);
    this.actions.get('selectAll').setEnabled(unlocked);
    this.actions.get('selectNone').setEnabled(unlocked);
	
	var foldable = false;

	for (var i = 0; i < ss.vertices.length; i++)
	{
		if (graph.isCellFoldable(ss.vertices[i]))
		{
			foldable = true;
			break;
		}
	}

	this.actions.get('expand').setEnabled(foldable);
	this.actions.get('collapse').setEnabled(foldable);

	// Updates menu states
    this.menus.get('navigation').setEnabled(ss.cells.length > 0 ||
		graph.view.currentRoot != null);
    this.menus.get('layout').setEnabled(unlocked);
    this.menus.get('insert').setEnabled(unlocked);
    this.menus.get('direction').setEnabled(ss.unlocked &&
		ss.vertices.length == 1);
    this.menus.get('distribute').setEnabled(ss.unlocked &&
		ss.vertices.length > 1);
    this.menus.get('align').setEnabled(ss.unlocked &&
		ss.cells.length > 0);

    this.updatePasteActionStates();
};

EditorUi.prototype.zeroOffset = new mxPoint(0, 0);

/**
 * 
 */
EditorUi.prototype.getDiagramContainerOffset = function()
{
	return this.zeroOffset;
};

/**
 * Refreshes the viewport.
 */
EditorUi.prototype.refresh = function(sizeDidChange)
{
	var sw = this.sidebarContainer.style.width;
	var fw = this.formatContainer.style.width;

	this.sidebarContainer.style.width = this.hsplitPosition + 'px';
	this.formatContainer.style.width = (this.format != null &&
		this.formatWidth > 0) ? '' : '0';
	
	if (sizeDidChange ||
		sw != this.sidebarContainer.style.width ||
		fw != this.formatContainer.style.width)
	{
		this.editor.graph.sizeDidChange();
	}
};

/**
 * Creates the required containers.
 */
EditorUi.prototype.createTabContainer = function()
{
	return null;
};

/**
 * Creates the required containers.
 */
EditorUi.prototype.createDivs = function()
{
	this.menubarContainer = this.createDiv('geMenubarContainer');
	this.toolbarContainer = this.createDiv('geToolbarContainer');
	this.sidebarContainer = this.createDiv('geSidebarContainer');
	this.formatContainer = this.createDiv('geSidebarContainer geFormatContainer');
	this.diagramContainer = this.createDiv('geDiagramContainer');
	this.hsplit = this.createDiv('geHsplit');

	if (!this.editor.chromeless)
	{
		this.tabContainer = this.createTabContainer();
	}
};

/**
 * Hook for sidebar footer container. This implementation returns null.
 */
EditorUi.prototype.createSidebarContainer = function()
{
	var div = document.createElement('div');
	div.className = 'geSidebarContainer';

	return div;
};

/**
 * Creates the required containers.
 */
EditorUi.prototype.createUi = function()
{
	// Creates menubar
	this.statusContainer = this.createStatusContainer();
	this.menubar = (this.editor.chromeless) ? null : this.menus.createMenubar(this.createDiv('geMenubar'));
	
	if (this.menubar != null)
	{
		this.menubarContainer.appendChild(this.menubar.container);
	}
	
	// Adds status bar in menubar
	if (this.menubar != null)
	{
		// Connects the status bar to the editor status
		this.editor.addListener('statusChanged', mxUtils.bind(this, function()
		{
			this.setStatusText(this.editor.getStatus());
		}));
	
		this.setStatusText(this.editor.getStatus());
		this.menubar.container.appendChild(this.statusContainer);
		
		// Inserts into DOM
		this.container.appendChild(this.menubarContainer);
	}

	// Creates the sidebar
	this.sidebar = (this.editor.chromeless) ? null : this.createSidebar(this.sidebarContainer);
	
	if (this.sidebar != null)
	{
		this.container.appendChild(this.sidebarContainer);
	}
	
	// Creates the format sidebar
	this.format = (this.editor.chromeless) ?
		null : this.createFormat(this.formatContainer);

	if (this.format != null)
	{
		this.container.appendChild(this.formatContainer);
	}
	
	this.container.appendChild(this.diagramContainer);

	if (this.container != null && this.tabContainer != null)
	{
		this.container.appendChild(this.tabContainer);
	}

	// Creates toolbar
	this.toolbar = (this.editor.chromeless) ? null : this.createToolbar(this.createDiv('geToolbar'));
	
	if (this.toolbar != null)
	{
		this.toolbarContainer.appendChild(this.toolbar.container);
		this.container.appendChild(this.toolbarContainer);
	}

	// HSplit
	if (this.sidebar != null)
	{
		this.container.appendChild(this.hsplit);
		
		this.addSplitHandler(this.hsplit, true, 0, mxUtils.bind(this, function(value)
		{
			this.hsplitPosition = value;
			this.refresh();
			this.fireEvent(new mxEventObject('sidebarWidthChanged'));
		}));
	}
};

/**
 * Creates a new toolbar for the given container.
 */
EditorUi.prototype.createStatusContainer = function()
{
	var container = document.createElement('a');
	container.className = 'geStatus';

	// Handles data-action attribute
	mxEvent.addListener(container, 'click', mxUtils.bind(this, function(evt)
	{
		var elt = mxEvent.getSource(evt);

		if (elt != container)
		{
			while (elt.parentNode != container)
			{
				elt = elt.parentNode;
			}
		}
		
		if (elt.nodeName != 'A')
		{
			var name = elt.getAttribute('data-action');

			// Make generic
			if (name == 'statusFunction' && this.editor.statusFunction != null)
			{
				this.editor.statusFunction();
			}
			else if (name != null)
			{
				var action = this.actions.get(name);

				if (action != null)
				{
					action.funct();
				}
			}
			else
			{
				var title = elt.getAttribute('data-title');
				var msg = elt.getAttribute('data-message');

				if (title != null && msg != null)
				{
					this.showError(title, msg);
				}
				else
				{
					var link = elt.getAttribute('data-link');

					if (link != null)
					{
						this.editor.graph.openLink(link);
					}
				}
			}

			mxEvent.consume(evt);
		}
	}));

	return container;
};

/**
 * Creates a new toolbar for the given container.
 */
EditorUi.prototype.setStatusText = function(value)
{
	this.statusContainer.innerHTML = Graph.sanitizeHtml(value);

	// Wraps simple status messages in a div for styling
	if (this.statusContainer.getElementsByTagName('div').length == 0 &&
		value != null && value.length > 0)
	{
		this.statusContainer.innerText = '';
		var div = this.createStatusDiv(value);
		this.statusContainer.appendChild(div);
	}

	// Handles data-effect attribute
	var spans = this.statusContainer.querySelectorAll('[data-effect="fade"]');

	if (spans != null)
	{
		for (var i = 0; i < spans.length; i++)
		{
			(function(temp)
			{
				mxUtils.setOpacity(temp, 0);
				mxUtils.setPrefixedStyle(temp.style, 'transform', 'scaleX(0)');
				mxUtils.setPrefixedStyle(temp.style, 'transition', 'all 0.2s ease');
				
				window.setTimeout(mxUtils.bind(this, function()
				{
					mxUtils.setOpacity(temp, 100);
					mxUtils.setPrefixedStyle(temp.style, 'transform', 'scaleX(1)');
					mxUtils.setPrefixedStyle(temp.style, 'transition', 'all 1s ease');
					
					window.setTimeout(mxUtils.bind(this, function()
					{
						mxUtils.setPrefixedStyle(temp.style, 'transform', 'scaleX(0)');
						mxUtils.setOpacity(temp, 0);
		
						window.setTimeout(mxUtils.bind(this, function()
						{
							if (temp.parentNode != null)
							{
								temp.parentNode.removeChild(temp);
							}
						}), 1000);
					}), Editor.updateStatusInterval / 2);
				}), 0);
			})(spans[i]);
		}
	}		
};

/**
 * Sets the current status to an empty string.
 */
EditorUi.prototype.clearStatus = function()
{
	this.updateStatus(mxUtils.bind(this, function()
	{
		this.editor.setStatus('');
	}));
};

/**
 * Executes the given function to update the status and stores
 * the function as the last update status function.
 */
EditorUi.prototype.updateStatus = function(fn)
{
	if (fn != null)
	{
		fn();
	}
	
	this.lastStatusUpdate = fn;
};

/**
 * Executes the last update status function.
 */
EditorUi.prototype.updateStatusAgain = function()
{
	if (this.lastStatusUpdate != null)
	{
		this.lastStatusUpdate();
	}
};

/**
 * Creates a new toolbar for the given container.
 */
EditorUi.prototype.createStatusDiv = function(value)
{
	var div = document.createElement('div');
	div.className = 'geStatusDiv';
	div.setAttribute('title', value);
	div.innerText = value;
	
	return div;
};

/**
 * Creates a new toolbar for the given container.
 */
EditorUi.prototype.createToolbar = function(container)
{
	return new Toolbar(this, container);
};

/**
 * Creates a new sidebar for the given container.
 */
EditorUi.prototype.createSidebar = function(container)
{
	return new Sidebar(this, container);
};

/**
 * Creates a new sidebar for the given container.
 */
EditorUi.prototype.createFormat = function(container)
{
	return new Format(this, container);
};

/**
 * Returns the persisted collapsed sections state for the format panel.
 */
EditorUi.prototype.getCollapsedSections = function()
{
	return {};
};

/**
 * Creates the actual toolbar for the toolbar container.
 */
EditorUi.prototype.createDiv = function(classname)
{
	var elt = document.createElement('div');
	elt.className = classname;
	
	return elt;
};

/**
 * Updates the states of the given undo/redo items.
 */
EditorUi.prototype.addSplitHandler = function(elt, horizontal, dx, onChange)
{
	var start = null;
	var initial = null;
	var ignoreClick = true;
	var last = null;

	// Disables built-in pan and zoom in IE10 and later
	if (mxClient.IS_POINTER)
	{
		elt.style.touchAction = 'none';
	}
	
	var getValue = mxUtils.bind(this, function()
	{
		var result = parseInt(((horizontal) ?
			elt.offsetLeft : elt.offsetTop));
		
		// Takes into account hidden footer
		if (!horizontal)
		{
			result = result + dx;
		}
		
		return result;
	});

	function moveHandler(evt)
	{
		if (start != null)
		{
			var pt = new mxPoint(mxEvent.getClientX(evt), mxEvent.getClientY(evt));
			onChange(Math.max(0, initial + ((horizontal) ? (pt.x - start.x) : (start.y - pt.y)) - dx));
			mxEvent.consume(evt);
			
			if (initial != getValue())
			{
				ignoreClick = true;
				last = null;
			}
		}
	};
	
	function dropHandler(evt)
	{
		moveHandler(evt);
		initial = null;
		start = null;
	};
	
	mxEvent.addGestureListeners(elt, function(evt)
	{
		start = new mxPoint(mxEvent.getClientX(evt), mxEvent.getClientY(evt));
		initial = getValue();
		ignoreClick = false;
		mxEvent.consume(evt);
	});
	
	mxEvent.addListener(elt, 'click', mxUtils.bind(this, function(evt)
	{
		if (!ignoreClick && this.hsplitClickEnabled)
		{
			var next = (last != null) ? last - dx : 0;
			last = getValue();
			onChange(next);
			mxEvent.consume(evt);
		}
	}));

	mxEvent.addGestureListeners(document, null, moveHandler, dropHandler);
	
	this.destroyFunctions.push(function()
	{
		mxEvent.removeGestureListeners(document, null, moveHandler, dropHandler);
	});	
};

/**
 * Translates this point by the given vector.
 * 
 * @param {number} dx X-coordinate of the translation.
 * @param {number} dy Y-coordinate of the translation.
 */
EditorUi.prototype.prompt = function(title, defaultValue, fn, asText)
{
	var dlg = new FilenameDialog(this, defaultValue,
		mxResources.get('apply'), function(newValue)
	{
		fn((asText) ? newValue : parseFloat(newValue));
	}, title);

	this.showDialog(dlg.container, 300, 80, true, true);
	dlg.init();
};

/**
 * Translates this point by the given vector.
 * 
 * @param {number} dx X-coordinate of the translation.
 * @param {number} dy Y-coordinate of the translation.
 */
EditorUi.prototype.handleError = function(resp, title, fn, invokeFnOnClose, notFoundMessage)
{
	var e = (resp != null && resp.error != null) ? resp.error : resp;

	if (e != null || title != null)
	{
		var msg = mxUtils.htmlEntities(mxResources.get('unknownError'));
		var btn = mxResources.get('ok');
		title = (title != null) ? title : mxResources.get('error');
		
		if (e != null && e.message != null)
		{
			msg = mxUtils.htmlEntities(e.message);
		}

		this.showError(title, msg, btn, fn, null, null, null, null, null,
			null, null, null, (invokeFnOnClose) ? fn : null);
	}
	else if (fn != null)
	{
		fn();
	}
};

/**
 * Translates this point by the given vector.
 * 
 * @param {number} dx X-coordinate of the translation.
 * @param {number} dy Y-coordinate of the translation.
 */
EditorUi.prototype.showError = function(title, msg, btn, fn, retry, btn2, fn2, btn3, fn3, w, h, hide, onClose)
{
	var dlg = new ErrorDialog(this, title, msg, btn || mxResources.get('ok'),
		fn, retry, btn2, fn2, hide, btn3, fn3);
	// Auto-height (null) so the dialog fits the wrapped message; the content's
	// max-height/overflow still caps very long messages at the viewport.
	this.showDialog(dlg.container, w || 340, h, true, false, onClose);

	// Auto-height fits the content exactly, which leaves the message area's
	// overflow:auto a sub-pixel short and shows a spurious scrollbar. Nudge the
	// dialog slightly taller so the flex message area has breathing room (no-op
	// when the caller passed an explicit height).
	if (h == null && this.dialog != null && this.dialog.container != null)
	{
		this.dialog.container.style.height = (this.dialog.container.offsetHeight + 16) + 'px';
	}

	dlg.init();
};

/**
 * Displays a print dialog.
 */
EditorUi.prototype.showDialog = function(elt, w, h, modal, closable, onClose, noScroll, transparent, minSize, ignoreBgClick, persistenceKey)
{
	this.editor.graph.tooltipHandler.resetTimer();
	this.editor.graph.tooltipHandler.hideTooltip();

	if (this.dialogs == null)
	{
		this.dialogs = [];
	}

	this.dialog = new Dialog(this, elt, w, h, modal, closable, onClose, noScroll, transparent, minSize, ignoreBgClick);
	this.dialogs.push(this.dialog);

	// Persistent size support for resizable dialogs
	if (persistenceKey != null && minSize != null && typeof mxSettings !== 'undefined' &&
		mxSettings.getWindowState != null)
	{
		var state = mxSettings.getWindowState(persistenceKey);

		if (state != null && state.w != null && state.h != null)
		{
			this.dialog.container.style.width = Math.max(minSize.width, state.w) + 'px';
			this.dialog.container.style.height = Math.max(minSize.height, state.h) + 'px';
		}

		this.dialog.onResize = function(newW, newH)
		{
			mxSettings.setWindowState(persistenceKey, {w: newW, h: newH});
			mxSettings.save();
		};
	}
};

/**
 * Displays a print dialog.
 */
EditorUi.prototype.hideDialog = function(cancel, isEsc, matchContainer)
{
	// Finds topmost non-closing dialog
	// This closes dialogs underneath the closing dialog when hideDialog
	// is called in the process of closing the current dialog
	var dlg = null;

	if (this.dialogs != null && this.dialogs.length > 0)
	{
		for (var i = this.dialogs.length - 1; i >= 0; i--)
		{
			if (!this.dialogs[i].closing)
			{
				dlg = this.dialogs[i];
				break;
			}
		}
	}
	
	if (dlg != null)
	{
		if (matchContainer != null && matchContainer != this.dialog.container.firstChild)
		{
			return;
		}
		
		dlg.closing = true;
		
		if (dlg.close(cancel, isEsc) == false) 
		{
			delete dlg.closing;

			return;
		}

		// Removes dialog from stack
		delete dlg.closing;

		var index = mxUtils.lastIndexOf(this.dialogs, dlg);

		if (index >= 0)
		{
			this.dialogs.splice(index, 1);
		}
		
		this.dialog = (this.dialogs.length > 0) ? this.dialogs[this.dialogs.length - 1] : null;

		// Restores existing dialogs and adds new dialogs
		this.editor.fireEvent(new mxEventObject('hideDialog', 'dialog', dlg));
		
		if (this.dialog == null && this.editor.graph.container != null &&
			this.editor.graph.container.style.visibility != 'hidden')
		{
			window.setTimeout(mxUtils.bind(this, function()
			{
				if (this.editor != null && (this.dialogs == null || this.dialogs.length == 0))
				{
					if (this.editor.graph.isEditing() && this.editor.graph.cellEditor.textarea != null)
					{
						this.editor.graph.cellEditor.textarea.focus();
					}
					else
					{
						mxUtils.clearSelection();
						this.editor.graph.container.focus();
					}
				}
			}), 0);
		}
	}
};

/**
 * Handles ctrl+enter keystroke to clone cells.
 */
EditorUi.prototype.ctrlEnter = function()
{
	var graph = this.editor.graph;

	if (graph.isEnabled())
	{
		try
		{
			var cells = graph.getSelectionCells();
		    var lookup = new mxDictionary();
		    var newCells = [];

		    for (var i = 0; i < cells.length; i++)
		    {
		    	// Clones table rows instead of cells
		    	var cell = (graph.isTableCell(cells[i])) ? graph.model.getParent(cells[i]) : cells[i];
		    	
		    	if (cell != null && !lookup.get(cell))
		    	{
		    		lookup.put(cell, true);
		            newCells.push(cell);
		        }
		    }
		    
			graph.setSelectionCells(graph.duplicateCells(newCells, false));
		}
		catch (e)
		{
			this.handleError(e);
		}
	}
};

/**
 * Display a color dialog.
 */
EditorUi.prototype.pickColor = function(color, apply, defaultColor, defaultColorValue, singleColorMode, title, getColorFn, allowInherit)
{
	// The color tool window is a non-modal mxWindow that renders below the
	// modal dialog backdrop, so it cannot be reached while a modal dialog is
	// open. In that case fall back to the modal color dialog (Apply/Cancel)
	// which stacks on top of the existing modal dialog.
	if (this.dialog != null && this.dialog.bg != null &&
		this.dialog.bg.parentNode != null)
	{
		this.pickColorModal(color, apply, defaultColor, defaultColorValue,
			singleColorMode, title, null, allowInherit);

		return;
	}

	var graph = this.editor.graph;
	var selState = graph.cellEditor.saveSelection();

	var self = this;

	var wrappedApply = function(color)
	{
		graph.cellEditor.restoreSelection(selState);

		if (self.colorWindow != null)
		{
			self.colorWindow.applying = true;
		}

		apply(color);

		if (self.colorWindow != null)
		{
			self.colorWindow.applying = false;
		}
	};

	if (this.colorWindow == null)
	{
		var saved = (this.installWindowPersistence != null) ?
			mxSettings.getWindowState('colorPicker') : null;
		var cx = (saved != null && saved.x != null) ? saved.x :
			document.body.offsetWidth - 280;
		var cy = (saved != null && saved.y != null) ? saved.y : 100;
		var cw = (saved != null && saved.w != null) ? saved.w : 260;

		this.colorWindow = new ColorWindow(this, cx, cy, cw);

		if (this.installWindowPersistence != null)
		{
			this.installWindowPersistence('colorPicker', this.colorWindow);

			if (saved != null)
			{
				this.restoreWindowState('colorPicker', this.colorWindow);
			}
		}
	}

	this.colorWindow.update(color, wrappedApply,
		title || mxResources.get('fillColor'),
		defaultColor, defaultColorValue, singleColorMode,
		getColorFn, allowInherit);
};

/**
 * Displays a modal color dialog with Apply and Cancel buttons. Use this
 * variant when picking a color from within another modal dialog, where the
 * non-modal color tool window (see pickColor) would be hidden behind the
 * modal backdrop. The dialog stacks on top of the existing modal dialog and
 * closes on Apply or Cancel. pickColor delegates here automatically when a
 * modal dialog is already showing. The optional cancelFn runs on Cancel/Esc.
 */
EditorUi.prototype.pickColorModal = function(color, apply, defaultColor, defaultColorValue, singleColorMode, title, cancelFn, allowInherit)
{
	var graph = this.editor.graph;
	var selState = graph.cellEditor.saveSelection();

	var dlg = new ColorDialog(this, color, function(color)
	{
		graph.cellEditor.restoreSelection(selState);

		if (apply != null)
		{
			apply(color);
		}
	}, function()
	{
		graph.cellEditor.restoreSelection(selState);

		if (cancelFn != null)
		{
			cancelFn();
		}
	}, defaultColor, defaultColorValue, singleColorMode, null, allowInherit);

	// Shows the property name as a heading (the tool window puts it in its
	// title bar; the modal dialog has no title bar, so prepend it instead)
	if (title != null)
	{
		var hd = document.createElement('div');
		hd.style.cssText = 'width:100%;text-align:center;font-weight:bold;' +
			'margin-bottom:10px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis';
		mxUtils.write(hd, title);
		dlg.container.insertBefore(hd, dlg.container.firstChild);
	}

	// Height is null so the dialog auto-fits its content (collapsed advanced
	// section). The picker's slider box overflows its 230px div to ~237px
	// (overflow: visible), so the content box needs to be a bit wider than
	// 230 to avoid clipping it on the right (the tool window leaves the same
	// slack). Height auto-fits to the content.
	this.showDialog(dlg.container, 250, null, true, false);

	// Re-fits the modal dialog to its content when the advanced/dark section
	// is toggled, mirroring the tool window's fitHeight behavior. The 48px
	// accounts for the .geDialog padding (same as showDialog's auto-size).
	var dialogContainer = this.dialog.container;

	dlg.resizeFn = function()
	{
		dialogContainer.style.height = (dlg.container.scrollHeight + 48) + 'px';
	};

	dlg.init();
};

/**
 * Adds the label menu items to the given menu and parent.
 */
EditorUi.prototype.openFile = function()
{
	// Closes dialog after open
	window.openFile = new OpenFile(mxUtils.bind(this, function(cancel)
	{
		this.hideDialog(cancel);
	}));

	// Removes openFile if dialog is closed
	this.showDialog(new OpenDialog(this).container, (Editor.useLocalStorage) ? 640 : 320,
			(Editor.useLocalStorage) ? 480 : 220, true, true, function()
	{
		window.openFile = null;
	});
};

/**
 * Translates this point by the given vector.
 * 
 * @param {number} dx X-coordinate of the translation.
 * @param {number} dy Y-coordinate of the translation.
 */
EditorUi.prototype.base64ToBlob = function(base64Data, contentType)
{
	contentType = contentType || '';
	var sliceSize = 1024;
	var byteCharacters = atob(base64Data);
	var bytesLength = byteCharacters.length;
	var slicesCount = Math.ceil(bytesLength / sliceSize);
	var byteArrays = new Array(slicesCount);

	for (var sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex)
	{
		var begin = sliceIndex * sliceSize;
		var end = Math.min(begin + sliceSize, bytesLength);

		var bytes = new Array(end - begin);
		
		for (var offset = begin, i = 0 ; offset < end; ++i, ++offset)
		{
			bytes[i] = byteCharacters[offset].charCodeAt(0);
		}
		
		byteArrays[sliceIndex] = new Uint8Array(bytes);
	}

	return new Blob(byteArrays, {type: contentType});
};

/**
 * Extracs the graph model from the given HTML data from a data transfer event.
 */
EditorUi.prototype.extractGraphModelFromHtml = function(data)
{
	var result = null;
	
	try
	{
    	var idx = data.indexOf('&lt;mxGraphModel ');
    	
    	if (idx >= 0)
    	{
    		var idx2 = data.lastIndexOf('&lt;/mxGraphModel&gt;');
    		
    		if (idx2 > idx)
    		{
    			result = data.substring(idx, idx2 + 21).replace(/&gt;/g, '>').
    				replace(/&lt;/g, '<').replace(/\\&quot;/g, '"').replace(/\n/g, '');
    		}
    	}
	}
	catch (e)
	{
		// ignore
	}
	
	return result;
};

/**
 * Opens the given files in the editor.
 */
EditorUi.prototype.extractGraphModelFromEvent = function(evt)
{
	var result = null;
	var data = null;
	
	if (evt != null)
	{
		var provider = (evt.dataTransfer != null) ?
			evt.dataTransfer : evt.clipboardData;
		
		if (provider != null)
		{
			data = (mxUtils.indexOf(provider.types, 'text/html') >= 0) ?
				provider.getData('text/html') : null;
		
			if (mxUtils.indexOf(provider.types, 'text/plain') >= 0 &&
				(data == null || data.length == 0))
			{
				data = provider.getData('text/plain');
			}
			
			if (data != null)
			{
				data = Graph.zapGremlins(mxUtils.trim(data));
				
				// Tries parsing as HTML document with embedded XML
				var xml =  this.extractGraphModelFromHtml(data);
				
				if (xml != null)
				{
					data = xml;
				}
			}		
		}
	}
	
	if (data != null && this.isCompatibleString(data))
	{
		result = data;
	}
	
	return result;
};

/**
 * Hook for subclassers to return true if event data is a supported format.
 * This implementation always returns false.
 */
EditorUi.prototype.isCompatibleString = function(data)
{
	return false;
};

/**
 * Adds the label menu items to the given menu and parent.
 */
EditorUi.prototype.saveFile = function(forceDialog)
{
	if (!forceDialog && this.editor.filename != null)
	{
		this.save(this.editor.getOrCreateFilename());
	}
	else
	{
		var dlg = new FilenameDialog(this, this.editor.getOrCreateFilename(),
			mxResources.get('save'), mxUtils.bind(this, function(name)
		{
			this.save(name);
		}), null, mxUtils.bind(this, function(name)
		{
			if (name != null && name.length > 0)
			{
				return true;
			}
			
			mxUtils.confirm(mxResources.get('invalidName'));
			
			return false;
		}));
		this.showDialog(dlg.container, 340, 96, true, true);
		dlg.init();
	}
};

/**
 * Saves the current graph under the given filename.
 */
EditorUi.prototype.save = function(name)
{
	if (name != null)
	{
		if (this.editor.graph.isEditing())
		{
			this.editor.graph.stopEditing();
		}
		
		var xml = mxUtils.getXml(this.editor.getGraphXml());
		
		try
		{
			if (Editor.useLocalStorage)
			{
				if (localStorage.getItem(name) != null &&
					!mxUtils.confirm(mxResources.get('replaceIt', [name])))
				{
					return;
				}

				localStorage.setItem(name, xml);

				this.updateStatus(mxUtils.bind(this, function()
				{
					this.editor.setStatus(mxUtils.htmlEntities(
						mxResources.get('saved')) + ' ' + new Date());
				}));
			}
			else
			{
				if (xml.length < MAX_REQUEST_SIZE)
				{
					new mxXmlRequest(SAVE_URL, 'filename=' + encodeURIComponent(name) +
						'&xml=' + encodeURIComponent(xml)).simulate(document, '_blank');
				}
				else
				{
					mxUtils.alert(mxResources.get('drawingTooLarge'));
					mxUtils.popup(xml);
					
					return;
				}
			}

			this.editor.setModified(false);
			this.editor.setFilename(name);
			this.updateDocumentTitle();
		}
		catch (e)
		{
			this.updateStatus(mxUtils.bind(this, function()
			{
				this.editor.setStatus(mxUtils.htmlEntities(
					mxResources.get('errorSavingFile')));
			}));
		}
	}
};

/**
 * Executes the given array of graph layouts using executeLayout and
 * calls done after the last layout has finished.
 *
 * If any layout in the chain has a `prepare(parent, cb)` method (the ELK
 * bridge signature), runs them sequentially via that async API instead of
 * the synchronous mxCompositeLayout — each layout's apply() runs inside its
 * own executeLayout call so morph animation triggers between steps. Pure-mx
 * chains keep the original composite path so behaviour stays byte-identical.
 */
EditorUi.prototype.executeLayouts = function(layouts, post)
{
	var hasAsync = false;

	for (var i = 0; i < layouts.length; i++)
	{
		if (typeof layouts[i].prepare === 'function')
		{
			hasAsync = true;
			break;
		}
	}

	if (!hasAsync)
	{
		this.executeLayout(mxUtils.bind(this, function()
		{
			var layout = new mxCompositeLayout(this.editor.graph, layouts);
			var cells = this.editor.graph.getSelectionCells();

			layout.execute(this.editor.graph.getDefaultParent(),
				cells.length == 0 ? null : cells);
		}), true, post);
	}
	else
	{
		var self = this;
		var graph = this.editor.graph;
		var parent = graph.getDefaultParent();
		var idx = 0;

		var next = function()
		{
			if (idx >= layouts.length)
			{
				if (post != null) post();
				return;
			}

			var layout = layouts[idx++];

			if (typeof layout.prepare === 'function')
			{
				layout.prepare(parent, function(err, apply)
				{
					if (err != null)
					{
						self.handleError(err);
						return;
					}

					self.executeLayout(apply, true, next);
				});
			}
			else
			{
				self.executeLayout(function()
				{
					layout.execute(parent);
				}, true, next);
			}
		};

		next();
	}
};

/**
 * Executes the given layout.
 */
EditorUi.prototype.executeLayout = function(exec, animate, post)
{
	var graph = this.editor.graph;
	graph.getModel().beginUpdate();
	try
	{
		exec();
	}
	catch (e)
	{
		throw e;
	}
	finally
	{
		// Animates the changes in the graph model
		if (this.allowAnimation && animate && graph.isEnabled())
		{
			// New API for animating graph layout results asynchronously
			var morph = new mxMorphing(graph);
			morph.addListener(mxEvent.DONE, mxUtils.bind(this, function()
			{
				graph.getModel().endUpdate();
				
				if (post != null)
				{
					post();
				}
			}));
			
			morph.startAnimation();
		}
		else
		{
			graph.getModel().endUpdate();
			
			if (post != null)
			{
				post();
			}
		}
	}
};

/**
 * Hides the current menu.
 */
EditorUi.prototype.showImageDialog = function(title, value, fn, ignoreExisting)
{
	var cellEditor = this.editor.graph.cellEditor;
	var selState = cellEditor.saveSelection();
	var newValue = mxUtils.prompt(title, value);
	cellEditor.restoreSelection(selState);
	
	if (newValue != null && newValue.length > 0)
	{
		var img = new Image();
		
		img.onload = function()
		{
			fn(newValue, img.width, img.height);
		};
		img.onerror = function()
		{
			fn(null);
			mxUtils.alert(mxResources.get('fileNotFound'));
		};
		
		img.src = newValue;
	}
	else
	{
		fn(null);
	}
};

/**
 * Hides the current menu.
 */
EditorUi.prototype.showLinkDialog = function(value, btnLabel, fn)
{
	var dlg = new LinkDialog(this, value, btnLabel, fn);
	this.showDialog(dlg.container, 420, null, true, true);
	dlg.init();
};

/**
 * Hides the current menu.
 */
EditorUi.prototype.showDataDialog = function(cell)
{
	if (cell != null && typeof window.EditDataDialog !== 'undefined')
	{
		var dlg = new EditDataDialog(this, cell);
		this.showDialog(dlg.container, 480, 420, true, false, null,
			false, null, new mxRectangle(0, 0, 440, 340), null, 'editData');
		dlg.init();
	}
};

/**
 * Hides the current menu.
 */
EditorUi.prototype.showBackgroundImageDialog = function(apply, img)
{
	apply = (apply != null) ? apply : mxUtils.bind(this, function(image)
	{
		var change = new ChangePageSetup(this, null, image);
		change.ignoreColor = true;
		
		this.editor.graph.model.execute(change);
	});
	
	var newValue = mxUtils.prompt(mxResources.get('backgroundImage'), (img != null) ? img.src : '');
	
	if (newValue != null && newValue.length > 0)
	{
		var img = new Image();
		
		img.onload = function()
		{
			apply(new mxImage(newValue, img.width, img.height), false);
		};
		img.onerror = function()
		{
			apply(null, true);
			mxUtils.alert(mxResources.get('fileNotFound'));
		};
		
		img.src = newValue;
	}
	else
	{
		apply(null);
	}
};

/**
 * Loads the stylesheet for this graph.
 */
EditorUi.prototype.setBackgroundImage = function(image)
{
	this.editor.graph.setBackgroundImage(image);
	this.editor.graph.view.validateBackgroundImage();

	this.fireEvent(new mxEventObject('backgroundImageChanged'));
};

/**
 * Creates the keyboard event handler for the current graph and history.
 */
EditorUi.prototype.confirm = function(msg, okFn, cancelFn)
{
	if (mxUtils.confirm(msg))
	{
		if (okFn != null)
		{
			okFn();
		}
	}
	else if (cancelFn != null)
	{
		cancelFn();
	}
};

/**
 * Creates the keyboard event handler for the current graph and history.
 */
EditorUi.prototype.createOutline = function(wnd)
{
	var outline = new mxOutline(this.editor.graph);

	mxEvent.addListener(window, 'resize', function()
	{
		outline.update(false);
	});
	
	return outline;
};

// Alt+Shift+Keycode mapping to action
EditorUi.prototype.altShiftActions = {
  65: 'connectionArrows', // Alt+Shift+A
  82: 'clearWaypoints', // Alt+Shift+R
  76: 'editLink', // Alt+Shift+L
  79: 'connectionPoints', // Alt+Shift+O
  81: 'editConnectionPoints', // Alt+Shift+Q
  84: 'editTooltip', // Alt+Shift+T
  86: 'pasteSize', // Alt+Shift+V
  70: 'copySize', // Alt+Shift+F
  66: 'copyData', // Alt+Shift+B
  69: 'pasteData' // Alt+Shift+E
};

// Ctrl+Alt+Shift+Keycode mapping to action
EditorUi.prototype.ctrlAltShiftActions = {
	70: 'bringForward', // Ctrl+Alt+Shift+F
	66: 'sendBackward', // Ctrl+Alt+Shift+B
	88: 'copyAsSvg' // Ctrl+Alt+Shift+X
};

// Ctrl+Alt+Keycode mapping to action
EditorUi.prototype.ctrlAltActions = {
	88: 'copyAsImage' // Ctrl+Alt+X
};

/**
 * Creates the keyboard event handler for the current graph and history.
 */
EditorUi.prototype.createKeyHandler = function(editor)
{
	var editorUi = this;
	var graph = this.editor.graph;
	var keyHandler = new mxKeyHandler(graph);

	var isEventIgnored = keyHandler.isEventIgnored;
	keyHandler.isEventIgnored = function(evt)
	{
		// Ignores Ctrl+, (188) when not content editing to allow
		// browser default (eg. Cmd+, for Chrome settings on macOS)
		if (evt.keyCode == 188 && this.isControlDown(evt) &&
			!this.graph.cellEditor.isContentEditing())
		{
			return true;
		}

		// Handles undo/redo/ctrl+./,/u via action and allows ctrl+b/i
		// only if editing value is HTML (except for FF and Safari)
		// 66, 73 are keycodes for editing actions like bold, italic,
		// handles Ctrl+S (83) also while editing labels
		return !(mxEvent.isShiftDown(evt) && evt.keyCode == 9) &&
			((!this.isControlDown(evt) || mxEvent.isShiftDown(evt) ||
			(evt.keyCode != 90 && evt.keyCode != 89 && evt.keyCode != 188 &&
			evt.keyCode != 190 && evt.keyCode != 85 && evt.keyCode != 83)) &&
			((evt.keyCode != 66 && evt.keyCode != 73) ||
			!this.isControlDown(evt) || (this.graph.cellEditor.isContentEditing() &&
			!mxClient.IS_FF && !mxClient.IS_SF)) &&
			((evt.keyCode != 109 && evt.keyCode != 107) ||
			(!this.isControlDown(evt) && !mxEvent.isShiftDown(evt)) ||
			(!this.graph.cellEditor.isContentEditing() &&
			!mxClient.IS_FF && !mxClient.IS_SF)) &&
			isEventIgnored.apply(this, arguments));
	};
	
	// Ignores graph enabled state but not chromeless state
	keyHandler.isEnabledForEvent = function(evt)
	{
		return (!mxEvent.isConsumed(evt) && this.isGraphEvent(evt) && this.isEnabled() &&
			(editorUi.dialogs == null || editorUi.dialogs.length == 0));
	};
	
	// Routes command-key to control-key on Mac
	keyHandler.isControlDown = function(evt)
	{
		return mxEvent.isControlDown(evt) || (mxClient.IS_MAC && evt.metaKey);
	};

	var thread = null;
	
	// Helper function to move cells with the cursor keys
	function nudge(keyCode, stepSize, resize)
	{
		if (!graph.isSelectionEmpty() && graph.isEnabled())
		{
			// Default nudge respects the document unit (1px for points)
			stepSize = (stepSize != null) ? stepSize : Editor.getCursorMoveStep(graph.view.unit);

			var cells = graph.getCompositeParents(graph.getSelectionCells());
			var cell = (cells.length > 0) ? cells[0] : null;

			if (cell != null)
			{
				if (resize)
				{
					// Resizes all selected vertices
					graph.getModel().beginUpdate();
					try
					{
						for (var i = 0; i < cells.length; i++)
						{
							if (graph.getModel().isVertex(cells[i]) && graph.isCellResizable(cells[i]))
							{
								var geo = graph.getCellGeometry(cells[i]);
								
								if (geo != null)
								{
									geo = geo.clone();
									
									if (keyCode == 37)
									{
										geo.width = Math.max(0, geo.width - stepSize);
									}
									else if (keyCode == 38)
									{
										geo.height = Math.max(0, geo.height - stepSize);
									}
									else if (keyCode == 39)
									{
										geo.width += stepSize;
									}
									else if (keyCode == 40)
									{
										geo.height += stepSize;
									}
									
									graph.getModel().setGeometry(cells[i], geo);
								}
							}
						}
					}
					finally
					{
						graph.getModel().endUpdate();
					}
				}
				else
				{
					// Moves vertices up/down in a stack layout
					var parent = graph.model.getParent(cell);
					var scale = graph.getView().scale;
					var layout = null;

					if (graph.getSelectionCount() == 1 && graph.model.isVertex(cell) &&
						graph.layoutManager != null && !graph.isCellLocked(cell))
					{
						layout = graph.layoutManager.getLayout(parent);
					}
					
					if (layout != null && layout.constructor == mxStackLayout)
					{
						var index = parent.getIndex(cell);
						
						if (keyCode == 37 || keyCode == 38)
						{
							graph.model.add(parent, cell, Math.max(0, index - 1));
						}
						else if (keyCode == 39 ||keyCode == 40)
						{
							graph.model.add(parent, cell, Math.min(graph.model.getChildCount(parent), index + 1));
						}
					}
					else
					{
						var handler = graph.graphHandler;

						if (handler != null)
						{
							if (handler.first == null)
							{
								handler.start(cell, 0, 0, graph.getMovableCells(cells));
							}

							if (handler.first != null)
							{
								var dx = 0;
								var dy = 0;
								
								if (keyCode == 37)
								{
									dx = -stepSize;
								}
								else if (keyCode == 38)
								{
									dy = -stepSize;
								}
								else if (keyCode == 39)
								{
									dx = stepSize;
								}
								else if (keyCode == 40)
								{
									dy = stepSize;
								}

								handler.currentDx += dx * scale;
								handler.currentDy += dy * scale;
								handler.checkPreview();
								handler.updatePreview();
							}

							// Groups move steps in undoable change
							if (thread != null)
							{
								window.clearTimeout(thread);
							}
							
							thread = window.setTimeout(function()
							{
								if (handler.first != null)
								{
									var dx = handler.roundLength(handler.currentDx / scale);
									var dy = handler.roundLength(handler.currentDy / scale);
									handler.moveCells(handler.cells, dx, dy);
									handler.reset();
								}
							}, 400);
						}
					}
				}
			}
		}
	};
	
	// Overridden to handle special alt+shift+cursor keyboard shortcuts
	var directions = {37: mxConstants.DIRECTION_WEST, 38: mxConstants.DIRECTION_NORTH,
		39: mxConstants.DIRECTION_EAST, 40: mxConstants.DIRECTION_SOUTH};
	var keyHandlerGetFunction = keyHandler.getFunction;

	mxKeyHandler.prototype.getFunction = function(evt)
	{
		if (graph.isEnabled())
		{
			var action = null;

			// TODO: Add alt modifier state in core API, here are some specific cases
			if (mxEvent.isShiftDown(evt) && this.isControlDown(evt) && mxEvent.isAltDown(evt))
			{
				action = editorUi.actions.get(editorUi.ctrlAltShiftActions[evt.keyCode]);

			}
			else if (mxEvent.isShiftDown(evt) && mxEvent.isAltDown(evt))
			{
				action = editorUi.actions.get(editorUi.altShiftActions[evt.keyCode]);

			}
			else if (this.isControlDown(evt) && mxEvent.isAltDown(evt))
			{
				action = editorUi.actions.get(editorUi.ctrlAltActions[evt.keyCode]);
			}

			if (action != null)
			{
				return action.funct;
			}
			else if (evt.key == '/' && !this.isControlDown(evt) && !mxEvent.isAltDown(evt))
			{
				return function()
				{
					var omniSearch = document.getElementById('geOmniSearch');
					
					if (omniSearch != null && omniSearch.clientWidth > 30)
					{
						omniSearch.focus();
					}
				};
			}
			else if (directions[evt.keyCode] != null && !graph.isSelectionEmpty())
			{
				// On macOS, Control+Cursor is used by Expose so allow for Alt+Control to resize
				if (!this.isControlDown(evt) && mxEvent.isShiftDown(evt) && mxEvent.isAltDown(evt))
				{
					if (graph.model.isVertex(graph.getSelectionCell()))
					{
						return function()
						{
							var cells = graph.connectVertex(graph.getSelectionCell(), directions[evt.keyCode],
								graph.defaultEdgeLength, evt, true);
			
							if (cells != null && cells.length > 0)
							{
								if (cells.length == 1 && graph.model.isEdge(cells[0]))
								{
									graph.setSelectionCell(graph.model.getTerminal(cells[0], false));
								}
								else
								{
									graph.setSelectionCell(cells[cells.length - 1]);
								}

								graph.scrollCellToVisible(graph.getSelectionCell());
								
								if (editorUi.hoverIcons != null)
								{
									editorUi.hoverIcons.update(graph.view.getState(graph.getSelectionCell()));
								}
							}
						};
					}
				}
				else
				{
					// Avoids consuming event if no vertex is selected by returning null below
					// Cursor keys move and resize (ctrl) cells
					if (this.isControlDown(evt))
					{
						return function()
						{
							nudge(evt.keyCode, (mxEvent.isShiftDown(evt)) ? graph.gridSize : null, true);
						};
					}
					else
					{
						return function()
						{
							nudge(evt.keyCode, (mxEvent.isShiftDown(evt)) ? graph.gridSize : null);
						};
					}
				}
			}
		}

		return keyHandlerGetFunction.apply(this, arguments);
	};

	// Binds keystrokes to actions
	keyHandler.bindAction = mxUtils.bind(this, function(code, control, key, shift)
	{
		var action = this.actions.get(key);
		
		if (action != null)
		{
			var f = function()
			{
				if (action.isEnabled())
				{
					action.funct.apply(this, arguments);
				}
			};
    		
			if (control)
			{
				if (shift)
				{
					keyHandler.bindControlShiftKey(code, f);
				}
				else
				{
					keyHandler.bindControlKey(code, f);
				}
			}
			else
			{
				if (shift)
				{
					keyHandler.bindShiftKey(code, f);
				}
				else
				{
					keyHandler.bindKey(code, f);
				}
			}
		}
	});

	var ui = this;
	var keyHandlerEscape = keyHandler.escape;
	keyHandler.escape = function(evt)
	{
		keyHandlerEscape.apply(this, arguments);
	};

	// Ignores enter keystroke. Remove this line if you want the
	// enter keystroke to stop editing. N, W, T are reserved.
	keyHandler.enter = function() {};
	
	keyHandler.bindControlShiftKey(36, function() { graph.exitGroup(); }); // Ctrl+Shift+Home
	keyHandler.bindControlShiftKey(35, function() { graph.enterGroup(); }); // Ctrl+Shift+End
	keyHandler.bindShiftKey(36, function() { graph.home(); }); // Ctrl+Shift+Home
	keyHandler.bindKey(35, function() { graph.refresh(); }); // End
	keyHandler.bindAction(80, true, 'print'); // Ctrl+P
	
	// Zoom keys are best effort for international keyboards, the actual
	// US keycodes for + is 61 and - is 173. Keypad + is 107 and - is 109.
	keyHandler.bindAction(107, true, 'zoomIn'); // Ctrl+Plus (Numpad)
	keyHandler.bindAction(109, true, 'zoomOut'); // Ctrl+Minus (Numpad)
	keyHandler.bindAction(61, true, 'zoomIn'); // Ctrl +   tested by DB, firefox only.
	keyHandler.bindAction(187, true, 'zoomIn'); // Ctrl + (US)   tested by DB, chrome and desktop
	keyHandler.bindAction(222, true, 'zoomIn'); // Ctrl Minus (CH: '/?)  tested by GA, CH keyboard
	keyHandler.bindAction(173, true, 'zoomOut'); // Ctrl - (US)   tested by DB, firefox only.
	keyHandler.bindAction(189, true, 'zoomOut'); // Ctrl Slash (CH: -/_)   tested by DB, chrome and desktop
	
	if (!this.editor.chromeless || this.editor.editable)
	{
		keyHandler.bindAction(79, true, 'outline', true); // Ctrl+Shift+O
		keyHandler.bindControlKey(36, function() { if (graph.isEnabled()) { graph.foldCells(true); }}); // Ctrl+Home
		keyHandler.bindControlKey(35, function() { if (graph.isEnabled()) { graph.foldCells(false); }}); // Ctrl+End
		keyHandler.bindControlKey(13, function() { ui.ctrlEnter(); }); // Ctrl+Enter
		keyHandler.bindAction(8, false, 'delete'); // Backspace
		keyHandler.bindAction(8, true, 'deleteAll'); // Ctrl+Backspace
		keyHandler.bindAction(8, false, 'deleteLabels', true); // Shift+Backspace
		keyHandler.bindAction(46, false, 'delete'); // Delete
		keyHandler.bindAction(46, true, 'deleteAll'); // Ctrl+Delete
		keyHandler.bindAction(46, false, 'deleteLabels', true); // Shift+Delete
		keyHandler.bindAction(36, false, 'resetView'); // Home
		keyHandler.bindAction(72, true, 'fitWindow', true); // Ctrl+Shift+H
		keyHandler.bindAction(74, true, 'fitPage'); // Ctrl+J
		keyHandler.bindAction(74, true, 'fitTwoPages', true); // Ctrl+Shift+J
		keyHandler.bindAction(48, true, 'customZoom'); // Ctrl+0
		keyHandler.bindAction(82, true, 'turn'); // Ctrl+R
		keyHandler.bindAction(82, true, 'clearDefaultStyle', true); // Ctrl+Shift+R
		keyHandler.bindAction(83, true, 'save'); // Ctrl+S
		keyHandler.bindAction(83, true, 'saveAs', true); // Ctrl+Shift+S
		keyHandler.bindAction(65, true, 'selectAll'); // Ctrl+A
		keyHandler.bindAction(65, true, 'selectNone', true); // Ctrl+A
		if (urlParams['dev'] != '1')
		{
			keyHandler.bindAction(73, true, 'selectVertices', true); // Ctrl+Shift+I
		}
		keyHandler.bindAction(69, true, 'selectEdges', true); // Ctrl+Shift+E
		keyHandler.bindAction(69, true, 'editStyle'); // Ctrl+E
		keyHandler.bindAction(66, true, 'bold'); // Ctrl+B
		keyHandler.bindAction(66, true, 'toBack', true); // Ctrl+Shift+B
		keyHandler.bindAction(70, true, 'toFront', true); // Ctrl+Shift+F
		keyHandler.bindAction(68, true, 'duplicate'); // Ctrl+D
		keyHandler.bindAction(68, true, 'setAsDefaultStyle', true); // Ctrl+Shift+D   
		keyHandler.bindAction(90, true, 'undo'); // Ctrl+Z
		keyHandler.bindAction(90, true, 'redo', true); // Ctrl+Shift+Z
		keyHandler.bindAction(89, true, 'redo'); // Ctrl+Y
		keyHandler.bindAction(89, true, 'autosize', true); // Ctrl+Shift+Y
		keyHandler.bindAction(88, true, 'cut'); // Ctrl+X
		keyHandler.bindAction(67, true, 'copy'); // Ctrl+C
		keyHandler.bindAction(86, true, 'paste'); // Ctrl+V
		keyHandler.bindAction(71, true, 'group'); // Ctrl+G
		keyHandler.bindAction(77, true, 'editData'); // Ctrl+M
		keyHandler.bindAction(71, true, 'grid', true); // Ctrl+Shift+G
		keyHandler.bindAction(73, true, 'italic'); // Ctrl+I
		keyHandler.bindAction(76, true, 'lockUnlock'); // Ctrl+L
		keyHandler.bindAction(76, true, 'layers', true); // Ctrl+Shift+L
		keyHandler.bindAction(80, true, 'format', true); // Ctrl+Shift+P
		keyHandler.bindAction(85, true, 'underline'); // Ctrl+U
		keyHandler.bindAction(85, true, 'ungroup', true); // Ctrl+Shift+U
		keyHandler.bindAction(109, true, 'decreaseFontSize', true); // Ctrl+Shift+Minus
		keyHandler.bindAction(107, true, 'increaseFontSize', true); // Ctrl+Shift+Plus
		keyHandler.bindAction(219, true, 'decreaseFontSize', true); // Ctrl+{
		keyHandler.bindAction(221, true, 'increaseFontSize', true); // Ctrl+}
		keyHandler.bindAction(190, true, 'superscript'); // Ctrl+.
		keyHandler.bindAction(188, true, 'subscript'); // Ctrl+,
		keyHandler.bindAction(13, false, 'keyPressEnter'); // Enter
		keyHandler.bindKey(113, function() { if (graph.isEnabled()) { graph.startEditingAtCell(); }}); // F2
	}
	
	return keyHandler;
};

/**
 * Adds a handler for showing a menu in the given element.
 */
EditorUi.prototype.createMenuElement = function(label, funct, clickFn)
{
	var elt = document.createElement('a');
	this.addMenuHandler(elt, funct, clickFn);
	mxUtils.write(elt, label);
	elt.className = 'geItem';
	
	return elt;
};

/**
 * Adds a handler for showing a menu in the given element.
 */
EditorUi.prototype.addMenuHandler = function(elt, funct, clickFn, handleKeyUp)
{
	if (funct != null)
	{
		var showingMenu = null;
		var show = true;
		
		var clickHandler = mxUtils.bind(this, function(evt)
		{
			if (clickFn != null)
			{
				clickFn(evt);
			}

			if (!mxEvent.isConsumed(evt) && show &&
				(elt.enabled == null || elt.enabled))
			{
				this.editor.graph.popupMenuHandler.hideMenu();
				var menu = new mxPopupMenu(funct);
				menu.smartSeparators = true;
				menu.showDisabled = true;
				menu.autoExpand = true;
				
				// Disables autoexpand and destroys menu when hidden
				menu.hideMenu = mxUtils.bind(this, function()
				{
					mxPopupMenu.prototype.hideMenu.apply(menu, arguments);
					this.resetCurrentMenu();
					showingMenu = null;
					menu.destroy();
				});

				if (!this.menus.autoPopup &&
					this.currentMenu != null)
				{
					this.hideCurrentMenu();
				}

				var offset = mxUtils.getOffset(elt);
				menu.popup(offset.x, offset.y + elt.offsetHeight, null, evt);
				this.setCurrentMenu(menu, elt);
				showingMenu = menu
			}
			
			if (!handleKeyUp)
			{
				mxEvent.consume(evt);
			}
		});
		
		// Shows menu automatically while in expanded state
		mxEvent.addListener(elt, 'mousemove', mxUtils.bind(this, function(evt)
		{
			if (this.menus.autoPopup && this.currentMenu != null &&
				this.currentMenuElt != elt && this.currentMenuElt != null)
			{
				var temp = this.currentMenuElt;
				this.hideCurrentMenu();

				if (temp.parentNode == elt.parentNode && elt.nodeName != 'INPUT')
				{
					clickHandler(evt);
				}
			}
		}));
		
		// Hides menu if already showing and prevents focus
        mxEvent.addListener(elt, (mxClient.IS_POINTER) ? 'pointerdown' : 'mousedown',
        	mxUtils.bind(this, function(evt)
		{
			if (!this.menus.autoPopup && this.currentMenu != null &&
				this.currentMenuElt != elt && mxEvent.isMouseEvent(evt))
			{
				this.hideCurrentMenu();
			}

			show = this.currentMenu == null;

			if (mxEvent.getSource(evt).nodeName != 'INPUT')
			{
				evt.preventDefault();
			}
			else
			{
				evt.stopPropagation();
			}
		}));

		mxEvent.addListener(elt, 'click', mxUtils.bind(this, function(evt)
		{
			clickHandler(evt);
			show = true;
		}));

		if (handleKeyUp)
		{
			mxEvent.addListener(elt, 'focus', mxUtils.bind(this, function(evt)
			{
				clickHandler(evt);
				show = true;
			}));

			mxEvent.addListener(elt, 'blur', mxUtils.bind(this, function(evt)
			{
				if (this.currentMenu == showingMenu)
				{
					this.hideCurrentMenu();
				}
			}));

			mxEvent.addListener(elt, 'keyup', mxUtils.bind(this, function(evt)
			{
				if (evt.keyCode == 38 /* ArrowUp */ ||
					evt.keyCode == 40 /* ArrowDown */)
				{
					return;
				}

				this.hideCurrentMenu();

				if (evt.keyCode != 13 /* Enter */ &&
					evt.keyCode != 27 /* Escape */)
				{
					clickHandler(evt);
					show = true;
				}
			}));
		}
	}
};

/**
 * Adds a submenu to this menubar.
 */
EditorUi.prototype.addShapePicker = function(elt, vertical)
{
	var graph = this.editor.graph;

	mxEvent.addListener(elt, 'click', mxUtils.bind(this, function(evt)
	{
		if (this.isShapePickerVisible())
		{
			this.hideShapePicker();
		}
		else
		{
			var off = mxUtils.getOffset(elt);
			
			if (Editor.inlineFullscreen || this.embedViewport == null)
			{
				if (vertical)
				{
					off.x -= this.diagramContainer.offsetLeft + 30;
					off.y = elt.offsetHeight - 2;
				}
				else
				{
					off.x += 16 + elt.offsetHeight +
						this.sketchPickerMenuElt.offsetWidth / 2;
					off.y += 20;
				}
			}
			else
			{
				off.x = 0;
				off.y = elt.offsetTop;
			}

			this.showShapePicker(Math.max(this.diagramContainer.scrollLeft + Math.max(24, off.x)),
				this.diagramContainer.scrollTop + off.y, null, null, null, null,
				mxUtils.bind(this, function(cells)
			{
				return graph.getCenterInsertPoint(graph.getBoundingBoxFromGeometry(cells, true));
			}), vertical, false);
		}

		mxEvent.consume(evt);
	}));
};


/**
 * Adds a submenu to this menubar.
 */
EditorUi.prototype.createZoomInput = function(readOnly)
{
	var zoomInput = document.createElement('input');
	zoomInput.className = 'geButton geZoomInput';
	zoomInput.style.backgroundImage = 'url(' + Editor.thinExpandImage + ')';
	zoomInput.setAttribute('type', 'text')
	zoomInput.setAttribute('value', '100%')
	var zoomMenu = this.menus.get('viewZoom');
	
	this.dependsOnLanguage(mxUtils.bind(this, function()
	{
		zoomInput.setAttribute('title',
			mxResources.get('zoom') +
				' (Alt+Mousewheel)');
	}));

	if (readOnly || mxClient.IS_TOUCH)
	{
		zoomInput.setAttribute('readonly', 'true');
	}
	
	var consumeEvent = false;

	mxEvent.addGestureListeners(zoomInput, mxUtils.bind(this, function(evt)
	{
		consumeEvent = false;

		if (!mxClient.IS_TOUCH && mxEvent.getSource(evt) == zoomInput &&
			document.activeElement != zoomInput)
		{
			zoomInput.focus();

			if (mxClient.IS_GC || mxClient.IS_FF)
			{
				zoomInput.select();
			}
			else
			{
				document.execCommand('selectAll', false, null);
			}

			consumeEvent = true;
		}
	}), mxUtils.bind(this, function(evt)
	{
		if (mxEvent.getSource(evt) == zoomInput &&
			consumeEvent)
		{
			mxEvent.consume(evt);
		}
	}), mxUtils.bind(this, function(evt)
	{
		if (consumeEvent)
		{
			mxEvent.consume(evt);
			consumeEvent = false;
		}
	}));

	this.addMenuHandler(zoomInput, zoomMenu.funct);

	// Updates the label if the scale changes
	(mxUtils.bind(this, function(elt)
	{
		// Adds shift+/alt+click on zoom label
		mxEvent.addListener(elt, 'click', mxUtils.bind(this, function(evt)
		{
			if (mxEvent.isAltDown(evt))
			{
				this.hideCurrentMenu();
				this.actions.get('customZoom').funct();
				mxEvent.consume(evt);
			}
			else if (mxEvent.isShiftDown(evt))
			{
				this.hideCurrentMenu();
				this.actions.get('smartFit').funct();
				mxEvent.consume(evt);
			}
		}));

		var updateZoom = mxUtils.bind(this, function(sender, evt, f)
		{
			f = (f != null) ? f : 1;
			zoomInput.value = Math.round(this.editor.graph.view.scale * 100 * f) + '%';

			if (document.activeElement == zoomInput)
			{
				this.editor.graph.container.focus();
			}
		});

		// Handles enter and tab on zoom input field
		mxEvent.addListener(zoomInput, 'keydown', mxUtils.bind(this, function(evt)
		{
			if (evt.keyCode == 27 || evt.keyCode == 13 || evt.keyCode == 9)
			{
				if (evt.keyCode == 27 || isNaN(parseInt(zoomInput.value)))
				{
					updateZoom();
				}
				else
				{
					this.editor.graph.zoomTo(parseInt(zoomInput.value) / 100);
				}

				this.hideCurrentMenu();
				mxEvent.consume(evt);
			}
		}));

		this.editor.graph.view.addListener(mxEvent.EVENT_SCALE, updateZoom);
		this.editor.addListener('resetGraphView', updateZoom);
		this.editor.addListener('pageSelected', updateZoom);
		mxEvent.addListener(zoomInput, 'blur', updateZoom);

		// Zoom Preview
		this.editor.graph.addListener('zoomPreview', mxUtils.bind(this, function(sender, evt)
		{
			updateZoom(sender, evt, evt.getProperty('factor'));
		}));
	}))(zoomInput);
	
	return zoomInput;
};

/**
 * Creates the keyboard event handler for the current graph and history.
 */
EditorUi.prototype.createHelpIcon = function(href, noCssClass)
{
	var link = document.createElement('img');
	link.setAttribute('src', Editor.helpImage);
	link.setAttribute('title', mxResources.get('help') + ' (' + href + ')');
	link.className = 'geHelpIcon';
	
	mxEvent.addGestureListeners(link, mxUtils.bind(this, function(evt)
	{
		this.hideCurrentMenu();
		this.openLink(href);
		mxEvent.consume(evt);
	}));
	
	return link;
};

/**
 * Creates the keyboard event handler for the current graph and history.
 */
EditorUi.prototype.destroy = function()
{
	var graph = this.editor.graph;

	if (graph != null && this.selectionStateListener != null)
	{
		graph.getSelectionModel().removeListener(this.selectionStateListener);
		graph.getModel().removeListener(this.selectionStateListener);
		graph.getView().removeListener(this.selectionStateListener);
		graph.removeListener(this.selectionStateListener);
		this.selectionStateListener = null;
	}
	
	if (this.inlineToolbar != null)
	{
		this.inlineToolbar.destroy();
		this.inlineToolbar = null;
	}

	if (this.sidebar != null)
	{
		this.sidebar.destroy();
		this.sidebar = null;
	}

	if (this.editor != null)
	{
		this.editor.destroy();
		this.editor = null;
	}

	if (this.menubar != null)
	{
		this.menubar.destroy();
		this.menubar = null;
	}

	if (this.toolbar != null)
	{
		this.toolbar.destroy();
		this.toolbar = null;
	}
	
	if (this.keyHandler != null)
	{
		this.keyHandler.destroy();
		this.keyHandler = null;
	}
	
	if (this.keydownHandler != null)
	{
		mxEvent.removeListener(document, 'keydown', this.keydownHandler);
		this.keydownHandler = null;
	}
		
	if (this.keyupHandler != null)
	{
		mxEvent.removeListener(document, 'keyup', this.keyupHandler);
		this.keyupHandler = null;
	}
	
	if (this.resizeHandler != null)
	{
		mxEvent.removeListener(window, 'resize', this.resizeHandler);
		this.resizeHandler = null;
	}
	
	if (this.gestureHandler != null)
	{
		mxEvent.removeGestureListeners(document, this.gestureHandler);
		this.gestureHandler = null;
	}
	
	if (this.orientationChangeHandler != null)
	{
		mxEvent.removeListener(window, 'orientationchange', this.orientationChangeHandler);
		this.orientationChangeHandler = null;
	}
	
	if (this.scrollHandler != null)
	{
		mxEvent.removeListener(window, 'scroll', this.scrollHandler);
		this.scrollHandler = null;
	}

	if (this.destroyFunctions != null)
	{
		for (var i = 0; i < this.destroyFunctions.length; i++)
		{
			this.destroyFunctions[i]();
		}
		
		this.destroyFunctions = null;
	}
	
	var c = [this.menubarContainer, this.toolbarContainer, this.sidebarContainer,
	         this.formatContainer, this.diagramContainer, this.hsplit,
	         this.chromelessToolbar, this.layersDialog];
	
	for (var i = 0; i < c.length; i++)
	{
		if (c[i] != null && c[i].parentNode != null)
		{
			c[i].parentNode.removeChild(c[i]);
		}
	}
};
