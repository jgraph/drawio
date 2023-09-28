/**
 * Copyright (c) 2006-2015, JGraph Ltd
 * Copyright (c) 2006-2015, Gaudenz Alder
 */
/**
 * Class: mxDictionary
 *
 * A wrapper class for an associative array with object keys. Note: This
 * implementation uses <mxObjectIdentitiy> to turn object keys into strings.
 * 
 * Constructor: mxEventSource
 *
 * Constructs a new dictionary which allows object to be used as keys.
 */
function mxDictionary()
{
	this.clear();
};

/**
 * Function: map
 *
 * Stores the (key, value) pairs in this dictionary.
 */
mxDictionary.prototype.map = null;

/**
 * Function: clear
 *
 * Clears the dictionary.
 */
mxDictionary.prototype.clear = function()
{
	this.map = {};
};

/**
 * Function: get
 *
 * Returns the value for the given key.
 */
mxDictionary.prototype.get = function(key)
{
	var id = mxObjectIdentity.get(key);
	
	return this.map[id];
};

/**
 * Function: put
 *
 * Stores the value under the given key and returns the previous
 * value for that key.
 */
mxDictionary.prototype.put = function(key, value)
{
	var id = mxObjectIdentity.get(key);
	var previous = this.map[id];
	this.map[id] = value;
	
	return previous;
};

/**
 * Function: remove
 *
 * Removes the value for the given key and returns the value that
 * has been removed.
 */
mxDictionary.prototype.remove = function(key)
{
	var id = mxObjectIdentity.get(key);
	var previous = this.map[id];
	delete this.map[id];
	
	return previous;
};

/**
 * Function: getCount
 *
 * Returns the number of objects in this dictionary.
 */
mxDictionary.prototype.getCount = function()
{
	var count = 0;

	for (var key in this.map)
	{
		count++;
	}

	return count;
};

/**
 * Function: getKeys
 *
 * Returns all keys as an array.
 */
mxDictionary.prototype.getKeys = function()
{
	var result = [];
	
	for (var key in this.map)
	{
		result.push(key);
	}
	
	return result;
};

/**
 * Function: getValues
 *
 * Returns all values as an array.
 */
mxDictionary.prototype.getValues = function()
{
	var result = [];
	
	for (var key in this.map)
	{
		result.push(this.map[key]);
	}
	
	return result;
};

/**
 * Function: visit
 *
 * Visits all entries in the dictionary using the given function with the
 * following signature: function(key, value) where key is a string and
 * value is an object.
 * 
 * Parameters:
 * 
 * visitor - A function that takes the key and value as arguments.
 */
mxDictionary.prototype.visit = function(visitor)
{
	for (var key in this.map)
	{
		visitor(key, this.map[key]);
	}
};
