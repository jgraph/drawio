/**
 * Copyright (c) 2006-2018, JGraph Ltd
 * Copyright (c) 2006-2018, Gaudenz Alder
 * 
 * Replaces Google Realtime with a diff sync algorithm.
 * 
 * Key differences to Google Realtime API:
 * 
 * - No presence API (no collaborator list)
 * - Slower updates (must save file first)
 * - No chat / selection via realtime
 * - No session timeout, iframe
 */
FileSync = function(file)
{
	this.ui = file.ui;
	this.file = file;
	
	this.channelId = this.ui.drive.getChannelId(file.desc);
	this.lastModified = new Date(file.desc.modifiedDate);
	this.lastCheckedEtag = this.file.desc.etag;
	
	// Adds debug buttons
	if (urlParams['dev'] == '1' && this.ui.buttonContainer != null)
	{
		this.checkButton = document.createElement('div');
		this.checkButton.className = 'geBtn gePrimaryBtn';
		this.checkButton.style.display = 'inline-block';
		this.checkButton.style.padding = '0 10px 0 10px';
		this.checkButton.style.marginRight = '0px';
		this.checkButton.style.marginTop = (uiTheme != 'min') ? '-4px' : '-2px';
		this.checkButton.style.height = '28px';
		this.checkButton.style.lineHeight = '28px';
		this.checkButton.style.minWidth = '0px';
		this.checkButton.style.cssFloat = 'left';
		
		mxUtils.write(this.checkButton, 'Check');
		
		mxEvent.addListener(this.checkButton, 'click', mxUtils.bind(this, function()
		{
			this.checkState(null, null, true);
		}));
		
		this.ui.buttonContainer.appendChild(this.checkButton);
		
		this.syncButton = document.createElement('div');
		this.syncButton.className = 'geBtn gePrimaryBtn';
		this.syncButton.style.display = 'inline-block';
		this.syncButton.style.padding = '0 10px 0 10px';
		this.syncButton.style.marginLeft = '6px';
		this.syncButton.style.marginRight = '0px';
		this.syncButton.style.borderColor = (this.syncEnabled) ? '#00ff00' : '#ff0000';
		this.syncButton.style.background = this.syncButton.style.borderColor;
		this.syncButton.style.marginTop = (uiTheme != 'min') ? '-4px' : '-2px';
		this.syncButton.style.height = '28px';
		this.syncButton.style.lineHeight = '28px';
		this.syncButton.style.minWidth = '0px';
		this.syncButton.style.cssFloat = 'left';
		
		mxUtils.write(this.syncButton, 'Sync');
		
		mxEvent.addListener(this.syncButton, 'click', mxUtils.bind(this, function()
		{
			this.syncEnabled = !this.syncEnabled;
			this.syncButton.style.borderColor = (this.syncEnabled) ? '#00ff00' : '#ff0000';
			this.syncButton.style.background = this.syncButton.style.borderColor;
			
			if (this.syncEnabled)
			{
				this.ui.editor.setStatus('');
				this.mergeChanges();
				this.updateStatus();
			}

			this.debug('syncEnabled', this.syncEnabled);
		}));
		
		this.ui.buttonContainer.appendChild(this.syncButton);
		
		this.reloadButton = document.createElement('div');
		this.reloadButton.className = 'geBtn gePrimaryBtn';
		this.reloadButton.style.display = 'inline-block';
		this.reloadButton.style.padding = '0 10px 0 10px';
		this.reloadButton.style.marginLeft = '6px';
		this.reloadButton.style.marginRight = '4px';
		this.reloadButton.style.marginTop = (uiTheme != 'min') ? '-4px' : '-2px';
		this.reloadButton.style.height = '28px';
		this.reloadButton.style.lineHeight = '28px';
		this.reloadButton.style.minWidth = '0px';
		this.reloadButton.style.cssFloat = 'left';
		
		mxUtils.write(this.reloadButton, 'Reload');
		
		mxEvent.addListener(this.reloadButton, 'click', mxUtils.bind(this, function()
		{
			this.reload();
		}));
		
		this.ui.buttonContainer.appendChild(this.reloadButton);
	}
};

/**
 * Protocol version to be added to all communcations and diffs to check
 * if a client is out of date and force a refresh. Note that this must
 * be incremented if new Pusher-messages are added that a client must
 * handle but also if the protocol for the merge data changes.
 */
FileSync.PROTOCOL = '1';

/**
 * Number of diffs to store in the file descriptor.
 */
FileSync.prototype.maxDiffs = 29;

/**
 * Expiration of server-side cache in seconds.
 */
FileSync.prototype.cacheExpiry = 300;

/**
 * Maximum size in bytes for cache values.
 */
FileSync.prototype.cacheSize = 1000000;

/**
 * Specifies if notifications should be sent and received for changes.
 */
FileSync.prototype.syncEnabled = true;

/**
 * Maximum number of retries before showing dialog. 
 */
FileSync.prototype.maxConflictRetries = 3;

/**
 * TODO: Check if secure when combined with compression
 */
FileSync.prototype.chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';

/**
 * True if a change event is fired for a remote change.
 */
FileSync.prototype.updateStatusInterval = 10000;

/**
 * Minimum time between consistency checks.
 */
FileSync.prototype.consistencyCheckInterval = (urlParams['dev'] == '1') ? 10000 : 180000;

/**
/**
 * True if a change event is fired for a remote change.
 */
FileSync.prototype.encrypted = urlParams['dev'] != '1';

/**
 * True if a change event is fired for a remote change.
 */
FileSync.prototype.cacheUrl = '/cache';

/**
 * Holds the channel ID for sending and receiving change notifications.
 */
FileSync.prototype.channelId = null;

/**
 * Specifies if notify events should be ignored.
 */
FileSync.prototype.inConflictState = false;

/**
 * Counter for retries after conflict.
 */
FileSync.prototype.conflictRetryCounter = 0;

/**
 * Specifies if notify events should be ignored.
 */
FileSync.prototype.ignoreChanges = false;

/**
 * Specifies if descriptor change events should be ignored.
 */
FileSync.prototype.ignoreDesciptorChanged = false;

/**
 * Adds all listeners.
 */
FileSync.prototype.start = function()
{
	if (this.channelId != null) 
	{
		var pusher = this.ui.getPusher();
		
		if (pusher != null)
		{
			this.channel = pusher.subscribe(this.channelId);
		}
	}

	this.installListeners();
    
	window.setTimeout(mxUtils.bind(this, function()
	{
		this.resetUpdateStatusThread();
		this.updateStatus();
	}, 0));

	this.debug('start', this);
};

/**
 * Blocks merge of remote changes if there are local changes.
 * TODO: Remove of local change replay is fixed.
 */
FileSync.prototype.isMergeEnabled = function()
{
	return true; //DriveFile.SYNC_TYPE == 'realtime' || !this.file.isModified()
};

/**
 * Updates the status bar with the latest change.
 */
FileSync.prototype.updateStatus = function()
{
	if (this.syncEnabled && !this.inConflictState && this.file.autosaveThread == null)
	{
		// LATER: Write out modified date for more than 2 weeks ago
		var str = this.ui.timeSince(new Date(this.lastModified));
		
		if (str == null)
		{
			str = mxResources.get('lessThanAMinute');
		}

		this.ui.editor.setStatus('<div title="'+ mxUtils.htmlEntities(
			mxResources.get('revisionHistory')) + '" style="text-decoration:underline;cursor:pointer;">' +
			mxUtils.htmlEntities(mxResources.get('lastChange', [str]))  + '</div>' +
			(this.file.isEditable() ? '' : '<div class="geStatusAlert" style="margin-left:8px;">' +
			mxUtils.htmlEntities(mxResources.get('readOnly')) + '</div>'));
		var links = (this.ui.statusContainer != null) ? this.ui.statusContainer.getElementsByTagName('div') : null;
		
		if (links.length > 0)
		{
			mxEvent.addListener(links[0], 'click', mxUtils.bind(this, function()
			{
				this.ui.actions.get('revisionHistory').funct();
			}));
		}
		
		this.triggerConsistencyCheck();
	}
};

/**
 * Runs a consistency check with the remote file if needed.
 */
FileSync.prototype.triggerConsistencyCheck = function()
{
	if (this.consistencyCheckInterval != null && !this.inConflictState)
	{
		if (this.lastConsistencyCheck == null)
		{
			this.lastConsistencyCheck = new Date().getTime();
		}
		else if (this.lastCheckedEtag != this.file.desc.etag &&
			new Date().getTime() - this.lastConsistencyCheck > this.consistencyCheckInterval)
		{
			// TODO: Implement consistency check via hashValue
//			this.ui.editor.setStatus('Checking consistency...');
//			
//			this.checkState(null, null, null, mxUtils.bind(this, function(isCompleted)
//			{
//				this.debug('consistency check complete', isCompleted, this.file.desc.etag, new Date());
//				
//				if (isCompleted)
//				{
//					this.lastConsistencyCheck = new Date().getTime();
//					this.lastCheckedEtag = this.file.desc.etag;
//					this.updateStatus();
//				}
//			}), mxUtils.bind(this, function()
//			{
//				this.debug('consistency check failed', this.file.desc.etag, new Date());
//				this.showConflictStatus();
//			}));
		}
	}
};

/**
 * Resets the thread to update the status.
 */
FileSync.prototype.resetUpdateStatusThread = function()
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
FileSync.prototype.installListeners = function()
{
    // Listens to remote model changes
	this.changeListener = mxUtils.bind(this, function(data)
	{
		if (this.syncEnabled)
		{
			try
			{
				var msg = JSON.parse(data);
				
				if (msg != null)
				{
					if (msg.v != FileSync.PROTOCOL)
					{
						this.ui.drive.redirectToNewApp(null, this.file.desc.id);
					}
					else
					{
						// etags in these messages do not have double quotes
						var etag = msg.etag;
						
						if (msg.type == 'desc')
						{
							this.ui.drive.loadDescriptor(this.file.desc.id, mxUtils.bind(this, function(resp)
							{
								console.log('desc changed', etag, resp.etag, this.file.desc.etag);
								
								if (etag != resp.etag)
								{
									// TODO: Descriptor must still be updated
									this.mergeChanges(resp.etag);	
								}
								else if (resp.etag != this.file.desc.etag)
								{
									// Refreshes descriptor
									this.file.desc = resp;
									this.ignoreDesciptorChanged = true;
									this.file.descriptorChanged();
									this.ignoreDesciptorChanged = false;
								}
							}));
						}
						else if (!this.ignoreChanges && etag != this.file.desc.etag)
						{
							console.log('etag changed', data);
							this.mergeChanges(msg.etag);
						}
					}
				}
			}
			catch (e)
			{
				if (window.console != null)
				{
					console.log(e);
				}
			}
		}
	});
    
	if (this.channel != null)
    {
    	this.channel.bind('changed', this.changeListener);
    }
    
    // Sends notifications when descriptor changes
	this.descriptorChangedListener = mxUtils.bind(this, function(sender, evt)
	{
		if (!this.ignoreDesciptorChanged)
		{
			mxUtils.post(this.cacheUrl, 'key=' + this.channelId +
				'&msg=' + encodeURIComponent('{"type":"desc", ' +
				'"etag":' + this.file.desc.etag + ', ' +
				'"v":"' + FileSync.PROTOCOL + '"}'));
	    }
	});
	
    this.file.addListener('descriptorChanged', this.descriptorChangedListener);

    // Listens to online state changes
	this.onlineListener = mxUtils.bind(this, function()
	{
		this.mergeChanges();
	});
    
	mxEvent.addListener(window, 'online', this.onlineListener);
};

/**
 * Halts all timers and shows a conflict status message. The optional error
 * handler is invoked first.
 */
FileSync.prototype.showConflictStatus = function(error)
{
	if (error != null)
	{
		error();
	}
	
	this.ui.spinner.stop();
	this.file.clearAutosave();
	this.ui.editor.setStatus('<div class="geStatusAlert geBlink" style="cursor:pointer;overflow:hidden;">' +
			mxUtils.htmlEntities('File was changed. Click here to synchronise.') +
			' <a href="https://desk.draw.io/support/solutions/articles/16000076743" target="_blank"><img border="0" ' +
			'title="' + mxUtils.htmlEntities(mxResources.get('help')) + '" valign="bottom" src="' +
			Editor.helpImage + '"/></a></div>');
	
	var links = (this.ui.statusContainer != null) ? this.ui.statusContainer.getElementsByTagName('div') : null;
	
	if (links != null && links.length > 0)
	{
		this.inConflictState = true;
		
		mxEvent.addListener(links[0], 'click', mxUtils.bind(this, function(evt)
		{
			if (mxEvent.getSource(evt).nodeName != 'a')
			{
				this.reload();
			}
		}));
	}
	else
	{
		this.reload();
	}
};

/**
 * Gets the global character at the given location.
 */
FileSync.prototype.charAt = function(i)
{
	return this.chars[mxUtils.mod(i, this.chars.length)];
};

/**
 * Gets the character at the given location.
 */
FileSync.prototype.keyAt = function(key, i)
{
	return key.charCodeAt(mxUtils.mod(i, key.length));
};

/**
 * Encrypts the given string using the given key.
 * TODO: Check how secure this is with compression.
 */
FileSync.prototype.encrypt = function(str, key)
{
    var result = [];
    
    for (var i = 0; i < str.length; i++)
    {
    	var index = this.chars.indexOf(str[i]);
    	
    	if (index < 0)
    	{
    		result.push(str[i]);
    	}
    	else
    	{
    		result.push(this.charAt(index + this.keyAt(key, i)));
    	}
    }
    
    return result.join('');
};

/**
 * Decrypts the given string using the given key.
 */
FileSync.prototype.decrypt = function(str, key)
{
    var result = [];
    
    for (var i = 0; i < str.length; i++)
    {
    	var index = this.chars.indexOf(str[i]);
    	
    	if (index < 0)
    	{
    		result.push(str[i]);
    	}
    	else
    	{
    		result.push(this.charAt(index - this.keyAt(key, i)));
    	}
    }
    
    return result.join('');
};

/**
 * Adds the listener for automatically saving the diagram for local changes.
 */
FileSync.prototype.mergeChanges = function(newEtag, success, error)
{
	if (!this.isMergeEnabled())
	{
		this.showConflictStatus();
	}
	else if (newEtag != null)
	{
		var etag = this.file.desc.etag.replace(/"/g,'').replace(/\//g,'_');

	    // Tries to get only the first diff as this is sufficient for most cases
		this.ui.drive.execute(mxUtils.bind(this, function()
		{
			var token = gapi.auth.getToken().access_token;
			var url = 'https://www.googleapis.com/drive/v2/files/' + this.file.desc.id +
				'/properties/diff0?fields=value&access_token=' + token;
			//console.log('diff0 for etags', etag, newEtag);
			
			if (etag == newEtag)
			{
				if (success != null)
				{
					success();
				}
			}
			else
			{
				mxUtils.get(url, mxUtils.bind(this, function(req)
				{
					//console.log('diff0', req.getText());
					var secret = null;
			    	var key = null;
	
			    	// Checks if current etag can be reached using first diff
			    	if (req.getStatus() >= 200 && req.getStatus() <= 299)
			    	{
		    			var obj = JSON.parse(req.getText());
		    		
		    			if (obj.value != null)
		    			{
			    			var tokens = obj.value.split(':');

			    			if (tokens.length > 2 && tokens[1] == etag)
			    			{
			    				secret = tokens[2];
			    				key = tokens[0];
			    			}
		    			}
			    	}

			    	if (key != null && secret != null)
			    	{
			    		this.mergeKeys([key], [secret], newEtag, success, error);
			    	}
			    	else if (req.getStatus() != 404)
			    	{
				    	this.loadProperties(success, error);
			    	}
			    	else
			    	{
			    		this.showConflictStatus(error);
			    	}
				}));
			}
		}));
	}
	else
	{
		this.loadProperties(success, error);
	}
};

/**
 * Adds the listener for automatically saving the diagram for local changes.
 */
FileSync.prototype.mergeKeys = function(keys, secrets, etag, success, error)
{
	//console.log('mergeKeys', keys);
	
	if (!this.isMergeEnabled())
	{
		this.showConflictStatus(error);
	}
	else
	{
		var cells = this.ui.editor.graph.getSelectionCells();
	
		mxUtils.get(this.cacheUrl + '?id=' + encodeURIComponent(this.channelId) +
			'&keys=' + encodeURIComponent(keys.join(';')),
			mxUtils.bind(this, function(req)
		{
			var temp = [];

			if (req.getStatus() >= 200 && req.getStatus() <= 299 &&
				req.getText().length > 0)
			{
				var result = JSON.parse(req.getText());
				//console.log('mergeKeys', keys, result);
				
				try
				{
					for (var i = result.length - 1; i >= 0; i--)
					{
						if (result[i].v != FileSync.PROTOCOL)
						{
							this.ui.drive.redirectToNewApp(error, this.file.desc.id);
							break;
						}
						else if (result[i].data != null)
						{
							var data = result[i].data;
							
							if (data.length == 0)
							{
								temp.push('');
							}
							else
							{
								temp.push(JSON.parse((data.charAt(0) == '{') ?
									data : this.ui.editor.graph.decompress(
									this.decrypt(data, secrets[i]))));
							}
						}
					}
				}
				catch (e)
				{
					temp = [];
				}
			}

			if (temp.length == keys.length && this.isMergeEnabled())
			{
				this.merge(temp, etag, success, error);
				this.ui.editor.graph.restoreSelection(cells);
			}
			else
			{
				this.showConflictStatus(error);
			}
			
	        /** TBD **/
//	        if (debugFileSync)
//			{
//				var temp = this.ui.getFileData();
//				//var local = this.parseFile(temp);
//				console.log("New model:\n----------\n" + mxUtils.getPrettyXml(local),
//					this.ui.editor.graph.model);
//			}
			/** TBD **/
		}));
	}
};

/**
 * Adds the listener for automatically saving the diagram for local changes.
 */
FileSync.prototype.reload = function()
{
	console.log('reload');
};

/**
 * Adds the listener for automatically saving the diagram for local changes.
 */
FileSync.prototype.merge = function(patches, etag, success, error)
{
	var history = this.ui.editor.undoManager.history.slice();
	var nextAdd = this.ui.editor.undoManager.indexOfNextAdd;
	this.ui.editor.graph.container.style.visibility = 'hidden';
	var prev = this.file.changeListenerEnabled;
	this.file.changeListenerEnabled = false;
	
	
	var graph = this.ui.editor.graph;
	var redraw = graph.cellRenderer.redraw;

	// Updates text editor if cell changes during validation
	graph.cellRenderer.redraw = function(state)
    {
        if (state.view.graph.isEditing(state.cell))
        {
            state.view.graph.scrollCellToVisible(state.cell);
        	state.view.graph.cellEditor.resize();
        }
        
        redraw.apply(this, arguments);
    };
	
	if (this.snapshot == null)
	{
		this.snapshot = this.ui.getPagesForNode(mxUtils.parseXml(this.file.initialData).documentElement);
	}
	
	for (var i = 0; i < patches.length; i++)
	{
		this.snapshot = this.ui.patchPages(this.snapshot, patches[i]);
		// FIXME: Check if this has side-effects
		this.ui.pages = this.ui.patchPages(this.ui.pages, patches[i]);
	}
	
	// Checks if current page was removed
	if (this.ui.pages.length > 0 && mxUtils.indexOf(this.ui.pages, this.ui.currentPage) < 0)
	{
		this.ui.selectPage(this.ui.pages[0], true);
	}
	
	// Restores previous state
	graph.cellRenderer.redraw = redraw;
	
	this.file.changeListenerEnabled = prev;
	this.ui.editor.graph.container.style.visibility = '';
	this.ui.editor.graph.sizeDidChange();
	this.ui.updateTabContainer();
	
	// Restores history state
	this.ui.editor.undoManager.history = history;
	this.ui.editor.undoManager.indexOfNextAdd = nextAdd;
	this.ui.editor.undoManager.fireEvent(new mxEventObject(mxEvent.CLEAR));
	
	// Updates the etag in-place
	this.lastModified = new Date();
	this.file.desc.etag = etag;
	console.log('updated etag', patches, etag);
	
	if (success != null)
	{
		success();
	}
};

/**
 * Compares the XML of the local model with the current file.
 */
FileSync.prototype.checkState = function(prev, delta, showDialog, success, error)
{
	var parseFile = mxUtils.bind(this, function(data)
	{
		var node = mxUtils.parseXml(data).documentElement;
		var tmp = this.ui.editor.extractGraphModel(node, true);
		
		if (tmp != null)
		{
			node = tmp;
		}
		
		var diagrams = node.getElementsByTagName('diagram');

		// mxfile contains user agent and must be ignored
		var file = node.ownerDocument.createElement('mxfile');

		for (var i = 0; i < diagrams.length; i++)
		{
			var tmp = this.ui.editor.graph.decompress(
				mxUtils.getTextContent(diagrams[i]));
			
			if (tmp != null && tmp.length > 0)
			{
				var model = mxUtils.parseXml(tmp).documentElement;
				
				for (var j = 0; j < model.attributes.length; j++)
				{
				    var attrib = model.attributes[j];
				    
				    if (mxUtils.indexOf(this.ui.viewStateWhitelist, attrib.name) < 0)
				    {
				    	model.removeAttribute(attrib.name);
				    }
				}
				
				// Dx/dy depend on window size and must be ignored
				model.removeAttribute('dx');
				model.removeAttribute('dy');
				
				var diagram = diagrams[i].cloneNode(false);
				diagram.appendChild(model);
				file.appendChild(diagram);
			}
		}
		
		return file;
	});

	if (!showDialog || this.ui.spinner.spin(document.body, 'Checking...'))
	{
		var temp = this.ui.getFileData(true);
		var local = parseFile(temp);
		
		// Loads content for comparing
		this.ui.drive.executeRequest(gapi.client.drive.files.get({'fileId': this.file.getId(),
			'fields': 'etag,downloadUrl', 'supportsTeamDrives': true}), mxUtils.bind(this, function(resp)
		{
			if (resp != null)
			{
				var etag = this.file.desc.etag.replace(/"/g,'').replace(/\//g,'_');
				var newEtag = resp.etag.replace(/"/g,'').replace(/\//g,'_');
	
				if (etag == newEtag)
				{
					var token = gapi.auth.getToken().access_token;
					var url = resp.downloadUrl + '&access_token=' + token;
		
					this.ui.loadUrl(url, mxUtils.bind(this, function(data)
					{
						this.ui.spinner.stop();
						var remote = parseFile(data);
	
						if (!remote.isEqualNode(local))
						{
					        var data = //'desc:\n' + JSON.stringify(this.file.desc) +
//					        	((delta != null) ? '\n\ndelta:\n' + delta : '') +
//					        	((prev != null) ? '\n\nprevious:\n' +
//					        		mxUtils.getPrettyXml(parseFile(prev)) : '') +
					        	'remote:\n' + mxUtils.getPrettyXml(remote) +
					        	'\n\nlocal:\n' + mxUtils.getPrettyXml(local);

					        if (error != null)
					        {
					        	error();
					        }
					        else
					        {
						        console.error('conflict' + data);
		
					        	if (this.checkButton != null)
					        	{
					        		this.checkButton.style.background = (showDialog) ? '' : 'red';
					        	}
					        	
						        if (showDialog)
						        {
									this.ignoreChanges = true;
									var dlg = new EmbedDialog(this.ui, data, null, null, null,
										'Inconsistent State', 'conflict-' + new Date().getTime() + '.json');
									this.ui.showDialog(dlg.container, 440, 240, true, true, mxUtils.bind(this, function()
									{
										this.ignoreChanges = false;
										this.mergeChanges();
										console.log('client resumed');
									}));
									dlg.init();
						        }
					        }
						}
						else
						{
							//console.log('state checked', remote);
							if (success != null)
					        {
								success(true);
					        }
					        else
					        {
								if (this.checkButton != null)
					        	{
					        		this.checkButton.style.background = '';
					        	}
								
								if (showDialog)
						        {
									this.ui.alert('Consistent');
						        }
					        }
						}
					}));
				}
				else
				{
					this.ui.spinner.stop();
					
					if (success != null)
			        {
						success(false);
			        }
					
					console.log('state not checked due to pending update',
						etag, newEtag, parseFile(this.ui.getFileData()));
				}
			}
			else
			{
				this.ui.spinner.stop();
				
				if (success != null)
		        {
					success(false);
		        }
				console.log('state not checked due to invalid response');
			}
		}));
	}
};

/**
 * Adds the listener for automatically saving the diagram for local changes.
 */
FileSync.prototype.createDiffLookup = function(props)
{
	var diffs = {};
	
	// Generate lookup to iterate in order
	if (props != null)
	{
		for (var i = 0; i < props.length; i++)
		{
			if (props[i].key.substring(0, 4) == 'diff')
			{
				diffs[props[i].key] = props[i].value;
			}
		}
	}
	
	return diffs;
};

/**
 * Adds the listener for automatically saving the diagram for local changes.
 */
FileSync.prototype.findDiffs = function(diffs, etag)
{
	var found = false;
	var secrets = [];
	var keys = [];
	
	// Generate list of keys to reach current etag and secrets
	// to decrypt compressed diffs received from cache
	for (var i = 0; i < this.maxDiffs && !found; i++)
	{
		var diff = diffs['diff' + i];
		
		if (diff != null)
		{
			var tokens = diff.split(':');
			
			if (tokens.length >= 3)
			{
				found = tokens[1] == etag;
				secrets.push(tokens[2]);
				keys.push(tokens[0]);
			}
			else
			{
				break;
			}
		}
	}

	//console.log('findDiffs', diffs, etag, keys, secrets, found);
	
	return (found) ? {keys: keys, secrets: secrets} : null;
};

/**
 * Adds the listener for automatically saving the diagram for local changes.
 */
FileSync.prototype.loadProperties = function(success, error)
{
	if (!this.isMergeEnabled())
	{
		this.showConflictStatus(error);
	}
	else
	{
		this.ui.drive.executeRequest(gapi.client.drive.files.get({'fileId': this.file.getId(),
			'fields': 'etag,properties', 'supportsTeamDrives': true}), mxUtils.bind(this, function(resp)
		{
			if (resp != null)
			{
				var etag = this.file.desc.etag.replace(/"/g,'').replace(/\//g,'_');
				var newEtag = resp.etag.replace(/"/g,'').replace(/\//g,'_');
				
				if (etag != newEtag)
				{
					//console.log('properties loaded', resp, etag, newEtag, success);
	
					var result = (this.channelId != null) ?
						this.findDiffs(this.createDiffLookup(
						resp.properties), etag) : null;
					
					if (result != null)
					{
						this.mergeKeys(result.keys, result.secrets, resp.etag, success, error);
					}
					else
					{
						this.showConflictStatus(error);
					}
				}
				else if (success != null)
				{
					success();
				}
			}
			else if (error != null)
			{
				error();
			}
		}));
	}
};

/**
 * Creates the properties for the file descriptor.
 */
FileSync.prototype.createProperties = function(cacheId, secret)
{
	// Adds property with cache ID, source etag, encryption key and timestamp
	var secs = Math.round(new Date().getTime() / 1000);
	var etag = this.file.desc.etag.replace(/"/g,'').replace(/\//g,'_');
	var props = [{'key': 'diff0', 'value': (cacheId != null) ?
		(cacheId + ':' + etag + ':' + secret + ':' + secs) : null}];
	
	if (this.file.desc.properties != null)
	{
		for (var i = 0; i < this.file.desc.properties.length; i++)
		{
			if (this.file.desc.properties[i].key.substring(0, 4) == 'diff')
			{
				var index = parseInt(this.file.desc.properties[i].key.substring(4)) + 1;
				
				if (index < this.maxDiffs)
				{
					var tokens = this.file.desc.properties[i].value.split(':');
					
					// Removes expired entries or all entries if diff-chain would be broken
					props.push({'key': 'diff' + index, 'value': (tokens.length > 3 &&
						secs - parseInt(tokens[3]) < this.cacheExpiry && cacheId != null) ?
						this.file.desc.properties[i].value : null});
				}
			}
		}
		
		// Creates a sync channel ID if one does not yet exist.
		if (this.channelId == null)
		{
			props.push({'key': 'channel', 'value': Editor.guid()});
		}
	}

	return props;
};

/**
 * Invokes after a file was saved to add cache entry (which in turn notifies
 * collaborators).
 */
FileSync.prototype.fileSaved = function(cacheId, secret, data)
{
	this.resetUpdateStatusThread();
	this.conflictRetryCounter = 0;

//	var chan = this.ui.drive.getChannelId(file.desc);
//	
//	if (this.channelId != chan && chan != null) 
//	{
//		var pusher = this.ui.getPusher();
//		
//		if (pusher != null)
//		{
//			if (this.channel != null)
//			{
//				if (this.changeListener != null)
//				{
//					this.channel.unbind('changed', this.changeListener);
//				}
//				
//				if (this.channelId != null) 
//				{
//					pusher.unsubscribe(this.channelId);
//				}	
//			}
//			
//			console.log('resubscribed to', chan);
//			this.channelId = chan;
//			this.channel = pusher.subscribe(this.channelId);
//			
//			if (this.channel != null)
//		    {
//		    	this.channel.bind('changed', this.changeListener);
//		    }
//		}
//	}
	
	if (this.channel != null)
	{
		if (this.syncEnabled && this.channelId != null)
		{
			var key = this.channelId + ((cacheId != null) ? (':' + cacheId) : '');

			if (this.snapshot == null)
			{
				this.snapshot = this.ui.getPagesForNode(mxUtils.parseXml(this.file.initialData).documentElement);
			}
			
			// Compute delta between initial version and saved version
			var pages = this.ui.getPagesForNode(mxUtils.parseXml(data).documentElement);
			var delta = JSON.stringify(this.ui.diffPages(this.snapshot, pages));
			// TODO: Include hash value for consistency check
			var value = JSON.stringify({v: FileSync.PROTOCOL,
				data: ((this.encrypted) ? this.encrypt(
				this.ui.editor.graph.compress(delta), secret) :
				delta)});
			mxUtils.post(this.cacheUrl, 'key=' + key + ((value.length < this.cacheSize) ?
				'&value=' + encodeURIComponent(value) : '') + '&msg=' +
				encodeURIComponent(JSON.stringify({v: FileSync.PROTOCOL, etag: this.file.desc.etag})));

			this.debug('fileSaved', value.length, 'bytes', 'key', key,
				'filesize', data.length, 'delta', delta, 'etag',
				this.file.desc.etag);
		}
		
		// Triggers autosave
		if (this.file.isModified())
		{
			this.file.fileChanged();
		}

		this.lastModified = new Date(this.file.desc.modifiedDate);
		this.lastCheckedEtag = this.file.desc.etag;
		this.snapshot = pages;
	}
};

/**
 * Creates the properties for the file descriptor.
 */
FileSync.prototype.fileConflict = function(success, error)
{
	//console.log('fileConflict', this.conflictRetryCounter);
	
	// Workaround for broken if-match header (ie same etag results in conflict)
	this.ui.drive.executeRequest(gapi.client.drive.files.get({'fileId': this.file.getId(),
		'fields': 'etag', 'supportsTeamDrives': true}), mxUtils.bind(this, function(resp)
	{
		if (resp != null)
		{
			var etag = this.file.desc.etag.replace(/"/g,'').replace(/\//g,'_');
			var currentEtag = resp.etag.replace(/"/g,'').replace(/\//g,'_');
			this.debug('fileConflict', this.conflictRetryCounter, etag, currentEtag, etag == currentEtag);

			var retry = mxUtils.bind(this, function()
			{
				if (this.file.isModified())
				{
					window.setTimeout(mxUtils.bind(this, function()
					{
						this.file.save(false, success, error)
					}), this.conflictRetryCounter * 800 /* cool off */);
				}
				else if (success != null)
				{
					success();
				}
			});
			
			// Handles special case where etag is stale in drive which means it is processing a save
			if (etag == currentEtag && this.conflictRetryCounter < this.maxConflictRetries)
			{
				this.conflictRetryCounter++;
				retry();
			}
			else if (this.isMergeEnabled() && this.conflictRetryCounter < this.maxConflictRetries)
			{
				this.conflictRetryCounter++;
				this.mergeChanges(null, retry, error);
			}
			else
			{
				this.showConflictStatus(error);
			}
		}
	}));
};

/**
 * Adds the listener for automatically saving the diagram for local changes.
 */
FileSync.prototype.debug = function()
{
	var args = ['FileSync'];
	
	for (var i = 0; i < arguments.length; i++)
    {
		args.push(arguments[i]);
    }
    
	console.log.apply(console, args);
};

/**
 * Adds the listener for automatically saving the diagram for local changes.
 */
FileSync.prototype.destroy = function(unloading)
{
	if (this.changeListener != null && this.channel != null)
	{
		this.channel.unbind('changed', this.changeListener);
		this.changeListener = null;
	}
	
	if ( this.channel != null && this.channelId != null) 
	{
		var pusher = this.ui.getPusher();
		
		if (pusher != null)
		{
			pusher.unsubscribe(this.channelId);
		}
		
		this.channel = null;
	}

	if (this.descriptorChangedListener != null)
	{
		this.file.removeListener(this.descriptorChangedListener);
		this.descriptorChangedListener = null;
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
	
	if (this.checkButton != null && this.checkButton.parentNode != null)
	{
		this.checkButton.parentNode.removeChild(this.checkButton);
		this.checkButton = null;
	}

	if (this.syncButton != null && this.syncButton.parentNode != null)
	{
		this.syncButton.parentNode.removeChild(this.syncButton);
		this.syncButton = null;
	}
	
	if (this.reloadButton != null && this.reloadButton.parentNode != null)
	{
		this.reloadButton.parentNode.removeChild(this.reloadButton);
		this.reloadButton = null;
	}
};
