/**
 * Copyright (c) 2006-2016, JGraph Ltd
 * Copyright (c) 2006-2016, Gaudenz Alder
 */
/**
 * Creates an object that synchronizes the graph model and given realtime model.
 * The session ID is used as a prefix in the model to produce unique IDs for new
 * cells.
 */
function DriveRealtime(file, doc)
{
	this.realtimeAutosaveDelay = this.defaultRealtimeAutosaveDelay;
	this.realtimeMaxAutosaveDelay = this.defaultRealtimeMaxAutosaveDelay;
	
	this.file = file;
	this.doc = doc;
	this.rtModel = this.doc.getModel();
	this.root = this.rtModel.getRoot();
	
	this.ui = file.getUi()
	this.graph = this.ui.editor.graph;
	this.model = this.graph.model;
	this.userId = this.ui.drive.user.id;
	this.connected = true;

	this.ui.allowAnimation = false;
	this.codec = new mxCodec();
	
	this.disconnectListener = mxUtils.bind(this, function()
	{
		// LATER: How to reload realtime document without refreshing the page
		this.sessionExpiredError();
	});
	
	this.ui.drive.addListener('disconnected', this.disconnectListener);
	
	// Change of autosave triggers an immediate save to update thumbnail
	this.autosaveChangeListener = mxUtils.bind(this, function()
	{
		var prevValue = this.ui.drive.enableThumbnails;
		this.ui.drive.enableThumbnails = this.ui.editor.autosave;

		if (this.connected && this.ui.editor.autosave)
		{
			this.ui.editor.setStatus(mxUtils.htmlEntities(mxResources.get('saving')) + '...');
		}
		
		this.file.save(true, mxUtils.bind(this, function()
		{
			if (this.connected && this.ui.editor.autosave)
			{
				this.ui.editor.setStatus(mxUtils.htmlEntities(mxResources.get('allChangesSaved')));
			}
			else
			{
				this.file.setModified(true);
			}
		}));
		
		this.ui.drive.enableThumbnails = prevValue;
	});
	
	this.ui.editor.addListener('autosaveChanged', this.autosaveChangeListener);
};

/**
 * Specifies the key of the root element in the model. Default is root.
 */
DriveRealtime.prototype.logLevel = 2;

/**
 * True if a change event is fired for a remote change.
 */
DriveRealtime.prototype.updateStatusInterval = 20000;

/**
 * Specifies the key of the root element in the model. Default is root.
 */
DriveRealtime.prototype.diagramsKey = 'diagrams';

/**
 * Specifies the key of the root element in the model. Default is root.
 */
DriveRealtime.prototype.diagrams = null;

/**
 * Specifies the key of the root element in the model. Default is root.
 */
DriveRealtime.prototype.rootKey = 'root';

/**
 * Specifies the key of the root element in the model. Default is root.
 */
DriveRealtime.prototype.diagramMap = null;

/**
 * Specifies the key of the root element in the model. Default is root.
 */
DriveRealtime.prototype.chatHistory = null;

/**
 * True if a change event is fired for a remote change.
 */
DriveRealtime.prototype.saving = false;

/**
 * Sets the delay for autosave in milliseconds. Default is 5000.
 */
DriveRealtime.prototype.defaultRealtimeAutosaveDelay = 5000;

/**
 * Sets the delay for autosave in milliseconds. Default is 60000.
 */
DriveRealtime.prototype.defaultRealtimeMaxAutosaveDelay = 60000;

/**
 * Sets the delay for autosave in milliseconds. Default is 500.
 */
DriveRealtime.prototype.realtimeHeartbeat = 30000;

/**
 * True if a undoableEdit has been scheduled in <executeChange>.
 */
DriveRealtime.prototype.ignoreChange = false;

/**
 * True if a undoableEdit has been scheduled in <executeChange>.
 */
DriveRealtime.prototype.ignorePageFormatChanged = false;

/**
 * True if a undoableEdit has been scheduled in <executeChange>.
 */
DriveRealtime.prototype.ignoreScaleChanged = false;

/**
 * True if a undoableEdit has been scheduled in <executeChange>.
 */
DriveRealtime.prototype.ignoreBackgroundColorChanged = false;

/**
 * True if a undoableEdit has been scheduled in <executeChange>.
 */
DriveRealtime.prototype.ignoreShadowVisibleChanged = false;

/**
 * True if a undoableEdit has been scheduled in <executeChange>.
 */
DriveRealtime.prototype.ignoreBackgroundImageChanged = false;

/**
 * True if a undoableEdit has been scheduled in <executeChange>.
 */
DriveRealtime.prototype.ignoreMathEnabledChanged = false;

/**
 * Syncs initial state from collab model to graph model.
 */
DriveRealtime.prototype.getDiagramMap = function()
{
	return (this.ui.currentPage != null) ? this.ui.currentPage.mapping.diagramMap : this.diagramMap;
};

/**
 * Indirection for legacy support.
 */
DriveRealtime.prototype.getCurrentPage = function()
{
	return (this.page != null) ? this.page : this.ui.currentPage;
};

/**
 * Synchronizes the collaboration model and the graph model and installs
 * the required listeners to keep them in sync.
 */
DriveRealtime.prototype.start = function()
{
	if (urlParams['reset'] == '1')
	{
		this.root.clear();
		this.log('reset realtime');
	}

	var prefix = this.createPrefix();
	this.model.prefix = prefix + '-';
	this.ui.editor.resetGraph();
		
	// Creates diagrams list and default entry
	this.diagrams = this.root.get(this.diagramsKey);
	var diagramsCreated = false;
	
	if (this.diagrams == null)
	{
		this.diagrams = this.rtModel.createList();
		this.root.set(this.diagramsKey, this.diagrams);
		diagramsCreated = true;
		this.log('realtime model initialized');
	}
	
	// Specifies if the file should be saved immediately after setup
	var forceSave = false;
	
	if (this.file.getData() != '')
	{
		this.ui.fileNode = null;
		this.ui.pages = null;
		
		// Converts from XML to realtime
    	this.ui.setFileData(this.file.getData());
    	this.log('xml converted');
    	
    	// Logs conversion of old RT models (converted from XML backup)
    	if (this.root.has('cells') && diagramsCreated)
    	{
	    	try
	    	{
				var img = new Image();
				
				// Timestamp is added to bypass client-side cache
				img.src = 'https://log.draw.io/log?severity=CONFIG&msg=converted-oldrt&v=' +
					encodeURIComponent(EditorUi.VERSION) + '&ts=' + new Date().getTime();
	    	}
	    	catch (e)
	    	{
	    		// ignore
	    	}
    	}
    	
		if (this.ui.pages != null)
		{
			for (var i = 0; i < this.ui.pages.length; i++)
			{
				var page = this.ui.pages[i];
				
				var diagramMap = this.rtModel.createMap();
				this.diagrams.push(diagramMap);
				
				this.ui.updatePageRoot(page);
				page.mapping = new RealtimeMapping(this, diagramMap, page);
				
				if (this.file.isEditable())
				{
					diagramMap.set('id', page.getId());
					
					// Read or create name for page
					if (page.getName() != '')
					{
						diagramMap.set('name', page.getName());
					}
					else if (!diagramMap.has('name'))
					{
						diagramMap.set('name', mxResources.get('pageWithNumber', [i + 1]));
					}
				}

				// Sync name and initialize
				page.setName(diagramMap.get('name') || mxResources.get('pageWithNumber', [i + 1]));
				page.mapping.init();
			}
		}
		else if (urlParams['pages'] == '0')
		{
			this.diagramMap = this.rtModel.createMap();
			this.diagrams.push(this.diagramMap);
			// Dummy node, should be XML node if used
			this.page = new DiagramPage(document.createElement('diagram'));
			this.page.mapping = new RealtimeMapping(this, this.diagramMap, this.page);
			this.diagramMap.set('name', mxResources.get('pageWithNumber', [1]));
			this.diagramMap.set('id', this.page.getId());
			this.page.setName(this.diagramMap.get('name'));
			this.page.mapping.init();
		}
		else
		{
			this.ui.fileNode = mxUtils.createXmlDocument().createElement('mxfile');
			this.ui.pages = [];
			
			var diagramMap = this.rtModel.createMap();
			this.diagrams.push(diagramMap);
			
			var page = new DiagramPage(this.ui.fileNode.ownerDocument.createElement('diagram'));
			page.mapping = new RealtimeMapping(this, diagramMap, page);
			this.ui.currentPage = page;

			if (this.file.isEditable() && !page.mapping.diagramMap.has('name'))
			{
				page.mapping.diagramMap.set('name', mxResources.get('pageWithNumber', [1]));
				page.mapping.diagramMap.set('id', page.getId());
			}
			
			page.setName(page.mapping.diagramMap.get('name') || mxResources.get('pageWithNumber', [1]));
			this.ui.pages.push(page);
			page.mapping.init();
		}
		
		forceSave = true;
	}
	else if (this.diagrams.length < 2 && urlParams['pages'] == '0')
	{
		this.ui.fileNode = null;
		this.ui.pages = null;
		
		if (this.diagrams.length == 0)
		{
			this.diagramMap = this.rtModel.createMap();
			this.diagrams.push(this.diagramMap);
		}
		else
		{
			this.diagramMap = this.diagrams.get(0);
		}
		
		var node = document.createElement('diagram');
		
		if (this.diagramMap.has('id'))
		{
			node.setAttribute('id', this.diagramMap.get('id'));
		}
		
		this.page = new DiagramPage(node);
		this.page.mapping = new RealtimeMapping(this, this.diagramMap, this.page);
		
		if (!this.diagramMap.has('name'))
		{
			this.diagramMap.set('name', mxResources.get('pageWithNumber', [1]));
		}
		
		this.page.setName(this.page.mapping.diagramMap.get('name'));
		this.diagramMap.set('id', this.page.getId());
		
		// Avoids scroll offset when switching page
		this.page.mapping.init();
		this.ui.editor.fireEvent(new mxEventObject('resetGraphView'));
	}
	else
	{
		this.ui.fileNode = mxUtils.createXmlDocument().createElement('mxfile');
		this.ui.pages = [];
		
		if (this.diagrams.length == 0)
		{
			this.diagrams.push(this.rtModel.createMap());
		}
		
		var pageIndex = Math.max(0, Math.min(this.diagrams.length - 1, urlParams['page'] || 0));
		
		for (var i = 0; i < this.diagrams.length; i++)
		{
			var node = this.ui.fileNode.ownerDocument.createElement('diagram');
			var diagramMap = this.diagrams.get(i);
			
			if (diagramMap.has('id'))
			{
				node.setAttribute('id', diagramMap.get('id'));
			}
			
			var page = new DiagramPage(node);
			page.mapping = new RealtimeMapping(this, diagramMap, page);
			
			if (this.file.isEditable() && !diagramMap.has('name'))
			{
				diagramMap.set('name', mxResources.get('pageWithNumber', [i + 1]));
			}
			
			page.setName(diagramMap.get('name') || mxResources.get('pageWithNumber', [i + 1]));
			
			if (this.file.isEditable() && !diagramMap.has('id'))
			{
				diagramMap.set('id', page.getId());
			}
			
			this.ui.pages.push(page);
		}

		// Sets the current page
		this.ui.currentPage = this.ui.pages[Math.max(0, Math.min(this.ui.pages.length - 1, urlParams['page'] || 0))];;
		
		// Initializes graphs and mappings
		for (var i = 0; i < this.ui.pages.length; i++)
		{
			this.ui.pages[i].mapping.init();
		}
	}

	this.installReadOnlyListener();
	this.installUiChangeListeners();
	this.installGraphModelListener();
	this.installPageSelectListener();

	this.chatHistory = this.root.get('chatHistory');
	
	if (this.chatHistory == null)
	{
		this.initializeChat();
	}
	
	this.installSelectionModelListener();
	this.installCollaboratorListener();
	this.updateCollaborators();
	
	this.doc.addEventListener(gapi.drive.realtime.EventType.DOCUMENT_SAVE_STATE_CHANGED, mxUtils.bind(this, function(evt)
	{
		this.documentSaveStateChanged(evt, forceSave);
	}));
	
	var initialized = mxUtils.bind(this, function()
	{
		this.resetUpdateStatusThread();
		this.ui.resetScrollbars();
		this.updateStatus();
		forceSave = false;
	});

	// Updates backup and preview
	if (forceSave)
	{
		this.ui.editor.setStatus(mxUtils.htmlEntities(mxResources.get('saving')) + '...');
		this.file.save(false, initialized, initialized);
	}
	else
	{
		initialized();
	}

	// Implements separate undo history for each client
	if (this.previousUndoListener == null)
	{
		this.previousUndoListener = this.ui.editor.undoListener;
		this.ui.editor.undoListener = mxUtils.bind(this, function(sender, evt)
		{
			if (!this.ignoreChange)
			{
				this.previousUndoListener.apply(this, arguments);
			}
		});
	}
};

/**
 * Syncs initial state from graph model to collab model.
 */
DriveRealtime.prototype.documentSaveStateChanged = function(evt, forceSave)
{
	if (this.saving && !evt.isPending && !evt.isSaving && !forceSave)
	{
		// Checks if the mime type of the file has changed on the server-side
		// when the autosave is triggered to make sure we eventually check
		// the mime type even if the user continues to change the diagram
		// within the autosave interval, which will cancel the current thread.
		if (this.ui.isLegacyDriveDomain() && urlParams['ignoremime'] != '1')
		{
			this.ui.drive.verifyMimeType(this.file.getId());
		}

		// Adds tooltip to small spinner and saves a backup XML copy of the file
		if (this.file.isAutosave())
		{
			this.triggerAutosave();
		}
		else
		{
			this.ui.editor.setStatus(mxUtils.htmlEntities(mxResources.get('allChangesSaved')));
		}
		
		this.saving = false;
		this.connected = true;
		this.resetUpdateStatusThread();
		this.realtimeHeartbeat = DriveRealtime.prototype.realtimeHeartbeat;
		
		if (this.isAliveThread != null)
		{
			window.clearTimeout(this.isAliveThread);
			this.isAliveThread = null;
		}
	}
	
	if (this.file.isEditable())
	{
		var avail = 10485760 - this.rtModel.bytesUsed;
		
		if (avail > 0 && avail < 500000 && !this.sizeLimitWarningShown)
		{
			// Shows warning just once
			this.sizeLimitWarningShown = true;
			
			this.ui.showError(mxResources.get('warning'), mxResources.get('fileNearlyFullSeeFaq'),
				mxResources.get('close'), mxUtils.bind(this, function()
				{
					// Hides the dialog
				}), null, mxResources.get('show'), mxUtils.bind(this, function()
				{
					// Show FAQ entry
					window.open('https://desk.draw.io/support/solutions/articles/16000041695');
				})
			);
		}
	}
};

/**
 * Syncs initial state from graph model to collab model.
 */
DriveRealtime.prototype.triggerAutosave = function()
{
	this.ui.editor.setStatus(mxUtils.htmlEntities(mxResources.get('updatingPreview')));
	
	this.file.autosave(this.realtimeAutosaveDelay, this.realtimeMaxAutosaveDelay, mxUtils.bind(this, function(resp)
	{					
		// Updates autosave delay to take into account actual delay
		this.realtimeAutosaveDelay = this.defaultRealtimeAutosaveDelay + Math.min(10000, this.file.saveDelay);
		
		// Does not update status if another autosave was scheduled
		if (this.ui.getCurrentFile() == this.file && !this.saving)
		{
			this.ui.editor.setStatus(mxUtils.htmlEntities(mxResources.get('allChangesSaved')));
		}
	}),
	mxUtils.bind(this, function(resp)
	{
		this.ui.editor.setStatus(mxUtils.htmlEntities(mxResources.get('errorUpdatingPreview')));
		
		// Handles error where mime type cannot be overridden because it has been changed by another app and no
		// new revision was created. This happens eg. if draw.io pro overwrites the mime type and adds a new realtime
		// model to the file which is not visible for this app so we need to switch app to stay connected to RT.
		// This could be improved to let the RT viewers know that the realtime is no longer valid, but currently
		// the focus is on not losing data, so only clients that write to the file are being notified with this.
		if (this.ui.isLegacyDriveDomain() && urlParams['ignoremime'] != '1' && resp != null &&
			resp.error != null && (resp.error.code == 400 || resp.error.code == 403))
		{	
			this.ui.drive.verifyMimeType(this.file.getId(), null, true);
		}
	}));
};

/**
 * Syncs initial state from graph model to collab model.
 */
DriveRealtime.prototype.installReadOnlyListener = function()
{
	// Handles change of read-only state
	this.doc.addEventListener(gapi.drive.realtime.EventType.ATTRIBUTE_CHANGED, mxUtils.bind(this, function(evt)
	{
		if (evt.attribute == 'is_read_only')
		{
			this.file.descriptorChanged();
			
			if (!this.file.isEditable())
			{
				this.ui.editor.graph.reset();
				this.ui.editor.setStatus(mxUtils.htmlEntities(mxResources.get('readOnly')));
			}
			else
			{
				this.ui.editor.setStatus('');
			}
		}
	}));
};

/**
 * Syncs initial state from graph model to collab model.
 */
DriveRealtime.prototype.installUiChangeListeners = function()
{
	this.pageFormatListener = mxUtils.bind(this, function(sender, evt)
	{
		if (!this.ignorePageFormatChanged)
		{
			try
			{
				this.setFileModified();
				this.getDiagramMap().set('pageFormat', this.graph.pageFormat.width + ',' + this.graph.pageFormat.height);
			}
			catch (e)
			{
				this.ui.handleError(e);
			}
		}
	});
	
	this.ui.addListener('pageFormatChanged', this.pageFormatListener);
	
	this.pageScaleListener = mxUtils.bind(this, function(sender, evt)
	{
		if (!this.ignorePageScaleChanged)
		{
			try
			{
				this.setFileModified();
				this.getDiagramMap().set('pageScale', this.graph.pageScale);
			}
			catch (e)
			{
				this.ui.handleError(e);
			}
		}
	});
	
	this.ui.addListener('pageScaleChanged', this.pageScaleListener);
	
	this.backgroundColorListener = mxUtils.bind(this, function(sender, evt)
	{
		if (!this.ignoreBackgroundColorChanged)
		{
			try
			{
				this.setFileModified();
				this.getDiagramMap().set('backgroundColor', (this.graph.background != null) ? this.graph.background : '');
			}
			catch (e)
			{
				this.ui.handleError(e);
			}
		}
	});
	
	this.ui.addListener('backgroundColorChanged', this.backgroundColorListener);
	
	this.shadowVisibleListener = mxUtils.bind(this, function(sender, evt)
	{
		if (!this.ignoreShadowVisibleChanged)
		{
			// Special case: This listener is called after switching page
			// so we check if the value has actually changed
			if (this.getDiagramMap().get('shadowVisible') != ((this.graph.shadowVisible) ? '1' : '0'))
			{
				try
				{
					this.setFileModified();
					this.getDiagramMap().set('shadowVisible', (this.graph.shadowVisible) ? '1' : '0');
				}
				catch (e)
				{
					this.ui.handleError(e);
				}
			}
		}
	});
	
	this.graph.addListener('shadowVisibleChanged', this.shadowVisibleListener);
	
	this.foldingEnabledListener = mxUtils.bind(this, function(sender, evt)
	{
		if (!this.ignoreFoldingEnabledChanged)
		{
			try
			{
				this.setFileModified();
				this.getDiagramMap().set('foldingEnabled', (this.graph.foldingEnabled) ? '1' : '0');
			}
			catch (e)
			{
				this.ui.handleError(e);
			}
		}
	});
	
	this.ui.addListener('foldingEnabledChanged', this.foldingEnabledListener);
		
	this.graph.addListener('shadowVisibleChanged', this.shadowVisibleListener);
	
	this.pageVisibleListener = mxUtils.bind(this, function(sender, evt)
	{
		if (!this.ignorePageVisibleChanged)
		{
			try
			{
				this.setFileModified();
				this.getDiagramMap().set('pageVisible', (this.graph.pageVisible) ? '1' : '0');
			}
			catch (e)
			{
				this.ui.handleError(e);
			}
		}
	});
	
	this.ui.addListener('pageViewChanged', this.pageVisibleListener);
	
	this.backgroundImageListener = mxUtils.bind(this, function(sender, evt)
	{
		if (!this.ignoreBackgroundImageChanged)
		{
			try
			{
				this.setFileModified();
				this.getDiagramMap().set('backgroundImage', (this.graph.backgroundImage != null) ? JSON.stringify(this.graph.backgroundImage) : '');
			}
			catch (e)
			{
				this.ui.handleError(e);
			}
		}
	});
	
	this.ui.addListener('backgroundImageChanged', this.backgroundImageListener);
	
	this.mathEnabledListener = mxUtils.bind(this, function(sender, evt)
	{
		if (!this.ignoreMathEnabledChanged)
		{
			try
			{
				this.setFileModified();
				this.getDiagramMap().set('mathEnabled', (this.graph.mathEnabled) ? '1' : '0');
			}
			catch (e)
			{
				this.ui.handleError(e);
			}
		}
	});
	
	this.ui.addListener('mathEnabledChanged', this.mathEnabledListener);
};

/**
 * Returns true if the given event is local.
 */
DriveRealtime.prototype.isLocalEvent = function(evt)
{
	return evt.isLocal;
};

/**
 * Syncs initial state from graph model to collab model.
 */
DriveRealtime.prototype.resetUpdateStatusThread = function()
{
	if (this.updateStatusThread != null)
	{
		window.clearInterval(this.updateStatusThread);
	}
	
	this.updateStatusThread = window.setInterval(mxUtils.bind(this, function()
	{
		this.ui.drive.checkToken(mxUtils.bind(this, function()
		{
			this.updateStatus();
		}));
	}), this.updateStatusInterval);
};

/**
 * Translates this point by the given vector.
 * 
 * @param {number} dx X-coordinate of the translation.
 * @param {number} dy Y-coordinate of the translation.
 */
DriveRealtime.prototype.timeSince = function(date)
{
    var seconds = Math.floor((new Date() - date) / 1000);
	
    var interval = Math.floor(seconds / 31536000);

    if (interval > 1)
    {
        return interval + ' ' + mxResources.get('years');
    }
    
    interval = Math.floor(seconds / 2592000);
    
    if (interval > 1)
    {
        return interval + ' ' + mxResources.get('months');
    }
    
    interval = Math.floor(seconds / 86400);
    
    if (interval > 1)
    {
        return interval + ' ' + mxResources.get('days');
    }
    
    interval = Math.floor(seconds / 3600);
    
    if (interval > 1)
    {
        return interval + ' ' + mxResources.get('hours');
    }
    
    interval = Math.floor(seconds / 60);
    
    if (interval > 1)
    {
        return interval + ' ' + mxResources.get('minutes');
    }
    
    if (interval == 1)
    {
        return interval + ' ' + mxResources.get('minute');
    }
    
    return null;
};

/**
 * Adds the listener for added and removed cells in the collab model and maps
 * them to the graph model.
 */
DriveRealtime.prototype.updateStatus = function()
{
	if (!this.saving && this.connected)
	{
		// LATER: Check if realtime model contains last modified timestamp
		var mod = this.root.get('modifiedDate');
		
		if (mod != '')
		{
			// LATER: Write out modified date for more than 2 weeks ago
			var str = this.ui.timeSince(new Date(mod));
			
			if (str == null)
			{
				str = mxResources.get('lessThanAMinute');
			}
			
			this.ui.editor.setStatus(mxUtils.htmlEntities(mxResources.get('lastChange', [str])) +
				(this.file.isEditable() ? '' : '<span class="geStatusAlert" style="margin-left:8px;">' +
				mxUtils.htmlEntities(mxResources.get('readOnly')) + '</span>'));
		}
	}
};

/**
 * Currently the link back from map to page requires a loop.
 */
DriveRealtime.prototype.getPageIndexForMap = function(map)
{
	for (var i = 0; i < this.ui.pages.length; i++)
	{
		if (this.ui.pages[i].mapping.diagramMap == map)
		{
			return i;
		}
	}
	
	return null;
};

/**
 * Adds the listener for changes on the graph model and maps them to the collab
 * model as a single transaction.
 */
DriveRealtime.prototype.installPageSelectListener = function()
{
	// Adds a graph model listener to update the view
	this.pageChangeListener = mxUtils.bind(this, function(sender, evt)
	{
		var page = evt.getProperty('change').relatedPage;
		
		if (page.mapping == null)
		{
			page.mapping = new RealtimeMapping(this, this.rtModel.createMap(), page);
			page.mapping.init();
			
			if (this.file.isEditable())
			{
				page.mapping.diagramMap.set('name', page.getName());
			}
		}
	});
	
	this.ui.editor.addListener('beforePageChange', this.pageChangeListener);

	// Adds a graph model listener to update the view
	this.viewStateListener = mxUtils.bind(this, function(sender, evt)
	{
		var page = this.getCurrentPage();

		// Applies view state from realtime model without firing events
		if (page.viewState == null)
		{
			// Activates from realtime without calling event listeners
			page.mapping.activate(true);
		}
	});
	
	this.ui.editor.addListener('setViewState', this.viewStateListener);

	this.diagrams.addEventListener(gapi.drive.realtime.EventType.VALUES_ADDED, mxUtils.bind(this, function(evt)
	{
		if (!this.isLocalEvent(evt))
		{
			if (evt.movedFromList == null)
			{
				this.ignoreChange = true;
				
				// Switches to pages datastructure
				if (this.ui.pages == null)
				{
					this.ui.fileNode = mxUtils.createXmlDocument().createElement('mxfile');
					this.ui.pages = [];
					
					if (this.page != null)
					{
						this.ui.currentPage = this.page;
						this.ui.pages.push(this.ui.currentPage);
						this.diagramMap = null;
						this.page = null;
					}
				}
				
				for (var i = 0; i < evt.values.length; i++)
				{
					var page = new DiagramPage(document.createElement('diagram'));
					page.mapping = new RealtimeMapping(this, evt.values[i], page);
					page.setName(page.mapping.diagramMap.get('name') || mxResources.get('pageWithNumber',
						[this.ui.pages.length + 1]));
					this.ui.pages.splice(evt.index + i, 0, page);
					page.mapping.init();
				}
				
				// Shows tab container if pages are added with pages disabled
				if (this.ui.pages != null && this.ui.pages.length > 1 &&
					this.ui.tabContainer != null &&
					this.ui.tabContainer.style.height == '0px')
				{
					this.ui.editor.graph.view.validateBackground();
				}
					
				this.ui.updateTabContainer();
				this.ignoreChange = false;
			}
			else if (evt.movedFromList == this.diagrams && evt.movedFromIndex != null)
			{
				this.ignoreChange = true;
			
				for (var i = 0; i < evt.values.length; i++)
				{
					var index = this.getPageIndexForMap(evt.values[i]);
					
					if (index != null)
					{
						this.ui.movePage(index + i, evt.index + i);
					}
				}
				
				this.ignoreChange = false;
				this.ui.updateTabContainer();
			}
		}
	}));
			
	this.diagrams.addEventListener(gapi.drive.realtime.EventType.VALUES_REMOVED, mxUtils.bind(this, function(evt)
	{
		if (!this.isLocalEvent(evt))
		{
			if (evt.movedToList == null)
			{
				this.ignoreChange = true;
				
				for (var i = 0; i < evt.values.length; i++)
				{
					var index = this.getPageIndexForMap(evt.values[i]);
					
					if (index != null)
					{
						var page = this.ui.pages[index];
						
						if (page != null)
						{
							this.ui.removePage(page);
							page.mapping.destroy();
						}
					}
				}
				
				this.ignoreChange = false;
			}
		}
	}));
};

/**
 * Returns a string representation of the given ops.
 */
DriveRealtime.prototype.processChange = function(change)
{
	//console.log('processChange: ' + this.dump(change));
	if (change instanceof RenamePage)
	{
		change.page.mapping.diagramMap.set('name', change.page.getName());
	}
	else if (change instanceof ChangePage)
	{
		if (change.previousIndex == null)
		{
			this.diagrams.removeValue(change.relatedPage.mapping.diagramMap);
		}
		else
		{
			this.diagrams.insert(change.previousIndex, change.relatedPage.mapping.diagramMap);
		}
	}
	else if (change instanceof MovePage)
	{
		this.diagrams.move(change.newIndex, change.oldIndex + ((change.newIndex < change.oldIndex) ? 1 : 0));
	}
	else if (change instanceof mxRootChange)
	{
		// Only process the root change that sets the current root
		// ie. ignore previous root changes
		if (change.root == this.model.root)
		{
			this.getCurrentPage().mapping.initRealtime();
		}
	}
	else if (change instanceof mxChildChange)
	{
		if (change.parent != change.previous || change.index != change.previousIndex)
		{
			var childRtCell = change.child.rtCell;
			
			if (childRtCell == null)
			{
				childRtCell = this.getCurrentPage().mapping.createRealtimeCell(change.child);
				this.getCurrentPage().mapping.saveRealtimeCell(childRtCell.cell);
			}

			var parentRtCell = (change.parent != null) ? change.parent.rtCell : null;
			
			if (change.previous != null)
			{
				var previousParentRtCell = change.previous.rtCell;
				
				if (previousParentRtCell != null)
				{
					previousParentRtCell.children.removeValue(childRtCell);
				}
			}

			if (parentRtCell != null)
			{
				parentRtCell.children.insert(Math.min(parentRtCell.children.length, change.index), childRtCell);
			}
			
			childRtCell.parent = parentRtCell;
		}
	}
	else if (change.cell != null && change.cell.id != null)
	{
		var rtCell = change.cell.rtCell;
		
		if (rtCell != null)
		{
			if (change instanceof mxTerminalChange)
			{
				var term = (change.terminal != null) ? change.terminal.rtCell : null;
				rtCell[(change.source) ? 'source' : 'target'] = term;
			}
			else if (change instanceof mxGeometryChange)
			{
				rtCell.geometry = (change.geometry != null) ? mxUtils.getXml(this.codec.encode(change.geometry)) : null;
			}
			else if (change instanceof mxStyleChange)
			{
				rtCell.style = change.style;
			}
			else if (change instanceof mxValueChange)
			{
				if (mxUtils.isNode(change.value))
				{
					rtCell.value = null;
					rtCell.xmlValue = mxUtils.getXml(change.value);
				}
				else
				{
					rtCell.xmlValue = null;
					rtCell.value = change.value;
				}
			}
			else if (change instanceof mxCollapseChange)
			{
				rtCell.collapsed = (change.collapsed) ? '1' : '0';
			}
			else if (change instanceof mxVisibleChange)
			{
				rtCell.visible = (change.visible) ? '1' : '0';
			}
		}
	}
};

/**
 * Adds the listener for changes on the graph model and maps them to the collab
 * model as a single transaction.
 */
DriveRealtime.prototype.setFileModified = function()
{
	this.root.set('modifiedDate', new Date().getTime());
	this.file.setModified(true);
	
	if (!this.saving)
	{
		if (this.connected)
		{
			this.ui.editor.setStatus(mxUtils.htmlEntities(mxResources.get('saving')) + '...');
		}
		
		this.saving = true;
	}
};

/**
 * Adds the listener for changes on the graph model and maps them to the collab
 * model as a single transaction.
 */
DriveRealtime.prototype.installGraphModelListener = function()
{
	// Adds a graph model listener to update the view
	this.graphModelChangeListener = mxUtils.bind(this, function(sender, evt)
	{
		var edit = evt.getProperty('edit');
		
		if (!this.ignoreChange && this.file.isEditable() && !edit.ignoreEdit)
		{
			//console.log('startEdit');

			// TODO: Queuing for async token refresh and too many updates
			this.ui.drive.checkToken(mxUtils.bind(this, function()
			{
				this.rtModel.beginCompoundOperation();
				this.setFileModified();
				
				try
				{
					var changes = edit.changes;
					
					if (edit.undone)
					{
						for (var i = changes.length - 1; i >= 0; i--)
						{
							this.processChange(changes[i]);
						}
					}
					else
					{
						for (var i = 0; i < changes.length; i++)
						{
							this.processChange(changes[i]);
						}
					}
					
					this.rtModel.endCompoundOperation();
				}
				catch (e)
				{
					this.rtModel.endCompoundOperation();
					this.ui.handleError(e);
				}
				
				if (this.isAliveThread == null)
				{
					this.isAliveThread = window.setTimeout(mxUtils.bind(this, function()
					{
						if (this.connected)
						{
							this.ui.editor.setStatus('<div class="geStatusAlert geBlink">' +
								mxUtils.htmlEntities(mxResources.get('noResponse')) +
								' <a href="https://desk.draw.io/support/solutions/articles/16000076743" target="_blank"><img border="0" ' +
								'title="' + mxUtils.htmlEntities(mxResources.get('help')) + '" valign="bottom" src="' +
								Editor.helpImage + '"/></a></div>');
						}	
						
						this.isAliveThread = window.setTimeout(mxUtils.bind(this, function()
						{
							this.isAliveThread = null;
							this.timeoutError();
						}), this.realtimeHeartbeat);
					}), this.realtimeHeartbeat);
				}
			}));
			
			//console.log('endEdit');
		}
	});
	
	this.model.addListener(mxEvent.CHANGE, this.graphModelChangeListener);
};

/**
 * 
 */
DriveRealtime.prototype.sessionExpiredError = function() 
{
	// LATER: How to reload realtime document without refreshing the page
	this.ui.showError(mxResources.get('error'), mxResources.get('sessionExpired'), mxResources.get('refresh'), mxUtils.bind(this, function()
	{
		this.ui.spinner.spin(document.body, mxResources.get('connecting'));
		this.file.setModified(false);
		window.location.reload();
	}));
};

/**
 * 
 */
DriveRealtime.prototype.timeoutError = function() 
{
	// LATER: How to reload realtime document without refreshing the page
	if (this.ui.editor.autosave)
	{
		this.ui.editor.setAutosave(false);
	}
	else if (this.connected && !this.timeoutErrorShowing)
	{
		// Checks if we're actually online by retrieving an image
		var img = new Image();
		
		img.onload = mxUtils.bind(this, function()
		{
			try
			{
				var email = this.ui.drive.getUser().email || 'Unknown email';
				var desc = this.file.desc;
	
				this.ui.logEvent({category: 'Disconnected', action: email, label: {id: desc.id, editable: desc.editable,
					copyable: desc.copyable, labels: desc.labels, capabilities: desc.capabilities, fileSize: desc.fileSize,
					teamDriveId: desc.teamDriveId, fileExtension: desc.fileExtension, mimeType: desc.mimeType,
					explicitlyTrashed: desc.explicitlyTrashed, autosave: this.ui.editor.autosave}});
			}
			catch (e)
			{
				// ignore
			}

			// LATER: How to reload realtime document without refreshing the page
			this.timeoutErrorShowing = true;
			
			this.ui.showError(mxResources.get('timeout'), mxResources.get('realtimeTimeout'), mxResources.get('discardChangesAndReconnect'), mxUtils.bind(this, function()
			{
				this.ui.spinner.spin(document.body, mxResources.get('connecting'));
				this.file.setModified(false);
				window.location.reload();
			}), null, mxResources.get('ignore'), mxUtils.bind(this, function()
			{
				this.showDisconnectedStatus();
				this.timeoutErrorShowing = false;
				this.realtimeHeartbeat *= 2;
				this.connected = false;
				this.saving = false;
			}), mxResources.get('help'), mxUtils.bind(this, function()
			{
				this.ui.openLink('https://desk.draw.io/support/solutions/articles/16000076743');
			}), 480, 150);
		});
		
		img.src = IMAGE_PATH + '/1x1.png?t=' + new Date().getTime();
	}	
};

/**
 * 
 */
DriveRealtime.prototype.showDisconnectedStatus = function() 
{
	this.ui.editor.setStatus('<div class="geStatusAlert geBlink">' + mxUtils.htmlEntities(mxResources.get('disconnected')) +
			' <a href="https://desk.draw.io/support/solutions/articles/16000076743" target="_blank">' +
			'<img border="0" title="' + mxUtils.htmlEntities(mxResources.get('help')) + '" valign="bottom" src="' +
			Editor.helpImage + '"/></a></div>');
};

/**
 * 
 */
DriveRealtime.prototype.initializeChat = function() 
{
	this.chatHistory = this.rtModel.createList();
	this.root.set('chatHistory', this.chatHistory);
	//this.log('Chat history created');
};

/**
 * Adds a listener to the graph selection model and writes changes
 * in the RT selection map
 */
DriveRealtime.prototype.installSelectionModelListener = function()
{
	this.graphSelectionModelChangeListener = mxUtils.bind(this, function(sender, evt)
	{
		this.ui.drive.checkToken(mxUtils.bind(this, function()
		{
			if (this.file.isEditable() && !this.graph.isSelectionEmpty())
			{
				try
				{
					// LATER: Clear value if selection is empty. This is currently
					// disabled to avoid using up the quota in this case but the
					// better solution is to mark this "transient" (ie no history).
					var cells = this.graph.getSelectionCells();
					var selectedCellIds = '';
					
			    	for (var i = 0; i < cells.length; i++)
			    	{
			    		selectedCellIds += cells[i].id + ',';
			    	}
			    	
			    	this.getCurrentPage().mapping.selectionMap.set(this.userId, selectedCellIds);
				}
				catch (e)
				{
					this.ui.handleError(e);
				}
			}
		}));
	});
	
	this.graph.getSelectionModel().addListener(mxEvent.CHANGE, this.graphSelectionModelChangeListener);
};

/**
 * Connects the collaborator event listeners to the draw function.
 */
DriveRealtime.prototype.installCollaboratorListener = function()
{
	this.doc.addEventListener(gapi.drive.realtime.EventType.COLLABORATOR_JOINED, mxUtils.bind(this, this.updateCollaborators));
	this.doc.addEventListener(gapi.drive.realtime.EventType.COLLABORATOR_LEFT, mxUtils.bind(this, this.updateCollaborators));
};

/**
 * Draw function for the collaborator list.
 */
DriveRealtime.prototype.updateCollaborators = function()
{
	var n = this.doc.getCollaborators().length - 1;
	
	if (this.collaboratorsElement == null)
	{
		this.collaboratorsElement = document.createElement('a');
		this.collaboratorsElement.setAttribute('href', 'javascript:void(0);');
		this.collaboratorsElement.className = 'geItem';
		this.collaboratorsElement.style.position = 'absolute';
		this.collaboratorsElement.style.display = 'inline-block';
		this.collaboratorsElement.style.verticalAlign = 'bottom';
		this.collaboratorsElement.style.color = '#666';
		this.collaboratorsElement.style.top = '10px';
		this.collaboratorsElement.style.right = (uiTheme == 'atlas') ? '42px' : '68px';
		this.collaboratorsElement.style.padding = '2px';
		this.collaboratorsElement.style.fontSize = '8pt';
		this.collaboratorsElement.style.verticalAlign = 'middle';
		this.collaboratorsElement.style.backgroundPosition = '100% 60%';
		this.collaboratorsElement.style.backgroundRepeat = 'no-repeat';
		
		if (screen.width <= 540)
		{
			this.collaboratorsElement.style.maxWidth = Math.max(10, screen.width - 500) + 'px';
			this.collaboratorsElement.style.overflow = 'hidden';
		}
		
		this.ui.toolbarContainer.appendChild(this.collaboratorsElement);
		
		mxEvent.addListener(this.collaboratorsElement, 'click', mxUtils.bind(this, function(evt)
		{
			if (this.collabPanel == null)
			{
				var div = document.createElement('div');
				div.className = 'geDialog';
				div.style.position = 'absolute';
				div.style.maxHeight = '400px';
				div.style.maxWidth = '300px';
				div.style.right = '38px';
				div.style.padding = '14px';
				div.style.paddingRight = '30px';

				this.collabPanel = div;
			}
			
			if (this.collabPanel.parentNode == null)
			{
				this.collabPanel.style.top = (this.collaboratorsElement.clientTop + this.collaboratorsElement.clientHeight + this.ui.menubarHeight + 8) + 'px';
				document.body.appendChild(this.collabPanel);
				this.collabPanel.innerHTML = '';
				
				var img = document.createElement('img');

				img.setAttribute('src', Dialog.prototype.closeImage);
				img.setAttribute('title', mxResources.get('close'));
				img.className = 'geDialogClose';
				img.style.top = '8px';
				img.style.right = '8px';
				
				mxEvent.addListener(img, 'click', mxUtils.bind(this, function()
				{
					if (this.collabPanel.parentNode != null)
					{
						this.collabPanel.parentNode.removeChild(this.collabPanel);
					}
				}));
				
				this.collabPanel.appendChild(img);
								
				if (this.doc.getCollaborators().length > 1)
				{
					for (var i = 0; i < this.doc.getCollaborators().length; i = i + 1)
					{
						var collaborator = this.doc.getCollaborators()[i];
						
						if (!collaborator.isMe)
						{
							var elt = document.createElement('div');
							elt.style.cursor = 'pointer';
							elt.style.whiteSpace = 'nowrap';
							
							var img = document.createElement('img');
							img.src = collaborator.photoUrl;
							img.style.backgroundColor = collaborator.color;
							img.style.paddingBottom = '8px';
							img.style.marginRight = '10px';
							img.style.marginTop = '2px';
							img.style.marginBottom = '2px';
							img.style.height = '25px';
							img.style.width = '25px';
							img.setAttribute('align', 'absmiddle');
							
							elt.appendChild(img);
							mxUtils.write(elt, collaborator.displayName);
							
							this.collabPanel.appendChild(elt);
							
							// Click on collaborator shows selection cells, scrolls to first cell
							mxEvent.addListener(elt, 'click', mxUtils.bind(this, function()
							{
								var value = this.getCurrentPage().mapping.selectionMap.get(collaborator.userId);
								
								if (value != null)
								{
									var cellIds = value.split(',');
									
									for (var i = 0; i < cellIds.length; i++)
									{
										var cell = this.model.getCell(cellIds[i]);
										this.highlight(cell, collaborator.sessionId);
										
										if (cell != null && i == 0)
										{
											this.graph.scrollCellToVisible(cell);
										}
									}
								}
							}));
						}
					}
				}
				else
				{
					mxUtils.write(this.collabPanel, mxResources.get('noOtherViewers'));
				}
			}
			else if (this.collabPanel.parentNode != null)
			{
				this.collabPanel.parentNode.removeChild(this.collabPanel);
			}
			
			mxEvent.consume(evt);
		}));
		
		mxEvent.addListener(document.body, 'click', mxUtils.bind(this, function(evt)
		{
			if (!mxEvent.isConsumed(evt) && this.collabPanel != null && this.collabPanel.parentNode != null)
			{
				this.collabPanel.parentNode.removeChild(this.collabPanel);
			}
		}));
	}
	
	var viewers = mxResources.get((n == 0) ? 'noOtherViewers' : ((n == 1) ? 'otherViewer' : 'otherViewers'));
	
	if (n > 0)
	{
		viewers = n + ' ' + viewers;
		this.collaboratorsElement.style.paddingRight = '16px';
		this.collaboratorsElement.style.backgroundImage =  'url(' + IMAGE_PATH + '/expanded.gif)';
		this.collaboratorsElement.style.cursor = 'pointer';
	}
	else
	{
		this.collaboratorsElement.style.paddingRight = '0px';
		this.collaboratorsElement.style.backgroundImage =  '';
		this.collaboratorsElement.style.cursor = 'default';
	}
	
	var html = '<div title="' + viewers + '" style="display:inline-block;white-space:nowrap;max-width:110px;overflow:hidden;text-overflow:ellipsis;">' + viewers + '</div>';
	
	var names = new Object();
	var count = 0;
	
	for (var i = 0; i < this.doc.getCollaborators().length && count < 6; i = i + 1)
	{
		var c = this.doc.getCollaborators()[i];
		
		if (!c.isMe && names[c.color] == null)
		{
			names[c.color] = c.displayName;
			count++;
		}
	}
	
	for (var color in names)
	{
		html += '<div title="' + mxUtils.htmlEntities(names[color]) + '" style="display:inline-block;background-color:' + color + ';width:13px;height:13px;margin-left:4px;margin-top:-1px;"></div>';
	}
	
	this.collaboratorsElement.innerHTML = html;
};

/**
 * Creates and returns a prefix for cell IDs.
 */
DriveRealtime.prototype.createPrefix = function()
{
	var collabs = this.doc.getCollaborators();
	
	for (var i = 0; i < collabs.length; i++)
	{
		if (collabs[i]['isMe'])
		{
			return collabs[i]['sessionId'];
		}
	}
	
	return '';
};

DriveRealtime.prototype.highlight = function(cell, sessionId)
{
	var color = 'red'; // session not found
	
	for (var i = 0; i < this.doc.getCollaborators().length; i = i + 1)
	{
		var collaborator = this.doc.getCollaborators()[i];

		if (collaborator.sessionId == sessionId)
		{
			color = collaborator.color;
			
			break;
		}      
	}
	
	this.graph.highlightCell(cell, color);
};

/**
 * Writes out a string representing the current state of the document.
 */
DriveRealtime.prototype.dumpRoot = function()
{
	return this.dump(this.root);
};

/**
 * Creates a dump of the given map.
 */
DriveRealtime.prototype.dump = function(obj)
{
	var result = '';
	
	if (obj != null)
	{
		if (obj.constructor == mxCell)
		{
			return obj.id;
		}
		else if (obj.constructor == mxRootChange)
		{
			result += 'mxRootChange[root=' + this.dump(obj.root) + ']';
		}
		else if (obj.constructor == mxChildChange)
		{
			result += 'mxChildChange[parent=' + this.dump(obj.parent) +
				', child=' + this.dump(obj.child.id) +
				', index=' + obj.index + ']';
		}
		else if (obj.constructor == mxTerminalChange)
		{
			result += 'mxTerminalChange[cell=' + this.dump(obj.cell) +
				', terminal=' + this.dump(obj.terminal) +
				', source=' + obj.source + ']';
		}
		else if (obj.constructor == mxValueChange)
		{
			result += 'mxValueChange[cell=' + this.dump(obj.cell) + ', value=' + obj.value + ']';
		}
		else if (obj.constructor == mxGeometryChange)
		{
			result += 'mxGeometryChange[cell=' + this.dump(obj.cell) + ', geometry=' +
				((obj.cell.geometry != null) ? mxUtils.getXml(this.codec.encode(obj.cell.geometry)) : '[null]') + ']';
		}
		else if (obj.constructor == mxStyleChange)
		{
			result += 'mxStyleChange[cell=' + this.dump(obj.cell) + ', style=' + obj.style + ']';
		}
		else if (obj.constructor == mxVisibleChange)
		{
			result += 'mxVisibleChange[cell=' + this.dump(obj.cell) + ', visible=' + obj.visible + ']';
		}
		else if (obj.constructor == mxCollapseChange)
		{
			result += 'mxCollapseChange[cell=' + this.dump(obj.cell) + ', collapsed=' + obj.collapsed + ']';
		}
		else if (obj.constructor == mxRtCell)
		{
			result += '[id=' + obj.cellId + ',parent=' + ((obj.parent != null) ? obj.parent.cellId : '[null]');
			
			if (obj.children.length > 0)
			{
				result += ',\n' + obj.children.length + ' children=[' +
					this.dump(obj.children.get(0));
				
				for (var i = 1; i < obj.children.length; i++)
				{
					result += ',' + this.dump(obj.children.get(i));
				}
				
				result += ']';
			}
			
			result += ']\n';
		}
		else if (obj.keys != null)
		{
			var keys = obj.keys();
			result += '{\n';
			
			for (var i = 0; i < keys.length; i++)
			{
				result += keys[i] + '=' + this.dump(obj.get(keys[i])) + ';\n';
			}
			
			result += '}';
		}
		else if (obj.asArray != null)
		{
			var arr = obj.asArray();
			result += '[';
			
			for (var i = 0; i < arr.length; i++)
			{
				result += arr[i] + ';';
			}
			
			result += ']';
		}
		else
		{
			result = obj;
		}
	}
	else
	{
		result = 'null';
	}
	
	return result;
};

/**
 * Writes the given text to the log if <logging> is enabled.
 */
DriveRealtime.prototype.check = function()
{
	console.log('checking consistency');
	this.checkChildren(this.model.getRoot());
	console.log('checking consistency done');
};

/**
 * Writes the given text to the log if <logging> is enabled.
 */
DriveRealtime.prototype.checkChildren = function(cell)
{
	if (cell.rtCell == null)
	{
		console.log('no realtime cell', 'cell', cell.id);
	}
	else
	{
		if (cell.getTerminal(true) != null && (cell.rtCell.source == null ||
			cell.rtCell.source != cell.getTerminal(true).rtCell))
		{
			console.log('invalid source', 'edge', cell.id, 'source',
				cell.getTerminal(true).id, 'rtSource', cell.rtCell.source);
		}
		
		if (cell.getTerminal(false) != null && (cell.rtCell.target == null ||
			cell.rtCell.target != cell.getTerminal(false).rtCell))
		{
			console.log('invalid target', 'edge', cell.id, 'target',
				cell.getTerminal(false).id, 'rtTarget', cell.rtCell.target);
		}
		
		var childCount = this.model.getChildCount(cell);
		var children = cell.rtCell.children.asArray();
		
		if (childCount != cell.rtCell.children.length)
		{
			console.log('invalid child count', 'cell', cell.id, 'children',
				children.length, 'childCount', childCount);
		}
	
		for (var i = 0; i < cell.rtCell.children.length; i++)
		{
			var child = this.model.getChildAt(cell, i);
			
			if (child == null)
			{
				console.log('no child', 'index', i, 'child', cell.rtCell.children.get(i));
			}
			else if (cell.rtCell.children.get(i) != child.rtCell)
			{
				console.log('invalid child', 'index', i, 'child',
					cell.rtCell.children.get(i), 'graphChild', child);
			}
		}
	}
		
	for (var i = 0; i < childCount; i++)
	{
		var child = this.model.getChildAt(cell, i);
		this.checkChildren(child);
	}
};

/**
 * Writes the given text to the log if <logging> is enabled.
 */
DriveRealtime.prototype.log = function(message)
{
	//if (this.logLevel > 1)
	{
		//mxLog.debug.apply(mxLog, arguments);
		//console.log(message);
	}
};

/**
 * Writes the given text to the log if <logging> is enabled.
 */
DriveRealtime.prototype.warn = function(message)
{
	//if (this.logLevel > 0)
	{
		//mxLog.debug.apply(mxLog, arguments);
		//console.log(message);
	}
};

/**
 * Destroys the instance and removes all listeners.
 */
DriveRealtime.prototype.destroy = function(unloading)
{
	unloading = (unloading != null) ? unloading : false;
	
	if (this.pageFormatListener != null)
	{
		this.ui.removeListener(this.pageFormatListener);
		this.pageFormatListener = null;
	}
	
	if (this.pageScaleListener != null)
	{
		this.ui.removeListener(this.pageScaleListener);
		this.pageScaleListener = null;
	}

	if (this.backgroundColorListener != null)
	{
		this.ui.removeListener(this.backgroundColorListener);
		this.backgroundColorListener = null;
	}
	
	if (this.shadowVisibleListener != null)
	{
		this.graph.removeListener(this.shadowVisibleListener);
		this.shadowVisibleListener = null;
	}

	if (this.foldingEnabledListener != null)
	{
		this.ui.removeListener(this.foldingEnabledListener);
		this.foldingEnabledListener = null;
	}

	if (this.pageVisibleListener != null)
	{
		this.ui.removeListener(this.pageVisibleListener);
		this.pageVisibleListener = null;
	}

	if (this.backgroundImageListener != null)
	{
		this.ui.removeListener(this.backgroundImageListener);
		this.backgroundImageListener = null;
	}

	if (this.mathEnabledListener != null)
	{
		this.ui.removeListener(this.mathEnabledListener);
		this.mathEnabledListener = null;
	}
	
	if (this.previousUndoListener != null)
	{
		this.ui.editor.undoListener = this.previousUndoListener;
		this.previousUndoListener = null;
	}

	if (this.graphSelectionModelChangeListener != null)
	{
		this.graph.selectionModel.removeListener(this.graphSelectionModelChangeListener);
		this.graphSelectionModelChangeListener = null;
	}
	
	if (this.disconnectListener != null)
	{
		this.ui.drive.removeListener(this.disconnectListener);
		this.disconnectListener = null;
	}
	
	if (this.autosaveChangeListener != null)
	{
		this.ui.editor.removeListener(this.autosaveChangeListener);
		this.autosaveChangeListener = null;
	}
	
	if (this.graphModelChangeListener != null)
	{
		this.model.removeListener(this.graphModelChangeListener);
		this.graphModelChangeListener = null;
	}
	
	if (this.pageChangeListener != null)
	{
		this.ui.editor.removeListener(this.pageChangeListener);
		this.pageChangeListener = null;
	}

	if (this.viewStateListener != null)
	{
		this.ui.editor.removeListener(this.viewStateListener);
		this.viewStateListener = null;
	}
	
	if (this.collaboratorsElement != null)
	{
		this.collaboratorsElement.parentNode.removeChild(this.collaboratorsElement);
		this.collaboratorsElement = null;
	}
	
	if (this.updateStatusThread != null)
	{
		window.clearInterval(this.updateStatusThread);
		this.updateStatusThread = null;
	}
	
	this.ui.allowAnimation = true;

	try
	{
		// KNOWN: Cannot access g of null error in realtime
		// when called from window.onBeforeUnload handler
		if (!unloading && !this.doc.isClosed)
		{
			this.doc.close();
		}
	}
	catch (e)
	{
		// ignores possible document closed errors
	}
};
