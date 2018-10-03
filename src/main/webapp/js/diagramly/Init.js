// urlParams is null when used for embedding
window.urlParams = window.urlParams || {};

// isLocalStorage controls access to local storage
window.isLocalStorage = window.isLocalStorage || false;

// Checks for SVG support
window.isSvgBrowser = window.isSvgBrowser || (navigator.userAgent.indexOf('MSIE') < 0 || document.documentMode >= 9);

// CUSTOM_PARAMETERS - URLs for save and export
window.EXPORT_URL = window.EXPORT_URL || 'https://exp.draw.io/ImageExport4/export';
window.PLANT_URL = window.PLANT_URL || 'https://exp-plant.draw.io/plantuml3';
window.VSD_CONVERT_URL = window.VSD_CONVERT_URL || "https://convert.draw.io/VsdConverter/api/converter";
//window.EMF_CONVERT_URL = window.EMF_CONVERT_URL || "http://localhost:5000/convertEMF";
window.SAVE_URL = window.SAVE_URL || 'save';
window.OPEN_URL = window.OPEN_URL || 'open';
window.PROXY_URL = window.PROXY_URL || 'proxy';

// Paths and files
window.SHAPES_PATH = window.SHAPES_PATH || 'shapes';
// Path for images inside the diagram
window.GRAPH_IMAGE_PATH = window.GRAPH_IMAGE_PATH || 'img';
window.ICONSEARCH_PATH = window.ICONSEARCH_PATH || ((navigator.userAgent.indexOf('MSIE') >= 0 ||
	urlParams['dev']) && window.location.protocol != 'file:' ? 'iconSearch' : 'https://www.draw.io/iconSearch');
window.TEMPLATE_PATH = window.TEMPLATE_PATH || 'templates';
window.NEW_DIAGRAM_CATS_PATH = window.NEW_DIAGRAM_CATS_PATH || 'newDiagramCats';

// Directory for i18 files and basename for main i18n file
window.RESOURCES_PATH = window.RESOURCES_PATH || 'resources';
window.RESOURCE_BASE = window.RESOURCE_BASE || RESOURCES_PATH + '/dia';

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
	var lang = (urlParams['offline'] == '1') ? 'en' : urlParams['lang'];
	
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
	'fil' : 'Filipino',
	'fr' : 'Français',
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
	'th' : 'ไทย',
	'ko' : '한국어',
	'ja' : '日本語',
	'zh' : '中文（中国）',
	'zh-tw' : '中文（台灣）'
};

if (typeof window.mxBasePath === 'undefined')
{
	window.mxBasePath = 'mxgraph';
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

/**
 * Returns the global UI setting before runngin static draw.io code
 */
window.uiTheme = window.uiTheme || (function() 
{
	var ui = urlParams['ui'];

	// Known issue: No JSON object at this point in quirks in IE8
	if (ui == null && typeof JSON !== 'undefined')
	{
		// Cannot use mxSettings here
		if (isLocalStorage) 
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
	}
	
	// Uses minimal theme on small screens
	try
	{
		if (ui == null)
		{
	        var iw = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;

	        if (iw <= 414)
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
		if (ex.substring(0, 7) != 'http://' &&  ex.substring(0, 8) != 'https://')
		{
			ex = 'http://' + ex;
		}
		
		EXPORT_URL = ex;
	}

	// URL for logging
	window.DRAWIO_LOG_URL = window.DRAWIO_LOG_URL || '';

	//Adds hard-coded logging domain for draw.io domains
	var host = window.location.host;
	
	if (host != 'test.draw.io')
	{
		var searchString = 'draw.io';
		var position = host.length - searchString.length;
		var lastIndex = host.lastIndexOf(searchString, position);
		
		if (lastIndex !== -1 && lastIndex === position)
		{
			window.DRAWIO_LOG_URL = 'https://log.draw.io';
		}
	}
})();

// Enables offline mode
if (urlParams['offline'] == '1' || urlParams['demo'] == '1' || urlParams['stealth'] == '1' || urlParams['local'] == '1')
{
	urlParams['picker'] = '0';
	urlParams['gapi'] = '0';
	urlParams['db'] = '0';
	urlParams['od'] = '0';
	urlParams['gh'] = '0';
	urlParams['tr'] = '0';
}

// Disables math in offline mode
if (urlParams['offline'] == '1' || urlParams['local'] == '1')
{
	urlParams['math'] = '0';
}

// Lightbox enables chromeless mode
if (urlParams['lightbox'] == '1')
{
	urlParams['chrome'] = '0';
}
