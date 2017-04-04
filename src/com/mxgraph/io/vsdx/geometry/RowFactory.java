package com.mxgraph.io.vsdx.geometry;

import java.util.ArrayList;
import java.util.List;

import org.w3c.dom.Element;

import com.mxgraph.io.vsdx.mxVsdxUtils;

public class RowFactory 
{
	private static Double getDoubleVal(String val)
	{
		try
		{
			if (val != null && !val.isEmpty())
			{
				return Double.valueOf(val);
			}
		}
		catch (Exception e) 
		{
			//nothing
		}
		return null;
	}
	
	public static Row getRowObj(Element elem, List<Row> pRows) 
	{
		String rowType = elem.getAttribute("T");
		int index = Integer.parseInt(elem.getAttribute("IX"));
		String del = elem.getAttribute("Del");
		if (!del.equals("1"))
		{
			Row parentObj = null;
			
			if (index <= pRows.size())
			{
				parentObj = pRows.get(index - 1);
			}
			
			Double x = null, y = null, a = null, b = null, c = null, d = null;
			String formulaE = null, formulaA = null;;
			ArrayList<Element> cells = mxVsdxUtils.getDirectChildElements(elem);
			
			for (Element cell : cells)
			{
				String name = cell.getAttribute("N");
				String val = cell.getAttribute("V");
				
				switch (name)
				{
					case "X":
						x = getDoubleVal(val);
						
						if (x == null && parentObj != null) 
						{
							x = parentObj.getX();
						}
					break;
					case "Y":
						y = getDoubleVal(val);

						if (y == null && parentObj != null) 
						{
							y = parentObj.getY();
						}
					break;
					case "A":
						a = getDoubleVal(val);
						formulaA = val;

						if (a == null && parentObj != null) 
						{
							a = parentObj.getA();
						}
						if (formulaA == null && parentObj != null) 
						{
							formulaA = parentObj.getFormulaA();
						}
					break;
					case "B":
						b = getDoubleVal(val);
						
						if (b == null && parentObj != null) 
						{
							b = parentObj.getB();
						}
					break;
					case "C":
						c = getDoubleVal(val);

						if (c == null && parentObj != null) 
						{
							c = parentObj.getC();
						}
					break;
					case "D":
						d = getDoubleVal(val);
						
						if (d == null && parentObj != null) 
						{
							d = parentObj.getD();
						}
					break;
					case "E":
						formulaE = val;
						
						if (formulaE == null && parentObj != null) 
						{
							formulaE = parentObj.getFormulaE();
						}
					break;
				}
			}
			
			switch (rowType)
			{
				case "MoveTo":
					return new MoveTo(index, x, y);
				case "LineTo":
					return new LineTo(index, x, y);
				case "ArcTo":
					return new ArcTo(index, x, y, a);
				case "Ellipse":
					return new Ellipse(index, x, y, a, b, c, d);
				case "EllipticalArcTo":
					return new EllipticalArcTo(index, x, y, a, b, c, d);
				case "InfiniteLine":
					return new InfiniteLine(index, x, y, a, b);
				case "NURBSTo":
					return new NURBSTo(index, x, y, a, b, c, d, formulaE);
				case "PolylineTo":
					return new PolylineTo(index, x, y, formulaA);
				case "RelCubBezTo":
					return new RelCubBezTo(index, x, y, a, b, c, d);
				case "RelEllipticalArcTo ":
					return new RelEllipticalArcTo(index, x, y, a, b, c, d);
				case "RelLineTo":
					return new RelLineTo(index, x, y);
				case "RelMoveTo":
					return new RelMoveTo(index, x, y);
				case "RelQuadBezTo":
					return new RelQuadBezTo(index, x, y, a, b);
				case "SplineKnot":
					return new SplineKnot(index, x, y, a);
				case "SplineStart":
					return new SplineStart(index, x, y, a, b, c, d);
			}
		}
		return new DelRow(index);
	}
}
