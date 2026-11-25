/**
 * Copyright (c) 2026, JGraph Holdings Ltd
 * Copyright (c) 2026, draw.io AG
 */
/**
 * The new Lightbox (concept report 14.2, mockups 60 to 62): floating
 * bars in the tokens of Simple Modern instead of the black toolbar of the
 * chromeless view, light or dark following the system (never black).
 *
 * - Top left: Back (toolbar-config), hidden without it (no logo, the title
 *   only names the bar).
 * - The title is not shown: a heading that only screen readers see names
 *   the diagram before it (titleNode, also on phones and without Back).
 * - Top right: the language of the diagram (only if a page has translated
 *   labels, label_<code>), Layers, Tags (tags URL parameter), the buttons of
 *   lightboxToolbarActions, Refresh, Edit and Close; hidden without them.
 * - Bottom centre: the page menu (only with more than one page), zoom,
 *   Fit, Full screen, Open in New Window (fullscreenBtn of toolbar-config in
 *   a frame) and Export (or Print). It hides after 3 s without movement and
 *   comes back on movement, focus or touch (toolbar-nohide=1 keeps it).
 * - Phones (narrower than 600): Back and Close top left, More (with the
 *   other items of the top right bar) top right; the page menu, Fit, the
 *   language and Export (or Print) at the bottom.
 * - Keys: left and right change pages, + and - zoom, F fits, Escape closes
 *   a menu or the lightbox (not the Escape that closes a dialog). Tab goes
 *   through the top bars, the diagram and the bottom bar.
 *
 * The switch (off by default): the URL parameter viewer-ui=modern or the
 * key enableModernLightbox of the configuration (Editor.enableModernLightbox,
 * viewer-ui=classic turns it off), and only in the full-page lightbox
 * (lightbox=1), not in the lightbox that GraphViewer opens in a page.
 * Without the switch installModernChromelessToolbar returns false and the
 * default toolbar of grapheditor/EditorUi.js is created as before; the CSS
 * of the bars (LightboxModern.getCss, the tokens of Simple Modern under
 * .geSmLightbox) is added to the page only with the first lightbox.
 *
 * Security: the lightbox shows untrusted diagrams. Page names, titles,
 * layer names and language names are written as text (mxUtils.write),
 * languages come only from attribute names that match languagePattern,
 * Back and Refresh are same-origin links as in the default toolbar, and the
 * link of a page is the URL of the lightbox with encoded parameters.
 */
var LightboxModern = function(ui)
{
	this.ui = ui;
	this.graph = ui.editor.graph;
	this.languages = [];
	this.labelCount = 0;
	this.exportState = {format: 'png', scale: 2, theme: 'auto', transparent: false};

	try
	{
		this.toolbarConfig = JSON.parse(decodeURIComponent(urlParams['toolbar-config'] || '{}')) || {};
	}
	catch (e)
	{
		this.toolbarConfig = {};
	}

	this.init();
};

/**
 * Translated labels: label_<code> with a code of two or three letters and
 * up to three subtags of letters and digits after - or _, in any case, as
 * Graph looks them up (label_de, label_zh-tw, label_pt-BR, label_zh_CN,
 * label_fil). No spaces or other characters.
 */
LightboxModern.languagePattern = /^label_([A-Za-z]{2,3}(?:[-_][A-Za-z0-9]{1,8}){0,3})$/;

/**
 * Most label_<code> attributes of a cell whose values are read for languages.
 * The names of all attributes are read with getAttributeNames, which takes
 * linear time (reading attributes by index takes longer the more were read
 * in Chrome: 1,000 cells of 1,000 attributes took 1.5 s on open and on each
 * page), but getAttribute searches all attributes of the cell for the name,
 * so 80,000 translations of a crafted cell took 2.4 s. More than the 184
 * languages of ISO 639-1.
 */
LightboxModern.maxLanguageAttributes = 200;

/**
 * Returns the language tag of the given code: lowercase with - (pt-br for
 * pt-BR and pt_BR), for the names of languages, the lang attribute and the
 * language of the browser.
 */
LightboxModern.getLanguageTag = function(code)
{
	return String(code).toLowerCase().replace(/_/g, '-');
};

/**
 * Returns true if the given value is a language code of languagePattern.
 */
LightboxModern.isLanguageCode = function(code)
{
	return typeof code === 'string' && LightboxModern.languagePattern.test('label_' + code);
};

/**
 * Width below which the lightbox has the phone layout (as Simple Modern).
 */
LightboxModern.phoneWidth = 600;

/**
 * Milliseconds without movement after which the bottom bar hides.
 */
LightboxModern.hideDelay = 3000;

/**
 * Sizes of the Export menu.
 */
LightboxModern.scales = [1, 2, 3];

/**
 * Counter of the IDs of the switches of the Export panel (their labels).
 */
LightboxModern.controlCounter = 0;

/**
 * Creates an icon from an SVG with the given content on a 24 px grid (as
 * the icons of Simple Modern). The icons are masks over the current color,
 * so one asset serves light, dark, hover and disabled.
 */
LightboxModern.createSvgIcon = function(content)
{
	return Editor.createSvgDataUri('<svg xmlns="http://www.w3.org/2000/svg" ' +
		'viewBox="0 0 24 24" fill="none" stroke="#000" stroke-width="1.8" ' +
		'stroke-linecap="round" stroke-linejoin="round">' + content + '</svg>');
};

/**
 * Icons of the lightbox (outline, 1.8 px stroke, round caps).
 */
LightboxModern.icons = (function()
{
	var icon = LightboxModern.createSvgIcon;

	return {
		back: icon('<path d="M19 12H5M11 6l-6 6 6 6"/>'),
		check: icon('<path d="M5 12.5l4.5 4.5L19 7.5"/>'),
		chevronDown: icon('<path d="M6 9.5l6 6 6-6"/>'),
		chevronLeft: icon('<path d="M14.5 6l-6 6 6 6"/>'),
		chevronRight: icon('<path d="M9.5 6l6 6-6 6"/>'),
		close: icon('<path d="M6 6l12 12M18 6L6 18"/>'),
		copy: icon('<rect x="8.5" y="8.5" width="11" height="11" rx="1.5"/><path d="M15.5 8.5v-4h-11v11h4"/>'),
		download: icon('<path d="M12 4v11M7 10l5 5 5-5M5 19.5h14"/>'),
		edit: icon('<path d="M4 20l4.5-1 10-10a2.1 2.1 0 0 0-3-3l-10 10z"/>'),
		exitFullscreen: icon('<path d="M20 10h-6V4M4 14h6v6M14 10l6-6M10 14l-6 6"/>'),
		external: icon('<path d="M14 4h6v6M20 4l-8.5 8.5"/><path d="M18 14v4.5a1.5 1.5 0 0 1-1.5 1.5h-11' +
			'A1.5 1.5 0 0 1 4 18.5v-11A1.5 1.5 0 0 1 5.5 6H10"/>'),
		fit: icon('<path d="M4 9V4h5M15 4h5v5M20 15v5h-5M9 20H4v-5"/>'),
		fullscreen: icon('<path d="M14 4h6v6M10 20H4v-6M20 4l-6 6M4 20l6-6"/>'),
		globe: icon('<circle cx="12" cy="12" r="8.5"/><path d="M3.5 12h17M12 3.5c2.5 2.6 3.5 5.4 3.5 ' +
			'8.5s-1 5.9-3.5 8.5c-2.5-2.6-3.5-5.4-3.5-8.5s1-5.9 3.5-8.5z"/>'),
		layers: icon('<path d="M12 3.5l8.5 4.5-8.5 4.5L3.5 8z"/>' +
			'<path d="M3.5 12l8.5 4.5 8.5-4.5M3.5 16l8.5 4.5 8.5-4.5"/>'),
		link: icon('<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"/>' +
			'<path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/>'),
		minus: icon('<path d="M5 12h14"/>'),
		more: Editor.createSvgDataUri('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">' +
			'<circle cx="5" cy="12" r="1.9"/><circle cx="12" cy="12" r="1.9"/><circle cx="19" cy="12" r="1.9"/></svg>'),
		open: icon('<path d="M13.5 3.5H6.5v17h11V7.5z"/><path d="M13.5 3.5v4h4M12 17.5l3.5-3.5M15.5 17.5V14H12"/>'),
		pages: icon('<path d="M8.5 6.5V3.5h7l3.5 3.5v10.5h-3"/><path d="M5 7h7.5l3.5 3.5v10h-11z"/>'),
		plus: icon('<path d="M12 5v14M5 12h14"/>'),
		print: icon('<path d="M7 9V4h10v5"/><rect x="4" y="9" width="16" height="7" rx="1.5"/>' +
			'<path d="M7 14h10v6H7z"/>'),
		refresh: icon('<path d="M19.5 12a7.5 7.5 0 1 1-2.2-5.3M19.5 4.5v4h-4"/>'),
		tags: icon('<path d="M3.5 5v6.6l9 9 8-8-9-9H5A1.5 1.5 0 0 0 3.5 5z"/><circle cx="8" cy="8" r="1.5"/>')
	};
})();

/**
 * Creates an icon with the given image (a data URI, see createSvgIcon).
 */
LightboxModern.createIcon = function(image, className)
{
	var icon = document.createElement('span');
	icon.className = 'geSmIcon' + ((className != null) ? ' ' + className : '');
	icon.style.setProperty('--sm-ic', 'url(\'' + image + '\')');
	icon.setAttribute('aria-hidden', 'true');

	return icon;
};

/**
 * Creates an icon button with the given image, name and function. The name
 * is the tooltip and the accessible name.
 */
LightboxModern.createIconButton = function(image, title, fn, className)
{
	var btn = document.createElement('button');
	btn.setAttribute('type', 'button');
	btn.className = 'geSmIconBtn' + ((className != null) ? ' ' + className : '');
	btn.setAttribute('title', title);
	btn.setAttribute('aria-label', title);
	btn.appendChild(LightboxModern.createIcon(image));

	mxEvent.addListener(btn, 'click', function(evt)
	{
		fn(evt);
		mxEvent.consume(evt);
	});

	return btn;
};

/**
 * Creates a toggle group (segmented control) for the given items, which are
 * {value, label, title}. It is a radio group: the arrow keys move the
 * selection, Home and End go to the first and last item. fn is called with
 * the value and the event of a change.
 */
LightboxModern.createToggleGroup = function(items, value, fn, label)
{
	var group = document.createElement('div');
	group.className = 'geSmSeg';
	group.setAttribute('role', 'radiogroup');

	if (label != null)
	{
		group.setAttribute('aria-label', label);
	}

	var buttons = [];
	var current = -1;

	var setIndex = function(index)
	{
		current = index;

		for (var i = 0; i < buttons.length; i++)
		{
			var on = i == index;
			buttons[i].classList.toggle('geSmOn', on);
			buttons[i].setAttribute('aria-checked', (on) ? 'true' : 'false');
			buttons[i].setAttribute('tabindex', (on || (index < 0 && i == 0)) ? '0' : '-1');
		}
	};

	var choose = function(index, evt, focus)
	{
		if (index >= 0 && index < buttons.length && !buttons[index].disabled)
		{
			var changed = index != current;
			setIndex(index);

			if (focus)
			{
				buttons[index].focus();
			}

			if (changed)
			{
				fn(items[index].value, evt);
			}
		}
	};

	for (var i = 0; i < items.length; i++)
	{
		(function(index)
		{
			var btn = document.createElement('button');
			btn.setAttribute('type', 'button');
			btn.setAttribute('role', 'radio');
			mxUtils.write(btn, items[index].label);

			if (items[index].title != null && items[index].title != items[index].label)
			{
				btn.setAttribute('title', items[index].title);
			}

			mxEvent.addListener(btn, 'click', function(evt)
			{
				choose(index, evt);
				mxEvent.consume(evt);
			});

			buttons.push(btn);
			group.appendChild(btn);
		})(i);
	}

	mxEvent.addListener(group, 'keydown', function(evt)
	{
		var index = mxUtils.indexOf(buttons, document.activeElement);
		var next = -1;

		if (evt.key == 'ArrowRight' || evt.key == 'ArrowDown')
		{
			next = (index + 1) % buttons.length;
		}
		else if (evt.key == 'ArrowLeft' || evt.key == 'ArrowUp')
		{
			next = (index + buttons.length - 1) % buttons.length;
		}
		else if (evt.key == 'Home')
		{
			next = 0;
		}
		else if (evt.key == 'End')
		{
			next = buttons.length - 1;
		}

		if (next >= 0 && index >= 0)
		{
			choose(next, evt, true);
			mxEvent.consume(evt);
		}
	});

	group.setValue = function(v)
	{
		var index = -1;

		for (var i = 0; i < items.length; i++)
		{
			if (items[i].value == v)
			{
				index = i;
				break;
			}
		}

		setIndex(index);
	};

	group.buttons = buttons;
	group.setValue(value);

	return group;
};

/**
 * Adds the CSS of the bars to the document once (the first lightbox).
 */
LightboxModern.installCss = function()
{
	if (document.getElementById('geSmLightboxCss') == null)
	{
		var style = document.createElement('style');
		style.setAttribute('id', 'geSmLightboxCss');
		style.textContent = LightboxModern.getCss();
		document.head.appendChild(style);
	}
};

/**
 * Returns the CSS of the bars: the tokens of Simple Modern that they use and
 * all rules under .geSmLightbox, so nothing of it applies to other parts of
 * the page.
 */
LightboxModern.getCss = function()
{
	return [
		'/* The tokens of Simple Modern (styles/grapheditor.css of the new look) that',
		'   the bars use, under the root of the lightbox */',
		'.geSmLightbox {',
		'	--sm-canvas: light-dark(#F5F6F8, #121418);',
		'	--sm-surface: light-dark(#FFFFFF, #1C1F24);',
		'	--sm-surface-2: light-dark(#F2F4F7, #252930);',
		'	--sm-surface-3: light-dark(#E7EAEF, #30353D);',
		'	--sm-border: light-dark(#E3E6EB, #2D3239);',
		'	--sm-border-strong: light-dark(#C9CFD8, #424852);',
		'	--sm-text: light-dark(#1B1F24, #E8EAED);',
		'	--sm-text-2: light-dark(#5A626E, #A8B0BA);',
		'	--sm-text-3: light-dark(#646C79, #8F97A2);',
		'	--sm-accent: light-dark(#1F5FDB, #6A9BFF);',
		'	--sm-accent-hover: light-dark(#184FB8, #86AEFF);',
		'	--sm-accent-soft: light-dark(#E8F0FE, rgba(106, 155, 255, 0.16));',
		'	--sm-on-accent: light-dark(#FFFFFF, #0B1630);',
		'	--sm-thumb: light-dark(#FFFFFF, #0B1630);',
		'	--sm-knob: #FFFFFF;',
		'	--sm-focus-color: light-dark(rgba(31, 95, 219, 0.35), rgba(106, 155, 255, 0.45));',
		'	--sm-focus: 0 0 0 3px var(--sm-focus-color);',
		'	--sm-hairline: light-dark(transparent, rgba(255, 255, 255, 0.06));',
		'	--sm-e1: 0 1px 2px light-dark(rgba(16, 24, 40, 0.06), rgba(0, 0, 0, 0.4)),',
		'		0 1px 3px light-dark(rgba(16, 24, 40, 0.06), rgba(0, 0, 0, 0));',
		'	--sm-e2: 0 4px 14px light-dark(rgba(16, 24, 40, 0.08), rgba(0, 0, 0, 0.45)),',
		'		0 1px 3px light-dark(rgba(16, 24, 40, 0.06), rgba(0, 0, 0, 0)),',
		'		0 0 0 1px var(--sm-hairline);',
		'	--sm-e3: 0 18px 44px light-dark(rgba(16, 24, 40, 0.18), rgba(0, 0, 0, 0.6)),',
		'		0 3px 8px light-dark(rgba(16, 24, 40, 0.08), rgba(0, 0, 0, 0)),',
		'		0 0 0 1px var(--sm-hairline);',
		'	--sm-e-sheet: 0 -4px 20px light-dark(rgba(16, 24, 40, 0.1), rgba(0, 0, 0, 0.5));',
		'	--sm-knob-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);',
		'	--sm-font: system-ui, -apple-system, "Segoe UI", Roboto, "Noto Sans", Helvetica, Arial, sans-serif;',
		'	--sm-fs-caption: 11px;',
		'	--sm-fs-hint: 12px;',
		'	--sm-fs-control: 13px;',
		'	--sm-fs-body: 14px;',
		'	--sm-r-s: 6px;',
		'	--sm-r-m: 8px;',
		'	--sm-r-l: 12px;',
		'	--sm-r-xl: 16px;',
		'	--sm-hit: 36px;',
		'	--sm-ctl: 32px;',
		'	--sm-icon: 20px;',
		'	--sm-fast: 120ms;',
		'	--sm-med: 200ms;',
		'	--sm-ease: cubic-bezier(0.2, 0, 0, 1);',
		'}',
		'',
		'/* Pointer coarse (tablets, phones): 44 px targets. An iPad with a trackpad',
		'   has a fine pointer and gets the desktop density. */',
		'@media (pointer: coarse) {',
		'	.geSmLightbox {',
		'		--sm-hit: 44px;',
		'		--sm-ctl: 40px;',
		'		--sm-fs-control: 14px;',
		'		--sm-icon: 22px;',
		'	}',
		'}',
		'',
		'@media (prefers-reduced-motion: reduce) {',
		'	.geSmLightbox {',
		'		--sm-fast: 0ms;',
		'		--sm-med: 0ms;',
		'	}',
		'',
		'	/* Also the transitions of the editor that the look keeps (shapes of the',
		'	   sidebar, the splitter, fields and the close button of dialogs) */',
		'	.geSmLightbox *,',
		'	.geSmLightbox *::before,',
		'	.geSmLightbox *::after {',
		'		transition: none !important;',
		'	}',
		'}',
		'',
		'/* Windows High Contrast and other forced colors map the tokens to the system',
		'   colors (forced-color-adjust is none in the editor, see .geEditor *) */',
		'@media (forced-colors: active) {',
		'	.geSmLightbox {',
		'		--sm-canvas: Canvas;',
		'		--sm-surface: Canvas;',
		'		--sm-surface-2: Canvas;',
		'		--sm-surface-3: Canvas;',
		'		--sm-border: CanvasText;',
		'		--sm-border-strong: ButtonBorder;',
		'		--sm-text: CanvasText;',
		'		--sm-text-2: CanvasText;',
		'		--sm-text-3: CanvasText;',
		'		--sm-accent: Highlight;',
		'		--sm-accent-hover: Highlight;',
		'		--sm-accent-soft: Canvas;',
		'		--sm-on-accent: HighlightText;',
		'		--sm-thumb: Canvas;',
		'		--sm-focus-color: Highlight;',
		'	}',
		'}',
		'',
		'/* Icons are masks over the current color */',
		'.geSmLightbox .geSmIcon {',
		'	display: inline-block;',
		'	flex: 0 0 auto;',
		'	width: var(--sm-icon);',
		'	height: var(--sm-icon);',
		'	background-color: currentColor;',
		'	-webkit-mask: var(--sm-ic) center / contain no-repeat;',
		'	mask: var(--sm-ic) center / contain no-repeat;',
		'}',
		'',
		'/* Icon buttons and toggle groups */',
		'.geSmLightbox .geSmIconBtn,',
		'.geSmLightbox .geSmSeg>button {',
		'	font-family: var(--sm-font);',
		'	-webkit-tap-highlight-color: transparent;',
		'}',
		'',
		'.geSmLightbox .geSmIconBtn {',
		'	display: inline-flex;',
		'	align-items: center;',
		'	justify-content: center;',
		'	flex: 0 0 auto;',
		'	box-sizing: border-box;',
		'	width: var(--sm-hit);',
		'	height: var(--sm-hit);',
		'	margin: 0;',
		'	padding: 0;',
		'	border: none;',
		'	border-radius: var(--sm-r-m);',
		'	background: transparent;',
		'	color: var(--sm-text-2);',
		'	cursor: pointer;',
		'	transition: background-color var(--sm-fast) var(--sm-ease), color var(--sm-fast) var(--sm-ease);',
		'}',
		'',
		'.geSmLightbox .geSmIconBtn:hover {',
		'	background: var(--sm-surface-2);',
		'	color: var(--sm-text);',
		'}',
		'',
		'.geSmLightbox .geSmIconBtn:focus-visible,',
		'.geSmLightbox .geSmSeg>button:focus-visible {',
		'	outline: none;',
		'	box-shadow: var(--sm-focus);',
		'}',
		'',
		'/* Dark mode of the editor removes all shadows (html body.geEditor.geDarkMode',
		'   *), the focus rings come back */',
		'html body.geEditor.geDarkMode :is(.geSmLightbox .geSmIconBtn, .geSmLightbox .geSmSeg>button,',
		'	.geSmLightbox .geSmLbTextBtn, .geSmLightbox .geSmLbItem,',
		'	.geSmLightbox .geSmLbFormat, .geSmLightbox input.geSmLbSwitch[role="switch"],',
		'	.geSmLightbox .geSmLbPrimary):focus-visible {',
		'	box-shadow: var(--sm-focus) !important;',
		'}',
		'',
		'html body.geEditor.geDarkMode .geSmLightbox .geSmLbFormat.geSmOn:focus-visible {',
		'	box-shadow: inset 0 0 0 1px var(--sm-accent), var(--sm-focus) !important;',
		'}',
		'',
		'.geSmLightbox .geSmSeg {',
		'	display: inline-flex;',
		'	flex-wrap: wrap;',
		'	box-sizing: border-box;',
		'	max-width: 100%;',
		'	padding: 2px;',
		'	gap: 2px;',
		'	border-radius: var(--sm-r-m);',
		'	background: var(--sm-surface-2);',
		'}',
		'',
		'.geSmLightbox .geSmSeg>button {',
		'	display: inline-flex;',
		'	align-items: center;',
		'	justify-content: center;',
		'	gap: 8px;',
		'	flex: 1 1 auto;',
		'	box-sizing: border-box;',
		'	min-height: calc(var(--sm-ctl) - 4px);',
		'	height: auto;',
		'	margin: 0;',
		'	padding: 0 12px;',
		'	line-height: 20px;',
		'	border: none;',
		'	border-radius: var(--sm-r-s);',
		'	background: transparent;',
		'	color: var(--sm-text-2);',
		'	font-size: var(--sm-fs-control);',
		'	font-weight: 400;',
		'	white-space: nowrap;',
		'	cursor: pointer;',
		'	transition: background-color var(--sm-fast) var(--sm-ease);',
		'}',
		'',
		'.geSmLightbox .geSmSeg>button:hover:not([disabled]) {',
		'	color: var(--sm-text);',
		'}',
		'',
		'.geSmLightbox .geSmSeg>button.geSmOn {',
		'	background: light-dark(var(--sm-surface), var(--sm-surface-3));',
		'	color: var(--sm-text);',
		'	font-weight: 600;',
		'	box-shadow: var(--sm-e1);',
		'}',
		'',
		'.geSmLightbox .geSmSeg>button.geSmOn:focus-visible {',
		'	box-shadow: var(--sm-focus);',
		'}',
		'',
		'/* Pressed: one step above hover, without the fade of the editor',
		'   (.geEditor button:active, opacity 0.75) */',
		'.geSmLightbox .geSmIconBtn:active:not([disabled]),',
		'.geSmLightbox .geSmSeg>button:active:not([disabled], .geSmOn) {',
		'	background: var(--sm-surface-3);',
		'	color: var(--sm-text);',
		'	opacity: 1;',
		'}',
		'',
		'.geSmLightbox .geSmSeg>button.geSmOn:active:not([disabled]) {',
		'	opacity: 1;',
		'}',
		'',
		'/* Touch: segments of at least 44 with a hit area of 44 */',
		'@media (pointer: coarse) {',
		'	.geSmLightbox .geSmSeg>button {',
		'		position: relative;',
		'		overflow-x: clip;',
		'		overflow-y: visible;',
		'		min-width: var(--sm-hit);',
		'	}',
		'',
		'	.geSmLightbox .geSmSeg>button::after {',
		'		content: \'\';',
		'		position: absolute;',
		'		top: min(0px, calc((100% - var(--sm-hit)) / 2));',
		'		bottom: min(0px, calc((100% - var(--sm-hit)) / 2));',
		'		left: min(0px, calc((100% - var(--sm-hit)) / 2));',
		'		right: min(0px, calc((100% - var(--sm-hit)) / 2));',
		'	}',
		'',
		'	.geSmLightbox .geSmSeg {',
		'		row-gap: 8px;',
		'	}',
		'}',
		'',
		'@media (forced-colors: active) {',
		'	.geSmLightbox .geSmSeg>button.geSmOn {',
		'		outline: 2px solid Highlight;',
		'	}',
		'}',
		'',
		'/* The title of the diagram for screen readers, not shown (see init) */',
		'.geSmLbTitle {',
		'	position: absolute;',
		'	width: 1px;',
		'	height: 1px;',
		'	margin: 0;',
		'	padding: 0;',
		'	overflow: hidden;',
		'	clip-path: inset(50%);',
		'	white-space: nowrap;',
		'}',
		'',
		'/* The bars (report 14.2, mockups 60-62) */',
		'.geSmLightbox {',
		'	position: fixed;',
		'	inset: 0;',
		'	z-index: 3;',
		'	pointer-events: none;',
		'	color: var(--sm-text);',
		'	font-family: var(--sm-font);',
		'	-webkit-tap-highlight-color: transparent;',
		'}',
		'',
		'.geSmLightbox.geSmLbPhone .geSmLbDesk,',
		'.geSmLightbox:not(.geSmLbPhone) .geSmLbMobile {',
		'	display: none;',
		'}',
		'',
		'/* Bars: inset 4 (padding 3 + border 1), radius 12, e2 */',
		'.geSmLightbox .geSmLbBar {',
		'	position: absolute;',
		'	display: flex;',
		'	align-items: center;',
		'	gap: 4px;',
		'	box-sizing: border-box;',
		'	max-width: calc(100% - 32px);',
		'	padding: 3px;',
		'	border: 1px solid var(--sm-border);',
		'	border-radius: var(--sm-r-l);',
		'	background: var(--sm-surface);',
		'	box-shadow: var(--sm-e2);',
		'	color: var(--sm-text);',
		'	pointer-events: auto;',
		'	transition: opacity var(--sm-med) var(--sm-ease);',
		'}',
		'',
		'.geSmLightbox .geSmLbTopLeft {',
		'	left: 16px;',
		'	top: 16px;',
		'	max-width: calc(50% - 24px);',
		'}',
		'',
		'.geSmLightbox .geSmLbTopRight {',
		'	right: 16px;',
		'	top: 16px;',
		'	max-width: calc(50% - 24px);',
		'}',
		'',
		'.geSmLightbox .geSmLbBottom {',
		'	left: 50%;',
		'	bottom: 20px;',
		'	transform: translateX(-50%);',
		'}',
		'',
		'/* Hidden after 3 s without movement; focusable, so the focus shows it */',
		'.geSmLightbox .geSmLbBottom.geSmLbIdle {',
		'	opacity: 0;',
		'	pointer-events: none;',
		'}',
		'',
		'.geSmLightbox .geSmLbSep {',
		'	flex: 0 0 auto;',
		'	width: 1px;',
		'	height: 20px;',
		'	margin: 0 4px;',
		'	background: var(--sm-border);',
		'}',
		'',
		'/* Buttons with a text: the page menu, the language, Export, Edit */',
		'.geSmLightbox .geSmLbTextBtn {',
		'	display: inline-flex;',
		'	align-items: center;',
		'	gap: 8px;',
		'	flex: 0 1 auto;',
		'	box-sizing: border-box;',
		'	min-width: 0;',
		'	height: var(--sm-hit);',
		'	margin: 0;',
		'	padding: 0 8px 0 12px;',
		'	border: none;',
		'	border-radius: var(--sm-r-m);',
		'	background: transparent;',
		'	color: var(--sm-text-2);',
		'	font-family: var(--sm-font);',
		'	font-size: var(--sm-fs-control);',
		'	line-height: 20px;',
		'	font-weight: 400;',
		'	white-space: nowrap;',
		'	cursor: pointer;',
		'	transition: background-color var(--sm-fast) var(--sm-ease), color var(--sm-fast) var(--sm-ease);',
		'}',
		'',
		'.geSmLightbox .geSmLbTextBtn .geSmIcon {',
		'	--sm-icon: 18px;',
		'}',
		'',
		'/* Label to chevron 4 */',
		'.geSmLightbox .geSmLbTextBtn .geSmLbChevron {',
		'	--sm-icon: 16px;',
		'	margin-left: -4px;',
		'}',
		'',
		'.geSmLightbox .geSmLbBtnText {',
		'	min-width: 0;',
		'	overflow: hidden;',
		'	text-overflow: ellipsis;',
		'}',
		'',
		'.geSmLightbox .geSmLbTextBtn:hover {',
		'	background: var(--sm-surface-2);',
		'	color: var(--sm-text);',
		'}',
		'',
		'.geSmLightbox .geSmLbTextBtn.geSmLbAccent,',
		'.geSmLightbox .geSmLbTextBtn[aria-expanded="true"],',
		'.geSmLightbox .geSmIconBtn[aria-expanded="true"] {',
		'	background: var(--sm-accent-soft);',
		'	color: var(--sm-accent);',
		'	font-weight: 600;',
		'}',
		'',
		'.geSmLightbox .geSmLbTextBtn.geSmLbEditBtn {',
		'	height: var(--sm-ctl);',
		'	margin: 0 4px;',
		'	padding: 0 11px;',
		'	border: 1px solid var(--sm-border-strong);',
		'	color: var(--sm-text);',
		'	font-size: var(--sm-fs-body);',
		'	font-weight: 550;',
		'}',
		'',
		'.geSmLightbox .geSmLbTextBtn:focus-visible,',
		'.geSmLightbox .geSmLbItem:focus-visible,',
		'.geSmLightbox .geSmLbFormat:focus-visible,',
		'.geSmLightbox input.geSmLbSwitch[role="switch"]:focus-visible,',
		'.geSmLightbox .geSmLbPrimary:focus-visible {',
		'	outline: none;',
		'	box-shadow: var(--sm-focus);',
		'}',
		'',
		'/* Page number and zoom: 13/20, tabular figures */',
		'.geSmLightbox .geSmLbValue {',
		'	box-sizing: border-box;',
		'	min-width: 48px;',
		'	padding: 0 4px;',
		'	color: var(--sm-text);',
		'	font-size: var(--sm-fs-control);',
		'	line-height: 20px;',
		'	text-align: center;',
		'	white-space: nowrap;',
		'	font-variant-numeric: tabular-nums;',
		'}',
		'',
		'.geSmLightbox .geSmLbImage {',
		'	width: 20px;',
		'	height: 20px;',
		'}',
		'',
		'/* The page menu of the bottom bar: the name is shortened before the',
		'   number of the page */',
		'.geSmLightbox .geSmLbPageBtn {',
		'	max-width: 360px;',
		'}',
		'',
		'.geSmLightbox .geSmLbPageCount {',
		'	flex: 0 0 auto;',
		'	margin-left: -8px;',
		'	white-space: pre;',
		'}',
		'',
		'/* Phones: Back and Close top left, More top right, the bottom bar at',
		'   thumb height; the page menu with the number of the page only */',
		'.geSmLightbox .geSmLbPhoneTop {',
		'	left: 12px;',
		'	top: 12px;',
		'	max-width: calc(50% - 18px);',
		'}',
		'',
		'.geSmLightbox .geSmLbPhoneTopRight {',
		'	right: 12px;',
		'	top: 12px;',
		'	max-width: calc(50% - 18px);',
		'}',
		'',
		'.geSmLightbox .geSmLbMobile .geSmLbBottom {',
		'	bottom: 24px;',
		'}',
		'',
		'.geSmLightbox .geSmLbMobile .geSmLbPageBtn>.geSmIcon:first-child,',
		'.geSmLightbox .geSmLbMobile .geSmLbPageBtn .geSmLbBtnText,',
		'.geSmLightbox .geSmLbMobile .geSmLbPageDot {',
		'	display: none;',
		'}',
		'',
		'.geSmLightbox .geSmLbMobile .geSmLbPageCount {',
		'	margin-left: 0;',
		'}',
		'',
		'/* Popovers: menus (inset 4, items 32 (44) with their text at 46) and the',
		'   Export panel (inset 16), 8 below their button; bottom sheets on phones */',
		'.geSmLightbox .geSmLbPopover {',
		'	position: absolute;',
		'	box-sizing: border-box;',
		'	min-width: 240px;',
		'	max-width: calc(100% - 16px);',
		'	max-height: calc(100% - 80px);',
		'	padding: 3px;',
		'	overflow: auto;',
		'	border: 1px solid var(--sm-border);',
		'	border-radius: var(--sm-r-l);',
		'	background: var(--sm-surface);',
		'	box-shadow: var(--sm-e3);',
		'	color: var(--sm-text);',
		'	pointer-events: auto;',
		'	z-index: 4;',
		'}',
		'',
		'.geSmLightbox.geSmLbPhone .geSmLbPopover {',
		'	left: 0;',
		'	right: 0;',
		'	top: auto;',
		'	bottom: 0;',
		'	max-width: none;',
		'	max-height: calc(100% - 56px);',
		'	padding-bottom: calc(3px + env(safe-area-inset-bottom));',
		'	border-radius: var(--sm-r-xl) var(--sm-r-xl) 0 0;',
		'	box-shadow: var(--sm-e-sheet);',
		'}',
		'',
		'.geSmLightbox .geSmLbPopover.geSmLbPanel {',
		'	width: 332px;',
		'	padding: 15px;',
		'}',
		'',
		'.geSmLightbox.geSmLbPhone .geSmLbPopover.geSmLbPanel {',
		'	width: auto;',
		'	padding-bottom: calc(15px + env(safe-area-inset-bottom));',
		'}',
		'',
		'.geSmLightbox .geSmLbLanguages {',
		'	width: 272px;',
		'	max-width: 100%;',
		'}',
		'',
		'.geSmLightbox.geSmLbPhone .geSmLbLanguages {',
		'	width: auto;',
		'}',
		'',
		'.geSmLightbox .geSmLbCaption {',
		'	padding: 8px 12px 4px;',
		'	color: var(--sm-text-3);',
		'	font-size: var(--sm-fs-caption);',
		'	line-height: 16px;',
		'	font-weight: 650;',
		'	letter-spacing: 0.06em;',
		'	text-transform: uppercase;',
		'}',
		'',
		'.geSmLightbox .geSmLbItem {',
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
		'	color: var(--sm-text);',
		'	font-family: var(--sm-font);',
		'	font-size: var(--sm-fs-body);',
		'	line-height: 20px;',
		'	font-weight: 400;',
		'	text-align: left;',
		'	cursor: pointer;',
		'}',
		'',
		'.geSmLightbox .geSmLbItem:has(.geSmLbItemHint) {',
		'	padding: 8px 12px;',
		'}',
		'',
		'.geSmLightbox .geSmLbItem:hover {',
		'	background: var(--sm-accent-soft);',
		'}',
		'',
		'.geSmLightbox .geSmLbItem .geSmIcon {',
		'	--sm-icon: 18px;',
		'	color: var(--sm-text-2);',
		'}',
		'',
		'.geSmLightbox .geSmLbItem .geSmLbImage {',
		'	flex: 0 0 auto;',
		'	width: 18px;',
		'	height: 18px;',
		'}',
		'',
		'.geSmLightbox .geSmLbItem .geSmLbCheck {',
		'	color: var(--sm-accent);',
		'}',
		'',
		'.geSmLightbox .geSmLbItem[aria-checked="true"] {',
		'	font-weight: 600;',
		'}',
		'',
		'.geSmLightbox .geSmLbItemText {',
		'	display: flex;',
		'	flex-direction: column;',
		'	flex: 1 1 auto;',
		'	min-width: 0;',
		'}',
		'',
		'.geSmLightbox .geSmLbItemHint {',
		'	color: var(--sm-text-2);',
		'	font-size: var(--sm-fs-hint);',
		'	line-height: 16px;',
		'	font-weight: 400;',
		'}',
		'',
		'.geSmLightbox .geSmLbKey {',
		'	flex: 0 0 auto;',
		'	color: var(--sm-text-3);',
		'	font-size: var(--sm-fs-hint);',
		'	line-height: 16px;',
		'}',
		'',
		'@media (pointer: coarse) {',
		'	.geSmLightbox .geSmLbItem {',
		'		min-height: 44px;',
		'	}',
		'',
		'	.geSmLightbox .geSmLbKey {',
		'		display: none;',
		'	}',
		'}',
		'',
		'.geSmLightbox .geSmLbDivider {',
		'	height: 1px;',
		'	margin: 4px 0;',
		'	background: var(--sm-border);',
		'}',
		'',
		'.geSmLightbox .geSmLbNote {',
		'	padding: 8px 12px;',
		'	color: var(--sm-text-2);',
		'	font-size: var(--sm-fs-hint);',
		'	line-height: 16px;',
		'}',
		'',
		'.geSmLightbox .geSmLbNote b {',
		'	color: var(--sm-text);',
		'	font-weight: 600;',
		'}',
		'',
		'/* The Export panel: formats, Size, Look, Transparent background, the',
		'   primary action, then the other actions as menu items */',
		'.geSmLightbox .geSmLbPanel .geSmLbCaption {',
		'	padding: 0 0 8px;',
		'}',
		'',
		'.geSmLightbox .geSmLbFormats {',
		'	display: grid;',
		'	grid-auto-flow: column;',
		'	grid-auto-columns: minmax(0, 1fr);',
		'	gap: 8px;',
		'	margin-bottom: 8px;',
		'}',
		'',
		'.geSmLightbox .geSmLbFormat {',
		'	box-sizing: border-box;',
		'	height: var(--sm-hit);',
		'	margin: 0;',
		'	padding: 0;',
		'	border: 1px solid var(--sm-border-strong);',
		'	border-radius: var(--sm-r-m);',
		'	background: var(--sm-surface);',
		'	color: var(--sm-text);',
		'	font-family: var(--sm-font);',
		'	font-size: var(--sm-fs-control);',
		'	line-height: 20px;',
		'	font-weight: 600;',
		'	cursor: pointer;',
		'	transition: border-color var(--sm-fast) var(--sm-ease);',
		'}',
		'',
		'.geSmLightbox .geSmLbFormat:hover {',
		'	background: var(--sm-surface-2);',
		'}',
		'',
		'.geSmLightbox .geSmLbFormat.geSmOn {',
		'	border-color: var(--sm-accent);',
		'	box-shadow: inset 0 0 0 1px var(--sm-accent);',
		'}',
		'',
		'.geSmLightbox .geSmLbFormat.geSmOn:focus-visible {',
		'	box-shadow: inset 0 0 0 1px var(--sm-accent), var(--sm-focus);',
		'}',
		'',
		'.geSmLightbox .geSmLbRow {',
		'	display: grid;',
		'	grid-template-columns: 80px minmax(0, 1fr);',
		'	align-items: center;',
		'	justify-items: start;',
		'	min-height: var(--sm-hit);',
		'}',
		'',
		'.geSmLightbox .geSmLbRowLabel {',
		'	color: var(--sm-text-2);',
		'	font-size: var(--sm-fs-control);',
		'	line-height: 20px;',
		'}',
		'',
		'.geSmLightbox .geSmLbSwitchRow {',
		'	grid-template-columns: minmax(0, 1fr) auto;',
		'}',
		'',
		'.geSmLightbox .geSmLbSwitchRow .geSmLbRowLabel {',
		'	color: var(--sm-text);',
		'	cursor: pointer;',
		'}',
		'',
		'.geSmLightbox input.geSmLbSwitch[role="switch"] {',
		'	-webkit-appearance: none;',
		'	appearance: none;',
		'	position: relative;',
		'	flex: 0 0 auto;',
		'	box-sizing: border-box;',
		'	width: 36px;',
		'	height: 20px;',
		'	margin: 0;',
		'	border: none;',
		'	border-radius: 999px;',
		'	background: var(--sm-text-3);',
		'	cursor: pointer;',
		'	transition: background-color var(--sm-fast) var(--sm-ease);',
		'}',
		'',
		'.geSmLightbox input.geSmLbSwitch[role="switch"]::after {',
		'	content: \'\';',
		'	position: absolute;',
		'	left: 2px;',
		'	top: 2px;',
		'	width: 16px;',
		'	height: 16px;',
		'	border-radius: 50%;',
		'	background: var(--sm-knob);',
		'	box-shadow: var(--sm-knob-shadow);',
		'	transition: transform var(--sm-fast) var(--sm-ease);',
		'}',
		'',
		'.geSmLightbox input.geSmLbSwitch[role="switch"]:checked {',
		'	background: var(--sm-accent);',
		'}',
		'',
		'.geSmLightbox input.geSmLbSwitch[role="switch"]:checked::after {',
		'	transform: translateX(16px);',
		'	background: var(--sm-thumb);',
		'}',
		'',
		'.geSmLightbox .geSmLbPrimary {',
		'	display: flex;',
		'	align-items: center;',
		'	justify-content: center;',
		'	gap: 8px;',
		'	box-sizing: border-box;',
		'	width: 100%;',
		'	height: var(--sm-ctl);',
		'	margin: 8px 0 0;',
		'	padding: 0 16px;',
		'	border: none;',
		'	border-radius: var(--sm-r-m);',
		'	background: var(--sm-accent);',
		'	color: var(--sm-on-accent);',
		'	font-family: var(--sm-font);',
		'	font-size: var(--sm-fs-body);',
		'	line-height: 20px;',
		'	font-weight: 550;',
		'	cursor: pointer;',
		'	transition: background-color var(--sm-fast) var(--sm-ease);',
		'}',
		'',
		'.geSmLightbox .geSmLbPrimary:hover {',
		'	background: var(--sm-accent-hover);',
		'}',
		'',
		'.geSmLightbox .geSmLbPrimary .geSmIcon {',
		'	--sm-icon: 18px;',
		'}',
		'',
		'.geSmLightbox .geSmLbPanel .geSmLbDivider {',
		'	margin: 8px 0 4px;',
		'}'
	].join('\n');
};


/**
 * Returns true if the new lightbox is switched on (Editor.enableModernLightbox:
 * viewer-ui=modern or enableModernLightbox in the configuration) in the
 * full-page lightbox (lightbox=1), not in embed mode.
 */
LightboxModern.isEnabled = function()
{
	return Editor.enableModernLightbox === true && urlParams['lightbox'] == '1' &&
		urlParams['embed'] != '1';
};

/**
 * Returns the name of the given language code in that language.
 */
LightboxModern.getLanguageName = function(code)
{
	var tag = LightboxModern.getLanguageTag(code);
	var name = (typeof mxLanguageMap !== 'undefined' &&
		Object.prototype.hasOwnProperty.call(mxLanguageMap, tag)) ?
		mxLanguageMap[tag] : null;

	if (name == null || name == '')
	{
		try
		{
			name = new Intl.DisplayNames([tag], {type: 'language'}).of(tag);
			name = name.charAt(0).toLocaleUpperCase(tag) + name.substring(1);
		}
		catch (e)
		{
			name = code;
		}
	}

	return name;
};

/**
 * The new lightbox follows the appearance of the system unless dark is set.
 * In the init of the UI, as the configuration (Editor.configure) is applied
 * after this file is loaded and before the UI decides the dark mode. Only
 * if the bars are installed (see initCanvas), so a lightbox without them,
 * eg. with toolbar=0, stays light as the default lightbox.
 */
(function()
{
	var editorUiInit = EditorUi.prototype.init;

	EditorUi.prototype.init = function()
	{
		if (urlParams['dark'] == null && urlParams['toolbar'] != '0' &&
			this.isModernLightbox())
		{
			urlParams['dark'] = 'auto';
		}

		editorUiInit.apply(this, arguments);
	};
})();

/**
 * Returns true if this is the full-page lightbox with the new look.
 */
EditorUi.prototype.isModernLightbox = function()
{
	return LightboxModern.isEnabled() && this.editor.isChromelessView() &&
		!this.editor.editable && this.editor.graph.lightbox &&
		this.container == document.body;
};

/**
 * Installs the bars of the new lightbox instead of the default toolbar.
 */
EditorUi.prototype.installModernChromelessToolbar = function()
{
	if (this.isModernLightbox())
	{
		this.modernLightbox = new LightboxModern(this);

		// Removed by EditorUi.destroy
		this.chromelessToolbar = this.modernLightbox.root;

		return true;
	}

	return false;
};

/**
 * Returns true if images can be exported in the lightbox (as the camera
 * button of the default toolbar, see addChromelessToolbarItems): the
 * browser can export a canvas, the host allows image export and new
 * windows work (not for openInSameWin=1, see isWindowItemsEnabled).
 */
EditorUi.prototype.isModernLightboxExportEnabled = function()
{
	return urlParams['noExport'] != '1' && this.editor.isExportToCanvas() &&
		this.isChromelessImageExportEnabled() &&
		(urlParams['openInSameWin'] != '1' || navigator.standalone == true);
};

/**
 * Creates the bars and installs the listeners.
 */
LightboxModern.prototype.init = function()
{
	var ui = this.ui;
	var graph = this.graph;

	LightboxModern.installCss();
	this.root = document.createElement('div');
	this.root.className = 'geSmLightbox';

	// A language in the URL pins the language of the diagram. A language that
	// is no code, also with translate-diagram=1 (see Graph.diagramLanguage,
	// the share links of getPageLink), turns the translation off.
	if (urlParams['translate-diagram'] != '1' &&
		LightboxModern.isLanguageCode(urlParams['diagram-language']))
	{
		Graph.diagramLanguage = urlParams['diagram-language'];
		Graph.translateDiagram = true;
	}
	else if (Graph.translateDiagram && !LightboxModern.isLanguageCode(Graph.diagramLanguage))
	{
		Graph.translateDiagram = false;
	}

	this.languagePinned = Graph.translateDiagram;
	this.applyHiddenTags();
	this.createDesktopBars();
	this.createPhoneBars();
	this.root.appendChild(this.desk);
	this.root.appendChild(this.mobile);
	ui.container.appendChild(this.root);

	// The title for screen readers, which is not shown: a heading before
	// the diagram (the first child of the container, so it is read first),
	// as the bars show no title and the top left bar is hidden without Back
	// (see update)
	this.titleNode = document.createElement('h1');
	this.titleNode.className = 'geSmLbTitle';
	ui.container.insertBefore(this.titleNode, ui.container.firstChild);

	// EditorUi.destroy removes the bars (chromelessToolbar), not the
	// heading beside them in the container (the body), which stays
	ui.destroyFunctions.push(mxUtils.bind(this, function()
	{
		if (this.titleNode.parentNode != null)
		{
			this.titleNode.parentNode.removeChild(this.titleNode);
		}
	}));

	this.installTabOrder();

	var update = mxUtils.bind(this, function()
	{
		this.update();
	});

	ui.editor.addListener('resetGraphView', mxUtils.bind(this, function()
	{
		this.updateLanguages(true);
		this.update();
	}));

	ui.editor.addListener('pageSelected', mxUtils.bind(this, function()
	{
		this.hidePopover();
		this.updateLanguages();
		this.update();
	}));

	ui.editor.addListener('fileLoaded', update);
	graph.getModel().addListener(mxEvent.CHANGE, update);

	// The canvas color after each update of the background (this view only)
	var lb = this;
	var viewValidateBackgroundStyles = graph.view.validateBackgroundStyles;

	graph.view.validateBackgroundStyles = function()
	{
		viewValidateBackgroundStyles.apply(this, arguments);
		lb.updateCanvas();
	};

	graph.view.addListener(mxEvent.SCALE, update);
	graph.view.addListener(mxEvent.SCALE_AND_TRANSLATE, update);

	this.installListeners();
	this.update();
};

/**
 * Applies the hidden tags of the tags URL parameter (as the default
 * toolbar, see addChromelessToolbarItems), only if the Tags button can show
 * them again: not for openInSameWin=1 (see isWindowItemsEnabled), where the
 * default toolbar hides no cells.
 */
LightboxModern.prototype.applyHiddenTags = function()
{
	if (urlParams['tags'] != null && this.isWindowItemsEnabled())
	{
		var tagsParam = null;

		try
		{
			var value = urlParams['tags'];

			try
			{
				value = decodeURIComponent(value);
			}
			catch (e)
			{
				// Already decoded
			}

			tagsParam = JSON.parse(value);
		}
		catch (e)
		{
			// Ignores parse errors
		}

		if (tagsParam != null && typeof tagsParam === 'object')
		{
			this.ui.getHiddenTagsForPage = function(page)
			{
				// Own properties only as page IDs come from the diagram, a copy
				// as the Tags menu changes the hidden tags (toggleHiddenTag)
				var tags = (Object.prototype.hasOwnProperty.call(tagsParam, page.getId())) ?
					tagsParam[page.getId()] : null;

				return (Array.isArray(tags) && tags.length > 0) ? tags.slice() : [];
			};
		}
	}
};

/**
 * Puts the bars into the order of Tab of the UI (see getTabRegions), which
 * handles every Tab: the top bars before the diagram, the bottom bar after
 * it. The bars of the other layout are hidden and have no stops.
 */
LightboxModern.prototype.installTabOrder = function()
{
	var lb = this;
	var ui = this.ui;
	var uiGetTabRegions = ui.getTabRegions;

	ui.getTabRegions = function()
	{
		return lb.getTabRegions(uiGetTabRegions.apply(this, arguments));
	};

	// The text outline button of the diagram and its outline stop the keys
	// (see Graph.addTextOutlineButton), so Tab from them would follow the
	// order of the document, where the bars come after the diagram. In the
	// capture phase, as the toolbar of initCanvas.
	var container = this.graph.container;

	var tabKeyDown = function(evt)
	{
		if (evt.keyCode == 9 /* Tab */ && mxEvent.getSource(evt) != container &&
			ui.keydownHandler != null)
		{
			ui.keydownHandler(evt);
		}
	};

	container.addEventListener('keydown', tabKeyDown, true);

	ui.destroyFunctions.push(function()
	{
		container.removeEventListener('keydown', tabKeyDown, true);
	});
};

/**
 * Returns the given parts of the user interface in the order of Tab with
 * the bars around the diagram.
 */
LightboxModern.prototype.getTabRegions = function(regions)
{
	var result = regions.slice();
	var index = mxUtils.indexOf(result, this.graph.container);
	index = (index >= 0) ? index : result.length;
	result.splice(index + 1, 0, this.bottom, this.phoneBottom);
	result.splice(index, 0, this.topLeft, this.topRight, this.phoneTop, this.phoneTopRight);

	return result;
};

/**
 * Creates a button with an icon and an optional text. The title is the
 * tooltip and the accessible name.
 */
LightboxModern.prototype.createButton = function(icon, title, fn, label, className)
{
	var btn = null;

	if (label == null)
	{
		btn = LightboxModern.createIconButton(icon, title, fn, className);
	}
	else
	{
		btn = document.createElement('button');
		btn.setAttribute('type', 'button');
		btn.className = 'geSmLbTextBtn' + ((className != null) ? ' ' + className : '');
		btn.setAttribute('title', title);

		if (icon != null)
		{
			btn.appendChild(LightboxModern.createIcon(icon));
		}

		var text = document.createElement('span');
		text.className = 'geSmLbBtnText';
		btn.appendChild(text);
		btn.textNode = text;
		this.setButtonLabel(btn, label);

		mxEvent.addListener(btn, 'click', function(evt)
		{
			fn(evt);
			mxEvent.consume(evt);
		});
	}

	return btn;
};

/**
 * Sets the text of the given text button.
 */
LightboxModern.prototype.setButtonLabel = function(btn, label)
{
	if (btn.textNode.textContent != label)
	{
		btn.textNode.textContent = '';
		mxUtils.write(btn.textNode, label);
	}
};

/**
 * Adds a chevron to the given button and marks it as the opener of a menu.
 */
LightboxModern.prototype.addChevron = function(btn, popupRole)
{
	btn.appendChild(LightboxModern.createIcon(LightboxModern.icons.chevronDown, 'geSmLbChevron'));
	btn.setAttribute('aria-haspopup', popupRole || 'menu');
	btn.setAttribute('aria-expanded', 'false');

	return btn;
};

/**
 * Creates a separator of a bar.
 */
LightboxModern.prototype.createSeparator = function()
{
	var sep = document.createElement('span');
	sep.className = 'geSmLbSep';
	sep.setAttribute('aria-hidden', 'true');

	return sep;
};

/**
 * Creates a bar with the given class and accessible name.
 */
LightboxModern.prototype.createBar = function(className, label)
{
	var bar = document.createElement('div');
	bar.className = 'geSmLbBar ' + className;
	bar.setAttribute('role', 'toolbar');
	bar.setAttribute('aria-label', label);

	return bar;
};

/**
 * Returns true if the Edit button is shown.
 */
LightboxModern.prototype.isEditEnabled = function()
{
	return this.ui.editor.editButtonLink != null || this.ui.editor.editButtonFunc != null;
};

/**
 * Returns true if the Close button is shown and Escape closes the lightbox:
 * as the default toolbar, for close=1 or closeBtn of toolbar-config (never
 * in a fresh tab of a shared link), and never in a frame, where
 * window.close does nothing.
 */
LightboxModern.prototype.isCloseEnabled = function()
{
	return !this.toolbarConfig.noCloseBtn && window.self === window.top &&
		(urlParams['close'] == '1' || Boolean(this.toolbarConfig.closeBtn));
};

/**
 * Returns true if the layers of the diagram can be shown and hidden.
 */
LightboxModern.prototype.isLayersEnabled = function()
{
	var model = this.graph.getModel();

	return urlParams['layers'] == '1' && model.root != null &&
		model.getChildCount(model.root) > 1;
};

/**
 * Returns true if the tags of the diagram can be shown and hidden: with
 * the tags URL parameter if the diagram has tags (as the default toolbar).
 */
LightboxModern.prototype.isTagsEnabled = function()
{
	return urlParams['tags'] != null && this.isWindowItemsEnabled() &&
		this.graph.getAllTags().length > 0;
};

/**
 * Returns true if the items that the default toolbar adds with
 * addChromelessToolbarItems (Print, Tags, image export) are shown: not for
 * openInSameWin=1 (hosts where new windows do not work) unless in an app on
 * the home screen of iOS, as the default toolbar.
 */
LightboxModern.prototype.isWindowItemsEnabled = function()
{
	return urlParams['openInSameWin'] != '1' || navigator.standalone == true;
};

/**
 * Returns true if Print is shown (not for noPrint=1, see
 * isWindowItemsEnabled).
 */
LightboxModern.prototype.isPrintEnabled = function()
{
	return urlParams['noPrint'] != '1' && this.isWindowItemsEnabled();
};

/**
 * Returns true if Open in New Window is shown: the fullscreenBtn of
 * toolbar-config in a frame, unless it asks for the Fullscreen API
 * (fullscreen: true) and Full screen is shown (as the default toolbar).
 */
LightboxModern.prototype.isOpenInNewWindowEnabled = function()
{
	return this.toolbarConfig.fullscreenBtn != null && window.self !== window.top &&
		!(this.toolbarConfig.fullscreenBtn.fullscreen === true && this.isFullscreenEnabled());
};

/**
 * Returns true if the diagram has more than one page that can be shown.
 */
LightboxModern.prototype.hasPages = function()
{
	return this.ui.isPagesEnabled() && this.ui.pages != null &&
		this.ui.pages.length > 1 && this.ui.currentPage != null;
};

/**
 * Returns true if the Fullscreen API can be used.
 */
LightboxModern.prototype.isFullscreenEnabled = function()
{
	return document.fullscreenEnabled === true && document.documentElement != null &&
		typeof document.documentElement.requestFullscreen === 'function';
};

/**
 * Creates the bars of the desktop layout.
 */
LightboxModern.prototype.createDesktopBars = function()
{
	var ui = this.ui;
	this.desk = document.createElement('div');
	this.desk.className = 'geSmLbDesk';

	// Top left: Back only, hidden without it (no logo since 24 November
	// 2026; the title is the name of the bar only)
	var left = this.createBar('geSmLbTopLeft', mxResources.get('diagram'));
	this.topLeft = left;
	this.addBackButton(left);
	this.desk.appendChild(left);

	// Top right: language, layers, tags, Edit, Close
	var right = this.createBar('geSmLbTopRight', mxResources.get('toolbar'));
	this.topRight = right;

	this.langBtn = this.addChevron(this.createButton(LightboxModern.icons.globe,
		mxResources.get('diagramLanguage'), mxUtils.bind(this, function()
	{
		this.togglePopover(this.langBtn, mxUtils.bind(this, this.createLanguageMenu));
	}), ''));
	right.appendChild(this.langBtn);

	this.layersBtn = this.createButton(LightboxModern.icons.layers, mxResources.get('layers'),
		mxUtils.bind(this, function()
	{
		this.togglePopover(this.layersBtn, mxUtils.bind(this, this.createLayersMenu));
	}));
	this.layersBtn.setAttribute('aria-haspopup', 'menu');
	this.layersBtn.setAttribute('aria-expanded', 'false');
	right.appendChild(this.layersBtn);

	this.tagsBtn = this.createButton(LightboxModern.icons.tags, mxResources.get('tags'),
		mxUtils.bind(this, function()
	{
		this.togglePopover(this.tagsBtn, mxUtils.bind(this, this.createTagsMenu));
	}));
	this.tagsBtn.setAttribute('aria-haspopup', 'menu');
	this.tagsBtn.setAttribute('aria-expanded', 'false');
	right.appendChild(this.tagsBtn);

	this.addCustomButtons(right);
	right.appendChild(this.createSeparator());
	this.addRefreshButton(right);

	if (this.isEditEnabled())
	{
		right.appendChild(this.createButton(LightboxModern.icons.edit, mxResources.get('edit'),
			mxUtils.bind(this, function()
		{
			this.edit();
		}), mxResources.get('edit'), 'geSmLbEditBtn'));
	}

	if (this.isCloseEnabled())
	{
		right.appendChild(this.createButton(LightboxModern.icons.close, mxResources.get('close') +
			' (Escape)', mxUtils.bind(this, function()
		{
			this.close();
		})));
	}

	this.desk.appendChild(right);

	// Bottom centre: the page menu, zoom, Fit, Full screen and Export or Print
	var bottom = this.createBar('geSmLbBottom', mxResources.get('pages') + ', ' + mxResources.get('zoom'));
	this.bottom = bottom;
	this.pageBtn = this.createPageButton();
	bottom.appendChild(this.pageBtn);
	bottom.appendChild(this.createSeparator());

	bottom.appendChild(this.createButton(LightboxModern.icons.minus, mxResources.get('zoomOut'),
		mxUtils.bind(this, function()
	{
		ui.actions.get('zoomOut').funct();
	})));

	this.zoomValue = document.createElement('span');
	this.zoomValue.className = 'geSmLbValue';
	this.zoomValue.setAttribute('aria-label', mxResources.get('zoom'));
	bottom.appendChild(this.zoomValue);

	bottom.appendChild(this.createButton(LightboxModern.icons.plus, mxResources.get('zoomIn'),
		mxUtils.bind(this, function()
	{
		ui.actions.get('zoomIn').funct();
	})));

	bottom.appendChild(this.createSeparator());

	bottom.appendChild(this.createButton(LightboxModern.icons.fit, mxResources.get('fit') + ' (F)',
		mxUtils.bind(this, function()
	{
		this.fit();
	})));

	if (this.isFullscreenEnabled())
	{
		this.fullscreenBtn = this.createButton(LightboxModern.icons.fullscreen,
			mxResources.get('fullscreen'), mxUtils.bind(this, function()
		{
			this.toggleFullscreen();
		}));
		bottom.appendChild(this.fullscreenBtn);
	}

	if (this.isOpenInNewWindowEnabled())
	{
		bottom.appendChild(this.createButton(LightboxModern.icons.external,
			mxResources.get('openInNewWindow'), mxUtils.bind(this, function()
		{
			this.openInNewWindow();
		})));
	}

	bottom.appendChild(this.createSeparator());
	this.exportBtn = this.addOutputButton(bottom);
	this.desk.appendChild(bottom);
};

/**
 * Creates the bars of the phone layout.
 */
LightboxModern.prototype.createPhoneBars = function()
{
	this.mobile = document.createElement('div');
	this.mobile.className = 'geSmLbMobile';

	// Top left: Back and Close (hidden without them)
	var top = this.createBar('geSmLbPhoneTop', mxResources.get('diagram'));
	this.phoneTop = top;
	this.addBackButton(top);

	if (this.isCloseEnabled())
	{
		top.appendChild(this.createButton(LightboxModern.icons.close, mxResources.get('close'),
			mxUtils.bind(this, function()
		{
			this.close();
		})));
	}

	this.mobile.appendChild(top);

	// Top right: More
	var right = this.createBar('geSmLbPhoneTopRight', mxResources.get('toolbar'));
	this.phoneTopRight = right;

	this.moreBtn = this.createButton(LightboxModern.icons.more, mxResources.get('moreOptions'),
		mxUtils.bind(this, function()
	{
		this.togglePopover(this.moreBtn, mxUtils.bind(this, this.createMoreMenu));
	}));
	this.moreBtn.setAttribute('aria-haspopup', 'menu');
	this.moreBtn.setAttribute('aria-expanded', 'false');
	right.appendChild(this.moreBtn);
	this.mobile.appendChild(right);

	// Bottom: the page menu, Fit, the language and Export or Print at thumb
	// height
	var bottom = this.createBar('geSmLbBottom', mxResources.get('pages'));
	this.phoneBottom = bottom;
	this.phonePageBtn = this.createPageButton();
	bottom.appendChild(this.phonePageBtn);
	bottom.appendChild(this.createSeparator());

	bottom.appendChild(this.createButton(LightboxModern.icons.fit, mxResources.get('fit'),
		mxUtils.bind(this, function()
	{
		this.fit();
	})));

	this.phoneLangBtn = this.createButton(LightboxModern.icons.globe, mxResources.get('diagramLanguage'),
		mxUtils.bind(this, function()
	{
		this.togglePopover(this.phoneLangBtn, mxUtils.bind(this, this.createLanguageMenu));
	}));
	this.phoneLangBtn.setAttribute('aria-haspopup', 'menu');
	this.phoneLangBtn.setAttribute('aria-expanded', 'false');
	bottom.appendChild(this.phoneLangBtn);
	bottom.appendChild(this.createSeparator());
	this.phoneExportBtn = this.addOutputButton(bottom);
	this.mobile.appendChild(bottom);
};

/**
 * Creates the button of the page menu ("Name · 1 of 3") of a bottom bar,
 * shown only with more than one page (see update). The name is shortened
 * before the number of the page; phones show the number only (the accessible
 * name has both, see update).
 */
LightboxModern.prototype.createPageButton = function()
{
	var btn = this.addChevron(this.createButton(LightboxModern.icons.pages, mxResources.get('pages'),
		mxUtils.bind(this, function()
	{
		this.togglePopover(btn, mxUtils.bind(this, this.createPageMenu));
	}), '', 'geSmLbAccent geSmLbPageBtn'));

	var count = document.createElement('span');
	count.className = 'geSmLbPageCount';
	var dot = document.createElement('span');
	dot.className = 'geSmLbPageDot';
	mxUtils.write(dot, ' · ');
	count.appendChild(dot);
	btn.countNode = document.createElement('span');
	count.appendChild(btn.countNode);
	btn.insertBefore(count, btn.textNode.nextSibling);

	return btn;
};

/**
 * Adds Export to the given bottom bar, or Print where image export is not
 * enabled, and returns Export (null if it is not shown).
 */
LightboxModern.prototype.addOutputButton = function(bar)
{
	var btn = null;

	if (this.ui.isModernLightboxExportEnabled())
	{
		btn = this.createButton(LightboxModern.icons.download, mxResources.get('export'),
			mxUtils.bind(this, function()
		{
			this.togglePopover(btn, mxUtils.bind(this, this.createExportPanel), 'dialog');
		}));
		btn.setAttribute('aria-haspopup', 'dialog');
		btn.setAttribute('aria-expanded', 'false');
		bar.appendChild(btn);
	}
	else if (this.isPrintEnabled())
	{
		bar.appendChild(this.createButton(LightboxModern.icons.print, mxResources.get('print'),
			mxUtils.bind(this, function()
		{
			this.print();
		})));
	}

	return btn;
};

/**
 * Adds the Back button of the toolbar-config URL parameter (same-origin
 * only, as the default toolbar).
 */
LightboxModern.prototype.addBackButton = function(bar)
{
	if (this.toolbarConfig.backBtn != null)
	{
		var backUrl = Graph.sanitizeLink(this.toolbarConfig.backBtn.url);

		if (backUrl != null && Graph.isSameOrigin(backUrl))
		{
			bar.appendChild(this.createButton(LightboxModern.icons.back, mxResources.get('back'), function()
			{
				window.location.href = backUrl;
			}));
		}
	}
};

/**
 * Adds the Refresh button of the toolbar-config URL parameter (same-origin
 * only, as the default toolbar).
 */
LightboxModern.prototype.addRefreshButton = function(bar)
{
	if (this.toolbarConfig.refreshBtn != null)
	{
		bar.appendChild(this.createButton(LightboxModern.icons.refresh, mxResources.get('refresh'),
			mxUtils.bind(this, function()
		{
			this.refresh();
		})));
	}
};

/**
 * Loads the URL of the Refresh button of toolbar-config if it has the same
 * origin, else reloads the page (as the default toolbar).
 */
LightboxModern.prototype.refresh = function()
{
	var refreshUrl = (this.toolbarConfig.refreshBtn == null ||
		this.toolbarConfig.refreshBtn.url == null) ? null :
		Graph.sanitizeLink(this.toolbarConfig.refreshBtn.url);

	if (refreshUrl != null && Graph.isSameOrigin(refreshUrl))
	{
		window.location.href = refreshUrl;
	}
	else
	{
		window.location.reload();
	}
};

/**
 * Creates the image of the given action of lightboxToolbarActions. The
 * icons are black (the default toolbar inverts them), so they are inverted
 * in dark mode (geAdaptiveAsset).
 */
LightboxModern.createActionImage = function(action)
{
	var img = document.createElement('img');
	img.className = 'geSmLbImage geAdaptiveAsset';
	img.setAttribute('alt', '');
	img.setAttribute('src', action.icon);

	return img;
};

/**
 * Adds the buttons of lightboxToolbarActions ({fn, icon, tooltip}). The
 * elem of an action is its button, which integrations remove to hide the
 * action (also in the More menu of phones, see createMoreMenu).
 */
LightboxModern.prototype.addCustomButtons = function(bar)
{
	var actions = this.ui.lightboxToolbarActions;

	if (actions != null)
	{
		for (var i = 0; i < actions.length; i++)
		{
			(function(action)
			{
				var btn = document.createElement('button');
				btn.setAttribute('type', 'button');
				btn.className = 'geSmIconBtn';
				btn.setAttribute('title', action.tooltip || '');
				btn.setAttribute('aria-label', action.tooltip || '');
				btn.appendChild(LightboxModern.createActionImage(action));

				mxEvent.addListener(btn, 'click', action.fn);
				action.elem = btn;
				bar.appendChild(btn);
			})(actions[i]);
		}
	}
};

/**
 * Updates the name of the diagram, the page menus, the language, the layers
 * and the zoom.
 */
LightboxModern.prototype.update = function()
{
	var ui = this.ui;
	var title = this.getTitle();
	var pages = this.hasPages();
	var index = (pages) ? mxUtils.indexOf(ui.pages, ui.currentPage) : 0;
	var count = (pages) ? ui.pages.length : 1;
	var pageName = (ui.currentPage != null) ? ui.currentPage.getName() : '';
	var langName = this.getLanguageName(this.getLanguage());
	var hasLanguages = this.languages.length > 0 || this.getLanguage() != null;

	// The title is not shown: the heading for screen readers has it (as
	// text) and it names the top left bar (of Back)
	var titleText = (title != null) ? String(title) : '';

	if (this.titleNode.textContent != titleText)
	{
		this.titleNode.textContent = '';
		mxUtils.write(this.titleNode, titleText);
	}

	if (this.topLeft.getAttribute('aria-label') != title)
	{
		this.topLeft.setAttribute('aria-label', title);
	}

	// Page menus: "Name · 1 of 3" (the arrow keys change pages)
	var pageBtns = [this.pageBtn, this.phonePageBtn];

	for (var i = 0; i < pageBtns.length; i++)
	{
		var btn = pageBtns[i];
		btn.style.display = (pages) ? '' : 'none';

		if (pages)
		{
			this.setButtonLabel(btn, pageName);
			var nOfM = mxResources.get('nOfM', [index + 1, count]);

			if (btn.countNode.textContent != nOfM)
			{
				btn.countNode.textContent = '';
				mxUtils.write(btn.countNode, nOfM);
			}

			btn.setAttribute('title', mxResources.get('pages') + ': ' +
				mxResources.get('pageOfPages', [index + 1, count]) + ' (← →)');

			// Phones hide the name of the page, so the accessible name is set:
			// "Pages" and the whole text of the button. It also names the page
			// menu (showPopover), as the tooltip would with its arrows.
			var btnName = mxResources.get('pages') + ': ' + btn.textContent;

			if (btn.getAttribute('aria-label') != btnName)
			{
				btn.setAttribute('aria-label', btnName);
			}
		}
	}

	// Language
	this.langBtn.style.display = (hasLanguages) ? '' : 'none';
	this.phoneLangBtn.style.display = (hasLanguages) ? '' : 'none';
	this.setButtonLabel(this.langBtn, langName);
	this.langBtn.setAttribute('title', mxResources.get('diagramLanguage') + ': ' + langName);
	this.phoneLangBtn.setAttribute('title', mxResources.get('diagramLanguage') + ': ' + langName);
	this.phoneLangBtn.setAttribute('aria-label', mxResources.get('diagramLanguage') + ': ' + langName);

	// Layers and tags
	this.layersBtn.style.display = (this.isLayersEnabled()) ? '' : 'none';
	this.tagsBtn.style.display = (this.isTagsEnabled()) ? '' : 'none';

	// Separators and bars without visible buttons
	var barList = [this.topLeft, this.topRight, this.bottom, this.phoneTop,
		this.phoneTopRight, this.phoneBottom];

	for (var i = 0; i < barList.length; i++)
	{
		this.updateBar(barList[i]);
	}

	// Zoom
	var zoom = Math.round(this.graph.view.scale * 100) + '%';

	if (this.zoomValue.textContent != zoom)
	{
		this.zoomValue.textContent = '';
		mxUtils.write(this.zoomValue, zoom);
	}

	this.updateCanvas();
	this.updateLayout();
};

/**
 * Shows a separator of the given bar only between visible buttons and hides
 * the bar if it has none.
 */
LightboxModern.prototype.updateBar = function(bar)
{
	var children = bar.children;
	var pending = null;
	var before = false;
	var visible = 0;

	for (var i = 0; i < children.length; i++)
	{
		var child = children[i];

		if (child.classList.contains('geSmLbSep'))
		{
			child.style.display = 'none';

			if (before)
			{
				pending = child;
				before = false;
			}
		}
		else if (child.style.display != 'none')
		{
			if (pending != null)
			{
				pending.style.display = '';
				pending = null;
			}

			before = true;
			visible++;
		}
	}

	bar.style.display = (visible > 0) ? '' : 'none';
};

/**
 * Shows diagrams without a background on the canvas color of the tokens
 * (light or dark by the color scheme of the container). Diagrams with a
 * background keep it.
 */
LightboxModern.prototype.updateCanvas = function()
{
	var graph = this.graph;
	var canvas = graph.view.canvas;
	canvas = (canvas != null && canvas.ownerSVGElement != null) ? canvas.ownerSVGElement : null;

	if (canvas != null && graph.view.backgroundPageShape == null &&
		urlParams['transparent'] != '1' && (graph.background == null ||
		graph.background == mxConstants.NONE))
	{
		if (this.canvasToken == null)
		{
			this.canvasToken = getComputedStyle(this.root).getPropertyValue('--sm-canvas').trim();
		}

		if (this.canvasToken != '')
		{
			canvas.style.backgroundColor = this.canvasToken;
		}
	}
};

/**
 * Sets the phone layout by the width of the window.
 */
LightboxModern.prototype.updateLayout = function()
{
	var phone = (window.innerWidth || document.documentElement.clientWidth) < LightboxModern.phoneWidth;

	if (phone != this.root.classList.contains('geSmLbPhone'))
	{
		this.hidePopover();
		this.root.classList.toggle('geSmLbPhone', phone);
	}
};

/**
 * Returns the title: the name of the file without its extension.
 */
LightboxModern.prototype.getTitle = function()
{
	var ui = this.ui;

	if (ui.getCurrentFile() != null)
	{
		return ui.getBaseFilename(true);
	}
	else if (urlParams['title'] != null)
	{
		try
		{
			return decodeURIComponent(urlParams['title']);
		}
		catch (e)
		{
			return urlParams['title'];
		}
	}

	return ui.defaultFilename;
};

/**
 * Returns the language shown or null for the original labels.
 */
LightboxModern.prototype.getLanguage = function()
{
	return (Graph.translateDiagram && Graph.diagramLanguage != null &&
		Graph.diagramLanguage != '') ? Graph.diagramLanguage : null;
};

/**
 * Returns the name of the given language or Original for null.
 */
LightboxModern.prototype.getLanguageName = function(code)
{
	return (code != null) ? LightboxModern.getLanguageName(code) :
		mxResources.get('lightboxOriginal');
};

/**
 * Shows the labels in the given language (null for the original labels).
 */
LightboxModern.prototype.setLanguage = function(code)
{
	if (code != this.getLanguage())
	{
		if (code != null)
		{
			Graph.diagramLanguage = code;
			Graph.translateDiagram = true;
		}
		else
		{
			Graph.translateDiagram = false;
		}

		this.languageChosen = true;
		this.updateLabelLanguage();
		this.graph.refresh();
		this.update();

		if (this.ui.announce != null)
		{
			this.ui.announce(this.getLanguageName(code));
		}
	}
};

/**
 * Sets the lang attribute of the diagram for screen readers.
 */
LightboxModern.prototype.updateLabelLanguage = function()
{
	var lang = this.getLanguage();

	if (lang != null)
	{
		this.graph.container.setAttribute('lang', LightboxModern.getLanguageTag(lang));
	}
	else
	{
		this.graph.container.removeAttribute('lang');
	}
};

/**
 * Finds the languages of the labels of the current page: the codes of the
 * label_<code> attributes and the number of labels of each, and the number
 * of labels. Nothing is stored in the file. On the first page the language
 * of the browser is shown if the diagram has it and no language is pinned.
 */
LightboxModern.prototype.updateLanguages = function(loaded)
{
	var model = this.graph.getModel();
	var counts = {};
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

					var names = (typeof value.getAttributeNames === 'function') ?
						value.getAttributeNames() : [];
					var read = 0;

					for (var i = 0; i < names.length && read < LightboxModern.maxLanguageAttributes; i++)
					{
						var m = LightboxModern.languagePattern.exec(names[i]);

						if (m != null)
						{
							read++;

							if (value.getAttribute(names[i]) != '')
							{
								counts[m[1]] = (Object.prototype.hasOwnProperty.call(counts, m[1])) ?
									counts[m[1]] + 1 : 1;
							}
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

	for (var code in counts)
	{
		if (Object.prototype.hasOwnProperty.call(counts, code))
		{
			langs.push({code: code, count: counts[code]});
		}
	}

	langs.sort(function(a, b)
	{
		return (a.code < b.code) ? -1 : ((a.code > b.code) ? 1 : 0);
	});

	this.languages = langs;
	this.labelCount = total;

	// The language of the browser if the diagram has it, else its primary
	// language (zh-tw before zh for zh-TW, de for de-CH)
	if (loaded && !this.languagePinned && !this.languageChosen && langs.length > 0)
	{
		this.languageChosen = true;
		var nav = String(navigator.language || '').toLowerCase();
		var primary = nav.split('-')[0];
		var match = null, exact = false;

		for (var i = 0; i < langs.length && !exact; i++)
		{
			var tag = LightboxModern.getLanguageTag(langs[i].code);
			exact = tag == nav;

			if (exact || (tag == primary && match == null))
			{
				match = langs[i].code;
			}
		}

		if (match != null)
		{
			Graph.diagramLanguage = match;
			Graph.translateDiagram = true;
			this.graph.refresh();
		}
	}

	this.updateLabelLanguage();
};

/**
 * Shows or hides a popover for the given anchor. createContent returns
 * the content of the popover.
 */
LightboxModern.prototype.togglePopover = function(anchor, createContent, role)
{
	if (this.popover != null && this.popoverAnchor == anchor)
	{
		this.hidePopover(true);
	}
	else
	{
		this.showPopover(anchor, createContent(), role || 'menu');
	}
};

/**
 * Shows the given content in a popover below the given anchor (a bottom
 * sheet on phones).
 */
LightboxModern.prototype.showPopover = function(anchor, content, role)
{
	this.hidePopover();

	var pop = document.createElement('div');
	pop.className = 'geSmLbPopover' + ((role == 'dialog') ? ' geSmLbPanel' : '');
	pop.setAttribute('role', role);
	pop.setAttribute('aria-label', anchor.getAttribute('aria-label') ||
		anchor.getAttribute('title') || '');

	if (role == 'dialog')
	{
		pop.setAttribute('aria-modal', 'false');
	}

	pop.appendChild(content);
	this.root.appendChild(pop);
	this.popover = pop;
	this.popoverAnchor = anchor;
	anchor.setAttribute('aria-expanded', 'true');
	this.positionPopover();
	this.showBars();

	mxEvent.addListener(pop, 'keydown', mxUtils.bind(this, function(evt)
	{
		this.popoverKeyDown(evt);
	}));

	// Focuses the checked item, the first item or the first control (the
	// chosen format of the Export panel)
	var items = (role == 'dialog') ? pop.querySelectorAll('[aria-checked="true"]') :
		this.getMenuItems();
	var first = null;

	for (var i = 0; i < items.length && first == null; i++)
	{
		if (items[i].getAttribute('aria-checked') == 'true')
		{
			first = items[i];
		}
	}

	first = first || items[0] || pop.querySelector('button, input');

	if (first != null)
	{
		first.focus();
	}
};

/**
 * Places the popover 8 below its anchor, or 8 above it for the buttons of
 * the bottom bar, aligned with its left side or, if it does not fit, its
 * right side. Phones show it as a bottom sheet (CSS).
 */
LightboxModern.prototype.positionPopover = function()
{
	var pop = this.popover;

	if (pop != null)
	{
		pop.style.maxHeight = '';
		pop.style.bottom = '';

		if (this.root.classList.contains('geSmLbPhone'))
		{
			pop.style.left = '';
			pop.style.top = '';
		}
		else
		{
			var r = this.popoverAnchor.getBoundingClientRect();
			var w = pop.offsetWidth;
			var vw = window.innerWidth || document.documentElement.clientWidth;
			var x = r.left;

			if (x + w > vw - 8)
			{
				x = r.right - w;
			}

			pop.style.left = Math.max(8, Math.round(x)) + 'px';

			// Above the bottom bar, attached by its bottom edge, so that it
			// grows upwards (the Export panel changes its height)
			if (mxUtils.isAncestorNode(this.bottom, this.popoverAnchor))
			{
				pop.style.top = 'auto';
				pop.style.bottom = Math.round(this.root.getBoundingClientRect().bottom - r.top + 8) + 'px';
				pop.style.maxHeight = Math.max(0, Math.round(r.top - 16)) + 'px';
			}
			else
			{
				pop.style.top = Math.round(r.bottom + 8) + 'px';
			}
		}
	}
};

/**
 * Hides the popover. If focus is true the anchor gets the focus.
 */
LightboxModern.prototype.hidePopover = function(focus)
{
	if (this.popover != null)
	{
		var anchor = this.popoverAnchor;

		if (this.popover.parentNode != null)
		{
			this.popover.parentNode.removeChild(this.popover);
		}

		this.popover = null;
		this.popoverAnchor = null;
		anchor.setAttribute('aria-expanded', 'false');

		if (focus && anchor.offsetParent != null)
		{
			anchor.focus();
		}

		this.scheduleHide();
	}
};

/**
 * Returns the items of the menu in the popover.
 */
LightboxModern.prototype.getMenuItems = function()
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
 * Keys in a popover: Escape closes it, the arrow keys, Home and End move
 * between the items of a menu.
 */
LightboxModern.prototype.popoverKeyDown = function(evt)
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

		if (index >= 0 && items.length > 0)
		{
			var next = (evt.key == 'Home') ? 0 : ((evt.key == 'End') ? items.length - 1 :
				mxUtils.mod(index + ((evt.key == 'ArrowDown') ? 1 : -1), items.length));
			items[next].focus();
			mxEvent.consume(evt);
		}
	}
	else if (evt.key == 'Tab' && this.popover.getAttribute('role') == 'menu')
	{
		this.hidePopover(true);
	}
};

/**
 * Creates a caption of a menu.
 */
LightboxModern.prototype.createCaption = function(text)
{
	var caption = document.createElement('div');
	caption.className = 'geSmLbCaption';
	caption.setAttribute('role', 'presentation');
	mxUtils.write(caption, text);

	return caption;
};

/**
 * Creates an item of a menu. checked is true, false or null (no check
 * mark). hint is a second line, key a shortcut. role 'button' gives a plain
 * button in the look of an item for the actions of the Export panel: the
 * panel is a dialog, where an item would need a menu as its parent, and Tab
 * reaches buttons.
 */
LightboxModern.prototype.createItem = function(label, fn, icon, checked, hint, key, role)
{
	var item = document.createElement('button');
	item.setAttribute('type', 'button');
	item.className = 'geSmLbItem';

	if (role != 'button')
	{
		item.setAttribute('role', role || ((checked != null) ? 'menuitemradio' : 'menuitem'));
		item.setAttribute('tabindex', '-1');
	}

	if (checked != null)
	{
		item.setAttribute('aria-checked', (checked) ? 'true' : 'false');
		var check = LightboxModern.createIcon(LightboxModern.icons.check, 'geSmLbCheck');

		if (!checked)
		{
			check.style.visibility = 'hidden';
		}

		item.appendChild(check);
	}
	else if (icon != null)
	{
		item.appendChild(LightboxModern.createIcon(icon));
	}

	var text = document.createElement('span');
	text.className = 'geSmLbItemText';
	var name = document.createElement('span');
	mxUtils.write(name, label);
	text.appendChild(name);

	if (hint != null)
	{
		var h = document.createElement('span');
		h.className = 'geSmLbItemHint';
		mxUtils.write(h, hint);
		text.appendChild(h);
	}

	item.appendChild(text);

	if (key != null)
	{
		var k = document.createElement('span');
		k.className = 'geSmLbKey';
		k.setAttribute('aria-hidden', 'true');
		mxUtils.write(k, key);
		item.appendChild(k);
		item.setAttribute('aria-keyshortcuts', key.replace('Ctrl', 'Control'));
	}

	mxEvent.addListener(item, 'click', function(evt)
	{
		fn(evt);
		mxEvent.consume(evt);
	});

	return item;
};

/**
 * Creates the menu of the pages.
 */
LightboxModern.prototype.createPageMenu = function()
{
	var ui = this.ui;
	var div = document.createElement('div');
	div.appendChild(this.createCaption(mxResources.get('pages')));

	for (var i = 0; i < ui.pages.length; i++)
	{
		(mxUtils.bind(this, function(page, index)
		{
			div.appendChild(this.createItem(page.getName(), mxUtils.bind(this, function()
			{
				// Focuses the diagram, where the arrow keys change pages (on the
				// button they move the focus), before the item is removed (for the
				// focus ring) and without scrolling the page around a frame
				this.graph.container.focus({preventScroll: true});
				this.hidePopover();

				if (page != ui.currentPage)
				{
					ui.selectPage(page);
				}
			}), null, page == ui.currentPage, null, null));
		}))(ui.pages[i], i);
	}

	return div;
};

/**
 * Creates the menu of the languages of the diagram.
 */
LightboxModern.prototype.createLanguageMenu = function()
{
	var div = document.createElement('div');
	div.className = 'geSmLbLanguages';
	div.appendChild(this.createCaption(mxResources.get('lightboxDiagramLanguage')));
	var current = this.getLanguage();

	div.appendChild(this.createItem(mxResources.get('lightboxOriginal'), mxUtils.bind(this, function()
	{
		this.hidePopover(true);
		this.setLanguage(null);
	}), null, current == null, null));

	var langs = this.languages.slice();
	var found = current == null;

	for (var i = 0; i < langs.length; i++)
	{
		found = found || langs[i].code == current;
	}

	// A pinned language that this page does not have
	if (!found)
	{
		langs.push({code: current, count: 0});
	}

	for (var i = 0; i < langs.length; i++)
	{
		(mxUtils.bind(this, function(lang)
		{
			div.appendChild(this.createItem(LightboxModern.getLanguageName(lang.code), mxUtils.bind(this, function()
			{
				this.hidePopover(true);
				this.setLanguage(lang.code);
			}), null, current == lang.code, mxResources.get('lightboxLabelsTranslated',
				[lang.count, Math.max(lang.count, this.labelCount)])));
		}))(langs[i]);
	}

	var divider = document.createElement('div');
	divider.className = 'geSmLbDivider';
	divider.setAttribute('role', 'separator');
	div.appendChild(divider);

	var note = document.createElement('div');
	note.className = 'geSmLbNote';
	mxUtils.write(note, mxResources.get('lightboxLanguageHint'));

	if (current != null)
	{
		var code = document.createElement('b');
		mxUtils.write(code, ' &translate-diagram=1&diagram-language=' + current);
		note.appendChild(code);
	}

	div.appendChild(note);

	return div;
};

/**
 * Creates the menu of the layers of the current page.
 */
LightboxModern.prototype.createLayersMenu = function()
{
	var graph = this.graph;
	var model = graph.getModel();
	var div = document.createElement('div');
	div.appendChild(this.createCaption(mxResources.get('layers')));

	for (var i = model.getChildCount(model.root) - 1; i >= 0; i--)
	{
		(mxUtils.bind(this, function(layer)
		{
			var name = graph.convertValueToString(layer) ||
				mxResources.get('background');
			var item = this.createItem(name, mxUtils.bind(this, function()
			{
				model.setVisible(layer, !model.isVisible(layer));
				var visible = model.isVisible(layer);
				item.setAttribute('aria-checked', (visible) ? 'true' : 'false');
				item.firstChild.style.visibility = (visible) ? '' : 'hidden';
				this.ui.chromelessResize();
			}), null, model.isVisible(layer), null, null, 'menuitemcheckbox');
			div.appendChild(item);
		}))(model.getChildAt(model.root, i));
	}

	return div;
};

/**
 * Creates the menu of the tags of the diagram: a check for each tag that is
 * shown (see createTagsDialog).
 */
LightboxModern.prototype.createTagsMenu = function()
{
	var graph = this.graph;
	var div = document.createElement('div');
	div.appendChild(this.createCaption(mxResources.get('tags')));
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
				var visible = mxUtils.indexOf(graph.hiddenTags, tag) < 0;
				item.setAttribute('aria-checked', (visible) ? 'true' : 'false');
				item.firstChild.style.visibility = (visible) ? '' : 'hidden';
				this.ui.chromelessResize();
			}), null, mxUtils.indexOf(graph.hiddenTags, tag) < 0, null, null, 'menuitemcheckbox');
			div.appendChild(item);
		}))(tags[i]);
	}

	return div;
};

/**
 * Creates the More menu of phones.
 */
LightboxModern.prototype.createMoreMenu = function()
{
	var ui = this.ui;
	var div = document.createElement('div');

	var add = mxUtils.bind(this, function(label, icon, fn)
	{
		div.appendChild(this.createItem(label, mxUtils.bind(this, function()
		{
			this.hidePopover(true);
			fn();
		}), icon));
	});

	if (this.isLayersEnabled())
	{
		div.appendChild(this.createItem(mxResources.get('layers') + '...', mxUtils.bind(this, function()
		{
			this.showPopover(this.moreBtn, this.createLayersMenu(), 'menu');
		}), LightboxModern.icons.layers));
	}

	if (this.isTagsEnabled())
	{
		div.appendChild(this.createItem(mxResources.get('tags') + '...', mxUtils.bind(this, function()
		{
			this.showPopover(this.moreBtn, this.createTagsMenu(), 'menu');
		}), LightboxModern.icons.tags));
	}

	add(mxResources.get('zoomIn'), LightboxModern.icons.plus, function()
	{
		ui.actions.get('zoomIn').funct();
	});

	add(mxResources.get('zoomOut'), LightboxModern.icons.minus, function()
	{
		ui.actions.get('zoomOut').funct();
	});

	if (this.isFullscreenEnabled())
	{
		add(mxResources.get('fullscreen'), LightboxModern.icons.fullscreen, mxUtils.bind(this, function()
		{
			this.toggleFullscreen();
		}));
	}

	if (this.isCopyLinkEnabled())
	{
		add(mxResources.get('copyLinkToThisPage'), LightboxModern.icons.link, mxUtils.bind(this, function()
		{
			this.copyLink();
		}));
	}

	// Without image export Print is in the bottom bar
	if (this.isPrintEnabled() && this.ui.isModernLightboxExportEnabled())
	{
		add(mxResources.get('print') + '...', LightboxModern.icons.print, mxUtils.bind(this, function()
		{
			this.print();
		}));
	}

	if (this.isOpenInNewWindowEnabled())
	{
		add(mxResources.get('openInNewWindow'), LightboxModern.icons.external, mxUtils.bind(this, function()
		{
			this.openInNewWindow();
		}));
	}

	this.addCustomItems(div);

	if (this.toolbarConfig.refreshBtn != null)
	{
		add(mxResources.get('refresh'), LightboxModern.icons.refresh, mxUtils.bind(this, function()
		{
			this.refresh();
		}));
	}

	if (this.isEditEnabled())
	{
		add(mxResources.get('edit'), LightboxModern.icons.edit, mxUtils.bind(this, function()
		{
			this.edit();
		}));
	}

	return div;
};

/**
 * Adds the actions of lightboxToolbarActions to the given menu, except the
 * ones whose button an integration removed (see addCustomButtons).
 */
LightboxModern.prototype.addCustomItems = function(div)
{
	var actions = this.ui.lightboxToolbarActions;

	if (actions != null)
	{
		for (var i = 0; i < actions.length; i++)
		{
			(mxUtils.bind(this, function(action)
			{
				if (action.elem == null || action.elem.parentNode != null)
				{
					var item = this.createItem(action.tooltip || '', mxUtils.bind(this, function(evt)
					{
						this.hidePopover(true);
						action.fn(evt);
					}));

					item.insertBefore(LightboxModern.createActionImage(action), item.firstChild);
					div.appendChild(item);
				}
			}))(actions[i]);
		}
	}
};

/**
 * Returns the formats of the Export menu: PNG, SVG and JPEG are made in the
 * browser, PDF prints (the print dialog of the browser saves a PDF).
 */
LightboxModern.prototype.getExportFormats = function()
{
	var formats = [{id: 'png', label: mxResources.get('formatPng')},
		{id: 'svg', label: mxResources.get('formatSvg')}];

	if (this.isPrintEnabled())
	{
		formats.push({id: 'pdf', label: mxResources.get('formatPdf'),
			title: mxResources.get('printToPdf')});
	}

	formats.push({id: 'jpeg', label: mxResources.get('formatJpg')});

	return formats;
};

/**
 * Creates the Export menu: the format, the size, the look and the
 * background, Download, then Copy image, Copy link, Print and Open a copy.
 */
LightboxModern.prototype.createExportPanel = function()
{
	var ui = this.ui;
	var state = this.exportState;
	var div = document.createElement('div');
	div.appendChild(this.createCaption(mxResources.get('download')));

	var formats = this.getExportFormats();
	var formatGroup = document.createElement('div');
	formatGroup.className = 'geSmLbFormats';
	formatGroup.setAttribute('role', 'radiogroup');
	formatGroup.setAttribute('aria-label', mxResources.get('format'));
	div.appendChild(formatGroup);

	var rows = {};
	var tiles = [];
	var download = null;

	var row = mxUtils.bind(this, function(key, label, control)
	{
		var r = document.createElement('div');
		r.className = 'geSmLbRow';

		// The label of a switch is its label element: it names the switch
		// and a click on it toggles the switch
		var input = control.nodeName == 'INPUT';
		var l = document.createElement((input) ? 'label' : 'span');
		l.className = 'geSmLbRowLabel';
		mxUtils.write(l, label);

		if (input)
		{
			control.setAttribute('id', 'geSmLbRowControl' + (++LightboxModern.controlCounter));
			l.setAttribute('for', control.getAttribute('id'));
		}

		r.appendChild(l);
		r.appendChild(control);
		div.appendChild(r);
		rows[key] = r;

		return r;
	});

	var update = mxUtils.bind(this, function()
	{
		var f = state.format;

		for (var i = 0; i < tiles.length; i++)
		{
			var on = tiles[i].formatId == f;
			tiles[i].classList.toggle('geSmOn', on);
			tiles[i].setAttribute('aria-checked', (on) ? 'true' : 'false');
			tiles[i].setAttribute('tabindex', (on) ? '0' : '-1');
		}

		rows.scale.style.display = (f != 'pdf') ? '' : 'none';
		rows.theme.style.display = (f != 'pdf') ? '' : 'none';
		rows.transparent.style.display = (f == 'png' || f == 'svg') ? '' : 'none';
		download.textNode.textContent = '';
		mxUtils.write(download.textNode, (f == 'pdf') ? mxResources.get('printToPdf') + '...' :
			mxResources.get('downloadFormat', [this.getFormatLabel(f)]));

		if (copyImage != null)
		{
			copyImage.style.display = (f != 'pdf') ? '' : 'none';
		}
	});

	for (var i = 0; i < formats.length; i++)
	{
		(function(format)
		{
			var tile = document.createElement('button');
			tile.setAttribute('type', 'button');
			tile.className = 'geSmLbFormat';
			tile.setAttribute('role', 'radio');
			tile.formatId = format.id;
			mxUtils.write(tile, format.label);

			if (format.title != null)
			{
				tile.setAttribute('title', format.title);
			}

			mxEvent.addListener(tile, 'click', function(evt)
			{
				state.format = format.id;
				update();
				mxEvent.consume(evt);
			});

			tiles.push(tile);
			formatGroup.appendChild(tile);
		})(formats[i]);
	}

	// Arrow keys move the format (a radio group)
	mxEvent.addListener(formatGroup, 'keydown', function(evt)
	{
		var index = mxUtils.indexOf(tiles, document.activeElement);
		var dx = (evt.key == 'ArrowRight' || evt.key == 'ArrowDown') ? 1 :
			((evt.key == 'ArrowLeft' || evt.key == 'ArrowUp') ? -1 : 0);

		if (index >= 0 && dx != 0)
		{
			var next = mxUtils.mod(index + dx, tiles.length);
			state.format = tiles[next].formatId;
			update();
			tiles[next].focus();
			mxEvent.consume(evt);
		}
	});

	var scales = [];

	for (var i = 0; i < LightboxModern.scales.length; i++)
	{
		scales.push({value: LightboxModern.scales[i], label: LightboxModern.scales[i] + '×'});
	}

	row('scale', mxResources.get('size'), LightboxModern.createToggleGroup(scales, state.scale, function(value)
	{
		state.scale = value;
	}, mxResources.get('size')));

	row('theme', mxResources.get('look'), LightboxModern.createToggleGroup([
		{value: 'light', label: mxResources.get('light')},
		{value: 'dark', label: mxResources.get('dark')},
		{value: 'auto', label: mxResources.get('asShown')}], state.theme, function(value)
	{
		state.theme = value;
	}, mxResources.get('look')));

	var transparent = document.createElement('input');
	transparent.setAttribute('type', 'checkbox');
	transparent.setAttribute('role', 'switch');
	transparent.className = 'geSmLbSwitch';
	transparent.checked = state.transparent;

	mxEvent.addListener(transparent, 'change', function()
	{
		state.transparent = transparent.checked;
	});

	var transparentRow = row('transparent', mxResources.get('transparentBackground'), transparent);
	transparentRow.classList.add('geSmLbSwitchRow');

	download = document.createElement('button');
	download.setAttribute('type', 'button');
	download.className = 'geSmLbPrimary';
	download.appendChild(LightboxModern.createIcon(LightboxModern.icons.download));
	download.textNode = document.createElement('span');
	download.appendChild(download.textNode);
	div.appendChild(download);

	mxEvent.addListener(download, 'click', mxUtils.bind(this, function(evt)
	{
		this.download();
		mxEvent.consume(evt);
	}));

	var divider = document.createElement('div');
	divider.className = 'geSmLbDivider';
	divider.setAttribute('role', 'separator');
	div.appendChild(divider);

	var copyImage = null;

	if (navigator.clipboard != null && typeof window.ClipboardItem === 'function')
	{
		copyImage = this.createItem(mxResources.get('copyAsImage'), mxUtils.bind(this, function()
		{
			this.copyImage(copyImage);
		}), LightboxModern.icons.copy, null, null, null, 'button');
		div.appendChild(copyImage);
	}

	if (this.isCopyLinkEnabled())
	{
		var copyLink = this.createItem(mxResources.get('copyLinkToThisPage'), mxUtils.bind(this, function()
		{
			this.copyLink(copyLink);
		}), LightboxModern.icons.link, null, null, null, 'button');
		div.appendChild(copyLink);
	}

	if (this.isPrintEnabled())
	{
		div.appendChild(this.createItem(mxResources.get('print') + '...', mxUtils.bind(this, function()
		{
			this.print();
		}), LightboxModern.icons.print, null, null, 'Ctrl+P', 'button'));
	}

	if (this.isEditEnabled())
	{
		div.appendChild(this.createItem(mxResources.get('openCopyIn', [ui.appName || 'draw.io']),
			mxUtils.bind(this, function()
		{
			this.hidePopover();
			this.openCopy();
		}), LightboxModern.icons.open, null, null, null, 'button'));
	}

	update();

	return div;
};

/**
 * Returns the name of the given format.
 */
LightboxModern.prototype.getFormatLabel = function(format)
{
	var formats = this.getExportFormats();

	for (var i = 0; i < formats.length; i++)
	{
		if (formats[i].id == format)
		{
			return formats[i].label;
		}
	}

	return format.toUpperCase();
};

/**
 * Returns the theme of the export: light, dark or the one shown.
 */
LightboxModern.prototype.getExportTheme = function()
{
	var theme = this.exportState.theme;

	return (theme == 'auto') ? ((Editor.isDarkMode()) ? 'dark' : 'light') : theme;
};

/**
 * Exports the current page in the language shown as a canvas of the given
 * format and passes it and its data URI to fn. The optional error is called
 * with the error after it was shown, or without one if no export starts.
 */
LightboxModern.prototype.exportCanvas = function(format, fn, error)
{
	var ui = this.ui;
	var state = this.exportState;

	var handleError = function(e)
	{
		ui.handleError(e);

		if (error != null)
		{
			error(e);
		}
	};

	if (ui.thumbImageCache == null)
	{
		ui.thumbImageCache = new Object();
	}

	if (ui.spinner.spin(document.body, mxResources.get('exporting')))
	{
		ui.editor.exportToCanvas(mxUtils.bind(this, function(canvas)
		{
			ui.spinner.stop();

			try
			{
				fn(canvas, ui.createImageDataUri(canvas, null, format));
			}
			catch (e)
			{
				handleError(e);
			}
		}), null, ui.thumbImageCache, null, function(e)
		{
			ui.spinner.stop();
			handleError(e);
		}, null, true, state.scale, state.transparent && format == 'png', false,
			null, null, Editor.defaultBorder, null, null, this.getExportTheme());
	}
	else if (error != null)
	{
		error();
	}
};

/**
 * Downloads the current page in the chosen format, or prints for PDF.
 */
LightboxModern.prototype.download = function()
{
	var ui = this.ui;
	var state = this.exportState;
	var format = state.format;
	var filename = ui.getBaseFilename() + '.' + ((format == 'jpeg') ? 'jpg' : format);

	if (format == 'pdf')
	{
		this.hidePopover();
		this.print();
	}
	else if (format == 'svg')
	{
		this.hidePopover();
		ui.exportSvg(state.scale, state.transparent, true, false, false, true,
			Editor.defaultBorder, false, false, null, this.getExportTheme(), null, false,
			function(svg)
		{
			ui.doSaveLocalFile(svg, filename, 'image/svg+xml');
		});
	}
	else
	{
		this.hidePopover();
		this.exportCanvas(format, function(canvas, data)
		{
			ui.doSaveLocalFile(data.substring(data.indexOf(',') + 1), filename,
				'image/' + format, true);
		});
	}
};

/**
 * Shows the given text in an item for a moment (eg. Copied to clipboard).
 */
LightboxModern.prototype.flashItem = function(item, text)
{
	if (item != null && item.parentNode != null)
	{
		var label = item.querySelector('.geSmLbItemText>span');

		if (label != null)
		{
			// The label before the first of overlapping flashes
			if (item.flashLabel == null)
			{
				item.flashLabel = label.textContent;
			}

			window.clearTimeout(item.flashThread);
			label.textContent = '';
			mxUtils.write(label, text);

			item.flashThread = window.setTimeout(function()
			{
				label.textContent = item.flashLabel;
				item.flashLabel = null;
				item.flashThread = null;
			}, 1500);
		}
	}

	// Every copy is confirmed, also the same text twice in a row
	if (this.ui.announce != null)
	{
		this.ui.announce(text, true);
	}
};

/**
 * Copies the current page as a PNG to the clipboard. The write starts in the
 * click and waits for the export, as Safari refuses it after the export. If
 * the clipboard refuses the image, this falls back to the save dialog, which
 * copies in its own click, as EditorUi.copyImage does. While an export runs
 * this does nothing, as a new write would cancel the write of that export.
 */
LightboxModern.prototype.copyImage = function(item)
{
	var ui = this.ui;

	if (ui.spinner.active)
	{
		return;
	}

	ui.writeImageToClipboardAsync(mxUtils.bind(this, function(resolve, reject)
	{
		this.exportCanvas('png', function(canvas, data)
		{
			resolve(data, canvas.width, canvas.height);
		}, reject);
	}), 'image/png', mxUtils.bind(this, function()
	{
		this.flashItem(item, mxResources.get('copiedToClipboard'));
	}), mxUtils.bind(this, function(e, data)
	{
		if (ui.isLocalFileSave())
		{
			this.hidePopover();
			ui.saveLocalFile(data.substring(data.lastIndexOf(',') + 1),
				ui.getBaseFilename() + '.png', 'image/png', true, 'png',
				null, null, null, 'copy');
		}
		else
		{
			ui.handleError(e);
		}
	}));
};

/**
 * Hashes of the URL that locate the diagram: R (the diagram), U (a URL) and
 * the storages (App.storages: G, W, M, H, A, T). Not P (the options of a
 * diagram that the opener sends, the hash is cleared after the load), L, E
 * or D, which are local to the browser.
 */
LightboxModern.linkHashes = 'RUGWMHAT';

/**
 * Returns true if the link of the page (getPageLink) opens the diagram: the
 * URL locates it with its hash or the url parameter. Not for diagrams that
 * the opener sent, eg. the lightbox of GraphViewer, or create=.
 */
LightboxModern.prototype.isPageLinkEnabled = function()
{
	var hash = window.location.hash || '';

	return urlParams['url'] != null || (hash.length > 2 &&
		LightboxModern.linkHashes.indexOf(hash.charAt(1)) >= 0);
};

/**
 * Returns true if Copy link to this page is shown: the link opens the
 * diagram and the clipboard can be written (only in a secure context).
 */
LightboxModern.prototype.isCopyLinkEnabled = function()
{
	return navigator.clipboard != null && typeof navigator.clipboard.writeText === 'function' &&
		this.isPageLinkEnabled();
};

/**
 * Returns the link to the current page in the language shown: the URL of
 * the lightbox with page-id and the language (and the diagram in its hash).
 */
LightboxModern.prototype.getPageLink = function()
{
	var loc = window.location;
	var search = (loc.search.length > 1) ? loc.search.substring(1).split('&') : [];
	var params = [];
	var drop = ['page', 'page-id', 'translate-diagram', 'diagram-language'];

	for (var i = 0; i < search.length; i++)
	{
		var name = search[i].split('=')[0];

		if (search[i].length > 0 && mxUtils.indexOf(drop, name) < 0)
		{
			params.push(search[i]);
		}
	}

	if (this.ui.currentPage != null && this.hasPages())
	{
		params.push('page-id=' + encodeURIComponent(this.ui.currentPage.getId()));
	}

	var lang = this.getLanguage();

	if (lang != null)
	{
		params.push('translate-diagram=1');
		params.push('diagram-language=' + encodeURIComponent(lang));
	}

	return loc.protocol + '//' + loc.host + loc.pathname +
		((params.length > 0) ? '?' + params.join('&') : '') + loc.hash;
};

/**
 * Copies the link to the current page to the clipboard.
 */
LightboxModern.prototype.copyLink = function(item)
{
	var ui = this.ui;
	var link = this.getPageLink();

	try
	{
		ui.writeTextToClipboard(link, function(e)
		{
			ui.handleError(e);
		}, mxUtils.bind(this, function()
		{
			this.flashItem(item, mxResources.get('copiedToClipboard'));
		}));
	}
	catch (e)
	{
		ui.handleError(e);
	}
};

/**
 * Prints the diagram (the print dialog of the browser can save a PDF).
 */
LightboxModern.prototype.print = function()
{
	this.hidePopover();
	this.ui.actions.get('print').funct();
};

/**
 * Edits the diagram as the Edit button of the default toolbar.
 */
LightboxModern.prototype.edit = function()
{
	var ui = this.ui;

	if (ui.editor.editButtonFunc != null)
	{
		ui.editor.editButtonFunc();
	}
	else if (ui.editor.editButtonLink == '_blank')
	{
		this.openCopy();
	}
	else
	{
		this.graph.openLink(ui.editor.editButtonLink, 'editWindow');
	}
};

/**
 * Opens a copy of the diagram in a new editor window.
 */
LightboxModern.prototype.openCopy = function()
{
	var ui = this.ui;
	var pageId = (ui.currentPage != null) ? ui.currentPage.getId() : null;
	ui.editor.editAsNew(ui.getEditBlankXml(), null, null, pageId);
};

/**
 * Closes the window of the lightbox (as the Close button of the default
 * toolbar in a window).
 */
LightboxModern.prototype.close = function()
{
	window.close();
};

/**
 * Opens the URL of the fullscreenBtn of toolbar-config or this page in a
 * new window (as the default toolbar).
 */
LightboxModern.prototype.openInNewWindow = function()
{
	var btn = this.toolbarConfig.fullscreenBtn;
	this.graph.openLink((btn != null && btn.url) ? btn.url : window.location.href);
};

/**
 * Fits the diagram into the window (the fit of smartFit in the lightbox,
 * without its toggle to 100 %).
 */
LightboxModern.prototype.fit = function()
{
	this.ui.lightboxFit();
	this.ui.chromelessResize(false);
};

/**
 * Enters or leaves full screen.
 */
LightboxModern.prototype.toggleFullscreen = function()
{
	try
	{
		var result = (document.fullscreenElement == null) ?
			document.documentElement.requestFullscreen() :
			document.exitFullscreen();

		if (result != null && typeof result.then === 'function')
		{
			result['catch'](function()
			{
				// ignore
			});
		}
	}
	catch (e)
	{
		// ignore
	}
};

/**
 * Shows the bottom bar and hides it again after hideDelay without movement.
 */
LightboxModern.prototype.showBars = function()
{
	this.bottom.classList.remove('geSmLbIdle');
	this.phoneBottom.classList.remove('geSmLbIdle');
	this.scheduleHide();
};

/**
 * Hides the bottom bar after hideDelay unless toolbar-nohide is set, a
 * popover is open, or the pointer or the focus is in a bar.
 */
LightboxModern.prototype.scheduleHide = function()
{
	if (this.hideThread != null)
	{
		window.clearTimeout(this.hideThread);
		this.hideThread = null;
	}

	if (urlParams['toolbar-nohide'] != '1')
	{
		this.hideThread = window.setTimeout(mxUtils.bind(this, function()
		{
			this.hideThread = null;

			if (this.popover == null && !this.pointerInBar &&
				!mxUtils.isAncestorNode(this.root, document.activeElement))
			{
				this.bottom.classList.add('geSmLbIdle');
				this.phoneBottom.classList.add('geSmLbIdle');
			}
		}), LightboxModern.hideDelay);
	}
};

/**
 * Installs the listeners for the keys, the auto-hide, closing popovers and
 * the layout.
 */
LightboxModern.prototype.installListeners = function()
{
	var ui = this.ui;
	var root = this.root;

	var show = mxUtils.bind(this, function()
	{
		this.showBars();
	});

	// The default handler of the keys (EditorUi.keydownHandler) runs first
	// and closes a dialog with Escape without consuming it
	var keyDownCapture = mxUtils.bind(this, function(evt)
	{
		this.dialogKeyEvent = (ui.dialog != null) ? evt : null;
	});

	var keyDown = mxUtils.bind(this, function(evt)
	{
		this.keyDown(evt);
	});

	var pointerDown = mxUtils.bind(this, function(evt)
	{
		var src = mxEvent.getSource(evt);

		if (this.popover != null && !mxUtils.isAncestorNode(this.popover, src) &&
			!mxUtils.isAncestorNode(this.popoverAnchor, src))
		{
			this.hidePopover();
		}

		show();
	});

	var resize = mxUtils.bind(this, function()
	{
		this.updateLayout();
		this.positionPopover();
	});

	var fullscreenChange = mxUtils.bind(this, function()
	{
		if (this.fullscreenBtn != null)
		{
			var full = document.fullscreenElement != null;
			var title = mxResources.get((full) ? 'exitFullscreen' : 'fullscreen');
			this.fullscreenBtn.setAttribute('title', title);
			this.fullscreenBtn.setAttribute('aria-label', title);
			this.fullscreenBtn.firstChild.style.setProperty('--sm-ic', 'url(\'' +
				((full) ? LightboxModern.icons.exitFullscreen : LightboxModern.icons.fullscreen) + '\')');
		}
	});

	document.addEventListener('keydown', keyDownCapture, true);
	document.addEventListener('keydown', keyDown);
	document.addEventListener('pointerdown', pointerDown, true);
	document.addEventListener('pointermove', show);
	document.addEventListener('touchstart', show, {passive: true});
	document.addEventListener('wheel', show, {passive: true});
	document.addEventListener('fullscreenchange', fullscreenChange);
	window.addEventListener('resize', resize);
	root.addEventListener('focusin', show);

	root.addEventListener('pointerover', mxUtils.bind(this, function()
	{
		this.pointerInBar = true;
	}));

	root.addEventListener('pointerout', mxUtils.bind(this, function()
	{
		this.pointerInBar = false;
		this.scheduleHide();
	}));

	ui.destroyFunctions.push(mxUtils.bind(this, function()
	{
		document.removeEventListener('keydown', keyDownCapture, true);
		document.removeEventListener('keydown', keyDown);
		document.removeEventListener('pointerdown', pointerDown, true);
		document.removeEventListener('pointermove', show);
		document.removeEventListener('touchstart', show, {passive: true});
		document.removeEventListener('wheel', show, {passive: true});
		document.removeEventListener('fullscreenchange', fullscreenChange);
		window.removeEventListener('resize', resize);

		if (this.hideThread != null)
		{
			window.clearTimeout(this.hideThread);
			this.hideThread = null;
		}
	}));

	this.scheduleHide();
};

/**
 * Keys of the lightbox: left and right change pages, + and - zoom, F fits,
 * Escape closes a popover or the lightbox. Not in fields, dialogs (also not
 * the Escape that closed a dialog) or with modifiers.
 */
LightboxModern.prototype.keyDown = function(evt)
{
	var ui = this.ui;
	var src = mxEvent.getSource(evt);
	var dialog = this.dialogKeyEvent == evt;
	this.dialogKeyEvent = null;

	if (evt.defaultPrevented || mxEvent.isConsumed(evt) || evt.ctrlKey ||
		evt.metaKey || evt.altKey || ui.dialog != null || dialog ||
		(src != null && (src.nodeName == 'INPUT' || src.nodeName == 'TEXTAREA' ||
		src.nodeName == 'SELECT' || src.isContentEditable)))
	{
		return;
	}

	if (this.popover != null)
	{
		if (evt.key == 'Escape')
		{
			this.hidePopover(true);
			mxEvent.consume(evt);
		}

		return;
	}

	var handled = true;

	if (evt.key == 'ArrowLeft' && this.hasPages())
	{
		ui.actions.get('previousPage').funct();
	}
	else if (evt.key == 'ArrowRight' && this.hasPages())
	{
		ui.actions.get('nextPage').funct();
	}
	else if (evt.key == '+' || evt.key == '=')
	{
		ui.actions.get('zoomIn').funct();
	}
	else if (evt.key == '-' || evt.key == '_')
	{
		ui.actions.get('zoomOut').funct();
	}
	else if (evt.key == 'f' || evt.key == 'F')
	{
		this.fit();
	}
	else if (evt.key == 'Escape' && this.isCloseEnabled())
	{
		this.close();
	}
	else
	{
		handled = false;
	}

	if (handled)
	{
		this.showBars();
		mxEvent.consume(evt);
	}
};
