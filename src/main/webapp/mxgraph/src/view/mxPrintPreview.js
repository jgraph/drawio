/**
 * Copyright (c) 2006-2019, JGraph Ltd
 * Copyright (c) 2006-2017, draw.io AG
 */
/**
 * Class: mxPrintPreview
 * 
 * Implements printing of a diagram across multiple pages. The following opens
 * a print preview for an existing graph:
 * 
 * (code)
 * var preview = new mxPrintPreview(graph);
 * preview.open();
 * (end)
 * 
 * Use <mxUtils.getScaleForPageCount> as follows in order to print the graph
 * across a given number of pages:
 * 
 * (code)
 * var pageCount = mxUtils.prompt('Enter page count', '1');
 * 
 * if (pageCount != null)
 * {
 *   var scale = mxUtils.getScaleForPageCount(pageCount, graph);
 *   var preview = new mxPrintPreview(graph, scale);
 *   preview.open();
 * }
 * (end)
 * 
 * CSS:
 * 
 * The CSS from the original page is not carried over to the print preview.
 * To add CSS to the page, use the css argument in the <open> function or
 * override <writeHead> to add the respective link tags as follows:
 * 
 * (code)
 * var writeHead = preview.writeHead;
 * preview.writeHead = function(doc, css)
 * {
 *   writeHead.apply(this, arguments);
 *   doc.writeln('<link rel="stylesheet" type="text/css" href="style.css">');
 * };
 * (end)
 * 
 * Padding:
 * 
 * To add a padding to the page in the preview (but not the print output), use
 * the following code:
 * 
 * (code)
 * preview.writeHead = function(doc)
 * {
 *   writeHead.apply(this, arguments);
 *   
 *   doc.writeln('<style type="text/css">');
 *   doc.writeln('@media screen {');
 *   doc.writeln('  body > div { padding-top:30px;padding-left:40px;box-sizing:content-box; }');
 *   doc.writeln('}');
 *   doc.writeln('</style>');
 * };
 * (end)
 * 
 * Page Format:
 * 
 * For landscape printing, use <mxConstants.PAGE_FORMAT_A4_LANDSCAPE> as
 * the pageFormat in <mxUtils.getScaleForPageCount> and <mxPrintPreview>.
 * Keep in mind that one can not set the defaults for the print dialog
 * of the operating system from JavaScript so the user must manually choose
 * a page format that matches this setting.
 * 
 * You can try passing the following CSS directive to <open> to set the
 * page format in the print dialog to landscape. However, this CSS
 * directive seems to be ignored in most major browsers, including IE.
 * 
 * (code)
 * @page {
 *   size: landscape;
 * }
 * (end)
 * 
 * Note that the print preview behaves differently in IE when used from the
 * filesystem or via HTTP so printing should always be tested via HTTP.
 * 
 * If you are using a DOCTYPE in the source page you can override <getDoctype>
 * and provide the same DOCTYPE for the print preview if required. Here is
 * an example for IE8 standards mode.
 * 
 * (code)
 * var preview = new mxPrintPreview(graph);
 * preview.getDoctype = function()
 * {
 *   return '<!--[if IE]><meta http-equiv="X-UA-Compatible" content="IE=5,IE=8" ><![endif]-->';
 * };
 * preview.open();
 * (end)
 * 
 * Constructor: mxPrintPreview
 *
 * Constructs a new print preview for the given parameters.
 * 
 * Parameters:
 * 
 * graph - <mxGraph> to be previewed.
 * scale - Optional scale of the output. Default is 1 / <mxGraph.pageScale>.
 * pageFormat - <mxRectangle> that specifies the page format (in pixels).
 * border - Border in pixels along each side of every page. Note that the
 * actual print function in the browser will add another border for
 * printing.
 * This should match the page format of the printer. Default uses the
 * <mxGraph.pageFormat> of the given graph.
 * x0 - Optional left offset of the output. Default is 0.
 * y0 - Optional top offset of the output. Default is 0.
 * borderColor - Optional color of the page border. Default is no border.
 * Note that a border is sometimes useful to highlight the printed page
 * border in the print preview of the browser.
 * title - Optional string that is used for the window title. Default
 * is 'Printer-friendly version'.
 * pageSelector - Optional boolean that specifies if the page selector
 * should appear in the window with the print preview. Default is true.
 */
function mxPrintPreview(graph, scale, pageFormat, border, x0, y0, borderColor, title, pageSelector)
{
	this.graph = graph;
	this.scale = (scale != null) ? scale : 1 / graph.pageScale;
	this.border = (border != null) ? border : 0;
	this.pageFormat = mxRectangle.fromRectangle((pageFormat != null) ? pageFormat : graph.pageFormat);
	this.title = (title != null) ? title : 'Printer-friendly version';
	this.x0 = (x0 != null) ? x0 : 0;
	this.y0 = (y0 != null) ? y0 : 0;
	this.borderColor = borderColor;
	this.pageSelector = (pageSelector != null) ? pageSelector : true;
};

/**
 * Variable: graph
 * 
 * Reference to the <mxGraph> that should be previewed.
 */
mxPrintPreview.prototype.graph = null;

/**
 * Variable: pageFormat
 *
 * Holds the <mxRectangle> that defines the page format.
 */
mxPrintPreview.prototype.pageFormat = null;

/**
 * Variable: addPageCss
 *
 * Holds the <mxRectangle> that defines the page format.
 */
mxPrintPreview.prototype.addPageCss = false;

/**
 * Variable: pixelsPerInch
 * 
 * CSS page size ratio. Default is 100.
 */
mxPrintPreview.prototype.pixelsPerInch = 100;

/**
 * Variable: pageMargin
 * 
 * CSS page margin in px. Default is 27.
 */
mxPrintPreview.prototype.pageMargin = 27;

/**
 * Variable: overflowClipMargin
 * 
 * overflowClipMargin for SVG container. Default is 1px.
 */
mxPrintPreview.prototype.overflowClipMargin = '1px';

/**
 * Variable: gridSize
 * 
 * Size for the background grid.
 */
mxPrintPreview.prototype.gridSize = null;

/**
 * Variable: gridSteps
 * 
 * Steps for the background grid.
 */
mxPrintPreview.prototype.gridSteps = null;

/**
 * Variable: gridColor
 * 
 * Color for the background grid.
 */
mxPrintPreview.prototype.gridColor = null;

/**
 * Variable: gridStrokeWidth
 * 
 * Stroke width for the background grid. Default is 0.5.
 */
mxPrintPreview.prototype.gridStrokeWidth = 0.5;

/**
 * Variable: defaultCss
 * 
 * Default CSS for the HEAD section of the print preview. Shape shadows cause
 * the output to get resterized and are therefore disabled for print and PDF.
 */
mxPrintPreview.prototype.defaultCss =
	'g[style*="filter: drop-shadow("] {\n' +
	'  filter: none !important;\n' +
	'}\n' +
	'@media screen {\n' +
	'  body {\n' +
	'    background: gray;\n' +
	'    transform: scale(0.7);\n' +
	'    transform-origin: 0 0;\n' +
	'  }\n' +
	'  body > div {\n' +
	'    margin-bottom: 20px;\n' +
	'    box-sizing: border-box;\n' +
	'  }\n' +
	'  a, a * {\n' +
	'    pointer-events: none;\n' +
	'  }\n' +
	'}\n' +
	'@media print {\n' +
	'  body {\n' +
	'    margin: 0px;\n' +
	'  }\n' +
	'  * {\n' +
	'    -webkit-print-color-adjust: exact;\n' +
	'  }\n' +
	'}';

/**
 * Variable: scale
 * 
 * Holds the scale of the print preview.
 */
mxPrintPreview.prototype.scale = null;

/**
 * Variable: border
 * 
 * The border inset around each side of every page in the preview. This is set
 * to 0 if autoOrigin is false.
 */
mxPrintPreview.prototype.border = 0;

/**
 * Variable: marginTop
 * 
 * The margin at the top of the page (number). Default is 0.
 */
mxPrintPreview.prototype.marginTop = 0;

/**
 * Variable: marginBottom
 * 
 * The margin at the bottom of the page (number). Default is 0.
 */
mxPrintPreview.prototype.marginBottom = 0;

/**
 * Variable: x0
 * 
 * Holds the horizontal offset of the output.
 */
mxPrintPreview.prototype.x0 = 0;

/**
 * Variable: y0
 *
 * Holds the vertical offset of the output.
 */
mxPrintPreview.prototype.y0 = 0;

/**
 * Variable: autoOrigin
 * 
 * Specifies if the origin should be automatically computed based on the top,
 * left corner of the actual diagram contents. The required offset will be added
 * to <x0> and <y0> in <open>. Default is true.
 */
mxPrintPreview.prototype.autoOrigin = true;

/**
 * Variable: printOverlays
 * 
 * Specifies if overlays should be printed. Default is false.
 */
mxPrintPreview.prototype.printOverlays = false;

/**
 * Variable: printControls
 * 
 * Specifies if controls (such as folding icons) should be printed. Default is
 * false.
 */
mxPrintPreview.prototype.printControls = false;

/**
 * Variable: printBackgroundImage
 * 
 * Specifies if the background image should be printed. Default is false.
 */
mxPrintPreview.prototype.printBackgroundImage = false;

/**
 * Variable: backgroundColor
 * 
 * Holds the color value for the page background color. Default is #ffffff.
 */
mxPrintPreview.prototype.backgroundColor = '#ffffff';

/**
 * Variable: borderColor
 * 
 * Holds the color value for the page border.
 */
mxPrintPreview.prototype.borderColor = null;

/**
 * Variable: title
 * 
 * Holds the title of the preview window.
 */
mxPrintPreview.prototype.title = null;

/**
 * Variable: pageSelector
 * 
 * Boolean that specifies if the page selector should be
 * displayed. Default is true.
 */
mxPrintPreview.prototype.pageSelector = null;

/**
 * Variable: wnd
 * 
 * Reference to the preview window.
 */
mxPrintPreview.prototype.wnd = null;

/**
 * Variable: targetWindow
 * 
 * Assign any window here to redirect the rendering in <open>.
 */
mxPrintPreview.prototype.targetWindow = null;

/**
 * Variable: pageCount
 * 
 * Holds the actual number of pages in the preview.
 */
mxPrintPreview.prototype.pageCount = 0;

/**
 * Variable: clipping
 * 
 * Specifies is clipping should be used to avoid creating too many cell states
 * in large diagrams. The bounding box of the cells in the original diagram is
 * used if this is enabled. Default is true.
 */
mxPrintPreview.prototype.clipping = true;

/**
 * Function: getWindow
 * 
 * Returns <wnd>.
 */
mxPrintPreview.prototype.getWindow = function()
{
	return this.wnd;
};

/**
 * Function: getDocType
 * 
 * Returns the string that should go before the HTML tag in the print preview
 * page. This implementation returns an X-UA meta tag for
 * IE8 in IE8 standards mode and edge in IE9 standards mode.
 */
mxPrintPreview.prototype.getDoctype = function()
{
	var dt = '';
	
	if (document.documentMode == 8)
	{
		dt = '<meta http-equiv="X-UA-Compatible" content="IE=8">';
	}
	else if (document.documentMode > 8)
	{
		// Comment needed to make standards doctype apply in IE
		dt = '<!--[if IE]><meta http-equiv="X-UA-Compatible" content="IE=edge"><![endif]-->';
	}
	
	return dt;
};

/**
 * Function: appendGraph
 * 
 * Adds the given graph to the existing print preview.
 */
mxPrintPreview.prototype.appendGraph = function(graph, scale, x0, y0, forcePageBreaks, keepOpen, id, pageFormat, cells)
{
	this.graph = graph;
	this.scale = (scale != null) ? scale : 1 / graph.pageScale;
	this.x0 = x0;
	this.y0 = y0;
	this.open(null, null, forcePageBreaks, keepOpen, id, pageFormat, cells);
};

/**
 * Function: getPageClassCss
 * 
 * Gets the CSS for the given page CSS class and page format.
 */
mxPrintPreview.prototype.getPageClassCss = function(pageClass, pageFormat)
{
	var pm = this.pageMargin;
	var ppi = this.pixelsPerInch;
	var size = ((pageFormat.width / ppi)).toFixed(2) + 'in ' +
		((pageFormat.height / ppi)).toFixed(2) + 'in';

	var css = '@page ' + pageClass + ' {\n' +
		'  margin: 0;\n' +
		'  size: ' + mxUtils.htmlEntities(size) + ';\n' +
		'}\n' +
		'.' + pageClass + ' {\n' +
		'  page: ' + pageClass + ';\n' +
		((mxClient.IS_SF) ?
			'  padding: ' + mxUtils.htmlEntities((pm / ppi).toFixed(2)) + 'in;\n' : '') +
		'  width: ' + mxUtils.htmlEntities(((pageFormat.width /
			ppi)).toFixed(2)) + 'in;\n' +
		'  height: ' + mxUtils.htmlEntities(((pageFormat.height /
			ppi)).toFixed(2)) + 'in;\n' +
		'}\n';
	
	if (!mxClient.IS_SF)
	{
		css += '.' + pageClass + ' > svg {\n' +
		'  margin: ' + mxUtils.htmlEntities((pm / ppi).toFixed(2)) + 'in;\n' +
		'}\n';
	}

	return css;
};

/**
 * Function: open
 * 
 * Shows the print preview window. The window is created here if it does
 * not exist.
 * 
 * Parameters:
 * 
 * css - Optional CSS string to be used in the head section.
 * targetWindow - Optional window that should be used for rendering. If
 * this is specified then no HEAD tag, CSS and BODY tag will be written.
 */
mxPrintPreview.prototype.open = function(css, targetWindow, forcePageBreaks, keepOpen, id, pageFormat, cells)
{
	var div = null;

	try
	{
		// Closing the window while the page is being rendered may cause an
		// exception in IE. This and any other exceptions are simply ignored.
		var previousInitializeOverlay = this.graph.cellRenderer.initializeOverlay;
		var customPageFormat = pageFormat != null;
		pageFormat = mxRectangle.fromRectangle((pageFormat != null) ? pageFormat : this.pageFormat);
	
		// Adds 1 px border for pagination to match rendering in application
		var pw = pageFormat.width + 1;
		var ph = pageFormat.height + 1;

		// Temporarily overrides the method to redirect rendering of overlays
		// to the draw pane so that they are visible in the printout
		if (this.printOverlays)
		{
			this.graph.cellRenderer.initializeOverlay = function(state, overlay)
			{
				overlay.init(state.view.getDrawPane());
			};
		}
		
		if (this.printControls)
		{
			this.graph.cellRenderer.initControl = function(state, control, handleEvents, clickHandler)
			{
				control.dialect = state.view.graph.dialect;
				control.init(state.view.getDrawPane());
			};
		}
		
		this.wnd = (targetWindow != null) ? targetWindow : this.wnd;
		var isNewWindow = false;
		
		if (this.wnd == null)
		{
			isNewWindow = true;
			this.wnd = window.open();
		}
		
		var doc = this.wnd.document;
		
		if (isNewWindow)
		{
			var dt = this.getDoctype();
			
			if (dt != null && dt.length > 0)
			{
				doc.writeln(dt);
			}
			
			if (document.compatMode === 'CSS1Compat')
			{
				doc.writeln('<!DOCTYPE html>');
			}
			
			doc.writeln('<html>');
			doc.writeln('<head>');
			this.writeHead(doc, css);
			doc.writeln('</head>');
			doc.writeln('<body>');
		}

		// Computes the horizontal and vertical page count
		var bounds = mxRectangle.fromRectangle((cells != null) ?
			this.graph.getBoundingBox(cells) : this.graph.getGraphBounds());
		var currentScale = this.graph.getView().getScale();
		var sc = currentScale / this.scale;
		var tr = this.graph.getView().getTranslate();
		
		// Uses the absolute origin with no offset for all printing
		if (!this.autoOrigin)
		{
			this.x0 -= tr.x * this.scale;
			this.y0 -= tr.y * this.scale;
			bounds.width += bounds.x;
			bounds.height += bounds.y;
			bounds.x = 0;
			bounds.y = 0;
			this.border = 0;
		}
		
		// Store the available page area
		var availableWidth = pw - (this.border * 2);
		var availableHeight = ph - (this.border * 2);

		// Adds margins to page format
		ph += this.marginTop + this.marginBottom;

		// Compute the unscaled, untranslated bounds to find
		// the number of vertical and horizontal pages
		bounds.width /= sc;
		bounds.height /= sc;

		var hpages = Math.max(1, Math.ceil((bounds.width + this.x0) / availableWidth));
		var vpages = Math.max(1, Math.ceil((bounds.height + this.y0) / availableHeight));
		this.pageCount = hpages * vpages;
		var pageClass = null;

		// Adds CSS for individual page formats
		if (customPageFormat)
		{
			if (this.pendingCss == null)
			{
				this.pageFormatClass = {};
				this.pendingCss = '';
			}

			pageClass = mxUtils.htmlEntities('gePageFormat-' +
				String(pageFormat.width).replaceAll('.', '_') + '-' +
				String(pageFormat.height).replaceAll('.', '_'));

			if (this.pageFormatClass[pageClass] == null)
			{
				this.pageFormatClass[pageClass] = true;
				this.pendingCss += this.getPageClassCss(pageClass, pageFormat);
			}
		}

		var addPage = mxUtils.bind(this, function(div)
		{
			// Border of the DIV (aka page) inside the document
			if (this.borderColor != null)
			{
				div.style.borderColor = this.borderColor;
				div.style.borderStyle = 'solid';
				div.style.borderWidth = '1px';
			}
			
			// Needs to be assigned directly because IE doesn't support
			// child selectors, eg. body > div { background: white; }
			div.style.background = this.backgroundColor;
			
			if (pageClass != null)
			{
				div.classList.add(pageClass);
			}
			else
			{
				div.style.width = pageFormat.width + 'px';
				div.style.height = pageFormat.height + 'px';
			}
			
			doc.body.appendChild(div);
		});
		
		var cov = this.getCoverPages(pw, ph);
		
		if (cov != null)
		{
			for (var i = 0; i < cov.length; i++)
			{
				addPage(cov[i], true);
			}
		}
		
		var apx = this.getAppendices(pw, ph);

		// Appends each page to the page output for printing, making
		// sure there will be a page break after each page (ie. div)
		for (var i = 0; i < vpages; i++)
		{
			var dy = i * availableHeight / this.scale - this.y0 / this.scale +
				(bounds.y - tr.y * currentScale) / currentScale - i;
			
			for (var j = 0; j < hpages; j++)
			{
				if (this.wnd == null)
				{
					return null;
				}
				
				var dx = j * availableWidth / this.scale - this.x0 / this.scale +
					(bounds.x - tr.x * currentScale) / currentScale - j;
				var pageNum = i * hpages + j + 1;
				div = doc.createElement('div');
				div.style.display = 'flex';
				div.style.alignItems = 'center';
				div.style.justifyContent = 'center';
				var clip = new mxRectangle(dx, dy, availableWidth, availableHeight);
				this.addGraphFragment(-dx, -dy, this.scale, pageNum, div, clip);

				// Adds given ID as anchor for internal links in first page
				if (id != null && i == 0 && j == 0)
				{
					div.setAttribute('id', id);
				}

				addPage(div, true);
			}
		}

		if (apx != null)
		{
			for (var i = 0; i < apx.length; i++)
			{
				addPage(apx[i], i < apx.length - 1);
			}
		}

		if (isNewWindow && !keepOpen)
		{
			this.closeDocument();
		}
		
		this.wnd.focus();
	}
	catch (e)
	{
		// Removes the DIV from the document in case of an error
		if (div != null && div.parentNode != null)
		{
			div.parentNode.removeChild(div);
		}

		if (window.console != null)
		{
			console.error(e);
		}
	}
	finally
	{
		this.graph.cellRenderer.initializeOverlay = previousInitializeOverlay;
	}

	return this.wnd;
};

/**
 * Function: addPendingCss
 * 
 * Writes any pending CSS to the document.
 */
mxPrintPreview.prototype.addPendingCss = function(doc)
{
	if (this.pendingCss != null)
	{
		var style = doc.createElement('style');
		style.setAttribute('type', 'text/css');
		style.appendChild(doc.createTextNode(this.pendingCss));
		var head = doc.getElementsByTagName('head')[0];
		head.appendChild(style);
		this.pendingCss = null;
	}
};

/**
 * Function: closeDocument
 * 
 * Writes the closing tags for body and page after calling <writePostfix>.
 */
mxPrintPreview.prototype.closeDocument = function()
{
	try
	{
		if (this.wnd != null && this.wnd.document != null)
		{
			var doc = this.wnd.document;
			
			this.writePostfix(doc);
			doc.writeln('</body>');
			doc.writeln('</html>');
			doc.close();
			this.addPendingCss(doc);
			
			// Removes all event handlers in the print output
			mxEvent.release(doc.body);
		}
	}
	catch (e)
	{
		// ignore any errors resulting from wnd no longer being available
	}
};

/**
 * Function: writeHead
 * 
 * Writes the HEAD section into the given document, without the opening
 * and closing HEAD tags.
 */
mxPrintPreview.prototype.writeHead = function(doc, css)
{
	if (this.title != null)
	{
		doc.writeln('<title>' + mxUtils.htmlEntities(this.title) + '</title>');
	}
	
	// Adds all required stylesheets
	mxClient.link('stylesheet', mxClient.basePath + '/css/common.css', doc);
	
	// Removes horizontal rules and page selector from print output
	doc.writeln('<style type="text/css">');
	doc.writeln(this.defaultCss);
	var pf = this.pageFormat;

	// Sets printer defaults
	if (this.addPageCss && pf != null)
	{
		var size = ((pf.width / this.pixelsPerInch)).toFixed(2) + 'in ' +
			((pf.height / this.pixelsPerInch)).toFixed(2) + 'in';

		doc.writeln('@page {');
		doc.writeln('  margin: ' +
			mxUtils.htmlEntities((this.pageMargin /
				this.pixelsPerInch).toFixed(2)) + 'in;');
		doc.writeln('  size: ' + mxUtils.htmlEntities(size) + ';');
		doc.writeln('}');
	}

	if (css != null)
	{
		doc.writeln(mxUtils.htmlEntities(css, false, false, false));
	}
	
	doc.writeln('</style>');
};

/**
 * Function: writePostfix
 * 
 * Called before closing the body of the page. This implementation is empty.
 */
mxPrintPreview.prototype.writePostfix = function(doc)
{
	// empty
};

/**
 * Function: getRoot
 * 
 * Returns the root cell for painting the graph.
 */
mxPrintPreview.prototype.getRoot = function()
{
	var root = this.graph.view.currentRoot;
	
	if (root == null)
	{
		root = this.graph.getModel().getRoot();
	}
	
	return root;
};

/**
 * Function: useCssTransforms
 * 
 * Returns true if CSS transforms should be used for scaling content.
 * This returns true if foreignObject is supported and we're not in Safari
 * as it has clipping bugs for transformed CSS content with foreignObjects.
 */
mxPrintPreview.prototype.useCssTransforms = function()
{
	return !mxClient.NO_FO && !mxClient.IS_SF;
};

/**
 * Function: isCellVisible
 * 
 * Returns true if the given cell should be painted. This returns true.
 * 
 * Parameters:
 * 
 * cell - <mxCell> whose visible state should be checked.
 */
mxPrintPreview.prototype.isCellVisible = function(cell)
{
	return true;
};

/**
 * Function: drawBackgroundImage
 * 
 * Draws the given background image.
 */
mxPrintPreview.prototype.drawBackgroundImage = function(img)
{
	img.redraw();
};

/**
 * Function: addGraphFragment
 * 
 * Adds a graph fragment to the given div.
 * 
 * Parameters:
 * 
 * dx - Horizontal translation for the diagram.
 * dy - Vertical translation for the diagram.
 * scale - Scale for the diagram.
 * pageNumber - Number of the page to be rendered.
 * div - Div that contains the output.
 * clip - Contains the clipping rectangle as an <mxRectangle>.
 */
mxPrintPreview.prototype.addGraphFragment = function(dx, dy, scale, pageNumber, div, clip)
{
	var view = this.graph.getView();
	var previousContainer = this.graph.container;
	this.graph.container = div;
	
	var canvas = view.getCanvas();
	var backgroundPane = view.getBackgroundPane();
	var drawPane = view.getDrawPane();
	var overlayPane = view.getOverlayPane();
	var realScale = scale;

	if (this.graph.dialect == mxConstants.DIALECT_SVG)
	{
		view.createSvg();
		
		// Uses CSS transform for scaling
		if (this.useCssTransforms())
		{
			var g = view.getDrawPane().parentNode;
			g.setAttribute('transformOrigin', '0 0');
			g.setAttribute('transform', 'scale(' + scale + ',' + scale + ')' +
				'translate(' + dx + ',' + dy + ')');
			
			scale = 1;
			dx = 0;
			dy = 0;
		}
	}
	else
	{
		view.createHtml();
	}
	
	// Disables events on the view
	var eventsEnabled = view.isEventsEnabled();
	view.setEventsEnabled(false);
	
	// Disables the graph to avoid cursors
	var graphEnabled = this.graph.isEnabled();
	this.graph.setEnabled(false);

	// Resets the translation
	var translate = view.getTranslate();
	view.translate = new mxPoint(dx, dy);

	// Avoids destruction of existing handlers
	var updateHandler = this.graph.selectionCellsHandler.updateHandler;
	this.graph.selectionCellsHandler.updateHandler = function() {};
	
	// Redraws only states that intersect the clip
	var redraw = this.graph.cellRenderer.redraw;
	var states = view.states;
	var s = view.scale;

	var bgImg = null;

	if (this.printBackgroundImage)
	{
		var bg = this.getBackgroundImage();
		
		if (bg != null)
		{
			var bounds = new mxRectangle(
				Math.round(dx * s + bg.x),
				Math.round(dy * s + bg.y),
				bg.width - 1, bg.height - 1);
			
			var bgImg = new mxImageShape(bounds, bg.src);
			bgImg.dialect = this.graph.dialect;
		}
	}

	// Gets the transformed clip for intersection check below
	if (this.clipping)
	{
		var tempClip = new mxRectangle(
			(clip.x + translate.x + 1.5) * s,
			(clip.y + translate.y + 1.5) * s,
			(clip.width - 1.5) * s / realScale,
			(clip.height - 1.5) * s / realScale);
		var self = this;

		// Checks clipping rectangle for speedup
		// Must create terminal states for edge clipping even if terminal outside of clip
		this.graph.cellRenderer.redraw = function(state, force, rendering)
		{
			if (state != null)
			{
				// Gets original state from graph to find bounding box
				var orig = states.get(state.cell);
				
				if (orig != null)
				{
					var bbox = view.getBoundingBox(orig, false);

					// Stops rendering if outside clip for speedup but ignores
					// edge labels where width and height is set to 0
					if (bbox != null && bbox.width > 0 && bbox.height > 0 &&
						!mxUtils.intersects(tempClip, bbox))
					{
						return;
					}
				}

				if (!self.isCellVisible(state.cell))
				{
					return;
				}	
			}

			redraw.apply(this, arguments);
		};

		if (bgImg != null)
		{
			var temp = new mxRectangle(
				bgImg.bounds.x * s + (translate.x - dx) * s,
				bgImg.bounds.y * s + (translate.y - dy) * s,
				bgImg.bounds.width * s,
				bgImg.bounds.height * s);
			
			if (!mxUtils.intersects(tempClip, temp))
			{
				bgImg = null;
			}
		}
	}

	if (bgImg != null)
	{
		bgImg.init(view.backgroundPane);
		this.drawBackgroundImage(bgImg);
	}
	
	var temp = null;
	
	try
	{
		// Creates the temporary cell states in the view and
		// draws them onto the temporary DOM nodes in the view
		var cells = [this.getRoot()];
		temp = new mxTemporaryCellStates(view, scale, cells, null, mxUtils.bind(this, function(state)
		{
			return this.getLinkForCellState(state);
		}));
	}
	finally
	{
		// Removes everything but the SVG node
		var tmp = div.firstChild;

		while (tmp != null)
		{
			var next = tmp.nextSibling;
			var name = tmp.nodeName.toLowerCase();

			if (name == 'svg')
			{
				tmp.style.top = '';
				tmp.style.left = '';
				tmp.style.width = '';
				tmp.style.height = '';
				tmp.style.display = '';
				tmp.style.maxWidth = '100%';
				tmp.style.maxHeight = '100%';
				tmp.style.overflow = (mxClient.IS_SF) ? 'hidden' : 'clip';
				tmp.style.overflowClipMargin = this.overflowClipMargin;
				tmp.setAttribute('viewBox', '0 0 ' +
					((mxClient.IS_SF) ?
					((clip.width + 1) + ' ' + (clip.height + 1)) :	
					((clip.width - 1) + ' ' + (clip.height - 1))));

				this.addGrid(tmp, clip);
				
				// Workaround for no dimension in Safari
				if (mxClient.IS_SF)
				{
					if (clip.width > clip.height)
					{
						tmp.style.height = '100%';
					}
					else
					{
						tmp.style.width = '100%';
					}
				}
			}
			// Tries to fetch all text labels and only text labels
			else if (!this.isTextLabel(tmp))
			{
				tmp.parentNode.removeChild(tmp);
			}
			
			tmp = next;
		}
		
		// Completely removes the overlay pane to remove more handles
		view.overlayPane.parentNode.removeChild(view.overlayPane);

		// Restores the state of the view
		this.graph.setEnabled(graphEnabled);
		this.graph.container = previousContainer;
		this.graph.cellRenderer.redraw = redraw;
		this.graph.selectionCellsHandler.updateHandler = updateHandler;
		view.canvas = canvas;
		view.backgroundPane = backgroundPane;
		view.drawPane = drawPane;
		view.overlayPane = overlayPane;
		view.translate = translate;
		temp.destroy();
		view.setEventsEnabled(eventsEnabled);
	}
};

/**
 * Function: addGrid
 * 
 * Returns true if the given node is a test label.
 */
mxPrintPreview.prototype.addGrid = function(svg, clip)
{
	if (this.gridSize > 0 && this.gridSteps > 0 && this.gridColor != null)
	{
		var grid = this.createSvgGrid(svg, clip);
		var defsElt = mxUtils.getSvgDefs(svg);
		
		if (defsElt.nextSibling != null)
		{
			defsElt.parentNode.insertBefore(grid, defsElt.nextSibling);
		}
		else
		{
			defsElt.parentNode.appendChild(grid);
		}
	}
};

/**
 * Function: createSvgGrid
 * 
 * Creates the SVG grid.
 */
mxPrintPreview.prototype.createSvgGrid = function(svg, clip)
{
	var size = this.gridSize;
	var svgDoc = svg.ownerDocument;
	var group = (svgDoc.createElementNS != null) ?
		svgDoc.createElementNS(mxConstants.NS_SVG, 'g') :
		svgDoc.createElement('g');

	var xp = mxUtils.mod(Math.ceil(Math.round(clip.x) / size), this.gridSteps);
	var x = mxUtils.mod(size - mxUtils.mod(Math.round(clip.x), size), size);

	var yp = mxUtils.mod(Math.ceil(Math.round(clip.y) / size), this.gridSteps);
	var y = mxUtils.mod(size - mxUtils.mod(Math.round(clip.y), size), size);
	
	x *= this.scale;
	y *= this.scale;
	size *= this.scale;

	var hlines = Math.ceil(clip.height / size);

	for (var i = 0; i < hlines; i++)
	{
		var line = (svgDoc.createElementNS != null) ?
			svgDoc.createElementNS(mxConstants.NS_SVG, 'line') :
			svgDoc.createElement('line');
		line.setAttribute('x1', 0);
		line.setAttribute('y1', (i * size) + y);
		line.setAttribute('x2', clip.width);
		line.setAttribute('y2', (i * size) + y);
		line.setAttribute('stroke', this.gridColor);
		line.setAttribute('opacity', (mxUtils.mod(i + yp,
			this.gridSteps) == 0) ? '1' : '0.2');
		line.setAttribute('stroke-width', '0.5');
		group.appendChild(line);
	}

	var vlines = Math.ceil(clip.width / size);

	for (var i = 0; i < vlines; i++)
	{
		var line = (svgDoc.createElementNS != null) ?
			svgDoc.createElementNS(mxConstants.NS_SVG, 'line') :
			svgDoc.createElement('line');
		line.setAttribute('x1', (i * size) + x);
		line.setAttribute('y1', 0);
		line.setAttribute('x2', (i * size) + x);
		line.setAttribute('y2', clip.height);
		line.setAttribute('stroke', this.gridColor);
		line.setAttribute('opacity', (mxUtils.mod(i + xp,
			this.gridSteps) == 0) ? '1' : '0.2');
		line.setAttribute('stroke-width', '0.5');
		group.appendChild(line);
	}

	return group;
};

/**
 * Function: isTextLabel
 * 
 * Returns true if the given node is a test label.
 */
mxPrintPreview.prototype.isTextLabel = function(node)
{
	return tmp.style.cursor == 'default' || node.nodeName.toLowerCase() == 'div';
};

/**
 * Function: getLinkForCellState
 * 
 * Returns the link for the given cell state. This returns null.
 */
mxPrintPreview.prototype.getLinkForCellState = function(state)
{
	return this.graph.getLinkForCell(state.cell);
};

/**
 * Function: getBackgroundImage
 * 
 * Returns the current background image.
 */
mxPrintPreview.prototype.getBackgroundImage = function()
{
	return this.graph.backgroundImage;
};

/**
 * Function: getCoverPages
 * 
 * Returns the pages to be added before the print output. This returns null.
 */
mxPrintPreview.prototype.getCoverPages = function()
{
	return null;
};

/**
 * Function: getAppendices
 * 
 * Returns the pages to be added after the print output. This returns null.
 */
mxPrintPreview.prototype.getAppendices = function()
{
	return null;
};

/**
 * Function: print
 * 
 * Opens the print preview and shows the print dialog.
 * 
 * Parameters:
 * 
 * css - Optional CSS string to be used in the head section.
 */
mxPrintPreview.prototype.print = function(css)
{
	var wnd = this.open(css);
	
	if (wnd != null)
	{
		wnd.print();
	}
};

/**
 * Function: close
 * 
 * Closes the print preview window.
 */
mxPrintPreview.prototype.close = function()
{
	if (this.wnd != null)
	{
		this.wnd.close();
		this.wnd = null;
	}
};
