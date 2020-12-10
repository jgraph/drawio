package com.mxgraph.shape;

import com.mxgraph.canvas.mxGraphics2DCanvas;
import com.mxgraph.canvas.mxGraphicsCanvas2D;
import com.mxgraph.util.mxConstants;
import com.mxgraph.util.mxRectangle;
import com.mxgraph.util.mxUtils;
import com.mxgraph.view.mxCellState;

public class mxSwimlaneShape extends mxBasicShape
{

	/**
	 * Returns the bounding box for the gradient box for this shape.
	 */
	protected double getTitleSize(mxGraphics2DCanvas canvas, mxCellState state)
	{
		return Math.max(
				0,
				mxUtils.getFloat(state.getStyle(), mxConstants.STYLE_STARTSIZE,
						mxConstants.DEFAULT_STARTSIZE) * canvas.getScale());
	};

	/**
	 * 
	 */
	protected mxRectangle getGradientBounds(mxGraphics2DCanvas canvas,
			mxCellState state)
	{
		double start = getTitleSize(canvas, state);

		if (mxUtils
				.isTrue(state.getStyle(), mxConstants.STYLE_HORIZONTAL, true))
		{
			start = Math.min(start, state.getHeight());

			return new mxRectangle(state.getX(), state.getY(),
					state.getWidth(), start);
		}
		else
		{
			start = Math.min(start, state.getWidth());

			return new mxRectangle(state.getX(), state.getY(), start,
					state.getHeight());
		}
	}

	/**
	 * 
	 */
	public void paintShape(mxGraphics2DCanvas canvas, mxCellState state)
	{
		double start = getTitleSize(canvas, state);
		String fill = mxUtils.getString(state.getStyle(),
				mxConstants.STYLE_SWIMLANE_FILLCOLOR, mxConstants.NONE);
		boolean swimlaneLine = mxUtils.isTrue(state.getStyle(),
				mxConstants.STYLE_SWIMLANE_LINE, true);
		double r = 0;

		if (mxUtils
				.isTrue(state.getStyle(), mxConstants.STYLE_HORIZONTAL, true))
		{
			start = Math.min(start, state.getHeight());
		}
		else
		{
			start = Math.min(start, state.getWidth());
		}

		canvas.getGraphics().translate(state.getX(), state.getY());

		if (!mxUtils.isTrue(state.getStyle(), mxConstants.STYLE_ROUNDED))
		{
			paintSwimlane(canvas, state, start, fill, swimlaneLine);
		}
		else
		{
			r = getArcSize(state, start);
			paintRoundedSwimlane(canvas, state, start, r, fill, swimlaneLine);
		}
		
		String sep = mxUtils.getString(state.getStyle(), mxConstants.STYLE_SEPARATORCOLOR, mxConstants.NONE);
		paintSeparator(canvas, state, start, sep);
	}

	/**
	 * Helper method to configure the given wrapper canvas.
	 */
	protected double getArcSize(mxCellState state, double start)
	{
		double f = mxUtils.getDouble(state.getStyle(),
				mxConstants.STYLE_ARCSIZE,
				mxConstants.RECTANGLE_ROUNDING_FACTOR * 100) / 100;

		return start * f * 3;
	}

	/**
	 * Helper method to configure the given wrapper canvas.
	 */
	protected mxGraphicsCanvas2D configureCanvas(mxGraphics2DCanvas canvas,
			mxCellState state, mxGraphicsCanvas2D c)
	{
		c.setShadow(hasShadow(canvas, state));
		c.setStrokeColor(mxUtils.getString(state.getStyle(),
				mxConstants.STYLE_STROKECOLOR, mxConstants.NONE));
		c.setStrokeWidth(mxUtils.getInt(state.getStyle(),
				mxConstants.STYLE_STROKEWIDTH, 1));
		c.setDashed(mxUtils.isTrue(state.getStyle(), mxConstants.STYLE_DASHED,
				false));

		String fill = mxUtils.getString(state.getStyle(),
				mxConstants.STYLE_FILLCOLOR, mxConstants.NONE);
		String gradient = mxUtils.getString(state.getStyle(),
				mxConstants.STYLE_GRADIENTCOLOR, mxConstants.NONE);

		if (!mxConstants.NONE.equals(fill)
				&& !mxConstants.NONE.equals(gradient))
		{
			mxRectangle b = getGradientBounds(canvas, state);
			c.setGradient(fill, gradient, b.getX(), b.getY(), b.getWidth(), b
					.getHeight(), mxUtils.getString(state.getStyle(),
					mxConstants.STYLE_GRADIENT_DIRECTION,
					mxConstants.DIRECTION_NORTH), 1, 1);
		}
		else
		{
			c.setFillColor(fill);
		}

		return c;
	}

	/**
	 * 
	 */
	protected void paintSwimlane(mxGraphics2DCanvas canvas, mxCellState state,
			double start, String fill, boolean swimlaneLine)
	{
		mxGraphicsCanvas2D c = configureCanvas(canvas, state,
				new mxGraphicsCanvas2D(canvas.getGraphics()));
		double w = state.getWidth();
		double h = state.getHeight();

		if (!mxConstants.NONE.equals(fill))
		{
			c.save();
			c.setFillColor(fill);
			c.rect(0, 0, w, h);
			c.fillAndStroke();
			c.restore();
			c.setShadow(false);
		}

		c.begin();

		if (mxUtils
				.isTrue(state.getStyle(), mxConstants.STYLE_HORIZONTAL, true))
		{
			c.moveTo(0, start);
			c.lineTo(0, 0);
			c.lineTo(w, 0);
			c.lineTo(w, start);

			if (swimlaneLine || start >= h)
			{
				c.close();
			}

			c.fillAndStroke();

			// Transparent content area
			if (start < h && mxConstants.NONE.equals(fill))
			{
				c.begin();
				c.moveTo(0, start);
				c.lineTo(0, h);
				c.lineTo(w, h);
				c.lineTo(w, start);
				c.stroke();
			}
		}
		else
		{
			c.moveTo(start, 0);
			c.lineTo(0, 0);
			c.lineTo(0, h);
			c.lineTo(start, h);

			if (swimlaneLine || start >= w)
			{
				c.close();
			}

			c.fillAndStroke();

			// Transparent content area
			if (start < w && mxConstants.NONE.equals(fill))
			{
				c.begin();
				c.moveTo(start, 0);
				c.lineTo(w, 0);
				c.lineTo(w, h);
				c.lineTo(start, h);
				c.stroke();
			}
		}
	};

	/**
	 * Function: paintRoundedSwimlane
	 *
	 * Paints the swimlane vertex shape.
	 */
	protected void paintRoundedSwimlane(mxGraphics2DCanvas canvas,
			mxCellState state, double start, double r, String fill,
			boolean swimlaneLine)
	{
		mxGraphicsCanvas2D c = configureCanvas(canvas, state,
				new mxGraphicsCanvas2D(canvas.getGraphics()));
		double w = state.getWidth();
		double h = state.getHeight();

		if (!mxConstants.NONE.equals(fill))
		{
			c.save();
			c.setFillColor(fill);
			c.roundrect(0, 0, w, h, r, r);
			c.fillAndStroke();
			c.restore();
			c.setShadow(false);
		}

		c.begin();

		if (mxUtils
				.isTrue(state.getStyle(), mxConstants.STYLE_HORIZONTAL, true))
		{
			c.moveTo(w, start);
			c.lineTo(w, r);
			c.quadTo(w, 0, w - Math.min(w / 2, r), 0);
			c.lineTo(Math.min(w / 2, r), 0);
			c.quadTo(0, 0, 0, r);
			c.lineTo(0, start);

			if (swimlaneLine || start >= h)
			{
				c.close();
			}

			c.fillAndStroke();

			// Transparent content area
			if (start < h && mxConstants.NONE.equals(fill))
			{
				c.begin();
				c.moveTo(0, start);
				c.lineTo(0, h - r);
				c.quadTo(0, h, Math.min(w / 2, r), h);
				c.lineTo(w - Math.min(w / 2, r), h);
				c.quadTo(w, h, w, h - r);
				c.lineTo(w, start);
				c.stroke();
			}
		}
		else
		{
			c.moveTo(start, 0);
			c.lineTo(r, 0);
			c.quadTo(0, 0, 0, Math.min(h / 2, r));
			c.lineTo(0, h - Math.min(h / 2, r));
			c.quadTo(0, h, r, h);
			c.lineTo(start, h);

			if (swimlaneLine || start >= w)
			{
				c.close();
			}

			c.fillAndStroke();

			// Transparent content area
			if (start < w && mxConstants.NONE.equals(fill))
			{
				c.begin();
				c.moveTo(start, h);
				c.lineTo(w - r, h);
				c.quadTo(w, h, w, h - Math.min(h / 2, r));
				c.lineTo(w, Math.min(h / 2, r));
				c.quadTo(w, 0, w - r, 0);
				c.lineTo(start, 0);
				c.stroke();
			}
		}
	};

	/**
	 * Function: paintSwimlane
	 *
	 * Paints the swimlane vertex shape.
	 */
	protected void paintSeparator(mxGraphics2DCanvas canvas, mxCellState state,
			double start, String color)
	{
		mxGraphicsCanvas2D c = new mxGraphicsCanvas2D(canvas.getGraphics());
		double w = state.getWidth();
		double h = state.getHeight();

		if (!mxConstants.NONE.equals(color))
		{
			c.setStrokeColor(color);
			c.setDashed(true);
			c.begin();

			if (mxUtils.isTrue(state.getStyle(), mxConstants.STYLE_HORIZONTAL,
					true))
			{
				c.moveTo(w, start);
				c.lineTo(w, h);
			}
			else
			{
				c.moveTo(start, 0);
				c.lineTo(w, 0);
			}

			c.stroke();
			c.setDashed(false);
		}
	};

}
