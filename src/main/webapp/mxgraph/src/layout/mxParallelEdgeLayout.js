/**
 * Copyright (c) 2006-2015, JGraph Ltd
 * Copyright (c) 2006-2015, Gaudenz Alder
 */
/**
 * Class: mxParallelEdgeLayout
 * 
 * Extends <mxGraphLayout> for arranging parallel edges. This layout works
 * on edges for all pairs of vertices where there is more than one edge
 * connecting the latter.
 * 
 * Example:
 * 
 * (code)
 * var layout = new mxParallelEdgeLayout(graph);
 * layout.execute(graph.getDefaultParent());
 * (end)
 * 
 * To run the layout for the parallel edges of a changed edge only, the
 * following code can be used.
 * 
 * (code)
 * var layout = new mxParallelEdgeLayout(graph);
 * 
 * graph.addListener(mxEvent.CELL_CONNECTED, function(sender, evt)
 * {
 *   var model = graph.getModel();
 *   var edge = evt.getProperty('edge');
 *   var src = model.getTerminal(edge, true);
 *   var trg = model.getTerminal(edge, false);
 *   
 *   layout.isEdgeIgnored = function(edge2)
 *   {
 *     var src2 = model.getTerminal(edge2, true);
 *     var trg2 = model.getTerminal(edge2, false);
 *     
 *     return !(model.isEdge(edge2) && ((src == src2 && trg == trg2) || (src == trg2 && trg == src2)));
 *   };
 *   
 *   layout.execute(graph.getDefaultParent());
 * });
 * (end)
 * 
 * Constructor: mxParallelEdgeLayout
 * 
 * Constructs a new parallel edge layout for the specified graph.
 */
function mxParallelEdgeLayout(graph)
{
	mxGraphLayout.call(this, graph);
};

/**
 * Extends mxGraphLayout.
 */
mxParallelEdgeLayout.prototype = new mxGraphLayout();
mxParallelEdgeLayout.prototype.constructor = mxParallelEdgeLayout;

/**
 * Variable: spacing
 * 
 * Defines the spacing between the parallels. Default is 20.
 */
mxParallelEdgeLayout.prototype.spacing = 20;

/**
 * Variable: checkOverlap
 * 
 * Specifies if only overlapping edges should be considered
 * parallel. Default is false.
 */
mxParallelEdgeLayout.prototype.checkOverlap = false;

/**
 * Function: execute
 * 
 * Implements <mxGraphLayout.execute>.
 */
mxParallelEdgeLayout.prototype.execute = function(parent, cells)
{
	var lookup = this.findParallels(parent, cells);
	
	this.graph.model.beginUpdate();	
	try
	{
		for (var i in lookup)
		{
			var parallels = lookup[i];

			if (parallels.length > 1)
			{
				this.layout(parallels);
			}
		}
	}
	finally
	{
		this.graph.model.endUpdate();
	}
};

/**
 * Function: findParallels
 * 
 * Finds the parallel edges in the given parent.
 */
mxParallelEdgeLayout.prototype.findParallels = function(parent, cells)
{
	var lookup = [];
	
	var addCell = mxUtils.bind(this, function(cell)
	{
		if (!this.isEdgeIgnored(cell))
		{
			var id = this.getEdgeId(cell);
			
			if (id != null)
			{
				if (lookup[id] == null)
				{
					lookup[id] = [];
				}
				
				lookup[id].push(cell);
			}
		}
	});
	
	if (cells != null)
	{
		for (var i = 0; i < cells.length; i++)
		{
			addCell(cells[i]);
		}
	}
	else
	{
		var model = this.graph.getModel();
		var childCount = model.getChildCount(parent);
		
		for (var i = 0; i < childCount; i++)
		{
			addCell(model.getChildAt(parent, i));
		}
	}
	
	return lookup;
};

/**
 * Function: getEdgeId
 * 
 * Returns a unique ID for the given edge. The id is independent of the
 * edge direction and is built using the visible terminal of the given
 * edge.
 */
mxParallelEdgeLayout.prototype.getEdgeId = function(edge)
{
	var view = this.graph.getView();
	
	// Cannot used cached visible terminal because this could be triggered in BEFORE_UNDO
	var src = view.getVisibleTerminal(edge, true);
	var trg = view.getVisibleTerminal(edge, false);
	var pts = '';

	if (src != null && trg != null)
	{
		src = mxObjectIdentity.get(src);
		trg = mxObjectIdentity.get(trg);
		
		if (this.checkOverlap)
		{
			var state = this.graph.view.getState(edge);
			
			if (state != null && state.absolutePoints != null)
			{
				var tmp = [];
				
				for (var i = 0; i < state.absolutePoints.length; i++)
				{
					var pt = state.absolutePoints[i];
					
					if (pt != null)
					{
						tmp.push(pt.x, pt.y);
					}
				}
				
				pts = tmp.join(',');
			}
		};
		
		return ((src > trg) ? trg + '-' + src : src + '-' + trg) + pts;
	}
	
	return null;
};

/**
 * Function: layout
 * 
 * Lays out the parallel edges in the given array.
 */
mxParallelEdgeLayout.prototype.layout = function(parallels)
{
	var edge = parallels[0];

	var state = this.graph.view.getState(edge);
			
	if (state != null && state.absolutePoints != null)
	{
		var p0 = state.absolutePoints[0];
		var pe = state.absolutePoints[state.absolutePoints.length - 1];

		if (p0 != null && pe != null)
		{
			var view = this.graph.getView();
			var model = this.graph.getModel();
			var src = model.getGeometry(view.getVisibleTerminal(edge, true));
			var trg = model.getGeometry(view.getVisibleTerminal(edge, false));
			
			// Routes multiple loops
			if (src == trg)
			{
				var x0 = src.x + src.width + this.spacing;
				var y0 = src.y + src.height / 2;

				for (var i = 0; i < parallels.length; i++)
				{
					this.route(parallels[i], x0, y0);
					x0 += this.spacing;
				}
			}
			else if (src != null && trg != null)
			{
				var s = this.graph.view.scale;
				var tr = this.graph.view.translate;

				// Uses model coordinates for routing
				p0.x = p0.x / s - tr.x;
				p0.y = p0.y / s - tr.y;
				pe.x = pe.x / s - tr.x;
				pe.y = pe.y / s - tr.y;

				// Routes parallel edges
				var dx = pe.x - p0.x;
				var dy = pe.y - p0.y;

				var len = Math.sqrt(dx * dx + dy * dy);
				
				if (len > 0)
				{
					var x0 = p0.x + dx / 2;
					var y0 = p0.y + dy / 2;
					
					var nx = dy * this.spacing / len;
					var ny = dx * this.spacing / len;
					
					x0 += nx * (parallels.length - 1) / 2;
					y0 -= ny * (parallels.length - 1) / 2;
			
					for (var i = 0; i < parallels.length; i++)
					{
						this.route(parallels[i], x0, y0);
						x0 -= nx;
						y0 += ny;
					}
				}
			}
		}
	}
};

/**
 * Function: route
 * 
 * Routes the given edge via the given point.
 */
mxParallelEdgeLayout.prototype.route = function(edge, x, y)
{
	if (this.graph.isCellMovable(edge))
	{
		this.setEdgePoints(edge, [new mxPoint(Math.round(x), Math.round(y))]);
	}
};
