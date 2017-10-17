package com.mxgraph.io.vsdx;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

import org.w3c.dom.Element;
import org.w3c.dom.Node;

import com.mxgraph.io.vsdx.theme.Color;
import com.mxgraph.io.vsdx.theme.FillStyle;
import com.mxgraph.io.vsdx.theme.FillStyleFactory;
import com.mxgraph.io.vsdx.theme.GradFill;
import com.mxgraph.io.vsdx.theme.HSLColor;
import com.mxgraph.io.vsdx.theme.LineStyle;
import com.mxgraph.io.vsdx.theme.LineStyleExt;
import com.mxgraph.io.vsdx.theme.OoxmlColor;
import com.mxgraph.io.vsdx.theme.OoxmlColorFactory;
import com.mxgraph.io.vsdx.theme.QuickStyleVals;

//Holds office 2013 theme data which applies to all office file formats
public class mxVsdxTheme 
{
	//Theme names to ID mapping
	private static Map<String, Integer> themesIds = new HashMap<>();
	
	//Theme index can be found deep inside the theme file, so this is faster for standard 2013 format
	static 
	{
		themesIds.put("Office", 33);
		themesIds.put("Linear", 34);
		themesIds.put("Zephyr", 35);
		themesIds.put("Integral", 36);
		themesIds.put("Simple", 37);
		themesIds.put("Whisp", 38);
		themesIds.put("Daybreak", 39);
		themesIds.put("Parallel", 40);
		themesIds.put("Sequence", 41);
		themesIds.put("Slice", 42);
		themesIds.put("Ion", 43);
		themesIds.put("Retrospect", 44);
		themesIds.put("Organic", 45);
		themesIds.put("Bubble", 46);
		themesIds.put("Clouds", 47);
		themesIds.put("Gemstone", 48);
		themesIds.put("Lines", 49);
		themesIds.put("Facet", 50);
		themesIds.put("Prominence", 51);
		themesIds.put("Smoke", 52);
		themesIds.put("Radiance", 53);
		themesIds.put("Shade", 54);
		themesIds.put("Pencil", 55);
		themesIds.put("Pen", 56);
		themesIds.put("Marker", 57);
		themesIds.put("Whiteboard", 58);
	}
	
	//color id to color name
	private static Map<Integer, String> colorIds = new HashMap<>();
	
	//https://msdn.microsoft.com/en-us/library/hh661351%28v=office.12%29.aspx
	//There are non standard values of 200 -> 206 also which are handled the same as 100 -> 106
	static
	{
		colorIds.put(0, "dk1");
		colorIds.put(1, "lt1");
		colorIds.put(2, "accent1");
		colorIds.put(3, "accent2");
		colorIds.put(4, "accent3");
		colorIds.put(5, "accent4");
		colorIds.put(6, "accent5");
		colorIds.put(7, "accent6");
	}
	
	private Element theme;
	
	private int themeIndex = -1;
	
	private int themeVariant = 0;
	
	//colors handling
	private Map<String, OoxmlColor> baseColors = new HashMap<>();
	
	//Dynamic background color (index 8)
	private OoxmlColor bkgndColor;
	
	//Variant colors
	private OoxmlColor[][] variantsColors = new OoxmlColor[4][7];
	
	private boolean[] isMonotoneVariant = new boolean[4];
	
	private Color defaultClr = new Color(255, 255, 255);
	private Color defaultLineClr = new Color(0, 0, 0);
	
	private LineStyle defaultLineStyle = new LineStyle();
	
	//fill styles
	private ArrayList<FillStyle> fillStyles = new ArrayList<>(6);

	//connector fill styles
	//TODO what is the use of it?
	private ArrayList<FillStyle> connFillStyles = new ArrayList<>(6);

	//line styles
	private ArrayList<LineStyle> lineStyles = new ArrayList<>(6);
	
	//cpnector line styles
	private ArrayList<LineStyle> connLineStyles = new ArrayList<>(6);

	//line styles extensions
	private ArrayList<LineStyleExt> lineStylesExt = new ArrayList<>(7);
	
	//connector line styles extensions
	private ArrayList<LineStyleExt> connLineStylesExt = new ArrayList<>(7);
	
	//connector font color & styles
	private ArrayList<OoxmlColor> connFontColors = new ArrayList<>(6);
	private ArrayList<Integer> connFontStyles = new ArrayList<>(6);
	
	//font color & styles
	private ArrayList<OoxmlColor> fontColors = new ArrayList<>(6);
	private ArrayList<Integer> fontStyles = new ArrayList<>(6);
	
	private int[] variantEmbellishment = new int[4];
	private int[][] variantFillIdx = new int[4][4];
	private int[][] variantLineIdx = new int[4][4];
	private int[][] variantEffectIdx = new int[4][4];
	private int[][] variantFontIdx = new int[4][4];
	
	private boolean isProcessed = false;
	
	//flag to indicate that some parts of the theme has different name
	private boolean isPure = true;
	private String name;
	
	public mxVsdxTheme(Element theme) 
	{
		this.theme = theme;
		this.name = theme.getAttribute("name");
		
		Integer themeId = themesIds.get(this.name);
		
		if (themeId != null) 
		{
			themeIndex = themeId;
		}
	}
	
	public int getThemeIndex() 
	{
		return themeIndex;
	}
	
	public void setVariant(int variant) 
	{
		themeVariant = variant;
	}
	
	public boolean isPure()
	{
		return isPure;
	}
	
	public void processTheme() 
	{
		if (isProcessed) return;
		
		try
		{
			Node child = theme.getFirstChild();
			
			while (child != null)
			{
				if (child instanceof Element && ((Element)child).getNodeName().equals("a:themeElements"))
				{
					Node child2 = child.getFirstChild();
					while (child2 != null)
					{
						if (child2 instanceof Element)
						{
							Element elem = (Element)child2;
							String nodeName = elem.getNodeName();
							if (nodeName.equals("a:clrScheme")) 
							{
								if (!this.name.equals(elem.getAttribute("name")))
								{
									isPure = false;
								}
								//Process the color scheme
								processColors(elem);
							}
							else if (nodeName.equals("a:fontScheme")) 
							{
								if (!this.name.equals(elem.getAttribute("name")))
								{
									isPure = false;
								}
								//Process the font scheme
								processFonts(elem);
							}
							else if (nodeName.equals("a:fmtScheme")) 
							{
								if (!this.name.equals(elem.getAttribute("name")))
								{
									isPure = false;
								}
								//Process the format scheme
								processFormats(elem);
							}
							else if (nodeName.equals("a:extLst"))
							{
								//Process the extra list
								processExtras(elem);							
							}
						}
						child2 = child2.getNextSibling();
					}
				}
				child = child.getNextSibling();
			}
		}
		catch (Exception e)
		{
			//cannot parse the theme format, probably it has non-standard format
			e.printStackTrace();
		}
		isProcessed = true;
	}
	
	private void processExtras(Element element) 
	{
		ArrayList<Element> exts = mxVsdxUtils.getDirectChildElements(element);
		
		for (Element ext : exts)
		{
			Element vt = mxVsdxUtils.getDirectFirstChildElement(ext);
			switch (vt.getNodeName())
			{
				case "vt:fmtConnectorScheme":
					if (!this.name.equals(vt.getAttribute("name")))
					{
						isPure = false;
					}
					ArrayList<Element> connSchemes = mxVsdxUtils.getDirectChildElements(vt);
					
					for (Element scheme : connSchemes)
					{
						String name = scheme.getNodeName();
						
						switch (name)
						{
							case "a:fillStyleLst":
								ArrayList<Element> fillStyleElems = mxVsdxUtils.getDirectChildElements(scheme);
								for (Element fillStyle : fillStyleElems)
								{
									connFillStyles.add(FillStyleFactory.getFillStyle(fillStyle));
								}
							break;
							case "a:lnStyleLst":
								ArrayList<Element> lineStyleElems = mxVsdxUtils.getDirectChildElements(scheme);
								for (Element lineStyle : lineStyleElems)
								{
									connLineStyles.add(new LineStyle(lineStyle));
								}
							break;
						}
					}
				break;
				case "vt:lineStyles":
					ArrayList<Element> styles = mxVsdxUtils.getDirectChildElements(vt);
					
					for (Element style : styles)
					{
						String name = style.getNodeName();
						
						switch (name)
						{
							case "vt:fmtConnectorSchemeLineStyles":
								ArrayList<Element> connStylesElems = mxVsdxUtils.getDirectChildElements(style);
								for (Element connStyle : connStylesElems)
								{
									connLineStylesExt.add(new LineStyleExt(connStyle));
								}
							break;
							case "vt:fmtSchemeLineStyles":
								ArrayList<Element> schemeStyleElems = mxVsdxUtils.getDirectChildElements(style);
								for (Element schemeStyle : schemeStyleElems)
								{
									lineStylesExt.add(new LineStyleExt(schemeStyle));
								}
							break;
						}
					}
				break;
				case "vt:fontStylesGroup":
					ArrayList<Element> fontStyleElems = mxVsdxUtils.getDirectChildElements(vt);
					
					for (Element fontStyle : fontStyleElems)
					{
						String name = fontStyle.getNodeName();
						
						switch (name)
						{
							case "vt:connectorFontStyles":
								fillFontStyles(fontStyle, connFontColors, connFontStyles);
							break;
							case "vt:fontStyles":
								fillFontStyles(fontStyle, fontColors, fontStyles);
							break;
						}
					}
				break;
				case "vt:variationStyleSchemeLst":
					ArrayList<Element> varStyleSchemes = mxVsdxUtils.getDirectChildElements(vt);
					
					int i=0;
					for (Element varStyleScheme : varStyleSchemes)
					{
						variantEmbellishment[i] = mxVsdxUtils.getIntAttr(varStyleScheme, "embellishment");
						
						ArrayList<Element> varStyles = mxVsdxUtils.getDirectChildElements(varStyleScheme);
						int j = 0;
						for (Element varStyle : varStyles)
						{
							variantFillIdx[i][j] = mxVsdxUtils.getIntAttr(varStyle, "fillIdx");
							variantLineIdx[i][j] = mxVsdxUtils.getIntAttr(varStyle, "lineIdx");
							variantEffectIdx[i][j] = mxVsdxUtils.getIntAttr(varStyle, "effectIdx");
							variantFontIdx[i][j] = mxVsdxUtils.getIntAttr(varStyle, "fontIdx");
							j++;
						}
						i++;
					}
				break;
			}
		}
	}

	private void fillFontStyles(Element fontStyle, ArrayList<OoxmlColor> fontColors, ArrayList<Integer> fontStyles) {
		ArrayList<Element> fontProps = mxVsdxUtils.getDirectChildElements(fontStyle);
		
		for (Element fontProp : fontProps)
		{
			fontStyles.add(mxVsdxUtils.getIntAttr(fontProp, "style"));
			
			Element color = mxVsdxUtils.getDirectFirstChildElement(fontProp);
			if (color != null)
				fontColors.add(
						OoxmlColorFactory.getOoxmlColor(
								mxVsdxUtils.getDirectFirstChildElement(color)));
		}
	}

	private void processFormats(Element element) 
	{
		ArrayList<Element> styles = mxVsdxUtils.getDirectChildElements(element);
		for (Element style : styles)
		{
			String name = style.getNodeName();
			switch (name)
			{
				case "a:fillStyleLst":
					ArrayList<Element> fillStyleElems = mxVsdxUtils.getDirectChildElements(style);
					for (Element fillStyle : fillStyleElems)
					{
						fillStyles.add(FillStyleFactory.getFillStyle(fillStyle));
					}
				break;
				case "a:lnStyleLst":
					ArrayList<Element> lineStyleElems = mxVsdxUtils.getDirectChildElements(style);
					for (Element lineStyle : lineStyleElems)
					{
						lineStyles.add(new LineStyle(lineStyle));
					}					
				break;
				case "a:effectStyleLst":
					//TODO effects most probably are not used by vsdx
				break;
				case "a:bgFillStyleLst":
					//TODO background effects most probably are not used by vsdx
				break;
			}
		}
	}

	private void processFonts(Element element) {
		// TODO Fonts has only the name of the font for each language. It looks not important
	}

	private void processColors(Element element) 
	{
		Node child = element.getFirstChild();
		
		while (child != null)
		{
			if (child instanceof Element)
			{
				Element elem = (Element)child;
				String nodeName = elem.getNodeName();
				ArrayList<Element> children = mxVsdxUtils.getDirectChildElements(elem);
				if (nodeName.equals("a:extLst"))
				{
					if (children.size() == 3) //the format has three a:ext nodes
					{
						if (themeIndex < 0)
						{
							extractThemeIndex(children.get(0));
						}
						addBkgndColor(children.get(1));
						addVariantColors(children.get(2));
					}
				} 
				else 
				{
					String clrName = nodeName.substring(2);
					
					if (children.size() > 0)
					{
						addBasicColor(clrName, children.get(0));
					}
				}
			}
			child = child.getNextSibling();
		}
	}

	private void addVariantColors(Element element) 
	{
		Element parent = mxVsdxUtils.getDirectFirstChildElement(element);
		
		if (parent != null)
		{
			ArrayList<Element> variants = mxVsdxUtils.getDirectChildElements(parent);
			int i = 0;
			for (Element variant : variants)
			{
				addVariantColorsSet(i++, variant);
			}
		}
	}

	private void addVariantColorsSet(int index, Element variant) 
	{
		ArrayList<Element> colors = mxVsdxUtils.getDirectChildElements(variant);
		
		isMonotoneVariant[index] = variant.hasAttribute("monotone");
		
		for (Element color : colors)
		{
			String name = color.getNodeName();
			switch (name)
			{
				case "vt:varColor1":
					variantsColors[index][0] = OoxmlColorFactory.getOoxmlColor(
							mxVsdxUtils.getDirectFirstChildElement(color));
				break;
				case "vt:varColor2":
					variantsColors[index][1] = OoxmlColorFactory.getOoxmlColor(
							mxVsdxUtils.getDirectFirstChildElement(color));
				break;
				case "vt:varColor3":
					variantsColors[index][2] = OoxmlColorFactory.getOoxmlColor(
							mxVsdxUtils.getDirectFirstChildElement(color));
				break;
				case "vt:varColor4":
					variantsColors[index][3] = OoxmlColorFactory.getOoxmlColor(
							mxVsdxUtils.getDirectFirstChildElement(color));
				break;
				case "vt:varColor5":
					variantsColors[index][4] = OoxmlColorFactory.getOoxmlColor(
							mxVsdxUtils.getDirectFirstChildElement(color));
				break;
				case "vt:varColor6":
					variantsColors[index][5] = OoxmlColorFactory.getOoxmlColor(
							mxVsdxUtils.getDirectFirstChildElement(color));
				break;
				case "vt:varColor7":
					variantsColors[index][6] = OoxmlColorFactory.getOoxmlColor(
							mxVsdxUtils.getDirectFirstChildElement(color));
				break;
			}
		}		
	}

	private void addBkgndColor(Element element) 
	{
		Element elem = mxVsdxUtils.getDirectFirstChildElement(element);
		
		if (elem != null)
		{
			bkgndColor = OoxmlColorFactory.getOoxmlColor(mxVsdxUtils.getDirectFirstChildElement(elem));
		}
	}

	private void extractThemeIndex(Element element) 
	{
		Element elem = mxVsdxUtils.getDirectFirstChildElement(element);
		
		if (elem != null)
		{
			themeIndex = Integer.parseInt(elem.getAttribute("schemeEnum"));
		}
	}

	private void addBasicColor(String clrName, Element element) 
	{
		baseColors.put(clrName, OoxmlColorFactory.getOoxmlColor(element));
	}

	public Color getSchemeColor(String val) 
	{
		processTheme();
		
		OoxmlColor color = baseColors.get(val);
		
		return color != null? color.getColor(this) : defaultClr;
	}
	
	//	QuickStyleFillColor
	public Color getStyleColor(int styleColor) 
	{
		processTheme();
		
		if (styleColor < 8)
		{
			OoxmlColor color = baseColors.get(colorIds.get(styleColor));
			if (color != null)
			{
				return color.getColor(this);
			}
		}
		else if (styleColor == 8)
		{
			if (bkgndColor != null)
			{
				return bkgndColor.getColor(this);
			}
		}
		else
		{
			OoxmlColor color = null;
			int clrIndex = 0;
			
			if (styleColor >= 200) //200-206
			{
				clrIndex = styleColor - 200; 
			}
			else if (styleColor >= 100) //100-106
			{
				clrIndex = styleColor - 100;
			}
			if (clrIndex >= 0 && clrIndex <= 6) //0 - 6
			{
				color = variantsColors[themeVariant][clrIndex];
			}
			
			if (color != null)
			{
				return color.getColor(this);
			}
		}
		return defaultClr;
	}

	
	public Color getFillGraientColor(QuickStyleVals quickStyleVals)
	{
		return getFillColor(quickStyleVals, true);
	}
	
	public Color getFillColor(QuickStyleVals quickStyleVals)
	{
		return getFillColor(quickStyleVals, false);
	}

	//Get fill color based on QuickStyleFillColor & QuickStyleFillMatrix
	private Color getFillColor(QuickStyleVals quickStyleVals, boolean getGradient)
	{
		processTheme();
		
		int fillColorStyle = quickStyleVals.getQuickStyleFillColor();
		FillStyle fillStyle = null;
		switch (quickStyleVals.getQuickStyleFillMatrix())
		{
			case 1:
			case 2:
			case 3:
			case 4:
			case 5:
			case 6:
				fillStyle = fillStyles.get(quickStyleVals.getQuickStyleFillMatrix() - 1);
			break;
			case 100:
			case 101:
			case 102:
			case 103:
				if (isMonotoneVariant[themeVariant]) fillColorStyle = 100;
				
				int index = quickStyleVals.getQuickStyleFillMatrix() - 100;
				//get style index of variants
				fillStyle = fillStyles.get(variantFillIdx[themeVariant][index] - 1);
			break;
		}
		
		Color retColor;
		if (fillStyle != null)
		{
			if (getGradient)
			{
				retColor = (fillStyle instanceof GradFill)? fillStyle.applyStyle(fillColorStyle, this).getGradientClr() : null;
			}
			else
			{
				retColor = fillStyle.applyStyle(fillColorStyle, this);
			}
		}
		else
		{
			if (getGradient)
			{
				retColor = null;
			}
			else
			{
				retColor = getStyleColor(fillColorStyle);
			}
		}
		
		int styleVariation = quickStyleVals.getQuickStyleVariation();
		
		//TODO using the line color does not cover all the cases but works with most of the sample files
		if (retColor != null && (styleVariation & 8) > 0)
		{
			retColor = getLineColor(quickStyleVals);
		}
		
		return retColor;
	}
	
	//Get line style based on QuickStyleLineMatrix
	private LineStyle getLineStyle(int quickStyleLineMatrix, ArrayList<LineStyle> lineStyles)
	{
		processTheme();
		
		LineStyle lineStyle = null;
		switch (quickStyleLineMatrix)
		{
			case 1:
			case 2:
			case 3:
			case 4:
			case 5:
			case 6:
				lineStyle = lineStyles.get(quickStyleLineMatrix - 1);
			break;
			case 100:
			case 101:
			case 102:
			case 103:
				int index = quickStyleLineMatrix - 100;
				//get style index of variants
				//Edges should not has these values
				if (lineStyles == this.lineStyles)
				{
					lineStyle = this.lineStyles.get(variantLineIdx[themeVariant][index] - 1);
				}
				else
				{
					lineStyle = defaultLineStyle;
				}
			break;
		}
			
		return lineStyle;
	}

	private LineStyleExt getLineStyleExt(int quickStyleLineMatrix, ArrayList<LineStyleExt> lineStylesExt) 
	{
		processTheme();
		
		LineStyleExt lineStyleExt = null;
		switch (quickStyleLineMatrix)
		{
			case 0:	
			case 1:
			case 2:
			case 3:
			case 4:
			case 5:
			case 6:
				lineStyleExt = lineStylesExt.get(quickStyleLineMatrix);
			break;
		}
			
		return lineStyleExt;
	}
	
	//Get line color based on QuickStyleLineColor & QuickStyleLineMatrix
	private Color getLineColor(QuickStyleVals quickStyleVals, ArrayList<LineStyle> lineStyles)
	{
		processTheme();
		
		int lineColorStyle = quickStyleVals.getQuickStyleLineColor();
		LineStyle lineStyle = getLineStyle(quickStyleVals.getQuickStyleLineMatrix(), lineStyles);
		switch (quickStyleVals.getQuickStyleLineMatrix())
		{
			case 100:
			case 101:
			case 102:
			case 103:
				if (isMonotoneVariant[themeVariant]) lineColorStyle = 100;
			break;
		}
		
		Color lineClr;
		
		if (lineStyle != null)
		{
			lineClr = lineStyle.getLineColor(lineColorStyle, this);
		}
		else
		{
			lineClr = getStyleColor(lineColorStyle);
		}
		
		int styleVariation = quickStyleVals.getQuickStyleVariation();
		
		//TODO using the fill color does not cover all the cases but works with most of the sample files
		if ((styleVariation & 4) > 0)
		{
			lineClr = getFillColor(quickStyleVals);
		}
		return lineClr;
	}

	//Get line color based on QuickStyleLineColor & QuickStyleLineMatrix
	public Color getLineColor(QuickStyleVals quickStyleVals)
	{
		return getLineColor(quickStyleVals, lineStyles);
	}
	
	//Get connection line color based on QuickStyleLineColor & QuickStyleLineMatrix
	public Color getConnLineColor(QuickStyleVals quickStyleVals)
	{
		return getLineColor(quickStyleVals, connLineStyles);
	}

	
	public Color getDefaultLineClr() 
	{
		return defaultLineClr;
	}

	private boolean isLineDashed(QuickStyleVals quickStyleVals, ArrayList<LineStyleExt> lineStylesExt, ArrayList<LineStyle> lineStyles) 
	{
		LineStyleExt lineStyleExt = getLineStyleExt(quickStyleVals.getQuickStyleLineMatrix(), lineStylesExt);
		
		if (lineStyleExt != null)
		{
			return lineStyleExt.isDashed();
		}
		else
		{
			LineStyle lineStyle = getLineStyle(quickStyleVals.getQuickStyleLineMatrix(), lineStyles);
			return lineStyle != null? lineStyle.isDashed() : false;			
		}
	}

	public boolean isLineDashed(QuickStyleVals quickStyleVals)
	{
		return isLineDashed(quickStyleVals, lineStylesExt, lineStyles);
	}
	
	public boolean isConnLineDashed(QuickStyleVals quickStyleVals) 
	{
		return isLineDashed(quickStyleVals, connLineStylesExt, connLineStyles);
	}

	private ArrayList<Double> getLineDashPattern(QuickStyleVals quickStyleVals, ArrayList<LineStyleExt> lineStylesExt, ArrayList<LineStyle> lineStyles) 
	{
		LineStyleExt lineStyleExt = getLineStyleExt(quickStyleVals.getQuickStyleLineMatrix(), lineStylesExt);
		
		if (lineStyleExt != null)
		{
			return lineStyleExt.getLineDashPattern();
		}
		else
		{
			LineStyle lineStyle = getLineStyle(quickStyleVals.getQuickStyleLineMatrix(), lineStyles);
			return lineStyle != null? lineStyle.getLineDashPattern() : null;
		}
	}

	public ArrayList<Double> getLineDashPattern(QuickStyleVals quickStyleVals) 
	{
		return getLineDashPattern(quickStyleVals, lineStylesExt, lineStyles);
	}
	
	public ArrayList<Double> getConnLineDashPattern(QuickStyleVals quickStyleVals) 
	{
		return getLineDashPattern(quickStyleVals, connLineStylesExt, connLineStyles);
	}

	private int getArrowSize(QuickStyleVals quickStyleVals, boolean isStart, ArrayList<LineStyleExt> lineStylesExt, ArrayList<LineStyle> lineStyles) 
	{
		LineStyleExt lineStyleExt = getLineStyleExt(quickStyleVals.getQuickStyleLineMatrix(), lineStylesExt);
		
		if (lineStyleExt != null)
		{
			return isStart? lineStyleExt.getStartSize() : lineStyleExt.getEndSize();
		}
		else
		{
			LineStyle lineStyle = getLineStyle(quickStyleVals.getQuickStyleLineMatrix(), lineStyles);
			return lineStyle != null? (isStart? lineStyle.getStartSize() : lineStyle.getEndSize()) : 4;
		}
	}

	public int getStartSize(QuickStyleVals quickStyleVals) 
	{
		return getArrowSize(quickStyleVals, true, lineStylesExt, lineStyles);
	}
	
	public int getConnStartSize(QuickStyleVals quickStyleVals) 
	{
		return getArrowSize(quickStyleVals, true, connLineStylesExt, connLineStyles);
	}
	
	public int getEndSize(QuickStyleVals quickStyleVals) 
	{
		return getArrowSize(quickStyleVals, false, lineStylesExt, lineStyles);
	}
	
	public int getConnEndSize(QuickStyleVals quickStyleVals) 
	{
		return getArrowSize(quickStyleVals, false, connLineStylesExt, connLineStyles);
	}
	
	//Get font color based on QuickStyleFontColor & QuickStyleFontMatrix
	private Color getFontColor(QuickStyleVals quickStyleVals, ArrayList<OoxmlColor> fontColors)
	{
		processTheme();
		
		int fontColorStyle = quickStyleVals.getQuickStyleFontColor();
		OoxmlColor fontColor = null;
		switch (quickStyleVals.getQuickStyleFontMatrix())
		{
			case 1:
			case 2:
			case 3:
			case 4:
			case 5:
			case 6:
				fontColor = fontColors.get(quickStyleVals.getQuickStyleFontMatrix() - 1);
			break;
			case 100:
			case 101:
			case 102:
			case 103:
				if (isMonotoneVariant[themeVariant]) fontColorStyle = 100;
				
				int index = quickStyleVals.getQuickStyleFontMatrix() - 100;
				//get style index of variants
				//If an edge has a non-standard value, use the dark color
				if (fontColors != this.fontColors)
				{
					fontColor = this.baseColors.get("dk1");
				}
				else
				{
					fontColor = fontColors.get(variantFontIdx[themeVariant][index] - 1);
				}
			break;
		}
		
		Color txtColor;
		
		if (fontColor != null)
		{
			txtColor = fontColor.getColor(fontColorStyle, this);
		}
		else
		{
			txtColor = getStyleColor(fontColorStyle);
		}
		
		int styleVariation = quickStyleVals.getQuickStyleVariation();
		
		//TODO The formula in the documentation doesn't match how vsdx viewer works. Simply using the fill/line color works!
		//		Note: Using the fill/line color does not cover all the cases but works with most of the sample files
		if ((styleVariation & 2) > 0)
		{
			Color fillColor = getFillColor(quickStyleVals);
			HSLColor fillHSLClr = fillColor.toHsl();
//			HSLColor txtColorHSL = txtColor.toHsl();
//			if (Math.abs(fillHSLClr.getLum() - txtColorHSL.getLum()) < 0.1616)
//			{
//				if (fillHSLClr.getLum() < 0.7292)
//				{
//					txtColor = new Color(255, 255, 255);
//				}
//				else
//				{
					Color lineClr = getLineColor(quickStyleVals);
					HSLColor lineHSLClr = lineClr.toHsl();
					if (fillHSLClr.getLum() < lineHSLClr.getLum())
					{
						txtColor = fillColor;
					}
					else
					{
						txtColor = lineClr;
					}
//				}
//			}
		}
		
		return txtColor;
	}

	//Get font color based on QuickStyleFontColor & QuickStyleFontMatrix
	public Color getFontColor(QuickStyleVals quickStyleVals)
	{
		return getFontColor(quickStyleVals, fontColors);
	}
	
	//Get connection font color based on QuickStyleFontColor & QuickStyleFontMatrix
	public Color getConnFontColor(QuickStyleVals quickStyleVals)
	{
		return getFontColor(quickStyleVals, connFontColors);
	}

	private int getArrowType(QuickStyleVals quickStyleVals, boolean isStart, ArrayList<LineStyleExt> lineStylesExt, ArrayList<LineStyle> lineStyles) 
	{
		LineStyleExt lineStyleExt = getLineStyleExt(quickStyleVals.getQuickStyleLineMatrix(), lineStylesExt);
		
		if (lineStyleExt != null)
		{
			return isStart? lineStyleExt.getStart() : lineStyleExt.getEnd();
		}
		else
		{
			LineStyle lineStyle = getLineStyle(quickStyleVals.getQuickStyleLineMatrix(), lineStyles);
			return lineStyle != null? (isStart? lineStyle.getStart() : lineStyle.getEnd()) : 0;
		}
	}

	public int getEdgeMarker(boolean isStart, QuickStyleVals quickStyleVals) 
	{
		return getArrowType(quickStyleVals, isStart, lineStylesExt, lineStyles);
	}

	public int getConnEdgeMarker(boolean isStart, QuickStyleVals quickStyleVals) 
	{
		return getArrowType(quickStyleVals, isStart, connLineStylesExt, connLineStyles);
	}

	
	private int getLineWidth(QuickStyleVals quickStyleVals, ArrayList<LineStyle> lineStyles) 
	{
		LineStyle lineStyle = getLineStyle(quickStyleVals.getQuickStyleLineMatrix(), lineStyles);
		return lineStyle != null? lineStyle.getLineWidth() : 0;			
	}

	public int getLineWidth(QuickStyleVals quickStyleVals) 
	{
		return getLineWidth(quickStyleVals, lineStyles);
	}
	
	public int getConnLineWidth(QuickStyleVals quickStyleVals) 
	{
		return getLineWidth(quickStyleVals, connLineStyles);
	}
}
