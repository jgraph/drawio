/**
 * Copyright (c) 2006-2017, JGraph Ltd
 * Copyright (c) 2006-2017, Gaudenz Alder
 */
OneDriveFile = function(ui, data, meta)
{
	DrawioFile.call(this, ui, data);
	
	this.meta = meta;
};

//Extends mxEventSource
mxUtils.extend(OneDriveFile, DrawioFile);

/**
 * Translates this point by the given vector.
 * 
 * @param {number} dx X-coordinate of the translation.
 * @param {number} dy Y-coordinate of the translation.
 */
OneDriveFile.prototype.getHash = function()
{
	return 'W' + encodeURIComponent(this.meta.id);
};

/**
 * Translates this point by the given vector.
 * 
 * @param {number} dx X-coordinate of the translation.
 * @param {number} dy Y-coordinate of the translation.
 */
OneDriveFile.prototype.getMode = function()
{
	return App.MODE_ONEDRIVE;
};

/**
 * Overridden to enable the autosave option in the document properties dialog.
 */
OneDriveFile.prototype.isAutosaveOptional = function()
{
	return true;
};

/**
 * Translates this point by the given vector.
 * 
 * @param {number} dx X-coordinate of the translation.
 * @param {number} dy Y-coordinate of the translation.
 */
OneDriveFile.prototype.getTitle = function()
{
	return this.meta.name;
};

/**
 * Translates this point by the given vector.
 * 
 * @param {number} dx X-coordinate of the translation.
 * @param {number} dy Y-coordinate of the translation.
 */
OneDriveFile.prototype.isRenamable = function()
{
	return true;
};

/**
 * Translates this point by the given vector.
 * 
 * @param {number} dx X-coordinate of the translation.
 * @param {number} dy Y-coordinate of the translation.
 */
OneDriveFile.prototype.save = function(revision, success, error)
{
	this.doSave(this.getTitle(), success, error);
};

/**
 * Translates this point by the given vector.
 * 
 * @param {number} dx X-coordinate of the translation.
 * @param {number} dy Y-coordinate of the translation.
 */
OneDriveFile.prototype.saveAs = function(title, success, error)
{
	this.doSave(title, success, error);
};

/**
 * Translates this point by the given vector.
 * 
 * @param {number} dx X-coordinate of the translation.
 * @param {number} dy Y-coordinate of the translation.
 */
OneDriveFile.prototype.doSave = function(title, success, error)
{
	// Forces update of data for new extensions
	var prev = this.meta.name;
	this.meta.name = title;
	DrawioFile.prototype.save.apply(this, arguments);
	this.meta.name = prev;
	
	this.saveFile(title, false, success, error);
};

/**
 * Translates this point by the given vector.
 * 
 * @param {number} dx X-coordinate of the translation.
 * @param {number} dy Y-coordinate of the translation.
 */
OneDriveFile.prototype.saveFile = function(title, revision, success, error)
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
		
		if (this.getTitle() == title)
		{
			// Makes sure no changes get lost while the file is saved
			var prevModified = this.isModified;
			var modified = this.isModified();

			var prepare = mxUtils.bind(this, function()
			{
				this.setModified(false);
				
				this.isModified = function()
				{
					return modified;
				};
			});
			
			prepare();
			
			this.ui.oneDrive.saveFile(this, mxUtils.bind(this, function(meta)
			{
				this.savingFile = false;
				this.isModified = prevModified;
				this.meta = meta;
				this.contentChanged();
				
				if (success != null)
				{
					success();
				}
			}),
			mxUtils.bind(this, function(err)
			{
				this.savingFile = false;
				this.isModified = prevModified;
				this.setModified(modified || this.isModified());
				
				if (error != null)
				{
					// Handles modified state for retries
					if (err != null && err.retry != null)
					{
						var retry = err.retry;
						
						err.retry = function()
						{
							prepare();
							retry();
						};
					}
					
					error(err);
				}
			}));
		}
		else
		{
			this.ui.oneDrive.insertFile(title, this.getData(), mxUtils.bind(this, function(file)
			{
				this.savingFile = false;
				
				if (success != null)
				{
					success();
				}
				
				this.ui.fileLoaded(file);
			}), mxUtils.bind(this, function()
			{
				this.savingFile = false;
				
				if (error != null)
				{
					error();
				}
			}));
		}
	}
	else if (error != null)
	{
		error({code: App.ERROR_BUSY});
	}
};

/**
 * Translates this point by the given vector.
 * 
 * @param {number} dx X-coordinate of the translation.
 * @param {number} dy Y-coordinate of the translation.
 */
OneDriveFile.prototype.rename = function(title, success, error)
{
	this.ui.oneDrive.renameFile(this, title, mxUtils.bind(this, function(meta)
	{
		if (!this.hasSameExtension(title, this.getTitle()))
		{
			this.meta = meta;
			this.save(true, success, error);
		}
		else
		{
			this.meta = meta;
			this.descriptorChanged();
			
			if (success != null)
			{
				success();
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
OneDriveFile.prototype.move = function(folderId, success, error)
{
	this.ui.oneDrive.moveFile(this.meta.id, folderId, mxUtils.bind(this, function(meta)
	{
		this.meta = meta;
		this.descriptorChanged();
		
		if (success != null)
		{
			success(meta);
		}
	}), error);
};
