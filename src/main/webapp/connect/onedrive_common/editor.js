function OneDriveEditor(onSubmit, getFileInfoFn, idSuffix, notStandalone, drawioOnly)
{
	idSuffix = idSuffix || '';
	var noThumbImg = '/images/onedrive-logo.svg';
	var connectUrl = AC.getBaseUrl() + '/atlassian-connect';
	
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
	this.spinner = spinner;
	spinner.spin(AC.$('#spinner-container' + idSuffix));
	
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

	function showError(elem, errMsg)
	{
		elem.innerHTML = '<img src="/mxgraph/images/error.gif" border="0" align="absmiddle"/> ' + 
			errMsg;
	};
	
	function setPreview(file)
	{
		AP.dialog.getButton('submit').enable();
		var altSubmitBtn = AP.dialog.getButton('altSubmitBtn');
		
		if (altSubmitBtn) altSubmitBtn.enable();
		
		var thumbImg = AC.$('#thumbImg' + idSuffix);

		thumbImg.onerror = function()
		{
			this.onerror = null;
			this.src = noThumbImg;
		};
		
		AC.getFileThumbnailUrl(file, function(thumbUrl)
		{
			thumbImg.src = thumbUrl? thumbUrl : noThumbImg;
		}, function()
		{
			thumbImg.src = noThumbImg;
		});
		
		var prevDiv = AC.$('#preview' + idSuffix);

		AC.getFilePreviewUrl(file, function(prevUrl, isPersonal)
		{
			if (prevUrl)
			{
				if (isPersonal)
				{
					file.embeddedUrl = prevUrl;
				}
				
				prevDiv.innerHTML = '';
				var iframe = document.createElement('iframe');
				iframe.src = prevUrl;
				iframe.setAttribute('frameborder', '0');
				iframe.width = '100%';
				iframe.height = '100%';
				prevDiv.appendChild(iframe);
			}
			else
			{
				prevDiv.innerHTML = 'No preview is available';							
			}
		}, function(errMsg)
		{
			prevDiv.innerHTML = 'No preview is available. ' + (errMsg? errMsg : '');
		});
		
		var autoSizeCheck = AC.$('#autoSize' + idSuffix);
		autoSizeCheck.checked = false;
		autoSizeCheck.setAttribute('disabled', 'disabled');
		autoSizeChanged(false);
		curViewer = null;
	};
	
	function prevDrawioFile(doc, prevDiv, filename, aspect)
	{
		spinner.stop();
		
		var thumbImg = AC.$('#thumbImg' + idSuffix);
		thumbImg.src = noThumbImg;

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
				resize: false, nav: true, lightbox: false, title: filename,
				'toolbar-nohide': true, 'toolbar-position': 'top', toolbar: 'pages layers',
				pageId: pageId, layerIds: layerIds});

		curViewer = viewer;
		
		AP.dialog.getButton('submit').enable();
		var altSubmitBtn = AP.dialog.getButton('altSubmitBtn');
		
		if (altSubmitBtn) altSubmitBtn.enable();
	};
	
	// Waits for both APIs to load in parallel
	function main()
	{
		if (notStandalone || (typeof window.AP !== 'undefined' && typeof window.OneDrive != 'undefined'))
		{
			window.clearTimeout(timeoutThread);

			//OneDrive Auth before proceeding
			AC.confirmODAuth(mainAuth, function()
			{
				alert('Error authenticating to OneDrive!'); //TODO better error handling
			});
		}
	};
	
	function genericOnSubmit() 
	{
		var hasError = false;
		//this cannot happen as the submit button is disabled until a file is selected
		if (selectedFile == null)
		{
			AC.$('#filenameError' + idSuffix).innerHTML = "Please select a file";
			hasError = true;
		}
		
		var width = parseInt(AC.$('#width' + idSuffix).value);
		var height = parseInt(AC.$('#height' + idSuffix).value);
		var autoSize = AC.$('#autoSize' + idSuffix).checked;
		
		if (!autoSize && (isNaN(width) || width <= 0))
		{
			AC.$('#widthError' + idSuffix).innerHTML = "Width must be greater than zero";
			hasError = true;
		}
		
		if (!autoSize && (isNaN(height) || height <= 0))
		{
			AC.$('#heightError' + idSuffix).innerHTML = "Height must be greater than zero";
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
		}
		
		spinner.spin(AC.$('#preview' + idSuffix));
		
		onSubmit(selectedFile, width, height, autoSize, selFileContent);
	}
	
	this.doSubmit = genericOnSubmit;

	function mainAuth()
	{
		spinner.stop();
				
		if (acceptResponse)
		{ 
			AC.$('#filePicker' + idSuffix).removeAttribute('disabled');
			
			AC.$('#filePicker' + idSuffix).addEventListener('click', function(evt) 
			{
				AC.pickFile(function(file)
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
						var autoSizeCheck = AC.$('#autoSize' + idSuffix);
						autoSizeCheck.checked = true;
						autoSizeCheck.removeAttribute('disabled');
						autoSizeChanged(true);
					};
					
					selectedFile = file;
					AC.$('#filenameError' + idSuffix).innerHTML = "";
					AC.$('#filename' + idSuffix).value = file.name;
					var mimeType = file.file.mimeType;
					drawioCheck = AC.$('#useDrawio' + idSuffix);
					var useDrawio = drawioOnly? false : drawioCheck.checked;
					var prevDiv = AC.$('#preview' + idSuffix);
					prevDiv.innerHTML = '';
					spinner.spin(prevDiv);
					
					if (useDrawio && typeof convertVSDXtoMX != 'undefined' &&  /\.v(dx|sdx?)$/i.test(file.name))
					{
						AC.getBinaryFile(file, function(blobFile)
						{
							convertVSDXtoMX(blobFile, file.name, function(xml)
							{
								selectedFile.isDrawio = true;
								selFileContent = xml;
								prevDrawioFile(mxUtils.parseXml(xml), prevDiv, file.name);
								setAutosize();
							}, handleNonDrawFile);
						}, handleNonDrawFile);
					}
					//Handle draw.io potential files (html & xml)
					else if (useDrawio || mimeType == 'text/html' || mimeType == 'text/xml' || mimeType == 'application/xml' || mimeType == 'image/png' 
							|| /\.svg$/i.test(file.name) || /\.html$/i.test(file.name) || /\.xml$/i.test(file.name) 
							|| /\.png$/i.test(file.name) || /\.drawio$/i.test(file.name))
					{
						AC.checkDrawioFile(file, function(doc, cnt)
						{
							selFileContent = cnt;
							prevDrawioFile(doc, prevDiv, file.name);
							drawioCheck.checked = true;
							setAutosize();
						}, handleNonDrawFile);
					}
					else
					{
						handleNonDrawFile();
					}
				});
				
				evt.preventDefault();
			});
			
			function removeErrMsg() 
			{
				AC.$('#' + this.id + 'Error' + idSuffix).innerHTML = "";
			};
			
			AC.$('#width' + idSuffix).addEventListener('change', removeErrMsg);
			AC.$('#height' + idSuffix).addEventListener('change', removeErrMsg);
			
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
						AC.$('#width' + idSuffix).value = fileInfo.width;
						AC.$('#height' + idSuffix).value = fileInfo.height;
						AC.$('#filename' + idSuffix).value = fileInfo.filename;
						fileInfo.isDrawio = fileInfo.isDrawio == 'true';
						AC.$('#useDrawio' + idSuffix).checked = fileInfo.isDrawio;
						AC.$('#autoSize' + idSuffix).checked = autoSize;
						autoSizeChanged(autoSize);
						
						fileInfo.id = fileInfo.fileId;
						fileInfo['parentReference'] = {
							driveId: fileInfo.driveId
						};
						fileInfo['file'] = {
							mimeType: fileInfo.mimeType
						};
						fileInfo.name = fileInfo.filename;
						selectedFile = fileInfo;
						
						if (fileInfo.isDrawio)
						{
							var prevDiv = AC.$('#preview' + idSuffix);
							prevDiv.innerHTML = '';
							spinner.spin(prevDiv);
							
							AC.getFileInfo(fileInfo.fileId, fileInfo.driveId, function(file)
							{
								function filePrevErr(err)
								{
									showError(prevDiv, 'Cannot load file preview.');
								};
								
								if (typeof convertVSDXtoMX != 'undefined' &&  /\.v(dx|sdx?)$/i.test(fileInfo.filename))
								{
									AC.getBinaryFile(file, function(blobFile)
									{
										convertVSDXtoMX(blobFile, fileInfo.filename, function(xml)
										{
											selFileContent = xml;
											prevDrawioFile(mxUtils.parseXml(xml), prevDiv, file.name, fileInfo.aspect);
										}, filePrevErr);
									}, filePrevErr);
								}
								else 
								{
									AC.getDrawioFileDoc(file, function(doc, cnt)
									{
										selFileContent = cnt;
										prevDrawioFile(doc, prevDiv, file.name, fileInfo.aspect);
									}, filePrevErr);
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
						else
						{
							setPreview(fileInfo);
						}
					}
				});
			}
		}
	};
	
	function autoSizeChanged(isChecked)
	{
		if(isChecked) 
		{
			AC.$('#width' + idSuffix).setAttribute('disabled', 'disabled');
			AC.$('#height' + idSuffix).setAttribute('disabled', 'disabled');
		}
		else 
		{
			AC.$('#width' + idSuffix).removeAttribute('disabled');
			AC.$('#height' + idSuffix).removeAttribute('disabled');
		}	
	};
	
	AC.$('#autoSize' + idSuffix).addEventListener('change', function(evt) 
	{
		autoSizeChanged(this.checked);
	});
	
	var signOut = AC.$('#signout' + idSuffix);
	
	if (signOut)
	{
		signOut.addEventListener('click', function(evt) 
		{
			evt.preventDefault();
			AC.setPersistentAuth(null);
			window.open('https://login.microsoftonline.com/common/oauth2/v2.0/logout', 'logout', 'width=525,height=525,status=no,resizable=yes,toolbar=no,menubar=no,scrollbars=yes');
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
			main();
		};
		
		script.src = 'https://connect-cdn.atl-paas.net/all.js';
		script.setAttribute('data-options', 'resize:false;margin:false');
		head.appendChild(script);
	};
	
	function loadOneDriveApi() 
	{
		var script = document.createElement("script");
		script.onload = main;
		script.src = "/js/onedrive/OneDrive.js";
		head.appendChild(script);
	};
	
	// Loads APIs in parallel and waits in main
	if (!notStandalone)
	{
		loadAtlassianApi();
	}
	
	loadOneDriveApi();
};

