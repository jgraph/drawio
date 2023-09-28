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
 * Additional pages:
 * 
 * To add additional pages before and after the output, <getCoverPages> and
 * <getAppendices> can be used, respectively.
 * 
 * (code)
 * var preview = new mxPrintPreview(graph, 1);
 * 
 * preview.getCoverPages = function(w, h)
 * {
 *   return [this.renderPage(w, h, 0, 0, mxUtils.bind(this, function(div)
 *   {
 *     div.innerHTML = '<div style="position:relative;margin:4px;">Cover Page</p>'
 *   }))];
 * };
 * 
 * preview.getAppendices = function(w, h)
 * {
 *   return [this.renderPage(w, h, 0, 0, mxUtils.bind(this, function(div)
 *   {
 *     div.innerHTML = '<div style="position:relative;margin:4px;">Appendix</p>'
 *   }))];
 * };
 * 
 * preview.open();
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
 * Headers:
 * 
 * Apart from setting the title argument in the mxPrintPreview constructor you
 * can override <renderPage> as follows to add a header to any page:
 * 
 * (code)
 * var oldRenderPage = mxPrintPreview.prototype.renderPage;
 * mxPrintPreview.prototype.renderPage = function(w, h, x, y, content, pageNumber)
 * {
 *   var div = oldRenderPage.apply(this, arguments);
 *   
 *   var header = document.createElement('div');
 *   header.style.position = 'absolute';
 *   header.style.top = '0px';
 *   header.style.width = '100%';
 *   header.style.textAlign = 'right';
 *   mxUtils.write(header, 'Your header here');
 *   div.firstChild.appendChild(header);
 *   
 *   return div;
 * };
 * (end)
 * 
 * The pageNumber argument contains the number of the current page, starting at
 * 1. To display a header on the first page only, check pageNumber and add a
 * vertical offset in the constructor call for the height of the header.
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
 * CSS page size ratio. Default is 90.
 */
mxPrintPreview.prototype.pixelsPerInch = 90;

/**
 * Variable: pageMargin
 * 
 * CSS page margin. Default is 0.2.
 *
 * Uses 90 to avoid blank pages in the actual print output.
 */
mxPrintPreview.prototype.pageMargin = 0.2;

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
 * 
 * Parameters:
 * 
 * css - Optional CSS string to be used in the head section.
 * targetWindow - Optional window that should be used for rendering. If
 * this is specified then no HEAD tag, CSS and BODY tag will be written.
 */
mxPrintPreview.prototype.appendGraph = function(graph, scale, x0, y0, forcePageBreaks, keepOpen, id)
{
	this.graph = graph;
	this.scale = (scale != null) ? scale : 1 / graph.pageScale;
	this.x0 = x0;
	this.y0 = y0;
	this.open(null, null, forcePageBreaks, keepOpen, id);
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
mxPrintPreview.prototype.open = function(css, targetWindow, forcePageBreaks, keepOpen, id)
{
	// Closing the window while the page is being rendered may cause an
	// exception in IE. This and any other exceptions are simply ignored.
	var previousInitializeOverlay = this.graph.cellRenderer.initializeOverlay;
	var div = null;
	
	try
	{
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
			doc.writeln('<body class="mxPage">');
		}

		// Computes the horizontal and vertical page count
		var bounds = mxRectangle.fromRectangle(this.graph.getGraphBounds());
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
		var availableWidth = this.pageFormat.width - (this.border * 2);
		var availableHeight = this.pageFormat.height - (this.border * 2);
	
		// Adds margins to page format
		this.pageFormat.height += this.marginTop + this.marginBottom;

		// Compute the unscaled, untranslated bounds to find
		// the number of vertical and horizontal pages
		bounds.width /= sc;
		bounds.height /= sc;

		var hpages = Math.max(1, Math.ceil((bounds.width + this.x0) / availableWidth));
		var vpages = Math.max(1, Math.ceil((bounds.height + this.y0) / availableHeight));
		this.pageCount = hpages * vpages;
		
		var writePageSelector = mxUtils.bind(this, function()
		{
			if (this.pageSelector && (vpages > 1 || hpages > 1))
			{
				var table = this.createPageSelector(vpages, hpages);
				doc.body.appendChild(table);
				
				// Implements position: fixed in IE quirks mode
				if (mxClient.IS_IE && doc.documentMode == null || doc.documentMode == 5 || doc.documentMode == 8 || doc.documentMode == 7)
				{
					table.style.position = 'absolute';
					
					var update = function()
					{
						table.style.top = ((doc.body.scrollTop || doc.documentElement.scrollTop) + 10) + 'px';
					};
					
					mxEvent.addListener(this.wnd, 'scroll', function(evt)
					{
						update();
					});
					
					mxEvent.addListener(this.wnd, 'resize', function(evt)
					{
						update();
					});
				}
			}
		});
		
		var addPage = mxUtils.bind(this, function(div, addBreak)
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
			
			if (forcePageBreaks || addBreak)
			{
				div.style.pageBreakAfter = 'always';
			}

			// NOTE: We are dealing with cross-window DOM here, which
			// is a problem in IE, so we copy the HTML markup instead.
			// The underlying problem is that the graph display markup
			// creation (in mxShape, mxGraphView) is hardwired to using
			// document.createElement and hence we must use this document
			// to create the complete page and then copy it over to the
			// new window.document. This can be fixed later by using the
			// ownerDocument of the container in mxShape and mxGraphView.
			if (isNewWindow && (mxClient.IS_IE || document.documentMode >= 11 || mxClient.IS_EDGE))
			{
				// For some obscure reason, removing the DIV from the
				// parent before fetching its outerHTML has missing
				// fillcolor properties and fill children, so the div
				// must be removed afterwards to keep the fillcolors.
				doc.writeln(div.outerHTML);
				div.parentNode.removeChild(div);
			}
			else if (mxClient.IS_IE || document.documentMode >= 11 || mxClient.IS_EDGE)
			{
				var clone = doc.createElement('div');
				clone.innerHTML = div.outerHTML;
				clone = clone.getElementsByTagName('div')[0];
				doc.body.appendChild(clone);
				div.parentNode.removeChild(div);
			}
			else
			{
				div.parentNode.removeChild(div);
				doc.body.appendChild(div);
			}

			if (forcePageBreaks || addBreak)
			{
				this.addPageBreak(doc);
			}
		});
		
		var cov = this.getCoverPages(this.pageFormat.width, this.pageFormat.height);
		
		if (cov != null)
		{
			for (var i = 0; i < cov.length; i++)
			{
				addPage(cov[i], true);
			}
		}
		
		var apx = this.getAppendices(this.pageFormat.width, this.pageFormat.height);
		
		// Appends each page to the page output for printing, making
		// sure there will be a page break after each page (ie. div)
		for (var i = 0; i < vpages; i++)
		{
			var dy = i * availableHeight / this.scale - this.y0 / this.scale +
					(bounds.y - tr.y * currentScale) / currentScale;
			
			for (var j = 0; j < hpages; j++)
			{
				if (this.wnd == null)
				{
					return null;
				}
				
				var dx = j * availableWidth / this.scale - this.x0 / this.scale +
						(bounds.x - tr.x * currentScale) / currentScale;
				var pageNum = i * hpages + j + 1;
				var clip = new mxRectangle(dx, dy, availableWidth, availableHeight);
				div = this.renderPage(this.pageFormat.width, this.pageFormat.height, 0, 0, mxUtils.bind(this, function(div)
				{
					this.addGraphFragment(-dx, -dy, this.scale, pageNum, div, clip);
					
					if (this.printBackgroundImage)
					{
						this.insertBackgroundImage(div, -dx, -dy);
					}
				}), pageNum);

				// Adds given ID as anchor for links
				if (id != null && i == 0)
				{
					var anchor = doc.createElement('a');
					anchor.setAttribute('id', id);
					div.insertBefore(anchor, div.firstChild);
				}

				// Gives the page a unique ID for the page selector
				if (isNewWindow && !keepOpen)
				{
					div.setAttribute('id', 'mxPage-' + pageNum);
				}

				addPage(div, apx != null || i < vpages - 1 || j < hpages - 1);
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
			writePageSelector();
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
	}
	finally
	{
		this.graph.cellRenderer.initializeOverlay = previousInitializeOverlay;
	}

	return this.wnd;
};

/**
 * Function: addPageBreak
 * 
 * Adds a page break to the given document.
 */
mxPrintPreview.prototype.addPageBreak = function(doc)
{
	var hr = doc.createElement('hr');
	hr.className = 'mxPageBreak';
	doc.body.appendChild(hr);
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
		doc.writeln('<title>' + this.title + '</title>');
	}
	
	// Adds all required stylesheets
	mxClient.link('stylesheet', mxClient.basePath + '/css/common.css', doc);

	// Removes horizontal rules and page selector from print output
	doc.writeln('<style type="text/css">');
	doc.writeln('@media print {');
	doc.writeln('  * { -webkit-print-color-adjust: exact; }');
	doc.writeln('  table.mxPageSelector { display: none; }');
	doc.writeln('  hr.mxPageBreak { display: none; }');
	doc.writeln('}');
	doc.writeln('@media screen {');
	
	// NOTE: position: fixed is not supported in IE, so the page selector
	// position (absolute) needs to be updated in IE (see below)
	doc.writeln('  table.mxPageSelector { position: fixed; right: 10px; top: 10px;' +
			'font-family: Arial; font-size:10pt; border: solid 1px darkgray;' +
			'background: white; border-collapse:collapse; }');
	doc.writeln('  table.mxPageSelector td { border: solid 1px gray; padding:4px; }');
	doc.writeln('  body.mxPage { background: gray; }');
	doc.writeln('}');

	var pf = this.pageFormat;
	
	// Sets printer defaults
	if (this.addPageCss && pf != null)
	{
		var size = ((pf.width / this.pixelsPerInch) + this.pageMargin).toFixed(2) + 'in ' +
			((pf.height / this.pixelsPerInch) + this.pageMargin).toFixed(2) + 'in;';

		doc.writeln('@page {');
		doc.writeln('  margin: ' + this.pageMargin + 'in;');
		doc.writeln('  size: ' + size);
		doc.writeln('}');
	}

	if (css != null)
	{
		doc.writeln(css);
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
 * Function: createPageSelector
 * 
 * Creates the page selector table.
 */
mxPrintPreview.prototype.createPageSelector = function(vpages, hpages)
{
	var doc = this.wnd.document;
	var table = doc.createElement('table');
	table.className = 'mxPageSelector';
	table.setAttribute('border', '0');

	var tbody = doc.createElement('tbody');
	
	for (var i = 0; i < vpages; i++)
	{
		var row = doc.createElement('tr');
		
		for (var j = 0; j < hpages; j++)
		{
			var pageNum = i * hpages + j + 1;
			var cell = doc.createElement('td');
			var a = doc.createElement('a');
			a.setAttribute('href', '#mxPage-' + pageNum);

			// Workaround for FF where the anchor is appended to the URL of the original document
			if (mxClient.IS_NS && !mxClient.IS_SF && !mxClient.IS_GC)
			{
				var js = 'var page = document.getElementById(\'mxPage-' + pageNum + '\');page.scrollIntoView(true);event.preventDefault();';
				a.setAttribute('onclick', js);
			}
			
			mxUtils.write(a, pageNum, doc);
			cell.appendChild(a);
			row.appendChild(cell);
		}
		
		tbody.appendChild(row);
	}
	
	table.appendChild(tbody);
	
	return table;
};

/**
 * Function: renderPage
 * 
 * Creates a DIV that prints a single page of the given
 * graph using the given scale and returns the DIV that
 * represents the page.
 * 
 * Parameters:
 * 
 * w - Width of the page in pixels.
 * h - Height of the page in pixels.
 * dx - Optional horizontal page offset in pixels (used internally).
 * dy - Optional vertical page offset in pixels (used internally).
 * content - Callback that adds the HTML content to the inner div of a page.
 * Takes the inner div as the argument.
 * pageNumber - Integer representing the page number.
 */
mxPrintPreview.prototype.renderPage = function(w, h, dx, dy, content, pageNumber)
{
	var doc = this.wnd.document;
	var div = document.createElement('div');
	var arg = null;

	try
	{
		// Workaround for ignored clipping in IE 9 standards
		// when printing with page breaks and HTML labels.
		if (dx != 0 || dy != 0)
		{
			div.style.position = 'relative';
			div.style.width = w + 'px';
			div.style.height = h + 'px';
			div.style.pageBreakInside = 'avoid';
			
			var innerDiv = document.createElement('div');
			innerDiv.style.position = 'relative';
			innerDiv.style.top = this.border + 'px';
			innerDiv.style.left = this.border + 'px';
			innerDiv.style.width = (w - 2 * this.border) + 'px';
			innerDiv.style.height = (h - 2 * this.border) + 'px';
			innerDiv.style.overflow = 'hidden';
			
			var viewport = document.createElement('div');
			viewport.style.position = 'relative';
			viewport.style.marginLeft = dx + 'px';
			viewport.style.marginTop = dy + 'px';

			// FIXME: IE8 standards output problems
			if (doc.documentMode == 8)
			{
				innerDiv.style.position = 'absolute';
				viewport.style.position = 'absolute';
			}
		
			if (doc.documentMode == 10)
			{
				viewport.style.width = '100%';
				viewport.style.height = '100%';
			}
			
			innerDiv.appendChild(viewport);
			div.appendChild(innerDiv);
			document.body.appendChild(div);
			arg = viewport;
		}
		// FIXME: IE10/11 too many pages
		else
		{
			div.style.width = w + 'px';
			div.style.height = h + 'px';
			div.style.overflow = 'hidden';
			div.style.pageBreakInside = 'avoid';
			
			// IE8 uses above branch currently
			if (doc.documentMode == 8)
			{
				div.style.position = 'relative';
			}
			
			var innerDiv = document.createElement('div');
			innerDiv.style.width = (w - 2 * this.border) + 'px';
			innerDiv.style.height = (h - 2 * this.border) + 'px';
			innerDiv.style.overflow = 'hidden';

			if (mxClient.IS_IE && (doc.documentMode == null || doc.documentMode == 5 ||
				doc.documentMode == 8 || doc.documentMode == 7))
			{
				innerDiv.style.marginTop = this.border + 'px';
				innerDiv.style.marginLeft = this.border + 'px';	
			}
			else
			{
				innerDiv.style.top = this.border + 'px';
				innerDiv.style.left = this.border + 'px';
			}
	
			div.appendChild(innerDiv);
			document.body.appendChild(div);
			arg = innerDiv;
		}
	}
	catch (e)
	{
		div.parentNode.removeChild(div);
		div = null;
		
		throw e;
	}

	content(arg);
	 
	return div;
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
			var prev = g.getAttribute('transform');
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
	
	// Redraws only states that intersect the clip
	var redraw = this.graph.cellRenderer.redraw;
	var states = view.states;
	var s = view.scale;

	// Gets the transformed clip for intersection check below
	if (this.clipping)
	{
		var tempClip = new mxRectangle((clip.x + translate.x) * s, (clip.y + translate.y) * s,
				clip.width * s / realScale, clip.height * s / realScale);
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
		// Removes overlay pane with selection handles
		// controls and icons from the print output
		if (mxClient.IS_IE)
		{
			view.overlayPane.innerText = '';
			view.canvas.style.overflow = 'hidden';
			view.canvas.style.position = 'relative';
			view.canvas.style.top = this.marginTop + 'px';
			view.canvas.style.width = clip.width + 'px';
			view.canvas.style.height = clip.height + 'px';
		}
		else
		{
			// Removes everything but the SVG node
			var tmp = div.firstChild;

			while (tmp != null)
			{
				var next = tmp.nextSibling;
				var name = tmp.nodeName.toLowerCase();

				// Note: Width and height are required in FF 11
				if (name == 'svg')
				{
					tmp.style.overflow = 'hidden';
					tmp.style.position = 'relative';
					tmp.style.top = this.marginTop + 'px';
					tmp.setAttribute('width', clip.width);
					tmp.setAttribute('height', clip.height);
					tmp.style.width = '';
					tmp.style.height = '';
				}
				// Tries to fetch all text labels and only text labels
				else if (tmp.style.cursor != 'default' && name != 'div')
				{
					tmp.parentNode.removeChild(tmp);
				}
				
				tmp = next;
			}
		}
		
		// Puts background image behind SVG output
		if (this.printBackgroundImage)
		{
			var svgs = div.getElementsByTagName('svg');
			
			if (svgs.length > 0)
			{
				svgs[0].style.position = 'absolute';
			}
		}
		
		// Completely removes the overlay pane to remove more handles
		view.overlayPane.parentNode.removeChild(view.overlayPane);

		// Restores the state of the view
		this.graph.setEnabled(graphEnabled);
		this.graph.container = previousContainer;
		this.graph.cellRenderer.redraw = redraw;
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
 * Function: insertBackgroundImage
 * 
 * Inserts the background image into the given div.
 */
mxPrintPreview.prototype.insertBackgroundImage = function(div, dx, dy)
{
	var bg = this.getBackgroundImage();
	
	if (bg != null)
	{
		var img = document.createElement('img');
		img.style.position = 'absolute';
		img.style.marginLeft = Math.round((dx + bg.x) * this.scale) + 'px';
		img.style.marginTop = Math.round((dy + bg.y) * this.scale) + 'px';
		img.setAttribute('width', Math.round(bg.width * this.scale));
		img.setAttribute('height', Math.round(bg.height * this.scale));
		img.src = bg.src;
		
		div.insertBefore(img, div.firstChild);
	}
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
