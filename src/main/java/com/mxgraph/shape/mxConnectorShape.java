/**
 * Copyright (c) 2010, Gaudenz Alder, David Benson
 */
package com.mxgraph.shape;

import java.awt.Color;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import com.mxgraph.canvas.mxGraphics2DCanvas;
import com.mxgraph.util.mxConstants;
import com.mxgraph.util.mxLine;
import com.mxgraph.util.mxPoint;
import com.mxgraph.util.mxUtils;
import com.mxgraph.view.mxCellState;

public class mxConnectorShape extends mxBasicShape
{

	/**
	 * 
	 */
	public void paintShape(mxGraphics2DCanvas canvas, mxCellState state)
	{
		if (state.getAbsolutePointCount() > 1
				&& configureGraphics(canvas, state, false))
		{
			List<mxPoint> pts = new ArrayList<mxPoint>(
					state.getAbsolutePoints());
			Map<String, Object> style = state.getStyle();

			// Paints the markers and updates the points
			// Switch off any dash pattern for markers
			boolean dashed = mxUtils.isTrue(style, mxConstants.STYLE_DASHED);
			Object dashedValue = style.get(mxConstants.STYLE_DASHED);

			if (dashed)
			{
				style.remove(mxConstants.STYLE_DASHED);
				canvas.getGraphics().setStroke(canvas.createStroke(style));
			}

			translatePoint(pts, 0,
					paintMarker(canvas, state, true));
			translatePoint(
					pts,
					pts.size() - 1,
					paintMarker(canvas, state, false));

			if (dashed)
			{
				// Replace the dash pattern
				style.put(mxConstants.STYLE_DASHED, dashedValue);
				canvas.getGraphics().setStroke(canvas.createStroke(style));
			}

			paintPolyline(canvas, pts, state.getStyle());
		}
	}

	/**
	 * 
	 */
	protected void paintPolyline(mxGraphics2DCanvas canvas,
			List<mxPoint> points, Map<String, Object> style)
	{
		boolean rounded = isRounded(style)
				&& canvas.getScale() > mxConstants.MIN_SCALE_FOR_ROUNDED_LINES;

		canvas.paintPolyline(points.toArray(new mxPoint[points.size()]),
				rounded);
	}

	/**
	 * 
	 */
	public boolean isRounded(Map<String, Object> style)
	{
		return mxUtils.isTrue(style, mxConstants.STYLE_ROUNDED, false);
	}

	/**
	 * 
	 */
	private void translatePoint(List<mxPoint> points, int index, mxPoint offset)
	{
		if (offset != null)
		{
			mxPoint pt = (mxPoint) points.get(index).clone();
			pt.setX(pt.getX() + offset.getX());
			pt.setY(pt.getY() + offset.getY());
			points.set(index, pt);
		}
	}

	/**
	 * Draws the marker for the given edge.
	 * 
	 * @return the offset of the marker from the end of the line
	 */
	public mxPoint paintMarker(mxGraphics2DCanvas canvas, mxCellState state, boolean source)
	{
		Map<String, Object> style = state.getStyle();
		float strokeWidth = (float) (mxUtils.getFloat(style,
				mxConstants.STYLE_STROKEWIDTH, 1) * canvas.getScale());
		String type = mxUtils.getString(style,
				(source) ? mxConstants.STYLE_STARTARROW
						: mxConstants.STYLE_ENDARROW, "");
		float size = (mxUtils.getFloat(style,
				(source) ? mxConstants.STYLE_STARTSIZE
						: mxConstants.STYLE_ENDSIZE,
				mxConstants.DEFAULT_MARKERSIZE));
		Color color = mxUtils.getColor(style, mxConstants.STYLE_STROKECOLOR);
		canvas.getGraphics().setColor(color);

		double absSize = size * canvas.getScale();

		List<mxPoint> points = state.getAbsolutePoints();
		mxLine markerVector = getMarkerVector(points, source, absSize);
		mxPoint p0 = new mxPoint(markerVector.getX(), markerVector.getY());
		mxPoint pe = markerVector.getEndPoint();

		mxPoint offset = null;

		// Computes the norm and the inverse norm
		double dx = pe.getX() - p0.getX();
		double dy = pe.getY() - p0.getY();

		double dist = Math.max(1, Math.sqrt(dx * dx + dy * dy));
		double unitX = dx / dist;
		double unitY = dy / dist;
		double nx = unitX * absSize;
		double ny = unitY * absSize;

		// Allow for stroke width in the end point used and the 
		// orthogonal vectors describing the direction of the
		// marker
		double strokeX = unitX * strokeWidth;
		double strokeY = unitY * strokeWidth;
		pe = (mxPoint) pe.clone();
		pe.setX(pe.getX() - strokeX / 2.0);
		pe.setY(pe.getY() - strokeY / 2.0);
		
		mxIMarker marker = mxMarkerRegistry.getMarker(type);
		
		if (marker != null)
		{
			offset = marker.paintMarker(canvas, state, type, pe, nx, ny, absSize, source);
			
			if (offset != null)
			{
				offset.setX(offset.getX() - strokeX / 2.0);
				offset.setY(offset.getY() - strokeY / 2.0);
			}
		}
		else
		{
			// Offset for the strokewidth
			nx = dx * strokeWidth / dist;
			ny = dy * strokeWidth / dist;

			offset = new mxPoint(-strokeX / 2.0, -strokeY / 2.0);
		}

		return offset;
	}

	/**
	 * Hook to override creation of the vector that the marker is drawn along
	 * since it may not be the same as the vector between any two control
	 * points
	 * @param points the guide points of the connector
	 * @param source whether the marker is at the source end
	 * @param markerSize the scaled maximum length of the marker
	 * @return a line describing the vector the marker should be drawn along
	 */
	protected mxLine getMarkerVector(List<mxPoint> points, boolean source,
			double markerSize)
	{
		int n = points.size();
		mxPoint p0 = (source) ? points.get(1) : points.get(n - 2);
		mxPoint pe = (source) ? points.get(0) : points.get(n - 1);
		int count = 1;
		
		// Uses next non-overlapping point
		while (count < n - 1 && Math.round(p0.getX() - pe.getX()) == 0 && Math.round(p0.getY() - pe.getY()) == 0)
		{
			p0 = (source) ? points.get(1 + count) : points.get(n - 2 - count);
			count++;
		}
		
		return new mxLine(p0, pe);
	}
	
}
