package com.mxgraph.io.vsdx.geometry;

import com.mxgraph.io.vsdx.Shape;
import com.mxgraph.io.vsdx.mxVsdxUtils;
import com.mxgraph.io.vsdx.mxPoint;

public class SplineStart extends Row 
{
	public SplineStart(int index, Double x, Double y, Double a, Double b, Double c, Double d) 
	{
		super(index, x, y);
		this.a = a;
		this.b = b;
		this.c = c;
		this.d = d;
	}

	//TODO Is this complete?
	@Override
	public String handle(mxPoint p, Shape shape)
	{
		if (this.x != null && this.y != null && this.a != null && this.b != null && this.c != null && this.d != null)
		{
			double h = shape.getHeight();
			double w = shape.getWidth();

			double x = this.x * mxVsdxUtils.conversionFactor;
			double y = this.y * mxVsdxUtils.conversionFactor;
			//double a = Double.parseDouble(aValue);
			//double b = Double.parseDouble(bValue);
			double c = this.c;
			int d = this.d.intValue();

			//double firstKnot = b;
			//double secondKnot = a;
			double lastKnot = c;
			
			shape.setLastKnot(lastKnot);
			
			int degree = d;
//				x = x * 100.0 / w;
//				y = y * 100.0 / h;
			y = 100 - y;
			x = Math.round(x * 100.0) / 100.0;
			y = Math.round(y * 100.0) / 100.0;
			lastKnot = Math.round(lastKnot * 100.0) / 100.0;
			double x0 = shape.getLastX() * w / 100.0;
			double y0 = shape.getLastY() * h / 100.0;

			shape.setLastX(x);
			shape.setLastY(y);

			return "<curve ";
		}
		
		return "";

	}

}
