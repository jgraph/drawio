/**
 * Copyright (c) 2006-2021, JGraph Ltd
 * Copyright (c) 2006-2021, draw.io AG
 */

//Add a closure to hide the class private variables without changing the code a lot
(function ()
{

var _token = null;

window.NotionClient = function(editorUi)
{
	DrawioClient.call(this, editorUi, 'notionAuthInfo');
};

// Extends DrawioClient
mxUtils.extend(NotionClient, DrawioClient);

/**
 *
 */
NotionClient.prototype.extension = '.drawio';

NotionClient.prototype.xmlField = 'draw.io XML';

/**
 * 
 */
NotionClient.prototype.baseUrl = window.NOTION_API_URL || 'https://app.diagrams.net/notion-api';


NotionClient.prototype.getTitle = function (props)
{
	var obj, key;
	
	for (var field in props)
	{
		if (props[field].type == 'title')
		{
			key = field;
			obj = props[field];
			break;
		}
	}
	
	return {title: this.getTitleVal(obj), key: key};
};

NotionClient.prototype.getTitleVal = function (obj)
{
	if (typeof obj.title === 'string')
	{
		return obj.title;
	}
	else
	{
		var title = [];
		
		for (var i = 0; i < obj.title.length; i++)
		{
			title.push(obj.title[i].text.content)
		}
		
		return title.join(' ');
	}
};
	
NotionClient.prototype.authenticate = function(success, error, failOnAuth)
{
	var acceptAuthResponse = true;

	var errFn = mxUtils.bind(this, function()
	{
		if (acceptAuthResponse)
		{
			acceptAuthResponse = false;
			error({message: mxResources.get('accessDenied'), retry: mxUtils.bind(this, function()
			{
				this.ui.hideDialog();
				auth();
			})});
		}
	});
	
	var auth = mxUtils.bind(this, function()
	{
		acceptAuthResponse = true;
		
		this.ui.showAuthDialog(this, true, mxUtils.bind(this, function(remember, authSuccess)
		{
			var tokenDlg = new FilenameDialog(this.ui, '',
				mxResources.get('ok'), mxUtils.bind(this, function(token)
				{
					//check token is valid
					_token = token;
					
					//TODO use any simpler request if one becomes available
					this.executeRequest('/v1/databases', null, 'GET', mxUtils.bind(this, function()
					{
						this.executeRequest('/setToken', null, 'GET', mxUtils.bind(this, function()
						{
							acceptAuthResponse = false;
							
							if (remember)
							{
								_token = null;
							}
							
							if (authSuccess != null)
							{
								authSuccess();
							}
							
							success();
						}), errFn, failOnAuth);
					}), errFn, failOnAuth);
				}), mxResources.get('notionToken'), function(token)
				{
					return token != null && token.length > 0;
				}, null, 'https://developers.notion.com/docs/getting-started#step-1-create-an-integration');
				
			this.ui.showDialog(tokenDlg.container, 300, 80, true, true);
			tokenDlg.init();
		}), errFn);
	});
	
	auth();
};

/**
 * Checks if the client is authorized and calls the next step.
 */
NotionClient.prototype.executeRequest = function(url, data, method, success, error, failOnAuth)
{
	var doExecute = mxUtils.bind(this, function()
	{
		var acceptResponse = true;
		
		var timeoutThread = window.setTimeout(mxUtils.bind(this, function()
		{
			acceptResponse = false;
			error({code: App.ERROR_TIMEOUT, retry: doExecute});
		}), this.ui.timeout);

		var req = new mxXmlRequest(this.baseUrl + url, data, method);
		
		req.withCredentials = true;
		
		req.setRequestHeaders = mxUtils.bind(this, function(request, params)
		{
			if (_token != null)
			{
				request.setRequestHeader('Authorization', 'Bearer ' + _token);
			}
			
			request.setRequestHeader('Notion-Version', '2021-05-13');
			request.setRequestHeader('Content-Type', 'application/json');
		});
		
		req.send(mxUtils.bind(this, function(req)
		{
			window.clearTimeout(timeoutThread);
			
			if (acceptResponse)
			{
				// 404 (file not found) is a valid response for checkExists
				if (req.getStatus() >= 200 && req.getStatus() <= 299)
				{
					if (this.user == null)
					{
						this.setUser(new DrawioUser('notion', null, 'Notion'));
					}
					
					success(JSON.parse(req.getText()));
				}
				else if (!failOnAuth && (req.getStatus() === 401 || req.getStatus() === 400))
				{
					this.setUser(null);
					failOnAuth = true;
					//Authorize again using the refresh token
					this.authenticate(function()
					{
						doExecute();
					}, error, failOnAuth);
				}
				else
				{
					error(this.parseRequestText(req));
				}
			}
		}), mxUtils.bind(this, function(err)
		{
			window.clearTimeout(timeoutThread);
				    	
			if (acceptResponse)
			{
				error(err);
			}
		}));
	});
	
	doExecute();
};

/**
 * 
 */
NotionClient.prototype.getLibrary = function(id, success, error)
{
	this.getFile(id, success, error, false, true);
};

/**
 *
 */
NotionClient.prototype.getFile = function(id, success, error, denyConvert, asLibrary)
{
	asLibrary = (asLibrary != null) ? asLibrary : false;
	
	this.executeRequest('/v1/pages/' + encodeURIComponent(id), null, 'GET', mxUtils.bind(this, function(fileInfo)
	{
		try
		{
			var xmlParts = fileInfo.properties[this.xmlField].rich_text, xml = '';
			var fileNameObj = this.getTitle(fileInfo.properties);
			
			for (var i = 0; i < xmlParts.length; i++)
			{
				xml += xmlParts[i].text.content;
			}
			
			var meta = {id: id, name: fileNameObj.title, nameField: fileNameObj.key};
			
			if (asLibrary)
			{
				success(new NotionLibrary(this.ui, xml, meta));
			}
			else
			{
				success(new NotionFile(this.ui, xml, meta));
			}
		}
		catch(e)
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
	}), error);
};

/**
 * 
 */
NotionClient.prototype.insertLibrary = function(filename, data, success, error, folderObj)
{
	this.insertFile(filename, data, success, error, true, folderObj);
};

/**
 * 
 */
NotionClient.prototype.insertFile = function(filename, data, success, error, asLibrary, folderObj)
{
	asLibrary = (asLibrary != null) ? asLibrary : false;
	var folderId, nameField;
	
	var startSave = mxUtils.bind(this, function()
	{
		this.checkExists(folderId, filename, nameField, true, mxUtils.bind(this, function(checked, currentId)
		{
			if (checked)
			{
				this.writeFile(currentId? '/v1/pages/' + encodeURIComponent(currentId) : '/v1/pages', 
						currentId? null : folderId, filename, nameField, data, currentId? 'PATCH' : 'POST',
						mxUtils.bind(this, function(fileInfo)
				{
					var fileNameObj = this.getTitle(fileInfo.properties);
					var meta = {id: fileInfo.id, name: fileNameObj.title, nameField: fileNameObj.key};
				
					if (asLibrary)
					{
						success(new NotionLibrary(this.ui, data, meta));
					}
					else
					{
						success(new NotionFile(this.ui, data, meta));
					}
				}), error);
			}
			else
			{
				error();
			}
		}));
	});
	
	if (typeof folderObj === 'object')
	{
		nameField = this.getTitle(folderObj.schema.properties).key;
		folderId = folderObj.id;
		
		if (!folderObj.drawioReady)
		{
			folderObj.schema.properties[this.xmlField] = {
				name: this.xmlField,
				type: 'rich_text',
				rich_text: {}
			};
			
			this.executeRequest('/v1/databases/' + encodeURIComponent(folderObj.id), JSON.stringify({
			    title: folderObj.schema.title,
		        properties: folderObj.schema.properties
			}), 'PATCH', startSave, error);
		}
		else
		{
			startSave();
		}
	}
	else
	{
		error(); //This shouldn't happen!
	}
};

/**
 * 
 */
NotionClient.prototype.checkExists = function(parentId, filename, nameField, askReplace, fn)
{
	this.executeRequest('/v1/databases/' + encodeURIComponent(parentId) + '/query', JSON.stringify({
		filter: {
	        property: nameField,
			text: {
			    equals: filename
			}
		}
	}), 'POST', mxUtils.bind(this, function(resp)
	{
		if (resp.results.length == 0)
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
					fn(true, resp.results[0].id);
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
	});
};

/**
 * 
 */
NotionClient.prototype.saveFile = function(file, success, error)
{
	try
	{
		var data = file.getData();
		
		this.writeFile('/v1/pages/' + file.getId(), null, file.getTitle(), file.getNameField(),
				data, 'PATCH', mxUtils.bind(this, function(resp)
				{
					success(resp, data);
				}), error);
	}
	catch (e)
	{
		error(e);
	}
};

/**
 * 
 */
NotionClient.prototype.writeFile = function(url, folderId, filename, nameField, data, method, success, error)
{
	try
	{
		if (url != null && data != null)
		{
			//Notion has a limit on rich-text pages of 200KB
			if (data.length > 200000 /*200KB*/)
			{
				error({message: mxResources.get('drawingTooLarge') + ' (' +
					this.ui.formatFileSize(data.length) + ' / 200 KB)'});
				
				return;
			}
			
			var richTxt = []
			var parts = Math.ceil(data.length / 2000);
			
			for (var i = 0; i < parts; i++)
			{
				richTxt.push({
					text: {
                    	content: data.substr(i * 2000, 2000)
	                }
				});
			}
			
			var reqBody = {
				properties: {}
			};
			
			reqBody.properties[nameField] = {
            	title: [{
					text: {
						content: filename
					}
                }]
            };

			reqBody.properties[this.xmlField] = {
            	rich_text: richTxt
            };

			if (folderId)
			{
				reqBody['parent'] = { database_id: folderId };
			}
			
			this.executeRequest(url, JSON.stringify(reqBody), method, success, error);
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
 * 
 */
NotionClient.prototype.parseRequestText = function(req)
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
NotionClient.prototype.pickLibrary = function(fn)
{
	this.pickFile(fn);
};

/**
 * Checks if the client is authorized and calls the next step.
 */
NotionClient.prototype.pickFolder = function(fn)
{
	this.showNotionDialog(false, fn);
};

NotionClient.prototype.pickFile = function(fn)
{
	fn = (fn != null) ? fn : mxUtils.bind(this, function(id)
	{
		this.ui.loadFile('N' + encodeURIComponent(id));
	});
	
	this.showNotionDialog(true, fn);
};

/**
 * 
 */
NotionClient.prototype.showNotionDialog = function(showFiles, fn)
{
	var itemId, itemName;
	
	var content = document.createElement('div');
	content.style.whiteSpace = 'nowrap';
	content.style.overflow = 'hidden';
	content.style.height = '304px';

	var hd = document.createElement('h3');
	mxUtils.write(hd, mxResources.get((showFiles) ? 'officeSelDiag' : 'selectDB'));
	hd.style.cssText = 'width:100%;text-align:center;margin-top:0px;margin-bottom:12px';
	content.appendChild(hd);

	var div = document.createElement('div');
	div.style.whiteSpace = 'nowrap';
	div.style.border = '1px solid lightgray';
	div.style.boxSizing = 'border-box';
	div.style.padding = '4px';
	div.style.overflow = 'auto';
	div.style.lineHeight = '1.2em';
	div.style.height = '274px';
	content.appendChild(div);
	
	var listItem = document.createElement('div');
	listItem.style.textOverflow = 'ellipsis';
	listItem.style.boxSizing = 'border-box';
	listItem.style.overflow = 'hidden';
	listItem.style.padding = '4px';
	listItem.style.width = '100%';
	
	var dlg = new CustomDialog(this.ui, content, mxUtils.bind(this, function()
	{
		fn(itemId);
	}));
	this.ui.showDialog(dlg.container, 420, 380, true, true);
	
	if (showFiles)
	{
		dlg.okButton.parentNode.removeChild(dlg.okButton);
	}
	
	var createLink = mxUtils.bind(this, function(label, exec, padding, underline)
	{
		var link = document.createElement('a');
		link.setAttribute('title', label);
		link.style.cursor = 'pointer';
		mxUtils.write(link,  label);
		mxEvent.addListener(link, 'click', exec);
		
		if (underline)
		{
			link.style.textDecoration = 'underline';
		}
		
		if (padding != null)
		{
			var temp = listItem.cloneNode();
			temp.style.padding = padding;
			temp.appendChild(link);
			
			link = temp;
		}
		
		return link;
	});
	
	var updatePathInfo = mxUtils.bind(this, function()
	{
		var dbInfo = document.createElement('div');
		dbInfo.style.marginBottom = '8px';
		
		dbInfo.appendChild(createLink(itemName, mxUtils.bind(this, function()
		{
			itemId = null;
			selectDB();
		}), null, true));
		
		div.appendChild(dbInfo);
	});
	
	var error = mxUtils.bind(this, function(err)
	{
		// Pass a dummy notFoundMessage to bypass special handling 
		this.ui.handleError(err, null, mxUtils.bind(this, function()
		{
			this.ui.spinner.stop();
			
			if (this.getUser() != null)
			{
				itemId = null;
				
				selectDB();
			}
			else
			{
				this.ui.hideDialog();
			}
		}), null, {});
	});
	
	// Adds paging for DBs and diagrams (DB pages)
	var nextPageDiv = null;
	var scrollFn = null;
	var pageSize = 100;

	var selectFile = mxUtils.bind(this, function(nextCursor)
	{
		if (nextCursor == null)
		{
			div.innerHTML = '';
		}
		
		this.ui.spinner.spin(div, mxResources.get('loading'));
		dlg.okButton.removeAttribute('disabled');
		
		if (scrollFn != null)
		{
			mxEvent.removeListener(div, 'scroll', scrollFn);
			scrollFn = null;
		}
		
		if (nextPageDiv != null && nextPageDiv.parentNode != null)
		{
			nextPageDiv.parentNode.removeChild(nextPageDiv);
		}
		
		nextPageDiv = document.createElement('a');
		nextPageDiv.style.display = 'block';
		nextPageDiv.style.cursor = 'pointer';
		mxUtils.write(nextPageDiv, mxResources.get('more') + '...');
		
		var nextPage = mxUtils.bind(this, function()
		{
			selectFile(nextCursor);
		});
		
		mxEvent.addListener(nextPageDiv, 'click', nextPage);
		
		var reqBody = {
			page_size: pageSize
		};
		
		if (nextCursor != null)
		{
			reqBody.start_cursor = nextCursor;
		}
		
		this.executeRequest('/v1/databases/' + encodeURIComponent(itemId) + '/query', 
			JSON.stringify(reqBody), 'POST', mxUtils.bind(this, function(resp)
		{
			this.ui.spinner.stop();
			
			if (nextCursor == null)
			{
				updatePathInfo();
				
				div.appendChild(createLink('../ [Up]', mxUtils.bind(this, function()
				{
					itemId = null;
					selectDB();
				}), '4px'));
			}

			var files = resp.results;
			
			if (files == null || files.length == 0)
			{
				mxUtils.write(div, mxResources.get('noFiles'));
			}
			else
			{
				var gray = true;
				
				for (var i = 0; i < files.length; i++)
				{
					(mxUtils.bind(this, function(file, idx)
					{
						var temp = listItem.cloneNode();
						temp.style.backgroundColor = (gray) ?
							((Editor.isDarkMode()) ? '#000000' : '#eeeeee') : '';
						gray = !gray;

						var typeImg = document.createElement('img');
						typeImg.src = IMAGE_PATH + '/file.png';
						typeImg.setAttribute('align', 'absmiddle');
						typeImg.style.marginRight = '4px';
						typeImg.style.marginTop = '-4px';
						typeImg.width = 20;
						temp.appendChild(typeImg);
						
						temp.appendChild(createLink(this.getTitle(file.properties).title, mxUtils.bind(this, function()
						{
							this.ui.hideDialog();
							fn(file.id);
						})));
						
						div.appendChild(temp);
					}))(files[i], i);
				}
				
				if (resp.has_more)
				{
					nextCursor = resp.next_cursor;
					
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
		}), error, true);
	});

	var selectDB = mxUtils.bind(this, function(nextCursor)
	{
		if (nextCursor == null)
		{
			div.innerHTML = '';
		}
		
		dlg.okButton.setAttribute('disabled', 'disabled');
		this.ui.spinner.spin(div, mxResources.get('loading'));
		
		if (scrollFn != null)
		{
			mxEvent.removeListener(div, 'scroll', scrollFn);
		}
		
		if (nextPageDiv != null && nextPageDiv.parentNode != null)
		{
			nextPageDiv.parentNode.removeChild(nextPageDiv);
		}
		
		nextPageDiv = document.createElement('a');
		nextPageDiv.style.display = 'block';
		nextPageDiv.style.cursor = 'pointer';
		mxUtils.write(nextPageDiv, mxResources.get('more') + '...');
		
		var nextPage = mxUtils.bind(this, function()
		{
			selectDB(nextCursor);
		});
		
		mxEvent.addListener(nextPageDiv, 'click', nextPage);

		this.executeRequest('/v1/databases?page_size=' + pageSize + (nextCursor != null? '&start_cursor=' + nextCursor : ''), 
			null, 'GET', mxUtils.bind(this, function(resp)
		{
			this.ui.spinner.stop();
			var dbs = resp.results;
			var count = 0;
			
			if (dbs == null || dbs.length == 0)
			{
				mxUtils.write(div, mxResources.get('noDBs'));
			}
			else
			{
				for (var i = 0; i < dbs.length; i++)
				{
					var drawioReady = dbs[i].properties[this.xmlField] && 
								dbs[i].properties[this.xmlField].type == 'rich_text';
								
					//Filter DBs when opening a file
					if (showFiles && !drawioReady) continue;
					
					(mxUtils.bind(this, function(db, idx, drawioReady)
					{
						var temp = listItem.cloneNode();
						temp.style.backgroundColor = (idx % 2 == 0) ?
							((Editor.isDarkMode()) ? '#000000' : '#eeeeee') : '';
						
						temp.appendChild(createLink(this.getTitleVal(db), mxUtils.bind(this, function()
						{
							itemId = db.id;
							itemName = this.getTitleVal(db);
	
							if (showFiles)
							{
								selectFile();
							}
							else
							{
								this.ui.hideDialog();
								fn({id: itemId, drawioReady: drawioReady, schema: db});
							}
						})));
						
						div.appendChild(temp);
					}))(dbs[i], i, drawioReady);
					
					count++;
				}
			}

			if (resp.has_more)
			{
				nextCursor = resp.next_cursor;
				
				if (count == 0)
				{
					nextPage();
					return;
				}
				
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
			else if (count == 0 && div.innerHTML == '')
			{
				mxUtils.write(div, mxResources.get('noDBs'));
			}
		}), error);
	});
	
	selectDB();
};

/**
 *
 */
NotionClient.prototype.logout = function()
{
	//Send to server to clear token cookie
	this.executeRequest('/removeToken', null, 'GET', function(){}, function(){});
	this.setUser(null);
	_token = null;
};

})();