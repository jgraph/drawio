/**
 * Copyright (c) 2020-2025, JGraph Holdings Ltd
 * Copyright (c) 2020-2025, draw.io AG
 */
//**********************************************************************************************************************************************************
//Input Pin
//**********************************************************************************************************************************************************
function mxShapeUMLInputPin(bounds, fill, stroke, strokewidth)
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
mxUtils.extend(mxShapeUMLInputPin, mxActor);

mxShapeUMLInputPin.prototype.cst = {INPUT_PIN : 'mxgraph.uml25.inputPin'};

mxShapeUMLInputPin.prototype.paintVertexShape = function(c, x, y, w, h)
{
	c.translate(x, y);

	c.begin();
	c.moveTo(0, 0);
	c.lineTo(w, 0);
	c.lineTo(w, h);
	c.lineTo(0, h);
	c.close();
	c.fillAndStroke();
	
	c.setShadow(false);
	
	c.begin();
	c.moveTo(w * 0.75, h * 0.5);
	c.lineTo(w * 0.25, h * 0.5);
	c.moveTo(w * 0.4, h * 0.4);
	c.lineTo(w * 0.25, h * 0.5);
	c.lineTo(w * 0.4, h * 0.6);
	c.stroke();
};

mxCellRenderer.registerShape(mxShapeUMLInputPin.prototype.cst.INPUT_PIN, mxShapeUMLInputPin);

mxShapeUMLInputPin.prototype.constraints = null;

//**********************************************************************************************************************************************************
//Behavior Action
//**********************************************************************************************************************************************************
function mxShapeUMLBehaviorAction(bounds, fill, stroke, strokewidth)
{
	mxShape.call(this);
	this.bounds = bounds;
	this.fill = fill;
	this.stroke = stroke;
	this.strokewidth = (strokewidth != null) ? strokewidth : 1;
	this.dx = 0.5;
};

mxUtils.extend(mxShapeUMLBehaviorAction, mxActor);

mxShapeUMLBehaviorAction.prototype.cst = {BEHAVIOR_ACTION : 'mxgraph.uml25.behaviorAction'};

/**
* Function: paintVertexShape
* 
* Paints the vertex shape.
*/
mxShapeUMLBehaviorAction.prototype.paintVertexShape = function(c, x, y, w, h)
{
	c.translate(x, y);

	var rounded = mxUtils.getValue(this.style, 'rounded', false);
	var absArcSize = mxUtils.getValue(this.style, 'absoluteArcSize', false);
	var arcSize = parseFloat(mxUtils.getValue(this.style, 'arcSize', this.arcSize));

	// Uses the arc size of the shapes in the sidebar if none is defined
	if (isNaN(arcSize))
	{
		arcSize = 10;
		absArcSize = true;
	}
	
	if (!absArcSize)
	{
		arcSize = Math.min(w, h) * arcSize;
	}
	
	arcSize = Math.min(arcSize, w * 0.5, h * 0.5);
	
	if (!rounded)
	{
		arcSize = 0;
	}
	
	c.begin();
	
	if (rounded)
	{
		c.moveTo(0, arcSize);
		c.arcTo(arcSize, arcSize, 0, 0, 1, arcSize, 0);
		c.lineTo(w - arcSize, 0);
		c.arcTo(arcSize, arcSize, 0, 0, 1, w, arcSize);
		c.lineTo(w, h - arcSize);
		c.arcTo(arcSize, arcSize, 0, 0, 1, w - arcSize, h);
		c.lineTo(arcSize, h);
		c.arcTo(arcSize, arcSize, 0, 0, 1, 0, h - arcSize);
	}
	else
	{
		c.moveTo(0, 0);
		c.lineTo(w, 0);
		c.lineTo(w, h);
		c.lineTo(0, h);
	}
	
	c.close();
	c.fillAndStroke();
	
	c.setShadow(false);

	if (w >= 60 && h >= 40)
	{
		c.begin();
		c.moveTo(w - 60, h * 0.5 + 20);
		c.lineTo(w - 60, h * 0.5);
		c.lineTo(w - 20, h * 0.5);
		c.lineTo(w - 20, h * 0.5 + 20);
		c.moveTo(w - 40, h * 0.5 - 20);
		c.lineTo(w - 40, h * 0.5 + 20);
		c.stroke();
	}
};

mxCellRenderer.registerShape(mxShapeUMLBehaviorAction.prototype.cst.BEHAVIOR_ACTION, mxShapeUMLBehaviorAction);

mxShapeUMLBehaviorAction.prototype.constraints = null;

// The side middles and the 45 degree points of the corners as painted
mxShapeUMLBehaviorAction.prototype.getConstraints = function(style, w, h)
{
	var rounded = mxUtils.getValue(style, 'rounded', false);
	var absArcSize = mxUtils.getValue(style, 'absoluteArcSize', false);
	var arcSize = parseFloat(mxUtils.getValue(style, 'arcSize', this.arcSize));

	if (isNaN(arcSize))
	{
		arcSize = 10;
		absArcSize = true;
	}

	if (!absArcSize)
	{
		arcSize = Math.min(w, h) * arcSize;
	}

	arcSize = Math.min(arcSize, w * 0.5, h * 0.5);

	if (!rounded)
	{
		arcSize = 0;
	}

	var k = arcSize * (1 - Math.SQRT1_2);

	return [new mxConnectionConstraint(new mxPoint(0.5, 0), false),
		new mxConnectionConstraint(new mxPoint(0.5, 1), false),
		new mxConnectionConstraint(new mxPoint(0, 0.5), false),
		new mxConnectionConstraint(new mxPoint(1, 0.5), false),
		new mxConnectionConstraint(new mxPoint(0, 0), false, null, k, k),
		new mxConnectionConstraint(new mxPoint(1, 0), false, null, -k, k),
		new mxConnectionConstraint(new mxPoint(1, 1), false, null, -k, -k),
		new mxConnectionConstraint(new mxPoint(0, 1), false, null, k, -k)];
};

//**********************************************************************************************************************************************************
//Action
//**********************************************************************************************************************************************************
/**
* Extends mxShape.
*/
function mxShapeUMLAction(bounds, fill, stroke, strokewidth)
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
mxUtils.extend(mxShapeUMLAction, mxActor);

mxShapeUMLAction.prototype.cst = {ACTION : 'mxgraph.uml25.action'};

/**
* Function: paintVertexShape
* 
* Paints the vertex shape.
*/
mxShapeUMLAction.prototype.paintVertexShape = function(c, x, y, w, h)
{
	c.translate(x, y);

	var absArcSize = mxUtils.getValue(this.style, 'absoluteArcSize', false);
	var arcSize = parseFloat(mxUtils.getValue(this.style, 'arcSize', this.arcSize));

	// Uses the arc size of the shapes in the sidebar if none is defined
	if (isNaN(arcSize))
	{
		arcSize = 10;
		absArcSize = true;
	}
	
	if (!absArcSize)
	{
		arcSize = Math.min(w, h) * arcSize;
	}
	
	arcSize = Math.min(arcSize, w * 0.5, h * 0.5);
	
	c.begin();
	c.moveTo(0, arcSize);
	c.arcTo(arcSize, arcSize, 0, 0, 1, arcSize, 0);
	c.lineTo(w - arcSize - 10, 0);
	c.arcTo(arcSize, arcSize, 0, 0, 1, w - 10, arcSize);
	c.lineTo(w - 10, h - arcSize);
	c.arcTo(arcSize, arcSize, 0, 0, 1, w - arcSize - 10, h);
	c.lineTo(arcSize, h);
	c.arcTo(arcSize, arcSize, 0, 0, 1, 0, h - arcSize);
	c.close();
	c.fillAndStroke();
	
	c.rect(w - 10, h * 0.5 - 10, 10, 20);
	c.fillAndStroke();
};

mxCellRenderer.registerShape(mxShapeUMLAction.prototype.cst.ACTION, mxShapeUMLAction);

mxShapeUMLAction.prototype.constraints = null;

// The end of the pin on the right (flipped shapes are mirrored by the graph),
// the middles of the other sides of the body and the 45 degree points of its
// corners. Positions that depend on the size are relative, so edges follow a
// resize; only the 10 px pin and the absolute corners are offsets.
mxShapeUMLAction.prototype.getConstraints = function(style, w, h)
{
	var absArcSize = mxUtils.getValue(style, 'absoluteArcSize', false);
	var arcSize = parseFloat(mxUtils.getValue(style, 'arcSize', this.arcSize));

	if (isNaN(arcSize))
	{
		arcSize = 10;
		absArcSize = true;
	}

	if (!absArcSize)
	{
		arcSize = Math.min(w, h) * arcSize;
	}

	arcSize = Math.min(arcSize, w * 0.5, h * 0.5);

	var k = arcSize * (1 - Math.SQRT1_2);

	return [new mxConnectionConstraint(new mxPoint(0.5, 0), false, null, -5, 0),
		new mxConnectionConstraint(new mxPoint(0.5, 1), false, null, -5, 0),
		new mxConnectionConstraint(new mxPoint(0, 0.5), false),
		new mxConnectionConstraint(new mxPoint(1, 0.5), false),
		new mxConnectionConstraint(new mxPoint(0, 0), false, null, k, k),
		new mxConnectionConstraint(new mxPoint(1, 0), false, null, -10 - k, k),
		new mxConnectionConstraint(new mxPoint(1, 1), false, null, -10 - k, -k),
		new mxConnectionConstraint(new mxPoint(0, 1), false, null, k, -k)];
};

//**********************************************************************************************************************************************************
//Action with parameters
//**********************************************************************************************************************************************************
/**
* Extends mxShape.
*/
function mxShapeUMLActionParams(bounds, fill, stroke, strokewidth)
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
mxUtils.extend(mxShapeUMLActionParams, mxActor);

mxShapeUMLActionParams.prototype.cst = {ACTION_PARAMS : 'mxgraph.uml25.actionParams'};

/**
* Function: paintVertexShape
* 
* Paints the vertex shape.
*/
mxShapeUMLActionParams.prototype.paintVertexShape = function(c, x, y, w, h)
{
	c.translate(x, y);

	var absArcSize = mxUtils.getValue(this.style, 'absoluteArcSize', false);
	var arcSize = parseFloat(mxUtils.getValue(this.style, 'arcSize', this.arcSize));

	// Uses the arc size of the shapes in the sidebar if none is defined
	if (isNaN(arcSize))
	{
		arcSize = 10;
		absArcSize = true;
	}
	
	if (!absArcSize)
	{
		arcSize = Math.min(w, h) * arcSize;
	}
	
	arcSize = Math.min(arcSize, w * 0.5, h * 0.5);
	
	c.begin();
	c.moveTo(20, arcSize);
	c.arcTo(arcSize, arcSize, 0, 0, 1, 20 + arcSize, 0);
	c.lineTo(w - arcSize, 0);
	c.arcTo(arcSize, arcSize, 0, 0, 1, w, arcSize);
	c.lineTo(w, h - arcSize);
	c.arcTo(arcSize, arcSize, 0, 0, 1, w - arcSize, h);
	c.lineTo(20 + arcSize, h);
	c.arcTo(arcSize, arcSize, 0, 0, 1, 20, h - arcSize);
	c.close();
	c.fillAndStroke();
	
	c.rect(5, h * 0.5 - 17, 20, 34);
	c.fillAndStroke();
	
	c.rect(0, h * 0.5 - 13, 10, 10);
	c.fillAndStroke();
	
	c.rect(0, h * 0.5 + 3, 10, 10);
	c.fillAndStroke();
};

mxCellRenderer.registerShape(mxShapeUMLActionParams.prototype.cst.ACTION_PARAMS, mxShapeUMLActionParams);

mxShapeUMLActionParams.prototype.constraints = null;

// The two input pins on the left, the middles of the other sides of the body
// (which starts behind the parameter box) and the 45 degree points of its
// corners
mxShapeUMLActionParams.prototype.getConstraints = function(style, w, h)
{
	var absArcSize = mxUtils.getValue(style, 'absoluteArcSize', false);
	var arcSize = parseFloat(mxUtils.getValue(style, 'arcSize', this.arcSize));

	if (isNaN(arcSize))
	{
		arcSize = 10;
		absArcSize = true;
	}

	if (!absArcSize)
	{
		arcSize = Math.min(w, h) * arcSize;
	}

	arcSize = Math.min(arcSize, w * 0.5, h * 0.5);

	var k = arcSize * (1 - Math.SQRT1_2);

	return [new mxConnectionConstraint(new mxPoint(0.5, 0), false, null, 10, 0),
		new mxConnectionConstraint(new mxPoint(0.5, 1), false, null, 10, 0),
		new mxConnectionConstraint(new mxPoint(1, 0.5), false),
		new mxConnectionConstraint(new mxPoint(0, 0.5), false, null, 0, -8),
		new mxConnectionConstraint(new mxPoint(0, 0.5), false, null, 0, 8),
		new mxConnectionConstraint(new mxPoint(0, 0), false, null, 20 + k, k),
		new mxConnectionConstraint(new mxPoint(1, 0), false, null, -k, k),
		new mxConnectionConstraint(new mxPoint(1, 1), false, null, -k, -k),
		new mxConnectionConstraint(new mxPoint(0, 1), false, null, 20 + k, -k)];
};
