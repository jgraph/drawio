/**
 * Copyright (c) 2007, Gaudenz Alder
 */
package com.mxgraph.util;

import java.io.Serializable;

/**
 * Implements a 2-dimensional point with double precision coordinates.
 */
public class mxImage implements Serializable, Cloneable
{

	/**
	 * 
	 */
	private static final long serialVersionUID = 8541229679513497585L;

	/**
	 * Holds the path or URL for the image.
	 */
	protected String src;

	/**
	 * Holds the image width and height.
	 */
	protected int width, height;

	/**
	 * Constructs a new point at (0, 0).
	 */
	public mxImage(String src, int width, int height)
	{
		this.src = src;
		this.width = width;
		this.height = height;
	}

	/**
	 * @return the src
	 */
	public String getSrc()
	{
		return src;
	}

	/**
	 * @param src the src to set
	 */
	public void setSrc(String src)
	{
		this.src = src;
	}

	/**
	 * @return the width
	 */
	public int getWidth()
	{
		return width;
	}

	/**
	 * @param width the width to set
	 */
	public void setWidth(int width)
	{
		this.width = width;
	}

	/**
	 * @return the height
	 */
	public int getHeight()
	{
		return height;
	}

	/**
	 * @param height the height to set
	 */
	public void setHeight(int height)
	{
		this.height = height;
	}

}
