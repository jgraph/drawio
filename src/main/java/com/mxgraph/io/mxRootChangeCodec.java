/**
 * Copyright (c) 2006-2013, Gaudenz Alder, David Benson
 */
package com.mxgraph.io;

import java.util.Map;

import org.w3c.dom.Node;

import com.mxgraph.model.mxGraphModel.mxRootChange;
import com.mxgraph.model.mxICell;

/**
 * Codec for mxChildChanges. This class is created and registered
 * dynamically at load time and used implicitly via mxCodec
 * and the mxCodecRegistry.
 */
public class mxRootChangeCodec extends mxObjectCodec
{

	/**
	 * Constructs a new model codec.
	 */
	public mxRootChangeCodec()
	{
		this(new mxRootChange(), new String[] { "model", "previous", "root" },
				null, null);
	}

	/**
	 * Constructs a new model codec for the given arguments.
	 */
	public mxRootChangeCodec(Object template, String[] exclude,
			String[] idrefs, Map<String, String> mapping)
	{
		super(template, exclude, idrefs, mapping);
	}

	/* (non-Javadoc)
	 * @see com.mxgraph.io.mxObjectCodec#afterEncode(com.mxgraph.io.mxCodec, java.lang.Object, org.w3c.dom.Node)
	 */
	@Override
	public Node afterEncode(mxCodec enc, Object obj, Node node)
	{
		if (obj instanceof mxRootChange)
		{
			enc.encodeCell((mxICell) ((mxRootChange) obj).getRoot(), node, true);
		}

		return node;
	}

	/**
	 * Reads the cells into the graph model. All cells are children of the root
	 * element in the node.
	 */
	public Node beforeDecode(mxCodec dec, Node node, Object into)
	{
		if (into instanceof mxRootChange)
		{
			mxRootChange change = (mxRootChange) into;

			if (node.getFirstChild() != null
					&& node.getFirstChild().getNodeType() == Node.ELEMENT_NODE)
			{
				// Makes sure the original node isn't modified
				node = node.cloneNode(true);

				Node tmp = node.getFirstChild();
				change.setRoot(dec.decodeCell(tmp, false));

				Node tmp2 = tmp.getNextSibling();
				tmp.getParentNode().removeChild(tmp);
				tmp = tmp2;

				while (tmp != null)
				{
					tmp2 = tmp.getNextSibling();

					if (tmp.getNodeType() == Node.ELEMENT_NODE)
					{
						dec.decodeCell(tmp, true);
					}

					tmp.getParentNode().removeChild(tmp);
					tmp = tmp2;
				}
			}
		}

		return node;
	}

	/* (non-Javadoc)
	 * @see com.mxgraph.io.mxObjectCodec#afterDecode(com.mxgraph.io.mxCodec, org.w3c.dom.Node, java.lang.Object)
	 */
	@Override
	public Object afterDecode(mxCodec dec, Node node, Object obj)
	{
		if (obj instanceof mxRootChange)
		{
			mxRootChange change = (mxRootChange) obj;
			change.setPrevious(change.getRoot());
		}

		return obj;
	}

}
