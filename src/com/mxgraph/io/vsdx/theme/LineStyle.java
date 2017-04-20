package com.mxgraph.io.vsdx.theme;

import java.util.ArrayList;

import org.w3c.dom.Element;

import com.mxgraph.io.vsdx.mxVsdxTheme;
import com.mxgraph.io.vsdx.mxVsdxUtils;

public class LineStyle {
	
	public enum LineCapType
	{
		ROUND, SQUARE, FLAT
	}

	public enum CompoundLineType
	{
		SINGLE, DOUBLE, THICK_THIN_DOUBLE, THIN_THICK_DOUBLE, THIN_THICK_THIN_TRIPLE
	}
	
	public enum LineEndType
	{
		NONE, TRIANGLE, STEALTH, DIAMOND, OVAL, ARROW
	}
	
	private int lineWidth;
	private LineCapType lineCap;
	private CompoundLineType lineComp;
	private FillStyle fillStyle;
	
	private boolean isLineDashed = false;
	private ArrayList<Double> lineDashPattern = new ArrayList<>();
	
	private boolean isRoundJoin = false, isBevelJoin = false, isMiterJoin = false;
	
	private LineEndType headEndType;
	private int headEndWidth, headEndLen;
	
	private LineEndType tailEndType;
	private int tailEndWidth, tailEndLen;
	
	public LineStyle()
	{
		
	}
	
	public LineStyle(Element elem)
	{
		//parse the line style xml
		lineWidth = mxVsdxUtils.getIntAttr(elem, "w");
		
		String lineCapAtt = elem.getAttribute("cap");
		
		if (lineCapAtt != null)
		{
			switch (lineCapAtt)
			{
				case "rnd":
					lineCap = LineCapType.ROUND;
				break;
				case "sq":
					lineCap = LineCapType.SQUARE;
				break;
				case "flat":
					lineCap = LineCapType.FLAT;
				break;
			}
		}
		
		String lineCompAtt = elem.getAttribute("cmpd");
		
		if (lineCompAtt != null)
		{
			switch (lineCompAtt)
			{
				case "sng":
					lineComp = CompoundLineType.SINGLE;
				break;
				case "dbl":
					lineComp = CompoundLineType.DOUBLE;
				break;
				case "thickThin":
					lineComp = CompoundLineType.THICK_THIN_DOUBLE;
				break;
				case "thinThick":
					lineComp = CompoundLineType.THIN_THICK_DOUBLE;
				break;
				case "tri":
					lineComp = CompoundLineType.THIN_THICK_THIN_TRIPLE;
				break;
			}
		}
		
		//TODO add algn (Stroke Alignment) attrinbute support [http://www.datypic.com/sc/ooxml/a-algn-4.html]
		
		ArrayList<Element> subElems = mxVsdxUtils.getDirectChildElements(elem);
		
		for (Element subElem : subElems)
		{
			String name = subElem.getNodeName();
			
			switch(name)
			{
				case "a:noFill":
				case "a:solidFill":
				case "a:gradFill":
				case "a:pattFill":
					fillStyle = FillStyleFactory.getFillStyle(subElem);
				break;
				case "a:prstDash":
					String val = subElem.getAttribute("val");
					
					isLineDashed = true;
					switch (val)
					{
						case "solid":
							isLineDashed = false;
						break;
						case "sysDot":
						case "dot":
							lineDashPattern.add(1.0);
							lineDashPattern.add(4.0);
						break;
						case "sysDash":
						case "dash":
							//use the default dashed pattern
						break;
						case "lgDash":
							lineDashPattern.add(12.0);
							lineDashPattern.add(4.0);
						break;
						case "sysDashDot":
						case "dashDot":
							lineDashPattern.add(8.0);
							lineDashPattern.add(4.0);
							lineDashPattern.add(1.0);
							lineDashPattern.add(4.0);
						break;
						case "lgDashDot":
							lineDashPattern.add(12.0);
							lineDashPattern.add(4.0);
							lineDashPattern.add(1.0);
							lineDashPattern.add(4.0);
						break;
						case "sysDashDotDot":
						case "lgDashDotDot":
							lineDashPattern.add(12.0);
							lineDashPattern.add(4.0);
							lineDashPattern.add(1.0);
							lineDashPattern.add(4.0);
							lineDashPattern.add(1.0);
							lineDashPattern.add(4.0);
						break;
					}
				break;
				case "a:custDash":
					isLineDashed = true;
					ArrayList<Element> dsElems = mxVsdxUtils.getDirectChildNamedElements(subElem, "a:ds");
					for (Element dsElem : dsElems)
					{
						int dashLen = mxVsdxUtils.getIntAttr(dsElem, "d");
						int spaceLen = mxVsdxUtils.getIntAttr(dsElem, "sp");
						//TODO find the correct conversion ratio from vsdx to mxGraph
						lineDashPattern.add(dashLen/10000.0);
						lineDashPattern.add(spaceLen/10000.0);
					}
				break;
				//https://www.w3schools.com/tags/playcanvas.asp?filename=playcanvas_lineJoin
				case "a:round": //Round Line Join
					isRoundJoin = true;
				break;
				case "a:bevel": //Bevel Line Join
					isBevelJoin = true;
				break;
				case "a:miter": //Miter Line Join
					//	Miter Join Limit
					int limit = mxVsdxUtils.getIntAttr(subElem, "lim"); //?
					isMiterJoin = true;
				break;
				case "a:headEnd": //Line Head/End Style
					headEndType = getLineEndType(subElem);
					headEndWidth = mxVsdxUtils.getIntAttr(subElem, "w");
					headEndLen = mxVsdxUtils.getIntAttr(subElem, "len");
				break;
				case "a:tailEnd": //Tail line end style
					tailEndType = getLineEndType(subElem);
					tailEndWidth = mxVsdxUtils.getIntAttr(subElem, "w");
					tailEndLen = mxVsdxUtils.getIntAttr(subElem, "len");
				break;
				case "a:extLst": //Extension List!
				break;
			}
		}
	}

	private LineEndType getLineEndType(Element subElem) {
		String type = subElem.getAttribute("type");
		LineEndType endType = null;
		switch (type)
		{
			case "none":
				endType = LineEndType.NONE;
			break;
			case "triangle":
				endType = LineEndType.TRIANGLE;
			break;
			case "stealth":
				endType = LineEndType.STEALTH;
			break;
			case "diamond":
				endType = LineEndType.DIAMOND;
			break;
			case "oval":
				endType = LineEndType.OVAL;
			break;
			case "arrow":
				endType = LineEndType.ARROW;
			break;
		}
		return endType;
	}
	
	public Color getLineColor(int lineColorStyle, mxVsdxTheme theme) {
		if (fillStyle != null)
			return fillStyle.applyStyle(lineColorStyle, theme);
		else
			return theme.getDefaultLineClr();
	}

	public boolean isDashed() {
		return isLineDashed;
	}
	
	public ArrayList<Double> getLineDashPattern()
	{
		return lineDashPattern;
	}

	public int getStartSize() {
		// TODO Implement this if it is needed
		return 4;
	}

	public int getEndSize() {
		// TODO Implement this if it is needed
		return 4;
	}

	public int getStart() {
		// TODO Implement this if it is needed
		return 0;
	}
	
	public int getEnd() {
		// TODO Implement this if it is needed
		return 0;
	}

	public int getLineWidth() {
		return lineWidth;
	}
}
