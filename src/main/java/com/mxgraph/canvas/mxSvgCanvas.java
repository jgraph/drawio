/**
 * Copyright (c) 2007, Gaudenz Alder
 */
package com.mxgraph.canvas;

import java.awt.Font;
import java.io.BufferedInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.URL;
import java.util.Hashtable;
import java.util.List;
import java.util.Map;
import java.util.logging.Level;
import java.util.logging.Logger;

import org.w3c.dom.Document;
import org.w3c.dom.Element;

import com.mxgraph.util.mxBase64;
import com.mxgraph.util.mxConstants;
import com.mxgraph.util.mxPoint;
import com.mxgraph.util.mxRectangle;
import com.mxgraph.util.mxUtils;
import com.mxgraph.view.mxCellState;

/**
 * An implementation of a canvas that uses SVG for painting. This canvas
 * ignores the STYLE_LABEL_BACKGROUNDCOLOR and
 * STYLE_LABEL_BORDERCOLOR styles due to limitations of SVG.
 */
public class mxSvgCanvas extends mxBasicCanvas
{

	private static final Logger log = Logger.getLogger(mxSvgCanvas.class.getName());

	/**
	 * Holds the HTML document that represents the canvas.
	 */
	protected Document document;

	/**
	 * Used internally for looking up elements. Workaround for getElementById
	 * not working.
	 */
	private Map<String, Element> gradients = new Hashtable<String, Element>();

	/**
	 * Used internally for looking up images.
	 */
	private Map<String, Element> images = new Hashtable<String, Element>();

	/**
	 * 
	 */
	protected Element defs = null;

	/**
	 * Specifies if images should be embedded as base64 encoded strings.
	 * Default is false.
	 */
	protected boolean embedded = false;

	/**
	 * Constructs a new SVG canvas for the specified dimension and scale.
	 */
	public mxSvgCanvas()
	{
		this(null);
	}

	/**
	 * Constructs a new SVG canvas for the specified bounds, scale and
	 * background color.
	 */
	public mxSvgCanvas(Document document)
	{
		setDocument(document);
	}

	/**
	 * 
	 */
	public void appendSvgElement(Element node)
	{
		if (document != null)
		{
			document.getDocumentElement().appendChild(node);
		}
	}

	/**
	 * 
	 */
	protected Element getDefsElement()
	{
		if (defs == null)
		{
			defs = document.createElement("defs");

			Element svgNode = document.getDocumentElement();

			if (svgNode.hasChildNodes())
			{
				svgNode.insertBefore(defs, svgNode.getFirstChild());
			}
			else
			{
				svgNode.appendChild(defs);
			}
		}

		return defs;
	}

	/**
	 * 
	 */
	public Element getGradientElement(String start, String end, String direction)
	{
		String id = getGradientId(start, end, direction);
		Element gradient = gradients.get(id);

		if (gradient == null)
		{
			gradient = createGradientElement(start, end, direction);
			gradient.setAttribute("id", "g" + (gradients.size() + 1));
			getDefsElement().appendChild(gradient);
			gradients.put(id, gradient);
		}

		return gradient;
	}

	/**
	 * 
	 */
	public Element getGlassGradientElement()
	{
		String id = "mx-glass-gradient";

		Element glassGradient = gradients.get(id);

		if (glassGradient == null)
		{
			glassGradient = document.createElement("linearGradient");
			glassGradient.setAttribute("x1", "0%");
			glassGradient.setAttribute("y1", "0%");
			glassGradient.setAttribute("x2", "0%");
			glassGradient.setAttribute("y2", "100%");

			Element stop1 = document.createElement("stop");
			stop1.setAttribute("offset", "0%");
			stop1.setAttribute("style", "stop-color:#ffffff;stop-opacity:0.9");
			glassGradient.appendChild(stop1);

			Element stop2 = document.createElement("stop");
			stop2.setAttribute("offset", "100%");
			stop2.setAttribute("style", "stop-color:#ffffff;stop-opacity:0.1");
			glassGradient.appendChild(stop2);

			glassGradient.setAttribute("id", "g" + (gradients.size() + 1));
			getDefsElement().appendChild(glassGradient);
			gradients.put(id, glassGradient);
		}

		return glassGradient;
	}

	/**
	 * 
	 */
	protected Element createGradientElement(String start, String end,
			String direction)
	{
		Element gradient = document.createElement("linearGradient");
		gradient.setAttribute("x1", "0%");
		gradient.setAttribute("y1", "0%");
		gradient.setAttribute("x2", "0%");
		gradient.setAttribute("y2", "0%");

		if (direction == null || direction.equals(mxConstants.DIRECTION_SOUTH))
		{
			gradient.setAttribute("y2", "100%");
		}
		else if (direction.equals(mxConstants.DIRECTION_EAST))
		{
			gradient.setAttribute("x2", "100%");
		}
		else if (direction.equals(mxConstants.DIRECTION_NORTH))
		{
			gradient.setAttribute("y1", "100%");
		}
		else if (direction.equals(mxConstants.DIRECTION_WEST))
		{
			gradient.setAttribute("x1", "100%");
		}

		Element stop = document.createElement("stop");
		stop.setAttribute("offset", "0%");
		stop.setAttribute("style", "stop-color:" + start);
		gradient.appendChild(stop);

		stop = document.createElement("stop");
		stop.setAttribute("offset", "100%");
		stop.setAttribute("style", "stop-color:" + end);
		gradient.appendChild(stop);

		return gradient;
	}

	/**
	 * 
	 */
	public String getGradientId(String start, String end, String direction)
	{
		// Removes illegal characters from gradient ID
		if (start.startsWith("#"))
		{
			start = start.substring(1);
		}

		if (end.startsWith("#"))
		{
			end = end.substring(1);
		}

		// Workaround for gradient IDs not working in Safari 5 / Chrome 6
		// if they contain uppercase characters
		start = start.toLowerCase();
		end = end.toLowerCase();

		String dir = null;

		if (direction == null || direction.equals(mxConstants.DIRECTION_SOUTH))
		{
			dir = "south";
		}
		else if (direction.equals(mxConstants.DIRECTION_EAST))
		{
			dir = "east";
		}
		else
		{
			String tmp = start;
			start = end;
			end = tmp;

			if (direction.equals(mxConstants.DIRECTION_NORTH))
			{
				dir = "south";
			}
			else if (direction.equals(mxConstants.DIRECTION_WEST))
			{
				dir = "east";
			}
		}

		return "mx-gradient-" + start + "-" + end + "-" + dir;
	}

	/**
	 * Returns true if the given string ends with .png, .jpg or .gif.
	 */
	protected boolean isImageResource(String src)
	{
		return src != null
				&& (src.toLowerCase().endsWith(".png")
						|| src.toLowerCase().endsWith(".jpg") || src
						.toLowerCase().endsWith(".gif"));
	}

	/**
	 * 
	 */
	protected InputStream getResource(String src)
	{
		InputStream stream = null;

		try
		{
			stream = new BufferedInputStream(new URL(src).openStream());
		}
		catch (Exception e1)
		{
			stream = getClass().getResourceAsStream(src);
		}

		return stream;
	}

	/**
	 * @throws IOException 
	 * 
	 */
	protected String createDataUrl(String src) throws IOException
	{
		String result = null;
		InputStream inputStream = isImageResource(src) ? getResource(src) : null;

		if (inputStream != null)
		{
			ByteArrayOutputStream outputStream = new ByteArrayOutputStream(1024);
			byte[] bytes = new byte[512];

			// Read bytes from the input stream in bytes.length-sized chunks and write
			// them into the output stream
			int readBytes;
			while ((readBytes = inputStream.read(bytes)) > 0)
			{
				outputStream.write(bytes, 0, readBytes);
			}

			// Convert the contents of the output stream into a Data URL
			String format = "png";
			int dot = src.lastIndexOf('.');

			if (dot > 0 && dot < src.length())
			{
				format = src.substring(dot + 1);
			}

			result = "data:image/"
					+ format
					+ ";base64,"
					+ mxBase64
							.encodeToString(outputStream.toByteArray(), false);
		}

		return result;
	}

	/**
	 * 
	 */
	protected Element getEmbeddedImageElement(String src)
	{
		Element img = images.get(src);

		if (img == null)
		{
			img = document.createElement("svg");
			img.setAttribute("width", "100%");
			img.setAttribute("height", "100%");

			Element inner = document.createElement("image");
			inner.setAttribute("width", "100%");
			inner.setAttribute("height", "100%");

			// Store before transforming to DataURL
			images.put(src, img);

			if (!src.startsWith("data:image/"))
			{
				try
				{
					String tmp = createDataUrl(src);
					
					if (tmp != null)
					{
						src = tmp;
					}
				}
				catch (IOException e)
				{
					log.log(Level.SEVERE, "Failed to create image data URL", e);
				}
			}

			inner.setAttributeNS(mxConstants.NS_XLINK, "xlink:href", src);
			img.appendChild(inner);
			img.setAttribute("id", "i" + (images.size()));
			getDefsElement().appendChild(img);
		}

		return img;
	}

	/**
	 * 
	 */
	protected Element createImageElement(double x, double y, double w,
			double h, String src, boolean aspect, boolean flipH, boolean flipV,
			boolean embedded)
	{
		Element elem = null;

		if (embedded)
		{
			elem = document.createElement("use");

			Element img = getEmbeddedImageElement(src);
			elem.setAttributeNS(mxConstants.NS_XLINK, "xlink:href",
					"#" + img.getAttribute("id"));
		}
		else
		{
			elem = document.createElement("image");

			elem.setAttributeNS(mxConstants.NS_XLINK, "xlink:href", src);
		}

		elem.setAttribute("x", String.valueOf(x));
		elem.setAttribute("y", String.valueOf(y));
		elem.setAttribute("width", String.valueOf(w));
		elem.setAttribute("height", String.valueOf(h));

		// FIXME: SVG element must be used for reference to image with
		// aspect but for images with no aspect this does not work.
		if (aspect)
		{
			elem.setAttribute("preserveAspectRatio", "xMidYMid");
		}
		else
		{
			elem.setAttribute("preserveAspectRatio", "none");
		}

		double sx = 1;
		double sy = 1;
		double dx = 0;
		double dy = 0;

		if (flipH)
		{
			sx *= -1;
			dx = -w - 2 * x;
		}

		if (flipV)
		{
			sy *= -1;
			dy = -h - 2 * y;
		}

		String transform = "";

		if (sx != 1 || sy != 1)
		{
			transform += "scale(" + sx + " " + sy + ") ";
		}

		if (dx != 0 || dy != 0)
		{
			transform += "translate(" + dx + " " + dy + ") ";
		}

		if (transform.length() > 0)
		{
			elem.setAttribute("transform", transform);
		}

		return elem;
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
	public void setEmbedded(boolean value)
	{
		embedded = value;
	}

	/**
	 * 
	 */
	public boolean isEmbedded()
	{
		return embedded;
	}

	/*
	 * (non-Javadoc)
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

			// Applies opacity
			float opacity = mxUtils.getFloat(style, mxConstants.STYLE_OPACITY,
					100);
			float fillOpacity = mxUtils.getFloat(style, mxConstants.STYLE_FILL_OPACITY,
					100);
			float strokeOpacity = mxUtils.getFloat(style, mxConstants.STYLE_STROKE_OPACITY,
					100);

			if (opacity != 100 || fillOpacity != 100 || strokeOpacity != 100)
			{
				String fillOpac = String.valueOf(opacity * fillOpacity / 10000 );
				String strokeOpac = String.valueOf(opacity * strokeOpacity / 10000);
				elem.setAttribute("fill-opacity", fillOpac);
				elem.setAttribute("stroke-opacity", strokeOpac);
			}
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
		String fillColor = mxUtils.getString(style,
				mxConstants.STYLE_FILLCOLOR, "none");
		String gradientColor = mxUtils.getString(style,
				mxConstants.STYLE_GRADIENTCOLOR, "none");
		String strokeColor = mxUtils.getString(style,
				mxConstants.STYLE_STROKECOLOR, "none");
		float strokeWidth = (float) (mxUtils.getFloat(style,
				mxConstants.STYLE_STROKEWIDTH, 1) * scale);
		float opacity = mxUtils.getFloat(style, mxConstants.STYLE_OPACITY, 100);
		float fillOpacity = mxUtils.getFloat(style, mxConstants.STYLE_FILL_OPACITY, 100);
		float strokeOpacity = mxUtils.getFloat(style, mxConstants.STYLE_STROKE_OPACITY, 100);

		// Draws the shape
		String shape = mxUtils.getString(style, mxConstants.STYLE_SHAPE, "");
		Element elem = null;
		Element background = null;

		if (shape.equals(mxConstants.SHAPE_IMAGE))
		{
			String img = getImageForStyle(style);

			if (img != null)
			{
				// Vertical and horizontal image flipping
				boolean flipH = mxUtils.isTrue(style,
						mxConstants.STYLE_IMAGE_FLIPH, false);
				boolean flipV = mxUtils.isTrue(style,
						mxConstants.STYLE_IMAGE_FLIPV, false);

				elem = createImageElement(x, y, w, h, img,
						PRESERVE_IMAGE_ASPECT, flipH, flipV, isEmbedded());
			}
		}
		else if (shape.equals(mxConstants.SHAPE_LINE))
		{
			String direction = mxUtils.getString(style,
					mxConstants.STYLE_DIRECTION, mxConstants.DIRECTION_EAST);
			String d = null;

			if (direction.equals(mxConstants.DIRECTION_EAST)
					|| direction.equals(mxConstants.DIRECTION_WEST))
			{
				int mid = (y + h / 2);
				d = "M " + x + " " + mid + " L " + (x + w) + " " + mid;
			}
			else
			{
				int mid = (x + w / 2);
				d = "M " + mid + " " + y + " L " + mid + " " + (y + h);
			}

			elem = document.createElement("path");
			elem.setAttribute("d", d + " Z");
		}
		else if (shape.equals(mxConstants.SHAPE_ELLIPSE))
		{
			elem = document.createElement("ellipse");

			elem.setAttribute("cx", String.valueOf(x + w / 2));
			elem.setAttribute("cy", String.valueOf(y + h / 2));
			elem.setAttribute("rx", String.valueOf(w / 2));
			elem.setAttribute("ry", String.valueOf(h / 2));
		}
		else if (shape.equals(mxConstants.SHAPE_DOUBLE_ELLIPSE))
		{
			elem = document.createElement("g");
			background = document.createElement("ellipse");
			background.setAttribute("cx", String.valueOf(x + w / 2));
			background.setAttribute("cy", String.valueOf(y + h / 2));
			background.setAttribute("rx", String.valueOf(w / 2));
			background.setAttribute("ry", String.valueOf(h / 2));
			elem.appendChild(background);

			int inset = (int) ((3 + strokeWidth) * scale);

			Element foreground = document.createElement("ellipse");
			foreground.setAttribute("fill", "none");
			foreground.setAttribute("stroke", strokeColor);
			foreground
					.setAttribute("stroke-width", String.valueOf(strokeWidth));

			foreground.setAttribute("cx", String.valueOf(x + w / 2));
			foreground.setAttribute("cy", String.valueOf(y + h / 2));
			foreground.setAttribute("rx", String.valueOf(w / 2 - inset));
			foreground.setAttribute("ry", String.valueOf(h / 2 - inset));
			elem.appendChild(foreground);
		}
		else if (shape.equals(mxConstants.SHAPE_RHOMBUS))
		{
			elem = document.createElement("path");

			String d = "M " + (x + w / 2) + " " + y + " L " + (x + w) + " "
					+ (y + h / 2) + " L " + (x + w / 2) + " " + (y + h) + " L "
					+ x + " " + (y + h / 2);

			elem.setAttribute("d", d + " Z");
		}
		else if (shape.equals(mxConstants.SHAPE_TRIANGLE))
		{
			elem = document.createElement("path");
			String direction = mxUtils.getString(style,
					mxConstants.STYLE_DIRECTION, "");
			String d = null;

			if (direction.equals(mxConstants.DIRECTION_NORTH))
			{
				d = "M " + x + " " + (y + h) + " L " + (x + w / 2) + " " + y
						+ " L " + (x + w) + " " + (y + h);
			}
			else if (direction.equals(mxConstants.DIRECTION_SOUTH))
			{
				d = "M " + x + " " + y + " L " + (x + w / 2) + " " + (y + h)
						+ " L " + (x + w) + " " + y;
			}
			else if (direction.equals(mxConstants.DIRECTION_WEST))
			{
				d = "M " + (x + w) + " " + y + " L " + x + " " + (y + h / 2)
						+ " L " + (x + w) + " " + (y + h);
			}
			else
			// east
			{
				d = "M " + x + " " + y + " L " + (x + w) + " " + (y + h / 2)
						+ " L " + x + " " + (y + h);
			}

			elem.setAttribute("d", d + " Z");
		}
		else if (shape.equals(mxConstants.SHAPE_HEXAGON))
		{
			elem = document.createElement("path");
			String direction = mxUtils.getString(style,
					mxConstants.STYLE_DIRECTION, "");
			String d = null;

			if (direction.equals(mxConstants.DIRECTION_NORTH)
					|| direction.equals(mxConstants.DIRECTION_SOUTH))
			{
				d = "M " + (x + 0.5 * w) + " " + y + " L " + (x + w) + " "
						+ (y + 0.25 * h) + " L " + (x + w) + " "
						+ (y + 0.75 * h) + " L " + (x + 0.5 * w) + " "
						+ (y + h) + " L " + x + " " + (y + 0.75 * h) + " L "
						+ x + " " + (y + 0.25 * h);
			}
			else
			{
				d = "M " + (x + 0.25 * w) + " " + y + " L " + (x + 0.75 * w)
						+ " " + y + " L " + (x + w) + " " + (y + 0.5 * h)
						+ " L " + (x + 0.75 * w) + " " + (y + h) + " L "
						+ (x + 0.25 * w) + " " + (y + h) + " L " + x + " "
						+ (y + 0.5 * h);
			}

			elem.setAttribute("d", d + " Z");
		}
		else if (shape.equals(mxConstants.SHAPE_CLOUD))
		{
			elem = document.createElement("path");

			String d = "M " + (x + 0.25 * w) + " " + (y + 0.25 * h) + " C "
					+ (x + 0.05 * w) + " " + (y + 0.25 * h) + " " + x + " "
					+ (y + 0.5 * h) + " " + (x + 0.16 * w) + " "
					+ (y + 0.55 * h) + " C " + x + " " + (y + 0.66 * h) + " "
					+ (x + 0.18 * w) + " " + (y + 0.9 * h) + " "
					+ (x + 0.31 * w) + " " + (y + 0.8 * h) + " C "
					+ (x + 0.4 * w) + " " + (y + h) + " " + (x + 0.7 * w) + " "
					+ (y + h) + " " + (x + 0.8 * w) + " " + (y + 0.8 * h)
					+ " C " + (x + w) + " " + (y + 0.8 * h) + " " + (x + w)
					+ " " + (y + 0.6 * h) + " " + (x + 0.875 * w) + " "
					+ (y + 0.5 * h) + " C " + (x + w) + " " + (y + 0.3 * h)
					+ " " + (x + 0.8 * w) + " " + (y + 0.1 * h) + " "
					+ (x + 0.625 * w) + " " + (y + 0.2 * h) + " C "
					+ (x + 0.5 * w) + " " + (y + 0.05 * h) + " "
					+ (x + 0.3 * w) + " " + (y + 0.05 * h) + " "
					+ (x + 0.25 * w) + " " + (y + 0.25 * h);

			elem.setAttribute("d", d + " Z");
		}
		else if (shape.equals(mxConstants.SHAPE_ACTOR))
		{
			elem = document.createElement("path");
			double width3 = w / 3;

			String d = " M " + x + " " + (y + h) + " C " + x + " "
					+ (y + 3 * h / 5) + " " + x + " " + (y + 2 * h / 5) + " "
					+ (x + w / 2) + " " + (y + 2 * h / 5) + " C "
					+ (x + w / 2 - width3) + " " + (y + 2 * h / 5) + " "
					+ (x + w / 2 - width3) + " " + y + " " + (x + w / 2) + " "
					+ y + " C " + (x + w / 2 + width3) + " " + y + " "
					+ (x + w / 2 + width3) + " " + (y + 2 * h / 5) + " "
					+ (x + w / 2) + " " + (y + 2 * h / 5) + " C " + (x + w)
					+ " " + (y + 2 * h / 5) + " " + (x + w) + " "
					+ (y + 3 * h / 5) + " " + (x + w) + " " + (y + h);

			elem.setAttribute("d", d + " Z");
		}
		else if (shape.equals(mxConstants.SHAPE_CYLINDER))
		{
			elem = document.createElement("g");
			background = document.createElement("path");

			double dy = Math.min(40, Math.floor(h / 5));
			String d = " M " + x + " " + (y + dy) + " C " + x + " "
					+ (y - dy / 3) + " " + (x + w) + " " + (y - dy / 3) + " "
					+ (x + w) + " " + (y + dy) + " L " + (x + w) + " "
					+ (y + h - dy) + " C " + (x + w) + " " + (y + h + dy / 3)
					+ " " + x + " " + (y + h + dy / 3) + " " + x + " "
					+ (y + h - dy);
			background.setAttribute("d", d + " Z");
			elem.appendChild(background);

			Element foreground = document.createElement("path");
			d = "M " + x + " " + (y + dy) + " C " + x + " " + (y + 2 * dy)
					+ " " + (x + w) + " " + (y + 2 * dy) + " " + (x + w) + " "
					+ (y + dy);

			foreground.setAttribute("d", d);
			foreground.setAttribute("fill", "none");
			foreground.setAttribute("stroke", strokeColor);
			foreground
					.setAttribute("stroke-width", String.valueOf(strokeWidth));

			elem.appendChild(foreground);
		}
		else
		{
			background = document.createElement("rect");
			elem = background;

			elem.setAttribute("x", String.valueOf(x));
			elem.setAttribute("y", String.valueOf(y));
			elem.setAttribute("width", String.valueOf(w));
			elem.setAttribute("height", String.valueOf(h));

			if (mxUtils.isTrue(style, mxConstants.STYLE_ROUNDED, false))
			{
				String r = String.valueOf(Math.min(w
						* mxConstants.RECTANGLE_ROUNDING_FACTOR, h
						* mxConstants.RECTANGLE_ROUNDING_FACTOR));

				elem.setAttribute("rx", r);
				elem.setAttribute("ry", r);
			}

			// Paints the label image
			if (shape.equals(mxConstants.SHAPE_LABEL))
			{
				String img = getImageForStyle(style);

				if (img != null)
				{
					String imgAlign = mxUtils.getString(style,
							mxConstants.STYLE_IMAGE_ALIGN,
							mxConstants.ALIGN_LEFT);
					String imgValign = mxUtils.getString(style,
							mxConstants.STYLE_IMAGE_VERTICAL_ALIGN,
							mxConstants.ALIGN_MIDDLE);
					int imgWidth = (int) (mxUtils.getInt(style,
							mxConstants.STYLE_IMAGE_WIDTH,
							mxConstants.DEFAULT_IMAGESIZE) * scale);
					int imgHeight = (int) (mxUtils.getInt(style,
							mxConstants.STYLE_IMAGE_HEIGHT,
							mxConstants.DEFAULT_IMAGESIZE) * scale);
					int spacing = (int) (mxUtils.getInt(style,
							mxConstants.STYLE_SPACING, 2) * scale);

					mxRectangle imageBounds = new mxRectangle(x, y, w, h);

					if (imgAlign.equals(mxConstants.ALIGN_CENTER))
					{
						imageBounds.setX(imageBounds.getX()
								+ (imageBounds.getWidth() - imgWidth) / 2);
					}
					else if (imgAlign.equals(mxConstants.ALIGN_RIGHT))
					{
						imageBounds.setX(imageBounds.getX()
								+ imageBounds.getWidth() - imgWidth - spacing
								- 2);
					}
					else
					// LEFT
					{
						imageBounds.setX(imageBounds.getX() + spacing + 4);
					}

					if (imgValign.equals(mxConstants.ALIGN_TOP))
					{
						imageBounds.setY(imageBounds.getY() + spacing);
					}
					else if (imgValign.equals(mxConstants.ALIGN_BOTTOM))
					{
						imageBounds
								.setY(imageBounds.getY()
										+ imageBounds.getHeight() - imgHeight
										- spacing);
					}
					else
					// MIDDLE
					{
						imageBounds.setY(imageBounds.getY()
								+ (imageBounds.getHeight() - imgHeight) / 2);
					}

					imageBounds.setWidth(imgWidth);
					imageBounds.setHeight(imgHeight);

					elem = document.createElement("g");
					elem.appendChild(background);

					Element imageElement = createImageElement(
							imageBounds.getX(), imageBounds.getY(),
							imageBounds.getWidth(), imageBounds.getHeight(),
							img, false, false, false, isEmbedded());

					if (opacity != 100 || fillOpacity != 100)
					{
						String value = String.valueOf(opacity * fillOpacity / 10000);
						imageElement.setAttribute("opacity", value);
					}

					elem.appendChild(imageElement);
				}

				// Paints the glass effect
				if (mxUtils.isTrue(style, mxConstants.STYLE_GLASS, false))
				{
					double size = 0.4;

					// TODO: Mask with rectangle or rounded rectangle of label
					// Creates glass overlay
					Element glassOverlay = document.createElement("path");

					// LATER: Not sure what the behaviour is for mutiple SVG elements in page.
					// Probably its possible that this points to an element in another SVG
					// node which when removed will result in an undefined background.
					glassOverlay.setAttribute("fill", "url(#"
							+ getGlassGradientElement().getAttribute("id")
							+ ")");

					String d = "m " + (x - strokeWidth) + ","
							+ (y - strokeWidth) + " L " + (x - strokeWidth)
							+ "," + (y + h * size) + " Q " + (x + w * 0.5)
							+ "," + (y + h * 0.7) + " " + (x + w + strokeWidth)
							+ "," + (y + h * size) + " L "
							+ (x + w + strokeWidth) + "," + (y - strokeWidth)
							+ " z";
					glassOverlay.setAttribute("stroke-width",
							String.valueOf(strokeWidth / 2));
					glassOverlay.setAttribute("d", d);
					elem.appendChild(glassOverlay);
				}
			}
		}

		double rotation = mxUtils.getDouble(style, mxConstants.STYLE_ROTATION);
		int cx = x + w / 2;
		int cy = y + h / 2;

		Element bg = background;

		if (bg == null)
		{
			bg = elem;
		}

		if (!bg.getNodeName().equalsIgnoreCase("use")
				&& !bg.getNodeName().equalsIgnoreCase("image"))
		{
			if (!fillColor.equalsIgnoreCase("none")
					&& !gradientColor.equalsIgnoreCase("none"))
			{
				String direction = mxUtils.getString(style,
						mxConstants.STYLE_GRADIENT_DIRECTION);
				Element gradient = getGradientElement(fillColor, gradientColor,
						direction);

				if (gradient != null)
				{
					bg.setAttribute("fill",
							"url(#" + gradient.getAttribute("id") + ")");
				}
			}
			else
			{
				bg.setAttribute("fill", fillColor);
			}

			bg.setAttribute("stroke", strokeColor);
			bg.setAttribute("stroke-width", String.valueOf(strokeWidth));

			// Adds the shadow element
			Element shadowElement = null;

			if (mxUtils.isTrue(style, mxConstants.STYLE_SHADOW, false)
					&& !fillColor.equals("none"))
			{
				shadowElement = (Element) bg.cloneNode(true);

				shadowElement.setAttribute("transform",
						mxConstants.SVG_SHADOWTRANSFORM);
				shadowElement.setAttribute("fill", mxConstants.W3C_SHADOWCOLOR);
				shadowElement.setAttribute("stroke",
						mxConstants.W3C_SHADOWCOLOR);
				shadowElement.setAttribute("stroke-width",
						String.valueOf(strokeWidth));

				if (rotation != 0)
				{
					shadowElement.setAttribute("transform", "rotate("
							+ rotation + "," + cx + "," + cy + ") "
							+ mxConstants.SVG_SHADOWTRANSFORM);
				}

				if (opacity != 100)
				{
					String value = String.valueOf(opacity / 100);
					shadowElement.setAttribute("fill-opacity", value);
					shadowElement.setAttribute("stroke-opacity", value);
				}

				appendSvgElement(shadowElement);
			}
		}

		if (rotation != 0)
		{
			elem.setAttribute("transform", elem.getAttribute("transform")
					+ " rotate(" + rotation + "," + cx + "," + cy + ")");

		}

		if (opacity != 100 || fillOpacity != 100 || strokeOpacity != 100)
		{
			String fillValue = String.valueOf(opacity * fillOpacity / 10000);
			String strokeValue = String.valueOf(opacity * strokeOpacity / 10000);
			elem.setAttribute("fill-opacity", fillValue);
			elem.setAttribute("stroke-opacity", strokeValue);
		}

		if (mxUtils.isTrue(style, mxConstants.STYLE_DASHED))
		{
			String pattern = mxUtils.getString(style, mxConstants.STYLE_DASH_PATTERN, "3, 3");
			elem.setAttribute("stroke-dasharray", pattern);
		}

		appendSvgElement(elem);

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
		Element group = document.createElement("g");
		Element path = document.createElement("path");

		boolean rounded = mxUtils.isTrue(style, mxConstants.STYLE_ROUNDED,
				false);
		String strokeColor = mxUtils.getString(style,
				mxConstants.STYLE_STROKECOLOR);
		float tmpStroke = (mxUtils.getFloat(style,
				mxConstants.STYLE_STROKEWIDTH, 1));
		float strokeWidth = (float) (tmpStroke * scale);

		if (strokeColor != null && strokeWidth > 0)
		{
			// Draws the start marker
			Object marker = style.get(mxConstants.STYLE_STARTARROW);

			mxPoint pt = pts.get(1);
			mxPoint p0 = pts.get(0);
			mxPoint offset = null;

			if (marker != null)
			{
				float size = (mxUtils.getFloat(style,
						mxConstants.STYLE_STARTSIZE,
						mxConstants.DEFAULT_MARKERSIZE));
				offset = drawMarker(group, marker, pt, p0, size, tmpStroke,
						strokeColor);
			}
			else
			{
				double dx = pt.getX() - p0.getX();
				double dy = pt.getY() - p0.getY();

				double dist = Math.max(1, Math.sqrt(dx * dx + dy * dy));
				double nx = dx * strokeWidth / dist;
				double ny = dy * strokeWidth / dist;

				offset = new mxPoint(nx / 2, ny / 2);
			}

			// Applies offset to the point
			if (offset != null)
			{
				p0 = (mxPoint) p0.clone();
				p0.setX(p0.getX() + offset.getX());
				p0.setY(p0.getY() + offset.getY());

				offset = null;
			}

			// Draws the end marker
			marker = style.get(mxConstants.STYLE_ENDARROW);

			pt = pts.get(pts.size() - 2);
			mxPoint pe = pts.get(pts.size() - 1);

			if (marker != null)
			{
				float size = (mxUtils.getFloat(style,
						mxConstants.STYLE_ENDSIZE,
						mxConstants.DEFAULT_MARKERSIZE));
				offset = drawMarker(group, marker, pt, pe, size, tmpStroke,
						strokeColor);
			}
			else
			{
				double dx = pt.getX() - p0.getX();
				double dy = pt.getY() - p0.getY();

				double dist = Math.max(1, Math.sqrt(dx * dx + dy * dy));
				double nx = dx * strokeWidth / dist;
				double ny = dy * strokeWidth / dist;

				offset = new mxPoint(nx / 2, ny / 2);
			}

			// Applies offset to the point
			if (offset != null)
			{
				pe = (mxPoint) pe.clone();
				pe.setX(pe.getX() + offset.getX());
				pe.setY(pe.getY() + offset.getY());

				offset = null;
			}

			// Draws the line segments
			double arcSize = mxConstants.LINE_ARCSIZE * scale;
			pt = p0;
			String d = "M " + pt.getX() + " " + pt.getY();

			for (int i = 1; i < pts.size() - 1; i++)
			{
				mxPoint tmp = pts.get(i);
				double dx = pt.getX() - tmp.getX();
				double dy = pt.getY() - tmp.getY();

				if ((rounded && i < pts.size() - 1) && (dx != 0 || dy != 0))
				{
					// Draws a line from the last point to the current
					// point with a spacing of size off the current point
					// into direction of the last point
					double dist = Math.sqrt(dx * dx + dy * dy);
					double nx1 = dx * Math.min(arcSize, dist / 2) / dist;
					double ny1 = dy * Math.min(arcSize, dist / 2) / dist;

					double x1 = tmp.getX() + nx1;
					double y1 = tmp.getY() + ny1;
					d += " L " + x1 + " " + y1;

					// Draws a curve from the last point to the current
					// point with a spacing of size off the current point
					// into direction of the next point
					mxPoint next = pts.get(i + 1);
					dx = next.getX() - tmp.getX();
					dy = next.getY() - tmp.getY();

					dist = Math.max(1, Math.sqrt(dx * dx + dy * dy));
					double nx2 = dx * Math.min(arcSize, dist / 2) / dist;
					double ny2 = dy * Math.min(arcSize, dist / 2) / dist;

					double x2 = tmp.getX() + nx2;
					double y2 = tmp.getY() + ny2;

					d += " Q " + tmp.getX() + " " + tmp.getY() + " " + x2 + " "
							+ y2;
					tmp = new mxPoint(x2, y2);
				}
				else
				{
					d += " L " + tmp.getX() + " " + tmp.getY();
				}

				pt = tmp;
			}

			d += " L " + pe.getX() + " " + pe.getY();

			path.setAttribute("d", d);
			path.setAttribute("stroke", strokeColor);
			path.setAttribute("fill", "none");
			path.setAttribute("stroke-width", String.valueOf(strokeWidth));

			if (mxUtils.isTrue(style, mxConstants.STYLE_DASHED))
			{
				String pattern = mxUtils.getString(style, mxConstants.STYLE_DASH_PATTERN, "3, 3");
				path.setAttribute("stroke-dasharray", pattern);
			}

			group.appendChild(path);
			appendSvgElement(group);
		}

		return group;
	}

	/**
	 * Draws the specified marker as a child path in the given parent.
	 */
	public mxPoint drawMarker(Element parent, Object type, mxPoint p0,
			mxPoint pe, float size, float strokeWidth, String color)
	{
		mxPoint offset = null;

		// Computes the norm and the inverse norm
		double dx = pe.getX() - p0.getX();
		double dy = pe.getY() - p0.getY();

		double dist = Math.max(1, Math.sqrt(dx * dx + dy * dy));
		double absSize = size * scale;
		double nx = dx * absSize / dist;
		double ny = dy * absSize / dist;

		pe = (mxPoint) pe.clone();
		pe.setX(pe.getX() - nx * strokeWidth / (2 * size));
		pe.setY(pe.getY() - ny * strokeWidth / (2 * size));

		nx *= 0.5 + strokeWidth / 2;
		ny *= 0.5 + strokeWidth / 2;

		Element path = document.createElement("path");
		path.setAttribute("stroke-width", String.valueOf(strokeWidth * scale));
		path.setAttribute("stroke", color);
		path.setAttribute("fill", color);

		String d = null;

		if (type.equals(mxConstants.ARROW_CLASSIC)
				|| type.equals(mxConstants.ARROW_BLOCK))
		{
			d = "M "
					+ pe.getX()
					+ " "
					+ pe.getY()
					+ " L "
					+ (pe.getX() - nx - ny / 2)
					+ " "
					+ (pe.getY() - ny + nx / 2)
					+ ((!type.equals(mxConstants.ARROW_CLASSIC)) ? "" : " L "
							+ (pe.getX() - nx * 3 / 4) + " "
							+ (pe.getY() - ny * 3 / 4)) + " L "
					+ (pe.getX() + ny / 2 - nx) + " "
					+ (pe.getY() - ny - nx / 2) + " z";
		}
		else if (type.equals(mxConstants.ARROW_OPEN))
		{
			nx *= 1.2;
			ny *= 1.2;

			d = "M " + (pe.getX() - nx - ny / 2) + " "
					+ (pe.getY() - ny + nx / 2) + " L " + (pe.getX() - nx / 6)
					+ " " + (pe.getY() - ny / 6) + " L "
					+ (pe.getX() + ny / 2 - nx) + " "
					+ (pe.getY() - ny - nx / 2) + " M " + pe.getX() + " "
					+ pe.getY();
			path.setAttribute("fill", "none");
		}
		else if (type.equals(mxConstants.ARROW_OVAL))
		{
			nx *= 1.2;
			ny *= 1.2;
			absSize *= 1.2;

			d = "M " + (pe.getX() - ny / 2) + " " + (pe.getY() + nx / 2)
					+ " a " + (absSize / 2) + " " + (absSize / 2) + " 0  1,1 "
					+ (nx / 8) + " " + (ny / 8) + " z";
		}
		else if (type.equals(mxConstants.ARROW_DIAMOND))
		{
			d = "M " + (pe.getX() + nx / 2) + " " + (pe.getY() + ny / 2)
					+ " L " + (pe.getX() - ny / 2) + " " + (pe.getY() + nx / 2)
					+ " L " + (pe.getX() - nx / 2) + " " + (pe.getY() - ny / 2)
					+ " L " + (pe.getX() + ny / 2) + " " + (pe.getY() - nx / 2)
					+ " z";
		}

		if (d != null)
		{
			path.setAttribute("d", d);
			parent.appendChild(path);
		}

		return offset;
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
	public Object drawText(String text, int x, int y, int w, int h,
			Map<String, Object> style)
	{
		Element elem = null;
		String fontColor = mxUtils.getString(style,
				mxConstants.STYLE_FONTCOLOR, "black");
		String fontFamily = mxUtils.getString(style,
				mxConstants.STYLE_FONTFAMILY, mxConstants.DEFAULT_FONTFAMILIES);
		int fontSize = (int) (mxUtils.getInt(style, mxConstants.STYLE_FONTSIZE,
				mxConstants.DEFAULT_FONTSIZE) * scale);

		if (text != null && text.length() > 0)
		{
			float strokeWidth = (float) (mxUtils.getFloat(style,
					mxConstants.STYLE_STROKEWIDTH, 1) * scale);

			// Applies the opacity
			float opacity = mxUtils.getFloat(style,
					mxConstants.STYLE_TEXT_OPACITY, 100);

			// Draws the label background and border
			String bg = mxUtils.getString(style,
					mxConstants.STYLE_LABEL_BACKGROUNDCOLOR);
			String border = mxUtils.getString(style,
					mxConstants.STYLE_LABEL_BORDERCOLOR);

			String transform = null;

			if (!mxUtils.isTrue(style, mxConstants.STYLE_HORIZONTAL, true))
			{
				double cx = x + w / 2;
				double cy = y + h / 2;
				transform = "rotate(270 " + cx + " " + cy + ")";
			}

			if (bg != null || border != null)
			{
				Element background = document.createElement("rect");

				background.setAttribute("x", String.valueOf(x));
				background.setAttribute("y", String.valueOf(y));
				background.setAttribute("width", String.valueOf(w));
				background.setAttribute("height", String.valueOf(h));

				if (bg != null)
				{
					background.setAttribute("fill", bg);
				}
				else
				{
					background.setAttribute("fill", "none");
				}

				if (border != null)
				{
					background.setAttribute("stroke", border);
				}
				else
				{
					background.setAttribute("stroke", "none");
				}

				background.setAttribute("stroke-width",
						String.valueOf(strokeWidth));

				if (opacity != 100)
				{
					String value = String.valueOf(opacity / 100);
					background.setAttribute("fill-opacity", value);
					background.setAttribute("stroke-opacity", value);
				}

				if (transform != null)
				{
					background.setAttribute("transform", transform);
				}

				appendSvgElement(background);
			}

			elem = document.createElement("text");

			int fontStyle = mxUtils.getInt(style, mxConstants.STYLE_FONTSTYLE);
			String weight = ((fontStyle & mxConstants.FONT_BOLD) == mxConstants.FONT_BOLD) ? "bold"
					: "normal";
			elem.setAttribute("font-weight", weight);
			
			String txtDecor = "";
			
			if ((fontStyle & mxConstants.FONT_UNDERLINE) == mxConstants.FONT_UNDERLINE)
		    {
				txtDecor = "underline";
		    }
		    
		    if ((fontStyle & mxConstants.FONT_STRIKETHROUGH) == mxConstants.FONT_STRIKETHROUGH)
		    {
		    	txtDecor += " line-through";
		    }

	    	elem.setAttribute("font-decoration", txtDecor.length() > 0 ? txtDecor : "none");

			if ((fontStyle & mxConstants.FONT_ITALIC) == mxConstants.FONT_ITALIC)
			{
				elem.setAttribute("font-style", "italic");
			}

			elem.setAttribute("font-size", String.valueOf(fontSize));
			elem.setAttribute("font-family", fontFamily);
			elem.setAttribute("fill", fontColor);

			if (opacity != 100)
			{
				String value = String.valueOf(opacity / 100);
				elem.setAttribute("fill-opacity", value);
				elem.setAttribute("stroke-opacity", value);
			}

			int swingFontStyle = ((fontStyle & mxConstants.FONT_BOLD) == mxConstants.FONT_BOLD) ? Font.BOLD
					: Font.PLAIN;
			swingFontStyle += ((fontStyle & mxConstants.FONT_ITALIC) == mxConstants.FONT_ITALIC) ? Font.ITALIC
					: Font.PLAIN;

			String[] lines = text.split("\n");
			y += fontSize
					+ (h - lines.length * (fontSize + mxConstants.LINESPACING))
					/ 2 - 2;

			String align = mxUtils.getString(style, mxConstants.STYLE_ALIGN,
					mxConstants.ALIGN_CENTER);
			String anchor = "start";

			if (align.equals(mxConstants.ALIGN_RIGHT))
			{
				anchor = "end";
				x += w - mxConstants.LABEL_INSET * scale;
			}
			else if (align.equals(mxConstants.ALIGN_CENTER))
			{
				anchor = "middle";
				x += w / 2;
			}
			else
			{
				x += mxConstants.LABEL_INSET * scale;
			}

			elem.setAttribute("text-anchor", anchor);

			for (int i = 0; i < lines.length; i++)
			{
				Element tspan = document.createElement("tspan");

				tspan.setAttribute("x", String.valueOf(x));
				tspan.setAttribute("y", String.valueOf(y));

				tspan.appendChild(document.createTextNode(lines[i]));
				elem.appendChild(tspan);

				y += fontSize + mxConstants.LINESPACING;
			}

			if (transform != null)
			{
				elem.setAttribute("transform", transform);
			}

			appendSvgElement(elem);
		}

		return elem;
	}

}
