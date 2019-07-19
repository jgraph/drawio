/**
 * Copyright (c) 2006-2017, JGraph Ltd
 * Copyright (c) 2006-2017, Gaudenz Alder
 */
GitLabClient = function(editorUi)
{
	GitHubClient.call(this, editorUi, 'gitlabauth');
};

// Extends DrawioClient
mxUtils.extend(GitLabClient, GitHubClient);

/**
 * Gitlab Client ID, see https://gitlab.com/oauth/applications/135239
 */
GitLabClient.prototype.clientId = '5cdc018a32acddf6eba37592d9374945241e644b8368af847422d74c8709bc44';

/**
 * OAuth scope.
 */
GitLabClient.prototype.scope = 'api%20read_repository%20write_repository';

/**
 * Base URL for API calls.
 */
GitLabClient.prototype.baseUrl = 'https://gitlab.com/api/v4';

/**
 * Authorizes the client, gets the userId and calls <open>.
 */
GitLabClient.prototype.authenticate = function(success, error)
{
	if (window.onGitLabCallback == null)
	{
		var auth = mxUtils.bind(this, function()
		{
			var acceptAuthResponse = true;
			
			this.ui.showAuthDialog(this, true, mxUtils.bind(this, function(remember, authSuccess)
			{
				var state = '123';
				var redirectUri = encodeURIComponent(window.location.origin + '/gitlab.html');
				var win = window.open('https://gitlab.com/oauth/authorize?client_id=' +
					this.clientId + '&scope=' + this.scope + '&redirect_uri=' + redirectUri +
					'&response_type=token&state=' + state, 'gitlabauth');
				
				if (win != null)
				{
					window.onGitLabCallback = mxUtils.bind(this, function(code, authWindow)
					{
						if (acceptAuthResponse)
						{
							window.onGitLabCallback = null;
							acceptAuthResponse = false;
							
							if (code == null)
							{
								error({message: mxResources.get('accessDenied'), retry: auth});
							}
							else
							{
								if (authSuccess != null)
								{
									authSuccess();
								}
								
								this.token = code;
								this.setUser(null);
								
								if (remember)
								{
									this.setPersistentToken(this.token);
								}
								
								success();
							}
						}
						else if (authWindow != null)
						{
							authWindow.close();
						}
					});
				}
				else
				{
					error({message: mxResources.get('serviceUnavailableOrBlocked'), retry: auth});
				}

			}), mxUtils.bind(this, function()
			{
				if (acceptAuthResponse)
				{
					window.onGitLabCallback = null;
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
 * Authorizes the client, gets the userId and calls <open>.
 */
GitLabClient.prototype.executeRequest = function(req, success, error, ignoreNotFound)
{
	var doExecute = mxUtils.bind(this, function(failOnAuth)
	{
		var acceptResponse = true;
		
		var timeoutThread = window.setTimeout(mxUtils.bind(this, function()
		{
			acceptResponse = false;
			error({code: App.ERROR_TIMEOUT, message: mxResources.get('timeout')});
		}), this.ui.timeout);
		
		var temp = this.token;
		
		req.setRequestHeaders = function(request, params)
		{
			request.setRequestHeader('Authorization', 'Bearer ' + temp);
			request.setRequestHeader('PRIVATE_TOKEN', temp);
			request.setRequestHeader('Content-Type', 'application/json');
		};
		
		req.send(mxUtils.bind(this, function()
		{
			window.clearTimeout(timeoutThread);
			
			if (acceptResponse)
			{
				if ((req.getStatus() >= 200 && req.getStatus() <= 299) ||
					(ignoreNotFound && req.getStatus() == 404))
				{
					success(req);
				}
				else if (req.getStatus() === 401)
				{
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
				else if (req.getStatus() === 403)
				{
					var tooLarge = false;
					
					try
					{
						var temp = JSON.parse(req.getText());
						
						if (temp != null && temp.errors != null && temp.errors.length > 0)
						{
							tooLarge = temp.errors[0].code == 'too_large';
						}
					}
					catch (e)
					{
						// ignore
					}
					
					error({message: mxResources.get((tooLarge) ? 'drawingTooLarge' : 'forbidden')});
				}
				else if (req.getStatus() === 404)
				{
					error({message: this.getErrorMessage(req, mxResources.get('fileNotFound'))});
				}
				else if (req.getStatus() === 400)
				{
					// Special case: flag to the caller that there was a conflict
					error({status: 400});
				}
				else
				{
					error({status: req.getStatus(), message: this.getErrorMessage(req,
						mxResources.get('error') + ' ' + req.getStatus())});
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
GitLabClient.prototype.getFile = function(path, success, error, asLibrary, checkExists)
{
	asLibrary = (asLibrary != null) ? asLibrary : false;
	
	var tokens = decodeURIComponent(path).split('/');
	var refPos = tokens.indexOf('master');
	var repoPos = Math.max(refPos-1, 0);
	var org = tokens.slice(0, repoPos).join('/');
	var repo = tokens[repoPos];
	var ref = tokens[refPos];
	var path = tokens.slice(refPos + 1, tokens.length).join('/');
	var binary = /\.png$/i.test(path);
	
	// Handles .vsdx, Gliffy and PNG+XML files by creating a temporary file
	if (!checkExists && (/\.v(dx|sdx?)$/i.test(path) || /\.gliffy$/i.test(path) ||
		(!this.ui.useCanvasForExport && binary)))
	{
		// Should never be null
		if (this.token != null)
		{

			var url = this.baseUrl + '/projects/' + encodeURIComponent(org + '/' + repo) + '/repository/files/' + encodeURIComponent(ref);
			var tokens = path.split('/');
			var name = (tokens.length > 0) ? tokens[tokens.length - 1] : path;
	
			this.ui.convertFile(url, name, null, this.extension, success, error);
		}
		else
		{
			error({message: mxResources.get('accessDenied')});
		}
	}
	else
	{
		// Adds random parameter to bypass cache
		var rnd = '&t=' + new Date().getTime();
		url = this.baseUrl + '/projects/' + encodeURIComponent(org + '/' + repo) +
			'/repository/files/' + encodeURIComponent(path) + '?ref=' + encodeURIComponent(ref);
		var req = new mxXmlRequest(url + rnd, null, 'GET');
		
		this.executeRequest(req, mxUtils.bind(this, function(req)
		{
			try
			{
				success(this.createGitLabFile(org, repo, ref, JSON.parse(req.getText()), asLibrary, url));
			}
			catch (e)
			{
				error(e);
			}
		}), error);
	}
};

/**
 * Translates this point by the given vector.
 * 
 * @param {number} dx X-coordinate of the translation.
 * @param {number} dy Y-coordinate of the translation.
 */
GitLabClient.prototype.createGitLabFile = function(org, repo, ref, data, asLibrary)
{
	var gitLabUrl = 'https://gitlab.com/';
	var htmlUrl = gitLabUrl + org + '/' + repo + '/blob/' + ref + '/' + data.file_path;
	var downloadUrl = gitLabUrl + org + '/' + repo + '/raw/' + ref + '/' + data.file_path + '?inline=false';
	var fileName = data.file_name;

	var meta = {'org': org, 'repo': repo, 'ref': ref, 'name': fileName,
		'path': data.file_path, 'sha': data.content_sha256, 'html_url': htmlUrl,
		'download_url': downloadUrl, 'last_commit_id': data.last_commit_id};
	var content = data.content;
	
	if (data.encoding === 'base64')
	{
		// Checks for base64 encoded mxfile
		if (content.substring(0, 10) == 'PG14ZmlsZS')
		{
			content = (window.atob && !mxClient.IS_SF) ? atob(content) : Base64.decode(content);
		}
		else if (/\.jpe?g$/i.test(fileName))
		{
			content = 'data:image/jpeg;base64,' + content;
		}
		else if (/\.gif$/i.test(fileName))
		{
			content = 'data:image/gif;base64,' + content;
		}
		else
		{
			if (/\.png$/i.test(fileName))
			{
				var xml = this.ui.extractGraphModelFromPng(content);
				
				if (xml != null && xml.length > 0)
				{
					content = xml;
				}
				else
				{
					content = 'data:image/png;base64,' + content;
				}
			}
			else
			{
				content = Base64.decode(content);
			}
		}
	}
	
	return (asLibrary) ? new GitLabLibrary(this.ui, content, meta) : new GitLabFile(this.ui, content, meta);
};

/**
 * Translates this point by the given vector.
 * 
 * @param {number} dx X-coordinate of the translation.
 * @param {number} dy Y-coordinate of the translation.
 */
GitLabClient.prototype.insertFile = function(filename, data, success, error, asLibrary, folderId, base64Encoded)
{
	asLibrary = (asLibrary != null) ? asLibrary : false;

	var tokens = decodeURIComponent(folderId).split('/');
	var refPos = tokens.indexOf('master');
	var repoPos = Math.max(refPos-1, 0);
	var org = tokens.slice(0, repoPos).join('/');
	var repo = tokens[repoPos];
	var ref = tokens[refPos];
	var path = tokens.slice(refPos + 1, tokens.length).join('/');

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
				success(new GitLabFile(this.ui, data, {'org': org, 'repo': repo, 'ref': ref,
					'name': filename, 'path': path, 'sha': sha, isNew: true}));
			}
			else
			{
				if (!base64Encoded)
				{
					data = Base64.encode(data);
				}
				
				this.showCommitDialog(filename, true, mxUtils.bind(this, function(message)
				{
					this.writeFile(org, repo, ref, path, message, data, sha, mxUtils.bind(this, function(req)
					{
						try
						{
							var msg = JSON.parse(req.getText());
							success(this.createGitLabFile(org, repo, ref, msg.content, asLibrary));
						}
						catch (e)
						{
							error(e);
						}
					}), error);
				}), error);
			}
		}
		else
		{
			// create if it does not exists
			error();
		}
	}))
};

/**
 * 
 */
GitLabClient.prototype.writeFile = function(org, repo, ref, path, message, data, last_commit_id, success, error)
{
	if (data.length >= this.maxFileSize)
	{
		error({message: mxResources.get('drawingTooLarge') + ' (' +
			this.ui.formatFileSize(data.length) + ' / 1 MB)'});
	}
	else
	{
		var entity =
		{
			path: encodeURIComponent(path),
			branch: decodeURIComponent(ref),
			commit_message: message,
			content: data,
			encoding: 'base64'
		};
		
		if (last_commit_id != null)
		{
			entity.last_commit_id = last_commit_id;
		}

		var method = !this.ui.currentFile ? 'POST' : 'PUT'

		// {"branch": "master", "author_email": "author@example.com", "author_name": "Firstname Lastname", "content": "some content", "commit_message": "update file"}
		// https://docs.gitlab.com/ee/api/repository_files.html#update-existing-file-in-repository
		var url = this.baseUrl + '/projects/' + encodeURIComponent(org + '/' + repo) + '/repository/files/' + encodeURIComponent(path);
		var req = new mxXmlRequest(url, JSON.stringify(entity), method);
		this.executeRequest(req, mxUtils.bind(this, function(req)
		{
			success(req);
		}), error);
	}
};

/**
 * Translates this point by the given vector.
 * 
 * @param {number} dx X-coordinate of the translation.
 * @param {number} dy Y-coordinate of the translation.
 */
GitLabClient.prototype.saveFile = function(file, success, error, overwrite, message)
{
	var org = file.meta.org;
	var repo = file.meta.repo;
	var ref = file.meta.ref;
	var path = file.meta.path;

	var fn = mxUtils.bind(this, function(last_commit_id, data)
	{
		this.writeFile(org, repo, ref, path, message, data, last_commit_id,
			mxUtils.bind(this, function(req)
		{
			delete file.meta.isNew;
			success({
				content: file.meta
			});
		}), mxUtils.bind(this, function(err)
		{
			error(err);
		}));
	});
	
	var fn2 = mxUtils.bind(this, function()
	{
		if (this.ui.useCanvasForExport && /(\.png)$/i.test(path))
		{
			this.ui.getEmbeddedPng(mxUtils.bind(this, function(data)
			{
				fn(file.meta.last_commit_id, data);
			}), error, (this.ui.getCurrentFile() != file) ? file.getData() : null);
		}
		else
		{
			fn(file.meta.last_commit_id, Base64.encode(file.getData()));
		}
	});
	
	// TODO: Get only sha not content for overwrite
	if (overwrite)
	{
		this.getFile(org + '/' + repo + '/' + encodeURIComponent(ref) + '/' + path,
			mxUtils.bind(this, function(tempFile)
		{
			file.meta.last_commit_id = tempFile.meta.last_commit_id;
			fn2();
		}), error);	
	}
	else
	{
		fn2();
	}
};

/**
 * Checks if the client is authorized and calls the next step.
 */
GitLabClient.prototype.pickFolder = function(fn)
{
	this.showGitLabDialog(false, fn);
};

/**
 * Checks if the client is authorized and calls the next step.
 */
GitLabClient.prototype.pickFile = function(fn)
{
	fn = (fn != null) ? fn : mxUtils.bind(this, function(path)
	{
		this.ui.loadFile('A' + encodeURIComponent(path));
	});
	
	this.showGitLabDialog(true, fn);
};

/**
 * LATER: Refactor to use common code with GitHubClient
 */
GitLabClient.prototype.showGitLabDialog = function(showFiles, fn)
{
	var org = null;
	var repo = null;
	var ref = null;
	var path = null;
	
	var content = document.createElement('div');
	content.style.whiteSpace = 'nowrap';
	content.style.overflow = 'hidden';
	content.style.height = '224px';

	var hd = document.createElement('h3');
	mxUtils.write(hd, mxResources.get((showFiles) ? 'selectFile' : 'selectFolder'));
	hd.style.cssText = 'width:100%;text-align:center;margin-top:0px;margin-bottom:12px';
	content.appendChild(hd);

	var div = document.createElement('div');
	div.style.whiteSpace = 'nowrap';
	div.style.border = '1px solid lightgray';
	div.style.boxSizing = 'border-box';
	div.style.padding = '4px';
	div.style.overflow = 'auto';
	div.style.lineHeight = '1.2em';
	div.style.height = '194px';
	content.appendChild(div);

	var dlg = new CustomDialog(this.ui, content, mxUtils.bind(this, function()
	{
		fn(org + '/' + repo + '/' + encodeURIComponent(ref) + '/' + path);
	}));
	this.ui.showDialog(dlg.container, 340, 270, true, true);
	
	if (showFiles)
	{
		dlg.okButton.parentNode.removeChild(dlg.okButton);
	}
	
	var createLink = mxUtils.bind(this, function(label, fn)
	{
		var link = document.createElement('a');
		link.setAttribute('href', 'javascript:void(0);');
		mxUtils.write(link,  label);
		mxEvent.addListener(link, 'click', fn);
		
		return link;
	});
	
	var updatePathInfo = mxUtils.bind(this, function(hideRef)
	{
		var pathInfo = document.createElement('div');
		pathInfo.style.marginBottom = '8px';
		
		pathInfo.appendChild(createLink(org + '/' + repo, mxUtils.bind(this, function()
		{
			path = null;
			selectRepo();
		})));
		
		if (!hideRef)
		{
			mxUtils.write(pathInfo, ' / ');
			pathInfo.appendChild(createLink(decodeURIComponent(ref), mxUtils.bind(this, function()
			{
				path = null;
				selectRef();
			})));
		}
		
		if (path != null && path.length > 0)
		{
			var tokens = path.split('/');
			
			for (var i = 0; i < tokens.length; i++)
			{
				(function(index)
				{
					mxUtils.write(pathInfo, ' / ');
					pathInfo.appendChild(createLink(tokens[index], mxUtils.bind(this, function()
					{
						path = tokens.slice(0, index + 1).join('/');
						selectFile();
					})));
				})(i);
			}
		}
		
		div.appendChild(pathInfo);
	});
	
	var error = mxUtils.bind(this, function(err)
	{
		this.ui.handleError(err, null, mxUtils.bind(this, function()
		{
			this.ui.spinner.stop();
			
			if (this.getUser() != null)
			{
				org = null;
				repo = null;
				ref = null;
				path = null;
				
				selectRepo();
			}
			else
			{
				this.ui.hideDialog();
			}
		}));
	});
	
	var selectFile = mxUtils.bind(this, function()
	{
		var req = new mxXmlRequest(this.baseUrl + '/projects/' + encodeURIComponent(org + '/' + repo) +
			'/repository/tree?path=' + path, null, 'GET');
		dlg.okButton.removeAttribute('disabled');
		div.innerHTML = '';
		this.ui.spinner.spin(div, mxResources.get('loading'));
		
		this.executeRequest(req, mxUtils.bind(this, function(req)
		{
			updatePathInfo(!ref);
			this.ui.spinner.stop();
			var files = JSON.parse(req.getText());
			div.appendChild(createLink('../ [Up]', mxUtils.bind(this, function()
			{
				if (path == '')
				{
					path = null;
					selectRepo();
				}
				else
				{
					var tokens = path.split('/');
					path = tokens.slice(0, tokens.length - 1).join('/');
					selectFile();
				}
			})));
			mxUtils.br(div);

			if (files == null || files.length == 0)
			{
				mxUtils.write(div, mxResources.get('noFiles'));
			}
			else
			{
				var gray = true;
				
				var listFiles = mxUtils.bind(this, function(showFolders)
				{
					for (var i = 0; i < files.length; i++)
					{
						(mxUtils.bind(this, function(file)
						{
							if (showFolders == (file.type == 'tree'))
							{
								var temp = document.createElement('div');
								temp.style.textOverflow = 'ellipsis';
								temp.style.boxSizing = 'border-box';
								temp.style.overflow = 'hidden';
								temp.style.padding = '4px';
								temp.style.width = '100%';
								
								temp.style.backgroundColor = (gray) ? '#eeeeee' : '';
								gray = !gray;

								var typeImg = document.createElement('img');
								typeImg.src = IMAGE_PATH + '/' + (file.type == 'tree'? 'folder.png' : 'file.png');
								typeImg.setAttribute('align', 'absmiddle');
								typeImg.style.marginRight = '4px';
								typeImg.style.marginTop = '-4px';
								typeImg.width = 20;
								temp.appendChild(typeImg);
								
								temp.appendChild(createLink(file.name + ((file.type == 'tree') ? '/' : ''), mxUtils.bind(this, function()
								{
									if (file.type == 'tree')
									{
										path = file.path;
										selectFile();
									}
									else if (showFiles && file.type == 'blob')
									{
										this.ui.hideDialog();
										fn(org + '/' + repo + '/' + encodeURIComponent(ref) + '/' + file.path);
									}
								})));
								
								div.appendChild(temp);
							}
						}))(files[i]);
					}
				});
				
				listFiles(true);
				
				if (showFiles)
				{
					listFiles(false);
				}
			}
		}), error, true);
	});
	
	// Adds paging for repos and branches (files limited to 1000 by API)
	var pageSize = 100;
	var nextPageDiv = null;
	var scrollFn = null;

	var selectRef = mxUtils.bind(this, function(page)
	{
		if (page == null)
		{
			div.innerHTML = '';
			page = 1;
		}
		
		var req = new mxXmlRequest(this.baseUrl + '/projects/' + encodeURIComponent(org + '/' + repo) +
			'/repository/branches?per_page=' + pageSize + '&page=' + page, null, 'GET');
		dlg.okButton.setAttribute('disabled', 'disabled');
		this.ui.spinner.spin(div, mxResources.get('loading'));
		
		if (nextPageDiv != null && nextPageDiv.parentNode != null)
		{
			nextPageDiv.parentNode.removeChild(nextPageDiv);
		}
		
		nextPageDiv = document.createElement('a');
		nextPageDiv.style.display = 'block';
		nextPageDiv.setAttribute('href', 'javascript:void(0);');
		mxUtils.write(nextPageDiv, mxResources.get('more') + '...');
		
		var nextPage = mxUtils.bind(this, function()
		{
			mxEvent.removeListener(div, 'scroll', scrollFn);
			selectRef(page + 1);
		});
		
		mxEvent.addListener(nextPageDiv, 'click', nextPage);
		
		this.executeRequest(req, mxUtils.bind(this, function(req)
		{
			this.ui.spinner.stop();
			
			if (page == 1)
			{
				updatePathInfo(true);
				
				div.appendChild(createLink('../ [Up]', mxUtils.bind(this, function()
				{
					path = null;
					selectRepo();
				})));
				
				mxUtils.br(div);
			}

			var branches = JSON.parse(req.getText());
			
			if (branches == null || branches.length == 0)
			{
				mxUtils.write(div, mxResources.get('noFiles'));
			}
			else
			{
				for (var i = 0; i < branches.length; i++)
				{
					(mxUtils.bind(this, function(branch)
					{
						div.appendChild(createLink(branch.name, mxUtils.bind(this, function()
						{
							ref = branch.name;
							path = '';
							selectFile();
						})));
						mxUtils.br(div);
					}))(branches[i]);
				}
				
				if (branches.length == pageSize)
				{
					div.appendChild(nextPageDiv);
					
					scrollFn = function()
					{
						if (div.scrollTop >= div.scrollHeight - div.offsetHeight)
						{
							nextPage();
						}
					};
					
					mxEvent.addListener(div, 'scroll', scrollFn);
				}
			}
		}), error);
	});

	var selectRepo = mxUtils.bind(this, function(page)
	{
		if (page == null)
		{
			div.innerHTML = '';
			page = 1;
		}

		dlg.okButton.setAttribute('disabled', 'disabled');
		this.ui.spinner.spin(div, mxResources.get('loading'));
		
		if (nextPageDiv != null && nextPageDiv.parentNode != null)
		{
			nextPageDiv.parentNode.removeChild(nextPageDiv);
		}
		
		nextPageDiv = document.createElement('a');
		nextPageDiv.style.display = 'block';
		nextPageDiv.setAttribute('href', 'javascript:void(0);');
		mxUtils.write(nextPageDiv, mxResources.get('more') + '...');
		
		var nextPage = mxUtils.bind(this, function()
		{
			mxEvent.removeListener(div, 'scroll', scrollFn);
			selectRepo(page + 1);
		});
		
		mxEvent.addListener(nextPageDiv, 'click', nextPage);

		var listGroups = mxUtils.bind(this, function(callback)
		{
			var req = new mxXmlRequest(this.baseUrl + '/groups?per_page=100', null, 'GET');
			this.executeRequest(req, function(req)
			{
				callback(JSON.parse(req.getText()));
			}, error);
		});

		var listProjects = mxUtils.bind(this, function(group, callback)
		{
			var req = new mxXmlRequest(this.baseUrl + '/groups/' + group.id + '/projects?per_page=100', null, 'GET');
			this.executeRequest(req, function(req)
			{
				callback(group, JSON.parse(req.getText()));
			}, error);
		});

		
		listGroups(mxUtils.bind(this, function(groups) {
			this.ui.spinner.stop();
      var req = new mxXmlRequest(this.baseUrl + '/users/' + this.user.id + '/projects?per_page=' +
        pageSize + '&page=' + page, null, 'GET');
			this.executeRequest(req, mxUtils.bind(this, function(req)
			{
				this.ui.spinner.stop();
				var repos = JSON.parse(req.getText());

				
				if ((repos == null || repos.length == 0) && (groups == null || groups.length == 0))
				{
					mxUtils.write(div, mxResources.get('noFiles'));
				}
				else
				{
					if (page == 1)
					{
						div.appendChild(createLink(mxResources.get('enterValue') + '...', mxUtils.bind(this, function()
						{
							var dlg = new FilenameDialog(this.ui, 'org/repo/ref', mxResources.get('ok'), mxUtils.bind(this, function(value)
							{
								if (value != null)
								{
									var tokens = value.split('/');
									
									if (tokens.length > 1)
									{
										org = tokens[0];
										repo = tokens[1];
										ref = 'master';
										path = null;
										if (tokens.length > 2)
										{
											path = encodeURIComponent(tokens.slice(2, tokens.length).join('/'));
										}
										selectFile();
									}
									else
									{
										this.ui.spinner.stop();
										this.ui.handleError({message: mxResources.get('invalidName')});
									}
								}
							}), mxResources.get('enterValue'));
							this.ui.showDialog(dlg.container, 300, 80, true, false);
							dlg.init();
						})));
						
						mxUtils.br(div);
						mxUtils.br(div);
					}
					
					for (var i = 0; i < repos.length; i++)
					{
						(mxUtils.bind(this, function(repository, idx)
						{
							var temp = document.createElement('div');
							temp.style.textOverflow = 'ellipsis';
							temp.style.boxSizing = 'border-box';
							temp.style.overflow = 'hidden';
							temp.style.padding = '4px';
							temp.style.width = '100%';
							
							temp.style.backgroundColor = (idx % 2 == 0) ? '#eeeeee' : '';
							
							temp.appendChild(createLink(repository.name_with_namespace, mxUtils.bind(this, function()
							{
								org = repository.owner.username;
								repo = repository.name;
								ref = repository.default_branch || 'master';
								path = '';
		
								selectFile();
							})));
							
							div.appendChild(temp);
						}))(repos[i], i);
					}

					for (var i = 0; i < groups.length; i++)
					{
						listProjects(groups[i], (mxUtils.bind(this, function(group, projects)
						{
							for (var j = 0; j < projects.length; j++) {
								var project = projects[j];
								div.appendChild(createLink(project.name_with_namespace, mxUtils.bind(this, function()
								{
									org = group.full_path;
									repo = project.path;
									ref = project.default_branch || 'master';
									path = '';
			
									selectFile();
								})));
								mxUtils.br(div);
							}
						})));
					}
				}

				if (repos.length == pageSize)
				{
					div.appendChild(nextPageDiv);
					
					scrollFn = function()
					{
						if (div.scrollTop >= div.scrollHeight - div.offsetHeight)
						{
							nextPage();
						}
					};
					
					mxEvent.addListener(div, 'scroll', scrollFn);
				}
			}), error);
		}));
	});

	if (!this.token) {
		this.authenticate(mxUtils.bind(this, function()
		{
			this.updateUser(function() { selectRepo(); }, error, true);
		}), error);
	} else if (!this.user) {
		this.updateUser(function() { selectRepo(); }, error, true);
	} else {
		selectRepo();
	}
};

/**
 * Checks if the client is authorized and calls the next step.
 */
GitLabClient.prototype.logout = function()
{
	this.clearPersistentToken();
	this.setUser(null);
	this.token = null;
};
