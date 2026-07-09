/**
 * Copyright (c) 2006-2017, JGraph Holdings Ltd
 * Copyright (c) 2006-2017, draw.io AG
 */
/**
 * Contains current settings.
 */
var mxSettings =
{
	/**
	 * Defines current version of settings.
	 */
	currentVersion: 18,
	
	defaultFormatWidth: (screen.width < 600) ? '0' : '240',
	
	// NOTE: Hardcoded in index.html due to timing of JS loading
	key: Editor.settingsKey,

	getLanguage: function()
	{
		return mxSettings.settings.language;
	},
	setLanguage: function(lang)
	{
		mxSettings.settings.language = lang;
	},
	isMainSettings: function()
	{
		return mxSettings.key == '.drawio-config';
	},
	getMainSettings: function()
	{
		var value = localStorage.getItem('.drawio-config');

		if (value == null)
		{
			value = mxSettings.getDefaults();
			delete value.isNew;
		}
		else
		{
			value = JSON.parse(value);
			value.version = mxSettings.currentVersion;
		}

		return value;
	},
	getUi: function()
	{
		return (mxSettings.isMainSettings()) ? mxSettings.settings.ui :
			mxSettings.getMainSettings().ui;
	},
	setUi: function(ui)
	{
		if (mxSettings.isMainSettings())
		{
			mxSettings.settings.ui = ui;
			mxSettings.save();
		}
		else
		{
			var value = mxSettings.getMainSettings();
			value.ui = ui;
			localStorage.setItem('.drawio-config', JSON.stringify(value));
		}
	},
	getShowStartScreen: function()
	{
		return mxSettings.settings.showStartScreen;
	},
	setShowStartScreen: function(showStartScreen)
	{
		mxSettings.settings.showStartScreen = showStartScreen;
	},
	getCurrentEdgeStyle: function()
	{
		return (mxSettings.settings != null) ? mxSettings.settings.currentEdgeStyle : null;
	},
	setCurrentEdgeStyle: function(value)
	{
		mxSettings.settings.currentEdgeStyle = value;
		mxSettings.save();
	},
	getGridColor: function(darkMode)
	{
		var result = (darkMode) ? mxSettings.settings.darkGridColor :
			mxSettings.settings.gridColor;

		if (mxUtils.isLightDarkColor(result))
		{
			var ld = mxUtils.getLightDarkColor(result);
			result = (darkMode) ? ld.dark : ld.light;
		}

		return result;
	},
	setGridColor: function(gridColor, darkMode)
	{
		if (darkMode)
		{
			mxSettings.settings.darkGridColor = gridColor;
		}
		else
		{
			mxSettings.settings.gridColor = gridColor;
		}
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
	setCustomFonts: function(fonts)
	{
		mxSettings.settings.customFonts = fonts;
	},
	getCustomFonts: function()
	{
		//Convert from old format to the new one
		var custFonts = mxSettings.settings.customFonts || [];
		
		for (var i = 0 ; i < custFonts.length; i++)
		{
			if (typeof custFonts[i] === 'string')
			{
				custFonts[i] = {name: custFonts[i], url: null};
			}
		}
		
		return custFonts;
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
		
		//If the setting is incorrect, reset it to an empty array
		if (!Array.isArray(mxSettings.settings.customLibraries))
		{
			mxSettings.settings.customLibraries = [];
		}
		
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
	getSidebarWidth: function()
	{
		return mxSettings.settings.sidebarWidth;
	},
	setSidebarWidth: function(sidebarWidth)
	{
		mxSettings.settings.sidebarWidth = sidebarWidth;
	},
	getCollapsedSections: function()
	{
		return mxSettings.settings.collapsedSections || {};
	},
	setCollapsedSections: function(collapsedSections)
	{
		mxSettings.settings.collapsedSections = collapsedSections;
	},
	getCollapsedLibraries: function()
	{
		return mxSettings.settings.collapsedLibraries || {};
	},
	setCollapsedLibraries: function(collapsedLibraries)
	{
		mxSettings.settings.collapsedLibraries = collapsedLibraries;
	},
	getLibraryOrder: function()
	{
		return mxSettings.settings.libraryOrder || null;
	},
	setLibraryOrder: function(order)
	{
		mxSettings.settings.libraryOrder = order;
	},
	getWindowState: function(name)
	{
		var states = mxSettings.settings.windowStates;

		return (states != null) ? states[name] : null;
	},
	setWindowState: function(name, state)
	{
		if (mxSettings.settings.windowStates == null)
		{
			mxSettings.settings.windowStates = {};
		}

		mxSettings.settings.windowStates[name] = state;
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
	getUnit: function()
	{
		return mxSettings.settings.unit || mxConstants.POINTS;
	},
	setUnit: function(value)
	{
		mxSettings.settings.unit = value;
	},
	isRulerOn: function()
	{
		return mxSettings.settings.isRulerOn;
	},
	setRulerOn: function(value)
	{
		mxSettings.settings.isRulerOn = value;
	},
	getDraftSaveDelay: function()
	{
		return mxSettings.settings.draftSaveDelay;
	},
	setDraftSaveDelay: function(value)
	{
		mxSettings.settings.draftSaveDelay = value;
	},
	getDefaults: function()
	{
		return {
			language: '',
			configVersion: Editor.configVersion,
			customFonts: [],
			libraries: Sidebar.prototype.defaultEntries,
			customLibraries: Editor.defaultCustomLibraries,
			plugins: [],
			recentColors: [],
			formatWidth: mxSettings.defaultFormatWidth,
			sidebarWidth: null,
			collapsedSections: {},
			collapsedLibraries: {},
			createTarget: urlParams['sketch'] == '1',
			pageFormat: mxGraph.prototype.pageFormat,
			search: true,
			showStartScreen: false,
			gridColor: mxGraphView.prototype.defaultGridColor,
			darkGridColor: mxGraphView.prototype.defaultDarkGridColor,
			darkMode: 'auto',
			autosave: !EditorUi.isElectronApp,
			resizeImages: null,
			openCounter: 0,
			version: mxSettings.currentVersion,
			// Only defined and true for new settings which haven't been saved
			isNew: true,
			unit: mxConstants.POINTS,
			isRulerOn: false,
			windowStates: {},
			// Persisted global current edge style (the toolbar dropdown's choice for
			// new edges when nothing is selected). null => use the theme default.
			currentEdgeStyle: null
		};
	},
	init: function()
	{
		mxSettings.settings = mxSettings.getDefaults();
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
		try
		{
			if (isLocalStorage && typeof(JSON) !== 'undefined')
			{
				mxSettings.parse(localStorage.getItem(mxSettings.key));
			}
		}
		catch (e)
		{
			if (window.console != null)
			{
				console.log('Error loading settings:', mxSettings.key, e);
			}
		}

		if (mxSettings.settings == null)
		{
			mxSettings.init();
		}
	},
	parse: function(value)
	{
		var config = (value != null) ? JSON.parse(value) : null;

		if (config == null || (config.configVersion != Editor.configVersion) ||
			(Editor.config != null && Editor.config.override))
		{
			mxSettings.settings = null;
			mxSettings.init();
		}
		else
		{
			mxSettings.settings = config;
			
			if (mxSettings.settings.plugins == null)
			{
				mxSettings.settings.plugins = [];
			}
			
			if (mxSettings.settings.recentColors == null)
			{
				mxSettings.settings.recentColors = [];
			}

			if (mxSettings.settings.customFonts == null)
			{
				mxSettings.settings.customFonts = [];
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
				mxSettings.settings.showStartScreen = false;
			}
			
			if (mxSettings.settings.gridColor == null)
			{
				mxSettings.settings.gridColor = mxGraphView.prototype.defaultGridColor;
			}

			if (mxSettings.settings.darkGridColor == null)
			{
				mxSettings.settings.darkGridColor = mxGraphView.prototype.defaultDarkGridColor;
			}
			
			if (mxSettings.settings.autosave == null)
			{
				mxSettings.settings.autosave = !EditorUi.isElectronApp;
			}
			else if (EditorUi.isElectronApp && localStorage.getItem('._autoSaveTrans_') == null) //Transition to no autosave
			{
				localStorage.setItem('._autoSaveTrans_', '1');
				mxSettings.settings.autosave = false;
				mxSettings.save();
			}
			
			if (mxSettings.settings.scratchpadSeen != null)
			{
				delete mxSettings.settings.scratchpadSeen;
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
