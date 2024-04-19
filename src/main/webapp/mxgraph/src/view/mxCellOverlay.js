/**
 * Copyright (c) 2006-2015, JGraph Ltd
 * Copyright (c) 2006-2015, Gaudenz Alder
 */
/**
 * Class: mxCellOverlay
 *
 * Extends <mxEventSource> to implement a graph overlay, represented by an icon
 * and a tooltip. Overlays can handle and fire <click> events and are added to
 * the graph using <mxGraph.addCellOverlay>, and removed using
 * <mxGraph.removeCellOverlay>, or <mxGraph.removeCellOverlays> to remove all overlays.
 * The <mxGraph.getCellOverlays> function returns the array of overlays for a given
 * cell in a graph. If multiple overlays exist for the same cell, then
 * <getBounds> should be overridden in at least one of the overlays.
 * 
 * Overlays appear on top of all cells in a special layer. If this is not
 * desirable, then the image must be rendered as part of the shape or label of
 * the cell instead.
 *
 * Example:
 * 
 * The following adds a new overlays for a given vertex and selects the cell
 * if the overlay is clicked.
 *
 * (code)
 * var overlay = new mxCellOverlay(img, html);
 * graph.addCellOverlay(vertex, overlay);
 * overlay.addListener(mxEvent.CLICK, function(sender, evt)
 * {
 *   var cell = evt.getProperty('cell');
 *   graph.setSelectionCell(cell);
 * });
 * (end)
 * 
 * For cell overlays to be printed use <mxPrintPreview.printOverlays>.
 *
 * Event: mxEvent.CLICK
 *
 * Fires when the user clicks on the overlay. The <code>event</code> property
 * contains the corresponding mouse event and the <code>cell</code> property
 * contains the cell. For touch devices this is fired if the element receives
 * a touchend event.
 * 
 * Constructor: mxCellOverlay
 *
 * Constructs a new overlay using the given image and tooltip.
 * 
 * Parameters:
 * 
 * image - <mxImage> that represents the icon to be displayed.
 * tooltip - Optional string that specifies the tooltip.
 * align - Optional horizontal alignment for the overlay. Possible
 * values are <ALIGN_LEFT>, <ALIGN_CENTER> and <ALIGN_RIGHT>
 * (default).
 * verticalAlign - Vertical alignment for the overlay. Possible
 * values are <ALIGN_TOP>, <ALIGN_MIDDLE> and <ALIGN_BOTTOM>
 * (default).
 */
function mxCellOverlay(image, tooltip, align, verticalAlign, offset, cursor)
{
	this.image = image;
	this.tooltip = tooltip;
	this.align = (align != null) ? align : this.align;
	this.verticalAlign = (verticalAlign != null) ? verticalAlign : this.verticalAlign;
	this.offset = (offset != null) ? offset : new mxPoint();
	this.cursor = (cursor != null) ? cursor : 'help';
};

/**
 * Extends mxEventSource.
 */
mxCellOverlay.prototype = new mxEventSource();
mxCellOverlay.prototype.constructor = mxCellOverlay;

/**
 * Variable: image
 *
 * Holds the <mxImage> to be used as the icon.
 */
mxCellOverlay.prototype.image = null;

/**
 * Variable: tooltip
 * 
 * Holds the optional string to be used as the tooltip.
 */
mxCellOverlay.prototype.tooltip = null;

/**
 * Variable: align
 * 
 * Holds the horizontal alignment for the overlay. Default is
 * <mxConstants.ALIGN_RIGHT>. For edges, the overlay always appears in the
 * center of the edge.
 */
mxCellOverlay.prototype.align = mxConstants.ALIGN_RIGHT;

/**
 * Variable: verticalAlign
 * 
 * Holds the vertical alignment for the overlay. Default is
 * <mxConstants.ALIGN_BOTTOM>. For edges, the overlay always appears in the
 * center of the edge.
 */
mxCellOverlay.prototype.verticalAlign = mxConstants.ALIGN_BOTTOM;

/**
 * Variable: offset
 * 
 * Holds the offset as an <mxPoint>. The offset will be scaled according to the
 * current scale.
 */
mxCellOverlay.prototype.offset = null;

/**
 * Variable: cursor
 * 
 * Holds the cursor for the overlay. Default is 'help'.
 */
mxCellOverlay.prototype.cursor = null;

/**
 * Variable: defaultOverlap
 * 
 * Defines the overlapping for the overlay, that is, the proportional distance
 * from the origin to the point defined by the alignment. Default is 0.5.
 */
mxCellOverlay.prototype.defaultOverlap = 0.5;

/**
 * Function: getBounds
 * 
 * Returns the bounds of the overlay for the given <mxCellState> as an
 * <mxRectangle>. This should be overridden when using multiple overlays
 * per cell so that the overlays do not overlap.
 * 
 * The following example will place the overlay along an edge (where
 * x=[-1..1] from the start to the end of the edge and y is the
 * orthogonal offset in px).
 * 
 * (code)
 * overlay.getBounds = function(state)
 * {
 *   var bounds = mxCellOverlay.prototype.getBounds.apply(this, arguments);
 *   
 *   if (state.view.graph.getModel().isEdge(state.cell))
 *   {
 *     var pt = state.view.getPoint(state, {x: 0, y: 0, relative: true});
 *     
 *     bounds.x = pt.x - bounds.width / 2;
 *     bounds.y = pt.y - bounds.height / 2;
 *   }
 *   
 *   return bounds;
 * };
 * (end)
 * 
 * Parameters:
 * 
 * state - <mxCellState> that represents the current state of the
 * associated cell.
 */
mxCellOverlay.prototype.getBounds = function(state)
{
	var isEdge = state.view.graph.getModel().isEdge(state.cell);
	var s = state.view.scale;
	var pt = null;

	var w = this.image.width;
	var h = this.image.height;
	
	if (isEdge)
	{
		var pts = state.absolutePoints;
		
		if (pts.length % 2 == 1)
		{
			pt = pts[Math.floor(pts.length / 2)];
		}
		else
		{
			var idx = pts.length / 2;
			var p0 = pts[idx-1];
			var p1 = pts[idx];
			pt = new mxPoint(p0.x + (p1.x - p0.x) / 2,
				p0.y + (p1.y - p0.y) / 2);
		}
	}
	else
	{
		pt = new mxPoint();
		
		if (this.align == mxConstants.ALIGN_LEFT)
		{
			pt.x = state.x;
		}
		else if (this.align == mxConstants.ALIGN_CENTER)
		{
			pt.x = state.x + state.width / 2;
		}
		else
		{
			pt.x = state.x + state.width;
		}
		
		if (this.verticalAlign == mxConstants.ALIGN_TOP)
		{
			pt.y = state.y;
		}
		else if (this.verticalAlign == mxConstants.ALIGN_MIDDLE)
		{
			pt.y = state.y + state.height / 2;
		}
		else
		{
			pt.y = state.y + state.height;
		}
	}

	return new mxRectangle(Math.round(pt.x - (w * this.defaultOverlap - this.offset.x) * s),
		Math.round(pt.y - (h * this.defaultOverlap - this.offset.y) * s), w * s, h * s);
};

/**
 * Function: toString
 * 
 * Returns the textual representation of the overlay to be used as the
 * tooltip. This implementation returns <tooltip>.
 */
mxCellOverlay.prototype.toString = function()
{
	return this.tooltip;
};
