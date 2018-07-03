/**
 * Copyright (c) 2006-2017, JGraph Ltd
 * Copyright (c) 2006-2017, Gaudenz Alder
 */
DrawioFile = function(ui, data)
{
	mxEventSource.call(this);
	
	/**
	 * Holds the x-coordinate of the point.
	 * @type number
	 * @default 0
	 */
	this.ui = ui;
	
	/**
	 * Holds the x-coordinate of the point.
	 * @type number
	 * @default 0
	 */
	this.data = data || '';
};

//Extends mxEventSource
mxUtils.extend(DrawioFile, mxEventSource);

/**
 * Sets the delay for autosave in milliseconds. Default is 1500.
 */
DrawioFile.prototype.autosaveDelay = 1500;

/**
 * Sets the delay for autosave in milliseconds. Default is 30000.
 */
DrawioFile.prototype.maxAutosaveDelay = 30000;

/**
 * Sets the delay for autosave in milliseconds. Default is 2000.
 */
DrawioFile.prototype.autosaveThread = null;

/**
 * Sets the delay for autosave in milliseconds. Default is 500.
 */
DrawioFile.prototype.lastAutosave = null;

/**
 * Sets the delay for autosave in milliseconds. Default is 1500.
 */
DrawioFile.prototype.modified = false;

/**
 * Specifies if the graph change listener is enabled. Default is true.
 */
DrawioFile.prototype.changeListenerEnabled = true;

/**
 * Sets the delay for autosave in milliseconds. Default is 1500.
 */
DrawioFile.prototype.lastAutosaveRevision = null;

/**
 * Sets the delay for autosave in milliseconds. Default is 1000.
 */
DrawioFile.prototype.maxAutosaveRevisionDelay = 1800000;

/**
 * Translates this point by the given vector.
 * 
 * @param {number} dx X-coordinate of the translation.
 * @param {number} dy Y-coordinate of the translation.
 */
DrawioFile.prototype.descriptorChanged = function()
{
	this.fireEvent(new mxEventObject('descriptorChanged'));
};

/**
 * Translates this point by the given vector.
 * 
 * @param {number} dx X-coordinate of the translation.
 * @param {number} dy Y-coordinate of the translation.
 */
DrawioFile.prototype.contentChanged = function()
{
	this.fireEvent(new mxEventObject('contentChanged'));
};

/**
 * Adds the listener for automatically saving the diagram for local changes.
 */
DrawioFile.prototype.save = function(revision, success, error, unloading)
{
	this.updateFileData();
	this.clearAutosave();
};

/**
 * Translates this point by the given vector.
 * 
 * @param {number} dx X-coordinate of the translation.
 * @param {number} dy Y-coordinate of the translation.
 */
DrawioFile.prototype.updateFileData = function()
{
	this.setData(this.ui.getFileData(null, null, null, null, null, null, null, null, this));
};

/**
 * Translates this point by the given vector.
 * 
 * @param {number} dx X-coordinate of the translation.
 * @param {number} dy Y-coordinate of the translation.
 */
DrawioFile.prototype.saveAs = function(filename, success, error) { };

/**
 * Translates this point by the given vector.
 * 
 * @param {number} dx X-coordinate of the translation.
 * @param {number} dy Y-coordinate of the translation.
 */
DrawioFile.prototype.saveFile = function(title, revision, success, error) { };

/**
 * Returns true if copy, export and print are not allowed for this file.
 */
DrawioFile.prototype.getPublicUrl = function(fn)
{
	fn(null);
};

/**
 * Returns true if copy, export and print are not allowed for this file.
 */
DrawioFile.prototype.isRestricted = function()
{
	return false;
};

/**
 * Translates this point by the given vector.
 * 
 * @param {number} dx X-coordinate of the translation.
 * @param {number} dy Y-coordinate of the translation.
 */
DrawioFile.prototype.isModified = function()
{
	return this.modified;
};

/**
 * Translates this point by the given vector.
 * 
 * @param {number} dx X-coordinate of the translation.
 * @param {number} dy Y-coordinate of the translation.
 */
DrawioFile.prototype.setModified = function(value)
{
	this.modified = value;
};

/**
 * Specifies if the autosave checkbox should be shown in the document
 * properties dialog. Default is false.
 */
DrawioFile.prototype.isAutosaveOptional = function()
{
	return false;
};

/**
 * Translates this point by the given vector.
 * 
 * @param {number} dx X-coordinate of the translation.
 * @param {number} dy Y-coordinate of the translation.
 */
DrawioFile.prototype.isAutosave = function()
{
	return this.ui.editor.autosave;
};

/**
 * Translates this point by the given vector.
 * 
 * @param {number} dx X-coordinate of the translation.
 * @param {number} dy Y-coordinate of the translation.
 */
DrawioFile.prototype.isRenamable = function()
{
	return false;
};

/**
 * Translates this point by the given vector.
 * 
 * @param {number} dx X-coordinate of the translation.
 * @param {number} dy Y-coordinate of the translation.
 */
DrawioFile.prototype.rename = function(title, success, error) { };

/**
 * Translates this point by the given vector.
 * 
 * @param {number} dx X-coordinate of the translation.
 * @param {number} dy Y-coordinate of the translation.
 */
DrawioFile.prototype.isMovable = function()
{
	return false;
};

/**
 * Translates this point by the given vector.
 * 
 * @param {number} dx X-coordinate of the translation.
 * @param {number} dy Y-coordinate of the translation.
 */
DrawioFile.prototype.move = function(folderId, success, error) { };

/**
 * Translates this point by the given vector.
 * 
 * @param {number} dx X-coordinate of the translation.
 * @param {number} dy Y-coordinate of the translation.
 */
DrawioFile.prototype.getHash = function()
{
	return '';
};

/**
 * Translates this point by the given vector.
 * 
 * @param {number} dx X-coordinate of the translation.
 * @param {number} dy Y-coordinate of the translation.
 */
DrawioFile.prototype.getId = function()
{
	return '';
};

/**
 * Translates this point by the given vector.
 * 
 * @param {number} dx X-coordinate of the translation.
 * @param {number} dy Y-coordinate of the translation.
 */
DrawioFile.prototype.isEditable = function()
{
	return !this.ui.editor.isChromelessView() || this.ui.editor.editable;
};

/**
 * Returns the location as a new object.
 * @type mx.Point
 */
DrawioFile.prototype.getUi = function()
{
	return this.ui;
};

/**
 * Translates this point by the given vector.
 * 
 * @param {number} dx X-coordinate of the translation.
 * @param {number} dy Y-coordinate of the translation.
 */
DrawioFile.prototype.getTitle = function()
{
	return '';
};

/**
 * Sets the location of this point.
 * 
 * @param {number} x New X-coordinate of the point.
 * @param {number} y New Y-coordinate of the point.
 */
DrawioFile.prototype.setData = function(data)
{
	this.data = data;
};

/**
 * Returns the location as a new object.
 * @type mx.Point
 */
DrawioFile.prototype.getData = function()
{
	return this.data;
};

/**
 * Returns the location as a new object.
 * @type mx.Point
 */
DrawioFile.prototype.open = function()
{
	this.ui.setFileData(this.getData());
	
	this.changeListener = mxUtils.bind(this, function(sender, eventObject)
	{
		var edit = (eventObject != null) ? eventObject.getProperty('edit') : null;
		
		if (this.changeListenerEnabled && this.isEditable() &&
			(edit == null || !edit.ignoreEdit))
		{
			this.setModified(true);
			
			if (this.isAutosave())
			{
				this.ui.editor.setStatus(mxUtils.htmlEntities(mxResources.get('saving')) + '...');
				
				this.autosave(this.autosaveDelay, this.maxAutosaveDelay, mxUtils.bind(this, function(resp)
				{
					// Does not update status if another autosave was scheduled
					if (this.autosaveThread == null && this.ui.getCurrentFile() == this && !this.isModified())
					{
						this.ui.editor.setStatus(mxUtils.htmlEntities(mxResources.get('allChangesSaved')));
					}
				}), mxUtils.bind(this, function(resp)
				{
					if (this.ui.getCurrentFile() == this)
					{
						this.addUnsavedStatus(resp);
					}
				}));
			}
			else
			{
				this.addUnsavedStatus();
			}
		}
	});
	
	this.ui.editor.graph.model.addListener(mxEvent.CHANGE, this.changeListener);

	// Some options trigger autosave
	this.ui.editor.graph.addListener('gridSizeChanged', this.changeListener);
	this.ui.editor.graph.addListener('shadowVisibleChanged', this.changeListener);
	this.ui.addListener('pageFormatChanged', this.changeListener);
	this.ui.addListener('pageScaleChanged', this.changeListener);
	this.ui.addListener('backgroundColorChanged', this.changeListener);
	this.ui.addListener('backgroundImageChanged', this.changeListener);
	this.ui.addListener('foldingEnabledChanged', this.changeListener);
	this.ui.addListener('mathEnabledChanged', this.changeListener);
	this.ui.addListener('gridEnabledChanged', this.changeListener);
	this.ui.addListener('guidesEnabledChanged', this.changeListener);
	this.ui.addListener('pageViewChanged', this.changeListener);
};

/**
 * Adds the listener for automatically saving the diagram for local changes.
 */
DrawioFile.prototype.addUnsavedStatus = function(err)
{
	if (err instanceof Error && err.message != null)
	{
		this.ui.editor.setStatus('<div class="geStatusAlert" style="overflow:hidden;">' +
				mxUtils.htmlEntities(mxResources.get('unsavedChanges')) +
				' (' + mxUtils.htmlEntities(err.message) + ')</div>');
	}
	else
	{
		// FIXME: Handle multiple tabs
//		if (this.ui.mode == null && urlParams['splash'] == '0')
//		{
//			try
//			{
//				this.ui.updateDraft();
//				this.setModified(false);
//			}
//			catch (e)
//			{
//				// Keeps modified flag unchanged
//			}
//		}
		
		this.ui.editor.setStatus('<div class="geStatusAlert" style="cursor:pointer;overflow:hidden;">' +
			mxUtils.htmlEntities(mxResources.get('unsavedChangesClickHereToSave')) + '</div>');
		
		// Installs click handler for saving
		if (this.ui.statusContainer != null)
		{
			var links = this.ui.statusContainer.getElementsByTagName('div');
			
			if (links.length > 0)
			{
				mxEvent.addListener(links[0], 'click', mxUtils.bind(this, function()
				{
					this.ui.actions.get((this.ui.mode == null) ? 'saveAs' : 'save').funct();
				}));
			}
		}
	}
};

/**
 * Adds the listener for automatically saving the diagram for local changes.
 */
DrawioFile.prototype.autosave = function(delay, maxDelay, success, error)
{
	if (this.lastAutosave == null)
	{
		this.lastAutosave = new Date().getTime();
	}
	
	var tmp = (new Date().getTime() - this.lastAutosave < maxDelay) ? delay : 0;
	this.clearAutosave();
	
	// Starts new timer or executes immediately if not unsaved for maxDelay
	this.autosaveThread = window.setTimeout(mxUtils.bind(this, function()
	{
		this.autosaveThread = null;
		this.lastAutosave = null;
		
		// Workaround for duplicate save if UI is blocking
		// after save while pending autosave triggers
		if (this.isModified() && this.isAutosaveNow())
		{
			var rev = this.isAutosaveRevision();
			
			if (rev)
			{
				this.lastAutosaveRevision = new Date().getTime();
			}
			
			this.save(rev, mxUtils.bind(this, function(resp)
			{
				this.autosaveCompleted();
				
				if (success != null)
				{
					success(resp);
				}
			}), mxUtils.bind(this, function(resp)
			{
				if (error != null)
				{
					error(resp);
				}
			}));
		}
		else
		{
			if (success != null)
			{
				success(null);
			}
		}
	}), tmp);
};

/**
 * Returns true if an autosave is required at the time of execution.
 * This implementation returns true.
 */
DrawioFile.prototype.isAutosaveNow = function()
{
	return true;
};

/**
 * Hooks for subclassers after the autosave has completed.
 */
DrawioFile.prototype.autosaveCompleted = function() { };

/**
 * Adds the listener for automatically saving the diagram for local changes.
 */
DrawioFile.prototype.clearAutosave = function()
{
	if (this.autosaveThread != null)
	{
		window.clearTimeout(this.autosaveThread);
		this.autosaveThread = null;
	}
};

/**
 * Returns the location as a new object.
 * @type mx.Point
 */
DrawioFile.prototype.isAutosaveRevision = function()
{
	var now = new Date().getTime();
	
	return (this.lastAutosaveRevision == null) || (now - this.lastAutosaveRevision) > this.maxAutosaveRevisionDelay;
};

/**
 * Returns the location as a new object.
 */
DrawioFile.prototype.close = function(unloading)
{
	if (this.isAutosave() && this.isModified())
	{
		this.save(this.isAutosaveRevision(), null, null, unloading);
	}
	
	this.destroy();
};

/**
 * Returns the location as a new object.
 */
DrawioFile.prototype.hasSameExtension = function(title, newTitle)
{
	if (title != null && newTitle != null)
	{
		var dot = title.lastIndexOf('.');
		var ext = (dot > 0) ? title.substring(dot) : '';
		dot = newTitle.lastIndexOf('.');

		return ext === ((dot > 0) ? newTitle.substring(dot) : '');
	}
	
	return title == newTitle;
};

/**
 * Stops any pending autosaves and removes all listeners.
 */
DrawioFile.prototype.destroy = function()
{
	this.clearAutosave();
	
	if (this.changeListener != null)
	{
		this.ui.editor.graph.model.removeListener(this.changeListener);
		this.ui.editor.graph.removeListener(this.changeListener);
		this.ui.removeListener(this.changeListener);
		this.changeListener = null;
	}
};
