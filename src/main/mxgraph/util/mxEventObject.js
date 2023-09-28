/**
 * Copyright (c) 2006-2015, JGraph Ltd
 * Copyright (c) 2006-2015, Gaudenz Alder
 */
/**
 * Class: mxEventObject
 * 
 * The mxEventObject is a wrapper for all properties of a single event.
 * Additionally, it also offers functions to consume the event and check if it
 * was consumed as follows:
 * 
 * (code)
 * evt.consume();
 * INV: evt.isConsumed() == true
 * (end)
 * 
 * Constructor: mxEventObject
 *
 * Constructs a new event object with the specified name. An optional
 * sequence of key, value pairs can be appended to define properties.
 * 
 * Example:
 *
 * (code)
 * new mxEventObject("eventName", key1, val1, .., keyN, valN)
 * (end)
 */
function mxEventObject(name)
{
	this.name = name;
	this.properties = [];
	
	for (var i = 1; i < arguments.length; i += 2)
	{
		if (arguments[i + 1] != null)
		{
			this.properties[arguments[i]] = arguments[i + 1];
		}
	}
};

/**
 * Variable: name
 *
 * Holds the name.
 */
mxEventObject.prototype.name = null;

/**
 * Variable: properties
 *
 * Holds the properties as an associative array.
 */
mxEventObject.prototype.properties = null;

/**
 * Variable: consumed
 *
 * Holds the consumed state. Default is false.
 */
mxEventObject.prototype.consumed = false;

/**
 * Function: getName
 * 
 * Returns <name>.
 */
mxEventObject.prototype.getName = function()
{
	return this.name;
};

/**
 * Function: getProperties
 * 
 * Returns <properties>.
 */
mxEventObject.prototype.getProperties = function()
{
	return this.properties;
};

/**
 * Function: getProperty
 * 
 * Returns the property for the given key.
 */
mxEventObject.prototype.getProperty = function(key)
{
	return this.properties[key];
};

/**
 * Function: isConsumed
 *
 * Returns true if the event has been consumed.
 */
mxEventObject.prototype.isConsumed = function()
{
	return this.consumed;
};

/**
 * Function: consume
 *
 * Consumes the event.
 */
mxEventObject.prototype.consume = function()
{
	this.consumed = true;
};
