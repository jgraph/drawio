/**
 * Copyright (c) 2006-2017, JGraph Holdings Ltd
 * Copyright (c) 2006-2017, draw.io AG
 */
DropboxLibrary = function(ui, data, stat)
{
	DropboxFile.call(this, ui, data, stat);
};

//Extends mxEventSource
mxUtils.extend(DropboxLibrary, DropboxFile);

/**
 * Returns true to enable autosave for libraries.
 */
DropboxLibrary.prototype.isAutosave = function()
{
	return true;
};

/**
 * Overridden to avoid updating data with current file.
 */
DropboxLibrary.prototype.doSave = function(title, success, error)
{
	this.saveFile(title, false, success, error);
};

/**
 * Does nothing since libraries are not opened as diagrams.
 */
DropboxLibrary.prototype.open = function()
{
	// Do nothing - this should never be called
};
