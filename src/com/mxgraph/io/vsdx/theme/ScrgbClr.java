package com.mxgraph.io.vsdx.theme;


public class ScrgbClr extends OoxmlColor{	
	private int r,g,b;
	
	
	public ScrgbClr(int r, int g, int b) {
		this.r = r;
		this.g = g;
		this.b = b;
		color = new Color(r, g, b);
	}
}
