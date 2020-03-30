/**
 * Copyright (c) 2010 David Benson, Gaudenz Alder
 */
package com.mxgraph.io.graphml;

import org.w3c.dom.Document;
import org.w3c.dom.Element;

/**
 * This class represents the properties of a JGraph edge.
 */
public class mxGraphMlShapeEdge
{
	private String text = "";

	private String style = "";

	private String edgeSource;

	private String edgeTarget;

	/**
	 * Construct a Shape Edge with text and style.
	 * @param text
	 * @param style
	 */
	public mxGraphMlShapeEdge(String text, String style)
	{
		this.text = text;
		this.style = style;
	}

	/**
	 * Constructs a ShapeEdge from a xml shapeEdgeElement.
	 * @param shapeEdgeElement
	 */
	public mxGraphMlShapeEdge(Element shapeEdgeElement)
	{
		Element labelElement = mxGraphMlUtils.childsTag(shapeEdgeElement,
				mxGraphMlConstants.JGRAPH + mxGraphMlConstants.LABEL);
		
		if (labelElement != null)
		{
			this.text = labelElement.getAttribute(mxGraphMlConstants.TEXT);
		}

		Element styleElement = mxGraphMlUtils.childsTag(shapeEdgeElement,
				mxGraphMlConstants.JGRAPH + mxGraphMlConstants.STYLE);
		
		if (styleElement != null)
		{
			this.style = styleElement.getAttribute(mxGraphMlConstants.PROPERTIES);

		}
	}

	/**
	 * Construct an empty Shape Edge Element.
	 */
	public mxGraphMlShapeEdge()
	{
	}

	/**
	 * Generates a ShapeEdge Element from this class.
	 * @param document Document where the key Element will be inserted.
	 * @return Returns the generated Elements.
	 */
	public Element generateElement(Document document)
	{
		Element dataEdge = document.createElementNS(mxGraphMlConstants.JGRAPH_URL,
				mxGraphMlConstants.JGRAPH + mxGraphMlConstants.SHAPEEDGE);

		if (!this.text.equals(""))
		{
			Element dataEdgeLabel = document.createElementNS(
					mxGraphMlConstants.JGRAPH_URL, mxGraphMlConstants.JGRAPH
							+ mxGraphMlConstants.LABEL);
			dataEdgeLabel.setAttribute(mxGraphMlConstants.TEXT, this.text);
			dataEdge.appendChild(dataEdgeLabel);
		}
		
		if (!this.style.equals(""))
		{
			Element dataEdgeStyle = document.createElementNS(
					mxGraphMlConstants.JGRAPH_URL, mxGraphMlConstants.JGRAPH
							+ mxGraphMlConstants.STYLE);

			dataEdgeStyle.setAttribute(mxGraphMlConstants.PROPERTIES, this.style);
			dataEdge.appendChild(dataEdgeStyle);
		}

		return dataEdge;
	}

	public String getText()
	{
		return text;
	}

	public void setText(String text)
	{
		this.text = text;
	}

	public String getStyle()
	{
		return style;
	}

	public void setStyle(String style)
	{
		this.style = style;
	}

	public String getEdgeSource()
	{
		return edgeSource;
	}

	public void setEdgeSource(String edgeSource)
	{
		this.edgeSource = edgeSource;
	}

	public String getEdgeTarget()
	{
		return edgeTarget;
	}

	public void setEdgeTarget(String edgeTarget)
	{
		this.edgeTarget = edgeTarget;
	}
}
