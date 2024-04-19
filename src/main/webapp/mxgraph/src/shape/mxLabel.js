/**
 * Copyright (c) 2006-2015, JGraph Ltd
 * Copyright (c) 2006-2015, Gaudenz Alder
 */
/**
 * Class: mxLabel
 *
 * Extends <mxShape> to implement an image shape with a label.
 * This shape is registered under <mxConstants.SHAPE_LABEL> in
 * <mxCellRenderer>.
 * 
 * Constructor: mxLabel
 *
 * Constructs a new label shape.
 * 
 * Parameters:
 * 
 * bounds - <mxRectangle> that defines the bounds. This is stored in
 * <mxShape.bounds>.
 * fill - String that defines the fill color. This is stored in <fill>.
 * stroke - String that defines the stroke color. This is stored in <stroke>.
 * strokewidth - Optional integer that defines the stroke width. Default is
 * 1. This is stored in <strokewidth>.
 */
function mxLabel(bounds, fill, stroke, strokewidth)
{
	mxRectangleShape.call(this, bounds, fill, stroke, strokewidth);
};

/**
 * Extends mxShape.
 */
mxUtils.extend(mxLabel, mxRectangleShape);

/**
 * Variable: imageSize
 *
 * Default width and height for the image. Default is
 * <mxConstants.DEFAULT_IMAGESIZE>.
 */
mxLabel.prototype.imageSize = mxConstants.DEFAULT_IMAGESIZE;

/**
 * Variable: spacing
 *
 * Default value for image spacing. Default is 2.
 */
mxLabel.prototype.spacing = 2;

/**
 * Variable: indicatorSize
 *
 * Default width and height for the indicicator. Default is 10.
 */
mxLabel.prototype.indicatorSize = 10;

/**
 * Variable: indicatorSpacing
 *
 * Default spacing between image and indicator. Default is 2.
 */
mxLabel.prototype.indicatorSpacing = 2;

/**
 * Function: init
 *
 * Initializes the shape and the <indicator>.
 */
mxLabel.prototype.init = function(container)
{
	mxShape.prototype.init.apply(this, arguments);

	if (this.indicatorShape != null)
	{
		this.indicator = new this.indicatorShape();
		this.indicator.dialect = this.dialect;
		this.indicator.init(this.node);
	}
};

/**
 * Function: redraw
 *
 * Reconfigures this shape. This will update the colors of the indicator
 * and reconfigure it if required.
 */
mxLabel.prototype.redraw = function()
{
	if (this.indicator != null)
	{
		this.indicator.fill = this.indicatorColor;
		this.indicator.stroke = this.indicatorStrokeColor;
		this.indicator.gradient = this.indicatorGradientColor;
		this.indicator.direction = this.indicatorDirection;
		this.indicator.redraw();
	}
	
	mxShape.prototype.redraw.apply(this, arguments);
};

/**
 * Function: isHtmlAllowed
 *
 * Returns true for non-rounded, non-rotated shapes with no glass gradient and
 * no indicator shape.
 */
mxLabel.prototype.isHtmlAllowed = function()
{
	return mxRectangleShape.prototype.isHtmlAllowed.apply(this, arguments) &&
		this.indicatorColor == null && this.indicatorShape == null;
};

/**
 * Function: paintForeground
 * 
 * Generic background painting implementation.
 */
mxLabel.prototype.paintForeground = function(c, x, y, w, h)
{
	this.paintImage(c, x, y, w, h);
	this.paintIndicator(c, x, y, w, h);
	
	mxRectangleShape.prototype.paintForeground.apply(this, arguments);
};

/**
 * Function: paintImage
 * 
 * Generic background painting implementation.
 */
mxLabel.prototype.paintImage = function(c, x, y, w, h)
{
	if (this.image != null)
	{
		var bounds = this.getImageBounds(x, y, w, h);
		var clipPath = mxUtils.getValue(this.style, mxConstants.STYLE_CLIP_PATH, null);
		c.image(bounds.x, bounds.y, bounds.width, bounds.height, this.image, false, false, false, clipPath);
	}
};

/**
 * Function: getImageBounds
 * 
 * Generic background painting implementation.
 */
mxLabel.prototype.getImageBounds = function(x, y, w, h)
{
	var align = mxUtils.getValue(this.style, mxConstants.STYLE_IMAGE_ALIGN, mxConstants.ALIGN_LEFT);
	var valign = mxUtils.getValue(this.style, mxConstants.STYLE_IMAGE_VERTICAL_ALIGN, mxConstants.ALIGN_MIDDLE);
	var width = mxUtils.getNumber(this.style, mxConstants.STYLE_IMAGE_WIDTH, mxConstants.DEFAULT_IMAGESIZE);
	var height = mxUtils.getNumber(this.style, mxConstants.STYLE_IMAGE_HEIGHT, mxConstants.DEFAULT_IMAGESIZE);
	var spacing = mxUtils.getNumber(this.style, mxConstants.STYLE_SPACING, this.spacing) + 5;

	if (align == mxConstants.ALIGN_CENTER)
	{
		x += (w - width) / 2;
	}
	else if (align == mxConstants.ALIGN_RIGHT)
	{
		x += w - width - spacing;
	}
	else // default is left
	{
		x += spacing;
	}

	if (valign == mxConstants.ALIGN_TOP)
	{
		y += spacing;
	}
	else if (valign == mxConstants.ALIGN_BOTTOM)
	{
		y += h - height - spacing;
	}
	else // default is middle
	{
		y += (h - height) / 2;
	}
	
	return new mxRectangle(x, y, width, height);
};

/**
 * Function: paintIndicator
 * 
 * Generic background painting implementation.
 */
mxLabel.prototype.paintIndicator = function(c, x, y, w, h)
{
	if (this.indicator != null)
	{
		this.indicator.bounds = this.getIndicatorBounds(x, y, w, h);
		this.indicator.paint(c);
	}
	else if (this.indicatorImage != null)
	{
		var bounds = this.getIndicatorBounds(x, y, w, h);
		c.image(bounds.x, bounds.y, bounds.width, bounds.height, this.indicatorImage, false, false, false);
	}
};

/**
 * Function: getIndicatorBounds
 * 
 * Generic background painting implementation.
 */
mxLabel.prototype.getIndicatorBounds = function(x, y, w, h)
{
	var align = mxUtils.getValue(this.style, mxConstants.STYLE_IMAGE_ALIGN, mxConstants.ALIGN_LEFT);
	var valign = mxUtils.getValue(this.style, mxConstants.STYLE_IMAGE_VERTICAL_ALIGN, mxConstants.ALIGN_MIDDLE);
	var width = mxUtils.getNumber(this.style, mxConstants.STYLE_INDICATOR_WIDTH, this.indicatorSize);
	var height = mxUtils.getNumber(this.style, mxConstants.STYLE_INDICATOR_HEIGHT, this.indicatorSize);
	var spacing = this.spacing + 5;		
	
	if (align == mxConstants.ALIGN_RIGHT)
	{
		x += w - width - spacing;
	}
	else if (align == mxConstants.ALIGN_CENTER)
	{
		x += (w - width) / 2;
	}
	else // default is left
	{
		x += spacing;
	}
	
	if (valign == mxConstants.ALIGN_BOTTOM)
	{
		y += h - height - spacing;
	}
	else if (valign == mxConstants.ALIGN_TOP)
	{
		y += spacing;
	}
	else // default is middle
	{
		y += (h - height) / 2;
	}
	
	return new mxRectangle(x, y, width, height);
};
/**
 * Function: redrawHtmlShape
 * 
 * Generic background painting implementation.
 */
mxLabel.prototype.redrawHtmlShape = function()
{
	mxRectangleShape.prototype.redrawHtmlShape.apply(this, arguments);
	
	// Removes all children
	while(this.node.hasChildNodes())
	{
		this.node.removeChild(this.node.lastChild);
	}
	
	if (this.image != null)
	{
		var node = document.createElement('img');
		node.style.position = 'relative';
		node.setAttribute('border', '0');
		
		var bounds = this.getImageBounds(this.bounds.x, this.bounds.y, this.bounds.width, this.bounds.height);
		bounds.x -= this.bounds.x;
		bounds.y -= this.bounds.y;

		node.style.left = Math.round(bounds.x) + 'px';
		node.style.top = Math.round(bounds.y) + 'px';
		node.style.width = Math.round(bounds.width) + 'px';
		node.style.height = Math.round(bounds.height) + 'px';
		
		node.src = this.image;
		
		this.node.appendChild(node);
	}
};
