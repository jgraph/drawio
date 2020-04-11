(function()
{
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
		
		//keeping the block of AP.require to minimize the number of changes!
		function doMain(customData)
		{
			var fileInfo = (customData != null) ? customData.fileInfo : null;
			var id = fileInfo.id;
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
	    	
			function createPrevIframe(url)
			{
				window.clearTimeout(timeoutThread);
				var iframe = document.createElement('iframe');
				iframe.src = url;
				iframe.setAttribute('frameborder', '0');
				iframe.width = '100%';
				iframe.height = '100%';
				document.body.appendChild(iframe);
			};
			
			function noPrevErr()
			{
				window.clearTimeout(timeoutThread);
				document.body.innerHTML = 'No preview is available';
			};
			
			if (fileInfo.service == 'GDrive')
			{
				GAC.getFileInfo(id, function(fileInfo)
				{
					createPrevIframe(fileInfo.embedLink);
				}, noPrevErr);
			}
			else if (fileInfo.service == 'AttFile')
			{
				AP.request({
					url: '/secure/attachment/' + id + '/',
					success: function(resp)
					{
						createPrevIframe(resp);
					},
					error: noPrevErr
				});
			}
			else //OneDrive
			{
				var driveId = fileInfo.driveId;
				var embeddedUrl = fileInfo.embeddedUrl;
				
				if (embeddedUrl)
				{
					createPrevIframe(embeddedUrl);
				}
				else
				{
					AC.getPreviewUrl(id, driveId, function(prevUrl)
					{
			    		if (acceptResponse)
				    	{
							if (prevUrl)
							{
								createPrevIframe(prevUrl);
							}
							else
							{
								noPrevErr();
							}
				    	}
					}, noPrevErr);
				}
			}
	    };
	    
	    AP.dialog.getCustomData(doMain);
	}
	
	script.onload = main;
	
	script.src = 'https://connect-cdn.atl-paas.net/all.js';
})();