package com.mxgraph.layout;

import java.util.ArrayList;
import java.util.List;

import com.mxgraph.model.mxIGraphModel;
import com.mxgraph.util.mxRectangle;
import com.mxgraph.view.mxGraph;

public class mxCircleLayout extends mxGraphLayout
{

	/**
	 * Integer specifying the size of the radius. Default is 100.
	 */
	protected double radius;

	/**
	 * Boolean specifying if the circle should be moved to the top,
	 * left corner specified by x0 and y0. Default is false.
	 */
	protected boolean moveCircle = true;

	/**
	 * Integer specifying the left coordinate of the circle.
	 * Default is 0.
	 */
	protected double x0 = 0;

	/**
	 * Integer specifying the top coordinate of the circle.
	 * Default is 0.
	 */
	protected double y0 = 0;

	/**
	 * Specifies if all edge points of traversed edges should be removed.
	 * Default is true.
	 */
	protected boolean resetEdges = false;

	/**
	 *  Specifies if the STYLE_NOEDGESTYLE flag should be set on edges that are
	 * modified by the result. Default is true.
	 */
	protected boolean disableEdgeStyle = true;

	/**
	 * Constructs a new stack layout layout for the specified graph,
	 * spacing, orientation and offset.
	 */
	public mxCircleLayout(mxGraph graph)
	{
		this(graph, 100);
	}

	/**
	 * Constructs a new stack layout layout for the specified graph,
	 * spacing, orientation and offset.
	 */
	public mxCircleLayout(mxGraph graph, double radius)
	{
		super(graph);
		this.radius = radius;
	}

	/**
	 * @return the radius
	 */
	public double getRadius()
	{
		return radius;
	}

	/**
	 * @param radius the radius to set
	 */
	public void setRadius(double radius)
	{
		this.radius = radius;
	}

	/**
	 * @return the moveCircle
	 */
	public boolean isMoveCircle()
	{
		return moveCircle;
	}

	/**
	 * @param moveCircle the moveCircle to set
	 */
	public void setMoveCircle(boolean moveCircle)
	{
		this.moveCircle = moveCircle;
	}

	/**
	 * @return the x0
	 */
	public double getX0()
	{
		return x0;
	}

	/**
	 * @param x0 the x0 to set
	 */
	public void setX0(double x0)
	{
		this.x0 = x0;
	}

	/**
	 * @return the y0
	 */
	public double getY0()
	{
		return y0;
	}

	/**
	 * @param y0 the y0 to set
	 */
	public void setY0(double y0)
	{
		this.y0 = y0;
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

	/**
	 * @return the disableEdgeStyle
	 */
	public boolean isDisableEdgeStyle()
	{
		return disableEdgeStyle;
	}

	/**
	 * @param disableEdgeStyle the disableEdgeStyle to set
	 */
	public void setDisableEdgeStyle(boolean disableEdgeStyle)
	{
		this.disableEdgeStyle = disableEdgeStyle;
	}

	/*
	 * (non-Javadoc)
	 * @see com.mxgraph.layout.mxIGraphLayout#execute(java.lang.Object)
	 */
	public void execute(Object parent)
	{
		mxIGraphModel model = graph.getModel();

		// Moves the vertices to build a circle. Makes sure the
		// radius is large enough for the vertices to not
		// overlap
		model.beginUpdate();
		try
		{
			// Gets all vertices inside the parent and finds
			// the maximum dimension of the largest vertex
			double max = 0;
			Double top = null;
			Double left = null;
			List<Object> vertices = new ArrayList<Object>();
			int childCount = model.getChildCount(parent);

			for (int i = 0; i < childCount; i++)
			{
				Object cell = model.getChildAt(parent, i);

				if (!isVertexIgnored(cell))
				{
					vertices.add(cell);
					mxRectangle bounds = getVertexBounds(cell);

					if (top == null)
					{
						top = bounds.getY();
					}
					else
					{
						top = Math.min(top, bounds.getY());
					}

					if (left == null)
					{
						left = bounds.getX();
					}
					else
					{
						left = Math.min(left, bounds.getX());
					}

					max = Math.max(max, Math.max(bounds.getWidth(), bounds
							.getHeight()));
				}
				else if (!isEdgeIgnored(cell))
				{
					if (isResetEdges())
					{
						graph.resetEdge(cell);
					}
	
					if (isDisableEdgeStyle())
					{
						setEdgeStyleEnabled(cell, false);
					}
				}
			}

			int vertexCount = vertices.size();
			double r = Math.max(vertexCount * max / Math.PI, radius);

			// Moves the circle to the specified origin
			if (moveCircle)
			{
				left = x0;
				top = y0;
			}

			circle(vertices.toArray(), r, left.doubleValue(), top.doubleValue());
		}
		finally
		{
			model.endUpdate();
		}
	}

	/**
	 * Executes the circular layout for the specified array
	 * of vertices and the given radius.
	 */
	public void circle(Object[] vertices, double r, double left, double top)
	{
		int vertexCount = vertices.length;
		double phi = 2 * Math.PI / vertexCount;

		for (int i = 0; i < vertexCount; i++)
		{
			if (isVertexMovable(vertices[i]))
			{
				setVertexLocation(vertices[i],
						left + r + r * Math.sin(i * phi), top + r + r
								* Math.cos(i * phi));
			}
		}
	}

}
