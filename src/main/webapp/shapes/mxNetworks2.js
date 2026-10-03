/**
 * Copyright (c) 2006-2025, JGraph Holdings Ltd
 */

//**********************************************************************************************************************************************************
//Icon with background and long shadow
//**********************************************************************************************************************************************************
/**
* Extends mxShape.
*/
function mxShapeNetworks2Icon(bounds, fill, stroke, strokewidth)
{
	mxShape.call(this);
	this.bounds = bounds;
	this.fill = fill;
	this.stroke = stroke;
	this.strokewidth = (strokewidth != null) ? strokewidth : 1;
	this.prevNetwork2BgColor = "9DA6A8";
};

/**
* Extends mxShape.
*/
mxUtils.extend(mxShapeNetworks2Icon, mxShape);

mxShapeNetworks2Icon.prototype.customProperties = [
	{name: 'network2IconShadow', dispName: 'Long Shadow', type: 'bool', defVal: true, primary: true}, 
	{name: 'network2bgFillColor', dispName: 'Background Color', type: 'color', defVal: "#9DA6A8", primary: true}, 
];

mxShapeNetworks2Icon.prototype.cst = {
		SHAPE_ICON : 'mxgraph.networks2.icon'
};

/**
* Function: paintVertexShape
* 
* Paints the vertex shape.
*/
mxShapeNetworks2Icon.prototype.paintVertexShape = function(c, x, y, w, h)
{
	var isShadow = mxUtils.getValue(this.style, 'network2IconShadow', false);
	var bgColor = mxUtils.getColorValue(this.style, 'network2bgFillColor', 'none');
	c.translate(x, y);

	if (bgColor != 'none')
	{
		this.background(c, 0, 0, w, h);
	}

	c.setShadow(false);

	if (isShadow && bgColor != 'none')
	{
		this.longShadow(c, 0, 0, w, h);
	}

	if (bgColor != 'none')
	{
		c.translate(w / 7, h / 7);
		this.foreground(c, 0, 0, w / 1.4, h / 1.4);
		c.translate(-w / 7, -h / 7);
		}
	else
	{
		this.foreground(c, 0, 0, w, h);
	}

	this.prevNetwork2BgColor = bgColor;
};

mxShapeNetworks2Icon.prototype.background = function(c, x, y, w, h)
{
	var gradientColor = mxUtils.getColorValue(this.style, 'gradientColor', 'none');
	var gradientDir = mxUtils.getValue(this.style, 'gradientDirection', 'south');
	var fillColor = mxUtils.getColorValue(this.style, 'fillColor', '#ffffff');
	var fillColor = mxUtils.getColorValue(this.style, 'fillColor', '#ffffff');
	var bgColor = mxUtils.getColorValue(this.style, 'network2bgFillColor', 'none');

	if (gradientColor == 'none')
	{
		c.setFillColor(bgColor);
	}
	else
	{
		c.setGradient(bgColor, gradientColor, 0, 0, w, h, gradientDir);
	}

	c.roundrect(x, y, w, h, w * 0.03571, h * 0.03571);
	c.fill();

	c.setFillColor(fillColor);

};

mxShapeNetworks2Icon.prototype.foreground = function(c, x, y, w, h)
{
	var stencilName = mxUtils.getValue(this.style, 'network2Icon', null);
	var stencil = null;

	if (stencilName != null)
	{
		stencil = mxStencilRegistry.getStencil(stencilName);
	}

	var bgColor = mxUtils.getColorValue(this.style, 'network2bgFillColor', 'none');

	if (bgColor != 'none')
	{
		var stencilW = mxUtils.getValue(this.style, 'network2IconW', 1);
		var stencilH = mxUtils.getValue(this.style, 'network2IconH', 1);
		var xOff = mxUtils.getValue(this.style, 'network2IconXOffset', 0);
		var yOff = mxUtils.getValue(this.style, 'network2IconYOffset', 0);

		if (stencil != null)
		{
			stencil.drawShape(c, this, x + w * 0.5 * (1 - stencilW) + xOff * w, y + h * 0.5 * (1 - stencilH) + yOff * h, w * stencilW, h * stencilH);
		}
	}
	else if (stencil != null)
	{
		stencil.drawShape(c, this, x, y, w, h);
	}
};

mxShapeNetworks2Icon.prototype.longShadow = function(c, x, y, w, h)
{
	var stencilName = mxUtils.getValue(this.style, 'network2Icon', null) + "_shadow";
	var stencil = null;
	c.setFillColor('#000000');
	c.setStrokeColor('none');

	if (stencilName != null)
	{
		stencil = mxStencilRegistry.getStencil(stencilName);
	}
		
	if (stencil != null)
	{
		stencil.drawShape(c, this, x, y, w, h);
	}
};

/**
* Function: getConstraints
*
* Returns the fixed connection points. Without a background plate the glyph
* stencil fills the whole cell, so the glyph's own constraints (curated per
* icon in networks2.xml) apply 1:1. With a plate the eight points sit on the
* rounded plate: side midpoints plus the four corners, pulled onto the
* corner arc (radius 0.03571 of the side, 45-degree point = r * (1 - 1/sqrt(2))).
*/
mxShapeNetworks2Icon.prototype.getConstraints = function(style, w, h)
{
	var bgColor = mxUtils.getColorValue(style, 'network2bgFillColor', 'none');

	if (bgColor != 'none')
	{
		var d = 0.03571 * 0.2929;

		return [new mxConnectionConstraint(new mxPoint(0.5, 0), false, 'N'),
			new mxConnectionConstraint(new mxPoint(0.5, 1), false, 'S'),
			new mxConnectionConstraint(new mxPoint(0, 0.5), false, 'W'),
			new mxConnectionConstraint(new mxPoint(1, 0.5), false, 'E'),
			new mxConnectionConstraint(new mxPoint(1 - d, d), false, 'NE'),
			new mxConnectionConstraint(new mxPoint(1 - d, 1 - d), false, 'SE'),
			new mxConnectionConstraint(new mxPoint(d, 1 - d), false, 'SW'),
			new mxConnectionConstraint(new mxPoint(d, d), false, 'NW')];
	}

	var stencilName = mxUtils.getValue(style, 'network2Icon', null);
	var stencil = (stencilName != null) ? mxStencilRegistry.getStencil(stencilName) : null;

	return (stencil != null) ? stencil.constraints : null;
};

mxShapeNetworks2Icon.prototype.styleChanged = function(key, value, state)
{
	if (key == 'network2bgFillColor' && state.style[key] != value && value == 'none')
	{
		var graph = state.view.graph;
		var geometry = graph.getCellGeometry(state.cell);

		var stencilW = mxUtils.getValue(this.style, 'network2IconW', 1);
		var stencilH = mxUtils.getValue(this.style, 'network2IconH', 1);

		if (geometry != null)
		{
			geometry = geometry.clone();
			var w = geometry.width;
			var h = geometry.height;
			
			geometry.width = geometry.width * stencilW / 1.4;
			geometry.height = geometry.height * stencilH / 1.4;
			geometry.x = geometry.x + (w - geometry.width) * 0.5;
			geometry.y = geometry.y + (h - geometry.height) * 0.5;
			graph.model.setGeometry(state.cell, geometry);
		}
	}
	else if (key == 'network2bgFillColor' && state.style[key] != value && value != 'none' && this.prevNetwork2BgColor == 'none')
	{
		var graph = state.view.graph;
		var geometry = graph.getCellGeometry(state.cell);

		var stencilW = mxUtils.getValue(this.style, 'network2IconW', 1);
		var stencilH = mxUtils.getValue(this.style, 'network2IconH', 1);

		if (geometry != null)
		{
			geometry = geometry.clone();
			var w = geometry.width;
			var h = geometry.height;
			
			geometry.width = geometry.width * 1.4 / stencilW;
			geometry.height = geometry.height * 1.4 / stencilH;
			geometry.x = geometry.x + (w - geometry.width) * 0.5;
			geometry.y = geometry.y + (h - geometry.height) * 0.5;
			graph.model.setGeometry(state.cell, geometry);
		}
	}
}
mxCellRenderer.registerShape(mxShapeNetworks2Icon.prototype.cst.SHAPE_ICON, mxShapeNetworks2Icon);
