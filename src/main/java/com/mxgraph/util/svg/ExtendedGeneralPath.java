/*

   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.

 */
package com.mxgraph.util.svg;

import java.awt.Shape;
import java.awt.Rectangle;
import java.awt.geom.AffineTransform;
import java.awt.geom.Arc2D;
import java.awt.geom.GeneralPath;
import java.awt.geom.PathIterator;
import java.awt.geom.Point2D;
import java.awt.geom.Rectangle2D;
import java.util.Arrays;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 * The <code>ExtendedGeneralPath</code> class represents a geometric
 * path constructed from straight lines, quadratic and cubic (Bezier)
 * curves and elliptical arc. This class delegates lines and curves to
 * an enclosed <code>GeneralPath</code>. Elliptical arc is implemented
 * using an <code>Arc2D</code> in float precision.
 *
 * <p><b>Warning</b> : An elliptical arc may be composed of several
 * path segments. For futher details, see the SVG Appendix&nbsp;F.6
 *
 * @author <a href="mailto:Thierry.Kormann@sophia.inria.fr">Thierry Kormann</a>
 */
public class ExtendedGeneralPath implements Shape, Cloneable
{

	private static final Logger log = Logger.getLogger(ExtendedGeneralPath.class.getName());

	/** The enclosed general path. */
	protected GeneralPath path;

	int numVals = 0;

	int numSeg = 0;

	float[] values = null;

	int[] types = null;

	float mx, my, cx, cy;

	/**
	  * Constructs a new <code>ExtendedGeneralPath</code>.
	  */
	public ExtendedGeneralPath()
	{
		path = new GeneralPath();
	}

	/**
	 * Constructs a new <code>ExtendedGeneralPath</code> with the
	 * specified winding rule to control operations that require the
	 * interior of the path to be defined.
	 */
	public ExtendedGeneralPath(int rule)
	{
		path = new GeneralPath(rule);
	}

	/**
	 * Constructs a new <code>ExtendedGeneralPath</code> object with
	 * the specified winding rule and the specified initial capacity
	 * to store path coordinates.
	 */
	public ExtendedGeneralPath(int rule, int initialCapacity)
	{
		path = new GeneralPath(rule, initialCapacity);
	}

	/**
	 * Constructs a new <code>ExtendedGeneralPath</code> object from
	 * an arbitrary <code>Shape</code> object.
	 */
	public ExtendedGeneralPath(Shape s)
	{
		this();
		append(s, false);
	}

	/**
	 * Adds an elliptical arc, defined by two radii, an angle from the
	 * x-axis, a flag to choose the large arc or not, a flag to
	 * indicate if we increase or decrease the angles and the final
	 * point of the arc.
	 *
	 * @param rx the x radius of the ellipse
	 * @param ry the y radius of the ellipse
	 *
	 * @param angle the angle from the x-axis of the current
	 * coordinate system to the x-axis of the ellipse in degrees.
	 *
	 * @param largeArcFlag the large arc flag. If true the arc
	 * spanning less than or equal to 180 degrees is chosen, otherwise
	 * the arc spanning greater than 180 degrees is chosen
	 *
	 * @param sweepFlag the sweep flag. If true the line joining
	 * center to arc sweeps through decreasing angles otherwise it
	 * sweeps through increasing angles
	 *
	 * @param x the absolute x coordinate of the final point of the arc.
	 * @param y the absolute y coordinate of the final point of the arc.
	 */
	public synchronized void arcTo(float rx, float ry, float angle,
			boolean largeArcFlag, boolean sweepFlag, float x, float y)
	{

		// Ensure radii are valid
		if (rx == 0 || ry == 0)
		{
			lineTo(x, y);
			return;
		}

		checkMoveTo(); // check if prev command was moveto

		// Get the current (x, y) coordinates of the path
		double x0 = cx;
		double y0 = cy;
		if (x0 == x && y0 == y)
		{
			// If the endpoints (x, y) and (x0, y0) are identical, then this
			// is equivalent to omitting the elliptical arc segment entirely.
			return;
		}

		Arc2D arc = computeArc(x0, y0, rx, ry, angle, largeArcFlag, sweepFlag,
				x, y);
		if (arc == null)
			return;

		AffineTransform t = AffineTransform.getRotateInstance(
				Math.toRadians(angle), arc.getCenterX(), arc.getCenterY());
		Shape s = t.createTransformedShape(arc);
		path.append(s, true);

		makeRoom(7);
		types[numSeg++] = ExtendedPathIterator.SEG_ARCTO;
		values[numVals++] = rx;
		values[numVals++] = ry;
		values[numVals++] = angle;
		values[numVals++] = largeArcFlag ? 1 : 0;
		values[numVals++] = sweepFlag ? 1 : 0;
		cx = values[numVals++] = x;
		cy = values[numVals++] = y;
	}

	/**
	 * This constructs an unrotated Arc2D from the SVG specification of an
	 * Elliptical arc.  To get the final arc you need to apply a rotation
	 * transform such as:
	 *
	 * AffineTransform.getRotateInstance
	 *     (angle, arc.getX()+arc.getWidth()/2, arc.getY()+arc.getHeight()/2);
	 */
	public static Arc2D computeArc(double x0, double y0, double rx, double ry,
			double angle, boolean largeArcFlag, boolean sweepFlag, double x,
			double y)
	{
		//
		// Elliptical arc implementation based on the SVG specification notes
		//

		// Compute the half distance between the current and the final point
		double dx2 = (x0 - x) / 2.0;
		double dy2 = (y0 - y) / 2.0;
		// Convert angle from degrees to radians
		angle = Math.toRadians(angle % 360.0);
		double cosAngle = Math.cos(angle);
		double sinAngle = Math.sin(angle);

		//
		// Step 1 : Compute (x1, y1)
		//
		double x1 = (cosAngle * dx2 + sinAngle * dy2);
		double y1 = (-sinAngle * dx2 + cosAngle * dy2);
		// Ensure radii are large enough
		rx = Math.abs(rx);
		ry = Math.abs(ry);
		double Prx = rx * rx;
		double Pry = ry * ry;
		double Px1 = x1 * x1;
		double Py1 = y1 * y1;
		// check that radii are large enough
		double radiiCheck = Px1 / Prx + Py1 / Pry;
		if (radiiCheck > 1)
		{
			rx = Math.sqrt(radiiCheck) * rx;
			ry = Math.sqrt(radiiCheck) * ry;
			Prx = rx * rx;
			Pry = ry * ry;
		}

		//
		// Step 2 : Compute (cx1, cy1)
		//
		double sign = (largeArcFlag == sweepFlag) ? -1 : 1;
		double sq = ((Prx * Pry) - (Prx * Py1) - (Pry * Px1))
				/ ((Prx * Py1) + (Pry * Px1));
		sq = (sq < 0) ? 0 : sq;
		double coef = (sign * Math.sqrt(sq));
		double cx1 = coef * ((rx * y1) / ry);
		double cy1 = coef * -((ry * x1) / rx);

		//
		// Step 3 : Compute (cx, cy) from (cx1, cy1)
		//
		double sx2 = (x0 + x) / 2.0;
		double sy2 = (y0 + y) / 2.0;
		double cx = sx2 + (cosAngle * cx1 - sinAngle * cy1);
		double cy = sy2 + (sinAngle * cx1 + cosAngle * cy1);

		//
		// Step 4 : Compute the angleStart (angle1) and the angleExtent (dangle)
		//
		double ux = (x1 - cx1) / rx;
		double uy = (y1 - cy1) / ry;
		double vx = (-x1 - cx1) / rx;
		double vy = (-y1 - cy1) / ry;
		double p, n;
		// Compute the angle start
		n = Math.sqrt((ux * ux) + (uy * uy));
		p = ux; // (1 * ux) + (0 * uy)
		sign = (uy < 0) ? -1.0 : 1.0;
		double angleStart = Math.toDegrees(sign * Math.acos(p / n));

		// Compute the angle extent
		n = Math.sqrt((ux * ux + uy * uy) * (vx * vx + vy * vy));
		p = ux * vx + uy * vy;
		sign = (ux * vy - uy * vx < 0) ? -1.0 : 1.0;
		double angleExtent = Math.toDegrees(sign * Math.acos(p / n));
		if (!sweepFlag && angleExtent > 0)
		{
			angleExtent -= 360f;
		}
		else if (sweepFlag && angleExtent < 0)
		{
			angleExtent += 360f;
		}
		angleExtent %= 360f;
		angleStart %= 360f;

		//
		// We can now build the resulting Arc2D in double precision
		//
		Arc2D.Double arc = new Arc2D.Double();
		arc.x = cx - rx;
		arc.y = cy - ry;
		arc.width = rx * 2.0;
		arc.height = ry * 2.0;
		arc.start = -angleStart;
		arc.extent = -angleExtent;

		return arc;
	}

	/**
	 * Delegates to the enclosed <code>GeneralPath</code>.
	 */
	public synchronized void moveTo(float x, float y)
	{
		// Don't add moveto to general path unless there is a reason.
		makeRoom(2);
		types[numSeg++] = PathIterator.SEG_MOVETO;
		cx = mx = values[numVals++] = x;
		cy = my = values[numVals++] = y;

	}

	/**
	 * Delegates to the enclosed <code>GeneralPath</code>.
	 */
	public synchronized void lineTo(float x, float y)
	{
		checkMoveTo(); // check if prev command was moveto
		path.lineTo(x, y);

		makeRoom(2);
		types[numSeg++] = PathIterator.SEG_LINETO;
		cx = values[numVals++] = x;
		cy = values[numVals++] = y;
	}

	/**
	 * Delegates to the enclosed <code>GeneralPath</code>.
	 */
	public synchronized void quadTo(float x1, float y1, float x2, float y2)
	{
		checkMoveTo(); // check if prev command was moveto
		path.quadTo(x1, y1, x2, y2);

		makeRoom(4);
		types[numSeg++] = PathIterator.SEG_QUADTO;
		values[numVals++] = x1;
		values[numVals++] = y1;
		cx = values[numVals++] = x2;
		cy = values[numVals++] = y2;
	}

	/**
	 * Delegates to the enclosed <code>GeneralPath</code>.
	 */
	public synchronized void curveTo(float x1, float y1, float x2, float y2,
			float x3, float y3)
	{
		checkMoveTo(); // check if prev command was moveto
		path.curveTo(x1, y1, x2, y2, x3, y3);

		makeRoom(6);
		types[numSeg++] = PathIterator.SEG_CUBICTO;
		values[numVals++] = x1;
		values[numVals++] = y1;
		values[numVals++] = x2;
		values[numVals++] = y2;
		cx = values[numVals++] = x3;
		cy = values[numVals++] = y3;
	}

	/**
	 * Delegates to the enclosed <code>GeneralPath</code>.
	 */
	public synchronized void closePath()
	{
		// Don't double close path.
		if ((numSeg != 0) && (types[numSeg - 1] == PathIterator.SEG_CLOSE))
			return;

		// Only close path if the previous command wasn't a moveto
		if ((numSeg != 0) && (types[numSeg - 1] != PathIterator.SEG_MOVETO))
			path.closePath();

		makeRoom(0);
		types[numSeg++] = PathIterator.SEG_CLOSE;
		cx = mx;
		cy = my;
	}

	/**
	 * Checks if previous command was a moveto command,
	 * skipping a close command (if present).
	 */
	protected void checkMoveTo()
	{
		if (numSeg == 0)
			return;

		switch (types[numSeg - 1])
		{

			case PathIterator.SEG_MOVETO:
				path.moveTo(values[numVals - 2], values[numVals - 1]);
				break;

			case PathIterator.SEG_CLOSE:
				if (numSeg == 1)
					return;
				if (types[numSeg - 2] == PathIterator.SEG_MOVETO)
					path.moveTo(values[numVals - 2], values[numVals - 1]);
				break;

			default:
				break;
		}
	}

	/**
	 * Delegates to the enclosed <code>GeneralPath</code>.
	 */
	public void append(Shape s, boolean connect)
	{
		append(s.getPathIterator(new AffineTransform()), connect);
	}

	/**
	 * Delegates to the enclosed <code>GeneralPath</code>.
	 */
	public void append(PathIterator pi, boolean connect)
	{
		double[] vals = new double[6];

		while (!pi.isDone())
		{
			Arrays.fill(vals, 0);
			int type = pi.currentSegment(vals);
			pi.next();
			if (connect && (numVals != 0))
			{
				if (type == PathIterator.SEG_MOVETO)
				{
					double x = vals[0];
					double y = vals[1];
					if ((x != cx) || (y != cy))
					{
						// Change MOVETO to LINETO.
						type = PathIterator.SEG_LINETO;
					}
					else
					{
						// Redundent segment (move to current loc) drop it...
						if (pi.isDone())
							break; // Nothing interesting
						type = pi.currentSegment(vals);
						pi.next();
					}
				}
				connect = false;
			}

			switch (type)
			{
				case PathIterator.SEG_CLOSE:
					closePath();
					break;
				case PathIterator.SEG_MOVETO:
					moveTo((float) vals[0], (float) vals[1]);
					break;
				case PathIterator.SEG_LINETO:
					lineTo((float) vals[0], (float) vals[1]);
					break;
				case PathIterator.SEG_QUADTO:
					quadTo((float) vals[0], (float) vals[1], (float) vals[2],
							(float) vals[3]);
					break;
				case PathIterator.SEG_CUBICTO:
					curveTo((float) vals[0], (float) vals[1], (float) vals[2],
							(float) vals[3], (float) vals[4], (float) vals[5]);
					break;
			}
		}
	}

	/**
	 * Delegates to the enclosed <code>GeneralPath</code>.
	 */
	public void append(ExtendedPathIterator epi, boolean connect)
	{
		float[] vals = new float[7];
		while (!epi.isDone())
		{
			Arrays.fill(vals, 0);
			int type = epi.currentSegment(vals);
			epi.next();
			if (connect && (numVals != 0))
			{
				if (type == PathIterator.SEG_MOVETO)
				{
					float x = vals[0];
					float y = vals[1];
					if ((x != cx) || (y != cy))
					{
						// Change MOVETO to LINETO.
						type = PathIterator.SEG_LINETO;
					}
					else
					{
						// Redundant segment (move to current loc) drop it...
						if (epi.isDone())
							break; // Nothing interesting
						type = epi.currentSegment(vals);
						epi.next();
					}
				}
				connect = false;
			}

			switch (type)
			{
				case PathIterator.SEG_CLOSE:
					closePath();
					break;
				case PathIterator.SEG_MOVETO:
					moveTo(vals[0], vals[1]);
					break;
				case PathIterator.SEG_LINETO:
					lineTo(vals[0], vals[1]);
					break;
				case PathIterator.SEG_QUADTO:
					quadTo(vals[0], vals[1], vals[2], vals[3]);
					break;
				case PathIterator.SEG_CUBICTO:
					curveTo(vals[0], vals[1], vals[2], vals[3], vals[4],
							vals[5]);
					break;
				case ExtendedPathIterator.SEG_ARCTO:
					arcTo(vals[0], vals[1], vals[2], (vals[3] != 0),
							(vals[4] != 0), vals[5], vals[6]);
					break;
			}
		}
	}

	/**
	 * Delegates to the enclosed <code>GeneralPath</code>.
	 */
	public synchronized int getWindingRule()
	{
		return path.getWindingRule();
	}

	/**
	 * Delegates to the enclosed <code>GeneralPath</code>.
	 */
	public void setWindingRule(int rule)
	{
		path.setWindingRule(rule);
	}

	/**
	 * get the current position or <code>null</code>.
	 */
	public synchronized Point2D getCurrentPoint()
	{
		if (numVals == 0)
			return null;
		return new Point2D.Double(cx, cy);
	}

	/**
	 * Delegates to the enclosed <code>GeneralPath</code>.
	 */
	public synchronized void reset()
	{
		path.reset();

		numSeg = 0;
		numVals = 0;
		values = null;
		types = null;
	}

	/**
	 * Delegates to the enclosed <code>GeneralPath</code>.
	 */
	public void transform(AffineTransform at)
	{
		path.transform(at);
	}

	/**
	 * Delegates to the enclosed <code>GeneralPath</code>.
	 */
	public synchronized Shape createTransformedShape(AffineTransform at)
	{
		return path.createTransformedShape(at);
	}

	/**
	 * Delegates to the enclosed <code>GeneralPath</code>.
	 */
	public synchronized Rectangle getBounds()
	{
		return path.getBounds();
	}

	/**
	 * Delegates to the enclosed <code>GeneralPath</code>.
	 */
	public synchronized Rectangle2D getBounds2D()
	{
		return path.getBounds2D();
	}

	/**
	 * Delegates to the enclosed <code>GeneralPath</code>.
	 */
	public boolean contains(double x, double y)
	{
		return path.contains(x, y);
	}

	/**
	 * Delegates to the enclosed <code>GeneralPath</code>.
	 */
	public boolean contains(Point2D p)
	{
		return path.contains(p);
	}

	/**
	 * Delegates to the enclosed <code>GeneralPath</code>.
	 */
	public boolean contains(double x, double y, double w, double h)
	{
		return path.contains(x, y, w, h);
	}

	/**
	 * Delegates to the enclosed <code>GeneralPath</code>.
	 */
	public boolean contains(Rectangle2D r)
	{
		return path.contains(r);
	}

	/**
	 * Delegates to the enclosed <code>GeneralPath</code>.
	 */
	public boolean intersects(double x, double y, double w, double h)
	{
		return path.intersects(x, y, w, h);
	}

	/**
	 * Delegates to the enclosed <code>GeneralPath</code>.
	 */
	public boolean intersects(Rectangle2D r)
	{
		return path.intersects(r);
	}

	/**
	 * Delegates to the enclosed <code>GeneralPath</code>.
	 */
	public PathIterator getPathIterator(AffineTransform at)
	{
		return path.getPathIterator(at);
	}

	/**
	 * Delegates to the enclosed <code>GeneralPath</code>.
	 */
	public PathIterator getPathIterator(AffineTransform at, double flatness)
	{
		return path.getPathIterator(at, flatness);
	}

	/**
	 * Delegates to the enclosed <code>GeneralPath</code>.
	 */
	public ExtendedPathIterator getExtendedPathIterator()
	{
		return new EPI();
	}

	class EPI implements ExtendedPathIterator
	{
		int segNum = 0;

		int valsIdx = 0;

		public int currentSegment()
		{
			return types[segNum];
		}

		public int currentSegment(double[] coords)
		{
			int ret = types[segNum];
			switch (ret)
			{
				case SEG_CLOSE:
					break;
				case SEG_MOVETO:
				case SEG_LINETO:
					coords[0] = values[valsIdx];
					coords[1] = values[valsIdx + 1];
					break;
				case SEG_QUADTO:
					coords[0] = values[valsIdx];
					coords[1] = values[valsIdx + 1];
					coords[2] = values[valsIdx + 2];
					coords[3] = values[valsIdx + 3];
					break;
				case SEG_CUBICTO:
					coords[0] = values[valsIdx];
					coords[1] = values[valsIdx + 1];
					coords[2] = values[valsIdx + 2];
					coords[3] = values[valsIdx + 3];
					coords[4] = values[valsIdx + 4];
					coords[5] = values[valsIdx + 5];
					break;
				case SEG_ARCTO:
					coords[0] = values[valsIdx];
					coords[1] = values[valsIdx + 1];
					coords[2] = values[valsIdx + 2];
					coords[3] = values[valsIdx + 3];
					coords[4] = values[valsIdx + 4];
					coords[5] = values[valsIdx + 5];
					coords[6] = values[valsIdx + 6];
					break;
			}
			// log.fine("Seg: [" + segNum + "] type: " + ret +
			//                    " vals: [" + coords[0] + ", " + coords[1] +
			//                    "]");
			return ret;
		}

		public int currentSegment(float[] coords)
		{
			int ret = types[segNum];
			switch (ret)
			{
				case SEG_CLOSE:
					break;
				case SEG_MOVETO:
				case SEG_LINETO:
					coords[0] = values[valsIdx];
					coords[1] = values[valsIdx + 1];
					break;
				case SEG_QUADTO:
					System.arraycopy(values, valsIdx, coords, 0, 4);
					break;
				case SEG_CUBICTO:
					System.arraycopy(values, valsIdx, coords, 0, 6);
					break;
				case SEG_ARCTO:
					System.arraycopy(values, valsIdx, coords, 0, 7);
					break;
			}
			return ret;
		}

		public int getWindingRule()
		{
			return path.getWindingRule();
		}

		public boolean isDone()
		{
			return segNum == numSeg;
		}

		public void next()
		{
			int type = types[segNum++];
			switch (type)
			{
				case SEG_CLOSE:
					break;
				case SEG_MOVETO: // fallthrough is intended
				case SEG_LINETO:
					valsIdx += 2;
					break;
				case SEG_QUADTO:
					valsIdx += 4;
					break;
				case SEG_CUBICTO:
					valsIdx += 6;
					break;
				case SEG_ARCTO:
					valsIdx += 7;
					break;
			}
		}
	}

	/**
	 * Delegates to the enclosed <code>GeneralPath</code>.
	 */
	public Object clone()
	{
		try
		{
			ExtendedGeneralPath result = (ExtendedGeneralPath) super.clone();
			result.path = (GeneralPath) path.clone();

			if (values != null)
			{
				result.values = new float[values.length];
				System.arraycopy(values, 0, result.values, 0, values.length);
			}
			result.numVals = numVals;

			if (types != null)
			{
				result.types = new int[types.length];
				System.arraycopy(types, 0, result.types, 0, types.length);
			}
			result.numSeg = numSeg;

			return result;
		}
		catch (CloneNotSupportedException ex)
		{
			log.log(Level.SEVERE, "Failed to clone the path", ex);
		}
		return null;
	}

	/**
	 * Make sure, that the requested number of slots in vales[] are available.
	 * Must be called even for numValues = 0, because it is also
	 * used for initialization of those arrays.
	 *
	 * @param numValues number of requested coordinates
	 */
	private void makeRoom(int numValues)
	{
		if (values == null)
		{
			values = new float[2 * numValues];
			types = new int[2];
			numVals = 0;
			numSeg = 0;
			return;
		}

		int newSize = numVals + numValues;
		if (newSize > values.length)
		{
			int nlen = values.length * 2;
			if (nlen < newSize)
				nlen = newSize;

			float[] nvals = new float[nlen];
			System.arraycopy(values, 0, nvals, 0, numVals);
			values = nvals;
		}

		if (numSeg == types.length)
		{
			int[] ntypes = new int[types.length * 2];
			System.arraycopy(types, 0, ntypes, 0, types.length);
			types = ntypes;
		}
	}
}
