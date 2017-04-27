package com.mxgraph.io.vsdx;

import java.util.HashMap;
import java.util.Map;

import org.w3c.dom.Element;
import org.w3c.dom.NodeList;

/**
 * This is a singleton class that stores various global properties to document.<br/>
 * The properties are:
 * <ul>
 * <li>
 * document's colors
 * </li>
 * <li>
 * document's fonts
 * </li>
 * <li>
 * default text style
 * </li>
 * <li>
 * default line style
 * </li>
 * <li>
 * default fill style
 * </li>
 * </ul>
 */
public class mxPropertiesManager
{
	/**
	 * Map with the document's colors.<br/>
	 * The key is the index number and the value is the hex representation of the color.
	 */
	private HashMap<String, String> colorElementMap = new HashMap<String, String>();

	/**
	 * Map with the document's fonts.<br/>
	 * The key is the ID and the value is the name of the font.
	 */
	private HashMap<String, String> fontElementMap = new HashMap<String, String>();

	/**
	 * Best guess at default colors if 0-23 are missing in the document (seems to always be the case for vsdx)
	 */
	private static final Map<String, String> defaultColors = new HashMap<String, String>();
	
	static
	{
		defaultColors.put("0", "#000000");
		defaultColors.put("1", "#FFFFFF");
		defaultColors.put("2", "#FF0000");
		defaultColors.put("3", "#00FF00");
		defaultColors.put("4", "#0000FF");
		defaultColors.put("5", "#FFFF00");
		defaultColors.put("6", "#FF00FF");
		defaultColors.put("7", "#00FFFF");
		defaultColors.put("8", "#800000");
		defaultColors.put("9", "#008000");
		defaultColors.put("10", "#000080");
		defaultColors.put("11", "#808000");
		defaultColors.put("12", "#800080");
		defaultColors.put("13", "#008080");
		defaultColors.put("14", "#C0C0C0");
		defaultColors.put("15", "#E6E6E6");
		defaultColors.put("16", "#CDCDCD");
		defaultColors.put("17", "#B3B3B3");
		defaultColors.put("18", "#9A9A9A");
		defaultColors.put("19", "#808080");
		defaultColors.put("20", "#666666");
		defaultColors.put("21", "#4D4D4D");
		defaultColors.put("22", "#333333");
		defaultColors.put("23", "#1A1A1A");
	}
	
	/**
	 * Loads the properties of the document.
	 * @param doc Document with the properties.
	 */
	public void initialise(Element elem, mxVsdxModel model)
	{
		//Loads the colors
		if (elem != null)
		{
			NodeList vdxColors = elem.getElementsByTagName(mxVsdxConstants.COLORS);
	
			if (vdxColors.getLength() > 0)
			{
				Element colors = (Element) vdxColors.item(0);
				NodeList colorList = colors.getElementsByTagName(mxVsdxConstants.COLOR_ENTRY);
				int colorLength = colorList.getLength();
	
				for (int i = 0; i < colorLength; i++)
				{
					Element color = (Element) colorList.item(i);
					String colorId = color.getAttribute(mxVsdxConstants.INDEX);
					String colorValue = color.getAttribute(mxVsdxConstants.RGB);
					colorElementMap.put(colorId, colorValue);
				}
			}
	
			//Loads the fonts
			NodeList vdxFonts = elem.getElementsByTagName(mxVsdxConstants.FACE_NAMES);
	
			if (vdxFonts.getLength() > 0)
			{
				Element fonts = (Element) vdxFonts.item(0);
				NodeList fontList = fonts.getElementsByTagName(mxVsdxConstants.FACE_NAME);
				int fontLength = fontList.getLength();
	
				for (int i = 0; i < fontLength; i++)
				{
					Element font = (Element) fontList.item(i);
					String fontId = font.getAttribute(mxVsdxConstants.ID);
					String fontValue = font.getAttribute(mxVsdxConstants.FONT_NAME);
					fontElementMap.put(fontId, fontValue);
				}
			}
		}
	}

	/**
	 * Returns the color of index indicated in 'ix'.
	 * @param ix Index of the color.
	 * @return Hexadecimal representation of the color.
	 */
	public String getColor(String ix)
	{
		String color = colorElementMap.get(ix);
		
		if (color == null)
		{
			color = mxPropertiesManager.defaultColors.get(ix);
			
			if (color == null)
			{
				return "";
			}
		}

		return color;
	}

	/**
	 * Returns the font of id indicated in 'id'
	 * @param id font's ID
	 * @return Name of the font.
	 */
	public String getFont(String id)
	{
		String font = fontElementMap.get(id);
		
		if (font == null)
		{
			return "";
		}
		else
		{
			return font;
		}
	}
}
