package com.mxgraph.io.vsdx.geometry;

import com.mxgraph.io.vsdx.Shape;
import com.mxgraph.io.vsdx.mxVsdxUtils;
import com.mxgraph.io.vsdx.mxPoint;

public class SplineKnot extends Row 
{
	public SplineKnot(int index, Double x, Double y, Double a)
	{
		super(index, x, y);
		this.a = a;
	}

	//TODO Is this complete?
	@Override
	public String handle(mxPoint p, Shape shape)
	{
		if (this.x != null && this.y != null && this.a != null)
		{
			//double h = this.getHeight();
			//double w = this.getWidth();
			double x = this.x * mxVsdxUtils.conversionFactor;
			double y = this.y * mxVsdxUtils.conversionFactor;
			double a = this.a;

			double knot = a;
//				x = x * 100.0 / w;
//				y = y * 100.0 / h;
			y = 100 - y;
			x = Math.round(x * 100.0) / 100.0;
			y = Math.round(y * 100.0) / 100.0;
			knot = Math.round(knot * 100.0) / 100.0;
			
			shape.setLastX(x);
			shape.setLastY(y);
		}
		
		return "";

	}

}
