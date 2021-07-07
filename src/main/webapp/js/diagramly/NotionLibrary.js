/**
 * Copyright (c) 2006-2021, JGraph Ltd
 * Copyright (c) 2006-2021, Gaudenz Alder
 */
NotionLibrary = function(ui, data, meta)
{
	NotionFile.call(this, ui, data, meta);
};

//Extends mxEventSource
mxUtils.extend(NotionLibrary, NotionFile);

/**
 * Overridden to avoid updating data with current file.
 */
NotionLibrary.prototype.doSave = function(title, success, error)
{
	this.saveFile(title, false, success, error);
};

/**
 * Returns the location as a new object.
 * @type mx.Point
 */
NotionLibrary.prototype.open = function()
{
	// Do nothing - this should never be called
};
