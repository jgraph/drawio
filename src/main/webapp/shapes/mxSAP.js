/**
 * Copyright (c) 2006-2016, JGraph Holdings Ltd
 */

//**********************************************************************************************************************************************************
//Icon
//**********************************************************************************************************************************************************
/**
* Extends mxShape.
*/
function mxSAPIconShape(bounds, fill, stroke, strokewidth)
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
mxUtils.extend(mxSAPIconShape, mxShape);

mxSAPIconShape.prototype.cst = {
		ICON : 'mxgraph.sap.icon'
};

/**
* Function: paintVertexShape
* 
* Paints the vertex shape.
*/
mxSAPIconShape.prototype.paintVertexShape = function(c, x, y, w, h)
{
	c.translate(x, y);
	this.background(c, 0, 0, w, h);
	c.setShadow(false);
	this.foreground(c, 0, 0, w, h);
};

mxSAPIconShape.prototype.background = function(c, x, y, w, h)
{
	c.ellipse(0, 0, w, h);
	c.fillAndStroke();
};

mxSAPIconShape.prototype.foreground = function(c, x, y, w, h)
{
	var sapIcon = mxUtils.getValue(this.style, 'SAPIcon', '');

	c.image(w * 0.2, h * 0.2, w * 0.6, h * 0.6, GRAPH_IMAGE_PATH + '/lib/sap/' + sapIcon + '.svg');	
};

mxCellRenderer.registerShape(mxSAPIconShape.prototype.cst.ICON, mxSAPIconShape);

mxSAPIconShape.prototype.getConstraints = function(style, w, h)
{
	// the background is a circle: four axis points plus four points on the circle at 45 degrees
	var constr = [];

	constr.push(new mxConnectionConstraint(new mxPoint(0.5, 0), false));
	constr.push(new mxConnectionConstraint(new mxPoint(1, 0.5), false));
	constr.push(new mxConnectionConstraint(new mxPoint(0.5, 1), false));
	constr.push(new mxConnectionConstraint(new mxPoint(0, 0.5), false));
	constr.push(new mxConnectionConstraint(new mxPoint(0.146, 0.146), false));
	constr.push(new mxConnectionConstraint(new mxPoint(0.854, 0.146), false));
	constr.push(new mxConnectionConstraint(new mxPoint(0.854, 0.854), false));
	constr.push(new mxConnectionConstraint(new mxPoint(0.146, 0.854), false));

	return (constr);
};

