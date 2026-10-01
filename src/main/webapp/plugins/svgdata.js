/**
 * Copyright (c) 2020-2025, JGraph Holdings Ltd
 * Copyright (c) 2020-2025, draw.io AG
 */
/**
 * Backwards-compatible SVG export with rich cell metadata.
 *
 * Core supports a "data-only" mode via createSvgImageExport's addSvgData
 * argument that emits data-meta-{attr} on the wrapper group (the new,
 * collision-free format used by the SVG export dialog and the JSON
 * protocol's embedCellMetadata option).
 *
 * This plugin restores the legacy svgdata format byte-for-byte: the
 * wrapper group gets unprefixed data-{attr} (only on root/layer cells)
 * along with id="cell-X", content, type=root|layer, and each painted
 * shape is wrapped in an inner <g id="cell-X" content data-* type=
 * vertex|edge> group. Anything parsing the old output continues to work.
 */
Draw.loadPlugin(function(ui)
{
	var graphCreateSvgImageExport = Graph.prototype.createSvgImageExport;

	Graph.prototype.createSvgImageExport = function(addSvgData, icons, iconLinkTarget)
	{
		// Don't enable the new core data-meta- mode — emit the legacy unprefixed
		// data-{attr} so existing consumers of the plugin's output keep working.
		// The tooltip, link and note icons are passed through.
		var exp = graphCreateSvgImageExport.call(this, false, icons, iconLinkTarget);
		var graph = this;

		// Tag root and layer wrappers with id, content, data-{attr}, type
		var expAddCellData = exp.addCellData;

		exp.addCellData = function(cell, group, includeValue)
		{
			group = expAddCellData.apply(this, arguments);
			var model = graph.model;
			var isRoot = cell == model.getRoot();
			var isLayer = !isRoot && model.getParent(cell) == model.getRoot();

			if (isRoot || isLayer)
			{
				group.setAttribute('id', 'cell-' + cell.id);

				if (mxUtils.isNode(cell.value))
				{
					group.setAttribute('content', mxUtils.getXml(cell.value));

					for (var i = 0; i < cell.value.attributes.length; i++)
					{
						var attrib = cell.value.attributes[i];
						group.setAttribute('data-' + attrib.name, attrib.value);
					}
				}

				group.setAttribute('type', isRoot ? 'root' : 'layer');
			}

			return group;
		};

		// Wrap each painted cell shape in an inner <g id="cell-X" ...>
		var expDrawCellState = exp.drawCellState;

		exp.drawCellState = function(state, canvas)
		{
			var svgDoc = canvas.root.ownerDocument;
			var g = (svgDoc.createElementNS != null) ?
				svgDoc.createElementNS(mxConstants.NS_SVG, 'g') :
				svgDoc.createElement('g');
			g.setAttribute('id', 'cell-' + state.cell.id);

			// Temporarily replaces root for content rendering
			var prev = canvas.root;
			prev.appendChild(g);
			canvas.root = g;

			expDrawCellState.apply(this, arguments);

			// Drop empty wrappers; otherwise enrich with metadata
			if (g.firstChild == null)
			{
				g.parentNode.removeChild(g);
			}
			else if (mxUtils.isNode(state.cell.value))
			{
				g.setAttribute('content', mxUtils.getXml(state.cell.value));

				for (var i = 0; i < state.cell.value.attributes.length; i++)
				{
					var attrib = state.cell.value.attributes[i];
					g.setAttribute('data-' + attrib.name, attrib.value);
				}

				g.setAttribute('type', graph.model.isEdge(state.cell) ? 'edge' : 'vertex');
			}

			// Restores previous root
			canvas.root = prev;
		};

		return exp;
	};
});
