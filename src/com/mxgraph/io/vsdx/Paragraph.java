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
	
	protected ArrayList<String> charIndex;
	
	protected String paraIndex;
	
	public Paragraph(String val, String ch, String pg)
	{
		this.values = new ArrayList<String>();
		this.values.add(val);
		this.charIndex = new ArrayList<String>();
		this.charIndex.add(ch);
		this.paraIndex = pg;
	}
	
	public void addValue(String val, String ch)
	{
		this.values.add(val);
		this.charIndex.add(ch);
	}
	
	public String getParagraphIndex()
	{
		return this.paraIndex;
	}
	
	public String getValue(int index)
	{
		return values.get(index);
	}
	
	public String getChar(int index)
	{
		return charIndex.get(index);
	}
}
