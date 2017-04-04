package com.mxgraph.io.vsdx.geometry;

public class NURBSTo extends Row 
{
	public NURBSTo(int index, Double x, Double y, Double a, Double b, Double c, Double d, String e) 
	{
		super(index, x, y);
		this.a = a;
		this.b = b;
		this.c = c;
		this.d = d;
		this.formulaE = e;
	}

	@Override
	public void handle() 
	{
		
	}

}
