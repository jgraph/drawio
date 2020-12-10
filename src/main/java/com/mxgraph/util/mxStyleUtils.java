/**
 * Copyright (c) 2007-2012, JGraph Ltd
 */
package com.mxgraph.util;

import java.util.ArrayList;
import java.util.List;

import com.mxgraph.model.mxIGraphModel;

/**
 * Contains various style helper methods for use with mxGraph.
 */
public class mxStyleUtils
{
	/**
	 * Returns the stylename in a style of the form stylename[;key=value] or an
	 * empty string if the given style does not contain a stylename.
	 * 
	 * @param style
	 *            String of the form stylename[;key=value].
	 * @return Returns the stylename from the given formatted string.
	 */
	public static String getStylename(String style)
	{
		if (style != null)
		{
			String[] pairs = style.split(";");
			String stylename = pairs[0];

			if (stylename.indexOf("=") < 0)
			{
				return stylename;
			}
		}

		return "";
	}

	/**
	 * Returns the stylenames in a style of the form stylename[;key=value] or an
	 * empty array if the given style does not contain any stylenames.
	 * 
	 * @param style
	 *            String of the form stylename[;stylename][;key=value].
	 * @return Returns the stylename from the given formatted string.
	 */
	public static String[] getStylenames(String style)
	{
		List<String> result = new ArrayList<String>();

		if (style != null)
		{
			String[] pairs = style.split(";");

			for (int i = 0; i < pairs.length; i++)
			{
				if (pairs[i].indexOf("=") < 0)
				{
					result.add(pairs[i]);
				}
			}
		}

		return result.toArray(new String[result.size()]);
	}

	/**
	 * Returns the index of the given stylename in the given style. This returns
	 * -1 if the given stylename does not occur (as a stylename) in the given
	 * style, otherwise it returns the index of the first character.
	 */
	public static int indexOfStylename(String style, String stylename)
	{
		if (style != null && stylename != null)
		{
			String[] tokens = style.split(";");
			int pos = 0;

			for (int i = 0; i < tokens.length; i++)
			{
				if (tokens[i].equals(stylename))
				{
					return pos;
				}

				pos += tokens[i].length() + 1;
			}
		}

		return -1;
	}

	/**
	 * Adds the specified stylename to the given style if it does not already
	 * contain the stylename.
	 */
	public static String addStylename(String style, String stylename)
	{
		if (indexOfStylename(style, stylename) < 0)
		{
			if (style == null)
			{
				style = "";
			}
			else if (style.length() > 0
					&& style.charAt(style.length() - 1) != ';')
			{
				style += ';';
			}

			style += stylename;
		}

		return style;
	}

	/**
	 * Removes all occurrences of the specified stylename in the given style and
	 * returns the updated style. Trailing semicolons are preserved.
	 */
	public static String removeStylename(String style, String stylename)
	{
		StringBuffer buffer = new StringBuffer();

		if (style != null)
		{
			String[] tokens = style.split(";");

			for (int i = 0; i < tokens.length; i++)
			{
				if (!tokens[i].equals(stylename))
				{
					buffer.append(tokens[i] + ";");
				}
			}
		}

		return (buffer.length() > 1) ? buffer.substring(0, buffer.length() - 1)
				: buffer.toString();
	}

	/**
	 * Removes all stylenames from the given style and returns the updated
	 * style.
	 */
	public static String removeAllStylenames(String style)
	{
		StringBuffer buffer = new StringBuffer();

		if (style != null)
		{
			String[] tokens = style.split(";");

			for (int i = 0; i < tokens.length; i++)
			{
				if (tokens[i].indexOf('=') >= 0)
				{
					buffer.append(tokens[i] + ";");
				}
			}
		}

		return (buffer.length() > 1) ? buffer.substring(0, buffer.length() - 1)
				: buffer.toString();
	}

	/**
	 * Assigns the value for the given key in the styles of the given cells, or
	 * removes the key from the styles if the value is null.
	 * 
	 * @param model
	 *            Model to execute the transaction in.
	 * @param cells
	 *            Array of cells to be updated.
	 * @param key
	 *            Key of the style to be changed.
	 * @param value
	 *            New value for the given key.
	 */
	public static void setCellStyles(mxIGraphModel model, Object[] cells,
			String key, String value)
	{
		if (cells != null && cells.length > 0)
		{
			model.beginUpdate();
			try
			{
				for (int i = 0; i < cells.length; i++)
				{
					if (cells[i] != null)
					{
						String style = setStyle(model.getStyle(cells[i]), key,
								value);
						model.setStyle(cells[i], style);
					}
				}
			}
			finally
			{
				model.endUpdate();
			}
		}
	}

	/**
	 * Adds or removes the given key, value pair to the style and returns the
	 * new style. If value is null or zero length then the key is removed from
	 * the style.
	 * 
	 * @param style
	 *            String of the form <code>stylename[;key=value]</code>.
	 * @param key
	 *            Key of the style to be changed.
	 * @param value
	 *            New value for the given key.
	 * @return Returns the new style.
	 */
	public static String setStyle(String style, String key, String value)
	{
		boolean isValue = value != null && value.length() > 0;

		if (style == null || style.length() == 0)
		{
			if (isValue)
			{
				style = key + "=" + value;
			}
		}
		else
		{
			int index = style.indexOf(key + "=");

			if (index < 0)
			{
				if (isValue)
				{
					String sep = (style.endsWith(";")) ? "" : ";";
					style = style + sep + key + '=' + value;
				}
			}
			else
			{
				String tmp = (isValue) ? key + "=" + value : "";
				int cont = style.indexOf(";", index);

				if (!isValue)
				{
					cont++;
				}

				style = style.substring(0, index) + tmp
						+ ((cont > index) ? style.substring(cont) : "");
			}
		}

		return style;
	}

	/**
	 * Sets or toggles the flag bit for the given key in the cell's styles. If
	 * value is null then the flag is toggled.
	 * 
	 * <code>
	 * mxUtils.setCellStyleFlags(graph.getModel(),
	 * 			cells,
	 * 			mxConstants.STYLE_FONTSTYLE,
	 * 			mxConstants.FONT_BOLD, null);
	 * </code>
	 * 
	 * Toggles the bold font style.
	 * 
	 * @param model
	 *            Model that contains the cells.
	 * @param cells
	 *            Array of cells to change the style for.
	 * @param key
	 *            Key of the style to be changed.
	 * @param flag
	 *            Integer for the bit to be changed.
	 * @param value
	 *            Optional boolean value for the flag.
	 */
	public static void setCellStyleFlags(mxIGraphModel model, Object[] cells,
			String key, int flag, Boolean value)
	{
		if (cells != null && cells.length > 0)
		{
			model.beginUpdate();
			try
			{
				for (int i = 0; i < cells.length; i++)
				{
					if (cells[i] != null)
					{
						String style = setStyleFlag(model.getStyle(cells[i]),
								key, flag, value);
						model.setStyle(cells[i], style);
					}
				}
			}
			finally
			{
				model.endUpdate();
			}
		}
	}

	/**
	 * Sets or removes the given key from the specified style and returns the
	 * new style. If value is null then the flag is toggled.
	 * 
	 * @param style
	 *            String of the form stylename[;key=value].
	 * @param key
	 *            Key of the style to be changed.
	 * @param flag
	 *            Integer for the bit to be changed.
	 * @param value
	 *            Optional boolean value for the given flag.
	 */
	public static String setStyleFlag(String style, String key, int flag,
			Boolean value)
	{
		if (style == null || style.length() == 0)
		{
			if (value == null || value.booleanValue())
			{
				style = key + "=" + flag;
			}
			else
			{
				style = key + "=0";
			}
		}
		else
		{
			int index = style.indexOf(key + "=");

			if (index < 0)
			{
				String sep = (style.endsWith(";")) ? "" : ";";

				if (value == null || value.booleanValue())
				{
					style = style + sep + key + "=" + flag;
				}
				else
				{
					style = style + sep + key + "=0";
				}
			}
			else
			{
				int cont = style.indexOf(";", index);
				String tmp = "";
				int result = 0;

				if (cont < 0)
				{
					tmp = style.substring(index + key.length() + 1);
				}
				else
				{
					tmp = style.substring(index + key.length() + 1, cont);
				}

				if (value == null)
				{
					result = Integer.parseInt(tmp) ^ flag;
				}
				else if (value.booleanValue())
				{
					result = Integer.parseInt(tmp) | flag;
				}
				else
				{
					result = Integer.parseInt(tmp) & ~flag;
				}

				style = style.substring(0, index) + key + "=" + result
						+ ((cont >= 0) ? style.substring(cont) : "");
			}
		}

		return style;
	}
}
