package com.mxgraph.io.vsdx.geometry;

import com.mxgraph.io.vsdx.Shape;
import com.mxgraph.io.vsdx.mxVsdxUtils;
import com.mxgraph.util.mxPoint;

public class ArcTo extends Row 
{
	public ArcTo(int index, Double x, Double y, Double a) 
	{
		super(index, x, y);
		this.a = a;
	}

	@Override
	public String handle(mxPoint p, Shape shape)
	{
		if (this.x != null && this.y != null && this.a != null)
		{
			double h = shape.getHeight();
			double w = shape.getWidth();
			double x0 = Math.round(shape.getLastX() * w) / 100;
			double y0 = Math.round(shape.getLastY() * h) / 100;
			double x = this.x * mxVsdxUtils.conversionFactor;
			
			double y = this.y * mxVsdxUtils.conversionFactor;
			y = h - y;
			
			double a = this.a * mxVsdxUtils.conversionFactor;

			double dx = Math.abs(x - x0);
			double dy = Math.abs(y - y0);

			double rx = (a * 0.5) + (dx * dx + dy * dy) / (8.0 * a);
			double ry = rx;
			double r0 = Math.abs(rx);
			
			rx = rx * 100 / w;
			ry = ry * 100 / h;
			x = x * 100 / w;
			y = y * 100 / h;
			rx = Math.round(rx * 100.0) / 100.0;
			ry = Math.round(ry * 100.0) / 100.0;
			x = Math.round(x * 100.0) / 100.0;
			y = Math.round(y * 100.0) / 100.0;

			a = Math.round(a * 100.0) / 100.0;
			rx = Math.abs(rx);
			ry = Math.abs(ry);
			
			//determine sweep and large-arc flag
			String sf = (a < 0) ? "1" : "0";
			String laf = (r0 < Math.abs(a)) ? "1" : "0";

			if (debug != null)
			{
				debug.drawLine(x0, y0, x, y, "");
			}
			
			shape.setLastX(x);
			shape.setLastY(y);

			return "<arc" +
					" rx=\"" + String.valueOf(rx) + 
					"\" ry=\"" + String.valueOf(ry) + 
					"\" x=\"" + String.valueOf(x) + 
					"\" y=\"" + String.valueOf(y) + 
					"\" x-axis-rotation=\"0" + 
					"\" large-arc-flag=\"" + laf + 
					"\" sweep-flag=\"" + sf + 
					"\"/>";
		}
		
		return "";

	}

}
