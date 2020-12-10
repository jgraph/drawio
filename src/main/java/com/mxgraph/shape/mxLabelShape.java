package com.mxgraph.shape;

import java.awt.Color;
import java.awt.GradientPaint;
import java.awt.Rectangle;
import java.awt.geom.GeneralPath;
import java.util.Map;

import com.mxgraph.canvas.mxGraphics2DCanvas;
import com.mxgraph.util.mxConstants;
import com.mxgraph.util.mxRectangle;
import com.mxgraph.util.mxUtils;
import com.mxgraph.view.mxCellState;

public class mxLabelShape extends mxImageShape
{

	/**
	 * 
	 */
	public void paintShape(mxGraphics2DCanvas canvas, mxCellState state)
	{
		super.paintShape(canvas, state);

		if (mxUtils.isTrue(state.getStyle(), mxConstants.STYLE_GLASS, false))
		{
			drawGlassEffect(canvas, state);
		}
	}

	/**
	 * Draws the glass effect
	 */
	public static void drawGlassEffect(mxGraphics2DCanvas canvas,
			mxCellState state)
	{
		double size = 0.4;
		canvas.getGraphics().setPaint(
				new GradientPaint((float) state.getX(), (float) state.getY(),
						new Color(1, 1, 1, 0.9f), (float) (state.getX()),
						(float) (state.getY() + state.getHeight() * size),
						new Color(1, 1, 1, 0.3f)));

		float sw = (float) (mxUtils.getFloat(state.getStyle(),
				mxConstants.STYLE_STROKEWIDTH, 1) * canvas.getScale() / 2);

		GeneralPath path = new GeneralPath();
		path.moveTo((float) state.getX() - sw, (float) state.getY() - sw);
		path.lineTo((float) state.getX() - sw,
				(float) (state.getY() + state.getHeight() * size));
		path.quadTo((float) (state.getX() + state.getWidth() * 0.5),
				(float) (state.getY() + state.getHeight() * 0.7),
				(float) (state.getX() + state.getWidth() + sw),
				(float) (state.getY() + state.getHeight() * size));
		path.lineTo((float) (state.getX() + state.getWidth() + sw),
				(float) state.getY() - sw);
		path.closePath();

		canvas.getGraphics().fill(path);
	}

	/**
	 * 
	 */
	public Rectangle getImageBounds(mxGraphics2DCanvas canvas, mxCellState state)
	{
		Map<String, Object> style = state.getStyle();
		double scale = canvas.getScale();
		String imgAlign = mxUtils.getString(style,
				mxConstants.STYLE_IMAGE_ALIGN, mxConstants.ALIGN_LEFT);
		String imgValign = mxUtils.getString(style,
				mxConstants.STYLE_IMAGE_VERTICAL_ALIGN,
				mxConstants.ALIGN_MIDDLE);
		int imgWidth = (int) (mxUtils.getInt(style,
				mxConstants.STYLE_IMAGE_WIDTH, mxConstants.DEFAULT_IMAGESIZE) * scale);
		int imgHeight = (int) (mxUtils.getInt(style,
				mxConstants.STYLE_IMAGE_HEIGHT, mxConstants.DEFAULT_IMAGESIZE) * scale);
		int spacing = (int) (mxUtils
				.getInt(style, mxConstants.STYLE_SPACING, 2) * scale);

		mxRectangle imageBounds = new mxRectangle(state);

		if (imgAlign.equals(mxConstants.ALIGN_CENTER))
		{
			imageBounds.setX(imageBounds.getX()
					+ (imageBounds.getWidth() - imgWidth) / 2);
		}
		else if (imgAlign.equals(mxConstants.ALIGN_RIGHT))
		{
			imageBounds.setX(imageBounds.getX() + imageBounds.getWidth()
					- imgWidth - spacing - 2);
		}
		else
		// LEFT
		{
			imageBounds.setX(imageBounds.getX() + spacing + 4);
		}

		if (imgValign.equals(mxConstants.ALIGN_TOP))
		{
			imageBounds.setY(imageBounds.getY() + spacing);
		}
		else if (imgValign.equals(mxConstants.ALIGN_BOTTOM))
		{
			imageBounds.setY(imageBounds.getY() + imageBounds.getHeight()
					- imgHeight - spacing);
		}
		else
		// MIDDLE
		{
			imageBounds.setY(imageBounds.getY()
					+ (imageBounds.getHeight() - imgHeight) / 2);
		}

		imageBounds.setWidth(imgWidth);
		imageBounds.setHeight(imgHeight);

		return imageBounds.getRectangle();
	}

	/**
	 * 
	 */
	public Color getFillColor(mxGraphics2DCanvas canvas, mxCellState state)
	{
		return mxUtils.getColor(state.getStyle(), mxConstants.STYLE_FILLCOLOR);
	}

	/**
	 * 
	 */
	public Color getStrokeColor(mxGraphics2DCanvas canvas, mxCellState state)
	{
		return mxUtils
				.getColor(state.getStyle(), mxConstants.STYLE_STROKECOLOR);
	}

	/**
	 * 
	 */
	public boolean hasGradient(mxGraphics2DCanvas canvas, mxCellState state)
	{
		return true;
	}

}
