(function()
{
	var EXPORT_URL = 'https://exp.draw.io/ImageExport4/export';
	
	// Enables dynamic loading of shapes and stencils (same domain)
	mxStencilRegistry.dynamicLoading = true;

	// Loads the Atlassian API
	var script = document.createElement('script');
	var baseUrl = getBaseUrl();
	
	// Loads the attachment and renders the diagram
	var diagramWidth = parseFloat(getUrlParam('width'));
	var diagramHeight = parseFloat(getUrlParam('height'));
	var diagramName = getUrlParam('diagramName');
	var displayName = getUrlParam('displayName');
	
	//ceoId and owningPageId are IDs of the page that potentially hold the attachment
	//they will differ when page history is shown, ceoId will be historical version ID,
	//owningPageId will be the ID of the current version that holds the attachment
	//ceoId is used as fallback in case owningPageId is not set(should be very rare)
	var ceoId = getUrlParam('ceoId');
	var owningPageId = getUrlParam('owningPageId');
	var revision = getUrlParam('revision');
	
	var tbStyle = getUrlParam('tbstyle') || 'top';
	var links = getUrlParam('links') || 'auto';
	var enableLightbox = getUrlParam('lbox') != '0';
	var simpleViewer = getUrlParam('simple') == '1';
	var tbHeight = (tbStyle == 'top' && !simpleViewer) ? GraphViewer.prototype.toolbarHeight : 0;
	var zoom = parseFloat(getUrlParam('zoom') || 1);
	var border = (simpleViewer) ? 0 : 8;
	var pCenter = getUrlParam('pCenter') == '1';
	
	var contentId = getUrlParam('contentId') || getUrlParam('custContentId');
	var contentVer = getUrlParam('contentVer');
	var linkedMode = getUrlParam('linked') == '1';
	var diagramUrl = getUrlParam('diagramUrl');
	var inComment = getUrlParam('inComment') == '1';
	var aspect = getUrlParam('aspect');
	var imgPageId = getUrlParam('imgPageId');
	var aspectHash = getUrlParam('aspectHash');
	var attVer = getUrlParam('attVer', true);
	var service = getUrlParam('service', true);
	var sFileId = getUrlParam('sFileId', true);
	var odriveId = getUrlParam('odriveId', true);
	var userCanEdit = {}; //0: Unknown, 1: Yes, -1: No. For each pageId
	// Workaround for blocked referrer in iframe
	Graph.prototype.baseUrl = baseUrl + '/pages/viewpage.action?pageId=' + owningPageId;

	var openPageImg = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH4goKFCgQ6ZBdjgAAAvJJREFUWMPFlz+IFHcUxz/vt7Nzu7fuKYqGM7HQKBISUc8gwcYiRcDKJliqRYRUkkYtUgRUCIekCQFbxUIDFxBCimAKBUtRJEVQLyRGZV31yO1e9vbPzO+b4obLnl682bm99TW/md/Me+/7vr/3Z8boEkkTwDayiQFV4KCZ1TNZkHRXy5cHvfgM/md/EzDdg51/gDvADuBdSZPA+0DLzJSFgXIG9m4nuleT9Z6k0lJ6jv7LUeBikkt33wSA0MwOJyC2SJqUVJJkgwIggATEBWBLkh/FQQH4ry7NjiQgtgK/DgpAfREQ3wKbJf0uaSRNGS5H7kuaeWmvAUTAZuAGsGslAAwl68Yl3tu5UgzsXsRemLRogCbwC/BRTwCefBkWyyP6ChG97r2Z8fCVyVCr2em3z7SbXc2qk7YVz0uhqDEHJyLvF46dVoj8XHDmBEMt6Cr1MHAUh+MfgFtZZsErha1u752Q0md3cIW5hPbNaWrn95IrNgDf1Q2yD6PXS34Dwei2rlp+i/rUekZG/8I535Op/vUBg9rTAO+tJ7VsDEQV4hcP8a1GEkYBRRUsEDPVPOX1ndSWMwAQeCFX4tGp9yCX551z91AbLBDeQ60aEm6MsP4dgQHCbBhYxfCnPzL90zhujcOVY2o/f8OGzy8jimAlJE/9WZ6onesTAwLCTYR7jkOuSH77x0TXLiWZLqKpCqWxA0TVsyiapX79O3z0lMbzvEG7HwA8wQfHKOz/Yn5r7aGveXzy+/lrzFj9yTFwDt+epXn9LGbWxyPwLzVCxYAlJCRF71zS8eL+l6Fqfy64j2emIDAsMOL684XPXvyRKvr0R+DAT17h8fEJOlE+8dLECnORVsb3Qa4wx4T3WChCl64bBmnyH4GsyarRHI2/O7QbBjnNDzoLPTDbpeVTk7skAC8qztlvAbkWwMi6iFoUSJF1TdpFKHMMEVPN+mdUZgVE0g1JGthH6XKqoLVC/nzaHLgpabbPzmNgf1oAHw7qCP4Fs6J7VGnK/oIAAAAASUVORK5CYII=';

	if (!lightbox)
	{
		document.body.style.backgroundImage = 'url(/images/aui-wait.gif)';
		document.body.style.backgroundPosition = 'left top';
		document.body.style.backgroundSize = 'auto auto';
	}
	
	function main()
	{
		// Sets initial placeholder size to allow for scrollbars in fit to page width
		AP.resize('100%', (lightbox || customContent) ? '100%' : (diagramHeight * zoom + tbHeight + 2));
		
		function showError(msg)
		{
			document.body.style.backgroundImage = 'none';
			document.body.style.padding = '4px';
			mxUtils.write(document.body, msg);
			AP.resize('100%', 24);
		};
		
		//keeping the block of AP.require to mimimize the number of changes!
		{
			//This is a workaround Jira Service Desk preview which has no context. 
			//AP.navigator.getLocation will just log an error and callback function won't be called 
			var ignoreNavFallback = false;
			var isServiceDesk = false; //In service desk, we cannot show dialogs as we cannot pass customData
			
			var fallbackTimeoutThread = window.setTimeout(function()
			{
				if (!ignoreNavFallback) 
				{
					isServiceDesk = true;
					startViewer();
				}
			}, 500); //allow 0.5 sec for AP.navigator.getLocation 
			
			// Uses pageId from current page as page in macro may be outdated after export
			AP.navigator.getLocation(function (data)
		    {
				ignoreNavFallback = true;
				window.clearTimeout(fallbackTimeoutThread);
				startViewer(data);
		    });
			
			function startViewer(data) 
			{
				var candidateId = (owningPageId != null && owningPageId.length > 0) ? owningPageId : ceoId;

				if (!linkedMode && data != null && data.target != null && data.context != null)
				{
					candidateId = data.context.contentId;
				}
				
				function showExtDiagram(name, url)
				{
					mxUtils.get(url, function(req) 
					{
						if (req.getStatus() >= 200 && req.getStatus() <= 299)
						{
							try
							{
							    var xml = req.getText();
						
							    document.body.style.backgroundImage = 'none';
							    
								//In case we want to load another diagram
								var oldContainer = document.getElementById("drawIODiagram");
								
								if (oldContainer != null)
								{
									oldContainer.parentNode.removeChild(oldContainer);
								}
								// LATER: Fix horizontal alignment ignored with 100% width of iframe
								// LATER: Fix page scrolling on touch device if trigger event on diagram
								// LATER: Hide toolbar after second container click for iOS
								// LATER: Disable responsive resize while lightbox shows
								var container = document.createElement('div');
								container.id = "drawIODiagram";
								container.style.cssText = 'position:absolute;' +
									'max-width:100%;border:1px solid transparent;';
								document.body.appendChild(container);
								var doc = mxUtils.parseXml(xml);
								
								var config = {highlight: '#3572b0', 'toolbar-position': tbStyle,
									nav: true, zoom: zoom};
								
								config.lightbox = false;
								config.toolbar = 'pages zoom layers';
								config.border = border;
								config.title = name;
								config.resize = true;
								
								if (aspect != null)
								{
									//Set pageId and layers
									var aspectArray = aspect.split(' ');

									if (aspectArray.length > 1)
									{
										config.pageId = aspectArray[0];
										config.layerIds = aspectArray.slice(1);
									}
								}
								
								var viewer = new GraphViewer(container, doc.documentElement, config);
			
								// Handles resize of iframe after zoom
								var graphDoResizeContainer = viewer.graph.doResizeContainer;
								
								function updateHeight(height)
								{
									AP.resize('100%', Math.ceil(height) + tbHeight + 2);
								};
								
								viewer.graph.doResizeContainer = function(width, height)
								{
									graphDoResizeContainer.apply(this, arguments);
									updateHeight(height);
								};
			
								// Updates the size of the iframe in responsive cases
								viewer.updateContainerHeight = function(container, height)
								{
									updateHeight(height);
								};
								
								updateHeight(container.offsetHeight);
							}
							catch(e)
							{
								showError(e.message);
							}
						}
						else
						{
							if (req.getStatus() == 404)
							{
								showError(mxResources.get('fileNotFound'));
							}
						}
					}, function()
					{
						showError(mxResources.get('unknownError'));
					}, false, 25000, function()
				    {
						showError(mxResources.get('confTimeout'));
				    });
				};
				
				// Loads the given XML into the viewer
				function showDiagram(id, backupId, name, revision, links, retryParams, displayName, contentId, spaceKey, openComments, aspect)
				{
					//Check if the user can edit this diagram
					if (userCanEdit[id] == null)
					{
						if (inComment || (owningPageId != null && candidateId != owningPageId)) //TODO If the page id in the macro doesn't match the current page, we cannot edit it, fix this by allowing finding macro by owningPageId
						{
							userCanEdit[id] = -1; //TODO enable editing macros in comments externally (requires finding which comment it belongs to and editing that comment content)
						}
						else
						{
							var acceptPermResponse = true;
							
							var permTimer = setTimeout(function()
							{
								acceptPermResponse = false;
								userCanEdit[id] = 0;
								showDiagram(id, backupId, name, revision, links, retryParams, displayName, contentId, spaceKey, openComments, aspect);
							}, 5000); //Five second timeout
							
							AC.userCanEdit(id, function(canEdit)
							{
								if (acceptPermResponse)
								{
									window.clearTimeout(permTimer);
									userCanEdit[id] = canEdit? 1 : -1;
									showDiagram(id, backupId, name, revision, links, retryParams, displayName, contentId, spaceKey, openComments, aspect);
								}
							}, function()
							{
								if (acceptPermResponse)
								{
									window.clearTimeout(permTimer);
									userCanEdit[id] = 0;
									showDiagram(id, backupId, name, revision, links, retryParams, displayName, contentId, spaceKey, openComments, aspect);
								}
							});
							
							return;
						}
					}
					
					displayName = displayName || name;
					retryParams = retryParams || {}; //so we can use it without NPE check
					
					var aspectPageId = null, aspectLayerIds = null;
					
					if (aspect != null)
					{
						//Set pageId and layers
						var aspectArray = aspect.split(' ');

						if (aspectArray.length > 1)
						{
							aspectPageId = aspectArray[0];
							aspectLayerIds = aspectArray.slice(1);
						}
					}
					
					if (id != null)
					{
						id = id.toString();
					}

					if (id != null && id.length > 0 && name != null && name.length > 0) 
					{
						// Option currently not available in the UI
						if (simpleViewer)
						{
							document.body.style.backgroundImage = 'none';
							var img = document.createElement('img');
							img.style.cssText = 'max-width:100%;';
							img.setAttribute('src', baseUrl + '/download/attachments/' + id + '/'
									+ encodeURIComponent(name) + ".png?api=v2"
									+ (revision != null ? "&version=" + revision : ""));
							
							if (zoom != 1)
							{
								img.style.width = Math.round(diagramWidth * zoom) + 'px';
							}
							
							document.body.appendChild(img);
						}
						else
						{
							var timeout = 25000;
							var serverName = getUrlParam('xdm_e');
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
							
							var acceptResponse = true;
							
							var timeoutThread = window.setTimeout(function()
							{
								acceptResponse = false;
								
								if (lightbox)
								{
									AC.showNotification({
									  title: mxResources.get('confTimeout'),
									  body: mxResources.get('confSrvTakeTooLong', [serverName]),
									  type: 'error',
									  close: 'manual'
									});
									
									//TODO find how to listen to flag close event, currently just close the dialog immidiately
									//AP.events.on('flag.close', function()
									//{
										AP.dialog.close();
									//});
								}
								else
								{
									showError(mxResources.get('confTimeout') + ': ' +
											mxResources.get('confSrvTakeTooLong', [serverName]));
								}
							}, timeout);
							
							AP.request(
							{
								url: '/download/attachments/' + id + '/' + encodeURIComponent(name) +
									((revision != null && revision.length > 0) ? '?version=' + revision : ''),
								success: function(xml) 
								{
							 		window.clearTimeout(timeoutThread);
									
							 		if (acceptResponse)
							 		{
										document.body.style.backgroundImage = 'none';
										
										var openParentPageFunc = function()
										{
											var openURL = function(pageURL)
											{
												try
												{
													top.window.location.href = pageURL;										
												}
												catch(e) //In case of a security exception
												{
													window.location = pageURL;
												}
											};
											
						                    AP.request({
						                        type: 'GET',
						                        url: '/rest/api/content/' + id,
						                        contentType: 'application/json;charset=UTF-8',
						                        success: function (resp) 
						                        {
						                        	if (userCanEdit[id] != -1)
					                        		{
							                        	openURL(baseUrl + '/spaces/' + encodeURIComponent(spaceKey) + '/pages/edit/' + id);					                        		
					                        		}
						                        	else
					                        		{
						                        		//Open in view mode
					                        			openURL(baseUrl + '/spaces/' + encodeURIComponent(spaceKey) + '/pages/' + id);	
					                        		}
						                        },
						                        error: function (resp) 
						                        {
						                            //On error, we assume it is a draft page
						                        	openURL(baseUrl + '/spaces/' + encodeURIComponent(spaceKey) + '/pages/create?draftId=' + id);
						                            //TODO we can confirm page exist with another request + "?status=draft" and show error message if page cannot be found
						                        }
						                    });
										};
										
										var editFunc = function()
										{
											if (lightbox)
											{
												AP.dialog.close({noBack: true, openEditorId: contentId});												
											}
											else
											{
												AP.dialog.create(
								                {
							                		key: 'customContentEditor',
							                		//sending pageId and revision to verify custom content matches opened diagram
								                    customData: {contentId: contentId, 
							                    				macroData: {
							                    					width: diagramWidth,
							                    					height: diagramHeight,
							                    					diagramName: name,
							                    					diagramDisplayName: displayName,
							                    					pageId: id,
							                    					revision: revision,
							                    					tbstyle: tbStyle,
							                    					links: links,
							                    					simple: simpleViewer,
							                						lbox: enableLightbox,
							                    					zoom: zoom,
							                    					contentVer: contentVer,
							                    					contentId: contentId,
							                    					custContentId: contentId,
							                    					aspect: aspect
							                    				}
								                    },
								                    chrome: false,
								                    width: "100%",
								                    height: "100%",
								                }).on("close", function(flags)
						                		{
								                	//refresh the viewer
								                	if (flags && flags.newRev && flags.newContentVer && flags.newContentId)
							                		{
								                		contentVer = flags.newContentVer;
								                		contentId = flags.newContentId;
								                		showDiagram(id, backupId, name, flags.newRev, links, retryParams, displayName, contentId, null, null, flags.newAspect);
							                		}
						                		});
											}
										};
										
										var commentsWindow = null;
										var confUser = null;
										
										//Comments are only shown in lightbox mode
										if (lightbox)
										{
											//Adjust some functions such that it can be instanciated without UI
											EditorUi.prototype.createUi = function(){};
											EditorUi.prototype.addTrees = function(){};
									    	EditorUi.prototype.updateActionStates = function(){};
									    	var editorUi = new EditorUi();
											
											editorUi.getCurrentUser = function()
											{
												if (confUser == null)
												{
													AC.getCurrentUser(function(user)
													{
														confUser = new DrawioUser(user.id, user.email, user.displayName, user.pictureUrl);
														
														if (openComments) //Open the comments window here when the user is ready
														{
															openCommentsFunc();
														}
													}, function()
													{
														//ignore such that next call we retry
													});
													
													//Return a dummy user until we have the actual user in order for UI to be populated
													return new DrawioUser(Date.now(), null, mxResources.get('anonymous'));
												}
												
												return confUser;
											};
											
											//Prefetch current user 
											editorUi.getCurrentUser();
										}
										
										var openCommentsFunc = function()
										{
											if (commentsWindow != null)
											{
												commentsWindow.window.setVisible(commentsWindow.window.isVisible()? false : true);
											}
											else
											{
												var confComments = null;
												var spaceKey, pageId, pageType, contentVer;
												
												function saveComments(comments, success, error)
												{
													AC.saveCustomContent(spaceKey, pageId, pageType, name, displayName, revision,
			            									contentId, contentVer,
			            									function(responseText) 
			            									{
			            										var content = JSON.parse(responseText);
			            										
			            										contentId = content.id;
			            										contentVer = content.version.number;
			            										
			            										success();
			            									}, error, comments);
												}
												
												editorUi.canComment = function()
												{
													return true; //We don't put restrictions on draw.io custom contents, so anyone can edit
												};
												
												editorUi.commentsSupported = function()
												{
													return true;
												};
												
												editorUi.commentsRefreshNeeded = function()
												{
													return false;
												};

												editorUi.commentsSaveNeeded = function()
												{
													return false;
												};

												
												editorUi.canReplyToReplies = function()
												{
													return true;
												};
												
												function confCommentToDrawio(cComment, pCommentId)
												{
													if (cComment.isDeleted) return null; //skip deleted comments
													
													var comment = new DrawioComment(null, cComment.id, cComment.content, 
															cComment.modifiedDate, cComment.createdDate, cComment.isResolved,
															new DrawioUser(cComment.user.id, cComment.user.email,
																	cComment.user.displayName, cComment.user.pictureUrl), pCommentId);
													
													for (var i = 0; cComment.replies != null && i < cComment.replies.length; i++)
													{
														comment.addReplyDirect(confCommentToDrawio(cComment.replies[i], cComment.id));
													}
													
													return comment;
												};
														
												editorUi.getComments = function(success, error)
												{
													if (confComments == null)
													{
														AC.getComments(contentId, function(comments, spaceKey_p, pageId_p, pageType_p, contentVer_p)
														{
															spaceKey = spaceKey_p; pageId = pageId_p; pageType = pageType_p; contentVer = contentVer_p;
															
															confComments = [];
															
															for (var i = 0; i < comments.length; i++)
															{
																var comment = confCommentToDrawio(comments[i]);
																
																if (comment != null) confComments.push(comment);
															}
															
															success(confComments);
														}, error);
													}
													else
													{
														success(confComments);
													}
												};

												editorUi.addComment = function(comment, success, error)
												{
													var tmpComments = JSON.parse(JSON.stringify(confComments));
													comment.id = confUser.id + ':' + Date.now();
													tmpComments.push(comment);
													
													saveComments(tmpComments, function()
													{
														success(comment.id);
													}, error);
												};
														
												editorUi.newComment = function(content, user)
												{
													return new DrawioComment(null, null, content, Date.now(), Date.now(), false, user); //remove file information
												};
												
												//In Confluence, comments are part of the file (specifically custom contents), so needs to mark as changed with every change
												DrawioComment.prototype.addReply = function(reply, success, error, doResolve, doReopen)
												{
													reply.id = confUser.id + ':' + Date.now();
													this.replies.push(reply);
													var isResolved = this.isResolved;
													
													if (doResolve)
													{
														this.isResolved = true;
													}
													else if (doReopen)
													{
														this.isResolved = false;
													}
													
													var tmpComments = JSON.parse(JSON.stringify(confComments));
													this.replies.pop(); //Undo in case more changes are done before getting the reply
													this.isResolved = isResolved;
													
													saveComments(tmpComments, function()
													{
														success(reply.id);
													}, error);
												};

												DrawioComment.prototype.editComment = function(newContent, success, error)
												{
													var oldContent = this.content;
													this.content = newContent;
													var tmpComments = JSON.parse(JSON.stringify(confComments));
													this.content = oldContent;
													
													saveComments(tmpComments, success, error);
												};

												DrawioComment.prototype.deleteComment = function(success, error)
												{
													var that = this;
													this.isDeleted = true; //Mark as deleted since searching for this comment in the entire structure is complex. It will be cleaned in next save
													var tmpComments = JSON.parse(JSON.stringify(confComments));
													
													saveComments(tmpComments, success, function(err) 
													{
														that.isDeleted = false;
														error(err);
													});
												};
												
												commentsWindow = new CommentsWindow(editorUi, document.body.offsetWidth - 380, 120, 300, 350);
												commentsWindow.window.setVisible(true);
												//Lightbox Viewer has 999 zIndex
												commentsWindow.window.getElement().style.zIndex = 2000;
											}
										};
										
										if (lightbox)
										{
											var config = {highlight: '#3572b0', nav: true, lightbox: false};
											
											var lbBtns = [];

											if (spaceKey != null && spaceKey.length > 0)
											{
												if (userCanEdit[id] != -1)
												{
													lbBtns.push({icon: Editor.editLargeImage, tooltip: mxResources.get('edit'), fn: editFunc});
												}
												
												lbBtns.push({icon: openPageImg, tooltip: mxResources.get('confGotoPage'), fn: openParentPageFunc});
											}
											
											lbBtns.push({icon: Editor.commentImageInverted, tooltip: mxResources.get('comments'), fn: openCommentsFunc});
											EditorUi.prototype.lightboxToolbarActions = lbBtns;
											
											if (links != 'auto')
											{
												config.target = links;
											}
											
											config.pageId = aspectPageId;
											config.layerIds = aspectLayerIds;
											
											var viewer = new GraphViewer(null, null, config);
											
											viewer.lightboxChrome = false;
											viewer.xml = xml;
			
											// Enables layers via flag to avoid toolbar
											viewer.layersEnabled = true;
											
											var ui = viewer.showLocalLightbox();
											// Destroy lightbox with ui instance
											var destroy = ui.destroy;
											ui.destroy = function()
											{
												AP.dialog.close();
												destroy.apply(this, arguments);
											};
											
											// Workaround for ignored header toolbar height for iframe
											ui.editor.graph.container.style.bottom = '51px';
										}
										else
										{
											//In case we want to load another diagram
											var oldContainer = document.getElementById("drawIODiagram");
											
											if (oldContainer != null)
											{
												oldContainer.parentNode.removeChild(oldContainer);
											}
											// LATER: Fix horizontal alignment ignored with 100% width of iframe
											// LATER: Fix page scrolling on touch device if trigger event on diagram
											// LATER: Hide toolbar after second container click for iOS
											// LATER: Disable responsive resize while lightbox shows
											var container = document.createElement('div');
											container.id = "drawIODiagram";
											//There is an issue with AP.resize when custom content is shown. It works only once!
											if (customContent) {
												document.body.style.overflow = "auto";
											}
											container.style.cssText = (customContent? '' : 'position:absolute;') +
												'max-width:100%;border:1px solid transparent;';
											document.body.appendChild(container);
											var doc = mxUtils.parseXml(xml);
											
											var config = {highlight: '#3572b0', 'toolbar-position': tbStyle,
												nav: true, border: 2, zoom: zoom};
											
											if (pCenter)
											{
												config['auto-fit'] = true;
												config['resize'] = false;
												container.style.width = '100%';
											}
											
											if (tbStyle == 'top')
											{
												config.title = displayName;
											}
	
											if (links != 'auto')
											{
												config.target = links;
											}
											
											if (!enableLightbox)
											{
												config.lightbox = false;
											}
											
											if (tbStyle != 'hidden')
											{
												config.toolbar = 'pages zoom layers';
												config.border = border;
												
												if (enableLightbox)
												{
													config.toolbar += ' lightbox';
												}
											}
											else
											{
												// Workaround for invalid width if no toolbar is present
												var updateContainerWidth = GraphViewer.prototype.updateContainerWidth;
												
												GraphViewer.prototype.updateContainerWidth = function(container, width)
												{
													width += 3;
													updateContainerWidth.apply(this, arguments);
												};

												config.resize = true;
											}
											
											
											if (userCanEdit[id] != -1 //We treat 0 (unknown as allowed since anyway the editor will show an error on save) 
													&& contentId != null && contentId.length > 0 && tbStyle != 'hidden' && !linkedMode && !isServiceDesk)
											{
												config.toolbar = 'edit ' + config.toolbar;
												var editImage = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABUAAAAVBAMAAABbObilAAAAD1BMVEUAAAAAAAAQEBBycnIgICBqwj3hAAAAAXRSTlMAQObYZgAAADlJREFUCNdjoBwoChrAmCyGggJwYWVBBSiTSVDICKFa0AEuLCiEJKyAX5gBSZgBSZgBKGwMBKQ7HAAWzQSfKKAyBgAAAABJRU5ErkJggg==';
												
												config['toolbar-buttons'] = 
												{
													'edit': {title: mxResources.get('edit'), enabled: true,
														image: editImage, handler: editFunc}
												};
											}
											
											config.pageId = aspectPageId;
											config.layerIds = aspectLayerIds;
											
											var viewer = new GraphViewer(container, doc.documentElement, config);
			
											// Handles resize of iframe after zoom
											var graphDoResizeContainer = viewer.graph.doResizeContainer;
											
											function updateHeight(height)
											{
												AP.resize('100%', Math.ceil(height) + tbHeight + 2);
											};
											
											viewer.graph.doResizeContainer = function(width, height)
											{
												graphDoResizeContainer.apply(this, arguments);
												updateHeight(height);
											};
			
											// Updates the size of the iframe in responsive cases
											viewer.updateContainerHeight = function(container, height)
											{
												updateHeight(height);
											};
											
											updateHeight(container.offsetHeight);
											
											var orignShowLightbox = viewer.showLightbox;
											
											viewer.showLightbox = function(openComments)
											{
												//Revert back to opening the lightbox in a new tab since we cannot open Confluence dialogs as there is no custom data
												if (isServiceDesk)
												{
													orignShowLightbox.call(this, false); //Open in new tab without edit option
													return;
												}
												
												//Create an aspect reflecting current view
												var curPageDiagram = viewer.diagrams[viewer.currentPage];
												var curAspect = null;
												
												if (curPageDiagram != null)
												{
													var layerIds = [], pageId = curPageDiagram.getAttribute('id');
					
													var model = viewer.graph.getModel();
													var childCount = model.getChildCount(model.root);
														
													// Get visible layers
													for (var i = 0; i < childCount; i++)
													{
														var layer = model.getChildAt(model.root, i);
														
														if (model.isVisible(layer))
														{
															layerIds.push(layer.id);
														}
													}
														
													curAspect = pageId + ' ' + layerIds.join(' ');
												}
												else
												{
													EditorUi.logEvent('CONF_VIEWER_CURRENT_PAGE_NOT_FOUND: current page = ' + viewer.currentPage + ', diagrams length = ' + viewer.diagrams.length);
												}
												
												AP.dialog.create(
								                {
								                    header: displayName,
							                		key: 'lightbox',
								                    size: 'fullscreen',
								                    customData: {id: id, name: name, revision: revision, aspect: curAspect, links: links, displayName: displayName, contentId: contentId, custContentId: contentId, openComments: openComments},
								                    chrome: true
								                });
											};
											
											//Handle Anchor links
											var origCustomLinkClicked = viewer.graph.customLinkClicked;
											
											viewer.graph.customLinkClicked = function(href)
											{
												if (href.substring(0, 23) == 'data:confluence/anchor,')
												{
													AC.gotoAnchor(href.substring(23));
													return true;
												}
												else
												{
													return origCustomLinkClicked.apply(this, arguments);
												}
											};
											
											//Check embedded diagrams preview image is in sync in the background
											if (linkedMode && (diagramUrl == null || diagramUrl.length == 0))
											{
												var imgAttVer = null, curAttVer = null;
												
												function checkImgVer()
												{
													if (imgAttVer != null && curAttVer != null && curAttVer != imgAttVer)
													{
														updateImage();
													}
												}
												
												function updateImage()
												{
				                    				//Update the image
				                    				function doSaveImage(imageData)
													{
														if (imageData != null)
														{
															AC.saveDiagram(imgPageId, name + '-' + aspectHash + '.png', AC.b64toBlob(imageData, 'image/png'),
																	ignoreFn, ignoreFn, false, 'image/png', 'draw.io aspect image' + (curAttVer != null? ' - ' + curAttVer : ''), false, false);
														}
													};
													
													function serverFallback()
													{
												    	var req = new mxXmlRequest(EXPORT_URL, 'format=png&base64=1' +
												    			 (aspectLayerIds != null? '&extras=' + encodeURIComponent(JSON.stringify({layerIds: aspectLayerIds})) : '') + 
																 (aspectPageId != null? '&pageId=' + aspectPageId : '') + '&xml=' + encodeURIComponent(xml));
									
														req.send(function(req)
														{
															doSaveImage(req.getStatus() >= 200 && req.getStatus() <= 299? req.getText() : null);
														}, ignoreFn);
												    
													};
													
													if (viewer.editor.isExportToCanvas())
											    	{
														viewer.editor.exportToCanvas(function(canvas)
												    	{
												    		var data = canvas.toDataURL('image/png');
												   	   		doSaveImage(data.substring(data.lastIndexOf(',') + 1));
												    	}
												    	, null, null, null, serverFallback);
											    	}
											    	else
										    		{
											    		serverFallback();
										    		}
												};
												
												function ignoreFn(){};
												
												if (service != null)
												{
													function renderAndCache(newXml, timestamp, isPng)
													{
														if (isPng)
														{
															newXml = 'data:image/png;base64,' + Editor.base64Encode (newXml);
															newXml = AC.extractGraphModelFromPng(newXml);
														}
														
			            								//render diagram
			            								viewer.setXmlNode(mxUtils.parseXml(newXml).documentElement);
			            								//Apply aspect (layers) again
			            								viewer.showLayers(viewer.graph);
			            								//Update xml (used for server rendering)
			            								xml = newXml;
			            								//Save diagram
			            								AC.saveDiagram(id, name, newXml,
			            										updateImage, function(resp)
			            										{
			            											showError(mxResources.get('confSaveCacheFailed'));
			            										}, false, 'application/vnd.jgraph.mxfile', 'Embedded draw.io diagram - ' + timestamp, false, false);
													};
													
													if (service == 'GDrive')
													{
														GAC.getFileInfo(sFileId, function(fileInfo)
														{
															var isPng = fileInfo.mimeType == 'image/png';
															var timestamp = new Date(fileInfo.modifiedDate).getTime();
															viewer.updateTitle(fileInfo.title);
															
															AC.getAttachmentInfo(id, name, function(info)
															{
																var cachedTS = null;
																
																try
									                    		{
									                    			cachedTS = parseInt(info.metadata.comment.split(' - ').pop());
									                    		}
									                    		catch(e) {} //ignore

									                    		//If cache is old or invalid, fetch the current version
									                    		if (timestamp != cachedTS)
								                    			{
									                    			GAC.doAuthRequestPlain(fileInfo['downloadUrl'], 'GET', null, function(req)
																	{
									                    				renderAndCache(req.responseText, timestamp, isPng);
																	}, function()
																	{
																		showError(mxResources.get('confReadFileErr', [name, 'Google Drive']));
																	}, null, isPng);
								                    			}
															}, function()
															{
																showError(mxResources.get('confCheckCacheFailed'));
															});
														}, function()
														{
															showError(mxResources.get('confGetInfoFailed', ['Google Drive']));
														});
													}
													else if (service == 'OneDrive')
													{
														AC.getFileInfo(sFileId, odriveId, function(fileInfo)
														{
															var isPng = fileInfo.file.mimeType == 'image/png';
															var timestamp = new Date(fileInfo.lastModifiedDateTime).getTime();
															viewer.updateTitle(fileInfo.name);
															
															AC.getAttachmentInfo(id, name, function(info)
															{
																var cachedTS = null;
																
																try
									                    		{
									                    			cachedTS = parseInt(info.metadata.comment.split(' - ').pop());
									                    		}
									                    		catch(e) {} //ignore

									                    		//If cache is old or invalid, fetch the current version
									                    		if (timestamp != cachedTS)
								                    			{
									                    			var req = new XMLHttpRequest();
									            					req.open('GET', fileInfo['@microsoft.graph.downloadUrl']);
									            					
									            					req.onreadystatechange = function()
									            					{
									            						if (this.readyState == 4)
									            						{
									            							if (this.status >= 200 && this.status <= 299)
									            							{
									            								renderAndCache(req.responseText, timestamp, isPng);
									            							}
									            							else
									            							{
																				showError(mxResources.get('confReadFileErr', [name, 'OneDrive']));
									            							}
									            						}
									            					};
									            					
									            					if (isPng && req.overrideMimeType)
									            					{
									            						req.overrideMimeType('text/plain; charset=x-user-defined');
									            					}
									            					
									            					req.send();
								                    			}
															}, function()
															{
																showError(mxResources.get('confCheckCacheFailed'));
															});
														}, function()
														{
															showError(mxResources.get('confGetInfoFailed', ['OneDrive']));
														});
													}
												}
												else
												{
													//The case of referring to a diagram in another page
													
													//Get image version from attachment comment
													AC.getAttachmentInfo(imgPageId, name + '-' + aspectHash + '.png', function(info)
													{
														try
							                    		{
							                    			imgAttVer = parseInt(info.metadata.comment.split(' - ').pop());
							                    		}
							                    		catch(e) {} //ignore
							                    		
							                    		imgAttVer = imgAttVer || attVer;
							                    		checkImgVer();
													}, ignoreFn);
													
													//Get version
													AC.getAttachmentInfo(id, name, function(info)
													{
														curAttVer = info.version.number;
							                    		checkImgVer();
													}, ignoreFn);
												}
											}
											
											AC.getComments(contentId, function(comments)
											{
												var hasUnresolvedComments = false;
												
												for (var i = 0; i < comments.length; i++)
												{
													if (!comments[i].isDeleted && !comments[i].isResolved)
													{
														hasUnresolvedComments = true;
														break;
													}
												}
												
												//If there are comments, show the comments icon
												if (hasUnresolvedComments)
												{
													var commentsIcon = document.createElement('img');
													commentsIcon.style.cssText = 'position:absolute;bottom: 5px; right: 5px;opacity: 0.25; cursor: pointer';
													commentsIcon.setAttribute('title', mxResources.get('showComments'));
													commentsIcon.src = Editor.commentImage;
													commentsIcon.addEventListener('click', function() 
													{
														viewer.showLightbox(true);
													});
													container.appendChild(commentsIcon);
												}
											}, function(){});//Nothing to do in case of an error
										}
										//Confirm that the macro is in sync with the diagram
										//Sometimes the diagram is saved but the macro is not updated
										var attInfo = null;
										var pageInfo = null;
										
										function confirmDiagramInSync()
										{
											if (attInfo == null || pageInfo == null) 
												return;
											
											var loadedVer = parseInt(revision);
											
											//TODO is this condition enough or we need to check timestamps also?
											if (attInfo.version.number > loadedVer 
													&& (pageInfo.version.message == null || pageInfo.version.message.indexOf("Reverted") < 0)) 
											{
												showDiagram(id, backupId, name, attInfo.version.number + '', links, {dontCheckVer: true}, displayName, contentId, null, null, aspects);
												//I think updating macro here is too risky since calling confluence.getMacroData returns null
											}
										}
										
										//This fix contradict with copy/paste workflow where all diagrams have the same name
										//On copy/paste diagram name must be changed
										/*if (!retryParams.dontCheckVer && revision != null && revision.length > 0)
										{
						                    AP.request({
						                        type: 'GET',
						                        url: '/rest/api/content/' + id + '?expand=version',
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
						                        url: '/rest/api/content/' + id + '/child/attachment?filename=' + 
						                        		encodeURIComponent(name) + '&expand=version',
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
										
										//Saving the diagram to this page negates page linking feature!
										//May be we should ask the user first or saving is not needed all together
										/*if (retryParams.saveIt)
										{
								 			//Since attachment wasn't found in this page, it is better to save it to this page
								 			//First load AC dynamically. Since AC is not needed in the viewer except for this case
							 				var head = document.getElementsByTagName('head')[0];
											var script = document.createElement('script');
											script.setAttribute('data-options', 'resize:false;margin:false');
											
											// Main
											script.onload = function()
											{
												//save diagram
												AC.saveDiagram(retryParams.pageId, name, xml,
												function()
												{
													//nothing!
												}, 
												function()
												{
													//nothing!
												}, false, 'application/vnd.jgraph.mxfile', 'Diagram imported by Draw.io', false, false);
												
												//TODO save preview png
												//This requires an editor to do the png export, may be a canvas can be used with supported browsers
											};
											script.src = 'connectUtils-1-4-8.js';
											head.appendChild(script);
										}*/
							 		}
								},
								error: function (err)
								{
							 		window.clearTimeout(timeoutThread);
									
							 		if (err.status == 404)
							 		{
							 			if (/(^\s|\s$)/.test(name))
										{
							 				showDiagram(id, backupId, name.trim(), revision, links, retryParams, displayName, contentId, spaceKey, openComments, aspect)
										}
							 			//Copied pages are reset to revision 1, in addition, copy&paste pages saves diagrams imported from another page
							 			//So, try revision 1 first
							 			else if (revision > 1)
							 			{
								 			showDiagram(id, backupId, name, null, links, {revision: revision}, displayName, contentId, null, null, aspect);
							 			}
							 			else if (backupId != null)
						 				{
								 			//Since attachment wasn't found in this page, it is better to save it to this page
								 			showDiagram(backupId, null, name, revision || retryParams.revision, links, {saveIt: true, pageId: id}, displayName, contentId, null, null, aspect);
						 				}
							 			else //All alternatives failed, so this diagram is not found
						 				{
							 				document.body.style.backgroundImage = 'none';
											showError(mxResources.get('diagNotFound'));
						 				}
							 		}
							 		else if (err.status == 0)
						 			{
							 			document.body.style.backgroundImage = 'none';
							 			
							 			if (linkedMode) //When the embedded diagram refers to a page that current user has no permissions to view, and error status 0 is returned
							 			{
							 				showError(mxResources.get('confNoPermErr', [id]));
							 			}
							 			else // This can happen when a macro has a pageId (backupId) that the current user doesn't have access to it AND the diagram itself is deleted from this page (e.g, macro is copy/paste)
							 				 //	, so show a more meaningful error with a dot to differentiate
						 				{
							 				showError(mxResources.get('diagNotFound') + '.');
						 				}
						 			}
							 		else if (acceptResponse)
							 		{
										document.body.style.backgroundImage = 'none';
										showError(mxResources.get('confError', ['HTTP ' + err.status]));
							 		}
								}
							});
						}
					}
					else
					{
						showError(mxResources.get('confError', ['Invalid descriptor']));
					}
				};
	
                if (customContent)
                {
                    AP.request({
                        type: 'GET',
                        url: '/rest/api/content/' + contentId + '/?expand=body.storage',
                        contentType: 'application/json;charset=UTF-8',
                        success: function (resp) 
                        {
                            resp = JSON.parse(resp);
                            
                            var info = JSON.parse(decodeURIComponent(resp.body.storage.value));
                            var spaceKey = resp._expandable && resp._expandable.space? resp._expandable.space.substr(resp._expandable.space.lastIndexOf('/') + 1) : "";
                            
                            AP.dialog.create(
                            {
                                header: resp.title,
                        		key: 'lightbox',
                                size: 'fullscreen',
                              	//custom content can load old versions which will be overridden by version check
                                customData: {id: info.pageId, name: info.diagramName, revision: info.version, aspect: info.aspect, links: links, 
                                	displayName: resp.title, spaceKey: spaceKey, retryParams: {dontCheckVer: true}, contentId: contentId, custContentId: contentId, inComment: info.inComment},
                                chrome: true
                            }).on("close", function(flags)
                    		{
                				if (flags && flags.noBack)
               					{
                					if (flags.openEditorId)
                					{
                						//setTimeout is needed such that the current dialog closes completely
                						//without it, the on close event is not called!
										setTimeout(function()
										{
											AP.dialog.create(
							                {
						                		key: 'customContentEditor',
							                    customData: {contentId: flags.openEditorId, custContentId: flags.openEditorId},
							                    chrome: false,
							                    width: "100%",
							                    height: "100%",
							                }).on("close", function(flags)
						                    {
							                	if (flags && flags.noBack)
						                		{
							                		if (!flags.noBackOnClose)
						                			{
							                			//Go back after user (closes/clicks the link in) the flag 
								                		AP.events.on('flag.close', function(){
								                			AP.history.go(-1);
						                      			});
								                		AP.events.on('flag.action', function(){
								                			AP.history.go(-1);
						                      			});
						                			}
						                		}
							                	else
							                	{
				                					AP.history.go(-1);
							                	}
				                			});
										}, 10);
                					}
               					}
                				else
               					{
                					AP.history.go(-1);
               					}
                			});
                        },
                        error: function (resp) 
                        {
                        	AC.showNotification({
          					  title: mxResources.get('error'),
          					  body: mxResources.get('diagNotFound'),
          					  type: 'error'
          					});
          					
	                      	//give the user some time to read the error!
	                      	setTimeout(function()
	                  		{
	                      		AP.history.go(-1);	
	                      	}, 500);
                        }
                    });
                }
                else if (lightbox)
				{
					// Gets the paramters from the customData object in lightbox mode
					// LATER: Add XML to custom data (does not seem to work)
                	AP.dialog.getCustomData(function (customData) {
                		inComment = customData.inComment;
						showDiagram(customData.id, customData.id, customData.name, customData.revision, 
								customData.links, customData.retryParams, customData.displayName, customData.contentId || customData.custContentId,
								customData.spaceKey, customData.openComments, customData.aspect);
                	});
				}
				else
				{
					if (diagramUrl)
					{
						showExtDiagram(diagramName, diagramUrl);				
					}
					else
					{
						showDiagram(candidateId, (owningPageId != null && owningPageId.length > 0) ? owningPageId : ceoId, diagramName, revision, links, null, displayName, contentId, null, null, aspect);
					}
				}
		    };
		};
	};
	
	// Prefetches asynchronous requests so that below code runs synchronous
	// Loading the correct bundle (one file) via the fallback system in mxResources. The stylesheet
	// is compiled into JS in the build process and is only needed for local development.
	var bundleLoaded = false;
	var scriptLoaded = false;
	var fontsLoaded = false;
	var validSize = document.documentElement.offsetWidth > 0;

	function mainBarrier()
	{
		if (validSize && bundleLoaded && scriptLoaded && fontsLoaded)
		{
			main();
		}
	};

	// Disables delayed rendering since the container is created on the fly
	GraphViewer.prototype.checkVisibleState = false;
	
	// Workaround for collapsed panel is to delay main until size is not 0
	if (!validSize)
	{
		var listener = function()
		{
			if (document.documentElement.offsetWidth > 0)
			{
				window.removeEventListener('resize', listener);
				validSize = true;
				mainBarrier();
			}
		};
		
		window.addEventListener('resize', listener);
	}
	
	script.onload = function()
	{
		AP.user.getLocale(function(lang)
		{
			// Overrides browser language with Confluence user language
			if (lang != null)
			{
				var dash = lang.indexOf('_');
				
				if (dash >= 0)
				{
					mxLanguage = lang.substring(0, dash);
				}
			}
			
			mxResources.loadDefaultBundle = false;
			var bundle = mxResources.getDefaultBundle(RESOURCE_BASE, mxLanguage) ||
				mxResources.getSpecialBundle(RESOURCE_BASE, mxLanguage);

			mxUtils.getAll([bundle], function(xhr)
			{
				// Adds bundle text to resources
				mxResources.parse(xhr[0].getText());
				bundleLoaded = true;
				mainBarrier();
			});
		});

		// Workaround for Google Chrome triggering
		// no resize event if height is set to 0
		if (mxClient.IS_GC && !validSize)
		{
			AP.resize('100%', 1);
		}
		
		// Checks configuration and loads fontCss
		// While this is executed in parallel it still adds unnecessary
		// calls since it is only needed if global fontCss is used
		AP.request({
            type: 'GET',
            url: '/rest/api/content/search?cql=type%3Dpage%20and%20space%3DDRAWIOCONFIG%20and%20title%3DConfiguration', //type=page and space=DRAWIOCONFIG and title=Configuration. Search doesn't return 404 if not found
            contentType: 'application/json;charset=UTF-8',
            success: function (resp) 
            {
                resp = JSON.parse(resp);
                
                if (resp.size == 1)
               	{
                	var configPageId = resp.results[0].id;
                	
                	// Loads the configuration file
            		AP.request({
                        type: 'GET',
            			url: '/download/attachments/' + configPageId + '/configuration.json',
                        contentType: 'application/json;charset=UTF-8',
                        success: function (fileContent) 
                        {
                        	try
                        	{
	                        	var config = JSON.parse(fileContent);
	                        	Editor.configureFontCss(config.fontCss);
	                        	fontsLoaded = true;
								mainBarrier();
                        	}
                        	catch (e)
                        	{
                        		console.log('Configuration error', e);
                        		fontsLoaded = true;
								mainBarrier();	
                        	}
            			},
            			error: function()
						{ 
							fontsLoaded = true;
							mainBarrier();	
						}
	            	});
				}
                else
                {
                	fontsLoaded = true;
					mainBarrier();	
                }
			}, error: function()
			{ 
				fontsLoaded = true;
				mainBarrier();	
			}});
		
		scriptLoaded = true;
		mainBarrier();
	};

	script.src = 'https://connect-cdn.atl-paas.net/all.js';
	script.setAttribute('data-options', 'resize:false;margin:false');
	document.getElementsByTagName('head')[0].appendChild(script);
})();