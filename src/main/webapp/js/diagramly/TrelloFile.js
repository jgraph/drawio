/**
 * Copyright (c) 2006-2017, JGraph Ltd
 * Copyright (c) 2006-2017, Gaudenz Alder
 */
TrelloFile = function(ui, data, meta)
{
	DrawioFile.call(this, ui, data);
	
	this.meta = meta;
	this.saveNeededCounter = 0;
};

//Extends mxEventSource
mxUtils.extend(TrelloFile, DrawioFile);

/**
 * 
 */
TrelloFile.prototype.getHash = function()
{
	return 'T' + encodeURIComponent(this.meta.compoundId);
};

/**
 * 
 */
TrelloFile.prototype.getMode = function()
{
	return App.MODE_TRELLO;
};

/**
 * Overridden to enable the autosave option in the document properties dialog.
 */
TrelloFile.prototype.isAutosave = function()
{
	return true;
};

/**
 * 
 */
TrelloFile.prototype.getTitle = function()
{
	return this.meta.name;
};

/**
 * 
 */
TrelloFile.prototype.isRenamable = function()
{
	return false;
};

/**
 * 
 */
TrelloFile.prototype.save = function(revision, success, error)
{
	this.doSave(this.getTitle(), success, error);
};

/**
 * 
 */
TrelloFile.prototype.saveAs = function(title, success, error)
{
	this.doSave(title, success, error);
};

/**
 * 
 */
TrelloFile.prototype.doSave = function(title, success, error)
{
	// Forces update of data for new extensions
	var prev = this.meta.name;
	this.meta.name = title;
	DrawioFile.prototype.save.apply(this, arguments);
	this.meta.name = prev;
	
	this.saveFile(title, false, success, error);
};

/**
 * 
 */
TrelloFile.prototype.saveFile = function(title, revision, success, error)
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
			
			this.ui.trello.saveFile(this, mxUtils.bind(this, function(meta)
			{
				this.savingFile = false;
				this.isModified = prevModified;
				this.meta = meta;
				this.contentChanged();
				
				if (success != null)
				{
					success();
				}
				if (this.saveNeededCounter > 0) {
					this.saveNeededCounter--;
					this.saveFile(title, revision, success, error);
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
			this.ui.pickFolder(App.MODE_TRELLO, mxUtils.bind(this, function(cardId)
			{
				this.ui.trello.insertFile(title, this.getData(), mxUtils.bind(this, function(file)
				{
					this.savingFile = false;
					
					if (success != null)
					{
						success();
					}
					
					this.ui.fileLoaded(file);
					
					if (this.saveNeededCounter > 0) {
						this.saveNeededCounter--;
						this.saveFile(title, revision, success, error);
					}
				}), mxUtils.bind(this, function()
				{
					this.savingFile = false;
					
					if (error != null)
					{
						error();
					}
				}), false, cardId);
			}));
		}
	}
	else if (error != null)
	{
		this.saveNeededCounter++;
		error({code: App.ERROR_BUSY});
	}
};
