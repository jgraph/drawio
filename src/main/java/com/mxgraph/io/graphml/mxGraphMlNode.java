/**
 * Copyright (c) 2010 David Benson, Gaudenz Alder
 */
package com.mxgraph.io.graphml;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import org.w3c.dom.Document;
import org.w3c.dom.Element;

/**
 * Represents a Data element in the GML Structure.
 */
public class mxGraphMlNode
{
	private String nodeId;

	private mxGraphMlData nodeData;

	private List<mxGraphMlGraph> nodeGraphList = new ArrayList<mxGraphMlGraph>();

	private HashMap<String, mxGraphMlData> nodeDataMap = new HashMap<String, mxGraphMlData>();

	private HashMap<String, mxGraphMlPort> nodePortMap = new HashMap<String, mxGraphMlPort>();

	/**
	 * Construct a node with Id and one data element
	 * @param nodeId Node`s ID
	 * @param nodeData Gml Data.
	 */
	public mxGraphMlNode(String nodeId, mxGraphMlData nodeData)
	{
		this.nodeId = nodeId;
		this.nodeData = nodeData;
	}

	/**
	 * Construct a Node from a xml Node Element.
	 * @param nodeElement Xml Node Element.
	 */
	public mxGraphMlNode(Element nodeElement)
	{
		this.nodeId = nodeElement.getAttribute(mxGraphMlConstants.ID);

		//Add data elements
		List<Element> dataList = mxGraphMlUtils.childsTags(nodeElement,
				mxGraphMlConstants.DATA);

		for (Element dataElem : dataList)
		{
			mxGraphMlData data = new mxGraphMlData(dataElem);
			String key = data.getDataKey();
			nodeDataMap.put(key, data);
		}

		//Add graph elements
		List<Element> graphList = mxGraphMlUtils.childsTags(nodeElement,
				mxGraphMlConstants.GRAPH);

		for (Element graphElem : graphList)
		{
			mxGraphMlGraph graph = new mxGraphMlGraph(graphElem);
			nodeGraphList.add(graph);
		}

		//Add port elements
		List<Element> portList = mxGraphMlUtils.childsTags(nodeElement,
				mxGraphMlConstants.PORT);

		for (Element portElem : portList)
		{
			mxGraphMlPort port = new mxGraphMlPort(portElem);
			String name = port.getName();
			nodePortMap.put(name, port);
		}
	}

	public String getNodeId()
	{
		return nodeId;
	}

	public void setNodeId(String nodeId)
	{
		this.nodeId = nodeId;
	}

	public HashMap<String, mxGraphMlData> getNodeDataMap()
	{
		return nodeDataMap;
	}

	public void setNodeDataMap(HashMap<String, mxGraphMlData> nodeDataMap)
	{
		this.nodeDataMap = nodeDataMap;
	}

	public List<mxGraphMlGraph> getNodeGraph()
	{
		return nodeGraphList;
	}

	public void setNodeGraph(List<mxGraphMlGraph> nodeGraph)
	{
		this.nodeGraphList = nodeGraph;
	}

	public HashMap<String, mxGraphMlPort> getNodePort()
	{
		return nodePortMap;
	}

	public void setNodePort(HashMap<String, mxGraphMlPort> nodePort)
	{
		this.nodePortMap = nodePort;
	}

	/**
	 * Generates a Key Element from this class.
	 * @param document Document where the key Element will be inserted.
	 * @return Returns the generated Elements.
	 */
	public Element generateElement(Document document)
	{
		Element node = document.createElement(mxGraphMlConstants.NODE);

		node.setAttribute(mxGraphMlConstants.ID, nodeId);

		Element dataElement = nodeData.generateNodeElement(document);
		node.appendChild(dataElement);

		for (mxGraphMlPort port : nodePortMap.values())
		{
			Element portElement = port.generateElement(document);
			node.appendChild(portElement);
		}

		for (mxGraphMlGraph graph : nodeGraphList)
		{
			Element graphElement = graph.generateElement(document);
			node.appendChild(graphElement);
		}

		return node;
	}

	public mxGraphMlData getNodeData()
	{
		return nodeData;
	}

	public void setNodeData(mxGraphMlData nodeData)
	{
		this.nodeData = nodeData;
	}

}
