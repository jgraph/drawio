/**
 * Copyright (c) 2010-2016, JGraph Ltd
 * Copyright (c) 2010-2016, Gaudenz Alder
 */
package com.mxgraph.io.vsdx;

/**
 * Wraps the page and shape ID within that page to create a unique ID
 */
public class ShapePageId
{
	private int pageNumber;

	private int Id;

	public ShapePageId(int pageNumber, int Id)
	{
		this.pageNumber = pageNumber;
		this.Id = Id;
	}

	public int getId()
	{
		return Id;
	}

	public int getPageNumber()
	{
		return pageNumber;
	}

	@Override
	public boolean equals(Object obj)
	{
		if (obj == null || getClass() != obj.getClass())
		{
			return false;
		}
		
		final ShapePageId other = (ShapePageId) obj;
		
		if (this.pageNumber != other.pageNumber || this.Id != other.Id)
		{
			return false;
		}
		
		return true;
	}

	@Override
	public int hashCode()
	{
		return 100000 * this.pageNumber + this.Id;
	}
}
