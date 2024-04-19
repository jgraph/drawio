/**
 * Copyright (c) 2006-2015, JGraph Ltd
 * Copyright (c) 2006-2015, Gaudenz Alder
 */
var mxClipboard =
{
	/**
	 * Class: mxClipboard
	 * 
	 * Singleton that implements a clipboard for graph cells.
	 *
	 * Example:
	 * 
	 * (code)
	 * mxClipboard.copy(graph);
	 * mxClipboard.paste(graph2);
	 * (end)
	 *
	 * This copies the selection cells from the graph to the clipboard and
	 * pastes them into graph2.
	 * 
	 * For fine-grained control of the clipboard data the <mxGraph.canExportCell>
	 * and <mxGraph.canImportCell> functions can be overridden.
	 * 
	 * To restore previous parents for pasted cells, the implementation for
	 * <copy> and <paste> can be changed as follows.
	 * 
	 * (code)
	 * mxClipboard.copy = function(graph, cells)
	 * {
	 *   cells = cells || graph.getSelectionCells();
	 *   var result = graph.getExportableCells(cells);
	 *   
	 *   mxClipboard.parents = new Object();
	 *   
	 *   for (var i = 0; i < result.length; i++)
	 *   {
	 *     mxClipboard.parents[i] = graph.model.getParent(cells[i]);
	 *   }
	 *   
	 *   mxClipboard.insertCount = 1;
	 *   mxClipboard.setCells(graph.cloneCells(result));
	 *   
	 *   return result;
	 * };
	 * 
	 * mxClipboard.paste = function(graph)
	 * {
	 *   if (!mxClipboard.isEmpty())
	 *   {
	 *     var cells = graph.getImportableCells(mxClipboard.getCells());
	 *     var delta = mxClipboard.insertCount * mxClipboard.STEPSIZE;
	 *     var parent = graph.getDefaultParent();
	 *     
	 *     graph.model.beginUpdate();
	 *     try
	 *     {
	 *       for (var i = 0; i < cells.length; i++)
	 *       {
	 *         var tmp = (mxClipboard.parents != null && graph.model.contains(mxClipboard.parents[i])) ?
	 *              mxClipboard.parents[i] : parent;
	 *         cells[i] = graph.importCells([cells[i]], delta, delta, tmp)[0];
	 *       }
	 *     }
	 *     finally
	 *     {
	 *       graph.model.endUpdate();
	 *     }
	 *     
	 *     // Increments the counter and selects the inserted cells
	 *     mxClipboard.insertCount++;
	 *     graph.setSelectionCells(cells);
	 *   }
	 * };
	 * (end)
	 * 
	 * Variable: STEPSIZE
	 * 
	 * Defines the step size to offset the cells after each paste operation.
	 * Default is 10.
	 */
	STEPSIZE: 10,

	/**
	 * Variable: insertCount
	 * 
	 * Counts the number of times the clipboard data has been inserted.
	 */
	insertCount: 1,

	/**
	 * Variable: cells
	 * 
	 * Holds the array of <mxCells> currently in the clipboard.
	 */
	cells: null,

	/**
	 * Function: setCells
	 * 
	 * Sets the cells in the clipboard. Fires a <mxEvent.CHANGE> event.
	 */
	setCells: function(cells)
	{
		mxClipboard.cells = cells;
	},

	/**
	 * Function: getCells
	 * 
	 * Returns  the cells in the clipboard.
	 */
	getCells: function()
	{
		return mxClipboard.cells;
	},
	
	/**
	 * Function: isEmpty
	 * 
	 * Returns true if the clipboard currently has not data stored.
	 */
	isEmpty: function()
	{
		return mxClipboard.getCells() == null;
	},
	
	/**
	 * Function: cut
	 * 
	 * Cuts the given array of <mxCells> from the specified graph.
	 * If cells is null then the selection cells of the graph will
	 * be used. Returns the cells that have been cut from the graph.
	 *
	 * Parameters:
	 * 
	 * graph - <mxGraph> that contains the cells to be cut.
	 * cells - Optional array of <mxCells> to be cut.
	 */
	cut: function(graph, cells)
	{
		cells = mxClipboard.copy(graph, cells);
		mxClipboard.insertCount = 0;
		mxClipboard.removeCells(graph, cells, false);
		
		return cells;
	},

	/**
	 * Function: removeCells
	 * 
	 * Hook to remove the given cells from the given graph after
	 * a cut operation.
	 *
	 * Parameters:
	 * 
	 * graph - <mxGraph> that contains the cells to be cut.
	 * cells - Array of <mxCells> to be cut.
	 * includeEdges - Optional boolean which specifies if all connected edges
	 * should be removed as well. Default is true.
	 */
	removeCells: function(graph, cells, includeEdges)
	{
		graph.removeCells(cells, includeEdges);
	},

	/**
	 * Function: copy
	 * 
	 * Copies the given array of <mxCells> from the specified
	 * graph to <cells>. Returns the original array of cells that has
	 * been cloned. Descendants of cells in the array are ignored.
	 * 
	 * Parameters:
	 * 
	 * graph - <mxGraph> that contains the cells to be copied.
	 * cells - Optional array of <mxCells> to be copied.
	 */
	copy: function(graph, cells)
	{
		cells = cells || graph.getSelectionCells();
		var result = graph.getExportableCells(graph.model.getTopmostCells(cells));
		mxClipboard.insertCount = 1;
		mxClipboard.setCells(graph.cloneCells(result));

		return result;
	},

	/**
	 * Function: paste
	 * 
	 * Pastes the <cells> into the specified graph restoring
	 * the relation to <parents>, if possible. If the parents
	 * are no longer in the graph or invisible then the
	 * cells are added to the graph's default or into the
	 * swimlane under the cell's new location if one exists.
	 * The cells are added to the graph using <mxGraph.importCells>
	 * and returned.
	 * 
	 * Parameters:
	 * 
	 * graph - <mxGraph> to paste the <cells> into.
	 */
	paste: function(graph)
	{
		var cells = null;
		
		if (!mxClipboard.isEmpty())
		{
			cells = graph.getImportableCells(mxClipboard.getCells());
			var delta = mxClipboard.insertCount * mxClipboard.STEPSIZE;
			var parent = graph.getDefaultParent();
			cells = graph.importCells(cells, delta, delta, parent);
			
			// Increments the counter and selects the inserted cells
			mxClipboard.insertCount++;
			graph.setSelectionCells(cells);
		}
		
		return cells;
	}

};
