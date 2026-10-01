/**
 * Copyright (c) 2006-2017, JGraph Holdings Ltd
 * Copyright (c) 2006-2017, draw.io AG
 */
/**
 * Constructs a new read-only library with the given data. The title is the
 * URL of the library.
 */
UrlLibrary = function(ui, data, title)
{
	StorageFile.call(this, ui, data, title);
	
	var fname = title;
	var last = fname.lastIndexOf('/');
		
	if (last >= 0)
	{
		fname = fname.substring(last + 1);
	}
	
	this.fname = fname;
};

//Extends mxEventSource
mxUtils.extend(UrlLibrary, StorageFile);

/**
 * Returns the hash of the library, which is U followed by the URI-encoded
 * URL.
 */
UrlLibrary.prototype.getHash = function()
{
	return 'U' + encodeURIComponent(this.title);
};

/**
 * Returns the filename part of the URL.
 */
UrlLibrary.prototype.getTitle = function()
{
	return this.fname;
};

/**
 * Returns false since URL libraries are read-only.
 */
UrlLibrary.prototype.isAutosave = function()
{
	return false;
};

/**
 * Returns false since URL libraries are read-only.
 */
UrlLibrary.prototype.isEditable = function(title, success, error)
{
	return false;
};

/**
 * Does nothing since URL libraries cannot be saved.
 */
UrlLibrary.prototype.saveAs = function(title, success, error)
{
	// Cannot be saved
};

/**
 * Does nothing since libraries are not opened as diagrams.
 */
UrlLibrary.prototype.open = function()
{
	// Do nothing - this should never be called
};
