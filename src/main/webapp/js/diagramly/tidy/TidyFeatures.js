/**
 * Copyright (c) 2006-2026, JGraph Holdings Ltd
 * Copyright (c) 2006-2026, draw.io AG
 */
/**
 * Features of a diagram for the forest of Tidy up (see TidyForest.js) and
 * the walk of the trees. Plain JavaScript without dependencies: the editor
 * (Tidy.getFeatureCells) and the trainer (etc/tidy/train.js, which loads
 * this file in a node VM) compute the same numbers from the same list of
 * cells. Only numbers leave this file, never labels or styles.
 *
 * A cell is {id, parent, vertex, edge, source, target, style, label, data,
 * x, y, w, h, rel, points}: x and y are relative to the parent like in the
 * model, label is the plain text of the label, data is true for cells with
 * data and points is the number of waypoints of an edge.
 *
 * In extensions.min.js.
 */
var TidyFeatures = {};

/**
 * Names of the features in the order of the vectors. The model stores the
 * names it was trained with and the walk maps them, so features can be added
 * without breaking a checked-in model.
 */
TidyFeatures.names = ['n', 'm', 'nc', 'ncomp', 'density', 'edgesPerNode', 'isDag',
	'isForest', 'maxIn', 'maxOut', 'maxDeg', 'maxDepth', 'depthRatio', 'rootFrac',
	'sinkFrac', 'leafFrac', 'isolatedFrac', 'fVendor', 'fBpmn', 'fMockup', 'fEng',
	'fUml', 'fSwim', 'fRhombus', 'fEllipse', 'fText', 'fImage', 'fFlowShape',
	'fRect', 'containerFrac', 'roundedFrac', 'distinctFills', 'dataFrac',
	'avgLabel', 'labelledFrac', 'eOrtho', 'eCurved', 'eStraight', 'eElbow',
	'eWaypoints', 'eDashed', 'eNoArrow', 'eLabels', 'danglingFrac', 'nDown',
	'nUp', 'nRight', 'nLeft'];

/**
 * Returns the keys and values of the given style string as an object
 * without a prototype. A name without a value at the start is the named
 * style (_shape).
 */
TidyFeatures.parseStyle = function(style)
{
	var result = Object.create(null);
	var tokens = (typeof style === 'string') ? style.split(';') : [];

	for (var i = 0; i < tokens.length; i++)
	{
		var token = tokens[i];
		var j = token.indexOf('=');

		if (token.length > 0)
		{
			if (j < 0)
			{
				if (i == 0)
				{
					result._shape = token;
				}
				else
				{
					result[token] = '1';
				}
			}
			else
			{
				result[token.substring(0, j)] = token.substring(j + 1);
			}
		}
	}

	return result;
};

/**
 * Returns the family of the shape of the given parsed style.
 */
TidyFeatures.getShapeFamily = function(st)
{
	var sh = st.shape || st._shape || 'rect';

	if (/^mxgraph\.(aws|azure|gcp|cisco|kubernetes|ibm|network|citrix|veeam|office|alibaba|openstack)/.test(sh))
	{
		return 'vendor';
	}
	else if (/mxgraph\.bpmn/.test(sh))
	{
		return 'bpmn';
	}
	else if (/mxgraph\.(mockup|android|ios|ios7|webicons)/.test(sh))
	{
		return 'mockup';
	}
	else if (/mxgraph\.(electrical|pid|eip|floorplan|cabinets|rack)/.test(sh))
	{
		return 'engineering';
	}
	else if (/umlLifeline|umlActor|umlFrame|^module$|^component$|lollipop|providedRequired|umlBoundary|umlEntity|umlControl/.test(sh))
	{
		return 'uml';
	}
	else if (/swimlane|table|tableRow|partialRectangle/.test(sh))
	{
		return 'swimlane';
	}
	else if (/rhombus|flowchart\.decision/.test(sh))
	{
		return 'rhombus';
	}
	else if (/ellipse|doubleEllipse/.test(sh))
	{
		return 'ellipse';
	}
	else if (sh == 'text')
	{
		return 'text';
	}
	else if (/image|^label$/.test(sh) || st.image != null)
	{
		return 'image';
	}
	else if (/cloud|cylinder|process|document|parallelogram|hexagon|step|card|note|triangle|callout|offPageConnector|tape|datastore|flowchart/.test(sh))
	{
		return 'flowshape';
	}

	return 'rect';
};

/**
 * Returns the feature vector of the given cells (see above). The optional
 * centers map IDs of vertices to the centers to use for the directions of
 * the edges (the trainer passes the centers of a messed-up copy).
 */
TidyFeatures.extract = function(cells, centers)
{
	var byId = Object.create(null);
	var verts = [];
	var edges = [];
	var i;

	for (i = 0; i < cells.length; i++)
	{
		byId[cells[i].id] = cells[i];
	}

	for (i = 0; i < cells.length; i++)
	{
		var c = cells[i];

		if (c.vertex && !c.rel)
		{
			verts.push(c);
		}
		else if (c.edge)
		{
			edges.push(c);
		}
	}

	var vset = Object.create(null);

	for (i = 0; i < verts.length; i++)
	{
		vset[verts[i].id] = true;
	}

	// Absolute centers: children of vertices are relative to their parent
	var abs = function(c)
	{
		var x = c.x || 0, y = c.y || 0, p = byId[c.parent], guard = 0;

		while (p != null && p.vertex && !p.rel && guard++ < 100)
		{
			x += p.x || 0;
			y += p.y || 0;
			p = byId[p.parent];
		}

		return {x: x + (c.w || 0) / 2, y: y + (c.h || 0) / 2};
	};

	var pos = Object.create(null);

	for (i = 0; i < verts.length; i++)
	{
		pos[verts[i].id] = (centers != null && centers[verts[i].id] != null) ?
			centers[verts[i].id] : abs(verts[i]);
	}

	var cedges = [];

	for (i = 0; i < edges.length; i++)
	{
		var e = edges[i];

		if (vset[e.source] && vset[e.target] && e.source != e.target)
		{
			cedges.push(e);
		}
	}

	var n = verts.length, m = cedges.length;
	var indeg = Object.create(null), outdeg = Object.create(null);
	var adj = Object.create(null), und = Object.create(null);

	for (i = 0; i < verts.length; i++)
	{
		var id = verts[i].id;
		indeg[id] = 0;
		outdeg[id] = 0;
		adj[id] = [];
		und[id] = [];
	}

	for (i = 0; i < cedges.length; i++)
	{
		var s = cedges[i].source, t = cedges[i].target;
		outdeg[s]++;
		indeg[t]++;
		adj[s].push(t);
		und[s].push(t);
		und[t].push(s);
	}

	var connected = [];

	for (i = 0; i < verts.length; i++)
	{
		if (indeg[verts[i].id] + outdeg[verts[i].id] > 0)
		{
			connected.push(verts[i].id);
		}
	}

	var nc = connected.length;

	// Connected components
	var comp = Object.create(null), ncomp = 0;

	for (i = 0; i < connected.length; i++)
	{
		if (comp[connected[i]] == null)
		{
			ncomp++;
			comp[connected[i]] = ncomp;
			var stack = [connected[i]];

			while (stack.length > 0)
			{
				var u = stack.pop();

				for (var k = 0; k < und[u].length; k++)
				{
					if (comp[und[u][k]] == null)
					{
						comp[und[u][k]] = ncomp;
						stack.push(und[u][k]);
					}
				}
			}
		}
	}

	// DAG and longest path (Kahn)
	var ind = Object.create(null), queue = [], depth = Object.create(null);
	var seen = 0, maxDepth = 0, maxIn = 0, maxOut = 0, maxDeg = 0;
	var roots = 0, sinks = 0, leaves = 0;

	for (i = 0; i < connected.length; i++)
	{
		var v = connected[i];
		ind[v] = indeg[v];
		maxIn = Math.max(maxIn, indeg[v]);
		maxOut = Math.max(maxOut, outdeg[v]);
		maxDeg = Math.max(maxDeg, indeg[v] + outdeg[v]);

		if (indeg[v] == 0)
		{
			roots++;
			queue.push(v);
			depth[v] = 0;
		}

		if (outdeg[v] == 0)
		{
			sinks++;
		}

		if (indeg[v] + outdeg[v] == 1)
		{
			leaves++;
		}
	}

	for (var q = 0; q < queue.length; q++)
	{
		var a = queue[q];
		seen++;

		for (var k = 0; k < adj[a].length; k++)
		{
			var b = adj[a][k];
			depth[b] = Math.max(depth[b] || 0, depth[a] + 1);
			maxDepth = Math.max(maxDepth, depth[b]);

			if (--ind[b] == 0)
			{
				queue.push(b);
			}
		}
	}

	// Shapes and styles
	var families = Object.create(null), containers = 0, rounded = 0;
	var fills = Object.create(null), distinctFills = 0, dataCells = 0;
	var labelLen = 0, labelled = 0;

	for (i = 0; i < verts.length; i++)
	{
		var st = TidyFeatures.parseStyle(verts[i].style);
		var fam = TidyFeatures.getShapeFamily(st);
		families[fam] = (families[fam] || 0) + 1;

		if (st.container == '1' || /swimlane/.test(st.shape || st._shape || '') || st.childLayout != null)
		{
			containers++;
		}

		if (st.rounded == '1')
		{
			rounded++;
		}

		if (st.fillColor != null && st.fillColor != 'none')
		{
			var fill = String(st.fillColor).toLowerCase();

			if (fills[fill] == null)
			{
				fills[fill] = true;
				distinctFills++;
			}
		}

		if (verts[i].data)
		{
			dataCells++;
		}

		var label = verts[i].label || '';

		if (label.length > 0)
		{
			labelled++;
			labelLen += label.length;
		}
	}

	var frac = function(key)
	{
		return (n > 0) ? (families[key] || 0) / n : 0;
	};

	var ortho = 0, curved = 0, straight = 0, elbow = 0, wp = 0;
	var dashed = 0, noArrow = 0, edgeLabels = 0;

	for (i = 0; i < edges.length; i++)
	{
		var es = TidyFeatures.parseStyle(edges[i].style);
		var edgeStyle = es.edgeStyle || '';

		if (/orthogonal/.test(edgeStyle))
		{
			ortho++;
		}
		else if (/elbow|entityRelation|isometric/.test(edgeStyle))
		{
			elbow++;
		}
		else if (es.curved == '1')
		{
			curved++;
		}
		else
		{
			straight++;
		}

		if (edges[i].points > 0)
		{
			wp++;
		}

		if (es.dashed == '1')
		{
			dashed++;
		}

		if (es.endArrow == 'none')
		{
			noArrow++;
		}

		if ((edges[i].label || '').length > 0)
		{
			edgeLabels++;
		}
	}

	var me = Math.max(1, edges.length);

	// Directions of the edges in the current (or given) positions
	var down = 0, up = 0, right = 0, left = 0;

	for (i = 0; i < cedges.length; i++)
	{
		var p0 = pos[cedges[i].source], p1 = pos[cedges[i].target];
		var dx = p1.x - p0.x, dy = p1.y - p0.y;

		if (Math.abs(dy) >= Math.abs(dx))
		{
			if (dy >= 0) down++; else up++;
		}
		else
		{
			if (dx >= 0) right++; else left++;
		}
	}

	var mm = Math.max(1, m);

	var f = {n: n, m: m, nc: nc, ncomp: ncomp,
		density: (nc > 1) ? m / (nc * (nc - 1)) : 0,
		edgesPerNode: (nc > 0) ? m / nc : 0,
		isDag: (nc > 0 && seen == nc) ? 1 : 0,
		isForest: (nc > 0 && m == nc - ncomp) ? 1 : 0,
		maxIn: maxIn, maxOut: maxOut, maxDeg: maxDeg, maxDepth: maxDepth,
		depthRatio: (nc > 0) ? maxDepth / nc : 0,
		rootFrac: (nc > 0) ? roots / nc : 0,
		sinkFrac: (nc > 0) ? sinks / nc : 0,
		leafFrac: (nc > 0) ? leaves / nc : 0,
		isolatedFrac: (n > 0) ? (n - nc) / n : 0,
		fVendor: frac('vendor'), fBpmn: frac('bpmn'), fMockup: frac('mockup'),
		fEng: frac('engineering'), fUml: frac('uml'), fSwim: frac('swimlane'),
		fRhombus: frac('rhombus'), fEllipse: frac('ellipse'), fText: frac('text'),
		fImage: frac('image'), fFlowShape: frac('flowshape'), fRect: frac('rect'),
		containerFrac: (n > 0) ? containers / n : 0,
		roundedFrac: (n > 0) ? rounded / n : 0,
		distinctFills: distinctFills,
		dataFrac: (n > 0) ? dataCells / n : 0,
		avgLabel: (labelled > 0) ? labelLen / labelled : 0,
		labelledFrac: (n > 0) ? labelled / n : 0,
		eOrtho: ortho / me, eCurved: curved / me, eStraight: straight / me,
		eElbow: elbow / me, eWaypoints: wp / me, eDashed: dashed / me,
		eNoArrow: noArrow / me, eLabels: edgeLabels / me,
		danglingFrac: (edges.length > 0) ? (edges.length - m) / edges.length : 0,
		nDown: down / mm, nUp: up / mm, nRight: right / mm, nLeft: left / mm};

	var vector = [];

	for (i = 0; i < TidyFeatures.names.length; i++)
	{
		var value = f[TidyFeatures.names[i]];
		vector.push((typeof value === 'number' && isFinite(value)) ? value : 0);
	}

	return vector;
};

/**
 * Returns the classes of the given forest for the given feature vector,
 * most votes first, as [{name, votes}]. A forest is {features, classes,
 * trees}: features are the names of the inputs of the trees, a tree is a
 * leaf (the index of a class) or a node [feature, threshold, left, right].
 * Returns an empty array for a forest that is not valid.
 */
TidyFeatures.rank = function(forest, vector)
{
	var result = [];

	if (forest == null || !Array.isArray(forest.trees) || !Array.isArray(forest.classes) ||
		!Array.isArray(forest.features))
	{
		return result;
	}

	// Maps the inputs of the model to the current feature vector
	var index = Object.create(null);

	for (var i = 0; i < TidyFeatures.names.length; i++)
	{
		index[TidyFeatures.names[i]] = i;
	}

	var x = [];

	for (var i = 0; i < forest.features.length; i++)
	{
		var j = index[forest.features[i]];
		x.push((j != null) ? vector[j] : 0);
	}

	var votes = [];

	for (var i = 0; i < forest.classes.length; i++)
	{
		votes.push(0);
	}

	for (var i = 0; i < forest.trees.length; i++)
	{
		var node = forest.trees[i];

		// Depth is limited by the size of the model, the guard by a crafted one
		for (var guard = 0; Array.isArray(node) && node.length == 4 && guard < 64; guard++)
		{
			node = ((x[node[0]] || 0) <= node[1]) ? node[2] : node[3];
		}

		if (typeof node === 'number' && node >= 0 && node < votes.length)
		{
			votes[node]++;
		}
	}

	for (var i = 0; i < votes.length; i++)
	{
		if (votes[i] > 0)
		{
			result.push({name: String(forest.classes[i]), votes: votes[i]});
		}
	}

	result.sort(function(a, b)
	{
		return b.votes - a.votes;
	});

	return result;
};
