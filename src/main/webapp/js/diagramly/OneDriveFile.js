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
OneDriveFile.prototype.getId = function()
{
	return this.getIdOf(this.meta);
};

/**
 * Translates this point by the given vector.
 * 
 * @param {number} dx X-coordinate of the translation.
 * @param {number} dy Y-coordinate of the translation.
 */
OneDriveFile.prototype.getParentId = function()
{
	return this.getIdOf(this.meta, true);
};

/**
 * Translates this point by the given vector.
 * 
 * @param {number} dx X-coordinate of the translation.
 * @param {number} dy Y-coordinate of the translation.
 */
OneDriveFile.prototype.getIdOf = function(itemObj, parent)
{
	//TODO driveId is most probably always there. No need to check if it exists. Also, after some time, the code that check the old id format won't be needed 
	return ((itemObj.parentReference != null && itemObj.parentReference.driveId != null) ? itemObj.parentReference.driveId + '/' : '') +
		((parent != null) ? itemObj.parentReference.id : itemObj.id);
};

/**
 * Gets the channel ID for sync messages.
 */
OneDriveFile.prototype.getChannelId = function()
{
	return 'W-' + DrawioFile.prototype.getChannelId.apply(this, arguments);
};

/**
 * Translates this point by the given vector.
 * 
 * @param {number} dx X-coordinate of the translation.
 * @param {number} dy Y-coordinate of the translation.
 */
OneDriveFile.prototype.getHash = function()
{
	return 'W' + encodeURIComponent(this.getId());
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
 * Hook for subclassers.
 */
OneDriveFile.prototype.isSyncSupported = function()
{
	return true;
};

/**
 * Specifies if notify events should be ignored.
 */
OneDriveFile.prototype.getSize = function()
{
	return this.meta.size;
};

/**
 * Adds the listener for automatically saving the diagram for local changes.
 */
OneDriveFile.prototype.isConflict = function(req)
{
	return req != null && (req.getStatus() == 412 || req.getStatus() == 409);
};

/**
 * Returns the current etag.
 */
OneDriveFile.prototype.getCurrentUser = function()
{
	return (this.ui.oneDrive != null) ? this.ui.oneDrive.user : null;
};

/**
 * Adds the listener for automatically saving the diagram for local changes.
 */
OneDriveFile.prototype.loadDescriptor = function(success, error)
{
	this.ui.oneDrive.executeRequest(this.ui.oneDrive.getItemURL(this.getId()), mxUtils.bind(this, function(req)
	{
		if (req.getStatus() >= 200 && req.getStatus() <= 299)
		{
			success(JSON.parse(req.getText()));
		}
		else if (error != null)
		{
			error();
		}
	}), error);
};

/**
 * Adds the listener for automatically saving the diagram for local changes.
 */
OneDriveFile.prototype.getLatestVersion = function(success, error)
{
	this.ui.oneDrive.getFile(this.getId(), success, error);
};

/**
 * Hook for subclassers to update the descriptor from given file
 */
OneDriveFile.prototype.getDescriptor = function()
{
	return this.meta;
};

/**
 * Hook for subclassers to update the descriptor from given file
 */
OneDriveFile.prototype.setDescriptor = function(desc)
{
	this.meta = desc;
};

/**
 * Using the quickXorHash of the content as the access password.
 */
OneDriveFile.prototype.getDescriptorSecret = function(desc)
{
	if (desc.file != null && desc.file.hashes != null &&
		desc.file.hashes.quickXorHash != null)
	{
		return desc.file.hashes.quickXorHash;
	}
	
	return null;
};

/**
 * Adds all listeners.
 */
OneDriveFile.prototype.getDescriptorEtag = function(desc)
{
	return desc.eTag;
};

/**
 * Adds the listener for automatically saving the diagram for local changes.
 */
OneDriveFile.prototype.setDescriptorEtag = function(desc, etag)
{
	desc.eTag = etag;
};

/**
 * Adds the listener for automatically saving the diagram for local changes.
 */
OneDriveFile.prototype.loadPatchDescriptor = function(success, error)
{
	var url = this.ui.oneDrive.getItemURL(this.getId());

	this.ui.oneDrive.executeRequest(url + '?select=etag,file' , mxUtils.bind(this, function(req)
	{
		if (req.getStatus() >= 200 && req.getStatus() <= 299)
		{
			success(JSON.parse(req.getText()));
		}
		else
		{
			error(this.ui.oneDrive.parseRequestText(req));
		}
	}), error)
};

/**
 * Using MD5 of create timestamp and user ID as crypto key.
 */
OneDriveFile.prototype.getChannelKey = function()
{
	if (typeof CryptoJS !== 'undefined')
	{
		return CryptoJS.MD5(this.meta.createdDateTime +
			((this.meta.createdBy != null &&
			this.meta.createdBy.user != null) ?
			this.meta.createdBy.user.id : '')).toString();
	}
	
	return null;
};

/**
 * Adds all listeners.
 */
OneDriveFile.prototype.getLastModifiedDate = function()
{
	return new Date(this.meta.lastModifiedDateTime);
};

/**
 * Translates this point by the given vector.
 * 
 * @param {number} dx X-coordinate of the translation.
 * @param {number} dy Y-coordinate of the translation.
 */
OneDriveFile.prototype.save = function(revision, success, error, unloading, overwrite)
{
	this.doSave(this.getTitle(), revision, success, error, unloading, overwrite);
};

/**
 * Translates this point by the given vector.
 * 
 * @param {number} dx X-coordinate of the translation.
 * @param {number} dy Y-coordinate of the translation.
 */
OneDriveFile.prototype.saveAs = function(title, success, error)
{
	this.doSave(title, false, success, error);
};

/**
 * Translates this point by the given vector.
 * 
 * @param {number} dx X-coordinate of the translation.
 * @param {number} dy Y-coordinate of the translation.
 */
OneDriveFile.prototype.doSave = function(title, revision, success, error, unloading, overwrite)
{
	// Forces update of data for new extensions
	var prev = this.meta.name;
	this.meta.name = title;
	
	DrawioFile.prototype.save.apply(this, [null, mxUtils.bind(this, function()
	{
		this.meta.name = prev;
		this.saveFile(title, revision, success, error, unloading, overwrite);
	}), error, unloading, overwrite]);
};

/**
 * Translates this point by the given vector.
 * 
 * @param {number} dx X-coordinate of the translation.
 * @param {number} dy Y-coordinate of the translation.
 */
OneDriveFile.prototype.saveFile = function(title, revision, success, error, unloading, overwrite)
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
		if (this.getTitle() == title)
		{
			var doSave = mxUtils.bind(this, function()
			{
				var prevModified = null;
				var modified = null;
				
				try
				{
					// Makes sure no changes get lost while the file is saved
					prevModified = this.isModified;
					modified = this.isModified();
					this.savingFile = true;
					this.savingFileTime = new Date();
					
					var prepare = mxUtils.bind(this, function()
					{
						this.setModified(false);
						
						this.isModified = function()
						{
							return modified;
						};
					});
						
					var etag = (!overwrite && this.constructor == OneDriveFile &&
							(DrawioFile.SYNC == 'manual' || DrawioFile.SYNC == 'auto')) ?
							this.getCurrentEtag() : null;
					var lastDesc = this.meta;
					prepare();
					
					this.ui.oneDrive.saveFile(this, mxUtils.bind(this, function(meta, savedData)
					{
						this.isModified = prevModified;
						this.savingFile = false;
						this.meta = meta;
	
						this.fileSaved(savedData, lastDesc, mxUtils.bind(this, function()
						{
							this.contentChanged();
							
							if (success != null)
							{
								success();
							}
						}), error);
					}),
					mxUtils.bind(this, function(err, req)
					{
						this.savingFile = false;
						this.isModified = prevModified;
						this.setModified(modified || this.isModified());
						
						if (this.isConflict(req))
				    	{
							this.inConflictState = true;
	
							if (this.sync != null)
							{
								this.savingFile = true;
								this.savingFileTime = new Date();
								
								this.sync.fileConflict(null, mxUtils.bind(this, function()
								{
									// Adds random cool-off
									window.setTimeout(mxUtils.bind(this, function()
									{
										this.updateFileData();
										doSave();
									}), 100 + Math.random() * 500);
								}), mxUtils.bind(this, function()
								{
									this.savingFile = false;
									
									if (error != null)
									{
										error();
									}
								}));
							}
							else if (error != null)
							{
								error();
							}
						}
						else if (error != null)
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
					}), etag);
				}
				catch (e)
				{
					this.savingFile = false;
					
					if (prevModified != null)
					{
						this.isModified = prevModified;
					}
					
					if (modified != null)
					{
						this.setModified(modified || this.isModified());
					}
					
					if (error != null)
					{
						error(e);
					}
					else
					{
						throw e;
					}
				}
			});
			
			doSave();
		}
		else
		{
			this.savingFile = true;
			this.savingFileTime = new Date();
		
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
};

/**
 * Translates this point by the given vector.
 * 
 * @param {number} dx X-coordinate of the translation.
 * @param {number} dy Y-coordinate of the translation.
 */
OneDriveFile.prototype.rename = function(title, success, error)
{
	var etag = this.getCurrentEtag();
	
	this.ui.oneDrive.renameFile(this, title, mxUtils.bind(this, function(meta)
	{
		if (!this.hasSameExtension(title, this.getTitle()))
		{
			this.meta = meta;
			
			if (this.sync != null)
			{
				this.sync.descriptorChanged(etag);
			}
			
			this.save(true, success, error);
		}
		else
		{
			this.meta = meta;
			this.descriptorChanged();

			if (this.sync != null)
			{
				this.sync.descriptorChanged(etag);
			}
			
			if (success != null)
			{
				success(meta);
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
	this.ui.oneDrive.moveFile(this.getId(), folderId, mxUtils.bind(this, function(meta)
	{
		this.meta = meta;
		this.descriptorChanged();
		
		if (success != null)
		{
			success(meta);
		}
	}), error);
};
