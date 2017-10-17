package com.mxgraph.io.vsdx.theme;

public class HSLColor 
{
	private double hue, sat, lum;

	public HSLColor(double hue, double sat, double lum) 
	{
		this.hue = hue;
		this.sat = sat;
		this.lum = lum;
	}
	
	public double getHue() {
		return hue;
	}



	public void setHue(double hue) {
		this.hue = hue;
	}



	public double getSat() {
		return sat;
	}



	public void setSat(double sat) {
		this.sat = sat;
	}



	public double getLum() {
		return lum;
	}



	public void setLum(double lum) {
		this.lum = lum;
	}

	private double hue2rgb(double p, double q, double t)
	{
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1/6.0) return p + (q - p) * 6 * t;
        if (t < 0.5) return q;
        if (t < 2/3.0) return p + (q - p) * (2/3.0 - t) * 6;
        return p;
    }

	public Color toRgb() 
	{
		double r, g, b;

		double h = this.hue;
		double s = this.sat;
		double l = this.lum;


	    if(s == 0) 
	    {
	        r = g = b = l; // achromatic
	    }
	    else 
	    {
	        double q = l < 0.5 ? l * (1 + s) : l + s - l * s;
	        double p = 2 * l - q;
	        r = hue2rgb(p, q, h + 1/3.0);
	        g = hue2rgb(p, q, h);
	        b = hue2rgb(p, q, h - 1/3.0);
	    }

	    return new Color((int) (r * 255), (int) (g * 255), (int) (b * 255));
	}

	// Force a number between 0 and 1
	private double clamp01(double val) 
	{
	    return Math.min(1, Math.max(0, val));
	}

	//lighten or tint
	public HSLColor tint (int amount) 
	{
//	    HSLColor hsl = color.toHsl();
	    this.lum *= (1 + (amount / 100.0));
	    this.lum = clamp01(this.lum);
	    return this;
	}

	//darken or shade
	public HSLColor shade(int amount) 
	{
		this.lum *= amount / 100.0;
		this.lum = clamp01(this.lum);
	    return this;
	}

	public HSLColor satMod(int amount) 
	{
		this.sat *= amount / 100.0;
		this.sat = clamp01(this.sat);
	    return this;
	}

	public HSLColor lumMod(int amount) 
	{
		this.lum *= amount / 100.0;
		this.lum = clamp01(this.lum);
	    return this;
	}

}
