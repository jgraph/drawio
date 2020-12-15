/**
 * Copyright (c) 2006-2013, Gaudenz Alder, David Benson
 */
package com.mxgraph.io;

import java.util.Map;

import org.w3c.dom.Element;
import org.w3c.dom.Node;

import com.mxgraph.model.mxGraphModel;
import com.mxgraph.model.mxICell;

/**
 * Codec for mxGraphModels. This class is created and registered
 * dynamically at load time and used implicitly via mxCodec
 * and the mxCodecRegistry.
 */
public class mxModelCodec extends mxObjectCodec
{

	/**
	 * Constructs a new model codec.
	 */
	public mxModelCodec()
	{
		this(new mxGraphModel());
	}

	/**
	 * Constructs a new model codec for the given template.
	 */
	public mxModelCodec(Object template)
	{
		this(template, null, null, null);
	}

	/**
	 * Constructs a new model codec for the given arguments.
	 */
	public mxModelCodec(Object template, String[] exclude, String[] idrefs,
			Map<String, String> mapping)
	{
		super(template, exclude, idrefs, mapping);
	}

	/**
	 * Encodes the given mxGraphModel by writing a (flat) XML sequence
	 * of cell nodes as produced by the mxCellCodec. The sequence is
	 * wrapped-up in a node with the name root.
	 */
	protected void encodeObject(mxCodec enc, Object obj, Node node)
	{
		if (obj instanceof mxGraphModel)
		{
			Node rootNode = enc.document.createElement("root");
			mxGraphModel model = (mxGraphModel) obj;
			enc.encodeCell((mxICell) model.getRoot(), rootNode, true);
			node.appendChild(rootNode);
		}
	}

	/**
	 * Reads the cells into the graph model. All cells are children of the root
	 * element in the node.
	 */
	public Node beforeDecode(mxCodec dec, Node node, Object into)
	{
		if (node instanceof Element)
		{
			Element elt = (Element) node;
			mxGraphModel model = null;

			if (into instanceof mxGraphModel)
			{
				model = (mxGraphModel) into;
			}
			else
			{
				model = new mxGraphModel();
			}

			// Reads the cells into the graph model. All cells
			// are children of the root element in the node.
			Node root = elt.getElementsByTagName("root").item(0);
			mxICell rootCell = null;

			if (root != null)
			{
				Node tmp = root.getFirstChild();

				while (tmp != null)
				{
					mxICell cell = dec.decodeCell(tmp, true);

					if (cell != null && cell.getParent() == null)
					{
						rootCell = cell;
					}

					tmp = tmp.getNextSibling();
				}

				root.getParentNode().removeChild(root);
			}

			// Sets the root on the model if one has been decoded
			if (rootCell != null)
			{
				model.setRoot(rootCell);
			}
		}

		return node;
	}

}
