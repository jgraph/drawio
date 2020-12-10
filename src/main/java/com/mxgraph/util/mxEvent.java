/**
 * Copyright (c) 2007, Gaudenz Alder
 */
package com.mxgraph.util;

/**
 * Contains all global constants.
 */
public class mxEvent
{
	
	/**
	 * 
	 */
	public static final String DONE = "done";

	/**
	 * 
	 */
	public static final String ADD_CELLS = "addCells";

	/**
	 * 
	 */
	public static final String CELLS_ADDED = "cellsAdded";

	/**
	 * 
	 */
	public static final String ALIGN_CELLS = "alignCells";

	/**
	 * 
	 */
	public static final String CONNECT_CELL = "connectCell";

	/**
	 * 
	 */
	public static final String CONNECT = "connect";

	/**
	 * 
	 */
	public static final String CELL_CONNECTED = "cellConnected";

	/**
	 * 
	 */
	public static final String FLIP_EDGE = "flipEdge";

	/**
	 * 
	 */
	public static final String FOLD_CELLS = "foldCells";

	/**
	 * 
	 */
	public static final String CELLS_FOLDED = "cellsFolded";

	/**
	 * 
	 */
	public static final String GROUP_CELLS = "groupCells";

	/**
	 * 
	 */
	public static final String UNGROUP_CELLS = "ungroupCells";

	/**
	 * 
	 */
	public static final String REMOVE_CELLS_FROM_PARENT = "removeCellsFromParent";

	/**
	 * 
	 */
	public static final String MOVE_CELLS = "moveCells";

	/**
	 * 
	 */
	public static final String CELLS_MOVED = "cellsMoved";

	/**
	 * 
	 */
	public static final String ORDER_CELLS = "orderCells";

	/**
	 * 
	 */
	public static final String CELLS_ORDERED = "cellsOrdered";

	/**
	 * 
	 */
	public static final String REMOVE_CELLS = "removeCells";

	/**
	 * 
	 */
	public static final String CELLS_REMOVED = "cellsRemoved";

	/**
	 * 
	 */
	public static final String REPAINT = "repaint";

	/**
	 * 
	 */
	public static final String RESIZE_CELLS = "resizeCells";

	/**
	 * 
	 */
	public static final String CELLS_RESIZED = "cellsResized";

	/**
	 * 
	 */
	public static final String SPLIT_EDGE = "splitEdge";

	/**
	 * 
	 */
	public static final String TOGGLE_CELLS = "toggleCells";

	/**
	 * 
	 */
	public static final String CELLS_TOGGLED = "cellsToggled";

	/**
	 * 
	 */
	public static final String UPDATE_CELL_SIZE = "updateCellSize";

	/**
	 * 
	 */
	public static final String LABEL_CHANGED = "labelChanged";

	/**
	 * 
	 */
	public static final String ADD_OVERLAY = "addOverlay";

	/**
	 * 
	 */
	public static final String REMOVE_OVERLAY = "removeOverlay";

	/**
	 * 
	 */
	public static final String BEFORE_PAINT = "beforePaint";

	/**
	 * 
	 */
	public static final String PAINT = "paint";

	/**
	 * 
	 */
	public static final String AFTER_PAINT = "afterPaint";

	/**
	 * 
	 */
	public static final String START_EDITING = "startEditing";

	/**
	 * 
	 */
	public static final String UNDO = "undo";

	/**
	 * 
	 */
	public static final String REDO = "redo";

	/**
	 * 
	 */
	public static final String UP = "up";

	/**
	 * 
	 */
	public static final String DOWN = "down";

	/**
	 * 
	 */
	public static final String SCALE = "scale";

	/**
	 * 
	 */
	public static final String TRANSLATE = "translate";

	/**
	 * 
	 */
	public static final String SCALE_AND_TRANSLATE = "scaleAndTranslate";

	/**
	 * Holds the name for the change event. First and only argument in the
	 * argument array is the list of mxAtomicGraphChanges that have been
	 * executed on the model.
	 */
	public static final String CHANGE = "change";

	/**
	 * Holds the name for the execute event. First and only argument in the
	 * argument array is the mxAtomicGraphChange that has been executed on the 
	 * model. This event fires before the change event.
	 */
	public static final String EXECUTE = "execute";

	/**
	 * Holds the name for the beforeUndo event. First and only argument in the
	 * argument array is the current edit that is currently in progress in the 
	 * model. This event fires before notify is called on the currentEdit in
	 * the model.
	 */
	public static final String BEFORE_UNDO = "beforeUndo";

	/**
	 * Holds the name for the norify event. First and only argument in the
	 * argument array is the list of mxAtomicGraphChanges that have been
	 * executed on the model. This event fires after the change event.
	 */
	public static final String NOTIFY = "notify";

	/**
	 * Holds the name for the beginUpdate event. This event has no arguments and
	 * fires after the updateLevel has been changed in model.
	 */
	public static final String BEGIN_UPDATE = "beginUpdate";

	/**
	 * Holds the name for the endUpdate event. This event has no arguments and fires
	 * after the updateLevel has been changed in the model. First argument is the
	 * currentEdit.
	 */
	public static final String END_UPDATE = "endUpdate";

	/**
	 * 
	 */
	public static final String INSERT = "insert";

	/**
	 * 
	 */
	public static final String ADD = "add";

	/**
	 * 
	 */
	public static final String CLEAR = "clear";

	/**
	 * 
	 */
	public static final String FIRED = "fired";

	/**
	 * 
	 */
	public static final String SELECT = "select";

	/**
	 * Holds the name for the mark event, which fires after a cell has been
	 * marked. First and only argument in the array is the cell state that has
	 * been marked or null, if no state has been marked.
	 * 
	 * To add a mark listener to the cell marker:
	 * 
	 * <code>
	 * addListener(
	 *   mxEvent.MARK, new mxEventListener()
	 *   {
	 *     public void invoke(Object source, Object[] args)
	 *     {
	 *       cellMarked((mxCellMarker) source, (mxCellState) args[0]);
	 *     }
	 *   });
	 * </code>
	 */
	public static String MARK = "mark";

	/**
	 * 
	 */
	public static String ROOT = "root";

	/**
	 * 
	 */
	public static String LAYOUT_CELLS = "layoutCells";

	/**
	 * 
	 */
	public static String START = "start";

	/**
	 * 
	 */
	public static String CONTINUE = "continue";

	/**
	 * 
	 */
	public static String STOP = "stop";

}
