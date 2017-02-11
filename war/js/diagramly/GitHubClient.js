/**
 * Copyright (c) 2006-2017, JGraph Ltd
 * Copyright (c) 2006-2017, Gaudenz Alder
 */
GitHubClient = function(editorUi)
{
	mxEventSource.call(this);
	
	/**
	 * Holds a reference to the UI. Needed for the sharing client.
	 */
	this.ui = editorUi;
	this.token = this.getPersistentToken();
};

// Extends mxEventSource
mxUtils.extend(GitHubClient, mxEventSource);

/**
 * Specifies if thumbnails should be enabled. Default is true.
 * LATER: If thumbnails are disabled, make sure to replace the
 * existing thumbnail with the placeholder only once.
 */
GitHubClient.prototype.clientId = (window.location.hostname == 'test.draw.io') ? '23bc97120b9035515661' : '89c9e4624ca416554489';

/**
 * OAuth scope.
 */
GitHubClient.prototype.scope = 'repo';

/**
 * Default extension for new files.
 */
GitHubClient.prototype.extension = '.xml';

/**
 * Base URL for API calls.
 */
GitHubClient.prototype.baseUrl = 'https://api.github.com';

/**
 * Token for the current user.
 */
GitHubClient.prototype.token = null;

/**
 * Authorizes the client, gets the userId and calls <open>.
 */
GitHubClient.prototype.setUser = function(user)
{
	this.user = user;
	this.fireEvent(new mxEventObject('userChanged'));
};

/**
 * Authorizes the client, gets the userId and calls <open>.
 */
GitHubClient.prototype.getUser = function()
{
	return this.user;
};

/**
 * 
 */
GitHubClient.prototype.clearPersistentToken = function()
{
	var expiration = new Date();
	expiration.setYear(expiration.getFullYear() - 1);
	document.cookie = 'ghauth=; expires=' + expiration.toUTCString();	
};

/**
 * Authorizes the client, gets the userId and calls <open>.
 */
GitHubClient.prototype.getPersistentToken = function()
{
	var cookies = document.cookie;
	var name = 'ghauth=';
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
		
		return (value.length > 0) ? value : null;
	}

	return null;
};

/**
 * Authorizes the client, gets the userId and calls <open>.
 */
GitHubClient.prototype.setPersistentToken = function(token)
{
	if (token != null)
	{
		var expiration = new Date();
		expiration.setYear(expiration.getFullYear() + 10);
		var cookie = 'ghauth=' + token +'; path=/; expires=' + expiration.toUTCString();

		if (document.location.protocol.toLowerCase() == 'https')
		{
			cookie = cookie + ';secure';
		}

		document.cookie = cookie;
	}
	else
	{
		this.clearPersistentToken();
	}
};

/**
 * Authorizes the client, gets the userId and calls <open>.
 */
GitHubClient.prototype.updateUser = function(success, error)
{
	var fn = mxUtils.bind(this, function()
	{
		var acceptResponse = true;
		
		var timeoutThread = window.setTimeout(mxUtils.bind(this, function()
		{
			acceptResponse = false;
			error({code: App.ERROR_TIMEOUT, retry: fn});
		}), this.ui.timeout);
		
		mxUtils.get(this.baseUrl + '/user?access_token=' + this.token, mxUtils.bind(this, function(userReq)
		{
			window.clearTimeout(timeoutThread);
			
			if (acceptResponse)
			{
				if (userReq.getStatus() === 401)
				{
					this.authorizeRequest(fn, error);
				}
				else
				{
					var userInfo = JSON.parse(userReq.getText());
					this.setUser(new DrawioUser(userInfo.id, userInfo.email, userInfo.name));
					success();
				}
			}
		}));
	});
	
	fn();
};

/**
 * Authorizes the client, gets the userId and calls <open>.
 */
GitHubClient.prototype.authorizeRequest = function(success, error)
{
	this.ui.showAuthDialog(this, true, mxUtils.bind(this, function(remember, authSuccess)
	{
		if (authSuccess != null)
		{
			authSuccess();
		}
		
		// Initializes oauth flow
		window.open('https://github.com/login/oauth/authorize?client_id=' + this.clientId + '&scope=' + this.scope);
		
		window.onGitHubCallback = mxUtils.bind(this, function(code, authWindow)
		{
			window.onGitHubCallback = null;

			if (authWindow != null)
			{
				authWindow.close();
			}
			
			// Gets token for code via servlet
			var fn = mxUtils.bind(this, function()
			{
				var acceptResponse = true;
				
				var timeoutThread = window.setTimeout(mxUtils.bind(this, function()
				{
					acceptResponse = false;
					error({code: App.ERROR_TIMEOUT, retry: fn});
				}), this.ui.timeout);
				
				mxUtils.get('/github?client_id=' + this.clientId + '&code=' + code, mxUtils.bind(this, function(authReq)
				{
					window.clearTimeout(timeoutThread);
					
					if (acceptResponse)
					{
						var res = authReq.getText();
						this.token = res.substring(res.indexOf('=') + 1, res.indexOf('&'));
						
						if (remember)
						{
							this.setPersistentToken(this.token);
						}
						
						success();
					}
				}));
			});
			
			fn();
		});
	}));
};

/**
 * Authorizes the client, gets the userId and calls <open>.
 */
GitHubClient.prototype.executeRequest = function(req, success, error, refresh, overwrite)
{
	var doExecute = mxUtils.bind(this, function()
	{
		var acceptResponse = true;
		
		var timeoutThread = window.setTimeout(mxUtils.bind(this, function()
		{
			acceptResponse = false;
			error({code: App.ERROR_TIMEOUT, retry: fn});
		}), this.ui.timeout);
		
		var temp = this.token;
		
		req.setRequestHeaders = function(request, params)
		{
			request.setRequestHeader('Authorization', 'token ' + temp);
		};
		
		req.send(mxUtils.bind(this, function()
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
					this.authorizeRequest(fn, error);
				}
				else if (req.getStatus() === 404)
				{
					error({message: mxResources.get('fileNotFound')});
				}
				else if (req.getStatus() === 409)
				{
					// Special case: flag to the caller that there was a conflict
					error({status: 409});
				}
				else
				{
					error({message: mxResources.get('error') + ' ' + req.getStatus()});
				}
			}
		}), error);
	});
	
	var fn = mxUtils.bind(this, function()
	{
		if (this.user == null)
		{
			this.updateUser(doExecute, error);
		}
		else
		{
			doExecute();
		}
	});

	if (this.token === null)
	{
		this.authorizeRequest(fn, error);
	}
	else
	{
		fn();
	}
};

/**
 * Checks if the client is authorized and calls the next step.
 */
GitHubClient.prototype.getLibrary = function(path, success, error)
{
	this.getFile(path, success, error, true);
};

/**
 * Checks if the client is authorized and calls the next step.
 */
GitHubClient.prototype.getFile = function(path, success, error, asLibrary)
{
	asLibrary = (asLibrary != null) ? asLibrary : false;
	
	var tokens = path.split('/');
	var org = tokens[0];
	var repo = tokens[1];
	var ref = tokens[2];
	var path = tokens.slice(3, tokens.length).join('/');
	
	var req = new mxXmlRequest(this.baseUrl + '/repos/' + org + '/' + repo +
		'/contents/' + path + '?ref=' + encodeURIComponent(ref), null, 'GET');
	
	this.executeRequest(req, mxUtils.bind(this, function(req)
	{
		try
		{
			success(this.createGitHubFile(org, repo, ref, req, asLibrary));
		}
		catch (e)
		{
			error(e);
		}
	}), error);
};

/**
 * Translates this point by the given vector.
 * 
 * @param {number} dx X-coordinate of the translation.
 * @param {number} dy Y-coordinate of the translation.
 */
GitHubClient.prototype.createGitHubFile = function(org, repo, ref, req, asLibrary)
{
	var data = JSON.parse(req.getText());
	var meta = {'org': org, 'repo': repo, 'ref': ref, 'name': data.name,
		'path': data.path, 'sha': data.sha, 'download_url': data.download_url};
	var content = data.content;
	
	if (data.encoding === 'base64')
	{
		if ((/(\.png)$/i.test(data.name)))
		{
			content = 'data:image/png;base64,' + content;
		}
		else
		{
			content = (window.atob) ? atob(content) : Base64.decode(content, true);
		}
	}
	
	return (asLibrary) ? new GitHubLibrary(this.ui, content, meta) : new GitHubFile(this.ui, content, meta);
};

/**
 * Translates this point by the given vector.
 * 
 * @param {number} dx X-coordinate of the translation.
 * @param {number} dy Y-coordinate of the translation.
 */
GitHubClient.prototype.insertLibrary = function(filename, data, success, error, folderId)
{
	this.insertFile(filename, data, success, error, true, folderId, false);
};

/**
 * Translates this point by the given vector.
 * 
 * @param {number} dx X-coordinate of the translation.
 * @param {number} dy Y-coordinate of the translation.
 */
GitHubClient.prototype.insertFile = function(filename, data, success, error, asLibrary, folderId, base64Encoded)
{
	asLibrary = (asLibrary != null) ? asLibrary : false;

	var tokens = folderId.split('/');
	var org = tokens[0];
	var repo = tokens[1];
	var ref = tokens[2];
	var path = tokens.slice(3, tokens.length).join('/');

	if (path.length > 0)
	{
		path = path + '/';
	}
	
	path = path + filename;

	this.checkExists(org + '/' + repo + '/' + ref + '/' + path, true, mxUtils.bind(this, function(checked, sha)
	{
		if (checked)
		{
			// Does not insert file here as there is another writeFile implicit via fileCreated
			if (!asLibrary)
			{
				success(new GitHubFile(this.ui, data, {'org': org, 'repo': repo,
					'ref': ref, 'name': filename, 'path': path}));
			}
			else
			{
				if (!base64Encoded)
				{
					data = (window.btoa) ? btoa(data) : Base64.encode(data);
				}
				
				this.showCommitDialog(filename, true, mxUtils.bind(this, function(message)
				{
					this.writeFile(org, repo, ref, path, message, data, sha, mxUtils.bind(this, function(req)
					{
						this.getFile(org + '/' + repo + '/' + ref + '/' + path, success, error, asLibrary);
					}), error);
				}), mxUtils.bind(this, function()
				{
					// do nothing
				}));
			}
		}
		else if (error != null)
		{
			error();
		}
	}))
};

/**
 * 
 */
GitHubClient.prototype.showCommitDialog = function(filename, isNew, success, cancel)
{
	// Pauses spinner while commit message dialog is shown
	var resume = this.ui.spinner.pause();
	
	var dlg = new FilenameDialog(this.ui, mxResources.get((isNew) ? 'addedFile' : 'updateFile',
		[filename]), mxResources.get('ok'), mxUtils.bind(this, function(message)
	{
		resume();
		success(message);
	}), mxResources.get('changes'), null, null, null, null, mxUtils.bind(this, function()
	{
		cancel();
	}));
	this.ui.showDialog(dlg.container, 300, 80, true, false);
	dlg.init();
};

/**
 * 
 */
GitHubClient.prototype.writeFile = function(org, repo, ref, path, message, data, sha, success, error)
{
	var entity =
	{
		path: path,
		message: message,
		content: data
	};
	
	if (sha != null)
	{
		entity.sha = sha;
	}
	
	var req = new mxXmlRequest(this.baseUrl + '/repos/' + org + '/' + repo +
		'/contents/' + path + '?ref=' + encodeURIComponent(ref),
		JSON.stringify(entity), 'PUT');
	
	this.executeRequest(req, mxUtils.bind(this, function(req)
	{
		success(req);
	}), error);
};

/**
 * Translates this point by the given vector.
 * 
 * @param {number} dx X-coordinate of the translation.
 * @param {number} dy Y-coordinate of the translation.
 */
GitHubClient.prototype.checkExists = function(path, askReplace, fn)
{
	this.getFile(path, mxUtils.bind(this, function(file)
	{
		if (askReplace)
		{
			var resume = this.ui.spinner.pause();
			
			this.ui.confirm(mxResources.get('replaceIt', [path]), function()
			{
				resume();
				fn(true, file.meta.sha);
			}, function()
			{
				resume();
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
	}), mxUtils.bind(this, function(err)
	{
		fn(true);
	}));
};

/**
 * Translates this point by the given vector.
 * 
 * @param {number} dx X-coordinate of the translation.
 * @param {number} dy Y-coordinate of the translation.
 */
GitHubClient.prototype.saveFile = function(file, success, error)
{
	var org = file.meta.org;
	var repo = file.meta.repo;
	var ref = file.meta.ref;
	var path = file.meta.path;
	
	this.showCommitDialog(file.meta.name, file.meta.sha == null, mxUtils.bind(this, function(message)
	{
		var data = (window.btoa) ? btoa(file.getData()) : Base64.encode(file.getData());
		
		var fn = mxUtils.bind(this, function(sha)
		{
			this.writeFile(org, repo, ref, path, message, data, sha, mxUtils.bind(this, function(req)
			{
				var data = JSON.parse(req.getText());
				success(data.content.sha);
			}), mxUtils.bind(this, function(err)
			{
				// Handles special conflict case where overwrite needs an update of the sha
				if (err != null && err.status == 409)
				{
					resume = this.ui.spinner.pause();
					
					var dlg = new ErrorDialog(this.ui, mxResources.get('errorSavingFile'),
						mxResources.get('fileChangedOverwrite'), mxResources.get('cancel'), mxUtils.bind(this, function()
						{
							success(null);
						}), null, mxResources.get('overwrite'), mxUtils.bind(this, function()
						{
							resume();
							
							// Gets the latest sha and tries again
							this.getFile(org + '/' + repo + '/' + ref + '/' + path, mxUtils.bind(this, function(tempFile)
							{
								fn(tempFile.meta.sha);
							}));
						}));
					this.ui.showDialog(dlg.container, 340, 150, true, false);
					dlg.init();
				}
				else
				{
					error(err);
				}
			}));
		});
		
		fn(file.meta.sha);
	}), mxUtils.bind(this, function()
	{
		success(null);
	}));
};

/**
 * Checks if the client is authorized and calls the next step.
 */
GitHubClient.prototype.pickLibrary = function(fn)
{
	this.pickFile(fn);
};

/**
 * Checks if the client is authorized and calls the next step.
 */
GitHubClient.prototype.pickFolder = function(fn)
{
	var ask = mxUtils.bind(this, function(defaultPath)
	{
		this.ui.showGitHubDialog(false, mxUtils.bind(this, function(org, repo, ref, path)
		{
			if (this.ui.spinner.spin(document.body, mxResources.get('loading')))
			{
				var req = new mxXmlRequest(this.baseUrl + '/repos/' + org + '/' + repo +
					'/contents/' + path + '?ref=' + encodeURIComponent(ref), null, 'GET');
				
				this.executeRequest(req, mxUtils.bind(this, function(req)
				{
					this.ui.spinner.stop();
					fn(org + '/' + repo + '/' + ref + '/' + path);
				}), mxUtils.bind(this, function(err)
				{
					this.ui.spinner.stop();
					
					this.ui.handleError({message: mxResources.get('folderNotFound')}, null, function()
					{
						ask(path);
					});
				}));
			}
		}), defaultPath);
	});
	
	ask('');
};

/**
 * Checks if the client is authorized and calls the next step.
 */
GitHubClient.prototype.pickFile = function(fn)
{
	fn = (fn != null) ? fn : mxUtils.bind(this, function(path)
	{
		this.ui.loadFile('H' + encodeURIComponent(path));
	});
	
	this.ui.showGitHubDialog(true, mxUtils.bind(this, function(org, repo, ref, path)
	{
		fn(org + '/' + repo + '/' + ref + '/' + path);
	}));
};

/**
 * Checks if the client is authorized and calls the next step.
 */
GitHubClient.prototype.logout = function()
{
	this.setUser(null);
	this.clearPersistentToken();
	this.token = null;
};
