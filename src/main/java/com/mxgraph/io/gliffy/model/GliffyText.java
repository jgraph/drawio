package com.mxgraph.io.gliffy.model;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

import com.mxgraph.io.gliffy.importer.PostDeserializer;

public class GliffyText implements PostDeserializer.PostDeserializable
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
	
	public Double lineTValue = 0.5;//places the text in the middle of the line

	public Integer linePerpValue;
	
	public String cardinalityType;

	public String overflow;
	
	private boolean forceTopPaddingShift = false;
	
	private static Pattern spanPattern = Pattern.compile("<span style=\"(.*?)\">");

	private static Pattern textAlign = Pattern.compile(".*(text-align: ?(left|center|right);).*", Pattern.DOTALL);

	private static Pattern textAlignToDrawIO = Pattern.compile("style=\"text-align:\\s?(left|center|right);\"");

	private static Pattern lineHeight = Pattern.compile(".*(line-height: .*px;).*", Pattern.DOTALL);

	public GliffyText()
	{
	}
	
	public void postDeserialize() 
	{
		halign = getHorizontalTextAlignment();
		setDrawIoFormatForTextAlignment();
		replaceParagraphWithDiv();
	}

	public String getHtml()
	{
		return html;
	}

	//this is never invoked by Gson builder
	public void setHtml(String html)
	{
	}

	public String getStyle(float x, float y)
	{
		StringBuilder sb = new StringBuilder();

		//I hate magic numbers, but -7 seams to fix all text top padding when valign is not middle 
		int topPaddingShift = 7;

		//vertical label position
		if (vposition.equals("above"))
		{
			sb.append("verticalLabelPosition=top;").append("verticalAlign=bottom;");
		}
		else if (vposition.equals("below"))
		{
			sb.append("verticalLabelPosition=bottom;").append("verticalAlign=top;");
		}
		else if (vposition.equals("none"))
		{
			sb.append("verticalAlign=").append(valign).append(";");

			if (!forceTopPaddingShift && "middle".equals(valign))
				topPaddingShift = 0;
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
			if (halign != null)
			{
				sb.append("align=").append(halign).append(";");

				if (halign.equalsIgnoreCase("right"))
				{
					// Workaround for word wrapping where no wrapping occurs in Gliffy is to
					// make room for additional chars if we know the alignment ignores x
					x = 0;
				}
			}
			else
			{
				sb.append("align=center;");
			}
		}

		// Removes default global spacing (workaround for unwanted line wrapping)
		paddingLeft = Math.max(0, paddingLeft - 2);
		paddingRight = Math.max(0, paddingRight - 2);

		sb.append("spacingLeft=").append(paddingLeft + x).append(";");
		sb.append("spacingRight=").append(paddingRight).append(";");

		if (forceTopPaddingShift || !"middle".equals(valign))
		{
			sb.append("spacingTop=").append(paddingTop - topPaddingShift + y).append(";");
			sb.append("spacingBottom=").append(paddingBottom).append(";");
		}

		//We should wrap only if overflow is none. (TODO better support left & right overflow) 
		if ("none".equals(overflow))
			sb.append("whiteSpace=wrap;");

		return sb.toString();
	}

	private void replaceParagraphWithDiv()
	{
		Matcher m = spanPattern.matcher(html);
		StringBuilder modHtml = new StringBuilder(); 
		int last = 0;
		
		while (m.find())
		{
			String span = html.substring(last, m.end());
			String style = m.group(1);
			
			if (style != null)
			{
				// Adds line-height:0 to empty spans with no line-height
				// to match quirks mode sizing in standards mode
				Matcher m2 = lineHeight.matcher(style);
				
				if (!m2.find())
				{
					if (html.substring(m.end(), m.end() + 5).equalsIgnoreCase("<span"))
					{
						span = span.substring(0, m.end(1) - last) + " line-height: 0;" + span.substring(m.end(1) - last);
					}
					else
					{
						// Overrides line-height with default value in child span elements
						span = span.substring(0, m.end(1) - last) + " line-height: normal;" + span.substring(m.end(1) - last);
					}
				}
			}

			last = m.end();
			modHtml.append(span);
		}
		
		if (modHtml.length() > 0)
		{
			modHtml.append(html.substring(last));
			html = modHtml.toString();
		}
		
		html = html.replace("<p ", "<div ").replace("<p>", "<div>").replace("</p>", "</div>");
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
			return m.group(2);
		}

		return null;
	}

	/**
	 * Replaces all occurrences of style="text-align: {position}" with align="{position}"
	 * This enables per-line horizontal alignment in all browsers
	 */
	private void setDrawIoFormatForTextAlignment()
	{
		Matcher m = textAlignToDrawIO.matcher(html);
		html = m.replaceAll("align=\"$1\"");
	}

	public void setHalign(String halign) 
	{
		this.halign = halign;
	}	
	
	public void setValign(String valign) 
	{
		this.valign = valign;
	}

	public void setForceTopPaddingShift(boolean forceTopPaddingShift) 
	{
		this.forceTopPaddingShift = forceTopPaddingShift;
	}
}
