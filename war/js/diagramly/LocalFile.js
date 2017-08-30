// $Id = LocalFile.js,v 1.12 2010-01-02 09 =45 =14 gaudenz Exp $
// Copyright (c) 2006-2014, JGraph Ltd
/**
 * Constructs a new point for the optional x and y coordinates. If no
 * coordinates are given, then the default values for <x> and <y> are used.
 * @constructor
 * @class Implements a basic 2D point. Known subclassers = {@link mxRectangle}.
 * @param {number} x X-coordinate of the point.
 * @param {number} y Y-coordinate of the point.
 */
LocalFile = function(ui, data, title, temp)
{
	DrawioFile.call(this, ui, data);
	
	this.title = title;
	this.mode = (temp) ? null : App.MODE_DEVICE;
};

//Extends mxEventSource
mxUtils.extend(LocalFile, DrawioFile);

/**
 * Translates this point by the given vector.
 * 
 * @param {number} dx X-coordinate of the translation.
 * @param {number} dy Y-coordinate of the translation.
 */
LocalFile.prototype.isAutosave = function()
{
	return false;
};

/**
 * Translates this point by the given vector.
 * 
 * @param {number} dx X-coordinate of the translation.
 * @param {number} dy Y-coordinate of the translation.
 */
LocalFile.prototype.getMode = function()
{
	return this.mode;
};

/**
 * Translates this point by the given vector.
 * 
 * @param {number} dx X-coordinate of the translation.
 * @param {number} dy Y-coordinate of the translation.
 */
LocalFile.prototype.getTitle = function()
{
	return this.title;
};

/**
 * Translates this point by the given vector.
 * 
 * @param {number} dx X-coordinate of the translation.
 * @param {number} dy Y-coordinate of the translation.
 */
LocalFile.prototype.isRenamable = function()
{
	return true;
};

/**
 * Translates this point by the given vector.
 * 
 * @param {number} dx X-coordinate of the translation.
 * @param {number} dy Y-coordinate of the translation.
 */
LocalFile.prototype.save = function(revision, success, error)
{
	this.saveAs(this.title, success, error);
};

/**
 * Translates this point by the given vector.
 * 
 * @param {number} dx X-coordinate of the translation.
 * @param {number} dy Y-coordinate of the translation.
 */
LocalFile.prototype.saveAs = function(title, success, error)
{
	this.saveFile(title, false, success, error);
};

/**
 * Translates this point by the given vector.
 * 
 * @param {number} dx X-coordinate of the translation.
 * @param {number} dy Y-coordinate of the translation.
 */
LocalFile.prototype.saveFile = function(title, revision, success, error)
{
	this.title = title;

	// Updates data after changing file name
	this.updateFileData();
	var data = this.getData();
	var binary = this.ui.useCanvasForExport && /(\.png)$/i.test(this.getTitle());
	
	var doSave = mxUtils.bind(this, function(data)
	{
		if (this.ui.isOfflineApp() || this.ui.isLocalFileSave())
		{
			this.ui.doSaveLocalFile(data, title, (binary) ?
				'image/png' : 'text/xml', binary);
		}
		else
		{
			if (data.length < MAX_REQUEST_SIZE)
			{
				var dot = title.lastIndexOf('.');
				var format = (dot > 0) ? title.substring(dot + 1) : 'xml';

				// Do not update modified flag
				new mxXmlRequest(SAVE_URL, 'format=' + format +
					'&xml=' + encodeURIComponent(data) +
					'&filename=' + encodeURIComponent(title) +
					((binary) ? '&binary=1' : '')).
					simulate(document, '_blank');
			}
			else
			{
				this.ui.handleError({message: mxResources.get('drawingTooLarge')}, mxResources.get('error'), mxUtils.bind(this, function()
				{
					mxUtils.popup(data);
				}));
			}
		}
		
		this.setModified(false);
		this.contentChanged();
		
		if (success != null)
		{
			success();
		}
	});
	
	if (binary)
	{
		this.ui.getEmbeddedPng(mxUtils.bind(this, function(imageData)
		{
			doSave(imageData);
		}), error, (this.ui.getCurrentFile() != this) ? this.getData() : null);
	}
	else
	{
		doSave(data);
	}
};

/**
 * Translates this point by the given vector.
 * 
 * @param {number} dx X-coordinate of the translation.
 * @param {number} dy Y-coordinate of the translation.
 */
LocalFile.prototype.rename = function(title, success, error)
{
	this.title = title;
	this.descriptorChanged();
	
	if (success != null)
	{
		success();
	}
};

/**
 * Returns the location as a new object.
 * @type mx.Point
 */
LocalFile.prototype.open = function()
{
	this.ui.setFileData(this.getData());
	
	// Only used to update the status when the file changes
	this.changeListener = mxUtils.bind(this, function(sender, eventObject)
	{
		this.setModified(true);
		this.addUnsavedStatus();
	});
	
	this.ui.editor.graph.model.addListener(mxEvent.CHANGE, this.changeListener);
};
