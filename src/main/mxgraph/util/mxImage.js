/**
 * Copyright (c) 2006-2015, JGraph Ltd
 * Copyright (c) 2006-2015, Gaudenz Alder
 */
/**
 * Class: mxImage
 *
 * Contains the URL, width, height and optional position of an image.
 * 
 * Constructor: mxImage
 * 
 * Constructs a new image.
 */
function mxImage(src, width, height, x, y)
{
	this.src = src;
	this.width = (width != null) ? width : this.width;
	this.height = (height != null) ? height : this.height;
	this.x = (x != null) ? x : this.x;
	this.y = (y != null) ? y : this.y;
};

/**
 * Variable: src
 *
 * String that specifies the URL of the image.
 */
mxImage.prototype.src = null;

/**
 * Variable: width
 *
 * Integer that specifies the width of the image.
 */
mxImage.prototype.width = 0;

/**
 * Variable: height
 *
 * Integer that specifies the height of the image.
 */
mxImage.prototype.height = 0;

/**
 * Variable: x
 *
 * Integer that specifies the x-coordinate of the image.
 */
 mxImage.prototype.x = 0;

 /**
  * Variable: y
  *
  * Integer that specifies the y-coordinate of the image.
  */
 mxImage.prototype.y = 0;
 