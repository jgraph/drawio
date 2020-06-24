function includeDiagramMain(confPageId, draftPage)
{
	var EXPORT_URL = 'https://exp.draw.io/ImageExport4/export';
	var selectedDiagramInfo = null;
	var theMacroData = null;
	var selectedElt = null;
	var activeTab = 'recent';
	var recentLoaded = false;
	var searchLoaded = false;
	var curViewer = null;
	var attEditor, odEditor = null, gdEditor = null;
	var gSelFileContent = null;
	var gSelFileModifiedTS = null;
	var gAttVer = null;
	var async = false;
	var editMode = false;
	var gCsvFileContent = null;
	
	var opts =
	{
		lines: 12, // The number of lines to draw
		length: 8, // The length of each line
		width: 3, // The line thickness
		radius: 5, // The radius of the inner circle
		rotate: 0, // The rotation offset
		color: '#000', // #rgb or #rrggbb
		speed: 1, // Rounds per second
		trail: 60, // Afterglow percentage
		shadow: false, // Whether to render a shadow
		hwaccel: false, // Whether to use hardware acceleration
		className: 'spinner', // The CSS class to assign to the spinner
		zIndex: 2e9 // The z-index (defaults to 2000000000)
	};
	
	var spinner = new Spinner(opts);
	
	function sha1 (str) 
	{
		  //  discuss at: http://locutus.io/php/sha1/
		  // original by: Webtoolkit.info (http://www.webtoolkit.info/)
		  // improved by: Michael White (http://getsprink.com)
		  // improved by: Kevin van Zonneveld (http://kvz.io)
		  //    input by: Brett Zamir (http://brett-zamir.me)
		  //      note 1: Keep in mind that in accordance with PHP, the whole string is buffered and then
		  //      note 1: hashed. If available, we'd recommend using Node's native crypto modules directly
		  //      note 1: in a steaming fashion for faster and more efficient hashing
		  //   example 1: sha1('Kevin van Zonneveld')
		  //   returns 1: '54916d2e62f65b3afa6e192e6a601cdbe5cb5897'

		  var hash
		  try {
		    var crypto = require('crypto')
		    var sha1sum = crypto.createHash('sha1')
		    sha1sum.update(str)
		    hash = sha1sum.digest('hex')
		  } catch (e) {
		    hash = undefined
		  }

		  if (hash !== undefined) {
		    return hash
		  }

		  var _rotLeft = function (n, s) {
		    var t4 = (n << s) | (n >>> (32 - s))
		    return t4
		  }

		  var _cvtHex = function (val) {
		    var str = ''
		    var i
		    var v

		    for (i = 7; i >= 0; i--) {
		      v = (val >>> (i * 4)) & 0x0f
		      str += v.toString(16)
		    }
		    return str
		  }

		  var blockstart
		  var i, j
		  var W = new Array(80)
		  var H0 = 0x67452301
		  var H1 = 0xEFCDAB89
		  var H2 = 0x98BADCFE
		  var H3 = 0x10325476
		  var H4 = 0xC3D2E1F0
		  var A, B, C, D, E
		  var temp

		  // utf8_encode
		  str = unescape(encodeURIComponent(str))
		  var strLen = str.length

		  var wordArray = []
		  for (i = 0; i < strLen - 3; i += 4) {
		    j = str.charCodeAt(i) << 24 |
		      str.charCodeAt(i + 1) << 16 |
		      str.charCodeAt(i + 2) << 8 |
		      str.charCodeAt(i + 3)
		    wordArray.push(j)
		  }

		  switch (strLen % 4) {
		    case 0:
		      i = 0x080000000
		      break
		    case 1:
		      i = str.charCodeAt(strLen - 1) << 24 | 0x0800000
		      break
		    case 2:
		      i = str.charCodeAt(strLen - 2) << 24 | str.charCodeAt(strLen - 1) << 16 | 0x08000
		      break
		    case 3:
		      i = str.charCodeAt(strLen - 3) << 24 |
		        str.charCodeAt(strLen - 2) << 16 |
		        str.charCodeAt(strLen - 1) <<
		      8 | 0x80
		      break
		  }

		  wordArray.push(i)

		  while ((wordArray.length % 16) !== 14) {
		    wordArray.push(0)
		  }

		  wordArray.push(strLen >>> 29)
		  wordArray.push((strLen << 3) & 0x0ffffffff)

		  for (blockstart = 0; blockstart < wordArray.length; blockstart += 16) {
		    for (i = 0; i < 16; i++) {
		      W[i] = wordArray[blockstart + i]
		    }
		    for (i = 16; i <= 79; i++) {
		      W[i] = _rotLeft(W[i - 3] ^ W[i - 8] ^ W[i - 14] ^ W[i - 16], 1)
		    }

		    A = H0
		    B = H1
		    C = H2
		    D = H3
		    E = H4

		    for (i = 0; i <= 19; i++) {
		      temp = (_rotLeft(A, 5) + ((B & C) | (~B & D)) + E + W[i] + 0x5A827999) & 0x0ffffffff
		      E = D
		      D = C
		      C = _rotLeft(B, 30)
		      B = A
		      A = temp
		    }

		    for (i = 20; i <= 39; i++) {
		      temp = (_rotLeft(A, 5) + (B ^ C ^ D) + E + W[i] + 0x6ED9EBA1) & 0x0ffffffff
		      E = D
		      D = C
		      C = _rotLeft(B, 30)
		      B = A
		      A = temp
		    }

		    for (i = 40; i <= 59; i++) {
		      temp = (_rotLeft(A, 5) + ((B & C) | (B & D) | (C & D)) + E + W[i] + 0x8F1BBCDC) & 0x0ffffffff
		      E = D
		      D = C
		      C = _rotLeft(B, 30)
		      B = A
		      A = temp
		    }

		    for (i = 60; i <= 79; i++) {
		      temp = (_rotLeft(A, 5) + (B ^ C ^ D) + E + W[i] + 0xCA62C1D6) & 0x0ffffffff
		      E = D
		      D = C
		      C = _rotLeft(B, 30)
		      B = A
		      A = temp
		    }

		    H0 = (H0 + A) & 0x0ffffffff
		    H1 = (H1 + B) & 0x0ffffffff
		    H2 = (H2 + C) & 0x0ffffffff
		    H3 = (H3 + D) & 0x0ffffffff
		    H4 = (H4 + E) & 0x0ffffffff
		  }

		  temp = _cvtHex(H0) + _cvtHex(H1) + _cvtHex(H2) + _cvtHex(H3) + _cvtHex(H4)
		  return temp.toLowerCase()
	};
	
	function showError(errMsg, nohide)
	{
		var errorMsg = document.getElementById('errorMsg');
		errorMsg.innerHTML = errMsg;
		errorMsg.className = 'fade';
		
		if (!nohide)
		{
			setTimeout(function()
			{
				errorMsg.className = '';
			}, 2000);
		}
	};
	
	function onSelect()
	{
		if (activeTab == 'extUrl')
		{
			var hasErr = false;
			
			if (!diagramUrl.value)
			{
				diagramUrl.style.border = '1px solid red';
				hasErr = true;
			}
			
			if (!diagramName.value)
			{
				diagramName.style.border = '1px solid red';
				hasErr = true;
			}
			
			if (hasErr)
			{
				return;
			}
			
			theMacroData = {
				baseUrl: baseUrl,
				diagramName: diagramName.value,
				diagramDisplayName: diagramName.value,
				diagramUrl: diagramUrl.value,
				includedDiagram: 1
			};
			document.getElementById('currentTab').style.display = '';
			document.getElementById('currentTab').click();
		}
		else if (activeTab == 'csvImp') 
		{
			var hasErr = false;
			
			if (!csvFileUrl.value)
			{
				csvFileUrl.style.border = '1px solid red';
				hasErr = true;
			}
			
			if (!csvDiagName.value)
			{
				csvDiagName.style.border = '1px solid red';
				hasErr = true;
			}
			
			if (hasErr)
			{
				return;
			}
			
			theMacroData = {
				baseUrl: baseUrl,
				diagramName: csvDiagName.value,
				diagramDisplayName: csvDiagName.value,
				csvFileUrl: csvFileUrl.value,
				includedDiagram: 1
			};
			document.getElementById('currentTab').style.display = '';
			document.getElementById('currentTab').click();
		}
		else if (activeTab == 'gDrive') 
		{
			gdEditor.doSubmit();
		}
		else if (activeTab == 'oneDrive') 
		{
			odEditor.doSubmit();
		}
		else if (activeTab == 'upload') 
		{
			attEditor.doSubmit();
		}
		else if (selectedDiagramInfo != null) 
		{
			var info = selectedDiagramInfo.info;
			theMacroData = {
				diagramName: info.name,
				diagramDisplayName: info.displayName,
				pageId: info.pageId,
				custContentId: info.contentId || info.custContentId,
				baseUrl: baseUrl,
				includedDiagram: 1
			};
			document.getElementById('currentTab').style.display = '';
			document.getElementById('currentTab').click();
		}
		else
		{
			showError('Please select a diagram to insert it.');
		}
	};
	
	function onSubmit()
	{
		if (activeTab == 'current')
		{
			if (theMacroData != null && curViewer != null)
			{
				spinner.spin(document.getElementById('current'));
				AP.dialog.getButton('submit').disable();
				var aspectHash =  null;
				
				if (!theMacroData.csvFileUrl)
				{
					var layerIds = [], pageId = curViewer.diagrams[curViewer.currentPage].getAttribute('id');
					
					var model = curViewer.graph.getModel();
					var childCount = model.getChildCount(model.root);
						
					// Get visible layers
					for (var i = 0; i < childCount; i++)
					{
						var layer = model.getChildAt(model.root, i);
						
						if (model.isVisible(layer))
						{
							layerIds.push(layer.id);
						}
					}
						
					var aspect = pageId + ' ' + layerIds.join(' ');
					aspectHash = sha1(aspect);
					theMacroData.aspect = aspect;
					theMacroData.aspectHash = aspectHash;
				}
				
				theMacroData.imgPageId = confPageId;
				
				var bounds = curViewer.graph.view.graphBounds;
				theMacroData.width = Math.round(bounds.width) || null;
				theMacroData.height = Math.round(bounds.height) || null;
				
				function saveMacro()
				{
					AP.confluence.saveMacro(theMacroData);
					AP.confluence.closeMacroEditor();
				};
				
				function saveError()
				{
					spinner.stop();
					AP.dialog.getButton('submit').enable();
					showError('Saving failed, please try again later.')
				};
				
				function doSaveImage(imageData)
				{
					if (imageData == null)
					{
						saveError();
						return;
					}
					
					AC.saveDiagram(confPageId, theMacroData.diagramName + (aspectHash? '-' + aspectHash : '') + '.png', AC.b64toBlob(imageData, 'image/png'),
							saveMacro, saveError, false, 'image/png', 'draw.io aspect image' + (gAttVer != null? ' - ' + gAttVer : ''), false, draftPage);
				};
				
				function serverFallback()
				{

					var acceptResponse = true;
					
					var timeoutThread = window.setTimeout(function()
					{
						acceptResponse = false;
						doSaveImage(null);
					}, 25000);
			    	
			    	var req = new mxXmlRequest(EXPORT_URL, 'format=png&base64=1' +
			    			 (layerIds != null? '&extras=' + encodeURIComponent(JSON.stringify({layerIds: layerIds})) : '') + 
							 (pageId != null? '&pageId=' + pageId : '') + '&xml=' + encodeURIComponent(curViewer.xml));

					req.send(function(req)
					{
				    	window.clearTimeout(timeoutThread);
						
						if (acceptResponse)
						{
							doSaveImage(req.getStatus() >= 200 && req.getStatus() <= 299? req.getText() : null);
						}
					}, 
					function()
					{
				    	window.clearTimeout(timeoutThread);
						
						if (acceptResponse)
						{
							doSaveImage(null);
						}
					});
			    
				};
				
				function startSaving()
				{
					if (curViewer.editor.isExportToCanvas())
			    	{
						curViewer.editor.exportToCanvas(function(canvas)
				    	{
				    		var data = canvas.toDataURL('image/png');
				   	   		doSaveImage(data.substring(data.lastIndexOf(',') + 1));
				    	}
				    	, null, null, null, serverFallback);
			    	}
			    	else
		    		{
			    		serverFallback();
		    		}
				};
				
				function saveDiagram()
				{
					AC.saveDiagram(confPageId, theMacroData.diagramName, gSelFileContent,
							startSaving, function(resp)
							{
								showError('Unexpected error. Cannot cannot save cached file');
							}, false, 'application/vnd.jgraph.mxfile.cached', 'Embedded draw.io diagram' + (gSelFileModifiedTS != null ? ' - ' + gSelFileModifiedTS : ''), false, draftPage);
				};
				
				function doSave()
				{
					if (theMacroData.csvFileUrl)
					{
						AC.saveDiagram(confPageId, theMacroData.diagramName + '.csv', gCsvFileContent,
								saveDiagram, function(resp)
								{
									showError('Unexpected error. Cannot cannot save cached file');
								}, false, 'text/csv', 'Embedded draw.io diagram (CSV)', false, draftPage);
					}
					else
					{
						saveDiagram();
					}
				};
				
				if (editMode)
				{
					doSave();
				}
				else
				{
					//Confirm filename is unique for new files
					AC.getPageAttachments(confPageId, function(attachments) 
					{
						var fileExists = false;
						var lc = theMacroData.diagramName.toLowerCase();
						
						// Checks if any files will be overwritten
						for (var i = 0; i < attachments.length && !fileExists; i++)
						{
							var an = attachments[i].title.toLowerCase();

							if (an == lc)
							{
								fileExists = true;
							}
						}
						
						if (fileExists)
						{
							//Make filename unique
							theMacroData.diagramName = Date.now() + '-' + theMacroData.diagramName;
						}
						
						doSave();
					}, function(res)
					{
						showError('Unexpected error. Cannot cannot save cached file');
					});
				}
			}
			else
			{
				showError('Unexpected error. Cannot show diagram');
			}
		}
		else
		{
			showError('Please select a diagram to insert it.');
		}
	};
	 
	function deselectDiagram()
	{
		selectedDiagramInfo = null;

		if (selectedElt != null)
		{
			selectedElt.style.backgroundColor = 'transparent';
			selectedElt.style.border = '1px solid #ddd';
		}
	};
	
	function fillDiagramsList(list, listDiv, top, emptyMsg)
	{
		listDiv.innerHTML = ''; 
		var div = document.createElement('div');
		div.style.border = '1px solid #d3d3d3';
		div.style.margin = '6px 0 0 -1px';
		div.style.padding = '6px';
		div.style.overflow = 'auto';
		div.style.position = 'absolute';
		div.style.bottom = '10px';
		div.style.right = '10px';
		div.style.left = '10px';
		div.style.top = top + 'px';
		
		var w = 140;
		var h = 140;
		
		function selectElement(elt, infoObj)
		{
			deselectDiagram();
			
			selectedElt = elt;
			selectedDiagramInfo = infoObj;
			
			selectedElt.style.backgroundColor = '#e6eff8';
			selectedElt.style.border = '2px solid #ccd9ea';
		};

		function addButton(url, imgUrl, tooltip, infoObj)
		{
			var elt = document.createElement('div');
			elt.className = 'diagram';
			elt.style.height = w + 'px';
			elt.style.width = h + 'px';
			
			elt.setAttribute('title', tooltip);

			elt.style.backgroundImage = 'url(' + imgUrl + ')';
			elt.style.backgroundSize = 'contain';
			elt.style.backgroundPosition = 'center center';
			elt.style.backgroundRepeat = 'no-repeat';
			
			elt.addEventListener('click', function(evt)
			{
				selectElement(elt, infoObj);
			});
			
			elt.addEventListener('dblclick', function(evt)
			{
				selectedDiagramInfo = infoObj;
				onSelect();
			});
			
			div.appendChild(elt);
		}
		
		for (var i = 0; i < list.length; i++)
		{
			addButton(list[i].url, list[i].imgUrl, list[i].title, list[i]);
		}
		
		if (list.length == 0 && emptyMsg)
		{
			var msg = document.createElement('div');
			msg.style.width = '100%';
			msg.style.height = '100%';
			msg.style.textAlign = 'center';
			msg.innerHTML = emptyMsg;
			
			div.appendChild(msg);
		}
		
		listDiv.appendChild(div);
		return div;
	}
	
	function activateTab()
	{
		deselectDiagram();
		showError('', true);
		AP.dialog.getButton('selectBtn').show();
		AP.dialog.getButton('submit').hide();
		AP.dialog.getButton('submit').disable();
		
		switch (activeTab)
    	{
	    case 'recent':
	    	if (!recentLoaded)
			{
	    		recentLoaded = true;
		    	AC.getRecentDiagrams(function(retList)
				{
    				fillDiagramsList(retList, document.getElementById('recentList'), 50, 'No recent diagrams found!');
				}, function() 
				{
					showError('Failed to fetch recent diagrams.', true);
				});
    		}
	    	break;
	    case 'search':
	    	if (!searchLoaded)
			{
	    		searchLoaded = true;
		    	//fill the div with empty box
		    	fillDiagramsList([], document.getElementById('searchList'), 80, 'Use the search box to find draw.io diagrams');
			}
	    	break;
	    case 'gDrive':
	    	if (gdEditor == null)
    		{
    			gdEditor = new GDriveEditor(function(selectedFile, width, height, autoSize, selFileContent)
    			{
    				gSelFileContent = selFileContent;
    				gSelFileModifiedTS = new Date(selectedFile.modifiedDate).getTime();
    				gAttVer = null;
    				editMode = false;
    				//Upload is the same as embedding an existing draw.io macro but without content id
    				theMacroData = {
    					diagramName: selectedFile.title,
    					diagramDisplayName: selectedFile.title,
    					pageId: confPageId,
    					baseUrl: baseUrl,
    					service: 'GDrive',
    					sFileId: selectedFile.id,
    					aspect: selectedFile.aspect,
    					includedDiagram: 1
    				};
    				
    				document.getElementById('currentTab').style.display = '';
    				document.getElementById('currentTab').click();
    			}, null, 'GD', true, true);
			}
	    	else
    		{
	    		gdEditor.spinner.stop();
    		}
	    	break;
	    case 'oneDrive':
	    	if (odEditor == null)
    		{
    			odEditor = new OneDriveEditor(function(selectedFile, width, height, autoSize, selFileContent)
 				{
    				gSelFileContent = selFileContent;
    				gSelFileModifiedTS = new Date(selectedFile.lastModifiedDateTime).getTime();
    				gAttVer = null;
    				editMode = false;
    				//Upload is the same as embedding an existing draw.io macro but without content id
    				theMacroData = {
    					diagramName: selectedFile.name,
    					diagramDisplayName: selectedFile.name,
    					pageId: confPageId,
    					baseUrl: baseUrl,
    					service: 'OneDrive',
    					sFileId: selectedFile.id,
    					odriveId: selectedFile.parentReference.driveId,
    					aspect: selectedFile.aspect,
    					includedDiagram: 1
    				};
    				
    				document.getElementById('currentTab').style.display = '';
    				document.getElementById('currentTab').click();
 				}, null, 'OD', true, true);
    		}
	    	else
    		{
	    		odEditor.spinner.stop();
    		}
	    	break;
	    case 'upload':
	    	attEditor.spinner.stop();
	    	break;
		case 'current':
			AP.dialog.getButton('selectBtn').hide();
			AP.dialog.getButton('submit').show();
			
			var div = document.getElementById('current');
			div.innerHTML = '';
			var container = document.createElement('div');
			// NOTE: Height must be specified with default value "auto" to force automatic fit in viewer
			container.style.cssText = 'position:absolute;width:100%;height:auto;bottom:0px;top:45px;border:1px solid transparent;';
			div.appendChild(container);
			spinner.spin(div);
			
			var pageId, layerIds;
			
			if (theMacroData.aspect != null)
			{
				var aspectArray = theMacroData.aspect.split(' ');
				
				if (aspectArray.length > 1)
				{
					pageId = aspectArray[0];
					layerIds = aspectArray.slice(1);
				}
			}
			
			function showFile(fileContent)
			{
				if (!async) 
				{
					var doc = mxUtils.parseXml(fileContent);
					
					curViewer = new GraphViewer(container, doc.documentElement,
							{highlight: '#3572b0', border: 8, 'auto-fit': true,
							resize: false, nav: true, lightbox: false, title: (theMacroData.diagramDisplayName || theMacroData.diagramName),
							'toolbar-nohide': true, 'toolbar-position': 'top', toolbar: 'pages layers',
							pageId: pageId, layerIds: layerIds
							});
				
					spinner.stop();
					AP.dialog.getButton('submit').enable();
				}
			};
			
			if (theMacroData.diagramUrl)
			{
				if (gSelFileContent == null)
				{
					processDiagramUrl(div, function(fileContent)
					{
						showFile(fileContent);
					});
				}
				else
				{
					showFile(gSelFileContent);
				}
			}
			else if (theMacroData.csvFileUrl)
			{
				if (gSelFileContent == null)
				{
					processCsvUrl(div, function(fileContent)
					{
						showFile(fileContent);
					});
				}
				else
				{
					showFile(gSelFileContent);
				}
			}
			else if (theMacroData.service != null && gSelFileContent != null)
			{
				showFile(gSelFileContent);
			}
			else
			{
				//Get version
				AC.getAttachmentInfo(theMacroData.pageId, theMacroData.diagramName, function(info)
				{
					gAttVer = info.version.number;
            		
            		AP.request({
    					url: '/download/attachments/' + theMacroData.pageId + '/' + encodeURIComponent(theMacroData.diagramName),
    					success: showFile,
    					error : function()
    					{
    						showError('Cannot read the specified diagram. Please check you have read permission on that file.', true);
    					}
    				});
				}, function()
				{
					showError('Cannot fetch diagram info. Please check you have read permission on that file.', true);
				});
			}
			break;
		default:
			gSelFileContent = null;
    	}
	}
	
	function openTab(evt) 
	{
		var tabName = this.getAttribute('data-tabContetn');
	    // Declare all variables
	    var i, tabcontent, tablinks;

	    // Get all elements with class='tabcontent' and hide them
	    tabcontent = document.getElementsByClassName('tabcontent');
	    for (i = 0; i < tabcontent.length; i++) {
	        tabcontent[i].style.display = 'none';
	    }

	    // Get all elements with class='tablinks' and remove the class 'active'
	    tablinks = document.getElementsByClassName('tablinks');
	    for (i = 0; i < tablinks.length; i++) {
	        tablinks[i].className = tablinks[i].className.replace(' active', '');
	    }

	    // Show the current tab, and add an 'active' class to the button that opened the tab
	    document.getElementById(tabName).style.display = 'block';
	    evt.currentTarget.className += ' active';
	    
	    activeTab = tabName;
	    activateTab();
	}
	
	function doSearch()
	{
		var searchList = document.getElementById('searchList');
		var searchStr = document.getElementById('searchStr').value;
		
		if (searchStr != null && searchStr.length > 0)
		{
			spinner.spin(searchList);

			AC.searchDiagrams(searchStr, function(retList)
			{
				spinner.stop();
				fillDiagramsList(retList, searchList, 80, 'No diagrams found!');
			}, function() 
			{
				showError('Searching failed. Please try again later.', true);
			});
		}
		else
		{
			showError('Please type a search string.');
		}
	};
	
	//=======Upload==========
	attEditor = new AttViewerEditor(function(selectedFile, selFileContent, editedFile, width, height, autoSize, isDrawio, aspect, onError)
	{
		//We only have add in Jira
		if (selectedFile != null)
		{
			gSelFileContent = selFileContent;
			gSelFileModifiedTS = null;
			gAttVer = null;
			editMode = false;
			//Upload is the same as embedding an existing draw.io macro but without content id
			theMacroData = {
				diagramName: selectedFile.name,
				diagramDisplayName: selectedFile.name,
				pageId: confPageId,
				baseUrl: baseUrl,
				service: 'AttFile',
				aspect: aspect,
				includedDiagram: 1
			};
			
			document.getElementById('currentTab').style.display = '';
			document.getElementById('currentTab').click();
		}
	}, null, 'UD', true, true);
	
	//Staring the editor
	//Setting events listeners
	document.getElementById('searchBtn').addEventListener('click', doSearch);
	document.getElementById('searchStr').addEventListener('keypress', function(e)
	{
		if (e.keyCode == 13) doSearch();
	});
	
	function renderDiagram(div, doc, title)
	{
		div.innerHTML = '';
		var container = document.createElement('div');
		// NOTE: Height must be specified with default value "auto" to force automatic fit in viewer
		container.style.cssText = 'position:absolute;width:auto;left:0px;right:0px;height:auto;bottom:0px;top:0px;border:1px solid transparent;';
		div.appendChild(container);

		new GraphViewer(container, doc,
			{highlight: '#3572b0', border: 8, 'auto-fit': true,
			resize: false, nav: true, lightbox: false, title: title,
			'toolbar-nohide': true, 'toolbar-position': 'top', toolbar: 'pages layers',
		});
	};
	
	
	document.getElementById('showDiagBtn').addEventListener('click', showDiagFromUrl);
	
	function resetBorder()
	{
		if (this.value)
			this.style.border = '';
		
		//Reset file content on urrl change
		if (this.id.indexOf('Url') > 0)
		{
			gSelFileContent = null;
			csvModel = null;
		}
	};
	
	//TODO Optimize extUrl and Csv code as they are very similar. Also, showFile is similar (conf server code is better)
	var diagramUrl = document.getElementById('diagramUrl');
	var diagramName = document.getElementById('diagramName');
	
	diagramUrl.addEventListener('keypress', resetBorder);
	diagramName.addEventListener('keypress', resetBorder);
	diagramUrl.addEventListener('change', resetBorder);
	diagramName.addEventListener('change', resetBorder);
	
	var csvFileUrl = document.getElementById('csvFileUrl');
	var csvDiagName = document.getElementById('csvDiagName');
	
	csvFileUrl.addEventListener('keypress', resetBorder);
	csvDiagName.addEventListener('keypress', resetBorder);
	csvFileUrl.addEventListener('change', resetBorder);
	csvDiagName.addEventListener('change', resetBorder);
	
	function processDiagramUrl(div, callback)
	{
		spinner.spin(div);
		
		mxUtils.get(diagramUrl.value, function(req)
		{
			if (req.getStatus() >= 200 && req.getStatus() <= 299)
			{
				try
				{
					gSelFileContent = req.getText();
					
					if (callback)
					{
						callback(gSelFileContent);
					}
					else
					{
						renderDiagram(div, mxUtils.parseXml(gSelFileContent).documentElement, diagramName.value);
					}
				}
				catch(e)
				{
					showError('Unsupported file. Please check the specified URL', true);
					spinner.stop();
				}
			}
			else
			{
				showError('Diagram not found or cannot be accessed. Please check the specified URL', true);
				spinner.stop();
			}
		});
	};
	
	function showDiagFromUrl(e)
	{
		e.preventDefault();
		
		if (!diagramUrl.value)
		{
			diagramUrl.style.border = '1px solid red';
			return;
		}
		
		processDiagramUrl(document.getElementById('extUrlDiagram'));
	};
	
	function processCsvUrl(div, callback)
	{
		spinner.spin(div);
		
		mxUtils.get(csvFileUrl.value, function(req)
		{
			if (req.getStatus() >= 200 && req.getStatus() <= 299)
			{
				try
				{
					gCsvFileContent = req.getText();
					
					AC.importCsv(gCsvFileContent, function(csvModel, xml)
					{
						gSelFileContent = xml;
						
						if (callback)
						{
							callback(gSelFileContent, gCsvFileContent);
						}
						else
						{
							renderDiagram(div, csvModel, csvDiagName.value);
						}
					});
				}
				catch(e)
				{
					showError('Unsupported format. Please check the specified URL', true);
					spinner.stop();
				}
			}
			else
			{
				showError('CSV file not found or cannot be accessed. Please check the specified URL', true);
				spinner.stop();
			}
		});
	};
	
	document.getElementById('convertBtn').addEventListener('click', function(e)
	{
		e.preventDefault();
		
		if (!csvFileUrl.value)
		{
			csvFileUrl.style.border = '1px solid red';
			return;
		}

		processCsvUrl(document.getElementById('csvDiagram'));
	});

	var tabs = document.getElementsByClassName('tablinks');
	
	for (var i = 0; i < tabs.length; i++)
	{
		tabs[i].addEventListener('click', openTab);
	}

	AP.sizeToParent(true);
	
	AP.confluence.getMacroData(function (macroData) 
	{
		if (macroData != null && macroData.includedDiagram != null)
		{
			theMacroData = macroData;
			editMode = true;
			
			if (macroData.diagramUrl)
			{
				diagramUrl.value = macroData.diagramUrl;
				diagramName.value = macroData.diagramName;
			} 
			else if (macroData.csvFileUrl)
			{
				csvFileUrl.value = macroData.csvFileUrl;
				csvDiagName.value = macroData.diagramName;
			}

			function extractFileContents(resp, isPng)
			{
				if (isPng)
				{
					resp = 'data:image/png;base64,' + Editor.base64Encode (resp);
					resp = AC.extractGraphModelFromPng(resp);
				}
				
				gSelFileContent = resp;
				async = false;
				document.getElementById('currentTab').click();
			};
			
			async = true;
			gSelFileContent = ''; //To prevent fetching the cached file
			
			//Update file
			if (macroData.service == 'GDrive')
			{
				GAC.getFileInfo(macroData.sFileId, function(fileInfo)
				{
					var isPng = fileInfo.mimeType == 'image/png';
					gSelFileModifiedTS = new Date(fileInfo.modifiedDate).getTime();
					
        			GAC.doAuthRequestPlain(fileInfo['downloadUrl'], 'GET', null, function(req)
					{
        				extractFileContents(req.responseText, isPng);
					}, function()
					{
						showError('Cannot read "' + fileInfo.title + '" file from Google Drive.', true);
					}, null, isPng);
				}, function()
				{
					showError('Fetching file info from Google Drive failed.', true);
				});
			}
			else if (macroData.service == 'OneDrive')
			{
				AC.getFileInfo(macroData.sFileId, macroData.odriveId, function(fileInfo)
				{
					var isPng = fileInfo.file.mimeType == 'image/png';
					gSelFileModifiedTS = new Date(fileInfo.lastModifiedDateTime).getTime();
					
        			var req = new XMLHttpRequest();
					req.open('GET', fileInfo['@microsoft.graph.downloadUrl']);
					
					req.onreadystatechange = function()
					{
						if (this.readyState == 4)
						{
							if (this.status >= 200 && this.status <= 299)
							{
								extractFileContents(req.responseText, isPng);
							}
							else
							{
								showError('Cannot read "' + fileInfo.name + '" file from OneDrive.', true);
							}
						}
					};
					
					if (isPng && req.overrideMimeType)
					{
						req.overrideMimeType('text/plain; charset=x-user-defined');
					}
					
					req.send();
				}, function()
				{
					showError('Fetching file info from OneDrive failed.', true);
				});
			}
			else if (macroData.service == 'AttFile')
			{
				AP.request({
					url: '/download/attachments/' + theMacroData.pageId + '/' + encodeURIComponent(theMacroData.diagramName),
					success: function(resp)
					{
						extractFileContents(resp);
					},
					error : function()
					{
						showError('Cannot read the uploaded diagram.', true);
					}
				});
			}
			else
			{
				async = false;
				gSelFileContent = null;
			}
			
			document.getElementById('currentTab').click();
		}
		else
		{
			document.getElementById('currentTab').style.display = 'none';
			document.getElementById('recentTab').click();
		}
	});
	
	var selectBtn = AP.dialog.createButton({
		  text: 'Select...',
		  identifier: 'selectBtn'
	});
	selectBtn.bind(onSelect);
	
	AP.dialog.disableCloseOnSubmit();
	AP.events.on('dialog.submit', onSubmit);
	AP.dialog.getButton('submit').hide();
	AP.dialog.getButton('submit').disable();
};

//Logs uncaught errors
window.onerror = function(message, url, linenumber, colno, err)
{
	message = 'Confluence Cloud Embed Editor: ' + ((message != null) ? message : '');
	
	AC.logError(message, url, linenumber, colno, err);
};

var xdm_e = AC.getSiteUrl();
var license = AC.getUrlParam('lic', false);
var baseUrl = AC.getBaseUrl(); //TODO FIXME search and recent depends on having baseUrl global 
var connectUrl = baseUrl + '/atlassian-connect';
var head = document.getElementsByTagName('head')[0];
var licenseValid = true;

var script = document.createElement('script');
script.setAttribute('data-options', 'resize:false;margin:false');

if (license != null && xdm_e != null)
{
	if  (license == 'none')
	{
		var hostParse = document.createElement('a');
		hostParse.href = xdm_e;
		var hostname = hostParse.hostname;
		
		if (hostname != null)
		{
			if (hostname.indexOf('.ngrok.io') > -1)
			{
				console.log("License status = ", license);
			}
			else
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
								licenseValid = true;
							}
						}
				    }
				};
	
				xhr.open('POST', '/license?domain=' + hostname, true);
				xhr.send(null);
			}
		}
	}
	else
	{
		licenseValid = true;
	}
}

// Adds event listeners
document.getElementById('gdAnchor').onclick = function()
{
	document.getElementById('filePickerGD').click();
};

document.getElementById('odAnchor').onclick = function()
{
	document.getElementById('filePickerOD').click();
};

document.getElementById('fileUploadAnchor').onclick = function()
{
	document.getElementById('fileuploadUD').click();
};

// Main
script.onload = function()
{
	if (!licenseValid)
	{
		setTimeout(function()
		{
			if (!licenseValid)
			{
				alert("Please install a license for the draw.io app");
				AP.confluence.closeMacroEditor();
			}
		}, 3000);
	}
	
	//start the macro editro
	AP.navigator.getLocation(function (data)
    {
    	if (data != null && data.context != null)
   		{
    		var draftPage = (data.target == 'contentcreate');
    		var pageId = data.context.contentId;
    		
    		includeDiagramMain(pageId, draftPage);
   		}
    	else
		{
    		alert('Unexpected Error: Cannot get content id or type.');
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
