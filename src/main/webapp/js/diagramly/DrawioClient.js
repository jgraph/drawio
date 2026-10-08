/**
 * Copyright (c) 2006-2017, JGraph Holdings Ltd
 * Copyright (c) 2006-2017, draw.io AG
 */
DrawioClient = function(editorUi, cookieName)
{
	mxEventSource.call(this);

	this.ui = editorUi;
	this.cookieName = cookieName;
	this.token = this.getPersistentToken();
};

// Extends mxEventSource
mxUtils.extend(DrawioClient, mxEventSource);

/**
 * Token for the current user.
 */
DrawioClient.prototype.token = null;

/**
 * Token for the current user.
 */
DrawioClient.prototype.user = null;

/**
 * Authorizes the client, gets the userId and calls <open>.
 */
DrawioClient.prototype.setUser = function(user)
{
	this.user = user;
	this.fireEvent(new mxEventObject('userChanged'));
};

/**
 * Authorizes the client, gets the userId and calls <open>.
 */
DrawioClient.prototype.getUser = function()
{
	return this.user;
};

/**
 * 
 */
DrawioClient.prototype.clearPersistentToken = function()
{
	if (isLocalStorage)
	{
		localStorage.removeItem('.' + this.cookieName);
		sessionStorage.removeItem('.' + this.cookieName);
	}
	else if (typeof(Storage) != 'undefined')
	{
		var expiration = new Date();
		expiration.setYear(expiration.getFullYear() - 1);
		document.cookie = this.cookieName + '=; expires=' + expiration.toUTCString();
	}
};

/**
 * Authorizes the client, gets the userId and calls <open>.
 */
DrawioClient.prototype.getPersistentToken = function(trySessionStorage)
{
	var token = null;
	
	if (isLocalStorage)
	{
		token = localStorage.getItem('.' + this.cookieName);
		
		if (token == null && trySessionStorage)
		{
			token = sessionStorage.getItem('.' + this.cookieName);
		}
	}
	
	if (token == null && typeof(Storage) != 'undefined')
	{
		var cookies = document.cookie;
		var name = this.cookieName + '=';
		var start = cookies.indexOf(name);
	
		if (start >= 0)
		{
			start += name.length;
			var end = cookies.indexOf(';', start);
		    
			if (end < 0)
			{
				end = cookies.length;
			}
	
			var value = cookies.substring(start, end);
			token = (value.length > 0) ? value : null;
			
			if (token != null && isLocalStorage)
			{
				// Moves to local storage
				var expiry = new Date();
				expiry.setYear(expiry.getFullYear() - 1);
				document.cookie = name + '; expires=' + expiry.toUTCString();
				localStorage.setItem('.' + this.cookieName, token);
			}
		}
	}
	
	return token;
};

/**
 * Authorizes the client, gets the userId and calls <open>.
 */
DrawioClient.prototype.setPersistentToken = function(token, sessionOnly)
{
	try
	{
		if (token != null)
		{
			if (isLocalStorage)
			{
				if (sessionOnly)
				{
					sessionStorage.setItem('.' + this.cookieName, token);
				}
				else 
				{
					localStorage.setItem('.' + this.cookieName, token);
				}
			}
			else if (typeof(Storage) != 'undefined')
			{
				var expiration = new Date();
				expiration.setYear(expiration.getFullYear() + 10);
				var cookie = this.cookieName + '=' + token + '; path=/' + (sessionOnly? '' : '; expires=' + expiration.toUTCString());
		
				if (document.location.protocol.toLowerCase() == 'https:')
				{
					cookie = cookie + ';secure';
				}
		
				document.cookie = cookie;
			}
		}
		else
		{
			this.clearPersistentToken();
		}
	}
	catch (e)
	{
		this.ui.handleError(e);
	}
};

/**
 * Returns the path of the redirect URI as an OAuth state parameter if the app
 * is deployed under a sub-path (eg. '&path=/drawio/google') so that the server
 * sends the same redirect URI when it exchanges the code. Returns an empty
 * string at the root, where the server uses the service path.
 */
DrawioClient.prototype.getRedirectPathState = function()
{
	var path = new URL(this.redirectUri, window.location.href).pathname;

	// Same pattern as AbsAuth so that no other state parameters can be added
	return (path.lastIndexOf('/') > 0 && /^(\/[A-Za-z0-9_~-][A-Za-z0-9._~-]*)+$/.test(path)) ?
		'&path=' + path : '';
};

/**
 * Returns the callback for the sign-in popup of the given state, which passes
 * the auth info and the popup to fn. If the browser did not keep the state
 * cookie (this window is in a cross-site iframe), the popup passes the code
 * instead if the state has relay=1, and this window exchanges it if the state
 * is its own. Anyone can get a state, so the auth worker only accepts a state
 * without its cookie from this request, which has the cookies of this window.
 */
DrawioClient.prototype.createAuthCallback = function(state, fn)
{
	return mxUtils.bind(this, function(authInfo, authWindow)
	{
		if (authInfo != null && authInfo.authCode != null)
		{
			if (authInfo.token === state)
			{
				var req = new mxXmlRequest(this.redirectUri + '?code=' + encodeURIComponent(authInfo.authCode) +
					'&state=' + encodeURIComponent(authInfo.state), null, 'GET');

				req.setRequestHeaders = function(request, params)
				{
					request.setRequestHeader('X-Auth-Code-Exchange', '1');
				};

				req.send(function(req)
				{
					var newAuthInfo = null;

					if (req.getStatus() >= 200 && req.getStatus() <= 299)
					{
						try
						{
							newAuthInfo = JSON.parse(req.getText());
						}
						catch (e)
						{
							// Handled below
						}
					}

					fn(newAuthInfo, authWindow);
				}, function()
				{
					fn(null, authWindow);
				});
			}
			else if (authWindow != null)
			{
				// A sign-in that this window did not start
				authWindow.close();
			}
		}
		else if (authInfo != null && authInfo.stateByValue)
		{
			// Tokens for a state without relay=1, which this window did not start
			if (authWindow != null)
			{
				authWindow.close();
			}
		}
		else
		{
			fn(authInfo, authWindow);
		}
	});
};
