/**
 * Copyright (c) 2006-2021, JGraph Ltd
 * Copyright (c) 2006-2021, draw.io AG
 */

// urlParams is null when used for embedding
window.urlParams = window.urlParams || {};

// isLocalStorage controls access to local storage
window.isLocalStorage = window.isLocalStorage || false;

// Disables loading settings in configured mode
window.mxLoadSettings = window.mxLoadSettings || urlParams['configure'] != '1';

// Checks for SVG support
window.isSvgBrowser = true;

// CUSTOM_PARAMETERS - URLs for save and export
window.DRAWIO_BASE_URL = window.DRAWIO_BASE_URL || ((/.*\.draw\.io$/.test(window.location.hostname)) || (/.*\.diagrams\.net$/.test(window.location.hostname)) ?
	window.location.protocol + '//' + window.location.hostname : 'https://app.diagrams.net');
window.DRAWIO_LIGHTBOX_URL = window.DRAWIO_LIGHTBOX_URL || 'https://viewer.diagrams.net';
window.EXPORT_URL = window.EXPORT_URL || 'https://convert.diagrams.net/node/export';
window.PLANT_URL = window.PLANT_URL || 'https://plant-aws.diagrams.net';
window.DRAW_MATH_URL = window.DRAW_MATH_URL || window.DRAWIO_BASE_URL + '/math';
window.VSD_CONVERT_URL = window.VSD_CONVERT_URL || 'https://convert.diagrams.net/VsdConverter/api/converter';
window.EMF_CONVERT_URL = window.EMF_CONVERT_URL || 'https://convert.diagrams.net/emf2png/convertEMF';
window.REALTIME_URL = window.REALTIME_URL || 'cache';
window.DRAWIO_GITLAB_URL = window.DRAWIO_GITLAB_URL || 'https://gitlab.com';
window.DRAWIO_GITLAB_ID = window.DRAWIO_GITLAB_ID || '5cdc018a32acddf6eba37592d9374945241e644b8368af847422d74c8709bc44';
window.SAVE_URL = window.SAVE_URL || 'save';
window.OPEN_URL = window.OPEN_URL || 'import';
window.PROXY_URL = window.PROXY_URL || 'proxy';
window.DRAWIO_VIEWER_URL = window.DRAWIO_VIEWER_URL || null;
window.NOTIFICATIONS_URL = window.NOTIFICATIONS_URL || 'https://www.draw.io/notifications';

// Paths and files
window.SHAPES_PATH = window.SHAPES_PATH || 'shapes';
// Path for images inside the diagram
window.GRAPH_IMAGE_PATH = window.GRAPH_IMAGE_PATH || 'img';
window.ICONSEARCH_PATH = window.ICONSEARCH_PATH || (((navigator.userAgent != null && navigator.userAgent.indexOf('MSIE') >= 0) ||
	urlParams['dev']) && window.location.protocol != 'file:' ? 'iconSearch' : window.DRAWIO_BASE_URL + '/iconSearch');
window.TEMPLATE_PATH = window.TEMPLATE_PATH || 'templates';
window.NEW_DIAGRAM_CATS_PATH = window.NEW_DIAGRAM_CATS_PATH || 'newDiagramCats';
window.PLUGINS_BASE_PATH = window.PLUGINS_BASE_PATH || '';

// Directory for i18 files and basename for main i18n file
window.RESOURCES_PATH = window.RESOURCES_PATH || 'resources';
window.RESOURCE_BASE = window.RESOURCE_BASE || RESOURCES_PATH + '/dia';

// Specifies global configuration via variable
window.DRAWIO_CONFIG = window.DRAWIO_CONFIG || null;

// Sets the base path, the UI language via URL param and configures the
// supported languages to avoid 404s. The loading of all core language
// resources is disabled as all required resources are in grapheditor.
// properties. Note that in this example the loading of two resource
// files (the special bundle and the default bundle) is disabled to
// save a GET request. This requires that all resources be present in
// the special bundle.
window.mxLoadResources = window.mxLoadResources || false;
window.mxLanguage = window.mxLanguage || (function() 
{
	var lang = urlParams['lang'];
	
	// Known issue: No JSON object at this point in quirks in IE8
	if (lang == null && typeof(JSON) != 'undefined')
	{
		// Cannot use mxSettings here
		if (isLocalStorage) 
		{
			try
			{
				var value = localStorage.getItem('.drawio-config');
				
				if (value != null)
				{
					lang = JSON.parse(value).language || null;
				}
				
				if (!lang && window.mxIsElectron)
				{
					lang = require('electron').remote.app.getLocale();
					
					if (lang != null)
			    	{
			    		var dash = lang.indexOf('-');
			    		
			    		if (dash >= 0)
			    		{
			    			lang = lang.substring(0, dash);
			    		}
			    		
			    		lang = lang.toLowerCase();
			    	}
				}
			}
			catch (e)
			{
				// cookies are disabled, attempts to use local storage will cause
				// a DOM error at a minimum on Chrome
				isLocalStorage = false;
			}
		}
	}
	
	return lang;
})();

// Add new languages here. First entry is translated to [Automatic]
// in the menu defintion in Diagramly.js.
window.mxLanguageMap = window.mxLanguageMap ||
{
	'i18n': '',
	'id' : 'Bahasa Indonesia',
	'ms' : 'Bahasa Melayu',
	'bs' : 'Bosanski',
	'bg' : 'Bulgarian',
	'ca' : 'Català',
	'cs' : 'Čeština',
	'da' : 'Dansk',
	'de' : 'Deutsch',
	'et' : 'Eesti',
	'en' : 'English',
	'es' : 'Español',
	'eu' : 'Euskara',
	'fil' : 'Filipino',
	'fr' : 'Français',
	'gl' : 'Galego',
	'it' : 'Italiano',
	'hu' : 'Magyar',
	'nl' : 'Nederlands',
	'no' : 'Norsk',
	'pl' : 'Polski',
	'pt-br' : 'Português (Brasil)',
	'pt' : 'Português (Portugal)',
	'ro' : 'Română',
	'fi' : 'Suomi',
	'sv' : 'Svenska',
	'vi' : 'Tiếng Việt',
	'tr' : 'Türkçe',
	'el' : 'Ελληνικά',
	'ru' : 'Русский',
	'sr' : 'Српски',
	'uk' : 'Українська',
	'he' : 'עברית',
	'ar' : 'العربية',
	'fa' : 'فارسی',
	'th' : 'ไทย',
	'ko' : '한국어',
	'ja' : '日本語',
	'zh' : '简体中文',
	'zh-tw' : '繁體中文'
};

if (typeof window.mxBasePath === 'undefined')
{
	window.mxBasePath = 'mxgraph';
	window.mxImageBasePath = 'mxgraph/images';
}

if (window.mxLanguages == null)
{
	window.mxLanguages = [];
	
	// Populates the list of supported special language bundles
	for (var lang in mxLanguageMap)
	{
		// Empty means default (ie. browser language), "en" means English (default for unsupported languages)
		// Since "en" uses no extension this must not be added to the array of supported language bundles.
		if (lang != 'en')
		{
			window.mxLanguages.push(lang);
		}
	}
}

// Uses lightbox mode on viewer domain
if (window.location.hostname == DRAWIO_LIGHTBOX_URL.substring(DRAWIO_LIGHTBOX_URL.indexOf('//') + 2))
{
	urlParams['lightbox'] = '1';
}	

// Lightbox enables chromeless mode
if (urlParams['lightbox'] == '1')
{
	urlParams['chrome'] = '0';
}

/**
 * Returns the global UI setting before running static draw.io code
 */
window.uiTheme = window.uiTheme || (function() 
{
	var ui = urlParams['ui'];

	// Known issue: No JSON object at this point in quirks in IE8
	if (ui == null && isLocalStorage && typeof JSON !== 'undefined' && urlParams['lightbox'] != '1')
	{
		try
		{
			var value = localStorage.getItem('.drawio-config');
			
			if (value != null)
			{
				ui = JSON.parse(value).ui || null;
			}
		}
		catch (e)
		{
			// cookies are disabled, attempts to use local storage will cause
			// a DOM error at a minimum on Chrome
			isLocalStorage = false;
		}
	}
	
	//Use Sketch theme for MS Teams (and any future extAuth) by default
	if (ui == null && urlParams['extAuth'] == '1')
	{
		ui = 'sketch';
	}
	
	// Redirects sketch UI to min UI with sketch URL parameter
	if (ui == 'sketch')
	{
		urlParams['sketch'] = '1';
		ui = 'min';
	}
	
	// Uses minimal theme on small screens
	try
	{
		if (ui == null)
		{
	        var iw = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;

	        if (iw <= 768)
	        {
	        	ui = 'min';
	        }
		}
	}
	catch (e)
	{
		// ignore
	}
	
	return ui;
})();

/**
 * Global function for loading local files via servlet
 */
function setCurrentXml(data, filename)
{
	if (window.parent != null && window.parent.openFile != null)
	{
		window.parent.openFile.setData(data, filename);
	}
};

/**
 * Overrides splash URL parameter via local storage
 */
(function() 
{
	// Known issue: No JSON object at this point in quirks in IE8
	if (typeof JSON !== 'undefined')
	{
		// Cannot use mxSettings here
		if (isLocalStorage) 
		{
			try
			{
				var value = localStorage.getItem('.drawio-config');
				var showSplash = true;
				
				if (value != null)
				{
					showSplash = JSON.parse(value).showStartScreen;
				}
				
				// Undefined means true
				if (showSplash == false)
				{
					urlParams['splash'] = '0';
				}
			}
			catch (e)
			{
				// ignore
			}
		}
	}
	
	// Customizes export URL
	var ex = urlParams['export'];

	if (ex != null)
	{
		ex = decodeURIComponent(ex);
		
		if (ex.substring(0, 7) != 'http://' &&  ex.substring(0, 8) != 'https://')
		{
			ex = 'http://' + ex;
		}
		
		EXPORT_URL = ex;
	}

	// Customizes gitlab URL
	var glUrl = urlParams['gitlab'];

	if (glUrl != null)
	{
		glUrl = decodeURIComponent(glUrl);
		
		if (glUrl.substring(0, 7) != 'http://' &&  glUrl.substring(0, 8) != 'https://')
		{
			glUrl = 'http://' + glUrl;
		}
		
		DRAWIO_GITLAB_URL = glUrl;
	}
	
	var glId = urlParams['gitlab-id'];

	if (glId != null)
	{
		DRAWIO_GITLAB_ID = glId;
	}

	// URL for logging
	window.DRAWIO_LOG_URL = window.DRAWIO_LOG_URL || '';

	//Adds hard-coded logging domain for draw.io domains
	var host = window.location.host;
	
	if (host != 'test.draw.io')
	{
		var searchString = 'diagrams.net';
		var position = host.length - searchString.length;
		var lastIndex = host.lastIndexOf(searchString, position);
		
		if (lastIndex !== -1 && lastIndex === position)
		{
			window.DRAWIO_LOG_URL = 'https://log.diagrams.net';
		}
		else
		{
			// For atlas integrations
			var searchString = 'draw.io';
			var position = host.length - searchString.length;
			var lastIndex = host.lastIndexOf(searchString, position);
			
			if (lastIndex !== -1 && lastIndex === position)
			{
				window.DRAWIO_LOG_URL = 'https://log.draw.io';
			}
		}
	}
})();

// Enables offline mode
if (urlParams['offline'] == '1' || urlParams['demo'] == '1' || 
		urlParams['stealth'] == '1' || urlParams['local'] == '1' || urlParams['lockdown'] == '1')
{
	urlParams['picker'] = '0';
	urlParams['gapi'] = '0';
	urlParams['db'] = '0';
	urlParams['od'] = '0';
	urlParams['gh'] = '0';
	urlParams['gl'] = '0';
	urlParams['tr'] = '0';
}

// Disables Trello client by default
if (urlParams['mode'] == 'trello')
{
	urlParams['tr'] = '1';
}

// Uses embed mode on embed domain
if (window.location.hostname == 'embed.diagrams.net')
{
	urlParams['embed'] = '1';
}	

// Fallback for cases where the hash property is not available
if ((window.location.hash == null || window.location.hash.length <= 1) &&
	urlParams['open'] != null)
{
	window.location.hash = urlParams['open'];
}
