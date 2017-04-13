package com.mxgraph.io.vsdx.geometry;

import java.util.Arrays;
import java.util.List;

import com.mxgraph.io.vsdx.Shape;
import com.mxgraph.io.vsdx.mxVsdxUtils;
import com.mxgraph.util.mxPoint;

public class NURBSTo extends Row 
{
	public NURBSTo(int index, Double x, Double y, Double a, Double b, Double c, Double d, String e) 
	{
		super(index, x, y);
		this.a = a;
		this.b = b;
		this.c = c;
		this.d = d;
		this.formulaE = e;
	}

	@Override
	public String handle(mxPoint p, Shape shape)
	{
		if (this.x != null && this.y != null && this.formulaE != null)
		{
			double h = shape.getHeight();
			double w = shape.getWidth();

			double x = this.x * mxVsdxUtils.conversionFactor;
			double y = this.y * mxVsdxUtils.conversionFactor;
			String eValue = this.formulaE.replace("NURBS(", "");
			eValue = eValue.replace(")", "");
			
			List<String> nurbsValues = Arrays.asList(eValue.split("\\s*,\\s*"));
			
			if (nurbsValues.size() >= 10)
			{
				double x1 = Double.parseDouble(nurbsValues.get(4)) * 100.0;
				double y1 = 100 - Double.parseDouble(nurbsValues.get(5)) * 100.0;
				double x2 = Double.parseDouble(nurbsValues.get(8)) * 100.0;
				double y2 = 100 - Double.parseDouble(nurbsValues.get(9)) * 100.0;
	
				y = y * 100.0 / h;
				x = x * 100.0 / w;
				y = 100 - y;
				x = Math.round(x * 100.0) / 100.0;
				y = Math.round(y * 100.0) / 100.0;
				x1 = Math.round(x1 * 100.0) / 100.0;
				y1 = Math.round(y1 * 100.0) / 100.0;
				x2 = Math.round(x2 * 100.0) / 100.0;
				y2 = Math.round(y2 * 100.0) / 100.0;
	
				if (debug != null)
				{
					debug.drawRect(x, y, "");
					debug.drawLine(shape.getLastX(), shape.getLastY(), x, y, "");
				}
				
				shape.setLastX(x);
				shape.setLastY(y);
			
				return "<curve x1=\"" + String.valueOf(x1) + "\" y1=\"" + String.valueOf(y1) + 
						      "\" x2=\"" + String.valueOf(x2) + "\" y2=\"" + String.valueOf(y2) + 
						      "\" x3=\"" + String.valueOf(x) + "\" y3=\"" + String.valueOf(y) + "\"/>";
			}
		}

		return "";

	}

}
