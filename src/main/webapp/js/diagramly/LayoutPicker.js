/**
 * Copyright (c) 2006-2026, JGraph Holdings Ltd
 * Copyright (c) 2006-2026, draw.io AG
 */
/**
 * Choose Layout (the layout picker) and Layout Settings (a form for the
 * custom layout JSON), actions chooseLayout and layoutSettings.
 *
 * The picker shows a tile per layout with a picture of the selection or the
 * page laid out that way, a name and what the layout is for. The pictures
 * are layout runs on copies of the cells in small graphs (LayoutPreviews),
 * one after the other, with a limit on the number of cells and on the time,
 * after which the tiles show the layout of an example. A click on a tile
 * runs the layout as one undoable edit (applyLayoutList).
 *
 * The form edits the {layout, config} entries of a custom layout (see
 * EditorUi.resolveLayoutList). It writes only the keys of the config that
 * the user changed (EditorUi.mergeLayoutConfig), so keys that it does not
 * show keep their values, and the JSON stays in the same dialog under Edit
 * as JSON. Lists that the form can't show are edited as JSON. All values
 * go through Graph.createLayouts, which limits the ELK options with
 * Graph.sanitizeElkLayoutOptions.
 *
 * In app.min.js and base.min.js after diagramly/Menus.js.
 */
(function()
{
	/**
	 * Returns true in a session of the theme Fusion. Editor.isSimpleModern is
	 * defined in FusionTheme.js, which base.min.js (atlas.min.js,
	 * integrate.min.js) and the bundles of build-child.xml do not have, so
	 * the layout picker of layoutPicker=1 must not call it there.
	 */
	var isFusion = function()
	{
		return typeof Editor.isSimpleModern === 'function' && Editor.isSimpleModern();
	};

	/**
	 * Layout types of the form. layout is the name in the JSON, name the
	 * resource key of the label, shapes and levels the config keys and
	 * defaults of the spacings, connectors the choices of the connector
	 * style and checks the options with checkboxes.
	 */
	EditorUi.layoutTypes = {
		flow: {layout: 'elkLayered', name: 'layoutFlow', elk: 'layered', directions: true,
			shapes: ['elk.spacing.nodeNode', 30], levels: ['elk.layered.spacing.nodeNodeBetweenLayers', 30],
			connectors: ['orthogonal', 'straight', 'keep'], connector: 'orthogonal', corners: 'rounded',
			checks: ['resizeNodes', 'preserveOrigin']},
		tree: {layout: 'elkTree', name: 'layoutTree', elk: 'mrtree', directions: true,
			shapes: ['elk.spacing.nodeNode', 20], connectors: ['auto', 'orthogonal', 'straight', 'keep'],
			connector: 'auto', corners: 'keep', checks: ['sharedStems', 'resizeNodes', 'preserveOrigin']},
		radial: {layout: 'elkRadial', name: 'radialTree', elk: 'radial',
			shapes: ['elk.spacing.nodeNode', 20], connectors: ['auto', 'orthogonal', 'straight', 'keep'],
			connector: 'auto', corners: 'keep', checks: ['resizeNodes', 'preserveOrigin']},
		mindmap: {layout: 'MindmapLayout', name: 'mindmap', shapes: ['nodeDistance', 10],
			levels: ['levelDistance', 40], checks: ['resetConnectionPoints']},
		orgChart: {layout: 'mxOrgChartLayout', name: 'orgChart', shapes: ['siblingSpacing', 20],
			levels: ['parentChildSpacing', 20]},
		balloon: {layout: 'BalloonTreeLayout', name: 'balloonTree', shapes: ['nodeDistance', 10],
			levels: ['levelDistance', 30], checks: ['resetConnectionPoints', 'straightConnectors']},
		organic: {layout: 'elkOrganic', name: 'layoutSpreadOut', elk: 'force',
			shapes: ['elk.spacing.nodeNode', 30], connectors: ['auto', 'orthogonal', 'straight', 'keep'],
			connector: 'auto', corners: 'keep', checks: ['resizeNodes', 'preserveOrigin']},
		circle: {layout: 'mxCircleLayout', name: 'circle'},
		connectors: {layout: 'orthogonalEdge', name: 'layoutConnectorsOnly', shapes: ['shapeBufferDistance', 16]}
	};

	/**
	 * Order of the layout types in the form.
	 */
	EditorUi.layoutTypeOrder = ['flow', 'tree', 'radial', 'mindmap', 'orgChart',
		'balloon', 'organic', 'circle', 'connectors'];

	/**
	 * Tiles of the layout picker with the type, the direction and the resource
	 * keys of the name and of the hint.
	 */
	EditorUi.layoutPickerEntries = [
		{id: 'verticalFlow', type: 'flow', direction: 'DOWN', name: 'layoutFlowDown', hint: 'layoutFlowDownHint'},
		{id: 'horizontalFlow', type: 'flow', direction: 'RIGHT', name: 'layoutFlowRight', hint: 'layoutFlowRightHint'},
		{id: 'verticalTree', type: 'tree', direction: 'DOWN', name: 'layoutTreeDown', hint: 'layoutTreeDownHint'},
		{id: 'horizontalTree', type: 'tree', direction: 'RIGHT', name: 'layoutTreeRight', hint: 'layoutTreeRightHint'},
		{id: 'radialTree', type: 'radial', name: 'radialTree', hint: 'layoutRadialHint'},
		{id: 'mindmap', type: 'mindmap', name: 'mindmap', hint: 'layoutMindmapHint'},
		{id: 'organic', type: 'organic', name: 'layoutSpreadOut', hint: 'layoutSpreadOutHint'},
		{id: 'circle', type: 'circle', name: 'circle', hint: 'layoutCircleHint'},
		{id: 'tidyConnectors', type: 'connectors', name: 'layoutConnectorsOnly', hint: 'layoutConnectorsOnlyHint'}
	];

	/**
	 * Factors of the spacings of Compact, Normal and Airy.
	 */
	EditorUi.layoutSpacings = {compact: 0.5, normal: 1, airy: 2};

	/**
	 * Largest spacing of the form.
	 */
	EditorUi.maxLayoutSpacing = 1000;

	/**
	 * Returns true if the layouts of the given type are loaded.
	 */
	EditorUi.isLayoutTypeAvailable = function(type)
	{
		var t = EditorUi.layoutTypes[type];

		return t != null && (t.elk == null || (typeof ElkLayout !== 'undefined' &&
			ElkLayout.MENU_PRESETS != null)) && (type != 'orgChart' ||
			typeof mxOrgChartLayout !== 'undefined') && (type != 'connectors' ||
			typeof LibavoidRouting !== 'undefined');
	};

	/**
	 * Returns a copy of the given object without the keys that change
	 * prototypes (the object is untrusted JSON).
	 */
	EditorUi.copyLayoutObject = function(obj)
	{
		var result = {};

		if (obj != null && typeof obj === 'object' && !Array.isArray(obj))
		{
			for (var key in obj)
			{
				if (Object.prototype.hasOwnProperty.call(obj, key) && key != '__proto__' &&
					key != 'constructor' && key != 'prototype')
				{
					result[key] = obj[key];
				}
			}
		}

		return result;
	};

	/**
	 * Returns the given value as a spacing of the form or the given default.
	 */
	EditorUi.getLayoutSpacing = function(value, defaultValue)
	{
		var n = (typeof value === 'number' || typeof value === 'string') ? parseFloat(value) : NaN;

		return (isFinite(n) && n >= 0) ? Math.min(EditorUi.maxLayoutSpacing, n) : defaultValue;
	};

	/**
	 * Returns the values of the form with the defaults of the given type and
	 * the spacings of the given preset (see layoutSpacings).
	 */
	EditorUi.getLayoutFormDefaults = function(type, preset)
	{
		var t = EditorUi.layoutTypes[type];
		var f = EditorUi.layoutSpacings[preset] || 1;
		var values = {type: type, direction: 'DOWN', connector: t.connector || 'auto',
			corners: t.corners || 'keep', resizeNodes: false, preserveOrigin: true,
			sharedStems: true, resetConnectionPoints: false, straightConnectors: false};

		if (t.elk == 'layered' && typeof ElkLayout !== 'undefined' &&
			ElkLayout.CANONICAL_EDGE != null && ElkLayout.CANONICAL_EDGE.corners != null)
		{
			values.corners = ElkLayout.CANONICAL_EDGE.corners;
		}

		if (t.shapes != null)
		{
			values.shapes = Math.round(t.shapes[1] * f);
		}

		if (t.levels != null)
		{
			values.levels = Math.round(t.levels[1] * f);
		}

		if (type == 'connectors' && typeof LibavoidRouting !== 'undefined' &&
			isFinite(LibavoidRouting.shapeBufferDistance))
		{
			values.shapes = Math.round(LibavoidRouting.shapeBufferDistance * f);
		}

		return values;
	};

	/**
	 * Returns the preset of the spacings in the given values or null, also
	 * for types without spacings (circle).
	 */
	EditorUi.getLayoutSpacingPreset = function(values)
	{
		if (EditorUi.layoutTypes[values.type].shapes == null)
		{
			return null;
		}

		for (var key in EditorUi.layoutSpacings)
		{
			var defaults = EditorUi.getLayoutFormDefaults(values.type, key);

			if (defaults.shapes === values.shapes && defaults.levels === values.levels)
			{
				return key;
			}
		}

		return null;
	};

	/**
	 * Returns the values of the form for the given {layout, config} entry or
	 * null if the form can't show the entry. Container is true if the entry
	 * is applied to layout containers.
	 */
	EditorUi.getLayoutFormValues = function(entry, container)
	{
		entry = (entry != null && typeof entry === 'object') ? Graph.replaceLegacyLayout(entry) : null;

		if (entry == null || typeof entry.layout !== 'string')
		{
			return null;
		}

		var type = null;

		for (var key in EditorUi.layoutTypes)
		{
			if (EditorUi.layoutTypes[key].layout === entry.layout)
			{
				type = key;
			}
		}

		if (type == null)
		{
			return null;
		}

		var t = EditorUi.layoutTypes[type];
		var config = EditorUi.copyLayoutObject(entry.config);
		var values = EditorUi.getLayoutFormDefaults(type);

		if (t.shapes != null)
		{
			values.shapes = EditorUi.getLayoutSpacing(config[t.shapes[0]], values.shapes);
		}

		if (t.levels != null)
		{
			values.levels = EditorUi.getLayoutSpacing(config[t.levels[0]], values.levels);
		}

		if (t.elk != null)
		{
			var direction = config['elk.direction'];

			// ELK lays out layered graphs from left to right by default
			values.direction = (direction == 'DOWN' || direction == 'RIGHT' || direction == 'UP' ||
				direction == 'LEFT') ? direction : ((t.elk == 'layered') ? 'RIGHT' : 'DOWN');

			if (t.elk == 'layered')
			{
				values.connector = (config.edgeStyle == 'keep') ? 'keep' :
					((config['elk.edgeRouting'] == 'POLYLINE' || config.edgeStyle == 'straight') ?
					'straight' : 'orthogonal');
			}
			else
			{
				values.connector = (config.edgeStyle == 'orthogonal' || config.edgeStyle == 'straight' ||
					config.edgeStyle == 'keep') ? config.edgeStyle : 'auto';
			}

			values.corners = (config.corners == 'straight' || config.corners == 'rounded' ||
				config.corners == 'curved') ? config.corners : 'keep';
			// Without the key, the ELK bridge resizes the shapes, but layout
			// containers get resizeNodes=false (see createContainerChildLayout)
			values.resizeNodes = (config.resizeNodes != null) ? !!config.resizeNodes : !container;
			values.preserveOrigin = config.preserveOrigin === true;
			values.sharedStems = config.sharedStems !== false;
		}
		else if (EditorUi.getLayoutDialog(entry.layout) != null)
		{
			var options = EditorUi.getLayoutDialogOptions(entry.layout, config);
			values.resetConnectionPoints = options.resetConnectionPoints === true;
			values.straightConnectors = options.straightConnectors === true;
		}

		return values;
	};

	/**
	 * Returns the config of the layout of the given values of the form.
	 */
	EditorUi.getLayoutFormConfig = function(values)
	{
		var t = EditorUi.layoutTypes[values.type];
		var config = {};

		if (t.elk != null)
		{
			// Same options as the ELK dialog (see ElkLayout.runWithDialog)
			var layoutOptions = {};
			var runOptions = {applierOptions: {resizeParent: values.resizeNodes},
				corners: values.corners, preserveOrigin: values.preserveOrigin};

			if (t.directions)
			{
				layoutOptions['elk.direction'] = values.direction;
			}

			layoutOptions[t.shapes[0]] = values.shapes;

			if (t.levels != null)
			{
				layoutOptions[t.levels[0]] = values.levels;
			}

			if (t.elk == 'layered')
			{
				if (values.connector == 'straight')
				{
					layoutOptions['elk.edgeRouting'] = 'POLYLINE';
					runOptions.edgeStyleMode = 'straight';
				}
				else if (values.connector == 'keep')
				{
					runOptions.edgeStyleMode = 'keep';
				}
				else
				{
					layoutOptions['elk.edgeRouting'] = 'ORTHOGONAL';
					runOptions.edgeStyleMode = ((typeof ElkLayout !== 'undefined') ?
						(ElkLayout.CANONICAL_EDGE || {}).edgeStyleMode : null) ||
						'orthogonalEdgeStyle';
				}
			}
			else
			{
				runOptions.edgeStyleMode = values.connector;
			}

			if (values.type == 'tree' && !values.sharedStems)
			{
				runOptions.sharedStems = false;
			}

			config = Graph.elkOptionsToConfig(layoutOptions, runOptions);
		}
		else if (values.type == 'orgChart')
		{
			config = EditorUi.getOrgChartConfig(EditorUi.getOrgChartOptions(
				{parentChildSpacing: values.levels, siblingSpacing: values.shapes}));
		}
		else
		{
			if (t.shapes != null)
			{
				config[t.shapes[0]] = values.shapes;
			}

			if (t.levels != null)
			{
				config[t.levels[0]] = values.levels;
			}

			if (t.checks != null)
			{
				for (var i = 0; i < t.checks.length; i++)
				{
					config[t.checks[i]] = values[t.checks[i]] === true;
				}
			}
		}

		return config;
	};

	/**
	 * Returns the {layout, config} entry of the given values of the form.
	 * If a base entry of the same type and its values when the form showed
	 * it are given, then the config of the base gets the values that differ
	 * from the initial values and keeps all other keys, eg. the keys that
	 * the form does not show (see EditorUi.mergeLayoutConfig).
	 */
	EditorUi.createLayoutFormEntry = function(values, base, initial)
	{
		var t = EditorUi.layoutTypes[values.type];
		var config = EditorUi.getLayoutFormConfig(values);
		var entry = {layout: t.layout};

		if (base != null && initial != null && initial.type == values.type)
		{
			base = Graph.replaceLegacyLayout(base);
			entry = EditorUi.copyLayoutObject(base);
			entry.layout = t.layout;
			config = EditorUi.mergeLayoutConfig(EditorUi.copyLayoutObject(base.config),
				EditorUi.getLayoutFormConfig(initial), config);
		}

		entry.config = config;

		return entry;
	};

	/**
	 * Returns the custom layout of the tile of the layout picker with the
	 * given spacing preset.
	 */
	EditorUi.getLayoutPickerList = function(pickerEntry, preset)
	{
		var values = EditorUi.getLayoutFormDefaults(pickerEntry.type, preset);

		if (pickerEntry.direction != null)
		{
			values.direction = pickerEntry.direction;
		}

		return [EditorUi.createLayoutFormEntry(values)];
	};

	/**
	 * Returns the childLayout for the given custom layout in layout
	 * containers: circle is the circleLayout string, as the JSON form is not
	 * safe in containers (see setContainerChildLayout).
	 */
	EditorUi.getContainerLayoutSpec = function(list)
	{
		return (list.length == 1 && list[0] != null && list[0].layout == 'mxCircleLayout') ?
			'circleLayout' : list;
	};

	/**
	 * Returns what a layout run from the picker or the form lays out:
	 * {containers} for selected layout containers (see
	 * getSelectedLayoutContainers), {parent} for a selected group or the
	 * default parent and {parent, cells} for selected vertices with the same
	 * parent, where cells has the vertices and the connectors between them.
	 */
	EditorUi.prototype.getLayoutScope = function()
	{
		var graph = this.editor.graph;
		var model = graph.model;
		var containers = this.getSelectedLayoutContainers();

		if (containers.length > 0)
		{
			return {containers: containers, parent: containers[0]};
		}

		var vertices = [];
		var sel = graph.getSelectionCells();

		for (var i = 0; i < sel.length; i++)
		{
			if (model.isVertex(sel[i]))
			{
				vertices.push(sel[i]);
			}
		}

		// Groups like ElkLayout.run, but not tables, stacks and racks
		if (vertices.length == 1 && model.getChildCount(vertices[0]) > 1 &&
			graph.getCellStyle(vertices[0])['childLayout'] == null &&
			!graph.isTable(vertices[0]))
		{
			return {parent: vertices[0]};
		}
		else if (vertices.length > 1)
		{
			var parent = model.getParent(vertices[0]);
			var lookup = new mxDictionary();

			for (var i = 0; i < vertices.length; i++)
			{
				if (model.getParent(vertices[i]) != parent)
				{
					return {parent: graph.getDefaultParent()};
				}

				lookup.put(vertices[i], true);
			}

			var cells = vertices.slice();
			var edges = new mxDictionary();

			for (var i = 0; i < vertices.length; i++)
			{
				for (var j = 0; j < model.getEdgeCount(vertices[i]); j++)
				{
					var edge = model.getEdgeAt(vertices[i], j);

					if (!edges.get(edge) && lookup.get(model.getTerminal(edge, true)) &&
						lookup.get(model.getTerminal(edge, false)))
					{
						edges.put(edge, true);
						cells.push(edge);
					}
				}
			}

			return {parent: parent, cells: cells};
		}

		return {parent: graph.getDefaultParent()};
	};

	/**
	 * Returns the vertices and the connectors between them of the given scope
	 * (see getLayoutScope) or null if there are more than max cells.
	 */
	EditorUi.prototype.getLayoutScopeCells = function(scope, max)
	{
		var model = this.editor.graph.model;
		var cells = (scope.cells != null) ? scope.cells.slice() :
			(model.getChildren(scope.parent) || []).slice();

		return (cells.length <= max) ? cells : null;
	};

	/**
	 * Returns the ID of the tile of the layout picker that suits the given
	 * scope or null: a tree for trees without decisions, a flow for other
	 * graphs without cycles and spread out for graphs with cycles. Takes
	 * linear time.
	 */
	EditorUi.prototype.getSuggestedLayout = function(scope)
	{
		var graph = this.editor.graph;
		var model = graph.model;
		var cells = this.getLayoutScopeCells(scope, 5000);
		var result = null;

		if (cells != null)
		{
			var index = new mxDictionary();
			var vertices = [];
			var edges = [];
			var decisions = false;

			for (var i = 0; i < cells.length; i++)
			{
				if (model.isVertex(cells[i]))
				{
					var style = graph.getCellStyle(cells[i]);
					var shape = String(style[mxConstants.STYLE_SHAPE]);
					decisions = decisions || shape == 'rhombus' ||
						shape == 'mxgraph.flowchart.decision';
					index.put(cells[i], vertices.length);
					vertices.push([]);
				}
			}

			var incoming = [];

			for (var i = 0; i < vertices.length; i++)
			{
				incoming.push(0);
			}

			for (var i = 0; i < cells.length; i++)
			{
				if (model.isEdge(cells[i]))
				{
					var s = index.get(model.getTerminal(cells[i], true));
					var t = index.get(model.getTerminal(cells[i], false));

					if (s != null && t != null && s != t)
					{
						vertices[s].push(t);
						incoming[t]++;
						edges.push(cells[i]);
					}
				}
			}

			if (edges.length > 0)
			{
				// Kahn's algorithm finds cycles
				var queue = [];
				var counts = incoming.slice();
				var tree = true;
				var visited = 0;

				for (var i = 0; i < counts.length; i++)
				{
					tree = tree && counts[i] <= 1;

					if (counts[i] == 0)
					{
						queue.push(i);
					}
				}

				for (var i = 0; i < queue.length; i++)
				{
					var targets = vertices[queue[i]];
					visited++;

					for (var j = 0; j < targets.length; j++)
					{
						if (--counts[targets[j]] == 0)
						{
							queue.push(targets[j]);
						}
					}
				}

				if (visited < vertices.length)
				{
					result = 'organic';
				}
				else
				{
					result = (tree && !decisions) ? 'verticalTree' : 'verticalFlow';
				}
			}
		}

		return result;
	};

	/**
	 * Returns the descendants of the given cell and the connectors between
	 * them that are stored in other parents.
	 */
	EditorUi.prototype.getLayoutGroupCells = function(parent)
	{
		var model = this.editor.graph.model;
		var lookup = new mxDictionary();
		var result = [];
		var stack = [parent];

		while (stack.length > 0)
		{
			var cell = stack.pop();

			for (var i = 0; i < model.getChildCount(cell); i++)
			{
				var child = model.getChildAt(cell, i);
				lookup.put(child, true);
				result.push(child);
				stack.push(child);
			}
		}

		for (var i = 0, n = result.length; i < n; i++)
		{
			for (var j = 0; j < model.getEdgeCount(result[i]); j++)
			{
				var edge = model.getEdgeAt(result[i], j);

				if (!lookup.get(edge) && lookup.get(model.getTerminal(edge, true)) &&
					lookup.get(model.getTerminal(edge, false)))
				{
					lookup.put(edge, true);
					result.push(edge);
				}
			}
		}

		return result;
	};

	/**
	 * Names of the layouts that only route connectors and never move shapes
	 * (Connectors only, see isRoutingLayout).
	 */
	EditorUi.routingLayouts = ['orthogonalEdge', 'mxParallelEdgeLayout'];

	/**
	 * Returns true if the given {layout, config} entry only routes
	 * connectors (see routingLayouts and keepLockedGeometries).
	 */
	EditorUi.isRoutingLayout = function(entry)
	{
		entry = (entry != null && typeof entry === 'object') ? Graph.replaceLegacyLayout(entry) : null;

		return entry != null && mxUtils.indexOf(EditorUi.routingLayouts, entry.layout) >= 0;
	};

	/**
	 * Returns {layouts, routing} for the given custom layout, where routing
	 * has true for each layout that only routes connectors (see
	 * isRoutingLayout). Graph.createLayouts skips removed layouts, so each
	 * entry is created on its own. An entry with a function initLayout gets
	 * the graph and each of its layouts (Org Chart in Fusion keeps its
	 * place, keepSimpleLayoutOrigin); stored specs are JSON, which has no
	 * functions, so only the code of the app sets it.
	 */
	EditorUi.createLayoutRuns = function(graph, list)
	{
		var result = {layouts: [], routing: []};

		for (var i = 0; i < list.length; i++)
		{
			var layouts = graph.createLayouts([list[i]]);

			for (var j = 0; j < layouts.length; j++)
			{
				if (list[i] != null && typeof list[i].initLayout === 'function')
				{
					list[i].initLayout(graph, layouts[j]);
				}

				result.layouts.push(layouts[j]);
				result.routing.push(EditorUi.isRoutingLayout(list[i]));
			}
		}

		return result;
	};

	/**
	 * Returns a function that runs the given function, which writes the
	 * geometries of a layout of the given cells, their descendants and their
	 * connectors, without its writes to the cells that cannot move (locked,
	 * movable=0, also in a locked layer or container, also the ends of the
	 * connectors in other parents and layers): shapes and connectors
	 * that cannot move keep their geometries and styles, connectors between
	 * two such shapes too. A connector from one such shape gets the geometry
	 * of the layout without its waypoints if the layout would have moved or
	 * resized the shape (also a locked container of it), as the waypoints are
	 * for the place where the shape is not, else its geometry of the layout.
	 * If routing is true (the layout only routes connectors, see
	 * isRoutingLayout), connectors at such shapes keep their geometries and
	 * styles, like the shapes keep their places (#1210). The layouts of the
	 * picker (ELK, trees, mind maps, circle) would else move locked shapes
	 * and connectors (w94m S2, M3). Without such cells the function runs as
	 * it is. The optional isLocked returns true for the cells that cannot
	 * move, eg. for the copies of a picture, whose layer is not the locked
	 * layer or container of the cells they copy (default is
	 * graph.isCellMovable).
	 */
	EditorUi.keepLockedGeometries = function(graph, cells, fn, isLocked, routing)
	{
		return function()
		{
			var model = graph.model;
			var locked = new mxDictionary();
			var visited = new mxDictionary();
			var checked = new mxDictionary();
			var stack = (cells != null) ? cells.slice() : [];
			var count = 0;

			var check = function(cell)
			{
				if (cell != null && !checked.get(cell))
				{
					checked.put(cell, true);

					if ((model.isVertex(cell) || model.isEdge(cell)) && ((isLocked != null) ?
						isLocked(cell) : !graph.isCellMovable(cell)))
					{
						locked.put(cell, true);
						count++;
					}
				}
			};

			// Cells, descendants and connectors, also connectors in other parents,
			// and the ends of the connectors, also in other parents and layers
			while (stack.length > 0)
			{
				var cell = stack.pop();

				if (cell != null && !visited.get(cell))
				{
					visited.put(cell, true);
					check(cell);

					if (model.isEdge(cell))
					{
						check(model.getTerminal(cell, true));
						check(model.getTerminal(cell, false));
					}

					for (var i = 0; i < model.getChildCount(cell); i++)
					{
						stack.push(model.getChildAt(cell, i));
					}

					for (var i = 0; i < model.getEdgeCount(cell); i++)
					{
						stack.push(model.getEdgeAt(cell, i));
					}
				}
			}

			if (count == 0)
			{
				return fn.apply(this, arguments);
			}

			var isKept = function(cell)
			{
				return cell != null && locked.get(cell) === true;
			};

			// Connectors whose ends are both kept or, for layouts that only
			// route connectors, one of them
			var isFixed = function(cell)
			{
				if (model.isEdge(cell))
				{
					var source = isKept(model.getTerminal(cell, true));
					var target = isKept(model.getTerminal(cell, false));

					return (source && target) || (routing === true && (source || target));
				}

				return false;
			};

			// Kept shapes that the layout would have moved or resized
			var blocked = new mxDictionary();

			// True if the layout would have moved or resized the given kept
			// shape or a kept ancestor (a locked container)
			var isBlocked = function(cell)
			{
				while (isKept(cell))
				{
					if (blocked.get(cell))
					{
						return true;
					}

					cell = model.getParent(cell);
				}

				return false;
			};

			// Connectors at a kept shape that got the waypoints of the layout
			// before it was known that the layout would have moved the shape
			var pending = [];

			var removePoints = function(cell, geo)
			{
				if (geo != null && geo.points != null && geo.points.length > 0 &&
					(isBlocked(model.getTerminal(cell, true)) ||
					isBlocked(model.getTerminal(cell, false))))
				{
					geo = geo.clone();
					geo.points = null;
				}

				return geo;
			};

			var ownGeometry = Object.prototype.hasOwnProperty.call(model, 'setGeometry');
			var ownStyle = Object.prototype.hasOwnProperty.call(model, 'setStyle');
			var setGeometry = model.setGeometry;
			var setStyle = model.setStyle;

			model.setGeometry = function(cell, geo)
			{
				if (isKept(cell) || isFixed(cell))
				{
					var current = model.getGeometry(cell);

					// Moves and resizes by less than a pixel don't count
					if (geo != null && model.isVertex(cell) && (current == null ||
						!(Math.abs(geo.x - current.x) < 1 && Math.abs(geo.y - current.y) < 1 &&
						Math.abs(geo.width - current.width) < 1 &&
						Math.abs(geo.height - current.height) < 1)))
					{
						blocked.put(cell, true);
					}

					return geo;
				}
				else if (geo != null && geo.points != null && geo.points.length > 0 && model.isEdge(cell) &&
					(isKept(model.getTerminal(cell, true)) || isKept(model.getTerminal(cell, false))))
				{
					var result = removePoints(cell, geo);

					if (result == geo)
					{
						pending.push(cell);
					}

					geo = result;
				}

				return setGeometry.call(this, cell, geo);
			};

			model.setStyle = function(cell, style)
			{
				return (isKept(cell) || isFixed(cell)) ? style : setStyle.apply(this, arguments);
			};

			try
			{
				var result = fn.apply(this, arguments);

				// Shapes that the layout would have moved after it wrote their
				// connectors
				for (var i = 0; i < pending.length; i++)
				{
					var geo = model.getGeometry(pending[i]);
					var next = removePoints(pending[i], geo);

					if (next != geo)
					{
						setGeometry.call(model, pending[i], next);
					}
				}

				return result;
			}
			finally
			{
				if (ownGeometry)
				{
					model.setGeometry = setGeometry;
				}
				else
				{
					delete model.setGeometry;
				}

				if (ownStyle)
				{
					model.setStyle = setStyle;
				}
				else
				{
					delete model.setStyle;
				}
			}
		};
	};

	/**
	 * Runs the given custom layout (see resolveLayoutList) in the given scope
	 * (see getLayoutScope, default is the current scope) and records it for
	 * Run Last Layout. Selected layout containers get the layout as their
	 * child layout. Each layout of the list is an undoable edit. If animate is
	 * false the cells move at once, else with the morph of executeLayout.
	 */
	EditorUi.prototype.applyLayoutList = function(list, scope, done, animate)
	{
		var graph = this.editor.graph;
		scope = (scope != null) ? scope : this.getLayoutScope();
		animate = animate !== false;

		if (scope.containers != null)
		{
			var spec = EditorUi.getContainerLayoutSpec(list);

			if (spec != 'circleLayout')
			{
				this.lastLayoutSpec = list;
			}

			this.applyLayoutToSelectedContainers(spec);

			if (done != null)
			{
				done();
			}

			return;
		}

		var runs = EditorUi.createLayoutRuns(graph, list);
		var layouts = runs.layouts;
		var parent = scope.parent;
		this.lastLayoutSpec = list;

		if (scope.cells != null)
		{
			// Connectors outside the selection stay (see scopeLayoutsToCells)
			this.scopeLayoutsToCells(layouts, scope.cells, true);

			// Keeps ignoring ties (see Graph.createLayouts)
			for (var i = 0; i < layouts.length; i++)
			{
				if (typeof ElkLayout !== 'undefined' && layouts[i] instanceof ElkLayout)
				{
					layouts[i].cellFilter = graph.createTieFilter(layouts[i].cellFilter);
				}
			}
		}
		else if (parent != graph.getDefaultParent())
		{
			// Layouts that don't take their cells from the parent (libavoid
			// routes the selected or all connectors of the page) get the cells
			// of the selected group
			var adapters = [];

			for (var i = 0; i < layouts.length; i++)
			{
				if (layouts[i].cellFilter === null && (typeof ElkLayout === 'undefined' ||
					!(layouts[i] instanceof ElkLayout)))
				{
					adapters.push(layouts[i]);
				}
			}

			if (adapters.length > 0)
			{
				this.scopeLayoutsToCells(adapters, this.getLayoutGroupCells(parent));
			}
		}

		var idx = 0;
		var finished = false;

		// Locked shapes keep their geometries (w94m S2, M3). On the page, the
		// cells of all layers, as Connectors only routes the connectors of all
		// layers (LibavoidRouting.getTargetEdges, review of #1243)
		var lockedCells = (scope.cells != null) ? scope.cells :
			((parent == graph.getDefaultParent()) ? [graph.model.getRoot()] : [parent]);

		// Ends the list once, also after an error or if the parent is gone
		// (the layouts after it do not run)
		var finish = function()
		{
			idx = layouts.length;

			if (!finished)
			{
				finished = true;

				if (done != null)
				{
					done();
				}
			}
		};

		var next = mxUtils.bind(this, function()
		{
			if (idx >= layouts.length)
			{
				finish();

				return;
			}

			var routing = runs.routing[idx];
			var layout = layouts[idx++];

			if (typeof layout.prepare === 'function')
			{
				var spinning = this.spinner.spin(document.body, mxResources.get('loading'));

				layout.prepare(parent, mxUtils.bind(this, function(err, apply)
				{
					if (spinning)
					{
						this.spinner.stop();
					}

					if (err != null)
					{
						this.handleError(err);
						finish();
					}
					else if (graph.model.contains(parent))
					{
						// executeLayout runs its callback also if the layout
						// throws, the layouts after it must not run then
						var failed = false;

						this.tryAndHandle(mxUtils.bind(this, function()
						{
							this.executeLayout(EditorUi.keepLockedGeometries(graph,
								lockedCells, function()
							{
								failed = true;
								apply();
								failed = false;
							}, null, routing), animate, function()
							{
								if (!failed)
								{
									next();
								}
							});
						}), mxUtils.bind(this, function(e)
						{
							this.handleError(e);
							finish();
						}));
					}
					else
					{
						finish();
					}
				}));
			}
			else
			{
				// executeLayout runs its callback also if the layout throws,
				// the layouts after it must not run then
				var failed = false;

				this.tryAndHandle(mxUtils.bind(this, function()
				{
					this.executeLayout(EditorUi.keepLockedGeometries(graph, lockedCells, function()
					{
						failed = true;
						layout.execute(parent);

						// Like Arrange > Layout > Circle
						if (layout instanceof mxCircleLayout && graph.model.isVertex(parent))
						{
							graph.updateGroupBounds([parent], graph.gridSize * 2, true);
						}

						failed = false;
					}, null, routing), animate, function()
					{
						if (!failed)
						{
							next();
						}
					});
				}), mxUtils.bind(this, function(e)
				{
					this.handleError(e);
					finish();
				}));
			}
		});

		next();
	};

	/**
	 * Pictures of layouts of the cells of the given scope (see
	 * getLayoutScope) in small graphs. The layouts run one after the other.
	 * Scopes with more than maxCells cells, and the pictures of a pass (see
	 * startPass) after its layouts took timeLimit ms, show the layout of an
	 * example.
	 */
	var LayoutPreviews = function(editorUi, scope)
	{
		this.editorUi = editorUi;
		this.graph = editorUi.editor.graph;
		this.jobs = [];
		this.graphs = [];
		this.time = 0;
		this.pass = 0;
		this.setScope(scope);
	};

	/**
	 * Copies the cells of the given scope for the next pictures. The pictures
	 * stay until they are replaced, but are no results (see getResult).
	 */
	LayoutPreviews.prototype.setScope = function(scope)
	{
		var editorUi = this.editorUi;
		var cells = editorUi.getLayoutScopeCells(scope, LayoutPreviews.maxCells);
		this.parent = (scope != null) ? scope.parent : null;
		this.cells = null;
		this.sources = null;
		this.locked = null;
		this.jobs = [];

		for (var i = 0; i < this.graphs.length; i++)
		{
			this.graphs[i].layoutPreviewStale = true;
		}

		if (cells != null)
		{
			var model = this.graph.model;
			var count = 0;

			// Counts the descendants, which are copied
			var visit = function(cell)
			{
				count++;

				for (var i = 0; i < model.getChildCount(cell) &&
					count <= LayoutPreviews.maxCells; i++)
				{
					visit(model.getChildAt(cell, i));
				}
			};

			for (var i = 0; i < cells.length && count <= LayoutPreviews.maxCells; i++)
			{
				visit(cells[i]);
			}

			if (count > 0 && count <= LayoutPreviews.maxCells)
			{
				this.cells = model.cloneCells(cells, true);
				this.sources = cells;
				this.locked = this.getLockedCopies(cells, this.cells);
			}
		}
	};

	/**
	 * Returns the copies in the given clones of the given cells of the graph
	 * of the editor whose cells cannot move there (see keepLockedGeometries),
	 * also as children of a locked layer or container, or null if there are
	 * none. The copies are in the unlocked layer of a picture, so the
	 * pictures keep the shapes and connectors that Apply keeps.
	 */
	LayoutPreviews.prototype.getLockedCopies = function(cells, clones)
	{
		var graph = this.graph;
		var model = graph.model;
		var result = null;
		var stack = [];

		for (var i = 0; i < cells.length && i < clones.length; i++)
		{
			stack.push([cells[i], clones[i]]);
		}

		while (stack.length > 0)
		{
			var pair = stack.pop();

			if ((model.isVertex(pair[0]) || model.isEdge(pair[0])) && !graph.isCellMovable(pair[0]))
			{
				result = (result != null) ? result : new mxDictionary();
				result.put(pair[1], true);
			}

			for (var i = 0; i < model.getChildCount(pair[0]) && i < pair[1].getChildCount(); i++)
			{
				stack.push([model.getChildAt(pair[0], i), pair[1].getChildAt(i)]);
			}
		}

		return result;
	};

	/**
	 * Returns a function for keepLockedGeometries that returns true for the
	 * given clones of cells whose cells are locked (see getLockedCopies).
	 */
	LayoutPreviews.prototype.createLockedTest = function(clones)
	{
		var locked = this.locked;
		var lookup = new mxDictionary();
		var stack = [];

		for (var i = 0; locked != null && i < this.cells.length && i < clones.length; i++)
		{
			stack.push([this.cells[i], clones[i]]);
		}

		while (stack.length > 0)
		{
			var pair = stack.pop();

			if (locked.get(pair[0]))
			{
				lookup.put(pair[1], true);
			}

			for (var i = 0; i < pair[0].getChildCount() && i < pair[1].getChildCount(); i++)
			{
				stack.push([pair[0].getChildAt(i), pair[1].getChildAt(i)]);
			}
		}

		return function(cell)
		{
			return lookup.get(cell) === true;
		};
	};

	/**
	 * Largest number of cells of a picture of the scope.
	 */
	LayoutPreviews.maxCells = 200;

	/**
	 * Time in ms of the layouts of a pass after which its pictures show the
	 * example.
	 */
	LayoutPreviews.timeLimit = 2000;

	/**
	 * Time in ms after which a picture is skipped, eg. while libavoid loads.
	 */
	LayoutPreviews.jobTimeout = 4000;

	/**
	 * Longest wait in ms for an idle period before the next picture of
	 * previews with idle (see next).
	 */
	LayoutPreviews.idleTimeout = 250;

	/**
	 * If true, each picture waits for an idle period of the page (at most
	 * idleTimeout ms), else for the next frame.
	 */
	LayoutPreviews.prototype.idle = false;

	/**
	 * Cells of the scope or null for the example.
	 */
	LayoutPreviews.prototype.cells = null;

	/**
	 * Cells of the graph whose copies are in cells.
	 */
	LayoutPreviews.prototype.sources = null;

	/**
	 * Copies in cells of the cells that cannot move (see getLockedCopies).
	 */
	LayoutPreviews.prototype.locked = null;

	/**
	 * Set when the previews are destroyed.
	 */
	LayoutPreviews.prototype.destroyed = false;

	/**
	 * Starts a pass of pictures with a new time budget, eg. the pictures of
	 * all tiles or the preview after a change.
	 */
	LayoutPreviews.prototype.startPass = function()
	{
		this.pass++;
		this.time = 0;
	};

	/**
	 * Shows the given custom layout in the given container of the given size
	 * and calls done with true if the picture shows the example and true if
	 * the layout failed. With fallback, failed layouts show the example, and
	 * with example the picture is the example (eg. Tidy up on a page that is
	 * too large to analyse in idle time). Replaces the pending picture of the
	 * container.
	 */
	LayoutPreviews.prototype.render = function(container, list, w, h, done, fallback, example)
	{
		for (var i = 0; i < this.jobs.length; i++)
		{
			if (this.jobs[i].container == container)
			{
				this.jobs.splice(i, 1);
				break;
			}
		}

		this.jobs.push({container: container, list: list, w: w, h: h, done: done,
			fallback: fallback, pass: this.pass, example: example === true});

		for (var i = 0; i < this.graphs.length; i++)
		{
			if (this.graphs[i].container == container)
			{
				this.graphs[i].layoutPreviewStale = true;
			}
		}

		if (!this.running)
		{
			this.next();
		}
	};

	/**
	 * Runs the next job after the next frame: each picture takes 15-30 ms, so
	 * the panel paints first and taps, hovers and the other work of the page
	 * get a gap between the pictures (in a hidden page, which has no frames,
	 * after the current event). With idle, the job waits for an idle period
	 * of the page instead (at most idleTimeout ms).
	 */
	LayoutPreviews.prototype.next = function()
	{
		this.running = this.jobs.length > 0 && !this.destroyed;

		if (this.running)
		{
			var run = mxUtils.bind(this, function()
			{
				if (!this.destroyed && this.jobs.length > 0)
				{
					this.run(this.jobs.shift());
				}
				else
				{
					this.running = false;
				}
			});

			if (this.idle && typeof window.requestIdleCallback === 'function' &&
				document.visibilityState != 'hidden')
			{
				window.requestIdleCallback(run, {timeout: LayoutPreviews.idleTimeout});
			}
			else if (typeof window.requestAnimationFrame === 'function' && document.visibilityState != 'hidden')
			{
				window.requestAnimationFrame(function()
				{
					window.setTimeout(run, 0);
				});
			}
			else
			{
				window.setTimeout(run, 0);
			}
		}
	};

	/**
	 * Parent of the cells of the scope in the graph of the editor.
	 */
	LayoutPreviews.prototype.parent = null;

	/**
	 * Creates the graph of a picture in the given container. The cells look
	 * as in the page (w94m B3): the graph has the data of the root of the
	 * page (style rules and the variables of the page), the hidden tags, the
	 * colors of the theme and the measure scale, and placeholders are looked
	 * up in the parent of the scope and its ancestors and in the global
	 * variables of the page.
	 */
	LayoutPreviews.prototype.createGraph = function(container)
	{
		var source = this.graph;
		var graph = new Graph(container, null, null, source.getStylesheet());
		graph.resetViewOnRootChange = false;
		graph.foldingEnabled = false;
		graph.gridEnabled = false;
		graph.autoScroll = false;
		graph.setTooltips(false);
		graph.setConnectable(false);
		graph.setPanning(false);
		graph.setEnabled(false);
		LayoutPreviews.copyPage(source, graph, this.parent);
		this.graphs.push(graph);

		return graph;
	};

	/**
	 * Gives the given graph of a picture the settings of the page of the given
	 * graph that change how its cells look (see createGraph). Placeholders of
	 * the cells in the default layer of the picture are looked up in the
	 * given parent of the source graph and its ancestors.
	 */
	LayoutPreviews.copyPage = function(source, graph, parent)
	{
		var sourceModel = source.model;
		var root = sourceModel.getRoot();

		// The value of the root is replaced, not changed by edits (see
		// Graph.getStyleRules), so the picture can share it
		if (root != null && root.value != null)
		{
			graph.model.getRoot().value = root.value;
		}

		graph.hiddenTags = (source.hiddenTags != null) ? source.hiddenTags.slice() : [];
		graph.shapeForegroundColor = source.shapeForegroundColor;
		graph.shapeBackgroundColor = source.shapeBackgroundColor;
		graph.setAdaptiveColors(source.adaptiveColors);
		graph.setMeasureScale(source.measureScale);

		graph.layoutPreviewParent = parent;

		if (!graph.layoutPreviewPage)
		{
			graph.layoutPreviewPage = true;

			graph.getGlobalVariable = function()
			{
				return source.getGlobalVariable.apply(source, arguments);
			};

			var graphGetPlaceholderParent = graph.getPlaceholderParent;

			graph.getPlaceholderParent = function(cell)
			{
				var result = graphGetPlaceholderParent.apply(this, arguments);
				var p = this.layoutPreviewParent;

				// The ancestors of the scope in the page (groups, the layer and
				// the root) instead of the layer and the root of the picture
				return (result != null && result == this.getDefaultParent() && p != null &&
					sourceModel.contains(p)) ? p : result;
			};
		}
	};

	/**
	 * Destroys the given graph of a picture.
	 */
	LayoutPreviews.prototype.removeGraph = function(graph)
	{
		var container = graph.container;
		var idx = mxUtils.indexOf(this.graphs, graph);

		if (idx >= 0)
		{
			this.graphs.splice(idx, 1);
		}

		graph.destroy();

		if (container != null)
		{
			container.innerHTML = '';
		}
	};

	/**
	 * Adds the example to the given graph: a tree of seven shapes in no
	 * order.
	 */
	LayoutPreviews.addExample = function(graph)
	{
		var parent = graph.getDefaultParent();
		var style = 'rounded=1;whiteSpace=wrap;html=1;';
		var pos = [[110, 0], [0, 90], [200, 60], [40, 200], [130, 150], [260, 170], [190, 250]];
		var v = [];

		for (var i = 0; i < pos.length; i++)
		{
			v.push(graph.insertVertex(parent, null, '', pos[i][0], pos[i][1], 60, 30, style));
		}

		var edges = [[0, 1], [0, 2], [1, 3], [1, 4], [2, 5], [2, 6]];

		for (var i = 0; i < edges.length; i++)
		{
			graph.insertEdge(parent, null, '', v[edges[i][0]], v[edges[i][1]], 'endSize=4;');
		}
	};

	/**
	 * Scales and centers the cells of the given graph in the given size.
	 */
	LayoutPreviews.fit = function(graph, w, h)
	{
		var border = 8;
		graph.view.scaleAndTranslate(1, 0, 0);
		var b = graph.getGraphBounds();

		if (b.width > 0 && b.height > 0)
		{
			var s = Math.min(1, (w - 2 * border) / b.width, (h - 2 * border) / b.height);
			graph.view.scaleAndTranslate(s, (w / s - b.width) / 2 - b.x,
				(h / s - b.height) / 2 - b.y);
		}
	};

	/**
	 * Runs the given job and the next job when it is done.
	 */
	LayoutPreviews.prototype.run = function(job)
	{
		var t0 = Date.now();
		var example = job.example || this.cells == null || this.time > LayoutPreviews.timeLimit;
		var container = job.container;

		// Replaces the previous picture of the container
		for (var i = this.graphs.length - 1; i >= 0; i--)
		{
			if (this.graphs[i].container == container)
			{
				this.removeGraph(this.graphs[i]);
			}
		}

		container.innerHTML = '';
		var graph = this.createGraph(container);
		var model = graph.model;
		var parent = graph.getDefaultParent();
		var finished = false;
		var timer = null;
		var isLocked = null;

		var finish = mxUtils.bind(this, function(err, timedOut)
		{
			if (!finished)
			{
				finished = true;
				window.clearTimeout(timer);
				// Pictures that take too long don't count for the others
				if (!timedOut && job.pass == this.pass)
				{
					this.time += Date.now() - t0;
				}

				if (!this.destroyed)
				{
					var failed = job.failed || (err != null && !timedOut);

					if (err != null)
					{
						this.removeGraph(graph);
					}
					else
					{
						LayoutPreviews.fit(graph, job.w, job.h);
						graph.layoutPreviewExample = example;
						graph.layoutPreviewDone = true;
					}

					// Layouts that fail or take too long show the example
					if (err != null && !example && (job.fallback || timedOut))
					{
						job.example = true;
						job.failed = failed;
						this.jobs.unshift(job);
					}
					else if (job.done != null)
					{
						job.done(example, failed);
					}
				}

				this.next();
			}
		});

		timer = window.setTimeout(function()
		{
			finish(new Error(mxResources.get('timeout')), true);
		}, LayoutPreviews.jobTimeout);

		try
		{
			model.beginUpdate();
			try
			{
				if (example)
				{
					LayoutPreviews.addExample(graph);
				}
				else
				{
					var cells = model.cloneCells(this.cells, true);
					isLocked = this.createLockedTest(cells);

					for (var i = 0; i < cells.length; i++)
					{
						model.add(parent, cells[i]);
					}
				}
			}
			finally
			{
				model.endUpdate();
			}

			// A function instead of a list draws the picture itself (eg. Tidy up
			// in Fusion): it gets the graph, the parent, the cells of the scope
			// in the diagram (null for the example) and their copies
			var sources = (example) ? null : this.sources;
			var runs = (typeof job.list === 'function') ? {layouts: [{execute: function(p)
			{
				job.list(graph, p, sources, (sources != null) ? cells : null);
			}}], routing: [false]} : EditorUi.createLayoutRuns(graph, job.list);
			var layouts = runs.layouts;
			var idx = 0;

			var next = function()
			{
				if (!finished)
				{
					if (idx >= layouts.length)
					{
						finish();
					}
					else
					{
						var routing = runs.routing[idx];
						var layout = layouts[idx++];

						if (typeof layout.prepare === 'function')
						{
							layout.prepare(parent, function(err, apply)
							{
								if (!finished)
								{
									if (err != null)
									{
										finish(err);
									}
									else
									{
										try
										{
											model.beginUpdate();
											try
											{
												// Locked shapes stay, as in applyLayoutList
												EditorUi.keepLockedGeometries(graph, [parent], apply, isLocked, routing)();
											}
											finally
											{
												model.endUpdate();
											}

											next();
										}
										catch (e)
										{
											finish(e);
										}
									}
								}
							});
						}
						else
						{
							model.beginUpdate();
							try
							{
								EditorUi.keepLockedGeometries(graph, [parent], function()
								{
									layout.execute(parent);
								}, isLocked, routing)();
							}
							finally
							{
								model.endUpdate();
							}

							next();
						}
					}
				}
			};

			next();
		}
		catch (e)
		{
			finish(e);
		}
	};

	/**
	 * Returns the graph with the layout of the cells of the scope in the
	 * given container, or null if it is pending, failed or the example.
	 */
	LayoutPreviews.prototype.getResult = function(container)
	{
		for (var i = 0; i < this.graphs.length; i++)
		{
			var graph = this.graphs[i];

			if (graph.container == container && graph.layoutPreviewDone &&
				!graph.layoutPreviewStale && !graph.layoutPreviewExample)
			{
				return graph;
			}
		}

		return null;
	};

	/**
	 * Stops all pictures and destroys their graphs.
	 */
	LayoutPreviews.prototype.destroy = function()
	{
		this.destroyed = true;
		this.jobs = [];

		while (this.graphs.length > 0)
		{
			this.graphs.pop().destroy();
		}
	};

	EditorUi.LayoutPreviews = LayoutPreviews;

	/**
	 * Returns a group of toggle buttons for the given items {value, label,
	 * title} with the given value. onChange is called with the new value.
	 * The result has setValue.
	 */
	EditorUi.prototype.createLayoutSegments = function(items, value, onChange, label, className)
	{
		var div = document.createElement('div');
		div.className = 'geLayoutSegments' + ((className != null) ? ' ' + className : '');
		div.setAttribute('role', 'group');

		if (label != null)
		{
			div.setAttribute('aria-label', label);
		}

		var buttons = [];

		var setValue = function(newValue)
		{
			for (var i = 0; i < buttons.length; i++)
			{
				buttons[i].setAttribute('aria-pressed', (items[i].value === newValue) ? 'true' : 'false');
			}
		};

		for (var i = 0; i < items.length; i++)
		{
			(function(item)
			{
				var btn = document.createElement('button');
				btn.setAttribute('type', 'button');
				btn.className = 'geLayoutSegment';
				mxUtils.write(btn, item.label);

				if (item.title != null)
				{
					btn.setAttribute('title', item.title);
					btn.setAttribute('aria-label', item.title);
				}

				mxEvent.addListener(btn, 'click', function()
				{
					setValue(item.value);
					onChange(item.value);
				});

				buttons.push(btn);
				div.appendChild(btn);
			})(items[i]);
		}

		setValue(value);
		div.setValue = setValue;

		return div;
	};

	/**
	 * Adds a row with the given label and control to the given section.
	 */
	EditorUi.addLayoutFormRow = function(section, label, control)
	{
		var row = document.createElement('div');
		row.className = 'geDialogFormRow';

		var lbl = document.createElement('span');
		lbl.className = 'geDialogFormLabel';
		mxUtils.write(lbl, label + ':');
		row.appendChild(lbl);
		row.appendChild(control);
		section.appendChild(row);

		return row;
	};

	/**
	 * Updates the height of the dialog of the given element after its content
	 * changed (see addAdvancedSection).
	 */
	EditorUi.updateDialogHeight = function(elt)
	{
		var dlg = (elt != null) ? elt.closest('.geDialog') : null;

		if (dlg != null && dlg.firstElementChild != null)
		{
			dlg.style.height = '';
			dlg.style.height = Dialog.getFrameHeight(dlg, dlg.firstElementChild.scrollHeight) + 'px';
		}
	};

	/**
	 * Tiles of Arrange my diagram (see LayoutPanel) with the type, the
	 * direction and the resource keys of the name and of the hint. The names
	 * are those of the tiles of Choose Layout and of the types of Layout
	 * Settings in sentence case (the driver, 10 November 2026: one function,
	 * one name; the tiles said Tree, Tree, sideways, Radial and Tidy
	 * connectors only next to Flow, top to bottom, and Layout Settings Radial
	 * Tree and Connectors Only).
	 */
	EditorUi.layoutPanelEntries = [
		{id: 'verticalFlow', type: 'flow', direction: 'DOWN', name: 'arrangeFlowDown', hint: 'arrangeFlowDownHint'},
		{id: 'horizontalFlow', type: 'flow', direction: 'RIGHT', name: 'arrangeFlowRight', hint: 'arrangeFlowRightHint'},
		{id: 'verticalTree', type: 'tree', direction: 'DOWN', name: 'arrangeTree', hint: 'arrangeTreeHint'},
		{id: 'horizontalTree', type: 'tree', direction: 'RIGHT', name: 'arrangeTreeSideways', hint: 'arrangeTreeSidewaysHint'},
		{id: 'radialTree', type: 'radial', name: 'arrangeRadial', hint: 'arrangeRadialHint'},
		{id: 'organic', type: 'organic', name: 'arrangeSpreadOut', hint: 'arrangeSpreadOutHint'},
		{id: 'circle', type: 'circle', name: 'circle', hint: 'arrangeCircleHint'},
		{id: 'tidyConnectors', type: 'connectors', name: 'arrangeTidyConnectors', hint: 'arrangeTidyConnectorsHint'}
	];

	/**
	 * Returns the name of a layout for the given resource key, in sentence
	 * case in the theme Fusion as the tiles of Arrange my diagram (the tiles
	 * of Choose Layout and the types of Layout Settings).
	 */
	EditorUi.getLayoutName = function(key)
	{
		var name = mxResources.get(key);

		return (typeof SimpleUi !== 'undefined' && typeof SimpleUi.toSentenceCase === 'function' &&
			isFusion()) ? SimpleUi.toSentenceCase(name) : name;
	};

	/**
	 * Arrange my diagram, the layout picker of the Simple UI: a panel in the
	 * place of the Format panel with a tile per layout of the selection or
	 * the page. Resting on a tile (or focusing it with the keyboard) for
	 * previewDelay ms shows the picture of the tile on the canvas in a graph
	 * over the diagram, which changes nothing in the model: the user's own
	 * diagram morphs into it, and back when the tile is left (motion
	 * catalogue 3.8). A click selects the tile and a double click or
	 * Apply runs its layout at once as one undoable edit. The pictures follow
	 * the changes of the diagram and of the selection.
	 */
	var LayoutPanel = function(editorUi)
	{
		this.editorUi = editorUi;
		this.graph = editorUi.editor.graph;
		this.preset = (EditorUi.layoutSpacings[editorUi.layoutPickerSpacing] != null) ?
			editorUi.layoutPickerSpacing : 'normal';
		this.tiles = [];
		this.hidden = [];
		this.init();
	};

	/**
	 * Delay in ms after changes of the diagram or the selection after which
	 * the pictures are updated.
	 */
	LayoutPanel.refreshDelay = 300;

	/**
	 * Style keys whose changes change the pictures or the suggestion: the
	 * layout of a container, the shapes that the layouts keep in place, the
	 * shape (decisions, see getSuggestedLayout) and ties, which the layouts
	 * skip (see Graph.createTieFilter). Changes of the names in a style count
	 * too, as they can change the shape (eg. rhombus).
	 */
	LayoutPanel.layoutStyleKeys = ['childLayout', 'locked', 'movable', 'shape', 'tie'];

	/**
	 * Returns true if the given edit of the model changes the pictures: every
	 * change except changes of labels and data that keep the tags and changes
	 * of styles that keep their names and the keys in layoutStyleKeys. Other
	 * changes count, also those of draw.io such as a new page (SelectPage),
	 * so the pictures and the scope never stay on another page.
	 */
	LayoutPanel.isLayoutEdit = function(edit)
	{
		var changes = (edit != null) ? edit.changes : null;

		if (changes == null)
		{
			return true;
		}

		for (var i = 0; i < changes.length; i++)
		{
			var change = changes[i];

			if (change instanceof mxValueChange)
			{
				// Tags can hide cells (see Graph.hiddenTags)
				if (LayoutPanel.getTags(change.value) != LayoutPanel.getTags(change.previous))
				{
					return true;
				}
			}
			else if (change instanceof mxCellAttributeChange)
			{
				if (change.attribute == 'tags' && (change.value || '') != (change.previous || ''))
				{
					return true;
				}
			}
			else if (change instanceof mxStyleChange)
			{
				if (LayoutPanel.isLayoutStyleChange(change.style, change.previous))
				{
					return true;
				}
			}
			else
			{
				return true;
			}
		}

		return false;
	};

	/**
	 * Returns the tags of the given value of a cell or an empty string.
	 */
	LayoutPanel.getTags = function(value)
	{
		return (value != null && typeof value === 'object' && typeof value.getAttribute === 'function') ?
			(value.getAttribute('tags') || '') : '';
	};

	/**
	 * Returns true if the given styles differ in their names or in a key of
	 * layoutStyleKeys.
	 */
	LayoutPanel.isLayoutStyleChange = function(style, previous)
	{
		var names = function(value)
		{
			return (typeof value === 'string') ? value.split(';').filter(function(token)
			{
				return token.length > 0 && token.indexOf('=') < 0;
			}).join(';') : '';
		};

		if (names(style) != names(previous))
		{
			return true;
		}

		for (var i = 0; i < LayoutPanel.layoutStyleKeys.length; i++)
		{
			var key = LayoutPanel.layoutStyleKeys[i];

			if (Graph.getOwnStyleValue(style, key) != Graph.getOwnStyleValue(previous, key))
			{
				return true;
			}
		}

		return false;
	};

	/**
	 * Counter of the edits of the model that change the pictures (see
	 * isLayoutEdit).
	 */
	LayoutPanel.prototype.revision = 0;

	/**
	 * Key of the scope, the revision, the spacing and the width of the
	 * pictures (see getRenderKey).
	 */
	LayoutPanel.prototype.renderedKey = null;

	/**
	 * Returns the key of the pictures of the given scope (see getLayoutScope):
	 * the root of the model, the IDs of its parent, cells and containers, the
	 * revision of the model, the spacing and the width of the tiles. The
	 * pages have their own roots, whose cells have the same IDs (0 and 1).
	 */
	LayoutPanel.prototype.getRenderKey = function(scope)
	{
		var ids = function(cells)
		{
			return (cells != null) ? cells.map(function(cell)
			{
				return cell.id;
			}).join(',') : '';
		};

		var thumb = (this.tiles.length > 0) ? this.tiles[0].thumb : null;

		return [mxObjectIdentity.get(this.graph.model.getRoot()),
			(scope.parent != null) ? scope.parent.id : '', ids(scope.cells), ids(scope.containers),
			this.revision, this.preset, (thumb != null) ? thumb.clientWidth : 0,
			(thumb != null) ? thumb.clientHeight : 0].join('\n');
	};

	/**
	 * Delay in ms that the pointer or the focus rests on a tile before its
	 * picture is shown on the canvas: passing over a tile does not flicker,
	 * and the canvas changes within 150 ms of pointing at it (concept,
	 * checklist item 4; test/simple-modern-ux).
	 */
	LayoutPanel.previewDelay = 100;

	/**
	 * Steps and delay in ms of a step of the morph between the diagram and the
	 * picture on the canvas: 200 ms, the duration of --sm-med.
	 */
	LayoutPanel.morphSteps = 10;

	LayoutPanel.morphDelay = 20;

	/**
	 * Counter for the IDs of the titles.
	 */
	LayoutPanel.count = 0;

	/**
	 * Selected tile.
	 */
	LayoutPanel.prototype.selected = null;

	/**
	 * Tile under the mouse.
	 */
	LayoutPanel.prototype.hover = null;

	/**
	 * Tile with the focus of the keyboard.
	 */
	LayoutPanel.prototype.focus = null;

	/**
	 * Tile whose picture is shown on the canvas.
	 */
	LayoutPanel.prototype.previewTile = null;

	/**
	 * Set while the model of the picture has the open update of a morph.
	 */
	LayoutPanel.prototype.morphUpdate = false;

	/**
	 * Set when the user selected a tile, so the suggestion no longer selects.
	 */
	LayoutPanel.prototype.userSelected = false;

	/**
	 * Set if the panel is in a host of the right panel of Simple Modern
	 * (SimpleLayouts.js) instead of in the place of the Format panel.
	 */
	LayoutPanel.prototype.hosted = false;

	/**
	 * Creates the panel.
	 */
	LayoutPanel.prototype.init = function()
	{
		var editorUi = this.editorUi;
		var div = document.createElement('div');
		div.className = 'geLayoutPanel';
		div.setAttribute('role', 'region');
		this.container = div;

		var card = document.createElement('div');
		card.className = 'geLayoutPanelCard';
		div.appendChild(card);

		var header = document.createElement('div');
		header.className = 'geLayoutPanelHeader';
		card.appendChild(header);

		var title = document.createElement('div');
		title.className = 'geLayoutPanelTitle';
		title.setAttribute('role', 'heading');
		title.setAttribute('aria-level', '2');
		title.id = 'geLayoutPanelTitle' + LayoutPanel.count++;
		mxUtils.write(title, mxResources.get('arrangeMyDiagram'));
		header.appendChild(title);
		div.setAttribute('aria-labelledby', title.id);

		this.counter = document.createElement('span');
		this.counter.className = 'geLayoutPanelCount';
		header.appendChild(this.counter);

		var close = document.createElement('button');
		close.setAttribute('type', 'button');
		close.className = 'geLayoutPanelClose';
		close.setAttribute('title', mxResources.get('close'));
		close.setAttribute('aria-label', mxResources.get('close'));
		mxUtils.write(close, '×');
		header.appendChild(close);

		mxEvent.addListener(close, 'click', function()
		{
			editorUi.hideLayoutPanel();
		});

		this.hint = document.createElement('div');
		this.hint.className = 'geLayoutPanelHint';
		card.appendChild(this.hint);

		this.grid = document.createElement('div');
		this.grid.className = 'geLayoutPanelGrid';
		card.appendChild(this.grid);

		for (var i = 0; i < EditorUi.layoutPanelEntries.length; i++)
		{
			if (EditorUi.isLayoutTypeAvailable(EditorUi.layoutPanelEntries[i].type))
			{
				this.addTile(EditorUi.layoutPanelEntries[i]);
			}
		}

		this.example = document.createElement('div');
		this.example.className = 'geLayoutPanelHint geLayoutPanelExample';
		this.example.style.display = 'none';
		mxUtils.write(this.example, mxResources.get('layoutExampleHint'));
		card.appendChild(this.example);

		var footer = document.createElement('div');
		footer.className = 'geLayoutPanelFooter';
		card.appendChild(footer);

		var label = document.createElement('span');
		label.className = 'geLayoutPanelLabel';
		mxUtils.write(label, mxResources.get('spacing'));
		footer.appendChild(label);

		footer.appendChild(editorUi.createLayoutSegments([
			{value: 'compact', label: mxResources.get('tight')},
			{value: 'normal', label: mxResources.get('normal')},
			{value: 'airy', label: mxResources.get('airy')}], this.preset, mxUtils.bind(this, function(value)
		{
			this.preset = value;
			editorUi.layoutPickerSpacing = value;
			this.hidePreview();
			this.render();
		}), mxResources.get('spacing'), 'geLayoutPanelSegments'));

		var actions = document.createElement('div');
		actions.className = 'geLayoutPanelActions';
		footer.appendChild(actions);

		var more = document.createElement('button');
		more.setAttribute('type', 'button');
		more.className = 'geLayoutPanelButton';
		mxUtils.write(more, mxResources.get('moreOptions') + '...');
		actions.appendChild(more);

		mxEvent.addListener(more, 'click', mxUtils.bind(this, function()
		{
			var tile = this.selected;
			this.hidePreview();

			// A tile with options of its own shows them (Org chart in Fusion)
			if (tile != null && typeof tile.entry.showOptions === 'function')
			{
				tile.entry.showOptions(this, tile);
			}
			else
			{
				editorUi.showLayoutSettings((tile != null && typeof tile.entry.layout !== 'function') ?
					this.getEntryList(tile.entry) : null, this.scope);
			}
		}));

		this.applyButton = document.createElement('button');
		this.applyButton.setAttribute('type', 'button');
		this.applyButton.className = 'geLayoutPanelButton geLayoutPanelPrimary';
		mxUtils.write(this.applyButton, mxResources.get('apply'));
		actions.appendChild(this.applyButton);

		mxEvent.addListener(this.applyButton, 'click', mxUtils.bind(this, function()
		{
			this.apply();
		}));

		mxEvent.addListener(div, 'keydown', function(evt)
		{
			if (evt.keyCode == 27 /* Escape */)
			{
				editorUi.hideLayoutPanel();
				mxEvent.consume(evt);
			}
		});

		// Changes of the diagram and of the selection update the pictures and
		// end the preview, which shows the cells as they were. In Fusion only
		// changes of geometries or of the structure and selections with
		// another scope update the pictures (see isLayoutEdit and refresh), so
		// a change of a style or of a label renders nothing (vmyn U3)
		this.changeListener = mxUtils.bind(this, function(sender, evt)
		{
			this.hidePreview();

			if (sender == this.graph.model && isFusion() &&
				!LayoutPanel.isLayoutEdit(evt.getProperty('edit')))
			{
				return;
			}

			if (sender == this.graph.model)
			{
				this.revision++;
			}

			this.scheduleRefresh();
		});

		this.graph.model.addListener(mxEvent.CHANGE, this.changeListener);
		this.graph.getSelectionModel().addListener(mxEvent.CHANGE, this.changeListener);

		this.viewListener = mxUtils.bind(this, function()
		{
			if (this.previewTile != null)
			{
				this.syncPreview();
			}
			else
			{
				// Ends the morph back to the diagram
				this.hidePreview();
			}
		});

		this.graph.view.addListener(mxEvent.SCALE, this.viewListener);
		this.graph.view.addListener(mxEvent.TRANSLATE, this.viewListener);
		this.graph.view.addListener(mxEvent.SCALE_AND_TRANSLATE, this.viewListener);
		this.graph.addListener(mxEvent.SIZE, this.viewListener);
	};

	/**
	 * Adds the tile for the given entry of layoutPanelEntries.
	 */
	LayoutPanel.prototype.addTile = function(entry)
	{
		var button = document.createElement('button');
		button.setAttribute('type', 'button');
		button.className = 'geLayoutPanelTile';
		button.setAttribute('aria-pressed', 'false');

		var thumb = document.createElement('div');
		thumb.className = 'geLayoutPanelThumb';
		thumb.setAttribute('aria-hidden', 'true');
		button.appendChild(thumb);

		var name = document.createElement('div');
		name.className = 'geLayoutPanelName';
		mxUtils.write(name, mxResources.get(entry.name));
		button.appendChild(name);

		var badge = document.createElement('span');
		badge.className = 'geLayoutPanelBadge';
		badge.style.display = 'none';
		mxUtils.write(badge, mxResources.get('suggested'));
		name.appendChild(badge);

		var desc = document.createElement('div');
		desc.className = 'geLayoutPanelDesc';
		mxUtils.write(desc, mxResources.get(entry.hint));
		button.appendChild(desc);

		var tile = {entry: entry, button: button, thumb: thumb, badge: badge};
		this.tiles.push(tile);
		this.grid.appendChild(button);

		mxEvent.addListener(button, 'mouseenter', mxUtils.bind(this, function()
		{
			this.hover = tile;
			this.updatePreview();
		}));

		mxEvent.addListener(button, 'mouseleave', mxUtils.bind(this, function()
		{
			if (this.hover == tile)
			{
				this.hover = null;
				this.updatePreview();
			}
		}));

		// Only the focus of the keyboard previews, a click also focuses
		mxEvent.addListener(button, 'focus', mxUtils.bind(this, function()
		{
			if (!this.ignoreFocus && button.matches(':focus-visible'))
			{
				this.focus = tile;
				this.updatePreview();
			}
		}));

		mxEvent.addListener(button, 'blur', mxUtils.bind(this, function()
		{
			if (this.focus == tile)
			{
				this.focus = null;
				this.updatePreview();
			}
		}));

		// A click selects, Enter or Space on the selected tile applies it
		mxEvent.addListener(button, 'click', mxUtils.bind(this, function(evt)
		{
			if (evt.detail == 0 && this.selected == tile)
			{
				this.apply();
			}
			else
			{
				this.userSelected = true;
				this.select(tile);
			}
		}));

		mxEvent.addListener(button, 'dblclick', mxUtils.bind(this, function()
		{
			this.userSelected = true;
			this.select(tile);
			this.apply();
		}));
	};

	/**
	 * Selects the given tile.
	 */
	LayoutPanel.prototype.select = function(tile)
	{
		this.selected = tile;

		// Only changes are written: the pictures call this when they are done
		for (var i = 0; i < this.tiles.length; i++)
		{
			var pressed = (this.tiles[i] == tile) ? 'true' : 'false';

			if (this.tiles[i].button.getAttribute('aria-pressed') != pressed)
			{
				this.tiles[i].button.setAttribute('aria-pressed', pressed);
			}
		}

		var disabled = tile == null || tile.button.disabled;

		if (this.applyButton.disabled != disabled)
		{
			this.applyButton.disabled = disabled;
		}
	};

	/**
	 * Updates the pictures after changes.
	 */
	LayoutPanel.prototype.scheduleRefresh = function()
	{
		window.clearTimeout(this.refreshThread);

		this.refreshThread = window.setTimeout(mxUtils.bind(this, function()
		{
			this.refreshThread = null;
			this.refresh();
		}), LayoutPanel.refreshDelay);
	};

	/**
	 * Updates the hint and the label of Apply for the scope and the selection.
	 */
	LayoutPanel.prototype.updateHint = function()
	{
		var editorUi = this.editorUi;
		var page = this.scope.containers == null && this.scope.parent ==
			this.graph.getDefaultParent() && this.scope.cells == null;

		// Touch has no hover and double click (Fusion)
		var touch = isFusion() && typeof editorUi.isCoarsePointer === 'function' &&
			editorUi.isCoarsePointer();
		var hint = mxResources.get(((page) ? 'arrangeDiagramHint' :
			'arrangeSelectionHint') + ((touch) ? 'Touch' : ''));

		if (this.hint.textContent != hint)
		{
			this.hint.innerHTML = '';
			mxUtils.write(this.hint, hint);
		}

		// A selection of shapes with different parents arranges the whole page
		// (getLayoutScope), the button says so in Fusion (w94m M2)
		var label = mxResources.get((isFusion() && page &&
			this.graph.getSelectionCount() > 1) ? 'applyToWholePage' : 'apply');

		if (this.applyButton.textContent != label)
		{
			this.applyButton.textContent = label;
		}
	};

	/**
	 * Updates the scope, the counter, the suggestion and the pictures.
	 */
	LayoutPanel.prototype.refresh = function()
	{
		var editorUi = this.editorUi;
		var model = this.graph.model;
		this.hidePreview();
		var scope = editorUi.getLayoutScope();

		// In Fusion the pictures of the same scope, revision, spacing and size
		// are kept, eg. after a selection in the same scope (vmyn U3)
		if (isFusion() && this.previews != null && this.scope != null &&
			this.renderedKey != null && this.getRenderKey(scope) == this.renderedKey)
		{
			this.scope = scope;
			this.updateHint();

			return;
		}

		this.scope = scope;

		if (this.previews == null)
		{
			this.previews = new LayoutPreviews(editorUi, this.scope);

			// The pictures render while the page is idle, so taps, keys and
			// the editor come first (vmyn U3)
			this.previews.idle = isFusion();
		}
		else
		{
			this.previews.setScope(this.scope);
		}

		// Shapes and connectors of the scope
		var cells = editorUi.getLayoutScopeCells(this.scope, Infinity);
		var vertices = 0;
		var edges = 0;

		for (var i = 0; i < cells.length; i++)
		{
			if (model.isVertex(cells[i]))
			{
				vertices++;
			}
			else if (model.isEdge(cells[i]))
			{
				edges++;
			}
		}

		this.counter.innerHTML = '';
		mxUtils.write(this.counter, mxResources.get('arrangeCount', [vertices, edges]));
		this.updateHint();
		var suggested = this.getSuggestion();

		for (var i = 0; i < this.tiles.length; i++)
		{
			var tile = this.tiles[i];
			var isSuggested = tile.entry.id == suggested;
			// The name of the tile is its visible text (name, Suggested and hint):
			// an aria-label would differ from the labels of the picture, which
			// are visible text too (WCAG 2.5.3)
			tile.badge.style.display = (isSuggested) ? '' : 'none';

			if (isSuggested && !this.userSelected)
			{
				this.select(tile);
			}
		}

		this.render();
	};

	/**
	 * Returns the ID of the tile with the badge Suggested for the scope or null
	 * (see getSuggestedLayout).
	 */
	LayoutPanel.prototype.getSuggestion = function()
	{
		return this.editorUi.getSuggestedLayout(this.scope);
	};

	/**
	 * Renders the pictures of the tiles with the spacing preset.
	 */
	LayoutPanel.prototype.render = function()
	{
		this.example.style.display = 'none';
		this.previews.startPass();
		this.renderedKey = this.getRenderKey(this.scope);

		for (var i = 0; i < this.tiles.length; i++)
		{
			this.renderTile(this.tiles[i]);
		}

		this.select(this.selected);
	};

	/**
	 * Returns the list of layouts of the given entry of a tile with the
	 * spacing preset: the list of its getList function (eg. Org chart in
	 * Fusion, which keeps the options of its own) or the one of its type and
	 * direction (see EditorUi.getLayoutPickerList).
	 */
	LayoutPanel.prototype.getEntryList = function(entry)
	{
		return (typeof entry.getList === 'function') ? entry.getList(this.preset) :
			EditorUi.getLayoutPickerList(entry, this.preset);
	};

	/**
	 * Returns the list of layouts of the given tile with the spacing preset,
	 * or the function of a tile that draws its picture itself (the layout of
	 * its entry, see LayoutPreviews.run).
	 */
	LayoutPanel.prototype.getTileList = function(tile)
	{
		return (typeof tile.entry.layout === 'function') ? tile.entry.layout :
			this.getEntryList(tile.entry);
	};

	/**
	 * Renders the picture of the given tile. A tile whose entry has an
	 * isExample function that returns true shows the example.
	 */
	LayoutPanel.prototype.renderTile = function(tile)
	{
		tile.button.disabled = false;
		var example = typeof tile.entry.isExample === 'function' && tile.entry.isExample() === true;

		// Layouts that fail for the diagram (eg. a radial tree without a
		// root) show the example and can't be chosen
		this.previews.render(tile.thumb, this.getTileList(tile),
			tile.thumb.clientWidth || 196, tile.thumb.clientHeight || 100,
			mxUtils.bind(this, function(isExample, failed)
		{
			tile.button.disabled = failed;

			if (this.selected == tile)
			{
				this.select(tile);
			}

			if (isExample && !failed)
			{
				this.example.style.display = '';
			}

			// Shows the picture of a tile that was hovered while it was
			// computed
			if (this.previewTile == null && (this.hover == tile || this.focus == tile))
			{
				this.updatePreview();
			}
		}), true, example);
	};

	/**
	 * Shows the picture of the hovered or focused tile on the canvas once the
	 * pointer or the focus rested on it for previewDelay ms, or morphs back to
	 * the cells as they are.
	 */
	LayoutPanel.prototype.updatePreview = function()
	{
		var tile = this.hover || this.focus;
		window.clearTimeout(this.previewThread);
		this.previewThread = null;

		if (tile == null)
		{
			this.hidePreview(true);
		}
		else if (tile != this.previewTile)
		{
			this.previewThread = window.setTimeout(mxUtils.bind(this, function()
			{
				this.previewThread = null;

				if ((this.hover || this.focus) == tile && tile != this.previewTile)
				{
					this.showPreview(tile);
				}
			}), LayoutPanel.previewDelay);
		}
	};

	/**
	 * Returns true if the diagram morphs into the pictures: animations are
	 * allowed and the user does not prefer reduced motion.
	 */
	LayoutPanel.prototype.isMorphEnabled = function()
	{
		return this.editorUi.allowAnimation && !(typeof window.matchMedia === 'function' &&
			window.matchMedia('(prefers-reduced-motion: reduce)').matches);
	};

	/**
	 * Returns [cell, geometry before, geometry after] for each cell of the
	 * given root of a picture, where the geometry before is the one of the
	 * copy of the cell in the diagram, or null if the picture does not have
	 * the cells of the copies (the layout added or removed cells).
	 */
	LayoutPanel.prototype.getMorphGeometries = function(root)
	{
		var cells = (this.previews != null) ? this.previews.cells : null;
		var layer = (root != null && root.getChildCount() > 0) ? root.getChildAt(0) : null;

		if (cells == null || layer == null || layer.getChildCount() != cells.length)
		{
			return null;
		}

		var result = [];
		var stack = [];

		for (var i = 0; i < cells.length; i++)
		{
			stack.push([cells[i], layer.getChildAt(i)]);
		}

		while (stack.length > 0)
		{
			var pair = stack.pop();

			if (pair[0].getChildCount() != pair[1].getChildCount() ||
				pair[0].isEdge() != pair[1].isEdge())
			{
				return null;
			}

			result.push([pair[1], (pair[0].geometry != null) ? pair[0].geometry.clone() : null,
				pair[1].geometry]);

			for (var i = 0; i < pair[0].getChildCount(); i++)
			{
				stack.push([pair[0].getChildAt(i), pair[1].getChildAt(i)]);
			}
		}

		return result;
	};

	/**
	 * Returns the geometries of the cells of the picture on the canvas where
	 * they are drawn (the picture or a morph on its way), in the order of
	 * morphGeometries, or null if no picture is on the canvas. Shapes of the
	 * first level get the position of their state, the others keep theirs.
	 */
	LayoutPanel.prototype.getShownGeometries = function()
	{
		var geos = this.morphGeometries;
		var overlay = this.overlay;

		if (geos == null || overlay == null || overlay.container.style.display == 'none')
		{
			return null;
		}

		var model = overlay.model;
		var view = overlay.view;
		var s = view.scale;
		var result = [];

		for (var i = 0; i < geos.length; i++)
		{
			var cell = geos[i][0];
			var geo = model.getGeometry(cell);
			var state = view.getState(cell);
			var parent = model.getParent(cell);

			if (geo != null && state != null && model.isVertex(cell) && !geo.relative &&
				parent != null && model.getParent(parent) == model.getRoot())
			{
				geo = geo.clone();
				geo.x = state.x / s - view.translate.x;
				geo.y = state.y / s - view.translate.y;
			}

			result.push(geo);
		}

		return result;
	};

	/**
	 * Morphs the picture on the canvas from the geometries it shows to the
	 * geometries at the given index of morphGeometries (1 is the diagram, 2
	 * the picture) and calls done at the end.
	 */
	LayoutPanel.prototype.morph = function(index, done)
	{
		var model = this.overlay.model;
		var geos = this.morphGeometries;

		// A morph that was stopped on its way keeps its update open, so this
		// one starts where the shapes are
		if (!this.morphUpdate)
		{
			model.beginUpdate();
			this.morphUpdate = true;
		}

		for (var i = 0; i < geos.length; i++)
		{
			model.setGeometry(geos[i][0], geos[i][index]);
		}

		var morph = new mxMorphing(this.overlay, LayoutPanel.morphSteps, null, LayoutPanel.morphDelay);
		this.morphing = morph;

		morph.addListener(mxEvent.DONE, mxUtils.bind(this, function()
		{
			if (this.morphing == morph)
			{
				this.morphing = null;
				this.morphUpdate = false;
				model.endUpdate();

				if (done != null)
				{
					done();
				}
			}
		}));

		morph.startAnimation();
	};

	/**
	 * Ends the morph of the picture on the canvas at its end, or where it is
	 * if keepUpdate is true (the next morph starts there and ends the update).
	 */
	LayoutPanel.prototype.stopMorph = function(keepUpdate)
	{
		if (this.morphing != null)
		{
			var morph = this.morphing;
			this.morphing = null;
			morph.stopAnimation();
		}

		if (!keepUpdate && this.morphUpdate)
		{
			this.morphUpdate = false;
			this.overlay.model.endUpdate();
		}
	};

	/**
	 * Returns the cells whose shapes the picture on the canvas replaces.
	 */
	LayoutPanel.prototype.getPreviewCells = function()
	{
		var model = this.graph.model;

		if (this.scope.cells == null)
		{
			return this.editorUi.getLayoutGroupCells(this.scope.parent);
		}

		var result = [];
		var stack = this.scope.cells.slice();

		while (stack.length > 0)
		{
			var cell = stack.pop();
			result.push(cell);

			for (var i = 0; i < model.getChildCount(cell); i++)
			{
				stack.push(model.getChildAt(cell, i));
			}
		}

		return result;
	};

	/**
	 * Shows the picture of the given tile on the canvas: a graph with a copy
	 * of the cells of the picture over the diagram, where the shapes of the
	 * cells of the scope are hidden. The copy starts as the diagram and morphs
	 * into the picture. The model is not changed.
	 */
	LayoutPanel.prototype.showPreview = function(tile)
	{
		var result = (this.previews != null) ? this.previews.getResult(tile.thumb) : null;

		// From another picture or a morph back the next one starts where the
		// shapes are drawn
		var shown = (result != null && this.isMorphEnabled()) ? this.getShownGeometries() : null;
		this.hidePreview();

		if (result != null && !this.graph.isEditing())
		{
			if (this.overlay == null)
			{
				var div = document.createElement('div');
				div.className = 'geLayoutPanelOverlay';
				div.setAttribute('aria-hidden', 'true');
				this.graph.container.appendChild(div);

				var overlay = new Graph(div, null, null, this.graph.getStylesheet());
				overlay.resetViewOnRootChange = false;
				overlay.foldingEnabled = false;
				overlay.gridEnabled = false;
				overlay.autoScroll = false;
				overlay.setTooltips(false);
				overlay.setConnectable(false);
				overlay.setPanning(false);
				overlay.setEnabled(false);
				this.overlay = overlay;
			}

			this.previewTile = tile;
			LayoutPreviews.copyPage(this.graph, this.overlay, this.scope.parent);
			var root = this.overlay.model.cloneCell(result.model.getRoot(), true);
			this.updatePreviewStyles(root);
			this.morphGeometries = (this.isMorphEnabled()) ? this.getMorphGeometries(root) : null;

			// Starts with the geometries of the diagram, or with those of the
			// shapes on the canvas
			if (this.morphGeometries != null)
			{
				var from = (shown != null && shown.length == this.morphGeometries.length) ? shown : null;

				for (var i = 0; i < this.morphGeometries.length; i++)
				{
					this.morphGeometries[i][0].geometry = (from != null) ? from[i] : this.morphGeometries[i][1];
				}
			}

			this.overlay.model.setRoot(root);
			this.syncPreview();

			if (this.morphGeometries != null)
			{
				this.morph(2);
			}
		}
	};

	/**
	 * Gives the cells of the given root of a picture the values of the cells
	 * of the diagram that they copy, their styles with the keys that the
	 * layout of the picture wrote (eg. the style of connectors of ELK), and
	 * the root the value of the root of the page: the pictures are kept after
	 * changes of styles and labels in Fusion (see isLayoutEdit), the picture
	 * on the canvas shows the cells as they are and as the layout leaves them.
	 */
	LayoutPanel.prototype.updatePreviewStyles = function(root)
	{
		var model = this.graph.model;
		var sources = (this.previews != null) ? this.previews.sources : null;
		var templates = (this.previews != null) ? this.previews.cells : null;
		var layer = (root != null && root.getChildCount() > 0) ? root.getChildAt(0) : null;
		var copy = function(value)
		{
			return (value != null && typeof value === 'object' && typeof value.cloneNode === 'function') ?
				value.cloneNode(true) : value;
		};

		if (root != null)
		{
			root.value = copy(model.getValue(model.getRoot()));
		}

		if (sources != null && templates != null && layer != null &&
			layer.getChildCount() == sources.length &&
			templates.length == sources.length)
		{
			var stack = [];

			for (var i = 0; i < sources.length; i++)
			{
				stack.push([sources[i], templates[i], layer.getChildAt(i)]);
			}

			while (stack.length > 0)
			{
				var t = stack.pop();
				var n = t[0].getChildCount();

				if (model.contains(t[0]) && t[1].getChildCount() == n && t[2].getChildCount() == n)
				{
					t[2].style = LayoutPanel.mergeLayoutStyle(t[0].style, t[1].style, t[2].style);
					t[2].value = copy(t[0].value);

					for (var i = 0; i < n; i++)
					{
						stack.push([t[0].getChildAt(i), t[1].getChildAt(i), t[2].getChildAt(i)]);
					}
				}
			}
		}
	};

	/**
	 * Returns the given current style of a cell with the changes from the
	 * given style before a layout to the given style after it: the keys that
	 * the layout added, changed or removed.
	 */
	LayoutPanel.mergeLayoutStyle = function(current, before, after)
	{
		if (after == before)
		{
			return current;
		}
		else if (current == before)
		{
			return after;
		}

		var parse = function(style)
		{
			var result = {};
			var tokens = (typeof style === 'string') ? style.split(';') : [];

			for (var i = 0; i < tokens.length; i++)
			{
				var j = tokens[i].indexOf('=');

				if (j > 0)
				{
					result['$' + tokens[i].substring(0, j)] = tokens[i].substring(j + 1);
				}
			}

			return result;
		};

		var b = parse(before);
		var a = parse(after);
		var result = (current != null) ? current : '';

		for (var key in a)
		{
			if (a[key] !== b[key])
			{
				result = mxUtils.setStyle(result, key.substring(1), a[key]);
			}
		}

		for (var key in b)
		{
			if (!(key in a))
			{
				result = mxUtils.setStyle(result, key.substring(1), null);
			}
		}

		return result;
	};

	/**
	 * Aligns the picture on the canvas with the view and hides the shapes of
	 * the cells it replaces, the handles and the toolbar of the selection.
	 */
	LayoutPanel.prototype.syncPreview = function()
	{
		this.stopMorph();
		var view = this.graph.view;
		var container = this.graph.container;
		var div = this.overlay.container;
		var state = view.getState(this.scope.parent);
		var origin = (state != null && state.origin != null) ? state.origin : new mxPoint();
		this.restoreHidden();

		div.style.display = 'none';
		div.style.width = container.scrollWidth + 'px';
		div.style.height = container.scrollHeight + 'px';
		div.style.display = '';
		this.overlay.view.scaleAndTranslate(view.scale, view.translate.x + origin.x,
			view.translate.y + origin.y);

		// The classes hide the nodes (see geLayoutPreviewHidden in
		// grapheditor.css), also the shapes in them, which set visibility:
		// visible on their own node when they are painted, and are removed in
		// any order with those of the other previews on the canvas
		var mark = mxUtils.bind(this, function(node, className)
		{
			if (node != null)
			{
				this.hidden.push([node, className]);
				node.classList.add(className);
			}
		});

		var hide = function(node)
		{
			mark(node, 'geLayoutPreviewHidden');
		};

		var cells = this.getPreviewCells();
		var replaced = new mxDictionary();

		for (var i = 0; i < cells.length; i++)
		{
			replaced.put(cells[i], true);
			var s = view.getState(cells[i]);

			if (s != null)
			{
				hide((s.shape != null) ? s.shape.node : null);
				hide((s.text != null) ? s.text.node : null);
				hide((s.control != null) ? s.control.node : null);

				if (s.overlays != null)
				{
					s.overlays.visit(function(id, shape)
					{
						hide(shape.node);
					});
				}
			}
		}

		// The overlay pane hides the handles of the selection but keeps the
		// overlays and folding icons of the cells outside the picture
		var pane = view.getOverlayPane();

		view.states.visit(function(key, s)
		{
			if (!replaced.get(s.cell))
			{
				if (s.control != null && s.control.node != null &&
					s.control.node.parentNode == pane)
				{
					mark(s.control.node, 'geLayoutPreviewKept');
				}

				if (s.overlays != null)
				{
					s.overlays.visit(function(id, shape)
					{
						if (shape.node != null && shape.node.parentNode == pane)
						{
							mark(shape.node, 'geLayoutPreviewKept');
						}
					});
				}
			}
		});

		mark(pane, 'geLayoutPreviewPane');
		hide(view.getDecoratorPane());

		if (this.editorUi.inlineToolbar != null)
		{
			hide(this.editorUi.inlineToolbar.toolbar);
		}
	};

	/**
	 * Shows the nodes that the picture on the canvas hides.
	 */
	LayoutPanel.prototype.restoreHidden = function()
	{
		while (this.hidden.length > 0)
		{
			var entry = this.hidden.pop();
			entry[0].classList.remove(entry[1]);
		}
	};

	/**
	 * Removes the picture from the canvas and shows the cells as they are. If
	 * animate is true the picture first morphs back into the diagram.
	 */
	LayoutPanel.prototype.hidePreview = function(animate)
	{
		// A picture that was about to show is not shown (eg. after Apply)
		window.clearTimeout(this.previewThread);
		this.previewThread = null;
		this.removePreview(animate);
	};

	/**
	 * Removes the picture from the canvas like hidePreview but keeps a picture
	 * that is about to show (the end of a morph back while the pointer rests
	 * on the next tile).
	 */
	LayoutPanel.prototype.removePreview = function(animate)
	{
		var back = animate && this.previewTile != null && this.morphGeometries != null && this.isMorphEnabled();
		this.stopMorph(back);

		if (back)
		{
			this.previewTile = null;
			this.morph(1, mxUtils.bind(this, function()
			{
				this.removePreview();
			}));
		}
		else
		{
			this.restoreHidden();
			this.previewTile = null;
			this.morphGeometries = null;

			if (this.overlay != null)
			{
				this.overlay.container.style.display = 'none';
				this.overlay.model.clear();
			}
		}
	};

	/**
	 * Runs the layout of the selected tile at once as one undoable edit: the
	 * picture already showed the way there.
	 */
	LayoutPanel.prototype.apply = function()
	{
		var editorUi = this.editorUi;
		var tile = this.selected;

		if (tile != null && !tile.button.disabled && this.graph.isEnabled())
		{
			this.hidePreview();

			// A refresh that waits for its delay runs first, so the layout gets
			// the scope of the diagram as it is (eg. after a new page)
			if (this.refreshThread != null || !this.graph.model.contains(this.scope.parent))
			{
				window.clearTimeout(this.refreshThread);
				this.refreshThread = null;
				this.refresh();
			}

			editorUi.tryAndHandle(mxUtils.bind(this, function()
			{
				// A tile with a function of its own applies itself (Tidy up in Fusion)
				if (typeof tile.entry.apply === 'function')
				{
					tile.entry.apply(this, tile);
				}
				else
				{
					editorUi.applyLayoutList(this.getEntryList(tile.entry), this.scope, null, false);
				}
			}));
		}
	};

	/**
	 * Removes the panel and its listeners, pictures and preview.
	 */
	LayoutPanel.prototype.destroy = function()
	{
		window.clearTimeout(this.refreshThread);
		window.clearTimeout(this.previewThread);
		this.hidePreview();
		this.graph.model.removeListener(this.changeListener);
		this.graph.getSelectionModel().removeListener(this.changeListener);
		this.graph.view.removeListener(this.viewListener);
		this.graph.removeListener(this.viewListener);

		if (this.previews != null)
		{
			this.previews.destroy();
			this.previews = null;
		}

		if (this.overlay != null)
		{
			var div = this.overlay.container;
			this.overlay.destroy();
			div.parentNode.removeChild(div);
			this.overlay = null;
		}

		if (this.container.parentNode != null)
		{
			this.container.parentNode.removeChild(this.container);
		}
	};

	EditorUi.LayoutPanel = LayoutPanel;

	/**
	 * Returns true if the layout picker is a panel in the place of the
	 * Format panel (Simple UI) instead of a dialog.
	 */
	EditorUi.prototype.isLayoutPanelSupported = function()
	{
		return Editor.currentTheme == 'simple' && this.formatContainer != null &&
			this.formatContainer.parentNode == this.container;
	};

	/**
	 * Shows Arrange my diagram in the place of the Format panel (see
	 * LayoutPanel).
	 */
	EditorUi.prototype.showLayoutPanel = function()
	{
		if (this.layoutPanel == null)
		{
			var panel = new LayoutPanel(this);
			this.layoutPanel = panel;
			this.layoutPanelFormatDisplay = this.formatContainer.style.display;
			this.formatContainer.style.display = 'none';
			this.container.insertBefore(panel.container, this.formatContainer.nextSibling);
			this.editor.graph.sizeDidChange();
			panel.refresh();
		}

		var tile = this.layoutPanel.selected || this.layoutPanel.tiles[0];

		// Opening shows no preview
		if (tile != null)
		{
			this.layoutPanel.ignoreFocus = true;
			tile.button.focus();
			this.layoutPanel.ignoreFocus = false;
		}
	};

	/**
	 * Removes Arrange my diagram and shows the Format panel again.
	 */
	EditorUi.prototype.hideLayoutPanel = function()
	{
		if (this.layoutPanel != null)
		{
			var focused = this.layoutPanel.container.contains(document.activeElement);
			this.layoutPanel.destroy();
			this.layoutPanel = null;
			this.formatContainer.style.display = this.layoutPanelFormatDisplay || '';
			this.editor.graph.sizeDidChange();

			if (focused)
			{
				this.editor.graph.container.focus();
			}
		}
	};

	/**
	 * Arrange my diagram is the format region of the keyboard while it is
	 * open (see getTabRegions).
	 */
	var editorUiGetFormatRegion = EditorUi.prototype.getFormatRegion;

	EditorUi.prototype.getFormatRegion = function()
	{
		return (this.layoutPanel != null && !this.layoutPanel.hosted) ? this.layoutPanel.container :
			editorUiGetFormatRegion.apply(this, arguments);
	};

	/**
	 * Focusing the Format panel (Shift+Enter) focuses the selected tile of
	 * Arrange my diagram while it is open.
	 */
	var editorUiFocusFormatPanel = EditorUi.prototype.focusFormatPanel;

	EditorUi.prototype.focusFormatPanel = function()
	{
		if (this.layoutPanel != null)
		{
			var tile = this.layoutPanel.selected || this.layoutPanel.tiles[0];

			if (tile != null)
			{
				tile.button.focus();
			}
		}
		else
		{
			editorUiFocusFormatPanel.apply(this, arguments);
		}
	};

	/**
	 * Showing or hiding the Format panel closes Arrange my diagram in its
	 * place (a host is hidden with the panel).
	 */
	var editorUiToggleFormatPanel = EditorUi.prototype.toggleFormatPanel;

	EditorUi.prototype.toggleFormatPanel = function(visible)
	{
		if (this.layoutPanel != null && !this.layoutPanel.hosted)
		{
			this.hideLayoutPanel();

			// The Format panel shows again
			if (visible == null && this.formatWidth > 0)
			{
				return;
			}
		}

		editorUiToggleFormatPanel.apply(this, arguments);
	};

	/**
	 * Shows the layout picker (Choose Layout): Arrange my diagram in the
	 * Simple UI (see LayoutPanel), where it is toggled, a dialog otherwise.
	 */
	EditorUi.prototype.showLayoutPicker = function()
	{
		if (this.isLayoutPanelSupported())
		{
			if (this.layoutPanel != null)
			{
				this.hideLayoutPanel();
			}
			else
			{
				this.showLayoutPanel();
			}

			return;
		}

		var editorUi = this;
		var scope = this.getLayoutScope();
		var previews = new LayoutPreviews(this, scope);
		var suggested = this.getSuggestedLayout(scope);
		var preset = (EditorUi.layoutSpacings[this.layoutPickerSpacing] != null) ?
			this.layoutPickerSpacing : 'normal';
		var current = null;
		var entries = [];

		for (var i = 0; i < EditorUi.layoutPickerEntries.length; i++)
		{
			if (EditorUi.isLayoutTypeAvailable(EditorUi.layoutPickerEntries[i].type))
			{
				entries.push(EditorUi.layoutPickerEntries[i]);
			}
		}

		var div = document.createElement('div');
		div.className = 'geLayoutPicker';

		var hd = document.createElement('h3');
		mxUtils.write(hd, mxResources.get('chooseLayout'));
		div.appendChild(hd);

		var top = document.createElement('div');
		top.className = 'geLayoutPickerTop';
		div.appendChild(top);

		var hint = document.createElement('div');
		hint.className = 'geDialogHint';
		mxUtils.write(hint, mxResources.get('chooseLayoutHint'));
		top.appendChild(hint);

		var tiles = [];

		var render = function()
		{
			var example = false;
			exampleHint.style.display = 'none';
			previews.startPass();

			for (var i = 0; i < tiles.length; i++)
			{
				(function(tile)
				{
					tile.button.disabled = false;

					// Layouts that fail for the diagram (eg. a radial tree
					// without a root) can't be chosen
					previews.render(tile.thumb, EditorUi.getLayoutPickerList(tile.entry, preset),
						tile.thumb.clientWidth || 176, tile.thumb.clientHeight || 100,
						function(isExample, failed)
					{
						tile.button.disabled = failed;

						if (isExample && !failed && !example)
						{
							example = true;
							exampleHint.style.display = '';
						}
					}, true);
				})(tiles[i]);
			}
		};

		var spacing = this.createLayoutSegments([
			{value: 'compact', label: mxResources.get('compact')},
			{value: 'normal', label: mxResources.get('normal')},
			{value: 'airy', label: mxResources.get('airy')}], preset, function(value)
		{
			preset = value;
			editorUi.layoutPickerSpacing = value;
			render();
		}, mxResources.get('spacing'));

		var spacingRow = document.createElement('div');
		spacingRow.className = 'geLayoutPickerSpacing';
		var spacingLabel = document.createElement('span');
		mxUtils.write(spacingLabel, mxResources.get('spacing') + ':');
		spacingRow.appendChild(spacingLabel);
		spacingRow.appendChild(spacing);
		top.appendChild(spacingRow);

		var grid = document.createElement('div');
		grid.className = 'geLayoutPickerGrid';
		div.appendChild(grid);

		var apply = function(entry)
		{
			editorUi.hideDialog();

			editorUi.tryAndHandle(function()
			{
				editorUi.applyLayoutList(EditorUi.getLayoutPickerList(entry, preset), scope);
			});
		};

		for (var i = 0; i < entries.length; i++)
		{
			(function(entry)
			{
				var tile = document.createElement('button');
				tile.setAttribute('type', 'button');
				tile.className = 'geLayoutTile';

				// The name is the visible text of the tile, as in the panel

				var thumb = document.createElement('div');
				thumb.className = 'geLayoutTileThumb';
				thumb.setAttribute('aria-hidden', 'true');
				tile.appendChild(thumb);

				var name = document.createElement('div');
				name.className = 'geLayoutTileName';
				mxUtils.write(name, EditorUi.getLayoutName(entry.name));
				tile.appendChild(name);

				if (entry.id == suggested)
				{
					tile.classList.add('geLayoutTileSuggested');
					var badge = document.createElement('span');
					badge.className = 'geLayoutTileBadge';
					mxUtils.write(badge, mxResources.get('suggested'));
					tile.appendChild(badge);
				}

				var desc = document.createElement('div');
				desc.className = 'geDialogHint';
				mxUtils.write(desc, mxResources.get(entry.hint));
				tile.appendChild(desc);

				// The focused or clicked tile is the one of Layout Settings, not
				// the one under the mouse: the way to the button crosses other
				// tiles (w94m S1)
				mxEvent.addListener(tile, 'focus', function()
				{
					current = entry;
				});

				mxEvent.addListener(tile, 'click', function()
				{
					current = entry;
					apply(entry);
				});

				grid.appendChild(tile);
				tiles.push({entry: entry, thumb: thumb, button: tile});
			})(entries[i]);
		}

		var exampleHint = document.createElement('div');
		exampleHint.className = 'geDialogHint geLayoutPickerExample';
		exampleHint.style.display = 'none';
		mxUtils.write(exampleHint, mxResources.get('layoutExampleHint'));
		div.appendChild(exampleHint);

		var settingsBtn = mxUtils.button(mxResources.get('layoutSettings') + '...', function()
		{
			var entry = current;

			if (entry == null)
			{
				for (var i = 0; i < entries.length && entry == null; i++)
				{
					if (entries[i].id == suggested)
					{
						entry = entries[i];
					}
				}
			}

			editorUi.hideDialog();
			editorUi.showLayoutSettings((entry != null) ?
				EditorUi.getLayoutPickerList(entry, preset) : null, scope);
		});
		settingsBtn.className = 'geBtn';

		var dlg = new CustomDialog(this, div, null, null, mxResources.get('close'),
			null, settingsBtn, true);
		this.showDialog(dlg.container, 600, null, true, true, function()
		{
			previews.destroy();
		});

		render();

		var first = grid.querySelector('.geLayoutTileSuggested') || grid.firstChild;

		if (first != null)
		{
			first.focus();
		}
	};

	/**
	 * Shows the layout form (Layout Settings) for the given custom layout or
	 * the layout of the selected layout container, the last layout, the
	 * last custom layout or a flow from top to bottom, in this order. Apply
	 * runs the layout in the given scope (default is the current scope, see
	 * getLayoutScope).
	 */
	EditorUi.prototype.showLayoutSettings = function(list, scope)
	{
		this.loadOrgChartLayouts(mxUtils.bind(this, function()
		{
			this.tryAndHandle(mxUtils.bind(this, function()
			{
				this.doShowLayoutSettings(list, scope);
			}));
		}));
	};

	/**
	 * Shows the layout form after the org chart layout was loaded.
	 */
	EditorUi.prototype.doShowLayoutSettings = function(list, scope)
	{
		var editorUi = this;
		var graph = this.editor.graph;
		scope = (scope != null) ? scope : this.getLayoutScope();

		if (list == null && scope.containers != null && scope.containers.length == 1)
		{
			try
			{
				var layouts = Graph.getChildLayouts(graph.getCellStyle(scope.containers[0]));

				if (Array.isArray(layouts) && layouts.length > 0)
				{
					list = layouts;
				}
			}
			catch (e)
			{
				// Ignores invalid layouts
			}
		}

		if (list == null)
		{
			list = (Array.isArray(this.lastLayoutSpec) && this.lastLayoutSpec.length > 0) ?
				this.lastLayoutSpec : ((Array.isArray(this.customLayoutConfig) &&
				this.customLayoutConfig.length > 0) ? this.customLayoutConfig :
				EditorUi.getLayoutPickerList(EditorUi.layoutPickerEntries[0]));
		}

		var previews = new LayoutPreviews(this, scope);
		var state = {};
		var json = null;
		var lastJson = null;
		var previewThread = null;

		var div = document.createElement('div');
		div.className = 'geLayoutForm';

		var hd = document.createElement('h3');
		mxUtils.write(hd, mxResources.get('layoutSettings'));
		div.appendChild(hd);

		if (scope.containers != null || scope.cells != null)
		{
			var scopeHint = document.createElement('div');
			scopeHint.className = 'geDialogHint geLayoutFormScope';
			mxUtils.write(scopeHint, mxResources.get((scope.containers != null) ?
				'layoutAppliesToContainer' : 'layoutAppliesToSelection'));
			div.appendChild(scopeHint);
		}

		var typeSection = document.createElement('div');
		typeSection.className = 'geDialogSection';
		div.appendChild(typeSection);

		var types = [];

		for (var i = 0; i < EditorUi.layoutTypeOrder.length; i++)
		{
			var type = EditorUi.layoutTypeOrder[i];

			if (EditorUi.isLayoutTypeAvailable(type))
			{
				types.push({value: type, label: EditorUi.getLayoutName(EditorUi.layoutTypes[type].name)});
			}
		}

		var typeSegments = this.createLayoutSegments(types, null, function(type)
		{
			setType(type);
		}, mxResources.get('arrangeAs'), 'geLayoutTypes');
		var typeRow = EditorUi.addLayoutFormRow(typeSection, mxResources.get('arrangeAs'), typeSegments);
		typeRow.className += ' geDialogFormRowTop';

		var options = document.createElement('div');
		options.className = 'geDialogSection';
		div.appendChild(options);

		var jsonHint = document.createElement('div');
		jsonHint.className = 'geDialogHint geLayoutFormJsonHint';
		mxUtils.write(jsonHint, mxResources.get('layoutJsonHint'));
		div.appendChild(jsonHint);

		var preview = document.createElement('div');
		preview.className = 'geLayoutFormPreview';
		preview.setAttribute('aria-hidden', 'true');
		div.appendChild(preview);

		var previewHint = document.createElement('div');
		previewHint.className = 'geDialogHint geLayoutPickerExample';
		previewHint.style.display = 'none';
		mxUtils.write(previewHint, mxResources.get('layoutExampleHint'));
		div.appendChild(previewHint);

		var advanced = this.addAdvancedSection(div, 'editAsJson');
		var textarea = document.createElement('textarea');
		textarea.className = 'geLayoutFormJson';
		textarea.setAttribute('spellcheck', 'false');
		textarea.setAttribute('aria-label', mxResources.get('editAsJson'));
		advanced.content.appendChild(textarea);

		var jsonError = document.createElement('div');
		jsonError.className = 'geDialogHint geLayoutFormJsonError';
		advanced.content.appendChild(jsonError);

		var updatePreview = function()
		{
			window.clearTimeout(previewThread);

			previewThread = window.setTimeout(function()
			{
				var w = preview.clientWidth;
				var h = preview.clientHeight;
				previews.startPass();

				previews.render(preview, state.list, (w > 0) ? w : 500, (h > 0) ? h : 160,
					function(example, failed)
				{
					previewHint.style.display = (example && !failed) ? '' : 'none';
				});
			}, 250);
		};

		var writeJson = function()
		{
			lastJson = JSON.stringify(state.list, null, 2);
			textarea.value = lastJson;
			jsonError.innerHTML = '';
		};

		// Called after the form changed the values
		var changed = function()
		{
			state.list = [EditorUi.createLayoutFormEntry(state.values, state.base, state.initial)];
			writeJson();
			updatePreview();
		};

		var addCheck = function(key, label)
		{
			var cb = editorUi.addCheckbox(options, label, state.values[key] === true,
				null, null, null, null, null, true);

			mxEvent.addListener(cb, 'change', function()
			{
				state.values[key] = cb.checked;
				changed();
			});
		};

		var addSpacing = function(key, label, spacingSegments)
		{
			var wrapper = document.createElement('div');
			wrapper.className = 'geLayoutFormNumber';

			var input = document.createElement('input');
			input.setAttribute('type', 'number');
			input.setAttribute('min', '0');
			input.setAttribute('max', String(EditorUi.maxLayoutSpacing));
			input.setAttribute('aria-label', label);
			input.value = String(state.values[key]);
			wrapper.appendChild(input);

			var unit = document.createElement('span');
			unit.className = 'geDialogHint';
			mxUtils.write(unit, 'pt');
			wrapper.appendChild(unit);

			mxEvent.addListener(input, 'input', function()
			{
				var value = EditorUi.getLayoutSpacing(input.value, null);

				if (value != null)
				{
					state.values[key] = value;
					spacingSegments.setValue(EditorUi.getLayoutSpacingPreset(state.values));
					changed();
				}
			});

			EditorUi.addLayoutFormRow(options, label, wrapper);

			return input;
		};

		// Creates the rows of the options of the current type
		var renderOptions = function()
		{
			options.innerHTML = '';
			var values = state.values;
			typeSegments.setValue((values != null) ? values.type : null);
			jsonHint.style.display = (values == null) ? '' : 'none';
			options.style.display = (values == null || values.type == 'circle') ? 'none' : '';

			if (values != null)
			{
				var t = EditorUi.layoutTypes[values.type];

				if (t.directions)
				{
					var directions = editorUi.createLayoutSegments([
						{value: 'DOWN', label: '↓', title: mxResources.get('topToBottom')},
						{value: 'RIGHT', label: '→', title: mxResources.get('leftToRight')},
						{value: 'UP', label: '↑', title: mxResources.get('bottomToTop')},
						{value: 'LEFT', label: '←', title: mxResources.get('rightToLeft')}],
						values.direction, function(value)
					{
						values.direction = value;
						changed();
					}, mxResources.get('direction'), 'geLayoutDirections');
					EditorUi.addLayoutFormRow(options, mxResources.get('direction'), directions);
				}

				if (t.shapes != null)
				{
					var inputs = [];

					var spacingSegments = editorUi.createLayoutSegments([
						{value: 'compact', label: mxResources.get('compact')},
						{value: 'normal', label: mxResources.get('normal')},
						{value: 'airy', label: mxResources.get('airy')}],
						EditorUi.getLayoutSpacingPreset(values), function(value)
					{
						var defaults = EditorUi.getLayoutFormDefaults(values.type, value);
						values.shapes = defaults.shapes;
						values.levels = defaults.levels;
						inputs[0].value = String(values.shapes);

						if (inputs.length > 1)
						{
							inputs[1].value = String(values.levels);
						}

						changed();
					}, mxResources.get('spacing'));

					EditorUi.addLayoutFormRow(options, mxResources.get('spacing'), spacingSegments);
					inputs.push(addSpacing('shapes', mxResources.get('betweenShapes'), spacingSegments));

					if (t.levels != null)
					{
						inputs.push(addSpacing('levels', mxResources.get('betweenLevels'), spacingSegments));
					}
				}

				if (t.connectors != null)
				{
					var labels = {auto: 'automatic', orthogonal: 'rightAngles',
						straight: 'straight', keep: 'keepStyle'};
					var items = [];

					for (var i = 0; i < t.connectors.length; i++)
					{
						items.push({value: t.connectors[i], label: mxResources.get(labels[t.connectors[i]])});
					}

					EditorUi.addLayoutFormRow(options, mxResources.get('connectors'),
						editorUi.createLayoutSegments(items, values.connector, function(value)
					{
						values.connector = value;
						changed();
					}, mxResources.get('connectors')));

					EditorUi.addLayoutFormRow(options, mxResources.get('corners'),
						editorUi.createLayoutSegments([
						{value: 'keep', label: mxResources.get('keepStyle')},
						{value: 'straight', label: mxResources.get('sharp')},
						{value: 'rounded', label: mxResources.get('rounded')},
						{value: 'curved', label: mxResources.get('curved')}],
						values.corners, function(value)
					{
						values.corners = value;
						changed();
					}, mxResources.get('corners')));
				}

				var checks = t.checks || [];
				var checkLabels = {resizeNodes: 'layoutResizeShapes', preserveOrigin: 'layoutKeepPosition',
					sharedStems: 'sharedStems', resetConnectionPoints: 'resetConnectionPoints',
					straightConnectors: 'straightConnectors'};

				for (var i = 0; i < checks.length; i++)
				{
					// Layout containers keep their position
					if (checks[i] != 'preserveOrigin' || scope.containers == null)
					{
						addCheck(checks[i], mxResources.get(checkLabels[checks[i]]));
					}
				}
			}

			// The rebuilt rows in the sentence case of Fusion
			if (isFusion() && typeof SimpleUi !== 'undefined' &&
				typeof SimpleUi.applySentenceCase === 'function')
			{
				SimpleUi.applySentenceCase(options, SimpleUi.sentenceCaseDialogSelector);
			}

			EditorUi.updateDialogHeight(div);
		};

		// Shows the given list in the form
		var load = function(newList)
		{
			state.list = newList;
			state.base = (Array.isArray(newList) && newList.length == 1) ? newList[0] : null;
			state.values = EditorUi.getLayoutFormValues(state.base, scope.containers != null);

			if (state.values != null && !EditorUi.isLayoutTypeAvailable(state.values.type))
			{
				state.values = null;
			}

			state.initial = (state.values != null) ? mxUtils.clone(state.values) : null;
			renderOptions();
			updatePreview();
		};

		// Changes the type and keeps the direction, the spacing preset and the
		// options of the current values
		var setType = function(type)
		{
			if (state.values == null || state.values.type != type)
			{
				var prev = state.values;

				if (state.initial != null && state.initial.type == type)
				{
					state.values = mxUtils.clone(state.initial);
				}
				else
				{
					var preset = (prev != null) ? EditorUi.getLayoutSpacingPreset(prev) : null;
					state.values = EditorUi.getLayoutFormDefaults(type, preset);

					if (prev != null)
					{
						state.values.direction = prev.direction;
						state.values.resizeNodes = prev.resizeNodes;
						state.values.preserveOrigin = prev.preserveOrigin;
					}
				}

				renderOptions();
				changed();
			}
		};

		var jsonThread = null;

		mxEvent.addListener(textarea, 'input', function()
		{
			window.clearTimeout(jsonThread);

			jsonThread = window.setTimeout(function()
			{
				try
				{
					var value = JSON.parse(textarea.value);

					if (!Array.isArray(value))
					{
						throw new Error(mxResources.get('error') + ': ' + mxResources.get('expectedJsonArray'));
					}

					jsonError.innerHTML = '';
					lastJson = textarea.value;
					load(value);
				}
				catch (e)
				{
					jsonError.innerHTML = '';
					mxUtils.write(jsonError, e.message);
				}
			}, 400);
		});

		// Returns the list to apply or throws an error
		var getList = function()
		{
			var result = state.list;

			// Uses the JSON if it was changed after the last valid list
			if (textarea.value != lastJson)
			{
				result = JSON.parse(textarea.value);
			}

			if (!Array.isArray(result))
			{
				throw new Error(mxResources.get('error') + ': ' + mxResources.get('expectedJsonArray'));
			}

			// Throws for unknown layouts and, for layout containers, for the
			// layouts they can't have, so that the dialog stays open
			graph.createLayouts(result);

			if (scope.containers != null)
			{
				editorUi.createContainerChildLayout(EditorUi.getContainerLayoutSpec(result));
			}

			return result;
		};

		// Errors keep the dialog open (hideAfterOKFn)
		var dlg = new CustomDialog(this, div, function()
		{
			var result = null;

			try
			{
				result = getList();
			}
			catch (e)
			{
				return e.message;
			}

			editorUi.customLayoutConfig = result;

			editorUi.tryAndHandle(function()
			{
				editorUi.applyLayoutList(result, scope);
			});
		}, null, mxResources.get('apply'), EditorUi.APPLY_LAYOUTS_SPEC_URL,
			null, null, null, true);

		this.showDialog(dlg.container, 560, null, true, true, function()
		{
			window.clearTimeout(previewThread);
			window.clearTimeout(jsonThread);
			previews.destroy();
		});

		load(list);
		writeJson();

		var focus = typeSegments.querySelector('[aria-pressed="true"]') || typeSegments.firstChild;

		if (focus != null)
		{
			focus.focus();
		}
	};
})();
