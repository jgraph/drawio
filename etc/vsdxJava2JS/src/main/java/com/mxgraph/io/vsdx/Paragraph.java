/**
 * Copyright (c) 2006-2016, JGraph Ltd
 * Copyright (c) 2006-2016, Gaudenz Alder
 */
package com.mxgraph.io.vsdx;

import java.util.ArrayList;

/**
 * Represents a single formatted section of text
 *
 */
public class Paragraph
{
	protected ArrayList<String> values;
	
	protected ArrayList<String> charIndices;
	
	protected ArrayList<String> fields;
	
	protected String paraIndex;
	
	public Paragraph(String val, String ch, String pg, String field)
	{
		this.values = new ArrayList<String>();
		this.values.add(val);
		this.charIndices = new ArrayList<String>();
		this.charIndices.add(ch);
		this.fields = new ArrayList<String>();
		this.fields.add(field);
		this.paraIndex = pg;
	}
	
	public void addText(String val, String ch, String field)
	{
		this.values.add(val);
		this.charIndices.add(ch);
		this.fields.add(field);
	}
	
	public String getParagraphIndex()
	{
		return this.paraIndex;
	}
	
	public String getValue(int index)
	{
		return values.get(index);
	}
	
	public int numValues()
	{
		return this.values.size();
	}
	
	public String getChar(int index)
	{
		return charIndices.get(index);
	}
	
	public String getField(int index)
	{
		return fields.get(index);
	}
}
