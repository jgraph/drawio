/**
 * Copyright (c) 2006-2017, JGraph Ltd
 * Copyright (c) 2006-2017, Gaudenz Alder
 */
GitLabFile = function(ui, data, meta)
{
	DrawioFile.call(this, ui, data);
	
	this.meta = meta;
};

//Extends mxEventSource
mxUtils.extend(GitLabFile, GitHubFile);

/**
 * Translates this point by the given vector.
 * 
 * @param {number} dx X-coordinate of the translation.
 * @param {number} dy Y-coordinate of the translation.
 */
GitLabFile.prototype.getId = function()
{
	return encodeURIComponent(this.meta.org) + '/' +
		((this.meta.repo != null) ? encodeURIComponent(this.meta.repo) + '/' +
		((this.meta.ref != null) ? this.meta.ref +
		((this.meta.path != null) ? '/' + this.meta.path : '') : '') : '');
};

/**
 * Translates this point by the given vector.
 * 
 * @param {number} dx X-coordinate of the translation.
 * @param {number} dy Y-coordinate of the translation.
 */
GitLabFile.prototype.getHash = function()
{
	return encodeURIComponent('A' + this.getId());
};

/**
 * Returns true if copy, export and print are not allowed for this file.
 */
GitLabFile.prototype.getPublicUrl = function(fn)
{
	// LATER: Check if download_url is always null for private repos
	if (this.meta.download_url != null)
	{
		mxUtils.get(this.meta.download_url, mxUtils.bind(this, function(req)
		{
			fn((req.getStatus() >= 200 && req.getStatus() <= 299) ? this.meta.download_url : null);
		}), mxUtils.bind(this, function()
		{
			fn(null);
		}));
	}
	else
	{
		fn(null);
	}
};

/**
 * Adds the listener for automatically saving the diagram for local changes.
 */
GitLabFile.prototype.isConflict = function(err)
{
	return err != null && err.status == 400;
};

/**
 * Translates this point by the given vector.
 * 
 * @param {number} dx X-coordinate of the translation.
 * @param {number} dy Y-coordinate of the translation.
 */
GitLabFile.prototype.getMode = function()
{
	return App.MODE_GITLAB;
};

/**
 * Adds the listener for automatically saving the diagram for local changes.
 */
GitLabFile.prototype.getLatestVersion = function(success, error)
{
	this.ui.gitLab.getFile(this.getId(), success, error);
};

/**
 * Adds all listeners.
 */
GitLabFile.prototype.getDescriptorEtag = function(desc)
{
	return desc.last_commit_id;
};

/**
 * Adds the listener for automatically saving the diagram for local changes.
 */
GitLabFile.prototype.setDescriptorEtag = function(desc, etag)
{
	desc.last_commit_id = etag;
};

/**
 * Translates this point by the given vector.
 * 
 * @param {number} dx X-coordinate of the translation.
 * @param {number} dy Y-coordinate of the translation.
 */
GitLabFile.prototype.saveFile = function(title, revision, success, error, unloading, overwrite, message)
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
		var doSave = mxUtils.bind(this, function(message)
		{
			if (this.getTitle() == title)
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
						
					// Makes sure no changes get lost while the file is saved
					var prepare = mxUtils.bind(this, function()
					{
						this.setModified(false);
						
						this.isModified = function()
						{
							return modified;
						};
					});
					
					var savedEtag = this.getCurrentEtag();
					var savedData = this.data;
					prepare();
					
					this.ui.gitLab.saveFile(this, mxUtils.bind(this, function(commit)
					{
						this.isModified = prevModified;
						this.savingFile = false;
						
						this.meta.sha = commit.content.sha;
						this.meta.html_url = commit.content.html_url;
						this.meta.download_url = commit.content.download_url;
						this.meta.last_commit_id = commit.content.last_commit_id;
						
						this.fileSaved(savedData, savedEtag, mxUtils.bind(this, function()
						{
							this.contentChanged();
							
							if (success != null)
							{
								success();
							}
						}), error);
					}),
					mxUtils.bind(this, function(err)
					{
						this.savingFile = false;
						this.isModified = prevModified;
						this.setModified(modified || this.isModified());
	
						if (this.isConflict(err))
						{
							this.inConflictState = true;
							
							if (error != null)
							{
								// Passes current commit message to avoid
								// multiple dialogs after synchronize
								error({commitMessage: message});
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
					}), overwrite, message);
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
			}
			else
			{
				this.savingFile = true;
				
				this.ui.pickFolder(App.MODE_GITLAB, mxUtils.bind(this, function(folderId)
				{
					this.ui.gitLab.insertFile(title, this.getData(), mxUtils.bind(this, function(file)
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
					}), false, folderId, message);
				}));
			}
		});
		
		if (message != null)
		{
			doSave(message);
		}
		else
		{
			this.ui.gitLab.showCommitDialog(this.meta.name,
				this.meta.last_commit_id == null || this.meta.isNew,
				mxUtils.bind(this, function(message)
			{
				doSave(message);	
			}), error);
		}
	}
	else if (error != null)
	{
		error({code: App.ERROR_BUSY});
	}
};
