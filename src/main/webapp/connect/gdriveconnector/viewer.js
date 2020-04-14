(function()
{
	var lightbox = GAC.getUrlParam('lightbox') == '1';
	
	if (lightbox)
	{
		document.body.style.backgroundImage = 'url(/images/drawlogo-text-bottom.svg)';
		document.body.style.backgroundPosition = 'center 30%';
		document.body.style.backgroundSize = '128px';
	}
	
	var connectUrl = GAC.getBaseUrl() + '/atlassian-connect';
	var head = document.getElementsByTagName("head")[0];
	
	var script = document.createElement('script');
	
	script.onload = function()
	{
		GAC.getPageInfo(function(pageId, draftPage)
		{
			confPageId = pageId;
			isDraft = draftPage;

			main();
		});
	};
	
	script.src = 'https://connect-cdn.atl-paas.net/all.js';
	script.setAttribute('data-options', 'resize:false;margin:false');
	head.appendChild(script);
	
	var link = document.createElement('link');
	link.type = 'text/css';
	link.rel = 'stylesheet';
	link.href = connectUrl + '/all.css';
	head.appendChild(link);
	
	var diagramMimeTypes = 'application/mxe,application/vnd.jgraph.mxfile,' +
		'application/mxr,application/vnd.jgraph.mxfile.realtime,' +
		'application/vnd.jgraph.mxfile.rtlegacy';
	
	var formsMimeType = 'application/vnd.google-apps.form';
	var folderMimeType = 'application/vnd.google-apps.folder';
	
	var confPageId, isDraft;
	
	function showError(errMsg)
	{
		document.body.style.backgroundImage = 'none';
		document.body.innerHTML = '<img src="/mxgraph/images/error.gif" border="0" align="absmiddle"/> ' + 
			errMsg;
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
	
	function showDiagram(fileId, width, height, name, mimeType, autoSize, macroVer, aspect)
	{
		document.body.innerHTML = '';
		document.body.style.backgroundImage = 'url(/connect/gdriveconnector/spinner.gif)';
		document.body.style.backgroundSize = null;
		
		GAC.getFileInfo(fileId, function(fileInfo)
		{
			var isPng = fileInfo.mimeType == 'image/png';
			
			function cacheAndRender(fileContent, timestamp, filename)
			{
				timestamp = String(timestamp);
				renderDiagram(fileContent);
				
				GAC.uploadCachedMxFile(fileContent, timestamp + '_' + filename, GAC.noop, GAC.noop);
				
				//Delete old cached file
				GAC.delOldCachedFiles(confPageId, filename, timestamp);
			};
			
			function renderDiagram(resp)
			{
				try
				{
					if (isPng)
					{
						resp = 'data:image/png;base64,' + Editor.base64Encode (resp);
						resp = GAC.extractGraphModelFromPng(resp);
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
							window.open('https://' + window.location.hostname + '/#G' + encodeURIComponent(fileId));
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
									showDiagram(fileId, width, height, name, mimeType, autoSize, macroVer, aspect);
								}
							}
						};
						var tbHeight = GraphViewer.prototype.toolbarHeight;
						var doc = mxUtils.parseXml(resp);
					
						var container = document.createElement('div');
	
						container.style.cssText = 'position:absolute;max-width:100%;border:1px solid transparent;';
						document.body.appendChild(container);
						
						var config = {highlight: '#3572b0', 'toolbar-position': 'top',
							nav: true, border: 8, title: name, lightbox: true,
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
		                		key: 'GDLightbox',
			                    size: 'fullscreen',
			                    customData: {fileId: fileId, name: name, width: width, height: height, mimeType: mimeType, macroVer: macroVer, aspect: curAspect},
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
				}
				catch(e)
				{
					console.log(e);
					showError('File "' + name + '" is corrupted');
				}
				
				document.body.style.backgroundImage = 'none';
			};
			
			function loadFileErr()
			{
				showError('Failed to load Google Drive file "' + name + '"');
			};
			
			var timestamp = new Date(fileInfo.modifiedDate).getTime();
			
			AP.request({
				url: '/download/attachments/' + confPageId + '/' + encodeURIComponent(timestamp + '_' + fileInfo.title),
				success: renderDiagram,
				error : function() //Not found (e.g, file updated), fetch and cache
				{
					if (/\.v(dx|sdx?)$/i.test(name))
					{
						GAC.getBinaryFile(fileInfo, function(blobFile)
						{
							convertVSDXtoMX(blobFile, name, function(content)
							{
								cacheAndRender(content, timestamp, name);
							}, loadFileErr);
						}, loadFileErr);
					}
					else
					{
						GAC.doAuthRequestPlain(fileInfo['downloadUrl'], 'GET', null, function(req)
						{
							cacheAndRender(req.responseText, timestamp, name);
						}, loadFileErr, null, isPng);
					}
				}
			});
		}, getFileInfoErr);
	};
	
	function main() 
	{
		if (lightbox)
		{
			AP.dialog.getCustomData(function (customData) {
				showDiagram(customData.fileId, customData.width, customData.height, customData.name, 
						customData.mimeType, null, customData.macroVer, customData.aspect);
	    	});
		}
		else
		{
			var fileId = GAC.getUrlParam('fileId');
			var width = GAC.getUrlParam('width');
			var height = GAC.getUrlParam('height');
			var name = GAC.getUrlParam('filename', true);
			var mimeType = GAC.getUrlParam('mimeType', true);
			var isDrawio = GAC.getUrlParam('isDrawio') == '1';
			var aspect = GAC.getUrlParam('aspect', true);
			var autoSize = GAC.getUrlParam('autoSize') == '1';
			var macroVer = GAC.getUrlParam('macroVer');
		
			if (fileId == null)
			{
				showError('Error: Missing File ID');
			}
			else if (macroVer == 2)
			{
				if (isDrawio || /\.v(dx|sdx?)$/i.test(name))
				{
					showDiagram(fileId, width, height, name, mimeType, autoSize, macroVer, aspect);
				}
				else
				{
					AP.resize(width, height);
					GAC.getFileInfo(fileId, function(fileInfo)
					{
						window.location.href = fileInfo.embedLink;
					}, getFileInfoErr);
				}
			}
			else
			{
				// Forces reload of document to override browser cache
				var nocache = 't=' + new Date().getTime();
				var url = null;
						
				if (mimeType == 'image')
				{
					document.body.style.backgroundImage = 'none';
					document.body.innerHTML = '<img width="100%" src="' + decodeURIComponent(fileId) +
						'" border="0"/>';
				}
				else if (mimeType == 'thumb')
				{
					document.body.style.backgroundImage = 'none';
					document.body.innerHTML = '<a target="_blank" href="' + decodeURIComponent(name) +
						'"><img width="100%" src="' + decodeURIComponent(fileId) + '" border="0"/></a>';
				}
				else
				{
					var drawioFile = diagramMimeTypes.indexOf(mimeType) > -1 || (name != null &&
						(/(\.xml)($|\?)/i.test(name) || /(\.drawio)($|\?)/i.test(name)));
					
					if (drawioFile || mimeType == 'application/json' || mimeType == 'application/octet-stream' ||
						(name != null && (/(\.v(dx|sdx?))($|\?)/i.test(name) || /(\.gliffy)($|\?)/i.test(name))))
					{
						// Uses public file URL, fallback implemented in editor
						var pubUrl = encodeURIComponent('https://drive.google.com/uc?id=' + fileId + '&export=download');
						var editUrl = (drawioFile) ? encodeURIComponent('https://www.draw.io/#G' + fileId) : '_blank';
						
						url = 'https://www.draw.io/?lightbox=1&toolbar-config=%7B"refreshBtn"%3Atrue%2C"fullscreenBtn"%3Atrue%2C"closeBtn"%3Atrue%7D&layers=1&' +
							'edit=' + editUrl + ((name != null) ? ('&template-filename=' + encodeURIComponent(name)) : '') + '#U' + pubUrl;
					}
					else if (mimeType == formsMimeType)
					{
						url = 'https://docs.google.com/forms/d/' + fileId + '/viewform?' + nocache;
					}
					else if (mimeType == folderMimeType)
					{
						// Possible view options are #list and #grid
						url = 'https://drive.google.com/embeddedfolderview?id=' + fileId + '&authuser=0&' + nocache + '#list';
					}
					else if (mimeType == 'url')
					{
						url = decodeURIComponent(fileId);
					}
					else 
					{
						url = 'https://drive.google.com/file/d/' + fileId + '/preview?authuser=0&' + nocache;
					}
					
					window.location.href = url;
				}
			}
		}
	};
})();