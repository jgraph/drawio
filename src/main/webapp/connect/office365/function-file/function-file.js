AC.headless = true;
AC.msgDlg = null;

AC.authOneDrive = function(success, error)
{
	AC.showError(mxResources.get('officeNotLoggedOD'));
};

AC.showError = function(errMsg)
{
	AC.showMsg(errMsg, true);
};

AC.hideMsg = function(callback)
{
	if (AC.msgDlg != null)
	{
		dialogCloseAsync(AC.msgDlg, function()
		{
			AC.msgDlg = null;
			
			if (callback != null)
			{
				callback();
			}
		});
	}
	else if (callback != null)
	{
		callback();
	}
};

AC.showMsg = function(msg, isError, isInfo, isSuccess, showBusy, openLinkId)
{
	function closeDialog(openLater)
	{
		dialogCloseAsync(AC.msgDlg, function()
		{
			AC.msgDlg = null;
			
			if (openLater == true)
			{
				AC.showMsg(msg, isError, isInfo, isSuccess, showBusy);
			}
		});
	};
	
	if (AC.msgDlg == null)
	{
		Office.context.ui.displayDialogAsync('https://' + window.location.hostname + '/connect/office365/function-file/msg.html?msg=' + 
				encodeURIComponent(msg) + '&error=' + (isError? '1' : '0') + '&info=' + (isInfo? '1' : '0') + '&success=' + (isSuccess? '1' : '0') +
				'&busy=' + (showBusy? '1' : '0') + (openLinkId != null? '&openLinkId=' + encodeURIComponent(openLinkId) : ''),
	            {height: 20, width: 20, displayInIframe: true, promptBeforeOpen: false}, function (result)
	    {
	        if (result.value)
	        {
		    	AC.msgDlg = result.value;
		    	AC.msgDlg.addEventHandler(Microsoft.Office.WebExtension.EventType.DialogMessageReceived, closeDialog);
		    	AC.msgDlg.addEventHandler(Microsoft.Office.WebExtension.EventType.DialogEventReceived, closeDialog);
	        }
	    });
	}
	else
	{
		closeDialog(true);
	}
};

function getDiagramsFilesInfo(selectionOnly, callback, onerror)
{
	if (Office.context.requirements.isSetSupported('WordApi', 1.2)) 
	{
		Word.run(function (context) 
		{
			var docPart = selectionOnly? context.document.getSelection() : context.document.body;
			var pics = docPart.inlinePictures;
			
			pics.load('altTextDescription');
			var diagramsFound = [];
			
			return context.sync().then(function () 
			{
	        	for (var i = 0; i < pics.items.length; i++)
        		{
	        		var altTextDescription = pics.items[i].altTextDescription;
	        		var fileInfo = null;
	        		
	        		try
	        		{
	        			fileInfo = JSON.parse(AC.getUrlParam('local-data', true, altTextDescription));
	        		}
	        		catch(e) {}
	        		
	        		if (fileInfo != null)
	        		{
	        			diagramsFound.push({index: i, fileInfo: fileInfo});
	        		}
        		}
		        
		        if (diagramsFound.length > 0)
	        	{
		        	callback(diagramsFound, selectionOnly);
	        	}
		        else
	        	{
		        	onerror(selectionOnly? mxResources.get('officeNoDiagramsSelected', null, 'No diagrams found in the selection') : mxResources.get('officeNoDiagramsInDoc', null, 'No diagrams found in the document'));
	        	}
			});
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
            onerror(errMsg);
        });
	}
	else
	{
		onerror(mxResources.get('officeNotSupported', null, 'This feature is not supported in this host application'));
	}
};

function updateImage(fileInfo, index, selectionOnly, processedCallback)
{
	function doUpdate(file)
	{
		AC.getDrawioFileDoc(file, function(fileDoc, content)
		{
			var container = document.createElement('div');
			container.style.display = 'none';
			document.body.appendChild(container);
			var viewer = new GraphViewer(container, fileDoc.documentElement, 
					{'check-visible-state': false, pageId: fileInfo.pageId, layers: fileInfo.layers != null && fileInfo.layers.join != null? fileInfo.layers.join(' ') : null});

			app.addToRecent(file);

			app.insertImageInDoc(viewer, fileDoc, fileInfo,
					processedCallback, function(errorMsg)
					{
						processedCallback(errorMsg);
					}, index, selectionOnly, true);
		}, function()
		{
			processedCallback(mxResources.get('errorLoadingFile'));
		});
	};
	
	function updateErr(err)
	{
		if (err && err.status == 404)
		{
			processedCallback(mxResources.get('fileNotFound'));
		}
		else
		{
			processedCallback(mxResources.get('errorLoadingFile'));
		}
	};
	
	if (fileInfo.type == 'OneDrive')
	{
		//fetch file from OneDrive
		AC.getFileInfo(fileInfo.id, fileInfo.driveId, doUpdate, updateErr);
	}
	else if (fileInfo.type == 'Drive')
	{
		getGDriveFileInfo(fileInfo.id, function(driveFile)
		{
			doUpdate(toODriveObj(driveFile));
		}, updateErr);
	}
};

function refreshImages(event, selectionOnly)
{
	app.initI18n(function()
	{
		AC.showMsg(mxResources.get('updatingDocument'), false, true, false, true);
		
		var updatedImages = 0, errNo = 0, errMsgs = [];
		
		getDiagramsFilesInfo(selectionOnly, function(diagramsFound, selectionOnly)
		{
			for (var i = 0; i < diagramsFound.length; i++)
			{
				updateImage(diagramsFound[i].fileInfo, diagramsFound[i].index, selectionOnly, function(errMsg)
				{
					if (errMsg == null)
					{
						updatedImages++;
					}
					else
					{
						errNo++;
						errMsgs.push(errMsg);
					}
					
					if (updatedImages + errNo == diagramsFound.length) //All Done
					{
						if (errNo > 0)
							AC.showError(mxResources.get('someImagesFailed', [errNo, diagramsFound.length], '{0} out of {1} failed due to the following errors') + ': ' + errMsgs.join(', '));
						else
							AC.hideMsg();
						
						event.completed();
					}
				});			
			}
		}, 
		function(errMsg)
		{
			if (errMsg != null) 
			{
				AC.showError(errMsg);
			}
			
			event.completed();
		});
	});
};

function refreshAllImages(event) 
{
	refreshImages(event, false);
};

function refreshSelImages(event) 
{
	refreshImages(event, true);
};

function editSelImage(event)
{
	app.initI18n(function()
	{
		getDiagramsFilesInfo(true, function(diagramsFound, selectionOnly)
		{
			if (diagramsFound.length > 1)
			{
				AC.showError(mxResources.get('officeSelectSingleDiag'));
			}
			else
			{
				var fileInfo = diagramsFound[0].fileInfo;
				var index = diagramsFound[0].index;
				
				app.editDiagram(fileInfo, function()
				{
					AC.showMsg(mxResources.get('updatingDocument'), false, true, false, true);

					updateImage(fileInfo, index, selectionOnly, function(errMsg)
					{
						if (errMsg != null)
						{
							AC.showError(errMsg);
						}
						else
						{
							AC.hideMsg();
						}
					});	
				}, true, fileInfo.pageId);
			}
			
			//Notify office that even is completed since editing can take a long time and something wrong can occur
			event.completed();
		}, 
		function(errMsg)
		{
			if (errMsg != null) 
			{
				AC.showError(errMsg);
			}
			
			event.completed();
		});
	});
};