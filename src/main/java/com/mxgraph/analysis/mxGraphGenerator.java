/**
 * Copyright (c) 2012, JGraph Ltd
 */
package com.mxgraph.analysis;

import java.util.ArrayList;
import java.util.logging.Level;
import java.util.logging.Logger;

import com.mxgraph.costfunction.mxCostFunction;
import com.mxgraph.costfunction.mxDoubleValCostFunction;
import com.mxgraph.generatorfunction.mxGeneratorFunction;
import com.mxgraph.generatorfunction.mxGeneratorRandomFunction;
import com.mxgraph.model.mxGeometry;
import com.mxgraph.model.mxIGraphModel;
import com.mxgraph.view.mxCellState;
import com.mxgraph.view.mxGraph;
import com.mxgraph.view.mxGraphView;

/**
 * @author Mate
 *
 */
public class mxGraphGenerator
{

	private static final Logger log = Logger.getLogger(mxGraphGenerator.class.getName());

	// cost function class that implements mxICostFunction
	//	private mxGeneratorFunction generatorFunction = new mxGeneratorRandomFunction(0,1,2);
	//	private mxGeneratorFunction generatorFunction = new mxGeneratorConstFunction(1.5);
	//	private mxGeneratorFunction generatorFunction = new mxGeneratorRandomIntFunction(0, 20);
	private mxGeneratorFunction generatorFunction = null;

	private mxCostFunction costFunction = null;

	public mxGraphGenerator(mxGeneratorFunction generatorFunction, mxCostFunction costFunction)
	{
		if (generatorFunction != null)
		{
			this.generatorFunction = generatorFunction;
		}

		if (costFunction != null)
		{
			this.costFunction = costFunction;
		}
		else
		{
			this.costFunction = new mxDoubleValCostFunction();
		}
	};

	/**
	 * @param aGraph 
	 * @param numVertexes 
	 * @return a null graph
	 */
	public void getNullGraph(mxAnalysisGraph aGraph, int numVertices)
	{
		if (numVertices < 0)
		{
			throw new IllegalArgumentException();
		}
		mxGraph graph = aGraph.getGraph();
		Object parent = graph.getDefaultParent();

		for (int i = 0; i < numVertices; i++)
		{
			graph.insertVertex(parent, null, new Integer(i).toString(), i * 50, 0, 25, 25);
		}
	};

	/**
	 * @param aGraph
	 * @param numVertices number of vertices
	 * @return A complete graph that has <b>numVertices</b> number of vertices
	 */
	public void getCompleteGraph(mxAnalysisGraph aGraph, int numVertices)
	{
		if (numVertices < 0)
		{
			throw new IllegalArgumentException();
		}

		mxGraph graph = aGraph.getGraph();
		Object parent = graph.getDefaultParent();
		Object[] vertices = new Object[numVertices];
		
		for (int i = 0; i < numVertices; i++)
		{
			vertices[i] = graph.insertVertex(parent, null, new Integer(i).toString(), i * 50, 0, 25, 25);
		}

		for (int i = 0; i < numVertices; i++)
		{
			Object vertex1 = vertices[i];

			for (int j = 0; j < numVertices; j++)
			{
				Object vertex2 = vertices[j];

				if (vertex1 != vertex2 && !mxGraphStructure.areConnected(aGraph, vertex1, vertex2))
				{
					graph.insertEdge(parent, null, getNewEdgeValue(aGraph), vertex1, vertex2);
				}
			}
		}
	};

	/**
	 * @param aGraph
	 * @param numRows - number of rows in the grid graph
	 * @param numColumns - number of columns in the grid graph
	 * @return Returns a <b>numColumns</b> x <b>numRows</b> grid graph
	 */
	public void getGridGraph(mxAnalysisGraph aGraph, int numColumns, int numRows)
	{
		if (numColumns < 0 || numRows < 0)
		{
			throw new IllegalArgumentException();
		}

		mxGraph graph = aGraph.getGraph();
		Object parent = graph.getDefaultParent();
		int numVertices = numColumns * numRows;
		Object[] vertices = new Object[numVertices];
		
		for (int i = 0; i < numVertices; i++)
		{
			vertices[i] = graph.insertVertex(parent, null, new Integer(i).toString(), 0, 0, 25, 25);
		}

		int vertexCount = 0;

		for (int j = 0; j < numRows; j++)
		{
			for (int i = 0; i < numColumns; i++)
			{
				Object currVertex = vertices[vertexCount];

				if (i > 0)
				{
					// connect with previous x
					graph.insertEdge(parent, null, getNewEdgeValue(aGraph), vertices[vertexCount - 1], currVertex);
				}

				if (j > 0)
				{
					//connect with previous y
					graph.insertEdge(parent, null, getNewEdgeValue(aGraph), vertices[vertexCount - numColumns], currVertex);
				}

				vertexCount++;
			}
		}
	};

	/**
	 * Sets the physical spacing between vertices in a grid graph. This works for now only for a graph generated with mxGraphCreator.getGridGraph() only after creating the graph
	 * @param aGraph
	 * @param xSpacing - horizontal spacing between vertices
	 * @param ySpacing - vertical spacing between vertices
	 * @param numRows - number of rows in the grid graph
	 * @param numColumns - number of columns in the grid graph
	 */
	public void setGridGraphSpacing(mxAnalysisGraph aGraph, double xSpacing, double ySpacing, int numColumns, int numRows)
	{
		mxGraph graph = aGraph.getGraph();

		if (xSpacing < 0 || ySpacing < 0 || numColumns < 1 || numRows < 1)
		{
			throw new IllegalArgumentException();
		}

		Object parent = graph.getDefaultParent();
		Object[] vertices = aGraph.getChildVertices(parent);
		mxIGraphModel model = graph.getModel();

		for (int i = 0; i < numRows; i++)
		{
			for (int j = 0; j < numColumns; j++)
			{
				Object currVertex = vertices[i * numColumns + j];
				mxGeometry geometry = model.getGeometry(currVertex);
				geometry.setX(j * xSpacing);
				geometry.setY(i * ySpacing);
			}
		}
	};

	/**
	 * @param aGraph
	 * @param numVerticesGroup1 number of vertices in group 1
	 * @param numVerticesGroup2 number of vertices in group 2
	 * @return a bipartite graph with group 1 containing <b>numVerticesGroup1</b> vertices and group 2 containing <b>numVerticesGroup2</b>
	 */
	public void getBipartiteGraph(mxAnalysisGraph aGraph, int numVerticesGroup1, int numVerticesGroup2)
	{
		if (numVerticesGroup1 < 0 || numVerticesGroup2 < 0)
		{
			throw new IllegalArgumentException();
		}

		int numVertices = numVerticesGroup1 + numVerticesGroup2;
		mxGraph graph = aGraph.getGraph();
		Object parent = graph.getDefaultParent();
		Object[] vertices = new Object[numVertices];
		
		for (int i = 0; i < numVertices; i++)
		{
			vertices[i] = graph.insertVertex(parent, null, new Integer(i).toString(), 0, 0, 25, 25);
		}

		for (int i = 0; i < numVerticesGroup1; i++)
		{
			Object currVertex = vertices[i];
			Object destVertex = vertices[getRandomInt(numVerticesGroup1, numVertices - 1)];
			graph.insertEdge(parent, null, getNewEdgeValue(aGraph), currVertex, destVertex);
		}

		for (int j = 0; j < numVerticesGroup2; j++)
		{
			Object currVertex = vertices[numVerticesGroup1 + j];
			int edgeNum = aGraph.getOpposites(aGraph.getEdges(currVertex, null, true, true, false, true), currVertex, true, true).length;

			if (edgeNum == 0)
			{
				Object destVertex = vertices[getRandomInt(0, numVerticesGroup1 - 1)];
				graph.insertEdge(parent, null, getNewEdgeValue(aGraph), currVertex, destVertex);
			}
		}
	};

	/**
	 * Sets the physical spacing between vertices in a bipartite graph. This works for now only for a graph generated with mxGraphCreator.getBipartiteGraph() 
	 * only after creating the graph
	 * @param aGraph
	 * @param numVerticesGroup1 - number of vertices in group 1
	 * @param numVerticesGroup2 - number of vertices in group 2
	 * @param vertexSpacing - vertical spacing between vertices in the same group
	 * @param groupSpacing - spacing between groups
	 */
	public void setBipartiteGraphSpacing(mxAnalysisGraph aGraph, int numVerticesGroup1, int numVerticesGroup2, double vertexSpacing,
			double groupSpacing)
	{
		if (numVerticesGroup1 < 0 || numVerticesGroup2 < 0)
		{
			throw new IllegalArgumentException();
		}

		mxGraph graph = aGraph.getGraph();
		double group1StartY = 0;
		double group2StartY = 0;
		Object parent = graph.getDefaultParent();
		mxIGraphModel model = graph.getModel();

		if (numVerticesGroup1 < numVerticesGroup2)
		{
			double centerYtimes2 = (numVerticesGroup2 * vertexSpacing);
			group1StartY = (centerYtimes2 - (numVerticesGroup1 * vertexSpacing)) / 2;
		}
		else
		{
			double centerYtimes2 = (numVerticesGroup1 * vertexSpacing);
			group2StartY = (centerYtimes2 - (numVerticesGroup2 * vertexSpacing)) / 2;
		}

		Object[] vertices = aGraph.getChildVertices(parent);

		// position vertexes for group 1
		for (int i = 0; i < numVerticesGroup1; i++)
		{
			Object currVertex = vertices[i];
			mxGeometry geometry = model.getGeometry(currVertex);
			geometry.setX(0);
			geometry.setY(group1StartY + i * vertexSpacing);
		}

		// position vertexes for group 2
		for (int i = numVerticesGroup1; i < numVerticesGroup1 + numVerticesGroup2; i++)
		{
			Object currVertex = vertices[i];
			mxGeometry geometry = model.getGeometry(currVertex);
			geometry.setX(groupSpacing);
			geometry.setY(group2StartY + (i - numVerticesGroup1) * vertexSpacing);
		}
	};

	/**
	 * @param aGraph
	 * @param numVerticesGroup1 number of vertices in group 1
	 * @param numVerticesGroup2 number of vertices in group 2
	 * @return a bipartite graph with group 1 containing <b>numVerticesGroup1</b> vertices and group 2 containing <b>numVerticesGroup2</b>
	 */
	public void getCompleteBipartiteGraph(mxAnalysisGraph aGraph, int numVerticesGroup1, int numVerticesGroup2)
	{
		if (numVerticesGroup1 < 0 || numVerticesGroup2 < 0)
		{
			throw new IllegalArgumentException();
		}

		int numVertices = numVerticesGroup1 + numVerticesGroup2;
		mxGraph graph = aGraph.getGraph();
		Object parent = graph.getDefaultParent();
		Object[] vertices = new Object[numVertices];
		
		for (int i = 0; i < numVertices; i++)
		{
			vertices[i] = graph.insertVertex(parent, null, new Integer(i).toString(), 0, 0, 25, 25);
		}

		for (int i = 0; i < numVerticesGroup1; i++)
		{
			for (int j = numVerticesGroup1; j < numVertices; j++)
			{
				Object currVertex = vertices[i];
				Object destVertex = vertices[j];
				graph.insertEdge(parent, null, getNewEdgeValue(aGraph), currVertex, destVertex);
			}
		}
	};

	/**
	 * @param aGraph
	 * @param xDim
	 * @param yDim
	 * @return a knight graph of size <b>xDim</b> x <b>yDim</b>
	 * Note that the minimum size is 3x3
	 */
	public void getKnightGraph(mxAnalysisGraph aGraph, int xDim, int yDim)
	{
		if (xDim < 3 || yDim < 3)
		{
			throw new IllegalArgumentException();
		}

		int numVertices = xDim * yDim;
		mxGraph graph = aGraph.getGraph();
		Object parent = graph.getDefaultParent();
		Object[] vertices = new Object[numVertices];
		
		for (int i = 0; i < numVertices; i++)
		{
			vertices[i] = graph.insertVertex(parent, null, new Integer(i).toString(), 0, 0, 25, 25);
		}

		//now we set up the starting conditions
		int[] currCoords = new int[2];

		//the main loop
		for (int i = 0; i < (xDim * yDim); i++)
		{
			currCoords = getVertexGridCoords(xDim, yDim, i);
			Object[] neighborMoves = getKnightMoveVertexes(aGraph, xDim, yDim, currCoords[0], currCoords[1]);

			for (int j = 0; j < neighborMoves.length; j++)
			{
				// connect current with the possible move that has minimum number of its (possible moves)
				if (!mxGraphStructure.areConnected(aGraph, vertices[i], neighborMoves[j]))
				{
					graph.insertEdge(parent, null, getNewEdgeValue(aGraph), vertices[i], neighborMoves[j]);
				}
				// that vertex becomes the current vertex and we repeat until no possible moves
			}
		}
	};

	/**
	 * @param aGraph
	 * @param xDim x dimension of chess-board, size starts from 1
	 * @param yDim y dimension of chess-board, size starts from 1
	 * @param xCoord x coordinate on the chess-board, coordinate starts from 1
	 * @param yCoord y coordinate on the chess-board, coordinate starts from 1
	 * @return a list of ALL vertexes which would be valid moves from the current position, regardless if they were visited or not
	 * Note that both dimensions and both coordinates must be positive
	 */
	public Object[] getKnightMoveVertexes(mxAnalysisGraph aGraph, int xDim, int yDim, int xCoord, int yCoord)
	{
		if (xCoord > xDim || yCoord > yDim || xDim < 1 || yDim < 1 || xCoord < 1 || yCoord < 1)
		{
			throw new IllegalArgumentException();
		}

		mxGraph graph = aGraph.getGraph();
		Object[] vertices = aGraph.getChildVertices(graph.getDefaultParent());

		//check all possible 8 locations

		//location 1
		int currX = xCoord + 1;
		int currY = yCoord - 2;
		ArrayList<Object> possibleMoves = new ArrayList<Object>();
		// check if in bounds
		Object currVertex;

		if (currX > 0 && currX <= xDim && currY > 0 && currY <= yDim)
		{
			currVertex = getVertexFromGrid(vertices, xDim, yDim, currX, currY);
			possibleMoves.add(currVertex);
		}

		//location 2
		currX = xCoord + 2;
		currY = yCoord - 1;

		// check if in bounds
		if (currX > 0 && currX <= xDim && currY > 0 && currY <= yDim)
		{
			currVertex = getVertexFromGrid(vertices, xDim, yDim, currX, currY);
			possibleMoves.add(currVertex);
		}

		//location 3
		currX = xCoord + 2;
		currY = yCoord + 1;

		// check if in bounds
		if (currX > 0 && currX <= xDim && currY > 0 && currY <= yDim)
		{
			currVertex = getVertexFromGrid(vertices, xDim, yDim, currX, currY);
			possibleMoves.add(currVertex);
		}

		//location 4
		currX = xCoord + 1;
		currY = yCoord + 2;

		// check if in bounds
		if (currX > 0 && currX <= xDim && currY > 0 && currY <= yDim)
		{
			currVertex = getVertexFromGrid(vertices, xDim, yDim, currX, currY);
			possibleMoves.add(currVertex);
		}

		//location 5
		currX = xCoord - 1;
		currY = yCoord + 2;

		// check if in bounds
		if (currX > 0 && currX <= xDim && currY > 0 && currY <= yDim)
		{
			currVertex = getVertexFromGrid(vertices, xDim, yDim, currX, currY);
			possibleMoves.add(currVertex);
		}

		//location 6
		currX = xCoord - 2;
		currY = yCoord + 1;

		// check if in bounds
		if (currX > 0 && currX <= xDim && currY > 0 && currY <= yDim)
		{
			currVertex = getVertexFromGrid(vertices, xDim, yDim, currX, currY);
			possibleMoves.add(currVertex);
		}

		//location 7
		currX = xCoord - 2;
		currY = yCoord - 1;

		// check if in bounds
		if (currX > 0 && currX <= xDim && currY > 0 && currY <= yDim)
		{
			currVertex = getVertexFromGrid(vertices, xDim, yDim, currX, currY);
			possibleMoves.add(currVertex);
		}

		//location 8
		currX = xCoord - 1;
		currY = yCoord - 2;

		// check if in bounds
		if (currX > 0 && currX <= xDim && currY > 0 && currY <= yDim)
		{
			currVertex = getVertexFromGrid(vertices, xDim, yDim, currX, currY);
			possibleMoves.add(currVertex);
		}

		return possibleMoves.toArray();
	};

	/**
	 * use this only with the grid graph, and various chess-board graphs, because of vertex ordering
	 * @param xDim x dimension of chess-board, size starts from 1
	 * @param yDim y dimension of chess-board, size starts from 1
	 * @param value value of the vertex that needs coordinates returned
	 * @return int[x,y] where x and y are the coordinates in the grid or chess-board
	 * Note that both dimensions must be positive
	 */
	public int[] getVertexGridCoords(int xDim, int yDim, int value)
	{
		if (value > ((yDim * xDim) - 1) || xDim < 0 || yDim < 0 || value < 0)
		{
			throw new IllegalArgumentException();
		}

		int yCoord = (int) Math.floor(value / xDim);
		int xCoord = (value - yCoord * xDim) + 1;
		yCoord += 1;

		int[] coords = new int[2];
		coords[0] = xCoord;
		coords[1] = yCoord;
		return coords;
	};

	/**
	 * use this only with the grid graph and various chess-board graphs, because of vertex ordering
	 * @param vertices
	 * @param xDim x dimension of chess-board, size starts from 1
	 * @param yDim y dimension of chess-board, size starts from 1
	 * @param xCoord x coordinate on the chess-board, coordinate starts from 1
	 * @param yCoord y coordinate on the chess-board, coordinate starts from 1
	 * @return vertex on the desired coordinates.
	 * Note that both dimensions and both coordinates must be positive
	 */
	private Object getVertexFromGrid(Object[] vertices, int xDim, int yDim, int xCoord, int yCoord)
	{
		if (xCoord > xDim || yCoord > yDim || xDim < 1 || yDim < 1 || xCoord < 1 || yCoord < 1)
		{
			throw new IllegalArgumentException();
		}

		int value = (yCoord - 1) * xDim + xCoord - 1;

		return vertices[value];
	};

	/**
	 * @param xDim
	 * @param yDim
	 * @param weights
	 * Return a king graph of size <b>xDim</b> x <b>yDim</b>
	 * Note that the minimum size is 4x4
	 */
	public void getKingGraph(mxAnalysisGraph aGraph, int xDim, int yDim)
	{
		if (xDim < 2 || yDim < 2)
		{
			throw new IllegalArgumentException();
		}

		int numVertices = xDim * yDim;
		mxGraph graph = aGraph.getGraph();
		Object parent = graph.getDefaultParent();
		Object[] vertices = new Object[numVertices];
		
		for (int i = 0; i < numVertices; i++)
		{
			vertices[i] = graph.insertVertex(parent, null, new Integer(i).toString(), 0, 0, 25, 25);
		}

		//now we set up the starting conditions
		int[] currCoords = new int[2];

		//the main loop
		for (int i = 0; i < (xDim * yDim); i++)
		{
			currCoords = getVertexGridCoords(xDim, yDim, i);
			Object[] neighborMoves = getKingMoveVertexes(aGraph, xDim, yDim, currCoords[0], currCoords[1]);

			for (int j = 0; j < neighborMoves.length; j++)
			{
				// connect current with the possible move that has minimum number of its (possible moves)
				if (!mxGraphStructure.areConnected(aGraph, vertices[i], neighborMoves[j]))
				{
					graph.insertEdge(parent, null, getNewEdgeValue(aGraph), vertices[i], neighborMoves[j]);
				}
				// that vertex becomes the current vertex and we repeat until no possible moves
			}
		}
	};

	/**
	 * @param aGraph
	 * @param xDim x dimension of the chessboard
	 * @param yDim y dimension of the chessboard
	 * @param xCoord the current x position of the king
	 * @param yCoord the current y position of the king
	 * @return list of all possible moves of a king from the specified position
	 * Note that both dimensions and both coordinates must be positive
	 */
	public Object[] getKingMoveVertexes(mxAnalysisGraph aGraph, int xDim, int yDim, int xCoord, int yCoord)
	{
		if (xDim < 0 || yDim < 0 || xCoord < 0 || yCoord < 0)
		{
			throw new IllegalArgumentException();
		}

		mxGraph graph = aGraph.getGraph();
		Object[] vertices = aGraph.getChildVertices(graph.getDefaultParent());

		//check all possible 8 locations

		//location 1
		int currX = xCoord + 1;
		int currY = yCoord - 1;
		ArrayList<Object> possibleMoves = new ArrayList<Object>();
		// check if in bounds
		Object currVertex;

		if (currX > 0 && currX <= xDim && currY > 0 && currY <= yDim)
		{
			currVertex = getVertexFromGrid(vertices, xDim, yDim, currX, currY);
			possibleMoves.add(currVertex);
		}

		//location 2
		currX = xCoord + 1;
		currY = yCoord;
		// check if in bounds
		if (currX > 0 && currX <= xDim && currY > 0 && currY <= yDim)
		{
			currVertex = getVertexFromGrid(vertices, xDim, yDim, currX, currY);
			possibleMoves.add(currVertex);
		}

		//location 3
		currX = xCoord + 1;
		currY = yCoord + 1;
		// check if in bounds
		if (currX > 0 && currX <= xDim && currY > 0 && currY <= yDim)
		{
			currVertex = getVertexFromGrid(vertices, xDim, yDim, currX, currY);
			possibleMoves.add(currVertex);
		}

		//location 4
		currX = xCoord;
		currY = yCoord + 1;
		// check if in bounds
		if (currX > 0 && currX <= xDim && currY > 0 && currY <= yDim)
		{
			currVertex = getVertexFromGrid(vertices, xDim, yDim, currX, currY);
			possibleMoves.add(currVertex);
		}

		//location 5
		currX = xCoord - 1;
		currY = yCoord + 1;
		// check if in bounds
		if (currX > 0 && currX <= xDim && currY > 0 && currY <= yDim)
		{
			currVertex = getVertexFromGrid(vertices, xDim, yDim, currX, currY);
			possibleMoves.add(currVertex);
		}

		//location 6
		currX = xCoord - 1;
		currY = yCoord;
		// check if in bounds
		if (currX > 0 && currX <= xDim && currY > 0 && currY <= yDim)
		{
			currVertex = getVertexFromGrid(vertices, xDim, yDim, currX, currY);
			possibleMoves.add(currVertex);
		}

		//location 7
		currX = xCoord - 1;
		currY = yCoord + 1;
		// check if in bounds
		if (currX > 0 && currX <= xDim && currY > 0 && currY <= yDim)
		{
			currVertex = getVertexFromGrid(vertices, xDim, yDim, currX, currY);
			possibleMoves.add(currVertex);
		}

		//location 8
		currX = xCoord;
		currY = yCoord - 1;
		// check if in bounds
		if (currX > 0 && currX <= xDim && currY > 0 && currY <= yDim)
		{
			currVertex = getVertexFromGrid(vertices, xDim, yDim, currX, currY);
			possibleMoves.add(currVertex);
		}

		return possibleMoves.toArray();
	};

	/**
	 * @param aGraph
	 * Returns a Petersen graph
	 */
	public void getPetersenGraph(mxAnalysisGraph aGraph)
	{
		mxGraph graph = aGraph.getGraph();
		Object parent = graph.getDefaultParent();
		Object[] vertices = new Object[10];
		
		for (int i = 0; i < 10; i++)
		{
			vertices[i] = graph.insertVertex(parent, null, new Integer(i).toString(), 0, 0, 25, 25);
		}

		graph.insertEdge(parent, null, getNewEdgeValue(aGraph), vertices[0], vertices[2]);
		graph.insertEdge(parent, null, getNewEdgeValue(aGraph), vertices[0], vertices[8]);
		graph.insertEdge(parent, null, getNewEdgeValue(aGraph), vertices[0], vertices[9]);
		graph.insertEdge(parent, null, getNewEdgeValue(aGraph), vertices[1], vertices[2]);
		graph.insertEdge(parent, null, getNewEdgeValue(aGraph), vertices[1], vertices[5]);
		graph.insertEdge(parent, null, getNewEdgeValue(aGraph), vertices[1], vertices[7]);
		graph.insertEdge(parent, null, getNewEdgeValue(aGraph), vertices[2], vertices[4]);
		graph.insertEdge(parent, null, getNewEdgeValue(aGraph), vertices[3], vertices[4]);
		graph.insertEdge(parent, null, getNewEdgeValue(aGraph), vertices[3], vertices[7]);
		graph.insertEdge(parent, null, getNewEdgeValue(aGraph), vertices[3], vertices[9]);
		graph.insertEdge(parent, null, getNewEdgeValue(aGraph), vertices[4], vertices[6]);
		graph.insertEdge(parent, null, getNewEdgeValue(aGraph), vertices[5], vertices[6]);
		graph.insertEdge(parent, null, getNewEdgeValue(aGraph), vertices[5], vertices[9]);
		graph.insertEdge(parent, null, getNewEdgeValue(aGraph), vertices[6], vertices[8]);
		graph.insertEdge(parent, null, getNewEdgeValue(aGraph), vertices[7], vertices[8]);
	};

	/**
	 * @param aGraph
	 * @param numVertices
	 * Returns a path graph
	 */
	public void getPathGraph(mxAnalysisGraph aGraph, int numVertices)
	{
		if (numVertices < 0)
		{
			throw new IllegalArgumentException();
		}

		mxGraph graph = aGraph.getGraph();
		Object parent = graph.getDefaultParent();
		Object[] vertices = new Object[numVertices];
		
		for (int i = 0; i < numVertices; i++)
		{
			vertices[i] = graph.insertVertex(parent, null, new Integer(i).toString(), 0, 0, 25, 25);
		}

		for (int i = 0; i < numVertices - 1; i++)
		{
			graph.insertEdge(parent, null, getNewEdgeValue(aGraph), vertices[i], vertices[i + 1]);
		}
	};

	/**
	 * Sets the physical spacing between vertices in a path graph. This works for now only for a graph generated with mxGraphCreator.getPathGraph() 
	 * only after creating the graph
	 * @param aGraph
	 * @param spacing
	 */
	public void setPathGraphSpacing(mxAnalysisGraph aGraph, double spacing)
	{
		if (spacing < 0)
		{
			throw new IllegalArgumentException();
		}

		mxGraph graph = aGraph.getGraph();
		Object parent = graph.getDefaultParent();
		Object[] vertices = aGraph.getChildVertices(parent);
		mxIGraphModel model = graph.getModel();

		for (int i = 0; i < vertices.length; i++)
		{
			Object currVertex = vertices[i];

			mxGeometry geometry = model.getGeometry(currVertex);
			geometry.setX(0);
			geometry.setY(i * spacing);
		}
	};

	/**
	 * @param aGraph
	 * @param numVertices
	 * Returns a star graph
	 * Note that minimum vertex number is 4
	 */
	public void getStarGraph(mxAnalysisGraph aGraph, int numVertices)
	{
		if (numVertices < 4)
		{
			throw new IllegalArgumentException();
		}

		mxGraph graph = aGraph.getGraph();
		Object parent = graph.getDefaultParent();
		Object[] vertices = new Object[numVertices];
		
		for (int i = 0; i < numVertices; i++)
		{
			vertices[i] = graph.insertVertex(parent, null, new Integer(i).toString(), 0, 0, 25, 25);
		}

		int numVertexesInPerimeter = numVertices - 1;

		for (int i = 0; i < numVertexesInPerimeter; i++)
		{
			graph.insertEdge(parent, null, getNewEdgeValue(aGraph), vertices[numVertexesInPerimeter], vertices[i]);
		}
	};

	/**
	 * Sets the physical size of a star graph. This works for now only for a graph generated with mxGraphCreator.getStarGraph() and getWheelGraph()
	 * @param aGraph
	 * @param graphSize
	 */
	public void setStarGraphLayout(mxAnalysisGraph aGraph, double graphSize)
	{
		if (graphSize < 4)
		{
			throw new IllegalArgumentException();
		}

		mxGraph graph = aGraph.getGraph();
		Object parent = graph.getDefaultParent();
		Object[] vertices = aGraph.getChildVertices(parent);
		mxIGraphModel model = graph.getModel();
		int vertexNum = vertices.length;
		double centerX = graphSize / 2f;
		double centerY = centerX;

		int numVertexesInPerimeter = vertexNum - 1;

		//create the circle
		for (int i = 0; i < numVertexesInPerimeter; i++)
		{
			//calc the position
			double x = 0;
			double y = 0;
			double currRatio = ((double) i / (double) numVertexesInPerimeter);
			currRatio = currRatio * 2;
			currRatio = currRatio * (double) Math.PI;
			x = Math.round(centerX + Math.round(graphSize * Math.sin(currRatio) / 2));
			y = Math.round(centerY - Math.round(graphSize * Math.cos(currRatio) / 2));
			Object currVertex = vertices[i];
			mxGeometry geometry = model.getGeometry(currVertex);
			geometry.setX(x);
			geometry.setY(y);
		}

		mxGeometry geometry = model.getGeometry(vertices[vertexNum - 1]);
		geometry.setX(centerX);
		geometry.setY(centerY);
	};

	/**
	 * @param aGraph
	 * @param numVertices
	 * Returns a wheel graph. Note that numVertices has to be at least 4.
	 */
	public void getWheelGraph(mxAnalysisGraph aGraph, int numVertices)
	{
		if (numVertices < 4)
		{
			throw new IllegalArgumentException();
		}

		mxGraph graph = aGraph.getGraph();
		Object parent = graph.getDefaultParent();
		Object[] vertices = new Object[numVertices];
		
		for (int i = 0; i < numVertices; i++)
		{
			vertices[i] = graph.insertVertex(parent, null, new Integer(i).toString(), 0, 0, 25, 25);
		}

		int numVerticesInPerimeter = numVertices - 1;

		for (int i = 0; i < numVerticesInPerimeter; i++)
		{
			graph.insertEdge(parent, null, getNewEdgeValue(aGraph), vertices[numVerticesInPerimeter], vertices[i]);

			if (i < numVerticesInPerimeter - 1)
			{
				graph.insertEdge(parent, null, getNewEdgeValue(aGraph), vertices[i], vertices[i + 1]);
			}
			else
			{
				graph.insertEdge(parent, null, getNewEdgeValue(aGraph), vertices[i], vertices[0]);
			}
		}
	};

	/**
	 * @param aGraph
	 * @param numBranches number of branches (minimum >= 2)
	 * @param branchSize number of vertices in a single branch (minimum >= 2)
	 * Returns a friendship windmill graph (aka Dutch windmill)
	 */
	public void getFriendshipWindmillGraph(mxAnalysisGraph aGraph, int numBranches, int branchSize)
	{
		if (numBranches < 2 || branchSize < 2)
		{
			throw new IllegalArgumentException();
		}

		mxGraph graph = aGraph.getGraph();
		Object parent = graph.getDefaultParent();
		int numVertices = numBranches * branchSize + 1;
		Object[] vertices = new Object[numVertices];
		int vertexCount = 0;

		for (int i = 0; i < numBranches; i++)
		{
			for (int j = 0; j < branchSize; j++)
			{
				vertices[vertexCount] = graph.insertVertex(parent, null, new Integer(vertexCount).toString(), 0, 0, 25, 25);
				vertexCount++;
			}
		}

		vertices[numVertices - 1] = graph.insertVertex(parent, null, new Integer(numVertices - 1).toString(), 0, 0, 25, 25);

		//make the connections
		for (int i = 0; i < numBranches; i++)
		{
			Object oldVertex = vertices[numVertices - 1];

			for (int j = 0; j < branchSize; j++)
			{
				Object currVertex = vertices[i * (branchSize) + j];
				graph.insertEdge(parent, null, getNewEdgeValue(aGraph), oldVertex, currVertex);
				oldVertex = currVertex;
			}

			Object currVertex = vertices[numVertices - 1];
			graph.insertEdge(parent, null, getNewEdgeValue(aGraph), oldVertex, currVertex);
		}
	};

	/**
	 * @param aGraph
	 * @param numBranches - number of branches (minimum >= 2)
	 * @param branchSize - number of vertices in a single branch (minimum >= 2)
	 * Returns a windmill graph
	 */
	public void getWindmillGraph(mxAnalysisGraph aGraph, int numBranches, int branchSize)
	{
		if (numBranches < 2 || branchSize < 2)
		{
			throw new IllegalArgumentException();
		}

		mxGraph graph = aGraph.getGraph();
		Object parent = graph.getDefaultParent();
		int numVertices = numBranches * branchSize + 1;
		Object[] vertices = new Object[numVertices];
		
		int vertexCount = 0;

		for (int i = 0; i < numBranches; i++)
		{
			for (int j = 0; j < branchSize; j++)
			{
				vertices[vertexCount] = graph.insertVertex(parent, null, new Integer(vertexCount).toString(), 0, 0, 25, 25);
				vertexCount++;
			}
		}

		vertices[numVertices - 1] = graph.insertVertex(parent, null, new Integer(numVertices - 1).toString(), 0, 0, 25, 25);
		Object centerVertex = vertices[numVertices - 1];

		//make the connections
		for (int i = 0; i < numBranches; i++)
		{
			for (int j = 0; j < branchSize; j++)
			{
				Object vertex1 = vertices[i * (branchSize) + j];
				if (!mxGraphStructure.areConnected(aGraph, centerVertex, vertex1))
				{
					graph.insertEdge(parent, null, getNewEdgeValue(aGraph), centerVertex, vertex1);
				}

				for (int k = 0; k < branchSize; k++)
				{
					Object vertex2 = vertices[i * (branchSize) + k];

					if (j != k && !mxGraphStructure.areConnected(aGraph, vertex1, vertex2))
					{
						graph.insertEdge(parent, null, getNewEdgeValue(aGraph), vertex1, vertex2);
					}
				}
			}
		}
	};

	//NOTE the inside code is delicate, so please change it only if you know what you're doing
	/**
	 * Sets the layout of a windmill graph. Use this method only for graphs generated with mxGraphGenerator.getWindmillGraph() and getFriendshitWindmillGraph() 
	 * @param aGraph
	 * @param numBranches
	 * @param numVerticesInBranch
	 * @param graphSize
	 */
	public void setWindmillGraphLayout(mxAnalysisGraph aGraph, int numBranches, int numVerticesInBranch, double graphSize)
	{
		if (graphSize < 0 || numBranches < 2 || numVerticesInBranch < 1)
		{
			throw new IllegalArgumentException();
		}

		mxGraph graph = aGraph.getGraph();
		Object parent = graph.getDefaultParent();
		Object[] vertices = aGraph.getChildVertices(parent);
		mxIGraphModel model = graph.getModel();
		int vertexNum = vertices.length;
		double centerX = graphSize / 2f;
		double centerY = centerX;
		boolean isBranchSizeEven = ((numVerticesInBranch) % 2 == 0);
		int middleIndex = (int) Math.ceil(numVerticesInBranch / 2f);

		//create the circle
		for (int i = 0; i < numBranches; i++)
		{
			for (int j = 0; j < numVerticesInBranch; j++)
			{
				double currSize = this.getRingSize(j + 1, numVerticesInBranch, graphSize);

				//calc the position
				double x = 0;
				double y = 0;
				int numVertexesInPerimeter = 0;
				double currRatio = 0;
				numVertexesInPerimeter = numBranches;

				// need to detect the 2 middle vertices for even sized branches
				if (isBranchSizeEven && j == middleIndex - 1)
				{
					//full size
					currRatio = ((double) i - (0.0005f * graphSize / Math.pow(numVerticesInBranch, 1))) / (double) numVertexesInPerimeter;
				}
				else if (isBranchSizeEven && j == middleIndex)
				{
					currRatio = ((double) i + (0.0005f * graphSize / Math.pow(numVerticesInBranch, 1))) / (double) numVertexesInPerimeter;
				}
				else if (!isBranchSizeEven && currSize == graphSize)
				{
					currRatio = ((double) i / (double) numVertexesInPerimeter);
				}
				else
				{
					if (j + 1 < middleIndex)
					{
						//before middle
						currRatio = ((double) (i - 1f / Math.pow(currSize, 0.25) + 0.00000000000015f * Math.pow(currSize, 4)) / (double) numVertexesInPerimeter);
					}
					else
					{
						//after middle
						currRatio = ((double) (i + 1f / Math.pow(currSize, 0.25) - 0.00000000000015f * Math.pow(currSize, 4)) / (double) numVertexesInPerimeter);
					}
				}

				currRatio = currRatio * 2;
				currRatio = currRatio * (double) Math.PI;
				x = Math.round(centerX + Math.round(currSize * Math.sin(currRatio) / 2));
				y = Math.round(centerY - Math.round(currSize * Math.cos(currRatio) / 2));
				//shoot
				int currIndex = i * (numVerticesInBranch) + j;
				Object currVertex = vertices[currIndex];
				mxGeometry geometry = model.getGeometry(currVertex);
				geometry.setX(x);
				geometry.setY(y);
			}
		}

		//the center vertex is the last one
		Object currVertex = vertices[vertexNum - 1];
		mxGeometry geometry = model.getGeometry(currVertex);
		geometry.setX(centerX);
		geometry.setY(centerY);
	};

	/**
	 * A helper function that calculates the ring size for a windmill graph, based on the index of a vertex in a brach and branch size. - for internal use
	 * @param currVertex - starting from 1
	 * @param branchSize - starting from 1
	 * @param fullSize
	 * @return ring size
	 */
	private double getRingSize(int currIndex, int branchSize, double fullSize)
	{
		if (currIndex < 1 || currIndex > branchSize || branchSize < 1 || fullSize < 0)
		{
			throw new IllegalArgumentException();
		}

		int middleIndex = 0;
		boolean isBranchSizeEven = ((branchSize) % 2 == 0);

		middleIndex = (int) Math.ceil(branchSize / 2f);

		if (currIndex == middleIndex || (isBranchSizeEven && currIndex == middleIndex + 1))
		{
			//full size
			return fullSize;
		}
		else if (currIndex >= middleIndex)
		{
			//after middle
			currIndex = branchSize - currIndex + 1;
		}
		return (((float) Math.pow(currIndex, 0.75) / (float) Math.pow(middleIndex, 0.75)) * fullSize);
	};

	/**
	 * Generates a random graph
	 * @param aGraph
	 * @param numNodes number of vertexes
	 * @param numEdges number of edges (may be inaccurate if <b>forceConnected</b> is set to true
	 * @param allowSelfLoops if true, there will be a chance that self loops will be generated too
	 * @param allowMultipleEdges if true, there will be a chance that multiple edges will be generated (multiple edges between the same two vertices)
	 * @param forceConnected if true the resulting graph will be always connected, but this may alter <b>numEdges</b>
	 */
	public void getSimpleRandomGraph(mxAnalysisGraph aGraph, int numNodes, int numEdges, boolean allowSelfLoops,
			boolean allowMultipleEdges, boolean forceConnected)
	{
		mxGraph graph = aGraph.getGraph();
		Object parent = graph.getDefaultParent();
		Object[] vertices = new Object[numNodes];
		
		for (int i = 0; i < numNodes; i++)
		{
			vertices[i] = graph.insertVertex(parent, null, new Integer(i).toString(), 0, 0, 25, 25);
		}

		for (int i = 0; i < numEdges; i++)
		{
			boolean goodPair = true;
			Object startVertex;
			Object endVertex;

			do
			{
				goodPair = true;
				startVertex = vertices[(int) Math.round(Math.random() * (vertices.length - 1))];
				endVertex = vertices[(int) Math.round(Math.random() * (vertices.length - 1))];

				if (!allowSelfLoops && startVertex.equals(endVertex))
				{
					goodPair = false;
				}
				else if (!allowMultipleEdges && mxGraphStructure.areConnected(aGraph, startVertex, endVertex))
				{
					goodPair = false;
				}
			}
			while (!goodPair);

			graph.insertEdge(parent, null, getNewEdgeValue(aGraph), startVertex, endVertex);
		}

		if (forceConnected)
		{
			mxGraphStructure.makeConnected(aGraph);
		}
	};

	/**
	 * Generates a random tree graph
	 * @param aGraph
	 * @param vertexCount
	 */
	public void getSimpleRandomTree(mxAnalysisGraph aGraph, int vertexCount)
	{
		int edgeCount = (int) Math.round(vertexCount * 2);
		this.getSimpleRandomGraph(aGraph, vertexCount, edgeCount, false, false, true);

		//still need to remove surplus edges
		Object[] vertices = aGraph.getChildVertices(aGraph.getGraph().getDefaultParent());

		try
		{
			oneSpanningTree(aGraph, true, true);
		}
		catch (StructuralException e)
		{
			log.log(Level.SEVERE, "Failed to generate a random tree graph", e);
		}

		try
		{
			mxGraphStructure.makeTreeDirected(aGraph, vertices[(int) Math.round(Math.random() * (vertices.length - 1))]);
		}
		catch (StructuralException e)
		{
			log.log(Level.SEVERE, "Failed to generate a random tree graph", e);
		}
	};

	/**
	 * Creates a new edge value based on graph properties in mxAnalysisGraph. Used mostly when creating new edges during graph generation.
	 * @param aGraph
	 * @return
	 */
	public Double getNewEdgeValue(mxAnalysisGraph aGraph)
	{
		if (getGeneratorFunction() != null)
		{
			mxGraph graph = aGraph.getGraph();
			return getGeneratorFunction().getCost(graph.getView().getState(graph.getDefaultParent()));
		}
		else
		{
			return null;
		}
	};

	/**
	 * @param graph
	 * @param weighted if true, the edges will be weighted, otherwise all will have default value (1.0)
	 * @param minWeight minimum edge weight if weighted
	 * @param maxWeight maximum edge weight if weighted
	 * @return a generator function
	 */
	public static mxGeneratorFunction getGeneratorFunction(mxGraph graph, boolean weighted, double minWeight, double maxWeight)
	{
		if (weighted)
		{
			return new mxGeneratorRandomFunction(minWeight, maxWeight, 2);
		}
		else
		{
			return null;
		}
	};

	public mxGeneratorFunction getGeneratorFunction()
	{
		return this.generatorFunction;
	};

	/**
	 * @param minValue
	 * @param maxValue
	 * @return a random integer in the interval [minValue, maxValue]
	 */
	public int getRandomInt(int minValue, int maxValue)
	{
		if (minValue == maxValue)
			return minValue;
		if (minValue > maxValue)
		{
			int tmp = maxValue;
			maxValue = minValue;
			minValue = tmp;
		}

		int currValue = 0;
		currValue = minValue + (int) Math.round((Math.random() * (maxValue - minValue)));
		return currValue;
	};

	/**
	 * @param graph
	 * @param forceConnected if true, an unconnected graph is made connected
	 * @param forceSimple if true, a non-simple graph is made simple
	 * Calculates one spanning tree of graph, which doesn't have to be but can be minimal
	 * (this is faster than minimal spanning tree, so if you need any spanning tree, use this one)
	 * Self loops and multiple edges are automatically removed!
	 * Also, unconnected graphs are made connected!
	 * @throws StructuralException the graph has to be simple (no self-loops and no multiple edges) 
	 */
	public void oneSpanningTree(mxAnalysisGraph aGraph, boolean forceConnected, boolean forceSimple) throws StructuralException
	{
		mxGraph graph = aGraph.getGraph();

		boolean isSimple = mxGraphStructure.isSimple(aGraph);
		boolean isConnected = mxGraphStructure.isConnected(aGraph);

		if (!isSimple)
		{
			if (forceSimple)
			{
				mxGraphStructure.makeSimple(aGraph);
			}
			else
			{
				throw new StructuralException("Graph is not simple.");
			}
		}

		if (!isConnected)
		{
			if (forceConnected)
			{
				mxGraphStructure.makeConnected(aGraph);
			}
			else
			{
				throw new StructuralException("Graph is not connected.");
			}
		}

		Object[] edges = aGraph.getChildEdges(graph.getDefaultParent());
		int edgeCount = edges.length;

		for (int i = 0; i < edgeCount; i++)
		{
			Object currEdge = edges[i];
			graph.removeCells(new Object[] { currEdge });

			if (!mxGraphStructure.isConnected(aGraph))
			{
				graph.addCell(currEdge);
			}
		}
	};

	//TODO make a double check to avoid unnecessary cases of throwing an exception (if the algorithm can't work out a solution, try a mirrored strategy)
	/**
	 * @param aGraph
	 * @param xDim x dimension of the chessboard
	 * @param yDim y dimension of the chessboard
	 * @param startVertexValue vertex where the tour will start
	 * @throws StructuralException not all size combinations are allowed, see wikipedia for a more detailed explanation
	 * Returns a Knight's Tour graph
	 */
	public void getKnightTour(mxAnalysisGraph aGraph, int xDim, int yDim, int startVertexValue) throws StructuralException
	{
		if (xDim < 5 || yDim < 5)
		{
			throw new IllegalArgumentException();
		}

		ArrayList<Object> resultPath = new ArrayList<Object>();
		int vertexNum = xDim * yDim;

		mxGraph graph = aGraph.getGraph();
		Object parent = graph.getDefaultParent();
		int vertexCount = 0;

		for (int i = 0; i < vertexNum; i++)
		{
			graph.insertVertex(parent, null, new Integer(vertexCount).toString(), 0, 0, 25, 25);
			vertexCount++;
		}

		// we have the board set up
		Object[] vertices = aGraph.getChildVertices(parent);

		//now we set up the starting conditions
		int currValue = startVertexValue;
		int[] currCoords = new int[2];
		Object oldMove = vertices[startVertexValue];
		currCoords = getVertexGridCoords(xDim, yDim, startVertexValue);
		resultPath.add(oldMove);
		Object nextMove = getNextKnightMove(aGraph, xDim, yDim, currCoords[0], currCoords[1], resultPath);
		mxCostFunction costFunction = aGraph.getGenerator().getCostFunction();
		mxGraphView view = graph.getView();
		
		//the main loop
		while (nextMove != null)
		{
			// connect current with the possible move that has minimum number of its (possible moves)
			graph.insertEdge(parent, null, null, oldMove, nextMove);
			resultPath.add(nextMove);
			// that vertex becomes the current vertex and we repeat until no possible moves
			
			currValue = (int) costFunction.getCost(new mxCellState(view, nextMove, null));
			currCoords = getVertexGridCoords(xDim, yDim, currValue);
			oldMove = nextMove;
			nextMove = getNextKnightMove(aGraph, xDim, yDim, currCoords[0], currCoords[1], resultPath);
		}

		if (resultPath.size() < vertexNum)
		{
			//the mirrored strategy should go here, instead of the exception
			//and the exception would be thrown only if the mirrored fails too
			throw new StructuralException("Could not generate a correct Knight tour with size " + xDim + " x " + yDim + ".");
		}
	};

	/**
	 * Helper function for Knights Tour - for internal use
	 * @param aGraph
	 * @param xDim
	 * @param yDim
	 * @param xCoord
	 * @param yCoord
	 * @param resultPath
	 * @return
	 */
	private Object getNextKnightMove(mxAnalysisGraph aGraph, int xDim, int yDim, int xCoord, int yCoord, ArrayList<Object> resultPath)
	{
		Object[] possibleMoves = getKnightMoveVertexes(aGraph, xDim, yDim, xCoord, yCoord);
		//get the position with minimum possible moves
		int minMoveNum = 9;
		float biggestDistance = 0;
		Object currVertex = null;
		mxCostFunction costFunction = aGraph.getGenerator().getCostFunction();
		mxGraphView view = aGraph.getGraph().getView();
		
		for (int i = 0; i < possibleMoves.length; i++)
		{
			int currValue = (int) costFunction.getCost(new mxCellState(view, possibleMoves[i], null));
			int[] currCoords = getVertexGridCoords(xDim, yDim, currValue);
			int currMoveNum = getPossibleKnightMoveCount(aGraph, xDim, yDim, currCoords[0], currCoords[1]);
			float currDistance = getDistanceFromGridCenter(xDim, yDim, currValue);

			if ((currMoveNum < minMoveNum || (currMoveNum == minMoveNum && currDistance > biggestDistance))
					&& !resultPath.contains(possibleMoves[i]))
			{
				biggestDistance = currDistance;
				minMoveNum = currMoveNum;
				currVertex = possibleMoves[i];
			}
		}
		return currVertex;
	};

	/**
	 * Helper function for Knights Tour - for internal use
	 * @param aGraph
	 * @param xDim
	 * @param yDim
	 * @param xCoord
	 * @param yCoord
	 * @return
	 */
	private int getPossibleKnightMoveCount(mxAnalysisGraph aGraph, int xDim, int yDim, int xCoord, int yCoord)
	{
		//check all possible 8 locations

		//location 1
		int currX = xCoord + 1;
		int currY = yCoord - 2;
		int possibleMoveCount = 0;
		Object parent = aGraph.getGraph().getDefaultParent();
		Object[] vertices = aGraph.getChildVertices(parent);

		if (currX > 0 && currX <= xDim && currY > 0 && currY <= yDim)
		{
			if (aGraph.getEdges(getVertexFromGrid(vertices, xDim, yDim, currX, currY), parent, false, true).length == 0)
			{
				possibleMoveCount++;
			}
		}

		//location 2
		currX = xCoord + 2;
		currY = yCoord - 1;

		if (currX > 0 && currX <= xDim && currY > 0 && currY <= yDim)
		{
			if (aGraph.getEdges(getVertexFromGrid(vertices, xDim, yDim, currX, currY), parent, false, true).length == 0)
			{
				possibleMoveCount++;
			}
		}

		//location 3
		currX = xCoord + 2;
		currY = yCoord + 1;

		if (currX > 0 && currX <= xDim && currY > 0 && currY <= yDim)
		{
			if (aGraph.getEdges(getVertexFromGrid(vertices, xDim, yDim, currX, currY), parent, false, true).length == 0)
			{
				possibleMoveCount++;
			}
		}

		//location 4
		currX = xCoord + 1;
		currY = yCoord + 2;

		if (currX > 0 && currX <= xDim && currY > 0 && currY <= yDim)
		{
			if (aGraph.getEdges(getVertexFromGrid(vertices, xDim, yDim, currX, currY), parent, false, true).length == 0)
			{
				possibleMoveCount++;
			}
		}

		//location 5
		currX = xCoord - 1;
		currY = yCoord + 2;

		if (currX > 0 && currX <= xDim && currY > 0 && currY <= yDim)
		{
			if (aGraph.getEdges(getVertexFromGrid(vertices, xDim, yDim, currX, currY), parent, false, true).length == 0)
			{
				possibleMoveCount++;
			}
		}

		//location 6
		currX = xCoord - 2;
		currY = yCoord + 1;

		if (currX > 0 && currX <= xDim && currY > 0 && currY <= yDim)
		{
			if (aGraph.getEdges(getVertexFromGrid(vertices, xDim, yDim, currX, currY), parent, false, true).length == 0)
			{
				possibleMoveCount++;
			}
		}

		//location 7
		currX = xCoord - 2;
		currY = yCoord - 1;

		if (currX > 0 && currX <= xDim && currY > 0 && currY <= yDim)
		{
			if (aGraph.getEdges(getVertexFromGrid(vertices, xDim, yDim, currX, currY), parent, false, true).length == 0)
			{
				possibleMoveCount++;
			}
		}

		//location 8
		currX = xCoord - 1;
		currY = yCoord - 2;

		if (currX > 0 && currX <= xDim && currY > 0 && currY <= yDim)
		{
			if (aGraph.getEdges(getVertexFromGrid(vertices, xDim, yDim, currX, currY), parent, false, true).length == 0)
			{
				possibleMoveCount++;
			}
		}

		return possibleMoveCount;
	};

	/**
	 * Helper function for Knights Tour - for internal use
	 * @param xDim
	 * @param yDim
	 * @param currValue
	 * @return
	 */
	private float getDistanceFromGridCenter(int xDim, int yDim, int currValue)
	{
		float centerX = (xDim + 1) / 2f;
		float centerY = (yDim + 1) / 2f;
		int[] currCoords = getVertexGridCoords(xDim, yDim, currValue);
		float x = Math.abs(centerX - currCoords[0]);
		float y = Math.abs(centerY - currCoords[1]);

		return (float) Math.sqrt(x * x + y * y);
	}

	public mxCostFunction getCostFunction()
	{
		return costFunction;
	}

	public void setCostFunction(mxCostFunction costFunction)
	{
		this.costFunction = costFunction;
	};
};
