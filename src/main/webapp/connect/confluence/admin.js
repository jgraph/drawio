function guid()
{
  function s4()
  {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    s4() + '-' + s4() + s4() + s4();
};

var MassDiagramsProcessor = function(macroName, readableName, attParams, processAttFn, logDiv)
{
	logDiv.html("<br>");
	
	//RegExp that will be used
	var findMacrosRegEx = new RegExp('\\<ac\\:structured\\-macro\\s+ac\\:name\\=\\"' + macroName + '\\".*?(?=\\<\\/ac\\:structured\\-macro\\>)\\<\\/ac\\:structured\\-macro\\>', 'g');
	var findMacroIdRegEx = new RegExp('ac\\:macro\\-id\\=\\"([^\\"]+)');

	var findOldMacrosRegEx = new RegExp('\\<ac\\:macro\\s+ac\\:name\\=\\"' + macroName + '\\".*?(?=\\<\\/ac\\:macro\\>)\\<\\/ac\\:macro\\>', 'g');
	
	var findAttParamsRegExs = [];
	
	for (var i = 0; i < attParams.length; i++)
	{
		findAttParamsRegExs.push(new RegExp('\\<ac\\:parameter\\s+ac\\:name\\=\\"' + attParams[i] + '\\"\\s*\\>([^\\<]+)'));
	}
	
	function searchContentForMacro(onSuccess, onError, nextUrl) 
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

	var pagesCount = 0;
	var processedPages = 0;
	
	function pageProcessed()
	{
		processedPages++;
		
		if (processedPages == pagesCount)
		{
			logDiv.append($('<div>All ' + readableName + ' diagrams processed. Process finished!</div>'));
		}
	};
	
	function loadPageSuccess(page) 
	{
		page = JSON.parse(page);
		
		logDiv.append($('<div>Started processing page "'+ AC.htmlEntities(page.title) +'"...</div>'));
		
		var originalBody = page.body.storage.value;
		
		var pageXml = originalBody;
		
		var foundMacros = pageXml.match(findMacrosRegEx);
		var foundOldMacros = pageXml.match(findOldMacrosRegEx);
		
		var macrosParsed = 0;
		var drawIoMacros = {};
		var foundMarcosIds = [];
		var spaceKey = AC.getSpaceKey(page._expandable.space);
		var macrosCount = (foundMacros? foundMacros.length : 0) + (foundOldMacros? foundOldMacros.length : 0); 

		
		function attProcessedFn(attInfo)
		{
			//Replace found macro with a draw.io one and use the same preview image

			//generate draw.io macro HTML
			var drawIoMacro = '<ac:structured-macro ac:name="drawio" ac:schema-version="1" ac:macro-id="' + attInfo.macroId 
					+ '"><ac:parameter ac:name="baseUrl">' + baseUrl 
					+ '</ac:parameter><ac:parameter ac:name="diagramName">' + AC.htmlEntities(attInfo.name)
					+ '</ac:parameter><ac:parameter ac:name="width">' + attInfo.width
					+ '</ac:parameter><ac:parameter ac:name="zoom">' + (attInfo.zoom ? attInfo.zoom : '1')
					+ '</ac:parameter><ac:parameter ac:name="pageId">' + page.id
					+ '</ac:parameter><ac:parameter ac:name="lbox">' + (attInfo.lbox ? attInfo.lbox : '1')
					+ '</ac:parameter><ac:parameter ac:name="height">' + attInfo.height 
					+ '</ac:parameter><ac:parameter ac:name="revision">' + attInfo.revision 
					+ (attInfo.previewPng? ('</ac:parameter><ac:parameter ac:name="tempPreview">' + AC.htmlEntities(attInfo.previewPng)) : "")
					+ '</ac:parameter><ac:parameter ac:name="contentId">' + attInfo.contentId
					+ '</ac:parameter><ac:parameter ac:name="contentVer">' + attInfo.contentVer
					+ '</ac:parameter></ac:structured-macro>';
					
			drawIoMacros[attInfo.macroId] = drawIoMacro; 
			macrosParsed++;
			
			if (macrosCount == macrosParsed)
			{
				for (var j = 0; j < macrosParsed; j++)
				{
					var id = foundMarcosIds[j].id;
					var macroTxt = foundMarcosIds[j].macroTxt;
					
					originalBody = originalBody.replace(macroTxt, drawIoMacros[id]);
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
						    "type": page.type,
						    "title": page.title,
						    "status": "current"
						}),
						url:  "/rest/api/content/"+ page.id,
						contentType: 'application/json;charset=UTF-8',
						success: function(resp) {
							logDiv.append($('<div>' + readableName + ' diagrams in page "'+ AC.htmlEntities(page.title) +'" processed successfully.</div>'));
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
		};
		
		if (foundMacros && foundMacros.length > 0)
		{
			for (var i = 0; i < foundMacros.length; i++)
			{
				var macroId = foundMacros[i].match(findMacroIdRegEx)[1];
				
				foundMarcosIds.push({id: macroId, macroTxt: foundMacros[i]});
				
				var params = [];
				
				for (var j = 0; j < findAttParamsRegExs.length; j++) 
				{
					var paramFound = foundMacros[i].match(findAttParamsRegExs[j]);
					
					params.push(paramFound? AC.fromHtmlEntities(paramFound[1]) : null); 
				}
				
				//get the attachment content
				processAttFn(page.id, page.type, spaceKey, params, macroId, attProcessedFn,
				function()
				{
					pageProcessed();
				},
				function()
				{
					pageProcessed();
				});
			};
		}
		
		if (foundOldMacros && foundOldMacros.length > 0)
		{
			for (var i = 0; i < foundOldMacros.length; i++)
			{
				//these macros has no id, so generate a unique id
				var macroId = guid();
				
				foundMarcosIds.push({id: macroId, macroTxt: foundOldMacros[i]});
				
				var params = [];
				
				for (var j = 0; j < findAttParamsRegExs.length; j++) 
				{
					var paramFound = foundOldMacros[i].match(findAttParamsRegExs[j]);
					
					params.push(paramFound? AC.fromHtmlEntities(paramFound[1]) : null); 
				}
				
				//get the attachment content
				processAttFn(page.id, page.type, spaceKey, params, macroId, attProcessedFn,
				function()
				{
					pageProcessed();
				},
				function()
				{
					pageProcessed();
				});
			};
		}
		
		if (macrosCount == 0)
		{
			logDiv.append($('<div>No ' + readableName + ' diagrams found in page "'+ AC.htmlEntities(page.title) +'".</div>'));
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
	searchContentForMacro(function success(resp) 
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
			logDiv.append($('<div>No ' + readableName + ' diagrams found. Process finished.</div>'));
		}
	}, function error(err) 
	{
		logDiv.append($('<div style="color:red">Searching for ' + readableName + ' diagrams failed. Please try again later.</div>'));
		console.log(err);
	});
};

var GliffyMassImporter = function(logDiv) 
{
	var link = document.createElement('a');
	link.href = location.href;
	link.href = link.href; //to have 'host' populated under IE
	var hostUrl = link.protocol + '//' + link.hostname;

	function importGliffyAtt(pageId, pageType, spaceKey, params, macroId, success, error, skip) 
	{
		var attName = params[0];
		
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
					 
					 var formData = new FormData();
					 formData.append('format', 'xml');
			         formData.append("upfile", blob);
					
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
				 					resp = JSON.parse(resp);
				 					
				 					var attInfo = {
				 						name: attName + ".drawio.xml", 
				 						revision: resp.results[0].version.number,
				 						macroId: macroId,
				 						previewPng: attName + ".png",
					 					//TODO get the actual width & height
				 						//TODO It works with this hardcoded number, but it is better to get the actual value
		 								width: 500,
		 								height: 500
			 						};
				 					
				 					//Add custom content
				 					AC.saveCustomContent(spaceKey, pageId, pageType, attName + ".drawio.xml", attName + ".drawio.xml", attInfo.revision, null, null, 
				 							function(responseText)
				 							{
				 								logDiv.append($('<div>Gliffy diagram "'+ AC.htmlEntities(attName) +'" imported successfully.</div>'));
				 								
				 								var content = JSON.parse(responseText);
												
				 								attInfo.contentId = content.id;
				 								attInfo.contentVer = content.version.number;
												
							 					success(attInfo);
				 							}, function(err)
				 							{
				 								logDiv.append($('<div style="color:red">Saving imported Gliffy diagram "'+ AC.htmlEntities(attName) +'" failed.</div>'));
							 					console.log(err);
							 					error();
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
	
	MassDiagramsProcessor('gliffy', 'Gliffy', ['name'], importGliffyAtt, logDiv);
};


var DrawIoDiagramsIndexer = function(logDiv)
{
	function fixDrawIoCustomContent(pageId, pageType, spaceKey, params, macroId, success, error, skip) 
	{
		//['diagramName', 'contentId', 'contentVer', 'revision', 'width', 'height', 'tempPreview', 'zoom', 'lbox']
		var attName = params[0];
		var contentId = params[1];
		var contentVer = params[2];
		var revision = params[3];
		var width = params[4];
		var height = params[5];
		var tempPreview = params[6];
		var zoom = params[7];
		var lbox = params[8];
		
		logDiv.append($('<div>Diagram "'+ AC.htmlEntities(attName) +'" found. Indexing...</div>'));
		
		var attInfo = {
			macroId: macroId,
			name: attName,
			contentId: contentId,
			contentVer: contentVer,
			revision: revision,
			width: width,
			height: height,
			previewPng: tempPreview,
			zoom: zoom,
			lbox: lbox
		};
		
		
		function addNewCustomContent()
		{
			AC.saveCustomContent(spaceKey, pageId, pageType, attName, attName, revision, null, null, 
					function(responseText)
					{
						logDiv.append($('<div>Diagram "'+ AC.htmlEntities(attName) +'" indexed successfully.</div>'));
						
						var content = JSON.parse(responseText);
					
						attInfo.contentId = content.id;
						attInfo.contentVer = content.version.number;
					
						success(attInfo);
					}, function(err)
					{
						logDiv.append($('<div style="color:red">Indexing diagram "'+ AC.htmlEntities(attName) +'" failed.</div>'));
	 					console.log(err);
	 					error();
					});
		};
		
		//If contentId exists, make sure it exists and is valid
		if (contentId)
		{
			AP.require(['request'], function(request) 
			{
				request({
					type: 'GET',
					url: '/rest/api/content/' + contentId + '/?expand=body.storage',
					contentType: 'application/json;charset=UTF-8',
					success: function (resp) 
					{
						resp = JSON.parse(resp);
						
						var info = JSON.parse(decodeURIComponent(resp.body.storage.value));
						
						if (info.pageId == pageId && info.diagramName == attName && info.version == revision)
						{
							//nothing needs to be done, just skip
							logDiv.append($('<div>Diagram "'+ AC.htmlEntities(attName) +'" is up to date.</div>'));
							skip();
						}
						else
						{
							//We add a new one and leave the current one intact since this is most probably a copied diagram
							addNewCustomContent();
						}
					},
					error: function (err) 
					{
						//If not found, add it
						if (err.status == 404)
						{
							addNewCustomContent();
						}
						else
						{
							logDiv.append($('<div style="color:red">Indexing diagram "'+ AC.htmlEntities(attName) +'" failed.</div>'));
		 					console.log(err);
		 					error();
						}
					}
				});
			});
		}
		else //If no contentId exists, just add one
		{
			addNewCustomContent();
		}
	};

	MassDiagramsProcessor('drawio', 'Draw.io', 
			['diagramName', 'contentId', 'contentVer', 'revision', 'width', 'height', 'tempPreview', 'zoom', 'lbox'],
			fixDrawIoCustomContent, logDiv);
};

var baseUrl = AC.getUrlParam('xdm_e', true) + AC.getUrlParam('cp', true);

var script = document.createElement('script');

script.onload = function()
{
	//JQuery is loaded in this page, so we can use it
	var logDiv = $('#operationLog');

	var importBtn = $('#importBtn');
	
	importBtn.attr("disabled", null);
	
	importBtn.click(function()
	{
		GliffyMassImporter(logDiv);
	});
	
	var indexBtn = $('#indexBtn');

	indexBtn.attr("disabled", null);
	
	indexBtn.click(function()
	{
		DrawIoDiagramsIndexer(logDiv);
	});
};

script.src = baseUrl + '/atlassian-connect/all.js';
script.setAttribute('data-options', 'sizeToParent:true;');
document.getElementsByTagName('head')[0].appendChild(script);
