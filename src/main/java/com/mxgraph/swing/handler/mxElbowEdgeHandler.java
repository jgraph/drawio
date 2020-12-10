/**
 * Copyright (c) 2008, Gaudenz Alder
 */
package com.mxgraph.swing.handler;

import java.awt.Point;
import java.awt.Rectangle;
import java.awt.event.MouseEvent;
import java.util.List;

import com.mxgraph.model.mxGeometry;
import com.mxgraph.swing.mxGraphComponent;
import com.mxgraph.util.mxConstants;
import com.mxgraph.util.mxPoint;
import com.mxgraph.util.mxResources;
import com.mxgraph.view.mxCellState;
import com.mxgraph.view.mxGraphView;

/**
 * @author Administrator
 * 
 */
public class mxElbowEdgeHandler extends mxEdgeHandler
{

	/**
	 * 
	 * @param graphComponent
	 * @param state
	 */
	public mxElbowEdgeHandler(mxGraphComponent graphComponent, mxCellState state)
	{
		super(graphComponent, state);
	}

	/**
	 * Hook for subclassers to return tooltip texts for certain points on the
	 * handle.
	 */
	public String getToolTipText(MouseEvent e)
	{
		int index = getIndexAt(e.getX(), e.getY());

		if (index == 1)
		{
			return mxResources.get("doubleClickOrientation");
		}

		return null;
	}

	/**
	 * 
	 */
	protected boolean isFlipEvent(MouseEvent e)
	{
		return e.getClickCount() == 2 && index == 1;
	}

	/**
	 * Returns true if the given index is the index of the last handle.
	 */
	public boolean isLabel(int index)
	{
		return index == 3;
	}

	/**
	 * 
	 */
	protected Rectangle[] createHandles()
	{
		p = createPoints(state);
		Rectangle[] h = new Rectangle[4];

		mxPoint p0 = state.getAbsolutePoint(0);
		mxPoint pe = state.getAbsolutePoint(state.getAbsolutePointCount() - 1);

		h[0] = createHandle(p0.getPoint());
		h[2] = createHandle(pe.getPoint());

		// Creates the middle green edge handle
		mxGeometry geometry = graphComponent.getGraph().getModel().getGeometry(
				state.getCell());
		List<mxPoint> points = geometry.getPoints();
		Point pt = null;

		if (points == null || points.isEmpty())
		{
			pt = new Point((int) (Math.round(p0.getX()) + Math
					.round((pe.getX() - p0.getX()) / 2)), (int) (Math.round(p0
					.getY()) + Math.round((pe.getY() - p0.getY()) / 2)));
		}
		else
		{
			mxGraphView view = graphComponent.getGraph().getView();
			pt = view.transformControlPoint(state, points.get(0))
					.getPoint();
		}

		// Create the green middle handle
		h[1] = createHandle(pt);

		// Creates the yellow label handle
		h[3] = createHandle(state.getAbsoluteOffset().getPoint(),
				mxConstants.LABEL_HANDLE_SIZE);

		// Makes handle slightly bigger if the yellow label handle
		// exists and intersects this green handle
		if (isHandleVisible(3) && h[1].intersects(h[3]))
		{
			h[1] = createHandle(pt, mxConstants.HANDLE_SIZE + 3);
		}

		return h;
	}

}
