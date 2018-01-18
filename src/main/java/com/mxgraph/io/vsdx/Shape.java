/**
 * Copyright (c) 2006-2016, JGraph Ltd
 * Copyright (c) 2006-2016, Gaudenz Alder
 */
package com.mxgraph.io.vsdx;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.w3c.dom.Element;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;

import com.mxgraph.io.mxVsdxCodec;
import com.mxgraph.io.vsdx.theme.QuickStyleVals;
import com.mxgraph.util.mxConstants;

public class Shape extends Style
{
	public final static long VSDX_START_TIME = -2209168800000L;//new Date("12/30/1899").getTime(); 
	/**
	 * The text element of the shape, if any
	 */
	protected Element text;
	
	/**
	 * The text fields of the shape, if any
	 */
	protected LinkedHashMap<String, String> fields;
	
	/**
	 * List of paragraphs in this shape
	 */
	protected LinkedHashMap<String,Paragraph> paragraphs = null;
	
	/**
	 * mxGraph cell style map
	 */
	protected Map<String, String> styleMap = new HashMap<String, String>();
	
	/**
	 * Width of shape
	 */
	protected double width = 0;
	
	/**
	 * Height of shape
	 */
	protected double height = 0;
	
	/**
	 * Cumulative rotation of shape, including parents
	 */
	protected double rotation = 0;

	protected double lastX = 0;
	
	protected double lastY = 0;
	
	protected double lastMoveX = 0;
	
	protected double lastMoveY = 0;

	protected double lastKnot = -1;
	
	protected List<Element> geom;
	
	protected mxVsdxGeometryList geomList = null;
	protected boolean geomListProcessed = false;
	
	protected Map<String, String> imageData;

	protected mxVsdxTheme theme;
	
	protected int themeVariant = 0;
	
	protected QuickStyleVals quickStyleVals;
	
	protected final static String UNICODE_LINE_SEP = new String(new char[]{(char)226, (char)128, (char)168});
	
	public mxPathDebug debug = null;

	public Shape(Element shape, mxVsdxModel model)
	{
		super(shape, model);
		this.width = getScreenNumericalValue(this.cellElements.get(mxVsdxConstants.WIDTH), 0);
		this.height = getScreenNumericalValue(this.cellElements.get(mxVsdxConstants.HEIGHT), 0);
	}

	public void setThemeAndVariant(mxVsdxTheme theme, int themeVariant)
	{
		this.theme = theme; 
		this.themeVariant = themeVariant;
	}
	
	public mxVsdxTheme getTheme()
	{
		if (theme != null)
		{
			theme.setVariant(themeVariant);
		}
		return theme;
	}
	
	public QuickStyleVals getQuickStyleVals()
	{
		return quickStyleVals;
	}
	
	protected void processGeomList(mxVsdxGeometryList parentGeoList)
	{
		if (!geomListProcessed)
		{
			geomList = new mxVsdxGeometryList(parentGeoList);

			if (geom != null)
			{
				for (Element geoElem : geom)
				{
					geomList.addGeometry(geoElem);
				}
			}

			geomListProcessed = true;
		}
	}
	
	/**
	 * Caches the specified element
	 * @param elem the element to cache
	 */
	protected void parseShapeElem(Element elem, mxVsdxModel model)
	{
		super.parseShapeElem(elem, model);
		
		String childName = elem.getNodeName();

		if (childName.equals("ForeignData"))
		{
			String filename = elem.getOwnerDocument().getDocumentURI();
			String iType = elem.getAttribute("ForeignType");
			String compression = elem.getAttribute("CompressionType");
			
			if (iType.equals("Bitmap"))
			{
				compression = compression.toLowerCase();
			}
			else if (iType.equals("MetaFile"))
			{
				compression = "x-wmf";
			}
			else if (iType.equals("Enhanced Metafile") || iType.equals("EnhMetaFile"))
			{
				compression = "x-emf";
			}
			else
			{
				//TODO log and unsupported type
				return;
			}
			
			Node fdChild = elem.getFirstChild();
			
			if (fdChild != null)
			{
				if (fdChild instanceof Element)
				{
					Element fdElem = (Element) fdChild;
					String grandchildName = fdElem.getNodeName();
					
					if (grandchildName.toLowerCase().equals("rel"))
					{
						String rid = fdElem.getAttribute("r:id");
						
						if (rid != null && !rid.isEmpty())
						{
							// insert "_rel" into the path
							int index = filename.lastIndexOf('/');
							String pre = "";
							String post = "";

							try
							{
								pre = filename.substring(0, index);
								post = filename.substring(index, filename.length());
							}
							catch (IndexOutOfBoundsException e)
							{
								return;
							}
							
							Element relElem = model.getRelationship(rid, pre + "/_rels" + post + ".rels");
							
							if (relElem != null)
							{
								String target = relElem.getAttribute("Target");
								String type = relElem.getAttribute("Type");
								index = target.lastIndexOf('/');
								
								try
								{
									target = target.substring(index + 1, target.length());
								}
								catch (IndexOutOfBoundsException e)
								{
									return;
								}
								
								if (type != null && type.endsWith("image"))
								{
									this.imageData = new HashMap<String, String>();
									String iData = model.getMedia(mxVsdxCodec.vsdxPlaceholder + "/media/" + target);
									this.imageData.put("iData", iData);
									
									//since we convert BMP files to PNG, we set the compression to PNG
									if (target.toLowerCase().endsWith(".bmp"))
									{
										compression = "png";
									}
									else if (target.toLowerCase().endsWith(".emf"))
									{
										//emf can be a png or jpg or vector (which is not supported yet)
										//We use a number of bytes equal to file header length (which is safe as header in base64 requires 4n/3 bytes
										compression = iData.startsWith("iVBORw0K") ? "png" : (iData.startsWith("/9j/") ? "jpg" : compression);
									}

									this.imageData.put("iType", compression);
								}
							}
							else
							{
								//TODO log path issue
							}
							
							// more than one rel would break things
							return;
						}
						

					}
				}
				
				fdChild = fdChild.getNextSibling();
			}
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
		String n = elem.getAttribute("N");
		
		if (n.equals("Geometry"))
		{
			if (geom == null)
			{
				geom = new ArrayList<Element>();
			}

			this.geom.add(elem);
		}
		else if (n.equals("Field"))
		{
			ArrayList<Element> rows = mxVsdxUtils.getDirectChildNamedElements(elem, "Row");
			
			for (Element row : rows)
			{
				String ix = row.getAttribute("IX");

				if (!ix.isEmpty())
				{
					if (this.fields == null)
					{
						fields = new LinkedHashMap<String, String>();
					}
	
					String del = row.getAttribute("Del");
					
					//supporting deletion of a field by adding an empty string such that master field is not used
					if ("1".equals(del))
					{
						this.fields.put(ix, "");
						continue;
					}
					
					ArrayList<Element> cells = mxVsdxUtils.getDirectChildNamedElements(row, "Cell");
	
					String value = "", format = "", calendar = "", type = "";
					for (Element cell : cells)
					{
						n = cell.getAttribute("N");
						String v = cell.getAttribute("V");
						
						switch (n)
						{
							case "Value":
								value = v;
							break;
							case "Format":
								format = v;
							break;
							case "Calendar":
								calendar = v;
							break;
							case "Type":
								type = v;
							break;
						}
					}
					
					if (!value.isEmpty())
					{
						
						try
						{
							//TODO support other formats and calendars
							if (format.startsWith("{{"))
							{
								value = new SimpleDateFormat(
										format.replaceAll("\\{|\\}", ""))
										//the value is the number of days after 30/12/1899 (VSDX_START_TIME)
										.format(new Date(VSDX_START_TIME + (long)(Double.parseDouble(value) * 24 * 60 * 60 * 1000)));
							}
						}
						catch (Exception e)
						{
	//						System.out.println("Vsdx import: Unkown text format " + format + ". Error: " + e.getMessage());
						}
						this.fields.put(ix, value);
					}
				}
			}
		}
		else
		{
			super.parseSection(elem);
		}
	}

	/**
	 * 
	 * @return mxGraph stencil XML or null or there is no displayed geometry
	 */
	protected String parseGeom()
	{
		if (!hasGeomList())
		{
			return "";
		}
		
		return geomList.getShapeXML(this);
	}

	/**
	 * Returns the value of the Text element.
	 * @return Value of the Text element.
	 */
	public String getText()
	{
		return this.text != null ? text.getTextContent() : null;
	}

	/**
	 * Returns the children Nodes of Text.
	 * @return List with the children of the Text element.
	 */
	public NodeList getTextChildren()
	{
		return this.text != null ? text.getChildNodes() : null;
	}

	/**
	 * Returns the value of the width element in pixels.
	 * @return Numerical value of the width element.
	 */
	public double getWidth()
	{
		//some shapes has zero width while the height is non-zero. Setting width to 1 fixed it.
		return this.width == 0 && this.height > 0 ? 1 : this.width;
	}

	/**
	 * Returns the value of the height element in pixels.
	 * @return Numerical value of the height element.
	 */
	public double getHeight()
	{
		//some shapes has zero height while the width is non-zero. Setting height to 1 fixed it.
		return this.height == 0 && this.width > 0 ? 1 : this.height;
	}
	
	/**
	 * Returns the value of the rotation.
	 * @return Numerical value of the rotation
	 */
	public double getRotation()
	{
		return this.rotation;
	}
	
	/**
	 * Returns the style map of this shape
	 * @return the style map
	 */
	public Map<String, String> getStyleMap()
	{
		return this.styleMap;
	}

	/**
	 * Returns whether or not this shape has a geometry defined, locally
	 * or inherited
	 * @return whether the shape has a geometry
	 */
	public boolean hasGeom()
	{
		return !(this.geom == null || this.geom.isEmpty());
	}
	
	/**
	 * Returns whether or not this shape or its master has a geometry defined
	 * @return whether the shape has a geometry
	 */
	public boolean hasGeomList()
	{
		return this.geomList != null && this.geomList.hasGeom();
	}
	
	/**
	 * Last cp IX referenced in the Text Element.
	 */
	String cp = "0";

	/**
	 * Last pp IX referenced in the Text Element.
	 */
	String pp = "0";

	/**
	 * Last tp IX referenced in the Text Element.
	 */
	String tp = "0";

	/**
	 * Last fld IX referenced in the Text Element.
	 */
	String fld = "0";
	
	
	
	
	
	
	
	/**
	 * Transform plain text into a HTML list if the Para element referenced by
	 * pp indicates it.
	 * @param text Text to be transformed.
	 * @param pp Reference to a Para element.
	 * @return Text like a HTML list.
	 */
	public String textToList(String text, String pp)
	{
		if (!pp.equals(""))
		{
			String bullet = getBullet(pp);
			
			if (!bullet.equals("0"))
			{
				String[] entries = text.split("\n");
				String ret = "";
				
				for (String entry : entries)
				{
					ret += mxVsdxUtils.surroundByTags(entry, "li");
				}
				
				ret = mxVsdxUtils.surroundByTags(ret, "ul");
				HashMap<String, String> styleMap = new HashMap<String, String>();
				
				if (bullet.equals("4"))
				{
					styleMap.put("list-style-type", "square");
				}
				else
				{
					styleMap.put("list-style-type", "disc");
				}
				
				ret = this.insertAttributes(ret, styleMap);
				
				return ret;
			}
		}
		
		return text;
	}
	
	/**
	 * Returns the paragraph formated according the properties in the last
	 * Para element referenced.
	 * @param para Paragraph to be formated
	 * @return Formated paragraph.
	 */
	public String getTextParagraphFormated(String para)
	{
		String ret = "";
		HashMap<String, String> styleMap = new HashMap<String, String>();
		styleMap.put("align", getHorizontalAlign(pp, true));
		styleMap.put("margin-left", getIndentLeft(pp));
		styleMap.put("margin-right", getIndentRight(pp));
		styleMap.put("margin-top", getSpBefore(pp) + "px");
		styleMap.put("margin-bottom", getSpAfter(pp) + "px");
		styleMap.put("text-indent", getIndentFirst(pp));
		styleMap.put("valign", getAlignVertical());
//		String spc = getSpcLine(pp);
		//TODO dividing by 0.71 gives very large line height in most of the cases. Probably we don't need it?
//		String spcNum = spc.replaceAll("[^\\d.]", "");
//		String postFix = spc.substring(spcNum.length(),spc.length());
		//double lineH = (Double.parseDouble(spcNum) / 0.71);
//		spc = Double.toString(lineH);
//		
//		if (spc.contains("."))
//		{
//			spc = spc.substring(0, spc.lastIndexOf(".") + 3);
//		}
//		
//		spc = spc + postFix;
//		styleMap.put("line-height", spc);
		styleMap.put("direction", getTextDirection(pp));
		ret += insertAttributes(para, styleMap);
		return ret;
	}
	
	/**
	 * Returns the text formated according the properties in the last
	 * Char element referenced.
	 * @param text Text to be formated
	 * @return Formated text.
	 */
	public String getTextCharFormated(String text)
	{
		String ret = "";
		String color = "color:" + getTextColor(cp) + ";";
		String size = "font-size:" + (Double.parseDouble(this.getTextSize(cp))) + "px;";
		String font = "font-family:" + this.getTextFont(cp) + ";";
		String direction = "direction:" + this.getRtlText(cp) + ";";
		String space = "letter-spacing:" + (Double.parseDouble(this.getLetterSpace(cp)) / 0.71) + "px;";
		String lineHeight = "line-height:" + getSpcLine(pp);
		String opacity = ";opacity:" + getTextOpacity(cp);
		String pos = this.getTextPos(cp);
		String tCase = getTextCase(cp);
		
		if (tCase.equals("1"))
		{
			text = text.toUpperCase();
		}
		else if (tCase.equals("2"))
		{
			text = mxVsdxUtils.toInitialCapital(text);
		}
		
		if (pos.equals("1"))
		{
			text = mxVsdxUtils.surroundByTags(text, "sup");
		}
		else if (pos.equals("2"))
		{
			text = mxVsdxUtils.surroundByTags(text, "sub");
		}
		
		text = this.isBold(cp) ? mxVsdxUtils.surroundByTags(text, "b") : text;
		text = this.isItalic(cp) ? mxVsdxUtils.surroundByTags(text, "i") : text;
		text = this.isUnderline(cp) ? mxVsdxUtils.surroundByTags(text, "u") : text;
		text = this.getTextStrike(cp) ? mxVsdxUtils.surroundByTags(text, "s") : text;
		text = this.isSmallCaps(cp) ? mxVsdxUtils.toSmallCaps(text, this.getTextSize(cp)) : text;

		ret += "<font style=\"" + size + font + color + direction + space + lineHeight + opacity + "\">" + text + "</font>";
		return ret;
	}
	
	/**
	 * Returns the direction of the text. It may be right to left or left to right.<br/>
	 * This property may to be founded in the shape, master shape, stylesheet or
	 * default style-sheet.
	 * @param index Index of the Para element that contains the Flags element.
	 * @return The direction of the text.
	 */
	public String getTextDirection(String index)
	{
		String direction = getFlags(index);
		
		if (direction.equals("0"))
		{
			direction = "ltr";
		}
		else if (direction.equals("1"))
		{
			direction = "rtl";
		}
		
		return direction;
	}

	/**
	 * Returns the space between lines in a paragraph.<br/>
	 * This property may to be founded in the shape, master shape, stylesheet or
	 * default style-sheet.
	 * @param index Index of the Para element that contains the SpLine element.
	 * @return The space between lines n pixels.
	 */
	public String getSpcLine(String index)
	{
		String ret = "0";
		boolean isPercent = false;
		double space = getSpLine(index);
		
		if (space > 0)
		{
			space = space * mxVsdxUtils.conversionFactor;
		}
		else if (space == 0)
		{
			space = 100;
			isPercent = true;
		}
		else
		{
			space = Math.abs(space) * 100;
			isPercent = true;
		}
		
		ret = String.valueOf(space);
		ret += isPercent ? "%" : "px";
		
		return ret;
	}

	/**
	 * Returns the space before a paragraph.<br/>
	 * This property may to be founded in the shape, master shape, stylesheet or
	 * default style-sheet.
	 * @param index Index of the Para element that contains the SpBefore element.
	 * @return The space before the paragraph in pixels.
	 */
	public String getSpcBefore(String index)
	{
		return getSpBefore(index);
	}

	/**
	 * Inserts the style attributes contained in attr into the text.<br/>
	 * The text must be surrounded by tags html.
	 * @param text Text where the attributes must be inserted.
	 * @param attr Map with the attributes.
	 * @return Text with the attributes applied like style.
	 */
	public String insertAttributes(String text, HashMap<String, String> attr)
	{
		if (text.contains(">"))
		{
			int i = text.indexOf(">");
			String tail = text.substring(i);
			String head = text.substring(0, i);

			String style = " style=\"" + mxVsdxUtils.getStyleString(attr, ":") + "\"";
			return head + style + tail;
		}

		return text;
	}

	/**
	 * Returns the direction of the text. It may be right to left or left to right.<br/>
	 * This property may to be founded in the shape, master shape, stylesheet or
	 * default stylesheet.
	 * @param index Index of the Char element that contains the RTLText element.
	 * @return Direction of the text.
	 */
	public String getRtlText(String index)
	{
		Element rtlElem = getCellElement(mxVsdxConstants.RTL_TEXT, index, mxVsdxConstants.PARAGRAPH);
		String direction = getValue(rtlElem, "ltr");
		
		
		if (direction.equals("0"))
		{
			direction = "ltr";
		}
		else if (direction.equals("1"))
		{
			direction = "rtl";
		}
		
		return direction;
	}

	/**
	 * Checks if the style property of the Char element of index = 'index' 
	 * indicates bold.<br/>
	 * This property may to be founded in the shape, master shape, stylesheet or
	 * default stylesheet.
	 * @param index Index of the Char element that contains the Style element.
	 * @return Returns <code>true</code> if the style property of the Char element of 
	 * index = 'index' indicates bold.
	 */
	public boolean isBold(String index)
	{
		boolean isBold = false;
		String style = getTextStyle(index);
		
		if (!style.equals(""))
		{
			if (style.toLowerCase().equals("themed"))
			{
				// TODO theme support
			}
			else
			{
				int value = Integer.parseInt(style);
				isBold = ((value & 1) == 1);
			}
		}
		
		return isBold;
	}

	/**
	 * Checks if the style property of the Char element of index = 'index' 
	 * indicates italic.<br/>
	 * This property may to be founded in the shape, master shape, stylesheet or
	 * default stylesheet.
	 * @param index Index of the Char element that contains the Style element.
	 * @return Returns <code>true</code> if the style property of the Char element of 
	 * index = 'index' indicates italic.
	 */
	public boolean isItalic(String index)
	{
		boolean isItalic = false;
		String style = getTextStyle(index);
		
		if (!style.equals(""))
		{
			if (style.toLowerCase().equals("themed"))
			{
				// TODO theme support
			}
			else
			{
				int value = Integer.parseInt(style);
				isItalic = ((value & 2) == 2);
			}
		}
		
		return isItalic;
	}

	/**
	 * Checks if the style property of the Char element of index = 'index' 
	 * indicates underline.<br/>
	 * This property may to be founded in the shape, master shape, stylesheet or
	 * default stylesheet.
	 * @param index Index of the Char element that contains the Style element.
	 * @return Returns <code>true</code> if the style property of the Char element of 
	 * index = 'index' indicates underline.
	 */
	public boolean isUnderline(String index)
	{
		boolean isUnderline = false;
		String style = getTextStyle(index);
		
		if (!style.equals(""))
		{
			if (style.toLowerCase().equals("themed"))
			{
				// TODO theme support
			}
			else
			{
				int value = Integer.parseInt(style);
				isUnderline = ((value & 4) == 4);
			}
		}
	
		return isUnderline;
	}

	/**
	 * Checks if the style property of the Char element of index = 'index'
	 * indicates small caps.<br/>
	 * This property may to be founded in the shape, master shape, stylesheet or
	 * default stylesheet.
	 * @param index Index of the Char element that contains the Style element.
	 * @return Returns <code>true</code> if the style property of the Char element of
	 * index = 'index' indicates small caps.
	 */
	public boolean isSmallCaps(String index)
	{
		boolean isSmallCaps = false;
		String style = getTextStyle(index);
		
		if (!style.equals(""))
		{
			if (style.toLowerCase().equals("themed"))
			{
				// TODO theme support
			}
			else
			{
				int value = Integer.parseInt(style);
				isSmallCaps = ((value & 8) == 8);
			}
		}
		
		return isSmallCaps;
	}

	public String getTextOpacity(String index)
	{
		Element colorTrans = getCellElement(mxVsdxConstants.COLOR_TRANS, index, mxVsdxConstants.CHARACTER);
		String trans = getValue(colorTrans, "0");
		String result = "1";
		
		if (trans != null && !trans.isEmpty())
		{
			double tmp = 1.0 - Double.valueOf(trans);
			result = String.valueOf(tmp);
		}
		
		return result;
	}

	/**
	 * Returns the actual text size defined by the Char element referenced in cp.<br/>
	 * This property may to be founded in the shape, master shape, stylesheet or
	 * default stylesheet.
	 * @param index Index of the Char element that contains the Size element.
	 * @return Returns the size of the font in pixels.
	 */
	public String getTextSize(String index)
	{
		Element sizeElem = getCellElement(mxVsdxConstants.SIZE, index, mxVsdxConstants.CHARACTER);
		double size = getScreenNumericalValue(sizeElem, 12);
		
		return Double.toString(Math.round(size * 100) / 100);
	}
	
	/**
	 * Returns the vertical align of the label.<br/>
	 * The property may to be defined in master shape or text stylesheet.<br/>
	 * @return Vertical align (bottom, middle and top)
	 */
	public String getAlignVertical()
	{
		String vertical = mxConstants.ALIGN_MIDDLE;

		int align = Integer.parseInt(getValue(this.getCellElement(mxVsdxConstants.VERTICAL_ALIGN), "1"));

		if (align == 0)
		{
			vertical = mxConstants.ALIGN_TOP;
		}
		else if (align == 2)
		{
			vertical = mxConstants.ALIGN_BOTTOM;
		}

		return vertical;
	}

	public mxVsdxGeometryList getGeomList() 
	{
		return geomList;
	}

	public double getLastX() {
		return lastX;
	}

	public double getLastY() {
		return lastY;
	}

	public double getLastMoveX() {
		return lastMoveX;
	}

	public double getLastMoveY() {
		return lastMoveY;
	}

	public double getLastKnot() {
		return lastKnot;
	}

	public void setLastX(double lastX) {
		this.lastX = lastX;
	}

	public void setLastY(double lastY) {
		this.lastY = lastY;
	}

	public void setLastMoveX(double lastMoveX) {
		this.lastMoveX = lastMoveX;
	}

	public void setLastMoveY(double lastMoveY) {
		this.lastMoveY = lastMoveY;
	}

	public void setLastKnot(double lastKnot) {
		this.lastKnot = lastKnot;
	}
}
