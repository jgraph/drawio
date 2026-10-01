/**
 * Copyright (c) 2006-2017, JGraph Holdings Ltd
 * Copyright (c) 2006-2017, draw.io AG
 */
GitHubLibrary = function(ui, data, meta)
{
	GitHubFile.call(this, ui, data, meta);
};

//Extends mxEventSource
mxUtils.extend(GitHubLibrary, GitHubFile);

/**
 * Overridden to avoid updating data with current file.
 */
GitHubLibrary.prototype.doSave = function(title, success, error)
{
	this.saveFile(title, false, success, error);
};

/**
 * Does nothing since libraries are not opened as diagrams.
 */
GitHubLibrary.prototype.open = function()
{
	// Do nothing - this should never be called
};
