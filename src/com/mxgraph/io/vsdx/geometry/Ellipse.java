package com.mxgraph.io.vsdx.geometry;

import com.mxgraph.io.vsdx.Shape;
import com.mxgraph.io.vsdx.mxVsdxUtils;
import com.mxgraph.util.mxPoint;

public class Ellipse extends Row 
{
	public Ellipse(int index, Double x, Double y, Double a, Double b, Double c, Double d) 
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
			double h = shape.getHeight();
			double w = shape.getWidth();

			double x = this.x * mxVsdxUtils.conversionFactor;
			double y = this.y * mxVsdxUtils.conversionFactor;
			y = h - y;
			double a = this.a * mxVsdxUtils.conversionFactor;
			double b = this.b * mxVsdxUtils.conversionFactor;
			b = h - b;
			double c = this.c * mxVsdxUtils.conversionFactor;
			double d = this.d * mxVsdxUtils.conversionFactor;
			d = h - d;
			
			double dx1 = Math.abs(a - x);
			double dy1 = Math.abs(b - y);
			double r1 = Math.sqrt(dx1 * dx1 + dy1 * dy1);

			double dx2 = Math.abs(c - x);
			double dy2 = Math.abs(d - y);
			double r2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);
			double newX = (x - r1) * 100 / w;
			double newY = (y - r2) * 100 / h;
			double newW = 2 * r1 * 100 / w;
			double newH = 2 * r2 * 100 / h;
			newH = Math.round(newH * 100.0) / 100.0;
			newW = Math.round(newW * 100.0) / 100.0;
			newX = Math.round(newX * 100.0) / 100.0;
			newY = Math.round(newY * 100.0) / 100.0;
			
			return "<ellipse" + 
					" x=\"" + String.valueOf(newX) + 
					"\" y=\"" + String.valueOf(newY) + 
					"\" w=\"" + String.valueOf(newW) + 
					"\" h=\"" + String.valueOf(newH) + 
					"\"/>";
		}
		
		return "";
	}

}
