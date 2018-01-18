package com.mxgraph.io.vsdx.geometry;

import com.mxgraph.io.vsdx.Shape;
import com.mxgraph.io.vsdx.mxPathDebug;
import com.mxgraph.util.mxPoint;

public abstract class Row 
{
	protected Double x, y, a, b, c, d;
	protected String formulaA, formulaE; 
	protected int index;
	
	public mxPathDebug debug = null;
	
	public Row(int index, Double x, Double y) 
	{
		this.index = index;
		this.x = x;
		this.y = y;
	}

	//TODO probably point p is not needed as the point from previous step is stored in lastP?
	public abstract String handle(mxPoint p, Shape shape);

	public Double getX() 
	{
		return x;
	}

	public Double getY() 
	{
		return y;
	}

	public Double getA() {
		return a;
	}

	public Double getB() {
		return b;
	}

	public Double getC() {
		return c;
	}

	public Double getD() {
		return d;
	}

	public String getFormulaA() {
		return formulaA;
	}

	public String getFormulaE() {
		return formulaE;
	}

	public int getIndex() 
	{
		return index;
	}
}
