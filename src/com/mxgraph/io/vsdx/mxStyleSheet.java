package com.mxgraph.io.vsdx;

import org.w3c.dom.Element;

/**
 * This class is a wrapper for a stylesheet element.<br/>
 * The Stylesheet element is treated like a shape element.<br/>
 * If a property is not found in the shape element but it may be found in a stylesheet,
 * the property is searched in such stylesheet.<br/>
 * All  method that recieve a index like param ignores it. Stylesheets only have
 * one element of each class.
 */
public class mxStyleSheet extends Shape
{
	public mxStyleSheet(Element s, mxVsdxModel model)
	{
		super(s, model);
	}

	@Override
	public String getFlags(String paraIX)
	{
		return super.getFlags("0");
	}

	@Override
	public int getHorizontalAlign(String paraIX)
	{
		return super.getHorizontalAlign("0");
	}

	@Override
	public String getIndentFirst(String paraIX)
	{
		return super.getIndentFirst("0");
	}

	@Override
	public String getIndentLeft(String paraIX)
	{
		return super.getIndentLeft("0");
	}

	@Override
	public String getIndentRight(String paraIX)
	{
		return super.getIndentRight("0");
	}

	@Override
	public String getLetterSpace(String paraIX)
	{
		return super.getLetterSpace("0");
	}

	@Override
	public String getRTLText(String paraIX)
	{
		return super.getRTLText("0");
	}

	@Override
	public String getSpAfter(String paraIX)
	{
		return super.getSpAfter("0");
	}

	@Override
	public String getSpBefore(String paraIX)
	{
		return super.getSpBefore("0");
	}

	@Override
	public double getSpLine(String paraIX)
	{
		return super.getSpLine("0");
	}

	@Override
	public String getTextColor(String charIX)
	{
		return super.getTextColor("0");
	}

	@Override
	public String getTextFont(String charIX)
	{
		return super.getTextFont("0");
	}

	@Override
	public String getTextSize(String charIX)
	{
		return super.getTextSize("0");
	}

	@Override
	public boolean getTextStrike(String charIX)
	{
		return super.getTextStrike("0");
	}

	@Override
	public String getTextStyle(String charIX)
	{
		return super.getTextStyle("0");
	}

	@Override
	public boolean hasFlags(String paraIX)
	{
		return super.hasFlags("0");
	}

	@Override
	public boolean hasHorizontalAlign(String paraIX)
	{
		return super.hasHorizontalAlign("0");
	}

	@Override
	public boolean hasIndentFirst(String paraIX)
	{
		return super.hasIndentFirst("0");
	}

	@Override
	public boolean hasIndentLeft(String paraIX)
	{
		return super.hasIndentLeft("0");
	}

	@Override
	public boolean hasIndentRight(String paraIX)
	{
		return super.hasIndentRight("0");
	}

	@Override
	public boolean hasLetterSpace(String paraIX)
	{
		return super.hasLetterSpace("0");
	}

	@Override
	public boolean hasSpAfter(String paraIX)
	{
		return super.hasSpAfter("0");
	}

	@Override
	public boolean hasSpBefore(String paraIX)
	{
		return super.hasSpBefore("0");
	}

	@Override
	public boolean hasSpLine(String paraIX)
	{
		return super.hasSpLine("0");
	}

	@Override
	public boolean hasTextFont(String charIX)
	{
		return super.hasTextFont("0");
	}

	@Override
	public boolean hasTextPos(String charIX)
	{
		return super.hasTextPos("0");
	}

	@Override
	public boolean hasTextSize(String charIX)
	{
		return super.hasTextSize("0");
	}

	@Override
	public boolean hasTextStrike(String charIX)
	{
		return super.hasTextStrike("0");
	}

	@Override
	public boolean hasTextStyle(String charIX)
	{
		return super.hasTextStyle("0");
	}
}
