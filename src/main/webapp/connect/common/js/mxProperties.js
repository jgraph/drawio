var ATLAS_RESOURCE_BASE = '../..';
var RESOURCES_PATH = ATLAS_RESOURCE_BASE + '/resources';
var RESOURCE_BASE = RESOURCES_PATH + '/dia';
var STENCIL_PATH = ATLAS_RESOURCE_BASE + '/stencils';
var SHAPES_PATH = ATLAS_RESOURCE_BASE + '/shapes';
var IMAGE_PATH = '../../images';
var GRAPH_IMAGE_PATH = ATLAS_RESOURCE_BASE + '/img';
var STYLE_PATH = '../../styles';
var CSS_PATH = STYLE_PATH;
var OPEN_FORM = ATLAS_RESOURCE_BASE + '/html/open.html';
var TEMPLATE_PATH = ATLAS_RESOURCE_BASE + '/templates';

var mxBasePath = ATLAS_RESOURCE_BASE + '/mxgraph';
var mxLoadResources = false;

var umlDomain = false;
var collab = null;

// Specifies connection mode for touch devices (at least one should be true)
var isLocalStorage = typeof(Storage) != 'undefined';
var uiTheme = 'atlas';

var urlParams = (function(url) {
	var result = new Object();
	var idx = url.lastIndexOf('?');

	if (idx > 0) {
		var params = url.substring(idx + 1).split('&');

		for ( var i = 0; i < params.length; i++) {
			idx = params[i].indexOf('=');

			if (idx > 0) {
				result[params[i].substring(0, idx)] = params[i].substring(idx + 1);
			}
		}
	}

	return result;
})(window.location.href);

function getLanguage() 
{
	var lang = urlParams['lang'];
	
	if (lang == null)
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
};

var mxLanguage = getLanguage();

// Add new languages here. First entry is translated to [Automatic]
// in the menu defintion in Diagramly.js.
var mxLanguageMap = {'i18n': '', 'id' : 'Bahasa Indonesia', 'ms' : 'Bahasa Melayu', 'bs' : 'Bosanski', 'ca' : 'Català', 'cs' : 'Čeština', 'da' : 'Dansk', 'de' : 'Deutsch', 'et' : 'Eesti', 'en' : 'English', 'es' : 'Español', 
		'fil' : 'Filipino', 'fr' : 'Français', 'it' : 'Italiano', 'hu' : 'Magyar', 'nl' : 'Nederlands', 'no' : 'Norsk', 
		'pl' : 'Polski', 'pt-br' : 'Português (Brasil)', 'pt' : 'Português (Portugal)', 'ro' : 'Română', 'fi' : 'Suomi', 'sv' : 'Svenska', 'vi' : 'Tiếng Việt', 'tr' : 'Türkçe',
		'el' : 'Ελληνικά', 'ru' : 'Русский', 'sr' : 'Српски', 'uk' : 'Українська', 'he' : 'עברית',
		'ar' : 'العربية', 'th' : 'ไทย', 'ko' : '한국어', 'ja' : '日本語', 'zh' : '中文（中国）',  'zh-tw' : '中文（台灣）'};

var mxLanguages = [];

// Populates the list of supported special language bundles
for (var lang in mxLanguageMap)
{
	// Empty means default (ie. browser language), "en" means English (default for unsupported languages)
	// Since "en" uses no extension this must not be added to the array of supported language bundles.
	if (lang != 'en')
	{
		mxLanguages.push(lang);
	}
}

function mxscript(src)
{
	document.write('<script src="'+src+'"></scri' + 'pt>');
};

/* for debugging */
if (urlParams['dev'] == '1') 
{
	var mxDevUrl = document.location.protocol + '//devhost.jgraph.com/mxgraph2';
	var drawDevUrl = document.location.protocol + '//test.draw.io/';
	geBasePath = mxDevUrl + '/javascript/examples/grapheditor/www/js';
	mxBasePath = mxDevUrl + '/javascript/src';

	mxscript(mxBasePath + '/js/mxClient.js');
	mxscript(drawDevUrl + 'js/diagramly/Devel.js');
	mxscript(drawDevUrl + 'connect/common/js/mxReader.js');
}
else
{
	mxscript('../../js/atlas.min.js');
}
