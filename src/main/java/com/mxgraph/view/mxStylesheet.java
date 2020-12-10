/**
 * Copyright (c) 2007, Gaudenz Alder
 */
package com.mxgraph.view;

import java.util.Hashtable;
import java.util.Map;

import com.mxgraph.util.mxConstants;

/**
 * Defines the appearance of the cells in a graph. The following example
 * changes the font size for all vertices by changing the default vertex
 * style in-place:
 * <code>
 * getDefaultVertexStyle().put(mxConstants.STYLE_FONTSIZE, 16);
 * </code>
 * 
 * To change the default font size for all cells, set
 * mxConstants.DEFAULT_FONTSIZE.
 */
public class mxStylesheet
{

	/**
	 * Shared immutable empty hashtable (for undefined cell styles).
	 */
	public static final Map<String, Object> EMPTY_STYLE = new Hashtable<String, Object>();

	/**
	 * Maps from names to styles.
	 */
	protected Map<String, Map<String, Object>> styles = new Hashtable<String, Map<String, Object>>();

	/**
	 * Constructs a new stylesheet and assigns default styles.
	 */
	public mxStylesheet()
	{
		setDefaultVertexStyle(createDefaultVertexStyle());
		setDefaultEdgeStyle(createDefaultEdgeStyle());
	}

	/**
	 * Returns all styles as map of name, hashtable pairs.
	 * 
	 * @return All styles in this stylesheet.
	 */
	public Map<String, Map<String, Object>> getStyles()
	{
		return styles;
	}

	/**
	 * Sets all styles in the stylesheet.
	 */
	public void setStyles(Map<String, Map<String, Object>> styles)
	{
		this.styles = styles;
	}

	/**
	 * Creates and returns the default vertex style.
	 * 
	 * @return Returns the default vertex style.
	 */
	protected Map<String, Object> createDefaultVertexStyle()
	{
		Map<String, Object> style = new Hashtable<String, Object>();

		style.put(mxConstants.STYLE_SHAPE, mxConstants.SHAPE_RECTANGLE);
		style.put(mxConstants.STYLE_PERIMETER, mxPerimeter.RectanglePerimeter);
		style.put(mxConstants.STYLE_VERTICAL_ALIGN, mxConstants.ALIGN_MIDDLE);
		style.put(mxConstants.STYLE_ALIGN, mxConstants.ALIGN_CENTER);
		style.put(mxConstants.STYLE_FILLCOLOR, "#C3D9FF");
		style.put(mxConstants.STYLE_STROKECOLOR, "#6482B9");
		style.put(mxConstants.STYLE_FONTCOLOR, "#774400");

		return style;
	}

	/**
	 * Creates and returns the default edge style.
	 * 
	 * @return Returns the default edge style.
	 */
	protected Map<String, Object> createDefaultEdgeStyle()
	{
		Map<String, Object> style = new Hashtable<String, Object>();

		style.put(mxConstants.STYLE_SHAPE, mxConstants.SHAPE_CONNECTOR);
		style.put(mxConstants.STYLE_ENDARROW, mxConstants.ARROW_CLASSIC);
		style.put(mxConstants.STYLE_VERTICAL_ALIGN, mxConstants.ALIGN_MIDDLE);
		style.put(mxConstants.STYLE_ALIGN, mxConstants.ALIGN_CENTER);
		style.put(mxConstants.STYLE_STROKECOLOR, "#6482B9");
		style.put(mxConstants.STYLE_FONTCOLOR, "#446299");

		return style;
	}

	/**
	 * Returns the default style for vertices.
	 * 
	 * @return Returns the default vertex style.
	 */
	public Map<String, Object> getDefaultVertexStyle()
	{
		return styles.get("defaultVertex");
	}

	/**
	 * Sets the default style for vertices.
	 * 
	 * @param value Style to be used for vertices.
	 */
	public void setDefaultVertexStyle(Map<String, Object> value)
	{
		putCellStyle("defaultVertex", value);
	}

	/**
	 * Returns the default style for edges.
	 * 
	 * @return Returns the default edge style.
	 */
	public Map<String, Object> getDefaultEdgeStyle()
	{
		return styles.get("defaultEdge");
	}

	/**
	 * Sets the default style for edges.
	 * 
	 * @param value Style to be used for edges.
	 */
	public void setDefaultEdgeStyle(Map<String, Object> value)
	{
		putCellStyle("defaultEdge", value);
	}

	/**
	 * Stores the specified style under the given name.
	 * 
	 * @param name Name for the style to be stored.
	 * @param style Key, value pairs that define the style.
	 */
	public void putCellStyle(String name, Map<String, Object> style)
	{
		styles.put(name, style);
	}

	/**
	 * Returns the cell style for the specified cell or the given defaultStyle
	 * if no style can be found for the given stylename.
	 * 
	 * @param name String of the form [(stylename|key=value);] that represents the
	 * style.
	 * @param defaultStyle Default style to be returned if no style can be found.
	 * @return Returns the style for the given formatted cell style.
	 */
	public Map<String, Object> getCellStyle(String name,
			Map<String, Object> defaultStyle)
	{
		Map<String, Object> style = defaultStyle;

		if (name != null && name.length() > 0)
		{
			String[] pairs = name.split(";");

			if (style != null && !name.startsWith(";"))
			{
				style = new Hashtable<String, Object>(style);
			}
			else
			{
				style = new Hashtable<String, Object>();
			}

			for (int i = 0; i < pairs.length; i++)
			{
				String tmp = pairs[i];
				int c = tmp.indexOf('=');

				if (c >= 0)
				{
					String key = tmp.substring(0, c);
					String value = tmp.substring(c + 1);

					if (value.equals(mxConstants.NONE))
					{
						style.remove(key);
					}
					else
					{
						style.put(key, value);
					}
				}
				else
				{
					Map<String, Object> tmpStyle = styles.get(tmp);

					if (tmpStyle != null)
					{
						style.putAll(tmpStyle);
					}
				}
			}
		}

		return style;
	}

}
