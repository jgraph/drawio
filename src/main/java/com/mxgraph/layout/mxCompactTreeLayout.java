package com.mxgraph.layout;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import com.mxgraph.model.mxGraphModel;
import com.mxgraph.model.mxIGraphModel;
import com.mxgraph.util.mxPoint;
import com.mxgraph.util.mxRectangle;
import com.mxgraph.util.mxUtils;
import com.mxgraph.view.mxCellState;
import com.mxgraph.view.mxGraph;
import com.mxgraph.view.mxGraphView;

public class mxCompactTreeLayout extends mxGraphLayout
{

	/**
	 * Specifies the orientation of the layout. Default is true.
	 */
	protected boolean horizontal;

	/**
	 * Specifies if edge directions should be inverted. Default is false.
	 */
	protected boolean invert;

	/**
	 * If the parents should be resized to match the width/height of the
	 * children. Default is true.
	 */
	protected boolean resizeParent = true;

	/**
	 * Padding added to resized parents
	 */
	protected int groupPadding = 10;

	/**
	 * A set of the parents that need updating based on children
	 * process as part of the layout
	 */
	protected Set<Object> parentsChanged = null;

	/**
	 * Specifies if the tree should be moved to the top, left corner
	 * if it is inside a top-level layer. Default is false.
	 */
	protected boolean moveTree = false;

	/**
	 * Specifies if all edge points of traversed edges should be removed.
	 * Default is true.
	 */
	protected boolean resetEdges = true;

	/**
	 * Holds the levelDistance. Default is 10.
	 */
	protected int levelDistance = 10;

	/**
	 * Holds the nodeDistance. Default is 20.
	 */
	protected int nodeDistance = 20;

	/**
	 * The preferred horizontal distance between edges exiting a vertex
	 */
	protected int prefHozEdgeSep = 5;

	/**
	 * The preferred vertical offset between edges exiting a vertex
	 */
	protected int prefVertEdgeOff = 2;

	/**
	 * The minimum distance for an edge jetty from a vertex
	 */
	protected int minEdgeJetty = 12;

	/**
	 * The size of the vertical buffer in the center of inter-rank channels
	 * where edge control points should not be placed
	 */
	protected int channelBuffer = 4;

	/**
	 * Whether or not to apply the internal tree edge routing
	 */
	protected boolean edgeRouting = true;

	/**
	 * 
	 * @param graph
	 */
	public mxCompactTreeLayout(mxGraph graph)
	{
		this(graph, true);
	}

	/**
	 * 
	 * @param graph
	 * @param horizontal
	 */
	public mxCompactTreeLayout(mxGraph graph, boolean horizontal)
	{
		this(graph, horizontal, false);
	}

	/**
	 * 
	 * @param graph
	 * @param horizontal
	 * @param invert
	 */
	public mxCompactTreeLayout(mxGraph graph, boolean horizontal, boolean invert)
	{
		super(graph);
		this.horizontal = horizontal;
		this.invert = invert;
	}

	/**
	 * Returns a boolean indicating if the given <mxCell> should be ignored as a
	 * vertex. This returns true if the cell has no connections.
	 * 
	 * @param vertex Object that represents the vertex to be tested.
	 * @return Returns true if the vertex should be ignored.
	 */
	public boolean isVertexIgnored(Object vertex)
	{
		return super.isVertexIgnored(vertex)
				|| graph.getConnections(vertex).length == 0;
	}

	/**
	 * @return the horizontal
	 */
	public boolean isHorizontal()
	{
		return horizontal;
	}

	/**
	 * @param horizontal the horizontal to set
	 */
	public void setHorizontal(boolean horizontal)
	{
		this.horizontal = horizontal;
	}

	/**
	 * @return the invert
	 */
	public boolean isInvert()
	{
		return invert;
	}

	/**
	 * @param invert the invert to set
	 */
	public void setInvert(boolean invert)
	{
		this.invert = invert;
	}

	/**
	 * @return the resizeParent
	 */
	public boolean isResizeParent()
	{
		return resizeParent;
	}

	/**
	 * @param resizeParent the resizeParent to set
	 */
	public void setResizeParent(boolean resizeParent)
	{
		this.resizeParent = resizeParent;
	}

	/**
	 * @return the moveTree
	 */
	public boolean isMoveTree()
	{
		return moveTree;
	}

	/**
	 * @param moveTree the moveTree to set
	 */
	public void setMoveTree(boolean moveTree)
	{
		this.moveTree = moveTree;
	}

	/**
	 * @return the resetEdges
	 */
	public boolean isResetEdges()
	{
		return resetEdges;
	}

	/**
	 * @param resetEdges the resetEdges to set
	 */
	public void setResetEdges(boolean resetEdges)
	{
		this.resetEdges = resetEdges;
	}

	public boolean isEdgeRouting()
	{
		return edgeRouting;
	}

	public void setEdgeRouting(boolean edgeRouting)
	{
		this.edgeRouting = edgeRouting;
	}

	/**
	 * @return the levelDistance
	 */
	public int getLevelDistance()
	{
		return levelDistance;
	}

	/**
	 * @param levelDistance the levelDistance to set
	 */
	public void setLevelDistance(int levelDistance)
	{
		this.levelDistance = levelDistance;
	}

	/**
	 * @return the nodeDistance
	 */
	public int getNodeDistance()
	{
		return nodeDistance;
	}

	/**
	 * @param nodeDistance the nodeDistance to set
	 */
	public void setNodeDistance(int nodeDistance)
	{
		this.nodeDistance = nodeDistance;
	}

	public double getGroupPadding()
	{
		return groupPadding;
	}

	public void setGroupPadding(int groupPadding)
	{
		this.groupPadding = groupPadding;
	}

	/*
	 * (non-Javadoc)
	 * @see com.mxgraph.layout.mxIGraphLayout#execute(java.lang.Object)
	 */
	public void execute(Object parent)
	{
		super.execute(parent);
		execute(parent, null);
	}

	/**
	 * Implements <mxGraphLayout.execute>.
	 * 
	 * If the parent has any connected edges, then it is used as the root of
	 * the tree. Else, <mxGraph.findTreeRoots> will be used to find a suitable
	 * root node within the set of children of the given parent.
	 */
	public void execute(Object parent, Object root)
	{
		mxIGraphModel model = graph.getModel();

		if (root == null)
		{
			// Takes the parent as the root if it has outgoing edges
			if (graph.getEdges(parent, model.getParent(parent), invert,
					!invert, false).length > 0)
			{
				root = parent;
			}

			// Tries to find a suitable root in the parent's
			// children
			else
			{
				List<Object> roots = findTreeRoots(parent, invert);

				if (roots.size() > 0)
				{
					for (int i = 0; i < roots.size(); i++)
					{
						if (!isVertexIgnored(roots.get(i))
								&& graph.getEdges(roots.get(i), null, invert,
										!invert, false).length > 0)
						{
							root = roots.get(i);
							break;
						}
					}
				}
			}
		}

		if (root != null)
		{
			if (resizeParent)
			{
				parentsChanged = new HashSet<Object>();
			}
			else
			{
				parentsChanged = null;
			}

			model.beginUpdate();

			try
			{
				TreeNode node = dfs(root, parent, null);

				if (node != null)
				{
					layout(node);

					double x0 = graph.getGridSize();
					double y0 = x0;

					if (!moveTree)
					{
						mxRectangle g = getVertexBounds(root);

						if (g != null)
						{
							x0 = g.getX();
							y0 = g.getY();
						}
					}

					mxRectangle bounds = null;

					if (horizontal)
					{
						bounds = horizontalLayout(node, x0, y0, null);
					}
					else
					{
						bounds = verticalLayout(node, null, x0, y0, null);
					}

					if (bounds != null)
					{
						double dx = 0;
						double dy = 0;

						if (bounds.getX() < 0)
						{
							dx = Math.abs(x0 - bounds.getX());
						}

						if (bounds.getY() < 0)
						{
							dy = Math.abs(y0 - bounds.getY());
						}

						if (dx != 0 || dy != 0)
						{
							moveNode(node, dx, dy);
						}

						if (resizeParent)
						{
							adjustParents();
						}

						if (edgeRouting)
						{
							// Iterate through all edges setting their positions
							localEdgeProcessing(node);
						}
					}
				}
			}
			finally
			{
				model.endUpdate();
			}
		}
	}

	/**
	 * Returns all visible children in the given parent which do not have
	 * incoming edges. If the result is empty then the children with the
	 * maximum difference between incoming and outgoing edges are returned.
	 * This takes into account edges that are being promoted to the given
	 * root due to invisible children or collapsed cells.
	 * 
	 * @param parent Cell whose children should be checked.
	 * @param invert Specifies if outgoing or incoming edges should be counted
	 * for a tree root. If false then outgoing edges will be counted.
	 * @return List of tree roots in parent.
	 */
	public List<Object> findTreeRoots(Object parent, boolean invert)
	{
		List<Object> roots = new ArrayList<Object>();

		if (parent != null)
		{
			mxIGraphModel model = graph.getModel();
			int childCount = model.getChildCount(parent);
			Object best = null;
			int maxDiff = 0;

			for (int i = 0; i < childCount; i++)
			{
				Object cell = model.getChildAt(parent, i);

				if (model.isVertex(cell) && graph.isCellVisible(cell))
				{
					Object[] conns = graph.getConnections(cell, parent, true);
					int fanOut = 0;
					int fanIn = 0;

					for (int j = 0; j < conns.length; j++)
					{
						Object src = graph.getView().getVisibleTerminal(
								conns[j], true);

						if (src == cell)
						{
							fanOut++;
						}
						else
						{
							fanIn++;
						}
					}

					if ((invert && fanOut == 0 && fanIn > 0)
							|| (!invert && fanIn == 0 && fanOut > 0))
					{
						roots.add(cell);
					}

					int diff = (invert) ? fanIn - fanOut : fanOut - fanIn;

					if (diff > maxDiff)
					{
						maxDiff = diff;
						best = cell;
					}
				}
			}

			if (roots.isEmpty() && best != null)
			{
				roots.add(best);
			}
		}

		return roots;
	}

	/**
	 * Moves the specified node and all of its children by the given amount.
	 */
	protected void moveNode(TreeNode node, double dx, double dy)
	{
		node.x += dx;
		node.y += dy;
		apply(node, null);

		TreeNode child = node.child;

		while (child != null)
		{
			moveNode(child, dx, dy);
			child = child.next;
		}
	}

	/**
	 * Does a depth first search starting at the specified cell.
	 * Makes sure the specified parent is never left by the
	 * algorithm.
	 */
	protected TreeNode dfs(Object cell, Object parent, Set<Object> visited)
	{
		if (visited == null)
		{
			visited = new HashSet<Object>();
		}

		TreeNode node = null;

		if (cell != null && !visited.contains(cell) && !isVertexIgnored(cell))
		{
			visited.add(cell);
			node = createNode(cell);

			mxIGraphModel model = graph.getModel();
			TreeNode prev = null;
			Object[] out = graph.getEdges(cell, parent, invert, !invert, false,
					true);
			mxGraphView view = graph.getView();

			for (int i = 0; i < out.length; i++)
			{
				Object edge = out[i];

				if (!isEdgeIgnored(edge))
				{
					// Resets the points on the traversed edge
					if (resetEdges)
					{
						setEdgePoints(edge, null);
					}

					if (edgeRouting)
					{
						setEdgeStyleEnabled(edge, false);
						setEdgePoints(edge, null);
					}

					// Checks if terminal in same swimlane
					mxCellState state = view.getState(edge);
					Object target = (state != null) ? state
							.getVisibleTerminal(invert) : view
							.getVisibleTerminal(edge, invert);
					TreeNode tmp = dfs(target, parent, visited);

					if (tmp != null && model.getGeometry(target) != null)
					{
						if (prev == null)
						{
							node.child = tmp;
						}
						else
						{
							prev.next = tmp;
						}

						prev = tmp;
					}
				}
			}
		}

		return node;
	}

	/**
	 * Starts the actual compact tree layout algorithm
	 * at the given node.
	 */
	protected void layout(TreeNode node)
	{
		if (node != null)
		{
			TreeNode child = node.child;

			while (child != null)
			{
				layout(child);
				child = child.next;
			}

			if (node.child != null)
			{
				attachParent(node, join(node));
			}
			else
			{
				layoutLeaf(node);
			}
		}
	}

	/**
	 * 
	 */
	protected mxRectangle horizontalLayout(TreeNode node, double x0, double y0,
			mxRectangle bounds)
	{
		node.x += x0 + node.offsetX;
		node.y += y0 + node.offsetY;
		bounds = apply(node, bounds);
		TreeNode child = node.child;

		if (child != null)
		{
			bounds = horizontalLayout(child, node.x, node.y, bounds);
			double siblingOffset = node.y + child.offsetY;
			TreeNode s = child.next;

			while (s != null)
			{
				bounds = horizontalLayout(s, node.x + child.offsetX,
						siblingOffset, bounds);
				siblingOffset += s.offsetY;
				s = s.next;
			}
		}

		return bounds;
	}

	/**
	 * 
	 */
	protected mxRectangle verticalLayout(TreeNode node, Object parent,
			double x0, double y0, mxRectangle bounds)
	{
		node.x += x0 + node.offsetY;
		node.y += y0 + node.offsetX;
		bounds = apply(node, bounds);
		TreeNode child = node.child;

		if (child != null)
		{
			bounds = verticalLayout(child, node, node.x, node.y, bounds);
			double siblingOffset = node.x + child.offsetY;
			TreeNode s = child.next;

			while (s != null)
			{
				bounds = verticalLayout(s, node, siblingOffset, node.y
						+ child.offsetX, bounds);
				siblingOffset += s.offsetY;
				s = s.next;
			}
		}

		return bounds;
	}

	/**
	 * 
	 */
	protected void attachParent(TreeNode node, double height)
	{
		double x = nodeDistance + levelDistance;
		double y2 = (height - node.width) / 2 - nodeDistance;
		double y1 = y2 + node.width + 2 * nodeDistance - height;

		node.child.offsetX = x + node.height;
		node.child.offsetY = y1;

		node.contour.upperHead = createLine(node.height, 0,
				createLine(x, y1, node.contour.upperHead));
		node.contour.lowerHead = createLine(node.height, 0,
				createLine(x, y2, node.contour.lowerHead));
	}

	/**
	 * 
	 */
	protected void layoutLeaf(TreeNode node)
	{
		double dist = 2 * nodeDistance;

		node.contour.upperTail = createLine(node.height + dist, 0, null);
		node.contour.upperHead = node.contour.upperTail;
		node.contour.lowerTail = createLine(0, -node.width - dist, null);
		node.contour.lowerHead = createLine(node.height + dist, 0,
				node.contour.lowerTail);
	}

	/**
	 * 
	 */
	protected double join(TreeNode node)
	{
		double dist = 2 * nodeDistance;

		TreeNode child = node.child;
		node.contour = child.contour;
		double h = child.width + dist;
		double sum = h;
		child = child.next;

		while (child != null)
		{
			double d = merge(node.contour, child.contour);
			child.offsetY = d + h;
			child.offsetX = 0;
			h = child.width + dist;
			sum += d + h;
			child = child.next;
		}

		return sum;
	}

	/**
	 * 
	 */
	protected double merge(Polygon p1, Polygon p2)
	{
		double x = 0;
		double y = 0;
		double total = 0;

		Polyline upper = p1.lowerHead;
		Polyline lower = p2.upperHead;

		while (lower != null && upper != null)
		{
			double d = offset(x, y, lower.dx, lower.dy, upper.dx, upper.dy);
			y += d;
			total += d;

			if (x + lower.dx <= upper.dx)
			{
				x += lower.dx;
				y += lower.dy;
				lower = lower.next;
			}
			else
			{
				x -= upper.dx;
				y -= upper.dy;
				upper = upper.next;
			}
		}

		if (lower != null)
		{
			Polyline b = bridge(p1.upperTail, 0, 0, lower, x, y);
			p1.upperTail = (b.next != null) ? p2.upperTail : b;
			p1.lowerTail = p2.lowerTail;
		}
		else
		{
			Polyline b = bridge(p2.lowerTail, x, y, upper, 0, 0);

			if (b.next == null)
			{
				p1.lowerTail = b;
			}
		}

		p1.lowerHead = p2.lowerHead;

		return total;
	}

	/**
	 * 
	 */
	protected double offset(double p1, double p2, double a1, double a2,
			double b1, double b2)
	{
		double d = 0;

		if (b1 <= p1 || p1 + a1 <= 0)
		{
			return 0;
		}

		double t = b1 * a2 - a1 * b2;

		if (t > 0)
		{
			if (p1 < 0)
			{
				double s = p1 * a2;
				d = s / a1 - p2;
			}
			else if (p1 > 0)
			{
				double s = p1 * b2;
				d = s / b1 - p2;
			}
			else
			{
				d = -p2;
			}
		}
		else if (b1 < p1 + a1)
		{
			double s = (b1 - p1) * a2;
			d = b2 - (p2 + s / a1);
		}
		else if (b1 > p1 + a1)
		{
			double s = (a1 + p1) * b2;
			d = s / b1 - (p2 + a2);
		}
		else
		{
			d = b2 - (p2 + a2);
		}

		if (d > 0)
		{
			return d;
		}

		return 0;
	}

	/**
	 * 
	 */
	protected Polyline bridge(Polyline line1, double x1, double y1,
			Polyline line2, double x2, double y2)
	{
		double dx = x2 + line2.dx - x1;
		double dy = 0;
		double s = 0;

		if (line2.dx == 0)
		{
			dy = line2.dy;
		}
		else
		{
			s = dx * line2.dy;
			dy = s / line2.dx;
		}

		Polyline r = createLine(dx, dy, line2.next);
		line1.next = createLine(0, y2 + line2.dy - dy - y1, r);

		return r;
	}

	/**
	 * 
	 */
	protected TreeNode createNode(Object cell)
	{
		TreeNode node = new TreeNode(cell);

		mxRectangle geo = getVertexBounds(cell);

		if (geo != null)
		{
			if (horizontal)
			{
				node.width = geo.getHeight();
				node.height = geo.getWidth();
			}
			else
			{
				node.width = geo.getWidth();
				node.height = geo.getHeight();
			}
		}

		return node;
	}

	/**
	 * 
	 * @param node
	 * @param bounds
	 * @return
	 */
	protected mxRectangle apply(TreeNode node, mxRectangle bounds)
	{
		mxIGraphModel model = graph.getModel();
		Object cell = node.cell;
		mxRectangle g = model.getGeometry(cell);

		if (cell != null && g != null)
		{
			if (isVertexMovable(cell))
			{
				g = setVertexLocation(cell, node.x, node.y);

				if (resizeParent)
				{
					parentsChanged.add(model.getParent(cell));
				}
			}

			if (bounds == null)
			{
				bounds = new mxRectangle(g.getX(), g.getY(), g.getWidth(),
						g.getHeight());
			}
			else
			{
				bounds = new mxRectangle(Math.min(bounds.getX(), g.getX()),
						Math.min(bounds.getY(), g.getY()), Math.max(
								bounds.getX() + bounds.getWidth(),
								g.getX() + g.getWidth()), Math.max(
								bounds.getY() + bounds.getHeight(), g.getY()
										+ g.getHeight()));
			}
		}

		return bounds;
	}

	/**
	 * 
	 */
	protected Polyline createLine(double dx, double dy, Polyline next)
	{
		return new Polyline(dx, dy, next);
	}

	/**
	 * Adjust parent cells whose child geometries have changed. The default 
	 * implementation adjusts the group to just fit around the children with 
	 * a padding.
	 */
	protected void adjustParents()
	{
		arrangeGroups(mxUtils.sortCells(this.parentsChanged, true).toArray(), groupPadding);
	}

	/**
	 * Moves the specified node and all of its children by the given amount.
	 */
	protected void localEdgeProcessing(TreeNode node)
	{
		processNodeOutgoing(node);
		TreeNode child = node.child;

		while (child != null)
		{
			localEdgeProcessing(child);
			child = child.next;
		}
	}

	/**
	 * Separates the x position of edges as they connect to vertices
	 * 
	 * @param node
	 *            the root node of the tree
	 */
	protected void processNodeOutgoing(TreeNode node)
	{
		mxIGraphModel model = graph.getModel();

		TreeNode child = node.child;
		Object parentCell = node.cell;

		int childCount = 0;
		List<WeightedCellSorter> sortedCells = new ArrayList<WeightedCellSorter>();

		while (child != null)
		{
			childCount++;

			double sortingCriterion = child.x;

			if (this.horizontal)
			{
				sortingCriterion = child.y;
			}

			sortedCells.add(new WeightedCellSorter(child,
					(int) sortingCriterion));
			child = child.next;
		}

		WeightedCellSorter[] sortedCellsArray = sortedCells
				.toArray(new WeightedCellSorter[sortedCells.size()]);
		Arrays.sort(sortedCellsArray);

		double availableWidth = node.width;

		double requiredWidth = (childCount + 1) * prefHozEdgeSep;

		// Add a buffer on the edges of the vertex if the edge count allows
		if (availableWidth > requiredWidth + (2 * prefHozEdgeSep))
		{
			availableWidth -= 2 * prefHozEdgeSep;
		}

		double edgeSpacing = availableWidth / childCount;

		double currentXOffset = edgeSpacing / 2.0;

		if (availableWidth > requiredWidth + (2 * prefHozEdgeSep))
		{
			currentXOffset += prefHozEdgeSep;
		}

		double currentYOffset = minEdgeJetty - prefVertEdgeOff;
		double maxYOffset = 0;

		mxRectangle parentBounds = getVertexBounds(parentCell);
		child = node.child;

		for (int j = 0; j < sortedCellsArray.length; j++)
		{
			Object childCell = sortedCellsArray[j].cell.cell;
			mxRectangle childBounds = getVertexBounds(childCell);

			Object[] edges = mxGraphModel.getEdgesBetween(model, parentCell,
					childCell);

			List<mxPoint> newPoints = new ArrayList<mxPoint>(3);
			double x = 0;
			double y = 0;

			for (int i = 0; i < edges.length; i++)
			{
				if (this.horizontal)
				{
					// Use opposite co-ords, calculation was done for 
					// 
					x = parentBounds.getX() + parentBounds.getWidth();
					y = parentBounds.getY() + currentXOffset;
					newPoints.add(new mxPoint(x, y));
					x = parentBounds.getX() + parentBounds.getWidth()
							+ currentYOffset;
					newPoints.add(new mxPoint(x, y));
					y = childBounds.getY() + childBounds.getHeight() / 2.0;
					newPoints.add(new mxPoint(x, y));
					setEdgePoints(edges[i], newPoints);
				}
				else
				{
					x = parentBounds.getX() + currentXOffset;
					y = parentBounds.getY() + parentBounds.getHeight();
					newPoints.add(new mxPoint(x, y));
					y = parentBounds.getY() + parentBounds.getHeight()
							+ currentYOffset;
					newPoints.add(new mxPoint(x, y));
					x = childBounds.getX() + childBounds.getWidth() / 2.0;
					newPoints.add(new mxPoint(x, y));
					setEdgePoints(edges[i], newPoints);
				}
			}

			if (j < (float) childCount / 2.0f)
			{
				currentYOffset += prefVertEdgeOff;
			}
			else if (j > (float) childCount / 2.0f)
			{
				currentYOffset -= prefVertEdgeOff;
			}
			// Ignore the case if equals, this means the second of 2
			// jettys with the same y (even number of edges)

			//								pos[k * 2] = currentX;
			currentXOffset += edgeSpacing;
			//								pos[k * 2 + 1] = currentYOffset;

			maxYOffset = Math.max(maxYOffset, currentYOffset);
		}
	}

	/**
	 * A utility class used to track cells whilst sorting occurs on the weighted
	 * sum of their connected edges. Does not violate (x.compareTo(y)==0) ==
	 * (x.equals(y))
	 */
	protected class WeightedCellSorter implements Comparable<Object>
	{

		/**
		 * The weighted value of the cell stored
		 */
		public int weightedValue = 0;

		/**
		 * Whether or not to flip equal weight values.
		 */
		public boolean nudge = false;

		/**
		 * Whether or not this cell has been visited in the current assignment
		 */
		public boolean visited = false;

		/**
		 * The cell whose median value is being calculated
		 */
		public TreeNode cell = null;

		public WeightedCellSorter()
		{
			this(null, 0);
		}

		public WeightedCellSorter(TreeNode cell, int weightedValue)
		{
			this.cell = cell;
			this.weightedValue = weightedValue;
		}

		/**
		 * comparator on the medianValue
		 * 
		 * @param arg0
		 *            the object to be compared to
		 * @return the standard return you would expect when comparing two
		 *         double
		 */
		public int compareTo(Object arg0)
		{
			if (arg0 instanceof WeightedCellSorter)
			{
				if (weightedValue > ((WeightedCellSorter) arg0).weightedValue)
				{
					return 1;
				}
				else if (weightedValue < ((WeightedCellSorter) arg0).weightedValue)
				{
					return -1;
				}
			}

			return 0;
		}
	}

	/**
	 * 
	 */
	protected static class TreeNode
	{
		/**
		 * 
		 */
		protected Object cell;

		/**
		 * 
		 */
		protected double x, y, width, height, offsetX, offsetY;

		/**
		 * 
		 */
		protected TreeNode child, next; // parent, sibling

		/**
		 * 
		 */
		protected Polygon contour = new Polygon();

		/**
		 * 
		 */
		public TreeNode(Object cell)
		{
			this.cell = cell;
		}

	}

	/**
	 * 
	 */
	protected static class Polygon
	{

		/**
		 * 
		 */
		protected Polyline lowerHead, lowerTail, upperHead, upperTail;

	}

	/**
	 * 
	 */
	protected static class Polyline
	{

		/**
		 * 
		 */
		protected double dx, dy;

		/**
		 * 
		 */
		protected Polyline next;

		/**
		 * 
		 */
		protected Polyline(double dx, double dy, Polyline next)
		{
			this.dx = dx;
			this.dy = dy;
			this.next = next;
		}

	}

}
