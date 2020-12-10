/**
 * Copyright (c) 2007-2012, JGraph Ltd
 */
package com.mxgraph.shape;

import java.awt.Rectangle;
import java.util.Map;

import com.mxgraph.canvas.mxGraphics2DCanvas;
import com.mxgraph.swing.util.mxSwingConstants;
import com.mxgraph.util.mxConstants;
import com.mxgraph.util.mxUtils;
import com.mxgraph.view.mxCellState;

public class mxRectangleShape extends mxBasicShape
{

	/**
	 * 
	 */
	public void paintShape(mxGraphics2DCanvas canvas, mxCellState state)
	{
		Map<String, Object> style = state.getStyle();

		if (mxUtils.isTrue(style, mxConstants.STYLE_ROUNDED, false))
		{
			Rectangle tmp = state.getRectangle();

			int x = tmp.x;
			int y = tmp.y;
			int w = tmp.width;
			int h = tmp.height;
			int radius = getArcSize(state, w, h);

			boolean shadow = hasShadow(canvas, state);
			int shadowOffsetX = (shadow) ? mxConstants.SHADOW_OFFSETX : 0;
			int shadowOffsetY = (shadow) ? mxConstants.SHADOW_OFFSETY : 0;

			if (canvas.getGraphics().hitClip(x, y, w + shadowOffsetX,
					h + shadowOffsetY))
			{
				// Paints the optional shadow
				if (shadow)
				{
					canvas.getGraphics().setColor(mxSwingConstants.SHADOW_COLOR);
					canvas.getGraphics().fillRoundRect(
							x + mxConstants.SHADOW_OFFSETX,
							y + mxConstants.SHADOW_OFFSETY, w, h, radius,
							radius);
				}

				// Paints the background
				if (configureGraphics(canvas, state, true))
				{
					canvas.getGraphics().fillRoundRect(x, y, w, h, radius,
							radius);
				}

				// Paints the foreground
				if (configureGraphics(canvas, state, false))
				{
					canvas.getGraphics().drawRoundRect(x, y, w, h, radius,
							radius);
				}
			}
		}
		else
		{
			Rectangle rect = state.getRectangle();

			// Paints the background
			if (configureGraphics(canvas, state, true))
			{
				canvas.fillShape(rect, hasShadow(canvas, state));
			}

			// Paints the foreground
			if (configureGraphics(canvas, state, false))
			{
				canvas.getGraphics().drawRect(rect.x, rect.y, rect.width,
						rect.height);
			}
		}
	}

	/**
	 * Helper method to configure the given wrapper canvas.
	 */
	protected int getArcSize(mxCellState state, double w, double h)
	{
		double f = mxUtils.getDouble(state.getStyle(),
				mxConstants.STYLE_ARCSIZE,
				mxConstants.RECTANGLE_ROUNDING_FACTOR * 100) / 100;

		return (int) (Math.min(w,  h) * f * 2);
	}

}
