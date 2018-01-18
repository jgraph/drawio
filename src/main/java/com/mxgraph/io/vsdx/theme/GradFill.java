package com.mxgraph.io.vsdx.theme;

import java.util.ArrayList;

import org.w3c.dom.Element;

import com.mxgraph.io.vsdx.mxVsdxTheme;
import com.mxgraph.io.vsdx.mxVsdxUtils;

//mxGraph doesn't support such a complex gradient fill style. So, we will approximate the gradient by the first two colors only
public class GradFill  implements FillStyle 
{
	private OoxmlColor color1 = null, color2 = null;
	
	public GradFill(Element elem) 
	{
		ArrayList<Element> gsLst = mxVsdxUtils.getDirectChildNamedElements(elem, "a:gsLst");
		
		if (gsLst.size() > 0)
		{
			ArrayList<Element> gs = mxVsdxUtils.getDirectChildElements(gsLst.get(0));
			
			//approximate gradient by first and last color in the list
			if (gs.size() >= 2)
			{
				color2 = OoxmlColorFactory.getOoxmlColor(
						mxVsdxUtils.getDirectFirstChildElement(gs.get(0)));
				color1 = OoxmlColorFactory.getOoxmlColor(
						mxVsdxUtils.getDirectFirstChildElement(gs.get(gs.size()-1)));
			}
		}
		
		if (color1 == null)
		{
			color1 = color2 = new SrgbClr("FFFFFF");
		}
	}
	
	@Override
	public Color applyStyle(int styleValue, mxVsdxTheme theme)
	{
		Color color = color1.getColor(styleValue, theme);
		color.setGradientClr(color2.getColor(styleValue, theme));
		return color;
	}
	
}
