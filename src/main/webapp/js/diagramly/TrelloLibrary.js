/**
 * Copyright (c) 2006-2017, JGraph Holdings Ltd
 * Copyright (c) 2006-2017, draw.io AG
 */
TrelloLibrary = function(ui, data, meta)
{
	TrelloFile.call(this, ui, data, meta);
};

//Extends mxEventSource
mxUtils.extend(TrelloLibrary, TrelloFile);

/**
 * Overridden to avoid updating data with current file.
 */
TrelloLibrary.prototype.doSave = function(title, success, error)
{
	this.saveFile(title, false, success, error);
};

/**
 * Does nothing since libraries are not opened as diagrams.
 */
TrelloLibrary.prototype.open = function()
{
	// Do nothing - this should never be called
};
