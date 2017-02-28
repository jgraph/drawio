/**
 * Copyright (c) 2006-2017, JGraph Ltd
 * Copyright (c) 2006-2017, Gaudenz Alder
 */
OneDriveClient = function(editorUi)
{
	DrawioClient.call(this, editorUi, 'odauth');
	
	this.token = this.token;
	WL.init({client_id: this.clientId, redirect_uri: this.redirectUri});
};

// Extends DrawioClient
mxUtils.extend(OneDriveClient, DrawioClient);

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
 * Checks if the client is authorized and calls the next step.
 */
OneDriveClient.prototype.updateUser = function(success, error, failOnAuth)
{
	var acceptResponse = true;
	
	var timeoutThread = window.setTimeout(mxUtils.bind(this, function()
	{
		acceptResponse = false;
		error({code: App.ERROR_TIMEOUT});
	}), this.ui.timeout);
	
	mxUtils.get(this.baseUrl + '/drive?access_token=' + this.token, mxUtils.bind(this, function(req)
	{
		window.clearTimeout(timeoutThread);
		
		if (acceptResponse)
		{
			if (req.getStatus() < 200 || req.getStatus() >= 300)
			{
				if (!failOnAuth)
				{
					this.logout();
					
					this.authenticate(mxUtils.bind(this, function()
					{
						this.updateUser(success, error, true);
					}), error);
				}
				else
				{
					error({message: mxResources.get('accessDenied')});
				}
			}
			else
			{
				var data = JSON.parse(req.getText());
				this.setUser(new DrawioUser(data.owner.user.id, null, data.owner.user.displayName));
				success();
			}
		}
	}), error);
};

/**
 * Authorizes the client, gets the userId and calls <open>.
 */
OneDriveClient.prototype.authenticate = function(success, error)
{
	if (window.onOneDriveCallback == null)
	{
		var auth = mxUtils.bind(this, function()
		{
			var acceptAuthResponse = true;
			
			this.ui.showAuthDialog(this, true, mxUtils.bind(this, function(remember, authSuccess)
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
				var popup = window.open(url, 'odauth', features.join(','));
				
				if (popup != null)
				{
					window.onOneDriveCallback = mxUtils.bind(this, function(token, authWindow)
					{
						if (acceptAuthResponse)
						{
							window.onOneDriveCallback = null;
							acceptAuthResponse = false;
							
							try
							{
								if (token == null)
								{
									error({message: mxResources.get('accessDenied'), retry: auth});
								}
								else
								{
									if (authSuccess != null)
									{
										authSuccess();
									}
									
									this.setUser(null);
									this.token = token;
									
									if (remember)
									{
										this.setPersistentToken(token);
									}
									
									success();
								}
							}
							catch (e)
							{
								error(e);
							}
							finally
							{
								if (authWindow != null)
								{
									authWindow.close();
								}
							}
						}
						else if (authWindow != null)
						{
							authWindow.close();
						}
					});
				
					popup.focus();
				}
			}), mxUtils.bind(this, function()
			{
				if (acceptAuthResponse)
				{
					window.onOneDriveCallback = null;
					acceptAuthResponse = false;
					error({message: mxResources.get('accessDenied'), retry: auth});
				}
			}));
		});
		
		auth();
	}
	else
	{
		error({code: App.ERROR_BUSY});
	}
};

/**
 * Checks if the client is authorized and calls the next step.
 */
OneDriveClient.prototype.executeRequest = function(url, success, error)
{
	var doExecute = mxUtils.bind(this, function(failOnAuth)
	{
		var acceptResponse = true;
		
		var timeoutThread = window.setTimeout(mxUtils.bind(this, function()
		{
			acceptResponse = false;
			error({code: App.ERROR_TIMEOUT, retry: fn});
		}), this.ui.timeout);

		mxUtils.get(url + '?access_token=' + this.token, mxUtils.bind(this, function(req)
		{
			window.clearTimeout(timeoutThread);
			
			if (acceptResponse)
			{
				if (req.getStatus() >= 200 && req.getStatus() <= 299)
				{
					success(req);
				}
				else if (req.getStatus() === 401)
				{
					this.clearPersistentToken();
					this.setUser(null);
					this.token = null;
					
					if (!failOnAuth)
					{
						this.authenticate(function()
						{
							doExecute(true);
						}, error);
					}
					else
					{
						error({message: mxResources.get('accessDenied'), retry: mxUtils.bind(this, function()
						{
							this.authenticate(function()
							{
								fn(true);
							}, error);
						})});
					}
				}
				else
				{
					error(this.parseRequestText(req));
				}
			}
		}), error);
	});
	
	var fn = mxUtils.bind(this, function(failOnAuth)
	{
		if (this.user == null)
		{
			this.updateUser(function()
			{
				fn(true);
			}, error, failOnAuth);
		}
		else
		{
			doExecute(failOnAuth);
		}
	});

	if (this.token == null)
	{
		this.authenticate(function()
		{
			fn(true);
		}, error);
	}
	else
	{
		fn(false);
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

	this.executeRequest(this.baseUrl + '/drive/items/' + id, mxUtils.bind(this, function(req)
	{
		if (req.getStatus() >= 200 && req.getStatus() <= 299)
		{
			var meta = JSON.parse(req.getText());
			
			// Handles .vsdx, Gliffy and PNG+XML files by creating a temporary file
			if ((/\.vsdx$/i.test(meta.name) || /\.gliffy$/i.test(meta.name) || /\.png$/i.test(meta.name)))
			{
				var mimeType = (meta.file != null) ? meta.file.mimeType : null;
				this.ui.convertFile(meta['@content.downloadUrl'], meta.name, mimeType,
					this.extension, success, error);
			}
			else
			{
				var acceptResponse = true;
				
				var timeoutThread = window.setTimeout(mxUtils.bind(this, function()
				{
					acceptResponse = false;
					error({code: App.ERROR_TIMEOUT})
				}), this.ui.timeout);
				
				this.ui.loadUrl(meta['@content.downloadUrl'], mxUtils.bind(this, function(data)
	    		{
					window.clearTimeout(timeoutThread);
		    	
			    	if (acceptResponse)
			    	{
						if (asLibrary)
						{
							success(new OneDriveLibrary(this.ui, data, meta));
						}
						else
						{
							success(new OneDriveFile(this.ui, data, meta));
						}
			    	}
	    		}), mxUtils.bind(this, function(req)
				{
					window.clearTimeout(timeoutThread);
			    	
			    	if (acceptResponse)
			    	{
						error(this.parseRequestText(req));
			    	}
				}), meta.file != null && meta.file.mimeType != null &&
	    			meta.file.mimeType.substring(0, 6) == 'image/');
			}
		}
		else
		{
			error(this.parseRequestText(req));
		}
	}), error);
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
		this.checkExists(file.meta.parentReference.id, filename, false, mxUtils.bind(this, function(checked)
		{
			if (checked)
			{
				var url = this.baseUrl + '/drive/items/' + file.meta.id;
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
	var url = this.baseUrl + '/drive/items/' + id;
	this.writeFile(url, JSON.stringify({parentReference: {id: folderId}}), 'PATCH', 'application/json', success, error);
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
	
	this.checkExists(folderId, filename, true, mxUtils.bind(this, function(checked)
	{
		if (checked)
		{
			var folder = (folderId != null) ? 'items/' + folderId : 'special/documents';
			var url = this.baseUrl + '/drive/' + folder + '/children/' + filename + '/content';
			
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
		else
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
	var path = (parentId != null) ? 'items/' + parentId : 'special/documents';
	
	this.executeRequest(this.baseUrl + '/drive/' + path + '/children/' + filename, mxUtils.bind(this, function(req)
	{
		if (req.getStatus() == 404)
		{
			fn(true);
		}
		else
		{
			if (askReplace)
			{
				this.ui.spinner.stop();
				
				this.ui.confirm(mxResources.get('replaceIt', [filename]), function()
				{
					fn(true);
				}, function()
				{
					fn(false);
				});
			}
			else
			{
				this.ui.spinner.stop();
				
				this.ui.showError(mxResources.get('error'), mxResources.get('fileExists'), mxResources.get('ok'), function()
				{
					fn(false);						
				});
			}
		}
	}), function(req)
	{
		fn(false);
	}, true);
};

/**
 * Translates this point by the given vector.
 * 
 * @param {number} dx X-coordinate of the translation.
 * @param {number} dy Y-coordinate of the translation.
 */
OneDriveClient.prototype.saveFile = function(file, success, error)
{
	var url = this.baseUrl + '/drive/items/' + file.meta.id + '/content/';
	this.writeFile(url, file.getData(), 'PUT', null, success, error);
};

/**
 * Translates this point by the given vector.
 * 
 * @param {number} dx X-coordinate of the translation.
 * @param {number} dy Y-coordinate of the translation.
 */
OneDriveClient.prototype.writeFile = function(url, data, method, contentType, success, error)
{
	if (url != null && data != null)
	{
		var doExecute = mxUtils.bind(this, function(failOnAuth)
		{
			var acceptResponse = true;
			
			var timeoutThread = window.setTimeout(mxUtils.bind(this, function()
			{
				acceptResponse = false;
				error({code: App.ERROR_TIMEOUT, retry: fn});
			}), this.ui.timeout);

			var req = new mxXmlRequest(url + '?access_token=' + this.token, data, method);
	
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
			    	if (req.getStatus() >= 200 && req.getStatus() <= 299)
					{
						success(JSON.parse(req.getText()));
					}
					else if (req.getStatus() === 401)
					{
						this.clearPersistentToken();
						this.setUser(null);
						this.token = null;
						
						if (!failOnAuth)
						{
							this.authenticate(function()
							{
								doExecute(true);
							}, error);
						}
						else
						{
							error({message: mxResources.get('accessDenied'), retry: mxUtils.bind(this, function()
							{
								this.authenticate(function()
								{
									fn(true);
								}, error);
							})});
						}
					}
					else
					{
						error(this.parseRequestText(req));
					}
		    	}
			}), mxUtils.bind(this, function(req)
			{
		    	window.clearTimeout(timeoutThread);
		    	
		    	if (acceptResponse)
		    	{
					error(this.parseRequestText(req));
		    	}
			}));
		});
		
		var fn = mxUtils.bind(this, function(failOnAuth)
		{
			if (this.user == null)
			{
				this.updateUser(function()
				{
					fn(true);
				}, error, failOnAuth);
			}
			else
			{
				doExecute(failOnAuth);
			}
		});

		if (this.token == null)
		{
			this.authenticate(function()
			{
				fn(true);
			}, error);
		}
		else
		{
			fn(false);
		}
	}
	else
	{
		error({message: mxResources.get('unknownError')});
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
};

/**
 * Checks if the client is authorized and calls the next step.
 */
OneDriveClient.prototype.logout = function()
{
	this.clearPersistentToken();
	this.setUser(null);
	this.token = null;
	
	// LATER: Check why async callback does not work
	WL.logout();
};
