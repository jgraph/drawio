/**
 * Copyright (c) 2006, Gaudenz Alder
 */
package com.mxgraph.io;

import java.util.Map;

import org.w3c.dom.Node;

/**
 * Codec for mxChildChanges. This class is created and registered
 * dynamically at load time and used implicitely via mxCodec
 * and the mxCodecRegistry.
 */
public class mxGenericChangeCodec extends mxObjectCodec
{
	/**
	 * 
	 */
	protected String fieldname;

	/**
	 * Constructs a new model codec.
	 */
	public mxGenericChangeCodec(Object template, String fieldname)
	{
		this(template, new String[] { "model", "previous" },
				new String[] { "cell" }, null, fieldname);
	}

	/**
	 * Constructs a new model codec for the given arguments.
	 */
	public mxGenericChangeCodec(Object template, String[] exclude,
			String[] idrefs, Map<String, String> mapping, String fieldname)
	{
		super(template, exclude, idrefs, mapping);

		this.fieldname = fieldname;
	}

	/* (non-Javadoc)
	 * @see com.mxgraph.io.mxObjectCodec#afterDecode(com.mxgraph.io.mxCodec, org.w3c.dom.Node, java.lang.Object)
	 */
	@Override
	public Object afterDecode(mxCodec dec, Node node, Object obj)
	{
		Object cell = getFieldValue(obj, "cell");

		if (cell instanceof Node)
		{
			setFieldValue(obj, "cell", dec.decodeCell((Node) cell, false));
		}

		setFieldValue(obj, "previous", getFieldValue(obj, fieldname));

		return obj;
	}

}
