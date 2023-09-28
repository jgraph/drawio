/**
 * Copyright (c) 2006-2015, JGraph Ltd
 * Copyright (c) 2006-2015, Gaudenz Alder
 */
var mxObjectIdentity =
{
	/**
	 * Class: mxObjectIdentity
	 * 
	 * Identity for JavaScript objects and functions. This is implemented using
	 * a simple incrementing counter which is stored in each object under
	 * <FIELD_NAME>.
	 * 
	 * The identity for an object does not change during its lifecycle.
	 * 
	 * Variable: FIELD_NAME
	 * 
	 * Name of the field to be used to store the object ID. Default is
	 * <code>mxObjectId</code>.
	 */
	FIELD_NAME: 'mxObjectId',

	/**
	 * Variable: counter
	 * 
	 * Current counter.
	 */
	counter: 0,

	/**
	 * Function: get
	 * 
	 * Returns the ID for the given object or function or null if no object
	 * is specified.
	 */
	get: function(obj)
	{
		if (obj != null)
		{
			if (obj[mxObjectIdentity.FIELD_NAME] == null)
			{
				if (typeof obj === 'object')
				{
					var ctor = mxUtils.getFunctionName(obj.constructor);
					obj[mxObjectIdentity.FIELD_NAME] = ctor + '#' + mxObjectIdentity.counter++;
				}
				else if (typeof obj === 'function')
				{
					obj[mxObjectIdentity.FIELD_NAME] = 'Function#' + mxObjectIdentity.counter++;
				}
			}
			
			return obj[mxObjectIdentity.FIELD_NAME];
		}
		
		return null;
	},

	/**
	 * Function: clear
	 * 
	 * Deletes the ID from the given object or function.
	 */
	clear: function(obj)
	{
		if (typeof(obj) === 'object' || typeof obj === 'function')
		{
			delete obj[mxObjectIdentity.FIELD_NAME];
		}
	}

};
