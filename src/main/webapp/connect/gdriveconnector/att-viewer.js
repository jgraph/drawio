(function(){
	var lightbox = AC.getUrlParam('lightbox') == '1';
	
	if (lightbox)
	{
		document.body.style.backgroundImage = 'url(/images/drawlogo-text-bottom.svg)';
		document.body.style.backgroundPosition = 'center 30%';
		document.body.style.backgroundSize = '128px';
	}

	var connectUrl = AC.getBaseUrl() + '/atlassian-connect';
	var head = document.getElementsByTagName('head')[0];
	
	var script = document.createElement('script');
	script.onload = main;
	script.src = 'https://connect-cdn.atl-paas.net/all.js';
	script.setAttribute('data-options', 'resize:false;margin:false');
	head.appendChild(script);

	var link = document.createElement('link');
	link.type = 'text/css';
	link.rel = 'stylesheet';
	link.href = connectUrl + '/all.css';
	head.appendChild(link);
	
	function showError(errMsg)
	{
		document.body.style.backgroundImage = 'none';
		document.body.innerHTML = '<img src="/mxgraph/images/error.gif" border="0" align="absmiddle"/> ' + 
					AC.htmlEntities(errMsg);
		AP.resize('100%', '20');
	};
	
	function viewAttachment(attId, attVer, pageId, width, height, filename, mimeType, autoSize, isDrawio, aspect)
	{
		document.body.innerHTML = '';
		document.body.style.backgroundImage = 'url(/connect/gdriveconnector/spinner.gif)';
		document.body.style.backgroundSize = null;
		
		AP.request({
			url: '/download/attachments/' + pageId + '/' + encodeURIComponent(filename) +
					'?version=' + attVer,
			success: function(resp)
			{
				if (isDrawio)
				{
					var isPng = mimeType == 'image/png';
				
					//TODO This code is shared with Google Drive viewer also, abstract it
					try 
					{
						if (isPng)
						{
							resp = AC.extractGraphModelFromPng(resp);
						}
						
						var viewerPageId, layerIds;
						
						if (aspect != null)
						{
							var aspectArray = aspect.split(' ');
							
							if (aspectArray.length > 1)
							{
								viewerPageId = aspectArray[0];
								layerIds = aspectArray.slice(1);
							}
						}
						
						if (lightbox) 
						{
							AP.resize('100%', '100%');
							
							var config = {highlight: '#3572b0', nav: true, lightbox: false,
									pageId: viewerPageId, layerIds: layerIds};
							
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
										viewAttachment(attId, attVer, pageId, width, height, filename, mimeType, autoSize, isDrawio, aspect);
									}
								}
							};

							var tbHeight = GraphViewer.prototype.toolbarHeight;
							var doc = mxUtils.parseXml(resp);
						
							var container = document.createElement('div');
		
							container.style.cssText = 'position:absolute;max-width:100%;border:1px solid transparent;';
							document.body.appendChild(container);
							
							var config = {highlight: '#3572b0', 'toolbar-position': 'top',
								nav: true, border: 2, title: filename, lightbox: true,
								toolbar: 'pages refresh zoom layers lightbox', 'toolbar-buttons': btnDefs,
								pageId: viewerPageId, layerIds: layerIds};
		
							if (!autoSize)
							{
								config['auto-fit'] = true;
								config.resize = false;
							}
							
							var viewer = new GraphViewer(container, doc.documentElement, config);
		
							viewer.showLightbox = function()
							{
								//Create an aspect reflecting current view
								var layerIds = [], viewerPageId = viewer.diagrams[viewer.currentPage].getAttribute('id');

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
								
								var curAspect = viewerPageId + ' ' + layerIds.join(' ');
								
								AP.dialog.create(
				                {
				                    header: filename,
			                		key: 'DULightbox',
				                    size: 'fullscreen',
				                    customData: {attId: attId, pageId: pageId, filename: filename, attVer: attVer,
				                    	width: width, height: height, mimeType: mimeType, aspect: curAspect},
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
						showError('Attachment file "' + filename + '" is corrupted');
					}
				}
				else
				{
					var img = new Image();
					
					img.onload = function()
					{
						document.body.style.backgroundImage = 'none';
						
						if (!autoSize)
						{
							var s = Math.min(width / img.width, height / img.height);
							
							img.width = s * img.width;
							img.height = s * img.height;
							
							img.style.verticalAlign = 'middle';
							document.body.style.lineHeight = height + 'px';
							document.body.style.textAlign = 'center';

							AP.resize(width, height);
						}
						else
						{
							AP.resize(img.width, img.height);
						}

						document.body.appendChild(img);								
					};
					
					img.onerror = function()
					{
						showError('Attachment file "' + filename + '" is corrupted');
					};

					img.src = resp;
				}
			}, 
			error: function()
			{
				showError('Failed to load attachment file "' + filename + '"');
			}
		});
	};

	function main()
	{
		if (lightbox)
		{
			AP.dialog.getCustomData(function (customData) {
				viewAttachment(customData.attId, customData.attVer, customData.pageId, customData.width, 
						customData.height, customData.filename, customData.mimeType, null, true, customData.aspect);
	    	});
		}
		else
		{
			var pageId = AC.getUrlParam('pageId');
			var attId = AC.getUrlParam('attId');
			var attVer = AC.getUrlParam('attVer');
			var width = AC.getUrlParam('width');
			var height = AC.getUrlParam('height');
			var filename = AC.getUrlParam('filename', true);
			var mimeType = AC.getUrlParam('mimeType', true) || '';
			var isDrawio = AC.getUrlParam('isDrawio') == '1';
			var aspect = AC.getUrlParam('aspect', true);
			var autoSize = AC.getUrlParam('autoSize') == '1';
		
			if (attId == null || attVer == null)
			{
				showError('Error: Missing File ID');
			}
			else
			{
				viewAttachment(attId, attVer, pageId, width, 
						height, filename, mimeType, autoSize, isDrawio, aspect);
			}
		}
	}	
})();