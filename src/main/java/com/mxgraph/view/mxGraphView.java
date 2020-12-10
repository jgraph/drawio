/**
 * Copyright (c) 2007-2010, Gaudenz Alder, David Benson
 */
package com.mxgraph.view;

import java.awt.geom.Line2D;
import java.util.ArrayList;
import java.util.Hashtable;
import java.util.List;
import java.util.Map;

import com.mxgraph.model.mxGeometry;
import com.mxgraph.model.mxGraphModel;
import com.mxgraph.model.mxIGraphModel;
import com.mxgraph.util.mxConstants;
import com.mxgraph.util.mxEvent;
import com.mxgraph.util.mxEventObject;
import com.mxgraph.util.mxEventSource;
import com.mxgraph.util.mxPoint;
import com.mxgraph.util.mxRectangle;
import com.mxgraph.util.mxUndoableEdit;
import com.mxgraph.util.mxUndoableEdit.mxUndoableChange;
import com.mxgraph.util.mxUtils;
import com.mxgraph.view.mxEdgeStyle.mxEdgeStyleFunction;
import com.mxgraph.view.mxPerimeter.mxPerimeterFunction;

/**
 * Implements a view for the graph. This class is in charge of computing the
 * absolute coordinates for the relative child geometries, the points for
 * perimeters and edge styles and keeping them cached in cell states for faster
 * retrieval. The states are updated whenever the model or the view state
 * (translate, scale) changes. The scale and translate are honoured in the
 * bounds.
 * 
 * This class fires the following events:
 * 
 * mxEvent.UNDO fires after the root was changed in setCurrentRoot. The
 * <code>edit</code> property contains the mxUndoableEdit which contains the
 * mxCurrentRootChange.
 * 
 * mxEvent.SCALE_AND_TRANSLATE fires after the scale and transle have been
 * changed in scaleAndTranslate. The <code>scale</code>,
 * <code>previousScale</code>, <code>translate</code> and
 * <code>previousTranslate</code> properties contain the new and previous scale
 * and translate, respectively.
 * 
 * mxEvent.SCALE fires after the scale was changed in setScale. The
 * <code>scale</code> and <code>previousScale</code> properties contain the new
 * and previous scale.
 * 
 * mxEvent.TRANSLATE fires after the translate was changed in setTranslate. The
 * <code>translate</code> and <code>previousTranslate</code> properties contain
 * the new and previous value for translate.
 * 
 * mxEvent.UP and mxEvent.DOWN fire if the current root is changed by executing
 * a mxCurrentRootChange. The event name depends on the location of the root in
 * the cell hierarchy with respect to the current root. The <code>root</code>
 * and <code>previous</code> properties contain the new and previous root,
 * respectively.
 */
public class mxGraphView extends mxEventSource
{
	/**
	 *
	 */
	private static mxPoint EMPTY_POINT = new mxPoint();

	/**
	 * Reference to the enclosing graph.
	 */
	protected mxGraph graph;

	/**
	 * mxCell that acts as the root of the displayed cell hierarchy.
	 */
	protected Object currentRoot = null;

	/**
	 * Caches the current bounds of the graph.
	 */
	protected mxRectangle graphBounds = new mxRectangle();

	/**
	 * Specifies the scale. Default is 1 (100%).
	 */
	protected double scale = 1;

	/**
	 * Point that specifies the current translation. Default is a new empty
	 * point.
	 */
	protected mxPoint translate = new mxPoint(0, 0);

	/**
	 * Maps from cells to cell states.
	 */
	protected Hashtable<Object, mxCellState> states = new Hashtable<Object, mxCellState>();

	/**
	 * Constructs a new view for the given graph.
	 * 
	 * @param graph
	 *            Reference to the enclosing graph.
	 */
	public mxGraphView(mxGraph graph)
	{
		this.graph = graph;
	}

	/**
	 * Returns the enclosing graph.
	 * 
	 * @return Returns the enclosing graph.
	 */
	public mxGraph getGraph()
	{
		return graph;
	}

	/**
	 * Returns the dictionary that maps from cells to states.
	 */
	public Hashtable<Object, mxCellState> getStates()
	{
		return states;
	}

	/**
	 * Returns the dictionary that maps from cells to states.
	 */
	public void setStates(Hashtable<Object, mxCellState> states)
	{
		this.states = states;
	}

	/**
	 * Returns the cached diagram bounds.
	 * 
	 * @return Returns the diagram bounds.
	 */
	public mxRectangle getGraphBounds()
	{
		return graphBounds;
	}

	/**
	 * Sets the graph bounds.
	 */
	public void setGraphBounds(mxRectangle value)
	{
		graphBounds = value;
	}

	/**
	 * Returns the current root.
	 */
	public Object getCurrentRoot()
	{
		return currentRoot;
	}

	/**
	 * Sets and returns the current root and fires an undo event.
	 * 
	 * @param root
	 *            mxCell that specifies the root of the displayed cell
	 *            hierarchy.
	 * @return Returns the object that represents the current root.
	 */
	public Object setCurrentRoot(Object root)
	{
		if (currentRoot != root)
		{
			mxCurrentRootChange change = new mxCurrentRootChange(this, root);
			change.execute();
			mxUndoableEdit edit = new mxUndoableEdit(this, false);
			edit.add(change);
			fireEvent(new mxEventObject(mxEvent.UNDO, "edit", edit));
		}

		return root;
	}

	/**
	 * Sets the scale and translation. Fires a "scaleAndTranslate" event after
	 * calling revalidate. Revalidate is only called if isEventsEnabled.
	 * 
	 * @param scale
	 *            Decimal value that specifies the new scale (1 is 100%).
	 * @param dx
	 *            X-coordinate of the translation.
	 * @param dy
	 *            Y-coordinate of the translation.
	 */
	public void scaleAndTranslate(double scale, double dx, double dy)
	{
		double previousScale = this.scale;
		Object previousTranslate = translate.clone();

		if (scale != this.scale || dx != translate.getX()
				|| dy != translate.getY())
		{
			this.scale = scale;
			translate = new mxPoint(dx, dy);

			if (isEventsEnabled())
			{
				revalidate();
			}
		}

		fireEvent(new mxEventObject(mxEvent.SCALE_AND_TRANSLATE, "scale",
				scale, "previousScale", previousScale, "translate", translate,
				"previousTranslate", previousTranslate));
	}

	/**
	 * Returns the current scale.
	 * 
	 * @return Returns the scale.
	 */
	public double getScale()
	{
		return scale;
	}

	/**
	 * Sets the current scale and revalidates the view. Fires a "scale" event
	 * after calling revalidate. Revalidate is only called if isEventsEnabled.
	 * 
	 * @param value
	 *            New scale to be used.
	 */
	public void setScale(double value)
	{
		double previousScale = scale;

		if (scale != value)
		{
			scale = value;

			if (isEventsEnabled())
			{
				revalidate();
			}
		}

		fireEvent(new mxEventObject(mxEvent.SCALE, "scale", scale,
				"previousScale", previousScale));
	}

	/**
	 * Returns the current translation.
	 * 
	 * @return Returns the translation.
	 */
	public mxPoint getTranslate()
	{
		return translate;
	}

	/**
	 * Sets the current translation and invalidates the view. Fires a property
	 * change event for "translate" after calling revalidate. Revalidate is only
	 * called if isEventsEnabled.
	 * 
	 * @param value
	 *            New translation to be used.
	 */
	public void setTranslate(mxPoint value)
	{
		Object previousTranslate = translate.clone();

		if (value != null
				&& (value.getX() != translate.getX() || value.getY() != translate
						.getY()))
		{
			translate = value;

			if (isEventsEnabled())
			{
				revalidate();
			}
		}

		fireEvent(new mxEventObject(mxEvent.TRANSLATE, "translate", translate,
				"previousTranslate", previousTranslate));
	}

	/**
	 * Returns the bounding box for an array of cells or null, if no cells are
	 * specified.
	 * 
	 * @param cells
	 * @return Returns the bounding box for the given cells.
	 */
	public mxRectangle getBounds(Object[] cells)
	{
		return getBounds(cells, false);
	}

	/**
	 * Returns the bounding box for an array of cells or null, if no cells are
	 * specified.
	 * 
	 * @param cells
	 * @return Returns the bounding box for the given cells.
	 */
	public mxRectangle getBoundingBox(Object[] cells)
	{
		return getBounds(cells, true);
	}

	/**
	 * Returns the bounding box for an array of cells or null, if no cells are
	 * specified.
	 * 
	 * @param cells
	 * @return Returns the bounding box for the given cells.
	 */
	public mxRectangle getBounds(Object[] cells, boolean boundingBox)
	{
		mxRectangle result = null;

		if (cells != null && cells.length > 0)
		{
			mxIGraphModel model = graph.getModel();

			for (int i = 0; i < cells.length; i++)
			{
				if (model.isVertex(cells[i]) || model.isEdge(cells[i]))
				{
					mxCellState state = getState(cells[i]);

					if (state != null)
					{
						mxRectangle tmp = (boundingBox) ? state
								.getBoundingBox() : state;

						if (tmp != null)
						{
							if (result == null)
							{
								result = new mxRectangle(tmp);
							}
							else
							{
								result.add(tmp);
							}
						}
					}
				}
			}
		}

		return result;
	}

	/**
	 * Removes all existing cell states and invokes validate.
	 */
	public void reload()
	{
		states.clear();
		validate();
	}

	/**
	 * 
	 */
	public void revalidate()
	{
		invalidate();
		validate();
	}

	/**
	 * Invalidates all cell states.
	 */
	public void invalidate()
	{
		invalidate(null);
	}

	/**
	 * Removes the state of the given cell and all descendants if the given cell
	 * is not the current root.
	 * 
	 * @param cell
	 * @param force
	 * @param recurse
	 */
	public void clear(Object cell, boolean force, boolean recurse)
	{
		removeState(cell);

		if (recurse && (force || cell != currentRoot))
		{
			mxIGraphModel model = graph.getModel();
			int childCount = model.getChildCount(cell);

			for (int i = 0; i < childCount; i++)
			{
				clear(model.getChildAt(cell, i), force, recurse);
			}
		}
		else
		{
			invalidate(cell);
		}
	}

	/**
	 * Invalidates the state of the given cell, all its descendants and
	 * connected edges.
	 */
	public void invalidate(Object cell)
	{
		mxIGraphModel model = graph.getModel();
		cell = (cell != null) ? cell : model.getRoot();
		mxCellState state = getState(cell);

		if (state == null || !state.isInvalid())
		{
			if (state != null)
			{
				state.setInvalid(true);
			}

			// Recursively invalidates all descendants
			int childCount = model.getChildCount(cell);

			for (int i = 0; i < childCount; i++)
			{
				Object child = model.getChildAt(cell, i);
				invalidate(child);
			}

			// Propagates invalidation to all connected edges
			int edgeCount = model.getEdgeCount(cell);

			for (int i = 0; i < edgeCount; i++)
			{
				invalidate(model.getEdgeAt(cell, i));
			}
		}
	}

	/**
	 * First validates all bounds and then validates all points recursively on
	 * all visible cells.
	 */
	public void validate()
	{
		mxRectangle graphBounds = getBoundingBox(validateCellState(validateCell((currentRoot != null) ? currentRoot
				: graph.getModel().getRoot())));
		setGraphBounds((graphBounds != null) ? graphBounds : new mxRectangle());
	}

	/**
	 * Shortcut to validateCell with visible set to true.
	 */
	public mxRectangle getBoundingBox(mxCellState state)
	{
		return getBoundingBox(state, true);
	}

	/**
	 * Returns the bounding box of the shape and the label for the given cell
	 * state and its children if recurse is true.
	 * 
	 * @param state
	 *            Cell state whose bounding box should be returned.
	 * @param recurse
	 *            Boolean indicating if the children should be included.
	 */
	public mxRectangle getBoundingBox(mxCellState state, boolean recurse)
	{
		mxRectangle bbox = null;

		if (state != null)
		{
			if (state.getBoundingBox() != null)
			{
				bbox = (mxRectangle) state.getBoundingBox().clone();
			}

			if (recurse)
			{
				mxIGraphModel model = graph.getModel();
				int childCount = model.getChildCount(state.getCell());

				for (int i = 0; i < childCount; i++)
				{
					mxRectangle bounds = getBoundingBox(
							getState(model.getChildAt(state.getCell(), i)), true);

					if (bounds != null)
					{
						if (bbox == null)
						{
							bbox = bounds;
						}
						else
						{
							bbox.add(bounds);
						}
					}
				}
			}
		}

		return bbox;
	}

	/**
	 * Shortcut to validateCell with visible set to true.
	 */
	public Object validateCell(Object cell)
	{
		return validateCell(cell, true);
	}

	/**
	 * Recursively creates the cell state for the given cell if visible is true
	 * and the given cell is visible. If the cell is not visible but the state
	 * exists then it is removed using removeState.
	 * 
	 * @param cell
	 *            Cell whose cell state should be created.
	 * @param visible
	 *            Boolean indicating if the cell should be visible.
	 */
	public Object validateCell(Object cell, boolean visible)
	{
		if (cell != null)
		{
			visible = visible && graph.isCellVisible(cell);
			mxCellState state = getState(cell, visible);

			if (state != null && !visible)
			{
				removeState(cell);
			}
			else
			{
				mxIGraphModel model = graph.getModel();
				int childCount = model.getChildCount(cell);

				for (int i = 0; i < childCount; i++)
				{
					validateCell(
							model.getChildAt(cell, i),
							visible
									&& (!graph.isCellCollapsed(cell) || cell == currentRoot));
				}
			}
		}

		return cell;
	}

	/**
	 * Shortcut to validateCellState with recurse set to true.
	 */
	public mxCellState validateCellState(Object cell)
	{
		return validateCellState(cell, true);
	}

	/**
	 * Validates the cell state for the given cell.
	 * 
	 * @param cell
	 *            Cell whose cell state should be validated.
	 * @param recurse
	 *            Boolean indicating if the children of the cell should be
	 *            validated.
	 */
	public mxCellState validateCellState(Object cell, boolean recurse)
	{
		mxCellState state = null;

		if (cell != null)
		{
			state = getState(cell);

			if (state != null)
			{
				mxIGraphModel model = graph.getModel();

				if (state.isInvalid())
				{
					state.setInvalid(false);

					if (cell != currentRoot)
					{
						validateCellState(model.getParent(cell), false);
					}

					state.setVisibleTerminalState(
							validateCellState(getVisibleTerminal(cell, true),
									false), true);
					state.setVisibleTerminalState(
							validateCellState(getVisibleTerminal(cell, false),
									false), false);
					
					updateCellState(state);

					if (model.isEdge(cell) || model.isVertex(cell))
					{
						updateLabelBounds(state);
						updateBoundingBox(state);
					}
				}

				if (recurse)
				{
					int childCount = model.getChildCount(cell);

					for (int i = 0; i < childCount; i++)
					{
						validateCellState(model.getChildAt(cell, i));
					}
				}
			}
		}

		return state;
	}

	/**
	 * Updates the given cell state.
	 * 
	 * @param state
	 *            Cell state to be updated.
	 */
	public void updateCellState(mxCellState state)
	{
		state.getAbsoluteOffset().setX(0);
		state.getAbsoluteOffset().setY(0);
		state.getOrigin().setX(0);
		state.getOrigin().setY(0);
		state.setLength(0);

		if (state.getCell() != currentRoot)
		{
			mxIGraphModel model = graph.getModel();
			mxCellState pState = getState(model.getParent(state.getCell()));

			if (pState != null && pState.getCell() != currentRoot)
			{
				state.getOrigin().setX(
						state.getOrigin().getX() + pState.getOrigin().getX());
				state.getOrigin().setY(
						state.getOrigin().getY() + pState.getOrigin().getY());
			}

			mxPoint offset = graph.getChildOffsetForCell(state.getCell());

			if (offset != null)
			{
				state.getOrigin()
						.setX(state.getOrigin().getX() + offset.getX());
				state.getOrigin()
						.setY(state.getOrigin().getY() + offset.getY());
			}

			mxGeometry geo = graph.getCellGeometry(state.getCell());

			if (geo != null)
			{
				if (!model.isEdge(state.getCell()))
				{
					mxPoint origin = state.getOrigin();
					offset = geo.getOffset();

					if (offset == null)
					{
						offset = EMPTY_POINT;
					}

					if (geo.isRelative() && pState != null)
					{
						if (model.isEdge(pState.getCell()))
						{
							mxPoint orig = getPoint(pState, geo);
							
							if (orig != null)
							{
								origin.setX(origin.getX()
										+ (orig.getX() / scale) - pState.getOrigin().getX()
										- translate.getX());
								origin.setY(origin.getY()
										+ (orig.getY() / scale) - pState.getOrigin().getY()
										- translate.getY());
							}
						}
						else
						{
							origin.setX(origin.getX() + geo.getX()
									* pState.getWidth() / scale + offset.getX());
							origin.setY(origin.getY() + geo.getY()
									* pState.getHeight() / scale
									+ offset.getY());
						}
					}
					else
					{
						state.setAbsoluteOffset(new mxPoint(scale
								* offset.getX(), scale * offset.getY()));
						origin.setX(origin.getX() + geo.getX());
						origin.setY(origin.getY() + geo.getY());
					}
				}

				state.setX(scale
						* (translate.getX() + state.getOrigin().getX()));
				state.setY(scale
						* (translate.getY() + state.getOrigin().getY()));
				state.setWidth(scale * geo.getWidth());
				state.setHeight(scale * geo.getHeight());

				if (model.isVertex(state.getCell()))
				{
					updateVertexState(state, geo);
				}

				if (model.isEdge(state.getCell()))
				{
					updateEdgeState(state, geo);
				}

				// Updates the cached label
				updateLabel(state);
			}
		}
	}

	/**
	 * Validates the given cell state.
	 */
	public void updateVertexState(mxCellState state, mxGeometry geo)
	{
		// LATER: Add support for rotation
		updateVertexLabelOffset(state);
	}

	/**
	 * Validates the given cell state.
	 */
	public void updateEdgeState(mxCellState state, mxGeometry geo)
	{
		mxCellState source = state.getVisibleTerminalState(true);
		mxCellState target = state.getVisibleTerminalState(false);

		// This will remove edges with no terminals and no terminal points
		// as such edges are invalid and produce NPEs in the edge styles.
		// Also removes connected edges that have no visible terminals.
		if ((graph.getModel().getTerminal(state.getCell(), true) != null && source == null)
				|| (source == null && geo.getTerminalPoint(true) == null)
				|| (graph.getModel().getTerminal(state.getCell(), false) != null && target == null)
				|| (target == null && geo.getTerminalPoint(false) == null))
		{
			clear(state.getCell(), true, true);
		}
		else
		{
			updateFixedTerminalPoints(state, source, target);
			updatePoints(state, geo.getPoints(), source, target);
			updateFloatingTerminalPoints(state, source, target);

			if (state.getCell() != getCurrentRoot()
					&& (state.getAbsolutePointCount() < 2
							|| state.getAbsolutePoint(0) == null || state
							.getAbsolutePoint(state.getAbsolutePointCount() - 1) == null))
			{
				// This will remove edges with invalid points from the list of
				// states in the view.
				// Happens if the one of the terminals and the corresponding
				// terminal point is null.
				clear(state.getCell(), true, true);
			}
			else
			{
				updateEdgeBounds(state);
				state.setAbsoluteOffset(getPoint(state, geo));
			}
		}
	}

	/**
	 * Updates the absoluteOffset of the given vertex cell state. This takes
	 * into account the label position styles.
	 * 
	 * @param state
	 *            Cell state whose absolute offset should be updated.
	 */
	public void updateVertexLabelOffset(mxCellState state)
	{
		String horizontal = mxUtils.getString(state.getStyle(),
				mxConstants.STYLE_LABEL_POSITION, mxConstants.ALIGN_CENTER);

		if (horizontal.equals(mxConstants.ALIGN_LEFT))
		{
			state.absoluteOffset.setX(state.absoluteOffset.getX()
					- state.getWidth());
		}
		else if (horizontal.equals(mxConstants.ALIGN_RIGHT))
		{
			state.absoluteOffset.setX(state.absoluteOffset.getX()
					+ state.getWidth());
		}

		String vertical = mxUtils.getString(state.getStyle(),
				mxConstants.STYLE_VERTICAL_LABEL_POSITION,
				mxConstants.ALIGN_MIDDLE);

		if (vertical.equals(mxConstants.ALIGN_TOP))
		{
			state.absoluteOffset.setY(state.absoluteOffset.getY()
					- state.getHeight());
		}
		else if (vertical.equals(mxConstants.ALIGN_BOTTOM))
		{
			state.absoluteOffset.setY(state.absoluteOffset.getY()
					+ state.getHeight());
		}
	}

	/**
	 * Updates the label of the given state.
	 */
	public void updateLabel(mxCellState state)
	{
		String label = graph.getLabel(state.getCell());
		Map<String, Object> style = state.getStyle();

		// Applies word wrapping to non-HTML labels and stores the result in the
		// state
		if (label != null
				&& label.length() > 0
				&& !graph.isHtmlLabel(state.getCell())
				&& !graph.getModel().isEdge(state.getCell())
				&& mxUtils.getString(style, mxConstants.STYLE_WHITE_SPACE,
						"nowrap").equals("wrap"))
		{
			double w = getWordWrapWidth(state);

			// The lines for wrapping within the given width are calculated for
			// no
			// scale. The reason for this is the granularity of actual displayed
			// font can cause the displayed lines to change based on scale. A
			// factor
			// is used to allow for different overalls widths, it ensures the
			// largest
			// font size/scale factor still stays within the bounds. All this
			// ensures
			// the wrapped lines are constant overing scaling, at the expense
			// the
			// label bounds will vary.
			String[] lines = mxUtils.wordWrap(label,
					mxUtils.getFontMetrics(mxUtils.getFont(state.getStyle())),
					w * mxConstants.LABEL_SCALE_BUFFER);

			if (lines.length > 0)
			{
				StringBuffer buffer = new StringBuffer();

				for (String line : lines)
				{
					buffer.append(line + '\n');
				}

				label = buffer.substring(0, buffer.length() - 1);
			}
		}

		state.setLabel(label);
	}

	/**
	 * Returns the width for wrapping the label of the given state at scale 1.
	 */
	public double getWordWrapWidth(mxCellState state)
	{
		Map<String, Object> style = state.getStyle();
		boolean horizontal = mxUtils.isTrue(style,
				mxConstants.STYLE_HORIZONTAL, true);
		double w = 0;

		// Computes the available width for the wrapped label
		if (horizontal)
		{
			w = (state.getWidth() / scale) - 2 * mxConstants.LABEL_INSET - 2
					* mxUtils.getDouble(style, mxConstants.STYLE_SPACING)
					- mxUtils.getDouble(style, mxConstants.STYLE_SPACING_LEFT)
					- mxUtils.getDouble(style, mxConstants.STYLE_SPACING_RIGHT);
		}
		else
		{
			w = (state.getHeight() / scale)
					- 2
					* mxConstants.LABEL_INSET
					- 2
					* mxUtils.getDouble(style, mxConstants.STYLE_SPACING)
					- mxUtils.getDouble(style, mxConstants.STYLE_SPACING_TOP)
					+ mxUtils
							.getDouble(style, mxConstants.STYLE_SPACING_BOTTOM);
		}

		return w;
	}

	/**
	 * Updates the label bounds in the given state.
	 */
	public void updateLabelBounds(mxCellState state)
	{
		Object cell = state.getCell();
		Map<String, Object> style = state.getStyle();
		String overflow = mxUtils.getString(style, mxConstants.STYLE_OVERFLOW,
				"");

		if (overflow.equals("fill"))
		{
			state.setLabelBounds(new mxRectangle(state));
		}
		else if (state.getLabel() != null)
		{
			// For edges, the width of the geometry is used for wrapping HTML
			// labels or no wrapping is applied if the width is set to 0
			mxRectangle vertexBounds = state;

			if (graph.getModel().isEdge(cell))
			{
				mxGeometry geo = graph.getCellGeometry(cell);

				if (geo != null && geo.getWidth() > 0)
				{
					vertexBounds = new mxRectangle(0, 0, geo.getWidth()
							* this.getScale(), 0);
				}
				else
				{
					vertexBounds = null;
				}
			}

			state.setLabelBounds(mxUtils.getLabelPaintBounds(state.getLabel(),
					style, graph.isHtmlLabel(cell), state.getAbsoluteOffset(),
					vertexBounds, scale, graph.getModel().isEdge(cell)));

			if (overflow.equals("width"))
			{
				state.getLabelBounds().setX(state.getX());
				state.getLabelBounds().setWidth(state.getWidth());
			}
		}
	}

	/**
	 * Updates the bounding box in the given cell state.
	 * 
	 * @param state
	 *            Cell state whose bounding box should be updated.
	 */
	public mxRectangle updateBoundingBox(mxCellState state)
	{
		// Gets the cell bounds and adds shadows and markers
		mxRectangle rect = new mxRectangle(state);
		Map<String, Object> style = state.getStyle();

		// Adds extra pixels for the marker and stroke assuming
		// that the border stroke is centered around the bounds
		// and the first pixel is drawn inside the bounds
		double strokeWidth = Math.max(
				1,
				Math.round(mxUtils.getInt(style, mxConstants.STYLE_STROKEWIDTH,
						1) * scale));
		strokeWidth -= Math.max(1, strokeWidth / 2);

		if (graph.getModel().isEdge(state.getCell()))
		{
			int ms = 0;

			if (style.containsKey(mxConstants.STYLE_ENDARROW)
					|| style.containsKey(mxConstants.STYLE_STARTARROW))
			{
				ms = (int) Math.round(mxConstants.DEFAULT_MARKERSIZE * scale);
			}

			// Adds the strokewidth
			rect.grow(ms + strokeWidth);

			// Adds worst case border for an arrow shape
			if (mxUtils.getString(style, mxConstants.STYLE_SHAPE, "").equals(
					mxConstants.SHAPE_ARROW))
			{
				rect.grow(mxConstants.ARROW_WIDTH / 2);
			}
		}
		else
		{
			rect.grow(strokeWidth);
		}

		// Adds extra pixels for the shadow
		if (mxUtils.isTrue(style, mxConstants.STYLE_SHADOW))
		{
			rect.setWidth(rect.getWidth() + mxConstants.SHADOW_OFFSETX);
			rect.setHeight(rect.getHeight() + mxConstants.SHADOW_OFFSETY);
		}

		// Adds oversize images in labels
		if (mxUtils.getString(style, mxConstants.STYLE_SHAPE, "").equals(
				mxConstants.SHAPE_LABEL))
		{
			if (mxUtils.getString(style, mxConstants.STYLE_IMAGE) != null)
			{
				double w = mxUtils.getInt(style, mxConstants.STYLE_IMAGE_WIDTH,
						mxConstants.DEFAULT_IMAGESIZE) * scale;
				double h = mxUtils.getInt(style,
						mxConstants.STYLE_IMAGE_HEIGHT,
						mxConstants.DEFAULT_IMAGESIZE)
						* scale;

				double x = state.getX();
				double y = 0;

				String imgAlign = mxUtils.getString(style,
						mxConstants.STYLE_IMAGE_ALIGN, mxConstants.ALIGN_LEFT);
				String imgValign = mxUtils.getString(style,
						mxConstants.STYLE_IMAGE_VERTICAL_ALIGN,
						mxConstants.ALIGN_MIDDLE);

				if (imgAlign.equals(mxConstants.ALIGN_RIGHT))
				{
					x += state.getWidth() - w;
				}
				else if (imgAlign.equals(mxConstants.ALIGN_CENTER))
				{
					x += (state.getWidth() - w) / 2;
				}

				if (imgValign.equals(mxConstants.ALIGN_TOP))
				{
					y = state.getY();
				}
				else if (imgValign.equals(mxConstants.ALIGN_BOTTOM))
				{
					y = state.getY() + state.getHeight() - h;
				}
				else
				// MIDDLE
				{
					y = state.getY() + (state.getHeight() - h) / 2;
				}

				rect.add(new mxRectangle(x, y, w, h));
			}
		}

		// Adds the rotated bounds to the bounding box if the
		// shape is rotated
		double rotation = mxUtils.getDouble(style, mxConstants.STYLE_ROTATION);
		mxRectangle bbox = mxUtils.getBoundingBox(rect, rotation);

		// Add the rotated bounding box to the non-rotated so
		// that all handles are also covered
		rect.add(bbox);

		// Unifies the cell bounds and the label bounds
		rect.add(state.getLabelBounds());

		state.setBoundingBox(rect);

		return rect;
	}

	/**
	 * Sets the initial absolute terminal points in the given state before the
	 * edge style is computed.
	 * 
	 * @param edge
	 *            Cell state whose initial terminal points should be updated.
	 * @param source
	 *            Cell state which represents the source terminal.
	 * @param target
	 *            Cell state which represents the target terminal.
	 */
	public void updateFixedTerminalPoints(mxCellState edge, mxCellState source,
			mxCellState target)
	{
		updateFixedTerminalPoint(edge, source, true,
				graph.getConnectionConstraint(edge, source, true));
		updateFixedTerminalPoint(edge, target, false,
				graph.getConnectionConstraint(edge, target, false));
	}

	/**
	 * Sets the fixed source or target terminal point on the given edge.
	 * 
	 * @param edge
	 *            Cell state whose initial terminal points should be updated.
	 */
	public void updateFixedTerminalPoint(mxCellState edge,
			mxCellState terminal, boolean source,
			mxConnectionConstraint constraint)
	{
		mxPoint pt = null;

		if (constraint != null)
		{
			pt = graph.getConnectionPoint(terminal, constraint);
		}

		if (pt == null && terminal == null)
		{
			mxPoint orig = edge.getOrigin();
			mxGeometry geo = graph.getCellGeometry(edge.getCell());
			pt = geo.getTerminalPoint(source);

			if (pt != null)
			{
				pt = new mxPoint(scale
						* (translate.getX() + pt.getX() + orig.getX()), scale
						* (translate.getY() + pt.getY() + orig.getY()));
			}
		}

		edge.setAbsoluteTerminalPoint(pt, source);
	}

	/**
	 * Updates the absolute points in the given state using the specified array
	 * of points as the relative points.
	 * 
	 * @param edge
	 *            Cell state whose absolute points should be updated.
	 * @param points
	 *            Array of points that constitute the relative points.
	 * @param source
	 *            Cell state that represents the source terminal.
	 * @param target
	 *            Cell state that represents the target terminal.
	 */
	public void updatePoints(mxCellState edge, List<mxPoint> points,
			mxCellState source, mxCellState target)
	{
		if (edge != null)
		{
			List<mxPoint> pts = new ArrayList<mxPoint>();
			pts.add(edge.getAbsolutePoint(0));
			mxEdgeStyleFunction edgeStyle = getEdgeStyle(edge, points, source,
					target);

			if (edgeStyle != null)
			{
				mxCellState src = getTerminalPort(edge, source, true);
				mxCellState trg = getTerminalPort(edge, target, false);

				edgeStyle.apply(edge, src, trg, points, pts);
			}
			else if (points != null)
			{
				for (int i = 0; i < points.size(); i++)
				{
					pts.add(transformControlPoint(edge, points.get(i)));
				}
			}

			pts.add(edge.getAbsolutePoint(edge.getAbsolutePointCount() - 1));
			edge.setAbsolutePoints(pts);
		}
	}

	/**
	 * Transforms the given control point to an absolute point.
	 */
	public mxPoint transformControlPoint(mxCellState state, mxPoint pt)
	{
		mxPoint origin = state.getOrigin();

		return new mxPoint(scale
				* (pt.getX() + translate.getX() + origin.getX()), scale
				* (pt.getY() + translate.getY() + origin.getY()));
	}

	/**
	 * Returns the edge style function to be used to compute the absolute points
	 * for the given state, control points and terminals.
	 */
	public mxEdgeStyleFunction getEdgeStyle(mxCellState edge,
			List<mxPoint> points, Object source, Object target)
	{
		Object edgeStyle = null;

		if (source != null && source == target)
		{
			edgeStyle = edge.getStyle().get(mxConstants.STYLE_LOOP);

			if (edgeStyle == null)
			{
				edgeStyle = graph.getDefaultLoopStyle();
			}
		}
		else if (!mxUtils.isTrue(edge.getStyle(),
				mxConstants.STYLE_NOEDGESTYLE, false))
		{
			edgeStyle = edge.getStyle().get(mxConstants.STYLE_EDGE);
		}

		// Converts string values to objects
		if (edgeStyle instanceof String)
		{
			String str = String.valueOf(edgeStyle);
			Object tmp = mxStyleRegistry.getValue(str);

			if (tmp == null)
			{
				tmp = mxUtils.eval(str);
			}

			edgeStyle = tmp;
		}

		if (edgeStyle instanceof mxEdgeStyleFunction)
		{
			return (mxEdgeStyleFunction) edgeStyle;
		}

		return null;
	}

	/**
	 * Updates the terminal points in the given state after the edge style was
	 * computed for the edge.
	 * 
	 * @param state
	 *            Cell state whose terminal points should be updated.
	 * @param source
	 *            Cell state that represents the source terminal.
	 * @param target
	 *            Cell state that represents the target terminal.
	 */
	public void updateFloatingTerminalPoints(mxCellState state,
			mxCellState source, mxCellState target)
	{
		mxPoint p0 = state.getAbsolutePoint(0);
		mxPoint pe = state.getAbsolutePoint(state.getAbsolutePointCount() - 1);

		if (pe == null && target != null)
		{
			updateFloatingTerminalPoint(state, target, source, false);
		}

		if (p0 == null && source != null)
		{
			updateFloatingTerminalPoint(state, source, target, true);
		}
	}

	/**
	 * Updates the absolute terminal point in the given state for the given
	 * start and end state, where start is the source if source is true.
	 * 
	 * @param edge
	 *            Cell state whose terminal point should be updated.
	 * @param start
	 *            Cell state for the terminal on "this" side of the edge.
	 * @param end
	 *            Cell state for the terminal on the other side of the edge.
	 * @param source
	 *            Boolean indicating if start is the source terminal state.
	 */
	public void updateFloatingTerminalPoint(mxCellState edge,
			mxCellState start, mxCellState end, boolean source)
	{
		start = getTerminalPort(edge, start, source);
		mxPoint next = getNextPoint(edge, end, source);
		double border = mxUtils.getDouble(edge.getStyle(),
				mxConstants.STYLE_PERIMETER_SPACING);
		border += mxUtils.getDouble(edge.getStyle(),
				(source) ? mxConstants.STYLE_SOURCE_PERIMETER_SPACING
						: mxConstants.STYLE_TARGET_PERIMETER_SPACING);
		mxPoint pt = getPerimeterPoint(start, next, graph.isOrthogonal(edge),
				border);
		edge.setAbsoluteTerminalPoint(pt, source);
	}

	/**
	 * Returns a cell state that represents the source or target terminal or
	 * port for the given edge.
	 */
	public mxCellState getTerminalPort(mxCellState state, mxCellState terminal,
			boolean source)
	{
		String key = (source) ? mxConstants.STYLE_SOURCE_PORT
				: mxConstants.STYLE_TARGET_PORT;
		String id = mxUtils.getString(state.style, key);

		if (id != null && graph.getModel() instanceof mxGraphModel)
		{
			mxCellState tmp = getState(((mxGraphModel) graph.getModel())
					.getCell(id));

			// Only uses ports where a cell state exists
			if (tmp != null)
			{
				terminal = tmp;
			}
		}

		return terminal;
	}

	/**
	 * Returns a point that defines the location of the intersection point
	 * between the perimeter and the line between the center of the shape and
	 * the given point.
	 */
	public mxPoint getPerimeterPoint(mxCellState terminal, mxPoint next,
			boolean orthogonal)
	{
		return getPerimeterPoint(terminal, next, orthogonal, 0);
	}

	/**
	 * Returns a point that defines the location of the intersection point
	 * between the perimeter and the line between the center of the shape and
	 * the given point.
	 * 
	 * @param terminal
	 *            Cell state for the source or target terminal.
	 * @param next
	 *            Point that lies outside of the given terminal.
	 * @param orthogonal
	 *            Boolean that specifies if the orthogonal projection onto the
	 *            perimeter should be returned. If this is false then the
	 *            intersection of the perimeter and the line between the next
	 *            and the center point is returned.
	 * @param border
	 *            Optional border between the perimeter and the shape.
	 */
	public mxPoint getPerimeterPoint(mxCellState terminal, mxPoint next,
			boolean orthogonal, double border)
	{
		mxPoint point = null;

		if (terminal != null)
		{
			mxPerimeterFunction perimeter = getPerimeterFunction(terminal);

			if (perimeter != null && next != null)
			{
				mxRectangle bounds = getPerimeterBounds(terminal, border);

				if (bounds.getWidth() > 0 || bounds.getHeight() > 0)
				{
					point = perimeter.apply(bounds, terminal, next, orthogonal);
				}
			}

			if (point == null)
			{
				point = getPoint(terminal);
			}
		}

		return point;
	}

	/**
	 * Returns the x-coordinate of the center point for automatic routing.
	 * 
	 * @return Returns the x-coordinate of the routing center point.
	 */
	public double getRoutingCenterX(mxCellState state)
	{
		float f = (state.getStyle() != null) ? mxUtils.getFloat(
				state.getStyle(), mxConstants.STYLE_ROUTING_CENTER_X) : 0;

		return state.getCenterX() + f * state.getWidth();
	}

	/**
	 * Returns the y-coordinate of the center point for automatic routing.
	 * 
	 * @return Returns the y-coordinate of the routing center point.
	 */
	public double getRoutingCenterY(mxCellState state)
	{
		float f = (state.getStyle() != null) ? mxUtils.getFloat(
				state.getStyle(), mxConstants.STYLE_ROUTING_CENTER_Y) : 0;

		return state.getCenterY() + f * state.getHeight();
	}

	/**
	 * Returns the perimeter bounds for the given terminal, edge pair.
	 */
	public mxRectangle getPerimeterBounds(mxCellState terminal, double border)
	{
		if (terminal != null)
		{
			border += mxUtils.getDouble(terminal.getStyle(),
					mxConstants.STYLE_PERIMETER_SPACING);
		}

		return terminal.getPerimeterBounds(border * scale);
	}

	/**
	 * Returns the perimeter function for the given state.
	 */
	public mxPerimeterFunction getPerimeterFunction(mxCellState state)
	{
		Object perimeter = state.getStyle().get(mxConstants.STYLE_PERIMETER);

		// Converts string values to objects
		if (perimeter instanceof String)
		{
			String str = String.valueOf(perimeter);
			Object tmp = mxStyleRegistry.getValue(str);

			if (tmp == null)
			{
				tmp = mxUtils.eval(str);
			}

			perimeter = tmp;
		}

		if (perimeter instanceof mxPerimeterFunction)
		{
			return (mxPerimeterFunction) perimeter;
		}

		return null;
	}

	/**
	 * Returns the nearest point in the list of absolute points or the center of
	 * the opposite terminal.
	 * 
	 * @param edge
	 *            Cell state that represents the edge.
	 * @param opposite
	 *            Cell state that represents the opposite terminal.
	 * @param source
	 *            Boolean indicating if the next point for the source or target
	 *            should be returned.
	 * @return Returns the nearest point of the opposite side.
	 */
	public mxPoint getNextPoint(mxCellState edge, mxCellState opposite,
			boolean source)
	{
		List<mxPoint> pts = edge.getAbsolutePoints();
		mxPoint point = null;

		if (pts != null && pts.size() >= 2)
		{
			int count = pts.size();
			int index = (source) ? Math.min(1, count - 1) : Math.max(0,
					count - 2);
			point = pts.get(index);
		}

		if (point == null && opposite != null)
		{
			point = new mxPoint(opposite.getCenterX(), opposite.getCenterY());
		}

		return point;
	}

	/**
	 * Returns the nearest ancestor terminal that is visible. The edge appears
	 * to be connected to this terminal on the display.
	 * 
	 * @param edge
	 *            Cell whose visible terminal should be returned.
	 * @param source
	 *            Boolean that specifies if the source or target terminal should
	 *            be returned.
	 * @return Returns the visible source or target terminal.
	 */
	public Object getVisibleTerminal(Object edge, boolean source)
	{
		mxIGraphModel model = graph.getModel();
		Object result = model.getTerminal(edge, source);
		Object best = result;

		while (result != null && result != currentRoot)
		{
			if (!graph.isCellVisible(best) || graph.isCellCollapsed(result))
			{
				best = result;
			}

			result = model.getParent(result);
		}

		// Checks if the result is not a layer
		if (model.getParent(best) == model.getRoot())
		{
			best = null;
		}

		return best;
	}

	/**
	 * Updates the given state using the bounding box of the absolute points.
	 * Also updates terminal distance, length and segments.
	 * 
	 * @param state
	 *            Cell state whose bounds should be updated.
	 */
	public void updateEdgeBounds(mxCellState state)
	{
		List<mxPoint> points = state.getAbsolutePoints();
		mxPoint p0 = points.get(0);
		mxPoint pe = points.get(points.size() - 1);

		if (p0.getX() != pe.getX() || p0.getY() != pe.getY())
		{
			double dx = pe.getX() - p0.getX();
			double dy = pe.getY() - p0.getY();
			state.setTerminalDistance(Math.sqrt(dx * dx + dy * dy));
		}
		else
		{
			state.setTerminalDistance(0);
		}

		double length = 0;
		double[] segments = new double[points.size() - 1];
		mxPoint pt = p0;

		double minX = pt.getX();
		double minY = pt.getY();
		double maxX = minX;
		double maxY = minY;

		for (int i = 1; i < points.size(); i++)
		{
			mxPoint tmp = points.get(i);

			if (tmp != null)
			{
				double dx = pt.getX() - tmp.getX();
				double dy = pt.getY() - tmp.getY();

				double segment = Math.sqrt(dx * dx + dy * dy);
				segments[i - 1] = segment;
				length += segment;
				pt = tmp;

				minX = Math.min(pt.getX(), minX);
				minY = Math.min(pt.getY(), minY);
				maxX = Math.max(pt.getX(), maxX);
				maxY = Math.max(pt.getY(), maxY);
			}
		}

		state.setLength(length);
		state.setSegments(segments);
		double markerSize = 1; // TODO: include marker size

		state.setX(minX);
		state.setY(minY);
		state.setWidth(Math.max(markerSize, maxX - minX));
		state.setHeight(Math.max(markerSize, maxY - minY));
	}

	/**
	 * Returns the absolute center point along the given edge.
	 */
	public mxPoint getPoint(mxCellState state)
	{
		return getPoint(state, null);
	}

	/**
	 * Returns the absolute point on the edge for the given relative geometry as
	 * a point. The edge is represented by the given cell state.
	 * 
	 * @param state
	 *            Represents the state of the parent edge.
	 * @param geometry
	 *            Optional geometry that represents the relative location.
	 * @return Returns the mxpoint that represents the absolute location of the
	 *         given relative geometry.
	 */
	public mxPoint getPoint(mxCellState state, mxGeometry geometry)
	{
		double x = state.getCenterX();
		double y = state.getCenterY();

		if (state.getSegments() != null
				&& (geometry == null || geometry.isRelative()))
		{
			double gx = (geometry != null) ? geometry.getX() / 2 : 0;
			int pointCount = state.getAbsolutePointCount();
			double dist = (gx + 0.5) * state.getLength();
			double[] segments = state.getSegments();
			double segment = segments[0];
			double length = 0;
			int index = 1;

			while (dist > length + segment && index < pointCount - 1)
			{
				length += segment;
				segment = segments[index++];
			}

			double factor = (segment == 0) ? 0 : (dist - length) / segment;
			mxPoint p0 = state.getAbsolutePoint(index - 1);
			mxPoint pe = state.getAbsolutePoint(index);

			if (p0 != null && pe != null)
			{
				double gy = 0;
				double offsetX = 0;
				double offsetY = 0;

				if (geometry != null)
				{
					gy = geometry.getY();
					mxPoint offset = geometry.getOffset();

					if (offset != null)
					{
						offsetX = offset.getX();
						offsetY = offset.getY();
					}
				}

				double dx = pe.getX() - p0.getX();
				double dy = pe.getY() - p0.getY();
				double nx = (segment == 0) ? 0 : dy / segment;
				double ny = (segment == 0) ? 0 : dx / segment;

				x = p0.getX() + dx * factor + (nx * gy + offsetX) * scale;
				y = p0.getY() + dy * factor - (ny * gy - offsetY) * scale;
			}
		}
		else if (geometry != null)
		{
			mxPoint offset = geometry.getOffset();

			if (offset != null)
			{
				x += offset.getX();
				y += offset.getY();
			}
		}

		return new mxPoint(x, y);
	}

	/**
	 * Gets the relative point that describes the given, absolute label position
	 * for the given edge state.
	 */
	public mxPoint getRelativePoint(mxCellState edgeState, double x, double y)
	{
		mxIGraphModel model = graph.getModel();
		mxGeometry geometry = model.getGeometry(edgeState.getCell());

		if (geometry != null)
		{
			int pointCount = edgeState.getAbsolutePointCount();

			if (geometry.isRelative() && pointCount > 1)
			{
				double totalLength = edgeState.getLength();
				double[] segments = edgeState.getSegments();

				// Works which line segment the point of the label is closest to
				mxPoint p0 = edgeState.getAbsolutePoint(0);
				mxPoint pe = edgeState.getAbsolutePoint(1);
				Line2D line = new Line2D.Double(p0.getPoint(), pe.getPoint());
				double minDist = line.ptSegDistSq(x, y);

				int index = 0;
				double tmp = 0;
				double length = 0;

				for (int i = 2; i < pointCount; i++)
				{
					tmp += segments[i - 2];
					pe = edgeState.getAbsolutePoint(i);

					line = new Line2D.Double(p0.getPoint(), pe.getPoint());
					double dist = line.ptSegDistSq(x, y);

					if (dist < minDist)
					{
						minDist = dist;
						index = i - 1;
						length = tmp;
					}

					p0 = pe;
				}

				double seg = segments[index];
				p0 = edgeState.getAbsolutePoint(index);
				pe = edgeState.getAbsolutePoint(index + 1);

				double x2 = p0.getX();
				double y2 = p0.getY();

				double x1 = pe.getX();
				double y1 = pe.getY();

				double px = x;
				double py = y;

				double xSegment = x2 - x1;
				double ySegment = y2 - y1;

				px -= x1;
				py -= y1;
				double projlenSq = 0;

				px = xSegment - px;
				py = ySegment - py;
				double dotprod = px * xSegment + py * ySegment;

				if (dotprod <= 0.0)
				{
					projlenSq = 0;
				}
				else
				{
					projlenSq = dotprod * dotprod
							/ (xSegment * xSegment + ySegment * ySegment);
				}

				double projlen = Math.sqrt(projlenSq);

				if (projlen > seg)
				{
					projlen = seg;
				}

				double yDistance = Line2D.ptLineDist(p0.getX(), p0.getY(),
						pe.getX(), pe.getY(), x, y);
				int direction = Line2D.relativeCCW(p0.getX(), p0.getY(),
						pe.getX(), pe.getY(), x, y);

				if (direction == -1)
				{
					yDistance = -yDistance;
				}

				// Constructs the relative point for the label
				return new mxPoint(
						Math.round(((totalLength / 2 - length - projlen) / totalLength)
								* -2), Math.round(yDistance / scale));
			}
		}

		return new mxPoint();
	}

	/**
	 * Returns the states for the given array of cells. The array contains all
	 * states that are not null, that is, the returned array may have less
	 * elements than the given array.
	 */
	public mxCellState[] getCellStates(Object[] cells)
	{
		List<mxCellState> result = new ArrayList<mxCellState>(cells.length);

		for (int i = 0; i < cells.length; i++)
		{
			mxCellState state = getState(cells[i]);

			if (state != null)
			{
				result.add(state);
			}
		}

		mxCellState[] resultArray = new mxCellState[result.size()];
		return result.toArray(resultArray);
	}

	/**
	 * Returns the state for the given cell or null if no state is defined for
	 * the cell.
	 * 
	 * @param cell
	 *            Cell whose state should be returned.
	 * @return Returns the state for the given cell.
	 */
	public mxCellState getState(Object cell)
	{
		return getState(cell, false);
	}

	/**
	 * Returns the cell state for the given cell. If create is true, then the
	 * state is created if it does not yet exist.
	 * 
	 * @param cell
	 *            Cell for which a new state should be returned.
	 * @param create
	 *            Boolean indicating if a new state should be created if it does
	 *            not yet exist.
	 * @return Returns the state for the given cell.
	 */
	public mxCellState getState(Object cell, boolean create)
	{
		mxCellState state = null;

		if (cell != null)
		{
			state = states.get(cell);

			if (state == null && create && graph.isCellVisible(cell))
			{
				state = createState(cell);
				states.put(cell, state);
			}
		}

		return state;
	}

	/**
	 * Removes and returns the mxCellState for the given cell.
	 * 
	 * @param cell
	 *            mxCell for which the mxCellState should be removed.
	 * @return Returns the mxCellState that has been removed.
	 */
	public mxCellState removeState(Object cell)
	{
		return (cell != null) ? (mxCellState) states.remove(cell) : null;
	}

	/**
	 * Creates and returns a cell state for the given cell.
	 * 
	 * @param cell
	 *            Cell for which a new state should be created.
	 * @return Returns a new state for the given cell.
	 */
	public mxCellState createState(Object cell)
	{
		return new mxCellState(this, cell, graph.getCellStyle(cell));
	}

	@Override
	public String toString()
	{
		StringBuilder builder = new StringBuilder(128);
		builder.append(getClass().getSimpleName());
		builder.append(" [");
		builder.append("currentRoot=");
		builder.append(currentRoot);
		builder.append(", graphBounds=");
		builder.append(graphBounds);
		builder.append(", scale=");
		builder.append(scale);
		builder.append(", translate=");
		builder.append(translate);
		builder.append("]");
		
		return builder.toString();
	}
	
	/**
	 * Action to change the current root in a view.
	 */
	public static class mxCurrentRootChange implements mxUndoableChange
	{

		/**
		 * 
		 */
		protected mxGraphView view;

		/**
		 * 
		 */
		protected Object root, previous;

		/**
		 * 
		 */
		protected boolean up;

		/**
		 * Constructs a change of the current root in the given view.
		 */
		public mxCurrentRootChange(mxGraphView view, Object root)
		{
			this.view = view;
			this.root = root;
			this.previous = this.root;
			this.up = (root == null);

			if (!up)
			{
				Object tmp = view.getCurrentRoot();
				mxIGraphModel model = view.graph.getModel();

				while (tmp != null)
				{
					if (tmp == root)
					{
						up = true;
						break;
					}

					tmp = model.getParent(tmp);
				}
			}
		}

		/**
		 * Returns the graph view where the change happened.
		 */
		public mxGraphView getView()
		{
			return view;
		}

		/**
		 * Returns the root.
		 */
		public Object getRoot()
		{
			return root;
		}

		/**
		 * Returns the previous root.
		 */
		public Object getPrevious()
		{
			return previous;
		}

		/**
		 * Returns true if the drilling went upwards.
		 */
		public boolean isUp()
		{
			return up;
		}

		/**
		 * Changes the current root of the view.
		 */
		public void execute()
		{
			Object tmp = view.getCurrentRoot();
			view.currentRoot = previous;
			previous = tmp;

			mxPoint translate = view.graph.getTranslateForRoot(view
					.getCurrentRoot());

			if (translate != null)
			{
				view.translate = new mxPoint(-translate.getX(),
						translate.getY());
			}

			// Removes all existing cell states and revalidates
			view.reload();
			up = !up;

			String eventName = (up) ? mxEvent.UP : mxEvent.DOWN;
			view.fireEvent(new mxEventObject(eventName, "root",
					view.currentRoot, "previous", previous));
		}

	}

}
