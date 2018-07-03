package com.mxgraph.view;

import java.util.List;
import java.util.Map;

import com.mxgraph.model.mxGraphModel;
import com.mxgraph.model.mxIGraphModel;
import com.mxgraph.util.mxConstants;
import com.mxgraph.util.mxEventObject;
import com.mxgraph.util.mxRectangle;
import com.mxgraph.util.mxUndoableEdit.mxUndoableChange;

public class mxGraphHeadless extends mxGraph
{
	/**
	 * Constructs a new graph with an empty
	 * {@link com.mxgraph.model.mxGraphModel}.
	 */
	public mxGraphHeadless()
	{
		this(null, null);
	}

	/**
	 * Constructs a new graph for the specified model. If no model is
	 * specified, then a new, empty {@link com.mxgraph.model.mxGraphModel} is
	 * used.
	 * 
	 * @param model Model that contains the graph data
	 */
	public mxGraphHeadless(mxIGraphModel model)
	{
		this(model, null);
	}

	/**
	 * Constructs a new graph for the specified model. If no model is
	 * specified, then a new, empty {@link com.mxgraph.model.mxGraphModel} is
	 * used.
	 * 
	 * @param stylesheet The stylesheet to use for the graph.
	 */
	public mxGraphHeadless(mxStylesheet stylesheet)
	{
		this(null, stylesheet);
	}

	/**
	 * Constructs a new graph for the specified model. If no model is
	 * specified, then a new, empty {@link com.mxgraph.model.mxGraphModel} is
	 * used.
	 * 
	 * @param model Model that contains the graph data
	 */
	public mxGraphHeadless(mxIGraphModel model, mxStylesheet stylesheet)
	{
		setModel((model != null) ? model : new mxGraphModel());
	}
	
	/**
	 * Constructs a new selection model to be used in this graph.
	 */
	protected mxGraphSelectionModel createSelectionModel()
	{
		return null;
	}
	
	/**
	 * Constructs a new stylesheet to be used in this graph.
	 */
	protected mxStylesheet createStylesheet()
	{
		return null;
	}
	
	/**
	 * Returns an array of key, value pairs representing the cell style for the
	 * given cell. If no string is defined in the model that specifies the
	 * style, then the default style for the cell is returned or <EMPTY_ARRAY>,
	 * if not style can be found.
	 * 
	 * @param cell Cell whose style should be returned.
	 * @return Returns the style of the cell.
	 */
	public Map<String, Object> getCellStyle(Object cell)
	{
		return mxStylesheet.EMPTY_STYLE;
	}
	
	/**
	 * Called when the graph model changes. Invokes processChange on each
	 * item of the given array to update the view accordingly.
	 * 
	 * Overriden to remove validation of view
	 */
	public mxRectangle graphModelChanged(mxIGraphModel sender,
			List<mxUndoableChange> changes)
	{
		return null;
	}
	
	/**
	 * Dispatches the given event name with this object as the event source.
	 * <code>fireEvent(new mxEventObject("eventName", key1, val1, .., keyN, valN))</code>
	 * 
	 */
	public void fireEvent(mxEventObject evt) {}
	
	/**
	 * Returns true if the given cell is a swimlane. This implementation always
	 * returns false.
	 * 
	 * @param cell Cell that should be checked. 
	 * @return Returns true if the cell is a swimlane.
	 */
	public boolean isSwimlane(Object cell)
	{
		if (cell != null)
		{
			if (model.getParent(cell) != model.getRoot())
			{
				mxCellState state = view.getState(cell);
				Map<String, Object> style = (state != null) ? state.getStyle()
						: getCellStyle(cell);

				if (style != null && !model.isEdge(cell))
				{
					return getString(style, mxConstants.STYLE_SHAPE, "")
							.equals(mxConstants.SHAPE_SWIMLANE);
				}
			}
		}

		return false;
	}
	
	public String getString(Map<String, Object> dict, String key,
			String defaultValue)
	{
		Object value = dict.get(key);

		if (value == null)
		{
			return defaultValue;
		}
		else
		{
			return value.toString();
		}
	}
}
