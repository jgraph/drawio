/**
 * Copyright (c) 2006-2026, JGraph Holdings Ltd
 * Copyright (c) 2006-2026, draw.io AG
 */
/**
 * Tidy up: analyses the page or the selection, finds out what kind of
 * diagram it is (rules, then the forest of TidyForest.js where the rules
 * are unsure), tries the layouts of the plan on a copy of the model in an
 * offscreen graph, scores the results by their metrics (crossings, edges
 * through shapes, overlaps, the arrangement that is kept) and applies the
 * best one as one undoable edit. No language model and no text input: the
 * plan only names layouts and operations the app already has (ELK,
 * MindmapLayout, BalloonTreeLayout, libavoid, the label resets).
 *
 * Never changed: labels, values, data, links and IDs, locked cells and
 * cells that cannot move, cells with tidy=0 (and their children), the cell
 * hierarchy of containers and groups (they move as a whole at most if
 * nothing else is in them, see collect), the inside of layout containers,
 * tables and ties, and the arrows, dashes and directions of connectors.
 * The one structural change is a free text next to a connector ("yes",
 * "no"), which becomes a label of the connector with its ID, value and
 * style (attachTexts).
 *
 * The trials never touch the model of the editor, so collaborators and
 * the undo history only see the applied result.
 *
 * In extensions.min.js (loaded by EditorUi.loadTidy in TidyActions.js).
 */
var Tidy = {};

/**
 * Spacings between shapes for Compact, Normal and Airy.
 */
Tidy.spacings = {compact: 30, normal: 40, airy: 60};

/**
 * Returns the spacing for the given name, normal for other names.
 */
Tidy.getSpacing = function(name)
{
	return (typeof name === 'string' && Object.prototype.hasOwnProperty.call(Tidy.spacings, name)) ?
		Tidy.spacings[name] : Tidy.spacings.normal;
};

/**
 * Above this number of movable shapes only the current arrangement is tried
 * (each layout takes time), above maxThumbnailCells no thumbnails are made.
 */
Tidy.maxLayoutVertices = 1000;
Tidy.maxThumbnailCells = 3000;

/**
 * Without a layout, libavoid routes all connectors up to this number and
 * only the connectors that cross shapes above it, and none if more than this
 * number cross shapes (the time of a solve grows with the connectors and the
 * shapes they pass).
 */
Tidy.maxRoutedEdges = 60;

/**
 * The metrics stop counting crossings after this many pairs of segments
 * (limits the work for huge diagrams, see measure).
 */
Tidy.maxCrossingChecks = 1000000;

/**
 * A pass over an index (see Tidy.Grid) ends after it visited this many
 * entries of its buckets (limits the work for huge diagrams, eg. long
 * connectors or all shapes in one place). An item is in each bucket that it
 * meets, up to 400, and the entries of items that a query already visited
 * count too. What it did not visit does not count. A decision that needs a
 * query this limit ended is unknown, so the cell stays as it is.
 */
Tidy.maxGridChecks = 1000000;

/**
 * Size of the thumbnails of the alternatives.
 */
Tidy.thumbnailWidth = 200;
Tidy.thumbnailHeight = 120;

/**
 * Free texts with at most this many characters and at most this distance
 * from a connector become labels of the connector (eg. "yes" and "no").
 */
Tidy.maxAttachedTextLength = 24;
Tidy.maxAttachedTextDistance = 30;

/**
 * Centers that are less apart than this are aligned in the current
 * arrangement.
 */
Tidy.alignTolerance = 10;

/**
 * Weights of the score (lower is better, see score).
 */
Tidy.weights = {overlaps: 10, crossings: 4, edgeThroughShape: 6, tangled: 3,
	bends: 0.5, aspect: 3, area: 1.5, edgeLength: 0.02, orderKept: 12,
	labelOverEdge: 2};

/**
 * Scores that are less apart than this share are a tie, which the rank of
 * the forest breaks.
 */
Tidy.tieTolerance = 0.05;

/**
 * Candidates of a plan. Each names a layout (null keeps the arrangement)
 * and its resource key. The layouts are specs of Graph.createLayouts with
 * the given spacing; the ELK ones come from the presets of Arrange > Layout.
 */
Tidy.candidates = {
	keep: {name: 'keepMyArrangement'},
	flowDown: {name: 'verticalFlow', preset: 'verticalFlow', direction: 'down'},
	flowRight: {name: 'horizontalFlow', preset: 'horizontalFlow', direction: 'right'},
	treeDown: {name: 'verticalTree', preset: 'verticalTree', direction: 'down', tree: true},
	treeRight: {name: 'horizontalTree', preset: 'horizontalTree', direction: 'right', tree: true},
	mindmap: {name: 'mindmap', layout: 'MindmapLayout', direction: 'right', tree: true},
	balloon: {name: 'balloonTree', layout: 'BalloonTreeLayout', tree: true},
	organic: {name: 'organic', layout: 'elkStress'}
};

/**
 * ELK algorithms of the candidates. A candidate is tried if its shapes and
 * connectors are at most layoutLimitFactor times the limit of the algorithm
 * for live layout containers (Graph.elkLiveLayoutLimits, about 0.1-0.3 s).
 */
Tidy.layoutAlgorithms = {flowDown: 'layered', flowRight: 'layered', treeDown: 'mrtree',
	treeRight: 'mrtree', organic: 'stress'};
Tidy.layoutLimitFactor = 2;

/**
 * Returns true if the given candidate is too large for the given number of
 * cells (see layoutAlgorithms).
 */
Tidy.isLayoutTooLarge = function(id, cells)
{
	var algorithm = Tidy.layoutAlgorithms[id];
	var limits = (typeof Graph.elkLiveLayoutLimits === 'object') ? Graph.elkLiveLayoutLimits : null;
	var limit = (algorithm != null && limits != null && typeof limits[algorithm] === 'number') ?
		limits[algorithm] : 600;

	return algorithm != null && cells > limit * Tidy.layoutLimitFactor;
};

/**
 * Layout classes of the forest and their candidates.
 */
Tidy.forestLayouts = {keep: 'keep', verticalFlow: 'flowDown', horizontalFlow: 'flowRight',
	verticalTree: 'treeDown', horizontalTree: 'treeRight', radialTree: 'balloon',
	organic: 'organic'};

/**
 * Kinds of the forest and the kinds of the rules they stand for. Used only
 * where the rules find no kind (graph or freeform).
 */
Tidy.forestKinds = {flow: 'flowchart', hierarchy: 'tree', architecture: 'network',
	uml_er: 'graph', engineering: 'freeform', visual: 'freeform'};

/**
 * Returns true if the given resolved style opts out of Tidy up and Style.
 */
Tidy.isOptOut = function(style)
{
	return style != null && style['tidy'] == '0';
};

/**
 * Returns the style of the given cell if it has a childLayout, else null.
 * extensions.min.js can run with an older app.min.js, so newer functions of
 * the core are feature-detected.
 */
Tidy.getChildLayoutStyle = function(graph, cell)
{
	if (typeof graph.getChildLayoutStyle === 'function')
	{
		return graph.getChildLayoutStyle(cell);
	}

	var style = graph.getCellStyle(cell);

	return (style['childLayout'] != null) ? style : null;
};

/**
 * Returns the style rules of the page of the given graph as a JSON string or
 * null (see Graph.getStyleRulesJson).
 */
Tidy.getStyleRulesJson = function(graph)
{
	return (typeof graph.getStyleRulesJson === 'function') ?
		graph.getStyleRulesJson(graph.model.getRoot().value) : null;
};

/**
 * Returns true if the given cell is a free text (a text shape).
 */
Tidy.isText = function(graph, cell, style)
{
	var raw = graph.model.getStyle(cell) || '';

	return style['shape'] == 'text' || raw.substring(0, 5) == 'text;' || raw == 'text';
};

/**
 * Returns true if the given cell is an icon of a vendor or network palette
 * or an image with its label outside.
 */
Tidy.isIcon = function(graph, cell, style)
{
	var shape = String(style['shape'] || '');

	return shape == 'image' || shape == 'mxgraph.aws4.resourceIcon' ||
		(/^mxgraph\.(aws4|aws3|azure|azure2|gcp2|kubernetes|cisco|cisco19|network|network2|citrix|veeam|ibm|alibaba_cloud|office)\./.test(shape) &&
		!/group|container|zone|region|subnet|vpc/i.test(shape)) ||
		(style['verticalLabelPosition'] == 'bottom' && style['aspect'] == 'fixed');
};

/**
 * Returns the cells of the scope (the given cells, or the current layer of
 * the given graph, or the group or container that is entered, if null) as {vertices, fixed, containers, texts, edges,
 * allEdges, leaves, icons, movable, editable}:
 * - vertices: shapes that may move (not locked, no tidy=0, not in a
 *   container and no containers themselves).
 * - fixed: shapes that must stay where they are.
 * - containers: containers, groups, swimlanes, tables and layout
 *   containers of the scope. Their children never move.
 * - texts: free texts that may move.
 * - edges: connectors that may change, allEdges: all connectors of the
 *   scope (for the metrics), leaves: all shapes without children.
 * - outside, outsideContainers: with a selection, the shapes without
 *   children and the containers outside it, which the shapes of the
 *   selection must not be moved onto (see removeOverlaps, measure and
 *   getEdgesThroughShapes).
 * movable and editable map the IDs of vertices and edges to true.
 */
Tidy.collect = function(graph, cells)
{
	var model = graph.model;
	var parent = graph.getDefaultParent();
	var col = {parent: parent, vertices: [], fixed: [], containers: [], texts: [],
		edges: [], allEdges: [], leaves: [], icons: [], units: [], outside: [],
		outsideContainers: [], movable: Object.create(null),
		editable: Object.create(null), nested: Object.create(null),
		scoped: cells != null && cells.length > 0,
		locked: 0, optOut: 0};
	var scope = null;
	var seen = Object.create(null);

	if (col.scoped)
	{
		scope = Object.create(null);

		for (var i = 0; i < cells.length; i++)
		{
			if (cells[i] != null)
			{
				scope[cells[i].id] = true;
			}
		}
	}

	var isRelative = function(cell)
	{
		var geo = model.getGeometry(cell);

		return geo == null || geo.relative;
	};

	var hasChildVertices = function(cell)
	{
		for (var i = 0; i < model.getChildCount(cell); i++)
		{
			var child = model.getChildAt(cell, i);

			if (model.isVertex(child) && !isRelative(child))
			{
				return true;
			}
		}

		return false;
	};

	// What a shape is for visit: layout (a child layout other than a stack,
	// which owns everything inside it: tables, racks, layout containers),
	// stack (a pool, which only places its children), container and locked
	var getKind = function(cell)
	{
		var layoutStyle = Tidy.getChildLayoutStyle(graph, cell);
		var stack = layoutStyle != null && layoutStyle['childLayout'] == 'stackLayout';
		var layout = layoutStyle != null && !stack;

		return {layout: layout, stack: stack, locked: graph.isCellLocked(cell) ||
			!graph.isCellMovable(cell), container: !layout && (stack ||
			hasChildVertices(cell) || graph.isSwimlane(cell) || graph.isContainer(cell))};
	};

	// Returns the frozen, owned and stacked flags of the children of the
	// given shape (see visit)
	var getChildFlags = function(cell, kind, optOut, frozen, owned, stacked)
	{
		if (kind.layout || kind.container)
		{
			// Groups keep their composition and other containers in
			// stacks are parts of a shape (the rows of a list), while
			// swimlanes, lanes and containers open their content
			var group = !kind.stack && !graph.isSwimlane(cell) && !graph.isContainer(cell);

			return {frozen: frozen || kind.layout || kind.locked || optOut || group ||
				(stacked && !graph.isSwimlane(cell)), owned: owned || kind.layout || optOut,
				stacked: kind.stack};
		}
		else
		{
			// Edges in leaves (eg. in groups of a stencil) stay
			return {frozen: true, owned: true, stacked: false};
		}
	};

	// frozen: the shapes keep their place and style (in a group, a layout
	// container, a locked container or a container with tidy=0), owned: the
	// connectors belong to a layout or a shape. Shapes in swimlanes and other
	// containers only move to align them or to remove overlaps, within their
	// container.
	var visit = function(cell, frozen, owned, inScope, nested, stacked)
	{
		for (var i = 0; i < model.getChildCount(cell); i++)
		{
			var child = model.getChildAt(cell, i);

			if (seen[child.id] || !graph.isCellVisible(child))
			{
				continue;
			}

			seen[child.id] = true;
			var style = graph.getCellStyle(child);
			var optOut = Tidy.isOptOut(style);
			var selected = inScope || scope == null || scope[child.id] === true;

			if (optOut)
			{
				col.optOut++;
			}

			if (model.isEdge(child))
			{
				col.allEdges.push(child);

				if (!optOut && !owned && !graph.isCellLocked(child) &&
					graph.isCellEditable(child) && style['ties'] == null)
				{
					col.edges.push(child);
					col.editable[child.id] = true;
				}
			}
			else if (model.isVertex(child) && !isRelative(child))
			{
				var kind = getKind(child);
				var locked = kind.locked;
				var flags = getChildFlags(child, kind, optOut, frozen, owned, stacked);

				if (locked)
				{
					col.locked++;
				}

				if (kind.layout || kind.container)
				{
					if (selected)
					{
						col.containers.push(child);
						col.fixed.push(child);

						// Containers on the page may move as a whole to remove overlaps
						if (!frozen && !nested && !locked && !optOut &&
							!graph.isTransparentBounds(child))
						{
							col.units.push(child);
						}
					}
					else
					{
						col.outsideContainers.push(child);
					}
				}
				else
				{
					if (selected)
					{
						col.leaves.push(child);

						if (Tidy.isIcon(graph, child, style))
						{
							col.icons.push(child);
						}

						if (frozen || stacked || optOut || locked ||
							(typeof graph.isTie === 'function' && graph.isTie(child)))
						{
							col.fixed.push(child);
						}
						else
						{
							if (nested)
							{
								col.nested[child.id] = true;
							}

							if (Tidy.isText(graph, child, style) &&
								model.getEdgeCount(child) == 0)
							{
								col.texts.push(child);
							}
							else
							{
								col.vertices.push(child);
							}

							col.movable[child.id] = true;
						}
					}
					else
					{
						col.outside.push(child);
					}
				}

				visit(child, flags.frozen, flags.owned, selected, true, flags.stacked);
			}
		}
	};

	if (parent != null)
	{
		// In an entered group or container (the current root), the shapes
		// get the flags they get on the layer, so that groups keep their
		// composition and layout, locked and tidy=0 containers their content
		var path = [];
		var flags = {frozen: false, owned: false, stacked: false};

		for (var cell = parent; model.isVertex(cell); cell = model.getParent(cell))
		{
			path.unshift(cell);
		}

		for (var i = 0; i < path.length; i++)
		{
			flags = getChildFlags(path[i], getKind(path[i]),
				Tidy.isOptOut(graph.getCellStyle(path[i])),
				flags.frozen, flags.owned, flags.stacked);
		}

		visit(parent, flags.frozen, flags.owned, false, path.length > 0, flags.stacked);
	}

	// With a selection, only the connectors of the selection change
	if (scope != null)
	{
		var edges = [];
		var all = [];

		for (var i = 0; i < col.allEdges.length; i++)
		{
			var edge = col.allEdges[i];
			var src = model.getTerminal(edge, true);
			var trg = model.getTerminal(edge, false);

			if (scope[edge.id] || (src != null && col.movable[src.id]) ||
				(trg != null && col.movable[trg.id]))
			{
				all.push(edge);

				if (col.editable[edge.id])
				{
					edges.push(edge);
				}
			}
			else
			{
				delete col.editable[edge.id];
			}
		}

		col.edges = edges;
		col.allEdges = all;
	}

	return col;
};

/**
 * Returns true if the edges of the given collection form a forest where each
 * vertex has at most one incoming edge (see classify).
 */
Tidy.getStructure = function(graph, col)
{
	var model = graph.model;
	var inDeg = Object.create(null), outDeg = Object.create(null), deg = Object.create(null);
	var undirected = 0, curved = 0, connected = 0, multiParent = false, edges = 0;
	var vset = Object.create(null);

	for (var i = 0; i < col.vertices.length; i++)
	{
		vset[col.vertices[i].id] = true;
	}

	for (var i = 0; i < col.fixed.length; i++)
	{
		vset[col.fixed[i].id] = true;
	}

	for (var i = 0; i < col.allEdges.length; i++)
	{
		var e = col.allEdges[i];
		var s = model.getTerminal(e, true), t = model.getTerminal(e, false);

		if (s == null || t == null || s == t || !vset[s.id] || !vset[t.id])
		{
			continue;
		}

		edges++;
		inDeg[t.id] = (inDeg[t.id] || 0) + 1;
		outDeg[s.id] = (outDeg[s.id] || 0) + 1;
		deg[s.id] = (deg[s.id] || 0) + 1;
		deg[t.id] = (deg[t.id] || 0) + 1;

		if (inDeg[t.id] > 1)
		{
			multiParent = true;
		}

		var es = graph.getCellStyle(e);

		if (es[mxConstants.STYLE_ENDARROW] == mxConstants.NONE &&
			(es[mxConstants.STYLE_STARTARROW] == null ||
			es[mxConstants.STYLE_STARTARROW] == mxConstants.NONE))
		{
			undirected++;
		}

		if (es[mxConstants.STYLE_CURVED] == '1' || es[mxConstants.STYLE_EDGE] == 'entityRelationEdgeStyle')
		{
			curved++;
		}
	}

	var roots = [], maxDeg = 0;

	for (var id in deg)
	{
		connected++;
		maxDeg = Math.max(maxDeg, deg[id]);

		if (!inDeg[id])
		{
			roots.push(id);
		}
	}

	// Components (union-find over the edges)
	var parent = Object.create(null);

	var find = function(x)
	{
		while (parent[x] != null && parent[x] != x)
		{
			parent[x] = parent[parent[x]] || parent[x];
			x = parent[x];
		}

		return x;
	};

	for (var id in deg)
	{
		parent[id] = id;
	}

	for (var i = 0; i < col.allEdges.length; i++)
	{
		var e = col.allEdges[i];
		var s = model.getTerminal(e, true), t = model.getTerminal(e, false);

		if (s != null && t != null && deg[s.id] && deg[t.id])
		{
			var a = find(s.id), b = find(t.id);

			if (a != b)
			{
				parent[a] = b;
			}
		}
	}

	var components = 0;

	for (var id in deg)
	{
		if (find(id) == id)
		{
			components++;
		}
	}

	return {edges: edges, connected: connected, roots: roots, maxDeg: maxDeg,
		inDeg: inDeg, outDeg: outDeg, deg: deg, undirected: undirected, curved: curved,
		components: components, tree: connected >= 4 && !multiParent &&
		edges == connected - components};
};

/**
 * Returns the kind of the diagram by rules (see the cleanup study):
 * sequence, cloud, er, swimlanes, network, mindmap, tree, flowchart,
 * graph or freeform, and whether the rules are sure.
 */
Tidy.classify = function(graph, col, structure)
{
	var styles = [];
	var shapes = col.leaves.concat(col.containers);

	for (var i = 0; i < shapes.length; i++)
	{
		styles.push(graph.model.getStyle(shapes[i]) || '');
	}

	for (var i = 0; i < col.allEdges.length; i++)
	{
		styles.push(graph.model.getStyle(col.allEdges[i]) || '');
	}

	var all = styles.join('\n');
	var st = structure;

	if (/umlLifeline/.test(all))
	{
		return {kind: 'sequence', sure: true};
	}
	else if (/mxgraph\.(aws4|aws3|azure|azure2|gcp2|kubernetes|alibaba_cloud|ibm)\./.test(all))
	{
		return {kind: 'cloud', sure: true};
	}
	else if (/shape=table|entityRelationEdgeStyle|mxgraph\.erd/.test(all))
	{
		return {kind: 'er', sure: true};
	}
	else if (/(^|;|\n)swimlane|mxgraph\.bpmn/.test(all) && col.containers.length > 0)
	{
		return {kind: 'swimlanes', sure: true};
	}
	else if (/mxgraph\.(cisco|cisco19|network|network2|citrix|rack|veeam)\./.test(all))
	{
		return {kind: 'network', sure: true};
	}
	else if (st.tree)
	{
		var root = null;

		for (var i = 0; i < st.roots.length; i++)
		{
			if (root == null || st.deg[st.roots[i]] > st.deg[root])
			{
				root = st.roots[i];
			}
		}

		if ((root != null && st.deg[root] >= 4 && st.components == 1) ||
			st.curved > st.edges / 2 || st.undirected > st.edges / 2 ||
			/mindmap|treeFolding=1/.test(all))
		{
			return {kind: 'mindmap', sure: true};
		}

		return {kind: 'tree', sure: true};
	}
	else if (/rhombus|flowchart\.|shape=process|terminator|parallelogram|shape=document/.test(all) && st.edges > 0)
	{
		return {kind: 'flowchart', sure: true};
	}

	return {kind: (st.edges > 0) ? 'graph' : 'freeform', sure: false};
};

/**
 * Returns the given text with the given replacement for each tag: like
 * replace with /<[^>]*>/g, which takes quadratic time for many < without a >.
 */
Tidy.stripTags = function(text, replacement)
{
	var result = [];
	var pos = 0;
	var start = text.indexOf('<');

	while (start >= 0)
	{
		var end = text.indexOf('>', start);

		if (end < 0)
		{
			break;
		}

		result.push(text.substring(pos, start), replacement);
		pos = end + 1;
		start = text.indexOf('<', pos);
	}

	result.push(text.substring(pos));

	return result.join('');
};

/**
 * Returns the cells of the collection as the input of TidyFeatures.extract.
 */
Tidy.getFeatureCells = function(graph, col)
{
	var model = graph.model;
	var cells = [];
	var shapes = col.leaves.concat(col.containers);

	var plain = function(cell)
	{
		var label = graph.convertValueToString(cell);

		return (label != null) ? Tidy.stripTags(String(label), ' ').
			replace(/\s+/g, ' ').trim() : '';
	};

	for (var i = 0; i < shapes.length; i++)
	{
		var c = shapes[i];
		var geo = model.getGeometry(c);
		var parent = model.getParent(c);

		cells.push({id: c.id, parent: (parent != null) ? parent.id : null,
			vertex: true, edge: false, style: model.getStyle(c) || '', label: plain(c),
			data: mxUtils.isNode(c.value), x: geo.x, y: geo.y, w: geo.width,
			h: geo.height, rel: false, points: 0});
	}

	for (var i = 0; i < col.allEdges.length; i++)
	{
		var e = col.allEdges[i];
		var geo = model.getGeometry(e);
		var src = model.getTerminal(e, true), trg = model.getTerminal(e, false);

		cells.push({id: e.id, edge: true, vertex: false, style: model.getStyle(e) || '',
			label: plain(e), source: (src != null) ? src.id : null,
			target: (trg != null) ? trg.id : null,
			points: (geo != null && geo.points != null) ? geo.points.length : 0});
	}

	return cells;
};

/**
 * Returns the ranking of the forest for the given collection as
 * {kind: [{name, votes}], layout: [{name, votes}]} or null if there is no
 * model (the rules then decide alone).
 */
Tidy.predict = function(graph, col)
{
	if (typeof TidyForest === 'undefined' || typeof TidyFeatures === 'undefined')
	{
		return null;
	}

	try
	{
		var x = TidyFeatures.extract(Tidy.getFeatureCells(graph, col));

		return {kind: TidyFeatures.rank(TidyForest.kind, x),
			layout: TidyFeatures.rank(TidyForest.layout, x)};
	}
	catch (e)
	{
		return null;
	}
};

/**
 * Segment and box index on a grid, so the metrics of large diagrams take
 * linear time for spread out shapes.
 */
Tidy.Grid = function(size)
{
	this.size = size;
	this.cells = Object.create(null);
	this.items = [];
	this.checks = 0;
};

/**
 * Returns true if the given range of buckets is too large to walk. Indexes
 * that are no safe integers are huge too, as x++ stops advancing there.
 */
Tidy.Grid.isHuge = function(ax, ay, bx, by)
{
	return (bx - ax + 1) * (by - ay + 1) > 400 || !Number.isSafeInteger(ax) ||
		!Number.isSafeInteger(ay) || !Number.isSafeInteger(bx) || !Number.isSafeInteger(by);
};

Tidy.Grid.prototype.add = function(item, x0, y0, x1, y1)
{
	var s = this.size;
	var ax = Math.floor(Math.min(x0, x1) / s), bx = Math.floor(Math.max(x0, x1) / s);
	var ay = Math.floor(Math.min(y0, y1) / s), by = Math.floor(Math.max(y0, y1) / s);
	this.items.push(item);

	// Huge items are in a list of their own that every query visits
	if (Tidy.Grid.isHuge(ax, ay, bx, by))
	{
		this.big = this.big || [];
		this.big.push(item);
	}
	else
	{
		for (var x = ax; x <= bx; x++)
		{
			for (var y = ay; y <= by; y++)
			{
				var key = x + ',' + y;
				var list = this.cells[key];

				if (list == null)
				{
					list = [];
					this.cells[key] = list;
				}

				list.push(item);
			}
		}
	}
};

/**
 * Calls fn once for each item whose buckets meet the given box, until fn
 * returns true. The given mark is an object that is unique per query. All
 * queries end after Tidy.maxGridChecks entries of the buckets, until checks
 * is set to 0 for the next pass. Every entry counts, also those of items that
 * this query visited in another bucket, as an item can be in 400 buckets (all
 * shapes of 2000 x 2000 in one place walked 400 times the limit per pass).
 * Returns true if that limit ended this query, so that it may have missed
 * items, and false if fn ended it or it visited all items.
 */
Tidy.Grid.prototype.query = function(x0, y0, x1, y1, fn, mark)
{
	var grid = this;
	var s = this.size;
	var ax = Math.floor(Math.min(x0, x1) / s), bx = Math.floor(Math.max(x0, x1) / s);
	var ay = Math.floor(Math.min(y0, y1) / s), by = Math.floor(Math.max(y0, y1) / s);
	var done = this.checks >= Tidy.maxGridChecks;
	var found = false;

	var visit = function(list)
	{
		for (var i = 0; list != null && i < list.length && !done; i++)
		{
			grid.checks++;

			if (list[i].mark !== mark)
			{
				list[i].mark = mark;
				found = fn(list[i]) === true;
			}

			done = found || grid.checks >= Tidy.maxGridChecks;
		}
	};

	if (Tidy.Grid.isHuge(ax, ay, bx, by))
	{
		visit(this.items);
	}
	else
	{
		for (var x = ax; x <= bx && !done; x++)
		{
			for (var y = ay; y <= by && !done; y++)
			{
				visit(this.cells[x + ',' + y]);
			}
		}

		visit(this.big);
	}

	return done && !found;
};

/**
 * Returns true if the segments p1-p2 and p3-p4 cross (not at their ends).
 */
Tidy.segmentsCross = function(p1, p2, p3, p4)
{
	var d = (p2.x - p1.x) * (p4.y - p3.y) - (p2.y - p1.y) * (p4.x - p3.x);

	if (Math.abs(d) < 1e-9)
	{
		return false;
	}

	var u = ((p3.x - p1.x) * (p4.y - p3.y) - (p3.y - p1.y) * (p4.x - p3.x)) / d;
	var v = ((p3.x - p1.x) * (p2.y - p1.y) - (p3.y - p1.y) * (p2.x - p1.x)) / d;

	return u > 0.001 && u < 0.999 && v > 0.001 && v < 0.999;
};

/**
 * Returns true if the segment p1-p2 meets the given box.
 */
Tidy.segmentHitsBox = function(p1, p2, x, y, w, h)
{
	if (w <= 0 || h <= 0)
	{
		return false;
	}

	var inside = function(p)
	{
		return p.x > x && p.x < x + w && p.y > y && p.y < y + h;
	};

	if (inside(p1) || inside(p2))
	{
		return true;
	}

	var c = [{x: x, y: y}, {x: x + w, y: y}, {x: x + w, y: y + h}, {x: x, y: y + h}];

	for (var i = 0; i < 4; i++)
	{
		if (Tidy.segmentsCross(p1, p2, c[i], c[(i + 1) % 4]))
		{
			return true;
		}
	}

	return false;
};

/**
 * Start and end of the stencils of the freehand tool (mxFreehand.js).
 */
Tidy.freehandStencilStart = '<shape strokewidth="inherit"><foreground>';

Tidy.freehandStencilEnd = '</foreground></shape>';

/**
 * The parts of the stencils of the freehand tool between start and end:
 * paths of lines only, with the points in two decimals (toFixed(2) of
 * mxFreehand.js and of the pen of the Miro import). The importers of Visio
 * and Lucidchart start their stencils as freehand does but write the points
 * as numbers (String), curves, arcs and closed paths.
 */
Tidy.freehandStencilParts = /<\/?path>|<(fill)?stroke\/>|<(move|line) x="-?\d+\.\d\d" y="-?\d+\.\d\d"\/>/g;

/**
 * Returns true if the given stencil XML is one of the freehand tool (see
 * freehandStencilParts).
 */
Tidy.isFreehandStencil = function(xml)
{
	var start = Tidy.freehandStencilStart, end = Tidy.freehandStencilEnd;

	return typeof xml === 'string' && xml.length > start.length + end.length &&
		xml.substring(0, start.length) == start &&
		xml.substring(xml.length - end.length) == end &&
		xml.substring(start.length, xml.length - end.length).
			replace(Tidy.freehandStencilParts, '').length == 0;
};

/**
 * Returns true if the given cell is a drawing of the brush or the pen
 * (Freehand, mxFreehand.js): a stencil with lineShape=1 (perfect freehand,
 * which paints the line as the fill; only mxFreehand.js writes the key) or
 * with the stencil XML of the freehand tool (see isFreehandStencil), with or
 * without a fill. These are lines in a box that is empty elsewhere, so the
 * drawing is never a panel or a frame behind the shapes that its box
 * overlaps: they overlap it where its lines meet them (see isContainment and
 * drawingHitsBox), as for the layouts of Arrange my diagram, which move it
 * like any shape, and stay inside a loop around them. Other stencils (Edit Shape, the imports of
 * Visio and Lucidchart) stay boxes as before, with or without a fill: a
 * shape that lies fully on one at least 1.5 times as large is no overlap
 * (see isContainment), and a stencil with container=1 is a frame (see
 * isFrame). The optional style is the cell style. EditorUi.isSimpleTidyDrawing of SimpleTidy.js has the same rule
 * for the card of Fusion while this file is not loaded: change both.
 */
Tidy.isDrawing = function(graph, cell, style)
{
	style = style || graph.getCellStyle(cell);
	var shape = style['shape'];

	if (typeof shape !== 'string' || shape.substring(0, 8) != 'stencil(' ||
		style['container'] == '1')
	{
		return false;
	}

	if (style['lineShape'] == '1')
	{
		return true;
	}

	try
	{
		return Tidy.isFreehandStencil(Graph.decompress(shape.substring(8, shape.length - 1)));
	}
	catch (e)
	{
		return false;
	}
};

/**
 * Returns 'drawing' (see isDrawing), 'frame' (see isFrame) or 'shape' for the
 * given cell as the larger box of a pair (see isContainment). The optional
 * cache keeps {kind, lines} by ID (lines see drawingHitsBox).
 */
Tidy.getContainerKind = function(graph, cell, cache)
{
	var entry = (cache != null) ? cache[cell.id] : null;

	if (entry == null)
	{
		entry = {kind: (Tidy.isDrawing(graph, cell)) ? 'drawing' :
			((Tidy.isFrame(graph, cell)) ? 'frame' : 'shape')};

		if (cache != null)
		{
			cache[cell.id] = entry;
		}
	}

	return entry.kind;
};

/**
 * Elements of stencils whose lines are not read (see getDrawingLines).
 */
Tidy.drawingShapes = ['rect', 'roundrect', 'ellipse', 'text', 'image', 'include-shape'];

/**
 * Returns the lines of the stencil of the given drawing (see isDrawing) as
 * {segments, rotation}: the segments [x1, y1, x2, y2] of the moves, lines and
 * closes of its paths in its box from 0 to 1, with flipH and flipV, and the
 * rotation of the style in degrees. Returns null if the lines are unknown (a
 * curve, an arc or a shape in the stencil, a fixed aspect or a direction), so
 * that the whole box of the drawing counts (see drawingHitsBox). The optional
 * style is the cell style. EditorUi.getSimpleTidyLines of SimpleTidy.js has
 * the same rule for the card of Fusion while this file is not loaded: change
 * both.
 */
Tidy.getDrawingLines = function(graph, cell, style)
{
	style = style || graph.getCellStyle(cell);
	var shape = style['shape'];
	var direction = style[mxConstants.STYLE_DIRECTION];

	if (typeof shape !== 'string' || shape.substring(0, 8) != 'stencil(' ||
		(direction != null && direction != mxConstants.DIRECTION_EAST))
	{
		return null;
	}

	try
	{
		var root = mxUtils.parseXml(Graph.decompress(shape.substring(8, shape.length - 1))).documentElement;
		var w0 = Number(root.getAttribute('w') || 100), h0 = Number(root.getAttribute('h') || 100);

		if (root.nodeName != 'shape' || root.getAttribute('aspect') == 'fixed' || !(w0 > 0) || !(h0 > 0))
		{
			return null;
		}

		var flipH = style[mxConstants.STYLE_FLIPH] == '1', flipV = style[mxConstants.STYLE_FLIPV] == '1';
		var segments = [];

		var point = function(node)
		{
			var x = Number(node.getAttribute('x')) / w0, y = Number(node.getAttribute('y')) / h0;

			return (isFinite(x) && isFinite(y)) ? [(flipH) ? 1 - x : x, (flipV) ? 1 - y : y] : null;
		};

		var add = function(p, q)
		{
			if (p != null && q != null)
			{
				segments.push([p[0], p[1], q[0], q[1]]);
			}
		};

		for (var part = root.firstChild; part != null; part = part.nextSibling)
		{
			if (part.nodeType == mxConstants.NODETYPE_ELEMENT &&
				(part.nodeName == 'foreground' || part.nodeName == 'background'))
			{
				for (var node = part.firstChild; node != null; node = node.nextSibling)
				{
					if (node.nodeType != mxConstants.NODETYPE_ELEMENT)
					{
						continue;
					}
					else if (node.nodeName == 'path')
					{
						var start = null, last = null;

						for (var op = node.firstChild; op != null; op = op.nextSibling)
						{
							if (op.nodeType != mxConstants.NODETYPE_ELEMENT)
							{
								continue;
							}
							else if (op.nodeName == 'move' || op.nodeName == 'line')
							{
								var p = point(op);

								if (p == null)
								{
									return null;
								}

								if (op.nodeName == 'line')
								{
									add(last, p);
								}
								else
								{
									start = p;
								}

								last = p;
							}
							else if (op.nodeName == 'close')
							{
								add(last, start);
								last = start;
							}
							else
							{
								return null;
							}
						}
					}
					else if (mxUtils.indexOf(Tidy.drawingShapes, node.nodeName) >= 0)
					{
						return null;
					}
				}
			}
		}

		return {segments: segments, rotation: Number(style[mxConstants.STYLE_ROTATION] || 0) || 0};
	}
	catch (e)
	{
		return null;
	}
};

/**
 * Returns true if a line of the given drawing {cell, x, y, w, h} (see
 * getDrawingLines) meets the given box {x, y, w, h}, or if its lines are
 * unknown: a shape in the box of a drawing overlaps it only where a line of
 * the drawing meets the shape (a scribble over shapes), not inside a loop or
 * a bracket around shapes. The optional cache keeps the lines by ID (see
 * getContainerKind).
 */
Tidy.drawingHitsBox = function(graph, drawing, box, cache)
{
	var entry = (cache != null) ? cache[drawing.cell.id] : null;
	var lines = (entry != null) ? entry.lines : undefined;

	if (lines === undefined)
	{
		lines = Tidy.getDrawingLines(graph, drawing.cell);

		if (entry != null)
		{
			entry.lines = lines;
		}
	}

	if (lines == null)
	{
		return true;
	}

	var rad = mxUtils.toRadians(lines.rotation);
	var cos = Math.cos(rad), sin = Math.sin(rad);
	var cx = drawing.x + drawing.w / 2, cy = drawing.y + drawing.h / 2;
	var x0 = box.x, y0 = box.y, x1 = box.x + box.w, y1 = box.y + box.h;

	var point = function(x, y)
	{
		var px = drawing.x + x * drawing.w - cx, py = drawing.y + y * drawing.h - cy;

		return (lines.rotation != 0) ? {x: cx + px * cos - py * sin, y: cy + px * sin + py * cos} :
			{x: cx + px, y: cy + py};
	};

	for (var i = 0; i < lines.segments.length; i++)
	{
		var s = lines.segments[i];
		var p1 = point(s[0], s[1]), p2 = point(s[2], s[3]);

		if (Math.max(p1.x, p2.x) > x0 && Math.min(p1.x, p2.x) < x1 &&
			Math.max(p1.y, p2.y) > y0 && Math.min(p1.y, p2.y) < y1 &&
			Tidy.segmentHitsBox(p1, p2, box.x, box.y, box.w, box.h))
		{
			return true;
		}
	}

	return false;
};

/**
 * Returns true if the given cell is a frame around other shapes on the page:
 * a container, a swimlane, a group, zone or region stencil (cloud groups) or
 * a shape without a fill that is no text.
 */
Tidy.isFrame = function(graph, cell)
{
	var style = graph.getCellStyle(cell);
	var shape = String(style['shape'] || '');

	return style['container'] == '1' || graph.isSwimlane(cell) ||
		/group|zone|region|boundary|frame|container/i.test(shape) ||
		(style[mxConstants.STYLE_FILLCOLOR] == mxConstants.NONE && !Tidy.isText(graph, cell, style));
};

/**
 * Returns true if one of the given boxes {cell, x, y, w or width, h or
 * height} contains the other, which is no overlap: a larger shape that
 * contains all of the other one (eg. a filled zone or panel behind shapes,
 * at least 1.5 times as large, so that shapes of the same size on top of
 * each other still overlap), or a frame (see isFrame) at least twice as large
 * that contains the center of the other one (a shape that crosses the border
 * of its group). A drawing of the brush is lines, not a panel (see isDrawing
 * and drawingHitsBox): a shape in its box overlaps it where a line of the
 * drawing meets the shape, else it stays (a loop around shapes), and a
 * drawing whose lines miss a larger shape does not overlap it. The optional
 * cache keeps the kinds and lines by ID (see getContainerKind).
 */
Tidy.isContainment = function(graph, a, b, cache)
{
	var aw = (a.w != null) ? a.w : a.width, ah = (a.h != null) ? a.h : a.height;
	var bw = (b.w != null) ? b.w : b.width, bh = (b.h != null) ? b.h : b.height;
	var aBig = aw * ah >= bw * bh;
	var big = (aBig) ? {cell: a.cell, x: a.x, y: a.y, w: aw, h: ah} : {cell: b.cell, x: b.x, y: b.y, w: bw, h: bh};
	var small = (aBig) ? {cell: b.cell, x: b.x, y: b.y, w: bw, h: bh} : {cell: a.cell, x: a.x, y: a.y, w: aw, h: ah};
	var cx = small.x + small.w / 2, cy = small.y + small.h / 2;

	// The lines of the brush are no panel behind the shapes in their box
	if (big.cell != null && Tidy.getContainerKind(graph, big.cell, cache) == 'drawing')
	{
		return !Tidy.drawingHitsBox(graph, big, small, cache);
	}

	if (small.cell != null && Tidy.getContainerKind(graph, small.cell, cache) == 'drawing' &&
		!Tidy.drawingHitsBox(graph, small, big, cache))
	{
		return true;
	}

	if (big.w * big.h >= 1.5 * small.w * small.h && small.x >= big.x && small.y >= big.y &&
		small.x + small.w <= big.x + big.w && small.y + small.h <= big.y + big.h)
	{
		return true;
	}

	if (big.cell == null || big.w * big.h < 2 * small.w * small.h || cx <= big.x ||
		cx >= big.x + big.w || cy <= big.y || cy >= big.y + big.h)
	{
		return false;
	}

	return Tidy.getContainerKind(graph, big.cell, cache) == 'frame';
};

/**
 * Returns true if the given box {x, y, w, h} contains the state of the
 * given terminal: a shape behind both ends of a connector is no obstacle
 * for it (like the enclosing obstacles of libavoid, filterEnclosing).
 */
Tidy.enclosesTerminal = function(graph, b, terminal)
{
	var st = (terminal != null) ? graph.view.getState(terminal) : null;

	return st != null && st.x >= b.x && st.y >= b.y && st.x + st.width <= b.x + b.w &&
		st.y + st.height <= b.y + b.h;
};

/**
 * Returns the metrics of the given collection from the states of the view
 * (model units as the graph is at scale 1 when it is offscreen, divided by
 * the scale otherwise).
 */
Tidy.measure = function(graph, col)
{
	var view = graph.view;
	var model = graph.model;
	var s = view.scale;
	var m = {vertices: col.vertices.length + col.texts.length, edges: col.allEdges.length,
		overlaps: 0, crossings: 0, edgeThroughShape: 0, bends: 0, tangled: 0,
		edgeLength: 0, labelNoBackground: 0, labelOverEdge: 0, iconLabelPositions: 0,
		width: 0, height: 0, aspect: 1};
	var boxes = new Tidy.Grid(100 * s);
	var leaves = [];
	var mark = {};
	var frames = Object.create(null);

	for (var i = 0; i < col.leaves.length; i++)
	{
		var st = view.getState(col.leaves[i]);

		if (st != null && st.width > 0 && st.height > 0)
		{
			var item = {cell: st.cell, x: st.x, y: st.y, w: st.width, h: st.height};
			leaves.push(item);
			boxes.add(item, st.x, st.y, st.x + st.width, st.y + st.height);
		}
	}

	// Shapes outside the selection are obstacles: overlaps with them and
	// connectors through them count, overlaps among them do not (index -1)
	for (var i = 0; i < col.outside.length; i++)
	{
		var st = view.getState(col.outside[i]);

		if (st != null && st.width > 0 && st.height > 0)
		{
			boxes.add({cell: st.cell, x: st.x, y: st.y, w: st.width, h: st.height, index: -1},
				st.x, st.y, st.x + st.width, st.y + st.height);
		}
	}

	// Overlapping shapes (2px tolerance)
	var tol = 2 * s;

	for (var i = 0; i < leaves.length; i++)
	{
		var a = leaves[i];
		a.index = i;
		var q = {};

		boxes.query(a.x, a.y, a.x + a.w, a.y + a.h, function(b)
		{
			if (b.index != null && b.index < i && a.x + tol < b.x + b.w &&
				b.x + tol < a.x + a.w && a.y + tol < b.y + b.h && b.y + tol < a.y + a.h &&
				!Tidy.isContainment(graph, a, b, frames))
			{
				m.overlaps++;
			}
		}, q);
	}

	// Routes of the edges
	var routes = [];
	var segments = new Tidy.Grid(100 * s);

	for (var i = 0; i < col.allEdges.length; i++)
	{
		var e = col.allEdges[i];
		var st = view.getState(e);

		if (st == null || st.absolutePoints == null || st.absolutePoints.length < 2)
		{
			continue;
		}

		var pts = [];

		for (var j = 0; j < st.absolutePoints.length; j++)
		{
			if (st.absolutePoints[j] != null)
			{
				pts.push(st.absolutePoints[j]);
			}
		}

		if (pts.length < 2)
		{
			continue;
		}

		var len = 0;

		for (var j = 1; j < pts.length; j++)
		{
			len += Math.sqrt((pts[j].x - pts[j - 1].x) * (pts[j].x - pts[j - 1].x) +
				(pts[j].y - pts[j - 1].y) * (pts[j].y - pts[j - 1].y));
		}

		var dx = pts[pts.length - 1].x - pts[0].x, dy = pts[pts.length - 1].y - pts[0].y;
		var direct = Math.sqrt(dx * dx + dy * dy);
		m.edgeLength += len / s;
		m.bends += Math.max(0, pts.length - 2);

		if (pts.length > 5 || len > 2.5 * direct + 40 * s)
		{
			m.tangled++;
		}

		var route = {edge: e, pts: pts, state: st,
			src: model.getTerminal(e, true), trg: model.getTerminal(e, false)};
		routes.push(route);

		for (var j = 1; j < pts.length; j++)
		{
			segments.add({route: route, p0: pts[j - 1], p1: pts[j]},
				pts[j - 1].x, pts[j - 1].y, pts[j].x, pts[j].y);
		}
	}

	// Crossings of edges without a shared terminal (like line jumps), up to
	// maxCrossingChecks pairs of segments, after which counting stops
	var count = 0;

	for (var i = 0; i < routes.length && count <= Tidy.maxCrossingChecks; i++)
	{
		var ra = routes[i];
		ra.index = i;

		for (var j = 1; j < ra.pts.length && count <= Tidy.maxCrossingChecks; j++)
		{
			var p0 = ra.pts[j - 1], p1 = ra.pts[j];

			segments.query(p0.x, p0.y, p1.x, p1.y, function(seg)
			{
				var rb = seg.route;

				if (++count <= Tidy.maxCrossingChecks && rb.index != null && rb.index < i &&
					rb.src != ra.src && rb.src != ra.trg && rb.trg != ra.src && rb.trg != ra.trg &&
					Tidy.segmentsCross(p0, p1, seg.p0, seg.p1))
				{
					m.crossings++;
				}
			}, {});
		}
	}

	// Edges through shapes that are not their terminals or their ancestors
	var inset = 3 * s;
	boxes.checks = 0;
	segments.checks = 0;

	for (var i = 0; i < routes.length; i++)
	{
		var r = routes[i];
		var through = false;

		// A new mark per segment: a shape next to one segment can be crossed
		// by the next one
		for (var j = 1; j < r.pts.length && !through; j++)
		{
			var p0 = r.pts[j - 1], p1 = r.pts[j];

			boxes.query(p0.x, p0.y, p1.x, p1.y, function(b)
			{
				through = b.cell != r.src && b.cell != r.trg &&
					!model.isAncestor(b.cell, r.src) && !model.isAncestor(b.cell, r.trg) &&
					Tidy.segmentHitsBox(p0, p1, b.x + inset, b.y + inset,
						b.w - 2 * inset, b.h - 2 * inset) &&
					!Tidy.enclosesTerminal(graph, b, r.src) && !Tidy.enclosesTerminal(graph, b, r.trg);

				return through;
			}, {});
		}

		if (through)
		{
			m.edgeThroughShape++;
		}

		// Labels without a background and labels over other edges
		var labels = [r.state];

		for (var j = 0; j < model.getChildCount(r.edge); j++)
		{
			var child = view.getState(model.getChildAt(r.edge, j));

			if (child != null && graph.isEdgeLabelCell(child.cell))
			{
				labels.push(child);
			}
		}

		for (var k = 0; k < labels.length; k++)
		{
			var ls = labels[k];
			var text = graph.convertValueToString(ls.cell);

			if (text == null || String(text).length == 0 || ls.text == null)
			{
				continue;
			}

			if (Tidy.isMissingLabelBackground(ls.style))
			{
				m.labelNoBackground++;
			}

			var bb = ls.text.boundingBox;

			if (bb != null)
			{
				var over = false;

				segments.query(bb.x, bb.y, bb.x + bb.width, bb.y + bb.height, function(seg)
				{
					over = seg.route != r && Tidy.segmentHitsBox(seg.p0, seg.p1,
						bb.x, bb.y, bb.width, bb.height);

					return over;
				}, {});

				if (over)
				{
					m.labelOverEdge++;
				}
			}
		}
	}

	// Label positions of icons
	var positions = Object.create(null);

	for (var i = 0; i < col.icons.length; i++)
	{
		var label = graph.convertValueToString(col.icons[i]);

		if (label != null && String(label).length > 0)
		{
			var style = graph.getCellStyle(col.icons[i]);
			positions[(style['labelPosition'] || 'center') + '/' +
				(style['verticalLabelPosition'] || 'middle')] = true;
		}
	}

	m.iconLabelPositions = Object.keys(positions).length;

	var bounds = null;

	for (var i = 0; i < leaves.length; i++)
	{
		var rect = new mxRectangle(leaves[i].x, leaves[i].y, leaves[i].w, leaves[i].h);

		if (bounds == null)
		{
			bounds = rect;
		}
		else
		{
			bounds.add(rect);
		}
	}

	for (var i = 0; i < col.containers.length; i++)
	{
		var st = view.getState(col.containers[i]);

		if (st != null)
		{
			if (bounds == null)
			{
				bounds = new mxRectangle(st.x, st.y, st.width, st.height);
			}
			else
			{
				bounds.add(st);
			}
		}
	}

	if (bounds != null)
	{
		m.width = Math.round(bounds.width / s);
		m.height = Math.round(bounds.height / s);
		m.aspect = Math.round(m.width / Math.max(1, m.height) * 100) / 100;
	}

	m.edgeLength = Math.round(m.edgeLength);

	return m;
};

/**
 * Returns true if the given resolved style of a label has no background and
 * no label gap.
 */
Tidy.isMissingLabelBackground = function(style)
{
	var bg = style[mxConstants.STYLE_LABEL_BACKGROUNDCOLOR];

	return (bg == null || bg == mxConstants.NONE) &&
		style['defaultLabelBackgroundColor'] != 'page';
};

/**
 * Returns the centers of the movable shapes of the collection.
 */
Tidy.getCenters = function(graph, col)
{
	var result = Object.create(null);
	var cells = col.vertices.concat(col.texts);

	for (var i = 0; i < cells.length; i++)
	{
		var st = graph.view.getState(cells[i]);

		if (st != null)
		{
			result[cells[i].id] = {x: st.getCenterX(), y: st.getCenterY()};
		}
	}

	return result;
};

/**
 * Share of the pairs of shapes whose left/right and above/below order is
 * the same in both arrangements (1 = all), on at most 400 shapes.
 */
Tidy.getOrderKept = function(before, after)
{
	var ids = Object.keys(before);
	var step = Math.max(1, Math.ceil(ids.length / 400));
	var same = 0, total = 0;

	for (var i = 0; i < ids.length; i += step)
	{
		for (var j = i + step; j < ids.length; j += step)
		{
			var a0 = before[ids[i]], b0 = before[ids[j]];
			var a1 = after[ids[i]], b1 = after[ids[j]];

			if (a1 != null && b1 != null)
			{
				total += 2;

				var sx0 = Math.abs(a0.x - b0.x) < 1 ? 0 : Math.sign(a0.x - b0.x);
				var sx1 = Math.abs(a1.x - b1.x) < 1 ? 0 : Math.sign(a1.x - b1.x);
				var sy0 = Math.abs(a0.y - b0.y) < 1 ? 0 : Math.sign(a0.y - b0.y);
				var sy1 = Math.abs(a1.y - b1.y) < 1 ? 0 : Math.sign(a1.y - b1.y);

				// Aligning shapes keeps their order
				if (sx0 == sx1 || sx1 == 0)
				{
					same++;
				}

				if (sy0 == sy1 || sy1 == 0)
				{
					same++;
				}
			}
		}
	}

	return (total > 0) ? same / total : 1;
};

/**
 * Returns the score of the given metrics (lower is better).
 */
Tidy.score = function(m, orderKept)
{
	var w = Tidy.weights;
	var aspect = Math.abs(Math.log(Math.max(0.05, m.aspect) / 1.5));
	var area = m.width * m.height / Math.max(1, m.vertices) / 10000;

	var s = w.overlaps * m.overlaps + w.crossings * m.crossings +
		w.edgeThroughShape * m.edgeThroughShape + w.tangled * m.tangled +
		w.bends * m.bends + w.aspect * aspect + w.area * area +
		w.edgeLength * m.edgeLength / Math.max(1, m.edges) +
		w.orderKept * (1 - orderKept) + w.labelOverEdge * m.labelOverEdge;

	return Math.round(s * 10) / 10;
};

/**
 * Returns the analysis and the plan for the given graph and collection:
 * {kind, sure, structure, prediction, metrics, candidates, routing,
 * attachTexts, iconLabels}. Options: direction (auto, down, right),
 * spacing (compact, normal, airy), keep (only the current arrangement).
 */
Tidy.plan = function(graph, col, options)
{
	options = options || {};
	var structure = Tidy.getStructure(graph, col);
	var cls = Tidy.classify(graph, col, structure);
	var prediction = Tidy.predict(graph, col);
	var kind = cls.kind;

	// The forest decides where the rules are unsure
	if (!cls.sure && prediction != null && prediction.kind.length > 0)
	{
		var predicted = Tidy.forestKinds[prediction.kind[0].name];

		if (predicted == 'tree' && !structure.tree)
		{
			predicted = null;
		}

		if (predicted != null && (predicted != 'flowchart' || structure.edges > 0))
		{
			kind = predicted;
		}
	}

	var ids = [];

	switch (kind)
	{
		case 'mindmap':
			ids = ['mindmap', 'balloon', 'treeRight'];
			break;
		case 'tree':
			ids = ['treeDown', 'treeRight', 'balloon'];
			break;
		case 'flowchart':
		case 'graph':
			ids = ['keep', 'flowDown', 'flowRight'];
			break;
		case 'cloud':
		case 'network':
			ids = ['keep', 'flowRight'];
			break;
		case 'freeform':
			ids = ['keep', 'organic'];
			break;
		default:
			ids = ['keep'];
	}

	// The model proposes, the metrics decide
	if (prediction != null && kind != 'sequence' && kind != 'er' && kind != 'swimlanes')
	{
		for (var i = 0; i < prediction.layout.length && i < 3; i++)
		{
			var id = Tidy.forestLayouts[prediction.layout[i].name];

			if (id != null && mxUtils.indexOf(ids, id) < 0 &&
				(id != 'mindmap' || kind == 'mindmap'))
			{
				ids.push(id);
			}
		}
	}

	// Global layouts only move free shapes that are connected, never the
	// contents of containers, and need something to lay out
	var layoutable = Tidy.getLayoutVertices(graph, col);
	var canLayout = col.containers.length == 0 && layoutable.length >= 3 &&
		layoutable.length <= Tidy.maxLayoutVertices && structure.edges > 0 &&
		kind != 'sequence' && kind != 'er' && kind != 'swimlanes';
	var treeLayouts = structure.tree && col.fixed.length == 0 && !col.scoped;
	var result = [];

	for (var i = 0; i < ids.length; i++)
	{
		var cand = Tidy.candidates[ids[i]];

		if (cand == null || mxUtils.indexOf(result, ids[i]) >= 0)
		{
			continue;
		}

		if (ids[i] != 'keep')
		{
			if (!canLayout || options.keep || Tidy.isLayoutTooLarge(ids[i],
				layoutable.length + structure.edges) || (cand.layout != null && cand.preset == null &&
				!treeLayouts && ids[i] != 'organic') ||
				(options.direction == 'down' && cand.direction == 'right') ||
				(options.direction == 'right' && cand.direction == 'down'))
			{
				continue;
			}
		}

		result.push(ids[i]);
	}

	// Fixed directions add their layouts for flows and trees
	if (canLayout && !options.keep && (options.direction == 'down' || options.direction == 'right'))
	{
		var extra = (structure.tree) ? ((options.direction == 'down') ? 'treeDown' : 'treeRight') :
			((options.direction == 'down') ? 'flowDown' : 'flowRight');

		if (mxUtils.indexOf(result, extra) < 0 && !Tidy.isLayoutTooLarge(extra,
			layoutable.length + structure.edges))
		{
			result.push(extra);
		}
	}

	if (result.length == 0 || options.keep || kind == 'sequence')
	{
		result = (kind == 'sequence') ? [] : ['keep'];
	}

	return {kind: kind, sure: cls.sure, structure: structure, prediction: prediction,
		candidates: result, layoutable: layoutable,
		routing: kind != 'sequence' && kind != 'er' && kind != 'mindmap',
		attachTexts: col.texts.length > 0 && col.edges.length > 0 && kind != 'sequence',
		iconLabels: (kind == 'cloud' || kind == 'network')};
};

/**
 * Returns the IDs of the connectors of the given collection (allEdges) as
 * keys of an object without a prototype.
 */
Tidy.getEdgeSet = function(col)
{
	var result = Object.create(null);

	for (var i = 0; i < col.allEdges.length; i++)
	{
		result[col.allEdges[i].id] = true;
	}

	return result;
};

/**
 * Returns the shapes a layout moves: the movable shapes of the collection
 * with a connector that may change, and the movable shapes that hang by
 * connectors that may not change (locked, tidy=0) on such shapes, also over
 * a chain of them, so the layouts keep these links (see runLayout).
 * Unconnected shapes (titles, notes) and shapes that hang only on fixed
 * shapes or on shapes outside the selection keep their place.
 */
Tidy.getLayoutVertices = function(graph, col)
{
	var model = graph.model;
	var edgeSet = Tidy.getEdgeSet(col);
	var movable = Object.create(null);
	var set = Object.create(null);
	var queue = [];

	for (var i = 0; i < col.vertices.length; i++)
	{
		var vertex = col.vertices[i];

		if (!col.nested[vertex.id])
		{
			movable[vertex.id] = true;
			var edges = model.getEdges(vertex);

			for (var j = 0; j < edges.length; j++)
			{
				if (col.editable[edges[j].id])
				{
					set[vertex.id] = true;
					queue.push(vertex);
					break;
				}
			}
		}
	}

	for (var i = 0; i < queue.length; i++)
	{
		var edges = model.getEdges(queue[i]);

		for (var j = 0; j < edges.length; j++)
		{
			if (edgeSet[edges[j].id] === true && !col.editable[edges[j].id])
			{
				var src = model.getTerminal(edges[j], true);
				var other = (src == queue[i]) ? model.getTerminal(edges[j], false) : src;

				if (other != null && movable[other.id] === true && set[other.id] !== true)
				{
					set[other.id] = true;
					queue.push(other);
				}
			}
		}
	}

	var result = [];

	for (var i = 0; i < col.vertices.length; i++)
	{
		if (set[col.vertices[i].id] === true)
		{
			result.push(col.vertices[i]);
		}
	}

	return result;
};

/**
 * Operations on the graph of a trial. They run inside one model update.
 */
Tidy.ops = {};

/**
 * Free texts near a connector become labels of the connector: relative
 * children of the edge at their position along it, so that layouts and
 * routes move them with the line. ID, value and style are kept. The
 * segments are in a grid, so each text only visits the segments near it.
 */
Tidy.ops.attachTexts = function(graph, col)
{
	var model = graph.model;
	var view = graph.view;
	var s = view.scale;
	var max = Tidy.maxAttachedTextDistance * s;
	var segments = new Tidy.Grid(100 * s);
	var count = 0, n = 0;

	for (var j = 0; j < col.edges.length; j++)
	{
		var es = view.getState(col.edges[j]);

		if (es != null && es.absolutePoints != null)
		{
			var parent = model.getParent(col.edges[j]);

			for (var k = 1; k < es.absolutePoints.length; k++)
			{
				var p0 = es.absolutePoints[k - 1], p1 = es.absolutePoints[k];

				if (p0 != null && p1 != null)
				{
					// The order breaks ties like a loop over the edges and their segments
					segments.add({state: es, parent: parent, p0: p0, p1: p1, order: n++},
						p0.x, p0.y, p1.x, p1.y);
				}
			}
		}
	}

	for (var i = 0; i < col.texts.length; i++)
	{
		var text = col.texts[i];
		var label = graph.convertValueToString(text);
		var ts = view.getState(text);

		if (ts == null || label == null || Tidy.stripTags(String(label), '').length >
			Tidy.maxAttachedTextLength)
		{
			continue;
		}

		var cx = ts.getCenterX(), cy = ts.getCenterY();
		var textParent = model.getParent(text);
		var best = null, dist = Infinity, order = Infinity;

		var cut = segments.query(cx - max, cy - max, cx + max, cy + max, function(seg)
		{
			// Same parent, so the label stays in its frame
			if (seg.parent == textParent)
			{
				var d = Math.sqrt(mxUtils.ptSegDistSq(seg.p0.x, seg.p0.y,
					seg.p1.x, seg.p1.y, cx, cy));

				if (d < dist || (d == dist && seg.order < order))
				{
					dist = d;
					order = seg.order;
					best = seg.state;
				}
			}
		}, {});

		// A query that the limit ended may have missed the nearest connector
		if (!cut && best != null && dist <= max)
		{
			var rp = view.getRelativePoint(best, cx, cy);
			var geo = new mxGeometry(Math.max(-0.9, Math.min(0.9, rp.x)), 0, 0, 0);
			geo.relative = true;
			geo.offset = new mxPoint(0, 0);
			model.add(best.cell, text);
			model.setGeometry(text, geo);
			col.movable[text.id] = false;
			count++;
		}
	}

	if (count > 0)
	{
		// Attached texts are no longer free texts
		var texts = [];

		for (var i = 0; i < col.texts.length; i++)
		{
			if (!model.isEdge(model.getParent(col.texts[i])))
			{
				texts.push(col.texts[i]);
			}
		}

		col.texts = texts;
	}

	return count;
};

/**
 * Removes the waypoints of the editable connectors (not of self-loops) and
 * their fixed connection points unless keepPoints is true (entity relations
 * end at the sides of their rows), so the routing starts from scratch.
 */
Tidy.ops.resetEdges = function(graph, col, keepPoints)
{
	var model = graph.model;
	var keys = (keepPoints) ? [] : ['exitX', 'exitY', 'exitDx', 'exitDy', 'exitPerimeter',
		'entryX', 'entryY', 'entryDx', 'entryDy', 'entryPerimeter'];
	var reset = [];
	var count = 0;

	for (var i = 0; i < col.edges.length; i++)
	{
		var edge = col.edges[i];
		var src = model.getTerminal(edge, true), trg = model.getTerminal(edge, false);

		if (src != null && src == trg)
		{
			continue;
		}

		var geo = model.getGeometry(edge);

		if (geo != null && geo.points != null && geo.points.length > 0)
		{
			geo = geo.clone();
			geo.points = null;
			model.setGeometry(edge, geo);
			count++;
		}

		var style = model.getStyle(edge) || '';

		for (var k = 0; k < keys.length; k++)
		{
			if (style.indexOf(keys[k] + '=') >= 0)
			{
				reset.push(edge);
				break;
			}
		}
	}

	for (var k = 0; k < keys.length && reset.length > 0; k++)
	{
		graph.setCellStyles(keys[k], null, reset);
	}

	return count + reset.length;
};

/**
 * Moves the labels of the editable connectors to the middle and their label
 * cells back onto the line (see the resetLabelPositions action).
 */
Tidy.ops.resetLabels = function(graph, col)
{
	var model = graph.model;
	var count = 0;

	var reset = function(cell, center)
	{
		var geo = model.getGeometry(cell);

		if (geo != null && (center || geo.relative) && ((center && geo.x != 0) ||
			geo.y != 0 || (geo.offset != null && (geo.offset.x != 0 || geo.offset.y != 0))))
		{
			geo = geo.clone();
			geo.x = (center) ? 0 : geo.x;
			geo.y = 0;
			geo.offset = null;
			model.setGeometry(cell, geo);
			count++;
		}
	};

	for (var i = 0; i < col.edges.length; i++)
	{
		var label = graph.convertValueToString(col.edges[i]);

		if (label != null && String(label).length > 0)
		{
			reset(col.edges[i], true);
		}

		for (var j = 0; j < model.getChildCount(col.edges[i]); j++)
		{
			var child = model.getChildAt(col.edges[i], j);

			if (graph.isEdgeLabelCell(child) && graph.isCellEditable(child) &&
				!Tidy.isOptOut(graph.getCellStyle(child)))
			{
				reset(child, false);
			}
		}
	}

	return count;
};

/**
 * Gives labels of connectors without a background the label gap, which
 * cuts the label out of the line in every theme.
 */
Tidy.ops.labelGaps = function(graph, col)
{
	var model = graph.model;
	var cells = [];

	var check = function(cell)
	{
		var label = graph.convertValueToString(cell);

		if (label != null && String(label).length > 0 &&
			Tidy.isMissingLabelBackground(graph.getCellStyle(cell)))
		{
			cells.push(cell);
		}
	};

	for (var i = 0; i < col.edges.length; i++)
	{
		check(col.edges[i]);

		for (var j = 0; j < model.getChildCount(col.edges[i]); j++)
		{
			var child = model.getChildAt(col.edges[i], j);

			if (graph.isEdgeLabelCell(child) && graph.isCellEditable(child) &&
				!Tidy.isOptOut(graph.getCellStyle(child)))
			{
				check(child);
			}
		}
	}

	if (cells.length > 0)
	{
		graph.setCellStyles(mxConstants.STYLE_LABEL_BACKGROUNDCOLOR, 'default', cells);
		graph.setCellStyles('defaultLabelBackgroundColor', 'page', cells);
	}

	return cells.length;
};

/**
 * Puts the labels of icons below the icons if they are not all in one
 * place.
 */
Tidy.ops.iconLabels = function(graph, col)
{
	var cells = [];

	for (var i = 0; i < col.icons.length; i++)
	{
		var icon = col.icons[i];
		var label = graph.convertValueToString(icon);
		var style = graph.getCellStyle(icon);

		if (col.movable[icon.id] && label != null && String(label).length > 0 &&
			(style['verticalLabelPosition'] != 'bottom' ||
			(style['labelPosition'] || 'center') != 'center'))
		{
			cells.push(icon);
		}
	}

	if (cells.length > 0)
	{
		graph.setCellStyles('labelPosition', 'center', cells);
		graph.setCellStyles('verticalLabelPosition', 'bottom', cells);
		graph.setCellStyles('align', 'center', cells);
		graph.setCellStyles('verticalAlign', 'top', cells);
	}

	return cells.length;
};

/**
 * Aligns the centers of free shapes that are a few units apart (siblings
 * only) and snaps the result to the grid. A cluster spans at most
 * alignTolerance, so that a chain of small steps does not pull shapes that
 * are far apart into one row or column.
 */
Tidy.ops.align = function(graph, col)
{
	var model = graph.model;
	var cells = col.vertices.slice();
	var tol = Tidy.alignTolerance;
	var count = 0;

	var axes = [['x', 'width'], ['y', 'height']];

	for (var a = 0; a < axes.length; a++)
	{
		var axis = axes[a][0], size = axes[a][1];

		cells.sort(function(c1, c2)
		{
			var g1 = model.getGeometry(c1), g2 = model.getGeometry(c2);

			return (g1[axis] + g1[size] / 2) - (g2[axis] + g2[size] / 2);
		});

		var cluster = [];

		var flush = function()
		{
			if (cluster.length > 1)
			{
				var centers = [];

				for (var i = 0; i < cluster.length; i++)
				{
					var geo = model.getGeometry(cluster[i]);
					centers.push(geo[axis] + geo[size] / 2);
				}

				centers.sort(function(x, y) { return x - y; });
				var target = centers[Math.floor(centers.length / 2)];

				for (var i = 0; i < cluster.length; i++)
				{
					var geo = model.getGeometry(cluster[i]);
					var value = Math.round(target - geo[size] / 2);

					if (Math.abs(geo[axis] - value) >= 0.5)
					{
						geo = geo.clone();
						geo[axis] = value;
						model.setGeometry(cluster[i], geo);
						count++;
					}
				}
			}

			cluster = [];
		};

		for (var i = 0; i < cells.length; i++)
		{
			var geo = model.getGeometry(cells[i]);
			var center = geo[axis] + geo[size] / 2;

			if (cluster.length > 0)
			{
				var first = model.getGeometry(cluster[0]);

				if (center - (first[axis] + first[size] / 2) > tol ||
					model.getParent(cells[i]) != model.getParent(cluster[0]))
				{
					flush();
				}
			}

			cluster.push(cells[i]);
		}

		flush();
	}

	return count;
};

/**
 * Moves free shapes, texts and containers on the page out of the shapes they
 * overlap: in reading order (top to bottom, left to right) each one moves
 * right or down, whichever is shorter, past the shapes that are already in
 * place, so the result does not depend on chance and the order of the shapes
 * is kept. Labels below shapes count as part of the shape, and shapes on a
 * larger shape or in a frame (see isContainment) stay there. Fixed shapes
 * and the shapes outside the selection never move, shapes in containers stay
 * inside.
 */
Tidy.ops.removeOverlaps = function(graph, col, gap)
{
	var model = graph.model;
	gap = (gap != null) ? gap : 20;
	var movable = col.vertices.concat(col.texts).concat(col.units);
	var placed = new Tidy.Grid(100);
	var frames = Object.create(null);
	var isMovable = Object.create(null);
	var count = 0;

	for (var i = 0; i < movable.length; i++)
	{
		isMovable[movable[i].id] = true;
	}

	// Labels below shapes (icons) are part of the box. Their size is the
	// painted size, which does not depend on the place of the shape.
	var labels = Object.create(null);
	var obstacles = col.fixed.concat(col.outside).concat(col.outsideContainers);
	var cells = movable.concat(obstacles);

	for (var i = 0; i < cells.length; i++)
	{
		var state = graph.view.getState(cells[i]);

		if (state != null && state.text != null && state.text.boundingBox != null &&
			state.style['verticalLabelPosition'] == 'bottom')
		{
			var s = graph.view.scale;
			labels[cells[i].id] = {w: state.text.boundingBox.width / s,
				h: state.text.boundingBox.height / s};
		}
	}

	var getBox = function(cell, geo)
	{
		var label = labels[cell.id];

		if (label == null)
		{
			return {cell: cell, x: geo.x, y: geo.y, width: geo.width, height: geo.height};
		}

		var w = Math.max(geo.width, label.w);

		return {cell: cell, x: geo.x + (geo.width - w) / 2, y: geo.y, width: w,
			height: geo.height + label.h + 2};
	};

	var add = function(cell)
	{
		var geo = model.getGeometry(cell);

		if (geo != null)
		{
			var box = getBox(cell, geo);
			placed.add({cell: cell}, box.x, box.y, box.x + box.width, box.y + box.height);
		}
	};

	for (var i = 0; i < obstacles.length; i++)
	{
		if (!isMovable[obstacles[i].id] && model.getParent(obstacles[i]) != null)
		{
			add(obstacles[i]);
		}
	}

	var order = [];

	for (var i = 0; i < movable.length; i++)
	{
		if (model.getParent(movable[i]) != null && !model.isEdge(model.getParent(movable[i])))
		{
			order.push(movable[i]);
		}
	}

	order.sort(function(c1, c2)
	{
		var g1 = model.getGeometry(c1), g2 = model.getGeometry(c2);

		return (Math.abs(g1.y - g2.y) > 1) ? g1.y - g2.y : g1.x - g2.x;
	});

	for (var i = 0; i < order.length; i++)
	{
		var cell = order[i];
		var parent = model.getParent(cell);
		var pg = (col.nested[cell.id]) ? model.getGeometry(parent) : null;
		var geo = model.getGeometry(cell);
		var start = geo;

		// Up to 50 moves, and the place after the last move is checked too
		for (var k = 0; k <= 50; k++)
		{
			var hit = null;
			var box = getBox(cell, geo);

			var limited = placed.query(box.x, box.y, box.x + box.width, box.y + box.height, function(b)
			{
				if (b.cell != cell && model.getParent(b.cell) == parent)
				{
					var gb = getBox(b.cell, model.getGeometry(b.cell));

					if (box.x < gb.x + gb.width && gb.x < box.x + box.width &&
						box.y < gb.y + gb.height && gb.y < box.y + box.height &&
						!Tidy.isContainment(graph, box, gb, frames))
					{
						hit = gb;
					}
				}

				return hit != null;
			}, {});

			// A place the limit of the index did not check is unknown, so the
			// shape stays where it was (see Tidy.maxGridChecks)
			if (limited)
			{
				geo = start;
				break;
			}
			else if (hit == null)
			{
				break;
			}
			else if (k == 50)
			{
				// No free place after 50 moves: the shape stays where it was
				geo = start;
				break;
			}

			var dx = hit.x + hit.width + gap - box.x;
			var dy = hit.y + hit.height + gap - box.y;
			var next = null;

			// Shapes in containers stay inside: the other way if needed
			var fits = function(g)
			{
				return pg == null || (g.x + g.width <= pg.width && g.y + g.height <= pg.height);
			};

			// Plain boxes, as this runs up to 50 times per shape
			var right = {x: Math.round(geo.x + dx), y: geo.y, width: geo.width, height: geo.height};
			var down = {x: geo.x, y: Math.round(geo.y + dy), width: geo.width, height: geo.height};

			if (dx <= dy)
			{
				next = (fits(right) || !fits(down)) ? right : down;
			}
			else
			{
				next = (fits(down) || !fits(right)) ? down : right;
			}

			if (!fits(next))
			{
				geo = start;
				break;
			}

			geo = next;
		}

		if (geo !== start)
		{
			var moved = start.clone();
			moved.x = geo.x;
			moved.y = geo.y;
			model.setGeometry(cell, moved);
			count++;
		}

		add(cell);
	}

	return count;
};

/**
 * Returns true if libavoid is loaded (see route).
 */
Tidy.isRoutingAvailable = function()
{
	return typeof LibavoidRouting !== 'undefined' && typeof window !== 'undefined' &&
		window.Avoid != null;
};

/**
 * Returns the editable connectors of the collection that route can route:
 * not entity relations, curves, self-loops or arrow shapes, which keep their
 * style, and like LibavoidRouting.createRouteEdges only connectors with a
 * shape at one end at least and a free point at an end without a shape
 * (not free-standing lines or ends on other connectors).
 */
Tidy.getRoutableEdges = function(graph, col)
{
	var model = graph.model;
	var edges = [];

	var isEnd = function(edge, terminal, source)
	{
		var geo = model.getGeometry(edge);

		return (terminal != null && model.isVertex(terminal)) ||
			(terminal == null && geo != null && geo.getTerminalPoint(source) != null);
	};

	for (var i = 0; i < col.edges.length; i++)
	{
		var style = graph.getCellStyle(col.edges[i]);
		var src = model.getTerminal(col.edges[i], true);
		var trg = model.getTerminal(col.edges[i], false);

		if (style[mxConstants.STYLE_EDGE] != 'entityRelationEdgeStyle' &&
			style[mxConstants.STYLE_CURVED] != '1' && (src == null || src != trg) &&
			style['shape'] != 'flexArrow' && style['shape'] != 'link' &&
			style['shape'] != 'arrow' && ((src != null && model.isVertex(src)) ||
			(trg != null && model.isVertex(trg))) && isEnd(col.edges[i], src, true) &&
			isEnd(col.edges[i], trg, false))
		{
			edges.push(col.edges[i]);
		}
	}

	return edges;
};

/**
 * Routes the editable connectors around the shapes with libavoid if it is
 * loaded (see getRoutableEdges). Returns the number of routed connectors.
 */
Tidy.ops.route = function(graph, col)
{
	if (!Tidy.isRoutingAvailable())
	{
		return 0;
	}

	var edges = Tidy.getRoutableEdges(graph, col);

	if (edges.length == 0)
	{
		return 0;
	}

	try
	{
		return (LibavoidRouting.routeCells(graph, window.Avoid, edges, null, true)) ? edges.length : 0;
	}
	catch (e)
	{
		return 0;
	}
};

/**
 * Returns the editable connectors of the collection whose route crosses a
 * shape that is not one of their terminals, at most maxRoutedEdges + 1 of
 * them, as nothing is routed above maxRoutedEdges, or null if maxGridChecks
 * ended the search, as nothing is routed from a list that may be incomplete.
 */
Tidy.getEdgesThroughShapes = function(graph, col)
{
	var view = graph.view;
	var model = graph.model;
	var result = [];
	var boxes = new Tidy.Grid(100);
	var shapes = col.leaves.concat(col.outside);

	for (var i = 0; i < shapes.length; i++)
	{
		var st = view.getState(shapes[i]);

		if (st != null)
		{
			boxes.add({cell: st.cell, x: st.x, y: st.y, w: st.width, h: st.height},
				st.x, st.y, st.x + st.width, st.y + st.height);
		}
	}

	for (var i = 0; i < col.edges.length && result.length <= Tidy.maxRoutedEdges; i++)
	{
		var st = view.getState(col.edges[i]);
		var through = false;

		if (st == null || st.absolutePoints == null)
		{
			continue;
		}

		var src = model.getTerminal(st.cell, true), trg = model.getTerminal(st.cell, false);

		for (var j = 1; j < st.absolutePoints.length && !through; j++)
		{
			var p0 = st.absolutePoints[j - 1], p1 = st.absolutePoints[j];

			if (p0 == null || p1 == null)
			{
				continue;
			}

			var cut = boxes.query(p0.x, p0.y, p1.x, p1.y, function(b)
			{
				through = b.cell != src && b.cell != trg && !model.isAncestor(b.cell, src) &&
					!model.isAncestor(b.cell, trg) && Tidy.segmentHitsBox(p0, p1, b.x + 3, b.y + 3,
					b.w - 6, b.h - 6) && !Tidy.enclosesTerminal(graph, b, src) &&
					!Tidy.enclosesTerminal(graph, b, trg);

				return through;
			}, {});

			if (cut)
			{
				return null;
			}
		}

		if (through)
		{
			result.push(st.cell);
		}
	}

	return result;
};

/**
 * Returns the layout spec of the given candidate with the given spacing.
 */
Tidy.getLayoutSpec = function(ui, id, spacing)
{
	var cand = Tidy.candidates[id];
	var sp = Tidy.getSpacing(spacing);

	if (cand == null || id == 'keep')
	{
		return null;
	}
	else if (cand.preset != null)
	{
		var list = ui.resolveLayoutList(cand.preset);

		if (list == null || list.length == 0)
		{
			return null;
		}

		var entry = {layout: list[0].layout, config: {}};
		var config = list[0].config || {};

		for (var key in config)
		{
			if (Object.prototype.hasOwnProperty.call(config, key))
			{
				entry.config[key] = config[key];
			}
		}

		entry.config['elk.spacing.nodeNode'] = sp;
		entry.config.preserveOrigin = true;

		if (!cand.tree)
		{
			entry.config['elk.layered.spacing.nodeNodeBetweenLayers'] = Math.round(sp * 1.25);
		}

		return [entry];
	}
	else if (cand.layout == 'MindmapLayout')
	{
		return [{layout: 'MindmapLayout', config: {levelDistance: sp,
			nodeDistance: Math.round(sp / 4), resetConnectionPoints: true}}];
	}
	else if (cand.layout == 'BalloonTreeLayout')
	{
		return [{layout: 'BalloonTreeLayout', config: {levelDistance: Math.round(sp * 0.75),
			nodeDistance: Math.round(sp / 4), resetConnectionPoints: true}}];
	}
	else if (cand.layout == 'elkStress')
	{
		return [{layout: 'elkStress', config: {'elk.stress.desiredEdgeLength': sp * 2.5,
			preserveOrigin: true}}];
	}

	return null;
};

/**
 * Runs the given layout spec on the given parent of the graph of a trial
 * synchronously. If shapes are given, the layouts only see these shapes and
 * the connectors of the collection between them (not the ones of other
 * layers): ELK through its cell filter, the other layouts (MindmapLayout,
 * BalloonTreeLayout) through isVertexIgnored and isEdgeIgnored. Connectors
 * that may not change (locked, tidy=0, ties) are part of the structure, so
 * a tree is not split at a locked link, and get their geometry and style
 * back after the layouts (with their labels).
 */
Tidy.runLayout = function(graph, spec, parent, vertices, col)
{
	var layouts = graph.createLayouts(spec);
	var filter = null;

	if (vertices != null)
	{
		var edgeSet = Tidy.getEdgeSet(col);
		var set = Object.create(null);

		for (var i = 0; i < vertices.length; i++)
		{
			set[vertices[i].id] = true;
		}

		filter = function(cell)
		{
			if (cell == null)
			{
				return false;
			}
			else if (graph.model.isEdge(cell))
			{
				var src = graph.model.getTerminal(cell, true);
				var trg = graph.model.getTerminal(cell, false);

				return edgeSet[cell.id] === true && src != null && trg != null &&
					set[src.id] === true && set[trg.id] === true;
			}

			return set[cell.id] === true;
		};
	}

	var kept = Tidy.saveCells(graph, Tidy.getFixedEdges(graph, col));

	for (var i = 0; i < layouts.length; i++)
	{
		var layout = layouts[i];

		if (typeof layout.prepare === 'function')
		{
			if (typeof layout.executeSync !== 'function' ||
				(typeof layout.canExecuteSync === 'function' && !layout.canExecuteSync()))
			{
				throw new Error(mxResources.get('serviceUnavailableOrBlocked'));
			}

			if (filter != null)
			{
				layout.cellFilter = filter;
			}

			layout.executeSync(parent);
		}
		else
		{
			if (filter != null)
			{
				Tidy.addLayoutFilter(layout, filter);
			}

			layout.execute(parent);
		}
	}

	Tidy.restoreCells(graph, kept);
};

/**
 * Returns the connectors of the collection that may not change and their
 * labels.
 */
Tidy.getFixedEdges = function(graph, col)
{
	var model = graph.model;
	var result = [];

	for (var i = 0; i < col.allEdges.length; i++)
	{
		var edge = col.allEdges[i];

		if (col.editable[edge.id] !== true)
		{
			result.push(edge);

			for (var j = 0; j < model.getChildCount(edge); j++)
			{
				result.push(model.getChildAt(edge, j));
			}
		}
	}

	return result;
};

/**
 * Returns the geometries and styles of the given cells for restoreCells.
 */
Tidy.saveCells = function(graph, cells)
{
	var model = graph.model;
	var result = [];

	for (var i = 0; i < cells.length; i++)
	{
		var geo = model.getGeometry(cells[i]);
		result.push({cell: cells[i], geo: (geo != null) ? geo.clone() : null,
			key: Tidy.Trial.getGeometryKey(geo), style: model.getStyle(cells[i])});
	}

	return result;
};

/**
 * Puts back the geometries and styles of saveCells that changed.
 */
Tidy.restoreCells = function(graph, saved)
{
	var model = graph.model;

	for (var i = 0; i < saved.length; i++)
	{
		var cell = saved[i].cell;

		if (Tidy.Trial.getGeometryKey(model.getGeometry(cell)) != saved[i].key)
		{
			model.setGeometry(cell, (saved[i].geo != null) ? saved[i].geo.clone() : null);
		}

		if (model.getStyle(cell) != saved[i].style)
		{
			model.setStyle(cell, saved[i].style);
		}
	}
};

/**
 * Makes the given layout ignore the cells that the given filter rejects.
 */
Tidy.addLayoutFilter = function(layout, filter)
{
	var isVertexIgnored = layout.isVertexIgnored;
	var isEdgeIgnored = layout.isEdgeIgnored;

	layout.isVertexIgnored = function(vertex)
	{
		return !filter(vertex) || isVertexIgnored.apply(this, arguments);
	};

	layout.isEdgeIgnored = function(edge)
	{
		return !filter(edge) || isEdgeIgnored.apply(this, arguments);
	};
};

/**
 * Creates a trial: an offscreen graph with a copy of the model of the given
 * editor UI, which must be removed with destroy.
 */
Tidy.Trial = function(ui, cells)
{
	var graph = ui.editor.graph;
	this.ui = ui;
	this.source = graph;
	this.graph = ui.createTemporaryGraph(graph.getStylesheet());
	this.graph.gridSize = graph.gridSize;
	this.graph.hiddenTags = graph.hiddenTags;
	this.graph.shapeBackgroundColor = graph.shapeBackgroundColor;
	this.graph.shapeForegroundColor = graph.shapeForegroundColor;
	this.graph.background = graph.background;

	// The colors of dark mode of the page (see getThumbnails)
	this.graph.adaptiveColors = graph.adaptiveColors;
	this.graph.getGlobalVariable = function()
	{
		return graph.getGlobalVariable.apply(graph, arguments);
	};

	Tidy.getTrialContainer().appendChild(this.graph.container);

	// The cells of the editor as the trial starts, so that apply keeps what
	// changes in the editor until then (see getChanges)
	this.sourceBase = Tidy.Trial.snapshotModel(graph.model);
	this.sourceRules = Tidy.getStyleRulesJson(graph);

	// The decoder looks up terminals by ID in the document of the node
	var doc = mxUtils.createXmlDocument();
	var enc = new mxCodec(doc);
	var node = enc.encode(graph.model);
	doc.appendChild(node);
	new mxCodec(doc).decode(node, this.graph.model);

	var parent = graph.getDefaultParent();
	var tmpParent = (parent != null) ? this.graph.model.getCell(parent.id) : null;

	if (tmpParent != null)
	{
		this.graph.setDefaultParent(tmpParent);
	}

	// Same cells as the scope in the editor
	this.cells = null;

	if (cells != null && cells.length > 0)
	{
		this.cells = [];

		for (var i = 0; i < cells.length; i++)
		{
			var cell = this.graph.model.getCell(cells[i].id);

			if (cell != null)
			{
				this.cells.push(cell);
			}
		}
	}

	this.graph.view.validate();
	this.base = this.snapshot();
};

/**
 * Returns the hidden element of the document that holds the graphs of the
 * trials (one child of the body, so trials that run in idle time do not
 * change the children of the body).
 */
Tidy.getTrialContainer = function()
{
	if (Tidy.trialContainer == null || Tidy.trialContainer.parentNode != document.body)
	{
		var div = document.createElement('div');
		div.style.position = 'absolute';
		div.style.left = '0px';
		div.style.top = '0px';
		div.style.width = '0px';
		div.style.height = '0px';
		div.style.overflow = 'hidden';
		div.style.visibility = 'hidden';
		document.body.appendChild(div);
		Tidy.trialContainer = div;
	}

	return Tidy.trialContainer;
};

/**
 * Returns the geometry of a cell as a string to compare.
 */
Tidy.Trial.getGeometryKey = function(geo)
{
	if (geo == null)
	{
		return '';
	}

	var pt = function(p)
	{
		return (p != null) ? p.x + ',' + p.y : '-';
	};

	var key = [geo.x, geo.y, geo.width, geo.height, (geo.relative) ? 1 : 0,
		pt(geo.offset), pt(geo.sourcePoint), pt(geo.targetPoint)].join(';');

	if (geo.points != null)
	{
		for (var i = 0; i < geo.points.length; i++)
		{
			key += '|' + pt(geo.points[i]);
		}
	}

	return key;
};

/**
 * Returns the state of all cells of the given model by ID: {geo, style,
 * parent} with the key of the geometry (see getGeometryKey).
 */
Tidy.Trial.snapshotModel = function(model)
{
	var result = Object.create(null);

	for (var id in model.cells)
	{
		var cell = model.cells[id];
		var parent = model.getParent(cell);
		result[id] = {geo: Tidy.Trial.getGeometryKey(model.getGeometry(cell)),
			style: model.getStyle(cell), parent: (parent != null) ? parent.id : null};
	}

	return result;
};

/**
 * Returns the state of all cells of the trial: geometry, style and parent.
 */
Tidy.Trial.prototype.snapshot = function()
{
	// The style rules of the page (see Tidy.setRoleRules)
	this.rules = Tidy.getStyleRulesJson(this.graph);

	return Tidy.Trial.snapshotModel(this.graph.model);
};

/**
 * Returns the changes of the trial against the copy of the model it started
 * with: [{id, geometry, style, parent, index, base}] and {id, rules,
 * baseRules} for the style rules of the page, where base and baseRules are
 * the cell and the rules in the editor as the trial started (see apply).
 */
Tidy.Trial.prototype.getChanges = function()
{
	var model = this.graph.model;
	var changes = [];

	for (var id in model.cells)
	{
		var cell = model.cells[id];
		var base = this.base[id];

		if (base == null)
		{
			continue;
		}

		var parent = model.getParent(cell);
		var geo = model.getGeometry(cell);
		var change = {id: id, base: this.sourceBase[id]};
		var changed = false;

		if (parent != null && parent.id != base.parent)
		{
			change.parent = parent.id;
			change.index = parent.getIndex(cell);
			changed = true;
		}

		if (Tidy.Trial.getGeometryKey(geo) != base.geo)
		{
			change.geometry = (geo != null) ? geo.clone() : null;
			changed = true;
		}

		if (model.getStyle(cell) != base.style)
		{
			change.style = model.getStyle(cell);
			changed = true;
		}

		if (changed)
		{
			changes.push(change);
		}
	}

	var rules = Tidy.getStyleRulesJson(this.graph);

	if (rules != this.rules)
	{
		changes.push({id: model.getRoot().id, rules: rules, baseRules: this.sourceRules});
	}

	return changes;
};

/**
 * Runs the given function in one model update of the trial and returns
 * the undoable edit, which undo reverts. If the function throws, its
 * changes are undone before the error is thrown again, so the next step
 * starts from the same model.
 */
Tidy.Trial.prototype.execute = function(fn)
{
	var model = this.graph.model;
	var edit = null;
	var done = false;

	var listener = function(sender, evt)
	{
		edit = evt.getProperty('edit');
	};

	model.addListener(mxEvent.UNDO, listener);
	model.beginUpdate();
	try
	{
		fn(this.graph);
		done = true;
	}
	finally
	{
		model.endUpdate();
		model.removeListener(listener);

		if (!done && edit != null)
		{
			edit.undo();
		}
	}

	return edit;
};

/**
 * Returns a thumbnail of the trial as a data URI or null, in the colors of
 * light mode (see getThumbnails).
 */
Tidy.Trial.prototype.getThumbnail = function()
{
	var thumbs = this.getThumbnails();

	return (thumbs != null) ? thumbs.light : null;
};

/**
 * Returns the thumbnails of the trial as data URIs, {light, dark}, or null.
 * Both are one picture: dark has the color scheme dark, so the colors of the
 * cells are those that the editor paints in dark mode (the light-dark colors
 * of Graph.getAdaptiveColors), and it is light if the page does not adapt
 * its colors (adaptiveColors none), as on the canvas. An SVG in an image
 * does not follow the color scheme of the page, so the tiles pick one.
 */
Tidy.Trial.prototype.getThumbnails = function()
{
	var graph = this.graph;

	if (Object.keys(graph.model.cells).length > Tidy.maxThumbnailCells)
	{
		return null;
	}

	try
	{
		var bounds = graph.getGraphBounds();

		if (bounds.width <= 0 || bounds.height <= 0)
		{
			return null;
		}

		var scale = Math.min(1, (Tidy.thumbnailWidth - 8) / bounds.width,
			(Tidy.thumbnailHeight - 8) / bounds.height);
		var svg = graph.getSvg(null, scale, 4, false, false, true,
			null, null, null, null, null, null, null, null, true);

		// A viewBox lets the picture scale to the size of the tile
		var w = parseFloat(svg.getAttribute('width'));
		var h = parseFloat(svg.getAttribute('height'));

		if (w > 0 && h > 0 && svg.getAttribute('viewBox') == null)
		{
			svg.setAttribute('viewBox', '0 0 ' + w + ' ' + h);
		}

		var light = Editor.createSvgDataUri(mxUtils.getXml(svg));
		var dark = light;

		// An older app.min.js has no adaptive colors (its pictures are light)
		if (typeof graph.getAdaptiveColors === 'function' && graph.getAdaptiveColors() != 'none')
		{
			var style = svg.getAttribute('style');
			svg.setAttribute('style', ((style != null && style.length > 0) ? style + ' ' : '') +
				'color-scheme: dark;');
			dark = Editor.createSvgDataUri(mxUtils.getXml(svg));
		}

		return {light: light, dark: dark};
	}
	catch (e)
	{
		return null;
	}
};

/**
 * Puts the given thumbnails (see Trial.getThumbnails) into the given
 * result: thumbnail in the colors of light mode, darkThumbnail in those of
 * dark mode, or null.
 */
Tidy.setThumbnails = function(result, thumbs)
{
	result.thumbnail = (thumbs != null) ? thumbs.light : null;
	result.darkThumbnail = (thumbs != null) ? thumbs.dark : null;
};

/**
 * Removes the offscreen graph.
 */
Tidy.Trial.prototype.destroy = function()
{
	if (this.graph != null)
	{
		if (this.graph.container.parentNode != null)
		{
			this.graph.container.parentNode.removeChild(this.graph.container);
		}

		this.graph.destroy();
		this.graph = null;
	}
};

/**
 * Runs the plan of the given candidate in the given trial and returns
 * {id, name, score, metrics, orderKept, changes, thumbnail, darkThumbnail,
 * stats} after restoring the trial, also if the candidate fails.
 */
Tidy.tryCandidate = function(trial, plan, id, options)
{
	var graph = trial.graph;
	var stats = {moved: 0, rerouted: 0, labels: 0, attached: 0};
	var col = Tidy.collect(graph, trial.cells);
	var before = Tidy.getCenters(graph, col);
	var shapes = col.vertices.length + col.texts.length;
	var result = {id: id, name: Tidy.candidates[id].name};
	var spec = Tidy.getLayoutSpec(trial.ui, id, options.spacing);
	var gap = Tidy.getSpacing(options.spacing) / 2;
	var edit = null, edit2 = null;

	try
	{
		edit = trial.execute(function()
		{
			if (plan.attachTexts)
			{
				stats.attached = Tidy.ops.attachTexts(graph, col);
			}

			if (spec != null)
			{
				// Layouts route the connectors again. Without a layout only the
				// connectors that libavoid routes lose their route (see below).
				Tidy.ops.resetEdges(graph, col, plan.kind == 'er');

				// Layouts only see the shapes they move and the connectors that
				// may change. Without a filter, ELK lays out and routes all cells.
				var vertices = Tidy.getLayoutVertices(graph, col);
				var all = vertices.length == col.vertices.length && col.fixed.length == 0 &&
					col.texts.length == 0 && col.edges.length == col.allEdges.length && !col.scoped;

				// Locked and opted-out shapes stay where they are in trees
				if (spec[0].layout == 'MindmapLayout' || spec[0].layout == 'BalloonTreeLayout')
				{
					var movableCell = graph.isCellMovable;
					graph.isCellMovable = function(cell)
					{
						return col.movable[cell.id] === true && movableCell.apply(this, arguments);
					};

					try
					{
						Tidy.runLayout(graph, spec, col.parent, vertices, col);
					}
					finally
					{
						delete graph.isCellMovable;
					}
				}
				else
				{
					Tidy.runLayout(graph, spec, col.parent, (all) ? null : vertices, col);
				}
			}
			else
			{
				Tidy.ops.align(graph, col);
			}

			Tidy.ops.removeOverlaps(graph, col, gap);
			stats.labels += Tidy.ops.resetLabels(graph, col);
			stats.labels += Tidy.ops.labelGaps(graph, col);

			if (plan.iconLabels)
			{
				stats.labels += Tidy.ops.iconLabels(graph, col);
			}
		});

		// ELK and the tree layouts route their own connectors. Without a layout
		// and after organic layouts libavoid routes all connectors up to
		// maxRoutedEdges, else the ones that cross shapes, and none if more
		// than maxRoutedEdges cross shapes, the search ends at maxGridChecks
		// or libavoid is missing or fails.
		if (plan.routing && (spec == null || spec[0].layout == 'elkStress') &&
			Tidy.isRoutingAvailable())
		{
			edit2 = trial.execute(function()
			{
				var current = Tidy.collect(graph, trial.cells);
				var edges = current.edges;

				if (edges.length > Tidy.maxRoutedEdges)
				{
					edges = Tidy.getEdgesThroughShapes(graph, current);
				}

				// Too many connectors take too long, a layout is the better choice
				if (edges != null && edges.length <= Tidy.maxRoutedEdges)
				{
					current.edges = edges;

					if (spec == null)
					{
						Tidy.ops.resetEdges(graph, {edges: Tidy.getRoutableEdges(graph, current)},
							plan.kind == 'er');
					}

					stats.rerouted = Tidy.ops.route(graph, current);
				}
			});

			// Connectors that were not routed keep their route
			if (stats.rerouted == 0 && edit2 != null)
			{
				edit2.undo();
				edit2 = null;
			}
		}

		var after = Tidy.collect(graph, trial.cells);
		result.metrics = Tidy.measure(graph, after);

		// Texts that became labels still count, so that the area per shape
		// compares with the page as it is (see isWorse)
		result.metrics.vertices = shapes;
		result.orderKept = Tidy.getOrderKept(before, Tidy.getCenters(graph, after));
		result.score = Tidy.score(result.metrics, result.orderKept);
		result.changes = trial.getChanges();

		for (var i = 0; i < result.changes.length; i++)
		{
			if (result.changes[i].geometry != null && col.movable[result.changes[i].id] != null &&
				graph.model.isVertex(graph.model.getCell(result.changes[i].id)))
			{
				stats.moved++;
			}
		}

		result.stats = stats;
		Tidy.setThumbnails(result, (options.thumbnails !== false) ? trial.getThumbnails() : null);
	}
	finally
	{
		if (edit2 != null)
		{
			edit2.undo();
		}

		if (edit != null)
		{
			edit.undo();
		}
	}

	return result;
};

/**
 * Analyses the page or the given cells of the given editor UI, tries the
 * candidates of the plan and returns {kind, before, score, plan, results,
 * best} with the results sorted by score (best first), the score of the
 * page as it is and the index of the result to apply, which is -1 if no
 * result scores better than the page as it is (see isWorse). Options:
 * direction, spacing, keep, thumbnails.
 */
Tidy.analyze = function(ui, cells, options)
{
	return new Tidy.Analysis(ui, cells, options || {}, false).complete();
};

/**
 * Plans the candidates of Tidy up for the given analysis (see Tidy.analyze):
 * one step per candidate, the results are sorted after the last step.
 */
Tidy.prepareAnalyze = function(analysis, cells)
{
	var trial = analysis.trial;
	var options = analysis.options;
	var graph = trial.graph;
	var col = Tidy.collect(graph, trial.cells);
	var plan = Tidy.plan(graph, col, options);
	var before = Tidy.measure(graph, col);
	var results = [];

	analysis.result = {kind: plan.kind, before: before, score: Tidy.score(before, 1),
		plan: plan, results: results, best: -1, cells: cells, options: options,
		scope: (cells != null && cells.length > 0)};

	var addStep = function(id)
	{
		analysis.steps.push(function()
		{
			try
			{
				results.push(Tidy.tryCandidate(trial, plan, id, options));
			}
			catch (e)
			{
				// A layout that fails is no candidate
				if (window.console != null)
				{
					console.warn('Tidy: ' + id, e);
				}
			}
		});
	};

	for (var i = 0; i < plan.candidates.length; i++)
	{
		addStep(plan.candidates[i]);
	}

	analysis.finish = function()
	{
		Tidy.sortResults(results, plan.prediction);

		// Doing nothing is better than a result that scores worse
		if (results.length > 0 && !Tidy.isWorse(results[0].score, analysis.result.score))
		{
			analysis.result.best = 0;
		}
	};
};

/**
 * Returns true if the given score is worse than the given score of the page
 * as it is by more than a tie (see sortResults). Results that are as good,
 * eg. that only fix labels, are no worse.
 */
Tidy.isWorse = function(score, current)
{
	return score - current > Math.max(1, current * Tidy.tieTolerance);
};

/**
 * An analysis in steps, so that it can run while the browser is idle or show
 * its first part before the rest is known: the constructor copies the page
 * or the given cells of the given editor UI into a trial and plans the
 * candidates of Tidy up (or the palettes of Style My Diagram if style is
 * true, see Tidy.prepareStyle), each step tries one of them, and result is
 * what Tidy.analyze (or Tidy.style) returns once the analysis is complete.
 * The trial is removed after the last step, after an error and by destroy.
 */
Tidy.Analysis = function(ui, cells, options, style)
{
	this.options = options || {};
	this.steps = [];
	this.index = 0;
	this.result = null;
	this.finish = null;
	this.error = null;
	this.done = false;
	this.trial = new Tidy.Trial(ui, cells);

	try
	{
		if (style)
		{
			Tidy.prepareStyle(this, cells);
		}
		else
		{
			Tidy.prepareAnalyze(this, cells);
		}

		this.checkComplete();
	}
	catch (e)
	{
		this.destroy();

		throw e;
	}
};

/**
 * Returns true if all steps ran and the result is complete.
 */
Tidy.Analysis.prototype.isComplete = function()
{
	return this.done;
};

/**
 * Returns the number of steps that did not run yet.
 */
Tidy.Analysis.prototype.getRemainingSteps = function()
{
	return (this.done) ? 0 : this.steps.length - this.index;
};

/**
 * Runs the next step. An error ends the analysis and is thrown again by
 * the next step or complete.
 */
Tidy.Analysis.prototype.step = function()
{
	if (this.error != null)
	{
		throw this.error;
	}
	else if (!this.done)
	{
		if (this.trial == null)
		{
			this.error = new Error('Tidy: analysis destroyed');

			throw this.error;
		}

		try
		{
			this.steps[this.index++]();
			this.checkComplete();
		}
		catch (e)
		{
			this.error = e;
			this.destroy();

			throw e;
		}
	}
};

/**
 * Finishes the result and removes the trial after the last step.
 */
Tidy.Analysis.prototype.checkComplete = function()
{
	if (!this.done && this.index >= this.steps.length)
	{
		try
		{
			if (this.finish != null)
			{
				this.finish();
			}

			this.done = true;
		}
		finally
		{
			this.destroy();
		}
	}
};

/**
 * Runs the remaining steps and returns the result.
 */
Tidy.Analysis.prototype.complete = function()
{
	while (!this.done)
	{
		this.step();
	}

	return this.result;
};

/**
 * Removes the trial. The steps that did not run yet can no longer run.
 */
Tidy.Analysis.prototype.destroy = function()
{
	if (this.trial != null)
	{
		var trial = this.trial;
		this.trial = null;
		trial.destroy();
	}
};

/**
 * Sorts the given results by score. Scores closer than tieTolerance are
 * ordered by the rank of the forest.
 */
Tidy.sortResults = function(results, prediction)
{
	var rank = Object.create(null);

	if (prediction != null)
	{
		for (var i = 0; i < prediction.layout.length; i++)
		{
			var id = Tidy.forestLayouts[prediction.layout[i].name];

			if (id != null && rank[id] == null)
			{
				rank[id] = i;
			}
		}
	}

	results.sort(function(a, b)
	{
		var tol = Math.max(1, Math.min(a.score, b.score) * Tidy.tieTolerance);

		if (Math.abs(a.score - b.score) <= tol)
		{
			var ra = (rank[a.id] != null) ? rank[a.id] : 99;
			var rb = (rank[b.id] != null) ? rank[b.id] : 99;

			if (ra != rb)
			{
				return ra - rb;
			}
		}

		return a.score - b.score;
	});
};

/**
 * Applies the changes of the given result to the model of the given editor
 * UI as one undoable edit and returns the edit (null if nothing changed).
 * Cells that were removed in the meantime are skipped, and what the user or
 * a collaborator changed since the analysis started is kept (see
 * getChanges): a cell that was moved or got another parent keeps its
 * geometry and parent, a cell with another style keeps its style, other
 * style rules are kept. With restyle the changes give the whole page a theme
 * of Style my diagram, which ends the theme by kind of the Diagram tab in the
 * same edit (EditorUi.replaceStyleTheme, if there: Night gives its page back).
 */
Tidy.apply = function(ui, changes, restyle)
{
	var graph = ui.editor.graph;
	var model = graph.model;
	var edit = null;

	var listener = function(sender, evt)
	{
		edit = evt.getProperty('edit');
	};

	var run = function()
	{
		for (var i = 0; i < changes.length; i++)
		{
			Tidy.applyChange(graph, changes[i]);
		}
	};

	model.addListener(mxEvent.UNDO, listener);
	var arrange = graph.beginArrange();
	try
	{
		// Older releases have no themes by kind
		if (restyle && typeof ui.replaceStyleTheme === 'function')
		{
			ui.replaceStyleTheme(run);
		}
		else
		{
			run();
		}
	}
	finally
	{
		graph.endArrange(arrange);
		model.removeListener(listener);
	}

	return edit;
};

/**
 * Applies the given change of a result (see Tidy.apply) to the model of the
 * given graph.
 */
Tidy.applyChange = function(graph, change)
{
	var model = graph.model;
	var cell = model.getCell(change.id);

	if (cell != null)
	{
		// A cell whose new parent was deleted in the meantime (eg. the
		// connector that a text becomes a label of) keeps its parent and
		// geometry, as the geometry is relative to the new parent
		var base = change.base;
		var current = model.getParent(cell);
		var parent = (change.parent != null) ? model.getCell(change.parent) : null;
		var placed = (change.parent == null || parent != null) && (base == null ||
			(base.parent == ((current != null) ? current.id : null) &&
			base.geo == Tidy.Trial.getGeometryKey(model.getGeometry(cell))));

		if (parent != null && parent != current && placed)
		{
			model.add(parent, cell, Math.min(change.index, model.getChildCount(parent)));
		}

		if (change.geometry !== undefined && placed)
		{
			model.setGeometry(cell, (change.geometry != null) ? change.geometry.clone() : null);
		}

		if (change.style !== undefined && (base == null || base.style == model.getStyle(cell)))
		{
			model.setStyle(cell, change.style);
		}

		if (change.rules !== undefined && cell == model.getRoot() &&
			(change.baseRules === undefined || change.baseRules == Tidy.getStyleRulesJson(graph)))
		{
			graph.setAttributeForCell(cell, Graph.styleRulesAttribute, change.rules);
		}
	}
};
