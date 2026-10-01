/**
 * Copyright (c) 2006-2017, JGraph Holdings Ltd
 * Copyright (c) 2006-2017, draw.io AG
 */
OneDriveFile = function(ui, data, meta, isSP)
{
	// The realtime key is removed from the data so that it never
	// reaches the document, where exports and copies would carry it
	var rt = OneDriveFile.extractRealtimeKey(data, meta);
	DrawioFile.call(this, ui, (rt != null) ? rt.data : data);

	this.meta = meta;
	this.isSP = isSP;
	this.realtimeKey = (rt != null) ? rt.key : null;
};

//Extends mxEventSource
mxUtils.extend(OneDriveFile, DrawioFile);

/**
 * Name of the mxfile attribute that stores the random channel key of the
 * file for realtime collaboration (see getChannelKey). Graph has no custom
 * properties on files in both personal OneDrive and SharePoint, so the key
 * is stored in the file: everyone who can read the file has it. The value
 * is a fingerprint of the file ID, a dot and the key, so that a copy of the
 * file (download, upload, copy in OneDrive) gets its own key.
 */
OneDriveFile.REALTIME_KEY_ATTRIBUTE = 'rtKey';

/**
 * Specifies if a random channel key is added to files without one when
 * they are saved.
 */
OneDriveFile.createRealtimeKeys = true;

/**
 * Returns the start and end index of the mxfile start tag at the beginning of
 * the given data, or null if the data is not an mxfile XML document.
 */
OneDriveFile.getMxfileTag = function(data)
{
	var head = (typeof data === 'string') ? /^\s*(<\?xml[^>]*>\s*)?<mxfile(?=[\s\/>])/.
		exec(data.substring(0, 512)) : null;

	if (head != null)
	{
		var quote = null;

		// Attribute values may contain unescaped '>'
		for (var i = head[0].length; i < data.length; i++)
		{
			var c = data.charAt(i);

			if (quote != null)
			{
				if (c == quote)
				{
					quote = null;
				}
			}
			else if (c == '"' || c == '\'')
			{
				quote = c;
			}
			else if (c == '>')
			{
				return {start: head[0].length - 7, end: i + 1};
			}
		}
	}

	return null;
};

/**
 * Parses the given mxfile start tag and returns the mxfile element without
 * children, or null if the tag cannot be parsed.
 */
OneDriveFile.parseMxfileTag = function(data, tag)
{
	var text = data.substring(tag.start, tag.end);
	var node = mxUtils.parseXml((/\/\s*>$/.test(text)) ?
		text : text + '</mxfile>').documentElement;

	return (node != null && node.nodeName == 'mxfile' &&
		node.getElementsByTagName('parsererror').length == 0) ?
		node : null;
};

/**
 * Returns the given data with the start tag replaced by the given mxfile
 * element without children.
 */
OneDriveFile.replaceMxfileTag = function(data, tag, node)
{
	var text = mxUtils.getXml(node);

	// The element has no children, the tag in the data may have
	if (!/\/\s*>$/.test(data.substring(tag.start, tag.end)))
	{
		text = text.replace(/\/>$/, '>');
	}

	return data.substring(0, tag.start) + text + data.substring(tag.end);
};

/**
 * Returns the fingerprint of the given file ID that binds the stored
 * realtime key to the file.
 */
OneDriveFile.getRealtimeKeyBinding = function(id)
{
	return (id != null && typeof CryptoJS !== 'undefined') ?
		CryptoJS.MD5('realtime-key:' + String(id).toLowerCase()).
		toString().substring(0, 8) : null;
};

/**
 * Returns a new random realtime key or null if no CSPRNG is available.
 */
OneDriveFile.createRealtimeKey = function()
{
	try
	{
		var bytes = new Uint8Array(32);
		window.crypto.getRandomValues(bytes);
		var key = [];

		// Unbiased as the alphabet has 64 characters, a divisor of 256
		for (var i = 0; i < bytes.length; i++)
		{
			key.push(Editor.GUID_ALPHABET.charAt(bytes[i] % Editor.GUID_ALPHABET.length));
		}

		return key.join('');
	}
	catch (e)
	{
		return null;
	}
};

/**
 * Removes the realtime key from the given file data. Returns null if the
 * data has no key, else the data without the key and the key, which is null
 * if the value is invalid or belongs to another file.
 */
OneDriveFile.extractRealtimeKey = function(data, meta)
{
	var result = null;

	try
	{
		var tag = OneDriveFile.getMxfileTag(data);

		if (tag != null && data.substring(tag.start, tag.end).
			indexOf(OneDriveFile.REALTIME_KEY_ATTRIBUTE) > 0)
		{
			var node = OneDriveFile.parseMxfileTag(data, tag);

			if (node != null && node.hasAttribute(OneDriveFile.REALTIME_KEY_ATTRIBUTE))
			{
				var value = node.getAttribute(OneDriveFile.REALTIME_KEY_ATTRIBUTE).split('.');
				node.removeAttribute(OneDriveFile.REALTIME_KEY_ATTRIBUTE);
				result = {data: OneDriveFile.replaceMxfileTag(data, tag, node), key: null};

				if (value.length == 2 && /^[0-9a-zA-Z_-]{22,}$/.test(value[1]) &&
					meta != null && value[0] == OneDriveFile.getRealtimeKeyBinding(
					OneDriveFile.prototype.getIdOf(meta)))
				{
					result.key = value[1];
				}
			}
		}
	}
	catch (e)
	{
		// Keeps the data
		result = null;
	}

	return result;
};

/**
 * Returns the given data with the realtime key of this file for saving it.
 * A file without a key gets a new one, which is used after the save
 * succeeded. SVG, HTML and PNG files keep the legacy key since their data
 * is also published as an image or page.
 */
OneDriveFile.prototype.addRealtimeKey = function(data)
{
	this.savingRealtimeKey = null;

	try
	{
		var tag = OneDriveFile.getMxfileTag(data);
		var binding = (tag != null) ? OneDriveFile.getRealtimeKeyBinding(this.getId()) : null;
		var key = (binding == null) ? null : ((this.realtimeKey != null) ? this.realtimeKey :
			((OneDriveFile.createRealtimeKeys) ? OneDriveFile.createRealtimeKey() : null));
		var node = (key != null) ? OneDriveFile.parseMxfileTag(data, tag) : null;

		if (node != null)
		{
			node.setAttribute(OneDriveFile.REALTIME_KEY_ATTRIBUTE, binding + '.' + key);
			data = OneDriveFile.replaceMxfileTag(data, tag, node);
			this.savingRealtimeKey = key;
		}
	}
	catch (e)
	{
		// Saves without the key
	}

	return data;
};

/**
 * Shorter autosave delay for optimistic sync.
 */
OneDriveFile.prototype.autosaveDelay = 500;

/**
 * Hook for subclassers.
 */
OneDriveFile.prototype.isRealtimeSupported = function()
{
	return true;
};

/**
 * Returns a best effort URL of the file in the OneDrive or SharePoint web
 * interface.
 */
OneDriveFile.prototype.getFileUrl = function()
{
	var url = this.meta.webUrl;
	url = url.substring(0, url.lastIndexOf('/'));
	
	if (this.meta.parentReference != null)
	{
		try
		{
			// Best effort guessing of the web interface URL for the file
			if (this.meta.parentReference.driveType == 'personal')
			{
				url = 'https://onedrive.live.com/?cid=' + encodeURIComponent(this.meta.parentReference.driveId) +
					'&id=' + encodeURIComponent(this.meta.id);
			}
			else if (this.meta.parentReference.driveType == 'documentLibrary')
			{
				var path = this.meta.parentReference.path;
				path = path.substring(path.indexOf('/root:') + 6);
				
				var id = this.meta.webUrl;
				var url = id.substring(0, id.length - path.length - encodeURIComponent(this.meta.name).length - 1); 
				id = id.substring(id.indexOf('/', 8));
				
				url = url + '/Forms/AllItems.aspx?id=' + id + '&parent=' + id.substring(0, id.lastIndexOf('/'));
			}
			else if (this.meta.parentReference.driveType == 'business')
			{
				var url = this.meta['@microsoft.graph.downloadUrl'];
				var idx = url.indexOf('/_layouts/15/download.aspx?');
			
				// Strips protocol
				var id = this.meta.webUrl;
				var parent = id;
				
				id = id.substring(8);
			
				// Gets path and parent path
				id = id.substring(id.indexOf('/'));
				parent = parent.substring(0, parent.lastIndexOf('/'));
				parent = parent.substring(parent.indexOf('/', 8))
				
				url = url.substring(0, idx) + '/_layouts/15/onedrive.aspx?id=' + id + '&parent=' + parent;
			}
		}
		catch (e)
		{
			// ignore
		}
	}

	return url;
};

/**
 * Returns the web URL of the folder of the file.
 */
OneDriveFile.prototype.getFolderUrl = function()
{
	var url = this.meta.webUrl;
	var name = encodeURIComponent(this.meta.name);
	
	if (url.substring(url.length - name.length, url.length) == name)
	{
		url = url.substring(0, url.length - name.length);
	}

	return url;
};

/**
 * Opens the file in the web interface for sharing.
 */
OneDriveFile.prototype.share = function()
{
	this.ui.openLink(this.getFileUrl());
};

/**
 * Returns the ID of the file, which includes the drive ID if available.
 */
OneDriveFile.prototype.getId = function()
{
	return this.getIdOf(this.meta);
};

/**
 * Returns the ID of the parent folder of the file, which includes the drive
 * ID if available.
 */
OneDriveFile.prototype.getParentId = function()
{
	return this.getIdOf(this.meta, true);
};

/**
 * Returns the ID of the given item, prefixed with its drive ID if available.
 * If parent is not null, the ID of the parent folder of the item is
 * returned.
 */
OneDriveFile.prototype.getIdOf = function(itemObj, parent)
{
	//TODO driveId is most probably always there. No need to check if it exists. Also, after some time, the code that check the old id format won't be needed 
	return ((itemObj.parentReference != null && itemObj.parentReference.driveId != null) ? itemObj.parentReference.driveId + '/' : '') +
		((parent != null) ? itemObj.parentReference.id : (itemObj.id + (itemObj.folder && itemObj.folder.isRoot? '/root' : '')));
};

/**
 * Gets the channel ID for sync messages.
 */
OneDriveFile.prototype.getChannelId = function()
{
	return (this.isSP? 'M-' : 'W-') + DrawioFile.prototype.getChannelId.apply(this, arguments);
};

/**
 * Returns the hash of the file, which is M for SharePoint or W for OneDrive
 * followed by the URI-encoded ID.
 */
OneDriveFile.prototype.getHash = function()
{
	return (this.isSP? 'M' : 'W') + encodeURIComponent(this.getId());
};

/**
 * Returns App.MODE_M365 for SharePoint files and App.MODE_ONEDRIVE
 * otherwise.
 */
OneDriveFile.prototype.getMode = function()
{
	return (this.isSP? App.MODE_M365 : App.MODE_ONEDRIVE);
};

/**
 * Overridden to enable the autosave option in the document properties dialog.
 */
OneDriveFile.prototype.isAutosaveOptional = function()
{
	return true;
};

/**
 * Returns the name of the file.
 */
OneDriveFile.prototype.getTitle = function()
{
	return this.meta.name;
};

/**
 * Returns true since OneDrive files can be renamed.
 */
OneDriveFile.prototype.isRenamable = function()
{
	return true;
};

/**
 * Returns true if the notification to update should be sent
 * together with the save request.
 */
OneDriveFile.prototype.isOptimisticSync = function()
{
	return true;
};

/**
 * Hook for subclassers.
 */
OneDriveFile.prototype.isSyncSupported = function()
{
	return true;
};

/**
 * Specifies if notify events should be ignored.
 */
OneDriveFile.prototype.getSize = function()
{
	return this.meta.size;
};

/**
 * Adds the listener for automatically saving the diagram for local changes.
 */
OneDriveFile.prototype.isConflict = function(req)
{
	return req != null && (req.getStatus() == 412 || req.getStatus() == 409);
};

/**
 * Returns the current etag.
 */
OneDriveFile.prototype.getCurrentUser = function()
{
	return this.isSP? ((this.ui.m365 != null) ? this.ui.m365.user : null) :
		((this.ui.oneDrive != null) ? this.ui.oneDrive.user : null);
};

/**
 * Adds the listener for automatically saving the diagram for local changes.
 */
OneDriveFile.prototype.loadDescriptor = function(success, error)
{
	var client = this.isSP? this.ui.m365 : this.ui.oneDrive;
	client.executeRequest(client.getItemURL(this.getId()), mxUtils.bind(this, function(req)
	{
		if (req.getStatus() >= 200 && req.getStatus() <= 299)
		{
			success(JSON.parse(req.getText()));
		}
		else if (error != null)
		{
			error();
		}
	}), error);
};

/**
 * Adds the listener for automatically saving the diagram for local changes.
 */
OneDriveFile.prototype.getLatestVersion = function(success, error)
{
	(this.isSP? this.ui.m365 : this.ui.oneDrive).getFile(this.getId(), mxUtils.bind(this, function(file)
	{
		// Every client switches to the key of the latest version, a
		// version without a key keeps the current one (see
		// DrawioFileSync.updateChannelKey)
		if (file != null && file.realtimeKey != null &&
			file.getId() == this.getId())
		{
			this.realtimeKey = file.realtimeKey;
		}

		success(file);
	}), error);
};

/**
 * Hook for subclassers to update the descriptor from given file
 */
OneDriveFile.prototype.getDescriptor = function()
{
	return this.meta;
};

/**
 * Hook for subclassers to update the descriptor from given file
 */
OneDriveFile.prototype.setDescriptor = function(desc)
{
	this.meta = desc;
};

/**
 * Adds all listeners.
 */
OneDriveFile.prototype.getDescriptorEtag = function(desc)
{
	return desc.eTag;
};

/**
 * Adds the listener for automatically saving the diagram for local changes.
 */
OneDriveFile.prototype.setDescriptorEtag = function(desc, etag)
{
	desc.eTag = etag;
};

/**
 * Adds the listener for automatically saving the diagram for local changes.
 */
OneDriveFile.prototype.loadPatchDescriptor = function(success, error)
{
	var client = this.isSP? this.ui.m365 : this.ui.oneDrive;
	var url = client.getItemURL(this.getId());

	client.executeRequest(url + '?select=etag,file' , mxUtils.bind(this, function(req)
	{
		if (req.getStatus() >= 200 && req.getStatus() <= 299)
		{
			success(JSON.parse(req.getText()));
		}
		else
		{
			error(client.parseRequestText(req));
		}
	}), error)
};

/**
 * Returns the random key stored in the file (see REALTIME_KEY_ATTRIBUTE), or
 * the legacy key for a file that has not been saved with one yet.
 */
OneDriveFile.prototype.getChannelKey = function()
{
	return (this.realtimeKey != null) ? this.realtimeKey :
		this.getLegacyChannelKey();
};

/**
 * Using MD5 of create timestamp and user ID as crypto key. Anyone who knows
 * the file metadata can derive it, and the timestamp can be guessed.
 */
OneDriveFile.prototype.getLegacyChannelKey = function()
{
	if (typeof CryptoJS !== 'undefined')
	{
		var seed = this.meta.createdDateTime +
			((this.meta.createdBy != null &&
			this.meta.createdBy.user != null) ?
			this.meta.createdBy.user.id : '');

		// Called for every activity event via DrawioFileSync.start
		if (this.legacyKeySeed !== seed)
		{
			this.legacyKeySeed = seed;
			this.legacyKey = CryptoJS.MD5(seed).toString();
		}

		return this.legacyKey;
	}

	return null;
};

/**
 * Returns the last modified date of the file.
 */
OneDriveFile.prototype.getLastModifiedDate = function()
{
	return new Date(this.meta.lastModifiedDateTime);
};

/**
 * Saves the file under its current title.
 */
OneDriveFile.prototype.save = function(revision, success, error, unloading, overwrite)
{
	this.doSave(this.getTitle(), revision, success, error, unloading, overwrite);
};

/**
 * Saves the file with the given title.
 */
OneDriveFile.prototype.saveAs = function(title, success, error)
{
	this.doSave(title, false, success, error);
};

/**
 * Updates the file data using the extension of the given title and saves
 * the file with the given title.
 */
OneDriveFile.prototype.doSave = function(title, revision, success, error, unloading, overwrite)
{
	// Forces update of data for new extensions
	var prev = this.meta.name;
	this.meta.name = title;
	
	DrawioFile.prototype.save.apply(this, [null, mxUtils.bind(this, function()
	{
		this.meta.name = prev;
		this.saveFile(title, revision, success, error, unloading, overwrite);
	}), error, unloading, overwrite]);
};

/**
 * Saves the file unless a save is in progress. On a conflict, the remote
 * changes are merged via the sync object and the save is retried. If the
 * title has changed, the data is inserted as a new file, which is then
 * opened.
 */
OneDriveFile.prototype.saveFile = function(title, revision, success, error, unloading, overwrite)
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
			var doSave = mxUtils.bind(this, function()
			{
				try
				{
					// Sets shadow modified state during save
					this.savingFileTime = new Date();
					this.setShadowModified(false);
					this.savingFile = true;
					
					var etag = (!overwrite && this.constructor == OneDriveFile &&
						(DrawioFile.SYNC == 'manual' || DrawioFile.SYNC == 'auto')) ?
						this.getCurrentEtag() : null;
					var lastDesc = this.meta;

					if (this.sync != null)
					{
						this.sync.fileSaving();
					}

					(this.isSP? this.ui.m365 : this.ui.oneDrive).saveFile(this, mxUtils.bind(this, function(meta, savedData)
					{
						// Checks for changes during save
						this.setModified(this.getShadowModified());
						this.savingFile = false;
						this.meta = meta;

						// A new realtime key is used once it is saved
						if (this.savingRealtimeKey != null)
						{
							this.realtimeKey = this.savingRealtimeKey;
							this.savingRealtimeKey = null;
						}

						this.fileSaved(savedData, lastDesc, mxUtils.bind(this, function()
						{
							this.contentChanged();
							
							if (success != null)
							{
								success();
							}
						}), error);
					}), mxUtils.bind(this, function(err, req)
					{
						try
						{
							this.savingFile = false;
							
							if (this.isConflict(req))
					    	{
								this.inConflictState = true;
		
								if (this.sync != null)
								{	
									this.savingFile = true;
									
									this.sync.fileConflict(null, mxUtils.bind(this, function()
									{
										// Adds random cool-off
										window.setTimeout(mxUtils.bind(this, function()
										{
											this.updateFileData();
											doSave();
										}), 100 + Math.random() * 500);
									}), mxUtils.bind(this, function()
									{
										this.savingFile = false;
							
										if (error != null)
										{
											error();
										}
									}));
								}
								else if (error != null)
								{
									error();
								}
							}
							else if (error != null)
							{
								error(err);
							}
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
					}), etag);
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
			});
			
			doSave();
		}
		else
		{
			// Sets shadow modified state during save
			this.savingFileTime = new Date();
			this.setShadowModified(false);
			this.savingFile = true;
		
			(this.isSP? this.ui.m365 : this.ui.oneDrive).insertFile(title, this.getData(), mxUtils.bind(this, function(file)
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
			}));
		}
	}
};

/**
 * Renames the file to the given title. The file is saved again if the file
 * extension has changed.
 */
OneDriveFile.prototype.rename = function(title, success, error)
{
	(this.isSP? this.ui.m365 : this.ui.oneDrive).renameFile(this, title, mxUtils.bind(this, function(meta)
	{
		if (!this.hasSameExtension(title, this.getTitle()))
		{
			this.meta = meta;

			if (this.sync != null)
			{
				this.sync.descriptorChanged();
			}
			
			this.save(true, success, error);
		}
		else
		{
			this.meta = meta;
			this.descriptorChanged();

			if (this.sync != null)
			{
				this.sync.descriptorChanged();
			}
			
			if (success != null)
			{
				success(meta);
			}
		}
	}), error);
};

/**
 * Moves the file to the folder with the given ID.
 */
OneDriveFile.prototype.move = function(folderId, success, error)
{
	(this.isSP? this.ui.m365 : this.ui.oneDrive).moveFile(this.getId(), folderId, mxUtils.bind(this, function(meta)
	{
		this.meta = meta;
		this.descriptorChanged();
		
		if (success != null)
		{
			success(meta);
		}
	}), error);
};
