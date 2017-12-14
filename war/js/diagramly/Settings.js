/**
 * Copyright (c) 2006-2017, JGraph Ltd
 * Copyright (c) 2006-2017, Gaudenz Alder
 */
/**
 * Contains current settings.
 */
var mxSettings =
{
	/**
	 * Defines current version of settings.
	 */
	currentVersion: 16,
	
	defaultFormatWidth: (screen.width < 600) ? '0' : '240',
	
	// NOTE: Hardcoded in index.html due to timing of JS loading
	key: '.drawio-config',

	getLanguage: function()
	{
		return mxSettings.settings.language;
	},
	setLanguage: function(lang)
	{
		mxSettings.settings.language = lang;
	},
	getUi: function()
	{
		return mxSettings.settings.ui;
	},
	setUi: function(ui)
	{
		mxSettings.settings.ui = ui;
	},
	getShowStartScreen: function()
	{
		return mxSettings.settings.showStartScreen;
	},
	setShowStartScreen: function(showStartScreen)
	{
		mxSettings.settings.showStartScreen = showStartScreen;
	},
	getGridColor: function()
	{
		return mxSettings.settings.gridColor;
	},
	setGridColor: function(gridColor)
	{
		mxSettings.settings.gridColor = gridColor;
	},
	getAutosave: function()
	{
		return mxSettings.settings.autosave;
	},
	setAutosave: function(autosave)
	{
		mxSettings.settings.autosave = autosave;
	},
	getResizeImages: function()
	{
		return mxSettings.settings.resizeImages;
	},
	setResizeImages: function(resizeImages)
	{
		mxSettings.settings.resizeImages = resizeImages;
	},
	getOpenCounter: function()
	{
		return mxSettings.settings.openCounter;
	},
	setOpenCounter: function(openCounter)
	{
		mxSettings.settings.openCounter = openCounter;
	},
	getLibraries: function()
	{
		return mxSettings.settings.libraries;
	},
	setLibraries: function(libs)
	{
		mxSettings.settings.libraries = libs;
	},
	addCustomLibrary: function(id)
	{
		// Makes sure to update the latest data from the localStorage
		mxSettings.load();
		
		if (mxUtils.indexOf(mxSettings.settings.customLibraries, id) < 0)
		{
			// Makes sure scratchpad is below search in sidebar
			if (id === 'L.scratchpad')
			{
				mxSettings.settings.customLibraries.splice(0, 0, id);
			}
			else
			{
				mxSettings.settings.customLibraries.push(id);
			}
		}
		
		mxSettings.save();
	},
	removeCustomLibrary: function(id)
	{
		// Makes sure to update the latest data from the localStorage
		mxSettings.load();
		mxUtils.remove(id, mxSettings.settings.customLibraries);
		mxSettings.save();
	},
	getCustomLibraries: function()
	{
		return mxSettings.settings.customLibraries;
	},
	getPlugins: function()
	{
		return mxSettings.settings.plugins;
	},
	setPlugins: function(plugins)
	{
		mxSettings.settings.plugins = plugins;
	},
	getRecentColors: function()
	{
		return mxSettings.settings.recentColors;
	},
	setRecentColors: function(recentColors)
	{
		mxSettings.settings.recentColors = recentColors;
	},
	getFormatWidth: function()
	{
		return parseInt(mxSettings.settings.formatWidth);
	},
	setFormatWidth: function(formatWidth)
	{
		mxSettings.settings.formatWidth = formatWidth;
	},
	getCurrentEdgeStyle: function()
	{
		return mxSettings.settings.currentEdgeStyle;
	},
	setCurrentEdgeStyle: function(value)
	{
		mxSettings.settings.currentEdgeStyle = value;
	},
	getCurrentVertexStyle: function()
	{
		return mxSettings.settings.currentVertexStyle;
	},
	setCurrentVertexStyle: function(value)
	{
		mxSettings.settings.currentVertexStyle = value;
	},
	isCreateTarget: function()
	{
		return mxSettings.settings.createTarget;
	},
	setCreateTarget: function(value)
	{
		mxSettings.settings.createTarget = value;
	},
	getPageFormat: function()
	{
		return mxSettings.settings.pageFormat;
	},
	setPageFormat: function(value)
	{
		mxSettings.settings.pageFormat = value;
	},
	init: function()
	{
		mxSettings.settings = 
		{
			language: '',
			configVersion: Editor.configVersion,
			libraries: Sidebar.prototype.defaultEntries,
			customLibraries: Editor.defaultCustomLibraries,
			plugins: [],
			recentColors: [],
			formatWidth: mxSettings.defaultFormatWidth,
			currentEdgeStyle: Graph.prototype.defaultEdgeStyle,
			currentVertexStyle: Graph.prototype.defaultVertexStyle,
			createTarget: false,
			pageFormat: mxGraph.prototype.pageFormat,
			search: true,
			showStartScreen: true,
			gridColor: mxGraphView.prototype.gridColor,
			autosave: !EditorUi.isElectronApp,
			resizeImages: null,
			openCounter: 0,
			version: mxSettings.currentVersion,
			// Only defined and true for new settings which haven't been saved
			isNew: true
		};
	},
	save: function()
	{
		if (isLocalStorage && typeof(JSON) !== 'undefined')
		{
			try
			{
				delete mxSettings.settings.isNew;
				mxSettings.settings.version = mxSettings.currentVersion;
				localStorage.setItem(mxSettings.key, JSON.stringify(mxSettings.settings));
			}
			catch (e)
			{
				// ignores quota exceeded
			}
		}
	},
	load: function()
	{
		if (isLocalStorage && typeof(JSON) !== 'undefined')
		{
			mxSettings.parse(localStorage.getItem(mxSettings.key));
		}

		if (mxSettings.settings == null)
		{
			mxSettings.init();
		}
	},
	parse: function(value)
	{
		if (value != null)
		{
			var temp = JSON.parse(value);
			
			if (temp.configVersion != Editor.configVersion)
			{
				mxSettings.settings = null;
			}
			else
			{
				mxSettings.settings = temp;
	
				if (mxSettings.settings.plugins == null)
				{
					mxSettings.settings.plugins = [];
				}
				
				if (mxSettings.settings.recentColors == null)
				{
					mxSettings.settings.recentColors = [];
				}
				
				if (mxSettings.settings.libraries == null)
				{
					mxSettings.settings.libraries = Sidebar.prototype.defaultEntries;
				}
				
				if (mxSettings.settings.customLibraries == null)
				{
					mxSettings.settings.customLibraries = Editor.defaultCustomLibraries;
				}
				
				if (mxSettings.settings.ui == null)
				{
					mxSettings.settings.ui = '';
				}
				
				if (mxSettings.settings.formatWidth == null)
				{
					mxSettings.settings.formatWidth = mxSettings.defaultFormatWidth;
				}
				
				if (mxSettings.settings.lastAlert != null)
				{
					delete mxSettings.settings.lastAlert;
				}
				
				if (mxSettings.settings.currentEdgeStyle == null)
				{
					mxSettings.settings.currentEdgeStyle = Graph.prototype.defaultEdgeStyle;
				}
				else if (mxSettings.settings.version <= 10)
				{
					// Adds new defaults for jetty size and loop routing
					mxSettings.settings.currentEdgeStyle['orthogonalLoop'] = 1;
					mxSettings.settings.currentEdgeStyle['jettySize'] = 'auto';
				}
				
				if (mxSettings.settings.currentVertexStyle == null)
				{
					mxSettings.settings.currentVertexStyle = Graph.prototype.defaultVertexStyle;
				}
				
				if (mxSettings.settings.createTarget == null)
				{
					mxSettings.settings.createTarget = false;
				}
				
				if (mxSettings.settings.pageFormat == null)
				{
					mxSettings.settings.pageFormat = mxGraph.prototype.pageFormat;
				}
				
				if (mxSettings.settings.search == null)
				{
					mxSettings.settings.search = true;
				}
				
				if (mxSettings.settings.showStartScreen == null)
				{
					mxSettings.settings.showStartScreen = true;
				}		
				
				if (mxSettings.settings.gridColor == null)
				{
					mxSettings.settings.gridColor = mxGraphView.prototype.gridColor;
				}
				
				if (mxSettings.settings.autosave == null)
				{
					mxSettings.settings.autosave = true;
				}
				
				if (mxSettings.settings.scratchpadSeen != null)
				{
					delete mxSettings.settings.scratchpadSeen;
				}
			}
		}
	},
	clear: function() 
	{
		if (isLocalStorage)
		{
			localStorage.removeItem(mxSettings.key);
		}
	}
}

/**
 * Variable: mxLoadSettings
 * 
 * Optional global config variable to toggle loading the settings. Default is true.
 *
 * (code)
 * <script type="text/javascript">
 * 		var mxLoadSettings = false;
 * </script>
 * (end)
 */
if (typeof(mxLoadSettings) == 'undefined' || mxLoadSettings)
{
	// Loads initial content
	mxSettings.load();
}
