//Logs uncaught errors
window.onerror = function(message, url, linenumber, colno, err)
{
	message = 'Confluence Cloud Admin: ' + ((message != null) ? message : '');
	
	AC.logError(message, url, linenumber, colno, err);
};

var baseUrl = AC.getBaseUrl();

var script = document.createElement('script');

script.onload = function()
{
	AP.sizeToParent(true);
	
	setTimeout(function()
	{
		AP.sizeToParent(true);
	}, 5000); //Try resizing again after 5 sec since the first one fails sometimes
	
	getAndApplyTranslation(function()
	{
		//JQuery is loaded in this page, so we can use it
		var logDiv = $('#operationLog');

		var importBtn = $('#importBtn');
		
		importBtn.attr("disabled", null);
		
		importBtn.click(function()
		{
			$('#busyIcon').show();
			
			GliffyMassImporter(logDiv, function()
			{
				$('#busyIcon').hide();
			});
		});
	});
};

script.src = 'https://connect-cdn.atl-paas.net/all.js';
script.setAttribute('data-options', 'resize:false;margin:false');
document.getElementsByTagName('head')[0].appendChild(script);
