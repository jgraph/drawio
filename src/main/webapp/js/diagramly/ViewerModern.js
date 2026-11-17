/**
 * Copyright (c) 2026, JGraph Holdings Ltd
 * Copyright (c) 2026, draw.io AG
 */
/**
 * The new Viewer (concept report 14.2 and 14.3, mockups 63 and 64): the
 * diagram in the page as before, with one floating bar in the tokens of
 * Simple Modern instead of the grey toolbar of GraphViewer.addToolbar.
 *
 * - The bar is at the top right of the diagram (toolbar-position top, the
 *   default, and inline, as the classic inline toolbar is in the diagram
 *   too) or at the bottom right (bottom). It sticks to the visible part of
 *   the diagram, is shown on hover and focus and fades out when the pointer
 *   leaves; toolbar-nohide and devices without hover (phones, tablets)
 *   always show it.
 * - The tokens of the toolbar option keep their order and meaning: pages
 *   (previous, the page with a menu of the pages, next), zoom (zoom out,
 *   zoom in, Fit), layers, tags, lightbox (open in Lightbox) and the keys of
 *   toolbar-buttons; new tokens are language (the labels of the diagram in
 *   another language, label_<code>), export (PNG, SVG and JPEG made in the
 *   browser) and edit. Unknown tokens are ignored as before.
 * - Phones (narrower than 600) and diagrams narrower than the bar get the
 *   compact bar: pages, Fit and open in Lightbox (everything else is in the
 *   Lightbox), on phones at the bottom.
 *
 * The switch (report 14.3): "viewer-ui": "modern" in data-mxgraph, else the
 * viewer-ui URL parameter (urlParams), else the ui of the site configuration
 * (GraphViewer.configure({ui: 'modern'}) or the viewer block of
 * window.DRAWIO_CONFIG), else classic. Without it nothing of this file runs:
 * the toolbar, the CSS and the DOM of the viewer are those of before.
 *
 * The viewer bundles have no SimpleUi and no grapheditor.css or fusion.css:
 * the bar has its own small CSS (ViewerModern.getCss, the tokens of
 * fusion.css under .geSmViewer), added to the page with the first bar.
 *
 * Security: the viewer shows untrusted diagrams in other pages. Page names,
 * layer names, tags, titles and language names are written as text
 * (mxUtils.write), languages come only from attribute names that match
 * languagePattern, Edit opens links through Graph.openLink (sanitized) or
 * the editor with the diagram (Editor.editAsNew), and the images of
 * toolbar-buttons come from the configuration of the page, as before.
 */
var ViewerModern = function(viewer)
{
	this.viewer = viewer;
	this.graph = viewer.graph;
	this.config = viewer.graphConfig;
	this.controls = [];
	this.groups = [];
	this.compact = false;
	this.phone = false;
	this.init();
};

/**
 * Width of the screen below which the bar has the phone layout with a
 * coarse pointer (see isPhone).
 */
ViewerModern.phoneWidth = 600;

/**
 * Distance of the bar from the sides of the diagram.
 */
ViewerModern.inset = 12;

/**
 * Minimum height of diagrams with the bar (its height on touch, 44 and twice
 * an inset of 4; the bar of 44 elsewhere is centered), see GraphViewer.init.
 */
ViewerModern.minHeight = 52;

/**
 * Milliseconds after the pointer has left the diagram until the bar fades.
 */
ViewerModern.hideDelay = 300;

/**
 * Milliseconds after the last touch until the bar fades on devices that
 * can also hover (touchscreen laptops), where a touch shows the bar.
 */
ViewerModern.touchHideDelay = 4000;

/**
 * Tokens of the toolbar that the classic toolbar knows only from
 * toolbar-buttons: a definition there replaces the button of the bar, so
 * hosts keep their own button (eg. Edit of Confluence and Jira, which they
 * disable with disableButton for readers without edit rights).
 */
ViewerModern.customTokens = {'edit': true, 'export': true, 'language': true};

/**
 * Devices that cannot hover (phones and tablets), where the bar is always
 * shown. Not (hover: none) alone, which is also true without a pointer.
 */
ViewerModern.touchOnly = '(hover: none) and (pointer: coarse)';

/**
 * Scale of PNG and JPEG exports.
 */
ViewerModern.exportScale = 2;

/**
 * Formats of the Export menu (made in the browser). The export-formats
 * option and the exportFormats of the site configuration choose from these.
 */
ViewerModern.exportFormats = ['png', 'svg', 'jpeg'];

/**
 * Translated labels: label_<code> with a code of two or three lowercase
 * letters and optional subtags of letters and digits in any case after - or
 * _ (eg. pt-BR, zh_CN, as the new Lightbox), as the language code of the
 * editor can write them. See isLanguageCode.
 */
ViewerModern.languagePattern = /^label_([a-z]{2,3}(?:[-_][a-zA-Z0-9]+)*)$/;

/**
 * Most attributes of a cell that are searched for languages, as
 * LightboxModern.maxLanguageAttributes (the scan of a crafted cell with
 * 20,000 attributes took 1.6 s on each change of the model).
 */
ViewerModern.maxLanguageAttributes = 1000;

/**
 * Returns true if the given code is a language of languagePattern whose
 * primary code has two letters or is a language of the editor with three
 * (mxLanguageMap, eg. fil), so data such as label_top or label_alt-text is
 * not taken for a translation.
 */
ViewerModern.isLanguageCode = function(code)
{
	if (typeof code !== 'string' || !ViewerModern.languagePattern.test('label_' + code))
	{
		return false;
	}

	var primary = code.split(/[-_]/)[0];

	return primary.length == 2 || (typeof mxLanguageMap !== 'undefined' &&
		Object.prototype.hasOwnProperty.call(mxLanguageMap, primary));
};

/**
 * Methods of the graph that read the language of the diagram (labels,
 * placeholders and tooltips), see GraphViewer.installDiagramLanguage.
 */
ViewerModern.languageMethods = ['convertValueToString', 'convertValueToTooltip',
	'getTooltipForCell', 'replacePlaceholders'];

/**
 * Returns a data URI of an icon in the style of SimpleUi.icons (24 grid,
 * stroke 1.8, round caps) with the given content.
 */
ViewerModern.createSvgIcon = function(content)
{
	return Editor.createSvgDataUri('<svg xmlns="http://www.w3.org/2000/svg" ' +
		'viewBox="0 0 24 24" fill="none" stroke="#000" stroke-width="1.8" ' +
		'stroke-linecap="round" stroke-linejoin="round">' + content + '</svg>');
};

/**
 * Icons of the bar (the same paths as SimpleUi.icons and LightboxModern.icons).
 */
ViewerModern.icons = {
	chevronLeft: ViewerModern.createSvgIcon('<path d="M14.5 6l-6 6 6 6"/>'),
	chevronRight: ViewerModern.createSvgIcon('<path d="M9.5 6l6 6-6 6"/>'),
	minus: ViewerModern.createSvgIcon('<path d="M5 12h14"/>'),
	plus: ViewerModern.createSvgIcon('<path d="M12 5v14M5 12h14"/>'),
	fit: ViewerModern.createSvgIcon('<path d="M4 9V4h5M15 4h5v5M20 15v5h-5M9 20H4v-5"/>'),
	layers: ViewerModern.createSvgIcon('<path d="M12 3.5l8.5 4.5-8.5 4.5L3.5 8z"/>' +
		'<path d="M3.5 12l8.5 4.5 8.5-4.5M3.5 16l8.5 4.5 8.5-4.5"/>'),
	tags: ViewerModern.createSvgIcon('<path d="M4 4.5h7.5l8.5 8.5-7 7-9-9z"/><circle cx="8.5" cy="9" r="1.5"/>'),
	globe: ViewerModern.createSvgIcon('<circle cx="12" cy="12" r="8.5"/><path d="M3.5 12h17M12 3.5c2.5 2.6 3.5 5.4 3.5 ' +
		'8.5s-1 5.9-3.5 8.5c-2.5-2.6-3.5-5.4-3.5-8.5s1-5.9 3.5-8.5z"/>'),
	download: ViewerModern.createSvgIcon('<path d="M12 4v11M7 10l5 5 5-5M5 19.5h14"/>'),
	external: ViewerModern.createSvgIcon('<path d="M13.5 4.5h6v6M19.5 4.5l-8 8M17.5 13.5v5' +
		'a1 1 0 0 1-1 1h-11a1 1 0 0 1-1-1v-11a1 1 0 0 1 1-1h5"/>'),
	edit: ViewerModern.createSvgIcon('<path d="M4 20l4.5-1 10-10a2.1 2.1 0 0 0-3-3l-10 10z"/>'),
	check: ViewerModern.createSvgIcon('<path d="M5 12.5l4.5 4.5L19 7.5"/>')
};

/**
 * Returns the given resource or the given English text if the page has no
 * resources (as the default toolbar).
 */
ViewerModern.res = function(key, params, fallback)
{
	return mxResources.get(key, params, fallback);
};

/**
 * Returns the name of the given language code in that language.
 */
ViewerModern.getLanguageName = function(code)
{
	// The codes of the map are in lowercase (pt-br)
	var key = String(code).toLowerCase();
	var name = (typeof mxLanguageMap !== 'undefined' &&
		Object.prototype.hasOwnProperty.call(mxLanguageMap, key)) ?
		mxLanguageMap[key] : null;

	if (name == null || name == '')
	{
		try
		{
			name = new Intl.DisplayNames([code], {type: 'language'}).of(code);
			name = name.charAt(0).toLocaleUpperCase(code) + name.substring(1);
		}
		catch (e)
		{
			name = code;
		}
	}

	return name;
};

/**
 * Site configuration of the viewer (report 14.3): ui is classic (default)
 * or modern, exportFormats limits the formats of the Export menu,
 * translations is auto (default), on or off. Set by GraphViewer.configure.
 */
GraphViewer.siteConfig = null;

/**
 * Sets the site configuration of the viewers that are created after this
 * call, eg. GraphViewer.configure({ui: 'modern'}) before
 * GraphViewer.processElements().
 */
GraphViewer.configure = function(config)
{
	GraphViewer.siteConfig = (config != null && typeof config === 'object') ? config : null;
};

/**
 * Returns the site configuration: the one of GraphViewer.configure, else the
 * viewer block of window.DRAWIO_CONFIG, or null.
 */
GraphViewer.getSiteConfig = function()
{
	var config = GraphViewer.siteConfig;

	if (config == null && window.DRAWIO_CONFIG != null && typeof window.DRAWIO_CONFIG === 'object')
	{
		config = window.DRAWIO_CONFIG.viewer;
	}

	return (config != null && typeof config === 'object') ? config : null;
};

/**
 * Returns the look of a viewer with the given data-mxgraph options, modern
 * or classic: viewer-ui of the diagram, else the viewer-ui URL parameter,
 * else the ui of the site configuration, else classic.
 */
GraphViewer.getViewerUi = function(graphConfig)
{
	var ui = (graphConfig != null) ? graphConfig['viewer-ui'] : null;

	if (ui == null && window.urlParams != null)
	{
		ui = urlParams['viewer-ui'];
	}

	if (ui == null)
	{
		var site = GraphViewer.getSiteConfig();
		ui = (site != null) ? site.ui : null;
	}

	return (typeof ui === 'string' && ui == 'modern') ? 'modern' : 'classic';
};

(function()
{
	var graphViewerInit = GraphViewer.prototype.init;

	/**
	 * Sets the look of the viewer before it renders and, in the new look,
	 * the minimum height for the bar and the language of the diagram.
	 */
	GraphViewer.prototype.init = function(container, xmlNode, graphConfig)
	{
		this.viewerUi = GraphViewer.getViewerUi(graphConfig);

		if (this.viewerUi == 'modern')
		{
			// Room for the bar in small diagrams (inline adds the classic
			// toolbar height in init)
			if (graphConfig != null && graphConfig.toolbar != null)
			{
				this.minHeight = Math.max(this.minHeight, ViewerModern.minHeight -
					((graphConfig['toolbar-position'] == 'inline') ? this.toolbarHeight : 0));
			}

			// The labels are painted when the update of the first page ends
			this.addListener('graphInitialized', mxUtils.bind(this, function()
			{
				if (this.diagramLanguage === undefined)
				{
					this.installDiagramLanguage();
				}
			}));
		}

		graphViewerInit.apply(this, arguments);
	};

	var graphViewerAddToolbar = GraphViewer.prototype.addToolbar;

	/**
	 * Adds the bar of the new look instead of the default toolbar.
	 */
	GraphViewer.prototype.addToolbar = function()
	{
		if (this.viewerUi == 'modern')
		{
			this.modernToolbar = new ViewerModern(this);
		}
		else
		{
			graphViewerAddToolbar.apply(this, arguments);
		}
	};

	var graphViewerDisableButton = GraphViewer.prototype.disableButton;

	/**
	 * Disables a button of toolbar-buttons in the bar of the new look.
	 */
	GraphViewer.prototype.disableButton = function(token, tooltip)
	{
		if (this.modernToolbar != null)
		{
			this.modernToolbar.disableButton(token, tooltip);
		}
		else
		{
			graphViewerDisableButton.apply(this, arguments);
		}
	};

	var graphViewerUpdateTitle = GraphViewer.prototype.updateTitle;

	/**
	 * Updates the name of the bar of the new look with the title.
	 */
	GraphViewer.prototype.updateTitle = function(title, titleTooltip)
	{
		graphViewerUpdateTitle.apply(this, arguments);

		if (this.modernToolbar != null)
		{
			this.modernToolbar.setTitle(title);
		}
	};
})();

/**
 * Returns the value of translations: the option of the diagram, else the
 * one of the site configuration, else auto.
 */
GraphViewer.prototype.getTranslationsMode = function()
{
	var value = this.graphConfig['translations'];

	if (value == null)
	{
		var site = GraphViewer.getSiteConfig();
		value = (site != null) ? site.translations : null;
	}

	return (typeof value === 'string' && (value == 'on' || value == 'off')) ? value : 'auto';
};

/**
 * Clears the languages of getDiagramLanguages if the given edit of the model
 * may change them: all changes but those of the visibility, the collapsed
 * state, the geometry and the style of cells (layers, tags and folding).
 */
GraphViewer.prototype.invalidateDiagramLanguages = function(edit)
{
	var changes = (edit != null) ? edit.changes : null;

	if (this.diagramLanguages != null)
	{
		if (changes == null)
		{
			this.diagramLanguages = null;
		}
		else
		{
			for (var i = 0; i < changes.length; i++)
			{
				var c = changes[i];

				if (!(c instanceof mxVisibleChange || c instanceof mxCollapseChange ||
					c instanceof mxGeometryChange || c instanceof mxStyleChange))
				{
					this.diagramLanguages = null;
					break;
				}
			}
		}
	}
};

/**
 * Finds the languages of the labels of the current page: the codes of the
 * label_<code> attributes and the number of labels of each, and the number
 * of labels. Codes that differ only in case are one language, with the code
 * of most labels (the labels are read in that case). Nothing is stored in
 * the file. Reads at most ViewerModern.maxLanguageAttributes attributes of
 * each cell, and once for each page and change of the labels (the result is
 * kept until invalidateDiagramLanguages clears it).
 */
GraphViewer.prototype.getDiagramLanguages = function()
{
	var model = this.graph.getModel();

	if (this.diagramLanguagesModel != model)
	{
		this.diagramLanguagesModel = model;
		this.diagramLanguages = null;

		model.addListener(mxEvent.CHANGE, mxUtils.bind(this, function(sender, evt)
		{
			this.invalidateDiagramLanguages(evt.getProperty('edit'));
		}));
	}

	if (this.diagramLanguages != null)
	{
		return this.diagramLanguages;
	}

	var counts = Object.create(null);
	var total = 0;

	for (var id in model.cells)
	{
		if (Object.prototype.hasOwnProperty.call(model.cells, id))
		{
			var cell = model.cells[id];

			if (cell != null && cell != model.root && model.getParent(cell) != model.root)
			{
				var value = cell.value;

				if (mxUtils.isNode(value))
				{
					var label = value.getAttribute('label');

					if (label != null && label != '')
					{
						total++;
					}

					var attrs = value.attributes;
					var count = Math.min(attrs.length, ViewerModern.maxLanguageAttributes);

					for (var i = 0; i < count; i++)
					{
						var attr = attrs[i];
						var m = ViewerModern.languagePattern.exec(attr.nodeName);

						if (m != null && attr.nodeValue != '' && ViewerModern.isLanguageCode(m[1]))
						{
							counts[m[1]] = (counts[m[1]] || 0) + 1;
						}
					}
				}
				else if (value != null && value !== '')
				{
					total++;
				}
			}
		}
	}

	var langs = [];
	var byKey = Object.create(null);

	for (var code in counts)
	{
		var key = code.toLowerCase();
		var lang = byKey[key];

		if (lang == null)
		{
			byKey[key] = {code: code, count: counts[code]};
			langs.push(byKey[key]);
		}
		else if (counts[code] > lang.count)
		{
			lang.code = code;
			lang.count = counts[code];
		}
	}

	langs.sort(function(a, b)
	{
		return (a.code < b.code) ? -1 : ((a.code > b.code) ? 1 : 0);
	});

	this.diagramLanguages = {languages: langs, labels: total};

	return this.diagramLanguages;
};

/**
 * Shows the labels of this viewer in its own language (diagramLanguage:
 * undefined follows Graph.translateDiagram, null shows the original labels,
 * a code the labels of that language). The language is set for the calls of
 * the graph that read it, so other viewers in the page keep theirs. The
 * start language is diagram-language of the options, else the language of
 * the browser if the page has it and the bar has the language token.
 */
GraphViewer.prototype.installDiagramLanguage = function()
{
	var viewer = this;
	var graph = this.graph;
	this.diagramLanguage = undefined;
	this.hostLang = graph.container.getAttribute('lang');

	var wrap = function(name)
	{
		var fn = graph[name];

		if (typeof fn === 'function')
		{
			graph[name] = function()
			{
				if (viewer.diagramLanguage === undefined)
				{
					return fn.apply(this, arguments);
				}

				var translate = Graph.translateDiagram;
				var lang = Graph.diagramLanguage;
				Graph.translateDiagram = viewer.diagramLanguage != null;
				Graph.diagramLanguage = (viewer.diagramLanguage != null) ? viewer.diagramLanguage : lang;

				try
				{
					return fn.apply(this, arguments);
				}
				finally
				{
					Graph.translateDiagram = translate;
					Graph.diagramLanguage = lang;
				}
			};
		}
	};

	for (var i = 0; i < ViewerModern.languageMethods.length; i++)
	{
		wrap(ViewerModern.languageMethods[i]);
	}

	var pinned = this.graphConfig['diagram-language'];

	// The case of a code does not matter (pt-br shows label_pt-BR)
	if (ViewerModern.isLanguageCode(pinned))
	{
		var found = this.findDiagramLanguage(pinned);
		this.diagramLanguage = (found != null) ? found : pinned;
	}
	else if (this.getTranslationsMode() != 'off' &&
		mxUtils.indexOf(this.toolbarItems, 'language') >= 0)
	{
		var langs = this.getDiagramLanguages().languages;
		var nav = String(navigator.language || '');
		var found = this.findDiagramLanguage(nav, langs);

		if (found == null)
		{
			found = this.findDiagramLanguage(nav.split('-')[0], langs);
		}

		// Else undefined (follows Graph.translateDiagram)
		if (found != null)
		{
			this.diagramLanguage = found;
		}
	}

	this.updateLabelLanguage();
};

/**
 * Returns the code of the language of the labels of the current page (or of
 * the given languages of getDiagramLanguages) that is the given code in any
 * case, or null.
 */
GraphViewer.prototype.findDiagramLanguage = function(code, langs)
{
	langs = (langs != null) ? langs : this.getDiagramLanguages().languages;
	code = String(code).toLowerCase();

	for (var i = 0; i < langs.length; i++)
	{
		if (langs[i].code.toLowerCase() == code)
		{
			return langs[i].code;
		}
	}

	return null;
};

/**
 * Shows the labels in the given language (null for the original labels).
 */
GraphViewer.prototype.setDiagramLanguage = function(code)
{
	if (code != this.diagramLanguage)
	{
		this.diagramLanguage = code;
		this.updateLabelLanguage();
		this.graph.refresh();
		this.updateOrigin();
		this.fireEvent(new mxEventObject('diagramLanguageChanged'));
	}
};

/**
 * Returns the language shown or null for the original labels.
 */
GraphViewer.prototype.getDiagramLanguage = function()
{
	return (this.diagramLanguage !== undefined) ? this.diagramLanguage :
		((Graph.translateDiagram && Graph.diagramLanguage != null &&
		Graph.diagramLanguage != '') ? Graph.diagramLanguage : null);
};

/**
 * Sets the lang attribute of the diagram for screen readers while a
 * translation is shown, and restores the one of the page.
 */
GraphViewer.prototype.updateLabelLanguage = function()
{
	var container = this.graph.container;
	var lang = (this.diagramLanguage != null) ? this.diagramLanguage : this.hostLang;

	if (lang != null)
	{
		container.setAttribute('lang', lang);
	}
	else
	{
		container.removeAttribute('lang');
	}
};

/**
 * Adds the CSS of the bar to the page once.
 */
ViewerModern.initCss = function()
{
	if (ViewerModern.styleElement == null)
	{
		try
		{
			// Static CSS without data of diagrams (textContent, no markup)
			var style = document.createElement('style');
			style.setAttribute('type', 'text/css');
			style.textContent = ViewerModern.getCompatibleCss();
			ViewerModern.styleElement = style;

			if (!GraphViewer.blockedAncestorFrames())
			{
				document.getElementsByTagName('head')[0].appendChild(style);
			}
		}
		catch (e)
		{
			// ignore
		}
	}
};

/**
 * Returns the CSS of the bar (getCss) for this browser: without light-dark
 * (Safari before 17.5, Chrome before 123, Firefox before 120) its light
 * values (see Editor.replaceLightDarkFunctions), so the bar is not
 * transparent.
 */
ViewerModern.getCompatibleCss = function()
{
	var css = ViewerModern.getCss();

	if (!mxUtils.lightDarkColorSupported && typeof Editor !== 'undefined' &&
		typeof Editor.replaceLightDarkFunctions === 'function')
	{
		css = Editor.replaceLightDarkFunctions(css);
	}

	return css;
};

/**
 * Returns the CSS of the bar: the tokens of Simple Modern (fusion.css,
 * .geSimpleModern; the tests style-guide-tokens of simple-modern and
 * tokens-and-lint of viewer-modern check that they are equal, so a change of
 * a token in fusion.css must be copied here) under .geSmViewer, and the
 * components. Inherited properties of the page are reset on the roots.
 */
ViewerModern.getCss = function()
{
	return [
		'.geSmViewer {',
		'	--sm-surface: light-dark(#FFFFFF, #1C1F24);',
		'	--sm-surface-2: light-dark(#F2F4F7, #252930);',
		'	--sm-border: light-dark(#E3E6EB, #2D3239);',
		'	--sm-text: light-dark(#1B1F24, #E8EAED);',
		'	--sm-text-2: light-dark(#5A626E, #A8B0BA);',
		'	--sm-text-3: light-dark(#646C79, #8F97A2);',
		'	--sm-accent: light-dark(#1F5FDB, #6A9BFF);',
		'	--sm-accent-soft: light-dark(#E8F0FE, rgba(106, 155, 255, 0.16));',
		'	--sm-focus-color: light-dark(rgba(31, 95, 219, 0.35), rgba(106, 155, 255, 0.45));',
		'	--sm-focus: 0 0 0 3px var(--sm-focus-color);',
		'	--sm-hairline: light-dark(transparent, rgba(255, 255, 255, 0.06));',
		'	--sm-e2: 0 4px 14px light-dark(rgba(16, 24, 40, 0.08), rgba(0, 0, 0, 0.45)),',
		'		0 1px 3px light-dark(rgba(16, 24, 40, 0.06), rgba(0, 0, 0, 0)),',
		'		0 0 0 1px var(--sm-hairline);',
		'	--sm-e3: 0 18px 44px light-dark(rgba(16, 24, 40, 0.18), rgba(0, 0, 0, 0.6)),',
		'		0 3px 8px light-dark(rgba(16, 24, 40, 0.08), rgba(0, 0, 0, 0)),',
		'		0 0 0 1px var(--sm-hairline);',
		'	--sm-e-sheet: 0 -4px 20px light-dark(rgba(16, 24, 40, 0.1), rgba(0, 0, 0, 0.5));',
		'	--sm-font: system-ui, -apple-system, "Segoe UI", Roboto, "Noto Sans", Helvetica, Arial, sans-serif;',
		'	--sm-fs-hint: 12px;',
		'	--sm-fs-control: 13px;',
		'	--sm-fs-body: 14px;',
		'	--sm-r-m: 8px;',
		'	--sm-r-l: 12px;',
		'	--sm-hit: 36px;',
		'	--sm-icon: 20px;',
		'	--sm-fast: 120ms;',
		'	--sm-med: 200ms;',
		'	--sm-ease: cubic-bezier(0.2, 0, 0, 1);',
		'	box-sizing: border-box;',
		'	color: var(--sm-text);',
		'	font-family: var(--sm-font);',
		'	font-size: var(--sm-fs-control);',
		'	font-style: normal;',
		'	font-weight: 400;',
		'	line-height: 20px;',
		'	letter-spacing: normal;',
		'	direction: ltr;',
		'	text-align: left;',
		'	text-transform: none;',
		'	white-space: nowrap;',
		'	-webkit-tap-highlight-color: transparent;',
		'}',
		'@media (pointer: coarse) {',
		'	.geSmViewer {',
		'		--sm-hit: 44px;',
		'		--sm-fs-control: 14px;',
		'		--sm-icon: 22px;',
		'	}',
		'}',
		'@media (prefers-reduced-motion: reduce) {',
		'	.geSmViewer {',
		'		--sm-fast: 0ms;',
		'		--sm-med: 0ms;',
		'	}',
		'}',
		'@media (forced-colors: active) {',
		'	.geSmViewer {',
		'		--sm-surface: Canvas;',
		'		--sm-surface-2: Canvas;',
		'		--sm-border: CanvasText;',
		'		--sm-text: CanvasText;',
		'		--sm-text-2: CanvasText;',
		'		--sm-text-3: CanvasText;',
		'		--sm-accent: Highlight;',
		'		--sm-accent-soft: Canvas;',
		'		--sm-focus-color: Highlight;',
		// The colors above are system colors, so the icons (masks over the
		// current color, else in the color of the background) stay visible
		'		forced-color-adjust: none;',
		'	}',
		'}',
		// A box of height 0 that sticks to the top (or the bottom) of the
		// visible part of the diagram holds the bar, which is not hit by the
		// pointer while it is hidden
		'.geSmVwBox {',
		'	position: sticky;',
		'	left: 0;',
		'	top: 0;',
		'	display: block;',
		'	width: 100%;',
		'	height: 0;',
		'	margin: 0;',
		'	padding: 0;',
		'	z-index: 2;',
		'	pointer-events: none;',
		'}',
		'.geSmVwBox.geSmVwBoxBottom {',
		'	top: auto;',
		'	bottom: 0;',
		'}',
		// Bar: inset 4 (padding 3 + border 1), radius 12, e2, gap 4
		'.geSmViewer.geSmVwBar {',
		'	position: absolute;',
		'	top: 12px;',
		'	right: 12px;',
		'	display: flex;',
		'	align-items: center;',
		'	gap: 4px;',
		'	margin: 0;',
		'	padding: 3px;',
		'	border: 1px solid var(--sm-border);',
		'	border-radius: var(--sm-r-l);',
		'	background: var(--sm-surface);',
		'	box-shadow: var(--sm-e2);',
		'	opacity: 0;',
		'	pointer-events: none;',
		'	transition: opacity var(--sm-med) var(--sm-ease);',
		// Scrolls if it is wider than the diagram (max-width of updateLayout)
		'	box-sizing: border-box;',
		'	overflow-x: auto;',
		'	scrollbar-width: none;',
		'}',
		'.geSmVwBoxBottom .geSmViewer.geSmVwBar {',
		'	top: auto;',
		'	bottom: 12px;',
		'}',
		// Shown on hover and while it has the focus (it can get the focus
		// while it is hidden)
		'.geSmViewer.geSmVwBar.geSmVwShown,',
		'.geSmViewer.geSmVwBar:focus-within {',
		'	opacity: 1;',
		'	pointer-events: auto;',
		'}',
		'.geSmViewer.geSmVwCompact .geSmVwFull {',
		'	display: none;',
		'}',
		'.geSmViewer .geSmVwBtn {',
		'	display: inline-flex;',
		'	align-items: center;',
		'	justify-content: center;',
		'	flex: 0 0 auto;',
		'	box-sizing: border-box;',
		'	width: var(--sm-hit);',
		'	height: var(--sm-hit);',
		'	min-width: 0;',
		'	margin: 0;',
		'	padding: 0;',
		'	border: none;',
		'	border-radius: var(--sm-r-m);',
		'	background: transparent;',
		'	box-shadow: none;',
		'	color: var(--sm-text-2);',
		'	font-family: var(--sm-font);',
		'	font-size: var(--sm-fs-control);',
		'	line-height: 20px;',
		'	cursor: pointer;',
		'	transition: background-color var(--sm-fast) var(--sm-ease), color var(--sm-fast) var(--sm-ease);',
		'}',
		'.geSmViewer .geSmVwBtn:hover {',
		'	background: var(--sm-surface-2);',
		'	color: var(--sm-text);',
		'}',
		'.geSmViewer .geSmVwBtn[aria-expanded="true"] {',
		'	background: var(--sm-accent-soft);',
		'	color: var(--sm-accent);',
		'}',
		'.geSmViewer .geSmVwBtn:disabled {',
		'	background: transparent;',
		'	color: var(--sm-text-3);',
		'	opacity: 0.45;',
		'	cursor: default;',
		'}',
		'.geSmViewer .geSmVwBtn:focus-visible,',
		'.geSmViewer .geSmVwItem:focus-visible {',
		'	outline: none;',
		'	box-shadow: var(--sm-focus);',
		'}',
		// Focus rings are outlines in forced colors (box shadows are not
		// painted); after the rule above, which has the same specificity
		'@media (forced-colors: active) {',
		'	.geSmViewer .geSmVwBtn:focus-visible,',
		'	.geSmViewer .geSmVwItem:focus-visible {',
		'		outline: 2px solid Highlight;',
		'		outline-offset: 1px;',
		'	}',
		'}',
		// The page (1 / 3) and buttons of toolbar-buttons without an image
		'.geSmViewer .geSmVwBtn.geSmVwValue,',
		'.geSmViewer .geSmVwBtn.geSmVwTextBtn {',
		'	width: auto;',
		'	min-width: 48px;',
		'	padding: 0 4px;',
		'	color: var(--sm-text);',
		'	font-variant-numeric: tabular-nums;',
		'}',
		'.geSmViewer .geSmVwBtn.geSmVwTextBtn {',
		'	padding: 0 12px;',
		'}',
		// Icons are masks over the current color
		'.geSmViewer .geSmVwIcon {',
		'	display: inline-block;',
		'	flex: 0 0 auto;',
		'	width: var(--sm-icon);',
		'	height: var(--sm-icon);',
		'	background-color: currentColor;',
		'	-webkit-mask: var(--sm-ic) center / contain no-repeat;',
		'	mask: var(--sm-ic) center / contain no-repeat;',
		'}',
		'.geSmViewer .geSmVwImage {',
		'	display: block;',
		'	width: 20px;',
		'	height: 20px;',
		'}',
		'.geSmViewer .geSmVwSep {',
		'	flex: 0 0 auto;',
		'	width: 1px;',
		'	height: 20px;',
		'	margin: 0 4px;',
		'	background: var(--sm-border);',
		'}',
		// Popovers: menus 8 from their button (inset 4, items 32 (44)),
		// bottom sheets on phones
		'.geSmViewer.geSmVwPopover {',
		'	position: fixed;',
		'	min-width: 200px;',
		'	max-width: calc(100vw - 16px);',
		'	max-height: calc(100vh - 16px);',
		'	margin: 0;',
		'	padding: 3px;',
		'	overflow: auto;',
		'	border: 1px solid var(--sm-border);',
		'	border-radius: var(--sm-r-l);',
		'	background: var(--sm-surface);',
		'	box-shadow: var(--sm-e3);',
		'}',
		'.geSmViewer.geSmVwPopover.geSmVwSheet {',
		'	left: 0;',
		'	right: 0;',
		'	bottom: 0;',
		'	max-width: none;',
		'	max-height: calc(100vh - 56px);',
		'	padding-bottom: calc(3px + env(safe-area-inset-bottom));',
		'	border-radius: var(--sm-r-l) var(--sm-r-l) 0 0;',
		'	box-shadow: var(--sm-e-sheet);',
		'}',
		'.geSmViewer .geSmVwCaption {',
		'	padding: 8px 12px 4px;',
		'	color: var(--sm-text-2);',
		'	font-size: var(--sm-fs-hint);',
		'	line-height: 16px;',
		'	font-weight: 600;',
		'}',
		'.geSmViewer .geSmVwItem {',
		'	display: flex;',
		'	align-items: center;',
		'	gap: 12px;',
		'	box-sizing: border-box;',
		'	width: 100%;',
		'	min-height: 32px;',
		'	margin: 0;',
		'	padding: 0 12px;',
		'	border: none;',
		'	border-radius: var(--sm-r-m);',
		'	background: transparent;',
		'	box-shadow: none;',
		'	color: var(--sm-text);',
		'	font-family: var(--sm-font);',
		'	font-size: var(--sm-fs-body);',
		'	line-height: 20px;',
		'	font-weight: 400;',
		'	text-align: left;',
		'	cursor: pointer;',
		'}',
		'.geSmViewer .geSmVwItem:has(.geSmVwItemHint) {',
		'	padding: 8px 12px;',
		'}',
		'@media (pointer: coarse) {',
		'	.geSmViewer .geSmVwItem {',
		'		min-height: 44px;',
		'	}',
		'}',
		'.geSmViewer .geSmVwItem:hover {',
		'	background: var(--sm-accent-soft);',
		'}',
		'.geSmViewer .geSmVwItem .geSmVwCheck {',
		'	--sm-icon: 18px;',
		'	color: var(--sm-accent);',
		'}',
		'.geSmViewer .geSmVwItem[aria-checked="true"] {',
		'	font-weight: 600;',
		'}',
		'.geSmViewer .geSmVwItemText {',
		'	display: flex;',
		'	flex-direction: column;',
		'	flex: 1 1 auto;',
		'	min-width: 0;',
		'	max-width: 320px;',
		'}',
		'.geSmViewer .geSmVwItemText>span {',
		'	overflow: hidden;',
		'	text-overflow: ellipsis;',
		'}',
		'.geSmViewer .geSmVwItemHint {',
		'	color: var(--sm-text-2);',
		'	font-size: var(--sm-fs-hint);',
		'	line-height: 16px;',
		'	font-weight: 400;',
		'}'
	].join('\n');
};

/**
 * Creates an icon with the given image (a data URI of createSvgIcon).
 */
ViewerModern.createIcon = function(image, className)
{
	var icon = document.createElement('span');
	icon.className = 'geSmVwIcon' + ((className != null) ? ' ' + className : '');
	icon.style.setProperty('--sm-ic', 'url(\'' + image + '\')');
	icon.setAttribute('aria-hidden', 'true');

	return icon;
};

/**
 * Creates the bar and its box in the diagram and installs the listeners.
 */
ViewerModern.prototype.init = function()
{
	var viewer = this.viewer;
	var config = this.config;
	ViewerModern.initCss();

	this.position = (typeof config['toolbar-position'] === 'string' &&
		config['toolbar-position'] == 'bottom') ? 'bottom' : 'top';
	this.nohide = config['toolbar-nohide'] == true;
	this.noHover = window.matchMedia != null && window.matchMedia(ViewerModern.touchOnly).matches;

	this.box = document.createElement('div');
	this.box.className = 'geSmVwBox';

	this.bar = document.createElement('div');
	this.bar.className = 'geSmViewer geSmVwBar';
	this.bar.setAttribute('role', 'toolbar');
	this.box.appendChild(this.bar);
	this.setTitle(config.title);

	this.createControls();
	this.placeBox();
	this.installListeners();
	this.update();
	this.updateLayout();

	if (this.isAlwaysShown())
	{
		this.show();
	}
};

/**
 * Sets the name of the bar: the title of the diagram or Toolbar.
 */
ViewerModern.prototype.setTitle = function(title)
{
	title = (title != null) ? mxUtils.trim(String(title)) : '';
	this.bar.setAttribute('aria-label', (title.length > 0) ? title :
		ViewerModern.res('toolbar', null, 'Toolbar'));
};

/**
 * Returns true if the bar is always shown: toolbar-nohide, devices without
 * hover and the phone layout.
 */
ViewerModern.prototype.isAlwaysShown = function()
{
	return this.nohide || this.noHover || this.phone;
};

/**
 * Creates a button with an icon. The title is the tooltip and the name.
 */
ViewerModern.prototype.createButton = function(icon, title, fn, className)
{
	var btn = document.createElement('button');
	btn.setAttribute('type', 'button');
	btn.className = 'geSmVwBtn' + ((className != null) ? ' ' + className : '');
	btn.setAttribute('title', title);
	btn.setAttribute('aria-label', title);

	if (icon != null)
	{
		btn.appendChild(ViewerModern.createIcon(icon));
	}

	if (fn != null)
	{
		mxEvent.addListener(btn, 'click', function(evt)
		{
			fn(evt);
			mxEvent.consume(evt);
		});
	}

	return btn;
};

/**
 * Adds a control to the given group. full controls are not in the compact
 * bar. isVisible returns false if the control is hidden for the diagram.
 */
ViewerModern.prototype.addControl = function(group, elt, full, isVisible)
{
	if (full)
	{
		elt.classList.add('geSmVwFull');
	}

	this.bar.appendChild(elt);
	var control = {elt: elt, full: full, isVisible: isVisible};
	group.controls.push(control);
	this.controls.push(control);

	return control;
};

/**
 * Creates a group of controls for the given token.
 */
ViewerModern.prototype.createGroup = function(token)
{
	var group = {token: token, controls: []};
	this.groups.push(group);

	return group;
};

/**
 * Creates the controls of the tokens of the toolbar option in their order.
 */
ViewerModern.prototype.createControls = function()
{
	var viewer = this.viewer;
	var graph = this.graph;
	var model = graph.getModel();
	var tokens = viewer.toolbarItems;
	var done = Object.create(null);
	var always = function() { return true; };

	for (var i = 0; i < tokens.length; i++)
	{
		var token = tokens[i];

		// Each token once (a token twice would add its controls twice)
		if (token == '' || done[token])
		{
			continue;
		}

		done[token] = true;
		var defs = this.config['toolbar-buttons'];

		if (ViewerModern.customTokens[token] && defs != null && typeof defs === 'object' &&
			Object.prototype.hasOwnProperty.call(defs, token))
		{
			this.addCustomButton(this.createGroup(token), defs[token]);
		}
		else if (token == 'pages')
		{
			var hasPages = function()
			{
				return viewer.diagrams != null && viewer.diagrams.length > 1;
			};

			var group = this.createGroup(token);

			this.prevBtn = this.addControl(group, this.createButton(ViewerModern.icons.chevronLeft,
				ViewerModern.res('previousPage', null, 'Previous Page'), function()
			{
				viewer.selectPage(viewer.currentPage - 1);
			}), false, hasPages).elt;

			this.pageBtn = this.addControl(group, this.createButton(null,
				ViewerModern.res('pages', null, 'Pages'), mxUtils.bind(this, function()
			{
				this.togglePopover(this.pageBtn, mxUtils.bind(this, this.createPageMenu));
			}), 'geSmVwValue'), false, hasPages).elt;
			this.pageBtn.setAttribute('aria-haspopup', 'menu');
			this.pageBtn.setAttribute('aria-expanded', 'false');

			this.nextBtn = this.addControl(group, this.createButton(ViewerModern.icons.chevronRight,
				ViewerModern.res('nextPage', null, 'Next Page'), function()
			{
				viewer.selectPage(viewer.currentPage + 1);
			}), false, hasPages).elt;
		}
		else if (token == 'zoom')
		{
			var group = this.createGroup(token);

			this.addControl(group, this.createButton(ViewerModern.icons.minus,
				ViewerModern.res('zoomOut', null, 'Zoom Out'), function()
			{
				graph.zoomOut();
			}), true, always);

			this.addControl(group, this.createButton(ViewerModern.icons.plus,
				ViewerModern.res('zoomIn', null, 'Zoom In'), function()
			{
				graph.zoomIn();
			}), true, always);

			// Restores the view of the diagram as the default toolbar
			this.fitBtn = this.addControl(group, this.createButton(ViewerModern.icons.fit,
				ViewerModern.res('fit', null, 'Fit'), function()
			{
				graph.view.scaleAndTranslate(graph.initialViewState.scale,
					graph.initialViewState.translate.x,
					graph.initialViewState.translate.y);
			}), false, always).elt;
		}
		else if (token == 'layers')
		{
			this.layersBtn = this.addMenuButton(this.createGroup(token), ViewerModern.icons.layers,
				ViewerModern.res('layers', null, 'Layers'), this.createLayersMenu, function()
			{
				return model.getChildCount(model.root) > 1;
			});
		}
		else if (token == 'tags')
		{
			this.tagsBtn = this.addMenuButton(this.createGroup(token), ViewerModern.icons.tags,
				ViewerModern.res('tags', null, 'Tags'), this.createTagsMenu, function()
			{
				return graph.getAllTags().length > 0;
			});
		}
		else if (token == 'language')
		{
			this.languageBtn = this.addMenuButton(this.createGroup(token), ViewerModern.icons.globe,
				ViewerModern.res('diagramLanguage', null, 'Diagram Language'), this.createLanguageMenu,
				mxUtils.bind(this, function()
			{
				return viewer.getTranslationsMode() != 'off' && (this.languages.length > 0 ||
					viewer.getDiagramLanguage() != null);
			}));
		}
		else if (token == 'export')
		{
			if (this.getExportFormats(true).length > 0)
			{
				this.exportBtn = this.addMenuButton(this.createGroup(token), ViewerModern.icons.download,
					ViewerModern.res('export', null, 'Export'), this.createExportMenu, always);
			}
		}
		else if (token == 'lightbox')
		{
			this.lightboxBtn = this.addControl(this.createGroup(token), this.createButton(
				ViewerModern.icons.external, ViewerModern.res('openInLightbox', null, 'Open in Lightbox'),
				function()
			{
				try
				{
					viewer.showLightbox();
				}
				catch (e)
				{
					alert(e.message);
				}
			}), false, always).elt;
		}
		else if (token == 'edit')
		{
			if (this.isEditEnabled())
			{
				this.editBtn = this.addControl(this.createGroup(token), this.createButton(
					ViewerModern.icons.edit, ViewerModern.res('edit', null, 'Edit'),
					mxUtils.bind(this, function()
				{
					this.edit();
				})), true, always).elt;
			}
		}
		else if (this.config['toolbar-buttons'] != null &&
			typeof this.config['toolbar-buttons'] === 'object' &&
			Object.prototype.hasOwnProperty.call(this.config['toolbar-buttons'], token))
		{
			this.addCustomButton(this.createGroup(token), this.config['toolbar-buttons'][token]);
		}
	}
};

/**
 * Adds a button that opens the menu that createMenu returns.
 */
ViewerModern.prototype.addMenuButton = function(group, icon, title, createMenu, isVisible)
{
	var btn = this.createButton(icon, title, mxUtils.bind(this, function()
	{
		this.togglePopover(btn, mxUtils.bind(this, createMenu));
	}));
	btn.setAttribute('aria-haspopup', 'menu');
	btn.setAttribute('aria-expanded', 'false');
	this.addControl(group, btn, true, isVisible);

	return btn;
};

/**
 * Adds a button of toolbar-buttons ({title, image, handler, enabled}): its
 * image, or its title if it has none. The handler is the click listener as
 * in the default toolbar, so disableButton can remove it.
 */
ViewerModern.prototype.addCustomButton = function(group, def)
{
	if (def != null && typeof def === 'object')
	{
		var title = (def.title != null) ? String(def.title) : '';
		var btn = this.createButton(null, title, null, (def.image == null) ? 'geSmVwTextBtn' : null);

		if (def.image != null)
		{
			// The image comes from the options of the page, not from the
			// diagram (as in the default toolbar)
			var img = document.createElement('img');
			img.className = 'geSmVwImage';
			img.setAttribute('alt', '');
			img.setAttribute('src', def.image);
			btn.appendChild(img);
		}
		else
		{
			mxUtils.write(btn, title);
		}

		if (def.enabled == null || def.enabled)
		{
			if (typeof def.handler === 'function')
			{
				mxEvent.addListener(btn, 'click', def.handler);
			}
		}
		else
		{
			btn.disabled = true;
		}

		// Clicks do not reach the diagram, eg. to open the lightbox
		mxEvent.addListener(btn, 'click', function(evt)
		{
			mxEvent.consume(evt);
		});

		def.elem = btn;
		this.addControl(group, btn, true, function() { return true; });
	}
};

/**
 * Disables the button of toolbar-buttons with the given token (see
 * GraphViewer.disableButton).
 */
ViewerModern.prototype.disableButton = function(token, tooltip)
{
	var defs = this.config['toolbar-buttons'];
	var def = (defs != null && typeof defs === 'object' &&
		Object.prototype.hasOwnProperty.call(defs, token)) ? defs[token] : null;

	if (def != null && def.elem != null)
	{
		mxEvent.removeListener(def.elem, 'click', def.handler);
		def.elem.disabled = true;

		if (tooltip)
		{
			def.elem.setAttribute('title', tooltip);
			def.elem.setAttribute('aria-label', tooltip);
		}
	}
};

/**
 * Returns true if the Edit button is shown: editFunc is set or the diagram is
 * editable (editable is not false, as the Edit button of the lightbox, which
 * editable: false drops also with an edit link).
 */
ViewerModern.prototype.isEditEnabled = function()
{
	return typeof this.config.editFunc === 'function' ||
		this.config.editable == null || !!this.config.editable;
};

/**
 * Edits the diagram: editFunc, the edit link or a copy in the editor.
 */
ViewerModern.prototype.edit = function()
{
	var viewer = this.viewer;
	var config = this.config;

	if (typeof config.editFunc === 'function')
	{
		config.editFunc();
	}
	else if (config.edit != null && config.edit != '_blank')
	{
		// Graph.openLink sanitizes the link
		this.graph.openLink(config.edit, 'editWindow');
	}
	else
	{
		var index = viewer.getShownPage();
		var pageId = (index >= 0 && viewer.diagrams.length > 1) ?
			viewer.diagrams[index].getAttribute('id') : null;
		viewer.editor.editAsNew(viewer.xml, (config.title != null) ?
			String(config.title) : null, null, pageId);
	}
};

/**
 * Returns the formats of the Export menu: export-formats of the options or
 * exportFormats of the site configuration (a list or a string of names),
 * else PNG, SVG and JPEG. If the optional argument is true, the formats are
 * those of the options without the gates of the canvas (the bar decides with
 * it if the Export button exists, as the canvas test is asynchronous).
 */
ViewerModern.prototype.getExportFormats = function(ignoreCanvas)
{
	var value = this.config['export-formats'];

	if (value == null)
	{
		var site = GraphViewer.getSiteConfig();
		value = (site != null) ? site.exportFormats : null;
	}

	if (typeof value === 'string')
	{
		value = value.split(/[\s,]+/);
	}

	var result = [];

	// The gates of the new Lightbox (isModernLightboxExportEnabled): nothing
	// with noExport=1, PNG and JPEG only where a canvas can be exported, JPEG
	// only where the browser writes it
	if (typeof urlParams !== 'undefined' && urlParams['noExport'] == '1')
	{
		return result;
	}

	var editor = this.viewer.editor;
	var canvas = editor != null && typeof editor.isExportToCanvas === 'function' &&
		editor.isExportToCanvas();

	for (var i = 0; i < ViewerModern.exportFormats.length; i++)
	{
		var format = ViewerModern.exportFormats[i];

		if ((!Array.isArray(value) || mxUtils.indexOf(value, format) >= 0 ||
			(format == 'jpeg' && mxUtils.indexOf(value, 'jpg') >= 0)) &&
			(format == 'svg' || ignoreCanvas || (canvas && (format != 'jpeg' || Editor.jpgSupported))))
		{
			result.push(format);
		}
	}

	return result;
};

/**
 * Inserts the box of the bar at the top of the diagram (before its SVG) or
 * at the end for the bottom.
 */
ViewerModern.prototype.placeBox = function()
{
	var container = this.graph.container;
	var bottom = this.position == 'bottom' || this.phone;
	this.box.classList.toggle('geSmVwBoxBottom', bottom);

	if (bottom)
	{
		if (this.box.parentNode != container || this.box.nextSibling != null)
		{
			container.appendChild(this.box);
		}
	}
	else
	{
		var svg = this.graph.view.getDrawPane().ownerSVGElement;
		var ref = (svg != null && svg.parentNode == container) ? svg : container.firstChild;

		if (this.box.parentNode != container || this.box.nextSibling != ref)
		{
			container.insertBefore(this.box, ref);
		}
	}

	this.updateOffsets();
};

/**
 * Places the bar at the inset from the sides of the diagram (also in the
 * padding of the container) and centers it in diagrams that are lower than
 * the bar and the insets.
 */
ViewerModern.prototype.updateOffsets = function()
{
	var container = this.graph.container;
	var css = mxUtils.getCurrentStyle(container);
	var pad = function(name)
	{
		return (css != null) ? mxUtils.parseCssNumber(css[name]) : 0;
	};

	var h = container.clientHeight;
	var bh = this.bar.offsetHeight;
	var inset = ViewerModern.inset;

	if (h > 0 && bh > 0 && h < bh + 2 * inset)
	{
		inset = Math.max(0, Math.floor((h - bh) / 2));
	}

	var bottom = this.box.classList.contains('geSmVwBoxBottom');
	var right = (inset - pad('paddingRight')) + 'px';
	var vertical = (inset - pad((bottom) ? 'paddingBottom' : 'paddingTop')) + 'px';

	if (this.bar.style.right != right)
	{
		this.bar.style.right = right;
	}

	if (bottom)
	{
		this.bar.style.top = '';

		if (this.bar.style.bottom != vertical)
		{
			this.bar.style.bottom = vertical;
		}
	}
	else
	{
		this.bar.style.bottom = '';

		if (this.bar.style.top != vertical)
		{
			this.bar.style.top = vertical;
		}
	}
};

/**
 * Returns true if the bar has the phone layout: a coarse pointer and a
 * screen narrower than ViewerModern.phoneWidth (not the width of the window,
 * as narrow frames on desktops are no phones).
 */
ViewerModern.prototype.isPhone = function()
{
	var coarse = window.matchMedia != null && window.matchMedia('(pointer: coarse)').matches;
	var screenWidth = (window.screen != null) ? Math.min(window.screen.width || 0,
		window.screen.height || window.screen.width || 0) : 0;

	return coarse && screenWidth > 0 && screenWidth < ViewerModern.phoneWidth;
};

/**
 * Sets the phone layout (isPhone) and the compact bar by the width of the
 * diagram (pages, Fit and open in Lightbox), and keeps the bar inside the
 * diagram (it scrolls if it is wider even when compact).
 */
ViewerModern.prototype.updateLayout = function()
{
	var container = this.graph.container;
	var phone = this.isPhone();

	if (phone != this.phone)
	{
		this.phone = phone;
		this.hidePopover();
		this.placeBox();

		if (this.isAlwaysShown())
		{
			this.show();
		}
		else
		{
			this.scheduleHide();
		}
	}

	var compact = phone;

	// Measures the full bar
	var maxWidth = container.clientWidth - 2 * ViewerModern.inset;
	this.bar.style.maxWidth = '';

	if (!phone)
	{
		this.bar.classList.remove('geSmVwCompact');
		this.updateSeparators(false);
		compact = container.clientWidth > 0 && container.clientWidth <
			this.bar.offsetWidth + 2 * ViewerModern.inset;
	}

	this.compact = compact;
	this.bar.classList.toggle('geSmVwCompact', compact);
	this.updateSeparators(compact);

	if (maxWidth > 0 && this.bar.offsetWidth > maxWidth)
	{
		this.bar.style.maxWidth = maxWidth + 'px';
	}

	this.updateOffsets();
};

/**
 * Updates the page, the visible controls and the separators.
 */
ViewerModern.prototype.update = function()
{
	var viewer = this.viewer;

	if (this.isLanguageEnabled())
	{
		var r = viewer.getDiagramLanguages();
		this.languages = r.languages;
		this.labelCount = r.labels;
	}
	else
	{
		this.languages = [];
		this.labelCount = 0;
	}

	if (this.pageBtn != null)
	{
		var count = (viewer.diagrams != null) ? viewer.diagrams.length : 0;

		if (count > 1)
		{
			var index = viewer.getShownPage();
			var text = (index + 1) + ' / ' + count;

			if (this.pageBtn.textContent != text)
			{
				this.pageBtn.textContent = '';
				mxUtils.write(this.pageBtn, text);
			}

			var label = ViewerModern.res('pageOfPages', [index + 1, count],
				'Page {1} of {2}') + ': ' + this.getPageName(index);
			this.pageBtn.setAttribute('title', label);
			this.pageBtn.setAttribute('aria-label', label);
			this.prevBtn.setAttribute('title', ViewerModern.res('previousPage', null, 'Previous Page') +
				': ' + this.getPageName(mxUtils.mod(index - 1, count)));
			this.nextBtn.setAttribute('title', ViewerModern.res('nextPage', null, 'Next Page') +
				': ' + this.getPageName(mxUtils.mod(index + 1, count)));
		}
	}

	for (var i = 0; i < this.controls.length; i++)
	{
		var c = this.controls[i];
		c.hidden = !c.isVisible();
		var display = (c.hidden) ? 'none' : '';

		if (c.elt.style.display != display)
		{
			c.elt.style.display = display;
		}
	}

	this.updateSeparators(this.compact);
};

/**
 * Returns true if the bar has the language token and translations are not
 * off.
 */
ViewerModern.prototype.isLanguageEnabled = function()
{
	return this.languageBtn != null && this.viewer.getTranslationsMode() != 'off';
};

/**
 * Puts a separator between two groups of controls if one of them has more
 * than one visible control (pages, zoom), eg. "< 1 / 3 > | - + Fit |
 * Layers Export".
 */
ViewerModern.prototype.updateSeparators = function(compact)
{
	var seps = this.bar.querySelectorAll('.geSmVwSep');

	for (var i = 0; i < seps.length; i++)
	{
		seps[i].parentNode.removeChild(seps[i]);
	}

	var prev = null;

	for (var i = 0; i < this.groups.length; i++)
	{
		var group = this.groups[i];
		var visible = [];

		for (var j = 0; j < group.controls.length; j++)
		{
			var c = group.controls[j];

			if (!c.hidden && !(compact && c.full))
			{
				visible.push(c);
			}
		}

		if (visible.length > 0)
		{
			if (prev != null && (prev > 1 || visible.length > 1))
			{
				var sep = document.createElement('span');
				sep.className = 'geSmVwSep';
				sep.setAttribute('aria-hidden', 'true');
				this.bar.insertBefore(sep, visible[0].elt);
			}

			prev = visible.length;
		}
	}
};

/**
 * Returns the name of the page with the given index.
 */
ViewerModern.prototype.getPageName = function(index)
{
	var diagram = (this.viewer.diagrams != null) ? this.viewer.diagrams[index] : null;
	var name = (diagram != null) ? diagram.getAttribute('name') : null;

	return (name != null && name != '') ? name :
		ViewerModern.res('pageWithNumber', [index + 1], 'Page-{1}');
};

/**
 * Shows the bar.
 */
ViewerModern.prototype.show = function()
{
	if (this.hideThread != null)
	{
		window.clearTimeout(this.hideThread);
		this.hideThread = null;
	}

	if (!this.bar.classList.contains('geSmVwShown'))
	{
		this.bar.classList.add('geSmVwShown');
		this.updateOffsets();
	}
};

/**
 * Hides the bar after the given delay unless it is always shown, a menu is
 * open, or the pointer or the focus is in the bar or the diagram.
 */
ViewerModern.prototype.scheduleHide = function(delay)
{
	if (this.hideThread != null)
	{
		window.clearTimeout(this.hideThread);
		this.hideThread = null;
	}

	this.hideThread = window.setTimeout(mxUtils.bind(this, function()
	{
		this.hideThread = null;
		var touch = (this.touchUntil != null) ? this.touchUntil - Date.now() : 0;

		// A touch keeps the bar for touchHideDelay, also if the focus leaves it
		if (touch > 0)
		{
			this.scheduleHide(touch);
		}
		else if (!this.isAlwaysShown() && this.popover == null && !this.pointerInside &&
			!mxUtils.isAncestorNode(this.bar, document.activeElement))
		{
			this.bar.classList.remove('geSmVwShown');
		}
	}), (delay != null) ? delay : ViewerModern.hideDelay);
};

/**
 * Installs the listeners for showing and hiding the bar, the updates and
 * the layout. Events in the bar do not reach the diagram.
 */
ViewerModern.prototype.installListeners = function()
{
	var viewer = this.viewer;
	var graph = this.graph;
	var container = graph.container;

	mxEvent.addListener(container, 'pointerenter', mxUtils.bind(this, function(evt)
	{
		if (evt.pointerType != 'touch')
		{
			this.pointerInside = true;
			this.show();
		}
	}));

	mxEvent.addListener(container, 'pointermove', mxUtils.bind(this, function(evt)
	{
		if (evt.pointerType != 'touch' && !this.bar.classList.contains('geSmVwShown'))
		{
			this.pointerInside = true;
			this.show();
		}
	}));

	mxEvent.addListener(container, 'pointerleave', mxUtils.bind(this, function(evt)
	{
		if (evt.pointerType != 'touch')
		{
			this.pointerInside = false;
			this.scheduleHide();
		}
	}));

	// Touch on devices that can also hover (touchscreen laptops): a touch in
	// the diagram or on the bar shows the bar until a while after the last
	// touch, as hover never shows it there
	var touched = mxUtils.bind(this, function(evt)
	{
		if (evt.pointerType == 'touch' && !this.isAlwaysShown())
		{
			this.touchUntil = Date.now() + ViewerModern.touchHideDelay;
			this.show();
			this.scheduleHide(ViewerModern.touchHideDelay);
		}
	});

	mxEvent.addListener(container, 'pointerdown', touched);
	mxEvent.addListener(this.bar, 'pointerdown', touched);

	mxEvent.addListener(this.bar, 'focusin', mxUtils.bind(this, function()
	{
		this.show();
	}));

	mxEvent.addListener(this.bar, 'focusout', mxUtils.bind(this, function()
	{
		this.scheduleHide();
	}));

	var stop = function(evt)
	{
		evt.stopPropagation();
	};

	var events = ['pointerdown', 'pointerup', 'pointermove', 'mousedown', 'mouseup',
		'mousemove', 'touchstart', 'touchmove', 'touchend', 'click', 'dblclick',
		'contextmenu', 'wheel'];

	for (var i = 0; i < events.length; i++)
	{
		mxEvent.addListener(this.box, events[i], stop);
	}

	// Only the keys that press the buttons, so the keys of the page (eg. its
	// Escape) still work while the bar has the focus
	var stopKey = function(evt)
	{
		if (evt.key == 'Enter' || evt.key == ' ' || evt.key == 'Spacebar')
		{
			evt.stopPropagation();
		}
	};

	var keys = ['keydown', 'keyup', 'keypress'];

	for (var i = 0; i < keys.length; i++)
	{
		mxEvent.addListener(this.box, keys[i], stopKey);
	}

	var update = mxUtils.bind(this, function()
	{
		this.hidePopover();
		this.update();
		this.updateLayout();
	});

	viewer.addListener('graphChanged', update);
	viewer.addListener('xmlNodeChanged', update);
	viewer.addListener('diagramLanguageChanged', mxUtils.bind(this, function()
	{
		this.update();
	}));

	viewer.addListener('darkModeChanged', mxUtils.bind(this, function()
	{
		this.hidePopover();
	}));

	// Layers and tags of the page, eg. after a change of the page
	graph.getModel().addListener(mxEvent.CHANGE, mxUtils.bind(this, function(sender, evt)
	{
		viewer.invalidateDiagramLanguages(evt.getProperty('edit'));
		this.update();
		this.updateLayout();
	}));

	var resize = mxUtils.bind(this, function()
	{
		this.updateLayout();
		this.positionPopover();
	});

	GraphViewer.addResizeListener(container, resize);
	mxEvent.addListener(window, 'resize', resize);

	if (window.matchMedia != null)
	{
		var media = window.matchMedia(ViewerModern.touchOnly);

		var hoverChanged = mxUtils.bind(this, function()
		{
			this.noHover = media.matches;

			if (this.isAlwaysShown())
			{
				this.show();
			}
			else
			{
				this.scheduleHide();
			}
		});

		if (media.addEventListener != null)
		{
			media.addEventListener('change', hoverChanged);
		}
	}
};

/**
 * Shows or hides the menu that createContent returns for the given button.
 */
ViewerModern.prototype.togglePopover = function(anchor, createContent)
{
	if (this.popover != null && this.popoverAnchor == anchor)
	{
		this.hidePopover(true);
	}
	else
	{
		this.showPopover(anchor, createContent());
	}
};

/**
 * Shows the given menu below (or above) the given button in the page (a
 * bottom sheet on phones).
 */
ViewerModern.prototype.showPopover = function(anchor, content)
{
	this.hidePopover();

	var pop = document.createElement('div');
	pop.className = 'geSmViewer geSmVwPopover' + ((this.phone) ? ' geSmVwSheet' : '');
	pop.setAttribute('role', 'menu');
	pop.setAttribute('aria-label', anchor.getAttribute('aria-label') || '');
	pop.style.colorScheme = (this.viewer.isDarkMode()) ? 'dark' : 'light';
	pop.style.zIndex = this.viewer.toolbarZIndex + 1;
	pop.appendChild(content);
	document.body.appendChild(pop);

	this.popover = pop;
	this.popoverAnchor = anchor;
	anchor.setAttribute('aria-expanded', 'true');
	this.show();
	this.positionPopover();

	mxEvent.addListener(pop, 'keydown', mxUtils.bind(this, function(evt)
	{
		this.popoverKeyDown(evt);
	}));

	// Closes the menu for pointers outside of it and its button, and for
	// scrolling outside of it
	this.popoverPointerDown = mxUtils.bind(this, function(evt)
	{
		var src = mxEvent.getSource(evt);

		if (this.popover != null && !mxUtils.isAncestorNode(this.popover, src) &&
			!mxUtils.isAncestorNode(this.popoverAnchor, src))
		{
			this.hidePopover();
		}
	});

	this.popoverScroll = mxUtils.bind(this, function(evt)
	{
		if (this.popover != null && !mxUtils.isAncestorNode(this.popover, mxEvent.getSource(evt)))
		{
			this.hidePopover();
		}
	});

	document.addEventListener('pointerdown', this.popoverPointerDown, true);
	window.addEventListener('scroll', this.popoverScroll, true);

	// Focuses the checked item or the first item
	var items = this.getMenuItems();
	var first = null;

	for (var i = 0; i < items.length && first == null; i++)
	{
		if (items[i].getAttribute('aria-checked') == 'true' &&
			items[i].getAttribute('role') == 'menuitemradio')
		{
			first = items[i];
		}
	}

	first = first || items[0];

	if (first != null)
	{
		first.focus({preventScroll: true});
	}
};

/**
 * Places the menu 8 below its button, aligned with its right side and
 * inside the window, or above the button if it does not fit below. Phones
 * show it as a bottom sheet (CSS).
 */
ViewerModern.prototype.positionPopover = function()
{
	var pop = this.popover;

	if (pop != null)
	{
		if (pop.classList.contains('geSmVwSheet'))
		{
			pop.style.left = '';
			pop.style.top = '';
		}
		else
		{
			var r = this.popoverAnchor.getBoundingClientRect();
			var w = pop.offsetWidth;
			var h = pop.offsetHeight;
			var vw = window.innerWidth || document.documentElement.clientWidth;
			var vh = window.innerHeight || document.documentElement.clientHeight;
			var x = Math.max(8, Math.min(vw - w - 8, r.right - w));
			var y = r.bottom + 8;

			if (y + h > vh - 8 && r.top - 8 - h >= 8)
			{
				y = r.top - 8 - h;
			}

			pop.style.left = Math.round(x) + 'px';
			pop.style.top = Math.round(Math.max(8, y)) + 'px';
		}
	}
};

/**
 * Hides the menu. If focus is true the button gets the focus.
 */
ViewerModern.prototype.hidePopover = function(focus)
{
	if (this.popover != null)
	{
		var anchor = this.popoverAnchor;

		if (this.popover.parentNode != null)
		{
			this.popover.parentNode.removeChild(this.popover);
		}

		document.removeEventListener('pointerdown', this.popoverPointerDown, true);
		window.removeEventListener('scroll', this.popoverScroll, true);
		this.popover = null;
		this.popoverAnchor = null;
		anchor.setAttribute('aria-expanded', 'false');

		if (focus && anchor.offsetParent != null)
		{
			anchor.focus({preventScroll: true});
		}

		this.scheduleHide();
	}
};

/**
 * Returns the items of the menu.
 */
ViewerModern.prototype.getMenuItems = function()
{
	var result = [];

	if (this.popover != null)
	{
		var items = this.popover.querySelectorAll('[role^="menuitem"]');

		for (var i = 0; i < items.length; i++)
		{
			if (!items[i].disabled)
			{
				result.push(items[i]);
			}
		}
	}

	return result;
};

/**
 * Keys of menus: arrows, Home and End move between the items, Escape
 * closes the menu and returns the focus to its button, Tab closes it and
 * moves on from its button.
 */
ViewerModern.prototype.popoverKeyDown = function(evt)
{
	if (evt.key == 'Escape')
	{
		this.hidePopover(true);
		mxEvent.consume(evt);
	}
	else if (evt.key == 'ArrowDown' || evt.key == 'ArrowUp' || evt.key == 'Home' || evt.key == 'End')
	{
		var items = this.getMenuItems();
		var index = mxUtils.indexOf(items, document.activeElement);

		if (items.length > 0)
		{
			var next = (evt.key == 'Home') ? 0 : ((evt.key == 'End') ? items.length - 1 :
				mxUtils.mod(index + ((evt.key == 'ArrowDown') ? 1 : -1), items.length));
			items[next].focus();
			mxEvent.consume(evt);
		}
	}
	else if (evt.key == 'Tab')
	{
		// The focus goes to the button, then Tab moves it on
		this.hidePopover(true);
	}
};

/**
 * Creates the caption of a menu.
 */
ViewerModern.prototype.createCaption = function(text)
{
	var caption = document.createElement('div');
	caption.className = 'geSmVwCaption';
	caption.setAttribute('role', 'presentation');
	mxUtils.write(caption, text);

	return caption;
};

/**
 * Creates an item of a menu with a check mark (checked true or false, role
 * menuitemradio or menuitemcheckbox) and an optional hint.
 */
ViewerModern.prototype.createItem = function(label, fn, checked, hint, role)
{
	var item = document.createElement('button');
	item.setAttribute('type', 'button');
	item.className = 'geSmVwItem';
	item.setAttribute('role', role || 'menuitemradio');
	item.setAttribute('tabindex', '-1');
	item.setAttribute('aria-checked', (checked) ? 'true' : 'false');

	var check = ViewerModern.createIcon(ViewerModern.icons.check, 'geSmVwCheck');
	check.style.visibility = (checked) ? '' : 'hidden';
	item.appendChild(check);

	var text = document.createElement('span');
	text.className = 'geSmVwItemText';
	var name = document.createElement('span');
	mxUtils.write(name, label);
	name.setAttribute('title', label);
	text.appendChild(name);

	if (hint != null)
	{
		var h = document.createElement('span');
		h.className = 'geSmVwItemHint';
		mxUtils.write(h, hint);
		text.appendChild(h);
	}

	item.appendChild(text);

	mxEvent.addListener(item, 'click', function(evt)
	{
		fn(evt);
		mxEvent.consume(evt);
	});

	return item;
};

/**
 * Sets the check mark of the given item.
 */
ViewerModern.prototype.setChecked = function(item, checked)
{
	item.setAttribute('aria-checked', (checked) ? 'true' : 'false');
	item.firstChild.style.visibility = (checked) ? '' : 'hidden';
};

/**
 * Creates the menu of the pages.
 */
ViewerModern.prototype.createPageMenu = function()
{
	var viewer = this.viewer;
	var div = document.createElement('div');
	div.appendChild(this.createCaption(ViewerModern.res('pages', null, 'Pages')));
	var current = viewer.getShownPage();

	for (var i = 0; i < viewer.diagrams.length; i++)
	{
		(mxUtils.bind(this, function(index)
		{
			div.appendChild(this.createItem(this.getPageName(index), mxUtils.bind(this, function()
			{
				this.hidePopover(true);

				if (index != viewer.getShownPage())
				{
					viewer.selectPage(index);
				}
			}), index == current));
		}))(i);
	}

	return div;
};

/**
 * Creates the menu of the layers of the current page (the top layer first).
 */
ViewerModern.prototype.createLayersMenu = function()
{
	var viewer = this.viewer;
	var graph = this.graph;
	var model = graph.getModel();
	var div = document.createElement('div');
	div.appendChild(this.createCaption(ViewerModern.res('layers', null, 'Layers')));

	for (var i = model.getChildCount(model.root) - 1; i >= 0; i--)
	{
		(mxUtils.bind(this, function(layer)
		{
			var name = graph.convertValueToString(layer) ||
				ViewerModern.res('background', null, 'Background');

			var item = this.createItem(name, mxUtils.bind(this, function()
			{
				model.setVisible(layer, !model.isVisible(layer));
				this.setChecked(item, model.isVisible(layer));
				viewer.updateOrigin();
			}), model.isVisible(layer), null, 'menuitemcheckbox');

			div.appendChild(item);
		}))(model.getChildAt(model.root, i));
	}

	return div;
};

/**
 * Creates the menu of the tags of the current page: checked tags are shown.
 */
ViewerModern.prototype.createTagsMenu = function()
{
	var viewer = this.viewer;
	var graph = this.graph;
	var div = document.createElement('div');
	div.appendChild(this.createCaption(ViewerModern.res('tags', null, 'Tags')));
	var tags = graph.getAllTags().slice();
	tags.sort();

	for (var i = 0; i < tags.length; i++)
	{
		(mxUtils.bind(this, function(tag)
		{
			var item = this.createItem(tag, mxUtils.bind(this, function()
			{
				graph.toggleHiddenTag(tag);
				graph.refreshHiddenTags();
				this.setChecked(item, mxUtils.indexOf(graph.hiddenTags, tag) < 0);
				viewer.updateOrigin();
			}), mxUtils.indexOf(graph.hiddenTags, tag) < 0, null, 'menuitemcheckbox');

			div.appendChild(item);
		}))(tags[i]);
	}

	return div;
};

/**
 * Creates the menu of the languages of the diagram: Original and the
 * languages of the labels of the page with their coverage.
 */
ViewerModern.prototype.createLanguageMenu = function()
{
	var viewer = this.viewer;
	var div = document.createElement('div');
	div.appendChild(this.createCaption(ViewerModern.res('lightboxDiagramLanguage', null,
		'Language of the diagram')));
	var current = viewer.getDiagramLanguage();

	div.appendChild(this.createItem(ViewerModern.res('lightboxOriginal', null, 'Original'),
		mxUtils.bind(this, function()
	{
		this.hidePopover(true);
		viewer.setDiagramLanguage(null);
	}), current == null));

	var langs = this.languages.slice();
	var found = current == null;

	for (var i = 0; i < langs.length; i++)
	{
		found = found || langs[i].code == current;
	}

	// A language that this page does not have
	if (!found)
	{
		langs.push({code: current, count: 0});
	}

	for (var i = 0; i < langs.length; i++)
	{
		(mxUtils.bind(this, function(lang)
		{
			div.appendChild(this.createItem(ViewerModern.getLanguageName(lang.code),
				mxUtils.bind(this, function()
			{
				this.hidePopover(true);
				viewer.setDiagramLanguage(lang.code);
			}), current == lang.code, ViewerModern.res('lightboxLabelsTranslated',
				[lang.count, Math.max(lang.count, this.labelCount)], '{1} of {2} labels translated')));
		}))(langs[i]);
	}

	return div;
};

/**
 * Creates the Export menu: a download for each format.
 */
ViewerModern.prototype.createExportMenu = function()
{
	var div = document.createElement('div');
	div.appendChild(this.createCaption(ViewerModern.res('export', null, 'Export')));
	var formats = this.getExportFormats();
	var names = {png: ['formatPng', 'PNG'], svg: ['formatSvg', 'SVG'], jpeg: ['formatJpg', 'JPEG']};

	for (var i = 0; i < formats.length; i++)
	{
		(mxUtils.bind(this, function(format)
		{
			var name = ViewerModern.res(names[format][0], null, names[format][1]);
			var item = this.createItem(ViewerModern.res('downloadFormat', [name], 'Download {1}'),
				mxUtils.bind(this, function()
			{
				this.hidePopover(true);
				this.exportDiagram(format);
			}), false, null, 'menuitem');

			// No check marks in this menu
			item.removeAttribute('aria-checked');
			item.removeChild(item.firstChild);
			div.appendChild(item);
		}))(formats[i]);
	}

	return div;
};

/**
 * Returns the name of the files of exports: the title or Diagram, with
 * characters that file systems do not allow replaced.
 */
ViewerModern.prototype.getFilename = function()
{
	var title = (this.config.title != null) ? mxUtils.trim(String(this.config.title)) : '';
	title = title.replace(/[\\\/:*?"<>|\u0000-\u001f]/g, '_').substring(0, 100);

	return (title.length > 0) ? title : ViewerModern.res('diagram', null, 'Diagram');
};

/**
 * Exports the current page as shown (in the language and the appearance of
 * the viewer) in the given format and downloads it.
 */
ViewerModern.prototype.exportDiagram = function(format)
{
	var viewer = this.viewer;
	var graph = this.graph;
	var filename = this.getFilename() + '.' + ((format == 'jpeg') ? 'jpg' : format);
	var theme = (viewer.isDarkMode()) ? 'dark' : 'light';

	var error = mxUtils.bind(this, function(e)
	{
		this.handleError(e);
	});

	try
	{
		// Waits for the outlines of images that edges end on, like
		// exportToCanvas and EditorUi.exportSvg (see Graph.waitForOutlines)
		if (format == 'svg' && typeof graph.hasPendingOutlines === 'function' &&
			graph.hasPendingOutlines())
		{
			graph.waitForOutlines(mxUtils.bind(this, function()
			{
				this.exportDiagram(format);
			}), 10000);

			return;
		}

		// SVG with the background of the page that PNG and JPEG get (the SVG
		// of exportToCanvas has none, it paints it only on the canvas)
		if (format == 'svg')
		{
			var bg = graph.background;

			if (bg == null || bg == mxConstants.NONE)
			{
				bg = Editor.getDefaultPageBackgroundColor();
			}

			viewer.editor.convertImages(graph.getSvg(bg, 1, Editor.defaultBorder, null, null,
				true, null, null, null, false, null, theme), mxUtils.bind(this, function(svgRoot)
			{
				try
				{
					this.saveFile(new Blob([Graph.xmlDeclaration + '\n' + mxUtils.getXml(svgRoot)],
						{type: 'image/svg+xml'}), filename);
				}
				catch (e)
				{
					error(e);
				}
			}));

			return;
		}

		viewer.editor.exportToCanvas(mxUtils.bind(this, function(canvas, svgRoot)
		{
			try
			{
				canvas.toBlob(mxUtils.bind(this, function(blob)
				{
					if (blob != null)
					{
						this.saveFile(blob, filename);
					}
					else
					{
						error({message: ViewerModern.res('error', null, 'Error')});
					}
				}), 'image/' + format, 0.9);
			}
			catch (e)
			{
				error(e);
			}
		}), null, null, null, error, null, true, ViewerModern.exportScale,
			false, false, null, graph, Editor.defaultBorder, null, null, theme);
	}
	catch (e)
	{
		error(e);
	}
};

/**
 * Downloads the given blob with the given name.
 */
ViewerModern.prototype.saveFile = function(blob, filename)
{
	// A blob URL of the export, the name is text without path characters
	var url = URL.createObjectURL(blob);
	var a = document.createElement('a');
	a.setAttribute('href', url);
	a.setAttribute('download', filename);
	a.style.display = 'none';
	document.body.appendChild(a);
	a.click();
	document.body.removeChild(a);

	window.setTimeout(function()
	{
		URL.revokeObjectURL(url);
	}, 1000);
};

/**
 * Shows an error of an export (as the default toolbar).
 */
ViewerModern.prototype.handleError = function(e)
{
	alert((e != null && e.message != null) ? e.message : ViewerModern.res('error', null, 'Error'));
};
