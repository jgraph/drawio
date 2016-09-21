/**
 * $Id: mxDoors.js,v 1.0 2015/11/17 14:19:14 mate Exp $
 * Copyright (c) 2006-2013, JGraph Ltd
 */

//**********************************************************************************************************************************************************
//Doors Mockup parent shape
//**********************************************************************************************************************************************************
function mxDoorsMockup(bounds, fill, stroke, strokewidth)
{
	mxShape.call(this);
	this.bounds = bounds;
	this.fill = fill;
	this.stroke = stroke;
	this.strokewidth = (strokewidth != null) ? strokewidth : 1;
};

/**
 * Extends mxSwimlane.
 */
mxUtils.extend(mxDoorsMockup, mxShape);

//constants
mxDoorsMockup.prototype.cst = {
		DECORATED_LABEL : 'mxgraph.doorsMockup.decoratedLabel',
		COMBO_BOX : 'mxgraph.doorsMockup.comboBox',
		SPINNER : 'mxgraph.doorsMockup.spinner',
		TAB_ITEM : 'mxgraph.doorsMockup.tabItem',
		IS_DISABLED : 'uiElementDisabled',
		IS_SELECTED : 'uiElementSelected',
		DISABLED_FILL_COLOR : '#aaaaaa',
		DISABLED_STROKE_COLOR : '#666666',
		SELECTED_COLOR : '#83A9E2',
		CENTER_TEXT : 'uiElementText',
		RIGHT_TEXT : 'uiElementRightText',
		SHOW_SCROLLBAR : 'uiElementScrollbar',
		ICON_ID : 'uiElementIcon',
		ICON_STROKE : 'uiElementIconStrokeColor',
		ICON_FILL : 'uiElementIconFillColor'
};

//**********************************************************************************************************************************************************
//Vertical Stack Container
//**********************************************************************************************************************************************************
function mxDoorsMockupVerticalStackContainer(bounds, fill, stroke, strokewidth)
{
	mxShape.call(this);
	this.bounds = bounds;
	this.fill = fill;
	this.stroke = stroke;
	this.strokewidth = (strokewidth != null) ? strokewidth : 1;
};

/**
 * Extends mxSwimlane.
 */
mxUtils.extend(mxDoorsMockupVerticalStackContainer, mxSwimlane);

mxCellRenderer.registerShape('mxgraph.doorsMockup.verticalStackContainer', mxDoorsMockupVerticalStackContainer);

//**********************************************************************************************************************************************************
//Decorated Label
//**********************************************************************************************************************************************************
function mxDoorsMockupDecoratedLabel(bounds, fill, stroke, strokewidth)
{
	mxShape.call(this);
	this.bounds = bounds;
	this.fill = fill;
	this.stroke = stroke;
	this.strokewidth = (strokewidth != null) ? strokewidth : 1;
};

/**
* Extends mxShape.
*/
mxUtils.extend(mxDoorsMockupDecoratedLabel, mxDoorsMockup);

/**
* Function: paintVertexShape
* 
* Paints the vertex shape.
*/
mxDoorsMockupDecoratedLabel.prototype.paintVertexShape = function(c, x, y, w, h)
{
	c.translate(x, y);
	var iconStroke = mxUtils.getValue(this.style, mxDoorsMockup.prototype.cst.ICON_STROKE, '#000000');
	var iconFill = mxUtils.getValue(this.style, mxDoorsMockup.prototype.cst.ICON_FILL, '#ffffff');
	var iconId = mxUtils.getValue(this.style, mxDoorsMockup.prototype.cst.ICON_ID, '0');
	var centerText = mxUtils.getValue(this.style, mxDoorsMockup.prototype.cst.CENTER_TEXT, '').toString();
	var rightText = mxUtils.getValue(this.style, mxDoorsMockup.prototype.cst.RIGHT_TEXT, '').toString();
	var fontSize = mxUtils.getValue(this.style, mxConstants.STYLE_FONTSIZE, '12');
	var fontColor = mxUtils.getValue(this.style, mxConstants.STYLE_FONTCOLOR, '#000000');
	var isDisabled = mxUtils.getValue(this.style, mxDoorsMockup.prototype.cst.IS_DISABLED, '0');
	var isSelected = mxUtils.getValue(this.style, mxDoorsMockup.prototype.cst.IS_SELECTED, '0');

	if (isDisabled == '1')
	{
		iconStroke = mxDoorsMockup.prototype.cst.DISABLED_FILL_COLOR;
		iconFill = mxDoorsMockup.prototype.cst.DISABLED_FILL_COLOR;
		fontColor = mxDoorsMockup.prototype.cst.DISABLED_FILL_COLOR;
	}
	else if (isSelected == '1')
	{
		c.setStrokeColor('none');
		c.setFillColor(mxDoorsMockup.prototype.cst.SELECTED_COLOR);
	}
	
	c.begin();
	c.rect(0, 0, w, h);
	c.fillAndStroke();
	
	c.setShadow(false);
	this.drawIcon(c, h * 0.1, h * 0.1, h * 0.8, h * 0.8, iconStroke, iconFill, iconId);
	
	var indent = 10;

	c.setFontSize(fontSize);
	c.setFontColor(fontColor);
	c.text(w - indent, h * 0.5, 0, 0, rightText, mxConstants.ALIGN_RIGHT, mxConstants.ALIGN_MIDDLE, 0, null, 0, 0, 0);
	
	if (iconId > 0)
	{
		indent = h + indent;
	}
	
	c.text(indent, h * 0.5, 0, 0, centerText, mxConstants.ALIGN_LEFT, mxConstants.ALIGN_MIDDLE, 0, null, 0, 0, 0);
};

mxCellRenderer.registerShape(mxDoorsMockup.prototype.cst.DECORATED_LABEL, mxDoorsMockupDecoratedLabel);

//**********************************************************************************************************************************************************
//Icon draw functions
//**********************************************************************************************************************************************************
mxDoorsMockup.prototype.drawIcon = function(c, x, y, w, h, iconStroke, iconFill, iconId)
{
	c.save();
	c.translate(x, y);
	c.setStrokeColor(iconStroke);
	c.setFillColor(iconFill);
	
	c.begin();

	if (iconId == 2)
	{
		this.drawClosedFolderIcon(c, 0, h * 0.065, w, h * 0.87);
	}
	else if (iconId == 3)
	{
		this.drawOpenFolderIcon(c, 0, h * 0.095, w, h * 0.81);
	}
	else if (iconId == 4)
	{
		this.drawPlusBoxIcon(c, 0, 0, w, h);
	}
	else if (iconId == 5)
	{
		this.drawMinusBoxIcon(c, 0, 0, w, h);
	}
	else if (iconId == 6)
	{
		this.drawRadioButtonOffIcon(c, h * 0.25, h * 0.25, h * 0.5, h * 0.5);
	}
	else if (iconId == 7)
	{
		this.drawRadioButtonOnIcon(c, h * 0.25, h * 0.25, h * 0.5, h * 0.5);
	}
	else if (iconId == 8)
	{
		this.drawCheckboxOffIcon(c, 0, 0, w, h);
	}
	else if (iconId == 9)
	{
		this.drawCheckboxOnIcon(c, 0, 0, w, h);
	}
	else if (iconId == 10)
	{
		this.drawCheckboxIndeterminateIcon(c, 0, 0, w, h);
	}
	else if (iconId == 11)
	{
		this.drawPlainCheckIcon(c, w * 0.085, h * 0.125, w * 0.83, h * 0.75);
	}
	else if (iconId == 12)
	{
		this.drawCircleIcon(c, h * 0.25, h * 0.25, h * 0.5, h * 0.5);
	}
	else if (iconId == 13)
	{
		this.drawTwistyClosedIcon(c, w * 0.05, 0, w * 0.9, h);
	}
	else if (iconId == 14)
	{
		this.drawTwistyOpenIcon(c, 0, h * 0.05, w, h * 0.9);
	}
	else if (iconId == 15)
	{
		this.drawFileIcon(c, w * 0.11, 0, w * 0.78, h);
	};
	
	c.restore();
};

mxDoorsMockup.prototype.drawClosedFolderIcon = function(c, x, y, w, h)
{
	c.translate(x, y);
	c.moveTo(0, h);
	c.lineTo(0, h * 0.0805);
	c.arcTo(w * 0.07, h * 0.0805, 0, 0, 1, w * 0.07, 0);
	c.lineTo(w * 0.35, 0);
	c.arcTo(w * 0.07, h * 0.0805, 0, 0, 1, w * 0.42, h * 0.0805);
	c.lineTo(w * 0.42, h * 0.1494);
	c.lineTo(w * 0.93, h * 0.1494);
	c.arcTo(w * 0.07, h * 0.0805, 0, 0, 1, w, h * 0.2299);
	c.lineTo(w, h);
	c.close();
	c.fillAndStroke();
};

mxDoorsMockup.prototype.drawOpenFolderIcon = function(c, x, y, w, h)
{
	c.translate(x, y);
	c.moveTo(0, h);
	c.lineTo(0, h * 0.06173);
	c.arcTo(w * 0.05, h * 0.06173, 0, 0, 1, w * 0.05, 0);
	c.lineTo(w * 0.28, 0);
	c.arcTo(w * 0.05, h * 0.06173, 0, 0, 1, w * 0.33, h * 0.06173);
	c.lineTo(w * 0.33, h * 0.1358);
	c.lineTo(w * 0.78, h * 0.1358);
	c.arcTo(w * 0.05, h * 0.06173, 0, 0, 1, w * 0.83, h * 0.1975);
	c.lineTo(w * 0.83, h * 0.2716);
	c.lineTo(w, h * 0.2716);
	c.lineTo(w * 0.83, h);
	c.close();
	c.stroke();

	c.setShadow(false);
	
	c.begin();
	c.moveTo(0, h);
	c.lineTo(w * 0.12, h * 0.2716);
	c.lineTo(w, h * 0.2716);
	c.lineTo(w * 0.83, h);
	c.fillAndStroke();
};

mxDoorsMockup.prototype.drawPlusBoxIcon = function(c, x, y, w, h)
{
	c.translate(x, y);
	c.rect(0, 0, w, h);
	c.stroke();
	
	c.setStrokeWidth(4);
	c.begin();
	c.moveTo(w * 0.1, h * 0.5);
	c.lineTo(w * 0.9, h * 0.5);
	c.moveTo(w * 0.5, h * 0.1);
	c.lineTo(w * 0.5, h * 0.9);
	c.stroke();
};

mxDoorsMockup.prototype.drawMinusBoxIcon = function(c, x, y, w, h)
{
	c.translate(x, y);
	c.rect(0, 0, w, h);
	c.stroke();
	
	c.setStrokeWidth(4);
	c.begin();
	c.moveTo(w * 0.1, h * 0.5);
	c.lineTo(w * 0.9, h * 0.5);
	c.stroke();
};

mxDoorsMockup.prototype.drawRadioButtonOffIcon = function(c, x, y, w, h)
{
	c.translate(x, y);
	c.ellipse(0, 0, w, h);
	c.stroke();
};

mxDoorsMockup.prototype.drawRadioButtonOnIcon = function(c, x, y, w, h)
{
	c.translate(x, y);
	c.ellipse(0, 0, w, h);
	c.stroke();
	
	c.ellipse(w * 0.15, h * 0.15, w * 0.7, h * 0.7);
	c.fill();
};

mxDoorsMockup.prototype.drawCheckboxOffIcon = function(c, x, y, w, h)
{
	c.translate(x, y);
	c.rect(0, 0, w, h);
	c.stroke();
};

mxDoorsMockup.prototype.drawCheckboxOnIcon = function(c, x, y, w, h)
{
	c.translate(x, y);
	c.rect(0, 0, w, h);
	c.stroke();
	
	c.setStrokeWidth(4);
	c.setLineJoin('round');
	c.setLineCap('round');
	
	c.begin();
	c.moveTo(w * 0.08, h * 0.64);
	c.lineTo(w * 0.31, h * 0.9);
	c.lineTo(w * 0.91, h * 0.15);
	c.stroke();
};

mxDoorsMockup.prototype.drawCheckboxIndeterminateIcon = function(c, x, y, w, h)
{
	c.translate(x, y);
	c.rect(0, 0, w, h);
	c.stroke();
	
	c.begin();
	c.rect(w * 0.1, h * 0.1, w * 0.8, h * 0.8);
	c.fill();
};

mxDoorsMockup.prototype.drawPlainCheckIcon = function(c, x, y, w, h)
{
	c.translate(x, y);
	
	c.setStrokeWidth(4);
	c.setLineJoin('round');
	c.setLineCap('round');
	
	c.begin();
	c.moveTo(0, h * 0.6533);
	c.lineTo(w * 0.2771, h);
	c.lineTo(w, 0);
	c.stroke();
};

mxDoorsMockup.prototype.drawCircleIcon = function(c, x, y, w, h)
{
	c.translate(x, y);

	c.ellipse(0, 0, w, h);
	c.fillAndStroke();
};

mxDoorsMockup.prototype.drawTwistyClosedIcon = function(c, x, y, w, h)
{
	c.translate(x, y);

	c.moveTo(0, 0);
	c.lineTo(w, h * 0.5);
	c.lineTo(0, h);
	c.close();
	c.fillAndStroke();
};

mxDoorsMockup.prototype.drawTwistyOpenIcon = function(c, x, y, w, h)
{
	c.translate(x, y);

	c.moveTo(0, 0);
	c.lineTo(w * 0.5, h);
	c.lineTo(w, 0);
	c.close();
	c.fillAndStroke();
};

mxDoorsMockup.prototype.drawFileIcon = function(c, x, y, w, h)
{
	c.translate(x, y);

	c.moveTo(w * 0.0641, h);
	c.arcTo(w * 0.0641, h * 0.05, 0, 0, 1, 0, h * 0.95);
	c.lineTo(0, h * 0.05);
	c.arcTo(w * 0.0641, h * 0.05, 0, 0, 1, w * 0.0641, 0);
	c.lineTo(w * 0.6667, 0);
	c.lineTo(w, h * 0.2);
	c.lineTo(w, h * 0.95);
	c.arcTo(w * 0.0641, h * 0.05, 0, 0, 1, w * 0.9359, h);
	c.close();
	c.moveTo(w * 0.0897, h * 0.92);
	c.lineTo(w * 0.9103, h * 0.92);
	c.lineTo(w * 0.9103, h * 0.26);
	c.lineTo(w * 0.577, h * 0.26);
	c.arcTo(w * 0.0641, h * 0.05, 0, 0, 1, w * 0.5385, h * 0.23);
	c.lineTo(w * 0.5385, h * 0.08);
	c.lineTo(w * 0.0897, h * 0.08);
	c.close();
	c.moveTo(w * 0.2308, h * 0.8);
	c.lineTo(w * 0.2308, h * 0.73);
	c.lineTo(w * 0.7821, h * 0.73);
	c.lineTo(w * 0.7821, h * 0.8);
	c.close();
	c.moveTo(w * 0.2308, h * 0.63);
	c.lineTo(w * 0.2308, h * 0.56);
	c.lineTo(w * 0.7821, h * 0.56);
	c.lineTo(w * 0.7821, h * 0.63);
	c.close();
	c.moveTo(w * 0.2308, h * 0.44);
	c.lineTo(w * 0.2308, h * 0.37);
	c.lineTo(w * 0.7821, h * 0.37);
	c.lineTo(w * 0.7821, h * 0.44);
	c.close();
	c.moveTo(w * 0.2308, h * 0.26);
	c.lineTo(w * 0.2308, h * 0.19);
	c.lineTo(w * 0.4231, h * 0.19);
	c.lineTo(w * 0.4231, h * 0.26);
	c.close();
	c.fillAndStroke();
};

//**********************************************************************************************************************************************************
//Listbox
//**********************************************************************************************************************************************************
function mxDoorsMockupListbox(bounds, fill, stroke, strokewidth)
{
	mxShape.call(this);
	this.bounds = bounds;
	this.fill = fill;
	this.stroke = stroke;
	this.strokewidth = (strokewidth != null) ? strokewidth : 1;
};

/**
* Extends mxSwimlane.
*/
mxUtils.extend(mxDoorsMockupListbox, mxSwimlane);

/**
 * Function: paintVertexShape
 *
 * Paints the swimlane vertex shape.
 */
mxDoorsMockupListbox.prototype.paintVertexShape = function(c, x, y, w, h)
{
	var start = this.getTitleSize();
	var fill = mxUtils.getValue(this.style, mxConstants.STYLE_SWIMLANE_FILLCOLOR, mxConstants.NONE);
	var swimlaneLine = mxUtils.getValue(this.style, mxConstants.STYLE_SWIMLANE_LINE, 1) == 1;
	var r = 0;
	
	start = Math.min(start, h);
	
	c.translate(x, y);
	
	this.paintSwimlane(c, x, y, w, h, start, fill, swimlaneLine);
	
	var sep = mxUtils.getValue(this.style, mxConstants.STYLE_SEPARATORCOLOR, mxConstants.NONE);
	this.paintSeparator(c, x, y, w, h, start, sep);

	if (this.image != null)
	{
		var bounds = this.getImageBounds(x, y, w, h);
		c.image(bounds.x - x, bounds.y - y, bounds.width, bounds.height,
				this.image, false, false, false);
	}
	
	if (this.glass)
	{
		c.setShadow(false);
		this.paintGlassEffect(c, 0, 0, w, start, r);
	}
};

/**
 * Function: paintSwimlane
 *
 * Paints the swimlane vertex shape.
 */

//TODO resolve inheritance issue
// for now, if you want to see the scrollbar, switch the comment on the two lines below
// if upper line is enabled, no scrollbar will be visible
// the lower line enables scrollbar visibility, but messes up other shapes based on mxSwimlane

mxDoorsMockupListbox.prototype.paintSwimlane = function(c, x, y, w, h, start, fill, swimlaneLine)
//mxSwimlane.prototype.paintSwimlane = function(c, x, y, w, h, start, fill, swimlaneLine)
{
	if (fill != mxConstants.NONE)
	{
		c.save();
		c.setFillColor(fill);
		c.rect(0, 0, w, h);
		c.fillAndStroke();
		c.restore();
		c.setShadow(false);
	}

	c.begin();
	c.moveTo(0, start);
	c.lineTo(0, 0);
	c.lineTo(w, 0);
	c.lineTo(w, start);
	
	if (swimlaneLine || start >= h)
	{
		c.close();
	}

	c.fillAndStroke();
	
	var showScrollbar = mxUtils.getValue(this.style, mxDoorsMockup.prototype.cst.SHOW_SCROLLBAR, '0');
	var strokeColor = mxUtils.getValue(this.style, mxConstants.STYLE_STROKECOLOR, '#000000');
	var sbw = 20; //scrollbar width
	
	if (showScrollbar == 1 && (h - start - 2 * sbw > 0) && (w > sbw))
	{
		c.save();
		c.begin();
		c.rect(w - sbw, start, sbw, h - start);
		c.stroke();
		
		c.begin();
		c.moveTo(w - sbw, start + sbw);
		c.lineTo(w, start + sbw);
		c.moveTo(w - sbw, h - sbw);
		c.lineTo(w, h - sbw);
		c.stroke();
		
		c.setFillColor(strokeColor);
		c.begin();
		c.moveTo(w - sbw * 0.8, start + sbw * 0.8);
		c.lineTo(w - sbw * 0.5, start + sbw * 0.2);
		c.lineTo(w - sbw * 0.2, start + sbw * 0.8);
		c.close();
		c.moveTo(w - sbw * 0.8, h - sbw * 0.8);
		c.lineTo(w - sbw * 0.5, h - sbw * 0.2);
		c.lineTo(w - sbw * 0.2, h - sbw * 0.8);
		c.close();
		c.fill();
		
		if (h > start + sbw * 5.2)
		{
			c.rect(w - sbw * 0.8, start + sbw * 1.2, sbw * 0.6, sbw * 3);
			c.fill();
		}
		else if (h > start + sbw * 2.4)
		{
			c.rect(w - sbw * 0.8, start + sbw * 1.2, sbw * 0.6, h - start - 2.4 * sbw);
			c.fill();
		}

		c.restore();
	}
	
	
	// Transparent content area
	if (start < h && fill == mxConstants.NONE)
	{
		c.pointerEvents = false;
		
		c.begin();
		c.moveTo(0, start);
		c.lineTo(0, h);
		c.lineTo(w, h);
		c.lineTo(w, start);
		c.stroke();
	}
};

mxCellRenderer.registerShape('mxgraph.doorsMockup.listbox', mxDoorsMockupListbox);

//**********************************************************************************************************************************************************
//Combo box
//**********************************************************************************************************************************************************
function mxDoorsMockupComboBox(bounds, fill, stroke, strokewidth)
{
	mxShape.call(this);
	this.bounds = bounds;
	this.fill = fill;
	this.stroke = stroke;
	this.strokewidth = (strokewidth != null) ? strokewidth : 1;
};

/**
* Extends mxShape.
*/
mxUtils.extend(mxDoorsMockupComboBox, mxDoorsMockup);

/**
* Function: paintVertexShape
* 
* Paints the vertex shape.
*/
mxDoorsMockupComboBox.prototype.paintVertexShape = function(c, x, y, w, h)
{
	c.translate(x, y);
	this.background(c, x, y, w, h);
	c.setShadow(false);
	this.foreground(c, x, y, w, h);
};

mxDoorsMockupComboBox.prototype.background = function(c, x, y, w, h)
{
	var isDisabled = mxUtils.getValue(this.style, mxDoorsMockup.prototype.cst.IS_DISABLED, '0');
	c.save();
	if (isDisabled == 1)
	{
		c.setStrokeColor(mxDoorsMockup.prototype.cst.DISABLED_STROKE_COLOR);
		c.setFillColor(mxDoorsMockup.prototype.cst.DISABLED_FILL_COLOR);
		c.setFontColor(mxDoorsMockup.prototype.cst.DISABLED_STROKE_COLOR);
	}
	else
	{
		c.setFillColor('#ffffff');
	}

	c.rect(0, 0, w, h);
	c.fillAndStroke();
	c.restore();
};

mxDoorsMockupComboBox.prototype.foreground = function(c, x, y, w, h)
{
	var strokeColor = mxUtils.getValue(this.style, mxConstants.STYLE_STROKECOLOR, '#000000');
	var isDisabled = mxUtils.getValue(this.style, mxDoorsMockup.prototype.cst.IS_DISABLED, '0');
	var isSelected = mxUtils.getValue(this.style, mxDoorsMockup.prototype.cst.IS_SELECTED, '0');

	if (isDisabled == 1)
	{
		c.setStrokeColor(mxDoorsMockup.prototype.cst.DISABLED_STROKE_COLOR);
		c.setFillColor(mxDoorsMockup.prototype.cst.DISABLED_FILL_COLOR);
	}
	else if (isSelected == 1)
	{
		c.setFillColor(mxDoorsMockup.prototype.cst.SELECTED_COLOR);
	}

	if (w > h)
	{
		c.rect(w - h, 0, h, h);
		c.fillAndStroke();

		if (isDisabled == 1 || isSelected == 1)
		{
			c.setFillColor(mxDoorsMockup.prototype.cst.DISABLED_STROKE_COLOR);
		}
		else
		{
			c.setFillColor(strokeColor);
		}

		c.begin();
		c.moveTo(w - h * 0.8, h * 0.2);
		c.lineTo(w - h * 0.2, h * 0.2);
		c.lineTo(w - h * 0.5, h * 0.8);
		c.close();
		c.fill();
	}
	
	var centerText = mxUtils.getValue(this.style, mxDoorsMockup.prototype.cst.CENTER_TEXT, '').toString();
	c.setFontSize(mxUtils.getValue(this.style, mxConstants.STYLE_FONTSIZE, '12'));
	
	if (isDisabled == 1)
	{
		c.setFontColor(mxDoorsMockup.prototype.cst.DISABLED_STROKE_COLOR);
	}
	else
	{
		c.setFontColor(mxUtils.getValue(this.style, mxConstants.STYLE_FONTCOLOR, '#000000'));
	}

	c.text(10, h * 0.5, 0, 0, centerText, mxConstants.ALIGN_LEFT, mxConstants.ALIGN_MIDDLE, 0, null, 0, 0, 0);
};

mxCellRenderer.registerShape(mxDoorsMockup.prototype.cst.COMBO_BOX, mxDoorsMockupComboBox);

//**********************************************************************************************************************************************************
//Spinner
//**********************************************************************************************************************************************************
function mxDoorsMockupSpinner(bounds, fill, stroke, strokewidth)
{
	mxShape.call(this);
	this.bounds = bounds;
	this.fill = fill;
	this.stroke = stroke;
	this.strokewidth = (strokewidth != null) ? strokewidth : 1;
};

/**
* Extends mxShape.
*/
mxUtils.extend(mxDoorsMockupSpinner, mxDoorsMockup);

/**
* Function: paintVertexShape
* 
* Paints the vertex shape.
*/
mxDoorsMockupSpinner.prototype.paintVertexShape = function(c, x, y, w, h)
{
	c.translate(x, y);
	this.background(c, x, y, w, h);
	c.setShadow(false);
	this.foreground(c, x, y, w, h);
};

mxDoorsMockupSpinner.prototype.background = function(c, x, y, w, h)
{
	var isDisabled = mxUtils.getValue(this.style, mxDoorsMockup.prototype.cst.IS_DISABLED, '0');
	c.save();
	
	if (isDisabled == 1)
	{
		c.setStrokeColor(mxDoorsMockup.prototype.cst.DISABLED_STROKE_COLOR);
		c.setFontColor(mxDoorsMockup.prototype.cst.DISABLED_STROKE_COLOR);
	}
	else
	{
		c.setFillColor('#ffffff');
	}

	c.rect(0, 0, w, h);
	c.fillAndStroke();
	c.restore();
};

mxDoorsMockupSpinner.prototype.foreground = function(c, x, y, w, h)
{
	var strokeColor = mxUtils.getValue(this.style, mxConstants.STYLE_STROKECOLOR, '#000000');
	var isDisabled = mxUtils.getValue(this.style, mxDoorsMockup.prototype.cst.IS_DISABLED, '0');

	if (isDisabled == 1)
	{
		c.setStrokeColor(mxDoorsMockup.prototype.cst.DISABLED_STROKE_COLOR);
		c.setFillColor(mxDoorsMockup.prototype.cst.DISABLED_FILL_COLOR);
	}

	if (w > h)
	{
		if (isDisabled == 1)
		{
			c.setFillColor(mxDoorsMockup.prototype.cst.DISABLED_FILL_COLOR);
		}

		c.rect(w - h, 0, h, h);
		c.fillAndStroke();

		if (isDisabled == 1)
		{
			c.setFillColor(mxDoorsMockup.prototype.cst.DISABLED_STROKE_COLOR);
		}
		else
		{
			c.setFillColor(strokeColor);
		}

		c.begin();
		c.moveTo(w - h * 0.2, h * 0.4);
		c.lineTo(w - h * 0.5, h * 0.2);
		c.lineTo(w - h * 0.8, h * 0.4);
		c.close();
		c.moveTo(w - h * 0.2, h * 0.6);
		c.lineTo(w - h * 0.8, h * 0.6);
		c.lineTo(w - h * 0.5, h * 0.8);
		c.close();
		c.fill();
	}
	
	var centerText = mxUtils.getValue(this.style, mxDoorsMockup.prototype.cst.CENTER_TEXT, '').toString();
	c.setFontSize(mxUtils.getValue(this.style, mxConstants.STYLE_FONTSIZE, '12'));
	
	if (isDisabled == 1)
	{
		c.setFontColor(mxDoorsMockup.prototype.cst.DISABLED_STROKE_COLOR);
	}
	else
	{
		c.setFontColor(mxUtils.getValue(this.style, mxConstants.STYLE_FONTCOLOR, '#000000'));
	}

	c.text(10, h * 0.5, 0, 0, centerText, mxConstants.ALIGN_LEFT, mxConstants.ALIGN_MIDDLE, 0, null, 0, 0, 0);
};

mxCellRenderer.registerShape(mxDoorsMockup.prototype.cst.SPINNER, mxDoorsMockupSpinner);

//**********************************************************************************************************************************************************
//Tab Item
//**********************************************************************************************************************************************************
function mxDoorsMockupTabItem(bounds, fill, stroke, strokewidth)
{
	mxShape.call(this);
	this.bounds = bounds;
	this.fill = fill;
	this.stroke = stroke;
	this.strokewidth = (strokewidth != null) ? strokewidth : 1;
};

/**
* Extends mxShape.
*/
mxUtils.extend(mxDoorsMockupTabItem, mxDoorsMockup);

/**
* Function: paintVertexShape
* 
* Paints the vertex shape.
*/
mxDoorsMockupTabItem.prototype.paintVertexShape = function(c, x, y, w, h)
{
	c.translate(x, y);
	this.background(c, x, y, w, h);
	c.setShadow(false);
	this.foreground(c, x, y, w, h);
};

mxDoorsMockupTabItem.prototype.background = function(c, x, y, w, h)
{
	var isDisabled = mxUtils.getValue(this.style, mxDoorsMockup.prototype.cst.IS_DISABLED, '0');
	var isSelected = mxUtils.getValue(this.style, mxDoorsMockup.prototype.cst.IS_SELECTED, '0');
	c.save();
	
	if (isDisabled == 1)
	{
		c.setStrokeColor(mxDoorsMockup.prototype.cst.DISABLED_STROKE_COLOR);
		c.setFillColor(mxDoorsMockup.prototype.cst.DISABLED_FILL_COLOR);
		c.setFontColor(mxDoorsMockup.prototype.cst.DISABLED_STROKE_COLOR);
	}
	else if(isSelected == 1)
	{
		c.setFillColor(mxDoorsMockup.prototype.cst.SELECTED_COLOR);
	}
	else
	{
		c.setFillColor('#ffffff');
	}

	var rSize = 10;
	
	if (rSize > h || 2 * rSize > w)
	{
		c.rect(0, 0, w, h);
	}
	else
	{
		c.begin();
		c.moveTo(0, h);
		c.lineTo(0, rSize);
		c.arcTo(rSize, rSize, 0, 0, 1, rSize, 0);
		c.lineTo(w - rSize, 0);
		c.arcTo(rSize, rSize, 0, 0, 1, w, rSize);
		c.lineTo(w, h);
		c.close();
	}
	
	c.fillAndStroke();
	c.restore();
	
	if (isDisabled == 1)
	{
		c.setFontColor(mxDoorsMockup.prototype.cst.DISABLED_STROKE_COLOR);
	}
	else if (isSelected == 1)
	{
		c.setFontColor('#ffffff');
	}
	else
	{
		c.setFontColor(mxUtils.getValue(this.style, mxConstants.STYLE_FONTCOLOR, '#000000'));
	}
};

mxDoorsMockupTabItem.prototype.foreground = function(c, x, y, w, h)
{
	var centerText = mxUtils.getValue(this.style, mxDoorsMockup.prototype.cst.CENTER_TEXT, '').toString();
	c.setFontSize(mxUtils.getValue(this.style, mxConstants.STYLE_FONTSIZE, '12'));

	c.text(w * 0.5, h * 0.5, 0, 0, centerText, mxConstants.ALIGN_CENTER, mxConstants.ALIGN_MIDDLE, 0, null, 0, 0, 0);
};

mxCellRenderer.registerShape(mxDoorsMockup.prototype.cst.TAB_ITEM, mxDoorsMockupTabItem);

/**
 * Order is relevant. Do not move to start of file!
 */
Draw.loadPlugin(function(ui)
{
	var w = 100;
	var h = 100;
	var s = 'dashed=0;shape=mxgraph.doorsMockup.';
	var gn = 'mxgraph.doorsMockup';
	var dt = '';
	
	// Avoids having to bind all functions to "this"
	var sb = ui.sidebar;

	// Reusable cells
	var field = new mxCell('item: attribute', new mxGeometry(0, 0, 100, 20), 'label;html=1;fontStyle=0;strokeColor=none;fillColor=none;align=left;verticalAlign=middle;overflow=hidden;' +
		'spacingRight=4;whiteSpace=wrap;rotatable=0;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;imageWidth=16;imageHeight=16;image=' + sb.gearImage);
	field.vertex = true;

	// Default tags
	var dt = 'uml static class ';
	
	var fns = [
		sb.addEntry(dt + 'tree', function()
		{
			var cell = new mxCell('Tree', new mxGeometry(0, 0, 140, 110),
		    	'swimlane;html=1;fontStyle=0;childLayout=stackLayout;horizontal=1;startSize=26;fillColor=none;horizontalStack=0;resizeParent=1;resizeLast=0;collapsible=1;marginBottom=0;swimlaneFillColor=#ffffff;');
			cell.vertex = true;
			var first = field.clone();
			first.style += ';spacingLeft=28;';
			cell.insert(first);
			
			var second = field.clone();
			second.style += ';spacingLeft=48;';
			cell.insert(second);
			
			var third = field.clone();
			third.style += ';spacingLeft=68;';
			cell.insert(third);
			
			return sb.createVertexTemplateFromCells([cell], cell.geometry.width, cell.geometry.height, 'Tree');
		}),
		sb.createVertexTemplateEntry(s + 'verticalStackContainer;swimlane;childLayout=stackLayout;horizontal=1;startSize=26;strokeColor=#000000;fillColor=none;horizontalStack=0;resizeParent=1;resizeLast=0;collapsible=0;marginBottom=0;swimlaneFillColor=#ffffff;', w * 2, h * 3, 'vStack', 'Vertical Stack Container', null, null, null),
		sb.createVertexTemplateEntry(s + 'verticalStackContainer;swimlane;childLayout=stackLayout;horizontal=1;startSize=0;strokeColor=#000000;fillColor=none;horizontalStack=0;resizeParent=1;resizeLast=0;collapsible=0;marginBottom=0;swimlaneFillColor=#ffffff;', w * 2, h * 3, '', 'Vertical Stack Container (no header)', null, null, null),
		sb.createVertexTemplateEntry(s + 'verticalStackContainer;swimlane;childLayout=stackLayout;horizontal=0;startSize=26;strokeColor=#000000;fillColor=none;horizontalStack=1;resizeParent=1;resizeLast=0;collapsible=0;marginBottom=0;swimlaneFillColor=#ffffff;', w * 3, h * 2, 'hStack', 'Horizontal Stack Container', null, null, null),
		sb.createVertexTemplateEntry(s + 'decoratedLabel;dashed=0;strokeWidth=2;strokeColor=none;fillColor=none;uiElementText=Toggle;uiElementRightText=Right Text;uiElementIcon=11;uiElementIconStrokeColor=#000000;uiElementIconFillColor=#000000;fontSize=14;fontColor=#000000;uiElementDisabled=0;uiElementSelected=0;', w * 2, h * 0.4, '', 'Decorated Label', null, null, null),
		
		sb.createVertexTemplateEntry(s + 'verticalStackContainer;swimlane;childLayout=stackLayout;horizontal=1;startSize=0;strokeColor=#000000;fillColor=none;horizontalStack=0;resizeParent=1;resizeLast=0;collapsible=0;marginBottom=0;swimlaneFillColor=#ffffff;', w * 2, h * 3, '', 'Menu', null, null, null),
		
		sb.createVertexTemplateEntry(s + 'listbox;swimlane;childLayout=stackLayout;startSize=0;strokeColor=#000000;fillColor=none;horizontalStack=0;resizeParent=1;resizeLast=0;collapsible=0;marginBottom=0;swimlaneFillColor=#ffffff;uiElementScrollbar=1;marginRight=20;', w * 2, h * 3, '', 'Listbox', null, null, null),
		sb.createVertexTemplateEntry(s + 'comboBox;dashed=0;strokeWidth=1;strokeColor=#000000;fillColor=#ffffff;fontSize=14;fontColor=#000000;uiElementDisabled=0;uiElementSelected=0;align=left;verticalAlign=middle;uiElementText=Text;', w * 2, h * 0.4, '', 'Combo box', null, null, null),
		sb.createVertexTemplateEntry(s + 'spinner;dashed=0;strokeWidth=1;strokeColor=#000000;fillColor=#ffffff;fontSize=14;fontColor=#000000;uiElementDisabled=0;uiElementSelected=0;align=left;verticalAlign=middle;uiElementText=100;', w * 1, h * 0.3, '', 'Spinner', null, null, null),
		sb.createVertexTemplateEntry(s + 'spinner;dashed=0;strokeWidth=1;strokeColor=#B3B3B3;fillColor=#ffffff;fontSize=14;fontColor=#B3B3B3;uiElementDisabled=0;uiElementSelected=0;align=left;verticalAlign=middle;uiElementText=100;', w * 1, h * 0.3, '', 'Spinner', null, null, null),
		sb.createVertexTemplateEntry(s + 'verticalStackContainer;swimlane;childLayout=stackLayout;horizontal=0;startSize=0;strokeColor=none;fillColor=none;horizontalStack=1;resizeParent=1;resizeLast=0;collapsible=0;marginBottom=0;swimlaneFillColor=none;', w * 5, h * 0.4, '', 'Tabbar', null, null, null),
		sb.createVertexTemplateEntry(s + 'tabItem;dashed=0;strokeWidth=1;strokeColor=#000000;fillColor=#ffffff;fontSize=14;fontColor=#000000;uiElementDisabled=0;uiElementSelected=0;align=left;verticalAlign=middle;uiElementText=Tab one;', w * 1, h * 0.3, '', 'Tab Item', null, null, null)
	];

	ui.sidebar.addPaletteFunctions('doorsMockup', 'Doors Mockup', true, fns);

    // Collapses default sidebar entry and inserts this before
    var c = ui.sidebar.container;
    c.firstChild.click();
    c.insertBefore(c.lastChild, c.firstChild);
    c.insertBefore(c.lastChild, c.firstChild);
});
