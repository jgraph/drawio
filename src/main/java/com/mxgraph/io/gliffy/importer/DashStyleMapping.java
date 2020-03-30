package com.mxgraph.io.gliffy.importer;

public class DashStyleMapping
{
	public static String get(String value, int width)
	{
		if (value == null)
		{
			return "";
		}

		String[] pattern = value.split(",");
		
		try
		{
			for (int i = 0; i < pattern.length; i++)
			{
				pattern[i] = String.valueOf(Double.parseDouble(pattern[i]) * width);
			}
		} 
		catch (Exception e) 
		{
			// ignore
		}
		
		StringBuilder mxPattern = new StringBuilder("dashed=1;fixDash=1;dashPattern=");
		String space = "";
		
		//No join in Java 7!
		for (String p : pattern)
		{
			mxPattern.append(space);
			mxPattern.append(p);
			space = " ";
		}
		
		mxPattern.append(";");
		
		return  mxPattern.toString();
	}
}
