/**
 * $Id: mxIsometric.js,v 1.0 2019/06/30 14:16:32 mate Exp $
 * Copyright (c) 2006-2019, JGraph Ltd
 */

//**********************************************************************************************************************************************************
//Arrow NE
//**********************************************************************************************************************************************************
/**
* Extends mxShape.
*/
function mxShapeIsometricArrowNE(bounds, fill, stroke, strokewidth)
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
mxUtils.extend(mxShapeIsometricArrowNE, mxShape);

mxShapeIsometricArrowNE.prototype.cst = {
		ARROW_NE : 'mxgraph.isometric.arrowNE'
};

/**
* Function: paintVertexShape
* 
* Paints the vertex shape.
*/
mxShapeIsometricArrowNE.prototype.paintVertexShape = function(c, x, y, w, h)
{
	c.translate(x, y);

	c.begin();
	c.moveTo(w - 17, 8);
	c.lineTo(w - 21, 5.5);
	c.lineTo(w, 0);
	c.lineTo(w - 9.7, 12.2);
	c.lineTo(w - 13.9, 9.8);
	c.lineTo(9.7, h - 3.5);
	c.arcTo(6, 3, 0, 0, 1, 9, h - 0.4);
	c.arcTo(5.2, 3, 0, 0, 1, 1, h - 1.4);
	c.arcTo(6, 2.8, 0, 0, 1, 3, h - 5.4);
	c.arcTo(5, 3, 0, 0, 1, 6.7, h - 5.2);
	c.close();
	c.fillAndStroke();
};

mxCellRenderer.registerShape(mxShapeIsometricArrowNE.prototype.cst.ARROW_NE, mxShapeIsometricArrowNE);

//**********************************************************************************************************************************************************
//Arrow SE
//**********************************************************************************************************************************************************
/**
* Extends mxShape.
*/
function mxShapeIsometricArrowSE(bounds, fill, stroke, strokewidth)
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
mxUtils.extend(mxShapeIsometricArrowSE, mxShape);

mxShapeIsometricArrowSE.prototype.cst = {
		ARROW_SE : 'mxgraph.isometric.arrowSE'
};



/**
* Function: paintVertexShape
* 
* Paints the vertex shape.
*/
mxShapeIsometricArrowSE.prototype.paintVertexShape = function(c, x, y, w, h)
{
	c.translate(x, y);

	c.begin();
	c.moveTo(w - 17, h - 8);
	c.lineTo(w - 21, h - 5.5);
	c.lineTo(w, h);
	c.lineTo(w - 9.7, h - 12.2);
	c.lineTo(w - 13.9, h - 9.8);
	c.lineTo(9.7, 3.5);
	c.arcTo(6, 3, 0, 0, 0, 9, 0.4);
	c.arcTo(5.2, 3, 0, 0, 0, 1, 1.4);
	c.arcTo(6, 2.8, 0, 0, 0, 3, 5.4);
	c.arcTo(5, 3, 0, 0, 0, 6.7, 5.2);
	c.close();
	c.fillAndStroke();
};

mxCellRenderer.registerShape(mxShapeIsometricArrowSE.prototype.cst.ARROW_SE, mxShapeIsometricArrowSE);

//**********************************************************************************************************************************************************
//Arrow SW
//**********************************************************************************************************************************************************
/**
* Extends mxShape.
*/
function mxShapeIsometricArrowSW(bounds, fill, stroke, strokewidth)
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
mxUtils.extend(mxShapeIsometricArrowSW, mxShape);

mxShapeIsometricArrowSW.prototype.cst = {
		ARROW_SW : 'mxgraph.isometric.arrowSW'
};

/**
* Function: paintVertexShape
* 
* Paints the vertex shape.
*/
mxShapeIsometricArrowSW.prototype.paintVertexShape = function(c, x, y, w, h)
{
	c.translate(x, y);

	c.begin();
	c.moveTo(17, h - 8);
	c.lineTo(21, h - 5.5);
	c.lineTo(0, h);
	c.lineTo(9.7, h - 12.2);
	c.lineTo(13.9, h - 9.8);
	c.lineTo(w - 9.7, 3.5);
	c.arcTo(6, 3, 0, 0, 1, w - 9, 0.4);
	c.arcTo(5.2, 3, 0, 0, 1, w - 1, 1.4);
	c.arcTo(6, 2.8, 0, 0, 1, w - 3, 5.4);
	c.arcTo(5, 3, 0, 0, 1, w - 6.7, 5.2);
	c.close();
	c.fillAndStroke();
};

mxCellRenderer.registerShape(mxShapeIsometricArrowSW.prototype.cst.ARROW_SW, mxShapeIsometricArrowSW);

//**********************************************************************************************************************************************************
//Arrow NW
//**********************************************************************************************************************************************************
/**
* Extends mxShape.
*/
function mxShapeIsometricArrowNW(bounds, fill, stroke, strokewidth)
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
mxUtils.extend(mxShapeIsometricArrowNW, mxShape);

mxShapeIsometricArrowNW.prototype.cst = {
		ARROW_NW : 'mxgraph.isometric.arrowNW'
};

/**
* Function: paintVertexShape
* 
* Paints the vertex shape.
*/
mxShapeIsometricArrowNW.prototype.paintVertexShape = function(c, x, y, w, h)
{
	c.translate(x, y);

	c.begin();
	c.moveTo(17, 8);
	c.lineTo(21, 5.5);
	c.lineTo(0, 0);
	c.lineTo(9.7, 12.2);
	c.lineTo(13.9, 9.8);
	c.lineTo(w - 9.7, h - 3.5);
	c.arcTo(6, 3, 0, 0, 0, w - 9, h - 0.4);
	c.arcTo(5.2, 3, 0, 0, 0, w - 1, h - 1.4);
	c.arcTo(6, 2.8, 0, 0, 0, w - 3, h - 5.4);
	c.arcTo(5, 3, 0, 0, 0, w - 6.7, h - 5.2);
	c.close();
	c.fillAndStroke();
};

mxCellRenderer.registerShape(mxShapeIsometricArrowNW.prototype.cst.ARROW_NW, mxShapeIsometricArrowNW);

//**********************************************************************************************************************************************************
//Arrowless NE
//**********************************************************************************************************************************************************
/**
* Extends mxShape.
*/
function mxShapeIsometricArrowlessNE(bounds, fill, stroke, strokewidth)
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
mxUtils.extend(mxShapeIsometricArrowlessNE, mxShape);

mxShapeIsometricArrowlessNE.prototype.cst = {
		ARROWLESS_NE : 'mxgraph.isometric.arrowlessNE'
};

/**
* Function: paintVertexShape
* 
* Paints the vertex shape.
*/
mxShapeIsometricArrowlessNE.prototype.paintVertexShape = function(c, x, y, w, h)
{
	c.translate(x, y);

	c.begin();
	c.moveTo(w - 3.1, 0);
	c.lineTo(w, 1.8);
	c.lineTo(9.7, h - 3.5);
	c.arcTo(6, 3, 0, 0, 1, 9, h - 0.4);
	c.arcTo(5.2, 3, 0, 0, 1, 1, h - 1.4);
	c.arcTo(6, 2.8, 0, 0, 1, 3, h - 5.4);
	c.arcTo(5, 3, 0, 0, 1, 6.7, h - 5.2);
	c.close();
	c.fillAndStroke();
};

mxCellRenderer.registerShape(mxShapeIsometricArrowlessNE.prototype.cst.ARROWLESS_NE, mxShapeIsometricArrowlessNE);

//**********************************************************************************************************************************************************
//Dashed edge with double arrow
//**********************************************************************************************************************************************************
/**
* Extends mxShape.
*/
function mxShapeIsometricDashedEdgeDouble(bounds, fill, stroke, strokewidth)
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
mxUtils.extend(mxShapeIsometricDashedEdgeDouble, mxShape);

mxShapeIsometricDashedEdgeDouble.prototype.cst = {
		DASHED_EDGE_DOUBLE : 'mxgraph.isometric.dashedEdgeDouble'
};

/**
* Function: paintVertexShape
* 
* Paints the vertex shape.
*/
mxShapeIsometricDashedEdgeDouble.prototype.paintVertexShape = function(c, x, y, w, h)
{
	c.translate(x, y);
	
	c.setFillColor('#2D6195');
	c.save();
	c.setStrokeColor('none');
	c.begin();
	c.moveTo(21, 5.5);
	c.lineTo(0, 0);
	c.lineTo(9.7, 12.2);
	c.fillAndStroke();
	
	c.begin();
	c.moveTo(w - 21, h - 5.5);
	c.lineTo(w, h);
	c.lineTo(w - 9.7, h - 12.2);
	c.fillAndStroke();
	
	c.restore();
	c.setStrokeColor('#2D6195');
	c.setStrokeWidth('4');
	c.setDashed('true');
	c.setLineCap('round');
	
	c.begin();
	c.moveTo(7.675, 4.425);
	c.lineTo(w - 7.675, h - 4.425);
	c.stroke();
};

mxCellRenderer.registerShape(mxShapeIsometricDashedEdgeDouble.prototype.cst.DASHED_EDGE_DOUBLE, mxShapeIsometricDashedEdgeDouble);

//**********************************************************************************************************************************************************
//Dashed arrowless edge
//**********************************************************************************************************************************************************
/**
* Extends mxShape.
*/
function mxShapeIsometricDashedArrowlessEdge(bounds, fill, stroke, strokewidth)
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
mxUtils.extend(mxShapeIsometricDashedArrowlessEdge, mxShape);

mxShapeIsometricDashedArrowlessEdge.prototype.cst = {
		DASHED_ARROWLESS_EDGE : 'mxgraph.isometric.dashedArrowlessEdge'
};

/**
* Function: paintVertexShape
* 
* Paints the vertex shape.
*/
mxShapeIsometricDashedArrowlessEdge.prototype.paintVertexShape = function(c, x, y, w, h)
{
	c.translate(x, y);
	
	c.setStrokeColor('#2D6195');
	c.setStrokeWidth('4');
	c.setDashed('true');
	c.setLineCap('round');
	
	c.begin();
	c.moveTo(0, 0);
	c.lineTo(w, h);
	c.stroke();
};

mxCellRenderer.registerShape(mxShapeIsometricDashedArrowlessEdge.prototype.cst.DASHED_ARROWLESS_EDGE, mxShapeIsometricDashedArrowlessEdge);

//**********************************************************************************************************************************************************
//Dashed edge
//**********************************************************************************************************************************************************
/**
* Extends mxShape.
*/
function mxShapeIsometricDashedEdge(bounds, fill, stroke, strokewidth)
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
mxUtils.extend(mxShapeIsometricDashedEdge, mxShape);

mxShapeIsometricDashedEdge.prototype.cst = {
		DASHED_EDGE : 'mxgraph.isometric.dashedEdge'
};

/**
* Function: paintVertexShape
* 
* Paints the vertex shape.
*/
mxShapeIsometricDashedEdge.prototype.paintVertexShape = function(c, x, y, w, h)
{
	c.translate(x, y);
	
	c.setFillColor('#2D6195');
	c.save();
	c.setStrokeColor('none');
	c.begin();
	c.moveTo(w - 21, 5.5);
	c.lineTo(w, 0);
	c.lineTo(w - 9.7, 12.2);
	c.fillAndStroke();
	
	c.restore();
	c.setStrokeColor('#2D6195');
	c.setStrokeWidth('4');
	c.setDashed('true');
	c.setLineCap('round');
	
	c.begin();
	c.moveTo(w - 7.675, 4.425);
	c.lineTo(0, h);
	c.stroke();
};

mxCellRenderer.registerShape(mxShapeIsometricDashedEdge.prototype.cst.DASHED_EDGE, mxShapeIsometricDashedEdge);

//**********************************************************************************************************************************************************
//Generic Isometric Shape
//**********************************************************************************************************************************************************
/**
* Extends mxShape.
*/
function mxIsometric(bounds, fill, stroke, strokewidth, isoAngle)
{
	mxShape.call(this, bounds, fill, stroke, strokewidth);
	this.isoAngle = isoAngle || 30;
	this.image = this.image || this.indicatorImage;
};

/**
* Extends mxShape.
*/
mxUtils.extend(mxIsometric, mxShape);

mxIsometric.prototype.cst = {
		ISOMETRIC_SHAPE : 'mxgraph.isometric.shape',
		SHADING_COLORS : 'shadingCols'
};

/**
 * Variable: isoAngle
 *
 * Set isometric projection angle for shape. Default is 30 degrees.
 */
mxIsometric.prototype.isoAngle = 30;

/**
 * Variable: shadingCols
 *
 * Set shading colors for shape. Default is "0,0" (White).
 */
mxIsometric.prototype.shadingCols = '0.1,0.3';

/**
 * Variable: isoHeight
 *
 * Set isometric projection height for shape. Default is 0;
 */
mxIsometric.prototype.isoHeight = 0;

/**
 * Variable: indicator
 *
 * Set indicator image/shape.
 */
mxIsometric.prototype.indicator = null;

/**
 * Variable: updateIsometric
 *
 * Set height of top shape that is related to isometric angle by overriding parent method.
 */
mxIsometric.prototype.updateIsometric = function(c, x, y, w, h)
{
	var isoAngle = this.getIsoAngle();
	if (isoAngle >= 0)
	{
		var angleRadians = Math.max(0.01, Math.min(45, isoAngle)) * Math.PI / 180;
		var isoRatio = Math.tan(angleRadians);
		this.isoHeight = mxUtils.precisionRound(Math.min(w * isoRatio, h), 1);
	} else
	{
		this.isoHeight = 0;
	}

	return this.isoHeight;
};

/**
* Function: paintVertexShape
* 
* Paints the vertex shape.
*/
mxIsometric.prototype.paintVertexShape = function(c, x, y, w, h)
{
	c.translate(x, y);
	
	var strokeWidth = parseFloat(mxUtils.getValue(this.style, mxConstants.STYLE_STROKEWIDTH, '1'));
	var strokeWidth1 = strokeWidth * w / 123;
	var strokeWidth2 = strokeWidth * h / 124;
	
	strokeWidth = Math.min(strokeWidth1, strokeWidth2);

	this.paintBackground(c, 0, 0, w, h, strokeWidth);
	c.setShadow(false);
	this.paintForeground(c, 0, 0, w, h, strokeWidth);
};

/**
 * Function: paintBackground
 * 
 * Paints the background for shape.
 */
mxIsometric.prototype.paintBackground = function(c, x, y, w, h, strokeWidth)
{
	var isoH = this.isoHeight;
	c.setStrokeWidth(strokeWidth);
	c.save();
	c.setStrokeWidth(2 * strokeWidth);
	c.setStrokeColor('#292929');
	c.setLineJoin('round');

	c.begin();
	c.moveTo(w * 0.5, 0);
	c.lineTo(w, isoH * 0.5);
	c.lineTo(w, h - isoH * 0.5);
	c.lineTo(w * 0.5, h);
	c.lineTo(0, h - isoH * 0.5);
	c.lineTo(0, isoH * 0.5);
	c.close();
	c.fillAndStroke();
};

/**
 * Function: paintForeground
 * 
 * Paints the foreground for shape.
 */
mxIsometric.prototype.paintForeground = function(c, x, y, w, h, strokeWidth)
{
	var isoH = this.isoHeight;
	var alpha = c.state.alpha || 1;
	c.restore();
	c.setShadow(false);
	c.setFillColor('#000000');
	var shading = mxUtils.getValue(this.style, this.cst.SHADING_COLORS, '0.1,0.3').toString().split(',');
	var flipH = mxUtils.getValue(this.style, mxConstants.STYLE_FLIPH, '0');
	(flipH == '0') ? c.setAlpha(shading[0]) : c.setAlpha(shading[1]); 
	
	c.begin();
	c.moveTo(0, isoH * 0.5);
	c.lineTo(w * 0.5, isoH);
	c.lineTo(w * 0.5, h);
	c.lineTo(0, h - isoH * 0.5);
	c.close();
	c.fill();

	(flipH == '0') ? c.setAlpha(shading[1]) : c.setAlpha(shading[0]); 
	c.begin();
	c.moveTo(w, isoH * 0.5);
	c.lineTo(w * 0.5, isoH);
	c.lineTo(w * 0.5, h);
	c.lineTo(w, h - isoH * 0.5);
	c.close();
	c.fill();
	
	c.restore();
	c.setShadow(false);
	c.setLineJoin('round');

	c.begin();
	c.moveTo(0, isoH * 0.5);
	c.lineTo(w * 0.5, isoH);
	c.lineTo(w * 0.5, h);
	c.lineTo(0, h - isoH * 0.5);
	c.close();
	c.stroke();

	c.begin();
	c.moveTo(w, isoH * 0.5);
	c.lineTo(w * 0.5, isoH);
	c.lineTo(w * 0.5, h);
	c.lineTo(w, h - isoH * 0.5);
	c.close();
	c.stroke();

	c.setStrokeWidth(2 * strokeWidth);
	c.setStrokeColor('#292929');
	c.setLineJoin('round');

	c.begin();
	c.moveTo(w * 0.5, 0);
	c.lineTo(w, isoH * 0.5);
	c.lineTo(w, h - isoH * 0.5);
	c.lineTo(w * 0.5, h);
	c.lineTo(0, h - isoH * 0.5);
	c.lineTo(0, isoH * 0.5);
	c.close();
	c.stroke();

	c.setAlpha(alpha);
};

mxCellRenderer.registerShape(mxIsometric.prototype.cst.ISOMETRIC_SHAPE, mxIsometric);

mxIsometric.prototype.getConstraints = function(style, w, h)
{
	var constr = [];
	
	var isoH = this.isoHeight;

	constr.push(new mxConnectionConstraint(new mxPoint(0.5, 0), false));
	constr.push(new mxConnectionConstraint(new mxPoint(0, 0), false, null, w, isoH * 0.5));
	constr.push(new mxConnectionConstraint(new mxPoint(1, 0.5), false));
	constr.push(new mxConnectionConstraint(new mxPoint(0, 0), false, null, w, h - isoH * 0.5));
	constr.push(new mxConnectionConstraint(new mxPoint(0.5, 1), false));
	constr.push(new mxConnectionConstraint(new mxPoint(0, 0), false, null, 0, h - isoH * 0.5));
	constr.push(new mxConnectionConstraint(new mxPoint(0, 0.5), false));
	constr.push(new mxConnectionConstraint(new mxPoint(0, 0), false, null, 0, isoH * 0.5));

	return (constr);
};

//**********************************************************************************************************************************************************
//Generic Isometric Container Shape
//**********************************************************************************************************************************************************
/**
* Extends mxIsometric.
*/
function mxIsometricContainer(bounds, fill, stroke, strokewidth, isoAngle)
{
	mxIsometric.call(this, bounds, fill, stroke, strokewidth);
	this.isoAngle = isoAngle || 30;
	this.image = this.image || this.indicatorImage;
};

/**
* Extends mxIsometric.
*/
mxUtils.extend(mxIsometricContainer, mxIsometric);

mxIsometricContainer.prototype.cst = {
		GENERIC_CONTAINER : 'mxgraph.isometric.genericContainer'};

/**
 * Variable: preserveImageAspect
 *
 * Switch to preserve image aspect. Default is true.
 */
mxIsometricContainer.prototype.preserveImageAspect = true;

/**
 * Function: init
 *
 * Initializes the shape and the <indicator>.
 */
mxIsometricContainer.prototype.init = function(container)
{
	mxShape.prototype.init.apply(this, arguments);

	var name = this.image || this.indicatorShape;
	if (name != null && this.indicator == null)
	{
		if (this.image)
		{
			this.indicator = new mxImageShape();
		} else if (this.indicatorShape instanceof mxShape)
		{
			this.indicator = this.indicatorShape;
		} else
		{
			this.indicator = new this.indicatorShape();
		}
		this.indicator.dialect = this.dialect;
		this.indicator.init(this.node);
	}
};


/**
 * Function: paintIndicator
* 
 * Paints the decoration/indicator on top of shape.
 */
mxIsometricContainer.prototype.paintIndicator = function(c, x, y, w, h)
{
	var indicator = this.indicator;
	var isoAngle = this.getIsoAngle();
	if (indicator != null && isoAngle > 0)
	{
		indicator.bounds = this.getIndicatorBounds(x, y, w, h);
		if (this.image != null)
		{
			indicator.image = this.image;
		}
		indicator.isoAngle = isoAngle;
		indicator.paint(c);
	}
};

/**
 * Function: getIndicatorBounds
 * 
 * Get the decoration/indicator bounds.
 */
mxIsometricContainer.prototype.getIndicatorBounds = function(x, y, w, h)
{
	var size = w * 0.5;
	var width = mxUtils.precisionRound(mxUtils.getNumber(this.style, mxConstants.STYLE_INDICATOR_WIDTH, size), 1);
	var height = mxUtils.precisionRound(mxUtils.getNumber(this.style, mxConstants.STYLE_INDICATOR_HEIGHT, size), 1);

	x += (w - width) / 2;
	y += (this.isoHeight - height) / 2;

	return new mxRectangle(mxUtils.precisionRound(x, 1), mxUtils.precisionRound(y, 1), width, height);
};

mxIsometricContainer.prototype.getImageBounds = mxIsometricContainer.prototype.getIndicatorBounds;

/**
 * Function: paintForeground
 * 
 * Paints the foreground for shape.
 */
mxIsometricContainer.prototype.paintForeground = function(c, x, y, w, h, strokeWidth)
{
	mxIsometric.prototype.paintForeground.apply(this, arguments);
	this.paintIndicator(c, x, y, w, h);
};

/**
 * Function: redraw
 *
 * Reconfigures this shape. This will update the colors of the indicator
 * and reconfigure it if required.
 */
mxIsometricContainer.prototype.redraw = function()
{
	if (this.indicator != null)
	{
		this.indicator.fill = this.indicatorColor;
		this.indicator.stroke = this.indicatorStrokeColor;
		this.indicator.gradient = this.indicatorGradientColor;
		this.indicator.direction = this.indicatorDirection;
		this.indicator.isoAngle = this.getIsoAngle();
	}
	
	mxIsometric.prototype.redraw.apply(this, arguments);
};

mxCellRenderer.registerShape(mxIsometricContainer.prototype.cst.GENERIC_CONTAINER, mxIsometricContainer);
