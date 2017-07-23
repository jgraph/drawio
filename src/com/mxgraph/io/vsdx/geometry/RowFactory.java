package com.mxgraph.io.vsdx.geometry;

import java.util.ArrayList;
import java.util.List;

import org.w3c.dom.Element;

import com.mxgraph.io.vsdx.mxVsdxUtils;

public class RowFactory 
{
	private static int getIndex(Element elem)
	{
		try
		{
			return Integer.parseInt(elem.getAttribute("IX"));
		}
		catch (Exception e)
		{
			//Some non-standard visio file omit the index when it is one 
			return 1;
		}
	}
	
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
		int index = getIndex(elem);
		String del = elem.getAttribute("Del");
		if (!del.equals("1"))
		{
			Row parentObj = null;
			
			if (index <= pRows.size())
			{
				parentObj = pRows.get(index - 1);
			}
			
			Double x = null, y = null, a = null, b = null, c = null, d = null;
			String formulaE = null, formulaA = null;
			
			if (parentObj != null)
			{
				x = parentObj.getX();
				y = parentObj.getY();
				a = parentObj.getA();
				b = parentObj.getB();
				c = parentObj.getC();
				d = parentObj.getD();
				formulaA = parentObj.getFormulaA();
				formulaE = parentObj.getFormulaE();
			}
			
			ArrayList<Element> cells = mxVsdxUtils.getDirectChildElements(elem);
			
			for (Element cell : cells)
			{
				String name = cell.getAttribute("N");
				String val = cell.getAttribute("V");
				
				switch (name)
				{
					case "X":
						x = getDoubleVal(val);
					break;
					case "Y":
						y = getDoubleVal(val);
					break;
					case "A":
						a = getDoubleVal(val);
						//TODO check the reason for this
						//Special case for PolylineTo where we need the F attribute instead of V
						formulaA = cell.getAttribute("V");
					break;
					case "B":
						b = getDoubleVal(val);
					break;
					case "C":
						c = getDoubleVal(val);
					break;
					case "D":
						d = getDoubleVal(val);
					break;
					case "E":
						formulaE = val;
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
				case "RelEllipticalArcTo":
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
