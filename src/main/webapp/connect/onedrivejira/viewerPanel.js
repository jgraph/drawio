(function()
{
	var opts =
	{
		lines: 12, // The number of lines to draw
		length: 8, // The length of each line
		width: 3, // The line thickness
		radius: 5, // The radius of the inner circle
		rotate: 0, // The rotation offset
		color: '#000', // #rgb or #rrggbb
		speed: 1, // Rounds per second
		trail: 60, // Afterglow percentage
		shadow: false, // Whether to render a shadow
		hwaccel: false, // Whether to use hardware acceleration
		className: 'spinner', // The CSS class to assign to the spinner
		zIndex: 2e9 // The z-index (defaults to 2000000000)
	};

	var spinner = new Spinner(opts);

	var odNoThumbImg = '/images/onedrive-logo.svg';
	var gdNoThumbImg = '/images/google-drive-logo.svg';
	var attNoThumbImg = '/images/drawlogo-text-bottom.svg';
	
	// Enables dynamic loading of shapes and stencils (same domain)
	mxStencilRegistry.dynamicLoading = true;

	// Specifies connection mode for touch devices (at least one should be true)
	var connectUrl = AC.getBaseUrl() + '/atlassian-connect';
	var head = document.getElementsByTagName('head')[0];
	
	var script = document.createElement('script');
	script.setAttribute('data-options', 'resize:false;margin:false');

	head.appendChild(script);
	
	var link = document.createElement('link');
	link.type = 'text/css';
	link.rel = 'stylesheet';
	link.href = connectUrl + '/all.css';
	head.appendChild(link);
	
	mxResources.loadDefaultBundle = false;
	var bundle = mxResources.getDefaultBundle(RESOURCE_BASE, mxLanguage) ||
		mxResources.getSpecialBundle(RESOURCE_BASE, mxLanguage);

	// Prefetches asynchronous requests so that below code runs synchronous
	// Loading the correct bundle (one file) via the fallback system in mxResources. The stylesheet
	// is compiled into JS in the build process and is only needed for local development.
	var bundleLoaded = false;
	var scriptLoaded = false;
	
	function mainBarrier()
	{
		if (bundleLoaded && scriptLoaded)
		{
			main();
		}
	};
	
	mxUtils.getAll([bundle], function(xhr)
	{
		// Adds bundle text to resources
		mxResources.parse(xhr[0].getText());
		bundleLoaded = true;
		mainBarrier();
	});

	script.onload = function()
	{
		scriptLoaded = true;
		mainBarrier();
	};
	script.src = 'https://connect-cdn.atl-paas.net/all.js';
	
	function main()
	{
		//Create draw.io panel toolbar (currently, we only have "Add Diagram" button)
		var toolbar = document.createElement('div');
		toolbar.style.cssText = "width:99%;height:35px";
		var addFileBtn = document.createElement('button');
		addFileBtn.className = "aui-button connector-add-file";
		mxUtils.write(addFileBtn, mxResources.get('addFile', null, 'Add File'));
		
		addFileBtn.addEventListener('click', function()
		{
			AP.dialog.create(
			{
			   header: 'Add Diagram File', 
			   key: 'oneDriveEditorBlank',
			   width: '80%',
			   height: '60%',
			   chrome: true
			});
		});
		
		toolbar.appendChild(addFileBtn);
		document.body.appendChild(toolbar);
		
		var removeImage = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABUAAAAVAQMAAACT2TfVAAAABlBMVEUAAAAAAAClZ7nPAAAAAXRSTlMAQObYZgAAABlJREFUCNdjQAF/GBj4/x8AYxBg/k80RgYApAUPr950a4AAAAAASUVORK5CYII=';
		var editImage = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABUAAAAVBAMAAABbObilAAAAD1BMVEUAAAAAAAAQEBBycnIgICBqwj3hAAAAAXRSTlMAQObYZgAAADlJREFUCNdjoBwoChrAmCyGggJwYWVBBSiTSVDICKFa0AEuLCiEJKyAX5gBSZgBSZgBKGwMBKQ7HAAWzQSfKKAyBgAAAABJRU5ErkJggg==';
		var issueId = AC.getUrlParam('issueId');
		var serverName = document.referrer;
		var timeout = 25000;
		var index1 = serverName.indexOf('//');
		
		if (index1 > 0)
		{
			var index2 = serverName.indexOf('/', index1 + 2);
			
			if (index2 > index1)
			{
				serverName = serverName.substring(index1 + 2, index2);
			}
		}
		
		// Delayed invocation see below
		function init()
		{
			// Workaround to ignore scrollbars when applying fit to available width in all but FF
			if (!mxClient.IS_FF)
			{
				document.body.style.width = document.documentElement.offsetWidth + 'px';
			}
			
			//TODO is 0px really needed?
			AP.resize('100%', '200px');
			
			AP.request({
				url: '/rest/api/2/issue/' + issueId + '/properties/onedrive-conn-data',
				type: 'GET',
				success: function(resp) 
				{
					var tbHeight = GraphViewer.prototype.toolbarHeight;
					var tiles = [];
					var count = 0;
					var tilesPerRow, tileWidth, tileWidthCss, tileHeightCss, lastWidth;
					
					function showError(container, errMsg)
					{
						container.style.cssText = '';
						container.style.textAlign = 'center';
						container.style.marginTop = tbHeight + 'px';
						container.innerHTML = '<img src="/mxgraph/images/error.gif" border="0" align="absmiddle"/> ' + 
							errMsg;
					};
					
					function updateTileSize()
					{
						tilesPerRow = Math.max(Math.round(document.documentElement.offsetWidth / 250), 1);
						//floor and -1 to avoid IE issues of moving last tile to next row
						tileWidth = Math.floor(document.documentElement.offsetWidth / tilesPerRow) - 1;
						tileWidthCss = tileWidth + "px";
						tileHeightCss = (tileWidth + tbHeight) + "px";
					};
					
					updateTileSize();
					AP.resize('100%', tileWidth + tbHeight + 35);
					 
					function updateHeight()
					{
						lastWidth = document.documentElement.offsetWidth;
						var rows = Math.ceil(tiles.length / tilesPerRow);

						// +5 is needed to include margin, 35 is the panel toolbar height
						var h = tiles.length > 0? rows * (tiles[0].tile.offsetHeight + 5) + 35 : 50;
						
						// Restricts the max sidebar panel height
						var maxH = screen.height * 1.5;
						h = Math.min(maxH, h);
						AP.resize('100%', h);
						
						// Workaround for iframe scrollbars
						document.body.style.height = h + 'px';
						
						document.body.style.overflowY = maxH == h? "auto" : "hidden";
					};
					
					window.addEventListener('resize', function() 
					{
						if (lastWidth != document.documentElement.offsetWidth)
						{
							updateTileSize();
							
							for (var i = 0; i < tiles.length; i++)
							{
								tiles[i].title.style.width = tileWidthCss;

								tiles[i].container.style.width = tileWidthCss;
								tiles[i].container.style.height = tileWidthCss;
								
								tiles[i].tile.style.width = tileWidthCss;
								tiles[i].tile.style.height = tileHeightCss;
							}
							
							updateHeight();
						}
					});

					function finish() 
					{
						count--;
						
		 				if (count == 0) 
		 				{
		 					document.body.style.backgroundImage = 'none';
		 					document.body.style.width = '';
							updateHeight();
		 				}
					};

					function addFileTile(file, attFiles)
					{
						count++;
						var tile = document.createElement('div');
						tile.style.cssText = 'width:' + tileWidthCss + ';height:' + tileHeightCss + ';display:inline-block;overflow: hidden;';							
						document.body.appendChild(tile);
						var container = document.createElement('div');
						container.style.cssText = 'position:relative;box-sizing:border-box;margin-bottom:2px;' +
							'width:' + tileWidthCss + ';height:' + tileWidthCss + ';border:1px solid transparent;display:inline:block;overflow: hidden;';
						
						// Adds filename and tooltip to title
						var title = document.createElement('div');
						var modifiedDate = new Date(file.modifiedDate).toLocaleString();
						mxUtils.write(title, file.name);
						title.setAttribute('title', file.name + ' (' + modifiedDate + ')' + (file.createdBy? ' - ' + file.createdBy : '') +
								(file.lastModifiedBy? ' [Last Modified By: ' + file.lastModifiedBy + ']' : ''));
						title.style.cssText = 'position:relative;box-sizing:border-box;width:' + tileWidthCss + ';padding: 6px 0 0 3px;height:' + tbHeight +
							'px;margin-bottom:-' + tbHeight + 'px;text-align:left;white-space:nowrap;cursor:pointer;overflow:hidden;';
						tile.appendChild(title);					
						tile.appendChild(container);
						tiles.push({tile: tile, container: container, title: title});
						var attId = null;
						
						var refreshImg = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABUAAAAVCAMAAACeyVWkAAAAhFBMVEUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD8qm6wAAAAK3RSTlMABr4XDQoC07pc+/Yq5dzYtaiSjXlkMx4U8u/NwrKZf1gl8eDKb2lOR0Q6/VKNjQAAAKlJREFUGNOtjlcOwjAQBd1jOwnpvdNh738/kuA4iE/EfI1Gu9JD/4RTyr+bNxDHCS8FKp62CXWAlSYj0n6MNZziLOt90EC2OgXQ5osoF/aagr/GgsBeRUpSsUgeSikHbG4xFpssamCU0lIYZVuMDkFw9oxeTaUOgE74e0T1+Ki1wvOl8iHituojVDJJiAuNhwxlG9+Jhhm3sxGJiaFy7MMuvjFksavRD7wAhtIMKUShI2QAAAAASUVORK5CYII=';
						
						var btnDefs = {
							'refresh': {title: mxResources.get('refresh'),
								image: refreshImg, handler: function()
								{
									renderDrawioFile();
								}
							},
							'edit': {title: mxResources.get('edit'), enabled: typeof window.Blob !== 'undefined',
								image: editImage, handler: function()
							{
								//Use the same URL such that no authentication is needed when editing or viewing PNG files
								window.open('https://' + window.location.hostname + 
										(file.service == 'GDrive'? '/#G' + encodeURIComponent(file.id) : '/#W' + encodeURIComponent(file.driveId + '/' + file.id)));
							}},
							'remove': {title: mxResources.get('delete'), image: removeImage, handler: function()
							{
								if (confirm(mxResources.get('removeIt', [file.name]) + '?'))
								{
									AC.removeLink(issueId, file.id, function()
									{
										AP.jira.refreshIssuePage();
									}, function(err)
									{
										alert('Error: ' + (err? err.message : 'Unknown'));
									});
									
									if (attId != null)
									{
										AP.request({
						    	            url: '/rest/api/2/attachment/' + attId,
						    	            type: 'DELETE',
						    	            success: AC.noop,
						    	            error: AC.noop
										});
									}
								}
							}}
						};
						
						if (file.isDrawio)
						{
							function renderDrawioFile()
							{
								spinner.spin(container);

								var acceptResponse = true;
								
								var timeoutThread = window.setTimeout(function()
								{
									acceptResponse = false;
									showError(container, 'The connection has timed out: The server at ' +
											serverName + ' is taking too long to respond.');
		 							finish();
								}, timeout);
								
								var viewDrawioDoc = function(doc, noEdit)
								{
									try
									{
										window.clearTimeout(timeoutThread);
										
								 		if (acceptResponse)
								 		{
								 			var pageId, layerIds;
											
											if (file.aspect != null)
											{
												var aspectArray = file.aspect.split(' ');
												
												if (aspectArray.length > 1)
												{
													pageId = aspectArray[0];
													layerIds = aspectArray.slice(1);
												}
											}
											
											spinner.stop();
											container.innerHTML = '';
											
											var viewer = new GraphViewer(container, doc.documentElement, {highlight: '#3572b0',
												'toolbar-position': 'top', toolbar: (noEdit == true? '' : 'edit ') + 'pages refresh layers lightbox remove', 
												border: 8, 'auto-fit': true, resize: false,
												nav: true, 'toolbar-buttons': btnDefs,
												pageId: pageId, layerIds: layerIds});
											
											// Handles resize of iframe after zoom
											var graphDoResizeContainer = viewer.graph.doResizeContainer;
											
											viewer.graph.doResizeContainer = function(width, height)
											{
												graphDoResizeContainer.apply(this, arguments);
												updateHeight();
											};
											
											// Updates the size of the iframe in responsive cases
											viewer.updateContainerHeight = function(container, height)
											{
												updateHeight();
											};
				
											viewer.showLightbox = function()
											{
												//Create an aspect reflecting current view
												var layerIds = [], pageId = viewer.diagrams[viewer.currentPage].getAttribute('id');
				
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
													
												AP.dialog.create(
												{
								                   header: file.name,
												   key: 'drawioFullScreenViewer',
												   size: 'fullscreen',
												   chrome: true,
												   customData: {fileInfo: file, pageId: pageId, layerIds: layerIds, issueId: issueId, cachedFileId: attId}
												});					
											};
											
											finish();
								 		}
									}
									catch(e)
									{
										showError(container, 'Error: ' + ((e? e.message : '') || 'Unknown'));
										finish();
									}
								};
								
								var getFileErr = function(err)
								{
									//TODO handle errors better
									window.clearTimeout(timeoutThread);
									
							 		if (acceptResponse)
							 		{
										showError(container, 'Error: ' + ((err? err.message : '') || 'Unknown'));
										finish();
							 		}
								};
								
								var getFileInfoErr = function(err)
								{
									//TODO handle errors better
									window.clearTimeout(timeoutThread);
										
							 		if (acceptResponse)
							 		{
										if (err && (err.status == 403 || err.status == 400)) //400 is returned when a business account file is accessed via a personal account
										{
											showError(container, 'Error: Access Denied. You do not have permission to access this file "'+ file.name +'".');
										}
										else
										{
											showError(container, 'Error: ' + ((err? err.message : '') || 'Unknown'));
										}
										
										finish();
							 		}
								};
								
								var tryCachedFile = function(cachedFilename, filename, timestamp, onError)
								{
									var notFound = true;
									
									for (var i = 0; i < attFiles.length; i++)
									{
										if (attFiles[i].filename == cachedFilename)
										{
											notFound = false;
											attId = attFiles[i].id;
											
											AP.request({
												url: '/secure/attachment/' + attFiles[i].id + '/',
												success: function(resp)
												{
													viewDrawioDoc(mxUtils.parseXml(resp));
												},
												error: onError
											});
										}
										else
										{
											var attInfo = attFiles[i].filename.match(/(\d+)_(.*)/);
											
											if (attInfo != null && attInfo[2] == filename && attInfo[1] != timestamp)
											{
												AP.request({
								    	            url: '/rest/api/2/attachment/' + attFiles[i].id,
								    	            type: 'DELETE',
								    	            success: AC.noop,
								    	            error: AC.noop
												});
											}
										}
									}
									
									if (notFound)
									{
										onError();
									}
								};
								
								function cacheAndRender(fileContent, fileDoc, cachedFilename)
								{
									viewDrawioDoc(fileDoc);
									
		        					AC.uploadToJira(fileContent, issueId, cachedFilename, 
		        							'application/vnd.jgraph.mxfile', function(resp)
		        							{
				        						resp = JSON.parse(resp);
				        						attId = resp[0].id;
		        							}, GAC.noop);
								};
								
								if (file.service == 'GDrive')
								{
									GAC.getFileInfo(file.id, function(fileInfo)
									{
										var timestamp = String(new Date(fileInfo.modifiedDate).getTime());
										var cachedFilename = timestamp + '_' + fileInfo.title;
										
										tryCachedFile(cachedFilename, fileInfo.title, timestamp, function()
										{
											if (/\.v(dx|sdx?)$/i.test(fileInfo.title))
											{
												GAC.getBinaryFile(fileInfo, function(blobFile)
												{
													convertVSDXtoMX(blobFile, fileInfo.title, function(xml)
													{
														cacheAndRender(xml, mxUtils.parseXml(xml), cachedFilename);
													}, getFileErr);
												}, getFileErr);
											}
											else
											{
												GAC.getDrawioFileDoc(fileInfo, function(doc, cnt)
												{
													cacheAndRender(cnt, doc, cachedFilename);
												}, getFileErr);
											}
										});
									}, getFileInfoErr);
								}
								else if (file.service == 'AttFile')
								{
									attId = file.id;
									
									AP.request({
										url: '/secure/attachment/' + file.id + '/',
										success: function(resp)
										{
											var isPng = file.mime == 'image/png';
										
											try 
											{
												if (isPng)
												{
													resp = AC.extractGraphModelFromPng(resp);
												}
												
												var doc = mxUtils.parseXml(resp);
												viewDrawioDoc(doc, true);
											}
											catch(e)
											{
												getFileErr();
											}
										},
										error: getFileErr
									});
								}
								else //OneDrive or old format that doesn't have service
								{
									AC.getFileInfo(file.id, file.driveId, function(fileInfo)
									{
										var timestamp = String(new Date(fileInfo.lastModifiedDateTime).getTime());
										var cachedFilename = timestamp + '_' + fileInfo.name;
										
										tryCachedFile(cachedFilename, fileInfo.name, timestamp, function()
										{
											if (/\.v(dx|sdx?)$/i.test(fileInfo.name))
											{
												AC.getBinaryFile(fileInfo, function(blobFile)
												{
													convertVSDXtoMX(blobFile, fileInfo.name, function(xml)
													{
														cacheAndRender(xml, mxUtils.parseXml(xml), cachedFilename);
													}, getFileErr);
												}, getFileErr);
											}
											else
											{
												AC.getDrawioFileDoc(fileInfo, function(doc, cnt)
												{
													cacheAndRender(cnt, doc, cachedFilename);
												}, getFileErr);
											}
										});
									}, getFileInfoErr);
								}
							};
							
							renderDrawioFile();
						}
						else
			 			{
							function viewOtherFiles(getPrevUrl, noThumbImg)
							{
								//This is a hacky way to have the same GraphViewer toolbar with OneDrive thumbnails. Simply by displaying an empty diagram and hiding it.
								var viewer = new GraphViewer(container, 
										mxUtils.parseXml('<mxGraphModel><root><mxCell id="0"/><mxCell id="1" parent="0"/></root></mxGraphModel>').documentElement, 
										{highlight: '#3572b0', 'toolbar-position': 'top', toolbar: 'pages layers lightbox remove', 
										border: 8, 'auto-fit': true, resize: false,
										nav: true, title: file.name, 'toolbar-buttons': btnDefs});
								
								var svg = AC.$('svg', container);
								svg.style.display = 'none';
								
								viewer.showLightbox = function()
								{
									AP.dialog.create(
									{
					                   header: file.name,
									   key: 'oneDriveFullScreenViewer',
									   size: 'fullscreen',
									   chrome: true,
									   customData: {fileInfo: file, issueId: issueId}
									});					
								};
								
								container.addEventListener('click', viewer.showLightbox);
								
								var imgSrc = noThumbImg;
								var img = document.createElement('img');
								var maxDim = tileWidth - 4;
								img.style.cssText = 'vertical-align: middle;max-width: '+ maxDim +'px;max-height: '+ maxDim +'px;';
								container.style.cssText = container.style.cssText + 'line-height: '+ maxDim +'px;text-align: center; margin-top: 30px;'
								
								function defThumbErr() 
								{
									this.onerror = null;
									this.style.width = "46px";
									this.style.height = "46px";
									this.src = noThumbImg;
								};
								
								img.onerror = defThumbErr;
								
								getPrevUrl(function(thumbUrls)
								{
									if (thumbUrls != null)
									{
										if (Array.isArray(thumbUrls) && thumbUrls.length > 0)
										{
											imgSrc = thumbUrls[0];
										
											img.onerror = function() 
											{
												
												var pos = thumbUrls.indexOf(imgSrc) + 1;
												
												if (pos < thumbUrls.length)
												{
													this.src = thumbUrls[pos];
												}
												else
												{
													defThumbErr.call(this);
												}
											};
										}
										else
										{
											imgSrc = thumbUrls;
										}
									}
									
									img.src = imgSrc;
									container.appendChild(img);
	
						 			finish();
								}, function(err)
								{
									if (err && (err.status == 403 || err.status == 400)) //400 is returned when a business account file is accessed via a personal account
									{
										showError(container, 'Error: Access Denied. You do not have permission to access this file "'+ file.name +'".');
									}
									else
									{
										showError(container, 'Error: ' + ((err? err.message : '') || 'Cannot get thumbnail.'));
									}
						 			finish();
								});
				 			};
							
							if (file.service == 'GDrive')
							{
								viewOtherFiles(function(success, error)
								{
									GAC.getFileInfo(file.id, function(fileInfo)
									{
										success(fileInfo.thumbnailLink);
									}, error);
								}, gdNoThumbImg);
							}
							else if (file.service == 'AttFile')
							{
								viewOtherFiles(function(success, error)
								{
									AP.request({
										url: '/secure/attachment/' + file.id + '/',
										success: function(resp)
										{
											success(resp);
										},
										error: error
									});
								}, attNoThumbImg);
							}
							else //OneDrive or old format that doesn't have service
							{
								viewOtherFiles(function(success, error)
								{
									AC.getThumbnailUrl(file.id, file.driveId, function(small, allThumbs)
									{
										if (small != null)
										{
											var thumbUrls = [];
											
											if (allThumbs.large)
											{
												thumbUrls.push(allThumbs.large.url);
											}
											
											if (allThumbs.medium)
											{
												thumbUrls.push(allThumbs.medium.url);
											}

											if (allThumbs.small)
											{
												thumbUrls.push(allThumbs.small.url);
											}
											
											success(thumbUrls);
										}
										else
										{
											success(null);
										}
									}, error);
								}, odNoThumbImg);
							}
			 			}
					};
					
					resp = JSON.parse(resp);
					var linksInfo = resp.value;
		        	var files = [];
		        	var authOneDrive = false, authGDrive = false;
		        	
			        for (var key in linksInfo)
			    	{
			        	var obj = linksInfo[key];
			        	obj.id = key;
			        	files[obj.order] = obj;
			        	
			        	authGDrive |= obj.service == 'GDrive';
			        	authOneDrive |= (obj.service == 'OneDrive' || obj.service == null);
			    	}
			        
			        function viewFiles(attFiles)
			        {
			        	if (authGDrive || authOneDrive) return;
			        	
						for (var i = 0; i < files.length; i++)
						{
							if (files[i] != null) addFileTile(files[i], attFiles);
						}
			        };
			        
					// Shows message if no files are found
					if (files.length == 0)
					{
						mxUtils.write(document.body, mxResources.get('noFiles'));
						document.body.style.backgroundImage = 'none';
						AP.resize('100%', '60px');
					}
					else
					{
						function doViewFiles(attList)
						{
							if (authOneDrive)
							{
								AC.confirmODAuth(function()
								{
									authOneDrive = false;
									viewFiles(attList);
								}, function()
								{
									alert('Error authenticating to OneDrive!'); //TODO better error handling
								});
							}
							
							if (authGDrive)
							{
								GAC.confirmGDAuth(function()
								{
									authGDrive = false;
									viewFiles(attList); 
								},
								function()
								{
									alert('Error authenticating to Google Drive!'); //TODO better error handling
								});
							}
							
							viewFiles(attList);
						};
						
						AC.getJiraAttList(issueId, doViewFiles, function()
						{
							doViewFiles([]); //One error continue without cached files
						});
					}
				},
				error: function() 
				{
					mxUtils.write(document.body, mxResources.get('noFiles'));
					document.body.style.backgroundImage = 'none';
					AP.resize('100%', '60px');
				}
			});
		}; // end of init
		
		// Workaround for collapsed side panel is to delay init until size is not 0
		// NOTE: Since container.offsetWidth is 2 in this case the delayed rendering
		// in the viewer does not triggger. We disable is here to make sure this does
		// not change in case the container width is zero in the future.
		GraphViewer.prototype.checkVisibleState = false;
		
		if (document.documentElement.offsetWidth == 0)
		{
			var listener = function()
			{
				if (document.documentElement.offsetWidth > 0)
				{
					window.removeEventListener('resize', listener);
					init();
				}
			};
			
			window.addEventListener('resize', listener);
		}
		else
		{
			init();
		}
	}
})();