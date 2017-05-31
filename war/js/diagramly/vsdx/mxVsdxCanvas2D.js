/**
 * Copyright (c) 2006-2017, JGraph Ltd
 */
/**
 * Class: mxVsdxCanvas2D
 *
 * Constructor: mxVsdxCanvas2D
 *
 * Constructs a new abstract canvas.
 */
function mxVsdxCanvas2D(zip)
{
	mxAbstractCanvas2D.call(this);
};

/**
 * Extends mxAbstractCanvas2D
 */
mxUtils.extend(mxVsdxCanvas2D, mxAbstractCanvas2D);


/**
 * Variable: textEnabled
 * 
 * Specifies if text output should be enabled. Default is true.
 */
mxVsdxCanvas2D.prototype.textEnabled = true;

/**
 * Function: init
 *  
 * Initialize the canvas for a new vsdx file.
 */
mxVsdxCanvas2D.prototype.init = function (zip)
{
	this.filesLoading = 0;
	this.zip = zip;
};

/**
 * Function: createGeoSec
 *  
 * Create a new geo section.
 */
mxVsdxCanvas2D.prototype.createGeoSec = function ()
{
	if (this.geoSec != null)
	{
		this.shape.appendChild(this.geoSec);
	}
	
	var geoSec = this.xmlDoc.createElement("Section");
	
	geoSec.setAttribute("N", "Geometry");
	geoSec.setAttribute("IX", this.geoIndex++);
	
	this.geoSec = geoSec;
	this.geoStepIndex = 1;
	this.lastX = 0;
	this.lastY = 0;
	this.lastMoveToX = 0;
	this.lastMoveToY = 0;
};


/**
 * Function: newShape
 *  
 * Create a new shape.
 */
mxVsdxCanvas2D.prototype.newShape = function (shape, cellState, xmlDoc)
{
	this.geoIndex = 0;
	this.shape = shape;
	this.cellState = cellState;
	this.xmGeo = cellState.cell.geometry;
	this.xmlDoc = xmlDoc;
	this.geoSec = null;
	this.shapeImg = null;
	this.shapeType = "Shape";
	
	this.createGeoSec();
};

/**
 * Function: endShape
 *  
 * End current shape.
 */
mxVsdxCanvas2D.prototype.endShape = function ()
{
	if (this.shapeImg != null)
	{
		this.addForeignData(this.shapeImg.type, this.shapeImg.id);
	}
};


/**
 * Function: newPage
 *  
 * Start a new page.
 */
mxVsdxCanvas2D.prototype.newPage = function ()
{
	this.images = [];
};

/**
 * Function: newPage
 *  
 * Start a new page.
 */
mxVsdxCanvas2D.prototype.getShapeType = function ()
{
	return this.shapeType;
};

/**
 * Function: getShapeGeo
 *  
 * return the current geo section.
 */
mxVsdxCanvas2D.prototype.getShapeGeo = function ()
{
	return this.geoSec;
};

/**
 * Function: createCellElemScaled
 * 
 * Creates a cell element and scale the value.
 */
mxVsdxCanvas2D.prototype.createCellElemScaled = function (name, val, formula)
{
	return this.createCellElem(name, val / VsdxExport.prototype.CONVERSION_FACTOR, formula);
};

/**
 * Function: createCellElem
 * 
 * Creates a cell element.
 */
mxVsdxCanvas2D.prototype.createCellElem = function (name, val, formula)
{
	var cell = this.xmlDoc.createElement("Cell");
	cell.setAttribute("N", name);
	cell.setAttribute("V", val);
	
	if (formula) cell.setAttribute("F", formula);

	return cell;
};

mxVsdxCanvas2D.prototype.createRowRel = function(type, index, x, y, a, b, c , d) 
{
	var row = this.xmlDoc.createElement("Row");
	row.setAttribute("T", type);
	row.setAttribute("IX", index);
	row.appendChild(this.createCellElem("X", x));
	row.appendChild(this.createCellElem("Y", y));
	
	if (a != null) row.appendChild(this.createCellElem("A", a));
	if (b != null) row.appendChild(this.createCellElem("B", b));
	if (c != null) row.appendChild(this.createCellElem("C", c));
	if (d != null) row.appendChild(this.createCellElem("D", d));
	
	return row;
};


/**
 * Function: begin
 * 
 * Extends superclass to create path.
 */
mxVsdxCanvas2D.prototype.begin = function()
{
	if (this.geoStepIndex > 1)	this.createGeoSec();
};

/**
 * Function: rect
 * 
 * Private helper function to create SVG elements
 */
mxVsdxCanvas2D.prototype.rect = function(x, y, w, h)
{
	if (this.geoStepIndex > 1)	this.createGeoSec();
	
	var s = this.state;
	w = w * s.scale;
	h = h * s.scale;

	var geo = this.xmGeo;
	x = ((x - geo.x + s.dx) * s.scale) /w;
	y = ((geo.height - y + geo.y - s.dy) * s.scale) /h;

	this.geoSec.appendChild(this.createRowRel("RelMoveTo", this.geoStepIndex++, x, y));
	this.geoSec.appendChild(this.createRowRel("RelLineTo", this.geoStepIndex++, x + 1, y));
	this.geoSec.appendChild(this.createRowRel("RelLineTo", this.geoStepIndex++, x + 1, y - 1));
	this.geoSec.appendChild(this.createRowRel("RelLineTo", this.geoStepIndex++, x, y - 1));
	this.geoSec.appendChild(this.createRowRel("RelLineTo", this.geoStepIndex++, x, y));	
};

/**
 * Function: roundrect
 * 
 * Private helper function to create SVG elements
 */
mxVsdxCanvas2D.prototype.roundrect = function(x, y, w, h, dx, dy)
{
	this.rect(x, y, w, h);
	//TODO this assume dx and dy are equal and only one rounding is needed
	this.shape.appendChild(this.createCellElemScaled("Rounding", dx));
};

/**
 * Function: ellipse
 * 
 * Private helper function to create SVG elements
 */
mxVsdxCanvas2D.prototype.ellipse = function(x, y, w, h)
{
	if (this.geoStepIndex > 1)	this.createGeoSec();
	
	var s = this.state;
	w = w * s.scale;
	h = h * s.scale;
	
	var geo = this.xmGeo;
	var gh = geo.height * s.scale;
	var gw = geo.width * s.scale;
	x = (x - geo.x + s.dx) * s.scale;
	y = gh + (-y + geo.y - s.dy) * s.scale;

	var hr = h/gh;
	var wr = w/gw;
	
	this.geoSec.appendChild(this.createRowRel("RelMoveTo", this.geoStepIndex++, x/gw, y/gh - hr * 0.5));
	
	var row = this.createRowRel("RelEllipticalArcTo", this.geoStepIndex++, x/gw, y/gh - hr * 0.5001, wr * 0.5 + x/gw, y/gh - hr, 0);
	row.appendChild(this.createCellElem("D", w/h, "Width/Height*"+(wr/hr)));
	this.geoSec.appendChild(row);
};

/**
 * Function: moveTo
 * 
 * Moves the current path the given point.
 * 
 * Parameters:
 * 
 * x - Number that represents the x-coordinate of the point.
 * y - Number that represents the y-coordinate of the point.
 */
mxVsdxCanvas2D.prototype.moveTo = function(x, y)
{
	this.lastMoveToX = x;
	this.lastMoveToY = y;
	this.lastX = x;
	this.lastY = y;	

	var geo = this.xmGeo;
	var s = this.state;
	x = (x - geo.x + s.dx) * s.scale;
	y = (geo.height - y + geo.y - s.dy) * s.scale;
	var h = geo.height * s.scale;
	var w = geo.width * s.scale;

	this.geoSec.appendChild(this.createRowRel("RelMoveTo", this.geoStepIndex++, x/w, y/h));
};

/**
 * Function: lineTo
 * 
 * Draws a line to the given coordinates.
 * 
 * Parameters:
 * 
 * x - Number that represents the x-coordinate of the endpoint.
 * y - Number that represents the y-coordinate of the endpoint.
 */
mxVsdxCanvas2D.prototype.lineTo = function(x, y)
{
	this.lastX = x;
	this.lastY = y;	

	var geo = this.xmGeo;
	var s = this.state;
	x = (x - geo.x + s.dx) * s.scale;
	y = (geo.height - y + geo.y - s.dy) * s.scale;
	var h = geo.height * s.scale;
	var w = geo.width * s.scale;

	this.geoSec.appendChild(this.createRowRel("RelLineTo", this.geoStepIndex++, x/w, y/h));
};

/**
 * Function: quadTo
 * 
 * Adds a quadratic curve to the current path.
 * 
 * Parameters:
 * 
 * x1 - Number that represents the x-coordinate of the control point.
 * y1 - Number that represents the y-coordinate of the control point.
 * x2 - Number that represents the x-coordinate of the endpoint.
 * y2 - Number that represents the y-coordinate of the endpoint.
 */
mxVsdxCanvas2D.prototype.quadTo = function(x1, y1, x2, y2)
{
	this.lastX = x2;
	this.lastY = y2;	

	var s = this.state;
	var geo = this.xmGeo;

	var h = geo.height * s.scale;
	var w = geo.width * s.scale;

	x1 = (x1 - geo.x + s.dx) * s.scale;
	y1 = (geo.height - y1 + geo.y - s.dy) * s.scale;

	x2 = (x2 - geo.x + s.dx) * s.scale;
	y2 = (geo.height - y2 + geo.y - s.dy) * s.scale;

	x1 = x1 / w;
	y1 = y1 / h;
	x2 = x2 / w;
	y2 = y2 / h;

	this.geoSec.appendChild(this.createRowRel("RelQuadBezTo", this.geoStepIndex++, x2, y2, x1, y1));
};

/**
 * Function: curveTo
 * 
 * Adds a bezier curve to the current path.
 * 
 * Parameters:
 * 
 * x1 - Number that represents the x-coordinate of the first control point.
 * y1 - Number that represents the y-coordinate of the first control point.
 * x2 - Number that represents the x-coordinate of the second control point.
 * y2 - Number that represents the y-coordinate of the second control point.
 * x3 - Number that represents the x-coordinate of the endpoint.
 * y3 - Number that represents the y-coordinate of the endpoint.
 */
mxVsdxCanvas2D.prototype.curveTo = function(x1, y1, x2, y2, x3, y3)
{
	this.lastX = x3;
	this.lastY = y3;	

	var s = this.state;
	var geo = this.xmGeo;

	var h = geo.height * s.scale;
	var w = geo.width * s.scale;

	x1 = (x1 - geo.x + s.dx) * s.scale;
	y1 = (geo.height - y1 + geo.y - s.dy) * s.scale;

	x2 = (x2 - geo.x + s.dx) * s.scale;
	y2 = (geo.height - y2 + geo.y - s.dy) * s.scale;

	x3 = (x3 - geo.x + s.dx) * s.scale;
	y3 = (geo.height - y3 + geo.y - s.dy) * s.scale;

	x1 = x1 / w;
	y1 = y1 / h;
	x2 = x2 / w;
	y2 = y2 / h;
	x3 = x3 / w;
	y3 = y3 / h;

	this.geoSec.appendChild(this.createRowRel("RelCubBezTo", this.geoStepIndex++, x3, y3, x1, y1, x2, y2));
};

/**
 * Function: close
 * 
 * Closes the current path.
 */
mxVsdxCanvas2D.prototype.close = function()
{
	//Closing with a line if last point != last MoveTo point
	if (this.lastMoveToX != this.lastX || this.lastMoveToY != this.lastY)
		this.lineTo(this.lastMoveToX, this.lastMoveToY);
};

/**
 * Function: addForeignData
 * 
 * Add ForeignData to current shape using last image in the images array
 */
mxVsdxCanvas2D.prototype.addForeignData = function(type, index) 
{
	var foreignData = this.xmlDoc.createElement("ForeignData");
	foreignData.setAttribute("ForeignType", "Bitmap");
	
	type = type.toUpperCase();
	
	if (type != "BMP")
		foreignData.setAttribute("CompressionType", type);
	
	var rel = this.xmlDoc.createElement("Rel");
	rel.setAttribute("r:id", "rId" + index);
	
	
	foreignData.appendChild(rel);
	this.shape.appendChild(foreignData);
	this.shapeType = "Foreign";
};

/**
 * Function: image
 * 
 * Add image to vsdx file as a media (Foreign Object)
 */
mxVsdxCanvas2D.prototype.image = function(x, y, w, h, src, aspect, flipH, flipV)
{
	//TODO image reusing, if the same image is used more than once, reuse it. Applicable for URLs specifically (but can also be applied to embedded ones)
	var imgName = "image" + (this.images.length + 1) + "."; 
	var type;
	if (src.indexOf("data:") == 0)
	{
		var p = src.indexOf("base64,");
		var base64 = src.substring(p + 7); //7 is the length of "base64,"
		type = src.substring(11, p-1); //5 is the length of "data:image/"
		imgName += type;
		this.zip.file("visio/media/" + imgName, base64, {base64: true});
	}
	else if (window.XMLHttpRequest) //URL src, fetch it
	{
		src = this.converter.convert(src);
		this.filesLoading++;
		var that = this;
		
		var p = src.lastIndexOf(".");
		type = src.substring(p+1);
		imgName += type;
		
		//The old browsers binary workaround doesn't work with jszip and converting to base64 encoding doesn't work also
		var xhr = new XMLHttpRequest();
		xhr.open('GET', src, true);
		xhr.responseType = 'arraybuffer';
		xhr.onreadystatechange = function(e) 
		{
		    if (this.readyState == 4 && this.status == 200) {
		    	that.zip.file("visio/media/" + imgName, this.response);
		    	that.filesLoading--;
		    }
		};
		xhr.send();
	}

	this.images.push(imgName);
	
	//TODO can a shape has more than one image?
	this.shapeImg = {type: type, id: this.images.length};

	//TODO support these!
	aspect = (aspect != null) ? aspect : true;
	flipH = (flipH != null) ? flipH : false;
	flipV = (flipV != null) ? flipV : false;

	var s = this.state;
	w = w * s.scale;
	h = h * s.scale;
	
	var geo = this.xmGeo;
	x = (x - geo.x + s.dx) * s.scale;
	y = (geo.height - y + geo.y - s.dy) * s.scale;

	this.shape.appendChild(this.createCellElemScaled("ImgOffsetX", x));
	this.shape.appendChild(this.createCellElemScaled("ImgOffsetY", y - h));
	this.shape.appendChild(this.createCellElemScaled("ImgWidth", w));
	this.shape.appendChild(this.createCellElemScaled("ImgHeight", h));
	
//	var s = this.state;
//	x += s.dx;
//	y += s.dy;
//	
//	if (s.alpha < 1 || s.fillAlpha < 1)
//	{
//		node.setAttribute('opacity', s.alpha * s.fillAlpha);
//	}
//	
//	var tr = this.state.transform || '';
//	
//	if (flipH || flipV)
//	{
//		var sx = 1;
//		var sy = 1;
//		var dx = 0;
//		var dy = 0;
//		
//		if (flipH)
//		{
//			sx = -1;
//			dx = -w - 2 * x;
//		}
//		
//		if (flipV)
//		{
//			sy = -1;
//			dy = -h - 2 * y;
//		}
//		
//		// Adds image tansformation to existing transform
//		tr += 'scale(' + sx + ',' + sy + ')translate(' + (dx * s.scale) + ',' + (dy * s.scale) + ')';
//	}
//
//	if (tr.length > 0)
//	{
//		node.setAttribute('transform', tr);
//	}
//	
//	if (!this.pointerEvents)
//	{
//		node.setAttribute('pointer-events', 'none');
//	}
};

/**
 * Function: text
 * 
 * Paints the given text. Possible values for format are empty string for
 * plain text and html for HTML markup. Background and border color as well
 * as clipping is not available in plain text labels for VML. HTML labels
 * are not available as part of shapes with no foreignObject support in SVG
 * (eg. IE9, IE10).
 * 
 * Parameters:
 * 
 * x - Number that represents the x-coordinate of the text.
 * y - Number that represents the y-coordinate of the text.
 * w - Number that represents the available width for the text or 0 for automatic width.
 * h - Number that represents the available height for the text or 0 for automatic height.
 * str - String that specifies the text to be painted.
 * align - String that represents the horizontal alignment.
 * valign - String that represents the vertical alignment.
 * wrap - Boolean that specifies if word-wrapping is enabled. Requires w > 0.
 * format - Empty string for plain text or 'html' for HTML markup.
 * overflow - Specifies the overflow behaviour of the label. Requires w > 0 and/or h > 0.
 * clip - Boolean that specifies if the label should be clipped. Requires w > 0 and/or h > 0.
 * rotation - Number that specifies the angle of the rotation around the anchor point of the text.
 * dir - Optional string that specifies the text direction. Possible values are rtl and lrt.
 */
mxVsdxCanvas2D.prototype.text = function(x, y, w, h, str, align, valign, wrap, format, overflow, clip, rotation, dir)
{
	if (this.textEnabled && str != null)
	{
		if (mxUtils.isNode(str))
		{
			str = mxUtils.getOuterHtml(str);
		}

		//TODO support HTML text formatting and remaining attributes
		if (this.cellState.style['html'] == '1')
    	{
    		if (mxUtils.getValue(this.cellState.style, 'nl2Br', '1') != '0')
			{
				// Removes newlines from HTML and converts breaks to newlines
				// to match the HTML output in plain text
    			str = str.replace(/\n/g, '').replace(/<br\s*.?>/g, '\n');
			}
    		
    		// Removes HTML tags
			if (this.html2txtDiv == null)
				this.html2txtDiv = document.createElement('div');
			
			this.html2txtDiv.innerHTML = str;
			str = mxUtils.extractTextWithWhitespace(this.html2txtDiv.childNodes);
    	}
		
		var s = this.state;
		var geo = this.xmGeo;

		var strRect;
//		if (h == 0 || w == 0)
//		{
//			strRect = mxUtils.getSizeForString(str);
//		}
		
//		h = h > 0 ? h : strRect.height; 
//		w = w > 0 ? w : strRect.width;
		h = h > 0 ? h : geo.height; 
		w = w > 0 ? w : geo.width;
		w = w * s.scale;
		h = h * s.scale;
		
		x = (x - geo.x + s.dx) * s.scale;
		y = (geo.height - y + geo.y - s.dy) * s.scale;

		var hw = w/2, hh = h/2;
		this.shape.appendChild(this.createCellElemScaled("TxtPinX", x));
		this.shape.appendChild(this.createCellElemScaled("TxtPinY", y));
		this.shape.appendChild(this.createCellElemScaled("TxtWidth", w));
		this.shape.appendChild(this.createCellElemScaled("TxtHeight", h));
		this.shape.appendChild(this.createCellElemScaled("TxtLocPinX", hw));
		this.shape.appendChild(this.createCellElemScaled("TxtLocPinY", hh));

		if (rotation != 0)
			this.shape.appendChild(this.createCellElemScaled("TxtAngle", (360 - rotation) * Math.PI / 180));
		
		var text = this.xmlDoc.createElement("Text");
		text.textContent = str + "\n";
		this.shape.appendChild(text);
//		
//		var elem = this.createElement('text');
//		elem.setAttribute('x', this.format(x));
//		elem.setAttribute('y', this.format(y));
//		elem.setAttribute('w', this.format(w));
//		elem.setAttribute('h', this.format(h));
//		elem.setAttribute('str', str);
//		
//		if (align != null)
//		{
//			elem.setAttribute('align', align);
//		}
//		
//		if (valign != null)
//		{
//			elem.setAttribute('valign', valign);
//		}
//		
//		elem.setAttribute('wrap', (wrap) ? '1' : '0');
//		
//		if (format == null)
//		{
//			format = '';
//		}
//		
//		elem.setAttribute('format', format);
//		
//		if (overflow != null)
//		{
//			elem.setAttribute('overflow', overflow);
//		}
//		
//		if (clip != null)
//		{
//			elem.setAttribute('clip', (clip) ? '1' : '0');
//		}
//		
//		if (rotation != null)
//		{
//			elem.setAttribute('rotation', rotation);
//		}
//		
//		if (dir != null)
//		{
//			elem.setAttribute('dir', dir);
//		}
//		
//		this.root.appendChild(elem);
	}
};

/**
 * Function: rotate
 * 
 * Sets the rotation of the canvas. Note that rotation cannot be concatenated.
 */
mxVsdxCanvas2D.prototype.rotate = function(theta, flipH, flipV, cx, cy)
{
	//Vsdx has flipX/Y support separate from rotation
	if (theta != 0)
	{
		var s = this.state;
		cx += s.dx;
		cy += s.dy;
	
		cx *= s.scale;
		cy *= s.scale;

		this.shape.appendChild(this.createCellElem("Angle", (360 - theta) * Math.PI / 180));
		
		s.rotation = s.rotation + theta;
		s.rotationCx = cx;
		s.rotationCy = cy;
	}
};


/**
 * Function: stroke
 * 
 * Paints the outline of the current drawing buffer.
 */
mxVsdxCanvas2D.prototype.stroke = function()
{
	this.geoSec.appendChild(this.createCellElem("NoFill", "1"));
	this.geoSec.appendChild(this.createCellElem("NoLine", "0"));
};

/**
 * Function: fill
 * 
 * Fills the current drawing buffer.
 */
mxVsdxCanvas2D.prototype.fill = function()
{
	this.geoSec.appendChild(this.createCellElem("NoFill", "0"));
	this.geoSec.appendChild(this.createCellElem("NoLine", "1"));
};

/**
 * Function: fillAndStroke
 * 
 * Fills the current drawing buffer and its outline.
 */
mxVsdxCanvas2D.prototype.fillAndStroke = function()
{
	this.geoSec.appendChild(this.createCellElem("NoFill", "0"));
	this.geoSec.appendChild(this.createCellElem("NoLine", "0"));
};
