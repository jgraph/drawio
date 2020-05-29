  var oauthToken, officeInitialized = false, refreshToken;
  var LS_KEY = 'oDrawGDrive';
  
  // See https://console.cloud.google.com/apis/credentials/oauthclient/850530949725.apps.googleusercontent.com?project=drawio-viewer
  // must match contents in WEB-INF/google_client_secret and WEB-INF/google_client_id
  var driveClientId = '850530949725.apps.googleusercontent.com';

  function onGDriveCallback(authInfo, callback)
  {
	  oauthToken = authInfo.access_token;
	  var expiresIn = authInfo.expires_in;
	  refreshToken = authInfo.refresh_token || refreshToken;

	  localStorage.setItem(LS_KEY, JSON.stringify({token: oauthToken, expires: Date.now() + parseInt(expiresIn) * 1000, refreshToken: refreshToken}));
	  
	  if (callback != null)
	  {
		  callback();
	  }
	  else
	  {
		  window.location = 'https://' + window.location.hostname + '/connect/office365/drive.html';
	  }
  };
  
  function gotoAuthPage()
  {
	  var req = new XMLHttpRequest();
	  req.open('GET', 'https://' + window.location.hostname + '/google?getState=1');
		
	  req.onreadystatechange = function()
	  {
		  if (this.readyState == 4)
		  {
			  if (this.status >= 200 && this.status <= 299)
			  {
				  gotoAuthPageStep2(req.responseText);
			  }
			  else
			  {
				  AC.showError('Unexpected Error. Please try again later.');
			  }
		  }
	  };
		
	  req.send();
  };
  
  function gotoAuthPageStep2(state)
  {
	  window.location = 'https://accounts.google.com/o/oauth2/v2/auth?client_id=' + driveClientId +
		'&redirect_uri=' + encodeURIComponent('https://' + window.location.hostname + '/google') + 
		'&response_type=code&access_type=offline&prompt=consent%20select_account&include_granted_scopes=true' +
		'&scope=' + encodeURIComponent('https://www.googleapis.com/auth/drive.readonly') +
		'&state=' + encodeURIComponent('cId=' + driveClientId + '&domain=' + window.location.hostname + '&ver=2&token=' + state);
  };
  
  function getAccessToken(onSuccess, onError)
  {
	  var authInfo = localStorage.getItem(LS_KEY);

	  if (authInfo != null)
	  {
		  try
		  {
			  authInfo = JSON.parse(authInfo);

			  refreshToken = authInfo.refreshToken;
			  
			  //Almost expired, so new login is needed
			  if (Date.now() - authInfo.expires > -300000)
			  {
				  if (refreshToken != null)
				  {
					  function doRefreshToken(state)
					  {
						  //Get another refresh token
						  var req = new XMLHttpRequest();
						  req.open('GET', 'https://' + window.location.hostname + '/google?state=' + 
								  encodeURIComponent('cId=' + driveClientId + '&domain=' + window.location.hostname + '&ver=2&token=' + state) + 
								  '&refresh_token=' + refreshToken);
							
						  req.onreadystatechange = function()
						  {
							  if (this.readyState == 4)
							  {
								  if (this.status >= 200 && this.status <= 299)
								  {
									  onGDriveCallback(JSON.parse(req.responseText), onSuccess);
								  }
								  else // (Unauthorized) [e.g, invalid refresh token] (sometimes, the server returns errors other than 401 (e.g. 500))
								  {
									  onError();
								  }
								}
						  }
							
						  req.send();
					  };
					  
					  var req = new XMLHttpRequest();
					  req.open('GET', 'https://' + window.location.hostname + '/google?getState=1');
						
					  req.onreadystatechange = function()
					  {
						  if (this.readyState == 4)
						  {
							  if (this.status >= 200 && this.status <= 299)
							  {
								  doRefreshToken(req.responseText);
							  }
							  else
							  {
								  onError();
							  }
						  }
					  };
						
					  req.send();
				  }
				  else
				  {
					  authInfo = null; //No refresh token, then auth again (sometimes google doesn't return the refresh token!)
				  }
			  }
		  }
		  catch(e)
		  {
			  authInfo = null;
		  }
	  }

	  if (authInfo == null)
	  {
		  onError();
	  }
	  else
	  {
		  oauthToken = authInfo.token;
		  onSuccess();
	  }
  };
  
  // Use the API Loader script to load google.picker and gapi.auth.
  function onApiLoad() 
  {
	  getAccessToken(function()
	  {
		  gapi.load('picker', onPickerApiLoad);
	  }, gotoAuthPage);
  };

  // Create and render a Picker object for picking user files.
  function onPickerApiLoad() 
  {
      var view1 = new google.picker.DocsView(google.picker.ViewId.FOLDERS)
	      .setParent('root')
	      .setIncludeFolders(true)
	      .setMimeTypes('*/*');
	
      var view2 = new google.picker.DocsView()
		  .setIncludeFolders(true)
      
      var view3 = new google.picker.DocsView()
			.setEnableDrives(true)
			.setIncludeFolders(true)
      
      var dim = AC.getDocDim();
      
      var builder = new google.picker.PickerBuilder()
			.addView(view1)
			.addView(view2)
			.addView(view3)
			.setOAuthToken(oauthToken)
			.enableFeature(google.picker.Feature.SUPPORT_DRIVES)
			.setCallback(pickerCallback)
			.setSize(dim.w - 10, dim.h - 10);
				
	  picker = builder.build();		
      picker.setVisible(true);
  };
  
  function toODriveObj(driveFile)
  {
	  //Map Drive file to OneDrive expected fields
	  driveFile.file = {mimeType: driveFile.mimeType};
	  driveFile['@microsoft.graph.downloadUrl'] = driveFile.downloadUrl;
	  driveFile.name = driveFile.title;
	  driveFile.fromDrive = true;
	  
	  return driveFile;
  };
  
  function fetchFileInfo(id, callback, error)
  {
	  var xhr = new XMLHttpRequest();
      xhr.open('GET',
          'https://www.googleapis.com/drive/v2/files/' + id +
          '?fields=id,title,mimeType,modifiedDate,downloadUrl' +
          '&supportsAllDrives=true');
      xhr.setRequestHeader('Authorization', 'Bearer ' + oauthToken);
      xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
      
      xhr.onreadystatechange = function (e) {
        if (xhr.readyState === 4 && xhr.status === 200) {
          var obj = JSON.parse(xhr.response);
          obj.accessToken = oauthToken;
          
          callback(obj);
        } else if (xhr.readyState === 4) {
        	error(xhr);
        }
      };
      xhr.send(null);
  };

  function pickerCallback(data) 
  {
      if (data[google.picker.Response.ACTION] == google.picker.Action.PICKED)
      {
			var doc = data[google.picker.Response.DOCUMENTS][0];

			if (officeInitialized)
			{
				fetchFileInfo(doc.id, function(doc)
				{
					Office.context.ui.messageParent(JSON.stringify(doc));
				}, function(xhr)
				{
					//Since the picker worked, it is unexpected to face an error while fetching more info about the file
					Office.context.ui.messageParent(JSON.stringify({'error': 'Unexpected Error! ' + xhr.response.replace()}));
				});
			}
			else
			{
				Office.context.ui.messageParent('{error: "Unexpected Error!"}'); //Very unlikely
			}
      }
      
      if (data[google.picker.Response.ACTION] == google.picker.Action.CANCEL)
      {
    	  window.close();
      }
  };

  function getGDriveFileInfo(id, callback, error)
  {
	  getAccessToken(function()
	  {
		  fetchFileInfo(id, callback, error);
	  }, function()
	  {
		  AC.showError(mxResources.get('officeNotLoggedGD'));
	  });
  };
  
  function logoutGDrive()
  {
	  oauthToken = null;
	  refreshToken = null;
	  localStorage.removeItem(LS_KEY);
  };