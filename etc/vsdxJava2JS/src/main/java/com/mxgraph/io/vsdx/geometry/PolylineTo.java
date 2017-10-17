package com.mxgraph.io.vsdx.geometry;

import java.util.Arrays;
import java.util.LinkedList;

import com.mxgraph.io.vsdx.Shape;
import com.mxgraph.io.vsdx.mxVsdxUtils;
import com.mxgraph.io.vsdx.mxPoint;

public class PolylineTo extends Row 
{
	public PolylineTo(int index, Double x, Double y, String a) 
	{
		super(index, x, y);
		this.formulaA = a;
	}

	@Override
	public String handle(mxPoint p, Shape shape)
	{
		String result = "";
		
		if (this.x != null && this.y != null && this.formulaA != null)
		{
			double h = shape.getHeight();
			double w = shape.getWidth();
			double x = this.x * mxVsdxUtils.conversionFactor;
			double y = this.y * mxVsdxUtils.conversionFactor;
			x = x * 100.0 / w;
			y = y * 100.0 / h;
			y = 100 - y;
			x = Math.round(x * 100.0) / 100.0;
			y = Math.round(y * 100.0) / 100.0;
			
			String aValue = this.formulaA.replaceAll("\\s","").toLowerCase().replaceAll("polyline\\(","").replaceAll("\\)", "");
			
			if (aValue.equals("inh"))
			{
				throw new IllegalArgumentException();
			}
			
			LinkedList<String> polyEntriesList = new LinkedList<String>(Arrays.asList(aValue.split(",")));
			
			double xRel = Double.parseDouble(polyEntriesList.remove(0));
			double yRel = Double.parseDouble(polyEntriesList.remove(0));
			double currX = 0;
			double currY = 0;

			while (polyEntriesList.size() > 0)
			{
				currX = Double.valueOf(polyEntriesList.remove(0)) * mxVsdxUtils.conversionFactor;
				currY = Double.valueOf(polyEntriesList.remove(0)) * mxVsdxUtils.conversionFactor;

				if (xRel == 1)
				{
					currX = currX * 100.0 / w;
				}
				
				if (xRel == 1)
				{
					currY = currY * 100.0 / h;
				}
				

				currY = 100 - currY;
				
				currX = Math.round(currX * 100.0) / 100.0;
				currY = Math.round(currY * 100.0) / 100.0;

				shape.setLastX(currX);
				shape.setLastY(currY);

				result += "<line x=\"" + String.valueOf(currX) + "\" y=\"" + String.valueOf(currY) + "\"/>";
			}

			result += "<line x=\"" + String.valueOf(x) + "\" y=\"" + String.valueOf(y) + "\"/>";

			if (shape.getLastMoveX() == x && shape.getLastMoveY() == y)
			{
				result += "<close/>";
			}
		}
		
		return result;

	}

}
