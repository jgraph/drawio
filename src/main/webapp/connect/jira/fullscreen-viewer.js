// Logs uncaught errors
EditorUi.enableLogging = true;

window.onerror = function(message, url, linenumber, colno, err)
{
	message = 'Jira Cloud: ' + ((message != null) ? message : '');
	
	EditorUi.logError(message, url, linenumber, colno, err);
};

// Enables dynamic loading of shapes and stencils (same domain)
mxStencilRegistry.dynamicLoading = true;

// Specifies connection mode for touch devices (at least one should be true)
var connectUrl = getBaseUrl() + '/atlassian-connect';
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
		var diagramId = (customData != null) ? customData.diagramId : null;
       	var diagramName = (customData != null) ? customData.diagramName : null;
       	var diagramUrl = (customData != null) ? customData.diagramUrl : null;
       	var pageId = (customData != null) ? customData.pageId : null;
       	var layerIds = (customData != null) ? customData.layerIds : null;
    	var serverName = getBaseUrl();
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

			//TODO find how to listen to flag close event, currently just close the editor immediately
			//messages.onClose(message, function()
			//{
				AP.dialog.close();
			//});
		}, timeout);
    	
		var renderDiagram = function(xml)
		{
    		window.clearTimeout(timeoutThread);
    		
    		if (acceptResponse)
	    	{
    			document.body.style.backgroundImage = 'none';
				var viewer = new GraphViewer(null, null, {highlight: '#3572b0', nav: true, lightbox: false, pageId: pageId, layerIds: layerIds});
				viewer.lightboxChrome = false;
				viewer.xml = xml;

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
		};
		
		var renderDiagramError = function() 
		{
    		window.clearTimeout(timeoutThread);
    		
    		if (acceptResponse)
	    	{
    			AP.jira.refreshIssuePage();
				AP.dialog.close();
	    	}
		};
		
		if (diagramUrl != null)
		{
			 var xhr = new XMLHttpRequest();
	 		 xhr.open('GET', diagramUrl);
	 		
	 		 xhr.onreadystatechange = function()
	 		 {
	 			if (xhr.readyState == 4)
	 			{	
	 				if (xhr.status >= 200 && xhr.status <= 299)
					{
	 					renderDiagram(xhr.responseText);
					}
	 				else
 					{
	 					renderDiagramError();
 					}
	 			}
	 		 };
	 		
	 		 xhr.send();
		}
		else
		{
	       	// LATER: Add fallback using diagramName lookup via attachment list
			AP.request({
				url: '/secure/attachment/' + diagramId + '/',
				success: renderDiagram,
				error : renderDiagramError
			});
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
