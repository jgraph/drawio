function getUrlParam(param)
{
	var result = (new RegExp(param + '=([^&]*)')).exec(window.location.search);
	
	if (result != null && result.length > 0)
	{
		return decodeURIComponent(result[1].replace(/\+/g, '%20'))
	}
	
	return null;
};

function getBaseUrl()
{
	var baseUrl = getUrlParam('xdm_e', true) + getUrlParam('cp', true);
	//Ensure baseUrl belongs to attlasian (*.jira.com and *.atlassian.net)
	//Since we add cp to xdm_e, we had to ensure that there is a slash after the domain. Since if xdm_e is ok, cp can corrupt is such as cp = '.fakedomain.com' such that baseUrl is atlassian.net.fakedomain.com
	if (/^https:\/\/([^\.])+\.jira\.com\//.test(baseUrl + '/') || /^https:\/\/([^\.])+\.atlassian\.net\//.test(baseUrl + '/')) 
	{
		return baseUrl;
	}
	throw 'Invalid baseUrl!';
};

// Sets global environment variables
RESOURCE_BASE = '/resources/dia';
STENCIL_PATH = '/stencils';
SHAPES_PATH = '/shapes';
IMAGE_PATH = '/images';

// Overrides browser language with Confluence user language
var lang = getUrlParam('loc');

// Language is in the Connect URL
if (lang != null)
{
	var dash = lang.indexOf('-');
	
	if (dash >= 0)
	{
		mxLanguage = lang.substring(0, dash);
	}
}
