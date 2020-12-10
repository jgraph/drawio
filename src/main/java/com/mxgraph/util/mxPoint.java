/**
 * Copyright (c) 2007-2010, Gaudenz Alder, David Benson
 */
package com.mxgraph.util;

import java.awt.Point;
import java.awt.geom.Point2D;
import java.io.Serializable;

/**
 * Implements a 2-dimensional point with double precision coordinates.
 */
public class mxPoint implements Serializable, Cloneable
{

	/**
	 * 
	 */
	private static final long serialVersionUID = 6554231393215892186L;

	/**
	 * Holds the x- and y-coordinates of the point. Default is 0.
	 */
	protected double x, y;

	/**
	 * Constructs a new point at (0, 0).
	 */
	public mxPoint()
	{
		this(0, 0);
	}

	/**
	 * Constructs a new point at the location of the given point.
	 * 
	 * @param point Point that specifies the location.
	 */
	public mxPoint(Point2D point)
	{
		this(point.getX(), point.getY());
	}

	/**
	 * Constructs a new point at the location of the given point.
	 * 
	 * @param point Point that specifies the location.
	 */
	public mxPoint(mxPoint point)
	{
		this(point.getX(), point.getY());
	}

	/**
	 * Constructs a new point at (x, y).
	 * 
	 * @param x X-coordinate of the point to be created.
	 * @param y Y-coordinate of the point to be created.
	 */
	public mxPoint(double x, double y)
	{
		setX(x);
		setY(y);
	}

	/**
	 * Returns the x-coordinate of the point.
	 * 
	 * @return Returns the x-coordinate.
	 */
	public double getX()
	{
		return x;
	}

	/**
	 * Sets the x-coordinate of the point.
	 * 
	 * @param value Double that specifies the new x-coordinate.
	 */
	public void setX(double value)
	{
		x = value;
	}

	/**
	 * Returns the x-coordinate of the point.
	 * 
	 * @return Returns the x-coordinate.
	 */
	public double getY()
	{
		return y;
	}

	/**
	 * Sets the y-coordinate of the point.
	 * 
	 * @param value Double that specifies the new x-coordinate.
	 */
	public void setY(double value)
	{
		y = value;
	}

	/**
	 * Returns the coordinates as a new point.
	 * 
	 * @return Returns a new point for the location.
	 */
	public Point getPoint()
	{
		return new Point((int) Math.round(x), (int) Math.round(y));
	}

	/**
	 * 
	 * Returns true if the given object equals this rectangle.
	 */
	public boolean equals(Object obj)
	{
		if (obj instanceof mxPoint)
		{
			mxPoint pt = (mxPoint) obj;

			return pt.getX() == getX() && pt.getY() == getY();
		}

		return false;
	}

	/**
	 * Returns a new instance of the same point.
	 */
	public Object clone()
	{
		mxPoint clone;

		try
		{
			clone = (mxPoint) super.clone();
		}
		catch (CloneNotSupportedException e)
		{
			clone = new mxPoint();
		}

		clone.setX(getX());
		clone.setY(getY());

		return clone;
	}

	/**
	 * Returns a <code>String</code> that represents the value
	 * of this <code>mxPoint</code>.
	 * @return a string representation of this <code>mxPoint</code>.
	 */
	@Override
	public String toString()
	{
		StringBuilder builder = new StringBuilder(16);
		builder.append(getClass().getSimpleName());
		builder.append(" [");
		builder.append("x=");
		builder.append(x);
		builder.append(", y=");
		builder.append(y);
		builder.append("]");
		
		return builder.toString();
	}

}
