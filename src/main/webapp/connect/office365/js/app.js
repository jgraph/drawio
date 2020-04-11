/* Common app functionality */

(function ()
{
	RESOURCE_BASE = '/resources/dia';
	var EXPORT_URL = 'https://exp.draw.io/ImageExport4/export';
	var PIXELS_TO_POINTS = 72 / 96;
	
	if (!window.AC)
	{
		alert('Error: this application requires ac.js to be loaded first');
		return;
	}
	
    var app = {};
    var _dlg;
    
    // Common initialization function (to be called from each page)
    app.initialize = function (spinner) 
    {
    	app.hideNotification = function()
        {
        	AC.$('#notification-message').style.transform = 'scaleY(0)';
        	//Older browsers
        	setTimeout(function()
			{
            	AC.$('#notification-message').style.display = 'none';		
			}, 500);
        };
        
    	AC.$('#notification-message-close').addEventListener('click', app.hideNotification);

        // After initialization, expose a common notification function
        app.showNotification = function (header, text) 
        {
        	AC.$('#notification-message-header').innerHTML = AC.htmlEntities(header);
        	AC.$('#notification-message-body').innerHTML = AC.htmlEntities(text);
        	AC.$('#notification-message').style.display = 'block';
        	//Older browsers
        	setTimeout(function()
			{
	        	AC.$('#notification-message').style.transform = 'scaleY(1)';
			}, 50);
        };
        
        app.spinner = spinner;
    };
 
    app.initI18n = function(callback)
    {
    	var lang = window.Office != null? Office.context.displayLanguage : null;
    	
    	if (lang != null)
    	{
    		var dash = lang.indexOf('-');
    		
    		if (dash >= 0)
    		{
    			lang = lang.substring(0, dash);
    		}
    		
    		lang = lang.toLowerCase();
    	}
    	
    	app.lang = lang;
    	window.mxLanguage = lang;
    	
    	mxResources.loadDefaultBundle = false;
    	var bundle = mxResources.getDefaultBundle(RESOURCE_BASE, lang) ||
    		mxResources.getSpecialBundle(RESOURCE_BASE, lang);
    	
    	mxUtils.getAll([bundle], function(xhr)
		{
			// Adds bundle text to resources
			mxResources.parse(xhr[0].getText());
			callback();
		});
    };
    
    // This handler responds to the success or failure message that the pop-up dialog receives from the identity provider
    // and access token provider.
    function processODMessage(arg) 
    {
    	var authInfo = null;
    
    	try
    	{
    		authInfo = JSON.parse(arg.message);
    	}
    	catch(e){}
    	
        if (authInfo != null && authInfo.access_token != null) 
        {
        	if (app.resume) 
        	{
        		app.spinner.spin();
        		app.resume = false;
        	}
        	
            // We now have a valid access token.
            _dlg.close();
            //save the tokens
            AC.token = authInfo.access_token;
			authInfo.expiresOn = Date.now() + authInfo.expires_in * 1000;
			authInfo.remember = true;
			AC.setPersistentAuth(authInfo);
			
			for (var i = 0; i < AC.reqQueue.length; i++)
			{
				AC.reqQueue[i].success();
			}
			
			AC.reqQueue = [];
        } 
        else 
        {
            // Something went wrong with authentication or the authorization of the web application.
            _dlg.close();
            app.showNotification(mxResources.get('authFailed'), mxResources.get('officeFailedAuthMsg'));
        }
    };

    // This handler responds to the success of Google Drive picker
    function processDriveMessage(arg, callback) 
    {
    	var fileInfo = null;
    
    	try
    	{
    		fileInfo = JSON.parse(arg.message);
    	}
    	catch(e){}
    	
        if (fileInfo != null) 
        {
        	if (fileInfo.error)
        	{
        		AC.showError(fileInfo.error);
        		app.showStartPage();
        	}
        	else
        	{
	    		app.spinner.spin();
	    		app.resume = false;
	        	
	            callback(fileInfo);
        	}
            _dlg.close();
        } 
        else 
        {
            // Something went wrong
            _dlg.close();
            app.showStartPage();
        }
    };
    
    app.showStartPage = function()
    {
    	AC.$('#connectContainer').style.display = 'block';
    	AC.$('.welcome-body').style.display = 'block';
    	AC.$('#footerButton').style.display = 'block';
    	AC.$('#waitContainer').style.display = 'none';
        AC.$('#selectFileContainer').style.display = 'none';
    };
    
    // Use the Office dialog API to open a pop-up and display the sign-in page for the identity provider.
    function showODLoginPopup() 
    {
    	AC.$('#connectContainer').style.display = 'none';
    	AC.$('#footerButton').style.display = 'none';
    	AC.$('#waitContainer').style.display = 'block';
        var url = 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize' +
			'?client_id=' + AC.clientId + '&response_type=code' +
			'&redirect_uri=' + encodeURIComponent(AC.redirectUri) +
			'&scope=' + encodeURIComponent(AC.scopes) +
			'&state=' + encodeURIComponent('cId=' + AC.clientId + '&domain=' + window.location.hostname); //To identify which app/domain is used

        // height and width are percentages of the size of the parent Office application, e.g., PowerPoint, Excel, Word, etc.
        Office.context.ui.displayDialogAsync(url,
                {height: 50, width: 50, promptBeforeOpen: false}, function (result) 
        {
            _dlg = result.value;
            _dlg.addEventHandler(Microsoft.Office.WebExtension.EventType.DialogMessageReceived, processODMessage);
            _dlg.addEventHandler(Microsoft.Office.WebExtension.EventType.DialogEventReceived, app.showStartPage);
        });
    };

    app.showDrivePopup = function(callback)
	{
    	AC.$('#connectContainer').style.display = 'none';
    	AC.$('#footerButton').style.display = 'none';
    	AC.$('#waitContainer').style.display = 'block';
		var url = 'https://' + window.location.hostname + '/connect/office365/drive.html';
	  				
	  	  //height and width are percentages of the size of the parent Office application, e.g., PowerPoint, Excel, Word, etc.
		Office.context.ui.displayDialogAsync(url,
		    {height: 65, width: 65, promptBeforeOpen: false}, function (result) 
		    {
		        _dlg = result.value;
		        
		        _dlg.addEventHandler(Microsoft.Office.WebExtension.EventType.DialogMessageReceived, function(arg)
		       	{
		        	processDriveMessage(arg, callback);
		   		});
		        
		        _dlg.addEventHandler(Microsoft.Office.WebExtension.EventType.DialogEventReceived, app.showStartPage);
		    });
	};
    
    function fetchImage(fileDoc, fileInfo, callback)
    {
		var acceptResponse = true;
		
		var timeoutThread = window.setTimeout(function()
		{
			acceptResponse = false;
			callback(null);
		}, 25000);
    	
    	var req = new mxXmlRequest(EXPORT_URL, 'format=png&base64=1&scale=auto' +
    			 (fileInfo.layers != null? '&extras=' + encodeURIComponent(JSON.stringify({layers: fileInfo.layers})) : '') + 
				 (fileInfo.pageId != null? '&pageId=' + fileInfo.pageId : '') + '&xml=' + encodeURIComponent(mxUtils.getXml(fileDoc)));

		req.send(function(req)
		{
	    	window.clearTimeout(timeoutThread);
			
			if (acceptResponse)
			{
				callback(req.getStatus() >= 200 && req.getStatus() <= 299? req.getText() : null);
			}
		}, 
		function()
		{
	    	window.clearTimeout(timeoutThread);
			
			if (acceptResponse)
			{
				callback(null);
			}
		});
    };

    app.getRecentList = function()
    {
    	return JSON.parse(Office.context.document.settings.get('drawioRecentList'));
    };
    
    app.addToRecent = function(file)
    {
    	var recentList = app.getRecentList() || {};
    	
    	//@microsoft.graph.downloadUrl is valid for a short time only, so remove it
    	delete file['@microsoft.graph.downloadUrl'];
    	recentList[file.id] = file;
    	Office.context.document.settings.set('drawioRecentList', JSON.stringify(recentList));
    	
    	Office.context.document.settings.saveAsync(function (asyncResult) 
    	{
    		//Currently we ignore saving errors and just log it to console
    	    if (asyncResult.status == Office.AsyncResultStatus.Failed) 
    	    {
    	        console.log('Settings save failed. Error: ' + asyncResult.error.message);
    	    }
    	});
    };
    
    app.insertImageInDoc = function(diagViewer, fileDoc, fileInfo, callback, error, picIndex, selectionOnly, forceServer)
    {
    	// TODO: How to get pageWidth in Word/PPT
    	var pageWidth = 800;
    	var scale = diagViewer.graph.currentScale;
		var b = diagViewer.graph.getGraphBounds();

		var page = diagViewer.currentPage;
		var imgW = b.width / scale * PIXELS_TO_POINTS, imgH = b.height / scale * PIXELS_TO_POINTS;
		var layers = [];
		
		var model = diagViewer.graph.getModel();
		var childCount = model.getChildCount(model.root);
			
		// Get visible layers
		for (var i = 0; i < childCount; i++)
		{
			if (model.isVisible(model.getChildAt(model.root, i)))
				layers.push(i);
		}
			
		fileInfo['pageId'] = diagViewer.diagrams[diagViewer.currentPage].getAttribute('id');
		fileInfo['layers'] = layers;

		function doInsertImage(base64Img)
		{
			if (base64Img == null)
			{
				error(mxResources.get('convertingDiagramFailed'))
				return;
			}
			
			var config = {
                coercionType: Office.CoercionType.Image,
                imageWidth: imgW,
                imageHeight: imgH
            };
            
			function onErrorFallback(errMsg)
			{
				if (AC.headless)
        		{
            		var copyImgErrMsg = mxResources.get('officeCopyImgErrMsg', null, 
            				'An error prevented draw.io from adding the image directly to the document. This is due to some limitations in the host application. \n' +
            				'Please manually copy the image then paste it to the document. \n\n' +
                    		mxResources.get('officeInsertImgFailed', null, 'Inserting image failed') + ': ' + errMsg);

            		var copyImgInstMsg = mxResources.get('officeCopyImgInst');
            		
            		AC.hideMsg(function()
            		{
            			Office.context.ui.displayDialogAsync('https://' + window.location.hostname + '/connect/office365/img-viewer.html?errMsg=' + 
            				encodeURIComponent(copyImgErrMsg) + 
            				'&instMsg=' + encodeURIComponent(copyImgInstMsg) + 
            				'#' + base64Img,
                            {height: 50, width: 50});
            		});
            		
            		error();
        		}
        		else
    			{
            		error(mxResources.get('insertingImageFailed') + ': ' + errMsg);

        			AC.$('#selectFileContainer').style.display = 'none';
        			AC.$('#insertErrorContainer').style.display = 'block';
        			AC.$('#manualCopyImg').src = 'data:image/png;base64,' + base64Img;
    			}
			};
			
			if (Office.context.requirements.isSetSupported('WordApi', 1.2)) 
			{
				Word.run(function (context) 
				{
					function doReplace(replaceItem)
					{
						var picture = replaceItem.insertInlinePictureFromBase64(base64Img, Word.InsertLocation.replace);
			            picture.load('width, height');
			            
			            
			            return context.sync().then(function () 
			            {
			            	var props = {};
			            	
			            	//Exclude device files as it cannot be refreshed
			            	if (fileInfo.type != null)
		            		{
			            		props.altTextDescription = 'https://' + window.location.hostname + '/?open=' +
										encodeURIComponent(fileInfo.type == 'OneDrive'? ('W' + fileInfo.driveId + '/' + fileInfo.id)
												: ('G' + fileInfo.id)) +
										'&local-data=' + encodeURIComponent(JSON.stringify(fileInfo))
		            		}
			            	
			            	//Word will resize the image to fit the page and if we set the actual size, then it will go beyond the page boundaries
			            	if (picture.width > imgW && picture.height > imgH)
		            		{
			            		props.width = imgW;
			            		props.height = imgH;
			            	}
			            	
			                picture.set(props);
			                
			                context.sync().then(function () 
	    		            {
			                	callback();
	    		            });
			            });
					}
					
					if (picIndex != null) 
                	{
						var docPart = selectionOnly? context.document.getSelection() : context.document.body;
						var pics = docPart.inlinePictures;
						pics.load('items');
						
						return context.sync().then(function () 
						{
							doReplace(pics.items[picIndex]);
						});
                	}
					else
					{
						return doReplace(context.document.getSelection());
					}
		        })
		        .catch(function (error) 
		        {
		        	var errMsg = error.message;
		            console.log('Error: ' + JSON.stringify(error));
		            
		            if (error instanceof OfficeExtension.Error) 
		            {
		                errMsg = error.debugInfo? error.debugInfo.message : errMsg;
		            }
		            
		            errMsg = errMsg || 'Unknown Error';
		            onErrorFallback(errMsg);
		        });
			}
			else
			{
				Office.context.document.setSelectedDataAsync(base64Img, config, function (asyncResult) 
	            {
	            	if (asyncResult.status === Office.AsyncResultStatus.Failed) 
	            	{
	            		onErrorFallback(asyncResult.error.message);
	                }
	            	else
	        		{
	            		callback();
	        		}
	            });
			}
		};
		
		function serverFallback()
		{
			fetchImage(fileDoc, fileInfo, doInsertImage);	
		};
		
    	try
    	{
	    	if (!forceServer && diagViewer.editor.isExportToCanvas())
	    	{
	    		var s = 1; //default scale
	    		
	    		//automatic scaling
				if (b.width < pageWidth & b.height < 1.5 * pageWidth)
				{
					s = 4;
				}
				else if (b.width < 2 * pageWidth & b.height < 3 * pageWidth)
				{
					s = 3;
				}
				else if (b.width < 4 * pageWidth && b.height < 6 * pageWidth)
				{
					s = 2;
				}

	    		diagViewer.editor.exportToCanvas(function(canvas)
		    	{
		    		var data = canvas.toDataURL('image/png');
		   	   		doInsertImage(data.substring(data.lastIndexOf(',') + 1));
		    	}
		    	, null, null, null, serverFallback /* on error go to server*/, null,
				null, s);
	    	}
	    	else
    		{
	    		serverFallback();
    		}
    	}
    	catch(e)
    	{
    		serverFallback();
    	}
    };
    
    app.editDiagram = function(fileInfo, closeCallback, showPrompt, pageId)
    {
		var id;
		
		if (fileInfo.fromDrive || fileInfo.type == 'Drive')
		{
			id = 'G' + fileInfo.id;
		}
		else 
		{
			id = 'W' + (fileInfo.driveId || fileInfo.parentReference.driveId) + '/' + fileInfo.id;
		}
		
		if (Office.context.platform == Office.PlatformType.PC) // PC has caching issues with draw.io
		{
			AC.showMsg(mxResources.get('officeClickToEdit'), false, true, false, false, id);
		}
		else
		{
			var params = [];
			
			if (app.lang != null)
			{
				params.push('lang=' + app.lang);
			}
			
			if (pageId != null)
			{
				params.push('page-id=' + encodeURIComponent(pageId));
			}
			
			Office.context.ui.displayDialogAsync('https://' + window.location.hostname + '/' +
				(params.length > 0 ? '?' + params.join('&') : '') +
				'#' + encodeURIComponent(id), 
				{height: 90, width: 90, promptBeforeOpen: showPrompt? true : false}, function (result) 
		        {
		            if (result.value != null && closeCallback != null)
	            	{
		            	result.value.addEventHandler(Microsoft.Office.WebExtension.EventType.DialogEventReceived, function()
		            	{
		            		dialogCloseAsync(result.value, closeCallback);
		            	});
	            	}
		        });
		}
    };
    
    //Override AC functionalities to match office 365
    AC.authOneDrive = function(success, error)
    {
    	if (app.spinner) 
    	{
    		app.spinner.stop();
    		app.resume = true;
    	}
    	
    	AC.reqQueue.push({success: success, error: error});
    	
    	showODLoginPopup();
    };
    
    AC.showError = function(err)
    {
    	app.showNotification(mxResources.get('error'), err);
    };
    
    //TODO add support for openLinkId if menu is re-enabled
    AC.showMsg = function(msg, isError, isInfo, isSuccess, showBusy)
    {
    	app.showNotification('', msg);
    	var header = ''
    		
    	if (showBusy) 
    	{
    		header = '<img src="/images/spin.gif">';
    	}
    	
    	AC.$('#notification-message-header').innerHTML = header;
    };
    
    AC.hideMsg = function()
    {
    	app.hideNotification();
    };
    
    window.app = app;
}());

//Source: https://theofficecontext.com/2017/07/27/officejs-second-dialog-does-not-display/
/**
 * Closes the currently open dialog asynchronously.
 * This has an ugly workaround which is to try to set a new
 * event handler on the dialog until it fails. When it failed
 * we know the original dialog object was destroyed and we
 * can then proceed. The issue we are working around is that
 * if you call two dialogs back to back, the second one will
 * likely not open at all.
 * @param {Office.context.ui.dialog} dialog The dialog to be closed
 * @param {function()} asyncResult The callback when close is complete
 */
 function dialogCloseAsync(dialog, asyncResult)
 {
    // issue the close
    dialog.close();
    // and then try to add a handler
    // when that fails it is closed
    setTimeout(function() 
    {
        try
        {
            dialog.addEventHandler(Office.EventType.DialogMessageReceived, function() {});
            dialogCloseAsync(dialog, asyncResult);
        }
        catch(e) 
        {
            asyncResult(); // done - closed
        }
    }, 0);
}
	