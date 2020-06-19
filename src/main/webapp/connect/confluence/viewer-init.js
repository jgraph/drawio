// Parses URL parameters
function getUrlParam(param, treatEmptyAsNull)
{
	var result = (new RegExp(param + '=([^&]*)')).exec(window.location.search);
	
	if (result != null && result.length > 0)
	{
		var val = decodeURIComponent(result[1].replace(/\+/g, '%20'));
		return treatEmptyAsNull && val != null && val.length == 0 ? null : val;
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
OPEN_URL = '/import';
PROXY_URL = '/proxy';
SAVE_URL = '/save';

// Absolute for font conversion in lightbox to work
PROXY_URL = '/proxy';

var lightbox = getUrlParam('lightbox') == '1';
var customContent = getUrlParam('custom') == '1';

if (lightbox)
{
	document.body.style.backgroundImage = 'url(/images/drawlogo-text-bottom.svg)';
	document.body.style.backgroundPosition = 'center 30%';
	document.body.style.backgroundSize = '128px';
}
