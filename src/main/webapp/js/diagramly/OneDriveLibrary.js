/**
 * Copyright (c) 2006-2017, JGraph Holdings Ltd
 * Copyright (c) 2006-2017, draw.io AG
 */
OneDriveLibrary = function(ui, data, meta, isSP)
{
	OneDriveFile.call(this, ui, data, meta, isSP);
};

//Extends mxEventSource
mxUtils.extend(OneDriveLibrary, OneDriveFile);

/**
 * Returns true to enable autosave for libraries.
 */
OneDriveLibrary.prototype.isAutosave = function()
{
	return true;
};

/**
 * Saves the library to OneDrive or SharePoint without updating the library
 * data from the current diagram.
 */
OneDriveLibrary.prototype.save = function(revision, success, error)
{
	(this.isSP? this.ui.m365 : this.ui.oneDrive).saveFile(this, mxUtils.bind(this, function(resp)
	{
		this.meta = resp;
		
		if (success != null)
		{
			success(resp);
		}
	}), error);
};

/**
 * Does nothing since libraries are not opened as diagrams.
 */
OneDriveLibrary.prototype.open = function()
{
	// Do nothing - this should never be called
};
