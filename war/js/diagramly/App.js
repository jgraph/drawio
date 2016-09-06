/**
 * Copyright (c) 2006-2016, JGraph Ltd
 * Copyright (c) 2006-2016, Gaudenz Alder
 */
/**
 * Constructs a new point for the optional x and y coordinates. If no
 * coordinates are given, then the default values for <x> and <y> are used.
 * @constructor
 * @class Implements a basic 2D point. Known subclassers = {@link mxRectangle}.
 * @param {number} x X-coordinate of the point.
 * @param {number} y Y-coordinate of the point.
 */
App = function(editor, container, lightbox)
{
	EditorUi.call(this, editor, container, (lightbox != null) ? lightbox : urlParams['lightbox'] == '1');

	// Pre-fetches images
	if (mxClient.IS_SVG)
	{
		mxGraph.prototype.warningImage.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAE7SURBVHjaYvz//z8DJQAggBjwGXDuHMP/tWuD/uPTCxBAOA0AaQRK/f/+XeJ/cbHlf1wGAAQQTgPu3QNLgfHSpZo4DQAIIKwGwGyH4e/fFbG6AiQJEEAs2Ew2NFzH8OOHBMO6dT/A/KCg7wxGRh+wuhQggDBcALMdFIAcHBxgDGJjcwVIIUAAYbhAUXEdVos4OO4DXcGBIQ4QQCguQPY7sgtgAYruCpAgQACx4LJdU1OCwctLEcyWlLwPJF+AXQE0EMUBAAEEdwF6yMOiD4RRY0QT7gqQAEAAseDzu6XldYYPH9DD4joQa8L5AAEENgWb7SBcXa0JDQMBrK4AcQACiAlfyOMCEFdAnAYQQEz4FLa0XGf4/v0H0IIPONUABBAjyBmMjIwMS5cK/L927QORbtBkaG29DtYLEGAAH6f7oq3Zc+kAAAAASUVORK5CYII=';
	}
	else
	{
		var img = new Image();
		img.src = mxGraph.prototype.warningImage.src;
	}
	
	// Global helper method to deal with popup blockers
	window.openWindow = mxUtils.bind(this, function(url, pre, fallback)
	{
		var wnd = window.open(url);
		
		if (wnd == null || wnd === undefined)
		{
			this.showDialog(new PopupDialog(this, url, pre, fallback).container, 320, 140, true, true);
		}
		else if (pre != null)
		{
			pre();
		}
	});
	
	// Initial state for toolbar items is disabled
	this.updateUi();
	
	// Checks if canvas is supported
	var cnv = document.createElement('canvas');
	this.canvasSupported = !!(cnv.getContext && cnv.getContext('2d'));
	
	// Global helper method to display error messages
	window.showOpenAlert = mxUtils.bind(this, function(message)
	{
		// Cancel must be called before showing error message
		if (window.openFile != null)
		{
			window.openFile.cancel(true);
		}
		
		this.handleError(message);
	});
	
	// Sets help link for placeholders
	if (!this.isOffline())
	{
		EditDataDialog.placeholderHelpLink = 'https://support.draw.io/questions/9338941';
	}

	// Handles opening files via drag and drop
	this.addFileDropHandler([document]);
	
	// Process the queue for waiting plugins
	if (App.DrawPlugins != null)
	{
		for (var i = 0; i < App.DrawPlugins.length; i++)
		{
			App.DrawPlugins[i](this);
		}
		
		window.Draw.loadPlugin = function(callback)
		{
			callback(this);
		};
	}

	this.load();
};

/**
 * Executes the first step for connecting to Google Drive.
 */
App.ERROR_TIMEOUT = 'timeout';

/**
 * Executes the first step for connecting to Google Drive.
 */
App.ERROR_BUSY = 'busy';

/**
 * Executes the first step for connecting to Google Drive.
 */
App.ERROR_UNKNOWN = 'unknown';

/**
 * Sets the delay for autosave in milliseconds. Default is 2000.
 */
App.MODE_GOOGLE = 'google';

/**
 * Sets the delay for autosave in milliseconds. Default is 2000.
 */
App.MODE_DROPBOX = 'dropbox';

/**
 * Sets the delay for autosave in milliseconds. Default is 2000.
 */
App.MODE_ONEDRIVE = 'onedrive';

/**
 * Sets the delay for autosave in milliseconds. Default is 2000.
 */
App.MODE_DEVICE = 'device';

/**
 * Sets the delay for autosave in milliseconds. Default is 2000.
 */
App.MODE_BROWSER = 'browser';

/**
 * Sets the delay for autosave in milliseconds. Default is 2000.
 */
App.DROPBOX_APPKEY = 'libwls2fa9szdji';

/**
 * Defines plugin keys for loadnig via p URL parameter.
 */
App.pluginRegistry = {'4xAKTrabTpTzahoLthkwPNUn': '/plugins/explore.js',
	'ex': '/plugins/explore.js', 'p1': '/plugins/p1.js', 'ac': '/plugins/connect.js',
	'acj': '/plugins/connectJira.js', 'voice': '/plugins/voice.js',
	'tips': '/plugins/tooltips.js', 'svgdata': '/plugins/svgdata.js',
	'doors': '/plugins/doors.js'};

/**
 * Function: authorize
 * 
 * Authorizes the client, gets the userId and calls <open>.
 */
App.getStoredMode = function()
{
	var mode = null;
	
	if (typeof(Storage) != 'undefined')
	{
		var cookies = document.cookie.split(";");
		
		for (var i = 0; i < cookies.length; i++)
		{
			// Removes spaces around cookie
			var cookie = mxUtils.trim(cookies[i]);
			
			if (cookie.substring(0, 5) == 'MODE=')
			{
				mode = cookie.substring(5);
				break;
			}
		}
	}
	
	return mode;
};

/**
 * Static Application initializer executed at load-time.
 */
(function()
{
	// Checks for local storage and SVG support
	window.isSvgBrowser = window.isSvgBrowser || (navigator.userAgent.indexOf('MSIE') < 0 || document.documentMode >= 9);

	if (!mxClient.IS_CHROMEAPP)
	{
		if (urlParams['offline'] != '1')
		{
			// Switches to dropbox mode for db.draw.io
			if (window.location.hostname == 'db.draw.io' && urlParams['mode'] == null)
			{
				urlParams['mode'] = 'dropbox';
			}
			
			App.mode = urlParams['mode'];
			
			if (App.mode == null)
			{
				// Stored mode overrides preferred mode
				App.mode = App.getStoredMode();
			}
		}

		if (window.mxscript != null)
		{
			// Loads gapi for all browsers but IE8 and below if not disabled or if enabled and in embed mode
			if (typeof window.DriveClient === 'function')
			{
				if (urlParams['gapi'] != '0' && isSvgBrowser &&
					(document.documentMode == null || document.documentMode >= 10))
				{
					// Immediately loads client
					if (App.mode == App.MODE_GOOGLE || (urlParams['state'] != null &&
						window.location.hash == '') || (window.location.hash != null &&
						window.location.hash.substring(0, 2) == '#G'))
					{
						mxscript('https://apis.google.com/js/api.js');
					}
					else if (urlParams['chrome'] == '0')
					{
						// Disables loading of client
						window.DriveClient = null;
					}
				}
				else
				{
					// Disables loading of client
					window.DriveClient = null;
				}
			}

			// Loads dropbox for all browsers but IE8 and below (no CORS) if not disabled or if enabled and in embed mode
			// KNOWN: Picker does not work in IE11 (https://dropbox.zendesk.com/requests/1650781)
			if (typeof window.DropboxClient === 'function')
			{
				if (urlParams['db'] != '0' && isSvgBrowser &&
					(document.documentMode == null || document.documentMode > 9))
				{
					// Immediately loads client
					if (App.mode == App.MODE_DROPBOX || (window.location.hash != null &&
						window.location.hash.substring(0, 2) == '#D'))
					{
						mxscript('https://www.dropbox.com/static/api/1/dropins.js', null, 'dropboxjs', App.DROPBOX_APPKEY);
					}
					else if (urlParams['chrome'] == '0')
					{
						// Disables loading of client
						window.DropboxClient = null;
					}
				}
				else
				{
					// Disables loading of client
					window.DropboxClient = null;
				}
			}
			
			// Loads OneDrive for all browsers but IE6/IOS if not disabled or if enabled and in embed mode
			if (typeof window.OneDriveClient === 'function')
			{
				if (urlParams['od'] != '0' && !navigator.userAgent.match(/(iPad|iPhone|iPod)/g) &&
					(navigator.userAgent.indexOf('MSIE') < 0 || document.documentMode >= 10))
				{
					// Immediately loads client
					if (App.mode == App.MODE_ONEDRIVE || (window.location.hash != null &&
						window.location.hash.substring(0, 2) == '#W'))
					{
						mxscript('https://js.live.net/v5.0/wl.js');
					}
					else if (urlParams['chrome'] == '0')
					{
						// Disables loading of client
						window.OneDriveClient = null;
					}
				}
				else
				{
					// Disables loading of client
					window.OneDriveClient = null;
				}
			}
			
			// Loads JSON for older browsers
			if (typeof(JSON) == 'undefined')
			{
				mxscript('js/json/json2.min.js');
			}
		}
		
		if (urlParams['plugins'] != '0' && urlParams['offline'] != '1')
		{
			var plugins = mxSettings.getPlugins();
			var temp = urlParams['p'];
			
			if ((temp != null) || (plugins != null && plugins.length > 0))
			{
				// Workaround for need to load plugins now but wait for UI instance
				App.DrawPlugins = [];
				
				// Global entry point for plugins is Draw.loadPlugin. This is the only
				// long-term supported solution for access to the EditorUi instance.
				window.Draw = new Object();
				window.Draw.loadPlugin = function(callback)
				{
					App.DrawPlugins.push(callback);
				};
			}
			
			if (temp != null)
			{
				// Mapping from key to URL in App.plugins
				var t = temp.split(';');
				
				for (var i = 0; i < t.length; i++)
				{
					var url = App.pluginRegistry[t[i]];
					
					if (url != null)
					{
						mxscript(url);
					}
					else if (window.console != null)
					{
						console.log('Unknown plugin:', t[i]);
					}
				}
			}
			
			if (plugins != null && plugins.length > 0 && urlParams['plugins'] != '0')
			{
				// Loading plugins inside the asynchronous block below stops the page from loading so a 
				// hardcoded message for the warning dialog is used since the resources are loadd below
				var warning = 'The page has requested to load the following plugin(s):\n \n {1}\n \n Would you like to load these plugin(s) now?\n \n NOTE : Only allow plugins to run if you fully understand the security implications of doing so.\n';
				
				if (plugins.length == 1 && (plugins[0].charAt(0) == '/' ||
					plugins[0].indexOf(window.location.protocol + '//' + window.location.host) == 0))
				{
					mxscript(plugins[0]);
				}
				// Loads plugins asynchronously
				else if (mxUtils.confirm(mxResources.replacePlaceholders(warning, [plugins.join('\n')]).replace(/\\n/g, '\n')))
				{
					for (var i = 0; i < plugins.length; i++)
					{
						try
						{
							mxscript(plugins[i]);
						}
						catch (e)
						{
							// ignore
						}
					}
				}
			}
		}
	}
})();

/**
 * Program flow starts here.
 */
App.main = function()
{
	var lastErrorMessage = null;
	
	// Changes top level error handling
	window.onerror = function(message, url, linenumber, colno, err)
	{
		try
		{
			if (message == lastErrorMessage || (message != null && url != null &&
				((message.indexOf('Script error') != -1) || (message.indexOf('extension') != -1))))
			{
				// TODO log external domain script failure "Script error." is
				// reported when the error occurs in a script that is hosted
				// on a domain other than the domain of the current page
			}
			// DocumentClosedError seems to be an FF bug an can be ignored for now
			else if (message != null && message.indexOf('DocumentClosedError') < 0)
			{
				lastErrorMessage = message;
				var img = new Image();
				var url = (message.indexOf('NetworkError') >= 0 || message.indexOf('SecurityError') >= 0 ||
					message.indexOf('NS_ERROR_FAILURE') >= 0 || message.indexOf('out of memory') >= 0) ?
					'images/3x3.png' : 'images/2x2.png';
	    		img.src = url + '?msg=' + encodeURIComponent(message) + '&url=' + encodeURIComponent(window.location.href) +
	    			'&lnum=' + encodeURIComponent(linenumber) + '&v=' + encodeURIComponent(EditorUi.VERSION) +
	    			((colno != null) ? '&colno=' + encodeURIComponent(colno) : '') +
	    			((err != null && err.stack != null) ? '&stack=' + encodeURIComponent(err.stack) : '');
			}
		}
		catch (err)
		{
			// do nothing
		}
	};

	/**
	 * Lazy loading of additional CSS for atlas theme.
	 */
	if (uiTheme == 'atlas')
	{
		mxClient.link('stylesheet', 'styles/atlas.css');
	}
	
	if (window.mxscript != null)
	{
		/**
		 * Color dialog - Do not add to app.min.js due to path issues!
		 */
		if (urlParams['chrome'] != '0')
		{
			mxscript('js/jscolor/jscolor.js');
		}
	
		/**
		 * Injects offline dependencies
		 */
		if (urlParams['offline'] == '1')
		{
			mxscript('js/shapes.min.js');
			
			var frame = document.createElement('iframe');
			frame.setAttribute('width', '0');
			frame.setAttribute('height', '0');
			frame.setAttribute('src', 'offline.html');
			document.body.appendChild(frame);
		
			// Precaching for stencils. Alternatively we could generate
			// a cache manifest with all stencil and shape files but this
			// simplifies the cache file, streamlines the shape loading
			// to a single loading point (here) vs dynamic loading in the
			// online version. It does slow down the startup time though.
			mxStencilRegistry.stencilSet = {};
		
			// Overrides dynamic loading (everything loaded at startup)
			mxStencilRegistry.getStencil = function(name)
			{
				return mxStencilRegistry.stencils[name];
			};
	
			// Takes stencil data from cache for populating sidebar
			mxStencilRegistry.loadStencilSet = function(stencilFile, postStencilLoad, force)
			{
				var name = stencilFile.substring(stencilFile.indexOf('/') + 1);
				name = 'mxgraph.' + name.substring(0, name.length - 4).replace(/\//g, '.');
				var node = mxStencilRegistry.stencilSet[name];
				
				if (node != null)
				{
					mxStencilRegistry.parseStencilSet(node, postStencilLoad, false);
				}
			};
			
			// Preload all stencils from merged XML file
			var req2 = mxUtils.load('stencils.xml');
			var root = req2.getXml().documentElement;
			var node = root.firstChild;
			
			while (node != null)
			{
				if (node.nodeName == 'shapes' && node.getAttribute('name') != null)
				{
					mxStencilRegistry.stencilSet[node.getAttribute('name').toLowerCase()] = node;
					mxStencilRegistry.parseStencilSet(node);
				}
				
				node = node.nextSibling;
			}
		}
		
		/**
		 * Loads Google Image Picker API
		 */
		if (urlParams['picker'] != '0' && !mxClient.IS_QUIRKS && document.documentMode != 8)
		{
			mxscript(document.location.protocol + '//www.google.com/jsapi?autoload=%7B%22modules%22%3A%5B%7B%22name%22%3A%22picker%22%2C%22version%22%3A%221%22%2C%22language%22%3A%22' + mxClient.language + '%22%7D%5D%7D');
		}

		// Loads gapi for all browsers but IE8 and below if not disabled or if enabled and in embed mode
		// Special case: Cannot load in asynchronous code below
		if (typeof window.DriveClient === 'function' &&
			(typeof gapi === 'undefined' && (((urlParams['embed'] != '1' && urlParams['gapi'] != '0') ||
			(urlParams['embed'] == '1' && urlParams['gapi'] == '1')) && isSvgBrowser &&
			isLocalStorage && (document.documentMode == null || document.documentMode >= 10))))
		{
			mxscript('https://apis.google.com/js/api.js?onload=DrawGapiClientCallback');
		}
	}
	
	/**
	 * Asynchronous MathJax extension.
	 */
	if (urlParams['math'] != '0')
	{
		Editor.initMath();
	}

	// Adds required resources (disables loading of fallback properties, this can only
	// be used if we know that all keys are defined in the language specific file)
	mxResources.loadDefaultBundle = false;
	var bundle = mxResources.getDefaultBundle(RESOURCE_BASE, mxLanguage) ||
		mxResources.getSpecialBundle(RESOURCE_BASE, mxLanguage);

	// Prefetches asynchronous requests so that below code runs synchronous
	// Loading the correct bundle (one file) via the fallback system in mxResources. The stylesheet
	// is compiled into JS in the build process and is only needed for local development.
	mxUtils.getAll((urlParams['dev'] != '1') ? [bundle] : [bundle, STYLE_PATH + '/default.xml'], function(xhr)
	{
		// Adds bundle text to resources
		mxResources.parse(xhr[0].getText());
		
		// Prepares themes with mapping from old default-style to old XML file
		if (xhr.length > 1)
		{
 			Graph.prototype.defaultThemes[Graph.prototype.defaultThemeName] = xhr[1].getDocumentElement();
		}

		// Main
		var ui = new App(new Editor(urlParams['chrome'] == '0'));
		
		if (window.mxscript != null)
		{
			// Loads dropbox for all browsers but IE8 and below (no CORS) if not disabled or if enabled and in embed mode
			// KNOWN: Picker does not work in IE11 (https://dropbox.zendesk.com/requests/1650781)
			if (typeof window.DropboxClient === 'function' &&
				(window.Dropbox != null && typeof Dropbox.choose === 'undefined' &&
				window.DrawDropboxClientCallback != null &&
				(((urlParams['embed'] != '1' && urlParams['db'] != '0') ||
				(urlParams['embed'] == '1' && urlParams['db'] == '1')) &&
				isSvgBrowser && (document.documentMode == null || document.documentMode > 9))))
			{
				mxscript('https://www.dropbox.com/static/api/1/dropins.js', window.DrawDropboxClientCallback, 'dropboxjs', App.DROPBOX_APPKEY);
			}
			
			// Loads OneDrive for all browsers but IE6/IOS if not disabled or if enabled and in embed mode
			if (typeof window.OneDriveClient === 'function' &&
				(typeof WL === 'undefined' && window.DrawOneDriveClientCallback != null &&
				(((urlParams['embed'] != '1' && urlParams['od'] != '0') || (urlParams['embed'] == '1' &&
				urlParams['od'] == '1')) && !navigator.userAgent.match(/(iPad|iPhone|iPod)/g) &&
				(navigator.userAgent.indexOf('MSIE') < 0 || document.documentMode >= 10))))
			{
				mxscript('https://js.live.net/v5.0/wl.js', window.DrawOneDriveClientCallback);
			}
		}
		
		/**
		 * For developers only
		 */
		if (urlParams['chrome'] != '0' && urlParams['test'] == '1')
		{
			mxLog.show();
			mxLog.debug('Started in ' + (new Date().getTime() - t0.getTime()) + 'ms');
			mxLog.debug('Export:', EXPORT_URL);
			mxLog.debug('Development mode:', (urlParams['dev'] == '1') ? 'active' : 'inactive');
			mxLog.debug('Test mode:', (urlParams['test'] == '1') ? 'active' : 'inactive');
		}
	}, function()
	{
		document.getElementById('geStatus').innerHTML = 'Error loading page. <a href="javascript:void(0);" onclick="location.reload();">Please try refreshing.</a>';
	});
};

//Extends EditorUi
mxUtils.extend(App, EditorUi);

/**
 * Executes the first step for connecting to Google Drive.
 */
App.prototype.defaultUserPicture = 'https://lh3.googleusercontent.com/-HIzvXUy6QUY/AAAAAAAAAAI/AAAAAAAAAAA/giuR7PQyjEk/photo.jpg?sz=30';

/**
 * Executes the first step for connecting to Google Drive.
 */
App.prototype.micImage = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA5UlEQVR4Xr3SMYrCQBTGcSfIQiAgRIS9hOANBCurPUAuIAp7A7FVsFkIbLGYA9gKtoKNYG3jll5AFNKG518YMD6SISD4wY9J4MvkMYwRkZqOMSZkifGFe1b4pnvW3TqK8oMo14twxUgXPRSlDxU7TcUNPqATlG7wCi93cA2Iq2x7l7IJsgofB6UTiEjKklFqsabQSdFA5jqDAzrYQGeNNv5d9yDBEAME6NreFmP8Yuma4A8hFpiLSFNAYYYYn0jwCIUnxMcER4h1whS+7hseXKcu9ifGeQ+qeO8GjN7DPve+Q6+oewPhmE63Qfsb6AAAAABJRU5ErkJggg==';

/**
 * Contains the default XML for an empty diagram.
 */
App.prototype.emptyDiagramXml = '<mxGraphModel><root><mxCell id="0"/><mxCell id="1" parent="0"/></root></mxGraphModel>';

/**
 * 
 */
App.prototype.shareImage = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA2RpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDowOTgwMTE3NDA3MjA2ODExODhDNkFGMDBEQkQ0RTgwOSIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDoxMjU2NzdEMTcwRDIxMUUxQjc0MDkxRDhCNUQzOEFGRCIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDoxMjU2NzdEMDcwRDIxMUUxQjc0MDkxRDhCNUQzOEFGRCIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ1M1IFdpbmRvd3MiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDowNjgwMTE3NDA3MjA2ODExODcxRkM4MUY1OTFDMjQ5OCIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDowNzgwMTE3NDA3MjA2ODExODhDNkFGMDBEQkQ0RTgwOSIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PrM/fs0AAADgSURBVHjaYmDAA/7//88MwgzkAKDGFiD+BsQ/QWxSNaf9RwN37twpI8WAS+gGfP78+RpQSoRYA36iG/D379+vQClNdLVMOMz4gi7w79+/n0CKg1gD9qELvH379hzIHGK9oA508ieY8//8+fO5rq4uFCilRKwL1JmYmNhhHEZGRiZ+fn6Q2meEbDYG4u3/cYCfP38uA7kOm0ZOIJ7zn0jw48ePPiDFhmzArv8kgi9fvuwB+w5qwH9ykjswbFSZyM4sEMDPBDTlL5BxkFSd7969OwZ2BZKYGhDzkmjOJ4AAAwBhpRqGnEFb8QAAAABJRU5ErkJggg==';

/**
 *
 */
App.prototype.chevronUpImage = (!mxClient.IS_SVG) ? IMAGE_PATH + '/chevron-up.png' : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNSBNYWNpbnRvc2giIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6NDg2NEE3NUY1MUVBMTFFM0I3MUVEMTc0N0YyOUI4QzEiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6NDg2NEE3NjA1MUVBMTFFM0I3MUVEMTc0N0YyOUI4QzEiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo0ODY0QTc1RDUxRUExMUUzQjcxRUQxNzQ3RjI5QjhDMSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo0ODY0QTc1RTUxRUExMUUzQjcxRUQxNzQ3RjI5QjhDMSIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Pg+qUokAAAAMUExURQAAANnZ2b+/v////5bgre4AAAAEdFJOU////wBAKqn0AAAAL0lEQVR42mJgRgMMRAswMKAKMDDARBjg8lARBoR6KImkH0wTbygT6YaS4DmAAAMAYPkClOEDDD0AAAAASUVORK5CYII=';

/**
 *
 */
App.prototype.chevronDownImage = (!mxClient.IS_SVG) ? IMAGE_PATH + '/chevron-down.png' : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNSBNYWNpbnRvc2giIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6NDg2NEE3NUI1MUVBMTFFM0I3MUVEMTc0N0YyOUI4QzEiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6NDg2NEE3NUM1MUVBMTFFM0I3MUVEMTc0N0YyOUI4QzEiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo0ODY0QTc1OTUxRUExMUUzQjcxRUQxNzQ3RjI5QjhDMSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo0ODY0QTc1QTUxRUExMUUzQjcxRUQxNzQ3RjI5QjhDMSIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PsCtve8AAAAMUExURQAAANnZ2b+/v////5bgre4AAAAEdFJOU////wBAKqn0AAAALUlEQVR42mJgRgMMRAkwQEXBNAOcBSPhclB1cNVwfcxI+vEZykSpoSR6DiDAAF23ApT99bZ+AAAAAElFTkSuQmCC';

/**
 *
 */
App.prototype.formatShowImage = (!mxClient.IS_SVG) ? IMAGE_PATH + '/format-show.png' : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNSBNYWNpbnRvc2giIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6ODdCREY5REY1NkQ3MTFFNTkyNjNEMTA5NjgwODUyRTgiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6ODdCREY5RTA1NkQ3MTFFNTkyNjNEMTA5NjgwODUyRTgiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo4N0JERjlERDU2RDcxMUU1OTI2M0QxMDk2ODA4NTJFOCIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo4N0JERjlERTU2RDcxMUU1OTI2M0QxMDk2ODA4NTJFOCIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PlnMQ/8AAAAJUExURQAAAP///3FxcTfTiAsAAAACdFJOU/8A5bcwSgAAACFJREFUeNpiYEQDDEQJMMABTAAixcQ00ALoDiPRcwABBgB6DADly9Yx8wAAAABJRU5ErkJggg==';

/**
 *
 */
App.prototype.formatHideImage = (!mxClient.IS_SVG) ? IMAGE_PATH + '/format-hide.png' : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNSBNYWNpbnRvc2giIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6ODdCREY5REI1NkQ3MTFFNTkyNjNEMTA5NjgwODUyRTgiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6ODdCREY5REM1NkQ3MTFFNTkyNjNEMTA5NjgwODUyRTgiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo4N0JERjlEOTU2RDcxMUU1OTI2M0QxMDk2ODA4NTJFOCIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo4N0JERjlEQTU2RDcxMUU1OTI2M0QxMDk2ODA4NTJFOCIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PqjT9SMAAAAGUExURQAAAP///6XZn90AAAACdFJOU/8A5bcwSgAAAB9JREFUeNpiYEQDDEQJMMABTAAmNdAC6A4j0XMAAQYAcbwA1Xvj1CgAAAAASUVORK5CYII=';

/**
 *
 */
App.prototype.fullscreenImage = (!mxClient.IS_SVG) ? IMAGE_PATH + '/fullscreen.png' : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMAQMAAABsu86kAAAABlBMVEUAAABEREQ3UJNbAAAAAXRSTlMAQObYZgAAABxJREFUCNdj+PkBhA4YgNB5AwZ+BiACMiAiEFkA9QQNgW8IGoYAAAAASUVORK5CYII=';

/**
 * 
 */
App.prototype.plusImage = (!mxClient.IS_SVG) ? IMAGE_PATH + '/plus.png' : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNSBNYWNpbnRvc2giIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6MDdCMTdENjVCOEM4MTFFNDlCRjVBNDdCODU5NjNBNUMiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6MDdCMTdENjZCOEM4MTFFNDlCRjVBNDdCODU5NjNBNUMiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDowN0IxN0Q2M0I4QzgxMUU0OUJGNUE0N0I4NTk2M0E1QyIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDowN0IxN0Q2NEI4QzgxMUU0OUJGNUE0N0I4NTk2M0E1QyIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PtjrjmgAAAAtSURBVHjaYvz//z8DMigvLwcLdHZ2MiKLMzEQCaivkLGsrOw/dU0cAr4GCDAARQsQbTFrv10AAAAASUVORK5CYII=';

/**
 * 
 */
App.prototype.spinImage = (!mxClient.IS_SVG) ? IMAGE_PATH + '/spin.gif' : 'data:image/gif;base64,R0lGODlhDAAMAPUxAEVriVp7lmCAmmGBm2OCnGmHn3OPpneSqYKbr4OcsIScsI2kto6kt46lt5KnuZmtvpquvpuvv56ywaCzwqK1xKu7yay9yq+/zLHAzbfF0bjG0bzJ1LzK1MDN18jT28nT3M3X3tHa4dTc49Xd5Njf5dng5t3k6d/l6uDm6uru8e7x8/Dz9fT29/b4+Pj5+fj5+vr6+v///wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAkKADEAIf8LTkVUU0NBUEUyLjADAQAAACwAAAAADAAMAAAGR8CYcEgsOgYAIax4CCQuQldrCBEsiK8VS2hoFGOrlJDA+cZQwkLnqyoJFZKviSS0ICrE0ec0jDAwIiUeGyBFGhMPFBkhZo1BACH5BAkKAC4ALAAAAAAMAAwAhVB0kFR3k1V4k2CAmmWEnW6Lo3KOpXeSqH2XrIOcsISdsImhtIqhtJCmuJGnuZuwv52wwJ+ywZ+ywqm6yLHBzbLCzrXEz7fF0LnH0rrI0r7L1b/M1sXR2cfT28rV3czW3s/Z4Nfe5Nvi6ODm6uLn6+Ln7OLo7OXq7efs7+zw8u/y9PDy9PX3+Pr7+////wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAZDQJdwSCxGDAIAoVFkFBwYSyIwGE4OkCJxIdG6WkJEx8sSKj7elfBB0a5SQg1EQ0SVVMPKhDM6iUIkRR4ZFxsgJl6JQQAh+QQJCgAxACwAAAAADAAMAIVGa4lcfZdjgpxkg51nhp5ui6N3kqh5lKqFnbGHn7KIoLOQp7iRp7mSqLmTqbqarr6br7+fssGitcOitcSuvsuuv8uwwMyzw861xNC5x9K6x9K/zNbDztjE0NnG0drJ1NzQ2eDS2+LT2+LV3ePZ4Oba4ebb4ufc4+jm6+7t8PLt8PPt8fPx8/Xx9PX09vf19/j3+Pn///8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAGQ8CYcEgsUhQFggFSjCQmnE1jcBhqGBXiIuAQSi7FGEIgfIzCFoCXFCZiPO0hKBMiwl7ET6eUYqlWLkUnISImKC1xbUEAIfkECQoAMgAsAAAAAAwADACFTnKPT3KPVHaTYoKcb4yjcY6leZSpf5mtgZuvh5+yiqG0i6K1jqW3kae5nrHBnrLBn7LCoLPCobTDqbrIqrvIs8LOtMPPtcPPtcTPuMbRucfSvcrUvsvVwMzWxdHaydTcytXdzNbezdff0drh2ODl2+Ln3eTp4Obq4ujs5Ont5uvu6O3w6u7w6u7x7/L09vj5+vr7+vv7////AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABkdAmXBILHIcicOCUqxELKKPxKAYgiYd4oMAEWo8RVmjIMScwhmBcJMKXwLCECmMGAhPI1QRwBiaSixCMDFhLSorLi8wYYxCQQAh+QQJCgAxACwAAAAADAAMAIVZepVggJphgZtnhp5vjKN2kah3kqmBmq+KobSLorWNpLaRp7mWq7ybr7+gs8KitcSktsWnuManucexwM2ywc63xtG6yNO9ytS+ytW/zNbDz9jH0tvL1d3N197S2+LU3OPU3ePV3eTX3+Xa4efb4ufd5Onl6u7r7vHs7/Lt8PLw8/Xy9Pby9fb09ff2+Pn3+Pn6+vr///8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAGSMCYcEgseiwSR+RS7GA4JFGF8RiWNiEiJTERgkjFGAQh/KTCGoJwpApnBkITKrwoCFWnFlEhaAxXLC9CBwAGRS4wQgELYY1CQQAh+QQJCgAzACwAAAAADAAMAIVMcI5SdZFhgZtti6JwjaR4k6mAma6Cm6+KobSLorWLo7WNo7aPpredsMCescGitMOitcSmuMaqu8ixwc2zws63xdC4xtG5x9K9ytXAzdfCztjF0NnF0drK1d3M1t7P2N/P2eDT2+LX3+Xe5Onh5+vi5+vj6Ozk6e3n7O/o7O/q7vHs7/Lt8PPu8fPx8/X3+Pn6+vv7+/v8/Pz///8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAGRcCZcEgsmkIbTOZTLIlGqZNnchm2SCgiJ6IRqljFmQUiXIVnoITQde4chC9Y+LEQxmTFRkFSNFAqDAMIRQoCAAEEDmeLQQAh+QQJCgAwACwAAAAADAAMAIVXeZRefplff5lhgZtph59yjqV2kaeAmq6FnbGFnrGLorWNpLaQp7mRqLmYrb2essGgs8Klt8apusitvcquv8u2xNC7yNO8ydS8ytTAzdfBzdfM1t7N197Q2eDU3OPX3+XZ4ObZ4ebc4+jf5erg5erg5uvp7fDu8fPv8vTz9fb09vf19/j3+Pn4+fn5+vr6+/v///8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAGRUCYcEgspkwjEKhUVJ1QsBNp0xm2VixiSOMRvlxFGAcTJook5eEHIhQcwpWIkAFQECkNy9AQWFwyEAkPRQ4FAwQIE2llQQAh+QQJCgAvACwAAAAADAAMAIVNcY5SdZFigptph6BvjKN0kKd8lquAmq+EnbGGn7KHn7ONpLaOpbearr+csMCdscCescGhtMOnuMauvsuzws60w862xdC9ytW/y9a/zNbCztjG0drH0tvK1N3M1t7N19/U3ePb4uff5urj6Ozk6e3l6u7m6u7o7PDq7vDt8PPv8vTw8vTw8/X19vf6+vv///8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAGQ8CXcEgsvlytVUplJLJIpSEDUESFTELBwSgCCQEV42kjDFiMo4uQsDB2MkLHoEHUTD7DRAHC8VAiZ0QSCgYIDxhNiUEAOw==';

/**
 * 
 */
App.prototype.emptyLibraryXml = '<mxlibrary>[]</mxlibrary>';

/**
 * Sets the delay for autosave in milliseconds. Default is 2000.
 */
App.prototype.mode = null;

/**
 * Executes the first step for connecting to Google Drive.
 */
App.prototype.timeout = 25000;

/**
 * Switch to disable logging for mode and search terms.
 */
App.prototype.enableLogging = true;

// Restores app defaults for UI
App.prototype.formatEnabled = urlParams['format'] != '0';
App.prototype.formatWidth = (screen.width < 600) ? 0 : mxSettings.getFormatWidth();

/**
 * Overriden UI settings depending on mode.
 */
if (urlParams['embed'] != '1')
{
	App.prototype.menubarHeight = 60;
}

/**
 * Executes the first step for connecting to Google Drive.
 */
Editor.prototype.editButtonLink = (urlParams['edit'] != null) ? decodeURIComponent(urlParams['edit']) : null;

/**
 * Translates this point by the given vector.
 * 
 * @param {number} dx X-coordinate of the translation.
 * @param {number} dy Y-coordinate of the translation.
 */
App.prototype.init = function()
{
	EditorUi.prototype.init.apply(this, arguments);
	
	/**
	 * Overrides export dialog for using cloud storage save.
	 */
	if (this.isLocalFileSave())
	{
		var ui = this;
		
		ExportDialog.saveLocalFile = function(data, filename, format)
		{
			var mime = 'text/xml';
			
			if (format === 'svg')
			{
				mime = 'image/svg+xml';
			}
			
    		ui.saveLocalFile(data, filename, mime);
    	};

    	ExportDialog.saveRequest = function(data, filename, format, fn)
    	{
    		ui.saveRequest(data, filename, format, fn);
    	};
	}

	/**
	 * Specifies the default filename.
	 */
	this.defaultLibraryName = mxResources.get('untitledLibrary');

	/**
	 * Holds the listener for description changes.
	 */	
	this.descriptorChangedListener = mxUtils.bind(this, this.descriptorChanged);

	if (urlParams['embed'] != '1')
	{
		/**
		 * Holds the background element.
		 */
		this.bg = this.createBackground();
		document.body.appendChild(this.bg);
		this.diagramContainer.style.visibility = 'hidden';
		this.formatContainer.style.visibility = 'hidden';

		/**
		 * Creates onedrive client if all required libraries are available.
		 */
		var initOneDriveClient = mxUtils.bind(this, function()
		{
			if (typeof WL !== 'undefined')
			{
				/**
				 * Holds the x-coordinate of the point.
				 */
				this.oneDrive = new OneDriveClient(this);
				
				this.oneDrive.addListener('userChanged', mxUtils.bind(this, function()
				{
					this.updateUserElement();
					this.restoreLibraries();
				}))
				
				// Notifies listeners of new client
				this.fireEvent(new mxEventObject('clientLoaded', 'client', this.oneDrive));
			}
			else if (window.DrawOneDriveClientCallback == null)
			{
				window.DrawOneDriveClientCallback = initOneDriveClient;
			}
		});

		initOneDriveClient();

		/**
		 * Creates drive client with all required libraries are available.
		 */
		var initDriveClient = mxUtils.bind(this, function()
		{
			/**
			 * Creates google drive client if all required libraries are available.
			 */
			if (typeof gapi !== 'undefined')
			{
				var doInit = mxUtils.bind(this, function()
				{
					/**
					 * Holds the x-coordinate of the point.
					 */
					this.drive = new DriveClient(this);
					
					/**
					 * Adds important notice for new app if drive file is loaded in old app.
					 */
					if (this.drive.appId == '420247213240')
					{
						this.editor.addListener('fileLoaded', mxUtils.bind(this, function()
						{
							var file = this.getCurrentFile();
							
							if (file != null && file.constructor == DriveFile)
							{
								var td = document.getElementById('geFooterItem2');
								
								if (td != null)
								{
									td.innerHTML = '<a href="https://support.draw.io/display/DO/2014/11/27/Switching+application+in+Google+Drive" ' +
										'target="_blank" title="IMPORTANT NOTICE" >IMPORTANT NOTICE</a>';
								}
							}
						}));
					}
					
					this.drive.addListener('userChanged', mxUtils.bind(this, function()
					{
						// Changes the footer ads for Google Accounts
						if (this.updateAd != null)
						{
							this.adsHtml = ['<a title="Quick start video" href="https://www.youtube.com/watch?v=8OaMWa4R1SE&t=1" target="_blank">' +
											'<img border="0" align="absmiddle" style="margin-top:-4px;" src="images/glyphicons_star.png"/>&nbsp;&nbsp;Quick start video</a>',
											'<a title="Google Docs Add-on" href="https://chrome.google.com/webstore/detail/drawio-diagrams/clpbjldiohnnmfmkngmaohehlnfkmoea" target="_blank">' +
											'<img border="0" align="absmiddle" style="margin-top:-4px;" src="images/glyphicons_star.png"/>&nbsp;&nbsp;Google Docs Add-on</a>',
											'<a title="Google Chrome App" href="https://chrome.google.com/webstore/detail/drawio-desktop/pebppomjfocnoigkeepgbmcifnnlndla" target="_blank">' +
											'<img border="0" align="absmiddle" style="margin-top:-4px;" src="images/glyphicons_star.png"/>&nbsp;&nbsp;Google Chrome App</a>',
											'<a title="Please help us to 5 stars" href="https://chrome.google.com/webstore/detail/drawio-pro/onlkggianjhjenigcpigpjehhpplldkc/reviews" target="_blank">' +
											'<img border="0" align="absmiddle" style="margin-top:-4px;" src="images/glyphicons_star.png"/>&nbsp;&nbsp;Please help us to 5 stars</a>'];
							this.updateAd(this.adsHtml.length - 1);
						}
						
						this.updateUserElement();
						this.restoreLibraries();
						this.checkLicense();
					}))
					
					// Notifies listeners of new client
					this.fireEvent(new mxEventObject('clientLoaded', 'client', this.drive));
				});
				
				if (window.DrawGapiClientCallback != null)
				{
					gapi.load('auth:client,drive-realtime,drive-share', mxUtils.bind(this, function(resp)
					{
						// Starts the app without the Google Option if the API fails to load
						if (gapi.drive != null && gapi.drive.realtime != null)
						{
							gapi.client.load('drive', 'v2', mxUtils.bind(this, function()
							{
								this.defineCustomObjects();
								
								// Needed to avoid popup blocking for non-immediate authentication
								gapi.auth.init(mxUtils.bind(this, function()
								{
									if (gapi.client.drive != null)
									{
										doInit();
									}
								}));
							}));
						}
					}));
					
					/**
					 * Clears any callbacks.
					 */
					window.DrawGapiClientCallback = null;
				}
				else
				{
					doInit();
				}
			}
			else if (window.DrawGapiClientCallback == null)
			{
				window.DrawGapiClientCallback = initDriveClient;
			}
		});
		
		initDriveClient();

		/**
		 * Creates dropbox client if all required libraries are available.
		 */
		var initDropboxClient = mxUtils.bind(this, function()
		{
			if (window.Dropbox != null && typeof Dropbox.choose !== 'undefined')
			{
				/**
				 * Clears dropbox client callback.
				 */
				window.DrawDropboxClientCallback = null;
				
				/**
				 * Holds the x-coordinate of the point.
				 */
				this.dropbox = new DropboxClient(this);
				
				this.dropbox.addListener('userChanged', mxUtils.bind(this, function()
				{
					this.updateUserElement();
					this.restoreLibraries();
				}));
				
				// Notifies listeners of new client
				this.fireEvent(new mxEventObject('clientLoaded', 'client', this.dropbox));
			}
			else if (window.DrawDropboxClientCallback == null)
			{
				window.DrawDropboxClientCallback = initDropboxClient;
			}
		});

		initDropboxClient();

		// Sets the initial mode
		if (urlParams['local'] == '1')
		{
			this.setMode(App.MODE_DEVICE);
		}
		else
		{
			this.mode = App.mode;
		}
	}
	else if (this.menubar != null)
	{
		this.menubar.container.style.paddingTop = '0px';
	}

	this.updateHeader();
	
	// Changes footer from time to time
	var td = document.getElementById('geFooterItem2');
	
	if (td != null)
	{
		this.adsHtml = ['<a title="Quick start video" href="https://www.youtube.com/watch?v=8OaMWa4R1SE&t=1" target="_blank">' +
					'<img border="0" align="absmiddle" style="margin-top:-4px;" src="images/glyphicons_star.png"/>&nbsp;&nbsp;Quick start video</a>'];
		this.adsHtml.push(td.innerHTML);
		
		mxUtils.setPrefixedStyle(td.style, 'transition', 'all 1s ease');
		var lastAd = this.adsHtml.length - 1;
		
		this.updateAd = function(index)
		{
			if (index == lastAd)
			{
				index = this.adsHtml.length - 1;
			}

			if (index != lastAd)
			{
				mxUtils.setPrefixedStyle(td.style, 'transform', 'scale(0)');
				td.style.opacity = '0';
				lastAd = index;
				
				window.setTimeout(mxUtils.bind(this, function()
				{
					td.innerHTML = this.adsHtml[index];
					mxUtils.setPrefixedStyle(td.style, 'transform', 'scale(1)');
					td.style.opacity = '1';
				}), 1000);
			}
		};
		
		window.setInterval(mxUtils.bind(this, function()
		{
			if (this.adsHtml.length == 3)
			{
				this.updateAd(mxUtils.mod(lastAd + 1, 3));
			}
			else
			{
				var rnd = Math.random();
				this.updateAd(Math.round(rnd * (this.adsHtml.length - 1)));
			}
		}), 300000);
	}
	
	if (this.menubar != null)
	{
		this.buttonContainer = document.createElement('div');
		this.buttonContainer.style.display = 'inline-block';
		this.buttonContainer.style.paddingRight = '48px';
		this.buttonContainer.style.position = 'absolute';
		this.buttonContainer.style.right = '0px';
		
		this.menubar.container.appendChild(this.buttonContainer);
	}

	if (uiTheme == 'atlas' && this.menubar != null)
	{
		if (this.toggleElement != null)
		{
			this.toggleElement.click();
			this.toggleElement.style.display = 'none';
		}
		
		this.icon = document.createElement('img');
		this.icon.setAttribute('src', IMAGE_PATH + '/logo-flat-small.png');
		this.icon.setAttribute('title', mxResources.get('draw.io'));
		this.icon.style.paddingTop = '11px';
		this.icon.style.marginLeft = '4px';
		this.icon.style.marginRight = '6px';
		
		if (mxClient.IS_QUIRKS)
		{
			this.icon.style.marginTop = '12px';
		}
		
		this.menubar.container.insertBefore(this.icon, this.menubar.container.firstChild);
	}

	if (isLocalStorage || mxClient.IS_CHROMEAPP)
	{
		/**
		 * Persists current edge style.
		 */
		this.editor.graph.currentEdgeStyle = mxSettings.getCurrentEdgeStyle();
		this.editor.graph.currentVertexStyle = mxSettings.getCurrentVertexStyle();
		
		// Updates UI to reflect current edge style
		this.fireEvent(new mxEventObject('styleChanged', 'keys', [], 'values', [], 'cells', []));
		
		this.addListener('styleChanged', mxUtils.bind(this, function(sender, evt)
		{
			mxSettings.setCurrentEdgeStyle(this.editor.graph.currentEdgeStyle);
			mxSettings.setCurrentVertexStyle(this.editor.graph.currentVertexStyle);
			mxSettings.save();
		}));

		/**
		 * Persists copy on connect switch.
		 */
		this.editor.graph.connectionHandler.setCreateTarget(mxSettings.isCreateTarget());
		this.fireEvent(new mxEventObject('copyConnectChanged'));
		
		this.addListener('copyConnectChanged', mxUtils.bind(this, function(sender, evt)
		{
			mxSettings.setCreateTarget(this.editor.graph.connectionHandler.isCreateTarget());
			mxSettings.save();
		}));
		
		/**
		 * Persists default page format.
		 */
		this.editor.graph.pageFormat = mxSettings.getPageFormat();
		
		this.addListener('pageFormatChanged', mxUtils.bind(this, function(sender, evt)
		{
			mxSettings.setPageFormat(this.editor.graph.pageFormat);
			mxSettings.save();
		}));
		
		/**
		 * Persists default grid color.
		 */
		this.editor.graph.view.gridColor = mxSettings.getGridColor();
		
		this.addListener('gridColorChanged', mxUtils.bind(this, function(sender, evt)
		{
			mxSettings.setGridColor(this.editor.graph.view.gridColor);
			mxSettings.save();
		}));

		/**
		 * Persists autosave switch in Chrome app.
		 */
		if (mxClient.IS_CHROMEAPP)
		{
			this.editor.addListener('autosaveChanged', mxUtils.bind(this, function(sender, evt)
			{
				mxSettings.setAutosave(this.editor.autosave);
				mxSettings.save();
			}));
			
			this.editor.autosave = mxSettings.getAutosave();
		}
		
		/**
		 * 
		 */
		if (this.sidebar != null)
		{
			this.sidebar.showPalette('search', mxSettings.settings.search);
		}
		
		/**
		 * Shows scratchpad if never shown.
		 */
		if (!this.editor.chromeless && this.sidebar != null && (mxSettings.settings.isNew ||
			parseInt(mxSettings.settings.version || 0) <= 8))
		{
			this.toggleScratchpad();
			mxSettings.save();
		}

		// Saves app defaults for UI
		this.addListener('formatWidthChanged', function()
		{
			mxSettings.setFormatWidth(this.formatWidth);
			mxSettings.save();
		});
	}
};

/**
 * Returns true if the current domain is for the new drive app.
 */
App.prototype.isDriveDomain = function()
{
	return urlParams['drive'] != '0' &&
		(window.location.hostname == 'test.draw.io' ||
		window.location.hostname == 'cdn.draw.io' ||
		window.location.hostname == 'www.draw.io' ||
		window.location.hostname == 'drive.draw.io' ||
		window.location.hostname == 'jgraph.github.io');
};

/**
 * Returns true if the current domain is for the old drive app.
 */
App.prototype.isLegacyDriveDomain = function()
{
	return urlParams['drive'] == 0 || window.location.hostname == 'legacy.draw.io';
};

/**
 * 
 */
App.prototype.checkLicense = function()
{
	var driveUser = this.drive.getUser();
	var email = ((urlParams['dev'] == '1') ? urlParams['lic'] : null) ||
		((driveUser != null) ? driveUser.email : null);
	
	if (!this.isOffline() && !this.editor.chromeless && email != null)
	{
		// Anonymises the local part of the email address
		var at = email.lastIndexOf('@');
		var domain = email;
		
		if (at >= 0)
		{
			domain = email.substring(at + 1);
		}
		
		// Timestamp is workaround for cached response in certain environments
		mxUtils.post('/license', 'domain=' + encodeURIComponent(domain) + '&ts=' + new Date().getTime(),
			mxUtils.bind(this, function(req)
			{
				var registered = false;
				var exp = null;
				
				try
				{
					if (req.getStatus() == 200)
					{
						var value = req.getText();
						registered = true;
						
						if (value.length > 0)
						{
							var lic = JSON.parse(value);
							
							if (lic != null)
							{
								exp = this.handleLicense(lic, domain);
							}
						}
					}
				}
				catch (e)
				{
					// ignore
				}
			}));
	}
};

/**
 * Returns true if the current domain is for the new drive app.
 */
App.prototype.handleLicense = function(lic, domain)
{
	var footer = document.getElementById('geFooter');
	var expiry = null;

	if (footer != null && lic != null)
	{
		expiry = lic.expiry;
		
		if (lic.footer != null)
		{
			footer.innerHTML = decodeURIComponent(lic.footer);
		}
		else
		{
			this.hideFooter();
		
			if (expiry != null && expiry != 'never')
			{
				var exp = new Date(Date.parse(expiry));
				var diff = Math.round((exp - Date.now()) / (1000 * 60 * 60 * 24));
		
				if (diff < 90)
				{
		    		var link = 'https://support.draw.io/display/DKB/draw.io+footer+state+that+license+is+expiring+on+Google+For+Work+account?domain=' + encodeURIComponent(domain);
		    		footer.style.height = '100%';
		    		footer.style.margin = '0px';
		    		footer.style.display = '';
		    		
		    		if (diff < 0)
		    		{
			    		this.footerHeight = 80;
		    			footer.innerHTML = '<table height="100%"><tr><td valign="middle" align="center" class="geStatusAlert geBlink">' +
		    				'<a href="' + link + '" style="padding-top:16px;" target="_blank">' + 
		    				'<img border="0" src="' + mxGraph.prototype.warningImage.src + '" align="top" style="margin-right:6px">' +
		    				mxResources.get('licenseHasExpired', [domain, exp.toLocaleDateString()]) + '</a></td></tr></table>';
		    		}
		    		else
		    		{
			    		this.footerHeight = 46;
		    			footer.innerHTML = '<table height="100%"><tr><td valign="middle" align="center" class="geStatusAlert">' +
		    				'<a href="' + link + '" target="_blank">' +
		    				'<img border="0" src="' + mxGraph.prototype.warningImage.src + '" align="top" style="margin-right:6px">' +
		    				mxResources.get('licenseWillExpire', [domain, exp.toLocaleDateString()]) + '</a></td></tr></table>';
		    		}
		    		
		    		this.refresh();
				}
			}
		}
	}
	
	return expiry;
};

/**
 * 
 */
App.prototype.getEditBlankXml = function()
{
	var file = this.getCurrentFile();
	
	if (file != null && this.editor.chromeless && this.editor.graph.lightbox && file.realtime == null)
	{
		return file.getData();
	}
	else
	{
		return this.getFileData(true);
	}
};

/**
 * Updates action states depending on the selection.
 */
App.prototype.updateActionStates = function()
{
	EditorUi.prototype.updateActionStates.apply(this, arguments);

	var file = this.getCurrentFile();
	this.actions.get('revisionHistory').setEnabled(file != null && ((file.constructor == DriveFile &&
			file.isEditable()) || file.constructor == DropboxFile));
};

/**
 * Sets the onbeforeunload for the application
 */
App.prototype.updateDraft = function()
{
	if (isLocalStorage && localStorage != null)
	{
		localStorage.setItem('.draft', JSON.stringify({modified: new Date().getTime(), data: this.getFileData()}));
	}
};

/**
 * Sets the onbeforeunload for the application
 */
App.prototype.getDraft = function()
{
	// FIXME: Handle multiple tabs
//	if (isLocalStorage && localStorage != null)
//	{
//		try
//		{
//			var draft = localStorage.getItem('.draft');
//			
//			if (draft != null)
//			{
//				return JSON.parse(draft);
//			}
//		}
//		catch (e)
//		{
//			// ignore quota etc
//		}
//	}

	return null;
};

/**
 * Sets the onbeforeunload for the application
 */
App.prototype.addRecent = function(entry)
{
	if (isLocalStorage && localStorage != null)
	{
		var recent = this.getRecent();
		
		if (recent == null)
		{
			recent = [];
		}
		else
		{
			for (var i = 0; i < recent.length; i++)
			{
				if (recent[i].id == entry.id)
				{
					recent.splice(i, 1);
				}
			}
		}
		
		if (recent != null)
		{
			recent.unshift(entry);
			recent = recent.slice(0, 5);
			localStorage.setItem('.recent', JSON.stringify(recent));
		}
	}
};

/**
 * Sets the onbeforeunload for the application
 */
App.prototype.getRecent = function()
{
	if (isLocalStorage && localStorage != null)
	{
		try
		{
			var recent = localStorage.getItem('.recent');
			
			if (recent != null)
			{
				return JSON.parse(recent);
			}
		}
		catch (e)
		{
			// ignore
		}
		
		return null;
	}
};

/**
 * Sets the onbeforeunload for the application
 */
App.prototype.resetRecent = function(entry)
{
	if (isLocalStorage && localStorage != null)
	{
		try
		{
			localStorage.removeItem('.recent');
		}
		catch (e)
		{
			// ignore
		}
	}
};

/**
 * Sets the onbeforeunload for the application
 */
App.prototype.removeDraft = function()
{
	if (isLocalStorage && localStorage != null && urlParams['splash'] == '0')
	{
		try
		{
			localStorage.removeItem('.draft');
		}
		catch (e)
		{
			// ignore quota etc
		}
	}
};

/**
 * Sets the onbeforeunload for the application
 */
App.prototype.onBeforeUnload = function()
{
	var file = this.getCurrentFile();
	
	if (file != null)
	{
		if (file.constructor == LocalFile && !file.isModified() && urlParams['nowarn'] != '1' &&
			!this.isDiagramEmpty() && urlParams['url'] == null && !this.editor.chromeless)
		{
			return mxResources.get('ensureDataSaved');
		}
		else if (file.constructor != DriveFile && file.isModified())
		{
			return mxResources.get('allChangesLost');
		}
		else
		{
			file.close(true);
		}
	}
};

/**
 * Translates this point by the given vector.
 * 
 * @param {number} dx X-coordinate of the translation.
 * @param {number} dy Y-coordinate of the translation.
 */
App.prototype.updateDocumentTitle = function()
{
	if (!this.editor.graph.lightbox)
	{
		var title = this.editor.appName;
		var file = this.getCurrentFile();
		
		if (file != null)
		{
			var filename = (file.getTitle() != null) ? file.getTitle() : this.defaultFilename;
			title = filename + ' - ' + title;
		}
		
		if (this.isOfflineApp())
		{
			title += ' [' + mxResources.get('offline') + ']';
		}
		
		document.title = title;
	}
};

/**
 * Authorizes the client, gets the userId and calls <open>.
 */
App.prototype.createCrcTable = function()
{
    var crcTable = [];
    var c;

	for (var n = 0; n < 256; n++)
	{
        c = n;
        
        for (var k = 0; k < 8; k++)
        {
            c = ((c&1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1));
        }
	        
        crcTable[n] = c;
    }
	
    return crcTable;
};

/**
 * Authorizes the client, gets the userId and calls <open>.
 */
App.prototype.crc32 = function(str)
{
	this.crcTable = this.crcTable || this.createCrcTable();
    var crc = 0 ^ (-1);

    for (var i = 0; i < str.length; i++ )
    {
        crc = (crc >>> 8) ^ this.crcTable[(crc ^ str.charCodeAt(i)) & 0xFF];
    }

    return (crc ^ (-1)) >>> 0;
};

/**
 * Returns a thumbnail of the current file.
 */
App.prototype.getThumbnail = function(width, success)
{
	var result = false;
	
	try
	{
		if (this.thumbImageCache == null)
		{
			this.thumbImageCache = new Object();
		}

		// Uses new client-side canvas export for Chrome, Firefox and Opera
		if (this.isExportToCanvas())
		{
		   	this.exportToCanvas(mxUtils.bind(this, function(canvas)
		   	{
		   		success(canvas);
		   	}), width, this.thumbImageCache, '#ffffff', function()
		   	{
		   		// Continues with null in error case
		   		success();
		   	});
		   	
		   	result = true;
		}
		else if (this.canvasSupported && this.getCurrentFile() != null)
		{
			var graph = this.editor.graph;
			var canvas = document.createElement('canvas');
			var bounds = graph.getGraphBounds();
			var scale = width / bounds.width;
			
			// Limits scale to 1 or 2 * width / height
			scale = Math.min(1, Math.min((width * 3) / (bounds.height * 4), scale));
			
			var x0 = Math.floor(bounds.x);
			var y0 = Math.floor(bounds.y);
			
			canvas.setAttribute('width', Math.ceil(scale * (bounds.width + 4)));
			canvas.setAttribute('height', Math.ceil(scale * (bounds.height + 4)));
			
			var ctx = canvas.getContext('2d');
			
			// Configures the canvas
			ctx.scale(scale, scale);
			ctx.translate(-x0, -y0);
			
			// Paint white background instead of transparent
			var bg = graph.background;
			
			if (bg == null || bg == '' || bg == mxConstants.NONE)
			{
				bg = '#ffffff';
			}
	
			// Paints background
			ctx.save();
			ctx.fillStyle = bg;
			ctx.fillRect(x0, y0, Math.ceil(bounds.width + 4), Math.ceil(bounds.height + 4));
			ctx.restore();
			
			var htmlCanvas = new mxJsCanvas(canvas);
			
			// NOTE: htmlCanvas passed into async canvas is only used for image
			// and canvas caching (canvas caching not used in this case as we do
			// not render text). To reuse that cache via the thumbImageCache we
			// pass that into the async canvas and override the image cache in
			// the newly created html canvas with that of the thumbImageCache.
			// LATER: Is clear thumbImageCache needed if file changes?
			var asynCanvas = new mxAsyncCanvas(this.thumbImageCache);
			htmlCanvas.images = this.thumbImageCache.images;
			
			// Render graph
			var imgExport = new mxImageExport();
			
			imgExport.drawShape = function(state, canvas)
			{
				if (state.shape instanceof mxShape && state.shape.checkBounds())
				{
					canvas.save();
					canvas.translate(0.5, 0.5);
					state.shape.paint(canvas);
					canvas.translate(-0.5, -0.5);
					canvas.restore();
				}
			};
			
			imgExport.drawText = function(state, canvas)
			{
				// No text output for thumbnails
			};
	
			imgExport.drawState(graph.getView().getState(graph.model.root), asynCanvas);
	
			asynCanvas.finish(function()
			{
				imgExport.drawState(graph.getView().getState(graph.model.root), htmlCanvas);
				success(canvas);
			});
			
			result = true;
		}
	}
	catch (e)
	{
		// ignore and use placeholder
	}
	
	return result;
};

/**
 * Tries to find a public URL for the given file.
 */
App.prototype.getPublicUrl = function(file, fn)
{
	fn(null);
};

/**
 * Translates this point by the given vector.
 * 
 * @param {number} dx X-coordinate of the translation.
 * @param {number} dy Y-coordinate of the translation.
 */
App.prototype.createFileData = function(node, graph, file, url, forceXml, forceSvg, forceHtml, embeddedCallback, ignoreSelection)
{
	forceXml = (forceXml != null) ? forceXml : false;
	ignoreSelection = (ignoreSelection != null) ? ignoreSelection : true;
	
	var editLink = null;
	var redirect = null;
	
	if (file == null || file.getMode() == App.MODE_DEVICE || file.getMode() == App.MODE_BROWSER)
	{
		editLink = '_blank';
	}
	else
	{
		editLink = url;
		redirect = editLink;
	}
		
	if (!forceSvg && !forceXml && (forceHtml || (file != null && /(\.html)$/i.test(file.getTitle()))))
	{
		return this.getHtml2(node, graph, file.getTitle(), editLink, redirect, ignoreSelection);
	}
	else if (node == null)
	{
		return '';
	}
	else
	{
		var fileNode = node;

		// Ignores case for for possible HTML or XML nodes
		if (fileNode.nodeName.toLowerCase() != 'mxfile')
		{
			// Removes control chars in input for correct roundtrip check
			var text = this.editor.graph.zapGremlins(mxUtils.getXml(node));
			var data = this.editor.graph.compress(text);
			
			// Fallback to plain XML for invalid compression
			// TODO: Remove this fallback with active pages
			if (this.editor.graph.decompress(data) != text)
			{
				return text;
			}
			else
			{
				var diagramNode = node.ownerDocument.createElement('diagram');
				mxUtils.setTextContent(diagramNode, data);
				
				fileNode = node.ownerDocument.createElement('mxfile');
				fileNode.appendChild(diagramNode);
			}
		}

		fileNode.setAttribute('userAgent', navigator.userAgent);
		fileNode.setAttribute('version', EditorUi.VERSION);
		fileNode.setAttribute('editor', 'www.draw.io');

		var md = (file != null) ? file.getMode() : this.mode;
		
		if (md != null)
		{
			fileNode.setAttribute('type', md);
		}
				
		var xml = mxUtils.getXml(fileNode);

		// Maps the XML data to the content attribute in the SVG node 
		if (forceSvg || (!forceXml && file != null && /(\.svg)$/i.test(file.getTitle())))
		{
			if (file != null && (file.getMode() == App.MODE_DEVICE || file.getMode() == App.MODE_BROWSER))
			{
				url = null;
			}
			
			xml = this.getEmbeddedSvg(xml, graph, url, null, embeddedCallback, ignoreSelection, redirect);
		}
		
		return xml;
	}
};

/**
 * Translates this point by the given vector.
 * 
 * @param {number} dx X-coordinate of the translation.
 * @param {number} dy Y-coordinate of the translation.
 */
App.prototype.getFileData = function(forceXml, forceSvg, forceHtml, embeddedCallback, ignoreSelection)
{
	ignoreSelection = (ignoreSelection != null) ? ignoreSelection : true;
	var node = this.editor.getGraphXml(ignoreSelection);
		
	if (ignoreSelection && this.fileNode != null && this.currentPage != null)
	{
		var data = this.editor.graph.compress(this.editor.graph.zapGremlins(mxUtils.getXml(node)));
		mxUtils.setTextContent(this.currentPage.node, data);
		node = this.fileNode.cloneNode(false);
		
		// Restores order of pages
		for (var i = 0; i < this.pages.length; i++)
		{
			var mapping = this.pages[i].mapping;
			
			// Updates XML of all pages for realtime
			if (this.currentPage != this.pages[i] && mapping != null && mapping.needsUpdate)
			{
				var enc = new mxCodec(mxUtils.createXmlDocument());
				var temp = enc.encode(mapping.graphModel);
			
				// Uses the graph state from the realtime model
				mapping.writeRealtimeToNode(temp);					

				var data = this.editor.graph.compress(this.editor.graph.zapGremlins(mxUtils.getXml(temp)));
				mxUtils.setTextContent(this.pages[i].node, data);
				
				// Marks the page as up-to-date
				mapping.needsUpdate = false;
			}
			
			node.appendChild(this.pages[i].node);
		}
	}
	
	return this.createFileData(node, this.editor.graph, this.getCurrentFile(), window.location.href,
		forceXml, forceSvg, forceHtml, embeddedCallback, ignoreSelection);
};

/**
 * Translates this point by the given vector.
 * 
 * @param {number} dx X-coordinate of the translation.
 * @param {number} dy Y-coordinate of the translation.
 */
App.prototype.createBackground = function()
{
	var bg = this.createDiv('background');
	bg.style.position = 'absolute';
	bg.style.background = 'white';
	bg.style.left = '0px';
	bg.style.top = '0px';
	bg.style.bottom = '0px';
	bg.style.right = '0px';
	
	mxUtils.setOpacity(bg, 100);
	
	if (mxClient.IS_QUIRKS)
	{
		new mxDivResizer(bg);
	}

	return bg;
};

/**
 * Translates this point by the given vector.
 * 
 * @param {number} dx X-coordinate of the translation.
 * @param {number} dy Y-coordinate of the translation.
 */
App.prototype.setMode = function(mode, remember)
{
	this.mode = mode;
	
	// Note: UseLocalStorage affects the file dialogs
	// and should not be modified if mode is undefined
	if (this.mode != null)
	{
		Editor.useLocalStorage = this.mode == App.MODE_BROWSER;
	}
	
	if (typeof(Storage) != 'undefined' && remember)
	{
		var expiry = new Date();
		expiry.setYear(expiry.getFullYear() + 1);
		document.cookie = 'MODE=' + mode + '; expires=' + expiry.toUTCString();
	}
	
	if (this.appIcon != null)
	{
		var file = this.getCurrentFile();
		var mode = (file != null) ? file.getMode() : null;
		
		if (mode == App.MODE_GOOGLE)
		{
			this.appIcon.setAttribute('title', mxResources.get('openIt', [mxResources.get('googleDrive')]));
			this.appIcon.style.cursor = 'pointer';
		}
		else if (mode == App.MODE_DROPBOX)
		{
			this.appIcon.setAttribute('title', mxResources.get('openIt', [mxResources.get('dropbox')]));
			this.appIcon.style.cursor = 'pointer';
		}
		else if (mode == App.MODE_ONEDRIVE)
		{
			this.appIcon.setAttribute('title', mxResources.get('openIt', [mxResources.get('oneDrive')]));
			this.appIcon.style.cursor = 'pointer';
		}
		else
		{
			this.appIcon.removeAttribute('title');
			this.appIcon.style.cursor = 'default';
		}
	}
};

/**
 * Function: authorize
 * 
 * Authorizes the client, gets the userId and calls <open>.
 */
App.prototype.appIconClicked = function(evt)
{
	if (mxEvent.isAltDown(evt))
	{
		this.showSplash(true);
	}
	else
	{
		var file = this.getCurrentFile();
		var mode = (file != null) ? file.getMode() : null;
		
		if (mode == App.MODE_GOOGLE)
		{
			if (file.desc.parents.length > 0)
			{
				window.open('https://drive.google.com/drive/folders/' + file.desc.parents[0].id);
			}
			else
			{
				window.open('https://drive.google.com/?authuser=0');
			}
		}
		else if (mode == App.MODE_DROPBOX)
		{
			window.open('https://www.dropbox.com/');
		}
		else if (mode == App.MODE_ONEDRIVE)
		{
			window.open('https://onedrive.live.com/');
		}
	}
	
	mxEvent.consume(evt);
};

/**
 * Function: authorize
 * 
 * Authorizes the client, gets the userId and calls <open>.
 */
App.prototype.clearMode = function()
{
	if (typeof(Storage) != 'undefined')
	{
		var expiry = new Date();
		expiry.setYear(expiry.getFullYear() - 1);
		document.cookie = 'MODE=; expires=' + expiry.toUTCString();
	}
};

/**
 * Translates this point by the given vector.
 * 
 * @param {number} dx X-coordinate of the translation.
 * @param {number} dy Y-coordinate of the translation.
 */
App.prototype.getDiagramId = function()
{
	var id = window.location.hash;
	
	// Strips the hash sign
	if (id != null && id.length > 0)
	{
		id = id.substring(1);
	}
	
	return id;
};

/**
 * Main function. Program starts here.
 * 
 * @param {number} dx X-coordinate of the translation.
 * @param {number} dy Y-coordinate of the translation.
 */
App.prototype.open = function()
{
	// Cross-domain window access is not allowed in FF, so if we
	// were opened from another domain then this will fail.
	try
	{
		// If the create URL param is used in embed mode then
		// we try to open the XML from window.opener[value].
		// Use this for embedding via tab to bypass the timing
		// issues when passing messages without onload event.
		if (window.opener != null)
		{
			var value = urlParams['create'];
			
			if (value != null)
			{
				value = decodeURIComponent(value);
			}
			
			if (value != null && value.length > 0 && value.substring(0, 7) != 'http://' &&
				value.substring(0, 8) != 'https://')
			{
				var doc = mxUtils.parseXml(window.opener[value]);
				this.editor.setGraphXml(doc.documentElement);
			}
			else if (window.opener.openFile != null)
			{
				window.opener.openFile.setConsumer(mxUtils.bind(this, function(xml, filename)
				{
					this.spinner.stop();
					
					if (filename == null)
					{
						var title = urlParams['title'];
						
						if (title != null)
						{
							title = decodeURIComponent(title);
						}
						else
						{
							title = this.defaultFilename;
						}
						
						this.fileLoaded(new LocalFile(this, xml, title));
						this.setMode(null);
					}
					else
					{
						// Replaces PNG with XML extension
						var dot = filename.substring(filename.length - 4) == '.png';
						
						if (dot > 0)
						{
							filename = filename.substring(0, filename.length - 4) + '.xml';
						}
						
						this.fileLoaded((mxClient.IS_IOS) ?
							new StorageFile(this, xml, filename) :
							new LocalFile(this, xml, filename));
					}
				}));
			}
		}
	}
	catch(e)
	{
		// ignore
	}
};

/**
 * Main function. Program starts here.
 * 
 * @param {number} dx X-coordinate of the translation.
 * @param {number} dy Y-coordinate of the translation.
 */
App.prototype.load = function()
{
	// Checks if we're running in embedded mode
	if (urlParams['embed'] != '1')
	{
		if (this.spinner.spin(document.body, mxResources.get('starting')))
		{
			try
			{
				this.stateArg = (urlParams['state'] != null && this.drive != null) ? JSON.parse(decodeURIComponent(urlParams['state'])) : null;
			}
			catch (e)
			{
				// ignores invalid state args
			}
			
			this.editor.graph.setEnabled(this.getCurrentFile() != null);
			
			// Passes the userId from the state parameter to the client
			if ((window.location.hash == null || window.location.hash.length == 0) &&
				this.drive != null && this.stateArg != null && this.stateArg.userId != null)
			{
				this.drive.setUserId(this.stateArg.userId);
			}

			// Legacy support for fileId parameter which is moved to the hash tag
			if (urlParams['fileId'] != null)
			{
				window.location.hash = 'G' + urlParams['fileId'];
				window.location.search = this.getSearch(['fileId']);
			}
			else
			{
				// Asynchronous or disabled loading of client
				if (this.drive == null)
				{
					if (this.mode == App.MODE_GOOGLE)
					{
						this.mode = null;
					}
					
					this.start();
				}
				else
				{
					gapi.load('auth:client,drive-realtime,drive-share', mxUtils.bind(this, function(resp)
					{
						// Starts the app without the Google Option if the API fails to load
						if (gapi.drive == null || gapi.drive.realtime == null)
						{
							this.mode = null;
							this.drive = null;
							this.start();
						}
						else
						{
							gapi.client.load('drive', 'v2', mxUtils.bind(this, function()
							{
								// Needed to avoid popup blocking for non-immediate authentication
								gapi.auth.init(mxUtils.bind(this, function()
								{
									if (gapi.client.drive == null)
									{
										this.mode = null;
										this.drive = null;
									}
									
									this.start();
								}));
							}));
						}
					}));
				}
			}
		}
	}
	else
	{
		this.restoreLibraries();
	}
};

/**
 * Called in start after the spinner stops.
 */
App.prototype.showAlert = function(message)
{
	if (message != null && message.length > 0)
	{
		var div = document.createElement('div');
		div.className = 'geAlert';
		div.style.zIndex = 2e9; 
		div.style.left = '50%';
		div.style.top = '-100%';
		mxUtils.setPrefixedStyle(div.style, 'transform', 'translate(-50%,0%)');
		mxUtils.setPrefixedStyle(div.style, 'transition', 'all 1s ease');
		
		div.innerHTML = message;
		
		var close = document.createElement('a');
		close.className = 'geAlertLink';
		close.style.textAlign = 'right';
		close.style.marginTop = '20px';
		close.style.display = 'block';
		close.setAttribute('href', 'javascript:void(0);');
		close.setAttribute('title', mxResources.get('close'));
		close.innerHTML = mxResources.get('close');
		div.appendChild(close);
		
		mxEvent.addListener(close, 'click', function(evt)
		{
			if (div.parentNode != null)
			{
				div.parentNode.removeChild(div);
				mxEvent.consume(evt);
			}
		});
		
		document.body.appendChild(div);
		
		// Delayed to get smoother animation after DOM rendering
		window.setTimeout(function()
		{
			div.style.top = '30px';
		}, 10);
		
		// Fades out the alert after 15 secs
		window.setTimeout(function()
		{
			mxUtils.setPrefixedStyle(div.style, 'transition', 'all 2s ease');
			div.style.opacity = '0';
			
			window.setTimeout(function()
			{
				if (div.parentNode != null)
				{
					div.parentNode.removeChild(div);
				}
			}, 2000);
		}, 15000);
	}
};

/**
 * Translates this point by the given vector.
 * 
 * @param {number} dx X-coordinate of the translation.
 * @param {number} dy Y-coordinate of the translation.
 */
App.prototype.start = function()
{
	this.bg.parentNode.removeChild(this.bg);
	this.restoreLibraries();
	this.spinner.stop();

	// Uses proxy to avoid CORS issues
	var loadTemplate = mxUtils.bind(this, function(url, onload, onerror)
	{
		this.loadUrl(PROXY_URL + '?url=' + encodeURIComponent(url), mxUtils.bind(this, function(data)
		{
			if (!this.isOffline() && new XMLHttpRequest().upload && this.isRemoteFileFormat(data, url))
			{
				// Asynchronous parsing via server
				this.parseFile(new Blob([data], {type: 'application/octet-stream'}), mxUtils.bind(this, function(xhr)
				{
					if (xhr.readyState == 4 && xhr.status == 200 && xhr.responseText.substring(0, 13) == '<mxGraphModel')
					{
						onload(xhr.responseText);
					}
				}), url);
			}
			else
			{
				if (/(\.png)($|\?)/i.test(url))
				{
					data = this.extractGraphModelFromPng(data);
				}
				
				onload(data);
			}
		}), onerror, /(\.png)($|\?)/i.test(url));
	});
	
	if (urlParams['url'] != null && this.spinner.spin(document.body, mxResources.get('loading')))
	{
		try
		{
			var reconnect = mxUtils.bind(this, function()
			{
				// Removes URL parameter and reloads the page
				if (this.spinner.spin(document.body, mxResources.get('reconnecting')))
				{
					window.location.search = this.getSearch(['url']);
				};
			});
			
			loadTemplate(decodeURIComponent(urlParams['url']), mxUtils.bind(this, function(text)
			{
				this.spinner.stop();
				
				if (text != null && text.length > 0)
				{
					var filename = urlParams['title'];
					
					if (filename == null && urlParams['notitle'] != '1')
					{
						var tmp = decodeURIComponent(urlParams['url']);
						var slash = tmp.lastIndexOf('/');
						
						if (slash >= 0)
						{
							tmp = tmp.substring(slash + 1);
						}
						
						filename = tmp;
						
						// Replaces PNG with XML extension
						var dot = filename.substring(filename.length - 4) == '.png';
						
						if (dot > 0)
						{
							filename = filename.substring(0, filename.length - 4) + '.xml';
						}
					}
					
					var file = new LocalFile(this, text, filename || this.defaultFilename);
					this.fileLoaded(file);
					this.setMode(null);
				}
			}), mxUtils.bind(this, function()
			{
				this.spinner.stop();
				this.handleError({message: mxResources.get('fileNotFound')}, mxResources.get('errorLoadingFile'), reconnect);
			}));
		}
		catch (e)
		{
			this.spinner.stop();
			
			try
			{
				var img = new Image();
	    		img.src = 'images/2x2.png?msg=errorLoadingFile&url=' + encodeURIComponent(window.location.href) +
	    			'&v=' + encodeURIComponent(EditorUi.VERSION) +
	    			((e != null && e.message != null) ? '&err=' + encodeURIComponent(e.message) : '') +
	    			((e != null && e.stack != null) ? '&stack=' + encodeURIComponent(e.stack) : '');
			}
			catch (err)
			{
				// do nothing
			}
			
			this.handleError(e, mxResources.get('errorLoadingFile'), reconnect);
		}
	}
	else if (this.getCurrentFile() == null)
	{
		var done = mxUtils.bind(this, function()
		{
			// Starts in client mode and waits for data
			if (urlParams['client'] == '1' && (window.location.hash == null ||
				window.location.hash.length == 0))
			{
				var parent = window.opener || window.parent;
				
				if (parent != window)
				{
					this.installMessageHandler(mxUtils.bind(this, function(xml, evt)
					{
						// Ignores messages from other windows
						if (evt.source == parent)
						{
							// Extracts graph model from PNG
							if (xml.substring(0, 22) == 'data:image/png;base64,')
							{
								xml = this.extractGraphModelFromPng(xml);
							}
							
							var title = urlParams['title'];
							
							if (title != null)
							{
								title = decodeURIComponent(title);
							}
							else
							{
								title = this.defaultFilename;
							}
							
							this.fileLoaded(new LocalFile(this, xml, title));
							this.getCurrentFile().setModified(!this.editor.chromeless);
							this.setMode(null);
						}
					}));
				}
			}
			// Checks if no earlier loading errors are showing
			else if (this.dialog == null)
			{
				if (urlParams['demo'] == '1')
				{
					var prev = Editor.useLocalStorage;
					this.createFile(this.defaultFilename, null, null, App.MODE_DEVICE);
					this.setMode(null);
					Editor.useLocalStorage = prev;
				}
				else
				{
					var waiting = false;
					
					// Checks if we're waiting for some asynchronous file to be loaded
					// Cross-domain window access is not allowed in FF, so if we
					// were opened from another domain then this will fail.
					try
					{
						waiting = window.opener != null && window.opener.openFile != null;
					}
					catch(e)
					{
						// ignore
					}
					
					if (waiting)
					{
						// Spinner is stopped in App.open
						this.spinner.spin(document.body, mxResources.get('loading'))
					}
					else
					{
						var id = this.getDiagramId();
						
						if (urlParams['splash'] == '0' && (id == null || id.length == 0))
						{
							var draft = this.getDraft();
							var fileData = (draft != null) ? draft.data : this.getFileData();
							var prev = Editor.useLocalStorage;
							this.createFile(this.defaultFilename, fileData, null, App.MODE_DEVICE);
							this.setMode(null);
							Editor.useLocalStorage = prev;
							
							// Draft was used so the user should save the file
							if (draft != null)
							{
								var file = this.getCurrentFile();
								
								if (file != null)
								{
									file.addUnsavedStatus();
								}
							}
						}
						else
						{
							this.loadFile(this.getDiagramId());
						}
					}
				}
			}
		});

		// Defines custom classes for realtime in Google Drive
		if (this.drive != null)
		{
			this.defineCustomObjects();
		}
		
		var value = decodeURIComponent(urlParams['create'] || '');
		
		if (value != null && value.length > 0 && this.spinner.spin(document.body, mxResources.get('loading')))
		{
			var reconnect = mxUtils.bind(this, function()
			{
				// Removes URL parameter and reloads the page
				if (this.spinner.spin(document.body, mxResources.get('reconnecting')))
				{
					window.location.search = this.getSearch(['create', 'title']);
				};
			});

			var showCreateDialog = mxUtils.bind(this, function(xml)
			{
				this.spinner.stop();

				// Resets mode for dialog - local file is only for preview
				if (urlParams['splash'] != '0')
				{
					this.fileLoaded(new LocalFile(this, xml, null));
					
					this.editor.graph.setEnabled(false);
					this.mode = urlParams['mode'];
					var title = urlParams['title'];
	
					if (title != null)
					{
						title = decodeURIComponent(title);
					}
					else
					{
						title = this.defaultFilename;
					}
					
					var dlg = new CreateDialog(this, title, mxUtils.bind(this, function(filename, mode)
					{
						if (mode == null)
						{
							this.hideDialog();
							var prev = Editor.useLocalStorage;
							this.createFile((filename.length > 0) ? filename : this.defaultFilename,
								this.getFileData(), null, App.MODE_DEVICE);
							this.setMode(null);
							Editor.useLocalStorage = prev;
						}
						else
						{
							this.createFile(filename, this.getFileData(true), null, mode);
						}
					}));
					this.showDialog(dlg.container, 380, 270, true, false, mxUtils.bind(this, function(cancel)
					{
						if (cancel && this.getCurrentFile() == null)
						{
							this.showSplash();
						}
					}));
					dlg.init();
				}
			});
			
			value = decodeURIComponent(value);
			
			if (value.substring(0, 7) != 'http://' && value.substring(0, 8) != 'https://')
			{
				// Cross-domain window access is not allowed in FF, so if we
				// were opened from another domain then this will fail.
				try
				{
					if (window.opener != null && window.opener[value] != null)
					{
						showCreateDialog(window.opener[value]);
					}
					else
					{
						this.handleError(null, mxResources.get('errorLoadingFile'));
					}
				}
				catch (e)
				{
					this.handleError(e, mxResources.get('errorLoadingFile'));
				}
			}
			else
			{
				loadTemplate(value, function(text)
				{
					showCreateDialog(text);
				}, mxUtils.bind(this, function()
				{
					this.handleError(null, mxResources.get('errorLoadingFile'), reconnect);
				}));
			}
		}
		else
		{
			// Passes the fileId from the state parameter to the hash tag and reloads
			// the page without the state parameter
			if ((window.location.hash == null || window.location.hash.length <= 1) &&
				urlParams['state'] != null && this.stateArg != null && this.stateArg.action == 'open')
			{
				if (this.stateArg.ids != null)
				{
					window.location.hash = 'G' + this.stateArg.ids[0];
				}
			}
	
			if ((window.location.hash == null || window.location.hash.length <= 1) &&
				this.drive != null && this.stateArg != null && this.stateArg.action == 'create')
			{
				this.setMode(App.MODE_GOOGLE);
				this.actions.get('new').funct();
			}
			else
			{
				// Listens to changes of the hash
				// Known: Does not work in quirks mode
				mxEvent.addListener(window, 'hashchange', mxUtils.bind(this, function(evt)
				{
					var id = this.getDiagramId();
					var file = this.getCurrentFile();
					
					if (file == null || file.getHash() != id)
					{
						this.loadFile(id, true);
					}
				}));
				
				done();
			}
		}
	}
};

/**
 * Translates this point by the given vector.
 * 
 * @param {number} dx X-coordinate of the translation.
 * @param {number} dy Y-coordinate of the translation.
 */
App.prototype.showSplash = function(force)
{
	if (this.editor.chromeless)
	{
		this.handleError({message: mxResources.get('noFileSelected')},
			mxResources.get('errorLoadingFile'), mxUtils.bind(this, function()
		{
			this.showSplash();
		}));
	}
	else if (this.mode == null || force)
	{
		var dlg = new StorageDialog(this, mxUtils.bind(this, function()
		{
			this.hideDialog();
			var dlg2 = new SplashDialog(this);
			this.showDialog(dlg2.container, 340, 260, true, true);
			dlg2.init();
		}));
		
		this.showDialog(dlg.container, (isLocalStorage && urlParams['browser'] == '1') ? 480 : 380, 300, true, false);
		dlg.init();
	}
	else if (urlParams['create'] == null)
	{
		var dlg = new SplashDialog(this);
		this.showDialog(dlg.container, 340, (mxClient.IS_CHROMEAPP) ? 180 : 260, true, true);
		dlg.init();
	}
};

/**
 * Translates this point by the given vector.
 * 
 * @param {number} dx X-coordinate of the translation.
 * @param {number} dy Y-coordinate of the translation.
 */
App.prototype.addLanguageMenu = function(elt)
{
	var img = null;
	
	if (!this.isOfflineApp() || mxClient.IS_CHROMEAPP)
	{
		var langMenu = this.menus.get('language');
		
		if (langMenu != null)
		{
			img = document.createElement('div');
			img.setAttribute('title', mxResources.get('language'));
			img.className = 'geIcon geSprite geSprite-globe';
			img.style.position = 'absolute';
			img.style.cursor = 'pointer';
			img.style.bottom = '20px';
			img.style.right = '20px';
			
			mxEvent.addListener(img, 'click', mxUtils.bind(this, function(evt)
			{
				this.editor.graph.popupMenuHandler.hideMenu();
				var menu = new mxPopupMenu(this.menus.get('language').funct);
				menu.div.className += ' geMenubarMenu';
				menu.smartSeparators = true;
				menu.showDisabled = true;
				menu.autoExpand = true;
				
				// Disables autoexpand and destroys menu when hidden
				menu.hideMenu = mxUtils.bind(this, function()
				{
					mxPopupMenu.prototype.hideMenu.apply(menu, arguments);
					menu.destroy();
				});
		
				var offset = mxUtils.getOffset(img);
				menu.popup(offset.x, offset.y + img.offsetHeight, null, evt);
				
				// Allows hiding by clicking on document
				this.setCurrentMenu(menu);
			}));
		
			elt.appendChild(img);
		}
	}
	
	return img;
};

/**
 * Translates this point by the given vector.
 * 
 * @param {number} dx X-coordinate of the translation.
 * @param {number} dy Y-coordinate of the translation.
 */
App.prototype.defineCustomObjects = function()
{
	if (gapi.drive.realtime != null && gapi.drive.realtime.custom != null)
	{
		gapi.drive.realtime.custom.registerType(mxRtCell, 'Cell');
		
		mxRtCell.prototype.cellId = gapi.drive.realtime.custom.collaborativeField('cellId');
		mxRtCell.prototype.type = gapi.drive.realtime.custom.collaborativeField('type');
		mxRtCell.prototype.value = gapi.drive.realtime.custom.collaborativeField('value');
		mxRtCell.prototype.xmlValue = gapi.drive.realtime.custom.collaborativeField('xmlValue');
		mxRtCell.prototype.style = gapi.drive.realtime.custom.collaborativeField('style');
		mxRtCell.prototype.geometry = gapi.drive.realtime.custom.collaborativeField('geometry');
		mxRtCell.prototype.visible = gapi.drive.realtime.custom.collaborativeField('visible');
		mxRtCell.prototype.collapsed = gapi.drive.realtime.custom.collaborativeField('collapsed');
		mxRtCell.prototype.connectable = gapi.drive.realtime.custom.collaborativeField('connectable');
		mxRtCell.prototype.parent = gapi.drive.realtime.custom.collaborativeField('parent');
		mxRtCell.prototype.children = gapi.drive.realtime.custom.collaborativeField('children');
		mxRtCell.prototype.source = gapi.drive.realtime.custom.collaborativeField('source');
		mxRtCell.prototype.target = gapi.drive.realtime.custom.collaborativeField('target');
	}
};

mxRtCell = function() {};

// Ignores rtCell property in codec and cloning
mxCodecRegistry.getCodec(mxCell).exclude.push('rtCell');
mxCell.prototype.mxTransient.push('rtCell');

/**
 * Translates this point by the given vector.
 * 
 * @param {number} dx X-coordinate of the translation.
 * @param {number} dy Y-coordinate of the translation.
 */
App.prototype.pickFile = function(mode)
{
	mode = (mode != null) ? mode : this.mode;
	
	if (mode == App.MODE_DROPBOX)
	{
		if (this.dropbox != null)
		{
			this.dropbox.pickFile();
		}
	}
	else if (mode == App.MODE_ONEDRIVE)
	{
		if (this.oneDrive != null)
		{
			this.oneDrive.pickFile();
		}
	}
	else if (mode == App.MODE_GOOGLE)
	{
		if (this.drive != null && typeof(google) != 'undefined' && typeof(google.picker) != 'undefined')
		{
			this.drive.pickFile();
		}
		else
		{
			window.open('https://drive.google.com');
		}
	}
	else if (mode == App.MODE_DEVICE && Graph.fileSupport && !mxClient.IS_IE && !mxClient.IS_IE11)
	{
		var input = document.createElement('input');
		input.setAttribute('type', 'file');
		
		mxEvent.addListener(input, 'change', mxUtils.bind(this, function()
		{
			if (input.files != null)
			{
				this.openFiles(input.files);
			}
		}));

		input.click();
	}
	else
	{
		this.hideDialog();
		window.openNew = this.getCurrentFile() != null && !this.isDiagramEmpty();
		window.baseUrl = this.getUrl();
		window.openKey = 'open';
		var prevValue = Editor.useLocalStorage;
		Editor.useLocalStorage = (mode == App.MODE_BROWSER);
		this.openFile();
		
		// Installs local handler for opened files in same window
		window.openFile.setConsumer(mxUtils.bind(this, function(xml, filename)
		{
			// Replaces PNG with XML extension
			var dot = filename.substring(filename.length - 4) == '.png';
			
			if (dot > 0)
			{
				filename = filename.substring(0, filename.length - 4) + '.xml';
			}
			
			this.fileLoaded((mode == App.MODE_BROWSER) ?
					new StorageFile(this, xml, filename) :
					new LocalFile(this, xml, filename));
		}));
		
		// Extends dialog close to show splash screen
		var dlg = this.dialog;
		var dlgClose = dlg.close;
		
		this.dialog.close = mxUtils.bind(this, function(cancel)
		{
			Editor.useLocalStorage = prevValue;
			dlgClose.apply(dlg, arguments);

			if (this.getCurrentFile() == null)
			{
				this.showSplash();
			}
		});
	}
};

/**
 * Translates this point by the given vector.
 * 
 * @param {number} dx X-coordinate of the translation.
 * @param {number} dy Y-coordinate of the translation.
 */
App.prototype.pickLibrary = function(mode)
{
	mode = (mode != null) ? mode : this.mode;
	
	if (mode == App.MODE_GOOGLE || mode == App.MODE_DROPBOX || mode == App.MODE_ONEDRIVE)
	{
		var peer = (mode == App.MODE_GOOGLE) ? this.drive : ((mode == App.MODE_ONEDRIVE) ? this.oneDrive : this.dropbox);
		
		if (peer != null)
		{
			peer.pickLibrary(mxUtils.bind(this, function(id, optionalFile)
			{
				if (optionalFile != null)
				{
					this.loadLibrary(optionalFile);
				}
				else
				{
					if (this.spinner.spin(document.body, mxResources.get('loading')))
					{
						peer.getLibrary(id, mxUtils.bind(this, function(file)
						{
							this.spinner.stop();
							
							try
							{
								this.loadLibrary(file);
							}
							catch (e)
							{
								this.handleError(e, mxResources.get('errorLoadingFile'));
							}
						}), mxUtils.bind(this, function(resp)
						{
							this.handleError(resp, (resp != null) ? mxResources.get('errorLoadingFile') : null);
						}));
					}
				}
			}));
		}
	}
	else if (mode == App.MODE_DEVICE && Graph.fileSupport && !mxClient.IS_IE && !mxClient.IS_IE11)
	{
		var input = document.createElement('input');
		input.setAttribute('type', 'file');
		
		mxEvent.addListener(input, 'change', mxUtils.bind(this, function()
		{
			if (input.files != null)
			{
				for (var i = 0; i < input.files.length; i++)
				{
					(mxUtils.bind(this, function(file)
					{
						var reader = new FileReader();
					
						reader.onload = mxUtils.bind(this, function(e)
						{
							try
							{
								this.loadLibrary(new LocalLibrary(this, e.target.result, file.name));
							}
							catch (e)
							{
								this.handleError(e, mxResources.get('errorLoadingFile'));
							}
						});

						reader.readAsText(file);
					}))(input.files[i]);
				}
			}
		}));

		input.click();
	}
	else
	{
		window.openNew = false;
		window.openKey = 'open';
		
		var prevValue = Editor.useLocalStorage;
		Editor.useLocalStorage = mode == App.MODE_BROWSER;
		
		// Closes dialog after open
		window.openFile = new OpenFile(mxUtils.bind(this, function(cancel)
		{
			this.hideDialog(cancel);
		}));
		
		window.openFile.setConsumer(mxUtils.bind(this, function(xml, filename)
		{
			try
			{
				this.loadLibrary((mode == App.MODE_BROWSER) ? new StorageLibrary(this, xml, filename) :
					new LocalLibrary(this, xml, filename));
			}
			catch (e)
			{
				this.handleError(e, mxResources.get('errorLoadingFile'));
			}
		}));

		// Removes openFile if dialog is closed
		this.showDialog(new OpenDialog(this).container, (Editor.useLocalStorage) ? 640 : 360,
			(Editor.useLocalStorage) ? 480 : 220, true, true, function()
		{
			Editor.useLocalStorage = prevValue;
			window.openFile = null;
		});
	}
};

/**
 * Translates this point by the given vector.
 * 
 * @param {number} dx X-coordinate of the translation.
 * @param {number} dy Y-coordinate of the translation.
 */
App.prototype.createLibraryDataFromImages = function(images)
{
	var doc = mxUtils.createXmlDocument();
	var library = doc.createElement('mxlibrary');
	mxUtils.setTextContent(library, JSON.stringify(images));
	doc.appendChild(library);
	
	return mxUtils.getXml(doc);
};

/**
 * Translates this point by the given vector.
 * 
 * @param {number} dx X-coordinate of the translation.
 * @param {number} dy Y-coordinate of the translation.
 */
App.prototype.saveLibrary = function(name, images, file, mode, noSpin, noReload, fn)
{
	mode = (mode != null) ? mode : this.mode;
	noSpin = (noSpin != null) ? noSpin : false;
	noReload = (noReload != null) ? noReload : false;
	var xml = this.createLibraryDataFromImages(images);
	
	var error = mxUtils.bind(this, function(resp)
	{
		this.spinner.stop();
		
		if (fn != null)
		{
			fn();
		}
		
		this.handleError(resp, (resp != null) ? mxResources.get('errorSavingFile') : null);
	});

	// Handles special case for local libraries
	if (file == null && mode == App.MODE_DEVICE)
	{
		file = new LocalLibrary(this, xml, name);
	}
	
	if (file == null)
	{
		this.pickFolder(mode, mxUtils.bind(this, function(folderId)
		{
			if (mode == App.MODE_GOOGLE && this.drive != null && this.spinner.spin(document.body, mxResources.get('inserting')))
			{
				this.drive.insertFile(name, xml, folderId, mxUtils.bind(this, function(newFile)
				{
					this.spinner.stop();
					this.hideDialog(true);
					this.libraryLoaded(newFile, images);
				}), error, this.drive.libraryMimeType);
			}
			else if (mode == App.MODE_DROPBOX && this.dropbox != null && this.spinner.spin(document.body, mxResources.get('inserting')))
			{
				this.dropbox.insertLibrary(name, xml, mxUtils.bind(this, function(newFile)
				{
					this.spinner.stop();
					this.hideDialog(true);
					this.libraryLoaded(newFile, images);
				}), error, folderId);
			}
			else if (mode == App.MODE_ONEDRIVE && this.oneDrive != null && this.spinner.spin(document.body, mxResources.get('inserting')))
			{
				this.oneDrive.insertLibrary(name, xml, mxUtils.bind(this, function(newFile)
				{
					this.spinner.stop();
					this.hideDialog(true);
					this.libraryLoaded(newFile, images);
				}), error, folderId);
			}
			else if (mode == App.MODE_BROWSER)
			{
				var fn = mxUtils.bind(this, function()
				{
					var file = new StorageLibrary(this, xml, name);
					
					// Inserts data into local storage
					file.saveFile(name, false, mxUtils.bind(this, function()
					{
						this.hideDialog(true);
						this.libraryLoaded(file, images);
					}), error);
				});
				
				if (localStorage.getItem(name) == null)
				{
					fn();
				}
				else
				{
					this.confirm(mxResources.get('replaceIt', [name]), fn);
				}
			}
			else
			{
				this.handleError({message: mxResources.get('serviceUnavailableOrBlocked')});
			}
		}));
	}
	else if (noSpin || this.spinner.spin(document.body, mxResources.get('saving')))
	{
		file.setData(xml);
		
		var doSave = mxUtils.bind(this, function()
		{
			file.save(true, mxUtils.bind(this, function(resp)
			{
				this.spinner.stop();
				this.hideDialog(true);
				
				if (!noReload)
				{
					this.libraryLoaded(file, images);
				}
				
				if (fn != null)
				{
					fn();
				}
			}), error);
		});
		
		if (name != file.getTitle())
		{
			var oldHash = file.getHash();
			
			file.rename(name, mxUtils.bind(this, function(resp)
			{
				// Change hash in stored settings
				if (file.constructor != LocalLibrary && oldHash != file.getHash())
				{
					mxSettings.removeCustomLibrary(oldHash);
					mxSettings.addCustomLibrary(file.getHash());
				}

				// Workaround for library files changing hash so
				// the old library cannot be removed from the
				// sidebar using the updated file in libraryLoaded
				this.removeLibrarySidebar(oldHash);

				doSave();
			}), error)
		}
		else
		{
			doSave();
		}
	}
};

/**
 * Adds the label menu items to the given menu and parent.
 */
App.prototype.saveFile = function(forceDialog)
{
	var file = this.getCurrentFile();
	
	if (file != null)
	{
		// FIXME: Invoke for local files
		var done = mxUtils.bind(this, function()
		{
			this.removeDraft();
			this.editor.setStatus(mxResources.get('allChangesSaved'));
		});
		
		if (!forceDialog && file.getTitle() != null && this.mode != null)
		{
			this.save(file.getTitle(), done);
		}
		else
		{
			var filename = (file.getTitle() != null) ? file.getTitle() : this.defaultFilename;
			var allowTab = !mxClient.IS_IOS || !navigator.standalone;
			var prev = this.mode;
			
			var dlg = new CreateDialog(this, filename, mxUtils.bind(this, function(name, mode)
			{
				if (name != null && name.length > 0)
				{
					if (prev == null && mode == App.MODE_DEVICE)
					{
						this.setMode(App.MODE_DEVICE);
						this.save(name, done);
					}
					else if (mode == 'download')
					{
						var tmp = new LocalFile(this, null, name);
						tmp.save();
					}
					else if (mode == '_blank')
					{
						window.openFile = new OpenFile(function()
						{
							window.openFile = null;
						});
						
						// Do not use a filename to use undefined mode
						window.openFile.setData(this.getFileData(true));
						window.open(this.getUrl(window.location.pathname));
					}
					else if (prev != mode)
					{
						this.pickFolder(mode, mxUtils.bind(this, function(folderId)
						{
							this.createFile(name, this.getFileData(/(\.xml)$/i.test(name) ||
								name.indexOf('.') < 0, /(\.svg)$/i.test(name),
								/(\.html)$/i.test(name)), null, mode, done,
								this.mode == null, folderId);
						}));
					}
					else if (mode != null)
					{
						this.save(name, done);
					}
				}
			}), mxUtils.bind(this, function()
			{
				this.hideDialog();
			}), mxResources.get('saveAs'), mxResources.get('download'), null, null, allowTab,
				(this.isOffline()) ? null : 'https://support.draw.io/questions/9338901', true);
			this.showDialog(dlg.container, 440, 380, true, true);
			dlg.init();
		}
	}
};

/**
 * Translates this point by the given vector.
 * 
 * @param {number} dx X-coordinate of the translation.
 * @param {number} dy Y-coordinate of the translation.
 */
App.prototype.createFile = function(title, data, libs, mode, done, replace, folderId)
{
	mode = (mode != null) ? mode : this.mode;

	if (title != null && this.spinner.spin(document.body, mxResources.get('inserting')))
	{
		data = (data != null) ? data : this.emptyDiagramXml;
		
		var error = mxUtils.bind(this, function(resp)
		{
			this.spinner.stop();
			
			if (resp == null && this.getCurrentFile() == null && this.dialog == null)
			{
				this.showSplash();
			}
			else if (resp != null)
			{
				this.handleError(resp);
			}
		});
		
		if (mode == App.MODE_GOOGLE && this.drive != null)
		{
			folderId = (this.stateArg != null) ? this.stateArg.folderId : folderId;

			this.drive.insertFile(title, data, folderId, mxUtils.bind(this, function(file)
			{
				this.spinner.stop();
				this.fileCreated(file, libs, replace, done);
			}), error);
		}
		else if (mode == App.MODE_DROPBOX && this.dropbox != null)
		{
			this.dropbox.insertFile(title, data, mxUtils.bind(this, function(file)
			{
				this.spinner.stop();
				this.fileCreated(file, libs, replace, done);
			}), error);
		}
		else if (mode == App.MODE_ONEDRIVE && this.oneDrive != null)
		{
			this.oneDrive.insertFile(title, data, mxUtils.bind(this, function(file)
			{
				this.spinner.stop();
				this.fileCreated(file, libs, replace, done);
			}), error, false, folderId);
		}
		else if (mode == App.MODE_BROWSER)
		{
			this.spinner.stop();
			
			var fn = mxUtils.bind(this, function()
			{
				var file = new StorageFile(this, data, title);
				
				// Inserts data into local storage
				file.saveFile(title, false, mxUtils.bind(this, function()
				{
					this.fileCreated(file, libs, replace, done);
				}), error);
			});
			
			if (localStorage.getItem(title) == null)
			{
				fn();
			}
			else
			{
				this.confirm(mxResources.get('replaceIt', [title]), fn, mxUtils.bind(this, function()
				{
					if (this.getCurrentFile() == null && this.dialog == null)
					{
						this.showSplash();
					}
				}));
			}
		}
		else
		{
			this.spinner.stop();
			this.fileCreated(new LocalFile(this, data, title), libs, replace, done);
		}
	}
};

/**
 * Translates this point by the given vector.
 * 
 * @param {number} dx X-coordinate of the translation.
 * @param {number} dy Y-coordinate of the translation.
 */
App.prototype.fileCreated = function(file, libs, replace, done)
{
	var url = window.location.pathname;
	
	if (libs != null && libs.length > 0)
	{
		url += '?libs=' + libs;
	}
	
	url = this.getUrl(url);

	// Always opens a new tab for local files to avoid losing changes
	if (file.getMode() != App.MODE_DEVICE)
	{
		url += '#' + file.getHash();
	}
	
	// Makes sure to produce consistent output with finalized files via createFileData this needs
	// to save the file again since it needs the newly created file ID for redirecting in HTML
	if (this.spinner.spin(document.body, mxResources.get('inserting')))
	{
		var data = file.getData();
		file.setData(this.createFileData((data.length > 0) ?
			this.editor.extractGraphModel(mxUtils.parseXml(data).documentElement, true) : null,
			null, file, window.location.protocol + '//' + window.location.hostname + url));

		var fn = mxUtils.bind(this, function()
		{
			this.spinner.stop();
			
			if (this.mode == null && (urlParams['create'] != null || urlParams['url'] != null))
			{
				if (file.constructor == LocalFile)
				{
					// LATER: Remove create, title and mode URL params
					this.fileLoaded(file);
				}
				else if (this.spinner.spin(document.body, mxResources.get('inserting')))
				{
					// Makes sure the file is not loaded when the hash changes
					this.setCurrentFile(file);
					window.location.hash = file.getHash();
					
					// Removes create URL parameter and reloads page
					window.location.search = this.getSearch(['create', 'title', 'notitle', 'mode', 'url']);
				}
			}
			else
			{
				var fn2 = mxUtils.bind(this, function()
				{
					// Replaces current URL for non-local files if user wants to open in same window
					if (file.constructor != LocalFile && (urlParams['create'] != null || urlParams['url'] != null))
					{
						this.setCurrentFile(file);
						window.location.hash = file.getHash();
						
						// Removes URL parameters and reloads page
						window.location.search = this.getSearch(['create', 'title', 'notitle', 'mode', 'url']);
					}
					else
					{
						window.openFile = null;
						this.fileLoaded(file);
						
						if (libs != null)
						{
							this.sidebar.showEntries(libs);
						}
					}

					if (done != null)
					{
						done();
					}
				});
		
				// Updates the file if it has been overwritten
				if (!replace && (this.getCurrentFile() != null && (decodeURIComponent(this.getDiagramId()) !=
					decodeURIComponent(file.getHash()) || file.constructor == LocalFile)))
				{
					// Opens local file in a new window
					if (file.constructor == LocalFile)
					{
						window.openFile = new OpenFile(function()
						{
							window.openFile = null;
						});
							
						window.openFile.setData(file.getData(), file.getTitle());
					}

					window.openWindow(url, null, fn2);
				}
				else
				{
					fn2();
				}
			}
		});
		
		// Updates data in memory for local files
		if (file.constructor == LocalFile)
		{
			fn();
		}
		else
		{
			file.saveFile(file.getTitle(), false, mxUtils.bind(this, function()
			{
				fn();
			}), mxUtils.bind(this, function(resp)
			{
				this.spinner.stop();
				this.handleError(resp);
			}));
		}
	}
};

/**
 * Translates this point by the given vector.
 * 
 * @param {number} dx X-coordinate of the translation.
 * @param {number} dy Y-coordinate of the translation.
 */
App.prototype.loadFile = function(id, sameWindow, file)
{
	this.hideDialog();
	
	var fn = mxUtils.bind(this, function()
	{
		if (this.spinner.spin(document.body, mxResources.get('loading')))
		{
			// Handles files from localStorage
			if (id.charAt(0) == 'L')
			{
				this.spinner.stop();

				if (!isLocalStorage)
				{
					this.handleError({message: mxResources.get('serviceUnavailableOrBlocked')}, mxResources.get('errorLoadingFile'), mxUtils.bind(this, function()
					{
						var file = this.getCurrentFile();
						window.location.hash = (file != null) ? file.getHash() : '';
					}));
				}
				else
				{
					try
					{
						id = decodeURIComponent(id.substring(1));
						var data = localStorage.getItem(id);
						
						if (data != null)
						{
							this.fileLoaded(new StorageFile(this, data, id));
						}
						else
						{
							throw {message: mxResources.get('fileNotFound')};
						}
					}
					catch (e)
					{
						this.handleError(e, mxResources.get('errorLoadingFile'), mxUtils.bind(this, function()
						{
							var file = this.getCurrentFile();
							window.location.hash = (file != null) ? file.getHash() : '';
						}));
					}
				}
			}
			else if (file != null)
			{
				// File already loaded
				this.spinner.stop();
				this.fileLoaded(file);
			}
			else
			{
				// Google Drive files are handled as default file types
				var peer = null;
				
				if (id.charAt(0) == 'G')
				{
					peer = this.drive;
				}
				else if (id.charAt(0) == 'D')
				{
					peer = this.dropbox;
				}
				else if (id.charAt(0) == 'W')
				{
					peer = this.oneDrive;
				}

				id = decodeURIComponent(id.substring(1));
				
				if (peer == null)
				{
					this.handleError({message: mxResources.get('serviceUnavailableOrBlocked')}, mxResources.get('errorLoadingFile'), mxUtils.bind(this, function()
					{
						var file = this.getCurrentFile();
						window.location.hash = (file != null) ? file.getHash() : '';
					}));
				}
				else
				{
					peer.getFile(id, mxUtils.bind(this, function(file)
					{
						this.spinner.stop();
						this.fileLoaded(file);
					}), mxUtils.bind(this, function(resp)
					{
						// Makes sure the file does not save the invalid UI model and overwrites anything important
						if (window.console != null && resp != null)
						{
							console.log('error in loadFile:', id, resp);
						}
						
						this.handleError(resp, (resp != null) ? mxResources.get('errorLoadingFile') : null, mxUtils.bind(this, function()
						{
							var file = this.getCurrentFile();
							
							if (file == null)
							{
								window.location.hash = '';
								this.showSplash();
							}
							else
							{
								window.location.hash = file.getHash();	
							}
						}));
					}));
				}
			}
		}
	});
	
	if (id == null || id.length == 0)
	{
		this.editor.setStatus('');
		this.fileLoaded(null);
	}
	else if (this.getCurrentFile() != null && !this.isDiagramEmpty() && !sameWindow)
	{
		window.openWindow(this.getUrl() + '#' + id, null, fn);
	}
	else
	{
		fn();
	}
};

/**
 * Translates this point by the given vector.
 * 
 * @param {number} dx X-coordinate of the translation.
 * @param {number} dy Y-coordinate of the translation.
 */
App.prototype.loadLibrary = function(file)
{
	var doc = mxUtils.parseXml(file.getData());
	
	if (doc.documentElement.nodeName == 'mxlibrary')
	{
		var images = JSON.parse(mxUtils.getTextContent(doc.documentElement));
		this.libraryLoaded(file, images);
	}
	else
	{
		throw {message: mxResources.get('notALibraryFile')};
	}
};

/**
 * Translates this point by the given vector.
 * 
 * @param {number} dx X-coordinate of the translation.
 * @param {number} dy Y-coordinate of the translation.
 */
App.prototype.removeLibrarySidebar = function(id)
{
	var elts = this.sidebar.palettes[id];
	
	if (elts != null)
	{
		for (var i = 0; i < elts.length; i++)
		{
			elts[i].parentNode.removeChild(elts[i]);
		}
		
		delete this.sidebar.palettes[id];
	}
};

/**
 * Translates this point by the given vector.
 * 
 * @param {number} dx X-coordinate of the translation.
 * @param {number} dy Y-coordinate of the translation.
 */
App.prototype.getLibraryStorageHint = function(file)
{
	var tip = '';
	
	if (file.constructor != LocalLibrary)
	{
		tip += file.getHash();
	}
	
	if (file.constructor == DriveLibrary)
	{
		tip += ' (' + mxResources.get('googleDrive') + ')';
	}
	else if (file.constructor == DropboxLibrary)
	{
		tip += ' (' + mxResources.get('dropbox') + ')';
	}
	else if (file.constructor == OneDriveLibrary)
	{
		tip += ' (' + mxResources.get('oneDrive') + ')';
	}
	else if (file.constructor == StorageLibrary)
	{
		tip += ' (' + mxResources.get('browser') + ')';
	}
	else if (file.constructor == LocalLibrary)
	{
		tip += ' (' + mxResources.get('device') + ')';
	}

	return tip;
};

/**
 * Translates this point by the given vector.
 * 
 * @param {number} dx X-coordinate of the translation.
 * @param {number} dy Y-coordinate of the translation.
 */
App.prototype.closeLibrary = function(file)
{
	if (file != null)
	{
		this.removeLibrarySidebar(file.getHash());
		
		if (file.constructor != LocalLibrary)
		{
			mxSettings.removeCustomLibrary(file.getHash());
		}
		
		if (file.title == '.scratchpad')
		{
			this.scratchpad = null;
		}
	}
};

/**
 * Changes the position of the library in the sidebar 
 */
App.prototype.repositionLibrary = function(nextChild) 
{
    var c = this.sidebar.container;
	nextChild = (nextChild != null) ? nextChild : c.firstChild.nextSibling.nextSibling;
	
	var content = c.lastChild;
	var title = content.previousSibling;
	
    c.insertBefore(content, nextChild);
    c.insertBefore(title, content);
}

/**
 * Translates this point by the given vector.
 * 
 * @param {number} dx X-coordinate of the translation.
 * @param {number} dy Y-coordinate of the translation.
 */
App.prototype.toggleScratchpad = function()
{
	if (isLocalStorage)
	{
		if (this.scratchpad == null)
		{
			var xml = localStorage.getItem('.scratchpad');
			
			if (xml == null)
			{
				xml = this.emptyLibraryXml;
			}
			
			this.loadLibrary(new StorageLibrary(this, xml, '.scratchpad'));
		}
		else
		{
			this.closeLibrary(this.scratchpad);
		}
	}
};

/**
 * Translates this point by the given vector.
 * 
 * @param {number} dx X-coordinate of the translation.
 * @param {number} dy Y-coordinate of the translation.
 */
App.prototype.libraryLoaded = function(file, images)
{
	if (file.constructor != LocalLibrary)
	{
		mxSettings.addCustomLibrary(file.getHash());
	}

	if (file.title == '.scratchpad')
	{
		this.scratchpad = file;
	}
	
	var elts = this.sidebar.palettes[file.getHash()];
	var nextSibling = (elts != null) ? elts[elts.length - 1].nextSibling : null;

	// Removes existing sidebar entry for this library
	this.removeLibrarySidebar(file.getHash());
	var dropTarget = null;
	
	var addImages = mxUtils.bind(this, function(imgs, content)
	{
		if (imgs.length == 0 && file.isEditable())
		{
			if (dropTarget == null)
			{
				dropTarget = document.createElement('div');
				mxUtils.setPrefixedStyle(dropTarget.style, 'borderRadius', '6px');
				dropTarget.style.border = '3px dotted lightGray';
				dropTarget.style.textAlign = 'center';
				dropTarget.style.padding = '8px';
				dropTarget.style.color = '#B3B3B3';
				mxUtils.write(dropTarget, mxResources.get('dragElementsHere'));
			}
			
			content.appendChild(dropTarget);
		}
		else
		{
			for (var i = 0; i < imgs.length; i++)
			{
				var img = imgs[i];
				var data = img.data;
	
				if (data != null)
				{
					data = this.convertDataUri(data);
					var s = 'shape=image;verticalLabelPosition=bottom;verticalAlign=top;';
					
					if (img.aspect == 'fixed')
					{
						s += 'aspect=fixed;'
					}
					else
					{
						s += 'imageAspect=0;'
					}
					
					content.appendChild(this.sidebar.createVertexTemplate(s + 'image=' +
						data, img.w, img.h, '', img.title || '', false, false, false));
				}
				else if (img.xml != null)
				{
					var cells = this.stringToCells(this.editor.graph.decompress(img.xml));
					
					if (cells.length > 0)
					{
						content.appendChild(this.sidebar.createVertexTemplateFromCells(
							cells, img.w, img.h, img.title || '', true, false, false));
					}
				}
			}
		}
	});
	
	// Adds new sidebar entry for this library
	var contentDiv = this.sidebar.addPalette(file.getHash(), file.getTitle(), true, mxUtils.bind(this, function(content)
	{
		addImages(images, content);
    }));

	this.repositionLibrary(nextSibling);
	
	// Adds tooltip for backend
	var title = contentDiv.parentNode.previousSibling;
    var tip = title.getAttribute('title');
    
    if (tip != null && tip.length > 0 && file.title != '.scratchpad')
    {
    	title.setAttribute('title', this.getLibraryStorageHint(file) + '\n' + tip);
    }
    
    var buttons = document.createElement('div');
    buttons.style.position = 'absolute';
    buttons.style.right = '0px';
    buttons.style.top = '5px';
    title.style.position = 'relative';
    
	var btn = document.createElement('img');
	btn.setAttribute('src', Dialog.prototype.closeImage);
	btn.setAttribute('title', mxResources.get('close'));
	btn.setAttribute('align', 'top');
	btn.setAttribute('border', '0');
	btn.style.cursor = 'pointer';
	btn.style.marginRight = '8px';
	btn.style.marginTop = '3px';
	buttons.appendChild(btn);
	
	var saveBtn = null;
	
	mxEvent.addListener(btn, 'click', mxUtils.bind(this, function(evt)
	{
		// Workaround for close after any button click in IE8/quirks
		if (!mxEvent.isConsumed(evt))
		{
			var fn = mxUtils.bind(this, function()
			{
				this.closeLibrary(file);
			});
			
			if (saveBtn != null)
			{
				this.confirm(mxResources.get('allChangesLost'), fn);
			}
			else
			{
				fn();
			}
	
			mxEvent.consume(evt);
		}
	}));
	
	// Shows tooltip if mouse over background
	mxEvent.addListener(contentDiv, 'mousemove', mxUtils.bind(this, function(evt)
	{
		if (mxEvent.getSource(evt) == contentDiv)
		{
			contentDiv.setAttribute('title', mxResources.get('libraryTooltip'));
		}
		else
		{
			contentDiv.removeAttribute('title');
		}
	}));
	
	if (file.isEditable())
	{
		var graph = this.editor.graph;
		
		var editLibrary = mxUtils.bind(this, function(evt)
		{
			this.showLibraryDialog(file.getTitle(), contentDiv, images, file, file.getMode());
			mxEvent.consume(evt);
		});
		
		var saveLibrary = mxUtils.bind(this, function(evt)
		{
			if (file.constructor != LocalLibrary || file.isAutosave())
			{
				if (spinBtn != null && spinBtn.parentNode != null)
				{
					spinBtn.parentNode.removeChild(spinBtn);
				}
				
				spinBtn = btn.cloneNode(false);
				spinBtn.setAttribute('src', App.prototype.spinImage);
				spinBtn.setAttribute('title', mxResources.get('saving'));
				spinBtn.style.cursor = 'default';
				spinBtn.style.marginRight = '6px';
				spinBtn.style.marginTop = '2px';
				buttons.insertBefore(spinBtn, buttons.firstChild);
				
				this.saveLibrary(file.getTitle(), images, file, file.getMode(), true, true, function()
				{
					if (spinBtn != null && spinBtn.parentNode != null)
					{
						spinBtn.parentNode.removeChild(spinBtn);
					}
				});
			}
			else if (saveBtn == null)
			{
				saveBtn = btn.cloneNode(false);
				saveBtn.setAttribute('src', IMAGE_PATH + '/download.png');
				saveBtn.setAttribute('title', mxResources.get('save'));
				buttons.insertBefore(saveBtn, buttons.firstChild);
				
				mxEvent.addListener(saveBtn, 'click', mxUtils.bind(this, function(evt)
				{
					this.saveLibrary(file.getTitle(), images, file, file.getMode(), true, true);
					saveBtn.parentNode.removeChild(saveBtn);
					saveBtn = null;
					
					mxEvent.consume(evt);
				}));
			}
		});
		
		var addCells = mxUtils.bind(this, function(cells, bounds, evt, title)
		{
			cells = graph.cloneCells(graph.model.getTopmostCells(cells));

			// Translates cells to origin
			for (var i = 0; i < cells.length; i++)
			{
				var geo = graph.getCellGeometry(cells[i]);
				
				if (geo != null)
				{
					geo.translate(-bounds.x, -bounds.y);
				}
			}

			contentDiv.appendChild(this.sidebar.createVertexTemplateFromCells(
				cells, bounds.width, bounds.height, title || '', true, false, false));

			var xml = this.editor.graph.compress(mxUtils.getXml(this.editor.graph.encodeCells(cells)));
			var entry = {xml: xml, w: bounds.width, h: bounds.height};
			
			if (title != null)
			{
				entry.title = title;
			}
			
			images.push(entry);
			saveLibrary(evt);
			
			if (dropTarget != null && dropTarget.parentNode != null && images.length > 0)
			{
				dropTarget.parentNode.removeChild(dropTarget);
				dropTarget = null;
			}
		});
	
		var addSelection = mxUtils.bind(this, function(evt)
		{
			if (!graph.isSelectionEmpty())
			{
				var cells = graph.getSelectionCells();
				var bounds = graph.view.getBounds(cells);
				
				var s = graph.view.scale;
				
				bounds.x /= s;
				bounds.y /= s;
				bounds.width /= s;
				bounds.height /= s;
				
				bounds.x -= graph.view.translate.x;
				bounds.y -= graph.view.translate.y;
				
				addCells(cells, bounds);
			}
			else
			{
				this.showError(mxResources.get('error'), mxResources.get('nothingIsSelected'), mxResources.get('ok'));
			}
			
			mxEvent.consume(evt);
		});
		
		// Defines inactive border state
		contentDiv.style.border = '3px solid transparent';
		
		// Adds drop handler from graph
		mxEvent.addGestureListeners(contentDiv, function(){}, mxUtils.bind(this, function(evt)
		{
			if (graph.isMouseDown && graph.panningManager != null && graph.graphHandler.shape != null)
			{
				graph.graphHandler.shape.node.style.visibility = 'hidden';
				
				if (dropTarget != null)
				{
					dropTarget.style.border = '3px dotted rgb(254, 137, 12)';
				}
				else
				{
					contentDiv.style.border = '3px dotted rgb(254, 137, 12)';
				}
				
				contentDiv.style.cursor = 'copy';
				graph.panningManager.stop();
				graph.autoScroll = false;
				
				if (graph.graphHandler.guide != null)
				{
					graph.graphHandler.guide.setVisible(false);
				}
				
				if (graph.graphHandler.hint != null)
				{
					graph.graphHandler.hint.style.visibility = 'hidden';	
				}
				
				mxEvent.consume(evt);
			}
		}), mxUtils.bind(this, function(evt)
		{
			if (graph.isMouseDown && graph.panningManager != null && graph.graphHandler != null)
			{
				contentDiv.style.border = '3px solid transparent';
				
				if (dropTarget != null)
				{
					dropTarget.style.border = '3px dotted lightGray';
				}
				
				contentDiv.style.cursor = 'default';
				this.sidebar.showTooltips = true;
				graph.panningManager.stop();
				graph.graphHandler.reset();
				graph.isMouseDown = false;
				graph.autoScroll = true;
				addSelection(evt);
				mxEvent.consume(evt);
			}
		}));
		
		// Handles mouse leaving the library and restoring move
		mxEvent.addListener(contentDiv, 'mouseleave', mxUtils.bind(this, function(evt)
		{
			if (graph.isMouseDown && graph.graphHandler.shape != null)
			{
				graph.graphHandler.shape.node.style.visibility = 'visible';
				contentDiv.style.border = '3px solid transparent';
				contentDiv.style.cursor = '';
				graph.autoScroll = true;
				
				if (graph.graphHandler.guide != null)
				{
					graph.graphHandler.guide.setVisible(true);
				}
				
				if (graph.graphHandler.hint != null)
				{
					graph.graphHandler.hint.style.visibility = 'visible';	
				}
				
				if (dropTarget != null)
				{
					dropTarget.style.border = '3px dotted lightGray';
				}
			}
		}));
		
		// Adds drop handler from filesystem
		if (Graph.fileSupport)
		{
			mxEvent.addListener(contentDiv, 'dragover', mxUtils.bind(this, function(evt)
			{
				if (dropTarget != null)
				{
					dropTarget.style.border = '3px dotted rgb(254, 137, 12)';
				}
				else
				{
					contentDiv.style.border = '3px dotted rgb(254, 137, 12)';
				}
				
				evt.dataTransfer.dropEffect = 'copy';
				contentDiv.style.cursor = 'copy';
				this.sidebar.hideTooltip();
				evt.stopPropagation();
				evt.preventDefault();
			}));
			
			mxEvent.addListener(contentDiv, 'drop', mxUtils.bind(this, function(evt)
			{
				contentDiv.style.border = '3px solid transparent';
				contentDiv.style.cursor = '';
				
				if (dropTarget != null)
				{
					dropTarget.style.border = '3px dotted lightGray';
				}
				
			    if (evt.dataTransfer.files.length > 0)
			    {	
			    	this.importFiles(evt.dataTransfer.files, 0, 0, this.maxImageSize, mxUtils.bind(this, function(data, mimeType, x, y, w, h, img)
			    	{
						if (data != null && mimeType.substring(0, 6) == 'image/')
						{
							var style = 'shape=image;verticalLabelPosition=bottom;verticalAlign=top;aspect=fixed;image=' +
								this.convertDataUri(data);
							var cells = [new mxCell('', new mxGeometry(0, 0, w, h), style)];
							cells[0].vertex = true;

							addCells(cells, new mxRectangle(0, 0, w, h), evt, (mxEvent.isAltDown(evt)) ? null : img.substring(0, img.lastIndexOf('.')).replace(/_/g, ' '));
						}
						else
						{
							var done = false;
							
							if (data != null && mimeType == 'text/xml')
							{
								var doc = mxUtils.parseXml(data);
								
								if (doc.documentElement.nodeName == 'mxlibrary')
								{
									try
									{
										var temp = JSON.parse(mxUtils.getTextContent(doc.documentElement));
										addImages(temp, contentDiv);
										images = images.concat(temp);
										saveLibrary(evt);
										this.spinner.stop();
										done = true;
									}
									catch (e)
									{
										// ignore
									}
								}
								else if (doc.documentElement.nodeName == 'mxfile')
								{
									try
									{
										var temp = mxUtils.getTextContent(doc.documentElement.getElementsByTagName('diagram')[0]);
										var cells = this.stringToCells(this.editor.graph.decompress(temp));
										addCells(cells, new mxRectangle(0, 0, w, h), evt);
										done = true;
									}
									catch (e)
									{
										// ignore
									}
								}
							}
							
							if (!done)
							{
								this.spinner.stop();
								this.handleError({message: mxResources.get('errorLoadingFile')})
							}
						}
						
						if (dropTarget != null && dropTarget.parentNode != null && images.length > 0)
						{
							dropTarget.parentNode.removeChild(dropTarget);
							dropTarget = null;
						}
			    	}));
				}
			    
			    evt.stopPropagation();
			    evt.preventDefault();
			}));

			mxEvent.addListener(contentDiv, 'dragleave', function(evt)
			{
				if (dropTarget != null)
				{
					dropTarget.style.border = '3px dotted lightGray';
				}
				else
				{
					contentDiv.style.border = '3px solid transparent';
					contentDiv.style.cursor = '';
				}

				evt.stopPropagation();
				evt.preventDefault();
			});
		}

		btn = btn.cloneNode(false);
		btn.setAttribute('src', IMAGE_PATH + '/edit.gif');
		btn.setAttribute('title', mxResources.get('edit'));
		buttons.insertBefore(btn, buttons.firstChild);
		
		mxEvent.addListener(btn, 'click', editLibrary);
		mxEvent.addListener(contentDiv, 'dblclick', function(evt)
		{
			if (mxEvent.getSource(evt) == contentDiv)
			{
				editLibrary(evt);
			}
		});
		
		btn = btn.cloneNode(false);
		btn.setAttribute('src', App.prototype.plusImage);
		btn.setAttribute('title', mxResources.get('add'));
		buttons.insertBefore(btn, buttons.firstChild);
		
		if (!this.isOffline())
		{
			var link = document.createElement('span');
			link.setAttribute('title', mxResources.get('help'));
			link.style.cssText = 'color:gray;text-decoration:none;margin-right:8px;';
			mxUtils.write(link, '?');
			
			mxEvent.addGestureListeners(link, mxUtils.bind(this, function(evt)
			{
				window.open('https://support.draw.io/questions/10420280');
				mxEvent.consume(evt);
			}));
			
			buttons.insertBefore(link, buttons.firstChild);
		}
		
		var spinBtn = null;

		mxEvent.addListener(btn, 'click', addSelection);
	}
	
	title.appendChild(buttons);
};

/**
 * Translates this point by the given vector.
 * 
 * @param {number} dx X-coordinate of the translation.
 * @param {number} dy Y-coordinate of the translation.
 */
App.prototype.fileLoaded = function(file)
{
	this.hideDialog();
	var oldFile = this.getCurrentFile();
	this.setCurrentFile(null);

	if (oldFile != null)
	{
		oldFile.removeListener(this.descriptorChangedListener);
		oldFile.close();
	}
	
	this.editor.graph.model.clear();
	this.editor.undoManager.clear();

	var noFile = mxUtils.bind(this, function()
	{
		this.diagramContainer.style.visibility = 'hidden';
		this.formatContainer.style.visibility = 'hidden';
		this.editor.graph.setEnabled(false);
		
		// Keeps initial title if no file existed before
		if (oldFile != null)
		{
			this.updateDocumentTitle();
		}
		
		// File might have been loaded halfway
		this.editor.graph.model.clear();
		this.editor.undoManager.clear();
				
		// Avoids empty hash with no value
		if (window.location.hash != null && window.location.hash.length > 0)
		{
			window.location.hash = '';
		}
		
		if (this.fname != null)
		{
			this.fnameWrapper.style.display = 'none';
			this.fname.innerHTML = '';
			this.fname.setAttribute('title', mxResources.get('rename'));
		}

		this.updateUi();
		this.showSplash();
	});

	if (file != null)
	{
		try
		{
			file.open();
			this.setCurrentFile(file);
			this.diagramContainer.style.visibility = '';
			this.formatContainer.style.visibility = '';
			
			file.addListener('descriptorChanged', this.descriptorChangedListener);
			file.addListener('contentChanged', this.descriptorChangedListener);
			this.descriptorChanged();
			
			this.editor.undoManager.clear();
			this.setMode(file.getMode());
			this.updateUi();
			
			// Realtime files have a valid status message
			if (file.realtime == null)
			{
				if (!file.isEditable())
				{
					this.editor.setStatus(mxResources.get('readOnly'));
				}
				else
				{
					this.editor.setStatus('');
				}
			}

			if (!this.editor.chromeless)
			{
				this.showLayersDialog();
				this.restoreLibraries();
			}
			else if (this.editor.graph.lightbox)
			{
				this.lightboxFit();
			}

			if (this.chromelessResize)
			{
				this.chromelessResize();
			}
			
			this.editor.fireEvent(new mxEventObject('fileLoaded'));
			
			if (this.enableLogging)
			{
	        	try
	        	{
		        	if (!this.isOffline())
		        	{
	        			var img = new Image();
	        			img.src = 'images/log.png?mode=' + encodeURIComponent(file.getMode()) +
	        				'&v=' + encodeURIComponent(EditorUi.VERSION);
		        	}
	        	}
	        	catch (e)
	        	{
	        		// ignore
	        	}
			}
			
			if (this.mode == file.getMode() && file.getMode() != App.MODE_DEVICE)
			{
				try
				{
					this.addRecent({id: file.getHash(), title: file.getTitle(), mode: file.getMode()});
				}
				catch (e)
				{
					// ignore
				}
			}
		}
		catch (e)
		{
			// Makes sure the file does not save the invalid UI model and overwrites anything important
			if (window.console != null)
			{
				console.log('error in fileLoaded:', file, e);
			}
			
			// Asynchronous handling of errors
			this.handleError(e, mxResources.get('errorLoadingFile'), mxUtils.bind(this, function()
			{
				// Removes URL parameter and reloads the page
				if (urlParams['url'] != null && this.spinner.spin(document.body, mxResources.get('reconnecting')))
				{
					window.location.search = this.getSearch(['url']);
				}
				else if (oldFile != null)
				{
					this.fileLoaded(oldFile);
				}
				else
				{
					noFile();
				}
			}));
		}
	}
	else
	{
		noFile();
	}
};

/**
 * Updates action states depending on the selection.
 */
App.prototype.restoreLibraries = function()
{
	if (this.sidebar != null)
	{
		if (this.pendingLibraries == null)
		{
			this.pendingLibraries = new Object();
		}
		
		// Ignores this library next time
		var ignore = mxUtils.bind(this, function(id)
		{
			mxSettings.removeCustomLibrary(id);	
			delete this.pendingLibraries[id];
		});
				
		var load = mxUtils.bind(this, function(libs)
		{
			if (libs != null)
			{
				for (var i = 0; i < libs.length; i++)
				{
					var name = encodeURIComponent(decodeURIComponent(libs[i]));
					
					(mxUtils.bind(this, function(id)
					{
						if (this.pendingLibraries[id] == null && this.sidebar.palettes[id] == null)
						{
							this.pendingLibraries[id] = true;
							var service = id.substring(0, 1);
							
							if (service == 'L')
							{
								if (isLocalStorage)
								{
									try
									{
										var name = decodeURIComponent(id.substring(1));
										var xml = localStorage.getItem(name);
										
										if (name == '.scratchpad' && xml == null)
										{
											xml = this.emptyLibraryXml;
										}
										
										if (xml != null)
										{
											this.loadLibrary(new StorageLibrary(this, xml, name));
										}
										else
										{
											ignore(id);
										}
									}
									catch (e)
									{
										ignore(id);
									}
								}
							}
							else if (service == 'U')
							{
								var url = decodeURIComponent(id.substring(1));
								
								if (!this.isOffline())
								{
									// Uses proxy to avoid CORS issues
									mxUtils.get(PROXY_URL + '?url=' + encodeURIComponent(url), mxUtils.bind(this, function(req)
									{
										if (req.getStatus() == 200)
										{
											try
											{
												this.loadLibrary(new UrlLibrary(this, req.getText(), url));
												delete this.pendingLibraries[id];
											}
											catch (e)
											{
												ignore(id);
											}
										}
										else
										{
											ignore(id);
										}
									}), function()
									{
										ignore(id);
									});
								}
							}
							else
							{
								var peer = null;
								
								if (service == 'G')
								{
									if (this.drive != null && this.drive.user != null)
									{
										peer = this.drive;
									}
								}
								else if (service == 'D')
								{
									if (this.dropbox != null && this.dropbox.getUser() != null)
									{
										peer = this.dropbox;
									}
								}
								else if (service == 'W')
								{
									if (this.oneDrive != null && this.oneDrive.getUser() != null)
									{
										peer = this.oneDrive;
									}
								}
								
								if (peer != null)
								{
									peer.getLibrary(decodeURIComponent(id.substring(1)), mxUtils.bind(this, function(file)
									{
										try
										{
											this.loadLibrary(file);
											delete this.pendingLibraries[id];
										}
										catch (e)
										{
											ignore(id);
										}
									}), function(resp)
									{
										ignore(id);
									});
								}
							}
						}
					}))(name);
				}
			}
		});
		
		load(mxSettings.getCustomLibraries());
		load((urlParams['clibs'] || '').split(';'));
	}
};

/**
 * Updates action and menu states depending on the file.
 */
App.prototype.updateUi = function()
{
	this.updateButtonContainer();
	this.updateActionStates();
	
	// Action states that only need update for new files
	var file = this.getCurrentFile();
	var active = file != null || urlParams['embed'] == '1';
	this.menus.get('viewPanels').setEnabled(active);
	this.menus.get('viewZoom').setEnabled(active);
	
	var restricted = urlParams['embed'] != '1' && (file == null || file.isRestricted());
	this.actions.get('makeCopy').setEnabled(!restricted);
	this.actions.get('print').setEnabled(!restricted);
	this.menus.get('exportAs').setEnabled(!restricted);
	this.menus.get('embed').setEnabled(!restricted);
	
	// Disables actions in the toolbar
	var editable = (urlParams['embed'] == '1') || (file != null && file.isEditable());
	this.actions.get('image').setEnabled(active);
	this.actions.get('zoomIn').setEnabled(active);
	this.actions.get('zoomOut').setEnabled(active);
	this.actions.get('resetView').setEnabled(active);

	// Disables menus
	this.menus.get('edit').setEnabled(active);
	this.menus.get('view').setEnabled(active);
	this.menus.get('importFrom').setEnabled(editable);
	this.menus.get('arrange').setEnabled(editable);
	
	// Disables connection drop downs in toolbar
	if (this.toolbar != null)
	{
		if (this.toolbar.edgeShapeMenu != null)
		{
			this.toolbar.edgeShapeMenu.setEnabled(editable);
		}
		
		if (this.toolbar.edgeStyleMenu != null)
		{
			this.toolbar.edgeStyleMenu.setEnabled(editable);
		}
	}
	
	if (this.isOfflineApp())
	{
		// In FF, IE and Safari (desktop) the cache status never changes
		if ((mxClient.IS_GC || (mxClient.IS_IOS && mxClient.IS_SF)) && applicationCache != null)
		{
			var appCache = applicationCache;
	
			if (this.offlineStatus == null)
			{
				this.offlineStatus = document.createElement('div');
				this.offlineStatus.className = 'geItem';
				this.offlineStatus.style.position = 'absolute';
				this.offlineStatus.style.fontSize = '8pt';
				this.offlineStatus.style.top = '2px';
				this.offlineStatus.style.right = '12px';
				this.offlineStatus.style.color = '#666';
				this.offlineStatus.style.margin = '4px';
				this.offlineStatus.style.padding = '2px';
				this.offlineStatus.style.verticalAlign = 'middle';
				this.offlineStatus.innerHTML = '';
				
				this.menubarContainer.appendChild(this.offlineStatus);
	
				// Events are not working, use polling instead (10 secs interval)
				var thread = window.setTimeout(mxUtils.bind(this, function()
				{
					if (appCache.status == appCache.IDLE)
					{
						this.offlineStatus.innerHTML = '[' + '<img title="Cached" border="0" src="' + IMAGE_PATH + '/checkmark.gif"/>]';
						window.clearTimeout(thread);
					}
				}), 5000);
			}
		}
	}
	else
	{
		this.updateUserElement();
	}
};

/**
 *
 */
App.prototype.exportImage = function(scale, transparentBackground, ignoreSelection, addShadow, editable)
{
	if (this.spinner.spin(document.body, mxResources.get('exporting')))
	{
		var selectionEmpty = this.editor.graph.isSelectionEmpty();
		ignoreSelection = (ignoreSelection != null) ? ignoreSelection : selectionEmpty;
		
		try
		{
		   	this.exportToCanvas(mxUtils.bind(this, function(canvas)
		   	{
		   		this.spinner.stop();
		   		
		   		try
		   		{
		   			// TODO: Should call App.getFileData here
		   			this.saveCanvas(canvas, (editable) ? this.getFileData(true, null, null, null, ignoreSelection) : null);
		   		}
		   		catch (e)
		   		{
		   			// Fallback to server-side image export
		   			if (e.message == 'Invalid image')
		   			{
		   				this.downloadFile('png');
		   			}
		   			else
		   			{
			   			this.handleError(e);
		   			}
		   		}
		   	}), null, null, null, mxUtils.bind(this, function(e)
		   	{
		   		this.spinner.stop();
		   		this.handleError(e);
		   	}), null, ignoreSelection, scale || 1, transparentBackground, addShadow);
		}
		catch (e)
		{
			this.spinner.stop();
			this.handleError(e);
		}
	}
};

/**
 *
 */
EditorUi.prototype.exportSvg = function(scale, transparentBackground, ignoreSelection, addShadow, editable, embedImages)
{
	var selectionEmpty = this.editor.graph.isSelectionEmpty();
	ignoreSelection = (ignoreSelection != null) ? ignoreSelection : selectionEmpty;
	var bg = (transparentBackground) ? null : this.editor.graph.background;
	
	if (bg == mxConstants.NONE)
	{
		bg = null;
	}
	
	// Handles special case where background is null but transparent is false
	if (bg == null && transparentBackground == false)
	{
		bg = '#ffffff';
	}
	
	// Sets or disables alternate text for foreignObjects. Disabling is needed
	// because PhantomJS seems to ignore switch statements and paint all text.
	var svgRoot = this.editor.graph.getSvg(bg, scale, null, null, null, ignoreSelection);
	
	if (addShadow)
	{
		this.editor.addSvgShadow(svgRoot);
	}

	var file = this.getCurrentFile();
	var filename = (file != null && file.getTitle() != null) ? file.getTitle() : this.defaultFilename;
	
	var dot = filename.lastIndexOf('.');
	
	if (dot > 0)
	{
		filename = filename.substring(0, dot);
	}
	
	filename += '.svg';
	
	if (this.spinner.spin(document.body, mxResources.get('export')))
	{
		var doSave = mxUtils.bind(this, function(svgRoot)
		{
			this.spinner.stop();
			
			if (editable)
			{
				svgRoot.setAttribute('content', this.getFileData(true, null, null, null, ignoreSelection));
			}
			
			var svg = '<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">\n' +
				mxUtils.getXml(svgRoot);
			
			// TODO: Depends on App
    		if (this.isLocalFileSave() || svg.length <= MAX_REQUEST_SIZE)
    		{
    	    	this.saveData(filename, 'svg', svg, 'image/svg+xml');
    		}
    		else
    		{
    			this.handleError({message: mxResources.get('drawingTooLarge')}, mxResources.get('error'), mxUtils.bind(this, function()
    			{
    				mxUtils.popup(svg);
    			}));
    		}
		});
		
		this.convertMath(this.editor.graph, svgRoot, false, mxUtils.bind(this, function()
		{
			if (embedImages)
			{
				this.convertImages(svgRoot, doSave);
			}
			else
			{
				doSave(svgRoot);
			}
		}));
	}
};

/**
 * Translates this point by the given vector.
 * 
 * @param {number} dx X-coordinate of the translation.
 * @param {number} dy Y-coordinate of the translation.
 */
App.prototype.getOrCreateVoiceButton = function()
{
	if (this.voiceButton == null)
	{
		this.voiceButton = document.createElement('div');
		this.voiceButton.className = 'geBtn';
		this.voiceButton.style.width = '140px';
		this.voiceButton.style.minWidth = '140px';
		this.voiceButton.style.textOverflow = 'ellipsis';
		this.voiceButton.style.overflowX = 'hidden';
		this.voiceButton.style.fontWeight = 'bold';
		this.voiceButton.style.textAlign = 'center';
		this.voiceButton.style.display = 'inline-block';
		this.voiceButton.style.padding = '0 10px 0 10px';
		this.voiceButton.style.marginTop = '-4px';
		this.voiceButton.style.height = '28px';
		this.voiceButton.style.lineHeight = '28px';
		this.voiceButton.style.color = '#235695';
		
		if (this.buttonContainer.firstChild != null)
		{
			this.buttonContainer.insertBefore(this.voiceButton, this.buttonContainer.firstChild);
		}
		else
		{
			this.buttonContainer.appendChild(this.voiceButton);
		}
	}
	
	return this.voiceButton;
};

/**
 * Translates this point by the given vector.
 * 
 * @param {number} dx X-coordinate of the translation.
 * @param {number} dy Y-coordinate of the translation.
 */
App.prototype.updateButtonContainer = function()
{
	if (this.buttonContainer != null)
	{
		var file = this.getCurrentFile();
		
		if (file != null && file.constructor == DriveFile)
		{
			// Adds Share button
			if (this.shareButton == null)
			{
				this.shareButton = document.createElement('div');
				this.shareButton.className = 'geBtn gePrimaryBtn';
				this.shareButton.style.display = 'inline-block';
				this.shareButton.style.padding = '0 10px 0 10px';
				this.shareButton.style.marginTop = '-4px';
				this.shareButton.style.height = '28px';
				this.shareButton.style.lineHeight = '28px';
				this.shareButton.style.minWidth = '0px';
				this.shareButton.style.cssFloat = 'right';
				
				var icon = document.createElement('img');
				icon.setAttribute('src', this.shareImage);
				icon.setAttribute('align', 'absmiddle');
				icon.style.marginRight = '4px';
				icon.style.marginTop = '-3px';
				this.shareButton.appendChild(icon);
				
				mxUtils.write(this.shareButton, mxResources.get('share'));
				
				mxEvent.addListener(this.shareButton, 'click', mxUtils.bind(this, function()
				{
					this.actions.get('share').funct();
				}));
				
				this.buttonContainer.appendChild(this.shareButton);
			} 
		}
		else if (this.shareButton != null)
		{
			this.shareButton.parentNode.removeChild(this.shareButton);
			this.shareButton = null;
		}
	}
};

/**
 * Translates this point by the given vector.
 * 
 * @param {number} dx X-coordinate of the translation.
 * @param {number} dy Y-coordinate of the translation.
 */
App.prototype.save = function(name, done)
{
	var file = this.getCurrentFile();
	var msg = mxResources.get('saving');
	
	if (file != null && file.constructor == DriveFile)
	{
		msg = mxResources.get('createRevision');
	}
	
	if (file != null && this.spinner.spin(document.body, msg))
	{
		this.editor.setStatus('');
		
		if (this.editor.graph.isEditing())
		{
			this.editor.graph.stopEditing();
		}
		
		var success = mxUtils.bind(this, function(resp)
		{
			this.spinner.stop();
			
			if (this.getCurrentFile() == file)
			{
				if (file.isModified())
				{
					if (!file.isAutosave())
					{
						file.addUnsavedStatus();
					}
				}
				else
				{
					this.editor.setStatus(mxResources.get('allChangesSaved'));
				}
			}
			
			if (done != null)
			{
				done();
			}
		});
		
		var error = mxUtils.bind(this, function(resp)
		{
			// Spinner is paused and resumed in handleError
			this.handleError(resp, (resp != null) ? mxResources.get('errorSavingFile') : null);
		});
		
		if (name == file.getTitle())
		{
			file.save(true, success, error);
		}
		else
		{
			file.saveAs(name, success, error)
		}
	}
};

/**
 * Translates this point by the given vector.
 * 
 * @param {number} dx X-coordinate of the translation.
 * @param {number} dy Y-coordinate of the translation.
 */
App.prototype.base64ToBlob = function(base64Data, contentType)
{
    contentType = contentType || '';
    var sliceSize = 1024;
    var byteCharacters = atob(base64Data);
    var bytesLength = byteCharacters.length;
    var slicesCount = Math.ceil(bytesLength / sliceSize);
    var byteArrays = new Array(slicesCount);

    for (var sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex)
    {
        var begin = sliceIndex * sliceSize;
        var end = Math.min(begin + sliceSize, bytesLength);

        var bytes = new Array(end - begin);
        
        for (var offset = begin, i = 0 ; offset < end; ++i, ++offset)
        {
            bytes[i] = byteCharacters[offset].charCodeAt(0);
        }
        
        byteArrays[sliceIndex] = new Uint8Array(bytes);
    }

    return new Blob(byteArrays, {type: contentType});
};

/**
 * Returns true if files should be saved using <saveLocalFile>.
 */
App.prototype.isLocalFileSave = function()
{
	return (urlParams['save'] != 'remote' && (mxClient.IS_IE ||
		(typeof window.Blob !== 'undefined' && typeof window.URL !== 'undefined')) &&
		document.documentMode != 9 && document.documentMode != 8 &&
		document.documentMode != 7 && !mxClient.IS_QUIRKS) ||
		this.isOfflineApp() || mxClient.IS_IOS;
};

/**
 * Translates this point by the given vector.
 * 
 * @param {number} dx X-coordinate of the translation.
 * @param {number} dy Y-coordinate of the translation.
 */
App.prototype.saveRequest = function(data, filename, format, fn)
{
	var allowTab = !mxClient.IS_IOS || !navigator.standalone;
	
	var dlg = new CreateDialog(this, filename, mxUtils.bind(this, function(newTitle, mode)
	{
		if (mode == '_blank' || newTitle != null && newTitle.length > 0)
		{
			var base64 = (mode == App.MODE_DEVICE || mode == null || mode == '_blank') ? '0' : '1';
			var xhr = fn((mode == '_blank') ? null : newTitle, base64);
			
			if (mode == App.MODE_DEVICE || mode == '_blank')
			{
				xhr.simulate(document, '_blank');
			}
			else
			{
				this.pickFolder(mode, mxUtils.bind(this, function(folderId)
				{
					if (this.spinner.spin(document.body, mxResources.get('saving')))
					{
						// LATER: Catch possible mixed content error
						// see http://stackoverflow.com/questions/30646417/catching-mixed-content-error
						xhr.send(mxUtils.bind(this, function()
						{
							this.spinner.stop();
							
							if (xhr.getStatus() < 200 || xhr.getStatus() > 299)
							{
								this.handleError({message: mxResources.get('errorSavingFile')});
							}
							else
							{
								try
								{
									var mimeType = (format == 'pdf') ? 'application/pdf' : 'image/' + format;
									this.exportFile(xhr.getText(), newTitle, mimeType, true, mode, folderId);
								}
								catch (e)
								{
									this.handleError(e);
								}
							}
						}), function(resp)
						{
							this.spinner.stop();
							this.handleError(resp);
						});
					}
				}));
			}
		}
	}), mxUtils.bind(this, function()
	{
		this.hideDialog();
	}), mxResources.get('saveAs'), mxResources.get('download'), false, false, allowTab);
	this.showDialog(dlg.container, 380, 270, true, true);
	dlg.init();
};

/**
 * Invokes callback with null if mode does not support folder or not null
 * if a valid folder was chosen for a mode that supports it. No callback
 * is made if no folder was chosen for a mode that supports it.
 */
App.prototype.pickFolder = function(mode, fn, enabled)
{
	enabled = (enabled != null) ? enabled : true;
	
	if (enabled && mode == App.MODE_GOOGLE && this.drive != null)
	{
		// Shows a save dialog
		this.drive.pickFolder(mxUtils.bind(this, function(evt)
		{
			if (evt.action == google.picker.Action.PICKED)
			{
				var folderId = null;
				
				if (evt.docs != null && evt.docs.length > 0 && evt.docs[0].type == 'folder')
				{
					folderId = evt.docs[0].id;
				}
				
				fn(folderId);
			}
		}));
	}
	else if (enabled && mode == App.MODE_ONEDRIVE && this.oneDrive != null)
	{
		this.oneDrive.pickFolder(mxUtils.bind(this, function(evt)
		{
			var folderId = null;
			
			if (evt != null && evt.data != null && evt.data.folders != null &&
				evt.data.folders.length > 0)
			{
				folderId = evt.data.folders[0].id;
        		folderId = folderId.substring(folderId.lastIndexOf('.') + 1);
        		fn(folderId);
			}
		}));
	}
	else
	{
		fn(null);
	}
};

/**
 * 
 */
App.prototype.exportFile = function(data, filename, mimeType, base64Encoded, mode, folderId)
{
	if (mode == App.MODE_DROPBOX)
	{
		if (this.dropbox != null && this.spinner.spin(document.body, mxResources.get('saving')))
		{
			// LATER: Add folder picker
			this.dropbox.insertFile(filename, (base64Encoded) ? this.base64ToBlob(data, mimeType) :
				data, mxUtils.bind(this, function()
			{
				this.spinner.stop();
			}), mxUtils.bind(this, function(resp)
			{
				this.spinner.stop();
				this.handleError(resp);
			}));
		}
	}
	else if (mode == App.MODE_GOOGLE)
	{
		if (this.drive != null && this.spinner.spin(document.body, mxResources.get('saving')))
		{
			this.drive.insertFile(filename, data, folderId, mxUtils.bind(this, function(resp)
			{
				// TODO: Add callback with url param for clickable status message
				// "File exported. Click here to open folder."
//				this.editor.setStatus('<div class="geStatusMessage" style="cursor:pointer;">' +
//					mxResources.get('saved') + '</div>');
//				
//				// Installs click handler for opening
//				if (this.statusContainer != null)
//				{
//					var links = this.statusContainer.getElementsByTagName('div');
//					
//					if (links.length > 0)
//					{
//						mxEvent.addListener(links[0], 'click', mxUtils.bind(this, function()
//						{
//							if (resp != null && resp.parents != null && resp.parents.length > 0)
//							{
//								var id = resp.parents[0].id;
//								
//								if (id != null)
//								{
//									window.open('https://drive.google.com/drive/folders/' + id);
//								}
//							}
//						}));
//					}
//				}
					
				this.spinner.stop();
			}), mxUtils.bind(this, function(resp)
			{
				this.spinner.stop();
				this.handleError(resp);
			}), mimeType, base64Encoded, false);
		}
	}
	else if (mode == App.MODE_ONEDRIVE)
	{
		if (this.oneDrive != null && this.spinner.spin(document.body, mxResources.get('saving')))
		{
			// KNOWN: OneDrive does not show .svg extension
			this.oneDrive.insertFile(filename, (base64Encoded) ? this.base64ToBlob(data, mimeType) :
				data, mxUtils.bind(this, function()
			{
				this.spinner.stop();
			}), mxUtils.bind(this, function(resp)
			{
				this.spinner.stop();
				this.handleError(resp);
			}), false, folderId);
		}
	}
};

/**
 * Translates this point by the given vector.
 * 
 * @param {number} dx X-coordinate of the translation.
 * @param {number} dy Y-coordinate of the translation.
 */
App.prototype.doSaveLocalFile = function(data, filename, mimeType, base64Encoded)
{
	// Newer versions of IE
	if (window.MSBlobBuilder && navigator.msSaveOrOpenBlob)
	{
		var builder = new MSBlobBuilder();
		builder.append(data);
		var blob = builder.getBlob(mimeType);
		navigator.msSaveOrOpenBlob(blob, filename);
	}
	// Older versions of IE (binary not supported)
	else if (mxClient.IS_IE)
	{
		var win = window.open('about:blank', '_blank');
		
		if (win == null)
		{
			mxUtils.popup(data, true);
		}
		else
		{
			win.document.write(data);
			win.document.close();
			win.document.execCommand('SaveAs', true, filename);
			win.close();
		}
	}
	else if (mxClient.IS_IOS)
	{
		// Poor man's saveAs in iOS via context menu of selected output
    	var dlg = new TextareaDialog(this, filename + ':', data, null, null, mxResources.get('close'));
    	dlg.textarea.style.width = '600px';
    	dlg.textarea.style.height = '380px';
		this.showDialog(dlg.container, 620, 460, true, true);
		dlg.init();
		document.execCommand('selectall', false, null);
	}
	else if (!this.isOffline() && mxClient.IS_SF)
	{
		var param = (typeof(pako) === 'undefined') ? '&xml=' + encodeURIComponent(data) :
			'&data=' + encodeURIComponent(this.editor.graph.compress(data));
		
		new mxXmlRequest(SAVE_URL, 'mime=' + mimeType + '&filename=' +
			encodeURIComponent(filename) +
			param).simulate(document, '_blank');
	}
	else
	{
		var a = document.createElement('a');
		a.href = URL.createObjectURL((base64Encoded) ?
			this.base64ToBlob(data, mimeType) :
			new Blob([data], {type: mimeType}));
		a.download = filename;
		document.body.appendChild(a);
		
		// Workaround for link opens in same window in Safari
		if (mxClient.IS_SF)
		{
			a.setAttribute('target', '_blank');
		}
		
		try
		{
			a.click();
			
			window.setTimeout(function()
			{
				URL.revokeObjectURL(a.href);
			}, 0);
			a.parentNode.removeChild(a);
		}
		catch (e)
		{
			// ignore
		}
	}
};

/**
 * Translates this point by the given vector.
 * 
 * @param {number} dx X-coordinate of the translation.
 * @param {number} dy Y-coordinate of the translation.
 */
App.prototype.saveLocalFile = function(data, filename, mimeType, base64Encoded)
{
	if (this.isOfflineApp() || this.isOffline())
	{
		this.doSaveLocalFile(data, filename, mimeType, base64Encoded);
	}
	else
	{
		var allowTab = !mxClient.IS_IOS || !navigator.standalone;
		
		var dlg = new CreateDialog(this, filename, mxUtils.bind(this, function(newTitle, mode)
		{
			try
			{
				// Opens a new window
				if (mode == '_blank')
				{
					// Workaround for "Access denied" after URL.createObjectURL
					// and blank window for window.open with data URI in MS Edge
					// and empty window for IE 11 and 10
					if (mxClient.IS_EDGE || document.documentMode == 11 || document.documentMode == 10)
					{
			    		var param = (typeof(pako) === 'undefined') ? '&xml=' + encodeURIComponent(data) :
			    			'&data=' + encodeURIComponent(this.editor.graph.compress(data));
			    		
			    		new mxXmlRequest(SAVE_URL, 'mime=' + mimeType + param).simulate(document, '_blank');
					}
					else
					{
						// Cannot use URL.createObjectURL since it kills gradients in FF
						window.open('data:' + mimeType + ((base64Encoded) ? ';base64,' +
							data : ';charset=utf8,' + encodeURIComponent(data)));
					}
				}
				else if (mode == App.MODE_DEVICE)
				{
					this.doSaveLocalFile(data, newTitle, mimeType, base64Encoded);
				} 
				else if (newTitle != null && newTitle.length > 0)
				{
					this.pickFolder(mode, mxUtils.bind(this, function(folderId)
					{
						this.exportFile(data, newTitle, mimeType, base64Encoded, mode, folderId);
					}));
				}
			}
			catch (e)
			{
				this.handleError(e);
			}
		}), mxUtils.bind(this, function()
		{
			this.hideDialog();
		}), mxResources.get('saveAs'), mxResources.get('download'), false, false, allowTab);
		this.showDialog(dlg.container, 380, 280, true, true);
		dlg.init();
	}
};

/**
 * 
 */
App.prototype.getHtml = function(node, graph, title, editLink, redirect, ignoreSelection)
{
	ignoreSelection = (ignoreSelection != null) ? ignoreSelection : true;
	var bg = null;
	var js = 'https://www.draw.io/js/embed-static.min.js';
	var s = '';

	// LATER: Merge common code with EmbedDialog
	if (graph != null)
	{
		var bounds = (ignoreSelection) ? graph.getGraphBounds() : graph.getBoundingBox(graph.getSelectionCells());
		var scale = graph.view.scale;
		var x0 = Math.floor(bounds.x / scale - graph.view.translate.x);
		var y0 = Math.floor(bounds.y / scale - graph.view.translate.y);
		bg = graph.background;

		// Embed script only used if no redirect
		if (redirect == null)
		{
			var stencilNames = new Object();
			var states = this.editor.graph.view.states.getValues();
			
			// Scans shapes for stencils
			for (var i = 0; i < states.length; i++)
			{
				var state = states[i];
				var shape = state.style[mxConstants.STYLE_SHAPE];
				var base = mxStencilRegistry.getBasenameForStencil(shape);
				
				if (base != null)
				{
					if (stencilNames[base] == null)
					{
						stencilNames[base] = true;
						s += base + ';';
					}
				}
			}
			
			if (s.length > 0)
			{
				js = 'https://www.draw.io/embed.js?s=' + s.substring(0, s.length - 1);
			}
		}
		
		// Adds embed attributes
		node.setAttribute('x0', x0);
		node.setAttribute('y0', y0);
	}
	
	if (node != null)
	{
		node.setAttribute('pan', '1');
		node.setAttribute('zoom', '1');
		node.setAttribute('resize', '0');
		node.setAttribute('fit', '0');
		node.setAttribute('border', '20');
		
		// Hidden attributes
		node.setAttribute('links', '1');
		
		if (editLink != null)
		{
			node.setAttribute('edit', editLink);
		}
	}
	
	// Makes XHTML compatible
	if (redirect != null)
	{
		redirect = redirect.replace(/&/g, '&amp;');
	}

	// Removes control chars in input for correct roundtrip check
	var text = (node != null) ? this.editor.graph.zapGremlins(mxUtils.getXml(node)) : '';
	
	// Double compression for mxfile not fixed since it may cause imcompatibilites with
	// embed clients that rely on this format. HTML files and export use getHtml2.
	var data = this.editor.graph.compress(text);
	
	// Fallback to URI encoded XML for invalid compression
	if (this.editor.graph.decompress(data) != text)
	{
		data = encodeURIComponent(text);
	}
	
	var style = 'position:relative;overflow:auto;width:100%;';

	return ((redirect == null) ? '<!--[if IE]><meta http-equiv="X-UA-Compatible" content="IE=5,IE=9" ><![endif]-->\n' : '') +
		'<!DOCTYPE html>\n<html' + ((redirect != null) ? ' xmlns="http://www.w3.org/1999/xhtml">' : '>') +
		'\n<head>\n' + ((redirect == null) ? ((title != null) ? '<title>' + mxUtils.htmlEntities(title) +
			'</title>\n' : '') : '<title>Draw.io Diagram</title>\n') +
		((redirect != null) ? '<meta http-equiv="refresh" content="0;URL=\'' + redirect + '\'"/>\n' : '') +
		'</head>\n<body' +
		(((redirect == null && bg != null && bg != mxConstants.NONE) ? ' style="background-color:' + bg + ';">' : '>')) +
		'\n<div class="mxgraph" style="' + style + '">\n' +
		'<div style="width:1px;height:1px;overflow:hidden;">' + data + '</div>\n</div>\n' +
		((redirect == null) ? '<script type="text/javascript" src="' + js + '"></script>' :
		'<a style="position:absolute;top:50%;left:50%;margin-top:-128px;margin-left:-64px;" ' +
		'href="' + redirect + '" target="_blank"><img border="0" ' +
		'src="https://www.draw.io/images/drawlogo128.png"/></a>') +
		'\n</body>\n</html>\n';
};

/**
 * Same as above but using the new embed code.
 */
App.prototype.getHtml2 = function(node, graph, title, editLink, redirect, ignoreSelection)
{
	ignoreSelection = (ignoreSelection != null) ? ignoreSelection : true;
	var bg = null;
	var js = 'https://www.draw.io/js/viewer.min.js';
	var s = '';

	// LATER: Merge common code with EmbedDialog
	if (graph != null)
	{
		// Embed script only used if no redirect
		if (redirect == null)
		{
			var s = [];
			
			// Scans shapes for stencils
			var stencilNames = new Object();
			var states = graph.view.states.getValues();
			
			function addName(name)
			{
				if (name != null)
				{
					var dot = name.lastIndexOf('.');
					
					if (dot > 0)
					{
						name = name.substring(dot + 1, name.length);
					}
					
					if (stencilNames[name] == null)
					{
						stencilNames[name] = true;
						s.push(name);
					}
				}
			}
			
			for (var i = 0; i < states.length; i++)
			{
				var state = states[i];
				var shape = state.style[mxConstants.STYLE_SHAPE];
				addName(mxStencilRegistry.getBasenameForStencil(shape));
				
				// Adds package names for markers in edges
				if (state.view.graph.model.isEdge(state.cell))
				{
					addName(mxMarker.getPackageForType(state.style[mxConstants.STYLE_STARTARROW]));
					addName(mxMarker.getPackageForType(state.style[mxConstants.STYLE_ENDARROW]));
				}
			}
			
			if (s.length > 0)
			{
				js = 'https://www.draw.io/embed2.js?s=' + s.join(';');
			}
		}
	}

	// Makes XHTML compatible
	if (redirect != null)
	{
		redirect = redirect.replace(/&/g, '&amp;');
	}
	
	var data = {highlight: '#0000ff', nav: this.editor.graph.foldingEnabled, resize: true,
		xml: this.editor.graph.zapGremlins(mxUtils.getXml(node)), toolbar: 'zoom layers lightbox'};

	var style = 'max-width:100%;border:1px solid transparent;';

	return ((redirect == null) ? '<!--[if IE]><meta http-equiv="X-UA-Compatible" content="IE=5,IE=9" ><![endif]-->\n' : '') +
		'<!DOCTYPE html>\n<html' + ((redirect != null) ? ' xmlns="http://www.w3.org/1999/xhtml">' : '>') +
		'\n<head>\n' + ((redirect == null) ? ((title != null) ? '<title>' + mxUtils.htmlEntities(title) +
			'</title>\n' : '') : '<title>Draw.io Diagram</title>\n') +
		((redirect != null) ? '<meta http-equiv="refresh" content="0;URL=\'' + redirect + '\'"/>\n' : '') +
		'<meta charset="utf-8"/>\n</head>\n<body>' +
		'\n<div class="mxgraph" style="' + style + '" data-mxgraph="' + mxUtils.htmlEntities(JSON.stringify(data)) + '"></div>\n' +
		((redirect == null) ? '<script type="text/javascript" src="' + js + '"></script>' :
		'<a style="position:absolute;top:50%;left:50%;margin-top:-128px;margin-left:-64px;" ' +
		'href="' + redirect + '" target="_blank"><img border="0" ' +
		'src="https://www.draw.io/images/drawlogo128.png"/></a>') +
		'\n</body>\n</html>\n';
};

/**
 * Translates this point by the given vector.
 * 
 * @param {number} dx X-coordinate of the translation.
 * @param {number} dy Y-coordinate of the translation.
 */
App.prototype.saveData = function(filename, format, data, mime)
{
	if (this.isLocalFileSave())
	{
		this.saveLocalFile(data, filename, mime);
	}
	else
	{
		this.saveRequest(data, filename, format, mxUtils.bind(this, function(newTitle, base64)
		{
    		var param = (typeof(pako) === 'undefined') ? '&xml=' + encodeURIComponent(data) :
    			'&data=' + encodeURIComponent(this.editor.graph.compress(data));
    		
    		return new mxXmlRequest(SAVE_URL, 'format=' + format + ((newTitle != null) ?
				'&filename=' + encodeURIComponent(newTitle) : '') + param);
		}));
	}
};

/**
 * Translates this point by the given vector.
 * 
 * @param {number} dx X-coordinate of the translation.
 * @param {number} dy Y-coordinate of the translation.
 */
App.prototype.downloadFile = function(format, nonCompressed, addShadow, ignoreSelection)
{
	try
	{
		var file = this.getCurrentFile();
		ignoreSelection = (ignoreSelection != null) ? ignoreSelection : this.editor.graph.isSelectionEmpty();
		// LATER: Double URI encoding for needed for newlines in simulate (truncates body otherwise).
		var basename = (file != null && file.getTitle() != null) ? file.getTitle() : this.defaultFilename;
		
		if (/(\.xml)$/i.test(basename) || /(\.html)$/i.test(basename) || /(\.svg)$/i.test(basename))
		{
			basename = basename.substring(0, basename.lastIndexOf('.'));
		}
		
		var filename = basename + '.' + format;
		
		if (format == 'xml')
		{
	    	var data = '<?xml version="1.0" encoding="UTF-8"?>\n' +
	    		((nonCompressed) ? mxUtils.getXml(this.editor.getGraphXml(ignoreSelection)) :
	    			this.getFileData(true, null, null, null, ignoreSelection));
	    	
	    	this.saveData(filename, format, data, 'text/xml');
		}
	    else if (format == 'html')
	    {
	    	var data = this.getHtml2(this.editor.getGraphXml(ignoreSelection),
	    		this.editor.graph, basename, null, null, ignoreSelection);
	    	this.saveData(filename, format, data, 'text/html');
	    }
	    else if ((format == 'svg' || format == 'xmlsvg') && this.spinner.spin(document.body, mxResources.get('export')))
	    {
	    	var svg = null;
	    	
	    	var saveSvg = mxUtils.bind(this, function(data)
	    	{
	    		if (data.length <= MAX_REQUEST_SIZE)
	    		{
	    	    	this.saveData(filename, 'svg', data, 'image/svg+xml');
	    		}
	    		else
	    		{
	    			this.handleError({message: mxResources.get('drawingTooLarge')}, mxResources.get('error'), mxUtils.bind(this, function()
	    			{
	    				mxUtils.popup(svg);
	    			}));
	    		}
	    	});
	    	
	    	if (format == 'svg')
	    	{
	        	var bg = this.editor.graph.background;
	        	
	        	if (bg == mxConstants.NONE)
	        	{
	        		bg = null;
	        	}
	
	        	// Sets or disables alternate text for foreignObjects. Disabling is needed
	        	// because PhantomJS seems to ignore switch statements and paint all text.
	        	var svgRoot = this.editor.graph.getSvg(bg, null, null, false, null, ignoreSelection);
				
				if (addShadow)
				{
					this.editor.addSvgShadow(svgRoot);
				}
				
				// Embeds the images in the SVG output (async)
				this.convertImages(svgRoot, mxUtils.bind(this, mxUtils.bind(this, function(svgRoot2)
				{
					this.spinner.stop();
					
					saveSvg('<?xml version="1.0" encoding="UTF-8"?>\n' +
						'<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">\n' +
						mxUtils.getXml(svgRoot2));
				})));
	    	}
	    	else
	    	{
	    		filename = basename + '.svg';
	    		svg = this.getFileData(false, true, null, mxUtils.bind(this, function(svg)
	    		{
	    			this.spinner.stop();
	        		saveSvg(svg);    			
	    		}), ignoreSelection);
	    	}
	    }
		else
		{
			var bounds = this.editor.graph.getGraphBounds();
			var data = this.getFileData(true, null, null, null, ignoreSelection);
			
			if (bounds.width * bounds.height <= MAX_AREA && data.length <= MAX_REQUEST_SIZE)
			{
				var embed = '0';
		       	
		       	if (format == 'xmlpng')
		       	{
		       		embed = '1';
		       		format = 'png';
		       		filename = basename + '.' + format;
		       	}
		       	
				this.saveRequest(data, filename, format, function(newTitle, base64)
				{
					return new mxXmlRequest(EXPORT_URL, 'format=' + format +
						'&base64=' + base64 + '&embedXml=' + embed + '&xml=' +
						encodeURIComponent(data) + ((newTitle != null) ?
						'&filename=' + encodeURIComponent(newTitle) : ''));
				});
			}
			else
			{
				this.handleError({message: mxResources.get('drawingTooLarge')}, mxResources.get('error'));
			}
		}
	}
	catch (e)
	{
		this.handleError(e);
	}
};

/**
 * Translates this point by the given vector.
 * 
 * @param {number} dx X-coordinate of the translation.
 * @param {number} dy Y-coordinate of the translation.
 */
App.prototype.formatFileSize = function(size)
{
    var units = [' kB', ' MB', ' GB', ' TB', 'PB', 'EB', 'ZB', 'YB'];
	var i = -1;
    do
    {
    	size = size / 1024;
        i++;
    } while (size > 1024);

    return Math.max(size, 0.1).toFixed(1) + units[i];
};

/**
 * Translates this point by the given vector.
 * 
 * @param {number} dx X-coordinate of the translation.
 * @param {number} dy Y-coordinate of the translation.
 */
App.prototype.descriptorChanged = function()
{
	var file = this.getCurrentFile();
	
	if (file != null)
	{
		if (this.fname != null)
		{
			this.fnameWrapper.style.display = 'block';
			this.fname.innerHTML = '';
			var filename = (file.getTitle() != null) ? file.getTitle() : this.defaultFilename;
			mxUtils.write(this.fname, filename);
			this.fname.setAttribute('title', filename + ' - ' + mxResources.get('rename'));
		}
		
		this.editor.graph.setEnabled(file.isEditable());
		
		// Ignores title and hash for revisions
		if (urlParams['rev'] == null)
		{
			this.updateDocumentTitle();
			
			var newHash = file.getHash();
			
			if (newHash.length > 0)
			{
				window.location.hash = newHash;
			}
			else if (window.location.hash.length > 0)
			{
				window.location.hash = '';
			}
		}
	}
};

/**
 * Translates this point by the given vector.
 * 
 * @param {number} dx X-coordinate of the translation.
 * @param {number} dy Y-coordinate of the translation.
 */
App.prototype.handleError = function(resp, title, fn)
{
	var resume = this.spinner.pause();
	var e = (resp != null && resp.error != null) ? resp.error : resp;

	if (e != null || title != null)
	{
		var msg = mxResources.get('unknownError');
		var btn = mxResources.get('ok');
		var retry = null;
		title = (title != null) ? title : mxResources.get('error');
		
		if (e != null)
		{
			if (typeof(gapi) != 'undefined' && typeof(gapi.drive) != 'undefined' && typeof(gapi.drive.realtime) != 'undefined' &&
				e.type == gapi.drive.realtime.ErrorType.FORBIDDEN)
			{
				msg = mxResources.get('forbidden');
			}
			else if (e.code == 404 || e.status == 404 || (typeof(gapi) != 'undefined' && typeof(gapi.drive) != 'undefined' &&
					typeof(gapi.drive.realtime) != 'undefined' && e.type == gapi.drive.realtime.ErrorType.NOT_FOUND))
			{
				msg = mxResources.get('fileNotFoundOrDenied');
				var id = window.location.hash;
				
				if (id != null && id.substring(0, 2) == '#G')
				{
					id = id.substring(2);
					msg += ' <a href="https://drive.google.com/open?id=' + id + '" target="_blank">' +
						mxResources.get('tryOpeningViaThisPage') + '</a>';
				}
			}
			else if (e.code == App.ERROR_TIMEOUT)
			{
				msg = mxResources.get('timeout');
				
				if (e.retry != null)
				{
					btn = mxResources.get('cancel');
					retry = function()
					{
						resume();
						e.retry();
					};
				}
			}
			else if (e.code == App.ERROR_BUSY)
			{
				msg = mxResources.get('busy');
			}
			else if (e.message != null)
			{
				msg = e.message;
			}
			else if (e.response != null && e.response.error != null)
			{
				msg = e.response.error;
			}
		}

		this.showError(title, msg, btn, fn, retry);
	}
	else if (fn != null)
	{
		fn();
	}
};

/**
 * Translates this point by the given vector.
 * 
 * @param {number} dx X-coordinate of the translation.
 * @param {number} dy Y-coordinate of the translation.
 */
App.prototype.showError = function(title, msg, btn, fn, retry, btn2, fn2)
{
	var dlg = new ErrorDialog(this, title, msg, btn, fn, retry, btn2, fn2);
	this.showDialog(dlg.container, 340, 150, true, false);
	dlg.init();
};

/**
 * Translates this point by the given vector.
 * 
 * @param {number} dx X-coordinate of the translation.
 * @param {number} dy Y-coordinate of the translation.
 */
App.prototype.alert = function(msg, fn)
{
	var dlg = new ErrorDialog(this, null, msg, mxResources.get('ok'), fn);
	this.showDialog(dlg.container, 340, 100, true, false);
	dlg.init();
};

/**
 * Translates this point by the given vector.
 * 
 * @param {number} dx X-coordinate of the translation.
 * @param {number} dy Y-coordinate of the translation.
 */
App.prototype.confirm = function(msg, okFn, cancelFn)
{
	var resume = (this.spinner.pause != null) ? this.spinner.pause() : function() {};
	
	this.showDialog(new ConfirmDialog(this, msg, function()
	{
		resume();
		
		if (okFn != null)
		{
			okFn();
		}
	}, function()
	{
		resume();
		
		if (cancelFn != null)
		{
			cancelFn();
		}
	}).container, 340, 90, true, false);	
};

/**
 * Translates this point by the given vector.
 * 
 * @param {number} dx X-coordinate of the translation.
 * @param {number} dy Y-coordinate of the translation.
 */
App.prototype.toggleChat = function()
{
	var file = this.getCurrentFile();
	
	if (file != null)
	{
		if (file.chatWindow == null)
		{
			var cwLeft = document.body.offsetWidth - 300;
			file.chatWindow = new ChatWindow(this, mxResources.get('chatWindowTitle'), document.getElementById('geChat'), cwLeft , 80, 250, 350, file.realtime);
			file.chatWindow.window.setVisible(false);
		}
		
		file.chatWindow.window.setVisible(!file.chatWindow.window.isVisible());
	}
};

/**
 * Translates this point by the given vector.
 * 
 * @param {number} dx X-coordinate of the translation.
 * @param {number} dy Y-coordinate of the translation.
 */
App.prototype.status = function(html)
{
	this.editor.setStatus(html);
};

/**
 * Adds the listener for automatically saving the diagram for local changes.
 */
App.prototype.showAuthDialog = function(peer, showRememberOption, fn)
{
	var resume = this.spinner.pause();
	
	this.showDialog(new AuthDialog(this, peer, showRememberOption, mxUtils.bind(this, function(remember)
	{
		try
		{
			if (fn != null)
			{
				fn(remember, function()
				{
					resume();
				});
			}
		}
		catch (e)
		{
			this.editor.setStatus(e.message);
		}
	})).container, 300, (showRememberOption) ? 180 : 140, true, true, mxUtils.bind(this, function(cancel)
	{
		if (cancel && this.getCurrentFile() == null && this.dialog == null)
		{
			this.showSplash();
		}
	}));
};

/**
 * Checks if the client is authorized and calls the next step.
 */
App.prototype.loadUrl = function(url, success, error, forceBinary, retry)
{
	try
	{
		var binary = (forceBinary || /(\.png)($|\?)/i.test(url));
		retry = (retry != null) ? retry : true;
		
		var fn = mxUtils.bind(this, function()
		{
			mxUtils.get(url, mxUtils.bind(this, function(req)
			{
				if (req.getStatus() == 200)
				{
			    	if (success != null)
			    	{
				    	var data = req.getText();
				    	
			    		// Returns PNG as base64 encoded data URI
						if (binary)
						{
							// NOTE: This requires BinaryToArray VB script in the page
							if ((document.documentMode == 9 || document.documentMode == 10) &&
								typeof window.mxUtilsBinaryToArray !== 'undefined')
							{
								var bin = mxUtilsBinaryToArray(req.request.responseBody).toArray();
								var tmp = new Array(bin.length);
								
								for (var i = 0; i < bin.length; i++)
								{
									tmp[i] = String.fromCharCode(bin[i]);
								}
								
								data = tmp.join('');
							}
							
							data = 'data:image/png;base64,' + this.base64Encode(data);
						}
			    		
			    		success(data);
			    	}
				}
				else if (error != null)
		    	{
		    		error({code: App.ERROR_UNKNOWN});
		    	}
			}), function()
			{
		    	if (error != null)
		    	{
		    		error({code: App.ERROR_UNKNOWN});
		    	}
			}, binary, this.timeout, function()
		    {
		    	if (retry && error != null)
				{
					error({code: App.ERROR_TIMEOUT, retry: fn});
				}
		    });
		});
		
		fn();
	}
	catch (e)
	{
		if (error != null)
		{
			error(e);
		}
	}
};

/**
 * Adds the listener for automatically saving the diagram for local changes.
 */ 
App.prototype.updateHeader = function()
{
	if (this.menubar != null)
	{
		this.appIcon = document.createElement('a');
		this.appIcon.style.display = 'block';
		this.appIcon.style.position = 'absolute';
		this.appIcon.style.width = '40px';
		this.appIcon.style.backgroundColor = '#f18808';
		this.appIcon.style.height = this.menubarHeight + 'px';
		
		mxEvent.disableContextMenu(this.appIcon);
		
		mxEvent.addListener(this.appIcon, 'click', mxUtils.bind(this, function(evt)
		{
			this.appIconClicked(evt);
		}));
		
		// LATER: Use Alpha image loader in IE6
		// NOTE: This uses the diagram bit of the old logo as it looks better in this case
		//this.appIcon.style.filter = 'progid:DXImageTransform.Microsoft.AlphaImageLoader(src=' + IMAGE_PATH + '/logo-white.png,sizingMethod=\'scale\')';
		var logo = (!mxClient.IS_SVG) ? 'url(\'' + IMAGE_PATH + '/logo-white.png\')' :
			'url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+CjxzdmcKICAgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIgogICB4bWxuczpjYz0iaHR0cDovL2NyZWF0aXZlY29tbW9ucy5vcmcvbnMjIgogICB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiCiAgIHhtbG5zOnN2Zz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciCiAgIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIKICAgeG1sOnNwYWNlPSJwcmVzZXJ2ZSIKICAgZW5hYmxlLWJhY2tncm91bmQ9Im5ldyAwIDAgMzA2LjE4NSAxMjAuMjk2IgogICB2aWV3Qm94PSIyNCAyNiA2OCA2OCIKICAgeT0iMHB4IgogICB4PSIwcHgiCiAgIHZlcnNpb249IjEuMSI+CiAgIAkgPGc+PGxpbmUKICAgICAgIHkyPSI3Mi4zOTQiCiAgICAgICB4Mj0iNDEuMDYxIgogICAgICAgeTE9IjQzLjM4NCIKICAgICAgIHgxPSI1OC4wNjkiCiAgICAgICBzdHJva2UtbWl0ZXJsaW1pdD0iMTAiCiAgICAgICBzdHJva2Utd2lkdGg9IjMuNTUyOCIKICAgICAgIHN0cm9rZT0iI0ZGRkZGRiIKICAgICAgIGZpbGw9Im5vbmUiIC8+PGxpbmUKICAgICAgIHkyPSI3Mi4zOTQiCiAgICAgICB4Mj0iNzUuMDc2IgogICAgICAgeTE9IjQzLjM4NCIKICAgICAgIHgxPSI1OC4wNjgiCiAgICAgICBzdHJva2UtbWl0ZXJsaW1pdD0iMTAiCiAgICAgICBzdHJva2Utd2lkdGg9IjMuNTAwOCIKICAgICAgIHN0cm9rZT0iI0ZGRkZGRiIKICAgICAgIGZpbGw9Im5vbmUiIC8+PGc+PHBhdGgKICAgICAgICAgZD0iTTUyLjc3Myw3Ny4wODRjMCwxLjk1NC0xLjU5OSwzLjU1My0zLjU1MywzLjU1M0gzNi45OTljLTEuOTU0LDAtMy41NTMtMS41OTktMy41NTMtMy41NTN2LTkuMzc5ICAgIGMwLTEuOTU0LDEuNTk5LTMuNTUzLDMuNTUzLTMuNTUzaDEyLjIyMmMxLjk1NCwwLDMuNTUzLDEuNTk5LDMuNTUzLDMuNTUzVjc3LjA4NHoiCiAgICAgICAgIGZpbGw9IiNGRkZGRkYiIC8+PC9nPjxnCiAgICAgICBpZD0iZzM0MTkiPjxwYXRoCiAgICAgICAgIGQ9Ik02Ny43NjIsNDguMDc0YzAsMS45NTQtMS41OTksMy41NTMtMy41NTMsMy41NTNINTEuOTg4Yy0xLjk1NCwwLTMuNTUzLTEuNTk5LTMuNTUzLTMuNTUzdi05LjM3OSAgICBjMC0xLjk1NCwxLjU5OS0zLjU1MywzLjU1My0zLjU1M0g2NC4yMWMxLjk1NCwwLDMuNTUzLDEuNTk5LDMuNTUzLDMuNTUzVjQ4LjA3NHoiCiAgICAgICAgIGZpbGw9IiNGRkZGRkYiIC8+PC9nPjxnPjxwYXRoCiAgICAgICAgIGQ9Ik04Mi43NTIsNzcuMDg0YzAsMS45NTQtMS41OTksMy41NTMtMy41NTMsMy41NTNINjYuOTc3Yy0xLjk1NCwwLTMuNTUzLTEuNTk5LTMuNTUzLTMuNTUzdi05LjM3OSAgICBjMC0xLjk1NCwxLjU5OS0zLjU1MywzLjU1My0zLjU1M2gxMi4yMjJjMS45NTQsMCwzLjU1MywxLjU5OSwzLjU1MywzLjU1M1Y3Ny4wODR6IgogICAgICAgICBmaWxsPSIjRkZGRkZGIiAvPjwvZz48L2c+PC9zdmc+)';
		this.appIcon.style.backgroundImage = logo;		
		this.appIcon.style.backgroundPosition = 'center center';
		this.appIcon.style.backgroundRepeat = 'no-repeat';
		
		mxUtils.setPrefixedStyle(this.appIcon.style, 'transition', 'all 125ms linear');
	
		mxEvent.addListener(this.appIcon, 'mouseover', mxUtils.bind(this, function()
		{
			var file = this.getCurrentFile();
			
			if (file != null)
			{
				var mode = file.getMode();
				
				if (mode == App.MODE_GOOGLE)
				{
					this.appIcon.style.backgroundImage = 'url(' + IMAGE_PATH + '/google-drive-logo-white.svg)';
				}
				else if (mode == App.MODE_DROPBOX)
				{
					this.appIcon.style.backgroundImage = 'url(' + IMAGE_PATH + '/dropbox-logo-white.svg)';
				}
				else if (mode == App.MODE_ONEDRIVE)
				{
					this.appIcon.style.backgroundImage = 'url(' + IMAGE_PATH + '/onedrive-logo-white.svg)';
				}
			}
		}));
		
		mxEvent.addListener(this.appIcon, 'mouseout', mxUtils.bind(this, function()
		{
			this.appIcon.style.backgroundImage = logo;
		}));
		
		if (urlParams['embed'] != '1')
		{
			this.menubarContainer.appendChild(this.appIcon);
		}
	
		this.fnameWrapper = document.createElement('div');
		this.fnameWrapper.style.position = 'absolute';
		this.fnameWrapper.style.right = '120px';
		this.fnameWrapper.style.left = '50px';
		this.fnameWrapper.style.top = '6px';
		this.fnameWrapper.style.height = '26px';
		this.fnameWrapper.style.display = 'none';
		this.fnameWrapper.style.overflow = 'hidden';
		this.fnameWrapper.style.textOverflow = 'ellipsis';
		
		this.fname = document.createElement('a');
		this.fname.setAttribute('href', 'javascript:void(0);');
		this.fname.setAttribute('title', mxResources.get('rename'));
		this.fname.className = 'geItem';
		this.fname.style.padding = '2px 8px 2px 8px';
		this.fname.style.display = 'inline';
		this.fname.style.fontSize = '18px';
		this.fname.style.whiteSpace = 'nowrap';
		
		mxEvent.addListener(this.fname, 'click', mxUtils.bind(this, function(evt)
		{
			var file = this.getCurrentFile();
			
			if (file != null && file.isRenamable())
			{
				this.actions.get('rename').funct();
			}
			
			mxEvent.consume(evt);
		}));
		
		this.fnameWrapper.appendChild(this.fname);
		
		if (urlParams['embed'] != '1')
		{
			this.menubarContainer.appendChild(this.fnameWrapper);
		
			this.menubar.container.style.position = 'absolute';
			this.menubar.container.style.paddingLeft = '52px';
			this.menubar.container.style.boxSizing = 'border-box';
			this.menubar.container.style.top = '29px';
			
			this.toolbar.container.style.paddingLeft = '56px';
		}
		
		/**
		 * Adds format panel toggle.
		 */
		this.toggleFormatElement = document.createElement('a');
		this.toggleFormatElement.setAttribute('href', 'javascript:void(0);');
		this.toggleFormatElement.setAttribute('title', mxResources.get('formatPanel') + ' (Ctrl+Shift+P)');
		this.toggleFormatElement.style.position = 'absolute';
		this.toggleFormatElement.style.display = 'inline-block';
		this.toggleFormatElement.style.top = '5px';
		this.toggleFormatElement.style.right = '26px';
		this.toggleFormatElement.style.padding = '2px';
		this.toggleFormatElement.style.fontSize = '14px';
		this.toggleFormatElement.className = (uiTheme != 'atlas') ? 'geButton' : '';
		this.toggleFormatElement.style.width = '16px';
		this.toggleFormatElement.style.height = '16px';
		this.toggleFormatElement.style.backgroundPosition = '50% 50%';
		this.toggleFormatElement.style.backgroundRepeat = 'no-repeat';
		this.toolbarContainer.appendChild(this.toggleFormatElement);

		mxEvent.addListener(this.toggleFormatElement, 'click', this.actions.get('formatPanel').funct);

		var toggleFormatPanel = mxUtils.bind(this, function()
		{
			if (this.formatWidth > 0)
			{
				this.toggleFormatElement.style.backgroundImage = 'url(\'' + this.formatShowImage + '\')';
			}
			else
			{
				this.toggleFormatElement.style.backgroundImage = 'url(\'' + this.formatHideImage + '\')';
			}
		});
		
		this.addListener('formatWidthChanged', toggleFormatPanel);
		toggleFormatPanel();

		this.fullscreenElement = document.createElement('a');
		this.fullscreenElement.setAttribute('href', 'javascript:void(0);');
		this.fullscreenElement.setAttribute('title', mxResources.get('fullscreen'));
		this.fullscreenElement.style.position = 'absolute';
		this.fullscreenElement.style.display = 'inline-block';
		this.fullscreenElement.style.top = '5px';
		this.fullscreenElement.style.right = '42px';
		this.fullscreenElement.style.padding = '2px';
		this.fullscreenElement.style.fontSize = '14px';
		this.fullscreenElement.className = (uiTheme != 'atlas') ? 'geButton' : '';
		this.fullscreenElement.style.width = '16px';
		this.fullscreenElement.style.height = '16px';
		this.fullscreenElement.style.backgroundPosition = '50% 50%';
		this.fullscreenElement.style.backgroundRepeat = 'no-repeat';
		this.fullscreenElement.style.backgroundImage = 'url(\'' + this.fullscreenImage + '\')';
		this.toolbarContainer.appendChild(this.fullscreenElement);
		
		var initialPosition = this.hsplitPosition;
		var collapsed = false;

		mxEvent.addListener(this.fullscreenElement, 'click', mxUtils.bind(this, function(evt)
		{
			if (uiTheme != 'atlas')
			{
				this.toggleCompactMode(!collapsed);
			}

			this.toggleFormatPanel(!collapsed);
			this.hsplitPosition = (!collapsed) ? 0 : initialPosition;
			this.hideFooter();
			collapsed = !collapsed;
			mxEvent.consume(evt);
		}));
		
		// Some style changes in Atlas theme
		if (uiTheme == 'atlas')
		{
			mxUtils.setOpacity(this.toggleFormatElement, 70);
			mxUtils.setOpacity(this.fullscreenElement, 70);
			this.toggleFormatElement.style.right = '6px';
			this.fullscreenElement.style.right = '22px';
			this.toggleFormatElement.style.top = '8px';
			this.fullscreenElement.style.top = '8px';
		}
		
		/**
		 * Adds compact UI toggle.
		 */
		if (urlParams['embed'] != '1' && urlParams['url'] != '')
		{
			this.toggleElement = document.createElement('a');
			this.toggleElement.setAttribute('href', 'javascript:void(0);');
			this.toggleElement.setAttribute('title', mxResources.get('collapseExpand'));
			this.toggleElement.className = 'geButton';
			this.toggleElement.style.position = 'absolute';
			this.toggleElement.style.display = 'inline-block';
			this.toggleElement.style.width = '16px';
			this.toggleElement.style.height = '16px';
			this.toggleElement.style.color = '#666';
			this.toggleElement.style.top = '5px';
			this.toggleElement.style.right = '10px';
			this.toggleElement.style.padding = '2px';
			this.toggleElement.style.fontSize = '14px';
			this.toggleElement.style.textDecoration = 'none';
			this.toggleElement.style.backgroundImage = 'url(\'' + this.chevronUpImage + '\')';
				
			this.toggleElement.style.backgroundPosition = '50% 50%';
			this.toggleElement.style.backgroundRepeat = 'no-repeat';
			
			// Toggles compact mode
			mxEvent.addListener(this.toggleElement, 'click', mxUtils.bind(this, function(evt)
			{
				this.toggleCompactMode();
				mxEvent.consume(evt);
			}));
		
			if (uiTheme != 'atlas')
			{
				this.toolbarContainer.appendChild(this.toggleElement);
			}
		}
		
		// Enable compact mode for small screens
		if (screen.height <= 740 && typeof(this.toggleElement.click) !== 'undefined')
		{
			window.setTimeout(mxUtils.bind(this, function()
			{
				this.toggleElement.click();
			}), 0);
		}
	}
};

/**
 * Adds the listener for automatically saving the diagram for local changes.
 */
App.prototype.toggleCompactMode = function(forceHide)
{
	if (!forceHide && this.appIcon.style.display == 'none')
	{
		this.menubar.container.style.position = 'absolute';
		this.menubar.container.style.paddingLeft = '52px';
		this.menubar.container.style.paddingTop = '';
		this.menubar.container.style.paddingBottom = '';
		this.menubar.container.style.top = '29px';
		this.toolbar.container.style.paddingLeft = '56px';
		this.buttonContainer.style.visibility = 'visible';
		this.appIcon.style.display = 'block';
		this.fnameWrapper.style.display = 'block';
		this.fnameWrapper.style.visibility = 'visible';
		this.menubarHeight = App.prototype.menubarHeight;
		this.refresh();
		this.toggleElement.style.backgroundImage = 'url(\'' + this.chevronUpImage + '\')';
	}
	else
	{
		this.menubar.container.style.position = 'relative';
		this.menubar.container.style.paddingLeft = '4px';
		this.menubar.container.style.paddingTop = '0px';
		this.menubar.container.style.paddingBottom = '0px';
		this.menubar.container.style.top = '0px';
		this.toolbar.container.style.paddingLeft = '4px';
		this.buttonContainer.style.visibility = 'hidden';
		this.appIcon.style.display = 'none';
		this.fnameWrapper.style.display = 'none';
		this.fnameWrapper.style.visibility = 'hidden';
		this.menubarHeight = EditorUi.prototype.menubarHeight;
		this.refresh();
		this.toggleElement.style.backgroundImage = 'url(\'' + this.chevronDownImage + '\')';
	}
};

/**
 * Adds the listener for automatically saving the diagram for local changes.
 */
App.prototype.updateUserElement = function()
{
	if ((this.drive == null || this.drive.getUser() == null) &&
		(this.oneDrive == null || this.oneDrive.getUser() == null) &&
		(this.dropbox == null || this.dropbox.getUser() == null))
	{
		if (this.userElement != null)
		{
			this.userElement.parentNode.removeChild(this.userElement);
			this.userElement = null;
		}
	}
	else
	{
		if (this.userElement == null)
		{
			this.userElement = document.createElement('a');
			this.userElement.setAttribute('href', 'javascript:void(0);');
			this.userElement.className = 'geItem';
			this.userElement.style.position = 'absolute';
			this.userElement.style.fontSize = '8pt';
			this.userElement.style.top = '4px';
			this.userElement.style.right = '30px';
			this.userElement.style.color = '#666';
			this.userElement.style.margin = '4px';
			this.userElement.style.padding = '2px';
			this.userElement.style.paddingRight = '16px';
			this.userElement.style.verticalAlign = 'middle';
			this.userElement.style.backgroundImage =  'url(' + IMAGE_PATH + '/expanded.gif)';
			this.userElement.style.backgroundPosition = '100% 60%';
			this.userElement.style.backgroundRepeat = 'no-repeat';
			
			this.menubarContainer.appendChild(this.userElement);

			mxEvent.addListener(this.userElement, 'click', mxUtils.bind(this, function(evt)
			{
				if (this.userPanel == null)
				{
					var div = document.createElement('div');
					div.className = 'geDialog';
					div.style.position = 'absolute';
					div.style.top = (this.userElement.clientTop + this.userElement.clientHeight + 6) + 'px';
					div.style.right = '36px';
					div.style.padding = '0px';

					this.userPanel = div;
				}
				
				if (this.userPanel.parentNode != null)
				{
					this.userPanel.parentNode.removeChild(this.userPanel);
				}
				else
				{
					var connected = false;
					this.userPanel.innerHTML = '';
					
					var img = document.createElement('img');

					img.setAttribute('src', Dialog.prototype.closeImage);
					img.setAttribute('title', mxResources.get('close'));
					img.className = 'geDialogClose';
					img.style.top = '8px';
					img.style.right = '8px';
					
					mxEvent.addListener(img, 'click', mxUtils.bind(this, function()
					{
						if (this.userPanel.parentNode != null)
						{
							this.userPanel.parentNode.removeChild(this.userPanel);
						}
					}));
					
					this.userPanel.appendChild(img);
										
					if (this.drive != null)
					{
						var driveUser = this.drive.getUser();
						
						if (driveUser != null)
						{
							connected = true;
							this.userPanel.innerHTML += '<table title="User ID: ' + driveUser.id +
								'" style="font-size:10pt;padding:20px 20px 10px 10px;">' +
								'<tr><td valign="top">' +
								((driveUser.pictureUrl != null) ?
									'<img style="margin-right:10px;border-radius:50%;" src="' + driveUser.pictureUrl + '"/>' :
									'<img style="margin-right:4px;margin-top:2px;" src="' + this.defaultUserPicture + '"/>') +
								'</td><td valign="top" style="white-space:nowrap;' +
								((driveUser.pictureUrl != null) ? 'padding-top:14px;' : '') +
								'"><b>' + mxUtils.htmlEntities(driveUser.displayName) + '</b><br>' +
								'<small>' + mxUtils.htmlEntities(driveUser.email) + '</small></tr></table>';
							var div = document.createElement('div');
							div.style.textAlign = 'center';
							div.style.padding = '12px';
							div.style.background = 'whiteSmoke';
							div.style.borderTop = '1px solid #e0e0e0';
							div.style.whiteSpace = 'nowrap';

							// LATER: Cannot change user while file is open since close will not work with new
							// credentials and closing the file using fileLoaded(null) will show splash dialog.
							div.appendChild(mxUtils.button(mxResources.get('signOut'), mxUtils.bind(this, function()
							{
								var file = this.getCurrentFile();

								if (file != null && file.constructor == DriveFile)
								{
									this.confirm(mxResources.get('areYouSure'), mxUtils.bind(this, function()
									{
										this.diagramContainer.style.visibility = 'hidden';
										this.formatContainer.style.visibility = 'hidden';
											
										file.close();
	
										// LATER: Use callback to wait for thumbnail update
										window.setTimeout(mxUtils.bind(this, function()
										{
											// Workaround to disable the splash screen before reload
											this.showDialog = function() {};
											window.location.hash = '';
											this.drive.clearUserId();
											gapi.auth.signOut();
											
											// Reload page to reset client auth
											window.location.reload();
										}), (file != null && file.constructor == DriveFile) ? 2000 : 0);
									}));
								}
								else
								{
									this.drive.clearUserId();
									this.drive.setUser(null);
									gapi.auth.signOut();
								}
							})));
							
							this.userPanel.appendChild(div);
						}
					}
					
					var addUser = mxUtils.bind(this, function(user, logo, logout)
					{
						if (user != null)
						{
							if (connected)
							{
								this.userPanel.appendChild(document.createElement('hr'));
							}
							
							connected = true;
							this.userPanel.innerHTML += '<table style="font-size:10pt;padding:20px 20px 10px 10px;"><tr><td valign="top">' +
								((logo != null) ? '<img style="margin-right:10px;" src="' + logo + '" width="40" height="40"/></td>' : '') +
								'<td valign="middle" style="white-space:nowrap;"><b>' + mxUtils.htmlEntities(user.displayName) + '</b>' +
								((user.email != null) ? '<br><font color="gray">' + mxUtils.htmlEntities(user.email) + '</font></td>' : '') +
								'</tr></table>';
							var div = document.createElement('div');
							div.style.textAlign = 'center';
							div.style.padding = '12px';
							div.style.background = 'whiteSmoke';
							div.style.borderTop = '1px solid #e0e0e0';
							div.style.whiteSpace = 'nowrap';
							
							if (logout != null)
							{
								div.appendChild(mxUtils.button(mxResources.get('signOut'), logout));
							}
							
							this.userPanel.appendChild(div);
						}
					});
					
					if (this.dropbox != null)
					{
						addUser(this.dropbox.getUser(), IMAGE_PATH + '/dropbox-logo.svg', mxUtils.bind(this, function()
						{
							var file = this.getCurrentFile();

							if (file != null && file.constructor == DropboxFile)
							{
								var doLogout = mxUtils.bind(this, function()
								{
									this.dropbox.logout();
									window.location.hash = '';
								});
								
								if (!file.isModified())
								{
									doLogout();
								}
								else
								{
									this.confirm(mxResources.get('allChangesLost'), doLogout);
								}
							}
							else
							{
								this.dropbox.logout();
							}
						}));
					}

					if (this.oneDrive != null)
					{
						addUser(this.oneDrive.getUser(), IMAGE_PATH + '/onedrive-logo.svg', mxUtils.bind(this, function()
						{
							var file = this.getCurrentFile();

							if (file != null && file.constructor == OneDriveFile)
							{
								var doLogout = mxUtils.bind(this, function()
								{
									this.oneDrive.logout();
									window.location.hash = '';
								});
								
								if (!file.isModified())
								{
									doLogout();
								}
								else
								{
									this.confirm(mxResources.get('allChangesLost'), doLogout);
								}
							}
							else
							{
								this.oneDrive.logout();
							}
						}));
					}
					
					if (!connected)
					{
						var div = document.createElement('div');
						div.style.textAlign = 'center';
						div.style.padding = '20px 20px 10px 10px';
						div.innerHTML = mxResources.get('notConnected');
						
						this.userPanel.appendChild(div);
					}

					document.body.appendChild(this.userPanel);
				}
				
				mxEvent.consume(evt);
			}));
			
			mxEvent.addListener(document.body, 'click', mxUtils.bind(this, function(evt)
			{
				if (!mxEvent.isConsumed(evt) && this.userPanel != null && this.userPanel.parentNode != null)
				{
					this.userPanel.parentNode.removeChild(this.userPanel);
				}
			}));
		}
		
		var user = null;
		
		if (this.drive != null && this.drive.getUser() != null)
		{
			user = this.drive.getUser();
		}
		else if (this.oneDrive != null && this.oneDrive.getUser() != null)
		{
			user = this.oneDrive.getUser();
		}
		else if (this.dropbox != null && this.dropbox.getUser() != null)
		{
			user = this.dropbox.getUser();
		}
		
		if (user != null)
		{
			this.userElement.innerHTML = '';
			mxUtils.write(this.userElement, user.displayName);
			this.userElement.style.display = 'block';
		}
		else
		{
			this.userElement.style.display = 'none';
		}
	}
};

// Handles paste from lucid chart
(function()
{
	var loading = false;
	var editorUiPasteCells = EditorUi.prototype.pasteCells;
	
	EditorUi.prototype.pasteCells = function(evt, elt)
	{
		var spans = elt.getElementsByTagName('span');
		
		if (spans != null && spans.length > 0 && spans[0].getAttribute('data-lucid-type') ===
			'application/vnd.lucid.chart.objects')
		{
			var content = spans[0].getAttribute('data-lucid-content');
			
			if (content != null && content.length > 0)
			{
				var delayed = mxUtils.bind(this, function()
				{
					// Checks for signature method
					if (this.pasteLucidChart)
					{
						try
						{
							this.pasteLucidChart(JSON.parse(content))
							mxEvent.consume(evt);
						}
						catch (e)
						{
							// ignore
						}
					}
				});
				
				if (!this.pasteLucidChart && !loading && !this.isOffline())
				{
					loading = true;
					
					if (urlParams['dev'] == '1')
					{
						mxscript('/js/diagramly/Extensions.js', delayed);
					}
					else
					{
						mxscript('/js/extensions.min.js', delayed);
					}
				}
				else
				{
					delayed();
				}
			}
		}
		
		editorUiPasteCells.apply(this, arguments);
	};
})();
