function AttViewerEditor(onSubmit, getFileInfoFn, idSuffix, notStandalone, drawioOnly, genImage)
{
	idSuffix = idSuffix || '';
	var isDrawio = false;
	
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
	
	var selectedFile = null, selFileContent = null, editedFile = null;
	var curViewer = null;

	function showError(elem, errMsg)
	{
		elem.innerHTML = '<img src="data:image/gif;base64,R0lGODlhEAAQAPcAAADGAIQAAISEhP8AAP///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////yH5BAEAAAAALAAAAAAQABAAAAhoAAEIFBigYMGBCAkGGMCQ4cGECxtKHBAAYUQCEzFSHLiQgMeGHjEGEAAg4oCQJz86LCkxpEqHAkwyRClxpEyXGmGaREmTIsmOL1GO/DkzI0yOE2sKIMlRJsWhCQHENDiUaVSpS5cmDAgAOw==" border="0" align="absmiddle"/> ' + 
			errMsg;
	};
	
	function prevDrawioFile(doc, prevDiv, filename, aspect)
	{
		spinner.stop();
		
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
		
		if (typeof AP != 'undefined')
		{
			AP.dialog.getButton('submit').enable();
			var altSubmitBtn = AP.dialog.getButton('altSubmitBtn');
			
			if (altSubmitBtn) altSubmitBtn.enable();
		}
	};
	
	function prevImageFile(url, prevDiv, success, error)
	{
		var img = new Image();
		
		img.onload = function()
		{
			var s = Math.min(prevDiv.offsetWidth / img.width, prevDiv.offsetHeight / img.height);
			
			if (s < 1)
			{
				img.width = s * img.width;
				img.height = s * img.height;
			}

			img.style.verticalAlign = 'middle';
			prevDiv.style.lineHeight = prevDiv.offsetHeight + 'px';
			prevDiv.appendChild(img);								

			if (typeof AP != 'undefined')
			{
				AP.dialog.getButton('submit').enable();
				var altSubmitBtn = AP.dialog.getButton('altSubmitBtn');
				
				if (altSubmitBtn) altSubmitBtn.enable();
			}
			
			spinner.stop();
			
			if (success)
			{
				success(img);
			}
		};
		
		img.onerror = function()
		{
			if (error)
			{
				error();
			}
			
			spinner.stop();
		};

		img.src = url;
		curViewer = null;
	};
	
	function genericOnSubmit() 
	{
		var hasError = false;
		//this cannot happen as the submit button is disabled until a file is selected
		if (editedFile == null && selectedFile == null)
		{
			AC.$('#filenameError' + idSuffix).innerHTML = 'Please select a file';
			hasError = true;
		}
		
		var width = parseInt(AC.$('#width' + idSuffix).value);
		var height = parseInt(AC.$('#height' + idSuffix).value);
		var autoSize = AC.$('#autoSize' + idSuffix).checked;
		
		if (!autoSize && (isNaN(width) || width <= 0))
		{
			AC.$('#widthError' + idSuffix).innerHTML = 'Width must be greater than zero';
			hasError = true;
		}
		
		if (!autoSize && (isNaN(height) || height <= 0))
		{
			AC.$('#heightError' + idSuffix).innerHTML = 'Height must be greater than zero';
			hasError = true;
		}
		
		if (hasError)
		{
			return;
		}

		var aspect = null;
		
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
				
			aspect = curViewer.diagrams[curViewer.currentPage].getAttribute('id') + ' ' + layerIds.join(' ');
			
			if (autoSize)
			{
				var bounds = curViewer.graph.view.graphBounds;
				width = Math.round(bounds.width) || null;
				height = Math.round(bounds.height) || null;
			}
		}
		
		if (typeof AP != 'undefined')
		{
			AP.dialog.getButton('submit').disable();
			var altSubmitBtn = AP.dialog.getButton('altSubmitBtn');
			
			if (altSubmitBtn) altSubmitBtn.disable();
		}
		
		spinner.spin(AC.$('#preview' + idSuffix));


		var image = null;
		
		function finalize()
		{
			onSubmit(selectedFile, selFileContent, editedFile, width, height, autoSize, isDrawio, aspect, function()
			{
				if (typeof AP != 'undefined')
				{
					AP.dialog.getButton('submit').enable();
					var altSubmitBtn = AP.dialog.getButton('altSubmitBtn');
					
					if (altSubmitBtn) altSubmitBtn.enable();
				}
				
				showError(AC.$('#errorMsg' + idSuffix), 'Uploading file failed');
				spinner.stop();
			}, image);
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
	
	function main()
	{
		window.clearTimeout(timeoutThread);
		spinner.stop();
		
		AC.$('#filePicker' + idSuffix).addEventListener('click', function(evt) 
		{
			AC.$('#fileupload' + idSuffix).click();
			evt.preventDefault();
		});
		
		AC.$('#fileupload' + idSuffix).addEventListener('change', function(evt) 
		{
			if (this.files != null)
			{
				var file = this.files[0];
				
				if (this.files.length == 1 && file != null)
				{
					AC.$('#filenameError' + idSuffix).innerHTML = '';
					AC.$('#filename' + idSuffix).value = file.name;
					
					var prevDiv = AC.$('#preview' + idSuffix);
					prevDiv.innerHTML = '';
					spinner.spin(prevDiv);
					
					if (typeof convertVSDXtoMX != 'undefined' &&  /\.v(dx|sdx?)$/i.test(file.name))
					{
						convertVSDXtoMX(file, file.name, function(xml)
						{
							selFileContent = xml;
							isDrawio = true;
							prevDrawioFile(mxUtils.parseXml(xml), prevDiv, file.name);
						}, function()
						{
							showError(prevDiv, 'Unsupported vsdx file');
						});
					}
					else
					{
						var reader = new FileReader();
						
						reader.onload = function(e)
						{
							var data = e.target.result;
							var potentialDraw = true;
							var isImage = false; 
							isDrawio = false;
							
							if (file.type == 'image/svg+xml' && data.substring(0, 26) == 'data:image/svg+xml;base64,')
							{
								var base64 = data.substring(data.indexOf(',') + 1);

								// Workaround for invalid character error in Safari
								data = (window.atob && !mxClient.IS_SF) ? atob(base64) : Base64.decode(base64, true);
							}
							else if (!drawioOnly && file.type.indexOf('image') == 0)
							{
								isImage = true;
								var pngData = null;
								
								if (file.type == 'image/png')
								{
									pngData = AC.extractGraphModelFromPng(data);
								}
								
								if (pngData == null)
								{
									potentialDraw = false;
								}
								else
								{
									data = pngData;
								}
							}
							
							selFileContent = data;
							
							if (potentialDraw)
							{
								try 
								{
									var doc = mxUtils.parseXml(data);
		
									if (new Editor().extractGraphModel(doc.documentElement) != null)
									{
										isDrawio = true;
										isImage = false
										prevDrawioFile(doc, prevDiv, file.name);
									}
								}
								catch(e) {}
							}
	
							if (isImage)
							{
								prevImageFile(data, prevDiv, null, function()
								{
									showError(prevDiv, 'Unsupported image file');
									selectedFile = null;
								});
							}
							else if (!isDrawio)
							{
								showError(prevDiv, 'Unsupported file format');
								selectedFile = null;
								spinner.stop();
							}
						}
						
						if (file.type.indexOf('image') == 0)
						{
							reader.readAsDataURL(file);
						}
						else
						{
							reader.readAsText(file);
						}
					}
					
					selectedFile = file;
					editedFile = null;
				}					
				else
				{
					AC.$('#filenameError' + idSuffix).innerHTML = 'Please select a single file only';
				}
			}
			
			// Resets input to force change event for same file (type reset required for IE)
			this.type = '';
			this.type = 'file';
			this.value = '';
			evt.preventDefault();
		});
			
		function removeErrMsg() 
		{
			AC.$('#' + this.id + 'Error' + idSuffix).innerHTML = '';
		};
		
		AC.$('#width' + idSuffix).addEventListener('change', removeErrMsg);
		AC.$('#height' + idSuffix).addEventListener('change', removeErrMsg);
		
		if (getFileInfoFn)
		{
			var prevDiv = AC.$('#preview' + idSuffix);
			prevDiv.innerHTML = '';
			spinner.spin(prevDiv);
			
			getFileInfoFn(function(fileInfo, fileContent)
			{
				var altSubmitBtn = AP.dialog.createButton({
					  text: fileInfo? 'Save' : 'Insert',
					  identifier: 'altSubmitBtn'
				});
				altSubmitBtn.bind(genericOnSubmit);
				altSubmitBtn.disable();
				var autoSize = true;
				
				if (fileInfo && fileInfo.attId)
				{
					autoSize = fileInfo.autoSize == '1';
					AC.$('#width' + idSuffix).value = fileInfo.width;
					AC.$('#height' + idSuffix).value = fileInfo.height;
					AC.$('#filename' + idSuffix).value = fileInfo.filename;
					
					editedFile = fileInfo;
					
					if (fileInfo.isDrawio == '1')
					{
						if (fileInfo.mimeType == 'image/png')
						{
							fileContent = AC.extractGraphModelFromPng(fileContent);
						}
						
						var doc = mxUtils.parseXml(fileContent);
						
						try
						{
							prevDrawioFile(doc, prevDiv, fileInfo.filename, fileInfo.aspect);
						}
						catch(e)
						{
							showError(prevDiv, 'Attachment file "' + fileInfo.filename + '" is corrupted');
						}
					}
					else
					{
						prevImageFile(fileContent, prevDiv, null, function()
						{
							showError(prevDiv, 'Attachment file "' + fileInfo.filename + '" is corrupted');
						});
					}
				}
				else
				{
					spinner.stop();
				}
				
				AC.$('#autoSize' + idSuffix).checked = autoSize;
				autoSizeChanged(autoSize);
			}, function(fileInfo)
			{
				if (fileInfo != null && fileInfo.filename == null)
				{
					prevDiv.innerHTML = '<a style="display:block;text-align:center;position:absolute;' +
						'top:50%;left:50%;transform:translate(-50%,-50%);cursor:pointer">Choose a file...</button>'
					
					prevDiv.getElementsByTagName('a')[0].addEventListener('click', function(evt) 
					{
						document.getElementById('filePicker').click();
						evt.preventDefault();
					});
				}
				else
				{
					showError(prevDiv, fileInfo? 'Failed to load attachment file "' + fileInfo.filename + '"' : 'Unexpected Error');
				}
			});
		}
	};
	
	//This function expects having the downloadUrl in the fileInfo
	this.loadDarwioFile = function(fileInfo)
	{
		editedFile = fileInfo;
		AC.$('#filename' + idSuffix).value = fileInfo.diagramDisplayName;
		AC.$('#autoSize' + idSuffix).checked = true;
		var prevDiv = AC.$('#preview' + idSuffix);
		prevDiv.innerHTML = '';
		spinner.spin(prevDiv);

		var req = new XMLHttpRequest();
        req.open('GET', fileInfo.downloadUrl);
        
        req.onreadystatechange = function()
        {
            if (this.readyState == 4)
            {
                if (this.status >= 200 && this.status <= 299)
                {
                	selFileContent = req.responseText;
                	var doc = mxUtils.parseXml(selFileContent);
					
					try
					{
						prevDrawioFile(doc, prevDiv, fileInfo.diagramDisplayName, fileInfo.aspect);
					}
					catch(e)
					{
						showError(prevDiv, 'Attachment file "' + fileInfo.diagramName + '" is corrupted');
					}
                }
                else
                {
                	showError(prevDiv, 'Cannot read attachment file "' + fileInfo.diagramName + '".');
                }
            }
        };
        
        req.send();
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
	
	function loadAtlassianApi() 
	{
		var script = document.createElement('script');

		script.onload = function() 
		{
			AP.dialog.disableCloseOnSubmit();
			
			//TODO when conf bug of submit is fixed, re-enable this and remove the button above 
			AP.dialog.getButton('submit').hide();
			
			AP.events.on('dialog.submit', genericOnSubmit);
			AP.dialog.getButton('submit').disable();
			main();
		};
		
		script.src = 'https://connect-cdn.atl-paas.net/all.js';
		script.setAttribute('data-options', 'resize:false;margin:false');
		head.appendChild(script);
	};
	
	// Loads APIs
	if (!notStandalone)
	{
		loadAtlassianApi();
	}
	else
	{
		main();
	}
};

