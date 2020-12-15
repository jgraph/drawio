/**
 * Copyright (c) 2006, Gaudenz Alder
 */
package com.mxgraph.io;

import java.util.Iterator;
import java.util.Map;

import org.w3c.dom.Element;
import org.w3c.dom.Node;

import com.mxgraph.model.mxCell;

/**
 * Codec for mxCells. This class is created and registered
 * dynamically at load time and used implicitely via mxCodec
 * and the mxCodecRegistry.
 */
public class mxCellCodec extends mxObjectCodec
{

	/**
	 * Constructs a new cell codec.
	 */
	public mxCellCodec()
	{
		this(new mxCell(), null, new String[] { "parent", "source", "target" },
				null);
	}

	/**
	 * Constructs a new cell codec for the given template.
	 */
	public mxCellCodec(Object template)
	{
		this(template, null, null, null);
	}

	/**
	 * Constructs a new cell codec for the given arguments.
	 */
	public mxCellCodec(Object template, String[] exclude, String[] idrefs,
			Map<String, String> mapping)
	{
		super(template, exclude, idrefs, mapping);
	}

	/**
	 * Excludes user objects that are XML nodes.
	 */
	public boolean isExcluded(Object obj, String attr, Object value,
			boolean write)
	{
		return exclude.contains(attr)
				|| (write && attr.equals("value") && value instanceof Node && ((Node) value)
						.getNodeType() == Node.ELEMENT_NODE);
	}

	/**
	 * Encodes an mxCell and wraps the XML up inside the
	 * XML of the user object (inversion).
	 */
	public Node afterEncode(mxCodec enc, Object obj, Node node)
	{
		if (obj instanceof mxCell)
		{
			mxCell cell = (mxCell) obj;

			if (cell.getValue() instanceof Node)
			{
				// Wraps the graphical annotation up in the
				// user object (inversion) by putting the
				// result of the default encoding into
				// a clone of the user object (node type 1)
				// and returning this cloned user object.
				Element tmp = (Element) node;
				node = enc.getDocument().importNode((Node) cell.getValue(),
						true);
				node.appendChild(tmp);

				// Moves the id attribute to the outermost
				// XML node, namely the node which denotes
				// the object boundaries in the file.
				String id = tmp.getAttribute("id");
				((Element) node).setAttribute("id", id);
				tmp.removeAttribute("id");
			}
		}

		return node;
	}

	/**
	 * Decodes an mxCell and uses the enclosing XML node as
	 * the user object for the cell (inversion).
	 */
	public Node beforeDecode(mxCodec dec, Node node, Object obj)
	{
		Element inner = (Element) node;

		if (obj instanceof mxCell)
		{
			mxCell cell = (mxCell) obj;
			String classname = getName();
			String nodeName = node.getNodeName();
			
			// Handles aliased names
			if (!nodeName.equals(classname))
			{
				String tmp = mxCodecRegistry.aliases.get(nodeName);
				
				if (tmp != null)
				{
					nodeName = tmp;
				}
			}

			if (!nodeName.equals(classname))
			{
				// Passes the inner graphical annotation node to the
				// object codec for further processing of the cell.
				Node tmp = inner.getElementsByTagName(classname).item(0);

				if (tmp != null && tmp.getParentNode() == node)
				{
					inner = (Element) tmp;

					// Removes annotation and whitespace from node
					Node tmp2 = tmp.getPreviousSibling();

					while (tmp2 != null && tmp2.getNodeType() == Node.TEXT_NODE)
					{
						Node tmp3 = tmp2.getPreviousSibling();

						if (tmp2.getTextContent().trim().length() == 0)
						{
							tmp2.getParentNode().removeChild(tmp2);
						}

						tmp2 = tmp3;
					}

					// Removes more whitespace
					tmp2 = tmp.getNextSibling();

					while (tmp2 != null && tmp2.getNodeType() == Node.TEXT_NODE)
					{
						Node tmp3 = tmp2.getPreviousSibling();

						if (tmp2.getTextContent().trim().length() == 0)
						{
							tmp2.getParentNode().removeChild(tmp2);
						}

						tmp2 = tmp3;
					}

					tmp.getParentNode().removeChild(tmp);
				}
				else
				{
					inner = null;
				}

				// Creates the user object out of the XML node
				Element value = (Element) node.cloneNode(true);
				cell.setValue(value);
				String id = value.getAttribute("id");

				if (id != null)
				{
					cell.setId(id);
					value.removeAttribute("id");
				}
			}
			else
			{
				cell.setId(((Element) node).getAttribute("id"));
			}

			// Preprocesses and removes all Id-references
			// in order to use the correct encoder (this)
			// for the known references to cells (all).
			if (inner != null && idrefs != null)
			{
				Iterator<String> it = idrefs.iterator();

				while (it.hasNext())
				{
					String attr = it.next();
					String ref = inner.getAttribute(attr);

					if (ref != null && ref.length() > 0)
					{
						inner.removeAttribute(attr);
						Object object = dec.objects.get(ref);

						if (object == null)
						{
							object = dec.lookup(ref);
						}

						if (object == null)
						{
							// Needs to decode forward reference
							Node element = dec.getElementById(ref);

							if (element != null)
							{
								mxObjectCodec decoder = mxCodecRegistry
										.getCodec(element.getNodeName());

								if (decoder == null)
								{
									decoder = this;
								}

								object = decoder.decode(dec, element);
							}
						}

						setFieldValue(obj, attr, object);
					}
				}
			}
		}

		return inner;
	}

}
