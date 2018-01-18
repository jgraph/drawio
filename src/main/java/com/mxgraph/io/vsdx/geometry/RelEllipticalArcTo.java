package com.mxgraph.io.vsdx.geometry;

import com.mxgraph.io.vsdx.Shape;
import com.mxgraph.io.vsdx.mxVsdxUtils;
import com.mxgraph.util.mxPoint;

public class RelEllipticalArcTo extends EllipticalArcTo 
{
	public RelEllipticalArcTo(int index, Double x, Double y, Double a, Double b, Double c, Double d) 
	{
		super(index, x, y, a, b, c, d);
	}
	
	@Override
	public String handle(mxPoint p, Shape shape) {
		if (this.x != null && this.y != null && this.a != null && this.b != null && this.c != null && this.d != null)
		{
			double h = shape.getHeight() / mxVsdxUtils.conversionFactor;
			double w = shape.getWidth() / mxVsdxUtils.conversionFactor;
			this.x *= w;
			this.y *= h;
			this.a *= w;
			this.b *= h;
		}
		return super.handle(p, shape);
	}
}
