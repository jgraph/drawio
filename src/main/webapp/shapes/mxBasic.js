/**
 * $Id: mxBasic.js,v 1.5 2016/04/1 12:32:06 mate Exp $
 * Copyright (c) 2006-2018, JGraph Ltd
 */
//**********************************************************************************************************************************************************
// Cross
//**********************************************************************************************************************************************************
/**
* Extends mxShape.
*/
function mxShapeBasicCross(bounds, fill, stroke, strokewidth)
{
	mxShape.call(this);
	this.bounds = bounds;
	this.fill = fill;
	this.stroke = stroke;
	this.strokewidth = (strokewidth != null) ? strokewidth : 1;
	this.dx = 0.5;
};

/**
* Extends mxShape.
*/
mxUtils.extend(mxShapeBasicCross, mxActor);

mxShapeBasicCross.prototype.cst = {CROSS : 'mxgraph.basic.cross2'};

/**
* Function: paintVertexShape
* 
* Paints the vertex shape.
*/
mxShapeBasicCross.prototype.paintVertexShape = function(c, x, y, w, h)
{
	c.translate(x, y);

	var dx = Math.max(0, Math.min(w, parseFloat(mxUtils.getValue(this.style, 'dx', this.dx))));

	c.begin();
	c.moveTo(w * 0.5 + dx, 0);
	c.lineTo(w * 0.5 + dx, h * 0.5 - dx);
	c.lineTo(w, h * 0.5 - dx);
	c.lineTo(w, h * 0.5 + dx);
	c.lineTo(w * 0.5 + dx, h * 0.5 + dx);
	c.lineTo(w * 0.5 + dx, h);
	c.lineTo(w * 0.5 - dx, h);
	c.lineTo(w * 0.5 - dx, h * 0.5 + dx);
	c.lineTo(0, h * 0.5 + dx);
	c.lineTo(0, h * 0.5 - dx);
	c.lineTo(w * 0.5 - dx, h * 0.5 - dx);
	c.lineTo(w * 0.5 - dx, 0);
	c.close();
	c.fillAndStroke();
};

mxCellRenderer.registerShape(mxShapeBasicCross.prototype.cst.CROSS, mxShapeBasicCross);

mxShapeBasicCross.prototype.constraints = null;

Graph.handleFactory[mxShapeBasicCross.prototype.cst.CROSS] = function(state)
{
	var handles = [Graph.createHandle(state, ['dx'], function(bounds)
	{
		var dx = Math.max(0, Math.min(bounds.width / 2, bounds.width / 2, parseFloat(mxUtils.getValue(this.state.style, 'dx', this.dx))));

		return new mxPoint(bounds.x + bounds.width / 2 + dx, bounds.y + bounds.height / 2 - dx);
	}, function(bounds, pt)
	{
		this.state.style['dx'] = Math.round(100 * Math.max(0, Math.min(bounds.height / 2, bounds.width / 2, pt.x - bounds.x - bounds.width / 2))) / 100;
	})];
			
	return handles;
};

//**********************************************************************************************************************************************************
// Rectangular Callout
//**********************************************************************************************************************************************************
/**
* Extends mxShape.
*/
function mxShapeBasicRectCallout(bounds, fill, stroke, strokewidth)
{
	mxShape.call(this);
	this.bounds = bounds;
	this.fill = fill;
	this.stroke = stroke;
	this.strokewidth = (strokewidth != null) ? strokewidth : 1;
	this.dy = 0.5;
	this.dx = 0.5;
};

/**
* Extends mxShape.
*/
mxUtils.extend(mxShapeBasicRectCallout, mxActor);

mxShapeBasicRectCallout.prototype.cst = {RECT_CALLOUT : 'mxgraph.basic.rectCallout'};

/**
* Function: paintVertexShape
* 
* Paints the vertex shape.
*/
mxShapeBasicRectCallout.prototype.paintVertexShape = function(c, x, y, w, h)
{
	c.translate(x, y);

	var dx = Math.max(0, Math.min(w, parseFloat(mxUtils.getValue(this.style, 'dx', this.dx))));
	var dy = Math.max(0, Math.min(h, parseFloat(mxUtils.getValue(this.style, 'dy', this.dy))));

	c.begin();
	c.moveTo(dx - dy * 0.5, h - dy);
	c.lineTo(0, h - dy);
	c.lineTo(0, 0);
	c.lineTo(w, 0);
	c.lineTo(w, h - dy);
	c.lineTo(dx + dy * 0.5, h - dy);
	c.lineTo(dx - dy, h);
	c.close();
	c.fillAndStroke();
};

mxShapeBasicRectCallout.prototype.getLabelMargins = function()
{
	if (mxUtils.getValue(this.style, 'boundedLbl', false))
	{
		return new mxRectangle(0, 0, 0, parseFloat(mxUtils.getValue(this.style, 'dy', this.dy)) * this.scale);
	}
	
	return null;
};

mxCellRenderer.registerShape(mxShapeBasicRectCallout.prototype.cst.RECT_CALLOUT, mxShapeBasicRectCallout);

mxShapeBasicRectCallout.prototype.constraints = null;

Graph.handleFactory[mxShapeBasicRectCallout.prototype.cst.RECT_CALLOUT] = function(state)
{
	var handles = [Graph.createHandle(state, ['dx', 'dy'], function(bounds)
	{
		var dx = Math.max(0, Math.min(bounds.width, parseFloat(mxUtils.getValue(this.state.style, 'dx', this.dx))));
		var dy = Math.max(0, Math.min(bounds.height, parseFloat(mxUtils.getValue(this.state.style, 'dy', this.dy))));

		return new mxPoint(bounds.x + dx, bounds.y + bounds.height - dy);
	}, function(bounds, pt)
	{
		var y = parseFloat(mxUtils.getValue(this.state.style, 'dy', this.dy)) * 0.6;
		this.state.style['dx'] = Math.round(100 * Math.max(y, Math.min(bounds.width - y, pt.x - bounds.x))) / 100;
		this.state.style['dy'] = Math.round(Math.max(0, Math.min(bounds.height, bounds.y + bounds.height - pt.y)));
	})];
			
	return handles;
};

//**********************************************************************************************************************************************************
// Rounded Rectangular Callout
//**********************************************************************************************************************************************************
/**
* Extends mxShape.
*/
function mxShapeBasicRoundRectCallout(bounds, fill, stroke, strokewidth)
{
	mxShape.call(this);
	this.bounds = bounds;
	this.fill = fill;
	this.stroke = stroke;
	this.strokewidth = (strokewidth != null) ? strokewidth : 1;
	this.dy = 0.5;
	this.dx = 0.5;
	this.size = 10;
};

/**
* Extends mxShape.
*/
mxUtils.extend(mxShapeBasicRoundRectCallout, mxActor);

mxShapeBasicRoundRectCallout.prototype.cst = {ROUND_RECT_CALLOUT : 'mxgraph.basic.roundRectCallout'};

mxShapeBasicRoundRectCallout.prototype.getLabelMargins = mxShapeBasicRectCallout.prototype.getLabelMargins;

/**
* Function: paintVertexShape
* 
* Paints the vertex shape.
*/
mxShapeBasicRoundRectCallout.prototype.paintVertexShape = function(c, x, y, w, h)
{
	c.translate(x, y);

	var dx = Math.max(0, Math.min(w, parseFloat(mxUtils.getValue(this.style, 'dx', this.dx))));
	var dy = Math.max(0, Math.min(h, parseFloat(mxUtils.getValue(this.style, 'dy', this.dy))));
	var r = Math.max(0, Math.min(h, parseFloat(mxUtils.getValue(this.style, 'size', this.size))));

	r = Math.min((h - dy) / 2, w / 2, r);
	dx = Math.max(r + dy * 0.5, dx);
	dx = Math.min(w - r - dy * 0.5, dx);
	
	c.begin();
	c.moveTo(dx - dy * 0.5, h - dy);
	c.lineTo(r, h - dy);
	c.arcTo(r, r, 0, 0, 1, 0, h - dy - r);
	c.lineTo(0, r);
	c.arcTo(r, r, 0, 0, 1, r, 0);
	c.lineTo(w - r, 0);
	c.arcTo(r, r, 0, 0, 1, w, r);
	c.lineTo(w, h - dy - r);
	c.arcTo(r, r, 0, 0, 1, w - r, h - dy);
	c.lineTo(dx + dy * 0.5, h - dy);
	c.arcTo(1.9 * dy, 1.4 * dy, 0, 0, 1, dx - dy, h);
	c.arcTo(0.9 * dy, 1.4 * dy, 0, 0, 0, dx - dy * 0.5, h - dy);
	c.close();
	c.fillAndStroke();
};

mxCellRenderer.registerShape(mxShapeBasicRoundRectCallout.prototype.cst.ROUND_RECT_CALLOUT, mxShapeBasicRoundRectCallout);

mxShapeBasicRoundRectCallout.prototype.constraints = null;

Graph.handleFactory[mxShapeBasicRoundRectCallout.prototype.cst.ROUND_RECT_CALLOUT] = function(state)
{
	return [Graph.createHandle(state, ['dx', 'dy'], function(bounds)
	{
		var dx = Math.max(0, Math.min(bounds.width, parseFloat(mxUtils.getValue(this.state.style, 'dx', this.dx))));
		var dy = Math.max(0, Math.min(bounds.height, parseFloat(mxUtils.getValue(this.state.style, 'dy', this.dy))));

		return new mxPoint(bounds.x + dx, bounds.y + bounds.height - dy);
	}, function(bounds, pt)
	{
		var y = parseFloat(mxUtils.getValue(this.state.style, 'dy', this.dy)) * 0.6;
		this.state.style['dx'] = Math.round(100 * Math.max(y, Math.min(bounds.width - y, pt.x - bounds.x))) / 100;
		this.state.style['dy'] = Math.round(Math.max(0, Math.min(bounds.height, bounds.y + bounds.height - pt.y)));
	}), Graph.createHandle(state, ['size'], function(bounds)
	{
		var size = Math.max(0, Math.min(bounds.width, parseFloat(mxUtils.getValue(this.state.style, 'size', this.size))));

		return new mxPoint(bounds.x + bounds.width - size, bounds.y + 10);
	}, function(bounds, pt)
	{
		var dy = parseFloat(mxUtils.getValue(this.state.style, 'dy', this.dy));
		this.state.style['size'] = Math.round(100 * Math.max(0, Math.min(bounds.width / 2, (bounds.height - dy) / 2, bounds.x + bounds.width - pt.x))) / 100;
	})];
};

//**********************************************************************************************************************************************************
// Wave
//**********************************************************************************************************************************************************
/**
* Extends mxShape.
*/
function mxShapeBasicWave(bounds, fill, stroke, strokewidth)
{
	mxShape.call(this);
	this.bounds = bounds;
	this.fill = fill;
	this.stroke = stroke;
	this.strokewidth = (strokewidth != null) ? strokewidth : 1;
	this.dy = 0.5;
};

/**
* Extends mxShape.
*/
mxUtils.extend(mxShapeBasicWave, mxActor);

mxShapeBasicWave.prototype.cst = {WAVE : 'mxgraph.basic.wave2'};

/**
* Function: paintVertexShape
* 
* Paints the vertex shape.
*/
mxShapeBasicWave.prototype.paintVertexShape = function(c, x, y, w, h)
{
	c.translate(x, y);

	var dy = h * Math.max(0, Math.min(h, parseFloat(mxUtils.getValue(this.style, 'dy', this.dy))));
	var fy = 1.4
	
	c.begin();
	c.moveTo(0, dy / 2);
	c.quadTo(w / 6, dy * (1 - fy), w / 3, dy / 2);
	c.quadTo(w / 2, dy * fy, w * 2 / 3, dy / 2);
	c.quadTo(w * 5 / 6, dy * (1 - fy), w, dy / 2);
	c.lineTo(w, h - dy / 2);
	c.quadTo(w * 5 / 6, h - dy * fy, w * 2 / 3, h - dy / 2);
	c.quadTo(w / 2, h - dy * (1 - fy), w / 3, h - dy / 2);
	c.quadTo(w / 6, h - dy * fy, 0, h - dy / 2);
	c.close();
	c.fillAndStroke();
};

mxCellRenderer.registerShape(mxShapeBasicWave.prototype.cst.WAVE, mxShapeBasicWave);

mxShapeBasicWave.prototype.constraints = null;

Graph.handleFactory[mxShapeBasicWave.prototype.cst.WAVE] = function(state)
{
	var handles = [Graph.createHandle(state, ['dy'], function(bounds)
	{
		var dy = Math.max(0, Math.min(1, parseFloat(mxUtils.getValue(this.state.style, 'dy', this.dy))));

		return new mxPoint(bounds.x + bounds.width / 2, bounds.y + dy * bounds.height);
	}, function(bounds, pt)
	{
		this.state.style['dy'] = Math.round(100 * Math.max(0, Math.min(1, (pt.y - bounds.y) / bounds.height))) / 100;
	})];

	return handles;
};

//**********************************************************************************************************************************************************
//Octagon
//**********************************************************************************************************************************************************
/**
* Extends mxShape.
*/
function mxShapeBasicOctagon(bounds, fill, stroke, strokewidth)
{
	mxShape.call(this);
	this.bounds = bounds;
	this.fill = fill;
	this.stroke = stroke;
	this.strokewidth = (strokewidth != null) ? strokewidth : 1;
	this.dx = 0.5;
};

/**
* Extends mxShape.
*/
mxUtils.extend(mxShapeBasicOctagon, mxActor);

mxShapeBasicOctagon.prototype.cst = {OCTAGON : 'mxgraph.basic.octagon2'};

/**
* Function: paintVertexShape
* 
* Paints the vertex shape.
*/
mxShapeBasicOctagon.prototype.paintVertexShape = function(c, x, y, w, h)
{
	c.translate(x, y);

	var dx = Math.max(0, Math.min(w, parseFloat(mxUtils.getValue(this.style, 'dx', this.dx)))) * 2;

	dx = Math.min(w * 0.5, h * 0.5, dx);
	
	c.begin();
	c.moveTo(dx, 0);
	c.lineTo(w - dx, 0);
	c.lineTo(w, dx);
	c.lineTo(w, h - dx);
	c.lineTo(w - dx, h);
	c.lineTo(dx, h);
	c.lineTo(0, h - dx);
	c.lineTo(0, dx);
	c.close();
	c.fillAndStroke();
};

mxCellRenderer.registerShape(mxShapeBasicOctagon.prototype.cst.OCTAGON, mxShapeBasicOctagon);

mxShapeBasicOctagon.prototype.constraints = null;

Graph.handleFactory[mxShapeBasicOctagon.prototype.cst.OCTAGON] = function(state)
{
	var handles = [Graph.createHandle(state, ['dx'], function(bounds)
	{
		var dx = Math.max(0, Math.min(bounds.width / 4, bounds.width / 4, parseFloat(mxUtils.getValue(this.state.style, 'dx', this.dx))));

		return new mxPoint(bounds.x + dx, bounds.y + dx);
	}, function(bounds, pt)
	{
		this.state.style['dx'] = Math.round(100 * Math.max(0, Math.min(bounds.height / 4, bounds.width / 4, pt.x - bounds.x))) / 100;
	})];
			
	return handles;
};

//**********************************************************************************************************************************************************
//Isometric Cube
//**********************************************************************************************************************************************************
/**
* Extends mxShape.
*/
function mxShapeBasicIsoCube(bounds, fill, stroke, strokewidth)
{
	mxShape.call(this);
	this.bounds = bounds;
	this.fill = fill;
	this.stroke = stroke;
	this.strokewidth = (strokewidth != null) ? strokewidth : 1;
	this.isoAngle = 15;
};

/**
* Extends mxShape.
*/
mxUtils.extend(mxShapeBasicIsoCube, mxActor);

mxShapeBasicIsoCube.prototype.cst = {ISO_CUBE : 'mxgraph.basic.isocube'};

/**
* Function: paintVertexShape
* 
* Paints the vertex shape.
*/
mxShapeBasicIsoCube.prototype.paintVertexShape = function(c, x, y, w, h)
{
	c.translate(x, y);

	var isoAngle = Math.max(0.01, Math.min(94, parseFloat(mxUtils.getValue(this.style, 'isoAngle', this.isoAngle)))) * Math.PI / 200 ;
	var isoH = Math.min(w * Math.tan(isoAngle), h * 0.5);
	
	c.begin();
	c.moveTo(w * 0.5, 0);
	c.lineTo(w, isoH);
	c.lineTo(w, h - isoH);
	c.lineTo(w * 0.5, h);
	c.lineTo(0, h - isoH);
	c.lineTo(0, isoH);
	c.close();
	c.fillAndStroke();

	c.setShadow(false);
	
	c.begin();
	c.moveTo(0, isoH);
	c.lineTo(w * 0.5, 2 * isoH);
	c.lineTo(w, isoH);
	c.moveTo(w * 0.5, 2 * isoH);
	c.lineTo(w * 0.5, h);
	c.stroke();
};

mxCellRenderer.registerShape(mxShapeBasicIsoCube.prototype.cst.ISO_CUBE, mxShapeBasicIsoCube);

mxShapeBasicIsoCube.prototype.constraints = null;

Graph.handleFactory[mxShapeBasicIsoCube.prototype.cst.ISO_CUBE] = function(state)
{
	var handles = [Graph.createHandle(state, ['isoAngle'], function(bounds)
	{
		var isoAngle = Math.max(0, Math.min(100, parseFloat(mxUtils.getValue(this.state.style, 'isoAngle', this.isoAngle))));

		return new mxPoint(bounds.x, bounds.y + isoAngle);
	}, function(bounds, pt)
	{
		this.state.style['isoAngle'] = Math.round(100 * Math.max(0, Math.min(100, pt.y - bounds.y))) / 100;
	})];
			
	return handles;
};

//**********************************************************************************************************************************************************
//Acute Triangle
//**********************************************************************************************************************************************************
/**
* Extends mxShape.
*/
function mxShapeBasicTriangleAcute(bounds, fill, stroke, strokewidth)
{
	mxShape.call(this);
	this.bounds = bounds;
	this.fill = fill;
	this.stroke = stroke;
	this.strokewidth = (strokewidth != null) ? strokewidth : 1;
	this.dx = 0.5;
};

/**
* Extends mxShape.
*/
mxUtils.extend(mxShapeBasicTriangleAcute, mxActor);

mxShapeBasicTriangleAcute.prototype.cst = {ACUTE_TRIANGLE : 'mxgraph.basic.acute_triangle'};

/**
* Function: paintVertexShape
* 
* Paints the vertex shape.
*/
mxShapeBasicTriangleAcute.prototype.paintVertexShape = function(c, x, y, w, h)
{
	c.translate(x, y);

	var dx = w * Math.max(0, Math.min(w, parseFloat(mxUtils.getValue(this.style, 'dx', this.dx))));
	
	c.begin();
	c.moveTo(0, h);
	c.lineTo(dx, 0);
	c.lineTo(w, h);
	c.close();
	c.fillAndStroke();
};

mxCellRenderer.registerShape(mxShapeBasicTriangleAcute.prototype.cst.ACUTE_TRIANGLE, mxShapeBasicTriangleAcute);

mxShapeBasicTriangleAcute.prototype.constraints = null;

Graph.handleFactory[mxShapeBasicTriangleAcute.prototype.cst.ACUTE_TRIANGLE] = function(state)
{
	var handles = [Graph.createHandle(state, ['dx'], function(bounds)
	{
		var dx = Math.max(0, Math.min(1, parseFloat(mxUtils.getValue(this.state.style, 'dx', this.dx))));

		return new mxPoint(bounds.x + dx * bounds.width, bounds.y + 10);
	}, function(bounds, pt)
	{
		this.state.style['dx'] = Math.round(100 * Math.max(0, Math.min(1, (pt.x - bounds.x) / bounds.width))) / 100;
	})];

	return handles;
};

//**********************************************************************************************************************************************************
//Obtuse Triangle
//**********************************************************************************************************************************************************
/**
* Extends mxShape.
*/
function mxShapeBasicTriangleObtuse(bounds, fill, stroke, strokewidth)
{
	mxShape.call(this);
	this.bounds = bounds;
	this.fill = fill;
	this.stroke = stroke;
	this.strokewidth = (strokewidth != null) ? strokewidth : 1;
	this.dx = 0.5;
};

/**
* Extends mxShape.
*/
mxUtils.extend(mxShapeBasicTriangleObtuse, mxActor);

mxShapeBasicTriangleObtuse.prototype.cst = {OBTUSE_TRIANGLE : 'mxgraph.basic.obtuse_triangle'};

/**
* Function: paintVertexShape
* 
* Paints the vertex shape.
*/
mxShapeBasicTriangleObtuse.prototype.paintVertexShape = function(c, x, y, w, h)
{
	c.translate(x, y);

	var dx = w * Math.max(0, Math.min(w, parseFloat(mxUtils.getValue(this.style, 'dx', this.dx))));
	
	c.begin();
	c.moveTo(dx, h);
	c.lineTo(0, 0);
	c.lineTo(w, h);
	c.close();
	c.fillAndStroke();
};

mxCellRenderer.registerShape(mxShapeBasicTriangleObtuse.prototype.cst.OBTUSE_TRIANGLE, mxShapeBasicTriangleObtuse);

mxShapeBasicTriangleObtuse.prototype.constraints = null;

Graph.handleFactory[mxShapeBasicTriangleObtuse.prototype.cst.OBTUSE_TRIANGLE] = function(state)
{
	var handles = [Graph.createHandle(state, ['dx'], function(bounds)
	{
		var dx = Math.max(0, Math.min(1, parseFloat(mxUtils.getValue(this.state.style, 'dx', this.dx))));

		return new mxPoint(bounds.x + dx * bounds.width, bounds.y + bounds.height - 10);
	}, function(bounds, pt)
	{
		this.state.style['dx'] = Math.round(100 * Math.max(0, Math.min(1, (pt.x - bounds.x) / bounds.width))) / 100;
	})];

	return handles;
};

//**********************************************************************************************************************************************************
//Drop
//**********************************************************************************************************************************************************
/**
* Extends mxShape.
*/
function mxShapeBasicDrop(bounds, fill, stroke, strokewidth)
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
mxUtils.extend(mxShapeBasicDrop, mxActor);

mxShapeBasicDrop.prototype.cst = {DROP : 'mxgraph.basic.drop'};

/**
* Function: paintVertexShape
* 
* Paints the vertex shape.
*/
mxShapeBasicDrop.prototype.paintVertexShape = function(c, x, y, w, h)
{
	c.translate(x, y);

	var r = Math.min(h, w) * 0.5;
	var d = h - r;
	var a = Math.sqrt(d * d - r * r);
	
	var angle = Math.atan(a / r);
	
	var x1 = r * Math.sin(angle);
	var y1 = r * Math.cos(angle);
	
	c.begin();
	c.moveTo(w * 0.5, 0);
	c.lineTo(w * 0.5 + x1, h - r - y1);
	c.arcTo(r, r, 0, 0, 1, w * 0.5 + r, h - r);
	c.arcTo(r, r, 0, 0, 1, w * 0.5, h);
	c.arcTo(r, r, 0, 0, 1, w * 0.5 - r, h - r);
	c.arcTo(r, r, 0, 0, 1, w * 0.5 - x1, h - r - y1);
	c.close();
	c.fillAndStroke();
};

mxCellRenderer.registerShape(mxShapeBasicDrop.prototype.cst.DROP, mxShapeBasicDrop);

mxShapeBasicDrop.prototype.constraints = null;

//**********************************************************************************************************************************************************
//Cone 2
//**********************************************************************************************************************************************************
/**
* Extends mxShape.
*/
function mxShapeBasicCone2(bounds, fill, stroke, strokewidth)
{
	mxShape.call(this);
	this.bounds = bounds;
	this.fill = fill;
	this.stroke = stroke;
	this.strokewidth = (strokewidth != null) ? strokewidth : 1;
	this.dx = 0.5;
	this.dy = 0.9;
};

/**
* Extends mxShape.
*/
mxUtils.extend(mxShapeBasicCone2, mxActor);

mxShapeBasicCone2.prototype.cst = {CONE2 : 'mxgraph.basic.cone2'};

/**
* Function: paintVertexShape
* 
* Paints the vertex shape.
*/
mxShapeBasicCone2.prototype.paintVertexShape = function(c, x, y, w, h)
{
	c.translate(x, y);

	var dx = w * Math.max(0, Math.min(w, parseFloat(mxUtils.getValue(this.style, 'dx', this.dx))));
	var dy = h * Math.max(0, Math.min(h, parseFloat(mxUtils.getValue(this.style, 'dy', this.dy))));
	
	var ry = h - dy;
	
	c.begin();
	c.moveTo(dx, 0);
	
	if (ry > 0)
	{
		c.lineTo(w, h - ry);
		c.arcTo(w * 0.5, ry, 0, 0, 1, w * 0.5, h);
		c.arcTo(w * 0.5, ry, 0, 0, 1, 0, h - ry);
	}
	else
	{
		c.lineTo(w, h);
		c.lineTo(0, h);
	}
	
	c.close();
	c.fillAndStroke();
};

mxCellRenderer.registerShape(mxShapeBasicCone2.prototype.cst.CONE2, mxShapeBasicCone2);

mxShapeBasicCone2.prototype.constraints = null;

Graph.handleFactory[mxShapeBasicCone2.prototype.cst.CONE2] = function(state)
{
	var handles = [Graph.createHandle(state, ['dx'], function(bounds)
	{
		var dx = Math.max(0, Math.min(1, parseFloat(mxUtils.getValue(this.state.style, 'dx', this.dx))));

		return new mxPoint(bounds.x + dx * bounds.width, bounds.y + 10);
	}, function(bounds, pt)
	{
		this.state.style['dx'] = Math.round(100 * Math.max(0, Math.min(1, (pt.x - bounds.x) / bounds.width))) / 100;
	})];

	var handle2 = Graph.createHandle(state, ['dy'], function(bounds)
	{
		var dy = Math.max(0, Math.min(1, parseFloat(mxUtils.getValue(this.state.style, 'dy', this.dy))));

		return new mxPoint(bounds.x + 10, bounds.y + dy * bounds.height);
	}, function(bounds, pt)
	{
		this.state.style['dy'] = Math.round(100 * Math.max(0, Math.min(1, (pt.y - bounds.y) / bounds.height))) / 100;
	});
	
	handles.push(handle2);
	
	return handles;
};

//**********************************************************************************************************************************************************
//Pyramid
//**********************************************************************************************************************************************************
/**
* Extends mxShape.
*/
function mxShapeBasicPyramid(bounds, fill, stroke, strokewidth)
{
	mxShape.call(this);
	this.bounds = bounds;
	this.fill = fill;
	this.stroke = stroke;
	this.strokewidth = (strokewidth != null) ? strokewidth : 1;
	this.dx1 = 0.5;
	this.dx2 = 0.6;
	this.dy1 = 0.9;
	this.dy2 = 0.8;
};

/**
* Extends mxShape.
*/
mxUtils.extend(mxShapeBasicPyramid, mxActor);

mxShapeBasicPyramid.prototype.cst = {PYRAMID : 'mxgraph.basic.pyramid'};

/**
* Function: paintVertexShape
* 
* Paints the vertex shape.
*/
mxShapeBasicPyramid.prototype.paintVertexShape = function(c, x, y, w, h)
{
	c.translate(x, y);

	var dx1 = w * Math.max(0, Math.min(w, parseFloat(mxUtils.getValue(this.style, 'dx1', this.dx1))));
	var dx2 = w * Math.max(0, Math.min(w, parseFloat(mxUtils.getValue(this.style, 'dx2', this.dx2))));
	var dy1 = h * Math.max(0, Math.min(h, parseFloat(mxUtils.getValue(this.style, 'dy1', this.dy1))));
	var dy2 = h * Math.max(0, Math.min(h, parseFloat(mxUtils.getValue(this.style, 'dy2', this.dy2))));
	
	c.begin();
	c.moveTo(dx1, 0);
	c.lineTo(w, dy2);
	c.lineTo(dx2, h);
	c.lineTo(0, dy1);
	c.close();
	c.fillAndStroke();
	
	c.setShadow(false);
	
	c.begin();
	c.moveTo(dx1, 0);
	c.lineTo(dx2, h);
	c.stroke();
};

mxCellRenderer.registerShape(mxShapeBasicPyramid.prototype.cst.PYRAMID, mxShapeBasicPyramid);

mxShapeBasicPyramid.prototype.constraints = null;

Graph.handleFactory[mxShapeBasicPyramid.prototype.cst.PYRAMID] = function(state)
{
	var handles = [Graph.createHandle(state, ['dx1'], function(bounds)
	{
		var dx1 = Math.max(0, Math.min(1, parseFloat(mxUtils.getValue(this.state.style, 'dx1', this.dx1))));

		return new mxPoint(bounds.x + dx1 * bounds.width, bounds.y + 10);
	}, function(bounds, pt)
	{
		this.state.style['dx1'] = Math.round(100 * Math.max(0, Math.min(1, (pt.x - bounds.x) / bounds.width))) / 100;
	})];

	var handle2 = Graph.createHandle(state, ['dx2'], function(bounds)
	{
		var dx2 = Math.max(0, Math.min(1, parseFloat(mxUtils.getValue(this.state.style, 'dx2', this.dx2))));

		return new mxPoint(bounds.x + dx2 * bounds.width, bounds.y + bounds.height - 10);
	}, function(bounds, pt)
	{
		this.state.style['dx2'] = Math.round(100 * Math.max(0, Math.min(1, (pt.x - bounds.x) / bounds.width))) / 100;
	});
	
	handles.push(handle2);
	
	var handle3 = Graph.createHandle(state, ['dy1'], function(bounds)
	{
		var dy1 = Math.max(0, Math.min(1, parseFloat(mxUtils.getValue(this.state.style, 'dy1', this.dy1))));

		return new mxPoint(bounds.x + 10, bounds.y + dy1 * bounds.height);
	}, function(bounds, pt)
	{
		this.state.style['dy1'] = Math.round(100 * Math.max(0, Math.min(1, (pt.y - bounds.y) / bounds.height))) / 100;
	});
	
	handles.push(handle3);
	
	var handle4 = Graph.createHandle(state, ['dy2'], function(bounds)
	{
		var dy2 = Math.max(0, Math.min(1, parseFloat(mxUtils.getValue(this.state.style, 'dy2', this.dy2))));

		return new mxPoint(bounds.x + bounds.width - 10, bounds.y + dy2 * bounds.height);
	}, function(bounds, pt)
	{
		this.state.style['dy2'] = Math.round(100 * Math.max(0, Math.min(1, (pt.y - bounds.y) / bounds.height))) / 100;
	});
	
	handles.push(handle4);
	
	return handles;
};

//**********************************************************************************************************************************************************
//4 Point Star 2
//**********************************************************************************************************************************************************
/**
* Extends mxShape.
*/
function mxShapeBasic4PointStar2(bounds, fill, stroke, strokewidth)
{
	mxShape.call(this);
	this.bounds = bounds;
	this.fill = fill;
	this.stroke = stroke;
	this.strokewidth = (strokewidth != null) ? strokewidth : 1;
	this.dx = 0.8;
};

/**
* Extends mxShape.
*/
mxUtils.extend(mxShapeBasic4PointStar2, mxActor);

mxShapeBasic4PointStar2.prototype.cst = {FOUR_POINT_STAR_2 : 'mxgraph.basic.4_point_star_2'};

/**
* Function: paintVertexShape
* 
* Paints the vertex shape.
*/
mxShapeBasic4PointStar2.prototype.paintVertexShape = function(c, x, y, w, h)
{
	c.translate(x, y);

	var dx = 0.5 * Math.max(0, Math.min(w, parseFloat(mxUtils.getValue(this.style, 'dx', this.dx))));

	c.begin();
	c.moveTo(0, h * 0.5);
	c.lineTo(dx * w, dx * h);
	c.lineTo(w * 0.5, 0);
	c.lineTo(w - dx * w, dx * h);
	c.lineTo(w, h * 0.5);
	c.lineTo(w - dx * w, h - dx * h);
	c.lineTo(w * 0.5, h);
	c.lineTo(dx * w, h - dx * h);
	c.close();
	c.fillAndStroke();
};

mxCellRenderer.registerShape(mxShapeBasic4PointStar2.prototype.cst.FOUR_POINT_STAR_2, mxShapeBasic4PointStar2);

mxShapeBasic4PointStar2.prototype.constraints = null;

Graph.handleFactory[mxShapeBasic4PointStar2.prototype.cst.FOUR_POINT_STAR_2] = function(state)
{
	var handles = [Graph.createHandle(state, ['dx'], function(bounds)
	{
		var dx = Math.max(0, Math.min(1, parseFloat(mxUtils.getValue(this.state.style, 'dx', this.dx))));

		return new mxPoint(bounds.x + dx * bounds.width / 2, bounds.y + 10);
	}, function(bounds, pt)
	{
		this.state.style['dx'] = Math.round(100 * Math.max(0, Math.min(1, 2 * (pt.x - bounds.x) / bounds.width))) / 100;
	})];

	return handles;
};

