//TODO Some functions are the same as OneDrive AC except for minor changes [sometimes only the URLs and constants are different] 
//		(note also that google doesn't return the refresh token with every request + in office add-in we save the local storage differently)
var GAC = {};

GAC.host = window.location.host;
GAC.clientId = '850530949725.apps.googleusercontent.com';
GAC.redirectUri = window.location.protocol + '//' + GAC.host + '/google';
GAC.scopes = ['https://www.googleapis.com/auth/drive.readonly',
	'https://www.googleapis.com/auth/userinfo.profile']; 
GAC.isLocalStorage = typeof(Storage) != 'undefined';
GAC.authLSKeyName = 'oDrawGDrive'; //Should be the same name as in draw.io
GAC.GDriveBaseUrl = 'https://www.googleapis.com/drive/v2';
GAC.reqQueue = [];
GAC.authOnProgress = false;

if (typeof CAC === 'undefined') 
{
	throw 'CAC object not found, please include file new_common/cac.js';
}
else
{
	CAC.applyCAC(GAC);
}

GAC.authGDrive = function(success, error, direct)
{
	GAC.reqQueue.push({success: success, error: error});
	
	if (GAC.authOnProgress)
	{
		return;
	}
	
	GAC.authOnProgress = true;
	
	if (window.onGoogleDriveCallback == null)
	{
		var auth = function()
		{
			var acceptAuthResponse = true;
			
			var url = 'https://accounts.google.com/o/oauth2/v2/auth?client_id=' + GAC.clientId +
				'&redirect_uri=' + encodeURIComponent(GAC.redirectUri) + 
				'&response_type=code&access_type=offline&prompt=consent%20select_account&include_granted_scopes=true' +
				'&scope=' + encodeURIComponent(GAC.scopes.join(' ')) +
				'&state=' + encodeURIComponent('cId=' + GAC.clientId + '&domain=' + GAC.host); //To identify which app/domain is used

			var width = 525,
				height = 525,
				screenX = window.screenX,
				screenY = window.screenY,
				outerWidth = window.outerWidth,
				outerHeight = window.outerHeight;
			
			var left = screenX + Math.max(outerWidth - width, 0) / 2;
			var top = screenY + Math.max(outerHeight - height, 0) / 2;
			
			var features = ['width=' + width, 'height=' + height,
			                'top=' + top, 'left=' + left,
			                'status=no', 'resizable=yes',
			                'toolbar=no', 'menubar=no',
			                'scrollbars=yes'];
			var popup = window.open(url, 'gdauth', features.join(','));
			
			if (popup != null)
			{
				window.onGoogleDriveCallback = function(authInfo)
				{
					try
					{
						if (acceptAuthResponse)
						{
							window.onGoogleDriveCallback = null;
							acceptAuthResponse = false;
							
							try
							{
								if (authInfo == null)
								{
									error({message: 'Access Denied', retry: auth});
								}
								else
								{
									GAC.token = authInfo.access_token;
									authInfo.expires = Date.now() + parseInt(authInfo.expires_in) * 1000;
									authInfo.remember = true;
									authInfo.token = authInfo.access_token;
									authInfo.refreshToken = authInfo.refresh_token;
									GAC.setPersistentAuth(authInfo);
									
									for (var i = 0; i < GAC.reqQueue.length; i++)
									{
										GAC.reqQueue[i].success();
									}
									
									GAC.reqQueue = [];
									GAC.authOnProgress = false;
								}
							}
							catch (e)
							{
								error(e);
							}
							finally
							{
								popup.close();
							}
						}
						else
						{
							popup.close();
						}
					}
					finally
					{
						authDialog.parentNode.removeChild(authDialog);
					}
				};
			
				popup.focus();
			}
			else
			{
				alert('Error: Google Authentication window blocked');
			}
		};
		
		if (direct)
		{
			auth();
		}
		else
		{
			if (window.spinner != null)
			{
				spinner.stop();
			}
			
			var authDialog = document.createElement('div');
			var btn = document.createElement('button');
			btn.innerHTML = 'Authorize draw.io to access Google Drive';
			btn.className = 'aui-button aui-button-primary';
			authDialog.appendChild(btn);
			
			function adjustAuthBtn()
			{
				var w = window.innerWidth, h = window.innerHeight;
				authDialog.style.cssText = 'position: absolute; top: 0px; left: 0px; width: '+ w +'px; height: '+ h +'px; background: #fff;opacity: 0.85;z-index: 9999;';
				btn.style.cssText = 'position: absolute; width: 320px; height: 50px; top: '+ (h/2 - 25) +'px; left: '+ (w/2 - 160) +'px;opacity: 1;';
			}
	
			btn.addEventListener('click', function(evt) 
			{
				auth();
				//Remove the event handler since the user already used the button
				window.removeEventListener("resize", adjustAuthBtn);
			});
			
			window.addEventListener('resize', adjustAuthBtn);
			adjustAuthBtn();
			document.body.appendChild(authDialog);
		}
	}
	else
	{
		error({message: 'Busy'});
	}
};

//JSON request with auth
GAC.doAuthRequest = function(url, method, params, success, error)
{
	GAC.doAuthRequestPlain(GAC.GDriveBaseUrl + url, method, params, function(req)
	{
		success(JSON.parse(req.responseText));
	}, error);
};

//JSON request with auth
GAC.doAuthRequestPlain = function(url, method, params, success, error, contentType, isBinary, retryCount, isBlob, failIfNotAuth)
{
	retryCount = retryCount || 0;
	
	if (retryCount > 4)
	{
		//Since we tried multiple times, the token itself maybe corrupted
		GAC.setPersistentAuth(null);
		error();
		return;
	}
	
	if (GAC.token == null)
	{
		var token = GAC.getPersistentToken();
		
		if (token == null)
		{
			if (failIfNotAuth)
			{
				error({authNeeded: true});
			}
			else
			{
				GAC.authGDrive(function()
				{
					//Retry request after authentication
					GAC.doAuthRequestPlain(url, method, params, success, error, contentType, isBinary, ++retryCount, isBlob);
				}, error);
			}
			return;
		}
		else
		{
			GAC.token = token;
		}
	}
	
	var req = new XMLHttpRequest();
	req.open(method, url);
	req.setRequestHeader('Authorization', 'Bearer ' + GAC.token);
	req.setRequestHeader('Content-Type', contentType || 'application/json;charset=UTF-8');
	
	req.onreadystatechange = function()
	{
		if (this.readyState == 4)
		{
			if (this.status >= 200 && this.status <= 299)
			{
				success(req);
			}
			else if (this.status == 401) // (Unauthorized) [e.g, invalid token]
			{
				//Try refresh token before asking for new authentication
				var authInfo = GAC.getPersistentAuth();
				
				if (authInfo != null && authInfo.refreshToken != null)
				{
					var req2 = new XMLHttpRequest();
					req2.open('GET', GAC.redirectUri + '?refresh_token=' + authInfo.refreshToken +
							'&state=' + encodeURIComponent('cId=' + GAC.clientId + '&domain=' + GAC.host)); //To identify which app/domain is used
					
					req2.onreadystatechange = function()
					{
						if (this.readyState == 4)
						{
							if (this.status >= 200 && this.status <= 299)
							{
								var newAuthInfo = JSON.parse(req2.responseText);
								GAC.token = newAuthInfo.access_token;
								//Update existing authInfo and save it
								authInfo.access_token = newAuthInfo.access_token;
								authInfo.refresh_token = newAuthInfo.refresh_token;
								authInfo.expires = Date.now() + newAuthInfo.expires_in * 1000;
								authInfo.token = authInfo.access_token;
								authInfo.refreshToken = authInfo.refresh_token;
								GAC.setPersistentAuth(authInfo);
								//Retry request with refreshed token
								GAC.doAuthRequestPlain(url, method, params, success, error, contentType, isBinary, ++retryCount, isBlob);
							}
							else // (Unauthorized) [e.g, invalid refresh token] (sometimes, the server returns errors other than 401 (e.g. 500))
							{
								if (failIfNotAuth)
								{
									error({authNeeded: true});
								}
								else
								{
									GAC.authGDrive(function()
									{
										//Retry request after authentication
										GAC.doAuthRequestPlain(url, method, params, success, error, contentType, isBinary, ++retryCount, isBlob);
									}, error);
								}
							}
						}
					}
					
					req2.send();
				}
				else
				{
					if (failIfNotAuth)
					{
						error({authNeeded: true});
					}
					else
					{
						GAC.authGDrive(function()
						{
							//Retry request after authentication
							GAC.doAuthRequestPlain(url, method, params, success, error, contentType, isBinary, ++retryCount, isBlob);
						}, error);
					}
				}
			}
			else
			{
				error(this);
			}
		}
	};
	
	if (isBinary && req.overrideMimeType)
	{
		req.overrideMimeType('text/plain; charset=x-user-defined');
	}
	
	if (isBlob)
	{
		req.responseType = 'blob';
	}
	
	req.send(params != null? JSON.stringify(params) : null);
};

GAC.showError = function(err)
{
	alert('Error: ' + e.message);
};

GAC.getFileInfo = function(id, success, error)
{
	GAC.doAuthRequest('/files/' + id +
	        '?fields=id,title,mimeType,modifiedDate,downloadUrl,thumbnailLink,webViewLink,embedLink,fileSize,lastModifyingUser,owners' +
	        '&supportsAllDrives=true',
			 'GET', null, function(obj)
			 {
				success(obj);
			 }, error);
};

GAC.setOrigin = function(origin)
{
	GAC.origin = origin;
};

GAC.getOrigin = function()
{
	return GAC.origin || GAC.getUrlParam('xdm_e', true) || (window.location.protocol + '//' + window.location.host);
};

GAC.pickFile = function(fn, acceptFolders)
{
	acceptFolders = acceptFolders || false;
	
	var view1 = new google.picker.DocsView(google.picker.ViewId.FOLDERS)
	    .setParent('root')
	    .setIncludeFolders(true)
	    .setSelectFolderEnabled(acceptFolders)
	    .setMimeTypes('*/*');
	
	var view2 = new google.picker.DocsView()
		.setIncludeFolders(true)
		.setSelectFolderEnabled(acceptFolders)
	
	var view3 = new google.picker.DocsView()
		.setEnableDrives(true)
		.setIncludeFolders(true)
		.setSelectFolderEnabled(acceptFolders)
	
	var dim = GAC.getDocDim();
	
	var builder = new google.picker.PickerBuilder()
		.addView(view1)
		.addView(view2)
		.addView(view3)
		.setOAuthToken(GAC.token)
		.enableFeature(google.picker.Feature.SUPPORT_DRIVES)
		.setCallback(function(data)
		{
			  if (data[google.picker.Response.ACTION] == google.picker.Action.PICKED)
		      {
				    var doc = data[google.picker.Response.DOCUMENTS][0];
				    
				    GAC.getFileInfo(doc.id, function(fullDoc)
				    {
				    	fn(fullDoc);
				    }, function()
				    {
				    	fn(doc);
				    });
		      }
		})
		.setOrigin(GAC.getOrigin())
		.setSize(dim.w - 10, dim.h - 10);
				
	picker = builder.build();		
	picker.setVisible(true);
};

GAC.confirmGDAuth = function(success, error, failIfNotAuth)
{
	GAC.doAuthRequestPlain('https://www.googleapis.com/oauth2/v2/userinfo',
			 'GET', null, success, error, null, null, null, null, failIfNotAuth);
};

//This function depends on having GraphViewer loaded
GAC.extractGraphModelFromPng = function(pngData)
{
	return Editor.extractGraphModelFromPng(pngData);
};

GAC.getBinaryFile = function(file, success, error)
{
	if (file['downloadUrl'] == null)
	{
		GAC.getFileInfo(file.id, function(completeFile)
		{
			GAC.getBinaryFile(completeFile, success, error);
		}, error);
		
		return;
	}
	
	GAC.doAuthRequestPlain(file['downloadUrl'], 'GET', null, function(req)
	{
		success(req.response);
	}, error, null, null, null, true);
};

//This function depends on having GraphViewer loaded
GAC.getDrawioFileDoc = function(file, success, error, doCheck)
{
	if (file['downloadUrl'] == null)
	{
		GAC.getFileInfo(file.id, function(completeFile)
		{
			GAC.getDrawioFileDoc(completeFile, success, error, doCheck);
		}, error);
		
		return;
	}
	
	var isPng = file.mimeType == 'image/png';
	
	GAC.doAuthRequestPlain(file['downloadUrl'], 'GET', null, function(req)
	{
		try 
		{
			var cnt = req.responseText;
			
			if (isPng)
			{
				cnt = 'data:image/png;base64,' + Editor.base64Encode (cnt);
				cnt = GAC.extractGraphModelFromPng(cnt);
			}
			
			var doc = mxUtils.parseXml(cnt);

			if (!doCheck || new Editor().extractGraphModel(doc.documentElement) != null)
			{
				file.isDrawio = true;
				success(doc, cnt, true);
				return;
			}
		}
		catch(e) {} //on error and if the doc is null, the following line will call the error
	
		error();

	}, error, null, isPng);
};

//This function depends on having GraphViewer loaded
GAC.checkDrawioFile = function(file, success, error)
{
	GAC.getDrawioFileDoc(file, success, error, true);
};

GAC.setPersistentAuth = function(authInfo)
{
	if (GAC.isLocalStorage)
	{
		if (authInfo != null)
		{
			//Google Auth doesn't return the refresh_token with every request, so we need to copy it when auth info is saved
			if (authInfo.refreshToken == null)
			{
				var curInfo = GAC.getPersistentAuth();
				
				if (curInfo != null) authInfo.refreshToken = curInfo.refreshToken;
			}
			
			localStorage.setItem('.' + GAC.authLSKeyName, JSON.stringify(authInfo));
		} 
		else
		{
			GAC.token = null;
			localStorage.removeItem('.' + GAC.authLSKeyName);
		}
	}
};

GAC.getPersistentToken = function()
{
	var authInfo = GAC.getPersistentAuth();
	var token = null;
	
	if (authInfo != null)
	{
		token = authInfo.access_token;
	}
	
	return token;
};

GAC.getPersistentAuth = function()
{
	var authInfo = null;
	
	if (GAC.isLocalStorage)
	{
		authInfo = JSON.parse(localStorage.getItem('.' + GAC.authLSKeyName));
	}
	
	return authInfo;
};
