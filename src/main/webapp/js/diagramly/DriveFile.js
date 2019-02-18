/**
 * Copyright (c) 2006-2017, JGraph Ltd
 * Copyright (c) 2006-2017, Gaudenz Alder
 */
DriveFile = function(ui, data, desc)
{
	DrawioFile.call(this, ui, data);
	
	this.desc = desc;
};

//Extends mxEventSource
mxUtils.extend(DriveFile, DrawioFile);

/**
 * Delay for last save in ms.
 */
DriveFile.prototype.saveDelay = 0;

/**
 * Delay for last save in ms.
 */
DriveFile.prototype.allChangesSavedKey = 'allChangesSavedInDrive';

/**
 * Specifies if notify events should be ignored.
 */
DriveFile.prototype.getSize = function()
{
	return this.desc.fileSize;
};

/**
 * Returns true if copy, export and print are not allowed for this file.
 */
DriveFile.prototype.isRestricted = function()
{
	return this.desc.userPermission != null && this.desc.labels != null &&
		this.desc.userPermission.role == 'reader' && this.desc.labels.restricted;
};

/**
 * Adds the listener for automatically saving the diagram for local changes.
 */
DriveFile.prototype.isConflict = function(err)
{
	return err != null && err.error != null && err.error.code == 412;
};

/**
 * Returns the current etag.
 */
DriveFile.prototype.getCurrentUser = function()
{
	return (this.ui.drive != null) ? this.ui.drive.user : null;
};

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
DriveFile.prototype.save = function(revision, success, error, unloading, overwrite)
{
	DrawioFile.prototype.save.apply(this, arguments);
	
	this.saveFile(null, revision, success, error, unloading, overwrite);
};

/**
 * Translates this point by the given vector.
 * 
 * @param {number} dx X-coordinate of the translation.
 * @param {number} dy Y-coordinate of the translation.
 */
DriveFile.prototype.saveFile = function(title, revision, success, error, unloading, overwrite)
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
		var doSave = mxUtils.bind(this, function(realOverwrite, realRevision)
		{
			var lastDesc = this.desc;
			
			// Makes sure no changes get lost while the file is saved
			var modified = this.isModified();
			this.setModified(false);
			this.savingFile = true;

			// Waits for success for modified state to be visible
			var prevModified = this.isModified;
			
			this.isModified = function()
			{
				return true;
			};

			this.ui.drive.saveFile(this, realRevision, mxUtils.bind(this, function(resp, savedData)
			{
				this.isModified = prevModified;
				this.savingFile = false;
				
				// Handles special case where resp is false eg
				// if the old file was converted to realtime
				if (resp != false)
				{
					if (revision)
					{
						this.lastAutosaveRevision = new Date().getTime();
					}

					// Adaptive autosave delay
					this.autosaveDelay = Math.min(6000,
						Math.max(this.saveDelay + 500,
						DrawioFile.prototype.autosaveDelay));
					this.desc = resp;
					
					this.fileSaved(savedData, lastDesc, mxUtils.bind(this, function()
					{
						this.contentChanged();
						
						if (success != null)
						{
							success(resp);
						}
					}), error);
				}
				else
				{
					this.setModified(modified || this.isModified());
					
					if (error != null)
					{
						error(resp);
					}
				}
			}), mxUtils.bind(this, function(err, desc)
			{
				this.savingFile = false;
				this.isModified = prevModified;
				this.setModified(modified || this.isModified());
			
				if (this.isConflict(err))
				{
					this.inConflictState = true;
					
					if (this.sync != null)
					{
						this.savingFile = true;
						
						this.sync.fileConflict(desc, mxUtils.bind(this, function()
						{
							// Adds random cool-off
							window.setTimeout(mxUtils.bind(this, function()
							{
								this.updateFileData();
								doSave(realOverwrite, true);
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
					error(err);
				}
			}), unloading, unloading, realOverwrite);
		});
		
		doSave(overwrite, revision);
	}
};

/**
 * Shows a conflict dialog to the user.
 */
DriveFile.prototype.copyFile = function(success, error)
{
	if (!this.isRestricted())
	{
		this.makeCopy(mxUtils.bind(this, function()
		{
			if (this.ui.spinner.spin(document.body, mxResources.get('saving')))
			{
				try
				{
					this.save(true, success, error)
				}
				catch (e)
				{
					error(e);
				}
			}
		}), error, true);
	}
	else
	{
		DrawioFile.prototype.copyFile.apply(this, arguments);
	}	
};

/**
 * Shows a conflict dialog to the user.
 */
DriveFile.prototype.makeCopy = function(success, error, timestamp)
{
	if (this.ui.spinner.spin(document.body, mxResources.get('saving')))
	{
		// Uses copyFile internally which is a remote REST call with the advantage of keeping
		// the parents of the file in-place, but copies the remote file contents so needs to
		// be updated as soon as we have the ID.
		this.saveAs(this.ui.getCopyFilename(this, timestamp), mxUtils.bind(this, function(resp)
		{
			this.desc = resp;
			this.ui.spinner.stop();
			this.setModified(false);
			
			this.backupPatch = null;
			this.invalidChecksum = false;
			this.inConflictState = false;
			
			this.descriptorChanged();
			success();
		}), mxUtils.bind(this, function()
		{
			this.ui.spinner.stop();
			
			if (error != null)
			{
				error();
			}
		}));
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
	var etag = this.getCurrentEtag();
	
	this.ui.drive.renameFile(this.getId(), title, mxUtils.bind(this, function(desc)
	{
		if (!this.hasSameExtension(title, this.getTitle()))
		{
			this.desc = desc;

			if (this.sync != null)
			{
				this.sync.descriptorChanged(etag);
			}
			
			this.save(true, success, error);
		}
		else
		{
			this.desc = desc;
			this.descriptorChanged();
			
			if (this.sync != null)
			{
				this.sync.descriptorChanged(etag);
			}
			
			if (success != null)
			{
				success(desc);
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
	return DrawioFile.prototype.isEditable.apply(this, arguments) &&
		this.desc.editable;
};

/**
 * Hook for subclassers.
 */
DriveFile.prototype.isSyncSupported = function()
{
	return true;
};

/**
 * Hook for subclassers.
 */
DriveFile.prototype.isRevisionHistorySupported = function()
{
	return true;
};

/**
 * Hook for subclassers.
 */
DriveFile.prototype.getRevisions = function(success, error)
{
	this.ui.drive.executeRequest(gapi.client.drive.revisions.list({'fileId': this.getId()}),
		mxUtils.bind(this, function(resp)
	{
		for (var i = 0; i < resp.items.length; i++)
		{
			(mxUtils.bind(this, function(item)
			{
				// Redirects title to originalFilename to
				// match expected descriptor interface
				item.title = item.originalFilename;
				
				item.getXml = mxUtils.bind(this, function(itemSuccess, itemError)
				{
					this.ui.drive.getXmlFile(item, mxUtils.bind(this, function(file)
		   			{
						itemSuccess(file.getData());
		   			}), itemError);
				});
				
				item.getUrl = mxUtils.bind(this, function(page)
				{
					return this.ui.getUrl(window.location.pathname + '?rev=' + item.id +
						'&chrome=0&nav=1&layers=1&edit=_blank' + ((page != null) ?
						'&page=' + page : '')) + window.location.hash;
				});
			}))(resp.items[i]);
		}
		
		success(resp.items);
	}), error);
};

/**
 * Adds the listener for automatically saving the diagram for local changes.
 */
DriveFile.prototype.getLatestVersion = function(success, error)
{
	this.ui.drive.getFile(this.getId(), success, error, true);
};

/**
 * Adds all listeners.
 */
DriveFile.prototype.getChannelId = function()
{
	var chan = this.ui.drive.getCustomProperty(this.desc, 'channel');
	
	if (chan != null)
	{
		chan = 'G-' + this.getId() + '.' + chan;
	}
	
	return chan;
};

/**
 * Gets the channel ID from the given descriptor.
 */
DriveFile.prototype.getChannelKey = function()
{
	return this.ui.drive.getCustomProperty(this.desc, 'key');
};

/**
 * Adds all listeners.
 */
DriveFile.prototype.getLastModifiedDate = function()
{
	return new Date(this.desc.modifiedDate);
};

/**
 * Adds all listeners.
 */
DriveFile.prototype.getDescriptor = function()
{
	return this.desc;
};

/**
* Updates the descriptor of this file with the one from the given file.
*/
DriveFile.prototype.setDescriptor = function(desc)
{
	this.desc = desc;
};

/**
 * Returns the etag from the given descriptor.
 */
DriveFile.prototype.getDescriptorSecret = function(desc)
{
	return this.ui.drive.getCustomProperty(desc, 'secret');
};

/**
 * Adds all listeners.
 */
DriveFile.prototype.getDescriptorEtag = function(desc)
{
	return desc.etag;
};

/**
 * Adds the listener for automatically saving the diagram for local changes.
 */
DriveFile.prototype.setDescriptorEtag = function(desc, etag)
{
	desc.etag = etag;
};

/**
 * Adds the listener for automatically saving the diagram for local changes.
 */
DriveFile.prototype.loadPatchDescriptor = function(success, error)
{
	this.ui.drive.executeRequest(gapi.client.drive.files.get({'fileId': this.getId(),
		'fields': this.ui.drive.catchupFields, 'supportsTeamDrives': true}),
		mxUtils.bind(this, function(desc)
	{
		success(desc);
	}), error);
};

/**
 * Adds the listener for automatically saving the diagram for local changes.
 */
DriveFile.prototype.loadDescriptor = function(success, error)
{
	this.ui.drive.loadDescriptor(this.getId(), success, error);
};
