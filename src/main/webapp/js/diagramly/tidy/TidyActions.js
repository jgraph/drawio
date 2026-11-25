/**
 * Copyright (c) 2006-2026, JGraph Holdings Ltd
 * Copyright (c) 2006-2026, draw.io AG
 */
/**
 * Actions and entry points of Tidy up and Style My Diagram. The engine
 * (Tidy.js, TidyStyle.js, TidyWindow.js and the forest) is in
 * extensions.min.js, which the actions load if it is not loaded yet.
 *
 * The feature is the switch tidy of Editor.featureDefaults (Editor.isTidyOn):
 * on in Classic and the Simple theme in the web app and in Fusion, off on the
 * other platforms; tidy=1 and tidy=0 in the URL and enableTidy in the
 * configuration change the default of every theme. Where it is off nothing
 * of this file is visible: no menu items, buttons or suggestions, and the
 * actions are disabled and not listed (they exist if a theme of the session
 * offers them, so that a switch of the theme without a restart shows them).
 * Whether a color of a shape wins over the rule of its role is decided when
 * the styles are computed (Graph.getStyleRuleBase), for all users.
 *
 * Arrange my diagram (the panel of Classic and Simple, the dialog of Classic
 * on phones, see LayoutPicker.js) has Tidy up as its first tile (createTidyLayoutEntry, as
 * the tile of Fusion in SimpleTidy.js): its picture is the best result for
 * the scope and the spacing of the picker, and choosing it opens the window
 * of Tidy up with them (TidyWindow.js), which applies that result.
 *
 * Simple UI (the same two items wherever they appear):
 * - Context menu of the canvas (nothing selected) and of two or more
 *   selected shapes (the selection is tidied).
 * - Suggestions of the selection toolbar (see getTidySuggestions).
 * - Tidy up as the first tile of Arrange my diagram.
 * Classic UI (and the other themes with a menu bar): the tile of Arrange my
 * diagram, or Arrange > Tidy Up after Layout where the layout picker is off;
 * Style My Diagram is in the search.
 */
(function()
{
	/**
	 * Loads the engine of Tidy up and Style My Diagram (in extensions.min.js)
	 * and calls success, or error with the error if it cannot be loaded. A
	 * call while extensions.min.js loads (for Tidy up or an import) waits for
	 * the end of that load, as loadingExtensions is reset only when its
	 * script has loaded or failed.
	 */
	EditorUi.prototype.loadTidy = function(success, error)
	{
		var done = function()
		{
			if (typeof TidyWindow !== 'undefined')
			{
				success();
			}
			else
			{
				error({message: mxResources.get('serviceUnavailableOrBlocked')});
			}
		};

		// extensions.min.js is there if ELK is there: an older bundle
		// without the engine is not loaded again
		if (typeof TidyWindow !== 'undefined' || typeof ElkLayout !== 'undefined' ||
			this.isOffline(true))
		{
			window.setTimeout(done, 0);
		}
		else if (this.loadingExtensions)
		{
			var start = Date.now();

			var wait = mxUtils.bind(this, function()
			{
				if (this.loadingExtensions && Date.now() - start < this.tidyLoadTimeout)
				{
					window.setTimeout(wait, 100);
				}
				else
				{
					done();
				}
			});

			window.setTimeout(wait, 100);
		}
		else
		{
			this.loadingExtensions = true;
			mxscript(window.DRAWIO_SERVER_URL + 'js/extensions.min.js', mxUtils.bind(this, function()
			{
				this.loadingExtensions = false;
				done();
			}), null, null, null, mxUtils.bind(this, function(e)
			{
				this.loadingExtensions = false;
				error(e);
			}));
		}
	};

	/**
	 * Milliseconds that loadTidy waits for a load of extensions.min.js that
	 * runs.
	 */
	EditorUi.prototype.tidyLoadTimeout = 120000;

	/**
	 * Runs Tidy up (mode tidy) or Style My Diagram (mode style) on the given
	 * cells (null for the page) or, if cells is undefined, the selection or
	 * the page and shows the side panel with the result. The given options
	 * replace those of the panel (eg. the spacing of Arrange my diagram).
	 */
	EditorUi.prototype.runTidy = function(mode, cells, options)
	{
		var graph = this.editor.graph;

		if (graph.isEnabled())
		{
			if (graph.isEditing())
			{
				graph.stopEditing(false);
			}

			this.loadTidy(mxUtils.bind(this, function()
			{
				try
				{
					// The window is in the place of the panel Arrange my diagram
					// of Classic and Simple, which closes when the window opens
					// (also if it was opened while the tools loaded, and not if
					// they fail to load; see showLayoutPanel in LayoutPicker.js
					// for the other way)
					if (this.layoutPanel != null && !this.layoutPanel.hosted)
					{
						this.hideLayoutPanel();
					}

					// So are the panels of Simple (PanelHost.js)
					if (this.sidePanel != null && typeof this.hideSidePanel === 'function')
					{
						this.hideSidePanel(false);
					}

					TidyWindow.show(this, mode, cells, options);
				}
				catch (e)
				{
					this.handleError(e);
				}
			}), mxUtils.bind(this, function(e)
			{
				this.handleError(e);
			}));
		}
	};

	/**
	 * Returns true if Tidy up and Style My Diagram can run: the graph is
	 * enabled and the current layer has cells.
	 */
	EditorUi.prototype.isTidyEnabled = function()
	{
		var graph = this.editor.graph;
		var parent = graph.getDefaultParent();

		return graph.isEnabled() && parent != null &&
			graph.model.getChildCount(parent) > 0;
	};

	/**
	 * Returns the suggestions of Tidy up and Style My Diagram for the given
	 * selection as [{action, name}]: for three or more shapes with
	 * connectors. Cheap (no analysis), for the suggestions of the selection
	 * toolbar.
	 */
	EditorUi.prototype.getTidySuggestions = function(cells)
	{
		var graph = this.editor.graph;
		var vertices = 0, edges = 0;
		cells = (cells != null) ? cells : graph.getSelectionCells();

		for (var i = 0; i < cells.length && (vertices < 3 || edges < 1); i++)
		{
			if (graph.model.isVertex(cells[i]))
			{
				vertices++;
				edges += graph.model.getEdgeCount(cells[i]);
			}
			else if (graph.model.isEdge(cells[i]))
			{
				edges++;
			}
		}

		return (vertices >= 3 && edges > 0 && Editor.isTidyOn() && this.isTidyEnabled()) ?
			[{action: 'tidyUp', name: mxResources.get('tidyUp')},
			{action: 'styleMyDiagram', name: mxResources.get('styleMyDiagram')}] : [];
	};

	/**
	 * Adds the actions tidyUp and styleMyDiagram and the suggestions of the
	 * selection toolbar, if it has them. Called by init if a theme of the
	 * session offers the tools (Editor.isFeatureAvailable). The actions are
	 * enabled and listed (visible, eg. in the action search) only while the
	 * current theme offers them (Editor.isTidyOn).
	 */
	Menus.prototype.addTidyActions = function()
	{
		var ui = this.editorUi;
		var actions = [];

		actions.push(ui.actions.addAction('tidyUp', function()
		{
			ui.runTidy('tidy');
		}));

		actions.push(ui.actions.addAction('styleMyDiagram', function()
		{
			ui.runTidy('style');
		}));

		var updateVisible = function()
		{
			for (var i = 0; i < actions.length; i++)
			{
				actions[i].visible = Editor.isTidyOn();
			}
		};

		for (var i = 0; i < actions.length; i++)
		{
			actions[i].isEnabled = function()
			{
				return Editor.isTidyOn() && ui.isTidyEnabled();
			};
		}

		updateVisible();
		ui.addListener('currentThemeChanged', updateVisible);

		// Suggestions of the selection toolbar, if it has them
		if (typeof InlineToolbar !== 'undefined' &&
			Array.isArray(InlineToolbar.prototype.suggestionRules) &&
			InlineToolbar.prototype.tidySuggestions == null)
		{
			InlineToolbar.prototype.tidySuggestions = true;

			InlineToolbar.prototype.suggestionRules.push(function(ctx)
			{
				var tui = (ctx != null && ctx.ui != null) ? ctx.ui : ui;

				return tui.getTidySuggestions((ctx != null) ? ctx.cells : null);
			});
		}
	};

	/**
	 * Most cells of a page whose picture of Tidy up in Arrange my diagram is
	 * analysed: the analysis copies the whole page (Tidy.Trial), so larger
	 * pages show the example (as simpleTidyTileMaxCells of Fusion).
	 */
	EditorUi.tidyTileMaxCells = 500;

	/**
	 * Least milliseconds between the starts of analyses for the picture of
	 * Tidy up in Arrange my diagram (changes of the scope, the spacing or the
	 * diagram while the panel of Simple is open).
	 */
	EditorUi.tidyTileInterval = 1000;

	/**
	 * Returns true if Arrange my diagram of Classic and Simple (the panel
	 * and the dialog of LayoutPicker.js) has the tile of Tidy up: the current
	 * theme offers the tools (Editor.isTidyOn). In the theme simple only the
	 * previous look has it, Fusion adds its own (addSimpleTidyTile in
	 * SimpleTidy.js).
	 */
	EditorUi.prototype.isTidyLayoutTileEnabled = function()
	{
		return Editor.isTidyOn() && this.actions.get('tidyUp') != null &&
			(Editor.currentTheme != 'simple' || Editor.isSimpleClassic()); // SIMPLE-CLASSIC
	};

	/**
	 * Returns the cells that Tidy up gets for the given scope of Arrange my
	 * diagram (see getLayoutScope): null for the page, else the cells of the
	 * scope (the selected shapes and their connectors, or the children of the
	 * selected group or container), so that the picture and the window of
	 * Tidy up arrange the cells that the other tiles arrange.
	 */
	EditorUi.prototype.getTidyScopeCells = function(scope)
	{
		var graph = this.editor.graph;

		if (scope == null || (scope.cells == null && scope.containers == null &&
			scope.parent == graph.getDefaultParent()))
		{
			return null;
		}

		var cells = this.getLayoutScopeCells(scope, Infinity);

		return (cells != null && cells.length > 0) ? cells : null;
	};

	/**
	 * Applies the geometries and styles of the given changes of a result of
	 * Tidy up (see Tidy.apply) to the given copies of the given cells of the
	 * diagram in the given graph of a picture. The copies keep their parents,
	 * as the picture and the preview on the canvas need the structure of the
	 * scope (cells that Tidy up moves into another parent keep their place).
	 */
	EditorUi.applyTidyChanges = function(graph, sources, copies, changes)
	{
		var model = graph.model;
		var lookup = Object.create(null);
		var stack = [];

		for (var i = 0; i < sources.length && i < copies.length; i++)
		{
			stack.push([sources[i], copies[i]]);
		}

		while (stack.length > 0)
		{
			var pair = stack.pop();

			if (pair[0].id != null)
			{
				lookup[pair[0].id] = pair;
			}

			for (var i = 0; i < pair[0].getChildCount() && i < pair[1].getChildCount(); i++)
			{
				stack.push([pair[0].getChildAt(i), pair[1].getChildAt(i)]);
			}
		}

		model.beginUpdate();
		try
		{
			for (var i = 0; i < changes.length; i++)
			{
				var change = changes[i];
				var pair = (change != null && typeof change.id === 'string') ? lookup[change.id] : null;

				if (pair != null)
				{
					var parent = pair[0].parent;
					var placed = change.parent == null || (parent != null && parent.id == change.parent);

					if (change.geometry !== undefined && placed)
					{
						model.setGeometry(pair[1], (change.geometry != null) ? change.geometry.clone() : null);
					}

					if (change.style !== undefined)
					{
						model.setStyle(pair[1], change.style);
					}
				}
			}
		}
		finally
		{
			model.endUpdate();
		}
	};

	/**
	 * Returns the entry of the tile Tidy up of Arrange my diagram in Classic
	 * and Simple (the panel, the dialog of Classic on phones) for the scope
	 * and the spacing preset of the picker (the given functions return
	 * them), or null if the picker has no tile (isTidyLayoutTileEnabled).
	 * The tile is the one of Fusion
	 * (addSimpleTidyTile): the name Tidy up, the description (tidyUpTileHint
	 * until the result is known, then what it does), and as its picture the
	 * best result of the engine (Tidy.Analysis in steps while the browser is
	 * idle, after loading the engine) on copies of the scope. Choosing it
	 * opens the window of Tidy up on the scope with the spacing (runTidy),
	 * which applies that result and has the alternatives, Undo and Apply.
	 *
	 * The entry has the functions of the tiles of LayoutPicker.js: layout
	 * (the picture), isExample (pages above tidyTileMaxCells cells),
	 * whenReady (calls the given function once the analysis of the current
	 * scope and spacing is complete or failed), getHint, isEnabled, apply
	 * and destroy, which stops the analysis.
	 */
	EditorUi.prototype.createTidyLayoutEntry = function(getScope, getPreset)
	{
		if (!this.isTidyLayoutTileEnabled())
		{
			return null;
		}

		var ui = this;
		var graph = this.editor.graph;
		var state = {key: null, analysis: null, handle: null, error: null, waiters: [],
			destroyed: false, edits: 0, started: null};
		var entry = {id: 'tidyUp', name: 'tidyUp', hint: 'tidyUpTileHint', state: state};

		// Every change of the model is counted for the key, so a result is
		// never shown for the diagram before a change
		var modelListener = function()
		{
			state.edits++;
		};

		graph.model.addListener(mxEvent.CHANGE, modelListener);

		// The key of an analysis: the page, the changes of the model, the
		// scope, the spacing, the grid and the hidden tags
		var getKey = function(scope, preset)
		{
			var cells = ui.getTidyScopeCells(scope);

			return [mxObjectIdentity.get(graph.model.getRoot()), state.edits, (scope != null &&
				scope.parent != null) ? scope.parent.id : '', (cells != null) ?
				cells.map(function(cell) { return cell.id; }).join(',') : '',
				preset, graph.gridSize, JSON.stringify(graph.hiddenTags || null)].join('\n');
		};

		// Returns the best result of the complete analysis or null
		var getResult = function()
		{
			var analysis = state.analysis;
			var result = (analysis != null && analysis.done) ? analysis.result : null;

			return (result != null && result.best >= 0 && result.results != null) ?
				result.results[result.best] : null;
		};

		var cancel = function()
		{
			if (state.handle != null)
			{
				state.handle.cancel();
				state.handle = null;
			}

			if (state.analysis != null && !state.analysis.done && state.analysis.destroy != null)
			{
				state.analysis.destroy();
			}
		};

		// The waiters are called once with the analysis complete or failed
		var finish = function()
		{
			var waiters = state.waiters;
			state.waiters = [];
			state.handle = null;

			for (var i = 0; i < waiters.length; i++)
			{
				waiters[i]();
			}
		};

		var requestIdle = function(fn, delay)
		{
			if (typeof TidyWindow !== 'undefined' && typeof TidyWindow.requestIdle === 'function')
			{
				return TidyWindow.requestIdle(fn, delay);
			}
			else
			{
				var id = window.setTimeout(fn, (delay > 0) ? delay : 0);

				return {cancel: function()
				{
					window.clearTimeout(id);
				}};
			}
		};

		// Starts the analysis of the given key in steps in idle time: the first
		// step copies the page (Tidy.Trial), so the dialog and the pictures of
		// the layouts do not wait for it
		var analyze = function(key, scope, preset)
		{
			cancel();

			var step = function()
			{
				state.handle = null;

				if (state.destroyed || state.key != key)
				{
					return;
				}

				try
				{
					if (state.analysis == null)
					{
						var options = {direction: 'auto', spacing: preset, keep: false, thumbnails: false};
						state.started = Date.now();

						if (typeof Tidy.Analysis === 'function')
						{
							state.analysis = new Tidy.Analysis(ui, ui.getTidyScopeCells(scope), options, false);
						}
						else
						{
							// An older engine has no steps
							state.analysis = {done: true, result: Tidy.analyze(ui,
								ui.getTidyScopeCells(scope), options)};
						}
					}
					else if (!state.analysis.done)
					{
						state.analysis.step();
					}
				}
				catch (e)
				{
					state.error = e;
				}

				if (state.error != null || state.analysis.done)
				{
					finish();
				}
				else
				{
					state.handle = requestIdle(step);
				}
			};

			// At most one start per tidyTileInterval
			state.handle = requestIdle(step, (state.started == null) ? 0 :
				Math.max(0, state.started + EditorUi.tidyTileInterval - Date.now()));
		};

		entry.whenReady = function(fn)
		{
			var scope = getScope();
			var preset = getPreset();
			var key = getKey(scope, preset);

			if (state.key == key && (state.error != null || (state.analysis != null && state.analysis.done)))
			{
				fn();
			}
			else
			{
				state.waiters.push(fn);

				if (state.key != key)
				{
					cancel();
					state.key = key;
					state.analysis = null;
					state.error = null;

					if (typeof Tidy !== 'undefined')
					{
						analyze(key, scope, preset);
					}
					else
					{
						ui.loadTidy(function()
						{
							if (!state.destroyed && state.key == key && state.analysis == null)
							{
								analyze(key, scope, preset);
							}
						}, function(e)
						{
							if (!state.destroyed && state.key == key && state.analysis == null)
							{
								state.error = (e != null) ? e : new Error(mxResources.get('error'));
								finish();
							}
						});
					}
				}
			}
		};

		// The picture: the copies of the scope with the changes of the result
		entry.layout = function(g, parent, sources, copies)
		{
			if (sources != null)
			{
				if (state.error != null)
				{
					throw state.error;
				}

				var result = getResult();

				if (result != null && copies != null && Array.isArray(result.changes))
				{
					EditorUi.applyTidyChanges(g, sources, copies, result.changes);
				}
			}
		};

		// Larger pages show the example and analyse only in the window
		entry.isExample = function()
		{
			var count = 0;

			for (var id in graph.model.cells)
			{
				if (++count > EditorUi.tidyTileMaxCells)
				{
					return true;
				}
			}

			return false;
		};

		// What the result does (eg. 4 shapes moved) or that there is nothing to
		// do, once the analysis of the scope and the spacing is complete
		entry.getHint = function()
		{
			var text = mxResources.get(entry.hint);

			if (state.key == getKey(getScope(), getPreset()) && state.error == null &&
				state.analysis != null && state.analysis.done)
			{
				var result = getResult();
				var stats = (result != null && typeof TidyWindow !== 'undefined') ?
					TidyWindow.prototype.getStats(result) : null;
				text = (result == null || !Array.isArray(result.changes) || result.changes.length == 0) ?
					mxResources.get('tidyNothing') : ((stats != null && stats.length > 0) ? stats : text);
			}

			return text;
		};

		entry.isEnabled = function()
		{
			var action = ui.actions.get('tidyUp');

			return action != null && action.isEnabled();
		};

		// Opens the window of Tidy up on the scope with the spacing, which
		// applies the best result as the click on the tile asks (applyBest);
		// the panel of Classic and Simple makes room for it (runTidy, both are
		// in the place of Format). Back and Escape of the window keep the
		// result and show the tiles again with the focus on Tidy up
		// (showLayoutPickerTile in LayoutPicker.js). The panel adds no edit
		// itself (done)
		entry.apply = function(panel, tile, done)
		{
			try
			{
				if (entry.isEnabled())
				{
					var cells = ui.getTidyScopeCells(getScope());
					var options = {spacing: getPreset(), applyBest: true, back: {fn: function()
					{
						ui.showLayoutPickerTile(entry.id);
					}, label: mxResources.get('backTo', [mxResources.get('arrangeMyDiagram')], 'Back to {1}')}};
					ui.runTidy('tidy', cells, options);
				}
			}
			finally
			{
				if (done != null)
				{
					done();
				}
			}
		};

		entry.destroy = function()
		{
			state.destroyed = true;
			state.waiters = [];
			cancel();
			graph.model.removeListener(modelListener);
		};

		return entry;
	};

	var menusInit = Menus.prototype.init;

	Menus.prototype.init = function()
	{
		menusInit.apply(this, arguments);

		if (Editor.isFeatureAvailable('tidy') && this.editorUi.actions.get('tidyUp') == null)
		{
			this.addTidyActions();
		}
	};

	/**
	 * Adds Tidy up and Style My Diagram to the context menu of the canvas and
	 * of two or more selected cells in the Simple UI (in Fusion, which has its
	 * own context menu, only with the switch, as before).
	 */
	var menusAddPopupMenuItems = Menus.prototype.addPopupMenuItems;

	Menus.prototype.addPopupMenuItems = function(menu, cell, evt)
	{
		menusAddPopupMenuItems.apply(this, arguments);

		var graph = this.editorUi.editor.graph;

		if (Editor.currentTheme == 'simple' && (Editor.enableTidy || Editor.isSimpleClassic()) && // SIMPLE-CLASSIC
			Editor.isTidyOn() && this.editorUi.isTidyEnabled() &&
			(graph.isSelectionEmpty() || graph.getSelectionCount() > 1))
		{
			this.addMenuItems(menu, ['-', 'tidyUp', 'styleMyDiagram'], null, evt);
		}
	};

	/**
	 * Adds Tidy Up after Layout in the arrange menu of the menu bar (Classic),
	 * where the theme offers it and the layout picker is off: Arrange my
	 * diagram has it as its first tile (driver, 16 November 2026: for the
	 * user all of it is a bit of tidying up). The Simple UI has it in the
	 * context menu and the panel Arrange my diagram, Fusion in its own menus.
	 */
	var menusAddArrangeLayoutItems = Menus.prototype.addArrangeLayoutItems;

	Menus.prototype.addArrangeLayoutItems = function(menu, parent)
	{
		menusAddArrangeLayoutItems.apply(this, arguments);

		if (Editor.currentTheme != 'simple' && Editor.isTidyOn() &&
			!(typeof this.isLayoutPickerEnabled === 'function' && this.isLayoutPickerEnabled()))
		{
			this.addMenuItems(menu, ['tidyUp'], parent);
		}
	};
})();
