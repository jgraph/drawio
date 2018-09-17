/**
 * Copyright (c) 2006-2017, JGraph Ltd
 * Copyright (c) 2006-2017, Gaudenz Alder
 */
DriveClient = function(editorUi)
{
	mxEventSource.call(this);
	
	/**
	 * Holds a reference to the UI. Needed for the sharing client.
	 */
	this.ui = editorUi;

	if (this.ui.editor.isChromelessView() && urlParams['rt'] != '1')
	{
		// Workaround for Google Drive requiring the user to click on the file in the
		// drive UI when not using this scope (user other scope with rt=1 URL param)
		this.appId = '850530949725';
		this.clientId = '850530949725.apps.googleusercontent.com';
		this.scopes = ['https://www.googleapis.com/auth/drive.readonly', 'openid'];
		
		// Only used for writing files which is disabled in viewer app
		this.mimeType = 'all_types_supported';
	}
	else if (this.ui.isDriveDomain())
	{
		this.appId = '671128082532';
		this.clientId = '671128082532.apps.googleusercontent.com';
		this.mimeType = 'application/vnd.jgraph.mxfile.realtime';
	}
	else
	{
		// Uses a different mime-type and realtime model than the drive domain
		// because realtime models for different app IDs are not compatible
		this.appId = '420247213240';
		this.clientId = '420247213240-hnbju1pt13seqrc1hhd5htpotk4g9q7u.apps.googleusercontent.com';
		this.mimeType = 'application/vnd.jgraph.mxfile.rtlegacy';
	}
	
	this.mimeTypes = 'application/mxe,application/vnd.jgraph.mxfile,' +
		'application/mxr,application/vnd.jgraph.mxfile.realtime,' +
		'application/vnd.jgraph.mxfile.rtlegacy';
};

// Extends mxEventSource
mxUtils.extend(DriveClient, mxEventSource);

/**
 * OAuth 2.0 scopes for installing Drive Apps.
 */
DriveClient.prototype.scopes = (urlParams['photos'] == '1') ?
								['https://www.googleapis.com/auth/drive.file',
						         'https://www.googleapis.com/auth/drive.install',
	                             'https://www.googleapis.com/auth/photos',
	                             'https://www.googleapis.com/auth/photos.upload',
						         'https://www.googleapis.com/auth/userinfo.profile'] :
								['https://www.googleapis.com/auth/drive.file',
                                'https://www.googleapis.com/auth/drive.install',
                                'https://www.googleapis.com/auth/userinfo.profile'];

/**
 * Specifies if thumbnails should be enabled. Default is true.
 * LATER: If thumbnails are disabled, make sure to replace the
 * existing thumbnail with the placeholder only once.
 */
DriveClient.prototype.enableThumbnails = true;

/**
 * Specifies the width for thumbnails. Default is 1000. This value
 * must be between 220 and 1600.
 */
DriveClient.prototype.thumbnailWidth = 1000;

/**
 * The maximum number of bytes per thumbnail. Default is 2000000.
 */
DriveClient.prototype.maxThumbnailSize = 2000000;

/**
 * Defines the base64url PNG to be used if no thumbnail was generated
 * (including the case where thumbnails are disabled).
 */
DriveClient.prototype.placeholderThumbnail = 'iVBORw0KGgoAAAANSUhEUgAAAJYAAACWCAMAAAAL34HQAAACN1BMVEXwhwXvhgX4iwXzhwXgbQzvhgXhbAzocgzqcwzldAoAAADhbgvjcQnmdgrlbgDwhgXsfwXufgjwhgXwgQfziAXxgADibgz4iwX4jAX3iwTpcwr1igXoewjsfgj3igX4iwXqcQv4jAX3iwXtfQnndQrvhAbibArwhwXgbQz//////v39jwX6jQX+/v7fagHfawzdVQDwhADgbhPgbhXwhwPocQ3uvKvwiA/faQDscgzxiAT97+XgciTgcSP6jAXgbQ3gcCHwiRfpcQzwhwfeXQD77ef74NLvhgTvegD66uPgbAf66+TvfADwjCzgcCfwiSD67ObhcjjwiBHhczvwiyrgbxj///777ujgcSHgcB/xiRzgbhveWgDeVwDhdEDgbRDqfgffYgDfXwD97+bvfQDxiz7//vvwiRr118rrcgztggbfZgDfZAD++PT98+3gbBPsgAb99vD33tPgcB7icAvuhAX//Pn66N/00sTyy7vuuqbjekLwhwzkcgr88er449n++vfutp/kh1vgcBvhbwvmdwnwgwDwgADeWQD87eLxxrTssJjqpIf0roHmjWTkhFP759n63czvvanomnjnlHDhczD22cr4y6/wwa/3xKX2wJ3rqpH0tY7qp4vpnoDymlbjf0vxjjntcwzldAroegj/kgX12s7518PzqnnnkWfynmLieUjpewjrdAD40Lj1uZTzpm3idTbiciLydQzzfwnyiQTsfgD3xqnzp3TxlkzgbCrdTwDdSwBLKUlNAAAAJ3RSTlP8/b2X/YH8wb+FAIuIggJbQin5opAM9+a/ubaubyD78NjSyr2WgRp4sjN4AAAI70lEQVR42u2cZ38SQRDGT8WGvfde4E4BxVMRRaKiUURRlJhQRDCCSgQVO/bee++9994+nMt5ywoezFJd/fm8uITi3p9n5mbYkcCpO6rVnVu2YEXd+3dRIySuo7pLv4GjGNKg7j3UHTl1l14PajmG9OFBnx7Ird4PumpYEtf1QXc112l0M7OGKXEfeg3guo3iNIyJG92Jaz61mYYxcaNacs1H/8f6j6X5j1WI/mMVIsawRFEzI49SjwOqAJa43emclk8Rp2c7AFZ+LDGyvXE2kmO2Q1Lq17RSd6ND48QIwFVuLNHTOPbEpTOz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'.replace(/\+/g, '-').replace(/\//g, '_');

/**
 * Mime type for the paceholder thumbnail.
 */
DriveClient.prototype.placeholderMimeType = 'image/png';

/**
 * Executes the first step for connecting to Google Drive.
 */
DriveClient.prototype.libraryMimeType = 'application/vnd.jgraph.mxlibrary';

/**
 * Contains the hostname of the new app.
 */
DriveClient.prototype.newAppHostname = 'www.draw.io';

/**
 * Contains the hostname of the old app.
 */
DriveClient.prototype.oldAppHostname = 'legacy.draw.io';

/**
 * Executes the first step for connecting to Google Drive.
 */
DriveClient.prototype.extension = '.html';

/**
 * Interval for updating the access token.
 */
DriveClient.prototype.tokenRefreshInterval = 0;

/**
 * Interval for updating the access token.
 */
DriveClient.prototype.lastTokenRefresh = 0;

/**
 * Executes the first step for connecting to Google Drive.
 */
DriveClient.prototype.maxRetries = 4;

/**
 * Executes the first step for connecting to Google Drive.
 */
DriveClient.prototype.mimeTypeCheckCoolOff = 60000;

/**
 * Executes the first step for connecting to Google Drive.
 */
DriveClient.prototype.user = null;

/**
 * Authorizes the client, gets the userId and calls <open>.
 */
DriveClient.prototype.setUser = function(user)
{
	this.user = user;
	
	if (this.user == null && this.tokenRefreshThread != null)
	{
		window.clearTimeout(this.tokenRefreshThread);
		this.tokenRefreshThread = null;
	}
	
	this.fireEvent(new mxEventObject('userChanged'));
};

/**
 * Authorizes the client, gets the userId and calls <open>.
 */
DriveClient.prototype.getUser = function()
{
	return this.user;
};

/**
 * Authorizes the client, gets the userId and calls <open>.
 */
DriveClient.prototype.setUserId = function(userId, remember)
{
	if (remember)
	{
		if (isLocalStorage)
		{
			localStorage.setItem('.guid', userId);
		}
		else if (typeof(Storage) != 'undefined')
		{
			try
			{
				var expiry = new Date();
				expiry.setYear(expiry.getFullYear() + 1);
				document.cookie = 'GUID=' + userId + '; expires=' + expiry.toUTCString();
			}
			catch (e)
			{
				// any errors for storing the user ID can be safely ignored
			}
		}
	}
};

/**
 * Authorizes the client, gets the userId and calls <open>.
 */
DriveClient.prototype.clearUserId = function()
{
	if (isLocalStorage)
	{
		localStorage.removeItem('.guid');
	}
	else if (typeof(Storage) != 'undefined')
	{
		var expiry = new Date();
		expiry.setYear(expiry.getFullYear() - 1);
		document.cookie = 'GUID=; expires=' + expiry.toUTCString();
	}
};

/**
 * Authorizes the client, gets the userId and calls <open>.
 */
DriveClient.prototype.getUserId = function()
{
	var uid = null;
	
	if (this.user != null)
	{
		uid = this.user.id;
	}
	
	if (uid == null && isLocalStorage)
	{
		uid = localStorage.getItem('.guid');
	}
	
	if (uid == null	&& typeof(Storage) != 'undefined')
	{
		var cookies = document.cookie.split(";");
		
		for (var i = 0; i < cookies.length; i++)
		{
			// Removes spaces around cookie
			var cookie = mxUtils.trim(cookies[i]);
			
			if (cookie.substring(0, 5) == 'GUID=')
			{
				uid = cookie.substring(5);
				break;
			}
		}
		
		if (uid != null && isLocalStorage)
		{
			// Moves to local storage
			var expiry = new Date();
			expiry.setYear(expiry.getFullYear() - 1);
			document.cookie = 'GUID=; expires=' + expiry.toUTCString();
			localStorage.setItem('.guid', uid);
		}
	}
	
	return uid;
};

/**
 * Authorizes the client, gets the userId and calls <open>.
 */
DriveClient.prototype.execute = function(fn)
{
	// Handles error in immediate authorize call via callback that shows a
	// UI with a button that executes the second non-immediate authorize
	var fallback = mxUtils.bind(this, function(resp)
	{
		// Remember is an argument for the callback that executes
		// when the user clicks the authorize button in the UI and
		// success executes after successful authorization.
		this.ui.showAuthDialog(this, true, mxUtils.bind(this, function(remember, success)
		{
			this.authorize(false, mxUtils.bind(this, function()
			{
				if (success != null)
				{
					success();
				}
				
				fn();
			}), mxUtils.bind(this, function(resp)
			{
				var msg = mxResources.get('cannotLogin');
				
				// Handles special domain policy errors
				if (resp != null && resp.error != null)
				{
					if (resp.error.code == 403 &&
							resp.error.data != null && resp.error.data.length > 0 &&
							resp.error.data[0].reason == 'domainPolicy')
					{
						msg = resp.error.message;
					}
				}
				
				this.ui.drive.clearUserId();
				this.ui.drive.setUser(null);
				gapi.auth.signOut();
				
				this.ui.showError(mxResources.get('error'), msg, mxResources.get('help'), mxUtils.bind(this, function()
				{
					this.ui.openLink('https://desk.draw.io/support/solutions/articles/16000074659');
				}), null, mxResources.get('ok'));
			}), remember);
		}));
	});
	
	// First immediate authorize attempt
	this.authorize(true, fn, fallback);
};

/**
 * Executes the given request.
 */
DriveClient.prototype.executeRequest = function(req, success, error)
{
	var acceptResponse = true;
	var timeoutThread = null;
	var retryCount = 0;
	
	// Cancels any pending requests
	if (this.requestThread != null)
	{
		window.clearTimeout(this.requestThread);
	}
	
	var fn = mxUtils.bind(this, function()
	{
		this.requestThread = null;
		this.currentRequest = req;

		if (timeoutThread != null)
		{
			window.clearTimeout(timeoutThread);
		}
		
		timeoutThread = window.setTimeout(mxUtils.bind(this, function()
		{
			acceptResponse = false;
			
			if (error != null)
			{
				error({code: App.ERROR_TIMEOUT, retry: fn});
			}
		}), this.ui.timeout);

		req.execute(mxUtils.bind(this, function(resp)
		{
			window.clearTimeout(timeoutThread);
			
			if (acceptResponse)
			{
				if (resp != null && resp.error == null)
				{
					if (success != null)
					{
						success(resp);
					}
				}
				else
				{
					// Handles special error for saving old file where mime was changed to new
					// LATER: Check if 403 is never auth error, for now we check the message for a specific
					// case where the old app mime type was overridden by the new app
					if (error != null && resp != null && resp.error != null && resp.error.code == 403 &&
						(resp.error.message == 'The requested mime type change is forbidden.' ||
						resp.error.data != null && resp.error.data[0].reason == 'domainPolicy'))
					{
						error(resp);
					}
					// Handles authentication error
					else if (resp != null && resp.error != null && (resp.error.code == 401 || resp.error.code == 403))
					{
						// Shows an error if we're authenticated but the server still doesn't allow it
						if (resp.error.code == 403 && this.user != null)
						{
							if (error != null)
							{
								error(resp);
							}
						}
						else
						{
							this.execute(fn);
						}
					}
					// Schedules a retry if no new request was executed
					// TODO: Check for 'rateLimitExceeded', 'userRateLimitExceeded' in errors
					// see https://developers.google.com/drive/handle-errors
					else if (resp != null && resp.error != null && resp.error.code != 404 && this.currentRequest == req && retryCount < this.maxRetries)
					{
						retryCount++;
						var jitter = 1 + 0.1 * (Math.random() - 0.5);
						this.requestThread = window.setTimeout(fn, Math.round(Math.pow(2, retryCount) * jitter * 1000));
					}
					else if (error != null)
					{
						error(resp);
					}
				}
			}
		}));
	});
	
	// Must get token before first request in this case
	if (gapi.auth.getToken() == null)
	{
		this.execute(fn);
	}
	else
	{
		fn();
	}
},

/**
 * Authorizes the client, gets the userId and calls <open>.
 */
DriveClient.prototype.authorize = function(immediate, success, error, remember)
{
	var userId = this.getUserId();
	
	// Takes userId from state URL parameter
	if (this.ui.stateArg != null && this.ui.stateArg.userId != null)
	{
		userId = this.ui.stateArg.userId;
	}
	
	// Immediate only possible with userId
	if (immediate && userId == null)
	{
		if (error != null)
		{
			error();
		}
	}
	else
	{
		var params =
		{
			scope: this.scopes,
			client_id: this.clientId
		};
		
		if (immediate && userId != null)
		{
			params.immediate = true;
			params.user_id = userId;
		}
		else
		{
			params.immediate = false;
			params.authuser = -1;
		}
		
		gapi.auth.authorize(params, mxUtils.bind(this, function(resp)
		{
			// Updates the current user info
			if (resp != null && resp.error == null)
			{
				if (this.user == null || !immediate || this.user.id != userId)
				{
					this.updateUser(success, error, remember);
				}
				else if (success != null)
				{
					success();
				}
			}
			else if (error != null)
			{
				error(resp);
			}

			this.resetTokenRefresh(resp);
		}));
	}
};

/**
 * Checks if the client is authorized and calls the next step.
 */
DriveClient.prototype.resetTokenRefresh = function(resp)
{
	if (this.tokenRefreshThread != null)
	{
		window.clearTimeout(this.tokenRefreshThread);
		this.tokenRefreshThread = null;
	}

	// Starts timer to refresh token before it expires
	if (resp != null && resp.error == null && resp.expires_in > 0)
	{
		this.tokenRefreshInterval = parseInt(resp.expires_in) * 1000;
		this.lastTokenRefresh = new Date().getTime();
		
		this.tokenRefreshThread = window.setTimeout(mxUtils.bind(this, function()
		{
			this.authorize(true, mxUtils.bind(this, function()
			{
				//console.log('tokenRefresh: refreshed', gapi.auth.getToken());
			}), mxUtils.bind(this, function()
			{
				//console.log('tokenRefresh: error refreshing', gapi.auth.getToken());
			}));
		}), resp.expires_in * 900);
	}
};

/**
 * Checks if the client is authorized and calls the next step.
 */
DriveClient.prototype.checkToken = function(fn)
{
	var connected = this.lastTokenRefresh > 0;
	var delta = new Date().getTime() - this.lastTokenRefresh;

	if (delta > this.tokenRefreshInterval || this.tokenRefreshThread == null)
	{
		// Uses execute instead of authorize to allow a fallback authorization if cookie was lost
		this.execute(mxUtils.bind(this, function()
		{
			fn();
			
			if (connected)
			{
				this.fireEvent(new mxEventObject('disconnected'));
			}
		}));
	}
	else
	{
		fn();
	}
};

/**
 * Checks if the client is authorized and calls the next step.
 */
DriveClient.prototype.updateUser = function(success, error, remember)
{
	var token = gapi.auth.getToken().access_token;
	var url = 'https://www.googleapis.com/oauth2/v2/userinfo?alt=json&access_token=' + token;
	
	this.ui.loadUrl(url, mxUtils.bind(this, function(data)
	{
    	var info = JSON.parse(data);
    	
    	// Requests more information about the user (email address is sometimes not in info)
    	this.executeRequest(gapi.client.drive.about.get(), mxUtils.bind(this, function(resp)
    	{
    		this.setUser(new DrawioUser(info.id, resp.user.emailAddress, resp.user.displayName,
    				(resp.user.picture != null) ? resp.user.picture.url : null, info.locale));
        	this.setUserId(info.id, remember);

    		if (success != null)
			{
				success();
			}
    	}), error);
	}), error);
};

/**
 * Translates this point by the given vector.
 * 
 * @param {number} dx X-coordinate of the translation.
 * @param {number} dy Y-coordinate of the translation.
 */
DriveClient.prototype.copyFile = function(id, title, success, error)
{
	if (id != null && title != null)
	{
		this.executeRequest(gapi.client.drive.files.copy({'fileId': id, 'resource':
			{'title' : title}, 'supportsTeamDrives': true}), success, error);
	}
};

/**
 * Translates this point by the given vector.
 * 
 * @param {number} dx X-coordinate of the translation.
 * @param {number} dy Y-coordinate of the translation.
 */
DriveClient.prototype.renameFile = function(id, title, success, error)
{
	if (id != null && title != null)
	{
		this.executeRequest(this.createDriveRequest(id, {'title' : title}), success, error);
	}
};

/**
 * Translates this point by the given vector.
 * 
 * @param {number} dx X-coordinate of the translation.
 * @param {number} dy Y-coordinate of the translation.
 */
DriveClient.prototype.moveFile = function(id, folderId, success, error)
{
	if (id != null && folderId != null)
	{
		this.executeRequest(this.createDriveRequest(id, {'parents': [{'kind':
			'drive#fileLink', 'id': folderId}]}), success, error);
	}
};

/**
 * Translates this point by the given vector.
 * 
 * @param {number} dx X-coordinate of the translation.
 * @param {number} dy Y-coordinate of the translation.
 */
DriveClient.prototype.createDriveRequest = function(id, body)
{
	return gapi.client.request({
		'path': '/drive/v2/files/' + id,
		'method': 'PUT',
		'params': {'uploadType' : 'multipart', 'supportsTeamDrives': true},
		'headers': {'Content-Type': 'application/json; charset=UTF-8'},
		'body': JSON.stringify(body)
	});
};

/**
 * Loads the given file as a library file.
 */
DriveClient.prototype.getLibrary = function(id, success, error)
{
	return this.getFile(id, success, error, true, true);
};

/**
 * Checks if the client is authorized and calls the next step. The optional
 * readXml argument is used for import. Default is false. The optional
 * readLibrary argument is used for reading libraries. Default is false.
 */
DriveClient.prototype.getFile = function(id, success, error, readXml, readLibrary)
{
	readXml = (readXml != null) ? readXml : false;
	readLibrary = (readLibrary != null) ? readLibrary : false;
	
	if (urlParams['rev'] != null)
	{
		this.executeRequest(gapi.client.drive.revisions.get({'fileId': id, 'revisionId': urlParams['rev']}), mxUtils.bind(this, function(resp)
		{
   			this.getXmlFile(resp, null, success, error);
		}), error);
	}
	else
	{
		this.executeRequest(gapi.client.drive.files.get({'fileId': id, 'supportsTeamDrives': true}), mxUtils.bind(this, function(resp)
		{
			if (this.user != null)
			{
				var binary = /\.png$/i.test(resp.title);
				
				// Handles .vsdx, Gliffy and PNG+XML files by creating a temporary file
				if (/\.vsdx?$/i.test(resp.title) || /\.gliffy$/i.test(resp.title) ||
					(!this.ui.useCanvasForExport && binary))
				{
					var url = resp.downloadUrl + '&access_token=' + gapi.auth.getToken().access_token;
					this.ui.convertFile(url, resp.title, resp.mimeType, this.extension, success, error);
				}
				else
				{
					if (readXml || readLibrary || resp.mimeType == this.libraryMimeType)
					{
						this.getXmlFile(resp, null, success, error, true, readLibrary);
					}
					else
					{
						this.loadRealtime(resp, mxUtils.bind(this, function(doc)
					    {
							try
							{
								// Converts XML files to realtime including old realtime model
								if (doc == null || doc.getModel() == null || doc.getModel().getRoot() == null ||
									doc.getModel().getRoot().isEmpty() || (doc.getModel().getRoot().has('cells') &&
									!doc.getModel().getRoot().has(DriveRealtime.prototype.diagramsKey)))
						    		{
						    			this.getXmlFile(resp, doc, success, error);
						    		}
						    		else
						    		{
						        		// XML not required here since the realtime model is not empty
						    			success(new DriveFile(this.ui, null, resp, doc));
						    		}
							}
							catch (e)
							{
								error(e);
							}
					    }), error);
					}
				}
			}
			else
			{
				error({message: mxResources.get('loggedOut')});
			}
		}), error);
	}
};

/**
 * Checks if the client is authorized and calls the next step.
 */
DriveClient.prototype.loadRealtime = function(resp, success, error)
{
	// Redirects to new app because the realtime models of different apps are not visible
	if (urlParams['ignoremime'] != '1' && this.appId == '420247213240' &&
		(resp.mimeType == 'application/vnd.jgraph.mxfile.realtime' ||
		resp.mimeType == 'application/mxr'))
	{
		this.redirectToNewApp(error, resp.id);
	}
	// Checks if we're in viewer app or if the file is writeable if it needs to be converted
	else if (this.appId != '850530949725' && (resp.editable || (resp.mimeType != 'application/mxe' &&
		resp.mimeType != 'application/vnd.jgraph.mxfile')))
	{
		var fn = mxUtils.bind(this, function()
		{
			var acceptResponse = true;
			
			var timeoutThread = window.setTimeout(mxUtils.bind(this, function()
			{
				acceptResponse = false;
				error({code: App.ERROR_TIMEOUT, retry: fn});
			}), this.ui.timeout);
	
			gapi.drive.realtime.load(resp.id, mxUtils.bind(this, function(doc)
			{
		    	window.clearTimeout(timeoutThread);
		    	
		    	if (acceptResponse)
		    	{
		    		success(doc);
		    	}
			}));
		});
		
		fn();
	}
	// Shows the file as read-only without conversion
	else
	{
		success();
	}
};

/**
 * Checks if the client is authorized and calls the next step. The ignoreMime argument is
 * used for import via getFile. Default is false. The optional
 * readLibrary argument is used for reading libraries. Default is false.
 */
DriveClient.prototype.getXmlFile = function(resp, doc, success, error, ignoreMime, readLibrary)
{
	var token = gapi.auth.getToken().access_token;
	var url = resp.downloadUrl + '&access_token=' + token;
	
	// Loads XML to initialize realtime document if realtime is empty
	this.ui.loadUrl(url, mxUtils.bind(this, function(data)
	{
		if (data == null)
		{
			// TODO: Optional redirect to legacy if link is for old file
			error({message: mxResources.get('invalidOrMissingFile')});
		}
		else if (resp.mimeType == this.libraryMimeType || readLibrary)
		{
			if (resp.mimeType == this.libraryMimeType && !readLibrary)
			{
				error({message: mxResources.get('notADiagramFile')});
			}
			else
			{
				success(new DriveLibrary(this.ui, data, resp));
			}
		}
		else
		{
			if (/\.png$/i.test(resp.title))
			{
				var index = data.lastIndexOf(',');

				if (index > 0)
				{
					var xml = this.ui.extractGraphModelFromPng(data.substring(index + 1));
					
					if (xml != null && xml.length > 0)
					{
						data = xml;
					}
					else
					{
						// TODO: Import PNG
					}
				}
			}
			
			var file = new DriveFile(this.ui, data, resp, doc);
	
			// Checks if mime-type needs to be updated if the file is editable and no viewer app
			if (!ignoreMime && this.appId != '850530949725' && file.isEditable() && resp.mimeType != this.mimeType)
			{
				// Overwrites mime-type (only mutable on update when uploading new content)
				this.saveFile(file, true, mxUtils.bind(this, function(resp)
				{
					file.desc = resp;
					success(file);
				}), error, true);
			}
			else
			{
				success(file);
			}
		}
	}), error, (resp.mimeType.substring(0, 6) == 'image/' && resp.mimeType.substring(0, 9) != 'image/svg') ||
		/\.png$/i.test(resp.title) || /\.jpe?g$/i.test(resp.title));
};

/**
 * Translates this point by the given vector.
 * 
 * @param {number} dx X-coordinate of the translation.
 * @param {number} dy Y-coordinate of the translation.
 */
DriveClient.prototype.saveFile = function(file, revision, success, error, noCheck, unloading)
{
	if (file.isEditable())
	{
		var t0 = new Date().getTime();
		noCheck = (noCheck != null) ? noCheck : (!this.ui.isLegacyDriveDomain() || urlParams['ignoremime'] == '1');

		// NOTE: Unloading arg is currently ignored, saving during unload/beforeUnload is not possible using
		// asynchronous code, which is needed to create the thumbnail, or asynchronous requests which is the only
		// way to execute the gapi request below.
		// If no thumbnail is created and noCheck is true (which is always true if unloading is true) in which case
		// this code is synchronous, the executeRequest call is reached but the request is still not sent. This is
		// true for both, calls from beforeUnload and unload handlers. Note sure how to make the call synchronous
		// which is said to fix this when called from beforeUnload.
		// However, this would result in a missing thumbnail in most cases so a better solution might be to reduce
		// the autosave interval in DriveRealtime, but that would increase the number of requests.
		unloading = (unloading != null) ? unloading : false;
		
		// Adds optional thumbnail to upload request
		var doSave = mxUtils.bind(this, function(thumb, thumbMime, keepExisting)
		{
			var meta =
			{
				'mimeType': (file.constructor == DriveLibrary) ? this.libraryMimeType : this.mimeType,
				'title': file.getTitle()
			};
			
			// Specifies that no thumbnail should be uploaded in which case the existing thumbnail is used
			if (!keepExisting)
			{
				// Uses placeholder thumbnail to replace existing one except when unloading
				// in which case the XML is updated but the existing thumbnail is not in order
				// to avoid executing asynchronous code and get the XML to the server instead
				if (thumb == null && !unloading)
				{
					thumb = this.placeholderThumbnail;
					thumbMime = this.placeholderMimeType;
				}
				
				// Adds metadata for thumbnail
				if (thumb != null && thumbMime != null)
				{
					meta.thumbnail =
					{
						'image': thumb,
						'mimeType': thumbMime
					};
				}
			}

			// Updates saveDelay on drive file
			var wrapper = function()
			{
		    		file.saveDelay = new Date().getTime() - t0;
		    		success.apply(this, arguments);
			};
			
			var fn = mxUtils.bind(this, function(data, binary)
			{
				this.executeRequest(this.createUploadRequest(file.getId(), meta,
					data, revision || (file.desc.mimeType != this.mimeType &&
					file.desc.mimeType != this.libraryMimeType), binary),
					wrapper, error);
			});
			
			if (this.ui.useCanvasForExport && /(\.png)$/i.test(file.getTitle()))
			{
				this.ui.getEmbeddedPng(mxUtils.bind(this, function(data)
				{
					fn(data, true);
				}), error, (this.ui.getCurrentFile() != file) ? file.getData() : null);
			}
			else
			{
				fn(file.getData(), false);
			}
		});
		
		// Indirection to generate thumbnails if enabled and supported
		// (required because generation of thumbnails is asynchronous)
		var fn = mxUtils.bind(this, function()
		{
			// NOTE: getThumbnail is asynchronous and returns false if no thumbnails can be created
			if (unloading || file.constructor == DriveLibrary || !this.enableThumbnails || urlParams['thumb'] == '0' ||
				(file.realtime != null && !file.realtime.connected) || !this.ui.getThumbnail(this.thumbnailWidth, mxUtils.bind(this, function(canvas)
			{
				// Callback for getThumbnail
				var thumb = null;
				
				if (canvas != null)
				{
					try
					{
						// Security errors are possible
						thumb = canvas.toDataURL('image/png');
					}
					catch (e)
					{
						// ignore and continue with placeholder
					}
				}
				
				// Maximum thumbnail size is 2MB
				if (thumb == null || thumb.length > this.maxThumbnailSize)
				{
					thumb = null;
				}
				else
				{
					// Converts base64 data into required format for Drive (base64url with no prefix)
					thumb = thumb.substring(thumb.indexOf(',') + 1).replace(/\+/g, '-').replace(/\//g, '_');
				}
				
				doSave(thumb, 'image/png');
			})))
			{
				// If-branch
				doSave(null, null, file.constructor != DriveLibrary && (file.realtime == null || file.realtime.connected));
			}
		});
		
		// New revision is required if mime type changes, but the mime type should not be replaced
		// if the file has been converted to the new realtime format. To check this we make sure
		// that the mime type has not changed before updating it in the case of the legacy app.
		// Note: We need to always check the mime type because saveFile cancels previous save
		// attempts so if the save frequency is higher than the time for all retries than you
		// will never see the error message and accumulate lots of changes that will be lost.
		if (noCheck || !revision)
		{
			fn();
		}
		else
		{
			this.verifyMimeType(file.getId(), fn, true);
		}
	}
	else
	{
		this.ui.editor.graph.reset();
		
		if (error != null)
		{
			error({message: mxResources.get('readOnly')});
		}
	}
};

/**
 * Verifies the mime type of the given file ID.
 */
DriveClient.prototype.verifyMimeType = function(fileId, fn, force, error)
{
	if (this.lastMimeCheck == null)
	{
		this.lastMimeCheck = 0;
	}
	
	var now = new Date().getTime();

	if (force || now - this.lastMimeCheck > this.mimeTypeCheckCoolOff)
	{
		this.lastMimeCheck = now;

		if (!this.checkingMimeType)
		{
			this.checkingMimeType = true;
			
			this.executeRequest(gapi.client.drive.files.get({'fileId': fileId, 'fields': 'mimeType', 'supportsTeamDrives': true}), mxUtils.bind(this, function(resp)
			{
				this.checkingMimeType = false;
				
				if (resp != null && resp.mimeType == 'application/vnd.jgraph.mxfile.realtime')
				{
					this.redirectToNewApp(error, fileId);
				}
				else if (fn != null)
				{
					fn();
				}
			}));
		}
	}
};

/**
 * Checks if the client is authorized and calls the next step.
 */
DriveClient.prototype.redirectToNewApp = function(error, fileId)
{
	this.ui.spinner.stop();
	
	if (!this.redirectDialogShowing)
	{
		this.redirectDialogShowing = true;
		
		var url = window.location.protocol + '//' + this.newAppHostname + '/' + this.ui.getSearch(
			['create', 'title', 'mode', 'url', 'drive', 'splash']) + '#G' + fileId;
		
		if (error != null)
		{
			this.ui.confirm(mxResources.get('redirectToNewApp'), mxUtils.bind(this, function()
			{
				this.redirectDialogShowing = false;
				window.location.href = url;
			}), mxUtils.bind(this, function()
			{
				this.redirectDialogShowing = false;
				
				if (error != null)
				{
					error();
				}
			}));
		}
		else
		{
			this.ui.alert(mxResources.get('redirectToNewApp'), mxUtils.bind(this, function()
			{
				this.redirectDialogShowing = false;
				window.location.href = url;
			}));
		}
	}
};

/**
 * Translates this point by the given vector.
 * 
 * @param {number} dx X-coordinate of the translation.
 * @param {number} dy Y-coordinate of the translation.
 */
DriveClient.prototype.insertFile = function(title, data, folderId, success, error, mimeType, binary, allowRealtime)
{
	mimeType = (mimeType != null) ? mimeType : this.mimeType;
	allowRealtime = (allowRealtime != null) ? allowRealtime : true;
	
	var metadata =
	{
		'mimeType': mimeType,
		'title': title
	};
	
	if (folderId != null)
	{
		metadata.parents = [{'kind': 'drive#fileLink', 'id': folderId}];
	}

	// NOTE: Cannot create thumbnail on insert since no ui has no current file
	this.executeRequest(this.createUploadRequest(null, metadata, data, false, binary), mxUtils.bind(this, function(resp)
	{
		if (mimeType == this.libraryMimeType)
		{
			success(new DriveLibrary(this.ui, data, resp));
		}
		else if (resp == false)
		{
			if (error != null)
			{
				error({message: mxResources.get('errorSavingFile')});
			}
		}
		else if (allowRealtime)
		{
			this.loadRealtime(resp, mxUtils.bind(this, function(doc)
		    	{
				if (this.user != null)
				{
					var file = new DriveFile(this.ui, data, resp, doc);
				
					// Avoids creating a new revision on first autosave of new files
					file.lastAutosaveRevision = new Date().getTime();
					
		    		success(file);
				}
				else if (error != null)
				{
					error({message: mxResources.get('loggedOut')});
				}
		    	}), error);
		}
		else
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
DriveClient.prototype.createUploadRequest = function(id, metadata, data, revision, binary)
{
	binary = (binary != null) ? binary : false;
	var bd = '-------314159265358979323846';
	var delim = '\r\n--' + bd + '\r\n';
	var close = '\r\n--' + bd + '--';
	var ctype = 'application/octect-stream';

	var reqObj = 
	{
		'path': '/upload/drive/v2/files' + (id != null ? '/' + id : ''),
		'method': (id != null) ? 'PUT' : 'POST',
		'params': {'uploadType': 'multipart'},
		'headers': {'Content-Type' : 'multipart/mixed; boundary="' + bd + '"'},
		'body' : delim + 'Content-Type: application/json\r\n\r\n' + JSON.stringify(metadata) + delim +
			'Content-Type: ' + ctype + '\r\n' + 'Content-Transfer-Encoding: base64\r\n' + '\r\n' +
			((data != null) ? (binary) ? data : Base64.encode(data) : '') + close
	}
	
	if (!revision)
	{
		reqObj.params['newRevision'] = false;
	}
	
	reqObj.params['supportsTeamDrives'] = true;
	
	return gapi.client.request(reqObj);
};

/**
 * Translates this point by the given vector.
 * 
 * @param {number} dx X-coordinate of the translation.
 * @param {number} dy Y-coordinate of the translation.
 */
DriveClient.prototype.pickFile = function(fn, acceptAllFiles)
{
	this.filePickerCallback = (fn != null) ? fn : mxUtils.bind(this, function(id)
	{
		this.ui.loadFile('G' + id);
	});
	
	this.filePicked = mxUtils.bind(this, function(data)
	{
		if (data.action == google.picker.Action.PICKED)
		{
    		this.filePickerCallback(data.docs[0].id);
		}
	});
	
	if (this.ui.spinner.spin(document.body, mxResources.get('authorizing')))
	{
		this.execute(mxUtils.bind(this, function()
		{
			this.ui.spinner.stop();
	
			// Reuses picker as long as token doesn't change.
			var token = gapi.auth.getToken().access_token;
			var name = (acceptAllFiles) ? 'genericPicker' : 'filePicker';
			
			// Click on background closes dialog as workaround for blocking dialog
			// states such as 401 where the dialog cannot be closed and blocks UI
			var exit = mxUtils.bind(this, function(evt)
			{
				// Workaround for click from appIcon on second call
				if (mxEvent.getSource(evt).className == 'picker modal-dialog-bg picker-dialog-bg')
				{
					mxEvent.removeListener(document, 'click', exit);
					this[name].setVisible(false);
				}
			});
			
			if (this[name] == null || this[name + 'Token'] != token)
			{
				// FIXME: Dispose not working
//				if (this[name] != null)
//				{
//					console.log(name, this[name]);
//					this[name].dispose();
//				}
				
				this[name + 'Token'] = token;

				// Pseudo-hierarchical directory view, see
				// https://groups.google.com/forum/#!topic/google-picker-api/FSFcuJe7icQ
				var view = new google.picker.DocsView(google.picker.ViewId.FOLDERS)
			        	.setParent('root')
			        	.setIncludeFolders(true);
				
				var view2 = new google.picker.DocsView()
					.setIncludeFolders(true);
				
				var view3 = new google.picker.DocsView()
					.setEnableTeamDrives(true)
					.setIncludeFolders(true);
				
				var view4 = new google.picker.DocsUploadView()
					.setIncludeFolders(true);

				if (!acceptAllFiles)
				{
					view.setMimeTypes(this.mimeTypes);
					view2.setMimeTypes(this.mimeTypes);
					view3.setMimeTypes(this.mimeTypes);
				}
				else
				{
					view.setMimeTypes('*/*');
					view2.setMimeTypes('*/*');
					view3.setMimeTypes('*/*');
				}
				
				this[name] = new google.picker.PickerBuilder()
			        .setOAuthToken(this[name + 'Token'])
			        .setLocale(mxLanguage)
			        .setAppId(this.appId)
			        .enableFeature(google.picker.Feature.SUPPORT_TEAM_DRIVES)
			        .addView(view)
			        .addView(view2)
			        .addView(view3)
			        .addView(google.picker.ViewId.RECENTLY_PICKED)
			        .addView(view4)
			        .setCallback(mxUtils.bind(this, function(data)
			        {
			        	if (data.action == google.picker.Action.PICKED ||
			        		data.action == google.picker.Action.CANCEL)
			        	{
			        		mxEvent.removeListener(document, 'click', exit);
			        	}
		        	
			        	if (data.action == google.picker.Action.PICKED)
			    		{
			        		this.filePicked(data);
			    		}
			        })).build();
			}

			mxEvent.addListener(document, 'click', exit);
			this[name].setVisible(true);
		}));
	}
};

/**
 * Translates this point by the given vector.
 * 
 * @param {number} dx X-coordinate of the translation.
 * @param {number} dy Y-coordinate of the translation.
 */
DriveClient.prototype.pickFolder = function(fn)
{
	this.folderPickerCallback = fn;

	// Picker is initialized once and points to this function
	// which is overridden each time to the picker is shown
	var showPicker = mxUtils.bind(this, function()
	{
		if (this.ui.spinner.spin(document.body, mxResources.get('authorizing')))
		{
			this.execute(mxUtils.bind(this, function()
			{
				this.ui.spinner.stop();

				// Reuses picker as long as token doesn't change.
				var token = gapi.auth.getToken().access_token;
				var name = 'folderPicker';
				
				// Click on background closes dialog as workaround for blocking dialog
				// states such as 401 where the dialog cannot be closed and blocks UI
				var exit = mxUtils.bind(this, function(evt)
				{
					// Workaround for click from appIcon on second call
					if (mxEvent.getSource(evt).className == 'picker modal-dialog-bg picker-dialog-bg')
					{
						mxEvent.removeListener(document, 'click', exit);
						this[name].setVisible(false);
					}
				});
				
				if (this[name] == null || this[name + 'Token'] != token)
				{
					// FIXME: Dispose not working
	//				if (this[name] != null)
	//				{
	//					console.log(name, this[name]);
	//					this[name].dispose();
	//				}
					
					this[name + 'Token'] = token;
	
					// Pseudo-hierarchical directory view, see
					// https://groups.google.com/forum/#!topic/google-picker-api/FSFcuJe7icQ
					var view = new google.picker.DocsView(google.picker.ViewId.FOLDERS)
						.setParent('root')
						.setIncludeFolders(true)
						.setSelectFolderEnabled(true)
			        		.setMimeTypes('application/vnd.google-apps.folder');
					
					var view2 = new google.picker.DocsView()
						.setIncludeFolders(true)
						.setSelectFolderEnabled(true)
						.setMimeTypes('application/vnd.google-apps.folder');
					
					var view3 = new google.picker.DocsView()
						.setIncludeFolders(true)
						.setEnableTeamDrives(true)
						.setSelectFolderEnabled(true)
						.setMimeTypes('application/vnd.google-apps.folder');
					
					this[name] = new google.picker.PickerBuilder()
						.setSelectableMimeTypes('application/vnd.google-apps.folder')
				        .setOAuthToken(this[name + 'Token'])
				        .setLocale(mxLanguage)
				        .setAppId(this.appId)
					    .enableFeature(google.picker.Feature.SUPPORT_TEAM_DRIVES)
				        .addView(view)
				        .addView(view2)
				        .addView(view3)
				        .addView(google.picker.ViewId.RECENTLY_PICKED)
				        .setTitle(mxResources.get('pickFolder'))
				        .setCallback(mxUtils.bind(this, function(data)
				        {
				        	if (data.action == google.picker.Action.PICKED ||
				        		data.action == google.picker.Action.CANCEL)
				        	{
				        		mxEvent.removeListener(document, 'click', exit);
				        	}
				        	
			        		this.folderPickerCallback(data);
				        })).build();
				}
	
				mxEvent.addListener(document, 'click', exit);
				this[name].setVisible(true);
			}));
		}
	});
	
	this.ui.confirm(mxResources.get('useRootFolder'), mxUtils.bind(this, function()
	{
		this.folderPickerCallback({action: google.picker.Action.PICKED,
			docs: [{type: 'folder', id: 'root'}]});
	}), mxUtils.bind(this, function()
	{
		showPicker();
	}), mxResources.get('yes'), mxResources.get('no'));
};

/**
 * Translates this point by the given vector.
 * 
 * @param {number} dx X-coordinate of the translation.
 * @param {number} dy Y-coordinate of the translation.
 */
DriveClient.prototype.pickLibrary = function(fn)
{
	this.filePickerCallback = fn;
	
	this.filePicked = mxUtils.bind(this, function(data)
	{
		if (data.action == google.picker.Action.PICKED)
		{
    		this.filePickerCallback(data.docs[0].id);
		}
    	else if (data.action == google.picker.Action.CANCEL && this.ui.getCurrentFile() == null)
		{
    		this.ui.showSplash();
		}
	});
	
	if (this.ui.spinner.spin(document.body, mxResources.get('authorizing')))
	{
		this.execute(mxUtils.bind(this, function()
		{
			this.ui.spinner.stop();
			
			// Click on background closes dialog as workaround for blocking dialog
			// states such as 401 where the dialog cannot be closed and blocks UI
			var exit = mxUtils.bind(this, function(evt)
			{
				// Workaround for click from appIcon on second call
				if (mxEvent.getSource(evt).className == 'picker modal-dialog-bg picker-dialog-bg')
				{
					mxEvent.removeListener(document, 'click', exit);
					this.libraryPicker.setVisible(false);
				}
			});
			
			// Reuses picker as long as token doesn't change.
			var token = gapi.auth.getToken().access_token;
			
			if (this.libraryPicker == null || this.libraryPickerToken != token)
			{
				// FIXME: Dispose not working
//				if (this[name] != null)
//				{
//					console.log(name, this[name]);
//					this[name].dispose();
//				}
				
				this.libraryPickerToken = token;

				// Pseudo-hierarchical directory view, see
				// https://groups.google.com/forum/#!topic/google-picker-api/FSFcuJe7icQ
				var view = new google.picker.DocsView(google.picker.ViewId.FOLDERS)
			        	.setParent('root')
			        	.setIncludeFolders(true)
					.setMimeTypes(this.libraryMimeType + ',application/xml,text/plain,application/octet-stream');
				
				var view2 = new google.picker.DocsView()
		        		.setIncludeFolders(true)
					.setMimeTypes(this.libraryMimeType + ',application/xml,text/plain,application/octet-stream');
			
				var view3 = new google.picker.DocsView()
					.setEnableTeamDrives(true)
					.setIncludeFolders(true)
					.setMimeTypes(this.libraryMimeType + ',application/xml,text/plain,application/octet-stream');
				
				var view4 = new google.picker.DocsUploadView()
					.setIncludeFolders(true);
				
			    this.libraryPicker = new google.picker.PickerBuilder()
			        .setOAuthToken(this.libraryPickerToken)
			        .setLocale(mxLanguage)
			        .setAppId(this.appId)
			        .enableFeature(google.picker.Feature.SUPPORT_TEAM_DRIVES)
			        .addView(view)
			        .addView(view2)
			        .addView(view3)
			        .addView(google.picker.ViewId.RECENTLY_PICKED)
			        .addView(view4)
			        .setCallback(mxUtils.bind(this, function(data)
			        {
				        	if (data.action == google.picker.Action.PICKED ||
				        		data.action == google.picker.Action.CANCEL)
				        	{
				        		mxEvent.removeListener(document, 'click', exit);
				        	}
				        	
				        	if (data.action == google.picker.Action.PICKED)
				    		{
				        		this.filePicked(data);
				    		}
			        })).build();
			}
			
			mxEvent.addListener(document, 'click', exit);
			this.libraryPicker.setVisible(true);
		}));
	}
};

/**
 * Translates this point by the given vector.
 * 
 * @param {number} dx X-coordinate of the translation.
 * @param {number} dy Y-coordinate of the translation.
 */
DriveClient.prototype.showPermissions = function(id)
{
	this.checkToken(mxUtils.bind(this, function()
	{
		var shareClient = new gapi.drive.share.ShareClient(this.appId);
		shareClient.setOAuthToken(gapi.auth.getToken().access_token);
		shareClient.setItemIds([id]);
		shareClient.showSettingsDialog();
	}));
};
