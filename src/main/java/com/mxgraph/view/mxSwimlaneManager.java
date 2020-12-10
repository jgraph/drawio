/**
 * Copyright (c) 2007, Gaudenz Alder
 */
package com.mxgraph.view;

import java.util.Map;

import com.mxgraph.model.mxGeometry;
import com.mxgraph.model.mxIGraphModel;
import com.mxgraph.util.mxConstants;
import com.mxgraph.util.mxEvent;
import com.mxgraph.util.mxEventObject;
import com.mxgraph.util.mxEventSource;
import com.mxgraph.util.mxRectangle;
import com.mxgraph.util.mxUtils;

/**
 * Manager for swimlanes and nested swimlanes that sets the size of newly added
 * swimlanes to that of their siblings, and propagates changes to the size of a
 * swimlane to its siblings, if siblings is true, and its ancestors, if
 * bubbling is true.
 */
public class mxSwimlaneManager extends mxEventSource
{

	/**
	 * Defines the type of the source or target terminal. The type is a string
	 * passed to mxCell.is to check if the rule applies to a cell.
	 */
	protected mxGraph graph;

	/**
	 * Optional string that specifies the value of the attribute to be passed
	 * to mxCell.is to check if the rule applies to a cell.
	 */
	protected boolean enabled;

	/**
	 * Optional string that specifies the attributename to be passed to
	 * mxCell.is to check if the rule applies to a cell.
	 */
	protected boolean horizontal;

	/**
	 * Specifies if newly added cells should be resized to match the size of their
	 * existing siblings. Default is true.
	 */
	protected boolean addEnabled;

	/**
	 * Specifies if resizing of swimlanes should be handled. Default is true.
	 */
	protected boolean resizeEnabled;

	/**
	 * 
	 */
	protected mxIEventListener addHandler = new mxIEventListener()
	{
		public void invoke(Object source, mxEventObject evt)
		{
			if (isEnabled() && isAddEnabled())
			{
				cellsAdded((Object[]) evt.getProperty("cells"));
			}
		}
	};

	/**
	 * 
	 */
	protected mxIEventListener resizeHandler = new mxIEventListener()
	{
		public void invoke(Object source, mxEventObject evt)
		{
			if (isEnabled() && isResizeEnabled())
			{
				cellsResized((Object[]) evt.getProperty("cells"));
			}
		}
	};

	/**
	 * 
	 */
	public mxSwimlaneManager(mxGraph graph)
	{
		setGraph(graph);
	}

	/**
	 * @return the enabled
	 */
	public boolean isEnabled()
	{
		return enabled;
	}

	/**
	 * @param value the enabled to set
	 */
	public void setEnabled(boolean value)
	{
		enabled = value;
	}

	/**
	 * @return the bubbling
	 */
	public boolean isHorizontal()
	{
		return horizontal;
	}

	/**
	 * @param value the bubbling to set
	 */
	public void setHorizontal(boolean value)
	{
		horizontal = value;
	}

	/**
	 * @return the addEnabled
	 */
	public boolean isAddEnabled()
	{
		return addEnabled;
	}

	/**
	 * @param value the addEnabled to set
	 */
	public void setAddEnabled(boolean value)
	{
		addEnabled = value;
	}

	/**
	 * @return the resizeEnabled
	 */
	public boolean isResizeEnabled()
	{
		return resizeEnabled;
	}

	/**
	 * @param value the resizeEnabled to set
	 */
	public void setResizeEnabled(boolean value)
	{
		resizeEnabled = value;
	}

	/**
	 * @return the graph
	 */
	public mxGraph getGraph()
	{
		return graph;
	}

	/**
	 * @param graph the graph to set
	 */
	public void setGraph(mxGraph graph)
	{
		if (this.graph != null)
		{
			this.graph.removeListener(addHandler);
			this.graph.removeListener(resizeHandler);
		}

		this.graph = graph;

		if (this.graph != null)
		{
			this.graph.addListener(mxEvent.ADD_CELLS, addHandler);
			this.graph.addListener(mxEvent.CELLS_RESIZED, resizeHandler);
		}
	}

	/**
	 *  Returns true if the given swimlane should be ignored.
	 */
	protected boolean isSwimlaneIgnored(Object swimlane)
	{
		return !getGraph().isSwimlane(swimlane);
	}

	/**
	 * Returns true if the given cell is horizontal. If the given cell is not a
	 * swimlane, then the <horizontal> value is returned.
	 */
	protected boolean isCellHorizontal(Object cell)
	{
		if (graph.isSwimlane(cell))
		{
			mxCellState state = graph.getView().getState(cell);
			Map<String, Object> style = (state != null) ? state.getStyle()
					: graph.getCellStyle(cell);

			return mxUtils.isTrue(style, mxConstants.STYLE_HORIZONTAL, true);
		}

		return !isHorizontal();
	}

	/**
	 * Called if any cells have been added. Calls swimlaneAdded for all swimlanes
	 * where isSwimlaneIgnored returns false.
	 */
	protected void cellsAdded(Object[] cells)
	{
		if (cells != null)
		{
			mxIGraphModel model = getGraph().getModel();

			model.beginUpdate();
			try
			{
				for (int i = 0; i < cells.length; i++)
				{
					if (!isSwimlaneIgnored(cells[i]))
					{
						swimlaneAdded(cells[i]);
					}
				}
			}
			finally
			{
				model.endUpdate();
			}
		}
	}

	/**
	 * Called for each swimlane which has been added. This finds a reference
	 * sibling swimlane and applies its size to the newly added swimlane. If no
	 * sibling can be found then the parent swimlane is resized so that the
	 * new swimlane fits into the parent swimlane.
	 */
	protected void swimlaneAdded(Object swimlane)
	{
		mxIGraphModel model = getGraph().getModel();
		Object parent = model.getParent(swimlane);
		int childCount = model.getChildCount(parent);
		mxGeometry geo = null;

		// Finds the first valid sibling swimlane as reference
		for (int i = 0; i < childCount; i++)
		{
			Object child = model.getChildAt(parent, i);

			if (child != swimlane && !this.isSwimlaneIgnored(child))
			{
				geo = model.getGeometry(child);

				if (geo != null)
				{
					break;
				}
			}
		}

		// Applies the size of the refernece to the newly added swimlane
		if (geo != null)
		{
			boolean parentHorizontal = (parent != null) ? isCellHorizontal(parent) : horizontal;
			resizeSwimlane(swimlane, geo.getWidth(), geo.getHeight(), parentHorizontal);
		}
	}

	/**
	 * Called if any cells have been resizes. Calls swimlaneResized for all
	 * swimlanes where isSwimlaneIgnored returns false.
	 */
	protected void cellsResized(Object[] cells)
	{
		if (cells != null)
		{
			mxIGraphModel model = this.getGraph().getModel();
			
			model.beginUpdate();
			try
			{
				// Finds the top-level swimlanes and adds offsets
				for (int i = 0; i < cells.length; i++)
				{
					if (!this.isSwimlaneIgnored(cells[i]))
					{
						mxGeometry geo = model.getGeometry(cells[i]);
						
						if (geo != null)
						{
							mxRectangle size = new mxRectangle(0, 0, geo.getWidth(), geo.getHeight());
							Object top = cells[i];
							Object current = top;
							
							while (current != null)
							{
								top = current;
								current = model.getParent(current);
								mxRectangle tmp = (graph.isSwimlane(current)) ?
										graph.getStartSize(current) :
										new mxRectangle();
								size.setWidth(size.getWidth() + tmp.getWidth());
								size.setHeight(size.getHeight() + tmp.getHeight());
							}
							
							boolean parentHorizontal = (current != null) ? isCellHorizontal(current) : horizontal;
							resizeSwimlane(top, size.getWidth(), size.getHeight(), parentHorizontal);
						}
					}
				}
			}
			finally
			{
				model.endUpdate();
			}
		}
	}

	/**
	 * Sets the width or height of the given swimlane to the given value depending
	 * on <horizontal>. If <horizontal> is true, then the width is set, otherwise,
	 * the height is set.
	 */
	protected void resizeSwimlane(Object swimlane, double w, double h, boolean parentHorizontal)
	{
		mxIGraphModel model = getGraph().getModel();

		model.beginUpdate();
		try
		{
			boolean horizontal = this.isCellHorizontal(swimlane);
			
			if (!this.isSwimlaneIgnored(swimlane))
			{
				mxGeometry geo = model.getGeometry(swimlane);

				if (geo != null)
				{

					if ((parentHorizontal && geo.getHeight() != h)
							|| (!parentHorizontal && geo.getWidth() != w))
					{
						geo = (mxGeometry) geo.clone();

						if (parentHorizontal)
						{
							geo.setHeight(h);
						}
						else
						{
							geo.setWidth(w);
						}

						model.setGeometry(swimlane, geo);
					}
				}
			}

			mxRectangle tmp = (graph.isSwimlane(swimlane)) ? graph
					.getStartSize(swimlane) : new mxRectangle();
			w -= tmp.getWidth();
			h -= tmp.getHeight();

			int childCount = model.getChildCount(swimlane);

			for (int i = 0; i < childCount; i++)
			{
				Object child = model.getChildAt(swimlane, i);
				resizeSwimlane(child, w, h, horizontal);
			}
		}
		finally
		{
			model.endUpdate();
		}
	}

	/**
	 * 
	 */
	public void destroy()
	{
		setGraph(null);
	}

}
