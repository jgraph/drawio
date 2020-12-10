/**
 * Copyright (c) 2012-2017, JGraph Ltd
 */
package com.mxgraph.analysis;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.mxgraph.costfunction.mxDoubleValCostFunction;
import com.mxgraph.model.mxIGraphModel;
import com.mxgraph.view.mxGraph;

/**
 * Implements a collection of utility methods abstracting the graph structure
 * taking into account graph properties such as visible/non-visible traversal
 */
public class mxAnalysisGraph
{
	// contains various filters, like visibility and direction
	protected Map<String, Object> properties = new HashMap<String, Object>();

	// contains various data that is used for graph generation and analysis
	protected mxGraphGenerator generator;

	protected mxGraph graph;

	/**
	 * Returns the incoming and/or outgoing edges for the given cell.
	 * If the optional parent argument is specified, then only edges are returned
	 * where the opposite is in the given parent cell.
	 * 
	 * @param cell Cell whose edges should be returned.
	 * @param parent Optional parent. If specified the opposite end of any edge
	 * must be a child of that parent in order for the edge to be returned. The
	 * recurse parameter specifies whether or not it must be the direct child
	 * or the parent just be an ancestral parent.
	 * @param incoming Specifies if incoming edges should be included in the
	 * result.
	 * @param outgoing Specifies if outgoing edges should be included in the
	 * result.
	 * @param includeLoops Specifies if loops should be included in the result.
	 * @param recurse Specifies if the parent specified only need be an ancestral
	 * parent, <code>true</code>, or the direct parent, <code>false</code>
	 * @return Returns the edges connected to the given cell.
	 */
	public Object[] getEdges(Object cell, Object parent, boolean incoming, boolean outgoing, boolean includeLoops, boolean recurse)
	{
		if (!mxGraphProperties.isTraverseVisible(properties, mxGraphProperties.DEFAULT_TRAVERSE_VISIBLE))
		{
			return graph.getEdges(cell, parent, incoming, outgoing, includeLoops, recurse);
		}
		else
		{
			Object[] edges = graph.getEdges(cell, parent, incoming, outgoing, includeLoops, recurse);
			List<Object> result = new ArrayList<Object>(edges.length);

			mxIGraphModel model = graph.getModel();

			for (int i = 0; i < edges.length; i++)
			{
				Object source = model.getTerminal(edges[i], true);
				Object target = model.getTerminal(edges[i], false);

				if (((includeLoops && source == target) || ((source != target) && ((incoming && target == cell) || (outgoing && source == cell))))
						&& model.isVisible(edges[i]))
				{
					result.add(edges[i]);
				}
			}

			return result.toArray();
		}
	};

	/**
	 * Returns the incoming and/or outgoing edges for the given cell.
	 * If the optional parent argument is specified, then only edges are returned
	 * where the opposite is in the given parent cell.
	 * 
	 * @param cell Cell whose edges should be returned.
	 * @param parent Optional parent. If specified the opposite end of any edge
	 * must be a child of that parent in order for the edge to be returned. The
	 * recurse parameter specifies whether or not it must be the direct child
	 * or the parent just be an ancestral parent.
	 * @param includeLoops Specifies if loops should be included in the result.
	 * @param recurse Specifies if the parent specified only need be an ancestral
	 * parent, <code>true</code>, or the direct parent, <code>false</code>
	 * @return Returns the edges connected to the given cell.
	 */
	public Object[] getEdges(Object cell, Object parent, boolean includeLoops, boolean recurse)
	{
		if (mxGraphProperties.isDirected(properties, mxGraphProperties.DEFAULT_DIRECTED))
		{
			return getEdges(cell, parent, false, true, includeLoops, recurse);
		}
		else
		{
			return getEdges(cell, parent, true, true, includeLoops, recurse);
		}
	};

	/**
	 * 
	 * @param parent the cell whose children will be return
	 * @return all vertices of the given <b>parent</b>
	 */
	public Object[] getChildVertices(Object parent)
	{
		return graph.getChildVertices(parent);
	};

	/**
	 * 
	 * @param parent the cell whose child edges will be return
	 * @return all edges of the given <b>parent</b>
	 */
	public Object[] getChildEdges(Object parent)
	{
		return graph.getChildEdges(parent);
	};

	/**
	 * 
	 * @param edge the whose terminal is being sought
	 * @param isSource whether the source terminal is being sought
	 * @return the terminal as specified
	 */
	public Object getTerminal(Object edge, boolean isSource)
	{
		return graph.getModel().getTerminal(edge, isSource);
	};

	/**
	 * 
	 * @param parent
	 * @param vertices
	 * @param edges
	 * @return
	 */
	public Object[] getChildCells(Object parent, boolean vertices, boolean edges)
	{
		return graph.getChildCells(parent, vertices, edges);
	}

	/**
	 * Returns all distinct opposite cells for the specified terminal
	 * on the given edges.
	 * 
	 * @param edges Edges whose opposite terminals should be returned.
	 * @param terminal Terminal that specifies the end whose opposite should be
	 * returned.
	 * @param sources Specifies if source terminals should be included in the
	 * result.
	 * @param targets Specifies if target terminals should be included in the
	 * result.
	 * @return Returns the cells at the opposite ends of the given edges.
	 */
	public Object[] getOpposites(Object[] edges, Object terminal, boolean sources, boolean targets)
	{
		// TODO needs non-visible graph version

		return graph.getOpposites(edges, terminal, sources, targets);
	};

	/**
	 * Returns all distinct opposite cells for the specified terminal
	 * on the given edges.
	 * 
	 * @param edges Edges whose opposite terminals should be returned.
	 * @param terminal Terminal that specifies the end whose opposite should be
	 * returned.
	 * @return Returns the cells at the opposite ends of the given edges.
	 */
	public Object[] getOpposites(Object[] edges, Object terminal)
	{
		if (mxGraphProperties.isDirected(properties, mxGraphProperties.DEFAULT_DIRECTED))
		{
			return getOpposites(edges, terminal, false, true);
		}
		else
		{
			return getOpposites(edges, terminal, true, true);
		}
	};

	public Map<String, Object> getProperties()
	{
		return properties;
	};

	public void setProperties(Map<String, Object> properties)
	{
		this.properties = properties;
	};

	public mxGraph getGraph()
	{
		return graph;
	};

	public void setGraph(mxGraph graph)
	{
		this.graph = graph;
	}

	public mxGraphGenerator getGenerator()
	{
		if (generator != null)
		{
			return generator;
		}
		else
		{
			return new mxGraphGenerator(null, new mxDoubleValCostFunction());
		}
	}

	public void setGenerator(mxGraphGenerator generator)
	{
		this.generator = generator;
	};
};
