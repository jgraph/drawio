/**
 * Copyright (c) 2006-2017, JGraph Ltd
 * Copyright (c) 2006-2017, Gaudenz Alder
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
DrawioClient.prototype.getPersistentToken = function()
{
	var token = null;
	
	if (isLocalStorage)
	{
		token = localStorage.getItem('.' + this.cookieName);
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
DrawioClient.prototype.setPersistentToken = function(token)
{
	if (token != null)
	{
		if (isLocalStorage)
		{
			localStorage.setItem('.' + this.cookieName, token);
		}
		else if (typeof(Storage) != 'undefined')
		{
			var expiration = new Date();
			expiration.setYear(expiration.getFullYear() + 10);
			var cookie = this.cookieName + '=' + token +'; path=/; expires=' + expiration.toUTCString();
	
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
};
