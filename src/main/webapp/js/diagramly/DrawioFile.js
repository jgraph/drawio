/**
 * Copyright (c) 2006-2017, JGraph Holdings Ltd
 * Copyright (c) 2006-2017, draw.io AG
 */
DrawioFile = function(ui, data)
{
	mxEventSource.call(this);

	this.ui = ui;
	this.setData(data || '');
	this.initialData = this.getData();
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

/**
 * Specifies if export is restricted.
 */
DrawioFile.RESTRICT_EXPORT = false;

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
 * Specifies the maximum time to wait for the fonts to be loaded into the
 * local font cache before saving the file with external font references.
 */
DrawioFile.prototype.loadFontsTimeout = 5000;

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
 * Returns the shadow pages. If they do not exist they are created.
 */
DrawioFile.prototype.getShadowPages = function()
{
	if (this.shadowPages == null)
	{
		this.shadowPages = this.ui.getPagesForXml(this.initialData, true);

		if (this.shadowVars === undefined)
		{
			this.shadowVars = null;

			try
			{
				var doc = mxUtils.parseXml(this.initialData);
				var root = doc.documentElement;
				root = this.ui.editor.extractGraphModel(root, true, true) || root;

				if (root != null && root.nodeName == 'mxfile')
				{
					this.shadowVars = root.getAttribute('vars');
				}
			}
			catch (e) {}
		}
	}

	return this.shadowPages;
};

/**
 * Sets the shadow pages.
 */
DrawioFile.prototype.setShadowPages = function(pages, optVars)
{
	this.shadowPages = pages;
	this.shadowVars = (optVars !== undefined) ? optVars :
		((this.ui.fileNode != null) ?
			this.ui.fileNode.getAttribute('vars') : null);
};

/**
 * Returns the shadow vars value.
 */
DrawioFile.prototype.getShadowVars = function()
{
	this.getShadowPages(); // ensure lazy init
	return (this.shadowVars !== undefined) ? this.shadowVars : null;
};

/**
 * Adds the listener for automatically saving the diagram for local changes.
 */
DrawioFile.prototype.synchronizeFile = function(success, error, latestFile)
{
	EditorUi.debug('DrawioFile.synchronizeFile', [this],
		'latestFile', [latestFile], 'savingFile', this.savingFile);
	
	if (this.savingFile)
	{
		if (error != null)
		{
			error({message: mxResources.get('busy')});
		}
	}
	else
	{
		var acceptResponse = true;

		var timeoutThread = window.setTimeout(mxUtils.bind(this, function()
		{
			acceptResponse = false;
			
			if (error != null)
			{
				error({code: App.ERROR_TIMEOUT, message: mxResources.get('timeout'),
					retry: mxUtils.bind(this, function()
					{
						this.synchronizeFile(success, error);
					})});
			}
		}), this.ui.timeout);

		var errorWrapper = mxUtils.bind(this, function(e)
		{
			if (acceptResponse)
			{
				window.clearTimeout(timeoutThread);
			
				if (error != null)
				{
					error(e);
				}
			}
		});

		var abort = mxUtils.bind(this, function()
		{
			return !acceptResponse;
		});

		if (this.sync != null)
		{
			this.sync.fileChanged(mxUtils.bind(this, function()
			{
				if (acceptResponse)
				{
					window.clearTimeout(timeoutThread);
					this.sync.cleanup(success, error);
				}
			}), errorWrapper, abort);
		}
		else
		{
			this.updateFile(mxUtils.bind(this, function()
			{
				if (acceptResponse)
				{
					window.clearTimeout(timeoutThread);
				
					if (success != null)
					{
						success();
					}
				}
			}), errorWrapper, abort, null, null, latestFile);
		}
	}
};

/**
* Adds the listener for automatically saving the diagram for local changes.
* Immediate is passed through to scheduleCleanup.
*/
DrawioFile.prototype.updateFile = function(success, error, abort, shadow, immediate, latestFile)
{
	if (abort == null || !abort())
	{
		EditorUi.debug('DrawioFile.updateFile', [this],
			'immediate', immediate, 'invalidChecksum',
			this.invalidChecksum, 'latestFile', [latestFile]);

		if (this.ui.getCurrentFile() != this || this.invalidChecksum)
		{
			if (error != null)
			{
				error();
			}
		}
		else
		{
			var doUpdate = mxUtils.bind(this, function(latestFile)
			{
				try
				{
					if (abort == null || !abort())
					{
						EditorUi.debug('DrawioFile.updateFile', [this],
							'invalidChecksum', this.invalidChecksum,
							'latestFile', [latestFile]);

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
								this.mergeFile(latestFile, success, error,
									shadow, immediate);
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
			});

			if (latestFile != null)
			{
				doUpdate(latestFile);
			}
			else
			{
				this.getLatestVersion(doUpdate, error);
			}
		}
	}
};

/**
 * Adds the listener for automatically saving the diagram for local changes.
 * Immediate is passed through to scheduleCleanup.
 */
DrawioFile.prototype.mergeFile = function(file, success, error, diffShadow, immediate)
{
	var reportError = true;
	
	try
	{
		// Loads new document as shadow document
		var pages = file.getShadowPages();

		if (pages != null && pages.length > 0)
		{
			// Patches the current document
			var shadow = this.getShadowPages();
			var patches = [this.ui.diffPages((diffShadow != null) ?
				diffShadow : shadow, pages)];

			var incomingVars = null;

			try
			{
				var doc = mxUtils.parseXml(file.initialData);
				var root = doc.documentElement;
				root = this.ui.editor.extractGraphModel(root, true, true) || root;

				if (root != null && root.nodeName == 'mxfile')
				{
					incomingVars = root.getAttribute('vars');
				}
			}
			catch (e) {}

			if (incomingVars != this.getShadowVars())
			{
				patches[0][EditorUi.DIFF_FILE] = {vars: incomingVars};
			}

			var ignored = this.ignorePatches(patches);
			
			if (!ignored)
			{
				try
				{
					this.stats.fileMerged++;

					if (this.sync != null)
					{
						this.sync.sendLocalChanges();
					}
					
					// Computes local changes
					var changes = (!this.isModified()) ? null :
						this.ui.diffPages(shadow, (this.isRealtime()) ?
						this.ownPages : this.ui.pages);
					
					// Patching previous shadow to verify checksum
					var patchedDetails = {};
					var currentDetails = {};
					var patched = this.ui.patchPages(this.ui.clonePages(shadow), patches[0]);
					var checksum = this.ui.getHashValueForPages(patched, patchedDetails);
					var current = this.ui.getHashValueForPages(pages, currentDetails);
					
					EditorUi.debug('File.mergeFile', [this], 'file', [file], 'ui', this.ui.pages,
						'shadow', shadow, 'pages', pages, 'patched', patched, 'patches', patches,
						'changes', changes, 'checksum', checksum, 'current', current, 'valid',
						checksum == current, 'from', this.getCurrentRevisionId(), 'to',
						file.getCurrentRevisionId(), 'modified', this.isModified(),
						'immediate', immediate);
					
					if (checksum != null && checksum != current)
					{
						this.checksumError(error, patches, null, null, 'mergeFile',
							checksum, current, file.getCurrentRevisionId());
						
						// Abnormal termination
						return;
					}
					else
					{
						this.setShadowPages(pages, incomingVars);

						// Patches the realtime document
						if (this.sync != null)
						{
							var pending = this.sync.patchRealtime(
								patches, (DrawioFile.LAST_WRITE_WINS) ?
									changes : null, null, immediate);

							if (pending != null && !mxUtils.isEmptyObject(pending))
							{
								patches.push(pending);
							}

							// A non-editable client has no pending own
							// changes to protect and no save to heal
							// residues with: it mirrors the saved state
							// wholesale. Minimal diffs never repair an
							// order residue that predates them, and
							// this client can never push one back into
							// the file, so it would keep it forever.
							if (!this.isEditable() && this.ownPages != null)
							{
								this.ownPages = this.ui.clonePages(pages);
								this.theirPages = this.ui.clonePages(pages);
							}
						}

						// Patches the current document
						this.patch(patches, (DrawioFile.LAST_WRITE_WINS) ?
							changes : null);
					}
				
					this.invalidChecksum = false;
					this.inConflictState = false;
					this.setDescriptor(file.getDescriptor());
					this.descriptorChanged();
					
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
						// InvalidCharacterError from atob is corrupt patch data,
						// not actionable (eg. external tools modifying files)
						if (reportError && !(e instanceof DOMException &&
							e.name == 'InvalidCharacterError'))
						{
							var user = this.getCurrentUser();
							// Hashed like sendErrorReport: no raw user or file ids in logs
							var uid = (user != null) ? this.ui.hashValue(user.id) : 'unknown';

							EditorUi.logError('Error in mergeFile', null,
								this.getMode() + '.' + this.ui.hashValue(this.getId()),
								uid, e);
						}
					}
					catch (e2)
					{
						// ignore
					}
				}
			}
			else
			{
				this.invalidChecksum = false;
				this.inConflictState = false;
				this.setDescriptor(file.getDescriptor());
				this.descriptorChanged();

				EditorUi.debug('File.mergeFile', [this],
					'file', [file], 'ignored', ignored);
			
				if (success != null)
				{
					success();
				}
			}
		}
		else
		{
			reportError = false;
			throw new Error(mxResources.get('notADiagramFile'));
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
DrawioFile.prototype.checksumError = function(fn, patches, details, etag, functionName, checksum, current, rev)
{
	this.stats.checksumErrors++;
	this.inConflictState = true;
	this.invalidChecksum = true;
	this.descriptorChanged();
	
	if (this.sync != null)
	{
		this.sync.updateOnlineState();
	}

	if (fn != null)
	{
		fn();
	}
	
	try
	{
		var user = this.getCurrentUser();
		// Hashed like sendErrorReport: no raw user or file ids in logs
		var uid = (user != null) ? this.ui.hashValue(user.id) : 'unknown';
		var id = (this.getId() != '') ? this.ui.hashValue(this.getId()) :
			('(' + this.ui.hashValue(this.getTitle()) + ')');
		var bytes = JSON.stringify(patches).length;
		var limit = 1000;
		var data = null;
		
		if (patches != null && bytes < limit)
		{
			var newPatches = [];

			for (var i = 0; i < patches.length; i++)
			{
				newPatches.push(this.ui.anonymizePatch(patches[i]));
			}
			
			data = JSON.stringify(newPatches);

			if (data != null && data.length < limit)
			{
				data = Graph.compress(data);
			}
			else
			{
				data = null;
			}
		}

		this.getLatestVersion(mxUtils.bind(this, function(latestFile)
		{				
			// Logs checksum error for file
			try
			{
				var type = (data != null) ? 'report' : 'error';
				var latest = this.ui.getHashValueForPages(latestFile.getShadowPages());
				var latestVersion = 'unknown';
				var latestAgent = 'unknown';
				var latestType = 'unknown';
				
				try
				{
					var node = (latestFile.initialData != null && latestFile.initialData.length > 0) ?
						mxUtils.parseXml(latestFile.initialData).documentElement : null;
					
					if (node != null)
					{
						if (node.getAttribute('version') != null)
						{
							latestVersion = node.getAttribute('version');
						}

						if (node.getAttribute('agent') != null)
						{
							latestAgent = node.getAttribute('agent');
						}

						if (node.getAttribute('type') != null)
						{
							latestType = node.getAttribute('type');
						}
					}
				}
				catch (e)
				{
					// ignore
				}
			
				EditorUi.logError('Checksum ' + type + ' in ' + functionName,
					null, this.getMode() + '.' + id,
					'user_' + uid + ((this.sync != null) ?
					'-client_' + this.sync.clientId : '-nosync') +
					'-bytes_' + bytes + '-patches_' + patches.length +
					((data != null) ? ('-json_' + data) : '')  +
					'-size_' + this.getSize() +
					((checksum != null) ? ('-expected_' + checksum) : '') +
					((current != null) ? ('-current_' + current) : '') +
					((rev != null) ? ('-rev_' + this.ui.hashValue(rev)) : '') +
					((latest != null) ? ('-latest_' + latest) : '') +
					'-latestRev_' + this.ui.hashValue(
						latestFile.getCurrentRevisionId()) +
					('-latestVersion_' + latestVersion) +
					('-latestAgent_' + latestAgent) +
					('-latestType_' + latestType));
				
				EditorUi.logEvent({category: 'CHECKSUM-ERROR-SYNC-FILE-' + id,
					action: functionName, label: 'user_' + uid + ((this.sync != null) ?
					'-client_' + this.sync.clientId : '-nosync') +
					'-bytes_' + bytes + '-patches_' + patches.length +
					'-size_' + this.getSize()});
			}
			catch (e)
			{
				// ignore
			}
		}), function() {});
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
			this.getShadowPages()), 25000);
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
		this.stats.fileReloaded++;
		
		// Saves current view state and changes since last save
		var changes = this.ui.diffPages(this.getShadowPages(),
			(this.isRealtime()) ? this.ownPages : this.ui.pages)
		var graph = this.ui.editor.graph;
		var selection = graph.getSelectionCells();
		var viewState = graph.getViewState();
		var page = this.ui.currentPage;

		this.getLatestVersion(mxUtils.bind(this, function(latestFile)
		{
			EditorUi.debug('DrawioFile.reloadFile', [this],
				'modified', this.isModified(), 'rev', this.getCurrentRevisionId(),
				'changes', [changes], 'viewState', [viewState],
				'latestFile', latestFile);

			if (latestFile != null)
			{
				this.ui.replaceFileData(latestFile.getData(), [changes]);
				this.ui.restoreViewState(page, viewState, selection);
				this.setDescriptor(latestFile.getDescriptor());
				this.descriptorChanged();
			
				if (success != null)
				{
					success();
				}
			}
			else
			{
				// Loads file from scratch with new spinner and resets undo history
				// This should never be called as latestFile should not be null
				this.ui.spinner.stop();

				this.ui.loadFile(this.getHash(), true, null, mxUtils.bind(this, function()
				{
					if (this.ui.fileLoadedError == null)
					{
						// Carry-over stats
						var file = this.ui.getCurrentFile();
						
						if (file != null)
						{
							file.stats = this.stats;
							file.patch([changes]);
							file.fileChanged();
						}
						
						this.ui.restoreViewState(page, viewState, selection);
							
						if (success != null)
						{
							success();
						}
					}
					else if (error != null)
					{
						error(this.ui.fileLoadedError);
					}
				}), true);
			}
		}), error);
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
	
	if (patches != null)
	{
		for (var i = 0; i < patches.length && ignore; i++)
		{
			ignore = ignore && mxUtils.isEmptyObject(patches[i]);
		}
	}
	
	return ignore;
};

/**
 * Returns true if the given patches contain changes for the page with
 * the given ID.
 */
DrawioFile.prototype.isPagePatched = function(patches, id)
{
	for (var i = 0; i < patches.length; i++)
	{
		if (patches[i] != null && patches[i][EditorUi.DIFF_UPDATE] != null &&
			patches[i][EditorUi.DIFF_UPDATE][id] != null)
		{
			return true;
		}
	}

	return false;
};

/**
 * Gives every edge of the given page whose end is neither a terminal
 * nor a terminal point such a point back, and returns true if anything
 * was repaired. Such an end cannot be drawn, so the edge silently
 * disappears from the diagram while every model copy stays perfectly
 * consistent - no convergence verdict can see it.
 *
 * The exact patch paths must not invent the point themselves (the
 * shadow is checksummed against the sender, so anything the sender
 * does not have forces a reload), which is why the repair runs here,
 * on the VISIBLE page, as a first-class local change: it flushes and
 * propagates like any other local edit. It is idempotent - once the
 * point exists the edge is renderable and never repaired again.
 */
DrawioFile.prototype.repairUnrenderableEdges = function(page, repairedIds)
{
	var repaired = false;

	if (page != null && page.root != null)
	{
		var walk = mxUtils.bind(this, function(cell)
		{
			if (cell.isEdge())
			{
				var geo = cell.getGeometry();

				for (var i = 0; geo != null && i < 2; i++)
				{
					var source = (i == 0);

					if (cell.getTerminal(source) == null &&
						geo.getTerminalPoint(source) == null)
					{
						var pt = this.ui.getEdgeEndFallback(cell, source,
							cell.getTerminal(!source));

						if (pt != null)
						{
							geo = geo.clone();
							geo.setTerminalPoint(pt, source);
							cell.setGeometry(geo);
							repaired = true;

							if (repairedIds != null)
							{
								repairedIds[cell.getId()] = true;
							}
						}
					}
				}
			}

			for (var i = 0; i < cell.getChildCount(); i++)
			{
				walk(cell.getChildAt(i));
			}
		});

		walk(page.root);

		if (repaired && page == this.ui.currentPage)
		{
			// Marking a cell invalid does not create its state: without
			// the validation pass the repaired edge stays unrendered
			// until the next unrelated model change
			this.ui.editor.graph.view.invalidate(page.root, true, true);
			this.ui.editor.graph.view.validate();
		}
	}

	return repaired;
};

/**
 * Keeps repairs of cells the own pages do not carry out of the flush,
 * PER CELL: an edge that arrived as an unconfirmed live diff is not
 * this client's to adopt. Flushing its repair runs it through the
 * cross-reference resolution, which pulls the edge AND its ancestor
 * chain into the own pages, and the next save persists them - that is
 * exactly the bounded lifetime which lets a cleanup expel content
 * nobody ever confirmed. Mirroring the repaired geometry into the
 * snapshot keeps the screen correct while the outgoing diff stays
 * empty for those cells; the sender's own save carries the real
 * geometry. Scoped to the page in question, since ids repeat across
 * pages. Returns true if at least one repair may be flushed.
 */
DrawioFile.prototype.absorbUnconfirmedRepairs = function(page, ids, absorbAll)
{
	if (page == null || ids == null)
	{
		return false;
	}

	if (this.ownPages == null && !absorbAll)
	{
		// No realtime copies: everything on screen is this client's
		return true;
	}

	var pageOf = mxUtils.bind(this, function(pages)
	{
		if (pages != null)
		{
			for (var i = 0; i < pages.length; i++)
			{
				if (pages[i].getId() == page.getId())
				{
					this.ui.updatePageRoot(pages[i]);

					return (pages[i].root != null) ?
						new mxGraphModel(pages[i].root) : null;
				}
			}
		}

		return null;
	});

	var ownModel = (absorbAll) ? null : pageOf(this.ownPages);
	var snapModel = pageOf((this.sync != null) ? this.sync.snapshot : null);
	this.ui.updatePageRoot(page);
	var model = (page.root != null) ? new mxGraphModel(page.root) : null;
	var flushable = false;

	for (var id in ids)
	{
		if (ownModel != null && ownModel.getCell(id) != null)
		{
			flushable = true;
		}
		else if (model != null && snapModel != null)
		{
			var cell = model.getCell(id);
			var snapCell = snapModel.getCell(id);

			if (cell != null && snapCell != null &&
				cell.getGeometry() != null)
			{
				snapCell.setGeometry(cell.getGeometry().clone());
			}
		}
	}

	return flushable;
};

/**
 * Adds the ids of all content cells of the given page to the target
 * map. The root and the layer ids are excluded: they repeat on every
 * page, so including them would match edits on surviving pages too.
 */
DrawioFile.prototype.collectPageCellIds = function(page, target)
{
	this.ui.updatePageRoot(page);
	var model = new mxGraphModel(page.root);
	var skip = Object.create(null);
	var root = model.getRoot();

	if (root.getId() != null)
	{
		skip[root.getId()] = true;
	}

	for (var i = 0; i < model.getChildCount(root); i++)
	{
		var layerId = model.getChildAt(root, i).getId();

		if (layerId != null)
		{
			skip[layerId] = true;
		}
	}

	for (var id in model.cells)
	{
		if (!skip[id])
		{
			target[id] = true;
		}
	}
};

/**
 * Applies the given patches to the file. If sendChanges is true the snapshot in
 * the sync client is not updated so a diff can be computed and propagated.
 */
DrawioFile.prototype.patch = function(patches, resolver, undoable, sendChanges, mergeInserts)
{
	if (patches != null)
	{
		EditorUi.debug('DrawioFile.patch', [this], 'patches', patches,
			'undoable', undoable, 'realtime', this.isRealtime(),
			'modified', this.isModified());

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

		// Applies file-level changes before model update so that
		// labels using file variables are resolved correctly
		var oldVars = (this.ui.fileNode != null) ?
			this.ui.fileNode.getAttribute('vars') : null;
		this.ui.patchFileNode(patches);

		if (!sendChanges)
		{
			this.acceptRemoteFileVars(patches);
		}

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
		
		// Captures the modified state so the snapshot below is
		// patched with the same arguments as the pages
		var modified = this.isModified();
		var createdPage = null;

		graph.model.beginUpdate();
		try
		{
			if (undoable)
			{
				var oldPages = this.ui.pages.slice();
				var currentPage = this.ui.currentPage;
				var pages = this.ui.applyPatches(this.ui.pages,
					patches, true, resolver, modified, mergeInserts);
				
				for (var i = 0; i < pages.length; i++)
				{
					var index = mxUtils.indexOf(this.ui.pages, pages[i]);

					if (index < 0)
					{
						this.ui.insertPage(pages[i], Math.min(
							i, this.ui.pages.length));
					}
					else
					{
						this.ui.movePage(index, i);
					}
				}

				for (var i = 0; i < oldPages.length; i++)
				{
					if (mxUtils.indexOf(pages, oldPages[i]) < 0)
					{
						this.ui.removePage(oldPages[i]);
					}
				}

				// Reselects the current page
				if (mxUtils.indexOf(this.ui.pages, currentPage) >= 0)
				{
					this.ui.selectPage(currentPage, true);
				}
			}
			else
			{
				this.ui.pages = this.ui.applyPatches(this.ui.pages,
					patches, true, resolver, modified, mergeInserts);
			}
			
			// Always needs at least one page
			if (this.ui.pages.length == 0)
			{
				createdPage = this.ui.createPage();
				this.ui.pages.push(createdPage);
			}

			// Checks if current page was removed
			if (mxUtils.indexOf(this.ui.pages, this.ui.currentPage) < 0)
			{
				this.ui.selectPage(this.ui.pages[0], true);
			}

			// Checks if default parent was replaced
			graph.checkDefaultParent();
		}
		finally
		{
			// Changes visibility before action states are updated via model event
			graph.container.style.visibility = '';
			graph.model.endUpdate();
		
			// Restores previous state
			graph.cellRenderer.redraw = redraw;
			this.changeListenerEnabled = prev;
		
			// Restores history state: the history stays COMPLETE across
			// external patches. Edits whose object references the patch
			// removed or replaced are repaired at execute time (see the
			// change execute wraps in EditorUi.js and Pages.js), never
			// dropped - resolution must happen per replay, as a later
			// remote change can revive the referenced id
			if (!undoable)
			{
				undoMgr.history = history;
				undoMgr.indexOfNextAdd = nextAdd;
				undoMgr.fireEvent(new mxEventObject(mxEvent.CLEAR));
			}
			
			var varsChanged = oldVars != ((this.ui.fileNode != null) ?
				this.ui.fileNode.getAttribute('vars') : null);
			var needsUpdate = this.ui.currentPage == null ||
				this.ui.currentPage.needsUpdate;

			if (needsUpdate && math != graph.mathEnabled)
			{
				this.ui.editor.updateGraphComponents();
				graph.refresh();
			}
			else if (varsChanged)
			{
				graph.refresh();
			}
			else if (needsUpdate)
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

			// Updates snapshot for finding local changes in sync by
			// applying the patches with the same arguments as for the
			// pages above: the snapshot must converge to the exact
			// same state or sendLocalChanges echoes remote changes
			// back to collaborators as local changes
			if (this.sync != null && this.isRealtime() && !sendChanges)
			{
				if (this.sync.snapshot == null || createdPage != null)
				{
					this.sync.snapshot = this.ui.clonePages(this.ui.pages);
				}
				else
				{
					this.sync.snapshot = this.ui.applyPatches(this.sync.snapshot,
						patches, false, resolver, modified, mergeInserts);

					// Reactive changes (eg. layouts via the layout manager)
					// are applied to the current page in the graph but not in
					// the patched snapshot. They are stateful, first-class
					// local changes authored by this client and are scheduled
					// for the next flush and save like any other local edit,
					// so they reach collaborators and the file explicitly.
					// Client-local handling is not possible as peers on other
					// pages never run the layout and the last saver would
					// persist a state the layout can never produce. The
					// snapshot keeps the raw patch result so the delta stays
					// diffable, and fileChanged is called explicitly as the
					// change listener is disabled during the patch.
					var current = this.ui.currentPage;

					// Edges the patch left with an undetermined end are
					// unrenderable and would silently vanish from the
					// screen (see repairUnrenderableEdges). Repaired on
					// EVERY patched page, not just the viewed one: a
					// patch removes terminals wherever it lands, the
					// exact paths must not invent a point, and an edge
					// left undetermined on another page is just as
					// undrawable - it only stays unnoticed longer,
					// because nobody is looking at it and every model
					// copy agrees. The flush sanitizer does not cover
					// it either: it only visits pages the user changed.
					for (var pi = 0; pi < this.ui.pages.length; pi++)
					{
						var patched = this.ui.pages[pi];

						if (!this.isPagePatched(patches, patched.getId()))
						{
							continue;
						}

						var pageIds = Object.create(null);

						// A repair becomes a first-class local change so
						// it reaches collaborators and the file - but
						// only if this client may save at all and only
						// for content the file already knows. On a
						// non-editable client modified would never clear
						// again (the revoked split-brain class), and an
						// edge that arrived as an unconfirmed live diff
						// is not ours to adopt: the flush would pull it
						// and its parents into the own pages and the
						// next save would persist injected content that
						// must expire with the next cleanup instead.
						// absorbUnconfirmedRepairs mirrors those into
						// the snapshot, so the screen keeps the repair
						// while the outgoing diff stays empty for them.
						if (this.repairUnrenderableEdges(patched, pageIds) &&
							this.absorbUnconfirmedRepairs(patched, pageIds,
								!this.isEditable()))
						{
							this.fileChanged(null,
								{pageId: patched.getId()}, true);
						}
					}

					if (current != null &&
						this.isPagePatched(patches, current.getId()))
					{
						for (var i = 0; i < this.sync.snapshot.length; i++)
						{
							if (this.sync.snapshot[i].getId() == current.getId())
							{
								var delta = this.ui.diffPages(
									[this.sync.snapshot[i]], [current]);

								if (!this.ignorePatches([delta]))
								{
									if (this.isEditable())
									{
										this.fileChanged(null,
											'currentPage', true);
									}
									else
									{
										// A non-editable client can never
										// confirm the delta through its
										// own save, and absorbing it into
										// the own pages would revert
										// every incoming save on this
										// client (the layout recomputes
										// from the LOCAL child order
										// after each merge - permanent
										// split brain). Only the snapshot
										// adopts the visible result so no
										// flush echoes it; the next
										// cleanup aligns the screen with
										// the own pages and the layout
										// then agrees with the saved
										// state.
										this.sync.snapshot[i] =
											this.ui.clonePages([current])[0];
									}
								}

								break;
							}
						}
					}
				}

				this.sync.snapshotVars = (this.ui.fileNode != null) ?
					this.ui.fileNode.getAttribute('vars') : null;

				// Verifies that the snapshot matches the pages while no
				// local changes are pending, ie. the next outgoing diff
				// must be empty
				// Release telemetry: the check also runs in sampled sessions
				if ((urlParams['test'] == '1' || (EditorUi.realtimeTelemetry &&
					EditorUi.realtimeTelemetrySampled)) && !this.sync.localFileWasChanged &&
					this.ui.getHashValueForPages(this.sync.snapshot) !=
					this.ui.getHashValueForPages(this.ui.pages))
				{
					EditorUi.debug('DrawioFile.patch', [this],
						'snapshot mismatch', this.sync.snapshot,
						'pages', this.ui.pages, 'diff', this.ui.diffPages(
							this.sync.snapshot, this.ui.pages));
					EditorUi.logRealtime('snapshot-drift',
						{p: this.ui.pages.length}, this, this.getId());

					if (urlParams['test'] == '1')
					{
						this.ui.alert('Snapshot out of sync');
					}
				}
			}
			
			this.ui.editor.fireEvent(new mxEventObject('pagesPatched', 'patches', patches));
		}

		EditorUi.debug('DrawioFile.patch', [this],
			'patches', patches, 'resolver', resolver,
			'undoable', undoable);
	}

	return patches;
};

/**
 * Loads the fonts used in the diagram into the local font cache if this is
 * the current file in the UI and an SVG file that is saved with embedded
 * fonts, so that the following synchronous update of the file data can
 * embed the font data. The callback is invoked when the fonts are
 * available, immediately if there is nothing to load, or after
 * loadFontsTimeout ms if the fonts cannot be loaded in time.
 */
DrawioFile.prototype.loadFonts = function(callback)
{
	if (this.ui.getCurrentFile() == this && /(\.svg)$/i.test(this.getTitle()) &&
		this.ui.getSvgFileProperties(this.ui.fileNode).embedFonts)
	{
		var timeoutThread = null;
		var called = false;

		var done = function()
		{
			if (!called)
			{
				called = true;
				window.clearTimeout(timeoutThread);
				callback();
			}
		};

		// Falls back to external font references in the saved data
		// if the fonts cannot be loaded in time
		timeoutThread = window.setTimeout(done, this.loadFontsTimeout);

		try
		{
			this.ui.editor.loadFonts(mxUtils.bind(this, function()
			{
				this.ui.editor.embedExtFonts(done);
			}));
		}
		catch (e)
		{
			done();
		}
	}
	else
	{
		callback();
	}
};

/**
 * Adds the listener for automatically saving the diagram for local changes.
 */
DrawioFile.prototype.save = function(revision, success, error, unloading, overwrite, manual)
{
	if (this.appUpgradeRequired)
	{
		if (error != null)
		{
			error({message: mxResources.get('redirectToNewApp')});
		}
		else
		{
			this.redirectToNewApp(function() {});
		}

		return;
	}

	try
	{
		EditorUi.debug('DrawioFile.save', [this], 'revision', revision,
			'unloading', unloading, 'overwrite', overwrite, 'manual', manual,
			'saving', this.savingFile, 'editable', this.isEditable(),
			'invalidChecksum', this.invalidChecksum);

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
			this.clearAutosave();

			var doSave = mxUtils.bind(this, function()
			{
				try
				{
					if (this.appUpgradeRequired)
					{
						throw new Error(mxResources.get('redirectToNewApp'));
					}

					this.updateFileData();

					if (success != null)
					{
						success();
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
			});

			// Waits for the fonts used in the file to be loaded into
			// the local cache for saving SVG files with embedded fonts,
			// keeps the synchronous flow during page unload
			if (unloading)
			{
				doSave();
			}
			else
			{
				this.loadFonts(doSave);
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
DrawioFile.prototype.createData = function()
{
	var actualPages = this.ui.pages;

	if (this.isRealtime())
	{
		// Uses ownPages for getting file data below
		this.ui.pages = this.ownPages;

		// Updates view state in own current page
		if (this.ui.currentPage != null)
		{
			var ownPage = this.ui.getPageById(
				this.ui.currentPage.getId(),
				this.ownPages);

			if (ownPage != null)
			{
				ownPage.viewState = this.ui.editor.graph.getViewState();
				ownPage.needsUpdate = true;
			}
		}
	}

	var result = this.ui.getFileData(null, null, null, null,
		null, null, null, null, this, !this.isCompressed());
	this.ui.pages = actualPages;

	return result;
};

/**
 * Translates this point by the given vector.
 * 
 * @param {number} dx X-coordinate of the translation.
 * @param {number} dy Y-coordinate of the translation.
 */
DrawioFile.prototype.updateFileData = function()
{
	// Sends pending local changes and updates own pages
	if (this.sync != null)
	{
		this.sync.sendLocalChanges();
	}

	this.setData(this.createData());
	// Identify the ownership interval serialized by this write, even
	// when no realtime sync object exists. A foreign write starts a
	// new interval, so an old completion cannot confirm a later edit.
	this.savingFileVars = this.pendingFileVars;
	
	if (this.sync != null)
	{
		this.sync.fileDataUpdated();
	}
};

/**
 * Translates this point by the given vector.
 * 
 * @param {number} dx X-coordinate of the translation.
 * @param {number} dy Y-coordinate of the translation.
 */
DrawioFile.prototype.isCompressedStorage = function()
{
	return Editor.defaultCompressed;
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
DrawioFile.prototype.setLocked = function(locked)
{
	this.ui.fileNode.setAttribute('locked',
		(locked) ? 'true' : 'false');
	this.ui.fireEvent(new mxEventObject('lockedChanged'));
	this.fileChanged();

	if (locked)
	{
		this.ui.editor.graph.clearSelection();
	}
};

/**
 * Translates this point by the given vector.
 * 
 * @param {number} dx X-coordinate of the translation.
 * @param {number} dy Y-coordinate of the translation.
 */
DrawioFile.prototype.isLocked = function()
{
	var locked = (this.ui.fileNode != null) ? this.ui.fileNode.getAttribute('locked') : null;
	
	if (locked != null)
	{
		return locked == 'true';
	}
	
	return false;
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
DrawioFile.prototype.getFileUrl = function()
{
	return null;
};

/**
 * Returns true if copy, export and print are not allowed for this file.
 */
DrawioFile.prototype.getFolderUrl = function(fn)
{
	return null;
};

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
	return DrawioFile.RESTRICT_EXPORT;
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
	if (this.ui.drive != null)
	{
		this.ui.confirm(mxResources.get('saveItToGoogleDriveToCollaborate', [this.getTitle()]),
			mxUtils.bind(this, function()
		{
			this.ui.pickFolder(App.MODE_GOOGLE, mxUtils.bind(this, function(folderId)
			{
				var graph = this.ui.editor.graph;
				var selection = graph.getSelectionCells();
				var viewState = graph.getViewState();
				var page = this.ui.currentPage;
				
				this.ui.createFile(this.getTitle(), this.ui.getFileData(null, null, null, null, null,
					null, null, null, this), null, App.MODE_GOOGLE, null, true, folderId, null, null,
					mxUtils.bind(this, function()
					{
						this.ui.restoreViewState(page, viewState, selection);
						this.ui.actions.get('share').funct();
					}));
			}));
		}), null, mxResources.get('saveToGoogleDrive'), mxResources.get('cancel'));
	}
	else
	{
		this.ui.alert(mxResources.get('sharingAvailable'), null, 380);
	}
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
	return !this.writeRevoked && (!this.ui.editor.isChromelessView() ||
		this.ui.editor.editable);
};

/**
 * Returns true if the given save error COULD mean the write permission
 * was revoked. This is only the pre-filter: rate limits and auth
 * refreshes produce the same status, so the actual revoke decision is
 * made by verifyWriteRevoked against the provider descriptor.
 */
DrawioFile.prototype.isWriteRevokedError = function(err)
{
	return err != null && (err.code == 403 || err.status == 403 ||
		(err.error != null && err.error.code == 403));
};

/**
 * Verifies a suspected write revoke against the provider and reports
 * the result to the callback: true only if the file is effectively
 * read-only per a freshly loaded descriptor (eg. isEditable on
 * DriveFile). The default has no descriptor-level editability, so the
 * error stays transient and a later save retries.
 */
DrawioFile.prototype.verifyWriteRevoked = function(callback)
{
	callback(false);
};

/**
 * Handles losing the write permission DURING a realtime session: the
 * realtime channel keeps sending, but no save of this client can ever
 * confirm its changes - by the single-source-of-truth model they are
 * invalid and must be rolled back. The visible document returns to
 * the last confirmed file state, the rollback goes out as a final
 * live diff so collaborators see the retraction immediately (it
 * carries the file state, so it only aids convergence), the undo
 * history is cleared (it references retracted objects) and the file
 * becomes read-only.
 */
DrawioFile.prototype.handleWriteRevoked = function(err)
{
	// Repeated denied saves (retries, quiescence cycles) must not
	// repeat the rollback broadcast: the first revoke already did the
	// retraction, a second pass would diff the meanwhile-received
	// remote state against the shadow and retract foreign work
	if (this.writeRevoked)
	{
		return;
	}

	EditorUi.logRealtime('write-revoked', null, this, this.getId());

	try
	{
		if (this.isRealtime() && this.sync != null)
		{
			// Flushes first, as cleanup and merge do: ownPages only
			// holds changes up to the last flush, so edits made inside
			// the debounce window or during the descriptor round trip
			// would escape the retraction entirely - they would stay on
			// screen as apparently durable work on a file that can
			// never save again, and the peers would keep them too.
			this.sync.sendLocalChanges();

			var shadow = this.ui.clonePages(this.getShadowPages());

			// Only the OWN unconfirmed changes are retracted: the
			// visible pages also hold unsaved live edits received from
			// the peers, and diffing them would broadcast removes for
			// foreign cells - visibly retracting the peers' work and
			// invalidating their undo histories via the replaced-ids
			// pass. ownPages holds exactly the confirmed state plus the
			// own unconfirmed changes, so its delta to the shadow is
			// the retraction.
			var patches = [this.ui.diffPages(this.ownPages, shadow)];
			var patch = patches[0];

			// Vars do not belong to the page diff. Retract only the
			// current own write, restoring the saved or foreign value
			// it displaced. A later peer vars write clears this state.
			if (this.pendingFileVars != null)
			{
				patch[EditorUi.DIFF_FILE] =
					{vars: this.pendingFileVars.before};
			}

			// An own unconfirmed page can already carry unsaved work
			// from the peers (visible here, absent from ownPages).
			// Removing such a page would retract their work and
			// invalidate their histories as a side effect, so the page
			// is kept - only the own cells on it are retracted - and
			// the next saver confirms it. Pages without foreign work
			// are retracted whole.
			if (patch[EditorUi.DIFF_REMOVE] != null)
			{
				var removes = [];

				for (var i = 0; i < patch[EditorUi.DIFF_REMOVE].length; i++)
				{
					var pageId = patch[EditorUi.DIFF_REMOVE][i];
					var ownPage = null;
					var uiPage = null;

					for (var j = 0; j < this.ownPages.length; j++)
					{
						if (this.ownPages[j].getId() == pageId)
						{
							ownPage = this.ownPages[j];
							break;
						}
					}

					for (var j = 0; j < this.ui.pages.length; j++)
					{
						if (this.ui.pages[j].getId() == pageId)
						{
							uiPage = this.ui.pages[j];
							break;
						}
					}

					var foreign = ownPage != null && uiPage != null &&
						!mxUtils.isEmptyObject(this.ui.diffPages(
							[ownPage], [uiPage]));

					if (foreign)
					{
						var cellIdMap = Object.create(null);
						this.collectPageCellIds(ownPage, cellIdMap);
						var cellIds = [];

						for (var id in cellIdMap)
						{
							cellIds.push(id);
						}

						if (cellIds.length > 0)
						{
							if (patch[EditorUi.DIFF_UPDATE] == null)
							{
								// Null prototype: keyed by page ids from
								// the document, like every other id map
								patch[EditorUi.DIFF_UPDATE] =
									Object.create(null);
							}

							patch[EditorUi.DIFF_UPDATE][pageId] =
								{cells: {}};
							patch[EditorUi.DIFF_UPDATE][pageId].cells[
								EditorUi.DIFF_REMOVE] = cellIds;
						}
					}
					else
					{
						removes.push(pageId);
					}
				}

				if (removes.length > 0)
				{
					patch[EditorUi.DIFF_REMOVE] = removes;
				}
				else
				{
					delete patch[EditorUi.DIFF_REMOVE];
				}
			}

			// Removing an own container also removes all its descendants,
			// including cells the peers inserted inside it. Keep the
			// ancestor chain required by those foreign cells, on saved
			// pages AND on new pages retained above. Own-only branches
			// are still retracted; the remaining structure belongs to the
			// peer's pending insert and is confirmed by their next save.
			var updates = patch[EditorUi.DIFF_UPDATE];

			if (updates != null)
			{
				for (var pageId in updates)
				{
					var cells = updates[pageId].cells;
					var cellRemoves = (cells != null) ?
						cells[EditorUi.DIFF_REMOVE] : null;
					var ownPage = this.ui.getPageById(pageId, this.ownPages);
					var uiPage = this.ui.getPageById(pageId);

					if (cellRemoves != null && ownPage != null && uiPage != null)
					{
						this.ui.updatePageRoot(ownPage);
						this.ui.updatePageRoot(uiPage);
						var ownModel = new mxGraphModel(ownPage.root);
						var uiModel = new mxGraphModel(uiPage.root);
						var needed = Object.create(null);

						for (var id in uiModel.cells)
						{
							if (ownModel.getCell(id) == null)
							{
								var parent = uiModel.getCell(id).getParent();

								while (parent != null && !needed[parent.getId()])
								{
									needed[parent.getId()] = true;
									parent = parent.getParent();
								}
							}
						}

						var removes = [];

						for (var i = 0; i < cellRemoves.length; i++)
						{
							if (!needed[cellRemoves[i]])
							{
								removes.push(cellRemoves[i]);
							}
						}

						if (removes.length > 0)
						{
							cells[EditorUi.DIFF_REMOVE] = removes;
						}
						else
						{
							delete cells[EditorUi.DIFF_REMOVE];
						}
					}
				}
			}

			if (!this.ignorePatches(patches))
			{
				// sendChanges keeps the snapshot at the pre-rollback
				// state so the flush below broadcasts the retraction
				// and advances ownPages to the confirmed file state.
				// The patch runs with the change listener disabled, so
				// no pages are marked dirty - the flush must fall back
				// to diffing all pages
				this.patch(patches, null, false, true);
				this.sync.dirtyPageIds = null;
				this.sync.localFileWasChanged = true;
				this.sync.sendLocalChanges();
			}

			this.pendingFileVars = null;
			this.savingFileVars = null;

			// The peers' unsaved edits stay visible and remain the last
			// known remote state (they are not retracted, their senders
			// still own them)
			this.theirPages = this.ui.clonePages(this.ui.pages);
		}
	}
	catch (e)
	{
		// The rollback must never leave the error path broken, but a
		// failed retraction diverges this client from its peers for the
		// rest of the session and must not do so silently
		try
		{
			var user = this.getCurrentUser();
			// Hashed like sendErrorReport: no raw user or file ids in logs
			var uid = (user != null) ? this.ui.hashValue(user.id) : 'unknown';

			EditorUi.logError('Error in handleWriteRevoked', null,
				this.getMode() + '.' + this.ui.hashValue(this.getId()), uid, e);
		}
		catch (e2)
		{
			// ignore
		}
	}

	this.ui.editor.undoManager.clear();
	this.setModified(false);
	this.writeRevoked = true;
	this.descriptorChanged();

	this.ui.updateStatus(mxUtils.bind(this, function()
	{
		this.ui.editor.setStatus('<div class="geStatusAlert">' +
			mxUtils.htmlEntities(mxResources.get('readOnly')) + '</div>');
	}));
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

	EditorUi.debug('DrawioFile.setData',
		[this], 'data', [data]);
};

/**
 * Returns the current data of the file.
 */
DrawioFile.prototype.getData = function()
{
	return this.data;
};

/**
 * Removes external fonts.
 */
DrawioFile.prototype.removeExtFonts = function(elems)
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

/**
 * Opens this file in the editor.
 */
DrawioFile.prototype.open = function()
{
	this.stats.opened++;
	var data = this.getData();
	
	if (data != null)
	{
		this.ui.setFileData(data, this);
		
		// Updates shadow in case any page IDs have been updated
		// only if the file has not been modified and reopened
		if (!this.isModified())
		{
			this.setShadowPages(this.ui.clonePages(this.ui.pages));
		}
	}

	this.installListeners();
	
	if (this.isSyncSupported())
	{
		this.startSync();
	}

	EditorUi.debug('DrawioFile.open', [this]);
};

/**
 * Returns true if polling should be used to update the file.
 */
DrawioFile.prototype.isPolling = function()
{
	return false;
};

/**
 * Returns the polling interval.
 */
DrawioFile.prototype.getPollingInterval = function()
{
	return 10000;
};

/**
 * Hook for subclassers.
 */
DrawioFile.prototype.isSyncSupported = function()
{
	return false;
};

/**
 * Returns true if the realtime model was initialized.
 */
DrawioFile.prototype.isRealtime = function()
{
	return this.ownPages != null && this.ui.pages != null;
};

/**
 * Returns true if the file supportes realtime collaboration.
 */
DrawioFile.prototype.isRealtimeSupported = function()
{
	return false;
};

/**
 * Returns true if realtime collaboration is enabled for this file.
 */
DrawioFile.prototype.isRealtimeEnabled = function()
{
	return Editor.enableRealtime && urlParams['fast-sync'] != '0';
};

/**
 * Returns true if all changes should be sent out immediately.
 */
DrawioFile.prototype.setRealtimeEnabled = function()
{
	// do nothing
};

/**
 * Returns true if realtime can be enabled and disabled for this file.
 */
DrawioFile.prototype.isRealtimeOptional = function()
{
	return false;
};

/**
 * Returns the ready state of realtime collaboration websocket.
 * 
 * 0 - CONNECTING
 * 1 - OPEN
 * 2 - CLOSING
 * 3 - CLOSED
 */
DrawioFile.prototype.getRealtimeState = function()
{
	return (this.sync != null && this.sync.p2pCollab != null) ?
		this.sync.p2pCollab.getState() : 3 /* CLOSED */;
};

/**
 * Returns true if all changes should be sent out immediately.
 */
DrawioFile.prototype.getRealtimeError = function()
{
	return (this.sync != null && this.sync.p2pCollab != null) ?
		this.sync.p2pCollab.getLastError() : null;
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
 * Returns a prior known-good version of this file for best-effort recovery (or
 * null) via the success handler. The default walks the revision history newest
 * first, skipping the current head (the content that just failed to load), and
 * returns the most recent revision whose XML parses. Bounded to a few probes to
 * limit API calls. Files with another source (eg. the desktop .bkp backup) or
 * without revision history may override this. Never calls error - a listing or
 * fetch failure is treated as "no recovery version".
 */
DrawioFile.prototype.getRecoveryVersion = function(success, error)
{
	if (!this.isRevisionHistorySupported())
	{
		success(null);
		return;
	}

	this.getRevisions(mxUtils.bind(this, function(revs)
	{
		// revs are ordered oldest -> newest; revs[length - 1] is the current
		// head, so the most recent prior revision is at length - 2
		if (revs == null || revs.length < 2)
		{
			success(null);
			return;
		}

		var maxProbe = 5;
		var index = revs.length - 2;
		var end = Math.max(0, index - maxProbe + 1);

		var tryNext = mxUtils.bind(this, function()
		{
			if (index < end)
			{
				EditorUi.debug('DrawioFile.getRecoveryVersion', [this],
					'no valid revision found in', (revs.length - 1 - end), 'probed');
				success(null);
				return;
			}

			var item = revs[index--];

			if (item == null || typeof item.getXml !== 'function')
			{
				tryNext();
				return;
			}

			item.getXml(mxUtils.bind(this, function(xml)
			{
				if (this.ui.isFileDataLoadable(xml))
				{
					var dateStr = this.ui.formatRecoveryDate(item.modifiedDate);

					success({type: 'version',
						label: (dateStr != null) ? mxResources.get('recoverVersionFrom', [dateStr]) :
							mxResources.get('recoverPreviousVersion'),
						description: mxResources.get('recoveryVersionDesc'),
						data: xml, date: item.modifiedDate, lossy: false});
				}
				else
				{
					tryNext();
				}
			}), mxUtils.bind(this, function()
			{
				tryNext();
			}));
		});

		tryNext();
	}), mxUtils.bind(this, function()
	{
		// Revision listing failed - no recovery version available
		success(null);
	}));
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
	if (((DrawioFile.SYNC == 'auto' || DrawioFile.SYNC == 'fast')  &&
		urlParams['stealth'] != '1') && (urlParams['rt'] == '1' ||
		!this.ui.editor.chromeless || this.ui.editor.editable))
	{
		if (this.sync == null)
		{
			this.sync = new DrawioFileSync(this);
		}

		this.addListener('realtimeStateChanged', mxUtils.bind(this, function()
		{
			this.ui.fireEvent(new mxEventObject('realtimeStateChanged'));
		}));
		
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
 * Hook for subclassers to get the latest version ID of this file
 * and return it in the success handler.
 */
DrawioFile.prototype.getLatestVersionId = function(success, error)
{
	success(-1);
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
 * Returns the checksum from the given descriptor. This must be stored
 * in a custom property and generated by the saving client so that
 * the current state of the editor can be compared with the state.
 */
DrawioFile.prototype.getDescriptorChecksum = function(desc)
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
				// Non-model events (eg. background changes) affect
				// the current page only
				this.fileChanged(null, (edit != null) ?
					edit : 'currentPage');
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
 * Shows when the file was last changed, the status the realtime sync
 * shows after a remote save. Used after a synchronization that merged
 * external changes into an unmodified document.
 */
DrawioFile.prototype.addLastChangeStatus = function()
{
	if (this.ui.statusContainer != null && this.ui.getCurrentFile() == this)
	{
		this.ui.updateStatus(mxUtils.bind(this, function()
		{
			var date = this.getLastModifiedDate();
			var str = (date != null) ? this.ui.timeSince(date) : null;

			if (str == null)
			{
				str = mxResources.get('lessThanAMinute');
			}

			var label = mxUtils.htmlEntities(mxResources.get('lastChange', [str]));
			var rev = (this.isRevisionHistorySupported()) ? 'data-action="revisionHistory" ' : '';
			var title = label + ((this.isRevisionHistorySupported()) ? ' - ' +
				mxUtils.htmlEntities(mxResources.get('revisionHistory')) : '');

			this.ui.editor.setStatus('<div ' + rev + 'title="' + title + '">' + label + '</div>');
		}));
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
		var rev = (this.isRevisionHistorySupported() && status != mxUtils.htmlEntities(
			mxResources.get(this.savingStatusKey)) + '...') ? 'data-action="revisionHistory" ' : '';
		this.ui.editor.setStatus('<div ' + rev + 'title="'+ status + '">' + status +
			(this.isLocked() ? ' <img class="geToolbarButton geAdaptiveAsset" data-action="properties" ' +
			'style="margin-left:4px;flex-shrink:0;" src="' + Editor.lockedImage + '"/>' : '') + '</div>');
	}
};

/**
 * Adds the listener for automatically saving the diagram for local changes.
 */
DrawioFile.prototype.saveDraft = function(data)
{
	try
	{
		data = (data != null) ? data : this.ui.getFileData();

		// Empty diagrams are useless as drafts — drop any existing one
		// instead of writing an empty record, so the post-restart prompt
		// doesn't surface drafts that contain nothing to recover.
		if (this.ui.isDiagramDataEmpty(data))
		{
			this.removeDraft();
			return;
		}

		if (this.draftId == null)
		{
			if (this.usedDraftId != null)
			{
				this.draftId = this.usedDraftId;
			}
			else
			{
				this.draftId = Editor.guid();
			}
		}

		var draft = {type: 'draft',
			created: this.created,
			modified: new Date().getTime(),
			data: data,
			title: this.getTitle(),
			fileObject: this.fileObject,
			aliveCheck: this.ui.draftAliveCheck};
		this.ui.setDatabaseItem('.draft_' + this.draftId,
			JSON.stringify(draft));

		EditorUi.debug('DrawioFile.saveDraft', [this],
			'draftId', this.draftId, [draft]);
	}
	catch (e)
	{
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
			EditorUi.debug('DrawioFile.removeDraft',
				[this], 'draftId', this.draftId);
			
			this.ui.removeDatabaseItem('.draft_' + this.draftId);
			this.usedDraftId = this.draftId;
			this.draftId = null;
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
			this.ui.updateStatus(mxUtils.bind(this, function()
			{
				var status = mxUtils.htmlEntities(mxResources.get('unsavedChanges'));
				this.ui.editor.setStatus('<div title="'+ status + '" data-title="' +
					mxUtils.htmlEntities(mxResources.get('unsavedChanges')) +
					'" data-message="' + mxUtils.htmlEntities(err.message) +
					'" class="geStatusAlert">' + status + ' (' +
					mxUtils.htmlEntities(err.message) + ')</div>');
			}));
		}
		else
		{
			this.ui.updateStatus(mxUtils.bind(this, function()
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
				var action = 'data-action="' + ((this.ui.mode == null || !this.isEditable()) ?
					'saveAs' : 'save') + '"';
				this.ui.editor.setStatus('<div ' + action + ' title="' +
					status + '" class="geStatusAlert">' + status + '</div>');
			}));
			
			if (EditorUi.enableDrafts && (this.getMode() == null || EditorUi.isElectronApp))
			{
				this.lastDraftSave = this.lastDraftSave || Date.now();

				if (this.saveDraftThread != null)
				{
					window.clearTimeout(this.saveDraftThread);
					this.saveDraftThread = null;

					// Max delay without saving is double the delay for autosave or 30 sec
					if (Date.now() - this.lastDraftSave > Math.max(2 * EditorUi.draftSaveDelay, 30000))
					{
						this.lastDraftSave = Date.now();
						this.saveDraft();
					}
				}

				this.saveDraftThread = window.setTimeout(mxUtils.bind(this, function()
				{
					this.lastDraftSave = Date.now();
					this.saveDraftThread = null;
					this.saveDraft();
				}), EditorUi.draftSaveDelay || 0);
			}
		}
	}
};

/**
 * Halts all timers and shows a conflict status message. The optional error
 * handler is invoked first.
 */
DrawioFile.prototype.addConflictStatus = function(message, fn)
{
	this.ui.updateStatus(mxUtils.bind(this, function()
	{
		if (this.invalidChecksum && message == null)
		{
			message = mxResources.get('checksum');
		}

		this.setConflictStatus(mxUtils.htmlEntities(mxResources.get('fileChangedSync')) +
			((message != null && message != '') ? ' (' +
			mxUtils.htmlEntities(message) + ')' : ''), fn);
	}));

	this.ui.spinner.stop();
	this.clearAutosave();
};

/**
 * Halts all timers and shows a conflict status message. The optional error
 * handler is invoked first.
 */
DrawioFile.prototype.setConflictStatus = function(message, fn)
{
	this.ui.editor.setStatus('<div title="'+ message + '" ' + ((fn != null) ?
		'data-action="statusFunction"' : '') + ' class="geStatusAlert">' + message +
		'<img data-link="https://www.drawio.com/doc/faq/synchronize" src="' +
		Editor.helpImage + '" style="margin-left:2px;cursor:help;"/></div>', fn);
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
		this.addConflictStatus(message, mxUtils.bind(this, function()
		{
			this.showRefreshDialog(success, error);
		}));
		
		this.ui.showError(mxResources.get('warning') + ' (' + message + ')',
			mxResources.get('fileChangedSyncDialog'),
			mxResources.get('makeCopy'), mxUtils.bind(this, function()
		{
			this.copyFile(mxUtils.bind(this, function()
			{
				if (success != null)
				{
					success();
				}

				this.ui.alert(mxResources.get('copyCreated'));
			}), error);
		}), null, mxResources.get('merge'), mxUtils.bind(this, function()
		{
			if (this.ui.spinner.spin(document.body, mxResources.get('updatingDocument')))
			{
				this.reloadFile(mxUtils.bind(this, function()
				{
					this.ui.spinner.stop();

					if (success != null)
					{
						success();
					}
				}), mxUtils.bind(this, function()
				{
					this.ui.spinner.stop();
					
					if (error != null)
					{
						error();
					}
				}));
			}
		}), mxResources.get('cancel'), mxUtils.bind(this, function()
		{
			this.ui.hideDialog();
		}), 380, 130);
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
	}), 380, 150);
};

/**
 * Shows a conflict dialog to the user.
 */
DrawioFile.prototype.showConflictDialog = function(overwrite, synchronize)
{
	this.ui.showError(mxResources.get('externalChanges'),
		mxResources.get('fileChangedSyncDialog'),
		mxResources.get('overwrite'), overwrite, null,
		mxResources.get('merge'), synchronize,
		mxResources.get('cancel'), mxUtils.bind(this, function()
	{
		this.ui.hideDialog();
		this.handleFileError(null, false);
	}), 380, 130);
};

/**
 * Stops synchronization and saves while preserving work for local export.
 */
DrawioFile.prototype.requireAppUpgrade = function()
{
	if (!this.appUpgradeRequired)
	{
		this.appUpgradeRequired = true;
		EditorUi.logRealtime('upgrade-required', {min: (this.sync != null) ?
			this.sync.minRemoteAppVersion : null}, this, this.getId());
		this.clearAutosave();

		if (this.sync != null)
		{
			this.sync.enabled = false;

			if (this.sync.p2pCollab != null)
			{
				this.sync.p2pCollab.destroy();
			}
		}

		// Keep the document and modified flag intact. Cancel lets the user
		// export a local copy before explicitly discarding and reloading.
		this.redirectToNewApp(function() {});
	}
};

/**
 * Offers an app update without discarding pending edits on cancellation.
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

				// Assigning a URL that differs from the current one in its
				// fragment only does not navigate: the browser changes the
				// fragment and fires hashchange, so the old app stayed
				// loaded whenever the file has no hash (getHash returns ''
				// for local files, so the target ended in a bare #) or a
				// hash other than the one in the address bar. Compared
				// without the fragment; a same-base target sets the
				// fragment and reloads explicitly.
				var hashIndex = url.indexOf('#');
				var targetBase = (hashIndex < 0) ? url : url.substring(0, hashIndex);
				var targetHash = (hashIndex < 0) ? '' : url.substring(hashIndex);
				var currentBase = window.location.href.split('#')[0];

				var navigate = mxUtils.bind(this, function()
				{
					if (currentBase == targetBase)
					{
						if (targetHash.length > 1 &&
							window.location.hash != targetHash)
						{
							window.location.hash = targetHash;
						}

						window.location.reload();
					}
					else
					{
						window.location.href = url;
					}

					// The browser asks before leaving a modified file and
					// keeps the page when that is declined, so the spinner
					// shown for the service worker update is stopped once
					// the navigation is triggered (a page that does unload
					// is gone right after)
					this.ui.spinner.stop();
				});

				// A reload served by the old service worker still runs
				// the old app and merely installs the update in the
				// background, so this dialog would show a second time.
				// Waiting for the updated worker to activate makes the
				// reload load the new app in one step.
				if (typeof App !== 'undefined' && App.updateServiceWorker != null)
				{
					this.ui.spinner.spin(document.body, mxResources.get('loading'));
					App.updateServiceWorker(navigate);
				}
				else
				{
					navigate();
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
		EditorUi.debug('DrawioFile.handleFileSuccess', [this],
			'saved', saved, 'modified', this.isModified(),
			'remoteFileChanged', (this.sync == null) ?
			'n/a' : this.sync.remoteFileChanged);

		if (this.isModified())
		{
			this.fileChanged();
		}
		else if (saved)
		{
			if (this.isTrashed())
			{
				this.ui.updateStatus(mxUtils.bind(this, function()
				{
					this.addAllSavedStatus(mxUtils.htmlEntities(
						mxResources.get(this.allChangesSavedKey)) + ' (' +
						mxUtils.htmlEntities(mxResources.get('fileMovedToTrash')) + ')');
				}));
			}
			else
			{
				this.ui.updateStatus(mxUtils.bind(this, function()
				{
					this.addAllSavedStatus();
				}));
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
			// A synchronization without local changes, eg. an external
			// change the desktop watcher merged: nothing was saved, so
			// the saved status would claim a save that did not happen,
			// and a cleared status stayed empty until the next save (a
			// realtime file repaints it from the sync's status thread, a
			// local file has none). Says when the file changed, like the
			// realtime status does after a remote save.
			this.addLastChangeStatus();
		}
	}
};

/**
 * Adds the listener for automatically saving the diagram for local changes.
 */
DrawioFile.prototype.handleFileError = function(err, manual, skipRevokeCheck)
{
	// Ignores busy errors for background saves as the file is
	// saved again when the current save operation completes
	if (!manual && err != null && err.code == App.ERROR_BUSY)
	{
		return;
	}

	this.ui.spinner.stop();

	// The save window is over either way: a descriptor or file-changed
	// notification deferred during it must not be dropped just because
	// the save failed (see flushRemoteDescriptor, flushRemoteFileChanged)
	if (this.sync != null)
	{
		this.sync.flushRemoteDescriptor();
		this.sync.flushRemoteFileChanged();
	}

	if (this.ui.getCurrentFile() == this)
	{
		if (this.inConflictState)
		{
			this.handleConflictError(err, manual);
		}
		else if (!skipRevokeCheck && this.isRealtime() &&
			!this.writeRevoked && this.isWriteRevokedError(err))
		{
			// The status alone is not the revoke signal: the provider
			// descriptor decides. Only a confirmed effective read-only
			// rolls the transient edits back (they can never be
			// confirmed by a save then); an unconfirmed error stays
			// transient - the file remains modified and a later save
			// retries.
			this.verifyWriteRevoked(mxUtils.bind(this, function(revoked)
			{
				// The descriptor round trip is asynchronous: the user
				// may have closed this file or opened another one
				// meanwhile, and the revoked branch would then roll
				// back and clear the undo history of a file that is no
				// longer on screen (the transient branch re-enters
				// handleFileError, which checks this itself)
				if (this.ui.getCurrentFile() != this)
				{
					return;
				}

				if (revoked && !this.writeRevoked)
				{
					this.handleWriteRevoked(err);
				}
				else if (!this.writeRevoked)
				{
					this.handleFileError(err, manual, true);
				}
			}));
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
				this.ui.updateStatus(mxUtils.bind(this, function()
				{
					var msg = this.getErrorMessage(err);
					
					if (msg != null && msg.length > 60)
					{
						msg = msg.substring(0, 60) + '...';
					}
					
					this.ui.editor.setStatus('<div class="geStatusAlert">' +
						mxUtils.htmlEntities(mxResources.get('error')) + ((msg != null) ?
						' (' + mxUtils.htmlEntities(msg) + ')' : '') + '</div>');
				}));
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
			this.ui.clearStatus();
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
	else if (this.invalidChecksum && manual)
	{
		this.showRefreshDialog(success, error, this.getErrorMessage(err));
	}
	else if (manual)
	{
		this.showConflictDialog(overwrite, synchronize);
	}
	else
	{
		this.addConflictStatus(this.getErrorMessage(err), mxUtils.bind(this, function()
		{
			this.ui.editor.setStatus(mxUtils.htmlEntities(
				mxResources.get('updatingDocument')));
			this.synchronizeFile(success, error);
		}));
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
	// XHR blocked by CORS or response has no CORS headers
	else if (msg == '0')
	{
		msg = mxResources.get('noResponse');
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
 * Invoked when the compression has changed.
 */
DrawioFile.prototype.compressionChanged = function(compressed)
{
	// Changes the internal compressed data in the pages to the current state
	var pages = (this.ownPages != null) ? this.ownPages : this.ui.pages;

	if (pages != null)
	{
		for (var i = 0; i < pages.length; i++)
		{
			var pageNode = pages[i].node;

			if (pageNode != null && (this.ui.currentPage == null ||
				this.ui.currentPage.getId() != pages[i].getId()))
			{
				var models = pageNode.getElementsByTagName('mxGraphModel');
				var modelNode = (models.length > 0) ? models[0] : null;
				var xml = Graph.decompress(mxUtils.getNodeValue(pageNode));

				if (compressed)
				{
					if (xml.length == 0 && modelNode != null)
					{
						EditorUi.removeChildNodes(pageNode);
						mxUtils.setTextContent(pageNode, Graph.compressNode(modelNode));

						EditorUi.debug('DrawioFile.compressionChanged',
							[this], 'Page ' + i + ' compressed');
					}
				}
				else
				{
					if (xml.length > 0 && modelNode == null)
					{
						EditorUi.removeChildNodes(pageNode);
						pageNode.appendChild(mxUtils.parseXml(xml).documentElement);

						EditorUi.debug('DrawioFile.compressionChanged',
							[this], 'Page ' + i + ' decompressed');
					}
				}
			}
		}
	}
};

/**
 * Adds the listener for automatically saving the diagram for local changes.
 */
DrawioFile.prototype.fileReplaced = function(patches)
{
	this.invalidChecksum = false;
	this.inConflictState = false;

	if (patches != null)
	{
		this.patch(patches);
	}
	
	this.pendingFileVars = null;
	this.savingFileVars = null;
	this.observedFileVars = (this.ui.fileNode != null) ?
		this.ui.fileNode.getAttribute('vars') : null;

	if (this.sync != null)
	{
		this.sync.initRealtime();
	}

	EditorUi.debug('DrawioFile.fileReplaced', [this], 'patches', patches);
};

/**
 * Records local vars before a save or realtime transition can move the
 * snapshot. File attributes have no ownPages copy, and edits can happen
 * before a sync object exists or while realtime is disabled.
 */
DrawioFile.prototype.trackLocalFileVars = function()
{
	var before = (this.observedFileVars !== undefined) ?
		this.observedFileVars : this.getShadowVars();
	var value = (this.ui.fileNode != null) ?
		this.ui.fileNode.getAttribute('vars') : null;

	if (value != before)
	{
		if (this.pendingFileVars == null)
		{
			this.pendingFileVars = {before: before};
		}

		this.pendingFileVars.value = value;
	}

	this.observedFileVars = value;
};

/**
 * A foreign vars write supersedes the whole pending own attribute,
 * even if its serialization is identical. Page-only patches do not.
 */
DrawioFile.prototype.acceptRemoteFileVars = function(patches)
{
	for (var i = 0; patches != null && i < patches.length; i++)
	{
		if (patches[i] != null && patches[i][EditorUi.DIFF_FILE] != null &&
			patches[i][EditorUi.DIFF_FILE].vars !== undefined)
		{
			this.pendingFileVars = null;
			this.observedFileVars = patches[i][EditorUi.DIFF_FILE].vars;
		}
	}
};

/**
 * Confirms only vars from the ownership interval included in a
 * successful write. Used by both cached and optimistic file saves.
 */
DrawioFile.prototype.confirmFileVars = function(savedVars)
{
	if (this.pendingFileVars != null &&
		this.pendingFileVars === this.savingFileVars)
	{
		this.pendingFileVars.before = savedVars;

		if (this.pendingFileVars.value == savedVars)
		{
			this.pendingFileVars = null;
		}
	}

	this.savingFileVars = null;
};

/**
 * Adds the listener for automatically saving the diagram for local changes.
 */
DrawioFile.prototype.fileChanged = function(sync, edit, reactive)
{
	sync = (sync != null) ? sync : true;

	if (sync && !reactive)
	{
		this.trackLocalFileVars();
	}

	this.lastChanged = new Date();
	this.setModified(true);

	EditorUi.debug('DrawioFile.fileChanged', [this],
		'autosaveDelay', this.autosaveDelay,
		'autosave', this.isAutosave(),
		'saving', this.savingFile);

	if (this.isAutosave())
	{
		if (this.savingStatusKey != null)
		{
			this.ui.updateStatus(mxUtils.bind(this, function()
			{
				this.addAllSavedStatus(mxUtils.htmlEntities(
					mxResources.get(this.savingStatusKey)) + '...');
			}));
		}
		
		this.ui.scheduleSanityCheck();
		
		if (this.ageStart == null)
		{
			this.ageStart = new Date();
		}
		
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

	if (this.sync != null && sync)
	{
		this.sync.localFileChanged(edit, reactive);
	}
};

/**
 * Creates a secret and token pair for writing a patch to the cache.
 */
DrawioFile.prototype.createSecret = function(success)
{
	var secret = Editor.guid(32);
	
	if (Editor.enableRealtimeCache && this.sync != null &&
		!this.isOptimisticSync())
	{
		this.sync.createToken(secret,
			mxUtils.bind(this, function(token)
			{
				EditorUi.debug('DrawioFile.createSecret', [this],
					'secret', secret, 'token', token);

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
	if (this.sync != null)
	{
		this.sync.fileSaving();
	}
};

/**
 * Invokes sync and updates shadow document.
 */
DrawioFile.prototype.fileSaved = function(savedData, lastDesc, success, error, token, pages, checksum)
{
	this.lastSaved = new Date();
	this.ageStart = null;
	this.stats.saved++;

	try
	{
		this.inConflictState = false;
		this.invalidChecksum = false;

		// The conflict retry budget counts the CONSECUTIVE catchup
		// attempts of ONE conflict episode, so a confirmed save ends
		// the episode and returns the full budget. The reset used to
		// live in DrawioFileSync.fileSaved, which the optimistic
		// branch below never reaches: for every file with
		// isOptimisticSync (OneDriveFile and the EmbedFile
		// integrations) the counter was never reset and became a
		// LIFETIME conflict counter, so the maxCatchupRetries-th
		// conflict of the session was refused in fileConflict without
		// attempting a catchup at all - the host saw ERROR_TIMEOUT,
		// abandoned the save and left the file in conflict state
		// (embed conflict-timeout reports land on exact multiples of
		// maxCatchupRetries - 1, `conflict-budget-optimistic`).
		if (this.sync != null)
		{
			this.sync.catchupRetryCount = 0;
		}

		var savedRoot = mxUtils.parseXml(savedData).documentElement;
		savedRoot = this.ui.editor.extractGraphModel(savedRoot, true, true) || savedRoot;
		var savedVars = (savedRoot != null && savedRoot.nodeName == 'mxfile') ?
			savedRoot.getAttribute('vars') : null;
		pages = (pages != null) ? pages :
			this.ui.getPagesForNode(savedRoot, null, true);

		try
		{
			if (this.sync == null || this.isOptimisticSync())
			{
				this.setShadowPages(pages, savedVars);
				this.confirmFileVars(savedVars);
				
				if (this.sync != null)
				{
					this.sync.lastModified = this.getLastModifiedDate();
					this.sync.resetUpdateStatusThread();

					if (this.isRealtime())
					{
						this.sync.scheduleCleanup();
					}
				}
				
				if (success != null)
				{
					success();
				}
			}
			else
			{
				this.sync.fileSaved(pages, lastDesc,
					success, error, token, checksum, savedVars);
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
				var user = this.getCurrentUser();
				// Hashed like sendErrorReport: no raw user or file ids in logs
				var uid = (user != null) ? this.ui.hashValue(user.id) : 'unknown';
				
				EditorUi.logError('Error in fileSaved', null,
					this.getMode() + '.' + this.ui.hashValue(this.getId()),
					uid, e);
			}
			catch (e2)
			{
				// ignore
			}
		}
		
		EditorUi.debug('DrawioFile.fileSaved', [this],
			'savedData', [savedData], 'desc', [lastDesc],
			'inConflictState', this.inConflictState,
			'invalidChecksum', this.invalidChecksum);
	}
	catch (e)
	{
		this.descriptorChanged();
		
		if (error != null)
		{
			error(e);
		}
	}
};

/**
 * Adds the listener for automatically saving the diagram for local changes.
 */
DrawioFile.prototype.autosave = function(delay, maxDelay, success, error)
{
	if (this.appUpgradeRequired) return;

	if (this.lastAutosave == null)
	{
		this.lastAutosave = Date.now();
	}
	
	var tmp = (Date.now() - this.lastAutosave < maxDelay) ? delay : 0;
	this.clearAutosave();
	
	// Starts new timer or executes immediately if not unsaved for maxDelay
	var thread = window.setTimeout(mxUtils.bind(this, function()
	{
		try
		{
			this.lastAutosave = null;
			
			if (this.autosaveThread == thread)
			{
				this.autosaveThread = null;
			}

			EditorUi.debug('DrawioFile.autosave', [this], 'thread', thread,
				'modified', this.isModified(), 'now', this.isAutosaveNow(),
				'saving', this.savingFile);
			
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
					this.ui.clearStatus();
				}
				
				if (success != null)
				{
					success(null);
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
	}), tmp);

	this.autosaveThread = thread;

	EditorUi.debug('DrawioFile.autosave', [this], 'thread', thread,
		'delay', delay, 'maxDelay', maxDelay, 'actualDelay', tmp,
		'lastAutosave', this.lastAutosave, 'saving', this.savingFile);
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
	try
	{
		if (this.isAutosave() && this.isModified())
		{
			this.updateFileData();	
			this.save(this.isAutosaveRevision(), null, null, unloading);
		}
	}
	catch (e)
	{
		// ignore
	}
	
	this.stats.closed++;

	// Release telemetry: session summary of sampled and flagged sessions
	if (this.sync != null && EditorUi.realtimeTelemetry &&
		(EditorUi.realtimeTelemetrySampled || this.realtimeTelemetryFlagged))
	{
		var s = this.stats;

		EditorUi.logRealtime('session', {rt: (this.isRealtime()) ? 1 : 0,
			min: Math.round((Date.now() - this.created) / 60000), saved: s.saved,
			merged: s.merged, fm: s.fileMerged, fr: s.fileReloaded,
			conf: s.conflicts, to: s.timeouts, cs: s.checksumErrors,
			join: s.joined, ms: s.msgSent, mr: s.msgReceived, ch: s.cacheHits,
			cm: s.cacheMiss, cf: s.cacheFail}, this, null, unloading);
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
 * Are comments anchored to shapes supported
 */
DrawioFile.prototype.anchoredCommentsSupported = function()
{
	return false;
};

/**
 * Are @mentions in comments supported
 */
DrawioFile.prototype.mentionsSupported = function()
{
	return false;
};

/**
 * Are free-typed addresses offered as mention targets. Only relevant
 * for backends whose mention tokens are email-based.
 */
DrawioFile.prototype.freeMentionsSupported = function()
{
	return this.mentionsSupported();
};

/**
 * Are mention candidates searched server-side as the user types (see
 * EditorUi.mentionsLiveSearch)
 */
DrawioFile.prototype.mentionsLiveSearch = function()
{
	return false;
};

/**
 * Does the backend notify mentioned people (see
 * EditorUi.mentionNotificationsSupported)
 */
DrawioFile.prototype.mentionNotificationsSupported = function()
{
	return true;
};

/**
 * Get the people that can be mentioned in comments of the file. query
 * is the text typed after the @ and is only passed with
 * mentionsLiveSearch (backends with a prefetched list ignore it).
 */
DrawioFile.prototype.getMentionCandidates = function(success, error, query)
{
	success([]); //placeholder
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
