package com.mxgraph.io.gliffy.model;

public class GlobalTextStyles
{
	private String size;

	private String color;

	public String getSize()
	{
		return size != null ? size.substring(0, size.indexOf("px")) : size;
	}

	public void setSize(String size)
	{
		this.size = size;
	}

	public String getColor()
	{
		return color;
	}

	public void setColor(String color)
	{
		this.color = color;
	}
}
