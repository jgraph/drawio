var GliffyMassImporter = function(logDiv) 
{
	logDiv.html("<br>");
	
	var link = document.createElement('a');
	link.href = location.href;
	link.href = link.href; //to have 'host' populated under IE
	var hostUrl = link.protocol + '//' + link.hostname;
	
	function searchContentForMacro(macroName, onSuccess, onError, nextUrl) 
	{
		AP.require(['request'], function(request) 
		{
			request({
				type: 'GET',
				url: nextUrl || ('/rest/api/content/search?cql=macro=' + macroName + "&limit=100"),
				contentType: 'application/json;charset=UTF-8',
				success: function(resp) {
					var resp = JSON.parse(resp);
					onSuccess(resp);
					//Support pageing
					if (resp._links && resp._links.next) {
						searchContentForMacro(macroName, onSuccess, onError, resp._links.next);
					}
				},
				error: onError
			});
		});
	};
	
	function getPageContent(pageId, success, error) 
	{
		AP.require(['request'], function(request) 
		{
			request({
				type: 'GET',
				url: '/rest/api/content/' + pageId + '/?expand=body.storage,version',
				contentType: 'application/json;charset=UTF-8',
				success: success,
				error: error
			});
		});
	};
	
	
	function importGliffyAtt(pageId, attName, attId, macroId, success, error) 
	{
		logDiv.append($('<div>Gliffy diagram "'+ AC.htmlEntities(attName) +'" found. Importing...</div>'));
		
		//Get the latest version (no version parameter)
		AP.require(['request'], function(request) 
		{
			request({
				url:  "/download/attachments/" + pageId + "/"
					+ encodeURIComponent(attName),
				success: function(resp) 
				{
					var blob = new Blob([resp], {type : 'application/json'});
					var file = new File([blob], 'gliffy');
					 
					 var formData = new FormData();
					 formData.append('format', 'xml');
			         formData.append("upfile", file, 'gliffy');
					
			         var xhr = new XMLHttpRequest();
			 		 xhr.open('POST', hostUrl + "/open");
			 		
			 		 xhr.onreadystatechange = function()
			 		 {
			 			if (xhr.readyState == 4)
			 			{	
			 				if (xhr.status >= 200 && xhr.status <= 299 &&
								xhr.responseText.substring(0, 13) == '<mxGraphModel')
							{
								//upload draw.io xml as an attachment and also generate the preview image
				 				var xml = xhr.responseText;
				 				AC.saveDiagram(pageId, attName + ".drawio.xml", xml,
								function(resp)
								{
				 					logDiv.append($('<div>Gliffy diagram "'+ AC.htmlEntities(attName) +'" imported successfully.</div>'));
				 					
				 					resp = JSON.parse(resp);
				 					
				 					//TODO get the width & height
				 					success({
				 						name: attName + ".drawio.xml", 
				 						revision: resp.results[0].version.number,
				 						macroId: macroId,
				 						previewPng: attName + ".png"
			 						});
				 				}, function(err) 
				 				{
				 					logDiv.append($('<div style="color:red">Saving imported Gliffy diagram "'+ AC.htmlEntities(attName) +'" failed.</div>'));
				 					console.log(err);
				 					error();
				 				}, false, 'text/plain', 'Imported from "' + attName + '" by draw.io');
							}
			 				else
		 					{
			 					logDiv.append($('<div style="color:red">Importing Gliffy diagram "'+ AC.htmlEntities(attName) +'" failed.</div>'));
			 					console.log(xhr.status, xhr.responseText);
			 					error();
		 					}
			 			}
			 		 };
			 		
			 		 xhr.send(formData);
				},
				error: function(resp) 
				{
					logDiv.append($('<div style="color:red">Fetching Gliffy diagram "'+ AC.htmlEntities(attName) +'" failed.</div>'));
					console.log(resp);
					error();
				}
			});
		});
	};
	
	
	function nsResolver(prefix) 
	{
	  var ns = {
	    'ac' : 'https://www.atlassian.com/software/confluence/ac',
	    'ri': 'https://www.atlassian.com/software/confluence/ri'
	  };
	  return ns[prefix] || null;
	}
	
	var pagesCount = 0;
	var processedPages = 0;
	
	function pageProcessed()
	{
		processedPages++;
		
		if (processedPages == pagesCount)
		{
			logDiv.append($('<div>All Gliffy diagrams processed. Import finished!</div>'));
		}
	};
	
	function loadPageSuccess(page) 
	{
		page = JSON.parse(page);
		
		logDiv.append($('<div>Started processing page "'+ AC.htmlEntities(page.title) +'"...</div>'));
		
		var originalBody = page.body.storage.value;
		
		var pageXml = page.body.storage.value.replace(/&/g, '&amp;');
		
		var pageDom = new DOMParser().parseFromString('<root xmlns:ac="https://www.atlassian.com/software/confluence/ac">' + pageXml + '</root>', "text/xml");
		var nodes = pageDom.evaluate( "//ac:structured-macro[@ac:name='gliffy']", pageDom.documentElement, nsResolver, XPathResult.ANY_TYPE, null );
		var nextMacro = null;
		var gliffyMacros = [];
		
		while(( nextMacro = nodes.iterateNext()) != null) 
			gliffyMacros.push(nextMacro);
		
		var macrosParsed = 0;
		var drawIoMacros = {};
		var gliffyMarcosIds = [];
		
		for(var i = 0; i < gliffyMacros.length; i++) 
		{
			var element = gliffyMacros[i];
			var macroId = element.getAttribute('ac:macro-id');
			gliffyMarcosIds.push(macroId);
			var nameEl = pageDom.evaluate("ac:parameter[@ac:name='name']", element, nsResolver, XPathResult.ANY_TYPE, null).iterateNext();
			var attIdEl = pageDom.evaluate("ac:parameter[@ac:name='diagramAttachmentId']", element, nsResolver, XPathResult.ANY_TYPE, null).iterateNext();
			
			//get the attachment content
			importGliffyAtt(page.id, AC.fromHtmlEntities(nameEl.textContent), attIdEl.textContent, macroId, function(attInfo)
			{
				//Replace gliffy macro with a draw.io one and use the gliffy preview image

				//generate draw.io macro HTML
				var drawIoMacro = '<ac:structured-macro ac:name="drawio" ac:schema-version="1" ac:macro-id="' + attInfo.macroId 
						+ '"><ac:parameter ac:name="baseUrl">' + baseUrl 
						+ '</ac:parameter><ac:parameter ac:name="diagramName">' + AC.htmlEntities(attInfo.name)
						+ '</ac:parameter><ac:parameter ac:name="width">' + 500 //TODO It works with this hardcoded number, but it is better to get the actual value
						+ '</ac:parameter><ac:parameter ac:name="zoom">1</ac:parameter><ac:parameter ac:name="pageId">' + page.id
						+ '</ac:parameter><ac:parameter ac:name="lbox">1</ac:parameter><ac:parameter ac:name="height">' + 500 //TODO It works with this hardcoded number, but it is better to get the actual value 
						+ '</ac:parameter><ac:parameter ac:name="revision">' + attInfo.revision 
						+ '</ac:parameter><ac:parameter ac:name="tempPreview">' + AC.htmlEntities(attInfo.previewPng) 
						+ '</ac:parameter>';
						
				drawIoMacros[attInfo.macroId] = drawIoMacro; 
				macrosParsed++;
				
				if (gliffyMacros.length == macrosParsed)
				{
					for (var j = 0; j < macrosParsed; j++)
					{
						var id = gliffyMarcosIds[j];
						originalBody = originalBody.replace(/\<ac\:structured\-macro\s+ac\:name\=\"gliffy\".*?(?=\<\/ac\:structured\-macro\>)/, drawIoMacros[id]);
					}
					
					//update page contents
					AP.require(['request'], function(request) 
					{
						request({
							type: 'PUT',
							data: JSON.stringify({
								"body": {
									"storage": {
										"value": originalBody,
										"representation": "storage",
										"embeddedContent": []
									}
								},
								"version": {
							        "number": page.version.number + 1
							    },
							    "type": "page",
							    "title": page.title,
							    "status": "current"
							}),
							url:  "/rest/api/content/"+ page.id,
							contentType: 'application/json;charset=UTF-8',
							success: function(resp) {
								logDiv.append($('<div>Gliffy diagrams in page "'+ AC.htmlEntities(page.title) +'" imported successfully.</div>'));
								pageProcessed();
							},
							error: function(resp) {
								logDiv.append($('<div style="color:red">Updating page "'+ AC.htmlEntities(page.title) +'" failed.</div>'));
								console.error(resp);
								pageProcessed();
							}
						 });
					});
				}
			},
			function()
			{
				pageProcessed();
			});
		};
		
		if (gliffyMacros.length == 0)
		{
			logDiv.append($('<div>No Gliffy diagrams found in page "'+ AC.htmlEntities(page.title) +'".</div>'));
			pageProcessed();
		}
	}; 
	
	function loadPageError(resp) 
	{
		logDiv.append($('<div style="color:red">Fetching the page failed.</div>'));
		console.log(resp);
		pageProcessed();
	};

	//Code starts execution here
	searchContentForMacro('gliffy', function success(resp) 
	{
		pagesCount += resp.results.length;
		
		for(var i = 0; i < resp.results.length; i++) 
		{
			var page = resp.results[i];
			
			logDiv.append($('<div>Page "'+ AC.htmlEntities(page.title) +'" found. Fetching...</div>'));
			
			getPageContent(page.id, loadPageSuccess, loadPageError);
		}
		
		if (resp.results.length == 0)
		{
			logDiv.append($('<div>No Gliffy diagrams found. Import finished.</div>'));
		}
	}, function error(err) 
	{
		logDiv.append($('<div style="color:red">Searching for Gliffy diagrams failed. Please try again later.</div>'));
		console.log(err);
	});
};

var baseUrl = AC.getUrlParam('xdm_e', true) + AC.getUrlParam('cp', true);

var script = document.createElement('script');

script.onload = function()
{
	//JQuery is loaded in this page, so we can use it
	var importBtn = $('#importBtn');
	
	importBtn.attr("disabled", null);
	
	importBtn.click(function()
	{
		GliffyMassImporter($('#importLog'));
	});
};

script.src = baseUrl + '/atlassian-connect/all.js';
script.setAttribute('data-options', 'sizeToParent:true;');
document.getElementsByTagName('head')[0].appendChild(script);
