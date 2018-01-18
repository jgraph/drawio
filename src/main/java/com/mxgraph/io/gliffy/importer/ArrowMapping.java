package com.mxgraph.io.gliffy.importer;

import java.util.HashMap;
import java.util.Map;

import com.mxgraph.util.mxConstants;

public class ArrowMapping
{

	static
	{
		init();
	}

	public static class ArrowStyle
	{

		public String name;

		public Boolean fill;
		
		int arrowSize = 6; //6 is the default arrow size

		public ArrowStyle(String name, boolean fill)
		{
			super();
			this.name = name;
			this.fill = fill;
		}

		public ArrowStyle(String name, boolean fill, int arrowSize)
		{
			super();
			this.name = name;
			this.fill = fill;
			this.arrowSize = arrowSize;
		}

		public String toString(boolean start)
		{
			int intFill = fill ? 1 : 0;
			return start ? "startArrow=" + name + ";startFill=" + intFill + ";startSize=" + arrowSize
					: "endArrow=" + name + ";endFill=" + intFill + ";endSize=" + arrowSize;
		}

	}

	private static Map<Integer, ArrowStyle> mapping;

	private static void init()
	{
		mapping = new HashMap<Integer, ArrowStyle>();
		mapping.put(0, new ArrowStyle("none", false));
		mapping.put(1, new ArrowStyle(mxConstants.ARROW_OPEN, false));
		mapping.put(2, new ArrowStyle(mxConstants.ARROW_BLOCK, true));
		mapping.put(3, new ArrowStyle(mxConstants.ARROW_BLOCK, false));
		mapping.put(4, new ArrowStyle(mxConstants.ARROW_BLOCK, false, 10));
		mapping.put(5, new ArrowStyle(mxConstants.ARROW_DIAMOND, false, 12));
		mapping.put(6, new ArrowStyle(mxConstants.ARROW_OPEN, false, 10));
		mapping.put(7, new ArrowStyle(mxConstants.ARROW_DIAMOND, true, 12));
		mapping.put(8, new ArrowStyle(mxConstants.ARROW_CLASSIC, true));
		mapping.put(9, new ArrowStyle("ERzeroToMany", true, 10));
		mapping.put(10, new ArrowStyle("ERoneToMany", true, 10));
		mapping.put(11, new ArrowStyle("ERmandOne", true, 10));
		mapping.put(12, new ArrowStyle("ERone", true, 10));
		mapping.put(13, new ArrowStyle("ERzeroToOne", true, 10));
		mapping.put(14, new ArrowStyle("ERmany", true, 10));
		mapping.put(15, new ArrowStyle(mxConstants.ARROW_OVAL, false, 10));
		mapping.put(16, new ArrowStyle("dash", false));
		mapping.put(17, new ArrowStyle(mxConstants.ARROW_BLOCK, true));
		mapping.put(18, new ArrowStyle(mxConstants.ARROW_CLASSIC, true));
		mapping.put(19, new ArrowStyle("openAsync", false, 10));
	}

	public static ArrowStyle get(Integer gliffyId)
	{
		return mapping.get(gliffyId);
	}
}
