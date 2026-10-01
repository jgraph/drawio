/**
 * Copyright (c) 2006-2017, JGraph Holdings Ltd
 * Copyright (c) 2006-2017, draw.io AG
 */
GitHubFile = function(ui, data, meta)
{
	DrawioFile.call(this, ui, data);
	
	this.meta = meta;
	this.peer = this.ui.gitHub;
};

//Extends mxEventSource
mxUtils.extend(GitHubFile, DrawioFile);

/**
 * Opens the access settings of the repository on GitHub.
 */
GitHubFile.prototype.share = function()
{
	this.ui.editor.graph.openLink('https://github.com/' +
		encodeURIComponent(this.meta.org) + '/' +
		encodeURIComponent(this.meta.repo) +'/settings/access');
};

/**
 * Returns the ID of the file, which consists of the URI-encoded organization
 * and repository, the ref and the path.
 */
GitHubFile.prototype.getId = function()
{
	return encodeURIComponent(this.meta.org) + '/' +
		((this.meta.repo != null) ? encodeURIComponent(this.meta.repo) + '/' +
		((this.meta.ref != null) ? this.meta.ref +
		((this.meta.path != null) ? '/' + this.meta.path : '') : '') : '');
};

/**
 * Returns the hash of the file, which is the URI-encoded H followed by the
 * ID.
 */
GitHubFile.prototype.getHash = function()
{
	return encodeURIComponent('H' + this.getId());
};

/**
 * Returns the URL of the file on GitHub.
 */
GitHubFile.prototype.getFileUrl = function()
{
	return 'https://github.com/' + encodeURIComponent(this.meta.org) + '/' +
		encodeURIComponent(this.meta.repo) + '/blob/' +
		this.meta.ref + '/' + this.meta.path;
};

/**
 * Returns the URL of the folder of the file on GitHub.
 */
GitHubFile.prototype.getFolderUrl = function()
{
	return 'https://github.com/' + encodeURIComponent(this.meta.org) + '/' +
		encodeURIComponent(this.meta.repo) + '/tree/' + this.meta.ref + '/' +
		this.meta.path.split('/').slice(0, -1).join('/');
};

/**
 * Passes the download URL of the file to the given function if it can be
 * accessed without a token, otherwise null.
 */
GitHubFile.prototype.getPublicUrl = function(fn)
{
	if (this.meta.download_url != null)
	{
		try
		{
			// Checks for short-term token in URL which means private repo
			var url = new URL(this.meta.download_url);

			if (url.search != '')
			{
				fn(null);
			}
			else
			{
				mxUtils.get(this.meta.download_url, mxUtils.bind(this, function(req)
				{
					fn((req.getStatus() >= 200 && req.getStatus() <= 299) ? this.meta.download_url : null);
				}), mxUtils.bind(this, function()
				{
					fn(null);
				}));
			}
		}
		catch (e)
		{
			fn(null);
		}
	}
	else
	{
		fn(null);
	}
};

/**
 * Returns true if the given error is a conflict (HTTP 409).
 */
GitHubFile.prototype.isConflict = function(err)
{
	return err != null && err.status == 409;
};

/**
 * Returns App.MODE_GITHUB.
 */
GitHubFile.prototype.getMode = function()
{
	return App.MODE_GITHUB;
};

/**
 * Returns false to disable autosave for GitHub files.
 */
GitHubFile.prototype.isAutosave = function()
{
	return false;
};

/**
 * Returns the name of the file.
 */
GitHubFile.prototype.getTitle = function()
{
	return this.meta.name;
};

/**
 * Returns false since GitHub files cannot be renamed.
 */
GitHubFile.prototype.isRenamable = function()
{
	return false;
};

/**
 * Loads the latest version of the file and passes it to success.
 */
GitHubFile.prototype.getLatestVersion = function(success, error)
{
	this.peer.getFile(this.getId(), success, error);
};

/**
 * Returns the metadata of the file.
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
 * Returns the SHA from the given descriptor.
 */
GitHubFile.prototype.getDescriptorEtag = function(desc)
{
	return desc.sha;
};

/**
 * Sets the SHA of the given descriptor.
 */
GitHubFile.prototype.setDescriptorEtag = function(desc, etag)
{
	desc.sha = etag;
};

/**
 * Saves the file under its current title with the optional commit message.
 */
GitHubFile.prototype.save = function(revision, success, error, unloading, overwrite, message)
{
	this.doSave(this.getTitle(), success, error, unloading, overwrite, message);
};

/**
 * Saves the file with the given title.
 */
GitHubFile.prototype.saveAs = function(title, success, error)
{
	this.doSave(title, success, error);
};

/**
 * Updates the file data using the extension of the given title and saves
 * the file with the given title and optional commit message.
 */
GitHubFile.prototype.doSave = function(title, success, error, unloading, overwrite, message)
{
	// Forces update of data for new extensions
	var prev = this.meta.name;
	this.meta.name = title;
	
	DrawioFile.prototype.save.apply(this, [null, mxUtils.bind(this, function()
	{
		this.meta.name = prev;
		this.saveFile(title, false, success, error, unloading, overwrite, message);
	}), error, unloading, overwrite]);
};

/**
 * Commits the file with the given commit message, or asks for a message
 * first. If the title has changed, the data is inserted as a new file in a
 * folder picked by the user, which is then opened.
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
				try
				{
					// Sets shadow modified state during save
					this.savingFileTime = new Date();
					this.setShadowModified(false);
					this.savingFile = true;
						
					var savedEtag = this.getCurrentEtag();
					var savedData = this.data;

					this.peer.saveFile(this, mxUtils.bind(this, function(etag)
					{
						// Checks for changes during save
						this.setModified(this.getShadowModified());
						this.savingFile = false;
						this.setDescriptorEtag(this.meta, etag);
						
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
	
						if (this.isConflict(err))
						{
							this.inConflictState = true;
							
							if (error != null)
							{
								// Adds commit message to save after
								// conflict has been resolved
								err.commitMessage = message;
								error(err);
							}
						}
						else if (error != null)
						{
							error(err);
						}
					}), overwrite, message);
				}
				catch (e)
				{
					this.savingFile = false;
					
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
				// Sets shadow modified state during save
				this.savingFileTime = new Date();
				this.setShadowModified(false);
				this.savingFile = true;
				
				this.ui.pickFolder(this.getMode(), mxUtils.bind(this, function(folderId)
				{
					this.peer.insertFile(title, this.getData(), mxUtils.bind(this, function(file)
					{
						// Checks for changes during save
						this.setModified(this.getShadowModified());
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
			this.peer.showCommitDialog(this.meta.name,
				this.getDescriptorEtag(this.meta) == null ||
				this.meta.isNew, mxUtils.bind(this, function(message)
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
