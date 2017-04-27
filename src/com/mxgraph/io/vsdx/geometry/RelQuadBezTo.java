package com.mxgraph.io.vsdx.geometry;

import com.mxgraph.io.vsdx.Shape;
import com.mxgraph.util.mxPoint;

public class RelQuadBezTo extends Row 
{
	public RelQuadBezTo(int index, Double x, Double y, Double a, Double b)
	{
		super(index, x, y);
		this.a = a;
		this.b = b;
	}

	@Override
	public String handle(mxPoint p, Shape shape)
	{
		if (this.x != null && this.y != null && this.a != null && this.b != null)
		{
			double x = this.x * 100;
			double y = 100 - this.y * 100;
			double x1 = this.a * 100.0;
			double y1 = 100 - this.b * 100.0;

			x = Math.round(x * 100.0) / 100.0;
			y = Math.round(y * 100.0) / 100.0;
			x1 = Math.round(x1 * 100.0) / 100.0;
			y1 = Math.round(y1 * 100.0) / 100.0;

			shape.setLastX(x);
			shape.setLastY(y);
		
			return "<quad x1=\"" + String.valueOf(x1) + "\" y1=\"" + String.valueOf(y1) + 
					      "\" x2=\"" + String.valueOf(x) + "\" y2=\"" + String.valueOf(y) + "\"/>";
		}

		return "";
	}

}
