/**
 * Copyright (c) 2006-2017, JGraph Holdings Ltd
 * Copyright (c) 2006-2017, draw.io AG
 */
DriveFile = function(ui, data, desc)
{
	DrawioFile.call(this, ui, data);
	
	this.desc = desc;
};

//Extends mxEventSource
mxUtils.extend(DriveFile, DrawioFile);

/**
 * Delay for last save in ms.
 */
DriveFile.prototype.saveDelay = 0;

/**
 * Delay for last save in ms.
 */
DriveFile.prototype.allChangesSavedKey = 'allChangesSavedInDrive';

/**
 * Specifies if notify events should be ignored.
 */
DriveFile.prototype.getSize = function()
{
	return this.desc.fileSize;
};

/**
 * Returns true if copy, export and print are not allowed for this file.
 */
DriveFile.prototype.isRestricted = function()
{
	return DrawioFile.RESTRICT_EXPORT || (this.desc.userPermission != null && this.desc.labels != null &&
		this.desc.userPermission.role == 'reader' && this.desc.labels.restricted);
};

/**
 * Adds the listener for automatically saving the diagram for local changes.
 */
DriveFile.prototype.isConflict = function(err)
{
	return err != null && err.error != null && err.error.code == 412;
};

/**
 * Returns the current etag.
 */
DriveFile.prototype.getCurrentUser = function()
{
	return (this.ui.drive != null) ? this.ui.drive.user : null;
};

/**
 * Translates this point by the given vector.
 * 
 * @param {number} dx X-coordinate of the translation.
 * @param {number} dy Y-coordinate of the translation.
 */
DriveFile.prototype.getMode = function()
{
	return App.MODE_GOOGLE;
};

/**
 * Returns true if copy, export and print are not allowed for this file.
 */
DriveFile.prototype.getFileUrl = function()
{
	return 'https://drive.google.com/open?authuser=0&id=' + this.getId();
};

/**
 * Returns true if copy, export and print are not allowed for this file.
 */
DriveFile.prototype.getFolderUrl = function()
{
	if (this.desc.labels != null && this.desc.labels.trashed)
	{
		return 'https://drive.google.com/drive/trash';
	}
	else
	{
		return (this.desc.parents != null && this.desc.parents.length > 0) ?
			'https://drive.google.com/drive/folders/' +
			this.desc.parents[0].id : null;
	}
};

/**
 * Returns true if copy, export and print are not allowed for this file.
 */
DriveFile.prototype.getPublicUrl = function(fn)
{
	this.ui.drive.executeRequest({
		url: '/files/' + this.desc.id + '/permissions?supportsAllDrives=true'
	}, 
	mxUtils.bind(this, function(resp)
	{
		if (resp != null && resp.items != null)
		{
			for (var i = 0; i < resp.items.length; i++)
			{
				if (resp.items[i].id === 'anyoneWithLink' ||
					resp.items[i].id === 'anyone')
				{
					fn(this.desc.webContentLink);
					
					return;
				}
			}
		}
		
		fn(null);
	}), mxUtils.bind(this, function()
	{
		fn(null)
	}));
};

/**
 * Overridden to enable the autosave option in the document properties dialog
 * if realtime is not used.
 */
DriveFile.prototype.isAutosaveOptional = function()
{
	return true;
};

/**
 * Translates this point by the given vector.
 * 
 * @param {number} dx X-coordinate of the translation.
 * @param {number} dy Y-coordinate of the translation.
 */
DriveFile.prototype.isRenamable = function()
{
	return this.isEditable() && DrawioFile.prototype.isEditable.apply(this, arguments);
};

/**
 * Translates this point by the given vector.
 * 
 * @param {number} dx X-coordinate of the translation.
 * @param {number} dy Y-coordinate of the translation.
 */
DriveFile.prototype.isMovable = function()
{
	return this.isEditable();
};

/**
 * Translates this point by the given vector.
 * 
 * @param {number} dx X-coordinate of the translation.
 * @param {number} dy Y-coordinate of the translation.
 */
DriveFile.prototype.isTrashed = function()
{
	return this.desc.labels.trashed;
};

/**
 * Translates this point by the given vector.
 * 
 * @param {number} dx X-coordinate of the translation.
 * @param {number} dy Y-coordinate of the translation.
 */
DriveFile.prototype.save = function(revision, success, error, unloading, overwrite)
{
	DrawioFile.prototype.save.apply(this, [revision, mxUtils.bind(this, function()
	{
		this.saveFile(null, revision, success, error, unloading, overwrite);
	}), error, unloading, overwrite]);
};

/**
 * Translates this point by the given vector.
 * 
 * @param {number} dx X-coordinate of the translation.
 * @param {number} dy Y-coordinate of the translation.
 */
DriveFile.prototype.saveFile = function(title, revision, success, error, unloading, overwrite)
{
	try
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
			// Sets shadow modified state during save
			this.savingFileTime = new Date();
			this.setShadowModified(false);
			this.savingFile = true;

			this.createSecret(mxUtils.bind(this, function(secret, token)
			{
				var doSave = mxUtils.bind(this, function(realOverwrite, realRevision)
				{
					try
					{
						var lastDesc = this.desc;
						
						if (this.sync != null)
						{
							this.sync.fileSaving();
						}
	
						this.ui.drive.saveFile(this, realRevision, mxUtils.bind(this, function(resp, savedData, pages, checksum)
						{
							try
							{
								this.savingFile = false;
								
								// Handles special case where resp is false eg
								// if the old file was converted to realtime
								if (resp != false)
								{
									// Checks for changes during save
									this.setModified(this.getShadowModified());
									
									if (revision)
									{
										this.lastAutosaveRevision = new Date().getTime();
									}
				
									// Adaptive autosave delay
									this.autosaveDelay = Math.round(Math.min(10000,
										Math.max(DriveFile.prototype.autosaveDelay,
											this.saveDelay)));
									this.desc = resp;
									
									this.fileSaved(savedData, lastDesc, mxUtils.bind(this, function()
									{
										this.contentChanged();

										if (typeof success === 'function')
										{
											success(resp);
										}
									}), error, token, pages, checksum);
								}
								else if (error != null)
								{
									error(resp);
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
						}), mxUtils.bind(this, function(err, desc)
						{
							try
							{
								this.savingFile = false;
								
								if (this.isConflict(err))
								{
									this.inConflictState = true;
									
									if (this.sync != null)
									{
										this.savingFile = true;
										
										this.sync.fileConflict(desc, mxUtils.bind(this, function()
										{
											// Adds random cool-off
											window.setTimeout(mxUtils.bind(this, function()
											{
												this.updateFileData();
												this.setShadowModified(false);
												doSave(realOverwrite, true);
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
						}), unloading, unloading, realOverwrite, null, secret);
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
				
				doSave(overwrite, revision);				
			}));
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
 * Shows a conflict dialog to the user.
 */
DriveFile.prototype.copyFile = function(success, error, filename)
{
	if (!this.isRestricted())
	{
		this.makeCopy(mxUtils.bind(this, function()
		{
			if (this.ui.spinner.spin(document.body, mxResources.get('saving')))
			{
				try
				{
					this.save(true, success, error)
				}
				catch (e)
				{
					error(e);
				}
			}
		}), error, (filename != null) ? filename : this.ui.getCopyFilename(this, true));
	}
	else
	{
		DrawioFile.prototype.copyFile.apply(this, arguments);
	}	
};

/**
 * Shows a conflict dialog to the user.
 */
DriveFile.prototype.makeCopy = function(success, error, filename)
{
	if (this.ui.spinner.spin(document.body, mxResources.get('saving')))
	{
		// Uses copyFile internally which is a remote REST call with the advantage of keeping
		// the parents of the file in-place, but copies the remote file contents so needs to
		// be updated as soon as we have the ID.
		this.saveAs(filename, mxUtils.bind(this, function(resp)
		{
			// Disconnects sync from the original file's channel
			// and restarts on the copy's channel
			if (this.sync != null)
			{
				this.sync.stop();
				this.sync.channelId = null;
				this.sync.key = null;
			}

			this.desc = resp;

			// Restarts sync on the copy's channel before save
			// so that createToken uses the correct channel ID
			if (this.sync != null)
			{
				this.sync.start();
			}

			this.ui.spinner.stop();
			this.setModified(false);
			this.invalidChecksum = false;
			this.inConflictState = false;

			this.descriptorChanged();
			success();
		}), mxUtils.bind(this, function()
		{
			this.ui.spinner.stop();

			if (error != null)
			{
				error();
			}
		}));
	}
};

/**
 * Translates this point by the given vector.
 * 
 * @param {number} dx X-coordinate of the translation.
 * @param {number} dy Y-coordinate of the translation.
 */
DriveFile.prototype.saveAs = function(filename, success, error)
{
	this.ui.drive.copyFile(this.getId(), filename, success, error);
};

/**
 * Translates this point by the given vector.
 * 
 * @param {number} dx X-coordinate of the translation.
 * @param {number} dy Y-coordinate of the translation.
 */
DriveFile.prototype.rename = function(title, success, error)
{
	var rev = this.getCurrentRevisionId();
	
	this.ui.drive.renameFile(this.getId(), title, mxUtils.bind(this, function(desc)
	{
		if (!this.hasSameExtension(title, this.getTitle()))
		{
			this.desc = desc;

			if (this.sync != null)
			{
				this.sync.descriptorChanged(rev);
			}
			
			this.save(true, success, error);
		}
		else
		{
			this.desc = desc;
			this.descriptorChanged();
			
			if (this.sync != null)
			{
				this.sync.descriptorChanged(rev);
			}
			
			if (success != null)
			{
				success(desc);
			}
		}
	}), error);
};

/**
 * Translates this point by the given vector.
 * 
 * @param {number} dx X-coordinate of the translation.
 * @param {number} dy Y-coordinate of the translation.
 */
DriveFile.prototype.move = function(folderId, success, error)
{
	this.ui.drive.moveFile(this.getId(), folderId, mxUtils.bind(this, function(resp)
	{
		this.desc = resp;
		this.descriptorChanged();
		
		if (success != null)
		{
			success(resp);
		}
	}), error);
};

/**
 * Translates this point by the given vector.
 * 
 * @param {number} dx X-coordinate of the translation.
 * @param {number} dy Y-coordinate of the translation.
 */
DriveFile.prototype.share = function()
{
	this.ui.drive.showPermissions(this.getId(), this);
};

/**
 * Translates this point by the given vector.
 * 
 * @param {number} dx X-coordinate of the translation.
 * @param {number} dy Y-coordinate of the translation.
 */
DriveFile.prototype.getTitle = function()
{
	return this.desc.title;
};

/**
 * Translates this point by the given vector.
 * 
 * @param {number} dx X-coordinate of the translation.
 * @param {number} dy Y-coordinate of the translation.
 */
DriveFile.prototype.getHash = function()
{
	return 'G' + this.getId();
};

/**
 * Translates this point by the given vector.
 * 
 * @param {number} dx X-coordinate of the translation.
 * @param {number} dy Y-coordinate of the translation.
 */
DriveFile.prototype.getId = function()
{
	return this.desc.id;
};

/**
 * Translates this point by the given vector.
 * 
 * @param {number} dx X-coordinate of the translation.
 * @param {number} dy Y-coordinate of the translation.
 */
DriveFile.prototype.isEditable = function()
{
	return DrawioFile.prototype.isEditable.apply(this, arguments) &&
		this.desc.editable;
};

/**
 * Hook for subclassers.
 */
DriveFile.prototype.isSyncSupported = function()
{
	return true;
};

/**
 * Hook for subclassers.
 */
DriveFile.prototype.isRealtimeSupported = function()
{
	return true;
};

/**
 * Returns true if all changes should be sent out immediately.
 */
DriveFile.prototype.isRealtimeOptional = function()
{
	return this.sync != null && this.sync.isConnected();
};

/**
 * Returns true if all changes should be sent out immediately.
 */
DriveFile.prototype.setRealtimeEnabled = function(value, success, error)
{
	if (this.sync != null)
	{
		this.ui.drive.executeRequest({
			'url': '/files/' + this.getId() + '/properties?alt=json&supportsAllDrives=true',
			'method': 'POST',
			'contentType': 'application/json; charset=UTF-8',
			'params': {
				'key': 'collaboration',
				'value': (value) ? 'enabled' :
					((urlParams['fast-sync'] != '0') ?
						'disabled' : '')
			}
		}, mxUtils.bind(this, function()
		{
			this.loadDescriptor(mxUtils.bind(this, function(desc)
			{
				if (desc != null)
				{
					this.sync.descriptorChanged(this.getCurrentEtag());
					this.sync.updateDescriptor(desc);
					success();
				}
				else
				{
					error();
				}
			}), error);
		}), error);
	}
	else
	{
		error();
	}
};

/**
 * Returns true if all changes should be sent out immediately.
 */
DriveFile.prototype.isRealtimeEnabled = function()
{
	var collab = this.ui.drive.getCustomProperty(this.desc, 'collaboration');

	return (DrawioFile.prototype.isRealtimeEnabled.apply(this, arguments) &&
		collab != 'disabled') || (Editor.enableRealtime && collab == 'enabled');
};

/**
 * Hook for subclassers.
 */
DriveFile.prototype.isRevisionHistorySupported = function()
{
	return true;
};

/**
 * Hook for subclassers.
 */
DriveFile.prototype.getRevisions = function(success, error)
{
	this.ui.drive.executeRequest(
	{
		url: '/files/' + this.getId() + '/revisions'
	},
	mxUtils.bind(this, function(resp)
	{
		for (var i = 0; i < resp.items.length; i++)
		{
			(mxUtils.bind(this, function(item)
			{
				// Redirects title to originalFilename to
				// match expected descriptor interface
				item.title = item.originalFilename;
				
				item.getXml = mxUtils.bind(this, function(itemSuccess, itemError)
				{
					this.ui.drive.getXmlFile(item, mxUtils.bind(this, function(file)
		   			{
						itemSuccess(file.getData());
		   			}), itemError);
				});
				
				item.getUrl = mxUtils.bind(this, function(page)
				{
					return this.ui.getUrl(window.location.pathname + '?rev=' + item.id +
						'&chrome=0&nav=1&layers=1&edit=_blank' + ((page != null) ?
						'&page=' + page : '')) + window.location.hash;
				});
			}))(resp.items[i]);
		}
		
		success(resp.items);
	}), error);
};

/**
 * Adds the listener for automatically saving the diagram for local changes.
 */
DriveFile.prototype.getLatestVersion = function(success, error)
{
	this.ui.drive.getFile(this.getId(), success, error, true);
};

/**
 * Adds all listeners.
 */
DriveFile.prototype.getChannelId = function()
{
	var chan = this.ui.drive.getCustomProperty(this.desc, 'channel');
	
	if (chan != null)
	{
		chan = 'G-' + this.getId() + '.' + chan;
	}
	
	return chan;
};

/**
 * Gets the channel ID from the given descriptor.
 */
DriveFile.prototype.getChannelKey = function()
{
	return this.ui.drive.getCustomProperty(this.desc, 'key');
};

/**
 * Adds all listeners.
 */
DriveFile.prototype.getLastModifiedDate = function()
{
	return new Date(this.desc.modifiedDate);
};

/**
 * Adds all listeners.
 */
DriveFile.prototype.getDescriptor = function()
{
	return this.desc;
};

/**
* Updates the descriptor of this file with the one from the given file.
*/
DriveFile.prototype.setDescriptor = function(desc)
{
	this.desc = desc;
};

/**
 * Returns the checksum from the given descriptor.
 */
DriveFile.prototype.getDescriptorChecksum = function(desc)
{
	var value = this.ui.drive.getCustomProperty(desc, 'checksum');
	var secret = this.getDescriptorSecret(desc);
	var result = null;

	if (value != null && secret != null)
	{
		tokens = value.split(':');

		// Checks if checksum matches current secret
		if (tokens.length == 2 && tokens[0] == secret)
		{
			result = tokens[1];
		}
	}

	return result;
};

/**
 * Returns the secret from the given descriptor.
 */
DriveFile.prototype.getDescriptorSecret = function(desc)
{
	return this.ui.drive.getCustomProperty(desc, 'secret');
};

/**
 * Updates the revision ID on the given descriptor.
 */
DriveFile.prototype.setDescriptorRevisionId = function(desc, id)
{
	desc.headRevisionId = id;
};

/**
 * Returns the revision ID from the given descriptor.
 */
DriveFile.prototype.getDescriptorRevisionId = function(desc)
{
	return desc.headRevisionId;
};

/**
 * Adds all listeners.
 */
DriveFile.prototype.getDescriptorEtag = function(desc)
{
	return desc.etag;
};

/**
 * Adds the listener for automatically saving the diagram for local changes.
 */
DriveFile.prototype.setDescriptorEtag = function(desc, etag)
{
	desc.etag = etag;
};

/**
 * Adds the listener for automatically saving the diagram for local changes.
 */
DriveFile.prototype.loadPatchDescriptor = function(success, error)
{
	this.ui.drive.executeRequest(
	{	
		url: '/files/' + this.getId() + '?supportsAllDrives=true&fields=' + this.ui.drive.catchupFields
	},
	mxUtils.bind(this, function(desc)
	{
		success(desc);
	}), error);
};

/**
 * Adds the listener for automatically saving the diagram for local changes.
 */
DriveFile.prototype.patchDescriptor = function(desc, patch)
{
	desc.headRevisionId = patch.headRevisionId;
	desc.modifiedDate = patch.modifiedDate;
	
	DrawioFile.prototype.patchDescriptor.apply(this, arguments);
};

/**
 * Adds the listener for automatically saving the diagram for local changes.
 */
DriveFile.prototype.loadDescriptor = function(success, error)
{
	this.ui.drive.loadDescriptor(this.getId(), success, error);
};

/**
 * Are comments supported
 */
DriveFile.prototype.commentsSupported = function()
{
	return true;
};

/**
 * Are comments anchored to shapes supported
 */
DriveFile.prototype.anchoredCommentsSupported = function()
{
	return true;
};

/**
 * Are @mentions in comments supported
 */
DriveFile.prototype.mentionsSupported = function()
{
	return true;
};

/**
 * Fields returned for comments and their replies. The v3 comments
 * endpoints error without an explicit fields parameter.
 */
DriveFile.prototype.commentFields = 'id,content,createdTime,modifiedTime,deleted,resolved,anchor,' +
	'author(displayName,photoLink,me),replies(id,content,createdTime,modifiedTime,deleted,' +
	'author(displayName,photoLink,me))';

/**
 * Returns the URL for the v3 comments API of this file. path is appended
 * to the comments collection (eg. '/id/replies'), fields is required for
 * all v3 comments requests except DELETE.
 */
DriveFile.prototype.getCommentUrl = function(path, fields)
{
	return this.ui.drive.GDriveV3BaseUrl + '/files/' + this.getId() + '/comments' + path +
		((fields != null) ? '?fields=' + encodeURIComponent(fields) : '');
};

/**
 * Returns the Drive API anchor string for the given drawio anchor object.
 * Drive stores anchors of third-party file types as opaque strings (such
 * comments show as unanchored in the Drive UI). Anchors are immutable in
 * the API so there is no re-anchoring.
 */
DriveFile.prototype.encodeCommentAnchor = function(anchor)
{
	return JSON.stringify({'r': 'head', 'a': [{'drawio': anchor}]});
};

/**
 * Returns the drawio anchor object from the given Drive API anchor string
 * or null. Malformed anchors and anchors written by other tools are
 * ignored.
 */
DriveFile.prototype.decodeCommentAnchor = function(anchorStr)
{
	try
	{
		if (anchorStr != null)
		{
			var obj = JSON.parse(anchorStr);

			if (obj != null && obj.a != null && obj.a.length > 0)
			{
				for (var i = 0; i < obj.a.length; i++)
				{
					if (obj.a[i] != null && typeof obj.a[i].drawio === 'object' &&
						obj.a[i].drawio !== null)
					{
						return obj.a[i].drawio;
					}
				}
			}
		}
	}
	catch (e)
	{
		// ignore
	}

	return null;
};

/**
 * Get comments of the file
 */
DriveFile.prototype.getComments = function(success, error)
{
	var currentUser = this.ui.getCurrentUser();
	var file = this;

	function driveCommentToDrawio(gComment, pCommentId)
	{
		if (gComment.deleted) return null; //skip deleted comments

		var comment = new DriveComment(file, gComment.id, gComment.content,
				gComment.modifiedTime, gComment.createdTime, gComment.resolved == true,
				(gComment.author != null && gComment.author.me) ? currentUser :
				new DrawioUser(null, null, (gComment.author != null) ?
						gComment.author.displayName : null, (gComment.author != null) ?
						gComment.author.photoLink : null), pCommentId);

		if (pCommentId == null)
		{
			comment.anchor = file.decodeCommentAnchor(gComment.anchor);
		}

		for (var i = 0; gComment.replies != null && i < gComment.replies.length; i++)
		{
			comment.addReplyDirect(driveCommentToDrawio(gComment.replies[i], gComment.id));
		}

		return comment;
	};

	var comments = [];

	var fetchPage = mxUtils.bind(this, function(pageToken)
	{
		this.ui.drive.executeRequest(
		{
			fullUrl: this.getCommentUrl('', 'nextPageToken,comments(' + this.commentFields + ')') +
				'&pageSize=100' + ((pageToken != null) ?
				'&pageToken=' + encodeURIComponent(pageToken) : '')
		},
		mxUtils.bind(this, function(resp)
		{
			var items = (resp != null && resp.comments != null) ? resp.comments : [];

			for (var i = 0; i < items.length; i++)
			{
				var comment = driveCommentToDrawio(items[i]);

				if (comment != null) comments.push(comment);
			}

			if (resp != null && resp.nextPageToken != null)
			{
				fetchPage(resp.nextPageToken);
			}
			else
			{
				success(comments);
			}
		}), error);
	});

	fetchPage(null);
};

/**
 * Add a comment to the file
 */
DriveFile.prototype.addComment = function(comment, success, error)
{
	var body = {'content': comment.content};

	if (comment.anchor != null)
	{
		body.anchor = this.encodeCommentAnchor(comment.anchor);
	}

	this.ui.drive.executeRequest(
	{
		fullUrl: this.getCommentUrl('', 'id'),
		method: 'POST',
		params: body
	},
	mxUtils.bind(this, function(resp)
	{
		success(resp.id); //pass comment id
	}), error);
};

/**
 * Get the people that can be mentioned in comments of the file. Mentions
 * are limited to the people with access to the file as the API cannot
 * start Drive's share-on-mention flow.
 */
DriveFile.prototype.getMentionCandidates = function(success, error)
{
	if (this.mentionCandidates != null)
	{
		success(this.mentionCandidates);

		return;
	}

	var candidates = [];

	var fetchPage = mxUtils.bind(this, function(pageToken)
	{
		this.ui.drive.executeRequest(
		{
			fullUrl: this.ui.drive.GDriveV3BaseUrl + '/files/' + this.getId() +
				'/permissions?supportsAllDrives=true&pageSize=100&fields=' +
				encodeURIComponent('nextPageToken,permissions(type,deleted,emailAddress,displayName,photoLink)') +
				((pageToken != null) ? '&pageToken=' + encodeURIComponent(pageToken) : '')
		},
		mxUtils.bind(this, function(resp)
		{
			var items = (resp != null && resp.permissions != null) ? resp.permissions : [];

			for (var i = 0; i < items.length; i++)
			{
				// Mentions need an email address so people and groups are
				// included, not domain or anyone-with-the-link permissions
				if ((items[i].type == 'user' || items[i].type == 'group') &&
					!items[i].deleted && items[i].emailAddress != null)
				{
					var candidate = new DrawioUser(null, items[i].emailAddress,
						items[i].displayName, items[i].photoLink);
					candidate.isGroup = items[i].type == 'group';
					candidates.push(candidate);
				}
			}

			if (resp != null && resp.nextPageToken != null)
			{
				fetchPage(resp.nextPageToken);
			}
			else
			{
				this.mentionCandidates = candidates;
				success(candidates);
			}
		}), error);
	});

	fetchPage(null);
};

/**
 * Can add a reply to a reply
 */
DriveFile.prototype.canReplyToReplies = function()
{
	return false;
};

/**
 * Can add comments (The permission to comment to this file)
 */
DriveFile.prototype.canComment = function()
{
	return this.desc.canComment;
};

/**
 * Get a new comment object
 */
DriveFile.prototype.newComment = function(content, user)
{
	return new DriveComment(this, null, content, Date.now(), Date.now(), false, user);
};
