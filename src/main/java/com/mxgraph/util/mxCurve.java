/**
 * Copyright (c) 2009-2012, JGraph Ltd
 */
package com.mxgraph.util;

import java.awt.Rectangle;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Hashtable;
import java.util.List;
import java.util.Map;

public class mxCurve
{
	/**
	 * A collection of arrays of curve points
	 */
	protected Map<String, mxPoint[]> points;

	// Rectangle just completely enclosing branch and label/
	protected double minXBounds = 10000000;

	protected double maxXBounds = 0;

	protected double minYBounds = 10000000;

	protected double maxYBounds = 0;

	/**
	 * An array of arrays of intervals. These intervals define the distance
	 * along the edge (0 to 1) that each point lies
	 */
	protected Map<String, double[]> intervals;

	/**
	 * The curve lengths of the curves
	 */
	protected Map<String, Double> curveLengths;

	/**
	 * Defines the key for the central curve index
	 */
	public static String CORE_CURVE = "Center_curve";

	/**
	 * Defines the key for the label curve index
	 */
	public static String LABEL_CURVE = "Label_curve";;

	/**
	 * Indicates that an invalid position on a curve was requested
	 */
	public static mxLine INVALID_POSITION = new mxLine(new mxPoint(0, 0),
			new mxPoint(1, 0));

	/**
	 * Offset of the label curve from the curve the label curve is based on.
	 * If you wish to set this value, do so directly after creation of the curve.
	 * The first time the curve is used the label curve will be created with 
	 * whatever value is contained in this variable. Changes to it after that point 
	 * will have no effect.
	 */
	protected double labelBuffer = mxConstants.DEFAULT_LABEL_BUFFER;

	/**
	 * The points this curve is drawn through. These are typically control
	 * points and are at distances from each other that straight lines
	 * between them do not describe a smooth curve. This class takes
	 * these guiding points and creates a finer set of internal points
	 * that visually appears to be a curve when linked by straight lines
	 */
	public List<mxPoint> guidePoints = new ArrayList<mxPoint>();

	/**
	 * Whether or not the curve currently holds valid values
	 */
	protected boolean valid = false;

	/**
	 * 
	 */
	public void setLabelBuffer(double buffer)
	{
		labelBuffer = buffer;
	}

	/**
	 * 
	 */
	public mxRectangle getBounds()
	{
		if (!valid)
		{
			createCoreCurve();
		}
		return new mxRectangle(minXBounds, minYBounds, maxXBounds - minXBounds,
				maxYBounds - minYBounds);
	}

	/**
	 * 
	 */
	public mxCurve()
	{
	}

	/**
	 * 
	 */
	public mxCurve(List<mxPoint> points)
	{
		boolean nullPoints = false;

		for (mxPoint point : points)
		{
			if (point == null)
			{
				nullPoints = true;
				break;
			}
		}

		if (!nullPoints)
		{
			guidePoints = new ArrayList<mxPoint>(points);
		}
	}

	/**
	 * Calculates the index of the lower point on the segment
	 * that contains the point <i>distance</i> along the 
	 */
	protected int getLowerIndexOfSegment(String index, double distance)
	{
		double[] curveIntervals = getIntervals(index);

		if (curveIntervals == null)
		{
			return 0;
		}

		int numIntervals = curveIntervals.length;

		if (distance <= 0.0 || numIntervals < 3)
		{
			return 0;
		}

		if (distance >= 1.0)
		{
			return numIntervals - 2;
		}

		// Pick a starting index roughly where you expect the point
		// to be
		int testIndex = (int) (numIntervals * distance);

		if (testIndex >= numIntervals)
		{
			testIndex = numIntervals - 1;
		}

		// The max and min indices tested so far
		int lowerLimit = -1;
		int upperLimit = numIntervals;

		// It cannot take more than the number of intervals to find
		// the correct segment
		for (int i = 0; i < numIntervals; i++)
		{
			double segmentDistance = curveIntervals[testIndex];
			double multiplier = 0.5;

			if (distance < segmentDistance)
			{
				upperLimit = Math.min(upperLimit, testIndex);
				multiplier = -0.5;
			}
			else if (distance > segmentDistance)
			{
				lowerLimit = Math.max(lowerLimit, testIndex);
			}
			else
			{
				// Values equal
				if (testIndex == 0)
				{
					lowerLimit = 0;
					upperLimit = 1;
				}
				else
				{
					lowerLimit = testIndex - 1;
					upperLimit = testIndex;
				}
			}

			int indexDifference = upperLimit - lowerLimit;

			if (indexDifference == 1)
			{
				break;
			}

			testIndex = (int) (testIndex + indexDifference * multiplier);

			if (testIndex == lowerLimit)
			{
				testIndex = lowerLimit + 1;
			}

			if (testIndex == upperLimit)
			{
				testIndex = upperLimit - 1;
			}
		}

		if (lowerLimit != upperLimit - 1)
		{
			return -1;
		}

		return lowerLimit;
	}

	/**
	 * Returns a unit vector parallel to the curve at the specified
	 * distance along the curve. To obtain the angle the vector makes
	 * with (1,0) perform Math.atan(segVectorY/segVectorX).
	 * @param index the curve index specifying the curve to analyse
	 * @param distance the distance from start to end of curve (0.0...1.0)
	 * @return a unit vector at the specified point on the curve represented
	 * 		as a line, parallel with the curve. If the distance or curve is
	 * 		invalid, <code>mxCurve.INVALID_POSITION</code> is returned
	 */
	public mxLine getCurveParallel(String index, double distance)
	{
		mxPoint[] pointsCurve = getCurvePoints(index);
		double[] curveIntervals = getIntervals(index);

		if (pointsCurve != null && pointsCurve.length > 0
				&& curveIntervals != null && distance >= 0.0 && distance <= 1.0)
		{
			// If the curve is zero length, it will only have one point
			// We can't calculate in this case
			if (pointsCurve.length == 1)
			{
				mxPoint point = pointsCurve[0];
				return new mxLine(point.getX(), point.getY(), new mxPoint(1, 0));
			}

			int lowerLimit = getLowerIndexOfSegment(index, distance);
			mxPoint firstPointOfSeg = pointsCurve[lowerLimit];
			double segVectorX = pointsCurve[lowerLimit + 1].getX()
					- firstPointOfSeg.getX();
			double segVectorY = pointsCurve[lowerLimit + 1].getY()
					- firstPointOfSeg.getY();
			double distanceAlongSeg = (distance - curveIntervals[lowerLimit])
					/ (curveIntervals[lowerLimit + 1] - curveIntervals[lowerLimit]);
			double segLength = Math.sqrt(segVectorX * segVectorX + segVectorY
					* segVectorY);
			double startPointX = firstPointOfSeg.getX() + segVectorX
					* distanceAlongSeg;
			double startPointY = firstPointOfSeg.getY() + segVectorY
					* distanceAlongSeg;
			mxPoint endPoint = new mxPoint(segVectorX / segLength, segVectorY
					/ segLength);
			return new mxLine(startPointX, startPointY, endPoint);
		}
		else
		{
			return INVALID_POSITION;
		}
	}

	/**
	 * Returns a section of the curve as an array of points
	 * @param index the curve index specifying the curve to analyse
	 * @param start the start position of the curve segment (0.0...1.0)
	 * @param end the end position of the curve segment (0.0...1.0)
	 * @return a sequence of point representing the curve section or null
	 * 			if it cannot be calculated
	 */
	public mxPoint[] getCurveSection(String index, double start, double end)
	{
		mxPoint[] pointsCurve = getCurvePoints(index);
		double[] curveIntervals = getIntervals(index);

		if (pointsCurve != null && pointsCurve.length > 0
				&& curveIntervals != null && start >= 0.0 && start <= 1.0
				&& end >= 0.0 && end <= 1.0)
		{
			// If the curve is zero length, it will only have one point
			// We can't calculate in this case
			if (pointsCurve.length == 1)
			{
				mxPoint point = pointsCurve[0];
				return new mxPoint[] { new mxPoint(point.getX(), point.getY()) };
			}

			int lowerLimit = getLowerIndexOfSegment(index, start);
			mxPoint firstPointOfSeg = pointsCurve[lowerLimit];
			double segVectorX = pointsCurve[lowerLimit + 1].getX()
					- firstPointOfSeg.getX();
			double segVectorY = pointsCurve[lowerLimit + 1].getY()
					- firstPointOfSeg.getY();
			double distanceAlongSeg = (start - curveIntervals[lowerLimit])
					/ (curveIntervals[lowerLimit + 1] - curveIntervals[lowerLimit]);
			mxPoint startPoint = new mxPoint(firstPointOfSeg.getX()
					+ segVectorX * distanceAlongSeg, firstPointOfSeg.getY()
					+ segVectorY * distanceAlongSeg);

			List<mxPoint> result = new ArrayList<mxPoint>();
			result.add(startPoint);

			double current = start;
			current = curveIntervals[++lowerLimit];

			while (current <= end)
			{
				mxPoint nextPointOfSeg = pointsCurve[lowerLimit];
				result.add(nextPointOfSeg);
				current = curveIntervals[++lowerLimit];
			}

			// Add whatever proportion of the last segment has to 
			// be added to make the exactly end distance
			if (lowerLimit > 0 && lowerLimit < pointsCurve.length
					&& end > curveIntervals[lowerLimit - 1])
			{
				firstPointOfSeg = pointsCurve[lowerLimit - 1];
				segVectorX = pointsCurve[lowerLimit].getX()
						- firstPointOfSeg.getX();
				segVectorY = pointsCurve[lowerLimit].getY()
						- firstPointOfSeg.getY();
				distanceAlongSeg = (end - curveIntervals[lowerLimit - 1])
						/ (curveIntervals[lowerLimit] - curveIntervals[lowerLimit - 1]);
				mxPoint endPoint = new mxPoint(firstPointOfSeg.getX()
						+ segVectorX * distanceAlongSeg, firstPointOfSeg.getY()
						+ segVectorY * distanceAlongSeg);
				result.add(endPoint);
			}

			mxPoint[] resultArray = new mxPoint[result.size()];
			return result.toArray(resultArray);
		}
		else
		{
			return null;
		}
	}

	/**
	 * Returns whether or not the rectangle passed in hits any part of this
	 * curve.
	 * @param rect the rectangle to detect for a hit
	 * @return whether or not the rectangle hits this curve
	 */
	public boolean intersectsRect(Rectangle rect)
	{
		// To save CPU, we can test if the rectangle intersects the entire
		// bounds of this curve
		if (!getBounds().getRectangle().intersects(rect))
		{
			return false;
		}

		mxPoint[] pointsCurve = getCurvePoints(mxCurve.CORE_CURVE);

		if (pointsCurve != null && pointsCurve.length > 1)
		{
			mxRectangle mxRect = new mxRectangle(rect);
			// First check for any of the curve points lying within the 
			// rectangle, then for any of the curve segments intersecting 
			// with the rectangle sides
			for (int i = 1; i < pointsCurve.length; i++)
			{
				if (mxRect.contains(pointsCurve[i].getX(),
						pointsCurve[i].getY())
						|| mxRect.contains(pointsCurve[i - 1].getX(),
								pointsCurve[i - 1].getY()))
				{
					return true;
				}
			}

			for (int i = 1; i < pointsCurve.length; i++)
			{
				if (mxRect.intersectLine(pointsCurve[i].getX(),
						pointsCurve[i].getY(), pointsCurve[i - 1].getX(),
						pointsCurve[i - 1].getY()) != null)
				{
					return true;
				}
			}
		}

		return false;
	}

	/**
	 * Returns the point at which this curve intersects the boundary of 
	 * the given rectangle, if it does so. If it does not intersect, 
	 * null is returned. If it intersects multiple times, the first 
	 * intersection from the start end of the curve is returned.
	 * 
	 * @param index the curve index specifying the curve to analyse
	 * @param rect the whose boundary is to be tested for intersection
	 * with this curve
	 * @return the point at which this curve intersects the boundary of 
	 * the given rectangle, if it does so. If it does not intersect, 
	 * null is returned.
	 */
	public mxPoint intersectsRectPerimeter(String index, mxRectangle rect)
	{
		mxPoint result = null;
		mxPoint[] pointsCurve = getCurvePoints(index);

		if (pointsCurve != null && pointsCurve.length > 1)
		{
			int crossingSeg = intersectRectPerimeterSeg(index, rect);

			if (crossingSeg != -1)
			{
				result = intersectRectPerimeterPoint(index, rect, crossingSeg);
			}
		}

		return result;
	}

	/**
	 * Returns the distance from the start of the curve at which this 
	 * curve intersects the boundary of the given rectangle, if it does 
	 * so. If it does not intersect, -1 is returned. 
	 * If it intersects multiple times, the first intersection from 
	 * the start end of the curve is returned.
	 * 
	 * @param index the curve index specifying the curve to analyse
	 * @param rect the whose boundary is to be tested for intersection
	 * with this curve
	 * @return the distance along the curve from the start at which
	 * the intersection occurs
	 */
	public double intersectsRectPerimeterDist(String index, mxRectangle rect)
	{
		double result = -1;
		mxPoint[] pointsCurve = getCurvePoints(index);
		double[] curveIntervals = getIntervals(index);

		if (pointsCurve != null && pointsCurve.length > 1)
		{
			int segIndex = intersectRectPerimeterSeg(index, rect);
			mxPoint intersectPoint = null;

			if (segIndex != -1)
			{
				intersectPoint = intersectRectPerimeterPoint(index, rect,
						segIndex);
			}

			if (intersectPoint != null)
			{
				double startSegX = pointsCurve[segIndex - 1].getX();
				double startSegY = pointsCurve[segIndex - 1].getY();
				double distToStartSeg = curveIntervals[segIndex - 1]
						* getCurveLength(index);
				double intersectOffsetX = intersectPoint.getX() - startSegX;
				double intersectOffsetY = intersectPoint.getY() - startSegY;
				double lenToIntersect = Math.sqrt(intersectOffsetX
						* intersectOffsetX + intersectOffsetY
						* intersectOffsetY);
				result = distToStartSeg + lenToIntersect;
			}
		}

		return result;
	}

	/**
	 * Returns a point to move the input rectangle to, in order to
	 * attempt to place the rectangle away from the curve. NOTE: Curves
	 * are scaled, the input rectangle should be also.
	 * @param index  the curve index specifying the curve to analyse
	 * @param rect the rectangle that is to be moved
	 * @param buffer the amount by which the rectangle is to be moved,
	 * 			beyond the dimensions of the rect
	 * @return the point to move the top left of the input rect to
	 * 			, otherwise null if no point can be determined
	 */
	public mxPoint collisionMove(String index, mxRectangle rect, double buffer)
	{
		int hitSeg = intersectRectPerimeterSeg(index, rect);

		// Could test for a second hit (the rect exit, unless the same 
		// segment is entry and exit) and allow for that in movement.
		
		if (hitSeg == -1)
		{
			return null;
		}
		else
		{
			mxPoint[] pointsCurve = getCurvePoints(index);

			double x0 = pointsCurve[hitSeg - 1].getX();
			double y0 = pointsCurve[hitSeg - 1].getY();
			double x1 = pointsCurve[hitSeg].getX();
			double y1 = pointsCurve[hitSeg].getY();
			
			double x = rect.getX();
			double y = rect.getY();
			double width = rect.getWidth();
			double height = rect.getHeight();

			// Whether the intersection is one of the horizontal sides of the rect
			@SuppressWarnings("unused")
			boolean horizIncident = false;
			mxPoint hitPoint = mxUtils.intersection(x, y, x + width, y, x0, y0, x1, y1);
			
			if (hitPoint != null)
			{
				horizIncident = true;
			}
			else
			{
				hitPoint = mxUtils.intersection(x + width, y, x + width, y + height,
						x0, y0, x1, y1);
			}

			if (hitPoint == null)
			{
				hitPoint = mxUtils.intersection(x + width, y + height, x, y + height,
						x0, y0, x1, y1);
				
				if (hitPoint != null)
				{
					horizIncident = true;
				}
				else
				{
					hitPoint = mxUtils.intersection(x, y, x, y + height, x0, y0, x1, y1);
				}
			}

			if (hitPoint != null)
			{
				
			}

		}
		
		return null;
	}

	/**
	 * Utility method to determine within which segment the specified rectangle
	 * intersects the specified curve
	 * 
	 * @param index the curve index specifying the curve to analyse
	 * @param rect the whose boundary is to be tested for intersection
	 * with this curve
	 * @return the point at which this curve intersects the boundary of 
	 * the given rectangle, if it does so. If it does not intersect, 
	 * -1 is returned
	 */
	protected int intersectRectPerimeterSeg(String index, mxRectangle rect)
	{
		return intersectRectPerimeterSeg(index, rect, 1);
	}

	/**
	 * Utility method to determine within which segment the specified rectangle
	 * intersects the specified curve. This method specifies which segment to
	 * start searching at.
	 * 
	 * @param index the curve index specifying the curve to analyse
	 * @param rect the whose boundary is to be tested for intersection
	 * with this curve
	 * @param startSegment the segment to start searching at. To start at the 
	 * 			beginning of the curve, use 1, not 0.
	 * @return the point at which this curve intersects the boundary of 
	 * the given rectangle, if it does so. If it does not intersect, 
	 * -1 is returned
	 */
	protected int intersectRectPerimeterSeg(String index, mxRectangle rect,
			int startSegment)
	{
		mxPoint[] pointsCurve = getCurvePoints(index);

		if (pointsCurve != null && pointsCurve.length > 1)
		{
			for (int i = startSegment; i < pointsCurve.length; i++)
			{
				if (rect.intersectLine(pointsCurve[i].getX(),
						pointsCurve[i].getY(), pointsCurve[i - 1].getX(),
						pointsCurve[i - 1].getY()) != null)
				{
					return i;
				}
			}
		}

		return -1;
	}

	/**
	 * Returns the point at which this curve segment intersects the boundary 
	 * of the given rectangle, if it does so. If it does not intersect, 
	 * null is returned.
	 * 
	 * @param curveIndex the curve index specifying the curve to analyse
	 * @param rect the whose boundary is to be tested for intersection
	 * with this curve
	 * @param indexSeg the segments on this curve being checked
	 * @return the point at which this curve segment  intersects the boundary 
	 * of the given rectangle, if it does so. If it does not intersect, 
	 * null is returned.
	 */
	protected mxPoint intersectRectPerimeterPoint(String curveIndex,
			mxRectangle rect, int indexSeg)
	{
		mxPoint result = null;
		mxPoint[] pointsCurve = getCurvePoints(curveIndex);

		if (pointsCurve != null && pointsCurve.length > 1 && indexSeg >= 0
				&& indexSeg < pointsCurve.length)
		{
			double p1X = pointsCurve[indexSeg - 1].getX();
			double p1Y = pointsCurve[indexSeg - 1].getY();
			double p2X = pointsCurve[indexSeg].getX();
			double p2Y = pointsCurve[indexSeg].getY();

			result = rect.intersectLine(p1X, p1Y, p2X, p2Y);
		}

		return result;
	}

	/**
	 * Calculates the position of an absolute in terms relative
	 * to this curve.
	 * 
	 * @param absPoint the point whose relative point is to calculated
	 * @param index the index of the curve whom the relative position is to be 
	 * calculated from
	 * @return an mxRectangle where the x is the distance along the curve 
	 * (0 to 1), y is the orthogonal offset from the closest segment on the 
	 * curve and (width, height) is an additional Cartesian offset applied
	 * after the other calculations
	 */
	public mxRectangle getRelativeFromAbsPoint(mxPoint absPoint, String index)
	{
		// Work out which segment the absolute point is closest to
		mxPoint[] currentCurve = getCurvePoints(index);
		double[] currentIntervals = getIntervals(index);
		int closestSegment = 0;
		double closestSegDistSq = 10000000;
		mxLine segment = new mxLine(currentCurve[0], currentCurve[1]);

		for (int i = 1; i < currentCurve.length; i++)
		{
			segment.setPoints(currentCurve[i - 1], currentCurve[i]);
			double segDistSq = segment.ptSegDistSq(absPoint);

			if (segDistSq < closestSegDistSq)
			{
				closestSegDistSq = segDistSq;
				closestSegment = i - 1;
			}
		}

		// Get the distance (squared) from the point to the
		// infinitely extrapolated line created by the closest
		// segment. If that value is the same as the distance
		// to the segment then an orthogonal offset from some
		// point on the line will intersect the point. If they
		// are not equal, an additional cartesian offset is
		// required
		mxPoint startSegPt = currentCurve[closestSegment];
		mxPoint endSegPt = currentCurve[closestSegment + 1];

		mxLine closestSeg = new mxLine(startSegPt, endSegPt);
		double lineDistSq = closestSeg.ptLineDistSq(absPoint);

		double orthogonalOffset = Math.sqrt(Math.min(lineDistSq,
				closestSegDistSq));
		double segX = endSegPt.getX() - startSegPt.getX();
		double segY = endSegPt.getY() - startSegPt.getY();
		double segDist = Math.sqrt(segX * segX + segY * segY);
		double segNormX = segX / segDist;
		double segNormY = segY / segDist;
		// The orthogonal offset could be in one of two opposite vectors
		// Try both solutions, one will be closer to one of the segment
		// end points (unless the point is on the line)
		double candidateOffX1 = (absPoint.getX() - segNormY * orthogonalOffset)
				- endSegPt.getX();
		double candidateOffY1 = (absPoint.getY() + segNormX * orthogonalOffset)
				- endSegPt.getY();
		double candidateOffX2 = (absPoint.getX() + segNormY * orthogonalOffset)
				- endSegPt.getX();
		double candidateOffY2 = (absPoint.getY() - segNormX * orthogonalOffset)
				- endSegPt.getY();

		double candidateDist1 = (candidateOffX1 * candidateOffX1)
				+ (candidateOffY1 * candidateOffY1);
		double candidateDist2 = (candidateOffX2 * candidateOffX2)
				+ (candidateOffY2 * candidateOffY2);

		double orthOffsetPointX = 0;
		double orthOffsetPointY = 0;

		if (candidateDist2 < candidateDist1)
		{
			orthogonalOffset = -orthogonalOffset;
		}

		orthOffsetPointX = absPoint.getX() - segNormY * orthogonalOffset;
		orthOffsetPointY = absPoint.getY() + segNormX * orthogonalOffset;

		double distAlongEdge = 0;
		double cartOffsetX = 0;
		double cartOffsetY = 0;

		// Don't compare for exact equality, there are often rounding errors
		if (Math.abs(closestSegDistSq - lineDistSq) > 0.0001)
		{
			// The orthogonal offset does not move the point onto the
			// segment. Work out an additional cartesian offset that moves
			// the offset point onto the closest end point of the
			// segment

			// Not exact distances, but the equation holds
			double distToStartPoint = Math.abs(orthOffsetPointX
					- startSegPt.getX())
					+ Math.abs(orthOffsetPointY - startSegPt.getY());
			double distToEndPoint = Math
					.abs(orthOffsetPointX - endSegPt.getX())
					+ Math.abs(orthOffsetPointY - endSegPt.getY());
			if (distToStartPoint < distToEndPoint)
			{
				distAlongEdge = currentIntervals[closestSegment];
				cartOffsetX = orthOffsetPointX - startSegPt.getX();
				cartOffsetY = orthOffsetPointY - startSegPt.getY();
			}
			else
			{
				distAlongEdge = currentIntervals[closestSegment + 1];
				cartOffsetX = orthOffsetPointX - endSegPt.getX();
				cartOffsetY = orthOffsetPointY - endSegPt.getY();
			}
		}
		else
		{
			// The point, when orthogonally offset, lies on the segment
			// work out what proportion along the segment, and therefore
			// the entire curve, the offset point lies.
			double segmentLen = Math.sqrt((endSegPt.getX() - startSegPt.getX())
					* (endSegPt.getX() - startSegPt.getX())
					+ (endSegPt.getY() - startSegPt.getY())
					* (endSegPt.getY() - startSegPt.getY()));
			double offsetLen = Math.sqrt((orthOffsetPointX - startSegPt.getX())
					* (orthOffsetPointX - startSegPt.getX())
					+ (orthOffsetPointY - startSegPt.getY())
					* (orthOffsetPointY - startSegPt.getY()));
			double proportionAlongSeg = offsetLen / segmentLen;
			double segProportingDiff = currentIntervals[closestSegment + 1]
					- currentIntervals[closestSegment];
			distAlongEdge = currentIntervals[closestSegment]
					+ segProportingDiff * proportionAlongSeg;
		}

		if (distAlongEdge > 1.0)
		{
			distAlongEdge = 1.0;
		}

		return new mxRectangle(distAlongEdge, orthogonalOffset, cartOffsetX,
				cartOffsetY);
	}

	/**
	 * Creates the core curve that is based on the guide points passed into
	 * this class instance
	 */
	protected void createCoreCurve()
	{
		// Curve is marked invalid until all of the error situations have
		// been checked
		valid = false;

		if (guidePoints == null || guidePoints.isEmpty())
		{
			return;
		}

		for (int i = 0; i < guidePoints.size(); i++)
		{
			if (guidePoints.get(i) == null)
			{
				return;
			}
		}

		// Reset the cached bounds value
		minXBounds = minYBounds = 10000000;
		maxXBounds = maxYBounds = 0;

		mxSpline spline = new mxSpline(guidePoints);

		// Need the rough length of the spline, so we can get
		// more samples for longer edges
		double lengthSpline = spline.getLength();

		// Check for errors in the spline calculation or zero length curves
		if (Double.isNaN(lengthSpline) || !spline.checkValues()
				|| lengthSpline < 1)
		{
			return;
		}

		mxSpline1D splineX = spline.getSplineX();
		mxSpline1D splineY = spline.getSplineY();
		double baseInterval = 12.0 / lengthSpline;
		double minInterval = 1.0 / lengthSpline;

		// Store the last two spline positions. If the next position is 
		// very close to where the extrapolation of the last two points 
		// then double the interval. This diviation is terms the "flatness".
		// There is a range where the interval is kept the same, any 
		// variation from this range of flatness invokes a proportional 
		// adjustment to try to reenter the range without 
		// over compensating
		double interval = baseInterval;
		// These deviations are only tested against either 
		// dimension individually, working out the correct 
		// distance is too computationally intensive
		double minDeviation = 0.15;
		double maxDeviation = 0.3;
		double preferedDeviation = (maxDeviation + minDeviation) / 2.0;

		// x1, y1 are the position two iterations ago, x2, y2
		// the position on the last iteration
		double x1 = -1.0;
		double x2 = -1.0;
		double y1 = -1.0;
		double y2 = -1.0;

		// Store the change in interval amount between iterations.
		// If it changes the extrapolation calculation must
		// take this into account.
		double intervalChange = 1;

		List<mxPoint> coreCurve = new ArrayList<mxPoint>();
		List<Double> coreIntervals = new ArrayList<Double>();
		boolean twoLoopsComplete = false;

		for (double t = 0; t <= 1.5; t += interval)
		{
			if (t > 1.0)
			{
				// Use the point regardless of the accuracy, 
				t = 1.0001;
				mxPoint endControlPoint = guidePoints
						.get(guidePoints.size() - 1);
				mxPoint finalPoint = new mxPoint(endControlPoint.getX(),
						endControlPoint.getY());
				coreCurve.add(finalPoint);
				coreIntervals.add(t);
				updateBounds(endControlPoint.getX(), endControlPoint.getY());
				break;
			}
			// Whether or not the accuracy of the current point is acceptable
			boolean currentPointAccepted = true;

			double newX = splineX.getFastValue(t);
			double newY = splineY.getFastValue(t);

			// Check if the last points are valid (indicated by
			// dissimilar values)
			// Check we're not in the first, second or last run
			if (x1 != -1.0 && twoLoopsComplete && t != 1.0001)
			{
				// Work out how far the new spline point
				// deviates from the extrapolation created 
				// by the last two points
				double diffX = Math.abs(((x2 - x1) * intervalChange + x2)
						- newX);
				double diffY = Math.abs(((y2 - y1) * intervalChange + y2)
						- newY);

				// If either the x or y of the straight line
				// extrapolation from the last two points
				// is more than the 1D deviation allowed
				// go back and re-calculate with a smaller interval
				// It's possible that the edge has curved too fast
				// for the algorithmn. If the interval is
				// reduced to less than the minimum permitted
				// interval, it may be that it's impossible
				// to get within the deviation because of
				// the extrapolation overshoot. The minimum 
				// interval is set to draw correctly for the
				// vast majority of cases.
				if ((diffX > maxDeviation || diffY > maxDeviation)
						&& interval != minInterval)
				{
					double overshootProportion = maxDeviation
							/ Math.max(diffX, diffY);

					if (interval * overshootProportion <= minInterval)
					{
						// Set the interval 
						intervalChange = minInterval / interval;
					}
					else
					{
						// The interval can still be reduced, half 
						// the interval and go back and redo
						// this iteration
						intervalChange = overshootProportion;
					}

					t -= interval;
					interval *= intervalChange;
					currentPointAccepted = false;
				}
				else if (diffX < minDeviation && diffY < minDeviation)
				{
					intervalChange = 1.4;
					interval *= intervalChange;
				}
				else
				{
					// Try to keep the deviation around the prefered value
					double errorRatio = preferedDeviation
							/ Math.max(diffX, diffY);
					intervalChange = errorRatio / 4.0;
					interval *= intervalChange;
				}

				if (currentPointAccepted)
				{
					x1 = x2;
					y1 = y2;
					x2 = newX;
					y2 = newY;
				}
			}
			else if (x1 == -1.0)
			{
				x1 = x2 = newX;
				y1 = y2 = newY;
			}
			else if (x1 == x2 && y1 == y2)
			{
				x2 = newX;
				y2 = newY;
				twoLoopsComplete = true;
			}
			if (currentPointAccepted)
			{
				mxPoint newPoint = new mxPoint(newX, newY);
				coreCurve.add(newPoint);
				coreIntervals.add(t);
				updateBounds(newX, newY);
			}
		}

		if (coreCurve.size() < 2)
		{
			// A single point makes no sense, leave the curve as invalid
			return;
		}

		mxPoint[] corePoints = new mxPoint[coreCurve.size()];
		int count = 0;

		for (mxPoint point : coreCurve)
		{
			corePoints[count++] = point;
		}

		points = new Hashtable<String, mxPoint[]>();
		curveLengths = new Hashtable<String, Double>();
		points.put(CORE_CURVE, corePoints);
		curveLengths.put(CORE_CURVE, lengthSpline);

		double[] coreIntervalsArray = new double[coreIntervals.size()];
		count = 0;

		for (Double tempInterval : coreIntervals)
		{
			coreIntervalsArray[count++] = tempInterval.doubleValue();
		}

		intervals = new Hashtable<String, double[]>();
		intervals.put(CORE_CURVE, coreIntervalsArray);

		valid = true;
	}

	/** Whether or not the label curve starts from the end target
	 *  and traces to the start of the branch
	 * @return whether the label curve is reversed
	 */
	public boolean isLabelReversed()
	{
		if (valid)
		{
			mxPoint[] centralCurve = getCurvePoints(CORE_CURVE);

			if (centralCurve != null)
			{
				double changeX = centralCurve[centralCurve.length - 1].getX()
						- centralCurve[0].getX();

				if (changeX < 0)
				{
					return true;
				}
			}
		}

		return false;
	}

	protected void createLabelCurve()
	{
		// Place the label on the "high" side of the vector
		// joining the start and end points of the curve
		mxPoint[] currentCurve = getBaseLabelCurve();

		boolean labelReversed = isLabelReversed();

		List<mxPoint> labelCurvePoints = new ArrayList<mxPoint>();

		// Lower and upper curve start from the very ends
		// of their curves, so given that their middle points
		// are derived from the center of the central points
		// they will contain one more point and both
		// side curves contain the same end point

		for (int i = 1; i < currentCurve.length; i++)
		{
			int currentIndex = i;
			int lastIndex = i - 1;

			if (labelReversed)
			{
				currentIndex = currentCurve.length - i - 1;
				lastIndex = currentCurve.length - i;
			}

			mxPoint segStartPoint = currentCurve[currentIndex];
			mxPoint segEndPoint = currentCurve[lastIndex];
			double segVectorX = segEndPoint.getX() - segStartPoint.getX();
			double segVectorY = segEndPoint.getY() - segStartPoint.getY();
			double segVectorLength = Math.sqrt(segVectorX * segVectorX
					+ segVectorY * segVectorY);
			double normSegVectorX = segVectorX / segVectorLength;
			double normSegVectorY = segVectorY / segVectorLength;
			double centerSegX = (segEndPoint.getX() + segStartPoint.getX()) / 2.0;
			double centerSegY = (segEndPoint.getY() + segStartPoint.getY()) / 2.0;

			if (i == 1)
			{
				// Special case to work out the very end points at
				// the start of the curve
				mxPoint startPoint = new mxPoint(segEndPoint.getX()
						- (normSegVectorY * labelBuffer), segEndPoint.getY()
						+ (normSegVectorX * labelBuffer));
				labelCurvePoints.add(startPoint);
				updateBounds(startPoint.getX(), startPoint.getY());
			}

			double pointX = centerSegX - (normSegVectorY * labelBuffer);
			double pointY = centerSegY + (normSegVectorX * labelBuffer);
			mxPoint labelCurvePoint = new mxPoint(pointX, pointY);
			updateBounds(pointX, pointY);
			labelCurvePoints.add(labelCurvePoint);

			if (i == currentCurve.length - 1)
			{
				// Special case to work out the very end points at
				// the start of the curve
				mxPoint endPoint = new mxPoint(segStartPoint.getX()
						- (normSegVectorY * labelBuffer), segStartPoint.getY()
						+ (normSegVectorX * labelBuffer));
				labelCurvePoints.add(endPoint);
				updateBounds(endPoint.getX(), endPoint.getY());
			}
		}

		mxPoint[] tmpPoints = new mxPoint[labelCurvePoints.size()];
		points.put(LABEL_CURVE, labelCurvePoints.toArray(tmpPoints));
		populateIntervals(LABEL_CURVE);
	}

	/**
	 * Returns the curve the label curve is too be based on
	 */
	protected mxPoint[] getBaseLabelCurve()
	{
		return getCurvePoints(CORE_CURVE);
	}

	protected void populateIntervals(String index)
	{
		mxPoint[] currentCurve = points.get(index);

		double[] newIntervals = new double[currentCurve.length];

		double totalLength = 0.0;
		newIntervals[0] = 0;

		for (int i = 0; i < currentCurve.length - 1; i++)
		{
			double changeX = currentCurve[i + 1].getX()
					- currentCurve[i].getX();
			double changeY = currentCurve[i + 1].getY()
					- currentCurve[i].getY();
			double segLength = Math.sqrt(changeX * changeX + changeY * changeY);
			// We initially fill the intervals with the total distance to
			// the end of this segment then later normalize all the values
			totalLength += segLength;
			// The first index was populated before the loop (and is always 0)
			newIntervals[i + 1] = totalLength;
		}

		// Normalize the intervals
		for (int j = 0; j < newIntervals.length; j++)
		{
			if (j == newIntervals.length - 1)
			{
				// Make the final interval slightly over
				// 1.0 so any analysis to find the lower 
				newIntervals[j] = 1.0001;
			}
			else
			{
				newIntervals[j] = newIntervals[j] / totalLength;
			}
		}

		intervals.put(index, newIntervals);
		curveLengths.put(index, totalLength);
	}

	/**
	 * Updates the existing curve using the points passed in. 
	 * @param newPoints the new guide points
	 */
	public void updateCurve(List<mxPoint> newPoints)
	{
		boolean pointsChanged = false;

		// If any of the new points are null, ignore the list
		for (mxPoint point : newPoints)
		{
			if (point == null)
			{
				return;
			}
		}

		if (newPoints.size() != guidePoints.size())
		{
			pointsChanged = true;
		}
		else
		{
			// Check for a constant translation of all guide points. In that 
			// case apply the translation directly to all curves.
			// Also check whether all of the translations are trivial
			if (newPoints.size() == guidePoints.size() && newPoints.size() > 1
					&& guidePoints.size() > 1)
			{
				boolean constantTranslation = true;
				boolean trivialTranslation = true;
				mxPoint newPoint0 = newPoints.get(0);
				mxPoint oldPoint0 = guidePoints.get(0);
				double transX = newPoint0.getX() - oldPoint0.getX();
				double transY = newPoint0.getY() - oldPoint0.getY();

				if (Math.abs(transX) > 0.01 || Math.abs(transY) > 0.01)
				{
					trivialTranslation = false;
				}

				for (int i = 1; i < newPoints.size(); i++)
				{
					double nextTransX = newPoints.get(i).getX()
							- guidePoints.get(i).getX();
					double nextTransY = newPoints.get(i).getY()
							- guidePoints.get(i).getY();

					if (Math.abs(transX - nextTransX) > 0.01
							|| Math.abs(transY - nextTransY) > 0.01)
					{
						constantTranslation = false;
					}

					if (Math.abs(nextTransX) > 0.01
							|| Math.abs(nextTransY) > 0.01)
					{
						trivialTranslation = false;
					}
				}

				if (trivialTranslation)
				{
					pointsChanged = false;
				}
				else if (constantTranslation)
				{
					pointsChanged = false;
					// Translate all stored points by the translation amounts
					Collection<mxPoint[]> curves = points.values();

					// Update all geometry information held by the curve
					// That is, all the curve points, the guide points
					// and the cached bounds
					for (mxPoint[] curve : curves)
					{
						for (int i = 0; i < curve.length; i++)
						{
							curve[i].setX(curve[i].getX() + transX);
							curve[i].setY(curve[i].getY() + transY);
						}
					}

					guidePoints = new ArrayList<mxPoint>(newPoints);
					minXBounds += transX;
					minYBounds += transY;
					maxXBounds += transX;
					maxYBounds += transY;
				}
				else
				{
					pointsChanged = true;
				}
			}
		}

		if (pointsChanged)
		{
			guidePoints = new ArrayList<mxPoint>(newPoints);
			points = new Hashtable<String, mxPoint[]>();
			valid = false;
		}
	}

	/**
	 * Obtains the points that make up the curve for the specified
	 * curve index. If that curve, or the core curve that other curves
	 * are based on have not yet been created, then they are lazily
	 * created. If creation is impossible, null is returned
	 * @param index the key specifying the curve
	 * @return the points making up that curve, or null
	 */
	public mxPoint[] getCurvePoints(String index)
	{
		if (validateCurve())
		{
			if (points.get(LABEL_CURVE) == null && index == LABEL_CURVE)
			{
				createLabelCurve();
			}

			return points.get(index);
		}

		return null;
	}

	public double[] getIntervals(String index)
	{
		if (validateCurve())
		{
			if (points.get(LABEL_CURVE) == null && index == LABEL_CURVE)
			{
				createLabelCurve();
			}

			return intervals.get(index);
		}

		return null;
	}

	public double getCurveLength(String index)
	{
		if (validateCurve())
		{
			if (intervals.get(index) == null)
			{
				createLabelCurve();
			}

			return curveLengths.get(index);
		}

		return 0;
	}

	/**
	 * Method must be called before any attempt to access curve information
	 * @return whether or not the curve may be used
	 */
	protected boolean validateCurve()
	{
		if (!valid)
		{
			createCoreCurve();
		}

		return valid;
	}

	/**
	 * Updates the total bounds of this curve, increasing any dimensions,
	 * if necessary, to fit in the specified point
	 */
	protected void updateBounds(double pointX, double pointY)
	{
		minXBounds = Math.min(minXBounds, pointX);
		maxXBounds = Math.max(maxXBounds, pointX);
		minYBounds = Math.min(minYBounds, pointY);
		maxYBounds = Math.max(maxYBounds, pointY);
	}

	/**
	 * @return the guidePoints
	 */
	public List<mxPoint> getGuidePoints()
	{
		return guidePoints;
	}
}
