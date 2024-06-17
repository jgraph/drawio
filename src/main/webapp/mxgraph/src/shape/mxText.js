/**
 * Copyright (c) 2006-2015, JGraph Ltd
 * Copyright (c) 2006-2015, Gaudenz Alder
 */
/**
 * Class: mxText
 *
 * Extends <mxShape> to implement a text shape. To change vertical text from
 * bottom to top to top to bottom, the following code can be used:
 * 
 * (code)
 * mxText.prototype.verticalTextRotation = 90;
 * (end)
 * 
 * Constructor: mxText
 *
 * Constructs a new text shape.
 * 
 * Parameters:
 * 
 * value - String that represents the text to be displayed. This is stored in
 * <value>.
 * bounds - <mxRectangle> that defines the bounds. This is stored in
 * <mxShape.bounds>.
 * align - Specifies the horizontal alignment. Default is ''. This is stored in
 * <align>.
 * valign - Specifies the vertical alignment. Default is ''. This is stored in
 * <valign>.
 * color - String that specifies the text color. Default is 'black'. This is
 * stored in <color>.
 * family - String that specifies the font family. Default is
 * <mxConstants.DEFAULT_FONTFAMILY>. This is stored in <family>.
 * size - Integer that specifies the font size. Default is
 * <mxConstants.DEFAULT_FONTSIZE>. This is stored in <size>.
 * fontStyle - Specifies the font style. Default is 0. This is stored in
 * <fontStyle>.
 * spacing - Integer that specifies the global spacing. Default is 2. This is
 * stored in <spacing>.
 * spacingTop - Integer that specifies the top spacing. Default is 0. The
 * sum of the spacing and this is stored in <spacingTop>.
 * spacingRight - Integer that specifies the right spacing. Default is 0. The
 * sum of the spacing and this is stored in <spacingRight>.
 * spacingBottom - Integer that specifies the bottom spacing. Default is 0.The
 * sum of the spacing and this is stored in <spacingBottom>.
 * spacingLeft - Integer that specifies the left spacing. Default is 0. The
 * sum of the spacing and this is stored in <spacingLeft>.
 * horizontal - Boolean that specifies if the label is horizontal. Default is
 * true. This is stored in <horizontal>.
 * background - String that specifies the background color. Default is null.
 * This is stored in <background>.
 * border - String that specifies the label border color. Default is null.
 * This is stored in <border>.
 * wrap - Specifies if word-wrapping should be enabled. Default is false.
 * This is stored in <wrap>.
 * clipped - Specifies if the label should be clipped. Default is false.
 * This is stored in <clipped>.
 * overflow - Value of the overflow style. Default is 'visible'.
 */
function mxText(value, bounds, align, valign, color,
	family,	size, fontStyle, spacing, spacingTop, spacingRight,
	spacingBottom, spacingLeft, horizontal, background, border,
	wrap, clipped, overflow, labelPadding, textDirection)
{
	mxShape.call(this);
	this.value = value;
	this.bounds = bounds;
	this.color = (color != null) ? color : 'black';
	this.align = (align != null) ? align : mxConstants.ALIGN_CENTER;
	this.valign = (valign != null) ? valign : mxConstants.ALIGN_MIDDLE;
	this.family = (family != null) ? family : mxConstants.DEFAULT_FONTFAMILY;
	this.size = (size != null) ? size : mxConstants.DEFAULT_FONTSIZE;
	this.fontStyle = (fontStyle != null) ? fontStyle : mxConstants.DEFAULT_FONTSTYLE;
	this.spacing = parseInt(spacing || 2);
	this.spacingTop = this.spacing + parseInt(spacingTop || 0);
	this.spacingRight = this.spacing + parseInt(spacingRight || 0);
	this.spacingBottom = this.spacing + parseInt(spacingBottom || 0);
	this.spacingLeft = this.spacing + parseInt(spacingLeft || 0);
	this.horizontal = (horizontal != null) ? horizontal : true;
	this.background = background;
	this.border = border;
	this.wrap = (wrap != null) ? wrap : false;
	this.clipped = (clipped != null) ? clipped : false;
	this.overflow = (overflow != null) ? overflow : 'visible';
	this.labelPadding = (labelPadding != null) ? labelPadding : 0;
	this.textDirection = textDirection;
	this.rotation = 0;
	this.updateMargin();
};

/**
 * Extends mxShape.
 */
mxUtils.extend(mxText, mxShape);

/**
 * Variable: baseSpacingTop
 * 
 * Specifies the spacing to be added to the top spacing. Default is 0. Use the
 * value 5 here to get the same label positions as in mxGraph 1.x.
 */
mxText.prototype.baseSpacingTop = 0;

/**
 * Variable: baseSpacingBottom
 * 
 * Specifies the spacing to be added to the bottom spacing. Default is 0. Use the
 * value 1 here to get the same label positions as in mxGraph 1.x.
 */
mxText.prototype.baseSpacingBottom = 0;

/**
 * Variable: baseSpacingLeft
 * 
 * Specifies the spacing to be added to the left spacing. Default is 0.
 */
mxText.prototype.baseSpacingLeft = 0;

/**
 * Variable: baseSpacingRight
 * 
 * Specifies the spacing to be added to the right spacing. Default is 0.
 */
mxText.prototype.baseSpacingRight = 0;

/**
 * Variable: replaceLinefeeds
 * 
 * Specifies if linefeeds in HTML labels should be replaced with BR tags.
 * Default is true.
 */
mxText.prototype.replaceLinefeeds = true;

/**
 * Variable: verticalTextRotation
 * 
 * Rotation for vertical text. Default is -90 (bottom to top).
 */
mxText.prototype.verticalTextRotation = -90;

/**
 * Variable: ignoreClippedStringSize
 * 
 * Specifies if the string size should be measured in <updateBoundingBox> if
 * the label is clipped and the label position is center and middle. If this is
 * true, then the bounding box will be set to <bounds>. Default is true.
 * <ignoreStringSize> has precedence over this switch.
 */
mxText.prototype.ignoreClippedStringSize = true;

/**
 * Variable: ignoreStringSize
 * 
 * Specifies if the actual string size should be measured. If disabled the
 * boundingBox will not ignore the actual size of the string, otherwise
 * <bounds> will be used instead. Default is false.
 */
mxText.prototype.ignoreStringSize = false;

/**
 * Variable: textWidthPadding
 * 
 * Specifies the padding to be added to the text width for the bounding box.
 * This is needed to make sure no clipping is applied to borders. Default is 4
 * for IE 8 standards mode and 3 for all others.
 */
mxText.prototype.textWidthPadding = (document.documentMode == 8 && !mxClient.IS_EM) ? 4 : 3;

/**
 * Variable: lastValue
 * 
 * Contains the last rendered text value. Used for caching.
 */
mxText.prototype.lastValue = null;

/**
 * Variable: cacheEnabled
 * 
 * Specifies if caching for HTML labels should be enabled. Default is true.
 */
mxText.prototype.cacheEnabled = true;

/**
 * Function: isHtmlAllowed
 * 
 * Returns true if HTML is allowed for this shape. This implementation returns
 * true if the browser is not in IE8 standards mode.
 */
mxText.prototype.isHtmlAllowed = function()
{
	return document.documentMode != 8 || mxClient.IS_EM;
};

/**
 * Function: getSvgScreenOffset
 * 
 * Disables offset in IE9 for crisper image output.
 */
mxText.prototype.getSvgScreenOffset = function()
{
	return 0;
};

/**
 * Function: checkBounds
 * 
 * Returns true if the bounds are not null and all of its variables are numeric.
 */
mxText.prototype.checkBounds = function()
{
	return (!isNaN(this.scale) && isFinite(this.scale) && this.scale > 0 &&
			this.bounds != null && !isNaN(this.bounds.x) && !isNaN(this.bounds.y) &&
			!isNaN(this.bounds.width) && !isNaN(this.bounds.height));
};

/**
 * Function: configurePointerEvents
 * 
 * Configures the pointer events for the given canvas.
 */
mxText.prototype.configurePointerEvents = function(c)
{
	// do nothing
};

/**
 * Function: getActualTextDirection
 * 
 * Returns the actual text direction.
 */
mxText.prototype.getActualTextDirection = function()
{
	var dir = this.textDirection;
	
	if (dir == mxConstants.TEXT_DIRECTION_AUTO)
	{
		dir = this.getAutoDirection();
	}
	
	if (dir != mxConstants.TEXT_DIRECTION_LTR &&
		dir != mxConstants.TEXT_DIRECTION_RTL &&
		dir != mxConstants.TEXT_DIRECTION_VERTICAL_LR &&
		dir != mxConstants.TEXT_DIRECTION_VERTICAL_RL)
	{
		dir = null;
	}

	return dir;
};

/**
 * Function: paint
 * 
 * Generic rendering code.
 */
mxText.prototype.paint = function(c, update)
{
	// Scale is passed-through to canvas
	var s = this.scale;
	var x = this.bounds.x / s;
	var y = this.bounds.y / s;
	var w = this.bounds.width / s;
	var h = this.bounds.height / s;
	
	this.updateTransform(c, x, y, w, h);
	this.configureCanvas(c, x, y, w, h);
	this.updateSvgFilters((c != null) ? c.state.scale : s);
				
	var dir = this.getActualTextDirection();
	
	if (update)
	{
		c.updateText(x, y, w, h, this.align, this.valign, this.wrap, this.overflow,
				this.clipped, this.getTextRotation(), dir, this.node);
	}
	else
	{
		// Checks if text contains HTML markup
		var realHtml = mxUtils.isNode(this.value) || this.dialect == mxConstants.DIALECT_STRICTHTML;
		
		// Always renders labels as HTML in VML
		var fmt = (realHtml) ? 'html' : '';
		var val = this.value;
		
		if (!realHtml && fmt == 'html')
		{
			val = mxUtils.htmlEntities(val, false);
		}
		
		if (fmt == 'html' && !mxUtils.isNode(this.value))
		{
			val = mxUtils.replaceTrailingNewlines(val, '<div><br></div>');			
		}
		
		// Handles trailing newlines to make sure they are visible in rendering output
		val = (!mxUtils.isNode(this.value) && this.replaceLinefeeds && fmt == 'html') ?
			val.replace(/\n/g, '<br/>') : val;

		c.text(x, y, w, h, val, this.align, this.valign, this.wrap, fmt,
			this.overflow, this.clipped, this.getTextRotation(), dir);
	}
};

/**
 * Function: redraw
 * 
 * Renders the text using the given DOM nodes.
 */
mxText.prototype.redraw = function()
{
	if (this.visible && this.checkBounds() && this.cacheEnabled && this.lastValue == this.value &&
		(mxUtils.isNode(this.value) || this.dialect == mxConstants.DIALECT_STRICTHTML))
	{
		if (this.node.nodeName == 'DIV')
		{
			if (mxClient.IS_SVG)
			{
				this.redrawHtmlShapeWithCss3();	
			}
			else
			{
				this.updateSize(this.node, (this.state == null || this.state.view.textDiv == null));
	
				if (mxClient.IS_IE && (document.documentMode == null || document.documentMode <= 8))
				{
					this.updateHtmlFilter();
				}
				else
				{
					this.updateHtmlTransform();
				}
			}
		}
		else
		{
			var canvas = this.createCanvas();

			if (canvas != null && canvas.updateText != null)
			{
				// Specifies if events should be handled
				canvas.pointerEvents = this.pointerEvents;
	
				this.paint(canvas, true);
				this.destroyCanvas(canvas);
			}
			else
			{
				// Fallback if canvas does not support updateText (VML)
				mxShape.prototype.redraw.apply(this, arguments);
			}
		}
	}
	else
	{
		mxShape.prototype.redraw.apply(this, arguments);
		
		if (mxUtils.isNode(this.value) || this.dialect == mxConstants.DIALECT_STRICTHTML)
		{
			this.lastValue = this.value;
		}
		else
		{
			this.lastValue = null;
		}
	}
};

/**
 * Function: resetStyles
 * 
 * Resets all styles.
 */
mxText.prototype.resetStyles = function()
{
	mxShape.prototype.resetStyles.apply(this, arguments);
	
	this.color = 'black';
	this.align = mxConstants.ALIGN_CENTER;
	this.valign = mxConstants.ALIGN_MIDDLE;
	this.family = mxConstants.DEFAULT_FONTFAMILY;
	this.size = mxConstants.DEFAULT_FONTSIZE;
	this.fontStyle = mxConstants.DEFAULT_FONTSTYLE;
	this.spacing = 2;
	this.spacingTop = 2;
	this.spacingRight = 2;
	this.spacingBottom = 2;
	this.spacingLeft = 2;
	this.horizontal = true;
	delete this.background;
	delete this.border;
	this.textDirection = mxConstants.DEFAULT_TEXT_DIRECTION;
	delete this.margin;
};

/**
 * Function: apply
 * 
 * Extends mxShape to update the text styles.
 *
 * Parameters:
 *
 * state - <mxCellState> of the corresponding cell.
 */
mxText.prototype.apply = function(state)
{
	var old = this.spacing;
	mxShape.prototype.apply.apply(this, arguments);
	
	if (this.style != null)
	{
		this.fontStyle = mxUtils.getValue(this.style, mxConstants.STYLE_FONTSTYLE, this.fontStyle);
		this.family = mxUtils.getValue(this.style, mxConstants.STYLE_FONTFAMILY, this.family);
		this.size = mxUtils.getValue(this.style, mxConstants.STYLE_FONTSIZE, this.size);
		this.color = mxUtils.getValue(this.style, mxConstants.STYLE_FONTCOLOR, this.color);
		this.align = mxUtils.getValue(this.style, mxConstants.STYLE_ALIGN, this.align);
		this.valign = mxUtils.getValue(this.style, mxConstants.STYLE_VERTICAL_ALIGN, this.valign);
		this.spacing = parseInt(mxUtils.getValue(this.style, mxConstants.STYLE_SPACING, this.spacing));
		this.spacingTop = parseInt(mxUtils.getValue(this.style, mxConstants.STYLE_SPACING_TOP, this.spacingTop - old)) + this.spacing;
		this.spacingRight = parseInt(mxUtils.getValue(this.style, mxConstants.STYLE_SPACING_RIGHT, this.spacingRight - old)) + this.spacing;
		this.spacingBottom = parseInt(mxUtils.getValue(this.style, mxConstants.STYLE_SPACING_BOTTOM, this.spacingBottom - old)) + this.spacing;
		this.spacingLeft = parseInt(mxUtils.getValue(this.style, mxConstants.STYLE_SPACING_LEFT, this.spacingLeft - old)) + this.spacing;
		this.horizontal = mxUtils.getValue(this.style, mxConstants.STYLE_HORIZONTAL, this.horizontal);
		this.background = mxUtils.getValue(this.style, mxConstants.STYLE_LABEL_BACKGROUNDCOLOR, this.background);
		this.border = mxUtils.getValue(this.style, mxConstants.STYLE_LABEL_BORDERCOLOR, this.border);
		this.textDirection = mxUtils.getValue(this.style, mxConstants.STYLE_TEXT_DIRECTION, mxConstants.DEFAULT_TEXT_DIRECTION);
		this.opacity = mxUtils.getValue(this.style, mxConstants.STYLE_TEXT_OPACITY, 100);
		this.updateMargin();
	}
	
	this.flipV = null;
	this.flipH = null;
};

/**
 * Function: getAutoDirection
 * 
 * Used to determine the automatic text direction. Returns
 * <mxConstants.TEXT_DIRECTION_LTR> or <mxConstants.TEXT_DIRECTION_RTL>
 * depending on the contents of <value>. This is not invoked for HTML, wrapped
 * content or if <value> is a DOM node.
 */
mxText.prototype.getAutoDirection = function()
{
	// Looks for strong (directional) characters
	var tmp = /[A-Za-z\u05d0-\u065f\u066a-\u06ef\u06fa-\u07ff\ufb1d-\ufdff\ufe70-\ufefc]/.exec(this.value);
	
	// Returns the direction defined by the character
	return (tmp != null && tmp.length > 0 && tmp[0] > 'z') ?
		mxConstants.TEXT_DIRECTION_RTL : mxConstants.TEXT_DIRECTION_LTR;
};

/**
 * Function: getContentNode
 * 
 * Returns the node that contains the rendered input.
 */
mxText.prototype.getContentNode = function()
{
	var result = this.node;
	
	if (result != null)
	{
		// Rendered with no foreignObject
		if (result.ownerSVGElement == null)
		{
			result = this.node.firstChild.firstChild;
		}
		else
		{
			// Innermost DIV that contains the actual content
			result = result.firstChild.firstChild.firstChild.firstChild.firstChild;
		}
	}
	
	return result;
};

/**
 * Function: updateBoundingBox
 *
 * Updates the <boundingBox> for this shape using the given node and position.
 */
mxText.prototype.updateBoundingBox = function()
{
	var node = this.node;
	this.boundingBox = this.bounds.clone();
	var rot = this.getTextRotation();
	
	var h = (this.style != null) ? mxUtils.getValue(this.style, mxConstants.STYLE_LABEL_POSITION, mxConstants.ALIGN_CENTER) : null;
	var v = (this.style != null) ? mxUtils.getValue(this.style, mxConstants.STYLE_VERTICAL_LABEL_POSITION, mxConstants.ALIGN_MIDDLE) : null;

	if (!this.ignoreStringSize && node != null && this.overflow != 'fill' && (!this.clipped ||
		!this.ignoreClippedStringSize || h != mxConstants.ALIGN_CENTER || v != mxConstants.ALIGN_MIDDLE))
	{
		var ow = null;
		var oh = null;
		
		if (node.ownerSVGElement != null)
		{
			if (node.firstChild != null && node.firstChild.firstChild != null &&
				node.firstChild.firstChild.nodeName == 'foreignObject' &&
				node.firstChild.firstChild.firstChild != null &&
				node.firstChild.firstChild.firstChild.firstChild != null)
			{
				// Uses second inner DIV for font metrics
				node = node.firstChild.firstChild.firstChild.firstChild;
				oh = node.offsetHeight * this.scale;
				
				if (this.overflow == 'width')
				{
					ow = this.boundingBox.width;
				}
				else
				{
					ow = node.offsetWidth * this.scale;	
				}
			}
			else
			{
				try
				{
					var b = node.getBBox();
					
					// Workaround for bounding box of empty string
					if (typeof(this.value) == 'string' && mxUtils.trim(this.value) == 0)
					{
						this.boundingBox = null;
					}
					else if (b.width == 0 && b.height == 0)
					{
						this.boundingBox = null;
					}
					else
					{
						this.boundingBox = new mxRectangle(b.x, b.y, b.width, b.height);
					}
					
					return;
				}
				catch (e)
				{
					// Ignores NS_ERROR_FAILURE in FF if container display is none.
				}
			}
		}
		else
		{
			var td = (this.state != null) ? this.state.view.textDiv : null;

			// Use cached offset size
			if (this.offsetWidth != null && this.offsetHeight != null)
			{
				ow = this.offsetWidth * this.scale;
				oh = this.offsetHeight * this.scale;
			}
			else
			{
				// Cannot get node size while container hidden so a
				// shared temporary DIV is used for text measuring
				if (td != null)
				{
					this.updateFont(td);
					this.updateSize(td, false);
					this.updateInnerHtml(td);

					node = td;
				}
				
				var sizeDiv = node;

				if (document.documentMode == 8 && !mxClient.IS_EM)
				{
					var w = Math.round(this.bounds.width / this.scale);
	
					if (this.wrap && w > 0)
					{
						node.style.wordWrap = mxConstants.WORD_WRAP;
						node.style.whiteSpace = 'normal';

						if (node.style.wordWrap != 'break-word')
						{
							// Innermost DIV is used for measuring text
							var divs = sizeDiv.getElementsByTagName('div');
							
							if (divs.length > 0)
							{
								sizeDiv = divs[divs.length - 1];
							}
							
							ow = sizeDiv.offsetWidth + 2;
							divs = this.node.getElementsByTagName('div');
							
							if (this.clipped)
							{
								ow = Math.min(w, ow);
							}
							
							// Second last DIV width must be updated in DOM tree
							if (divs.length > 1)
							{
								divs[divs.length - 2].style.width = ow + 'px';
							}
						}
					}
					else
					{
						node.style.whiteSpace = 'nowrap';
					}
				}
				else if (sizeDiv.firstChild != null && sizeDiv.firstChild.nodeName == 'DIV')
				{
					sizeDiv = sizeDiv.firstChild;
				}

				this.offsetWidth = sizeDiv.offsetWidth + this.textWidthPadding;
				this.offsetHeight = sizeDiv.offsetHeight;
				
				ow = this.offsetWidth * this.scale;
				oh = this.offsetHeight * this.scale;
			}
		}

		if (ow != null && oh != null)
		{	
			this.boundingBox = new mxRectangle(this.bounds.x,
				this.bounds.y, ow, oh);
		}
	}

	if (this.boundingBox != null)
	{
		if (rot != 0)
		{
			// Accounts for pre-rotated x and y
			var bbox = mxUtils.getBoundingBox(new mxRectangle(
				this.margin.x * this.boundingBox.width,
				this.margin.y * this.boundingBox.height,
				this.boundingBox.width, this.boundingBox.height),
				rot, new mxPoint(0, 0));
			
			this.unrotatedBoundingBox = mxRectangle.fromRectangle(this.boundingBox);
			this.unrotatedBoundingBox.x += this.margin.x * this.unrotatedBoundingBox.width;
			this.unrotatedBoundingBox.y += this.margin.y * this.unrotatedBoundingBox.height;
			
			this.boundingBox.x += bbox.x;
			this.boundingBox.y += bbox.y;
			this.boundingBox.width = bbox.width;
			this.boundingBox.height = bbox.height;
		}
		else
		{
			this.boundingBox.x += this.margin.x * this.boundingBox.width;
			this.boundingBox.y += this.margin.y * this.boundingBox.height;
			this.unrotatedBoundingBox = null;
		}
	}
};

/**
 * Function: getShapeRotation
 * 
 * Returns 0 to avoid using rotation in the canvas via updateTransform.
 */
mxText.prototype.getShapeRotation = function()
{
	return 0;
};

/**
 * Function: getTextRotation
 * 
 * Returns the rotation for the text label of the corresponding shape.
 */
mxText.prototype.getTextRotation = function()
{
	return (this.state != null && this.state.shape != null) ? this.state.shape.getTextRotation() : 0;
};

/**
 * Function: isPaintBoundsInverted
 * 
 * Inverts the bounds if <mxShape.isBoundsInverted> returns true or if the
 * horizontal style is false.
 */
mxText.prototype.isPaintBoundsInverted = function()
{
	return !this.horizontal && this.state != null && this.state.view.graph.model.isVertex(this.state.cell);
};

/**
 * Function: configureCanvas
 * 
 * Sets the state of the canvas for drawing the shape.
 */
mxText.prototype.configureCanvas = function(c, x, y, w, h)
{
	mxShape.prototype.configureCanvas.apply(this, arguments);
	
	c.setFontColor(this.color);
	c.setFontBackgroundColor(this.background);
	c.setFontBorderColor(this.border);
	c.setFontFamily(this.family);
	c.setFontSize(this.size);
	c.setFontStyle(this.fontStyle);
};

/**
 * Function: isShadowEnabled
 * 
 * Removes all child nodes and resets all CSS.
 */
mxText.prototype.isShadowEnabled = function()
{
	return (this.style != null) ? mxUtils.getValue(this.style,
		mxConstants.STYLE_TEXT_SHADOW, false) : false;
};

/**
 * Function: getHtmlValue
 * 
 * Private helper function to create SVG elements
 */
mxText.prototype.getHtmlValue = function()
{
	var val = this.value;
	
	if (this.dialect != mxConstants.DIALECT_STRICTHTML)
	{
		val = mxUtils.htmlEntities(val, false);
	}
	
	// Handles trailing newlines to make sure they are visible in rendering output
	val = mxUtils.replaceTrailingNewlines(val, '<div><br></div>');
	val = (this.replaceLinefeeds) ? val.replace(/\n/g, '<br/>') : val;
	
	return val;
};

/**
 * Function: getTextCss
 * 
 * Private helper function to create SVG elements
 */
mxText.prototype.getTextCss = function()
{
	var lh = (mxConstants.ABSOLUTE_LINE_HEIGHT) ? (this.size * mxConstants.LINE_HEIGHT) + 'px' :
		mxConstants.LINE_HEIGHT;

	var css = 'display: inline-block; font-size: ' + this.size + 'px; ' +
		'font-family: ' + this.family + '; color: ' + this.color + '; line-height: ' + lh +
		'; pointer-events: ' + ((this.pointerEvents) ? 'all' : 'none') + '; ';

	if ((this.fontStyle & mxConstants.FONT_BOLD) == mxConstants.FONT_BOLD)
	{
		css += 'font-weight: bold; ';
	}

	if ((this.fontStyle & mxConstants.FONT_ITALIC) == mxConstants.FONT_ITALIC)
	{
		css += 'font-style: italic; ';
	}
	
	var deco = [];
	
	if ((this.fontStyle & mxConstants.FONT_UNDERLINE) == mxConstants.FONT_UNDERLINE)
	{
		deco.push('underline');
	}
	
	if ((this.fontStyle & mxConstants.FONT_STRIKETHROUGH) == mxConstants.FONT_STRIKETHROUGH)
	{
		deco.push('line-through');
	}
	
	if (deco.length > 0)
	{
		css += 'text-decoration: ' + deco.join(' ') + '; ';
	}

	return css;
};

/**
 * Function: redrawHtmlShape
 *
 * Updates the HTML node(s) to reflect the latest bounds and scale.
 */
mxText.prototype.redrawHtmlShape = function()
{
	if (mxClient.IS_SVG)
	{
		this.redrawHtmlShapeWithCss3();	
	}
	else
	{
		var style = this.node.style;
	
		// Resets CSS styles
		style.whiteSpace = 'normal';
		style.overflow = '';
		style.width = '';
		style.height = '';
		
		this.updateValue();
		this.updateFont(this.node);
		this.updateSize(this.node, (this.state == null || this.state.view.textDiv == null));
		
		this.offsetWidth = null;
		this.offsetHeight = null;
	
		if (mxClient.IS_IE && (document.documentMode == null || document.documentMode <= 8))
		{
			this.updateHtmlFilter();
		}
		else
		{
			this.updateHtmlTransform();
		}
	}
};

/**
 * Function: redrawHtmlShapeWithCss3
 *
 * Updates the HTML node(s) to reflect the latest bounds and scale.
 */
mxText.prototype.redrawHtmlShapeWithCss3 = function()
{
	var w = Math.max(0, Math.round(this.bounds.width / this.scale));
	var h = Math.max(0, Math.round(this.bounds.height / this.scale));
	var flex = 'position: absolute; left: ' + Math.round(this.bounds.x) + 'px; ' +
		'top: ' + Math.round(this.bounds.y) + 'px; pointer-events: none; ';
	var block = this.getTextCss();
	var dir = this.getActualTextDirection();
	
	mxSvgCanvas2D.createCss(w + 2, h, this.align, this.valign, this.wrap, this.overflow, this.clipped, dir,
		(this.background != null) ? mxUtils.htmlEntities(this.background) : null,
		(this.border != null) ? mxUtils.htmlEntities(this.border) : null,
		flex, block, this.scale, mxUtils.bind(this, function(dx, dy, flex, item, block, ofl)
	{
		var r = this.getTextRotation();
		var tr = ((this.scale != 1) ? 'scale(' + this.scale + ') ' : '') +
			((r != 0) ? 'rotate(' + r + 'deg) ' : '') +
			((this.margin.x != 0 || this.margin.y != 0) ?
				'translate(' + (this.margin.x * 100) + '%,' +
					(this.margin.y * 100) + '%)' : '');
		
		if (tr != '')
		{
			tr = 'transform-origin: 0 0; transform: ' + tr + '; ';
		}
		
		if (this.overflow == 'block' && this.valign == mxConstants.ALIGN_MIDDLE)
		{
			tr += 'max-height: ' + (h + 1) + 'px;';
		}
		
		if (ofl == '')
		{
			flex += item;
			item = 'display:inline-block; min-width: 100%; ' + tr;
		}
		else
		{
			item += tr;
			
			if (mxClient.IS_SF)
			{
				item += '-webkit-clip-path: content-box;';
			}
		}

		if (this.overflow == 'block')
		{
			item += 'width: 100%; ';
		}
		
		if (this.opacity < 100)
		{
			block += 'opacity: ' + (this.opacity / 100) + '; ';
		}
		
		this.node.setAttribute('style', flex);
		
		var html = (mxUtils.isNode(this.value)) ? this.value.outerHTML : this.getHtmlValue();
		
		if (this.node.firstChild == null)
		{
			this.node.innerHTML = '<div><div>' + html +'</div></div>';
			
			if (mxClient.IS_IE11)
			{
				this.fixFlexboxForIe11(this.node);
			}
		}

		this.node.firstChild.firstChild.setAttribute('style', block);
		this.node.firstChild.setAttribute('style', item);
	}));
};

/**
 * Function: fixFlexboxForIe11
 * 
 * Rewrites flexbox CSS for IE11 to work around overflow issues.
 */
mxText.prototype.fixFlexboxForIe11 = function(node)
{
	var elts = node.querySelectorAll('div[style*="display: flex; justify-content: flex-end;"]');
	
	for (var i = 0; i < elts.length; i++)
	{
		// Fixes right aligned elements to allow for overflow
		elts[i].style.justifyContent = 'flex-start';
		elts[i].style.flexDirection = 'row-reverse';
	}
	
	// LATER: Overflow center with flexbox in IE11 that keeps word wrapping
	if (!this.wrap)
	{
		var elts = node.querySelectorAll('div[style*="display: flex; justify-content: center;"]');
		var w = -window.innerWidth;
		
		for (var i = 0; i < elts.length; i++)
		{
			elts[i].style.marginLeft = w + 'px';
			elts[i].style.marginRight = w + 'px';
		}
	}
};

/**
 * Function: updateHtmlTransform
 *
 * Returns the spacing as an <mxPoint>.
 */
mxText.prototype.updateHtmlTransform = function()
{
	var theta = this.getTextRotation();
	var style = this.node.style;
	var dx = this.margin.x;
	var dy = this.margin.y;
	
	if (theta != 0)
	{
		mxUtils.setPrefixedStyle(style, 'transformOrigin', (-dx * 100) + '%' + ' ' + (-dy * 100) + '%');
		mxUtils.setPrefixedStyle(style, 'transform', 'translate(' + (dx * 100) + '%' + ',' + (dy * 100) + '%) ' +
			'scale(' + this.scale + ') rotate(' + theta + 'deg)');
	}
	else
	{
		mxUtils.setPrefixedStyle(style, 'transformOrigin', '0% 0%');
		mxUtils.setPrefixedStyle(style, 'transform', 'scale(' + this.scale + ') ' +
			'translate(' + (dx * 100) + '%' + ',' + (dy * 100) + '%)');
	}

	style.left = Math.round(this.bounds.x - Math.ceil(dx * ((this.overflow != 'fill' &&
		this.overflow != 'width') ? 3 : 1))) + 'px';
	style.top = Math.round(this.bounds.y - dy * ((this.overflow != 'fill') ? 3 : 1)) + 'px';
	
	if (this.opacity < 100)
	{
		style.opacity = this.opacity / 100;
	}
	else
	{
		style.opacity = '';
	}
};

/**
 * Function: updateInnerHtml
 * 
 * Sets the inner HTML of the given element to the <value>.
 */
mxText.prototype.updateInnerHtml = function(elt)
{
	if (mxUtils.isNode(this.value))
	{
		elt.innerHTML = this.value.outerHTML;
	}
	else
	{
		var val = this.value;
		
		if (this.dialect != mxConstants.DIALECT_STRICTHTML)
		{
			// LATER: Can be cached in updateValue
			val = mxUtils.htmlEntities(val, false);
		}
		
		// Handles trailing newlines to make sure they are visible in rendering output
		val = mxUtils.replaceTrailingNewlines(val, '<div>&nbsp;</div>');
		val = (this.replaceLinefeeds) ? val.replace(/\n/g, '<br/>') : val;
		val = '<div style="display:inline-block;_display:inline;">' + val + '</div>';
		
		elt.innerHTML = val;
	}
};

/**
 * Function: updateHtmlFilter
 *
 * Rotated text rendering quality is bad for IE9 quirks/IE8 standards
 */
mxText.prototype.updateHtmlFilter = function()
{
	var style = this.node.style;
	var dx = this.margin.x;
	var dy = this.margin.y;
	var s = this.scale;
	
	// Resets filter before getting offsetWidth
	mxUtils.setOpacity(this.node, this.opacity);
	
	// Adds 1 to match table height in 1.x
	var ow = 0;
	var oh = 0;
	var td = (this.state != null) ? this.state.view.textDiv : null;
	var sizeDiv = this.node;
	
	// Fallback for hidden text rendering in IE quirks mode
	if (td != null)
	{
		td.style.overflow = '';
		td.style.height = '';
		td.style.width = '';
		
		this.updateFont(td);
		this.updateSize(td, false);
		this.updateInnerHtml(td);
		
		var w = Math.round(this.bounds.width / this.scale);

		if (this.wrap && w > 0)
		{
			td.style.whiteSpace = 'normal';
			td.style.wordWrap = mxConstants.WORD_WRAP;
			ow = w;
			
			if (this.clipped)
			{
				ow = Math.min(ow, this.bounds.width);
			}

			td.style.width = ow + 'px';
		}
		else
		{
			td.style.whiteSpace = 'nowrap';
		}
		
		sizeDiv = td;
		
		if (sizeDiv.firstChild != null && sizeDiv.firstChild.nodeName == 'DIV')
		{
			sizeDiv = sizeDiv.firstChild;
			
			if (this.wrap && td.style.wordWrap == 'break-word')
			{
				sizeDiv.style.width = '100%';
			}
		}

		// Required to update the height of the text box after wrapping width is known 
		if (!this.clipped && this.wrap && w > 0)
		{
			ow = sizeDiv.offsetWidth + this.textWidthPadding;
			td.style.width = ow + 'px';
		}
		
		oh = sizeDiv.offsetHeight + 2;
	}
	else if (sizeDiv.firstChild != null && sizeDiv.firstChild.nodeName == 'DIV')
	{
		sizeDiv = sizeDiv.firstChild;
		oh = sizeDiv.offsetHeight;
	}

	ow = sizeDiv.offsetWidth + this.textWidthPadding;
	
	if (this.clipped)
	{
		oh = Math.min(oh, this.bounds.height);
	}

	var w = this.bounds.width / s;
	var h = this.bounds.height / s;

	// Handles special case for live preview with no wrapper DIV and no textDiv
	if (this.overflow == 'fill')
	{
		oh = h;
		ow = w;
	}
	else if (this.overflow == 'width')
	{
		oh = sizeDiv.scrollHeight;
		ow = w;
	}
	
	// Stores for later use
	this.offsetWidth = ow;
	this.offsetHeight = oh;
	
	h = oh;

	if (this.overflow != 'fill' && this.overflow != 'width')
	{
		if (this.clipped)
		{
			ow = Math.min(w, ow);
		}
		
		w = ow;

		// Simulates max-width CSS in quirks mode
		if (this.wrap)
		{
			style.width = Math.round(w) + 'px';
		}
	}

	h *= s;
	w *= s;
	
	// Rotation case is handled via VML canvas
	var rad = this.getTextRotation() * (Math.PI / 180);
	
	// Precalculate cos and sin for the rotation
	var real_cos = parseFloat(parseFloat(Math.cos(rad)).toFixed(8));
	var real_sin = parseFloat(parseFloat(Math.sin(-rad)).toFixed(8));

	rad %= 2 * Math.PI;
	
	if (rad < 0)
	{
		rad += 2 * Math.PI;
	}
	
	rad %= Math.PI;
	
	if (rad > Math.PI / 2)
	{
		rad = Math.PI - rad;
	}
	
	var cos = Math.cos(rad);
	var sin = Math.sin(-rad);

	var tx = w * -(dx + 0.5);
	var ty = h * -(dy + 0.5);

	var top_fix = (h - h * cos + w * sin) / 2 + real_sin * tx - real_cos * ty;
	var left_fix = (w - w * cos + h * sin) / 2 - real_cos * tx - real_sin * ty;
	
	if (rad != 0)
	{
		var f = 'progid:DXImageTransform.Microsoft.Matrix(M11=' + real_cos + ', M12='+
			real_sin + ', M21=' + (-real_sin) + ', M22=' + real_cos + ', sizingMethod=\'auto expand\')';
		
		if (style.filter != null && style.filter.length > 0)
		{
			style.filter += ' ' + f;
		}
		else
		{
			style.filter = f;
		}
	}
	
	// Workaround for rendering offsets
	var dy = 0;
	
	style.zoom = s;
	style.left = Math.round(this.bounds.x + left_fix - w / 2) + 'px';
	style.top = Math.round(this.bounds.y + top_fix - h / 2 + dy) + 'px';
};

/**
 * Function: updateValue
 *
 * Updates the HTML node(s) to reflect the latest bounds and scale.
 */
mxText.prototype.updateValue = function()
{
	if (mxUtils.isNode(this.value))
	{
		this.node.innerText = '';
		this.node.appendChild(this.value);
	}
	else
	{
		var val = this.value;
		
		if (this.dialect != mxConstants.DIALECT_STRICTHTML)
		{
			val = mxUtils.htmlEntities(val, false);
		}
		
		// Handles trailing newlines to make sure they are visible in rendering output
		val = mxUtils.replaceTrailingNewlines(val, '<div><br></div>');
		val = (this.replaceLinefeeds) ? val.replace(/\n/g, '<br/>') : val;
		var bg = (this.background != null && this.background != mxConstants.NONE) ? this.background : null;
		var bd = (this.border != null && this.border != mxConstants.NONE) ? this.border : null;

		if (this.overflow == 'fill' || this.overflow == 'width')
		{
			if (bg != null)
			{
				this.node.style.backgroundColor = bg;
			}
			
			if (bd != null)
			{
				this.node.style.border = '1px solid ' + bd;
			}
		}
		else
		{
			var css = '';
			
			if (bg != null)
			{
				css += 'background-color:' + mxUtils.htmlEntities(bg) + ';';
			}
			
			if (bd != null)
			{
				css += 'border:1px solid ' + mxUtils.htmlEntities(bd) + ';';
			}
			
			// Wrapper DIV for background, zoom needed for inline in quirks
			// and to measure wrapped font sizes in all browsers
			// FIXME: Background size in quirks mode for wrapped text
			var lh = (mxConstants.ABSOLUTE_LINE_HEIGHT) ? (this.size * mxConstants.LINE_HEIGHT) + 'px' :
				mxConstants.LINE_HEIGHT;
			val = '<div style="zoom:1;' + css + 'display:inline-block;_display:inline;text-decoration:inherit;' +
				'padding-bottom:1px;padding-right:1px;line-height:' + lh + '">' + val + '</div>';
		}

		this.node.innerHTML = val;
		
		// Sets text direction
		var divs = this.node.getElementsByTagName('div');
		
		if (divs.length > 0)
		{
			// LATER: Add vertical writing-mode support
			var dir = this.textDirection;

			if (dir == mxConstants.TEXT_DIRECTION_AUTO && this.dialect != mxConstants.DIALECT_STRICTHTML)
			{
				dir = this.getAutoDirection();
			}
			
			if (dir == mxConstants.TEXT_DIRECTION_LTR || dir == mxConstants.TEXT_DIRECTION_RTL)
			{
				divs[divs.length - 1].setAttribute('dir', dir);
			}
			else
			{
				divs[divs.length - 1].removeAttribute('dir');
			}
		}
	}
};

/**
 * Function: updateFont
 *
 * Updates the HTML node(s) to reflect the latest bounds and scale.
 */
mxText.prototype.updateFont = function(node)
{
	var style = node.style;
	
	style.lineHeight = (mxConstants.ABSOLUTE_LINE_HEIGHT) ? (this.size * mxConstants.LINE_HEIGHT) + 'px' : mxConstants.LINE_HEIGHT;
	style.fontSize = this.size + 'px';
	style.fontFamily = this.family;
	style.verticalAlign = 'top';
	style.color = this.color;
	
	if ((this.fontStyle & mxConstants.FONT_BOLD) == mxConstants.FONT_BOLD)
	{
		style.fontWeight = 'bold';
	}
	else
	{
		style.fontWeight = '';
	}

	if ((this.fontStyle & mxConstants.FONT_ITALIC) == mxConstants.FONT_ITALIC)
	{
		style.fontStyle = 'italic';
	}
	else
	{
		style.fontStyle = '';
	}
	
	var txtDecor = [];
	
	if ((this.fontStyle & mxConstants.FONT_UNDERLINE) == mxConstants.FONT_UNDERLINE)
	{
		txtDecor.push('underline');
	}
	
	if ((this.fontStyle & mxConstants.FONT_STRIKETHROUGH) == mxConstants.FONT_STRIKETHROUGH)
	{
		txtDecor.push('line-through');
	}
	
	style.textDecoration = txtDecor.join(' ');
	
	if (this.align == mxConstants.ALIGN_CENTER)
	{
		style.textAlign = 'center';
	}
	else if (this.align == mxConstants.ALIGN_RIGHT)
	{
		style.textAlign = 'right';
	}
	else
	{
		style.textAlign = 'left';
	}
};

/**
 * Function: updateSize
 *
 * Updates the HTML node(s) to reflect the latest bounds and scale.
 */
mxText.prototype.updateSize = function(node, enableWrap)
{
	var w = Math.max(0, Math.round(this.bounds.width / this.scale));
	var h = Math.max(0, Math.round(this.bounds.height / this.scale));
	var style = node.style;
	
	// NOTE: Do not use maxWidth here because wrapping will
	// go wrong if the cell is outside of the viewable area
	if (this.clipped)
	{
		style.overflow = 'hidden';
		style.maxHeight = h + 'px';
		style.maxWidth = w + 'px';
	}
	else if (this.overflow == 'fill')
	{
		style.width = (w + 1) + 'px';
		style.height = (h + 1) + 'px';
		style.overflow = 'hidden';
	}
	else if (this.overflow == 'width')
	{
		style.width = (w + 1) + 'px';
		style.maxHeight = (h + 1) + 'px';
		style.overflow = 'hidden';
	}
	else if (this.overflow == 'block')
	{
		style.width = (w + 1) + 'px';
	}
	
	if (this.wrap && w > 0)
	{
		style.wordWrap = mxConstants.WORD_WRAP;
		style.whiteSpace = 'normal';
		style.width = w + 'px';

		if (enableWrap && this.overflow != 'fill' && this.overflow != 'width')
		{
			var sizeDiv = node;
			
			if (sizeDiv.firstChild != null && sizeDiv.firstChild.nodeName == 'DIV')
			{
				sizeDiv = sizeDiv.firstChild;
				
				if (node.style.wordWrap == 'break-word')
				{
					sizeDiv.style.width = '100%';
				}
			}
			
			var tmp = sizeDiv.offsetWidth;
			
			// Workaround for text measuring in hidden containers
			if (tmp == 0)
			{
				var prev = node.parentNode;
				node.style.visibility = 'hidden';
				document.body.appendChild(node);
				tmp = sizeDiv.offsetWidth;
				node.style.visibility = '';
				prev.appendChild(node);
			}

			tmp += 3;
			
			if (this.clipped)
			{
				tmp = Math.min(tmp, w);
			}
			
			style.width = tmp + 'px';
		}
	}
	else
	{
		style.whiteSpace = 'nowrap';
	}
};

/**
 * Function: updateMargin
 *
 * Updates the margin of this text shape.
 */
mxText.prototype.updateMargin = function()
{
	this.margin = mxUtils.getAlignmentAsPoint(this.align, this.valign);
};

/**
 * Function: getSpacing
 *
 * Returns the spacing as an <mxPoint>.
 */
mxText.prototype.getSpacing = function(noBase, margin)
{
	var dx = 0;
	var dy = 0;

	if ((margin != null && margin.x == -0.5) ||
		(margin == null && this.align == mxConstants.ALIGN_CENTER))
	{
		dx = (this.spacingLeft - this.spacingRight) / 2;
	}
	else if ((margin != null && margin.x == -1) ||
		(margin == null && this.align == mxConstants.ALIGN_RIGHT))
	{
		dx = -this.spacingRight - (noBase? 0 : this.baseSpacingRight);
	}
	else
	{
		dx = this.spacingLeft + (noBase? 0 : this.baseSpacingLeft);
	}

	if (this.valign == mxConstants.ALIGN_MIDDLE)
	{
		dy = (this.spacingTop - this.spacingBottom) / 2;
	}
	else if (this.valign == mxConstants.ALIGN_BOTTOM)
	{
		dy = -this.spacingBottom - (noBase? 0 : this.baseSpacingBottom);
	}
	else
	{
		dy = this.spacingTop + (noBase? 0 : this.baseSpacingTop);
	}
	
	return new mxPoint(dx, dy);
};
