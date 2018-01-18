package com.mxgraph.io.vsdx.geometry;

import com.mxgraph.io.vsdx.Shape;
import com.mxgraph.io.vsdx.mxVsdxUtils;
import com.mxgraph.util.mxPoint;

public class MoveTo extends Row 
{
	public MoveTo(int index, Double x, Double y) 
	{
		super(index, x, y);
	}

	@Override
	public String handle(mxPoint p, Shape shape)
	{
		double x = p.getX(), y = p.getY();
		double h = shape.getHeight();
		double w = shape.getWidth();

		if (this.x != null && this.y != null)
		{
			x = this.x * mxVsdxUtils.conversionFactor;
			y = this.y * mxVsdxUtils.conversionFactor;
		}
		
		x = x * 100.0 / w;
		y = y * 100.0 / h;
		y = 100 - y;

		x = Math.round(x * 100.0) / 100.0;
		y = Math.round(y * 100.0) / 100.0;
		
		p.setX(x);
		p.setY(y);
		shape.setLastX(x);
		shape.setLastY(y);
		shape.setLastMoveX(x);
		shape.setLastMoveY(y);

		return "<" + "move" + " x=\"" + String.valueOf(x) + "\" y=\"" + String.valueOf(y) + "\"/>";
	}
}
