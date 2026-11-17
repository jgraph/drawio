/**
 * Copyright (c) 2006-2026, JGraph Holdings Ltd
 * Copyright (c) 2006-2026, draw.io AG
 */
/**
 * Actions and entry points of Tidy up and Style My Diagram. The engine
 * (Tidy.js, TidyStyle.js, TidyWindow.js and the forest) is in
 * extensions.min.js, which the actions load if it is not loaded yet.
 *
 * The feature is behind a switch (Editor.enableTidy: enableTidy in the
 * configuration or tidy=1 in the URL, off by default). Without it nothing
 * of this file is visible: no actions, menu items, buttons or suggestions.
 * The theme Fusion offers them also without the switch, unless tidy=0 or
 * enableTidy turns them off (Editor.isTidyOn in SimpleTidy.js).
 * Whether a color of a shape wins over the rule of its role is decided when
 * the styles are computed (Graph.getStyleRuleBase), for all users.
 *
 * Simple UI (the same two items wherever they appear):
 * - Format panel with nothing selected: at the top of the Diagram tab.
 * - Context menu of the canvas (nothing selected) and of two or more
 *   selected shapes (the selection is tidied).
 * - Suggestions of the selection toolbar (see getTidySuggestions).
 * The Classic UI keeps its menus; the actions are in the search.
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
	 * Runs Tidy up (mode tidy) or Style My Diagram (mode style) on the
	 * selection or the page and shows the side panel with the result.
	 */
	EditorUi.prototype.runTidy = function(mode)
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
					TidyWindow.show(this, mode);
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

		return (vertices >= 3 && edges > 0 && this.isTidyEnabled()) ?
			[{action: 'tidyUp', name: mxResources.get('tidyUp')},
			{action: 'styleMyDiagram', name: mxResources.get('styleMyDiagram')}] : [];
	};

	/**
	 * Adds the actions tidyUp and styleMyDiagram and the suggestions of the
	 * selection toolbar, if it has them. Called by init with the switch
	 * (Editor.enableTidy); the theme Fusion calls it for its default (see
	 * SimpleTidy.js).
	 */
	Menus.prototype.addTidyActions = function()
	{
		var ui = this.editorUi;

		ui.actions.addAction('tidyUp', function()
		{
			ui.runTidy('tidy');
		}).isEnabled = function()
		{
			return ui.isTidyEnabled();
		};

		ui.actions.addAction('styleMyDiagram', function()
		{
			ui.runTidy('style');
		}).isEnabled = function()
		{
			return ui.isTidyEnabled();
		};

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

	var menusInit = Menus.prototype.init;

	Menus.prototype.init = function()
	{
		menusInit.apply(this, arguments);

		if (Editor.enableTidy)
		{
			this.addTidyActions();
		}
	};

	/**
	 * Adds Tidy up and Style My Diagram to the context menu of the canvas and
	 * of two or more selected cells in the Simple UI.
	 */
	var menusAddPopupMenuItems = Menus.prototype.addPopupMenuItems;

	Menus.prototype.addPopupMenuItems = function(menu, cell, evt)
	{
		menusAddPopupMenuItems.apply(this, arguments);

		var graph = this.editorUi.editor.graph;

		if (Editor.enableTidy && Editor.currentTheme == 'simple' && this.editorUi.isTidyEnabled() &&
			(graph.isSelectionEmpty() || graph.getSelectionCount() > 1))
		{
			this.addMenuItems(menu, ['-', 'tidyUp', 'styleMyDiagram'], null, evt);
		}
	};

	/**
	 * Adds Tidy up and Style My Diagram at the top of the Diagram tab of the
	 * Format panel in the Simple UI.
	 */
	var diagramFormatPanelInit = DiagramFormatPanel.prototype.init;

	DiagramFormatPanel.prototype.init = function()
	{
		var ui = this.editorUi;

		// Simple Modern has the tools in For this page (see SimpleFormat.js)
		if (Editor.enableTidy && Editor.isSimpleClassic() && // SIMPLE-CLASSIC
			ui.editor.graph.isEnabled() && ui.actions.get('tidyUp') != null)
		{
			var div = this.createPanel();
			div.style.display = 'flex';
			div.style.flexDirection = 'column';
			div.style.gap = '6px';
			div.style.paddingTop = '12px';
			div.style.paddingBottom = '12px';

			var addButton = function(name)
			{
				var action = ui.actions.get(name);
				var label = mxResources.get(name);
				var btn = mxUtils.button(label, function()
				{
					action.funct();
				});

				btn.className = 'geBtn';
				btn.style.width = '100%';
				btn.style.boxSizing = 'border-box';
				btn.style.margin = '0';
				btn.style.whiteSpace = 'nowrap';
				btn.style.overflow = 'hidden';
				btn.style.textOverflow = 'ellipsis';
				btn.setAttribute('title', label);

				if (!action.isEnabled())
				{
					btn.setAttribute('disabled', 'disabled');
				}

				div.appendChild(btn);
			};

			addButton('tidyUp');
			addButton('styleMyDiagram');
			this.container.appendChild(div);
		}

		diagramFormatPanelInit.apply(this, arguments);
	};
})();
