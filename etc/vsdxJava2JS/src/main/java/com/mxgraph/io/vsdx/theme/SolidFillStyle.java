package com.mxgraph.io.vsdx.theme;

import com.mxgraph.io.vsdx.mxVsdxTheme;

public class SolidFillStyle implements FillStyle
{
	
	private OoxmlColor color;
	
	public SolidFillStyle(OoxmlColor color) 
	{
		this.color = color;
	}
	
	@Override
	public Color applyStyle(int styleValue, mxVsdxTheme theme) 
	{
		return color.getColor(styleValue, theme);
	}
}
