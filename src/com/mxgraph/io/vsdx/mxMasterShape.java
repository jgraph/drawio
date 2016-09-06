package com.mxgraph.io.vsdx;

import org.w3c.dom.Element;

/**
 * This class is a wrapper for a shape element.<br/>
 * Contains references to the stylesheets indicated in the shape.<br/>
 * If a property is not found in the shape Element but it may be found in a stylesheet,
 * the property is searched in such stylesheet.
 */
public class mxMasterShape extends Shape
{
	public mxMasterShape(Element s, mxVsdxModel model)
	{
		super(s, model);
	}

	@Override
	public String getTextColor(String charIX)
	{
		if (super.hasTextColor(charIX))
		{
			return super.getTextColor(charIX);
		}
		else if (textParent != null)
		{
			return textParent.getTextColor(charIX);
		}
		
		return "#000000";
	}

	@Override
	public boolean hasTextColor(String charIX)
	{
		boolean has = super.hasTextColor(charIX);
		
		if ((textParent != null) && !has)
		{
			has = textParent.hasTextColor(charIX);
		}
		
		return has;
	}

	@Override
	public String getTextFont(String charIX)
	{
		if (super.hasTextFont(charIX))
		{
			return super.getTextFont(charIX);
		}
		else if (textParent != null)
		{
			return textParent.getTextFont(charIX);
		}
		
		return "";
	}

	@Override
	public String getTextSize(String charIX)
	{
		if (super.hasTextSize(charIX))
		{
			return super.getTextSize(charIX);
		}
		else if (textParent != null)
		{
			return textParent.getTextSize(charIX);
		}
		
		return "";
	}

	@Override
	public boolean hasTextFont(String charIX)
	{
		boolean has = super.hasTextFont(charIX);
		
		if ((textParent != null) && !has)
		{
			has = textParent.hasTextFont(charIX);
		}
		
		return has;
	}

	@Override
	public boolean hasTextSize(String charIX)
	{
		boolean has = super.hasTextSize(charIX);
		
		if ((textParent != null) && !has)
		{
			has = textParent.hasTextSize(charIX);
		}
		
		return has;
	}

	@Override
	public int getTextPos(String charIX)
	{
		if (super.hasTextPos(charIX))
		{
			return super.getTextPos(charIX);
		}
		else if (textParent != null)
		{
			return textParent.getTextPos(charIX);
		}
		
		return 0;
	}

	@Override
	public boolean getTextStrike(String charIX)
	{
		if (super.hasTextStrike(charIX))
		{
			return super.getTextStrike(charIX);
		}
		else if (textParent != null)
		{
			return textParent.getTextStrike(charIX);
		}
		
		return false;
	}

	@Override
	public String getTextStyle(String charIX)
	{
		if (super.hasTextStyle(charIX))
		{
			return super.getTextStyle(charIX);
		}
		else if (textParent != null)
		{
			return textParent.getTextStyle(charIX);
		}
		
		return "";
	}

	@Override
	public boolean hasTextPos(String charIX)
	{
		boolean has = super.hasTextPos(charIX);
		
		if ((textParent != null) && !has)
		{
			has = textParent.hasTextPos(charIX);
		}
		
		return has;
	}

	@Override
	public boolean hasTextStrike(String charIX)
	{
		boolean has = super.hasTextPos(charIX);
		
		if ((textParent != null) && !has)
		{
			has = textParent.hasTextPos(charIX);
		}
		
		return has;
	}

	@Override
	public boolean hasTextStyle(String charIX)
	{
		boolean has = super.hasTextStyle(charIX);
		
		if ((textParent != null) && !has)
		{
			has = textParent.hasTextStyle(charIX);
		}
		
		return has;
	}

	@Override
	public int getHorizontalAlign(String paraIX)
	{
		if (super.hasHorizontalAlign(paraIX))
		{
			return super.getHorizontalAlign(paraIX);
		}
		else if (textParent != null)
		{
			return textParent.getHorizontalAlign(paraIX);
		}
		
		return 0;
	}

	@Override
	public String getIndentFirst(String paraIX)
	{
		if (super.hasIndentFirst(paraIX))
		{
			return super.getIndentFirst(paraIX);
		}
		else if (textParent != null)
		{
			return textParent.getIndentFirst(paraIX);
		}
		
		return "0";
	}

	@Override
	public boolean hasHorizontalAlign(String paraIX)
	{
		boolean has = super.hasHorizontalAlign(paraIX);
		
		if ((textParent != null) && !has)
		{
			has = textParent.hasHorizontalAlign(paraIX);
		}
		
		return has;
	}

	@Override
	public boolean hasIndentFirst(String paraIX)
	{
		boolean has = super.hasHorizontalAlign(paraIX);
		
		if ((textParent != null) && !has)
		{
			has = textParent.hasHorizontalAlign(paraIX);
		}
		
		return has;
	}

	@Override
	public String getIndentLeft(String paraIX)
	{
		if (super.hasIndentLeft(paraIX))
		{
			return super.getIndentLeft(paraIX);
		}
		else if (textParent != null)
		{
			return textParent.getIndentLeft(paraIX);
		}
		
		return "0";
	}

	@Override
	public boolean hasIndentLeft(String paraIX)
	{
		boolean has = super.hasIndentLeft(paraIX);
		
		if ((textParent != null) && !has)
		{
			has = textParent.hasIndentLeft(paraIX);
		}
		
		return has;
	}

	@Override
	public String getIndentRight(String paraIX)
	{
		if (super.hasIndentRight(paraIX))
		{
			return super.getIndentRight(paraIX);
		}
		else if (textParent != null)
		{
			return textParent.getIndentRight(paraIX);
		}
		
		return "0";
	}

	@Override
	public boolean hasIndentRight(String paraIX)
	{
		boolean has = super.hasIndentRight(paraIX);
		
		if ((textParent != null) && !has)
		{
			has = textParent.hasIndentRight(paraIX);
		}
		
		return has;
	}

	@Override
	public String getSpAfter(String paraIX)
	{
		if (super.hasSpAfter(paraIX))
		{
			return super.getSpAfter(paraIX);
		}
		else if (textParent != null)
		{
			return textParent.getSpAfter(paraIX);
		}
		
		return "0";
	}

	@Override
	public String getSpBefore(String paraIX)
	{
		if (super.hasSpBefore(paraIX))
		{
			return super.getSpBefore(paraIX);
		}
		else if (textParent != null)
		{
			return textParent.getSpBefore(paraIX);
		}
		
		return "0";
	}

	@Override
	public boolean hasSpAfter(String paraIX)
	{
		boolean has = super.hasSpAfter(paraIX);
		
		if ((textParent != null) && !has)
		{
			has = textParent.hasSpAfter(paraIX);
		}
		
		return has;
	}

	@Override
	public boolean hasSpBefore(String paraIX)
	{
		boolean has = super.hasSpBefore(paraIX);
		
		if ((textParent != null) && !has)
		{
			has = textParent.hasSpBefore(paraIX);
		}
		
		return has;
	}

	@Override
	public double getSpLine(String paraIX)
	{
		if (super.hasSpLine(paraIX))
		{
			return super.getSpLine(paraIX);
		}
		else if (textParent != null)
		{
			return textParent.getSpLine(paraIX);
		}
		
		return 0;
	}

	@Override
	public boolean hasSpLine(String paraIX)
	{
		boolean has = super.hasSpLine(paraIX);
		
		if ((textParent != null) && !has)
		{
			has = textParent.hasSpLine(paraIX);
		}
		
		return has;
	}

	@Override
	public String getRTLText(String paraIX)
	{
		if (super.hasRTLText(paraIX))
		{
			return super.getRTLText(paraIX);
		}
		else if (textParent != null)
		{
			return textParent.getRTLText(paraIX);
		}
		
		return "ltr";
	}

	@Override
	public boolean hasRTLText(String paraIX)
	{
		boolean has = super.hasRTLText(paraIX);
		
		if ((textParent != null) && !has)
		{
			has = textParent.hasRTLText(paraIX);
		}
		
		return has;
	}

	@Override
	public String getFlags(String paraIX)
	{
		if (super.hasFlags(paraIX))
		{
			return super.getFlags(paraIX);
		}
		else if (textParent != null)
		{
			return textParent.getFlags(paraIX);
		}
		
		return "ltr";
	}

	@Override
	public boolean hasFlags(String paraIX)
	{
		boolean has = super.hasFlags(paraIX);
		
		if ((textParent != null) && !has)
		{
			has = textParent.hasFlags(paraIX);
		}
		
		return has;
	}

	@Override
	public String getLetterSpace(String paraIX)
	{
		if (super.hasLetterSpace(paraIX))
		{
			return super.getLetterSpace(paraIX);
		}
		else if (textParent != null)
		{
			return textParent.getLetterSpace(paraIX);
		}
		
		return "";
	}

	@Override
	public boolean hasLetterSpace(String paraIX)
	{
		boolean has = super.hasLetterSpace(paraIX);
		
		if ((textParent != null) && !has)
		{
			has = textParent.hasLetterSpace(paraIX);
		}
		
		return has;
	}
}
