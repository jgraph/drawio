function GDriveEditor(onSubmit, getFileInfoFn, idSuffix, notStandalone, drawioOnly, genImage)
{
	idSuffix = idSuffix || '';
	var noThumbImg = '/images/google-drive-logo.svg';
	
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
	window.spinner = spinner; //TODO Remove this, it is used in the GAC
	this.spinner = spinner;
	spinner.spin(GAC.$('#spinner-container' + idSuffix));

	var head = document.getElementsByTagName('head')[0];
	
	// Handles timeouts
	var acceptResponse = true;
	
	var timeoutHandler = function()
	{
		acceptResponse = false;
		spinner.stop();
		alert('The connection has timed out');
	};
	
	var timeoutThread = window.setTimeout(timeoutHandler, 25000);
	
	var selectedFile = null, selFileContent = null;
	var curViewer = null;
	var status = document.getElementById('status');
		
	function debug(msg)
	{
		if (status != null)
		{
			mxUtils.write(status, msg);
			mxUtils.br(status);
		}
	};

	function showError(elem, errMsg)
	{
		elem.innerHTML = '<img src="data:image/gif;base64,R0lGODlhEAAQAPcAAADGAIQAAISEhP8AAP///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////yH5BAEAAAAALAAAAAAQABAAAAhoAAEIFBigYMGBCAkGGMCQ4cGECxtKHBAAYUQCEzFSHLiQgMeGHjEGEAAg4oCQJz86LCkxpEqHAkwyRClxpEyXGmGaREmTIsmOL1GO/DkzI0yOE2sKIMlRJsWhCQHENDiUaVSpS5cmDAgAOw==" border="0" align="absmiddle"/> ' + 
			errMsg;
	};
	
	function setPreview(file)
	{
		if (typeof AP != 'undefined')
		{
			AP.dialog.getButton('submit').enable();
			var altSubmitBtn = AP.dialog.getButton('altSubmitBtn');
			
			if (altSubmitBtn) altSubmitBtn.enable();
		}
		
		var thumbImg = GAC.$('#thumbImg' + idSuffix);

		thumbImg.onerror = function()
		{
			this.onerror = null;
			this.src = noThumbImg;
		};
		
		thumbImg.src = file.thumbnailLink; 
		
		var prevDiv = GAC.$('#preview' + idSuffix);
		prevDiv.innerHTML = '';
		var iframe = document.createElement('iframe');
		iframe.src = file.embedLink;
		iframe.setAttribute('frameborder', '0');
		iframe.width = '100%';
		iframe.height = '100%';
		prevDiv.appendChild(iframe);
		
		var autoSizeCheck = GAC.$('#autoSize' + idSuffix);
		autoSizeCheck.checked = false;
		autoSizeCheck.setAttribute('disabled', 'disabled');
		autoSizeChanged(false);
		curViewer = null;
	};
	
	function prevDrawioFile(doc, prevDiv, file, aspect)
	{
		spinner.stop();
		
		var thumbImg = GAC.$('#thumbImg' + idSuffix);
		
		thumbImg.onerror = function()
		{
			this.onerror = null;
			this.src = noThumbImg;
		};
		
		thumbImg.src = file.thumbnailLink; 

		var container = document.createElement('div');
		// NOTE: Height must be specified with default value "auto" to force automatic fit in viewer
		container.style.cssText = 'position:absolute;width:100%;height:auto;bottom:0px;top:0px;border:1px solid transparent;';
		prevDiv.appendChild(container);

		var pageId, layerIds;
		
		if (aspect != null)
		{
			var aspectArray = aspect.split(' ');
			
			if (aspectArray.length > 1)
			{
				pageId = aspectArray[0];
				layerIds = aspectArray.slice(1);
			}
		}
		
		var viewer = new GraphViewer(container, doc.documentElement,
				{highlight: '#3572b0', border: 8, 'auto-fit': true,
				resize: false, nav: true, lightbox: false, title: file.title,
				'toolbar-nohide': true, 'toolbar-position': 'top', toolbar: 'pages layers',
				pageId: pageId, layerIds: layerIds});

		curViewer = viewer;
		
		if (typeof AP != 'undefined')
		{
			AP.dialog.getButton('submit').enable();
			var altSubmitBtn = AP.dialog.getButton('altSubmitBtn');
			
			if (altSubmitBtn) altSubmitBtn.enable();
		}
	};
	
	// Waits for both APIs to load in parallel
	function main()
	{
		if ((notStandalone || typeof window.AP !== 'undefined') && typeof window.google != 'undefined')
		{
			try
			{
				window.clearTimeout(timeoutThread);
				
				//Google Drive Auth before proceeding
				GAC.confirmGDAuth(mainAuth, function()
				{
					alert('Error authenticating to Google Drive!'); //TODO better error handling
				});
	
				if (status != null)
				{
					status.style.display = 'none';
				}
			}
			catch (e)
			{
				debug('Error in main: ' + e.message);
			}
		}
	};
	
	function genericOnSubmit() 
	{
		var hasError = false;
		//this cannot happen as the submit button is disabled until a file is selected
		if (selectedFile == null)
		{
			GAC.$('#filenameError' + idSuffix).innerHTML = "Please select a file";
			hasError = true;
		}
		
		var width = parseInt(GAC.$('#width' + idSuffix).value);
		var height = parseInt(GAC.$('#height' + idSuffix).value);
		var autoSize = GAC.$('#autoSize' + idSuffix).checked;
		
		if (!autoSize && (isNaN(width) || width <= 0))
		{
			GAC.$('#widthError' + idSuffix).innerHTML = "Width must be greater than zero";
			hasError = true;
		}
		
		if (!autoSize && (isNaN(height) || height <= 0))
		{
			GAC.$('#heightError' + idSuffix).innerHTML = "Height must be greater than zero";
			hasError = true;
		}
		
		if (hasError)
		{
			return;
		}
		
		if (curViewer != null)
		{
			var layerIds = [];
			
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
				
			selectedFile.aspect = curViewer.diagrams[curViewer.currentPage].getAttribute('id') + ' ' + layerIds.join(' ');
			
			if (autoSize)
			{
				var bounds = curViewer.graph.view.graphBounds;
				width = Math.round(bounds.width) || null;
				height = Math.round(bounds.height) || null;
			}
		}
		
		spinner.spin(GAC.$('#preview' + idSuffix));
		
		var image = null;
		
		function finalize()
		{
			onSubmit(selectedFile, width, height, autoSize, selFileContent, image);	
		};
		
		if (genImage && curViewer.editor.isExportToCanvas())
		{
			curViewer.editor.exportToCanvas(function(canvas)
	    	{
				var data = canvas.toDataURL('image/png');
				image = data.substring(data.lastIndexOf(',') + 1);
	   	   		finalize();
	    	}
	    	, null, null, null, finalize);
		}
		else
		{
			finalize()		
		}
	}
	
	this.doSubmit = genericOnSubmit;

	function mainAuth()
	{	
		if (acceptResponse)
		{
			spinner.stop();
			
			var chooseLink = document.getElementById('chooseLink');
			
			if (chooseLink != null)
			{
				chooseLink.style.display = '';
			}
			
			GAC.$('#filePicker' + idSuffix).removeAttribute('disabled');
			
			GAC.$('#filePicker' + idSuffix).addEventListener('click', function(evt) 
			{
				evt.preventDefault();
				
				GAC.pickFile(function(file)
				{
					function handleNonDrawFile() //If the file is not a draw.io diagram
					{
						if (drawioOnly)
						{
							selectedFile = null;
							spinner.stop();
							AC.$('#filenameError' + idSuffix).innerHTML = 'Not a draw.io diagram file';
						}
						else 
						{
							setPreview(file);
						}

						drawioCheck.checked = false;
					};
					
					function setAutosize()
					{
						drawioCheck.checked = true;
						drawioCheck.setAttribute('disabled', 'disabled');
						var autoSizeCheck = GAC.$('#autoSize' + idSuffix);
						autoSizeCheck.checked = true;
						autoSizeCheck.removeAttribute('disabled');
						autoSizeChanged(true);
					};
					
					selectedFile = file;
					GAC.$('#filenameError' + idSuffix).innerHTML = "";
					GAC.$('#filename' + idSuffix).value = file.title;
					var mimeType = file.mimeType;
					var drawioCheck = GAC.$('#useDrawio' + idSuffix);
					drawioCheck.removeAttribute('disabled');
					var useDrawio = drawioOnly? false : drawioCheck.checked;
					var prevDiv = GAC.$('#preview' + idSuffix);
					prevDiv.innerHTML = '';
					spinner.spin(prevDiv);
					
					if (!drawioOnly && typeof convertVSDXtoMX != 'undefined' &&  /\.v(dx|sdx?)$/i.test(file.title)) //In Google Drive, all vsdx files are previewed with draw.io
					{
						GAC.getBinaryFile(file, function(blobFile)
						{
							convertVSDXtoMX(blobFile, file.title, function(xml)
							{
								selectedFile.isDrawio = true;
								selFileContent = xml;
								prevDrawioFile(mxUtils.parseXml(xml), prevDiv, file);
								setAutosize();
							}, handleNonDrawFile);
						}, handleNonDrawFile);
					}
					//Handle draw.io potential files (html & xml)
					else if (useDrawio || mimeType == 'text/html' || mimeType == 'text/xml' || mimeType == 'application/xml'
							|| mimeType == 'image/png' || mimeType == 'application/vnd.jgraph.mxfile' 
							|| /\.svg$/i.test(file.title) || /\.html$/i.test(file.title) || /\.xml$/i.test(file.title) 
							|| /\.png$/i.test(file.title) || /\.drawio$/i.test(file.title))
					{
						GAC.checkDrawioFile(file, function(doc, cnt)
						{
							selFileContent = cnt;
							prevDrawioFile(doc, prevDiv, file);
							setAutosize();
						}, handleNonDrawFile);
					}
					else
					{
						handleNonDrawFile();
					}
				}, true); //Allow folder selection. If it's not needed in Jira use !notStandalone
			});
			
			function removeErrMsg() 
			{
				GAC.$('#' + this.id + 'Error' + idSuffix).innerHTML = "";
			};
			
			GAC.$('#width' + idSuffix).addEventListener('change', removeErrMsg);
			GAC.$('#height' + idSuffix).addEventListener('change', removeErrMsg);
			
			if (getFileInfoFn)
			{
				getFileInfoFn(function(fileInfo)
				{
					var altSubmitBtn = AP.dialog.createButton({
						  text: fileInfo? 'Save' : 'Insert',
						  identifier: 'altSubmitBtn'
					});
					altSubmitBtn.bind(genericOnSubmit);
					altSubmitBtn.disable();

					if (fileInfo && fileInfo.fileId)
					{
						var autoSize = fileInfo.autoSize == '1';
						GAC.$('#width' + idSuffix).value = fileInfo.width;
						GAC.$('#height' + idSuffix).value = fileInfo.height;
						GAC.$('#filename' + idSuffix).value = fileInfo.filename;
						fileInfo.isDrawio = fileInfo.isDrawio == '1';
						GAC.$('#useDrawio' + idSuffix).checked = fileInfo.isDrawio;
						GAC.$('#autoSize' + idSuffix).checked = autoSize;
						autoSizeChanged(autoSize);

						var prevDiv = GAC.$('#preview' + idSuffix);
						prevDiv.innerHTML = '';
						spinner.spin(prevDiv);
						
						GAC.getFileInfo(fileInfo.fileId, function(file)
						{
							function filePrevErr(err)
							{
								showError(prevDiv, 'Cannot load file preview.');
							};
							
							selectedFile = file;
							
							if (typeof convertVSDXtoMX != 'undefined' &&  /\.v(dx|sdx?)$/i.test(fileInfo.filename)) //In Google Drive, all vsdx files are previewed with draw.io
							{
								GAC.getBinaryFile(file, function(blobFile)
								{
									convertVSDXtoMX(blobFile, fileInfo.filename, function(xml)
									{
										selFileContent = xml;
										prevDrawioFile(mxUtils.parseXml(xml), prevDiv, file, fileInfo.aspect);
									}, filePrevErr);
								}, filePrevErr);
							}
							else if (fileInfo.isDrawio)
							{
								GAC.getDrawioFileDoc(file, function(doc, cnt)
								{
									selFileContent = cnt;
									prevDrawioFile(doc, prevDiv, file, fileInfo.aspect);
								}, filePrevErr);
							}
							else
							{
								setPreview(file);
							}
						},
						function(err)
						{
							if (err && (err.status == 403 || err.status == 400)) //400 is returned when a business account file is accessed via a personal account
							{
								showError(prevDiv, 'Error: Access Denied. You do not have permission to access this file "'+ fileInfo.filename +'".');
							}
							else 
							{
								showError(prevDiv, 'Cannot load file preview.');
							}
						});
					}
				});
			}
		}
	};
	
	this.loadDrawioFile = function(fileInfo)
	{
		GAC.$('#filename' + idSuffix).value = fileInfo.diagramDisplayName;
		GAC.$('#autoSize' + idSuffix).checked = true;
		var prevDiv = GAC.$('#preview' + idSuffix);
		prevDiv.innerHTML = '';
		spinner.spin(prevDiv);

		GAC.getFileInfo(fileInfo.sFileId, function(file)
		{
			selectedFile = file;
			GAC.$('#filename' + idSuffix).value = file.title;
			
			GAC.getDrawioFileDoc(file, function(doc, cnt)
			{
				selFileContent = cnt;
				prevDrawioFile(doc, prevDiv, file, fileInfo.aspect);
			}, function()
			{
				showError(prevDiv, 'Cannot read "' + file.title + '" file from Google Drive.');
			});
		}, function()
		{
			showError(prevDiv, 'Fetching file info from Google Drive failed.');
		});
	};
	
	function autoSizeChanged(isChecked)
	{
		if(isChecked) 
		{
			GAC.$('#width' + idSuffix).setAttribute('disabled', 'disabled');
			GAC.$('#height' + idSuffix).setAttribute('disabled', 'disabled');
		}
		else 
		{
			GAC.$('#width' + idSuffix).removeAttribute('disabled');
			GAC.$('#height' + idSuffix).removeAttribute('disabled');
		}	
	};
	
	GAC.$('#autoSize' + idSuffix).addEventListener('change', function(evt) 
	{
		autoSizeChanged(this.checked);
	});
	
	var signOut = GAC.$('#signout' + idSuffix);
	
	if (signOut)
	{
		signOut.addEventListener('click', function(evt) 
		{
			evt.preventDefault();
			GAC.setPersistentAuth(null);
			main(); //To show auth button again
		});
	}
	
	function loadAtlassianApi() 
	{
		var script = document.createElement("script");

		script.onload = function() 
		{
			AP.dialog.disableCloseOnSubmit();
			
			//TODO when conf bug of submit is fixed, re-enable this and remove the button above 
			if (getFileInfoFn)
			{
				AP.dialog.getButton('submit').hide();
			}
			
			AP.events.on('dialog.submit', genericOnSubmit);
			AP.dialog.getButton('submit').disable();
			debug('Atlassian API loaded...');
			main();
		};
		
		script.src = 'https://connect-cdn.atl-paas.net/all.js';
		script.setAttribute('data-options', 'resize:false;margin:false');
		head.appendChild(script);
	};
	
	function loadGoogleApi() 
	{
		window.onGApiLoad = function()
		{
			debug('Google API loaded...');
			gapi.load('picker', main);
		};
		var script = document.createElement("script");
		script.src = "https://apis.google.com/js/api.js?onload=onGApiLoad";
		head.appendChild(script);
	};
	
	// Loads APIs in parallel and waits in main
	if (!notStandalone)
	{
		loadAtlassianApi();
	}
	
	loadGoogleApi();
};

