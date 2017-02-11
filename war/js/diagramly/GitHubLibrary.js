/**
 * Copyright (c) 2006-2017, JGraph Ltd
 * Copyright (c) 2006-2017, Gaudenz Alder
 */
GitHubLibrary = function(ui, data, meta)
{
	GitHubFile.call(this, ui, data, meta);
};

//Extends mxEventSource
mxUtils.extend(GitHubLibrary, GitHubFile);

/**
 * Translates this point by the given vector.
 * 
 * @param {number} dx X-coordinate of the translation.
 * @param {number} dy Y-coordinate of the translation.
 */
GitHubLibrary.prototype.isAutosave = function()
{
	return false;
};

/**
 * Overridden to avoid updating data with current file.
 */
GitHubLibrary.prototype.doSave = function(title, success, error)
{
	this.saveFile(title, false, success, error);
};

/**
 * Returns the location as a new object.
 * @type mx.Point
 */
GitHubLibrary.prototype.open = function()
{
	// Do nothing - this should never be called
};
