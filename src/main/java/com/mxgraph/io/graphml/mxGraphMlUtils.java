/**
 * Copyright (c) 2010 David Benson, Gaudenz Alder
 */
package com.mxgraph.io.graphml;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import org.w3c.dom.Element;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;

/**
 * This class implements several GML utility methods.
 */
public class mxGraphMlUtils
{
	/**
	 * Checks if the NodeList has a Node with name = tag.
	 * @param nl NodeList
	 * @param tag Name of the node.
	 * @return Returns <code>true</code> if the Node List has a Node with name = tag.
	 */
	public static boolean nodeListHasTag(NodeList nl, String tag)
	{
		boolean has = false;

		if (nl != null)
		{
			int length = nl.getLength();

			for (int i = 0; (i < length) && !has; i++)
			{
				has = (nl.item(i)).getNodeName().equals(tag);
			}
		}
		
		return has;
	}

	/**
	 * Returns the first Element that has name = tag in Node List.
	 * @param nl NodeList
	 * @param tag Name of the Element
	 * @return Element with name = 'tag'.
	 */
	public static Element nodeListTag(NodeList nl, String tag)
	{
		if (nl != null)
		{
			int length = nl.getLength();
			boolean has = false;

			for (int i = 0; (i < length) && !has; i++)
			{
				has = (nl.item(i)).getNodeName().equals(tag);

				if (has)
				{
					return (Element) nl.item(i);
				}
			}
		}
		
		return null;
	}

	/**
	 * Returns a list with the elements included in the Node List that have name = tag.
	 * @param nl NodeList
	 * @param tag name of the Element.
	 * @return List with the indicated elements.
	 */
	public static List<Element> nodeListTags(NodeList nl, String tag)
	{
		ArrayList<Element> ret = new ArrayList<Element>();

		if (nl != null)
		{
			int length = nl.getLength();

			for (int i = 0; i < length; i++)
			{
				if (tag.equals((nl.item(i)).getNodeName()))
				{
					ret.add((Element) nl.item(i));
				}
			}
		}
		return ret;
	}

	/**
	 * Checks if the childrens of element has a Node with name = tag.
	 * @param element Element
	 * @param tag Name of the node.
	 * @return Returns <code>true</code> if the childrens of element has a Node with name = tag.
	 */
	public static boolean childsHasTag(Element element, String tag)
	{
		NodeList nl = element.getChildNodes();

		boolean has = false;

		if (nl != null)
		{
			int length = nl.getLength();

			for (int i = 0; (i < length) && !has; i++)
			{
				has = (nl.item(i)).getNodeName().equals(tag);
			}
		}
		return has;
	}

	/**
	 * Returns the first Element that has name = tag in the childrens of element.
	 * @param element Element
	 * @param tag Name of the Element
	 * @return Element with name = 'tag'.
	 */
	public static Element childsTag(Element element, String tag)
	{
		NodeList nl = element.getChildNodes();

		if (nl != null)
		{
			int length = nl.getLength();
			boolean has = false;

			for (int i = 0; (i < length) && !has; i++)
			{
				has = (nl.item(i)).getNodeName().equals(tag);

				if (has)
				{
					return (Element) nl.item(i);
				}
			}
		}
		
		return null;
	}

	/**
	 * Returns a list with the elements included in the childrens of element
	 * that have name = tag.
	 * @param element Element
	 * @param tag name of the Element.
	 * @return List with the indicated elements.
	 */
	public static List<Element> childsTags(Element element, String tag)
	{
		NodeList nl = element.getChildNodes();

		ArrayList<Element> ret = new ArrayList<Element>();
		
		if (nl != null)
		{
			int length = nl.getLength();

			for (int i = 0; i < length; i++)
			{
				if (tag.equals((nl.item(i)).getNodeName()))
				{
					ret.add((Element) nl.item(i));
				}
			}
		}
		return ret;
	}

	/**
	 * Copy a given NodeList into a List<Element>
	 * @param nodeList Node List.
	 * @return List with the elements of nodeList.
	 */
	public static List<Node> copyNodeList(NodeList nodeList)
	{
		ArrayList<Node> copy = new ArrayList<Node>();
		int length = nodeList.getLength();

		for (int i = 0; i < length; i++)
		{
			copy.add((Node) nodeList.item(i));
		}
		
		return copy;
	}

	/**
	 * Create a style map from a String with style definitions.
	 * @param style Definition of the style.
	 * @param asig Asignation simbol used in 'style'.
	 * @return Map with the style properties.
	 */
	public static HashMap<String, Object> getStyleMap(String style, String asig)
	{
		HashMap<String, Object> styleMap = new HashMap<String, Object>();
		String key = "";
		String value = "";
		int index = 0;
		
		if (!style.equals(""))
		{
			String[] entries = style.split(";");

			for (String entry : entries)
			{
				index = entry.indexOf(asig);
				
				if (index == -1)
				{
					key = "";
					value = entry;
					styleMap.put(key, value);
				}
				else
				{
					key = entry.substring(0, index);
					value = entry.substring(index + 1);
					styleMap.put(key, value);
				}
			}
		}
		return styleMap;
	}

	/**
	 * Returns the string that represents the content of a given style map.
	 * @param styleMap Map with the styles values
	 * @return string that represents the style.
	 */
	public static String getStyleString(Map<String, Object> styleMap,
			String asig)
	{
		String style = "";
		Iterator<Object> it = styleMap.values().iterator();
		Iterator<String> kit = styleMap.keySet().iterator();

		while (kit.hasNext())
		{
			String key = kit.next();
			Object value = it.next();
			style = style + key + asig + value + ";";
		}
		return style;
	}
}
