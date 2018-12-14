/**
 * Copyright (c) 2006-2017, JGraph Ltd
 * Copyright (c) 2006-2017, Gaudenz Alder
 */
GitHubFile = function(ui, data, meta)
{
	DrawioFile.call(this, ui, data);
	
	this.meta = meta;
};

//Extends mxEventSource
mxUtils.extend(GitHubFile, DrawioFile);

/**
 * Translates this point by the given vector.
 * 
 * @param {number} dx X-coordinate of the translation.
 * @param {number} dy Y-coordinate of the translation.
 */
GitHubFile.prototype.getId = function()
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
GitHubFile.prototype.getHash = function()
{
	return encodeURIComponent('H' + this.getId());
};

/**
 * Returns true if copy, export and print are not allowed for this file.
 */
GitHubFile.prototype.getPublicUrl = function(fn)
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
GitHubFile.prototype.isConflict = function(err)
{
	return err != null && err.status == 409;
};

/**
 * Translates this point by the given vector.
 * 
 * @param {number} dx X-coordinate of the translation.
 * @param {number} dy Y-coordinate of the translation.
 */
GitHubFile.prototype.getMode = function()
{
	return App.MODE_GITHUB;
};

/**
 * Overridden to enable the autosave option in the document properties dialog.
 */
GitHubFile.prototype.isAutosave = function()
{
	return false;
};

/**
 * Translates this point by the given vector.
 * 
 * @param {number} dx X-coordinate of the translation.
 * @param {number} dy Y-coordinate of the translation.
 */
GitHubFile.prototype.getTitle = function()
{
	return this.meta.name;
};

/**
 * Translates this point by the given vector.
 * 
 * @param {number} dx X-coordinate of the translation.
 * @param {number} dy Y-coordinate of the translation.
 */
GitHubFile.prototype.isRenamable = function()
{
	return false;
};

/**
 * Adds the listener for automatically saving the diagram for local changes.
 */
GitHubFile.prototype.getLatestVersion = function(success, error)
{
	this.ui.gitHub.getFile(this.getId(), success, error);
};

/**
 * Hook for subclassers to update the descriptor from given file
 */
GitHubFile.prototype.getDescriptor = function()
{
	return this.meta;
};

/**
 * Hook for subclassers to update the descriptor from given file
 */
GitHubFile.prototype.setDescriptor = function(desc)
{
	this.meta = desc;
};

/**
 * Adds all listeners.
 */
GitHubFile.prototype.getDescriptorEtag = function(desc)
{
	return desc.sha;
};

/**
 * Adds the listener for automatically saving the diagram for local changes.
 */
GitHubFile.prototype.setDescriptorEtag = function(desc, etag)
{
	desc.sha = etag;
};

/**
 * Translates this point by the given vector.
 * 
 * @param {number} dx X-coordinate of the translation.
 * @param {number} dy Y-coordinate of the translation.
 */
GitHubFile.prototype.save = function(revision, success, error, unloading, overwrite, message)
{
	this.doSave(this.getTitle(), success, error, unloading, overwrite, message);
};

/**
 * Translates this point by the given vector.
 * 
 * @param {number} dx X-coordinate of the translation.
 * @param {number} dy Y-coordinate of the translation.
 */
GitHubFile.prototype.saveAs = function(title, success, error)
{
	this.doSave(title, success, error);
};

/**
 * Translates this point by the given vector.
 * 
 * @param {number} dx X-coordinate of the translation.
 * @param {number} dy Y-coordinate of the translation.
 */
GitHubFile.prototype.doSave = function(title, success, error, unloading, overwrite, message)
{
	// Forces update of data for new extensions
	var prev = this.meta.name;
	this.meta.name = title;
	DrawioFile.prototype.save.apply(this, arguments);
	this.meta.name = prev;
	
	this.saveFile(title, false, success, error, unloading, overwrite, message);
};

/**
 * Translates this point by the given vector.
 * 
 * @param {number} dx X-coordinate of the translation.
 * @param {number} dy Y-coordinate of the translation.
 */
GitHubFile.prototype.saveFile = function(title, revision, success, error, unloading, overwrite, message)
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
				var savedEtag = this.getCurrentEtag();
				var savedData = this.data;

				// Makes sure no changes get lost while the file is saved
				var prevModified = this.isModified;
				var modified = this.isModified();
				this.savingFile = true;
					
				var prepare = mxUtils.bind(this, function()
				{
					this.setModified(false);
					
					this.isModified = function()
					{
						return modified;
					};
				});
				
				prepare();
				
				this.ui.gitHub.saveFile(this, mxUtils.bind(this, function(commit)
				{
					this.isModified = prevModified;
					this.savingFile = false;
					
					this.meta.sha = commit.content.sha;
					this.meta.html_url = commit.content.html_url;
					this.meta.download_url = commit.content.download_url;
					
					this.contentChanged();
					this.fileSaved(savedData, savedEtag, mxUtils.bind(this, function()
					{
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
			else
			{
				this.savingFile = true;
				
				this.ui.pickFolder(App.MODE_GITHUB, mxUtils.bind(this, function(folderId)
				{
					this.ui.gitHub.insertFile(title, this.getData(), mxUtils.bind(this, function(file)
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
			this.ui.gitHub.showCommitDialog(this.meta.name, this.meta.sha == null || this.meta.isNew,
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
