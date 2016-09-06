package com.mxgraph.io.vsdx;

import java.util.HashMap;
import java.util.List;
import org.w3c.dom.Element;
import org.w3c.dom.Node;

/**
 * This class allows get the text contained in a shape formated with tags HTML.<br/>
 * The properties referenced in the Text element are processed by this class.
 */
public class mxVsdxTextParser
{
	/**
	 * Shape that contains the text.
	 */
	VsdxShape shape;

	/**
	 * Master Shape of the shape.
	 */
	mxMasterShape masterShape;

	/**
	 * Style-sheet with the Text Style.
	 */
	mxStyleSheet styleSheet;

	/**
	 * Style-sheet with the default text style.
	 */
	mxStyleSheet defaultStyle;

	/**
	 * Last cp IX referenced in the Text Element.
	 */
	String cp = "";

	/**
	 * Last pp IX referenced in the Text Element.
	 */
	String pp = "";

	/**
	 * Last tp IX referenced in the Text Element.
	 */
	String tp = "";

	/**
	 * Last fld IX referenced in the Text Element.
	 */
	String fld = "";

	/**
	 * Creates a new instance of mxVdxTextParser.
	 * @param shape Shape that contains the text.
	 * @param masterShape Master Shape of the shape.
	 * @param styleSheet Style-sheet with the Text Style. 
	 */
	public mxVsdxTextParser(VsdxShape shape, mxMasterShape masterShape,	mxStyleSheet styleSheet, mxPropertiesManager pm)
	{
		this.shape = shape;
		this.masterShape = masterShape;
		this.styleSheet = styleSheet;
		this.defaultStyle = pm.getTextStyle();
	}

	/**
	 * Returns the text contained in the shape formated with tags html.<br/>
	 * @return Text content in html.
	 */
	public String getHtmlTextContent()
	{
		List<Node> child = null;
		boolean masterShapeOnly = false;
		String ret = "";
		child = shape.getTextChildren();

		if (child == null && masterShape != null)
		{
			child = masterShape.getTextChildren();
			masterShapeOnly = (child != null);
		}
		
		boolean first = true;
		
		if (child != null)
		{
			for (Node e : child)
			{
				if (e.getNodeName().equals("cp"))
				{
					Element elem = (Element) e;
					cp = elem.getAttribute("IX");
				}
				else if (e.getNodeName().equals("tp"))
				{
					Element elem = (Element) e;
					tp = elem.getAttribute("IX");
				}
				else if (e.getNodeName().equals("pp"))
				{
					Element elem = (Element) e;
					pp = elem.getAttribute("IX");
					
					if (first)
					{
						first = false;
					}
					else
					{
						ret += "</p>";
					}
					
					String para = "<p>";
					ret += getTextParagraphFormated(para);
				}
				else if (e.getNodeName().equals("fld"))
				{
					Element elem = (Element) e;
					fld = elem.getAttribute("IX");
					String text = elem.getTextContent();
					text = textToList(text, pp);
					text = text.replaceAll("\n", "<br/>");
					ret += getTextCharFormated(text);
				}
				else if (e.getNodeName().equals("#text"))
				{
					String text = e.getTextContent();
					
					// There's a case in master shapes where the text element has the raw value "N".
					// The source tool doesn't render this. Example is ALM_Information_flow.vdx, the two label
					// edges in the center
					if (!masterShapeOnly || !text.equals("N"))
					{
						text = textToList(text, pp);
						// It's HTML text, so escape it.
						text = text.replaceAll("&", "&amp;")
								.replaceAll("\"", "&quot;")
								.replaceAll("'", "&prime;")
								.replaceAll("<", "&lt;")
								.replaceAll(">", "&gt;")
								.replaceAll("\n", "<br/>");
						ret += getTextCharFormated(text);
					}
				}
			}
		}
		
		String end = first ? "" : "</p>";
		ret += end;
		
//		if (shape.isVertex())
//		{
//		ret = mxVdxUtils.surroundByTags(ret, "tr");
//		ret = mxVdxUtils.surroundByTags(ret, "table");
//			HashMap<String, String> styleMap = new HashMap<String, String>();
//			styleMap.put("width", "100%");
//			styleMap.put("height", "100%");
//			styleMap.put("max-width", shape.getDimensions().getX() * 0.71 + "px");
//			ret = insertAttributes(ret, styleMap);
//		}
		
		return ret;
	}

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
			String bullet = getBulletValue(pp);
			
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
	 * Returns the value of the Bullet element of the shape.<br/>
	 * This element may to be founded in the shape, master shape, style-sheet or
	 * default style-sheet.
	 * @param index Index of the Para element that contains the Bullet element.
	 * @return String value of the Bullet element.
	 */
	public String getBulletValue(String index)
	{
		String bullet = "0";
		
		if (shape.hasBullet(index))
		{
			bullet = shape.getBullet(index);
		}
		else if (masterShape != null && masterShape.hasBullet(index))
		{
			bullet = masterShape.getBullet(index);
		}
		else if (styleSheet != null && styleSheet.hasBullet(index))
		{
			bullet = styleSheet.getBullet(index);
		}
		else if (defaultStyle != null && defaultStyle.hasBullet(index))
		{
			bullet = defaultStyle.getBullet(index);
		}
		
		return bullet;
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

		styleMap.put("text-align", getHorAlign(pp));
		styleMap.put("margin-left", getIndLeft(pp));
		styleMap.put("margin-right", getIndRight(pp));
		styleMap.put("margin-top", getSpcBefore(pp) + "px");
		styleMap.put("margin-bottom", getSpcAfter(pp) + "px");
		styleMap.put("text-indent", getIndFirst(pp));
		styleMap.put("valign", getVerAlign());
		String spc = getSpcLine(pp);
		String spcNum = spc.replaceAll("[^\\d.]", "");
		String postFix = spc.substring(spcNum.length(),spc.length());
		double lineH = (Double.parseDouble(spcNum) / 0.71);
		spc = Double.toString(lineH);
		
		if (spc.contains("."))
		{
			spc = spc.substring(0, spc.lastIndexOf(".") + 3);
		}
		
		spc = spc + postFix;
		styleMap.put("line-height", spc);
		styleMap.put("direction", getTextDirection(pp));
		ret += insertAttributes(para, styleMap);
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
		String direction = "ltr";
		
		if (shape.hasFlags(index))
		{
			direction = shape.getFlags(index);
		}
		else if (masterShape != null && masterShape.hasFlags(index))
		{
			direction = masterShape.getFlags(index);
		}
		else if (styleSheet != null && styleSheet.hasFlags(index))
		{
			direction = styleSheet.getFlags(index);
		}
		else if (defaultStyle != null && defaultStyle.hasFlags(index))
		{
			direction = defaultStyle.getFlags(index);
		}
		
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
		double space = 0;
		
		if (shape.hasSpLine(index))
		{
			space = shape.getSpLine(index);
		}
		else if (masterShape != null && masterShape.hasSpLine(index))
		{
			space = masterShape.getSpLine(index);
		}
		else if (styleSheet != null && styleSheet.hasSpLine(index))
		{
			space = styleSheet.getSpLine(index);
		}
		else if (defaultStyle != null && defaultStyle.hasSpLine(index))
		{
			space = defaultStyle.getSpLine(index);
		}
		
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
		String ret = "0";

		if (shape.hasSpBefore(index))
		{
			ret = shape.getSpBefore(index);
		}
		else if (masterShape != null && masterShape.hasSpBefore(index))
		{
			ret = masterShape.getSpBefore(index);
		}
		else if (styleSheet != null && styleSheet.hasSpBefore(index))
		{
			ret = styleSheet.getSpBefore(index);
		}
		else if (defaultStyle != null && defaultStyle.hasSpBefore(index))
		{
			ret = defaultStyle.getSpBefore(index);
		}

		return ret;
	}

	/**
	 * Returns the space after a paragraph.<br/>
	 * This property may to be founded in the shape, master shape, stylesheet or
	 * default style-sheet.
	 * @param index Index of the Para element that contains the SpAfter element.
	 * @return The space after the paragraph in pixels.
	 */
	public String getSpcAfter(String index)
	{
		String ret = "0";

		if (shape.hasSpAfter(index))
		{
			ret = shape.getSpAfter(index);
		}
		else if (masterShape != null && masterShape.hasSpAfter(index))
		{
			ret = masterShape.getSpAfter(index);
		}
		else if (styleSheet != null && styleSheet.hasSpAfter(index))
		{
			ret = styleSheet.getSpAfter(index);
		}
		else if (defaultStyle != null && defaultStyle.hasSpAfter(index))
		{
			ret = defaultStyle.getSpAfter(index);
		}

		return ret;
	}

	/**
	 * Returns the indent to left in a paragraph.<br/>
	 * This property may to be founded in the shape, master shape, stylesheet or
	 * default stylesheet.
	 * @param index Index of the Para element that contains the IndLeft element.
	 * @return The indent to left in a paragraph in pixels.
	 */
	public String getIndLeft(String index)
	{
		String ret = "0";

		if (shape.hasIndentLeft(index))
		{
			ret = shape.getIndentLeft(index);
		}
		else if (masterShape != null && masterShape.hasIndentLeft(index))
		{
			ret = masterShape.getIndentLeft(index);
		}
		else if (styleSheet != null && styleSheet.hasIndentLeft(index))
		{
			ret = styleSheet.getIndentLeft(index);
		}
		else if (defaultStyle != null && defaultStyle.hasIndentLeft(index))
		{
			ret = defaultStyle.getIndentLeft(index);
		}

		return ret;
	}

	/**
	 * Returns the indent to right in a paragraph.<br/>
	 * This property may to be founded in the shape, master shape, stylesheet or
	 * default stylesheet.
	 * @param index Index of the Para element that contains the IndRight element.
	 * @return The indent to right in a paragraph in pixels.
	 */
	public String getIndRight(String index)
	{
		String ret = "0";

		if (shape.hasIndentRight(index))
		{
			ret = shape.getIndentRight(index);
		}
		else if (masterShape != null && masterShape.hasIndentRight(index))
		{
			ret = masterShape.getIndentRight(index);
		}
		else if (styleSheet != null && styleSheet.hasIndentRight(index))
		{
			ret = styleSheet.getIndentRight(index);
		}
		else if (defaultStyle != null && defaultStyle.hasIndentRight(index))
		{
			ret = defaultStyle.getIndentRight(index);
		}

		return ret;
	}

	/**
	 * Returns the indent of the first line in a paragraph.<br/>
	 * This property may to be founded in the shape, master shape, stylesheet or
	 * default stylesheet.
	 * @param index Index of the Para element that contains the IndFirst element.
	 * @return The indent of the first line in a paragraph in pixels.
	 */
	public String getIndFirst(String index)
	{
		String ret = "0";

		if (shape.hasIndentFirst(index))
		{
			ret = shape.getIndentFirst(index);
		}
		else if (masterShape != null && masterShape.hasIndentFirst(index))
		{
			ret = masterShape.getIndentFirst(index);
		}
		else if (styleSheet != null && styleSheet.hasIndentFirst(index))
		{
			ret = styleSheet.getIndentFirst(index);
		}
		else if (defaultStyle != null && defaultStyle.hasIndentFirst(index))
		{
			ret = defaultStyle.getIndentFirst(index);
		}
		
		return ret;
	}

	/**
	 * Return the value of the horizontal align.<br/>
	 * This property may to be founded in the shape, master shape, stylesheet or
	 * default stylesheet.
	 * @param index Index of the Para element that contains the HorzAlign element.
	 * @return The value of the horizontal align in a paragraph.
	 */
	public String getHorAlign(String index)
	{
		String ret = "center";
		int align = 0;
		
		if (shape.hasHorizontalAlign(index))
		{
			align = shape.getHorizontalAlign(index);
		}
		else if (masterShape != null && masterShape.hasHorizontalAlign(index))
		{
			align = masterShape.getHorizontalAlign(index);
		}
		else if (styleSheet != null && styleSheet.hasHorizontalAlign(index))
		{
			align = styleSheet.getHorizontalAlign(index);
		}
		else if (defaultStyle != null && defaultStyle.hasHorizontalAlign(index))
		{
			align = defaultStyle.getHorizontalAlign(index);
		}
		
		switch (align)
		{
			case 0:
				ret = "left";
				break;
			case 1:
				ret = "center";
				break;
			case 2:
				ret = "right";
				break;
			case 3:
				ret = "justify";
		}
		
		return ret;
	}

	/**
	 * Return the value of the vertical align.<br/>
	 * This property may to be founded in the shape, master shape, stylesheet or
	 * default stylesheet.
	 * @return The value of the vertical align.
	 */
	public String getVerAlign()
	{
		return shape.getAlignVertical();
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
	 * Returns the text formated according the properties in the last
	 * Char element referenced.
	 * @param text Text to be formated
	 * @return Formated text.
	 */
	public String getTextCharFormated(String text)
	{
		String ret = "";
		String color = "color:" + this.getTextColor(cp) + ";";
		String size = "font-size:" + (Double.parseDouble(this.getTextSize(cp)) / 0.71) + "px;";
		String font = "font-family:" + this.getTextFont(cp) + ";";
		String direction = "direction:" + this.getCharDirection(cp) + ";";
		String space = "letter-spacing:" + (Double.parseDouble(this.getCharSpace(cp)) / 0.71) + "px;";
		int pos = this.getPos(cp);
		boolean bold = this.isBold(cp);
		boolean italic = this.isItalic(cp);
		boolean underline = this.isUnderline(cp);
		boolean strike = this.isStrikeThru(cp);
		boolean smallCap = this.isSmallCaps(cp);
		int tCase = this.getCase(cp);

		if (tCase == 1)
		{
			text = text.toUpperCase();
		}
		else if (tCase == 2)
		{
			text = mxVsdxUtils.toInitialCapital(text);
		}
		
		if (smallCap)
		{
			text = mxVsdxUtils.toSmallCaps(text, this.getTextSize(cp));
		}

		if (pos == 1)
		{
			text = mxVsdxUtils.surroundByTags(text, "sup");
		}
		else if (pos == 2)
		{
			text = mxVsdxUtils.surroundByTags(text, "sub");
		}
		
		if (bold)
		{
			text = mxVsdxUtils.surroundByTags(text, "b");
		}
		
		if (italic)
		{
			text = mxVsdxUtils.surroundByTags(text, "i");
		}
		
		if (underline)
		{
			text = mxVsdxUtils.surroundByTags(text, "u");
		}
		
		if (strike)
		{
			text = mxVsdxUtils.surroundByTags(text, "s");
		}

		ret += "<font style=\"" + size + font + color + direction + space + "\">" + text + "</font>";
		return ret;
	}

	/**
	 * Returns the space between characters.<br/>
	 * This property may to be founded in the shape, master shape, stylesheet or
	 * default stylesheet.
	 * @param index Index of the Char element that contains the LetterSpace element.
	 * @return String representation of the space between characters in pixels.
	 */
	public String getCharSpace(String index)
	{
		String space = "0";
		
		if (shape.hasLetterSpace(index))
		{
			space = shape.getLetterSpace(index);
		}
		else if (masterShape != null && masterShape.hasLetterSpace(index))
		{
			space = masterShape.getLetterSpace(index);
		}
		else if (styleSheet != null && styleSheet.hasLetterSpace(index))
		{
			space = styleSheet.getLetterSpace(index);
		}
		else if (defaultStyle != null && defaultStyle.hasLetterSpace(index))
		{
			space = defaultStyle.getLetterSpace(index);
		}
		
		return space;
	}

	/**
	 * Returns the direction of the text. It may be right to left or left to right.<br/>
	 * This property may to be founded in the shape, master shape, stylesheet or
	 * default stylesheet.
	 * @param index Index of the Char element that contains the RTLText element.
	 * @return Direction of the text.
	 */
	public String getCharDirection(String index)
	{
		String direction = "ltr";
		
		if (shape.hasRTLText(index))
		{
			direction = shape.getRTLText(index);
		}
		else if (masterShape != null && masterShape.hasRTLText(index))
		{
			direction = masterShape.getRTLText(index);
		}
		else if (styleSheet != null && styleSheet.hasRTLText(index))
		{
			direction = styleSheet.getRTLText(index);
		}
		else if (defaultStyle != null && defaultStyle.hasRTLText(index))
		{
			direction = defaultStyle.getRTLText(index);
		}
		
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
	 * Returns the value of the case property.<br/>
	 * This property may to be founded in the shape, master shape, stylesheet or
	 * default stylesheet.
	 * @param index Index of the Char element that contains the Case element.
	 * @return  Value of the case property.
	 */
	public int getCase(String index)
	{
		int tCase = 0;
		
		if (shape.hasTextStyle(index))
		{
			tCase = shape.getTextCase(index);
		}
		else if (masterShape != null && masterShape.hasTextCase(index))
		{
			tCase = masterShape.getTextCase(index);
		}
		else if (styleSheet != null && styleSheet.hasTextCase(index))
		{
			tCase = styleSheet.getTextCase(index);
		}
		else if (defaultStyle != null && defaultStyle.hasTextCase(index))
		{
			tCase = defaultStyle.getTextCase(index);
		}
		
		return tCase;
	}

	/**
	 * Returns the Position of the text(If is superscript, subscript or normal text).<br/>
	 * This property may to be founded in the shape, master shape, stylesheet or
	 * default stylesheet.
	 * @param index Index of the Char element that contains the Pos element.
	 * @return Value of the Pos element.
	 */
	public int getPos(String index)
	{
		int pos = 0;
		
		if (shape.hasTextPos(index))
		{
			pos = shape.getTextPos(index);
		}
		else if (masterShape != null && masterShape.hasTextPos(index))
		{
			pos = masterShape.getTextPos(index);
		}
		else if (styleSheet != null && styleSheet.hasTextPos(index))
		{
			pos = styleSheet.getTextPos(index);
		}
		else if (defaultStyle != null && defaultStyle.hasTextPos(index))
		{
			pos = defaultStyle.getTextPos(index);
		}
		
		return pos;
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
		String style = "";
		
		if (shape.hasTextStyle(index))
		{
			style = shape.getTextStyle(index);
		}
		else if (masterShape != null && masterShape.hasTextStyle(index))
		{
			style = masterShape.getTextStyle(index);
		}
		else if (styleSheet != null && styleSheet.hasTextStyle(index))
		{
			style = styleSheet.getTextStyle(index);
		}
		else if (defaultStyle != null && defaultStyle.hasTextStyle(index))
		{
			style = defaultStyle.getTextStyle(index);
		}
		
		if (!style.equals(""))
		{
			int value = Integer.parseInt(style);
			isBold = ((value & 1) == 1);
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
		String style = "";
		
		if (shape.hasTextStyle(index))
		{
			style = shape.getTextStyle(index);
		}
		else if (masterShape != null && masterShape.hasTextStyle(index))
		{
			style = masterShape.getTextStyle(index);
		}
		else if (styleSheet != null && styleSheet.hasTextStyle(index))
		{
			style = styleSheet.getTextStyle(index);
		}
		else if (defaultStyle != null && defaultStyle.hasTextStyle(index))
		{
			style = defaultStyle.getTextStyle(index);
		}
		
		if (!style.equals(""))
		{
			int value = Integer.parseInt(style);
			isItalic = ((value & 2) == 2);
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
		String style = "";
		
		if (shape.hasTextStyle(index))
		{
			style = shape.getTextStyle(index);
		}
		else if (masterShape != null && masterShape.hasTextStyle(index))
		{
			style = masterShape.getTextStyle(index);
		}
		else if (styleSheet != null && styleSheet.hasTextStyle(index))
		{
			style = styleSheet.getTextStyle(index);
		}
		else if (defaultStyle != null && defaultStyle.hasTextStyle(index))
		{
			style = defaultStyle.getTextStyle(index);
		}
		
		if (!style.equals(""))
		{
			int value = Integer.parseInt(style);
			isUnderline = ((value & 4) == 4);
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
		String style = "";
		
		if (shape.hasTextStyle(index))
		{
			style = shape.getTextStyle(index);
		}
		else if (masterShape != null && masterShape.hasTextStyle(index))
		{
			style = masterShape.getTextStyle(index);
		}
		else if (styleSheet != null && styleSheet.hasTextStyle(index))
		{
			style = styleSheet.getTextStyle(index);
		}
		else if (defaultStyle != null && defaultStyle.hasTextStyle(index))
		{
			style = defaultStyle.getTextStyle(index);
		}
		
		if (!style.equals(""))
		{
			int value = Integer.parseInt(style);
			isSmallCaps = ((value & 8) == 8);
		}
		
		return isSmallCaps;
	}

	/**
	 * Checks if the strikethru property of the Char element of index = 'index'
	 * indicates true.<br/>
	 * This property may to be founded in the shape, master shape, stylesheet or
	 * default stylesheet.
	 * @param index Index of the Char element that contains the StrikeThru element.
	 * @return Returns <code>true</code> if the strikethru property of the Char
	 * element of index = 'index' indicates true.
	 */
	public boolean isStrikeThru(String index)
	{
		boolean isStrikeThru = false;
		
		if (shape.hasTextStrike(index))
		{
			isStrikeThru = shape.getTextStrike(index);
		}
		else if (masterShape != null && masterShape.hasTextStrike(index))
		{
			isStrikeThru = masterShape.getTextStrike(index);
		}
		else if (styleSheet != null && styleSheet.hasTextStrike(index))
		{
			isStrikeThru = styleSheet.getTextStrike(index);
		}
		else if (defaultStyle != null && defaultStyle.hasTextStrike(index))
		{
			isStrikeThru = defaultStyle.getTextStrike(index);
		}
		
		return isStrikeThru;
	}

	/**
	 * Returns the actual font defined by the Char element referenced in cp.<br/>
	 * This property may to be founded in the shape, master shape, stylesheet or
	 * default stylesheet.
	 * @param index Index of the Char element that contains the Font element.
	 * @return Returns the name of the font.
	 */
	public String getTextFont(String index)
	{
		String font = "";
		
		if (shape.hasTextFont(index))
		{
			font = shape.getTextFont(index);
		}
		else if (masterShape != null && masterShape.hasTextFont(index))
		{
			font = masterShape.getTextFont(index);
		}
		else if (styleSheet != null && styleSheet.hasTextFont(index))
		{
			font = styleSheet.getTextFont(index);
		}
		else if (defaultStyle != null && defaultStyle.hasTextFont(index))
		{
			font = defaultStyle.getTextFont(index);
		}
		
		return font;
	}

	/**
	 * Returns the actual text size defined by the Char element referenced in cp.<br/>
	 * This property may to be founded in the shape, master shape, stylesheet or
	 * default stylesheet.
	 * @param index Index of the Char element that contains the Size element.
	 * @return Returns the size of the font in pixels.
	 */
	private String getTextSize(String index)
	{
		String size = "12";
		
		if (shape.hasTextSize(index))
		{
			size = shape.getTextSize(index);
		}
		else if (masterShape != null && masterShape.hasTextSize(index))
		{
			size = masterShape.getTextSize(index);
		}
		else if (styleSheet != null && styleSheet.hasTextSize(index))
		{
			size = styleSheet.getTextSize(index);
		}
		else if (defaultStyle != null && defaultStyle.hasTextSize(index))
		{
			size = defaultStyle.getTextSize(index);
		}
		
		double s = Double.valueOf(size) * 0.71;
		
		return String.valueOf(s);
	}

	/**
	* Returns the actual color defined by the Char element referenced in cp.<br/>
	* This property may to be founded in the shape, master shape, stylesheet or
	* default stylesheet.
	* @param index Index of the Char element that contains the Color element.
	* @return Returns the color of the text in hexadecimal.
	*/
	private String getTextColor(String index)
	{
		String color = "#000000";
		
		if (shape.hasTextColor(index))
		{
			color = shape.getTextColor(index);
		}
		else if (masterShape != null && masterShape.hasTextColor(index))
		{
			color = masterShape.getTextColor(index);
		}
		else if (styleSheet != null && styleSheet.hasTextColor(index))
		{
			color = styleSheet.getTextColor(index);
		}
		else if (defaultStyle != null && defaultStyle.hasTextColor(index))
		{
			color = defaultStyle.getTextColor(index);
		}
		
		return color;
	}
}
