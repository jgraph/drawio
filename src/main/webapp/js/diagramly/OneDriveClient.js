/**
 * Copyright (c) 2006-2017, JGraph Ltd
 * Copyright (c) 2006-2017, Gaudenz Alder
 */
OneDriveClient = function(editorUi)
{
	DrawioClient.call(this, editorUi, 'oneDriveAuthInfo');
	
	var authInfo = JSON.parse(this.token);
	
	if (authInfo != null)
	{
		this.token = authInfo.access_token;
		this.endpointHint = authInfo.endpointHint;
		this.tokenExpiresOn = authInfo.expiresOn;
		
		var remainingTime = (this.tokenExpiresOn - Date.now()) / 1000;
		this.resetTokenRefresh(remainingTime < 600? 1 : remainingTime); //10 min tolerance window in case of any rounding errors
	}
};

// Extends DrawioClient
mxUtils.extend(OneDriveClient, DrawioClient);

/**
 * Specifies if thumbnails should be enabled. Default is true.
 * LATER: If thumbnails are disabled, make sure to replace the
 * existing thumbnail with the placeholder only once.
 */
OneDriveClient.prototype.clientId = window.DRAWIO_MSGRAPH_CLIENT_ID || ((window.location.hostname == 'test.draw.io') ?
	'2e598409-107f-4b59-89ca-d7723c8e00a4' : '45c10911-200f-4e27-a666-9e9fca147395');

/**
 * OAuth 2.0 scopes for installing Drive Apps.
 */
OneDriveClient.prototype.scopes = 'user.read files.readwrite.all offline_access';

/**
 * OAuth 2.0 scopes for installing Drive Apps.
 */
OneDriveClient.prototype.redirectUri = window.location.protocol + '//' + window.location.host + '/microsoft';
OneDriveClient.prototype.pickerRedirectUri = window.location.protocol + '//' + window.location.host + '/onedrive3.html';

/**
 * This is the default endpoint for personal accounts
 */
OneDriveClient.prototype.defEndpointHint = 'api.onedrive.com'; 
OneDriveClient.prototype.endpointHint = OneDriveClient.prototype.defEndpointHint;

/**
 * Executes the first step for connecting to Google Drive.
 */
OneDriveClient.prototype.extension = '.drawio';

/**
 * Executes the first step for connecting to Google Drive.
 */
OneDriveClient.prototype.baseUrl = 'https://graph.microsoft.com/v1.0';

/**
 * Empty function used when no callback is needed
 */
OneDriveClient.prototype.emptyFn = function(){};

OneDriveClient.prototype.invalidFilenameRegExs = [
	/[~"#%\*:<>\?\/\\{\|}]/,
	/^\.lock$/i,
	/^CON$/i,
	/^PRN$/i,
	/^AUX$/i,
	/^NUL$/i,
	/^COM\d$/i,
	/^LPT\d$/i,
	/^desktop\.ini$/i,
	/_vti_/i
];

/**
 * Check if the file/folder name is valid
 */
OneDriveClient.prototype.isValidFilename = function(filename)
{
	if (filename == null || filename === '') return false;
	
	for (var i = 0; i < this.invalidFilenameRegExs.length; i++)
	{
		if (this.invalidFilenameRegExs[i].test(filename)) return false;
	}
	
	return true;
};


/**
 * Checks if the client is authorized and calls the next step.
 */
OneDriveClient.prototype.get = function(url, onload, onerror)
{
	var req = new mxXmlRequest(url, null, 'GET');
	
	req.setRequestHeaders = mxUtils.bind(this, function(request, params)
	{
		request.setRequestHeader('Authorization', 'Bearer ' + this.token);
	});
	
	req.send(onload, onerror);
	
	return req;
};

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
	
	this.get(this.baseUrl + '/me', mxUtils.bind(this, function(req)
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
				this.setUser(new DrawioUser(data.id, null, data.displayName));
				success();
			}
		}
	}), error);
};

OneDriveClient.prototype.resetTokenRefresh = function(expires_in)
{
	if (this.tokenRefreshThread != null)
	{
		window.clearTimeout(this.tokenRefreshThread);
		this.tokenRefreshThread = null;
	}

	// Starts timer to refresh token before it expires
	if (expires_in > 0)
	{
		this.tokenRefreshInterval = expires_in * 1000;
		
		this.tokenRefreshThread = window.setTimeout(mxUtils.bind(this, function()
		{
			//Get a new fresh accessToken
			this.authenticate(this.emptyFn, this.emptyFn, true);
		}), expires_in * 900);
	}
};


/**
 * Authorizes the client, gets the userId and calls <open>.
 */
OneDriveClient.prototype.authenticate = function(success, error, failOnAuth)
{
	if (window.onOneDriveCallback == null)
	{
		var auth = mxUtils.bind(this, function()
		{
			var acceptAuthResponse = true;
			
			//Retry request with refreshed token
			var authInfo = JSON.parse(this.getPersistentToken(true));
			
			if (authInfo != null)
			{
				var req = new mxXmlRequest(this.redirectUri + '?refresh_token=' + authInfo.refresh_token, null, 'GET');
				
				req.send(mxUtils.bind(this, function(req)
				{
					if (req.getStatus() >= 200 && req.getStatus() <= 299)
					{
						var authInfo = JSON.parse(req.getText());
						this.token = authInfo.access_token;
						authInfo.access_token = authInfo.access_token;
						authInfo.refresh_token = authInfo.refresh_token;
						authInfo.expiresOn = Date.now() + authInfo.expires_in * 1000;
						this.tokenExpiresOn = authInfo.expiresOn;
						
						this.setPersistentToken(JSON.stringify(authInfo), !authInfo.remember);
						this.resetTokenRefresh(authInfo.expires_in);
						
						success();
					}
					else 
					{
						this.clearPersistentToken();
						this.setUser(null);
						this.token = null;

						if (req.getStatus() == 401 && !failOnAuth) // (Unauthorized) [e.g, invalid refresh token]
						{
							auth();
						}
						else
						{
							error({message: mxResources.get('accessDenied'), retry: auth});
						}
					}
				}), error);
			}
			else
			{
				this.ui.showAuthDialog(this, true, mxUtils.bind(this, function(remember, authSuccess)
				{
					var url = 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize' +
						'?client_id=' + this.clientId + '&response_type=code' +
						'&redirect_uri=' + encodeURIComponent(this.redirectUri) +
						'&scope=' + encodeURIComponent(this.scopes);
	
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
						window.onOneDriveCallback = mxUtils.bind(this, function(authInfo, authWindow)
						{
							if (acceptAuthResponse)
							{
								window.onOneDriveCallback = null;
								acceptAuthResponse = false;
								
								try
								{
									if (authInfo == null)
									{
										error({message: mxResources.get('accessDenied'), retry: auth});
									}
									else
									{
										if (authSuccess != null)
										{
											authSuccess();
										}
										
										//IE had a security issue on accessing this object outside this callback
										//this.authInfo = authInfo;
										this.setUser(null);
										this.token = authInfo.access_token;
										authInfo.expiresOn = Date.now() + authInfo.expires_in * 1000;
										this.tokenExpiresOn = authInfo.expiresOn;

										authInfo.remember = remember;
										this.setPersistentToken(JSON.stringify(authInfo), !remember);
										this.resetTokenRefresh(authInfo.expires_in);

										//Find out the type of the account + endpoint
										this.getAccountTypeAndEndpoint(mxUtils.bind(this, function()
										{
											success();
										}), error);
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
			}
		});
		
		auth();
	}
	else
	{
		error({code: App.ERROR_BUSY});
	}
};


OneDriveClient.prototype.getAccountTypeAndEndpoint = function(success, error)
{
	this.get(this.baseUrl + '/me/drive/root', mxUtils.bind(this, function(req)
	{
		try
		{
			if (req.getStatus() >= 200 && req.getStatus() <= 299)
			{
				var resp = JSON.parse(req.getText());
				
				if (resp.webUrl.indexOf('.sharepoint.com') > 0) 
			 	{
					this.endpointHint = resp.webUrl;
				}
				else
				{
					this.endpointHint = this.defEndpointHint;
				}
				
			 	//Update authInfo with endpointHint
			 	var authInfo = JSON.parse(this.getPersistentToken(true));
			 	
			 	if (authInfo != null)
		 		{
				 	authInfo.endpointHint = this.endpointHint;
				 	this.setPersistentToken(JSON.stringify(authInfo), !authInfo.remember);
		 		}
			 	
				success();
				return;
			}
		}
		catch(e) {}
		//It is expected to work as this call immediately follows getting a fresh access token
		error({message: mxResources.get('unknownError') + ' (Code: ' + req.getStatus() + ')'});
		
	}), error);
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
			error({code: App.ERROR_TIMEOUT, retry: doExecute});
		}), this.ui.timeout);

		this.get(url, mxUtils.bind(this, function(req)
		{
			window.clearTimeout(timeoutThread);
			
			if (acceptResponse)
			{
				// 404 (file not found) is a valid response for checkExists
				if ((req.getStatus() >= 200 && req.getStatus() <= 299) || req.getStatus() == 404)
				{
					if (this.user == null)
					{
						this.updateUser(this.emptyFn, this.emptyFn, true);
					}
					
					success(req);
				}
				// 400 is returns if wrong user for this file
				else if (!failOnAuth && (req.getStatus() === 401 || req.getStatus() === 400))
				{
					//Authorize again using the refresh token
					this.authenticate(function()
					{
						doExecute(true);
					}, error, failOnAuth);
				}
				else
				{
					error(this.parseRequestText(req));
				}
			}
		}), error);
	});
	
	if (this.token == null || this.tokenExpiresOn - Date.now() < 60000) //60 sec tolerance window
	{
		this.authenticate(function()
		{
			doExecute(true);
		}, error);
	}
	else
	{
		doExecute(false);
	}
};

/**
 * Checks if the client is authorized and calls the next step.
 */
OneDriveClient.prototype.checkToken = function(fn)
{
	if (this.token == null || this.tokenRefreshThread == null || this.tokenExpiresOn - Date.now() < 60000)
	{
		this.authenticate(fn, this.emptyFn);
	}
	else
	{
		fn();
	}
};

OneDriveClient.prototype.getItemRef = function(id)
{
	var idParts = id.split('/');
	
	if (idParts.length > 1)
	{
		return {driveId: idParts[0], id: idParts[1]};
	}
	else
	{
		return {id: id};
	}
};

OneDriveClient.prototype.getItemURL = function(id, relative)
{
	var idParts = id.split('/');
	
	if (idParts.length > 1)
	{
		var driveId = idParts[0];
		var itemId = idParts[1];
		return (relative? '' : this.baseUrl) + '/drives/' + driveId + '/items/' + itemId;
	}
	else
	{
		return (relative? '' : this.baseUrl) + '/me/drive/items/' + id;
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

	this.executeRequest(this.getItemURL(id), mxUtils.bind(this, function(req)
	{
		if (req.getStatus() >= 200 && req.getStatus() <= 299)
		{
			var meta = JSON.parse(req.getText());
			var binary = /\.png$/i.test(meta.name);
			
			// Handles .vsdx, Gliffy and PNG+XML files by creating a temporary file
			if (/\.v(dx|sdx?)$/i.test(meta.name) || /\.gliffy$/i.test(meta.name) ||
				(!this.ui.useCanvasForExport && binary))
			{
				var mimeType = (meta.file != null) ? meta.file.mimeType : null;
				this.ui.convertFile(meta['@microsoft.graph.downloadUrl'], meta.name, mimeType,
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
				
				this.ui.loadUrl(meta['@microsoft.graph.downloadUrl'], mxUtils.bind(this, function(data)
				{
					try
					{
						window.clearTimeout(timeoutThread);
			    	
				    	if (acceptResponse)
				    	{
							var index = (binary) ? data.lastIndexOf(',') : -1;
							var file = null;
	
							if (index > 0)
							{
								var xml = this.ui.extractGraphModelFromPng(data.substring(index + 1));
								
								if (xml != null && xml.length > 0)
								{
									data = xml;
								}
								else
								{
									// Imports as PNG image
									file = new LocalFile(this.ui, data, meta.name, true);
								}
							}
							// Checks for base64 encoded mxfile
							else if (data.substring(0, 32) == 'data:image/png;base64,PG14ZmlsZS')
							{
								var temp = data.substring(22);
								data = (window.atob && !mxClient.IS_SF) ? atob(temp) : Base64.decode(temp);
							}
							
							if (Graph.fileSupport && new XMLHttpRequest().upload && this.ui.isRemoteFileFormat(data, meta['@microsoft.graph.downloadUrl']))
							{
								this.ui.parseFile(new Blob([data], {type: 'application/octet-stream'}), mxUtils.bind(this, function(xhr)
								{
									try
									{
										if (xhr.readyState == 4)
										{
											if (xhr.status >= 200 && xhr.status <= 299)
											{
												success(new LocalFile(this.ui, xhr.responseText, meta.name + this.extension, true));
											}
											else if (error != null)
											{
												error({message: mxResources.get('errorLoadingFile')});
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
								}), meta.name);
							}
							else
							{
								if (file != null)
								{
									success(file);
								}
								else if (asLibrary)
								{
									success(new OneDriveLibrary(this.ui, data, meta));
								}
								else
								{
									success(new OneDriveFile(this.ui, data, meta));
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
						else
						{
							throw e;
						}
					}
    			}), mxUtils.bind(this, function(req)
				{
					window.clearTimeout(timeoutThread);
			    	
			    	if (acceptResponse)
			    	{
			    		error(this.parseRequestText(req));
			    	}
				}), binary || (meta.file != null && meta.file.mimeType != null &&
					meta.file.mimeType.substring(0, 6) == 'image/'));
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
		if (!this.isValidFilename(filename))
		{
			error({message: this.invalidFilenameRegExs[0].test(filename) ?
					mxResources.get('oneDriveCharsNotAllowed') : mxResources.get('oneDriveInvalidDeviceName')});
			return;
		}
		
		// TODO: How to force overwrite file with same name?
		this.checkExists(file.getParentId(), filename, false, mxUtils.bind(this, function(checked)
		{
			if (checked)
			{
				this.writeFile(this.getItemURL(file.getId()), JSON.stringify({name: filename}), 'PATCH', 'application/json', success, error);
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
	//check that the source and destination are on the same drive
	var folderInfo = this.getItemRef(folderId);
	var fileInfo = this.getItemRef(id);
	
	if (folderInfo.driveId != fileInfo.driveId)
	{
		error({message: mxResources.get('cannotMoveOneDrive', null, 'Moving a file between accounts is not supported yet.')});
	}
	else 
	{
		this.writeFile(this.getItemURL(id), JSON.stringify({parentReference: folderInfo}), 'PATCH', 'application/json', success, error);
	}
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
	if (!this.isValidFilename(filename))
	{
		error({message: this.invalidFilenameRegExs[0].test(filename) ?
				mxResources.get('oneDriveCharsNotAllowed') : mxResources.get('oneDriveInvalidDeviceName')});
		return;
	}

	asLibrary = (asLibrary != null) ? asLibrary : false;
	
	this.checkExists(folderId, filename, true, mxUtils.bind(this, function(checked)
	{
		if (checked)
		{
			var folder = '/me/drive/root';
			
			if (folderId != null)
			{
				folder = this.getItemURL(folderId, true);
			}
			
			var url = this.baseUrl + folder + '/children/' + encodeURIComponent(filename) + '/content';
			
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
	var folder = '/me/drive/root';
	
	if (parentId != null) 
	{
		folder = this.getItemURL(parentId, true);
	}
	
	this.executeRequest(this.baseUrl + folder + '/children/' + encodeURIComponent(filename), mxUtils.bind(this, function(req)
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
OneDriveClient.prototype.saveFile = function(file, success, error, etag)
{
	try
	{
		var savedData = file.getData();
		
		var fn = mxUtils.bind(this, function(data)
		{
			var url = this.getItemURL(file.getId());
	
			this.writeFile(url + '/content/', data, 'PUT', null, mxUtils.bind(this, function(resp)
			{
				// Checks for truncated files in OneDrive by comparing expected and actual file size
				// Apparently in some cases the file is not truncated but the expected and actual
				// file size do still defer and cases with truncated files have not been detected
				// ie. there were no cases where the file size was significantly off.
	//			try
	//			{
	//				if (typeof window.Blob !== 'undefined')
	//				{
	//
	//					// Returns string length in bytes instead of chars to check returned file size
	//					function byteCount(str)
	//					{
	//						try
	//						{
	//							return new Blob([str]).size
	//						}
	//						catch (e)
	//						{
	//							// ignore
	//						}
	//						
	//						return null;
	//					};
	//					
	//					var exp = (typeof data === 'string') ? byteCount(data) : data.size;
	//					
	//					if (resp != null && exp != null && resp.size != exp)
	//					{
	//						// Logs failed save
	//						var user = this.getUser();
	//						
	//						EditorUi.sendReport('Critical: Truncated OneDrive File ' +
	//							new Date().toISOString() + ':' + '\n\nBrowser=' + navigator.userAgent +
	//							'\nFile=' + file.getId() + '\nMime=' + file.meta.file.mimeType +
	//							'\nUser=' + ((user != null) ? user.id : 'unknown') +
	//							 	'-client_' + ((file.sync != null) ? file.sync.clientId : 'nosync') +
	//							'\nExpected=' + exp + ' Actual=' + resp.size)
	//						EditorUi.logError('Critical: Truncated OneDrive File ' + file.getId(),
	//							null, 'expected_' + exp + '-actual_' + resp.size +
	//							'-mime_' + file.meta.file.mimeType,
	//							'user-' + ((user != null) ? user.id : 'unknown') +
	//						 	((file.sync != null) ? '-client_' + file.sync.clientId : '-nosync'));
	//					}
	//				}
	//			}
	//			catch (e)
	//			{
	//				// ignore
	//			}
				
				success(resp, savedData);
			}), error, etag);
		});
		
		if (this.ui.useCanvasForExport && /(\.png)$/i.test(file.meta.name))
		{
			this.ui.getEmbeddedPng(mxUtils.bind(this, function(data)
			{
				fn(this.ui.base64ToBlob(data, 'image/png'));
			}), error, (this.ui.getCurrentFile() != file) ? savedData : null);
		}
		else
		{
			fn(savedData);
		}
	}
	catch (e)
	{
		error(e);
	}
};

/**
 * Translates this point by the given vector.
 * 
 * @param {number} dx X-coordinate of the translation.
 * @param {number} dy Y-coordinate of the translation.
 */
OneDriveClient.prototype.writeFile = function(url, data, method, contentType, success, error, etag)
{
	try
	{
		if (url != null && data != null)
		{
			//OneDrive has a limit on PUT API of 4MB, larger files needs to use the upload session method
			if (data.length >= 4000000 /*4MB*/)
			{
				error({message: mxResources.get('drawingTooLarge') + ' (' +
					this.ui.formatFileSize(data.length) + ' / 4 MB)'});
				
				return;
			}
			
			var doExecute = mxUtils.bind(this, function(failOnAuth)
			{
				try
				{
					var acceptResponse = true;
					
					var timeoutThread = window.setTimeout(mxUtils.bind(this, function()
					{
						acceptResponse = false;
						error({code: App.ERROR_TIMEOUT, retry: doExecute});
					}), this.ui.timeout);
		
					var req = new mxXmlRequest(url, data, method);
					
					req.setRequestHeaders = mxUtils.bind(this, function(request, params)
					{
						// Space deletes content type header. Specification says "text/plain"
						// should work but returns an 415 Unsupported Media Type error
						request.setRequestHeader('Content-Type', contentType || ' ');
						//TODO This header is needed for moving a file between two different drives. 
						//		Note: the response is empty when this header is used, also the server may take some time to really execute the request (i.e. async) 
						//request.setRequestHeader('Prefer', 'respond-async');
						request.setRequestHeader('Authorization', 'Bearer ' + this.token);
						
						if (etag != null)
						{
							request.setRequestHeader('If-Match', etag);
						}
					});
					
					req.send(mxUtils.bind(this, function(req)
					{
				    	window.clearTimeout(timeoutThread);
				    	
				    	if (acceptResponse)
				    	{
					    	if (req.getStatus() >= 200 && req.getStatus() <= 299)
							{
					    		if (this.user == null)
								{
									this.updateUser(this.emptyFn, this.emptyFn, true);
								}
					    		
								success(JSON.parse(req.getText()));
							}
							else if (!failOnAuth && req.getStatus() === 401)
							{
								this.authenticate(function()
								{
									doExecute(true);
								}, error, failOnAuth);
							}
							else
							{
								error(this.parseRequestText(req), req);
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
				}
				catch (e)
				{
					error(e);
				}
			});
			
			if (this.token == null || this.tokenExpiresOn - Date.now() < 60000) //60 sec tolerance window
			{
				this.authenticate(function()
				{
					doExecute(true);
				}, error);
			}
			else
			{
				doExecute(false);
			}
		}
		else
		{
			error({message: mxResources.get('unknownError')});
		}
	}
	catch (e)
	{
		error(e);
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
	this.pickFile(function(id)
	{
		// Ignores second argument
		fn(id);
	});
};

/**
 * Checks if the client is authorized and calls the next step.
 */
OneDriveClient.prototype.pickFolder = function(fn, direct)
{
	var odSaveDlg = mxUtils.bind(this, function(direct)
	{
		var openSaveDlg = mxUtils.bind(this, function()
		{
			OneDrive.save(
			{
				clientId: this.clientId,
				action: 'query',
				openInNewWindow: true,
				advanced:
				{
					'endpointHint': mxClient.IS_IE11? null : this.endpointHint, //IE11 doen't work with our modified version, so, setting endpointHint disable using our token BUT will force relogin!
					'redirectUri': this.pickerRedirectUri,
					'queryParameters': 'select=id,name,parentReference',
					'accessToken': this.token,
					isConsumerAccount: false
				},
				success: mxUtils.bind(this, function(files)
				{
					fn(files);
					
					//Update the token in case a login with a different user
					if (mxClient.IS_IE11)
					{
						this.token = files.accessToken;
					}
				}),
				cancel: mxUtils.bind(this, function()
				{
					// do nothing
				}),
				error: mxUtils.bind(this, function(e)
				{
					this.ui.showError(mxResources.get('error'), e);
				})
			});
		});
		
		if (direct)
		{
			openSaveDlg();
		}
		else
		{
			this.ui.confirm(mxResources.get('useRootFolder'), mxUtils.bind(this, function()
			{
				fn({value: [{id: 'root', name: 'root', parentReference: {driveId: 'me'}}]});
				
			}), openSaveDlg, mxResources.get('yes'), mxResources.get('noPickFolder') + '...', true);
		}
		
		if (this.user == null)
		{
			this.updateUser(this.emptyFn, this.emptyFn, true);
		}
	});
	
	if (this.token == null || this.tokenExpiresOn - Date.now() < 60000) //60 sec tolerance window
	{
		this.authenticate(mxUtils.bind(this, function()
		{
			odSaveDlg(false);
		}), this.emptyFn);
	}
	else
	{
		odSaveDlg(direct);
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
	
	var odOpenDlg = mxUtils.bind(this, function()
	{
		OneDrive.open(
		{
			clientId: this.clientId,
			action: 'query',
			multiSelect: false,
			advanced:
			{
				'endpointHint': mxClient.IS_IE11? null : this.endpointHint, //IE11 doen't work with our modified version, so, setting endpointHint disable using our token BUT will force relogin!
				'redirectUri': this.pickerRedirectUri,
				'queryParameters': 'select=id,name,parentReference', //We can also get @microsoft.graph.downloadUrl within this request but it will break the normal process
				'accessToken': this.token,
				isConsumerAccount: false
			},
			success: mxUtils.bind(this, function(files)
			{
				if (files != null && files.value != null && files.value.length > 0)
				{
					//Update the token in case a login with a different user
					if (mxClient.IS_IE11)
					{
						this.token = files.accessToken;
					}
					
					fn(OneDriveFile.prototype.getIdOf(files.value[0]), files);
				}
			}),
			cancel: mxUtils.bind(this, function()
			{
				// do nothing
			}),
			error: mxUtils.bind(this, function(e)
			{
				this.ui.showError(mxResources.get('error'), e);
			})
		});
		
		if (this.user == null)
		{
			this.updateUser(this.emptyFn, this.emptyFn, true);
		}
	});
	
	if (this.token == null || this.tokenExpiresOn - Date.now() < 60000) //60 sec tolerance window
	{
		this.authenticate(mxUtils.bind(this, function()
		{
			this.ui.showDialog(new BtnDialog(this.ui, this, mxResources.get('open'), mxUtils.bind(this, function()
			{
				odOpenDlg();
				this.ui.hideDialog();
							
			})).container, 300, 140, true, true);
		}), this.emptyFn);
	}
	else
	{
		odOpenDlg();
	}
};

/**
 * Checks if the client is authorized and calls the next step.
 */
OneDriveClient.prototype.logout = function()
{
	if (isLocalStorage)
	{
		var check = localStorage.getItem('odpickerv7cache');
		
		if (check != null && check.substring(0, 19) == '{"odsdkLoginHint":{')
		{
			localStorage.removeItem('odpickerv7cache');	
		}
	}
	
	this.clearPersistentToken();
	this.setUser(null);
	this.token = null;
};
