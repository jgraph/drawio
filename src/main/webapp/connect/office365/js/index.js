(function () 
{
	AC.headless = false;
	
	document.body.onselectstart = function()
	{
		return false;
	};

	var opts =
	{
		left: '50%',
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
	var selectedFile = null;
	var selectedDriveId = null;
	var selectedFileDoc = null;
	var selectedSiteId = null;
	var diagViewer = null;
	var requestInProgress = false;
	var breadcrumb = [];
	var tbHeight = GraphViewer.prototype.toolbarHeight;
    var prevDiv = AC.$('#preview');
    var prevW, prevH;
    var lastFolderArgs = null;
    var lastRenderedFile = null;
    var mode = null;
    var openFileInputElt = null;
    
	mxCellRenderer.prototype.minSvgStrokeWidth = 0.01;
    
	function renderBreadcrumb() 
	{
		var bcDiv = AC.$('.odFilesBreadcrumb');
		bcDiv.innerHTML = '';
		
		for (var i = 0; i < breadcrumb.length - 1; i++)
		{
			var folder = document.createElement('span');
			folder.className = 'odBCFolder';
			folder.innerHTML = AC.htmlEntities(breadcrumb[i].name || mxResources.get('home'));
			bcDiv.appendChild(folder);
			
			(function(bcItem, index)
			{
				folder.addEventListener('click', function()
				{
					renderODFile(null);
					breadcrumb = breadcrumb.slice(0, index);
					fillFolderFiles(bcItem.driveId, bcItem.folderId, bcItem.siteId, bcItem.name);
				});
			})(breadcrumb[i], i);
			
			var sep = document.createElement('span');
			sep.innerHTML = ' &gt; ';
			bcDiv.appendChild(sep);
		}
		
		if (breadcrumb[breadcrumb.length - 1] != null)
		{
			var curr = document.createElement('span');
			curr.innerHTML = AC.htmlEntities((breadcrumb.length == 1) ?
					mxResources.get('officeSelDiag') : (breadcrumb[breadcrumb.length - 1].name || mxResources.get('home')));
			bcDiv.appendChild(curr);
		}
	}
	
	function openFile()
	{
		if (selectedFile == null || requestInProgress) return;
		
		if (selectedDriveId == 'sharepoint')
		{
			fillFolderFiles('site', null, selectedFile.id, selectedFile.displayName);
		}
		else if (selectedDriveId == 'site')
		{
			fillFolderFiles('subsite', null, selectedFile.id, selectedFile.name);
		}
		else
		{
			var isFolder = selectedFile.folder;
			selectedFile = selectedFile.remoteItem? selectedFile.remoteItem : selectedFile; //handle remote items which is accessed indirectly
			var folderDI = (selectedFile.parentReference? selectedFile.parentReference.driveId : null) || selectedDriveId;
			var id = selectedFile.id;
			
			if (isFolder) 
			{
				fillFolderFiles(folderDI, id, null, selectedFile.name);
			}
			else
			{
				insertImage();
			}
		}
	};
	
	function fillFolderFiles(driveId, folderId, siteId, folderName, searchTxt)
	{
		if (requestInProgress) return;
		
        AC.$('.odCatsList').style.display = 'block';
        AC.$('.odFilesSec').style.display = 'block';
        AC.$('#signOutLnk').style.display = '';
        prevDiv.innerHTML = '';
		prevDiv.style.top = '50%';

		requestInProgress = true;
		var acceptRequest = true;
		var isSharepointSites = 0;
		lastFolderArgs = arguments;
	
		function renderList(potintialDrawioFiles)
		{
			spinner.stop();
			
			if (potintialDrawioFiles.length == 0)
			{
				var emptyMsg = document.createElement('div');
				emptyMsg.className = 'odEmptyFolder';
				emptyMsg.innerHTML = AC.htmlEntities(mxResources.get('folderEmpty', null, 'Folder is empty!'));
				filesList.appendChild(emptyMsg);
				requestInProgress = false;
				renderBreadcrumb();
				return;
			}
			
			var grid = document.createElement('table');
			grid.className = 'odFileListGrid';
			filesList.appendChild(grid);
			var currentItem = null;
			var count = 0;
			
			//TODO support paging
			for (var i = 0; i < potintialDrawioFiles.length; i++)
			{
				var item = potintialDrawioFiles[i];
				
				if (isSharepointSites == 1 && item.webUrl && !(item.webUrl.indexOf('sharepoint.com/sites/') > 0 || item.webUrl.indexOf('sharepoint.com/') < 0))
				{
					continue;
				}
				
				var title = item.displayName || item.name;
				var tooltip = AC.htmlEntities(item.description || title);
				var titleLimit = 25;
						
				if (title != null && title.length > titleLimit)
				{
					title = AC.htmlEntities(title.substring(0, titleLimit)) + '&hellip;';
				}
				else
				{
					title = AC.htmlEntities(title);
				}
				
				if (isSharepointSites)
				{
					item.folder = true;
				}
				
				var isFolder = item.folder !=  null;
				var row = document.createElement('tr');
				row.className = (count++) % 2? 'odOddRow' : 'odEvenRow';
				var td = document.createElement('td');
				td.style.width = "24px";
				var typeImg = document.createElement('img');
				typeImg.src = '/images/'  + (isFolder? 'folder.png' : 'file.png');
				typeImg.className = 'odFileImg';
				typeImg.width = 24;
				td.appendChild(typeImg);
				
				row.appendChild(td);
				td = document.createElement('td');
				var titleSpan = document.createElement('span');
				titleSpan.className = "odFileTitle";
				titleSpan.innerHTML = AC.htmlEntities(title);
				titleSpan.setAttribute('title', tooltip);
				td.appendChild(titleSpan);
				row.appendChild(td);
				grid.appendChild(row);
				
				if (currentItem == null)
				{
					currentItem = row;
					currentItem.className += ' odRowSelected';
					selectedFile = item;
					selectedDriveId = driveId;
					renderODFile(selectedFile);
				}
				
				(function(item2, row2)
				{
					row.addEventListener('dblclick', openFile);
					
					row.addEventListener('click', function()
					{
						if (currentItem != row2)
						{
							currentItem.className = currentItem.className.replace('odRowSelected', '');
							currentItem = row2;
							currentItem.className += ' odRowSelected';
							selectedFile = item2;
							selectedDriveId = driveId;
							
							renderODFile(selectedFile);
						}
					});
				})(item, row);
			}
			renderBreadcrumb();
			requestInProgress = false;
		};
		
		var timeoutThread = setTimeout(function()
		{
			acceptRequest = false;
			requestInProgress = false;
			spinner.stop();
			AC.showError(mxResources.get('timeout'));
		}, 20000); //20 sec timeout
		
		var filesList = AC.$('.odFilesList');
        filesList.innerHTML = '';
        spinner.spin(filesList);
        
        var url;
        
        switch(driveId)
        {
        	case 'recent':
        		breadcrumb = [{name: mxResources.get('recent', null, 'Recent'), driveId: driveId}];
        		var recentList = app.getRecentList() || {};
        		var list = [];
        		
        		for (var id in recentList)
    			{
        			list.push(recentList[id]);
    			}
        		
        		clearTimeout(timeoutThread);
        		renderList(list);
        		return;
        	case 'shared':
        		url = '/me/drive/sharedWithMe';
        		breadcrumb = [{name: mxResources.get('sharedWithMe', null, 'Shared With Me'), driveId: driveId}];
        		break;
        	case 'sharepoint':
        		url = '/sites?search=';
        		breadcrumb = [{name: mxResources.get('sharepointSites', null, 'Sharepoint Sites'), driveId: driveId}];
        		isSharepointSites = 1;
        		break;
        	case 'site':
        		breadcrumb.push({name: folderName, driveId: driveId, folderId: folderId, siteId: siteId});
        		url = '/sites/' + siteId + '/drives';
        		isSharepointSites = 2;
        		break;
        	case 'subsite':
        		breadcrumb.push({name: folderName, driveId: driveId, folderId: folderId, siteId: siteId});
        		url = '/drives/' + siteId + (folderId? '/items/' + folderId : '/root') + '/children';
        		break;
        	case 'search': //TODO search doesn't return any results, find out why then remove display: none from the searchBox
        		driveId = selectedDriveId;
        		breadcrumb = [{driveId: driveId, name: mxResources.get('back', null, 'Back')}];
        		searchTxt = encodeURIComponent(searchTxt.replace(/\'/g, '\\\''));
        		url = selectedSiteId? '/sites/' + selectedSiteId + '/drive/root/search(q=\'' + searchTxt + '\')' : (driveId? '/drives/' + driveId + '/root/search(q=\'' + searchTxt + '\')' : '/me/drive/root/search(q=\'' + searchTxt + '\')');
        		break;
        	default:
        		if (folderId == null)
    			{
        			breadcrumb = [{driveId: driveId}];
    			}
        		else
        		{
        			breadcrumb.push({name: folderName, driveId: driveId, folderId: folderId});
        		}
        		
        		url = (driveId?  '/drives/' + driveId : '/me/drive') + (folderId? '/items/' + folderId : '/root') + '/children';
        }
        
        if (!isSharepointSites)
        {
        	url += (url.indexOf('?') > 0 ? '&' : '?') + 'select=id,name,description,parentReference,file,createdBy,lastModifiedBy,lastModifiedDateTime,size,folder,remoteItem,@microsoft.graph.downloadUrl';
        }
        
		AC.doAuthRequest(url, 'GET', null, function(resp) 
		{
			if (!acceptRequest) return;
			clearTimeout(timeoutThread);
			
			var list = resp.value;

			var potintialDrawioFiles = isSharepointSites? list : [];
			
			for (var i = 0; !isSharepointSites && i < list.length; i++)
			{
				var file = list[i];
				var mimeType = file.file? file.file.mimeType : null;
				
				if (file.folder || mimeType == 'text/html' || mimeType == 'text/xml' || mimeType == 'application/xml' || mimeType == 'image/png' 
					|| /\.svg$/.test(file.name) || /\.html$/.test(file.name) || /\.xml$/.test(file.name) || /\.png$/.test(file.name)
					|| /\.drawio$/.test(file.name))
				{
					potintialDrawioFiles.push(file);
				}
			}
			
			renderList(potintialDrawioFiles);
		}, 
		function(err)
		{
			if (!acceptRequest) return;
			clearTimeout(timeoutThread);
			
			var errMsg = null;
			
			try
			{
				errMsg = JSON.parse(err.responseText).error.message;
			}
			catch(e){} //ignore errors
			
			AC.showError(mxResources.get('errorFetchingFolder', null, 'Error fetching folder items') +
				(errMsg != null? ' (' + errMsg + ')' : ''));
			requestInProgress = false;
			spinner.stop();
		});
	};
	
	var selectedCat = AC.$('#odFiles');
	
	var cats = AC.$$('.odCatListTitle');
	
	for (var i = 0; i < cats.length; i++)
	{
		cats[i].addEventListener('click', function()
		{
			if (requestInProgress) return;
			
			selectedCat.className = selectedCat.className.replace('odCatSelected', '');
			selectedCat = this;
			selectedCat.className += ' odCatSelected';
			
			switch(this.id)
			{
				case 'odFiles':
					fillFolderFiles();
				break;
				case 'odRecent':
					fillFolderFiles('recent');
				break;
				case 'odShared':
					fillFolderFiles('shared');
				break;
				case 'odSharepoint':
					fillFolderFiles('sharepoint');
				break;
			}
		});
	}
	
	var insertingImage = false;
	var loadingPreviewFile = null;

	function renderDeviceFile(deviceFile)
	{
        AC.$('#footerButton').style.display = 'none';
        AC.$('#waitContainer').style.display = 'none';
        AC.$('#selectFileContainer').style.display = 'block';
        AC.$(".welcome-body").style.display = 'none';
        AC.$("#connectContainer").style.display = 'block';

        AC.$('.odCatsList').style.display = 'none';
        AC.$('.odFilesSec').style.display = 'none';
        prevDiv.style.top = '0px';
        
        AC.$('#signOutLnk').style.display = 'none';

        AC.$('#addODFile').setAttribute('disabled', 'disabled');
		AC.$('#editODFile2').setAttribute('href', 'javascript:void(0);');
		AC.$('#editODFile2').style.opacity = 0.5;
		AC.$('#newFile2').setAttribute('href', 'https://' + window.location.hostname + '/?mode=device');
		prevDiv.innerHTML = '';
		
		mode = 'D';
		selectedFile = deviceFile;
		spinner.spin(prevDiv);
		var reader = new FileReader();
		
		reader.onload = function(e)
		{
			try
			{
				var isPng = (deviceFile.type == 'image/png');
				
				var cnt = e.target.result;
				
				if (isPng)
				{
					cnt = 'data:image/png;base64,' + Editor.base64Encode (cnt);
					cnt = AC.extractGraphModelFromPng(cnt);
				}
				
				var doc = mxUtils.parseXml(cnt);

				if (new Editor().extractGraphModel(doc.documentElement) != null)
				{
					renderDoc(doc, cnt, deviceFile.name, true);
					lastRenderedFile = deviceFile;
					AC.$('#addODFile').removeAttribute('disabled');
				}
				else
				{
					reportRenderError(true);
				}
			}
			catch (e)
			{
				reportRenderError(false, e);
			}
			
			spinner.stop();
		};

		reader.readAsText(deviceFile);
	};
	
	function renderDriveFile(driveFile, callback)
	{
		toODriveObj(driveFile);
		mode = 'G';
		selectedFile = driveFile;
		
        AC.$('#footerButton').style.display = 'none';
        AC.$('#waitContainer').style.display = 'none';
        AC.$('#selectFileContainer').style.display = 'block';
        AC.$(".welcome-body").style.display = 'none';
        AC.$("#connectContainer").style.display = 'block';

        AC.$('.odCatsList').style.display = 'none';
        AC.$('.odFilesSec').style.display = 'none';
        prevDiv.style.top = '0px';
        
        AC.$('#signOutLnk').style.display = '';
        
        renderFile(driveFile, callback, true);
	};
	
	function renderODFile(file, callback)
	{
		if (file != null) 
		{
			file.fromOD = true;
		}
		
		mode = 'W';
		renderFile(file, callback);
	};
	
	function renderDoc(doc, xml, filename, fullHeight, refreshFn)
	{
		selectedFileDoc = doc;
		var temp = AC.getDocDim();
    	prevW = temp.w - 14;
    	prevH = (fullHeight? temp.h - 67 : temp.h / 2 - 50) - tbHeight;
		
		var container = document.createElement('div');
		container.style.cssText = 'position:absolute;box-sizing:border-box;' +
			'width:' + (prevW - 2) + 'px;height:' + prevH + 'px;margin-bottom:2px;border:1px solid transparent;';

		prevDiv.innerHTML = '';
		prevDiv.appendChild(container);

		var refreshImg = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABUAAAAVCAMAAACeyVWkAAAAhFBMVEUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD8qm6wAAAAK3RSTlMABr4XDQoC07pc+/Yq5dzYtaiSjXlkMx4U8u/NwrKZf1gl8eDKb2lOR0Q6/VKNjQAAAKlJREFUGNOtjlcOwjAQBd1jOwnpvdNh738/kuA4iE/EfI1Gu9JD/4RTyr+bNxDHCS8FKp62CXWAlSYj0n6MNZziLOt90EC2OgXQ5osoF/aagr/GgsBeRUpSsUgeSikHbG4xFpssamCU0lIYZVuMDkFw9oxeTaUOgE74e0T1+Ki1wvOl8iHituojVDJJiAuNhwxlG9+Jhhm3sxGJiaFy7MMuvjFksavRD7wAhtIMKUShI2QAAAAASUVORK5CYII=';
		
		var btnDefs = refreshFn != null? {
			'refresh': {title: mxResources.get('refresh'),
				image: refreshImg, handler: refreshFn
			}
		} : null;
		
		// Layers are enabled to allow selecting the visible layers in the image
		// LATER: Add visible layers to image data and support server-side flow.
		diagViewer = new GraphViewer(container, doc.documentElement,
			{highlight: '#3572b0', 'toolbar-buttons': btnDefs,
			border: 8, 'auto-fit': true, resize: false,
			nav: false, lightbox: false, 'toolbar-nohide': true,
			'toolbar-position': 'top', toolbar: 'pages refresh layers', title: filename});
	};
	
	function reportRenderError(notDiag, error)
	{
		function addWarning(status)
		{
			var warnImg = document.createElement('img');
			warnImg.src = '/mxgraph/images/warning.png';
			warnImg.width = 16;
			warnImg.height = 16;
			status.appendChild(warnImg);
			mxUtils.br(status);
		};
		
		spinner.stop();
		
		var status = document.createElement('div');
		status.className = 'previewStatus';
		
		if (notDiag)
		{
			addWarning(status);
			mxUtils.write(status, mxResources.get('notADiagramFile'));
		}
		else
		{
			mxUtils.write(status, mxResources.get('error') + ':');
			mxUtils.br(status);
			mxUtils.write(status, error.message);
		}
		
		prevDiv.appendChild(status);
	};
	
	function renderFile(file, callback, fullHeight)
	{
		if (insertingImage) return;
		
		lastRenderedFile = null;
		prevDiv.innerHTML = '';
		
		AC.$('#addODFile').setAttribute('disabled', 'disabled');
		AC.$('#editODFile2').setAttribute('href', 'javascript:void(0);');
		AC.$('#editODFile2').style.opacity = 0.5;

		if (file == null || file.folder) 
		{
			var status = document.createElement('div');
			status.className = 'previewStatus';
			mxUtils.write(status, mxResources.get('noPreview'));
			prevDiv.appendChild(status);

			return;
		}
		
		spinner.spin(prevDiv);
		
		try
		{
			// Workaround for parentReference access
			if (file.remoteItem != null)
			{
				file = file.remoteItem;
			}

			loadingPreviewFile = file;
			
			AC.checkDrawioFile(file, function(doc, xml, isDrawio)
			{
				file.isDrawio = isDrawio;
				
				if (loadingPreviewFile != file)
				{
					return;
				}

				lastRenderedFile = file;
	
				renderDoc(doc, xml, file.name, fullHeight, function()
				{
					renderFile(file, null, fullHeight);
				});
				
				AC.$('#addODFile').removeAttribute('disabled');
				
				// Open URL parameter is workaround for broken hash property in Word for Windows
				if (mode == 'G')
				{
					AC.$('#editODFile2').setAttribute('href', 'https://' + window.location.hostname + '/?open=' +
							encodeURIComponent('G' + file.id));
					AC.$('#newFile2').setAttribute('href', 'https://' + window.location.hostname + '/?mode=google');
				}
				else
				{
					AC.$('#editODFile2').setAttribute('href', 'https://' + window.location.hostname + '/?open=' +
						encodeURIComponent('W' + file.parentReference.driveId + '/' + file.id));
					AC.$('#newFile2').setAttribute('href', 'https://' + window.location.hostname + '/?mode=onedrive');
				}
				
				AC.$('#editODFile2').style.opacity = 1;

				spinner.stop();
				
				if (callback)
				{
					callback();
				}
			}, 
			function() //If the file is not a draw.io diagram
			{
				reportRenderError(true);
			});
		}
		catch (e)
		{
			reportRenderError(false, e);
		}
	};
	
	function insertImage() 
	{
		if (insertingImage || (selectedFile != null && selectedFile.folder)) return;
		
		if (lastRenderedFile != selectedFile)
		{
			renderODFile(selectedFile, insertImage);
			return;
		}
		
		insertingImage = true;
		spinner.spin(AC.$('#loading'));
		
		var fileInfo = {};
		
		if (mode == 'W')
		{
			fileInfo = {
	    		type: 'OneDrive',
	    		id: selectedFile.id,
	    		driveId: selectedFile.parentReference.driveId,
	    		lastModifiedDate: selectedFile.lastModifiedDateTime
	    	};
			
			app.addToRecent(selectedFile);
		}
		else if (mode == 'G')
		{
			fileInfo = {
	    		type: 'Drive',
	    		id: selectedFile.id,
	    		lastModifiedDate: selectedFile.modifiedDate
	    	};
		}
		
		app.insertImageInDoc(diagViewer, selectedFileDoc, fileInfo, 
			function()
			{
				spinner.stop();
            	insertingImage = false;
			}, function(errorMsg)
			{
				AC.showError(errorMsg);
				spinner.stop();
				insertingImage = false;
			});
	};
	
    // The initialize function must be run each time a new page is loaded
    Office.initialize = function ()
    {
    	var winDim = AC.getDocDim();
//    	spinner.spin(AC.$('#loading'));
        app.initialize(spinner);

        app.initI18n(function()
        {
	        prevW = winDim.w - 14;
	        prevH = winDim.h / 2 - 50 - tbHeight;
	        
	        app.showStartPage();
	        
			AC.$('#loginO365PopupButton').addEventListener('click', function()
			{
				var tmpAuth = localStorage.getItem('tmpODAuth');
				
				if (tmpAuth != null)
				{
					try
			    	{
			    		var authInfo = JSON.parse(tmpAuth);
			    		
			    		if (authInfo != null && authInfo.access_token != null) 
				        {
				            //save the tokens
				            AC.token = authInfo.access_token;
							authInfo.expiresOn = Date.now() + authInfo.expires_in * 1000;
							authInfo.remember = true;
							AC.setPersistentAuth(authInfo);
				        }
			    	}
			    	catch(e){}
			    	
			    	localStorage.removeItem('tmpODAuth');
				}
				
		        //OneDrive Auth before proceeding
				AC.confirmODAuth(function()
				{
			        AC.$('#footerButton').style.display = 'none';
			        AC.$('#waitContainer').style.display = 'none';
			        AC.$('#selectFileContainer').style.display = 'block';
			        AC.$(".welcome-body").style.display = 'none';
			        AC.$("#connectContainer").style.display = 'block';
			        fillFolderFiles();
			        
			        AC.$('#odSharepoint').style.display = AC.isPersonal ? 'none' : '';
				}, 
				function()
				{
					AC.showError(mxResources.get('errorAuthOD', null, 'Error authenticating to OneDrive!'));
				});
			});
			
			AC.$('#driveBtn').addEventListener('click', function()
			{
				app.showDrivePopup(renderDriveFile);
			});
			
			AC.$('#deviceBtn').addEventListener('click', function()
			{
				if (openFileInputElt == null) 
				{
					var input = document.createElement('input');
					input.setAttribute('type', 'file');
					
					input.addEventListener('change', function()
					{
						if (input.files != null)
						{
							renderDeviceFile(input.files[0]);
							
				    		// Resets input to force change event for same file (type reset required for IE)
							input.type = '';
							input.type = 'file';
				    		input.value = '';
						}
					});
					
					input.style.display = 'none';
					document.body.appendChild(input);
					openFileInputElt = input;
				}
				
				openFileInputElt.click();
			});
			
			AC.$('#backLnk').addEventListener('click', app.showStartPage);
			AC.$('#signOutLnk').addEventListener('click', function()
			{
				if (mode == 'G')
				{
					logoutGDrive();
				}
				else
				{
					AC.setPersistentAuth(null); //Logout from OneDrive
					Office.context.ui.displayDialogAsync('https://login.microsoftonline.com/common/oauth2/v2.0/logout',
			                {height: 50, width: 50, promptBeforeOpen: false});
				}
				
				app.showStartPage();
			});
			
			var delayTimer = null;
			
			function doSearch(searchStr)
			{
				if (requestInProgress) return;
				delayTimer = null;
				fillFolderFiles('search', null, null, null, searchStr)
			};
			
			//Use keyup to detect delete and backspace
			AC.$('#odSearchBox').addEventListener('keyup', function(evt)
			{
				var searchInput = this;
				
				if (delayTimer != null)
				{
					clearTimeout(delayTimer);
				}
				
				if (evt.keyCode == 13)
				{
					doSearch(searchInput.value);
				}
				else
				{
					delayTimer = setTimeout(function()
					{
						doSearch(searchInput.value);	
					}, 500);
				}
			});
	
			function refreshFolder()
			{
				if (lastFolderArgs != null)
				{
					renderODFile(null);
					fillFolderFiles.apply(this, lastFolderArgs);
				}
			};
			
			//HTML elements localization
			var i18nElems = AC.$$('*[data-i18n]'); //get all elements having data-i18n attribute, should be fine given a small html file
			
			for (var i = 0; i < i18nElems.length; i++)
			{
				var i18nKey = i18nElems[i].getAttribute('data-i18n');
				i18nElems[i].innerHTML = AC.htmlEntities(mxResources.get(i18nKey, null, i18nElems[i].innerHTML));
			}
			
			var i18nTitleElems = AC.$$('*[data-i18n-title]'); //get all elements having data-i18n attribute, should be fine given a small html file
			
			for (var i = 0; i < i18nTitleElems.length; i++)
			{
				var i18nKey = i18nTitleElems[i].getAttribute('data-i18n-title');
				i18nTitleElems[i].setAttribute('title', AC.htmlEntities(mxResources.get(i18nKey, null, i18nTitleElems[i].getAttribute('title'))));
			}
			
			AC.$('#newFile').addEventListener('click', function()
			{
				Office.context.ui.displayDialogAsync('https://' + window.location.hostname + '/?mode=' + (mode == 'G'? 'google' : 'onedrive') + '&dt=' + Date.now() + (app.lang != null? '&lang=' + app.lang : ''), 
						{height: 90, width: 90, promptBeforeOpen: false}, function (result) 
				        {
							//TODO open the new file's folder in the file manager
				            _dlg = result.value;
				            
				            if (mode == 'W')
				            {
				            	_dlg.addEventHandler(Microsoft.Office.WebExtension.EventType.DialogEventReceived, refreshFolder);
				            }
				        });
			});

			// Workaround for caching issues in Windows inside popup is to use a link with target blank instead
			AC.$('#editODFile').addEventListener('click', function()
			{
				if (selectedFile == null || selectedFile.folder) return;
				
				app.editDiagram(selectedFile);
			});
			
			AC.$('#refreshOD').addEventListener('click', refreshFolder);
			
			AC.$('#addODFile').addEventListener('click', insertImage);
			
			AC.$('#backBtn').addEventListener('click', function()
			{
				AC.$('#selectFileContainer').style.display = 'block';
				AC.$('#insertErrorContainer').style.display = 'none';
			});

			AC.$('#backBtn2').addEventListener('click', function()
			{
				AC.$('#selectFileContainer').style.display = 'block';
				AC.$('#manualUpdateContainer').style.display = 'none';
			});

			var ContextualMenuElements = document.querySelectorAll(".ms-ContextualMenuExample");
			  
			for (var i = 0; i < ContextualMenuElements.length; i++) 
			{
			    var ButtonElement = ContextualMenuElements[i].querySelector(".menuBtn");
			    var ContextualMenuElement = ContextualMenuElements[i].querySelector(".ms-ContextualMenu");
			    new fabric['ContextualMenu'](ContextualMenuElement, ButtonElement);
			}

			AC.$('#updateSel').addEventListener('click', function()
			{
				this.className = this.className.replace('is-selected', '');
				refreshSelImage({completed: function(){}});
			});

			AC.$('#editSel').addEventListener('click', function()
			{
				this.className = this.className.replace('is-selected', '');
				editSelImage({completed: function(){}});
			});

			AC.$('#manualUpdate').addEventListener('click', function()
			{
				this.className = this.className.replace('is-selected', '');
				AC.$('#manualUpdateContainer').style.display = 'block';
				AC.$('#selectFileContainer').style.display = 'none';
				AC.$('#insertErrorContainer').style.display = 'none';
			});
			
//			//Add selection change handler
//			Office.context.document.addHandlerAsync("documentSelectionChanged", selectionHandler, function(result){console.log(result)} 
//			);
//
//			// Event handler function.
//			function selectionHandler(eventArgs){
//				console.log(eventArgs)
//			}
			
			var editableDiv = AC.$('#editableDiv');

			function handlepaste (e) 
			{
			    var types, pastedData, savedContent;
			    
			    // Browsers that support the 'text/html' type in the Clipboard API (Chrome, Firefox 22+)
			    if (e && e.clipboardData && e.clipboardData.types && e.clipboardData.getData) 
			    {
			        // Check for 'text/html' in types list. See abligh's answer below for deatils on
			        // why the DOMStringList bit is needed
			        types = e.clipboardData.types;
			        
			        if (((types instanceof DOMStringList) && types.contains("text/html")) || 
			        				(types.indexOf && types.indexOf('text/html') !== -1)) 
			        {
			        
			        	// Extract data and pass it to callback
			            pastedData =  e.clipboardData.getData('text/html');
			            processPaste(pastedData);
			            
						// Stop the data from actually being pasted
			            e.stopPropagation();
			            e.preventDefault();
			            return false;
			        }
			        else
		        	{
			        	var imageFound = false;
						var items = e.clipboardData.items;
						
						for (index in items)
						{
							var item = items[index];
							
							if (item.kind === 'file')
							{
								var file = item.getAsFile();
								
								if (file && file.type == 'image/png')
								{
									imageFound = true;
									var reader = new FileReader();
									
									reader.onload = function(e)
									{
										handlePastedImage(e.target.result);
									};
									
									reader.readAsDataURL(file);
									break;
								}
							}
						}
						
						if (imageFound)
						{
							// Stop the data from actually being pasted
				            e.stopPropagation();
				            e.preventDefault();
				            return false;
						}
		        	}
			    }
			    
			    // Everything else: Move existing element contents to a DocumentFragment for safekeeping
			    savedContent = document.createDocumentFragment();
			    
			    while(editableDiv.childNodes.length > 0) 
			    {
			    	savedContent.appendChild(editableDiv.childNodes[0]);
			    }
			    
			    // Then wait for browser to paste content into it and cleanup
			    waitForPastedData(editableDiv, savedContent);
			    return true;
			}

			function waitForPastedData (elem, savedContent) 
			{
				// If data has been processes by browser, process it
			    if (elem.childNodes && elem.childNodes.length > 0) 
			    {
			    	// Retrieve pasted content via innerHTML
			        // (Alternatively loop through elem.childNodes or elem.getElementsByTagName here)
			    	var pastedData = elem.innerHTML;
			        
			        // Restore saved content
			        elem.innerHTML = "";
			        elem.appendChild(savedContent);
			        
			        // Call callback
			        processPaste(pastedData);
			    }
			    // Else wait 20ms and try again
			    else 
			    {
			        setTimeout(function () 
			        {
			            waitForPastedData(elem, savedContent)
			        }, 20);
			    }
			};

			function handlePastedImage(base64Img)
			{
				fileInfo = null;
				
				try
				{
					fileInfo = JSON.parse(AC.extractDataFromPng(base64Img, 'drawioFileInfo'));
				}
				catch(e){}
	
				if (fileInfo == null)
				{
					AC.showError(mxResources.get('noDiagrams'));
				}
				else
				{
					updateSelected(fileInfo, {completed: function(){}});
				}
			};

			function processPaste (pastedData) 
			{
	            var imgElems = mxUtils.parseXml(pastedData).getElementsByTagName('img');

	            for (var i = 0; i < imgElems.length; i++)
            	{
	            	handlePastedImage(imgElems[i].getAttribute('src'));
	            	break;
            	}
			};

			editableDiv.addEventListener('paste', handlepaste, false);
        });		
    };    
}());
