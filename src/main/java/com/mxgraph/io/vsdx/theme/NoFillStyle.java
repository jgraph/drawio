package com.mxgraph.io.vsdx.theme;

import com.mxgraph.io.vsdx.mxVsdxTheme;

public class NoFillStyle implements FillStyle
{

	@Override
	public Color applyStyle(int styleValue, mxVsdxTheme theme) 
	{
		return Color.NONE;
	}

}
	