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
	this.shadowData = this.data;
	this.shadowPages = null;
	this.created = new Date().getTime();
	
	// Creates the stats object
	this.stats = {
		opened: 0, /* number of calls to open */
		merged: 0, /* number of calls to merge */
		fileMerged: 0, /* number of calls to mergeFile */
		fileReloaded: 0, /* number of calls to mergeFile */
		conflicts: 0, /* number of write conflicts when saving a file */
		timeouts: 0, /* number of time we have given up to retry after a write conflict */
		saved: 0, /* number of calls to fileSaved */
		closed: 0, /* number of calls to close */
		destroyed: 0, /* number of calls to close */
		joined: 0, /* number of join messages received */
		checksumErrors: 0, /* number of checksum errors */
		bytesSent: 0, /* number of bytes send in messages */
		bytesReceived: 0, /* number of bytes received in messages */
		msgSent: 0, /* number of messages sent */
		msgReceived: 0, /* number of messages received */
		cacheHits: 0, /* number of times the cache returned patches */
		cacheMiss: 0, /* number of times we have missed a cache entry */
		cacheFail: 0 /* number of times we have failed to read the cache */
	};
};

/**
 * Global switch for realtime collaboration type to use sync URL parameter
 * with the following possible values:
 * 
 * - none: overwrite
 * - manual: manual sync
 * - auto: automatic sync
 */
DrawioFile.SYNC = urlParams['sync'] || 'auto';

/**
 * Specifies if last write wins should be used for values and styles.
 */
DrawioFile.LAST_WRITE_WINS = true;

// Extends mxEventSource
mxUtils.extend(DrawioFile, mxEventSource);

/**
 * Specifies the resource key for all changes saved status message.
 */
DrawioFile.prototype.allChangesSavedKey = 'allChangesSaved';

/**
 * Specifies the resource key for saving spinner.
 */
DrawioFile.prototype.savingSpinnerKey = 'saving';

/**
 * Specifies the resource key for saving status message.
 */
DrawioFile.prototype.savingStatusKey = 'saving';

/**
 * Specifies the delay between the last change and the autosave.
 */
DrawioFile.prototype.autosaveDelay = 1500;

/**
 * Specifies the maximum delay before an autosave is forced even if the graph
 * is being changed.
 */
DrawioFile.prototype.maxAutosaveDelay = 30000;

/**
 * Specifies the delay for loading the file after an optimistic sync message.
 * This should be the delay for the file to be saved minus the delay for the
 * sync message to travel.
 */
DrawioFile.prototype.optimisticSyncDelay = 300;

/**
 * Contains the thread for the next autosave.
 */
DrawioFile.prototype.autosaveThread = null;

/**
 * Stores the time stamp for the last autosave.
 */
DrawioFile.prototype.lastAutosave = null;

/**
 * Stores the time stamp for the last autosave.
 */
DrawioFile.prototype.lastSaved = null;

/**
 * Stores the time stamp for the last autosave.
 */
DrawioFile.prototype.lastChanged = null;

/**
 * Stores the time stamp when the file was opened.
 */
DrawioFile.prototype.opened = null;

/**
 * Stores the modified state.
 */
DrawioFile.prototype.modified = false;

/**
 * Stores a shadow of the modified state.
 */
DrawioFile.prototype.shadowModified = false;

/**
 * Holds a copy of the current file data.
 */
DrawioFile.prototype.data = null;

/**
 * Holds a copy of the last saved file data.
 */
DrawioFile.prototype.shadowData = null;

/**
 * Holds a copy of the parsed last saved file data.
 */
DrawioFile.prototype.shadowPages = null;

/**
 * Specifies if the graph change listener is enabled. Default is true.
 */
DrawioFile.prototype.changeListenerEnabled = true;

/**
 * Sets the delay for autosave in milliseconds. Default is 1500.
 */
DrawioFile.prototype.lastAutosaveRevision = null;

/**
 * Sets the delay between revisions when using autosave. Default is 300000
 * ie 5 mins. Set this to 0 to create a revision on every autosave.
 */
DrawioFile.prototype.maxAutosaveRevisionDelay = 300000;

/**
 * Specifies if notify events should be ignored.
 */
DrawioFile.prototype.inConflictState = false;

/**
 * Specifies if notify events should be ignored.
 */
DrawioFile.prototype.invalidChecksum = false;

/**
 * Specifies if error reports should be sent.
 */
DrawioFile.prototype.errorReportsEnabled = false;

/**
 * Specifies if stats should be sent.
 */
DrawioFile.prototype.ageStart = null;

/**
 * Specifies if notify events should be ignored.
 */
DrawioFile.prototype.getSize = function()
{
	return (this.data != null) ? this.data.length : 0;
};

/**
 * Adds the listener for automatically saving the diagram for local changes.
 */
DrawioFile.prototype.synchronizeFile = function(success, error)
{
	if (this.savingFile)
	{
		if (error != null)
		{
			error({message: mxResources.get('busy')});
		}
	}
	else
	{
		if (this.sync != null)
		{
			this.sync.fileChanged(success, error);
		}
		else
		{
			this.updateFile(success, error);
		}
	}
};

/**
* Adds the listener for automatically saving the diagram for local changes.
*/
DrawioFile.prototype.updateFile = function(success, error, abort, shadow)
{
	if (abort == null || !abort())
	{
		if (this.ui.getCurrentFile() != this || this.invalidChecksum)
		{
			if (error != null)
			{
				error();
			}
		}
		else
		{
			this.getLatestVersion(mxUtils.bind(this, function(latestFile)
			{
				try
				{
					if (abort == null || !abort())
					{
						if (this.ui.getCurrentFile() != this || this.invalidChecksum)
						{
							if (error != null)
							{
								error();
							}
						}
						else
						{
							if (latestFile != null)
							{
								this.mergeFile(latestFile, success, error, shadow);
							}
							else
							{
								this.reloadFile(success, error);
							}
						}
					}
				}
				catch (e)
				{
					if (error != null)
					{
						error(e);
					}
				}
			}), error);
		}
	}
};

/**
 * Adds the listener for automatically saving the diagram for local changes.
 */
DrawioFile.prototype.mergeFile = function(file, success, error, diffShadow)
{
	var reportError = true;
	
	try
	{
		this.stats.fileMerged++;
				
		// Takes copy of current shadow document
		var shadow = (this.shadowPages != null) ? this.shadowPages :
			this.ui.getPagesForNode(mxUtils.parseXml(
			this.shadowData).documentElement);
	
		// Loads new document as shadow document
		var pages = this.ui.getPagesForNode(
			mxUtils.parseXml(file.data).
			documentElement)
			
		if (pages != null && pages.length > 0)
		{
			this.shadowPages = pages;

			// Creates a patch for backup if the checksum fails
			this.backupPatch = (this.isModified()) ?
				this.ui.diffPages(shadow,
				this.ui.pages) : null;
			
			// Patches the current document
			var patches = [this.ui.diffPages((diffShadow != null) ?
				diffShadow : shadow, this.shadowPages)];
			var ignored = this.ignorePatches(patches);
			
			if (!ignored)
			{
				// Patching previous shadow to verify checksum
				var patched = this.ui.patchPages(shadow, patches[0]);
				
				var patchedDetails = {};
				var checksum = this.ui.getHashValueForPages(patched, patchedDetails);
				var currentDetails = {};
				var current = this.ui.getHashValueForPages(this.shadowPages, currentDetails);
				
				if (urlParams['test'] == '1')
				{
					EditorUi.debug('File.mergeFile', [this],
						'backup', this.backupPatch,
						'patches', patches,
						'checksum', current == checksum, checksum);
				}
				
				if (checksum != null && checksum != current)
				{
					var fileData = this.compressReportData(this.getAnonymizedXmlForPages(pages));
					var data = this.compressReportData(this.getAnonymizedXmlForPages(patched));
					var from = this.ui.hashValue(file.getCurrentEtag());
					var to = this.ui.hashValue(this.getCurrentEtag());
					
					this.checksumError(error, patches,
						'Shadow Details: ' + JSON.stringify(patchedDetails) +
						'\nChecksum: ' + checksum +
						'\nCurrent: ' + current +
						'\nCurrent Details: ' + JSON.stringify(currentDetails) +
						'\nFrom: ' + from +
						'\nTo: ' + to +
						'\n\nFile Data:\n' + fileData +
						'\nPatched Shadow:\n' + data, null, 'mergeFile');
					
					// Abnormal termination
					return;
				}
				else
				{
					// Patches the current document
					this.patch(patches,
						(DrawioFile.LAST_WRITE_WINS) ?
						this.backupPatch : null);
				}
			}
		}
		else
		{
			reportError = false;
			throw new Error(mxResources.get('notADiagramFile'));
		}
	
		this.invalidChecksum = false;
		this.inConflictState = false;
		this.setDescriptor(file.getDescriptor());
		this.descriptorChanged();
		this.backupPatch = null;
		
		if (success != null)
		{
			success();
		}
	}
	catch (e)
	{
		this.inConflictState = true;
		this.invalidChecksum = true;
		this.descriptorChanged();
		
		if (error != null)
		{
			error(e);
		}

		try
		{
			if (reportError)
			{
				if (this.errorReportsEnabled)
				{
					this.sendErrorReport('Error in mergeFile', null, e);
				}
				else
				{
					var user = this.getCurrentUser();
					var uid = (user != null) ? user.id : 'unknown';
					
					EditorUi.logError('Error in mergeFile', null,
						this.getMode() + '.' + this.getId(),
						uid, e);
				}
			}
		}
		catch (e2)
		{
			// ignore
		}
	}
};

/**
 * Adds the listener for automatically saving the diagram for local changes.
 */
DrawioFile.prototype.getAnonymizedXmlForPages = function(pages)
{
	var enc = new mxCodec(mxUtils.createXmlDocument());
	var file = enc.document.createElement('mxfile');
	
	if (pages != null)
	{
		for (var i = 0; i < pages.length; i++)
		{
			var temp = enc.encode(new mxGraphModel(pages[i].root));
			
			if (urlParams['dev'] != '1')
			{
				temp = this.ui.anonymizeNode(temp, true);
			}
			
			temp.setAttribute('id', pages[i].getId());
			
			if (pages[i].viewState)
			{
				this.ui.editor.graph.saveViewState(pages[i].viewState, temp, true);
			}
			
			file.appendChild(temp);
		}
	}

	return mxUtils.getPrettyXml(file);
};

/**
 * Adds the listener for automatically saving the diagram for local changes.
 */
DrawioFile.prototype.compressReportData = function(data, limit, max)
{
	limit = (limit != null) ? limit : 10000;

	if (max != null && data != null && data.length > max)
	{
		data = data.substring(0, max) + '[...]';
	}
	else if (data != null && data.length > limit)
	{
		data = Graph.compress(data) + '\n';
	}

	return data;
};

/**
 * Adds the listener for automatically saving the diagram for local changes.
 */
DrawioFile.prototype.checksumError = function(error, patches, details, etag, functionName)
{
	this.stats.checksumErrors++;
	this.inConflictState = true;
	this.invalidChecksum = true;
	this.descriptorChanged();
	
	if (this.sync != null)
	{
		this.sync.updateOnlineState();
	}

	if (error != null)
	{
		error();
	}
	
	try
	{
		if (this.errorReportsEnabled)
		{
			if (patches != null)
			{
				for (var i = 0; i < patches.length; i++)
				{
					this.ui.anonymizePatch(patches[i]);
				}
			}
			
			var fn = mxUtils.bind(this, function(file)
			{
				var json = this.compressReportData(
					JSON.stringify(patches, null, 2));
				var remote = (file != null) ? this.compressReportData(
					this.getAnonymizedXmlForPages(
					this.ui.getPagesForNode(
					mxUtils.parseXml(file.data).documentElement)), 25000) : 'n/a';
				
				this.sendErrorReport('Checksum Error in ' + functionName + ' ' + this.getHash(),
					((details != null) ? (details) : '') +  '\n\nPatches:\n' + json +
					((remote != null) ? ('\n\nRemote:\n' + remote) : ''), null, 70000);
			});
	
			if (etag == null)
			{
				fn(null);
			}
			else
			{
				this.getLatestVersion(mxUtils.bind(this, function(file)
				{
					if (file != null && file.getCurrentEtag() == etag)
					{
						fn(file);
					}
					else
					{
						fn(null);
					}
				}), function() {});
			}
		}
		else
		{
			var user = this.getCurrentUser();
			var uid = (user != null) ? user.id : 'unknown';
			
			EditorUi.logError('Checksum Error in ' + functionName + ' ' + this.getId(),
				null, this.getMode() + '.' + this.getId(),
				'user_' + uid + ((this.sync != null) ?
				'-client_' + this.sync.clientId : '-nosync'));
			
			// Logs checksum error for file
			try
			{
				EditorUi.logEvent({category: 'CHECKSUM-ERROR-SYNC-FILE-' + this.getHash(),
					action: functionName, label: 'user_' + uid + ((this.sync != null) ?
					'-client_' + this.sync.clientId : '-nosync')});
			}
			catch (e)
			{
				// ignore
			}
		}
	}
	catch (e)
	{
		// ignore
	}
};

/**
 * Adds the listener for automatically saving the diagram for local changes.
 */
DrawioFile.prototype.sendErrorReport = function(title, details, error, max)
{
	try
	{
		var shadow = this.compressReportData(
			this.getAnonymizedXmlForPages(
			this.shadowPages), 25000);
		var data = this.compressReportData(
			this.getAnonymizedXmlForPages(
			this.ui.pages), 25000);
		var user = this.getCurrentUser();
		var uid = (user != null) ? this.ui.hashValue(user.id) : 'unknown';
		var cid = (this.sync != null) ? '-client_' + this.sync.clientId : '-nosync';
		var filename = this.getTitle();
		var dot = filename.lastIndexOf('.');
		var ext = 'xml';
		
		if (dot > 0)
		{
			ext = filename.substring(dot);
		}
		
		var stack = (error != null) ? error.stack : new Error().stack;
		
		EditorUi.sendReport(title + ' ' + new Date().toISOString() + ':' +
			'\n\nAppVersion=' + navigator.appVersion +
			'\nFile=' + this.ui.hashValue(this.getId()) + ' (' + this.getMode() + ')' +
			((this.isModified()) ? ' modified' : '') +
			'\nSize/Type=' + this.getSize() + ' (' + ext + ')' +
			'\nUser=' + uid + cid +
			'\nPrefix=' + this.ui.editor.graph.model.prefix +
			'\nSync=' + DrawioFile.SYNC +
			((this.sync != null) ? (((this.sync.enabled) ? ' enabled' : '') +
				((this.sync.isConnected()) ? ' connected' : '')) : '') +
			'\nPlugins=' + ((mxSettings.settings != null) ? mxSettings.getPlugins() : 'null') +
			'\n\nStats:\n' + JSON.stringify(this.stats, null, 2) +
			((details != null) ? ('\n\n' + details) : '') +
			((error != null) ? ('\n\nError: ' + error.message) : '') +
			'\n\nStack:\n' + stack +
			'\n\nShadow:\n' + shadow +
			'\n\nData:\n' + data, max);
	}
	catch (e)
	{
		// ignore
	}
};

/**
 * Adds the listener for automatically saving the diagram for local changes.
 */
DrawioFile.prototype.reloadFile = function(success, error)
{
	try
	{
		this.ui.spinner.stop();
		
		var fn = mxUtils.bind(this, function()
		{
			this.stats.fileReloaded++;
			
			// Restores view state and current page
			var viewState = this.ui.editor.graph.getViewState();
			var selection = this.ui.editor.graph.getSelectionCells();
			var page = this.ui.currentPage;
			
			this.ui.loadFile(this.getHash(), true, null, mxUtils.bind(this, function()
			{
				if (this.ui.fileLoadedError == null)
				{
					this.ui.restoreViewState(page, viewState, selection);
					
					if (this.backupPatch != null)
					{
						this.patch([this.backupPatch]);
					}
					
					// Carry-over stats
					var file = this.ui.getCurrentFile();
					
					if (file != null)
					{
						file.stats = this.stats;
					}
					
					if (success != null)
					{
						success();
					}
				}
			}), true);
		});
	
		if (this.isModified() && this.backupPatch == null)
		{
			this.ui.confirm(mxResources.get('allChangesLost'), mxUtils.bind(this, function()
			{
				this.handleFileSuccess(DrawioFile.SYNC == 'manual');
			}), fn, mxResources.get('cancel'), mxResources.get('discardChanges'));
		}
		else
		{
			fn();
		}
	}
	catch (e)
	{
		if (error != null)
		{
			error(e);
		}
	}
};

/**
 * Shows a conflict dialog to the user.
 */
DrawioFile.prototype.copyFile = function(success, error)
{
	this.ui.editor.editAsNew(this.ui.getFileData(true),
		this.ui.getCopyFilename(this));
};

/**
 * Returns true if the patches in the given array are empty.
 */
DrawioFile.prototype.ignorePatches = function(patches)
{
	var ignore = true;
	
	for (var i = 0; i < patches.length && ignore; i++)
	{
		ignore = ignore && Object.keys(patches[i]).length == 0;
	}
	
	return ignore;
};

/**
 * Applies the given patches to the file.
 */
DrawioFile.prototype.patch = function(patches, resolver, undoable)
{
	// Saves state of undo history
	var undoMgr = this.ui.editor.undoManager;
	var history = undoMgr.history.slice();
	var nextAdd = undoMgr.indexOfNextAdd;
	
	// Hides graph during updates
	var graph = this.ui.editor.graph;
	graph.container.style.visibility = 'hidden';

	// Ignores change events
	var prev = this.changeListenerEnabled;
	this.changeListenerEnabled = undoable;
	
	// Folding and math change require special handling
	var fold = graph.foldingEnabled;
	var math = graph.mathEnabled;
	
	// Updates text editor if cell changes during validation
	var redraw = graph.cellRenderer.redraw;

	graph.cellRenderer.redraw = function(state)
    {
        if (state.view.graph.isEditing(state.cell))
        {
            state.view.graph.scrollCellToVisible(state.cell);
        	state.view.graph.cellEditor.resize();
        }
        
        redraw.apply(this, arguments);
    };
	
	graph.model.beginUpdate();
	try
	{
	    // Applies patches
		for (var i = 0; i < patches.length; i++)
		{
			this.ui.pages = this.ui.patchPages(this.ui.pages,
				patches[i], true, resolver, this.isModified());
		}
		
		// Always needs at least one page
		if (this.ui.pages.length == 0)
		{
			this.ui.pages.push(this.ui.createPage());
		}

		// Checks if current page was removed
		if (mxUtils.indexOf(this.ui.pages, this.ui.currentPage) < 0)
		{
			this.ui.selectPage(this.ui.pages[0], true);
		}
	}
	finally
	{
		// Changes visibility before action states are updated via model event
		graph.container.style.visibility = '';
		graph.model.endUpdate();
	
		// Restores previous state
		graph.cellRenderer.redraw = redraw;
		this.changeListenerEnabled = prev;
	
		// Restores history state
		if (!undoable)
		{
			undoMgr.history = history;
			undoMgr.indexOfNextAdd = nextAdd;
			undoMgr.fireEvent(new mxEventObject(mxEvent.CLEAR));
		}
		
		if (this.ui.currentPage == null || this.ui.currentPage.needsUpdate)
		{
			// Updates the graph and background
			if (math != graph.mathEnabled)
			{
				this.ui.editor.updateGraphComponents();
				graph.refresh();
			}
			else
			{
				if (fold != graph.foldingEnabled)
				{
					graph.view.revalidate();
				}
				else
				{
					graph.view.validate();
				}
				
				graph.sizeDidChange();
			}
		}
		
		this.ui.updateTabContainer();
	}
};

/**
 * Adds the listener for automatically saving the diagram for local changes.
 */
DrawioFile.prototype.save = function(revision, success, error, unloading, overwrite, manual)
{
	try
	{
		if (!this.isEditable())
		{
			if (error != null)
			{
				error({message: mxResources.get('readOnly')});
			}
			else
			{
				throw new Error(mxResources.get('readOnly'));
			}
		}
		else if (!overwrite && this.invalidChecksum)
		{
			if (error != null)
			{
				error({message: mxResources.get('checksum')});
			}
			else
			{
				throw new Error(mxResources.get('checksum'));
			}
		}
		else
		{
			this.updateFileData();
			this.clearAutosave();
			
			if (success != null)
			{
				success();
			}
		}
	}
	catch (e)
	{
		if (error != null)
		{
			error(e);
		}
		else
		{
			throw e;
		}
	}
};

/**
 * Translates this point by the given vector.
 * 
 * @param {number} dx X-coordinate of the translation.
 * @param {number} dy Y-coordinate of the translation.
 */
DrawioFile.prototype.updateFileData = function()
{
	this.setData(this.ui.getFileData(null, null, null, null, null, null, null, null, this, !this.isCompressed()));
};

/**
 * Translates this point by the given vector.
 * 
 * @param {number} dx X-coordinate of the translation.
 * @param {number} dy Y-coordinate of the translation.
 */
DrawioFile.prototype.isCompressedStorage = function()
{
	return true;
};

/**
 * Translates this point by the given vector.
 * 
 * @param {number} dx X-coordinate of the translation.
 * @param {number} dy Y-coordinate of the translation.
 */
DrawioFile.prototype.isCompressed = function()
{
	var compressed = (this.ui.fileNode != null) ? this.ui.fileNode.getAttribute('compressed') : null;
	
	if (compressed != null)
	{
		return compressed != 'false';
	}
	else
	{
		return this.isCompressedStorage() && Editor.compressXml;
	}
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
DrawioFile.prototype.getShadowModified = function()
{
	return this.shadowModified;
};

/**
 * Translates this point by the given vector.
 * 
 * @param {number} dx X-coordinate of the translation.
 * @param {number} dy Y-coordinate of the translation.
 */
DrawioFile.prototype.setShadowModified = function(value)
{
	this.shadowModified = value;
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
	this.shadowModified = value;
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
	return !this.inConflictState && this.ui.editor.autosave;
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
DrawioFile.prototype.isTrashed = function()
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
DrawioFile.prototype.share = function()
{
	this.ui.alert(mxResources.get('sharingAvailable'), null, 380);
};

/**
 * Returns the hash of the file which consists of a prefix for the storage
 * type and the ID of the file.
 */
DrawioFile.prototype.getHash = function()
{
	return '';
};

/**
 * Returns the ID of the file.
 */
DrawioFile.prototype.getId = function()
{
	return '';
};

/**
 * Returns true if the file is editable.
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
 * Returns the current title of the file.
 */
DrawioFile.prototype.getTitle = function()
{
	return '';
};

/**
 * Sets the current data of the file.
 */
DrawioFile.prototype.setData = function(data)
{
	this.data = data;
};

/**
 * Returns the current data of the file.
 */
DrawioFile.prototype.getData = function()
{
	return this.data;
};

/**
 * Opens this file in the editor.
 */
DrawioFile.prototype.open = function()
{
	this.stats.opened++;
	var data = this.getData();
	
	if (data != null)
	{
		//Remove external fonts of previous file
		function removeExtFont(elems)
		{
			for (var i = 0; elems != null && i < elems.length; i++)
			{
				var e = elems[i];
				
				if (e.id != null && e.id.indexOf('extFont_') == 0)
				{
					e.parentNode.removeChild(e);
				}
			}
		};
		
		removeExtFont(document.querySelectorAll('head > style[id]'));
		removeExtFont(document.querySelectorAll('head > link[id]'));
		
		this.ui.setFileData(data);
		
		// Updates shadow in case any page IDs have been updated
		// only if the file has not been modified and reopened
		if (!this.isModified())
		{
			this.shadowData = mxUtils.getXml(this.ui.getXmlFileData());
			this.shadowPages = null;
		}
	}

	this.installListeners();
	
	if (this.isSyncSupported())
	{
		this.startSync();
	}
};

/**
 * Hook for subclassers.
 */
DrawioFile.prototype.isSyncSupported = function()
{
	return false;
};

/**
 * Hook for subclassers.
 */
DrawioFile.prototype.isRevisionHistorySupported = function()
{
	return false;
};

/**
 * Hook for subclassers.
 */
DrawioFile.prototype.getRevisions = function(success, error)
{
	success(null);
};

/**
 * Hook for subclassers to get the latest descriptor of this file
 * and return it in the success handler.
 */
DrawioFile.prototype.loadDescriptor = function(success, error)
{
	success(null);
};

/**
 * Hook for subclassers to get the latest etag of this file
 * and return it in the success handler.
 */
DrawioFile.prototype.loadPatchDescriptor = function(success, error)
{
	this.loadDescriptor(mxUtils.bind(this, function(desc)
	{
		success(desc);
	}), error);
};

/**
 * Adds the listener for automatically saving the diagram for local changes.
 */
DrawioFile.prototype.patchDescriptor = function(desc, patch)
{
	this.setDescriptorEtag(desc, this.getDescriptorEtag(patch));
	this.descriptorChanged();
};

/**
 * Creates a starts the synchronization.
 */
DrawioFile.prototype.startSync = function()
{
	if ((DrawioFile.SYNC == 'auto' && urlParams['stealth'] != '1') &&
		(urlParams['rt'] == '1' || !this.ui.editor.chromeless ||
		this.ui.editor.editable))
	{
		if (this.sync == null)
		{
			this.sync = new DrawioFileSync(this);
		}
		
		this.sync.start();
	}
};

/**
 * Hook for subclassers to check if an error is a conflict.
 */
DrawioFile.prototype.isConflict = function()
{
	return false;
};

/**
 * Gets the channel ID for sync messages.
 */
DrawioFile.prototype.getChannelId = function()
{
	// Slash, space and plus replaced with underscore
	return Graph.compress(this.getHash()).replace(/[\/ +]/g, '_');
};

/**
 * Gets the channel ID from the given descriptor.
 */
DrawioFile.prototype.getChannelKey = function(desc)
{
	return null;
};

/**
 * Returns the current etag.
 */
DrawioFile.prototype.getCurrentUser = function()
{
	return null;
};

/**
 * Hook for subclassers to get the latest version of this file
 * and return it in the success handler.
 */
DrawioFile.prototype.getLatestVersion = function(success, error)
{
	success(null);
};

/**
 * Returns the last modified date of this file.
 */
DrawioFile.prototype.getLastModifiedDate = function()
{
	return new Date();
};

/**
 * Sets the current revision ID.
 */
DrawioFile.prototype.setCurrentRevisionId = function(id)
{
	this.setDescriptorRevisionId(this.getDescriptor(), id);
};

/**
 * Returns the current revision ID.
 */
DrawioFile.prototype.getCurrentRevisionId = function()
{
	return this.getDescriptorRevisionId(this.getDescriptor());
};

/**
 * Sets the current etag.
 */
DrawioFile.prototype.setCurrentEtag = function(etag)
{
	this.setDescriptorEtag(this.getDescriptor(), etag);
};

/**
 * Returns the current etag.
 */
DrawioFile.prototype.getCurrentEtag = function()
{
	return this.getDescriptorEtag(this.getDescriptor());
};

/**
 * Returns the descriptor from this file.
 */
DrawioFile.prototype.getDescriptor = function()
{
	return null;
};

/**
 * Sets the descriptor for this file.
 */
DrawioFile.prototype.setDescriptor = function() { };

/**
 * Updates the revision ID on the given descriptor.
 */
DrawioFile.prototype.setDescriptorRevisionId = function(desc, id)
{
	this.setDescriptorEtag(desc, id);
};

/**
 * Returns the revision ID from the given descriptor.
 */
DrawioFile.prototype.getDescriptorRevisionId = function(desc)
{
	return this.getDescriptorEtag(desc);
};

/**
 * Updates the etag on the given descriptor.
 */
DrawioFile.prototype.setDescriptorEtag = function(desc, etag) { };

/**
 * Returns the etag from the given descriptor.
 */
DrawioFile.prototype.getDescriptorEtag = function(desc)
{
	return null;
};

/**
 * Returns the secret from the given descriptor. This must be stored
 * in a custom property and generated by the saving client so that a
 * token can be obtained from the cache for writing the patch after
 * saving the file. If this cannot be saved in a custom property then
 * null must be returned so that no deltas are used for updating the
 * file (the file is reloaded every time instead). This is needed to
 * make sure nobody with read-only permissions can write a patch to
 * the cache before the saving client wrote the patch and inject
 * data into the file via other clients merging that data.
 */
DrawioFile.prototype.getDescriptorSecret = function(desc)
{
	return null;
};

/**
 * Installs the change listener.
 */
DrawioFile.prototype.installListeners = function()
{
	if (this.changeListener == null)
	{
		this.changeListener = mxUtils.bind(this, function(sender, eventObject)
		{
			var edit = (eventObject != null) ? eventObject.getProperty('edit') : null;
			
			if (this.changeListenerEnabled && this.isEditable() && (edit == null || !edit.ignoreEdit))
			{
				this.fileChanged();
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
		this.ui.addListener('tooltipsEnabledChanged', this.changeListener);
		this.ui.addListener('pageViewChanged', this.changeListener);
		this.ui.addListener('connectionPointsChanged', this.changeListener);
		this.ui.addListener('connectionArrowsChanged', this.changeListener);
	}
};

/**
 * Returns the location as a new object.
 * @type mx.Point
 */
DrawioFile.prototype.addAllSavedStatus = function(status)
{
	if (this.ui.statusContainer != null && this.ui.getCurrentFile() == this)
	{
		status = (status != null) ? status : mxUtils.htmlEntities(mxResources.get(this.allChangesSavedKey));
		this.ui.editor.setStatus('<div title="'+ status + '">' + status + '</div>');
		var links = this.ui.statusContainer.getElementsByTagName('div');
		
		if (links.length > 0 && this.isRevisionHistorySupported())
		{
			links[0].style.cursor = 'pointer';
			links[0].style.textDecoration = 'underline';
			
			mxEvent.addListener(links[0], 'click', mxUtils.bind(this, function()
			{
				this.ui.actions.get('revisionHistory').funct();
			}));
		}
	}
};

/**
 * Adds the listener for automatically saving the diagram for local changes.
 */
DrawioFile.prototype.saveDraft = function()
{
	try
	{
		if (this.draftId == null)
		{
			this.draftId = Editor.guid();
		}
		
		var draft = {type: 'draft',
			created: this.created,
			modified: new Date().getTime(),
			data: this.ui.getFileData(),
			title: this.getTitle(),
			aliveCheck: this.ui.draftAliveCheck};
		this.ui.setDatabaseItem('.draft_' + this.draftId,
			JSON.stringify(draft));
		
		EditorUi.debug('draft saved', this.draftId, draft);
	}
	catch (e)
	{
		console.error(e);
		
		// Removes any stored draft
		this.removeDraft();
	}
};

/**
 * Adds the listener for automatically saving the diagram for local changes.
 */
DrawioFile.prototype.removeDraft = function()
{
	try
	{
		if (this.draftId != null)
		{
			this.ui.removeDatabaseItem('.draft_' + this.draftId);
			EditorUi.debug('draft deleted', '.draft_' + this.draftId);
		}
	}
	catch (e)
	{
		// ignore
	}
};

/**
 * Adds the listener for automatically saving the diagram for local changes.
 */
DrawioFile.prototype.addUnsavedStatus = function(err)
{
	if (!this.inConflictState && this.ui.statusContainer != null && this.ui.getCurrentFile() == this)
	{
		if (err instanceof Error && err.message != null && err.message != '')
		{
			var status = mxUtils.htmlEntities(mxResources.get('unsavedChanges'));
			
			this.ui.editor.setStatus('<div title="'+ status +
				'" class="geStatusAlert" style="overflow:hidden;">' + status +
				' (' + mxUtils.htmlEntities(err.message) + ')</div>');
		}
		else
		{
			var msg = this.getErrorMessage(err);

			if (msg == null && this.lastSaved != null)
			{
				var str = this.ui.timeSince(new Date(this.lastSaved));
				
				// Only show if more than a minute ago
				if (str != null)
				{
					msg = mxResources.get('lastSaved', [str]);
				}
			}
			
			if (msg != null && msg.length > 60)
			{
				msg = msg.substring(0, 60) + '...';
			}

			var status = mxUtils.htmlEntities(mxResources.get('unsavedChangesClickHereToSave')) +
				((msg != null && msg != '') ? ' (' + mxUtils.htmlEntities(msg) + ')' : '');
			this.ui.editor.setStatus('<div title="'+ status +
				'" class="geStatusAlertOrange" style="cursor:pointer;overflow:hidden;">' + status + ' <img src="' +
				Editor.saveImage + '" align="top" style="width:16px;margin-top:' + ((mxClient.IS_FF) ? -3 : -2) + 'px"/></div>');
			
			// Installs click handler for saving
			var links = this.ui.statusContainer.getElementsByTagName('div');
			
			if (links != null && links.length > 0)
			{
				mxEvent.addListener(links[0], 'click', mxUtils.bind(this, function()
				{
					this.ui.actions.get((this.ui.mode == null || !this.isEditable()) ?
						'saveAs' : 'save').funct();
				}));
			}
			else
			{
				var status = mxUtils.htmlEntities(mxResources.get('unsavedChanges'));
				
				this.ui.editor.setStatus('<div title="'+ status +
					'" class="geStatusAlert" style="overflow:hidden;">' + status +
					' (' + mxUtils.htmlEntities(err.message) + ')</div>');
			}
			
			if (EditorUi.enableDrafts && (this.getMode() == null || EditorUi.isElectronApp))
			{
				if (this.saveDraftThread != null)
				{
					window.clearTimeout(this.saveDraftThread);
				}
				
				this.saveDraftThread = window.setTimeout(mxUtils.bind(this, function()
				{
					this.saveDraft();
				}), 0);
			}
		}
	}
};

/**
 * Halts all timers and shows a conflict status message. The optional error
 * handler is invoked first.
 */
DrawioFile.prototype.addConflictStatus = function(fn, message)
{
	if (this.invalidChecksum && message == null)
	{
		message = mxResources.get('checksum');
	}

	this.setConflictStatus(mxUtils.htmlEntities(mxResources.get('fileChangedSync')) +
		((message != null && message != '') ? ' (' + mxUtils.htmlEntities(message) + ')' : ''));
	this.ui.spinner.stop();
	this.clearAutosave();

	var links = (this.ui.statusContainer != null) ? this.ui.statusContainer.getElementsByTagName('div') : null;
	
	if (links != null && links.length > 0)
	{
		mxEvent.addListener(links[0], 'click', mxUtils.bind(this, function(evt)
		{
			if (mxEvent.getSource(evt).nodeName != 'IMG')
			{
				fn();
			}
		}));
	}
	else
	{
		this.ui.alert(mxUtils.htmlEntities(mxResources.get('fileChangedSync')), fn);
	}
};

/**
 * Halts all timers and shows a conflict status message. The optional error
 * handler is invoked first.
 */
DrawioFile.prototype.setConflictStatus = function(message)
{
	this.ui.editor.setStatus('<div title="'+ message + '" class="geStatusAlert geBlink" style="cursor:pointer;overflow:hidden;">' +
		message + ' <a href="https://www.diagrams.net/doc/faq/synchronize" target="_blank"><img border="0" ' +
		'style="margin-left:2px;cursor:help;opacity:0.5;width:16px;height:16px;" valign="bottom" src="' + Editor.helpImage +
		'" style=""/></a></div>');
};

/**
 * Shows a conflict dialog to the user.
 */
DrawioFile.prototype.showRefreshDialog = function(success, error, message)
{
	if (message == null)
	{
		message = mxResources.get('checksum');
	}
	
	if (this.ui.editor.isChromelessView() && !this.ui.editor.editable)
	{
		this.ui.alert(mxResources.get('fileChangedSync'), mxUtils.bind(this, function()
		{
			this.reloadFile(success, error);
		}));
	}
	else
	{
		// Allows for escape key to be pressed while dialog is showing
		this.addConflictStatus(mxUtils.bind(this, function()
		{
			this.showRefreshDialog(success, error);
		}), message);
		
		this.ui.showError(mxResources.get('error') + ' (' + message + ')',
			mxResources.get('fileChangedSyncDialog'),
			mxResources.get('makeCopy'), mxUtils.bind(this, function()
		{
			this.copyFile(success, error);
		}), null, mxResources.get('synchronize'), mxUtils.bind(this, function()
		{
			this.reloadFile(success, error);
		}), mxResources.get('cancel'), mxUtils.bind(this, function()
		{
			this.ui.hideDialog();
		}), 360, 150);
	}
};

/**
 * Shows a dialog with no synchronize option.
 */
DrawioFile.prototype.showCopyDialog = function(success, error, overwrite)
{
	this.inConflictState = false;
	this.invalidChecksum = false;
	this.addUnsavedStatus();
	
	this.ui.showError(mxResources.get('externalChanges'),
		mxResources.get('fileChangedOverwriteDialog'),
		mxResources.get('makeCopy'), mxUtils.bind(this, function()
		{
			this.copyFile(success, error);
		}), null, mxResources.get('overwrite'), overwrite,
		mxResources.get('cancel'), mxUtils.bind(this, function()
	{
		this.ui.hideDialog();
	}), 360, 150);
};

/**
 * Shows a conflict dialog to the user.
 */
DrawioFile.prototype.showConflictDialog = function(overwrite, synchronize)
{
	this.ui.showError(mxResources.get('externalChanges'),
		mxResources.get('fileChangedSyncDialog'),
		mxResources.get('overwrite'), overwrite, null,
		mxResources.get('synchronize'), synchronize,
		mxResources.get('cancel'), mxUtils.bind(this, function()
	{
		this.ui.hideDialog();
		this.handleFileError(null, false);
	}), 340, 150);
};

/**
 * Checks if the client is authorized and calls the next step.
 */
DrawioFile.prototype.redirectToNewApp = function(error, details)
{
	this.ui.spinner.stop();
	
	if (!this.redirectDialogShowing)
	{
		this.redirectDialogShowing = true;
		
		var url = window.location.protocol + '//' + window.location.host + '/' + this.ui.getSearch(
			['create', 'title', 'mode', 'url', 'drive', 'splash', 'state']) + '#' + this.getHash();
		var msg = mxResources.get('redirectToNewApp');
		
		if (details != null)
		{
			msg += ' (' + details + ')';
		}
		
		var redirect = mxUtils.bind(this, function()
		{
			var fn = mxUtils.bind(this, function()
			{
				this.redirectDialogShowing = false;
				
				if (window.location.href == url)
				{
					window.location.reload();
				}
				else
				{
					window.location.href = url;
				}
			});
			
			if (error == null && this.isModified())
			{
				this.ui.confirm(mxResources.get('allChangesLost'), mxUtils.bind(this, function()
				{
					this.redirectDialogShowing = false;
				}), fn, mxResources.get('cancel'), mxResources.get('discardChanges'));
			}
			else
			{
				fn();
			}
		});
		
		if (error != null)
		{
			if (this.isModified())
			{
				this.ui.confirm(msg, mxUtils.bind(this, function()
				{
					this.redirectDialogShowing = false;
					error();
				}), redirect, mxResources.get('cancel'), mxResources.get('discardChanges'));
			}
			else
			{
				this.ui.confirm(msg, redirect, mxUtils.bind(this, function()
				{
					this.redirectDialogShowing = false;
					error();
				}));
			}
		}
		else
		{
			this.ui.alert(mxResources.get('redirectToNewApp'), redirect);
		}
	}
};

/**
 * Adds the listener for automatically saving the diagram for local changes.
 */
DrawioFile.prototype.handleFileSuccess = function(saved)
{
	this.ui.spinner.stop();
	
	if (this.ui.getCurrentFile() == this)
	{
		if (this.isModified())
		{
			this.fileChanged();
		}
		else if (saved)
		{
			if (this.isTrashed())
			{
				this.addAllSavedStatus(mxUtils.htmlEntities(mxResources.get(this.allChangesSavedKey)) + ' (' +
					mxUtils.htmlEntities(mxResources.get('fileMovedToTrash')) + ')');
			}
			else
			{
				this.addAllSavedStatus();
			}

			if (this.sync != null)
			{
				this.sync.resetUpdateStatusThread();
				
				if (this.sync.remoteFileChanged)
				{
					this.sync.remoteFileChanged = false;
					this.sync.fileChangedNotify();
				}
			}
		}
		else
		{
			this.ui.editor.setStatus('');
		}
	}
};

/**
 * Adds the listener for automatically saving the diagram for local changes.
 */
DrawioFile.prototype.handleFileError = function(err, manual)
{
	this.ui.spinner.stop();
	
	if (this.ui.getCurrentFile() == this)
	{
		if (this.inConflictState)
		{
			this.handleConflictError(err, manual);
		}
		else
		{
			if (this.isModified())
			{
				this.addUnsavedStatus(err);
			}
			
			if (manual)
			{
				this.ui.handleError(err, (err != null) ? mxResources.get('errorSavingFile') : null);
			}
			else if (!this.isModified())
			{
				var msg = this.getErrorMessage(err);
				
				if (msg != null && msg.length > 60)
				{
					msg = msg.substring(0, 60) + '...';
				}
				
				this.ui.editor.setStatus('<div class="geStatusAlert" style="cursor:pointer;overflow:hidden;">' +
					mxUtils.htmlEntities(mxResources.get('error')) + ((msg != null) ?
					' (' + mxUtils.htmlEntities(msg) + ')' : '') + '</div>');
			}
		}
	}
};

/**
 * Adds the listener for automatically saving the diagram for local changes.
 */
DrawioFile.prototype.handleConflictError = function(err, manual)
{
	var success = mxUtils.bind(this, function()
	{
		this.handleFileSuccess(true);
	});
	
	var error = mxUtils.bind(this, function(err2)
	{
		this.handleFileError(err2, true);
	});
		
	var overwrite = mxUtils.bind(this, function()
	{
		if (this.ui.spinner.spin(document.body, mxResources.get(this.savingSpinnerKey)))
		{
			this.ui.editor.setStatus('');
			var isRepoFile = (this.constructor == GitHubFile) || (this.constructor == GitLabFile);
			this.save(true, success, error, null, true, (isRepoFile &&
				err != null) ? err.commitMessage : null);
		}
	});

	var synchronize = mxUtils.bind(this, function()
	{
		if (this.ui.spinner.spin(document.body, mxResources.get('updatingDocument')))
		{
			this.synchronizeFile(mxUtils.bind(this, function()
			{
				this.ui.spinner.stop();
				
				if (this.ui.spinner.spin(document.body, mxResources.get(this.savingSpinnerKey)))
				{
					var isRepoFile = (this.constructor == GitHubFile) || (this.constructor == GitLabFile);
					this.save(true, success, error, null, null, (isRepoFile &&
						err != null) ? err.commitMessage : null);
				}
			}), error);
		}
	})
	
	if (DrawioFile.SYNC == 'none')
	{
		this.showCopyDialog(success, error, overwrite);
	}
	else if (this.invalidChecksum)
	{
		this.showRefreshDialog(success, error, this.getErrorMessage(err));
	}
	else if (manual)
	{
		this.showConflictDialog(overwrite, synchronize);
	}
	else
	{
		this.addConflictStatus(mxUtils.bind(this, function()
		{
			this.ui.editor.setStatus(mxUtils.htmlEntities(
				mxResources.get('updatingDocument')));
			this.synchronizeFile(success, error);
		}), this.getErrorMessage(err));
	}
};

/**
 * Adds the listener for automatically saving the diagram for local changes.
 */
DrawioFile.prototype.getErrorMessage = function(err)
{
	var msg = (err != null) ? ((err.error != null) ? err.error.message : err.message) : null;
	
	if (msg == null && err != null && err.code == App.ERROR_TIMEOUT)
	{
		msg = mxResources.get('timeout');
	}
	
	return msg;
};

/**
 * Returns true if the oldest unsaved change is older than <EditorUi.warnInterval>.
 */
DrawioFile.prototype.isOverdue = function()
{
	return this.ageStart != null && (Date.now() - this.ageStart.getTime()) >= this.ui.warnInterval;
};

/**
 * Adds the listener for automatically saving the diagram for local changes.
 */
DrawioFile.prototype.fileChanged = function()
{
	this.lastChanged = new Date();
	this.setModified(true);
	
	if (this.isAutosave())
	{
		if (this.savingStatusKey != null)
		{
			this.addAllSavedStatus(mxUtils.htmlEntities(mxResources.get(this.savingStatusKey)) + '...');
		}
		
		this.ui.scheduleSanityCheck();
		
		if (this.ageStart == null)
		{
			this.ageStart = new Date();
		}
		
		//Send changes immidiately if P2P is enabled
		this.sendFileChanges();
		
		this.autosave(this.autosaveDelay, this.maxAutosaveDelay, mxUtils.bind(this, function(resp)
		{
			this.ui.stopSanityCheck();

			// Does not update status if another autosave was scheduled
			if (this.autosaveThread == null)
			{
				this.handleFileSuccess(true);
				this.ageStart = null;
			}
			else if (this.isModified())
			{
				this.ui.scheduleSanityCheck();
				this.ageStart = this.lastChanged;
			}
		}), mxUtils.bind(this, function(err)
		{
			this.handleFileError(err);
		}));
	}
	else
	{
		this.ageStart = null;
		
		if ((!this.isAutosaveOptional() || !this.ui.editor.autosave) &&
			!this.inConflictState)
		{
			this.addUnsavedStatus();
		}
	}
};

/**
 * Returns true if the notification to update should be sent
 * together with the save request.
 */
DrawioFile.prototype.isOptimisticSync = function()
{
	return false;
};

/**
 * Creates a secret and token pair for writing a patch to the cache.
 */
DrawioFile.prototype.createSecret = function(success)
{
	var secret = Editor.guid(32);
	
	if (this.sync != null && !this.isOptimisticSync())
	{
		this.sync.createToken(secret, mxUtils.bind(this, function(token)
		{
			success(secret, token);
		}), mxUtils.bind(this, function()
		{
			success(secret);
		}));
	}
	else
	{
		success(secret);
	}
};

/**
 * Invokes sync and updates shadow document.
 */
DrawioFile.prototype.fileSaving = function()
{
	if (this.sync != null && this.isOptimisticSync())
	{
		this.sync.fileSaving();
	}
	
	if (urlParams['test'] == '1')
	{
		EditorUi.debug('DrawioFile.fileSaving', [this]);
	}
};

DrawioFile.prototype.sendFileChanges = function()
{
	try
	{
		if (this.p2pCollab != null && this.sync != null)
		{
			//TODO Should we check for modified?
			this.updateFileData(); //TODO Calling this function ealy could have side effects + overhead of calling it twice (here and in save)
			this.sync.sendFileChanges(this.ui.getPagesForNode(
				mxUtils.parseXml(this.getData()).documentElement),
				this.desc);
				
			if (urlParams['test'] == '1')
			{
				EditorUi.debug('DrawioFile.sendFileChanges', [this]);
			}
		}
	}
	catch (e)
	{
		console.log(e);
	}
};

/**
 * Invokes sync and updates shadow document.
 */
DrawioFile.prototype.fileSaved = function(savedData, lastDesc, success, error, token)
{
	this.lastSaved = new Date();
	this.ageStart = null;
	
	try
	{
		this.stats.saved++;
		this.inConflictState = false;
		this.invalidChecksum = false;

		if (this.sync == null || this.isOptimisticSync())
		{
			this.shadowData = savedData;
			this.shadowPages = null;
			
			if (this.sync != null)
			{
				this.sync.lastModified = this.getLastModifiedDate();
				this.sync.resetUpdateStatusThread();
			}
			
			if (success != null)
			{
				success();
			}
		}
		else
		{
			this.sync.fileSaved(this.ui.getPagesForNode(
				mxUtils.parseXml(savedData).documentElement),
				lastDesc, success, error, token);
		}
	}
	catch (e)
	{
		this.inConflictState = true;
		this.invalidChecksum = true;
		this.descriptorChanged();
		
		if (error != null)
		{
			error(e);
		}

		try
		{
			if (this.errorReportsEnabled)
			{
				this.sendErrorReport('Error in fileSaved', null, e);
			}
			else
			{
				var user = this.getCurrentUser();
				var uid = (user != null) ? user.id : 'unknown';
				
				EditorUi.logError('Error in fileSaved', null,
					this.getMode() + '.' + this.getId(),
					uid, e);
			}
		}
		catch (e2)
		{
			// ignore
		}
	}
	
	if (urlParams['test'] == '1')
	{
		EditorUi.debug('DrawioFile.fileSaved', [this]);
	}
};

/**
 * Adds the listener for automatically saving the diagram for local changes.
 */
DrawioFile.prototype.autosave = function(delay, maxDelay, success, error)
{
	if (this.lastAutosave == null)
	{
		this.lastAutosave = Date.now();
	}
	
	var tmp = (Date.now() - this.lastAutosave < maxDelay) ? delay : 0;
	this.clearAutosave();
	
	// Starts new timer or executes immediately if not unsaved for maxDelay
	var thread = window.setTimeout(mxUtils.bind(this, function()
	{
		this.lastAutosave = null;
		
		if (this.autosaveThread == thread)
		{
			this.autosaveThread = null;
		}
		
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
			if (!this.isModified())
			{
				this.ui.editor.setStatus('');
			}
			
			if (success != null)
			{
				success(null);
			}
		}
	}), tmp);

	this.autosaveThread = thread;
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
 * Returns the location as a new object.
 */
DrawioFile.prototype.close = function(unloading)
{
	this.updateFileData();
	this.stats.closed++;
	
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
 * Removes the change listener.
 */
DrawioFile.prototype.removeListeners = function()
{
	if (this.changeListener != null)
	{
		this.ui.editor.graph.model.removeListener(this.changeListener);
		this.ui.editor.graph.removeListener(this.changeListener);
		this.ui.removeListener(this.changeListener);
		this.changeListener = null;
	}
};

/**
 * Stops any pending autosaves and removes all listeners.
 */
DrawioFile.prototype.destroy = function()
{
	this.clearAutosave();
	this.removeListeners();
	this.stats.destroyed++;

	if (this.sync != null)
	{
		this.sync.destroy();
		this.sync = null;
	}
};

/**
 * Are comments supported
 */
DrawioFile.prototype.commentsSupported = function()
{
	return false; //The default is false and files that support it must explicitly state that
};

/**
 * Show refresh button?
 */
DrawioFile.prototype.commentsRefreshNeeded = function()
{
	return true;
};

/**
 * Show save button?
 */
DrawioFile.prototype.commentsSaveNeeded = function()
{
	return false;
};

/**
 * Get comments of the file
 */
DrawioFile.prototype.getComments = function(success, error)
{
	success([]); //placeholder
};

/**
 * Add a comment to the file
 */
DrawioFile.prototype.addComment = function(comment, success, error)
{
	success(Date.now()); //placeholder
};

/**
 * Can add a reply to a reply
 */
DrawioFile.prototype.canReplyToReplies = function()
{
	return true;
};

/**
 * Can add comments (The permission to comment to this file)
 */
DrawioFile.prototype.canComment = function()
{
	return true;
};

/**
 * Get a new comment object
 */
DrawioFile.prototype.newComment = function(content, user)
{
	return new DrawioComment(this, null, content, Date.now(), Date.now(), false, user);
};
