package com.mxgraph.io.vsdx.theme;

import com.mxgraph.io.vsdx.mxVsdxTheme;

abstract public class OoxmlColor 
{
//	a:tint    Tint
	private int tint = 0;
//	a:shade    Shade
	private int shade = 0;
//	a:comp    Complement
	private int comp = 0;
//	a:inv    Inverse
	private int inv = 0;
//	a:gray    Gray
	private int gray = 0;
//	a:alpha    Alpha
	private int alpha = 0;
//	a:alphaOff    Alpha Offset
	private int alphaOff = 0;
//	a:alphaMod    Alpha Modulation
	private int alphaMod = 0;
//	a:hue    Hue
	private int hue = 0;
//	a:hueOff    Hue Offset
	private int hueOff = 0;
//	a:hueMod    Hue Modulate
	private int hueMod = 0;
//	a:sat    Saturation
	private int sat = 0;
//	a:satOff    Saturation Offset
	private int satOff = 0;
//	a:satMod    Saturation Modulation
	private int satMod = 0;
//	a:lum    Luminance
	private int lum = 0;
//	a:lumOff    Luminance Offset
	private int lumOff = 0;
//	a:lumMod    Luminance Modulation
	private int lumMod = 0;
//	a:red    Red
	private int red = 0;
//	a:redOff    Red Offset
	private int redOff = 0;
//	a:redMod    Red Modulation
	private int redMod = 0;
//	a:green    Green
	private int green = 0;
//	a:greenOff    Green Offset
	private int greenOff = 0;
//	a:greenMod    Green Modification
	private int greenMod = 0;
//	a:blue    Blue
	private int blue = 0;
//	a:blueOff    Blue Offset
	private int blueOff = 0;
//	a:blueMod    Blue Modification
	private int blueMod = 0;
//	a:gamma    Gamma
	private int gamma = 0;
//	a:invGamma    Inverse Gamma
	private int invGamma = 0;

	protected Color color;
	
	protected boolean isDynamic = false;
	
	protected boolean isInitialized = false;
	
	protected boolean hasEffects = false;
	
	protected void calcColor(int styleColor, mxVsdxTheme theme) 
	{
		if (hasEffects)
		{
			//TODO complete the list of effects
			//currently we support tint, shade, satMod, lumMod 
//			HSLColor hslColor = color.toHsl();
//			if (tint != 0)
//			{
//				hslColor.tint(tint);
//			}
//			if (shade != 0)
//			{
//				hslColor.shade(shade);
//			}
//			if (satMod != 0)
//			{
//				hslColor.satMod(satMod);
//			}
//			if (lumMod != 0)
//			{
//				hslColor.lumMod(lumMod);
//			}
//			color = hslColor.toRgb();

		
			HSVColor hsvColor = color.toHsv();
			if (tint != 0)
			{
				hsvColor.tint(tint);
			}
			if (shade != 0)
			{
				hsvColor.shade(shade);
			}
			if (satMod != 0)
			{
				hsvColor.satMod(satMod);
			}
			if (lumMod != 0)
			{
				//TODO this may be better done in HSL color format
				hsvColor.lumMod(lumMod);
			}
			if (hueMod != 0)
			{
				hsvColor.hueMod(hueMod);
			}
			color = hsvColor.toRgb();
		}
	}
	
	public Color getColor(int styleColor, mxVsdxTheme theme) 
	{
		if (isDynamic || !isInitialized)
		{
			calcColor(styleColor, theme);
			isInitialized = true;
		}
		return color;
	}

	public Color getColor(mxVsdxTheme theme) 
	{
		return getColor(-1, theme);
	}

	public void setTint(int tint) {
		this.tint = tint;
		hasEffects = true;
	}

	public void setShade(int shade) {
		this.shade = shade;
		hasEffects = true;
	}

	public void setComp(int comp) {
		this.comp = comp;
		hasEffects = true;
	}

	public void setInv(int inv) {
		this.inv = inv;
		hasEffects = true;
	}

	public void setGray(int gray) {
		this.gray = gray;
		hasEffects = true;
	}

	public void setAlpha(int alpha) {
		this.alpha = alpha;
		hasEffects = true;
	}

	public void setAlphaOff(int alphaOff) {
		this.alphaOff = alphaOff;
		hasEffects = true;
	}

	public void setAlphaMod(int alphaMod) {
		this.alphaMod = alphaMod;
		hasEffects = true;
	}

	public void setHue(int hue) {
		this.hue = hue;
		hasEffects = true;
	}

	public void setHueOff(int hueOff) {
		this.hueOff = hueOff;
		hasEffects = true;
	}

	public void setHueMod(int hueMod) {
		this.hueMod = hueMod;
		hasEffects = true;
	}

	public void setSat(int sat) {
		this.sat = sat;
		hasEffects = true;
	}

	public void setSatOff(int satOff) {
		this.satOff = satOff;
		hasEffects = true;
	}

	public void setSatMod(int satMod) {
		this.satMod = satMod;
		hasEffects = true;
	}

	public void setLum(int lum) {
		this.lum = lum;
		hasEffects = true;
	}

	public void setLumOff(int lumOff) {
		this.lumOff = lumOff;
		hasEffects = true;
	}

	public void setLumMod(int lumMod) {
		this.lumMod = lumMod;
		hasEffects = true;
	}

	public void setRed(int red) {
		this.red = red;
		hasEffects = true;
	}

	public void setRedOff(int redOff) {
		this.redOff = redOff;
		hasEffects = true;
	}

	public void setRedMod(int redMod) {
		this.redMod = redMod;
		hasEffects = true;
	}

	public void setGreen(int green) {
		this.green = green;
		hasEffects = true;
	}

	public void setGreenOff(int greenOff) {
		this.greenOff = greenOff;
		hasEffects = true;
	}

	public void setGreenMod(int greenMod) {
		this.greenMod = greenMod;
		hasEffects = true;
	}

	public void setBlue(int blue) {
		this.blue = blue;
		hasEffects = true;
	}

	public void setBlueOff(int blueOff) {
		this.blueOff = blueOff;
		hasEffects = true;
	}

	public void setBlueMod(int blueMod) {
		this.blueMod = blueMod;
		hasEffects = true;
	}

	public void setGamma(int gamma) {
		this.gamma = gamma;
		hasEffects = true;
	}

	public void setInvGamma(int invGamma) {
		this.invGamma = invGamma;
		hasEffects = true;
	}
}
