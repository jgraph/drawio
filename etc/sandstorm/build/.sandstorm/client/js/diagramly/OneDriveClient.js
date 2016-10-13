/**
 * Copyright (c) 2006-2016, JGraph Ltd
 * Copyright (c) 2006-2016, Gaudenz Alder
 */
/**
 * Constructs a new point for the optional x and y coordinates. If no
 * coordinates are given, then the default values for <x> and <y> are used.
 * @constructor
 * @class Implements a basic 2D point. Known subclassers = {@link mxRectangle}.
 * @param {number} x X-coordinate of the point.
 * @param {number} y Y-coordinate of the point.
 */
OneDriveClient = function(editorUi)
{
	mxEventSource.call(this);
	
	/**
	 * Holds a reference to the UI. Needed for the sharing client.
	 */
	this.ui = editorUi;
};

// Extends mxEventSource
mxUtils.extend(OneDriveClient, mxEventSource);

/**
 * Specifies if thumbnails should be enabled. Default is true.
 * LATER: If thumbnails are disabled, make sure to replace the
 * existing thumbnail with the placeholder only once.
 */
OneDriveClient.prototype.clientId = (window.location.hostname == 'test.draw.io') ? '0000000048148130' :
	((window.location.hostname == 'drive.draw.io') ? '000000004413EC37' : '0000000040145A19');

/**
 * OAuth 2.0 scopes for installing Drive Apps.
 */
OneDriveClient.prototype.scopes = 'wl.skydrive_update wl.signin';

/**
 * OAuth 2.0 scopes for installing Drive Apps.
 */
OneDriveClient.prototype.redirectUri = 'https://' + window.location.hostname + '/onedrive.html';

/**
 * Executes the first step for connecting to Google Drive.
 */
OneDriveClient.prototype.extension = '.html';

/**
 * Executes the first step for connecting to Google Drive.
 */
OneDriveClient.prototype.baseUrl = 'https://api.onedrive.com/v1.0';

/**
 * Authorizes the client, gets the userId and calls <open>.
 */
OneDriveClient.prototype.setUser = function(user)
{
	this.user = user;
	this.fireEvent(new mxEventObject('userChanged'));
};

/**
 * 
 */
OneDriveClient.prototype.clearCookie = function()
{
	var expiration = new Date();
	expiration.setYear(expiration.getFullYear() - 1);
	document.cookie = 'odauth=; expires=' + expiration.toUTCString();	
};

/**
 * Authorizes the client, gets the userId and calls <open>.
 */
OneDriveClient.prototype.getUser = function()
{
	return this.user;
};

/**
 * Authorizes the client, gets the userId and calls <open>.
 */
OneDriveClient.prototype.getTokenFromCookie = function()
{
	var cookies = document.cookie;
	var name = 'odauth=';
	var start = cookies.indexOf(name);

	if (start >= 0)
	{
		start += name.length;
		var end = cookies.indexOf(';', start);
	    
		if (end < 0)
		{
			end = cookies.length;
		}
		else
		{
			postCookie = cookies.substring(end);
	    }

		var value = cookies.substring(start, end);
		
		return value;
	}

	return '';
};

/**
 * Authorizes the client, gets the userId and calls <open>.
 */
OneDriveClient.prototype.execute = function(fn, userEvent)
{
	userEvent = (userEvent != null) ? userEvent : false;
	var token = this.getTokenFromCookie();
	
	if (this.getUser() != null && token != null && token.length > 0)
	{
		fn(token);
	}
	else
	{
		var next = mxUtils.bind(this, function(newToken)
		{
			if (newToken != null && newToken.length > 0)
			{
				try
				{
					// Initializes the Windows live API (needed for the picker)
					WL.init({client_id: this.clientId, redirect_uri: this.redirectUri});
					
					// Gets the user data to display a logout button in the UI
					mxUtils.get(this.baseUrl + '/drive?access_token=' + newToken, mxUtils.bind(this, function(req)
					{
						if (req.getStatus() == 200)
						{
							var data = JSON.parse(req.getText());
							this.setUser(new DrawioUser(data.owner.user.id, null, data.owner.user.displayName));
							fn(newToken);
						}
						else
						{
							// TODO: Reauth
							fn(null);
						}
					}));
				}
				catch (e)
				{
					// Happens if popups have been blocked in certain cases
					fn(null);
				}
			}
			else
			{
				fn(null);
			}
		});
		
		if (token != null && token.length > 0)
		{
			next(token);
		}
		else
		{
			var auth = mxUtils.bind(this, function()
			{
				var url = 'https://login.live.com/oauth20_authorize.srf?client_id=' + this.clientId +
					'&scope=' + encodeURIComponent(this.scopes) + '&response_type=token' +
					'&redirect_uri=' + encodeURIComponent(this.redirectUri);
	
				var width = 525,
					height = 525,
					screenX = window.screenX,
					screenY = window.screenY,
					outerWidth = window.outerWidth,
					outerHeight = window.outerHeight;
	
				var left = screenX + Math.max(outerWidth - width, 0) / 2;
				var top = screenY + Math.max(outerHeight - height, 0) / 2;
	
				var features = ['width=' + width, 'height=' + height,
				                'top=' + top, 'left=' + left,
				                'status=no', 'resizable=yes',
				                'toolbar=no', 'menubar=no',
				                'scrollbars=yes'];
				var popup = window.open(url, 'oauth', features.join(','));

				if (popup != null)
				{
					// Sets temporary global callback for auth popup
					window.onAuthenticated = mxUtils.bind(this, function(newToken, authWindow)
					{
						window.onAuthenticated = null;

						if (authWindow != null)
						{
							authWindow.close();
						}
	
						next(newToken);
					});
	
					popup.focus();
				}
			});
			
			if (userEvent)
			{
				auth();
			}
			else
			{
				// Requires a user event to about popups being blocked
				this.ui.showAuthDialog(this, false, mxUtils.bind(this, function(remember, success)
				{
					if (success != null)
					{
						success();
					}
					
					auth();
				}));
			}
		}
	}
};

/**
 * Checks if the client is authorized and calls the next step.
 */
OneDriveClient.prototype.getLibrary = function(id, success, error)
{
	this.getFile(id, success, error, false, true);
};

/**
 * Checks if the client is authorized and calls the next step.
 */
OneDriveClient.prototype.getFile = function(id, success, error, denyConvert, asLibrary)
{
	asLibrary = (asLibrary != null) ? asLibrary : false;

	var fn = mxUtils.bind(this, function()
	{
		this.execute(mxUtils.bind(this, function(token)
		{
			if (token != null)
			{
				var acceptResponse = true;
				
				var timeoutThread = window.setTimeout(mxUtils.bind(this, function()
				{
					acceptResponse = false;
					error({code: App.ERROR_TIMEOUT, retry: fn});
				}), this.ui.timeout);
				
				var err = mxUtils.bind(this, function(req)
				{
					window.clearTimeout(timeoutThread);
			    	
			    	if (acceptResponse)
			    	{
						if (error != null)
						{
							error(this.parseRequestText(req));
						}
			    	}
				});

				mxUtils.get(this.baseUrl + '/drive/items/' + id + '?access_token=' + token, mxUtils.bind(this, function(req)
				{
			    	window.clearTimeout(timeoutThread);
			    	
			    	if (acceptResponse)
			    	{
			    		if (req.getStatus() == 200)
			    		{
							var meta = JSON.parse(req.getText());

							if (!denyConvert && Graph.fileSupport && new XMLHttpRequest().upload &&
								(/(\.png)$/i.test(meta.name) || /(\.vs?dx)$/i.test(meta.name) ||
								/(\.gliffy)$/i.test(meta.name)))
							{
								this.convertFile(meta, success, error);
							}
							else
							{
								this.ui.loadUrl(meta['@content.downloadUrl'], mxUtils.bind(this, function(data)
					    		{
									if (asLibrary)
									{
										success(new OneDriveLibrary(this.ui, data, meta));
									}
									else
									{
										success(new OneDriveFile(this.ui, data, meta));
									}
					    		}), err, meta.file.mimeType == 'image/png');
							}
			    		}
			    		else if (error != null)
			    		{
			    			error(this.parseRequestText(req));
			    		}
			    	}
				}), err);
			}
			else
			{
				error();
			}
		}));
	});
	
	fn();
};

/**
 * Checks if the client is authorized and calls the next step. The optional
 * readXml argument is used for import. Default is false. The optional
 * readLibrary argument is used for reading libraries. Default is false.
 */
OneDriveClient.prototype.convertFile = function(meta, success, error)
{
	var name = meta.name;
	name = name.substring(0, name.lastIndexOf('.')) + this.extension;
	
	// Gets file data
	var url = meta['@content.downloadUrl'];
	
	this.ui.loadUrl(url, mxUtils.bind(this, function(data)
	{
		// Handles PNG+XML files
		if (meta.file.mimeType == 'image/png')
		{
			data = this.ui.extractGraphModelFromPng(data);

			if (data != null)
			{
				this.insertFile(name, data, success, error);
			}
			else if (error != null)
			{
				error({message: mxResources.get('errorLoadingFile')});
			}
		}
		else
		{		
			this.ui.parseFile(new Blob([data], {type: 'application/octet-stream'}), mxUtils.bind(this, function(xhr)
			{
				if (xhr.readyState == 4)
				{
					if (xhr.status == 200 && xhr.responseText.substring(0, 13) == '<mxGraphModel')
					{
						this.insertFile(name, xhr.responseText, success, error);
					}
					else if (error != null)
					{
						error({message: mxResources.get('errorLoadingFile')});
					}
				}
			}), meta.name);
		}
	}), error, meta.file.mimeType == 'image/png');
};

/**
 * Translates this point by the given vector.
 * 
 * @param {number} dx X-coordinate of the translation.
 * @param {number} dy Y-coordinate of the translation.
 */
OneDriveClient.prototype.renameFile = function(file, filename, success, error)
{
	if (file != null && filename != null)
	{
		// TODO: How to force overwrite file with same name?
		this.checkExists(file.meta.parentReference.id, filename, false, mxUtils.bind(this, function(checked, token)
		{
			if (checked)
			{
				var url = this.baseUrl + '/drive/items/' + file.meta.id + '?access_token=' + token;
				this.writeFile(url, JSON.stringify({name: filename}), 'PATCH', 'application/json', success, error);
			}
			else
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
OneDriveClient.prototype.moveFile = function(id, folderId, success, error)
{
	this.execute(mxUtils.bind(this, function(token)
	{
		var url = this.baseUrl + '/drive/items/' + id + '?access_token=' + token;
		this.writeFile(url, JSON.stringify({parentReference: {id: folderId}}), 'PATCH', 'application/json', success, error);
	}));
};

/**
 * Translates this point by the given vector.
 * 
 * @param {number} dx X-coordinate of the translation.
 * @param {number} dy Y-coordinate of the translation.
 */
OneDriveClient.prototype.insertLibrary = function(filename, data, success, error, folderId)
{
	this.insertFile(filename, data, success, error, true, folderId);
};

/**
 * Translates this point by the given vector.
 * 
 * @param {number} dx X-coordinate of the translation.
 * @param {number} dy Y-coordinate of the translation.
 */
OneDriveClient.prototype.insertFile = function(filename, data, success, error, asLibrary, folderId)
{
	asLibrary = (asLibrary != null) ? asLibrary : false;
	
	this.checkExists(folderId, filename, true, mxUtils.bind(this, function(checked, token)
	{
		if (checked)
		{
			var folder = (folderId != null) ? 'items/' + folderId : 'special/documents';
			var url = this.baseUrl + '/drive/' + folder + '/children/' + filename + '/content?access_token=' + token;
			
			this.writeFile(url, data, 'PUT', null, mxUtils.bind(this, function(meta)
			{
				if (asLibrary)
				{
					success(new OneDriveLibrary(this.ui, data, meta));
				}
				else
				{
					success(new OneDriveFile(this.ui, data, meta));
				}
			}), error);
		}
		else if (error != null)
		{
			error();
		}
	}))
};

/**
 * Translates this point by the given vector.
 * 
 * @param {number} dx X-coordinate of the translation.
 * @param {number} dy Y-coordinate of the translation.
 */
OneDriveClient.prototype.checkExists = function(parentId, filename, askReplace, fn)
{
	this.execute(mxUtils.bind(this, function(token)
	{
		var path = (parentId != null) ? 'items/' + parentId : 'special/documents';
		
		mxUtils.get(this.baseUrl + '/drive/' + path + '/children/' + filename + '?access_token=' + token, mxUtils.bind(this, function(req)
		{
			if (req.getStatus() == 404)
			{
				fn(true, token);
			}
			else
			{
				if (askReplace)
				{
					this.ui.spinner.stop();
					
					this.ui.confirm(mxResources.get('replaceIt', [filename]), function()
					{
						fn(true, token);
					}, function()
					{
						fn(false, token);
					});
				}
				else
				{
					this.ui.spinner.stop();
					
					this.ui.showError(mxResources.get('error'), mxResources.get('fileExists'), mxResources.get('ok'), function()
					{
						fn(false, token);						
					});
				}
			}
		}), function(req)
		{
			fn(false, token);
		});
	}));
};

/**
 * Translates this point by the given vector.
 * 
 * @param {number} dx X-coordinate of the translation.
 * @param {number} dy Y-coordinate of the translation.
 */
OneDriveClient.prototype.saveFile = function(file, success, error)
{
	this.execute(mxUtils.bind(this, function(token)
	{
		var url = this.baseUrl + '/drive/items/' + file.meta.id + '/content/?access_token=' + token;
		this.writeFile(url, file.getData(), 'PUT', null, success, error);
	}));
};

/**
 * Translates this point by the given vector.
 * 
 * @param {number} dx X-coordinate of the translation.
 * @param {number} dy Y-coordinate of the translation.
 */
OneDriveClient.prototype.writeFile = function(url, data, method, contentType, success, error)
{
	if (!this.writingFile)
	{
		if (url != null && data != null)
		{
			var acceptResponse = true;
			var timeoutThread = null;
			this.writingFile = true;
			
			// Cancels any pending requests
			if (this.requestThread != null)
			{
				window.clearTimeout(this.requestThread);
			}
	
			var fn = mxUtils.bind(this, function()
			{
				if (timeoutThread != null)
				{
					window.clearTimeout(timeoutThread);
				}
				
				timeoutThread = window.setTimeout(mxUtils.bind(this, function()
				{
					this.writingFile = false;
					acceptResponse = false;
					
					if (error != null)
					{
						error({code: App.ERROR_TIMEOUT, retry: fn});
					}
				}), this.ui.timeout);
	
				var req = new mxXmlRequest(url, data, method);
		
				req.setRequestHeaders = function(request, params)
				{
					// Space deletes content type header. Specification says "text/plain"
					// should work but returns an 415 Unsupported Media Type error
					request.setRequestHeader('Content-Type', contentType || ' ');
				};
				
				req.send(mxUtils.bind(this, function(req)
				{
			    	window.clearTimeout(timeoutThread);
			    	
			    	if (acceptResponse)
			    	{
						this.writingFile = false;
						
						// Returns 201 (created) for new resources
			    		if (req.getStatus() == 200 || req.getStatus() == 201)
			    		{
			    			if (success != null)
			    			{
			    				success(JSON.parse(req.getText()));
			    			}
			    		}
			    		else if (error != null)
			    		{
			    			error(this.parseRequestText(req));
			    		}
			    	}
				}), mxUtils.bind(this, function(req)
				{
			    	window.clearTimeout(timeoutThread);
			    	
			    	if (acceptResponse)
			    	{
						this.writingFile = false;
			    		
						if (error != null)
						{
							error(this.parseRequestText(req));
						}
			    	}
				}));
			});
			
			fn();
		}
		else if (error != null)
		{
			error();
		}
	}
	else if (error != null)
	{
		error({code: App.ERROR_BUSY});
	}
};

/**
 * Checks if the client is authorized and calls the next step.
 */
OneDriveClient.prototype.parseRequestText = function(req)
{
	var result = {message: mxResources.get('unknownError')};
	
	try
	{
		result = JSON.parse(req.getText());
	}
	catch (e)
	{
		// ignore
	}
	
	return result;
};

/**
 * Checks if the client is authorized and calls the next step.
 */
OneDriveClient.prototype.pickLibrary = function(fn)
{
	this.pickFile(fn);
};

/**
 * Checks if the client is authorized and calls the next step.
 */
OneDriveClient.prototype.pickFolder = function(fn)
{
	// Default folder not supported in OneDrive
	if (this.ui.spinner.spin(document.body, mxResources.get('loading')))
	{
		this.execute(mxUtils.bind(this, function(token)
		{
			this.ui.spinner.stop();
			
			if (token != null)
			{
		        WL.fileDialog(
		        {
		            mode: 'save'
		        }).then(
		            function (resp)
		            {
	            		fn(resp);
		            },
		            function (responseFailed)
		            {
		            	fn(null);
		            }
		        );
			}
		}));
	}
};

/**
 * Checks if the client is authorized and calls the next step.
 */
OneDriveClient.prototype.pickFile = function(fn)
{
	fn = (fn != null) ? fn : mxUtils.bind(this, function(id)
	{
		this.ui.loadFile('W' + encodeURIComponent(id));
	});
	
	// First time loading is slow so show spinner
	if (this.ui.spinner.spin(document.body, mxResources.get('loading')))
	{
		this.execute(mxUtils.bind(this, function(token)
		{
			this.ui.spinner.stop();
			
			if (token != null)
			{
		        WL.fileDialog(
		        {
		            mode: 'open',
		            select: 'multi'
		        }).then(
		            function (resp)
		            {
		            	if (resp != null && resp.data != null && resp.data.files != null)
		            	{
			            	for (var i = 0; i < resp.data.files.length; i++)
			            	{
			            		var id = resp.data.files[i].id;
			            		id = id.substring(id.lastIndexOf('.') + 1);
			            		
			            		fn(id);
			            	}
		            	}
		            },
		            function (responseFailed) {}
		        );
			}
		}));
	}
};

/**
 * Checks if the client is authorized and calls the next step.
 */
OneDriveClient.prototype.logout = function()
{
	this.setUser(null);
	this.clearCookie();
	// LATER: Check why async callback does not work
	WL.logout();
};
