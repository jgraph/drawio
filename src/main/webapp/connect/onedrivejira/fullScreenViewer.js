(function()		
{
	// Enables dynamic loading of shapes and stencils (same domain)
	mxStencilRegistry.dynamicLoading = true;

	// Specifies connection mode for touch devices (at least one should be true)
	var connectUrl = AC.getBaseUrl() + '/atlassian-connect';
	var head = document.getElementsByTagName('head')[0];
	
	var script = document.createElement('script');
	script.setAttribute('data-options', 'resize:false;margin:false');
	
	head.appendChild(script);
	
	var link = document.createElement('link');
	link.type = "text/css";
	link.rel = "stylesheet";
	link.href = connectUrl + '/all.css';
	head.appendChild(link);
	
	function main()
	{
		AP.resize('100%', '100%');
		
		function doMain(customData)
		{
			var fileInfo = customData.fileInfo;
			var issueId = customData.issueId;
			var cachedFileId = customData.cachedFileId;
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
	    	
			var acceptResponse = true;
			
			var timeoutThread = window.setTimeout(function()
			{
				acceptResponse = false;
				
				var flag = AP.flag.create({
					  title: 'The connection has timed out',
					  body: 'The server at ' +
								serverName + ' is taking too long to respond.',
					  type: 'error',
					  close: 'manual'
				});

				AP.dialog.close();
			}, timeout);
	    	
			function viewDrawioDoc(doc)
			{
				try
				{
					window.clearTimeout(timeoutThread);
					
			 		if (acceptResponse)
			 		{
		    			document.body.style.backgroundImage = 'none';
						var viewer = new GraphViewer(null, doc.documentElement, {highlight: '#3572b0', nav: true, lightbox: false,
							pageId: customData.pageId, layerIds: customData.layerIds});
						viewer.lightboxChrome = false;

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
			 		}
				}
				catch(e)
				{
					var flag = AP.flag.create({
						  title: 'Unexpected Error',
						  body: 'The driagram is corrupted.',
						  type: 'error',
						  close: 'manual'
					});

					AP.dialog.close();
				}
			};
			
			function fetchDocErr(err)
			{
				window.clearTimeout(timeoutThread);
				
		 		if (acceptResponse)
		 		{
		 			var flag = AP.flag.create({
						  title: 'Unexpected Error',
						  body: 'Cannot fetch diagram content.',
						  type: 'error',
						  close: 'manual'
					});
		 			
		 			AP.dialog.close();
		 		}
			};
			
			var tryCachedFile = function(cachedFileId, onError)
			{
				if (cachedFileId == null)
				{
					onError();
				}
				else
				{
					AP.request({
						url: '/secure/attachment/' + cachedFileId + '/',
						success: function(resp)
						{
							viewDrawioDoc(mxUtils.parseXml(resp));
						},
						error: onError
					});
				}
			};
			
			function cacheAndRender(fileContent, fileDoc, cachedFilename)
			{
				viewDrawioDoc(fileDoc);
				
				AC.uploadToJira(fileContent, issueId, cachedFilename, 
						'application/vnd.jgraph.mxfile', GAC.noop, GAC.noop);
			};
			
			if (fileInfo.service == 'GDrive')
			{
				GAC.getFileInfo(fileInfo.id, function(fileInfo)
				{
					var timestamp = String(new Date(fileInfo.modifiedDate).getTime());
					var cachedFilename = timestamp + '_' + fileInfo.title;
					
					tryCachedFile(cachedFileId, function()
					{
						if (/\.v(dx|sdx?)$/i.test(fileInfo.title))
						{
							GAC.getBinaryFile(fileInfo, function(blobFile)
							{
								convertVSDXtoMX(blobFile, fileInfo.title, function(xml)
								{
									cacheAndRender(xml, mxUtils.parseXml(xml), cachedFilename);
								}, fetchDocErr);
							}, fetchDocErr);
						}
						else
						{
							GAC.getDrawioFileDoc(fileInfo, function(doc, cnt)
							{
								cacheAndRender(cnt, doc, cachedFilename);
							}, fetchDocErr);
						}
					});
				}, fetchDocErr);
			}
			else if (fileInfo.service == 'AttFile')
			{
				AP.request({
					url: '/secure/attachment/' + fileInfo.id + '/',
					success: function(resp)
					{
						var isPng = fileInfo.mime == 'image/png';
						
						try 
						{
							if (isPng)
							{
								resp = AC.extractGraphModelFromPng(resp);
							}
							
							var doc = mxUtils.parseXml(resp);
							viewDrawioDoc(doc);
						}
						catch(e)
						{
							fetchDocErr();
						}
					},
					error: fetchDocErr
				});
			}
			else //OneDrive
			{
				AC.getFileInfo(fileInfo.id, fileInfo.driveId, function(fileInfo)
				{
					var timestamp = String(new Date(fileInfo.lastModifiedDateTime).getTime());
					var cachedFilename = timestamp + '_' + fileInfo.name;
					
					tryCachedFile(cachedFileId, function()
					{
						if (/\.v(dx|sdx?)$/i.test(fileInfo.name))
						{
							AC.getBinaryFile(fileInfo, function(blobFile)
							{
								convertVSDXtoMX(blobFile, fileInfo.name, function(xml)
								{
									cacheAndRender(xml, mxUtils.parseXml(xml), cachedFilename);
								}, fetchDocErr);
							}, fetchDocErr);
						}
						else
						{
							AC.getDrawioFileDoc(fileInfo, function(doc, cnt)
							{
								cacheAndRender(cnt, doc, cachedFilename);
							}, fetchDocErr);
						}
					});
				}, fetchDocErr);
			}
	    };
	    AP.dialog.getCustomData(doMain);
	}
	
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
})();