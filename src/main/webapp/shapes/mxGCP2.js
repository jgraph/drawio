/**
 * $Id: mxGCP2.js,v 1.0 2018/08/21 13:05:39 mate Exp $
 * Copyright (c) 2006-2018, JGraph Ltd
 */

//**********************************************************************************************************************************************************
//double rect
//**********************************************************************************************************************************************************
/**
* Extends mxShape.
*/
function mxShapeGCP2DoubleRect(bounds, fill, stroke, strokewidth)
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
mxUtils.extend(mxShapeGCP2DoubleRect, mxShape);

mxShapeGCP2DoubleRect.prototype.cst = {
		SHAPE_DOUBLE_RECT : 'mxgraph.gcp2.doubleRect'
};

/**
* Function: paintVertexShape
* 
* Paints the vertex shape.
*/
mxShapeGCP2DoubleRect.prototype.paintVertexShape = function(c, x, y, w, h)
{
	var dx = 8;
	var dy = 8;
	
	w = w - dx;
	h = h - dy;
	
	c.translate(x, y);
	c.begin();
	c.roundrect(dx, dy, w , h, 1, 1);
	c.fillAndStroke();
	c.roundrect(0, 0, w, h, 1, 1);
	c.fillAndStroke();
};

mxCellRenderer.registerShape(mxShapeGCP2DoubleRect.prototype.cst.SHAPE_DOUBLE_RECT, mxShapeGCP2DoubleRect);
mxShapeGCP2DoubleRect.prototype.constraints = mxRectangleShape.prototype.constraints;
