package com.mxgraph.io.vsdx.geometry;

import com.mxgraph.io.vsdx.Shape;
import com.mxgraph.io.vsdx.mxVsdxUtils;
import com.mxgraph.util.mxPoint;

public class EllipticalArcTo extends Row 
{
	public EllipticalArcTo(int index, Double x, Double y, Double a, Double b, Double c, Double d) 
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
			double c = this.c;
			double d = this.d;

			x = x * 100.0 / w;
			y = y * 100.0 / h;
			
			double x1 = shape.getLastX() * w / 100.0;
			double y1 = shape.getLastY() * h / 100.0;
			
			double x2 = x * w / 100.0;
			double y2 = y * h / 100.0;
			
			double x3 = a;
			double y3 = h - b;

			double ang = -c;
			
			double p1x = Math.sqrt(x1 * x1 + y1 * y1) * Math.cos(Math.atan2(y1, x1) - ang);
			double p1y = Math.sqrt(x1 * x1 + y1 * y1) * Math.sin(Math.atan2(y1, x1) - ang);
            
			double p2x = Math.sqrt(x2 * x2 + y2 * y2) * Math.cos(Math.atan2(y2, x2) - ang);
			double p2y = Math.sqrt(x2 * x2 + y2 * y2) * Math.sin(Math.atan2(y2, x2) - ang);
            
			double p3x = Math.sqrt(x3 * x3 + y3 * y3) * Math.cos(Math.atan2(y3, x3) - ang);
			double p3y = Math.sqrt(x3 * x3 + y3 * y3) * Math.sin(Math.atan2(y3, x3) - ang);
			
			double p0x = ((p1x-p2x)*(p1x+p2x)*(p2y-p3y)-(p2x-p3x)*(p2x+p3x)*(p1y-p2y)+d*d*(p1y-p2y)*(p2y-p3y)*(p1y-p3y))/(2*((p1x-p2x)*(p2y-p3y)-(p2x-p3x)*(p1y-p2y)));
			double p0y = ((p1x-p2x)*(p2x-p3x)*(p1x-p3x)/(d*d)+(p2x-p3x)*(p1y-p2y)*(p1y+p2y)-(p1x-p2x)*(p2y-p3y)*(p2y+p3y))/(2*((p2x-p3x)*(p1y-p2y)-(p1x-p2x)*(p2y-p3y)));
			
			double newX = Math.sqrt(p0x * p0x + p0y * p0y) * Math.cos(Math.atan2(p0y, p0x) + ang);
			double newY = Math.sqrt(p0x * p0x + p0y * p0y) * Math.sin(Math.atan2(p0y, p0x) + ang);
			
			newX = newX * w / 100.0;
			newY = newY * h / 100.0;
			
			double dx = p1x - p0x;
			double dy = p1y - p0y;
			double rx = Math.sqrt(dx * dx + dy * dy * d * d);
			double ry = rx / d;
			double rot = Math.toDegrees(ang);
			
			rx = rx * 100.0 / w;
			ry = ry * 100.0 / h;
			
			x = Math.round(x * 100.0) / 100.0;
			y = Math.round(y * 100.0) / 100.0;
			rx = Math.round(rx * 100.0) / 100.0;
			ry = Math.round(ry * 100.0) / 100.0;
			rot = Math.round(rot * 100.0) / 100.0;

			//determine sweep
			//TODO fix rare error (file "1 Supported Forms" shape "storeddata" on page 5)
			double sweep = (x2 - x1) * (y3 - y1) - (y2 - y1) * (x3 - x1); 
			String sf = (sweep > 0) ? "0" : "1"; 
			
			//determine large arc flag
			String laf = "0";

			if (mxVsdxUtils.isInsideTriangle(p0x, p0y, p1x, p1y, p2x, p2y, p3x, p3y) && 
					isReflexAngle(p0x, p0y, p1x, p1y, p2x, p2y, p3x, p3y))
			{
				laf = "1";
			}
			
			if (debug != null)
			{
				debug.drawRect(p0x, p0y, "P0");
				debug.drawRect(p1x, p1y, "P1");
				debug.drawRect(p2x, p2y, "P2");
				debug.drawRect(p3x, p3y, "P3");
				debug.drawRect(newX, newY, "X");
				debug.drawRect(x3, y3, "CP");
				debug.drawLine(x1, y1, x2, y2, "");
			}
			
			shape.setLastX(x);
			shape.setLastY(y);
			
			return "<arc" + 
			" rx=\"" + String.valueOf(rx) + 
			"\" ry=\"" + String.valueOf(ry) + 
			"\" x=\"" + String.valueOf(x) + 
			"\" y=\"" + String.valueOf(y) + 
			"\" x-axis-rotation=\"" + String.valueOf(rot) + 
			"\" large-arc-flag=\"" + laf + 
			"\" sweep-flag=\"" + sf + 
			"\"/>";
		}
		
		return "";
	}

	/**
	 * @param x0 y0 center point of ellipse containing the arc
	 * @param x1 y1 starting point of the arc
	 * @param x2 y2 endpoint of the arc
	 * @param x3 y3 control point
	 * @return true if the start to end angle that contains the control point is a reflex angle 
	 */
	protected boolean isReflexAngle(double x0, double y0, double x1, double y1, double x2, double y2, double x3, double y3)
	{
		x1 = x1 - x0;
		y1 = y1 - y0;
		x2 = x2 - x0;
		y2 = y2 - y0;
		x2 = x3 - x0;
		y3 = y3 - y0;
		x0 = 0;
		y0 = 0;

		double aStart = Math.toDegrees(Math.atan2(y1, x1) - Math.atan2(y0, x0));
		double aEnd = Math.toDegrees(Math.atan2(y2, x2) - Math.atan2(y0, x0));
		double aCP = Math.toDegrees(Math.atan2(y3, x3) - Math.atan2(y0, x0));
		
		aStart = (aStart - aCP) % 360;
		aEnd = (aEnd - aCP) % 360;

		if (aStart > 180)
		{
			aStart = aStart - 360;
		}
		else if (aStart < -180)
		{
			aStart = aStart + 360;
		}
		
		if (aEnd > 180)
		{
			aEnd = aEnd - 360;
		}
		else if (aEnd < -180)
		{
			aEnd = aEnd + 360;
		}
		
		if ((aStart > 0 && aEnd < 0) || (aStart < 0 && aEnd > 0))
		{
			if (Math.abs(aStart - aEnd) > 180)
			{
				return true;
			}
		}
		
		return false;
	}

}
