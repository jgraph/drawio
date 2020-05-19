(function(){
	var editedFile = null;
	
	var editor = new OneDriveEditor(function(selectedFile, width, height)
	{
		var data = {
			diagramName: selectedFile.name,
			service: 'OneDrive',
			sFileId: selectedFile.id,
			odriveId: selectedFile.parentReference.driveId,
			aspect: selectedFile.aspect,
			width: width,
			height: height,
			modifiedTS: new Date(selectedFile.lastModifiedDateTime).getTime()
		};
		
		parent.postMessage(JSON.stringify({action: 'fileData', data: data, isEdited: editedFile == selectedFile.id}), '*');
	}, null, 'OD', true, true);
	
	var messageListener = function(evt)
	{
		if (evt.source == parent)
		{
			var msg = JSON.parse(evt.data);
			
			switch (msg.action)
			{
			case 'spinner.stop':
				editor.spinner.stop();
				break;
			case 'getSelFile':
				editor.doSubmit();
				break;
			case 'loadFile':
				editedFile = msg.fileInfo.sFileId;
				editor.loadDarwioFile(msg.fileInfo);
				break;
			}
		}
	};

	window.addEventListener('message', messageListener);
	parent.postMessage(JSON.stringify({action: 'editorReady'}), '*');
})();