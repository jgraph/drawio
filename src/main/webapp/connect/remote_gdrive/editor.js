(function(){
	var editedFile = null;
	
	var editor = new GDriveEditor(function(selectedFile, width, height)
	{
		var data = {
			diagramName: selectedFile.title,
			service: 'GDrive',
			sFileId: selectedFile.id,
			aspect: selectedFile.aspect,
			width: width,
			height: height,
			modifiedTS: new Date(selectedFile.modifiedDate).getTime()
		};
		
		parent.postMessage(JSON.stringify({action: 'fileData', data: data, isEdited: editedFile == selectedFile.id}), '*');
	}, null, 'GD', true, true);
	
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