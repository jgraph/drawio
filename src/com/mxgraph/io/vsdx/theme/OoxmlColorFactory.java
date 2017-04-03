package com.mxgraph.io.vsdx.theme;

import java.util.ArrayList;

import org.w3c.dom.Element;

import com.mxgraph.io.vsdx.mxVsdxUtils;

public class OoxmlColorFactory {

	//TODO Refactor the code such that each class parse itself
	public static OoxmlColor getOoxmlColor(Element element)
	{
		OoxmlColor color = null;
		String nodeName = element.getNodeName();
		switch (nodeName)
		{
			case "a:scrgbClr":
				color = new ScrgbClr(
						Integer.parseInt(element.getAttribute("r")), 
						Integer.parseInt(element.getAttribute("g")), 
						Integer.parseInt(element.getAttribute("b")));
			break;
			case "a:srgbClr":
				color = new SrgbClr(element.getAttribute("val"));
			break;
			case "a:hslClr":
				color = new HslClr(
						Integer.parseInt(element.getAttribute("hue")), 
						Integer.parseInt(element.getAttribute("sat")), 
						Integer.parseInt(element.getAttribute("lum")));
			break;
			case "a:sysClr":
				color = new SysClr(
						element.getAttribute("val"),
						element.getAttribute("lastClr")
						);
			break;
			case "a:schemeClr":
				color = new SchemeClr(element.getAttribute("val"));
			break;
			case "a:prstClr":
				color = new SrgbClr(element.getAttribute("val"));
			break;
			
		}
		
		ArrayList<Element> effects = mxVsdxUtils.getDirectChildElements(element);
		
		for (Element effect : effects)
		{
			int effVal = Integer.parseInt(effect.getAttribute("val")) / 1000; //these values are multiplied by 10,000 so we divide by 1,000 to keep the percentage only
			String effName = effect.getNodeName();
			switch(effName)
			{
				case "a:tint":
					color.setTint(effVal);
				break;
				case "a:shade":
					color.setShade(effVal);
				break;
				case "a:satMod":
					color.setSatMod(effVal);
				break;
				case "a:lumMod":
					color.setLumMod(effVal);
				break;
				case "a:hueMod":
					color.setHueMod(effVal);
				break;
				//TODO complete the list when supported
//				a:comp    Complement
//				a:inv    Inverse
//				a:gray    Gray
//				a:alpha    Alpha
//				a:alphaOff    Alpha Offset
//				a:alphaMod    Alpha Modulation
//				a:hue    Hue
//				a:hueOff    Hue Offset
//				a:sat    Saturation
//				a:satOff    Saturation Offset
//				a:lum    Luminance
//				a:lumOff    Luminance Offset
//				a:red    Red
//				a:redOff    Red Offset
//				a:redMod    Red Modulation
//				a:green    Green
//				a:greenOff    Green Offset
//				a:greenMod    Green Modification
//				a:blue    Blue
//				a:blueOff    Blue Offset
//				a:blueMod    Blue Modification
//				a:gamma    Gamma
//				a:invGamma    Inverse Gamma
			}
		}
		return color;

	}
}
