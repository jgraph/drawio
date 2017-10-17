/**
 * Copyright (c) 2006-2016, JGraph Ltd
 * Copyright (c) 2006-2016, Gaudenz Alder
 */
package com.mxgraph.io.vsdx;

import java.util.ArrayList;

import org.w3c.dom.Element;

/**
 * Wrapper for a Section element https://msdn.microsoft.com/en-us/library/office/jj684189.aspx
 *
 */
public class Section
{
	/**
	 * The section element
	 */
	protected Element elem = null;
	
	/**
	 * Constructs a new Section
	 * @param elem the Element to wrap
	 */
	public Section(Element elem)
	{
		this.elem = elem;
	}
	
	/**
	 * Return the specified cell by key by row index, if it exists
	 * @param index the row index to search
	 * @param cellKey the name of the Cell to search for
	 * @return the Element of the specified Cell, if null if it doesn't exist
	 */
	public Element getIndexedCell(String index, String cellKey)
	{
		ArrayList<Element> rows = mxVsdxUtils.getDirectChildNamedElements(this.elem, "Row");
		
		for (int i=0; i < rows.size(); i++)
		{
			Element row = rows.get(i);
			String n = row.getAttribute("IX");
			
			// If index is null always match. For example, you can have a shape text with no paragraph index.
			// When it checks the master shape the first paragraph should be used (or maybe the lowest index?)
			if (n.equals(index) || index == null)
			{
				ArrayList<Element> cells = mxVsdxUtils.getDirectChildNamedElements(row, "Cell");
				
				for (int j=0; j < cells.size(); j++)
				{
					Element cell = cells.get(j);
					n = cell.getAttribute("N");

					if (n.equals(cellKey))
					{
						return cell;
					}
				}
			}
		}
		
		return null;
	}
}
