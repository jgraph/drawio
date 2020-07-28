/**
 * $Id: mxC4.js,v 1.5 2018/26/11 12:32:06 mate Exp $
 * Copyright (c) 2006-2018, JGraph Ltd
 */
//**********************************************************************************************************************************************************
// Person
//**********************************************************************************************************************************************************
/**
* Extends mxShape.
*/
function mxShapeC4Person(bounds, fill, stroke, strokewidth)
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
mxUtils.extend(mxShapeC4Person, mxShape);

mxShapeC4Person.prototype.cst = {START : 'mxgraph.c4.person'};

/**
* Function: paintVertexShape
* 
* Paints the vertex shape.
*/
mxShapeC4Person.prototype.paintVertexShape = function(c, x, y, w, h)
{
	c.translate(x, y);
	var headSize = Math.min(w / 2, h / 3);
	var r = headSize / 2;
	
	c.ellipse(w * 0.5 - headSize * 0.5, 0, headSize, headSize);
	c.fillAndStroke();
	
	c.begin();
	c.moveTo(0, headSize * 0.8 + r);
	c.arcTo(r, r, 0, 0, 1, r, headSize * 0.8);
	c.lineTo(w - r, headSize * 0.8);
	c.arcTo(r, r, 0, 0, 1, w, headSize * 0.8 + r);
	c.lineTo(w, h - r);
	c.arcTo(r, r, 0, 0, 1, w - r, h);
	c.lineTo(r, h);
	c.arcTo(r, r, 0, 0, 1, 0, h -r);
	c.close();
	c.fillAndStroke();

	c.setShadow(false);
	
	c.ellipse(w * 0.5 - headSize * 0.5, 0, headSize, headSize);
	c.fillAndStroke();

};

mxShapeC4Person.prototype.getLabelMargins = function(rect)
{
	var headSize = Math.min(rect.width / 2, rect.height / 3);
		
	return new mxRectangle(0, headSize * 0.8, 0, 0);
};

mxCellRenderer.registerShape(mxShapeC4Person.prototype.cst.START, mxShapeC4Person);
