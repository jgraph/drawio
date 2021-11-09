/**
 * Copyright (c) 2006-2016, JGraph Ltd
 * Copyright (c) 2006-2016, Gaudenz Alder
 */
/**
 * Constructs a new point for the optional x and y coordinates. If no
 * coordinates are given, then the default values for <x> and <y> are used.
 * @constructor
 * @class Implements a basic 2D point. Known subclassers = {@link mxRectangle}.
 * @param {number} x X-coordinate of the point.
 * @param {number} y Y-coordinate of the point.
 */
/**
 * Global types
 */
function DiagramPage(node, id)
{
	this.node = node;

	if (id != null)
	{
		this.node.setAttribute('id', id);
	}
	else if (this.getId() == null)
	{
		this.node.setAttribute('id', Editor.guid());
	}
};

/**
 * Holds the diagram node for the page.
 */
DiagramPage.prototype.node = null;

/**
 * Holds the root cell for the page.
 */
DiagramPage.prototype.root = null;

/**
 * Holds the view state for the page.
 */
DiagramPage.prototype.viewState = null;

/**
 * 
 */
DiagramPage.prototype.getId = function()
{
	return this.node.getAttribute('id');
};

/**
 * 
 */
DiagramPage.prototype.getName = function()
{
	return this.node.getAttribute('name');
};

/**
 * 
 */
DiagramPage.prototype.setName = function(value)
{
	if (value == null)
	{
		this.node.removeAttribute('name');
	}
	else
	{
		this.node.setAttribute('name', value);
	}
};

/**
 * Change types
 */
function RenamePage(ui, page, name)
{
	this.ui = ui;
	this.page = page;
	this.name = name;
	this.previous = name;
}

/**
 * Implementation of the undoable page rename.
 */
RenamePage.prototype.execute = function()
{
	var tmp = this.page.getName();
	this.page.setName(this.previous);
	this.name = this.previous;
	this.previous = tmp;
	
	// Required to update page name in placeholders
	this.ui.editor.graph.updatePlaceholders();
	this.ui.editor.fireEvent(new mxEventObject('pageRenamed'));
};

/**
 * Undoable change of page title.
 */
function MovePage(ui, oldIndex, newIndex)
{
	this.ui = ui;
	this.oldIndex = oldIndex;
	this.newIndex = newIndex;
}

/**
 * Implementation of the undoable page rename.
 */
MovePage.prototype.execute = function()
{
	this.ui.pages.splice(this.newIndex, 0, this.ui.pages.splice(this.oldIndex, 1)[0]);
	var tmp = this.oldIndex;
	this.oldIndex = this.newIndex;
	this.newIndex = tmp;
	
	// Required to update page numbers in placeholders
	this.ui.editor.graph.updatePlaceholders();
	this.ui.editor.fireEvent(new mxEventObject('pageMoved'));
};

/**
 * Class: mxCurrentRootChange
 *
 * Action to change the current root in a view.
 *
 * Constructor: mxCurrentRootChange
 *
 * Constructs a change of the current root in the given view.
 */
function SelectPage(ui, page, viewState)
{
	this.ui = ui;
	this.page = page;
	this.previousPage = page;
	this.neverShown = true;
	
	if (page != null)
	{
		this.neverShown = page.viewState == null;
		this.ui.updatePageRoot(page);
		
		if (viewState != null)
		{
			page.viewState = viewState;
			this.neverShown = false;
		}
	}
};

/**
 * Executes selection of a new page.
 */
SelectPage.prototype.execute = function()
{
	var prevIndex = mxUtils.indexOf(this.ui.pages, this.previousPage);
	
	if (this.page != null && prevIndex >= 0)
	{
		var page = this.ui.currentPage;
		var editor = this.ui.editor;
		var graph = editor.graph;
		
		// Stores current diagram state in the page
		var data = Graph.compressNode(editor.getGraphXml(true));
		mxUtils.setTextContent(page.node, data);
		page.viewState = graph.getViewState();
		page.root = graph.model.root;
		
		if (page.model != null)
		{
			// Updates internal structures of offpage model
			page.model.rootChanged(page.root);
		}
		
		// Transitions for switching pages
//		var curIndex = mxUtils.indexOf(this.ui.pages, page);
//		mxUtils.setPrefixedStyle(graph.view.canvas.style, 'transition', null);
//		mxUtils.setPrefixedStyle(graph.view.canvas.style, 'transform',
//			(curIndex > prevIndex) ? 'translate(-50%,0)' : 'translate(50%,0)');
		
		// Removes the previous cells and clears selection
		graph.view.clear(page.root, true);
		graph.clearSelection();
			
		// Switches the current page
		this.ui.currentPage = this.previousPage;
		this.previousPage = page;
		page = this.ui.currentPage;
	
		// Switches the root cell and sets the view state
		graph.model.prefix = Editor.guid() + '-';
		graph.model.rootChanged(page.root);
		graph.setViewState(page.viewState);

		// Handles grid state in chromeless mode which is stored in Editor instance
		graph.gridEnabled = graph.gridEnabled && (!this.ui.editor.isChromelessView() ||
			urlParams['grid'] == '1');

		// Updates the display
		editor.updateGraphComponents();
		graph.view.validate();
		graph.blockMathRender = true;
		graph.sizeDidChange();
		graph.blockMathRender = false;
		
//		mxUtils.setPrefixedStyle(graph.view.canvas.style, 'transition', 'transform 0.2s');
//		mxUtils.setPrefixedStyle(graph.view.canvas.style, 'transform', 'translate(0,0)');
		
		if (this.neverShown)
		{
			this.neverShown = false;
			graph.selectUnlockedLayer();
		}
		
		// Fires events
		editor.graph.fireEvent(new mxEventObject(mxEvent.ROOT));
		editor.fireEvent(new mxEventObject('pageSelected', 'change', this));
	}
};

/**
 * 
 */
function ChangePage(ui, page, select, index, noSelect)
{
	SelectPage.call(this, ui, select);
	this.relatedPage = page;
	this.index = index;
	this.previousIndex = null;
	this.noSelect = noSelect;
};

mxUtils.extend(ChangePage, SelectPage);

/**
 * Function: execute
 *
 * Changes the current root of the view.
 */
ChangePage.prototype.execute = function()
{
	// Fires event to setting view state from realtime
	this.ui.editor.fireEvent(new mxEventObject('beforePageChange', 'change', this));
	this.previousIndex = this.index;
	
	if (this.index == null)
	{
		var tmp = mxUtils.indexOf(this.ui.pages, this.relatedPage);
		this.ui.pages.splice(tmp, 1);
		this.index = tmp;
	}
	else
	{
		this.ui.pages.splice(this.index, 0, this.relatedPage);
		this.index = null;
	}
	
	if (!this.noSelect)
	{
		SelectPage.prototype.execute.apply(this, arguments);
	}
};

/**
 * Specifies the height of the tab container. Default is 38.
 */
EditorUi.prototype.tabContainerHeight = 38;

/**
 * Returns the index of the selected page.
 */
EditorUi.prototype.getSelectedPageIndex = function()
{
	return this.getPageIndex(this.currentPage);
};

/**
 * Returns the index of the given page.
 */
 EditorUi.prototype.getPageIndex = function(page)
 {
	 var result = null;
	 
	 if (this.pages != null && page != null)
	 {
		 for (var i = 0; i < this.pages.length; i++)
		 {
			 if (this.pages[i] == page)
			 {
				 result = i;
				 
				 break;
			 }
		 }
	 }
	 
	 return result;
 };
 
/**
 * Returns true if the given string contains an mxfile.
 */
EditorUi.prototype.getPageById = function(id)
{
	if (this.pages != null)
	{
		for (var i = 0; i < this.pages.length; i++)
		{
			if (this.pages[i].getId() == id)
			{
				return this.pages[i];
			}
		}
	}
	
	return null;
};

/**
 * Returns the background image for the given page link.
 */
EditorUi.prototype.createImageForPageLink = function(src, sourcePage, sourceGraph)
{
	var comma = src.indexOf(',');
	var result = null;
		
	if (comma > 0)
	{
		var page = this.getPageById(src.substring(comma + 1));

		if (page != null && page != sourcePage)
		{
			result = this.getImageForPage(page, sourcePage, sourceGraph);
			result.originalSrc = src;
		}
	}

	if (result == null)
	{
		result = {originalSrc: src};
	}

	return result;
};

/**
 * Returns true if the given string contains an mxfile.
 */
EditorUi.prototype.getImageForPage = function(page, sourcePage, sourceGraph)
{
	sourceGraph = (sourceGraph != null) ? sourceGraph : this.editor.graph;
	var graphGetGlobalVariable = sourceGraph.getGlobalVariable;
	var graph = this.createTemporaryGraph(sourceGraph.getStylesheet());
	graph.defaultPageBackgroundColor = sourceGraph.defaultPageBackgroundColor;
	graph.shapeBackgroundColor = sourceGraph.shapeBackgroundColor;
	graph.shapeForegroundColor = sourceGraph.shapeForegroundColor;
	var index = this.getPageIndex((sourcePage != null) ?
		sourcePage : this.currentPage);

	graph.getGlobalVariable = function(name)
	{
		if (name == 'pagenumber')
		{
			return index + 1;
		}
		else if (name == 'page' && sourcePage != null)
		{
			return sourcePage.getName();
		}
		else
		{
			return graphGetGlobalVariable.apply(this, arguments);
		}
	};

	document.body.appendChild(graph.container);

	this.updatePageRoot(page);
	graph.model.setRoot(page.root);
	var svgRoot = graph.getSvg(null, null, null, null, null,
		null, null, null, null, null, null, true);
	var bounds = graph.getGraphBounds();
	document.body.removeChild(graph.container);

	return new mxImage(Editor.createSvgDataUri(mxUtils.getXml(svgRoot)),
		bounds.width, bounds.height, bounds.x, bounds.y);
};

/**
 * Returns true if the given string contains an mxfile.
 */
EditorUi.prototype.initPages = function()
{
	if (!this.editor.graph.standalone)
	{
		this.actions.addAction('previousPage', mxUtils.bind(this, function()
		{
			this.selectNextPage(false);
		}));
		
		this.actions.addAction('nextPage', mxUtils.bind(this, function()
		{
			this.selectNextPage(true);
		}));

		if (this.isPagesEnabled())
		{
			this.keyHandler.bindAction(33, true, 'previousPage', true); // Ctrl+Shift+PageUp
			this.keyHandler.bindAction(34, true, 'nextPage', true); // Ctrl+Shift+PageDown
		}
			
		// Updates the tabs after loading the diagram
		var graph = this.editor.graph;
		var graphViewValidateBackground = graph.view.validateBackground; 
		
		graph.view.validateBackground = mxUtils.bind(this, function()
		{
			if (this.tabContainer != null)
			{
				var prevHeight = this.tabContainer.style.height;
				
				if (this.fileNode == null || this.pages == null ||
					(this.pages.length == 1 && urlParams['pages'] == '0'))
				{
					this.tabContainer.style.height = '0px';
				}
				else
				{
					this.tabContainer.style.height = this.tabContainerHeight + 'px';
				}
				
				if (prevHeight != this.tabContainer.style.height)
				{
					this.refresh(false);
				}
			}
			
			graphViewValidateBackground.apply(graph.view, arguments);
		});
	
		var lastPage = null;
		
		var updateTabs = mxUtils.bind(this, function()
		{
			this.updateTabContainer();
			
			// Updates scrollbar positions and backgrounds after validation	
			var p = this.currentPage;
			
			if (p != null && p != lastPage)
			{
				if (p.viewState == null || p.viewState.scrollLeft == null)
				{
					this.resetScrollbars();
	
					if (graph.isLightboxView())
					{
						this.lightboxFit();
					}
					
					if (this.chromelessResize != null)
					{
						graph.container.scrollLeft = 0;
						graph.container.scrollTop = 0;
						this.chromelessResize();
					}
				}
				else
				{
					graph.container.scrollLeft = graph.view.translate.x * graph.view.scale + p.viewState.scrollLeft;
					graph.container.scrollTop = graph.view.translate.y * graph.view.scale + p.viewState.scrollTop;
				}
				
				lastPage = p;
			}
			
			// Updates layers window
			if (this.actions.layersWindow != null)
			{
				this.actions.layersWindow.refreshLayers();
			}
			
			// Workaround for math if tab is switched before typesetting has stopped
			if (typeof(MathJax) !== 'undefined' && typeof(MathJax.Hub) !== 'undefined')
			{
				// Pending math should not be rendered if the graph has no math enabled
				if (MathJax.Hub.queue.pending == 1 && this.editor != null && !this.editor.graph.mathEnabled)
				{
					// Since there is no way to stop/undo mathjax or
					// clear the queue we have to refresh after typeset
					MathJax.Hub.Queue(mxUtils.bind(this, function()
					{
						if (this.editor != null)
						{
							this.editor.graph.refresh();
						}
					}));
				}
			}
			else if (typeof(Editor.MathJaxClear) !== 'undefined' && (this.editor == null || !this.editor.graph.mathEnabled))
			{
				// Clears our own queue for async loading
				Editor.MathJaxClear();
			}
		});
		
		// Adds a graph model listener to update the view
		this.editor.graph.model.addListener(mxEvent.CHANGE, mxUtils.bind(this, function(sender, evt)
		{
			var edit = evt.getProperty('edit');
			var changes = edit.changes;
			
			for (var i = 0; i < changes.length; i++)
			{
				if (changes[i] instanceof SelectPage ||
					changes[i] instanceof RenamePage ||
					changes[i] instanceof MovePage ||
					changes[i] instanceof mxRootChange)
				{
					updateTabs();
					break;	
				}
			}
		}));
		
		// Updates zoom in toolbar
		if (this.toolbar != null)
		{
			this.editor.addListener('pageSelected', this.toolbar.updateZoom);
		}
	}
};

/**
 * Adds the listener for automatically saving the diagram for local changes.
 */
EditorUi.prototype.restoreViewState = function(page, viewState, selection)
{
	var newPage = (page != null) ? this.getPageById(page.getId()) : null;
	var graph = this.editor.graph;
	
	if (newPage != null && this.currentPage != null && this.pages != null)
	{
		if (newPage != this.currentPage)
		{
			this.selectPage(newPage, true, viewState);
		}
		else
		{
			// TODO: Pass viewState to setGraphXml
			graph.setViewState(viewState);
			this.editor.updateGraphComponents();
			graph.view.revalidate();
			graph.sizeDidChange();
		}

		graph.container.scrollLeft = graph.view.translate.x * graph.view.scale + viewState.scrollLeft;
		graph.container.scrollTop = graph.view.translate.y * graph.view.scale + viewState.scrollTop;
		graph.restoreSelection(selection);
	}
};

/**
 * Overrides setDefaultParent
 */
Graph.prototype.createViewState = function(node)
{
	var pv = node.getAttribute('page');
	var ps = parseFloat(node.getAttribute('pageScale'));
	var pw = parseFloat(node.getAttribute('pageWidth'));
	var ph = parseFloat(node.getAttribute('pageHeight'));
	var bg = node.getAttribute('background');
	var bgImg = this.parseBackgroundImage(node.getAttribute('backgroundImage'));
	var extFonts = node.getAttribute('extFonts');
	
	if (extFonts)
	{
		try
		{
			extFonts = extFonts.split('|').map(function(ef)
			{
				var parts = ef.split('^');
				return {name: parts[0], url: parts[1]};
			});
		}
		catch(e)
		{
			console.log('ExtFonts format error: ' + e.message);
		}
	}

	return {
		gridEnabled: node.getAttribute('grid') != '0',
		//gridColor: node.getAttribute('gridColor') || mxSettings.getGridColor(uiTheme == 'dark'),
		gridSize: parseFloat(node.getAttribute('gridSize')) || mxGraph.prototype.gridSize,
		guidesEnabled: node.getAttribute('guides') != '0',
		foldingEnabled: node.getAttribute('fold') != '0',
		shadowVisible: node.getAttribute('shadow') == '1',
		pageVisible: (this.isLightboxView()) ? false : ((pv != null) ? (pv != '0') : this.defaultPageVisible),
		background: (bg != null && bg.length > 0) ? bg : null,
		backgroundImage: bgImg,
		pageScale: (!isNaN(ps)) ? ps : mxGraph.prototype.pageScale,
		pageFormat: (!isNaN(pw) && !isNaN(ph)) ? new mxRectangle(0, 0, pw, ph) :
			((typeof mxSettings === 'undefined' || this.defaultPageFormat != null) ?
				mxGraph.prototype.pageFormat : mxSettings.getPageFormat()),
		tooltips: node.getAttribute('tooltips') != '0',
		connect: node.getAttribute('connect') != '0',
		arrows: node.getAttribute('arrows') != '0',
		mathEnabled: node.getAttribute('math') == '1',
		selectionCells: null,
		defaultParent: null,
		scrollbars: this.defaultScrollbars,
		scale: 1,
		hiddenTags: [],
		extFonts: extFonts || []
	};
};

/**
 * Writes the graph properties from the realtime model to the given mxGraphModel node.
 */
Graph.prototype.saveViewState = function(vs, node, ignoreTransient, resolveReferences)
{
	if (!ignoreTransient)
	{
		node.setAttribute('grid', (vs == null || vs.gridEnabled) ? '1' : '0');
		node.setAttribute('gridSize', (vs != null) ? vs.gridSize : mxGraph.prototype.gridSize);
		node.setAttribute('guides', (vs == null || vs.guidesEnabled) ? '1' : '0');
		node.setAttribute('tooltips', (vs == null || vs.tooltips) ? '1' : '0');
		node.setAttribute('connect', (vs == null || vs.connect) ? '1' : '0');
		node.setAttribute('arrows', (vs == null || vs.arrows) ? '1' : '0');
		node.setAttribute('page', ((vs == null && this.defaultPageVisible ) ||
			(vs != null && vs.pageVisible)) ? '1' : '0');
		
		// Ignores fold to avoid checksum errors for lightbox mode
		node.setAttribute('fold', (vs == null || vs.foldingEnabled) ? '1' : '0');
	}

	node.setAttribute('pageScale', (vs != null && vs.pageScale != null) ?
		vs.pageScale : mxGraph.prototype.pageScale);
	
	var pf = (vs != null) ? vs.pageFormat : (typeof mxSettings === 'undefined' ||
		this.defaultPageFormat != null) ? mxGraph.prototype.pageFormat :
			mxSettings.getPageFormat();
	
	if (pf != null)
	{
		node.setAttribute('pageWidth', pf.width);
		node.setAttribute('pageHeight', pf.height);
	}

	if (vs != null)
	{
		if (vs.background != null)
		{
			node.setAttribute('background', vs.background);
		}

		var bgImg = this.getBackgroundImageObject(vs.backgroundImage, resolveReferences);

		if (bgImg != null)
		{
			node.setAttribute('backgroundImage', JSON.stringify(bgImg));
		}
	}

	node.setAttribute('math', (vs != null && vs.mathEnabled) ? '1' : '0');
	node.setAttribute('shadow', (vs != null && vs.shadowVisible) ? '1' : '0');
	
	if (vs != null && vs.extFonts != null && vs.extFonts.length > 0)
	{
		node.setAttribute('extFonts', vs.extFonts.map(function(ef)
		{
			return ef.name + '^' + ef.url;
		}).join('|'));
	}
};

/**
 * Overrides setDefaultParent
 */
Graph.prototype.getViewState = function()
{
	return {
		defaultParent: this.defaultParent,
		currentRoot: this.view.currentRoot,
		gridEnabled: this.gridEnabled,
		//gridColor: this.view.gridColor,
		gridSize: this.gridSize,
		guidesEnabled: this.graphHandler.guidesEnabled,
		foldingEnabled: this.foldingEnabled,
		shadowVisible: this.shadowVisible,
		scrollbars: this.scrollbars,
		pageVisible: this.pageVisible,
		background: this.background,
		backgroundImage: this.backgroundImage,
		pageScale: this.pageScale,
		pageFormat: this.pageFormat,
		tooltips: this.tooltipHandler.isEnabled(),
		connect: this.connectionHandler.isEnabled(),
		arrows: this.connectionArrowsEnabled,
		scale: this.view.scale,
		scrollLeft: this.container.scrollLeft - this.view.translate.x * this.view.scale,
		scrollTop: this.container.scrollTop - this.view.translate.y * this.view.scale,
		translate: this.view.translate.clone(),
		lastPasteXml: this.lastPasteXml,
		pasteCounter: this.pasteCounter,
		mathEnabled: this.mathEnabled,
		hiddenTags: this.hiddenTags,
		extFonts: this.extFonts
	};
};

/**
 * Overrides setDefaultParent
 */
Graph.prototype.setViewState = function(state, removeOldExtFonts)
{
	if (state != null)
	{
		this.lastPasteXml = state.lastPasteXml;
		this.pasteCounter = state.pasteCounter || 0;
		this.mathEnabled = state.mathEnabled;
		this.gridEnabled = state.gridEnabled;
		//this.view.gridColor = state.gridColor;
		this.gridSize = state.gridSize;
		this.graphHandler.guidesEnabled = state.guidesEnabled;
		this.foldingEnabled = state.foldingEnabled;
		this.setShadowVisible(state.shadowVisible, false);
		this.scrollbars = state.scrollbars;
		this.pageVisible = !this.isViewer() && state.pageVisible;
		this.background = state.background;
		this.pageScale = state.pageScale;
		this.pageFormat = state.pageFormat;
		this.view.currentRoot = state.currentRoot;
		this.defaultParent = state.defaultParent;
		this.connectionArrowsEnabled = state.arrows;
		this.setTooltips(state.tooltips);
		this.setConnectable(state.connect);
		this.setBackgroundImage(state.backgroundImage);
		this.hiddenTags = state.hiddenTags;

		var oldExtFonts = this.extFonts;
		this.extFonts = state.extFonts || [];

		// Removing old fonts is important for real-time synchronization
		// But, for page change, it results in undesirable font flicker
		if (removeOldExtFonts && oldExtFonts != null)
		{
			for (var i = 0; i < oldExtFonts.length; i++)
			{
				var fontElem = document.getElementById('extFont_' + oldExtFonts[i].name);
				
				if (fontElem != null)
				{
					fontElem.parentNode.removeChild(fontElem);
				}
			}
		}
		
		for (var i = 0; i < this.extFonts.length; i++)
		{
			this.addExtFont(this.extFonts[i].name, this.extFonts[i].url, true);
		}
		
		if (state.scale != null)
		{
			this.view.scale = state.scale;
		}
		else
		{
			this.view.scale = 1;
		}
		
		// Checks if current root or default parent have been removed
		if (this.view.currentRoot != null &&
			!this.model.contains(this.view.currentRoot))
		{
			this.view.currentRoot = null;
		}
		
		if (this.defaultParent != null &&
			!this.model.contains(this.defaultParent))
		{
			this.setDefaultParent(null);
			this.selectUnlockedLayer();
		}
		
		if (state.translate != null)
		{
			this.view.translate = state.translate;
		}
	}
	else
	{
		this.view.currentRoot = null;
		this.view.scale = 1;
		this.gridEnabled = this.defaultGridEnabled;
		this.gridSize = mxGraph.prototype.gridSize;
		this.pageScale = mxGraph.prototype.pageScale;
		this.pageFormat = (typeof mxSettings === 'undefined' || this.defaultPageFormat != null) ?
			mxGraph.prototype.pageFormat : mxSettings.getPageFormat();
		this.pageVisible = this.defaultPageVisible;
		this.background = null;
		this.backgroundImage = null;
		this.scrollbars = this.defaultScrollbars;
		this.graphHandler.guidesEnabled = true;
		this.foldingEnabled = true;
		this.setShadowVisible(false, false);
		this.defaultParent = null;
		this.setTooltips(true);
		this.setConnectable(true);
		this.lastPasteXml = null;
		this.pasteCounter = 0;
		this.mathEnabled = this.defaultMathEnabled;
		this.connectionArrowsEnabled = true;
		this.hiddenTags = [];
		this.extFonts = [];
	}
	
	// Implicit settings
	this.pageBreaksVisible = this.pageVisible; 
	this.preferPageSize = this.pageVisible;
	this.fireEvent(new mxEventObject('viewStateChanged', 'state', state));
};

Graph.prototype.addExtFont = function(fontName, fontUrl, dontRemember)
{
	// KNOWN: Font not added when pasting cells with custom fonts
	if (fontName && fontUrl)
	{
		if (urlParams['ext-fonts'] != '1')
		{
			// Adds inserted fonts to font family menu
			Graph.recentCustomFonts[fontName.toLowerCase()] = {name: fontName, url: fontUrl};
		}
		
		var fontId = 'extFont_' + fontName;

		if (document.getElementById(fontId) == null)
		{
			if (fontUrl.indexOf(Editor.GOOGLE_FONTS) == 0)
			{
				mxClient.link('stylesheet', fontUrl, null, fontId);
			}
			else
			{
				var head = document.getElementsByTagName('head')[0];
				
				// KNOWN: Should load fonts synchronously
				var style = document.createElement('style');
				
				style.appendChild(document.createTextNode('@font-face {\n' +
					'\tfont-family: "'+ fontName +'";\n' + 
					'\tsrc: url("'+ fontUrl +'");\n}'));
				
				style.setAttribute('id', fontId);
				var head = document.getElementsByTagName('head')[0];
		   		head.appendChild(style);
			}
		}
		
		if (!dontRemember)
		{
			if (this.extFonts == null) 
			{
				this.extFonts = [];
			}
			
			var extFonts = this.extFonts, notFound = true;
			
			for (var i = 0; i < extFonts.length; i++)
			{
				if (extFonts[i].name == fontName)
				{
					notFound = false;
					break;
				}
			}
			
			if (notFound)
			{
				this.extFonts.push({name: fontName, url: fontUrl});
			}
		}
	}
};

/**
 * Executes selection of a new page.
 */
EditorUi.prototype.updatePageRoot = function(page, checked)
{
	if (page.root == null)
	{
		var node = this.editor.extractGraphModel(page.node, null, checked);
		var cause = Editor.extractParserError(node);
		
		if (cause)
		{
			throw new Error(cause);
		}
		else if (node != null)
		{
			page.graphModelNode = node;
			
			// Converts model XML into page object with root cell
			page.viewState = this.editor.graph.createViewState(node);
			var codec = new mxCodec(node.ownerDocument);
			page.root = codec.decode(node).root;
		}
		else
		{
			// Initializes page object with new empty root
			page.root = this.editor.graph.model.createRoot();
		}
	}
	else if (page.viewState == null)
	{
		if (page.graphModelNode == null)
		{
			var node = this.editor.extractGraphModel(page.node);
			
			var cause = Editor.extractParserError(node);
			
			if (cause)
			{
				throw new Error(cause);
			}
			else if (node != null)
			{
				page.graphModelNode = node;
			}
		}
		
		if (page.graphModelNode != null)
		{
			page.viewState = this.editor.graph.createViewState(page.graphModelNode);	
		}
	}
	
	return page;
};

/**
 * Returns true if the given string contains an mxfile.
 */
EditorUi.prototype.selectPage = function(page, quiet, viewState)
{
	try
	{
		if (page != this.currentPage)
		{
			if (this.editor.graph.isEditing())
			{
				this.editor.graph.stopEditing(false);
			}
			
			quiet = (quiet != null) ? quiet : false;
			this.editor.graph.isMouseDown = false;
			this.editor.graph.reset();
			
			var edit = this.editor.graph.model.createUndoableEdit();
			
			// Special flag to bypass autosave for this edit
			edit.ignoreEdit = true;
		
			var change = new SelectPage(this, page, viewState);
			change.execute();
			edit.add(change);
			edit.notify();
			
			this.editor.graph.tooltipHandler.hide();
			
			if (!quiet)
			{
				this.editor.graph.model.fireEvent(new mxEventObject(mxEvent.UNDO, 'edit', edit));
			}
		}
	}
	catch (e)
	{
		this.handleError(e);
	}
};

/**
 * 
 */
EditorUi.prototype.selectNextPage = function(forward)
{
	var next = this.currentPage;
	
	if (next != null && this.pages != null)
	{
		var tmp = mxUtils.indexOf(this.pages, next);
		
		if (forward)
		{
			this.selectPage(this.pages[mxUtils.mod(tmp + 1, this.pages.length)]);
		}
		else if (!forward)
		{
			this.selectPage(this.pages[mxUtils.mod(tmp - 1, this.pages.length)]);
		}
	}
};

/**
 * Returns true if the given string contains an mxfile.
 */
EditorUi.prototype.insertPage = function(page, index)
{
	if (this.editor.graph.isEnabled())
	{
		if (this.editor.graph.isEditing())
		{
			this.editor.graph.stopEditing(false);
		}
		
		page = (page != null) ? page : this.createPage(null, this.createPageId());
		index = (index != null) ? index : this.pages.length;
		
		// Uses model to fire event and trigger autosave
		var change = new ChangePage(this, page, page, index);
		this.editor.graph.model.execute(change);
	}
	
	return page;
};

/**
 * Returns a unique page ID.
 */
EditorUi.prototype.createPageId = function()
{
	var id = null;
	
	do
	{
		id = Editor.guid();
	} while (this.getPageById(id) != null)
	
	return id;
};

/**
 * Returns a new DiagramPage instance.
 */
EditorUi.prototype.createPage = function(name, id)
{
	var page = new DiagramPage(this.fileNode.ownerDocument.createElement('diagram'), id);
	page.setName((name != null) ? name : this.createPageName());
	
	return page;
};

/**
 * Returns a page name.
 */
EditorUi.prototype.createPageName = function()
{
	// Creates a lookup with names
	var existing = {};
	
	for (var i = 0; i < this.pages.length; i++)
	{
		var tmp = this.pages[i].getName();
		
		if (tmp != null && tmp.length > 0)
		{
			existing[tmp] = tmp;
		}
	}

	// Avoids existing names
	var nr = this.pages.length;
	var name = null;
	
	do
	{
		name = mxResources.get('pageWithNumber', [++nr]);
	}
	while (existing[name] != null);
	
	return name;
};

/**
 * Removes the given page.
 */
EditorUi.prototype.removePage = function(page)
{
	try
	{
		var graph = this.editor.graph;
		var tmp = mxUtils.indexOf(this.pages, page);
		
		if (graph.isEnabled() && tmp >= 0)
		{
			if (this.editor.graph.isEditing())
			{
				this.editor.graph.stopEditing(false);
			}
			
			graph.model.beginUpdate();
			try
			{
				var next = this.currentPage;
				
				if (next == page && this.pages.length > 1)
				{
					if (tmp == this.pages.length - 1)
					{
						tmp--;
					}
					else
					{
						tmp++;
					}
					
					next = this.pages[tmp];
				}
				else if (this.pages.length <= 1)
				{
					// Removes label with incorrect page number to force
					// default page name which is OK for a single page
					next = this.insertPage();
					graph.model.execute(new RenamePage(this, next,
						mxResources.get('pageWithNumber', [1])));
				}
				
				// Uses model to fire event to trigger autosave
				graph.model.execute(new ChangePage(this, page, next));
			}
			finally
			{
				graph.model.endUpdate();
			}
		}
	}
	catch (e)
	{
		this.handleError(e);
	}
	
	return page;
};

/**
 * Duplicates the given page.
 */
EditorUi.prototype.duplicatePage = function(page, name)
{
	var newPage = null;
	
	try
	{
		var graph = this.editor.graph;
		
		if (graph.isEnabled())
		{
			if (graph.isEditing())
			{
				graph.stopEditing();
			}
			
			// Clones the current page and takes a snapshot of the graph model and view state
			var node = page.node.cloneNode(false);
			node.removeAttribute('id');

			var cloneMap = new Object();
			var lookup = graph.createCellLookup([graph.model.root]);

			var newPage = new DiagramPage(node);
			newPage.root = graph.cloneCell(graph.model.root, null, cloneMap);
			newPage.viewState = graph.getViewState();
			
			// Resets zoom and scrollbar positions
			newPage.viewState.scale = 1;
			newPage.viewState.scrollLeft = null;
			newPage.viewState.scrollTop = null;
			newPage.viewState.currentRoot = null;
			newPage.viewState.defaultParent = null;
			newPage.setName(name);
			
			newPage = this.insertPage(newPage, mxUtils.indexOf(this.pages, page) + 1);

			// Updates custom links after inserting into the model for cells to have new IDs
			graph.updateCustomLinks(graph.createCellMapping(cloneMap, lookup), [newPage.root]);
		}
	}
	catch (e)
	{
		this.handleError(e);
	}
	
	return newPage;
};

/**
 * Renames the given page using a dialog.
 */
EditorUi.prototype.renamePage = function(page)
{
	var graph = this.editor.graph;

	if (graph.isEnabled())
	{
		var dlg = new FilenameDialog(this, page.getName(), mxResources.get('rename'), mxUtils.bind(this, function(name)
		{
			if (name != null && name.length > 0)
			{
				this.editor.graph.model.execute(new RenamePage(this, page, name));
			}
		}), mxResources.get('rename'));
		this.showDialog(dlg.container, 300, 80, true, true);
		dlg.init();
	}
	
	return page;
}

/**
 * Returns true if the given string contains an mxfile.
 */
EditorUi.prototype.movePage = function(oldIndex, newIndex)
{
	this.editor.graph.model.execute(new MovePage(this, oldIndex, newIndex));
}

/**
 * Returns true if the given string contains an mxfile.
 */
EditorUi.prototype.createTabContainer = function()
{
	var div = document.createElement('div');
	div.className = 'geTabContainer';
	div.style.position = 'absolute';
	div.style.whiteSpace = 'nowrap';
	div.style.overflow = 'hidden';
	div.style.height = '0px';
	
	return div;
};

/**
 * Returns true if the given string contains an mxfile.
 */
EditorUi.prototype.updateTabContainer = function()
{
	if (this.tabContainer != null && this.pages != null)
	{
		var graph = this.editor.graph;
		var wrapper = document.createElement('div');
		wrapper.style.position = 'relative';
		wrapper.style.display = 'inline-block';
		wrapper.style.verticalAlign = 'top';
		wrapper.style.height = this.tabContainer.style.height;
		wrapper.style.whiteSpace = 'nowrap';
		wrapper.style.overflow = 'hidden';
		wrapper.style.fontSize = '13px';
		
		// Allows for negative left margin of first tab
		wrapper.style.marginLeft = '30px';
		
		// Automatic tab width to match available width
		// TODO: Fix tabWidth in chromeless mode
		var btnWidth = (this.editor.isChromelessView()) ? 29 : 59;
		var tabWidth = Math.min(140, Math.max(20, (this.tabContainer.clientWidth - btnWidth) / this.pages.length) + 1);
		var startIndex = null;

		for (var i = 0; i < this.pages.length; i++)
		{
			// Install drag and drop for page reorder
			(mxUtils.bind(this, function(index, tab)
			{
				if (this.pages[index] == this.currentPage)
				{
					tab.className = 'geActivePage';
					tab.style.backgroundColor = Editor.isDarkMode() ? Editor.darkColor : '#fff';
				}
				else
				{
					tab.className = 'geInactivePage';
				}
				
				tab.setAttribute('draggable', 'true');
				
				mxEvent.addListener(tab, 'dragstart', mxUtils.bind(this, function(evt)
				{
					if (graph.isEnabled())
					{
						// Workaround for no DnD on DIV in FF
						if (mxClient.IS_FF)
						{
							// LATER: Check what triggers a parse as XML on this in FF after drop
							evt.dataTransfer.setData('Text', '<diagram/>');
						}
						
						startIndex = index;
					}
					else
					{
						// Blocks event
						mxEvent.consume(evt);
					}
				}));
				
				mxEvent.addListener(tab, 'dragend', mxUtils.bind(this, function(evt)
				{
					startIndex = null;
					evt.stopPropagation();
					evt.preventDefault();
				}));
				
				mxEvent.addListener(tab, 'dragover', mxUtils.bind(this, function(evt)
				{
					if (startIndex != null)
					{
						evt.dataTransfer.dropEffect = 'move';
					}
					
					evt.stopPropagation();
					evt.preventDefault();
				}));
				
				mxEvent.addListener(tab, 'drop', mxUtils.bind(this, function(evt)
				{
					if (startIndex != null && index != startIndex)
					{
						// LATER: Shift+drag for merge, ctrl+drag for clone 
						this.movePage(startIndex, index);
					}

					evt.stopPropagation();
					evt.preventDefault();
				}));
				
				wrapper.appendChild(tab);
			}))(i, this.createTabForPage(this.pages[i], tabWidth, this.pages[i] != this.currentPage, i + 1));
		}
		
		this.tabContainer.innerHTML = '';
		this.tabContainer.appendChild(wrapper);
		
		// Adds floating menu with all pages and insert option
		var menutab = this.createPageMenuTab();
		this.tabContainer.appendChild(menutab);
		var insertTab = null;
		
		// Not chromeless and not read-only file
		if (this.isPageInsertTabVisible())
		{
			insertTab = this.createPageInsertTab();
			this.tabContainer.appendChild(insertTab);
		}

		if (wrapper.clientWidth > this.tabContainer.clientWidth - btnWidth)
		{
			if (insertTab != null)
			{
				insertTab.style.position = 'absolute';
				insertTab.style.right = '0px';
				wrapper.style.marginRight = '30px';
			}
			
			var temp = this.createControlTab(4, '&nbsp;&#10094;&nbsp;');
			temp.style.position = 'absolute';
			temp.style.right = (this.editor.chromeless) ? '29px' : '55px';
			temp.style.fontSize = '13pt';
			
			this.tabContainer.appendChild(temp);
			
			var temp2 = this.createControlTab(4, '&nbsp;&#10095;');
			temp2.style.position = 'absolute';
			temp2.style.right = (this.editor.chromeless) ? '0px' : '29px';
			temp2.style.fontSize = '13pt';
			
			this.tabContainer.appendChild(temp2);
			
			// TODO: Scroll to current page
			var dx = Math.max(0, this.tabContainer.clientWidth - ((this.editor.chromeless) ? 86 : 116));
			wrapper.style.width = dx + 'px';
			
			var fade = 50;
			
			mxEvent.addListener(temp, 'click', mxUtils.bind(this, function(evt)
			{
				wrapper.scrollLeft -= Math.max(20, dx - 20);
				mxUtils.setOpacity(temp, (wrapper.scrollLeft > 0) ? 100 : fade);
				mxUtils.setOpacity(temp2, (wrapper.scrollLeft < wrapper.scrollWidth - wrapper.clientWidth) ? 100 : fade);
				mxEvent.consume(evt);
			}));
		
			mxUtils.setOpacity(temp, (wrapper.scrollLeft > 0) ? 100 : fade);
			mxUtils.setOpacity(temp2, (wrapper.scrollLeft < wrapper.scrollWidth - wrapper.clientWidth) ? 100 : fade);

			mxEvent.addListener(temp2, 'click', mxUtils.bind(this, function(evt)
			{
				wrapper.scrollLeft += Math.max(20, dx - 20);
				mxUtils.setOpacity(temp, (wrapper.scrollLeft > 0) ? 100 : fade);
				mxUtils.setOpacity(temp2, (wrapper.scrollLeft < wrapper.scrollWidth - wrapper.clientWidth) ? 100 : fade);
				mxEvent.consume(evt);
			}));
		}
	}
};

/**
 * Returns true if the given string contains an mxfile.
 */
EditorUi.prototype.isPageInsertTabVisible = function()
{
	return urlParams['embed'] == 1 || (this.getCurrentFile() != null &&
		this.getCurrentFile().isEditable());
};

/**
 * Returns true if the given string contains an mxfile.
 */
EditorUi.prototype.createTab = function(hoverEnabled)
{
	var tab = document.createElement('div');
	tab.style.display = 'inline-block';
	tab.style.whiteSpace = 'nowrap';
	tab.style.boxSizing = 'border-box';
	tab.style.position = 'relative';
	tab.style.overflow = 'hidden';
	tab.style.textAlign = 'center';
	tab.style.marginLeft = '-1px';
	tab.style.height = this.tabContainer.clientHeight + 'px';
	tab.style.padding = '12px 4px 8px 4px';
	tab.style.border = Editor.isDarkMode() ? '1px solid #505759' : '1px solid #e8eaed';
	tab.style.borderTopStyle = 'none';
	tab.style.borderBottomStyle = 'none';
	tab.style.backgroundColor = this.tabContainer.style.backgroundColor;
	tab.style.cursor = 'move';
	tab.style.color = 'gray';

	if (hoverEnabled)
	{
		mxEvent.addListener(tab, 'mouseenter', mxUtils.bind(this, function(evt)
		{
			if (!this.editor.graph.isMouseDown)
			{
				tab.style.backgroundColor = Editor.isDarkMode() ? 'black' : '#e8eaed';
				mxEvent.consume(evt);
			}
		}));
		
		mxEvent.addListener(tab, 'mouseleave', mxUtils.bind(this, function(evt)
		{
			tab.style.backgroundColor = this.tabContainer.style.backgroundColor;
			mxEvent.consume(evt);
		}));
	}
	
	return tab;
};

/**
 * Returns true if the given string contains an mxfile.
 */
EditorUi.prototype.createControlTab = function(paddingTop, html, hoverEnabled)
{
	var tab = this.createTab((hoverEnabled != null) ? hoverEnabled : true);
	tab.style.lineHeight = this.tabContainerHeight + 'px';
	tab.style.paddingTop = paddingTop + 'px';
	tab.style.cursor = 'pointer';
	tab.style.width = '30px';
	tab.innerHTML = html;

	if (tab.firstChild != null && tab.firstChild.style != null)
	{
		mxUtils.setOpacity(tab.firstChild, 40);
	}
	
	return tab;
};

/**
 * Returns true if the given string contains an mxfile.
 */
EditorUi.prototype.createPageMenuTab = function(hoverEnabled)
{
	var tab = this.createControlTab(3, '<div class="geSprite geSprite-dots"></div>', hoverEnabled);
	tab.setAttribute('title', mxResources.get('pages'));
	tab.style.position = 'absolute';
	tab.style.marginLeft = '0px';
	tab.style.top = '0px';
	tab.style.left = '1px';
	
	var div = tab.getElementsByTagName('div')[0];
	div.style.display = 'inline-block';
	div.style.marginTop = '5px';
	div.style.width = '21px';
	div.style.height = '21px';
	
	mxEvent.addListener(tab, 'click', mxUtils.bind(this, function(evt)
	{
		this.editor.graph.popupMenuHandler.hideMenu();
		var menu = new mxPopupMenu(mxUtils.bind(this, function(menu, parent)
		{
			for (var i = 0; i < this.pages.length; i++)
			{
				(mxUtils.bind(this, function(index)
				{
					var item = menu.addItem(this.pages[index].getName(), null, mxUtils.bind(this, function()
					{
						this.selectPage(this.pages[index]);
					}), parent);

					var id = this.pages[index].getId();
					item.setAttribute('title', this.pages[index].getName() +
						((id != null) ? ' (' + id + ')' : '') +
						' [' + (index + 1)+ ']');
					
					// Adds checkmark to current page
					if (this.pages[index] == this.currentPage)
					{
						menu.addCheckmark(item, Editor.checkmarkImage);
					}
				}))(i);
			}
			
			if (this.editor.graph.isEnabled())
			{
				menu.addSeparator(parent);
				
				var item = menu.addItem(mxResources.get('insertPage'), null, mxUtils.bind(this, function()
				{
					this.insertPage();
				}), parent);

				var page = this.currentPage;
				
				if (page != null)
				{
					menu.addSeparator(parent);
					var pageName = page.getName();
	
					menu.addItem(mxResources.get('removeIt', [pageName]), null, mxUtils.bind(this, function()
					{
						this.removePage(page);
					}), parent);
					
					menu.addItem(mxResources.get('renameIt', [pageName]), null, mxUtils.bind(this, function()
					{
						this.renamePage(page, page.getName());
					}), parent);

					menu.addSeparator(parent);
					
					menu.addItem(mxResources.get('duplicateIt', [pageName]), null, mxUtils.bind(this, function()
					{
						this.duplicatePage(page, mxResources.get('copyOf', [page.getName()]));
					}), parent);
				}
			}
		}));
		
		menu.div.className += ' geMenubarMenu';
		menu.smartSeparators = true;
		menu.showDisabled = true;
		menu.autoExpand = true;
		
		// Disables autoexpand and destroys menu when hidden
		menu.hideMenu = mxUtils.bind(this, function()
		{
			mxPopupMenu.prototype.hideMenu.apply(menu, arguments);
			menu.destroy();
		});
	
		var x = mxEvent.getClientX(evt);
		var y = mxEvent.getClientY(evt);
		menu.popup(x, y, null, evt);
		
		// Allows hiding by clicking on document
		this.setCurrentMenu(menu);

		mxEvent.consume(evt);
	}));
	
	return tab;
};

/**
 * Returns true if the given string contains an mxfile.
 */
EditorUi.prototype.createPageInsertTab = function()
{
	var tab = this.createControlTab(4, '<div class="geSprite geSprite-plus"></div>');
	tab.setAttribute('title', mxResources.get('insertPage'));
	var graph = this.editor.graph;
	
	mxEvent.addListener(tab, 'click', mxUtils.bind(this, function(evt)
	{
		this.insertPage();
		mxEvent.consume(evt);
	}));
	
	var div = tab.getElementsByTagName('div')[0];
	div.style.display = 'inline-block';
	div.style.width = '21px';
	div.style.height = '21px';
	
	return tab;
};

/**
 * Returns true if the given string contains an mxfile.
 */
EditorUi.prototype.createTabForPage = function(page, tabWidth, hoverEnabled, pageNumber)
{
	var tab = this.createTab(hoverEnabled);
	var name = page.getName() || mxResources.get('untitled');
	var id = page.getId();
	tab.setAttribute('title', name + ((id != null) ? ' (' + id + ')' : '') + ' [' + pageNumber + ']');
	mxUtils.write(tab, name);
	tab.style.maxWidth = tabWidth + 'px';
	tab.style.width = tabWidth + 'px';
	this.addTabListeners(page, tab);
	
	if (tabWidth > 42)
	{
		tab.style.textOverflow = 'ellipsis';
	}
	
	return tab;
};

/**
 * Translates this point by the given vector.
 * 
 * @param {number} dx X-coordinate of the translation.
 * @param {number} dy Y-coordinate of the translation.
 */
EditorUi.prototype.addTabListeners = function(page, tab)
{
	mxEvent.disableContextMenu(tab);
	var graph = this.editor.graph;
	var model = graph.model;

	mxEvent.addListener(tab, 'dblclick', mxUtils.bind(this, function(evt)
	{
		this.renamePage(page)
		mxEvent.consume(evt);
	}));
	
	var menuWasVisible = false;
	var pageWasActive = false;
	
	mxEvent.addGestureListeners(tab, mxUtils.bind(this, function(evt)
	{
		// Do not consume event here to allow for drag and drop of tabs
		menuWasVisible = this.currentMenu != null;
		pageWasActive = page == this.currentPage;
		
		if (!graph.isMouseDown && !pageWasActive)
		{
			this.selectPage(page);
		}
	}), null, mxUtils.bind(this, function(evt)
	{
		if (graph.isEnabled() && !graph.isMouseDown &&
			((mxEvent.isTouchEvent(evt) && pageWasActive) ||
			mxEvent.isPopupTrigger(evt)))
		{
			graph.popupMenuHandler.hideMenu();
			this.hideCurrentMenu();

			if (!mxEvent.isTouchEvent(evt) || !menuWasVisible)
			{
				var menu = new mxPopupMenu(this.createPageMenu(page));
				
				menu.div.className += ' geMenubarMenu';
				menu.smartSeparators = true;
				menu.showDisabled = true;
				menu.autoExpand = true;
				
				// Disables autoexpand and destroys menu when hidden
				menu.hideMenu = mxUtils.bind(this, function()
				{
					mxPopupMenu.prototype.hideMenu.apply(menu, arguments);
					this.resetCurrentMenu();
					menu.destroy();
				});
		
				var x = mxEvent.getClientX(evt);
				var y = mxEvent.getClientY(evt);
				menu.popup(x, y, null, evt);
				this.setCurrentMenu(menu, tab);
			}
			
			mxEvent.consume(evt);
		}
	}));
};

/**
 * Returns an absolute URL to the given page or null of absolute links
 * to pages are not supported in this file.
 */
EditorUi.prototype.getLinkForPage = function(page, params, lightbox)
{
	if (!mxClient.IS_CHROMEAPP && !EditorUi.isElectronApp)
	{
		var file = this.getCurrentFile();
		
		if (file != null && file.constructor != LocalFile && this.getServiceName() == 'draw.io')
		{
			var search = this.getSearch(['create', 'title', 'mode', 'url', 'drive', 'splash',
				'state', 'clibs', 'ui', 'viewbox', 'hide-pages']);
			search += ((search.length == 0) ? '?' : '&') + 'page-id=' + page.getId();
			
			if (params != null)
			{
				search += '&' + params.join('&');
			}
			
			return ((lightbox && urlParams['dev'] != '1') ? EditorUi.lightboxHost :
				(((mxClient.IS_CHROMEAPP || EditorUi.isElectronApp ||
				!(/.*\.draw\.io$/.test(window.location.hostname))) ?
				EditorUi.drawHost : 'https://' + window.location.host))) +
				'/' + search + '#' + file.getHash();
		}
	}
	
	return null;
};

/**
 * Returns true if the given string contains an mxfile.
 */
EditorUi.prototype.createPageMenu = function(page, label)
{
	return mxUtils.bind(this, function(menu, parent)
	{
		var graph = this.editor.graph;
		var model = graph.model;

		menu.addItem(mxResources.get('insert'), null, mxUtils.bind(this, function()
		{
			this.insertPage(null, mxUtils.indexOf(this.pages, page) + 1);
		}), parent);
	
		menu.addItem(mxResources.get('delete'), null, mxUtils.bind(this, function()
		{
			this.removePage(page);
		}), parent);
		
		menu.addItem(mxResources.get('rename'), null, mxUtils.bind(this, function()
		{
			this.renamePage(page, label);
		}), parent);
		
		var url = this.getLinkForPage(page);

		if (url != null)
		{
			menu.addSeparator(parent);
			
			menu.addItem(mxResources.get('link'), null, mxUtils.bind(this, function()
			{
				this.showPublishLinkDialog(mxResources.get('url'), true, null, null,
					mxUtils.bind(this, function(linkTarget, linkColor, allPages, lightbox, editLink, layers)
				{
					var params = this.createUrlParameters(linkTarget, linkColor, allPages, lightbox, editLink, layers);
					
					if (!allPages)
					{
						params.push('hide-pages=1');
					}
					
					if (!graph.isSelectionEmpty())
					{
						var bounds = graph.getBoundingBox(graph.getSelectionCells());
								
						var t = graph.view.translate;
						var s = graph.view.scale;
						bounds.width /= s;
						bounds.height /= s;
						bounds.x = bounds.x / s - t.x;
						bounds.y = bounds.y / s - t.y;
					
						params.push('viewbox=' + encodeURIComponent(JSON.stringify({x: Math.round(bounds.x), y: Math.round(bounds.y),
							width: Math.round(bounds.width), height: Math.round(bounds.height), border: 100})));
					}
					
					var dlg = new EmbedDialog(this, this.getLinkForPage(page, params, lightbox));
					this.showDialog(dlg.container, 450, 240, true, true);
					dlg.init();
				}));
			}));
		}
		
		menu.addSeparator(parent);
		
		menu.addItem(mxResources.get('duplicate'), null, mxUtils.bind(this, function()
		{
			this.duplicatePage(page, mxResources.get('copyOf', [page.getName()]));
		}), parent);
		
		if (!mxClient.IS_CHROMEAPP && !EditorUi.isElectronApp && this.getServiceName() == 'draw.io')
		{		
			menu.addSeparator(parent);
			
			menu.addItem(mxResources.get('openInNewWindow'), null, mxUtils.bind(this, function()
			{
				this.editor.editAsNew(this.getFileData(true, null, null, null, true, true));
			}), parent);
		}
	});
};

// Overrides refresh to repaint tab container
(function()
{
	var editorUiRefresh = EditorUi.prototype.refresh;
	
	EditorUi.prototype.refresh = function(sizeDidChange)
	{
		editorUiRefresh.apply(this, arguments);
		this.updateTabContainer();
	}
})();

//Overrides ChangePageSetup codec to exclude page
(function()
{
	var codec = mxCodecRegistry.getCodec(ChangePageSetup);
	codec.exclude.push('page');
})();

//Registers codec for MovePage
(function()
{
	var codec = new mxObjectCodec(new MovePage(), ['ui']);
	
	codec.beforeDecode = function(dec, node, obj)
	{
		obj.ui = dec.ui;
		  
		return node;
	};
	
	codec.afterDecode = function(dec, node, obj)
	{
		var tmp = obj.oldIndex;
		obj.oldIndex = obj.newIndex;
		obj.newIndex = tmp;
		
	    return obj;
	};
	
	mxCodecRegistry.register(codec);
})();

//Registers codec for RenamePage
(function()
{
	var codec = new mxObjectCodec(new RenamePage(), ['ui', 'page']);
	
	codec.beforeDecode = function(dec, node, obj)
	{
		obj.ui = dec.ui;
	  
		return node;
	};
	
	codec.afterDecode = function(dec, node, obj)
	{
	    var tmp = obj.previous;
	    obj.previous = obj.name;
	    obj.name = tmp;
	    
	    return obj;
	};
	
	mxCodecRegistry.register(codec);
})();

//Registers codec for ChangePage
(function()
{
	var codec = new mxObjectCodec(new ChangePage(), ['ui', 'relatedPage',
		'index', 'neverShown', 'page', 'previousPage']);
	
	var viewStateIgnored = ['defaultParent', 'currentRoot', 'scrollLeft',
		'scrollTop', 'scale', 'translate', 'lastPasteXml', 'pasteCounter'];
	
	codec.afterEncode = function(enc, obj, node)
	{
		node.setAttribute('relatedPage', obj.relatedPage.getId())
	    
		if (obj.index == null)
		{
			node.setAttribute('name', obj.relatedPage.getName());

			if (obj.relatedPage.viewState != null)
			{
	        	node.setAttribute('viewState', JSON.stringify(
	        		obj.relatedPage.viewState, function(key, value)
	        	{
	        		return (mxUtils.indexOf(viewStateIgnored, key) < 0) ? value : undefined;
	        	}));
			}
	        
			if (obj.relatedPage.root != null)
			{
				enc.encodeCell(obj.relatedPage.root, node);
			}
	    }
	    
	    return node;
	};

	codec.beforeDecode = function(dec, node, obj)
	{
		obj.ui = dec.ui;
		obj.relatedPage = obj.ui.getPageById(node.getAttribute('relatedPage'));
	    
		if (obj.relatedPage == null)
		{
			var temp = node.ownerDocument.createElement('diagram');
			temp.setAttribute('id', node.getAttribute('relatedPage'));
			temp.setAttribute('name', node.getAttribute('name'));
			obj.relatedPage = new DiagramPage(temp);

			var vs = node.getAttribute('viewState');

			if (vs != null)
			{
				obj.relatedPage.viewState = JSON.parse(vs);
				node.removeAttribute('viewState');
			}

	        // Makes sure the original node isn't modified
			node = node.cloneNode(true);
			var tmp = node.firstChild;

			if (tmp != null)
			{
				obj.relatedPage.root = dec.decodeCell(tmp, false);

				var tmp2 = tmp.nextSibling;
				tmp.parentNode.removeChild(tmp);
				tmp = tmp2;

				while (tmp != null)
				{
					tmp2 = tmp.nextSibling;

					if (tmp.nodeType == mxConstants.NODETYPE_ELEMENT)
					{
						// Ignores all existing cells because those do not need to
						// be re-inserted into the model. Since the encoded version
						// of these cells contains the new parent, this would leave
						// to an inconsistent state on the model (ie. a parent
						// change without a call to parentForCellChanged).
						var id = tmp.getAttribute('id');

						if (dec.lookup(id) == null)
						{
							dec.decodeCell(tmp);
						}
					}

					tmp.parentNode.removeChild(tmp);
					tmp = tmp2;
				}
			}
		}

		return node;
	};

	codec.afterDecode = function(dec, node, obj)
	{
		obj.index = obj.previousIndex;

		return obj;
	};
	
	mxCodecRegistry.register(codec);
})();