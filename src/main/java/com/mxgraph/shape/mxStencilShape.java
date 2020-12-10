/**
 * Copyright (c) 2010-2012, JGraph Ltd
 */
package com.mxgraph.shape;

import org.w3c.dom.Node;

import com.mxgraph.canvas.mxGraphics2DCanvas;
import com.mxgraph.util.mxUtils;
import com.mxgraph.util.mxXmlUtils;
import com.mxgraph.util.svg.AWTPathProducer;
import com.mxgraph.util.svg.AWTPolygonProducer;
import com.mxgraph.util.svg.AWTPolylineProducer;
import com.mxgraph.util.svg.CSSConstants;
import com.mxgraph.util.svg.ExtendedGeneralPath;
import com.mxgraph.view.mxCellState;
import java.awt.Color;
import java.awt.Shape;
import java.awt.geom.AffineTransform;
import java.awt.geom.Ellipse2D;
import java.awt.geom.GeneralPath;
import java.awt.geom.Line2D;
import java.awt.geom.Rectangle2D;
import java.awt.geom.RoundRectangle2D;
import java.util.ArrayList;
import java.util.Hashtable;
import java.util.List;
import java.util.Map;
import java.util.logging.Level;
import java.util.logging.Logger;

import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.NodeList;

/**
 * Stencil shape drawing that takes an XML definition of the shape and renders
 * it.
 * 
 * See http://projects.gnome.org/dia/custom-shapes for specs. See
 * http://dia-installer.de/shapes_de.html for shapes.
 */
public class mxStencilShape extends mxBasicShape
{

	private static final Logger log = Logger.getLogger(mxStencilShape.class.getName());

	public mxStencilShape()
	{
		super();
	}

	protected GeneralPath shapePath;

	/**
	 * Reference to the root node of the Dia shape description.
	 */
	protected Node root;

	protected svgShape rootShape;

	protected Rectangle2D boundingBox;

	protected String name;

	protected String iconPath;

	/**
	 * Transform cached to save instance created. Used to scale the internal
	 * path of shapes where possible
	 */
	protected AffineTransform cachedTransform = new AffineTransform();

	/**
	 * Constructs a new stencil for the given Dia shape description.
	 */
	public mxStencilShape(String shapeXml)
	{
		this(mxXmlUtils.parseXml(shapeXml));
	}

	public mxStencilShape(Document document)
	{
		if (document != null)
		{
			NodeList nameList = document.getElementsByTagName("name");

			if (nameList != null && nameList.getLength() > 0)
			{
				this.name = nameList.item(0).getTextContent();
			}

			NodeList iconList = document.getElementsByTagName("icon");

			if (iconList != null && iconList.getLength() > 0)
			{
				this.iconPath = iconList.item(0).getTextContent();
			}

			NodeList svgList = document.getElementsByTagName("svg:svg");

			if (svgList != null && svgList.getLength() > 0)
			{
				this.root = svgList.item(0);
			}
			else
			{
				svgList = document.getElementsByTagName("svg");

				if (svgList != null && svgList.getLength() > 0)
				{
					this.root = svgList.item(0);
				}
			}

			if (this.root != null)
			{
				rootShape = new svgShape(null, null);
				createShape(this.root, rootShape);
			}
		}
	}

	/**
	 * 
	 */
	@Override
	public void paintShape(mxGraphics2DCanvas canvas, mxCellState state)
	{
		double x = state.getX();
		double y = state.getY();
		double w = state.getWidth();
		double h = state.getHeight();

		canvas.getGraphics().translate(x, y);
		double widthRatio = 1;
		double heightRatio = 1;

		if (boundingBox != null)
		{
			widthRatio = w / boundingBox.getWidth();
			heightRatio = h / boundingBox.getHeight();
		}

		this.paintNode(canvas, state, rootShape, widthRatio, heightRatio);

		canvas.getGraphics().translate(-x, -y);
	}

	/**
	 * 
	 */
	public void paintNode(mxGraphics2DCanvas canvas, mxCellState state,
			svgShape shape, double widthRatio, double heightRatio)
	{
		Shape associatedShape = shape.shape;

		boolean fill = false;
		boolean stroke = true;
		Color fillColor = null;
		Color strokeColor = null;

		Map<String, Object> style = shape.style;

		if (style != null)
		{
			String fillStyle = mxUtils.getString(style,
					CSSConstants.CSS_FILL_PROPERTY);
			String strokeStyle = mxUtils.getString(style,
					CSSConstants.CSS_STROKE_PROPERTY);

			if (strokeStyle != null
					&& strokeStyle.equals(CSSConstants.CSS_NONE_VALUE))
			{
				if (strokeStyle.equals(CSSConstants.CSS_NONE_VALUE))
				{
					stroke = false;
				}
				else if (strokeStyle.trim().startsWith("#"))
				{
					int hashIndex = strokeStyle.indexOf("#");
					strokeColor = mxUtils.parseColor(strokeStyle
							.substring(hashIndex + 1));
				}
			}

			if (fillStyle != null)
			{
				if (fillStyle.equals(CSSConstants.CSS_NONE_VALUE))
				{
					fill = false;
				}
				else if (fillStyle.trim().startsWith("#"))
				{
					int hashIndex = fillStyle.indexOf("#");
					fillColor = mxUtils.parseColor(fillStyle
							.substring(hashIndex + 1));
					fill = true;
				}
				else
				{
					fill = true;
				}
			}
		}

		if (associatedShape != null)
		{
			boolean wasScaled = false;

			if (widthRatio != 1 || heightRatio != 1)
			{
				transformShape(associatedShape, 0.0, 0.0, widthRatio,
						heightRatio);
				wasScaled = true;
			}

			// Paints the background
			if (fill && configureGraphics(canvas, state, true))
			{
				if (fillColor != null)
				{
					canvas.getGraphics().setColor(fillColor);
				}

				canvas.getGraphics().fill(associatedShape);
			}

			// Paints the foreground
			if (stroke && configureGraphics(canvas, state, false))
			{
				if (strokeColor != null)
				{
					canvas.getGraphics().setColor(strokeColor);
				}

				canvas.getGraphics().draw(associatedShape);
			}

			if (wasScaled)
			{
				transformShape(associatedShape, 0.0, 0.0, 1.0 / widthRatio,
						1.0 / heightRatio);
			}
		}

		/*
		 * If root is a group element, then we should add it's styles to the
		 * children.
		 */
		for (svgShape subShape : shape.subShapes)
		{
			paintNode(canvas, state, subShape, widthRatio, heightRatio);
		}
	}

	/**
	 * Scales the points composing this shape by the x and y ratios specified
	 * 
	 * @param shape
	 *            the shape to scale
	 * @param transX
	 *            the x translation
	 * @param transY
	 *            the y translation
	 * @param widthRatio
	 *            the x co-ordinate scale
	 * @param heightRatio
	 *            the y co-ordinate scale
	 */
	protected void transformShape(Shape shape, double transX, double transY,
			double widthRatio, double heightRatio)
	{
		if (shape instanceof Rectangle2D)
		{
			Rectangle2D rect = (Rectangle2D) shape;
			if (transX != 0 || transY != 0)
			{
				rect.setFrame(rect.getX() + transX, rect.getY() + transY,
						rect.getWidth(), rect.getHeight());
			}

			if (widthRatio != 1 || heightRatio != 1)
			{
				rect.setFrame(rect.getX() * widthRatio, rect.getY()
						* heightRatio, rect.getWidth() * widthRatio,
						rect.getHeight() * heightRatio);
			}
		}
		else if (shape instanceof Line2D)
		{
			Line2D line = (Line2D) shape;
			if (transX != 0 || transY != 0)
			{
				line.setLine(line.getX1() + transX, line.getY1() + transY,
						line.getX2() + transX, line.getY2() + transY);
			}
			if (widthRatio != 1 || heightRatio != 1)
			{
				line.setLine(line.getX1() * widthRatio, line.getY1()
						* heightRatio, line.getX2() * widthRatio, line.getY2()
						* heightRatio);
			}
		}
		else if (shape instanceof GeneralPath)
		{
			GeneralPath path = (GeneralPath) shape;
			cachedTransform.setToScale(widthRatio, heightRatio);
			cachedTransform.translate(transX, transY);
			path.transform(cachedTransform);
		}
		else if (shape instanceof ExtendedGeneralPath)
		{
			ExtendedGeneralPath path = (ExtendedGeneralPath) shape;
			cachedTransform.setToScale(widthRatio, heightRatio);
			cachedTransform.translate(transX, transY);
			path.transform(cachedTransform);
		}
		else if (shape instanceof Ellipse2D)
		{
			Ellipse2D ellipse = (Ellipse2D) shape;
			if (transX != 0 || transY != 0)
			{
				ellipse.setFrame(ellipse.getX() + transX, ellipse.getY()
						+ transY, ellipse.getWidth(), ellipse.getHeight());
			}
			if (widthRatio != 1 || heightRatio != 1)
			{
				ellipse.setFrame(ellipse.getX() * widthRatio, ellipse.getY()
						* heightRatio, ellipse.getWidth() * widthRatio,
						ellipse.getHeight() * heightRatio);
			}
		}
	}

	/**
	 * 
	 */
	public void createShape(Node root, svgShape shape)
	{
		Node child = root.getFirstChild();
		/*
		 * If root is a group element, then we should add it's styles to the
		 * childrens...
		 */
		while (child != null)
		{
			if (isGroup(child.getNodeName()))
			{
				String style = ((Element) root).getAttribute("style");
				Map<String, Object> styleMap = mxStencilShape
						.getStylenames(style);
				svgShape subShape = new svgShape(null, styleMap);
				createShape(child, subShape);
			}

			svgShape subShape = createElement(child);

			if (subShape != null)
			{
				shape.subShapes.add(subShape);
			}
			child = child.getNextSibling();
		}

		for (svgShape subShape : shape.subShapes)
		{
			if (subShape != null && subShape.shape != null)
			{
				if (boundingBox == null)
				{
					boundingBox = subShape.shape.getBounds2D();
				}
				else
				{
					boundingBox.add(subShape.shape.getBounds2D());
				}
			}
		}

		// If the shape does not butt up against either or both axis,
		// ensure it is flush against both
		if (boundingBox != null
				&& (boundingBox.getX() != 0 || boundingBox.getY() != 0))
		{
			for (svgShape subShape : shape.subShapes)
			{
				if (subShape != null && subShape.shape != null)
				{
					transformShape(subShape.shape, -boundingBox.getX(),
							-boundingBox.getY(), 1.0, 1.0);
				}
			}
		}
	}

	/**
	 * Forms an internal representation of the specified SVG element and returns
	 * that representation
	 * 
	 * @param root
	 *            the SVG element to represent
	 * @return the internal representation of the element, or null if an error
	 *         occurs
	 */
	public svgShape createElement(Node root)
	{
		Element element = null;

		if (root instanceof Element)
		{
			element = (Element) root;
			String style = element.getAttribute("style");
			Map<String, Object> styleMap = mxStencilShape.getStylenames(style);

			if (isRectangle(root.getNodeName()))
			{
				svgShape rectShape = null;

				try
				{
					String xString = element.getAttribute("x");
					String yString = element.getAttribute("y");
					String widthString = element.getAttribute("width");
					String heightString = element.getAttribute("height");

					// Values default to zero if not specified
					double x = 0;
					double y = 0;
					double width = 0;
					double height = 0;

					if (xString.length() > 0)
					{
						x = Double.valueOf(xString);
					}
					if (yString.length() > 0)
					{
						y = Double.valueOf(yString);
					}
					if (widthString.length() > 0)
					{
						width = Double.valueOf(widthString);
						if (width < 0)
						{
							return null; // error in SVG spec
						}
					}
					if (heightString.length() > 0)
					{
						height = Double.valueOf(heightString);
						if (height < 0)
						{
							return null; // error in SVG spec
						}
					}

					String rxString = element.getAttribute("rx");
					String ryString = element.getAttribute("ry");
					double rx = 0;
					double ry = 0;

					if (rxString.length() > 0)
					{
						rx = Double.valueOf(rxString);
						if (rx < 0)
						{
							return null; // error in SVG spec
						}
					}
					if (ryString.length() > 0)
					{
						ry = Double.valueOf(ryString);
						if (ry < 0)
						{
							return null; // error in SVG spec
						}
					}

					if (rx > 0 || ry > 0)
					{
						// Specification rules on rx and ry
						if (rx > 0 && ryString.length() == 0)
						{
							ry = rx;
						}
						else if (ry > 0 && rxString.length() == 0)
						{
							rx = ry;
						}
						if (rx > width / 2.0)
						{
							rx = width / 2.0;
						}
						if (ry > height / 2.0)
						{
							ry = height / 2.0;
						}

						rectShape = new svgShape(new RoundRectangle2D.Double(x,
								y, width, height, rx, ry), styleMap);
					}
					else
					{
						rectShape = new svgShape(new Rectangle2D.Double(x, y,
								width, height), styleMap);
					}
				}
				catch (Exception e)
				{
					log.log(Level.SEVERE, "Failed to create SVG element", e);
				}

				return rectShape;
			}
			else if (isLine(root.getNodeName()))
			{
				String x1String = element.getAttribute("x1");
				String x2String = element.getAttribute("x2");
				String y1String = element.getAttribute("y1");
				String y2String = element.getAttribute("y2");

				double x1 = 0;
				double x2 = 0;
				double y1 = 0;
				double y2 = 0;

				if (x1String.length() > 0)
				{
					x1 = Double.valueOf(x1String);
				}
				if (x2String.length() > 0)
				{
					x2 = Double.valueOf(x2String);
				}
				if (y1String.length() > 0)
				{
					y1 = Double.valueOf(y1String);
				}
				if (y2String.length() > 0)
				{
					y2 = Double.valueOf(y2String);
				}

				svgShape lineShape = new svgShape(new Line2D.Double(x1, y1, x2,
						y2), styleMap);
				return lineShape;
			}
			else if (isPolyline(root.getNodeName())
					|| isPolygon(root.getNodeName()))
			{
				String pointsString = element.getAttribute("points");
				Shape shape;

				if (isPolygon(root.getNodeName()))
				{
					shape = AWTPolygonProducer.createShape(pointsString,
							GeneralPath.WIND_NON_ZERO);
				}
				else
				{
					shape = AWTPolylineProducer.createShape(pointsString,
							GeneralPath.WIND_NON_ZERO);
				}

				if (shape != null)
				{
					return new svgShape(shape, styleMap);
				}

				return null;
			}
			else if (isCircle(root.getNodeName()))
			{
				double cx = 0;
				double cy = 0;
				double r = 0;

				String cxString = element.getAttribute("cx");
				String cyString = element.getAttribute("cy");
				String rString = element.getAttribute("r");

				if (cxString.length() > 0)
				{
					cx = Double.valueOf(cxString);
				}
				if (cyString.length() > 0)
				{
					cy = Double.valueOf(cyString);
				}
				if (rString.length() > 0)
				{
					r = Double.valueOf(rString);

					if (r < 0)
					{
						return null; // error in SVG spec
					}
				}

				return new svgShape(new Ellipse2D.Double(cx - r, cy - r, r * 2,
						r * 2), styleMap);
			}
			else if (isEllipse(root.getNodeName()))
			{
				double cx = 0;
				double cy = 0;
				double rx = 0;
				double ry = 0;

				String cxString = element.getAttribute("cx");
				String cyString = element.getAttribute("cy");
				String rxString = element.getAttribute("rx");
				String ryString = element.getAttribute("ry");

				if (cxString.length() > 0)
				{
					cx = Double.valueOf(cxString);
				}
				if (cyString.length() > 0)
				{
					cy = Double.valueOf(cyString);
				}
				if (rxString.length() > 0)
				{
					rx = Double.valueOf(rxString);

					if (rx < 0)
					{
						return null; // error in SVG spec
					}
				}
				if (ryString.length() > 0)
				{
					ry = Double.valueOf(ryString);

					if (ry < 0)
					{
						return null; // error in SVG spec
					}
				}

				return new svgShape(new Ellipse2D.Double(cx - rx, cy - ry,
						rx * 2, ry * 2), styleMap);
			}
			else if (isPath(root.getNodeName()))
			{
				String d = element.getAttribute("d");
				Shape pathShape = AWTPathProducer.createShape(d,
						GeneralPath.WIND_NON_ZERO);
				return new svgShape(pathShape, styleMap);
			}
		}

		return null;
	}

	/*
	 *
	 */
	private boolean isRectangle(String tag)
	{
		return tag.equals("svg:rect") || tag.equals("rect");
	}

	/*
	 *
	 */
	private boolean isPath(String tag)
	{
		return tag.equals("svg:path") || tag.equals("path");
	}

	/*
	 *
	 */
	private boolean isEllipse(String tag)
	{
		return tag.equals("svg:ellipse") || tag.equals("ellipse");
	}

	/*
	 *
	 */
	private boolean isLine(String tag)
	{
		return tag.equals("svg:line") || tag.equals("line");
	}

	/*
	 *
	 */
	private boolean isPolyline(String tag)
	{
		return tag.equals("svg:polyline") || tag.equals("polyline");
	}

	/*
	 *
	 */
	private boolean isCircle(String tag)
	{
		return tag.equals("svg:circle") || tag.equals("circle");
	}

	/*
	 *
	 */
	private boolean isPolygon(String tag)
	{
		return tag.equals("svg:polygon") || tag.equals("polygon");
	}

	private boolean isGroup(String tag)
	{
		return tag.equals("svg:g") || tag.equals("g");
	}

	protected class svgShape
	{
		public Shape shape;

		/**
		 * Contains an array of key, value pairs that represent the style of the
		 * cell.
		 */
		protected Map<String, Object> style;

		public List<svgShape> subShapes;

		/**
		 * Holds the current value to which the shape is scaled in X
		 */
		protected double currentXScale;

		/**
		 * Holds the current value to which the shape is scaled in Y
		 */
		protected double currentYScale;

		public svgShape(Shape shape, Map<String, Object> style)
		{
			this.shape = shape;
			this.style = style;
			subShapes = new ArrayList<svgShape>();
		}

		public double getCurrentXScale()
		{
			return currentXScale;
		}

		public void setCurrentXScale(double currentXScale)
		{
			this.currentXScale = currentXScale;
		}

		public double getCurrentYScale()
		{
			return currentYScale;
		}

		public void setCurrentYScale(double currentYScale)
		{
			this.currentYScale = currentYScale;
		}
	}

	/**
	 * Returns the stylenames in a style of the form stylename[;key=value] or an
	 * empty array if the given style does not contain any stylenames.
	 * 
	 * @param style
	 *            String of the form stylename[;stylename][;key=value].
	 * @return Returns the stylename from the given formatted string.
	 */
	protected static Map<String, Object> getStylenames(String style)
	{
		if (style != null && style.length() > 0)
		{
			Map<String, Object> result = new Hashtable<String, Object>();

			if (style != null)
			{
				String[] pairs = style.split(";");

				for (int i = 0; i < pairs.length; i++)
				{
					String[] keyValue = pairs[i].split(":");

					if (keyValue.length == 2)
					{
						result.put(keyValue[0].trim(), keyValue[1].trim());
					}
				}
			}
			return result;
		}

		return null;
	}

	public String getName()
	{
		return name;
	}

	public void setName(String name)
	{
		this.name = name;
	}

	public String getIconPath()
	{
		return iconPath;
	}

	public void setIconPath(String iconPath)
	{
		this.iconPath = iconPath;
	}

	public Rectangle2D getBoundingBox()
	{
		return boundingBox;
	}

	public void setBoundingBox(Rectangle2D boundingBox)
	{
		this.boundingBox = boundingBox;
	}
}
