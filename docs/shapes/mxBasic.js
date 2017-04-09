/**
 * $Id: mxBasic.js,v 1.5 2016/04/1 12:32:06 mate Exp $
 * Copyright (c) 2006-2016, JGraph Ltd
 */

//**********************************************************************************************************************************************************
//Cross
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

mxShapeBasicCross.prototype.cst = {
		CROSS : 'mxgraph.basic.cross2'
};

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

}

//**********************************************************************************************************************************************************
//Rectangular Callout
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

mxShapeBasicRectCallout.prototype.cst = {
		RECT_CALLOUT : 'mxgraph.basic.rectCallout'
};

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
	var dh = 20;

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
				this.state.style['dy'] = Math.round(100 * Math.max(0, Math.min(bounds.height, bounds.y + bounds.height - pt.y))) / 100;
			})];
			
	return handles;

}

//**********************************************************************************************************************************************************
//Rounded Rectangular Callout
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

mxShapeBasicRoundRectCallout.prototype.cst = {
		ROUND_RECT_CALLOUT : 'mxgraph.basic.roundRectCallout'
};

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
	var handles = [Graph.createHandle(state, ['dx', 'dy'], function(bounds)
			{
				var dx = Math.max(0, Math.min(bounds.width, parseFloat(mxUtils.getValue(this.state.style, 'dx', this.dx))));
				var dy = Math.max(0, Math.min(bounds.height, parseFloat(mxUtils.getValue(this.state.style, 'dy', this.dy))));

				return new mxPoint(bounds.x + dx, bounds.y + bounds.height - dy);
			}, function(bounds, pt)
			{
				var y = parseFloat(mxUtils.getValue(this.state.style, 'dy', this.dy)) * 0.6;
				this.state.style['dx'] = Math.round(100 * Math.max(y, Math.min(bounds.width - y, pt.x - bounds.x))) / 100;
				this.state.style['dy'] = Math.round(100 * Math.max(0, Math.min(bounds.height, bounds.y + bounds.height - pt.y))) / 100;
			})];

	var handle2 = Graph.createHandle(state, ['size'], function(bounds)
			{
				var size = Math.max(0, Math.min(bounds.width, parseFloat(mxUtils.getValue(this.state.style, 'size', this.size))));

				return new mxPoint(bounds.x + bounds.width - size, bounds.y + 10);
			}, function(bounds, pt)
			{
				var dy = parseFloat(mxUtils.getValue(this.state.style, 'dy', this.dy));
				this.state.style['size'] = Math.round(100 * Math.max(0, Math.min(bounds.width / 2, (bounds.height - dy) / 2, bounds.x + bounds.width - pt.x))) / 100;
			});
	
	handles.push(handle2);

	return handles;

}

//**********************************************************************************************************************************************************
//Wave
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

mxShapeBasicWave.prototype.cst = {
		WAVE : 'mxgraph.basic.wave2'
};

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

}

