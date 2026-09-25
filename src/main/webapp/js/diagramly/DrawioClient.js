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
			else
			{
				postCookie = cookies.substring(end);
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
		
				if (document.location.protocol.toLowerCase() == 'https')
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
