var AC = {};

AC.autosaveTimeout = 10000;
AC.draftExtension = '.tmp';
AC.draftPrefix = '~';
AC.timeout = 25000;

// If save should also exit. To disable this, multiple saveMacro calls
// must be possible (not yet in production on 08-AUG-2017)
AC.autoExit = true;

// Last Checked on 08-AUG-2017: No delete scope needed to delete drafts
// LATER: If delete scope is needed users must upgrade to the latest json
// Disabled. Flag to mute notifications for drafts is needed. 16-AUG-2017
AC.draftEnabled = true; //Enabled with the new save that mute notifications for saving TODO is there notification for deleting a draft?

AC.getUrlParam = function(param, escape, url){
    try{
    	var url = url || window.location.search;
        var regex = new RegExp(param + '=([^&]+)'),
        data = regex.exec(url)[1];
        // decode URI with plus sign fix.
        return (escape) ? window.decodeURIComponent(data.replace(/\+/g, '%20')) : data;
    } catch (e){
        return undefined;
    }
};

AC.getMetaTag = function(name) {
	return document.getElementsByTagName('meta')[name].getAttribute('content');
}

//Code from: https://stackoverflow.com/questions/16245767/creating-a-blob-from-a-base64-string-in-javascript
AC.b64toBlob = function(b64Data, contentType, sliceSize, isByteCharacters) 
{
	  contentType = contentType || '';
	  sliceSize = sliceSize || 512;

	  var byteCharacters = isByteCharacters? b64Data : atob(b64Data);
	  var byteArrays = [];

	  for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
	    var slice = byteCharacters.slice(offset, offset + sliceSize);

	    var byteNumbers = new Array(slice.length);
	    for (var i = 0; i < slice.length; i++) {
	      byteNumbers[i] = slice.charCodeAt(i);
	    }

	    var byteArray = new Uint8Array(byteNumbers);

	    byteArrays.push(byteArray);
	  }

	  var blob = new Blob(byteArrays, {type: contentType});
	  return blob;
  }

AC.initAsync = function(baseUrl)
{
	var link = document.createElement('a');
	link.href = location.href;
	link.href = link.href; //to have 'host' populated under IE
	var hostUrl = link.protocol + '//' + link.hostname;
	var lang = AC.getUrlParam('loc', true);
	var site = AC.getUrlParam('xdm_e', true);
	var user = AC.getUrlParam('user_id', true);

	if (lang != null)
	{
		var dash = lang.indexOf('-');
		
		if (dash >= 0)
		{
			lang = lang.substring(0, dash);
		}
	}

	var editor = document.createElement('iframe');
	editor.setAttribute('width', '100%');
	editor.setAttribute('height', '100%');
	editor.style.width = '100%';
	editor.style.height = '100%';
	editor.setAttribute('id', 'editorFrame');
	editor.setAttribute('frameborder', '0');
	//editor.setAttribute('src', 'https://9674265b.ngrok.io/?dev=1&drawdev=1&' +
	editor.setAttribute('src', hostUrl + '/?' +
			'ui=atlas&p=ac&embed=1&modified=unsavedChanges' +
			((!AC.autoExit) ? '&saveAndExit=1' : '') +
			'&keepmodified=1&spin=1&libraries=1&proto=json' +
		((lang != null) ? '&lang=' + lang : '') + ((site != null) ? '&site=' + encodeURIComponent(site) : '') +
		((user != null) ? '&user=' + encodeURIComponent(user) : ''));

	var initReceived = false;
	var draftHandled = false;
	var waitingForAttachments = false;
	var xmlReceived = null;
	var draftXml = null;
	var draftName = null;
	var filename = null;
	var theMacroData = null;
	var pageId = null;
	var theLocation = null;
	var attachments = null;

	var serverName = document.referrer;
	var index1 = serverName.indexOf('//');

	if (index1 > 0)
	{
		var index2 = serverName.indexOf('/', index1 + 2);
		
		if (index2 > index1)
		{
			serverName = serverName.substring(index1 + 2, index2);
		}
	}
	
	function startEditor()
	{
		if (initReceived && xmlReceived != null && draftHandled && !waitingForAttachments)
		{
			AC.init(baseUrl, theLocation, pageId, editor, filename, xmlReceived, draftName, draftXml, theMacroData);
		}
	};
	
	function loadDraft()
	{
		if (waitingForAttachments)
		{
			return;
		}
		
		if (AC.draftEnabled && pageId != null && attachments != null &&
			(draftName != null || xmlReceived == '') && !draftHandled)
		{
			// Searches for pending new drafts from this user
			var prefix = '~drawio~' + user + '~';
			
			// Check if attachments contains draftName
			for (var i = 0; i < attachments.length; i++)
			{
				var fn = attachments[i].fileName;
				
				if (draftName == null && attachments[i].fileSize > 0 &&
					fn.substring(0, prefix.length) === prefix &&
					fn.substring(fn.length - AC.draftExtension.length) === AC.draftExtension)
				{
					filename = fn.substring(prefix.length, fn.length - AC.draftExtension.length);
					draftName = fn;						
				}
				
				if (fn == draftName)
				{
					AP.require(['messages', 'confluence'], function (messages, confluence)
					{
						var acceptResponse = true;
						var timeoutHandler = function()
						{
							acceptResponse = false;
							document.body.style.backgroundSize = 'auto auto';
							document.body.style.backgroundImage = 'url(/images/stop-flat-icon-80.png)';
							editor.contentWindow.postMessage(JSON.stringify({action: 'spinner', show: false}), '*');
	
							var message = messages.error('The connection has timed out', 'The server at ' +
								serverName + ' is taking too long to respond.');
						
							messages.onClose(message, function()
							{
								confluence.closeMacroEditor();
							});
						};
						
						var timeoutThread = window.setTimeout(timeoutHandler, AC.timeout);
						
						AC.loadDiagram(pageId, draftName, null, function(loadResp)
						{
							//console.trace('DRAFT: Found', draftName, loadResp);
					    		window.clearTimeout(timeoutThread);
					    		
					    		if (acceptResponse)
						    	{
								if (loadResp != null && loadResp.length > 0)
								{
									draftXml = loadResp;
								}
								
								draftHandled = true;
								startEditor();
						    	}
						}, function()
						{
					    		window.clearTimeout(timeoutThread);
					    		
					    		if (acceptResponse)
						    	{
					    			draftHandled = true;
					    			startEditor();
						    	}
						});
					});
					
					// Terminates function
					return;
				}
			}
		}

		draftHandled = true;
		startEditor();
	};
	
	var initHandler = function(evt)
	{
		if (evt.origin == hostUrl)
		{
			var msg = JSON.parse(evt.data);
			
			if (msg.event == 'init')
			{
				window.removeEventListener('message', initHandler);
				document.body.style.backgroundImage = 'none';
				initReceived = true;
				startEditor();
			}
		}
	};

	window.addEventListener('message', initHandler);

	// Parallel loading for data and iframe
	document.body.appendChild(editor);
	
	AP.getLocation(function(location) 
	{
		theLocation = location;
		
		AP.require(['messages', 'navigator', 'confluence', 'request'], function (messages, navigator, confluence, request)
		{
		    navigator.getLocation(function (data)
		    {
			    	if (data != null && data.target != null && data.context!= null &&
			    		(data.target == 'contentedit' || data.target == 'contentcreate'))
			    	{
			    		pageId = data.context.contentId;
			    	}

			    	if (pageId == null || isNaN(pageId))
		    		{
		    			document.body.style.backgroundImage = 'url(/images/stop-flat-icon-80.png)';
		    			document.body.style.backgroundSize = 'auto auto';
			    		editor.parentNode.removeChild(editor);
		    			
			    		var message;
			    		
			    		if (data != null && data.target == 'contentcreate') 
			    		{
			    			message = messages.error('Cannot insert draw.io diagram to a new Confluence page',
			    				'Please save the page and try again.');
			    		}
			    		else 
			    		{
			    			message = messages.error('Unable to determine page ID',
		    				'Please contact your Confluence administrator.');
			    		}
			    		
			    		
		    			messages.onClose(message, function()
		    			{
		    				confluence.closeMacroEditor();
		    			});
		    		}
			    	else
			    	{
				    	// Not needed if drafts not enabled
				    	if (AC.draftEnabled)
				    	{
				    		waitingForAttachments = true;
				    		var acceptResponse2 = true;
				    		var timeoutHandler2 = function()
				    		{
				    			acceptResponse2 = false;
				    			document.body.style.backgroundSize = 'auto auto';
				    			document.body.style.backgroundImage = 'url(/images/stop-flat-icon-80.png)';
				    			editor.contentWindow.postMessage(JSON.stringify({action: 'spinner', show: false}), '*');

				    			var message = messages.error('The connection has timed out', 'The server at ' +
				    				serverName + ' is taking too long to respond.');
				    		
				    			messages.onClose(message, function()
				    			{
				    				confluence.closeMacroEditor();
				    			});
				    		};
				    		
						var timeoutThread2 = window.setTimeout(timeoutHandler2, AC.timeout);
						
						request({
							type: 'POST',
							data: JSON.stringify([pageId]),
							url: '/rpc/json-rpc/confluenceservice-v2/getAttachments',
							contentType: 'application/json;charset=UTF-8',
							success: function(res)
							{
						    		window.clearTimeout(timeoutThread2);
						    		
						    		if (acceptResponse2)
							    	{
									waitingForAttachments = false;
						    			attachments = JSON.parse(res);
						    			loadDraft();
							    	}
							},
							error: function(res)
							{
						    		window.clearTimeout(timeoutThread2);
						    		
						    		if (acceptResponse2)
							    	{
									waitingForAttachments = false;
						    			draftHandled = true;
							    	}
							}
						});
				    	}
			    	
					var acceptResponse = true;	
					var timeoutHandler = function()
					{
						acceptResponse = false;
						document.body.style.backgroundSize = 'auto auto';
						document.body.style.backgroundImage = 'url(/images/stop-flat-icon-80.png)';
						editor.contentWindow.postMessage(JSON.stringify({action: 'spinner', show: false}), '*');

						var message = messages.error('The connection has timed out', 'The server at ' +
							serverName + ' is taking too long to respond.');
					
						messages.onClose(message, function()
						{
							confluence.closeMacroEditor();
						});
					};
					
					var timeoutThread = window.setTimeout(timeoutHandler, AC.timeout);
					
				    	confluence.getMacroData(function (macroData) 
				    	{
				    		window.clearTimeout(timeoutThread);
				    		
				    		if (acceptResponse)
					    	{
					    		var name = (macroData != null) ? (macroData.diagramName || '') : null;
			    				theMacroData = macroData;
			    				
					    		if (name != null && name.length > 0)
					    		{
					    			var revision = parseInt(macroData.revision);
					    			var owningPageId = macroData.pageId;
						    		draftName = (name != null) ? AC.draftPrefix + name + AC.draftExtension : null;
						    		loadDraft();
					    			
					    			if (isNaN(revision))
					    			{
					    				revision = null;
					    			}
					    			
								timeoutThread = window.setTimeout(timeoutHandler, AC.timeout);
			
					    			AC.loadDiagram(pageId, name, revision, function(loadResp)
					    			{
							    		window.clearTimeout(timeoutThread);
							    		
							    		if (acceptResponse)
								    	{
						    				xmlReceived = loadResp;
						    				filename = name;
										//console.trace('DRAFT: Created', AC.draftPrefix + filename + AC.draftExtension);
										startEditor();
								    	}
								}, 
					    			function(resp) 
					    			{
							    		window.clearTimeout(timeoutThread);
							    		
							    		if (acceptResponse)
								    	{
						    				editor.parentNode.removeChild(editor);
						    				var message = messages.error('Read Error', (resp.status == 404) ?
						    					'File not found' : 'Error loading file');
						    		
						    				messages.onClose(message, function()
						    				{
						    					confluence.closeMacroEditor();
						    				});
								    	}
					    			}, owningPageId, true);
					    		}
					    		else
					    		{
					    			filename = null;
						    		xmlReceived = '';
						    		loadDraft();
					    		}
					    	}
				    	});
			    	}
		    	});
		});
	});
};

AC.init = function(baseUrl, location, pageId, editor, diagramName, initialXml, draftName, draftXml, macroData)
{
	// Hides the logo
	document.body.style.backgroundImage = 'none';
	var user = AC.getUrlParam('user_id', true);
	var draftExists = false;
	
	AP.require(['messages', 'confluence', 'request'], function(messages, confluence, request)
	{
		var newPage = location.indexOf('createpage.action') > -1 ? true : false;
		var diagramXml = null;
		var link = document.createElement('a');
		link.href = location.href;
		link.href = link.href; //to have 'host' populated under IE
		var hostUrl = link.protocol + '//' + link.hostname;
		
	   	function removeDraft(fn, err)
	   	{
			if (draftExists)
			{
				AC.removeAttachment(pageId, draftName, fn, err);
			}
			else
			{
				fn();
			}
	   	};
		
	   	function saveDraft(xml, fn, err)
	   	{
	   		//console.trace('DRAFT: Save', draftName, xml);
	   		
			AC.saveDiagram(pageId, draftName,
				xml,
				function(res)
				{
					var obj = null;
					
					try
					{
						obj = JSON.parse(res);
					}
					catch (e)
					{
						// ignore
					}
					
					//console.trace('DRAFT: Saved', obj);
					
					if (obj != null && obj.error != null)
					{
						if (err != null)
						{
							err(obj);
						}
					}
					else
					{
						draftExists = true;
						
						if (fn != null)
						{
							fn(obj);
						}
					}
				},
				function(res)
				{
					//console.trace('DRAFT: Save error');
					
					if (err != null)
					{
						err(obj);
					}
				}, false, 'text/plain', 'Created by Draw.io');
	   	};
	   	
		function showTemplateDialog()
		{
			if (AC.draftEnabled)
			{
				editor.contentWindow.postMessage(JSON.stringify({action: 'template', callback: true}), '*');
			}
			else
			{
				editor.contentWindow.postMessage(JSON.stringify({action: 'template', enableRecent: true, enableSearch: true}), '*');
			}
		};
		
		function promptName(name, err, errKey)
		{
			editor.contentWindow.postMessage(JSON.stringify({action: 'prompt',
				titleKey: 'filename', okKey: 'save', defaultValue: name || '' }), '*');
			
			if (err != null || errKey != null)
			{
				editor.contentWindow.postMessage(JSON.stringify({action: 'dialog',
					titleKey: 'error', message: err, messageKey: errKey,
					buttonKey: 'ok'}), '*');
			}
		};
		
		function checkName(name, fn, err)
		{
			if (name == null || name.length == 0)
			{
				err(name, 'Filename too short');
			}
			else if (/[&\*+=\\;/{}|\":<>\?~]/g.test(name))
			{
				err(name, 'Invalid characters \\ / | : { } < > & + ? = ; * " ~');
			}
			else
			{
				request({
					type: 'POST',
					data: JSON.stringify([pageId]),
					url: '/rpc/json-rpc/confluenceservice-v2/getAttachments',
					contentType: 'application/json;charset=UTF-8',
					success: function(res)
					{
						var attachments = JSON.parse(res);
						
						if (attachments.error != null)
						{
							err(name, attachments.error.message);
						}
						else
						{
							var draftPattern = new RegExp('^~drawio~.*~' + name.
								replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&") + '.tmp$', 'i');
							var lc = name.toLowerCase();
							var dn = AC.draftPrefix + lc + AC.draftExtension
							var fileExists = false;

							// Checks if any files will be overwritten
							for (var i = 0; i < attachments.length && !fileExists; i++)
							{
								// To avoid name clash with new diagrams of other users,
								// we need to check for ~drawio~.*~filename.tmp
								var an = attachments[i].fileName.toLowerCase();

								if (an == lc || an == lc + '.png' || (AC.draftEnabled &&
									(an == dn || draftPattern.test(an))))
								{
									fileExists = true;
								}
							}
							
							if (fileExists)
							{
								err(name, null, 'fileExists');
							}
							else
							{
								fn(name);
							}
						}
					},
					error: function(res) 
					{
						// LATER: What error message to return here?
						err(name, res);
					}
				});
			}
		};

	   	var autosaveThread = null;
	   	var autosaveCounter = 0;
	   	var currentXml = null;

		// Shows template dialog for new diagrams with no draft state
		if (initialXml != '')
		{
			editor.contentWindow.postMessage(JSON.stringify({action: 'load',
				autosave: 1, xml: initialXml, title: diagramName,
				macroData: macroData}), '*');
		}

		if (draftXml != null)
		{
			// Keeps ignore option even for existing files
			editor.contentWindow.postMessage(JSON.stringify({action: 'draft', xml: draftXml,
				name: diagramName, discardKey: 'discardChanges', ignore: true}), '*');
		}
		else if (initialXml == '')
		{
			showTemplateDialog();
		}
		
		var messageListener = function(evt)
		{
			if (typeof window.AC !== 'undefined' && evt.origin == hostUrl)
			{
				var drawMsg = JSON.parse(evt.data);
				
				if (drawMsg.event == 'draft')
				{
					if (drawMsg.error != null)
					{
						//console.log('DRAFT: error', drawMsg);
						
						editor.parentNode.removeChild(editor);
						var message = messages.error('Draft Read Error', drawMsg.error);
	    		
		    				messages.onClose(message, function()
		    				{
		    					confluence.closeMacroEditor();
		    				});
					}
					else if (drawMsg.result == 'edit')
					{
						// Use draft
						//console.trace('DRAFT: Using', draftName);

						editor.contentWindow.postMessage(JSON.stringify({action: 'load',
							autosave: 1, xml: drawMsg.message.xml, title: diagramName}), '*');
						editor.contentWindow.postMessage(JSON.stringify({action: 'status',
							messageKey: 'unsavedChanges', modified: true}), '*');
						draftExists = true;
					}
					else
					{
						if (initialXml == '' || drawMsg.result == 'ignore')
						{
							if (initialXml != '')
							{
								editor.contentWindow.postMessage(JSON.stringify({action: 'load',
									autosave: 1, xml: initialXml, title: diagramName,
									macroData: macroData}), '*');
							}
							else
							{
								diagramName = null;
								showTemplateDialog();
							}
						}
						else
						{
							//console.trace('DRAFT: Discarding', draftName);
							
							AC.removeAttachment(pageId, draftName);
						}
					}	
				}
				else if (drawMsg.event == 'searchDocs')
				{
					//since we don't use a unique file extension for draw.io diagrams, we need to find pages having draw.io macro also
					//So, two search requests are needed
					AP.require('request', function(request) {
						request({
							//TODO this query can be enhanced to get part of the name matching but the problem is with the png!
							url: '/rest/api/content/search?cql=' + encodeURIComponent('type=attachment and (title ~ "' + drawMsg.searchStr + '" or title ~ "' + drawMsg.searchStr + '.png")') + '&limit=100', //limit is 100 and the pages limit is 50 since each diagram has two attachments (and we assume one diagram per page) 
							success: function(resp) 
							{
								resp = JSON.parse(resp);
								var retList = [];
								var list = resp.results; 
								if (list)
								{
									var attMap = {};
									//convert the list to map so we can search by name effeciently
									for (var i = 0; i < list.length; i++)
									{
										//key is pageId + | + att name
										var pageId = list[i]["_links"]["webui"].match(/pages\/(\d+)/);
										
										if (pageId != null)
										{
											attMap[pageId[1] + '|' + list[i].title] = {att: list[i], pageId: pageId[1]};
										}
									}

									//TODO confirm that the attachments are in a page having draw.io macro
									for (var key in attMap) 
									{
										var att = attMap[key];
										
										if (attMap[key+'.png']) //each draw.io attachment should have an associated png preview
										{
											//We cannot get the latest version info, it can searched when a diagram is selected
											retList.push({
												title: att.att.title,
												url: "/download/attachments/" + att.pageId + "/"
													+ encodeURIComponent(att.att.title),
												info: {
													id: att.att.id, 
													pageId: att.pageId 
												},
												imgUrl: baseUrl + "/download/attachments/" + att.pageId + "/"
													+ encodeURIComponent(att.att.title)
													+ ".png?api=v2"
											});
										}
									}
									editor.contentWindow.postMessage(JSON.stringify({action: 'searchDocsList',
										list: retList}), '*');
								}
							},
							error : function(resp) 
							{
								editor.contentWindow.postMessage(JSON.stringify({action: 'searchDocsList',
									list: [], errorMsg: "Network Error!"}), '*');
							}
						});
					});

				}
				else if (drawMsg.event == 'recentDocs')
				{
					//since we don't use a unique file extension for draw.io diagrams, we need to find pages having draw.io macro also
					//So, two search requests are needed
					AP.require('request', function(request) {
						request({
							url: '/rest/api/content/search?cql=type=attachment%20and%20lastmodified%3E%20startOfDay(%22-7d%22)&limit=100', //cql= type=attachment and lastmodified > startOfDay("-7d") //modified in the last 7 days
																																		   //limit is 100 and the pages limit is 50 since each diagram has two attachments (and we assume one diagram per page) 
							success: function(resp) 
							{
								resp = JSON.parse(resp);
								var retList = [];
								var list = resp.results; 
								if (list)
								{
									var attMap = {};
									//convert the list to map so we can search by name effeciently
									for (var i = 0; i < list.length; i++)
									{
										//key is pageId + | + att name
										var pageId = list[i]["_links"]["webui"].match(/pages\/(\d+)/);
										
										if (pageId != null)
										{
											attMap[pageId[1] + '|' + list[i].title] = {att: list[i], pageId: pageId[1]};
										}
									}

									//confirm that the attachments are in a page having draw.io macro
									request({
										url: '/rest/api/content/search?cql=macro=drawio%20and%20lastmodified%3E%20startOfDay(%22-7d%22)&limit=50', //cql= macro=drawio and lastmodified > startOfDay("-7d") //modified in the last 7 days
										success: function(resp) 
										{
											resp = JSON.parse(resp);
											var pages = {};
											var list = resp.results; 
											if (list)
											{
												for (var i = 0; i < list.length; i++)
												{
													pages[list[i].id] = list[i];
												}
											}
											
											
											for (var key in attMap) 
											{
												var att = attMap[key];
												
												if (attMap[key+'.png'] && pages[att.pageId] != null) //each draw.io attachment should have an associated png preview
												{
													//We cannot get the latest version info, it can searched when a diagram is selected
													retList.push({
														title: att.att.title,
														url: "/download/attachments/" + att.pageId + "/"
															+ encodeURIComponent(att.att.title),
														info: {
															id: att.att.id, 
															pageId: att.pageId
														},
														imgUrl: baseUrl + "/download/attachments/" + att.pageId + "/"
														+ encodeURIComponent(att.att.title)
														+ ".png?api=v2"
													});
												}
											}
											editor.contentWindow.postMessage(JSON.stringify({action: 'recentDocsList',
												list: retList}), '*');
										},
										error : function(resp) 
										{
											editor.contentWindow.postMessage(JSON.stringify({action: 'recentDocsList',
												list: [], errorMsg: "Network Error!"}), '*');
										}
									});
								}
							},
							error : function(resp) 
							{
								editor.contentWindow.postMessage(JSON.stringify({action: 'recentDocsList',
									list: [], errorMsg: "Network Error!"}), '*');
							}
						});
					});

					
				}
				else if (drawMsg.event == 'template')
				{
					editor.contentWindow.postMessage(JSON.stringify({action: 'spinner',
						show: true, messageKey: 'inserting'}), '*');
					
					if (drawMsg.docUrl)
					{
						checkName(drawMsg.name, function(name)
						{
							diagramName = name;
							
							AP.require('request', function(request) {
								
								var loadTemplate = function(version)
								{
									request({
										url: drawMsg.docUrl + (version != null? "?version=" + version : ""),
										success: function(xml) 
										{
											editor.contentWindow.postMessage(JSON.stringify({action: 'load',
												autosave: 1, xml: xml, title: diagramName}), '*');
											editor.contentWindow.postMessage(JSON.stringify({action: 'spinner',
												show: false}), '*');
										},
										error : function(resp) 
										{
											editor.contentWindow.postMessage(JSON.stringify({action: 'spinner',
												show: false}), '*');
											editor.contentWindow.postMessage(JSON.stringify({action: 'dialog',
												titleKey: 'error', message: "Diagram cannot be loaded", messageKey: null,
												buttonKey: 'ok'}), '*');
										}
									});
								}
								
								request({
									url: '/rest/api/content/' + drawMsg.info.id,
									success: function(resp) 
									{
										resp = JSON.parse(resp);
										
										try
										{
											loadTemplate(resp.version.number);
										}
										catch(e)
										{
											loadTemplate();
										}
									},
									error : function(resp) 
									{
										loadTemplate();
									}
								});
							});
						},
						function(name, err, errKey)
						{
							editor.contentWindow.postMessage(JSON.stringify({action: 'spinner',
								show: false}), '*');
							editor.contentWindow.postMessage(JSON.stringify({action: 'dialog',
								titleKey: 'error', message: err, messageKey: errKey,
								buttonKey: 'ok'}), '*');
						});
					}
					else
					{
						checkName(drawMsg.name, function(name)
						{
							editor.contentWindow.postMessage(JSON.stringify({action: 'spinner',
								show: false}), '*');
							diagramName = name;
	
							if (AC.draftEnabled)
							{
								draftName = '~drawio~' + user + '~' + diagramName + AC.draftExtension;
								editor.contentWindow.postMessage(JSON.stringify({action: 'spinner',
									show: true, messageKey: 'inserting'}), '*');
								
								saveDraft(drawMsg.xml, function()
								{
									editor.contentWindow.postMessage(JSON.stringify({action: 'spinner', show: false}), '*');
									editor.contentWindow.postMessage(JSON.stringify({action: 'load',
										autosave: 1, xml: drawMsg.xml, title: diagramName}), '*');
								},
								function()
								{
									editor.parentNode.removeChild(editor);
									var message = messages.error('Draft Write Error', 'Draft could not be created');
				    		
				    				messages.onClose(message, function()
				    				{
				    					confluence.closeMacroEditor();
				    				});
								});
							}
							else
							{
								editor.contentWindow.postMessage(JSON.stringify({action: 'load',
									autosave: 1, xml: drawMsg.xml, title: diagramName}), '*');
							}
						},
						function(name, err, errKey)
						{
							editor.contentWindow.postMessage(JSON.stringify({action: 'spinner',
								show: false}), '*');
							editor.contentWindow.postMessage(JSON.stringify({action: 'dialog',
								titleKey: 'error', message: err, messageKey: errKey,
								buttonKey: 'ok'}), '*');
						});
					}
				}
				else if (drawMsg.event == 'autosave')
				{
					// Saves all changes to draft attachment
					currentXml = drawMsg.xml;
					
					if (autosaveThread == null && AC.draftEnabled)
					{
						//console.trace('DRAFT: Starting timer');
						
						autosaveThread = window.setTimeout(function()
						{
							//console.log('DRAFT: Saving', currentXml);
							
							autosaveThread = null
							saveDraft(currentXml);
							autosaveCounter++;
						}, (autosaveCounter == 0) ? 0 : AC.autosaveTimeout);
					}
				}
				else if (drawMsg.event == 'exit') 
				{
					removeDraft(function()
					{
						confluence.closeMacroEditor();
					});
				}
				else if (drawMsg.event == 'save')
				{
					diagramXml = drawMsg.xml;
					
					if (diagramName == null)
					{
						promptName('');
					}
					else
					{
						editor.contentWindow.postMessage(JSON.stringify({action: 'export',
							format: 'png', spinKey: 'saving', message: drawMsg}), '*');
					}
				}
				else if (drawMsg.event == 'prompt')
				{
					editor.contentWindow.postMessage(JSON.stringify({action: 'spinner',
						show: true, messageKey: 'inserting'}), '*');

					checkName(drawMsg.value, function(name)
					{
						editor.contentWindow.postMessage(JSON.stringify({action: 'spinner',
							show: false}), '*');
						diagramName = name;
						editor.contentWindow.postMessage(JSON.stringify({action: 'export',
							format: 'png', spinKey: 'saving'}), '*');
					},
					function(name, err, errKey)
					{
						editor.contentWindow.postMessage(JSON.stringify({action: 'spinner',
							show: false}), '*');
						promptName(name, err, errKey);
					});
				}
				else if (drawMsg.event == 'export')
				{
					// Proceeds from sending the export message by saving the exported files
					var imageData = drawMsg.data.substring(drawMsg.data.indexOf(',') + 1);
					var diaWidth = drawMsg.bounds.width / drawMsg.scale;
					var diaHeight = drawMsg.bounds.height / drawMsg.scale;
					
					function showError(key, message)
					{
						var msg = {action: 'dialog', titleKey: 'error', modified: true, buttonKey: 'close'};
						
						if (message != null)
						{
							msg.message = message;
						}
						else
						{
							msg.messageKey = key || 'errorSavingFile';
						}
						
						editor.contentWindow.postMessage(JSON.stringify({action: 'spinner', show: false}), '*');
						editor.contentWindow.postMessage(JSON.stringify(msg), '*');
					};
					
					function saveError(err) 
					{
						var key = null;
						var message = null;
						
						if (err.status == 409) 
						{
							diagramName = null;
							key = 'fileExists';
						}
						else if (err.status == 401)
						{
							// Session expired
							message = 'Looks like your session expired. Log in again to keep working. ' +
								'<a href="' + baseUrl + '/pages/dashboard.action" target="_blank">Login</a>';
						}
						
						showError(key, message);
					};
					
					function successXml(responseText) 
					{
						var resp = null;
						var revision = '1';

						try
						{
							resp = JSON.parse(responseText);
						}
						catch (e)
						{
							// Ignores and use default value for revision
						}

						// LATER: Get revision from metadata of attachment and check
						// what condition makes the response not contain an URL
						//TODO Is prev comment still needed with REST API?
						if (resp != null && resp.results != null && resp.results[0])
						{
							revision = resp.results[0].version.number;
						}
						else
						{
							// Logs special case where save response has no URL
							try
							{
								var img = new Image();
								var message = 'Invalid Confluence Cloud response';
						    		img.src = '/images/2x2.png?msg=' + encodeURIComponent(message) +
					    				((responseText != null) ? '&resp=' + encodeURIComponent(responseText) : '&resp=[null]');
						    			'&url=' + encodeURIComponent(window.location.href) +
						    			'&v=' + encodeURIComponent(EditorUi.VERSION);
							}
							catch (err)
							{
								// do nothing
							}
						}

						function successPng(pngResponseText) 
						{
							try
							{
								confluence.saveMacro(
								{
									diagramName: diagramName,
									revision: revision,
									pageId: newPage ? null : pageId,
									baseUrl: baseUrl,
									width: diaWidth,
									height: diaHeight,
									tbstyle: (drawMsg.macroData != null) ? drawMsg.macroData.tbstyle : '',
									links: (drawMsg.macroData != null) ? drawMsg.macroData.links : '',
									lbox: (drawMsg.macroData != null && drawMsg.macroData.lbox != null) ? drawMsg.macroData.lbox : '1',
									zoom: (drawMsg.macroData != null && drawMsg.macroData.zoom != null) ? drawMsg.macroData.zoom : '1'
								});
								
								if (AC.autoExit || drawMsg.message == null || drawMsg.message.message == null || drawMsg.message.message.exit)
								{
									removeDraft(function()
									{
										confluence.closeMacroEditor();
									});
								}
								else
								{
									editor.contentWindow.postMessage(JSON.stringify({action: 'spinner', show: false}), '*');
									editor.contentWindow.postMessage(JSON.stringify({action: 'status', message: '', modified: false}), '*');
								}
							}
							catch (e)
							{
								editor.contentWindow.postMessage(JSON.stringify({action: 'spinner', show: false}), '*');
								editor.contentWindow.postMessage(JSON.stringify({action: 'dialog',
									titleKey: 'errorSavingFile', message: e.message, buttonKey: 'ok'}), '*');
							}
						};

						if (diagramName != null) 
						{
							AC.saveDiagram(pageId, diagramName + '.png', AC.b64toBlob(imageData, 'image/png'),
								successPng, saveError, false, 'image/png');
						}
					};

					if (diagramName != null) 
					{
						editor.contentWindow.postMessage(JSON.stringify({action: 'spinner',
							show: true, messageKey: 'saving'}), '*');
						
						AC.saveDiagram(pageId, diagramName, diagramXml,
							successXml, saveError, false, 'text/plain');
					}
				}
			}
		};

		window.addEventListener('message', messageListener);
	});
};

AC.loadDiagram = function (pageId, diagramName, revision, success, error, owningPageId, tryRev1) {
	// TODO: Get binary
	
	AP.require('request', function(request) {
		request({
			//TODO find out the ID of the page that actually holds the attachments because historical revisions do not have attachments
			url: '/download/attachments/' + pageId + '/' + encodeURIComponent(diagramName) +
				((revision != null) ? '?version=' + revision : ''),
			success: success,
			error : function(resp) 
			{
				//When a page is copied, attachments are reset to version 1 while the revision parameter remains the same
				if (tryRev1 && revision > 1 && resp.status == 404)
				{
					request({
						url: '/download/attachments/' + pageId + '/' + encodeURIComponent(diagramName),
						success: success,
						error : function(resp) { //If revesion 1 failed, then try the owningPageId
							if (owningPageId && resp.status == 404)
							{
								request({
									url: '/download/attachments/' + owningPageId + '/' + encodeURIComponent(diagramName)
										+'?version=' + revision, //this version should exists in the original owning page
									success: success,
									error : error
								});
							}
						}
					});
				}
				else if (owningPageId && resp.status == 404) //We are at revesion 1, so try the owningPageId directly
				{
					request({
						url: '/download/attachments/' + owningPageId + '/' + encodeURIComponent(diagramName),
						success: success,
						error : error
					});
				}
				else
				{
					error(resp);
				}
			}
		});
	});
};

//TODO We can upload both the diagram and its png in one call if needed?
AC.saveDiagram = function(pageId, diagramName, xml, success, error, newSave, mime, comment, sendNotif) 
{
	loadSucess = function(resp) 
	{
		error({status: 409, message: 'File already exists'});
	};
	
	loadError = function(resp)
	{
		if (resp.status == 404) // file under given name does not exist means we can proceed with saving 
		{
			doSave();
		}
		else 
		{
			error({status: resp.status, message : resp.statusText });
		}
	};
	
	var sessionCheck = function(responseText)
	{
		if (responseText != null)
		{
			var obj = JSON.parse(responseText);
			
			if (obj != null && obj.code == -32600) //TODO is the codes the same with new REST APIs 
			{
				error({status: 401});
				
				return;
			}
		}
		
		success(responseText);
	}
	
	doSave = function() 
	{
		AP.require(['request'], function(request) 
		{
			 var blob = (xml instanceof Blob)? xml : new Blob([xml], {type: mime});
			 var attFile = new File([blob], diagramName);
			 var reqData = {file: attFile, minorEdit: sendNotif? false : true};
			 
			 if (comment != null)
			 {
				 reqData.comment = comment;
			 }
			 
			 request({
				type: 'PUT',
				data: reqData,
				url:  "/rest/api/content/"+ pageId +"/child/attachment",
				contentType: "multipart/form-data",
				success: sessionCheck,
				error: error
			 });
		});
	};
	
	if(newSave && mime == 'text/plain') 
	{
		this.loadDiagram(pageId, diagramName, 0, loadSucess, loadError);
	}
	else 
	{
		doSave();
	}
};

AC.removeAttachment = function(pageId, filename, fn, err)
{
	if (pageId != null && filename != null)
	{
		AP.require('request', function(request) {
			request({
				type: 'POST',
				data: JSON.stringify([pageId, filename]),
				url: '/rpc/json-rpc/confluenceservice-v2/removeAttachment',
				contentType: 'application/json;charset=UTF-8',
				success: function()
				{
					if (fn != null)
					{
						fn();
					}
				},
				error: function()
				{
					if (err != null)
					{
						err();
					}
					
					if (fn != null)
					{
						fn();
					}
				}
			});
		});
	}
	else
	{
		 fn();
	}
};

AC.getMacroData = function(fn) {
	AP.require('confluence', function(confluence) {
		confluence.getMacroData(fn);
	});
}

//From mxUtils
AC.htmlEntities = function(s, newline)
{
	s = String(s || '');
	
	s = s.replace(/&/g,'&amp;'); // 38 26
	s = s.replace(/"/g,'&quot;'); // 34 22
	s = s.replace(/\'/g,'&#39;'); // 39 27
	s = s.replace(/</g,'&lt;'); // 60 3C
	s = s.replace(/>/g,'&gt;'); // 62 3E

	if (newline == null || newline)
	{
		s = s.replace(/\n/g, '&#xa;');
	}
	
	return s;
};

AC.fromHtmlEntities = function(s, newline)
{
	s = String(s || '');
	
	s = s.replace(/&amp;/g,'&'); // 38 26
	s = s.replace(/&quot;/g,'"'); // 34 22
	s = s.replace(/&#39;/g,'\\'); // 39 27
	s = s.replace(/&lt;/g,'<'); // 60 3C
	s = s.replace(/&gt;/g,'>'); // 62 3E

	if (newline == null || newline)
	{
		s = s.replace(/&#xa;/g, '\n');
	}
	
	return s;
};

