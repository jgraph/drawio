/**
 * Copyright (c) 2006-2017, JGraph Ltd
 * Copyright (c) 2006-2017, Gaudenz Alder
 */
DriveFile = function(ui, data, desc, doc)
{
	DrawioFile.call(this, ui, data);
	
	this.desc = desc;

	if (doc != null && doc.getModel() != null && doc.getModel().getRoot() != null)
	{
		this.realtime = new DriveRealtime(this, doc);
	}
};

//Extends mxEventSource
mxUtils.extend(DriveFile, DrawioFile);

/**
 * Returns true if copy, export and print are not allowed for this file.
 */
DriveFile.prototype.isRestricted = function()
{
	return this.desc.userPermission != null && this.desc.labels != null &&
		this.desc.userPermission.role == 'reader' && this.desc.labels.restricted;
};

/**
 * Delay for last save in ms.
 */
DriveFile.prototype.saveDelay = 0;

/**
 * Translates this point by the given vector.
 * 
 * @param {number} dx X-coordinate of the translation.
 * @param {number} dy Y-coordinate of the translation.
 */
DriveFile.prototype.getMode = function()
{
	return App.MODE_GOOGLE;
};

/**
 * Returns true if copy, export and print are not allowed for this file.
 */
DriveFile.prototype.getPublicUrl = function(fn)
{
	gapi.client.drive.permissions.list(
	{
		'fileId': this.desc.id
	}).execute(mxUtils.bind(this, function(resp)
	{
		if (resp != null && resp.items != null)
		{
			for (var i = 0; i < resp.items.length; i++)
			{
				if (resp.items[i].id === 'anyoneWithLink' ||
					resp.items[i].id === 'anyone')
				{
					fn(this.desc.webContentLink);
					
					return;
				}
			}
		}
		
		fn(null);
	}));
};

/**
 * Overridden to enable the autosave option in the document properties dialog
 * if realtime is not used.
 */
DriveFile.prototype.isAutosaveOptional = function()
{
	return true;
};

/**
 * Translates this point by the given vector.
 * 
 * @param {number} dx X-coordinate of the translation.
 * @param {number} dy Y-coordinate of the translation.
 */
DriveFile.prototype.isAutosave = function()
{
	return this.ui.editor.autosave || this.isAutosaveRevision();
};

/**
 * Returns true if an autosave is required at the time of execution.
 * This implementation returns true.
 */
DriveFile.prototype.isAutosaveNow = function()
{
	if (this.realtime != null && this.realtime.root != null)
	{
		var backup = parseInt(this.realtime.root.get('backupDate'));
		var modified = parseInt(this.realtime.root.get('modifiedDate'));

		return isNaN(backup) || isNaN(modified) || backup < modified;
	}
	
	return true;
};

/**
 * Hooks for subclassers after the autosave has completed.
 */
DriveFile.prototype.autosaveCompleted = function()
{
	if (this.realtime != null && this.realtime.root != null)
	{
		this.realtime.root.set('backupDate', new Date().getTime());
	}
};

/**
 * Translates this point by the given vector.
 * 
 * @param {number} dx X-coordinate of the translation.
 * @param {number} dy Y-coordinate of the translation.
 */
DriveFile.prototype.isRenamable = function()
{
	return this.isEditable() && DrawioFile.prototype.isEditable.apply(this, arguments);
};

/**
 * Translates this point by the given vector.
 * 
 * @param {number} dx X-coordinate of the translation.
 * @param {number} dy Y-coordinate of the translation.
 */
DriveFile.prototype.isMovable = function()
{
	return this.isEditable();
};

/**
 * Translates this point by the given vector.
 * 
 * @param {number} dx X-coordinate of the translation.
 * @param {number} dy Y-coordinate of the translation.
 */
DriveFile.prototype.save = function(revision, success, error, unloading)
{
	DrawioFile.prototype.save.apply(this, arguments);
	
	this.saveFile(null, revision, success, error, unloading);
};

/**
 * Translates this point by the given vector.
 * 
 * @param {number} dx X-coordinate of the translation.
 * @param {number} dy Y-coordinate of the translation.
 */
DriveFile.prototype.saveFile = function(title, revision, success, error, unloading)
{
	if (!this.isEditable())
	{
		if (success != null)
		{
			success();
		}
	}
	else if (!this.savingFile)
	{
		this.savingFile = true;
		
		// Makes sure no changes get lost while the file is saved
		var prevModified = this.isModified;
		var modified = this.isModified();
		this.setModified(false);
		
		this.ui.drive.saveFile(this, revision, mxUtils.bind(this, function(resp)
		{
			this.savingFile = false;
			this.isModified = prevModified;
			
			// Handles special case where resp is false eg
			// if the old file was converted to realtime
			if (resp != false)
			{
				if (revision)
				{
					this.lastAutosaveRevision = new Date().getTime();
				}
				
				this.desc = resp;
				this.contentChanged();
				
				if (success != null)
				{
					success(resp);
				}
			}
			else
			{
				this.setModified(modified || this.isModified());
				
				if (error != null)
				{
					error();
				}
			}
		}), mxUtils.bind(this, function(resp)
		{
			this.savingFile = false;
			this.isModified = prevModified;
			this.setModified(modified || this.isModified());
			
			if (error != null)
			{
				error(resp);
			}
		}), unloading, unloading);
	}
};


/**
 * Translates this point by the given vector.
 * 
 * @param {number} dx X-coordinate of the translation.
 * @param {number} dy Y-coordinate of the translation.
 */
DriveFile.prototype.saveAs = function(filename, success, error)
{
	this.ui.drive.copyFile(this.getId(), filename, success, error);
};

/**
 * Translates this point by the given vector.
 * 
 * @param {number} dx X-coordinate of the translation.
 * @param {number} dy Y-coordinate of the translation.
 */
DriveFile.prototype.rename = function(title, success, error)
{
	this.ui.drive.renameFile(this.getId(), title, mxUtils.bind(this, function(resp)
	{
		if (!this.hasSameExtension(title, this.getTitle()))
		{
			this.desc = resp;
			this.save(true, success, error);
		}
		else
		{
			this.desc = resp;
			this.descriptorChanged();
			
			if (success != null)
			{
				success(resp);
			}
		}
	}), error);
};

/**
 * Translates this point by the given vector.
 * 
 * @param {number} dx X-coordinate of the translation.
 * @param {number} dy Y-coordinate of the translation.
 */
DriveFile.prototype.move = function(folderId, success, error)
{
	this.ui.drive.moveFile(this.getId(), folderId, mxUtils.bind(this, function(resp)
	{
		this.desc = resp;
		this.descriptorChanged();
		
		if (success != null)
		{
			success(resp);
		}
	}), error);
};

/**
 * Translates this point by the given vector.
 * 
 * @param {number} dx X-coordinate of the translation.
 * @param {number} dy Y-coordinate of the translation.
 */
DriveFile.prototype.getTitle = function()
{
	return this.desc.title;
};

/**
 * Translates this point by the given vector.
 * 
 * @param {number} dx X-coordinate of the translation.
 * @param {number} dy Y-coordinate of the translation.
 */
DriveFile.prototype.getHash = function()
{
	return 'G' + this.getId();
};

/**
 * Translates this point by the given vector.
 * 
 * @param {number} dx X-coordinate of the translation.
 * @param {number} dy Y-coordinate of the translation.
 */
DriveFile.prototype.getId = function()
{
	return this.desc.id;
};

/**
 * Translates this point by the given vector.
 * 
 * @param {number} dx X-coordinate of the translation.
 * @param {number} dy Y-coordinate of the translation.
 */
DriveFile.prototype.isEditable = function()
{
	var editable = DrawioFile.prototype.isEditable.apply(this, arguments);
	
	if (this.realtime != null)
	{
		return editable && !this.realtime.rtModel.isReadOnly;
	}
	else
	{
		return editable && this.desc.editable;
	}
};

/**
 * Returns the location as a new object.
 */
DriveFile.prototype.open = function()
{
	if (this.realtime != null)
	{
		this.realtime.start();
	}
	else
	{
		DrawioFile.prototype.open.apply(this, arguments);
	}
};

/**
 * Returns the location as a new object.
 */
DriveFile.prototype.close = function(unloading)
{
	unloading = (unloading != null) ? unloading : false;
	DrawioFile.prototype.close.apply(this, arguments);
	
	if (this.realtime != null)
	{
		this.realtime.destroy(unloading);
		this.realtime = null;
	}
};
