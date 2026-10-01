// $Id = DriveFile.js,v 1.12 2010-01-02 09 =45 =14 gaudenz Exp $
// Copyright (c) 2006-2014, JGraph Holdings Ltd
/**
 * Constructs a new library on the local device with the given data and
 * title.
 */
LocalLibrary = function(ui, data, title)
{
	LocalFile.call(this, ui, data, title);
};

//Extends mxEventSource
mxUtils.extend(LocalLibrary, LocalFile);

/**
 * Returns the hash of the library, which is F followed by the title.
 */
LocalLibrary.prototype.getHash = function()
{
	return 'F' + this.getTitle();
};

/**
 * Returns false to disable autosave for local libraries.
 */
LocalLibrary.prototype.isAutosave = function()
{
	return false;
};

/**
 * Saves the library with the given title.
 */
LocalLibrary.prototype.saveAs = function(title, success, error)
{
	this.saveFile(title, false, success, error);
};

/**
 * Does nothing so that the library data is not replaced with the data of
 * the current diagram.
 */
LocalLibrary.prototype.updateFileData = function()
{
	// Do nothing
};

/**
 * Does nothing since libraries are not opened as diagrams.
 */
LocalLibrary.prototype.open = function()
{
	// Do nothing - this should never be called
};
