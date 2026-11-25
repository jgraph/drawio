/**
 * Copyright (c) 2026, JGraph Holdings Ltd
 * Copyright (c) 2026, draw.io AG
 */
/**
 * In This Diagram: a library in the list of the libraries of the sidebar that
 * lists the shapes and connectors of the current page, one entry per kind of
 * shape and of connector (getUsedShapeKind: colors, fonts, text, sizes and the
 * ends of connectors make no kind of their own) with the look that the page
 * uses most for that kind, so the shapes that a diagram already uses are at
 * hand and the list stays short. The entries are
 * palette entries like all others (click, drag, Enter, drop on a hover arrow)
 * and insert a copy with the style of the diagram: the styles of new cells
 * (the current styles, the theme of the page) are not applied to them.
 *
 * Theme-neutral (app.min.js): Classic and Simple show it after the search, the
 * scratchpad and the open libraries of files, on by default in the online app
 * (not in the desktop app and in embed mode, where new defaults come a
 * release later), with the close button of the titles of libraries. The
 * default is the feature usedShapes of Editor.featureDefaults (the
 * configuration usedShapes sets it), the choice of the user is stored per
 * device (mxSettings.settings.usedShapes) and wins over it, and the URL
 * (usedShapes=0|1) wins over both; with the URL set, a choice holds for the
 * session only. View > In This Diagram turns it on again, and so does its
 * entry in More Shapes in Simple. Sketch and Minimal have no library.
 *
 * Fusion (SimpleUsedShapes.js) uses the same core in its Shapes card with its
 * own switch (off by default, the column fusion of the row), title, close
 * button and classes (look 'fusion', see getUsedShapesLook).
 *
 * The list follows the edits and page switches of the diagram: changes that
 * may add, remove or restyle cells walk the cells of the page once (a few
 * hundred milliseconds later, at most once in that time), and only while the
 * library is expanded and the shapes are shown; otherwise it is marked to be
 * updated when it is shown. The palette is rebuilt only if the list changed.
 *
 * The entries copy no labels, and their titles are the names of the kinds
 * of cells (Graph.getCellTypeName). Shapes that show nothing but their label
 * (texts, shapes without a fill and a stroke, images without an image, see
 * isUsedShapeLabelOnly) keep a short label of one line without markup in
 * their entries, other labels are Text, so the entry can be seen; such
 * shapes without a label to show show nothing and have no entry (driver, 17
 * November 2026: a text in Comic Sans was an empty tile).
 */
(function()
{
	if (typeof EditorUi === 'undefined' || typeof Sidebar === 'undefined')
	{
		return;
	}

	/**
	 * ID of the library and of its palette.
	 */
	EditorUi.usedShapesId = '.used';

	/**
	 * Maximum number of entries: the kinds of shapes and connectors used most
	 * often if the page has more kinds, about as many as a built-in library
	 * has. 0 is no limit. The configuration usedShapesMax sets it
	 * (Editor.configure).
	 */
	EditorUi.usedShapesMax = 40;

	/**
	 * Milliseconds between a change of the diagram and the update of the list.
	 */
	EditorUi.usedShapesDelay = 300;

	/**
	 * Keys of the styles of connectors that belong to one connector (where it
	 * ends on its terminals), not to its look: they are not part of an entry.
	 */
	EditorUi.usedShapesEdgeKeys = ['exitX', 'exitY', 'exitDx', 'exitDy', 'exitPerimeter',
		'entryX', 'entryY', 'entryDx', 'entryDy', 'entryPerimeter', 'sourcePort', 'targetPort',
		'sourcePortConstraint', 'targetPortConstraint', 'ties'];

	/**
	 * Keys of the styles of all cells that are no part of an entry: a locked
	 * shape gives an entry that inserts shapes that can be moved.
	 */
	EditorUi.usedShapesKeys = ['locked'];

	/**
	 * Styles longer than this are looks of their own (getUsedShapeKey), and
	 * values longer than this are a checksum in the kind (getUsedShapeKind):
	 * images and stencils in styles are not copied into normalized keys.
	 */
	EditorUi.usedShapesMaxKeyLength = 1000;

	/**
	 * Keys of the styles of connectors that make their kind (getUsedShapeKind):
	 * the shape, the routing, the corners, the arrows and the dashes. All other
	 * keys (colors, widths, labels and fonts, and keys that do not show, such
	 * as jettySize, orthogonalLoop and html, which the connectors of the hover
	 * arrows have and those of the palettes have not) are the look of a kind.
	 */
	EditorUi.usedShapesEdgeKindKeys = ['shape', 'edgeStyle', 'elbow', 'curved', 'rounded',
		'startArrow', 'startFill', 'endArrow', 'endFill', 'dashed'];

	/**
	 * Values of the keys of kinds if neither the style nor the default style of
	 * the stylesheet has them: a key with its default is the same kind as a
	 * style without the key (getUsedShapeKind).
	 */
	EditorUi.usedShapesEdgeDefaults = {shape: 'connector', edgeStyle: 'none', elbow: 'horizontal',
		curved: '0', rounded: '0', startArrow: 'none', startFill: '1', endArrow: 'none',
		endFill: '1', dashed: '0'};

	/**
	 * Arrows that only stroke and ignore their fill (mxMarker), so startFill and
	 * endFill make no kind with them (getUsedShapeKind): the Format panel and
	 * the inline toolbar write endFill=0 for them, the palettes leave it out.
	 * The fill of other arrows, also of unknown ones, makes a kind.
	 */
	EditorUi.usedShapesStrokeArrows = ['open', 'openThin', 'openAsync', 'dash', 'cross',
		'baseDash', 'halfCircle', 'ERone', 'ERmandOne', 'ERmany', 'ERoneToMany'];

	/**
	 * See usedShapesEdgeDefaults.
	 */
	EditorUi.usedShapesVertexDefaults = {rounded: '0', dashed: '0', container: '0'};

	/**
	 * Keys of the styles of shapes that make no kind (getUsedShapeKind): the
	 * text and its place, sizes, the orientation and the behaviour, with the
	 * keys that usedShapesLookPattern matches. All other keys make the kind, so
	 * shapes that differ in a key that is not known here stay apart (the icons
	 * of the cloud libraries in resIcon or prIcon, the events of BPMN in
	 * outline and symbol, images in image).
	 */
	EditorUi.usedShapesLookKeys = ['html', 'whiteSpace', 'overflow', 'align', 'verticalAlign',
		'verticalLabelPosition', 'horizontal', 'rotation', 'direction', 'flipH', 'flipV', 'size',
		'fixedSize', 'dx', 'dy', 'arcSize', 'absoluteArcSize', 'startSize', 'perimeter',
		'perimeterSpacing', 'aspect', 'autosize', 'resizable', 'movable', 'rotatable', 'deletable',
		'editable', 'cloneable', 'connectable', 'pointerEvents', 'metaEdit', 'treeFolding',
		'treeMoving', 'recursiveResize', 'expand', 'collapsible', 'dropTarget', 'noLabel',
		'allowArrows', 'outlineConnect', 'snapToPoint', 'dashPattern', 'fixDash', 'enumerate',
		'enumerateValue', 'tooltip', 'placeholders', 'editableCssRules', 'portConstraint',
		'portConstraintRotation', 'margin', 'swimlaneLine', 'swimlaneHead', 'swimlaneBody'];

	/**
	 * Keys of the styles of shapes that match this make no kind either: colors,
	 * opacities, fonts, labels, text, spacing, gradients, shadows, glass, the
	 * sketch style, the keys of images but the image (imageWidth, imageAspect)
	 * and widths and heights (strokeWidth, tabWidth).
	 */
	EditorUi.usedShapesLookPattern = new RegExp('color|opacity|^font|^label|^text|^spacing|' +
		'^gradient|^shadow|^glass|^sketch|^comic|^hachure|^jiggle|^fillStyle|^fillWeight|' +
		'^curveFitting|^simplification|^disableMultiStroke|^zigzag|^image.|width$|height$', 'i');

	/**
	 * Maximum length of the labels that the entries of shapes that show only
	 * their label keep (getUsedShapeLabel): longer labels, labels with more
	 * than one line and HTML labels with markup or entities are Text.
	 */
	EditorUi.usedShapesMaxLabelLength = 20;

	/**
	 * Shapes that paint nothing but their fill and their stroke, or their
	 * image, its background and its border (image), so that without them
	 * they show only their label (isUsedShapeLabelOnly). Other shapes, such
	 * as stencils with colors of their own, always show something.
	 */
	EditorUi.usedShapesPlainShapes = ['label', 'rectangle', 'ellipse', 'rhombus', 'doubleEllipse',
		'triangle', 'hexagon', 'cloud', 'process', 'parallelogram', 'trapezoid', 'partialRectangle',
		'image'];

	/**
	 * Maximum number of parts (the rows and cells of a table, the shapes in a
	 * stack) that the thumbnail of an entry draws, the first ones level by
	 * level. The entry has all parts, and so have the copies it inserts.
	 */
	EditorUi.usedShapesMaxThumbParts = 500;

	/**
	 * Value of the field usedShapeCopy that marks the cells of the entries and,
	 * as clones copy it, the copies that the entries insert
	 * (pasteNewCellStyles). A function, as the codec, the realtime diffs and
	 * the checksums skip fields that are functions, so the mark never reaches
	 * a file or another client.
	 */
	EditorUi.usedShapeCopy = function() { };

	/**
	 * Runs the given function and returns its result with the caches that the
	 * view of the given graph uses while it validates: the ancestors with the
	 * data of placeholders and the styles of the parents. Without them, each
	 * placeholder walks all ancestors of its cell and the style of a parent is
	 * resolved for each of its children.
	 */
	var runWithCaches = function(graph, fn)
	{
		return graph.cachePlaceholderCells(function()
		{
			return graph.cacheChildLayoutStyles(fn);
		});
	};

	/**
	 * Returns true if this editor can show the library: a sidebar, not a
	 * chromeless view, Classic, Simple, Atlas, Sketch or Minimal (the last two
	 * show their shapes in a window or a panel of their own, Minimal.js; the
	 * driver, 22 November 2026: "alles was im classic ist solle auch in min,
	 * sketch und atlas sein"). Fusion has its own gate (SimpleUsedShapes.js).
	 */
	EditorUi.prototype.isUsedShapesEnabled = function()
	{
		// The public build has no library In This Diagram, also where the user
		// or the URL switched it on (the driver, 22 November 2026: the new
		// dialogs and menus of the work on Fusion stay in the internal builds,
		// see Editor.isFeatureInBuild)
		if (!Editor.isFeatureInBuild('usedShapes'))
		{
			return false;
		}

		// Fusion decides in SimpleUsedShapes.js, also while its scripts load
		if (Editor.isSimpleModern != null && Editor.isSimpleModern())
		{
			return false;
		}

		var theme = Editor.currentTheme;

		return this.sidebar != null && this.sidebar.container != null &&
			!this.editor.isChromelessView() &&
			(this.isDefaultTheme(theme) || theme == 'simple' || theme == 'atlas' ||
			theme == 'sketch' || theme == 'min');
	};

	/**
	 * Returns true if the library is on without a choice of the user: the
	 * feature usedShapes of Editor.featureDefaults, which is the configuration
	 * (usedShapes), else the default of the theme, on in the online app and
	 * off in the desktop app, in Confluence and Jira and in embed mode.
	 */
	EditorUi.prototype.isUsedShapesDefault = function()
	{
		return Editor.isFeatureEnabled('usedShapes');
	};

	/**
	 * Returns true if the URL turns the library on or off (usedShapes=0|1).
	 */
	EditorUi.prototype.isUsedShapesInUrl = function()
	{
		return urlParams['usedShapes'] == '0' || urlParams['usedShapes'] == '1';
	};

	/**
	 * Returns true if the library is on: a choice for this session
	 * (usedShapesSession, see setUsedShapesOn), else the URL (usedShapes=0|1),
	 * else the choice of the user on this device, else the default.
	 */
	EditorUi.prototype.isUsedShapesOn = function()
	{
		if (typeof this.usedShapesSession === 'boolean')
		{
			return this.usedShapesSession;
		}

		if (this.isUsedShapesInUrl())
		{
			return urlParams['usedShapes'] == '1';
		}

		var stored = (typeof mxSettings !== 'undefined' && mxSettings.settings != null) ?
			mxSettings.settings.usedShapes : null;

		return (typeof stored === 'boolean') ? stored : this.isUsedShapesDefault();
	};

	/**
	 * Turns the library on or off and stores the choice on this device like
	 * the other settings of the sidebar. If temporary is true (Remember this
	 * setting unchecked in More Shapes) or the URL sets the library, the
	 * choice holds for this session only and nothing is stored.
	 */
	EditorUi.prototype.setUsedShapesOn = function(on, temporary)
	{
		if (temporary || this.isUsedShapesInUrl())
		{
			this.usedShapesSession = on;
		}
		else
		{
			this.usedShapesSession = null;

			if (typeof mxSettings !== 'undefined' && mxSettings.settings != null)
			{
				mxSettings.settings.usedShapes = on;

				if (isLocalStorage || mxClient.IS_CHROMEAPP)
				{
					mxSettings.save();
				}
			}
		}

		this.syncUsedShapes();
	};

	/**
	 * Returns the look of the library: 'default' for Classic and Simple. A look
	 * that changes (a switch to Fusion and back) builds the palette again.
	 */
	EditorUi.prototype.getUsedShapesLook = function()
	{
		return 'default';
	};

	/**
	 * Returns the title of the palette.
	 */
	EditorUi.prototype.getUsedShapesTitle = function()
	{
		return mxResources.get('inThisDiagram');
	};

	/**
	 * Returns true if the library has an entry in More Shapes (the search and
	 * the scratchpad have one in Simple).
	 */
	EditorUi.prototype.isUsedShapesListed = function()
	{
		return Editor.currentTheme == 'simple' && this.isUsedShapesEnabled();
	};

	/**
	 * Returns true if the shapes are shown: the sidebar, the shapes panel, the
	 * shapes window or panel of Sketch and Minimal (Minimal.js, which has no
	 * split of the editor, as Omnibox.isShapesVisible) or the Shapes card of
	 * Fusion.
	 */
	EditorUi.prototype.isUsedShapesShown = function()
	{
		if (this.sidebarWindow != null)
		{
			return this.sidebarWindow.window.isVisible();
		}
		else if (this.sidebarElt != null)
		{
			return this.sidebarElt.parentNode != null;
		}

		return this.isShapesPanelVisible();
	};

	/**
	 * Adds the library if it is enabled and on and removes it otherwise. A
	 * library of another look is built again.
	 */
	EditorUi.prototype.syncUsedShapes = function()
	{
		if (this.sidebar == null)
		{
			return;
		}

		if (this.isUsedShapesEnabled() && this.isUsedShapesOn())
		{
			if (this.usedShapesLook != null && this.usedShapesLook != this.getUsedShapesLook())
			{
				this.uninstallUsedShapes();
			}

			this.installUsedShapes();
		}
		else
		{
			this.uninstallUsedShapes();
		}
	};

	/**
	 * Adds the library if it is enabled and on: its palette after the search,
	 * the scratchpad and the libraries of files (see placeUsedShapes),
	 * expanded unless it was collapsed, with a close button in its title.
	 */
	EditorUi.prototype.installUsedShapes = function()
	{
		var sb = this.sidebar;
		var id = EditorUi.usedShapesId;

		if (sb == null || sb.palettes[id] != null || !this.isUsedShapesEnabled() ||
			!this.isUsedShapesOn())
		{
			return;
		}

		// Expanded palettes have their content at once, collapsed ones when
		// they are expanded (see the setContentVisible wrapper below)
		var expanded = this.getLibraryExpanded(id, true);
		sb.addPalette(id, this.getUsedShapesTitle(), expanded,
			(expanded) ? function() {} : null, true);
		var elts = sb.palettes[id];

		if (elts == null)
		{
			return;
		}

		this.usedShapesLook = this.getUsedShapesLook();
		this.usedShapesItems = null;
		this.usedShapesSignature = null;
		this.decorateUsedShapes(elts[0], elts[1].firstChild);
		this.placeUsedShapes();
		this.addUsedShapesClose(elts[0]);
		this.installUsedShapesInsert(elts[1]);

		if (this.usedShapesListener == null)
		{
			this.usedShapesListener = mxUtils.bind(this, function(sender, evt)
			{
				var edit = evt.getProperty('edit');

				if (edit != null && this.isUsedShapesChange(edit.changes))
				{
					this.scheduleUsedShapes();
				}
			});

			this.editor.graph.model.addListener(mxEvent.CHANGE, this.usedShapesListener);
		}

		this.usedShapesDirty = true;
		this.updateUsedShapes();
	};

	/**
	 * Adds the classes of the look to the title and the content of the palette.
	 */
	EditorUi.prototype.decorateUsedShapes = function(title, content)
	{
		content.classList.add('geUsedShapes');
	};

	/**
	 * Removes the library and its listeners.
	 */
	EditorUi.prototype.uninstallUsedShapes = function()
	{
		var id = EditorUi.usedShapesId;

		if (this.sidebar != null && this.sidebar.palettes[id] != null)
		{
			this.removeLibrarySidebar(id);
		}

		if (this.usedShapesListener != null)
		{
			this.editor.graph.model.removeListener(this.usedShapesListener);
			this.usedShapesListener = null;
		}

		if (this.usedShapesEndInsert != null)
		{
			var names = ['pointerup', 'pointercancel', 'mouseup', 'touchend', 'touchcancel'];

			for (var i = 0; i < names.length; i++)
			{
				window.removeEventListener(names[i], this.usedShapesEndInsert, true);
			}

			this.usedShapesEndInsert = null;
		}

		if (this.usedShapesThread != null)
		{
			window.clearTimeout(this.usedShapesThread);
			this.usedShapesThread = null;
		}

		this.usedShapesLook = null;
		this.usedShapesItems = null;
		this.usedShapesCells = null;
		this.usedShapesSignature = null;
		this.usedShapesKeys = null;
		this.usedShapesKeysPrev = null;
		this.usedShapesDirty = false;
		this.usedShapesInsert = false;
	};

	/**
	 * Returns the IDs of the palettes of the libraries of files that are open
	 * (openLibraries, not the scratchpad).
	 */
	EditorUi.prototype.getUsedShapesFileLibraries = function()
	{
		var result = [];

		for (var i = 0; this.openLibraries != null && i < this.openLibraries.length; i++)
		{
			var lib = this.openLibraries[i];
			var id = (lib != null && lib.file != null && typeof lib.file.getHash === 'function') ?
				lib.file.getHash() : null;

			if (id != null && Object.prototype.hasOwnProperty.call(this.sidebar.palettes, id))
			{
				result.push(id);
			}
		}

		return result;
	};

	/**
	 * Moves the palette of the library after the search, the scratchpad and the
	 * libraries of files that follow it, so it is above the built-in
	 * libraries. Libraries opened later are added after the scratchpad or the
	 * search (repositionLibrary), so they stay above it. A saved order of the
	 * palettes (dragged titles) that has the library places it where it is in
	 * that order (see the applyPaletteOrder wrapper below).
	 */
	EditorUi.prototype.placeUsedShapes = function()
	{
		var sb = this.sidebar;
		var wrapper = sb.getEntryContainer();
		var elts = sb.palettes[EditorUi.usedShapesId];

		if (elts == null || elts[0].parentNode != wrapper)
		{
			return;
		}

		// The titles of the scratchpad and of the libraries of files
		var top = [];
		var scratchpad = sb.palettes['L.scratchpad'];

		if (scratchpad != null)
		{
			top.push(scratchpad[0]);
		}

		var files = this.getUsedShapesFileLibraries();

		for (var i = 0; i < files.length; i++)
		{
			top.push(sb.palettes[files[i]][0]);
		}

		// The first title of a palette after the search and the titles of the
		// top that follow it, wherever the library is (other elements are the
		// palettes of the titles and eg. the thumb of the scrollbar)
		var search = sb.palettes['search'];
		var next = (search != null && search[1].parentNode == wrapper) ?
			search[1].nextSibling : wrapper.firstChild;

		while (next != null && (next == elts[0] || next._paletteId == null ||
			next.classList == null || !next.classList.contains('geTitle') ||
			mxUtils.indexOf(top, next) >= 0))
		{
			next = next.nextSibling;
		}

		// Moves only if it is not there (a move takes the focus)
		if (elts[1].nextSibling != next || elts[0].nextSibling != elts[1])
		{
			wrapper.insertBefore(elts[0], next);
			wrapper.insertBefore(elts[1], next);
		}
	};

	/**
	 * Closes the library from its close button: turns it off and, with the
	 * keyboard, moves the focus to the next or previous title.
	 */
	EditorUi.prototype.closeUsedShapes = function(title, keyboard)
	{
		var titles = Array.prototype.slice.call(this.sidebar.container.querySelectorAll('.geTitle'));
		var index = mxUtils.indexOf(titles, title);
		this.setUsedShapesOn(false);

		if (keyboard && !document.body.contains(title))
		{
			var next = null;

			for (var i = index + 1; i < titles.length && next == null; i++)
			{
				next = (document.body.contains(titles[i]) && titles[i].getClientRects().length > 0) ?
					titles[i] : null;
			}

			for (var i = index - 1; i >= 0 && next == null; i--)
			{
				next = (document.body.contains(titles[i]) && titles[i].getClientRects().length > 0) ?
					titles[i] : null;
			}

			if (next != null)
			{
				(next.querySelector('.geTitleLabel') || next).focus();
			}
		}
	};

	/**
	 * Adds the close button of the titles of libraries (libraryLoaded) to the
	 * given title of the palette: it turns the library off.
	 */
	EditorUi.prototype.addUsedShapesClose = function(title)
	{
		var buttons = document.createElement('div');
		buttons.style.backgroundColor = 'inherit';
		title.style.position = 'relative';

		var btn = document.createElement('img');
		btn.className = 'geLibraryButton';
		btn.setAttribute('src', Editor.crossImage);
		btn.setAttribute('title', mxResources.get('close'));
		btn.setAttribute('aria-label', mxResources.get('close'));

		Editor.initKeyboardButton(btn, mxUtils.bind(this, function(evt)
		{
			this.closeUsedShapes(title, true);
		}));

		mxEvent.addListener(btn, 'click', mxUtils.bind(this, function(evt)
		{
			if (!mxEvent.isConsumed(evt))
			{
				this.closeUsedShapes(title, evt.detail == 0);
				mxEvent.consume(evt);
			}
		}));

		buttons.appendChild(btn);
		title.appendChild(buttons);
	};

	/**
	 * Marks the inserts from the library (usedShapesInsert): from the press of
	 * a pointer in the palette until it is released (click, drag and its
	 * preview, drop on a hover arrow) and during a key that is pressed there
	 * (Enter). The marks end after the event, as the inserts run in it.
	 */
	EditorUi.prototype.installUsedShapesInsert = function(outer)
	{
		var ui = this;

		var start = function()
		{
			ui.usedShapesInsert = true;
		};

		var end = function()
		{
			if (ui.usedShapesInsert)
			{
				window.setTimeout(function()
				{
					ui.usedShapesInsert = false;
				}, 0);
			}
		};

		outer.addEventListener('pointerdown', start, true);
		outer.addEventListener('mousedown', start, true);
		outer.addEventListener('touchstart', start, {capture: true, passive: true});

		outer.addEventListener('keydown', function()
		{
			start();
			end();
		}, true);

		if (this.usedShapesEndInsert == null)
		{
			this.usedShapesEndInsert = end;
			var names = ['pointerup', 'pointercancel', 'mouseup', 'touchend', 'touchcancel'];

			for (var i = 0; i < names.length; i++)
			{
				window.addEventListener(names[i], end, true);
			}
		}
	};

	/**
	 * Removes the marks of the copies of the library (usedShapeCopy) from the
	 * given cells and returns the cells that get the styles of new cells: all
	 * but the copies of an insert from the library, eg. the connector of a
	 * drop on a hover arrow, also if that connector has the style of an
	 * entry. Returns null if no cell has the mark.
	 */
	EditorUi.prototype.filterUsedShapeCopies = function(cells)
	{
		var rest = null;

		for (var i = 0; cells != null && i < cells.length; i++)
		{
			if (cells[i] != null && cells[i].usedShapeCopy === EditorUi.usedShapeCopy)
			{
				delete cells[i].usedShapeCopy;

				if (rest == null)
				{
					rest = cells.slice(0, i);
				}

				if (!this.usedShapesInsert)
				{
					rest.push(cells[i]);
				}
			}
			else if (rest != null)
			{
				rest.push(cells[i]);
			}
		}

		return rest;
	};

	/**
	 * Copies from the library keep the style of the diagram (see
	 * filterUsedShapeCopies).
	 */
	var editorUiPasteNewCellStyles = EditorUi.prototype.pasteNewCellStyles;

	EditorUi.prototype.pasteNewCellStyles = function(cells, target)
	{
		var rest = this.filterUsedShapeCopies(cells);

		if (rest != null)
		{
			if (rest.length > 0)
			{
				editorUiPasteNewCellStyles.call(this, rest, target);
			}

			return;
		}

		editorUiPasteNewCellStyles.apply(this, arguments);
	};

	/**
	 * Returns true if the given changes of the model may change the list:
	 * cells that are added, removed or moved to another parent, styles,
	 * collapsed and visible states (the labels of hidden cells are not built,
	 * see hasUsedShapeLabel), the root (another page) and changes it does not
	 * know. Values, terminals and geometries do not change it, except the
	 * sizes of the cells of the entries, the geometries of their parts
	 * (getUsedShapeItemKey) and the labels of shapes that show only their
	 * label (isUsedShapeLabelOnly, by the styles of the last walk), which
	 * are the labels of their entries or leave them without a label to show.
	 */
	EditorUi.prototype.isUsedShapesChange = function(changes)
	{
		for (var i = 0; changes != null && i < changes.length; i++)
		{
			var change = changes[i];

			if (change instanceof mxGeometryChange)
			{
				// Moves of the cells of the entries keep them, the parts are
				// copied with their geometries
				var a = change.geometry;
				var b = change.previous;
				var kind = (change.cell != null && this.usedShapesCells != null) ?
					this.usedShapesCells[change.cell.id] : null;

				if (kind == 2 || (kind == 1 && (a == null || b == null ||
					a.width != b.width || a.height != b.height)))
				{
					return true;
				}
			}
			else if (change instanceof mxValueChange || change instanceof mxCellAttributeChange)
			{
				var cell = change.cell;
				var entry = (cell != null && this.usedShapesKeys != null &&
					this.editor.graph.model.isVertex(cell)) ?
					this.usedShapesKeys[0].get((typeof cell.style === 'string') ? cell.style : '') : null;

				if (entry != null && entry.labelOnly)
				{
					return true;
				}
			}
			else if (!(change instanceof mxTerminalChange))
			{
				return true;
			}
		}

		return false;
	};

	/**
	 * Updates the list after the delay, at most once in that time.
	 */
	EditorUi.prototype.scheduleUsedShapes = function()
	{
		if (this.usedShapesThread == null)
		{
			this.usedShapesThread = window.setTimeout(mxUtils.bind(this, function()
			{
				this.usedShapesThread = null;
				this.updateUsedShapes();
			}), EditorUi.usedShapesDelay);
		}
	};

	/**
	 * Returns {key, look, style} for the given style of a cell: the key
	 * identifies the kind of shape or connector (getUsedShapeKind), the look
	 * identifies the style (the named styles in their order and the values of
	 * the keys, the last value of a key; long styles are their own look), the
	 * style is the style of the entry. Returns null for styles that are no
	 * entry (groups, ties). Results are cached by style for the current and the
	 * previous walk of the page (usedShapesKeys, usedShapesKeysPrev; maps of
	 * vertices and connectors keyed by the strings of the cells), so the cache
	 * holds no copies and only the styles of the page.
	 */
	EditorUi.prototype.getUsedShapeKey = function(style, edge)
	{
		var index = (edge) ? 1 : 0;

		if (this.usedShapesKeys == null)
		{
			this.usedShapesKeys = [new Map(), new Map()];
		}

		var cache = this.usedShapesKeys[index];

		if (cache.has(style))
		{
			return cache.get(style);
		}

		var prev = (this.usedShapesKeysPrev != null) ? this.usedShapesKeysPrev[index] : null;

		if (prev != null && prev.has(style))
		{
			var cached = prev.get(style);
			cache.set(style, cached);

			return cached;
		}

		var tokens = style.split(';');
		var names = [];
		var values = Object.create(null);
		var keys = [];

		for (var i = 0; i < tokens.length; i++)
		{
			var token = tokens[i];
			var eq = token.indexOf('=');

			if (eq < 0)
			{
				if (token.length > 0)
				{
					names.push(token);
				}
			}
			else
			{
				var key = token.substring(0, eq);

				if (!(key in values))
				{
					keys.push(key);
				}

				values[key] = token.substring(eq + 1);
			}
		}

		var result = null;

		if (edge || (mxUtils.indexOf(names, 'group') < 0 && values['tie'] != '1'))
		{
			var removed = EditorUi.usedShapesKeys.concat((edge) ?
				EditorUi.usedShapesEdgeKeys : []);
			var entry = style;
			var pairs = [];

			for (var i = 0; i < removed.length; i++)
			{
				if (removed[i] in values)
				{
					entry = mxUtils.setStyle(entry, removed[i], null);
				}
			}

			var kept = [];
			keys.sort();

			for (var i = 0; i < keys.length; i++)
			{
				if (mxUtils.indexOf(removed, keys[i]) < 0)
				{
					kept.push(keys[i]);
				}
			}

			var kind = this.getUsedShapeKind(names, kept, values, edge);

			if (entry.length > EditorUi.usedShapesMaxKeyLength)
			{
				result = {key: kind, look: entry, style: entry};
			}
			else
			{
				for (var i = 0; i < kept.length; i++)
				{
					pairs.push(kept[i] + '=' + values[kept[i]]);
				}

				result = {key: kind, look: names.join(';') + '|' + pairs.join(';'), style: entry};
			}
		}

		cache.set(style, result);

		return result;
	};

	/**
	 * Returns the key of the kind of a shape or connector for the given named
	 * styles, the sorted keys of the style without the keys of one cell, and
	 * the values of the keys: the named styles (sorted) and, for connectors,
	 * the values of usedShapesEdgeKindKeys with their defaults (the default
	 * style of the stylesheet, else usedShapesEdgeDefaults; the fills only with
	 * an arrow that paints them, see usedShapesStrokeArrows, elbow only for
	 * the edge styles that use it), for shapes all
	 * keys but usedShapesLookKeys and the keys that usedShapesLookPattern
	 * matches, without the ones that have their default. So colors, fonts,
	 * text, sizes and keys that do not show make no kind of their own, and an
	 * explicit default is the same kind as a style without the key. Values
	 * longer than usedShapesMaxKeyLength are their length and checksum.
	 */
	EditorUi.prototype.getUsedShapeKind = function(names, keys, values, edge)
	{
		var sheet = this.editor.graph.getStylesheet();
		var sheetDefaults = (sheet == null) ? null : ((edge) ?
			sheet.getDefaultEdgeStyle() : sheet.getDefaultVertexStyle());
		var defaults = (edge) ? EditorUi.usedShapesEdgeDefaults : EditorUi.usedShapesVertexDefaults;
		var has = function(obj, key)
		{
			return obj != null && Object.prototype.hasOwnProperty.call(obj, key) && obj[key] != null;
		};
		var getDefault = function(key)
		{
			return (has(sheetDefaults, key)) ? String(sheetDefaults[key]) :
				((has(defaults, key)) ? defaults[key] : null);
		};
		var getValue = function(key)
		{
			var value = (key in values) ? values[key] : getDefault(key);

			// An empty edge style or arrow is none
			return (value === '' && (key == 'edgeStyle' || key == 'startArrow' ||
				key == 'endArrow')) ? 'none' : value;
		};
		var pairs = [];
		var add = function(key, value)
		{
			if (value != null && value.length > EditorUi.usedShapesMaxKeyLength)
			{
				value = '#' + value.length + ':' + ((typeof Editor.crc32 === 'function') ?
					Editor.crc32(value) : value);
			}

			pairs.push(key + '=' + value);
		};

		if (edge)
		{
			var kindKeys = EditorUi.usedShapesEdgeKindKeys;
			var edgeStyle = getValue('edgeStyle');

			// The fill of an arrow makes a kind only if the arrow paints it
			var isFilled = function(arrow)
			{
				return arrow != 'none' && mxUtils.indexOf(EditorUi.usedShapesStrokeArrows, arrow) < 0;
			};

			for (var i = 0; i < kindKeys.length; i++)
			{
				var key = kindKeys[i];

				if ((key != 'elbow' || edgeStyle == 'elbowEdgeStyle' ||
					edgeStyle == 'isometricEdgeStyle') &&
					(key != 'startFill' || isFilled(getValue('startArrow'))) &&
					(key != 'endFill' || isFilled(getValue('endArrow'))))
				{
					add(key, getValue(key));
				}
			}
		}
		else
		{
			for (var i = 0; i < keys.length; i++)
			{
				var key = keys[i];

				if (mxUtils.indexOf(EditorUi.usedShapesLookKeys, key) < 0 &&
					!EditorUi.usedShapesLookPattern.test(key) &&
					values[key] != getDefault(key))
				{
					add(key, values[key]);
				}
			}
		}

		return names.slice().sort().join(';') + '|' + pairs.join(';');
	};

	/**
	 * Returns true if a shape with the given resolved style shows nothing but
	 * its label: a shape of usedShapesPlainShapes without an image and an
	 * indicator and without a fill and a stroke (none, a missing key, as an
	 * explicit none in the style of a cell removes the key, see
	 * mxStylesheet.getCellStyle, or an opacity of 0), an image without an
	 * image, a background and a border. getUsedShapes passes the style of the
	 * entry resolved by the stylesheet only, without the data of a cell, so
	 * the result depends only on the style string (it is cached by style), and
	 * a key with a placeholder, such as fillColor=%color%, shows something.
	 */
	EditorUi.prototype.isUsedShapeLabelOnly = function(style)
	{
		var shape = mxUtils.getValue(style, mxConstants.STYLE_SHAPE, null);
		var isNone = function(key)
		{
			var value = mxUtils.getValue(style, key, mxConstants.NONE);

			return value == mxConstants.NONE || value === '';
		};
		var isZero = function(key)
		{
			return parseFloat(mxUtils.getValue(style, key, 100)) == 0;
		};

		if ((shape != null && mxUtils.indexOf(EditorUi.usedShapesPlainShapes, shape) < 0) ||
			!isNone(mxConstants.STYLE_IMAGE) || !isNone(mxConstants.STYLE_INDICATOR_SHAPE) ||
			!isNone(mxConstants.STYLE_INDICATOR_IMAGE))
		{
			return false;
		}
		else if (shape == 'image')
		{
			return isNone(mxConstants.STYLE_IMAGE_BACKGROUND) && isNone(mxConstants.STYLE_IMAGE_BORDER);
		}
		else
		{
			return isZero(mxConstants.STYLE_OPACITY) ||
				((isNone(mxConstants.STYLE_FILLCOLOR) || isZero(mxConstants.STYLE_FILL_OPACITY)) &&
				(isNone(mxConstants.STYLE_STROKECOLOR) || isZero(mxConstants.STYLE_STROKE_OPACITY)));
		}
	};

	/**
	 * Returns true if the label of the given cell shows something: not
	 * noLabel, not a textOpacity of 0, and a label with text or, in HTML, an
	 * image. The view does not build the labels of the cells that it does not
	 * show, and they are not built here: their placeholders count as text and
	 * are not replaced (their values may be long), and their HTML is not
	 * parsed, its text is what is not in a tag.
	 */
	EditorUi.prototype.hasUsedShapeLabel = function(cell)
	{
		var graph = this.editor.graph;
		var style = graph.getCurrentCellStyle(cell);
		var hidden = graph.view.getState(cell) == null;
		var label = null;

		if (!hidden || !graph.isReplacePlaceholders(cell))
		{
			label = graph.getLabel(cell);
		}
		else if (!mxUtils.getValue(style, mxConstants.STYLE_NOLABEL, false))
		{
			label = cell.getAttribute('placeholder') || cell.getAttribute('label');
		}

		label = (label != null) ? String(label) : '';

		if (mxUtils.trim(label).length == 0 || parseFloat(mxUtils.getValue(
			style, mxConstants.STYLE_TEXT_OPACITY, 100)) == 0)
		{
			return false;
		}
		else if (graph.isHtmlLabel(cell) && /[<&]/.test(label))
		{
			if (/<img[\s>]/i.test(label))
			{
				return true;
			}

			var text = (!hidden) ? graph.getPlainLabel(cell) : label.split('<').map(function(part, i)
			{
				return (i == 0) ? part : part.substring(part.indexOf('>') + 1);
			}).join('').replace(/&nbsp;/g, ' ');

			return mxUtils.trim(text).length > 0;
		}

		return true;
	};

	/**
	 * Returns the label of the entry of the given shape that shows only its
	 * label: its label if it is text of one line of at most
	 * usedShapesMaxLabelLength characters, without markup and entities in
	 * HTML and without placeholders, else Text. The labels of the entries are
	 * text, so the palette shows no markup of the diagram.
	 */
	EditorUi.prototype.getUsedShapeLabel = function(cell)
	{
		var graph = this.editor.graph;
		var value = graph.model.getValue(cell);

		if (typeof value === 'string' && mxUtils.trim(value).length > 0 &&
			value.length <= EditorUi.usedShapesMaxLabelLength && !/[\r\n]/.test(value) &&
			!(graph.isHtmlLabel(cell) && /[<&]/.test(value)) && !(value.indexOf('%') >= 0 &&
			mxUtils.getValue(graph.getCurrentCellStyle(cell), 'placeholders', '0') == '1'))
		{
			return value;
		}

		return mxResources.get('text');
	};

	/**
	 * Returns the kinds of shapes and connectors of the current page
	 * (getUsedShapeKind) as {key, style, cell, count, looks, index, edge,
	 * label}: the style is the look that the kind uses most (the first of the
	 * looks that are used as often), the cell the first cell with that look,
	 * count the cells of the kind, looks the number of its looks and label
	 * the label of the entry if its look shows only its label
	 * (getUsedShapeLabel), else null. A look of shapes that show only their
	 * label (isUsedShapeLabelOnly) counts only if one of its cells has a
	 * label to show (hasUsedShapeLabel), the first of them is its cell, and a
	 * kind without a look that counts has no entry. Shapes first, then
	 * connectors, each in the order in which the kinds appear. Like the styles
	 * of the shape picker (getUsedShapeStyles), the cells of tables, rows and
	 * stacks and cells with part=1 are parts of their parent, and so are the
	 * labels of connectors; groups, ties and cells with a relative geometry
	 * are no entries. If there are more than max, the kinds used most often
	 * are returned (the ones first in the page if they are used as often), in
	 * the order of the page, so the list does not jump while one draws; a max
	 * that is not a number above 0 is no limit.
	 */
	EditorUi.prototype.getUsedShapes = function(max)
	{
		var graph = this.editor.graph;
		var model = graph.model;
		var byKey = [new Map(), new Map()];
		var parts = new Map();
		var result = [];
		var queue = [model.getRoot()];

		// The keys of the styles of the previous walk are kept for this one
		this.usedShapesKeysPrev = this.usedShapesKeys;
		this.usedShapesKeys = null;

		var isPart = function(cell, style)
		{
			if (!parts.has(style))
			{
				parts.set(style, mxUtils.getValue(graph.getCurrentCellStyle(cell), 'part', '0') == '1');
			}

			return parts.get(style);
		};

		for (var i = 0; i < queue.length; i++)
		{
			var parent = queue[i];
			var childCount = model.getChildCount(parent);
			var inParts = childCount > 0 && model.isVertex(parent) && (graph.isStack(parent) ||
				graph.isTable(parent) || graph.isTableRow(parent));

			for (var j = 0; j < childCount; j++)
			{
				var child = model.getChildAt(parent, j);
				var edge = model.isEdge(child);
				var style = model.getStyle(child);
				style = (style == null) ? '' : style;

				if (typeof style === 'string' && (edge || (model.isVertex(child) && !inParts)))
				{
					var geo = model.getGeometry(child);

					if (geo != null && (edge || (!geo.relative && !isPart(child, style))))
					{
						var entry = this.getUsedShapeKey(style, edge);

						// Shapes that show only their label, by the style of the
						// entry without the data of a cell (as the entry shows
						// it): the result is cached by style string for this and
						// the next walk, so it must not depend on the first cell
						// (placeholders, rules; review of #1394)
						if (entry != null && !edge && entry.labelOnly == null)
						{
							entry.labelOnly = this.isUsedShapeLabelOnly(graph.stylesheet.getCellStyle(
								entry.style, graph.stylesheet.getDefaultVertexStyle()));
						}

						if (entry != null)
						{
							var labelOnly = !edge && entry.labelOnly;
							var items = byKey[(edge) ? 1 : 0];
							var item = items.get(entry.key);

							if (item == null)
							{
								item = {key: ((edge) ? 'e:' : 'v:') + entry.key, style: entry.style,
									cell: child, count: 0, looks: new Map(),
									index: result.length, edge: edge};
								items.set(entry.key, item);
								result.push(item);
							}

							var look = item.looks.get(entry.look);

							if (look == null)
							{
								look = {style: entry.style, cell: child, count: 0, labelOnly: labelOnly,
									shown: !labelOnly || this.hasUsedShapeLabel(child)};
								item.looks.set(entry.look, look);
							}
							else if (!look.shown && this.hasUsedShapeLabel(child))
							{
								look.cell = child;
								look.shown = true;
							}

							item.count++;
							look.count++;
						}
					}
				}

				// The labels of connectors are parts of the connector
				if (!edge)
				{
					queue.push(child);
				}
			}
		}

		this.usedShapesKeysPrev = null;

		// The look used most, the first in the page of the looks used as often
		// (the map keeps the order in which the looks appear), of the looks
		// that show something; kinds that show nothing have no entry
		var shown = [];

		for (var i = 0; i < result.length; i++)
		{
			var item = result[i];
			var best = null;

			item.looks.forEach(function(look)
			{
				if (look.shown && (best == null || look.count > best.count))
				{
					best = look;
				}
			});

			if (best != null)
			{
				item.style = best.style;
				item.cell = best.cell;
				item.label = (best.labelOnly) ? this.getUsedShapeLabel(best.cell) : null;
				item.looks = item.looks.size;
				shown.push(item);
			}
		}

		result = shown;

		if (max > 0 && result.length > max)
		{
			result.sort(function(a, b)
			{
				return (b.count - a.count) || (a.index - b.index);
			});

			result.length = max;
		}

		result.sort(function(a, b)
		{
			return ((a.edge ? 1 : 0) - (b.edge ? 1 : 0)) || (a.index - b.index);
		});

		return result;
	};

	/**
	 * Calls fn(part, target) for the parts of the given cell that an entry
	 * copies, in the order of the cells and before their own parts: all
	 * vertices in tables, rows and stacks and the vertices with part=1 in
	 * other cells. The value that fn returns is the target of the parts of
	 * the part.
	 */
	EditorUi.prototype.visitUsedShapeParts = function(source, target, fn)
	{
		var graph = this.editor.graph;
		var model = graph.model;
		var childCount = model.getChildCount(source);
		var all = childCount > 0 && (graph.isStack(source) || graph.isTable(source) ||
			graph.isTableRow(source));

		for (var i = 0; i < childCount; i++)
		{
			var child = model.getChildAt(source, i);

			if (model.isVertex(child) && (all || mxUtils.getValue(
				graph.getCurrentCellStyle(child), 'part', '0') == '1'))
			{
				this.visitUsedShapeParts(child, fn(child, target), fn);
			}
		}
	};

	/**
	 * Returns the key of the item of the given shape of getUsedShapes:
	 * everything that its cell (createUsedShapeCell) copies, that is the kind,
	 * the style of its look, the size, the label and the styles and geometries
	 * of the parts. Adds the IDs of the cell (1) and of its parts (2) to the
	 * given map of the cells whose geometries matter (isUsedShapesChange).
	 */
	EditorUi.prototype.getUsedShapeItemKey = function(shape, cells)
	{
		if (shape.edge)
		{
			return shape.key + '\n' + shape.style;
		}

		var model = this.editor.graph.model;
		var geo = model.getGeometry(shape.cell);
		var key = [shape.key, shape.style, geo.width + 'x' + geo.height,
			(shape.label != null) ? 'label:' + shape.label : ''];
		cells[shape.cell.id] = 1;

		// The depths in this order give the tree of the parts, the lengths of
		// the styles end them
		this.visitUsedShapeParts(shape.cell, 0, function(part, depth)
		{
			var g = model.getGeometry(part);
			var style = model.getStyle(part);
			style = (typeof style === 'string') ? style : '';
			cells[part.id] = 2;
			key.push(depth + ',' + ((g != null) ? g.x + ',' + g.y + ',' + g.width + ',' +
				g.height + ',' + ((g.relative) ? 1 : 0) + ',' + ((g.offset != null) ?
				g.offset.x + ',' + g.offset.y : '') : '') + ',' + style.length + ':' + style);

			return depth + 1;
		});

		return key.join('\n');
	};

	/**
	 * Returns the cell of the entry for the given shape of getUsedShapes: a
	 * copy of its cell at 0, 0 with its parts, shown and without labels (a
	 * shape that shows only its label gets the label of the shape, see
	 * getUsedShapeLabel, another text the label Text), or a connector of 50 x
	 * 50 with its style.
	 */
	EditorUi.prototype.createUsedShapeCell = function(shape)
	{
		var graph = this.editor.graph;
		var model = graph.model;

		if (shape.edge)
		{
			var edge = new mxCell('', new mxGeometry(0, 0, 50, 50), shape.style);
			edge.geometry.setTerminalPoint(new mxPoint(0, 50), true);
			edge.geometry.setTerminalPoint(new mxPoint(50, 0), false);
			edge.geometry.relative = true;
			edge.edge = true;

			return edge;
		}

		var cell = model.cloneCell(shape.cell, false);
		cell.style = shape.style;
		cell.value = (shape.label != null) ? shape.label :
			((graph.getCellTypeName(shape.cell) == mxResources.get('text')) ?
			mxResources.get('text') : '');
		cell.geometry.x = 0;
		cell.geometry.y = 0;

		// The cell of a look may be hidden (visible="0" in the file, below a
		// collapsed node of a tree), the entry and its copies are shown; its
		// parts keep their states, as the diagram shows them in a shown cell
		cell.visible = true;

		this.visitUsedShapeParts(shape.cell, cell, function(part, target)
		{
			var clone = model.cloneCell(part, false);
			clone.value = '';
			target.insert(clone);

			return clone;
		});

		return cell;
	};

	/**
	 * Returns the element that a page without shapes shows.
	 */
	EditorUi.prototype.createUsedShapesEmpty = function()
	{
		var empty = document.createElement('div');
		empty.className = 'geUsedShapesEmpty';
		mxUtils.write(empty, mxResources.get('noShapes'));

		return empty;
	};

	/**
	 * Updates the entries of the library if it is expanded and the shapes are
	 * shown, else marks it to be updated when it is shown.
	 */
	EditorUi.prototype.updateUsedShapes = function()
	{
		var sb = this.sidebar;
		var elts = (sb != null) ? sb.palettes[EditorUi.usedShapesId] : null;
		var content = (elts != null) ? elts[1].firstChild : null;

		if (content == null)
		{
			return;
		}
		else if (content.style.display == 'none' || !this.isUsedShapesShown())
		{
			this.usedShapesDirty = true;

			return;
		}

		this.usedShapesDirty = false;

		var update = mxUtils.bind(this, function()
		{
			this.updateUsedShapeItems(content);
		});

		// Creating an entry changes the styles of its cells (the default styles,
		// one edit for each flipped shape) before they are in the graph of the
		// sidebar, so its view and its layouts need no events
		var model = sb.graph.model;
		var events = model.isEventsEnabled();
		model.setEventsEnabled(false);

		try
		{
			runWithCaches(this.editor.graph, function()
			{
				runWithCaches(sb.graph, update);
			});
		}
		finally
		{
			model.setEventsEnabled(events);
		}
	};

	/**
	 * Updates the entries in the given content of the palette. The palette is
	 * rebuilt if the list changed: entries that stay keep their element.
	 */
	EditorUi.prototype.updateUsedShapeItems = function(content)
	{
		var sb = this.sidebar;
		var graph = this.editor.graph;
		var shapes = this.getUsedShapes(EditorUi.usedShapesMax);
		var keys = [];
		var cells = Object.create(null);

		for (var i = 0; i < shapes.length; i++)
		{
			shapes[i].itemKey = this.getUsedShapeItemKey(shapes[i], cells);
			keys.push(shapes[i].itemKey);
		}

		var signature = keys.join('\n\n');
		this.usedShapesCells = cells;

		if (signature == this.usedShapesSignature && content.firstChild != null)
		{
			return;
		}

		this.usedShapesSignature = signature;
		var items = this.usedShapesItems || Object.create(null);
		var next = Object.create(null);
		content.textContent = '';

		for (var i = 0; i < shapes.length; i++)
		{
			var item = items[shapes[i].itemKey];

			if (item == null)
			{
				var cell = this.createUsedShapeCell(shapes[i]);
				var title = graph.getCellTypeName(shapes[i].cell);
				var geo = cell.geometry;

				// Marks the cells of the entry, so the copies that the item
				// inserts keep their styles (pasteNewCellStyles)
				var all = sb.graph.model.getDescendants(cell);

				for (var j = 0; j < all.length; j++)
				{
					all[j].usedShapeCopy = EditorUi.usedShapeCopy;
				}

				var elt = (shapes[i].edge) ?
					sb.createEdgeTemplateFromCells([cell], geo.width, geo.height, title, true, true) :
					sb.createVertexTemplateFromCells([cell], geo.width, geo.height, title, true, true, true);
				item = {elt: elt, cell: cell};
			}

			next[shapes[i].itemKey] = item;
			content.appendChild(item.elt);
		}

		// Elements that are no longer used are not drawn
		for (var key in items)
		{
			if (next[key] == null)
			{
				sb.unobserveElements(items[key].elt);
			}
		}

		this.usedShapesItems = next;

		if (shapes.length == 0)
		{
			content.appendChild(this.createUsedShapesEmpty());
		}
	};

	/**
	 * Adds the library after the start of the editor and follows the theme
	 * and the visibility of the shapes.
	 */
	var editorUiInit = EditorUi.prototype.init;

	EditorUi.prototype.init = function()
	{
		editorUiInit.apply(this, arguments);

		var update = mxUtils.bind(this, function()
		{
			if (this.usedShapesDirty)
			{
				this.updateUsedShapes();
			}
		});

		// A list marked to be updated is updated when the shapes are shown,
		// also by dragging the divider of the sidebar
		this.addListener('sidebarWidthChanged', update);
		this.addListener('shapesPanelChanged', update);

		this.addListener('currentThemeChanged', mxUtils.bind(this, function()
		{
			this.syncUsedShapes();
		}));

		this.syncUsedShapes();
	};

	/**
	 * A list marked to be updated is updated when the shapes are shown.
	 */
	var editorUiToggleShapesPanel = EditorUi.prototype.toggleShapesPanel;

	EditorUi.prototype.toggleShapesPanel = function(visible)
	{
		var result = editorUiToggleShapesPanel.apply(this, arguments);

		if (visible && this.usedShapesDirty)
		{
			this.updateUsedShapes();
		}

		return result;
	};

	/**
	 * A list marked to be updated is updated when the shapes window of Sketch
	 * is shown (Minimal.js does the same for the window and the panel of
	 * Minimal).
	 */
	var editorUiCreateShapesWindow = EditorUi.prototype.createShapesWindow;

	if (typeof editorUiCreateShapesWindow === 'function')
	{
		EditorUi.prototype.createShapesWindow = function()
		{
			var wnd = this.sidebarWindow;
			var result = editorUiCreateShapesWindow.apply(this, arguments);

			if (this.sidebarWindow != null && this.sidebarWindow != wnd)
			{
				this.sidebarWindow.window.addListener(mxEvent.SHOW, mxUtils.bind(this, function()
				{
					if (this.usedShapesDirty)
					{
						this.updateUsedShapes();
					}
				}));
			}

			return result;
		};
	}

	/**
	 * Returns a copy of the given cell with at most the given number of its
	 * descendants, the first ones level by level, so that all rows of a table
	 * and all lanes come before their cells.
	 */
	var copyParts = function(model, cell, max)
	{
		var sources = [cell];
		var clones = [model.cloneCell(cell, false)];

		for (var i = 0; i < sources.length; i++)
		{
			var childCount = model.getChildCount(sources[i]);

			for (var j = 0; j < childCount && sources.length <= max; j++)
			{
				var child = model.getChildAt(sources[i], j);
				var clone = model.cloneCell(child, false);
				clones[i].insert(clone);
				sources.push(child);
				clones.push(clone);
			}
		}

		return clones[0];
	};

	/**
	 * The thumbnails of the entries show the cells as they are in the diagram:
	 * the layouts in the styles of containers (stacks, tables or a list of
	 * layouts) have run there and do not run again, as eg. a stack resolves its
	 * style for each of its parts, and only the first parts of large tables and
	 * stacks are drawn.
	 */
	var sidebarCreateThumb = Sidebar.prototype.createThumb;

	Sidebar.prototype.createThumb = function(cells)
	{
		var args = Array.prototype.slice.call(arguments);
		var cell = (cells != null) ? cells[0] : null;

		if (cell == null || cell.usedShapeCopy !== EditorUi.usedShapeCopy)
		{
			return sidebarCreateThumb.apply(this, args);
		}

		// The entries have one cell
		var model = this.graph.model;
		var manager = this.graph.layoutManager;
		var max = EditorUi.usedShapesMaxThumbParts;

		if (model.getDescendants(cell).length - 1 > max)
		{
			args[0] = [copyParts(model, cell, max)];
		}

		// The events are off if the thumbnail is drawn while its entry is
		// created, in browsers without IntersectionObserver
		var events = model.isEventsEnabled();
		var layouts = manager.isEnabled();
		model.setEventsEnabled(true);
		manager.setEnabled(false);

		try
		{
			return sidebarCreateThumb.apply(this, args);
		}
		finally
		{
			manager.setEnabled(layouts);
			model.setEventsEnabled(events);
		}
	};

	/**
	 * A list marked to be updated is updated when the library is expanded.
	 */
	var sidebarSetContentVisible = Sidebar.prototype.setContentVisible;

	Sidebar.prototype.setContentVisible = function(content, visible)
	{
		sidebarSetContentVisible.apply(this, arguments);

		if (visible && content != null && content._paletteId == EditorUi.usedShapesId &&
			this.editorUi != null && this.editorUi.usedShapesDirty)
		{
			this.editorUi.updateUsedShapes();
		}
	};

	/**
	 * A saved order of the palettes (dragged titles) and the default order of
	 * Reset move the palettes that they list to the end. The library is not
	 * in them unless its title was dragged, so it is placed again after the
	 * search, the scratchpad and the libraries of files.
	 */
	var placeAfterPaletteOrder = function(sidebar, order)
	{
		var ui = sidebar.editorUi;

		// The constructor of the sidebar applies the order before it is the
		// sidebar of the editor
		if (ui != null && ui.sidebar == sidebar && typeof ui.placeUsedShapes === 'function' &&
			order != null && order.length > 0 && mxUtils.indexOf(order, EditorUi.usedShapesId) < 0)
		{
			ui.placeUsedShapes();
		}
	};

	var sidebarApplyPaletteOrder = Sidebar.prototype.applyPaletteOrder;

	if (typeof sidebarApplyPaletteOrder === 'function')
	{
		Sidebar.prototype.applyPaletteOrder = function()
		{
			var result = sidebarApplyPaletteOrder.apply(this, arguments);
			placeAfterPaletteOrder(this, (typeof mxSettings !== 'undefined') ?
				mxSettings.getLibraryOrder() : null);

			return result;
		};
	}

	var sidebarResetPaletteOrder = Sidebar.prototype.resetPaletteOrder;

	if (typeof sidebarResetPaletteOrder === 'function')
	{
		Sidebar.prototype.resetPaletteOrder = function()
		{
			var result = sidebarResetPaletteOrder.apply(this, arguments);
			placeAfterPaletteOrder(this, this.defaultPaletteOrder);

			return result;
		};
	}

	/**
	 * A refresh of the sidebar (language, names of the shapes) builds the
	 * palettes again, and the library with them if it is on.
	 */
	var sidebarRefresh = Sidebar.prototype.refresh;

	Sidebar.prototype.refresh = function()
	{
		var result = sidebarRefresh.apply(this, arguments);
		var ui = this.editorUi;

		if (ui != null && ui.sidebar == this && typeof ui.syncUsedShapes === 'function')
		{
			ui.syncUsedShapes();
		}

		return result;
	};

	/**
	 * The entry of the library in More Shapes (Simple, after the search and
	 * the scratchpad).
	 */
	var sidebarUpdateEntries = Sidebar.prototype.updateEntries;

	Sidebar.prototype.updateEntries = function()
	{
		var result = sidebarUpdateEntries.apply(this, arguments);
		var ui = this.editorUi;

		if (ui != null && typeof ui.isUsedShapesListed === 'function' && ui.isUsedShapesListed() &&
			this.entries != null && this.entries.length > 0 && this.entries[0].entries != null)
		{
			var entries = this.entries[0].entries;
			var index = -1;

			for (var i = 0; i < entries.length; i++)
			{
				if (entries[i].id == EditorUi.usedShapesId)
				{
					return result;
				}
				else if (entries[i].id == 'search' || entries[i].id == '.scratchpad')
				{
					index = i;
				}
			}

			entries.splice(index + 1, 0, {title: mxResources.get('inThisDiagram'), id: EditorUi.usedShapesId});
		}

		return result;
	};

	var sidebarIsEntryVisible = Sidebar.prototype.isEntryVisible;

	Sidebar.prototype.isEntryVisible = function(key)
	{
		if (key == EditorUi.usedShapesId)
		{
			return this.palettes[key] != null;
		}

		return sidebarIsEntryVisible.apply(this, arguments);
	};
})();
