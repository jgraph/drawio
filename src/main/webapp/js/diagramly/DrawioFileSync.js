/**
 * Copyright (c) 2006-2018, JGraph Ltd
 * Copyright (c) 2006-2018, Gaudenz Alder
 * 
 * Realtime collaboration for any file.
 */
DrawioFileSync = function(file)
{
	mxEventSource.call(this);

	this.clientId = Editor.guid();
	this.ui = file.ui;
	this.file = file;
};

/**
 * Protocol version to be added to all communcations and diffs to check
 * if a client is out of date and force a refresh. Note that this must
 * be incremented if new messages are added or the format is changed.
 * This must be numeric to compare older vs newer protocol versions.
 */
DrawioFileSync.PROTOCOL = 1;

//Extends mxEventSource
mxUtils.extend(DrawioFileSync, mxEventSource);

/**
 * Maximum size in bytes for cache values.
 */
DrawioFileSync.prototype.maxCacheEntrySize = 1000000;

/**
 * Specifies if notifications should be sent and received for changes.
 */
DrawioFileSync.prototype.enabled = true;

/**
 * True if a change event is fired for a remote change.
 */
DrawioFileSync.prototype.updateStatusInterval = 10000;

/**
 * True if a change event is fired for a remote change.
 */
DrawioFileSync.prototype.cacheUrl = (urlParams['dev'] == '1') ? '/cache' : 'https://rt.draw.io/cache';

/**
 * Holds the channel ID for sending and receiving change notifications.
 */
DrawioFileSync.prototype.channelId = null;

/**
 * Holds the channel ID for sending and receiving change notifications.
 */
DrawioFileSync.prototype.channel = null;

/**
 * Specifies if descriptor change events should be ignored.
 */
DrawioFileSync.prototype.catchupRetryCount = 0;

/**
 * Specifies if descriptor change events should be ignored.
 */
DrawioFileSync.prototype.maxCatchupRetries = 12;

/**
 * Specifies if descriptor change events should be ignored.
 */
DrawioFileSync.prototype.maxCacheReadyRetries = 2;

/**
 * Specifies if descriptor change events should be ignored.
 */
DrawioFileSync.prototype.cacheReadyDelay = 400;

/**
 * Adds all listeners.
 */
DrawioFileSync.prototype.start = function()
{
	this.lastModified = this.file.getLastModifiedDate();
	this.channelId = this.file.getChannelId();
	
	if (this.channelId != null) 
	{
		this.pusher = this.ui.getPusher();
		
		if (this.pusher != null)
		{
			try
			{
				// Error listener must be installed before trying to create channel
				this.pusherErrorListener = mxUtils.bind(this, function(err)
				{
					if (err.error.data.code === 4004)
					{
						EditorUi.logError('Error: Pusher Limit', null, this.file.getId());
					}
				});
	
				this.pusher.connection.bind('error', this.pusherErrorListener);
			}
			catch (e)
			{
				// ignore
			}
			
			try
			{
				this.channel = this.pusher.subscribe(this.channelId);
				this.key = this.file.getChannelKey();
				this.updateOnlineState();

				if (this.file.stats.start == null)
				{
					this.file.stats.start = new Date().toISOString();
				}
				
				EditorUi.debug('Sync.start', [this]);
				
				if (!this.ui.isOffline())
				{
					EditorUi.logEvent({category: 'DiffSync-Start', action: DrawioFile.SYNC,
						label: 'id.' + this.file.getId() + '.mode.' + this.file.getMode() +
						'.size.' + this.file.getSize() + '.channel.' + this.channelId});
				}
			}
			catch (e)
			{
				// ignore
			}
		}

		this.installListeners();
	    
		window.setTimeout(mxUtils.bind(this, function()
		{
			this.resetUpdateStatusThread();
			this.updateStatus();
		}, 0));
	}
};

/**
 * Draw function for the collaborator list.
 */
DrawioFileSync.prototype.isConnected = function()
{
	if (this.pusher != null && this.pusher.connection != null)
	{
		return this.pusher.connection.state == 'connected';
	}
	else
	{
		return false;
	}
};

/**
 * Draw function for the collaborator list.
 */
DrawioFileSync.prototype.updateOnlineState = function()
{
	var addClickHandler = mxUtils.bind(this, function(elt)
	{
		mxEvent.addListener(elt, 'click', mxUtils.bind(this, function(evt)
		{
			this.enabled = !this.enabled;
			this.updateOnlineState();
			this.ui.updateButtonContainer();
			this.resetUpdateStatusThread();
			this.updateStatus();
			
			if (!this.file.inConflictState && this.enabled)
			{
				this.fileChangedNotify();
			}
		}));
	});

	if (uiTheme == 'min' && this.ui.buttonContainer != null)
	{
		if (this.collaboratorsElement == null)
		{
			var elt = document.createElement('div');
    		elt.style.cssText = 'display:inline-block;position:relative;box-sizing:border-box;margin-right:4px;cursor:pointer;';
        	elt.style.backgroundPosition = 'center center';
        	elt.style.backgroundRepeat = 'no-repeat';
        	elt.style.backgroundSize = '24px 24px';
        	elt.style.height = '24px';
        	elt.style.width = '24px';
        	mxUtils.setOpacity(elt, 30);
        	
        	addClickHandler(elt);
        	this.ui.buttonContainer.appendChild(elt);
        	this.collaboratorsElement = elt;
		}
	}
	else if (this.ui.toolbarContainer != null)
	{
		if (this.collaboratorsElement == null)
		{
			var elt = document.createElement('a');
			elt.className = 'geButton';
			elt.style.position = 'absolute';
			elt.style.display = 'inline-block';
			elt.style.verticalAlign = 'bottom';
			elt.style.color = '#666';
			elt.style.top = '5px';
			elt.style.right = (uiTheme == 'atlas') ? '42px' : '60px';
			elt.style.padding = '2px';
			elt.style.fontSize = '8pt';
			elt.style.verticalAlign = 'middle';
			elt.style.textDecoration = 'none';
	    	elt.style.backgroundPosition = 'center center';
	    	elt.style.backgroundRepeat = 'no-repeat';
	    	elt.style.backgroundSize = '16px 16px';
	    	elt.style.opacity = '0.6';
			elt.style.width = '16px';
			elt.style.height = '16px';
			
			// Prevents focus
		    mxEvent.addListener(elt, (mxClient.IS_POINTER) ? 'pointerdown' : 'mousedown',
	        	mxUtils.bind(this, function(evt)
	    	{
				evt.preventDefault();
			}));
			
			addClickHandler(elt);
			this.ui.toolbarContainer.appendChild(elt);
			this.collaboratorsElement = elt;
		}
	}
	
	if (this.collaboratorsElement != null)
	{
		var status = '';
		
		if (!this.enabled)
		{
			status = mxResources.get('disconnected');
		}
		else if (this.file.invalidChecksum)
		{
			status = mxResources.get('error') + ': ' + mxResources.get('checksum');
		}
		else if (!this.ui.isOffline() || !this.isConnected())
		{
			status = mxResources.get('offline');
		}
		else
		{
			status = mxResources.get('online');
		}
		
		this.collaboratorsElement.setAttribute('title', status);
		this.collaboratorsElement.style.backgroundImage = 'url(' + ((!this.enabled) ? Editor.syncDisabledImage :
			((!this.ui.isOffline() && this.isConnected() && !this.file.invalidChecksum) ?
			Editor.syncImage : Editor.syncProblemImage)) + ')';
	}
};


/**
 * Updates the status bar with the latest change.
 */
DrawioFileSync.prototype.updateStatus = function()
{
	if (!this.file.isModified() && !this.file.inConflictState &&
		this.file.autosaveThread == null && !this.file.savingFile &&
		!this.redirectDialogShowing)
	{
		if (this.enabled && this.ui.statusContainer != null)
		{
			// LATER: Write out modified date for more than 2 weeks ago
			var str = this.ui.timeSince(new Date(this.lastModified));
			
			if (str == null)
			{
				str = mxResources.get('lessThanAMinute');
			}
			
			var history = this.file.isRevisionHistorySupported();

			// Consumed and displays last message
			var msg = this.lastMessage;
			this.lastMessage = null;
			
			if (msg != null && msg.length > 40)
			{
				msg = msg.substring(0, 40) + '...';
			}

			var label = mxResources.get('lastChange', [str]);
			
			this.ui.editor.setStatus('<div style="display:inline-block;">' + mxUtils.htmlEntities(label)  + '</div>' +
				((msg != null) ? ' (' + msg + ')' : '') +
				(this.file.isEditable() ? '' : '<div class="geStatusAlert" style="margin-left:8px;display:inline-block;">' +
					mxUtils.htmlEntities(mxResources.get('readOnly')) + '</div>') +
				(this.isConnected() ? '' : '<div class="geStatusAlert geBlink" style="margin-left:8px;display:inline-block;">' +
					mxUtils.htmlEntities(mxResources.get('disconnected')) + '</div>'));
			var links = this.ui.statusContainer.getElementsByTagName('div');
			
			if (links.length > 0)
			{
				if (history)
				{
					links[0].style.cursor = 'pointer';
					links[0].style.textDecoration = 'underline';
					links[0].setAttribute('title', mxResources.get('revisionHistory'));
					
					mxEvent.addListener(links[0], 'click', mxUtils.bind(this, function()
					{
						this.ui.actions.get('revisionHistory').funct();
					}));
				}
				else
				{
					links[0].setAttribute('title', label);
				}
			}
			
			this.resetUpdateStatusThread();
		}
		else
		{
			this.file.addAllSavedStatus();
		}
	}
};

/**
 * Resets the thread to update the status.
 */
DrawioFileSync.prototype.resetUpdateStatusThread = function()
{
	if (this.updateStatusThread != null)
	{
		window.clearInterval(this.updateStatusThread);
	}
	
	if (this.channel != null)
	{
		this.updateStatusThread = window.setInterval(mxUtils.bind(this, function()
		{
			this.ui.drive.checkToken(mxUtils.bind(this, function()
			{
				this.updateStatus();
			}));
		}), this.updateStatusInterval);
	}
};

/**
 * Installs all required listeners for syncing the current file.
 */
DrawioFileSync.prototype.installListeners = function()
{
	// Ignores old messages
	var lastModifiedDate = null;

	if (this.pusher)
	{
	    // Listens to remote model changes
		this.connectionListener = mxUtils.bind(this, function()
		{
			this.updateOnlineState();
			this.updateStatus();
			
			if (this.isConnected() && !this.announced)
			{
				var user = this.file.getCurrentUser();
				var join = {a: 'join'};
				
				if (user != null)
				{
					join.name = user.displayName;
					join.uid = user.id;
				}

				mxUtils.post(this.cacheUrl, this.getIdParameters() +
					'&msg=' + encodeURIComponent(this.objectToString(
					this.createMessage(join))));
				this.announced = true;
				this.file.stats.msgSent++;
			}
		});
		
		this.pusher.connection.bind('state_change', this.connectionListener);
	}
    
	if (this.channel != null)
    {
		this.changeListener = mxUtils.bind(this, function(data)
		{
			this.file.stats.msgReceived++;

			if (this.enabled && !this.file.inConflictState &&
				!this.redirectDialogShowing)
			{
				try
				{
					var msg = this.stringToObject(data);
					
					if (msg != null)
					{
						EditorUi.debug('Sync.message', [this], msg);

						// Handles protocol mismatch
						if (msg.v > DrawioFileSync.PROTOCOL)
						{
							this.file.redirectToNewApp();
						}
						else if (msg.v === DrawioFileSync.PROTOCOL && msg.d != null)
						{
							this.handleMessageData(msg.d);
						}
					}
				}
				catch (e)
				{
					if (window.console != null && urlParams['test'] == '1')
					{
						console.log(e);
					}
				}
			}
		});
		
    	this.channel.bind('changed', this.changeListener);
    }
    
    // Listens to online state changes
	this.onlineListener = mxUtils.bind(this, function()
	{
		this.updateOnlineState();
		this.fileChangedNotify();
	});
    
	mxEvent.addListener(window, 'online', this.onlineListener);
};

/**
 * Adds the listener for automatically saving the diagram for local changes.
 */
DrawioFileSync.prototype.handleMessageData = function(data)
{
	if (data.a == 'desc')
	{
		if (!this.file.savingFile)
		{
			this.reloadDescriptor();
		}
	}
	else if (data.a == 'join' || data.a == 'leave')
	{
		if (data.a == 'join')
		{
			this.file.stats.joined++;
		}
		
		if (data.name != null)
		{
			this.lastMessage = mxResources.get((data.a == 'join') ?
				'userJoined' : 'userLeft', [data.name]);
			this.updateStatus();
		}
	}
	else if (data.m != null)
	{
		var mod = new Date(data.m);
		
		// Ignores obsolete messages
		if (this.lastMessageModified == null || this.lastMessageModified < mod)
		{
			this.lastMessageModified = mod;
			this.fileChangedNotify();
		}
	}
};

/**
 * Adds the listener for automatically saving the diagram for local changes.
 */
DrawioFileSync.prototype.fileChangedNotify = function()
{
	if (this.file.savingFile)
	{
		this.remoteFileChanged = true;
	}
	else
	{
		// It's possible that a request never returns so override
		// existing requests and abort them when they are active
		var thread = this.fileChanged(mxUtils.bind(this, function(err)
		{
			this.updateStatus();
		}),
			mxUtils.bind(this, function(err)
		{
			this.file.handleFileError(err);
		}), mxUtils.bind(this, function()
		{
			return !this.file.savingFile && this.notifyThread != thread;
		}));
	}
};

/**
 * Adds the listener for automatically saving the diagram for local changes.
 */
DrawioFileSync.prototype.fileChanged = function(success, error, abort)
{
	var thread = window.setTimeout(mxUtils.bind(this, function()
	{
		if (abort == null || !abort())
		{
			this.file.loadPatchDescriptor(mxUtils.bind(this, function(desc)
			{
				if (abort == null || !abort())
				{
					this.catchup(this.file.getDescriptorEtag(desc),
						this.file.getDescriptorSecret(desc),
						success, error, abort);
				}
			}), error);
		}
	}), 0);
	
	this.notifyThread = thread;
	
	return thread;
};

/**
 * Adds the listener for automatically saving the diagram for local changes.
 */
DrawioFileSync.prototype.reloadDescriptor = function()
{
	this.file.loadDescriptor(mxUtils.bind(this, function(desc)
	{
		if (desc != null)
		{
			// Forces data to be updated
			this.file.setDescriptorEtag(desc, this.file.getCurrentEtag());
			this.updateDescriptor(desc);
			this.fileChangedNotify();
		}
		else
		{
			this.file.inConflictState = true;
			this.file.handleFileError();
		}
	}), mxUtils.bind(this, function(err)
	{
		this.file.inConflictState = true;
		this.file.handleFileError(err);
	}));
};

/**
 * Adds the listener for automatically saving the diagram for local changes.
 */
DrawioFileSync.prototype.updateDescriptor = function(desc)
{
	this.file.setDescriptor(desc);
	this.file.descriptorChanged();
	
	if (this.channelId == null)
	{
		// Checks channel ID and starts sync
		this.start();
	}
};

/**
 * Adds the listener for automatically saving the diagram for local changes.
 */
DrawioFileSync.prototype.catchup = function(etag, secret, success, error, abort)
{
	var current = this.file.getCurrentEtag();

	if (current == etag)
	{
		if (success != null)
		{
			success();
		}
	}
	else
	{
		// Cache entry may not have been uploaded to cache before new
		// etag is visible to client so retry once after cache miss
		var cacheReadyRetryCount = 0;
		
		var doCatchup = mxUtils.bind(this, function()
		{
			if (abort == null || !abort())
			{
				mxUtils.get(this.cacheUrl + '?id=' + encodeURIComponent(this.channelId) +
					'&from=' + encodeURIComponent(current) + '&to=' + encodeURIComponent(etag) +
					((secret != null) ? '&secret=' + encodeURIComponent(secret) : ''),
					mxUtils.bind(this, function(req)
				{
					this.file.stats.bytesReceived += req.getText().length;	
					
					if (abort == null || !abort())
					{
						var checksum = null;
						var temp = [];
				
						if (req.getStatus() >= 200 && req.getStatus() <= 299 &&
							req.getText().length > 0)
						{
							try
							{
								var result = JSON.parse(req.getText());
								
								if (result != null && result.length > 0)
								{
									for (var i = 0; i < result.length; i++)
									{
										var value = this.stringToObject(result[i]);
										
										if (value.v > DrawioFileSync.PROTOCOL)
										{
											this.file.redirectToNewApp(error);
											temp = [];
											break;
										}
										else if (value.v === DrawioFileSync.PROTOCOL &&
											value.d != null)
										{
											checksum = value.d.checksum;
											temp.push(value.d.patch);
										}
										else
										{
											temp = [];
											break;
										}
									}
								}
							}
							catch (e)
							{
								temp = [];
								
								if (window.console != null && urlParams['test'] == '1')
								{
									console.log(e);
								}
							}
						}
						
						try
						{
							if (temp.length > 0)
							{
								this.file.stats.cacheHits++;
								this.merge(temp, checksum, etag, success, error);
							}
							// Retries if cache entry was not yet there
							else if (cacheReadyRetryCount <= this.maxCacheReadyRetries &&
								req.getStatus() != 401)
							{
								cacheReadyRetryCount++;
								window.setTimeout(doCatchup, this.cacheReadyDelay);
							}
							else
							{
								this.file.stats.cacheMiss++;
								this.reload(success, error, abort);
							}
						}
						catch (e)
						{
							if (error != null)
							{
								error(e);
							}
						}
					}
				}));
			}
		});
		
		window.setTimeout(doCatchup, this.cacheReadyDelay);
	}
};

/**
 * Adds the listener for automatically saving the diagram for local changes.
 */
DrawioFileSync.prototype.reload = function(success, error, abort)
{
	this.file.updateFile(mxUtils.bind(this, function()
	{
		if (this.channelId == null)
		{
			// Checks channel ID and starts sync
			this.start();
		}

		this.lastModified = this.file.getLastModifiedDate();
		this.updateStatus();
		
		if (success != null)
		{
			success();
		}
	}), mxUtils.bind(this, function(err)
	{
		if (error != null)
		{
			error(err);
		}
	}), abort);
};

/**
 * Adds the listener for automatically saving the diagram for local changes.
 */
DrawioFileSync.prototype.merge = function(patches, checksum, etag, success, error)
{
	try
	{
		this.lastModified = new Date();
		this.file.shadowPages = (this.file.shadowPages != null) ?
			this.file.shadowPages : this.ui.getPagesForNode(
			mxUtils.parseXml(this.file.shadowData).documentElement)
			
		// Creates a patch for backup if the checksum fails
		this.file.backupPatch = (this.file.isModified()) ?
			this.ui.diffPages(this.file.shadowPages, this.ui.pages) : null;
		
		// Patches the current document
		this.file.patch(patches, (DrawioFile.LAST_WRITE_WINS &&
			this.file.isEditable() && this.file.isModified()) ?
			this.file.shadowPages : null);
		
		// Patches the shadow document
		for (var i = 0; i < patches.length; i++)
		{
			this.file.shadowPages = this.ui.patchPages(this.file.shadowPages, patches[i]);
		}
		
		var current = (checksum != null) ? this.ui.getHashValueForPages(this.file.shadowPages) : null;
		EditorUi.debug('Sync.merge', [this], 'from', this.file.getCurrentEtag(), 'to', etag,
			'attempt', this.catchupRetryCount, 'diffs', patches, 'checksum', checksum);

		// Compares the checksum
		if (checksum != null && checksum != current)
		{
			this.file.stats.mergeChecksumErrors++;
			this.file.checksumError(error);
		}
		else
		{
			this.file.invalidChecksum = false;
			this.file.inConflictState = false;
			this.file.backupPatch = null;
			this.file.setCurrentEtag(etag);
			
			if (success != null)
			{
				success();
			}
		}
	}
	catch (e)
	{
		this.file.inConflictState = true;
		this.file.invalidChecksum = true;
		
		if (window.console != null && urlParams['test'] == '1')
		{
			console.log(e);
		}

		if (error != null)
		{
			error(e);
		}
		
		// Beta test error reports
		var user = this.file.getCurrentUser();
		var uid = (user != null) ? this.ui.hashValue(user.id) : 'no user';
		
		EditorUi.sendReport('Error in merge:\n' +
			new Date().toISOString() + '\n' +
			'Client=' + this.clientId + '\n' +
			'User=' + uid + '\n' +
			'File=' + this.file.getId() + '\n' +
			'Mode=' + this.file.getMode() + '\n' +
			'Size=' + this.file.getSize() + '\n' +
			'Sync=' + DrawioFile.SYNC + '\n' +
			'Stack:\n' + e.stack);
	}
};

/**
 * Invokes after a file was saved to add cache entry (which in turn notifies
 * collaborators).
 */
DrawioFileSync.prototype.descriptorChanged = function(etag)
{
	this.lastModified = this.file.getLastModifiedDate();
	
	if (this.isConnected())
	{
		var msg = this.objectToString(this.createMessage({a: 'desc',
			m: this.lastModified.getTime()}));
		var current = this.file.getCurrentEtag();
		var data = this.objectToString({});

		mxUtils.post(this.cacheUrl, this.getIdParameters() +
			'&from=' + encodeURIComponent(etag) + '&to=' + encodeURIComponent(current) +
			'&msg=' + encodeURIComponent(msg) + '&data=' + encodeURIComponent(data));
		this.file.stats.bytesSent += data.length;
		this.file.stats.msgSent++;
	}
	
	this.updateStatus();
};

/**
 * Invokes after a file was saved to add cache entry (which in turn notifies
 * collaborators).
 */
DrawioFileSync.prototype.objectToString = function(obj)
{
	var data = this.ui.editor.graph.compress(JSON.stringify(obj));
	
	if (this.key != null && typeof CryptoJS !== 'undefined')
	{
		data = CryptoJS.AES.encrypt(data, this.key).toString();
	}
	
	return data;
};

/**
 * Invokes after a file was saved to add cache entry (which in turn notifies
 * collaborators).
 */
DrawioFileSync.prototype.stringToObject = function(data)
{
	if (this.key != null && typeof CryptoJS !== 'undefined')
	{
		data = CryptoJS.AES.decrypt(data, this.key).toString(CryptoJS.enc.Utf8);
	}
	
	return JSON.parse(this.ui.editor.graph.decompress(data));
};

/**
 * Invokes after a file was saved to add cache entry (which in turn notifies
 * collaborators).
 */
DrawioFileSync.prototype.fileSaved = function(pages, lastDesc, success, error)
{
	this.lastModified = this.file.getLastModifiedDate();
	this.resetUpdateStatusThread();
	this.catchupRetryCount = 0;
	
	if (this.isConnected() && !this.file.inConflictState && !this.redirectDialogShowing)
	{
		// Computes diff and checksum
		var shadow = (this.file.shadowPages != null) ?
			this.file.shadowPages : this.ui.getPagesForNode(
			mxUtils.parseXml(this.file.shadowData).documentElement)
		var checksum = this.ui.getHashValueForPages(pages);
		var diff = this.ui.diffPages(shadow, pages);
		
		// Data is stored in cache and message is sent to all listeners
		var data = this.objectToString(this.createMessage({patch: diff, checksum: checksum}));
		var msg = this.objectToString(this.createMessage({m: this.lastModified.getTime()}));
		var secret = this.file.getDescriptorSecret(this.file.getDescriptor());
		var etag = this.file.getDescriptorEtag(lastDesc);
		var current = this.file.getCurrentEtag();

		mxUtils.post(this.cacheUrl, this.getIdParameters() +
			'&from=' + encodeURIComponent(etag) + '&to=' + encodeURIComponent(current) +
			'&msg=' + encodeURIComponent(msg) + ((secret != null) ? '&secret=' + encodeURIComponent(secret) : '') +
			((data.length < this.maxCacheEntrySize) ? '&data=' + encodeURIComponent(data) : ''),
			mxUtils.bind(this, function(req)
			{
				if (req.getStatus() >= 200 && req.getStatus() <= 299)
				{
					if (success != null)
					{
						success();
					}
				}
				else if (error != null)
				{
					error({message: req.getStatus()});
				}
			}));
		EditorUi.debug('Sync.fileSaved', [this], 'from', etag, 'to', current,
			data.length, 'bytes', 'diff', diff, 'checksum', checksum);
		this.file.stats.bytesSent += data.length;
		this.file.stats.msgSent++;
	}
	else
	{
		if (this.channelId == null)
		{
			// Checks channel ID and starts sync
			this.start();
		}
		
		if (success != null)
		{
			success();
		}
	}
};

/**
 * Creates the properties for the file descriptor.
 */
DrawioFileSync.prototype.getIdParameters = function()
{
	var result = 'id=' + this.channelId;
	
	if (this.pusher != null && this.pusher.connection != null)
	{
		result += '&sid=' + this.pusher.connection.socket_id;
	}
	
	return result;
};

/**
 * Creates the properties for the file descriptor.
 */
DrawioFileSync.prototype.createMessage = function(data)
{
	return {v: DrawioFileSync.PROTOCOL, d: data, c: this.clientId};
};

/**
 * Creates the properties for the file descriptor.
 */
DrawioFileSync.prototype.fileConflict = function(desc, success, error)
{
	this.catchupRetryCount++;
	
	if (this.catchupRetryCount < this.maxCatchupRetries)
	{
		this.file.stats.conflicts++;
		
		if (desc != null)
		{
			var etag = this.file.getDescriptorEtag(desc);
			var secret = this.file.getDescriptorSecret(desc);
			this.catchup(etag, secret, success, error);
		}
		else
		{
			this.fileChanged(success, error);
		}
	}
	else
	{
		this.catchupRetryCount = 0;
		this.file.stats.timeouts++;
		
		if (error != null)
		{
			error({message: mxResources.get('timeout')});
		}
	}
};

/**
 * Adds the listener for automatically saving the diagram for local changes.
 */
DrawioFileSync.prototype.destroy = function()
{
	if (this.isConnected())
	{
		var user = this.file.getCurrentUser();
		var leave = {a: 'leave'};
		
		if (user != null)
		{
			leave.name = user.displayName;
			leave.uid = user.id;
		}
		
		mxUtils.post(this.cacheUrl, this.getIdParameters() +
			'&msg=' + encodeURIComponent(this.objectToString(
			this.createMessage(leave))));
		this.file.stats.msgSent++;
	}

	if (this.changeListener != null && this.channel != null)
	{
		this.channel.unbind('changed', this.changeListener);
		this.changeListener = null;
	}

	if (this.connectionListener != null && this.pusher != null)
	{
		this.pusher.connection.unbind('state_change', this.connectionListener);
		this.connectionListener = null;
	}

	if (this.pusherErrorListener != null && this.pusher != null)
	{
		this.pusher.connection.unbind('error', this.pusherErrorListener);
		this.pusherErrorListener = null;
	}

	if (this.pusher != null && this.channel != null && this.channelId != null) 
	{
		this.pusher.unsubscribe(this.channelId);
		this.channel = null;
	}

	if (this.updateStatusThread != null)
	{
		window.clearInterval(this.updateStatusThread);
		this.updateStatusThread = null;
	}
	
	if (this.onlineListener != null)
	{
		mxEvent.removeListener(window, 'online', this.onlineListener);
		this.onlineListener = null;
	}
	
	if (this.collaboratorsElement != null)
	{
		this.collaboratorsElement.parentNode.removeChild(this.collaboratorsElement);
		this.collaboratorsElement = null;
	}
};
