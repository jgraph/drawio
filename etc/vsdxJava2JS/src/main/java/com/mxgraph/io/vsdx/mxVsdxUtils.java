/**
 * Copyright (c) 2006-2016, JGraph Ltd
 * Copyright (c) 2006-2016, Gaudenz Alder
 */
package com.mxgraph.io.vsdx;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;
import java.util.logging.Level;
import java.util.logging.Logger;

import org.w3c.dom.Element;
import org.w3c.dom.Node;

import com.mxgraph.util.mxConstants;

/**
 * General utilities for .vdx format support
 */
public class mxVsdxUtils
{
	private static double screenCoordinatesPerCm = 40;

	private static final double CENTIMETERS_PER_INCHES = 2.54;
	
	public static final double conversionFactor = screenCoordinatesPerCm * CENTIMETERS_PER_INCHES;
	
	private static final Logger log = Logger.getLogger(mxVsdxUtils.class.getName());

	/**
	 * Returns a collection of direct child Elements that match the specified tag name
	 * @param parent the parent whose direct children will be processed
	 * @param name the child tag name to match
	 * @return a collection of matching Elements
	 */
	public static ArrayList<Element> getDirectChildNamedElements(Element parent, String name)
	{
		ArrayList<Element> result = new ArrayList<Element>();

		for (Node child = parent.getFirstChild(); child != null; child = child.getNextSibling())
		{
			if (child instanceof Element && name.equals(child.getNodeName())) 
			{
				result.add((Element)child);
			}
	    }

	    return result;
	}

	/**
	 * Returns a collection of direct child Elements
	 * @param parent the parent whose direct children will be processed
	 * @return a collection of all child Elements
	 */
	public static ArrayList<Element> getDirectChildElements(Element parent)
	{
		ArrayList<Element> result = new ArrayList<Element>();

		for (Node child = parent.getFirstChild(); child != null; child = child.getNextSibling())
		{
			if (child instanceof Element) 
			{
				result.add((Element)child);
			}
	    }

	    return result;
	}

	/**
	 * Returns the first direct child Element
	 * @param parent the parent whose direct first child will be processed
	 * @return the first child Element
	 */
	public static Element getDirectFirstChildElement(Element parent)
	{
		for (Node child = parent.getFirstChild(); child != null; child = child.getNextSibling())
		{
			if (child instanceof Element) 
			{
				return (Element)child;
			}
	    }

	    return null;
	}

	/**
	 * Return the value of an integer attribute or the default value
	 * @param elem Element
	 * @param attName Attribute name
	 * @param defVal default value
	 * @return the parsed attribute value or the default value
	 */
	public static int getIntAttr(Element elem, String attName, int defVal)
	{
		try 
		{
			String val = elem.getAttribute(attName);
			if (val != null)
			{
				return Integer.parseInt(val);
			}
		}
		catch (NumberFormatException e) 
		{
			//nothing, just return the default value
		}
		return defVal;
	}
	
	/**
	 * Return the value of an integer attribute or zero
	 * @param elem Element
	 * @param attName Attribute name
	 * @return the parsed attribute value or zero
	 */
	public static int getIntAttr(Element elem, String attName)
	{
		return getIntAttr(elem, attName, 0);
	}
	
	/**
	 * Returns the string that represents the content of a given style map.
	 * @param styleMap Map with the styles values
	 * @return string that represents the style.
	 */
	public static String getStyleString(Map<String, String> styleMap, String asig)
	{
		String style = "";
		Iterator<String> it = styleMap.values().iterator();
		Iterator<String> kit = styleMap.keySet().iterator();

		while (kit.hasNext())
		{
			String key = kit.next();
			Object value = it.next();

			if(!key.equals(mxConstants.STYLE_SHAPE) || (!styleMap.get(key).startsWith("image") && !styleMap.get(key).startsWith("rounded=")))
			{
				try
				{
					style = style + key + asig;
				}
				catch (Exception e)
				{
					log.log(Level.SEVERE, "mxVsdxUtils.getStyleString," + e.toString() + ",style.length=" + style.length() +
							",key.length=" + key.length() + ",asig.length=" + asig.length());
				}
			}

			style = style + value + ";";
		}

		return style;
	}

	/**
	 * Returns a text surrounded by tags html.
	 * @param text Text to be surrounded.
	 * @param tag Name of the tag.
	 * @return &lt tag &gt text &lt /tag &gt
	 */
	public static String surroundByTags(String text, String tag)
	{
		return "<" + tag + ">" + text + "</" + tag + ">";
	}

	
	/**
	 * Converts the ampersand, quote, prime, less-than and greater-than
	 * characters to their corresponding HTML entities in the given string.
	 * 
	 * Note: this is the same method of mxUtils but we cannot use it as it is not compatible with google app engine
	 */
	public static String htmlEntities(String text)
	{
		return text.replaceAll("&", "&amp;").replaceAll("\"", "&quot;")
				.replaceAll("'", "&prime;").replaceAll("<", "&lt;")
				.replaceAll(">", "&gt;");
	}
	
	/**
	 * Converts the initial letter  of each word in text to uppercase
	 * @param text Text to be transformed.
	 * @return Text with initial capitals.
	 */
	public static String toInitialCapital(String text)
	{
		String[] words = text.split(" ");
		String ret = "";

		for (String word : words)
		{
			String begin = word.substring(0, 1);
			word = word.substring(1);
			begin = begin.toUpperCase();
			ret += begin + word;
		}

		return ret.substring(0, ret.length());
	}

	/**
	 * Trnsforms each lower case letter in text to small capital.
	 * @param text Text to be transformed.
	 * @param size Size of the original text.
	 * @return Text in small capitals.
	 */
	public static String toSmallCaps(String text, String size)
	{
		String ret = "";

		if (!size.equals(ret))
		{
			char a = 'a';
			char z = 'z';
			char[] letters = text.toCharArray();

			for (char c : letters)
			{
				if (c >= a && c <= z)
				{
					String s = String.valueOf(c);
					s = s.toUpperCase();
					ret += "<font style=\"font-size:" + Double.valueOf(size) / 1.28 + "px\">" + s + "</font>";
				}
				else
				{
					ret += c;
				}
			}
		}
		else
		{
			ret = text;
		}

		return ret;
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

		String[] entries = style.split(";");

		for (String entry : entries)
		{
			int index = entry.indexOf(asig);
			String key = entry.substring(0, index);
			String value = entry.substring(index + 1);
			styleMap.put(key, value);
		}

		return styleMap;
	}

	public static boolean isInsideTriangle(double x, double y, double ax, double ay, double bx, double by, double cx,  double cy)
	{
		bx = bx - ax;
		by = by - ay;
		cx = cx - ax;
		cy = cy - ay;
		ax = 0;
		ay = 0;
		
		double d = bx * cy - cx * by;
		double wa = (x * (by - cy) + y * (cx - bx) + bx * cy - cx * by) / d;
		double wb = (x * cy - y * cx) / d;
		double wc = (y * bx - x * by) / d;
		
		if(wa > 0 && wa < 1 && wb > 0 && wb < 1 && wc > 0 && wc < 1)
		{
			return true;
		}
		
		return false;
	}
}
