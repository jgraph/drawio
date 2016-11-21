/**
 * Copyright (c) 2006-2016, JGraph Ltd
 * Copyright (c) 2006-2016, Gaudenz Alder
 */
package com.mxgraph.io.vsdx;

import org.w3c.dom.Element;

/**
 * Wrapper for connect element
 * See https://msdn.microsoft.com/en-us/library/office/ff768299%28v=office.14%29.aspx
 *
 */
public class mxVsdxConnect
{
	protected Element endShape;
	
	/**
	 * ID of edge
	 */
	protected Integer fromSheet = null;

	/**
	 * ID of source
	 */
	protected Integer sourceToSheet = null;
	
	/**
	 * Where connection is made to source
	 */
	protected Integer sourceToPart = -1;
	
	/**
	 * ID of target
	 */
	protected Integer targetToSheet = null;
	
	/**
	 * Where connection is made to target
	 */
	protected Integer targetToPart = -1;
	
	protected String fromCell = null;

	public mxVsdxConnect(Element connectElem)
	{
		String fromSheet = connectElem.getAttribute(mxVsdxConstants.FROM_SHEET);
		this.fromSheet = (fromSheet != null && !fromSheet.isEmpty()) ? Integer.valueOf(fromSheet) : -1;
		
		String fromCell = connectElem.getAttribute(mxVsdxConstants.FROM_CELL);
		addFromCell(connectElem, fromCell);
	}

	protected void addFromCell(Element connectElem, String fromCell)
	{
		String toSheet = connectElem.getAttribute(mxVsdxConstants.TO_SHEET);
		boolean source = true;

		if (fromCell != null && fromCell.equals(mxVsdxConstants.BEGIN_X))
		{
			this.sourceToSheet = (toSheet != null && !toSheet.isEmpty()) ? Integer.valueOf(toSheet) : -1;
			source = true;
		}
		else if (fromCell != null && fromCell.equals(mxVsdxConstants.END_X))
		{
			this.targetToSheet = (toSheet != null && !toSheet.isEmpty()) ? Integer.valueOf(toSheet) : -1;
			source = false;
		}
		else if (this.sourceToSheet == null)
		{
			this.sourceToSheet = (toSheet != null && !toSheet.isEmpty()) ? Integer.valueOf(toSheet) : -1;
			source = true;
		}
		else if (this.targetToSheet == null)
		{
			this.targetToSheet = (toSheet != null && !toSheet.isEmpty()) ? Integer.valueOf(toSheet) : -1;
			source = false;
		}
		
		findToPart(connectElem, source);
	}
	
	protected void findToPart(Element connectElem, boolean source)
	{
		String toPartString = connectElem.getAttribute(mxVsdxConstants.TO_PART);
		Integer toPart = (toPartString != null && !toPartString.isEmpty()) ? Integer.valueOf(toPartString) : -1;
		
		if (source)
		{
			sourceToPart = toPart;
		}
		else
		{
			targetToPart = toPart;
		}
	}

	public Integer getFromSheet()
	{
		return this.fromSheet;
	}
	
	public Integer getSourceToSheet()
	{
		return this.sourceToSheet;
	}
	
	public Integer getTargetToSheet()
	{
		return this.targetToSheet;
	}
	
	public Integer getSourceToPart()
	{
		return this.sourceToPart;
	}
	
	public Integer getTargetToPart()
	{
		return this.targetToPart;
	}

	/**
	 * 
	 * @param connectElem
	 */
	public void addConnect(Element connectElem)
	{
		this.endShape = connectElem;
		String fromCell = connectElem.getAttribute(mxVsdxConstants.FROM_CELL);
		addFromCell(connectElem, fromCell);
	}

}
