/**
 * Copyright (c) 2006-2017, JGraph Holdings Ltd
 * Copyright (c) 2006-2017, draw.io AG
 */
DriveLibrary = function(ui, data, desc)
{
	DriveFile.call(this, ui, data, desc);
};

//Extends mxEventSource
mxUtils.extend(DriveLibrary, DriveFile);

/**
 * Returns true to enable autosave for libraries.
 */
DriveLibrary.prototype.isAutosave = function()
{
	return true;
};

/**
 * Saves the library to Google Drive without updating the library data from
 * the current diagram.
 */
DriveLibrary.prototype.save = function(revision, success, error)
{
	this.ui.drive.saveFile(this, revision, mxUtils.bind(this, function(resp)
	{
		this.desc = resp;
		
		if (success != null)
		{
			success(resp);
		}
	}), error);
};

/**
 * Does nothing since libraries are not opened as diagrams.
 */
DriveLibrary.prototype.open = function()
{
	// Do nothing - this should never be called
};
