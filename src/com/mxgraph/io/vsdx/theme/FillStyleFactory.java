package com.mxgraph.io.vsdx.theme;

import org.w3c.dom.Element;

import com.mxgraph.io.vsdx.mxVsdxUtils;

public class FillStyleFactory 
{
	public static FillStyle getFillStyle(Element fillStyle)
	{
		FillStyle fillObj = null;
		switch (fillStyle.getNodeName())
		{
			case "a:solidFill":
				fillObj = new SolidFillStyle(OoxmlColorFactory.getOoxmlColor(
						mxVsdxUtils.getDirectFirstChildElement(fillStyle)));
			break;
			case "a:noFill":
				fillObj = new NoFillStyle();
			break;
			case "a:gradFill":
				fillObj = new GradFill(fillStyle);
			break;
			case "a:blipFill":
				//TODO implement Picture Fill if it can be approximated in mxGraph
			break;
			case "a:pattFill":
				//TODO implement Pattern Fill if it can be approximated in mxGraph
			break;
			case "a:grpFill":
				//TODO implement Group Fill if it can be approximated in mxGraph
			break;
		}
		return fillObj;
	}
}
