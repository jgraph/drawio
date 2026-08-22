// Copyright (c) 2006-2020, JGraph Holdings Ltd
/**
 *
 */
DesktopLibrary = function(ui, data, fileObj)
{
	LocalLibrary.call(this, ui, data, fileObj.name);
	this.fileObj = fileObj;
	// The desktop saveFile writes to fileObject; without it every save
	// asks for a new file location [drawio-desktop#2521]
	this.fileObject = fileObj;
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

/**
 * 
 */
DesktopLibrary.prototype.save = function(revision, success, error)
{
	LocalFile.prototype.saveFile.apply(this, arguments);
};
