/**
 * Copyright (c) 2006-2017, JGraph Ltd
 * Copyright (c) 2006-2017, Gaudenz Alder
 */
TrelloClient = function(editorUi)
{
	DrawioClient.call(this, editorUi, 'tauth');
	Trello.setKey(this.key);
};

// Extends DrawioClient
mxUtils.extend(TrelloClient, DrawioClient);

TrelloClient.prototype.key = (window.location.hostname == 'test.draw.io') ?
	'e73615c79cf7e381aef91c85936e9553' : 'e73615c79cf7e381aef91c85936e9553';

TrelloClient.prototype.baseUrl = 'https://api.trello.com/1/';

TrelloClient.prototype.SEPARATOR = '|$|';

/**
 * Maximum attachment size of Trello.
 */
TrelloClient.prototype.maxFileSize = 10000000 /*10MB*/;

/**
 * Default extension for new files.
 */
TrelloClient.prototype.extension = '.xml'; //TODO export to png

/**
 * 
 */
TrelloClient.prototype.getLibrary = function(id, success, error)
{
	this.getFile(id, success, error, false, true);
};

/**
 * 
 */
TrelloClient.prototype.getFile = function(id, success, error, denyConvert, asLibrary)
{
	asLibrary = (asLibrary != null) ? asLibrary : false;

	Trello.authorize({
	  type: 'popup',
	  name: 'draw.io',
	  scope: {
	    read: 'true',
	    write: 'true' },
	  expiration: 'never',
	  success: mxUtils.bind(this, function() {
		var ids = id.split(this.SEPARATOR);
		Trello.cards.get(ids[0] + '/attachments/' + ids[1], mxUtils.bind(this, function(meta) 
		{ 
			//TODO Trello doesn't allow CORS requests to load attachments. Confirm that and make sure that only a proxy technique can work!
			// Handles .vsdx, Gliffy and PNG+XML files by creating a temporary file
			if ((/\.vsdx$/i.test(meta.name) || /\.gliffy$/i.test(meta.name) || /\.png$/i.test(meta.name)))
			{
				this.ui.convertFile(PROXY_URL + '?url=' + encodeURIComponent(meta.url), meta.name, meta.mimeType,
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
				
				this.ui.loadUrl(PROXY_URL + '?url=' + encodeURIComponent(meta.url), mxUtils.bind(this, function(data)
	    		{
					window.clearTimeout(timeoutThread);
		    	
			    	if (acceptResponse)
			    	{
			    		//keep our id which includes the cardId
			    		meta.compoundId = id;
			    		
						if (asLibrary)
						{
							success(new TrelloLibrary(this.ui, data, meta));
						}
						else
						{
							success(new TrelloFile(this.ui, data, meta));
						}
			    	}
	    		}), mxUtils.bind(this, function(req)
				{
					window.clearTimeout(timeoutThread);
			    	
			    	if (acceptResponse)
			    	{
						error();
			    	}
				}), meta.mimeType != null &&
	    			meta.mimeType.substring(0, 6) == 'image/');
			}
		}));
	  }),
	  error: error
	});
};

/**
 * 
 */
TrelloClient.prototype.insertLibrary = function(filename, data, success, error, cardId)
{
	this.insertFile(filename, data, success, error, true, cardId);
};

/**
 * 
 */
TrelloClient.prototype.insertFile = function(filename, data, success, error, asLibrary, cardId)
{
	asLibrary = (asLibrary != null) ? asLibrary : false;
	
	this.writeFile(filename, data, cardId, mxUtils.bind(this, function(meta)
	{
		if (asLibrary)
		{
			success(new TrelloLibrary(this.ui, data, meta));
		}
		else
		{
			success(new TrelloFile(this.ui, data, meta));
		}
	}), error);
};

/**
 * 
 */
TrelloClient.prototype.saveFile = function(file, success, error)
{
	//delete file first, then write it again
	var ids = file.meta.compoundId.split(this.SEPARATOR);
	Trello.authorize({
	  type: 'popup',
	  name: 'draw.io',
	  scope: {
	    read: 'true',
	    write: 'true' 
	  },
	  expiration: 'never',
	  success: mxUtils.bind(this, function() 
	  {
		  Trello.del('cards/' + ids[0] + '/attachments/' + ids[1], mxUtils.bind(this, function()
		  {
			  this.writeFile(file.meta.name, file.getData(), ids[0], success, error);
		  }), error);
	  }),
	  error: error
	});	
};

/**
 * 
 */
TrelloClient.prototype.writeFile = function(filename, data, cardId, success, error)
{
	if (filename != null && data != null)
	{
		if (data.length >= this.maxFileSize)
		{
			error({message: mxResources.get('drawingTooLarge') + ' (' +
				this.ui.formatFileSize(data.length) + ' / 10 MB)'});
			
			return;
		}
		
		var fn = mxUtils.bind(this, function()
		{
			Trello.authorize({
			  type: 'popup',
			  name: 'draw.io',
			  scope: {
			    read: 'true',
			    write: 'true' 
			  },
			  expiration: 'never',
			  success: mxUtils.bind(this, function() 
			  {
				  var acceptResponse = true;
					
				  var timeoutThread = window.setTimeout(mxUtils.bind(this, function()
				  {
					acceptResponse = false;
					error({code: App.ERROR_TIMEOUT, retry: fn});
				  }), this.ui.timeout);
					
				  var formData = new FormData();
				  formData.append("key", Trello.key());
				  formData.append("token", Trello.token());
				  formData.append("file", data);
				  formData.append("name", filename);  
	
				  var request = new XMLHttpRequest();
				  request.responseType = "json";
				  
				  request.onreadystatechange = mxUtils.bind(this, function() 
				  {
				    if (request.readyState === 4)
				    {
				    	window.clearTimeout(timeoutThread);
				    	
				    	if (acceptResponse)
			    		{
				    		if (request.status == 200)
			    			{
				    			var fileMeta = request.response;
				    			fileMeta.compoundId = cardId + this.SEPARATOR + fileMeta.id
				    			success(fileMeta);
			    			}
			    			else
		    				{
				    			error();
		    				}
			    		}
				    }
				  });
				  
				  request.open("POST", this.baseUrl + 'cards/' + cardId + '/attachments');
				  request.send(formData);
			  }),
			  error: error
			});
		});
		
		fn();
	}
	else
	{
		error({message: mxResources.get('unknownError')});
	}
};

/**
 * Checks if the client is authorized and calls the next step.
 */
TrelloClient.prototype.pickLibrary = function(fn)
{
	this.pickFile(fn);
};

/**
 * 
 */
TrelloClient.prototype.pickFolder = function(fn)
{
	Trello.authorize({
		  type: 'popup',
		  name: 'draw.io',
		  scope: {
		    read: 'true',
		    write: 'true' },
		  expiration: 'never',
		  success: mxUtils.bind(this, function() {
			  //show file select
			  this.showTrelloDialog(false, fn);
		  }),
		  error: mxUtils.bind(this, function(e)
			{
				this.ui.showError(mxResources.get('error'), e);
			})
		});
};

/**
 * Checks if the client is authorized and calls the next step.
 */
TrelloClient.prototype.pickFile = function(fn, returnObject)
{
	fn = (fn != null) ? fn : mxUtils.bind(this, function(id)
	{
		this.ui.loadFile('T' + encodeURIComponent(id));
	});
	
	Trello.authorize({
		  type: 'popup',
		  name: 'draw.io',
		  scope: {
		    read: 'true',
		    write: 'true' },
		  expiration: 'never',
		  success: mxUtils.bind(this, function() {
			  //show file select
			  this.showTrelloDialog(true, fn);
		  }),
		  error: mxUtils.bind(this, function(e)
			{
				this.ui.showError(mxResources.get('error'), e);
			})
		});
};


/**
 * 
 */
TrelloClient.prototype.showTrelloDialog = function(showFiles, fn)
{
	var cardId = null;
	var filter = null;
	var linkCounter = 0;
	
	var content = document.createElement('div');
	content.style.whiteSpace = 'nowrap';
	content.style.overflow = 'hidden';
	content.style.height = '224px';

	var hd = document.createElement('h3');
	mxUtils.write(hd, showFiles? mxResources.get('selectFile') : mxResources.get('selectCard'));
	hd.style.cssText = 'width:100%;text-align:center;margin-top:0px;margin-bottom:12px';
	content.appendChild(hd);

	var div = document.createElement('div');
	div.style.whiteSpace = 'nowrap';
	div.style.overflow = 'auto';
	div.style.height = '194px';
	content.appendChild(div);

	var dlg = new CustomDialog(this.ui, content);
	this.ui.showDialog(dlg.container, 340, 270, true, true);
	
	dlg.okButton.parentNode.removeChild(dlg.okButton);
	
	var createLink = mxUtils.bind(this, function(label, fn, preview)
	{
		linkCounter++;
		var div = document.createElement('div');
		div.style = "width:100%;vertical-align:middle;background:" + (linkCounter % 2 == 0? "#eee" : "#fff");
		var link = document.createElement('a');
		link.setAttribute('href', 'javascript:void(0);');
		
		if (preview != null)
		{
			var img = document.createElement('img');
			img.src = preview.url;
			img.width = preview.width;
			img.height= preview.height;
			img.style= "border: 1px solid black;margin:5px;vertical-align:middle"
			link.appendChild(img);
		}
		
		mxUtils.write(link,  label);
		mxEvent.addListener(link, 'click', fn);
		
		div.appendChild(link);
		
		return div;
	});
	
	var error = mxUtils.bind(this, function(err)
	{
		this.ui.handleError(err, null, mxUtils.bind(this, function()
		{
			this.ui.spinner.stop();
			
			this.ui.hideDialog();
		}));
	});
	
	var selectAtt = mxUtils.bind(this, function()
	{
		linkCounter = 0;
		div.innerHTML = '';
		this.ui.spinner.spin(div, mxResources.get('loading'));
		
		Trello.cards.get(cardId + '/attachments', {fields: 'id,name,previews'}, mxUtils.bind(this, function(data)
		{
			this.ui.spinner.stop();
			var files = data;
			div.appendChild(createLink('../ [Up]', mxUtils.bind(this, function()
			{
				selectCard();
			})));
			mxUtils.br(div);

			if (files == null || files.length == 0)
			{
				mxUtils.write(div, mxResources.get('noFiles'));
			}
			else
			{
				var listFiles = mxUtils.bind(this, function()
				{
					for (var i = 0; i < files.length; i++)
					{
						(mxUtils.bind(this, function(file)
						{
							div.appendChild(createLink(file.name, mxUtils.bind(this, function()
							{
								this.ui.hideDialog();
								fn(cardId + this.SEPARATOR + file.id);
							}), file.previews != null? file.previews[0] : null));
						}))(files[i]);
					}
				});
				
				listFiles();
			}
		}), error);
	});
	
	// Adds paging for cards (files limited to 1000 by API)
	var pageSize = 100;
	var nextPageDiv = null;
	var scrollFn = null;

	var selectCard = mxUtils.bind(this, function(page)
	{
		if (page == null)
		{
			linkCounter = 0;
			div.innerHTML = '';
			page = 1;
		}
		
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
			selectCard(page + 1);
		});
		
		mxEvent.addListener(nextPageDiv, 'click', nextPage);
		
		Trello.get('search', {
				'query': (filter != null ? filter : 'is:open'),
				'cards_limit': pageSize,
				'cards_page': page-1
			},
			mxUtils.bind(this, function(data)
			{
				this.ui.spinner.stop();
				var cards = (data != null) ? data.cards : null;
				
				if (cards == null || cards.length == 0)
				{
					if (filter != null)
					{
						div.appendChild(createLink(mxResources.get('clearFilter'), mxUtils.bind(this, function()
						{
							filter = null;
							selectCard();
						})));
						mxUtils.br(div);
					}
					mxUtils.write(div, mxResources.get('noFiles'));
				}
				else
				{
					if (page == 1)
					{
						if (filter != null)
						{
							div.appendChild(createLink(mxResources.get('clearFilter'), mxUtils.bind(this, function()
							{
								filter = null;
								selectCard();
							})));
						}
						else
						{
							div.appendChild(createLink(mxResources.get('filterCards') + '...', mxUtils.bind(this, function()
							{
								var dlg = new FilenameDialog(this.ui, 'is:open', mxResources.get('ok'), mxUtils.bind(this, function(value)
								{
									if (value != null)
									{
										filter = value;
										selectCard();
									}
								}), mxResources.get('cardName'), null, null, 'http://help.trello.com/article/808-searching-for-cards-all-boards');
								this.ui.showDialog(dlg.container, 300, 80, true, false);
								dlg.init();
							})));
						}
						
						mxUtils.br(div);
					}
					
					for (var i = 0; i < cards.length; i++)
					{
						(mxUtils.bind(this, function(card)
						{
							div.appendChild(createLink(card.name, mxUtils.bind(this, function()
							{
								if (showFiles)
								{
									cardId = card.id;
									selectAtt();
								}
								else
								{
									this.ui.hideDialog();
									fn(card.id);
								}
							})));
						}))(cards[i]);
					}
				}
	
				if (cards.length == pageSize)
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
			}),
		error);
	});
	
	selectCard();
};

/**
 * Checks if the client is authorized
 */
TrelloClient.prototype.isAuthorized = function()
{
	//TODO this may break if Trello client.js is changed
	return localStorage["trello_token"] != null; //Trello.authorized(); doesn't work unless authorize is called first
};


/**
 * Logout and deauthorize the user. 
 */
TrelloClient.prototype.logout = function()
{
	Trello.deauthorize();
};
