package com.mxgraph.io.vsdx.theme;

import java.util.ArrayList;

import org.w3c.dom.Element;

import com.mxgraph.io.vsdx.Style;
import com.mxgraph.io.vsdx.mxVsdxUtils;

public class LineStyleExt {

	private int rndg = 0, start = 0, startSize = 0, end = 0, endSize = 0, pattern = 0;
	private ArrayList<Double> lineDashPattern;

	public LineStyleExt(Element elem)
	{
		Element lineEx = mxVsdxUtils.getDirectFirstChildElement(elem); //vt:lineEx element of vt:lineStyle
		
		//parse the line style ext xml
		rndg = mxVsdxUtils.getIntAttr(lineEx, "rndg");
		start = mxVsdxUtils.getIntAttr(lineEx, "start");
		startSize = mxVsdxUtils.getIntAttr(lineEx, "startSize");
		end = mxVsdxUtils.getIntAttr(lineEx, "end");
		endSize = mxVsdxUtils.getIntAttr(lineEx, "endSize");
		pattern = mxVsdxUtils.getIntAttr(lineEx, "pattern");
		lineDashPattern = Style.getLineDashPattern(pattern);
	}

	public int getRndg() 
	{
		return rndg;
	}

	public int getStart() 
	{
		return start;
	}

	public int getStartSize() 
	{
		return startSize;
	}

	public int getEnd() 
	{
		return end;
	}

	public int getEndSize() 
	{
		return endSize;
	}

	public boolean isDashed()
	{
		return pattern > 1;
	}
	
	public ArrayList<Double> getLineDashPattern()
	{
		return lineDashPattern;
	}
}
