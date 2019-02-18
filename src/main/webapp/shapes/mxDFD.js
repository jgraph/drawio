/**
 * $Id: mxDFD.js,v 1.5 2018/26/11 12:32:06 mate Exp $
 * Copyright (c) 2006-2018, JGraph Ltd
 */
//**********************************************************************************************************************************************************
// Start
//**********************************************************************************************************************************************************
/**
* Extends mxShape.
*/
function mxShapeDFDStart(bounds, fill, stroke, strokewidth)
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
mxUtils.extend(mxShapeDFDStart, mxShape);

mxShapeDFDStart.prototype.cst = {START : 'mxgraph.dfd.start'};

/**
* Function: paintVertexShape
* 
* Paints the vertex shape.
*/
mxShapeDFDStart.prototype.paintVertexShape = function(c, x, y, w, h)
{
	c.translate(x, y);
	var r = Math.min(h * 0.5, w * 0.5);
	
	c.begin();
	c.moveTo(w - r, 0);
	c.arcTo(r, r, 0, 0, 1, w, h * 0.5);
	c.arcTo(r, r, 0, 0, 1, w - r, h);
	c.lineTo(r, h);
	c.arcTo(r, r, 0, 0, 1, 0, h * 0.5);
	c.arcTo(r, r, 0, 0, 1, r, 0);
	c.close();
	c.fillAndStroke();
};

mxCellRenderer.registerShape(mxShapeDFDStart.prototype.cst.START, mxShapeDFDStart);

mxShapeDFDStart.prototype.constraints = null;

//**********************************************************************************************************************************************************
//Archive
//**********************************************************************************************************************************************************
/**
* Extends mxShape.
*/
function mxShapeDFDArchive(bounds, fill, stroke, strokewidth)
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
mxUtils.extend(mxShapeDFDArchive, mxShape);

mxShapeDFDArchive.prototype.cst = {ARCHIVE : 'mxgraph.dfd.archive'};

/**
* Function: paintVertexShape
* 
* Paints the vertex shape.
*/
mxShapeDFDArchive.prototype.paintVertexShape = function(c, x, y, w, h)
{
	c.translate(x, y);
	var r = Math.min(h * 0.5, w * 0.5);
	
	c.begin();
	c.moveTo(0,0);
	c.lineTo(w, 0);
	c.lineTo(w * 0.5, h);
	c.close();
	c.fillAndStroke();
	
	c.setShadow(false);
	
	c.begin();
	c.moveTo(w * 0.1, h * 0.2);
	c.lineTo(w * 0.9, h * 0.2);
	c.stroke();
};

mxCellRenderer.registerShape(mxShapeDFDArchive.prototype.cst.ARCHIVE, mxShapeDFDArchive);

mxShapeDFDArchive.prototype.constraints = null;

//**********************************************************************************************************************************************************
//Check2
//**********************************************************************************************************************************************************
/**
* Extends mxShape.
*/
function mxShapeDFDCheck2(bounds, fill, stroke, strokewidth)
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
mxUtils.extend(mxShapeDFDCheck2, mxShape);

mxShapeDFDCheck2.prototype.cst = {CHECK2 : 'mxgraph.dfd.check2'};

/**
* Function: paintVertexShape
* 
* Paints the vertex shape.
*/
mxShapeDFDCheck2.prototype.paintVertexShape = function(c, x, y, w, h)
{
	c.translate(x, y);
	var size = Math.min(h * 0.5, w * 0.5);
	
	c.begin();
	c.moveTo(0, h * 0.5);
	c.lineTo(size, 0);
	c.lineTo(w - size, 0);
	c.lineTo(w, h * 0.5);
	c.lineTo(w - size, h);
	c.lineTo(size, h);
	c.lineTo(0, h * 0.5);
	c.close();
	c.fillAndStroke();
	
	c.setShadow(false);
	
	c.begin();
	c.moveTo(w - size, 0);
	c.lineTo(w - 2 * size, h * 0.5);
	c.lineTo(w - size, h);
	c.stroke();
};

mxCellRenderer.registerShape(mxShapeDFDCheck2.prototype.cst.CHECK2, mxShapeDFDCheck2);

mxShapeDFDCheck2.prototype.constraints = null;

//**********************************************************************************************************************************************************
//Data Store with ID
//**********************************************************************************************************************************************************
/**
* Extends mxShape.
*/
function mxShapeDFDDataStoreID(bounds, fill, stroke, strokewidth)
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
mxUtils.extend(mxShapeDFDDataStoreID, mxShape);

mxShapeDFDDataStoreID.prototype.cst = {DATA_STORE_ID : 'mxgraph.dfd.dataStoreID'};

/**
* Function: paintVertexShape
* 
* Paints the vertex shape.
*/
mxShapeDFDDataStoreID.prototype.paintVertexShape = function(c, x, y, w, h)
{
	c.translate(x, y);
	var size = Math.min(h * 0.5, w * 0.5);
	
	c.begin();
	c.moveTo(w, h);
	c.lineTo(0, h);
	c.lineTo(0, 0);
	c.lineTo(w, 0);
	c.stroke();
	
	c.setShadow(false);
	
	var s = Math.min(30, w);
	
	c.begin();
	c.moveTo(s, 0);
	c.lineTo(s, h);
	c.stroke();
};

mxCellRenderer.registerShape(mxShapeDFDDataStoreID.prototype.cst.DATA_STORE_ID, mxShapeDFDDataStoreID);

mxShapeDFDDataStoreID.prototype.constraints = null;

//**********************************************************************************************************************************************************
//External Entity
//**********************************************************************************************************************************************************
/**
* Extends mxShape.
*/
function mxShapeDFDExternalEntity(bounds, fill, stroke, strokewidth)
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
mxUtils.extend(mxShapeDFDExternalEntity, mxShape);

mxShapeDFDExternalEntity.prototype.cst = {EXTERNAL_ENTITY : 'mxgraph.dfd.externalEntity'};

/**
* Function: paintVertexShape
* 
* Paints the vertex shape.
*/
mxShapeDFDExternalEntity.prototype.paintVertexShape = function(c, x, y, w, h)
{
	c.translate(x, y);
	var size = 10;
	
	c.begin();
	c.moveTo(0, 0);
	c.lineTo(w - size, 0);
	c.lineTo(w, size);
	c.lineTo(w, h);
	c.lineTo(size, h);
	c.lineTo(0, h - size);
	c.close();
	c.fillAndStroke();
	
	c.setShadow(false);


	c.setFillColor('#000000');
	c.setAlpha(0.5);
	
	c.begin();
	c.moveTo(0, 0);
	c.lineTo(w - size, 0);
	c.lineTo(w, size);
	c.lineTo(size, size);
	c.lineTo(size, h);
	c.lineTo(0, h - size);
	c.close();
	c.fill();

	var opacity = parseFloat(mxUtils.getValue(this.style, 'opacity', '100'));

	c.setAlpha(opacity / 100);
	
	c.begin();
	c.moveTo(0, 0);
	c.lineTo(w - size, 0);
	c.lineTo(w, size);
	c.lineTo(w, h);
	c.lineTo(size, h);
	c.lineTo(0, h - size);
	c.close();
	c.moveTo(size, h);
	c.lineTo(size, size);
	c.lineTo(w, size);
	c.moveTo(0, 0);
	c.lineTo(size, size);
	c.stroke();
};

mxCellRenderer.registerShape(mxShapeDFDExternalEntity.prototype.cst.EXTERNAL_ENTITY, mxShapeDFDExternalEntity);

mxShapeDFDExternalEntity.prototype.constraints = null;

//**********************************************************************************************************************************************************
//Loop
//**********************************************************************************************************************************************************
/**
* Extends mxShape.
*/
function mxShapeDFDLoop(bounds, fill, stroke, strokewidth)
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
mxUtils.extend(mxShapeDFDLoop, mxShape);

mxShapeDFDLoop.prototype.cst = {LOOP : 'mxgraph.dfd.loop'};

/**
* Function: paintVertexShape
* 
* Paints the vertex shape.
*/
mxShapeDFDLoop.prototype.paintVertexShape = function(c, x, y, w, h)
{
	c.translate(x, y);
	var r = Math.min(h * 0.8, w * 0.8);
	
	c.begin();
	c.moveTo(w - r * 0.25, 0);
	c.arcTo(r, r, 0, 0, 1, w - r * 0.25, h);
	c.lineTo(r * 0.25, h);
	c.arcTo(r, r, 0, 0, 1, r * 0.25, 0);
	c.close();
	c.fillAndStroke();
};

mxCellRenderer.registerShape(mxShapeDFDLoop.prototype.cst.LOOP, mxShapeDFDLoop);

mxShapeDFDLoop.prototype.constraints = null;

