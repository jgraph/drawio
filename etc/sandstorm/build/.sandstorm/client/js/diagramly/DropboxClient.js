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
DropboxClient = function(editorUi)
{
	mxEventSource.call(this);
	
	/**
	 * Holds the x-coordinate of the point.
	 * @type number
	 * @default 0
	 */
	this.ui = editorUi;

	/**
	 * Holds the x-coordinate of the point.
	 * @type number
	 * @default 0
	 */
	this.client = new Dropbox.Client(
	{
		key: App.DROPBOX_APPKEY,
		sandbox: true
	});
	
	/**
	 * Holds the x-coordinate of the point.
	 * @type number
	 * @default 0
	 */
	this.client.authDriver(new Dropbox.AuthDriver.Popup(
	{
		rememberUser: true,
		receiverUrl: 'https://' + window.location.host + '/dropbox.html'
	}));
};

// Extends mxEventSource
mxUtils.extend(DropboxClient, mxEventSource);

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
DriveClient.prototype.maxRetries = 4;

/**
 * Executes the first step for connecting to Google Drive.
 */
DropboxClient.prototype.user = null;

/**
 * Executes the first step for connecting to Google Drive.
 */
DropboxClient.prototype.writingFile = false;

/**
 * Authorizes the client, gets the userId and calls <open>.
 */
DropboxClient.prototype.logout = function()
{
	this.client.signOut(mxUtils.bind(this, function()
	{
		this.setUser(null);
	}));
};

/**
 * Authorizes the client, gets the userId and calls <open>.
 */
DropboxClient.prototype.setUser = function(user)
{
	this.user = user;
	this.fireEvent(new mxEventObject('userChanged'));
};

/**
 * Authorizes the client, gets the userId and calls <open>.
 */
DropboxClient.prototype.getUser = function()
{
	return this.user;
};

/**
 * Checks if the client is authorized and calls the next step.
 */
DropboxClient.prototype.updateUser = function(success, error, remember)
{
	this.client.getUserInfo(null, mxUtils.bind(this, function(error, info)
	{
		if (error == null)
		{
			this.setUser(new DrawioUser(info.uid, info.email, info.name));
		}
		else
		{
			this.setUser(null);
		}
	}));
};

/**
 * Authorizes the client, gets the userId and calls <open>.
 */
DropboxClient.prototype.execute = function(fn)
{
	if (this.client.isAuthenticated())
	{
		fn();
	}
	else
	{
		this.authorize(false, mxUtils.bind(this, function(error, client)
		{
			if (error != null)
			{
				this.ui.handleError(error);
			}
			else
			{
				if (this.client.isAuthenticated())
				{
					this.updateUser();
					fn();
				}
				else
				{
					this.ui.showAuthDialog(this, false, mxUtils.bind(this, function(remember, success)
					{
						this.authorize(true, mxUtils.bind(this, function(error2, client)
						{
							if (error2 != null)
							{
								this.ui.handleError(error2);
							}
							else if (this.client.isAuthenticated())
							{
								this.updateUser();
								
								if (success != null)
								{
									success();
								}

								fn();
							}
						}));
					}));
				}
			}
		}));
	}
};

/**
 * Authorizes the client, gets the userId and calls <open>.
 */
DropboxClient.prototype.authorize = function(interactive, fn)
{
	this.client.authenticate({interactive: interactive}, mxUtils.bind(this, function(error, client)
	{
		if (error != null)
		{
			if (window.console != null)
			{
				console.log(error);
			}
		}
		else
		{
			fn();
		}
	}));
};

/**
 * Checks if the client is authorized and calls the next step.
 */
DropboxClient.prototype.getLibrary = function(path, success, error)
{
	this.getFile(path, success, error, false, true);
};

/**
 * DenyConvert is ignored in this client, just added for API compatibility.
 */
DropboxClient.prototype.getFile = function(path, success, error, denyConvert, asLibrary)
{
	asLibrary = (asLibrary != null) ? asLibrary : false;
	
	var fn = mxUtils.bind(this, function()
	{
		this.execute(mxUtils.bind(this, function()
		{
			var acceptResponse = true;
			
			var timeoutThread = window.setTimeout(mxUtils.bind(this, function()
			{
				acceptResponse = false;
				error({code: App.ERROR_TIMEOUT, retry: fn});
			}), this.ui.timeout);
			
			var options = null;
			
			if (urlParams['rev'] != null)
			{
				options = {versionTag: urlParams['rev']};
			}
			
			this.client.readFile('/' + path, options, mxUtils.bind(this, function(err, data, stat)
			{
				try
				{
			    	window.clearTimeout(timeoutThread);
			    	
			    	if (acceptResponse)
			    	{
						if (err != null)
						{
							error(err)
						}
						else
						{
							if (asLibrary)
							{
								success(new DropboxLibrary(this.ui, data, stat));
							}
							else
							{
								success(new DropboxFile(this.ui, data, stat));
							}
						}
			    	}
				}
				catch (e)
				{
					error(e);
				}
			}));
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
DropboxClient.prototype.checkExists = function(filename, fn)
{
	this.client.stat(filename, mxUtils.bind(this, function(err, stat)
	{
		if ((err != null && err.status == 404) || (stat != null && stat.isRemoved))
		{
			fn(true);
		}
		else
		{
			this.ui.confirm(mxResources.get('replaceIt', [filename]), function()
			{
				fn(true);
			}, function()
			{
				fn(false);
			});
		}
	}));
};

/**
 * Translates this point by the given vector.
 * 
 * @param {number} dx X-coordinate of the translation.
 * @param {number} dy Y-coordinate of the translation.
 */
DropboxClient.prototype.renameFile = function(file, filename, success, error)
{
	if (file != null && filename != null)
	{
		// Checks if file exists
		this.execute(mxUtils.bind(this, function()
		{
			this.checkExists(filename, mxUtils.bind(this, function(checked)
			{
				if (checked)
				{
					// Uses write and remove because move does not allow overwriting an existing target
					this.writeFile(filename, file.getData(), mxUtils.bind(this, function(stat)
					{
						this.client.remove(file.getTitle(), function(err2, stat2)
						{
							if (err2 != null)
							{
								error(err2)
							}
							else
							{
								success(stat);
							}
						});
					}), error);
				}
				else
				{
					error();
				}
			}));
		}));
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
	else if (!this.writingFile)
	{
		var acceptResponse = true;
		var timeoutThread = null;
		this.writingFile = true;
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
			
			this.client.writeFile(filename, data, mxUtils.bind(this, function(err, stat)
			{
		    	window.clearTimeout(timeoutThread);
		    
		    	if (acceptResponse)
		    	{
					if (err != null)
					{
						if (retryCount < this.maxRetries)
						{
							retryCount++;
							var jitter = 1 + 0.1 * (Math.random() - 0.5);
							this.requestThread = window.setTimeout(fn, Math.round(Math.pow(2, retryCount) * jitter * 1000));
						}
						else if (error != null)
						{
							this.writingFile = false;
							error(err);
						}
					}
					else
					{
						this.writingFile = false;
						
						if (success != null)
						{
							success(stat);
						}
					}
		    	}
			}));
		});
		
		fn();
	}
	else if (error != null)
	{
		error({code: App.ERROR_BUSY});
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
						
						this.client.readFile(rel, null, mxUtils.bind(this, function(err, data, stat)
						{
							if (stat != null && parseInt(files[0].bytes) === parseInt(stat.size) && rel === stat.path)
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
						}));
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
			this.ui.loadFile('D' + encodeURIComponent(path), null, file);
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
				
						var tmp = files[0].link.indexOf(this.appPath);
	
						if (tmp > 0 && !/(\.png)$/i.test(files[0].name) && !/(\.vs?dx)$/i.test(files[0].name) && !/(\.gliffy)$/i.test(files[0].name))
						{
							// Checks if file is in app folder by loading file from there and comparing relative path and size
							// KNOWN: This check fails if a file is inside a drawio directory with same relative path and size
							this.execute(mxUtils.bind(this, function()
							{		
								var rel = decodeURIComponent(files[0].link.substring(tmp + this.appPath.length - 1));
								
								this.client.readFile(rel, null, mxUtils.bind(this, function(err, data, stat)
								{
									if (stat != null && parseInt(files[0].bytes) === parseInt(stat.size) && rel === stat.path)
									{
										this.ui.spinner.stop();
										
										// No need to load file a second time
										fn(rel.substring(1), new DropboxFile(this.ui, data, stat));
									}
									else
									{
										this.createFile(files[0], success, error);
									}
								}));
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
	var name = file.name;
	
	if (/(\.png)$/i.test(name) || /(\.vs?dx)$/i.test(name) || /(\.gliffy)$/i.test(name))
	{
		name = name.substring(0, name.lastIndexOf('.')) + this.extension;
	}
	
	var doInsert = mxUtils.bind(this, function(filename, data)
	{
		this.ui.confirm(mxResources.get('note') + ': ' + mxResources.get('fileWillBeSavedInAppFolder', [filename]), mxUtils.bind(this, function()
		{
			this.insertFile(filename, data, mxUtils.bind(this, function(newFile)
	    	{
				success(filename, newFile);
	    	}), error);
		}), mxUtils.bind(this, function()
		{
    		this.ui.spinner.stop();
		}));
	});
	
	this.ui.loadUrl(file.link, mxUtils.bind(this, function(data)
    {
		if (/(\.vs?dx)$/i.test(file.name) || /(\.gliffy)$/i.test(file.name))
		{
			this.ui.parseFile(new Blob([data], {type: 'application/octet-stream'}), mxUtils.bind(this, function(xhr)
			{
				if (xhr.readyState == 4)
				{
					if (xhr.status == 200 && xhr.responseText.substring(0, 13) == '<mxGraphModel')
					{
						doInsert(name, xhr.responseText);
					}
					else
					{
			    		this.ui.spinner.stop();
			    		
			    		if (error != null)
			    		{
			    			error({message: mxResources.get('errorLoadingFile')});
			    		}
					}
				}
			}), file.name);
		}
		else
		{
			if (/(\.png)$/i.test(file.name))
			{
				data = this.ui.extractGraphModelFromPng(data);
			}
			
			if (data != null && data.length > 0)
			{
				doInsert(name, data);
			}
			else
			{
				this.ui.spinner.stop();
				
				if (error != null)
				{
					error({message: mxResources.get('errorLoadingFile')});
				}
			}
		}
    }), error, /(\.png)$/i.test(file.name));
};
