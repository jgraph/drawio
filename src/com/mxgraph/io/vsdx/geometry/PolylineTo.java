package com.mxgraph.io.vsdx.geometry;

public class PolylineTo extends Row 
{
	public PolylineTo(int index, Double x, Double y, String a) 
	{
		super(index, x, y);
		this.formulaA = a;
	}

	@Override
	public void handle() 
	{
		
	}

}
