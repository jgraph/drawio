/**
 * Copyright (c) 2006-2015, JGraph Ltd
 * Copyright (c) 2006-2015, Gaudenz Alder
 */
/**
 *
 * Class: mxUrlConverter
 * 
 * Converts relative and absolute URLs to absolute URLs with protocol and domain.
 */
var mxUrlConverter = function()
{
	// Empty constructor
};

/**
 * Variable: enabled
 * 
 * Specifies if the converter is enabled. Default is true.
 */
mxUrlConverter.prototype.enabled = true;

/**
 * Variable: baseUrl
 * 
 * Specifies the base URL to be used as a prefix for relative URLs.
 */
mxUrlConverter.prototype.baseUrl = null;

/**
 * Variable: baseDomain
 * 
 * Specifies the base domain to be used as a prefix for absolute URLs.
 */
mxUrlConverter.prototype.baseDomain = null;

/**
 * Function: updateBaseUrl
 * 
 * Private helper function to update the base URL.
 */
mxUrlConverter.prototype.updateBaseUrl = function()
{
	this.baseDomain = location.protocol + '//' + location.host;
	this.baseUrl = this.baseDomain + location.pathname;
	var tmp = this.baseUrl.lastIndexOf('/');
	
	// Strips filename etc
	if (tmp > 0)
	{
		this.baseUrl = this.baseUrl.substring(0, tmp + 1);
	}
};

/**
 * Function: isEnabled
 * 
 * Returns <enabled>.
 */
mxUrlConverter.prototype.isEnabled = function()
{
	return this.enabled;
};

/**
 * Function: setEnabled
 * 
 * Sets <enabled>.
 */
mxUrlConverter.prototype.setEnabled = function(value)
{
	this.enabled = value;
};

/**
 * Function: getBaseUrl
 * 
 * Returns <baseUrl>.
 */
mxUrlConverter.prototype.getBaseUrl = function()
{
	return this.baseUrl;
};

/**
 * Function: setBaseUrl
 * 
 * Sets <baseUrl>.
 */
mxUrlConverter.prototype.setBaseUrl = function(value)
{
	this.baseUrl = value;
};

/**
 * Function: getBaseDomain
 * 
 * Returns <baseDomain>.
 */
mxUrlConverter.prototype.getBaseDomain = function()
{
	return this.baseDomain;
};

/**
 * Function: setBaseDomain
 * 
 * Sets <baseDomain>.
 */
mxUrlConverter.prototype.setBaseDomain = function(value)
{
	this.baseDomain = value;
};

/**
 * Function: isRelativeUrl
 * 
 * Returns true if the given URL is relative.
 */
mxUrlConverter.prototype.isRelativeUrl = function(url)
{
	return typeof url === 'string' && url.substring(0, 10) != 'data:image' &&
		url.substring(0, 7) != 'http://' && url.substring(0, 7) != 'file://' &&
		url.substring(0, 8) != 'https://' && url.substring(0, 2) != '//';
};

/**
 * Function: convert
 * 
 * Converts the given URL to an absolute URL with protol and domain.
 * Relative URLs are first converted to absolute URLs.
 */
mxUrlConverter.prototype.convert = function(url)
{
	if (this.isEnabled() && this.isRelativeUrl(url))
	{
		if (this.getBaseUrl() == null)
		{
			this.updateBaseUrl();
		}
		
		if (url.charAt(0) == '/')
		{
			url = this.getBaseDomain() + url;
		}
		else
		{
			url = this.getBaseUrl() + url;
		}
	}
	
	return url;
};
