/**
 * $Id: mxElectrical.js,v 1.0 2016/10/25 17:05:39 mate Exp $
 * Copyright (c) 2006-2016, JGraph Ltd
 */

//**********************************************************************************************************************************************************
//Test Point
//**********************************************************************************************************************************************************
/**
* Extends mxShape.
*/
function mxShapeElectricalTestPoint(bounds, fill, stroke, strokewidth)
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
mxUtils.extend(mxShapeElectricalTestPoint, mxShape);

mxShapeElectricalTestPoint.prototype.cst = {
		SHAPE_TEST_POINT : 'mxgraph.electrical.transmission.testPoint'
};

/**
* Function: paintVertexShape
* 
* Paints the vertex shape.
*/
mxShapeElectricalTestPoint.prototype.paintVertexShape = function(c, x, y, w, h)
{
	c.translate(x, y);
	var strokeColor = mxUtils.getValue(this.style, mxConstants.STYLE_STROKECOLOR, '#000000');

	var size = Math.min(w, h); 
	
	c.setFillColor(strokeColor);
	c.begin();
	c.ellipse(w * 0.5 - size / 2, 0, size, size);
	c.fillAndStroke();
	
	if (h > w)
	{
		c.begin();
		c.moveTo(w * 0.5, size);
		c.lineTo(w * 0.5, h);
		c.stroke();
	}
};

mxCellRenderer.registerShape(mxShapeElectricalTestPoint.prototype.cst.SHAPE_TEST_POINT, mxShapeElectricalTestPoint);

mxShapeElectricalTestPoint.prototype.constraints = [
                                                  new mxConnectionConstraint(new mxPoint(0.5, 0), true),
                                                  new mxConnectionConstraint(new mxPoint(0.5, 1), true)
                                                  ];

//**********************************************************************************************************************************************************
//Straight Bus
//**********************************************************************************************************************************************************
/**
* Extends mxShape.
*/
function mxShapeElectricalStraightBus(bounds, fill, stroke, strokewidth)
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
mxUtils.extend(mxShapeElectricalStraightBus, mxShape);

mxShapeElectricalStraightBus.prototype.cst = {
		SHAPE_STRAIGHT_BUS : 'mxgraph.electrical.transmission.straightBus'
};



/**
* Function: paintVertexShape
* 
* Paints the vertex shape.
*/
mxShapeElectricalStraightBus.prototype.paintVertexShape = function(c, x, y, w, h)
{
	c.translate(x, y);

	var size = Math.min(w, h); 
	var x1 = w * 0.2;
	var y1 = 0;
	
	if (w > h)
	{
		y1 = h * 0.5;
	}
	else
	{
		y1 = w / 2;
	}
	
	c.begin();
	c.moveTo(w - x1, 0);
	c.lineTo(w - x1, h - y1);
	c.lineTo(w, h - y1);
	c.lineTo(w * 0.5, h);
	c.lineTo(0, h - y1);
	c.lineTo(x1, h - y1);
	c.lineTo(x1, 0);
	c.fillAndStroke();
};

mxCellRenderer.registerShape(mxShapeElectricalStraightBus.prototype.cst.SHAPE_STRAIGHT_BUS, mxShapeElectricalStraightBus);

mxShapeElectricalStraightBus.prototype.constraints = [
                                                    new mxConnectionConstraint(new mxPoint(0.5, 0), true),
                                                    new mxConnectionConstraint(new mxPoint(0.5, 1), true)
                                                    ];

//**********************************************************************************************************************************************************
//Two-Line Bus Elbow
//**********************************************************************************************************************************************************
/**
* Extends mxShape.
*/
function mxShapeElectricalTwoLineBusElbow(bounds, fill, stroke, strokewidth)
{
	mxShape.call(this);
	this.bounds = bounds;
	this.fill = fill;
	this.stroke = stroke;
	this.strokewidth = (strokewidth != null) ? strokewidth : 1;
	this.notch = 0;
};

/**
* Extends mxShape.
*/
mxUtils.extend(mxShapeElectricalTwoLineBusElbow, mxShape);

mxShapeElectricalTwoLineBusElbow.prototype.cst = {
		SHAPE_TWO_LINE_BUS_ELBOW : 'mxgraph.electrical.transmission.twoLineBusElbow'
};

mxShapeElectricalTwoLineBusElbow.prototype.customProperties = [
	{name:'notch', dispName:'Spacing', type:'float', min:0, defVal:25}
];

/**
* Function: paintVertexShape
* 
* Paints the vertex shape.
*/
mxShapeElectricalTwoLineBusElbow.prototype.paintVertexShape = function(c, x, y, w, h)
{
	var notch = Math.max(0, Math.min(w, parseFloat(mxUtils.getValue(this.style, 'notch', this.notch))));

	c.translate(x, y);

	c.begin();
	c.moveTo(0, h);
	c.lineTo(w, h);
	c.lineTo(w, 0);
	c.stroke();
	
	var wn = Math.min(w, notch);
	var hn = Math.min(h, notch);
	
	c.begin();
	c.moveTo(0, h - hn);
	c.lineTo(w - wn, h - hn);
	c.lineTo(w - wn, 0);
	c.stroke();
};

mxCellRenderer.registerShape(mxShapeElectricalTwoLineBusElbow.prototype.cst.SHAPE_TWO_LINE_BUS_ELBOW, mxShapeElectricalTwoLineBusElbow);

mxShapeElectricalTwoLineBusElbow.prototype.constraints = null;

Graph.handleFactory[mxShapeElectricalTwoLineBusElbow.prototype.cst.SHAPE_TWO_LINE_BUS_ELBOW] = function(state)
{
	var handles = [Graph.createHandle(state, ['notch'], function(bounds)
	{
		var notch = Math.max(Math.min(bounds.height, parseFloat(mxUtils.getValue(this.state.style, 'notch', this.notch))), 0);

		return new mxPoint(bounds.x + bounds.width / 4, bounds.y + bounds.height - notch);
	}, function(bounds, pt)
	{
		this.state.style['notch'] = Math.round(0.2 * Math.max(0, bounds.width - pt.y + bounds.y)) / 0.2;
	})];
			
	return handles;

}

//**********************************************************************************************************************************************************
//Three-Line Bus Elbow
//**********************************************************************************************************************************************************
/**
* Extends mxShape.
*/
function mxShapeElectricalThreeLineBusElbow(bounds, fill, stroke, strokewidth)
{
	mxShape.call(this);
	this.bounds = bounds;
	this.fill = fill;
	this.stroke = stroke;
	this.strokewidth = (strokewidth != null) ? strokewidth : 1;
	this.notch = 0;
};

/**
* Extends mxShape.
*/
mxUtils.extend(mxShapeElectricalThreeLineBusElbow, mxShape);

mxShapeElectricalThreeLineBusElbow.prototype.cst = {
		SHAPE_THREE_LINE_BUS_ELBOW : 'mxgraph.electrical.transmission.threeLineBusElbow'
};

mxShapeElectricalThreeLineBusElbow.prototype.customProperties = [
	{name:'notch', dispName:'Spacing', type:'float', min:0, defVal:30}
];

/**
* Function: paintVertexShape
* 
* Paints the vertex shape.
*/
mxShapeElectricalThreeLineBusElbow.prototype.paintVertexShape = function(c, x, y, w, h)
{
	var notch = Math.max(0, Math.min(w, parseFloat(mxUtils.getValue(this.style, 'notch', this.notch))));

	c.translate(x, y);

	c.begin();
	c.moveTo(0, h);
	c.lineTo(w, h);
	c.lineTo(w, 0);
	c.stroke();
	
	var wn = Math.min(w, notch);
	var hn = Math.min(h, notch);
	
	c.begin();
	c.moveTo(0, h - hn);
	c.lineTo(w - wn, h - hn);
	c.lineTo(w - wn, 0);
	c.stroke();
	
	c.begin();
	c.moveTo(0, h - hn / 2);
	c.lineTo(w - wn / 2, h - hn / 2);
	c.lineTo(w - wn / 2, 0);
	c.stroke();
};

mxCellRenderer.registerShape(mxShapeElectricalThreeLineBusElbow.prototype.cst.SHAPE_THREE_LINE_BUS_ELBOW, mxShapeElectricalThreeLineBusElbow);

mxShapeElectricalThreeLineBusElbow.prototype.constraints = null;

Graph.handleFactory[mxShapeElectricalThreeLineBusElbow.prototype.cst.SHAPE_THREE_LINE_BUS_ELBOW] = function(state)
{
	var handles = [Graph.createHandle(state, ['notch'], function(bounds)
	{
		var notch = Math.max(Math.min(bounds.height, parseFloat(mxUtils.getValue(this.state.style, 'notch', this.notch))), 0);

		return new mxPoint(bounds.x + bounds.width / 4, bounds.y + bounds.height - notch);
	}, function(bounds, pt)
	{
		this.state.style['notch'] = Math.round(0.2 * Math.max(0, bounds.width - pt.y + bounds.y)) / 0.2;
	})];
			
	return handles;

}

//**********************************************************************************************************************************************************
//Four-Line Bus Elbow
//**********************************************************************************************************************************************************
/**
* Extends mxShape.
*/
function mxShapeElectricalFourLineBusElbow(bounds, fill, stroke, strokewidth)
{
	mxShape.call(this);
	this.bounds = bounds;
	this.fill = fill;
	this.stroke = stroke;
	this.strokewidth = (strokewidth != null) ? strokewidth : 1;
	this.notch = 0;
};

/**
* Extends mxShape.
*/
mxUtils.extend(mxShapeElectricalFourLineBusElbow, mxShape);

mxShapeElectricalFourLineBusElbow.prototype.cst = {
		SHAPE_FOUR_LINE_BUS_ELBOW : 'mxgraph.electrical.transmission.fourLineBusElbow'
};

mxShapeElectricalFourLineBusElbow.prototype.customProperties = [
	{name:'notch', dispName:'Spacing', type:'float', min:0, defVal:75}
];

/**
* Function: paintVertexShape
* 
* Paints the vertex shape.
*/
mxShapeElectricalFourLineBusElbow.prototype.paintVertexShape = function(c, x, y, w, h)
{
	var notch = Math.max(0, Math.min(w, parseFloat(mxUtils.getValue(this.style, 'notch', this.notch))));

	c.translate(x, y);

	c.begin();
	c.moveTo(0, h);
	c.lineTo(w, h);
	c.lineTo(w, 0);
	c.stroke();
	
	var wn = Math.min(w, notch);
	var hn = Math.min(h, notch);
	
	c.begin();
	c.moveTo(0, h - hn);
	c.lineTo(w - wn, h - hn);
	c.lineTo(w - wn, 0);
	c.stroke();
	
	c.begin();
	c.moveTo(0, h - hn / 3);
	c.lineTo(w - wn / 3, h - hn / 3);
	c.lineTo(w - wn / 3, 0);
	c.stroke();
	
	c.begin();
	c.moveTo(0, h - hn * 2 / 3);
	c.lineTo(w - wn * 2 / 3, h - hn * 2 / 3);
	c.lineTo(w - wn * 2 / 3, 0);
	c.stroke();
};

mxCellRenderer.registerShape(mxShapeElectricalFourLineBusElbow.prototype.cst.SHAPE_FOUR_LINE_BUS_ELBOW, mxShapeElectricalFourLineBusElbow);

mxShapeElectricalFourLineBusElbow.prototype.constraints = null;

Graph.handleFactory[mxShapeElectricalFourLineBusElbow.prototype.cst.SHAPE_FOUR_LINE_BUS_ELBOW] = function(state)
{
	var handles = [Graph.createHandle(state, ['notch'], function(bounds)
	{
		var notch = Math.max(Math.min(bounds.height, parseFloat(mxUtils.getValue(this.state.style, 'notch', this.notch))), 0);

		return new mxPoint(bounds.x + bounds.width / 4, bounds.y + bounds.height - notch);
	}, function(bounds, pt)
	{
		this.state.style['notch'] = Math.round(0.2 * Math.max(0, bounds.width - pt.y + bounds.y)) / 0.2;
	})];
			
	return handles;
}

//**********************************************************************************************************************************************************
//Four-Line Bus Elbow
//**********************************************************************************************************************************************************
/**
* Extends mxShape.
*/
function mxShapeElectricalEightLineBusElbow(bounds, fill, stroke, strokewidth)
{
	mxShape.call(this);
	this.bounds = bounds;
	this.fill = fill;
	this.stroke = stroke;
	this.strokewidth = (strokewidth != null) ? strokewidth : 1;
	this.notch = 0;
};

/**
* Extends mxShape.
*/
mxUtils.extend(mxShapeElectricalEightLineBusElbow, mxShape);

mxShapeElectricalEightLineBusElbow.prototype.cst = {
		SHAPE_EIGHT_LINE_BUS_ELBOW : 'mxgraph.electrical.transmission.eightLineBusElbow'
};

mxShapeElectricalEightLineBusElbow.prototype.customProperties = [
	{name:'notch', dispName:'Spacing', type:'float', min:0, defVal:180}
];

/**
* Function: paintVertexShape
* 
* Paints the vertex shape.
*/
mxShapeElectricalEightLineBusElbow.prototype.paintVertexShape = function(c, x, y, w, h)
{
	var notch = Math.max(0, Math.min(w, parseFloat(mxUtils.getValue(this.style, 'notch', this.notch))));

	c.translate(x, y);

	c.begin();
	c.moveTo(0, h);
	c.lineTo(w, h);
	c.lineTo(w, 0);
	c.stroke();
	
	var wn = Math.min(w, notch);
	var hn = Math.min(h, notch);
	
	c.begin();
	c.moveTo(0, h - hn);
	c.lineTo(w - wn, h - hn);
	c.lineTo(w - wn, 0);
	c.stroke();
	
	c.begin();
	c.moveTo(0, h - hn / 7);
	c.lineTo(w - wn / 7, h - hn / 7);
	c.lineTo(w - wn / 7, 0);
	c.stroke();
	
	c.begin();
	c.moveTo(0, h - hn * 2 / 7);
	c.lineTo(w - wn * 2 / 7, h - hn * 2 / 7);
	c.lineTo(w - wn * 2 / 7, 0);
	c.stroke();
	
	c.begin();
	c.moveTo(0, h - hn * 3 / 7);
	c.lineTo(w - wn * 3 / 7, h - hn * 3 / 7);
	c.lineTo(w - wn * 3 / 7, 0);
	c.stroke();
	
	c.begin();
	c.moveTo(0, h - hn * 4 / 7);
	c.lineTo(w - wn * 4 / 7, h - hn * 4 / 7);
	c.lineTo(w - wn * 4 / 7, 0);
	c.stroke();
	
	c.begin();
	c.moveTo(0, h - hn * 5 / 7);
	c.lineTo(w - wn * 5 / 7, h - hn * 5 / 7);
	c.lineTo(w - wn * 5 / 7, 0);
	c.stroke();
	
	c.begin();
	c.moveTo(0, h - hn * 6 / 7);
	c.lineTo(w - wn * 6 / 7, h - hn * 6 / 7);
	c.lineTo(w - wn * 6 / 7, 0);
	c.stroke();
	
};

mxCellRenderer.registerShape(mxShapeElectricalEightLineBusElbow.prototype.cst.SHAPE_EIGHT_LINE_BUS_ELBOW, mxShapeElectricalEightLineBusElbow);

mxShapeElectricalEightLineBusElbow.prototype.constraints = null;

Graph.handleFactory[mxShapeElectricalEightLineBusElbow.prototype.cst.SHAPE_EIGHT_LINE_BUS_ELBOW] = function(state)
{
	var handles = [Graph.createHandle(state, ['notch'], function(bounds)
	{
		var notch = Math.max(Math.min(bounds.height, parseFloat(mxUtils.getValue(this.state.style, 'notch', this.notch))), 0);

		return new mxPoint(bounds.x + bounds.width / 4, bounds.y + bounds.height - notch);
	}, function(bounds, pt)
	{
		this.state.style['notch'] = Math.round(0.2 * Math.max(0, bounds.width - pt.y + bounds.y)) / 0.2;
	})];
			
	return handles;
}

