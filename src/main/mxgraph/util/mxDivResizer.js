/**
 * Copyright (c) 2006-2015, JGraph Ltd
 * Copyright (c) 2006-2015, Gaudenz Alder
 */
/**
 * Class: mxDivResizer
 * 
 * Maintains the size of a div element in Internet Explorer. This is a
 * workaround for the right and bottom style being ignored in IE.
 * 
 * If you need a div to cover the scrollwidth and -height of a document,
 * then you can use this class as follows:
 * 
 * (code)
 * var resizer = new mxDivResizer(background);
 * resizer.getDocumentHeight = function()
 * {
 *   return document.body.scrollHeight;
 * }
 * resizer.getDocumentWidth = function()
 * {
 *   return document.body.scrollWidth;
 * }
 * resizer.resize();
 * (end)
 * 
 * Constructor: mxDivResizer
 * 
 * Constructs an object that maintains the size of a div
 * element when the window is being resized. This is only
 * required for Internet Explorer as it ignores the respective
 * stylesheet information for DIV elements.
 * 
 * Parameters:
 * 
 * div - Reference to the DOM node whose size should be maintained.
 * container - Optional Container that contains the div. Default is the
 * window.
 */
function mxDivResizer(div, container)
{
	if (div.nodeName.toLowerCase() == 'div')
	{
		if (container == null)
		{
			container = window;
		}

		this.div = div;
		var style = mxUtils.getCurrentStyle(div);
		
		if (style != null)
		{
			this.resizeWidth = style.width == 'auto';
			this.resizeHeight = style.height == 'auto';
		}
		
		mxEvent.addListener(container, 'resize',
			mxUtils.bind(this, function(evt)
			{
				if (!this.handlingResize)
				{
					this.handlingResize = true;
					this.resize();
					this.handlingResize = false;
				}
			})
		);
		
		this.resize();
	}
};

/**
 * Function: resizeWidth
 * 
 * Boolean specifying if the width should be updated.
 */
mxDivResizer.prototype.resizeWidth = true;

/**
 * Function: resizeHeight
 * 
 * Boolean specifying if the height should be updated.
 */
mxDivResizer.prototype.resizeHeight = true;

/**
 * Function: handlingResize
 * 
 * Boolean specifying if the width should be updated.
 */
mxDivResizer.prototype.handlingResize = false;

/**
 * Function: resize
 * 
 * Updates the style of the DIV after the window has been resized.
 */
mxDivResizer.prototype.resize = function()
{
	var w = this.getDocumentWidth();
	var h = this.getDocumentHeight();

	var l = parseInt(this.div.style.left);
	var r = parseInt(this.div.style.right);
	var t = parseInt(this.div.style.top);
	var b = parseInt(this.div.style.bottom);
	
	if (this.resizeWidth &&
		!isNaN(l) &&
		!isNaN(r) &&
		l >= 0 &&
		r >= 0 &&
		w - r - l > 0)
	{
		this.div.style.width = (w - r - l)+'px';
	}
	
	if (this.resizeHeight &&
		!isNaN(t) &&
		!isNaN(b) &&
		t >= 0 &&
		b >= 0 &&
		h - t - b > 0)
	{
		this.div.style.height = (h - t - b)+'px';
	}
};

/**
 * Function: getDocumentWidth
 * 
 * Hook for subclassers to return the width of the document (without
 * scrollbars).
 */
mxDivResizer.prototype.getDocumentWidth = function()
{
	return document.body.clientWidth;
};

/**
 * Function: getDocumentHeight
 * 
 * Hook for subclassers to return the height of the document (without
 * scrollbars).
 */
mxDivResizer.prototype.getDocumentHeight = function()
{
	return document.body.clientHeight;
};
