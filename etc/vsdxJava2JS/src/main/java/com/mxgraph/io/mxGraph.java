/**
 * Copyright (c) 2007, Gaudenz Alder
 */
package com.mxgraph.io;

import java.awt.Graphics;
import java.awt.Point;
import java.awt.Rectangle;
import java.awt.Shape;
import java.beans.PropertyChangeListener;
import java.beans.PropertyChangeSupport;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collection;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Hashtable;
import java.util.Iterator;
import java.util.LinkedHashSet;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.w3c.dom.Element;

import com.mxgraph.io.vsdx.ShapePageId;
import com.mxgraph.io.vsdx.mxCell;
import com.mxgraph.io.vsdx.mxGeometry;
import com.mxgraph.io.vsdx.mxPoint;
import com.mxgraph.io.vsdx.mxRectangle;

/**
 * Implements a graph object that allows to create diagrams from a graph model
 * and stylesheet.
 * 
 * <h3>Images</h3>
 * To create an image from a graph, use the following code for a given
 * XML document (doc) and File (file):
 * 
 * <code>
 * Image img = mxCellRenderer.createBufferedImage(
 * 		graph, null, 1, Color.WHITE, false, null);
 * ImageIO.write(img, "png", file);
 * </code>
 * 
 * If the XML is given as a string rather than a document, the document can
 * be obtained using mxUtils.parse.
 * 
 * This class fires the following events:
 * 
 * mxEvent.ROOT fires if the root in the model has changed. This event has no
 * properties.
 * 
 * mxEvent.ALIGN_CELLS fires between begin- and endUpdate in alignCells. The
 * <code>cells</code> and <code>align</code> properties contain the respective
 * arguments that were passed to alignCells.
 * 
 * mxEvent.FLIP_EDGE fires between begin- and endUpdate in flipEdge. The
 * <code>edge</code> property contains the edge passed to flipEdge.
 * 
 * mxEvent.ORDER_CELLS fires between begin- and endUpdate in orderCells. The
 * <code>cells</code> and <code>back</code> properties contain the respective
 * arguments that were passed to orderCells.
 *
 * mxEvent.CELLS_ORDERED fires between begin- and endUpdate in cellsOrdered.
 * The <code>cells</code> and <code>back</code> arguments contain the
 * respective arguments that were passed to cellsOrdered.
 * 
 * mxEvent.GROUP_CELLS fires between begin- and endUpdate in groupCells. The
 * <code>group</code>, <code>cells</code> and <code>border</code> arguments
 * contain the respective arguments that were passed to groupCells.
 * 
 * mxEvent.UNGROUP_CELLS fires between begin- and endUpdate in ungroupCells.
 * The <code>cells</code> property contains the array of cells that was passed
 * to ungroupCells.
 * 
 * mxEvent.REMOVE_CELLS_FROM_PARENT fires between begin- and endUpdate in
 * removeCellsFromParent. The <code>cells</code> property contains the array of
 * cells that was passed to removeCellsFromParent.
 * 
 * mxEvent.ADD_CELLS fires between begin- and endUpdate in addCells. The
 * <code>cells</code>, <code>parent</code>, <code>index</code>,
 * <code>source</code> and <code>target</code> properties contain the
 * respective arguments that were passed to addCells.
 * 
 * mxEvent.CELLS_ADDED fires between begin- and endUpdate in cellsAdded. The
 * <code>cells</code>, <code>parent</code>, <code>index</code>,
 * <code>source</code>, <code>target</code> and <code>absolute</code>
 * properties contain the respective arguments that were passed to cellsAdded.
 * 
 * mxEvent.REMOVE_CELLS fires between begin- and endUpdate in removeCells. The
 * <code>cells</code> and <code>includeEdges</code> arguments contain the
 * respective arguments that were passed to removeCells.
 * 
 * mxEvent.CELLS_REMOVED fires between begin- and endUpdate in cellsRemoved.
 * The <code>cells</code> argument contains the array of cells that was
 * removed.
 * 
 * mxEvent.SPLIT_EDGE fires between begin- and endUpdate in splitEdge. The
 * <code>edge</code> property contains the edge to be splitted, the
 * <code>cells</code>, <code>newEdge</code>, <code>dx</code> and
 * <code>dy</code> properties contain the respective arguments that were passed
 * to splitEdge.
 * 
 * mxEvent.TOGGLE_CELLS fires between begin- and endUpdate in toggleCells. The
 * <code>show</code>, <code>cells</code> and <code>includeEdges</code>
 * properties contain the respective arguments that were passed to toggleCells.
 * 
 * mxEvent.FOLD_CELLS fires between begin- and endUpdate in foldCells. The
 * <code>collapse</code>, <code>cells</code> and <code>recurse</code>
 * properties contain the respective arguments that were passed to foldCells.
 * 
 * mxEvent.CELLS_FOLDED fires between begin- and endUpdate in cellsFolded. The
 * <code>collapse</code>, <code>cells</code> and <code>recurse</code>
 * properties contain the respective arguments that were passed to cellsFolded.
 * 
 * mxEvent.UPDATE_CELL_SIZE fires between begin- and endUpdate in
 * updateCellSize. The <code>cell</code> and <code>ignoreChildren</code>
 * properties contain the respective arguments that were passed to
 * updateCellSize.
 * 
 * mxEvent.RESIZE_CELLS fires between begin- and endUpdate in resizeCells. The
 * <code>cells</code> and <code>bounds</code> properties contain the respective
 * arguments that were passed to resizeCells.
 * 
 * mxEvent.CELLS_RESIZED fires between begin- and endUpdate in cellsResized.
 * The <code>cells</code> and <code>bounds</code> properties contain the
 * respective arguments that were passed to cellsResized.
 * 
 * mxEvent.MOVE_CELLS fires between begin- and endUpdate in moveCells. The
 * <code>cells</code>, <code>dx</code>, <code>dy</code>, <code>clone</code>,
 * <code>target</code> and <code>location</code> properties contain the
 * respective arguments that were passed to moveCells.
 * 
 * mxEvent.CELLS_MOVED fires between begin- and endUpdate in cellsMoved. The
 * <code>cells</code>, <code>dx</code>, <code>dy</code> and
 * <code>disconnect</code> properties contain the respective arguments that
 * were passed to cellsMoved.
 * 
 * mxEvent.CONNECT_CELL fires between begin- and endUpdate in connectCell. The
 * <code>edge</code>, <code>terminal</code> and <code>source</code> properties
 * contain the respective arguments that were passed to connectCell.
 * 
 * mxEvent.CELL_CONNECTED fires between begin- and endUpdate in cellConnected.
 * The <code>edge</code>, <code>terminal</code> and <code>source</code>
 * properties contain the respective arguments that were passed to
 * cellConnected.
 * 
 * mxEvent.REPAINT fires if a repaint was requested by calling repaint. The
 * <code>region</code> property contains the optional mxRectangle that was
 * passed to repaint to define the dirty region.
 */
public class mxGraph 
{


	/**
	 * Holds the version number of this release. Current version
	 * is @MXGRAPH-VERSION@.
	 */
	public static final String VERSION = "@MXGRAPH-VERSION@";
class Model {
	public mxGeometry getGeometry(Object cellParent) {
		return new mxGeometry(); 
	}

	public void beginUpdate() {
		// TODO Auto-generated method stub
		
	}

	public void setValue(Object defaultParent, String pageName) {
		// TODO Auto-generated method stub
		
	}

	public Object getRoot() {
		// TODO Auto-generated method stub
		return null;
	}

	public HashMap<ShapePageId, mxCell> getCells() {
		// TODO Auto-generated method stub
		return null;
	}

	public boolean isEdge(Object c) {
		// TODO Auto-generated method stub
		return false;
	}

	public void endUpdate() {
		// TODO Auto-generated method stub
		
	}

	public void setMaintainEdgeParent(boolean b) {
		// TODO Auto-generated method stub
		
	}

	public int getChildCount(Object parent) {
		// TODO Auto-generated method stub
		return 0;
	}

	public String getStyle(Object parent) {
		// TODO Auto-generated method stub
		return null;
	}

	public Object getChildAt(Object cell, int i) {
		// TODO Auto-generated method stub
		return null;
	}

	public void remove(Object removeChild) {
		// TODO Auto-generated method stub
		
	}

	public char[] getValue(Object cell) {
		// TODO Auto-generated method stub
		return null;
	}

	public boolean isVertex(Object cell) {
		// TODO Auto-generated method stub
		return false;
	}

	public Object getParent(Object c) {
		// TODO Auto-generated method stub
		return null;
	}
}
	public Model getModel() {
		// TODO Auto-generated method stub
		return new Model();
	}
	public Object getDefaultParent() {
		// TODO Auto-generated method stub
		return null;
	}
	public void addCell(Object backCell, Object root, int i, Object object, Object object2) {
		// TODO Auto-generated method stub
		
	}
	public void setExtendParents(boolean b) {
		// TODO Auto-generated method stub
		
	}
	public void setExtendParentsOnAdd(boolean b) {
		// TODO Auto-generated method stub
		
	}
	public void setConstrainChildren(boolean b) {
		// TODO Auto-generated method stub
		
	}
	public void setHtmlLabels(boolean b) {
		// TODO Auto-generated method stub
		
	}
	public mxCell insertVertex(Object parent, Object object, Object object2, long l, long m, long n, long o,
			String style) {
		// TODO Auto-generated method stub
		return null;
	}
	public mxCell insertVertex(Object parent, Object object, Object object2, long l, long m, int i, int j) {
		// TODO Auto-generated method stub
		return null;
	}
	public Object insertEdge(Object parent, Object object, Object object2, mxCell source, mxCell target,
			String styleString) {
		// TODO Auto-generated method stub
		return null;
	}
	public Object getView() {
		// TODO Auto-generated method stub
		return null;
	}
	public Object createEdge(Object parent, Object object, Object object2, Object object3, Object object4,
			String styleString) {
		// TODO Auto-generated method stub
		return null;
	}
	public Object addEdge(Object edge, Object parent, Object object, Object object2, int shapeIndex) {
		// TODO Auto-generated method stub
		return null;
	}

//	/**
//	 * 
//	 */
//	public interface mxICellVisitor
//	{
//
//		/**
//		 * 
//		 * @param vertex
//		 * @param edge
//		 */
//		boolean visit(Object vertex, Object edge);
//
//	}
//
//	/**
//	 * Property change event handling.
//	 */
//	protected PropertyChangeSupport changeSupport = new PropertyChangeSupport(
//			this);
//
//	/**
//	 * Holds the model that contains the cells to be displayed.
//	 */
//	protected Object model;
//
//	/**
//	 * Holds the view that caches the cell states.
//	 */
//
//	/**
//	 * Specifies the grid size. Default is 10.
//	 */
//	protected int gridSize = 10;
//
//	/**
//	 * Specifies if the grid is enabled. Default is true.
//	 */
//	protected boolean gridEnabled = true;
//
//	/**
//	 * Specifies if ports are enabled. This is used in <cellConnected> to update
//	 * the respective style. Default is true.
//	 */
//	protected boolean portsEnabled = true;
//
//	/**
//	 * Value returned by getOverlap if isAllowOverlapParent returns
//	 * true for the given cell. getOverlap is used in keepInside if
//	 * isKeepInsideParentOnMove returns true. The value specifies the
//	 * portion of the child which is allowed to overlap the parent.
//	 */
//	protected double defaultOverlap = 0.5;
//
//	/**
//	 * Specifies the default parent to be used to insert new cells.
//	 * This is used in getDefaultParent. Default is null.
//	 */
//	protected Object defaultParent;
//
//	/**
//	 * Specifies the alternate edge style to be used if the main control point
//	 * on an edge is being doubleclicked. Default is null.
//	 */
//	protected String alternateEdgeStyle;
//
//	/**
//	 * Specifies the return value for isEnabled. Default is true.
//	 */
//	protected boolean enabled = true;
//
//	/**
//	 * Specifies the return value for isCell(s)Locked. Default is false.
//	 */
//	protected boolean cellsLocked = false;
//
//	/**
//	 * Specifies the return value for isCell(s)Editable. Default is true.
//	 */
//	protected boolean cellsEditable = true;
//
//	/**
//	 * Specifies the return value for isCell(s)Sizable. Default is true.
//	 */
//	protected boolean cellsResizable = true;
//
//	/**
//	 * Specifies the return value for isCell(s)Movable. Default is true.
//	 */
//	protected boolean cellsMovable = true;
//
//	/**
//	 * Specifies the return value for isCell(s)Bendable. Default is true.
//	 */
//	protected boolean cellsBendable = true;
//
//	/**
//	 * Specifies the return value for isCell(s)Selectable. Default is true.
//	 */
//	protected boolean cellsSelectable = true;
//
//	/**
//	 * Specifies the return value for isCell(s)Deletable. Default is true.
//	 */
//	protected boolean cellsDeletable = true;
//
//	/**
//	 * Specifies the return value for isCell(s)Cloneable. Default is true.
//	 */
//	protected boolean cellsCloneable = true;
//
//	/**
//	 * Specifies the return value for isCellDisconntableFromTerminal. Default
//	 * is true.
//	 */
//	protected boolean cellsDisconnectable = true;
//
//	/**
//	 * Specifies the return value for isLabel(s)Clipped. Default is false.
//	 */
//	protected boolean labelsClipped = false;
//
//	/**
//	 * Specifies the return value for edges in isLabelMovable. Default is true.
//	 */
//	protected boolean edgeLabelsMovable = true;
//
//	/**
//	 * Specifies the return value for vertices in isLabelMovable. Default is false.
//	 */
//	protected boolean vertexLabelsMovable = false;
//
//	/**
//	 * Specifies the return value for isDropEnabled. Default is true.
//	 */
//	protected boolean dropEnabled = true;
//
//	/**
//	 * Specifies if dropping onto edges should be enabled. Default is true.
//	 */
//	protected boolean splitEnabled = true;
//
//	/**
//	 * Specifies if the graph should automatically update the cell size
//	 * after an edit. This is used in isAutoSizeCell. Default is false.
//	 */
//	protected boolean autoSizeCells = false;
//
//	/**
//	 * <mxRectangle> that specifies the area in which all cells in the
//	 * diagram should be placed. Uses in getMaximumGraphBounds. Use a width
//	 * or height of 0 if you only want to give a upper, left corner.
//	 */
//	protected mxRectangle maximumGraphBounds = null;
//
//	/**
//	 * mxRectangle that specifies the minimum size of the graph canvas inside
//	 * the scrollpane.
//	 */
//	protected mxRectangle minimumGraphSize = null;
//
//	/**
//	 * Border to be added to the bottom and right side when the container is
//	 * being resized after the graph has been changed. Default is 0.
//	 */
//	protected int border = 0;
//
//	/**
//	 * Specifies if edges should appear in the foreground regardless of their
//	 * order in the model. This has precendence over keepEdgeInBackground
//	 * Default is false.
//	 */
//	protected boolean keepEdgesInForeground = false;
//
//	/**
//	 * Specifies if edges should appear in the background regardless of their
//	 * order in the model. Default is false.
//	 */
//	protected boolean keepEdgesInBackground = false;
//
//	/**
//	 * Specifies if the cell size should be changed to the preferred size when
//	 * a cell is first collapsed. Default is true.
//	 */
//	protected boolean collapseToPreferredSize = true;
//
//	/**
//	 * Specifies if negative coordinates for vertices are allowed. Default is true.
//	 */
//	protected boolean allowNegativeCoordinates = true;
//
//	/**
//	 * Specifies the return value for isConstrainChildren. Default is true.
//	 */
//	protected boolean constrainChildren = true;
//
//	/**
//	 * Specifies if a parent should contain the child bounds after a resize of
//	 * the child. Default is true.
//	 */
//	protected boolean extendParents = true;
//
//	/**
//	 * Specifies if parents should be extended according to the <extendParents>
//	 * switch if cells are added. Default is true.
//	 */
//	protected boolean extendParentsOnAdd = true;
//
//	/**
//	 * Specifies if the scale and translate should be reset if
//	 * the root changes in the model. Default is true.
//	 */
//	protected boolean resetViewOnRootChange = true;
//
//	/**
//	 * Specifies if loops (aka self-references) are allowed.
//	 * Default is false.
//	 */
//	protected boolean resetEdgesOnResize = false;
//
//	/**
//	 * Specifies if edge control points should be reset after
//	 * the move of a connected cell. Default is false.
//	 */
//	protected boolean resetEdgesOnMove = false;
//
//	/**
//	 * Specifies if edge control points should be reset after
//	 * the the edge has been reconnected. Default is true.
//	 */
//	protected boolean resetEdgesOnConnect = true;
//
//	/**
//	 * Specifies if loops (aka self-references) are allowed.
//	 * Default is false.
//	 */
//	protected boolean allowLoops = false;
//
//	/**
//	 * Specifies the multiplicities to be used for validation of the graph.
//	 */
//
//	/**
//	 * Specifies if multiple edges in the same direction between
//	 * the same pair of vertices are allowed. Default is true.
//	 */
//	protected boolean multigraph = true;
//
//	/**
//	 * Specifies if edges are connectable. Default is false.
//	 * This overrides the connectable field in edges.
//	 */
//	protected boolean connectableEdges = false;
//
//	/**
//	 * Specifies if edges with disconnected terminals are
//	 * allowed in the graph. Default is false.
//	 */
//	protected boolean allowDanglingEdges = true;
//
//	/**
//	 * Specifies if edges that are cloned should be validated and only inserted
//	 * if they are valid. Default is true.
//	 */
//	protected boolean cloneInvalidEdges = false;
//
//	/**
//	 * Specifies if edges should be disconnected from their terminals when they
//	 * are moved. Default is true.
//	 */
//	protected boolean disconnectOnMove = true;
//
//	/**
//	 * Specifies if labels should be visible. This is used in
//	 * getLabel. Default is true.
//	 */
//	protected boolean labelsVisible = true;
//
//	/**
//	 * Specifies the return value for isHtmlLabel. Default is false.
//	 */
//	protected boolean htmlLabels = false;
//
//	/**
//	 * Specifies if nesting of swimlanes is allowed. Default is true.
//	 */
//	protected boolean swimlaneNesting = true;
//
//	/**
//	 * Specifies the maximum number of changes that should be processed to find
//	 * the dirty region. If the number of changes is larger, then the complete
//	 * grah is repainted. A value of zero will always compute the dirty region
//	 * for any number of changes. Default is 1000.
//	 */
//	protected int changesRepaintThreshold = 1000;
//
//	/**
//	 * Specifies if the origin should be automatically updated. 
//	 */
//	protected boolean autoOrigin = false;
//
//	/**
//	 * Holds the current automatic origin.
//	 */
//	protected mxPoint origin = new mxPoint();
//
//	/**
//	 * Holds the list of bundles.
//	 */
//
//	/**
//	 * Constructs a new graph with an empty
//	 * {@link com.mxgraph.model.mxGraphModel}.
//	 */
//	public mxGraph()
//	{
//	}
//
//	/**
//	 * Constructs a new graph for the specified model. If no model is
//	 * specified, then a new, empty {@link com.mxgraph.model.mxGraphModel} is
//	 * used.
//	 * 
//	 * @param model Model that contains the graph data
//	 */
//
//	/**
//	 * Constructs a new graph for the specified model. If no model is
//	 * specified, then a new, empty {@link com.mxgraph.model.mxGraphModel} is
//	 * used.
//	 * 
//	 * @param stylesheet The stylesheet to use for the graph.
//	 */
//
//	/**
//	 * Constructs a new graph for the specified model. If no model is
//	 * specified, then a new, empty {@link com.mxgraph.model.mxGraphModel} is
//	 * used.
//	 * 
//	 * @param model Model that contains the graph data
//	 */
//	/**
//	 * Returns cellsLocked, the default return value for isCellLocked.
//	 */
//	public boolean isCellsLocked()
//	{
//		return cellsLocked;
//	}
//
//	/**
//	 * Sets cellsLocked, the default return value for isCellLocked and fires a
//	 * property change event for cellsLocked.
//	 */
//	public void setCellsLocked(boolean value)
//	{
//		boolean oldValue = cellsLocked;
//		cellsLocked = value;
//
//		changeSupport.firePropertyChange("cellsLocked", oldValue, cellsLocked);
//	}
//
//	/**
//	 * Returns true if the given cell is movable. This implementation returns editable.
//	 * 
//	 * @param cell Cell whose editable state should be returned.
//	 * @return Returns true if the cell is editable.
//	 */
//	public boolean isCellEditable(Object cell)
//	{
//		mxCellState state = view.getState(cell);
//		Map<String, Object> style = (state != null) ? state.getStyle()
//				: getCellStyle(cell);
//
//		return isCellsEditable() && !isCellLocked(cell)
//				&& mxUtils.isTrue(style, mxConstants.STYLE_EDITABLE, true);
//	}
//
//	/**
//	 * Returns true if editing is allowed in this graph.
//	 * 
//	 * @return Returns true if the graph is editable.
//	 */
//	public boolean isCellsEditable()
//	{
//		return cellsEditable;
//	}
//
//	/**
//	 * Sets if the graph is editable.
//	 */
//	public void setCellsEditable(boolean value)
//	{
//		boolean oldValue = cellsEditable;
//		cellsEditable = value;
//
//		changeSupport.firePropertyChange("cellsEditable", oldValue,
//				cellsEditable);
//	}
//
//	/**
//	 * Returns true if the given cell is resizable. This implementation returns
//	 * cellsSizable for all cells.
//	 * 
//	 * @param cell Cell whose resizable state should be returned.
//	 * @return Returns true if the cell is sizable.
//	 */
//	public boolean isCellResizable(Object cell)
//	{
//		mxCellState state = view.getState(cell);
//		Map<String, Object> style = (state != null) ? state.getStyle()
//				: getCellStyle(cell);
//
//		return isCellsResizable() && !isCellLocked(cell)
//				&& mxUtils.isTrue(style, mxConstants.STYLE_RESIZABLE, true);
//	}
//
//	/**
//	 * Returns true if the given cell is resizable. This implementation return sizable.
//	 */
//	public boolean isCellsResizable()
//	{
//		return cellsResizable;
//	}
//
//	/**
//	 * Sets if the graph is resizable.
//	 */
//	public void setCellsResizable(boolean value)
//	{
//		boolean oldValue = cellsResizable;
//		cellsResizable = value;
//
//		changeSupport.firePropertyChange("cellsResizable", oldValue,
//				cellsResizable);
//	}
//
//	/**
//	 * Returns the cells which are movable in the given array of cells.
//	 */
//	public Object[] getMovableCells(Object[] cells)
//	{
//		return mxGraphModel.filterCells(cells, new Filter()
//		{
//			public boolean filter(Object cell)
//			{
//				return isCellMovable(cell);
//			}
//		});
//	}
//
//	/**
//	 * Returns true if the given cell is movable. This implementation
//	 * returns movable.
//	 * 
//	 * @param cell Cell whose movable state should be returned.
//	 * @return Returns true if the cell is movable.
//	 */
//	public boolean isCellMovable(Object cell)
//	{
//		mxCellState state = view.getState(cell);
//		Map<String, Object> style = (state != null) ? state.getStyle()
//				: getCellStyle(cell);
//
//		return isCellsMovable() && !isCellLocked(cell)
//				&& mxUtils.isTrue(style, mxConstants.STYLE_MOVABLE, true);
//	}
//
//	/**
//	 * Returns cellsMovable.
//	 */
//	public boolean isCellsMovable()
//	{
//		return cellsMovable;
//	}
//
//	/**
//	 * Sets cellsMovable.
//	 */
//	public void setCellsMovable(boolean value)
//	{
//		boolean oldValue = cellsMovable;
//		cellsMovable = value;
//
//		changeSupport
//				.firePropertyChange("cellsMovable", oldValue, cellsMovable);
//	}
//
//	/**
//	 * Function: isTerminalPointMovable
//	 *
//	 * Returns true if the given terminal point is movable. This is independent
//	 * from isCellConnectable and isCellDisconnectable and controls if terminal
//	 * points can be moved in the graph if the edge is not connected. Note that
//	 * it is required for this to return true to connect unconnected edges.
//	 * This implementation returns true.
//	 * 
//	 * @param cell Cell whose terminal point should be moved.
//	 * @param source Boolean indicating if the source or target terminal should be moved.
//	 */
//	public boolean isTerminalPointMovable(Object cell, boolean source)
//	{
//		return true;
//	}
//
//	/**
//	 * Returns true if the given cell is bendable. This implementation returns
//	 * bendable. This is used in mxElbowEdgeHandler to determine if the middle
//	 * handle should be shown.
//	 * 
//	 * @param cell Cell whose bendable state should be returned.
//	 * @return Returns true if the cell is bendable.
//	 */
//	public boolean isCellBendable(Object cell)
//	{
//		mxCellState state = view.getState(cell);
//		Map<String, Object> style = (state != null) ? state.getStyle()
//				: getCellStyle(cell);
//
//		return isCellsBendable() && !isCellLocked(cell)
//				&& mxUtils.isTrue(style, mxConstants.STYLE_BENDABLE, true);
//	}
//
//	/**
//	 * Returns cellsBendable.
//	 */
//	public boolean isCellsBendable()
//	{
//		return cellsBendable;
//	}
//
//	/**
//	 * Sets cellsBendable.
//	 */
//	public void setCellsBendable(boolean value)
//	{
//		boolean oldValue = cellsBendable;
//		cellsBendable = value;
//
//		changeSupport.firePropertyChange("cellsBendable", oldValue,
//				cellsBendable);
//	}
//
//	/**
//	 * Returns true if the given cell is selectable. This implementation returns
//	 * <selectable>.
//	 * 
//	 * @param cell <mxCell> whose selectable state should be returned.
//	 * @return Returns true if the given cell is selectable.
//	 */
//	public boolean isCellSelectable(Object cell)
//	{
//		return isCellsSelectable();
//	}
//
//	/**
//	 * Returns cellsSelectable.
//	 */
//	public boolean isCellsSelectable()
//	{
//		return cellsSelectable;
//	}
//
//	/**
//	 * Sets cellsSelectable.
//	 */
//	public void setCellsSelectable(boolean value)
//	{
//		boolean oldValue = cellsSelectable;
//		cellsSelectable = value;
//
//		changeSupport.firePropertyChange("cellsSelectable", oldValue,
//				cellsSelectable);
//	}
//
//	/**
//	 * Returns the cells which are movable in the given array of cells.
//	 */
//	public Object[] getDeletableCells(Object[] cells)
//	{
//		return mxGraphModel.filterCells(cells, new Filter()
//		{
//			public boolean filter(Object cell)
//			{
//				return isCellDeletable(cell);
//			}
//		});
//	}
//
//	/**
//	 * Returns true if the given cell is movable. This implementation always
//	 * returns true.
//	 * 
//	 * @param cell Cell whose movable state should be returned.
//	 * @return Returns true if the cell is movable.
//	 */
//	public boolean isCellDeletable(Object cell)
//	{
//		mxCellState state = view.getState(cell);
//		Map<String, Object> style = (state != null) ? state.getStyle()
//				: getCellStyle(cell);
//
//		return isCellsDeletable()
//				&& mxUtils.isTrue(style, mxConstants.STYLE_DELETABLE, true);
//	}
//
//	/**
//	 * Returns cellsDeletable.
//	 */
//	public boolean isCellsDeletable()
//	{
//		return cellsDeletable;
//	}
//
//	/**
//	 * Sets cellsDeletable.
//	 */
//	public void setCellsDeletable(boolean value)
//	{
//		boolean oldValue = cellsDeletable;
//		cellsDeletable = value;
//
//		changeSupport.firePropertyChange("cellsDeletable", oldValue,
//				cellsDeletable);
//	}
//
//	/**
//	 * Returns the cells which are movable in the given array of cells.
//	 */
//	public Object[] getCloneableCells(Object[] cells)
//	{
//		return mxGraphModel.filterCells(cells, new Filter()
//		{
//			public boolean filter(Object cell)
//			{
//				return isCellCloneable(cell);
//			}
//		});
//	}
//
//	/**
//	 * Returns the constant true. This does not use the cloneable field to
//	 * return a value for a given cell, it is simply a hook for subclassers
//	 * to disallow cloning of individual cells.
//	 */
//	public boolean isCellCloneable(Object cell)
//	{
//		mxCellState state = view.getState(cell);
//		Map<String, Object> style = (state != null) ? state.getStyle()
//				: getCellStyle(cell);
//
//		return isCellsCloneable()
//				&& mxUtils.isTrue(style, mxConstants.STYLE_CLONEABLE, true);
//	}
//
//	/**
//	 * Returns cellsCloneable.
//	 */
//	public boolean isCellsCloneable()
//	{
//		return cellsCloneable;
//	}
//
//	/**
//	 * Specifies if the graph should allow cloning of cells by holding down the
//	 * control key while cells are being moved. This implementation updates
//	 * cellsCloneable.
//	 *
//	 * @param value Boolean indicating if the graph should be cloneable.
//	 */
//	public void setCellsCloneable(boolean value)
//	{
//		boolean oldValue = cellsCloneable;
//		cellsCloneable = value;
//
//		changeSupport.firePropertyChange("cellsCloneable", oldValue,
//				cellsCloneable);
//	}
//
//	/**
//	 * Returns true if the given cell is disconnectable from the source or
//	 * target terminal. This returns <disconnectable> for all given cells if
//	 * <isLocked> does not return true for the given cell.
//	 * 
//	 * @param cell <mxCell> whose disconnectable state should be returned.
//	 * @param terminal <mxCell> that represents the source or target terminal.
//	 * @param source Boolean indicating if the source or target terminal is to be
//	 * disconnected.
//	 * @return Returns true if the given edge can be disconnected from the given
//	 * terminal.
//	 */
//	public boolean isCellDisconnectable(Object cell, Object terminal,
//			boolean source)
//	{
//		return isCellsDisconnectable() && !isCellLocked(cell);
//	}
//
//	/**
//	 * Returns cellsDisconnectable.
//	 */
//	public boolean isCellsDisconnectable()
//	{
//		return cellsDisconnectable;
//	}
//
//	/**
//	 * Sets cellsDisconnectable.
//	 * 
//	 * @param value Boolean indicating if the graph should allow disconnecting of
//	 * edges.
//	 */
//	public void setCellsDisconnectable(boolean value)
//	{
//		boolean oldValue = cellsDisconnectable;
//		cellsDisconnectable = value;
//
//		changeSupport.firePropertyChange("cellsDisconnectable", oldValue,
//				cellsDisconnectable);
//	}
//
//	/**
//	 * Returns true if the overflow portion of labels should be hidden. If this
//	 * returns true then vertex labels will be clipped to the size of the vertices.
//	 * This implementation returns true if <mxConstants.STYLE_OVERFLOW> in the
//	 * style of the given cell is "hidden".
//	 * 
//	 * @param cell Cell whose label should be clipped.
//	 * @return Returns true if the cell label should be clipped.
//	 */
//	public boolean isLabelClipped(Object cell)
//	{
//		if (!isLabelsClipped())
//		{
//			mxCellState state = view.getState(cell);
//			Map<String, Object> style = (state != null) ? state.getStyle()
//					: getCellStyle(cell);
//
//			return (style != null) ? mxUtils.getString(style,
//					mxConstants.STYLE_OVERFLOW, "").equals("hidden") : false;
//		}
//
//		return isLabelsClipped();
//	}
//
//	/**
//	 * Returns labelsClipped.
//	 */
//	public boolean isLabelsClipped()
//	{
//		return labelsClipped;
//	}
//
//	/**
//	 * Sets labelsClipped.
//	 */
//	public void setLabelsClipped(boolean value)
//	{
//		boolean oldValue = labelsClipped;
//		labelsClipped = value;
//
//		changeSupport.firePropertyChange("labelsClipped", oldValue,
//				labelsClipped);
//	}
//
//	/**
//	 * Returns true if the given edges's label is moveable. This returns
//	 * <movable> for all given cells if <isLocked> does not return true
//	 * for the given cell.
//	 * 
//	 * @param cell <mxCell> whose label should be moved.
//	 * @return Returns true if the label of the given cell is movable.
//	 */
//	public boolean isLabelMovable(Object cell)
//	{
//		return !isCellLocked(cell)
//				&& ((model.isEdge(cell) && isEdgeLabelsMovable()) || (model
//						.isVertex(cell) && isVertexLabelsMovable()));
//	}
//
//	/**
//	 * Returns vertexLabelsMovable.
//	 */
//	public boolean isVertexLabelsMovable()
//	{
//		return vertexLabelsMovable;
//	}
//
//	/**
//	 * Sets vertexLabelsMovable.
//	 */
//	public void setVertexLabelsMovable(boolean value)
//	{
//		boolean oldValue = vertexLabelsMovable;
//		vertexLabelsMovable = value;
//
//		changeSupport.firePropertyChange("vertexLabelsMovable", oldValue,
//				vertexLabelsMovable);
//	}
//
//	/**
//	 * Returns edgeLabelsMovable.
//	 */
//	public boolean isEdgeLabelsMovable()
//	{
//		return edgeLabelsMovable;
//	}
//
//	/**
//	 * Returns edgeLabelsMovable.
//	 */
//	public void setEdgeLabelsMovable(boolean value)
//	{
//		boolean oldValue = edgeLabelsMovable;
//		edgeLabelsMovable = value;
//
//		changeSupport.firePropertyChange("edgeLabelsMovable", oldValue,
//				edgeLabelsMovable);
//	}
//
//	//
//	// Graph control options
//	//
//
//	/**
//	 * Returns true if the graph is <enabled>.
//	 * 
//	 * @return Returns true if the graph is enabled.
//	 */
//	public boolean isEnabled()
//	{
//		return enabled;
//	}
//
//	/**
//	 * Specifies if the graph should allow any interactions. This
//	 * implementation updates <enabled>.
//	 * 
//	 * @param value Boolean indicating if the graph should be enabled.
//	 */
//	public void setEnabled(boolean value)
//	{
//		boolean oldValue = enabled;
//		enabled = value;
//
//		changeSupport.firePropertyChange("enabled", oldValue, enabled);
//	}
//
//	/**
//	 * Returns true if the graph allows drop into other cells.
//	 */
//	public boolean isDropEnabled()
//	{
//		return dropEnabled;
//	}
//
//	/**
//	 * Sets dropEnabled.
//	 */
//	public void setDropEnabled(boolean value)
//	{
//		boolean oldValue = dropEnabled;
//		dropEnabled = value;
//
//		changeSupport.firePropertyChange("dropEnabled", oldValue, dropEnabled);
//	}
//
//	/**
//	 * Affects the return values of isValidDropTarget to allow for edges as
//	 * drop targets. The splitEdge method is called in mxGraphHandler if
//	 * mxGraphComponent.isSplitEvent returns true for a given configuration.
//	 */
//	public boolean isSplitEnabled()
//	{
//		return splitEnabled;
//	}
//
//	/**
//	 * Sets splitEnabled.
//	 */
//	public void setSplitEnabled(boolean value)
//	{
//		splitEnabled = value;
//	}
//
//	/**
//	 * Returns multigraph.
//	 */
//	public boolean isMultigraph()
//	{
//		return multigraph;
//	}
//
//	/**
//	 * Sets multigraph.
//	 */
//	public void setMultigraph(boolean value)
//	{
//		boolean oldValue = multigraph;
//		multigraph = value;
//
//		changeSupport.firePropertyChange("multigraph", oldValue, multigraph);
//	}
//
//	/**
//	 * Returns swimlaneNesting.
//	 */
//	public boolean isSwimlaneNesting()
//	{
//		return swimlaneNesting;
//	}
//
//	/**
//	 * Sets swimlaneNesting.
//	 */
//	public void setSwimlaneNesting(boolean value)
//	{
//		boolean oldValue = swimlaneNesting;
//		swimlaneNesting = value;
//
//		changeSupport.firePropertyChange("swimlaneNesting", oldValue,
//				swimlaneNesting);
//	}
//
//	/**
//	 * Returns allowDanglingEdges
//	 */
//	public boolean isAllowDanglingEdges()
//	{
//		return allowDanglingEdges;
//	}
//
//	/**
//	 * Sets allowDanglingEdges.
//	 */
//	public void setAllowDanglingEdges(boolean value)
//	{
//		boolean oldValue = allowDanglingEdges;
//		allowDanglingEdges = value;
//
//		changeSupport.firePropertyChange("allowDanglingEdges", oldValue,
//				allowDanglingEdges);
//	}
//
//	/**
//	 * Returns cloneInvalidEdges.
//	 */
//	public boolean isCloneInvalidEdges()
//	{
//		return cloneInvalidEdges;
//	}
//
//	/**
//	 * Sets cloneInvalidEdge.
//	 */
//	public void setCloneInvalidEdges(boolean value)
//	{
//		boolean oldValue = cloneInvalidEdges;
//		cloneInvalidEdges = value;
//
//		changeSupport.firePropertyChange("cloneInvalidEdges", oldValue,
//				cloneInvalidEdges);
//	}
//
//	/**
//	 * Returns disconnectOnMove
//	 */
//	public boolean isDisconnectOnMove()
//	{
//		return disconnectOnMove;
//	}
//
//	/**
//	 * Sets disconnectOnMove.
//	 */
//	public void setDisconnectOnMove(boolean value)
//	{
//		boolean oldValue = disconnectOnMove;
//		disconnectOnMove = value;
//
//		changeSupport.firePropertyChange("disconnectOnMove", oldValue,
//				disconnectOnMove);
//
//	}
//
//	/**
//	 * Returns allowLoops.
//	 */
//	public boolean isAllowLoops()
//	{
//		return allowLoops;
//	}
//
//	/**
//	 * Sets allowLoops.
//	 */
//	public void setAllowLoops(boolean value)
//	{
//		boolean oldValue = allowLoops;
//		allowLoops = value;
//
//		changeSupport.firePropertyChange("allowLoops", oldValue, allowLoops);
//	}
//
//	/**
//	 * Returns connectableEdges.
//	 */
//	public boolean isConnectableEdges()
//	{
//		return connectableEdges;
//	}
//
//	/**
//	 * Sets connetableEdges.
//	 */
//	public void setConnectableEdges(boolean value)
//	{
//		boolean oldValue = connectableEdges;
//		connectableEdges = value;
//
//		changeSupport.firePropertyChange("connectableEdges", oldValue,
//				connectableEdges);
//
//	}
//
//	/**
//	 * Returns resetEdgesOnMove.
//	 */
//	public boolean isResetEdgesOnMove()
//	{
//		return resetEdgesOnMove;
//	}
//
//	/**
//	 * Sets resetEdgesOnMove.
//	 */
//	public void setResetEdgesOnMove(boolean value)
//	{
//		boolean oldValue = resetEdgesOnMove;
//		resetEdgesOnMove = value;
//
//		changeSupport.firePropertyChange("resetEdgesOnMove", oldValue,
//				resetEdgesOnMove);
//	}
//
//	/**
//	 * Returns resetViewOnRootChange.
//	 */
//	public boolean isResetViewOnRootChange()
//	{
//		return resetViewOnRootChange;
//	}
//
//	/**
//	 * Sets resetEdgesOnResize.
//	 */
//	public void setResetViewOnRootChange(boolean value)
//	{
//		boolean oldValue = resetViewOnRootChange;
//		resetViewOnRootChange = value;
//
//		changeSupport.firePropertyChange("resetViewOnRootChange", oldValue,
//				resetViewOnRootChange);
//	}
//
//	/**
//	 * Returns resetEdgesOnResize.
//	 */
//	public boolean isResetEdgesOnResize()
//	{
//		return resetEdgesOnResize;
//	}
//
//	/**
//	 * Sets resetEdgesOnResize.
//	 */
//	public void setResetEdgesOnResize(boolean value)
//	{
//		boolean oldValue = resetEdgesOnResize;
//		resetEdgesOnResize = value;
//
//		changeSupport.firePropertyChange("resetEdgesOnResize", oldValue,
//				resetEdgesOnResize);
//	}
//
//	/**
//	 * Returns resetEdgesOnConnect.
//	 */
//	public boolean isResetEdgesOnConnect()
//	{
//		return resetEdgesOnConnect;
//	}
//
//	/**
//	 * Sets resetEdgesOnConnect.
//	 */
//	public void setResetEdgesOnConnect(boolean value)
//	{
//		boolean oldValue = resetEdgesOnConnect;
//		resetEdgesOnConnect = value;
//
//		changeSupport.firePropertyChange("resetEdgesOnConnect", oldValue,
//				resetEdgesOnResize);
//	}
//
//	/**
//	 * Returns true if the size of the given cell should automatically be
//	 * updated after a change of the label. This implementation returns
//	 * autoSize for all given cells or checks if the cell style does specify
//	 * mxConstants.STYLE_AUTOSIZE to be 1.
//	 * 
//	 * @param cell Cell that should be resized.
//	 * @return Returns true if the size of the given cell should be updated.
//	 */
//	public boolean isAutoSizeCell(Object cell)
//	{
//		mxCellState state = view.getState(cell);
//		Map<String, Object> style = (state != null) ? state.getStyle()
//				: getCellStyle(cell);
//
//		return isAutoSizeCells()
//				|| mxUtils.isTrue(style, mxConstants.STYLE_AUTOSIZE, false);
//	}
//
//	/**
//	 * Returns true if the size of the given cell should automatically be
//	 * updated after a change of the label. This implementation returns
//	 * autoSize for all given cells.
//	 */
//	public boolean isAutoSizeCells()
//	{
//		return autoSizeCells;
//	}
//
//	/**
//	 * Specifies if cell sizes should be automatically updated after a label
//	 * change. This implementation sets autoSize to the given parameter.
//	 * 
//	 * @param value Boolean indicating if cells should be resized
//	 * automatically.
//	 */
//	public void setAutoSizeCells(boolean value)
//	{
//		boolean oldValue = autoSizeCells;
//		autoSizeCells = value;
//
//		changeSupport.firePropertyChange("autoSizeCells", oldValue,
//				autoSizeCells);
//	}
//
//	/**
//	 * Returns true if the parent of the given cell should be extended if the
//	 * child has been resized so that it overlaps the parent. This
//		 * implementation returns ExtendParents if cell is not an edge.
//	 * 
//	 * @param cell Cell that has been resized.
//	 */
//	public boolean isExtendParent(Object cell)
//	{
//		return !getModel().isEdge(cell) && isExtendParents();
//	}
//
//	/**
//	 * Returns extendParents.
//	 */
//	public boolean isExtendParents()
//	{
//		return extendParents;
//	}
//
//	/**
//	 * Sets extendParents.
//	 */
//	public void setExtendParents(boolean value)
//	{
//		boolean oldValue = extendParents;
//		extendParents = value;
//
//		changeSupport.firePropertyChange("extendParents", oldValue,
//				extendParents);
//	}
//
//	/**
//	 * Returns extendParentsOnAdd.
//	 */
//	public boolean isExtendParentsOnAdd()
//	{
//		return extendParentsOnAdd;
//	}
//
//	/**
//	 * Sets extendParentsOnAdd.
//	 */
//	public void setExtendParentsOnAdd(boolean value)
//	{
//		boolean oldValue = extendParentsOnAdd;
//		extendParentsOnAdd = value;
//
//		changeSupport.firePropertyChange("extendParentsOnAdd", oldValue,
//				extendParentsOnAdd);
//	}
//
//	/**
//	 * Returns true if the given cell should be kept inside the bounds of its
//	 * parent according to the rules defined by getOverlap and
//	 * isAllowOverlapParent. This implementation returns false for all children
//	 * of edges and isConstrainChildren() otherwise.
//	 */
//	public boolean isConstrainChild(Object cell)
//	{
//		return isConstrainChildren()
//				&& !getModel().isEdge(getModel().getParent(cell));
//	}
//
//	/**
//	 * Returns constrainChildren.
//	 * 
//	 * @return the keepInsideParentOnMove
//	 */
//	public boolean isConstrainChildren()
//	{
//		return constrainChildren;
//	}
//
//	/**
//	 * @param value the constrainChildren to set
//	 */
//	public void setConstrainChildren(boolean value)
//	{
//		boolean oldValue = constrainChildren;
//		constrainChildren = value;
//
//		changeSupport.firePropertyChange("constrainChildren", oldValue,
//				constrainChildren);
//	}
//
//	/**
//	 * Returns autoOrigin.
//	 */
//	public boolean isAutoOrigin()
//	{
//		return autoOrigin;
//	}
//
//	/**
//	 * @param value the autoOrigin to set
//	 */
//	public void setAutoOrigin(boolean value)
//	{
//		boolean oldValue = autoOrigin;
//		autoOrigin = value;
//
//		changeSupport.firePropertyChange("autoOrigin", oldValue, autoOrigin);
//	}
//
//	/**
//	 * Returns origin.
//	 */
//	public mxPoint getOrigin()
//	{
//		return origin;
//	}
//
//	/**
//	 * @param value the origin to set
//	 */
//	public void setOrigin(mxPoint value)
//	{
//		mxPoint oldValue = origin;
//		origin = value;
//
//		changeSupport.firePropertyChange("origin", oldValue, origin);
//	}
//
//	/**
//	 * @return Returns changesRepaintThreshold.
//	 */
//	public int getChangesRepaintThreshold()
//	{
//		return changesRepaintThreshold;
//	}
//
//	/**
//	 * @param value the changesRepaintThreshold to set
//	 */
//	public void setChangesRepaintThreshold(int value)
//	{
//		int oldValue = changesRepaintThreshold;
//		changesRepaintThreshold = value;
//
//		changeSupport.firePropertyChange("changesRepaintThreshold", oldValue,
//				changesRepaintThreshold);
//	}
//
//	/**
//	 * Returns isAllowNegativeCoordinates.
//	 * 
//	 * @return the allowNegativeCoordinates
//	 */
//	public boolean isAllowNegativeCoordinates()
//	{
//		return allowNegativeCoordinates;
//	}
//
//	/**
//	 * @param value the allowNegativeCoordinates to set
//	 */
//	public void setAllowNegativeCoordinates(boolean value)
//	{
//		boolean oldValue = allowNegativeCoordinates;
//		allowNegativeCoordinates = value;
//
//		changeSupport.firePropertyChange("allowNegativeCoordinates", oldValue,
//				allowNegativeCoordinates);
//	}
//
//	/**
//	 * Returns collapseToPreferredSize.
//	 * 
//	 * @return the collapseToPreferredSize
//	 */
//	public boolean isCollapseToPreferredSize()
//	{
//		return collapseToPreferredSize;
//	}
//
//	/**
//	 * @param value the collapseToPreferredSize to set
//	 */
//	public void setCollapseToPreferredSize(boolean value)
//	{
//		boolean oldValue = collapseToPreferredSize;
//		collapseToPreferredSize = value;
//
//		changeSupport.firePropertyChange("collapseToPreferredSize", oldValue,
//				collapseToPreferredSize);
//	}
//
//	/**
//	 * @return Returns true if edges are rendered in the foreground.
//	 */
//	public boolean isKeepEdgesInForeground()
//	{
//		return keepEdgesInForeground;
//	}
//
//	/**
//	 * @param value the keepEdgesInForeground to set
//	 */
//	public void setKeepEdgesInForeground(boolean value)
//	{
//		boolean oldValue = keepEdgesInForeground;
//		keepEdgesInForeground = value;
//
//		changeSupport.firePropertyChange("keepEdgesInForeground", oldValue,
//				keepEdgesInForeground);
//	}
//
//	/**
//	 * @return Returns true if edges are rendered in the background.
//	 */
//	public boolean isKeepEdgesInBackground()
//	{
//		return keepEdgesInBackground;
//	}
//
//	/**
//	 * @param value the keepEdgesInBackground to set
//	 */
//	public void setKeepEdgesInBackground(boolean value)
//	{
//		boolean oldValue = keepEdgesInBackground;
//		keepEdgesInBackground = value;
//
//		changeSupport.firePropertyChange("keepEdgesInBackground", oldValue,
//				keepEdgesInBackground);
//	}
//
//	/**
//	 * Returns true if the given cell is a valid source for new connections.
//	 * This implementation returns true for all non-null values and is
//	 * called by is called by <isValidConnection>.
//	 * 
//	 * @param cell Object that represents a possible source or null.
//	 * @return Returns true if the given cell is a valid source terminal.
//	 */
//	public boolean isValidSource(Object cell)
//	{
//		return (cell == null && allowDanglingEdges)
//				|| (cell != null
//						&& (!model.isEdge(cell) || isConnectableEdges()) && isCellConnectable(cell));
//	}
//
//	/**
//	 * Returns isValidSource for the given cell. This is called by
//	 * isValidConnection.
//	 *
//	 * @param cell Object that represents a possible target or null.
//	 * @return Returns true if the given cell is a valid target.
//	 */
//	public boolean isValidTarget(Object cell)
//	{
//		return isValidSource(cell);
//	}
//
//	/**
//	 * Returns true if the given target cell is a valid target for source.
//	 * This is a boolean implementation for not allowing connections between
//	 * certain pairs of vertices and is called by <getEdgeValidationError>.
//	 * This implementation returns true if <isValidSource> returns true for
//	 * the source and <isValidTarget> returns true for the target.
//	 * 
//	 * @param source Object that represents the source cell.
//	 * @param target Object that represents the target cell.
//	 * @return Returns true if the the connection between the given terminals
//	 * is valid.
//	 */
//	public boolean isValidConnection(Object source, Object target)
//	{
//		return isValidSource(source) && isValidTarget(target)
//				&& (isAllowLoops() || source != target);
//	}
//
//	/**
//	 * Returns the minimum size of the diagram.
//	 * 
//	 * @return Returns the minimum container size.
//	 */
//	public mxRectangle getMinimumGraphSize()
//	{
//		return minimumGraphSize;
//	}
//
//	/**
//	 * @param value the minimumGraphSize to set
//	 */
//	public void setMinimumGraphSize(mxRectangle value)
//	{
//		mxRectangle oldValue = minimumGraphSize;
//		minimumGraphSize = value;
//
//		changeSupport.firePropertyChange("minimumGraphSize", oldValue, value);
//	}
//
//	/**
//	 * Returns a decimal number representing the amount of the width and height
//	 * of the given cell that is allowed to overlap its parent. A value of 0
//	 * means all children must stay inside the parent, 1 means the child is
//	 * allowed to be placed outside of the parent such that it touches one of
//	 * the parents sides. If <isAllowOverlapParent> returns false for the given
//	 * cell, then this method returns 0.
//	 * 
//	 * @param cell
//	 * @return Returns the overlapping value for the given cell inside its
//	 * parent.
//	 */
//	public double getOverlap(Object cell)
//	{
//		return (isAllowOverlapParent(cell)) ? getDefaultOverlap() : 0;
//	}
//
//	/**
//	 * Gets defaultOverlap.
//	 */
//	public double getDefaultOverlap()
//	{
//		return defaultOverlap;
//	}
//
//	/**
//	 * Sets defaultOverlap.
//	 */
//	public void setDefaultOverlap(double value)
//	{
//		double oldValue = defaultOverlap;
//		defaultOverlap = value;
//
//		changeSupport.firePropertyChange("defaultOverlap", oldValue, value);
//	}
//
//	/**
//	 * Returns true if the given cell is allowed to be placed outside of the
//	 * parents area.
//	 * 
//	 * @param cell
//	 * @return Returns true if the given cell may overlap its parent.
//	 */
//	public boolean isAllowOverlapParent(Object cell)
//	{
//		return false;
//	}
//
//	/**
//	 * Returns the cells which are movable in the given array of cells.
//	 */
//	public Object[] getFoldableCells(Object[] cells, final boolean collapse)
//	{
//		return mxGraphModel.filterCells(cells, new Filter()
//		{
//			public boolean filter(Object cell)
//			{
//				return isCellFoldable(cell, collapse);
//			}
//		});
//	}
//
//	/**
//	 * Returns true if the given cell is expandable. This implementation
//	 * returns true if the cell has at least one child and its style
//	 * does not specify mxConstants.STYLE_FOLDABLE to be 0.
//	 *
//	 * @param cell <mxCell> whose expandable state should be returned.
//	 * @return Returns true if the given cell is expandable.
//	 */
//	public boolean isCellFoldable(Object cell, boolean collapse)
//	{
//		mxCellState state = view.getState(cell);
//		Map<String, Object> style = (state != null) ? state.getStyle()
//				: getCellStyle(cell);
//
//		return model.getChildCount(cell) > 0
//				&& mxUtils.isTrue(style, mxConstants.STYLE_FOLDABLE, true);
//	}
//
//	/**
//	 * Returns true if the grid is enabled.
//	 * 
//	 * @return Returns the enabled state of the grid.
//	 */
//	public boolean isGridEnabled()
//	{
//		return gridEnabled;
//	}
//
//	/**
//	 * Sets if the grid is enabled.
//	 * 
//	 * @param value Specifies if the grid should be enabled.
//	 */
//	public void setGridEnabled(boolean value)
//	{
//		boolean oldValue = gridEnabled;
//		gridEnabled = value;
//
//		changeSupport.firePropertyChange("gridEnabled", oldValue, gridEnabled);
//	}
//
//	/**
//	 * Returns true if ports are enabled.
//	 * 
//	 * @return Returns the enabled state of the ports.
//	 */
//	public boolean isPortsEnabled()
//	{
//		return portsEnabled;
//	}
//
//	/**
//	 * Sets if ports are enabled.
//	 * 
//	 * @param value Specifies if the ports should be enabled.
//	 */
//	public void setPortsEnabled(boolean value)
//	{
//		boolean oldValue = portsEnabled;
//		portsEnabled = value;
//
//		changeSupport
//				.firePropertyChange("portsEnabled", oldValue, portsEnabled);
//	}
//
//	/**
//	 * Returns the grid size.
//	 * 
//	 * @return Returns the grid size
//	 */
//	public int getGridSize()
//	{
//		return gridSize;
//	}
//
//	/**
//	 * Sets the grid size and fires a property change event for gridSize.
//	 * 
//	 * @param value New grid size to be used.
//	 */
//	public void setGridSize(int value)
//	{
//		int oldValue = gridSize;
//		gridSize = value;
//
//		changeSupport.firePropertyChange("gridSize", oldValue, gridSize);
//	}
//
//	/**
//	 * Returns alternateEdgeStyle.
//	 */
//	public String getAlternateEdgeStyle()
//	{
//		return alternateEdgeStyle;
//	}
//
//	/**
//	 * Sets alternateEdgeStyle.
//	 */
//	public void setAlternateEdgeStyle(String value)
//	{
//		String oldValue = alternateEdgeStyle;
//		alternateEdgeStyle = value;
//
//		changeSupport.firePropertyChange("alternateEdgeStyle", oldValue,
//				alternateEdgeStyle);
//	}
//
//	/**
//	 * Returns true if the given cell is a valid drop target for the specified
//	 * cells. This returns true if the cell is a swimlane, has children and is
//	 * not collapsed, or if splitEnabled is true and isSplitTarget returns
//	 * true for the given arguments
//	 * 
//	 * @param cell Object that represents the possible drop target.
//	 * @param cells Objects that are going to be dropped.
//	 * @return Returns true if the cell is a valid drop target for the given
//	 * cells.
//	 */
//	public boolean isValidDropTarget(Object cell, Object[] cells)
//	{
//		return cell != null
//				&& ((isSplitEnabled() && isSplitTarget(cell, cells)) || (!model
//						.isEdge(cell) && (isSwimlane(cell) || (model
//						.getChildCount(cell) > 0 && !isCellCollapsed(cell)))));
//	}
//
//	/**
//	 * Returns true if split is enabled and the given edge may be splitted into
//	 * two edges with the given cell as a new terminal between the two.
//	 * 
//	 * @param target Object that represents the edge to be splitted.
//	 * @param cells Array of cells to add into the given edge.
//	 * @return Returns true if the given edge may be splitted by the given
//	 * cell.
//	 */
//	public boolean isSplitTarget(Object target, Object[] cells)
//	{
//		if (target != null && cells != null && cells.length == 1)
//		{
//			Object src = model.getTerminal(target, true);
//			Object trg = model.getTerminal(target, false);
//
//			return (model.isEdge(target)
//					&& isCellConnectable(cells[0])
//					&& getEdgeValidationError(target,
//							model.getTerminal(target, true), cells[0]) == null
//					&& !model.isAncestor(cells[0], src) && !model.isAncestor(
//					cells[0], trg));
//		}
//
//		return false;
//	}
//
//	/**
//	 * Returns the given cell if it is a drop target for the given cells or the
//	 * nearest ancestor that may be used as a drop target for the given cells.
//	 * If the given array contains a swimlane and swimlaneNesting is false
//	 * then this always returns null. If no cell is given, then the bottommost
//	 * swimlane at the location of the given event is returned.
//	 * 
//	 * This function should only be used if isDropEnabled returns true.
//	 */
//	public Object getDropTarget(Object[] cells, Point pt, Object cell)
//	{
//		if (!isSwimlaneNesting())
//		{
//			for (int i = 0; i < cells.length; i++)
//			{
//				if (isSwimlane(cells[i]))
//				{
//					return null;
//				}
//			}
//		}
//
//		// FIXME the else below does nothing if swimlane is null
//		Object swimlane = null; //getSwimlaneAt(pt.x, pt.y);
//
//		if (cell == null)
//		{
//			cell = swimlane;
//		}
//		/*else if (swimlane != null)
//		{
//			// Checks if the cell is an ancestor of the swimlane
//			// under the mouse and uses the swimlane in that case
//			Object tmp = model.getParent(swimlane);
//
//			while (tmp != null && isSwimlane(tmp) && tmp != cell)
//			{
//				tmp = model.getParent(tmp);
//			}
//
//			if (tmp == cell)
//			{
//				cell = swimlane;
//			}
//		}*/
//
//		while (cell != null && !isValidDropTarget(cell, cells)
//				&& model.getParent(cell) != model.getRoot())
//		{
//			cell = model.getParent(cell);
//		}
//
//		return (model.getParent(cell) != model.getRoot() && !mxUtils.contains(
//				cells, cell)) ? cell : null;
//	};
//
//	//
//	// Cell retrieval
//	//
//
//	/**
//	 * Returns the first child of the root in the model, that is, the first or
//	 * default layer of the diagram. 
//	 * 
//	 * @return Returns the default parent for new cells.
//	 */
//	public Object getDefaultParent()
//	{
//		Object parent = defaultParent;
//
//		if (parent == null)
//		{
//			parent = view.getCurrentRoot();
//
//			if (parent == null)
//			{
//				Object root = model.getRoot();
//				parent = model.getChildAt(root, 0);
//			}
//		}
//
//		return parent;
//	}
//
//	/**
//	 * Sets the default parent to be returned by getDefaultParent.
//	 * Set this to null to return the first child of the root in
//	 * getDefaultParent.
//	 */
//	public void setDefaultParent(Object value)
//	{
//		defaultParent = value;
//	}
//
//	/**
//	 * Returns the visible child vertices of the given parent.
//	 * 
//	 * @param parent Cell whose children should be returned.
//	 */
//	public Object[] getChildVertices(Object parent)
//	{
//		return getChildCells(parent, true, false);
//	}
//
//	/**
//	 * Returns the visible child edges of the given parent.
//	 * 
//	 * @param parent Cell whose children should be returned.
//	 */
//	public Object[] getChildEdges(Object parent)
//	{
//		return getChildCells(parent, false, true);
//	}
//
//	/**
//	 * Returns the visible children of the given parent.
//	 * 
//	 * @param parent Cell whose children should be returned.
//	 */
//	public Object[] getChildCells(Object parent)
//	{
//		return getChildCells(parent, false, false);
//	}
//
//	/**
//	 * Returns the visible child vertices or edges in the given parent. If
//	 * vertices and edges is false, then all children are returned.
//	 * 
//	 * @param parent Cell whose children should be returned.
//	 * @param vertices Specifies if child vertices should be returned.
//	 * @param edges Specifies if child edges should be returned.
//	 * @return Returns the child vertices and edges.
//	 */
//	public Object[] getChildCells(Object parent, boolean vertices, boolean edges)
//	{
//		Object[] cells = mxGraphModel.getChildCells(model, parent, vertices,
//				edges);
//		List<Object> result = new ArrayList<Object>(cells.length);
//
//		// Filters out the non-visible child cells
//		for (int i = 0; i < cells.length; i++)
//		{
//			if (isCellVisible(cells[i]))
//			{
//				result.add(cells[i]);
//			}
//		}
//
//		return result.toArray();
//	}
//
//	/**
//	 * Returns all visible edges connected to the given cell without loops.
//	 * 
//	 * @param cell Cell whose connections should be returned.
//	 * @return Returns the connected edges for the given cell.
//	 */
//	public Object[] getConnections(Object cell)
//	{
//		return getConnections(cell, null);
//	}
//
//	/**
//	 * Returns all visible edges connected to the given cell without loops.
//	 * If the optional parent argument is specified, then only child
//	 * edges of the given parent are returned.
//	 * 
//	 * @param cell Cell whose connections should be returned.
//	 * @param parent Optional parent of the opposite end for a connection
//	 * to be returned.
//	 * @return Returns the connected edges for the given cell.
//	 */
//	public Object[] getConnections(Object cell, Object parent)
//	{
//		return getConnections(cell, parent, false);
//	}
//
//	/**
//	 * Returns all visible edges connected to the given cell without loops.
//	 * If the optional parent argument is specified, then only child
//	 * edges of the given parent are returned.
//	 * 
//	 * @param cell Cell whose connections should be returned.
//	 * @param parent Optional parent of the opposite end for a connection
//	 * to be returned.
//	 * @return Returns the connected edges for the given cell.
//	 */
//	public Object[] getConnections(Object cell, Object parent, boolean recurse)
//	{
//		return getEdges(cell, parent, true, true, false, recurse);
//	}
//
//	/**
//	 * Returns all incoming visible edges connected to the given cell without
//	 * loops.
//	 * 
//	 * @param cell Cell whose incoming edges should be returned.
//	 * @return Returns the incoming edges of the given cell.
//	 */
//	public Object[] getIncomingEdges(Object cell)
//	{
//		return getIncomingEdges(cell, null);
//	}
//
//	/**
//	 * Returns the visible incoming edges for the given cell. If the optional
//	 * parent argument is specified, then only child edges of the given parent
//	 * are returned.
//	 * 
//	 * @param cell Cell whose incoming edges should be returned.
//	 * @param parent Optional parent of the opposite end for an edge
//	 * to be returned.
//	 * @return Returns the incoming edges of the given cell.
//	 */
//	public Object[] getIncomingEdges(Object cell, Object parent)
//	{
//		return getEdges(cell, parent, true, false, false);
//	}
//
//	/**
//	 * Returns all outgoing visible edges connected to the given cell without
//	 * loops.
//	 * 
//	 * @param cell Cell whose outgoing edges should be returned.
//	 * @return Returns the outgoing edges of the given cell.
//	 */
//	public Object[] getOutgoingEdges(Object cell)
//	{
//		return getOutgoingEdges(cell, null);
//	}
//
//	/**
//	 * Returns the visible outgoing edges for the given cell. If the optional
//	 * parent argument is specified, then only child edges of the given parent
//	 * are returned.
//	 * 
//	 * @param cell Cell whose outgoing edges should be returned.
//	 * @param parent Optional parent of the opposite end for an edge
//	 * to be returned.
//	 * @return Returns the outgoing edges of the given cell.
//	 */
//	public Object[] getOutgoingEdges(Object cell, Object parent)
//	{
//		return getEdges(cell, parent, false, true, false);
//	}
//
//	/**
//	 * Returns all visible edges connected to the given cell including loops.
//	 *
//	 * @param cell Cell whose edges should be returned.
//	 * @return Returns the edges of the given cell.
//	 */
//	public Object[] getEdges(Object cell)
//	{
//		return getEdges(cell, null);
//	}
//
//	/**
//	 * Returns all visible edges connected to the given cell including loops.
//	 * 
//	 * @param cell Cell whose edges should be returned.
//	 * @param parent Optional parent of the opposite end for an edge
//	 * to be returned.
//	 * @return Returns the edges of the given cell.
//	 */
//	public Object[] getEdges(Object cell, Object parent)
//	{
//		return getEdges(cell, parent, true, true, true);
//	}
//
//	/**
//	 * Returns the incoming and/or outgoing edges for the given cell.
//	 * If the optional parent argument is specified, then only edges are returned
//	 * where the opposite is in the given parent cell.
//	 * 
//	 * @param cell Cell whose edges should be returned.
//	 * @param parent Optional parent. If specified the opposite end of any edge
//	 * must be a direct child of that parent in order for the edge to be returned.
//	 * @param incoming Specifies if incoming edges should be included in the
//	 * result.
//	 * @param outgoing Specifies if outgoing edges should be included in the
//	 * result.
//	 * @param includeLoops Specifies if loops should be included in the result.
//	 * @return Returns the edges connected to the given cell.
//	 */
//	public Object[] getEdges(Object cell, Object parent, boolean incoming,
//			boolean outgoing, boolean includeLoops)
//	{
//		return getEdges(cell, parent, incoming, outgoing, includeLoops, false);
//	}
//
//	/**
//	 * Returns the incoming and/or outgoing edges for the given cell.
//	 * If the optional parent argument is specified, then only edges are returned
//	 * where the opposite is in the given parent cell.
//	 * 
//	 * @param cell Cell whose edges should be returned.
//	 * @param parent Optional parent. If specified the opposite end of any edge
//	 * must be a child of that parent in order for the edge to be returned. The
//	 * recurse parameter specifies whether or not it must be the direct child
//	 * or the parent just be an ancestral parent.
//	 * @param incoming Specifies if incoming edges should be included in the
//	 * result.
//	 * @param outgoing Specifies if outgoing edges should be included in the
//	 * result.
//	 * @param includeLoops Specifies if loops should be included in the result.
//	 * @param recurse Specifies if the parent specified only need be an ancestral
//	 * parent, <code>true</code>, or the direct parent, <code>false</code>
//	 * @return Returns the edges connected to the given cell.
//	 */
//	public Object[] getEdges(Object cell, Object parent, boolean incoming,
//			boolean outgoing, boolean includeLoops, boolean recurse)
//	{
//		boolean isCollapsed = isCellCollapsed(cell);
//		List<Object> edges = new ArrayList<Object>();
//		int childCount = model.getChildCount(cell);
//
//		for (int i = 0; i < childCount; i++)
//		{
//			Object child = model.getChildAt(cell, i);
//
//			if (isCollapsed || !isCellVisible(child))
//			{
//				edges.addAll(Arrays.asList(mxGraphModel.getEdges(model, child,
//						incoming, outgoing, includeLoops)));
//			}
//		}
//
//		edges.addAll(Arrays.asList(mxGraphModel.getEdges(model, cell, incoming,
//				outgoing, includeLoops)));
//		List<Object> result = new ArrayList<Object>(edges.size());
//		Iterator<Object> it = edges.iterator();
//
//		while (it.hasNext())
//		{
//			Object edge = it.next();
//			mxCellState state = view.getState(edge);
//			Object source = (state != null) ? state.getVisibleTerminal(true)
//					: view.getVisibleTerminal(edge, true);
//			Object target = (state != null) ? state.getVisibleTerminal(false)
//					: view.getVisibleTerminal(edge, false);
//
//			if ((includeLoops && source == target)
//					|| ((source != target) && ((incoming && target == cell && (parent == null || isValidAncestor(
//							source, parent, recurse))) || (outgoing
//							&& source == cell && (parent == null || isValidAncestor(
//							target, parent, recurse))))))
//			{
//				result.add(edge);
//			}
//		}
//
//		return result.toArray();
//	}
//
//	/**
//	 * Returns whether or not the specified parent is a valid
//	 * ancestor of the specified cell, either direct or indirectly
//	 * based on whether ancestor recursion is enabled.
//	 * @param cell the possible child cell
//	 * @param parent the possible parent cell
//	 * @param recurse whether or not to recurse the child ancestors
//	 * @return whether or not the specified parent is a valid
//	 * ancestor of the specified cell, either direct or indirectly
//	 * based on whether ancestor recursion is enabled.
//	 */
//	public boolean isValidAncestor(Object cell, Object parent, boolean recurse)
//	{
//		return (recurse ? model.isAncestor(parent, cell) : model
//				.getParent(cell) == parent);
//	}
//
//	/**
//	 * Returns all distinct visible opposite cells of the terminal on the given
//	 * edges.
//	 * 
//	 * @param edges
//	 * @param terminal
//	 * @return Returns the terminals at the opposite ends of the given edges.
//	 */
//	public Object[] getOpposites(Object[] edges, Object terminal)
//	{
//		return getOpposites(edges, terminal, true, true);
//	}
//
//	/**
//	 * Returns all distincts visible opposite cells for the specified terminal
//	 * on the given edges.
//	 * 
//	 * @param edges Edges whose opposite terminals should be returned.
//	 * @param terminal Terminal that specifies the end whose opposite should be
//	 * returned.
//	 * @param sources Specifies if source terminals should be included in the
//	 * result.
//	 * @param targets Specifies if target terminals should be included in the
//	 * result.
//	 * @return Returns the cells at the opposite ends of the given edges.
//	 */
//	public Object[] getOpposites(Object[] edges, Object terminal,
//			boolean sources, boolean targets)
//	{
//		Collection<Object> terminals = new LinkedHashSet<Object>();
//
//		if (edges != null)
//		{
//			for (int i = 0; i < edges.length; i++)
//			{
//				mxCellState state = view.getState(edges[i]);
//				Object source = (state != null) ? state
//						.getVisibleTerminal(true) : view.getVisibleTerminal(
//						edges[i], true);
//				Object target = (state != null) ? state
//						.getVisibleTerminal(false) : view.getVisibleTerminal(
//						edges[i], false);
//
//				// Checks if the terminal is the source of
//				// the edge and if the target should be
//				// stored in the result
//				if (targets && source == terminal && target != null
//						&& target != terminal)
//				{
//					terminals.add(target);
//				}
//
//				// Checks if the terminal is the taget of
//				// the edge and if the source should be
//				// stored in the result
//				else if (sources && target == terminal && source != null
//						&& source != terminal)
//				{
//					terminals.add(source);
//				}
//			}
//		}
//
//		return terminals.toArray();
//	}
//
//	/**
//	 * Returns the edges between the given source and target. This takes into
//	 * account collapsed and invisible cells and returns the connected edges
//	 * as displayed on the screen.
//	 * 
//	 * @param source
//	 * @param target
//	 * @return Returns all edges between the given terminals.
//	 */
//	public Object[] getEdgesBetween(Object source, Object target)
//	{
//		return getEdgesBetween(source, target, false);
//	}
//
//	/**
//	 * Returns the edges between the given source and target. This takes into
//	 * account collapsed and invisible cells and returns the connected edges
//	 * as displayed on the screen.
//	 * 
//	 * @param source
//	 * @param target
//	 * @param directed
//	 * @return Returns all edges between the given terminals.
//	 */
//	public Object[] getEdgesBetween(Object source, Object target,
//			boolean directed)
//	{
//		Object[] edges = getEdges(source);
//		List<Object> result = new ArrayList<Object>(edges.length);
//
//		// Checks if the edge is connected to the correct
//		// cell and adds any match to the result
//		for (int i = 0; i < edges.length; i++)
//		{
//			mxCellState state = view.getState(edges[i]);
//			Object src = (state != null) ? state.getVisibleTerminal(true)
//					: view.getVisibleTerminal(edges[i], true);
//			Object trg = (state != null) ? state.getVisibleTerminal(false)
//					: view.getVisibleTerminal(edges[i], false);
//
//			if ((src == source && trg == target)
//					|| (!directed && src == target && trg == source))
//			{
//				result.add(edges[i]);
//			}
//		}
//
//		return result.toArray();
//	}
//
//	/**
//	 * Returns the children of the given parent that are contained in the
//	 * halfpane from the given point (x0, y0) rightwards and downwards
//	 * depending on rightHalfpane and bottomHalfpane.
//	 * 
//	 * @param x0 X-coordinate of the origin.
//	 * @param y0 Y-coordinate of the origin.
//	 * @param parent <mxCell> whose children should be checked.
//	 * @param rightHalfpane Boolean indicating if the cells in the right halfpane
//	 * from the origin should be returned.
//	 * @param bottomHalfpane Boolean indicating if the cells in the bottom halfpane
//	 * from the origin should be returned.
//	 * @return Returns the cells beyond the given halfpane.
//	 */
//	public Object[] getCellsBeyond(double x0, double y0, Object parent,
//			boolean rightHalfpane, boolean bottomHalfpane)
//	{
//		if (parent == null)
//		{
//			parent = getDefaultParent();
//		}
//
//		int childCount = model.getChildCount(parent);
//		List<Object> result = new ArrayList<Object>(childCount);
//
//		if (rightHalfpane || bottomHalfpane)
//		{
//
//			if (parent != null)
//			{
//				for (int i = 0; i < childCount; i++)
//				{
//					Object child = model.getChildAt(parent, i);
//					mxCellState state = view.getState(child);
//
//					if (isCellVisible(child) && state != null)
//					{
//						if ((!rightHalfpane || state.getX() >= x0)
//								&& (!bottomHalfpane || state.getY() >= y0))
//						{
//							result.add(child);
//						}
//					}
//				}
//			}
//		}
//
//		return result.toArray();
//	}
//
//	/**
//	 * Returns all visible children in the given parent which do not have
//	 * incoming edges. If the result is empty then the with the greatest
//	 * difference between incoming and outgoing edges is returned. This
//	 * takes into account edges that are being promoted to the given
//	 * root due to invisible children or collapsed cells.
//	 * 
//	 * @param parent Cell whose children should be checked.
//	 * @return List of tree roots in parent.
//	 */
//	public List<Object> findTreeRoots(Object parent)
//	{
//		return findTreeRoots(parent, false);
//	}
//
//	/**
//	 * Returns all visible children in the given parent which do not have
//	 * incoming edges. If the result is empty then the children with the
//	 * maximum difference between incoming and outgoing edges are returned.
//	 * This takes into account edges that are being promoted to the given
//	 * root due to invisible children or collapsed cells.
//	 * 
//	 * @param parent Cell whose children should be checked.
//	 * @param isolate Specifies if edges should be ignored if the opposite
//	 * end is not a child of the given parent cell.
//	 * @return List of tree roots in parent.
//	 */
//	public List<Object> findTreeRoots(Object parent, boolean isolate)
//	{
//		return findTreeRoots(parent, isolate, false);
//	}
//
//	/**
//	 * Returns all visible children in the given parent which do not have
//	 * incoming edges. If the result is empty then the children with the
//	 * maximum difference between incoming and outgoing edges are returned.
//	 * This takes into account edges that are being promoted to the given
//	 * root due to invisible children or collapsed cells.
//	 * 
//	 * @param parent Cell whose children should be checked.
//	 * @param isolate Specifies if edges should be ignored if the opposite
//	 * end is not a child of the given parent cell.
//	 * @param invert Specifies if outgoing or incoming edges should be counted
//	 * for a tree root. If false then outgoing edges will be counted.
//	 * @return List of tree roots in parent.
//	 */
//	public List<Object> findTreeRoots(Object parent, boolean isolate,
//			boolean invert)
//	{
//		List<Object> roots = new ArrayList<Object>();
//
//		if (parent != null)
//		{
//			int childCount = model.getChildCount(parent);
//			Object best = null;
//			int maxDiff = 0;
//
//			for (int i = 0; i < childCount; i++)
//			{
//				Object cell = model.getChildAt(parent, i);
//
//				if (model.isVertex(cell) && isCellVisible(cell))
//				{
//					Object[] conns = getConnections(cell, (isolate) ? parent
//							: null);
//					int fanOut = 0;
//					int fanIn = 0;
//
//					for (int j = 0; j < conns.length; j++)
//					{
//						Object src = view.getVisibleTerminal(conns[j], true);
//
//						if (src == cell)
//						{
//							fanOut++;
//						}
//						else
//						{
//							fanIn++;
//						}
//					}
//
//					if ((invert && fanOut == 0 && fanIn > 0)
//							|| (!invert && fanIn == 0 && fanOut > 0))
//					{
//						roots.add(cell);
//					}
//
//					int diff = (invert) ? fanIn - fanOut : fanOut - fanIn;
//
//					if (diff > maxDiff)
//					{
//						maxDiff = diff;
//						best = cell;
//					}
//				}
//			}
//
//			if (roots.isEmpty() && best != null)
//			{
//				roots.add(best);
//			}
//		}
//
//		return roots;
//	}
//
//	/**
//	 * Traverses the tree starting at the given vertex. Here is how to use this
//	 * method for a given vertex (root) which is typically the root of a tree:
//	 * <code>
//	 * graph.traverse(root, true, new mxICellVisitor()
//	 * {
//	 *   public boolean visit(Object vertex, Object edge)
//	 *   {
//	 *     System.out.println("edge="+graph.convertValueToString(edge)+
//	 *       " vertex="+graph.convertValueToString(vertex));
//	 *     
//	 *     return true;
//	 *   }
//	 * });
//	 * </code>
//	 * 
//	 * @param vertex
//	 * @param directed
//	 * @param visitor
//	 */
//	public void traverse(Object vertex, boolean directed, mxICellVisitor visitor)
//	{
//		traverse(vertex, directed, visitor, null, null);
//	}
//
//	/**
//	 * Traverses the (directed) graph invoking the given function for each
//	 * visited vertex and edge. The function is invoked with the current vertex
//	 * and the incoming edge as a parameter. This implementation makes sure
//	 * each vertex is only visited once. The function may return false if the
//	 * traversal should stop at the given vertex.
//	 * 
//	 * @param vertex <mxCell> that represents the vertex where the traversal starts.
//	 * @param directed Optional boolean indicating if edges should only be traversed
//	 * from source to target. Default is true.
//	 * @param visitor Visitor that takes the current vertex and the incoming edge.
//	 * The traversal stops if the function returns false.
//	 * @param edge Optional <mxCell> that represents the incoming edge. This is
//	 * null for the first step of the traversal.
//	 * @param visited Optional array of cell paths for the visited cells.
//	 */
//	public void traverse(Object vertex, boolean directed,
//			mxICellVisitor visitor, Object edge, Set<Object> visited)
//	{
//		if (vertex != null && visitor != null)
//		{
//			if (visited == null)
//			{
//				visited = new HashSet<Object>();
//			}
//
//			if (!visited.contains(vertex))
//			{
//				visited.add(vertex);
//
//				if (visitor.visit(vertex, edge))
//				{
//					int edgeCount = model.getEdgeCount(vertex);
//
//					if (edgeCount > 0)
//					{
//						for (int i = 0; i < edgeCount; i++)
//						{
//							Object e = model.getEdgeAt(vertex, i);
//							boolean isSource = model.getTerminal(e, true) == vertex;
//
//							if (!directed || isSource)
//							{
//								Object next = model.getTerminal(e, !isSource);
//								traverse(next, directed, visitor, e, visited);
//							}
//						}
//					}
//				}
//			}
//		}
//	}
//
//	//
//	// Selection
//	//
//
//	/**
//	 * 
//	 */
//	public mxGraphSelectionModel getSelectionModel()
//	{
//		return selectionModel;
//	}
//
//	/**
//	 * 
//	 */
//	public int getSelectionCount()
//	{
//		return selectionModel.size();
//	}
//
//	/**
//	 * 
//	 * @param cell
//	 * @return Returns true if the given cell is selected.
//	 */
//	public boolean isCellSelected(Object cell)
//	{
//		return selectionModel.isSelected(cell);
//	}
//
//	/**
//	 * 
//	 * @return Returns true if the selection is empty.
//	 */
//	public boolean isSelectionEmpty()
//	{
//		return selectionModel.isEmpty();
//	}
//
//	/**
//	 * 
//	 */
//	public void clearSelection()
//	{
//		selectionModel.clear();
//	}
//
//	/**
//	 * 
//	 * @return Returns the selection cell.
//	 */
//	public Object getSelectionCell()
//	{
//		return selectionModel.getCell();
//	}
//
//	/**
//	 * 
//	 * @param cell
//	 */
//	public void setSelectionCell(Object cell)
//	{
//		selectionModel.setCell(cell);
//	}
//
//	/**
//	 * 
//	 * @return Returns the selection cells.
//	 */
//	public Object[] getSelectionCells()
//	{
//		return selectionModel.getCells();
//	}
//
//	/**
//	 * 
//	 */
//	public void setSelectionCells(Object[] cells)
//	{
//		selectionModel.setCells(cells);
//	}
//
//	/**
//	 * 
//	 * @param cells
//	 */
//	public void setSelectionCells(Collection<Object> cells)
//	{
//		if (cells != null)
//		{
//			setSelectionCells(cells.toArray());
//		}
//	}
//
//	/**
//	 * 
//	 */
//	public void addSelectionCell(Object cell)
//	{
//		selectionModel.addCell(cell);
//	}
//
//	/**
//	 * 
//	 */
//	public void addSelectionCells(Object[] cells)
//	{
//		selectionModel.addCells(cells);
//	}
//
//	/**
//	 * 
//	 */
//	public void removeSelectionCell(Object cell)
//	{
//		selectionModel.removeCell(cell);
//	}
//
//	/**
//	 * 
//	 */
//	public void removeSelectionCells(Object[] cells)
//	{
//		selectionModel.removeCells(cells);
//	}
//
//	/**
//	 * Selects the next cell.
//	 */
//	public void selectNextCell()
//	{
//		selectCell(true, false, false);
//	}
//
//	/**
//	 * Selects the previous cell.
//	 */
//	public void selectPreviousCell()
//	{
//		selectCell(false, false, false);
//	}
//
//	/**
//	 * Selects the parent cell.
//	 */
//	public void selectParentCell()
//	{
//		selectCell(false, true, false);
//	}
//
//	/**
//	 * Selects the first child cell.
//	 */
//	public void selectChildCell()
//	{
//		selectCell(false, false, true);
//	}
//
//	/**
//	 * Selects the next, parent, first child or previous cell, if all arguments
//	 * are false.
//	 * 
//	 * @param isNext
//	 * @param isParent
//	 * @param isChild
//	 */
//	public void selectCell(boolean isNext, boolean isParent, boolean isChild)
//	{
//		Object cell = getSelectionCell();
//
//		if (getSelectionCount() > 1)
//		{
//			clearSelection();
//		}
//
//		Object parent = (cell != null) ? model.getParent(cell)
//				: getDefaultParent();
//		int childCount = model.getChildCount(parent);
//
//		if (cell == null && childCount > 0)
//		{
//			Object child = model.getChildAt(parent, 0);
//			setSelectionCell(child);
//		}
//		else if ((cell == null || isParent) && view.getState(parent) != null
//				&& model.getGeometry(parent) != null)
//		{
//			if (getCurrentRoot() != parent)
//			{
//				setSelectionCell(parent);
//			}
//		}
//		else if (cell != null && isChild)
//		{
//			int tmp = model.getChildCount(cell);
//
//			if (tmp > 0)
//			{
//				Object child = model.getChildAt(cell, 0);
//				setSelectionCell(child);
//			}
//		}
//		else if (childCount > 0)
//		{
//			int i = ((mxICell) parent).getIndex((mxICell) cell);
//
//			if (isNext)
//			{
//				i++;
//				setSelectionCell(model.getChildAt(parent, i % childCount));
//			}
//			else
//			{
//				i--;
//				int index = (i < 0) ? childCount - 1 : i;
//				setSelectionCell(model.getChildAt(parent, index));
//			}
//		}
//	}
//
//	/**
//	 * Selects all vertices inside the default parent.
//	 */
//	public void selectVertices()
//	{
//		selectVertices(null);
//	}
//
//	/**
//	 * Selects all vertices inside the given parent or the default parent
//	 * if no parent is given.
//	 */
//	public void selectVertices(Object parent)
//	{
//		selectCells(true, false, parent);
//	}
//
//	/**
//	 * Selects all vertices inside the default parent.
//	 */
//	public void selectEdges()
//	{
//		selectEdges(null);
//	}
//
//	/**
//	 * Selects all vertices inside the given parent or the default parent
//	 * if no parent is given.
//	 */
//	public void selectEdges(Object parent)
//	{
//		selectCells(false, true, parent);
//	}
//
//	/**
//	 * Selects all vertices and/or edges depending on the given boolean
//	 * arguments recursively, starting at the default parent. Use
//	 * <code>selectAll</code> to select all cells.
//	 *  
//	 * @param vertices Boolean indicating if vertices should be selected.
//	 * @param edges Boolean indicating if edges should be selected.
//	 */
//	public void selectCells(boolean vertices, boolean edges)
//	{
//		selectCells(vertices, edges, null);
//	}
//
//	/**
//	 * Selects all vertices and/or edges depending on the given boolean
//	 * arguments recursively, starting at the given parent or the default
//	 * parent if no parent is specified. Use <code>selectAll</code> to select
//	 * all cells.
//	 * 
//	 * @param vertices Boolean indicating if vertices should be selected.
//	 * @param edges Boolean indicating if edges should be selected.
//	 * @param parent Optional cell that acts as the root of the recursion.
//	 * Default is <code>defaultParent</code>.
//	 */
//	public void selectCells(final boolean vertices, final boolean edges,
//			Object parent)
//	{
//		if (parent == null)
//		{
//			parent = getDefaultParent();
//		}
//
//		Collection<Object> cells = mxGraphModel.filterDescendants(getModel(),
//				new mxGraphModel.Filter()
//				{
//
//					/**
//					 * 
//					 */
//					public boolean filter(Object cell)
//					{
//						return view.getState(cell) != null
//								&& model.getChildCount(cell) == 0
//								&& ((model.isVertex(cell) && vertices) || (model
//										.isEdge(cell) && edges));
//					}
//
//				});
//		setSelectionCells(cells);
//	}
//
//	/**
//	 * 
//	 */
//	public void selectAll()
//	{
//		selectAll(null);
//	}
//
//	/**
//	 * Selects all children of the given parent cell or the children of the
//	 * default parent if no parent is specified. To select leaf vertices and/or
//	 * edges use <selectCells>.
//	 * 
//	 * @param parent  Optional <mxCell> whose children should be selected.
//	 * Default is <defaultParent>.
//	 */
//	public void selectAll(Object parent)
//	{
//		if (parent == null)
//		{
//			parent = getDefaultParent();
//		}
//
//		Object[] children = mxGraphModel.getChildren(model, parent);
//
//		if (children != null)
//		{
//			setSelectionCells(children);
//		}
//	}
//
//	//
//	// Images and drawing
//	//
//
//	/**
//	 * Draws the graph onto the given canvas.
//	 * 
//	 * @param canvas Canvas onto which the graph should be drawn.
//	 */
//	public void drawGraph(mxICanvas canvas)
//	{
//		drawCell(canvas, getModel().getRoot());
//	}
//
//	/**
//	 * Draws the given cell and its descendants onto the specified canvas.
//	 * 
//	 * @param canvas Canvas onto which the cell should be drawn.
//	 * @param cell Cell that should be drawn onto the canvas.
//	 */
//	public void drawCell(mxICanvas canvas, Object cell)
//	{
//		drawState(canvas, getView().getState(cell), true);
//
//		// Draws the children on top of their parent
//		int childCount = model.getChildCount(cell);
//
//		for (int i = 0; i < childCount; i++)
//		{
//			Object child = model.getChildAt(cell, i);
//			drawCell(canvas, child);
//		}
//	}
//
//	/**
//	 * Draws the cell state with the given label onto the canvas. No
//	 * children or descendants are painted here. This method invokes
//	 * cellDrawn after the cell, but not its descendants have been
//	 * painted.
//	 * 
//	 * @param canvas Canvas onto which the cell should be drawn.
//	 * @param state State of the cell to be drawn.
//	 * @param drawLabel Indicates if the label should be drawn.
//	 */
//	public void drawState(mxICanvas canvas, mxCellState state, boolean drawLabel)
//	{
//		Object cell = (state != null) ? state.getCell() : null;
//
//		if (cell != null && cell != view.getCurrentRoot()
//				&& cell != model.getRoot()
//				&& (model.isVertex(cell) || model.isEdge(cell)))
//		{
//			Object obj = canvas.drawCell(state);
//			Object lab = null;
//
//			// Holds the current clipping region in case the label will
//			// be clipped
//			Shape clip = null;
//			Rectangle newClip = state.getRectangle();
//
//			// Indirection for image canvas that contains a graphics canvas
//			mxICanvas clippedCanvas = (isLabelClipped(state.getCell())) ? canvas
//					: null;
//
//			if (clippedCanvas instanceof mxImageCanvas)
//			{
//				clippedCanvas = ((mxImageCanvas) clippedCanvas)
//						.getGraphicsCanvas();
//				// TODO: Shift newClip to match the image offset
//				//Point pt = ((mxImageCanvas) canvas).getTranslate();
//				//newClip.translate(-pt.x, -pt.y);
//			}
//
//			if (clippedCanvas instanceof mxGraphics2DCanvas)
//			{
//				Graphics g = ((mxGraphics2DCanvas) clippedCanvas).getGraphics();
//				clip = g.getClip();
//
//				// Ensure that our new clip resides within our old clip
//				if (clip instanceof Rectangle)
//				{
//					g.setClip(newClip.intersection((Rectangle) clip));
//				}
//				// Otherwise, default to original implementation
//				else
//				{
//					g.setClip(newClip);
//				}
//			}
//
//			if (drawLabel)
//			{
//				String label = state.getLabel();
//
//				if (label != null && state.getLabelBounds() != null)
//				{
//					lab = canvas.drawLabel(label, state, isHtmlLabel(cell));
//				}
//			}
//
//			// Restores the previous clipping region
//			if (clippedCanvas instanceof mxGraphics2DCanvas)
//			{
//				((mxGraphics2DCanvas) clippedCanvas).getGraphics()
//						.setClip(clip);
//			}
//
//			// Invokes the cellDrawn callback with the object which was created
//			// by the canvas to represent the cell graphically
//			if (obj != null)
//			{
//				cellDrawn(canvas, state, obj, lab);
//			}
//		}
//	}
//
//	/**
//	 * Called when a cell has been painted as the specified object, typically a
//	 * DOM node that represents the given cell graphically in a document.
//	 */
//	protected void cellDrawn(mxICanvas canvas, mxCellState state,
//			Object element, Object labelElement)
//	{
//		if (element instanceof Element)
//		{
//			String link = getLinkForCell(state.getCell());
//
//			if (link != null)
//			{
//				String title = getToolTipForCell(state.getCell());
//				Element elem = (Element) element;
//
//				if (elem.getNodeName().startsWith("v:"))
//				{
//					elem.setAttribute("href", link.toString());
//
//					if (title != null)
//					{
//						elem.setAttribute("title", title);
//					}
//				}
//				else if (elem.getOwnerDocument().getElementsByTagName("svg")
//						.getLength() > 0)
//				{
//					Element xlink = elem.getOwnerDocument().createElement("a");
//					xlink.setAttribute("xlink:href", link.toString());
//
//					elem.getParentNode().replaceChild(xlink, elem);
//					xlink.appendChild(elem);
//
//					if (title != null)
//					{
//						xlink.setAttribute("xlink:title", title);
//					}
//
//					elem = xlink;
//				}
//				else
//				{
//					Element a = elem.getOwnerDocument().createElement("a");
//					a.setAttribute("href", link.toString());
//					a.setAttribute("style", "text-decoration:none;");
//
//					elem.getParentNode().replaceChild(a, elem);
//					a.appendChild(elem);
//
//					if (title != null)
//					{
//						a.setAttribute("title", title);
//					}
//
//					elem = a;
//				}
//
//				String target = getTargetForCell(state.getCell());
//
//				if (target != null)
//				{
//					elem.setAttribute("target", target);
//				}
//			}
//		}
//	}
//
//	/**
//	 * Returns the hyperlink to be used for the given cell.
//	 */
//	protected String getLinkForCell(Object cell)
//	{
//		return null;
//	}
//
//	/**
//	 * Returns the hyperlink to be used for the given cell.
//	 */
//	protected String getTargetForCell(Object cell)
//	{
//		return null;
//	}
//
//	//
//	// Redirected to change support
//	//
//
//	/**
//	 * @param listener
//	 * @see java.beans.PropertyChangeSupport#addPropertyChangeListener(java.beans.PropertyChangeListener)
//	 */
//	public void addPropertyChangeListener(PropertyChangeListener listener)
//	{
//		changeSupport.addPropertyChangeListener(listener);
//	}
//
//	/**
//	 * @param propertyName
//	 * @param listener
//	 * @see java.beans.PropertyChangeSupport#addPropertyChangeListener(java.lang.String, java.beans.PropertyChangeListener)
//	 */
//	public void addPropertyChangeListener(String propertyName,
//			PropertyChangeListener listener)
//	{
//		changeSupport.addPropertyChangeListener(propertyName, listener);
//	}
//
//	/**
//	 * @param listener
//	 * @see java.beans.PropertyChangeSupport#removePropertyChangeListener(java.beans.PropertyChangeListener)
//	 */
//	public void removePropertyChangeListener(PropertyChangeListener listener)
//	{
//		changeSupport.removePropertyChangeListener(listener);
//	}
//
//	/**
//	 * @param propertyName
//	 * @param listener
//	 * @see java.beans.PropertyChangeSupport#removePropertyChangeListener(java.lang.String, java.beans.PropertyChangeListener)
//	 */
//	public void removePropertyChangeListener(String propertyName,
//			PropertyChangeListener listener)
//	{
//		changeSupport.removePropertyChangeListener(propertyName, listener);
//	}
//
//	/**
//	 * Prints the version number on the console. 
//	 */
//	public static void main(String[] args)
//	{
//		System.out.println("mxGraph version \"" + VERSION + "\"");
//	}

}
