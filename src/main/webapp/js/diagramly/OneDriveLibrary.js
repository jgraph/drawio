/**
 * Copyright (c) 2006-2017, JGraph Ltd
 * Copyright (c) 2006-2017, Gaudenz Alder
 */
OneDriveLibrary = function(ui, data, meta)
{
	OneDriveFile.call(this, ui, data, meta);
};

//Extends mxEventSource
mxUtils.extend(OneDriveLibrary, OneDriveFile);

/**
 * Translates this point by the given vector.
 * 
 * @param {number} dx X-coordinate of the translation.
 * @param {number} dy Y-coordinate of the translation.
 */
OneDriveLibrary.prototype.isAutosave = function()
{
	return true;
};

/**
 * Overridden to avoid updating data with current file.
 */
OneDriveLibrary.prototype.doSave = function(title, success, error)
{
	this.saveFile(title, false, success, error);
};

/**
 * Returns the location as a new object.
 * @type mx.Point
 */
OneDriveLibrary.prototype.open = function()
{
	// Do nothing - this should never be called
};
