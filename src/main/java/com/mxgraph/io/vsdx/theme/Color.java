package com.mxgraph.io.vsdx.theme;

public class Color {
	//Special none color
	public static final Color NONE = new Color(-1, -1, -1);
	
	private int red, green, blue;
	private Color gradientClr;
	
	public Color(int red, int green, int blue) {
		this.red = red;
		this.green = green;
		this.blue = blue;
	}

	public int getRed() {
		return red;
	}

	public void setRed(int red) {
		this.red = red;
	}

	public int getGreen() {
		return green;
	}

	public void setGreen(int green) {
		this.green = green;
	}

	public int getBlue() {
		return blue;
	}

	public void setBlue(int blue) {
		this.blue = blue;
	}
	
	public HSLColor toHsl() 
	{
		double r = this.getRed()/255.0, g = this.getGreen()/255.0, b = this.getBlue()/255.0;
	    double max = Math.max(r, Math.max(g, b));
	    double min = Math.min(r, Math.min(g, b));
	    double l = (max + min) / 2.0;
	    double h, s; 

	    if(max == min) 
	    {
	        h = s = 0; // achromatic
	    }
	    else 
	    {
	        double d = max - min;
	        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
	        if (max == r) 
	        {
	        	h = (g - b) / d + (g < b ? 6 : 0); 
	        }
	        else if (max == g) 
	        {
	            h = (b - r) / d + 2;
	        }
	        else 
	        {
            	h = (r - g) / d + 4;
	        }

	        h /= 6;
	    }
        return new HSLColor(h, s, l);
    }
	
	public HSVColor toHsv()
	{
		double r = this.getRed()/255.0, g = this.getGreen()/255.0, b = this.getBlue()/255.0;
	    double max = Math.max(r, Math.max(g, b));
	    double min = Math.min(r, Math.min(g, b));
	    double h, s, v = max;

	    double d = max - min;
	    s = max == 0 ? 0 : d / max;

	    if(max == min) 
	    {
	        h = 0; // achromatic
	    }
	    else 
	    {
	        if (max == r) 
	        {
	        	h = (g - b) / d + (g < b ? 6 : 0); 
	        }
	        else if (max == g) 
	        {
	        	h = (b - r) / d + 2;
	        }
	        else 
	        {
	        	h = (r - g) / d + 4;
	        }
	        h /= 6;
		}
	    return new HSVColor(h, s, v);
	}
	
	public static Color decodeColorHex(String hex) 
	{
		int color = Integer.parseInt(hex, 16);
		return new Color((color >> 16) & 0xff , (color >> 8) & 0xff, color & 0xff);
	}

	public String toHexStr() {
		return String.format("#%02x%02x%02x", red, green, blue);
	}

	public Color getGradientClr() {
		return gradientClr;
	}

	public void setGradientClr(Color gradientClr) {
		this.gradientClr = gradientClr;
	}
}
