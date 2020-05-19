(function(){	
	var messageListener = function(evt)
	{
		if (evt.source == parent)
		{
			var msg = JSON.parse(evt.data);
			
			switch (msg.action)
			{
			case 'viewFile':
				GAC.getFileInfo(msg.data.sFileId, function(fileInfo)
				{
					var isPng = fileInfo.mimeType == 'image/png';
					var fileTitle = fileInfo.title;
					
        			GAC.doAuthRequestPlain(fileInfo['downloadUrl'], 'GET', null, function(req)
					{
        				var xml = req.responseText;
        				
        				if (isPng)
						{
        					xml = 'data:image/png;base64,' + Editor.base64Encode (xml);
        					xml = GAC.extractGraphModelFromPng(xml);
						}
						
        				renderDiagram(xml, fileTitle, msg.data);
        				parent.postMessage(JSON.stringify({action: 'diagramRendered',  fileTS: new Date(fileInfo.modifiedDate).getTime()}), '*');
					}, function()
					{
						//Translations are not loaded but it is only used in errors
						showError(mxResources.get('confReadFileErr', [fileTitle, 'Google Drive'], 'Cannot read "{1}" file from {2}.'));
					}, null, isPng);
				}, function()
				{
					showError(mxResources.get('confGetInfoFailed', ['Google Drive'], 'Fetching file info from {1} failed.'));
				});
				break;
			}
		}
	};

	window.addEventListener('message', messageListener);
	parent.postMessage(JSON.stringify({action: 'viewerReady'}), '*');
})();