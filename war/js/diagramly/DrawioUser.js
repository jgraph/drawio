/**
 * Copyright (c) 2006-2016, JGraph Ltd
 * Copyright (c) 2006-2016, Gaudenz Alder
 */
/**
 * Constructs a new point for the optional x and y coordinates. If no
 * coordinates are given, then the default values for <x> and <y> are used.
 * @constructor
 * @class Implements a basic 2D point. Known subclassers = {@link mxRectangle}.
 * @param {number} x X-coordinate of the point.
 * @param {number} y Y-coordinate of the point.
 */
DrawioUser = function(id, email, displayName, pictureUrl)
{
	/**
	 * Holds the x-coordinate of the point.
	 * @type number
	 * @default 0
	 */
	this.id = id;
	
	/**
	 * Holds the x-coordinate of the point.
	 * @type number
	 * @default 0
	 */
	this.email = email;
	
	/**
	 * Holds the x-coordinate of the point.
	 * @type number
	 * @default 0
	 */
	this.displayName = displayName;
	
	/**
	 * Holds the x-coordinate of the point.
	 * @type number
	 * @default 0
	 */
	this.pictureUrl = pictureUrl;
};
