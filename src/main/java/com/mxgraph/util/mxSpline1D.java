/**
 * Copyright (c) 2010, David Benson
 */
package com.mxgraph.util;

import java.util.Arrays;

/**
 * One dimension of a spline curve
 */
public class mxSpline1D
{
	protected double[] len;
	protected double[] pos1D;

	protected double[] a;
	protected double[] b;
	protected double[] c;
	protected double[] d;

	/** tracks the last index found since that is mostly commonly the next one used */
	private int storageIndex = 0;
	
	/**
	 * Creates a new Spline.
	 * @param controlPointProportions the proportion along the curve, from 0->1
	 * 			that each control point lies on
	 * @param positions1D the co-ordinate position in the current dimension that
	 * 			each control point lies on
	 */
	public mxSpline1D(double[] controlPointProportions, double[] positions1D)
	{
		setValues(controlPointProportions, positions1D);
	}

	/**
	 * Set values for this Spline.
	 * @param controlPointProportions the proportion along the curve, from 0->1
	 * 			that each control point lies on
	 * @param positions1D the co-ordinate position in the current dimension that
	 * 			each control point lies on
	 */
	public void setValues(double[] controlPointProportions, double[] positions1D)
	{
		this.len = controlPointProportions;
		this.pos1D = positions1D;
		
		if (len.length > 1)
		{
			calculateCoefficients();
		}
	}

	/**
	 * Returns an interpolated value.
	 * @param x
	 * @return the interpolated value
	 */
	public double getValue(double x)
	{
		if (len.length == 0)
		{
			return Double.NaN;
		}

		if (len.length == 1)
		{
			if (len[0] == x)
			{
				return pos1D[0];
			}
			else
			{
				return Double.NaN;
			}
		}

		int index = Arrays.binarySearch(len, x);
		if (index > 0)
		{
			return pos1D[index];
		}

		index = - (index + 1) - 1;
		//TODO linear interpolation or extrapolation
		if (index < 0) {
			return pos1D[0];
		}

		return a[index]
			+ b[index] * (x - len[index])
			+ c[index] * Math.pow(x - len[index], 2)
			+ d[index] * Math.pow(x - len[index], 3);
	}

	/**
	 * Returns an interpolated value. To be used when a long sequence of values
	 * are required in order, but ensure checkValues() is called beforehand to
	 * ensure the boundary checks from getValue() are made
	 * @param x
	 * @return the interpolated value
	 */
	public double getFastValue(double x)
	{
		// Fast check to see if previous index is still valid
		if (storageIndex > -1 && storageIndex < len.length-1 && x > len[storageIndex] && x < len[storageIndex + 1])
		{

		}
		else
		{
			int index = Arrays.binarySearch(len, x);
			if (index > 0)
			{
				return pos1D[index];
			}
			index = - (index + 1) - 1;
			storageIndex = index;
		}
	
		//TODO linear interpolation or extrapolation
		if (storageIndex < 0)
		{
			return pos1D[0];
		}
		double value = x - len[storageIndex];
		return a[storageIndex]
					+ b[storageIndex] * value
					+ c[storageIndex] * (value * value)
					+ d[storageIndex] * (value * value * value);
	}

	/**
	 * Returns the first derivation at x.
	 * @param x
	 * @return the first derivation at x
	 */
	public double getDx(double x)
	{
		if (len.length == 0 || len.length == 1)
		{
			return 0;
		}

		int index = Arrays.binarySearch(len, x);
		if (index < 0)
		{
			index = - (index + 1) - 1;
		}

		return b[index]
			+ 2 * c[index] * (x - len[index])
			+ 3 * d[index] * Math.pow(x - len[index], 2);
	}

	/**
	 * Calculates the Spline coefficients.
	 */
	private void calculateCoefficients()
	{
		int N = pos1D.length;
		a = new double[N];
		b = new double[N];
		c = new double[N];
		d = new double[N];
		
		if (N == 2) {
			a[0] = pos1D[0];
			b[0] = pos1D[1] - pos1D[0];
			return;
		}

		double[] h = new double[N - 1];
		
		for (int i = 0; i < N - 1; i++)
		{
			a[i] = pos1D[i];
			h[i] = len[i + 1] - len[i];
			
			// h[i] is used for division later, avoid a NaN
			if (h[i] == 0.0)
			{
				h[i] = 0.01;
			}
		}
		a[N - 1] = pos1D[N - 1];

		double[][] A = new double[N - 2][N - 2];
		double[] y = new double[N - 2];
		for (int i = 0; i < N - 2; i++)
		{
			y[i] =
				3
					* ((pos1D[i + 2] - pos1D[i + 1]) / h[i
						+ 1]
						- (pos1D[i + 1] - pos1D[i]) / h[i]);

			A[i][i] = 2 * (h[i] + h[i + 1]);

			if (i > 0)
			{
				A[i][i - 1] = h[i];
			}

			if (i < N - 3)
			{
				A[i][i + 1] = h[i + 1];
			}
		}
		
		solve(A, y);

		for (int i = 0; i < N - 2; i++)
		{
			c[i + 1] = y[i];
			b[i] = (a[i + 1] - a[i]) / h[i] - (2 * c[i] + c[i + 1]) / 3 * h[i];
			d[i] = (c[i + 1] - c[i]) / (3 * h[i]);
		}
		
		b[N - 2] =
			(a[N - 1] - a[N - 2]) / h[N
				- 2]
				- (2 * c[N - 2] + c[N - 1]) / 3 * h[N
				- 2];
		
		d[N - 2] = (c[N - 1] - c[N - 2]) / (3 * h[N - 2]);
	}

	/**
	 * Solves Ax=b and stores the solution in b.
	 */
	public void solve(double[][] A, double[] b) {
		int n = b.length;
		
		for (int i = 1; i < n; i++)
		{
			A[i][i - 1] = A[i][i - 1] / A[i - 1][i - 1];
			A[i][i] = A[i][i] - A[i - 1][i] * A[i][i - 1];
			b[i] = b[i] - A[i][i - 1] * b[i - 1];
		}

		b[n - 1] = b[n - 1] / A[n - 1][n - 1];
		
		for (int i = b.length - 2; i >= 0; i--)
		{
			b[i] = (b[i] - A[i][i + 1] * b[i + 1]) / A[i][i];
		}
	}
}
