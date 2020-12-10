/**
 * Copyright (c) 2010-2012, JGraph Ltd
 */
package com.mxgraph.shape;

import java.util.Map;
import java.util.logging.Level;
import java.util.logging.Logger;

import org.w3c.dom.Element;
import org.w3c.dom.Node;

import com.mxgraph.canvas.mxGraphics2DCanvas;
import com.mxgraph.canvas.mxGraphicsCanvas2D;
import com.mxgraph.util.mxConstants;
import com.mxgraph.util.mxPoint;
import com.mxgraph.util.mxRectangle;
import com.mxgraph.util.mxUtils;
import com.mxgraph.view.mxCellState;

/**
 * Implements a stencil for the given XML definition. This class implements the mxGraph
 * stencil schema.
 */
public class mxStencil implements mxIShape
{

	private static final Logger log = Logger.getLogger(mxStencil.class.getName());

	/**
	 * Holds the top-level node of the stencil definition.
	 */
	protected Element desc;

	/**
	 * Holds the aspect of the shape. Default is "auto".
	 */
	protected String aspect = null;

	/**
	 * Holds the width of the shape. Default is 100.
	 */
	protected double w0 = 100;

	/**
	 * Holds the height of the shape. Default is 100.
	 */
	protected double h0 = 100;

	/**
	 * Holds the XML node with the stencil description.
	 */
	protected Element bgNode = null;

	/**
	 * Holds the XML node with the stencil description.
	 */
	protected Element fgNode = null;

	/**
	 * Holds the strokewidth direction from the description.
	 */
	protected String strokewidth = null;

	/**
	 * Holds the last x-position of the cursor.
	 */
	protected double lastMoveX = 0;

	/**
	 * Holds the last y-position of the cursor.
	 */
	protected double lastMoveY = 0;

	/**
	 * Constructs a new stencil for the given mxGraph shape description.
	 */
	public mxStencil(Element description)
	{
		setDescription(description);
	}
	
	/**
	 * Returns the description.
	 */
	public Element getDescription()
	{
		return desc;
	}
	
	/**
	 * Sets the description.
	 */
	public void setDescription(Element value)
	{
		desc = value;
		parseDescription();
	}

	/**
	 * Creates the canvas for rendering the stencil.
	 */
	protected mxGraphicsCanvas2D createCanvas(mxGraphics2DCanvas gc)
	{
		return new mxGraphicsCanvas2D(gc.getGraphics());
	}
	
	/**
	 * Paints the stencil for the given state.
	 */
	public void paintShape(mxGraphics2DCanvas gc, mxCellState state)
	{
		Map<String, Object> style = state.getStyle();
		mxGraphicsCanvas2D canvas = createCanvas(gc);

		double rotation = mxUtils.getDouble(style, mxConstants.STYLE_ROTATION,
				0);
		String direction = mxUtils.getString(style,
				mxConstants.STYLE_DIRECTION, null);

		// Default direction is east (ignored if rotation exists)
		if (direction != null)
		{
			if (direction.equals("north"))
			{
				rotation += 270;
			}
			else if (direction.equals("west"))
			{
				rotation += 180;
			}
			else if (direction.equals("south"))
			{
				rotation += 90;
			}
		}

		// New styles for shape flipping the stencil
		boolean flipH = mxUtils.isTrue(style, mxConstants.STYLE_STENCIL_FLIPH,
				false);
		boolean flipV = mxUtils.isTrue(style, mxConstants.STYLE_STENCIL_FLIPV,
				false);

		if (flipH && flipV)
		{
			rotation += 180;
			flipH = false;
			flipV = false;
		}

		// Saves the global state for each cell
		canvas.save();

		// Adds rotation and horizontal/vertical flipping
		rotation = rotation % 360;

		if (rotation != 0 || flipH || flipV)
		{
			canvas.rotate(rotation, flipH, flipV, state.getCenterX(),
					state.getCenterY());
		}

		// Note: Overwritten in mxStencil.paintShape (can depend on aspect)
		mxRectangle aspect = computeAspect(state, state, direction);
		double minScale = Math.min(aspect.getWidth(), aspect.getHeight());
		double sw = strokewidth.equals("inherit") ? mxUtils.getDouble(
				state.getStyle(), mxConstants.STYLE_STROKEWIDTH, 1)
				* state.getView().getScale() : Double
				.parseDouble(strokewidth) * minScale;
		canvas.setStrokeWidth(sw);

		double alpha = mxUtils.getDouble(style, mxConstants.STYLE_OPACITY, 100) / 100;
		String gradientColor = mxUtils.getString(style,
				mxConstants.STYLE_GRADIENTCOLOR, null);

		// Converts colors with special keyword none to null
		if (gradientColor != null && gradientColor.equals(mxConstants.NONE))
		{
			gradientColor = null;
		}

		String fillColor = mxUtils.getString(style,
				mxConstants.STYLE_FILLCOLOR, null);

		if (fillColor != null && fillColor.equals(mxConstants.NONE))
		{
			fillColor = null;
		}

		String strokeColor = mxUtils.getString(style,
				mxConstants.STYLE_STROKECOLOR, null);

		if (strokeColor != null && strokeColor.equals(mxConstants.NONE))
		{
			strokeColor = null;
		}

		// Draws the shadow if the fillColor is not transparent
		if (mxUtils.isTrue(style, mxConstants.STYLE_SHADOW, false))
		{
			drawShadow(canvas, state, rotation, flipH, flipV, state, alpha, fillColor != null, aspect);
		}

		canvas.setAlpha(alpha);

		// Sets the dashed state
		if (mxUtils.isTrue(style, mxConstants.STYLE_DASHED, false))
		{
			canvas.setDashed(true);
		}

		// Draws background and foreground
		if (strokeColor != null || fillColor != null)
		{
			if (strokeColor != null)
			{
				canvas.setStrokeColor(strokeColor);
			}

			if (fillColor != null)
			{
				if (gradientColor != null
						&& !gradientColor.equals("transparent"))
				{
					canvas.setGradient(fillColor, gradientColor, state.getX(),
							state.getY(), state.getWidth(), state.getHeight(),
							direction, 1, 1);
				}
				else
				{
					canvas.setFillColor(fillColor);
				}
			}

			// Draws background and foreground of shape
			drawShape(canvas, state, state, aspect, true);
			drawShape(canvas, state, state, aspect, false);
		}
	}
	
	/**
	 * Draws the shadow.
	 */
	protected void drawShadow(mxGraphicsCanvas2D canvas, mxCellState state, double rotation, boolean flipH,
			boolean flipV, mxRectangle bounds, double alpha, boolean filled, mxRectangle aspect)
	{
		// Requires background in generic shape for shadow, looks like only one
		// fillAndStroke is allowed per current path, try working around that
		// Computes rotated shadow offset
		double rad = rotation * Math.PI / 180;
		double cos = Math.cos(-rad);
		double sin = Math.sin(-rad);
		mxPoint offset = mxUtils.getRotatedPoint(new mxPoint(mxConstants.SHADOW_OFFSETX, mxConstants.SHADOW_OFFSETY), cos, sin);
		
		if (flipH)
		{
			offset.setX(offset.getX() * -1);
		}
		
		if (flipV)
		{
			offset.setY(offset.getY() * -1);
		}
		
		// TODO: Use save/restore instead of negative offset to restore (requires fix for HTML canvas)
		canvas.translate(offset.getX(), offset.getY());
		
		// Returns true if a shadow has been painted (path has been created)
		if (drawShape(canvas, state, bounds, aspect, true))
		{
			canvas.setAlpha(mxConstants.STENCIL_SHADOW_OPACITY * alpha);
			// TODO: Implement new shadow
			//canvas.shadow(mxConstants.STENCIL_SHADOWCOLOR, filled);
		}

		canvas.translate(-offset.getX(), -offset.getY());
	}
			
	/**
	 * Draws this stencil inside the given bounds.
	 */
	public boolean drawShape(mxGraphicsCanvas2D canvas, mxCellState state,
			mxRectangle bounds, mxRectangle aspect, boolean background)
	{
		Element elt = (background) ? bgNode : fgNode;

		if (elt != null)
		{
			lastMoveX = 0;
			lastMoveY = 0;

			Node tmp = elt.getFirstChild();

			while (tmp != null)
			{
				if (tmp.getNodeType() == Node.ELEMENT_NODE)
				{
					drawElement(canvas, state, (Element) tmp, aspect);
				}

				tmp = tmp.getNextSibling();
			}

			return true;
		}

		return false;
	}

	/**
	 * Returns a rectangle that contains the offset in x and y and the horizontal
	 * and vertical scale in width and height used to draw this shape inside the
	 * given rectangle.
	 */
	protected mxRectangle computeAspect(mxCellState state, mxRectangle bounds,
			String direction)
	{
		double x0 = bounds.getX();
		double y0 = bounds.getY();
		double sx = bounds.getWidth() / w0;
		double sy = bounds.getHeight() / h0;

		boolean inverse = (direction != null && (direction.equals("north") || direction
				.equals("south")));

		if (inverse)
		{
			sy = bounds.getWidth() / h0;
			sx = bounds.getHeight() / w0;

			double delta = (bounds.getWidth() - bounds.getHeight()) / 2;

			x0 += delta;
			y0 -= delta;
		}

		if (aspect.equals("fixed"))
		{
			sy = Math.min(sx, sy);
			sx = sy;

			// Centers the shape inside the available space
			if (inverse)
			{
				x0 += (bounds.getHeight() - this.w0 * sx) / 2;
				y0 += (bounds.getWidth() - this.h0 * sy) / 2;
			}
			else
			{
				x0 += (bounds.getWidth() - this.w0 * sx) / 2;
				y0 += (bounds.getHeight() - this.h0 * sy) / 2;
			}
		}

		return new mxRectangle(x0, y0, sx, sy);
	}

	/**
	 * Drawsthe given element.
	 */
	protected void drawElement(mxGraphicsCanvas2D canvas, mxCellState state,
			Element node, mxRectangle aspect)
	{
		String name = node.getNodeName();
		double x0 = aspect.getX();
		double y0 = aspect.getY();
		double sx = aspect.getWidth();
		double sy = aspect.getHeight();
		double minScale = Math.min(sx, sy);

		// LATER: Move to lookup table
		if (name.equals("save"))
		{
			canvas.save();
		}
		else if (name.equals("restore"))
		{
			canvas.restore();
		}
		else if (name.equals("path"))
		{
			canvas.begin();

			// Renders the elements inside the given path
			Node childNode = node.getFirstChild();

			while (childNode != null)
			{
				if (childNode.getNodeType() == Node.ELEMENT_NODE)
				{
					drawElement(canvas, state, (Element) childNode, aspect);
				}

				childNode = childNode.getNextSibling();
			}
		}
		else if (name.equals("close"))
		{
			canvas.close();
		}
		else if (name.equals("move"))
		{
			lastMoveX = x0 + getDouble(node, "x") * sx;
			lastMoveY = y0 + getDouble(node, "y") * sy;
			canvas.moveTo(lastMoveX, lastMoveY);
		}
		else if (name.equals("line"))
		{
			lastMoveX = x0 + getDouble(node, "x") * sx;
			lastMoveY = y0 + getDouble(node, "y") * sy;
			canvas.lineTo(lastMoveX, lastMoveY);
		}
		else if (name.equals("quad"))
		{
			lastMoveX = x0 + getDouble(node, "x2") * sx;
			lastMoveY = y0 + getDouble(node, "y2") * sy;
			canvas.quadTo(x0 + getDouble(node, "x1") * sx,
					y0 + getDouble(node, "y1") * sy, lastMoveX, lastMoveY);
		}
		else if (name.equals("curve"))
		{
			lastMoveX = x0 + getDouble(node, "x3") * sx;
			lastMoveY = y0 + getDouble(node, "y3") * sy;
			canvas.curveTo(x0 + getDouble(node, "x1") * sx,
					y0 + getDouble(node, "y1") * sy, x0 + getDouble(node, "x2")
							* sx, y0 + getDouble(node, "y2") * sy, lastMoveX,
					lastMoveY);
		}
		else if (name.equals("arc"))
		{
			// Arc from stencil is turned into curves in image output
			double r1 = getDouble(node, "rx") * sx;
			double r2 = getDouble(node, "ry") * sy;
			double angle = getDouble(node, "x-axis-rotation");
			double largeArcFlag = getDouble(node, "large-arc-flag");
			double sweepFlag = getDouble(node, "sweep-flag");
			double x = x0 + getDouble(node, "x") * sx;
			double y = y0 + getDouble(node, "y") * sy;

			double[] curves = mxUtils.arcToCurves(this.lastMoveX,
					this.lastMoveY, r1, r2, angle, largeArcFlag, sweepFlag, x,
					y);

			for (int i = 0; i < curves.length; i += 6)
			{
				canvas.curveTo(curves[i], curves[i + 1], curves[i + 2],
						curves[i + 3], curves[i + 4], curves[i + 5]);

				lastMoveX = curves[i + 4];
				lastMoveY = curves[i + 5];
			}
		}
		else if (name.equals("rect"))
		{
			canvas.rect(x0 + getDouble(node, "x") * sx,
					y0 + getDouble(node, "y") * sy, getDouble(node, "w") * sx,
					getDouble(node, "h") * sy);
		}
		else if (name.equals("roundrect"))
		{
			double arcsize = getDouble(node, "arcsize");

			if (arcsize == 0)
			{
				arcsize = mxConstants.RECTANGLE_ROUNDING_FACTOR * 100;
			}

			double w = getDouble(node, "w") * sx;
			double h = getDouble(node, "h") * sy;
			double factor = arcsize / 100;
			double r = Math.min(w * factor, h * factor);

			canvas.roundrect(x0 + getDouble(node, "x") * sx,
					y0 + getDouble(node, "y") * sy, getDouble(node, "w") * sx,
					getDouble(node, "h") * sy, r, r);
		}
		else if (name.equals("ellipse"))
		{
			canvas.ellipse(x0 + getDouble(node, "x") * sx,
					y0 + getDouble(node, "y") * sy, getDouble(node, "w") * sx,
					getDouble(node, "h") * sy);
		}
		else if (name.equals("image"))
		{
			String src = evaluateAttribute(node, "src", state);

			canvas.image(x0 + getDouble(node, "x") * sx,
					y0 + getDouble(node, "y") * sy, getDouble(node, "w") * sx,
					getDouble(node, "h") * sy, src, false,
					getString(node, "flipH", "0").equals("1"),
					getString(node, "flipV", "0").equals("1"));
		}
		else if (name.equals("text"))
		{
			String str = evaluateAttribute(node, "str", state);
			double rotation = getString(node, "vertical", "0").equals("1") ? -90 : 0;
			
			canvas.text(x0 + getDouble(node, "x") * sx,
					y0 + getDouble(node, "y") * sy, 0, 0, str,
					node.getAttribute("align"), node.getAttribute("valign"),
					false, "", null, false, rotation, null);
		}
		else if (name.equals("include-shape"))
		{
			mxStencil stencil = mxStencilRegistry.getStencil(node
					.getAttribute("name"));

			if (stencil != null)
			{
				double x = x0 + getDouble(node, "x") * sx;
				double y = y0 + getDouble(node, "y") * sy;
				double w = getDouble(node, "w") * sx;
				double h = getDouble(node, "h") * sy;

				mxRectangle tmp = new mxRectangle(x, y, w, h);
				stencil.drawShape(canvas, state, tmp, aspect, true);
				stencil.drawShape(canvas, state, tmp, aspect, false);
			}
		}
		else if (name.equals("fillstroke"))
		{
			canvas.fillAndStroke();
		}
		else if (name.equals("fill"))
		{
			canvas.fill();
		}
		else if (name.equals("stroke"))
		{
			canvas.stroke();
		}
		else if (name.equals("strokewidth"))
		{
			double s = (getInt(node, "fixed", 0) == 1) ? 1 : minScale;
			canvas.setStrokeWidth(getDouble(node, "width") * s);
		}
		else if (name.equals("dashed"))
		{
			String dashed = node.getAttribute("dashed");
			
			if (dashed != null)
			{
				canvas.setDashed(dashed.equals("1"));
			}
		}
		else if (name.equals("dashpattern"))
		{
			String value = node.getAttribute("pattern");

			if (value != null)
			{
				String[] tmp = value.split(" ");
				StringBuffer pat = new StringBuffer();

				for (int i = 0; i < tmp.length; i++)
				{
					if (tmp[i].length() > 0)
					{
						pat.append(Double.parseDouble(tmp[i]) * minScale);
						pat.append(" ");
					}
				}

				value = pat.toString();
			}

			canvas.setDashPattern(value);
		}
		else if (name.equals("strokecolor"))
		{
			canvas.setStrokeColor(node.getAttribute("color"));
		}
		else if (name.equals("linecap"))
		{
			canvas.setLineCap(node.getAttribute("cap"));
		}
		else if (name.equals("linejoin"))
		{
			canvas.setLineJoin(node.getAttribute("join"));
		}
		else if (name.equals("miterlimit"))
		{
			canvas.setMiterLimit(getDouble(node, "limit"));
		}
		else if (name.equals("fillcolor"))
		{
			canvas.setFillColor(node.getAttribute("color"));
		}
		else if (name.equals("fontcolor"))
		{
			canvas.setFontColor(node.getAttribute("color"));
		}
		else if (name.equals("fontstyle"))
		{
			canvas.setFontStyle(getInt(node, "style", 0));
		}
		else if (name.equals("fontfamily"))
		{
			canvas.setFontFamily(node.getAttribute("family"));
		}
		else if (name.equals("fontsize"))
		{
			canvas.setFontSize(getDouble(node, "size") * minScale);
		}
	}

	/**
	 * Returns the given attribute or the default value.
	 */
	protected int getInt(Element elt, String attribute, int defaultValue)
	{
		String value = elt.getAttribute(attribute);

		if (value != null && value.length() > 0)
		{
			try
			{
				defaultValue = (int) Math.floor(Float.parseFloat(value));
			}
			catch (NumberFormatException e)
			{
				log.log(Level.SEVERE, "Invalid value for attribute " + attribute + " in " + elt.getTagName(), e);
			}
		}

		return defaultValue;
	}

	/**
	 * Returns the given attribute or 0.
	 */
	protected double getDouble(Element elt, String attribute)
	{
		return getDouble(elt, attribute, 0);
	}

	/**
	 * Returns the given attribute or the default value.
	 */
	protected double getDouble(Element elt, String attribute,
			double defaultValue)
	{
		String value = elt.getAttribute(attribute);

		if (value != null && value.length() > 0)
		{
			try
			{
				defaultValue = Double.parseDouble(value);
			}
			catch (NumberFormatException e)
			{
				log.log(Level.SEVERE, "Invalid value for attribute " + attribute + " in " + elt.getTagName(), e);
			}
		}

		return defaultValue;
	}

	/**
	 * Returns the given attribute or the default value.
	 */
	protected String getString(Element elt, String attribute,
			String defaultValue)
	{
		String value = elt.getAttribute(attribute);

		if (value != null && value.length() > 0)
		{
			defaultValue = value;
		}

		return defaultValue;
	}

	/**
	 * Parses the description of this shape.
	 */
	protected void parseDescription()
	{
		// LATER: Preprocess nodes for faster painting
		fgNode = (Element) desc.getElementsByTagName("foreground").item(0);
		bgNode = (Element) desc.getElementsByTagName("background").item(0);
		w0 = getDouble(desc, "w", w0);
		h0 = getDouble(desc, "h", h0);

		// Possible values for aspect are: variable and fixed where
		// variable means fill the available space and fixed means
		// use w0 and h0 to compute the aspect.
		aspect = getString(desc, "aspect", "variable");

		// Possible values for strokewidth are all numbers and "inherit"
		// where the inherit means take the value from the style (ie. the
		// user-defined stroke-width). Note that the strokewidth is scaled
		// by the minimum scaling that is used to draw the shape (sx, sy).
		strokewidth = getString(desc, "strokewidth", "1");
	}

	/**
	 * Gets the attribute for the given name from the given node. If the attribute
	 * does not exist then the text content of the node is evaluated and if it is
	 * a function it is invoked with <state> as the only argument and the return
	 * value is used as the attribute value to be returned.
	 */
	public String evaluateAttribute(Element elt, String attribute,
			mxCellState state)
	{
		String result = elt.getAttribute(attribute);

		if (result == null)
		{
			// JS functions as text content are currently not supported in Java
		}

		return result;
	}

}
