/**
 * Copyright (c) 2010 David Benson, Gaudenz Alder
 */
package com.mxgraph.io.graphml;

import org.w3c.dom.Document;
import org.w3c.dom.Element;

public class mxGraphMlShapeNode
{
	private String dataHeight = "";

	private String dataWidth = "";

	private String dataX = "";

	private String dataY = "";

	private String dataLabel = "";

	private String dataStyle = "";

	/**
	 * Construct a shape Node with the given parameters
	 * @param dataHeight Node's Height
	 * @param dataWidth Node's Width
	 * @param dataX Node's X coordinate.
	 * @param dataY Node's Y coordinate.
	 * @param dataStyle Node's style.
	 */
	public mxGraphMlShapeNode(String dataHeight, String dataWidth, String dataX,
			String dataY, String dataStyle)
	{
		this.dataHeight = dataHeight;
		this.dataWidth = dataWidth;
		this.dataX = dataX;
		this.dataY = dataY;
		this.dataStyle = dataStyle;
	}

	/**
	 * Construct an empty shape Node
	 */
	public mxGraphMlShapeNode()
	{
	}

	/**
	 * Construct a Shape Node from a xml Shape Node Element.
	 * @param shapeNodeElement Xml Shape Node Element.
	 */
	public mxGraphMlShapeNode(Element shapeNodeElement)
	{
		//Defines Geometry
		Element geometryElement = mxGraphMlUtils.childsTag(shapeNodeElement,
				mxGraphMlConstants.JGRAPH + mxGraphMlConstants.GEOMETRY);
		this.dataHeight = geometryElement.getAttribute(mxGraphMlConstants.HEIGHT);
		this.dataWidth = geometryElement.getAttribute(mxGraphMlConstants.WIDTH);
		this.dataX = geometryElement.getAttribute(mxGraphMlConstants.X);
		this.dataY = geometryElement.getAttribute(mxGraphMlConstants.Y);

		Element styleElement = mxGraphMlUtils.childsTag(shapeNodeElement,
				mxGraphMlConstants.JGRAPH + mxGraphMlConstants.STYLE);
		
		if (styleElement != null)
		{
			this.dataStyle = styleElement
					.getAttribute(mxGraphMlConstants.PROPERTIES);
		}
		//Defines Label
		Element labelElement = mxGraphMlUtils.childsTag(shapeNodeElement,
				mxGraphMlConstants.JGRAPH + mxGraphMlConstants.LABEL);
		
		if (labelElement != null)
		{
			this.dataLabel = labelElement.getAttribute(mxGraphMlConstants.TEXT);
		}
	}

	/**
	 * Generates a Shape Node Element from this class.
	 * @param document Document where the key Element will be inserted.
	 * @return Returns the generated Elements.
	 */
	public Element generateElement(Document document)
	{
		Element dataShape = document.createElementNS(mxGraphMlConstants.JGRAPH_URL,
				mxGraphMlConstants.JGRAPH + mxGraphMlConstants.SHAPENODE);

		Element dataShapeGeometry = document.createElementNS(
				mxGraphMlConstants.JGRAPH_URL, mxGraphMlConstants.JGRAPH
						+ mxGraphMlConstants.GEOMETRY);
		dataShapeGeometry.setAttribute(mxGraphMlConstants.HEIGHT, dataHeight);
		dataShapeGeometry.setAttribute(mxGraphMlConstants.WIDTH, dataWidth);
		dataShapeGeometry.setAttribute(mxGraphMlConstants.X, dataX);
		dataShapeGeometry.setAttribute(mxGraphMlConstants.Y, dataY);

		dataShape.appendChild(dataShapeGeometry);

		if (!this.dataStyle.equals(""))
		{
			Element dataShapeStyle = document.createElementNS(
					mxGraphMlConstants.JGRAPH_URL, mxGraphMlConstants.JGRAPH
							+ mxGraphMlConstants.STYLE);
			dataShapeStyle.setAttribute(mxGraphMlConstants.PROPERTIES, dataStyle);
			dataShape.appendChild(dataShapeStyle);
		}

		//Sets Label
		if (!this.dataLabel.equals(""))
		{

			Element dataShapeLabel = document.createElementNS(
					mxGraphMlConstants.JGRAPH_URL, mxGraphMlConstants.JGRAPH
							+ mxGraphMlConstants.LABEL);
			dataShapeLabel.setAttribute(mxGraphMlConstants.TEXT, dataLabel);

			dataShape.appendChild(dataShapeLabel);
		}
		
		return dataShape;
	}

	public String getDataHeight()
	{
		return dataHeight;
	}

	public void setDataHeight(String dataHeight)
	{
		this.dataHeight = dataHeight;
	}

	public String getDataWidth()
	{
		return dataWidth;
	}

	public void setDataWidth(String dataWidth)
	{
		this.dataWidth = dataWidth;
	}

	public String getDataX()
	{
		return dataX;
	}

	public void setDataX(String dataX)
	{
		this.dataX = dataX;
	}

	public String getDataY()
	{
		return dataY;
	}

	public void setDataY(String dataY)
	{
		this.dataY = dataY;
	}

	public String getDataLabel()
	{
		return dataLabel;
	}

	public void setDataLabel(String dataLabel)
	{
		this.dataLabel = dataLabel;
	}

	public String getDataStyle()
	{
		return dataStyle;
	}

	public void setDataStyle(String dataStyle)
	{
		this.dataStyle = dataStyle;
	}
}
