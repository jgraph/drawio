package com.mxgraph.io.vsdx.geometry;

import com.mxgraph.io.vsdx.Shape;
import com.mxgraph.io.vsdx.mxPoint;

public class InfiniteLine extends Row 
{
	public InfiniteLine(int index, Double x, Double y, Double a, Double b) 
	{
		super(index, x, y);
		this.a = a;
		this.b = b;
	}

	@Override
	public String handle(mxPoint p, Shape shape)
	{
		//TODO implement this!
		return "";
	}

}
