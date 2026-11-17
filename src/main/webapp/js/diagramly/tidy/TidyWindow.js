/**
 * Copyright (c) 2006-2026, JGraph Holdings Ltd
 * Copyright (c) 2006-2026, draw.io AG
 */
/**
 * Side panel of Tidy up and Style My Diagram, a sibling of the Choose
 * Layout panel of the concept study: a card in the place of the Format panel
 * with the title and the counts of the scope, a hint, the alternatives as
 * large pictures of the user's diagram in two columns (the best one is
 * Suggested), and at the bottom Direction (Automatic, Down, Right), Spacing
 * (Compact, Normal, Airy) and Keep my arrangement for Tidy up, Keep my
 * colors for Style, Undo and Apply. No text input.
 *
 * The best result is applied at once (one undoable edit). Hovering a
 * picture of Tidy up previews it on the canvas without changing the model
 * (Graph.previewGeometries), a click uses it instead (still one edit), a
 * choice runs it again, Apply keeps the result and Undo reverts it. The
 * panel closes when the diagram changes otherwise, as the alternatives were
 * computed for the diagram before the result.
 *
 * In Simple Modern Style shows the themes (Calm, Bold, Mono, Sketch) as
 * swatches with the Current badge and applies one only when it is picked,
 * and previews show the preview bar of the shell (Apply, Escape), see
 * EditorUi.showSimplePreviewBar in SimpleHosts.js.
 *
 * In extensions.min.js (see EditorUi.loadTidy).
 */
var TidyWindow = function(ui, mode, cells)
{
	this.ui = ui;
	this.mode = mode;
	this.cells = cells;
	this.themes = mode == 'style' && Tidy.getThemes() != null;

	this.options = TidyWindow.getDefaultOptions(mode, this.themes);
	this.analysis = null;
	this.current = -1;
	this.edit = null;
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
	// A theme is a choice of a look, so it colors every shape by default
	return (mode == 'style') ? {keepColors: !themes} :
		{direction: 'auto', spacing: 'normal', keep: false};
};

/**
 * Shows the panel for the given mode (tidy or style) on the selection or
 * the page of the given editor UI and applies the best result.
 */
TidyWindow.show = function(ui, mode)
{
	var graph = ui.editor.graph;

	if (ui.tidyWindow != null)
	{
		ui.tidyWindow.destroy();
	}

	var cells = (graph.isSelectionEmpty()) ? null : graph.getSelectionCells();
	ui.tidyWindow = new TidyWindow(ui, mode, cells);
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
	// color scheme of the editor explicitly
	this.updateColorScheme = function()
	{
		panel.style.colorScheme = (Editor.isDarkMode != null &&
			Editor.isDarkMode()) ? 'dark' : 'light';
	};

	this.updateColorScheme();
	ui.addListener('darkModeChanged', this.updateColorScheme);

	var header = document.createElement('div');
	header.className = 'geTidyPanelHeader';
	panel.appendChild(header);

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
		this.destroy();
	}));

	var hint = document.createElement('div');
	hint.className = 'geTidyPanelHint';
	mxUtils.write(hint, mxResources.get((this.themes) ? 'styleThemesHint' :
		((style) ? 'styleHint' : 'tidyHint')));
	panel.appendChild(hint);

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

	this.applyButton = mxUtils.button(mxResources.get('apply'), mxUtils.bind(this, function()
	{
		this.destroy();
	}));
	this.applyButton.className = 'geTidyButton geTidyPrimary';
	buttons.appendChild(this.applyButton);

	// Escape closes the panel and keeps the result, like Apply
	mxEvent.addListener(panel, 'keydown', mxUtils.bind(this, function(evt)
	{
		if (evt.key == 'Escape')
		{
			this.destroy();
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
 * Selects the cells that were selected when the panel was opened (undo
 * selects the cells it changes).
 */
TidyWindow.prototype.restoreSelection = function()
{
	var graph = this.ui.editor.graph;
	var cells = [];

	if (this.cells != null)
	{
		for (var i = 0; i < this.cells.length; i++)
		{
			if (graph.model.contains(this.cells[i]))
			{
				cells.push(this.cells[i]);
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
 * Returns the index of the result to apply after a run: the one with the ID
 * of the result before a rerun, else the best result, which is -1 if every
 * result of Tidy up scores worse than the page as it is (see Tidy.analyze).
 * Themes are applied only when they are picked, so they show the page as it
 * is (-1).
 */
TidyWindow.prototype.getInitialIndex = function()
{
	var results = this.analysis.results;
	var id = this.reapply;
	this.reapply = null;

	for (var i = 0; i < results.length && id != null; i++)
	{
		if (results[i].id == id)
		{
			return i;
		}
	}

	return this.getBestIndex();
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
		// The theme that was used is used again with the new options
		var results = (this.analysis != null) ? this.analysis.results : [];
		this.reapply = (this.themes && this.edit != null && results[this.current] != null) ?
			results[this.current].id : null;
		this.undo();
		this.run();
	}
};

/**
 * Applies the result with the given index instead of the current one.
 */
TidyWindow.prototype.select = function(index)
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
		var badge = tiles[i].querySelector('.geTidyTilePreviewing');

		if (badge != null)
		{
			badge.style.display = (i == this.previewIndex) ? '' : 'none';
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

	// Themes are previewed before one is applied (no edit yet)
	if (this.styleBase == null || index == this.current || results[index] == null ||
		(this.edit != null && !this.isLastEdit()) || (this.edit == null && !this.themes))
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

	// Nothing is applied until a theme is picked
	if (this.themes && results.length > 0 && (result == null || this.edit == null))
	{
		return '';
	}
	else if (result == null || this.edit == null)
	{
		return mxResources.get((this.mode == 'style') ? 'styleNothing' : 'tidyNothing');
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
	return (result.index != null) ? mxResources.get(result.name) + ' ' + result.index :
		mxResources.get(result.name);
};

/**
 * Shows the status and the alternatives.
 */
TidyWindow.prototype.render = function()
{
	var results = (this.analysis != null) ? this.analysis.results : [];
	var focused = Array.prototype.indexOf.call(this.thumbs.childNodes, document.activeElement);
	this.status.innerText = '';
	mxUtils.write(this.status, this.getStatus());
	this.thumbs.innerText = '';
	this.undoButton.style.display = (this.edit != null) ? '' : 'none';

	// Apply keeps the theme that was picked
	this.applyButton.disabled = this.themes && this.edit == null;

	for (var i = 0; i < results.length; i++)
	{
		this.thumbs.appendChild(this.createThumbnail(results[i], i, results.length));
	}

	// Keeps the focus of the keyboard on the tile that was used
	if (focused >= 0 && focused < this.thumbs.childNodes.length)
	{
		this.thumbs.childNodes[focused].focus();
	}
};

/**
 * Returns the tile of the given alternative.
 */
TidyWindow.prototype.createThumbnail = function(result, index, count)
{
	var selected = index == this.current;
	var name = this.getName(result);
	var stats = this.getStats(result);

	var current = this.analysis != null && this.analysis.current != null &&
		this.analysis.current == result.id;
	var elt = document.createElement('button');
	elt.className = 'geTidyTile' + ((selected) ? ' geTidyTileSelected' : '') +
		((result.swatch != null) ? ' geTidyThemeTile' : '');
	elt.setAttribute('aria-pressed', (selected) ? 'true' : 'false');
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
		img.setAttribute('src', result.thumbnail);
		img.setAttribute('alt', '');
		thumb.appendChild(img);
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

	mxEvent.addListener(elt, 'click', mxUtils.bind(this, function(evt)
	{
		if (index != this.current)
		{
			this.select(index);
		}

		mxEvent.consume(evt);
	}));

	mxEvent.addListener(elt, 'mouseenter', mxUtils.bind(this, function()
	{
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
		if (typeof this.ui.holdSimplePreview !== 'function' ||
			!this.ui.holdSimplePreview(this, evt))
		{
			this.clearPreview();
		}
	}));

	// Only the focus of the keyboard previews (a click also focuses)
	mxEvent.addListener(elt, 'focus', mxUtils.bind(this, function()
	{
		if (!this.ignoreFocus && this.isFocusVisible(elt))
		{
			this.preview(index);
		}
	}));

	mxEvent.addListener(elt, 'blur', mxUtils.bind(this, function()
	{
		if (this.previewIndex == index)
		{
			this.clearPreview();
		}
	}));

	return elt;
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
