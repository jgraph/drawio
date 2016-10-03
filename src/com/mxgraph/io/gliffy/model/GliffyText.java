package com.mxgraph.io.gliffy.model;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class GliffyText
{

	private String html;

	private String valign;
	
	//extracted from html
	private String halign;

	private String vposition;

	private String hposition;

	private Integer paddingLeft;

	private Integer paddingRight;

	private Integer paddingBottom;

	private Integer paddingTop;

	public double lineTValue;

	public Integer linePerpValue;

	private static Pattern pattern = Pattern.compile("<p(.*?)<\\/p>");

	private static Pattern textAlign = Pattern.compile(".*(text-align: ?(left|center|right);).*", Pattern.DOTALL);

	public GliffyText()
	{
	}

	public String getHtml()
	{
		halign = halign == null ? getHorizontalTextAlignment() : halign;
		return replaceParagraphWithDiv(html);
	}

	//this is never invoked by Gson builder
	public void setHtml(String html)
	{
	}

	public String getStyle()
	{
		StringBuilder sb = new StringBuilder();

		//vertical label position
		if (vposition.equals("above"))
			sb.append("verticalLabelPosition=top;");
		else if (vposition.equals("below"))
			sb.append("verticalLabelPosition=bottom;");
		else if (vposition.equals("none"))
			sb.append("verticalLabelPosition=middle;");
		
		//vertical label align
		sb.append("verticalAlign=").append(valign).append(";");
		
		//horizontal label position
		if (hposition.equals("none"))
			sb.append("labelPosition=center;");
		else 
			sb.append("labelPosition=").append(hposition).append(";");
		
		//horizontal label align
		if (halign != null)
			sb.append("align=").append(halign).append(";");
		
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

	/**
	 * Extracts horizontal text alignment from html and removes it
	 * so it does not interfere with alignment set in mxCell style
	 * @return horizontal text alignment or null if there is none
	 */
	private String getHorizontalTextAlignment()
	{
		Matcher m = textAlign.matcher(html);

		if (m.matches())
		{
			html = html.replaceAll("text-align: ?\\w*;", "");
			return m.group(2);
		}

		return null;
	}

}
