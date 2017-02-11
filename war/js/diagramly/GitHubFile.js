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
GitHubFile.prototype.getHash = function()
{
	return encodeURIComponent('H' + encodeURIComponent(this.meta.org) + '/' +
		((this.meta.repo != null) ?
			encodeURIComponent(this.meta.repo) + '/' +
			((this.meta.ref != null) ?
				encodeURIComponent(this.meta.ref) +
				((this.meta.path != null) ? '/' + this.meta.path
				: '') : '') : ''));
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
 * Translates this point by the given vector.
 * 
 * @param {number} dx X-coordinate of the translation.
 * @param {number} dy Y-coordinate of the translation.
 */
GitHubFile.prototype.save = function(revision, success, error)
{
	this.doSave(this.getTitle(), success, error);
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
GitHubFile.prototype.doSave = function(title, success, error)
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
GitHubFile.prototype.saveFile = function(title, revision, success, error)
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
			this.setModified(false);
			
			this.ui.gitHub.saveFile(this, mxUtils.bind(this, function(sha)
			{
				this.savingFile = false;
				this.isModified = prevModified;

				if (success != null)
				{
					success();
				}
				
				// No sha means save was cancelled
				if (sha == null)
				{
					this.setModified(modified || this.isModified());
					
					if (this.isModified())
					{
						this.addUnsavedStatus();
					}
				}
				else
				{
					this.meta.sha = sha;
					this.contentChanged();
				}
			}),
			mxUtils.bind(this, function(err)
			{
				this.savingFile = false;
				this.isModified = prevModified;
				this.setModified(modified || this.isModified());
				
				if (this.isModified())
				{
					this.addUnsavedStatus();
				}
				
				if (error != null)
				{
					error(err);
				}
			}));
		}
		else
		{
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
				}), false, folderId);
			}));
		}
	}
	else if (error != null)
	{
		error({code: App.ERROR_BUSY});
	}
};
