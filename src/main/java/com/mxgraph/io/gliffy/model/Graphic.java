package com.mxgraph.io.gliffy.model;

import java.util.ArrayList;
import java.util.List;

import com.google.gson.annotations.SerializedName;

public class Graphic
{

	public static enum Type
	{
		@SerializedName("Svg") SVG,
		@SerializedName("Line") LINE,
		@SerializedName("Shape") SHAPE,
		@SerializedName("Text") TEXT,
		@SerializedName("Image") IMAGE,
		@SerializedName("Link") LINK,
		@SerializedName("Mindmap") MINDMAP,
		@SerializedName("PopupNote") POPUPNOTE,
		@SerializedName("Unwknown") UNKNOWN;
		

		public String toString()
		{
			return this.name();
		}
	}

	public static abstract class GliffyAbstractShape
	{
		public int strokeWidth;

		public String strokeColor;

		public String fillColor;

		public String dashStyle;
	}

	public static class GliffyLine extends GliffyAbstractShape
	{
		public Integer startArrow;

		public Integer endArrow;

		public String interpolationType;

		public List<float[]> controlPath = new ArrayList<float[]>();
	}

	public static class GliffyShape extends GliffyAbstractShape
	{
		public String tid;

		public boolean gradient;

		public boolean dropShadow;

		public int state;

		public int shadowX;

		public int shadowY;

		public float opacity;

	}

	public static class GliffyImage extends GliffyShape
	{
		private String url;

		public String getUrl()
		{
			return url.replace(";base64", "");
		}
	}

	public static class GliffySvg extends GliffyShape
	{
		public Integer embeddedResourceId;
	}
	
	public static class GliffyMindmap extends GliffyShape
	{
	}
	
	public static class GliffyPopupNote extends GliffyShape 
	{
		public String text;
	}
	
	public static class GliffyLink
	{
		String href;
		boolean renderIcon;
	}

	public Type type;

	public GliffyText Text;

	public GliffyLine Line;
	
	public GliffyLink Link;

	public GliffyShape Shape;

	public GliffyImage Image;

	public GliffySvg Svg;
	
	public GliffyMindmap Mindmap;
	
	public GliffyPopupNote gliffyPopupNote;
	
	public Graphic()
	{
		super();
	}

	public Type getType()
	{
		return type != null ? type : Type.UNKNOWN;
	}

	public GliffyText getText()
	{
		return Text;
	}

	public GliffyLine getLine()
	{
		return Line;
	}
	
	public GliffyLink getLink()
	{
		return Link;
	}

	public GliffyShape getShape()
	{
		return Shape;
	}

	public GliffyImage getImage()
	{
		return Image;
	}
	
	public GliffyMindmap getMindmap() 
	{
		return Mindmap;
	}


}
