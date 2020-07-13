//Logs uncaught errors
window.onerror = function(message, url, linenumber, colno, err)
{
	message = 'Confluence Cloud Editor: ' + ((message != null) ? message : '');
	
	AC.logError(message, url, linenumber, colno, err);
};

var xdm_e = AC.getSiteUrl();
var baseUrl = AC.getBaseUrl();
var license = AC.getUrlParam('lic', false);
var connectUrl = baseUrl + '/atlassian-connect';
var head = document.getElementsByTagName('head')[0];
var licenseValid = true;

var script = document.createElement('script');
script.setAttribute('data-options', 'resize:false;margin:false');

if (license != null && xdm_e != null)
{
	if (license == 'none')
	{
		licenseValid = false;
	}
	
	var hostParse = document.createElement('a');
	hostParse.href = xdm_e;
	var hostname = hostParse.hostname;
	
	if (hostname != null)
	{
		var xhr = new XMLHttpRequest();
	
		xhr.onreadystatechange = function()
		{
		    if (xhr.readyState == XMLHttpRequest.DONE && xhr.status >= 200 && xhr.status <= 299)
		    {
		        var resp = xhr.responseText;
	
				if (resp != null && resp.length > 0)
				{
					var lic = JSON.parse(resp);
					
					if (lic != null && lic.atlasCloudLic != null)
					{
						if (lic.atlasCloudLic != 'blocked')
						{
							licenseValid = true;
						}
						else
						{
							licenseValid = false;
						}
					}
				}
		    }
		};
	
		xhr.open('POST', '/license?domain=' + hostname + '&confLicense=' + license, true);
		xhr.send(null);
	}
}

// Main
script.onload = function()
{
	if (!licenseValid)
	{
		setTimeout(function() // XHR call doesn't work inside AP.Request
		{
			if (!licenseValid)
			{
				alert("Please install a license for the draw.io app");
				AP.dialog.close();
			}
		}, 8000);
	}
	
	AP.resize('100%', '100%');
	
	var config = null;
	var lang = null;
	var SEN = null;
	var installedDate = null;
	var lastUpdated = null;
	var allDone = 0;
	
	var startEditor = function () 
	{
		allDone++;
		
		if (allDone == 2)
		{
			var isCustom = AC.getUrlParam('custom');
			
			if (isCustom == "1") 
			{
				var contentId = AC.getUrlParam('contentId') || AC.getUrlParam('custContentId');
				AP.dialog.getCustomData(function (customData) 
				{
					AC.initAsync(baseUrl, customData.contentId || customData.custContentId || contentId, customData.macroData, config, lang);
				});
			}
			else
			{
				AC.initAsync(baseUrl, null, null, config, lang);
			}
		}
	}
	
	AP.user.getLocale(function(locale)
	{
		lang = locale;
		startEditor();
	});	
	
	AP.request({
	    type: 'GET',
	    url: '/rest/api/content/search?cql=type%3Dpage%20and%20space%3DDRAWIOCONFIG%20and%20title%3DConfiguration', //type=page and space=DRAWIOCONFIG and title=Configuration. Search doesn't return 404 if not found
	    contentType: 'application/json;charset=UTF-8',
	    success: function (resp) 
	    {
	        resp = JSON.parse(resp);
	        
	        if (resp != null && resp.size == 1)
	       	{
	        	var configPageId = resp.results[0].id;
	        	//load the configuration file
	    		AP.request({
	                type: 'GET',
	    			url: '/download/attachments/' + configPageId + '/configuration.json',
	                contentType: 'application/json;charset=UTF-8',
	                success: function (fileContent) 
	                {
	                	config = fileContent; 
	                   	startEditor();
	    			},
	    			error: startEditor //if there is an error loading the configuration, just load the editor normally. E.g., 404 when the space doesn't exist
	    		});
	        	
	       	}
	        else 
	       	{
	        	startEditor();
	       	}
		},
		error: startEditor //if there is an error loading the configuration, just load the editor normally. E.g., 404 when the space doesn't exist
	});
	
	AP.request({
	    type: 'GET',
	    url: '/rest/atlassian-connect/1/addons/com.mxgraph.confluence.plugins.diagramly',
	    contentType: 'application/json;charset=UTF-8',
	    success: function (resp) 
	    {
	    	try
	    	{
	            resp = JSON.parse(resp);
	            
	            if (resp != null && resp.license != null)
	            {
	            	var xhr = new XMLHttpRequest();
	            	xhr.open('POST', '/license?licenseDump=' + encodeURIComponent(JSON.stringify(resp)), true);
	    			xhr.send(null);
	            }
	    	}
	    	catch (e)
	    	{
	    		// just throw away if it breaks, not important
	        	}
	        }
		});
};
script.src = 'https://connect-cdn.atl-paas.net/all.js';
head.appendChild(script);

var link = document.createElement('link');
link.type = 'text/css';
link.rel = 'stylesheet';
link.href = connectUrl + '/all.css';
head.appendChild(link);
