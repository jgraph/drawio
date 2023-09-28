/**
 * Copyright (c) 2006-2015, JGraph Ltd
 * Copyright (c) 2006-2015, Gaudenz Alder
 */
/**
 * Class: mxCellTracker
 * 
 * Event handler that highlights cells. Inherits from <mxCellMarker>.
 * 
 * Example:
 * 
 * (code)
 * new mxCellTracker(graph, '#00FF00');
 * (end)
 * 
 * For detecting dragEnter, dragOver and dragLeave on cells, the following
 * code can be used:
 * 
 * (code)
 * graph.addMouseListener(
 * {
 *   cell: null,
 *   mouseDown: function(sender, me) { },
 *   mouseMove: function(sender, me)
 *   {
 *     var tmp = me.getCell();
 *     
 *     if (tmp != this.cell)
 *     {
 *       if (this.cell != null)
 *       {
 *         this.dragLeave(me.getEvent(), this.cell);
 *       }
 *       
 *       this.cell = tmp;
 *       
 *       if (this.cell != null)
 *       {
 *         this.dragEnter(me.getEvent(), this.cell);
 *       }
 *     }
 *     
 *     if (this.cell != null)
 *     {
 *       this.dragOver(me.getEvent(), this.cell);
 *     }
 *   },
 *   mouseUp: function(sender, me) { },
 *   dragEnter: function(evt, cell)
 *   {
 *     mxLog.debug('dragEnter', cell.value);
 *   },
 *   dragOver: function(evt, cell)
 *   {
 *     mxLog.debug('dragOver', cell.value);
 *   },
 *   dragLeave: function(evt, cell)
 *   {
 *     mxLog.debug('dragLeave', cell.value);
 *   }
 * });
 * (end)
 * 
 * Constructor: mxCellTracker
 * 
 * Constructs an event handler that highlights cells.
 * 
 * Parameters:
 * 
 * graph - Reference to the enclosing <mxGraph>.
 * color - Color of the highlight. Default is blue.
 * funct - Optional JavaScript function that is used to override
 * <mxCellMarker.getCell>.
 */
function mxCellTracker(graph, color, funct)
{
	mxCellMarker.call(this, graph, color);

	this.graph.addMouseListener(this);
	
	if (funct != null)
	{
		this.getCell = funct;
	}
	
	// Automatic deallocation of memory
	if (mxClient.IS_IE)
	{
		mxEvent.addListener(window, 'unload', mxUtils.bind(this, function()
		{
			this.destroy();
		}));
	}
};

/**
 * Extends mxCellMarker.
 */
mxUtils.extend(mxCellTracker, mxCellMarker);

/**
 * Function: mouseDown
 * 
 * Ignores the event. The event is not consumed.
 */
mxCellTracker.prototype.mouseDown = function(sender, me) { };

/**
 * Function: mouseMove
 * 
 * Handles the event by highlighting the cell under the mousepointer if it
 * is over the hotspot region of the cell.
 */
mxCellTracker.prototype.mouseMove = function(sender, me)
{
	if (this.isEnabled())
	{
		this.process(me);
	}
};

/**
 * Function: mouseUp
 * 
 * Handles the event by reseting the highlight.
 */
mxCellTracker.prototype.mouseUp = function(sender, me) { };

/**
 * Function: destroy
 * 
 * Destroys the object and all its resources and DOM nodes. This doesn't
 * normally need to be called. It is called automatically when the window
 * unloads.
 */
mxCellTracker.prototype.destroy = function()
{
	if (!this.destroyed)
	{
		this.destroyed = true;

		this.graph.removeMouseListener(this);
		mxCellMarker.prototype.destroy.apply(this);
	}
};
