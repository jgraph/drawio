(function()
{
	// Enables dynamic loading of shapes and stencils (same domain)
	mxStencilRegistry.dynamicLoading = true;

	// Specifies connection mode for touch devices (at least one should be true)
	var connectUrl = getBaseUrl() + '/atlassian-connect';
	var head = document.getElementsByTagName("head")[0];
	
	var script = document.createElement("script");
	script.setAttribute('data-options', 'resize:false;margin:false');

	head.appendChild(script);
	
	var link = document.createElement("link");
	link.type = "text/css";
	link.rel = "stylesheet";
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
		var glanceMode = getUrlParam('glance') == '1';
		
		//Create draw.io panel toolbar (currently, we only have "Add Diagram" button)
		var toolbar = document.createElement('div');
		toolbar.style.cssText = "width:100%;height:35px";
		var addDiagramBtn = document.createElement('button');
		addDiagramBtn.className = "aui-button drawio-add-diagram";
		mxUtils.write(addDiagramBtn, mxResources.get('addDiagram', null, 'Add Diagram'));
		
		addDiagramBtn.addEventListener('click', function()
		{
			AP.dialog.create(
			{
			   key: 'drawioEditor',
			   width: '100%',
			   height: '100%',
			   chrome: false
			});
		});
		
		toolbar.appendChild(addDiagramBtn);

		//FIXME Jira open the dialog with incorrect body size (body size is 100% while viewport is the correct size!
//		var embedDiagramBtn = document.createElement('button');
//		embedDiagramBtn.className = "aui-button drawio-add-diagram";
//		mxUtils.write(embedDiagramBtn, mxResources.get('embedDiagram', null, 'Embed Diagram'));
//		
//		embedDiagramBtn.addEventListener('click', function()
//		{
//			AP.dialog.create(
//			{
//			   key: 'embedDiagram',
//			   width: '70%',
//			   height: '70%',
//			   chrome: true
//			});
//		});
//		
//		toolbar.appendChild(embedDiagramBtn);
		document.body.appendChild(toolbar);
		
		var editImage = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABUAAAAVBAMAAABbObilAAAAD1BMVEUAAAAAAAAQEBBycnIgICBqwj3hAAAAAXRSTlMAQObYZgAAADlJREFUCNdjoBwoChrAmCyGggJwYWVBBSiTSVDICKFa0AEuLCiEJKyAX5gBSZgBSZgBKGwMBKQ7HAAWzQSfKKAyBgAAAABJRU5ErkJggg==';
		var removeImage = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABUAAAAVAQMAAACT2TfVAAAABlBMVEUAAAAAAAClZ7nPAAAAAXRSTlMAQObYZgAAABlJREFUCNdjQAF/GBj4/x8AYxBg/k80RgYApAUPr950a4AAAAAASUVORK5CYII=';
		var issueId = getUrlParam('issueId');
		var serverName = getBaseUrl();
		var timeout = 25000;
		var index1 = serverName.indexOf('//');
		var updateTiles, updateHeight;
		
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
			
			AP.resize('100%', '200px');
			
			var embeddedDiagrams = null;
			var attDiagrams = null;
			var allAttachments = null;
			var diagInfoMap = {};
			
			AP.request({
	   	        url: "/rest/api/2/issue/" + issueId + "/properties/drawio-metadata",
	   	        type: "GET",
	   	        success: function(resp)
	   	        {
	   	        	resp = JSON.parse(resp);
	   	            var diagramsInfo = resp.value;
	   	         	embeddedDiagrams = [];
	   	         
		   	        if (diagramsInfo.embeddedDiagrams != null)
	   	        	{
		   	        	embeddedDiagrams = diagramsInfo.embeddedDiagrams;
	   	        	}
		   	        
		   	        if (diagramsInfo.other != null)
	   	        	{
		   	        	for (var i = 0; i < diagramsInfo.name.length; i++)
	   	        		{
		   	        		diagInfoMap[diagramsInfo.name[i]] = diagramsInfo.other[i];
	   	        		}
	   	        	}
		   	        
		   	     	checkDone();
	   	        },
	   	        error : function()
	   	        {
	   	        	embeddedDiagrams = [];
	   	        	checkDone();
	   	        }
	   	    });
			
			//keeping the block of AP.require to minimize the number of changes!
			{
				AP.request({
					url: '/rest/api/2/issue/' + issueId + '?fields=attachment',
					type: 'GET',
					success: function(resp) 
					{
						var respObj = JSON.parse(resp);
						attDiagrams = [];
						allAttachments = [];
						
						for (var i = 0; i < respObj.fields.attachment.length; i++)
						{
							var attachment = respObj.fields.attachment[i];
							allAttachments.push(attachment);
							
							if (attachment.mimeType == 'application/drawio')
							{
								attachment.createDate = new Date(attachment.created.replace("+0000", "+00:00")); //The replace is needed for IE11
								attDiagrams.push(attachment);	
							}
						}

						//sort diagrams by date
						attDiagrams.sort(function(a,b)
						{
							return b.createDate - a.createDate;
						});
						
						checkDone();
					},
					error: function() 
					{
						attDiagrams = [];
						allAttachments = [];
						checkDone();
					}
				});
				
				function checkDone()
				{
					if (embeddedDiagrams != null && attDiagrams != null)
					{
						var tbHeight = GraphViewer.prototype.toolbarHeight;
						var tiles = [];
						var count = 0;
						var tilesPerRow, tileWidth, tileWidthCss, tileHeightCss, lastWidth;
						
						function showError(container, errMsg)
						{
							container.style.cssText = '';
							container.className = '';
							container.style.textAlign = 'center';
							container.style.color = 'red';
							container.style.marginTop = tbHeight + 'px';
							container.innerHTML = '<img src="/mxgraph/images/error.gif" border="0" align="absmiddle"/> ' + 
								errMsg;
						};
						
						function updateTileSize()
						{
							var dim = getDocDim();
							
							if (glanceMode)
							{
								tilesPerRow = 1; //one per row is good as size is predefined and we have all the area
								tileWidth = dim.w - 20; //potential scrollbar width (usually 17px)
							}
							else 
							{
								tilesPerRow = Math.max(Math.round(dim.w / 250), 1);
								//floor and -1 to avoid IE issues of moving last tile to next row
								tileWidth = Math.floor(dim.w / tilesPerRow) - 1;
							}

							tileWidthCss = tileWidth + "px";
							tileHeightCss = (tileWidth + tbHeight) + "px";
						};
						
						updateTileSize();
						AP.resize('100%', tileWidth + tbHeight + 35);
						
						updateHeight = function ()
						{
							var dim = getDocDim();
							
							lastWidth = dim.w;
							var rows = Math.ceil(tiles.length / tilesPerRow);

							// +5 is needed to include margin, 35 is the panel toolbar height
							var h = rows == 0? 30 : rows * (tiles[0].tile.offsetHeight + 5) + 50;
							
							// Restricts the max sidebar panel height
							var maxH = screen.height * 1.5;
							
							//In right panel, no need to set max as the size is automatically controlled by Jira. This avoids double scrollbars
							if (!glanceMode) 
							{
								h = Math.min(maxH, h);
							}
							else
							{
								h += 150; //To have the last viewer visible especially in the issue viewer	
							}
							
							AP.resize('100%', h);
							
							// Workaround for iframe scrollbars
							document.body.style.height = h + 'px';
							
							if (glanceMode)
							{
								document.body.style.width = (tileWidth * tilesPerRow) + 'px';
							}
							
							document.body.style.overflowY = (!glanceMode && maxH == h)? "auto" : "hidden";
						};
						
						updateTiles = function() 
						{
							var dim = getDocDim();
							
							if (lastWidth != dim.w)
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
								
								return true;
							}
							
							return false;
						};
						
						//TODO FIXME Jira resize is not stable now, the panel is not resized in issues viewer unless it is closed, then open 
						//In glance mode, resize handler cause many issues and it is not actually needed!
						if (!glanceMode)
						{
							window.addEventListener('resize', updateTiles);
						}

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
	
						function loadDiagram(value)
						{
							var attId = null;
							count++;
							var tile = document.createElement('div');
							tile.style.cssText = 'width:' + tileWidthCss + ';height:' + tileHeightCss + ';display:inline-block;overflow: hidden;';							
							document.body.appendChild(tile);
							
							var container = document.createElement('div');
							container.style.cssText = 'position:relative;box-sizing:border-box;margin-bottom:2px;' +
								'width:' + tileWidthCss + ';height:' + tileWidthCss + ';border:1px solid transparent;overflow: hidden;'; 
							container.className = 'loading';
							
							//Find displayName
							value.displayName = value.filename || value.displayName || value.diagramName;
							
							// Adds filename and ID to side panel
							var title = document.createElement('div'), createDate = null;
							
							function setTitle()
							{
								title.innerHTML = '';
								
								if (value.createDate != null)
								{
									createDate = value.createDate.toLocaleString();
									mxUtils.write(title, value.filename + ' (' + createDate + ')');
									var displayName = value.author != null ? value.author.displayName : '';
									title.setAttribute('title', value.filename + ' (' + createDate + ') - ' + displayName +
											' [ID: ' + value.id + ']');
								}
								else
								{
									var t = value.displayName || value.diagramName;
									mxUtils.write(title, t);
									var modifiedDate = value.modifiedDate? ' (' + new Date(value.modifiedDate).toLocaleString() + ')' : '';
									title.setAttribute('title', t + modifiedDate + (value.createdBy? ' - ' + value.createdBy : '') +
											(value.lastModifiedBy? ' [Last Modified By: ' + value.lastModifiedBy + ']' : ''));
								}
							};
							
							setTitle();
							title.style.cssText = 'position:relative;box-sizing:border-box;width:' + tileWidthCss + ';padding: 6px 0 0 3px;height:' + tbHeight +
								'px;margin-bottom:-' + tbHeight + 'px;text-align:left;white-space:nowrap;cursor:pointer;overflow:hidden;';
							tile.appendChild(title);					
							tile.appendChild(container);
							tiles.push({tile: tile, container: container, title: title});
							var acceptResponse = true;
							
							var timeoutThread = window.setTimeout(function()
							{
								acceptResponse = false;
								
								showError(container, 'The connection has timed out: The server at ' +
										serverName + ' is taking too long to respond.');
	 							finish();
							}, timeout);
							
							function renderDiagram(xml)
							{
						 		window.clearTimeout(timeoutThread);
								
						 		if (acceptResponse)
						 		{
						 			var pageId, layerIds;
						 			
						 			var aspect = value.aspect || (diagInfoMap[value.filename] != null? diagInfoMap[value.filename].aspect : null);
									
									if (aspect != null)
									{
										var aspectArray = aspect.split(' ');
										
										if (aspectArray.length > 1)
										{
											pageId = aspectArray[0];
											layerIds = aspectArray.slice(1);
										}
									}
									
									container.innerHTML = '';
									
									var doc = typeof xml === 'string'? mxUtils.parseXml(xml) : xml;
		
									var btnDefs = {
										'edit': {title: mxResources.get('edit'), enabled: typeof window.Blob !== 'undefined',
											image: editImage, handler: function()
										{
											AP.dialog.create(
											{
											   key: 'drawioEditor',
											   width: '100%',
											   height: '100%',
											   chrome: false,
											   customData : {diagramName: value.filename, diagramId: value.id, page: viewer.currentPage, diagInfo: diagInfoMap[value.filename]}
											});
											
											//TODO Edit for service based files??
										}},
										'remove': {title: mxResources.get('delete'), image: removeImage, handler: function()
										{
											if (confirm(mxResources.get('removeIt', [value.displayName]) + '?'))
											{
												if (value.diagramUrl != null || value.service != null)
												{
													var doDelete = function(resp)
											   	    {
										   	        	resp = JSON.parse(resp);
										   	            var diagramsInfo = resp.value;
											   	        
											   	        if (diagramsInfo.embeddedDiagrams != null)
										   	        	{
											   	        	var list = diagramsInfo.embeddedDiagrams;
											   	        	var found = false;
											   	        	
											   	        	for (var i = 0; i < list.length; i++)
										   	        		{
											   	        		if (list[i].diagramUrl == value.diagramUrl && list[i].diagramName == value.diagramName)
										   	        			{
											   	        			list.splice(i, 1);
											   	        			found = true;
											   	        			break;
										   	        			}
										   	        		}
											   	        	
											   	        	if (found)
											   	        	{
											   	        		if (diagramsInfo.id == null)
										   	        			{
											   	        			diagramsInfo.id = [];
										   	        			}
											   	        		
													   	     	//Glance counter properties
													   	     	AP.request({
													   	            url: "/rest/api/2/issue/" + issueId + "/properties/com.atlassian.jira.issue:com.mxgraph.jira.plugins.drawio:drawioViewerGlance:status",
													   	            type: "PUT",
													   	            data: JSON.stringify({ type: 'badge', value: { label: String(diagramsInfo.id.length + diagramsInfo.embeddedDiagrams.length) } }),
													   	            contentType: "application/json"
													   	        });
										
													   	     	AP.request({
													   	            url: "/rest/api/2/issue/" + issueId + "/properties/drawio-metadata",
													   	            type: "PUT",
													   	            data: JSON.stringify(diagramsInfo),
													   	            contentType: "application/json",
													   	            success: function()
													   	            {
														   	        	AP.jira.refreshIssuePage();
													   	            },
													   	            error : function()
													   	            {
													   	            	alert('Remove failed, please try again later.');
													   	            }
													   	        });
											   	        	}
											   	        	else
										   	        		{
											   	        		alert('Diagram not found.');
											   	        		
												   	        	AP.jira.refreshIssuePage();
										   	        		}
										   	        	}
											   	        else
										   	        	{
											   	        	alert('Unexpected Error.');
										   	        	}
											   	    };
														
											   	    AP.request({
											   	        url: "/rest/api/2/issue/" + issueId + "/properties/drawio-metadata",
											   	        type: "GET",
											   	        success: doDelete,
											   	        error : function() 
											   	        {
											   	        	alert('Unexpected Error, please try again later.')
											   	        }
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
												else
												{
													AP.request({
									    	            url: '/rest/api/2/attachment/' + value.id,
									    	            type: 'DELETE',
									    	            success: function()
									    	            {
									    	            	AP.request({
													   	        url: "/rest/api/2/issue/" + issueId + "/properties/drawio-metadata",
													   	        type: "GET",
													   	        success: function(resp)
														   	    {
													   	        	resp = JSON.parse(resp);
													   	            var diagramsInfo = resp.value;
														   	        
														   	        if (diagramsInfo.id != null)
													   	        	{
														   	        	var list = diagramsInfo.id;
														   	        	var found = false;
														   	        	
														   	        	for (var i = 0; i < list.length; i++)
													   	        		{
														   	        		if (list[i] == value.id)
													   	        			{
														   	        			list.splice(i, 1);
														   	        			diagramsInfo.name.splice(i, 1);
														   	        			diagramsInfo.txtContent.splice(i, 1);
																   	        	diagramsInfo.updated.splice(i, 1);
														   	        			found = true;
														   	        			break;
													   	        			}
													   	        		}
														   	        	
														   	        	if (diagramsInfo.id.length == 0)
													   	        		{
														   	        		diagramsInfo.hasDiagram = 0;
													   	        		}
														   	        	
														   	        	if (found)
														   	        	{
														   	        		if (diagramsInfo.embeddedDiagrams == null)
													   	        			{
														   	        			diagramsInfo.embeddedDiagrams = [];
													   	        			}

																   	     	//Glance counter properties
																   	     	AP.request({
																   	            url: "/rest/api/2/issue/" + issueId + "/properties/com.atlassian.jira.issue:com.mxgraph.jira.plugins.drawio:drawioViewerGlance:status",
																   	            type: "PUT",
																   	            data: JSON.stringify({ type: 'badge', value: { label: String(diagramsInfo.id.length + diagramsInfo.embeddedDiagrams.length) } }),
																   	            contentType: "application/json"
																   	        });
													
																   	     	AP.request({
																   	            url: "/rest/api/2/issue/" + issueId + "/properties/drawio-metadata",
																   	            type: "PUT",
																   	            data: JSON.stringify(diagramsInfo),
																   	            contentType: "application/json",
																   	            success: function()
																   	            {
																	   	        	AP.jira.refreshIssuePage();
																   	            },
																   	            error : function()
																   	            {
																   	            	AP.jira.refreshIssuePage();
																   	            }
																   	        });
														   	        	}
														   	        	else
													   	        		{
															   	        	AP.jira.refreshIssuePage();
													   	        		}
													   	        	}
														   	    },
													   	        error : function() 
													   	        {
													   	        	AP.jira.refreshIssuePage();
													   	        }
													   	    });
									    	            },
									    	            error : function()
									    	            {
									    	            	AP.jira.refreshIssuePage();
									    	            }
									    	        });
												}
											}
										}}
									};
									
									var viewer = new GraphViewer(container, doc.documentElement, {highlight: '#3572b0',
										'toolbar-position': 'top', toolbar: (value.diagramUrl != null || value.service != null? '' : 'edit ') +
										'pages layers lightbox remove', border: 8, 'auto-fit': true, resize: false,
										pageId: pageId, layerIds: layerIds,
										nav: true, title: value.displayName, 'toolbar-buttons': btnDefs});
									
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
						                   header: value.displayName + (createDate? ' (' + createDate + ')' : ''),
										   key: 'drawioFullScreenViewer',
						                   size: 'fullscreen',
										   chrome: true,
										   customData: {diagramUrl: value.diagramUrl, diagramName: value.displayName, 
											   diagramId: value.id || attId, pageId: pageId, layerIds: layerIds, diagInfo: value}
										});					
									};

									finish();
						 		}
							};
							
							// Loads attachment content
							if (value.diagramUrl != null)
							{
								 var xhr = new XMLHttpRequest();
						 		 xhr.open('GET', value.diagramUrl);
						 		
						 		 xhr.onreadystatechange = function()
						 		 {
						 			if (xhr.readyState == 4)
						 			{	
						 				if (xhr.status >= 200 && xhr.status <= 299)
										{
						 					renderDiagram(xhr.responseText);
										}
						 				else
					 					{
											showError(container, 'Error: Cannot fetch diagram "' + value.diagramName + '"');
											finish();
					 					}
						 			}
						 		 };
						 		
						 		 xhr.send();
							}
							else if (value.service != null)
							{
								var tryCachedFile = function(prefix, postfix, nameDiff, onError)
								{
									var notFound = true;
									
									for (var i = 0; i < allAttachments.length; i++)
									{
										var attInfo = allAttachments[i].filename.match(/(\d+_)(\d+-)?(.*)/);
										
										if (attInfo != null && attInfo[3] == postfix && (nameDiff == null || (attInfo[2] == nameDiff + '-')))
										{
											if (attInfo[1] != prefix)
											{
												AP.request({
								    	            url: '/rest/api/2/attachment/' + allAttachments[i].id,
								    	            type: 'DELETE',
								    	            success: AC.noop,
								    	            error: AC.noop
												});
											}
											else
											{
												notFound = false;
												attId = allAttachments[i].id;
												
												AP.request({
													url: '/secure/attachment/' + attId + '/',
													success: renderDiagram,
													error: onError
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
									renderDiagram(fileDoc);
									
		        					AC.uploadToJira(fileContent, issueId, cachedFilename, 
		        							'application/vnd.jgraph.mxfile', function(resp)
		        							{
				        						resp = JSON.parse(resp);
				        						attId = resp[0].id;
		        							}, GAC.noop);
								};
								
								var getFileErr = function(err)
								{
									window.clearTimeout(timeoutThread);
									
							 		if (acceptResponse)
							 		{
										showError(container, 'Error: ' + ((err? err.message : '') || 'Unknown'));
										finish();
							 		}
								};
								
								var getFileInfoErr = function(err)
								{
									window.clearTimeout(timeoutThread);
										
							 		if (acceptResponse)
							 		{
										if (err && (err.status == 403 || err.status == 400)) //400 is returned when a business account file is accessed via a personal account
										{
											showError(container, 'Error: Access Denied. You do not have permission to access this file.');
										}
										else
										{
											showError(container, 'Error: ' + ((err? err.message : '') || 'Unknown'));
										}
										
										finish();
							 		}
								};
								
								if (value.service == 'GDrive')
								{
									GAC.getFileInfo(value.sFileId, function(fileInfo)
									{
										var prefix = new Date(fileInfo.modifiedDate).getTime() + '_';
										var postfix = 'G' + fileInfo.id;
										value.displayName = fileInfo.title;
										setTitle();
										
										tryCachedFile(prefix, postfix, value.nameDiff, function()
										{
											GAC.getDrawioFileDoc(fileInfo, function(doc, cnt)
											{
												cacheAndRender(cnt, doc, prefix + (value.nameDiff? value.nameDiff + '-' : '') + postfix);
											}, getFileErr);
										});
									}, getFileInfoErr);
								}
								else if (value.service == 'AttFile')
								{
									attId = value.cacheAttId;
									
									AP.request({
										url: '/secure/attachment/' + attId + '/',
										success: function(resp)
										{
											var isPng = value.mime == 'image/png';
										
											try 
											{
												if (isPng)
												{
													resp = AC.extractGraphModelFromPng(resp);
												}
												
												renderDiagram(resp);
											}
											catch(e)
											{
												getFileErr();
											}
										},
										error: getFileErr
									});
								}
								else if (value.service == 'OneDrive')
								{
									AC.getFileInfo(value.sFileId, value.odriveId, function(fileInfo)
									{
										var prefix = new Date(fileInfo.lastModifiedDateTime).getTime() + '_';
										var postfix = 'W' + fileInfo.id;
										value.displayName = fileInfo.name;
										setTitle();
										
										tryCachedFile(prefix, postfix, value.nameDiff, function()
										{
											AC.getDrawioFileDoc(fileInfo, function(doc, cnt)
											{
												cacheAndRender(cnt, doc, prefix + (value.nameDiff? value.nameDiff + '-' : '') + postfix);
											}, getFileErr);
										});
									}, getFileInfoErr);
								}
							}
							else
							{
								AP.request({
									url: '/secure/attachment/' + value.id + '/',
									success: renderDiagram,
									error: mxUtils.bind(this,  function(err, statusText, exc) 
									{
								 		window.clearTimeout(timeoutThread);
										
								 		if (acceptResponse)
								 		{
											showError(container, 'Error: ' + err.status);
											finish();
								 		}
								    })
								});
							}
						};
						
						for (var i = 0; i < attDiagrams.length; i++)
						{
							loadDiagram(attDiagrams[i]);
						}
						
						for (var i = 0; i < embeddedDiagrams.length; i++)
						{
							loadDiagram(embeddedDiagrams[i]);
						}
						
						// Shows message if no files are found
						if (count == 0)
						{
							mxUtils.write(document.body, mxResources.get('noFiles'));
							document.body.style.backgroundImage = 'none';
							AP.resize('100%', '60px');
						}
					}
				};
			};
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
		
		AP.events.on('ISSUE_GLANCE_OPENED', function() 
		{
			AP.resize('100%', '0px');
			
			setTimeout(function() 
			{
				if (updateTiles && !updateTiles())
					updateHeight();
			}, 1000); //Size take about half a second to stabilize (finish the animation)
	  	});
	}
})();