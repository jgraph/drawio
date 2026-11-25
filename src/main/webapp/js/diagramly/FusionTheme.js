/**
 * Copyright (c) 2026, JGraph Holdings Ltd
 * Copyright (c) 2026, draw.io AG
 */
/**
 * The gate of the theme Fusion (formerly Simple Modern), the part of the
 * theme that every session of the app loads (app.min.js, after
 * SimpleClassic.js): its switches (Editor.isSimpleModern and the others
 * below), the hooks that wait for a switch into the theme (SimpleUi.install,
 * installAfter, installHook), the offer of the theme in the theme menu, the
 * switch without a restart and the state of the notice of the theme. All
 * other code of the theme is in the Simple*.js files (js/fusion.min.js, see
 * github-build.xml), and all its CSS in styles/fusion.css, which only
 * sessions of the theme load (SimpleUi.loadTheme): App.main loads both before
 * it creates the UI of a start in the theme, and the first switch into the
 * theme without a restart loads them before it installs the theme, so the
 * other themes do not download, parse or run them.
 *
 * The theme is called Fusion (the driver, 9 November 2026). Its value is
 * fusion: the URL parameter ui=fusion or the stored theme (Theme ▸ Fusion
 * (Beta), listed on app.diagrams.net and preprod.diagrams.net and elsewhere
 * with test=1, see Editor.fusionThemeOffered below, and a stored Fusion
 * applies only there); modern, its value
 * before the name, is an alias (see Editor.isFusionTheme). The code keeps
 * the names of before (Simple*.js, Editor.modernTheme, isSimpleModern,
 * .geSimpleModern, --sm-). Inside the app
 * its theme is simple (Editor.currentTheme), so the code of the Simple theme
 * runs for both, and Editor.isSimpleModern tells them apart: every change of
 * the theme runs only if it returns true.
 */

/**
 * Returns true if the given value of the theme (the URL parameter ui, the
 * stored theme or a value of the theme menu) is Fusion: fusion, or modern,
 * the value before the name, so that the URLs and the stored themes of users
 * who chose the theme before the name keep it. Switches store fusion.
 */
Editor.isFusionTheme = function(value)
{
	return value == 'fusion' || value == 'modern';
};

/**
 * True while the theme of this session is Fusion: chosen at the start (the
 * URL or the stored theme) or by a switch without a restart from Classic or
 * the previous look of Simple (see doSetCurrentTheme below), which a switch
 * back to one of them ends.
 */
Editor.modernTheme = Editor.isFusionTheme(Editor.currentTheme);

/**
 * The build of the theme: none where the scripts and the stylesheet of the
 * theme (js/fusion.min.js, the Simple*.js files but SimpleClassic.js,
 * styles/fusion.css and fusion.min.css) are not shipped, else a placeholder.
 * The public repository (jgraph/drawio, which the desktop app and the Docker
 * image use) does not ship them: github-deploy.xml leaves them out
 * (github_excludes) and writes none into this file, app.min.js and
 * bootstrap.js of the public tree, so that its own builds have none as well
 * (github-build.xml builds no fusion.min.js without the sources). The value
 * is a property, not a literal in the comparison below, so that the Closure
 * Compiler keeps it in app.min.js. All other builds keep the placeholder.
 */
Editor.fusionThemeBuild = 'none';

/**
 * True if the build ships the theme Fusion (see Editor.fusionThemeBuild).
 * Builds without it are not offered the theme and do not start it, as in
 * browsers without light-dark (Editor.fusionThemeSupported below).
 */
Editor.fusionThemeAvailable = Editor.fusionThemeBuild != 'none';

/**
 * True in the public build, where the build wrote none into
 * Editor.fusionThemeBuild (see Editor.isPublicBuild in grapheditor/Editor.js):
 * it has neither the theme nor the new dialogs and menus of its work in the
 * other themes, whose rows in Editor.featureDefaults are off there, so that
 * it shows the dialogs and menus of before (the driver, 22 November 2026:
 * "auf die bisherigen. fusion theme mit dialogen bleibt in den internen
 * builds").
 */
Editor.isPublicBuild = function()
{
	return !Editor.fusionThemeAvailable;
};

/**
 * False in browsers without the CSS function light-dark, which the colors of
 * the theme need (its tokens are light-dark values; see
 * Editor.loadCompatibleCss), and in builds without the theme
 * (Editor.fusionThemeAvailable): they are not offered the theme, and the URL
 * or the stored theme Fusion opens the previous look of the Simple theme.
 */
Editor.fusionThemeSupported = mxUtils.lightDarkColorSupported &&
	Editor.fusionThemeAvailable;

/**
 * True if the alias ui=simple&simple=new of the theme applies (see
 * Editor.isSimpleModern).
 */
Editor.modernAlias = urlParams['simple'] == 'new';

/**
 * The hosts where the theme Fusion is offered without test=1: app.diagrams.net,
 * our own web app (the driver, 12 November 2026: "Das Fusion-Theme soll nicht
 * angezeigt werden im Menü. Ausser bei test=1. Ausser bei app.diagrams.net,
 * unserer eigenen Web-App-Domäne. Dort soll sie angezeigt werden. Als Beta
 * markiert im Menü, wie vorher."), and preprod.diagrams.net, where each
 * release is tested before it goes to app.diagrams.net (the driver, 13
 * November 2026: "die Theme-Option im Menü für Fusion Beta sollte auch im
 * Preprod angezeigt werden"; the host name of App.termsHosts and
 * App.driveUsageHosts). Exact host names, no other subdomains of
 * diagrams.net. The preload of the stored theme in bootstrap.js has the same
 * list and must be changed together with it.
 */
Editor.fusionThemeHosts = ['app.diagrams.net', 'preprod.diagrams.net'];

/**
 * Returns true if the given host name (window.location.hostname) is one of
 * Editor.fusionThemeHosts.
 */
Editor.isFusionThemeHost = function(hostname)
{
	return mxUtils.indexOf(Editor.fusionThemeHosts, hostname) >= 0;
};

/**
 * THE OFFER OF THE THEME, the one switch that decides whether the theme
 * Fusion is offered without a URL parameter. True only in the web app on
 * Editor.fusionThemeHosts (app.diagrams.net and preprod.diagrams.net) outside
 * embeds, Teams (extAuth=1) and chromeless views (the driver, 12 and 13
 * November 2026), so the
 * desktop app, the embeds (Confluence, Jira and the hosts of the embed
 * protocol), the viewer and every other host are not offered the theme
 * (the driver, 11 November 2026: "der direkte Link mit ?ui=fusion soll
 * weiter funktionieren, nur im Theme-Menü soll Fusion ausschliesslich mit
 * test=1 erscheinen"). Where it is true, the theme menu of every theme (and
 * the Theme select of Settings, which runs its items) lists Theme ▸ Fusion
 * (Beta) and a stored Fusion applies; where it is false, the menu lists it
 * only with test=1 and in a session where the theme is installed (a start
 * with ui=fusion, see isModernThemeListed), and a stored Fusion applies only
 * with test=1 (see below). The URL parameter ui=fusion opens the theme
 * without test=1 on every host. Setting it to true lists it everywhere (as
 * from 9 to 11 November 2026). The preload of the stored theme in
 * bootstrap.js checks test=1 and the hosts and must be changed together
 * with this switch. See "The offer of the theme" in docs/claude/fusion.md.
 */
Editor.fusionThemeOffered = Editor.isFusionThemeHost(window.location.hostname) &&
	urlParams['embed'] != '1' && urlParams['extAuth'] != '1' &&
	urlParams['lightbox'] != '1' && urlParams['chrome'] != '0';

if (Editor.modernTheme)
{
	Editor.currentTheme = 'simple';
}

// A stored Fusion (not ui=fusion or ui=modern in the URL) applies only with
// test=1 where the theme is not offered (Editor.fusionThemeOffered, every
// host but app.diagrams.net and preprod.diagrams.net): else it opens the
// previous look of the Simple theme and the stored value is kept, so that
// test=1 shows it again (as in browsers without light-dark below)
if (Editor.modernTheme && !Editor.fusionThemeOffered && urlParams['test'] != '1' &&
	!Editor.isFusionTheme(urlParams['ui']))
{
	Editor.modernTheme = false;
}

// Chromeless views (the lightbox, chrome=0) are no sessions of the theme:
// they show nothing of it, so they load neither its scripts nor its
// stylesheet (App.main) and show the previous look of the Simple theme, as
// do browsers without light-dark (Editor.fusionThemeSupported)
if (urlParams['lightbox'] == '1' || urlParams['chrome'] == '0' ||
	!Editor.fusionThemeSupported)
{
	Editor.modernTheme = false;
	Editor.modernAlias = false;
}

/**
 * True once Simple Modern is installed in this session: at the start of the
 * theme, or by the first switch into it without a restart
 * (EditorUi.installSimpleModern). It stays true, as the hooks that are
 * installed stay (they check Editor.isSimpleModern when they run).
 */
Editor.modernInstalled = Editor.modernTheme;

/**
 * Returns true if the given theme, or the current theme, is Simple Modern.
 * This is the switch of all code of Simple Modern. ui=simple&simple=new is
 * an alias of the theme Fusion until the batches of Simple Modern use
 * ui=fusion.
 */
Editor.isSimpleModern = function(theme)
{
	return ((theme != null) ? theme : Editor.currentTheme) == 'simple' &&
		(Editor.modernTheme || Editor.modernAlias);
};

/**
 * Returns true if Simple Modern is installed in the session (see
 * Editor.modernInstalled), or the alias simple=new. Hooks that are installed
 * once check it, so other sessions keep the code of before until a switch
 * into the theme installs them (SimpleUi.installHook, SimpleUi.install).
 */
Editor.isModernSession = function()
{
	return Editor.modernInstalled || Editor.modernAlias;
};

/**
 * Returns true if the theme menu lists the theme Fusion: with test=1, in a
 * session where it is installed (a start in the theme, also with ui=fusion
 * in the URL without test=1, or a switch into it), so that it shows as
 * chosen and a switch back to it after a switch to another theme needs no
 * restart, and where it is offered (Editor.fusionThemeOffered, the web app
 * on app.diagrams.net and preprod.diagrams.net). A stored Fusion does not
 * list it: without test=1 it
 * opens the previous look of the Simple theme, which the menu then shows as
 * chosen (see getThemeMenuValue), unless the theme is offered. Embeds (embed=1 with
 * themes=1) list it only with test=1 or in a session of the theme: a stored
 * Fusion does not apply in embeds (see uiTheme in Init.js), where the host
 * chooses it with ui=fusion. Browsers without light-dark never list it
 * (Editor.fusionThemeSupported). The given stored theme is not used.
 */
Editor.isModernThemeListed = function(theme)
{
	return Editor.fusionThemeSupported && (urlParams['test'] == '1' ||
		Editor.isModernSession() || (Editor.fusionThemeOffered &&
		urlParams['embed'] != '1'));
};

/**
 * Returns the value of the theme menu that shows as chosen for the given
 * stored theme (mxSettings.getUi): fusion while the theme Fusion is shown,
 * also if the URL chose it (ui=fusion) and another theme is stored, as the
 * menu would else show a theme that is not shown; simple for a stored Fusion
 * that opens the previous look of the Simple theme (without test=1 where
 * the theme is not offered, see Editor.fusionThemeOffered, and in browsers
 * without light-dark), also if the URL chooses another theme, as the menu
 * shows the stored theme there; else the given theme. Embeds ignore a
 * stored Fusion (see uiTheme in Init.js).
 */
Editor.getThemeMenuValue = function(theme)
{
	if (Editor.modernTheme || Editor.modernAlias)
	{
		return 'fusion';
	}
	else if (Editor.isFusionTheme(theme) && urlParams['embed'] != '1' &&
		(!Editor.fusionThemeSupported || (!Editor.fusionThemeOffered &&
		urlParams['test'] != '1')))
	{
		return 'simple';
	}

	return theme;
};

/**
 * Returns the name of the theme Fusion in the theme menu and in Settings:
 * the name with the mark Beta, Fusion (Beta) (the resources fusion and
 * themeBeta).
 */
Editor.getFusionThemeTitle = function()
{
	return mxResources.get('themeBeta', [mxResources.get('fusion', null, 'Fusion')], '{1} (Beta)');
};

/**
 * Hooks of the classes (constructors of dialogs and windows) that a start in
 * the theme installs when the scripts load. Other sessions keep them here
 * until the first switch into the theme without a restart.
 */
var SimpleUi = {pendingHooks: [], afterHooks: [], installCount: 0, scriptsLoaded: false};

/**
 * Runs the given function, which installs a hook of the theme on a class,
 * now in a session of the theme, else at the first switch into it.
 */
SimpleUi.installHook = function(fn)
{
	if (Editor.isModernSession())
	{
		fn();
	}
	else
	{
		SimpleUi.pendingHooks.push(fn);
	}
};

/**
 * Runs the given function with the given object (an editor UI, its actions,
 * menus, Format panel or hover icons) as this: now in a session of the theme,
 * as at its start, else at the first switch into the theme without a
 * restart (EditorUi.installSimpleModern), in the order of a start. The
 * functions wait on their objects, so objects that are dropped (eg. the
 * Format panels that the omnibox builds) keep nothing alive.
 */
SimpleUi.install = function(obj, fn)
{
	if (Editor.isModernSession())
	{
		fn.call(obj);
	}
	else if (obj != null)
	{
		obj.simplePendingInstall = obj.simplePendingInstall || [];
		obj.simplePendingInstall.push({index: SimpleUi.installCount++, fn: fn});
	}
};

/**
 * Wraps the function of the given name of the given prototype (init of
 * EditorUi, Actions, Menus, Format or HoverIcons) so that it runs the given
 * function after it with the same this (see SimpleUi.install): at once in a
 * session of the theme, else at the first switch into it.
 */
SimpleUi.installAfter = function(proto, name, fn)
{
	var previous = proto[name];
	var hook = {proto: proto, fn: fn, id: SimpleUi.afterHooks.length};
	SimpleUi.afterHooks.push(hook);

	proto[name] = function()
	{
		var result = previous.apply(this, arguments);
		SimpleUi.runAfterHook(this, hook);

		return result;
	};
};

/**
 * Runs or keeps the given hook of installAfter for the given object (see
 * SimpleUi.install) and marks it, so that installSimpleModern does not add it
 * again.
 */
SimpleUi.runAfterHook = function(obj, hook)
{
	obj.simpleAfterHooks = obj.simpleAfterHooks || {};
	obj.simpleAfterHooks[hook.id] = true;
	SimpleUi.install(obj, hook.fn);
};

/**
 * The language of the resources of the app that mxResources.add loaded last,
 * eg. after setAndPersistLanguage switched the language without a reload
 * (null until then: the resources of the start, see getResourceLanguage).
 */
SimpleUi.addedLanguage = null;

// Records the language of the resources of the app that mxResources.add
// loads, as it computes it (setAndPersistLanguage switches to the lower case
// of mxClient.language with it), in every theme, as the theme Fusion can be
// shown later without a restart (it only records the name)
(function()
{
	var mxResourcesAdd = mxResources.add;

	mxResources.add = function(basename, lan)
	{
		if (typeof RESOURCE_BASE !== 'undefined' && basename == RESOURCE_BASE)
		{
			var added = (lan != null) ? String(lan) : ((mxClient.language != null) ?
				String(mxClient.language).toLowerCase() : mxConstants.NONE);

			if (added != mxConstants.NONE)
			{
				SimpleUi.addedLanguage = added;
			}
		}

		return mxResourcesAdd.apply(this, arguments);
	};
})();

/**
 * Clear Default Style of other sessions also removes the default style of
 * the connectors of the theme (userEdgeStyle in the settings, see
 * SimpleCalm.js), which only the theme reads, as the previous look resets
 * the style it marks, so that a later switch into the theme does not bring
 * it back. Other sessions keep the default styles of before until a switch
 * into the theme.
 */
(function()
{
	var editorUiInit = EditorUi.prototype.init;

	EditorUi.prototype.init = function()
	{
		editorUiInit.apply(this, arguments);

		var clear = (!Editor.isModernSession() && this.actions != null) ?
			this.actions.get('clearDefaultStyle') : null;

		if (clear != null)
		{
			var clearPrevious = clear.funct;

			clear.funct = function()
			{
				var result = clearPrevious.apply(this, arguments);

				if (typeof mxSettings !== 'undefined' && mxSettings.settings != null &&
					mxSettings.settings.userEdgeStyle != null)
				{
					delete mxSettings.settings.userEdgeStyle;
					mxSettings.save();
				}

				return result;
			};
		}
	};
})();

/**
 * The stylesheet of the theme (styles/fusion.css, all rules of its look),
 * which only sessions of the theme load, so the other themes do not load or
 * parse its rules: App.main creates the UI of a start in the theme once it is
 * loaded, and the first switch into the theme without a restart waits for it
 * (doSetCurrentTheme below). Its URL is the one of the link of
 * grapheditor.css with this name, so pages that link that file from another
 * path load it from there too. Outside developer mode it is
 * styles/fusion.min.css, the copy without comments of the build (target app
 * of etc/build/github-build.xml), which bootstrap.js preloads for a start in
 * the theme.
 */
SimpleUi.cssFile = (urlParams['dev'] == '1') ? 'fusion.css' : 'fusion.min.css';

/**
 * Milliseconds after which a stylesheet that neither loaded nor failed counts
 * as failed, so that a start in the theme does not wait for ever.
 */
SimpleUi.cssTimeout = 30000;

/**
 * State of the stylesheet: null before the first call of SimpleUi.loadCss,
 * then loading, loaded or failed.
 */
SimpleUi.cssState = null;

/**
 * Returns the link of grapheditor.css in the page, or null.
 */
SimpleUi.getEditorCssLink = function()
{
	var links = document.getElementsByTagName('link');

	for (var i = 0; i < links.length; i++)
	{
		var href = links[i].getAttribute('href');

		if (links[i].getAttribute('rel') == 'stylesheet' && href != null &&
			/(^|\/)grapheditor\.css([?#]|$)/.test(href))
		{
			return links[i];
		}
	}

	return null;
};

/**
 * Loads the stylesheet of the theme once and calls the given optional
 * function with true when it is loaded, or false if it failed; at once if
 * it is loaded or failed, else in the order of the calls. The link goes
 * right after the link of grapheditor.css, where its rules were before, so
 * the order of the rules stays.
 */
SimpleUi.loadCss = function(fn)
{
	if (SimpleUi.cssState == null)
	{
		SimpleUi.cssState = 'loading';
		SimpleUi.cssWaiting = [];

		var done = function(loaded)
		{
			if (SimpleUi.cssState == 'loading')
			{
				SimpleUi.cssState = (loaded) ? 'loaded' : 'failed';
				var waiting = SimpleUi.cssWaiting;
				SimpleUi.cssWaiting = null;

				for (var i = 0; i < waiting.length; i++)
				{
					waiting[i](loaded);
				}
			}
		};

		try
		{
			var base = SimpleUi.getEditorCssLink();
			var url = (base != null) ? base.getAttribute('href').replace(
				/grapheditor\.css(?=[?#]|$)/, SimpleUi.cssFile) :
				STYLE_PATH + '/' + SimpleUi.cssFile;
			var link = document.createElement('link');
			link.setAttribute('rel', 'stylesheet');
			link.setAttribute('type', 'text/css');

			link.onload = function()
			{
				done(true);
			};

			link.onerror = function()
			{
				done(false);
			};

			link.setAttribute('href', url);

			if (base != null && base.parentNode != null)
			{
				// After the copy of grapheditor.css for old browsers, if any
				var after = (base.compatibleStyle != null &&
					base.compatibleStyle.parentNode == base.parentNode) ?
					base.compatibleStyle : base;
				base.parentNode.insertBefore(link, after.nextSibling);
			}
			else
			{
				document.getElementsByTagName('head')[0].appendChild(link);
			}

			// Browsers without light-dark get the light colors in a copy right
			// after the link, without replacing :has (see
			// Editor.loadCompatibleCss, which App.main runs for grapheditor.css;
			// they get no sessions of the theme, Editor.fusionThemeSupported)
			Editor.loadCompatibleCss(url, link, true);

			window.setTimeout(function()
			{
				done(false);
			}, SimpleUi.cssTimeout);
		}
		catch (e)
		{
			done(false);
		}
	}

	if (fn != null)
	{
		if (SimpleUi.cssState == 'loading')
		{
			SimpleUi.cssWaiting.push(fn);
		}
		else
		{
			fn(SimpleUi.cssState == 'loaded');
		}
	}
};

/**
 * The scripts of the theme in the order in which they run: js/fusion.min.js
 * (the target app of etc/build/github-build.xml, which has the same list, see
 * the test fusion-scripts of test/simple-modern), or the sources in
 * js/diagramly in developer mode. SimpleUi.js, the first of them, sets
 * SimpleUi.scriptsLoaded. SimpleTidy.js needs TidyActions.js, which is in
 * app.min.js.
 */
SimpleUi.scripts = ['SimpleUi.js', 'SimpleFormat.js', 'SimpleModern.js', 'SimpleDialogs.js',
	'SimpleCalm.js', 'SimpleExport.js', 'SimpleForms.js', 'SimpleBrowser.js', 'SimpleOpen.js',
	'SimplePageData.js', 'SimpleFormParts.js', 'SimpleMoreForms.js', 'SimpleCode.js',
	'SimpleRules.js', 'SimplePreview.js', 'SimpleLayouts.js', 'SimpleLibraries.js',
	'SimpleFiles.js', 'SimpleMessages.js', 'SimpleSettings.js', 'SimpleWindows.js',
	'SimpleStates.js', 'SimpleFillLine.js', 'SimpleAccessibility.js', 'SimpleColor.js',
	'SimpleFrames.js', 'SimpleOmnibox.js', 'SimpleToast.js', 'SimplePreviewBar.js',
	'SimplePaste.js', 'SimpleNextStep.js', 'SimpleSuggestions.js', 'SimpleContextMenu.js',
	'SimplePanels.js', 'SimpleAnimation.js', 'SimpleVersions.js', 'SimpleDataSources.js',
	'SimplePageSetup.js', 'SimpleMarkup.js', 'SimplePages.js', 'SimpleMenus.js',
	'SimpleWording.js', 'SimpleHelp.js', 'SimpleGenerate.js', 'SimpleShapeLibraries.js',
	'SimpleUsedShapes.js', 'SimpleTidy.js'];

/**
 * The bundle of the scripts of the theme. Its URL is the one of the script
 * app.min.js in the page with this name (see getScriptsUrl).
 */
SimpleUi.scriptsFile = 'fusion.min.js';

/**
 * State of the scripts: null before the first call of SimpleUi.loadScripts,
 * then loading, loaded or failed.
 */
SimpleUi.scriptsState = null;

/**
 * Returns the URL of the bundle of the scripts of the theme: next to the
 * script app.min.js of the page, else in js.
 */
SimpleUi.getScriptsUrl = function()
{
	var scripts = document.getElementsByTagName('script');

	for (var i = 0; i < scripts.length; i++)
	{
		var src = scripts[i].getAttribute('src');

		if (src != null && /(^|\/)app\.min\.js([?#]|$)/.test(src))
		{
			// With the version of app.min.js, as the edge can serve the two
			// from different releases for a while after a release
			return src.replace(/app\.min\.js(?=[?#]|$)/, SimpleUi.scriptsFile).replace(/[?#].*$/, '') +
				((typeof EditorUi !== 'undefined' && EditorUi.VERSION != null) ?
				'?v=' + encodeURIComponent(EditorUi.VERSION) : '');
		}
	}

	return 'js/' + SimpleUi.scriptsFile;
};

/**
 * Returns true if the scripts of the theme that ran are of the release of
 * app.min.js: SimpleUi.scriptsVersion (SimpleUi.js) equals EditorUi.VERSION,
 * which the build writes into both bundles (the sources of developer mode
 * have the same placeholder). Only the service workers of the editor
 * precache js/fusion.min.js, so elsewhere a cached app.min.js of the last
 * release can get the scripts of a new one from the network; such a start
 * opens the previous look of Simple like a load that failed (App.leaveFusion).
 */
SimpleUi.isScriptsVersion = function()
{
	return typeof EditorUi === 'undefined' || EditorUi.VERSION == null ||
		SimpleUi.scriptsVersion == EditorUi.VERSION;
};

/**
 * Loads the scripts of the theme once and calls the given optional function
 * with true when they ran, or false if they failed; at once if they ran (eg.
 * in the desktop app, whose bundle has them) or failed, else in the order of
 * the calls. A start in the theme loads them before App.main goes on, as
 * they hook into the start of the app, and the first switch into the theme
 * without a restart loads them before it installs the theme
 * (installSimpleModern adds the hooks of the objects that were created
 * before). The scripts load in parallel and run in their order.
 */
SimpleUi.loadScripts = function(fn)
{
	if (SimpleUi.scriptsState == null)
	{
		SimpleUi.scriptsState = (SimpleUi.scriptsLoaded && SimpleUi.scriptsComplete) ? 'loaded' : 'loading';
		SimpleUi.scriptsWaiting = [];

		if (SimpleUi.scriptsState == 'loading')
		{
			var done = function(loaded)
			{
				if (SimpleUi.scriptsState == 'loading')
				{
					SimpleUi.scriptsState = (loaded && SimpleUi.scriptsLoaded && SimpleUi.scriptsComplete &&
						SimpleUi.isScriptsVersion()) ? 'loaded' : 'failed';
					var waiting = SimpleUi.scriptsWaiting;
					SimpleUi.scriptsWaiting = null;

					for (var i = 0; i < waiting.length; i++)
					{
						waiting[i](SimpleUi.scriptsState == 'loaded');
					}
				}
			};

			try
			{
				var urls = [];

				if (urlParams['dev'] == '1' && typeof drawDevUrl !== 'undefined')
				{
					for (var i = 0; i < SimpleUi.scripts.length; i++)
					{
						urls.push(drawDevUrl + 'js/diagramly/' + SimpleUi.scripts[i]);
					}
				}
				else
				{
					urls.push(SimpleUi.getScriptsUrl());
				}

				var head = document.getElementsByTagName('head')[0];
				var pending = urls.length;

				for (var i = 0; i < urls.length; i++)
				{
					var script = document.createElement('script');
					script.setAttribute('type', 'text/javascript');
					script.async = false;

					script.onload = function()
					{
						if (--pending == 0)
						{
							done(true);
						}
					};

					script.onerror = function()
					{
						done(false);
					};

					script.setAttribute('src', urls[i]);
					head.appendChild(script);
				}

				window.setTimeout(function()
				{
					done(false);
				}, SimpleUi.cssTimeout);
			}
			catch (e)
			{
				done(false);
			}
		}
	}

	if (fn != null)
	{
		if (SimpleUi.scriptsState == 'loading')
		{
			SimpleUi.scriptsWaiting.push(fn);
		}
		else
		{
			fn(SimpleUi.scriptsState == 'loaded');
		}
	}
};

/**
 * Loads the scripts and the stylesheet of the theme in parallel and calls
 * the given optional function with true when both are loaded, or false if
 * one of them failed (see loadScripts and loadCss).
 */
SimpleUi.loadTheme = function(fn)
{
	var pending = 2;
	var result = true;

	var done = function(loaded)
	{
		result = result && loaded;

		if (--pending == 0 && fn != null)
		{
			fn(result);
		}
	};

	SimpleUi.loadCss(done);
	SimpleUi.loadScripts(done);
};

/**
 * A switch from Classic or the previous look of Simple into the theme Fusion
 * needs no restart: it installs the hooks of the theme that the start of the
 * other theme left (installSimpleModern) and changes the look like a switch
 * between Classic and Simple, so the file, its history and the selection
 * stay. The first one waits for the scripts and the stylesheet of the theme
 * (SimpleUi.loadTheme), and a switch in the meantime wins; if one of them
 * fails, the theme is stored and shown after a restart. A switch back to
 * Classic or the previous look of Simple needs no restart either (the hooks
 * stay and check the theme). Switches to or from Sketch, Minimal and Atlas
 * need a restart, as between those themes and Classic.
 */
(function()
{
	var editorUiDoSetCurrentTheme = EditorUi.prototype.doSetCurrentTheme;

	EditorUi.prototype.doSetCurrentTheme = function(value, force)
	{
		// Any switch ends a switch into the theme that waits for its stylesheet
		this.simpleThemeSwitch = null;

		// Forced switches (tests) change the look and keep the theme
		if (force)
		{
			return editorUiDoSetCurrentTheme.apply(this, arguments);
		}
		else if (Editor.isFusionTheme(value) && Editor.modernTheme)
		{
			return true;
		}
		else if (this.isSimpleThemeSwitchLive(value))
		{
			if (Editor.isFusionTheme(value))
			{
				var token = {};
				this.simpleThemeSwitch = token;

				SimpleUi.loadTheme(mxUtils.bind(this, function(loaded)
				{
					if (this.simpleThemeSwitch == token)
					{
						this.simpleThemeSwitch = null;

						if (!loaded)
						{
							this.alert(mxResources.get('restartForChangeRequired'));
						}
						else if (!Editor.modernTheme && this.isSimpleThemeSwitchLive(value))
						{
							// The hooks are installed in the theme, as at its start
							this.editor.graph.stopEditing(false);
							Editor.modernTheme = true;
							Editor.currentTheme = 'simple';
							this.installSimpleModern();
							editorUiDoSetCurrentTheme.call(this, 'simple', true);
							this.simpleThemeSwitched();
						}
					}
				}));
			}
			else
			{
				Editor.modernTheme = false;
				editorUiDoSetCurrentTheme.call(this, value, true);
				this.simpleThemeSwitched();
			}

			return true;
		}
		else if (Editor.isFusionTheme(value) || Editor.modernTheme)
		{
			return false;
		}

		return editorUiDoSetCurrentTheme.apply(this, arguments);
	};
})();

/**
 * Returns the theme of the session for the notice of the theme
 * (SimpleToast.js) before a switch to the theme Fusion: the stored theme
 * (also Automatic) if the URL does not set it, else the current theme.
 */
EditorUi.prototype.getSimpleThemeBefore = function()
{
	var stored = mxSettings.getUi();

	return (urlParams['ui'] == null && !Editor.isFusionTheme(stored)) ?
		((stored != null) ? stored : '') : Editor.currentTheme;
};

/**
 * The themes that the notice of the theme offers (the values of the theme
 * menu, see SimpleToast.js).
 */
SimpleUi.themeNoticeThemes = ['', 'kennedy', 'dark', 'default', 'simple', 'sketch', 'min', 'atlas'];

/**
 * Returns the state of the notice of the theme (SimpleToast.js) from the
 * main settings with checked values, or null. Here, as a switch to the theme
 * Fusion from a session that did not load its scripts records it.
 */
SimpleUi.getThemeNotice = function()
{
	var value = null;

	try
	{
		var settings = (mxSettings.isMainSettings()) ? mxSettings.settings :
			((isLocalStorage) ? mxSettings.getMainSettings() : null);
		value = (settings != null) ? settings.modernNotice : null;
	}
	catch (e)
	{
		// Unreadable settings show no notice
		return {closed: true};
	}

	if (value == null || typeof value !== 'object')
	{
		return null;
	}

	var number = function(n)
	{
		return (typeof n === 'number' && isFinite(n)) ? n : 0;
	};

	return {previous: (mxUtils.indexOf(SimpleUi.themeNoticeThemes, value.previous) >= 0) ?
		value.previous : '', shown: number(value.shown), since: number(value.since),
		closed: value.closed === true};
};

/**
 * Stores the given state of the notice of the theme in the main settings,
 * like mxSettings.setUi.
 */
SimpleUi.setThemeNotice = function(value)
{
	try
	{
		if (mxSettings.isMainSettings())
		{
			mxSettings.settings.modernNotice = value;
			mxSettings.save();
		}
		else if (isLocalStorage)
		{
			var settings = mxSettings.getMainSettings();
			settings.modernNotice = value;
			localStorage.setItem('.drawio-config', JSON.stringify(settings));
		}
	}
	catch (e)
	{
		// Ignores quota exceeded
	}
};

/**
 * Stores the given theme of before a switch to the theme Fusion and the time
 * of the switch for the notice of the theme, Help ▸ Back to the previous
 * theme (SimpleHelp.js) and the count of the days in the theme
 * (logThemeSwitch). A notice that was closed stays closed: only the theme
 * and the time change, so it is not shown again.
 */
SimpleUi.recordThemeNotice = function(before)
{
	var state = SimpleUi.getThemeNotice();
	var closed = state != null && state.closed;

	SimpleUi.setThemeNotice({previous: (mxUtils.indexOf(SimpleUi.themeNoticeThemes,
		before) >= 0) ? before : '', shown: (closed) ? state.shown : 0,
		since: Date.now(), closed: closed});
};

/**
 * The names of the themes (the values of the theme menu) in the counts of
 * the switches (logThemeSwitch). Other values count as other.
 */
SimpleUi.themeLogNames = {'': 'auto', kennedy: 'classic', dark: 'classic', 'default': 'classic',
	simple: 'simple', sketch: 'sketch', min: 'minimal', atlas: 'atlas'};

/**
 * Returns the name of the given theme in the counts of the switches.
 */
SimpleUi.getThemeLogName = function(theme)
{
	theme = (theme != null) ? theme : '';

	return (Object.prototype.hasOwnProperty.call(SimpleUi.themeLogNames, theme)) ?
		SimpleUi.themeLogNames[theme] : 'other';
};

/**
 * Returns the name of the days since the last switch to the theme Fusion in
 * the counts of the switches back: 0, 1, 2 to 6, 7 to 27 and 28 or more, or
 * unknown without a recorded switch (a start with ui=fusion, or a stored
 * Fusion of before the notice).
 */
SimpleUi.getThemeDaysLogName = function(since, now)
{
	var days = (since > 0) ? Math.floor((now - since) / (24 * 60 * 60 * 1000)) : -1;

	return (days < 0) ? 'daysUnknown' : ((days <= 1) ? 'days' + days : ((days < 7) ? 'days2to6' :
		((days < 28) ? 'days7to27' : 'days28plus')));
};

/**
 * Counts a switch to or from the theme Fusion with the given value of the
 * theme menu in the counts of clicks (EditorUi.logUiClick, which counts only
 * in the sample of sessions, see EditorUi.uiLogRate): theme.toFusion.<the
 * theme of before>, theme.fromFusion.<the new theme> and
 * theme.fromFusion.<days since the switch to Fusion>. Only these fixed names
 * and their counts are sent: no names of files or pages and nothing that
 * identifies the user or the session (concept "Fusion-Ideen in Simple" 4.6).
 */
SimpleUi.logThemeSwitch = function(value)
{
	if (typeof EditorUi.logUiClick !== 'function')
	{
		return;
	}

	if (Editor.isFusionTheme(value) && !Editor.modernTheme)
	{
		EditorUi.logUiClick('theme.toFusion.' + SimpleUi.getThemeLogName(Editor.currentTheme));
	}
	else if (!Editor.isFusionTheme(value) && Editor.modernTheme)
	{
		var state = SimpleUi.getThemeNotice();
		EditorUi.logUiClick('theme.fromFusion.' + SimpleUi.getThemeLogName(value));
		EditorUi.logUiClick('theme.fromFusion.' + SimpleUi.getThemeDaysLogName(
			(state != null) ? state.since : 0, Date.now()));
	}
};

/**
 * A switch to the theme Fusion from a session that did not load the scripts
 * of the theme (which have the notice, recordSimpleThemeSwitch in
 * SimpleToast.js) records the theme of before here, also if the switch needs
 * a restart. The first switch without a restart loads the scripts
 * (doSetCurrentTheme) and shows the notice when it ends: the callback that
 * marks it is added before the switch adds its own (the callbacks of
 * SimpleUi.loadScripts run in their order). Later switches are recorded by
 * the notice itself.
 */
(function()
{
	var editorUiSetCurrentTheme = EditorUi.prototype.setCurrentTheme;

	EditorUi.prototype.setCurrentTheme = function(value)
	{
		var before = null;

		// Counts the switches to and from the theme (before the switch, which
		// changes the theme)
		SimpleUi.logThemeSwitch(value);

		// Any switch drops a notice that waits (as in SimpleToast.js)
		if (typeof this.recordSimpleThemeSwitch !== 'function')
		{
			this.simpleThemeNoticePending = false;
		}

		if (typeof this.recordSimpleThemeSwitch !== 'function' && Editor.isFusionTheme(value) &&
			!Editor.modernTheme)
		{
			before = this.getSimpleThemeBefore();

			if (this.isSimpleThemeSwitchLive(value))
			{
				SimpleUi.loadScripts(mxUtils.bind(this, function(loaded)
				{
					if (loaded && this.simpleThemeSwitch != null)
					{
						this.simpleThemeNoticePending = true;
					}
				}));
			}
		}

		var result = editorUiSetCurrentTheme.apply(this, arguments);

		if (before != null)
		{
			SimpleUi.recordThemeNotice(before);
		}

		return result;
	};
})();

/**
 * Returns true if a switch to the given theme (a value of the theme menu) is
 * a switch to or from the theme Fusion that needs no restart: between Fusion
 * and Classic (also automatic and dark) or the previous look of Simple, in
 * the editor of the app.
 */
EditorUi.prototype.isSimpleThemeSwitchLive = function(value)
{
	var ui = this;

	var plain = function(theme)
	{
		return theme == 'simple' || ui.isDefaultTheme(theme);
	};

	var from = (Editor.modernTheme) ? 'fusion' : Editor.currentTheme;
	var to = (value != null) ? value : '';

	return ((from == 'fusion' && plain(to)) || (Editor.isFusionTheme(to) && plain(from))) &&
		!this.editor.isChromelessView() && this.format != null && this.menus != null;
};

/**
 * Ends a switch to or from the theme Fusion without a restart (see
 * doSetCurrentTheme): the shapes are built again in the new look (their
 * size, names and the search of the Shapes card are set when they are
 * built), and modernThemeChanged is fired.
 */
EditorUi.prototype.simpleThemeSwitched = function()
{
	if (this.sidebar != null)
	{
		this.sidebar.refresh();
	}

	this.fireEvent(new mxEventObject('modernThemeChanged'));
};

/**
 * Installs the hooks of Simple Modern that the start of another theme left
 * (SimpleUi.installHook and SimpleUi.install), in the order of a start in
 * the theme, so that the theme can be shown without a restart, and the hooks
 * of installAfter of the objects that were created before the scripts of the
 * theme loaded (the first switch into the theme loads them). Does nothing if
 * they are installed.
 */
EditorUi.prototype.installSimpleModern = function()
{
	if (Editor.isModernSession())
	{
		return;
	}

	Editor.modernInstalled = true;
	var hooks = SimpleUi.pendingHooks;
	SimpleUi.pendingHooks = [];

	for (var i = 0; i < hooks.length; i++)
	{
		hooks[i]();
	}

	var objs = [this.actions, this.menus, this.format, this.hoverIcons, this];
	var pending = [];

	for (var i = 0; i < objs.length; i++)
	{
		var list = (objs[i] != null) ? objs[i].simplePendingInstall : null;

		if (list != null)
		{
			delete objs[i].simplePendingInstall;

			for (var j = 0; j < list.length; j++)
			{
				pending.push({obj: objs[i], index: list[j].index, fn: list[j].fn});
			}
		}
	}

	// The hooks of installAfter of objects that were created before the
	// scripts loaded, in the order of a start: by object (in the order of
	// their creation in the constructor of EditorUi), then by script
	var index = SimpleUi.installCount;

	for (var i = 0; i < objs.length; i++)
	{
		for (var j = 0; j < SimpleUi.afterHooks.length && objs[i] != null; j++)
		{
			var hook = SimpleUi.afterHooks[j];

			if (hook.proto.isPrototypeOf(objs[i]) && (objs[i].simpleAfterHooks == null ||
				!objs[i].simpleAfterHooks[hook.id]))
			{
				objs[i].simpleAfterHooks = objs[i].simpleAfterHooks || {};
				objs[i].simpleAfterHooks[hook.id] = true;
				pending.push({obj: objs[i], index: index++, fn: hook.fn});
			}
		}
	}

	SimpleUi.installCount = index;

	pending.sort(function(a, b)
	{
		return a.index - b.index;
	});

	for (var i = 0; i < pending.length; i++)
	{
		pending[i].fn.call(pending[i].obj);
	}
};
