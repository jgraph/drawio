/**
 * Copyright (c) 2007, Gaudenz Alder
 */
package com.mxgraph.view;

import java.util.Hashtable;
import java.util.Iterator;
import java.util.Map;

import com.mxgraph.util.mxConstants;

/**
 * Singleton class that acts as a global converter from string to object values
 * in a style. This is currently only used to perimeters and edge styles.
 */
public class mxStyleRegistry
{

	/**
	 * Maps from strings to objects.
	 */
	protected static Map<String, Object> values = new Hashtable<String, Object>();

	// Registers the known object styles
	static
	{
		putValue(mxConstants.EDGESTYLE_ELBOW, mxEdgeStyle.ElbowConnector);
		putValue(mxConstants.EDGESTYLE_ENTITY_RELATION,
				mxEdgeStyle.EntityRelation);
		putValue(mxConstants.EDGESTYLE_LOOP, mxEdgeStyle.Loop);
		putValue(mxConstants.EDGESTYLE_SIDETOSIDE, mxEdgeStyle.SideToSide);
		putValue(mxConstants.EDGESTYLE_TOPTOBOTTOM, mxEdgeStyle.TopToBottom);
		putValue(mxConstants.EDGESTYLE_ORTHOGONAL, mxEdgeStyle.OrthConnector);
		putValue(mxConstants.EDGESTYLE_SEGMENT, mxEdgeStyle.SegmentConnector);

		putValue(mxConstants.PERIMETER_ELLIPSE, mxPerimeter.EllipsePerimeter);
		putValue(mxConstants.PERIMETER_RECTANGLE,
				mxPerimeter.RectanglePerimeter);
		putValue(mxConstants.PERIMETER_RHOMBUS, mxPerimeter.RhombusPerimeter);
		putValue(mxConstants.PERIMETER_TRIANGLE, mxPerimeter.TrianglePerimeter);
		putValue(mxConstants.PERIMETER_HEXAGON, mxPerimeter.HexagonPerimeter);
	}

	/**
	 * Puts the given object into the registry under the given name.
	 */
	public static void putValue(String name, Object value)
	{
		values.put(name, value);
	}

	/**
	 * Returns the value associated with the given name.
	 */
	public static Object getValue(String name)
	{
		return values.get(name);
	}

	/**
	 * Returns the name for the given value.
	 */
	public static String getName(Object value)
	{
		Iterator<Map.Entry<String, Object>> it = values.entrySet().iterator();

		while (it.hasNext())
		{
			Map.Entry<String, Object> entry = it.next();

			if (entry.getValue() == value)
			{
				return entry.getKey();
			}
		}

		return null;
	}

}
