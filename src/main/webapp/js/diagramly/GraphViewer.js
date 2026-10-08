/**
 * Copyright (c) 2006-2016, JGraph Holdings Ltd
 */
// Disables theme in viewer and lightbox
Editor.currentTheme = '';
window.uiTheme = '';

/**
 * No CSS and resources available in embed mode. Parameters and docs:
 * https://www.drawio.com/doc/faq/embed-html-options
 */
GraphViewer = function(container, xmlNode, graphConfig)
{
	this.init(container, xmlNode, graphConfig);
};

// Editor inherits from mxEventSource
mxUtils.extend(GraphViewer, mxEventSource);

/**
 * Redirects editing to absolue URLs.
 */
GraphViewer.prototype.editBlankUrl = (urlParams['dev'] == '1') ? 
	'https://test.draw.io/' : 'https://app.diagrams.net/';

/**
 * Base URL for relative images.
 */
GraphViewer.prototype.imageBaseUrl = window.DRAWIO_BASE_URL + '/';

/**
 * Redirects editing to absolue URLs.
 */
GraphViewer.prototype.toolbarHeight = (document.compatMode == 'BackCompat') ? 24 : 26;

/**
 * Redirects editing to absolue URLs.
 */
GraphViewer.prototype.lightboxChrome = true;

/**
 * Redirects editing to absolue URLs.
 */
GraphViewer.prototype.lightboxZIndex = 999;

/**
 * Redirects editing to absolue URLs.
 */
GraphViewer.prototype.toolbarZIndex = 999;

/**
 * If automatic fit should be enabled if zoom is disabled. Default is true.
 */
GraphViewer.prototype.autoFit = false;

/**
 * If automatic crop should be enabled when layers are toggled. Default is false.
 */
GraphViewer.prototype.autoCrop = false;

/**
 * Specifies if the graph should be moved if a layer is made visible that
 * extends the graph beyong the top left corner. Default is true. Is this is
 * false then the viewport of the viewer will include all cells in all layers
 * regardless of their initial visible state.
 */
GraphViewer.prototype.autoOrigin = true;

/**
 * If the diagram should be centered. Default is false.
 */
GraphViewer.prototype.center = false;

/**
 * Force centering of the diagram. Default is false.
 */
GraphViewer.prototype.forceCenter = false;

/**
 * Specifies if zooming in for auto fit is allowed. Default is false.
 */
GraphViewer.prototype.allowZoomIn = false;

/**
 * Specifies if zooming out for auto fit is allowed. Default is true.
 * If toolbar-nohide is true then overflow content is visible.
 */
GraphViewer.prototype.allowZoomOut = true;

/**
 * Whether the title should be shown as a tooltip if the toolbar is disabled.
 * Default is false.
 */
GraphViewer.prototype.showTitleAsTooltip = false;

/**
 * Specifies if the constructur should delay the rendering if the container
 * is not visible by default.
 */
GraphViewer.prototype.checkVisibleState = true;

/**
 * Defines the minimum height of the container. Default is 28.
 */
GraphViewer.prototype.minHeight = 28;

/**
 * Defines the minimum width of the container. Default is 100.
 */
GraphViewer.prototype.minWidth = 100;

/**
 * Implements viewBox to keep the contents inside the bounding box
 * of the container. This is not supported in browsers that do not
 * support foreignObjects (eg. IE11). Safari is supported as labels
 * in model units place their foreignObjects at the labels (see
 * mxSvgCanvas2D.placeForeignObjects), which WebKit does not clip.
 */
GraphViewer.prototype.responsive = false;

/**
 * Specifies if viewers with auto-fit use the responsive mode, where the
 * browser scales the diagram to the container, instead of fitting the
 * diagram after each resize. This applies if the zoom toolbar is disabled,
 * zooming out is allowed and the container is not resized. The scale is
 * limited to 1 unless allow-zoom-in is true, and max-height or the height
 * of the container limit the height as in the fit. Set this to false or
 * the responsive-auto-fit config to false for the previous fit. Default
 * is true.
 */
GraphViewer.responsiveAutoFit = true;

/**
 * Dark mode can be one of null, "light", "dark" or "auto".
 */
GraphViewer.prototype.darkMode = null;

/**
 * Specifies if link icons should be shown on shapes. Default is false.
 */
GraphViewer.prototype.showLinkIcons = false;

/**
 * Specifies if tooltip icons should be shown on shapes. Default is false.
 */
GraphViewer.prototype.showTooltipIcons = false;

/**
 * Specifies if note icons should be shown on shapes. Default is true.
 */
GraphViewer.prototype.showNoteIcons = true;

/**
 * Initializes the viewer.
 */
GraphViewer.prototype.init = function(container, xmlNode, graphConfig)
{
	GraphViewer.initCss();
	this.graphConfig = (graphConfig != null) ? graphConfig : {};
	this.autoFit = (this.graphConfig['auto-fit'] != null) ?
		this.graphConfig['auto-fit'] : this.autoFit;
	this.autoCrop = (this.graphConfig['auto-crop'] != null) ?
		this.graphConfig['auto-crop'] : this.autoCrop;
	this.autoOrigin = (this.graphConfig['auto-origin'] != null) ?
		this.graphConfig['auto-origin'] : this.autoOrigin;
	this.allowZoomOut = (this.graphConfig['allow-zoom-out'] != null) ?
		this.graphConfig['allow-zoom-out'] : this.allowZoomOut;
	this.allowZoomIn = (this.graphConfig['allow-zoom-in'] != null) ?
		this.graphConfig['allow-zoom-in'] : this.allowZoomIn;
	this.forceCenter = (this.graphConfig['forceCenter'] != null) ?
		this.graphConfig['forceCenter'] : this.forceCenter;
	this.hCenterOnly = (this.graphConfig['hCenterOnly'] != null) ?
		this.graphConfig['hCenterOnly'] : this.hCenterOnly;
	this.center = (this.graphConfig['center'] != null) ?
		this.graphConfig['center'] : (this.center || this.forceCenter);
	this.checkVisibleState = (this.graphConfig['check-visible-state'] != null) ?
		this.graphConfig['check-visible-state'] : this.checkVisibleState;
	this.darkMode = (this.graphConfig['dark-mode'] != null) ?
		this.graphConfig['dark-mode'] : this.darkMode;
	this.showLinkIcons = (this.graphConfig['show-link-icons'] != null) ?
		this.graphConfig['show-link-icons'] : this.showLinkIcons;
	this.showTooltipIcons = (this.graphConfig['show-tooltip-icons'] != null) ?
		this.graphConfig['show-tooltip-icons'] : this.showTooltipIcons;
	this.showNoteIcons = (this.graphConfig['show-note-icons'] != null) ?
		this.graphConfig['show-note-icons'] : this.showNoteIcons;
	this.toolbarItems = (this.graphConfig.toolbar != null) ?
		this.graphConfig.toolbar.split(' ') : [];
	this.zoomEnabled = mxUtils.indexOf(this.toolbarItems, 'zoom') >= 0;
	this.layersEnabled = mxUtils.indexOf(this.toolbarItems, 'layers') >= 0;
	this.tagsEnabled = mxUtils.indexOf(this.toolbarItems, 'tags') >= 0;
	this.lightboxEnabled = mxUtils.indexOf(this.toolbarItems, 'lightbox') >= 0;
	this.lightboxClickEnabled = this.graphConfig.lightbox != false;
	this.initialOverflow = document.body.style.overflow;
	this.initialWidth = (container != null) ? container.style.width : null;
	this.widthIsEmpty = (this.initialWidth != null) ? this.initialWidth == '' : true;
	this.currentPage = parseInt(this.graphConfig.page) || 0;
	this.responsiveAutoFit = this.graphConfig['responsive'] == null && this.autoFit &&
		!this.zoomEnabled && this.allowZoomOut && !this.graphConfig.resize &&
		((this.graphConfig['responsive-auto-fit'] != null) ?
		this.graphConfig['responsive-auto-fit'] : GraphViewer.responsiveAutoFit);
	this.responsive = ((this.graphConfig['responsive'] != null) ?
		this.graphConfig['responsive'] : this.responsive || this.responsiveAutoFit) &&
		!this.zoomEnabled && !mxClient.NO_FO;
	this.responsiveAutoFit = this.responsiveAutoFit && this.responsive;
	this.pageId = this.graphConfig.pageId;
	this.browserTranslate = mxClient.IS_GC && ((this.graphConfig['browser-translate'] != null) ?
		this.graphConfig['browser-translate'] : true);
	this.editor = null;
	var self = this;
	
	if (this.graphConfig['toolbar-position'] == 'inline')
	{
		this.minHeight += this.toolbarHeight;
	}
	
	if (xmlNode != null)
	{
		this.xmlDocument = xmlNode.ownerDocument;
		this.xmlNode = xmlNode;
		this.xml = mxUtils.getXml(xmlNode);

		if (container != null)
		{
			var render = mxUtils.bind(this, function()
			{
				this.graph = new Graph(container);

				// Paints the cells in model units so that zoom and pan do not
				// repaint
				this.graph.view.modelCoordinates = true;

				if (this.browserTranslate)
				{
					this.graph.waitForBrowserTranslate();
				}

				this.graph.enableFlowAnimation = true;
				this.installDarkModeListener();
				
				if (this.responsive && this.graph.dialect == mxConstants.DIALECT_SVG)
				{
					var root = this.graph.view.getDrawPane().ownerSVGElement;

					// Border is applied as CSS padding on the container so that
					// it stays at a fixed pixel size when the diagram is scaled
					// down. This matches graph.fit(border) in the draw.io editor,
					// which also reserves a fixed-pixel border before scaling.
					var responsiveBorder = 0;

					if (this.graphConfig.border != null)
					{
						responsiveBorder = this.graphConfig.border;
					}
					else if (container.style.padding == '')
					{
						responsiveBorder = 8;
					}

					if (responsiveBorder > 0)
					{
						container.style.padding = responsiveBorder + 'px';
						container.style.boxSizing = 'border-box';
					}

					root.style.forcedColorAdjust = 'none';
					root.style.boxSizing = 'border-box';
					root.style.overflow = 'visible';

					this.graph.fit = function()
					{
						// Automatic
					};

					var maxScale = parseFloat(this.graphConfig['responsive-max-scale']);

					// Adds the scale of the viewBox to the scale for the hit tolerance
					// of strokes in WebKit (see mxSvgCanvas2D.toleranceScaleVariable),
					// which changes with the size of the root and the viewBox
					var updateToleranceScale = null;

					if (mxSvgCanvas2D.prototype.toleranceScaleVariable != null)
					{
						var view = this.graph.view;

						view.getToleranceScale = function()
						{
							var vb = root.viewBox.baseVal;
							var r = root.getBoundingClientRect();
							var vs = (vb != null && vb.width > 0 && vb.height > 0 &&
								r.width > 0 && r.height > 0) ? Math.min(r.width / vb.width,
								r.height / vb.height) : 1;

							return this.scale * vs;
						};

						updateToleranceScale = function()
						{
							view.updateToleranceScale();
						};

						GraphViewer.addResizeListener(root, updateToleranceScale);
					}

					// Limits the diagram like the fit if auto-fit uses this mode:
					// the scale to 1 unless zooming in is allowed, applied to the
					// diagram if the container has a width, which the fit keeps,
					// and the height to max-height or the height of the container
					// (the root is 100% high), aligned at the top left unless the
					// fit centers the diagram (see fitGraph)
					var limitRoot = false;

					if (this.responsiveAutoFit)
					{
						if (isNaN(maxScale) && !this.allowZoomIn)
						{
							maxScale = 1;
						}

						limitRoot = !this.widthIsEmpty;

						if (this.graphConfig['max-height'] != null)
						{
							root.style.maxHeight = Math.max(1, this.graphConfig['max-height'] -
								2 * responsiveBorder) + 'px';
						}

						var centered = this.center || !(this.graphConfig.resize != false ||
							container.style.height == '');
						root.setAttribute('preserveAspectRatio', (!centered) ? 'xMinYMin meet' :
							((this.hCenterOnly) ? 'xMidYMin meet' : 'xMidYMid meet'));
					}

					// Capture any pre-existing maxWidth on the container (e.g. set
					// by the host page to constrain the diagram) so we can honour
					// it as an upper bound when responsive-max-scale adjusts the width.
					var presetMaxWidth = parseFloat(container.style.maxWidth);

					this.graph.sizeDidChange = function()
					{
						var bounds = this.view.getModelGraphBounds();
						var tr = this.view.translate;

						root.setAttribute('viewBox',
							(bounds.x + tr.x - this.panDx) + ' ' +
							(bounds.y + tr.y - this.panDy) + ' ' +
							(bounds.width + 1) + ' ' +
							(bounds.height + 1));
						this.container.style.backgroundColor =
							root.style.backgroundColor;

						if (limitRoot)
						{
							root.style.maxWidth = Math.round((bounds.width + 1) * maxScale) + 'px';
						}
						else if (!isNaN(maxScale))
						{
							var naturalWidth = Math.round(
								(bounds.width + 1) * maxScale + 2 * responsiveBorder);
							var finalMaxWidth = !isNaN(presetMaxWidth) ?
								Math.min(naturalWidth, presetMaxWidth) : naturalWidth;
							this.container.style.maxWidth = finalMaxWidth + 'px';
						}

						if (updateToleranceScale != null)
						{
							updateToleranceScale();
						}

						this.fireEvent(new mxEventObject(mxEvent.SIZE, 'bounds', bounds));
					};
				}
				
				if (this.graphConfig.move)
				{
					this.graph.isMoveCellsEvent = function(evt)
					{
						return true;
					};
				}
		
				// Adds lightbox and link handling for shapes
				if (this.lightboxClickEnabled)
				{
					container.style.cursor = 'pointer';
				}
				
				// Hack for using EditorUi methods on the graph instance
				this.editor = new Editor(true, null, null, this.graph);
				this.editor.editBlankUrl = this.editBlankUrl;
				this.graph.lightbox = true;
				this.graph.centerZoom = false;
				this.graph.autoExtend = false;
				this.graph.autoScroll = false;
				this.graph.showLinkIcons = this.showLinkIcons;
				this.graph.showTooltipIcons = this.showTooltipIcons;
				this.graph.showNoteIcons = this.showNoteIcons;
				this.graph.setEnabled(false);
				
				if (this.graphConfig['toolbar-nohide'] == true)
				{
					this.editor.defaultGraphOverflow = 'visible';
				}
				
				// Extract graph model from html & svg formats
				var temp = this.editor.extractGraphModel(this.xmlNode, true);
				
				if (temp != null && temp != xmlNode)
				{
					try
					{
						this.xml = mxUtils.getXml(temp);
						this.xmlNode = temp;
						this.xmlDocument = temp.ownerDocument;
					}
					catch (e)
					{
						// ignore
					}
				}
				
				// Handles relative images
				this.graph.getImageFromBundles = function(key)
				{
					return self.getImageUrl(key);
				};
				
				this.graph.addSvgShadow(this.graph.view.canvas.ownerSVGElement, null, true);
				
				// Adds page placeholders
				if (this.xmlNode.nodeName == 'mxfile')
				{
					var diagrams = this.xmlNode.getElementsByTagName('diagram');
					
					if (diagrams.length > 0)
					{
						// Finds index for given page ID
						if (this.pageId != null)
						{
							for (var i = 0; i < diagrams.length; i++)
							{
								if (this.pageId == diagrams[i].getAttribute('id'))
								{
									this.currentPage = i;
									break;
								}
							}
						}
						
						var graphGetGlobalVariable = this.graph.getGlobalVariable;
						var cachedFileVars = null;

						try
						{
							var varsStr = self.xmlNode.getAttribute('vars');

							if (varsStr != null && varsStr.length > 0)
							{
								cachedFileVars = JSON.parse(varsStr);
							}
						}
						catch (e)
						{
							// ignore
						}

						this.graph.getGlobalVariable = function(name)
						{
							var diagram = diagrams[self.currentPage];

							if (name == 'page')
							{
								return diagram.getAttribute('name') || mxResources.get('pageWithNumber',
									[self.currentPage + 1], 'Page-' + (self.currentPage + 1));
							}
							else if (name == 'pagenumber')
							{
								return self.currentPage + 1;
							}
							else if (name == 'pagecount')
							{
								return diagrams.length;
							}

							var val = graphGetGlobalVariable.apply(this, arguments);

							if (val == null && cachedFileVars != null)
							{
								val = cachedFileVars[name];
							}

							return val;
						};
					}
				}
				
				this.diagrams = [];
				var lastXmlNode = null;
				
				this.selectPage = function(number)
				{
					if(this.handlingResize)
						return;

					// Saves current page's hidden tags before switching
					if (this.tagsEnabled && this.graphConfig.hiddenTags != null &&
						this.diagrams[this.currentPage] != null)
					{
						var curPageId = this.diagrams[this.currentPage].getAttribute('id');
						this.graphConfig.hiddenTags[curPageId] =
							(this.graph.hiddenTags.length > 0) ? this.graph.hiddenTags.slice() : null;
					}

					this.currentPage = mxUtils.mod(number, this.diagrams.length);

					// Applies hidden tags before updating XML so that
					// positionGraph uses the correct tag visibility
					if (this.tagsEnabled && this.graphConfig.hiddenTags != null &&
						this.diagrams[this.currentPage] != null)
					{
						var pageId = this.diagrams[this.currentPage].getAttribute('id');
						var pageTags = this.graphConfig.hiddenTags[pageId];
						this.graph.hiddenTags = (pageTags != null && pageTags.length > 0) ? pageTags : [];
					}

					this.updateGraphXml(Editor.parseDiagramNode(this.diagrams[this.currentPage]));
				};
				
				this.selectPageById = function(id)
				{
					var index = this.getIndexById(id);
					var found = index >= 0;

					if (found)
					{
						this.selectPage(index);
					}
					
					return found;
				};
				
				var update = mxUtils.bind(this, function()
				{
					if (this.xmlNode == null || this.xmlNode.nodeName != 'mxfile')
					{
						this.diagrams = [];
					}
					if (this.xmlNode != lastXmlNode)
					{
						this.diagrams = this.xmlNode.getElementsByTagName('diagram');
						lastXmlNode = this.xmlNode;
					}
				});

				// Replaces background page reference with SVG
				var graphSetBackgroundImage = this.graph.setBackgroundImage;
		
				this.graph.setBackgroundImage = function(img)
				{
					if (img != null && Graph.isPageLink(img.src))
					{
						var src = img.src;
						var comma = src.indexOf(',');
							
						if (comma > 0)
						{
							var index = self.getIndexById(src.substring(comma + 1));
					
							if (index >= 0)
							{
								img = self.getImageForGraphModel(
									Editor.parseDiagramNode(
									self.diagrams[index]));
								img.originalSrc = src;
							}
						}
					}

					graphSetBackgroundImage.apply(this, arguments);
				};

				// Overrides graph bounds to include background pages
				var graphGetGraphBounds = this.graph.getGraphBounds;
		
				this.graph.getGraphBounds = function(img)
				{
					var bounds = graphGetGraphBounds.apply(this, arguments);
					var img = this.backgroundImage;

					// Check img.originalSrc to ignore background
					// images but not background pages
					if (img != null)
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

				// LATER: Add event for setGraphXml
				this.addListener('xmlNodeChanged', update);
				update();
	
				// Passes current page via urlParams global variable
				// to let the parser know which page we're using
				urlParams['page'] = self.currentPage;
				var visible = null;

				this.graph.getModel().beginUpdate();
				try
				{
					// Required for correct parsing of fold parameter
					urlParams['nav'] = (this.graphConfig.nav != false) ? '1' : '0';
					
					this.editor.setGraphXml(this.xmlNode);
					this.graph.view.scale = this.graphConfig.zoom || 1;
					visible = this.setLayersVisible();

					// Applies initial hidden tags from config
					if (this.tagsEnabled && this.graphConfig.hiddenTags != null &&
						this.diagrams != null && this.diagrams[this.currentPage] != null)
					{
						var pageId = this.diagrams[this.currentPage].getAttribute('id');
						var pageTags = this.graphConfig.hiddenTags[pageId];

						if (pageTags != null && pageTags.length > 0)
						{
							this.graph.hiddenTags = pageTags;
						}
					}

					this.fireEvent(new mxEventObject('graphInitialized'));
					
					if (!this.responsive)
					{
						this.graph.border = (this.graphConfig.border != null) ? this.graphConfig.border : 8;
					}

					this.installBackgroundColorHandler();
					GraphViewer.viewerInitialized(this);
				}
				finally
				{
					this.graph.getModel().endUpdate();
				}

				// Adds left-button panning only if scrollbars are visible
				if (!this.responsive)
				{
					this.graph.panningHandler.isForcePanningEvent = function(me)
					{
						return !mxEvent.isPopupTrigger(me.getEvent()) &&
							this.graph.isContainerPannable();
					};
					
					this.graph.panningHandler.useLeftButtonForPanning = true;					
					this.graph.panningHandler.ignoreCell = true;
					this.graph.panningHandler.usePopupTrigger = false;
					this.graph.panningHandler.pinchEnabled = false;
				}
				
				this.graph.setPanning(false);
		
				if (this.graphConfig.toolbar != null)
				{
					this.addToolbar();
				}
				else if (this.graphConfig.title != null && this.showTitleAsTooltip)
				{
					container.setAttribute('title', this.graphConfig.titleTooltip || this.graphConfig.title);
				}
				
				if (!this.responsive)
				{
					this.addSizeHandler();
				}

				// Crops to visible layers if no layers toolbar button
				if (this.showLayers(this.graph) && !this.forceCenter && (!this.layersEnabled || this.autoCrop))
				{
					this.crop();
				}

				this.addClickHandler(this.graph);
				this.graph.initialViewState = {
					translate: this.graph.view.translate.clone(),
					scale: this.graph.view.scale
				};
				
				if (visible != null)
				{
					this.setLayersVisible(visible);
				}
				
				// Selects the next or previous page with wrap around
				this.graph.selectNextPage = function(forward)
				{
					if (self.diagrams != null && self.diagrams.length > 1)
					{
						self.selectPage(self.currentPage + ((forward) ? 1 : -1));
					}
				};

				this.graph.customLinkClicked = function(href, associatedCell)
				{
					try
					{
						if (Graph.isPageLink(href))
						{
							// Whitespace around the ID of a hand-typed link is
							// ignored, as in EditorUi.getPageByLink.
							var id = href.substring(href.indexOf(',') + 1);
							
							if (!self.selectPageById(id) &&
								!self.selectPageById(mxUtils.trim(id)))
							{
								alert(mxResources.get('pageNotFound') || 'Page not found');
							}
						}
						else
						{
							// Crops only if the diagram changed, not for viewbox or
							// scroll actions, which change the bounds on the screen
							var bounds = this.view.getModelGraphBounds();
							this.handleCustomLink(href, associatedCell);
							
							if (!bounds.equals(this.view.getModelGraphBounds()))
							{
								self.crop();
							}
						}
					}
					catch (e)
					{
						alert(e.message);
					}
					
					return true;
				};

				// Resolves page links to page names for link tooltips
				var graphGetLinkTitle = this.graph.getLinkTitle;

				this.graph.getLinkTitle = function(href)
				{
					if (Graph.isPageLink(href))
					{
						// Ignores whitespace around the ID like customLinkClicked
						var id = href.substring(href.indexOf(',') + 1);
						var index = self.getIndexById(id);

						if (index < 0)
						{
							index = self.getIndexById(mxUtils.trim(id));
						}

						if (index >= 0)
						{
							return self.diagrams[index].getAttribute('name') ||
								mxResources.get('pageWithNumber', [index + 1], 'Page-' + (index + 1));
						}
						else
						{
							return mxResources.get('pageNotFound', null, 'Page not found');
						}
					}

					return graphGetLinkTitle.apply(this, arguments);
				};
				
				// Updates origin after tree cell folding
				var graphFoldTreeCell = this.graph.foldTreeCell;
				
				this.graph.foldTreeCell = mxUtils.bind(this, function()
				{
					this.treeCellFolded = true;
					
					return graphFoldTreeCell.apply(this.graph, arguments);
				});
				
				this.fireEvent(new mxEventObject('render'));
			});

			var MutObs = window.MutationObserver ||
				window.WebKitMutationObserver ||
				window.MozMutationObserver;
			
			if (this.checkVisibleState && container.offsetWidth == 0 &&
				this.getAncestorDetails(container) == null &&
				typeof MutObs !== 'undefined')
			{
				// Delayed rendering if inside hidden container and event available
				var par = this.getObservableParent(container);
			
				var observer = new MutObs(mxUtils.bind(this, function(mutation)
				{
					if (container.offsetWidth > 0)
					{
						observer.disconnect();
						render();
					}
				}));
				
				observer.observe(par, {attributes: true});
			}
			else
			{
				// Immediate rendering in all other cases
				render();
			}
		}
	}
};

/**
 * 
 */
GraphViewer.prototype.installBackgroundColorHandler = function()
{
	var graph = this.graph;

	if (graph != null)
	{
		if (GraphViewer.shapeBackgroundColor != null)
		{
			graph.shapeBackgroundColor = GraphViewer.shapeBackgroundColor;
		}
		
		graph.defaultPageBackgroundColor = 'transparent';
		graph.diagramBackgroundColor = 'transparent';
		graph.transparentBackground = false;
		
		var originalBackground = graph.background;

		var updateBackground = mxUtils.bind(this, function(validate)
		{
			if (graph.getAdaptiveColors() == 'none' &&
				originalBackground == null)
			{
				if (this.isDarkMode())
				{
					graph.background = '#ffffff';
				}
				else
				{
					graph.background = null;
				}

				if (validate)
				{
					graph.view.validateBackground();
				}
			}
		});
		
		// Called when pages are changed
		this.addListener('graphChanged', function()
		{
			originalBackground = graph.background;
			updateBackground(true);
		});

		// Called when the theme changes
		this.addListener('darkModeChanged', function()
		{
			updateBackground(true);
		});

		// Sets initial state
		updateBackground(false);
	}
};

/**
 * 
 */
GraphViewer.prototype.installDarkModeListener = function()
{
	if (window.matchMedia != null)
	{
		window.matchMedia('(prefers-color-scheme: dark)')
			.addEventListener('change', mxUtils.bind(this, function()
		{
			this.darkModeChanged();
			this.fireEvent(new mxEventObject('darkModeChanged'));
		}));
	}
	
	this.darkModeChanged();
};

/**
 * 
 */
GraphViewer.prototype.darkModeChanged = function()
{
	if (this.graph != null)
	{
		var container = this.graph.container;
		var dark = this.isDarkMode();

		if (dark)
		{
			container.classList.add('geDarkMode');
		}
		else
		{
			container.classList.remove('geDarkMode');
		}

		container.style.colorScheme = (dark) ? 'dark' : 'light';
	}
};

/**
 * 
 */
GraphViewer.prototype.getAncestorDetails = function(container)
{
	while (container != null)
	{
		if (container.nodeName == 'DETAILS')
		{
			return container;
		}
		
		container = container.parentNode;
	}

	return null;
};

/**
 * 
 */
GraphViewer.prototype.getObservableParent = function(container)
{
	var node = container.parentNode;
	
	while (node != document.body && node.parentNode != null &&
		mxUtils.getCurrentStyle(node).display !== 'none')
	{
		node = node.parentNode;
	}
	
	return node;
};

/**
 * 
 */
GraphViewer.prototype.getImageUrl = function(url)
{
	if (url != null && url.substring(0, 7) != 'http://' &&
		url.substring(0, 8) != 'https://' && url.substring(0, 10) != 'data:image')
	{
		if (url.charAt(0) == '/')
		{
			url = url.substring(1, url.length);
		}
		
		url = this.imageBaseUrl + url;
	}
	
	return url;
};

/**
 * 
 */
GraphViewer.prototype.getImageForGraphModel = function(node)
{
	var graph = Graph.createOffscreenGraph(this.graph.getStylesheet());
	graph.getGlobalVariable = this.graph.getGlobalVariable;
	document.body.appendChild(graph.container);

	var codec = new mxCodec(node.ownerDocument);
	var root = codec.decode(node).root;
	graph.model.setRoot(root);
	
	var svgRoot = graph.getSvg();
	var bounds = graph.getGraphBounds();
	document.body.removeChild(graph.container);

	return new mxImage(Editor.createSvgDataUri(mxUtils.getXml(svgRoot)),
		bounds.width, bounds.height, bounds.x, bounds.y);
};

/**
 * 
 */
GraphViewer.prototype.getIndexById = function(id)
{
	if (this.diagrams != null)
	{
		for (var i = 0; i < this.diagrams.length; i++)
		{
			if (this.diagrams[i].getAttribute('id') == id)
			{
				return i;
			}
		}
	}

	return -1;
};

/**
 * 
 */
GraphViewer.prototype.setXmlNode = function(xmlNode)
{
	//Extract graph model from html & svg formats 
	xmlNode = this.editor.extractGraphModel(xmlNode, true);

	this.xmlDocument = xmlNode.ownerDocument;
	this.xml = mxUtils.getXml(xmlNode);
	this.xmlNode = xmlNode;
	
	this.updateGraphXml(xmlNode);
	this.fireEvent(new mxEventObject('xmlNodeChanged'));
};

/**
 * 
 */
GraphViewer.prototype.setFileNode = function(xmlNode)
{
	if (this.xmlNode == null)
	{
		this.xmlDocument = xmlNode.ownerDocument;
		this.xml = mxUtils.getXml(xmlNode);
		this.xmlNode = xmlNode;
	}
	
	this.setGraphXml(xmlNode);
};

/**
 * 
 */
GraphViewer.prototype.updateGraphXml = function(xmlNode)
{
	this.setGraphXml(xmlNode);
	this.fireEvent(new mxEventObject('graphChanged'));
};


/**
 *
 */
GraphViewer.prototype.setLayersVisible = function(visible)
{
	var allVisible = true;
	
	if (!this.autoOrigin)
	{
		var result = [];
		var model = this.graph.getModel();
		
		model.beginUpdate();
		try
		{
			for (var i = 0; i < model.getChildCount(model.root); i++)
			{
				var layer = model.getChildAt(model.root, i);
				allVisible = allVisible && model.isVisible(layer);
				result.push(model.isVisible(layer));
				model.setVisible(layer, (visible != null) ? visible[i] : true);
			}
		}
		finally
		{
			model.endUpdate();
		}
	}
	
	return (allVisible) ? null : result;
};

/**
 * 
 */
GraphViewer.prototype.setGraphXml = function(xmlNode)
{
	if (this.graph != null)
	{
		this.graph.view.translate = new mxPoint();
		this.graph.view.scale = 1;
		var visible = null;
		
		this.graph.getModel().beginUpdate();
		try
		{
			this.graph.getModel().clear();
			this.editor.setGraphXml(xmlNode);
			visible = this.setLayersVisible(true);
		}
		finally
		{
			this.graph.getModel().endUpdate();
		}
	
		if (!this.responsive)
		{
			// Restores initial CSS state
			if (this.widthIsEmpty)
			{
				this.graph.container.style.width = '';
				this.graph.container.style.height = '';
			}
			else
			{
				this.graph.container.style.width = this.initialWidth;
			}

			this.positionGraph();
		}

		this.graph.initialViewState = {
			translate: this.graph.view.translate.clone(),
			scale: this.graph.view.scale
		};
				
		if (visible)
		{
			this.setLayersVisible(visible);
		}
	}
};

/**
 * 
 */
GraphViewer.prototype.isDarkMode = function()
{
	return this.darkMode == 'dark' || (this.darkMode == 'auto' && window.matchMedia &&
		window.matchMedia('(prefers-color-scheme: dark)').matches);
};

/**
 * 
 */
GraphViewer.prototype.addSizeHandler = function()
{
	var container = this.graph.container;
	var bounds = this.graph.getGraphBounds();
	var updatingOverflow = false;

	if (this.graphConfig['toolbar-nohide'] != true)
	{
		container.style.overflow = 'hidden';
	}
	else
	{
		container.style.overflow = 'visible';
	}
	
	var updateOverflow = mxUtils.bind(this, function()
	{
		if (!updatingOverflow)
		{
			updatingOverflow = true;
			var tmp = this.graph.getGraphBounds();
			
			if (this.graphConfig['toolbar-nohide'] != true)
			{
				// Shows scrollbars if graph is larger than available width
				if (tmp.width + 2 * this.graph.border > container.offsetWidth - 2)
				{
					container.style.overflow = 'auto';
				}
				else
				{
					container.style.overflow = 'hidden';
				}
			}
			else
			{
				container.style.overflow = 'visible';
			}

			if (this.toolbar != null && this.graphConfig['toolbar-nohide'] != true)
			{
				var r = container.getBoundingClientRect();
				
				// Uses the body as the origin if it is positioned relative
				var origin = mxUtils.getScrollOrigin(document.body)
				var b = (document.body.style.position === 'relative') ?
					document.body.getBoundingClientRect() :
					{left: -origin.x, top: -origin.y};
				r = {left: r.left - b.left, top: r.top - b.top, bottom: r.bottom - b.top, right: r.right - b.left};
				
				this.toolbar.style.left = r.left + 'px';
				
				if (this.graphConfig['toolbar-position'] == 'bottom')
				{
					this.toolbar.style.top = r.bottom - 1 + 'px';
				}
				else
				{
					if (this.graphConfig['toolbar-position'] != 'inline')
					{
						this.toolbar.style.width = Math.max(this.minToolbarWidth, container.offsetWidth) + 'px';
						this.toolbar.style.top = r.top + 1 + 'px';
					}
					else
					{
						this.toolbar.style.top = r.top + 'px';
					}
				}
			}
			else if (this.toolbar != null)
			{
				this.toolbar.style.width = Math.max(this.minToolbarWidth, container.offsetWidth) + 'px';
			}

			// Updates origin after tree cell folding
			if (this.treeCellFolded)
			{
				this.treeCellFolded = false;
				this.positionGraph(this.graph.view.translate);
				this.graph.initialViewState.translate = this.graph.view.translate.clone();
			}
			
			updatingOverflow = false;
		}
	});

	var lastOffsetWidth = null;
	var cachedOffsetWidth = null;
	this.handlingResize = false;
	
	// Installs function on instance
	this.fitGraph = mxUtils.bind(this, function(maxScale)
	{
		var cachedOffsetWidth = container.offsetWidth;
		
		if (cachedOffsetWidth != lastOffsetWidth && !this.handlingResize)
		{
			this.handlingResize = true;
			
			// Hides scrollbars to force update of translate
			if (container.style.overflow == 'auto')
			{
				container.style.overflow = 'hidden';
			}
			
			this.graph.maxFitScale = (maxScale != null) ? maxScale : (this.graphConfig.zoom ||
				((this.allowZoomIn) ? null : 1));
			this.graph.fit(null, null, null, null, null, true);

			if (this.center || !(this.graphConfig.resize != false || container.style.height == ''))
			{
				this.graph.center(true, this.hCenterOnly? false : true);
			}	
			
			this.graph.maxFitScale = null;
			
			if (this.graphConfig.resize != false || container.style.height == '' || this.hCenterOnly)
			{
				this.updateContainerHeight(container, Math.max(this.minHeight,
					this.graph.getGraphBounds().height +
					2 * this.graph.border + 1));
			}

			this.graph.initialViewState = {
				translate: this.graph.view.translate.clone(),
				scale: this.graph.view.scale
			};
			
			lastOffsetWidth = cachedOffsetWidth;
			
			// Workaround for fit triggering scrollbars triggering doResize (infinite loop)
			window.setTimeout(mxUtils.bind(this, function()
			{
				this.handlingResize = false;
			}), 0);
		}
	});

	if (GraphViewer.useResizeSensor)
	{
		GraphViewer.addResizeListener(this.graph.container, updateOverflow);
	}
	
	if (this.graphConfig.resize || ((this.zoomEnabled || !this.autoFit) && this.graphConfig.resize != false))
	{
		this.graph.minimumContainerSize = new mxRectangle(0, 0, this.minWidth, this.minHeight);
		this.graph.resizeContainer = true;
	}
	else
	{
		// Sets initial size for responsive diagram to stop at actual size
		if (this.widthIsEmpty && !(container.style.height != '' && this.autoFit))
		{
			this.updateContainerWidth(container, bounds.width + 2 * this.graph.border);
		}
		
		if (this.graphConfig.resize != false || container.style.height == '')
		{
			this.updateContainerHeight(container, Math.max(this.minHeight, bounds.height + 2 * this.graph.border + 1));
		}

		if (!this.zoomEnabled && this.autoFit)
		{
			var lastOffsetWidth = null;
			
			// Fits right away as the resize sensor reports at most once per
			// frame and a fit does not repaint the cells in model coordinates
			var doResize = mxUtils.bind(this, function()
			{
				if (!this.handlingResize)
				{
					this.fitGraph();
				}
			});
			
			if (GraphViewer.useResizeSensor)
			{
				GraphViewer.addResizeListener(this.graph.container, doResize);
			}
		}
		else if (!(document.documentMode <= 9))
		{
			this.graph.addListener('size', updateOverflow);
		}
	}

	var positionGraph = mxUtils.bind(this, function(origin)
	{
		// Allocates maximum width while setting initial view state
		var prev = container.style.minWidth;
		
		if (this.widthIsEmpty)
		{
			container.style.minWidth = '100%';
		}
		
		var maxHeight = (this.graphConfig['max-height'] != null) ? this.graphConfig['max-height'] :
			((container.style.height != '' && this.autoFit) ? container.offsetHeight : undefined);
		
		if (container.offsetWidth > 0 && origin == null && this.allowZoomOut && (this.allowZoomIn ||
			bounds.width + 2 * this.graph.border > container.offsetWidth ||
			bounds.height + 2 * this.graph.border > maxHeight))
		{
			var maxScale = null;

			if (maxHeight != null && bounds.height + 2 * this.graph.border > maxHeight - 2)
			{
				maxScale = (maxHeight - 2 * this.graph.border - 2) / bounds.height;
			}

			this.fitGraph(maxScale);
		}
		else if (!this.widthIsEmpty && origin == null && !(this.graphConfig.resize != false || container.style.height == ''))
		{
			this.graph.center((!this.widthIsEmpty || bounds.width < this.minWidth) && this.graphConfig.resize != true);
		}
		else
		{
			origin = (origin != null) ? origin : new mxPoint();
		
			this.graph.view.setTranslate(Math.floor(this.graph.border - bounds.x / this.graph.view.scale) + origin.x,
				Math.floor(this.graph.border - bounds.y / this.graph.view.scale) + origin.y);
			lastOffsetWidth = container.offsetWidth;
		}
		
		container.style.minWidth = prev
	});

	if (document.documentMode == 8)
	{
		window.setTimeout(positionGraph, 0);
	}
	else
	{
		positionGraph();
	}

	// Installs function on instance
	this.positionGraph = function(origin)
	{
		bounds = this.graph.getGraphBounds();
		lastOffsetWidth = null;
		positionGraph(origin);
	};
};

/**
 * Moves the origin of the graph to the top, right corner.
 */
GraphViewer.prototype.crop = function()
{
	var graph = this.graph;
	var bounds = graph.getGraphBounds();
	var border = graph.border;
	var s = graph.view.scale;
	var x0 = (bounds.x != null) ? Math.floor(graph.view.translate.x - bounds.x / s + border) : border;
	var y0 = (bounds.y != null) ? Math.floor(graph.view.translate.y - bounds.y / s + border) : border;

	graph.view.setTranslate(x0, y0);
};

/**
 * 
 */
GraphViewer.prototype.updateContainerWidth = function(container, width)
{
	container.style.width = width + 'px';
};

/**
 * 
 */
GraphViewer.prototype.updateContainerHeight = function(container, height)
{
	if (this.forceCenter || this.zoomEnabled || !this.autoFit || document.compatMode == 'BackCompat' ||
		document.documentMode == 8)
	{
		container.style.height = height + 'px';
	}
};

/**
 * Shows the 
 */
GraphViewer.prototype.showLayers = function(graph, sourceGraph)
{
	var layers = this.graphConfig.layers;
	var idx = (layers != null && layers.length > 0) ? layers.split(' ') : [];
	var layerIds = this.graphConfig.layerIds;
	var hasLayerIds = layerIds != null && layerIds.length > 0;
	var result = false;
	
	if (idx.length > 0 || hasLayerIds || sourceGraph != null)
	{
		var source = (sourceGraph != null) ? sourceGraph.getModel() : null;
		var model = graph.getModel();
		model.beginUpdate();
		
		try
		{
			var childCount = model.getChildCount(model.root);
			
			// Shows specified layers (eg. 0 1 3)
			if (source == null)
			{
				var layersFound = false, visibleLayers = {};
				
				if (hasLayerIds)
				{
					for (var i = 0; i < layerIds.length; i++)
					{
						var layer = model.getCell(layerIds[i]);
						
						if (layer != null)
						{
							layersFound = true;
							visibleLayers[layer.id] = true;
						}
					}
				}
				else
				{
					for (var i = 0; i < idx.length; i++)
					{
						var layer = model.getChildAt(model.root, parseInt(idx[i]));

						if (layer != null)
						{
							layersFound = true;
							visibleLayers[layer.id] = true;
						}
					}
				}
				
				//To prevent hiding all layers, only apply if the specified layers are found
				//This prevents incorrect settings from showing an empty viewer
				for (var i = 0; layersFound && i < childCount; i++)
				{
					var layer = model.getChildAt(model.root, i);
					model.setVisible(layer, visibleLayers[layer.id] || false);
				}
			}
			else
			{
				// Match visible layers in source graph
				for (var i = 0; i < childCount; i++)
				{
					model.setVisible(model.getChildAt(model.root, i),
						source.isVisible(source.getChildAt(source.root, i)));
				}
			}
		}
		finally
		{
			model.endUpdate();
		}

		result = true;
	}

	return result;
};

/**
 * 
 */
GraphViewer.prototype.addToolbar = function()
{
	var container = this.graph.container;
	
	if (this.graphConfig['toolbar-position'] == 'bottom')
	{
		container.style.marginBottom = this.toolbarHeight + 'px';
	}
	else if (this.graphConfig['toolbar-position'] != 'inline')
	{
		container.style.marginTop = this.toolbarHeight + 'px';
	}

	// Creates toolbar for viewer
	var toolbar = container.ownerDocument.createElement('div');
	toolbar.style.display = 'flex';
	toolbar.style.alignItems = 'center';
	toolbar.style.position = 'absolute';
	toolbar.style.overflow = 'hidden';
	toolbar.style.boxSizing = 'border-box';
	toolbar.style.whiteSpace = 'nowrap';
	toolbar.style.textAlign = 'left';
	toolbar.style.zIndex = this.toolbarZIndex;
	toolbar.style.backgroundColor = 'light-dark(#eeeeee, ' + GraphViewer.darkBackgroundColor + ')';
	toolbar.style.height = this.toolbarHeight + 'px';

	var updateDarkMode = mxUtils.bind(this,	function()
	{
		if (this.isDarkMode())
		{
			toolbar.classList.add('geDarkMode');
			toolbar.style.colorScheme = 'dark';
		}
		else
		{
			toolbar.classList.remove('geDarkMode');
			toolbar.style.colorScheme = 'light';
		}
	});

	this.addListener('darkModeChanged', updateDarkMode);
	this.toolbar = toolbar;
	updateDarkMode();
	
	if (this.graphConfig['toolbar-position'] == 'inline')
	{
		mxUtils.setPrefixedStyle(toolbar.style, 'transition', 'opacity 100ms ease-in-out');
		mxUtils.setOpacity(toolbar, 30);
		
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
			 	mxUtils.setOpacity(toolbar, 0);
				fadeThread = null;
			 	
				fadeThread2 = window.setTimeout(mxUtils.bind(this, function()
				{
					toolbar.style.display = 'none';
					fadeThread2 = null;
				}), 100);
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
			
			toolbar.style.display = 'flex';
			mxUtils.setOpacity(toolbar, opacity || 30);
		});
		
		mxEvent.addListener(this.graph.container, (mxClient.IS_POINTER) ? 'pointermove' : 'mousemove', mxUtils.bind(this, function(evt)
		{
			if (!mxEvent.isTouchEvent(evt))
			{
				fadeIn(30);
				fadeOut();
			}
		}));
		
		mxEvent.addListener(toolbar, (mxClient.IS_POINTER) ? 'pointermove' : 'mousemove', function(evt)
		{
			mxEvent.consume(evt);
		});
		
		mxEvent.addListener(toolbar, 'mouseenter', mxUtils.bind(this, function(evt)
		{
			fadeIn(100);
		}));

		mxEvent.addListener(toolbar, 'mousemove',  mxUtils.bind(this, function(evt)
		{
			fadeIn(100);
			mxEvent.consume(evt);
		}));

		mxEvent.addListener(toolbar, 'mouseleave',  mxUtils.bind(this, function(evt)
		{
			if (!mxEvent.isTouchEvent(evt))
			{
				fadeIn(30);
			}
		}));
		
		// Shows/hides toolbar for touch devices
		this.graph.addTouchTapListener(function()
		{
			if (parseFloat(toolbar.style.opacity || 0) > 0)
			{
				fadeOut();
			}
			else
			{
				fadeIn(30);
			}
		});
	}
	
	var tokens = this.toolbarItems;
	var buttonCount = 0;
	
	var addButton = mxUtils.bind(this, function(fn, imgSrc, tip, enabled)
	{
		var a = this.createToolbarButton(fn, imgSrc, tip, enabled);
		toolbar.appendChild(a);
		
		buttonCount++;
		
		return a;
	});

	var model = this.graph.getModel();
	var layersDialog = null;
	var tagsComponent = null;
	var tagsDialog = null;
	var pageInfo = null;
	
	for (var i = 0; i < tokens.length; i++)
	{
		var token = tokens[i];
		
		if (token == 'pages')
		{
			pageInfo = container.ownerDocument.createElement('div');
			pageInfo.style.display = 'inline-flex';
			pageInfo.style.position = 'relative';
			pageInfo.style.alignItems = 'center';
			pageInfo.style.padding = '4px';
			pageInfo.style.fontFamily = GraphViewer.cssFontFamily;
			pageInfo.style.fontSize = '12px';
			pageInfo.style.cursor = 'default';
			pageInfo.style.color = 'light-dark(#000000, #ffffff)';
			mxUtils.setOpacity(pageInfo, 70);
			
			var prevButton = addButton(mxUtils.bind(this, function()
			{
				this.selectPage(this.currentPage - 1);
			}), Editor.chevronLeftImage, mxResources.get('previousPage') || 'Previous Page');

			prevButton.style.borderRightStyle = 'none';
			prevButton.style.paddingLeft = '0px';
			prevButton.style.paddingRight = '0px';
			toolbar.appendChild(pageInfo);

			var nextButton = addButton(mxUtils.bind(this, function()
			{
				this.selectPage(this.currentPage + 1);
			}), Editor.chevronRightImage, mxResources.get('nextPage') || 'Next Page');
			
			nextButton.style.paddingLeft = '0px';
			nextButton.style.paddingRight = '0px';
			
			var update = mxUtils.bind(this, function()
			{
				pageInfo.innerText = '';
				mxUtils.write(pageInfo, (this.currentPage + 1) + ' / ' + this.diagrams.length);
				pageInfo.style.display = (this.diagrams.length > 1) ? 'inline-flex' : 'none';
				prevButton.style.display = pageInfo.style.display;
				nextButton.style.display = pageInfo.style.display;
			});
			
			// LATER: Add event for setGraphXml
			this.addListener('graphChanged', update);
			update();
		}
		else if (token == 'zoom')
		{
			if (this.zoomEnabled)
			{
				addButton(mxUtils.bind(this, function()
				{
					this.graph.zoomOut();
				}), Editor.zoomOutImage, mxResources.get('zoomOut') || 'Zoom Out');

				addButton(mxUtils.bind(this, function()
				{
					this.graph.zoomIn();
				}), Editor.zoomInImage, mxResources.get('zoomIn') || 'Zoom In');

				addButton(mxUtils.bind(this, function()
				{
					this.graph.view.scaleAndTranslate(this.graph.initialViewState.scale,
						this.graph.initialViewState.translate.x,
						this.graph.initialViewState.translate.y);
				}), Editor.zoomFitImage, mxResources.get('fit') || 'Fit');
			}
		}
		else if (token == 'layers')
		{
			if (this.layersEnabled)
			{
				var layersButton = addButton(mxUtils.bind(this, function(evt)
				{
					if (layersDialog != null)
					{
						layersDialog.parentNode.removeChild(layersDialog);
						layersDialog = null;
					}
					else
					{
						layersDialog = this.graph.createLayersDialog(mxUtils.bind(this, function()
						{
							this.updateOrigin();
						}));
						
						mxEvent.addListener(layersDialog, 'mouseleave', function()
						{
							layersDialog.parentNode.removeChild(layersDialog);
							layersDialog = null;
						});
						
						var r = layersButton.getBoundingClientRect();

						layersDialog.style.width = '140px';
						layersDialog.style.padding = '2px 0px 2px 0px';
						layersDialog.style.border = '1px solid #d0d0d0';
						layersDialog.style.backgroundColor = '#eee';
						layersDialog.style.fontFamily = GraphViewer.cssFontFamily;
						layersDialog.style.fontSize = '11px';
						layersDialog.style.overflowY = 'auto';
						layersDialog.style.maxHeight = (this.graph.container.clientHeight - this.toolbarHeight - 10) + 'px'
						layersDialog.style.zIndex = this.toolbarZIndex + 1;
						layersDialog.style.color = '#000';
						mxUtils.setOpacity(layersDialog, 85);
						var origin = mxUtils.getDocumentScrollOrigin(document);
						layersDialog.style.left = origin.x + r.left - 1 + 'px';
						layersDialog.style.top = origin.y + r.bottom - 2 + 'px';

						if (this.isDarkMode())
						{
							layersDialog.style.filter = 'invert(93%) hue-rotate(180deg)';
						}

						document.body.appendChild(layersDialog);
					}
				}), Editor.layersImage, mxResources.get('layers') || 'Layers');
				
				model.addListener(mxEvent.CHANGE, function()
				{
					layersButton.style.display = (model.getChildCount(model.root) > 1) ? 'inline-flex' : 'none';
				});
				
				layersButton.style.display = (model.getChildCount(model.root) > 1) ? 'inline-flex' : 'none';
			}
		}
		else if (token == 'tags')
		{
			if (this.tagsEnabled)
			{
				var tagsButton = addButton(mxUtils.bind(this, function(evt)
				{
					if (tagsComponent == null)
					{
						tagsComponent = this.graph.createTagsDialog(mxUtils.bind(this, function()
						{
							return true;
						}));

						this.graph.addListener(mxEvent.REFRESH, mxUtils.bind(this, function()
						{
							this.updateOrigin();
						}));

						tagsComponent.div.getElementsByTagName('div')[0].style.position = '';
						tagsComponent.div.style.maxHeight = '160px';
						tagsComponent.div.style.maxWidth = '120px';
						tagsComponent.div.style.padding = '2px';
						tagsComponent.div.style.overflow = 'auto';
						tagsComponent.div.style.height = 'auto';
						tagsComponent.div.style.position = 'fixed';
						tagsComponent.div.style.fontFamily = GraphViewer.cssFontFamily;
						tagsComponent.div.style.fontSize = '11px';
						tagsComponent.div.style.backgroundColor = '#eee';
						tagsComponent.div.style.color = '#000';
						tagsComponent.div.style.border = '1px solid #d0d0d0';
						tagsComponent.div.style.zIndex = this.toolbarZIndex + 1;
						
						if (this.isDarkMode())
						{
							tagsComponent.div.style.filter = 'invert(93%) hue-rotate(180deg)';
						}

						mxUtils.setOpacity(tagsComponent.div, 85);
					}

					if (tagsDialog != null)
					{
						tagsDialog.parentNode.removeChild(tagsDialog);
						tagsDialog = null;
					}
					else
					{
						tagsDialog = tagsComponent.div;
						tagsDialog.style.position = 'absolute';
						
						mxEvent.addListener(tagsDialog, 'mouseleave', function()
						{
							if (tagsDialog != null)
							{
								tagsDialog.parentNode.removeChild(tagsDialog);
								tagsDialog = null;
							}
						});
						
						var r = tagsButton.getBoundingClientRect();
						var origin = mxUtils.getDocumentScrollOrigin(document);
						tagsDialog.style.left = origin.x + r.left - 1 + 'px';
						tagsDialog.style.top = origin.y + r.bottom - 2 + 'px';
						document.body.appendChild(tagsDialog);
						tagsComponent.refresh();
					}
				}), Editor.tagsImage, mxResources.get('tags') || 'Tags');

				model.addListener(mxEvent.CHANGE, mxUtils.bind(this, function()
				{
					tagsButton.style.display = (this.graph.getAllTags().length > 0) ? 'inline-flex' : 'none';

					if (tagsDialog != null && this.graph.getAllTags().length == 0)
					{
						tagsDialog.parentNode.removeChild(tagsDialog);
						tagsDialog = null;
					}
				}));
				
				tagsButton.style.display = (this.graph.getAllTags().length > 0) ? 'inline-flex' : 'none';
			}
		}
		else if (token == 'lightbox')
		{
			if (this.lightboxEnabled)
			{
				addButton(mxUtils.bind(this, function()
				{
					try
					{
						this.showLightbox();
					}
					catch (e)
					{
						alert(e.message);
					}
				}), Editor.fullscreenImage, (mxResources.get('fullscreen') || 'Fullscreen'));
			}
		}
		else if (this.graphConfig['toolbar-buttons'] != null)
		{
			var def = this.graphConfig['toolbar-buttons'][token];
			
			if (def != null)
			{
				def.elem = addButton((def.enabled == null || def.enabled) ? def.handler : function() {},
					def.image, def.title, def.enabled);
			}
		}
	}
	
	if (this.graph.minimumContainerSize != null)
	{
		this.graph.minimumContainerSize.width = buttonCount * 34;
	}
	
	if (this.graphConfig.title != null)
	{
		var filename = container.ownerDocument.createElement('div');
		filename.style.display = 'inline-flex';
		filename.style.position = 'relative';
		filename.style.alignItems = 'center';
		filename.style.padding = '6px';
		filename.style.fontFamily = GraphViewer.cssFontFamily;
		filename.style.fontSize = '12px';
		filename.style.cursor = 'default';
		filename.style.color = 'light-dark(#000000, #ffffff)';
		filename.setAttribute('title', this.graphConfig.titleTooltip || this.graphConfig.title);
		mxUtils.write(filename, this.graphConfig.title);
		mxUtils.setOpacity(filename, 70);
		
		toolbar.appendChild(filename);
		this.filename = filename;
	}
	
	this.minToolbarWidth = buttonCount * 34;
	var prevBorder = container.style.border;
	
	var enter = mxUtils.bind(this, function()
	{
		toolbar.style.width = (this.graphConfig['toolbar-position'] == 'inline') ? 'auto' :
			Math.max(this.minToolbarWidth, container.offsetWidth) + 'px';
		toolbar.style.border = '1px solid #d0d0d0';

		if (this.graphConfig['toolbar-nohide'] != true)
		{
			var r = container.getBoundingClientRect();
	
			// Uses the body as the origin if it is positioned relative
			var origin = mxUtils.getScrollOrigin(document.body)
			var b = (document.body.style.position === 'relative') ?
				document.body.getBoundingClientRect() :
				{left: -origin.x, top: -origin.y};
			r = {left: r.left - b.left, top: r.top - b.top,
				bottom: r.bottom - b.top, right: r.right - b.left};
			
			toolbar.style.left = r.left + 'px';

			if (this.graphConfig['toolbar-position'] == 'bottom')
			{
				toolbar.style.top = r.bottom - 1 + 'px';
			}
			else
			{
				if (this.graphConfig['toolbar-position'] != 'inline')
				{
					toolbar.style.marginTop = -this.toolbarHeight + 'px';
					toolbar.style.top = r.top + 1 + 'px';
				}
				else
				{
					toolbar.style.top = r.top + 'px';
				}
			}
			
			if (prevBorder == '1px solid transparent')
			{
				container.style.border = '1px solid #d0d0d0';
			}
			
			document.body.appendChild(toolbar);

			var hideToolbar = mxUtils.bind(this, function()
			{
				if (toolbar.parentNode != null)
				{
					toolbar.parentNode.removeChild(toolbar);
				}
				
				if (tagsDialog != null)
				{
					tagsDialog.parentNode.removeChild(tagsDialog);
					tagsDialog = null;
				}

				if (layersDialog != null)
				{
					layersDialog.parentNode.removeChild(layersDialog);
					layersDialog = null;
				}
				
				container.style.border = prevBorder;
			});
			
			mxEvent.addListener(document, 'mousemove', function(evt)
			{
				var source = mxEvent.getSource(evt);
				
				while (source != null)
				{
					if (source == container ||
						source == toolbar ||
						source == layersDialog ||
						source == tagsDialog)
					{
						return;
					}
					
					source = source.parentNode;
				}
				
				hideToolbar();
			});
			
			mxEvent.addListener(document.body, 'mouseleave', function(evt)
			{
				hideToolbar();
			});
		}
		else
		{
			toolbar.style.top = -this.toolbarHeight + 'px';
			container.appendChild(toolbar);
		}
	});
	
	if (this.graphConfig['toolbar-nohide'] != true)
	{
		mxEvent.addListener(container, 'mouseenter', enter);
	}
	else
	{
		enter();
	}
	
	if (this.responsive && typeof ResizeObserver !== 'undefined')
	{
		new ResizeObserver(function()
		{
			if (toolbar.parentNode != null)
			{
				enter();
			}
		}).observe(container)
	}
};

/**
 * Crops the graph or updates the origin for auto-origin after the visible
 * cells have changed.
 */
GraphViewer.prototype.updateOrigin = function()
{
	if (this.autoCrop)
	{
		this.crop();
	}
	else if (this.autoOrigin)
	{
		var bounds = this.graph.getGraphBounds();
		var v = this.graph.view;

		if (bounds.x < 0 || bounds.y < 0)
		{
			this.crop();
			this.graph.originalViewState = this.graph.initialViewState;

			this.graph.initialViewState = {
				translate: v.translate.clone(),
				scale: v.scale
			};
		}
		else if (this.graph.originalViewState != null &&
			bounds.x / v.scale + this.graph.originalViewState.translate.x - v.translate.x > 0 &&
			bounds.y / v.scale + this.graph.originalViewState.translate.y - v.translate.y > 0)
		{
			v.setTranslate(this.graph.originalViewState.translate.x,
				this.graph.originalViewState.translate.y);
			this.graph.originalViewState = null;

			this.graph.initialViewState = {
				translate: v.translate.clone(),
				scale: v.scale
			};
		}
	}
};

/**
 * 
 */
GraphViewer.prototype.createToolbarButton = function(fn, imgSrc, tip, enabled)
{
	var a = document.createElement('div');
	a.style.borderRight = '1px solid #d0d0d0';
	a.style.display = 'inline-flex';
	a.style.alignItems = 'center';
	a.style.padding = '6px';
	
	mxEvent.addListener(a, 'click', fn);

	if (tip != null)
	{
		a.setAttribute('title', tip);
	}
	
	var img = document.createElement('img');
	img.setAttribute('border', '0');
	img.setAttribute('src', imgSrc);
	img.style.width = '18px';
	img.className = 'geAdaptiveAsset';
	
	if (enabled == null || enabled)
	{
		mxEvent.addListener(a, 'mouseenter', function()
		{
			a.style.backgroundColor = 'light-dark(#dddddd,#333333)';
		});
		
		mxEvent.addListener(a, 'mouseleave', function()
		{
			a.style.backgroundColor = 'transparent';
		});

		mxUtils.setOpacity(img, 60);
		a.style.cursor = 'pointer';
	}
	else
	{
		mxUtils.setOpacity(a, 30);
	}
	
	a.appendChild(img);

	return a;
};

GraphViewer.prototype.disableButton = function(token, tooltip)
{
	var def = this.graphConfig['toolbar-buttons']? this.graphConfig['toolbar-buttons'][token] : null;
			
	// Buttons that are defined but not listed in the toolbar have no element
	if (def != null && def.elem != null)
	{
		mxUtils.setOpacity(def.elem, 30);
		mxEvent.removeListener(def.elem, 'click', def.handler);
		//Workaround to stop highlighting the disabled button
		mxEvent.addListener(def.elem, 'mouseenter', function()
		{
			def.elem.style.backgroundColor = '#eee';
		});

		if (tooltip)
		{
			def.elem.setAttribute('title', tooltip);
		}
	}
};

/**
 * Adds event handler for links and lightbox.
 */
GraphViewer.prototype.addClickHandler = function(graph, ui)
{
	graph.linkPolicy = this.graphConfig.target || graph.linkPolicy;

	graph.addClickHandler(this.graphConfig.highlight, mxUtils.bind(this, function(evt, href, associatedCell)
	{
		if (href == null)
		{
			var source = mxEvent.getSource(evt);
			
			while (source != graph.container && source != null && href == null)
			{
				if (source.nodeName.toLowerCase() == 'a')
				{
					href = source.getAttribute('href');
				}
				
				source = source.parentNode;
			}
		}
		
		if (ui != null)
		{
			if (href == null || graph.isCustomLink(href))
			{
				mxEvent.consume(evt);
			}
			else if (!graph.isExternalProtocol(href) &&
					!graph.isBlankLink(href))
			{
				// Hides lightbox if any links are clicked
				// Async handling needed for anchors to work
				window.setTimeout(function()
				{
					ui.destroy();
				}, 0);
			}
		}
		else if (href != null && ui == null && graph.isCustomLink(href) &&
			(mxEvent.isTouchEvent(evt) || !mxEvent.isPopupTrigger(evt)) &&
			graph.customLinkClicked(href, associatedCell))
		{
			// Workaround for text selection in Firefox on Windows
			mxUtils.clearSelection();
			mxEvent.consume(evt);
		}
	}), mxUtils.bind(this, function(evt)
	{
		if (ui == null && this.lightboxClickEnabled &&
			(!mxEvent.isTouchEvent(evt) ||
			this.toolbarItems.length == 0))
		{
			try
			{
				this.showLightbox();
			}
			catch (e)
			{
				alert(e.message);
			}
		}
	}));
};

/**
 * Adds the given array of stencils to avoid dynamic loading of shapes.
 */
GraphViewer.prototype.showLightbox = function(editable, closable, target)
{
	if (this.graphConfig.lightbox == 'open' || window.self !== window.top)
	{
		if (this.lightboxWindow != null && !this.lightboxWindow.closed)
		{
			this.lightboxWindow.focus();
		}
		else
		{
			editable = (editable != null) ? editable :
				((this.graphConfig.editable != null) ?
					this.graphConfig.editable : true);
			closable = (closable != null) ? closable : true;
			target = (target != null) ? target : 'blank';
			
			var param = {'client': 1, 'target': target};
		    
			if (editable)
			{
				param.edit = this.graphConfig.edit || '_blank';
			}
		    
			if (closable)
			{
		    	param.close = 1;
			}

			if (this.layersEnabled)
			{
		    	param.layers = 1;
			}
			
			if (this.tagsEnabled && this.diagrams != null &&
				this.diagrams[this.currentPage] != null)
			{
				// Saves current page's hidden tags before passing to lightbox
				var curPageId = this.diagrams[this.currentPage].getAttribute('id');

				if (this.graphConfig.hiddenTags == null)
				{
					// Null prototype: keyed by page ids from the diagram XML
					this.graphConfig.hiddenTags = Object.create(null);
				}

				this.graphConfig.hiddenTags[curPageId] =
					(this.graph.hiddenTags.length > 0) ? this.graph.hiddenTags.slice() : null;
		    	param.tags = this.graphConfig.hiddenTags;
			}

			if (this.browserTranslate)
			{
				param['browser-translate'] = 1;
			}

			if (this.graphConfig != null && this.graphConfig.nav != false)
			{
				param.nav = 1;
			}

			if (this.graphConfig != null && this.graphConfig.highlight != null)
			{
				param.highlight = this.graphConfig.highlight.substring(1);
			}
			
			if (this.currentPage != null && this.currentPage > 0)
			{
				param.page = this.currentPage;
			}

			if (typeof window.postMessage !== 'undefined' && (document.documentMode == null || document.documentMode >= 10))
			{	
				if (this.lightboxWindow == null)
				{
					mxEvent.addListener(window, 'message', mxUtils.bind(this, function(evt)
					{
						if (evt.data == 'ready' && evt.source == this.lightboxWindow)
						{
							this.lightboxWindow.postMessage(this.xml, '*');
						}
					}));					
				}
			}
			else
			{
				// Data is pulled from global variable after tab loads
				param.data = encodeURIComponent(this.xml);
			}
			
			if (urlParams['dev'] == '1')
			{
				param.dev = '1';
			}
			
		    this.lightboxWindow = window.open(((urlParams['dev'] != '1') ?
		    	EditorUi.lightboxHost : 'https://test.draw.io') +
		    	'/#P' + encodeURIComponent(JSON.stringify(param)));
		}
	}
	else
	{
		this.showLocalLightbox();
	}
};

/**
 * Adds the given array of stencils to avoid dynamic loading of shapes.
 */
GraphViewer.prototype.showLocalLightbox = function(container)
{
	// Capture translation cache from the viewer's graph before
	// creating the lightbox so it can be seeded after content loads
	var btCache = (this.browserTranslate && this.graph != null) ?
		this.graph.getBrowserTranslationCache() : null;

	var backdrop = document.createElement('div');
	backdrop.style.position = 'fixed';
	backdrop.style.top = '0';
	backdrop.style.left = '0';
	backdrop.style.bottom = '0';
	backdrop.style.right = '0';
	backdrop.style.zIndex = this.lightboxZIndex;
	backdrop.style.backgroundColor = '#000000';
	mxUtils.setOpacity(backdrop, 70);
	
	document.body.appendChild(backdrop);
	
	var closeImg = document.createElement('img');
	closeImg.setAttribute('border', '0');
	closeImg.setAttribute('src', Editor.closeBlackImage);
	closeImg.style.position = 'fixed';
	closeImg.style.top = '32px';
	closeImg.style.right = '32px';
	closeImg.style.cursor = 'pointer';
	closeImg.className = 'geAdaptiveAsset';
	
	var updateDarkMode = mxUtils.bind(this,	function()
	{
		ui.setDarkMode(this.isDarkMode());
	});

	mxEvent.addListener(closeImg, 'click', mxUtils.bind(this, function()
	{
		this.removeListener('darkModeChanged', updateDarkMode);
		ui.destroy();
	}));
	
	// LATER: Make possible to assign after instance was created
	urlParams['pages'] = '1';
	urlParams['page'] = this.currentPage;
	urlParams['page-id'] = this.graphConfig.pageId;
	urlParams['layer-ids'] = (this.graphConfig.layerIds != null && this.graphConfig.layerIds.length > 0)
														? this.graphConfig.layerIds.join(' ') : null;
	urlParams['nav'] = (this.graphConfig.nav != false) ? '1' : '0';
	urlParams['layers'] = (this.layersEnabled) ? '1' : '0';
	urlParams['dark'] = (this.isDarkMode()) ? '1' : '0';

	if (this.tagsEnabled)
	{
		if (this.diagrams != null && this.diagrams[this.currentPage] != null)
		{
			// Saves current page's hidden tags before passing to lightbox
			var curPageId = this.diagrams[this.currentPage].getAttribute('id');

			if (this.graphConfig.hiddenTags == null)
			{
				// Null prototype: keyed by page ids from the diagram XML
				this.graphConfig.hiddenTags = Object.create(null);
			}

			this.graphConfig.hiddenTags[curPageId] =
				(this.graph.hiddenTags.length > 0) ? this.graph.hiddenTags.slice() : null;
		}

		// Always passed as it also adds the tags button to the lightbox toolbar,
		// eg. for viewers without a diagram such as the Confluence Cloud lightbox
		urlParams['tags'] = JSON.stringify((this.graphConfig.hiddenTags != null) ?
			this.graphConfig.hiddenTags : {});
	}

	if (container != null)
	{
		try
		{
			var toolbarConfig = JSON.parse(decodeURIComponent(urlParams['toolbar-config'] || '{}'));
			toolbarConfig.noCloseBtn = true;
			urlParams['toolbar-config'] = encodeURIComponent(JSON.stringify(toolbarConfig));
		}
		catch (e) {}
	}

	// PostMessage not working and Permission denied for opened access in IE9-
	if (document.documentMode == null || document.documentMode >= 10)
	{
		Editor.prototype.editButtonLink = this.graphConfig.edit;
		Editor.prototype.editButtonFunc = this.graphConfig.editFunc;
	}
	
	EditorUi.prototype.updateActionStates = function() {};
	EditorUi.prototype.addBeforeUnloadListener = function() {};
	EditorUi.prototype.addChromelessClickHandler = function() {};

	// Starts loading the UI language for the dialogs of the lightbox
	GraphViewer.loadLanguageResources();

	var ui = new EditorUi(new Editor(true), document.createElement('div'), true);
	this.addListener('darkModeChanged', updateDarkMode);
	ui.editor.editBlankUrl = this.editBlankUrl;

	// Waits for the UI language before showing the print dialog
	var uiShowPrintDialog = ui.showPrintDialog;

	ui.showPrintDialog = function()
	{
		var args = arguments;

		GraphViewer.loadLanguageResources(function()
		{
			// Ignores lightboxes closed while loading
			if (ui.editor != null)
			{
				uiShowPrintDialog.apply(ui, args);
			}
		});
	};

	// Disables refresh
	ui.refresh = function() {};

	// The lightbox runs in the host page document, so page switches must not
	// update the URL (location.replace('#') scrolls the host page to the top)
	// or overwrite the host page title
	ui.updateHashObject = function() {};
	ui.updateDocumentTitle = function() {};
	
	// Handles escape keystroke
	var keydownHandler = mxUtils.bind(this, function(evt)
	{
		if (evt.keyCode == 27 /* Escape */)
		{
			ui.destroy();
		}
	});

	var overflow = this.initialOverflow;
	var destroy = ui.destroy;
	
	ui.destroy = function()
	{
		if (container == null)
		{
			mxEvent.removeListener(document.documentElement, 'keydown', keydownHandler);
			document.body.removeChild(backdrop);
			document.body.removeChild(closeImg);
			document.body.style.overflow = overflow;
			GraphViewer.resizeSensorEnabled = true;
			
			destroy.apply(this, arguments);
		}
	};
	
	var graph = ui.editor.graph;

	if (this.browserTranslate)
	{
		graph.waitForBrowserTranslate();
	}

	var lightbox = graph.container;
	lightbox.style.overflow = 'hidden';
	lightbox.style.inset = '0';

	if (this.lightboxChrome && container == null)
	{
		lightbox.style.border = '1px solid #c0c0c0';
		lightbox.style.margin = '40px';

		// Installs the keystroke listener in the target
		mxEvent.addListener(document.documentElement, 'keydown', keydownHandler);
	}
	else
	{
		backdrop.style.display = 'none';
		closeImg.style.display = 'none';
	}
	
	// Handles relative images
	var self = this;
	
	graph.getImageFromBundles = function(key)
	{
		return self.getImageUrl(key);
	};
	
	// Handles relative images in print output and temporary graphs
	var uiCreateTemporaryGraph = ui.createTemporaryGraph;
	
	ui.createTemporaryGraph = function()
	{
		var newGraph = uiCreateTemporaryGraph.apply(this, arguments);
		
		newGraph.getImageFromBundles = function(key)
		{
			return self.getImageUrl(key);
		};
	
		return newGraph;
	};
	
	if (this.graphConfig.move)
	{
		graph.isMoveCellsEvent = function(evt)
		{
			return true;
		};
	}
	
	mxUtils.setPrefixedStyle(lightbox.style, 'border-radius', '4px');
	lightbox.style.position = 'fixed';
	
	GraphViewer.resizeSensorEnabled = false;
	document.body.style.overflow = 'hidden';
	this.addClickHandler(graph, ui);

	window.setTimeout(mxUtils.bind(this, function()
	{
		try
		{
			// Click on backdrop closes lightbox
			mxEvent.addListener(backdrop, 'click', function()
			{
				ui.destroy();
			});

			// Disables focus border in Chrome
			lightbox.style.outline = 'none';
			lightbox.style.zIndex = this.lightboxZIndex;
			closeImg.style.zIndex = this.lightboxZIndex;

			if (container != null)
			{
				container.innerHTML = '';
				container.appendChild(lightbox);
			}
			else
			{
				document.body.appendChild(lightbox);
				document.body.appendChild(closeImg);
			}
			
			// Hides the tags of each page before it is rendered so that
			// lightboxFit fits the visible cells
			if (this.tagsEnabled && this.graphConfig.hiddenTags != null)
			{
				var hiddenTags = this.graphConfig.hiddenTags;

				ui.getHiddenTagsForPage = function(page)
				{
					// Own properties only as page IDs come from the diagram
					var pageTags = (Object.prototype.hasOwnProperty.call(hiddenTags,
						page.getId())) ? hiddenTags[page.getId()] : null;

					return (pageTags != null && pageTags.length > 0) ? pageTags : [];
				};
			}

			ui.setFileData(this.xml);

			mxUtils.setPrefixedStyle(lightbox.style, 'transform', 'rotateY(0deg)');
			ui.chromelessToolbar.style.bottom = 60 + 'px';
			ui.chromelessToolbar.style.zIndex = this.lightboxZIndex;

			// Workaround for clipping in IE11-
			(container || document.body).appendChild(ui.chromelessToolbar);

			ui.getEditBlankXml = mxUtils.bind(this, function()
			{
				return this.xml;
			});

			this.showLayers(graph, this.graph);
			ui.lightboxFit();
			ui.chromelessResize();

			// Applies cached translations from the viewer's graph
			if (btCache != null)
			{
				graph.applyBrowserTranslationCache(btCache);
			}
		}
		catch (e)
		{
			ui.handleError(e, null, function()
			{
				ui.destroy();
			});
		}
	}), 0);

	return ui;
};

/**
 * Removes the dialog from the DOM.
 */
Dialog.prototype.getDocumentSize = function()
{
	var vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0)
	var vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0)

	return new mxRectangle(0, 0, vw, vh);
};

/**
 * 
 */
GraphViewer.prototype.updateTitle = function(title, titleTooltip)
{
	title = title || '';
	
	if (this.showTitleAsTooltip && this.graph != null && this.graph.container != null)
	{
		this.graph.container.setAttribute('title', titleTooltip || title);
    }
	
	if (this.filename != null)
	{
		this.filename.innerText = '';
		mxUtils.write(this.filename, title);
		this.filename.setAttribute('title', titleTooltip || title);
	}
};

/**
 * 
 */
GraphViewer.processElements = function(classname)
{
	mxUtils.forEach(GraphViewer.getElementsByClassName(classname || 'mxgraph'), function(div)
	{
		try
		{
			div.innerText = '';
			GraphViewer.createViewerForElement(div);
		}
		catch (e)
		{
			div.innerText = e.message;
			
			if (window.console != null)
			{
				console.error(e);
			}
		}
	});
};

/**
 * Adds the given array of stencils to avoid dynamic loading of shapes.
 */
GraphViewer.getElementsByClassName = function(classname)
{
	if (document.getElementsByClassName)
	{
		var divs = document.getElementsByClassName(classname);
		
		// Workaround for changing divs while processing
		var result = [];
		
		for (var i = 0; i < divs.length; i++)
		{
			result.push(divs[i]);
		}
		
		return result;
	}
	else
	{
		var tmp = document.getElementsByTagName('*');
		var divs = [];
	
		for (var i = 0; i < tmp.length; i++)
		{
			var cls = tmp[i].className;

			if (cls != null && cls.length > 0)
			{
				var tokens = cls.split(' ');
				
				if (mxUtils.indexOf(tokens, classname) >= 0)
				{
					divs.push(tmp[i]);
				}
			}
		}

		return divs;
	}
};

/**
 * Adds the given array of stencils to avoid dynamic loading of shapes.
 */
GraphViewer.createViewerForElement = function(element, callback)
{
	var data = element.getAttribute('data-mxgraph');
	
	if (data != null)
	{
		var config = JSON.parse(data);
		
		var createViewer = function(xml)
		{
			var xmlDoc = mxUtils.parseXml(xml);
			var viewer = new GraphViewer(element, xmlDoc.documentElement, config);
			
			if (callback != null)
			{
				callback(viewer);
			}
		};

		if (config.url != null)
		{
			GraphViewer.getUrl(config.url, function(xml)
			{
				createViewer(xml);
			});
		}
		else
		{
			createViewer(config.xml);
		}
	}
};

/**
 *
 */
GraphViewer.blockedAncestorFrames = function()
{
	try
	{
		if (window.location.ancestorOrigins && window.location.hostname &&
				window.location.ancestorOrigins.length && window.location.ancestorOrigins.length > 0)
		{
			var hostname = window.location.hostname;

			if (hostname && hostname.length > 1 && hostname.charAt(hostname.length - 1) == '/')
			{
				hostname = hostname.substring(0, hostname.length - 1)
			}

			var message = '';

			for (var i = 0; i < window.location.ancestorOrigins.length; i++)
			{
				message += ' -> ' + window.location.ancestorOrigins[i];

				// Running commercial, competing services using our infrastructure isn't allowed.
				if (message.endsWith('dan6v7pm1f1a1.cloudfront.net') || message.endsWith('confluence-cloud-excalidraw-ll3likebca-uc.a.run.app'))
				{
					return true;
				}
			}

			if ((hostname.endsWith('ac.draw.io') || hostname.endsWith('aj.draw.io')) && window.location.ancestorOrigins.length == 1 &&
					window.location.ancestorOrigins[0] && window.location.ancestorOrigins[0].endsWith('.atlassian.net'))
			{
				// do not log *.draw.io domains embedded directly into atlassian.net
			}
			// else if (window.location.ancestorOrigins.length > 0)
			// {
			// 	var img = new Image();
			// 	img.src = 'https://log.diagrams.net/images/1x1.png?src=ViewerAncestorFrames' +
			// 		((typeof window.EditorUi !== 'undefined') ? '&v=' + encodeURIComponent(EditorUi.VERSION) : '') +
			// 		'&data=' + encodeURIComponent(message);
			// }
		}
	}
	catch (e)
	{
		// ignore
	}

	return false;
};

/**
 * Default dark background color.
 */
GraphViewer.darkBackgroundColor = Editor.darkColor;

/**
 * Default CSS font family.
 */
GraphViewer.cssFontFamily = Editor.defaultHtmlFont;

/**
 * Dark Colors
 */
GraphViewer.shapeBackgroundColor = null;

/**
 * Invoked when the given viewer was initialized.
 */
GraphViewer.viewerInitialized = function(graphViewer)
{
	// Hook for subclassers
};

/**
 * Adds event if grid size is changed.
 */
GraphViewer.initCss = function()
{
	try
	{
		if (GraphViewer.styleElement == null)
		{
			GraphViewer.styleElement = document.createElement('style')
			GraphViewer.styleElement.setAttribute('type', 'text/css');
			GraphViewer.styleElement.innerHTML = GraphViewer.getCss();
			
			if (!GraphViewer.blockedAncestorFrames())
			{
				document.getElementsByTagName('head')[0].appendChild(GraphViewer.styleElement);
			}
		}
	}
	catch (e)
	{
		// ignore
	}
};

/**
 * Redirects editing to absolue URLs.
 */
GraphViewer.getCss = function()
{
	return [
		'.geDarkMode img {',
		'    filter: invert(1);',
		'}',
		'div.mxTooltip {',
		'    box-shadow: 3px 3px 12px light-dark(#c0c0c0, transparent);',
		'    background: light-dark(#ffffcc, ' + GraphViewer.darkBackgroundColor + ');',
		'    border-style: solid;',
		'    border-width: 1px;',
		'    border-color: light-dark(#000000, #565656);',
		'    font-family: ' + GraphViewer.cssFontFamily + ';',
		'    font-size: 8pt;',
		'    position: absolute;',
		'    cursor: default;',
		'    padding: 4px;',
		'    color: light-dark(#000000, #c0c0c0);',
		'}',
		'td.mxPopupMenuIcon div {',
		'    width: 16px;',
		'    height: 16px;',
		'}',
		'div.mxPopupMenu {',
		'    box-shadow: 2px 2px 3px light-dark(#d5d5d5, transparent);',
		'    background: white;',
		'    position: absolute;',
		'    border: 3px solid #e7e7e7;',
		'    padding: 3px;',
		'}',
		'table.mxPopupMenu {',
		'    border-collapse: collapse;',
		'    margin: 0px;',
		'}',
		'td.mxPopupMenuItem {',
		'    padding: 7px 30px;',
		'    font-family: ' + GraphViewer.cssFontFamily + ';',
		'    font-size: 10pt;',
		'}',
		'td.mxPopupMenuIcon {',
		'    background-color: light-dark(#ffffff, ' + GraphViewer.darkBackgroundColor + ');',
		'    padding: 0px;',
		'}',
		'tr.mxPopupMenuItemHover {',
		'    background-color: #eeeeee;',
		'    color: black;',
		'}',
		'table.mxPopupMenu hr {',
		'    color: #cccccc;',
		'    background-color: #cccccc;',
		'    border: none;',
		'    height: 1px;',
		'}',
		'table.mxPopupMenu tr {',
		'    font-size: 4pt;',
		'}',
		// Modified to only apply to the print dialog
		'.geDialog, .geDialog table {',
		'    font-family: ' + GraphViewer.cssFontFamily + ';',
		'    font-size: 10pt;',
		'    border: none;',
		'    margin: 0px;',
		'}',
		// These are required for the print dialog
		'.geDialog {',
		'    position: fixed;',
		'    background: light-dark(#ffffff, ' + GraphViewer.darkBackgroundColor + ');',
		'	 color: light-dark(#3f3f3f, #c0c0c0);',
		'    box-shadow: 0px 0px 2px 2px light-dark(#d5d5d5, transparent);',
		'    border: 1px solid light-dark(#dadada, #565656);',
		'    overflow: hidden;',
		'    padding: 30px;',
		'    left: 50%;',
		'    top: 50%;',
		'    max-height: 100%;',
		'    max-width: 100%;',
		'	 box-sizing: border-box;',
		'    transform: translate(-50%, -50%);',
		'	 z-index: ' + (GraphViewer.prototype.lightboxZIndex + 2) + ';',
		'}',
		'.geBackground {',
		'    background-color: light-dark(#ffffff, ' + GraphViewer.darkBackgroundColor + ');',
		'	 position: fixed;',
		'    left: 0px;',
		'    top: 0px;',
		'    right: 0px;',
		'    bottom: 0px;',
		'    opacity: 0.9;', 
		'	 z-index: ' + (GraphViewer.prototype.lightboxZIndex + 1) + ';',
		'}',
		'.geDialogTitle {',
		'    box-sizing: border-box;',
		'    white-space: nowrap;',
		'    background: light-dark(#f1f3f4, ' + GraphViewer.darkBackgroundColor + ');',
		'    border-bottom: 1px solid rgb(192, 192, 192);',
		'    font-size: 15px;',
		'    font-weight: bold;',
		'    text-align: center;',
		'    color: rgb(35, 86, 149);',
		'}',
		'.geDialogFooter {',
		'    background: light-dark(#f1f3f4, ' + GraphViewer.darkBackgroundColor + ');',
		'    white-space: nowrap;',
		'    text-align: right;',
		'    box-sizing: border-box;',
		'    border-top: 1px solid #e5e5e5;',
		'    color: darkGray;',
		'}',
		'.geHelpIcon {',
		'    width: 16px;',
		'    margin: 0 4px;',
		'    vertical-align: text-bottom;',
		'}',
		'.geBtn, .mxWindow .geBtn {',
		'    background-color: light-dark(#eeeeee, #1b1d1e);',
		'    border: 1px solid light-dark(#d8d8d8, #333333);',
		'    color: light-dark(#3f3f3f, #c0c0c0);',
		'    font-size: 13px;',
		'    font-weight: 500;',
		'    border-radius: 4px;',
		'    height: 30px;',
		'    margin: 0 0 0 8px;',
		'    min-width: 72px;',
		'    outline: 0;',
		'    padding: 0 8px;',
		'    text-overflow: ellipsis;',
		'    white-space: nowrap;',
		'    overflow: hidden;',
		'}',
		'.geBtn:hover:not(.gePrimaryBtn), .geBtn:focus {',
		'    border: 1px solid light-dark(#c6c6c6, #333333);',
		'    background: light-dark(#dadada, #333333);',
		'}',
		'.geBtn:disabled {',
		'    opacity: .5;',
		'}',
		'.gePrimaryBtn {',
		'    background: linear-gradient(light-dark(#4d90fe, #003555) 0px, light-dark(#4787ed, #003555) 100%);',
		'    border: 1px solid light-dark(#3079ed, transparent);',
		'    color: light-dark(#ffffff, #c0c0c0);',
		'}',
		'.gePrimaryBtn:hover:not([disabled]) {',
		'    background: linear-gradient(light-dark(#4d90fe, #004a77) 0px, light-dark(#357ae8, #004a77) 100%);',
		'    border: 1px solid light-dark(#2f5bb7, transparent);',
		'}',
		'.geBtn:disabled {',
		'    opacity: .5;',
		'}'
	].join('\n');
};

/**
 * Lookup for URLs.
 */
GraphViewer.cachedUrls = {};

/**
 * Workaround for unsupported CORS in IE9 XHR
 */
GraphViewer.getUrl = function(url, onload, onerror)
{
	if (GraphViewer.cachedUrls[url] != null)
	{
		onload(GraphViewer.cachedUrls[url]);
	}
	else
	{
		var xhr = (navigator.userAgent != null && navigator.userAgent.indexOf('MSIE 9') > 0) ?
			new XDomainRequest() : new XMLHttpRequest();
		xhr.open('GET', url);
		
	    xhr.onload = function()
	    {
	    	onload((xhr.getText != null) ? xhr.getText() : xhr.responseText);
		};
		
	    xhr.onerror = onerror;
	    xhr.send();
	}
};

/**
 * State of the UI language resources: null (not requested), an array of
 * pending callbacks (loading) or true (done or not needed).
 */
GraphViewer.languageResources = null;

/**
 * Returns the language of the lightbox UI or null for the default language.
 * Uses the language of the app (lang URL parameter, stored setting or
 * browser language on known hosts) or the browser language.
 */
GraphViewer.getLanguage = function()
{
	var lang = (window.mxLanguage != null) ? mxLanguage : mxClient.language;

	if (lang != null)
	{
		lang = String(lang).toLowerCase();

		// Uses base language for unsupported regional variants
		if (mxClient.languages != null && mxUtils.indexOf(mxClient.languages, lang) < 0)
		{
			var dash = lang.indexOf('-');

			if (dash > 0)
			{
				lang = lang.substring(0, dash);
			}
		}

		// Language is used in the resource URL
		if (!/^[a-z0-9\-]+$/.test(lang) || lang == mxClient.defaultLanguage ||
			(mxClient.languages != null && mxUtils.indexOf(mxClient.languages, lang) < 0))
		{
			lang = null;
		}
	}

	return lang;
};

/**
 * Returns the base URL of the UI language resources. The viewer bundles
 * point STYLE_PATH to the viewer host while the default RESOURCES_PATH is
 * relative to the host page so the resources next to STYLE_PATH are used.
 */
GraphViewer.getResourceBase = function()
{
	var base = window.RESOURCE_BASE;

	if (window.RESOURCES_PATH == 'resources' && base == 'resources/dia' &&
		window.STYLE_PATH != null && /(^|\/)styles$/.test(STYLE_PATH))
	{
		base = STYLE_PATH.substring(0, STYLE_PATH.length - 6) + 'resources/dia';
	}

	return base;
};

/**
 * Loads the UI language resources once and invokes the optional callback.
 * The viewer bundles contain the English resources only. Errors (eg. no
 * CORS for the resources) are ignored and the English resources are used.
 */
GraphViewer.loadLanguageResources = function(fn)
{
	if (GraphViewer.languageResources == null)
	{
		var lang = GraphViewer.getLanguage();
		var base = GraphViewer.getResourceBase();

		if (lang != null && base != null)
		{
			var pending = [];
			GraphViewer.languageResources = pending;

			var done = function()
			{
				GraphViewer.languageResources = true;

				for (var i = 0; i < pending.length; i++)
				{
					try
					{
						pending[i]();
					}
					catch (e)
					{
						if (window.console != null)
						{
							console.error(e);
						}
					}
				}
			};

			try
			{
				mxUtils.get(base + '_' + lang + mxResources.extension, function(req)
				{
					try
					{
						if (req.getStatus() >= 200 && req.getStatus() <= 299)
						{
							mxResources.parse(req.getText());
						}
					}
					catch (e)
					{
						// ignore
					}

					done();
				}, done);
			}
			catch (e)
			{
				done();
			}
		}
		else
		{
			GraphViewer.languageResources = true;
		}
	}

	if (fn != null)
	{
		if (GraphViewer.languageResources === true)
		{
			fn();
		}
		else
		{
			GraphViewer.languageResources.push(fn);
		}
	}
};

/**
 * Specifies if the listeners for resizing the container are called (see
 * addResizeListener). This is false while the local lightbox is shown.
 * Default is true.
 */
GraphViewer.resizeSensorEnabled = true;

/**
 * Specifies if the viewer handles resizing the container (see
 * addResizeListener). Default is true.
 */
GraphViewer.useResizeSensor = true;

/**
 * Calls the given function in the frame after the size of the given element
 * has changed if resizeSensorEnabled is true. Changes are combined for each
 * frame, which follows a resize and allows the function to change the size
 * of the element without a loop of resize notifications. Uses the resize
 * event of the window if ResizeObserver is not supported.
 */
GraphViewer.addResizeListener = function(element, fn)
{
	var frame = null;

	var callback = function()
	{
		if (frame == null)
		{
			frame = window.requestAnimationFrame(function()
			{
				frame = null;

				if (GraphViewer.resizeSensorEnabled)
				{
					fn();
				}
			});
		}
	};

	if (typeof ResizeObserver !== 'undefined')
	{
		new ResizeObserver(callback).observe(element);
	}
	else
	{
		mxEvent.addListener(window, 'resize', callback);
	}
};
