/**
 * Copyright (c) 2006-2017, JGraph Holdings Ltd
 * Copyright (c) 2006-2017, draw.io AG
 */
GitLabLibrary = function(ui, data, meta)
{
	GitLabFile.call(this, ui, data, meta);
};

//Extends mxEventSource
mxUtils.extend(GitLabLibrary, GitLabFile);

/**
 * Overridden to avoid updating data with current file.
 */
GitLabLibrary.prototype.doSave = function(title, success, error)
{
	this.saveFile(title, false, success, error);
};

/**
 * Does nothing since libraries are not opened as diagrams.
 */
GitLabLibrary.prototype.open = function()
{
	// Do nothing - this should never be called
};
