package com.mxgraph.analysis;

import java.util.Map;

import com.mxgraph.util.mxUtils;

/**
 * Constants for graph structure properties
 */
public class mxGraphProperties
{
	public enum GraphType
	{
		FULLY_CONNECTED,
		RANDOM_CONNECTED,
		TREE,
		FLOW,
		NULL,
		COMPLETE,
		NREGULAR,
		GRID,
		BIPARTITE,
		COMPLETE_BIPARTITE,
		BASIC_TREE,
		SIMPLE_RANDOM,
		BFS_DIR,
		BFS_UNDIR,
		DFS_DIR,
		DFS_UNDIR,
		DIJKSTRA,
		MAKE_TREE_DIRECTED, 
		SIMPLE_RANDOM_TREE, 
		KNIGHT_TOUR, 
		KNIGHT, 
		GET_ADJ_MATRIX, 
		FROM_ADJ_MATRIX, 
		PETERSEN, 
		WHEEL, 
		STAR, 
		PATH, 
		FRIENDSHIP_WINDMILL, 
		FULL_WINDMILL, 
		INDEGREE, 
		OUTDEGREE, 
		IS_CUT_VERTEX, 
		IS_CUT_EDGE, 
		RESET_STYLE, 
		KING, 
		BELLMAN_FORD
	}

	/**
	 * Whether or not to navigate the graph raw graph structure or 
	 * the visible structure. The value associated with this key
	 * should evaluate as a string to <code>1</code> or 
	 * <code>0</code>
	 */
	public static String TRAVERSE_VISIBLE = "traverseVisible";
	
	public static boolean DEFAULT_TRAVERSE_VISIBLE = false;

	/**
	 * Whether or not to take into account the direction on edges. 
	 * The value associated with this key should evaluate as a 
	 * string to <code>1</code> or <code>0</code>
	 */
	public static String DIRECTED = "directed";
	
	public static boolean DEFAULT_DIRECTED = false;

	/**
	 * @param properties
	 * @param defaultValue
	 * @return
	 */
	public static boolean isTraverseVisible(Map<String, Object> properties, boolean defaultValue)
	{
		if (properties != null)
		{
			return mxUtils.isTrue(properties, TRAVERSE_VISIBLE, defaultValue);
		}

		return false;
	}

	/**
	 * 
	 * @param properties
	 * @param isTraverseVisible
	 */
	public static void setTraverseVisible(Map<String, Object> properties,
			boolean isTraverseVisible)
	{
		if (properties != null)
		{
			properties.put(TRAVERSE_VISIBLE, isTraverseVisible);
		}
	}

	/**
	 * 
	 * @param properties
	 * @return
	 */
	public static boolean isDirected(Map<String, Object> properties, boolean defaultValue)
	{
		if (properties != null)
		{
			return mxUtils.isTrue(properties, DIRECTED, defaultValue);
		}

		return false;
	}

	/**
	 * 
	 * @param properties
	 * @param isTraverseVisible
	 */
	public static void setDirected(Map<String, Object> properties,
			boolean isDirected)
	{
		if (properties != null)
		{
			properties.put(DIRECTED, isDirected);
		}
	}

}
