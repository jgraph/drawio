/**
 * Copyright (c) 2010 David Benson, Gaudenz Alder
 */
package com.mxgraph.io.graphml;

import java.util.List;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;

/**
 * Represents a Data element in the GML Structure.
 */
public class mxGraphMlData
{
	private String dataId = "";

	private String dataKey = "";

	private String dataValue = "";//not using

	private mxGraphMlShapeNode dataShapeNode;

	private mxGraphMlShapeEdge dataShapeEdge;

	/**
	 * Construct a data with the params values.
	 * @param dataId Data's ID
	 * @param dataKey Reference to a Key Element ID
	 * @param dataValue Value of the data Element
	 * @param dataShapeEdge JGraph specific edge properties.
	 * @param dataShapeNode JGraph specific node properties.
	 */
	public mxGraphMlData(String dataId, String dataKey, String dataValue,
			mxGraphMlShapeEdge dataShapeEdge, mxGraphMlShapeNode dataShapeNode)
	{
		this.dataId = dataId;
		this.dataKey = dataKey;
		this.dataValue = dataValue;
		this.dataShapeNode = dataShapeNode;
		this.dataShapeEdge = dataShapeEdge;
	}

	/**
	 * Construct a data from one xml data element.
	 * @param dataElement Xml Data Element.
	 */
	public mxGraphMlData(Element dataElement)
	{
		this.dataId = dataElement.getAttribute(mxGraphMlConstants.ID);
		this.dataKey = dataElement.getAttribute(mxGraphMlConstants.KEY);

		this.dataValue = "";

		Element shapeNodeElement = mxGraphMlUtils.childsTag(dataElement,
				mxGraphMlConstants.JGRAPH + mxGraphMlConstants.SHAPENODE);
		Element shapeEdgeElement = mxGraphMlUtils.childsTag(dataElement,
				mxGraphMlConstants.JGRAPH + mxGraphMlConstants.SHAPEEDGE);
		
		if (shapeNodeElement != null)
		{
			this.dataShapeNode = new mxGraphMlShapeNode(shapeNodeElement);
		}
		else if (shapeEdgeElement != null)
		{
			this.dataShapeEdge = new mxGraphMlShapeEdge(shapeEdgeElement);
		}
		else
		{
			NodeList childs = dataElement.getChildNodes();
			List<Node> childrens = mxGraphMlUtils.copyNodeList(childs);
			
			for (Node n : childrens)
			{
				if (n.getNodeName().equals("#text"))
				{

					this.dataValue += n.getNodeValue();
				}
			}
			this.dataValue = this.dataValue.trim();
		}
	}

	/**
	 * Construct an empty data.
	 */
	public mxGraphMlData()
	{
	}

	public String getDataId()
	{
		return dataId;
	}

	public void setDataId(String dataId)
	{
		this.dataId = dataId;
	}

	public String getDataKey()
	{
		return dataKey;
	}

	public void setDataKey(String dataKey)
	{
		this.dataKey = dataKey;
	}

	public String getDataValue()
	{
		return dataValue;
	}

	public void setDataValue(String dataValue)
	{
		this.dataValue = dataValue;
	}

	public mxGraphMlShapeNode getDataShapeNode()
	{
		return dataShapeNode;
	}

	public void setDataShapeNode(mxGraphMlShapeNode dataShapeNode)
	{
		this.dataShapeNode = dataShapeNode;
	}

	public mxGraphMlShapeEdge getDataShapeEdge()
	{
		return dataShapeEdge;
	}

	public void setDataShapeEdge(mxGraphMlShapeEdge dataShapeEdge)
	{
		this.dataShapeEdge = dataShapeEdge;
	}

	/**
	 * Generates an Node Data Element from this class.
	 * @param document Document where the key Element will be inserted.
	 * @return Returns the generated Elements.
	 */
	public Element generateNodeElement(Document document)
	{
		Element data = document.createElement(mxGraphMlConstants.DATA);
		data.setAttribute(mxGraphMlConstants.KEY, dataKey);

		Element shapeNodeElement = dataShapeNode.generateElement(document);
		data.appendChild(shapeNodeElement);

		return data;
	}

	/**
	 * Generates an Edge Data Element from this class.
	 * @param document Document where the key Element will be inserted.
	 * @return Returns the generated Elements.
	 */
	public Element generateEdgeElement(Document document)
	{
		Element data = document.createElement(mxGraphMlConstants.DATA);
		data.setAttribute(mxGraphMlConstants.KEY, dataKey);

		Element shapeEdgeElement = dataShapeEdge.generateElement(document);
		data.appendChild(shapeEdgeElement);

		return data;
	}
}
