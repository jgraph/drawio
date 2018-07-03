/**
 * Copyright (c) 2006-2017, JGraph Ltd
 * Copyright (c) 2006-2017, Gaudenz Alder
 */
DropboxFile = function(ui, data, stat)
{
	DrawioFile.call(this, ui, data);
	
	this.stat = stat;
};

//Extends mxEventSource
mxUtils.extend(DropboxFile, DrawioFile);

/**
 * Translates this point by the given vector.
 * 
 * @param {number} dx X-coordinate of the translation.
 * @param {number} dy Y-coordinate of the translation.
 */
DropboxFile.prototype.getHash = function()
{
	return 'D' + encodeURIComponent(this.stat.path_display.substring(1));
};

/**
 * Translates this point by the given vector.
 * 
 * @param {number} dx X-coordinate of the translation.
 * @param {number} dy Y-coordinate of the translation.
 */
DropboxFile.prototype.getMode = function()
{
	return App.MODE_DROPBOX;
};

/**
 * Overridden to enable the autosave option in the document properties dialog.
 */
DropboxFile.prototype.isAutosaveOptional = function()
{
	return true;
};

/**
 * Translates this point by the given vector.
 * 
 * @param {number} dx X-coordinate of the translation.
 * @param {number} dy Y-coordinate of the translation.
 */
DropboxFile.prototype.getTitle = function()
{
	return this.stat.name;
};

/**
 * Translates this point by the given vector.
 * 
 * @param {number} dx X-coordinate of the translation.
 * @param {number} dy Y-coordinate of the translation.
 */
DropboxFile.prototype.isRenamable = function()
{
	return true;
};

/**
 * Translates this point by the given vector.
 * 
 * @param {number} dx X-coordinate of the translation.
 * @param {number} dy Y-coordinate of the translation.
 */
DropboxFile.prototype.save = function(revision, success, error)
{
	this.doSave(this.getTitle(), success, error);
};

/**
 * Translates this point by the given vector.
 * 
 * @param {number} dx X-coordinate of the translation.
 * @param {number} dy Y-coordinate of the translation.
 */
DropboxFile.prototype.saveAs = function(title, success, error)
{
	this.doSave(title, success, error);
};

/**
 * Translates this point by the given vector.
 * 
 * @param {number} dx X-coordinate of the translation.
 * @param {number} dy Y-coordinate of the translation.
 */
DropboxFile.prototype.doSave = function(title, success, error)
{
	// Forces update of data for new extensions
	var prev = this.stat.name;
	this.stat.name = title;
	DrawioFile.prototype.save.apply(this, arguments);
	this.stat.name = prev;
	
	this.saveFile(title, false, success, error);
};

/**
 * Translates this point by the given vector.
 * 
 * @param {number} dx X-coordinate of the translation.
 * @param {number} dy Y-coordinate of the translation.
 */
DropboxFile.prototype.saveFile = function(title, revision, success, error)
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
		var fn = mxUtils.bind(this, function(checked)
		{
			if (checked)
			{
				this.savingFile = true;
				
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
				
				var doSave = mxUtils.bind(this, function(data)
				{
					var index = this.stat.path_display.lastIndexOf('/');
					var folder = (index > 1) ? this.stat.path_display.substring(1, index + 1) : null;
					
					this.ui.dropbox.saveFile(title, data, mxUtils.bind(this, function(stat)
					{
						this.savingFile = false;
						this.isModified = prevModified;
						this.stat = stat;
						this.contentChanged();
						
						if (success != null)
						{
							success();
						}
					}), mxUtils.bind(this, function(err)
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
					}), folder);
				});
				
				if (this.ui.useCanvasForExport && /(\.png)$/i.test(this.getTitle()))
				{
					this.ui.getEmbeddedPng(mxUtils.bind(this, function(data)
					{
						doSave(this.ui.base64ToBlob(data, 'image/png'));
					}), error, (this.ui.getCurrentFile() != this) ? this.getData() : null);
				}
				else
				{
					doSave(this.getData());
				}
			}
			else if (error != null)
			{
				error();
			}
		});
		
		if (this.getTitle() == title)
		{
			fn(true);
		}
		else
		{
			this.ui.dropbox.checkExists(title, fn);
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
DropboxFile.prototype.rename = function(title, success, error)
{
	this.ui.dropbox.renameFile(this, title, mxUtils.bind(this, function(stat)
	{
		if (!this.hasSameExtension(title, this.getTitle()))
		{
			this.stat = stat;
			// Required in this case to update hash tag in page
			// before saving so that the edit link is correct
			this.descriptorChanged();
			this.save(true, success, error);
		}
		else
		{
			this.stat = stat;
			this.descriptorChanged();
			
			if (success != null)
			{
				success();
			}
		}
	}), error);
};
