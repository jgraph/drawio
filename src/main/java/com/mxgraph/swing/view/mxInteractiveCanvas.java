/**
 * Copyright (c) 2007-2010, Gaudenz Alder, David Benson
 */
package com.mxgraph.swing.view;

import java.awt.Dimension;
import java.awt.Image;
import java.awt.Rectangle;
import java.awt.Shape;
import java.awt.image.ImageObserver;

import com.mxgraph.canvas.mxGraphics2DCanvas;
import com.mxgraph.shape.mxBasicShape;
import com.mxgraph.shape.mxIShape;
import com.mxgraph.swing.mxGraphComponent;
import com.mxgraph.util.mxConstants;
import com.mxgraph.util.mxPoint;
import com.mxgraph.util.mxUtils;
import com.mxgraph.view.mxCellState;

public class mxInteractiveCanvas extends mxGraphics2DCanvas
{
	/**
	 * 
	 */
	protected ImageObserver imageObserver = null;

	/**
	 * 
	 */
	public mxInteractiveCanvas()
	{
		this(null);
	}

	/**
	 * 
	 */
	public mxInteractiveCanvas(ImageObserver imageObserver)
	{
		setImageObserver(imageObserver);
	}

	/**
	 * 
	 */
	public void setImageObserver(ImageObserver value)
	{
		imageObserver = value;
	}

	/**
	 * 
	 */
	public ImageObserver getImageObserver()
	{
		return imageObserver;
	}

	/**
	 * Overrides graphics call to use image observer.
	 */
	protected void drawImageImpl(Image image, int x, int y)
	{
		g.drawImage(image, x, y, imageObserver);
	}

	/**
	 * Returns the size for the given image.
	 */
	protected Dimension getImageSize(Image image)
	{
		return new Dimension(image.getWidth(imageObserver),
				image.getHeight(imageObserver));
	}

	/**
	 * 
	 */
	public boolean contains(mxGraphComponent graphComponent, Rectangle rect,
			mxCellState state)
	{
		return state != null && state.getX() >= rect.x
				&& state.getY() >= rect.y
				&& state.getX() + state.getWidth() <= rect.x + rect.width
				&& state.getY() + state.getHeight() <= rect.y + rect.height;
	}

	/**
	 * 
	 */
	public boolean intersects(mxGraphComponent graphComponent, Rectangle rect,
			mxCellState state)
	{
		if (state != null)
		{
			// Checks if the label intersects
			if (state.getLabelBounds() != null
					&& state.getLabelBounds().getRectangle().intersects(rect))
			{
				return true;
			}

			int pointCount = state.getAbsolutePointCount();

			// Checks if the segments of the edge intersect
			if (pointCount > 0)
			{
				rect = (Rectangle) rect.clone();
				int tolerance = graphComponent.getTolerance();
				rect.grow(tolerance, tolerance);

				Shape realShape = null;

				// FIXME: Check if this should be used for all shapes
				if (mxUtils.getString(state.getStyle(),
						mxConstants.STYLE_SHAPE, "").equals(
						mxConstants.SHAPE_ARROW))
				{
					mxIShape shape = getShape(state.getStyle());

					if (shape instanceof mxBasicShape)
					{
						realShape = ((mxBasicShape) shape).createShape(this,
								state);
					}
				}

				if (realShape != null && realShape.intersects(rect))
				{
					return true;
				}
				else
				{
					mxPoint p0 = state.getAbsolutePoint(0);

					for (int i = 0; i < pointCount; i++)
					{
						mxPoint p1 = state.getAbsolutePoint(i);

						if (rect.intersectsLine(p0.getX(), p0.getY(),
								p1.getX(), p1.getY()))
						{
							return true;
						}

						p0 = p1;
					}
				}
			}
			else
			{
				// Checks if the bounds of the shape intersect
				return state.getRectangle().intersects(rect);
			}
		}

		return false;
	}

	/**
	 * Returns true if the given point is inside the content area of the given
	 * swimlane. (The content area of swimlanes is transparent to events.) This
	 * implementation does not check if the given state is a swimlane, it is
	 * assumed that the caller has checked this before using this method.
	 */
	public boolean hitSwimlaneContent(mxGraphComponent graphComponent,
			mxCellState swimlane, int x, int y)
	{
		if (swimlane != null)
		{
			int start = (int) Math.max(2, Math.round(mxUtils.getInt(
					swimlane.getStyle(), mxConstants.STYLE_STARTSIZE,
					mxConstants.DEFAULT_STARTSIZE)
					* graphComponent.getGraph().getView().getScale()));
			Rectangle rect = swimlane.getRectangle();

			if (mxUtils.isTrue(swimlane.getStyle(),
					mxConstants.STYLE_HORIZONTAL, true))
			{
				rect.y += start;
				rect.height -= start;
			}
			else
			{
				rect.x += start;
				rect.width -= start;
			}

			return rect.contains(x, y);
		}

		return false;
	}

}
