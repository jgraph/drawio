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
		//TODO implement this!
		return "";
	}

}
