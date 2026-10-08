/**
 * Copyright (c) 2020-2025, JGraph Holdings Ltd
 * Copyright (c) 2020-2025, draw.io AG
 */
// Standalone importer page (vsdxImporter.html). Nothing in this repo loads it,
// but drawio-desktop's command-line export does (messages 'import',
// 'import-success', 'import-error'), and so do headless tools that use the
// hosted page (file input, #doneDiv, window.importResXML).
var mxIsElectron = navigator.userAgent != null &&
	navigator.userAgent.toLowerCase().indexOf(' electron/') > -1 && 
	navigator.userAgent.indexOf(' draw.io/') > -1;
/**
 * Adds meta tag to the page.
 */
function mxmeta(content, httpEquiv)
{
	try
	{
		var s = document.createElement('meta');
		
		s.setAttribute('content', content);
		s.setAttribute('http-equiv', httpEquiv);

		var t = document.getElementsByTagName('meta')[0];
		t.parentNode.insertBefore(s, t);
	}
	catch (e)
	{
		// ignore
	}
};

function doImport(vsdxBuff, callback, error, file)
{
	EditorUi.prototype.createUi = function(){};
	EditorUi.prototype.addTrees = function(){};
	EditorUi.prototype.updateActionStates = function(){};
	var editorUi = new EditorUi();
	var blob = file? file : new Blob([vsdxBuff], {type: 'application/octet-stream'});

	editorUi.importVisio(blob, callback, error, file? file.name : null);		
};


if (mxIsElectron)
{
	mxmeta('default-src \'self\'; script-src \'self\'; connect-src \'self\' https://*.draw.io https://*.diagrams.net https://fonts.googleapis.com https://fonts.gstatic.com; img-src * data:; media-src *; font-src *; frame-src \'none\'; style-src \'self\' \'unsafe-inline\' https://fonts.googleapis.com; base-uri \'none\';child-src \'self\';object-src \'none\';', 'Content-Security-Policy');

	electron.registerMsgListener('import', (vsdxBuff) => 
	{
		doImport(vsdxBuff, function(xml)
		{
			electron.sendMessage('import-success', xml);
		},
		function()
		{
			electron.sendMessage('import-error');
		});
	});
}

window.addEventListener('load', function()
{
	document.getElementById('fileUpload').addEventListener('change', function()
	{
		const curFiles = this.files;

		if(curFiles.length > 0) 
		{
			function createDoneDiv(msg)
			{
				var doneDiv = document.createElement('div');
				doneDiv.id = 'doneDiv';
				doneDiv.innerHTML = msg;
				document.body.appendChild(doneDiv);
			};
			
			doImport(null, function(xml)
			{
				window.importResXML = xml;
				createDoneDiv('success');
			}, function(err)
			{
				console.log(err)
				createDoneDiv('error');
			}, curFiles[0]);
		}
	});
});
