/**
 * Copyright (c) 2006-2017, JGraph Ltd
 * Copyright (c) 2006-2017, Gaudenz Alder
 */
DropboxClient = function(editorUi)
{
	DrawioClient.call(this, editorUi, 'dbauth');
	
	this.client = new Dropbox({clientId: App.DROPBOX_APPKEY});
	this.client.setAccessToken(this.token);
};

// Extends DrawioClient
mxUtils.extend(DropboxClient, DrawioClient);

/**
 * FIXME: How to find name of app folder for current user. The Apps part of the
 * name is internationalized so this hardcoded check does not work everywhere.
 */
DropboxClient.prototype.appPath = '/drawio/';

/**
 * Executes the first step for connecting to Google Drive.
 */
DropboxClient.prototype.extension = '.html';

/**
 * Executes the first step for connecting to Google Drive.
 */
DropboxClient.prototype.writingFile = false;

/**
 * Executes the first step for connecting to Google Drive.
 */
DropboxClient.prototype.maxRetries = 4;

/**
 * Authorizes the client, gets the userId and calls <open>.
 */
DropboxClient.prototype.logout = function()
{
	this.client.authTokenRevoke().then(mxUtils.bind(this, function()
	{
		this.client.setAccessToken(null);
		this.clearPersistentToken();
		this.setUser(null);
		this.token = null;
	}));
};

/**
 * Checks if the client is authorized and calls the next step.
 */
DropboxClient.prototype.updateUser = function(success)
{
	var acceptResponse = true;
	
	var timeoutThread = window.setTimeout(mxUtils.bind(this, function()
	{
		acceptResponse = false;
		this.ui.handleError({code: App.ERROR_TIMEOUT});
	}), this.ui.timeout);
	
	var promise = this.client.usersGetCurrentAccount();
	promise.then(mxUtils.bind(this, function(response)
	{
    	window.clearTimeout(timeoutThread);
    	
    	if (acceptResponse)
    	{
			this.setUser(new DrawioUser(response.account_id, response.email, response.name.display_name));
			
			if (success != null)
			{
				success();
			}
    	}
	}));
	// Workaround for IE8/9 support with catch function
	promise['catch'](mxUtils.bind(this, function(err)
	{
		if (err != null && err.status === 401)
		{
			this.client.setAccessToken(null);
			this.execute(success);
		}
		else
		{
	    	window.clearTimeout(timeoutThread);
	    	
	    	if (acceptResponse)
	    	{
	    		this.setUser(null);
	    		this.ui.handleError(err);
	    	}
		}
	}));
};

/**
 * Authorizes the client, gets the userId and calls <open>.
 */
DropboxClient.prototype.execute = function(fn)
{
	if (this.client.getAccessToken() != null)
	{
		if (this.user == null)
		{
			this.updateUser(fn);
		}
		else
		{
			fn();
		}
	}
	else
	{
		this.ui.showAuthDialog(this, false, mxUtils.bind(this, function(remember, success)
		{
			this.authenticate(mxUtils.bind(this, function()
			{
				if (success != null)
				{
					success();
				}

				if (this.client.getAccessToken() != null)
				{
					this.updateUser(fn, mxUtils.bind(this, function(err)
					{
						this.ui.handleError(e);
					}));
				}
			}));
		}));
	}
};

/**
 * Authorizes the client, gets the userId and calls <open>.
 */
DropboxClient.prototype.authenticate = function(fn)
{
	window.open(this.client.getAuthenticationUrl('https://' +
		window.location.host + '/dropbox.html'), 'oauth');
	
	window.onDropboxCallback = mxUtils.bind(this, function(token, authWindow)
	{
		try
		{
			window.onDropboxCallback = null;
	
			if (authWindow != null)
			{
				authWindow.close();
			}
			
			if (token == null)
			{
				this.ui.hideDialog();
				this.ui.handleError({message: mxResources.get('cannotLogin')});
			}
			else
			{
				this.client.setAccessToken(token);
				this.setPersistentToken(token);
				fn();
			}
		}
		catch (e)
		{
			this.ui.handleError(e);
		}
	});
};

/**
 * Checks if the client is authorized and calls the next step.
 */
DropboxClient.prototype.getLibrary = function(path, success, error)
{
	this.getFile(path, success, error, true);
};

/**
 * DenyConvert is ignored in this client, just added for API compatibility.
 */
DropboxClient.prototype.getFile = function(path, success, error, asLibrary)
{
	asLibrary = (asLibrary != null) ? asLibrary : false;
	
	var fn = mxUtils.bind(this, function()
	{
		this.execute(mxUtils.bind(this, function()
		{
			if (/^https:\/\//i.test(path) || /\.vsdx$/i.test(path) || /\.gliffy$/i.test(path) || /\.png$/i.test(path))
			{
				var tokens = path.split('/');
				var name = (tokens.length > 0) ? tokens[tokens.length - 1] : path;
		
				this.ui.convertFile(path, name, null, this.extension, success, error);
			}
			else
			{
				var arg = {path: '/' + path};
				
				if (urlParams['rev'] != null)
				{
					arg.rev = urlParams['rev'];
				}
				
				this.readFile(arg, mxUtils.bind(this, function(data, response)
				{
		    		success((asLibrary) ? new DropboxLibrary(this.ui, data, response) :
		    			new DropboxFile(this.ui, data, response));
				}), error);
			}
		}));
	});
	
	fn();
};

/**
 * Translates this point by the given vector.
 * 
 * @param {number} dx X-coordinate of the translation.
 * @param {number} dy Y-coordinate of the translation.
 */
DropboxClient.prototype.readFile = function(arg, success, error)
{
	var acceptResponse = true;
	
	var timeoutThread = window.setTimeout(mxUtils.bind(this, function()
	{
		acceptResponse = false;
		error({code: App.ERROR_TIMEOUT});
	}), this.ui.timeout);
	
	// Workaround for Uncaught DOMException in filesDownload is to
	// execute a checkExists in parallel to "catch" the file not found case
	this.checkExists(arg.path.substring(1), mxUtils.bind(this, function(checked, exists)
	{
    	window.clearTimeout(timeoutThread);
	    
    	if (acceptResponse && !exists)
    	{
    		acceptResponse = false;
			error({message: mxResources.get('fileNotFound')});
    	}
	}), true);
	
	// Download file in parallel
	// LATER: Report Uncaught DOMException with path/not_found in filesDownload
	var promise = this.client.filesDownload(arg);
	promise.then(mxUtils.bind(this, function(response)
	{
    	window.clearTimeout(timeoutThread);
	    
    	if (acceptResponse)
    	{
    		acceptResponse = false;
    		
			try
			{
				var reader = new FileReader();
				
				reader.onload = mxUtils.bind(this, function(event)
				{
					success(reader.result, response);
				});
				
				reader.readAsText(response.fileBlob);
			}
			catch (e)
			{
				error(e);
			}
    	}
	}));
	// Workaround for IE8/9 support with catch function
	promise['catch'](function(err)
	{
    	window.clearTimeout(timeoutThread);
	    
    	if (acceptResponse)
    	{
    		acceptResponse = false;
    		error(e);
    	}
	});
};

/**
 * Translates this point by the given vector.
 * 
 * @param {number} dx X-coordinate of the translation.
 * @param {number} dy Y-coordinate of the translation.
 */
DropboxClient.prototype.checkExists = function(filename, fn, noConfirm)
{
	var promise = this.client.filesGetMetadata({path: '/' + filename.toLowerCase(), include_deleted: false});
	promise.then(mxUtils.bind(this, function(response)
	{
		if (noConfirm)
		{
			fn(false, true, response);
		}
		else
		{
			this.ui.confirm(mxResources.get('replaceIt', [filename]), function()
			{
				fn(true, true, response);
			}, function()
			{
				fn(false, true, response);
			});
		}
	}));
	// Workaround for IE8/9 support with catch function
	promise['catch'](function(err)
	{
		fn(true, false);
	});
};

/**
 * Translates this point by the given vector.
 * 
 * @param {number} dx X-coordinate of the translation.
 * @param {number} dy Y-coordinate of the translation.
 */
DropboxClient.prototype.renameFile = function(file, filename, success, error)
{
	if (/[\\\/:\?\*"\|]/.test(filename))
	{
		error({message: mxResources.get('dropboxCharsNotAllowed')});
	}
	else
	{
		// Appends working directory of source file
		if (file != null && filename != null)
		{
			var path = file.stat.path_display.substring(1);
			var idx = path.lastIndexOf('/');
			
			if (idx > 0)
			{
				filename = path.substring(0, idx + 1) + filename;
			}
		}
		
		if (file != null && filename != null && file.stat.path_lower.substring(1) !== filename.toLowerCase())
		{
			// Checks if file exists
			this.execute(mxUtils.bind(this, function()
			{
				this.checkExists(filename, mxUtils.bind(this, function(checked, exists, response)
				{
					if (checked)
					{
						var thenHandler = mxUtils.bind(this, function(deleteResponse)
						{
							// Uses write and remove because move does not allow overwriting an existing target
							var move = this.client.filesMove({from_path: file.stat.path_display, to_path: '/' +
								filename, autorename: false});
							move.then(mxUtils.bind(this, function(response)
							{
								success(response);
							}))
							// Workaround for IE8/9 support with catch function
							move['catch'](error);
						});
						
						// API fails on same name with different upper-/lowercase
						if (!exists || response.path_lower.substring(1) === filename.toLowerCase())
						{
							thenHandler();
						}
						else
						{
							// Deletes file first to avoid conflict in filesMove (non-atomic)
							var promise = this.client.filesDelete({path: '/' + filename.toLowerCase()});
							promise.then(thenHandler);
							// Workaround for IE8/9 support with catch function
							promise['catch'](error);
						}
					}
					else
					{
						error();
					}
				}));
			}));
		}
		else
		{
			// Same name with different upper-/lowercase
			// is not supported by Dropbox API
			error({message: mxResources.get('invalidName')});
		}
	}
};

/**
 * Translates this point by the given vector.
 * 
 * @param {number} dx X-coordinate of the translation.
 * @param {number} dy Y-coordinate of the translation.
 */
DropboxClient.prototype.insertLibrary = function(filename, data, success, error)
{
	this.insertFile(filename, data, success, error, true);
};

/**
 * Translates this point by the given vector.
 * 
 * @param {number} dx X-coordinate of the translation.
 * @param {number} dy Y-coordinate of the translation.
 */
DropboxClient.prototype.insertFile = function(filename, data, success, error, asLibrary)
{
	asLibrary = (asLibrary != null) ? asLibrary : false;
	
	this.execute(mxUtils.bind(this, function()
	{
		this.checkExists(filename, mxUtils.bind(this, function(checked)
		{
			if (checked)
			{
				this.writeFile(filename, data, mxUtils.bind(this, function(stat)
				{
					if (asLibrary)
					{
						success(new DropboxLibrary(this.ui, data, stat));
					}
					else
					{
						success(new DropboxFile(this.ui, data, stat));
					}
				}), error);
			}
			else
			{
				error();
			}
		}));
	}));
};

/**
 * Translates this point by the given vector.
 * 
 * @param {number} dx X-coordinate of the translation.
 * @param {number} dy Y-coordinate of the translation.
 */
DropboxClient.prototype.saveFile = function(filename, data, success, error)
{
	this.execute(mxUtils.bind(this, function()
	{
		this.writeFile(filename, data, success, error);
	}));
};

/**
 * Translates this point by the given vector.
 * 
 * @param {number} dx X-coordinate of the translation.
 * @param {number} dy Y-coordinate of the translation.
 */
DropboxClient.prototype.writeFile = function(filename, data, success, error)
{
	if (/[\\\/:\?\*"\|]/.test(filename))
	{
		if (error != null)
		{
			error({message: mxResources.get('dropboxCharsNotAllowed')});
		}
	}
	else if (data.length >= 150000000 /*150MB*/)
	{
		if (error != null)
		{
			error({message: mxResources.get('drawingTooLarge') + ' (' +
				this.ui.formatFileSize(data.length) + ' / 150 MB)'});
		}
	}
	else if (this.writingFile)
	{
		if (error != null)
		{
			error({code: App.ERROR_BUSY});
		}
	}
	else
	{
		this.writingFile = true;
		
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
			
			var promise = this.client.filesUpload({path: '/' + filename, mode: {'.tag': 'overwrite'},
				contents: new Blob([data], {type: 'text/plain'})});
			promise.then(mxUtils.bind(this, function(response)
			{
		    	window.clearTimeout(timeoutThread);
			    
		    	if (acceptResponse)
		    	{
					this.writingFile = false;
					
					try
					{
						if (success != null)
						{
							success(response);
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
			// Workaround for IE8/9 support with catch function
			promise['catch'](mxUtils.bind(this, function(err)
			{
		    	window.clearTimeout(timeoutThread);
			    
		    	if (acceptResponse)
				{
		    		// LATER: Check error codes where a retry makes sense
					if (retryCount < this.maxRetries)
					{
						retryCount++;
						var jitter = 1 + 0.1 * (Math.random() - 0.5);
						this.requestThread = window.setTimeout(fn, Math.round(Math.pow(2, retryCount) * jitter * 1000));
					}
					else
					{
						this.writingFile = false;
						
						if (error != null)
						{
							error(err);
						}
					}
				}
			}));
		});
		
		fn();
	}
};

/**
 * Translates this point by the given vector.
 * 
 * @param {number} dx X-coordinate of the translation.
 * @param {number} dy Y-coordinate of the translation.
 */
DropboxClient.prototype.pickLibrary = function(fn)
{
	// Authentication will be carried out on open to make sure the
	// autosave does not show an auth dialog. Showing it here will
	// block the second dialog (the file picker) so it's too early.
	Dropbox.choose(
	{
		linkType : 'direct',
		cancel: mxUtils.bind(this, function()
		{
			// do nothing
        }),
		success : mxUtils.bind(this, function(files)
		{
			if (this.ui.spinner.spin(document.body, mxResources.get('loading')))
			{
				var error = mxUtils.bind(this, function(e)
				{
					this.ui.spinner.stop();
					this.ui.handleError(e);
				});
				
				var tmp = files[0].link.indexOf(this.appPath);
	
				if (tmp > 0)
				{
					// Checks if file is in app folder by loading file from there and comparing relative path and size
					// KNOWN: This check fails if a file is inside a drawio directory with same relative path and size
					this.execute(mxUtils.bind(this, function()
					{		
						var rel = decodeURIComponent(files[0].link.substring(tmp + this.appPath.length - 1));
						
						this.readFile({path: rel}, mxUtils.bind(this, function(data, stat)
						{
							if (stat != null && parseInt(files[0].bytes) === parseInt(stat.size) && rel === stat.path_display)
							{
								// No need to load file a second time
								try
								{
									this.ui.spinner.stop();
									fn(rel.substring(1), new DropboxLibrary(this.ui, data, stat));
								}
								catch (e)
								{
									this.ui.handleError(e);
								}
							}
							else
							{
								this.createLibrary(files[0], fn, error);
							}
						}), error);
					}));
				}
				else
				{
					this.execute(mxUtils.bind(this, function()
					{
						this.createLibrary(files[0], fn, error);
					}));
				}
			}
		})
	});
};

/**
 * Translates this point by the given vector.
 * 
 * @param {number} dx X-coordinate of the translation.
 * @param {number} dy Y-coordinate of the translation.
 */
DropboxClient.prototype.createLibrary = function(file, success, error)
{
	this.ui.confirm(mxResources.get('note') + ': ' + mxResources.get('fileWillBeSavedInAppFolder', [file.name]), mxUtils.bind(this, function()
	{
		this.ui.loadUrl(file.link, mxUtils.bind(this, function(data)
	    {
	    	this.insertFile(file.name, data, mxUtils.bind(this, function(newFile)
	    	{
	    		try
	    		{
	    			this.ui.spinner.stop();
		    		success(newFile.getHash().substring(1), newFile);
				}
				catch (e)
				{
					error(e);
				}
	    	}), error, true);
	    }), error);
	}), mxUtils.bind(this, function()
	{
		this.ui.spinner.stop();
	}));
};

/**
 * Translates this point by the given vector.
 * 
 * @param {number} dx X-coordinate of the translation.
 * @param {number} dy Y-coordinate of the translation.
 */
DropboxClient.prototype.pickFile = function(fn, readOnly)
{
	if (Dropbox.choose != null)
	{
		fn = (fn != null) ? fn : mxUtils.bind(this, function(path, file)
		{
			this.ui.loadFile((path != null) ? 'D' + encodeURIComponent(path) : file.getHash(), null, file);
		});
		
		// Authentication will be carried out on open to make sure the
		// autosave does not show an auth dialog. Showing it here will
		// block the second dialog (the file picker) so it's too early.
		Dropbox.choose(
		{
			linkType : 'direct',
			cancel: mxUtils.bind(this, function()
			{
				// do nothing
	        }),
			success : mxUtils.bind(this, function(files)
			{
				if (this.ui.spinner.spin(document.body, mxResources.get('loading')))
				{
					// File used for read-only
					if (readOnly)
					{
						this.ui.spinner.stop();
						fn(files[0].link);
					}
					else
					{
						var error = mxUtils.bind(this, function(e)
						{
							this.ui.spinner.stop();
							this.ui.handleError(e);
						});
						
						var success = mxUtils.bind(this, function(path, file)
						{
							this.ui.spinner.stop();
							fn(path, file);
						});
						
						if ((/\.vsdx$/i.test(files[0].name) || /\.gliffy$/i.test(files[0].name) ||
							/\.png$/i.test(files[0].name)))
						{
							success(files[0].link);
						}
						else
						{
							var tmp = files[0].link.indexOf(this.appPath);
							
							if (tmp > 0)
							{
								// Checks if file is in app folder by loading file from there and comparing relative path and size
								// KNOWN: This check fails if a file is inside a drawio directory with same relative path and size
								this.execute(mxUtils.bind(this, function()
								{		
									var rel = decodeURIComponent(files[0].link.substring(tmp + this.appPath.length - 1));
									
									this.readFile({path: rel}, mxUtils.bind(this, function(data, stat)
									{
										if (stat != null && parseInt(files[0].bytes) === parseInt(stat.size) && rel === stat.path_display)
										{
											this.ui.spinner.stop();
											
											// No need to load file a second time
											fn(rel.substring(1), new DropboxFile(this.ui, data, stat));
										}
										else
										{
											this.createFile(files[0], success, error);
										}
									}), error);
								}));
							}
							else
							{
								this.execute(mxUtils.bind(this, function()
								{
									this.createFile(files[0], success, error);
								}));
							}
						}
					}
				}
			})
		});
	}
	else
	{
		this.ui.handleError({message: mxResources.get('serviceUnavailableOrBlocked')});
	}
};

/**
 * Translates this point by the given vector.
 * 
 * @param {number} dx X-coordinate of the translation.
 * @param {number} dy Y-coordinate of the translation.
 */
DropboxClient.prototype.createFile = function(file, success, error)
{
	this.ui.loadUrl(file.link, mxUtils.bind(this, function(data)
    {
		if (data != null && data.length > 0)
		{
			this.ui.confirm(mxResources.get('note') + ': ' + mxResources.get('fileWillBeSavedInAppFolder', [file.name]), mxUtils.bind(this, function()
			{
				this.insertFile(file.name, data, mxUtils.bind(this, function(newFile)
		    	{
					success(file.name, newFile);
		    	}), error);
			}), mxUtils.bind(this, function()
			{
	    		this.ui.spinner.stop();
			}));
		}
		else
		{
			this.ui.spinner.stop();
			
			if (error != null)
			{
				error({message: mxResources.get('errorLoadingFile')});
			}
		}
    }), error, /(\.png)$/i.test(file.name));
};
