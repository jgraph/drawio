/**
 * Copyright (c) 2006-2021, JGraph Ltd
 * Copyright (c) 2006-2021, Gaudenz Alder
 */
NotionFile = function(ui, data, meta)
{
	DrawioFile.call(this, ui, data);
	
	this.meta = meta;
	this.peer = this.ui.notion;
};

//Extends mxEventSource
mxUtils.extend(NotionFile, DrawioFile);

/**
 * 
 */
NotionFile.prototype.getId = function()
{
	return this.meta.id;
};

/**
 * 
 */
NotionFile.prototype.getHash = function()
{
	return encodeURIComponent('N' + this.getId());
};

/**
 * 
 */
NotionFile.prototype.getMode = function()
{
	return App.MODE_NOTION;
};

/**
 * Overridden to enable the autosave option in the document properties dialog.
 */
NotionFile.prototype.isAutosave = function()
{
	return false;
};

/**
 * 
 */
NotionFile.prototype.getTitle = function()
{
	return this.meta.name;
};

/**
 * 
 */
NotionFile.prototype.getNameField = function()
{
	return this.meta.nameField;
};

/**
 * 
 */
NotionFile.prototype.isRenamable = function()
{
	return false;
};


/**
 * 
 */
NotionFile.prototype.isCompressedStorage = function()
{
	return true;
};

/**
 * 
 */
NotionFile.prototype.save = function(revision, success, error, unloading, overwrite)
{
	this.doSave(this.getTitle(), success, error, unloading, overwrite);
};

/**
 * 
 */
NotionFile.prototype.saveAs = function(title, success, error)
{
	this.doSave(title, success, error);
};

/**
 * 
 */
NotionFile.prototype.doSave = function(title, success, error, unloading, overwrite)
{
	// Forces update of data for new extensions
	var prev = this.meta.name;
	this.meta.name = title;
	
	DrawioFile.prototype.save.apply(this, [null, mxUtils.bind(this, function()
	{
		this.meta.name = prev;
		this.saveFile(title, false, success, error, unloading, overwrite);
	}), error, unloading, overwrite]);
};

/**
 * 
 */
NotionFile.prototype.saveFile = function(title, revision, success, error, unloading, overwrite)
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
			try
			{
				// Sets shadow modified state during save
				this.savingFileTime = new Date();
				this.setShadowModified(false);
				this.savingFile = true;
					
				var savedData = this.data;

				this.peer.saveFile(this, mxUtils.bind(this, function()
				{
					// Checks for changes during save
					this.setModified(this.getShadowModified());
					this.savingFile = false;
					
					if (success != null)
					{
						success();
					}
				}),
				mxUtils.bind(this, function(err)
				{
					this.savingFile = false;

					if (error != null)
					{
						error(err);
					}
				}), overwrite);
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
				}), false, folderId);
			}));
		}
	}
	else if (error != null)
	{
		error({code: App.ERROR_BUSY});
	}
};
