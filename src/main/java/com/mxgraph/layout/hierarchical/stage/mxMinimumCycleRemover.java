/*
 * Copyright (c) 2005, David Benson
 *
 * All rights reserved.
 *
 * This file is licensed under the JGraph software license, a copy of which
 * will have been provided to you in the file LICENSE at the root of your
 * installation directory. If you are unable to locate this file please
 * contact JGraph sales for another copy.
 */
package com.mxgraph.layout.hierarchical.stage;

import java.util.HashSet;
import java.util.Iterator;
import java.util.List;
import java.util.Set;

import com.mxgraph.layout.hierarchical.mxHierarchicalLayout;
import com.mxgraph.layout.hierarchical.model.mxGraphHierarchyEdge;
import com.mxgraph.layout.hierarchical.model.mxGraphHierarchyModel;
import com.mxgraph.layout.hierarchical.model.mxGraphHierarchyNode;
import com.mxgraph.view.mxGraph;

/**
 * An implementation of the first stage of the Sugiyama layout. Straightforward
 * longest path calculation of layer assignment
 */
public class mxMinimumCycleRemover implements mxHierarchicalLayoutStage
{

	/**
	 * Reference to the enclosing layout algorithm
	 */
	protected mxHierarchicalLayout layout;

	/**
	 * Constructor that has the roots specified
	 */
	public mxMinimumCycleRemover(mxHierarchicalLayout layout)
	{
		this.layout = layout;
	}

	/**
	 * Produces the layer assignmment using the graph information specified
	 */
	public void execute(Object parent)
	{
		mxGraphHierarchyModel model = layout.getModel();
		final Set<mxGraphHierarchyNode> seenNodes = new HashSet<mxGraphHierarchyNode>();
		final Set<mxGraphHierarchyNode> unseenNodes = new HashSet<mxGraphHierarchyNode>(
				model.getVertexMapper().values());

		// Perform a dfs through the internal model. If a cycle is found,
		// reverse it.
		mxGraphHierarchyNode[] rootsArray = null;

		if (model.roots != null)
		{
			Object[] modelRoots = model.roots.toArray();
			rootsArray = new mxGraphHierarchyNode[modelRoots.length];

			for (int i = 0; i < modelRoots.length; i++)
			{
				Object node = modelRoots[i];
				mxGraphHierarchyNode internalNode = model
						.getVertexMapper().get(node);
				rootsArray[i] = internalNode;
			}
		}

		model.visit(new mxGraphHierarchyModel.CellVisitor()
		{
			public void visit(mxGraphHierarchyNode parent,
					mxGraphHierarchyNode cell,
					mxGraphHierarchyEdge connectingEdge, int layer, int seen)
			{
				// Check if the cell is in it's own ancestor list, if so
				// invert the connecting edge and reverse the target/source
				// relationship to that edge in the parent and the cell
				if ((cell)
						.isAncestor(parent))
				{
					connectingEdge.invert();
					parent.connectsAsSource.remove(connectingEdge);
					parent.connectsAsTarget.add(connectingEdge);
					cell.connectsAsTarget.remove(connectingEdge);
					cell.connectsAsSource.add(connectingEdge);
				}
				seenNodes.add(cell);
				unseenNodes.remove(cell);
			}
		}, rootsArray, true, null);

		Set<Object> possibleNewRoots = null;

		if (unseenNodes.size() > 0)
		{
			possibleNewRoots = new HashSet<Object>(unseenNodes);
		}

		// If there are any nodes that should be nodes that the dfs can miss
		// these need to be processed with the dfs and the roots assigned
		// correctly to form a correct internal model
		Set<mxGraphHierarchyNode> seenNodesCopy = new HashSet<mxGraphHierarchyNode>(
				seenNodes);

		// Pick a random cell and dfs from it
		mxGraphHierarchyNode[] unseenNodesArray = new mxGraphHierarchyNode[1];
		unseenNodes.toArray(unseenNodesArray);
		
		model.visit(new mxGraphHierarchyModel.CellVisitor()
		{
			public void visit(mxGraphHierarchyNode parent,
					mxGraphHierarchyNode cell,
					mxGraphHierarchyEdge connectingEdge, int layer, int seen)
			{
				// Check if the cell is in it's own ancestor list, if so
				// invert the connecting edge and reverse the target/source
				// relationship to that edge in the parent and the cell
				if ((cell)
						.isAncestor(parent))
				{
					connectingEdge.invert();
					parent.connectsAsSource.remove(connectingEdge);
					parent.connectsAsTarget.add(connectingEdge);
					cell.connectsAsTarget.remove(connectingEdge);
					cell.connectsAsSource.add(connectingEdge);
				}
				seenNodes.add(cell);
				unseenNodes.remove(cell);
			}
		}, unseenNodesArray, true, seenNodesCopy);

		mxGraph graph = layout.getGraph();

		if (possibleNewRoots != null && possibleNewRoots.size() > 0)
		{
			Iterator<Object> iter = possibleNewRoots.iterator();
			List<Object> roots = model.roots;

			while (iter.hasNext())
			{
				mxGraphHierarchyNode node = (mxGraphHierarchyNode) iter.next();
				Object realNode = node.cell;
				int numIncomingEdges = graph.getIncomingEdges(realNode).length;

				if (numIncomingEdges == 0)
				{
					roots.add(realNode);
				}
			}
		}
	}
}
