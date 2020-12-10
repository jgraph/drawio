/**
 * Copyright (c) 2007-2010, Gaudenz Alder, David Benson
 */
package com.mxgraph.util;

import java.awt.Rectangle;
import java.awt.geom.Rectangle2D;

/**
 * Implements a 2-dimensional rectangle with double precision coordinates.
 */
public class mxRectangle extends mxPoint
{

	/**
	 * 
	 */
	private static final long serialVersionUID = -3793966043543578946L;

	/**
	 * Holds the width and the height. Default is 0.
	 */
	protected double width, height;

	/**
	 * Constructs a new rectangle at (0, 0) with the width and height set to 0.
	 */
	public mxRectangle()
	{
		this(0, 0, 0, 0);
	}

	/**
	 * Constructs a copy of the given rectangle.
	 * 
	 * @param rect Rectangle to construct a copy of.
	 */
	public mxRectangle(Rectangle2D rect)
	{
		this(rect.getX(), rect.getY(), rect.getWidth(), rect.getHeight());
	}

	/**
	 * Constructs a copy of the given rectangle.
	 * 
	 * @param rect Rectangle to construct a copy of.
	 */
	public mxRectangle(mxRectangle rect)
	{
		this(rect.getX(), rect.getY(), rect.getWidth(), rect.getHeight());
	}

	/**
	 * Constructs a rectangle using the given parameters.
	 * 
	 * @param x X-coordinate of the new rectangle.
	 * @param y Y-coordinate of the new rectangle.
	 * @param width Width of the new rectangle.
	 * @param height Height of the new rectangle.
	 */
	public mxRectangle(double x, double y, double width, double height)
	{
		super(x, y);

		setWidth(width);
		setHeight(height);
	}

	/**
	 * Returns the width of the rectangle.
	 * 
	 * @return Returns the width.
	 */
	public double getWidth()
	{
		return width;
	}

	/**
	 * Sets the width of the rectangle.
	 * 
	 * @param value Double that specifies the new width.
	 */
	public void setWidth(double value)
	{
		width = value;
	}

	/**
	 * Returns the height of the rectangle.
	 * 
	 * @return Returns the height.
	 */
	public double getHeight()
	{
		return height;
	}

	/**
	 * Sets the height of the rectangle.
	 * 
	 * @param value Double that specifies the new height.
	 */
	public void setHeight(double value)
	{
		height = value;
	}

	/**
	 * Sets this rectangle to the specified values
	 * 
	 * @param x the new x-axis position
	 * @param y the new y-axis position
	 * @param w the new width of the rectangle
	 * @param h the new height of the rectangle
	 */
	public void setRect(double x, double y, double w, double h)
	{
	    this.x = x;
	    this.y = y;
	    this.width = w;
	    this.height = h;
	}

	/**
	 * Adds the given rectangle to this rectangle.
	 */
	public void add(mxRectangle rect)
	{
		if (rect != null)
		{
			double minX = Math.min(x, rect.x);
			double minY = Math.min(y, rect.y);
			double maxX = Math.max(x + width, rect.x + rect.width);
			double maxY = Math.max(y + height, rect.y + rect.height);

			x = minX;
			y = minY;
			width = maxX - minX;
			height = maxY - minY;
		}
	}

	/**
	 * Returns the x-coordinate of the center.
	 * 
	 * @return Returns the x-coordinate of the center.
	 */
	public double getCenterX()
	{
		return getX() + getWidth() / 2;
	}

	/**
	 * Returns the y-coordinate of the center.
	 * 
	 * @return Returns the y-coordinate of the center.
	 */
	public double getCenterY()
	{
		return getY() + getHeight() / 2;
	}

	/**
	 * Grows the rectangle by the given amount, that is, this method subtracts
	 * the given amount from the x- and y-coordinates and adds twice the amount
	 * to the width and height.
	 *
	 * @param amount Amount by which the rectangle should be grown.
	 */
	public void grow(double amount)
	{
		x -= amount;
		y -= amount;
		width += 2 * amount;
		height += 2 * amount;
	}

	/**
	 * Returns true if the given point is contained in the rectangle.
	 * 
	 * @param x X-coordinate of the point.
	 * @param y Y-coordinate of the point.
	 * @return Returns true if the point is contained in the rectangle.
	 */
	public boolean contains(double x, double y)
	{
		return (this.x <= x && this.x + width >= x && this.y <= y && this.y
				+ height >= y);
	}

	/**
	 * Returns the point at which the specified point intersects the perimeter 
	 * of this rectangle or null if there is no intersection.
	 * 
	 * @param x0 the x co-ordinate of the first point of the line
	 * @param y0 the y co-ordinate of the first point of the line
	 * @param x1 the x co-ordinate of the second point of the line
	 * @param y1 the y co-ordinate of the second point of the line
	 * @return the point at which the line intersects this rectangle, or null
	 * 			if there is no intersection
	 */
	public mxPoint intersectLine(double x0, double y0, double x1, double y1)
	{
		mxPoint result = null;

		result = mxUtils.intersection(x, y, x + width, y, x0, y0, x1, y1);

		if (result == null)
		{
			result = mxUtils.intersection(x + width, y, x + width, y + height,
					x0, y0, x1, y1);
		}

		if (result == null)
		{
			result = mxUtils.intersection(x + width, y + height, x, y + height,
					x0, y0, x1, y1);
		}

		if (result == null)
		{
			result = mxUtils.intersection(x, y, x, y + height, x0, y0, x1, y1);
		}

		return result;
	}

	/**
	 * Returns the bounds as a new rectangle.
	 * 
	 * @return Returns a new rectangle for the bounds.
	 */
	public Rectangle getRectangle()
	{
		int ix = (int) Math.round(x);
		int iy = (int) Math.round(y);
		int iw = (int) Math.round(width - ix + x);
		int ih = (int) Math.round(height - iy + y);

		return new Rectangle(ix, iy, iw, ih);
	}
	
	/**
	 * Rotates this rectangle by 90 degree around its center point.
	 */
	public void rotate90()
	{
		double t = (this.width - this.height) / 2;
		this.x += t;
		this.y -= t;
		double tmp = this.width;
		this.width = this.height;
		this.height = tmp;
	};

	/**
	 * Returns true if the given object equals this rectangle.
	 */
	public boolean equals(Object obj)
	{
		if (obj instanceof mxRectangle)
		{
			mxRectangle rect = (mxRectangle) obj;

			return rect.getX() == getX() && rect.getY() == getY()
					&& rect.getWidth() == getWidth()
					&& rect.getHeight() == getHeight();
		}

		return false;
	}

	/**
	 * Returns a new instance of the same rectangle.
	 */
	public Object clone()
	{
		mxRectangle clone = (mxRectangle) super.clone();

		clone.setWidth(getWidth());
		clone.setHeight(getHeight());

		return clone;
	}

	/**
	 * Returns the <code>String</code> representation of this
	 * <code>mxRectangle</code>.
	 * @return a <code>String</code> representing this
	 * <code>mxRectangle</code>.
	 */
	@Override
	public String toString()
	{
		StringBuilder builder = new StringBuilder(32);
		builder.append(getClass().getSimpleName());
		builder.append(" [");
		builder.append("x=");
		builder.append(x);
		builder.append(", y=");
		builder.append(y);
		builder.append(", width=");
		builder.append(width);
		builder.append(", height=");
		builder.append(height);
		builder.append("]");
		
		return builder.toString();
	}

}
