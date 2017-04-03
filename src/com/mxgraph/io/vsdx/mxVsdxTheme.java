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
import com.mxgraph.io.vsdx.theme.LineStyle;
import com.mxgraph.io.vsdx.theme.LineStyleExt;
import com.mxgraph.io.vsdx.theme.OoxmlColor;
import com.mxgraph.io.vsdx.theme.OoxmlColorFactory;

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
	
	public mxVsdxTheme(Element theme) 
	{
		this.theme = theme;
		
		Integer themeId = themesIds.get(theme.getAttribute("name"));
		
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
								//Process the color scheme
								processColors(elem);
							}
							else if (nodeName.equals("a:fontScheme")) 
							{
								//Process the font scheme
								processFonts(elem);
							}
							else if (nodeName.equals("a:fmtScheme")) 
							{
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

	
	public Color getFillGraientColor(int quickStyleFillColor, int quickStyleFillMatrix)
	{
		return getFillColor(quickStyleFillColor, quickStyleFillMatrix, true);
	}
	
	public Color getFillColor(int quickStyleFillColor, int quickStyleFillMatrix)
	{
		return getFillColor(quickStyleFillColor, quickStyleFillMatrix, false);
	}

	//Get fill color based on QuickStyleFillColor & QuickStyleFillMatrix
	private Color getFillColor(int quickStyleFillColor, int quickStyleFillMatrix, boolean getGradient)
	{
		processTheme();
		
		int fillColorStyle = quickStyleFillColor;
		FillStyle fillStyle = null;
		switch (quickStyleFillMatrix)
		{
			case 1:
			case 2:
			case 3:
			case 4:
			case 5:
			case 6:
				fillStyle = fillStyles.get(quickStyleFillMatrix - 1);
			break;
			case 100:
			case 101:
			case 102:
			case 103:
				if (isMonotoneVariant[themeVariant]) fillColorStyle = 100;
				
				int index = quickStyleFillMatrix - 100;
				//get style index of variants
				fillStyle = fillStyles.get(variantFillIdx[themeVariant][index] - 1);
			break;
		}
		
		if (fillStyle != null)
		{
			if (getGradient)
			{
				return (fillStyle instanceof GradFill)? fillStyle.applyStyle(fillColorStyle, this).getGradientClr() : null;
			}
			else
			{
				return fillStyle.applyStyle(fillColorStyle, this);
			}
		}
		else
		{
			if (getGradient)
			{
				return null;
			}
			else
			{
				return getStyleColor(fillColorStyle);
			}
		}
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
				lineStyle = lineStyles.get(variantLineIdx[themeVariant][index] - 1);
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
	private Color getLineColor(int quickStyleLineColor, int quickStyleLineMatrix, ArrayList<LineStyle> lineStyles)
	{
		processTheme();
		
		int lineColorStyle = quickStyleLineColor;
		LineStyle lineStyle = getLineStyle(quickStyleLineMatrix, lineStyles);
		switch (quickStyleLineMatrix)
		{
			case 100:
			case 101:
			case 102:
			case 103:
				if (isMonotoneVariant[themeVariant]) lineColorStyle = 100;
			break;
		}
		
		if (lineStyle != null)
		{
			return lineStyle.getLineColor(lineColorStyle, this);
		}
		else
		{
			return getStyleColor(lineColorStyle);
		}		
	}

	//Get line color based on QuickStyleLineColor & QuickStyleLineMatrix
	public Color getLineColor(int quickStyleLineColor, int quickStyleLineMatrix)
	{
		return getLineColor(quickStyleLineColor, quickStyleLineMatrix, lineStyles);
	}
	
	//Get connection line color based on QuickStyleLineColor & QuickStyleLineMatrix
	public Color getConnLineColor(int quickStyleLineColor, int quickStyleLineMatrix)
	{
		return getLineColor(quickStyleLineColor, quickStyleLineMatrix, connLineStyles);
	}

	
	public Color getDefaultLineClr() 
	{
		return defaultLineClr;
	}

	private boolean isLineDashed(int quickStyleLineMatrix, ArrayList<LineStyleExt> lineStylesExt, ArrayList<LineStyle> lineStyles) 
	{
		LineStyleExt lineStyleExt = getLineStyleExt(quickStyleLineMatrix, lineStylesExt);
		
		if (lineStyleExt != null)
		{
			return lineStyleExt.isDashed();
		}
		else
		{
			LineStyle lineStyle = getLineStyle(quickStyleLineMatrix, lineStyles);
			return lineStyle != null? lineStyle.isDashed() : false;			
		}
	}

	public boolean isLineDashed(int quickStyleLineMatrix)
	{
		return isLineDashed(quickStyleLineMatrix, lineStylesExt, lineStyles);
	}
	
	public boolean isConnLineDashed(int quickStyleLineMatrix) 
	{
		return isLineDashed(quickStyleLineMatrix, connLineStylesExt, connLineStyles);
	}

	private ArrayList<Double> getLineDashPattern(int quickStyleLineMatrix, ArrayList<LineStyleExt> lineStylesExt, ArrayList<LineStyle> lineStyles) 
	{
		LineStyleExt lineStyleExt = getLineStyleExt(quickStyleLineMatrix, lineStylesExt);
		
		if (lineStyleExt != null)
		{
			return lineStyleExt.getLineDashPattern();
		}
		else
		{
			LineStyle lineStyle = getLineStyle(quickStyleLineMatrix, lineStyles);
			return lineStyle != null? lineStyle.getLineDashPattern() : null;
		}
	}

	public ArrayList<Double> getLineDashPattern(int quickStyleLineMatrix) 
	{
		return getLineDashPattern(quickStyleLineMatrix, lineStylesExt, lineStyles);
	}
	
	public ArrayList<Double> getConnLineDashPattern(int quickStyleLineMatrix) 
	{
		return getLineDashPattern(quickStyleLineMatrix, connLineStylesExt, connLineStyles);
	}

	private int getArrowSize(int quickStyleLineMatrix, boolean isStart, ArrayList<LineStyleExt> lineStylesExt, ArrayList<LineStyle> lineStyles) 
	{
		LineStyleExt lineStyleExt = getLineStyleExt(quickStyleLineMatrix, lineStylesExt);
		
		if (lineStyleExt != null)
		{
			return isStart? lineStyleExt.getStartSize() : lineStyleExt.getEndSize();
		}
		else
		{
			LineStyle lineStyle = getLineStyle(quickStyleLineMatrix, lineStyles);
			return lineStyle != null? (isStart? lineStyle.getStartSize() : lineStyle.getEndSize()) : 4;
		}
	}

	public int getStartSize(int quickStyleLineMatrix) 
	{
		return getArrowSize(quickStyleLineMatrix, true, lineStylesExt, lineStyles);
	}
	
	public int getConnStartSize(int quickStyleLineMatrix) 
	{
		return getArrowSize(quickStyleLineMatrix, true, connLineStylesExt, connLineStyles);
	}
	
	public int getEndSize(int quickStyleLineMatrix) 
	{
		return getArrowSize(quickStyleLineMatrix, false, lineStylesExt, lineStyles);
	}
	
	public int getConnEndSize(int quickStyleLineMatrix) 
	{
		return getArrowSize(quickStyleLineMatrix, false, connLineStylesExt, connLineStyles);
	}
	
	//Get font color based on QuickStyleFontColor & QuickStyleFontMatrix
	private Color getFontColor(int quickStyleFontColor, int quickStyleFontMatrix, ArrayList<OoxmlColor> fontColors)
	{
		processTheme();
		
		int fontColorStyle = quickStyleFontColor;
		OoxmlColor fontColor = null;
		switch (quickStyleFontMatrix)
		{
			case 1:
			case 2:
			case 3:
			case 4:
			case 5:
			case 6:
				fontColor = fontColors.get(quickStyleFontMatrix - 1);
			break;
			case 100:
			case 101:
			case 102:
			case 103:
				if (isMonotoneVariant[themeVariant]) fontColorStyle = 100;
				
				int index = quickStyleFontMatrix - 100;
				//get style index of variants
				fontColor = fontColors.get(variantFontIdx[themeVariant][index] - 1);
			break;
		}
		
		if (fontColor != null)
		{
			return fontColor.getColor(fontColorStyle, this);
		}
		else
		{
			return getStyleColor(fontColorStyle);
		}
	}

	//Get font color based on QuickStyleFontColor & QuickStyleFontMatrix
	public Color getFontColor(int quickStyleFontColor, int quickStyleFontMatrix)
	{
		return getFontColor(quickStyleFontColor, quickStyleFontMatrix, fontColors);
	}
	
	//Get connection font color based on QuickStyleFontColor & QuickStyleFontMatrix
	public Color getConnFontColor(int quickStyleFontColor, int quickStyleFontMatrix)
	{
		return getFontColor(quickStyleFontColor, quickStyleFontMatrix, connFontColors);
	}

	private int getArrowType(int quickStyleLineMatrix, boolean isStart, ArrayList<LineStyleExt> lineStylesExt, ArrayList<LineStyle> lineStyles) 
	{
		LineStyleExt lineStyleExt = getLineStyleExt(quickStyleLineMatrix, lineStylesExt);
		
		if (lineStyleExt != null)
		{
			return isStart? lineStyleExt.getStart() : lineStyleExt.getEnd();
		}
		else
		{
			LineStyle lineStyle = getLineStyle(quickStyleLineMatrix, lineStyles);
			return lineStyle != null? (isStart? lineStyle.getStart() : lineStyle.getEnd()) : 0;
		}
	}

	public int getEdgeMarker(boolean isStart, int quickStyleLineMatrix) 
	{
		return getArrowType(quickStyleLineMatrix, isStart, lineStylesExt, lineStyles);
	}

	public int getConnEdgeMarker(boolean isStart, int quickStyleLineMatrix) 
	{
		return getArrowType(quickStyleLineMatrix, isStart, connLineStylesExt, connLineStyles);
	}

	
	private int getLineWidth(int quickStyleLineMatrix, ArrayList<LineStyle> lineStyles) 
	{
		LineStyle lineStyle = getLineStyle(quickStyleLineMatrix, lineStyles);
		return lineStyle != null? lineStyle.getLineWidth() : 0;			
	}

	public int getLineWidth(int quickStyleLineMatrix) 
	{
		return getLineWidth(quickStyleLineMatrix, lineStyles);
	}
	
	public int getConnLineWidth(int quickStyleLineMatrix) 
	{
		return getLineWidth(quickStyleLineMatrix, connLineStyles);
	}
}
