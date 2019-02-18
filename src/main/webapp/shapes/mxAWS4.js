/**
 * $Id: mxAws4.js,v 1.0 2018/16/11 07:05:39 mate Exp $
 * Copyright (c) 2006-2018, JGraph Ltd
 */

//**********************************************************************************************************************************************************
//Product Icon
//**********************************************************************************************************************************************************
/**
* Extends mxShape.
*/
function mxShapeAws4ProductIcon(bounds, fill, stroke, strokewidth)
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
mxUtils.extend(mxShapeAws4ProductIcon, mxShape);

mxShapeAws4ProductIcon.prototype.cst = {
		PRODUCT_ICON : 'mxgraph.aws4.productIcon'
};

/**
* Function: paintVertexShape
* 
* Paints the vertex shape.
*/
mxShapeAws4ProductIcon.prototype.paintVertexShape = function(c, x, y, w, h)
{
	c.translate(x, y);

	var ind = 1;
	var strokeColor = mxUtils.getValue(this.state.style, 'strokeColor', '#000000');
	c.setFillColor(strokeColor);

	c.begin();
	c.moveTo(0, 0);
	c.lineTo(w, 0);
	c.lineTo(w, h);
	c.lineTo(0, h);
	c.close();
	c.fill();

	c.setShadow(false);
	var fillColor = mxUtils.getValue(this.state.style, 'fillColor', '#ffffff');
	c.setFillColor(fillColor);

	c.begin();
	c.moveTo(ind, ind);
	c.lineTo(w - ind, ind);
	c.lineTo(w - ind, w - ind);
	c.lineTo(ind, w - ind);
	c.close();
	c.fill();
	

	var prIcon = mxUtils.getValue(this.state.style, 'prIcon', '');
	var stencil = mxStencilRegistry.getStencil(prIcon);

	if (stencil != null)
	{
		c.setFillColor(strokeColor);
		c.setStrokeColor('none');
		stencil.drawShape(c, this, ind, ind, w - 2 * ind, w - 2 * ind);
	}

};

mxCellRenderer.registerShape(mxShapeAws4ProductIcon.prototype.cst.PRODUCT_ICON, mxShapeAws4ProductIcon);

//**********************************************************************************************************************************************************
//Resource Icon
//**********************************************************************************************************************************************************
/**
* Extends mxShape.
*/
function mxShapeAws4ResourceIcon(bounds, fill, stroke, strokewidth)
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
mxUtils.extend(mxShapeAws4ResourceIcon, mxShape);

mxShapeAws4ResourceIcon.prototype.cst = {
		RESOURCE_ICON : 'mxgraph.aws4.resourceIcon'
};

/**
* Function: paintVertexShape
* 
* Paints the vertex shape.
*/
mxShapeAws4ResourceIcon.prototype.paintVertexShape = function(c, x, y, w, h)
{
	c.translate(x, y);

	c.begin();
	c.moveTo(0, 0);
	c.lineTo(w, 0);
	c.lineTo(w, h);
	c.lineTo(0, h);
	c.close();
	c.fillAndStroke();

	var prIcon = mxUtils.getValue(this.state.style, 'resIcon', '');
	var stencil = mxStencilRegistry.getStencil(prIcon);

	if (stencil != null)
	{
		var strokeColor = mxUtils.getValue(this.state.style, 'strokeColor', '#000000');
		c.setFillColor(strokeColor);
		c.setStrokeColor('none');
		stencil.drawShape(c, this, 0, 0, w, h);
	}

};

mxCellRenderer.registerShape(mxShapeAws4ResourceIcon.prototype.cst.RESOURCE_ICON, mxShapeAws4ResourceIcon);

//**********************************************************************************************************************************************************
//Group
//**********************************************************************************************************************************************************
/**
* Extends mxShape.
*/
function mxShapeAws4Group(bounds, fill, stroke, strokewidth)
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
mxUtils.extend(mxShapeAws4Group, mxShape);

mxShapeAws4Group.prototype.cst = {
		GROUP : 'mxgraph.aws4.group'
};

/**
* Function: paintVertexShape
* 
* Paints the vertex shape.
*/
mxShapeAws4Group.prototype.paintVertexShape = function(c, x, y, w, h)
{
	c.translate(x, y);

	var size = 25;

	c.begin();
	c.moveTo(0, 0);
	c.lineTo(w, 0);
	c.lineTo(w, h);
	c.lineTo(0, h);
	c.close();
	c.fillAndStroke();

	c.setShadow(false);

	var grIcon = mxUtils.getValue(this.state.style, 'grIcon', '');
	var stencil = mxStencilRegistry.getStencil(grIcon);

	if (stencil != null)
	{
		var strokeColor = mxUtils.getValue(this.state.style, 'strokeColor', '#000000');
		c.setFillColor(strokeColor);
		c.setStrokeColor('none');
		stencil.drawShape(c, this, 0, 0, size, size);
	}

};

mxCellRenderer.registerShape(mxShapeAws4Group.prototype.cst.GROUP, mxShapeAws4Group);

//**********************************************************************************************************************************************************
//Group Center
//**********************************************************************************************************************************************************
/**
* Extends mxShape.
*/
function mxShapeAws4GroupCenter(bounds, fill, stroke, strokewidth)
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
mxUtils.extend(mxShapeAws4GroupCenter, mxShape);

mxShapeAws4GroupCenter.prototype.cst = {
		GROUP_CENTER : 'mxgraph.aws4.groupCenter'
};

/**
* Function: paintVertexShape
* 
* Paints the vertex shape.
*/
mxShapeAws4GroupCenter.prototype.paintVertexShape = function(c, x, y, w, h)
{
	c.translate(x, y);
	var grStroke = mxUtils.getValue(this.state.style, 'grStroke', '1');

	var size = 25;

	c.begin();
	c.moveTo(0, 0);
	c.lineTo(w, 0);
	c.lineTo(w, h);
	c.lineTo(0, h);
	c.close();
	
	if (grStroke == '1')
	{
		c.fillAndStroke();
	}
	else
	{
		c.fill();
	}
	
	c.setShadow(false);
	var grIcon = mxUtils.getValue(this.state.style, 'grIcon', '');
	var stencil = mxStencilRegistry.getStencil(grIcon);

	if (stencil != null)
	{
		var strokeColor = mxUtils.getValue(this.state.style, 'strokeColor', '#000000');
		c.setFillColor(strokeColor);
		c.setStrokeColor('none');
		stencil.drawShape(c, this, (w - size) * 0.5, 0, size, size);
	}

};

mxCellRenderer.registerShape(mxShapeAws4GroupCenter.prototype.cst.GROUP_CENTER, mxShapeAws4GroupCenter);

