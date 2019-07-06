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
function mxShapeIsometric(bounds, fill, stroke, strokewidth, isoAngle, shadingCols)
{
	mxShape.apply(this, bounds, fill, stroke, strokewidth);
	this.isoAngle = isoAngle || 30;
	this.shadingCols = shadingCols;
	this.isoHeight = 0;
};

/**
* Extends mxShape.
*/
mxUtils.extend(mxShapeIsometric, mxShape);

mxShapeIsometric.prototype.cst = {
		ISOMETRIC_SHAPE : 'mxgraph.isometric.shape',
		SHADING_COLORS : 'shadingCols'
};

/**
 * Variable: isoAngle
 *
 * Set isometric projection angle for shape. Default is 30 degrees.
 */
mxShapeIsometric.prototype.isoAngle = 30;

/**
 * Variable: shadingCols
 *
 * Set shading colors for shape. Default is "0,0" (White).
 */
mxShapeIsometric.prototype.shadingCols = '0.1,0.3';

/**
 * Variable: isoHeight
 *
 * Set isometric projection height for shape. Default is 0;
 */
mxShapeIsometric.prototype.isoHeight = 0;

/**
 * Variable: indicator
 *
 * Set indicator image/shape.
 */
mxShapeIsometric.prototype.icon = null;

/**
 * Variable: updateIsometric
 *
 * Set height of top shape that is related to isometric angle by overriding parent method.
 */
mxShapeIsometric.prototype.updateIsometric = function(c, x, y, w, h)
{
	var isoAngle = this.getIsoAngle();
	if (isoAngle >= 0)
	{
		var angleRadians = Math.max(0.01, Math.min(45, isoAngle)) * Math.PI / 180;
		var isoRatio = Math.tan(angleRadians);
		this.isoHeight = Math.min(w * isoRatio, h);
		console.debug('isometric values:', isoAngle, angleRadians, isoRatio, this.isoHeight);
	} else
	{
		this.isoHeight = 0;
	}

	return this.isoHeight;
};

/**
* Function: paintDecoration
* 
* Paints the decoration on top of shape.
*/
mxShapeIsometric.prototype.paintDecoration = function(c, x, y, w, h)
{
	if (this.style != null)
	{
		var s = this.state;
		var isoAngle = this.getIsoAngle();
		var image = mxUtils.getValue(this.style, mxConstants.STYLE_IMAGE, this.image);
		var icon = mxUtils.getValue(this.style, 'icon', this.icon);
		if (this.node != null && s != null && (icon != null || image != null))
		{
			var size = 1.022864652748906 * this.isoHeight;
			var decoration = new mxCell('', new mxGeometry((w - size) / 2, 0, size, size), 'shape=image;image=' + icon + ';imageBorder:#FFFFFF;fillColor=#5E5E5E;fillColor=#5E5E5E;gradientColor=none;isoAngle=' + isoAngle + ';');
			// decoration.geometry.relative = true;
			// decoration.geometry.offset = new mxPoint(-20, -8);
			decoration.vertex = true;
			// if (s.cell.getChildCount() > 0)
			// {
			// 	s.cell.remove(0);
			// }
			// for (var i = 1; i < s.cell.getChildCount(); i++)
			// {
			// 	s.cell.remove(i);
			// }
			return s.cell.insert(decoration);
		}
	}
};

/**
* Function: paintVertexShape
* 
* Paints the vertex shape.
*/
mxShapeIsometric.prototype.paintVertexShape = function(c, x, y, w, h)
{
	c.translate(x, y);
	
	var strokeWidth = parseFloat(mxUtils.getValue(this.style, mxConstants.STYLE_STROKEWIDTH, '1'));
	var strokeWidth1 = strokeWidth * w / 123;
	var strokeWidth2 = strokeWidth * h / 124;
	
	strokeWidth = Math.min(strokeWidth1, strokeWidth2);

	this.paintBackground(c, 0, 0, w, h, strokeWidth);
	c.setShadow(false);
	this.paintForeground(c, 0, 0, w, h, strokeWidth);
	// this.paintDecoration(c, 0, 0, w, h);
};

/**
 * Function: paintBackground
 * 
 * Paints the background for shape.
 */
mxShapeIsometric.prototype.paintBackground = function(c, x, y, w, h, strokeWidth)
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
mxShapeIsometric.prototype.paintForeground = function(c, x, y, w, h, strokeWidth)
{
	var isoH = this.isoHeight;
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
};

mxCellRenderer.registerShape(mxShapeIsometric.prototype.cst.ISOMETRIC_SHAPE, mxShapeIsometric);

Graph.handleFactory[mxShapeIsometric.prototype.cst.ISOMETRIC_SHAPE] = function(state)
{
	var handles = [Graph.createHandle(state, ['isoAngle'], function(bounds)
	{
		console.log('mxShapeIsometric handleFactory',state.shape.getIsoAngle());

		return new mxPoint(bounds.x * bounds.width, bounds.y + bounds.height);
	}, function(bounds, pt)
	{
		this.state.style['dx'] = Math.round(100 * Math.max(0, Math.min(1, (pt.x - bounds.x) / bounds.width))) / 100;
	})];

	return handles;
};

mxShapeIsometric.prototype.getConstraints = function(style, w, h)
{
	var constr = [];
	
	var isoH = this.isoHeight;
	console.log('mxShapeIsometric.prototype.getConstraints',isoH);

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
* Extends mxShapeIsometric.
*/
function mxShapeIsometricContainer(bounds, fill, stroke, strokewidth, indicatorImage)
{
	mxShapeIsometric.apply(this, bounds, fill, stroke, strokewidth);
	this.indicatorImage = indicatorImage;
};

/**
* Extends mxShapeIsometric.
*/
mxUtils.extend(mxShapeIsometricContainer, mxShapeIsometric);

mxShapeIsometricContainer.prototype.cst = {
		GENERIC_CONTAINER : 'mxgraph.isometric.genericContainer'};

/**
 * Variable: preserveImageAspect
 *
 * Switch to preserve image aspect. Default is true.
 */
mxShapeIsometricContainer.prototype.preserveImageAspect = true;

/**
 * Variable: preserveImageAspect
 *
 * Indicator image rotation. Default is 30 degrees.
 */
mxShapeIsometricContainer.prototype.indicatorRotation = 30;

/**
* Function: paintVertexShape
* 
* Paints the vertex shape.
*/
/* mxShapeIsometricContainer.prototype.paintVertexShape = function(c, x, y, w, h)
{
	mxShapeIsometric.prototype.paintVertexShape.apply(this, arguments);
	// this.placeImage(c, w * 0.3, h * 0.0625, w * 0.35, h * 0.35, strokeWidth);
}; */

/**
* Function: placeImage
* 
* Place indicator image on top of generic shape.
*/
mxShapeIsometricContainer.prototype.placeImage = function(c, x, y, w, h, strokeWidth)
{
	if (this.indicatorImage != null)
	{
		c.setShadow(false);

		c.setStrokeWidth(strokeWidth);
		c.setStrokeColor('#292929');
		c.setLineJoin('round');

		c.rect(x, y, w, h)
		c.image(x, y, w, h, this.indicatorImage, this.preserveImageAspect, false, false);
		var bbox = new mxRectangle(x, y, w, h);
		c.stroke();

		c.scale(1, 0.8606);
		c.rotate(30, 0, 0, x + w / 2, y + h / 2);
		// this.updateTransform();

		// FlipH/V are implicit via mxShape.updateTransform
		// 
		// c.rotate(this.indicatorRotation);
		c.save();
		// this.updateTransform(c, x, y, w, h);
	}
};

mxCellRenderer.registerShape(mxShapeIsometricContainer.prototype.cst.GENERIC_CONTAINER, mxShapeIsometricContainer);
