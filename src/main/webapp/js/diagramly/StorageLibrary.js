/**
 * Copyright (c) 2006-2017, JGraph Holdings Ltd
 * Copyright (c) 2006-2017, draw.io AG
 */
/**
 * Constructs a new library in the browser storage with the given data and
 * title.
 */
StorageLibrary = function(ui, data, title)
{
	StorageFile.call(this, ui, data, title);
};

//Extends mxEventSource
mxUtils.extend(StorageLibrary, StorageFile);

/**
 * A differentiator of the stored object type (file or lib)
 */
StorageLibrary.prototype.type = 'L';

/**
 * Returns true to enable autosave for libraries.
 */
StorageLibrary.prototype.isAutosave = function()
{
	return true;
};

/**
 * Saves the library under its current title.
 */
StorageLibrary.prototype.save = function(revision, success, error)
{
	this.saveAs(this.getTitle(), success, error);
};

/**
 * Overridden to avoid updating data with current file.
 */
StorageLibrary.prototype.saveAs = function(title, success, error)
{
	this.saveFile(title, false, success, error);
};

/**
 * Returns the hash of the library, which is L followed by the URI-encoded
 * title.
 */
StorageLibrary.prototype.getHash = function()
{
	return 'L' + encodeURIComponent(this.title);
};

/**
 * Returns the title of the library, or the localized name of the
 * scratchpad.
 */
StorageLibrary.prototype.getTitle = function()
{
	return (this.title == '.scratchpad') ? mxResources.get('scratchpad') : this.title;
};

/**
 * Returns true unless this is the scratchpad library.
 */
StorageLibrary.prototype.isRenamable = function(title, success, error)
{
	return this.title != '.scratchpad';
};

/**
 * Does nothing since libraries are not opened as diagrams.
 */
StorageLibrary.prototype.open = function()
{
	// Do nothing - this should never be called
};
