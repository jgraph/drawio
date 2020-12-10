/**
 * Copyright (c) 2008-2012, JGraph Ltd
 */
package com.mxgraph.swing.handler;

import java.awt.Graphics;
import java.awt.Rectangle;
import java.awt.event.MouseEvent;
import java.util.Collection;
import java.util.LinkedList;

import com.mxgraph.swing.mxGraphComponent;
import com.mxgraph.swing.util.mxSwingConstants;
import com.mxgraph.swing.view.mxCellStatePreview;
import com.mxgraph.util.mxEvent;
import com.mxgraph.util.mxEventObject;
import com.mxgraph.util.mxEventSource;
import com.mxgraph.util.mxRectangle;
import com.mxgraph.view.mxCellState;
import com.mxgraph.view.mxGraph;

/**
 * Connection handler creates new connections between cells. This control is used to display the connector
 * icon, while the preview is used to draw the line.
 */
public class mxMovePreview extends mxEventSource
{
	/**
	 * 
	 */
	protected mxGraphComponent graphComponent;

	/**
	 * Maximum number of cells to preview individually. Default is 200.
	 */
	protected int threshold = 200;

	/**
	 * Specifies if the placeholder rectangle should be used for all
	 * previews. Default is false. This overrides all other preview
	 * settings if true.
	 */
	protected boolean placeholderPreview = false;

	/**
	 * Specifies if the preview should use clones of the original shapes.
	 * Default is true.
	 */
	protected boolean clonePreview = true;

	/**
	 * Specifies if connected, unselected edges should be included in the
	 * preview. Default is true. This should not be used if cloning is
	 * enabled.
	 */
	protected boolean contextPreview = true;

	/**
	 * Specifies if the selection cells handler should be hidden while the
	 * preview is visible. Default is false.
	 */
	protected boolean hideSelectionHandler = false;

	/**
	 * 
	 */
	protected transient mxCellState startState;

	/**
	 * 
	 */
	protected transient mxCellState[] previewStates;

	/**
	 * 
	 */
	protected transient Object[] movingCells;

	/**
	 * 
	 */
	protected transient Rectangle initialPlaceholder;

	/**
	 * 
	 */
	protected transient Rectangle placeholder;

	/**
	 * 
	 */
	protected transient mxRectangle lastDirty;

	/**
	 * 
	 */
	protected transient mxCellStatePreview preview;

	/**
	 * Constructs a new rubberband selection for the given graph component.
	 * 
	 * @param graphComponent Component that contains the rubberband.
	 */
	public mxMovePreview(mxGraphComponent graphComponent)
	{
		this.graphComponent = graphComponent;

		// Installs the paint handler
		graphComponent.addListener(mxEvent.AFTER_PAINT, new mxIEventListener()
		{
			public void invoke(Object sender, mxEventObject evt)
			{
				Graphics g = (Graphics) evt.getProperty("g");
				paint(g);
			}
		});
	}

	/**
	 * 
	 */
	public int getThreshold()
	{
		return threshold;
	}

	/**
	 * 
	 */
	public void setThreshold(int value)
	{
		threshold = value;
	}

	/**
	 * 
	 */
	public boolean isPlaceholderPreview()
	{
		return placeholderPreview;
	}

	/**
	 * 
	 */
	public void setPlaceholderPreview(boolean value)
	{
		placeholderPreview = value;
	}

	/**
	 * 
	 */
	public boolean isClonePreview()
	{
		return clonePreview;
	}

	/**
	 * 
	 */
	public void setClonePreview(boolean value)
	{
		clonePreview = value;
	}

	/**
	 * 
	 */
	public boolean isContextPreview()
	{
		return contextPreview;
	}

	/**
	 * 
	 */
	public void setContextPreview(boolean value)
	{
		contextPreview = value;
	}

	/**
	 * 
	 */
	public boolean isHideSelectionHandler()
	{
		return hideSelectionHandler;
	}

	/**
	 * 
	 */
	public void setHideSelectionHandler(boolean value)
	{
		hideSelectionHandler = value;
	}

	/**
	 * 
	 */
	public boolean isActive()
	{
		return startState != null;
	}

	/**
	 * FIXME: Cells should be assigned outside of getPreviewStates
	 */
	public Object[] getMovingCells()
	{
		return movingCells;
	}

	/**
	 * 
	 */
	public Object[] getCells(mxCellState initialState)
	{
		mxGraph graph = graphComponent.getGraph();

		return graph.getMovableCells(graph.getSelectionCells());
	}

	/**
	 * Returns the states that are affected by the move operation.
	 */
	protected mxCellState[] getPreviewStates()
	{
		mxGraph graph = graphComponent.getGraph();
		Collection<mxCellState> result = new LinkedList<mxCellState>();

		for (Object cell : movingCells)
		{
			mxCellState cellState = graph.getView().getState(cell);

			if (cellState != null)
			{
				result.add(cellState);

				// Terminates early if too many cells
				if (result.size() >= threshold)
				{
					return null;
				}

				if (isContextPreview())
				{
					Object[] edges = graph.getAllEdges(new Object[] { cell });

					for (Object edge : edges)
					{
						if (!graph.isCellSelected(edge))
						{
							mxCellState edgeState = graph.getView().getState(
									edge);

							if (edgeState != null)
							{
								// Terminates early if too many cells
								if (result.size() >= threshold)
								{
									return null;
								}

								result.add(edgeState);
							}
						}
					}
				}
			}
		}

		return result.toArray(new mxCellState[result.size()]);
	}

	/**
	 * 
	 */
	protected boolean isCellOpaque(Object cell)
	{
		return startState != null && startState.getCell() == cell;
	}

	/**
	 * Sets the translation of the preview.
	 */
	public void start(MouseEvent e, mxCellState state)
	{
		startState = state;
		movingCells = getCells(state);
		previewStates = (!placeholderPreview) ? getPreviewStates() : null;

		if (previewStates == null || previewStates.length >= threshold)
		{
			placeholder = getPlaceholderBounds(startState).getRectangle();
			initialPlaceholder = new Rectangle(placeholder);
			graphComponent.getGraphControl().repaint(placeholder);
		}

		fireEvent(new mxEventObject(mxEvent.START, "event", e, "state",
				startState));
	}

	/**
	 * 
	 */
	protected mxRectangle getPlaceholderBounds(mxCellState startState)
	{
		mxGraph graph = graphComponent.getGraph();

		return graph.getView().getBounds(graph.getSelectionCells());
	}

	/**
	 * 
	 */
	public mxCellStatePreview createCellStatePreview()
	{
		return new mxCellStatePreview(graphComponent, isClonePreview())
		{
			protected float getOpacityForCell(Object cell)
			{
				if (isCellOpaque(cell))
				{
					return 1;
				}

				return super.getOpacityForCell(cell);
			}
		};
	}

	/**
	 * Sets the translation of the preview.
	 */
	public void update(MouseEvent e, double dx, double dy, boolean clone)
	{
		mxGraph graph = graphComponent.getGraph();

		if (placeholder != null)
		{
			Rectangle tmp = new Rectangle(placeholder);
			placeholder.x = initialPlaceholder.x + (int) dx;
			placeholder.y = initialPlaceholder.x + (int) dy;
			tmp.add(placeholder);
			graphComponent.getGraphControl().repaint(tmp);
		}
		else if (previewStates != null)
		{
			preview = createCellStatePreview();
			preview.setOpacity(graphComponent.getPreviewAlpha());

			// Combines the layout result with the move preview
			for (mxCellState previewState : previewStates)
			{
				preview.moveState(previewState, dx, dy, false, false);

				// FIXME: Move into show-handler?
				boolean visible = true;

				if ((dx != 0 || dy != 0) && clone && isContextPreview())
				{
					visible = false;
					Object tmp = previewState.getCell();

					while (!visible && tmp != null)
					{
						visible = graph.isCellSelected(tmp);
						tmp = graph.getModel().getParent(tmp);
					}
				}
			}

			mxRectangle dirty = lastDirty;

			lastDirty = preview.show();

			if (dirty != null)
			{
				dirty.add(lastDirty);
			}
			else
			{
				dirty = lastDirty;
			}

			if (dirty != null)
			{
				repaint(dirty);
			}
		}

		if (isHideSelectionHandler())
		{
			graphComponent.getSelectionCellsHandler().setVisible(false);
		}

		fireEvent(new mxEventObject(mxEvent.CONTINUE, "event", e, "dx", dx,
				"dy", dy));
	}

	/**
	 * 
	 */
	protected void repaint(mxRectangle dirty)
	{
		if (dirty != null)
		{
			graphComponent.getGraphControl().repaint(dirty.getRectangle());
		}
		else
		{
			graphComponent.getGraphControl().repaint();
		}
	}

	/**
	 * 
	 */
	protected void reset()
	{
		mxGraph graph = graphComponent.getGraph();

		if (placeholder != null)
		{
			Rectangle tmp = placeholder;
			placeholder = null;
			graphComponent.getGraphControl().repaint(tmp);
		}

		if (isHideSelectionHandler())
		{
			graphComponent.getSelectionCellsHandler().setVisible(true);
		}

		// Revalidates the screen
		// TODO: Should only revalidate moved cells
		if (!isClonePreview() && previewStates != null)
		{
			graph.getView().revalidate();
		}

		previewStates = null;
		movingCells = null;
		startState = null;
		preview = null;

		if (lastDirty != null)
		{
			graphComponent.getGraphControl().repaint(lastDirty.getRectangle());
			lastDirty = null;
		}
	}

	/**
	 *
	 */
	public Object[] stop(boolean commit, MouseEvent e, double dx, double dy,
			boolean clone, Object target)
	{
		Object[] cells = movingCells;
		reset();

		mxGraph graph = graphComponent.getGraph();
		graph.getModel().beginUpdate();
		try
		{
			if (commit)
			{
				double s = graph.getView().getScale();
				cells = graph.moveCells(cells, dx / s, dy / s, clone, target,
						e.getPoint());
			}

			fireEvent(new mxEventObject(mxEvent.STOP, "event", e, "commit",
					commit));
		}
		finally
		{
			graph.getModel().endUpdate();
		}

		return cells;
	}

	/**
	 *
	 */
	public void paint(Graphics g)
	{
		if (placeholder != null)
		{
			mxSwingConstants.PREVIEW_BORDER.paintBorder(graphComponent, g,
					placeholder.x, placeholder.y, placeholder.width,
					placeholder.height);
		}

		if (preview != null)
		{
			preview.paint(g);
		}
	}

}
