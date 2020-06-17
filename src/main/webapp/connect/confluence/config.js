//Logs uncaught errors
window.onerror = function(message, url, linenumber, colno, err)
{
	message = 'Confluence Cloud Config: ' + ((message != null) ? message : '');
	
	AC.logError(message, url, linenumber, colno, err);
};

var collectAllPages = function(callback, error)
{
	var start = 0, limit = 200;
	var pages = [];
	
	function getChunck()
	{
		AP.request({
			type: 'GET',
			url: '/rest/api/content?start=' + start + '&limit=' + limit,
			contentType: 'application/json;charset=UTF-8',
			success: function(resp) {
				var resp = JSON.parse(resp);
				
				for (var i = 0; i < resp.results.length; i++)
				{
					pages.push({
						id: resp.results[i].id,
						title: resp.results[i].title,
						type: resp.results[i].type,
						spaceKey: AC.getSpaceKey(resp.results[i]._expandable? resp.results[i]._expandable.space : '')
					});
				}
				
				//Support pageing
				if (resp._links && resp._links.next) 
				{
					start += resp.limit; //Sometimes the limit is changed by the server
					getChunck();
				}
				else
				{
					callback(pages);
				}
			},
			error: error
		});
	};
	
	getChunck();	
};

var exportPageIds = function(exportTxt)
{
	$('#busyIcon').show();
	var idExportInfo = $('#idExportInfo');
	var errors = [];
	var quoteCharRegex = /\"/g;
	
	function convertMimeType(doneFn)
	{
		idExportInfo.html('Processing draw.io diagrams...');
		
		collectDrawAtts(function(attList)
		{
			var doneIndex = 0;
			var PARTITION_SIZE = 5;
			
			//Process macros 5 (PARTITION_SIZE) at a time to throttle the process
			function processPartition(limit)
			{
				function partitionDone()
				{
					doneIndex++;
					
					if (attList.length != limit && doneIndex == limit)
					{
						processPartition(limit + PARTITION_SIZE);
					}
					else if (attList.length == limit)
					{
						//Repeat twice since the API return duplicate entries!!
						if (doneFn) 
						{
							idExportInfo.html('Processing draw.io diagrams is done.');
							doneFn(mimeConversionDone);
						}
					}
				};
				
				
				limit = Math.min(attList.length, limit);
				
				if (attList.length == 0)
				{
					partitionDone();
				}
				
				for (var i = doneIndex; i < limit; i++)
				{
					var att = attList[i];
					idExportInfo.html('Checking ' + att.title + '...');
					
					att.metadata.mediaType = 'application/vnd.jgraph.mxfile';
					
					AP.request({
						type: 'PUT',
						url: '/rest/api/content/' + att.container.id + '/child/attachment/' + att.id,
						data: JSON.stringify({
							id: att.id,
							version: att.version,
							type: 'attachment',
							metadata: att.metadata
						}),
						contentType: 'application/json;charset=UTF-8',
						success: partitionDone,
						error: function() 
						{
							errors.push(mxResources.get('confAErrCheckDrawDiag'));
							partitionDone();
						}
					});
				};
			}
			
			processPartition(PARTITION_SIZE);
		}, 
		function()
		{
			errors.push(mxResources.get('confAErrFetchDrawList'));
		});
	};

	//Code adapted from EditorUi.prototype.doSaveLocalFile
	function downloadTxtFile(data, filename)
	{
		var mimeType = 'text/plain';
		
		// Newer versions of IE
		if (window.Blob && navigator.msSaveOrOpenBlob)
		{
			var blob = new Blob([data], {type: mimeType});
			navigator.msSaveOrOpenBlob(blob, filename);
		}
		else
		{
			var a = document.createElement('a');
			
			// Workaround for mxXmlRequest.simulate no longer working in PaleMoon
			// if this is used (ie PNG export broken after XML export in PaleMoon)
			// and for "WebKitBlobResource error 1" for all browsers on iOS.
			var useDownload = (navigator.userAgent == null ||
				navigator.userAgent.indexOf("PaleMoon/") < 0) &&
				typeof a.download !== 'undefined';
			
			// Workaround for Chromium 65 cross-domain anchor download issue
			if (mxClient.IS_GC && navigator.userAgent != null)
			{
				var raw = navigator.userAgent.match(/Chrom(e|ium)\/([0-9]+)\./)
				var vers = raw ? parseInt(raw[2], 10) : false;
				useDownload = vers == 65 ? false : useDownload;
			}
			
			if (useDownload)
			{
				a.href = URL.createObjectURL(new Blob([data], {type: mimeType}));
				a.download = filename;
				document.body.appendChild(a);
				
				try
				{
					window.setTimeout(function()
					{
						URL.revokeObjectURL(a.href);
					}, 20000);

					a.click();
					a.parentNode.removeChild(a);
				}
				catch (e)
				{
					// ignore
				}
			}
			else
			{
				alert('Your browser does not support file download');
			}
		}
	};
	
	
	function mimeConversionDone()
	{
		var exportStr = 'cloud;\nbaseUrl=' + baseUrl + ';\n';
		
		function safe(str)
		{
			if (typeof str === 'undefined' || str === null)
				return '';

			str = str.replace(quoteCharRegex, '""');

			var needsQuotes = str.indexOf('"') > -1
							|| str.indexOf('\n') > -1
							|| str.indexOf('\r') > -1
							|| str.indexOf(';') > -1
							|| str.indexOf(',') > -1
							|| str.charAt(0) === ' '
							|| str.charAt(str.length - 1) === ' ';

			return needsQuotes ? '"' + str + '"' : str;
		}
		
		collectAllPages(function(pages)
		{
			for (var i = 0; i < pages.length; i++)
			{
				exportStr += pages[i].id + ',' + safe(pages[i].title) + ',' + pages[i].spaceKey + ';\n';
			}
			
			exportTxt.val(exportStr);
			
			$('#pageIdsDownload').show();
			$('#pageIdsDownload').click(function()
			{
				downloadTxtFile(exportStr, 'pageIds.csv');
			});
			
			if (errors.length > 0)
			{
				$('#idExportErrors').html(errors.join('<br>'));
			}
			
			$('#busyIcon').hide();
		}, function()
		{
			errors.push(mxResources.get('confAErrFetchPageList'));
			exportTxt.val(exportStr + '\n\n' + mxResources.get('confAErrOccured'));
		});
	};
	
	//Cloud import doesn't need mimeType fixing 
	if ($('#expTrgCloud').is(':checked'))
	{
		mimeConversionDone();
	}
	else
	{
		//Repeat twice since the API return duplicate entries!!
		convertMimeType(convertMimeType);
	}
};

function showError()
{
	$('#confError').show();
	$('#createSpace').hide();
};

var configPageId = null;
var libsPageId = null;
var CONFIG_FILENAME = 'configuration.json';

function getConfigFile(callback, error)
{
	AP.request({
		url: '/download/attachments/' + configPageId + '/' + encodeURIComponent(CONFIG_FILENAME),
		success: callback,
		error : error
	});
};

function createAttFile(pageId, filename, mimeType, content, callback, error, checkExist)
{
	function doCreateFile()
	{
		var attFile = new Blob([content], {type : mimeType});
		attFile.name = filename;
		 
		var reqData = {file: attFile, minorEdit: true};
		 
		AP.request({
			type: 'PUT',
			data: reqData,
			url:  '/rest/api/content/' + pageId + '/child/attachment',
			contentType: 'multipart/form-data',
			success: callback,
			error: error
		});
	};
	
	//check file exists
	if (checkExist)
	{
		AP.request({
			type: 'GET',
			url:  '/rest/api/content/' + pageId + '/child/attachment',
			contentType: 'application/json;charset=UTF-8',
			success: function(resp)
			{
				resp = JSON.parse(resp);
				var found = false;
				
				for (var i = 0; i < resp.results.length; i++)
        		{
	        		var item = resp.results[i];
	        		
	        		if (item.title == filename)
        			{
	        			found = true;
	        			break;
        			}
        		}
				
				if (!found)
				{
					doCreateFile();
				}
				else
				{
					callback(true);
				}
			},
			error: error
		});
	}
	else
	{
		doCreateFile();
	}
};

var lastConfigVersion = 1;

function checkConfigAndSave()
{
	var editor = document.querySelector('#configJSON');
	editor.parentNode.removeAttribute('data-line');
	var content = editor.textContent;
	$('#jsonMsg').css('color', '#000000').html('<img src="/images/spin.gif"> ' + mxResources.get('saving') + '...');
		
	try
	{
		if (content != null && content.trim().length > 0)
		{	
			var config = JSON.parse(content);
			
			// is user didn't set version manually or forgot to increase - increase it
			if (!config.version || config.version <= lastConfigVersion) 
			{
				lastConfigVersion = lastConfigVersion + 0.1;
				config.version = Number(lastConfigVersion.toFixed(1)).toString();
				content = JSON.stringify(config);
			}
		}
		else
		{
			content = '';
		}
		
		createAttFile(configPageId, CONFIG_FILENAME, 'application/json', content, function(resp)
		{
			$('#jsonMsg').css('color', '#00bb00').html(mxResources.get('savedSucc'));
		}, function()
		{
			$('#jsonMsg').css('color', '#bb0000').html(mxResources.get('confASaveFailedErr'));
		});
	}
	catch(e)
	{
		var errMsg = e.message;
		
		try
		{
			var formatedErrMsg = errMsg, lineNum = -1;
			
			if (errMsg.indexOf('at position') > 0)
			{
				var errPos = parseInt(errMsg.match(/at position(:| )(\d+)/)[2]);
				var txtBefore = content.substring(0, errPos);
				var lineNum = (txtBefore.match(/\n/g) || []).length + 1;
				var lastNL = txtBefore.lastIndexOf('\n');
				var linePos = errPos - (lastNL > 0? lastNL : 0);
				
				formatedErrMsg = errMsg + ' [' + mxResources.get('line') + ' ' + lineNum + ', ' + mxResources.get('character') + ' ' + linePos + ']';
			}
			else if (errMsg.indexOf('at line ') > 0)
			{
				var lineNum = parseInt(errMsg.match(/at line (\d+)/)[1]);
			}
			
			$('#jsonMsg').css('color', '#bb0000').html(formatedErrMsg);
			
			if (lineNum >= 0)
			{
				editor.parentNode.setAttribute('data-line', lineNum);
				Prism.highlightElement(editor);
				editor.parentNode.scrollTo(0, (lineNum - 1) * 20);
			}
		}
		catch(e2)
		{
			$('#jsonMsg').css('color', '#bb0000').html(errMsg);
		}		
	}
};

var fixMissingComponents = function(existingPages)
{
	var doneCount = 0;
	
	function checkAllDone()
	{
		doneCount++;
		
		if (doneCount == 3)
		{
			getConfigFile(function(configContent)
			{
				//Initialize the editor
				var editor = document.querySelector('#configJSON');
				
				try
				{
					var config = JSON.parse(configContent);
					
					if (config.version)
					{
						lastConfigVersion = parseFloat(config.version);
					}
					
					configContent = JSON.stringify(config, null, 2);
				}
				catch(e) {} //Ignore
				
				editor.textContent = configContent;
				editor = bililiteRange.fancyText(editor, Prism.highlightElement, 50);
				
				// add the undo's
				bililiteRange(editor).undo(0).data().autoindent = true; // init
				
				editor.addEventListener ('keydown', function(evt)
				{
					if (evt.keyCode === 9) // tab key
					{
						// now insert four non-breaking spaces for the tab key
				        var editor = evt.target;
				        var doc = editor.ownerDocument.defaultView;
				        var sel = doc.getSelection();
				        var range = sel.getRangeAt(0);
				        
				        var tabNode = document.createTextNode("\t");
				        range.insertNode(tabNode);

				        range.setStartAfter(tabNode);
				        range.setEndAfter(tabNode); 
				        sel.removeAllRanges();
				        sel.addRange(range);
				        
						evt.preventDefault(); // this will prevent us from tabbing out of the editor
					}
					// control z
					else if ((evt.ctrlKey || evt.metaKey)  && evt.which == 90) 
					{
						bililiteRange.undo(evt);
					}
					// control y
					else if ((evt.ctrlKey && evt.which == 89) || (evt.metaKey && evt.shiftKey  && evt.which == 90)) 
					{
						bililiteRange.redo(evt);
					}
					
					$('#jsonMsg').html('&nbsp;');
				});

				$('#busyIndicator').hide();
				$('#createSpace').hide();
				$('#manageConfig').show();
				$('#cLibTabHeader').show();
				$('#cTempTabHeader').show();
				
				fetchCustomLibs();
				setupUploadLibrary();
			}, showError);
		}
	};
	
	function createPage(title, desc, callback)
	{
		if (existingPages[title])
		{
			if (callback) 
			{
				callback(existingPages[title], true);
			}
			else
			{
				checkAllDone();
			}
			return;
		}
		
		AP.request({
            type: 'POST',
            url: '/rest/api/content',
            contentType: 'application/json;charset=UTF-8',
            data: JSON.stringify({
            	space: {
            	    key: 'DRAWIOCONFIG'
            	},
            	title: title,
            	status: 'current',
            	type: 'page',
            	body: {
            		storage: {
            			value: desc,
            			representation: 'storage'
            		}
        	    }
            }),
            success: function (resp) 
            {
            	if (callback)
        		{
            		callback(JSON.parse(resp).id);
        		}
            	else
            	{
            		checkAllDone();
            	}
            },
            error: showError
        });
	};
	
	//Note: name shouldn't be translated as we search by page name
	createPage('Configuration', mxResources.get('confAConfPageDesc'), function(pageId, pageExist)
	{
		configPageId = pageId;
		createAttFile(pageId, CONFIG_FILENAME, 'application/json', '{}', checkAllDone, showError, pageExist);
	});
	
	createPage('Libraries', mxResources.get('confALibPageDesc'), function(pageId)
	{
		libsPageId = pageId;
		checkAllDone();
	});
	
	createPage('Templates', mxResources.get('confATempPageDesc'), function(pageId)
	{
		$('#tempPageLnk').attr('href', baseUrl + '/spaces/DRAWIOCONFIG/pages/' + pageId);
		checkAllDone();
	});
};

var createConfigSpace = function()
{	
	$('#createSpace').html('<img src="/images/spin.gif"> ' + mxResources.get('working') + '...');
	
	AP.request({
        type: 'POST',
        url: '/rest/api/space',
        contentType: 'application/json;charset=UTF-8',
        data: JSON.stringify({
        	key: 'DRAWIOCONFIG',
        	name: 'draw.io Configuration',
        	description: {
        		plain: {
        			value: mxResources.get('confAConfSpaceDesc'),
        			representation: 'plain'
        		}
    	    }
        }),
        success: function () 
        {
        	fixMissingComponents({});
        },
        error: showError
    });
};

function addLibRow(item)
{
	var libTable = $('#curLibs');
	
	var tr = $('<tr>');
	libTable.append(tr);
	var title = $('<td>');
	tr.append(title);
	title.text(item.title);
	var action = $('<td style="text-align: center;padding: 3px 0 0 0;">')
	tr.append(action);
	var delBtn = $('<img src="/images/delete.png" style="width: 20px;cursor: pointer" title="' + mxResources.get('delete') + '">');
	delBtn.click(function(e)
	{
		if (confirm("Are you sure?"))
		{
			AP.request({
				type: 'DELETE',
				url:  '/rest/api/content/' + item.id,
				contentType: 'application/json;charset=UTF-8',
				success: function(resp)
				{
					tr.remove();
					
					if (libTable.find('td').length == 0)
					{
						$('<div id="noLibMsg">' + mxResources.get('confANoCustLib') + '</div>').insertAfter(libTable);
					}
				},
				error: function()
				{
					alert(mxResources.get('delFailed'));
				}
			});
		}
	});
	action.append(delBtn);	
	
	var idTd = $('<td>');
	//This code is from RemoteLibrary. It's better to call that code but it is not available in this page
	var libConfigId = 'R' + encodeURIComponent(JSON.stringify([item.id, item.title, item._links.download]));
	var showConfigIDBtn = $('<button class="aui-button showIDBtn">' + mxResources.get('showID') + '</button>');
	showConfigIDBtn.click(function()
	{
		$('.libConfigID').show();
		$('.showIDBtn').hide();
	});
	
	idTd.append(showConfigIDBtn);
	idTd.append($('<span class="libConfigID" style="display: none">' + libConfigId + '</span>'));
	tr.append(idTd);
};

function fetchCustomLibs()
{
	AP.request({
		type: 'GET',
		url:  '/rest/api/content/' + libsPageId + '/child/attachment',
		contentType: 'application/json;charset=UTF-8',
		success: function(resp)
		{
			resp = JSON.parse(resp);
			
			if (resp.results.length == 0)
			{
				$('<div id="noLibMsg">' + mxResources.get('confANoCustLib') + '</div>').insertAfter('#curLibs');
			}
			else
			{
				for (var i = 0; i < resp.results.length; i++)
	    		{
					addLibRow(resp.results[i]);
	    		}
			}
		},
		error: function()
		{
			
		}
	});
};

function setupUploadLibrary()
{
    var uploadLib = document.getElementById('uploadLib');
    
    uploadLib.addEventListener("click", function () 
    {
        this.value = null;
    });

    uploadLib.addEventListener('change', function (e) {
    	var libFile = uploadLib.files[0];
    	
    	if (libFile.type != 'text/xml')
		{
    		$('#cLibMsg').css('color', '#bb0000').html(mxResources.get('confAIncorrectLibFileType'));
    		return;
		}
    	
    	$('#cLibMsg').css('color', '#000000').html('<img src="/images/spin.gif"> ' + mxResources.get('uploading') + '...');
    	
    	reader = new FileReader();
    	
        reader.onload = function(event) 
        {
        	createAttFile(libsPageId, libFile.name, libFile.type, event.target.result, function(resp)
    			{
        			if (resp == true)
    				{
        				$('#cLibMsg').css('color', '#bb0000').html(mxResources.get('confALibExist'));
    				}
        			else
    				{
        				$('#noLibMsg').remove();
        				addLibRow(JSON.parse(resp).results[0]);
        				$('#cLibMsg').css('color', '#00bb00').html(mxResources.get('confAUploadSucc'));
    				}
    			}, function()
    			{
    				$('#cLibMsg').css('color', '#bb0000').html(mxResources.get('confAUploadFailErr'));
    			}, true);
        }
        
        reader.readAsText(libFile);
    }, false);
};

function collectDrawAtts(success, error)
{
	var allTextPlainAtts = [];
	var drawioAtts = [];
	var pngAttMap = {};
	var start = 0, limit = 200;
	var searchUrl = '/rest/api/content/search?cql=' + encodeURIComponent('type=attachment') + '&expand=metadata,container,version'
	//Collect all attachments in the system and filter them into text/plain (old draw.io mime type) and png. 
	//	Then, if a text/plain attachment has an associated png image, then most probably this is a draw.io diagram
	function getChunck()
	{
		AP.request({
			type: 'GET',
			url: searchUrl + '&start=' + start + '&limit=' + limit,
			contentType: 'application/json;charset=UTF-8',
			success: function(resp) {
				var resp = JSON.parse(resp);

				for (var i = 0; i < resp.results.length; i++)
				{
					var att = resp.results[i];
					var mimeType = att.metadata.mediaType;
					
					if (mimeType == 'text/plain')
					{
						allTextPlainAtts.push(att);
					}
					else if (mimeType == 'image/png')
					{
						pngAttMap[att.container.id + '%' + att.title] = true;
					}
				}
				
				//Support pageing
				if (resp._links && resp._links.next) 
				{
					start += resp.limit; //Sometimes the limit is changed by the server
					getChunck();
				}
				else
				{
					for (var i = 0; i < allTextPlainAtts.length; i++)
					{
						var att = allTextPlainAtts[i];
						
						if (pngAttMap[att.container.id + '%' + att.title + '.png'])
						{
							drawioAtts.push(att);
						}
					}
					
					success(drawioAtts);
				}
			},
			error: error
		});
	};
	
	getChunck();
};

function processCustomContents(pagesList, srcToDstMap, custCntMap, impBaseUrl, index, allDone, logDiv)
{
	if (index >= pagesList.length) 
	{
		allDone();
		return;
	}
	
	var pageInfo = pagesList[index];
	var curPageId = pageInfo.id;
	logDiv.append($('<div>' + mxResources.get('confAPrcsDiagInPage', [AC.htmlEntities(pageInfo.name)]) + '...</div>'));
	
	//No need for paging?
	AP.request({
		type: 'GET',
		url: '/rest/api/content/' + curPageId + '/child/ac:com.mxgraph.confluence.plugins.diagramly:drawio-diagram?expand=body.storage,version&limit=200',
		contentType: 'application/json;charset=UTF-8',
		success: function(custCnts) 
		{
			var custCnts = JSON.parse(custCnts);
			var ccIndex = 0;
			
			function checkDone()
			{
				ccIndex++;
				
				if (custCnts.size <= ccIndex)
				{
					logDiv.append($('<div>' + mxResources.get('confAPrcsDiagInPageDone', [AC.htmlEntities(pageInfo.name)]) + '</div>'));
					processCustomContents(pagesList, srcToDstMap, custCntMap, impBaseUrl, ++index, allDone, logDiv);
				}
			};
			
			if (custCnts.size == 0)
			{
				checkDone();
			}
			
			//build map by spaceKey and title -> id, version
			for (var i = 0; i < custCnts.size; i++)
			{
				(function(custCnt)
				{
					var spaceKey = AC.getSpaceKey(custCnt._expandable? custCnt._expandable.space : '');
					
					if (custCntMap[spaceKey] == null)
					{
						custCntMap[spaceKey] = {};
					}
					
					//Check custom content internal pageId and fix if needed
					var info = JSON.parse(decodeURIComponent(custCnt.body.storage.value));

					custCntMap[spaceKey][custCnt.title] = {id: custCnt.id, version: custCnt.version.number, revision: info.version};
					
					if (curPageId != info.pageId)
					{
						logDiv.append($('<div>' + mxResources.get('confAImpDiagram', [AC.htmlEntities(custCnt.title)]) + '...</div>'));
						var custCntObj = custCntMap[spaceKey][custCnt.title];
						info.name = info.diagramName;
						info.pageId = curPageId;
						info.revision = info.version;
						
						processDiagramLinks(info, srcToDstMap, spaceKey, impBaseUrl, function(resp)
						{
							if (resp != null)
							{
								try
								{
									info.version = JSON.parse(resp).results[0].version.number;
									custCntObj.revision = info.version;
								}
								catch(e){} //ignore
							}
							
							AC.saveCustomContent(spaceKey, curPageId, pageInfo.type, info.diagramName, custCnt.title, info.version,
									custCnt.id, custCnt.version.number,
									function(responseText) 
									{
										var content = JSON.parse(responseText);
										//Update info
										custCntObj.id = content.id;
										custCntObj.version = content.version.number;
										logDiv.append($('<div>' + mxResources.get('confImpDiagramSuccess', [AC.htmlEntities(custCnt.title)]) + '</div>'));
										checkDone();
									}, function()
									{
										logDiv.append($('<div style="color:red">' + mxResources.get('confAUpdateDgrmCCFailed', [AC.htmlEntities(custCnt.title)]) + '</div>'));
										checkDone();
									}, info.comments);
						}, function()
						{
							logDiv.append($('<div style="color:red">' + mxResources.get('confAImpDiagramError', [AC.htmlEntities(custCnt.title)]) + '</div>'));
							checkDone();
						}, logDiv);
					}
					else
					{
						logDiv.append($('<div style="color:orange">' + mxResources.get('confAImpDiagramFailed', [AC.htmlEntities(custCnt.title)]) + '</div>'));
						checkDone();
					}
				})(custCnts.results[i], i);
			}
		},
		error: function()
		{
			logDiv.append($('<div style="color:red">' + mxResources.get('confAErrPrcsDiagInPage', [AC.htmlEntities(pageInfo.name)]) + '</div>'));
			processCustomContents(pagesList, srcToDstMap, custCntMap, impBaseUrl, ++index, allDone, logDiv);
		}
	});
};

function processPageIdsImport(pagesList, srcToDstMap, custCntMap, drawioRegExps, incDrawioRegExps, impBaseUrl, index, allDone, logDiv)
{
	if (index >= pagesList.length) 
	{
		allDone();
		return;
	}

	var pageInfo = pagesList[index];
	var curPageId = pageInfo.id;
	logDiv.append($('<div>' + mxResources.get('confAPrcsMacrosInPage', [AC.htmlEntities(pageInfo.name)]) + '...</div>'));

	function fixDrawIoMacros(pageId, pageType, spaceKey, params, macroId, success, error, skip) 
	{
		//['diagramName', 'contentId', 'contentVer', 'revision', 'width', 'height', 'tempPreview', 'zoom', 'lbox', 'diagramDisplayName', 'tbstyle', 'links', 'simple', 'hiResPreview', 'inComment', 'aspect', 'pageId', 'baseUrl']
		//inc-drawio macro specific params
		//'diagramUrl', 'includedDiagram', 'aspectHash', 'imgPageId', 'attVer', 'custContentId'
		//'pCenter'
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
		
		var diagramUrl = params[18];
		var isInc = params[19] == '1';
		var aspectHash = params[20];
		var imgPageId = params[21];
		var attVer = params[22];
		var pCenter = params[24];
		logDiv.append($('<div>' + mxResources.get('confAFixingMacro', [AC.htmlEntities(attName)]) + '...</div>'));
		
		var macroCurPageId = srcToDstMap[macroPageId];
		var attInfo = {
			pageId: macroCurPageId || pageId,
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
			diagramDisplayName: diagramDisplayName || attName,
			tbstyle: tbstyle,
			links: links,
			simple: simple,
			hiResPreview: hiResPreview,
			inComment: inComment,
			aspect: aspect,
			diagramUrl: diagramUrl,
			isInc: isInc,
			aspectHash: aspectHash,
			imgPageId: imgPageId,
			attVer: attVer,
			pCenter: pCenter
		};
		
		//If the diagram points to another page, change macro type to inc-drawio
		if (attInfo.pageId != pageId)
		{
			attInfo.isInc = true;
		}
		
		//(macroPageId == null) when a server macro without a pageId is imported 
		if (macroPageId == null || (macroCurPageId != null && macroCurPageId != macroPageId))
		{
			var custCntInfo = custCntMap[spaceKey]? custCntMap[spaceKey][attInfo.diagramDisplayName] : null;

			if (custCntInfo != null)
			{
				attInfo.contentId = custCntInfo.id;
				attInfo.contentVer = custCntInfo.version;
				attInfo.revision = custCntInfo.revision;
				logDiv.append($('<div>' + mxResources.get('confImpDiagramSuccess', [AC.htmlEntities(attInfo.diagramDisplayName)]) + '</div>'));
				success(attInfo);
			}
			else if (!attInfo.isInc) //Check links and Create a custom content 
			{
				processDiagramLinks(attInfo, srcToDstMap, spaceKey, impBaseUrl, function(resp)
				{
					if (resp != null)
					{
						try
						{
							attInfo.revision = JSON.parse(resp).results[0].version.number;
						}
						catch(e){} //ignore
					}
					
					AC.saveCustomContent(spaceKey, attInfo.pageId, pageInfo.type, attInfo.name, attInfo.diagramDisplayName, attInfo.revision,
							null, null,
							function(responseText) 
							{
								var content = JSON.parse(responseText);
								//Update info
								attInfo.contentId = content.id;
								attInfo.contentVer = content.version.number;
								logDiv.append($('<div>' + mxResources.get('confImpDiagramSuccess', [AC.htmlEntities(attInfo.diagramDisplayName)]) + '</div>'));
								success(attInfo);
							}, function()
							{
								logDiv.append($('<div style="color:red">' + mxResources.get('confAUpdateDgrmCCFailed', [AC.htmlEntities(attInfo.diagramDisplayName)]) + '</div>'));
								success(attInfo);
							});
				}, function()
				{
					logDiv.append($('<div style="color:red">' + mxResources.get('confAImpDiagramError', [AC.htmlEntities(attInfo.diagramDisplayName)]) + '</div>'));
					success(attInfo);
				}, logDiv);
			}
			else
			{
				logDiv.append($('<div>' + mxResources.get('confImpDiagramSuccess', [AC.htmlEntities(attInfo.diagramDisplayName)]) + '</div>'));
				success(attInfo);
			}
		}
		else
		{
			//skip
			logDiv.append($('<div style="color:orange">' + mxResources.get('confAFixingMacroSkipped', [AC.htmlEntities(attName)]) + '</div>'));
			skip(attInfo);
		}
	};
	
	function pageProcessed()
	{
		processPageIdsImport(pagesList, srcToDstMap, custCntMap, drawioRegExps, incDrawioRegExps, impBaseUrl, ++index, allDone, logDiv);
	};
	
	AP.request({
		type: 'GET',
		url: '/rest/api/content/' + curPageId + '?expand=body.storage,version',
		contentType: 'application/json;charset=UTF-8',
		success: function(page) 
		{
			var page = JSON.parse(page);

			replacePageMacro(page, drawioRegExps, fixDrawIoMacros, function(successfullyConverted1, macrosParsed1) 
			{
				replacePageMacro(page, incDrawioRegExps, fixDrawIoMacros, function(successfullyConverted, macrosParsed) 
				{
					successfullyConverted += successfullyConverted1;
					macrosParsed += macrosParsed1;
					
					if (macrosParsed == 0)
					{
						logDiv.append($('<div>' + mxResources.get('confANoDiagFoundInPage', ['draw.io', AC.htmlEntities(page.title)]) + '</div>'));
					}
					if (successfullyConverted == macrosParsed)
					{
						logDiv.append($('<div>' + mxResources.get('confAAllDiagInPageDone', ['draw.io', AC.htmlEntities(page.title)]) + '</div>'));
					}
					else 
					{
						logDiv.append($('<div>' + mxResources.get('confAPartialDiagDone', [successfullyConverted, macrosParsed, 'draw.io', AC.htmlEntities(page.title)]) + '</div>'));
					}
					
					pageProcessed();
				}, function(resp) 
				{
					logDiv.append($('<div style="color:red">' + mxResources.get('confAUpdatePageFailed', [AC.htmlEntities(page.title)]) + '</div>'));
					pageProcessed();
				}, true);
			}, function(resp) 
			{
				logDiv.append($('<div style="color:red">' + mxResources.get('confAUpdatePageFailed', [AC.htmlEntities(page.title)]) + '</div>'));
				pageProcessed();
			}, true);
		},
		error: function()
		{
			logDiv.append($('<div style="color:red">' + mxResources.get('confAErrFetchPage', [AC.htmlEntities(pageInfo.name)]) + '</div>'));
			pageProcessed();
		}
	});
};

RegExp.escape = function(string) 
{
  return string.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')
};

function updateGraphModelLinks(xmlDoc, srcToDstMap, spaceKey, srcBaseUrl, attInfo, logDiv)
{
	//TinyURL
	// In Java: Base64.encodeBase64(longToByteArray(id));
	// https://community.atlassian.com/t5/Confluence-questions/What-is-the-algorithm-used-to-create-the-quot-Tiny-links-quot/qaq-p/186555
	// The long to byte array conversion is taken from this source:
	// https://stackoverflow.com/questions/8482309/converting-javascript-integer-to-byte-array-and-back
	function byteArrayToLong(byteArray) 
	{
	  var value = 0;
	
	  for ( var i = byteArray.length - 1; i >= 0; i--) 
	  {
	    value = (value * 256) + byteArray[i];
	  }
	  
	  return value;
	};

	function shortUrlToPageId(shortUrl) 
	{
		try
		{
		  return byteArrayToLong(atob(shortUrl)
		    .split('')
		    .map(function (b) { return b.charCodeAt()}));
		}
		catch(e)
		{
			console.log('Failed to decode this short url: ', shortUrl, e);
			return null;
		}
	};
	
	var pageIdFullUrl = /\/pages\/viewpage\.action\?pageId=(\d+)/;
	
	var attachmentFullUrl = /\/download\/attachments\/(\d+)/;

	var tinyPageUrl = /\/x\/(\S+)/;

	var cloudPageUrl = /\/spaces\/\S+\/pages\/([^\/]+)/; 
	
	var ceoLightboxUrl = /ceoId=(.*?)(?=&)/;
	
	function extractPageIdFromFullUrl(link)
	{
		var m = link.match(pageIdFullUrl);

		if (m != null)
		{
			return m[1];
		}

		var m = link.match(attachmentFullUrl);

		if (m != null)
		{
			return m[1];
		}

		return null;
	};
	
	function extractPageIdFromTinyUrl(link)
	{
		var m = link.match(tinyPageUrl);

		if (m != null)
		{
			var encoded = m[1];
			var pageId = shortUrlToPageId(encoded);
			return pageId != null? String(pageId) : null;
		}
		return null;
	};

	function extractPageIdFromCloudUrl(link)
	{
		var m = link.match(cloudPageUrl);

		if (m != null)
		{
			return m[1];
		}
		return null;
	};

	function getPageIdFromAnyUrl(url)
	{
		var pageId = null;
		
		try
		{
			pageId = extractPageIdFromFullUrl(url);
			
			if (pageId == null)
			{
				pageId = extractPageIdFromTinyUrl(url);
			}
			
			if (pageId == null)
			{
				pageId = extractPageIdFromCloudUrl(url);
			}
		}
		catch(e)
		{
			console.log('Failed to process url: ', url, e);
		}
		
		return pageId;
	};

	function extractPageIdFromLightboxUrl(link)
	{
		var m = link.match(ceoLightboxUrl);

		if (m != null)
		{
			return m[1];
		}
		
		return null;
	};
	
	function fixLink(link)
	{
		var linkUpdated = false;
		
		if (link != null && link.length != 0)
		{
			var pmm = getPageIdFromAnyUrl(link);
			
			if (pmm != null)
			{
				var curPageId = srcToDstMap[pmm];
				
				if (curPageId != null)
				{
					link = baseUrl + '/spaces/' + encodeURIComponent(spaceKey) + '/pages/' + curPageId;
					logDiv.append($('<div>' + mxResources.get('confAUpdateLnkToPg', [AC.htmlEntities(curPageId), AC.htmlEntities(attInfo.name)]) + '</div>'));
					linkUpdated = true;
				}
			}
			else
			{
				//TODO Add support to lightbox links via custom contents. This requires saving the custom content first without a version
				//[baseUrl]/plugins/servlet/ac/com.mxgraph.confluence.plugins.diagramly/customContentViewer?content.plugin=ac%3Acom.mxgraph.confluence.plugins.diagramly%3Adrawio-diagram&space.key=[spaceKey]&content.id=[contentId]&content.version=[contentVer]&content.type=custom
				var lightboxPageId = extractPageIdFromLightboxUrl(link);
				
				if (lightboxPageId != null)
				{
					var curPageId = srcToDstMap[lightboxPageId];
					
					if (curPageId != null)
					{
						link = link.replace(lightboxPageId, curPageId);
						logDiv.append($('<div>' + mxResources.get('confAUpdateLBLnkToPg', [AC.htmlEntities(curPageId), AC.htmlEntities(attInfo.name)]) + '</div>'));
						linkUpdated = true;
					}
				}
			}

			if (link.indexOf(srcBaseUrl) >= 0)
			{
				link = link.replace(new RegExp(RegExp.escape(srcBaseUrl), 'g'), baseUrl);
				logDiv.append($('<div>' + mxResources.get('confAUpdateLnkBase', [AC.htmlEntities(srcBaseUrl), AC.htmlEntities(baseUrl), AC.htmlEntities(attInfo.name)]) + '</div>'));
				linkUpdated = true;
			}
		}
		
		return linkUpdated? link : null;
	};
	
	function fixText(text)
	{
		if (text == null) return null;
		
		var linkUpdated = false;
		var parser = new DOMParser();
		var labelDoc = parser.parseFromString(text, 'text/html');
		
		var els = labelDoc.getElementsByTagName('a');
		
		for (var i = 0; i < els.length; i++)
		{
			var el = els[i];
			var href = null;
			
			try
			{
				href = fixLink(el.getAttribute('href'));
			}
			catch(e)
			{
				console.log(e);
			}
			
			if (href != null)
			{
				el.setAttribute('href', href);
				linkUpdated = true;
			}
		}
		
		return linkUpdated? labelDoc.body.innerHTML : null;
	};
	
	var graph = new Graph();
	var codec = new mxCodec(xmlDoc);
	var model = graph.getModel();
	codec.decode(xmlDoc.documentElement, model);
	
	var linkUpdated = false;
	
	for (var cellId in model.cells)
	{
		var cell = model.cells[cellId];
		var value = model.getValue(cell);

		if (value != null)
		{
			if (mxUtils.isNode(value))
			{
				var el = value;
				var text = fixText(el.getAttribute('label'));

				if (text != null)
				{
					el.setAttribute('label', text);
					linkUpdated = true;
				}
				
				var link = null;

				try
				{
					link = fixLink(el.getAttribute('link'));
				}
				catch(e)
				{
					console.log(e);
				}
				
				if (link != null)
				{
					el.setAttribute('link', link);
					linkUpdated = true;
				}
			}
			else if (typeof(value.toString) == 'function')
			{
				var text = fixText(value.toString());
				
				if (text != null)
				{
					cell.setValue(text);
					linkUpdated = true;
				}
			}
		}
	}
	
	if (linkUpdated)
	{
		var enc = new mxCodec(mxUtils.createXmlDocument());
		return enc.encode(model);
	}
	else
	{
		return null;
	}
};

function processDiagramLinks(attInfo, srcToDstMap, spaceKey, impBaseUrl, callback, error, logDiv)
{
	//Used to keep the same attributes for the mxGraphModel 
	function copyAttributes(src, dst)
	{
		var attrs = src.attributes;

		for(var i = 0; attrs!= null && i < attrs.length; i++) 
		{
			dst.setAttribute(attrs[i].name, attrs[i].value);
	    }
	};
	
	AP.request(
	{
		url: '/download/attachments/' + attInfo.pageId + '/' + encodeURIComponent(attInfo.name) +
			(attInfo.revision != null ? '?version=' + attInfo.revision : ''),
		success: function(xml) 
		{
			try
			{
				var xmlDoc = mxUtils.parseXml(xml);
				var xmlNode = xmlDoc.documentElement;
				var fileChanged = false, fileXml = null;
				
				if (xmlNode.nodeName == 'mxfile')
				{
					var diagrams = xmlNode.getElementsByTagName('diagram');
					
					for (var i = 0; i < diagrams.length; i++)
					{
						var xmlDoc = Editor.parseDiagramNode(diagrams[i]);
						
						if (xmlDoc != null)
						{
							xmlDoc = xmlDoc.ownerDocument;
						}
						
						var newDiagram = updateGraphModelLinks(xmlDoc, srcToDstMap, spaceKey, impBaseUrl, attInfo, logDiv);
						
						if (newDiagram != null)
						{
							fileChanged = true;
							copyAttributes(xmlDoc.documentElement, newDiagram);
							EditorUi.removeChildNodes(diagrams[i]);
							diagrams[i].appendChild(newDiagram);
						}
					}
					
					if (fileChanged)
					{
						fileXml = mxUtils.getXml(xmlNode);
					}
				}
				else
				{
					var newDiagram = updateGraphModelLinks(xmlDoc, srcToDstMap, spaceKey, impBaseUrl, attInfo, logDiv);
					
					if (newDiagram != null)
					{
						fileChanged = true;
						copyAttributes(xmlNode, newDiagram);
						fileXml = mxUtils.getXml(newDiagram);
					}
				}
				
				if (fileChanged)
				{
					AC.saveDiagram(attInfo.pageId, attInfo.name, fileXml, callback, error, false, 'application/vnd.jgraph.mxfile', mxResources.get('drawDiag'), false, false); //We don't support draft pages
				}
				else
				{
					logDiv.append($('<div>' + mxResources.get('confANoLnksInDrgm', [AC.htmlEntities(attInfo.name)]) + '</div>'));
					callback();
				}
			}
			catch(e)
			{
				error();
				console.log('Processing of diagram ' + attInfo.name + ' failed', e);
			}
		},
		error: error
	});
};

//TODO Import comments from server
//Page IDs import
function importPageIds(csvData, logDiv)
{
	$('#PIBusyIcon').show();
	logDiv.html('<br>');
	//Code from https://gist.github.com/Jezternz/c8e9fafc2c114e079829974e3764db75 and https://stackoverflow.com/questions/1293147/javascript-code-to-parse-csv-data
	function csvStringToArray(strData)
	{
	    var objPattern = new RegExp(("(\\,|\\r?\\n|\\r|^)(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|([^\\,\\r\\n]*))"), "gi");
	    var arrMatches = null, arrData = [[]];
	    
	    while (arrMatches = objPattern.exec(strData))
	    {
	        if (arrMatches[1].length && arrMatches[1] !== ",") arrData.push([]);
	        
	        arrData[arrData.length - 1].push(arrMatches[2] ? 
	            arrMatches[2].replace(new RegExp( "\"\"", "g" ), "\"") :
	            arrMatches[3]);
	    }
	    
	    return arrData;
	};
	
	function removeLastChar(str)
	{
		return str.substr(0, str.length -1);
	};
	
	try
	{
		var srcPageNamesMap = {}, srcToDstMap = {};
		var lines = csvStringToArray(csvData);
		var fileType = removeLastChar(lines[0][0]);
		var impBaseUrl = removeLastChar(lines[1][0]);
		
		if (impBaseUrl.indexOf('baseUrl=') == 0)
		{
			impBaseUrl = impBaseUrl.substr(8);
		}
		else
		{
			$('#PIBusyIcon').hide();
			logDiv.append($('<div style="color:red">' + mxResources.get('confAInvalidPageIdsFormat') + '</div>'));
			return;
		}
		
		if (fileType == 'cloud' || fileType == 'server')
		{
			for (var i = 2; i < lines.length - 1; i++) 
			{
				if (lines[i].length == 3)
				{
					var pageId = lines[i][0],
						pageName = lines[i][1],
						spaceKey = removeLastChar(lines[i][2]);
					
					if (srcPageNamesMap[spaceKey] == null)
					{ 
						srcPageNamesMap[spaceKey] = {}; 
					}
					
					srcPageNamesMap[spaceKey][pageName] = pageId;
				}
				else
				{
					logDiv.append($('<div style="color:red">' + mxResources.get('confAInvalidPageIdsFormat') + '</div>'));
					$('#PIBusyIcon').hide();
					return;
				}
			}

			var drawioRegExps = getMacroRegExps('drawio', drawioMacroParams);
			var incDrawioRegExps = getMacroRegExps('inc-drawio', drawioMacroParams);
			
			logDiv.append($('<div>' + mxResources.get('confACollectingCurPages') + '...</div>'));
			
			collectAllPages(function(curPages)
			{
				logDiv.append($('<div>' + mxResources.get('confABuildingPagesMap') + '...</div>'));
				var pages = [];
				
				for (var i = 0; i < curPages.length; i++)
				{
					if (srcPageNamesMap[curPages[i].spaceKey] != null)
					{
						var srcPageId = srcPageNamesMap[curPages[i].spaceKey][curPages[i].title];
						
						if (srcPageId != null)
						{
							srcToDstMap[srcPageId] = curPages[i].id;
							pages.push({id: curPages[i].id, type: curPages[i].type, name: curPages[i].title});
						}
					}
				}
				
				var custCntMap = {};
				
				logDiv.append($('<div>' + mxResources.get('confAProcessDrawDiag') + '...</div>'));
				//Fix custom contents first to build its ids map
				processCustomContents(pages, srcToDstMap, custCntMap, impBaseUrl, 0, function()
				{
					logDiv.append($('<div>' + mxResources.get('confAProcessDrawDiagDone') + '</div>'));
					logDiv.append($('<div>' + mxResources.get('confAProcessImpPages') + '</div>'));
					
					processPageIdsImport(pages, srcToDstMap, custCntMap, drawioRegExps, incDrawioRegExps, impBaseUrl, 0, function()
					{
						logDiv.append($('<div>' + mxResources.get('confAPageIdsImpDone') + '</div>'));
						$('#PIBusyIcon').hide();
					}, logDiv);
				}, logDiv);
			}, function()
			{
				$('#PIBusyIcon').hide();
				logDiv.append($('<div style="color:red">' + mxResources.get('confAErrFetchPageList') + '</div>'));
			});
		}
		else
		{
			$('#PIBusyIcon').hide();
			logDiv.append($('<div style="color:red">' + mxResources.get('confAInvalidPageIdsFormat') + '</div>'));
		}
	}
	catch (e)
	{
		$('#PIBusyIcon').hide();
		logDiv.append($('<div style="color:red">' + mxResources.get('confAInvalidPageIdsFormat') + '</div>'));
	}
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
	
	AP.request({
        type: 'GET',
        url: '/rest/api/space?spaceKey=DRAWIOCONFIG',
        contentType: 'application/json;charset=UTF-8',
        success: function (resp) 
        {
        	resp = JSON.parse(resp);
        	
        	if (resp.results.length > 0)
    		{
        		//Check all pages exists, automatically fix if a page/attachment doesn't exist
				AP.request({
			        type: 'GET',
			        url: '/rest/api/content/search?cql=type%3Dpage%20and%20space%3DDRAWIOCONFIG',
			        contentType: 'application/json;charset=UTF-8',
			        success: function (resp) 
			        {
			        	resp = JSON.parse(resp);
			        	var configSpaceFoundComponents = {};
			        	
			        	for (var i = 0; i < resp.results.length; i++)
		        		{
			        		var item = resp.results[i];
			        		configSpaceFoundComponents[item.title] = item.id;
		        		}
			        	
			        	fixMissingComponents(configSpaceFoundComponents);
			        },
			        error: showError
			    });
    		}
        	else
    		{
        		$('#busyIndicator').hide();
        		$('#createSpace').show();
    		}
        },
        error: showError
    });
	
	getAndApplyTranslation(function()
	{
		//JQuery is loaded in this page, so we can use it
		var indexBtn = $('#indexBtn');

		indexBtn.attr("disabled", null);
		
		indexBtn.click(function()
		{
			$('#DRIbusyIcon').show();
			DrawIoDiagramsIndexer($('#operationLog'), function()
			{
				$('#DRIbusyIcon').hide();
			});
		});
		
		var exportBtn = $('#exportBtn');
		
		exportBtn.attr("disabled", null);
		
		exportBtn.click(function()
		{
			exportPageIds($('#exportResult'));
		});
		
		var createConfig = $('#createConfSpaceBtn');
		
		createConfig.attr("disabled", null);
		
		createConfig.click(createConfigSpace);
		
		$('#saveConfigBtn').click(checkConfigAndSave);
		
		var importBtn = $('#importBtn');
		importBtn.attr("disabled", null);
		var uploadExpFileElt = null;
		
		importBtn.click(function()
		{
			if (uploadExpFileElt == null) 
			{
				var input = document.createElement('input');
				input.setAttribute('type', 'file');
				
				$(input).change(function()
				{
					if (input.files != null)
					{
						var file = input.files[0];
						var reader = new FileReader();
					
						reader.onload = function(e)
						{
							importPageIds(e.target.result, $('#pageIdsImportLog'));
						};
						
						reader.onerror = function(e)
						{
							$('#idImportErrors').html(mxResources.get('confAErrReadingExpFile'));
						};
						
						reader.readAsText(file);
						
			    		// Resets input to force change event for same file (type reset required for IE)
						input.type = '';
						input.type = 'file';
			    		input.value = '';
					}
				});
				
				input.style.display = 'none';
				document.body.appendChild(input);
				uploadExpFileElt = input;
			}
			
			uploadExpFileElt.click();
		});
	});
	
	AJS.tabs.setup();	
};

script.src = 'https://connect-cdn.atl-paas.net/all.js';
script.setAttribute('data-options', 'resize:false;margin:false');
document.getElementsByTagName('head')[0].appendChild(script);
