(function(){
	var messageListener = function(evt)
	{
		if (evt.source == parent)
		{
			var msg = JSON.parse(evt.data);
			
			switch (msg.action)
			{
			case 'viewFile':
				AC.getFileInfo(msg.data.sFileId, msg.data.odriveId, function(fileInfo)
				{
					var isPng = fileInfo.file.mimeType == 'image/png';
					var fileTitle = fileInfo.name;
					
        			var req = new XMLHttpRequest();
					req.open('GET', fileInfo['@microsoft.graph.downloadUrl']);
					
					req.onreadystatechange = function()
					{
						if (this.readyState == 4)
						{
							if (this.status >= 200 && this.status <= 299)
							{
								var xml = req.responseText;
		        				
		        				if (isPng)
								{
		        					xml = 'data:image/png;base64,' + Editor.base64Encode (xml);
		        					xml = AC.extractGraphModelFromPng(xml);
								}
								
		        				renderDiagram(xml, fileTitle, msg.data);
		        				parent.postMessage(JSON.stringify({action: 'diagramRendered',  fileTS: new Date(fileInfo.lastModifiedDateTime).getTime()}), '*');
							}
							else
							{
								showError(mxResources.get('confReadFileErr', [fileTitle, 'OneDrive'], 'Cannot read "{1}" file from {2}.'));
							}
						}
					};
					
					if (isPng && req.overrideMimeType)
					{
						req.overrideMimeType('text/plain; charset=x-user-defined');
					}
					
					req.send();
				}, function()
				{
					showError(mxResources.get('confGetInfoFailed', ['OneDrive'], 'Fetching file info from {1} failed.'));
				});
				break;
			}
		}
	};

	window.addEventListener('message', messageListener);
	parent.postMessage(JSON.stringify({action: 'viewerReady'}), '*');
})();