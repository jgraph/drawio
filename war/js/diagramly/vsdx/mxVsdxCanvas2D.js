/**
 * Copyright (c) 2006-2017, JGraph Ltd
 */
/**
 * Class: mxVsdxCanvas2D
 *
 * Constructor: mxVsdxCanvas2D
 *
 * Constructs a new abstract canvas.
 */
function mxVsdxCanvas2D(root)
{
	mxAbstractCanvas2D.call(this);

	/**
	 * Variable: root
	 * 
	 * Reference to the container for the SVG content.
	 */
	this.root = root;
};

/**
 * Extends mxAbstractCanvas2D
 */
mxUtils.extend(mxVsdxCanvas2D, mxAbstractCanvas2D);



/**
 * Function: createElement
 * 
 * Creates the given element using the owner document of <root>.
 */
mxXmlCanvas2D.prototype.createElement = function(name)
{
	return this.root.ownerDocument.createElement(name);
};

/**
 * Function: moveTo
 * 
 * Moves the current path the given point.
 * 
 * Parameters:
 * 
 * x - Number that represents the x-coordinate of the point.
 * y - Number that represents the y-coordinate of the point.
 */
mxVsdxCanvas2D.prototype.moveTo = function(x, y)
{
	var elem = this.createElement('move');
	elem.setAttribute('x', this.format(x));
	elem.setAttribute('y', this.format(y));
	this.root.appendChild(elem);
	this.lastX = x;
	this.lastY = y;
};

/**
 * Function: lineTo
 * 
 * Draws a line to the given coordinates.
 * 
 * Parameters:
 * 
 * x - Number that represents the x-coordinate of the endpoint.
 * y - Number that represents the y-coordinate of the endpoint.
 */
mxVsdxCanvas2D.prototype.lineTo = function(x, y)
{
	var elem = this.createElement('line');
	elem.setAttribute('x', this.format(x));
	elem.setAttribute('y', this.format(y));
	this.root.appendChild(elem);
	this.lastX = x;
	this.lastY = y;
};

/**
 * Function: quadTo
 * 
 * Adds a quadratic curve to the current path.
 * 
 * Parameters:
 * 
 * x1 - Number that represents the x-coordinate of the control point.
 * y1 - Number that represents the y-coordinate of the control point.
 * x2 - Number that represents the x-coordinate of the endpoint.
 * y2 - Number that represents the y-coordinate of the endpoint.
 */
mxVsdxCanvas2D.prototype.quadTo = function(x1, y1, x2, y2)
{
	var elem = this.createElement('quad');
	elem.setAttribute('x1', this.format(x1));
	elem.setAttribute('y1', this.format(y1));
	elem.setAttribute('x2', this.format(x2));
	elem.setAttribute('y2', this.format(y2));
	this.root.appendChild(elem);
	this.lastX = x2;
	this.lastY = y2;
};

/**
 * Function: curveTo
 * 
 * Adds a bezier curve to the current path.
 * 
 * Parameters:
 * 
 * x1 - Number that represents the x-coordinate of the first control point.
 * y1 - Number that represents the y-coordinate of the first control point.
 * x2 - Number that represents the x-coordinate of the second control point.
 * y2 - Number that represents the y-coordinate of the second control point.
 * x3 - Number that represents the x-coordinate of the endpoint.
 * y3 - Number that represents the y-coordinate of the endpoint.
 */
mxVsdxCanvas2D.prototype.curveTo = function(x1, y1, x2, y2, x3, y3)
{
	var elem = this.createElement('curve');
	elem.setAttribute('x1', this.format(x1));
	elem.setAttribute('y1', this.format(y1));
	elem.setAttribute('x2', this.format(x2));
	elem.setAttribute('y2', this.format(y2));
	elem.setAttribute('x3', this.format(x3));
	elem.setAttribute('y3', this.format(y3));
	this.root.appendChild(elem);
	this.lastX = x3;
	this.lastY = y3;
};

/**
 * Function: close
 * 
 * Closes the current path.
 */
mxVsdxCanvas2D.prototype.close = function()
{
	this.root.appendChild(this.createElement('close'));
};

/**
 * Function: text
 * 
 * Paints the given text. Possible values for format are empty string for
 * plain text and html for HTML markup. Background and border color as well
 * as clipping is not available in plain text labels for VML. HTML labels
 * are not available as part of shapes with no foreignObject support in SVG
 * (eg. IE9, IE10).
 * 
 * Parameters:
 * 
 * x - Number that represents the x-coordinate of the text.
 * y - Number that represents the y-coordinate of the text.
 * w - Number that represents the available width for the text or 0 for automatic width.
 * h - Number that represents the available height for the text or 0 for automatic height.
 * str - String that specifies the text to be painted.
 * align - String that represents the horizontal alignment.
 * valign - String that represents the vertical alignment.
 * wrap - Boolean that specifies if word-wrapping is enabled. Requires w > 0.
 * format - Empty string for plain text or 'html' for HTML markup.
 * overflow - Specifies the overflow behaviour of the label. Requires w > 0 and/or h > 0.
 * clip - Boolean that specifies if the label should be clipped. Requires w > 0 and/or h > 0.
 * rotation - Number that specifies the angle of the rotation around the anchor point of the text.
 * dir - Optional string that specifies the text direction. Possible values are rtl and lrt.
 */
mxVsdxCanvas2D.prototype.text = function(x, y, w, h, str, align, valign, wrap, format, overflow, clip, rotation, dir)
{
	if (this.textEnabled && str != null)
	{
		if (mxUtils.isNode(str))
		{
			str = mxUtils.getOuterHtml(str);
		}
		
		var elem = this.createElement('text');
		elem.setAttribute('x', this.format(x));
		elem.setAttribute('y', this.format(y));
		elem.setAttribute('w', this.format(w));
		elem.setAttribute('h', this.format(h));
		elem.setAttribute('str', str);
		
		if (align != null)
		{
			elem.setAttribute('align', align);
		}
		
		if (valign != null)
		{
			elem.setAttribute('valign', valign);
		}
		
		elem.setAttribute('wrap', (wrap) ? '1' : '0');
		
		if (format == null)
		{
			format = '';
		}
		
		elem.setAttribute('format', format);
		
		if (overflow != null)
		{
			elem.setAttribute('overflow', overflow);
		}
		
		if (clip != null)
		{
			elem.setAttribute('clip', (clip) ? '1' : '0');
		}
		
		if (rotation != null)
		{
			elem.setAttribute('rotation', rotation);
		}
		
		if (dir != null)
		{
			elem.setAttribute('dir', dir);
		}
		
		this.root.appendChild(elem);
	}
};

/**
 * Function: stroke
 * 
 * Paints the outline of the current drawing buffer.
 */
mxVsdxCanvas2D.prototype.stroke = function()
{
	this.root.appendChild(this.createElement('stroke'));
};

/**
 * Function: fill
 * 
 * Fills the current drawing buffer.
 */
mxVsdxCanvas2D.prototype.fill = function()
{
	this.root.appendChild(this.createElement('fill'));
};

/**
 * Function: fillAndStroke
 * 
 * Fills the current drawing buffer and its outline.
 */
mxVsdxCanvas2D.prototype.fillAndStroke = function()
{
	this.root.appendChild(this.createElement('fillstroke'));
};
