//Logs uncaught errors
window.onerror = function(message, url, linenumber, colno, err)
{
	message = 'Confluence Cloud Lucid Mass Import: ' + ((message != null) ? message : '');
	
	AC.logError(message, url, linenumber, colno, err);
};

var baseUrl = AC.getBaseUrl();
var script = document.createElement('script');

script.onload = function()
{
	var importExtensionId = 'cnoplimhpndhhhnmoigbanpjeghjpohi';
	var extensionInstallUrl = 'https://chrome.google.com/webstore/detail/diagramsnet-and-drawio-im/cnoplimhpndhhhnmoigbanpjeghjpohi';
	var logDiv = $('#operationLog');

	AP.sizeToParent(true);
	
	setTimeout(function()
	{
		AP.sizeToParent(true);
	}, 5000); //Try resizing again after 5 sec since the first one fails sometimes
	
	function prepareImporter(response)
	{
		//JQuery is loaded in this page, so we can use it
		var importBtn = $('#importBtn');
		
		if (!response) //Extension is not installed
		{
			logDiv.html(mxResources.get('installFirst', ['<a href="' + extensionInstallUrl + '" target="_blank">' + mxResources.get('drawioChromeExt') + '</a>']));
		}
		else if (response.error)
		{
			if (response.msg == 'LucidNotFound' || response.msg == 'LucidDisconnected')
			{
				setTimeout(function()
				{
					chrome.runtime.sendMessage(importExtensionId, {msg: 'filesTree', allAsMap: true}, prepareImporter);
				}, 1000);
			}
			else if (response.msg == 'AuthError')
			{
				logDiv.html(mxResources.get('loginFirstThen', ['Lucidchart', '<a href="javascript:location.reload();">' + mxResources.get('tryAgain') + '</a>']));
			}
			else
			{
				logDiv.html('<span style="color:red">' + mxResources.get('errFetchDocList') + '</span>');
			}
		}
		else
		{
			importBtn.attr("disabled", null);
			$('#loadingImg').hide();
			
			importBtn.click(function()
			{
				$('#loadingImg').show();
				importBtn.prop('disabled', true); //Disable button to prevent concurrent execution
				
				LucidConnMassImporter(response.filesMap, importExtensionId, logDiv, function()
				{
					$('#loadingImg').hide();
					importBtn.prop('disabled', false);
				})
			});
		}	
	};
	
	getAndApplyTranslation(function()
	{
		if (typeof chrome === 'undefined')
		{
			logDiv.html('<span style="color:red">' + mxResources.get('chromeOnly') + '</span>');
		}
		else
		{
			chrome.runtime.sendMessage(importExtensionId, {msg: 'filesTree', allAsMap: true}, prepareImporter);
		}
	});
};

script.src = 'https://connect-cdn.atl-paas.net/all.js';
script.setAttribute('data-options', 'resize:false;margin:false');
document.getElementsByTagName('head')[0].appendChild(script);
