/**
 * Copyright (c) 2006-2026, JGraph Holdings Ltd
 * Copyright (c) 2006-2026, draw.io AG
 */
/**
 * Adds the spring handle for the selected shapes of the graph of the editor
 * if springMove is true in the configuration (see Editor.springMove). The
 * handler of the first shape shows the handle at the top left of all shapes.
 * The spring move itself (SpringMove.js) is in extensions.min.js, so the
 * handle is only shown once it is loaded.
 */
(function()
{
	var editorUiInit = EditorUi.prototype.init;

	EditorUi.prototype.init = function()
	{
		editorUiInit.apply(this, arguments);
		this.editor.graph.springMoveUi = this;
	};

	/**
	 * Returns the cached cells of SpringMove.getCells for the given graph.
	 * The cache is cleared when the handlers are refreshed, which happens
	 * after all changes of the selection or the model.
	 */
	function getSpringCells(graph)
	{
		if (graph.springCells === undefined)
		{
			graph.springCells = SpringMove.getCells(graph);
		}

		return graph.springCells;
	};

	/**
	 * Returns true if the given handler shows the spring handle.
	 */
	function isSpringHandleVisible(handler)
	{
		var g = handler.graph;

		if (Editor.springMove && typeof SpringMove !== 'undefined' &&
			g.springMoveUi != null && g.isEnabled() && g.springMove == null)
		{
			var cells = getSpringCells(g);

			return cells != null && cells[0] == handler.state.cell;
		}

		return false;
	};

	/**
	 * Creates the spring handle of the given vertex handler.
	 */
	function createSpringHandle(handler)
	{
		var g = document.createElementNS(mxConstants.NS_SVG, 'g');
		g.style.cursor = 'move';

		var title = document.createElementNS(mxConstants.NS_SVG, 'title');
		title.textContent = mxResources.get('springMoveHint', null,
			'Drag to move with the connected shapes (Shift: direct neighbors only)');
		g.appendChild(title);

		var circle = document.createElementNS(mxConstants.NS_SVG, 'circle');
		// Same colors as the connect handle
		circle.setAttribute('r', '8');
		circle.setAttribute('fill', HoverIcons.prototype.arrowFill);
		circle.setAttribute('stroke', '#ffffff');
		circle.setAttribute('stroke-width', '1');
		g.appendChild(circle);

		// A small spring
		var path = document.createElementNS(mxConstants.NS_SVG, 'path');
		path.setAttribute('d', 'M -4.5 0 L -3 -3 L -1 3 L 1 -3 L 3 3 L 4.5 0');
		path.setAttribute('fill', 'none');
		path.setAttribute('stroke', '#ffffff');
		path.setAttribute('stroke-width', '1.3');
		path.setAttribute('stroke-linejoin', 'round');
		g.appendChild(path);

		mxEvent.addGestureListeners(g, function(evt)
		{
			if (mxEvent.isLeftMouseButton(evt) || mxEvent.isTouchEvent(evt) ||
				mxEvent.isPenEvent(evt))
			{
				var cells = getSpringCells(handler.graph);

				if (cells != null)
				{
					new SpringMove(handler.graph.springMoveUi, cells, evt);
				}

				g.style.display = 'none';
				mxEvent.consume(evt);
			}
		});

		handler.graph.view.getOverlayPane().appendChild(g);

		return g;
	};

	/**
	 * Places the spring handle of the given handler above the shapes on the
	 * left, away from the rotation and connect handles and the box of a
	 * multi-selection.
	 */
	function redrawSpringHandle(handler)
	{
		var visible = handler.springHandlesVisible !== false &&
			isSpringHandleVisible(handler);
		handler.springHandle.style.display = (visible) ? '' : 'none';

		if (visible)
		{
			var view = handler.graph.view;
			var cells = getSpringCells(handler.graph);
			var bounds = null;

			for (var i = 0; i < cells.length; i++)
			{
				var state = view.getState(cells[i]);

				if (state != null)
				{
					var rect = new mxRectangle(state.x, state.y, state.width, state.height);

					// Returns null for unrotated shapes
					var bbox = mxUtils.getBoundingBox(rect, mxUtils.getValue(state.style,
						mxConstants.STYLE_ROTATION, 0)) || rect;

					if (bounds == null)
					{
						bounds = bbox;
					}
					else
					{
						bounds.add(bbox);
					}
				}
			}

			// Outside of the hit areas of the sizers, which are further out
			// for small shapes
			var multi = handler.graph.selectionCellsHandler.multiSelectionHandler;
			var d = 17 + ((multi != null) ? multi.padding : 0);
			var dx = d + ((cells.length == 1) ? handler.horizontalOffset / 2 : 0);
			var dy = d + ((cells.length == 1) ? handler.verticalOffset / 2 : 0);
			handler.springHandle.setAttribute('transform', 'translate(' +
				(bounds.x - dx) + ',' + (bounds.y - dy) + ')');
		}
	};

	/**
	 * Clears the cells of the spring handle and keeps the handles and
	 * selection borders hidden during a spring move, eg. after zooming.
	 */
	var selectionCellsHandlerRefresh = mxSelectionCellsHandler.prototype.refresh;
	mxSelectionCellsHandler.prototype.refresh = function()
	{
		var graph = this.graph;
		delete graph.springCells;
		selectionCellsHandlerRefresh.apply(this, arguments);

		if (graph.springMove != null)
		{
			graph.graphHandler.setHandlesVisibleForCells(graph.getSelectionCells(), false, true);
			graph.springMove.setSelectionBorderVisible(false);
		}
	};

	var hoverIconsUpdate = HoverIcons.prototype.update;
	HoverIcons.prototype.update = function()
	{
		if (this.graph.springMove != null)
		{
			this.reset();
		}
		else
		{
			hoverIconsUpdate.apply(this, arguments);
		}
	};

	var vertexHandlerInit = mxVertexHandler.prototype.init;
	mxVertexHandler.prototype.init = function()
	{
		vertexHandlerInit.apply(this, arguments);

		if (Editor.springMove && typeof SpringMove !== 'undefined' &&
			this.graph.springMoveUi != null)
		{
			this.springHandle = createSpringHandle(this);
			redrawSpringHandle(this);
		}
	};

	var vertexHandlerRedrawHandles = mxVertexHandler.prototype.redrawHandles;
	mxVertexHandler.prototype.redrawHandles = function()
	{
		vertexHandlerRedrawHandles.apply(this, arguments);

		if (this.springHandle != null)
		{
			redrawSpringHandle(this);
		}
	};

	var vertexHandlerSetHandlesVisible = mxVertexHandler.prototype.setHandlesVisible;
	mxVertexHandler.prototype.setHandlesVisible = function(visible)
	{
		vertexHandlerSetHandlesVisible.apply(this, arguments);
		this.springHandlesVisible = visible;

		if (this.springHandle != null)
		{
			redrawSpringHandle(this);
		}
	};

	var vertexHandlerDestroy = mxVertexHandler.prototype.destroy;
	mxVertexHandler.prototype.destroy = function()
	{
		vertexHandlerDestroy.apply(this, arguments);

		if (this.springHandle != null)
		{
			if (this.springHandle.parentNode != null)
			{
				this.springHandle.parentNode.removeChild(this.springHandle);
			}

			this.springHandle = null;
		}
	};
})();
