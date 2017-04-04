package com.mxgraph.io.vsdx.geometry;

public class SplineKnot extends Row 
{
	public SplineKnot(int index, Double x, Double y, Double a)
	{
		super(index, x, y);
		this.a = a;
	}

	@Override
	public void handle() 
	{
		
	}

}
