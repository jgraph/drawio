/**
 * Copyright (c) 2007, Gaudenz Alder
 */
package com.mxgraph.view;

import java.util.List;

import com.mxgraph.model.mxGeometry;
import com.mxgraph.model.mxIGraphModel;
import com.mxgraph.util.mxConstants;
import com.mxgraph.util.mxPoint;
import com.mxgraph.util.mxUtils;

/**
 * Provides various edge styles to be used as the values for
 * mxConstants.STYLE_EDGE in a cell style. Alternatevly, the mxConstants.
 * EDGESTYLE_* constants can be used to reference an edge style via the
 * mxStyleRegistry.
 */
public class mxEdgeStyle
{

	/**
	 * Defines the requirements for an edge style function.
	 */
	public interface mxEdgeStyleFunction
	{

		/**
		 * Implements an edge style function. At the time the function is called, the result
		 * array contains a placeholder (null) for the first absolute point,
		 * that is, the point where the edge and source terminal are connected.
		 * The implementation of the style then adds all intermediate waypoints
		 * except for the last point, that is, the connection point between the
		 * edge and the target terminal. The first ant the last point in the
		 * result array are then replaced with mxPoints that take into account
		 * the terminal's perimeter and next point on the edge.
		 * 
		 * @param state Cell state that represents the edge to be updated.
		 * @param source Cell state that represents the source terminal.
		 * @param target Cell state that represents the target terminal.
		 * @param points List of relative control points.
		 * @param result Array of points that represent the actual points of the
		 * edge.
		 */
		void apply(mxCellState state, mxCellState source, mxCellState target,
				List<mxPoint> points, List<mxPoint> result);

	}

	/**
	 * Provides an entity relation style for edges (as used in database
	 * schema diagrams).
	 */
	public static mxEdgeStyleFunction EntityRelation = new mxEdgeStyleFunction()
	{

		/* (non-Javadoc)
		 * @see com.mxgraph.view.mxEdgeStyle.mxEdgeStyleFunction#apply(com.mxgraph.view.mxCellState, com.mxgraph.view.mxCellState, com.mxgraph.view.mxCellState, java.util.List, java.util.List)
		 */
		public void apply(mxCellState state, mxCellState source,
				mxCellState target, List<mxPoint> points, List<mxPoint> result)
		{
			mxGraphView view = state.getView();
			mxIGraphModel model = view.getGraph().getModel();
			double segment = mxUtils.getDouble(state.getStyle(),
					mxConstants.STYLE_SEGMENT, mxConstants.ENTITY_SEGMENT)
					* state.view.getScale();

			mxPoint p0 = state.getAbsolutePoint(0);
			mxPoint pe = state
					.getAbsolutePoint(state.getAbsolutePointCount() - 1);

			boolean isSourceLeft = false;

			if (p0 != null)
			{
				source = new mxCellState();
				source.setX(p0.getX());
				source.setY(p0.getY());
			}
			else if (source != null)
			{
				int constraint = mxUtils.getPortConstraints(source, state, true, mxConstants.DIRECTION_MASK_NONE);
				
				if (constraint != mxConstants.DIRECTION_MASK_NONE)
				{
					isSourceLeft = constraint == mxConstants.DIRECTION_MASK_WEST;
				}
				else
				{
					mxGeometry sourceGeometry = model.getGeometry(source.cell);
	
					if (sourceGeometry.isRelative())
					{
						isSourceLeft = sourceGeometry.getX() <= 0.5;
					}
					else if (target != null)
					{
						isSourceLeft = target.getX() + target.getWidth() < source
								.getX();
					}
				}
			}

			boolean isTargetLeft = true;

			if (pe != null)
			{
				target = new mxCellState();
				target.setX(pe.getX());
				target.setY(pe.getY());
			}
			else if (target != null)
			{
				int constraint = mxUtils.getPortConstraints(target, state, false, mxConstants.DIRECTION_MASK_NONE);
				
				if (constraint != mxConstants.DIRECTION_MASK_NONE)
				{
					isTargetLeft = constraint == mxConstants.DIRECTION_MASK_WEST;
				}
				else
				{
					mxGeometry targetGeometry = model.getGeometry(target.cell);
	
					if (targetGeometry.isRelative())
					{
						isTargetLeft = targetGeometry.getX() <= 0.5;
					}
					else if (source != null)
					{
						isTargetLeft = source.getX() + source.getWidth() < target
								.getX();
					}
				}
			}

			if (source != null && target != null)
			{
				double x0 = (isSourceLeft) ? source.getX() : source.getX()
						+ source.getWidth();
				double y0 = view.getRoutingCenterY(source);

				double xe = (isTargetLeft) ? target.getX() : target.getX()
						+ target.getWidth();
				double ye = view.getRoutingCenterY(target);

				double seg = segment;

				double dx = (isSourceLeft) ? -seg : seg;
				mxPoint dep = new mxPoint(x0 + dx, y0);
				result.add(dep);

				dx = (isTargetLeft) ? -seg : seg;
				mxPoint arr = new mxPoint(xe + dx, ye);

				// Adds intermediate points if both go out on same side
				if (isSourceLeft == isTargetLeft)
				{
					double x = (isSourceLeft) ? Math.min(x0, xe) - segment
							: Math.max(x0, xe) + segment;
					result.add(new mxPoint(x, y0));
					result.add(new mxPoint(x, ye));
				}
				else if ((dep.getX() < arr.getX()) == isSourceLeft)
				{
					double midY = y0 + (ye - y0) / 2;
					result.add(new mxPoint(dep.getX(), midY));
					result.add(new mxPoint(arr.getX(), midY));
				}

				result.add(arr);
			}
		}
	};

	/**
	 * Provides a self-reference, aka. loop.
	 */
	public static mxEdgeStyleFunction Loop = new mxEdgeStyleFunction()
	{

		/* (non-Javadoc)
		 * @see com.mxgraph.view.mxEdgeStyle.mxEdgeStyleFunction#apply(com.mxgraph.view.mxCellState, com.mxgraph.view.mxCellState, com.mxgraph.view.mxCellState, java.util.List, java.util.List)
		 */
		public void apply(mxCellState state, mxCellState source,
				mxCellState target, List<mxPoint> points, List<mxPoint> result)
		{
			if (source != null)
			{
				mxGraphView view = state.getView();
				mxGraph graph = view.getGraph();
				mxPoint pt = (points != null && points.size() > 0) ? points
						.get(0) : null;

				if (pt != null)
				{
					pt = view.transformControlPoint(state, pt);

					if (source.contains(pt.getX(), pt.getY()))
					{
						pt = null;
					}
				}

				double x = 0;
				double dx = 0;
				double y = 0;
				double dy = 0;

				double seg = mxUtils.getDouble(state.getStyle(),
						mxConstants.STYLE_SEGMENT, graph.getGridSize())
						* view.getScale();
				String dir = mxUtils
						.getString(state.getStyle(),
								mxConstants.STYLE_DIRECTION,
								mxConstants.DIRECTION_WEST);

				if (dir.equals(mxConstants.DIRECTION_NORTH)
						|| dir.equals(mxConstants.DIRECTION_SOUTH))
				{
					x = view.getRoutingCenterX(source);
					dx = seg;
				}
				else
				{
					y = view.getRoutingCenterY(source);
					dy = seg;
				}

				if (pt == null || pt.getX() < source.getX()
						|| pt.getX() > source.getX() + source.getWidth())
				{
					if (pt != null)
					{
						x = pt.getX();
						dy = Math.max(Math.abs(y - pt.getY()), dy);
					}
					else
					{
						if (dir.equals(mxConstants.DIRECTION_NORTH))
						{
							y = source.getY() - 2 * dx;
						}
						else if (dir.equals(mxConstants.DIRECTION_SOUTH))
						{
							y = source.getY() + source.getHeight() + 2 * dx;
						}
						else if (dir.equals(mxConstants.DIRECTION_EAST))
						{
							x = source.getX() - 2 * dy;
						}
						else
						{
							x = source.getX() + source.getWidth() + 2 * dy;
						}
					}
				}
				else
				{
					// pt != null
					x = view.getRoutingCenterX(source);
					dx = Math.max(Math.abs(x - pt.getX()), dy);
					y = pt.getY();
					dy = 0;
				}

				result.add(new mxPoint(x - dx, y - dy));
				result.add(new mxPoint(x + dx, y + dy));
			}
		}
	};

	/**
	 * Uses either SideToSide or TopToBottom depending on the horizontal
	 * flag in the cell style. SideToSide is used if horizontal is true or
	 * unspecified.
	 */
	public static mxEdgeStyleFunction ElbowConnector = new mxEdgeStyleFunction()
	{

		/* (non-Javadoc)
		 * @see com.mxgraph.view.mxEdgeStyle.mxEdgeStyleFunction#apply(com.mxgraph.view.mxCellState, com.mxgraph.view.mxCellState, com.mxgraph.view.mxCellState, java.util.List, java.util.List)
		 */
		public void apply(mxCellState state, mxCellState source,
				mxCellState target, List<mxPoint> points, List<mxPoint> result)
		{
			mxPoint pt = (points != null && points.size() > 0) ? points.get(0)
					: null;

			boolean vertical = false;
			boolean horizontal = false;

			if (source != null && target != null)
			{
				if (pt != null)
				{
					double left = Math.min(source.getX(), target.getX());
					double right = Math.max(source.getX() + source.getWidth(),
							target.getX() + target.getWidth());

					double top = Math.min(source.getY(), target.getY());
					double bottom = Math.max(
							source.getY() + source.getHeight(), target.getY()
									+ target.getHeight());

					pt = state.getView().transformControlPoint(state, pt);

					vertical = pt.getY() < top || pt.getY() > bottom;
					horizontal = pt.getX() < left || pt.getX() > right;
				}
				else
				{
					double left = Math.max(source.getX(), target.getX());
					double right = Math.min(source.getX() + source.getWidth(),
							target.getX() + target.getWidth());

					vertical = left == right;

					if (!vertical)
					{
						double top = Math.max(source.getY(), target.getY());
						double bottom = Math.min(
								source.getY() + source.getHeight(),
								target.getY() + target.getHeight());

						horizontal = top == bottom;
					}
				}
			}

			if (!horizontal
					&& (vertical || mxUtils.getString(state.getStyle(),
							mxConstants.STYLE_ELBOW, "").equals(
							mxConstants.ELBOW_VERTICAL)))
			{
				mxEdgeStyle.TopToBottom.apply(state, source, target, points,
						result);
			}
			else
			{
				mxEdgeStyle.SideToSide.apply(state, source, target, points,
						result);
			}
		}
	};

	/**
	 * Provides a vertical elbow edge.
	 */
	public static mxEdgeStyleFunction SideToSide = new mxEdgeStyleFunction()
	{

		/* (non-Javadoc)
		 * @see com.mxgraph.view.mxEdgeStyle.mxEdgeStyleFunction#apply(com.mxgraph.view.mxCellState, com.mxgraph.view.mxCellState, com.mxgraph.view.mxCellState, java.util.List, java.util.List)
		 */
		public void apply(mxCellState state, mxCellState source,
				mxCellState target, List<mxPoint> points, List<mxPoint> result)
		{
			mxGraphView view = state.getView();
			mxPoint pt = ((points != null && points.size() > 0) ? points.get(0)
					: null);
			mxPoint p0 = state.getAbsolutePoint(0);
			mxPoint pe = state
					.getAbsolutePoint(state.getAbsolutePointCount() - 1);

			if (pt != null)
			{
				pt = view.transformControlPoint(state, pt);
			}

			if (p0 != null)
			{
				source = new mxCellState();
				source.setX(p0.getX());
				source.setY(p0.getY());
			}

			if (pe != null)
			{
				target = new mxCellState();
				target.setX(pe.getX());
				target.setY(pe.getY());
			}

			if (source != null && target != null)
			{
				double l = Math.max(source.getX(), target.getX());
				double r = Math.min(source.getX() + source.getWidth(),
						target.getX() + target.getWidth());

				double x = (pt != null) ? pt.getX() : r + (l - r) / 2;

				double y1 = view.getRoutingCenterY(source);
				double y2 = view.getRoutingCenterY(target);

				if (pt != null)
				{
					if (pt.getY() >= source.getY()
							&& pt.getY() <= source.getY() + source.getHeight())
					{
						y1 = pt.getY();
					}

					if (pt.getY() >= target.getY()
							&& pt.getY() <= target.getY() + target.getHeight())
					{
						y2 = pt.getY();
					}
				}

				if (!target.contains(x, y1) && !source.contains(x, y1))
				{
					result.add(new mxPoint(x, y1));
				}

				if (!target.contains(x, y2) && !source.contains(x, y2))
				{
					result.add(new mxPoint(x, y2));
				}

				if (result.size() == 1)
				{
					if (pt != null)
					{
						if (!target.contains(x, pt.getY()) && !source.contains(x, pt.getY()))
						{
							result.add(new mxPoint(x, pt.getY()));
						}
					}
					else
					{
						double t = Math.max(source.getY(), target.getY());
						double b = Math.min(source.getY() + source.getHeight(),
								target.getY() + target.getHeight());

						result.add(new mxPoint(x, t + (b - t) / 2));
					}
				}
			}
		}
	};

	/**
	 * Provides a horizontal elbow edge.
	 */
	public static mxEdgeStyleFunction TopToBottom = new mxEdgeStyleFunction()
	{

		/* (non-Javadoc)
		 * @see com.mxgraph.view.mxEdgeStyle.mxEdgeStyleFunction#apply(com.mxgraph.view.mxCellState, com.mxgraph.view.mxCellState, com.mxgraph.view.mxCellState, java.util.List, java.util.List)
		 */
		public void apply(mxCellState state, mxCellState source,
				mxCellState target, List<mxPoint> points, List<mxPoint> result)
		{
			mxGraphView view = state.getView();
			mxPoint pt = ((points != null && points.size() > 0) ? points.get(0)
					: null);
			mxPoint p0 = state.getAbsolutePoint(0);
			mxPoint pe = state
					.getAbsolutePoint(state.getAbsolutePointCount() - 1);

			if (pt != null)
			{
				pt = view.transformControlPoint(state, pt);
			}

			if (p0 != null)
			{
				source = new mxCellState();
				source.setX(p0.getX());
				source.setY(p0.getY());
			}

			if (pe != null)
			{
				target = new mxCellState();
				target.setX(pe.getX());
				target.setY(pe.getY());
			}

			if (source != null && target != null)
			{
				double t = Math.max(source.getY(), target.getY());
				double b = Math.min(source.getY() + source.getHeight(),
						target.getY() + target.getHeight());

				double x = view.getRoutingCenterX(source);

				if (pt != null && pt.getX() >= source.getX()
						&& pt.getX() <= source.getX() + source.getWidth())
				{
					x = pt.getX();
				}

				double y = (pt != null) ? pt.getY() : b + (t - b) / 2;

				if (!target.contains(x, y) && !source.contains(x, y))
				{
					result.add(new mxPoint(x, y));
				}

				if (pt != null && pt.getX() >= target.getX()
						&& pt.getX() <= target.getX() + target.getWidth())
				{
					x = pt.getX();
				}
				else
				{
					x = view.getRoutingCenterX(target);
				}

				if (!target.contains(x, y) && !source.contains(x, y))
				{
					result.add(new mxPoint(x, y));
				}

				if (result.size() == 1)
				{
					if (pt != null)
					{
						if (!target.contains(pt.getX(), y) && !source.contains(pt.getX(), y))
						{
							result.add(new mxPoint(pt.getX(), y));
						}
					}
					else
					{
						double l = Math.max(source.getX(), target.getX());
						double r = Math.min(source.getX() + source.getWidth(),
								target.getX() + target.getWidth());

						result.add(new mxPoint(l + (r - l) / 2, y));
					}
				}
			}
		}
	};

	/**
	 * Implements an orthogonal edge style. Use <mxEdgeSegmentHandler>
	 * as an interactive handler for this style.
	 */
	public static mxEdgeStyleFunction SegmentConnector = new mxEdgeStyleFunction()
	{

		/* (non-Javadoc)
		 * @see com.mxgraph.view.mxEdgeStyle.mxEdgeStyleFunction#apply(com.mxgraph.view.mxCellState, com.mxgraph.view.mxCellState, com.mxgraph.view.mxCellState, java.util.List, java.util.List)
		 */
		public void apply(mxCellState state, mxCellState source, mxCellState target, List<mxPoint> hints, List<mxPoint> result)
		{
			// Creates array of all way- and terminalpoints
			List<mxPoint> pts = state.absolutePoints;
			boolean horizontal = true;
			mxPoint hint = null;

			// Adds the first point
			mxPoint pt = pts.get(0);

			if (pt == null && source != null)
			{
				pt = new mxPoint(state.view.getRoutingCenterX(source), state.view.getRoutingCenterY(source));
			}
			else if (pt != null)
			{
				pt = (mxPoint) pt.clone();
			}

			int lastInx = pts.size() - 1;

			// Adds the waypoints
			if (hints != null && hints.size() > 0)
			{
				hint = state.view.transformControlPoint(state, hints.get(0));

				mxCellState currentTerm = source;
				mxPoint currentPt = pts.get(0);
				boolean hozChan = false;
				boolean vertChan = false;
				mxPoint currentHint = hint;
				int hintsLen = hints.size();

				for (int i = 0; i < 2; i++)
				{
					boolean fixedVertAlign = currentPt != null && currentPt.getX() == currentHint.getX();
					boolean fixedHozAlign = currentPt != null && currentPt.getY() == currentHint.getY();
					boolean inHozChan = currentTerm != null
							&& (currentHint.getY() >= currentTerm.getY() && currentHint.getY() <= currentTerm.getY()
									+ currentTerm.getHeight());
					boolean inVertChan = currentTerm != null
							&& (currentHint.getX() >= currentTerm.getX() && currentHint.getX() <= currentTerm.getX()
									+ currentTerm.getWidth());

					hozChan = fixedHozAlign || (currentPt == null && inHozChan);
					vertChan = fixedVertAlign || (currentPt == null && inVertChan);

					if (currentPt != null && (!fixedHozAlign && !fixedVertAlign) && (inHozChan || inVertChan))
					{
						horizontal = inHozChan ? false : true;
						break;
					}

					if (vertChan || hozChan)
					{
						horizontal = hozChan;

						if (i == 1)
						{
							// Work back from target end
							horizontal = hints.size() % 2 == 0 ? hozChan : vertChan;
						}

						break;
					}

					currentTerm = target;
					currentPt = pts.get(lastInx);
					currentHint = state.view.transformControlPoint(state, hints.get(hintsLen - 1));
				}

				if (horizontal
						&& ((pts.get(0) != null && pts.get(0).getY() != hint.getY()) || (pts.get(0) == null && source != null && (hint
								.getY() < source.getY() || hint.getY() > source.getY() + source.getHeight()))))
				{
					result.add(new mxPoint(pt.getX(), hint.getY()));
				}
				else if (!horizontal
						&& ((pts.get(0) != null && pts.get(0).getX() != hint.getX()) || (pts.get(0) == null && source != null && (hint
								.getX() < source.getX() || hint.getX() > source.getX() + source.getWidth()))))
				{
					result.add(new mxPoint(hint.getX(), pt.getY()));
				}

				if (horizontal)
				{
					pt.setY(hint.getY());
				}
				else
				{
					pt.setX(hint.getX());
				}

				for (int i = 0; i < hints.size(); i++)
				{
					horizontal = !horizontal;
					hint = state.view.transformControlPoint(state, hints.get(i));

					//				mxLog.show();
					//				mxLog.debug('hint', i, hint.x, hint.y);

					if (horizontal)
					{
						pt.setY(hint.getY());
					}
					else
					{
						pt.setX(hint.getX());
					}

					result.add((mxPoint) pt.clone());
				}
			}
			else
			{
				hint = pt;
				// FIXME: First click in connect preview toggles orientation
				horizontal = true;
			}

			// Adds the last point
			pt = pts.get(lastInx);

			if (pt == null && target != null)
			{
				pt = new mxPoint(state.view.getRoutingCenterX(target), state.view.getRoutingCenterY(target));
			}

			if (horizontal
					&& ((pts.get(lastInx) != null && pts.get(lastInx).getY() != hint.getY()) || (pts.get(lastInx) == null && target != null && (hint
							.getY() < target.getY() || hint.getY() > target.getY() + target.getHeight()))))
			{
				result.add(new mxPoint(pt.getX(), hint.getY()));
			}
			else if (!horizontal
					&& ((pts.get(lastInx) != null && pts.get(lastInx).getX() != hint.getX()) || (pts.get(lastInx) == null && target != null && (hint
							.getX() < target.getX() || hint.getX() > target.getX() + target.getWidth()))))
			{
				result.add(new mxPoint(hint.getX(), pt.getY()));
			}

			// Removes bends inside the source terminal for floating ports
			if (pts.get(0) == null && source != null)
			{
				while (result.size() > 1 && source.contains(result.get(1).getX(), result.get(1).getY()))
				{
					result.remove(1);
				}
			}

			// Removes bends inside the target terminal
			if (pts.get(lastInx) == null && target != null)
			{
				while (result.size() > 1 && target.contains(result.get(result.size() - 1).getX(), result.get(result.size() - 1).getY()))
				{
					result.remove(result.size() - 1);
				}
			}
		}
	};
	
	public static double orthBuffer = 10;

	public static double[][] dirVectors = new double[][] { { -1, 0 },
			{ 0, -1 }, { 1, 0 }, { 0, 1 }, { -1, 0 }, { 0, -1 }, { 1, 0 } };

	public static double[][] wayPoints1 = new double[128][2];

	/**
	 * The default routing patterns for orthogonal connections
	 */
	public static int[][][] routePatterns = new int[][][] {
			{ { 513, 2308, 2081, 2562 }, { 513, 1090, 514, 2184, 2114, 2561 },
					{ 513, 1090, 514, 2564, 2184, 2562 },
					{ 513, 2308, 2561, 1090, 514, 2568, 2308 } },
			{ { 514, 1057, 513, 2308, 2081, 2562 }, { 514, 2184, 2114, 2561 },
					{ 514, 2184, 2562, 1057, 513, 2564, 2184 },
					{ 514, 1057, 513, 2568, 2308, 2561 } },
			{ { 1090, 514, 1057, 513, 2308, 2081, 2562 }, { 2114, 2561 },
					{ 1090, 2562, 1057, 513, 2564, 2184 },
					{ 1090, 514, 1057, 513, 2308, 2561, 2568 } },
			{ { 2081, 2562 }, { 1057, 513, 1090, 514, 2184, 2114, 2561 },
					{ 1057, 513, 1090, 514, 2184, 2562, 2564 },
					{ 1057, 2561, 1090, 514, 2568, 2308 } } };

	/**
	 * Overriden routing patterns for orthogonal connections
	 * where the vertices have 
	 */
	public static int[][][] inlineRoutePatterns = new int[][][] {
			{ null, { 2114, 2568 }, null, null },
			{ null, { 514, 2081, 2114, 2568 }, null, null },
			{ null, { 2114, 2561 }, null, null },
			{ { 2081, 2562 }, { 1057, 2114, 2568 }, { 2184, 2562 }, null } };

	public static double[] vertexSeperations = new double[5];

	public static double[][] limits = new double[2][9];

	public static int LEFT_MASK = 32;

	public static int TOP_MASK = 64;

	public static int RIGHT_MASK = 128;

	public static int BOTTOM_MASK = 256;

	public static int LEFT = 1;

	public static int TOP = 2;

	public static int RIGHT = 4;

	public static int BOTTOM = 8;

	public static int SIDE_MASK = LEFT_MASK | TOP_MASK | RIGHT_MASK
			| BOTTOM_MASK;

	public static int CENTER_MASK = 512;

	public static int SOURCE_MASK = 1024;

	public static int TARGET_MASK = 2048;

	public static int VERTEX_MASK = SOURCE_MASK | TARGET_MASK;

	public static double vertBendProportion = 0.5;

	public static double hozBendProportion = 0.5;

	/**
	 * An orthogonal connector that avoids connecting vertices and 
	 * respects port constraints
	 */
	public static mxEdgeStyleFunction OrthConnector = new mxEdgeStyleFunction()
	{

		/* (non-Javadoc)
		 * @see com.mxgraph.view.mxEdgeStyle.mxEdgeStyleFunction#apply(com.mxgraph.view.mxCellState, com.mxgraph.view.mxCellState, com.mxgraph.view.mxCellState, java.util.List, java.util.List)
		 */
		public void apply(mxCellState state, mxCellState source,
				mxCellState target, List<mxPoint> points, List<mxPoint> result)
		{
			mxGraph graph = state.view.graph;
			boolean sourceEdge = source == null ? false : graph.getModel().isEdge(source.cell);
			boolean targetEdge = target == null ? false : graph.getModel().isEdge(target.cell);

			if ((points != null && points.size() > 0) || (sourceEdge) || (targetEdge))
			{
				mxEdgeStyle.SegmentConnector.apply(state, source, target, points, result);
				return;
			}

			if (source != null && target != null)
			{
				double scaledOrthBuffer = orthBuffer
						* state.getView().getScale();
				// Determine the side(s) of the source and target vertices
				// that the edge may connect to
				// portConstraint -> [source, target];
				int portConstraint[] = new int[2];
				portConstraint[0] = mxUtils.getPortConstraints(source, state,
						true);
				portConstraint[1] = mxUtils.getPortConstraints(target, state,
						false);

				// dir -> [source, target] initial direction leaving vertices
				int dir[] = new int[2];

				// Work out which faces of the vertices present against each other
				// in a way that would allow a 3-segment connection if port constraints
				// permitted.
				// geo -> [source, target] [x, y, width, height]
				double[][] geo = new double[2][4];
				geo[0][0] = source.getX();
				geo[0][1] = source.getY();
				geo[0][2] = source.getWidth();
				geo[0][3] = source.getHeight();

				geo[1][0] = target.getX();
				geo[1][1] = target.getY();
				geo[1][2] = target.getWidth();
				geo[1][3] = target.getHeight();

				for (int i = 0; i < 2; i++)
				{
					limits[i][1] = geo[i][0] - scaledOrthBuffer;
					limits[i][2] = geo[i][1] - scaledOrthBuffer;
					limits[i][4] = geo[i][0] + geo[i][2] + scaledOrthBuffer;
					limits[i][8] = geo[i][1] + geo[i][3] + scaledOrthBuffer;
				}

				// Work out which quad the target is in
				double sourceCenX = geo[0][0] + geo[0][2] / 2.0;
				double sourceCenY = geo[0][1] + geo[0][3] / 2.0;
				double targetCenX = geo[1][0] + geo[1][2] / 2.0;
				double targetCenY = geo[1][1] + geo[1][3] / 2.0;

				double dx = sourceCenX - targetCenX;
				double dy = sourceCenY - targetCenY;

				int quad = 0;

				if (dx < 0)
				{
					if (dy < 0)
					{
						quad = 2;
					}
					else
					{
						quad = 1;
					}
				}
				else
				{
					if (dy <= 0)
					{
						quad = 3;

						// Special case on x = 0 and negative y
						if (dx == 0)
						{
							quad = 2;
						}
					}

				}

				// Check for connection constraints
				mxPoint p0 = state.getAbsolutePoint(0);
				mxPoint pe = state.getAbsolutePoint(state
						.getAbsolutePointCount() - 1);
				mxPoint currentTerm = p0;

				// constraint[source, target] [x, y]
				double constraint[][] = new double[][] { { 0.5, 0.5 },
						{ 0.5, 0.5 } };

				for (int i = 0; i < 2; i++)
				{
					if (currentTerm != null)
					{
						constraint[i][0] = (currentTerm.getX() - geo[i][0])
								/ geo[i][2];

						if (constraint[i][0] < 0.01)
						{
							dir[i] = mxConstants.DIRECTION_MASK_WEST;
						}
						else if (constraint[i][0] > 0.99)
						{
							dir[i] = mxConstants.DIRECTION_MASK_EAST;
						}

						constraint[i][1] = (currentTerm.getY() - geo[i][1])
								/ geo[i][3];

						if (constraint[i][1] < 0.01)
						{
							dir[i] = mxConstants.DIRECTION_MASK_NORTH;
						}
						else if (constraint[i][1] > 0.99)
						{
							dir[i] = mxConstants.DIRECTION_MASK_SOUTH;
						}
					}

					currentTerm = pe;
				}

				double sourceTopDist = geo[0][1] - (geo[1][1] + geo[1][3]);
				double sourceLeftDist = geo[0][0] - (geo[1][0] + geo[1][2]);
				double sourceBottomDist = geo[1][1] - (geo[0][1] + geo[0][3]);
				double sourceRightDist = geo[1][0] - (geo[0][0] + geo[0][2]);

				vertexSeperations[1] = Math.max(sourceLeftDist - 2
						* scaledOrthBuffer, 0);
				vertexSeperations[2] = Math.max(sourceTopDist - 2
						* scaledOrthBuffer, 0);
				vertexSeperations[4] = Math.max(sourceBottomDist - 2
						* scaledOrthBuffer, 0);
				vertexSeperations[3] = Math.max(sourceRightDist - 2
						* scaledOrthBuffer, 0);

				//==============================================================
				// Start of source and target direction determination

				// Work through the preferred orientations by relative positioning
				// of the vertices and list them in preferred and available order
				int dirPref[] = new int[2];
				int horPref[] = new int[2];
				int vertPref[] = new int[2];

				horPref[0] = sourceLeftDist >= sourceRightDist ? mxConstants.DIRECTION_MASK_WEST
						: mxConstants.DIRECTION_MASK_EAST;
				vertPref[0] = sourceTopDist >= sourceBottomDist ? mxConstants.DIRECTION_MASK_NORTH
						: mxConstants.DIRECTION_MASK_SOUTH;

				horPref[1] = mxUtils.reversePortConstraints(horPref[0]);
				vertPref[1] = mxUtils.reversePortConstraints(vertPref[0]);

				double preferredHorizDist = sourceLeftDist >= sourceRightDist ? sourceLeftDist
						: sourceRightDist;
				double preferredVertDist = sourceTopDist >= sourceBottomDist ? sourceTopDist
						: sourceBottomDist;

				int prefOrdering[][] = new int[2][2];
				boolean preferredOrderSet = false;

				// If the preferred port isn't available, switch it
				for (int i = 0; i < 2; i++)
				{
					if (dir[i] != 0x0)
					{
						continue;
					}

					if ((horPref[i] & portConstraint[i]) == 0)
					{
						horPref[i] = mxUtils.reversePortConstraints(horPref[i]);
					}

					if ((vertPref[i] & portConstraint[i]) == 0)
					{
						vertPref[i] = mxUtils
								.reversePortConstraints(vertPref[i]);
					}

					prefOrdering[i][0] = vertPref[i];
					prefOrdering[i][1] = horPref[i];
				}

				if (preferredVertDist > scaledOrthBuffer * 2
						&& preferredHorizDist > scaledOrthBuffer * 2)
				{
					// Possibility of two segment edge connection
					if (((horPref[0] & portConstraint[0]) > 0)
							&& ((vertPref[1] & portConstraint[1]) > 0))
					{
						prefOrdering[0][0] = horPref[0];
						prefOrdering[0][1] = vertPref[0];
						prefOrdering[1][0] = vertPref[1];
						prefOrdering[1][1] = horPref[1];
						preferredOrderSet = true;
					}
					else if (((vertPref[0] & portConstraint[0]) > 0)
							&& ((horPref[1] & portConstraint[1]) > 0))
					{
						prefOrdering[0][0] = vertPref[0];
						prefOrdering[0][1] = horPref[0];
						prefOrdering[1][0] = horPref[1];
						prefOrdering[1][1] = vertPref[1];
						preferredOrderSet = true;
					}
				}
				if (preferredVertDist > scaledOrthBuffer * 2
						&& !preferredOrderSet)
				{
					prefOrdering[0][0] = vertPref[0];
					prefOrdering[0][1] = horPref[0];
					prefOrdering[1][0] = vertPref[1];
					prefOrdering[1][1] = horPref[1];
					preferredOrderSet = true;

				}
				if (preferredHorizDist > scaledOrthBuffer * 2
						&& !preferredOrderSet)
				{
					prefOrdering[0][0] = horPref[0];
					prefOrdering[0][1] = vertPref[0];
					prefOrdering[1][0] = horPref[1];
					prefOrdering[1][1] = vertPref[1];
					preferredOrderSet = true;
				}

				// The source and target prefs are now an ordered list of
				// the preferred port selections
				// It the list can contain gaps, compact it

				for (int i = 0; i < 2; i++)
				{
					if (dir[i] != 0x0)
					{
						continue;
					}

					if ((prefOrdering[i][0] & portConstraint[i]) == 0)
					{
						prefOrdering[i][0] = prefOrdering[i][1];
					}

					dirPref[i] = prefOrdering[i][0] & portConstraint[i];
					dirPref[i] |= (prefOrdering[i][1] & portConstraint[i]) << 8;
					dirPref[i] |= (prefOrdering[1 - i][i] & portConstraint[i]) << 16;
					dirPref[i] |= (prefOrdering[1 - i][1 - i] & portConstraint[i]) << 24;

					if ((dirPref[i] & 0xF) == 0)
					{
						dirPref[i] = dirPref[i] << 8;
					}
					if ((dirPref[i] & 0xF00) == 0)
					{
						dirPref[i] = (dirPref[i] & 0xF) | dirPref[i] >> 8;
					}
					if ((dirPref[i] & 0xF0000) == 0)
					{
						dirPref[i] = (dirPref[i] & 0xFFFF)
								| ((dirPref[i] & 0xF000000) >> 8);
					}

					dir[i] = dirPref[i] & 0xF;

					if (portConstraint[i] == mxConstants.DIRECTION_MASK_WEST
							|| portConstraint[i] == mxConstants.DIRECTION_MASK_NORTH
							|| portConstraint[i] == mxConstants.DIRECTION_MASK_EAST
							|| portConstraint[i] == mxConstants.DIRECTION_MASK_SOUTH)
					{
						dir[i] = portConstraint[i];
					}
				}

				//==============================================================
				// End of source and target direction determination

				int[] routePattern = getRoutePattern(dir, quad, dx, dy);

				if (dx == 0 || dy == 0)
				{

				}

				wayPoints1[0][0] = geo[0][0];
				wayPoints1[0][1] = geo[0][1];

				switch (dir[0])
				{
					case mxConstants.DIRECTION_MASK_WEST:
						wayPoints1[0][0] -= scaledOrthBuffer;
						wayPoints1[0][1] += constraint[0][1] * geo[0][3];
						break;
					case mxConstants.DIRECTION_MASK_SOUTH:
						wayPoints1[0][0] += constraint[0][0] * geo[0][2];
						wayPoints1[0][1] += geo[0][3] + scaledOrthBuffer;
						break;
					case mxConstants.DIRECTION_MASK_EAST:
						wayPoints1[0][0] += geo[0][2] + scaledOrthBuffer;
						wayPoints1[0][1] += constraint[0][1] * geo[0][3];
						break;
					case mxConstants.DIRECTION_MASK_NORTH:
						wayPoints1[0][0] += constraint[0][0] * geo[0][2];
						wayPoints1[0][1] -= scaledOrthBuffer;
						break;
				}

				int currentIndex = 0;

				int lastOrientation = (dir[0] & (mxConstants.DIRECTION_MASK_EAST | mxConstants.DIRECTION_MASK_WEST)) > 0 ? 0
						: 1;
				int currentOrientation = 0;

				for (int i = 0; i < routePattern.length; i++)
				{
					int nextDirection = routePattern[i] & 0xF;

					// Rotate the index of this direction by the quad
					// to get the real direction
					int directionIndex = nextDirection == mxConstants.DIRECTION_MASK_EAST ? 3
							: nextDirection;

					directionIndex += quad;

					if (directionIndex > 4)
					{
						directionIndex -= 4;
					}

					double[] direction = dirVectors[directionIndex - 1];

					currentOrientation = (directionIndex % 2 > 0) ? 0 : 1;
					// Only update the current index if the point moved
					// in the direction of the current segment move,
					// otherwise the same point is moved until there is 
					// a segment direction change
					if (currentOrientation != lastOrientation)
					{
						currentIndex++;
						// Copy the previous way point into the new one
						// We can't base the new position on index - 1
						// because sometime elbows turn out not to exist,
						// then we'd have to rewind.
						wayPoints1[currentIndex][0] = wayPoints1[currentIndex - 1][0];
						wayPoints1[currentIndex][1] = wayPoints1[currentIndex - 1][1];
					}

					boolean tar = (routePattern[i] & TARGET_MASK) > 0;
					boolean sou = (routePattern[i] & SOURCE_MASK) > 0;
					int side = (routePattern[i] & SIDE_MASK) >> 5;
					side = side << quad;

					if (side > 0xF)
					{
						side = side >> 4;
					}

					boolean center = (routePattern[i] & CENTER_MASK) > 0;

					if ((sou || tar) && side < 9)
					{
						double limit = 0;
						int souTar = sou ? 0 : 1;

						if (center && currentOrientation == 0)
						{
							limit = geo[souTar][0] + constraint[souTar][0]
									* geo[souTar][2];
						}
						else if (center)
						{
							limit = geo[souTar][1] + constraint[souTar][1]
									* geo[souTar][3];
						}
						else
						{
							limit = limits[souTar][side];
						}

						if (currentOrientation == 0)
						{
							double lastX = wayPoints1[currentIndex][0];
							double deltaX = (limit - lastX) * direction[0];

							if (deltaX > 0)
							{
								wayPoints1[currentIndex][0] += direction[0]
										* deltaX;
							}
						}
						else
						{
							double lastY = wayPoints1[currentIndex][1];
							double deltaY = (limit - lastY) * direction[1];

							if (deltaY > 0)
							{
								wayPoints1[currentIndex][1] += direction[1]
										* deltaY;
							}
						}
					}

					else if (center)
					{
						// Which center we're travelling to depend on the current direction
						wayPoints1[currentIndex][0] += direction[0]
								* Math.abs(vertexSeperations[directionIndex] / 2);
						wayPoints1[currentIndex][1] += direction[1]
								* Math.abs(vertexSeperations[directionIndex] / 2);
					}

					if (currentIndex > 0
							&& wayPoints1[currentIndex][currentOrientation] == wayPoints1[currentIndex - 1][currentOrientation])
					{
						currentIndex--;
					}
					else
					{
						lastOrientation = currentOrientation;
					}
				}

				for (int i = 0; i <= currentIndex; i++)
				{
					result.add(new mxPoint(wayPoints1[i][0], wayPoints1[i][1]));
				}

			}
		}

		/**
		 * Hook method to return the routing pattern for the given state
		 * @param dir 
		 * @param quad 
		 * @param dx 
		 * @param dy 
		 * @return
		 */
		protected int[] getRoutePattern(int[] dir, double quad, double dx,
				double dy)
		{
			int sourceIndex = dir[0] == mxConstants.DIRECTION_MASK_EAST ? 3
					: dir[0];
			int targetIndex = dir[1] == mxConstants.DIRECTION_MASK_EAST ? 3
					: dir[1];

			sourceIndex -= quad;
			targetIndex -= quad;

			if (sourceIndex < 1)
			{
				sourceIndex += 4;
			}
			if (targetIndex < 1)
			{
				targetIndex += 4;
			}

			int[] result = routePatterns[sourceIndex - 1][targetIndex - 1];

			if (dx == 0 || dy == 0)
			{
				if (inlineRoutePatterns[sourceIndex - 1][targetIndex - 1] != null)
				{
					result = inlineRoutePatterns[sourceIndex - 1][targetIndex - 1];
				}
			}

			return result;
		}
	};
}
