package com.mxgraph.shape;

import com.mxgraph.canvas.mxGraphics2DCanvas;
import com.mxgraph.util.mxConstants;
import com.mxgraph.util.mxPoint;
import com.mxgraph.util.mxUtils;
import com.mxgraph.view.mxCellState;

public class mxLineShape extends mxBasicShape
{

	/**
	 * 
	 */
	public void paintShape(mxGraphics2DCanvas canvas, mxCellState state)
	{
		if (configureGraphics(canvas, state, false))
		{
			boolean rounded = mxUtils.isTrue(state.getStyle(),
					mxConstants.STYLE_ROUNDED, false)
					&& canvas.getScale() > mxConstants.MIN_SCALE_FOR_ROUNDED_LINES;

			canvas.paintPolyline(createPoints(canvas, state), rounded);
		}
	}

	/**
	 * 
	 */
	public mxPoint[] createPoints(mxGraphics2DCanvas canvas, mxCellState state)
	{
		String direction = mxUtils.getString(state.getStyle(),
				mxConstants.STYLE_DIRECTION, mxConstants.DIRECTION_EAST);

		mxPoint p0, pe;

		if (direction.equals(mxConstants.DIRECTION_EAST)
				|| direction.equals(mxConstants.DIRECTION_WEST))
		{
			double mid = state.getCenterY();
			p0 = new mxPoint(state.getX(), mid);
			pe = new mxPoint(state.getX() + state.getWidth(), mid);
		}
		else
		{
			double mid = state.getCenterX();
			p0 = new mxPoint(mid, state.getY());
			pe = new mxPoint(mid, state.getY() + state.getHeight());
		}

		mxPoint[] points = new mxPoint[2];
		points[0] = p0;
		points[1] = pe;

		return points;
	}

}
