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

var drawioMacroParams = ['diagramName', 'contentId', 'contentVer', 'revision', 'width', 'height', 'tempPreview', 'zoom', 'lbox', 
	'diagramDisplayName', 'tbstyle', 'links', 'simple', 'hiResPreview', 'inComment', 'aspect', 'pageId', 'baseUrl',
	//inc-drawio macro specific params
	'diagramUrl', 'includedDiagram', 'aspectHash', 'imgPageId', 'attVer', 'custContentId',
	'pCenter'
];
	
function getMacroRegExps(macroName, attParams)
{
	//RegExp that will be used
	var findMacrosRegEx = new RegExp('\\<ac\\:structured\\-macro[^\\>]+?(?=ac\\:name\\=)ac\\:name\\=\\"' + macroName + '\\".*?(?=\\<\\/ac\\:structured\\-macro\\>)\\<\\/ac\\:structured\\-macro\\>', 'g');
	var findMacroIdRegEx = new RegExp('ac\\:macro\\-id\\=\\"([^\\"]+)');

	var findOldMacrosRegEx = new RegExp('\\<ac\\:macro[^\\>]+?(?=ac\\:name\\=)ac\\:name\\=\\"' + macroName + '\\".*?(?=\\<\\/ac\\:macro\\>)\\<\\/ac\\:macro\\>', 'g');
	
	var findAttParamsRegExs = [];
	
	for (var i = 0; i < attParams.length; i++)
	{
		findAttParamsRegExs.push(new RegExp('\\<ac\\:parameter\\s+ac\\:name\\=\\"' + attParams[i] + '\\"\\s*\\>([^\\<]+)'));
	}
	
	return {findMacrosRegEx: findMacrosRegEx, findMacroIdRegEx: findMacroIdRegEx, findOldMacrosRegEx: findOldMacrosRegEx, findAttParamsRegExs: findAttParamsRegExs};
};

function replacePageMacro(page, regExps, processAttFn, pageUpdateSuccess, pageUpdateError, alwaysCallSuccess)
{
	var originalBody = page.body.storage.value;
	
	var pageXml = originalBody;
	
	var foundMacros = pageXml.match(regExps.findMacrosRegEx);
	var foundOldMacros = pageXml.match(regExps.findOldMacrosRegEx);
	
	var macrosParsed = 0;
	var drawIoMacros = {};
	var foundMarcosIds = [];
	var spaceKey = AC.getSpaceKey(page._expandable.space);
	var macrosCount = (foundMacros? foundMacros.length : 0) + (foundOldMacros? foundOldMacros.length : 0); 

	
	function attProcessedFn(attInfo, skipErrorFlag)
	{
		//Replace found macro with a draw.io one and use the same preview image
		if (skipErrorFlag)
		{
			drawIoMacros[attInfo.macroId] = skipErrorFlag;
		}
		else
		{
			//generate draw.io macro HTML
			var drawIoMacro = '<ac:structured-macro ac:name="' + (attInfo.isInc? 'inc-drawio' : 'drawio') + '" ac:schema-version="1" ac:macro-id="' + attInfo.macroId 
				+ '"><ac:parameter ac:name="baseUrl">' + baseUrl 
				+ '</ac:parameter><ac:parameter ac:name="diagramName">' + AC.htmlEntities(attInfo.name)
				+ '</ac:parameter><ac:parameter ac:name="zoom">' + (attInfo.zoom ? attInfo.zoom : '1')
				+ '</ac:parameter><ac:parameter ac:name="pageId">' + (attInfo.pageId || page.id)
				+ '</ac:parameter><ac:parameter ac:name="lbox">' + (attInfo.lbox == 'false' || attInfo.lbox == '0'? '0' : '1')
				+ (attInfo.width? ('</ac:parameter><ac:parameter ac:name="width">' + attInfo.width) : '')
				+ (attInfo.height? ('</ac:parameter><ac:parameter ac:name="height">' + attInfo.height) : '') 
				+ (!attInfo.isInc && attInfo.revision? ('</ac:parameter><ac:parameter ac:name="revision">' + attInfo.revision) : '') 
				+ (attInfo.previewPng? ('</ac:parameter><ac:parameter ac:name="tempPreview">' + AC.htmlEntities(attInfo.previewPng)) : '')
				+ (attInfo.contentId? ('</ac:parameter><ac:parameter ac:name="custContentId">' + attInfo.contentId) : '')
				+ (!attInfo.isInc && attInfo.contentVer? ('</ac:parameter><ac:parameter ac:name="contentVer">' + attInfo.contentVer) : '')
				+ (attInfo.diagramDisplayName? ('</ac:parameter><ac:parameter ac:name="diagramDisplayName">' + attInfo.diagramDisplayName) : '')
				+ (attInfo.tbstyle? ('</ac:parameter><ac:parameter ac:name="tbstyle">' + attInfo.tbstyle) : '')
				+ (attInfo.links? ('</ac:parameter><ac:parameter ac:name="links">' + attInfo.links) : '')
				+ (attInfo.simple? ('</ac:parameter><ac:parameter ac:name="simple">' + attInfo.simple) : '')
				+ (attInfo.hiResPreview? ('</ac:parameter><ac:parameter ac:name="hiResPreview">' + attInfo.hiResPreview) : '')
				+ (attInfo.inComment? ('</ac:parameter><ac:parameter ac:name="inComment">' + attInfo.inComment) : '')
				+ (attInfo.aspect? ('</ac:parameter><ac:parameter ac:name="aspect">' + attInfo.aspect) : '')
				+ (attInfo.diagramUrl? ('</ac:parameter><ac:parameter ac:name="diagramUrl">' + attInfo.diagramUrl) : '')
				+ (attInfo.aspectHash? ('</ac:parameter><ac:parameter ac:name="aspectHash">' + attInfo.aspectHash) : '')
				+ (attInfo.imgPageId? ('</ac:parameter><ac:parameter ac:name="imgPageId">' + attInfo.imgPageId) : '')
				+ (attInfo.attVer? ('</ac:parameter><ac:parameter ac:name="attVer">' + attInfo.attVer) : '')
				+ (attInfo.isInc? ('</ac:parameter><ac:parameter ac:name="includedDiagram">1') : '')
				+ (attInfo.pCenter? ('</ac:parameter><ac:parameter ac:name="pCenter">' + attInfo.pCenter) : '')
				+ '</ac:parameter></ac:structured-macro>';
			
			drawIoMacros[attInfo.macroId] = drawIoMacro; 
		}
		
		macrosParsed++;
		
		if (macrosCount == macrosParsed)
		{
			var successfullyConverted = 0;
			var skippedCount = 0;
			
			for (var j = 0; j < macrosParsed; j++)
			{
				var id = foundMarcosIds[j].id;

				if (isFinite(drawIoMacros[id]))
				{
					if (drawIoMacros[id] == 2)
					{
						successfullyConverted++; //skipping is successful
						skippedCount++;
					}
				}
				else
				{
					var macroTxt = foundMarcosIds[j].macroTxt;
					
					originalBody = originalBody.replace(macroTxt, drawIoMacros[id]);
					successfullyConverted++;
				}
			}
			
			//If all macros are skipped, no need to change the page
			if (skippedCount == successfullyConverted)
			{
				pageUpdateSuccess(successfullyConverted, macrosParsed);
			}
			else
			{
				//update page contents
				AP.request({
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
						//update page object for next phase
						page.body.storage.value = originalBody;
						pageUpdateSuccess(successfullyConverted, macrosParsed);
					},
					error: pageUpdateError
				});
			}
		}
	};
	
	if (foundMacros && foundMacros.length > 0)
	{
		var doneIndex = 0;
		var PARTITION_SIZE = 5;
		
		//Process macros 5 (PARTITION_SIZE) at a time to throttle the process
		function processPartition(limit)
		{
			function partitionDone()
			{
				doneIndex++;
				
				if (foundMacros.length != limit && doneIndex == limit)
				{
					processPartition(limit + PARTITION_SIZE);
				}
			};
			
			
			limit = Math.min(foundMacros.length, limit);
			
			for (var i = doneIndex; i < limit; i++)
			{
				var potentialId = foundMacros[i].match(regExps.findMacroIdRegEx);
				var macroId = potentialId? potentialId[1] : guid();
				
				foundMarcosIds.push({id: macroId, macroTxt: foundMacros[i]});
				
				var params = [];
				
				for (var j = 0; j < regExps.findAttParamsRegExs.length; j++) 
				{
					var paramFound = foundMacros[i].match(regExps.findAttParamsRegExs[j]);
					
					params.push(paramFound != null && paramFound[1] != null? AC.fromHtmlEntities(paramFound[1]) : null); 
				}
				
				//get the attachment content
				processAttFn(page.id, page.type, spaceKey, params, macroId, function(attInfo)
				{
					attProcessedFn(attInfo);
					partitionDone();
				},
				function(attInfo)
				{
					attProcessedFn(attInfo, 1);
					partitionDone();
				},
				function(attInfo)
				{
					attProcessedFn(attInfo, 2);
					partitionDone();
				});
			};
		}
		
		processPartition(PARTITION_SIZE);
	}
	
	if (foundOldMacros && foundOldMacros.length > 0)
	{
		for (var i = 0; i < foundOldMacros.length; i++)
		{
			//these macros has no id, so generate a unique id
			var macroId = guid();
			
			foundMarcosIds.push({id: macroId, macroTxt: foundOldMacros[i]});
			
			var params = [];
			
			for (var j = 0; j < regExps.findAttParamsRegExs.length; j++) 
			{
				var paramFound = foundOldMacros[i].match(regExps.findAttParamsRegExs[j]);
				
				params.push(paramFound? AC.fromHtmlEntities(paramFound[1]) : null); 
			}
			
			//get the attachment content
			processAttFn(page.id, page.type, spaceKey, params, macroId, attProcessedFn,
			function(attInfo)
			{
				attProcessedFn(attInfo, 1);
			},
			function(attInfo)
			{
				attProcessedFn(attInfo, 2);
			});
		};
	}
	
	if (macrosCount == 0 && alwaysCallSuccess)
	{
		pageUpdateSuccess(0, 0);
	}
	
	return macrosCount;
};

var MassDiagramsProcessor = function(macroName, readableName, attParams, processAttFn, logDiv, doneFn)
{
	var start = 0, limit = 100;
	var regExps = getMacroRegExps(macroName, attParams);
	
	
	function searchContentForMacro(onSuccess, onError) 
	{
		//keeping the block of AP.require to minimize the number of changes!
		{
			AP.request({
				type: 'GET',
		        url : '/rest/api/content/search?cql=' + encodeURIComponent('macro="' + macroName + '"') + '&start=' + start + '&limit=' + limit,
		        contentType: 'application/json;charset=UTF-8',
		        success: function(resp) {
		        	var resp = JSON.parse(resp);
		        	
		        	var list = resp.results.filter(function(p)
					{
						return p.status != 'trashed'; //remove trashed pages
					});
					
					Array.prototype.push.apply(pagesList, list);
					pagesCount += list.length;
					
					//Support pageing
					if (resp._links && resp._links.next) 
					{
						start += resp.limit; //Sometimes the limit is changed by the server
						searchContentForMacro(onSuccess, onError);
					}
					else
					{
						//Done
						onSuccess();
					}
				},
				error: onError
		    });
		};
	};
	
	function getPageContent(pageId, success, error) 
	{
		//keeping the block of AP.require to minimize the number of changes!
		{
			AP.request({
				type: 'GET',
				url: '/rest/api/content/' + pageId + '/?expand=body.storage,version',
				contentType: 'application/json;charset=UTF-8',
				success: success,
				error: error
			});
		};
	};

	var pagesCount = 0, pagesIndex = 0;
	var pagesList = [];
	
	//Process pages one at a time
	function processPage()
	{
		if (pagesIndex >= pagesCount)
		{
			return true; //loop is finished
		}
		
		var page = pagesList[pagesIndex];
		
		logDiv.append($('<div>' + mxResources.get('confAPageFoundFetch', [AC.htmlEntities(page.title)]) + '...</div>'));
		
		getPageContent(page.id, loadPageSuccess, loadPageError);
		
		return false;
	};
	
	function pageProcessed()
	{
		pagesIndex++;
		
		if (processPage())
		{
			logDiv.append($('<div>' + mxResources.get('confAAllDiagDone', [readableName]) + '</div>'));
			
			if (doneFn)
			{
				doneFn();
			}
		}
	};
	
	function loadPageSuccess(page) 
	{
		page = JSON.parse(page);
		
		logDiv.append($('<div>' + mxResources.get('confAStartedProcessing', [AC.htmlEntities(page.title)]) + '...</div>'));

		var macrosCount = replacePageMacro(page, regExps, processAttFn, function(successfullyConverted, macrosParsed) 
		{
			if (successfullyConverted == macrosParsed)
			{
				logDiv.append($('<div>' + mxResources.get('confAAllDiagInPageDone', [readableName, AC.htmlEntities(page.title)]) + '</div>'));
			}
			else 
			{
				logDiv.append($('<div>' + mxResources.get('confAPartialDiagDone', [successfullyConverted, macrosParsed, readableName, AC.htmlEntities(page.title)]) + '</div>'));
			}
			
			pageProcessed();
		}, function(resp) 
		{
			logDiv.append($('<div style="color:red">' + mxResources.get('confAUpdatePageFailed', [AC.htmlEntities(page.title)]) + '</div>'));
			pageProcessed();
			console.log(resp);
		});
		
		if (macrosCount == 0)
		{
			logDiv.append($('<div>' + mxResources.get('confANoDiagFoundInPage', [readableName, AC.htmlEntities(page.title)]) + '</div>'));
			pageProcessed();
		}
	}; 
	
	function loadPageError(resp) 
	{
		logDiv.append($('<div style="color:red">' + mxResources.get('confAFetchPageFailed') + '</div>'));
		console.log(resp);
		pageProcessed();
	};

	//Code starts execution here
	searchContentForMacro(function success() 
	{
		if (pagesCount == 0)
		{
			logDiv.append($('<div>' + mxResources.get('confANoDiagFound', [readableName]) + '</div>'));
			
			if (doneFn)
			{
				doneFn();
			}
		}
		else
		{
			processPage();
		}
	}, function error(err) 
	{
		logDiv.append($('<div style="color:red">' + mxResources.get('confASearchFailed', [readableName]) + '</div>'));
		console.log(err);
	});
};

var GliffyMassImporter = function(logDiv, doneFn) 
{
	var link = document.createElement('a');
	link.href = location.href;
	link.href = link.href; //to have 'host' populated under IE
	var hostUrl = link.protocol + '//' + link.hostname;
	var convertedDiagrams = {};

	function importGliffyAtt(pageId, pageType, spaceKey, params, macroId, success, error, skip) 
	{
		var attName = params[0];
		var linkedPageId = params[1];
		pageId = linkedPageId || pageId;
		
		if (!attName)
		{ 	//This is a draft diagram that is stored on Gliffy servers and only accessed by 'macroId' and requires authentication
			error({macroId:macroId});
			return;
		}
		
		var diagKey = pageId + '-' + attName;
		logDiv.append($('<div>' + mxResources.get('confAGliffyDiagFound', [AC.htmlEntities(attName), 'Gliffy']) + '...</div>'));

		function localSuccess(info)
		{
			var attInfo = {
				name: attName + ".drawio",
				macroId: macroId,
				contentId: info.contentId,
				contentVer: info.contentVer,
				//TODO get the actual width & height
				//TODO It works with this hardcoded number, but it is better to get the actual value
				width: 500,
				height: 500
			};
			
			if (linkedPageId != null)
			{
				attInfo.isInc = true;
				attInfo.pageId = linkedPageId;
				
				logDiv.append($('<div>' + mxResources.get('confAGliffyDiagImported', [AC.htmlEntities(attName), 'Gliffy (Linked)']) + '</div>'));
			}
			else
			{
				attInfo.revision = info.revision;
				attInfo.previewPng = attName + ".png";
				
				logDiv.append($('<div>' + mxResources.get('confAGliffyDiagImported', [AC.htmlEntities(attName), 'Gliffy']) + '</div>'));
			}
			
			success(attInfo);
		};
		
		function convertDiagram()
		{
			//Get the latest version (no version parameter)
			AP.request({
				url:  "/download/attachments/" + pageId + "/"
					+ encodeURIComponent(attName.trim()), //Conf removes spaces from attachments file names
				success: function(resp) 
				{
					var blob = new Blob([resp], {type : 'application/json'});
					 
					 var formData = new FormData();
					 formData.append('format', 'xml');
			         formData.append("upfile", blob);
					
			         var xhr = new XMLHttpRequest();
			 		 xhr.open('POST', hostUrl + '/import');
			 		
			 		 xhr.onreadystatechange = function()
			 		 {
			 			if (xhr.readyState == 4)
			 			{	
			 				if (xhr.status >= 200 && xhr.status <= 299 &&
								xhr.responseText.substring(0, 13) == '<mxGraphModel')
							{
								//upload draw.io xml as an attachment and also generate the preview image
				 				var xml = xhr.responseText;
				 				AC.saveDiagram(pageId, attName + ".drawio", xml,
								function(resp)
								{
				 					resp = JSON.parse(resp);
				 					var revision = resp.results[0].version.number;
				 					
				 					//Add custom content
				 					AC.saveCustomContent(spaceKey, pageId, pageType, attName + ".drawio", attName + ".drawio", revision, null, null, 
				 							function(responseText)
				 							{
				 								var content = JSON.parse(responseText);
												
							 					var info = {
							 						revision: revision,
							 						contentId: content.id,
							 						contentVer: content.version.number
							 					};
							 					
							 					convertedDiagrams[diagKey] = info;
							 					localSuccess(info);
				 							}, function(err)
				 							{
				 								logDiv.append($('<div style="color:red">' + mxResources.get('confASavingImpGliffyFailed', [AC.htmlEntities(attName), 'Gliffy']) + '</div>'));
							 					console.log(err);
							 					error({macroId:macroId});
				 							});
				 				}, function(err) 
				 				{
				 					logDiv.append($('<div style="color:red">' + mxResources.get('confASavingImpGliffyFailed', [AC.htmlEntities(attName), 'Gliffy']) + '</div>'));
				 					console.log(err);
				 					error({macroId:macroId});
				 				}, false, 'application/vnd.jgraph.mxfile', mxResources.get('confAImportedFromByDraw', [attName]));
							}
			 				else
		 					{
			 					logDiv.append($('<div style="color:red">' + mxResources.get('confAImportGliffyFailed', [AC.htmlEntities(attName), 'Gliffy']) + '</div>'));
			 					console.log(xhr.status, xhr.responseText);
			 					error({macroId:macroId});
		 					}
			 			}
			 		 };
			 		
			 		 xhr.send(formData);
				},
				error: function(resp) 
				{
					logDiv.append($('<div style="color:red">' + mxResources.get('confAFetchGliffyFailed', [AC.htmlEntities(attName), 'Gliffy']) + '</div>'));
					console.log(resp);
					error({macroId:macroId});
				}
			});
		};
		
		var info = convertedDiagrams[diagKey];
		
		if (info === true) //Pending, wait
		{
			var trials = 0;
			
			function waitForConversion()
			{
				trials++;
				info = convertedDiagrams[diagKey];
				
				if (info !== true)
				{
					localSuccess(info)
				}
				else if (trials < 15) //4.5 second wait, during test. It took about 2 sec
				{
					setTimeout(waitForConversion, 300);
				}
				else
				{
					//Try conversion again in case an error occured
					convertDiagram();
				}
			}
			
			setTimeout(waitForConversion, 300);
		}
		else if (info != null)
		{
			//Diagram is already converted, so directly convert the macro
			localSuccess(info);
		}
		else
		{
			convertedDiagrams[diagKey] = true;
			convertDiagram();
		}
	};
	
	logDiv.html("<br>");
	
	MassDiagramsProcessor('gliffy', 'Gliffy', ['name', 'pageid'], importGliffyAtt, logDiv, doneFn);
};

function cleanBrokenCustomContents(logDiv, callback, error)
{
	logDiv.append($('<div>' + mxResources.get('confACheckBrokenDiagLnk') + '</div>'));
	
	var customContent2Del = [];
	var pagesAttachments = {};
	var itemsToProcess = 0;
	var processedItems = 0;
	var allChunksDone = false;
	var pendingCallbacks = {};
	var pageCustomContents = {};
	var customContentsMap = {};
	
	function checkDelDone()
	{
		processedItems++;
		
		if (processedItems == itemsToProcess) 
		{
			callback(pageCustomContents, customContentsMap);
		}
	};
	
	function addToPage(pageId, contentId, contentVer, diagramName)
	{
		if (pageCustomContents[pageId] == null)
		{
			var obj = {};
			obj[diagramName] = {id: contentId, ver: contentVer};
			pageCustomContents[pageId] = obj;
		}
		else if (pageCustomContents[pageId][diagramName] && pageCustomContents[pageId][diagramName].id != contentId) //Sometimes, search returns duplicate entries!
		{
			customContent2Del.push({id: contentId, name: diagramName, duplicate: true});
			return false;
		}
		else
		{
			pageCustomContents[pageId][diagramName] = {id: contentId, ver: contentVer};
		}
		
		return true;
	};
	
	function checkDone(panic)
	{
		function deleteAtt(id, name, duplicate)
		{
			logDiv.append($('<div>' + mxResources.get('confADelDiagLinkOf', [name]) + (duplicate? ' ' + mxResources.get('confADupLnk') : '') + '.</div>'));
			
			AP.request({
	            type: 'DELETE',
				url: '/rest/api/content/' + id,
	            contentType: 'application/json;charset=UTF-8',
	            success: checkDelDone,
	            error: function() 
	            {
	            	logDiv.append($('<div style="color:red">' + mxResources.get('confADelDiagLnkFailed', [name]) + '</div>'));
	            	checkDelDone(); //Consider error as done also as we cannot do something else 
	            }
	        });
		};
		
		if (panic || (allChunksDone && processedItems == itemsToProcess)) 
		{
			processedItems = 0;
			itemsToProcess = customContent2Del.length;
			
			if (itemsToProcess > 0)
			{
				//delete collected broken custom contents then callback
				for (var i = 0; i < customContent2Del.length; i++)
	       		{
					var c2del = customContent2Del[i];
					deleteAtt(c2del.id, c2del.name, c2del.duplicate);
	       		}
			}
			else 
			{
				//if nothing needs to be deleted, callback directly
				callback(pageCustomContents, customContentsMap);
			}
		}
	};
	
    function collectAtts(pageId, callback, error, start, atts)
    {
    	//first call
    	if (start == null)
    	{
    		start = 0;

    		if (typeof(pendingCallbacks[pageId]) === 'undefined')
			{
    			atts = {};
    			pendingCallbacks[pageId] = [callback];
			}
    		else //Another call for the same page before getting the response
    		{
    			pendingCallbacks[pageId].push(callback); //data race?
    			return;
    		}
    	}
    	
    	AP.request({
            type: 'GET',
			url: '/rest/api/content/' + pageId + '/child/attachment?limit=100&expand=version&start=' + start,
            contentType: 'application/json;charset=UTF-8',
            success: function (resp) 
            {
            	resp = JSON.parse(resp);
            	
               	for (var i = 0; i < resp.results.length; i++)
           		{
               		var obj = resp.results[i];
               		atts[obj.title] = obj.version.number;
           		}
               	
               	//Support pageing
				if (resp._links && resp._links.next) 
				{
					start += resp.limit; //Sometimes the limit is changed by the server
					collectAtts(pageId, callback, error, start, atts);
				}
				else
				{
					pagesAttachments[pageId] = atts;
					
					for (var i = 0; i < pendingCallbacks[pageId].length; i++)
					{
						pendingCallbacks[pageId][i]();
					}
					
					delete pendingCallbacks[pageId];
				}
			},
			error: function(err)
			{
				//If not found, mark this page as not found
				if (err.status == 404)
				{
					pagesAttachments[pageId] = false;
					
					for (var i = 0; i < pendingCallbacks[pageId].length; i++)
					{
						pendingCallbacks[pageId][i]();
					}
					
					delete pendingCallbacks[pageId];
				}
				else
				{
					//All other errors are unexpected and will stop the process
					error(err);
				}
			}
		});
    };
    
	function processChunk(start)
	{
		AP.request({
			url: '/rest/api/content/search?cql=' + encodeURIComponent('type="ac:com.mxgraph.confluence.plugins.diagramly:drawio-diagram"') + '&limit=50&expand=body.storage,version&start=' + start,  
			success: function(resp) 
			{
				resp = JSON.parse(resp);
				var list = resp.results;
				
				if (list)
				{
					list = list.filter(function(cc)
					{
						return cc.status != 'trashed'; //remove trashed custom content
					}); 
		
					itemsToProcess += list.length;
					
					//Check each item in the list
					for (var i = 0; i < list.length; i++)
					{
						try 
						{
							(function(attInfo, contentId, contentVer)
							{
								if (!addToPage(attInfo.pageId, contentId, contentVer, attInfo.diagramName))
								{
									processedItems++;
									checkDone();
									return; //No need to check as it is a duplicate
								}

								
								function checkAtt(pageAtts)
								{
									//not found or wrong version
									if (pageAtts == false || pageAtts[attInfo.diagramName] == null || pageAtts[attInfo.diagramName] < attInfo.version)
									{
										customContent2Del.push({id: contentId, name: attInfo.diagramName});
									}
									else 
									{
										customContentsMap[contentId] = attInfo;	
									}
									
									processedItems++;
									checkDone();	
								};
								
								var pageAtts = pagesAttachments[attInfo.pageId];
								
								if (pageAtts != null)
								{
									checkAtt(pageAtts);
								}
								else
								{
									//fetch page attachments
									collectAtts(attInfo.pageId, function() 
									{
										checkAtt(pagesAttachments[attInfo.pageId]);
									}, function(err)
									{
										logDiv.append($('<div style="color:red">' + mxResources.get('confAUnexpErrProcessPage', [attInfo.pageId]) + '.</div>'));
					 					console.log(err);
	
										checkDone(true);
									});
								}
							})(JSON.parse(decodeURIComponent(list[i]["body"]["storage"]["value"])), list[i].id, list[i].version.number);
						}
						catch(e)
						{
							//ignore, this should not happen! But, if it happens, it means a corrupted custom content. Just delete it
							console.log(e);
							customContent2Del.push({id: list[i].id, name: list[i].title});
							processedItems++;
							checkDone();
						}
					}
				}
				
				checkDone();
				
				//Support pageing
				if (resp._links && resp._links.next) 
				{
					start += resp.limit; //Sometimes the limit is changed by the server
					processChunk(start);
				}
				else
				{
					allChunksDone = true;
					checkDone();
				}
			},
			error : error
		});
	};
	
	processChunk(0);
};

var DrawIoDiagramsIndexer = function(logDiv, doneFn)
{
	var pageCustomContents = {}, customContentsMap = {};
	
	function fixDrawIoCustomContent(pageId, pageType, spaceKey, params, macroId, success, error, skip) 
	{
		//['diagramName', 'contentId', 'contentVer', 'revision', 'width', 'height', 'tempPreview', 'zoom', 'lbox', 'diagramDisplayName', 'tbstyle', 'links', 'simple', 'hiResPreview', 'inComment', 'aspect', 'pageId', 'baseUrl', 'diagramUrl', 'includedDiagram', 'aspectHash', 'imgPageId', 'attVer', 'custContentId', 'pCenter']
		var attName = params[0];
		var contentId = params[1] || params[23];
		var contentVer = params[2];
		var revision = params[3];
		var width = params[4];
		var height = params[5];
		var tempPreview = params[6];
		var zoom = params[7];
		var lbox = params[8];
		var diagramDisplayName = params[9];
		var tbstyle = params[10];
		var links = params[11];
		var simple = params[12];
		var hiResPreview = params[13];
		var inComment = params[14];
		var aspect = params[15];
		var macroPageId = params[16];
		var macroBaseUrl = params[17];
		var pCenter = params[24];
			
		logDiv.append($('<div>' + mxResources.get('confADiagFoundIndex', [AC.htmlEntities(attName)]) + '...</div>'));
		
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
			lbox: lbox,
			diagramDisplayName: diagramDisplayName,
			tbstyle: tbstyle,
			links: links,
			simple: simple,
			hiResPreview: hiResPreview,
			inComment: inComment,
			aspect: aspect,
			pCenter: pCenter
		};
		
		function addNewCustomContent()
		{
			AC.saveCustomContent(spaceKey, pageId, pageType, attName, attName, revision, null, null, 
					function(responseText)
					{
						logDiv.append($('<div>' + mxResources.get('confADiagIndexSucc', [AC.htmlEntities(attName)]) + '</div>'));
						
						var content = JSON.parse(responseText);
					
						attInfo.contentId = content.id;
						attInfo.contentVer = content.version.number;
					
						success(attInfo);
					}, function(err)
					{
						logDiv.append($('<div style="color:red">' + mxResources.get('confAIndexDiagFailed', [AC.htmlEntities(attName)]) + '</div>'));
	 					console.log(err);
	 					error(attInfo);
					});
		};
		
		var info = customContentsMap[contentId];

		//Copy & Paste macros result in macros that belongs to another page. We can simply skip those macros
		if (macroPageId != pageId)
		{
			logDiv.append($('<div>' + mxResources.get('confASkipDiagOtherPage', [AC.htmlEntities(attName)]) + '</div>'));
			skip(attInfo);
		}
		else if (info == null && pageCustomContents[pageId] != null && pageCustomContents[pageId][attName] != null) //Reuse existing one in case the same diagram is used more than once
		{
			logDiv.append($('<div>' + mxResources.get('confADiagIndexSucc', [AC.htmlEntities(attName)]) + '</div>'));
			var exiting = pageCustomContents[pageId][attName];
			attInfo.contentId = exiting.id;
			attInfo.contentVer = exiting.ver;
			success(attInfo);
		}
		else if (info == null || info.pageId != pageId || info.diagramName != attName || info.version != revision) //Invalid contentId (not found) or invalid content, add it
		{
			addNewCustomContent(); //Add a correct custom content
		}
		else if (macroBaseUrl != baseUrl) //This can happen when the Confluence domain is changed
		{
			logDiv.append($('<div>' + mxResources.get('confADiagIndexSucc', [AC.htmlEntities(attName)]) + '</div>'));
			success(attInfo);
		}
		else
		{
			//nothing needs to be done, just skip
			logDiv.append($('<div>' + mxResources.get('confADiagUptoDate', [AC.htmlEntities(attName)]) + '</div>'));
			skip(attInfo);
		}
	};

	logDiv.html("<br>");
	
	//Remove existing custom contents that are broken
	cleanBrokenCustomContents(logDiv, function(pageCustomContents_p, customContentsMap_p) 
	{
		pageCustomContents = pageCustomContents_p;
		customContentsMap = customContentsMap_p;
		
		logDiv.append($('<div>' + mxResources.get('done') + '.</div>'));
		logDiv.append($('<div>' + mxResources.get('confACheckPagesWDraw') + '</div>'));
		
		MassDiagramsProcessor('drawio', 'draw.io', 
				drawioMacroParams,
				fixDrawIoCustomContent, logDiv, doneFn);
	});
};

function getAndApplyTranslation(callback)
{
	AP.user.getLocale(function(locale)
	{
		if (locale != null)
		{
			var dash = locale.indexOf('_');
			
			if (dash >= 0)
			{
				locale = locale.substring(0, dash);
			}
			
			AC.initI18nAsync(locale, function()
			{
				//HTML elements localization
				var i18nElems = document.querySelectorAll('*[data-i18n]'); //get all elements having data-i18n attribute, should be fine given a small html file
				
				for (var i = 0; i < i18nElems.length; i++)
				{
					var i18nKey = i18nElems[i].getAttribute('data-i18n');
					i18nElems[i].innerHTML = AC.htmlEntities(mxResources.get(i18nKey, null, i18nElems[i].innerHTML));
				}
				
				callback();
			});
		}
		else
		{
			callback();
		}
	});
};

var LucidConnMassImporter = function(docsMap, importExtensionId, logDiv, doneFn)
{
	var link = document.createElement('a');
	link.href = location.href;
	link.href = link.href; //to have 'host' populated under IE
	var hostUrl = link.protocol + '//' + link.hostname;

	function importLucidDoc(pageId, pageType, spaceKey, params, macroId, success, error, skip) 
	{
		var docId = params[0];
		var autoSize = params[1];
		var pageCount = params[2];
		var pages = params[3];
		var autoUpdate = params[4]; //TODO How can we get an old version based on the "updated" timestamp?
		var width = params[5];
		var height = params[6];
		var align = params[7];
		var updated = params[8];
		
		var docInfo = docsMap[docId];
		var docName = docInfo? docInfo.text : docId;
		var diagramName = docName + '-' + docId + '.drawio';
		var diagramDisplayName = docName;
		
		logDiv.append($('<div>' + mxResources.get('confAGliffyDiagFound', [AC.htmlEntities(docName), 'Lucidchart']) + '...</div>'));
		
		chrome.runtime.sendMessage(importExtensionId, {msg: 'fileContent', docId: docId}, function(resp)
		{
			if (resp.error)
			{
				logDiv.append($('<div style="color:red">' + mxResources.get('confAImportGliffyFailed', [AC.htmlEntities(docName), 'Lucidchart']) + '</div>'));
				error({macroId:macroId});
			}
			else
			{
				try 
				{
					var drawXML = LucidImporter.importState(resp.content);
					var pageIndex = pages? parseInt(pages) : 1;
					var imgWidth = autoSize == 1? null : width;
					var imageData = null, imageType = null;
					
					chrome.runtime.sendMessage(importExtensionId, 
						{msg: 'fileImage', docId: docId, pageId: pageIndex <= pageCount? (pageIndex - 1) : 0, width: imgWidth}, function(resp)
					{
						//If image failed, just warn. No need to skip this file
						if (resp.error)
						{
							logDiv.append($('<div style="color:orange">' + mxResources.get('confASavingLucidDiagImgFailed', [AC.htmlEntities(docName), 'Lucidchart']) + '</div>'));
						}
						else
						{
							imageData = resp.content;
							var p = resp.content.indexOf('base64,');
							imageData = resp.content.substring(p + 7); //7 is the length of "base64,"
							imageType = resp.content.substring(5, p-1); //5 is the length of "data:"
						}
						
						AC.saveDiagram(pageId, diagramName, drawXML,
						function(resp)
						{
		 					resp = JSON.parse(resp);
		 					
		 					var attInfo = {
		 						name: diagramName,
		 						diagramDisplayName: diagramDisplayName,
		 						revision: resp.results[0].version.number,
		 						macroId: macroId,
 								width: autoSize == 1? null : width,
 								height: autoSize == 1? null : height,
								pCenter: align == 'center'? 1 : null,
								aspect: pages? ((pageIndex - 1) + ' 1') : null
	 						};
		 					
		 					//Add custom content
		 					AC.saveCustomContent(spaceKey, pageId, pageType, diagramName, diagramDisplayName, attInfo.revision, null, null, 
 							function(responseText)
 							{
 								var content = JSON.parse(responseText);
								
 								attInfo.contentId = content.id;
 								attInfo.contentVer = content.version.number;
								
 								if (imageData != null)
 								{
 									AC.saveDiagram(pageId, diagramName + '.png', AC.b64toBlob(imageData, imageType),
									function()
									{
 										logDiv.append($('<div>' + mxResources.get('confALucidDiagImgImported', [AC.htmlEntities(docName), 'Lucidchart']) + '</div>'));
										logDiv.append($('<div>' + mxResources.get('confAGliffyDiagImported', [AC.htmlEntities(docName), 'Lucidchart']) + '</div>'));
										success(attInfo);
									}, function()
									{
										logDiv.append($('<div style="color:orange">' + mxResources.get('confASavingLucidDiagImgFailed', [AC.htmlEntities(docName), 'Lucidchart']) + '</div>'));
										success(attInfo);
									}, false, 'image/png', mxResources.get('drawPrev'));
 								}
 								else
 								{
 									logDiv.append($('<div>' + mxResources.get('confAGliffyDiagImported', [AC.htmlEntities(docName), 'Lucidchart']) + '</div>'));
 									success(attInfo);
 								}
 							}, function(err)
 							{
 								logDiv.append($('<div style="color:red">' + mxResources.get('confASavingImpGliffyFailed', [AC.htmlEntities(docName), 'Lucidchart']) + '</div>'));
			 					console.log(err);
			 					error({macroId:macroId});
 							});
		 					
		 				}, function(err) 
		 				{
		 					logDiv.append($('<div style="color:red">' + mxResources.get('confASavingImpGliffyFailed', [AC.htmlEntities(docName), 'Lucidchart']) + '</div>'));
		 					console.log(err);
		 					error({macroId:macroId});
		 				}, false, 'application/vnd.jgraph.mxfile', mxResources.get('confAImportedFromByDraw', [docName]));
					});
				}
				catch(e)
				{
					console.log(e);
					logDiv.append($('<div style="color:red">' + mxResources.get('confAImportGliffyFailed', [AC.htmlEntities(docName), 'Lucidchart']) + '</div>'));
					error({macroId:macroId});
				}
			}
		});
	};
	
	logDiv.html("<br>");
	
	MassDiagramsProcessor('lucidchart', 'Lucidchart', 
			['documentId', 'autoSize', 'pageCount', 'pages', 'autoUpdate', 'width', 'height', 'align', 'updated'], 
			importLucidDoc, logDiv, doneFn);
};
