package com.mxgraph.io.gliffy.importer;

public class DashStyleMapping
{
	public static String get(String value)
	{
		if (value == null)
		{
			return "";
		}

		return "dashed=1;dashPattern=" + value.replace(",", " ") + ";";
	}
}
