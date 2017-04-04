package com.mxgraph.io.vsdx.geometry;

public class InfiniteLine extends Row 
{
	public InfiniteLine(int index, Double x, Double y, Double a, Double b) 
	{
		super(index, x, y);
		this.a = a;
		this.b = b;
	}

	@Override
	public void handle() 
	{
		
	}

}
