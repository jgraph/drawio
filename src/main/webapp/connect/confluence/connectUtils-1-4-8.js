// Renamed from ac.js. This is the version used for release 1.4.8-AC onwards

var AC = {};

AC.autosaveTimeout = 10000;
AC.draftExtension = '.tmp';
AC.draftPrefix = '~';
AC.timeout = 25000;

//Allow saving multiple times
AC.autoExit = true;

// Last Checked on 08-AUG-2017: No delete scope needed to delete drafts
// LATER: If delete scope is needed users must upgrade to the latest json
// Disabled. Flag to mute notifications for drafts is needed. 16-AUG-2017
AC.draftEnabled = true; //Enabled with the new save that mute notifications for saving TODO is there notification for deleting a draft?

AC.customContentEditMode = false;

AC.findMacrosRegEx = new RegExp('\\<ac\\:structured\\-macro[^\\>]+?(?=ac\\:name\\=)ac\\:name\\=\\"drawio\\".*?(?=\\<\\/ac\\:structured\\-macro\\>)', 'g');

AC.VERSION = '1.4.8'; //TODO Get the version

AC.logError = function(message, url, linenumber, colno, err, severity)
{
	try
	{
		if (message == AC.lastErrorMessage || (message != null && url != null &&
			((message.indexOf('Script error') != -1) || (message.indexOf('extension') != -1))))
		{
			// TODO log external domain script failure "Script error." is
			// reported when the error occurs in a script that is hosted
			// on a domain other than the domain of the current page
		}
		// DocumentClosedError seems to be an FF bug an can be ignored for now
		else if (message != null && message.indexOf('DocumentClosedError') < 0)
		{
			AC.lastErrorMessage = message;
			severity = ((severity != null) ? severity : (message.indexOf('NetworkError') >= 0 ||
				message.indexOf('SecurityError') >= 0 || message.indexOf('NS_ERROR_FAILURE') >= 0 ||
				message.indexOf('out of memory') >= 0) ? 'CONFIG' : 'SEVERE');
			err = (err != null) ? err : new Error(message);
			
			var img = new Image();
			img.src = 'https://log.draw.io/log?severity=' + severity + '&v=' + encodeURIComponent(AC.VERSION) +
    			'&msg=clientError:' + encodeURIComponent(message) + ':url:' + encodeURIComponent(window.location.href) +
    			':lnum:' + encodeURIComponent(linenumber) + ((colno != null) ? ':colno:' + encodeURIComponent(colno) : '') +
    			((err != null && err.stack != null) ? '&stack=' + encodeURIComponent(err.stack) : '');
		}
	}
	catch (err)
	{
		// do nothing
	}
};

(function() {
	AC.macroParams = ["diagramName", "diagramDisplayName", "revision", "pageId", "contentId", "contentVer", "baseUrl", "width", "height", "tbstyle", "links", "simple", "lbox", "zoom", "hiResPreview", "inComment", "aspect", "custContentId", "pCenter"];
	AC.findMacroParamRegEx = {};
	
	for (var i = 0; i < AC.macroParams.length; i++)
	{
		AC.findMacroParamRegEx[AC.macroParams[i]] = new RegExp('\\<ac\\:parameter\\s+ac\\:name\\=\\"'+ AC.macroParams[i] +'\\"\\s*\\>([^\\<]+)'); 
	}
})();

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

AC.getSpaceKey = function(url)
{
    try{
        var url = url || window.location.href;
        var regex = new RegExp(/\/(spaces|space)\/([^\/]+)/);
        return decodeURIComponent(regex.exec(url)[2]);
    } catch (e){
        return undefined;
    }
};

AC.getMetaTag = function(name) {
	return document.getElementsByTagName('meta')[name].getAttribute('content');
}

AC.getBaseUrl = function()
{
	var baseUrl = AC.getUrlParam('xdm_e', true) + AC.getUrlParam('cp', true);
	//Ensure baseUrl belongs to attlasian (*.jira.com and *.atlassian.net)
	//Since we add cp to xdm_e, we had to ensure that there is a slash after the domain. Since if xdm_e is ok, cp can corrupt is such as cp = '.fakedomain.com' such that baseUrl is atlassian.net.fakedomain.com
	if (/^https:\/\/([^\.])+\.jira\.com\//.test(baseUrl + '/') || /^https:\/\/([^\.])+\.atlassian\.net\//.test(baseUrl + '/')) 
	{
		return baseUrl;
	}
	throw 'Invalid baseUrl!';
};

AC.getSiteUrl = function()
{
	var siteUrl = AC.getUrlParam('xdm_e', true);
	//Ensure siteUrl belongs to attlasian (*.jira.com and *.atlassian.net)
	if (/^https:\/\/([^\.])+\.jira\.com$/.test(siteUrl) || /^https:\/\/([^\.])+\.atlassian\.net$/.test(siteUrl)) 
	{
		return siteUrl;
	}
	throw 'Invalid siteUrl!';
};

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
};

//We need language translation for error messages mainly which are not needed immediately
AC.initI18nAsync = function(lang, callback)
{
	RESOURCE_BASE = '/resources/dia';
	
	//define mxResources such that it is available until code is loaded
	mxResources = {
		get: function(key, params, def)
		{
			return (def || '').replace('{1}', params? (params[0] || '') : ''); //Simple replacement which covers most cases 
		}
	};
	
	var script = document.createElement('script');
	
	script.onload = function()
	{
		mxResources.loadDefaultBundle = false;
		var bundle = mxResources.getDefaultBundle(RESOURCE_BASE, lang) ||
			mxResources.getSpecialBundle(RESOURCE_BASE, lang);
		
		mxUtils.getAll([bundle], function(xhr)
		{
			// Adds bundle text to resources
			mxResources.parse(xhr[0].getText());
			
			if (callback) 
			{
				callback();
			}
		});
	};
	
	script.src = '/js/viewer.min.js';
	document.getElementsByTagName('head')[0].appendChild(script);
};

//AP.flag has a bug and stopped working, we'll use alert until it is fixed
//		https://ecosystem.atlassian.net/browse/ACJS-1052
AC.showNotification = function(notifConfig)
{
	AP.flag.create(notifConfig);
	alert(notifConfig.title + ': ' + notifConfig.body);
};

AC.initAsync = function(baseUrl, contentId, initMacroData, config, lang)
{
	AC.customContentEditMode = contentId != null;
	var contentVer = initMacroData != null? initMacroData.contentVer : null;
	
	var link = document.createElement('a');
	link.href = location.href;
	link.href = link.href; //to have 'host' populated under IE
	var hostUrl = link.protocol + '//' + link.hostname;
	var site = AC.getSiteUrl();
	var user = null;
	
	AP.user.getCurrentUser(function(atlUser) 
	{
		user = atlUser.atlassianAccountId;
	});
		
	if (lang != null)
	{
		var dash = lang.indexOf('_');
		
		if (dash >= 0)
		{
			lang = lang.substring(0, dash);
		}
		
		AC.initI18nAsync(lang);
	}
	
	var ui = 'atlas';
	var plugins = 'ac148';
	
	try
	{
		var configObj = (config != null) ? JSON.parse(config) : null;
		
		if (configObj != null)
		{
			// Adds support for ui theme
			if (configObj.ui != null)
			{
				ui = configObj.ui;
			}
			
			// Redirects plugins to p URL parameter
			if (configObj.plugins != null)
			{
				plugins = plugins + ';' + configObj.plugins;
			}
			
			AC.hiResPreview = configObj.hiResPreview || false;
		}
	}
	catch (e)
	{
		console.log('Configuration error', e);
	}
	
	var editor = document.createElement('iframe');
	editor.setAttribute('width', '100%');
	editor.setAttribute('height', '100%');
	editor.style.width = '100%';
	editor.style.height = '100%';
	editor.setAttribute('id', 'editorFrame');
	editor.setAttribute('frameborder', '0');
	//editor.setAttribute('src', hostUrl + '/?dev=1&' +
	editor.setAttribute('src', hostUrl + '/?' +
			'ui=' + ui + '&p=' + plugins + '&embed=1&modified=unsavedChanges' +
			((AC.autoExit) ? '&noSaveBtn=1' : '&saveAndExit=1') +
			'&keepmodified=1&spin=1&libraries=1&confLib=1&proto=json' +
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
	var draftPage = false;
	var theLocation = null;
	var attachments = null;

	var serverName = AC.getSiteUrl();
	var index1 = serverName.indexOf('//');

	if (index1 > 0)
	{
		var index2 = serverName.indexOf('/', index1 + 2);
		
		if (index2 > index1)
		{
			serverName = serverName.substring(index1 + 2, index2);
		}
		else
		{
			serverName = serverName.substring(index1 + 2);
		}
	}
	
	function startEditor()
	{
		if (initReceived && xmlReceived != null && draftHandled && !waitingForAttachments)
		{
			AC.init(baseUrl, theLocation, pageId, editor, filename, xmlReceived, draftName, draftXml, theMacroData, draftPage);
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
				var fn = attachments[i].title;
				
				if (draftName == null && attachments[i].fileSize > 0 &&
					fn.substring(0, prefix.length) === prefix &&
					fn.substring(fn.length - AC.draftExtension.length) === AC.draftExtension)
				{
					filename = fn.substring(prefix.length, fn.length - AC.draftExtension.length);
					draftName = fn;						
				}
				
				if (fn == draftName)
				{
					//keeping the block of AP.require to minimize the number of changes!
					{
						var acceptResponse = true;
						var timeoutHandler = function()
						{
							acceptResponse = false;
							document.body.style.backgroundSize = 'auto auto';
							document.body.style.backgroundImage = 'url(/images/stop-flat-icon-80.png)';
							editor.contentWindow.postMessage(JSON.stringify({action: 'spinner', show: false}), '*');
	
							AC.showNotification({
								  title: mxResources.get('confTimeout'),
								  body: mxResources.get('confSrvTakeTooLong', [serverName]),
								  type: 'error',
								  close: 'manual'
								});

							//TODO find how to listen to flag close event, currently just close the editor immediately
//							messages.onClose(message, function()
//							{
				    			AP.dialog.close();
//							});
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
					};
					
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
			
			if (msg.event == 'configure')
			{
				// Configure must be sent even if JSON invalid
				var configObj = {compressXml: false};
				
				try
				{
					configObj = JSON.parse(config);

					// Overrides default
					if (configObj != null && configObj.compressXml == null)
					{
						configObj.compressXml = false;
					}
				}
				catch (e)
				{
					// ignore
				}
				
				editor.contentWindow.postMessage(JSON.stringify({action: 'configure',
					config: configObj}), '*');
			}
			else if (msg.event == 'init')
			{
				window.removeEventListener('message', initHandler);
				document.body.style.backgroundImage = 'none';
				initReceived = true;
				startEditor();
			}
		}
	};

	window.addEventListener('message', initHandler);

	AP.getLocation(function(location) 
	{
		theLocation = location;
		
	    var infoReady = function(data, macroData_p)
	    {
	    	if (pageId == null || isNaN(pageId))
    		{
    			document.body.style.backgroundImage = 'url(/images/stop-flat-icon-80.png)';
    			document.body.style.backgroundSize = 'auto auto';
    			
	    		if (data != null && data.target == 'contentcreate') 
	    		{
	    			AC.showNotification({
						  title: mxResources.get('confCannotInsertNew'),
						  body: mxResources.get('confSaveTry'),
						  type: 'error',
						  close: 'manual'
						});
	    		}
	    		else 
	    		{
	    			AC.showNotification({
						  title: mxResources.get('confCannotGetID'),
						  body: mxResources.get('confContactAdmin'),
						  type: 'error',
						  close: 'manual'
						});
	    		}
	    		
	    		//TODO find how to listen to flag close event, currently just close the editor immediately
//    			messages.onClose(message, function()
//    			{
	    			AP.dialog.close();
//    			});
    		}
	    	else
	    	{
	    		// Workaround for blocked referrer policy in iframe
	    		editor.setAttribute('src', editor.getAttribute('src') + '&base=' +
	    			encodeURIComponent(baseUrl + '/pages/viewpage.action?pageId=' + pageId) +
	    			//adding config here to be the last in the url
	    			(config != null? '&configure=1' : ''));
	    		document.body.appendChild(editor);
	    		
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

		    			AC.showNotification({
							  title: mxResources.get('confTimeout'),
							  body: mxResources.get('confSrvTakeTooLong', [serverName]),
							  type: 'error',
							  close: 'manual'
							});
		    		
		    			//TODO find how to listen to flag close event, currently just close the editor immediately
//		    			messages.onClose(message, function()
//		    			{
			    			AP.dialog.close();
//		    			});
		    		};
		    		
		    		var timeoutThread2 = window.setTimeout(timeoutHandler2, AC.timeout);
				
		    		//TODO do a search instead if possible
		    		AC.getPageAttachments(pageId, function(atts) 
    				{
						window.clearTimeout(timeoutThread2);
			    		
			    		if (acceptResponse2)
				    	{
			    			waitingForAttachments = false;
			    			attachments = atts;
			    			loadDraft();
				    	}
    				}, function(res)
					{
			    		window.clearTimeout(timeoutThread2);
			    		
			    		if (acceptResponse2)
				    	{
			    			waitingForAttachments = false;
			    			draftHandled = true;
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

					AC.showNotification({
						  title: mxResources.get('confTimeout'),
						  body: mxResources.get('confSrvTakeTooLong', [serverName]),
						  type: 'error',
						  close: 'manual'
						});
				
					//TODO find how to listen to flag close event, currently just close the editor immediately
//						messages.onClose(message, function()
//						{
		    			AP.dialog.close();
//						});
				};
				
				var timeoutThread = window.setTimeout(timeoutHandler, AC.timeout);
			
				AP.confluence.getMacroData(function (macroData) 
		    	{
		    		window.clearTimeout(timeoutThread);
		    		
		    		if (acceptResponse)
			    	{
			    		var name = null, revision, owningPageId;
	    				
	    				if (AC.customContentEditMode)
    					{
	    					name = macroData_p.diagramName;
	    					revision = macroData_p.revision;
	    					owningPageId = pageId;
	    					
	    					//fill the macro data
	    					theMacroData = macroData_p;
    					}
	    				else if (macroData != null)
    					{
	    					theMacroData = macroData;
	    					name = macroData.diagramName || '';
	    					revision = parseInt(macroData.revision);
	    					owningPageId  = macroData.pageId;
    					}
	    				
	    				if (name != null && name.length > 0)
			    		{
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
				    				
				    				AC.showNotification({
										  title: mxResources.get('readErr'),
										  body: (resp.status == 404) ?
												  mxResources.get('fileNotFound') : mxResources.get('errorLoadingFile'),
										  type: 'error',
										  close: 'manual'
										});
				    		
				    				//TODO find how to listen to flag close event, currently just close the editor immediately
//				    				messages.onClose(message, function()
//				    				{
						    			AP.dialog.close();
//				    				});
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
	    };
		
	    var extEditingError = function()
	    {
	    	AC.showNotification({
				  title: mxResources.get('editingErr'),
				  body: mxResources.get('confExtEditNotPossible'),
				  type: 'error',
				  close: 'manual'
				});
	
			AP.dialog.close({noBack: true});
	    };
	    
		//keeping the block of AP.require to minimize the number of changes!
		{
		    AP.navigator.getLocation(function (data)
		    {
		    	AC.inComment = (data != null && data.context != null && data.context.contentType == 'comment');

	    		if (AC.customContentEditMode) //we can also find the contentId in data.target == 'addonmodule' and data.context.context["content.id"][0]
    			{
	    			//load the custom content to get the page info
	    			AP.request({
                        type: 'GET',
                        url: '/rest/api/content/' + contentId + '/?expand=body.storage,version' + (contentVer != null? ('&version=' + contentVer) : ''),
                        contentType: 'application/json;charset=UTF-8',
                        success: function (resp) 
                        {
                            resp = JSON.parse(resp);
                            
                            var info = JSON.parse(decodeURIComponent(resp.body.storage.value));
                            
                            pageId = info.pageId;
                            info.displayName = resp.title;
                            info.contentVer = resp.version.number;
                            
                            //Out of sync custom content. This happen when a page is moved/copied
                        	if (initMacroData != null && 
                        			((initMacroData.pageId != null && initMacroData.pageId != pageId) 
                					|| (initMacroData.diagramName != null && initMacroData.diagramName != info.diagramName)
                					|| (initMacroData.diagramDisplayName != null && initMacroData.diagramDisplayName != info.displayName)
                					|| (initMacroData.revision != null && initMacroData.revision != info.version)))
                        	{
                            	pageId = initMacroData.pageId; 
                            	
                            	info.createCustomContent = true;
                        	}
                            
                            AC.findMacroInPage(pageId, info.diagramName, info.version, function(macroFound, originalBody, matchingMacros, page)
                    		{
                            	if (macroFound)
                        		{
                            		if (info.createCustomContent)
                        			{
                                     	info.diagramName = initMacroData.diagramName;
                                    	info.displayName = initMacroData.diagramDisplayName;
                                    	info.version = initMacroData.revision || 1; //using version one when null is received which is usually the case 
               
                            			//Create a new custom content and update the macro
                            			var spaceKey = AC.getSpaceKey(page._expandable.space);
            							var pageType = page.type;
        
            							AC.saveCustomContent(spaceKey, pageId, pageType, info.diagramName, info.displayName, info.version,
            									null, null,
            									function(responseText) 
            									{
            										var content = JSON.parse(responseText);
            										
            										contentId = content.id;
            										info.contentVer = content.version? content.version.number : 1;
            										contentVer = info.contentVer;
            										
            										AC.adjustMacroParametersDirect(pageId, 
            												{pageId: pageId, revision: info.version, contentId: content.id, custContentId: content.id, contentVer: contentVer},
            												originalBody, matchingMacros, page, function()
    												{
            											infoReady(null, matchingMacros[0].macroParams);
    												}, extEditingError);
            									}, extEditingError);
                        			}
                            		else
                        			{
                            			infoReady(null, matchingMacros[0].macroParams);
                        			}
                        		}
                            	else //A published page that has a draft content containing the diagram OR the diagram is deleted from the page OR diagram is edited and page is old!
                        		{
                            		var directPageEdit = contentVer != null;
                            		
                            		if (directPageEdit)
                        			{
                            			//We added translation since sometimes resources doesn't load quickly for this error
                            			AC.showNotification({
	        							  title: mxResources.get('confEditedExt', null, 'Diagram/Page edited externally'),
	          							  body: mxResources.get('confEditedExtRefresh', null, 'Diagram/Page is edited externally. Please refresh the page.'),
	          							  type: 'error',
	          							  close: 'manual'
                            			});
                            			AP.dialog.close({noBack: true, noBackOnClose: directPageEdit});                            			
                        			}
                            		else //If this is edit of a custom content, we allow editing since it can be a stranded diagram (only exists as an attachment and custom contents BUT not as a macro)
                        			{
                            			//We added translation since sometimes resources doesn't load quickly for this error
                            			AC.showNotification({
                            				title: mxResources.get('macroNotFound', null, 'Macro Not Found'),
	  	          							body: mxResources.get('confEditDraftDelOrExt', null, 'This diagram is in a draft page, is deleted from the page, or is edited externally. ' + 
	  	          										  'It will be saved as a new attachment version and may not be reflected in the page.'),
	  	          							type: 'warning',
	  	          							close: 'manual'
                            			});
                            			AC.strandedMode = true;
                            			//Add required info that is usually found in the macro
                            			info.contentId = contentId;
                            			info.custContentId = contentId;
                            			info.revision = info.version;
                            			info.diagramDisplayName = info.displayName;
                            			infoReady(null, info);
                        			}
                        		}
                    		}, function() //On error, it means the page is a newly created draft that is not published
                    		{
                    			AC.showNotification({
    							  title: mxResources.get('diagNotFound'),
    							  body: mxResources.get('confDiagNotPublished'),
    							  type: 'error',
    							  close: 'manual',
      							  actions: {
    							    'actionkey': mxResources.get('retBack')
    							  }
    							});
    	    		
				    			AP.dialog.close({noBack: true});
                    		});
                        },
                        error: extEditingError //We can create the custom content and fix this case but it adds more complexity to rare situation (e.g., a page is copied then the source page is deleted) 
                    });
    			}
	    		else if (data != null && data.context != null
			    		&& (data.target == 'contentedit' || data.target == 'contentcreate' || AC.inComment))
	    		{
		    		draftPage = (data.target == 'contentcreate');
		    		pageId = data.context.contentId;
		    		infoReady(data);
		    	}
	    		else
    			{
	    			infoReady();
    			}
		    });
		};
	});
};


AC.getPageAttachments = function(pageId, success, error)
{
	var attachments = [];

	function getAttsChunk(start)
	{
		AP.request({
			url: '/rest/api/content/' + pageId + '/child/attachment?limit=100&start=' + start,
			type: 'GET',
			contentType: 'application/json;charset=UTF-8',
			success: function(resp) 
			{
				resp = JSON.parse(resp);				
				Array.prototype.push.apply(attachments, resp.results);
				
				//Support paging
				if (resp._links && resp._links.next) 
				{
					start += resp.limit; //Sometimes the limit is changed by the server
					getAttsChunk(start);
				}
				else
				{
					success(attachments);
				}
			},
			error : error
		});
	};
	
	getAttsChunk(0);	
};

AC.searchDiagrams = function(searchStr, success, error)
{
	//Note: we manually filter trashed diagrams as we couldn't make cqlcontext={"contentStatuses":["current"]} work
	AP.request({
		url: '/rest/api/content/search?cql=' + encodeURIComponent('type="ac:com.mxgraph.confluence.plugins.diagramly:drawio-diagram" and title ~ "*' + searchStr + '*"') + '&limit=50&expand=body.storage,version',  
		success: function(resp) 
		{
			resp = JSON.parse(resp);
			var retList = [];
			var gliffyList = [];
			var list = resp.results; 
			var customContentMap = {};
			if (list)
			{
				//Add items in the list and convert the list to map so we can search by name efficiently
				for (var i = 0; i < list.length; i++)
				{
					if (list[i].status == 'trashed') continue;
					
					try 
					{
						var attInfo = JSON.parse(decodeURIComponent(list[i]["body"]["storage"]["value"]));
						
						customContentMap[attInfo.pageId + '|' + attInfo.diagramName] = true;
						
						retList.push({
							title: list[i].title,
							url: "/download/attachments/" + attInfo.pageId + "/"
								+ encodeURIComponent(attInfo.diagramName)
								+ '?version=' + attInfo.version,
							info: {
								id: list[i].id,
								contentId: list[i].id,
								custContentId: list[i].id,
								contentVer: list[i].version.number,
								pageId: attInfo.pageId,
								version: attInfo.version,
								name: attInfo.diagramName,
								displayName: list[i].title
							},
							imgUrl: baseUrl + "/download/attachments/" + attInfo.pageId + "/"
								+ encodeURIComponent(attInfo.diagramName)
								+ ".png?api=v2&version=" + attInfo.version
						});
					}
					catch(e)
					{
						//ignore, this should not happen!
						console.log(e);
					}
				}
			}
			
			//This request search for Gliffy files as well as to support old draw.io diagrams that have no associated draw.io custom contents
			AP.request({
				url: '/rest/api/content/search?cql=' + encodeURIComponent('type=attachment and (title ~ "*' + searchStr + '*" or title ~ "*' + searchStr + '*.png")') + '&limit=200&expand=metadata', //limit is 200 to get as much results as possible
				success: function(resp) 
				{
					resp = JSON.parse(resp);
					var list = resp.results; 
					if (list)
					{
						var attMap = {};
						//convert the list to map so we can search by name efficiently
						for (var i = 0; i < list.length; i++)
						{
							if (list[i].status == 'trashed') continue;
							
							//key is pageId + | + att name
							var pageId = list[i]["_links"]["webui"].match(/pages\/(\d+)/);
							
							if (pageId != null)
							{
								var key = pageId[1] + '|' + list[i].title;
								
								//exclude contents already found in the custom contents
								if (!customContentMap[key])
								{
									attMap[key] = {att: list[i], pageId: pageId[1]};
								}
							}
						}

						function getAttObj(att, isImport, noImg)
						{
							var obj = {
								title: att.att.title,
								url: "/download/attachments/" + att.pageId + "/"
									+ encodeURIComponent(att.att.title),
								info: {
									id: att.att.id, 
									pageId: att.pageId,
									name: att.att.title,
									isImport: isImport
								}
							};
							
							if (noImg)
							{
								obj.noImg = true;
							}
							else
							{
								obj.imgUrl = baseUrl + '/download/attachments/' + att.pageId + '/'
											+ encodeURIComponent(att.att.title)
											+ '.png?api=v2';
							}
							
							return obj;
						};
						
						for (var key in attMap) 
						{
							var att = attMap[key];
							var mimeType = att.att.metadata.mediaType;
							
							if (mimeType == 'application/gliffy+json')
							{
								gliffyList.push(getAttObj(att, true));
							}
							else if (mimeType == 'text/plain' && attMap[key+'.png']) //each draw.io attachment should have an associated png preview and mimeType is text/plain
							{
								//We cannot get the latest version info, it can be searched when a diagram is selected
								retList.push(getAttObj(att));
							}
						}
					}

					success(retList, null, {"Gliffy": gliffyList});
				},
				error : error
			});
		},
		error : error
	});
};

AC.getRecentDiagrams = function(success, error)
{
	//I think it is safe now to base the recent documents on draw.io custom contents only since it is in production for long time now
	AP.request({
		url: '/rest/api/content/search?cql=type%3D%22ac%3Acom.mxgraph.confluence.plugins.diagramly%3Adrawio-diagram%22%20and%20lastmodified%20%3E%20startOfDay(%22-7d%22)&limit=50&expand=body.storage,version', // type="ac:com.mxgraph.confluence.plugins.diagramly:drawio-diagram" and lastmodified > startOfDay("-7d") //modified in the last 7 days
		success: function(resp) 
		{
			resp = JSON.parse(resp);
			var retList = [];
			var list = resp.results; 
			if (list)
			{
				//Add items in the list
				for (var i = 0; i < list.length; i++)
				{
					try 
					{
						var attInfo = JSON.parse(decodeURIComponent(list[i]["body"]["storage"]["value"]));
						
						retList.push({
							title: list[i].title,
							url: "/download/attachments/" + attInfo.pageId + "/"
								+ encodeURIComponent(attInfo.diagramName)
								+ '?version=' + attInfo.version,
							info: {
								id: list[i].id,
								contentId: list[i].id,
								custContentId: list[i].id,
								contentVer: list[i].version.number,
								pageId: attInfo.pageId,
								version: attInfo.version,
								name: attInfo.diagramName,
								displayName: list[i].title
							},
							imgUrl: baseUrl + "/download/attachments/" + attInfo.pageId + "/"
								+ encodeURIComponent(attInfo.diagramName)
								+ ".png?api=v2&version=" + attInfo.version
						});
					}
					catch(e)
					{
						//ignore, this should not happen!
						console.log(e);
					}
				}
			}
			
			success(retList);
		},
		error : error
	});
};

AC.getPageDrawioDiagrams = function(pageId, success, error)
{
	AP.request({
        type: 'GET',
        url: '/rest/api/content/' + pageId + '/child/ac:com.mxgraph.confluence.plugins.diagramly:drawio-diagram?limit=100&expand=body.storage,version',
        contentType: 'application/json;charset=UTF-8',
        success: function (resp) 
        {
        	resp = JSON.parse(resp);
			var retList = [];
			var list = resp.results; 
			
			if (list)
			{
				//Add items in the list
				for (var i = 0; i < list.length; i++)
				{
					try 
					{
						var attInfo = JSON.parse(decodeURIComponent(list[i]["body"]["storage"]["value"]));
						var diagramName = list[i].title.replace('.drawio', '');
						
						retList.push({
							title: diagramName,
							url: "/download/attachments/" + attInfo.pageId + "/"
								+ encodeURIComponent(attInfo.diagramName)
								+ '?version=' + attInfo.version,
							info: {
								id: list[i].id,
								contentId: list[i].id,
								custContentId: list[i].id,
								contentVer: list[i].version.number,
								pageId: attInfo.pageId,
								version: attInfo.version,
								name: attInfo.diagramName,
								displayName: diagramName
							},
							imgUrl: baseUrl + "/download/attachments/" + attInfo.pageId + "/"
								+ encodeURIComponent(attInfo.diagramName)
								+ ".png?api=v2&version=" + attInfo.version
						});
					}
					catch(e)
					{
						//ignore, this should not happen!
						console.log(e);
					}
				}
			}
			
			success(retList);
        },
        error: error
	});
};

AC.getCustomTemplates = function(success, error)
{
	var customCats = {};
	var customCatsCount = 0;
	var customCatsDone = 0;
	
	function checkDone()
	{
		customCatsDone++;
		
		if (customCatsCount == customCatsDone)
		{
			success(customCats, customCatsDone);
		}
	}
	
	AP.request({
        type: 'GET',
        url: '/rest/api/content/search?cql=type%3Dpage%20and%20space%3DDRAWIOCONFIG%20and%20title%3DTemplates', //type=page and space=DRAWIOCONFIG and title=Templates.
        contentType: 'application/json;charset=UTF-8',
        success: function (resp) 
        {
            resp = JSON.parse(resp);
            
            if (resp.size == 1)
           	{
            	var tempPageId = resp.results[0].id;
            	//load the configuration file
        		AP.request({
                    type: 'GET',
        			url: '/rest/api/content/search?limit=50&cql=type%3Dpage%20and%20space%3DDRAWIOCONFIG%20and%20ancestor%3D' + tempPageId, //type=page and space=DRAWIOCONFIG and ancestor={tempPageId}. Limit 50 which is most probably more than enough
                    contentType: 'application/json;charset=UTF-8',
                    success: function (resp) 
                    {
                    	resp = JSON.parse(resp);
                    	
                    	if (resp.size > 0)
                       	{
                    		for (var i = 0; i < resp.results.length; i++)
                    		{
                    			var cat = resp.results[i];
                    			customCats[cat.title] = [];
                    			customCatsCount++;
                    			
                    			(function(cat2){
                    				AC.getPageDrawioDiagrams(cat2.id, function(catList)
                        			{
                        				customCats[cat2.title] = catList;
                        				checkDone();
                        			}, checkDone); //On error, just ignore this page
                    			})(cat);
                    		}
                       	}
                    	else 
                       	{
                        	success({}, 0);
                       	}
        			},
        			error: error
        		});
           	}
            else 
           	{
            	success({}, 0);
           	}
		},
		error: error
	});	
};

AC.init = function(baseUrl, location, pageId, editor, diagramName, initialXml, draftName, draftXml, macroData, draftPage)
{
	// Hides the logo
	document.body.style.backgroundImage = 'none';
	var user = null;
	
	AP.user.getCurrentUser(function(atlUser) 
	{
		user = atlUser.atlassianAccountId;
	});
	
	var draftExists = false;

	var diagramDisplayName = diagramName, contentId = null, contentVer = null, lastMacroVer = null, revision = null;

	if (macroData != null)
	{
		diagramDisplayName = macroData.diagramDisplayName || diagramName;
		contentId = macroData.contentId || macroData.custContentId;
		contentVer = macroData.contentVer;
		lastMacroVer = macroData.revision;
		AC.aspect = macroData.aspect;
		AC.hiResPreview = macroData.hiResPreview != null? macroData.hiResPreview == '1' : AC.hiResPreview;
	}
		
	//keeping the block of AP.require to minimize the number of changes!
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
					var obj = null;
					
					try
					{
						obj = JSON.parse(res);
					}
					catch (e)
					{
						// ignore
					}
					
					if (obj != null && obj.error != null)
					{
						if (err != null)
						{
							err(obj);
						}
					}
				}, false, 'application/vnd.jgraph.mxfile', mxResources.get('createdByDraw'), false, draftPage);
	   	};
	   	
		function showTemplateDialog()
		{
			if (AC.draftEnabled)
			{
				editor.contentWindow.postMessage(JSON.stringify({action: 'template', callback: true, enableRecent: true, enableSearch: true, enableCustomTemp: true}), '*');
			}
			else
			{
				editor.contentWindow.postMessage(JSON.stringify({action: 'template', enableRecent: true, enableSearch: true, enableCustomTemp: true}), '*');
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
				err(name, mxResources.get('filenameShort'));
			}
			else if (/[&\*+=\\;/{}|\":<>\?~]/g.test(name))
			{
				err(name, mxResources.get('invalidChars') + ' \\ / | : { } < > & + ? = ; * " ~');
			}
			else
			{
				name = name.trim();
	    		//TODO do a search instead if possible
	    		AC.getPageAttachments(pageId, function(attachments) 
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
						var an = attachments[i].title.toLowerCase();

						if (an == lc || an == lc + '.png' || (AC.draftEnabled &&
							(an == dn || draftPattern.test(an))))
						{
							fileExists = true;
						}
					}
					
					if (fileExists)
					{
						err(name, mxResources.get('alreadyExst', [name]));
					}
					else
					{
						fn(name);
					}

				}, function(res)
				{
					// TODO: What error message to return here?
					err(name, res);
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
				autosave: 1, xml: initialXml, title: diagramDisplayName,
				macroData: macroData}), '*');
		}

		if (draftXml != null)
		{
			// Keeps ignore option even for existing files
			editor.contentWindow.postMessage(JSON.stringify({action: 'draft', xml: draftXml,
				name: diagramDisplayName, discardKey: 'discardChanges', ignore: true}), '*');
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
						
						AC.showNotification({
							  title: mxResources.get('draftReadErr'),
							  body: drawMsg.error,
							  type: 'error',
							  close: 'manual'
							});
	    		
						//TODO find how to listen to flag close event, currently just close the editor immediately
//		    				messages.onClose(message, function()
//		    				{
				    			AP.dialog.close();
//		    				});
					}
					else if (drawMsg.result == 'edit')
					{
						// Use draft
						//console.trace('DRAFT: Using', draftName);

						editor.contentWindow.postMessage(JSON.stringify({action: 'load',
							autosave: 1, xml: drawMsg.message.xml, title: diagramDisplayName}), '*');
						editor.contentWindow.postMessage(JSON.stringify({action: 'status',
							messageKey: 'unsavedChanges', modified: true}), '*');
						draftExists = true;
					}
					else
					{
						if (drawMsg.result == 'discard')
						{
							//console.trace('DRAFT: Discarding', draftName);
							
							AC.removeAttachment(pageId, draftName);
						}
						
						if (initialXml == '' || drawMsg.result == 'ignore')
						{
							if (initialXml != '')
							{
								editor.contentWindow.postMessage(JSON.stringify({action: 'load',
									autosave: 1, xml: initialXml, title: diagramDisplayName,
									macroData: macroData}), '*');
							}
							else
							{
								diagramName = null;
								showTemplateDialog();
							}
						}
					}	
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
							diagramDisplayName = name;
							
							//keeping the block of AP.require to minimize the number of changes!
							{
								var loadTemplate = function(version)
								{
									AP.request({
										url: drawMsg.docUrl + (version != null? "?version=" + version : ""),
										success: function(xml) 
										{
											editor.contentWindow.postMessage(JSON.stringify({action: 'load',
												autosave: 1, xml: xml, title: diagramDisplayName}), '*');
											editor.contentWindow.postMessage(JSON.stringify({action: 'spinner',
												show: false}), '*');
										},
										error : function(resp) 
										{
											editor.contentWindow.postMessage(JSON.stringify({action: 'spinner',
												show: false}), '*');
											editor.contentWindow.postMessage(JSON.stringify({action: 'dialog',
												titleKey: 'error', message: mxResources.get('diagCantLoad'), messageKey: null,
												buttonKey: 'ok'}), '*');
										}
									});
								}
								
								AP.request({
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
							};
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
							diagramDisplayName = name;
	
							if (AC.draftEnabled)
							{
								draftName = '~drawio~' + user + '~' + diagramName + AC.draftExtension;
								editor.contentWindow.postMessage(JSON.stringify({action: 'spinner',
									show: true, messageKey: 'inserting'}), '*');
								
								saveDraft(drawMsg.xml, function()
								{
									editor.contentWindow.postMessage(JSON.stringify({action: 'spinner', show: false}), '*');
									editor.contentWindow.postMessage(JSON.stringify({action: 'load',
										autosave: 1, xml: drawMsg.xml, title: diagramDisplayName}), '*');
								},
								function()
								{
									editor.parentNode.removeChild(editor);
									
									AC.showNotification({
										  title: mxResources.get('draftWriteErr'),
										  body: mxResources.get('draftCantCreate'),
										  type: 'error',
										  close: 'manual'
										});
				    		
									//TODO find how to listen to flag close event, currently just close the editor immediately
//				    				messages.onClose(message, function()
//				    				{
						    			AP.dialog.close();
//				    				});
								});
							}
							else
							{
								editor.contentWindow.postMessage(JSON.stringify({action: 'load',
									autosave: 1, xml: drawMsg.xml, title: diagramDisplayName}), '*');
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
			    		//revision is non-null if the diagram is saved
		    			AP.dialog.close(revision? {newRev: revision, newContentVer: contentVer, newContentId: contentId, newAspect: AC.aspect} : null);
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
						var aspectObj = AC.getAspectObj();
						
						//Copy & Paste causes multiple diagrams in a page to have the same attachment name. Rename doesn't help as it only changes the display name (not the attachment name)
						//So, prompt the use for a new attachment name
						AP.request({
							url: '/rest/api/content/' + pageId + '/?expand=body.storage,version&status=draft', //always request draft content which will match published content if no draft is found
					        contentType: 'application/json;charset=UTF-8',
					        success: function (resp) 
					        {
					        	var page = JSON.parse(resp);
					    		
								//find all macros and check if diagram name (attachment) is used more than once
					    		var foundMacros = page.body.storage.value.match(AC.findMacrosRegEx);
					    		matchingCount = 0;
					    		
					    		for (var i = 0; foundMacros != null && i < foundMacros.length; i++)
								{
					    			var macroDiagName = foundMacros[i].match(AC.findMacroParamRegEx["diagramName"]);
					    			
					    			if (macroDiagName != null && macroDiagName[1] == diagramName)
									{
					    				matchingCount++;
									}
								}
								
					    		if (matchingCount > 1)
					    		{
					    			promptName(diagramName, mxResources.get('confDuplName'));
				    			}
					    		else
				    			{
									editor.contentWindow.postMessage(JSON.stringify({action: 'export',
										format: 'png', spinKey: 'saving', scale: AC.hiResPreview? 2 : 1, 
										pageId: aspectObj.pageId, layerIds: aspectObj.layerIds, message: drawMsg}), '*');

				    			}
							},
							error : function(resp) 
							{
								//We can safely ignore errors to avoid complicating loading diagram process
								editor.contentWindow.postMessage(JSON.stringify({action: 'export',
									format: 'png', spinKey: 'saving', scale: AC.hiResPreview? 2 : 1, 
									pageId: aspectPageId, layerIds: aspectLayerIds, message: drawMsg}), '*');
							}
						});
					}
				}
				else if (drawMsg.event == 'prompt')
				{
					editor.contentWindow.postMessage(JSON.stringify({action: 'spinner',
						show: true, messageKey: 'inserting'}), '*');

					checkName(drawMsg.value, function(name)
					{
						var aspectObj = AC.getAspectObj();
						
						editor.contentWindow.postMessage(JSON.stringify({action: 'spinner',
							show: false}), '*');
						diagramName = name;
						diagramDisplayName = name;
						contentId = null;
						contentVer = null;
						editor.contentWindow.postMessage(JSON.stringify({action: 'export',
							format: 'png', spinKey: 'saving', scale: AC.hiResPreview? 2 : 1,
							pageId: aspectObj.pageId, layerIds: aspectObj.layerIds}), '*');
					},
					function(name, err, errKey)
					{
						editor.contentWindow.postMessage(JSON.stringify({action: 'spinner',
							show: false}), '*');
						promptName(name, err, errKey);
					});
				}
				else if (drawMsg.event == 'rename')
				{
					//If diagram name is not set yet, use the new name for both file and diagram
					//TODO should we disable renaming if diagramName is null?
					if (diagramName == null) 
					{
						editor.contentWindow.postMessage(JSON.stringify({action: 'spinner',
							show: true}), '*');

						checkName(drawMsg.name, function(name)
						{
							editor.contentWindow.postMessage(JSON.stringify({action: 'spinner',
								show: false}), '*');
							diagramName = name;
							diagramDisplayName = name;
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
						diagramDisplayName = drawMsg.name;
					}
					
					editor.contentWindow.postMessage(JSON.stringify({action: 'status',
						messageKey: 'unsavedChanges', modified: true}), '*');
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
							message = mxResources.get('confSessionExpired') +
								' <a href="' + baseUrl + '/pages/dashboard.action" target="_blank">' + mxResources.get('login') + '</a>';
						}
						
						showError(key, message);
					};
					
					function successXml(responseText) 
					{
						var resp = null;
						revision = '1';
						
						//TODO Why this code (Is it expected to have incorrect responseText?)
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
							var attObj = resp.results[0];
							revision = attObj.version.number;
							//Save/update the custom content
							var spaceKey = AC.getSpaceKey(attObj._expandable.space);
							var pageType = attObj.container.type;

							AC.saveCustomContent(spaceKey, pageId, pageType, diagramName, diagramDisplayName, revision, 
									contentId, contentVer,
									function(responseText) 
									{
										var content = JSON.parse(responseText);
										
										contentId = content.id;
										contentVer = content.version? content.version.number : 1;
										
										AC.saveDiagram(pageId, diagramName + '.png', AC.b64toBlob(imageData, 'image/png'),
												successPng, saveError, false, 'image/png', mxResources.get('drawPrev'), false, draftPage);
									}, saveError, drawMsg.comments);
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
						    			'&url=' + encodeURIComponent(window.location.href);
							}
							catch (err)
							{
								// do nothing
							}
							
							//TODO Save png here in case responseText is incorrect (But why it can be incorrect?)
							AC.saveDiagram(pageId, diagramName + '.png', AC.b64toBlob(imageData, 'image/png'),
									successPng, saveError, false, 'image/png', mxResources.get('drawPrev'), false, draftPage);
						}

						function successPng(pngResponseText) 
						{
							try
							{
								// IMPORTANT: New macro parameters must be added to AC.macroParams to for adjustMacroParametersDirect to parse existing parameters correctly.
								var newMacroData = {
									diagramName: diagramName,
									diagramDisplayName: diagramDisplayName,
									revision: revision,
									pageId: newPage ? null : pageId,
									custContentId: contentId,
									contentVer: contentVer,
									baseUrl: baseUrl,
									width: diaWidth,
									height: diaHeight,
									tbstyle: (drawMsg.macroData != null && drawMsg.macroData.tbstyle) ? drawMsg.macroData.tbstyle : '',
									links: (drawMsg.macroData != null && drawMsg.macroData.links) ? drawMsg.macroData.links : '',
									simple: (drawMsg.macroData != null && drawMsg.macroData.simple != null) ? drawMsg.macroData.simple : '0',
									lbox: (drawMsg.macroData != null && drawMsg.macroData.lbox != null) ? drawMsg.macroData.lbox : '1',
									zoom: (drawMsg.macroData != null && drawMsg.macroData.zoom != null) ? drawMsg.macroData.zoom : '1',
									pCenter: (drawMsg.macroData != null && drawMsg.macroData.pCenter != null) ? drawMsg.macroData.pCenter : '0',
									aspect:	AC.aspect,
									inComment: AC.inComment? '1' : '0'
								};

								//Set the hiResPreview only if the user set it in the UI which overrides the global settings
								if (drawMsg.macroData != null && drawMsg.macroData.hiResPreview != null)
								{
									newMacroData.hiResPreview = drawMsg.macroData.hiResPreview;									
								}
									
								var finalizeSaving = function()
								{
									if (AC.autoExit || drawMsg.message == null || drawMsg.message.message == null || drawMsg.message.message.exit)
									{
										var savingCallback = function()
										{
											removeDraft(function()
											{
								    			AP.dialog.close({newRev: revision, newContentVer: contentVer, newContentId: contentId, newAspect: AC.aspect});
											});
										};
										
										//Save indexing text
										//Exit is done when the response is received!
										//This is needed for advanced search by draw.io diagrams type
										AC.remoteInvoke('getDiagramTextContent', null, null, function(textContent)
										{
											AC.saveContentSearchBody(contentId, diagramDisplayName + ' ' + textContent,
													savingCallback, savingCallback);	//ignore error and just exit
										}, savingCallback);
									}
									else
									{
										editor.contentWindow.postMessage(JSON.stringify({action: 'spinner', show: false}), '*');
										editor.contentWindow.postMessage(JSON.stringify({action: 'status', message: '', modified: false}), '*');
									}
								};

								if (AC.customContentEditMode)
								{
									//load the page to edit the macro
									AC.findMacroInPage(pageId, diagramName, lastMacroVer, function(macroFound, originalBody, matchingMacros, page)
									{
										if (macroFound)
										{
											AC.adjustMacroParametersDirect(pageId, newMacroData, originalBody, matchingMacros, page, finalizeSaving, saveError);
											lastMacroVer = revision; //for next save
										}
										else //macro is not found in the page content, so just continue with saving instead of showing an error and losing users modifications
										{
											//Using alert here to pause execution as some execution flows go back and Confluence error messages will be lost
											//In strandedMode, we already warned the user at the beginning
											if (!AC.strandedMode)
											{
												alert(mxResources.get('confDiagEditedExt'));
											}
											
											finalizeSaving();
										}
									}, saveError);
								}
								else
								{
									AP.confluence.saveMacro(newMacroData);
									finalizeSaving();
								}
							}
							catch (e)
							{
								editor.contentWindow.postMessage(JSON.stringify({action: 'spinner', show: false}), '*');
								editor.contentWindow.postMessage(JSON.stringify({action: 'dialog',
									titleKey: 'errorSavingFile', message: e.message, buttonKey: 'ok'}), '*');
							}
						};
					};

					if (diagramName != null) 
					{
						editor.contentWindow.postMessage(JSON.stringify({action: 'spinner',
							show: true, messageKey: 'saving'}), '*');
						
						AC.saveDiagram(pageId, diagramName, diagramXml,
							successXml, saveError, false, 'application/vnd.jgraph.mxfile', mxResources.get('drawDiag'), false, draftPage);
					}
				}
				else if (drawMsg.event == 'remoteInvoke')
				{
					AC.handleRemoteInvoke(drawMsg);
				}
				else if (drawMsg.event == 'remoteInvokeResponse')
				{
					AC.handleRemoteInvokeResponse(drawMsg);
				}
			}
		};

		window.addEventListener('message', messageListener);
		editor.contentWindow.postMessage(JSON.stringify({action: 'remoteInvokeReady'}), '*');
		AC.remoteWin = editor.contentWindow;
	};
};

AC.loadDiagram = function (pageId, diagramName, revision, success, error, owningPageId, tryRev1, dontCheckVer) {
	// TODO: Get binary

	//keeping the block of AP.require to minimize the number of changes!
	{
		//Confirm that the macro is in sync with the diagram
		//Sometimes the diagram is saved but the macro is not updated
		var attInfo = null;
		var pageInfo = null;
		
		function confirmDiagramInSync()
		{
			if (attInfo == null || pageInfo == null) 
				return;
			
			//TODO is this condition enough or we need to check timestamps also?
			if (attInfo.version.number > revision 
					&& (pageInfo.version.message == null || pageInfo.version.message.indexOf("Reverted") < 0)) 
			{
				AC.loadDiagram(pageId, diagramName, attInfo.version.number, success, error, owningPageId, tryRev1, true);
				//Update the macro
				//Custom Content version will be fixed on next save, this will not affect correctness
				if (!AC.customContentEditMode)
				{
					AP.confluence.getMacroData(function (macroData) 
			    	{
						if (macroData != null) 
						{
							AP.confluence.saveMacro(
							{
								diagramName: macroData.diagramName,
								diagramDisplayName: macroData.diagramDisplayName != null ? macroData.diagramDisplayName : macroData.diagramName,
								revision: attInfo.version.number,
								pageId: macroData.pageId,
								custContentId: macroData.contentId || macroData.custContentId,
								contentVer: macroData.contentVer,
								baseUrl: macroData.baseUrl,
								width: macroData.width,
								height: macroData.height,
								tbstyle: macroData.tbstyle,
								links: macroData.links,
								simple: macroData.simple != null ? macroData.simple : '0',
								lbox: macroData.lbox != null ? macroData.lbox : '1',
								zoom: macroData.zoom != null ? macroData.zoom : '1',
								pCenter: (macroData.pCenter != null) ? macroData.pCenter : '0',
								hiResPreview: macroData.hiResPreview,
								inComment: AC.inComment? '1' : '0'
							});
						}
			    	});
				}
			}
		}
		
		//To avoid race we do the version check after loading the diagram in the macro 
		var localSuccess = function()
		{
			success.apply(this, arguments);
			
			//This fix contradict with copy/paste workflow where all diagrams have the same name
			//On copy/paste diagram name must be changed
			/*if (!dontCheckVer && revision != null)
			{
	            AP.request({
	                type: 'GET',
	                url: '/rest/api/content/' + pageId + '?expand=version',
	                contentType: 'application/json;charset=UTF-8',
	                success: function (resp) 
	                {
	                	pageInfo = JSON.parse(resp);
	                    
	                	confirmDiagramInSync();
	                },
	                error: function (resp) 
	                {
	                    //Ignore
	                }
	            });
	
	            AP.request({
	                type: 'GET',
	                url: '/rest/api/content/' + pageId + '/child/attachment?filename=' + 
	                		encodeURIComponent(diagramName) + '&expand=version',
	                contentType: 'application/json;charset=UTF-8',
	                success: function (resp) 
	                {
	                	var tmp = JSON.parse(resp);
	                    
	                	if (tmp.results && tmp.results.length == 1)
	                	{
	                		attInfo = tmp.results[0];
	                	}
	                	
	                	confirmDiagramInSync();
	                },
	                error: function (resp) 
	                {
	                    //Ignore
	                }
	            });
			}*/
		}
		
		AP.request({
			//TODO find out the ID of the page that actually holds the attachments because historical revisions do not have attachments
			url: '/download/attachments/' + pageId + '/' + encodeURIComponent(diagramName) +
				((revision != null) ? '?version=' + revision : ''),
			success: localSuccess,
			error : function(resp) 
			{
				//When a page is copied, attachments are reset to version 1 while the revision parameter remains the same
				if (tryRev1 && revision > 1 && resp.status == 404)
				{
					AP.request({
						url: '/download/attachments/' + pageId + '/' + encodeURIComponent(diagramName),
						success: localSuccess,
						error : function(resp) { //If revesion 1 failed, then try the owningPageId
							if (owningPageId && resp.status == 404)
							{
								AP.request({
									url: '/download/attachments/' + owningPageId + '/' + encodeURIComponent(diagramName)
										+'?version=' + revision, //this version should exists in the original owning page
									success: localSuccess,
									error : function(resp)
									{
										if (/(^\s|\s$)/.test(diagramName))
										{
											AC.loadDiagram(pageId, diagramName.trim(), revision, success, error, owningPageId, tryRev1, dontCheckVer);
										}
										else
										{
											error(resp);
										}
									}
								});
							}
						}
					});
				}
				else if (owningPageId && resp.status == 404) //We are at revesion 1, so try the owningPageId directly
				{
					AP.request({
						url: '/download/attachments/' + owningPageId + '/' + encodeURIComponent(diagramName),
						success: localSuccess,
						error : function(resp)
						{
							if (/(^\s|\s$)/.test(diagramName))
							{
								AC.loadDiagram(pageId, diagramName.trim(), revision, success, error, owningPageId, tryRev1, dontCheckVer);
							}
							else
							{
								error(resp);
							}
						}
					});
				}
				else
				{
					error(resp);
				}
			}
		});
	};
};

AC.findMacroInPage = function(pageId, diagramName, lastMacroVer, success, error, draftPage)
{
	//load the page to edit the macro
	AP.request({
        type: 'GET',
        url: '/rest/api/content/' + pageId + '/?expand=body.storage,version' + (draftPage ? "&status=draft" : ""),
        contentType: 'application/json;charset=UTF-8',
        success: function (resp) 
        {
        	var page = JSON.parse(resp);
    		
    		var originalBody = page.body.storage.value;
    		
    		var foundMacros = originalBody.match(AC.findMacrosRegEx);

    		var macroFound = false;
    		var matchingMacros = [];
    		
    		for (var i = 0; foundMacros != null && i < foundMacros.length; i++)
			{
    			var macroDiagName = foundMacros[i].match(AC.findMacroParamRegEx["diagramName"]);
    			var macroRevision = foundMacros[i].match(AC.findMacroParamRegEx["revision"]);
    			
    			if (macroDiagName != null && macroRevision != null && macroDiagName[1] == diagramName && macroRevision[1] == lastMacroVer)
				{
    				var macroParams = {};
    				
    				for (var j = 0; j < AC.macroParams.length; j++)
					{
    					var param = AC.macroParams[j];
    					var val = foundMacros[i].match(AC.findMacroParamRegEx[param]);
    					
    					if (val != null)
    						macroParams[param] = val[1];
					}
    				
    				matchingMacros.push({macro: foundMacros[i], macroParams: macroParams});
    				macroFound = true;
				}
			}
    		
    		success(macroFound, originalBody, matchingMacros, page);
        },
        error: error
    });
};

//FIXME Confluence adjust macros in draft such that there is no way to adjust the content of drafts currently! So, drafts code is removed
AC.adjustMacroParametersDirect = function(pageId, macroData, originalBody, matchingMacros, page, success, error)
{
	for (var i = 0; i < matchingMacros.length; i++)
	{
		var modMacro = matchingMacros[i].macro;

		for (var param in macroData) 
		{
			var pRegEx = AC.findMacroParamRegEx[param];
			
			//This to avoid errors if a new parameter/key is added to the macro and is not in the macro regexps
			if (pRegEx == null) continue;
			
			var newParamVal = '<ac:parameter ac:name="'+ param +'">' + macroData[param];
			
			//If parameter exists, change it. Otherwise, add it
			if (modMacro.match(pRegEx))
			{
				modMacro = modMacro.replace(pRegEx, newParamVal);
			}
			else
			{
				modMacro += newParamVal + "</ac:parameter>";
			}
		}
		
		originalBody = originalBody.replace(matchingMacros[i].macro, modMacro);
	}
	
	page.body.storage.value = originalBody;
    page.version.number++;

	AP.request({
           type: 'PUT',
           data: JSON.stringify(page),
           url:  "/rest/api/content/" + pageId,
           contentType: "application/json",
           success: success,
           error: error
       });
};

AC.saveCustomContent = function(spaceKey, pageId, pageType, diagramName, diagramDisplayName, revision, contentId, contentVer, success, error, comments)
{
	//Make sure comments are not lost
	if (comments == null)
	{
		AC.getComments(contentId, function(comments)
		{
			AC.saveCustomContent(spaceKey, pageId, pageType, diagramName, diagramDisplayName, revision, contentId, contentVer, success, error, comments);
		}, 
		//On error, whether the custom content is deleted or corrupted. It is better to proceed with saving and losing the comments than losing the diagram
		function()
		{
			AC.saveCustomContent(spaceKey, pageId, pageType, diagramName, diagramDisplayName, revision, contentId, contentVer, success, error, []);
		});
		
		return;
	}
	
	var info = {
	    "pageId": pageId,
	    "diagramName": diagramName,
	    "version": revision,
	    "inComment": AC.inComment,
	    "comments": comments || []
	};
	
    var customObj = {
        "type": "ac:com.mxgraph.confluence.plugins.diagramly:drawio-diagram",
        "space": {
           "key": spaceKey
         },
         "container": {
               "type": pageType,
               "id": pageId
            },
         "title": diagramDisplayName,
         "body": {
           "storage": {
             "value": encodeURIComponent(JSON.stringify(info)),
             "representation": "storage"
           }
         },
         "status": "current"
    };
    
    if (contentId)
    {
        customObj.version = {
            "number": ++contentVer
        };
    }
    
	//keeping the block of AP.require to minimize the number of changes!
    {
       AP.request({
           type: contentId? 'PUT' : 'POST',
           data: JSON.stringify(customObj),
           url:  "/rest/api/content/" + (contentId? contentId : ""),
           contentType: "application/json",
           success: success,
           error: function(resp) {
               //User can delete a custom content externally and we will get error 403 and message will contain the given id
               //Then save a new one
               var err = JSON.parse(resp.responseText);
               
               //Sometimes the macro is not updated such that the version is not correct. The same happens when a page version is restored
               if (err.statusCode == 409 && err.message.indexOf("Current version is:") > 0)
        	   {
            	   //We will use the error message to detect the correct version instead of doing another request. 
            	   //It should be safe as long as error messages are not translated or changed
            	   var curContentVer = err.message.match(/\d+/);
            	   
            	   if (curContentVer != null)
        		   {
            		   AC.saveCustomContent(spaceKey, pageId, pageType, diagramName, diagramDisplayName, revision, contentId, curContentVer[0], success, error, comments);
        		   }
        	   }
               //Sometimes, when a page is copied or site is cloned, custom contents are lost, so create a new one
               //For example, error 400: When a page is moved to another space, an error occur since the original  custom content belong to another space/page
               else if (contentId != null)
               {
                   AC.saveCustomContent(spaceKey, pageId, pageType, diagramName, diagramDisplayName, revision, null, null, success, error, comments);
               }
               else
               {
                   error(resp);
               }
           }
       });
    };
};

AC.saveContentSearchBody = function(contentId, searchBody, success, error)
{
	var doSaveSearchBody = function(version)
	{
		var obj = {
		    "value": searchBody
		};
		
		if (version) 
		{
			obj["version"] = {
				    "number": version + 1,
				    "minorEdit": true
				  };
		}
		else
		{
			obj["key"] = "ac:custom-content:search-body";
		}
		
		AP.request({
			  url: "/rest/api/content/" + contentId + "/property" + (version? "/ac%3Acustom-content%3Asearch-body?expand=version" : ""),
			  type: version? "PUT" : "POST",
			  contentType: "application/json",
			  data: JSON.stringify(obj),
			  success: success,
			  error: error
		});
	};
	
	AP.request({
		  url: "/rest/api/content/" + contentId + "/property/ac%3Acustom-content%3Asearch-body?expand=version",
		  type: "GET",
		  contentType: "application/json",
		  success: function(resp)
		  {
			  resp = JSON.parse(resp);
              
			  doSaveSearchBody(resp.version.number);
		  },
		  error: function(resp)
		  {
			  var err = JSON.parse(resp.responseText);
			  
			  //if not found, create one
			  if (err.statusCode == 404)
			  {
				  doSaveSearchBody();
			  }
			  else
				  error();
		  }
	});
};

//TODO We can upload both the diagram and its png in one call if needed?
AC.saveDiagram = function(pageId, diagramName, xml, success, error, newSave, mime, comment, sendNotif, draftPage) 
{
	loadSucess = function(resp) 
	{
		error({status: 409, message: mxResources.get('fileExists')});
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
		//keeping the block of AP.require to minimize the number of changes!
		{
			 var attFile = (xml instanceof Blob)? xml : new Blob([xml], {type: mime});
			 attFile.name = diagramName;
			 
			 var reqData = {file: attFile, minorEdit: !sendNotif};
			 var draft = draftPage ? "?status=draft" : "";

			 if (comment != null)
			 {
				 reqData.comment = comment;
			 }
			 
			 AP.request({
				type: 'PUT',
				data: reqData,
				url:  "/rest/api/content/"+ pageId +"/child/attachment" + draft,
				contentType: "multipart/form-data",
				success: sessionCheck,
				error: error
			 });
		};
	};
	
	if(newSave && mime == 'application/vnd.jgraph.mxfile')
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
		var errFn = function()
		{
			if (err != null)
			{
				err();
			}
			
			if (fn != null)
			{
				fn();
			}
		};
		
		 //Empty the draft file without deleting it to prevent email notifications 
		 var attFile = new Blob(['']);
		 attFile.name = filename;
		 
		 var reqData = {
			 file: attFile, 
			 minorEdit: true,
			 comment: 'draw.io draft (D)'
		 };
		 
		 AP.request({
				type: 'PUT',
				data: reqData,
				url:  "/rest/api/content/"+ pageId +"/child/attachment",
				contentType: "multipart/form-data",
				success: function () 
	            {
	            	if (fn != null)
					{
						fn();
					}
				},
				error: errFn
		 });
	}
	else
	{
		 fn();
	}
};

AC.getMacroData = function(fn) 
{
	AP.confluence.getMacroData(fn);
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

AC.fromHtmlEntities = function(str)
{
    var doc = new DOMParser().parseFromString(str || '', "text/html");
    return doc.documentElement.textContent;
};

AC.getCustomLibraries = function(callback, error)
{
    var ret = [];

    function getChunk(url)
    {
    	AP.request({
            type: 'GET',
			url: url,
            contentType: 'application/json;charset=UTF-8',
            success: function (resp) 
            {
            	resp = JSON.parse(resp);
            	
               	for (var i = 0; i < resp.results.length; i++)
           		{
               		var obj = resp.results[i];
               		ret.push({
               			id: obj.id, 
               			title: obj.title, 
               			downloadUrl: obj._links? obj._links.download : null
               		});
           		}
               	
               	//Support pageing
				if (resp._links && resp._links.next) 
				{
					getChunk(resp._links.next);
				}
				else
				{
					callback(ret);
				}
			},
			error: error
		});
    };
    
	AP.request({
        type: 'GET',
        url: '/rest/api/content/search?cql=type%3Dpage%20and%20space%3DDRAWIOCONFIG%20and%20title%3DLibraries', //type=page and space=DRAWIOCONFIG and title=Libraries. Search doesn't return 404 if not found
        contentType: 'application/json;charset=UTF-8',
        success: function (resp) 
        {
            resp = JSON.parse(resp);
            
            if (resp.size == 1)
           	{
            	var libsPageId = resp.results[0].id;

            	getChunk('/rest/api/content/' + libsPageId + '/child/attachment?limit=100');
           	}
            else
            {
            	callback(ret);            	
            }
		},
		error: error
	});	
};

AC.getFileContent = function(url, callback, error)
{
	AP.request({
        type: 'GET',
		url: url,
        contentType: 'text/xml;charset=UTF-8',
        success: function (fileContent) 
        {
        	callback(fileContent); 
		},
		error: error
	});
};

AC.getCurrentUser = function(callback, error)
{
	var baseUrl = AC.getBaseUrl();
	
	AP.request({
        type: 'GET',
		url: '/rest/api/user/current',
		contentType: 'application/json;charset=UTF-8',
        success: function (resp) 
        {
        	resp = JSON.parse(resp);
        	
        	callback({
        		id: resp.accountId,
        		username: resp.username,
        		email: resp.email,
        		displayName: resp.displayName,
        		pictureUrl: resp.profilePicture? baseUrl.substr(0, baseUrl.lastIndexOf('/')) + resp.profilePicture.path : null
        	}); 
		},
		error: error
	});
};

AC.getComments = function(contentId, callback, error)
{
	if (contentId)
	{
		AP.request({
			type: 'GET',
			url: '/rest/api/content/' + contentId + '/?expand=body.storage,version,container',
			contentType: 'application/json;charset=UTF-8',
			success: function(resp)
			{
				try 
				{
					resp = JSON.parse(resp);
					var infoObj = JSON.parse(decodeURIComponent(resp.body.storage.value));
					var spaceKey = AC.getSpaceKey(resp._expandable.space);
					var pageId = resp.container.id;
                    var pageType = resp.container.type;
                    var contentVer = resp.version.number;
                    
					callback(infoObj.comments || [], spaceKey, pageId, pageType, contentVer);
				}
				catch(e)
				{
					error(e);
				}
			},
			error: error
		});
	}
	else
	{
		callback([]);
	}
};

//Check if user can edit content (page or another content)
//Confluence doesn't provide an easy way to check for permissions. 
//		E.g., https://draw-test.atlassian.net/wiki/rest/api/content/{contentId}/restriction/byOperation/update/user?accountId={userAccountId}
//		It returns 404 even if the user has permission. It only returns 200 (OK) if the user is explicitly in restrictions list (doesn't check groups also)
AC.userCanEdit = function(contentId, callback, error)
{
	var userFound = false;
	var accountId, groupsCount, parsedGroups = 0;
	
	function checkGroupMembers(resp)
	{
		//If the user belong to multiple groups, callback will be called more than once
		if (userFound) return;
		
		resp = JSON.parse(resp);
		
		var list = resp.results;
		
		for (var i = 0; i < list.length; i++)
		{
			if (list[i].accountId == accountId)
			{
				callback(true);
				userFound = true;
				return;
			}
		}
		
		parsedGroups++;
		
		//All groups parsed
		if (groupsCount == parsedGroups)
		{
			callback(false);
		}
	};
	
	AP.user.getCurrentUser(function(user) {
		accountId = user.atlassianAccountId;
		
		AP.request({
			type: 'GET',
			url: '/rest/api/content/' + contentId + '/restriction/byOperation/update', //This API doesn't work well with paging, BUT 100 as a default limit looks enough
			contentType: 'application/json;charset=UTF-8',
			success: function(resp)
			{
				resp = JSON.parse(resp);
				
				if (resp.restrictions.user.size == 0) //When restrictions are empty, it means all are allowed
				{
					callback(true);
				}
				else
				{
					//Search users
					var list = resp.restrictions.user.results;
					
					for (var i = 0; i < list.length; i++)
					{
						if (list[i].accountId == accountId)
						{
							callback(true);
							userFound = true;
							break;
						}
					}
					
					//Check groups
					if (!userFound)
					{
						if (resp.restrictions.group.size == 0) //The owner must be in the list of editors, so, a group cannot exist without a user in the list
						{
							callback(false); //User cannot edit
						}
						else //For each group check its members!
						{
							var groups = resp.restrictions.group.results;
							groupsCount = groups.length;
							
							for (var i = 0; i < groups.length; i++)
							{
								AP.request({
									type: 'GET',
									url: '/rest/api/group/' + encodeURIComponent(groups[i].name) + '/member',
									contentType: 'application/json;charset=UTF-8',
									success: checkGroupMembers,
									error: error
								});
							}
						}
					}
				}
			},
			error: error
		});		
	});
};

AC.getPageInfo = function(urlOnly, success, error)
{
	AP.getLocation(function(url)
	{
		if (urlOnly) 
		{
			success({url: url});	
		}
		else
		{
			AP.navigator.getLocation(function (location) 
			{
				AP.request({
					type: 'GET',
					url: '/rest/api/content/' + location.context.contentId,
					contentType: 'application/json;charset=UTF-8',
					success: function(resp)
					{
						resp = JSON.parse(resp);
						resp.url = url;
						success(resp);
					},
					error: error
				});
			});
			
		}
	});
};

AC.getContentProperty = function(contentId, propName, success, error)
{
	AP.request({
		type: 'GET',
		url: '/rest/api/content/' + contentId + '/property/' + encodeURIComponent(propName),
		contentType: 'application/json;charset=UTF-8',
		success: success,
		error: error
	});
};

AC.getConfPageEditorVer = function(pageId, callback)
{
	AC.getContentProperty(pageId, 'editor', function(resp)
	{
		resp = JSON.parse(resp);
		callback(resp.value == 'v2'? 2 : 1);
	}, function()
	{
		callback(1);// On error, assume the old editor
	})
};

AC.gotoAnchor = function(anchor)
{
	AC.getPageInfo(false, function(info)
	{
		var url = info.url;
		
		if (url != null)
		{
			//remove any hash
			var hash = url.indexOf('#');
			
			if (hash > -1)
			{
				url = url.substring(0, hash);
			}
			
			AC.getConfPageEditorVer(info.id, function(ver)
			{
				if (ver == 1)
				{
					//When page title has a [ at the beginning, conf adds id- to anchor name
					url = url + '#' + (info.title.indexOf('[') == 0? 'id-' : '') + 
											encodeURI(info.title.replace(/\s/g, '') + '-' + anchor.replace(/\s/g, ''));
				}
				else
				{
					url = url + '#' + encodeURIComponent(anchor.replace(/\s/g, '-'));
				}
				
				top.window.location = url;
			});
			
		}
	}, function()
	{
		//ignore as we cannot get the page info
	});
};

AC.getDiagramRevisions = function(diagramName, pageId, success, error)
{
	AP.request({
		type: 'GET',
		url: '/rest/api/content/' + pageId + '/child/attachment',
		contentType: 'application/json;charset=UTF-8',
		success: function(resp)
		{
			resp = JSON.parse(resp);
			var attObj = null;
			
			for (var i = 0; i < resp.results.length; i++)
			{
				if (resp.results[i].title == diagramName)
				{
					attObj = resp.results[i];
				}
			}

			if (attObj != null)
			{
				AP.request({
					type: 'GET',
					url: '/rest/api/content/' + attObj.id + '/version',
					contentType: 'application/json;charset=UTF-8',
					success: function(resp)
					{
						resp = JSON.parse(resp);
						var revs = [];
						
						for (var i = 0; i < resp.results.length; i++)
						{
							var rev =  resp.results[i];

							revs.unshift({
								modifiedDate: rev.when,
								lastModifyingUserName: rev.by? rev.by.displayName : '', 
								downloadUrl: '/download/attachments/' + pageId + '/' + encodeURIComponent(diagramName) + '?version=' + rev.number,
								obj: rev
							});
						}
						
						success(revs);
					},
					error: error
				});
			}
			else
			{
				error();
			}
		},
		error: error
	});
};

AC.setHiResPreview = function(hiResPreview, success, error)
{
	AC.hiResPreview = hiResPreview;
};

AC.setAspect = function(aspect, success, error)
{
	AC.aspect = aspect;
};

AC.getAspectObj = function()
{
	if (AC.aspect != null)
	{
		var aspectArray = AC.aspect.split(' ');
		
		if (aspectArray.length > 1)
		{
			return {pageId: aspectArray[0], layerIds: aspectArray.slice(1)};
		}
	}
	
	return {};
};

AC.getAttachmentInfo = function(pageId, attName, sucess, error)
{
	AP.request({
        type: 'GET',
        url: '/rest/api/content/' + pageId + '/child/attachment?expand=version&filename=' + 
        		encodeURIComponent(attName),
        contentType: 'application/json;charset=UTF-8',
        success: function (resp) 
        {
        	var tmp = JSON.parse(resp);
            
        	if (tmp.results && tmp.results.length == 1)
        	{
        		sucess(tmp.results[0]);
        	}
        	else
    		{
        		error({status: 404});
    		}
        },
        error: error
    });	
};

//White-listed functions and some info about it
AC.remoteInvokableFns = {
	getRecentDiagrams: {isAsync: true},
	searchDiagrams: {isAsync: true},
	getCustomLibraries: {isAsync: true},
	getFileContent: {isAsync: true},
	getCurrentUser: {isAsync: true},
	getComments: {isAsync: true},
	userCanEdit: {isAsync: true},
	getCustomTemplates: {isAsync: true},
	getPageInfo: {isAsync: true},
	getDiagramRevisions: {isAsync: true},
	setHiResPreview: {isAsync: false},
	setAspect: {isAsync: false}
};

AC.remoteInvokeCallbacks = [];

AC.handleRemoteInvokeResponse = function(msg)
{
	var msgMarkers = msg.msgMarkers;
	var callback = AC.remoteInvokeCallbacks[msgMarkers.callbackId];
	
	if (msg.error)
	{
		if (callback.error) callback.error(msg.error.errResp);
	}
	else if (callback.callback)
	{
		callback.callback.apply(this, msg.resp);
	}
	
	AC.remoteInvokeCallbacks[msgMarkers.callbackId] = null; //set it to null only to keep the index
};

//Here, the editor is ready before sending init even which starts everything, so no need for waiting for ready message. Init is enough
AC.remoteInvoke = function(remoteFn, remoteFnArgs, msgMarkers, callback, error)
{
	msgMarkers = msgMarkers || {};
	msgMarkers.callbackId = AC.remoteInvokeCallbacks.length;
	AC.remoteInvokeCallbacks.push({callback: callback, error: error});
	AC.remoteWin.postMessage(JSON.stringify({action: 'remoteInvoke', funtionName: remoteFn, functionArgs: remoteFnArgs, msgMarkers: msgMarkers}), '*');
};

AC.handleRemoteInvoke = function(msg)
{
	function sendResponse(resp, error)
	{
		var respMsg = {action: 'remoteInvokeResponse', msgMarkers: msg.msgMarkers};
		
		if (error != null)
		{
			respMsg.error = {errResp: error};
		}
		else if (resp != null) 
		{
			respMsg.resp = resp;
		}
		
		AC.remoteWin.postMessage(JSON.stringify(respMsg), '*');
	}
	
	try
	{
		//Remote invoke are allowed to call functions in AC
		var funtionName = msg.funtionName;
		var functionInfo = AC.remoteInvokableFns[funtionName];
		
		if (functionInfo != null && typeof AC[funtionName] === 'function')
		{
			var functionArgs = msg.functionArgs;
			
			//Confirm functionArgs are not null and is array, otherwise, discard it
			if (!Array.isArray(functionArgs))
			{
				functionArgs = [];
			}
			
			//for functions with callbacks (async) we assume last two arguments are success, error
			if (functionInfo.isAsync)
			{
				//success
				functionArgs.push(function() 
				{
					sendResponse(Array.prototype.slice.apply(arguments));
				});
				
				//error
				functionArgs.push(function(err) 
				{
					sendResponse(null, err || mxResources.get('unknownError'));
				});
				
				AC[funtionName].apply(this, functionArgs);
			}
			else
			{
				var resp = AC[funtionName].apply(this, functionArgs);
				
				sendResponse([resp]);
			}
		}
		else
		{
			sendResponse(null, mxResources.get('invalidCallFnNotFound', [funtionName]));
		}
	}
	catch(e)
	{
		sendResponse(null, mxResources.get('invalidCallErrOccured', [e.message]));
	}
};
