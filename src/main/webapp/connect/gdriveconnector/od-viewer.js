(function(){
	var lightbox = AC.getUrlParam('lightbox') == '1';
	
	if (lightbox)
	{
		document.body.style.backgroundImage = 'url(/images/drawlogo-text-bottom.svg)';
		document.body.style.backgroundPosition = 'center 30%';
		document.body.style.backgroundSize = '128px';
	}
	
	var connectUrl = AC.getBaseUrl() + '/atlassian-connect';
	var head = document.getElementsByTagName("head")[0];
	
	var script = document.createElement("script");
	
	script.onload = function()
	{
		AC.getCurPageId(function(pageId, draftPage)
		{
			confPageId = pageId;
			isDraft = draftPage;

			main();
		});
	};
	
	script.src = 'https://connect-cdn.atl-paas.net/all.js';
	script.setAttribute('data-options', 'resize:false;margin:false');
	head.appendChild(script);
	
	var link = document.createElement("link");
	link.type = "text/css";
	link.rel = "stylesheet";
	link.href = connectUrl + '/all.css';
	head.appendChild(link);
	
	var confPageId, isDraft;
	
	function showError(errMsg)
	{
		document.body.style.backgroundImage = 'none';
		document.body.innerHTML = '<img src="/mxgraph/images/error.gif" border="0" align="absmiddle"/> ' + 
					AC.htmlEntities(errMsg);
		AP.resize('100%', '20');
	};
	
	function getFileInfoErr(err)
	{
		if (err && (err.status == 403 || err.status == 400)) //400 is returned when a business account file is accessed via a personal account
		{
			showError('Error: Access Denied. You do not have permission to access this file.');
		}
		else 
		{
			showError('Error: Cannot get file information.');
		}
	};
	
	function showDiagram(fileId, driveId, width, height, name, mimeType, autoSize, aspect)
	{
		document.body.innerHTML = '';
		document.body.style.backgroundImage = 'url(/connect/gdriveconnector/spinner.gif)';
		document.body.style.backgroundSize = null;

		AC.getFileInfo(fileId, driveId, function(fileInfo)
		{
			var isPng = fileInfo.file.mimeType == 'image/png';
			var isVsdx = /\.v(dx|sdx?)$/i.test(name);
			
			function cacheAndRender(fileContent, timestamp, filename)
			{
				timestamp = String(timestamp);
				renderDiagram(fileContent);
				
				AC.uploadCachedMxFile(fileContent, timestamp + '_' + filename, AC.noop, AC.noop);
				
				//Delete old cached file
				AC.delOldCachedFiles(confPageId, filename, timestamp);
			};
			
			//TODO This code is shared with Google Drive viewer also, abstract it
			function renderDiagram(resp)
			{
				try 
				{
					if (isPng)
					{
						resp = 'data:image/png;base64,' + Editor.base64Encode (resp);
						resp = AC.extractGraphModelFromPng(resp);
					}
					
					var pageId, layerIds;
					
					if (aspect != null)
					{
						var aspectArray = aspect.split(' ');
						
						if (aspectArray.length > 1)
						{
							pageId = aspectArray[0];
							layerIds = aspectArray.slice(1);
						}
					}
					
					if (lightbox) 
					{
						AP.resize('100%', '100%');
						
						var config = {highlight: '#3572b0', nav: true, lightbox: false,
								pageId: pageId, layerIds: layerIds};
						
						EditorUi.prototype.lightboxToolbarActions = [{icon: Editor.editLargeImage, tooltip: mxResources.get('edit'), fn: function()
						{
							window.open('https://' + window.location.hostname + '/#W' + encodeURIComponent(driveId + '/' + fileId));
						}}];
						
						var viewer = new GraphViewer(null, null, config);
						viewer.lightboxChrome = false;
						viewer.xml = resp;

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
						var refreshImg = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABUAAAAVCAMAAACeyVWkAAAAhFBMVEUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD8qm6wAAAAK3RSTlMABr4XDQoC07pc+/Yq5dzYtaiSjXlkMx4U8u/NwrKZf1gl8eDKb2lOR0Q6/VKNjQAAAKlJREFUGNOtjlcOwjAQBd1jOwnpvdNh738/kuA4iE/EfI1Gu9JD/4RTyr+bNxDHCS8FKp62CXWAlSYj0n6MNZziLOt90EC2OgXQ5osoF/aagr/GgsBeRUpSsUgeSikHbG4xFpssamCU0lIYZVuMDkFw9oxeTaUOgE74e0T1+Ki1wvOl8iHituojVDJJiAuNhwxlG9+Jhhm3sxGJiaFy7MMuvjFksavRD7wAhtIMKUShI2QAAAAASUVORK5CYII=';
						
						var btnDefs = {
							'refresh': {title: 'Refresh',
								image: refreshImg, handler: function()
								{
									showDiagram(fileId, driveId, width, height, name, mimeType, autoSize, aspect);
								}
							}
						};

						var tbHeight = GraphViewer.prototype.toolbarHeight;
						var doc = mxUtils.parseXml(resp);
					
						var container = document.createElement('div');
	
						container.style.cssText = 'position:absolute;max-width:100%;border:1px solid transparent;';
						document.body.appendChild(container);
						
						var config = {highlight: '#3572b0', 'toolbar-position': 'top',
							nav: true, border: 2, title: name, lightbox: true,
							toolbar: 'pages refresh zoom layers lightbox', 'toolbar-buttons': btnDefs,
							pageId: pageId, layerIds: layerIds};
	
						if (!autoSize)
						{
							config['auto-fit'] = true;
							config.resize = false;
						}
						
						var viewer = new GraphViewer(container, doc.documentElement, config);
	
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
							
							var curAspect = pageId + ' ' + layerIds.join(' ');
							
							AP.dialog.create(
			                {
			                    header: name,
		                		key: 'lightbox',
			                    size: 'fullscreen',
			                    customData: {fileId: fileId, driveId: driveId, name: name, width: width, 
			                    	height: height, mimeType: mimeType, aspect: curAspect},
			                    chrome: true
			                });
						};
						
						// Handles resize of iframe after zoom
						var graphDoResizeContainer = viewer.graph.doResizeContainer;
						
						if (!autoSize)
						{
							AP.resize(width, height);
							viewer.graph.doResizeContainer(width, height);
						}
						else
						{
							function updateHeight(height)
							{
								AP.resize('100%', Math.ceil(height) + tbHeight + 4);
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
					}
					
					document.body.style.backgroundImage = 'none';
				}
				catch(e)
				{
					console.log(e);
					showError('File "' + name + '" is corrupted');
				}
			};
			
			function loadFileErr()
			{
				showError('Failed to load OneDrive file "' + name + '"');
			};
			
			var timestamp = new Date(fileInfo.lastModifiedDateTime).getTime();
			
			AP.request({
				url: '/download/attachments/' + confPageId + '/' + encodeURIComponent(timestamp + '_' + fileInfo.name),
				success: renderDiagram,
				error : function() //Not found (e.g, file updated), fetch and cache
				{
					var req = new XMLHttpRequest();
					req.open('GET', fileInfo['@microsoft.graph.downloadUrl']);
					
					if (isVsdx)
					{
						req.responseType = 'blob';
					}
					
					req.onreadystatechange = function()
					{
						if (this.readyState == 4)
						{
							if (this.status >= 200 && this.status <= 299)
							{
								if (isVsdx)
								{
									convertVSDXtoMX(req.response, name, function(content)
									{
										cacheAndRender(content, timestamp, name);
									}, loadFileErr);
								}
								else
								{
									cacheAndRender(req.responseText, timestamp, name);
								}
							}
							else
							{
								loadFileErr();
							}
						}
					};
					
					if (isPng && req.overrideMimeType)
					{
						req.overrideMimeType('text/plain; charset=x-user-defined');
					}
					
					req.send();
				}
			});
		}, getFileInfoErr);
	};
	
	function main() 
	{
		if (lightbox)
		{
			AP.dialog.getCustomData(function (customData) {
				showDiagram(customData.fileId, customData.driveId, customData.width, customData.height, 
						customData.name, customData.mimeType, null, customData.aspect);
	    	});
		}
		else
		{
			var fileId = AC.getUrlParam('fileId');
			var driveId = AC.getUrlParam('driveId');
			var width = AC.getUrlParam('width');
			var height = AC.getUrlParam('height');
			var name = AC.getUrlParam('filename', true);
			var mimeType = AC.getUrlParam('mimeType', true) || '';
			var isDrawio = AC.getUrlParam('isDrawio');
			isDrawio = isDrawio == 'true' || isDrawio == '1';
			var aspect = AC.getUrlParam('aspect', true);
			var autoSize = AC.getUrlParam('autoSize') == '1';
			var embeddedUrl = AC.getUrlParam('embeddedUrl', true);
			
			if (fileId == null || driveId == null)
			{
				showError('Error: Missing File ID');
			}
			else
			{
				if (isDrawio)
				{
					showDiagram(fileId, driveId, width, height, name, mimeType, autoSize, aspect);
				}
				else if (embeddedUrl)
				{
					AP.resize(width, height);
					window.location.href = embeddedUrl;
				}
				else
				{
					AP.resize(width, height);
					AC.getPreviewUrl(fileId, driveId, function(url)
					{
						window.location.href = url;
					}, function()
					{
						showError('Error: Cannot get file preview.');
					});
				}
			}
		}
	};
})();
