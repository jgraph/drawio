/**
 * Copyright (c) 2007, Gaudenz Alder
 */
package com.mxgraph.swing.util;

import java.awt.Graphics;
import java.util.HashMap;
import java.util.Map;

import com.mxgraph.model.mxGeometry;
import com.mxgraph.swing.mxGraphComponent;
import com.mxgraph.swing.view.mxCellStatePreview;
import com.mxgraph.util.mxEvent;
import com.mxgraph.util.mxEventObject;
import com.mxgraph.util.mxPoint;
import com.mxgraph.util.mxRectangle;
import com.mxgraph.view.mxCellState;
import com.mxgraph.view.mxGraph;

/**
 * Provides animation effects.
 */
public class mxMorphing extends mxAnimation
{

	/**
	 * Reference to the enclosing graph instance.
	 */
	protected mxGraphComponent graphComponent;

	/**
	 * Specifies the maximum number of steps for the morphing. Default is
	 * 6.
	 */
	protected int steps;

	/**
	 * Counts the current number of steps of the animation.
	 */
	protected int step;

	/**
	 * Ease-off for movement towards the given vector. Larger values are
	 * slower and smoother. Default is 1.5.
	 */
	protected double ease;

	/**
	 * Maps from cells to origins. 
	 */
	protected Map<Object, mxPoint> origins = new HashMap<Object, mxPoint>();

	/**
	 * Optional array of cells to limit the animation to. 
	 */
	protected Object[] cells;

	/**
	 * 
	 */
	protected transient mxRectangle dirty;

	/**
	 * 
	 */
	protected transient mxCellStatePreview preview;

	/**
	 * Constructs a new morphing instance for the given graph.
	 */
	public mxMorphing(mxGraphComponent graphComponent)
	{
		this(graphComponent, 6, 1.5, DEFAULT_DELAY);

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
	 * Constructs a new morphing instance for the given graph.
	 */
	public mxMorphing(mxGraphComponent graphComponent, int steps, double ease,
			int delay)
	{
		super(delay);
		this.graphComponent = graphComponent;
		this.steps = steps;
		this.ease = ease;
	}

	/**
	 * Returns the number of steps for the animation.
	 */
	public int getSteps()
	{
		return steps;
	}

	/**
	 * Sets the number of steps for the animation.
	 */
	public void setSteps(int value)
	{
		steps = value;
	}

	/**
	 * Returns the easing for the movements.
	 */
	public double getEase()
	{
		return ease;
	}

	/**
	 * Sets the easing for the movements.
	 */
	public void setEase(double value)
	{
		ease = value;
	}

	/**
	 * Optional array of cells to be animated. If this is not specified
	 * then all cells are checked and animated if they have been moved
	 * in the current transaction.
	 */
	public void setCells(Object[] value)
	{
		cells = value;
	}

	/**
	 * Animation step.
	 */
	public void updateAnimation()
	{
		super.updateAnimation();
		preview = new mxCellStatePreview(graphComponent, false);

		if (cells != null)
		{
			// Animates the given cells individually without recursion
			for (Object cell : cells)
			{
				animateCell(cell, preview, false);
			}
		}
		else
		{
			// Animates all changed cells by using recursion to find
			// the changed cells but not for the animation itself
			Object root = graphComponent.getGraph().getModel().getRoot();
			animateCell(root, preview, true);
		}

		show(preview);

		if (preview.isEmpty() || step++ >= steps)
		{
			stopAnimation();
		}
	};

	/**
	 * 
	 */
	public void stopAnimation()
	{
		graphComponent.getGraph().getView().revalidate();
		super.stopAnimation();

		preview = null;

		if (dirty != null)
		{
			graphComponent.getGraphControl().repaint(dirty.getRectangle());
		}
	}

	/**
	 * Shows the changes in the given mxCellStatePreview.
	 */
	protected void show(mxCellStatePreview preview)
	{
		if (dirty != null)
		{
			graphComponent.getGraphControl().repaint(dirty.getRectangle());
		}
		else
		{
			graphComponent.getGraphControl().repaint();
		}

		dirty = preview.show();

		if (dirty != null)
		{
			graphComponent.getGraphControl().repaint(dirty.getRectangle());
		}
	}

	/**
	 * Animates the given cell state using moveState.
	 */
	protected void animateCell(Object cell, mxCellStatePreview move,
			boolean recurse)
	{
		mxGraph graph = graphComponent.getGraph();
		mxCellState state = graph.getView().getState(cell);
		mxPoint delta = null;

		if (state != null)
		{
			// Moves the animated state from where it will be after the model
			// change by subtracting the given delta vector from that location
			delta = getDelta(state);

			if (graph.getModel().isVertex(cell)
					&& (delta.getX() != 0 || delta.getY() != 0))
			{
				mxPoint translate = graph.getView().getTranslate();
				double scale = graph.getView().getScale();

				// FIXME: Something wrong with the scale
				delta.setX(delta.getX() + translate.getX() * scale);
				delta.setY(delta.getY() + translate.getY() * scale);

				move.moveState(state, -delta.getX() / ease, -delta.getY()
						/ ease);
			}
		}

		if (recurse && !stopRecursion(state, delta))
		{
			int childCount = graph.getModel().getChildCount(cell);

			for (int i = 0; i < childCount; i++)
			{
				animateCell(graph.getModel().getChildAt(cell, i), move, recurse);
			}
		}
	}

	/**
	 * Returns true if the animation should not recursively find more
	 * deltas for children if the given parent state has been animated.
	 */
	protected boolean stopRecursion(mxCellState state, mxPoint delta)
	{
		return delta != null && (delta.getX() != 0 || delta.getY() != 0);
	}

	/**
	 * Returns the vector between the current rendered state and the future
	 * location of the state after the display will be updated.
	 */
	protected mxPoint getDelta(mxCellState state)
	{
		mxGraph graph = graphComponent.getGraph();
		mxPoint origin = getOriginForCell(state.getCell());
		mxPoint translate = graph.getView().getTranslate();
		double scale = graph.getView().getScale();
		mxPoint current = new mxPoint(state.getX() / scale - translate.getX(),
				state.getY() / scale - translate.getY());

		return new mxPoint((origin.getX() - current.getX()) * scale, (origin
				.getY() - current.getY())
				* scale);
	}

	/**
	 * Returns the top, left corner of the given cell.
	 */
	protected mxPoint getOriginForCell(Object cell)
	{
		mxPoint result = origins.get(cell);

		if (result == null)
		{
			mxGraph graph = graphComponent.getGraph();

			if (cell != null)
			{
				result = new mxPoint(getOriginForCell(graph.getModel()
						.getParent(cell)));
				mxGeometry geo = graph.getCellGeometry(cell);

				// TODO: Handle offset, relative geometries etc
				if (geo != null)
				{
					result.setX(result.getX() + geo.getX());
					result.setY(result.getY() + geo.getY());
				}
			}

			if (result == null)
			{
				mxPoint t = graph.getView().getTranslate();
				result = new mxPoint(-t.getX(), -t.getY());
			}

			origins.put(cell, result);
		}

		return result;
	}

	/**
	 *
	 */
	public void paint(Graphics g)
	{
		if (preview != null)
		{
			preview.paint(g);
		}
	}

}
