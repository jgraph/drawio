/**
 * Copyright (c) 2010, David Benson
 */
package com.mxgraph.util;

import java.util.List;

public class mxSpline
{
	/** 
	 *	Array representing the relative proportion of the total distance
	 *	of each point in the line ( i.e. first point is 0.0, end point is
	 *	1.0, a point halfway on line is 0.5 ).
	 */
	private double[] t;

	private mxSpline1D splineX;

	private mxSpline1D splineY;

	/**
	 * Total length tracing the points on the spline
	 */
	private double length;

	public mxSpline(List<mxPoint> points)
	{
		if (points != null)
		{
			double[] x = new double[points.size()];
			double[] y = new double[points.size()];
			int i = 0;

			for (mxPoint point : points)
			{
				x[i] = point.getX();
				y[i++] = point.getY();
			}

			init(x, y);
		}
	}

	/**
	 * Creates a new mxSpline.
	 * @param x
	 * @param y
	 */
	public void Spline2D(double[] x, double[] y)
	{
		init(x, y);
	}

	protected void init(double[] x, double[] y)
	{
		if (x.length != y.length)
		{
			// Arrays must have the same length
			// TODO log something
			return;
		}

		if (x.length < 2)
		{
			// Spline edges must have at least two points
			// TODO log something
			return;
		}

		t = new double[x.length];
		t[0] = 0.0; // start point is always 0.0
		length = 0.0;

		// Calculate the partial proportions of each section between each set
		// of points and the total length of sum of all sections
		for (int i = 1; i < t.length; i++)
		{
			double lx = x[i] - x[i - 1];
			double ly = y[i] - y[i - 1];

			// If either diff is zero there is no point performing the square root
			if (0.0 == lx)
			{
				t[i] = Math.abs(ly);
			}
			else if (0.0 == ly)
			{
				t[i] = Math.abs(lx);
			}
			else
			{
				t[i] = Math.sqrt(lx * lx + ly * ly);
			}

			length += t[i];
			t[i] += t[i - 1];
		}

		for (int j = 1; j < (t.length) - 1; j++)
		{
			t[j] = t[j] / length;
		}

		t[(t.length) - 1] = 1.0; // end point is always 1.0

		splineX = new mxSpline1D(t, x);
		splineY = new mxSpline1D(t, y);
	}

	/**
	 * @param t 0 <= t <= 1
	 */
	public mxPoint getPoint(double t)
	{
		mxPoint result = new mxPoint(splineX.getValue(t), splineY.getValue(t));

		return result;
	}

	/**
	 * Used to check the correctness of this spline
	 */
	public boolean checkValues()
	{
		return (splineX.len.length > 1 && splineY.len.length > 1);
	}

	public double getDx(double t)
	{
		return splineX.getDx(t);
	}

	public double getDy(double t)
	{
		return splineY.getDx(t);
	}

	public mxSpline1D getSplineX()
	{
		return splineX;
	}

	public mxSpline1D getSplineY()
	{
		return splineY;
	}

	public double getLength()
	{
		return length;
	}
}
