/**
 * Copyright (c) 2006-2024, draw.io AG
 * Copyright (c) 2006-2024, JGraph Holdings Ltd
 * 
 * Realtime collaboration for any file.
 */
DrawioFileSync = function(file)
{
	mxEventSource.call(this);

	this.lastActivity = Date.now();
	this.clientId = Editor.guid();
	this.ui = file.ui;
	this.file = file;

    // Listens to online state changes
	this.onlineListener = mxUtils.bind(this, function()
	{
		this.updateOnlineState();

		if (this.isConnected() && !this.ui.isOffline(true))
		{
			this.fileChangedNotify();
		}
		else
		{
			this.updateStatus();
		}
	});
    
	mxEvent.addListener(window, 'offline', this.onlineListener);
	mxEvent.addListener(window, 'online', this.onlineListener);

	// Listens to autosave changes to update the realtime collab socket
	this.autosaveListener = mxUtils.bind(this, function()
	{
		this.updateRealtime();
	});

	this.ui.editor.addListener('autosaveChanged', this.autosaveListener);

    // Listens to visible state changes
	this.visibleListener = mxUtils.bind(this, function()
	{
		if (document.visibilityState == 'hidden')
		{
			if (this.isConnected())
			{
				this.stop();
			}
		}
		else
		{
			this.start();
		}
	});
    
	mxEvent.addListener(document, 'visibilitychange', this.visibleListener);
	
    // Listens to visible state changes
	this.activityListener = mxUtils.bind(this, function(evt)
	{
		this.lastActivity = Date.now();
		this.start();
	});

	mxEvent.addListener(document, (mxClient.IS_POINTER) ? 'pointermove' : 'mousemove', this.activityListener);
	mxEvent.addListener(document, 'keypress', this.activityListener);
	mxEvent.addListener(window, 'focus', this.activityListener);
	
	if (!mxClient.IS_POINTER && mxClient.IS_TOUCH)
	{
		mxEvent.addListener(document, 'touchstart', this.activityListener);
		mxEvent.addListener(document, 'touchmove', this.activityListener);	
	}

	// Listens to fast sync activitiy
	this.file.addListener('realtimeMessage', this.activityListener);

	// Listens to errors in the pusher API
	this.pusherErrorListener = mxUtils.bind(this, function(err)
	{
		if (err.error != null && err.error.data != null &&
			err.error.data.code === 4004)
		{
			// Hashed: no raw file ids in logs
			EditorUi.logError('Error: Pusher Limit', null,
				this.ui.hashValue(this.file.getId()));
		}
	});

    // Listens to connection state changes
	this.connectionListener = mxUtils.bind(this, function()
	{
		this.updateOnlineState();
		this.updateStatus();
		
		if (this.isConnected())
		{
			if (!this.announced && Editor.enableRealtimeCache &&
				!Editor.p2pSyncNotify)
			{
				this.sendJoinMessage();
			}
			else if (this.announced)
			{
				// Catchup on any lost edits
				this.fileChangedNotify(null, true);
			}
		}
	});
	
	// Listens to messages. The conflict state is handled in
	// handleRemoteMessage (live diffs pass, everything else waits),
	// which is the single place for the message gates - the cache
	// path used to drop everything here before it got there
	this.changeListener = mxUtils.bind(this, function(data)
	{
		this.file.stats.msgReceived++;
		this.lastActivity = Date.now();

		if (this.enabled && !this.file.redirectDialogShowing)
		{
			try
			{
				var msg = this.stringToObject(data);

				if (msg != null)
				{
					EditorUi.debug('DrawioFileSync.message', [this], msg, data.length, 'bytes');

					this.handleRemoteMessage(msg);
				}
			}
			catch (e)
			{
				// Checks if file was changed (not while a conflict is
				// being reconciled, which runs its own catchup)
				if (this.isConnected() && !this.file.inConflictState)
				{
					this.fileChangedNotify();
				}
				
				// NOTE: Probably UTF16 in username for join/leave message causing this
//				var len = (data != null) ? data.length : 'null';
//				
//				EditorUi.logError('Protocol Error ' + e.message,
//					null, 'data_' + len + '_file_' + this.file.getHash() +
//					'_client_' + this.clientId);
//				
//				if (window.console != null)
//				{
//					console.log(e);
//				}
			}
		}
	});
};

/**
 * Protocol version to be added to all communcations and diffs to check
 * if a client is out of date and force a refresh. Note that this must
 * be incremented if new messages are added or the format is changed,
 * and also if patch application semantics change such that older
 * clients corrupt shared state: their saves are checksum-valid but
 * wrong, which the file fallback cannot detect (eg. v7: the canonical
 * order rebuild - v6 clients dropped pages under crossing page moves
 * and reverted adopted pages on save).
 * This must be numeric to compare older vs newer protocol versions.
 */
DrawioFileSync.PROTOCOL = 7;

/**
 * Compares two dotted app version strings numerically per segment
 * (missing segments count as zero). Returns a negative, zero or
 * positive number like a comparator, or null if either side is
 * missing or not a dotted number (eg. development builds).
 */
DrawioFileSync.compareAppVersions = function(a, b)
{
	var result = null;

	if (a != null && b != null)
	{
		var pa = String(a).split('.');
		var pb = String(b).split('.');
		result = 0;

		for (var i = 0; i < Math.max(pa.length, pb.length) &&
			result != null; i++)
		{
			var na = (i < pa.length) ? parseInt(pa[i], 10) : 0;
			var nb = (i < pb.length) ? parseInt(pb[i], 10) : 0;

			if (isNaN(na) || isNaN(nb))
			{
				result = null;
			}
			else if (result == 0)
			{
				result = na - nb;
			}
		}
	}

	return result;
};

/**
 * Enables socket connections.
 */
DrawioFileSync.ENABLE_SOCKETS = urlParams['sockets'] != '0';

/**
 * Specifies if the realtime cache alive check was scheduled.
 */
DrawioFileSync.cacheAliveChecked = false;

/**
 * Disables the realtime cache if the cache endpoint is not reachable,
 * eg. on domains that serve embed mode but do not route the cache.
 * Runs at most once per session when the first file starts to sync.
 */
DrawioFileSync.checkCacheAlive = function(ui)
{
	if (!DrawioFileSync.cacheAliveChecked && !mxClient.IS_CHROMEAPP &&
		!EditorUi.isElectronApp && DrawioFile.SYNC == 'auto' &&
		urlParams['local'] != '1' && urlParams['stealth'] != '1' &&
		!ui.isOffline() && Editor.enableRealtimeCache &&
		(!ui.editor.chromeless || ui.editor.editable))
	{
		DrawioFileSync.cacheAliveChecked = true;

		// Switches to sync via sockets if cache is not reachable
		var timeoutThread = window.setTimeout(function()
		{
			Editor.enableRealtimeCache = false;
		}, Editor.cacheTimeout);

		mxUtils.get(EditorUi.cacheUrl + '?alive', function(req)
		{
			Editor.enableRealtimeCache = req.getStatus() >= 200 && req.getStatus() <= 299;
			window.clearTimeout(timeoutThread);
		}, function()
		{
			Editor.enableRealtimeCache = false;
			window.clearTimeout(timeoutThread);
		});
	}
};

//Extends mxEventSource
mxUtils.extend(DrawioFileSync, mxEventSource);

/**
 * Maximum size in bytes for cache values.
 */
DrawioFileSync.prototype.maxCacheEntrySize = 1000000;

/**
 * Maximum size in bytes for fast sync messages via Pusher.
 * Use 0 to disable message size check. Default is 9KB.
 */
DrawioFileSync.prototype.maxSyncMessageSize = 9000;

/**
 * Delay for fast sync message sending in ms. Larger
 * values help to group sending out changes, smaller
 * values reduce latency.
 */
DrawioFileSync.prototype.syncSendMessageDelay = 300;

/**
 * Delay for received sync message processing in ms.
 * Larger values help to sort and merge messages,
 * smaller values reduce latency.
 */
DrawioFileSync.prototype.syncReceiveMessageDelay = 50;

/**
 * Inactivity time to undo remote changes that have not been saved
 * to the file. Larger values give time to save, smaller values
 * require less inactivity time by the user. (Conflict handling
 * for a local and remote save takes around 15 seconds.)
 */
DrawioFileSync.prototype.cleanupDelay = 15000;

/**
 * Grace period for content that arrived as a live diff. Such content
 * is in the visible pages but reaches the own pages only with its
 * sender's next save, and the cleanup converges the screen to the own
 * pages - so without a grace period it is reverted on screen until
 * that save arrives (measured: a collaborator's colours came, went and
 * came back). Live content is therefore HELD for this long and only
 * dropped once its sender demonstrably never saved it, which is also
 * what expels content that no collaborator ever confirms.
 */
DrawioFileSync.prototype.remoteGraceDelay = 60000;

/**
 * Counter for local message IDs.
 */
DrawioFileSync.prototype.syncChangeCounter = 0;

/**
 * Specifies if notifications should be sent and received for changes.
 */
 DrawioFileSync.prototype.enabled = true;

/**
 * Holds the channel ID for sending and receiving change notifications.
 */
DrawioFileSync.prototype.channelId = null;

/**
 * Holds the channel ID for sending and receiving change notifications.
 */
DrawioFileSync.prototype.channel = null;

/**
 * Consecutive catchup attempts of the conflict episode that is being
 * reconciled. Reset by a confirmed save (DrawioFile.fileSaved) and by
 * the timeout below, never by a catchup that found nothing to do.
 */
DrawioFileSync.prototype.catchupRetryCount = 0;

/**
 * Number of catchup attempts fileConflict makes before it reports a
 * timeout to the caller. Integrations lower it (eg. the Confluence
 * Cloud plugin uses 12).
 */
DrawioFileSync.prototype.maxCatchupRetries = 15;

/**
 * Specifies if descriptor change events should be ignored.
 */
DrawioFileSync.prototype.maxCacheReadyRetries = 1;

/**
 * Specifies if descriptor change events should be ignored.
 */
DrawioFileSync.prototype.cacheReadyDelay = 700;

/**
 * Specifies if descriptor change events should be ignored.
 */
DrawioFileSync.prototype.maxOptimisticRetries = 6;

/**
 * Inactivity timeout is 30 minutes.
 */
DrawioFileSync.prototype.inactivityTimeoutSeconds = 1800;

/**
 * Specifies if notifications should be sent and received for changes.
 */
DrawioFileSync.prototype.lastActivity = null;

/**
 * Adds all listeners.
 */
DrawioFileSync.prototype.start = function()
{
	DrawioFileSync.checkCacheAlive(this.ui);

	if (this.channelId == null)
	{
		this.channelId = this.file.getChannelId();
	}
	
	if (this.key == null)
	{
		this.key = this.file.getChannelKey();
	}

	// Keyed channels must encrypt, so realtime is never started when the
	// CSPRNG that CryptoJS needs for the KDF salt is unreachable
	if (!this.isEncryptionAvailable())
	{
		return;
	}

	var updateStatus = false;

	if (this.file.isPolling())
	{
		if (document.visibilityState != 'hidden')
		{
			if (this.polling == null)
			{
				this.polling = new DrawioFilePolling(this.file, this);
			}

			this.polling.start(this.file.getPollingInterval());
			updateStatus = true;
		}
	}
	else if (this.pusher == null && this.channelId != null &&
		document.visibilityState != 'hidden') 
	{
		this.pusher = this.ui.getPusher();
		
		if (this.pusher != null)
		{
			try
			{
				// Error listener must be installed before trying to create channel
				if (this.pusher.connection != null)
				{
					this.pusher.connection.bind('error', this.pusherErrorListener);
				}
			}
			catch (e)
			{
				// ignore
			}
			
			try
			{
				this.pusher.connect();
				this.channel = this.pusher.subscribe(this.channelId);
				
				EditorUi.debug('DrawioFileSync.start', [this],
					'version', DrawioFileSync.PROTOCOL,
					'rev', this.file.getCurrentRevisionId());
			}
			catch (e)
			{
				// ignore
			}

			this.installListeners();
		}

		updateStatus = true;
	}

	if (updateStatus)
	{
		window.setTimeout(mxUtils.bind(this, function()
		{
			this.lastModified = this.file.getLastModifiedDate();
			this.lastActivity = Date.now();
			this.resetUpdateStatusThread();
			this.updateOnlineState();
			this.updateStatus();
		}, 0));
	}

	this.updateRealtime();
};

/**
 * Draw function for the collaborator list.
 */
DrawioFileSync.prototype.updateRealtime = function()
{
	if (this.isValidState())
	{
		if (this.file.isRealtimeEnabled() &&
			this.file.isRealtimeSupported() &&
			this.isRealtimeActive())
		{
			if (!this.file.isRealtime())
			{
				this.initRealtime();
			}
		}
		else if (this.file.isRealtime())
		{
			this.resetRealtime();
		}

		if (DrawioFileSync.ENABLE_SOCKETS && this.file.isRealtime() &&
			this.p2pCollab == null && this.channelId != null)
		{
			this.p2pCollab = new P2PCollab(this.ui, this, this.channelId);
			this.p2pCollab.joinFile();
		}
		else if (!this.file.isRealtime() && this.p2pCollab != null)
		{
			this.p2pCollab.destroy();
			this.p2pCollab = null;
		}
	}
};

/**
 * Initializes the realtime model.
 */
DrawioFileSync.prototype.initRealtime = function()
{
	this.file.theirPages = this.ui.clonePages(
		this.ui.pages);
	this.file.ownPages = this.ui.clonePages(
		this.ui.pages);

	// Uses an independent copy for the snapshot as the own
	// pages are patched in place, and a shared snapshot
	// absorbs those changes so that sendLocalChanges sends
	// reverts of remote changes with the next local diff
	this.snapshot = this.ui.clonePages(
		this.ui.pages);
	this.snapshotVars = (this.ui.fileNode != null) ?
		this.ui.fileNode.getAttribute('vars') : null;

	// Pages with local changes since the last flush; null means all
	// pages are considered changed (conservative fallback)
	this.dirtyPageIds = Object.create(null);
};

/**
 * Resets the realtime model.
 */
DrawioFileSync.prototype.resetRealtime = function()
{
	var shadow = this.file.getShadowPages();

	if (shadow != null)
	{
		var patch = this.ui.diffPages(
			shadow, this.file.ownPages);
		this.file.patch([patch]);
	}
	
	this.sendLocalChanges();
	this.cleanup();

	this.file.theirPages = null;
	this.file.ownPages = null;
	this.snapshot = null;
	this.snapshotVars = null;
	this.dirtyPageIds = null;
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
	else if (this.polling != null)
	{
		return this.polling.isConnected();
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
	//For RT in embeded mode, we don't need this icon
	if (urlParams['embedRT'] == '1')
	{
		return;
	}

	this.file.fireEvent(new mxEventObject('realtimeStateChanged'));
};

/**
 * Updates the status bar with the latest change.
 */
DrawioFileSync.prototype.updateStatus = function()
{
	if (this.isConnected() && this.lastActivity != null &&
		(Date.now() - this.lastActivity) / 1000 >
		this.inactivityTimeoutSeconds)
	{
		this.stop();
	}

	if (!this.file.isModified() && !this.file.inConflictState &&
		this.file.autosaveThread == null && !this.file.savingFile &&
		!this.file.redirectDialogShowing)
	{
		if (this.enabled && this.ui.statusContainer != null)
		{
			// LATER: Write out modified date for more than 2 weeks ago
			this.ui.updateStatus(mxUtils.bind(this, function()
			{
				var str = this.ui.timeSince(new Date(this.lastModified));
				
				if (str == null)
				{
					str = mxResources.get('lessThanAMinute');
				}
				
				// Consumes and displays last message
				var msg = this.lastMessage;
				this.lastMessage = null;
				
				if (msg != null && msg.length > 40)
				{
					msg = msg.substring(0, 40) + '...';
				}

				var status = this.ui.getNetworkStatus();
				var label = mxResources.get('lastChange', [str]);
				var rev = (this.file.isRevisionHistorySupported()) ? 'data-action="revisionHistory" ' : '';
				var title = mxUtils.htmlEntities(label) + ((this.file.isRevisionHistorySupported()) ?
					' - ' + mxUtils.htmlEntities(mxResources.get('revisionHistory')) : '');

				this.ui.editor.setStatus('<div ' + rev + 'title="' + title + '">' +
					mxUtils.htmlEntities(label) + '</div>' +
					(!this.file.isEditable() ? '<div class="geStatusBox" title="' +
						mxUtils.htmlEntities(mxResources.get('readOnly')) + '">' +
						mxUtils.htmlEntities(mxResources.get('readOnly')) + '</div>' :
					(this.file.isLocked() ? ' <img class="geToolbarButton geAdaptiveAsset" data-action="properties" ' +
						'style="margin-left:4px;flex-shrink:0;" src="' + Editor.lockedImage + '"/>' : '')) +
					(status != null ? '<div class="geStatusBox" title="' + mxUtils.htmlEntities(status) + '">' +
						mxUtils.htmlEntities(status) + '</div>' : '') +
					((msg != null) ? ' <div class="geStatusBox" data-effect="fade" title="' + mxUtils.htmlEntities(msg) + '">' +
						mxUtils.htmlEntities(msg) + '</div>' : ''));
			}));

			this.resetUpdateStatusThread();
		}
		else
		{
			this.ui.updateStatus(mxUtils.bind(this, function()
			{
				this.file.addAllSavedStatus();
			}));
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
			this.updateStatus();
		}), Editor.updateStatusInterval);
	}
};

/**
 * Installs all required listeners for syncing the current file.
 */
DrawioFileSync.prototype.installListeners = function()
{
	if (this.pusher != null && this.pusher.connection != null)
	{
		this.pusher.connection.bind('state_change', this.connectionListener);
	}
    
	if (this.channel != null)
    {
    	this.channel.bind('changed', this.changeListener);
    }
};

/**
 * Adds the listener for automatically saving the diagram for local changes.
 */
DrawioFileSync.prototype.notify = function(msg)
{
	this.file.stats.msgSent++;

	// Skips notifications in polling mode
	if (!this.file.isPolling())
	{
		if (Editor.enableRealtimeCache && !Editor.p2pSyncNotify)
		{
			mxUtils.post(EditorUi.cacheUrl, this.getIdParameters() +
				'&msg=' + encodeURIComponent(this.objectToString(msg)));
		}
		else if (this.p2pCollab != null)
		{
			this.p2pCollab.sendNotification(msg);
		}
	}

	EditorUi.debug('DrawioFileSync.notify', [this],
		'enableRealtimeCache', Editor.enableRealtimeCache,
		'p2pSyncNotify', Editor.p2pSyncNotify,
		'msg', msg);
};

/**
 * 
 */
DrawioFileSync.prototype.sendJoinMessage = function()
{
	if (!this.announced)
	{
		var user = this.file.getCurrentUser();
		var join = {a: 'join'};
		
		if (user != null)
		{
			join.name = encodeURIComponent(user.displayName);
			join.uid = user.id;
		}

		this.notify(this.createMessage(join));
		this.announced = true;
	}
}

/**
 * Applies the protocol and app version gates to an incoming message and
 * dispatches its payload. EVERY transport must enter here: the payload of
 * a client on another protocol is not safe to apply (a v6 save is checksum
 * valid but semantically wrong, which is why the version was bumped), and
 * gating one transport only leaves the class open on the other. Ignored
 * senders degrade to the file fallback so their work is not lost.
 */
DrawioFileSync.prototype.handleRemoteMessage = function(msg)
{
	if (this.enabled && msg != null && !this.file.redirectDialogShowing)
	{
		if (!this.file.inConflictState)
		{
			// Handles protocol mismatch
			if (msg.v > DrawioFileSync.PROTOCOL)
			{
				this.file.redirectToNewApp(mxUtils.bind(this, function()
				{
					// Callback adds cancel option
				}));
			}
			else if (msg.v === DrawioFileSync.PROTOCOL && msg.p != null &&
				!this.isRemoteAppOutdated(msg))
			{
				this.handleMessageData(msg.p, msg.c);
			}
			else if (this.isConnected() || this.isRealtimeConnected())
			{
				// Message from an outdated client whose payload
				// cannot be used so checks the file for changes
				EditorUi.logRealtime('peer-old', {pv: msg.v, av: msg.av,
					why: (msg.v !== DrawioFileSync.PROTOCOL) ? 'proto' :
					((msg.p == null) ? 'payload' : 'app')}, this.file,
					msg.v + '-' + msg.av);
				this.fileChangedNotify();
			}
		}
		else if (msg.v === DrawioFileSync.PROTOCOL && msg.p != null &&
			msg.p.a == 'change' && !this.isRemoteAppOutdated(msg))
		{
			// Live diffs are applied to the visible and the remote pages,
			// which the save conflict does not touch, so they are
			// delivered while a rejected save is being reconciled (412
			// until the catchup's merge: a second or more, and two
			// autosaving clients cross saves all the time). Dropping
			// them here lost the content until the sender's save merged
			// it into the own pages, and the screen then waited for the
			// cleanup behind the grace period: a peer's insert arrived
			// more than a minute late. Everything else keeps waiting for
			// the conflict to resolve, a notify would start a second
			// catchup chain (conflict-window-diff).
			this.handleMessageData(msg.p, msg.c);
		}
	}
};

/**
 * Adds the listener for automatically saving the diagram for local changes.
 */
DrawioFileSync.prototype.handleMessageData = function(data, clientId)
{
	if (data.a == 'desc')
	{
		if (!this.file.savingFile)
		{
			this.reloadDescriptor();
		}
		else
		{
			// Defers the reload as the descriptor must
			// not change while the file is being saved
			this.remoteDescriptorChanged = true;
		}
	}
	else if (data.a == 'comments')
	{
		// Ignores the echo of this client's own notification
		if (clientId == null || clientId != this.clientId)
		{
			this.commentsChanged();
		}
	}
	else if (data.a == 'join' || data.a == 'leave')
	{
		if (data.a == 'join')
		{
			this.file.stats.joined++;
		}
		
		if (data.a == 'leave' && this.ui.isFollowing(clientId))
		{
			this.ui.stopFollowing();
		}

		if (data.name != null)
		{
			this.showMessage(mxResources.get((data.a == 'join') ?
				'userJoined' : 'userLeft', [decodeURIComponent(data.name)]));
		}
	}
	else if (data.a == 'view')
	{
		// Ignores the echo of this client's own notification
		if (clientId == null || clientId != this.clientId)
		{
			if (data.present == 0)
			{
				if (this.ui.isFollowing(clientId))
				{
					this.ui.stopFollowing();
					this.showMessage(mxResources.get('presentationEnded'));
				}
			}
			else
			{
				// A presenter is never moved by another client
				if (!this.ui.isPresenting())
				{
					this.applySharedView(data);

					if (data.present == 1)
					{
						this.ui.startFollowing(clientId);
					}
				}

				if (data.name != null)
				{
					this.showMessage(mxResources.get((data.present == 1) ?
						'userPresenting' : 'userSharedView',
						[decodeURIComponent(data.name)]));
				}
			}
		}
	}
	else if (data.a == 'change')
	{
		this.receiveRemoteChanges(data);
	}
	else if (data.m != null)
	{
		var mod = new Date(data.m);

		// Ignores obsolete messages. Equal times are notified as
		// two saves can share a modified date and the second one
		// would otherwise be missed until the next event
		if (this.lastMessageModified == null ||
			this.lastMessageModified <= mod)
		{
			this.lastMessageModified = mod;
			this.fileChangedNotify(data);
		}
	}
};

/**
 * Returns the wire format for the given page and view.
 */
DrawioFileSync.prototype.createViewData = function(pageId, bounds)
{
	return {pageId: pageId, x: Math.round(bounds.x), y: Math.round(bounds.y),
		w: Math.round(bounds.width), h: Math.round(bounds.height)};
};

/**
 * Moves all collaborators to the given page and view. Pass 1 for present to
 * make them follow this client until 0 is sent, or nothing for a one-off
 * move. Clients that do not know the action ignore the message so the
 * protocol version is not bumped.
 */
DrawioFileSync.prototype.sendSharedViewMessage = function(pageId, bounds, present)
{
	var user = this.file.getCurrentUser();
	var msg = this.createViewData(pageId, bounds);
	msg.a = 'view';

	if (present != null)
	{
		msg.present = present;
	}

	if (user != null && user.displayName != null)
	{
		msg.name = encodeURIComponent(user.displayName);
	}

	this.notify(this.createMessage(msg));
};

/**
 * Sends the current view to the clients that follow this one. Uses the
 * cursor channel as these updates are frequent and may be dropped.
 */
DrawioFileSync.prototype.sendViewUpdate = function(pageId, bounds)
{
	if (this.p2pCollab != null)
	{
		this.p2pCollab.sendMessage('view', this.createViewData(pageId, bounds));
	}
};

/**
 * Moves this client to the view of the client it follows. Ignored for all
 * other clients so a second presenter cannot take over.
 */
DrawioFileSync.prototype.handleViewUpdate = function(data, clientId)
{
	if (this.enabled && !this.file.inConflictState &&
		!this.file.redirectDialogShowing && this.ui.isFollowing(clientId))
	{
		this.applySharedView(data);
	}
};

/**
 * Moves this client to the view in the given message data, which comes from
 * a collaborator so invalid bounds are ignored.
 */
DrawioFileSync.prototype.applySharedView = function(data)
{
	var x = parseFloat(data.x);
	var y = parseFloat(data.y);
	var w = parseFloat(data.w);
	var h = parseFloat(data.h);

	this.ui.showSharedView(data.pageId, (isFinite(x) && isFinite(y) &&
		isFinite(w) && isFinite(h) && w > 0 && h > 0) ?
		new mxRectangle(x, y, w, h) : null);
};

/**
 * Shows the given text as a temporary message in the status bar.
 */
DrawioFileSync.prototype.showMessage = function(text)
{
	this.lastMessage = text;
	this.resetUpdateStatusThread();
	this.updateStatus();
};

/**
 * Delay before the comment cache is refreshed after a remote update.
 */
DrawioFileSync.prototype.commentsChangedDelay = 2000;

/**
 * Notifies collaborators that the comments of the file were changed.
 * Clients that do not know the action ignore the message so the
 * protocol version is not bumped.
 */
DrawioFileSync.prototype.sendCommentsChangedMessage = function()
{
	this.notify(this.createMessage({a: 'comments'}));
};

/**
 * Schedules a refresh of the comment cache after a remote comment update.
 * Debounced as updates often arrive in bursts (eg. resolve adds a reply).
 */
DrawioFileSync.prototype.commentsChanged = function()
{
	if (this.commentsChangedThread != null)
	{
		window.clearTimeout(this.commentsChangedThread);
	}

	this.commentsChangedThread = window.setTimeout(mxUtils.bind(this, function()
	{
		this.commentsChangedThread = null;

		if (this.isValidState())
		{
			this.ui.refreshCommentCache();
		}
	}), this.commentsChangedDelay);
};

/**
 * Adds the listener for automatically saving the diagram for local changes.
 */
DrawioFileSync.prototype.isValidState = function()
{
	return this.ui.getCurrentFile() == this.file &&
		this.file.sync == this && !this.file.invalidChecksum && !this.file.appUpgradeRequired &&
		!this.file.redirectDialogShowing;
};

/**
 * Adds the listener for automatically saving the diagram for local changes.
 */
DrawioFileSync.prototype.optimisticSync = function(count)
{
	if (this.reloadThread == null)
	{
		count = (count != null) ? count : 0;
		
		if (count < this.maxOptimisticRetries)
		{
			this.reloadThread = window.setTimeout(mxUtils.bind(this, function()
			{
				EditorUi.debug('DrawioFileSync.optimisticSync', [this],
					'attempt', count, 'of', this.maxOptimisticRetries,
					'remoteFileChanged', this.remoteFileChanged);

				this.remoteFileChanged = false;

				this.file.getLatestVersion(mxUtils.bind(this, function(latestFile)
				{
					this.reloadThread = null;
				
					if (latestFile != null)
					{
						var source = this.file.getCurrentRevisionId();
						var target = latestFile.getCurrentRevisionId();
						
						// Retries if the file has not changed
						if (source == target)
						{
							this.optimisticSync(count + 1);
						}
						else
						{
							this.file.mergeFile(latestFile, mxUtils.bind(this, function()
							{
								this.lastModified = this.file.getLastModifiedDate();
								this.updateStatus();
							}));
						}
					}
					else
					{
						// Retries so the remote update is not lost
						this.optimisticSync(count + 1);
					}
				}), mxUtils.bind(this, function()
				{
					// Retries so the remote update is not lost
					this.reloadThread = null;
					this.optimisticSync(count + 1);
				}));
			}), (count + 1) * this.file.optimisticSyncDelay);
		}
	}
};

/**
 * Adds the listener for automatically saving the diagram for local changes.
 * Immediate is passed through to scheduleCleanup.
 */
DrawioFileSync.prototype.fileChangedNotify = function(data, immediate)
{
	if (this.isValidState())
	{
		EditorUi.debug('DrawioFileSync.fileChangedNotify', [this],
			'data', [data], 'immediate', immediate,
			'saving', this.file.savingFile);

		// Preserve the retry hint when the notification is deferred by
		// an in-flight save. A later ordinary notice must not erase it.
		if (data != null && data.type == 'optimistic')
		{
			this.remoteOptimisticChange = true;
		}

		if (this.file.savingFile)
		{
			this.remoteFileChanged = true;
		}
		else
		{
			if (this.remoteOptimisticChange)
			{
				this.remoteOptimisticChange = false;
				this.optimisticSync();
			}
			else
			{
				// It's possible that a request never returns so override
				// existing requests and abort them when they are active
				var thread = this.fileChanged(mxUtils.bind(this, function(err)
				{
					this.updateStatus();
				}), mxUtils.bind(this, function(err)
				{
					this.file.handleFileError(err);
				}), mxUtils.bind(this, function()
				{
					return !this.file.savingFile && this.notifyThread != thread;
				}), true, immediate);
			}
		}
	}
};

/**
 * Called after the file was changed locally to mark the file as changed.
 */
DrawioFileSync.prototype.localFileChanged = function(edit, reactive)
{
	if (this.file.isRealtime())
	{
		// True while every pending change since the last flush is a
		// reactive delta (eg. a layout recomputed after an incoming
		// patch), ie. nothing pending was authored by the local user
		this.reactiveOnlyPending = (reactive == true) &&
			(!this.localFileWasChanged || this.reactiveOnlyPending);
		this.localFileWasChanged = true;
		this.markLocalChanges(edit);
		this.scheduleCleanup(true);

		// Reactive deltas keep an armed trigger instead of resetting
		// it so that a sustained message storm cannot postpone the
		// flush on every delivery
		if (reactive != true || this.triggerSendThread == null)
		{
			window.clearTimeout(this.triggerSendThread);

			this.triggerSendThread = window.setTimeout(mxUtils.bind(this, function()
			{
				this.triggerSendThread = null;
				this.sendLocalChanges();
			}), Math.min(this.file.autosaveDelay, this.syncSendMessageDelay - 20));
		}
	}
};

/**
 * Sends the given changes too all collaborators.
 */
DrawioFileSync.prototype.doSendLocalChanges = function(changes)
{
	if (!this.file.ignorePatches(changes))
	{
		var changeId = this.clientId + '.' + (this.syncChangeCounter++);
		var msg = this.createMessage({a: 'change', c: changes,
			id: changeId, t: Date.now()});
		var skipped = false;
		
		if (this.p2pCollab != null)
		{
			this.p2pCollab.sendDiff(msg);
		}
		else if (urlParams['dev'] == '1')
		{
			var data = encodeURIComponent(this.objectToString(msg));

			if (this.maxSyncMessageSize == 0 ||
				data.length < this.maxSyncMessageSize)
			{
				mxUtils.post(EditorUi.cacheUrl, this.getIdParameters() + '&msg=' + data);
			}
			else
			{
				skipped = true;
			}
		}
		else
		{
			skipped = true;
		}

		EditorUi.debug('DrawioFileSync.doSendLocalChanges', [this],
			'changes', changes, skipped ? '(skipped)' : '');
	}
};

/**
 * Handles the given remote changes.
 */
DrawioFileSync.prototype.receiveRemoteChanges = function(data)
{
	// The list itself is remote JSON like everything below it: an
	// object with a huge length property where the array belongs is
	// walked index by index (ignorePatches, applyPatches), which spins
	// the receiver synchronously inside the socket handler - no
	// exception, so the receive latch cannot help. Anything that is
	// not an array carries no intent that could be honored.
	var changes = EditorUi.patchList(data.c);

	if (changes != null && !this.file.ignorePatches(changes))
	{
		if (this.receivedData == null)
		{
			this.receivedData = [data];

			window.setTimeout(mxUtils.bind(this, function()
			{
				// The latch below MUST be cleared even if applying a
				// message throws: a single malformed patch would
				// otherwise stop this client from ever processing live
				// traffic again (every later message queues into an
				// array nothing drains) while it keeps broadcasting
				try
				{
					if (this.ui.getCurrentFile() == this.file && !this.file.appUpgradeRequired)
					{
						// One failing message must not take the rest of its
						// batch down: the loop below aborted at the first
						// exception, so every message batched behind it in
						// the same receive window was lost - silently for
						// the screen, which the save merge and the cleanup
						// caught up with later. The failure is reported and
						// the remaining messages are applied.
						var apply = mxUtils.bind(this, function(changes)
						{
							try
							{
								this.doReceiveRemoteChanges(changes);
							}
							catch (e)
							{
								var user = this.file.getCurrentUser();
								// Hashed like sendErrorReport: no raw user or file ids in logs
								var uid = (user != null) ? this.ui.hashValue(user.id) : 'unknown';

								EditorUi.logError('Error in doReceiveRemoteChanges',
									null, this.file.getMode() + '.' +
									this.ui.hashValue(this.file.getId()), uid, e);
							}
						});

						// Skips additional processing for single change
						if (this.receivedData.length == 1)
						{
							apply(this.receivedData[0].c);
						}
						else
						{
							// Sorts by sender and message counter. The counter
							// follows the last dot and is compared numerically
							// as a string comparison sorts eg. "10" before "9"
							this.receivedData.sort(function(a, b)
							{
								var aId = (typeof a.id === 'string') ? a.id : '';
								var bId = (typeof b.id === 'string') ? b.id : '';
								var aDot = aId.lastIndexOf('.') + 1;
								var bDot = bId.lastIndexOf('.') + 1;
								var aSender = aId.substring(0, aDot);
								var bSender = bId.substring(0, bDot);

								if (aSender < bSender)
								{
									return -1;
								}
								else if (aSender > bSender)
								{
									return 1;
								}
								else
								{
									var aCounter = parseInt(aId.substring(aDot), 10);
									var bCounter = parseInt(bId.substring(bDot), 10);

									if (aCounter < bCounter)
									{
										return -1;
									}
									else if (aCounter > bCounter)
									{
										return 1;
									}
									else
									{
										return 0;
									}
								}
							});

							var lastDiff = null;

							// Processes changes
							for (var i = 0; i < this.receivedData.length; i++)
							{
								// Ignores consecutive duplicates
								var currentDiff = JSON.stringify(this.receivedData[i].c);

								if (currentDiff != lastDiff)
								{
									apply(this.receivedData[i].c);
								}

								lastDiff = currentDiff;
							}
						}
					}
				}
				finally
				{
					this.receivedData = null;
				}
			}), this.syncReceiveMessageDelay);
		}
		else
		{
			this.receivedData.push(data);
		}
	}
};

/**
 * Schedules a new cleanup if not lazy or one is pending
 */
DrawioFileSync.prototype.scheduleCleanup = function(lazy, delayOverride)
{
	// Adds 2 secs per 10MB of file size to allow for remote save with
	// local fastForward before cleanup is triggered
	var sizeDelaySec = Math.min(15, Math.floor(this.file.getSize() / 5000000));
	var delay = (delayOverride != null) ? delayOverride :
		((lazy == false) ? 0 : this.cleanupDelay + sizeDelaySec * 1000);
	var prev = this.cleanupThread;
	
	if (lazy != true || this.cleanupThread != null)
	{
		// An immediate request must not be postponed by ANY later
		// request: under production timers the post-merge events
		// (fileSaved, fileDataUpdated) rescheduled the immediate
		// join-visibility cleanup to the full lazy delay, and every
		// further event kept pushing it - merged content stayed
		// invisible on an idle client indefinitely. Guarding only
		// `lazy == true` left the same hole open for the far more
		// common unlabelled schedulers (a delivered live diff, the
		// post-merge reschedule), which pass undefined or null: they
		// cleared the latch and re-armed at the full delay.
		if (lazy != false && this.cleanupImmediatePending)
		{
			return;
		}

		this.cleanupImmediatePending = (lazy == false);
		window.clearTimeout(this.cleanupThread);

		this.cleanupThread = window.setTimeout(mxUtils.bind(this, function()
		{
			this.cleanupImmediatePending = false;
			this.cleanup(null, mxUtils.bind(this, function(err)
			{
				this.file.handleFileError(err);
			}));
		}), delay);
	}

	EditorUi.debug('DrawioFileSync.scheduleCleanup', [this],
		'lazy', lazy, 'delay', delay, 'prev', prev,
		'thread', this.cleanupThread);
};

/**
 * Removes remote changes that have not been saved and updates
 * the visible document to the state of the own pages.
 */
DrawioFileSync.prototype.cleanup = function(success, error)
{
	var thread = this.cleanupThread;
	window.clearTimeout(this.cleanupThread);
	this.cleanupThread = null;

	// A pending immediate request is served by this very call, whether
	// it came from its own timer or from a caller that runs the cleanup
	// directly (synchronizeFile, resetRealtime): the latch must not
	// outlive it, or every later lazy request returns early and the
	// client stops reconciling until the next immediate one
	this.cleanupImmediatePending = false;

	try
	{
		// Flushes pending local changes first: flushed changes are in
		// the own pages and survive the reconciliation below, so the
		// gate only needs to protect unflushed changes (gating on the
		// modified state starved cleanup while reactive layout deltas
		// kept the file modified, which blocked the adoption of the
		// save-serialized child order that converges crossing reorders)
		this.sendLocalChanges();

		if (this.isValidState() && !this.file.inConflictState &&
			this.file.isRealtime() && !this.localFileWasChanged)
		{
			var patches = [this.ui.diffPages(this.ui.pages,
				this.file.ownPages)];

			// Content delivered as a live diff is on screen but not in
			// the own pages until its sender saves, so converging the
			// screen here would revert it (see remoteGraceDelay). It
			// is held until the grace period has passed, which is long
			// enough for the sender's save to confirm it and short
			// enough to still expel content nobody ever confirms.
			// A purely ADDITIVE patch cannot revert anything - it can
			// only put content the own pages already carry onto a
			// screen that lacks it, which is the join-visibility
			// reconciliation and the opposite of what the grace window
			// protects. Unconfirmed remote content is on the screen but
			// NOT in the own pages, so it always shows up as a remove
			// here: an additive-only patch proves there is none, which
			// is also why clearing the stamp below is then correct.
			if (this.unconfirmedRemoteSince != null &&
				!this.file.ignorePatches(patches) &&
				!this.isAdditiveOnly(patches[0]))
			{
				var age = new Date().getTime() - this.unconfirmedRemoteSince;

				if (age < this.remoteGraceDelay)
				{
					EditorUi.debug('DrawioFileSync.cleanup', [this],
						'holding unconfirmed remote content', 'age', age,
						'grace', this.remoteGraceDelay);
					this.scheduleCleanup(null,
						this.remoteGraceDelay - age);

					if (success != null)
					{
						success();
					}

					return;
				}
			}

			// Release telemetry: remembers whether the patch below can expel
			// live content that no save has confirmed (see cleanup-expel)
			var unconfirmed = this.unconfirmedRemoteSince != null;
			this.unconfirmedRemoteSince = null;
			this.file.theirPages = this.ui.clonePages(
				this.file.ownPages);

			if (urlParams['test'] == '1')
			{
				EditorUi.debug('DrawioFileSync.cleanup',
					[this], 'thread', thread, 'patches', patches,
					'checksum', this.ui.getHashValueForPages(this.ui.pages));
			}

			if (!this.file.ignorePatches(patches))
			{
				// Release telemetry: a non-additive convergence patch removes or
				// rewrites screen state, ie. the came/went class when unconfirmed
				if (!this.isAdditiveOnly(patches[0]))
				{
					EditorUi.logRealtime('cleanup-expel',
						{u: (unconfirmed) ? 1 : 0}, this.file);
				}

				this.file.patch(patches);
			}

			// Replaces the incrementally patched snapshot with a copy
			// of the pages so that drift has a bounded lifetime, except
			// if local changes are pending (eg. reactive changes from
			// the patch above) as they must remain diffable for the
			// scheduled flush to reach own pages and collaborators
			if (!this.localFileWasChanged)
			{
				this.snapshot = this.ui.clonePages(this.ui.pages);
				this.snapshotVars = (this.ui.fileNode != null) ?
					this.ui.fileNode.getAttribute('vars') : null;
				this.dirtyPageIds = Object.create(null);
			}

			if (!document.hidden && urlParams['test'] == '1' &&
				urlParams['checksum'] == '1')
			{
				this.testChecksum();
			}

			if (success != null)
			{
				success();
			}
		}
		else if (success != null)
		{
			success();

			EditorUi.debug('DrawioFileSync.cleanup', [this],
				'modified', this.file.isModified());
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
 * Extracts local changes by diffing remote pages and patched remote pages.
 */
DrawioFileSync.prototype.testChecksum = function()
{
	var localChecksum = this.ui.getHashValueForPages(this.ui.pages);
	var localRev = this.file.getCurrentRevisionId();

	this.file.getLatestVersion(mxUtils.bind(this, function(latestFile)
	{
		if (!document.hidden)
		{
			var remoteChecksum = this.ui.getHashValueForPages(
				latestFile.getShadowPages());
			var descChecksum = latestFile.getDescriptorChecksum(
				latestFile.getDescriptor());
			var remoteRev = latestFile.getCurrentRevisionId();
			
			EditorUi.debug('DrawioFileSync.testChecksum',
				'local', [this.file], 'modified', this.file.isModified(),
				'inConflictState', this.file.inConflictState,
				'autosaveThread', this.file.autosaveThread,
				'savingFile', this.file.savingFile,
				'localFileWasChanged', this.localFileWasChanged,
				'remoteFileChanged', this.remoteFileChanged,
				'cleanup', this.cleanupThread,
				'checksum', localChecksum);
			
			EditorUi.debug('DrawioFileSync.testChecksum',
				'remote', [latestFile],
				'rev', remoteRev == localRev,
				'desc', descChecksum == remoteChecksum,
				'checksum', remoteChecksum);

			if (remoteChecksum != localChecksum)
			{
				EditorUi.debug('DrawioFileSync.testChecksum',
					[this], 'checksums do not match');
				this.ui.alert('Checksums do not match');
			}
			else
			{
				EditorUi.debug('DrawioFileSync.testChecksum',
					[this], 'checksums match');
			}
		}
	}), mxUtils.bind(this, function(err)
	{
		EditorUi.debug('DrawioFileSync.testChecksum',
			[this], 'checksum test error', err);
	}));
};

/**
 * Returns true if the given pages patch only ADDS content, ie. carries
 * no removes and no updates of existing state at any level. Such a
 * patch cannot revert anything a collaborator just sent.
 */
DrawioFileSync.prototype.isAdditiveOnly = function(patch)
{
	if (patch == null)
	{
		return true;
	}

	var removes = EditorUi.patchList(patch[EditorUi.DIFF_REMOVE]);

	if (removes != null && removes.length > 0)
	{
		return false;
	}

	var update = EditorUi.patchMap(patch[EditorUi.DIFF_UPDATE]);

	if (update != null)
	{
		for (var id in update)
		{
			var pageDiff = update[id];

			// Name, view state, view box and order are existing state
			if (pageDiff.name != null || pageDiff.view != null ||
				pageDiff.viewBox != null || pageDiff.previous != null)
			{
				return false;
			}

			var cells = pageDiff.cells;

			if (cells != null)
			{
				var cellRemoves = EditorUi.patchList(
					cells[EditorUi.DIFF_REMOVE]);

				if (cellRemoves != null && cellRemoves.length > 0)
				{
					return false;
				}

				var cellUpdate = EditorUi.patchMap(
					cells[EditorUi.DIFF_UPDATE]);

				if (cellUpdate != null &&
					!mxUtils.isEmptyObject(cellUpdate))
				{
					return false;
				}
			}
		}
	}

	return true;
};

/**
 * Extracts local changes by diffing remote pages and patched remote pages.
 */
DrawioFileSync.prototype.extractLocal = function(patch)
{
	return (mxUtils.isEmptyObject(patch)) ? {} : this.ui.diffPages(
		this.file.theirPages, this.ui.patchPages(this.ui.clonePages(
			this.file.theirPages), patch));
};

/**
 * Extracts remove operations for pages and cells from the given patch.
 */
DrawioFileSync.prototype.extractRemove = function(patch)
{
	var result = {};
	
	if (patch[EditorUi.DIFF_REMOVE] != null)
	{
		result[EditorUi.DIFF_REMOVE] =
			patch[EditorUi.DIFF_REMOVE];
	}

	if (patch[EditorUi.DIFF_UPDATE] != null)
	{
		for (var id in patch[EditorUi.DIFF_UPDATE])
		{
			var diff = patch[EditorUi.DIFF_UPDATE][id];

			if (diff.cells != null && diff.cells
				[EditorUi.DIFF_REMOVE] != null)
			{
				if (result[EditorUi.DIFF_UPDATE] == null)
				{
					result[EditorUi.DIFF_UPDATE] = {};
				}

				result[EditorUi.DIFF_UPDATE][id] = {};
				var temp = result[EditorUi.DIFF_UPDATE][id];
				temp.cells = {};
				temp.cells[EditorUi.DIFF_REMOVE] =
					diff.cells[EditorUi.DIFF_REMOVE];
			}
		}
	}

	return result;
};

/**
 * Returns a copy of the given pending patch without cell and page
 * insert entries, except for cells and pages that are removed by the
 * given patches. The pending patch is diffed against the own pages, so
 * the cells of its insert entries exist in the target model and the
 * inserts are never applied, but their previous references would take
 * part in restoring the child order and scramble the order of
 * colliding inserts merged from the given patches. Pending page insert
 * entries collide with the local copy of the page as well, but
 * insertPage merges colliding entries, so re-asserting them would
 * merge the stale local copy of an adopted page back over the applied
 * save patches. Inserts of cells and pages removed by the patches are
 * kept so that pending local copies are restored like in the visible
 * document (local change wins over remote remove).
 */
DrawioFileSync.prototype.stripPendingInserts = function(own, patches)
{
	var result = own;

	if (own != null && (own[EditorUi.DIFF_UPDATE] != null ||
		own[EditorUi.DIFF_INSERT] != null))
	{
		// Null prototypes as the lookups are keyed by remote IDs
		var removedPages = Object.create(null);
		var removed = Object.create(null);

		for (var i = 0; i < patches.length; i++)
		{
			if (patches[i] != null)
			{
				// These patches come off the wire, so every list and map
				// is normalized as everywhere else: a string where an
				// array belongs would be iterated CHARACTER by
				// character and every character would count as a
				// removed id
				var pageRemoves = EditorUi.patchList(
					patches[i][EditorUi.DIFF_REMOVE]);

				if (pageRemoves != null)
				{
					for (var j = 0; j < pageRemoves.length; j++)
					{
						removedPages[pageRemoves[j]] = true;
					}
				}

				var update = EditorUi.patchMap(
					patches[i][EditorUi.DIFF_UPDATE]);

				if (update != null)
				{
					for (var id in update)
					{
						var cells = update[id].cells;
						var cellRemoves = (cells != null) ?
							EditorUi.patchList(cells[EditorUi.DIFF_REMOVE]) :
							null;

						if (cellRemoves != null)
						{
							for (var j = 0; j < cellRemoves.length; j++)
							{
								removed[cellRemoves[j]] = true;
							}
						}
					}
				}
			}
		}

		if (own[EditorUi.DIFF_INSERT] != null)
		{
			var pageInserts = [];

			for (var i = 0; i < own[EditorUi.DIFF_INSERT].length; i++)
			{
				var entry = own[EditorUi.DIFF_INSERT][i];

				if (entry != null && entry.id != null &&
					removedPages[entry.id])
				{
					pageInserts.push(entry);
				}
			}

			if (pageInserts.length < own[EditorUi.DIFF_INSERT].length)
			{
				result = {};

				for (var key in own)
				{
					result[key] = own[key];
				}

				if (pageInserts.length > 0)
				{
					result[EditorUi.DIFF_INSERT] = pageInserts;
				}
				else
				{
					delete result[EditorUi.DIFF_INSERT];
				}
			}
		}

		var update = null;

		for (var id in own[EditorUi.DIFF_UPDATE])
		{
			var pageDiff = own[EditorUi.DIFF_UPDATE][id];

			if (pageDiff.cells != null &&
				pageDiff.cells[EditorUi.DIFF_INSERT] != null)
			{
				var inserts = [];

				for (var i = 0; i < pageDiff.cells[EditorUi.DIFF_INSERT].length; i++)
				{
					var entry = pageDiff.cells[EditorUi.DIFF_INSERT][i];

					if (entry != null && entry.id != null && removed[entry.id])
					{
						inserts.push(entry);
					}
				}

				if (inserts.length < pageDiff.cells[EditorUi.DIFF_INSERT].length)
				{
					// Copies the modified levels and shares the rest so
					// that the input patch is not changed
					if (update == null)
					{
						update = Object.create(null);

						for (var pageId in own[EditorUi.DIFF_UPDATE])
						{
							update[pageId] = own[EditorUi.DIFF_UPDATE][pageId];
						}

						// Copies from result so a page insert strip
						// above is not discarded
						var copy = {};

						for (var key in result)
						{
							copy[key] = result[key];
						}

						copy[EditorUi.DIFF_UPDATE] = update;
						result = copy;
					}

					var cells = {};

					for (var key in pageDiff.cells)
					{
						cells[key] = pageDiff.cells[key];
					}

					if (inserts.length > 0)
					{
						cells[EditorUi.DIFF_INSERT] = inserts;
					}
					else
					{
						delete cells[EditorUi.DIFF_INSERT];
					}

					var temp = {};

					for (var key in pageDiff)
					{
						temp[key] = pageDiff[key];
					}

					temp.cells = cells;
					update[id] = temp;
				}
			}
		}
	}

	return result;
};

/**
 * Extracts pending cell updates hidden inside an adopted page insert.
 * The remote copy identifies the locally changed fields; a field that
 * already differs on screen has a newer live value and must not be
 * reasserted. Keep these updates separate from the page insert so the
 * incoming save can still merge the rest of the page and its order.
 * Unlike the cell-insert veto, this also works during disconnected file
 * catchup: unchanged stale fields do not differ from the remote copy.
 */
DrawioFileSync.prototype.getPendingPageUpdates = function(own)
{
	var result = {};
	var inserted = (own != null) ? own[EditorUi.DIFF_INSERT] : null;

	if (inserted != null)
	{
		var update = Object.create(null);

		for (var i = 0; i < inserted.length; i++)
		{
			var id = inserted[i].id;
			var ownPage = this.ui.getPageById(id, this.file.ownPages);
			var theirPage = this.ui.getPageById(id, this.file.theirPages);
			var uiPage = this.ui.getPageById(id);

			if (ownPage != null && theirPage != null && uiPage != null)
			{
				this.ui.updatePageRoot(ownPage);
				this.ui.updatePageRoot(theirPage);
				this.ui.updatePageRoot(uiPage);
				var pending = this.ui.diffCells(theirPage.root, ownPage.root);
				var changed = this.ui.diffCells(ownPage.root, uiPage.root);
				var newer = changed[EditorUi.DIFF_UPDATE];
				var visible = this.ui.createCellLookup(uiPage.root);
				var cells = Object.create(null);

				for (var cellId in pending[EditorUi.DIFF_UPDATE])
				{
					if (visible[cellId] != null)
					{
						var diff = pending[EditorUi.DIFF_UPDATE][cellId];
						var live = (newer != null) ? newer[cellId] : null;
						var fields = Object.create(null);
						var valueChanged = live != null &&
							(Object.prototype.hasOwnProperty.call(live, 'value') ||
							Object.prototype.hasOwnProperty.call(live, 'xmlValue'));

						for (var key in diff)
						{
							// value and xmlValue are two encodings of one
							// field, so either live change supersedes both.
							if ((live == null ||
								!Object.prototype.hasOwnProperty.call(live, key)) &&
								(!valueChanged || (key != 'value' && key != 'xmlValue')))
							{
								fields[key] = diff[key];
							}
						}

						if (!mxUtils.isEmptyObject(fields))
						{
							cells[cellId] = fields;
						}
					}
				}

				if (!mxUtils.isEmptyObject(cells))
				{
					update[id] = {cells: {}};
					update[id].cells[EditorUi.DIFF_UPDATE] = cells;
				}
			}
		}

		if (!mxUtils.isEmptyObject(update))
		{
			result[EditorUi.DIFF_UPDATE] = update;
		}
	}

	return result;
};

/**
 * Updates the realtime models and saves pending local changes.
 * Immediate is passed through to scheduleCleanup.
 */
DrawioFileSync.prototype.patchRealtime = function(patches, backup, own, immediate)
{
	var all = null;

	if (this.file.isRealtime())
	{
		// Gets pending local removes of remote shapes: a local
		// delete must win over an incoming save that still contains
		// the cell. This is intentionally limited to removes - all
		// other pending local state is re-asserted by the second
		// patch application below, with colliding inserts merged by
		// the save patches and pending insert entries stripped on
		// the cell and page level (see stripPendingInserts).
		all = this.extractRemove(this.ui.diffPages(
			this.file.getShadowPages(), this.ui.pages));
		var local = this.extractRemove(this.extractLocal(all));

		// Cells whose pending local copy equals the visible state
		// carry local edits that were flushed AFTER the incoming
		// save was computed: the colliding insert merge below must
		// skip them so the newer local edits win over the older
		// saved value (edited-later race). Only with connected
		// peers - without live traffic the own pages trivially
		// equal the visible pages and the veto would disable the
		// stale copy merge entirely.
		var veto = null;

		if (own != null && own[EditorUi.DIFF_UPDATE] != null &&
			this.isRealtimeConnected())
		{
			for (var pageId in own[EditorUi.DIFF_UPDATE])
			{
				var pendingCells = own[EditorUi.DIFF_UPDATE][pageId].cells;

				if (pendingCells != null &&
					pendingCells[EditorUi.DIFF_INSERT] != null)
				{
					var ownPage = this.ui.getPageById(
						pageId, this.file.ownPages);
					var uiPage = this.ui.getPageById(pageId);

					if (ownPage != null && uiPage != null)
					{
						var ownModel = new mxGraphModel(ownPage.root);
						var uiModel = (uiPage == this.ui.currentPage) ?
							this.ui.editor.graph.getModel() :
							new mxGraphModel(uiPage.root);

						for (var i = 0; i < pendingCells[
							EditorUi.DIFF_INSERT].length; i++)
						{
							var entry = pendingCells[EditorUi.DIFF_INSERT][i];
							var ownCell = (entry != null && entry.id != null) ?
								ownModel.getCell(entry.id) : null;
							var uiCell = (ownCell != null) ?
								uiModel.getCell(entry.id) : null;

							if (uiCell != null && mxUtils.isEmptyObject(
								this.ui.diffCell(ownCell, uiCell)))
							{
								if (veto == null)
								{
									veto = Object.create(null);
								}

								veto[entry.id] = true;
							}
						}
					}
				}
			}
		}

		// mergeFile supplies the same pending state as its resolver.
		var pageUpdates = this.getPendingPageUpdates(own != null ? own : backup);
		this.ui.realtimeMergeVeto = veto;

		try
		{
			// Applies the incoming changes to the own pages, merging
			// inserts that collide with pending local copies of the
			// same cells (eg. a collaborator adopted and saved unsaved
			// cells from this client, see resolveCrossReferences):
			// ignoring such inserts would keep the stale local copies
			// so that the next local save reverts the remote changes
			this.file.ownPages = this.ui.applyPatches(
				this.file.ownPages, patches, true,
					backup, null, true, true);

			// Applies own and local changes after the incoming changes
			// so that pending local changes win. Pending inserts are
			// dropped unless their cell was removed above: they always
			// collide (the own pages are the base of the pending diff)
			// so they are never applied, but their previous references
			// would take part in restoring the child order and scramble
			// the order established by the merged inserts above.
			var applied = ((own == null) ? [] :
				[this.stripPendingInserts(own, patches)]).concat([pageUpdates, local]);
			this.file.ownPages = this.ui.applyPatches(
				this.file.ownPages, applied, true,
					backup);
		}
		finally
		{
			this.ui.realtimeMergeVeto = null;
		}
		
		// Triggers a file change to save pending local
		// changes or updates the UI and schedules a
		// cleanup with no pending local changes.
		if (!mxUtils.isEmptyObject(local))
		{
			this.file.fileChanged(false);
		}
		else
		{
			this.scheduleCleanup((immediate != null) ?
				false : null);
		}
		
		EditorUi.debug('DrawioFileSync.patchRealtime', [this],
			'patches', patches, 'backup', backup, 'own', own,
			'all', all, 'local', local, 'applied', applied,
			'immediate', immediate);
	}

	// The caller (mergeFile) appends the returned patch to the
	// visible patches so local deletes of remote shapes win on
	// screen. Returning the raw shadow-vs-ui removes broke the
	// offline catch-up: cells missed while disconnected are absent
	// from the visible pages WITHOUT being locally deleted, and the
	// raw removes stripped them right back out of the merge result.
	// The theirPages filter (extractLocal) keeps exactly the locally
	// deleted ones - missed cells never reached theirPages.
	return (all != null) ? local : null;
};

/**
 * Computes and sends the local changes if the file was changed.
 */
DrawioFileSync.prototype.isRealtimeActive = function()
{
	return this.ui.editor.autosave;
};

/**
 * Returns true if the realtime channel has an established session
 * that delivers remote changes to the visible document.
 */
DrawioFileSync.prototype.isRealtimeConnected = function()
{
	return this.p2pCollab != null && this.p2pCollab.isFileJoined() &&
		this.p2pCollab.getState() == 1 /* OPEN */;
};

/**
 * Records the pages affected by the given edit for the dirty page
 * tracking in sendLocalChanges. The literal 'currentPage' marks the
 * current page (view state events carry no edit); an unknown source
 * falls back to marking all pages via a null dirtyPageIds.
 */
DrawioFileSync.prototype.markLocalChanges = function(edit)
{
	if (this.dirtyPageIds != null)
	{
		try
		{
			if (edit == 'currentPage')
			{
				if (this.ui.currentPage != null)
				{
					this.dirtyPageIds[this.ui.currentPage.getId()] = true;
				}
			}
			else if (edit != null && edit.pageId != null)
			{
				// An explicit page for changes that do not belong to
				// the current one (eg. the edge repair, which covers
				// every patched page - a patch is not limited to the
				// page the user happens to be looking at). Wrapped in
				// an object rather than passed as a bare id: a page id
				// comes off the wire and one that reads 'currentPage'
				// would otherwise take the branch above and mark the
				// wrong page dirty
				this.dirtyPageIds[edit.pageId] = true;
			}
			else if (edit != null && edit.changes != null)
			{
				for (var i = 0; i < edit.changes.length &&
					this.dirtyPageIds != null; i++)
				{
					var id = this.getPageIdForChange(edit.changes[i]);

					if (id != null)
					{
						this.dirtyPageIds[id] = true;
					}

					// A child change moving a cell between pages (eg.
					// an undo replay executed on another page) changes
					// BOTH trees: the target page came from the
					// child's root above, the SOURCE page resolves
					// from the previous parent - missing it left the
					// source page's snapshot holding the moved cell
					var change = edit.changes[i];

					if (this.dirtyPageIds != null &&
						change instanceof mxChildChange &&
						change.previous != null)
					{
						var source = change.previous;

						while (source.getParent() != null)
						{
							source = source.getParent();
						}

						var sourcePage = this.getPageForRoot(source);

						if (sourcePage != null &&
							sourcePage.getId() != id)
						{
							this.dirtyPageIds[sourcePage.getId()] = true;
						}
					}
				}
			}
			else
			{
				this.dirtyPageIds = null;
			}
		}
		catch (e)
		{
			this.dirtyPageIds = null;
		}
	}
};

/**
 * Returns the ID of the page affected by the given undoable change,
 * null for changes that need no cell diff (page order and selection),
 * and sets dirtyPageIds to null for changes whose page cannot be
 * determined so that all pages are diffed.
 */
DrawioFileSync.prototype.getPageIdForChange = function(change)
{
	if (change instanceof ChangePage)
	{
		// Checked BEFORE SelectPage, which ChangePage extends - the
		// selection branch below swallowed every page insert and remove,
		// so nothing was marked dirty. Harmless while a page id only
		// ever appeared or vanished (the page arrays are always diffed),
		// but a wholesale replacement (replaceFileData) brings a page of
		// the SAME id back with different content, and its cell diff was
		// skipped. The inserted or removed page is the one to diff; the
		// select target is irrelevant here
		if (change.relatedPage != null)
		{
			return change.relatedPage.getId();
		}
	}
	else if (change instanceof SelectPage || change instanceof MovePage)
	{
		// Page order is derived from the page arrays in diffPages
		// and the selection is not synced
		return null;
	}
	else if (change instanceof RenamePage || change instanceof ChangePageView)
	{
		if (change.page != null)
		{
			return change.page.getId();
		}
	}
	else if (change instanceof ChangePageSetup)
	{
		if (this.ui.currentPage != null)
		{
			return this.ui.currentPage.getId();
		}
	}
	else
	{
		// Resolves the page from the root of the changed cell; uses
		// the previous parent for removed (detached) cells
		var cell = (change.child != null) ? change.child : change.cell;

		while (cell != null && cell.getParent() != null)
		{
			cell = cell.getParent();
		}

		if (cell != null && change.child != null && change.previous != null &&
			this.getPageForRoot(cell) == null)
		{
			cell = change.previous;

			while (cell.getParent() != null)
			{
				cell = cell.getParent();
			}
		}

		var page = (cell != null) ? this.getPageForRoot(cell) : null;

		if (page != null)
		{
			return page.getId();
		}
	}

	this.dirtyPageIds = null;

	return null;
};

/**
 * Returns the page whose root is the given cell.
 */
DrawioFileSync.prototype.getPageForRoot = function(root)
{
	for (var i = 0; i < this.ui.pages.length; i++)
	{
		if (this.ui.pages[i].root == root)
		{
			return this.ui.pages[i];
		}
	}

	return null;
};

/**
 * Disconnects edges from terminal objects that are no longer part of
 * the given page. A local interaction can connect an edge to a cell
 * that a concurrent remote patch has removed (eg. the connection
 * handler holds the target object across the gesture): the resulting
 * dangling reference cannot be represented in diffs or clones, so it
 * would permanently diverge the model copies.
 */
DrawioFileSync.prototype.sanitizePageTerminals = function(page)
{
	if (page.root != null)
	{
		var lookup = Object.create(null);
		// Null prototype: keyed by cell ids from the document
		var repairedIds = Object.create(null);
		var edges = [];

		var index = function(cell)
		{
			if (cell.getId() != null)
			{
				lookup[cell.getId()] = cell;
			}

			if (cell.isEdge())
			{
				edges.push(cell);
			}

			for (var i = 0; i < cell.getChildCount(); i++)
			{
				index(cell.getChildAt(i));
			}
		};

		index(page.root);
		var revalidate = false;

		for (var i = 0; i < edges.length; i++)
		{
			for (var j = 0; j < 2; j++)
			{
				var source = (j == 0);
				var term = edges[i].getTerminal(source);

				if (term != null && term.getId() != null &&
					lookup[term.getId()] != term)
				{
					term.removeEdge(edges[i], source);
					this.ui.disconnectTerminal(edges[i], source, null);
					repairedIds[edges[i].getId()] = true;

					if (page == this.ui.currentPage)
					{
						this.ui.editor.graph.view.invalidate(edges[i]);
					}
				}
				else if (term == null)
				{
					// An end that is neither a terminal nor a point
					// cannot be drawn: the edge silently disappears
					// from the screen while every model copy stays
					// consistent, so no convergence verdict sees it.
					// The exact patch paths must not invent a point
					// (it would break the sender's checksum), so the
					// repair happens here, before the flush, where it
					// is a regular local change that propagates.
					var geo = edges[i].getGeometry();

					if (geo != null && geo.getTerminalPoint(source) == null)
					{
						var other = edges[i].getTerminal(!source);
						var fallback = this.ui.getEdgeEndFallback(
							edges[i], source, other);

						if (fallback != null)
						{
							geo = geo.clone();
							geo.setTerminalPoint(fallback, source);
							edges[i].setGeometry(geo);
							repairedIds[edges[i].getId()] = true;

							if (page == this.ui.currentPage)
							{
								this.ui.editor.graph.view.invalidate(
									edges[i], true, true);
								revalidate = true;
							}
						}
					}
				}
			}
		}

		// Marking a cell invalid does not create its state - without a
		// validation pass the repaired edge stays unrendered until the
		// next unrelated model change (the silent render miss the
		// render-consistency verdict reports as healsOnRevalidate)
		if (revalidate)
		{
			this.ui.editor.graph.view.validate();
		}

		// This repair runs right before the flush diff, so it reaches
		// the same adoption machinery as the one in DrawioFile.patch:
		// an edge that only arrived as an unconfirmed live diff would
		// be pulled into the own pages together with its ancestors and
		// persisted by the next save. The screen keeps the repair, the
		// outgoing diff does not.
		this.file.absorbUnconfirmedRepairs(page, repairedIds,
			!this.file.isEditable());
	}
};

/**
 * Re-sends every local change that no save has confirmed yet. Called
 * when the FIRST other client appears in the roster: while no peer was
 * connected the transport skips outgoing diffs (they have no consumer),
 * but a client joining right after such a skip never learns about those
 * changes - the diff is gone and only the next save would carry it.
 * Two clients loading at the same time hit this reliably, as each
 * roster is confirmed before the other client registers. The selection
 * has always been flushed that way; the document content must not be
 * weaker. The peer has just loaded the saved state, so the unsaved
 * delta is exactly what it is missing.
 */
/**
 * Routes a wholesale LOCAL replacement of the file data (eg. restoring
 * a revision) through the sync layer. replaceFileData rebuilds the
 * visible pages but leaves the sync snapshot at the pre-restore state,
 * so flushing with all pages marked dirty sends the restore delta as a
 * regular local change - own pages and collaborators converge like for
 * any other edit. Without this the restore reached the peers only via
 * the next save's shadow diff while the stale own pages made the next
 * cleanup revert legitimate peer content from the screen.
 */
DrawioFileSync.prototype.fileRestored = function()
{
	if (this.file.isRealtime())
	{
		this.localFileWasChanged = true;
		this.dirtyPageIds = null;
		this.sendLocalChanges();
	}
};

DrawioFileSync.prototype.sendUnconfirmedChanges = function()
{
	try
	{
		if (this.file.isRealtime() && this.isRealtimeActive() &&
			this.file.ownPages != null)
		{
			// Pending local changes first: they must be in the own
			// pages before the delta to the saved state is computed
			this.sendLocalChanges();

			var patch = this.ui.diffPages(
				this.file.getShadowPages(), this.file.ownPages);

			// Resend only this client's pending attribute. Comparing UI
			// vars with shadow would also resend foreign unsaved values.
			if (this.file.pendingFileVars != null)
			{
				patch[EditorUi.DIFF_FILE] = {vars: this.file.pendingFileVars.value};
			}

			if (!this.file.ignorePatches([patch]))
			{
				EditorUi.debug('DrawioFileSync.sendUnconfirmedChanges',
					[this], 'patch', patch);

				this.doSendLocalChanges([{}, patch]);
			}
		}
	}
	catch (e)
	{
		var user = this.file.getCurrentUser();
		// Hashed like sendErrorReport: no raw user or file ids in logs
		var uid = (user != null) ? this.ui.hashValue(user.id) : 'unknown';

		EditorUi.logError('Error in sendUnconfirmedChanges', null,
			this.file.getMode() + '.' + this.ui.hashValue(this.file.getId()), uid, e);
	}
};

/**
 * Computes and sends the local changes if the file was changed.
 */
DrawioFileSync.prototype.sendLocalChanges = function()
{
	try
	{
		if (this.file.isRealtime() && this.localFileWasChanged)
		{
			var dirty = this.dirtyPageIds;

			for (var i = 0; i < this.ui.pages.length; i++)
			{
				if (dirty == null || dirty[this.ui.pages[i].getId()])
				{
					this.sanitizePageTerminals(this.ui.pages[i]);
				}
			}

			var newSnapshot = null;
			var skip = null;
			var patch = null;

			if (dirty != null)
			{
				// Diffs only the pages with recorded local changes so
				// the flush cost is bounded by the changed pages, not
				// the file size
				skip = Object.create(null);

				for (var i = 0; i < this.snapshot.length; i++)
				{
					var id = this.snapshot[i].getId();

					if (!dirty[id])
					{
						skip[id] = true;
					}
				}

				patch = this.ui.diffPages(this.snapshot,
					this.ui.pages, skip);
			}
			else
			{
				// Unknown changes: clones and diffs all pages
				newSnapshot = this.ui.clonePages(this.ui.pages);
				patch = this.ui.diffPages(this.snapshot, newSnapshot);
			}

			this.file.trackLocalFileVars();
			var currentVars = (this.ui.fileNode != null) ?
				this.ui.fileNode.getAttribute('vars') : null;

			if (currentVars != this.snapshotVars)
			{
				patch[EditorUi.DIFF_FILE] = {vars: currentVars};
			}

			this.snapshotVars = currentVars;

			this.file.ownPages = this.ui.patchPages(
				this.file.ownPages, patch, true);

			// Advances the snapshot by cloning the changed pages and
			// reusing the unchanged ones (or the full clone above)
			if (newSnapshot == null)
			{
				newSnapshot = [];
				var lookup = Object.create(null);

				for (var i = 0; i < this.snapshot.length; i++)
				{
					lookup[this.snapshot[i].getId()] = this.snapshot[i];
				}

				for (var i = 0; i < this.ui.pages.length; i++)
				{
					var id = this.ui.pages[i].getId();
					newSnapshot.push((!dirty[id] && lookup[id] != null) ?
						lookup[id] : this.ui.clonePage(this.ui.pages[i]));
				}
			}

			this.snapshot = newSnapshot;
			
			// Creates patch for cross references
			var resolve = this.ui.resolveCrossReferences(
				patch, this.ui.diffPages(this.file.ownPages,
					this.ui.pages, skip));
			
			// Patches own pages to resolve cross references
			this.file.ownPages = this.ui.patchPages(
				this.file.ownPages, resolve, true);
			
			if (this.isRealtimeActive())
			{
				this.doSendLocalChanges([resolve, patch]);
			}

			// Verifies the dirty page tracking covered all local
			// changes, ie. the snapshot must now equal the pages
			if (skip != null && urlParams['test'] == '1')
			{
				var residue = this.ui.diffPages(this.snapshot, this.ui.pages);

				if (!mxUtils.isEmptyObject(residue))
				{
					EditorUi.debug('DrawioFileSync.sendLocalChanges', [this],
						'dirty page tracking missed changes', residue,
						'dirty', dirty);
					this.ui.alert('Dirty page tracking out of sync');
				}
			}

			this.dirtyPageIds = Object.create(null);
		}

		this.localFileWasChanged = false;
		this.reactiveOnlyPending = false;
	}
	catch (e)
	{
		var user = this.file.getCurrentUser();
		// Hashed like sendErrorReport: no raw user or file ids in logs
		var uid = (user != null) ? this.ui.hashValue(user.id) : 'unknown';

		EditorUi.logError('Error in sendLocalChanges', null,
			this.file.getMode() + '.' +
			this.ui.hashValue(this.file.getId()), uid, e);
	}
};

/**
 * Sends the given changes too all collaborators.
 */
DrawioFileSync.prototype.doReceiveRemoteChanges = function(changes)
{
	if (this.file.isRealtime() && this.isRealtimeActive())
	{
		// Flushes pending user edits before the patch moves the diff
		// base. Reactive-only deltas stay pending: the raw snapshot
		// keeps them diffable across incoming patches, and flushing
		// them per delivered message amplifies concurrent layout
		// recomputation into a correction storm (jitter livelock),
		// so they ride the debounced trigger instead
		if (!this.reactiveOnlyPending)
		{
			this.sendLocalChanges();
		}

		// The existing wire pair is [resolve, patch]. A resolve insert
		// only supplies missing cross references: an adopter can send
		// an older copy than the receiver already holds. Actual changes
		// still merge colliding inserts, especially a roster resend
		// ([{}, patch]) carrying edits made during a network drop.
		// Keep the pair in one patch transaction so reactive layouts
		// and the snapshot see the same complete operation. Single
		// patches from direct callers retain their merging behavior.
		var mergeInserts = (changes.length == 2) ? [false, true] : true;
		this.file.patch(changes, null, null, null, mergeInserts);
		this.file.theirPages = this.ui.applyPatches(
			this.file.theirPages, changes, null, null, null, mergeInserts);

		// Starts the grace period for content that is now on screen but
		// not yet in the own pages (see cleanup)
		if (this.unconfirmedRemoteSince == null)
		{
			this.unconfirmedRemoteSince = new Date().getTime();
		}

		this.scheduleCleanup();
		
		EditorUi.debug('DrawioFileSync.doReceiveRemoteChanges',
			[this], 'changes', changes);
	}
};

/**
 * Adds the listener for automatically saving the diagram for local changes.
 * Immediate is passed through to scheduleCleanup.
 */
DrawioFileSync.prototype.merge = function(patches, checksum, desc, success, error, abort, immediate)
{
	try
	{
		this.file.stats.merged++;
		this.lastModified = new Date();
		var target = this.file.getDescriptorRevisionId(desc);
		var ignored = this.file.ignorePatches(patches);
		
		if (!ignored)
		{
			this.sendLocalChanges();
			
			// Computes local changes
			var shadow = this.ui.clonePages(this.file.getShadowPages());
			var changes = (this.file.isModified() &&
				!this.file.isRealtime()) ? this.ui.diffPages(
					shadow, this.ui.pages) : null;
			// A non-editable client cannot have pending own changes:
			// anything in ownPages beyond the shadow is residue (eg.
			// from the revoke retraction window) that no own save can
			// ever heal - re-asserting it would preserve it forever
			var pending = (!this.file.isRealtime() ||
				!this.file.isEditable()) ? null :
				this.ui.diffPages(shadow, this.file.ownPages);
			shadow = this.ui.applyPatches(shadow, patches);
			var current = (checksum == null) ? null :
				this.ui.getHashValueForPages(shadow);
			
			EditorUi.debug('DrawioFileSync.merge', [this], 'patches', patches,
				'changes', changes, 'pending', pending, 'checksum',
				checksum, 'current', current, 'valid', checksum == current,
				'attempt', this.catchupRetryCount, 'of', this.maxCatchupRetries,
				'from', this.file.getCurrentRevisionId(), 'to', target,
				'etag', this.file.getDescriptorEtag(desc),
				'immediate', immediate);
		
			// Compares the checksum
			if (checksum != null && checksum != current)
			{
				// Fallback to full reload with mergeFile
				this.reload(mxUtils.bind(this, function()
				{
					if (success != null)
					{
						success();
					}
				}), mxUtils.bind(this, function()
				{
					if (error != null)
					{
						error();
					}
				}), abort, null, immediate, 'checksum');

				// Abnormal termination
				return;
			}
			else
			{
				// Extracts target vars from patches for shadow
				var targetVars = this.file.getShadowVars();

				for (var i = 0; i < patches.length; i++)
				{
					if (patches[i] != null && patches[i][EditorUi.DIFF_FILE] != null &&
						patches[i][EditorUi.DIFF_FILE].vars !== undefined)
					{
						targetVars = patches[i][EditorUi.DIFF_FILE].vars;
					}
				}

				this.file.setShadowPages(shadow, targetVars);
				this.file.acceptRemoteFileVars(patches);

				// Patches the current document and own pages
				if (this.patchRealtime(patches, null, pending, immediate) == null)
				{
					this.file.patch(patches,
						(DrawioFile.LAST_WRITE_WINS) ?
							changes : null);
				}
				else
				{
					// In realtime mode, file.patch() is not called so
					// file-level changes must be applied separately
					var oldVars = (this.ui.fileNode != null) ?
						this.ui.fileNode.getAttribute('vars') : null;
					this.ui.patchFileNode(patches);
					var newVars = (this.ui.fileNode != null) ?
						this.ui.fileNode.getAttribute('vars') : null;

					if (oldVars != newVars)
					{
						this.ui.editor.graph.refresh();
						this.snapshotVars = newVars;
					}

					// Patches the visible document if the realtime channel
					// is not delivering remote changes (eg. session setup
					// failed) as they otherwise only reach ownPages and
					// stay invisible until cleanup, which is starved while
					// the socket is reconnecting. Uses the diff to the own
					// pages as they contain the merged remote and local
					// changes (sendLocalChanges was called above), so this
					// converges and cannot apply received changes twice.
					if (!this.isRealtimeConnected())
					{
						var visible = [this.ui.diffPages(this.ui.pages,
							this.file.ownPages)];

						if (!this.file.ignorePatches(visible))
						{
							// Aligns remote state as in cleanup
							this.file.theirPages = this.ui.clonePages(
								this.file.ownPages);
							this.file.patch(visible);
						}
					}
					else if (!this.file.isModified() &&
						!this.localFileWasChanged &&
						!mxUtils.isEmptyObject(this.ui.diffPages(
							this.ui.pages, this.file.ownPages)))
					{
						// Being connected NOW says nothing about having
						// been connected WHEN the change was broadcast: a
						// client that joined after a live diff never saw
						// it, so the merge is the first time the content
						// arrives - and it only reaches the own pages.
						// Restricted to a client without pending state of
						// its own: with local or reactive changes in
						// flight the lazy cleanup is the load-bearing
						// choreography (an immediate one races the layout
						// recomputation, see adoption-race).
						// Waiting for the lazy cleanup keeps it invisible
						// for the full cleanup delay (measured: 15s of a
						// stale label right after opening a file someone
						// else is editing). The screen is reconciled
						// through the regular cleanup instead of patching
						// the visible pages here, which would revert live
						// state that is newer than the save.
						this.scheduleCleanup(false);
					}
				}

				// A non-editable client mirrors the merged state
				// wholesale: it has no pending own changes to protect
				// and no save to heal residues with - minimal patches
				// from a diverged base can keep an old order residue
				// alive forever, so the realtime copies adopt the
				// merged shadow exactly (the screen follows via the
				// regular cleanup alignment)
				if (!this.file.isEditable() && this.file.ownPages != null)
				{
					this.file.ownPages = this.ui.clonePages(shadow);
					this.file.theirPages = this.ui.clonePages(shadow);
				}

				// The grace timestamp marks the OLDEST remote content
				// that is on screen but not yet in the own pages. A save
				// that brought all of it in ends the window here, so the
				// next live diff starts a fresh one. Without this the
				// timestamp survives every confirmation and later ages
				// FRESH content out of its hold - the cleanup's
				// convergence pass is the only other place that clears
				// it, and a session with continuous traffic never lets
				// one run (every delivery re-arms the lazy timer).
				if (this.unconfirmedRemoteSince != null &&
					this.file.ownPages != null &&
					mxUtils.isEmptyObject(this.ui.diffPages(
						this.ui.pages, this.file.ownPages)))
				{
					this.unconfirmedRemoteSince = null;
				}

				// Logs successull patch
//				try
//				{
//					var user = this.file.getCurrentUser();
//					var uid = (user != null) ? user.id : 'unknown';
//
//					EditorUi.logEvent({category: 'PATCH-SYNC-FILE-' + this.file.getHash(),
//						action: uid + '-patches-' + patches.length + '-recvd-' +
//						this.file.stats.bytesReceived + '-msgs-' + this.file.stats.msgReceived,
//						label: this.clientId});
//				}
//				catch (e)
//				{
//					// ignore
//				}
			}
		}

		this.file.invalidChecksum = false;
		this.file.inConflictState = false;
		this.file.patchDescriptor(this.file.getDescriptor(), desc);
		
		if (success != null)
		{
			success(true);
		}
	}
	catch (e)
	{
		this.file.inConflictState = true;
		this.file.invalidChecksum = true;
		this.file.descriptorChanged();
		
		if (error != null)
		{
			error(e);
		}
		
		try
		{
			var user = this.file.getCurrentUser();
			// Hashed like sendErrorReport: no raw user or file ids in logs
			var uid = (user != null) ? this.ui.hashValue(user.id) : 'unknown';
			
			EditorUi.logError('Error in merge', null,
				this.file.getMode() + '.' +
				this.ui.hashValue(this.file.getId()), uid, e);
		}
		catch (e2)
		{
			// ignore
		}
	}
};

/**
 * Adds the listener for automatically saving the diagram for local changes.
 * Immediate is passed through to scheduleCleanup.
 */
DrawioFileSync.prototype.fileChanged = function(success, error, abort, lazy, immediate)
{
	var thread = window.setTimeout(mxUtils.bind(this, function()
	{
		if (abort == null || !abort())
		{
			EditorUi.debug('DrawioFileSync.fileChanged', [this],
				'lazy', lazy, 'immediate', immediate,
				'remoteFileChanged', this.remoteFileChanged,
				'valid', this.isValidState());

			if (!this.isValidState())
			{
				if (error != null)
				{
					error();
				}
			}
			else
			{
				this.remoteFileChanged = false;

				this.file.loadPatchDescriptor(mxUtils.bind(this, function(desc)
				{
					if (abort == null || !abort())
					{
						if (!this.isValidState())
						{
							if (error != null)
							{
								error();
							}
						}
						else
						{
							this.catchup(desc, success, error, abort, immediate);
						}
					}
				}), error);
			}
		}
	}), (lazy) ? this.cacheReadyDelay : 0);
	
	this.notifyThread = thread;
	
	return thread;
};

/**
 * Fast-forward to the current editor state.
 */
DrawioFileSync.prototype.fastForward = function(desc)
{
	this.file.patchDescriptor(this.file.getDescriptor(), desc);
	this.file.setShadowPages(this.ui.clonePages(this.ui.pages));

	if (this.file.isRealtime())
	{
		this.file.theirPages = this.ui.clonePages(this.ui.pages);
		this.file.ownPages = this.ui.clonePages(this.ui.pages);

		// clonePages does not clone the needsUpdate flag so it is
		// inherited from the source pages: the cloned node is a copy
		// of the possibly stale source node, so a page with the flag
		// must be re-encoded from the root when the file is saved
		for (var i = 0; i < this.file.ownPages.length; i++)
		{
			if (this.ui.pages[i].needsUpdate)
			{
				this.file.ownPages[i].needsUpdate = true;
			}
		}
	}

	this.snapshotVars = (this.ui.fileNode != null) ?
		this.ui.fileNode.getAttribute('vars') : null;
	this.file.pendingFileVars = null;
	this.file.savingFileVars = null;

	var thread = this.cleanupThread;
	window.clearTimeout(this.cleanupThread);
	this.cleanupThread = null;

	if (urlParams['test'] == '1')
	{
		EditorUi.debug('DrawioFileSync.fastForward',
			[this], 'desc', [desc], 'cleanup', thread, 'checksum',
			this.ui.getHashValueForPages(this.ui.pages));
	}
	
	if (!document.hidden && urlParams['test'] == '1' &&
		urlParams['checksum'] == '1' &&
		this.cleanupThread == null)
	{
		this.testChecksum();
	}
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
			this.file.setDescriptorRevisionId(desc,
				this.file.getCurrentRevisionId());
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
	this.start();
};

/**
 * Adds the listener for automatically saving the diagram for local changes.
 * Immediate is passed through to scheduleCleanup.
 */
DrawioFileSync.prototype.catchup = function(desc, success, error, abort, immediate)
{
	if (desc != null && (abort == null || !abort()))
	{
		var source = this.file.getCurrentRevisionId();
		var target = this.file.getDescriptorRevisionId(desc);
		
		EditorUi.debug('DrawioFileSync.catchup', [this],
			'desc', [desc], 'from', source, 'to', target,
			'immediate', immediate, 'valid',
			this.isValidState());

		if (source == target)
		{
			this.file.patchDescriptor(this.file.getDescriptor(), desc);

			if (urlParams['test'] == '1')
			{
				EditorUi.debug('DrawioFileSync.catchup', [this],
					'up to date', 'cleanup', this.cleanupThread,
					'checksum', this.ui.getHashValueForPages(this.ui.pages));
			}

			if (!document.hidden && urlParams['test'] == '1' &&
				urlParams['checksum'] == '1' &&
				this.cleanupThread == null)
			{
				this.testChecksum();
			}
			
			if (success != null)
			{
				success(true);
			}
		}
		else if (!this.isValidState())
		{
			if (error != null)
			{
				error();
			}
		}
		else
		{
			var checksum = this.file.getDescriptorChecksum(desc);
			var secret = this.file.getDescriptorSecret(desc);
			var noPatches = !Editor.enableRealtimeCache ||
				secret == null || urlParams['lockdown'] == '1';

			// The content checksum excludes page metadata and file vars.
			// Even a clean matching document needs the saved bytes when
			// patches are unavailable, or a metadata-only save is lost.
			if (noPatches)
			{
				this.reload(success, error, abort, null, immediate);
			}
			else
			{
				// Cache entry may not have been uploaded to cache before new
				// file is visible to client so retry once after cache miss
				var cacheReadyRetryCount = 0;
				var failed = false;
				
				var doCatchup = mxUtils.bind(this, function()
				{
					if (abort == null || !abort())
					{
						// Ignores patch if shadow has changed
						if (source != this.file.getCurrentRevisionId())
						{
							if (success != null)
							{
								success(true);
							}
						}
						else if (!this.isValidState())
						{
							if (error != null)
							{
								error();
							}
						}
						else
						{
							this.scheduleCleanup(true);
							var acceptResponse = true;
							
							var timeoutThread = window.setTimeout(mxUtils.bind(this, function()
							{
								acceptResponse = false;
								this.reload(success, error, abort, null, immediate, 'timeout');
							}), this.ui.timeout);
	
							mxUtils.get(EditorUi.cacheUrl + '?id=' + encodeURIComponent(this.channelId) +
								'&from=' + encodeURIComponent(source) + '&to=' + encodeURIComponent(target) +
								((secret != null) ? '&secret=' + encodeURIComponent(secret) : ''),
								mxUtils.bind(this, function(req)
							{
								this.file.stats.bytesReceived += req.getText().length;	
								window.clearTimeout(timeoutThread);
								
								if (acceptResponse && (abort == null || !abort()))
								{
									// Ignores patch if shadow has changed
									if (source != this.file.getCurrentRevisionId())
									{
										if (success != null)
										{
											success(true);
										}
									}
									else if (!this.isValidState())
									{
										if (error != null)
										{
											error();
										}
									}
									else
									{
										var checksum = null;
										var temp = [];

										EditorUi.debug('DrawioFileSync.doCatchup',
											[this], 'request', [req], 'status', req.getStatus(),
											'cacheReadyRetryCount', cacheReadyRetryCount,
											'maxCacheReadyRetries', this.maxCacheReadyRetries);
										
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
															failed = true;
															temp = [];
															EditorUi.logRealtime('catchup-proto', {pv: value.v,
																av: value.av}, this.file, this.file.getId());
															break;
														}
														else if (value.v === DrawioFileSync.PROTOCOL &&
															value.p != null &&
															!this.isRemoteAppOutdated(value))
														{
															checksum = value.p.checksum;
															temp.push(value.p.patch);
														}
														else
														{
															failed = true;
															temp = [];
															EditorUi.logRealtime('catchup-proto', {pv: value.v,
																av: value.av}, this.file, this.file.getId());
															break;
														}
													}
												}

												EditorUi.debug('DrawioFileSync.doCatchup', [this], 
													'response', [result], 'status',
													(failed ? 'failed' : 'ok'),
													'temp', temp, 'checksum', checksum);
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
												this.merge(temp, checksum, desc,
													success, error, abort, immediate);
											}
											// Retries if cache entry was not yet there
											else if (cacheReadyRetryCount <= this.maxCacheReadyRetries - 1 &&
												!failed && req.getStatus() != 401 && req.getStatus() != 503 &&
												req.getStatus() != 410)
											{
												cacheReadyRetryCount++;
												this.file.stats.cacheMiss++;
												window.setTimeout(doCatchup, (cacheReadyRetryCount + 1) *
													this.cacheReadyDelay);
											}
											else
											{
												this.file.stats.cacheFail++;
												this.reload(success, error, abort, null, immediate, 'cachefail');
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
								}
							}), error);
						}
					}
				});
				
				window.setTimeout(doCatchup, this.cacheReadyDelay);
			}
		}
	}
};

/**
 * Adds the listener for automatically saving the diagram for local changes.
 * Immediate is passed through to scheduleCleanup.
 */
DrawioFileSync.prototype.reload = function(success, error, abort, shadow, immediate, reason)
{
	EditorUi.debug('DrawioFileSync.reload', [this], 'immediate', immediate, 'reason', reason);

	// Release telemetry: a reload with a reason replaces a failed patch path
	if (reason != null)
	{
		EditorUi.logRealtime('reload', {r: reason, hits: this.file.stats.cacheHits,
			miss: this.file.stats.cacheMiss, fail: this.file.stats.cacheFail}, this.file);
	}
		
	this.file.updateFile(mxUtils.bind(this, function()
	{
		this.lastModified = this.file.getLastModifiedDate();
		this.updateStatus();
		this.start();
		
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
	}), abort, shadow, immediate);
};

/**
 * Invokes when the file descriptor was changed.
 */
DrawioFileSync.prototype.descriptorChanged = function(source)
{
	this.lastModified = this.file.getLastModifiedDate();

	if (this.channelId != null && Editor.enableRealtimeCache)
	{
		var msg = this.objectToString(this.createMessage({a: 'desc',
			m: this.lastModified.getTime()}));
		var target = this.file.getCurrentRevisionId();

		// Stores an empty patch with the checksum of the saved state
		// so that clients catching up over this revision apply it as
		// a no-op instead of failing and reloading the file
		var data = this.objectToString(this.createMessage({patch: {},
			checksum: this.ui.getHashValueForPages(this.file.getShadowPages())}));

		mxUtils.post(EditorUi.cacheUrl, this.getIdParameters() +
			'&from=' + encodeURIComponent(source) + '&to=' + encodeURIComponent(target) +
			'&msg=' + encodeURIComponent(msg) + '&data=' + encodeURIComponent(data));
		this.file.stats.bytesSent += data.length;
		this.file.stats.msgSent++;

		EditorUi.debug('DrawioFileSync.descriptorChanged',
			[this], 'from', source, 'to', target);
	}
	
	this.updateStatus();
};

/**
 * Cached result of the CSPRNG probe in isEncryptionAvailable.
 */
DrawioFileSync.encryptionAvailable = null;

/**
 * Returns true if messages for this file can be encrypted.
 *
 * CryptoJS takes the KDF salt for a passphrase key from crypto.getRandomValues and
 * throws when no native CSPRNG is reachable, which an embedding page or a plugin can
 * cause by redefining the global crypto object. Falling back to plaintext is not an
 * option: the receiving peer still holds a channel key, so it would try to decrypt and
 * get garbage, and the payload would reach the cache in the clear. Realtime sync is
 * left off instead. Probed once per session, the result cannot change without a reload.
 */
DrawioFileSync.prototype.isEncryptionAvailable = function()
{
	// Nothing is encrypted without a channel key or without the library
	if (this.key == null || typeof CryptoJS === 'undefined')
	{
		return true;
	}

	if (DrawioFileSync.encryptionAvailable == null)
	{
		try
		{
			CryptoJS.lib.WordArray.random(8);
			DrawioFileSync.encryptionAvailable = true;
		}
		catch (e)
		{
			DrawioFileSync.encryptionAvailable = false;

			// Hashed: no raw file ids in logs
			EditorUi.logError('Error: No CSPRNG for realtime encryption',
				null, this.ui.hashValue(this.file.getId()), null, e);
		}
	}

	return DrawioFileSync.encryptionAvailable;
};

/**
 * Converts the given object to an encrypted string. Returns null if
 * the optional maxLength is exceeded before encryption.
 */
DrawioFileSync.prototype.objectToString = function(obj, maxLength)
{
	var data = JSON.stringify(obj);

	// Wire encoding (since PROTOCOL 7): the JSON is deflated directly
	// (pako encodes the string as UTF-8) - the legacy URI-encoding
	// step expanded every JSON quote and non-ASCII character up to 3x
	// before deflate and dominated encode time. The FILE format
	// (Graph.compress) is unchanged. stringToObject still reads
	// legacy payloads (cache entries written by older clients
	// survive a deploy).
	if (typeof pako !== 'undefined')
	{
		data = btoa(Graph.arrayBufferToString(
			new Uint8Array(pako.deflateRaw(data))));
	}

	// Callers that drop oversized payloads (cache entries above
	// maxCacheEntrySize) stop before encryption: it only grows the
	// data, and the CryptoJS base64 encoder builds a per-character
	// array that fails with a RangeError for very large payloads
	if (maxLength != null && data.length > maxLength)
	{
		return null;
	}

	if (this.key != null && typeof CryptoJS !== 'undefined')
	{
		// Fails closed if the CSPRNG went away after start, rather than
		// sending a message the peer cannot read and the cache can
		if (!this.isEncryptionAvailable())
		{
			throw new Error('No CSPRNG for realtime encryption');
		}

		data = CryptoJS.AES.encrypt(data, this.key).toString();
	}

	return data;
};

/**
 * Converts the given encrypted string to an object.
 */
DrawioFileSync.prototype.stringToObject = function(data)
{
	if (this.key != null && typeof CryptoJS !== 'undefined')
	{
		data = CryptoJS.AES.decrypt(data, this.key).toString(CryptoJS.enc.Utf8);
	}

	if (typeof pako !== 'undefined')
	{
		data = Graph.zapGremlins(pako.inflateRaw(
			Graph.stringToArrayBuffer(atob(data)), {to: 'string'}));

		// Legacy payloads are URI-encoded JSON ('%7B' == '{'), the
		// direct encoding above starts with '{' or '['
		if (data != null && data.charAt(0) == '%')
		{
			data = decodeURIComponent(data);
		}
	}

	return JSON.parse(data);
};

/**
 * Requests a token for the given sec
 */
DrawioFileSync.prototype.createToken = function(secret, success, error)
{
	var acceptResponse = true;
				
	var timeoutThread = window.setTimeout(mxUtils.bind(this, function()
	{
		acceptResponse = false;
		error({code: App.ERROR_TIMEOUT, message: mxResources.get('timeout')});
	}), this.ui.timeout);
	
	mxUtils.get(EditorUi.cacheUrl + '?id=' + encodeURIComponent(this.channelId) +
		'&secret=' + encodeURIComponent(secret), mxUtils.bind(this, function(req)
	{
		window.clearTimeout(timeoutThread);
		
		if (acceptResponse)
		{
			if (req.getStatus() >= 200 && req.getStatus() <= 299)
			{
				success(req.getText());
			}
			else
			{
				error({code: req.getStatus(), message: 'Token Error ' + req.getStatus()});
			}
		}
	}), error);
};

/**
 * Invoked when a save request for a file was sent regardless of the response.
 */
DrawioFileSync.prototype.fileSaving = function()
{
	if (this.file.isOptimisticSync())
	{
		this.notify(this.createMessage({
			m: Date.now(), type: 'optimistic'}));
	}

	EditorUi.debug('DrawioFileSync.fileSaving', [this],
		'optimistic', this.file.isOptimisticSync());
};

/**
 * Invoked when the file data was updated for saving.
 */
DrawioFileSync.prototype.fileDataUpdated = function()
{
	this.scheduleCleanup(true);
	EditorUi.debug('DrawioFileSync.fileDataUpdated', [this]);
};

/**
 * Invoked after a file was saved to add cache entry (which in turn notifies
 * collaborators).
 */
DrawioFileSync.prototype.fileSaved = function(pages, lastDesc, success, error, token, checksum, savedVars)
{
	this.lastModified = this.file.getLastModifiedDate();
	this.resetUpdateStatusThread();

	// Callers with saved bytes pass the actual persisted attribute;
	// preserve the historical fallback for direct integrations.
	if (savedVars === undefined)
	{
		savedVars = (this.ui.fileNode != null) ?
			this.ui.fileNode.getAttribute('vars') : null;
	}

	this.file.confirmFileVars(savedVars);
	
	if (!this.ui.isOffline(true) && !this.file.inConflictState &&
		!this.file.redirectDialogShowing)
	{
		this.start();

		if (this.channelId != null)
		{
			// Computes diff and checksum
			var secret = this.file.getDescriptorSecret(this.file.getDescriptor());
			var msg = this.createMessage({m: this.lastModified.getTime()});
			var source = this.file.getDescriptorRevisionId(lastDesc);
			var target = this.file.getCurrentRevisionId();
			
			if (secret == null || token == null ||
				urlParams['lockdown'] == '1' ||
				!Editor.enableRealtimeCache)
			{
				this.notify(msg);
				
				if (success != null)
				{
					success();
				}
				
				EditorUi.debug('DrawioFileSync.fileSaved', [this],
					'from', source, 'to', target, 'etag',
					this.file.getCurrentEtag());
			}
			else
			{
				var diff = this.ui.diffPages(this.file.getShadowPages(), pages);

				var shadowVars = this.file.getShadowVars();
				if (savedVars != shadowVars)
				{
					diff[EditorUi.DIFF_FILE] = {vars: savedVars};
				}

				var lastSecret = this.file.getDescriptorSecret(lastDesc);
				checksum = (checksum != null) ? checksum : this.ui.getHashValueForPages(pages);
				
				// Data is stored in cache and message is sent to all listeners;
				// payloads above the cache entry limit are dropped before encryption
				var data = this.objectToString(this.createMessage(
					{patch: diff, checksum: checksum}), this.maxCacheEntrySize);
				var dataLength = (data != null) ? data.length : 0;
				this.file.stats.bytesSent += dataLength;
				this.file.stats.msgSent++;
				
				var acceptResponse = true;
							
				var timeoutThread = window.setTimeout(mxUtils.bind(this, function()
				{
					acceptResponse = false;
					error({code: App.ERROR_TIMEOUT, message: mxResources.get('timeout')});
				}), this.ui.timeout);

				mxUtils.post(EditorUi.cacheUrl, this.getIdParameters() +
					'&from=' + encodeURIComponent(source) + '&to=' + encodeURIComponent(target) +
					(!Editor.p2pSyncNotify ? '&msg=' + encodeURIComponent(this.objectToString(msg)) : '') +
					((secret != null) ? '&secret=' + encodeURIComponent(secret) : '') +
					((lastSecret != null) ? '&last-secret=' + encodeURIComponent(lastSecret) : '') +
					((data != null && data.length < this.maxCacheEntrySize) ? '&data=' + encodeURIComponent(data) : '') +
					((token != null) ? '&token=' + encodeURIComponent(token) : ''),
					mxUtils.bind(this, function(req)
				{
					window.clearTimeout(timeoutThread);
					
					if (acceptResponse)
					{
						if (req.getStatus() >= 200 && req.getStatus() <= 299)
						{
							if (Editor.p2pSyncNotify)
							{
								this.notify(msg);
							}

							if (success != null)
							{
								success();
							}
						}
						else
						{
							error({message: mxResources.get('realtimeCollaboration') +
								((req.getStatus() != 0) ? ': ' + req.getStatus() : '')});
						}
					}
				}));
				
				EditorUi.debug('DrawioFileSync.fileSaved', [this],
					'from', source, 'to', target, 'etag',
					this.file.getCurrentEtag(), 'diff', diff,
					dataLength, 'bytes', 'msg', msg,
					'checksum', checksum);
			}
			
			// Logs successull diff
//			try
//			{
//				var user = this.file.getCurrentUser();
//				var uid = (user != null) ? user.id : 'unknown';
//				
//				EditorUi.logEvent({category: 'DIFF-SYNC-FILE-' + this.file.getHash(),
//					action: uid + '-diff-' + data.length + '-sent-' +
//					this.file.stats.bytesSent + '-msgs-' +
//					this.file.stats.msgSent, label: this.clientId});
//			}
//			catch (e)
//			{
//				// ignore
//			}
		}
	}
	
	// Ignores cache response as clients
	// load file if cache entry failed
	this.file.setShadowPages(pages, savedVars);

	// Replaces the incrementally patched snapshot with a copy of
	// the pages so that drift has a bounded lifetime, except if
	// local changes are pending as they must remain diffable
	if (this.file.isRealtime() && !this.localFileWasChanged)
	{
		this.snapshot = this.ui.clonePages(this.ui.pages);
		this.snapshotVars = (this.ui.fileNode != null) ?
			this.ui.fileNode.getAttribute('vars') : null;
		this.dirtyPageIds = Object.create(null);
	}
	this.scheduleCleanup();

	this.flushRemoteDescriptor();
};

/**
 * Handles a descriptor change notification that arrived while the file
 * was being saved. Deferring it is required (the descriptor must not
 * change mid-save), but the deferral used to be picked up on the save
 * SUCCESS path only: a save that failed dropped the notification, and
 * nothing else re-triggers it - the client then works against a
 * descriptor it already knows to be stale until some later save
 * happens to succeed.
 */
DrawioFileSync.prototype.flushRemoteDescriptor = function()
{
	if (this.remoteDescriptorChanged && !this.file.savingFile &&
		!this.file.inConflictState)
	{
		this.remoteDescriptorChanged = false;
		this.reloadDescriptor();
	}
};

/**
 * Replays a file-changed notification that arrived during a save
 * (fileChangedNotify defers it as remoteFileChanged). The success path
 * picks it up in handleFileSuccess; a FAILED save dropped it, the
 * twin of the descriptor case above: the peer's save was never merged,
 * so the own pages lacked its content while the screen showed it as
 * unconfirmed live content, and the cleanup expelled it after the
 * grace period - came, went, and came back only with the client's next
 * successful save (412, catchup). A conflict runs its own catchup.
 */
DrawioFileSync.prototype.flushRemoteFileChanged = function()
{
	if (this.remoteFileChanged && !this.file.savingFile &&
		!this.file.inConflictState)
	{
		this.remoteFileChanged = false;
		this.fileChangedNotify();
	}
};

/**
 * Creates the properties for the file descriptor.
 */
DrawioFileSync.prototype.getIdParameters = function()
{
	var result = 'id=' + this.channelId;
	
	if (this.pusher != null && this.pusher.connection != null &&
		this.pusher.connection.socket_id != null)
	{
		result += '&sid=' + this.pusher.connection.socket_id;
	}
	
	return result;
};

/**
 * Creates the envelope for a sync message. The payload field is named
 * p since PROTOCOL 7 (it was d before): a v6 client checks the
 * protocol version only on the cache channel and hands socket
 * payloads to receiveRemoteChanges and handleMessageData unchecked,
 * so a v7 payload under the old name could be applied with incompatible
 * semantics or corrupted percent text. Without d the old handlers throw
 * and ignore the message. A cache-channel version prompt is possible only
 * after successful decoding; it is not guaranteed and cannot retire old
 * direct-provider writers. See docs/claude/realtime-rollout.md.
 */
DrawioFileSync.prototype.createMessage = function(data)
{
	return {v: DrawioFileSync.PROTOCOL, av: EditorUi.VERSION,
		p: data, c: this.clientId};
};

/**
 * Returns true if the payload of the given message must be ignored
 * because the sending app is older than minRemoteAppVersion. Callers
 * degrade ignored senders to the file fallback so no diffs are
 * silently lost. An unknown or unparsable remote version counts as
 * outdated while a minimum is set.
 */
DrawioFileSync.prototype.isRemoteAppOutdated = function(msg)
{
	var result = false;

	if (this.minRemoteAppVersion != null)
	{
		var delta = DrawioFileSync.compareAppVersions(
			(msg != null) ? msg.av : null, this.minRemoteAppVersion);
		result = delta == null || delta < 0;
	}

	return result;
};

/**
 * Minimum app version required for processing incoming realtime
 * payloads. Null accepts all clients on the current protocol. This is
 * set by the realtime server's admission response and policy updates.
 * The server also enforces the document's floor on open sockets, joins
 * and relays. This receive filter does not govern provider writes.
 */
DrawioFileSync.prototype.minRemoteAppVersion = null;

/**
 * Creates the properties for the file descriptor.
 */
DrawioFileSync.prototype.fileConflict = function(desc, success, error)
{
	this.catchupRetryCount++;

	EditorUi.debug('DrawioFileSync.fileConflict', [this], 'desc', [desc],
		'catchupRetryCount', this.catchupRetryCount,
		'maxCatchupRetries', this.maxCatchupRetries);
	
	if (this.catchupRetryCount < this.maxCatchupRetries)
	{
		this.file.stats.conflicts++;
		
		if (desc != null)
		{
			this.catchup(desc, success, error);
		}
		else
		{
			this.fileChanged(success, error);
		}
	}
	else
	{
		this.file.stats.timeouts++;
		this.catchupRetryCount = 0;
		EditorUi.logRealtime('conflict-timeout', {n: this.maxCatchupRetries,
			conflicts: this.file.stats.conflicts}, this.file);
		
		if (error != null)
		{
			error({code: App.ERROR_TIMEOUT, message: mxResources.get('timeout')});
		}
	}
};

/**
 * Adds the listener for automatically saving the diagram for local changes.
 */
DrawioFileSync.prototype.stop = function()
{
	// Stops the status update interval as it is only restarted
	// while a channel exists, so it would keep running after
	// the file is closed and repaint a stale status line
	if (this.updateStatusThread != null)
	{
		window.clearInterval(this.updateStatusThread);
		this.updateStatusThread = null;
	}

	if (this.pusher != null)
	{
		if (this.pusher.connection != null)
		{
			this.pusher.connection.unbind('state_change', this.connectionListener);
			this.pusher.connection.unbind('error', this.pusherErrorListener);
		}
	
		if (this.channel != null) 
		{
			this.channel.unbind('changed', this.changeListener);
			
			// See https://github.com/pusher/pusher-js/issues/75
			// this.pusher.unsubscribe(this.channelId);
			this.channel = null;
		}
		
		this.pusher.disconnect();
		this.pusher = null;

		if (this.p2pCollab != null)
		{
			this.p2pCollab.destroy();
			this.p2pCollab = null;
		}
		
		EditorUi.debug('DrawioFileSync.stop', [this]);
	}
	else if (this.polling != null)
	{
		this.polling.stop();
		this.polling = null;
	}
	
	this.updateOnlineState();
	this.updateStatus();
};

/**
 * Adds the listener for automatically saving the diagram for local changes.
 */
DrawioFileSync.prototype.destroy = function()
{
	// The leave message ends the presentation for the followers
	this.ui.setPresenting(false);
	this.ui.stopFollowing();

	if (this.channelId != null)
	{
		var user = this.file.getCurrentUser();
		var leave = {a: 'leave'};
		
		if (user != null)
		{
			leave.name = encodeURIComponent(user.displayName);
			leave.uid = user.id;
		}

		this.notify(this.createMessage(leave));
	}

	if (this.commentsChangedThread != null)
	{
		window.clearTimeout(this.commentsChangedThread);
		this.commentsChangedThread = null;
	}

	this.stop();

	if (this.onlineListener != null)
	{
		mxEvent.removeListener(window, 'offline', this.onlineListener);
		mxEvent.removeListener(window, 'online', this.onlineListener);
		this.onlineListener = null;
	}

	if (this.autosaveListener != null)
	{
		this.ui.editor.removeListener(this.autosaveListener);
		this.autosaveListener = null;
	}

	if (this.visibleListener != null)
	{
		mxEvent.removeListener(document, 'visibilitychange', this.visibleListener);
		this.visibleListener = null;
	}
	
	if (this.activityListener != null)
	{
		mxEvent.removeListener(document, (mxClient.IS_POINTER) ? 'pointermove' : 'mousemove', this.activityListener);
		mxEvent.removeListener(document, 'keypress', this.activityListener);
		mxEvent.removeListener(window, 'focus', this.activityListener);
		
		if (!mxClient.IS_POINTER && mxClient.IS_TOUCH)
		{
			mxEvent.removeListener(document, 'touchstart', this.activityListener);
			mxEvent.removeListener(document, 'touchmove', this.activityListener);	
		}
		
		this.activityListener = null;
	}
	
	// This is not needed now as stop already destroyed it
	if (this.p2pCollab != null)
	{
		this.p2pCollab.destroy();
	}
};
