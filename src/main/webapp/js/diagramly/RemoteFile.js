// Copyright (c) 2006-2020, JGraph Holdings Ltd
/**
 */
RemoteFile = function(ui, data, title)
{
	DrawioFile.call(this, ui, data);
	
	this.title = title;
	this.mode = null;
};

//Extends mxEventSource
mxUtils.extend(RemoteFile, DrawioFile);

/**
 * Returns false since remote files are not saved automatically.
 */
RemoteFile.prototype.isAutosave = function()
{
	return false;
};

/**
 * 
 */
RemoteFile.prototype.getMode = function()
{
	return this.mode;
};

/**
 * 
 */
RemoteFile.prototype.getTitle = function()
{
	return this.title;
};

/**
 * 
 */
RemoteFile.prototype.isRenamable = function()
{
	return false;
};

/**
 */
RemoteFile.prototype.open = function()
{
	this.ui.setFileData(this.getData());
	this.installListeners();
};
