package com.mxgraph.io.vsdx.theme;

import com.mxgraph.io.vsdx.mxVsdxTheme;

public class SchemeClr extends OoxmlColor 
{
	private String val;

//	bg1	Background Color 1
//	tx1	Text Color 1
//	bg2	Background Color 2
//	tx2	Text Color 2
//	accent1	Accent Color 1
//	accent2	Accent Color 2
//	accent3	Accent Color 3
//	accent4	Accent Color 4
//	accent5	Accent Color 5
//	accent6	Accent Color 6
//	hlink	Hyperlink Color
//	folHlink	Followed Hyperlink Color
//	phClr	Style Color
//	dk1	Dark Color 1
//	lt1	Light Color 1
//	dk2	Dark Color 2
//	lt2	Light Color 2
	
	public SchemeClr(String val) 
	{
		isDynamic = true;
		this.val = val;		
	}
	
	protected void calcColor(int styleColor, mxVsdxTheme theme) 
	{
		if (!"phClr".equals(val)) 
		{
			color = theme.getSchemeColor(val);
			isDynamic = false;
		} else {
			color = theme.getStyleColor(styleColor);
		}
		super.calcColor(styleColor, theme);
	}
	
}
