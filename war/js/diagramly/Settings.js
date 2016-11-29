/**
 * Utility class for working with persisted application settings
 */
var mxSettings =
{
	// NOTE: Hardcoded in index.html due to timing of JS loading
	key: '.drawio-config',

	settings:
	{
		language: '',
		libraries: Sidebar.prototype.defaultEntries,
		customLibraries: [],
		plugins: [],
		recentColors: [],
		formatWidth: '240',
		currentEdgeStyle: Graph.prototype.defaultEdgeStyle,
		currentVertexStyle: {},
		createTarget: false,
		pageFormat: mxGraph.prototype.pageFormat,
		search: true,
		showStartScreen: true,
		gridColor: mxGraphView.prototype.gridColor,
		autosave: true,
		version: 13,
		// Only defined and true for new settings which haven't been saved
		isNew: true
	},
	getLanguage: function()
	{
		return this.settings.language;
	},
	setLanguage: function(lang)
	{
		this.settings.language = lang;
	},
	getUi: function()
	{
		return this.settings.ui;
	},
	setUi: function(ui)
	{
		this.settings.ui = ui;
	},
	getShowStartScreen: function()
	{
		return this.settings.showStartScreen;
	},
	setShowStartScreen: function(showStartScreen)
	{
		this.settings.showStartScreen = showStartScreen;
	},
	getGridColor: function()
	{
		return this.settings.gridColor;
	},
	setGridColor: function(gridColor)
	{
		this.settings.gridColor = gridColor;
	},
	getAutosave: function()
	{
		return this.settings.autosave;
	},
	setAutosave: function(autosave)
	{
		this.settings.autosave = autosave;
	},
	getLibraries: function()
	{
		return this.settings.libraries;
	},
	setLibraries: function(libs)
	{
		this.settings.libraries = libs;
	},
	addCustomLibrary: function(id)
	{
		// Makes sure to update the latest data from the localStorage
		mxSettings.load();
		
		if (mxUtils.indexOf(this.settings.customLibraries, id) < 0)
		{
			this.settings.customLibraries.push(id);
		}
		
		mxSettings.save();
	},
	removeCustomLibrary: function(id)
	{
		// Makes sure to update the latest data from the localStorage
		mxSettings.load();
		mxUtils.remove(id, this.settings.customLibraries);
		mxSettings.save();
	},
	getCustomLibraries: function()
	{
		return this.settings.customLibraries;
	},
	getPlugins: function()
	{
		return this.settings.plugins;
	},
	setPlugins: function(plugins)
	{
		this.settings.plugins = plugins;
	},
	getRecentColors: function()
	{
		return this.settings.recentColors;
	},
	setRecentColors: function(recentColors)
	{
		this.settings.recentColors = recentColors;
	},
	getFormatWidth: function()
	{
		return parseInt(this.settings.formatWidth);
	},
	setFormatWidth: function(formatWidth)
	{
		this.settings.formatWidth = formatWidth;
	},
	getCurrentEdgeStyle: function()
	{
		return this.settings.currentEdgeStyle;
	},
	setCurrentEdgeStyle: function(value)
	{
		this.settings.currentEdgeStyle = value;
	},
	getCurrentVertexStyle: function()
	{
		return this.settings.currentVertexStyle;
	},
	setCurrentVertexStyle: function(value)
	{
		this.settings.currentVertexStyle = value;
	},
	isCreateTarget: function()
	{
		return this.settings.createTarget;
	},
	setCreateTarget: function(value)
	{
		this.settings.createTarget = value;
	},
	getPageFormat: function()
	{
		return this.settings.pageFormat;
	},
	setPageFormat: function(value)
	{
		this.settings.pageFormat = value;
	},
	save: function()
	{
		if (isLocalStorage && typeof(JSON) !== 'undefined')
		{
			try
			{
				delete this.settings.isNew;
				this.settings.version = 12;
				localStorage.setItem(mxSettings.key, JSON.stringify(this.settings));
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
	},
	parse: function(value)
	{
		if (value != null)
		{
			this.settings = JSON.parse(value);

			if (this.settings.plugins == null)
			{
				this.settings.plugins = [];
			}
			
			if (this.settings.recentColors == null)
			{
				this.settings.recentColors = [];
			}
			
			if (this.settings.libraries == null)
			{
				this.settings.libraries = Sidebar.prototype.defaultEntries;
			}
			
			if (this.settings.customLibraries == null)
			{
				this.settings.customLibraries = [];
			}
			
			if (this.settings.ui == null)
			{
				this.settings.ui = '';
			}
			
			if (this.settings.formatWidth == null)
			{
				this.settings.formatWidth = '240';
			}
			
			if (this.settings.lastAlert != null)
			{
				delete this.settings.lastAlert;
			}
			
			if (this.settings.currentEdgeStyle == null)
			{
				this.settings.currentEdgeStyle = Graph.prototype.defaultEdgeStyle;
			}
			else if (this.settings.version <= 10)
			{
				// Adds new defaults for jetty size and loop routing
				this.settings.currentEdgeStyle['orthogonalLoop'] = 1;
				this.settings.currentEdgeStyle['jettySize'] = 'auto';
			}
			
			if (this.settings.currentVertexStyle == null)
			{
				this.settings.currentVertexStyle = {};
			}
			
			if (this.settings.createTarget == null)
			{
				this.settings.createTarget = false;
			}
			
			if (this.settings.pageFormat == null)
			{
				this.settings.pageFormat = mxGraph.prototype.pageFormat;
			}
			
			if (this.settings.search == null)
			{
				this.settings.search = true;
			}
			
			if (this.settings.showStartScreen == null)
			{
				this.settings.showStartScreen = true;
			}		
			
			if (this.settings.gridColor == null)
			{
				this.settings.gridColor = mxGraphView.prototype.gridColor;
			}
			
			if (this.settings.autosave == null)
			{
				this.settings.autosave = true;
			}
			
			if (this.settings.scratchpadSeen != null)
			{
				delete this.settings.scratchpadSeen;
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
