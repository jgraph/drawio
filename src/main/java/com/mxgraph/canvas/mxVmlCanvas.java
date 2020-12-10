/**
 * Copyright (c) 2007, Gaudenz Alder
 */
package com.mxgraph.canvas;

import java.awt.Rectangle;
import java.util.Hashtable;
import java.util.List;
import java.util.Map;

import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.Node;

import com.mxgraph.util.mxConstants;
import com.mxgraph.util.mxPoint;
import com.mxgraph.util.mxRectangle;
import com.mxgraph.util.mxUtils;
import com.mxgraph.view.mxCellState;

/**
 * An implementation of a canvas that uses VML for painting.
 */
public class mxVmlCanvas extends mxBasicCanvas
{

	/**
	 * Holds the HTML document that represents the canvas.
	 */
	protected Document document;

	/**
	 * Constructs a new VML canvas for the specified dimension and scale.
	 */
	public mxVmlCanvas()
	{
		this(null);
	}

	/**
	 * Constructs a new VML canvas for the specified bounds, scale and
	 * background color.
	 */
	public mxVmlCanvas(Document document)
	{
		setDocument(document);
	}

	/**
	 * 
	 */
	public void setDocument(Document document)
	{
		this.document = document;
	}

	/**
	 * Returns a reference to the document that represents the canvas.
	 * 
	 * @return Returns the document.
	 */
	public Document getDocument()
	{
		return document;
	}

	/**
	 * 
	 */
	public void appendVmlElement(Element node)
	{
		if (document != null)
		{
			Node body = document.getDocumentElement().getFirstChild()
					.getNextSibling();

			if (body != null)
			{
				body.appendChild(node);
			}
		}

	}

	/* (non-Javadoc)
	 * @see com.mxgraph.canvas.mxICanvas#drawCell()
	 */
	public Object drawCell(mxCellState state)
	{
		Map<String, Object> style = state.getStyle();
		Element elem = null;

		if (state.getAbsolutePointCount() > 1)
		{
			List<mxPoint> pts = state.getAbsolutePoints();

			// Transpose all points by cloning into a new array
			pts = mxUtils.translatePoints(pts, translate.getX(), translate.getY());

			// Draws the line
			elem = drawLine(pts, style);
			Element strokeNode = document.createElement("v:stroke");

			// Draws the markers
			String start = mxUtils.getString(style,
					mxConstants.STYLE_STARTARROW);
			String end = mxUtils.getString(style, mxConstants.STYLE_ENDARROW);

			if (start != null || end != null)
			{
				if (start != null)
				{
					strokeNode.setAttribute("startarrow", start);

					String startWidth = "medium";
					String startLength = "medium";
					double startSize = mxUtils.getFloat(style,
							mxConstants.STYLE_STARTSIZE,
							mxConstants.DEFAULT_MARKERSIZE)
							* scale;

					if (startSize < 6)
					{
						startWidth = "narrow";
						startLength = "short";
					}
					else if (startSize > 10)
					{
						startWidth = "wide";
						startLength = "long";
					}

					strokeNode.setAttribute("startarrowwidth", startWidth);
					strokeNode.setAttribute("startarrowlength", startLength);
				}

				if (end != null)
				{
					strokeNode.setAttribute("endarrow", end);

					String endWidth = "medium";
					String endLength = "medium";
					double endSize = mxUtils.getFloat(style,
							mxConstants.STYLE_ENDSIZE,
							mxConstants.DEFAULT_MARKERSIZE)
							* scale;

					if (endSize < 6)
					{
						endWidth = "narrow";
						endLength = "short";
					}
					else if (endSize > 10)
					{
						endWidth = "wide";
						endLength = "long";
					}

					strokeNode.setAttribute("endarrowwidth", endWidth);
					strokeNode.setAttribute("endarrowlength", endLength);
				}
			}

			if (mxUtils.isTrue(style, mxConstants.STYLE_DASHED))
			{
				strokeNode.setAttribute("dashstyle", "2 2");
			}

			elem.appendChild(strokeNode);
		}
		else
		{
			int x = (int) (state.getX() + translate.getX());
			int y = (int) (state.getY() + translate.getY());
			int w = (int) state.getWidth();
			int h = (int) state.getHeight();

			if (!mxUtils.getString(style, mxConstants.STYLE_SHAPE, "").equals(
					mxConstants.SHAPE_SWIMLANE))
			{
				elem = drawShape(x, y, w, h, style);

				if (mxUtils.isTrue(style, mxConstants.STYLE_DASHED))
				{
					Element strokeNode = document.createElement("v:stroke");
					strokeNode.setAttribute("dashstyle", "2 2");
					elem.appendChild(strokeNode);
				}
			}
			else
			{
				int start = (int) Math.round(mxUtils.getInt(style,
						mxConstants.STYLE_STARTSIZE,
						mxConstants.DEFAULT_STARTSIZE)
						* scale);

				// Removes some styles to draw the content area
				Map<String, Object> cloned = new Hashtable<String, Object>(
						style);
				cloned.remove(mxConstants.STYLE_FILLCOLOR);
				cloned.remove(mxConstants.STYLE_ROUNDED);

				if (mxUtils.isTrue(style, mxConstants.STYLE_HORIZONTAL, true))
				{
					elem = drawShape(x, y, w, start, style);
					drawShape(x, y + start, w, h - start, cloned);
				}
				else
				{
					elem = drawShape(x, y, start, h, style);
					drawShape(x + start, y, w - start, h, cloned);
				}
			}
		}

		return elem;
	}

	/*
	 * (non-Javadoc)
	 * @see com.mxgraph.canvas.mxICanvas#drawLabel()
	 */
	public Object drawLabel(String label, mxCellState state, boolean html)
	{
		mxRectangle bounds = state.getLabelBounds();

		if (drawLabels && bounds != null)
		{
			int x = (int) (bounds.getX() + translate.getX());
			int y = (int) (bounds.getY() + translate.getY());
			int w = (int) bounds.getWidth();
			int h = (int) bounds.getHeight();
			Map<String, Object> style = state.getStyle();

			return drawText(label, x, y, w, h, style);
		}

		return null;
	}

	/**
	 * Draws the shape specified with the STYLE_SHAPE key in the given style.
	 * 
	 * @param x X-coordinate of the shape.
	 * @param y Y-coordinate of the shape.
	 * @param w Width of the shape.
	 * @param h Height of the shape.
	 * @param style Style of the the shape.
	 */
	public Element drawShape(int x, int y, int w, int h,
			Map<String, Object> style)
	{
		String fillColor = mxUtils
				.getString(style, mxConstants.STYLE_FILLCOLOR);
		String strokeColor = mxUtils.getString(style,
				mxConstants.STYLE_STROKECOLOR);
		float strokeWidth = (float) (mxUtils.getFloat(style,
				mxConstants.STYLE_STROKEWIDTH, 1) * scale);

		// Draws the shape
		String shape = mxUtils.getString(style, mxConstants.STYLE_SHAPE);
		Element elem = null;

		if (shape.equals(mxConstants.SHAPE_IMAGE))
		{
			String img = getImageForStyle(style);

			if (img != null)
			{
				elem = document.createElement("v:img");
				elem.setAttribute("src", img);
			}
		}
		else if (shape.equals(mxConstants.SHAPE_LINE))
		{
			String direction = mxUtils.getString(style,
					mxConstants.STYLE_DIRECTION, mxConstants.DIRECTION_EAST);
			String points = null;

			if (direction.equals(mxConstants.DIRECTION_EAST)
					|| direction.equals(mxConstants.DIRECTION_WEST))
			{
				int mid = Math.round(h / 2);
				points = "m 0 " + mid + " l " + w + " " + mid;
			}
			else
			{
				int mid = Math.round(w / 2);
				points = "m " + mid + " 0 L " + mid + " " + h;
			}

			elem = document.createElement("v:shape");
			elem.setAttribute("coordsize", w + " " + h);
			elem.setAttribute("path", points + " x e");
		}
		else if (shape.equals(mxConstants.SHAPE_ELLIPSE))
		{
			elem = document.createElement("v:oval");
		}
		else if (shape.equals(mxConstants.SHAPE_DOUBLE_ELLIPSE))
		{
			elem = document.createElement("v:shape");
			elem.setAttribute("coordsize", w + " " + h);
			int inset = (int) ((3 + strokeWidth) * scale);

			String points = "ar 0 0 " + w + " " + h + " 0 " + (h / 2) + " "
					+ (w / 2) + " " + (h / 2) + " e ar " + inset + " " + inset
					+ " " + (w - inset) + " " + (h - inset) + " 0 " + (h / 2)
					+ " " + (w / 2) + " " + (h / 2);

			elem.setAttribute("path", points + " x e");
		}
		else if (shape.equals(mxConstants.SHAPE_RHOMBUS))
		{
			elem = document.createElement("v:shape");
			elem.setAttribute("coordsize", w + " " + h);

			String points = "m " + (w / 2) + " 0 l " + w + " " + (h / 2)
					+ " l " + (w / 2) + " " + h + " l 0 " + (h / 2);

			elem.setAttribute("path", points + " x e");
		}
		else if (shape.equals(mxConstants.SHAPE_TRIANGLE))
		{
			elem = document.createElement("v:shape");
			elem.setAttribute("coordsize", w + " " + h);

			String direction = mxUtils.getString(style,
					mxConstants.STYLE_DIRECTION, "");
			String points = null;

			if (direction.equals(mxConstants.DIRECTION_NORTH))
			{
				points = "m 0 " + h + " l " + (w / 2) + " 0 " + " l " + w + " "
						+ h;
			}
			else if (direction.equals(mxConstants.DIRECTION_SOUTH))
			{
				points = "m 0 0 l " + (w / 2) + " " + h + " l " + w + " 0";
			}
			else if (direction.equals(mxConstants.DIRECTION_WEST))
			{
				points = "m " + w + " 0 l " + w + " " + (h / 2) + " l " + w
						+ " " + h;
			}
			else
			// east
			{
				points = "m 0 0 l " + w + " " + (h / 2) + " l 0 " + h;
			}

			elem.setAttribute("path", points + " x e");
		}
		else if (shape.equals(mxConstants.SHAPE_HEXAGON))
		{
			elem = document.createElement("v:shape");
			elem.setAttribute("coordsize", w + " " + h);

			String direction = mxUtils.getString(style,
					mxConstants.STYLE_DIRECTION, "");
			String points = null;

			if (direction.equals(mxConstants.DIRECTION_NORTH)
					|| direction.equals(mxConstants.DIRECTION_SOUTH))
			{
				points = "m " + (int) (0.5 * w) + " 0 l " + w + " "
						+ (int) (0.25 * h) + " l " + w + " " + (int) (0.75 * h)
						+ " l " + (int) (0.5 * w) + " " + h + " l 0 "
						+ (int) (0.75 * h) + " l 0 " + (int) (0.25 * h);
			}
			else
			{
				points = "m " + (int) (0.25 * w) + " 0 l " + (int) (0.75 * w)
						+ " 0 l " + w + " " + (int) (0.5 * h) + " l "
						+ (int) (0.75 * w) + " " + h + " l " + (int) (0.25 * w)
						+ " " + h + " l 0 " + (int) (0.5 * h);
			}

			elem.setAttribute("path", points + " x e");
		}
		else if (shape.equals(mxConstants.SHAPE_CLOUD))
		{
			elem = document.createElement("v:shape");
			elem.setAttribute("coordsize", w + " " + h);

			String points = "m " + (int) (0.25 * w) + " " + (int) (0.25 * h)
					+ " c " + (int) (0.05 * w) + " " + (int) (0.25 * h) + " 0 "
					+ (int) (0.5 * h) + " " + (int) (0.16 * w) + " "
					+ (int) (0.55 * h) + " c 0 " + (int) (0.66 * h) + " "
					+ (int) (0.18 * w) + " " + (int) (0.9 * h) + " "
					+ (int) (0.31 * w) + " " + (int) (0.8 * h) + " c "
					+ (int) (0.4 * w) + " " + (h) + " " + (int) (0.7 * w) + " "
					+ (h) + " " + (int) (0.8 * w) + " " + (int) (0.8 * h)
					+ " c " + (w) + " " + (int) (0.8 * h) + " " + (w) + " "
					+ (int) (0.6 * h) + " " + (int) (0.875 * w) + " "
					+ (int) (0.5 * h) + " c " + (w) + " " + (int) (0.3 * h)
					+ " " + (int) (0.8 * w) + " " + (int) (0.1 * h) + " "
					+ (int) (0.625 * w) + " " + (int) (0.2 * h) + " c "
					+ (int) (0.5 * w) + " " + (int) (0.05 * h) + " "
					+ (int) (0.3 * w) + " " + (int) (0.05 * h) + " "
					+ (int) (0.25 * w) + " " + (int) (0.25 * h);

			elem.setAttribute("path", points + " x e");
		}
		else if (shape.equals(mxConstants.SHAPE_ACTOR))
		{
			elem = document.createElement("v:shape");
			elem.setAttribute("coordsize", w + " " + h);

			double width3 = w / 3;
			String points = "m 0 " + (h) + " C 0 " + (3 * h / 5) + " 0 "
					+ (2 * h / 5) + " " + (w / 2) + " " + (2 * h / 5) + " c "
					+ (int) (w / 2 - width3) + " " + (2 * h / 5) + " "
					+ (int) (w / 2 - width3) + " 0 " + (w / 2) + " 0 c "
					+ (int) (w / 2 + width3) + " 0 " + (int) (w / 2 + width3)
					+ " " + (2 * h / 5) + " " + (w / 2) + " " + (2 * h / 5)
					+ " c " + (w) + " " + (2 * h / 5) + " " + (w) + " "
					+ (3 * h / 5) + " " + (w) + " " + (h);

			elem.setAttribute("path", points + " x e");
		}
		else if (shape.equals(mxConstants.SHAPE_CYLINDER))
		{
			elem = document.createElement("v:shape");
			elem.setAttribute("coordsize", w + " " + h);

			double dy = Math.min(40, Math.floor(h / 5));
			String points = "m 0 " + (int) (dy) + " C 0 " + (int) (dy / 3)
					+ " " + (w) + " " + (int) (dy / 3) + " " + (w) + " "
					+ (int) (dy) + " L " + (w) + " " + (int) (h - dy) + " C "
					+ (w) + " " + (int) (h + dy / 3) + " 0 "
					+ (int) (h + dy / 3) + " 0 " + (int) (h - dy) + " x e"
					+ " m 0 " + (int) (dy) + " C 0 " + (int) (2 * dy) + " "
					+ (w) + " " + (int) (2 * dy) + " " + (w) + " " + (int) (dy);

			elem.setAttribute("path", points + " e");
		}
		else
		{
			if (mxUtils.isTrue(style, mxConstants.STYLE_ROUNDED, false))
			{
				elem = document.createElement("v:roundrect");
				elem.setAttribute("arcsize",
						(mxConstants.RECTANGLE_ROUNDING_FACTOR * 100) + "%");
			}
			else
			{
				elem = document.createElement("v:rect");
			}
		}

		String s = "position:absolute;left:" + String.valueOf(x) + "px;top:"
				+ String.valueOf(y) + "px;width:" + String.valueOf(w)
				+ "px;height:" + String.valueOf(h) + "px;";

		// Applies rotation
		double rotation = mxUtils.getDouble(style, mxConstants.STYLE_ROTATION);

		if (rotation != 0)
		{
			s += "rotation:" + rotation + ";";
		}

		elem.setAttribute("style", s);

		// Adds the shadow element
		if (mxUtils.isTrue(style, mxConstants.STYLE_SHADOW, false)
				&& fillColor != null)
		{
			Element shadow = document.createElement("v:shadow");
			shadow.setAttribute("on", "true");
			shadow.setAttribute("color", mxConstants.W3C_SHADOWCOLOR);
			elem.appendChild(shadow);
		}

		float opacity = mxUtils.getFloat(style, mxConstants.STYLE_OPACITY, 100);
		float fillOpacity = mxUtils.getFloat(style, mxConstants.STYLE_FILL_OPACITY, 100);
		float strokeOpacity = mxUtils.getFloat(style, mxConstants.STYLE_STROKE_OPACITY, 100);

		// Applies opacity to fill
		if (fillColor != null)
		{
			Element fill = document.createElement("v:fill");
			fill.setAttribute("color", fillColor);

			if (opacity != 100 || fillOpacity != 100)
			{
				fill.setAttribute("opacity", String.valueOf(opacity * fillOpacity / 10000));
			}

			elem.appendChild(fill);
		}
		else
		{
			elem.setAttribute("filled", "false");
		}

		// Applies opacity to stroke
		if (strokeColor != null)
		{
			elem.setAttribute("strokecolor", strokeColor);
			Element stroke = document.createElement("v:stroke");

			if (opacity != 100 || strokeOpacity != 100)
			{
				stroke.setAttribute("opacity", String.valueOf(opacity * strokeOpacity / 10000));
			}

			elem.appendChild(stroke);
		}
		else
		{
			elem.setAttribute("stroked", "false");
		}

		elem.setAttribute("strokeweight", String.valueOf(strokeWidth) + "px");
		appendVmlElement(elem);

		return elem;
	}

	/**
	 * Draws the given lines as segments between all points of the given list
	 * of mxPoints.
	 * 
	 * @param pts List of points that define the line.
	 * @param style Style to be used for painting the line.
	 */
	public Element drawLine(List<mxPoint> pts, Map<String, Object> style)
	{
		String strokeColor = mxUtils.getString(style,
				mxConstants.STYLE_STROKECOLOR);
		float strokeWidth = (float) (mxUtils.getFloat(style,
				mxConstants.STYLE_STROKEWIDTH, 1) * scale);

		Element elem = document.createElement("v:shape");

		if (strokeColor != null && strokeWidth > 0)
		{
			mxPoint pt = pts.get(0);
			Rectangle r = new Rectangle(pt.getPoint());

			StringBuilder buf = new StringBuilder("m " + Math.round(pt.getX())
					+ " " + Math.round(pt.getY()));

			for (int i = 1; i < pts.size(); i++)
			{
				pt = pts.get(i);
				buf.append(" l " + Math.round(pt.getX()) + " "
						+ Math.round(pt.getY()));

				r = r.union(new Rectangle(pt.getPoint()));
			}

			String d = buf.toString();
			elem.setAttribute("path", d);
			elem.setAttribute("filled", "false");
			elem.setAttribute("strokecolor", strokeColor);
			elem.setAttribute("strokeweight", String.valueOf(strokeWidth)
					+ "px");

			String s = "position:absolute;" + "left:" + String.valueOf(r.x)
					+ "px;" + "top:" + String.valueOf(r.y) + "px;" + "width:"
					+ String.valueOf(r.width) + "px;" + "height:"
					+ String.valueOf(r.height) + "px;";
			elem.setAttribute("style", s);

			elem.setAttribute("coordorigin",
					String.valueOf(r.x) + " " + String.valueOf(r.y));
			elem.setAttribute("coordsize", String.valueOf(r.width) + " "
					+ String.valueOf(r.height));
		}

		appendVmlElement(elem);

		return elem;
	}

	/**
	 * Draws the specified text either using drawHtmlString or using drawString.
	 * 
	 * @param text Text to be painted.
	 * @param x X-coordinate of the text.
	 * @param y Y-coordinate of the text.
	 * @param w Width of the text.
	 * @param h Height of the text.
	 * @param style Style to be used for painting the text.
	 */
	public Element drawText(String text, int x, int y, int w, int h,
			Map<String, Object> style)
	{
		Element table = mxUtils.createTable(document, text, x, y, w, h, scale,
				style);
		appendVmlElement(table);

		return table;
	}

}
