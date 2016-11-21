/**
 * Copyright (c) 2006-2016, JGraph Ltd
 * Copyright (c) 2006-2016, Gaudenz Alder
 */
package com.mxgraph.io.vsdx;

import java.util.ArrayList;

import org.w3c.dom.Element;

public class Section
{
	protected Element elem = null;
	
	public Section(Element elem)
	{
		this.elem = elem;
	}
	
	public Element getCell(String[] keys)
	{
		if (keys == null || keys.length != 3)
		{
			return null;
		}
		
		ArrayList<Element> rows = mxVsdxUtils.getDirectChildNamedElements(this.elem, "row");
		
		for (int i=0; i < rows.size(); i++)
		{
			Element row = rows.get(i);
			String n = row.getAttribute("N");
			
			if (n.equals(keys[1]))
			{
				ArrayList<Element> cells = mxVsdxUtils.getDirectChildNamedElements(row, "cell");
				
				for (int j=0; j < cells.size(); j++)
				{
					Element cell = cells.get(j);
					n = cell.getAttribute("N");

					if (n.equals(keys[2]))
					{
						return cell;
					}
				}
			}
		}
		
		return null;
	}
}
