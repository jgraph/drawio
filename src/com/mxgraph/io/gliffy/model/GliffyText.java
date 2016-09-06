package com.mxgraph.io.gliffy.model;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class GliffyText
{

	private String html;

	private String valign;

	private String vposition;

	private String hposition;

	private Integer paddingLeft;

	private Integer paddingRight;

	private Integer paddingBottom;

	private Integer paddingTop;

	public double lineTValue;

	public Integer linePerpValue;

	private static Pattern pattern = Pattern.compile("<p(.*?)<\\/p>");

	private static Pattern textAlignPattern = Pattern.compile(
			".*text-align: ?(left|center|right).*", Pattern.DOTALL);

	public GliffyText()
	{
	}

	public String getHtml()
	{
		return replaceParagraphWithDiv(html);
	}

	public void setHtml(String html)
	{
		this.html = html;
	}

	public String getStyle()
	{
		StringBuilder sb = new StringBuilder();

		if (vposition.equals("above"))
		{
			sb.append("verticalLabelPosition=top;").append(
					"verticalAlign=bottom;");
		}
		else if (vposition.equals("below"))
		{
			sb.append("verticalLabelPosition=bottom;").append(
					"verticalAlign=top;");
		}
		else if (vposition.equals("none"))
		{
			sb.append("verticalAlign=").append(valign).append(";");
		}

		if (hposition.equals("left"))
		{
			sb.append("labelPosition=left;").append("align=right;");
		}
		else if (hposition.equals("right"))
		{
			sb.append("labelPosition=right;").append("align=left;");
		}
		else if (hposition.equals("none"))
		{
			String hAlign = getHorizontalTextAlignment();
			if (hAlign != null)
			{
				sb.append("align=").append(hAlign).append(";");
			}
		}

		sb.append("spacingLeft=").append(paddingLeft).append(";");
		sb.append("spacingRight=").append(paddingRight).append(";");
		sb.append("spacingTop=").append(paddingTop).append(";");
		sb.append("spacingBottom=").append(paddingBottom).append(";");

		return sb.toString();
	}

	private String replaceParagraphWithDiv(String html)
	{
		Matcher m = pattern.matcher(html);
		StringBuilder sb = new StringBuilder();
		while (m.find())
		{
			sb.append("<div" + m.group(1) + "</div>");
		}

		return sb.length() > 0 ? sb.toString() : html;
	}

	private String getHorizontalTextAlignment()
	{
		Matcher m = textAlignPattern.matcher(html);

		if (m.matches())
		{
			return m.group(1);
		}

		return null;
	}

}
