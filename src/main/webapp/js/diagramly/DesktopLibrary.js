// Copyright (c) 2006-2019, JGraph Ltd
/**
 */
DesktopLibrary = function(ui, data, fileObj)
{
	LocalLibrary.call(this, ui, data, fileObj.name);
	this.fileObj = fileObj;
};

//Extends LocalLibrary
mxUtils.extend(DesktopLibrary, LocalLibrary);

/**
 * 
 */
DesktopLibrary.prototype.getHash = function()
{
	return 'S' + encodeURIComponent(this.fileObj.path);
};

DesktopLibrary.prototype.isAutosave = function()
{
	return this.fileObj != null;
};

DesktopLibrary.prototype.save = function(revision, success, error)
{
	LocalFile.prototype.saveFile.apply(this, arguments);
};
