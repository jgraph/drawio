package com.mxgraph.io.vsdx;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;

import org.w3c.dom.Element;

import com.mxgraph.io.vsdx.geometry.Row;
import com.mxgraph.io.vsdx.geometry.RowFactory;
import com.mxgraph.util.mxPoint;

public class mxVsdxGeometry {
	private int index;
	
	private boolean noFill = false, noLine = false, noShow = false, noSnap = false, noQuickDrag = false;
	
	private ArrayList<Row> rows = null;
	
	private int getIndex(Element elem)
	{
		try
		{
			return Integer.parseInt(elem.getAttribute("IX"));
		}
		catch (Exception e)
		{
			//Some non-standard visio file omit the index when it is zero 
			return 0;
		}
	}
	
	public mxVsdxGeometry(Element elem)
	{
		index = getIndex(elem);
		processGeoElem(elem);
	}

	public mxVsdxGeometry(Element elem, List<mxVsdxGeometry> parentGeo)
	{
		index = getIndex(elem);
		if (parentGeo != null && index < parentGeo.size())
		{
			//inherit all parent values including 
			this.inheritGeo(parentGeo.get(index));			
		}
		processGeoElem(elem);
	}

	private void processGeoElem(Element elem)
	{		
		ArrayList<Element> cellElems = mxVsdxUtils.getDirectChildNamedElements(elem, "Cell");
		ArrayList<Element> rowElems = mxVsdxUtils.getDirectChildNamedElements(elem, "Row");
		
		if (rows == null)
		{
			rows = new ArrayList<>(rowElems.size());
			
			//set the list size to row size
			for (int i = 0; i < rowElems.size(); i++)
			{
				rows.add(null);
			}
		}
		
		for (Element cellElem : cellElems)
		{
			String name = cellElem.getAttribute("N");
			String val =  cellElem.getAttribute("V");
			switch (name)
			{
				case "NoFill":
					noFill = "1".equals(val);
				break;
				case "NoLine":
					noLine = "1".equals(val);
				break;
				case "NoShow":
					noShow = "1".equals(val);
				break;
				case "NoSnap":
					noSnap = "1".equals(val);
				break;
				case "NoQuickDrag":
					noQuickDrag = "1".equals(val);
				break;
			}
		}
		
		int rowsLen = rows.size();
		boolean sortNeeded = false;
		
		for (Element rowElem : rowElems)
		{
			Row row = RowFactory.getRowObj(rowElem, rows);
			
			//this can happen when child geo has more rows than parent
			if (row.getIndex() > rowsLen)
			{
				rows.add(row);
				sortNeeded = true;
			}
			else
			{
				rows.set(row.getIndex() - 1, row);
			}
		}
		
		if (sortNeeded)
		{
			Collections.sort(rows, new Comparator<Row>() 
			{
				@Override
				public int compare(Row r1, Row r2) 
				{
					return r1.getIndex() - r2.getIndex();
				}
			});
		}
	}
	
	private void inheritGeo(mxVsdxGeometry parent)
	{
		this.noFill = parent.noFill;
		this.noLine = parent.noLine;
		this.noShow = parent.noShow;
		this.noSnap = parent.noSnap;
		this.noQuickDrag = parent.noQuickDrag;
		rows = new ArrayList<>();
		this.rows.addAll(parent.rows);
	}

	public int getIndex() 
	{
		return index;
	}

	public boolean isNoFill() 
	{
		return noFill;
	}

	public boolean isNoLine() 
	{
		return noLine;
	}

	public boolean isNoShow() 
	{
		return noShow;
	}

	public boolean isNoSnap() 
	{
		return noSnap;
	}

	public boolean isNoQuickDrag() 
	{
		return noQuickDrag;
	}

	public ArrayList<Row> getRows() 
	{
		return rows;
	}

	public String getPathXML(mxPoint p, Shape shape)
	{
		if (noShow) return "";
		
		StringBuilder geomElemParsed = new StringBuilder();
		
		for (Row row : rows)
		{
			geomElemParsed.append(row.handle(p, shape));
		}
		
		return geomElemParsed.toString();
	}
}
