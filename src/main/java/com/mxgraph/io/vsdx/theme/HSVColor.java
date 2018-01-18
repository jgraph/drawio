package com.mxgraph.io.vsdx.theme;

public class HSVColor {
	private double h, s, v;

	public HSVColor(double h, double s, double v) {
		this.h = h;
		this.s = s;
		this.v = v;
	}
	
	public Color toRgb() 
	{
		double h = this.h * 6;
		double s = this.s;
		double l = this.v;

	    double i = Math.floor(h);
	    double f = h - i, p = v * (1 - s);
	    double q = v * (1 - f * s), t = v * (1 - (1 - f) * s);
	    int mod = (int)i % 6;
	    
	    double[] rArr = {v, q, p, p, t, v};
	    double[] gArr = {t, v, v, q, p, p};
	    double[] bArr = {p, p, t, v, v, q};
	    double r = rArr[mod], g = gArr[mod], b = bArr[mod];

	    return new Color((int) (r * 255), (int) (g * 255), (int) (b * 255));
	}

	// Force a number between 0 and 1
	private double clamp01(double val) 
	{
	    return Math.min(1, Math.max(0, val));
	}

	//lighten or tint
	public HSVColor tint (int amount) 
	{
	    this.v *= (1 + (amount / 100.0));
	    this.v = clamp01(this.v);
	    return this;
	}

	//darken or shade
	public HSVColor shade(int amount) 
	{
		this.v *= amount / 100.0;
		this.v = clamp01(this.v);
	    return this;
	}

	public HSVColor satMod(int amount) 
	{
		this.s *= amount / 100.0;
		this.s = clamp01(this.s);
	    return this;
	}

	public HSVColor lumMod(int amount) 
	{
		this.v *= amount / 100.0;
		this.v = clamp01(this.v);
	    return this;
	}

	public HSVColor hueMod(int amount) 
	{
		this.h *= amount / 100.0;
		this.h = clamp01(this.h);
	    return this;
	}
}
