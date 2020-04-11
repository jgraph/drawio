function embedDiagramMain()
{
	var selectedDiagramInfo = null;
	var selectedElt = null;
	var activeTab = 'upload';
	var issueId = getUrlParam('issueId');
	var attEditor, odEditor = null, gdEditor = null;
	var curViewer = null;
	var lastDiagramUrl = null;
	
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

	function htmlEntities(s, newline)
	{
		s = String(s || '');
		
		s = s.replace(/&/g,'&amp;'); // 38 26
		s = s.replace(/"/g,'&quot;'); // 34 22
		s = s.replace(/\'/g,'&#39;'); // 39 27
		s = s.replace(/</g,'&lt;'); // 60 3C
		s = s.replace(/>/g,'&gt;'); // 62 3E

		if (newline == null || newline)
		{
			s = s.replace(/\n/g, '&#xa;');
		}
		
		return s;
	};
	
	function showError(msg)
	{
		var errorMsg = document.getElementById("errorMsg");
       	errorMsg.innerHTML = msg;
		errorMsg.className = "fade";
		setTimeout(function()
		{
			errorMsg.className = "";
		}, 5000);
	};
	
	function doSubmit(newDiag, fileContent, fileModifiedTS)
	{
		var updateInfo = function(resp)
   	    {
			var diagramsInfo = {name: [], txtContent: [], updated: [], id: []};
			
   	        if (!resp.status) //no error
   	        {
   	        	resp = JSON.parse(resp);
   	            diagramsInfo = resp.value;
   	        }
   	        
   	        if (diagramsInfo.embeddedDiagrams != null)
	        {
   	        	diagramsInfo.embeddedDiagrams.push(newDiag);
	        }
   	        else
	        {
   	        	diagramsInfo.embeddedDiagrams = [newDiag];
	        }
   	        
   	     	diagramsInfo.hasDiagram = 1;
   	     	
   	     	//Glance counter properties
   	     	AP.request({
   	            url: "/rest/api/2/issue/" + issueId + "/properties/com.atlassian.jira.issue:com.mxgraph.jira.plugins.drawio:drawioViewerGlance:status",
   	            type: "PUT",
   	            data: JSON.stringify({ type: 'badge', value: { label: String((diagramsInfo.id? diagramsInfo.id.length : 0) + diagramsInfo.embeddedDiagrams.length) } }),
   	            contentType: "application/json"
   	        });

   	     	AP.request({
   	            url: "/rest/api/2/issue/" + issueId + "/properties/drawio-metadata",
   	            type: "PUT",
   	            data: JSON.stringify(diagramsInfo),
   	            contentType: "application/json",
   	            success: function()
   	            {
   	            	AP.jira.refreshIssuePage();
   	            	AP.dialog.close();
   	            },
   	            error : function()
   	            {
   	            	showError('Error occured during saving, please try again later.');
   	            }
   	        });
   	    };
		
   	    function startUpdateInfo(resp)
   	    {
   	    	if (resp != null)
    		{
   	    		try
   	    		{
   	    			resp = JSON.parse(resp);
   	    			newDiag.cacheAttId = resp[0].id;
   	    		}
   	    		catch(e){} // Ignore
    		}

	   	    AP.request({
	   	        url: "/rest/api/2/issue/" + issueId + "/properties/drawio-metadata",
	   	        type: "GET",
	   	        success: updateInfo,
	   	        error : updateInfo
	   	    });
   	    };
   	    
   	    //We don't cache extUrl files
   	    if (newDiag.service == 'extUrl')
    	{
   	    	startUpdateInfo();
    	}
   	    else
   	    {
   	    	var postfix = newDiag.displayName, prefix = '';
   	    	
   	    	if (newDiag.service != 'AttFile')
   	    	{
    			prefix = fileModifiedTS + '_';
    			postfix = (newDiag.service == 'OneDrive'? 'W' : 'G') + newDiag.sFileId;
   	    	};
   	    	
	   	    AC.getJiraAttList(issueId, function(attList)
	   	    {
	   	    	var fileExists = false;
	   	    	newDiag.diagramName = prefix + postfix;
				var lc = newDiag.diagramName.toLowerCase();
				
				// Checks if any file will be overwritten
				for (var i = 0; i < attList.length && !fileExists; i++)
				{
					var an = attList[i].filename.toLowerCase();
	
					if (an == lc)
					{
						fileExists = true;
					}
				}
				
				if (fileExists)
				{
					//Make filename unique
					newDiag.nameDiff = Date.now();
					newDiag.diagramName = prefix + newDiag.nameDiff + '-' + postfix;
				}
				
				AC.uploadToJira(fileContent, issueId, newDiag.diagramName, 
						'application/vnd.jgraph.mxfile', startUpdateInfo, startUpdateInfo); //On error save also as caching is not blocking
	   	    }, startUpdateInfo);
   	    }
	};
	
	function onSubmit()
	{
		if (activeTab == 'extUrl')
		{
			showDiagFromUrl(null, function(diagramUrl, diagramName)
			{
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
				}
				
				doSubmit({
	        		diagramUrl: diagramUrl,
	        		diagramName: diagramName,
	        		aspect: aspect,
	        		service: 'extUrl'
	   	        });
			});
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
	};
	 
	function activateTab()
	{
		switch (activeTab)
    	{
		case 'gDrive':
	    	if (gdEditor == null)
    		{
    			gdEditor = new GDriveEditor(function(selectedFile, width, height, autoSize, selFileContent)
    			{
    				doSubmit({
    					displayName: selectedFile.title,
    					service: 'GDrive',
    					sFileId: selectedFile.id,
    					aspect: selectedFile.aspect,
    					mime: selectedFile.mimeType,
    					createdBy: selectedFile.owners && selectedFile.owners[0]? selectedFile.owners[0].displayName : null,
    	        		lastModifiedBy: selectedFile.lastModifyingUser? selectedFile.lastModifyingUser.displayName : null,
    					modifiedDate: selectedFile.modifiedDate,
    					size: selectedFile.fileSize
    				}, selFileContent, new Date(selectedFile.modifiedDate).getTime());
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
    				doSubmit({
    					displayName: selectedFile.name,
    					service: 'OneDrive',
    					sFileId: selectedFile.id,
    					odriveId: selectedFile.parentReference.driveId,
    					aspect: selectedFile.aspect,
    					mime: selectedFile.file.mimeType
    				}, selFileContent, new Date(selectedFile.lastModifiedDateTime).getTime());
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
    	}
	}
	
	function openTab(evt) 
	{
		var tabName = this.getAttribute("data-tabContetn");
	    // Declare all variables
	    var i, tabcontent, tablinks;

	    // Get all elements with class="tabcontent" and hide them
	    tabcontent = document.getElementsByClassName("tabcontent");
	    for (i = 0; i < tabcontent.length; i++) {
	        tabcontent[i].style.display = "none";
	    }

	    // Get all elements with class="tablinks" and remove the class "active"
	    tablinks = document.getElementsByClassName("tablinks");
	    for (i = 0; i < tablinks.length; i++) {
	        tablinks[i].className = tablinks[i].className.replace(" active", "");
	    }

	    // Show the current tab, and add an "active" class to the button that opened the tab
	    document.getElementById(tabName).style.display = "block";
	    evt.currentTarget.className += " active";
	    
	    activeTab = tabName;
	    activateTab();
	}

	function showElemError(id, errMsg)
	{
		AC.$('#' + id).style.border = '1px solid red';
		AC.$('#' + id + 'Error').innerHTML = errMsg;
	};

	function showDiagFromUrl(evt, callback)
	{
		if (evt)
		{
			evt.preventDefault();
		}
		
		var hasErr = false;
		var diagramName = AC.$('#diagramName').value;
		
		if (!diagramName)
		{
			showElemError('diagramName', 'Please enter Diagram Name');
			hasErr = true;
		}
		
		var diagramUrl = AC.$('#diagramUrl').value;
		
		if (!diagramUrl)
		{
			showElemError('diagramUrl', 'Please enter Diagram URL');
			hasErr = true;
		}
		
		if (hasErr)
		{
			return;
		} 
		else if (lastDiagramUrl == diagramUrl) //No need to render diagram again since URL didn't change
		{
			if (callback)
			{
				callback(diagramUrl, diagramName);
			}
			return;
		}
		
		lastDiagramUrl = diagramUrl;
		
		var prevDiv = AC.$('#previewEU');
		spinner.spin(prevDiv);
		
		var xhr = new XMLHttpRequest();
		xhr.open('GET', diagramUrl);
		
		xhr.onreadystatechange = function()
		{
			if (xhr.readyState == 4)
			{	
				spinner.stop();
				prevDiv.innerHTML = '';
				curViewer = null;
				
				if (xhr.status >= 200 && xhr.status <= 299)
				{
					//TODO Png support?
					var doc = mxUtils.parseXml(xhr.responseText);
					
					if (new Editor().extractGraphModel(doc.documentElement) != null)
					{
						if (callback)
						{
							callback(diagramUrl, diagramName);
						}
						else
						{
							var container = document.createElement('div');
							container.style.cssText = 'position:absolute;width:100%;height:auto;bottom:0px;top:0px;border:1px solid transparent;';
							prevDiv.appendChild(container);
		
							curViewer = new GraphViewer(container, doc.documentElement,
									{highlight: '#3572b0', border: 8, 'auto-fit': true,
									resize: false, nav: true, lightbox: false, title: diagramName,
									'toolbar-nohide': true, 'toolbar-position': 'top', toolbar: 'pages layers'});
						}
					}
					else
					{
						showElemError('diagramUrl', 'Not a draw.io diagram');
					}
				}
				else
				{
					showElemError('diagramUrl', 'Invalid Diagram URL: ' + (xhr.status == 404? 'File Not Found' : 'Error Code ' + xhr.status));
				}
			}
		};
		
		xhr.send();
	};
	
	//=======Upload==========
	attEditor = new AttViewerEditor(function(selectedFile, selFileContent, editedFile, width, height, autoSize, isDrawio, aspect, onError)
	{
		//We only have add in Jira
		if (selectedFile != null)
		{
			doSubmit({
				diagramName: selectedFile.name,
				displayName: selectedFile.name,
				service: 'AttFile',
				aspect: aspect,
				mime: selectedFile.type,
				size: selectedFile.size,
				modifiedDate: selectedFile.lastModified
			}, selFileContent);
		}
	}, null, 'UD', true, true);

	//Staring the editor
	//Setting events listeners
	document.getElementById("showDiagBtn").addEventListener('click', showDiagFromUrl);
	
	function resetBorder()
	{
		if (this.value)
			this.style.border = '';
		
		AC.$('#' + this.id + 'Error').innerHTML = '';
	};
	
	var diagramUrl = document.getElementById('diagramUrl');
	var diagramName = document.getElementById('diagramName');
	
	diagramUrl.addEventListener('keypress', resetBorder);
	diagramName.addEventListener('keypress', resetBorder);
	diagramUrl.addEventListener('change', resetBorder);
	diagramName.addEventListener('change', resetBorder);
	
	var tabs = document.getElementsByClassName("tablinks");
	
	for (var i = 0; i < tabs.length; i++)
	{
		tabs[i].addEventListener('click', openTab);
	}

	AP.sizeToParent(true);
	
	document.getElementById('uploadTab').click();
	
	AP.dialog.disableCloseOnSubmit();
	AP.events.on('dialog.submit', onSubmit);
};