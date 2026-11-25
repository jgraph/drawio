/**
 * Copyright (c) 2006-2026, JGraph Holdings Ltd
 * Copyright (c) 2006-2026, draw.io AG
 */
/**
 * Side panel of Tidy up and Style My Diagram, a sibling of the Choose
 * Layout panel of the concept study: a card in the place of the Format panel
 * with the title and the counts of the scope, what Style does (Classic and
 * Simple), a hint, the alternatives as large pictures of the user's diagram
 * in two columns (the best one is Suggested; in the colors of dark mode in
 * dark mode; palettes that change the page like another one have no tile),
 * and at the bottom Direction
 * (Automatic, Down, Right), Spacing (Compact, Normal, Airy) and Keep my
 * arrangement for Tidy up, Keep my colors for Style, Undo and Done. No text
 * input.
 *
 * The tiles follow the one model of the tiles (driver, 21 November 2026, as
 * the theme tiles of Fusion and Arrange my diagram): opening applies
 * nothing (only a click on the tile Tidy up of Arrange my diagram, which
 * opens the panel with applyBest, applies the best result, and gives it
 * Back before the title, see back), hovering a
 * picture or focusing it with the keyboard previews it on the canvas
 * without changing the model (Graph.previewGeometries), a click, Enter or
 * Space applies it at once as one undoable edit with the undo toast, and
 * another tile replaces it while it is the last edit. There is no chosen
 * tile. A choice of the options runs again and applies again what was
 * applied, Done closes and keeps the result and Undo reverts it. On touch
 * each tile has an eye that previews. The panel closes when the diagram
 * changes otherwise, as the alternatives were computed for the diagram
 * before the result.
 *
 * In Simple Modern Style shows the themes (Calm, Bold, Mono, Sketch) as
 * swatches with the Current badge and applies one only when it is picked,
 * and previews show the preview bar of the shell (Apply, Escape), see
 * EditorUi.showSimplePreviewBar in SimpleHosts.js.
 *
 * In extensions.min.js (see EditorUi.loadTidy).
 */
var TidyWindow = function(ui, mode, cells, options)
{
	this.ui = ui;
	this.mode = mode;
	this.cells = cells;

	// The selection when the panel opens, which may differ from the cells
	// (eg. the scope of Arrange my diagram: a group selects its children,
	// one shape is the page), see restoreSelection
	this.selection = ui.editor.graph.getSelectionCells();
	this.themes = mode == 'style' && Tidy.getThemes() != null;

	this.options = TidyWindow.getDefaultOptions(mode, this.themes);

	// The click on the tile Tidy up of Arrange my diagram applies the best
	// result when the panel opens (see getInitialIndex)
	this.applyBest = options != null && options.applyBest === true;

	// The way back to the tiles of Arrange my diagram, whose tile Tidy up
	// opens the panel in their place ({label, fn}, see createTidyLayoutEntry
	// in TidyActions.js): Back before the title and Escape (see goBack)
	this.back = (options != null && options.back != null &&
		typeof options.back.fn === 'function') ? options.back : null;
	this.touch =typeof ui.isCoarsePointer === 'function' && ui.isCoarsePointer();

	// The given options replace the defaults of the same keys (eg. the
	// spacing of Arrange my diagram), other keys are ignored
	if (options != null)
	{
		for (var key in this.options)
		{
			if (Object.prototype.hasOwnProperty.call(options, key) && options[key] != null)
			{
				this.options[key] = options[key];
			}
		}
	}
	this.analysis = null;
	this.current = -1;
	this.edit = null;
	this.bestNothing = false;
	this.applying = false;
	this.base = null;
	this.styleBase = null;
	this.previewCells = null;
	this.previewStyleCells = null;
	this.analyzer = null;
	this.analysisHandle = null;
	this.runs = 0;
	this.init();
};

/**
 * Width and distance of the panel from the edges of the diagram.
 */
TidyWindow.prototype.width = 440;
TidyWindow.prototype.margin = 12;

/**
 * Most cells that a hover preview repaints.
 */
TidyWindow.prototype.maxPreviewCells = 2000;

/**
 * Counter for the IDs of the titles.
 */
TidyWindow.counter = 0;

/**
 * Most cells of a page that is analysed for Tidy up in idle time (see
 * prefetch).
 */
TidyWindow.maxPrefetchCells = 100;

/**
 * Least milliseconds between the starts of analyses in idle time.
 */
TidyWindow.prefetchInterval = 1000;

/**
 * Runs the given function when the browser is idle (or after a timeout
 * without requestIdleCallback) and returns {cancel}.
 */
TidyWindow.requestIdle = function(fn, delay)
{
	var id = null;
	var idle = false;

	if (delay > 0)
	{
		var handle = {cancel: function()
		{
			window.clearTimeout(id);

			if (handle.next != null)
			{
				handle.next.cancel();
			}
		}};

		id = window.setTimeout(function()
		{
			handle.next = TidyWindow.requestIdle(fn);
		}, delay);

		return handle;
	}
	else if (typeof window.requestIdleCallback === 'function')
	{
		idle = true;
		id = window.requestIdleCallback(fn, {timeout: 300});
	}
	else
	{
		id = window.setTimeout(fn, 0);
	}

	return {cancel: function()
	{
		if (idle)
		{
			window.cancelIdleCallback(id);
		}
		else
		{
			window.clearTimeout(id);
		}
	}};
};

/**
 * Returns the state of the editor that an analysis of the page depends on:
 * the version of the model (changes, pages and files, see installPrefetch),
 * the layer, the grid, the hidden tags and the colors of the graph.
 */
TidyWindow.getPrefetchKey = function(ui)
{
	var graph = ui.editor.graph;
	var parent = graph.getDefaultParent();

	return [ui.tidyModelVersion, (ui.currentPage != null) ? ui.currentPage.getId() : '',
		(parent != null) ? parent.id : '', graph.gridSize, JSON.stringify(graph.hiddenTags || null),
		graph.shapeBackgroundColor, graph.shapeForegroundColor, graph.background,
		(typeof Editor.isDarkMode === 'function' && Editor.isDarkMode()) ? 1 : 0].join('|');
};

/**
 * Counts the changes of the model, the pages and the files of the given
 * editor UI and stops the analysis in idle time when they change.
 */
TidyWindow.installPrefetch = function(ui)
{
	if (ui.tidyModelVersion == null)
	{
		ui.tidyModelVersion = 0;

		var changed = function()
		{
			ui.tidyModelVersion++;
			TidyWindow.cancelPrefetch(ui);
		};

		ui.editor.graph.model.addListener(mxEvent.CHANGE, changed);
		ui.editor.addListener('pageSelected', changed);
		ui.editor.addListener('fileLoaded', changed);
	}
};

/**
 * Analyses the page of the given editor UI for Tidy up in steps while the
 * browser is idle, so that the panel opens at once if it is used before the
 * page changes (see takePrefetch; the response budget of panels is 100 ms).
 * Only pages with at most maxPrefetchCells cells, at most one start per
 * prefetchInterval and none while a panel of Tidy up or Style is open.
 */
TidyWindow.prefetch = function(ui)
{
	TidyWindow.installPrefetch(ui);
	var key = TidyWindow.getPrefetchKey(ui);

	if (ui.tidyPrefetch != null && ui.tidyPrefetch.key == key)
	{
		return;
	}

	TidyWindow.cancelPrefetch(ui);
	var count = 0;

	for (var id in ui.editor.graph.model.cells)
	{
		if (++count > TidyWindow.maxPrefetchCells)
		{
			return;
		}
	}

	if (ui.tidyWindow != null || count < 3)
	{
		return;
	}

	var prefetch = {key: key, analysis: null, handle: null};
	ui.tidyPrefetch = prefetch;

	var next = function()
	{
		prefetch.handle = null;

		if (ui.tidyPrefetch != prefetch || prefetch.failed)
		{
			return;
		}
		else if (ui.tidyWindow != null || TidyWindow.getPrefetchKey(ui) != key)
		{
			TidyWindow.cancelPrefetch(ui);

			return;
		}

		try
		{
			if (prefetch.analysis == null)
			{
				ui.tidyPrefetchStart = Date.now();
				prefetch.analysis = new Tidy.Analysis(ui, null,
					TidyWindow.getDefaultOptions('tidy'), false);
			}
			else
			{
				prefetch.analysis.step();
			}
		}
		catch (e)
		{
			// The panel analyses again and shows the error
			if (prefetch.analysis != null)
			{
				prefetch.analysis.destroy();
				prefetch.analysis = null;
			}

			prefetch.failed = true;

			return;
		}

		if (!prefetch.analysis.isComplete())
		{
			prefetch.handle = TidyWindow.requestIdle(next);
		}
	};

	prefetch.handle = TidyWindow.requestIdle(next, (ui.tidyPrefetchStart || 0) +
		TidyWindow.prefetchInterval - Date.now());
};

/**
 * Stops and removes the analysis in idle time of the given editor UI.
 */
TidyWindow.cancelPrefetch = function(ui)
{
	var prefetch = ui.tidyPrefetch;

	if (prefetch != null)
	{
		ui.tidyPrefetch = null;

		if (prefetch.handle != null)
		{
			prefetch.handle.cancel();
			prefetch.handle = null;
		}

		if (prefetch.analysis != null)
		{
			prefetch.analysis.destroy();
			prefetch.analysis = null;
		}
	}
};

/**
 * Returns the analysis that ran in idle time (complete or not) if it is for
 * the given mode, cells and options and the page did not change, and
 * removes it, else null.
 */
TidyWindow.takePrefetch = function(ui, mode, cells, options)
{
	var prefetch = ui.tidyPrefetch;
	var defaults = TidyWindow.getDefaultOptions('tidy');

	if (prefetch != null && prefetch.analysis != null && mode != 'style' &&
		(cells == null || cells.length == 0) && options != null &&
		options.direction == defaults.direction && options.spacing == defaults.spacing &&
		options.keep == defaults.keep && prefetch.key == TidyWindow.getPrefetchKey(ui))
	{
		var analysis = prefetch.analysis;
		prefetch.analysis = null;
		TidyWindow.cancelPrefetch(ui);

		return analysis;
	}

	return null;
};

/**
 * Returns the options of a new panel of the given mode (tidy or style) with
 * or without themes.
 */
TidyWindow.getDefaultOptions = function(mode, themes)
{
	// Style colors every shape by default, with the palettes of Classic and
	// Simple as with the themes of Fusion and its section Automatic (the
	// driver, 17 November 2026: "das sollte defaultmäßig aus sein")
	return (mode == 'style') ? {keepColors: false} :
		{direction: 'auto', spacing: 'normal', keep: false};
};

/**
 * Shows the panel for the given mode (tidy or style) on the given cells (null
 * for the page) or, if cells is undefined, the selection or the page of the
 * given editor UI with the given options (see the constructor). Nothing is
 * applied unless the options have applyBest (the tile Tidy up of Arrange my
 * diagram), which applies the best result.
 */
TidyWindow.show = function(ui, mode, cells, options)
{
	var graph = ui.editor.graph;

	if (ui.tidyWindow != null)
	{
		ui.tidyWindow.destroy();
	}

	if (cells === undefined)
	{
		cells = (graph.isSelectionEmpty()) ? null : graph.getSelectionCells();
	}

	ui.tidyWindow = new TidyWindow(ui, mode, cells, options);
	ui.tidyWindow.run();
};

/**
 * Creates the panel.
 */
TidyWindow.prototype.init = function()
{
	var ui = this.ui;
	var graph = ui.editor.graph;
	var style = this.mode == 'style';
	var panel = document.createElement('div');
	panel.className = 'geTidyPanel';
	panel.setAttribute('role', 'dialog');
	this.container = panel;

	// The panel is in the document, not in the editor, so it follows the
	// color scheme of the editor explicitly, and so do the pictures of the
	// tiles (see updateThumbnail)
	this.updateColorScheme = mxUtils.bind(this, function()
	{
		panel.style.colorScheme = (this.isDarkMode()) ? 'dark' : 'light';

		if (this.thumbs != null)
		{
			var thumbs = this.thumbs.querySelectorAll('.geTidyTileThumb');

			for (var i = 0; i < thumbs.length; i++)
			{
				this.updateThumbnail(thumbs[i]);
			}
		}
	});

	this.updateColorScheme();
	ui.addListener('darkModeChanged', this.updateColorScheme);

	var header = document.createElement('div');
	header.className = 'geTidyPanelHeader';
	panel.appendChild(header);

	// Back to the tiles of Arrange my diagram before the title, named after
	// the place it returns to, as Back of the hosts of Fusion that another
	// host showed (driver, 23 November 2026: "wenn geklickt gibt es kein
	// Back zum vorherigen screen")
	if (this.back != null)
	{
		var backLabel = this.back.label || mxResources.get('back');
		var back = document.createElement('button');
		back.setAttribute('type', 'button');
		back.className = 'geTidyPanelBack';
		back.setAttribute('title', backLabel);
		back.setAttribute('aria-label', backLabel);
		back.appendChild(TidyWindow.createBackIcon());
		header.appendChild(back);

		mxEvent.addListener(back, 'click', mxUtils.bind(this, function()
		{
			this.goBack();
		}));
	}

	var title = document.createElement('div');
	title.className = 'geTidyPanelTitle';
	title.setAttribute('id', 'geTidyPanelTitle' + (++TidyWindow.counter));
	mxUtils.write(title, mxResources.get((style) ? 'styleMyDiagram' : 'tidyUp'));
	header.appendChild(title);
	panel.setAttribute('aria-labelledby', title.getAttribute('id'));

	this.count = document.createElement('div');
	this.count.className = 'geTidyPanelCount';
	header.appendChild(this.count);

	var close = document.createElement('button');
	close.className = 'geTidyPanelClose';
	close.setAttribute('title', mxResources.get('close'));
	close.setAttribute('aria-label', mxResources.get('close'));
	mxUtils.write(close, '×');
	header.appendChild(close);

	mxEvent.addListener(close, 'click', mxUtils.bind(this, function()
	{
		this.closeKeepingResult();
	}));

	// Style with the palettes of Classic and Simple says at the top what it
	// does, in the words of the tooltip of Style my diagram automatically in
	// Fusion (getSimpleAutoStyleTooltip in SimpleFormat.js), which is also
	// the description of the dialog (the driver, 17 November 2026: "bei den
	// Panels im Classic und Simple Theme könnte man das ja oben reinschreiben,
	// dass klar ist, was das macht")
	if (style && !this.themes)
	{
		var about = document.createElement('div');
		about.className = 'geTidyPanelAbout';
		about.setAttribute('id', 'geTidyPanelAbout' + TidyWindow.counter);
		mxUtils.write(about, mxResources.get('styleMyDiagramTip', null,
			'Styles the shapes: colors and one size per role (start, step, decision, ' +
			'data, note), rounded steps, one font. Also styles connectors, gives their ' +
			'labels a gap and fixes overlaps and crossings.'));
		panel.appendChild(about);
		panel.setAttribute('aria-describedby', about.getAttribute('id'));
	}

	var hint = document.createElement('div');
	hint.className = 'geTidyPanelHint';
	mxUtils.write(hint, mxResources.get((this.themes) ? 'styleThemesHint' :
		((style) ? 'styleHint' : 'tidyHint')));
	panel.appendChild(hint);
	this.hint = hint;

	this.status = document.createElement('div');
	this.status.className = 'geTidyPanelStatus';
	this.status.setAttribute('role', 'status');
	this.status.setAttribute('aria-live', 'polite');
	panel.appendChild(this.status);

	this.thumbs = document.createElement('div');
	this.thumbs.className = 'geTidyPanelTiles';
	this.thumbs.setAttribute('role', 'group');
	this.thumbs.setAttribute('aria-label', mxResources.get('alternatives'));
	panel.appendChild(this.thumbs);

	var footer = document.createElement('div');
	footer.className = 'geTidyPanelFooter';
	panel.appendChild(footer);

	if (style)
	{
		this.addToggle(footer, mxResources.get('keepMyColors'), 'keepColors');
	}
	else
	{
		this.addSegments(footer, mxResources.get('direction'), 'direction',
			[['auto', mxResources.get('automatic')], ['down', mxResources.get('down')],
			['right', mxResources.get('right')]]);
		this.addSegments(footer, mxResources.get('spacing'), 'spacing',
			[['compact', mxResources.get('compact')], ['normal', mxResources.get('normal')],
			['airy', mxResources.get('airy')]]);
		this.addToggle(footer, mxResources.get('keepMyArrangement'), 'keep');
	}

	var buttons = document.createElement('div');
	buttons.className = 'geTidyPanelButtons';
	footer.appendChild(buttons);

	this.undoButton = mxUtils.button(mxResources.get('undo'), mxUtils.bind(this, function()
	{
		this.clearPreview();

		if (this.isEditable())
		{
			this.undo();
			this.restoreSelection();
		}

		this.destroy();
	}));
	this.undoButton.className = 'geTidyButton';
	buttons.appendChild(this.undoButton);

	// Done closes the panel and keeps the result (the tiles apply at once)
	this.doneButton = mxUtils.button(mxResources.get('done'), mxUtils.bind(this, function()
	{
		this.closeKeepingResult();
	}));
	this.doneButton.className = 'geTidyButton geTidyPrimary';
	buttons.appendChild(this.doneButton);

	// Escape closes the panel and keeps the result, like Done, and goes back
	// to the tiles of Arrange my diagram, like Back, if the panel has a way
	// back (as Escape in the hosts of Fusion)
	mxEvent.addListener(panel, 'keydown', mxUtils.bind(this, function(evt)
	{
		if (evt.key == 'Escape')
		{
			if (this.back != null)
			{
				this.goBack();
			}
			else
			{
				this.closeKeepingResult();
			}

			mxEvent.consume(evt);
		}
	}));

	document.body.appendChild(panel);
	this.updatePosition();

	// The focus moves into the panel, so that keyboards and screen readers
	// reach it, and back when it closes (see cleanup)
	this.previousFocus = document.activeElement;
	panel.setAttribute('tabindex', '-1');
	panel.focus({preventScroll: true});

	this.resizeListener = mxUtils.bind(this, function()
	{
		this.updatePosition();
	});

	mxEvent.addListener(window, 'resize', this.resizeListener);

	// Changes of others end the panel: its alternatives are for the diagram
	// before the result. Edits of the history without a change of the model
	// (eg. entering or leaving a group) end it too, as its Undo would no
	// longer undo the result
	this.changeListener = mxUtils.bind(this, function()
	{
		if (!this.applying)
		{
			this.destroy();
		}
	});

	graph.model.addListener(mxEvent.CHANGE, this.changeListener);
	ui.editor.undoManager.addListener(mxEvent.ADD, this.changeListener);
	ui.editor.addListener('pageSelected', this.changeListener);
	ui.editor.addListener('fileLoaded', this.changeListener);

	// A file that is locked or read-only now takes no more edits
	this.lockedListener = mxUtils.bind(this, function()
	{
		if (!this.isEditable())
		{
			this.destroy();
		}
	});

	ui.addListener('lockedChanged', this.lockedListener);
};

/**
 * Returns true if the panel may change the diagram: the panel is open and
 * the graph is enabled, which it is not in a locked file or read-only window
 * (see EditorUi.isLocked).
 */
TidyWindow.prototype.isEditable = function()
{
	return !this.destroyed && this.ui.editor.graph.isEnabled();
};

/**
 * Places the panel at the right of the diagram, in the place of the Format
 * panel in the Simple UI.
 */
TidyWindow.prototype.updatePosition = function()
{
	var ui = this.ui;
	var panel = this.container;

	if (panel != null)
	{
		var c = ui.container.getBoundingClientRect();
		var d = ui.diagramContainer.getBoundingClientRect();
		var ih = window.innerHeight || document.documentElement.clientHeight;
		var iw = window.innerWidth || document.documentElement.clientWidth;
		var right = Math.max(0, iw - c.right) + this.margin;
		panel.style.width = Math.max(240, Math.min(this.width, c.width - 2 * this.margin)) + 'px';
		panel.style.right = right + 'px';
		panel.style.top = Math.max(0, d.top) + this.margin + 'px';
		panel.style.bottom = Math.max(0, ih - d.bottom) + this.margin + 'px';
	}
};

/**
 * Adds buttons for the values of the given option, one of them pressed.
 */
TidyWindow.prototype.addSegments = function(parent, label, key, values)
{
	var row = document.createElement('div');
	row.className = 'geTidyPanelRow';

	var name = document.createElement('div');
	name.className = 'geTidyPanelLabel';
	mxUtils.write(name, label);
	row.appendChild(name);

	var group = document.createElement('div');
	group.className = 'geTidySegments';
	group.setAttribute('role', 'group');
	group.setAttribute('aria-label', label);
	row.appendChild(group);

	var buttons = [];

	var update = mxUtils.bind(this, function()
	{
		for (var i = 0; i < buttons.length; i++)
		{
			buttons[i].setAttribute('aria-pressed', (values[i][0] == this.options[key]) ?
				'true' : 'false');
		}
	});

	for (var i = 0; i < values.length; i++)
	{
		(mxUtils.bind(this, function(value, text)
		{
			var btn = document.createElement('button');
			btn.className = 'geTidySegment';
			mxUtils.write(btn, text);

			mxEvent.addListener(btn, 'click', mxUtils.bind(this, function()
			{
				if (this.options[key] != value)
				{
					this.options[key] = value;
					update();
					this.rerun();
				}
			}));

			buttons.push(btn);
			group.appendChild(btn);
		}))(values[i][0], values[i][1]);
	}

	update();
	parent.appendChild(row);
};

/**
 * Adds a switch for the given option.
 */
TidyWindow.prototype.addToggle = function(parent, label, key)
{
	var wrapper = document.createElement('label');
	wrapper.className = 'geTidyToggle';

	var input = document.createElement('input');
	input.setAttribute('type', 'checkbox');
	input.setAttribute('role', 'switch');
	input.checked = this.options[key] !== false && this.options[key] != null;
	wrapper.appendChild(input);

	var text = document.createElement('span');
	mxUtils.write(text, label);
	wrapper.appendChild(text);

	mxEvent.addListener(input, 'change', mxUtils.bind(this, function()
	{
		this.options[key] = input.checked;
		this.rerun();
	}));

	parent.appendChild(wrapper);
};

/**
 * Returns true if the result of the panel is the last edit of the history.
 */
TidyWindow.prototype.isLastEdit = function()
{
	var um = this.ui.editor.undoManager;

	return this.edit != null && um.indexOfNextAdd > 0 &&
		um.history[um.indexOfNextAdd - 1] === this.edit;
};

/**
 * Undoes the result of the panel if it is the last edit.
 */
TidyWindow.prototype.undo = function()
{
	if (this.isLastEdit() && this.isEditable())
	{
		this.applying = true;
		try
		{
			this.ui.editor.undoManager.undo();
		}
		finally
		{
			this.applying = false;
		}
	}

	this.edit = null;
	this.current = -1;
};

/**
 * Selects the cells that were selected when the panel was opened, not the
 * analysed cells (undo selects the cells it changes).
 */
TidyWindow.prototype.restoreSelection = function()
{
	var graph = this.ui.editor.graph;
	var cells = [];

	if (this.selection != null)
	{
		for (var i = 0; i < this.selection.length; i++)
		{
			if (graph.model.contains(this.selection[i]))
			{
				cells.push(this.selection[i]);
			}
		}
	}

	graph.setSelectionCells(cells);
};

/**
 * Analyses the diagram with the current options and applies the best result.
 * An analysis of the page that ran in idle time is used if the page did not
 * change (see TidyWindow.prefetch), and themes show their swatches at once
 * while their results are computed in idle time (see completeAnalysis).
 */
TidyWindow.prototype.run = function()
{
	var ui = this.ui;
	var run = ++this.runs;
	this.clearPreview();
	this.stopAnalysis();
	this.status.innerText = '';
	mxUtils.write(this.status, mxResources.get('working') + '...');
	this.thumbs.innerText = '';
	this.container.classList.add('geTidyPanelBusy');
	var analysis = TidyWindow.takePrefetch(ui, this.mode, this.cells, this.options);
	var lazy = this.themes && this.reapply == null;

	var start = mxUtils.bind(this, function()
	{
		// Closed or started again before the timeout
		if (this.destroyed || run != this.runs)
		{
			if (analysis != null)
			{
				analysis.destroy();
			}

			return;
		}

		try
		{
			if (analysis == null)
			{
				analysis = new Tidy.Analysis(ui, this.cells, this.options, this.mode == 'style');
			}

			if (analysis.isComplete())
			{
				this.showAnalysis(analysis.result);
			}
			else
			{
				this.analyzer = analysis;

				// Nothing is applied before a theme is picked
				if (lazy)
				{
					this.showAnalysis(analysis.result);
					this.scheduleAnalysis();
				}
				else
				{
					this.scheduleAnalysis(mxUtils.bind(this, function()
					{
						this.showAnalysis(analysis.result);
					}));
				}
			}
		}
		catch (e)
		{
			this.destroy();
			ui.handleError(e);
		}
	});

	// Shows the status before the work
	if (lazy || (analysis != null && analysis.isComplete()))
	{
		start();
	}
	else
	{
		window.setTimeout(start, 20);
	}
};

/**
 * Shows the given result of Tidy.analyze or Tidy.style and applies the
 * initial result.
 */
TidyWindow.prototype.showAnalysis = function(analysis)
{
	this.analysis = analysis;
	this.container.classList.remove('geTidyPanelBusy');
	this.count.innerText = '';
	mxUtils.write(this.count, this.getCountText(analysis.before.vertices, analysis.before.edges));

	if (this.analyzer == null)
	{
		this.saveBase();
	}

	this.select(this.getInitialIndex());
};

/**
 * Runs the steps of the analysis of the panel one by one, so the page stays
 * responsive and closing the panel stops the analysis (see stopAnalysis):
 * while the browser is idle for an analysis that the panel shows already,
 * else right after each other and then done is called.
 */
TidyWindow.prototype.scheduleAnalysis = function(done)
{
	var next = mxUtils.bind(this, function()
	{
		this.analysisHandle = null;
		var analyzer = this.analyzer;

		if (analyzer != null && !this.destroyed)
		{
			try
			{
				analyzer.step();

				if (analyzer.isComplete())
				{
					this.analyzer = null;

					if (done != null)
					{
						done();
					}
					else
					{
						this.saveBase();
					}
				}
			}
			catch (e)
			{
				this.analyzer = null;
				this.destroy();
				this.ui.handleError(e);

				return;
			}

			if (this.analyzer != null)
			{
				this.scheduleAnalysis(done);
			}
		}
	});

	if (done != null)
	{
		var id = window.setTimeout(next, 0);

		this.analysisHandle = {cancel: function()
		{
			window.clearTimeout(id);
		}};
	}
	else
	{
		this.analysisHandle = TidyWindow.requestIdle(next);
	}
};

/**
 * Completes the analysis that the panel shows (the results of the themes
 * are needed for a preview or a pick). Returns false if it failed.
 */
TidyWindow.prototype.completeAnalysis = function()
{
	if (this.analyzer != null)
	{
		var analyzer = this.analyzer;
		this.analyzer = null;

		if (this.analysisHandle != null)
		{
			this.analysisHandle.cancel();
			this.analysisHandle = null;
		}

		try
		{
			analyzer.complete();
			this.saveBase();
		}
		catch (e)
		{
			this.destroy();
			this.ui.handleError(e);

			return false;
		}
	}

	return !this.destroyed;
};

/**
 * Stops the analysis that the panel shows.
 */
TidyWindow.prototype.stopAnalysis = function()
{
	if (this.analysisHandle != null)
	{
		this.analysisHandle.cancel();
		this.analysisHandle = null;
	}

	if (this.analyzer != null)
	{
		this.analyzer.destroy();
		this.analyzer = null;
	}
};

/**
 * Returns the index of the result to apply after a run: nothing (-1) when the
 * panel opens, unless it opens with applyBest; after a rerun with other
 * options that follows an applied result, the one with the ID of that result,
 * else the best result, which is -1 if every result of Tidy up scores worse
 * than the page as it is (see Tidy.analyze) or the results are themes. If the
 * best result was to be applied and there is none, bestNothing is set, so the
 * status says that there is nothing to do (see getStatus).
 */
TidyWindow.prototype.getInitialIndex = function()
{
	var results = this.analysis.results;
	var id = this.reapply;
	var best = this.applyBest || this.reapplyBest;
	this.reapply = null;
	this.reapplyBest = false;
	this.applyBest = false;
	this.bestNothing = false;

	for (var i = 0; i < results.length && id != null; i++)
	{
		if (results[i].id == id)
		{
			return i;
		}
	}

	var index = (best) ? this.getBestIndex() : -1;
	this.bestNothing = best && index < 0;

	return index;
};

/**
 * Returns the index of the best result by the metrics, which is applied
 * first, or -1 if every result is worse than the page as it is or the
 * results are themes.
 */
TidyWindow.prototype.getBestIndex = function()
{
	return (this.analysis == null || this.analysis.themes) ? -1 :
		((typeof this.analysis.best === 'number') ? this.analysis.best : 0);
};

/**
 * Keeps the geometries of the cells that the results change before the
 * first result is applied, for the hover previews.
 */
TidyWindow.prototype.saveBase = function()
{
	var graph = this.ui.editor.graph;
	var model = graph.model;
	var results = this.analysis.results;
	this.base = null;
	this.styleBase = null;

	if (this.mode == 'style')
	{
		var styles = Object.create(null);
		var count = 0;

		for (var i = 0; i < results.length; i++)
		{
			for (var j = 0; j < results[i].changes.length; j++)
			{
				var change = results[i].changes[j];
				var cell = model.getCell(change.id);

				if (change.style !== undefined && cell != null && !(change.id in styles))
				{
					styles[change.id] = model.getStyle(cell);
					count++;
				}
			}
		}

		this.styleBase = (count <= this.maxPreviewCells) ?
			{styles: styles, rules: Tidy.getStyleRulesJson(graph)} : null;
	}
	else
	{
		var base = Object.create(null);
		var count = 0;

		for (var i = 0; i < results.length; i++)
		{
			for (var j = 0; j < results[i].changes.length; j++)
			{
				var change = results[i].changes[j];
				var cell = model.getCell(change.id);

				if (change.geometry !== undefined && change.parent == null &&
					cell != null && !(change.id in base))
				{
					var geo = model.getGeometry(cell);
					base[change.id] = (geo != null) ? geo.clone() : null;
					count++;
				}
			}
		}

		this.base = (count <= this.maxPreviewCells) ? base : null;
	}
};

/**
 * Undoes the result and runs again with the current options.
 */
TidyWindow.prototype.rerun = function()
{
	this.clearPreview();

	if (!this.isEditable() || (this.edit != null && !this.isLastEdit()))
	{
		this.destroy();
	}
	else
	{
		// The result that was applied is applied again with the new options,
		// the same theme or the best result (nothing if nothing was applied).
		// A change while the run of the change before still analyzes keeps
		// what that run is to apply again: its result was undone, it is not
		// gone (Codex review of #1487). The best result that was to be
		// applied and was not there (bestNothing) is looked for again.
		if (this.edit != null)
		{
			var results = (this.analysis != null) ? this.analysis.results : [];
			this.reapply = (results[this.current] != null) ? results[this.current].id : null;
			this.reapplyBest = !this.themes;
		}
		else if (this.bestNothing)
		{
			this.reapplyBest = true;
		}

		this.undo();
		this.run();
	}
};

/**
 * Applies the result with the given index instead of the current one, with
 * the undo toast of Classic and Simple (see showUndoToast; Fusion shows its
 * own with Hold to compare, SimpleTidy.js).
 */
TidyWindow.prototype.select = function(index)
{
	var edit = this.edit;
	var result = this.doSelect(index);

	if (this.edit != null && this.edit !== edit && !this.destroyed &&
		typeof this.ui.showUndoToast === 'function' &&
		!(typeof this.ui.isSimpleToastEnabled === 'function' && this.ui.isSimpleToastEnabled()))
	{
		var applied = this.analysis.results[this.current];

		this.ui.showUndoToast((this.mode == 'style') ? mxResources.get('toastStyleAppliedName',
			[this.getName(applied)], 'Style applied: {1}') : mxResources.get('toastTidiedUp',
			null, 'Diagram tidied up'), {edits: [this.edit], selection: this.selection});
	}

	return result;
};

/**
 * Applies the result with the given index instead of the current one (see
 * select).
 */
TidyWindow.prototype.doSelect = function(index)
{
	if (index >= 0 && !this.completeAnalysis())
	{
		return;
	}

	var results = (this.analysis != null) ? this.analysis.results : [];
	this.clearPreview();

	if (!this.isEditable() || (this.edit != null && !this.isLastEdit()))
	{
		this.destroy();

		return;
	}

	this.undo();

	if (index >= 0 && index < results.length)
	{
		this.bestNothing = false;
		this.applying = true;
		try
		{
			// A theme of Style my diagram for the whole page ends the theme by
			// kind of the Diagram tab (Night gives its page back)
			this.edit = Tidy.apply(this.ui, results[index].changes, this.mode == 'style' &&
				results[index].theme != null && !this.analysis.scope);
		}
		finally
		{
			this.applying = false;
		}

		this.current = index;
	}

	this.restoreSelection();
	this.render();
};

/**
 * Shows the result with the given index on the canvas without changing the
 * model: the view paints the cells with the geometries of that result (see
 * Graph.previewGeometries) or, for Style, with its styles and rules (see
 * previewStyles) until clearPreview.
 */
TidyWindow.prototype.preview = function(index)
{
	if (!this.completeAnalysis())
	{
		return;
	}

	var graph = this.ui.editor.graph;
	var model = graph.model;
	var results = (this.analysis != null) ? this.analysis.results : [];
	this.clearPreview();

	if (this.mode == 'style')
	{
		this.previewStyles(index);
		this.showPreviewBar(index);

		return;
	}

	// Without a result (every result is worse than the page) the model is
	// the page as it is (other changes close the panel)
	if (this.base == null || index == this.current || results[index] == null ||
		(this.edit != null && !this.isLastEdit()) || typeof graph.getCellGeometry !== 'function')
	{
		return;
	}

	var geometries = Object.create(null);
	var changes = results[index].changes;

	for (var i = 0; i < changes.length; i++)
	{
		if (changes[i].geometry !== undefined && changes[i].parent == null)
		{
			geometries[changes[i].id] = changes[i].geometry;
		}
	}

	var dict = new mxDictionary();
	var cells = [];

	for (var id in this.base)
	{
		var cell = model.getCell(id);
		var geo = (id in geometries) ? geometries[id] : this.base[id];

		if (cell != null && geo != null)
		{
			dict.put(cell, geo);
			cells.push(cell);
		}
	}

	if (cells.length > 0)
	{
		this.previewCells = cells;
		this.repaint(cells, dict);
	}

	this.showPreviewBar(index);
};

/**
 * Shows the preview bar of Simple Modern (EditorUi.showSimplePreviewBar in
 * app.min.js, which an older app.min.js does not have) and marks the tile
 * if the result with the given index is shown on the canvas: Apply uses the
 * result, Escape paints the model again.
 */
TidyWindow.prototype.showPreviewBar = function(index)
{
	var results = (this.analysis != null) ? this.analysis.results : [];

	if ((this.previewCells != null || this.previewStyleCells != null) && results[index] != null)
	{
		this.previewIndex = index;
		this.updatePreviewBadge();

		if (typeof this.ui.showSimplePreviewBar === 'function')
		{
			this.ui.showSimplePreviewBar(this, this.getPreviewName(results[index]), mxUtils.bind(this, function()
			{
				if (index != this.current && !this.destroyed)
				{
					this.select(index);
				}
			}), mxUtils.bind(this, function()
			{
				this.clearPreview();
			}));
		}
	}
};

/**
 * Shows the Previewing badge on the tile whose result is on the canvas.
 */
TidyWindow.prototype.updatePreviewBadge = function()
{
	var tiles = (this.thumbs != null) ? this.thumbs.childNodes : [];

	for (var i = 0; i < tiles.length; i++)
	{
		// The index of the result of the tile (the shown results may skip some)
		var index = (tiles[i].tidyIndex != null) ? tiles[i].tidyIndex : i;
		var badge = tiles[i].querySelector('.geTidyTilePreviewing');
		var eye = tiles[i].querySelector('.geTidyTileEye');

		if (badge != null)
		{
			badge.style.display = (index == this.previewIndex) ? '' : 'none';
		}

		if (eye != null)
		{
			eye.setAttribute('aria-pressed', (index == this.previewIndex) ? 'true' : 'false');
		}
	}
};

/**
 * Paints the cells of the model again after a preview.
 */
TidyWindow.prototype.clearPreview = function()
{
	if (this.previewCells != null)
	{
		var cells = this.previewCells;
		this.previewCells = null;
		this.repaint(cells, null);
	}

	if (this.previewStyleCells != null)
	{
		var cells = this.previewStyleCells;
		this.previewStyleCells = null;
		this.repaintStyles(cells, [], undefined);
	}

	if (this.previewIndex != null)
	{
		this.previewIndex = null;
		this.updatePreviewBadge();
	}

	if (typeof this.ui.hideSimplePreviewBar === 'function')
	{
		this.ui.hideSimplePreviewBar(this);
	}
};

/**
 * Shows the styles and the rules of the Style result with the given index on
 * the canvas without changing the model. The cells that any result changes
 * get the style of this result or the style they had before the first result.
 */
TidyWindow.prototype.previewStyles = function(index)
{
	var graph = this.ui.editor.graph;
	var model = graph.model;
	var results = (this.analysis != null) ? this.analysis.results : [];

	// Tiles are previewed before one is applied (no edit yet), and after it
	// while its edit is the last one
	if (this.styleBase == null || index == this.current || results[index] == null ||
		(this.edit != null && !this.isLastEdit()))
	{
		return;
	}

	var styles = Object.create(null);
	var rules = this.styleBase.rules;
	var changes = results[index].changes;

	for (var i = 0; i < changes.length; i++)
	{
		if (changes[i].style !== undefined)
		{
			styles[changes[i].id] = changes[i].style;
		}

		if (changes[i].rules !== undefined && changes[i].id == model.getRoot().id)
		{
			rules = changes[i].rules;
		}
	}

	var entries = [];

	for (var id in this.styleBase.styles)
	{
		var cell = model.getCell(id);

		if (cell != null)
		{
			entries.push({cell: cell, style: (id in styles) ?
				styles[id] : this.styleBase.styles[id]});
		}
	}

	var cells = [];

	for (var i = 0; i < entries.length; i++)
	{
		cells.push(entries[i].cell);
	}

	// The rules change any cell, so all cells are painted again
	if (rules != Tidy.getStyleRulesJson(graph))
	{
		cells = [model.getRoot()];
	}
	else
	{
		rules = undefined;
	}

	if (entries.length > 0 || rules !== undefined)
	{
		this.previewStyleCells = cells;
		this.repaintStyles(cells, entries, rules);
	}
};

/**
 * Validates the given cells with the given styles ({cell, style}) and rules
 * of the page (undefined for those of the model). The styles and the value
 * of the root are those of the model again after the validation, so the
 * model never changes and nothing is recorded.
 */
TidyWindow.prototype.repaintStyles = function(cells, entries, rules)
{
	var graph = this.ui.editor.graph;
	var model = graph.model;
	var view = graph.view;
	var root = model.getRoot();
	var rootValue = root.value;
	var saved = [];

	try
	{
		for (var i = 0; i < entries.length; i++)
		{
			saved.push(entries[i].cell.style);
			entries[i].cell.style = entries[i].style;
		}

		if (rules !== undefined)
		{
			var value = null;

			if (rootValue != null && typeof rootValue == 'object')
			{
				value = rootValue.cloneNode(true);
			}
			else
			{
				value = mxUtils.createXmlDocument().createElement('UserObject');
				value.setAttribute('label', rootValue || '');
			}

			if (rules != null)
			{
				value.setAttribute(Graph.styleRulesAttribute, rules);
			}
			else
			{
				value.removeAttribute(Graph.styleRulesAttribute);
			}

			root.value = value;
		}

		// The view computes the styles of the given cells and their
		// descendants again (it keeps them unless invalidStyle is set)
		var stack = [];

		for (var i = 0; i < cells.length; i++)
		{
			if (model.contains(cells[i]))
			{
				view.invalidate(cells[i], true, true);
				stack.push(cells[i]);
			}
		}

		while (stack.length > 0)
		{
			var cell = stack.pop();
			var state = view.getState(cell);

			if (state != null)
			{
				state.invalidStyle = true;
			}

			for (var i = model.getChildCount(cell) - 1; i >= 0; i--)
			{
				stack.push(model.getChildAt(cell, i));
			}
		}

		view.validate();
	}
	catch (e)
	{
		// A preview never breaks the editor
	}
	finally
	{
		for (var i = 0; i < saved.length; i++)
		{
			entries[i].cell.style = saved[i];
		}

		root.value = rootValue;
	}
};

/**
 * Validates the given cells with the given preview geometries or with the
 * geometries of the model if null.
 */
TidyWindow.prototype.repaint = function(cells, dict)
{
	var graph = this.ui.editor.graph;
	var view = graph.view;
	var previous = graph.previewGeometries;

	try
	{
		for (var i = 0; i < cells.length; i++)
		{
			if (graph.model.contains(cells[i]))
			{
				view.invalidate(cells[i], true, true);
			}
		}

		graph.previewGeometries = dict;
		view.validate();
	}
	catch (e)
	{
		// A preview never breaks the editor
	}
	finally
	{
		graph.previewGeometries = previous;
	}
};

/**
 * Returns the text of the status for the current result.
 */
TidyWindow.prototype.getStatus = function()
{
	var results = (this.analysis != null) ? this.analysis.results : [];
	var result = results[this.current];

	// Nothing is applied until a tile is clicked: the status stays empty while
	// there are tiles to pick from (driver, 21 November 2026), but not after
	// the tile Tidy up of Arrange my diagram found no result better than the
	// page (applyBest), which says there is nothing to tidy up (review of #1487)
	if (results.length > 0 && ((this.themes && (result == null || this.edit == null)) ||
		(result == null && !this.bestNothing && this.getShownResults().length > 0)))
	{
		return '';
	}
	else if (result == null || this.edit == null)
	{
		var nothing = mxResources.get((this.mode == 'style') ? 'styleNothing' : 'tidyNothing');

		// The palette that is used changes nothing, eg. the one that the page
		// has already, while other tiles change the page: the status names
		// its tile. Without tiles there is nothing to style at all. Tidy up
		// shows every result, so it says only that there is nothing to do.
		return (result != null && this.mode == 'style' && !this.themes &&
			this.getShownResults().length > 0) ?
			this.getName(result) + ': ' + nothing : nothing;
	}

	var stats = this.getStats(result);

	return this.getName(result) + ((stats.length > 0) ? ': ' + stats : '');
};

/**
 * Returns the given counts of shapes and connectors as text, with the
 * singular for a count of 1.
 */
TidyWindow.prototype.getCountText = function(shapes, edges)
{
	var key = (shapes == 1) ? ((edges == 1) ? 'tidyCountOne' : 'tidyCountOneShape') :
		((edges == 1) ? 'tidyCountOneConnector' : 'tidyCount');

	return mxResources.get(key, [shapes, edges], mxResources.get('tidyCount', [shapes, edges]));
};

/**
 * Returns the text of the given resource for the given count: the key with
 * One for a count of 1, which the resources of an older release do not have.
 */
TidyWindow.prototype.getStatText = function(key, count)
{
	var text = mxResources.get(key, [count]);

	return (count == 1) ? mxResources.get(key + 'One', [count], text) : text;
};

/**
 * Returns what the given result does as text, eg. "30 shapes moved, 24
 * connectors re-routed".
 */
TidyWindow.prototype.getStats = function(result)
{
	var parts = [];
	var stats = result.stats || {};

	if (stats.styled > 0)
	{
		parts.push(this.getStatText('styledShapes', stats.styled));
	}

	// The resources of an older release do not have the text (get returns
	// the key of a missing text)
	if (stats.styledEdges > 0 && mxResources.resources['styledConnectors'] != null)
	{
		parts.push(this.getStatText('styledConnectors', stats.styledEdges));
	}

	if (stats.moved > 0)
	{
		parts.push(this.getStatText('tidyMoved', stats.moved));
	}

	if (stats.rerouted > 0)
	{
		parts.push(this.getStatText('tidyRerouted', stats.rerouted));
	}

	if ((stats.labels || 0) + (stats.attached || 0) > 0)
	{
		parts.push(this.getStatText('tidyLabelsFixed', (stats.labels || 0) + (stats.attached || 0)));
	}

	return parts.join(', ');
};

/**
 * Returns the name of the given result.
 */
TidyWindow.prototype.getName = function(result)
{
	var index = result.index;

	// Palettes are numbered as they are shown (see getShownResults)
	if (index != null && this.analysis != null)
	{
		var shown = mxUtils.indexOf(this.getShownResults(),
			mxUtils.indexOf(this.analysis.results, result));
		index = (shown >= 0) ? shown + 1 : index;
	}

	return (index != null) ? mxResources.get(result.name) + ' ' + index :
		mxResources.get(result.name);
};

/**
 * Returns the indices of the results that have a tile. Palettes of Style
 * that change the page like an earlier palette are no alternatives and have
 * no tile (eg. with Keep my colors on a page whose shapes all have colors of
 * the user, no palette reaches a shape, so all palettes are the same), and
 * none has a tile if no palette changes the page (Nothing to style). Tidy up
 * and themes show all results. The indices are kept for each analysis.
 */
TidyWindow.prototype.getShownResults = function()
{
	var analysis = this.analysis;
	var results = (analysis != null) ? analysis.results : [];

	if (this.shown == null || this.shown.analysis !== analysis ||
		this.shown.count != results.length)
	{
		var indices = [];

		if (this.mode != 'style' || this.themes)
		{
			for (var i = 0; i < results.length; i++)
			{
				indices.push(i);
			}
		}
		else
		{
			var keys = Object.create(null);
			var changes = false;

			for (var i = 0; i < results.length; i++)
			{
				var key = (Array.isArray(results[i].changes)) ?
					TidyWindow.getChangesKey(results[i].changes) : null;
				changes = changes || key == null || results[i].changes.length > 0;

				if (key == null || keys[key] !== true)
				{
					if (key != null)
					{
						keys[key] = true;
					}

					indices.push(i);
				}
			}

			if (!changes)
			{
				indices = [];
			}
		}

		this.shown = {analysis: analysis, count: results.length, indices: indices};
	}

	return this.shown.indices;
};

/**
 * Returns a string that is equal for equal changes of results (see
 * Tidy.Trial.getChanges): the cells with their new style, geometry and
 * parent, and the rules of the page.
 */
TidyWindow.getChangesKey = function(changes)
{
	var parts = [];

	for (var i = 0; i < changes.length; i++)
	{
		var change = changes[i];
		parts.push(JSON.stringify([change.id,
			(change.style !== undefined) ? [change.style] : 0,
			(change.geometry !== undefined) ? [Tidy.Trial.getGeometryKey(change.geometry)] : 0,
			(change.parent !== undefined) ? [change.parent, change.index] : 0,
			(change.rules !== undefined) ? [change.rules] : 0]));
	}

	return parts.join('\n');
};

/**
 * Shows the status and the alternatives.
 */
TidyWindow.prototype.render = function()
{
	var results = (this.analysis != null) ? this.analysis.results : [];
	var focused = -1;

	// The tile, or its wrapper with the eye on touch, has the focus
	for (var i = 0; i < this.thumbs.childNodes.length; i++)
	{
		if (this.thumbs.childNodes[i].contains(document.activeElement))
		{
			focused = i;
		}
	}

	this.status.innerText = '';
	mxUtils.write(this.status, this.getStatus());
	this.thumbs.innerText = '';
	this.undoButton.style.display = (this.edit != null) ? '' : 'none';
	var shown = this.getShownResults();

	// The hint is about the pictures, which Nothing to style does not have
	this.hint.style.display = (shown.length == 0 && results.length > 0) ? 'none' : '';

	for (var i = 0; i < shown.length; i++)
	{
		this.thumbs.appendChild(this.createThumbnail(results[shown[i]], shown[i], shown.length));
	}

	// Keeps the focus of the keyboard on the tile that was used
	if (focused >= 0 && focused < this.thumbs.childNodes.length)
	{
		var tile = this.thumbs.childNodes[focused];
		(tile.querySelector('.geTidyTile') || tile).focus();
	}
};

/**
 * Returns the tile of the given alternative.
 */
TidyWindow.prototype.createThumbnail = function(result, index, count)
{
	var name = this.getName(result);
	var stats = this.getStats(result);

	// No chosen tile: the tiles apply at once (Undo and the toast say what
	// was applied)
	var current = this.analysis != null && this.analysis.current != null &&
		this.analysis.current == result.id;
	var elt = document.createElement('button');
	elt.className = 'geTidyTile' + ((result.swatch != null) ? ' geTidyThemeTile' : '');
	elt.setAttribute('title', name);

	if (current)
	{
		elt.setAttribute('aria-label', name + ' (' + mxResources.get('current') + ')');
	}

	var thumb = document.createElement('div');
	thumb.className = 'geTidyTileThumb';

	if (result.swatch != null)
	{
		// Themes show their colors as a swatch (the colors of the file, also in
		// dark mode, as in mockup 75)
		thumb.className = 'geTidyTileSwatch';
		thumb.setAttribute('aria-hidden', 'true');

		for (var i = 0; i < result.swatch.length; i++)
		{
			var cell = document.createElement('div');
			cell.style.backgroundColor = this.getSwatchColor(result.swatch[i].fill);
			cell.style.boxShadow = 'inset 0 0 0 1px ' + this.getSwatchColor(result.swatch[i].stroke);
			thumb.appendChild(cell);
		}
	}
	else if (result.thumbnail != null)
	{
		var img = document.createElement('img');
		img.setAttribute('alt', '');
		thumb.appendChild(img);
		thumb.tidyResult = result;
		this.updateThumbnail(thumb);
	}

	elt.appendChild(thumb);

	var caption = document.createElement('div');
	caption.className = 'geTidyTileName';
	var text = document.createElement('span');
	mxUtils.write(text, name);
	caption.appendChild(text);

	// The best result by the metrics, which is applied first, or the theme
	// that the page has
	if ((index == this.getBestIndex() && count > 1 && !this.themes) || current)
	{
		var badge = document.createElement('span');
		badge.className = 'geTidyTileBadge' + ((current) ? ' geTidyTileBadgeSoft' : '');
		mxUtils.write(badge, mxResources.get((current) ? 'current' : 'suggested'));
		caption.appendChild(badge);
	}

	// The theme that is shown on the canvas
	if (this.themes)
	{
		var previewing = document.createElement('span');
		previewing.className = 'geTidyTileBadge geTidyTilePreviewing';
		previewing.style.display = (index == this.previewIndex) ? '' : 'none';
		mxUtils.write(previewing, mxResources.get('preview'));
		caption.appendChild(previewing);
	}

	elt.appendChild(caption);

	if (stats.length > 0 && result.swatch == null)
	{
		var hint = document.createElement('div');
		hint.className = 'geTidyTileHint';
		mxUtils.write(hint, stats);
		elt.appendChild(hint);
	}

	// In the capture phase, as the picture may stop events (see click)
	elt.addEventListener('pointerdown', mxUtils.bind(this, function()
	{
		this.downIndex = index;
	}), true);

	// A click of the pointer that did not go down on the tile is the click of
	// a tap that opened the panel under the finger, which applies nothing. In
	// the capture phase: the labels of a picture stop the clicks on them.
	elt.addEventListener('click', mxUtils.bind(this, function(evt)
	{
		var down = this.downIndex;
		this.downIndex = null;

		if (index != this.current && (evt.detail == 0 || down == index))
		{
			this.select(index);
		}

		mxEvent.consume(evt);
	}), true);

	elt.tidyIndex = index;

	// A touch emulates mouseenter before its click: only the eye previews
	mxEvent.addListener(elt, 'mouseenter', mxUtils.bind(this, function()
	{
		if (this.touch)
		{
			return;
		}

		var show = mxUtils.bind(this, function()
		{
			this.preview(index);
		});

		// Back on the tile of the preview, or crossing a tile on the way to
		// Apply in the preview bar (EditorUi.deferSimplePreview, Simple Modern)
		if (index == this.previewIndex && typeof this.ui.endSimplePreviewHold === 'function')
		{
			this.ui.endSimplePreviewHold(this);
		}
		else if (typeof this.ui.deferSimplePreview !== 'function' ||
			!this.ui.deferSimplePreview(this, show))
		{
			show();
		}
	}));

	// The pointer may be on its way to Apply in the preview bar
	mxEvent.addListener(elt, 'mouseleave', mxUtils.bind(this, function(evt)
	{
		if (this.touch)
		{
			return;
		}

		if (typeof this.ui.holdSimplePreview !== 'function' ||
			!this.ui.holdSimplePreview(this, evt))
		{
			this.clearPreview();
		}
	}));

	// Only the focus of the keyboard previews (a click also focuses)
	mxEvent.addListener(elt, 'focus', mxUtils.bind(this, function()
	{
		if (!this.ignoreFocus && !this.touch && this.isFocusVisible(elt))
		{
			this.preview(index);
		}
	}));

	mxEvent.addListener(elt, 'blur', mxUtils.bind(this, function()
	{
		if (this.previewIndex == index && !this.touch)
		{
			this.clearPreview();
		}
	}));

	// Touch has no hover: a small eye on the tile, which is always shown,
	// previews (in Fusion with the preview bar, Apply and Cancel), the eye
	// again ends it (an element of its own, as a button holds no button)
	if (this.touch)
	{
		var wrap = document.createElement('div');
		wrap.className = 'geTidyTileWrap';
		wrap.tidyIndex = index;
		wrap.appendChild(elt);

		var eye = document.createElement('button');
		eye.setAttribute('type', 'button');
		eye.className = 'geTidyTileEye';
		eye.setAttribute('aria-pressed', (index == this.previewIndex) ? 'true' : 'false');
		eye.setAttribute('title', mxResources.get('preview'));
		eye.setAttribute('aria-label', mxResources.get('preview') + ': ' + name);
		var icon = document.createElement('span');
		icon.className = 'geTidyTileEyeIcon';
		icon.setAttribute('aria-hidden', 'true');
		icon.style.setProperty('--ge-tidy-eye', 'url(\'' + Editor.visibleImage + '\')');
		eye.appendChild(icon);
		wrap.appendChild(eye);

		mxEvent.addListener(eye, 'click', mxUtils.bind(this, function(evt)
		{
			if (this.previewIndex == index)
			{
				this.clearPreview();
			}
			else
			{
				this.preview(index);
			}

			mxEvent.consume(evt);
		}));

		return wrap;
	}

	return elt;
};

/**
 * Returns true if the editor is in dark mode.
 */
TidyWindow.prototype.isDarkMode = function()
{
	return typeof Editor.isDarkMode === 'function' && Editor.isDarkMode();
};

/**
 * Returns true if the CSS gives the pictures of the tiles a dark background
 * in dark mode (.geTidyTileThumb in grapheditor.css since 17 November
 * 2026). This file is in extensions.min.js, which can run next to the
 * app.min.js and CSS of an older release (see js/diagramly/CLAUDE.md),
 * whose tiles are white in dark mode: there the tiles keep the pictures in
 * the colors of light mode, as before. Fusion has its own background of the
 * tiles (fusion.css), so the panel does not set one. Checked once.
 */
TidyWindow.hasDarkTiles = function()
{
	if (TidyWindow.darkTiles == null)
	{
		var probe = document.createElement('div');
		probe.className = 'geTidyTileThumb';
		probe.style.position = 'absolute';
		probe.style.visibility = 'hidden';
		probe.style.colorScheme = 'dark';
		document.body.appendChild(probe);
		var rgba = String(window.getComputedStyle(probe).backgroundColor).match(/[0-9.]+/g);
		probe.parentNode.removeChild(probe);

		// No background shows the dark panel
		TidyWindow.darkTiles = rgba == null || rgba.length < 3 ||
			(rgba.length > 3 && parseFloat(rgba[3]) == 0) ||
			(0.2126 * rgba[0] + 0.7152 * rgba[1] + 0.0722 * rgba[2]) / 255 < 0.5;
	}

	return TidyWindow.darkTiles;
};

/**
 * Shows the picture of the result of the given tile picture in the colors
 * of the editor: the picture of dark mode in dark mode (see
 * Tidy.Trial.getThumbnails) on the dark background of the tile, and a
 * picture in the colors of light mode (light mode, a page that does not
 * adapt its colors, an engine without dark pictures, a CSS without the dark
 * background, see hasDarkTiles) on a light one.
 */
TidyWindow.prototype.updateThumbnail = function(thumb)
{
	var result = thumb.tidyResult;
	var img = thumb.getElementsByTagName('img')[0];

	if (result != null && img != null)
	{
		var dark = this.isDarkMode() && result.darkThumbnail != null &&
			result.darkThumbnail != result.thumbnail && TidyWindow.hasDarkTiles();
		var src = (dark) ? result.darkThumbnail : result.thumbnail;

		if (img.getAttribute('src') != src)
		{
			img.setAttribute('src', src);
		}

		thumb.style.colorScheme = (dark) ? '' : 'light';
	}
};

/**
 * Returns true if the given element has the focus of the keyboard.
 */
TidyWindow.prototype.isFocusVisible = function(elt)
{
	try
	{
		return elt.matches(':focus-visible');
	}
	catch (e)
	{
		return true;
	}
};

/**
 * Returns the CSS color of the given color of a swatch (only #hex colors).
 */
TidyWindow.prototype.getSwatchColor = function(color)
{
	return (Tidy.parseColor(color) != null) ? color : 'transparent';
};

/**
 * Returns the name of the given result in the preview bar: themes say how
 * they color the diagram (by role or by branch).
 */
TidyWindow.prototype.getPreviewName = function(result)
{
	var name = this.getName(result);
	var kind = (this.analysis != null) ? this.analysis.kind : null;

	if (result.theme != null && kind == 'mindmap')
	{
		return mxResources.get('styleThemeByBranch', [name]);
	}
	else if (result.theme != null && kind != 'cloud' && kind != 'network' && kind != 'sequence' &&
		kind != 'er' && kind != 'swimlanes')
	{
		return mxResources.get('styleThemeByRole', [name]);
	}

	return name;
};

/**
 * Returns the arrow of Back (the outline of the back icon of Fusion, in the
 * color of the text of the button), built without markup.
 */
TidyWindow.createBackIcon = function()
{
	var ns = 'http://www.w3.org/2000/svg';
	var svg = document.createElementNS(ns, 'svg');
	svg.setAttribute('viewBox', '0 0 24 24');
	svg.setAttribute('width', '16');
	svg.setAttribute('height', '16');
	svg.setAttribute('aria-hidden', 'true');
	svg.setAttribute('focusable', 'false');

	var path = document.createElementNS(ns, 'path');
	path.setAttribute('d', 'M19 12H5M11 6l-6 6 6 6');
	path.setAttribute('fill', 'none');
	path.setAttribute('stroke', 'currentColor');
	path.setAttribute('stroke-width', '1.8');
	path.setAttribute('stroke-linecap', 'round');
	path.setAttribute('stroke-linejoin', 'round');
	svg.appendChild(path);

	return svg;
};

/**
 * Applies again at once the result that a change of the options undid and
 * that its run is still to apply again (see rerun, reapply): the run
 * analyses in steps, and closing the panel meanwhile stopped it, which gave
 * back the diagram of before without an edit to undo (Codex's review of pull
 * request 1526). Nothing happens if no such run waits.
 */
TidyWindow.prototype.finishRun = function()
{
	if (!this.destroyed && this.reapply != null)
	{
		// The run that waits for its start or its next step starts nothing
		var analysis = this.analyzer;
		this.runs++;
		this.analyzer = null;

		if (this.analysisHandle != null)
		{
			this.analysisHandle.cancel();
			this.analysisHandle = null;
		}

		try
		{
			if (analysis == null)
			{
				analysis = TidyWindow.takePrefetch(this.ui, this.mode, this.cells, this.options);
			}

			if (analysis == null)
			{
				analysis = new Tidy.Analysis(this.ui, this.cells, this.options, this.mode == 'style');
			}

			analysis.complete();
			this.showAnalysis(analysis.result);
		}
		catch (e)
		{
			if (analysis != null)
			{
				analysis.destroy();
			}

			this.destroy();
			this.ui.handleError(e);
		}
	}
};

/**
 * Closes the panel and keeps the result (Done, the close button, Escape and
 * Back), also the one that a change of the options is still to apply again
 * (see finishRun).
 */
TidyWindow.prototype.closeKeepingResult = function()
{
	this.finishRun();
	this.destroy();
};

/**
 * Goes back to the place that opened the panel (Back and Escape of a panel
 * with a way back, see back): removes the panel, whose result stays as with
 * Done, and shows that place again (the tiles of Arrange my diagram).
 */
TidyWindow.prototype.goBack = function()
{
	var back = this.back;
	this.closeKeepingResult();

	if (back != null)
	{
		back.fn();
	}
};

/**
 * Removes the panel. The result stays.
 */
TidyWindow.prototype.destroy = function()
{
	if (!this.destroyed)
	{
		this.destroyed = true;
		this.stopAnalysis();
		this.clearPreview();
		this.cleanup();
	}
};

/**
 * Removes the listeners and the panel.
 */
TidyWindow.prototype.cleanup = function()
{
	var ui = this.ui;

	if (this.changeListener != null)
	{
		ui.editor.graph.model.removeListener(this.changeListener);
		ui.editor.undoManager.removeListener(this.changeListener);
		ui.editor.removeListener(this.changeListener);
		this.changeListener = null;
	}

	if (this.lockedListener != null)
	{
		ui.removeListener(this.lockedListener);
		this.lockedListener = null;
	}

	if (this.updateColorScheme != null)
	{
		ui.removeListener(this.updateColorScheme);
		this.updateColorScheme = null;
	}

	if (this.resizeListener != null)
	{
		mxEvent.removeListener(window, 'resize', this.resizeListener);
		this.resizeListener = null;
	}

	if (this.container != null && this.container.parentNode != null)
	{
		var focused = this.container.contains(document.activeElement);
		this.container.parentNode.removeChild(this.container);

		// Gives the focus back if it was in the panel
		if (focused && this.previousFocus != null && this.previousFocus.focus != null &&
			document.body.contains(this.previousFocus))
		{
			this.previousFocus.focus({preventScroll: true});
		}
	}

	this.previousFocus = null;

	if (ui.tidyWindow == this)
	{
		ui.tidyWindow = null;
	}
};
