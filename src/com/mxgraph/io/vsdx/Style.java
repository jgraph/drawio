/**
 * Copyright (c) 2006-2016, JGraph Ltd
 * Copyright (c) 2006-2016, Gaudenz Alder
 */
package com.mxgraph.io.vsdx;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.logging.Logger;

import org.w3c.dom.Element;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;

/**
 * This class is a general wrapper for one Shape Element.<br/>
 * Provides a set of methods for retrieving the value of different properties
 * stored in the shape element.<br/>
 * References to other shapes or style-sheets are not considered.
 */
public abstract class Style
{
	protected Element shape;
	
	protected Integer Id;
	
	protected Element text = null;
	
	// .vsdx cells elements that contain one style each
	protected Map<String, Element> cellElements = new HashMap<String, Element>();
	
	protected Map<String, Section> sections = new HashMap<String, Section>();

	protected mxPropertiesManager pm;
	
	/**
	 * Mapping of line,text and fill styles to the style parents
	 */
	protected Map<String, Style> styleParents = new HashMap<String, Style>();
	
	protected Style textParent;
	
	protected Style theme;

	private final static Logger LOGGER = Logger.getLogger(Style.class.getName());
	
	public static boolean vsdxStyleDebug = false;
	
	protected static Map<String, String> styleTypes = new HashMap<String, String>();
	
	static
	{
		styleTypes.put(mxVsdxConstants.FILL, mxVsdxConstants.FILL_STYLE);
		styleTypes.put(mxVsdxConstants.FILL_BKGND, mxVsdxConstants.FILL_STYLE);
		styleTypes.put(mxVsdxConstants.FILL_BKGND_TRANS, mxVsdxConstants.FILL_STYLE);
		styleTypes.put(mxVsdxConstants.FILL_FOREGND, mxVsdxConstants.FILL_STYLE);
		styleTypes.put(mxVsdxConstants.FILL_FOREGND_TRANS, mxVsdxConstants.FILL_STYLE);
		styleTypes.put(mxVsdxConstants.FILL_PATTERN , mxVsdxConstants.FILL_STYLE);
		styleTypes.put(mxVsdxConstants.SHDW_PATTERN, mxVsdxConstants.FILL_STYLE);
		styleTypes.put(mxVsdxConstants.FILL_STYLE, mxVsdxConstants.FILL_STYLE);
		
		styleTypes.put(mxVsdxConstants.BEGIN_ARROW, mxVsdxConstants.LINE_STYLE);
		styleTypes.put(mxVsdxConstants.END_ARROW, mxVsdxConstants.LINE_STYLE);
		styleTypes.put(mxVsdxConstants.LINE_PATTERN, mxVsdxConstants.LINE_STYLE);
		styleTypes.put(mxVsdxConstants.LINE_COLOR, mxVsdxConstants.LINE_STYLE);
		styleTypes.put(mxVsdxConstants.LINE_COLOR_TRANS, mxVsdxConstants.LINE_STYLE);
		
		styleTypes.put(mxVsdxConstants.TEXT_BKGND, mxVsdxConstants.TEXT_STYLE);
		styleTypes.put(mxVsdxConstants.BOTTOM_MARGIN, mxVsdxConstants.TEXT_STYLE);
		styleTypes.put(mxVsdxConstants.LEFT_MARGIN, mxVsdxConstants.TEXT_STYLE);
		styleTypes.put(mxVsdxConstants.RIGHT_MARGIN, mxVsdxConstants.TEXT_STYLE);
		styleTypes.put(mxVsdxConstants.TOP_MARGIN, mxVsdxConstants.TEXT_STYLE);
	};
	
	/**
	 * Create a new instance of mxGeneralShape
	 * @param shape Shape Element to be wrapped.
	 */
	public Style(Element shape, mxVsdxModel model)
	{
		this.shape = shape;
		this.pm = model.getPropertiesManager();
		
		String Id = shape.getAttribute(mxVsdxConstants.ID);
		
		try
		{
			this.Id = (Id != null && !Id.isEmpty()) ? Integer.valueOf(Id) : -1;
		}
		catch (Exception e)
		{
			// TODO handle exception correctly
		}
		
		cacheCells(model);
		stylesheetRefs(model);
	}

	public void styleDebug(String debug)
	{
		if (vsdxStyleDebug)
		{
			System.out.println(debug);
		}
	}

	public void stylesheetRefs(mxVsdxModel model)
	{
		styleParents.put(mxVsdxConstants.FILL_STYLE, model.getStylesheet(shape.getAttribute(mxVsdxConstants.FILL_STYLE)));
		styleParents.put(mxVsdxConstants.LINE_STYLE, model.getStylesheet(shape.getAttribute(mxVsdxConstants.LINE_STYLE)));
		
		mxStyleSheet textStyle = model.getStylesheet(shape.getAttribute(mxVsdxConstants.TEXT_STYLE));
		styleParents.put(mxVsdxConstants.TEXT_STYLE, model.getStylesheet(shape.getAttribute(mxVsdxConstants.TEXT_STYLE)));
		
		this.textParent = textStyle;
		
		mxStyleSheet theme = model.getStylesheet("0");
		this.theme = theme;
	}

	/**
	 * Checks if the shape Element has a children with tag name = 'tag'.
	 * @param tag Name of the Element to be found.
	 * @return Returns <code>true</code> if the shape Element has a children with tag name = 'tag'
	 */
	protected void cacheCells(mxVsdxModel model)
	{
		if (shape != null)
		{
			NodeList children = shape.getChildNodes();
			
			if (children != null)
			{
				Node childNode = children.item(0);
				
				while (childNode != null)
				{
					if (childNode instanceof Element)
					{
						parseShapeElem((Element)childNode, model);
					}
					
					childNode = childNode.getNextSibling();
				}
			}
		}
	}
	
	/**
	 * Caches the specified element
	 * @param elem the element to cache
	 */
	protected void parseShapeElem(Element elem, mxVsdxModel model)
	{
		String childName = elem.getNodeName();

		if (childName.equals("Cell"))
		{
			this.cellElements.put(elem.getAttribute("N"), elem);
		}
		else if (childName.equals("Section"))
		{
			this.parseSection(elem);
		}
		else if (childName.equals(mxVsdxConstants.TEXT))
		{
			this.text = elem;
		}
	}

	/**
	 * Caches the specific section element
	 * @param elem the element to cache
	 */
	protected void parseSection(Element elem)
	{
		Section sect = new Section(elem);
		this.sections.put(elem.getAttribute("N"), sect);
	}

	/**
	 * Checks if the 'primary' Element has a child with tag name = 'tag'.
	 * @param tag Name of the Element to be found.
	 * @return Returns <code>true</code> if the 'primary' Element has a child with tag name = 'tag'.
	 */
	protected boolean hasProperty(String nodeName, String tag)
	{
		return this.cellElements.containsKey(tag);
	}

	/**
	 * Checks if the 'primary' Element has a child with tag name = 'tag'.
	 * @param tag Name of the Element to be found.
	 * @return Returns <code>true</code> if the 'primary' Element has a child with tag name = 'tag'.
	 */
	protected boolean hasIndexedProperty(String parentTag, String ix, String tag)
	{
		NodeList children = shape.getChildNodes();
		Element primary = null;

		if (mxVsdxUtils.nodeListHasTag(children, parentTag))
		{
			primary = mxVsdxUtils.nodeListTagIndexed(children, parentTag, ix);
		}

		NodeList xChildren = null;

		if (primary != null)
		{
			xChildren = primary.getChildNodes();
		}
		
		return mxVsdxUtils.nodeListHasTag(xChildren, tag);
	}
	
	/**
	 * Returns the value of the element
	 * @param elem The element whose value is to be found
	 * @return String value of the element.
	 */
	protected String getText(Element elem, String defaultValue)
	{
		if (elem != null)
		{
			return elem.getAttribute("V");
		}
		
		return defaultValue;
	}

	/**
	 * Returns the value of the element with tag name = 'tag' in the children
	 * of primary.
	 * @param parentTag tag Name of the parent style element
	 * @param tag Name of the Element to be found.
	 * @return String value of the element.
	 */
	protected String getChildText(String parentTag, String ix, String tag, String defaultValue)
	{
		NodeList children = shape.getChildNodes();
		Element primary = null;

		if (mxVsdxUtils.nodeListHasTag(children, parentTag))
		{
			primary = mxVsdxUtils.nodeListTagIndexed(children, parentTag, ix);
		}
		
		if (primary != null)
		{
			NodeList nodeList = primary.getElementsByTagName(tag);
			
			if (nodeList != null && nodeList.getLength() > 0)
			{
				return (nodeList.item(0).getTextContent());
			}
		}

		return defaultValue;
	}

	/**
	 * Returns the value of the element with tag name = 'tag' in the children
	 * of 'primary' in his double representation.<br/>
	 * .vdx uses Inches for numerical representations, so this value
	 * is multiplied by the result of <code>mxVdxUtils.conversionFactor()</code>
	 * and is converted to pixels.
	 * @param tag Name of the Element to be found.
	 * @return Numerical value of the element.
	 */
	protected double getNumericalValue(Element cell, double defaultValue)
	{
		if (cell != null)
		{
			String value = cell.getAttribute("V");

			if (value != null)
			{
				if (value.equals("Themed"))
				{
					return 0;
				}

				try
				{
					double parsedValue = Double.parseDouble(value);
					return Math.round(parsedValue * 100.0) / 100.0;
				}
				catch (NumberFormatException e)
				{
					e.printStackTrace();
				}
			}
		}

		return defaultValue;
	}

	//if (!tag.equals(mxVdxConstants.FILL_BKGND_TRANS) && !tag.equals(mxVdxConstants.FILL_FOREGND_TRANS) && !tag.equals(mxVdxConstants.LINE_COLOR_TRANS) && !tag.equals(mxVdxConstants.NO_LINE))

	/**
	 * Returns the value of the element with tag name = 'tag' in the children
	 * of 'primary' in his double representation.<br/>
	 * .vdx uses Inches for numerical representations, so this value
	 * is multiplied by the result of <code>mxVdxUtils.conversionFactor()</code>
	 * and is converted to pixels.
	 * @param tag Name of the Element to be found.
	 * @return Numerical value of the element.
	 */
	protected double getScreenNumericalValue(Element cell, double defaultValue)
	{
		if (cell != null)
		{
			String value = cell.getAttribute("V");

			if (value != null)
			{
				try
				{
					double parsedValue = Double.parseDouble(value);
					parsedValue = parsedValue * mxVsdxUtils.conversionFactor;
					
					return Math.round(parsedValue * 100.0) / 100.0;
				}
				catch (NumberFormatException e)
				{
					e.printStackTrace();
				}
			}
		}

		return defaultValue;
	}
	
	/**
	 * Returns the value of the element with tag name = 'tag' in the children
	 * of 'primary' in his double representation.<br/>
	 * .vdx uses Inches for numerical representations, so this value
	 * is multiplied by the result of <code>mxVdxUtils.conversionFactor()</code>
	 * and is converted to pixels.
	 * @param tag Name of the Element to be found.
	 * @return Numerical value of the element.
	 */
	protected double getChildNumericalValue(String parentTag, String ix, String tag, double defaultValue)
	{
		NodeList children = shape.getChildNodes();
		Element primary = null;

		if (mxVsdxUtils.nodeListHasTag(children, parentTag))
		{
			primary = mxVsdxUtils.nodeListTagIndexed(children, parentTag, ix);
		}
		
		if (primary != null)
		{
			NodeList nodeList = primary.getElementsByTagName(tag);

			if (nodeList != null && nodeList.getLength() > 0)
			{
				double value = Double.parseDouble(nodeList.item(0).getTextContent()) * mxVsdxUtils.conversionFactor;
				return Math.round(value * 100.0) / 100.0;
			}
		}

		return defaultValue;
	}
	
	/**
	 * Returns the value of the element with tag name = 'tag' in the children
	 * of 'primary' in his double representation.<br/>
	 * @param tag Name of the Element to be found.
	 * @return Numerical value of the element.
	 */
	public String getAttribute(String parentTag, String tag, String attribute, String defaultValue)
	{
		String result = defaultValue;
		Element cell = this.cellElements.get(tag);
		
		if (cell != null)
		{
			result = cell.getAttribute(attribute);
		}

		return result;
	}
	
	/**
	 * Returns the value of the attribute of the element with tag name = 'tag' in the children
	 * of the shape element<br/>
	 * @param tag Name of the Element to be found.
	 * @return Numerical value of the element.
	 */
	public String getAttribute(String tag, String attribute, String defaultValue)
	{
		String result = defaultValue;
		Element cell = this.cellElements.get(tag);
		
		if (cell != null)
		{
			result = cell.getAttribute(attribute);
		}

		return result;
	}
	
	protected Map <String, String> getChildValues(Element parent, Map<String, String> requiredValues)
	{
		Map <String, String> result = new HashMap<String, String>();
		
		Node child = parent.getFirstChild();
		
		while (child != null)
		{
			if (child instanceof Element)
			{
				Element childElem = (Element)child;
				String childName = childElem.getNodeName();
				String name = null;
				String nodeValue = null;
				
				if (childName.equals("Cell"))
				{
					name = childElem.getAttribute("N");
					nodeValue = childElem.getAttribute("V");
				}
				else
				{
					name = childElem.getNodeName();
					nodeValue = childElem.getTextContent();
				}
				
				if (requiredValues != null)
				{
					String nodeOverride = requiredValues.get(name);
					
					if (nodeOverride != null)
					{
						nodeValue = childElem.getAttribute(nodeOverride);
					}
				}
				
				result.put(name, nodeValue);
			}
			
			child = child.getNextSibling();
		}
		
		return result;
	}

	/**
	 * Finds a cell key in a Section hierarchy
	 * @param keys the Section/Row/Cell keys
	 * @return the Cell Element
	 */
	protected Element getSectionCell(String[] keys)
	{
		Section section = this.sections.get(keys[0]);
		
		return section.getCell(keys);
	}
	
	/**
	 * Locates the first entry for the specified style string in the style hierarchy.
	 * The order is to look locally, then delegate the request to the relevant parent style
	 * if it doesn't exist locally
	 * @param key The key of the cell to find
	 * @return the Element that first resolves to that style key or null or none is found
	 */
	protected Element getCellElement(String key)
	{
		String[] keys = key.split(".");
		
		if (keys.length > 1)
		{
			// Section being referenced
			return getSectionCell(keys);
		}

		Element elem = this.cellElements.get(key);
		boolean inherit = false;
		
		if (elem != null)
		{
			String form = elem.getAttribute("F");
			String value = elem.getAttribute("V");
			
			if (form != null && value != null)
			{
				if (form.equals("Inh") && value.equals("Themed"))
				{
					inherit = true;
				}
				else if (form.equals("THEMEVAL()") && value.equals("Themed") && theme != null)
				{
					// Use "no style" style
					Element themeElem = theme.getCellElement(key);
					
					if (themeElem != null)
					{
						return themeElem;
					}
				}
			}
		}
		
		if (elem == null || inherit)
		{
			String styleType = Style.styleTypes.get(key);
			Style parentStyle = this.styleParents.get(styleType);
			
			if (parentStyle != null)
			{
				Element parentElem = parentStyle.getCellElement(key);
				
				if (parentElem != null)
				{
					// Only return if non-null. Just in case (and not sure if that's valid) there is an
					// inherit formula that doesn't resolve to anything
					return parentElem;
				}
			}
		}
		
		return elem;
	}

	/**
	 * Returns the line color.<br/>
	 * The property may to be defined in master shape or line stylesheet.<br/>
	 * @return hexadecimal representation of the color.
	 */
	public String getStrokeColor()
	{
		String color = "";

		if (this.getText(this.getCellElement(mxVsdxConstants.LINE_PATTERN), "1").equals("0"))
		{
			color = "none";
		}
		else
		{
			color = this.getColor(this.getCellElement(mxVsdxConstants.LINE_COLOR));
		}

		return color;
	}

	/**
	 * Returns the shape's color.
	 * The property may to be defined in master shape or fill stylesheet.
	 * If the color is the background or the fore color, it depends on the pattern.
	 * For simple gradients and solid, returns the fore color, else return the
	 * background color.
	 * @return hexadecimal representation of the color.
	 */
	protected String getFillColor()
	{
		String fillForeColor = this.getColor(this.getCellElement(mxVsdxConstants.FILL_FOREGND));
		String fillPattern = this.getText(this.getCellElement(mxVsdxConstants.FILL_PATTERN), "0");
		
		if (fillPattern != null && fillPattern.equals("0"))
		{
			return "none";
		}
		else
		{
			return fillForeColor;
		}
	}

	protected String getColor(Element elem)
	{
		String color = this.getText(elem, "");

		if (!color.startsWith("#"))
		{
			color = pm.getColor(color);
		}
		
		return color;
	}

	/**
	 * The TextBkgnd cell can have any value from 0 through 24, or 255. The values 0 and 255 (visTxtBlklOpaque) both indicate a transparent text background.
	 * To enter a custom color, use the RGB or HSL function plus one—for example, RGB(255,127,255)+1. The value of a custom color is its RGB color, and RGB(r, g, b)+1, 
	 * rather than a number, will be shown in the ShapeSheet window. When used in numeric operations, custom colors have values of 25 and above.
	 * You can set the transparency of the text background color in the TextBkgndTrans cell.
	 */
	protected String getTextBkgndColor(Element elem)
	{
		String color = this.getText(elem, "");

		if (!color.startsWith("#"))
		{
			if (color.equals("0") || color.equals("255"))
			{
				return "none";
			}

			return pm.getColor(color);
		}
		
		return color;
	}
	
	/**
	 * Checks if the line weight is defined.
	 * @return Returns <code>true</code> if the line weight is defined.
	 */
	public boolean hasLineWeight()
	{
		return hasProperty(mxVsdxConstants.LINE, mxVsdxConstants.LINE_WEIGHT);
	}

	/**
	 * Returns the line weight of the shape in pixels
	 * @return Numerical value of the LineWeight element.
	 */
	public double getLineWeight()
	{
		return getNumericalValue(this.getCellElement(mxVsdxConstants.LINE_WEIGHT), 0);
	}

	/**
	 * Returns the level of transparency of the Shape.
	 * @return double in range (opaque = 0)..(100 = transparent)
	 */
	public double getStrokeTransparency()
	{
			return getNumericalValue(this.getCellElement(mxVsdxConstants.LINE_COLOR_TRANS), 0);
	}

	/**
	 * Returns the value of the Text element.
	 * @return Value of the Text element.
	 */
	public String getText()
	{
		if (this.text != null)
		{
			return text.getTextContent();
		}

		return null;
	}

	/**
	 * Returns the children Nodes of Text.
	 * @return List with the children of the Text element.
	 */
	public List<Node> getTextChildren()
	{
		List<Node> list = null;
		NodeList child = null;

		if (this.text != null)
		{
			child = text.getChildNodes();
			list = mxVsdxUtils.copyNodeList(child);
		}

		return list;
	}

	/**
	 * Returns the NameU attribute.
	 * @return Value of the NameU attribute.
	 */
	public String getNameU()
	{
		return shape.getAttribute(mxVsdxConstants.NAME_U);
	}

	/**
	 * Returns the UniqueID attribute.
	 * @return Value of the UniqueID attribute.
	 */
	public String getUniqueID()
	{
		return shape.getAttribute(mxVsdxConstants.UNIQUE_ID);
	}

	/**
	 * Returns the value of the Id attribute.
	 * @return Value of the Id attribute.
	 */
	public Integer getId()
	{
		return this.Id;
	}

	/**
	 * Returns the amount of Connection Elements inside of Shape Element.
	 * @return Number of Connection Elements.
	 */
	public int getAmountConnection()
	{
		List<Element> lineTo = new ArrayList<Element>();
		NodeList xChildrens = null;

		if (shape != null)
		{
			xChildrens = shape.getChildNodes();
		}

		if (mxVsdxUtils.nodeListHasTag(xChildrens, mxVsdxConstants.CONNECTION))
		{
			lineTo = mxVsdxUtils.nodeListTags(xChildrens, mxVsdxConstants.CONNECTION);
		}

		return lineTo.size();
	}

	/**
	 * Checks if the color of one text fragment is defined
	 * @param charIX IX attribute of Char element
	 * @return Returns <code>true</code> if the color of one text fragment is defined.
	 */
	public boolean hasTextColor(String charIX)
	{
		return hasIndexedProperty(mxVsdxConstants.CHAR, charIX, mxVsdxConstants.COLOR);
	}

	/**
	 * Returns the color of one text fragment
	 * @param charIX IX attribute of Char element
	 * @return Text color in hexadecimal representation.
	 */
	public String getTextColor(String charIX)
	{
		String color = getChildText(mxVsdxConstants.CHAR, charIX, mxVsdxConstants.COLOR, "#000000");

		if (!color.startsWith("#"))
		{
			color = pm.getColor(color);
		}

		return color;
	}

	/**
	 * Returns the top margin of text in pixels.
	 * @return Numerical value of the TopMargin element
	 */
	public double getTextTopMargin()
	{
		return getScreenNumericalValue(this.getCellElement(mxVsdxConstants.TOP_MARGIN), 0);
	}

	/**
	 * Returns the bottom margin of text in pixels.
	 * @return Numerical value of the BottomMargin element.
	 */
	public double getTextBottomMargin()
	{
		return getScreenNumericalValue(this.getCellElement(mxVsdxConstants.BOTTOM_MARGIN), 0);
	}

	/**
	 * Returns the left margin of text in pixels.
	 * @return Numerical value of the LeftMargin element.
	 */
	public double getTextLeftMargin()
	{
		return getScreenNumericalValue(this.getCellElement(mxVsdxConstants.LEFT_MARGIN), 0);
	}

	/**
	 * Returns the right margin of text in pixels.
	 * @return Numerical value of the RightMargin element.
	 */
	public double getTextRightMargin()
	{
		return getScreenNumericalValue(this.getCellElement(mxVsdxConstants.RIGHT_MARGIN), 0);
	}

	/**
	 * Checks if the size of one text fragment is defined.
	 * @param charIX IX atribute of Char element
	 * @return Returns <code>true</code> if the size of one text fragment is defined.
	 */
	public boolean hasTextSize(String charIX)
	{
		return hasIndexedProperty(mxVsdxConstants.CHAR, charIX, mxVsdxConstants.SIZE);
	}

	/**
	 * Returns the size of one text fragment in pixels.
	 * @param charIX IX atribute of Char element
	 * @return String representation of the numerical value of the Size element.
	 */
	public String getTextSize(String charIX)
	{
		return String.valueOf(getChildNumericalValue(mxVsdxConstants.CHAR, charIX, mxVsdxConstants.SIZE, 0));
	}

	/**
	 * Checks if the style of one text fragment is defined.
	 * @param charIX IX atribute of Char element
	 * @return Returns <code>true</code> if the style of one text fragment is defined.
	 */
	public boolean hasTextStyle(String charIX)
	{
		return hasIndexedProperty(mxVsdxConstants.CHAR, charIX, mxVsdxConstants.STYLE);
	}

	/**
	 * Returns the style of one text fragment.
	 * @param charIX IX atribute of Char element
	 * @return String value of the Style element.
	 */
	public String getTextStyle(String charIX)
	{
		return getChildText(mxVsdxConstants.CHAR, charIX, mxVsdxConstants.STYLE, "");
	}

	/**
	 * Checks if the font of one text fragment is defined
	 * @param charIX IX atribute of Char element
	 * @return Returns <code>true</code> if the font of one text fragment is defined.
	 */
	public boolean hasTextFont(String charIX)
	{
		return hasIndexedProperty(mxVsdxConstants.CHAR, charIX, mxVsdxConstants.FONT);
	}

	/**
	 * Returns the font of one text fragment
	 * @param charIX IX attribute of Char element
	 * @return Name of the font.
	 */
	public String getTextFont(String charIX)
	{
		return pm.getFont(getChildText(mxVsdxConstants.CHAR, charIX, mxVsdxConstants.FONT, ""));
	}

	/**
	 * Checks if the position of one text fragment is defined
	 * @param charIX IX attribute of Char element
	 * @return Returns <code>true</code> if the position of one text fragment is defined.
	 */
	public boolean hasTextPos(String charIX)
	{
		return hasIndexedProperty(mxVsdxConstants.CHAR, charIX, mxVsdxConstants.POS);
	}

	/**
	 * Returns the position of one text fragment
	 * @param charIX IX attribute of Char element
	 * @return Integer value of the Pos element.
	 */
	public int getTextPos(String charIX)
	{
		String val = getChildText(mxVsdxConstants.CHAR, charIX, mxVsdxConstants.POS, "");

		if (!val.equals(""))
		{
			return Integer.parseInt(val);
		}

		return 0;
	}

	/**
	 * Checks if the strikethru of one text fragment is defined
	 * @param charIX IX attribute of Char element
	 * @return Returns <code>true</code> if the strikethru of one text fragment is defined
	 */
	public boolean hasTextStrike(String charIX)
	{
		return hasIndexedProperty(mxVsdxConstants.CHAR, charIX, mxVsdxConstants.STRIKETHRU);
	}

	/**
	 * Checks if one text fragment is Strikethru
	 * @param charIX IX attribute of Char element
	 * @return Returns <code>true</code> if one text fragment is Strikethru
	 */
	public boolean getTextStrike(String charIX)
	{
		String val = getChildText(mxVsdxConstants.CHAR, charIX, mxVsdxConstants.STRIKETHRU, "");
		return val.equals("1");
	}

	/**
	 * Checks if the case of one text fragment is defined
	 * @param charIX IX attribute of Char element
	 * @return Returns <code>true</code> if the case of one text fragment is defined.
	 */
	public boolean hasTextCase(String charIX)
	{
		return hasIndexedProperty(mxVsdxConstants.CHAR, charIX, mxVsdxConstants.CASE);
	}

	/**
	 * Returns the case property of one text fragment
	 * @param charIX IX attribute of Char element
	 * @return Integer value of the Case element
	 */
	public int getTextCase(String charIX)
	{
		String val = getChildText(mxVsdxConstants.CHAR, charIX, mxVsdxConstants.CASE, "");

		if (!val.equals(""))
		{
			return Integer.parseInt(val);
		}

		return 0;
	}

	/**
	 * Checks if the horizontal align of text  is defined
	 * @param paraIX IX attribute of Para element
	 * @return Returns <code>true</code> if the horizontal align of text  is defined.
	 */
	public boolean hasHorizontalAlign(String paraIX)
	{
		return hasIndexedProperty(mxVsdxConstants.PARAGRAPH, paraIX, mxVsdxConstants.HORIZONTAL_ALIGN);
	}

	/**
	 * Returns the horizontal align property of text
	 * @param paraIX IX attribute of Para element
	 * @return Integer value of the HorizontalAlign element.
	 */
	public int getHorizontalAlign(String paraIX)
	{
		String val = getChildText(mxVsdxConstants.PARAGRAPH, paraIX,	mxVsdxConstants.HORIZONTAL_ALIGN, "");

		if (!val.equals(""))
		{
			return Integer.parseInt(val);
		}

		return 0;
	}

	/**
	 * Checks if the first indent of one paragraph is defined
	 * @param paraIX IX attribute of Para element
	 * @return Returns <code>true</code> if the first indent of one paragraph is defined.
	 */
	public boolean hasIndentFirst(String paraIX)
	{
		return hasIndexedProperty(mxVsdxConstants.PARAGRAPH, paraIX, mxVsdxConstants.INDENT_FIRST);
	}

	/**
	 * Returns the first indent of one paragraph in pixels.
	 * @param paraIX IX attribute of Para element
	 * @return String representation of the numerical value of the IndentFirst element.
	 */
	public String getIndentFirst(String paraIX)
	{
		return String.valueOf(getChildNumericalValue(mxVsdxConstants.PARAGRAPH, paraIX, mxVsdxConstants.INDENT_FIRST, 0));
	}

	/**
	 * Checks if the indent to left of one paragraph is defined
	 * @param paraIX IX attribute of Para element
	 * @return Returns <code>true</code> if the indent to left of one paragraph is defined.
	 */
	public boolean hasIndentLeft(String paraIX)
	{
		return hasIndexedProperty(mxVsdxConstants.PARAGRAPH, paraIX, mxVsdxConstants.INDENT_LEFT);
	}

	/**
	 * Returns the indent to left of one paragraph
	 * @param paraIX IX attribute of Para element
	 * @return String representation of the numerical value of the IndentLeft element.
	 */
	public String getIndentLeft(String paraIX)
	{
		return String.valueOf(getChildNumericalValue(mxVsdxConstants.PARAGRAPH, paraIX, mxVsdxConstants.INDENT_LEFT, 0));
	}

	/**
	 * Checks if the indent to right of one paragraph is defined
	 * @param paraIX IX attribute of Para element
	 * @return Returns <code>true</code> if the indent to right of one paragraph is defined.
	 */
	public boolean hasIndentRight(String paraIX)
	{
		return hasIndexedProperty(mxVsdxConstants.PARAGRAPH, paraIX, mxVsdxConstants.INDENT_RIGHT);
	}

	/**
	 * Returns the indent to right of one paragraph
	 * @param paraIX IX attribute of Para element
	 * @return String representation of the numerical value of the IndentRight element.
	 */
	public String getIndentRight(String paraIX)
	{
		return String.valueOf(getChildNumericalValue(mxVsdxConstants.PARAGRAPH, paraIX, mxVsdxConstants.INDENT_RIGHT, 0));
	}

	/**
	 * Checks if the space before one paragraph is defined
	 * @param paraIX IX attribute of Para element
	 * @return Returns <code>true</code> if the space before one paragraph is defined.
	 */
	public boolean hasSpBefore(String paraIX)
	{
		return hasIndexedProperty(mxVsdxConstants.PARAGRAPH, paraIX, mxVsdxConstants.SPACE_BEFORE);
	}

	/**
	 * Returns the space before one paragraph.
	 * @param paraIX IX attribute of Para element
	 * @return String representation of the numerical value of the SpBefore element.
	 */
	public String getSpBefore(String paraIX)
	{
		return String.valueOf(getChildNumericalValue(mxVsdxConstants.PARAGRAPH, paraIX, mxVsdxConstants.SPACE_BEFORE, 0));
	}

	/**
	 * Checks if the space after one paragraph is defined
	 * @param paraIX IX attribute of Para element
	 * @return Returns <code>true</code> if the space after one paragraph is defined.
	 */
	public boolean hasSpAfter(String paraIX)
	{
		return hasIndexedProperty(mxVsdxConstants.PARAGRAPH, paraIX, mxVsdxConstants.SPACE_AFTER);
	}

	/**
	 * Returns the space after one paragraph
	 * @param paraIX IX attribute of Para element
	 * @return String representation of the numerical value of the SpAfter element.
	 */
	public String getSpAfter(String paraIX)
	{
		return String.valueOf(getChildNumericalValue(mxVsdxConstants.PARAGRAPH, paraIX, mxVsdxConstants.SPACE_AFTER, 0));
	}

	/**
	 * Checks if the space between lines in one paragraph is defined
	 * @param paraIX IX attribute of Para element
	 * @return Returns <code>true</code> if the space between lines in one paragraph is defined.
	 */
	public boolean hasSpLine(String paraIX)
	{
		return hasIndexedProperty(mxVsdxConstants.PARAGRAPH, paraIX, mxVsdxConstants.SPACE_LINE);
	}

	/**
	 * Returns the space between lines in one paragraph.
	 * @param paraIX IX attribute of Para element.
	 * @return Double representation of the value of the SpLine element.
	 */
	public double getSpLine(String paraIX)
	{
		String val = getChildText(mxVsdxConstants.PARAGRAPH, paraIX, mxVsdxConstants.SPACE_LINE, "");

		if (!val.equals(""))
		{
			return Double.parseDouble(val);
		}

		return 0;
	}

	/**
	 * Checks if the flags of one paragraph is defined.
	 * @param paraIX IX attribute of Para element.
	 * @return Returns <code>true</code> if the flags of one paragraph is defined.
	 */
	public boolean hasFlags(String paraIX)
	{
		return hasIndexedProperty(mxVsdxConstants.PARAGRAPH, paraIX, mxVsdxConstants.FLAGS);
	}

	/**
	 * Returns the flags of one paragraph.
	 * @param paraIX IX attribute of Para element.
	 * @return String value of the Flags element.
	 */
	public String getFlags(String paraIX)
	{
		return getChildText(mxVsdxConstants.PARAGRAPH, paraIX, mxVsdxConstants.FLAGS, "0");
	}

	/**
	 * Checks if the direction of one text fragment is defined
	 * @param paraIX IX attribute of Para element
	 * @return Returns <code>true</code> if the direction of one text fragment is defined.
	 */
	public boolean hasRTLText(String paraIX)
	{
		return hasIndexedProperty(mxVsdxConstants.PARAGRAPH, paraIX, mxVsdxConstants.RTL_TEXT);
	}

	/**
	 * Returns the direction of one text fragment.
	 * @param paraIX IX attribute of Para element.
	 * @return String value of the RTLText.
	 */
	public String getRTLText(String paraIX)
	{
		return getChildText(mxVsdxConstants.PARAGRAPH, paraIX, mxVsdxConstants.RTL_TEXT, "ltr");
	}

	/**
	 * Checks if the space between characters in one text fragment is defined.
	 * @param paraIX IX attribute of Para element.
	 * @return Returns <code>true</code> if the space between characters in one text fragment is defined.
	 */
	public boolean hasLetterSpace(String paraIX)
	{
		return hasIndexedProperty(mxVsdxConstants.PARAGRAPH, paraIX, mxVsdxConstants.LETTER_SPACE);
	}

	/**
	 * Returns the space between characters in one text fragment.
	 * @param paraIX IX attribute of Para element.
	 * @return String representation of the numerical value of the Letterspace element.
	 */
	public String getLetterSpace(String paraIX)
	{
		return String.valueOf(getChildNumericalValue(mxVsdxConstants.PARAGRAPH, paraIX, mxVsdxConstants.LETTER_SPACE, 0));
	}

	/**
	 * Checks if the bullet element is defined.
	 * @param paraIX IX attribute of Para element.
	 * @return Returns <code>true</code> if the bullet element is defined.
	 */
	public boolean hasBullet(String paraIX)
	{
		return hasIndexedProperty(mxVsdxConstants.PARAGRAPH, paraIX, mxVsdxConstants.BULLET);
	}

	/**
	 * Returns the bullet element value.
	 * @param paraIX IX attribute of Para element.
	 * @return String value of the Bullet element.
	 */
	public String getBullet(String paraIX)
	{
		return getChildText(mxVsdxConstants.PARAGRAPH, paraIX, mxVsdxConstants.BULLET, "0");
	}
	
	public Element getShape() {
		return shape;
	}

	public void setShape(Element shape) {
		this.shape = shape;
	}
}
