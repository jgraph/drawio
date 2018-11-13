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
 * Delay for last save in ms.
 */
DriveFile.prototype.saveDelay = 0;

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
	return this.realtime == null;
};

/**
 * Translates this point by the given vector.
 * 
 * @param {number} dx X-coordinate of the translation.
 * @param {number} dy Y-coordinate of the translation.
 */
DriveFile.prototype.isAutosave = function()
{
	return this.ui.editor.autosave || (this.realtime != null && this.isAutosaveRevision());
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
	else
	{
		return true;
	}
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
		var prevModified = this.isModified;
		var modified = this.isModified();
		
		// Makes sure no changes get lost while the file is saved
		this.setModified(false);

		// Waits for success for modified state to be visible
		this.isModified = function()
		{
			return true;
		};
		
		var doSave = mxUtils.bind(this, function(realOverwrite, realRevision)
		{
			this.savingFile = true;
			
			this.ui.drive.saveFile(this, realRevision, mxUtils.bind(this, function(resp)
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
						error(resp);
					}
				}
			}), mxUtils.bind(this, function(err)
			{
				var doError = mxUtils.bind(this, function()
				{
					this.setModified(modified || this.isModified());
					this.isModified = prevModified;
					this.savingFile = false;
					
					if (error != null)
					{
						error(err);
					}
				});
				
				if (this.isConflict(err))
				{
					this.showConflictDialog(function()
					{
						// Overwrites and creates revision
						doSave(true, true);
					}, function()
					{
						err = null;
						doError();
					});
				}
				else
				{
					doError();
				}
			}), unloading, unloading, realOverwrite);
		});
		
		doSave(overwrite, revision);
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
			// Replaces the descriptor to and writes the file
			this.ui.spinner.stop();
			this.desc = resp;
			success();
			this.setModified(false);
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

/**
 * Shows a conflict dialog to the user.
 */
DriveFile.prototype.showConflictDialog = function(retry, error)
{
	if (!this.showingConflictDialog)
	{
		var resume = (this.ui.spinner != null && this.ui.spinner.pause != null) ?
			this.ui.spinner.pause() : function() {};
		var prev = this.changeListenerEnabled;
		this.changeListenerEnabled = false;
		this.showingConflictDialog = true;
		
		var logAction = mxUtils.bind(this, function(action)
		{
			try
			{
				this.ui.logEvent({category: 'RT-CONFLICT-DLG',
					action: action, label: this.getId()});
			}
			catch (e)
			{
				// ignore
			}
		});
		
		this.ui.showError(mxResources.get('externalChanges'), mxResources.get('fileChangedOverwrite'),
			mxResources.get('makeCopy'), mxUtils.bind(this, function()
		{
			this.showingConflictDialog = false;
			this.changeListenerEnabled = prev;
			
			if (this.isRestricted())
			{
				this.ui.editor.editAsNew(this.ui.getFileData(true));
				resume();
				error();
			}
			else
			{
				this.makeCopy(retry, error, true);
			}
			
			logAction('makeCopy');
		}), null, mxResources.get('overwrite'), mxUtils.bind(this, function()
		{
			this.showingConflictDialog = false;
			this.changeListenerEnabled = prev;
			resume();
			retry();
			logAction('overwrite');
		}), mxResources.get('cancel'), mxUtils.bind(this, function()
		{
			this.showingConflictDialog = false;
			this.changeListenerEnabled = prev;
			this.ui.hideDialog();
			resume();
			error();
			logAction('cancel');
		}), 360, 180);
		
		// Adds important notice to dialog
		if (this.ui.dialog != null && this.ui.dialog.container != null)
		{
			var alert = this.ui.createRealtimeNotice();
			alert.style.left = '0';
			alert.style.right = '0';
			alert.style.borderRadius = '0';
			alert.style.borderLeftStyle = 'none';
			alert.style.borderRightStyle = 'none';
			alert.style.marginBottom = '26px';
			alert.style.padding = '8px 0 8px 0';

			this.ui.dialog.container.appendChild(alert);
		}
	}
};
