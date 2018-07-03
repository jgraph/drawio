/**
 * Copyright (c) 2010 David Benson, Gaudenz Alder
 */
package com.mxgraph.io.graphml;

import java.util.HashMap;
import java.util.List;
import org.w3c.dom.Document;
import org.w3c.dom.Element;

/**
 * Represents a Port element in the GML Structure.
 */
public class mxGraphMlPort
{
	private String name;

	private HashMap<String, mxGraphMlData> portDataMap = new HashMap<String, mxGraphMlData>();

	/**
	 * Construct a Port with name.
	 * @param name Port Name
	 */
	public mxGraphMlPort(String name)
	{
		this.name = name;
	}

	/**
	 * Construct a Port from a xml port Element.
	 * @param portElement Xml port Element.
	 */
	public mxGraphMlPort(Element portElement)
	{
		this.name = portElement.getAttribute(mxGraphMlConstants.PORT_NAME);

		//Add data elements
		List<Element> dataList = mxGraphMlUtils.childsTags(portElement,
				mxGraphMlConstants.DATA);

		for (Element dataElem : dataList)
		{
			mxGraphMlData data = new mxGraphMlData(dataElem);
			String key = data.getDataKey();
			portDataMap.put(key, data);
		}
	}

	public String getName()
	{
		return name;
	}

	public void setName(String name)
	{
		this.name = name;
	}

	public HashMap<String, mxGraphMlData> getPortDataMap()
	{
		return portDataMap;
	}

	public void setPortDataMap(HashMap<String, mxGraphMlData> nodeDataMap)
	{
		this.portDataMap = nodeDataMap;
	}

	/**
	 * Generates a Key Element from this class.
	 * @param document Document where the key Element will be inserted.
	 * @return Returns the generated Elements.
	 */
	public Element generateElement(Document document)
	{
		Element node = document.createElement(mxGraphMlConstants.PORT);

		node.setAttribute(mxGraphMlConstants.PORT_NAME, name);

		for (mxGraphMlData data : portDataMap.values())
		{
			Element dataElement = data.generateNodeElement(document);
			node.appendChild(dataElement);
		}

		return node;
	}
}
