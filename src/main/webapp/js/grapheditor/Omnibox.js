/**
 * One search box for the features of the editor (omnibox): the actions, the
 * items of the menus, the controls of the format panel for the selection and
 * an entry that hands the text to the search for shapes in the sidebar. The
 * format panel has no search field of its own: its search button opens the
 * omnibox with the scope 'format', which lists only its controls.
 *
 * Entries match the text in the language of the user interface, the English
 * text of their resource keys (see Omnibox.englishResources) and the keywords
 * of these keys (<key>Keywords, phrases separated by semicolons). Text is
 * compared without case and diacritics. A term matches whole words and the
 * start of words, and from 3 characters or in scripts without spaces any part
 * of a word. Exact and prefix matches of the whole text rank first.
 *
 * Other code adds entries with addProvider or as actions: every visible action
 * with a label in the resources is an entry, so new actions need no changes
 * here (an action may implement getDisabledReason to explain its disabled
 * state).
 */
function Omnibox(editorUi)
{
	this.editorUi = editorUi;
	this.recent = [];
	this.providers = [];
};

/**
 * English labels and keywords of the resource keys of the entries, so that
 * English words find the entries in every language. Generated from dia.txt
 * by etc/i18n/omnibox-index.js (see diagramly/OmniboxIndex.js).
 */
Omnibox.englishResources = null;

/**
 * Counter for the IDs of the elements.
 */
Omnibox.counter = 0;

/**
 * Icons of the omnibox: the search icon of the input and the icons of the
 * kinds of entries.
 */
Omnibox.searchImage = 'data:image/svg+xml;base64,' + btoa('<svg xmlns="http://www.w3.org/2000/svg" ' +
	'width="18" height="18" viewBox="0 0 18 18"><circle cx="7.5" cy="7.5" r="5" stroke="#5f6368" ' +
	'stroke-width="1.8" fill="none"/><path d="M11.5 11.5L16 16" stroke="#5f6368" stroke-width="1.8" ' +
	'stroke-linecap="round"/></svg>');

Omnibox.formatImage = 'data:image/svg+xml;base64,' + btoa('<svg xmlns="http://www.w3.org/2000/svg" ' +
	'width="20" height="20" viewBox="0 0 20 20"><g fill="none" stroke="#333" stroke-width="1.5" ' +
	'stroke-linecap="round"><path d="M3 6h8M16 6h1M3 14h2M10 14h7"/><circle cx="13.5" cy="6" r="2"/>' +
	'<circle cx="7.5" cy="14" r="2"/></g></svg>');

Omnibox.actionImage = 'data:image/svg+xml;base64,' + btoa('<svg xmlns="http://www.w3.org/2000/svg" ' +
	'width="20" height="20" viewBox="0 0 20 20"><path d="M11.5 2L4.5 11h5l-1 7 7-9h-5z" fill="none" ' +
	'stroke="#333" stroke-width="1.5" stroke-linejoin="round"/></svg>');

Omnibox.menuImage = 'data:image/svg+xml;base64,' + btoa('<svg xmlns="http://www.w3.org/2000/svg" ' +
	'width="20" height="20" viewBox="0 0 20 20"><path d="M4 5.5h12M4 10h12M4 14.5h7" stroke="#333" ' +
	'stroke-width="1.5" stroke-linecap="round" fill="none"/></svg>');

Omnibox.pageImage = 'data:image/svg+xml;base64,' + btoa('<svg xmlns="http://www.w3.org/2000/svg" ' +
	'width="20" height="20" viewBox="0 0 20 20"><path d="M5 2.5h7l3.5 3.5v11.5h-10.5zM12 2.5v3.5h3.5" ' +
	'fill="none" stroke="#333" stroke-width="1.4" stroke-linejoin="round"/></svg>');

Omnibox.tieImage = 'data:image/svg+xml;base64,' + btoa('<svg xmlns="http://www.w3.org/2000/svg" ' +
	'width="16" height="16" viewBox="0 0 16 16"><path d="M2 4H14M2 8H14M2 12H14" stroke="#808080" ' +
	'stroke-width="1.3"/><path d="M8 1.5V14.5" stroke="#e0443e" stroke-width="2.6" stroke-linecap="round"/>' +
	'<rect x="5.6" y="0.6" width="4.8" height="3" rx="1" fill="#e0443e"/></svg>');

/**
 * Order of the groups of results. The order is fixed, so that people learn
 * where things are: the recently used entries (empty input), the settings of
 * the selection, actions, pages and the entries that hand the text to the
 * search of the shapes and to Find. Groups without results are not shown.
 * See getGroupOrder for the exception.
 */
Omnibox.prototype.groups = ['recent', 'format', 'actions', 'pages', 'search'];

/**
 * Resource keys of the titles of the groups.
 */
Omnibox.prototype.groupTitles = {recent: 'recentlyUsed', format: 'format',
	actions: 'actions', pages: 'pages', search: 'search'};

/**
 * Groups that can be the scope of the search (show, parseQuery).
 */
Omnibox.prototype.scopeGroups = ['format', 'actions', 'pages'];

/**
 * Resource key of the placeholder of the input or null. The input has no
 * placeholder: it shows the key hint / (see keyHint).
 */
Omnibox.prototype.placeholder = null;

/**
 * Maximum number of results per group without a scope.
 */
Omnibox.prototype.maxGroupResults = 8;

/**
 * Maximum number of results with a scope.
 */
Omnibox.prototype.maxScopeResults = 50;

/**
 * Width of the omnibox under its anchor (see getAnchor).
 */
Omnibox.prototype.anchoredWidth = 560;

/**
 * Text of the key hint at the end of the input: the key that opens the
 * omnibox (see EditorUi.openSearch) in a square. A click on it hides the
 * omnibox.
 */
Omnibox.prototype.keyHint = '/';

/**
 * Specifies if the omnibox fills the window (phones).
 */
Omnibox.prototype.fullScreen = false;

/**
 * Menus with more items than this are lists (languages, units), whose items
 * rank lower than other entries.
 */
Omnibox.prototype.maxMenuItems = 12;

/**
 * Maximum number of recently used entries.
 */
Omnibox.prototype.maxRecent = 5;

/**
 * Milliseconds of the highlight of a control in the format panel.
 */
Omnibox.prototype.highlightDelay = 2400;

/**
 * Names of the actions that are not offered, eg. because they need a position
 * of the mouse or are shown elsewhere.
 */
Omnibox.prototype.hiddenActions = ['deleteAll', 'searchActions', 'keyPressEnter',
	'pasteHere', 'addWaypoint', 'removeWaypoint', 'addConnectionPoint',
	'selectConnections'];

/**
 * Elements of the format panel that are indexed (see getFormatControl).
 */
Omnibox.prototype.formatControlSelector = '.geCollapsibleTitle, .geFormatSectionTitle, ' +
	'input, select, button, a[title], [role="button"][title]';

/**
 * Returns the icons of actions, menu items and controls of the format panel
 * by their action, resource or style key as data URIs. Icons that are not
 * monochrome are in coloredIcons.
 */
Omnibox.prototype.getIcons = function()
{
	if (this.icons == null)
	{
		var t = (typeof InlineToolbar !== 'undefined') ? InlineToolbar : {};
		var src = function(img) { return (img != null) ? ((img.src != null) ? img.src : img) : null; };
		var icons = {undo: Editor.undoImage, redo: Editor.redoImage, 'delete': Editor.trashImage,
			duplicate: Editor.duplicateImage, copy: Editor.copyImage, paste: Editor.pasteImage,
			zoomIn: Editor.zoomInImage, zoomOut: Editor.zoomOutImage, fitWindow: Editor.zoomFitImage,
			resetView: Editor.zoomFitImage, smartFit: Editor.zoomFitImage, fullscreen: Editor.fullscreenImage,
			layers: Editor.layersImage, outline: Editor.outlineImage, print: Editor.printImage,
			save: Editor.saveImage, saveAs: Editor.saveImage, toFront: Editor.toFrontImage,
			toBack: Editor.toBackImage, fillColor: Editor.fillColorImage, strokeColor: Editor.strokeColorImage,
			fontColor: Editor.fontColorImage, backgroundColor: Editor.backgroundColorImage,
			bold: Editor.boldImage, italic: Editor.italicImage, underline: Editor.underlineImage,
			subscript: Editor.subscriptImage, superscript: Editor.superscriptImage,
			removeFormat: Editor.removeFormatImage, editLink: Editor.linkImage, insertLink: Editor.linkImage,
			link: Editor.linkImage, editTooltip: Editor.tooltipImage, insertImage: Editor.imageImage,
			image: Editor.imageImage, editImage: Editor.imageImage, autosize: Editor.autosizeImage,
			swap: Editor.swapImage, lockUnlock: Editor.lockedImage, help: Editor.helpImage,
			format: Editor.formatImage, insertFreehand: Editor.freehandImage, opacity: Editor.opacityImage,
			layout: Editor.layoutImage, vertical: Editor.verticalTextImage, formattedText: Editor.textFormatImage,
			share: Editor.shareImage, configuration: Editor.gearImage, plugins: Editor.extensionImage,
			alignCellsLeft: Editor.alignHorizontalLeftImage, alignCellsCenter: Editor.alignHorizontalCenterImage,
			alignCellsRight: Editor.alignHorizontalRightImage, alignCellsTop: Editor.alignVerticalTopImage,
			alignCellsMiddle: Editor.alignVerticalMiddleImage, alignCellsBottom: Editor.alignVerticalBottomImage,
			search: Editor.shapesImage, copyStyle: t.copyStyleImage, pasteStyle: t.pasteStyleImage,
			rounded: t.roundedImage, toggleRounded: t.roundedImage, glass: t.glassImage,
			flowAnimation: t.flowAnimationImage, sketch: t.sketchImage, shadow: t.shadowImage,
			multiple: t.multipleImage, rotateWithEdge: t.rotateWithEdgeImage, crop: t.cropImage,
			editNote: t.noteImage, editData: t.dataImage, editPolygon: t.polygonImage,
			insertPolygon: t.polygonImage, editConnectionPoints: t.connectionPointsImage,
			connectionPoints: t.connectionPointsImage, clearWaypoints: t.clearWaypointsImage,
			resetLabelPositions: t.resetLabelImage, collapse: t.collapseImage, expand: t.expandImage,
			enterGroup: t.enterGroupImage, distributeHorizontal: t.distributeHorizontalImage,
			distributeVertical: t.distributeVerticalImage, dataSources: t.dataSourcesImage,
			bundle: Omnibox.tieImage, unbundle: Omnibox.tieImage, tie: Omnibox.tieImage};
		this.icons = Object.create(null);

		for (var key in icons)
		{
			if (src(icons[key]) != null)
			{
				this.icons[key] = src(icons[key]);
			}
		}

		this.coloredIcons = Object.create(null);
		this.coloredIcons[Omnibox.tieImage] = true;
	}

	return this.icons;
};

/**
 * Returns the icon of the given entry as a data URI: its own icon, the icon
 * of its action, resource keys or style keys, or the icon of its kind.
 */
Omnibox.prototype.getIcon = function(entry)
{
	if (entry.icon != null)
	{
		return entry.icon;
	}

	var icons = this.getIcons();
	var keys = [];

	if (entry.action != null)
	{
		keys.push(entry.action);
	}

	keys = keys.concat((entry.keys != null) ? entry.keys : this.getResourceKeys(entry.label));

	if (entry.names != null)
	{
		keys = keys.concat(entry.names);
	}

	for (var i = 0; i < keys.length; i++)
	{
		if (icons[keys[i]] != null)
		{
			return icons[keys[i]];
		}
	}

	return (entry.group == 'format') ? Omnibox.formatImage : ((entry.group == 'pages') ?
		Omnibox.pageImage : ((entry.action != null) ? Omnibox.actionImage : Omnibox.menuImage));
};

/**
 * Characters between words.
 */
Omnibox.separators = /[\s!-\/:-@\[-`{-~\u00a0-\u00bf\u2010-\u206f\u2190-\u21ff\u25a0-\u25ff\u3000-\u303f\u30fb]+/;

/**
 * Scripts that are written without spaces between words (Thai, Lao, Myanmar,
 * Khmer, Hiragana, Katakana, CJK) and Hangul, whose terms match any part of a
 * word.
 */
Omnibox.unspacedScripts = /[\u0e00-\u0eff\u1000-\u109f\u1100-\u11ff\u1780-\u17ff\u3040-\u30ff\u3130-\u318f\u3400-\u9fff\uac00-\ud7af\uf900-\ufaff]/;

/**
 * Returns the given text in lower case without diacritics and with the
 * compatibility forms of characters replaced (NFKD), eg. full-width Latin.
 */
Omnibox.normalize = function(text)
{
	text = (text != null) ? String(text) : '';

	if (typeof text.normalize === 'function')
	{
		text = text.normalize('NFKD');
	}

	return text.replace(/[\u0300-\u036f]/g, '').
		replace(/\u00df/g, 'ss').toLowerCase();
};

/**
 * Returns the normalized words of the given text.
 */
Omnibox.getWords = function(text)
{
	var words = Omnibox.normalize(text).split(Omnibox.separators);
	var result = [];

	for (var i = 0; i < words.length; i++)
	{
		if (words[i].length > 0)
		{
			result.push(words[i]);
		}
	}

	return result;
};

/**
 * Returns the words of the given name of a style key, eg. flow animation type
 * for flowAnimationType.
 */
Omnibox.splitName = function(name)
{
	return (name != null) ? String(name).replace(/([a-z0-9])([A-Z])/g, '$1 $2') : '';
};

/**
 * Removes the shortcut from the given tooltip, eg. Bold (Ctrl+B).
 */
Omnibox.removeShortcut = function(text)
{
	return mxUtils.trim(String(text).replace(/\s*\(([^()]*[+\/][^()]*|F\d+|Enter|Esc|Del|Delete|Home|End)\)\s*$/, ''));
};

/**
 * Adds a function that adds entries to the given array. The function is
 * called with the omnibox and the array each time the omnibox is shown.
 */
Omnibox.prototype.addProvider = function(funct)
{
	this.providers.push(funct);
};

/**
 * Returns true if the omnibox is showing.
 */
Omnibox.prototype.isShowing = function()
{
	return this.container != null;
};

/**
 * Returns the element under which the omnibox is shown, eg. the search field
 * of a toolbar, or null for the center of the window (see
 * EditorUi.getOmniboxAnchor).
 */
Omnibox.prototype.getAnchor = function()
{
	var ui = this.editorUi;

	return (typeof ui.getOmniboxAnchor === 'function') ? ui.getOmniboxAnchor() : null;
};

/**
 * Shows the omnibox with the given scope (a group of scopeGroups or null for
 * all entries) and text. If select is true, the text is selected, so typing
 * replaces it.
 */
Omnibox.prototype.show = function(scope, text, select)
{
	var ui = this.editorUi;
	ui.hideCurrentMenu();

	// Lets the user interface adapt the omnibox (anchor, limits, chips)
	if (typeof ui.configureOmnibox === 'function')
	{
		ui.configureOmnibox(this);
	}

	if (this.container == null)
	{
		this.previousFocus = document.activeElement;
		this.anchor = this.getAnchor();
		this.createUi();
	}

	this.entries = this.createEntries();
	this.context = this.getSelectionContext();
	this.selectionActions = undefined;
	this.lastAnnounced = null;
	this.setScope(scope);
	this.input.value = (text != null) ? text : '';
	this.update();
	this.updatePosition();
	this.input.focus();

	if (select)
	{
		this.input.select();
	}
};

/**
 * Returns the text that names the selection in the header of the format
 * group: the kind of a selected cell, the numbers of selected shapes and
 * connectors, or Diagram.
 */
Omnibox.prototype.getSelectionContext = function()
{
	var graph = this.editorUi.editor.graph;
	var cells = graph.getSelectionCells();

	return (cells.length == 0) ? mxResources.get('diagram') : ((cells.length == 1) ?
		graph.getCellTypeName(cells[0]) : graph.getSelectionDescription());
};

/**
 * Hides the omnibox and moves the focus back to where it was unless keepFocus
 * is true. The text is kept for the next time (see show).
 */
Omnibox.prototype.hide = function(keepFocus)
{
	if (this.container != null)
	{
		var focused = mxUtils.isAncestorNode(this.container, document.activeElement);
		this.lastText = this.input.value;
		this.container.parentNode.removeChild(this.container);
		this.backdrop.parentNode.removeChild(this.backdrop);

		if (this.resizeListener != null)
		{
			mxEvent.removeListener(window, 'resize', this.resizeListener);
			this.resizeListener = null;
		}

		this.container = null;
		this.backdrop = null;
		this.entries = null;
		this.items = null;

		if (!keepFocus && focused)
		{
			this.restoreFocus();
		}
	}
};

/**
 * Moves the focus to where it was when the omnibox was shown, or to the
 * diagram.
 */
Omnibox.prototype.restoreFocus = function()
{
	var elt = this.previousFocus;
	this.previousFocus = null;

	if (elt != null && elt != document.body && elt.focus != null &&
		document.body.contains(elt))
	{
		elt.focus();
	}
	else
	{
		this.editorUi.editor.graph.container.focus();
	}
};

/**
 * Creates the elements of the omnibox. The input is a combobox that controls
 * a listbox of options in groups.
 */
Omnibox.prototype.createUi = function()
{
	var ui = this.editorUi;
	var graph = ui.editor.graph;
	var id = 'geOmnibox' + (Omnibox.counter++);
	this.id = id;

	this.backdrop = document.createElement('div');
	this.backdrop.className = 'geOmniboxBackdrop';

	mxEvent.addGestureListeners(this.backdrop, mxUtils.bind(this, function(evt)
	{
		this.hide();
		mxEvent.consume(evt);
	}));

	this.container = document.createElement('div');
	this.container.className = 'geOmnibox';
	this.container.setAttribute('role', 'dialog');
	this.container.setAttribute('aria-modal', 'true');
	this.container.setAttribute('aria-label', mxResources.get('searchActions'));

	// Under the search field of a toolbar, with a clear backdrop, or the
	// whole window on phones
	if (this.fullScreen)
	{
		this.container.classList.add('geOmniboxFull');
		this.backdrop.classList.add('geOmniboxBackdropClear');
	}
	else if (this.anchor != null)
	{
		this.container.classList.add('geOmniboxAnchored');
		this.backdrop.classList.add('geOmniboxBackdropClear');
	}

	var bar = document.createElement('div');
	bar.className = 'geOmniboxBar';

	var icon = document.createElement('img');
	icon.className = 'geOmniboxSearchIcon geAdaptiveAsset';
	icon.setAttribute('src', Omnibox.searchImage);
	icon.setAttribute('alt', '');
	bar.appendChild(icon);

	// Scope of the search: a menu of the scopes (Alt+Down)
	this.scopeElt = document.createElement('button');
	this.scopeElt.className = 'geOmniboxScope';
	this.scopeElt.setAttribute('type', 'button');
	this.scopeElt.setAttribute('tabindex', '-1');
	bar.appendChild(this.scopeElt);

	mxEvent.addListener(this.scopeElt, 'mousedown', function(evt)
	{
		// Keeps the focus in the input
		evt.preventDefault();
	});

	// The chip of the scope removes it
	mxEvent.addListener(this.scopeElt, 'click', mxUtils.bind(this, function(evt)
	{
		this.setScope(null);
		this.update();
		this.input.focus();
		mxEvent.consume(evt);
	}));

	this.input = document.createElement('input');
	this.input.setAttribute('type', 'text');
	this.input.setAttribute('role', 'combobox');
	this.input.setAttribute('aria-autocomplete', 'list');
	this.input.setAttribute('aria-expanded', 'true');
	this.input.setAttribute('aria-controls', id + '-list');
	this.input.setAttribute('autocomplete', 'off');
	this.input.setAttribute('spellcheck', 'false');

	if (this.placeholder != null)
	{
		this.input.setAttribute('placeholder', mxResources.get(this.placeholder));
	}

	this.input.setAttribute('aria-label', mxResources.get('searchActions'));
	bar.appendChild(this.input);

	// Key that opens or closes the omnibox, also closes it with the mouse,
	// or a close button if it fills the window (phones)
	var key = document.createElement((this.fullScreen) ? 'button' : 'span');

	if (this.fullScreen)
	{
		key.className = 'geOmniboxClose';
		key.setAttribute('type', 'button');
		key.setAttribute('title', mxResources.get('close'));
		key.setAttribute('aria-label', mxResources.get('close'));
		mxUtils.write(key, '\u00d7');
	}
	else
	{
		key.className = 'geOmniboxKey';
		key.setAttribute('aria-hidden', 'true');
		mxUtils.write(key, this.keyHint);
	}

	bar.appendChild(key);

	mxEvent.addListener(key, 'click', mxUtils.bind(this, function(evt)
	{
		this.hide();
		mxEvent.consume(evt);
	}));

	this.container.appendChild(bar);

	this.list = document.createElement('div');
	this.list.className = 'geOmniboxList';
	this.list.setAttribute('id', id + '-list');
	this.list.setAttribute('role', 'listbox');
	this.list.setAttribute('aria-label', mxResources.get('searchActions'));
	this.container.appendChild(this.list);

	// Keys of the list, which screen readers get from the roles
	var footer = document.createElement('div');
	footer.className = 'geOmniboxFooter';
	footer.setAttribute('aria-hidden', 'true');

	var addHint = function(key, text)
	{
		var hint = document.createElement('span');
		var kbd = document.createElement('span');
		kbd.className = 'geOmniboxHintKey';
		mxUtils.write(kbd, key);
		hint.appendChild(kbd);
		mxUtils.write(hint, text);
		footer.appendChild(hint);
	};

	addHint('↑↓', mxResources.get('choose'));
	addHint('↵', mxResources.get('run'));
	this.container.appendChild(footer);

	mxEvent.addListener(this.input, 'input', mxUtils.bind(this, function()
	{
		this.update();
	}));

	mxEvent.addListener(this.input, 'keydown', mxUtils.bind(this, function(evt)
	{
		this.keyDown(evt);
	}));

	// Keeps the focus in the input
	mxEvent.addListener(this.list, 'mousedown', mxUtils.bind(this, function(evt)
	{
		if (!this.isControlEvent(evt))
		{
			evt.preventDefault();
		}
	}));

	mxEvent.addListener(this.list, 'mousemove', mxUtils.bind(this, function(evt)
	{
		var index = this.getItemIndex(mxEvent.getSource(evt));

		if (index >= 0 && index != this.activeIndex)
		{
			this.setActive(index, true);
		}
	}));

	mxEvent.addListener(this.list, 'click', mxUtils.bind(this, function(evt)
	{
		// Controls in a row (data-omnibox-control) handle their clicks
		if (!this.isControlEvent(evt))
		{
			var index = this.getItemIndex(mxEvent.getSource(evt));

			if (index >= 0)
			{
				this.run(this.items[index].entry);
			}

			mxEvent.consume(evt);
		}
	}));

	// Keystrokes do not reach the diagram or the menus
	mxEvent.addListener(this.container, 'keydown', function(evt)
	{
		evt.stopPropagation();
	});

	this.resizeListener = mxUtils.bind(this, function()
	{
		this.updatePosition();
	});

	mxEvent.addListener(window, 'resize', this.resizeListener);

	document.body.appendChild(this.backdrop);
	document.body.appendChild(this.container);
};

/**
 * Places the omnibox under its anchor: the input lies over the anchor, the
 * list below it, and it ends with the right side of the anchor if there is
 * room, else it starts with its left side.
 */
Omnibox.prototype.updatePosition = function()
{
	if (this.container != null && this.anchor != null && !this.fullScreen)
	{
		var r = this.anchor.getBoundingClientRect();
		var vw = window.innerWidth;
		var w = Math.min(this.anchoredWidth, vw - 16);
		var cs = window.getComputedStyle(this.container);

		// The bar of the input lies over the anchor: the padding and the border
		// of the omnibox are outside of it
		var dx = parseFloat(cs.paddingRight) + parseFloat(cs.borderRightWidth);
		var dy = parseFloat(cs.paddingTop) + parseFloat(cs.borderTopWidth);
		var left = r.right + dx - w;

		if (left < 8)
		{
			left = r.left - dx;
		}

		left = Math.max(8, Math.min(left, vw - 8 - w));
		var top = Math.max(0, r.top - dy);
		this.container.style.left = Math.round(left) + 'px';
		this.container.style.top = Math.round(top) + 'px';
		this.container.style.width = Math.round(w) + 'px';
		this.container.style.maxHeight = Math.round(Math.max(200,
			Math.min(window.innerHeight * 0.7, window.innerHeight - top - 8))) + 'px';
	}
};

/**
 * Returns the title of the given scope.
 */
Omnibox.prototype.getScopeTitle = function(scope)
{
	return (scope == null) ? mxResources.get('all') :
		mxResources.get(this.groupTitles[scope], null, scope);
};

/**
 * Sets the scope of the search (a group of scopeGroups or null).
 */
Omnibox.prototype.setScope = function(scope)
{
	this.scope = (scope != null) ? scope : null;
	this.scopeElt.textContent = '';
	this.container.classList.toggle('geOmniboxScoped', this.scope != null);
	this.container.classList.toggle('geOmniboxScopeFormat', this.scope == 'format');
	var title = this.getScopeTitle(this.scope);
	mxUtils.write(this.scopeElt, title);
	this.scopeElt.setAttribute('title', mxResources.get('reset') + ' (' + title + ')');
	this.scopeElt.setAttribute('aria-label', mxResources.get('search') + ': ' + title);
	this.scopeElt.classList.toggle('geOmniboxOn', this.scope != null);
	this.scopeElt.style.display = (this.scope != null) ? '' : 'none';
};

/**
 * Returns true if the given event is in a control of a row, eg. a switch
 * that changes a setting in the row (an element with data-omnibox-control):
 * it keeps its focus and clicks.
 */
Omnibox.prototype.isControlEvent = function(evt)
{
	var source = mxEvent.getSource(evt);

	return source != null && source.closest != null &&
		source.closest('[data-omnibox-control]') != null;
};

/**
 * Returns the index of the item that contains the given element or -1.
 */
Omnibox.prototype.getItemIndex = function(elt)
{
	while (elt != null && elt != this.list)
	{
		if (elt.omniboxIndex != null)
		{
			return elt.omniboxIndex;
		}

		elt = elt.parentNode;
	}

	return -1;
};

/**
 * Handles the keys of the input.
 */
Omnibox.prototype.keyDown = function(evt)
{
	// Keys that confirm the composition of an input method
	if (EditorUi.isComposingKeyEvent(evt))
	{
		return;
	}

	var count = (this.items != null) ? this.items.length : 0;
	var active = (this.activeIndex != null && this.items[this.activeIndex] != null) ?
		this.items[this.activeIndex] : null;

	if (evt.keyCode == 40 /* Down */ || evt.keyCode == 38 /* Up */)
	{
		if (count > 0)
		{
			var delta = (evt.keyCode == 40) ? 1 : -1;
			this.setActive(mxUtils.mod(((this.activeIndex != null) ?
				this.activeIndex : -delta) + delta, count));
		}

		mxEvent.consume(evt);
	}
	else if (evt.keyCode == 36 /* Home */ || evt.keyCode == 35 /* End */)
	{
		// Home and End move in the list while it has an active item, else
		// in the text of the input
		if (count > 0 && this.input.value.length == 0)
		{
			this.setActive((evt.keyCode == 36) ? 0 : count - 1);
			mxEvent.consume(evt);
		}
	}
	else if (evt.keyCode == 34 /* Page Down */ || evt.keyCode == 33 /* Page Up */)
	{
		if (count > 0)
		{
			var step = Math.max(1, Math.floor(this.list.clientHeight / 44));
			var index = ((this.activeIndex != null) ? this.activeIndex : 0) +
				((evt.keyCode == 34) ? step : -step);
			this.setActive(Math.max(0, Math.min(count - 1, index)));
		}

		mxEvent.consume(evt);
	}
	else if (evt.keyCode == 13 /* Enter */)
	{
		if (active != null)
		{
			if (mxEvent.isShiftDown(evt) && active.entry.runShift != null)
			{
				this.addRecent(active.entry);
				this.hide(true);
				active.entry.runShift();
			}
			else
			{
				this.run(active.entry);
			}
		}

		mxEvent.consume(evt);
	}
	else if (evt.keyCode == 27 /* Escape */)
	{
		this.hide();
		mxEvent.consume(evt);
	}
	else if (evt.keyCode == 9 /* Tab */)
	{
		// The input is the only control of the dialog
		mxEvent.consume(evt);
	}
	else if (evt.keyCode == 8 /* Backspace */ && this.scope != null &&
		this.input.value.length == 0)
	{
		this.setScope(null);
		this.update();
		mxEvent.consume(evt);
	}
};

/**
 * Makes the item with the given index the active item.
 */
Omnibox.prototype.setActive = function(index, noScroll)
{
	if (this.items == null)
	{
		return;
	}

	if (this.activeIndex != null && this.items[this.activeIndex] != null)
	{
		var prev = this.items[this.activeIndex].elt;
		prev.classList.remove('geOmniboxActive');
		prev.setAttribute('aria-selected', 'false');
	}

	this.activeIndex = index;
	var item = (index != null) ? this.items[index] : null;

	if (item != null)
	{
		item.elt.classList.add('geOmniboxActive');
		item.elt.setAttribute('aria-selected', 'true');
		this.input.setAttribute('aria-activedescendant', item.elt.getAttribute('id'));

		if (!noScroll)
		{
			item.elt.scrollIntoView({block: 'nearest'});
		}
	}
	else
	{
		this.input.removeAttribute('aria-activedescendant');
	}
};

/**
 * Runs the given entry and hides the omnibox. A disabled entry announces
 * the reason instead.
 */
Omnibox.prototype.run = function(entry)
{
	var ui = this.editorUi;

	if (!entry.enabled)
	{
		ui.announce(this.getReason(entry), true);
	}
	else
	{
		var windows = ui.getVisibleWindows();
		var dialog = ui.dialog;
		this.addRecent(entry);
		this.hide(true);

		try
		{
			entry.run();
		}
		catch (e)
		{
			ui.handleError(e);
		}

		// Moves the focus into a window or dialog that the entry opened,
		// else it stays where the entry moved it, eg. in the format panel
		if (!ui.focusOpenedWindow(windows) && !ui.focusOpenedDialog(dialog))
		{
			var ae = document.activeElement;

			if (ae == null || ae == document.body)
			{
				this.restoreFocus();
			}
		}
	}
};

/**
 * Adds the given entry to the recently used entries.
 */
Omnibox.prototype.addRecent = function(entry)
{
	if (entry.id != null)
	{
		mxUtils.remove(entry.id, this.recent);
		this.recent.unshift(entry.id);

		if (this.recent.length > this.maxRecent)
		{
			this.recent.pop();
		}
	}
};

/**
 * Returns the reason why the given entry is disabled.
 */
Omnibox.prototype.getReason = function(entry)
{
	return (entry.reason != null) ? entry.reason : mxResources.get('notAvailable');
};

/**
 * Returns the entries of the omnibox. Entries have an id, a group, a label,
 * a detail (eg. the path in the menus), a shortcut or value, checked and
 * enabled flags, the resource keys of the label and the path for English
 * text and keywords and a run function.
 */
Omnibox.prototype.createEntries = function()
{
	var entries = [];
	var menus = this.recordMenus();
	var hidden = null;

	// Actions that are only in submenus hidden with hideMenuItems are hidden
	// like in the menus (see isHiddenMenuItem)
	if (this.editorUi.menus.hiddenMenuItems != null)
	{
		var names = this.getHiddenItemsMenuNames();
		var shown = (names != null) ? this.recordMenus(false, names).paths : menus.paths;
		var paths = this.recordMenus(true, names).paths;
		hidden = Object.create(null);

		for (var key in paths)
		{
			if (shown[key] == null)
			{
				hidden[key] = true;
			}
		}
	}

	// The reasons of greyed-out items for their actions (see createActionEntry)
	this.menuReasons = menus.reasons;
	this.addActionEntries(entries, menus.paths, hidden, menus.enabled);
	this.addMenuEntries(entries, menus.items);
	this.addFormatEntries(entries);

	for (var i = 0; i < this.providers.length; i++)
	{
		try
		{
			this.providers[i](this, entries);
		}
		catch (e)
		{
			// ignores providers with errors
		}
	}

	return entries;
};

/**
 * Returns the names of the menus whose items are entries. This
 * implementation returns the menus of the menubar.
 */
Omnibox.prototype.getMenuNames = function()
{
	return this.editorUi.menus.defaultMenuItems;
};

/**
 * Returns the title of the menu with the given name, the first part of the
 * paths of its items. This implementation returns the resource of the name.
 */
Omnibox.prototype.getMenuTitle = function(name)
{
	return mxResources.get(name, null, name);
};

/**
 * Returns the names of the menus whose items and submenus hidden with
 * hideMenuItems hide their actions, or null for the menus of the entries
 * (getMenuNames). This implementation returns null.
 */
Omnibox.prototype.getHiddenItemsMenuNames = function()
{
	return null;
};

/**
 * Returns true if the menu item or submenu with the given name is hidden with
 * the hideMenuItems configuration, the check of Menus.addMenuItem and
 * Menus.addSubmenu.
 */
Omnibox.prototype.isHiddenMenuItem = function(name)
{
	var hidden = this.editorUi.menus.hiddenMenuItems;

	return hidden != null && Object.prototype.hasOwnProperty.call(hidden, name) &&
		hidden[name] == true;
};

/**
 * Builds the menus into a popup menu that is never shown and returns the
 * paths of the actions and the other items with their functions and paths.
 * The idPath of an item names its submenus by their resources (or names), not
 * by labels that change with the state, such as the zoom of Zoom (100%). If
 * ignoreHidden is true, the items hidden with hideMenuItems are recorded
 * too. menuNames are the menus to build (default getMenuNames). enabled has
 * true for the actions with at least one item that the menus do not grey out
 * (items of greyed-out menus and submenus are off). reasons has the reason of
 * the first greyed-out item of each action, which items have too (the
 * description of the item or of its submenu, see
 * EditorUi.updateDisabledReason; only where the helper disabledReasons is
 * on).
 */
Omnibox.prototype.recordMenus = function(ignoreHidden, menuNames)
{
	var ui = this.editorUi;
	var menus = ui.menus;
	var names = (menuNames != null) ? menuNames : this.getMenuNames();
	var paths = Object.create(null);
	var actionEnabled = Object.create(null);
	var actionReasons = Object.create(null);
	var reasons = ui.isHelperEnabled('disabledReasons');
	var items = [];
	var ownHidden = Object.prototype.hasOwnProperty.call(menus, 'hiddenMenuItems');
	var hiddenMenuItems = menus.hiddenMenuItems;

	if (ignoreHidden)
	{
		menus.hiddenMenuItems = null;
	}

	// Records the action of the next item
	var addMenuItem = menus.addMenuItem;
	var actionKey = null;

	menus.addMenuItem = function(menu, key)
	{
		actionKey = key;

		try
		{
			return addMenuItem.apply(this, arguments);
		}
		finally
		{
			actionKey = null;
		}
	};

	// Records the name of the next submenu
	var addSubmenu = menus.addSubmenu;
	var submenuName = null;

	menus.addSubmenu = function(name)
	{
		submenuName = name;

		try
		{
			return addSubmenu.apply(this, arguments);
		}
		finally
		{
			submenuName = null;
		}
	};

	try
	{
		for (var i = 0; i < names.length; i++)
		{
			var root = menus.get(names[i]);

			if (root != null)
			{
				var menu = new mxPopupMenu(function() {});
				menu.showDisabled = true;

				// Items of a root menu that is greyed out are disabled too
				var rootEnabled = typeof root.isEnabled !== 'function' || root.isEnabled();
				menu.smartSeparators = true;
				var recorded = [];
				var addItem = menu.addItem;

				menu.addItem = function(title, image, funct, parent, iconCls, enabled)
				{
					var tr = addItem.apply(this, arguments);

					// An item of a submenu that the menu greys out is disabled too
					// (showDisabled builds the items of disabled submenus)
					var on = enabled != false && ((parent == null) ? rootEnabled : parent.omniboxEnabled !== false);

					if (tr != null)
					{
						tr.omniboxEnabled = on;
					}

					recorded.push({title: title, funct: funct, parent: parent, tr: tr,
						enabled: on, action: actionKey, submenu: (funct == null) ? submenuName : null});
					submenuName = null;

					return tr;
				};

				var addCheckmark = menu.addCheckmark;

				menu.addCheckmark = function(item)
				{
					item.omniboxChecked = true;

					return addCheckmark.apply(this, arguments);
				};

				try
				{
					menus.addMenu(names[i], menu);
				}
				catch (e)
				{
					// ignores menus that need a trigger
				}

				// Path of each item from its parents
				var title = this.getMenuTitle(names[i]);

				// Items of long submenus are lists (languages, units)
				var sizes = new Map();

				for (var j = 0; j < recorded.length; j++)
				{
					sizes.set(recorded[j].parent, (sizes.get(recorded[j].parent) || 0) + 1);
				}

				for (var j = 0; j < recorded.length; j++)
				{
					var item = recorded[j];
					var path = (item.parent != null && item.parent.omniboxPath != null) ?
						item.parent.omniboxPath : [title];
					var idPath = (item.parent != null && item.parent.omniboxIdPath != null) ?
						item.parent.omniboxIdPath : [title];
					item.tr.omniboxPath = path.concat([item.title]);
					item.tr.omniboxIdPath = idPath.concat([(item.submenu != null) ?
						(mxResources.get(item.submenu) || item.submenu) : item.title]);
					var reason = null;

					// The reason of the item or of the submenu that greys it out
					if (reasons && !item.enabled)
					{
						reason = (item.tr.getAttribute('aria-disabled') == 'true') ?
							item.tr.getAttribute('aria-description') : null;

						if (reason == null && item.parent != null)
						{
							reason = item.parent.omniboxReason;
						}

						item.tr.omniboxReason = reason;
					}

					if (item.funct != null && item.title != null && item.title.length > 0)
					{
						if (item.action != null)
						{
							if (paths[item.action] == null)
							{
								paths[item.action] = path;
							}

							// An action is enabled if one of its items is
							actionEnabled[item.action] = actionEnabled[item.action] === true || item.enabled;

							if (reason != null && actionReasons[item.action] == null)
							{
								actionReasons[item.action] = reason;
							}
						}
						else
						{
							items.push({title: item.title, funct: item.funct, path: path, idPath: idPath,
								enabled: item.enabled, reason: reason, checked: item.tr.omniboxChecked == true,
								list: item.parent != null && sizes.get(item.parent) > this.maxMenuItems});
						}
					}
				}

				menu.destroy();
			}
		}
	}
	finally
	{
		menus.addMenuItem = addMenuItem;
		menus.addSubmenu = addSubmenu;

		// Removes the instance properties if they were the prototype functions
		if (menus.addMenuItem == Menus.prototype.addMenuItem)
		{
			delete menus.addMenuItem;
		}

		if (menus.addSubmenu == Menus.prototype.addSubmenu)
		{
			delete menus.addSubmenu;
		}

		if (ownHidden)
		{
			menus.hiddenMenuItems = hiddenMenuItems;
		}
		else
		{
			delete menus.hiddenMenuItems;
		}
	}

	return {paths: paths, items: items, enabled: actionEnabled, reasons: actionReasons};
};

/**
 * Adds the visible actions with a label as entries, except the ones hidden
 * with hideMenuItems and the given hidden actions. An action whose items in
 * the menus are all greyed out (enabled, see recordMenus) is disabled.
 */
Omnibox.prototype.addActionEntries = function(entries, paths, hidden, enabled)
{
	var ui = this.editorUi;

	for (var key in ui.actions.actions)
	{
		var action = ui.actions.actions[key];

		if (action != null && action.visible && mxUtils.indexOf(this.hiddenActions, key) < 0 &&
			key.substring(0, 4) != 'test' && Object.prototype.hasOwnProperty.call(ui.actions.actions, key) &&
			!this.isHiddenMenuItem(key) && (hidden == null || hidden[key] != true))
		{
			var title = action.getTitle();
			var labelKey = (action.label != null) ? String(action.label).replace(/\.\.\.$/, '') : key;

			// Missing resources return the key, which is an internal name,
			// while some actions have a translated label instead of a key
			if (title != null && title.length > 0 && (title != labelKey ||
				!/^[a-z][A-Za-z0-9]*$/.test(labelKey)))
			{
				entries.push(this.createActionEntry(key, action, title,
					(mxResources.resources[labelKey] != null) ? labelKey : null, paths[key],
					(enabled != null) ? enabled[key] : null));
			}
		}
	}
};

/**
 * Creates the entry for the given action.
 */
Omnibox.prototype.createActionEntry = function(key, action, title, labelKey, path, menuEnabled)
{
	var checked = null;

	if (action.toggleAction)
	{
		try
		{
			checked = action.isSelected() == true;
		}
		catch (e)
		{
			// ignores the state
		}
	}

	var reason = null;
	var ui = this.editorUi;

	if (!action.isEnabled() && typeof action.getDisabledReason === 'function')
	{
		reason = action.getDisabledReason();
	}

	// The reason of the menus in Classic and Simple (see
	// EditorUi.getDisabledReason) or of the item that greys it out
	if (reason == null && (!action.isEnabled() || menuEnabled === false) &&
		ui.isHelperEnabled('disabledReasons'))
	{
		var result = (!action.isEnabled()) ? ui.getDisabledReason(key) : null;
		reason = (result != null) ? result.text : ((this.menuReasons != null &&
			this.menuReasons[key] != null) ? this.menuReasons[key] : null);
	}

	return {id: 'action:' + key, action: key, group: 'actions', label: title, path: path,
		shortcut: action.shortcut, checked: checked, enabled: action.isEnabled() && menuEnabled !== false,
		reason: reason, keys: (labelKey != null) ? [labelKey] : null, run: function()
		{
			action.funct();
		}};
};

/**
 * Adds the items of the menus without an action as entries, with ids from
 * their idPath (see recordMenus).
 */
Omnibox.prototype.addMenuEntries = function(entries, items)
{
	var seen = Object.create(null);

	for (var i = 0; i < items.length; i++)
	{
		(function(item)
		{
			var id = 'menu:' + ((item.idPath != null) ? item.idPath : item.path).join('\n') + '\n' + item.title;

			if (!seen[id])
			{
				seen[id] = true;
				entries.push({id: id, group: 'actions', label: item.title, path: item.path,
					checked: (item.checked) ? true : null, enabled: item.enabled, reason: item.reason,
					rank: (item.list) ? 0.5 : null, run: function()
					{
						item.funct();
					}});
			}
		})(items[i]);
	}
};

/**
 * Returns the container of the format panel for the selection and a function
 * to destroy it. If the format panel is not showing, the panels are created
 * in a hidden container.
 */
Omnibox.prototype.createFormatPanels = function()
{
	var ui = this.editorUi;
	var format = ui.format;

	if (this.isFormatPanelShowing())
	{
		format.flushRefresh();

		return {container: format.container, destroy: null};
	}
	else if (ui.formatEnabled != false)
	{
		// The panels are in a wrapper, so the rules of the themes for the
		// format panel of the editor do not apply (eg. hidden while closed)
		var wrapper = document.createElement('div');
		wrapper.style.cssText = 'position:absolute;left:-10000px;top:0px;width:240px;' +
			'height:600px;visibility:hidden;overflow:hidden;';
		var div = document.createElement('div');
		div.className = 'geFormatContainer';
		div.style.cssText = 'position:relative;display:block;width:240px;height:600px;overflow:hidden;';
		wrapper.appendChild(div);
		document.body.appendChild(wrapper);
		var tmp = new Format(ui, div);

		try
		{
			tmp.immediateRefresh();
		}
		catch (e)
		{
			// ignores the panels
		}

		return {container: div, destroy: function()
		{
			tmp.clear();
			wrapper.parentNode.removeChild(wrapper);
		}};
	}

	return null;
};

/**
 * Returns true if the format panel of the editor shows its tabs.
 */
Omnibox.prototype.isFormatPanelShowing = function()
{
	var format = this.editorUi.format;

	return format != null && format.container != null && format.container.offsetWidth > 0;
};

/**
 * Shows the format panel of the editor.
 */
Omnibox.prototype.showFormatPanel = function()
{
	this.editorUi.toggleFormatPanel(true);
};

/**
 * Returns the tabs of the format panel in the given container as objects with
 * the title, the panel and the name of each tab.
 */
Omnibox.prototype.getFormatTabs = function(container)
{
	var tabs = [];
	var titles = container.firstChild;

	// The titles may follow a header (eg. Simple Modern)
	while (titles != null && (titles.classList == null ||
		!titles.classList.contains('geFormatTitleContainer')))
	{
		titles = titles.nextSibling;
	}

	var panel = (titles != null) ? titles.nextSibling : null;

	if (titles != null && titles.classList.contains('geFormatTitleContainer'))
	{
		for (var title = titles.firstChild; title != null && panel != null;
			title = title.nextSibling)
		{
			if (title.classList.contains('geFormatTitle'))
			{
				tabs.push({title: title, panel: panel, name: mxUtils.trim(title.textContent),
					visible: title.style.display != 'none'});
				panel = panel.nextSibling;
			}
		}
	}

	return tabs;
};

/**
 * Adds the controls of the format panel for the selection as entries.
 */
Omnibox.prototype.addFormatEntries = function(entries)
{
	var panels = this.createFormatPanels();

	if (panels != null)
	{
		try
		{
			var tabs = this.getFormatTabs(panels.container);

			for (var i = 0; i < tabs.length; i++)
			{
				if (tabs[i].visible)
				{
					var controls = this.getFormatControls(tabs[i].panel);

					for (var j = 0; j < controls.length; j++)
					{
						entries.push(this.createFormatEntry(tabs[i].name, i, j, controls[j]));
					}
				}
			}
		}
		finally
		{
			if (panels.destroy != null)
			{
				panels.destroy();
			}
		}
	}
};

/**
 * Creates the entry for the given control of the format panel.
 */
Omnibox.prototype.createFormatEntry = function(tabName, tab, index, control)
{
	var path = [tabName].concat(control.path);
	var locator = {tab: tab, index: index, label: control.label, path: control.path.join('\n')};

	return {id: 'format:' + path.join('\n') + '\n' + control.label, group: 'format',
		label: control.label, path: path, shortcut: control.value, checked: control.checked,
		enabled: control.enabled, names: control.names, locator: locator, run: mxUtils.bind(this, function()
		{
			this.revealFormatControl(locator);
		})};
};

/**
 * Returns the controls of the given panel of the format panel in the order
 * of the panel. Controls with the same label in the same section are only
 * returned once.
 */
Omnibox.prototype.getFormatControls = function(panel)
{
	var elts = panel.querySelectorAll(this.formatControlSelector);
	var result = [];
	var seen = Object.create(null);

	for (var i = 0; i < elts.length; i++)
	{
		if (elts[i].classList.contains('geFormatSearchButton') ||
			elts[i].classList.contains('geStyleButton') ||
			this.isFormatControlHidden(elts[i], panel))
		{
			continue;
		}

		var control = this.getFormatControl(elts[i], panel);

		if (control != null && control.label != null &&
			/[^\s\d.,:;%()+\-]/.test(control.label))
		{
			control.label = control.label.replace(/\s*[:\uff1a]\s*$/, '');
			control.elt = elts[i];
			control.path = this.getFormatSections(elts[i], panel);

			if (control.enabled == null)
			{
				control.enabled = !elts[i].disabled &&
					!elts[i].classList.contains('mxDisabled') &&
					elts[i].getAttribute('disabled') == null;
			}

			// A control with the label of its section replaces the section,
			// eg. the Line checkbox in the Line section
			var path = control.path;

			if (path.length > 0 && path[path.length - 1] == control.label)
			{
				path = path.slice(0, path.length - 1);
			}

			var key = Omnibox.normalize(control.label) + '\n' + path.join('\n');

			if (seen[key] == null)
			{
				seen[key] = result.length;
				result.push(control);
			}
			else if (result[seen[key]].section && !control.section)
			{
				result[seen[key]] = control;
			}
		}
	}

	return result;
};

/**
 * Returns true if the given element of the format panel is hidden, other
 * than in a collapsed section.
 */
Omnibox.prototype.isFormatControlHidden = function(elt, panel)
{
	while (elt != null && elt != panel)
	{
		if (elt.style != null && elt.style.display == 'none')
		{
			return true;
		}

		elt = elt.parentNode;
	}

	return false;
};

/**
 * Returns the label, value and state of the given element of the format
 * panel or null if it is not a control with a label.
 */
Omnibox.prototype.getFormatControl = function(elt, panel)
{
	var name = elt.nodeName;
	var type = (name == 'INPUT') ? String(elt.getAttribute('type')).toLowerCase() : null;
	var section = false;
	var label = null;
	var value = null;
	var checked = null;

	if (elt.classList.contains('geCollapsibleTitle') ||
		elt.classList.contains('geFormatSectionTitle'))
	{
		label = elt.textContent;
		section = true;
	}
	else if (type == 'hidden' || type == 'color' || type == 'file' ||
		(name == 'SELECT' && elt.classList.contains('geFullWidthElement')))
	{
		// Colors are in their row, the options of full width selects
		// are actions
		return null;
	}
	else
	{
		label = Omnibox.getTooltip(elt);

		if (label == null || label.length == 0)
		{
			label = elt.getAttribute('aria-label');
		}

		if ((label == null || label.length == 0) && name == 'BUTTON')
		{
			label = elt.textContent;
		}

		if ((label == null || label.length == 0) && name != 'BUTTON')
		{
			label = this.getFormatRowLabel(elt);
		}

		if (label != null)
		{
			label = Omnibox.removeShortcut(label);
		}

		if (type == 'checkbox' || type == 'radio')
		{
			checked = elt.checked == true;
		}
		else if (name == 'SELECT')
		{
			value = (elt.selectedIndex >= 0 && elt.options[elt.selectedIndex] != null) ?
				elt.options[elt.selectedIndex].textContent : null;
		}
		else if (name == 'INPUT')
		{
			value = elt.value;

			// Titles that show the value, eg. of an ID
			if (label == value)
			{
				return null;
			}
		}
	}

	label = (label != null) ? mxUtils.trim(label) : null;

	return (label != null && label.length > 0) ? {label: label,
		value: (value != null && value.length > 0) ? value : null,
		checked: checked, section: section} : null;
};

/**
 * Returns the tooltip of the given element without the reason of a disabled
 * control (see EditorUi.setDisabledReason).
 */
Omnibox.getTooltip = function(elt)
{
	return (elt.hasAttribute != null && elt.hasAttribute('data-tooltip')) ?
		elt.getAttribute('data-tooltip') : elt.getAttribute('title');
};

/**
 * Returns the label of the row of the given element, eg. Opacity.
 */
Omnibox.prototype.getFormatRowLabel = function(elt)
{
	var row = elt.parentNode;

	if (row != null && row.getAttribute != null)
	{
		var title = Omnibox.getTooltip(row);

		if (title != null && title.length > 0)
		{
			return title;
		}

		for (var child = row.firstChild; child != null && child != elt; child = child.nextSibling)
		{
			if (child.nodeType == mxConstants.NODETYPE_TEXT ||
				child.nodeName == 'SPAN' || child.nodeName == 'LABEL')
			{
				var text = mxUtils.trim(child.textContent);

				if (text.length > 0)
				{
					return text;
				}
			}
		}
	}

	return null;
};

/**
 * Returns the titles of the sections of the given element from the outer to
 * the inner section.
 */
Omnibox.prototype.getFormatSections = function(elt, panel)
{
	var path = [];
	var node = elt.parentNode;

	while (node != null && node != panel)
	{
		for (var child = node.firstChild; child != null; child = child.nextSibling)
		{
			if (child != elt && child.classList != null &&
				(child.classList.contains('geCollapsibleTitle') ||
				child.classList.contains('geFormatSectionTitle')))
			{
				var text = mxUtils.trim(child.textContent);

				if (text.length > 0)
				{
					path.unshift(text);
				}

				break;
			}
		}

		node = node.parentNode;
	}

	return path;
};

/**
 * Shows the format panel with the tab of the given control, expands its
 * sections, scrolls to the control, focuses and highlights it.
 */
Omnibox.prototype.revealFormatControl = function(locator)
{
	var ui = this.editorUi;

	var reveal = mxUtils.bind(this, function()
	{
		var format = ui.format;

		if (format != null && format.container != null)
		{
			format.flushRefresh();
			var tab = this.getFormatTabs(format.container)[locator.tab];

			if (tab != null)
			{
				if (!tab.title.classList.contains('geActiveFormatTitle'))
				{
					tab.title.click();
				}

				var controls = this.getFormatControls(tab.panel);
				var control = controls[locator.index];

				// Finds the control by its label if the panel changed
				if (control == null || control.label != locator.label ||
					control.path.join('\n') != locator.path)
				{
					control = null;

					for (var i = 0; i < controls.length && control == null; i++)
					{
						if (controls[i].label == locator.label)
						{
							control = controls[i];
						}
					}
				}

				if (control != null)
				{
					this.highlightFormatControl(control.elt, format.container);
				}
			}
		}
	});

	if (ui.isFormatPanelVisible() && this.isFormatPanelShowing())
	{
		reveal();
	}
	else
	{
		this.showFormatPanel();

		// Windows show at once, the panel after its transition
		if (ui.isFormatPanelVisible() && this.isFormatPanelShowing())
		{
			reveal();
		}
		else
		{
			var listener = mxUtils.bind(this, function()
			{
				ui.removeListener(listener);
				reveal();
			});

			ui.addListener('formatWidthChanged', listener);
		}
	}
};

/**
 * Expands the sections of the given control of the format panel. Returns
 * true if it is visible.
 */
Omnibox.prototype.expandFormatControl = function(elt, container)
{
	var node = elt.parentNode;

	while (node != null && node != container)
	{
		if (node.classList != null && node.classList.contains('geCollapsibleContent') &&
			node.classList.contains('geCollapsed') && node.previousSibling != null)
		{
			node.previousSibling.click();
		}

		node = node.parentNode;
	}

	return elt.offsetWidth > 0 || elt.offsetHeight > 0;
};

/**
 * Returns the element that is highlighted for the given control.
 */
Omnibox.prototype.getFormatControlRow = function(elt)
{
	var type = (elt.nodeName == 'INPUT') ? String(elt.getAttribute('type')).toLowerCase() : null;

	return (type == 'checkbox' || type == 'radio') ? elt.parentNode : elt;
};

/**
 * Returns the element that gets the focus for the given control or null.
 */
Omnibox.prototype.getFormatControlFocus = function(elt)
{
	return (elt.nodeName == 'INPUT' || elt.nodeName == 'SELECT' || elt.nodeName == 'BUTTON' ||
		elt.getAttribute('tabindex') != null || elt.nodeName == 'A') ? elt : null;
};

/**
 * Scrolls to the given control of the format panel, focuses and highlights
 * it.
 */
Omnibox.prototype.highlightFormatControl = function(elt, container)
{
	this.expandFormatControl(elt, container);
	var row = this.getFormatControlRow(elt);
	row.scrollIntoView({block: 'center', inline: 'nearest'});

	// Restarts the animation in the next frame if the control is still highlighted
	if (row.classList.contains('geOmniboxHighlight'))
	{
		row.classList.remove('geOmniboxHighlight');

		window.requestAnimationFrame(function()
		{
			row.classList.add('geOmniboxHighlight');
		});
	}
	else
	{
		row.classList.add('geOmniboxHighlight');
	}

	if (row.omniboxThread != null)
	{
		window.clearTimeout(row.omniboxThread);
	}

	row.omniboxThread = window.setTimeout(function()
	{
		row.classList.remove('geOmniboxHighlight');
		row.omniboxThread = null;
	}, this.highlightDelay);

	var focus = this.getFormatControlFocus(elt);

	if (focus != null)
	{
		focus.focus({preventScroll: true});
	}
};

/**
 * Returns the entries that search for the given text elsewhere, eg. for
 * shapes in the sidebar.
 */
Omnibox.prototype.getSearchEntries = function(query)
{
	var ui = this.editorUi;
	var result = [];

	if (this.canSearchShapes())
	{
		result.push({group: 'search', icon: Editor.shapesImage, label: mxResources.get('searchShapesFor', [query]),
			enabled: true, run: mxUtils.bind(this, function()
			{
				this.searchShapes(query);
			})});
	}

	return result;
};

/**
 * Returns true if the text can be handed to the search for shapes.
 */
Omnibox.prototype.canSearchShapes = function()
{
	var ui = this.editorUi;

	return ui.sidebar != null && typeof ui.sidebar.searchShapes === 'function';
};

/**
 * Hands the given text to the search for shapes in the sidebar.
 */
Omnibox.prototype.searchShapes = function(query)
{
	var ui = this.editorUi;
	ui.sidebar.searchShapes(query);
	ui.focusOmniSearch();
};

/**
 * Returns the resource keys whose text in the current language is the given
 * text.
 */
Omnibox.prototype.getResourceKeys = function(text)
{
	var lang = mxClient.language;

	if (this.resourceKeys == null || this.resourceKeysLanguage != lang)
	{
		this.resourceKeys = Object.create(null);
		this.resourceKeysLanguage = lang;
		var res = mxResources.resources;

		for (var key in res)
		{
			if (Object.prototype.hasOwnProperty.call(res, key) &&
				typeof res[key] === 'string' && res[key].length < 60)
			{
				var value = Omnibox.normalize(res[key].replace(/(\.\.\.|\u2026)$/, ''));

				if (this.resourceKeys[value] == null)
				{
					this.resourceKeys[value] = [];
				}

				this.resourceKeys[value].push(key);
			}
		}
	}

	var keys = this.resourceKeys[Omnibox.normalize(String(text).
		replace(/(\.\.\.|\u2026)$/, ''))];

	// Labels made of two resources, such as Find/Replace (find and replace),
	// have the keys of their parts, so English words find them in all
	// languages
	if (keys == null && String(text).indexOf('/') > 0)
	{
		var parts = String(text).split('/');
		keys = [];

		for (var i = 0; i < parts.length && keys != null; i++)
		{
			var part = this.resourceKeys[Omnibox.normalize(mxUtils.trim(parts[i]).
				replace(/(\.\.\.|\u2026)$/, ''))];
			keys = (part != null) ? keys.concat(part) : null;
		}
	}

	return (keys != null) ? keys : [];
};

/**
 * Returns the English text of the given resource key or null.
 */
Omnibox.prototype.getEnglish = function(key)
{
	var res = Omnibox.englishResources;

	return (res != null && Object.prototype.hasOwnProperty.call(res, key)) ? res[key] : null;
};

/**
 * Returns the fields of the given entry for matching. Each field has the
 * phrases and the words of a text and a weight.
 */
Omnibox.prototype.getFields = function(entry)
{
	if (entry.fields == null)
	{
		var fields = [];
		// Keyed by user text, so without a prototype (a label "constructor")
		var seen = Object.create(null);

		var add = function(texts, weight, keywords)
		{
			var phrases = [];
			var originals = [];
			var words = [];

			for (var i = 0; i < texts.length; i++)
			{
				if (texts[i] != null)
				{
					var w = Omnibox.getWords(texts[i]);
					var phrase = w.join(' ');

					if (phrase.length > 0 && !seen[phrase])
					{
						seen[phrase] = true;
						phrases.push(phrase);
						originals.push(mxUtils.trim(texts[i]));
						words = words.concat(w);
					}
				}
			}

			if (phrases.length > 0)
			{
				fields.push({phrases: phrases, originals: originals, words: words,
					text: phrases.join(' \n '), weight: weight, keywords: keywords == true});
			}
		};

		var keys = (entry.keys != null) ? entry.keys : this.getResourceKeys(entry.label);
		var english = [];
		var keywords = [];
		var englishKeywords = [];

		var addKeys = mxUtils.bind(this, function(keys, en, kw, enKw)
		{
			for (var i = 0; i < keys.length; i++)
			{
				en.push(this.getEnglish(keys[i]));
				var tmp = mxResources.get(keys[i] + 'Keywords');

				if (tmp != null && tmp != keys[i] + 'Keywords')
				{
					kw.push.apply(kw, tmp.split(';'));
				}

				tmp = this.getEnglish(keys[i] + 'Keywords');

				if (tmp != null)
				{
					enKw.push.apply(enKw, tmp.split(';'));
				}
			}
		});

		addKeys(keys, english, keywords, englishKeywords);
		add([entry.label], 1);
		add(english, 0.9);
		add(keywords, 0.8, true);
		add(englishKeywords, 0.75, true);

		if (entry.names != null)
		{
			var names = [];

			for (var i = 0; i < entry.names.length; i++)
			{
				names.push(Omnibox.splitName(entry.names[i]));
			}

			add(names, 0.6);
		}

		if (entry.path != null)
		{
			var pathEnglish = [];
			var pathKeywords = [];
			var pathEnglishKeywords = [];

			for (var i = 0; i < entry.path.length; i++)
			{
				addKeys(this.getResourceKeys(entry.path[i]), pathEnglish,
					pathKeywords, pathEnglishKeywords);
			}

			add(entry.path, 0.5);
			add(pathEnglish, 0.45);
			add(pathKeywords.concat(pathEnglishKeywords), 0.4);
		}

		entry.fields = fields;
	}

	return entry.fields;
};

/**
 * Returns how well the given term matches the given field: 3 for a word, 2
 * for the start of a word and 1 for a part of a word, which is only matched
 * from 3 characters or in scripts without spaces.
 */
Omnibox.prototype.matchTerm = function(term, field, unspaced)
{
	var result = 0;

	for (var i = 0; i < field.words.length && result < 3; i++)
	{
		var word = field.words[i];

		if (word == term)
		{
			result = 3;
		}
		else if (result < 2 && word.substring(0, term.length) == term)
		{
			result = 2;
		}
	}

	if (result == 0 && (unspaced || term.length >= 3) &&
		field.text.indexOf(term) >= 0)
	{
		result = 1;
	}

	return result;
};

/**
 * Returns the score of the given entry for the given terms or 0 if a term
 * matches no field. Fields that are or start with the whole query score
 * higher.
 */
Omnibox.prototype.getScore = function(entry, terms, phrase, unspaced)
{
	var fields = this.getFields(entry);
	var keyword = null;
	var score = 0;
	entry.keyword = null;

	for (var i = 0; i < terms.length; i++)
	{
		var best = 0;
		var field = null;

		for (var j = 0; j < fields.length; j++)
		{
			var s = this.matchTerm(terms[i], fields[j], unspaced) * fields[j].weight;

			if (s > best)
			{
				best = s;
				field = fields[j];
			}
		}

		if (best == 0)
		{
			return 0;
		}
		else if (field.keywords && keyword == null)
		{
			keyword = this.getMatchingPhrase(field, terms[i]);
		}

		score += best;
	}

	// Shows the keyword that matched, eg. cable tie for Bundle
	entry.keyword = keyword;

	var bonus = 0;

	for (var i = 0; i < fields.length; i++)
	{
		for (var j = 0; j < fields[i].phrases.length; j++)
		{
			var p = fields[i].phrases[j];

			if (p == phrase)
			{
				bonus = Math.max(bonus, 8 * fields[i].weight);
			}
			else if (p.substring(0, phrase.length) == phrase)
			{
				bonus = Math.max(bonus, 4 * fields[i].weight);
			}
		}
	}

	return score + bonus;
};

/**
 * Returns the original text of the first phrase of the given field that
 * contains the given term.
 */
Omnibox.prototype.getMatchingPhrase = function(field, term)
{
	for (var i = 0; i < field.phrases.length; i++)
	{
		if (field.phrases[i].indexOf(term) >= 0)
		{
			return field.originals[i];
		}
	}

	return null;
};

/**
 * Returns the recently used entries that still exist.
 */
Omnibox.prototype.getRecentEntries = function()
{
	var result = [];

	for (var i = 0; i < this.recent.length; i++)
	{
		for (var j = 0; j < this.entries.length; j++)
		{
			if (this.entries[j].id == this.recent[i])
			{
				result.push(this.entries[j]);
				break;
			}
		}
	}

	return result;
};

/**
 * Returns true if the given entry is in the given scope.
 */
Omnibox.prototype.isInScope = function(entry, scope)
{
	scope = (arguments.length > 1) ? scope : this.scope;

	return scope == null || entry.group == scope;
};

/**
 * Returns the scope and the text of the given query: without a scope, a
 * query that starts with > searches the actions and one that starts with #
 * the pages.
 */
Omnibox.prototype.parseQuery = function(query)
{
	var scope = this.scope;

	if (scope == null && query.length > 0)
	{
		var prefix = query.charAt(0);

		if (prefix == '>' || prefix == '#')
		{
			scope = (prefix == '>') ? 'actions' : 'pages';
			query = query.substring(1);
		}
	}

	return {scope: scope, query: query};
};

/**
 * Returns the actions that the context menu offers for the selection, which
 * rank higher (eg. Bundle for two connectors). Returns null without a
 * selection.
 */
Omnibox.prototype.getSelectionActions = function()
{
	var ui = this.editorUi;
	var graph = ui.editor.graph;
	var result = null;

	if (!graph.isSelectionEmpty() && typeof ui.menus.createPopupMenu === 'function')
	{
		var menus = ui.menus;
		var addMenuItem = menus.addMenuItem;
		var menu = new mxPopupMenu(function() {});
		result = Object.create(null);

		var recordMenuAction = menus.recordMenuAction;

		var record = function(key)
		{
			var action = ui.actions.get(key);

			if (action != null && action.isEnabled())
			{
				result[key] = true;
			}
		};

		menus.addMenuItem = function(menu, key)
		{
			record(key);

			return addMenuItem.apply(this, arguments);
		};

		menus.recordMenuAction = function(menu, key)
		{
			record(key);
		};

		try
		{
			menus.createPopupMenu(menu, graph.getSelectionCell(), null);
		}
		catch (e)
		{
			// ignores menus that need an event
		}
		finally
		{
			menus.addMenuItem = addMenuItem;
			menus.recordMenuAction = recordMenuAction;

			if (menus.addMenuItem == Menus.prototype.addMenuItem)
			{
				delete menus.addMenuItem;
			}

			if (menus.recordMenuAction == Menus.prototype.recordMenuAction)
			{
				delete menus.recordMenuAction;
			}

			menu.destroy();
		}
	}

	return result;
};

/**
 * Updates the results for the text in the input.
 */
Omnibox.prototype.update = function()
{
	var results = this.getResults(this.input.value);
	this.lastQuery = results.query;
	this.render(results.groups, results.query, results.totals);
};

/**
 * Returns the results of the entries (createEntries) for the given text with
 * the scope of the omnibox or of the prefix of the text (parseQuery):
 * {groups, totals, query, scope}, the groups by their names with at most the
 * number of results of getGroupLimit.
 */
Omnibox.prototype.getResults = function(text)
{
	var parsed = this.parseQuery(text);
	var query = parsed.query;
	var scope = parsed.scope;
	var terms = Omnibox.getWords(query);
	var phrase = terms.join(' ');
	var unspaced = Omnibox.unspacedScripts.test(phrase);
	var groups = {};
	var totals = {};
	this.effectiveScope = scope;

	if (terms.length == 0)
	{
		for (var i = 0; i < this.entries.length; i++)
		{
			this.entries[i].keyword = null;
		}

		if (scope != null)
		{
			for (var i = 0; i < this.entries.length; i++)
			{
				if (this.isInScope(this.entries[i], scope))
				{
					this.addResult(groups, totals, scope, this.entries[i]);
				}
			}
		}
		else
		{
			var recent = this.getRecentEntries();

			for (var i = 0; i < recent.length; i++)
			{
				this.addResult(groups, totals, 'recent', recent[i]);
			}
		}
	}
	else
	{
		var results = [];

		if (this.selectionActions === undefined)
		{
			this.selectionActions = this.getSelectionActions();
		}

		for (var i = 0; i < this.entries.length; i++)
		{
			var entry = this.entries[i];

			if (this.isInScope(entry, scope))
			{
				var score = this.getScore(entry, terms, phrase, unspaced);

				if (score > 0)
				{
					var recent = mxUtils.indexOf(this.recent, entry.id);
					score = score * ((entry.rank != null) ? entry.rank : 1) + ((recent >= 0) ? 0.5 : 0);

					// Actions that the context menu offers for the selection
					if (entry.action != null && this.selectionActions != null &&
						this.selectionActions[entry.action])
					{
						score += 3;
					}

					results.push({entry: entry, score: score});
				}
			}
		}

		results.sort(function(a, b)
		{
			if (a.score != b.score)
			{
				return b.score - a.score;
			}
			else if (a.entry.enabled != b.entry.enabled)
			{
				return (a.entry.enabled) ? -1 : 1;
			}
			else
			{
				return a.entry.label.length - b.entry.label.length;
			}
		});

		for (var i = 0; i < results.length; i++)
		{
			this.addResult(groups, totals, results[i].entry.group, results[i].entry);
		}

		if (scope == null)
		{
			var search = this.getSearchEntries(mxUtils.trim(query));

			for (var i = 0; i < search.length; i++)
			{
				this.addResult(groups, totals, search[i].group, search[i]);
			}
		}
	}

	return {groups: groups, totals: totals, query: query, scope: scope};
};

/**
 * Returns the number of results of the given group that are shown.
 */
Omnibox.prototype.getGroupLimit = function(group)
{
	return (this.effectiveScope != null) ? this.maxScopeResults : this.maxGroupResults;
};

/**
 * Adds the given entry to the given group of results if the group is not
 * full and counts it.
 */
Omnibox.prototype.addResult = function(groups, totals, group, entry)
{
	if (groups[group] == null)
	{
		groups[group] = [];
		totals[group] = 0;
	}

	totals[group]++;

	if (groups[group].length < this.getGroupLimit(group))
	{
		groups[group].push(entry);
	}
};

/**
 * Returns the names of the given groups of results for the given text in the
 * order they are shown. This implementation returns groups.
 */
Omnibox.prototype.getGroupOrder = function(groups, query)
{
	return this.groups;
};

/**
 * Shows the given groups of results (totals has the number of all results of
 * each group).
 */
Omnibox.prototype.render = function(groups, query, totals)
{
	this.list.textContent = '';
	this.items = [];
	this.activeIndex = null;
	var active = null;
	var order = this.getGroupOrder(groups, query);

	for (var i = 0; i < order.length; i++)
	{
		var name = order[i];
		var entries = groups[name];

		if (entries != null && entries.length > 0)
		{
			var group = document.createElement('div');
			group.className = 'geOmniboxGroup';
			group.setAttribute('role', 'group');
			group.setAttribute('data-group', name);

			var heading = document.createElement('div');
			heading.className = 'geOmniboxHeading';
			heading.setAttribute('id', this.id + '-group-' + i);
			heading.setAttribute('role', 'presentation');
			var title = document.createElement('span');
			title.className = 'geOmniboxHeadingTitle';
			mxUtils.write(title, mxResources.get(this.groupTitles[name], null, name));
			heading.appendChild(title);

			// Names the selection whose format is listed
			if (name == 'format' && this.context != null)
			{
				var context = document.createElement('span');
				context.className = 'geOmniboxHeadingContext';
				mxUtils.write(context, ' · ' + this.context);
				heading.appendChild(context);
			}

			group.setAttribute('aria-labelledby', heading.getAttribute('id'));
			group.appendChild(heading);

			for (var j = 0; j < entries.length; j++)
			{
				var elt = this.createItem(entries[j], this.items.length);
				this.items.push({entry: entries[j], elt: elt});
				group.appendChild(elt);

				if (active == null && entries[j].enabled)
				{
					active = this.items.length - 1;
				}
			}

			this.list.appendChild(group);
		}
	}

	if (this.items.length == 0 && mxUtils.trim(query).length > 0)
	{
		var empty = document.createElement('div');
		empty.className = 'geOmniboxEmpty';
		mxUtils.write(empty, mxResources.get('noResultsFor', [query]));
		this.list.appendChild(empty);
	}

	this.list.style.display = (this.list.firstChild != null) ? '' : 'none';
	this.input.setAttribute('aria-expanded', (this.items.length > 0) ? 'true' : 'false');
	this.list.scrollTop = 0;
	this.setActive((active != null) ? active : ((this.items.length > 0) ? 0 : null));

	// Tells screen readers how many results there are
	if (mxUtils.trim(query).length > 0 && typeof this.editorUi.announce === 'function')
	{
		var text = (this.items.length > 0) ? mxResources.get('searchResults') + ': ' +
			this.items.length : mxResources.get('noResultsFor', [query]);

		if (text != this.lastAnnounced)
		{
			this.lastAnnounced = text;
			this.editorUi.announce(text);
		}
	}
};

/**
 * Writes the given text with the given range marked as the match.
 */
Omnibox.prototype.writeMatch = function(elt, text, range)
{
	if (range != null && range[0] >= 0 && range[1] > range[0] && range[1] <= text.length)
	{
		mxUtils.write(elt, text.substring(0, range[0]));
		var mark = document.createElement('mark');
		mark.className = 'geOmniboxMatch';
		mxUtils.write(mark, text.substring(range[0], range[1]));
		elt.appendChild(mark);
		mxUtils.write(elt, text.substring(range[1]));
	}
	else
	{
		mxUtils.write(elt, text);
	}
};

/**
 * Creates the option for the given entry. All texts are written as text, as
 * labels of the format panel, names of pages and the query come from the
 * user.
 */
Omnibox.prototype.createItem = function(entry, index)
{
	var item = document.createElement('div');
	item.className = 'geOmniboxItem';
	item.setAttribute('id', this.id + '-item-' + index);
	item.setAttribute('role', 'option');
	item.setAttribute('aria-selected', 'false');
	item.omniboxIndex = index;

	if (!entry.enabled)
	{
		item.classList.add('geOmniboxDisabled');
		item.setAttribute('aria-disabled', 'true');
	}

	// Icon of the entry or of its kind in a tile
	var tile = document.createElement('div');
	tile.className = 'geOmniboxTile';
	tile.setAttribute('aria-hidden', 'true');
	var src = this.getIcon(entry);

	if (src != null)
	{
		var img = document.createElement('img');
		img.setAttribute('src', src);
		img.setAttribute('alt', '');

		if (this.coloredIcons == null || !this.coloredIcons[src])
		{
			img.className = 'geAdaptiveAsset';
		}

		tile.appendChild(img);
	}

	item.appendChild(tile);

	if (entry.checked != null)
	{
		item.setAttribute('aria-checked', (entry.checked) ? 'true' : 'false');
	}

	var text = document.createElement('div');
	text.className = 'geOmniboxText';
	var label = document.createElement('div');
	label.className = 'geOmniboxLabel';
	this.writeMatch(label, entry.label, entry.match);
	text.appendChild(label);

	var details = [];

	if (!entry.enabled)
	{
		details.push(this.getReason(entry));
	}

	if (entry.keyword != null)
	{
		details.push('“' + entry.keyword + '”');
	}

	if (entry.path != null && entry.path.length > 0)
	{
		details.push(entry.path.join(' › '));
	}

	if (entry.detail != null)
	{
		details.push(entry.detail);
	}

	if (details.length > 0)
	{
		var detail = document.createElement('div');
		detail.className = 'geOmniboxDetail';
		mxUtils.write(detail, details.join(' · '));
		text.appendChild(detail);
	}

	item.appendChild(text);

	// The value, shortcut or state of the entry and the key of the active entry
	var side = document.createElement('div');
	side.className = 'geOmniboxSide';

	if (entry.shortcut != null && entry.shortcut.length > 0)
	{
		var shortcut = document.createElement('div');
		shortcut.className = 'geOmniboxShortcut';
		mxUtils.write(shortcut, entry.shortcut);
		side.appendChild(shortcut);
	}

	if (entry.checked != null)
	{
		var toggle = document.createElement('div');
		toggle.className = 'geOmniboxSwitch' + ((entry.checked) ? ' geOmniboxOn' : '');
		toggle.setAttribute('aria-hidden', 'true');
		side.appendChild(toggle);
	}

	var enter = document.createElement('div');
	enter.className = 'geOmniboxEnter';
	enter.setAttribute('aria-hidden', 'true');
	mxUtils.write(enter, '↵');
	side.appendChild(enter);
	item.appendChild(side);

	return item;
};
