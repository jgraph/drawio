package com.mxgraph.io.vsdx.geometry;

import com.mxgraph.io.vsdx.Shape;
import com.mxgraph.util.mxPoint;

public class RelCubBezTo extends Row 
{
	public RelCubBezTo(int index, Double x, Double y, Double a, Double b, Double c, Double d) 
	{
		super(index, x, y);
		this.a = a;
		this.b = b;
		this.c = c;
		this.d = d;
	}

	@Override
	public String handle(mxPoint p, Shape shape)
	{
		if (this.x != null && this.y != null && this.a != null && this.b != null && this.c != null && this.d != null)
		{
			double x = this.x * 100;
			double y = 100 - this.y * 100;
			double x1 = this.a * 100.0;
			double y1 = 100 - this.b * 100.0;
			double x2 = this.c * 100.0;
			double y2 = 100 - this.d * 100.0;

			x = Math.round(x * 100.0) / 100.0;
			y = Math.round(y * 100.0) / 100.0;
			x1 = Math.round(x1 * 100.0) / 100.0;
			y1 = Math.round(y1 * 100.0) / 100.0;
			x2 = Math.round(x2 * 100.0) / 100.0;
			y2 = Math.round(y2 * 100.0) / 100.0;

			shape.setLastX(x);
			shape.setLastY(y);
		
			return "<curve x1=\"" + String.valueOf(x1) + "\" y1=\"" + String.valueOf(y1) + 
					      "\" x2=\"" + String.valueOf(x2) + "\" y2=\"" + String.valueOf(y2) + 
					      "\" x3=\"" + String.valueOf(x) + "\" y3=\"" + String.valueOf(y) + "\"/>";
		}

		return "";
	}

}
