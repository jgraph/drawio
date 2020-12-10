package com.mxgraph.canvas;

import java.awt.AlphaComposite;
import java.awt.BasicStroke;
import java.awt.Color;
import java.awt.Composite;
import java.awt.Dimension;
import java.awt.Font;
import java.awt.FontMetrics;
import java.awt.GradientPaint;
import java.awt.Graphics2D;
import java.awt.Image;
import java.awt.Paint;
import java.awt.Rectangle;
import java.awt.Stroke;
import java.awt.font.TextAttribute;
import java.awt.geom.AffineTransform;
import java.awt.geom.Ellipse2D;
import java.awt.geom.GeneralPath;
import java.awt.geom.Point2D;
import java.awt.geom.Rectangle2D;
import java.text.AttributedString;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Stack;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.swing.CellRendererPane;
import javax.swing.JLabel;

import com.mxgraph.util.mxConstants;
import com.mxgraph.util.mxLightweightLabel;
import com.mxgraph.util.mxUtils;

/**
 * Used for exporting images. To render to an image from a given XML string,
 * graph size and background color, the following code is used:
 * 
 * <code>
 * BufferedImage image = mxUtils.createBufferedImage(width, height, background);
 * Graphics2D g2 = image.createGraphics();
 * mxUtils.setAntiAlias(g2, true, true);
 * XMLReader reader = SAXParserFactory.newInstance().newSAXParser().getXMLReader();
 * reader.setContentHandler(new mxSaxOutputHandler(new mxGraphicsCanvas2D(g2)));
 * reader.parse(new InputSource(new StringReader(xml)));
 * </code>
 * 
 * Text rendering is available for plain text and HTML markup, the latter with optional
 * word wrapping. CSS support is limited to the following:
 * http://docs.oracle.com/javase/6/docs/api/index.html?javax/swing/text/html/CSS.html
 */
public class mxGraphicsCanvas2D implements mxICanvas2D
{

	private static final Logger log = Logger.getLogger(mxGraphicsCanvas2D.class.getName());

	/**
	 * Specifies the image scaling quality. Default is Image.SCALE_SMOOTH.
	 * See {@link #scaleImage(Image, int, int)}
	 */
	public static int IMAGE_SCALING = Image.SCALE_SMOOTH;

	/**
	 * Specifies the additional pixels when computing the text width for HTML labels.
	 * Default is 5.
	 */
	public static int JAVA_TEXT_WIDTH_DELTA = 6;

	/**
	 * Scale for rendering HTML output. Default is 1.
	 */
	public static double HTML_SCALE = 1;

	/**
	 * Unit to be used for HTML labels. Default is "pt". If you units within
	 * HTML labels are used, this should match those units to produce a
	 * consistent output. If the value is "px", then HTML_SCALE should be
	 * changed the match the ratio between px units for rendering HTML and
	 * the units used for rendering other graphics elements. This value is
	 * 0.6 on Linux and 0.75 on all other platforms.
	 */
	public static String HTML_UNIT = "pt";

	/**
	 * Specifies the size of the cache used to store parsed colors
	 */
	public static int COLOR_CACHE_SIZE = 100;

	/**
	 * Reference to the graphics instance for painting.
	 */
	protected Graphics2D graphics;

	/**
	 * Specifies if text output should be rendered. Default is true.
	 */
	protected boolean textEnabled = true;

	/**
	 * Represents the current state of the canvas.
	 */
	protected transient CanvasState state = new CanvasState();

	/**
	 * Stack of states for save/restore.
	 */
	protected transient Stack<CanvasState> stack = new Stack<CanvasState>();

	/**
	 * Holds the current path.
	 */
	protected transient GeneralPath currentPath;

	/**
	 * Optional renderer pane to be used for HTML label rendering.
	 */
	protected CellRendererPane rendererPane;

	/**
	 * Font caching.
	 */
	protected transient Font lastFont = null;

	/**
	 * Font caching.
	 */
	protected transient int lastFontStyle = 0;

	/**
	 * Font caching.
	 */
	protected transient int lastFontSize = 0;

	/**
	 * Font caching.
	 */
	protected transient String lastFontFamily = "";

	/**
	 * Stroke caching.
	 */
	protected transient Stroke lastStroke = null;

	/**
	 * Stroke caching.
	 */
	protected transient float lastStrokeWidth = 0;

	/**
	 * Stroke caching.
	 */
	protected transient int lastCap = 0;

	/**
	 * Stroke caching.
	 */
	protected transient int lastJoin = 0;

	/**
	 * Stroke caching.
	 */
	protected transient float lastMiterLimit = 0;

	/**
	 * Stroke caching.
	 */
	protected transient boolean lastDashed = false;

	/**
	 * Stroke caching.
	 */
	protected transient Object lastDashPattern = "";

	/**
	 * Caches parsed colors.
	 */
	@SuppressWarnings("serial")
	protected transient LinkedHashMap<String, Color> colorCache = new LinkedHashMap<String, Color>()
	{
		@Override
		protected boolean removeEldestEntry(Map.Entry<String, Color> eldest)
		{
			return size() > COLOR_CACHE_SIZE;
		}
	};

	/**
	 * Constructs a new graphics export canvas.
	 */
	public mxGraphicsCanvas2D(Graphics2D g)
	{
		setGraphics(g);
		state.g = g;

		// Initializes the cell renderer pane for drawing HTML markup
		try
		{
			rendererPane = new CellRendererPane();
		}
		catch (Exception e)
		{
			log.log(Level.WARNING, "Failed to initialize renderer pane", e);
		}
	}

	/**
	 * Sets the graphics instance.
	 */
	public void setGraphics(Graphics2D value)
	{
		graphics = value;
	}

	/**
	 * Returns the graphics instance.
	 */
	public Graphics2D getGraphics()
	{
		return graphics;
	}

	/**
	 * Returns true if text should be rendered.
	 */
	public boolean isTextEnabled()
	{
		return textEnabled;
	}

	/**
	 * Disables or enables text rendering.
	 */
	public void setTextEnabled(boolean value)
	{
		textEnabled = value;
	}

	/**
	 * Saves the current canvas state.
	 */
	public void save()
	{
		stack.push(state);
		state = cloneState(state);
		state.g = (Graphics2D) state.g.create();
	}

	/**
	 * Restores the last canvas state.
	 */
	public void restore()
	{
		state.g.dispose();
		state = stack.pop();
	}

	/**
	 * Returns a clone of the given state.
	 */
	protected CanvasState cloneState(CanvasState state)
	{
		try
		{
			return (CanvasState) state.clone();
		}
		catch (CloneNotSupportedException e)
		{
			log.log(Level.SEVERE, "Failed to clone the state", e);
		}

		return null;
	}

	/**
	 * 
	 */
	public void scale(double value)
	{
		// This implementation uses custom scale/translate and built-in rotation
		state.scale = state.scale * value;
	}

	/**
	 * 
	 */
	public void translate(double dx, double dy)
	{
		// This implementation uses custom scale/translate and built-in rotation
		state.dx += dx;
		state.dy += dy;
	}

	/**
	 * 
	 */
	public void rotate(double theta, boolean flipH, boolean flipV, double cx,
			double cy)
	{
		cx += state.dx;
		cy += state.dy;
		cx *= state.scale;
		cy *= state.scale;
		state.g.rotate(Math.toRadians(theta), cx, cy);

		// This implementation uses custom scale/translate and built-in rotation
		// Rotation state is part of the AffineTransform in state.transform
		if (flipH && flipV)
		{
			theta += 180;
		}
		else if (flipH ^ flipV)
		{
			double tx = (flipH) ? cx : 0;
			int sx = (flipH) ? -1 : 1;

			double ty = (flipV) ? cy : 0;
			int sy = (flipV) ? -1 : 1;

			state.g.translate(tx, ty);
			state.g.scale(sx, sy);
			state.g.translate(-tx, -ty);
		}

		state.theta = theta;
		state.rotationCx = cx;
		state.rotationCy = cy;
		state.flipH = flipH;
		state.flipV = flipV;
	}

	/**
	 * 
	 */
	public void setStrokeWidth(double value)
	{
		// Lazy and cached instantiation strategy for all stroke properties
		if (value != state.strokeWidth)
		{
			state.strokeWidth = value;
		}
	}

	/**
	 * Caches color conversion as it is expensive.
	 */
	public void setStrokeColor(String value)
	{
		// Lazy and cached instantiation strategy for all stroke properties
		if (state.strokeColorValue == null
				|| !state.strokeColorValue.equals(value))
		{
			state.strokeColorValue = value;
			state.strokeColor = null;
		}
	}

	/**
	 * 
	 */
	public void setDashed(boolean value)
	{
		this.setDashed(value, state.fixDash);
	}

	/**
	 * 
	 */
	public void setDashed(boolean value, boolean fixDash)
	{
		// Lazy and cached instantiation strategy for all stroke properties
		state.dashed = value;
		state.fixDash = fixDash;
	}

	/**
	 * 
	 */
	public void setDashPattern(String value)
	{
		if (value != null && value.length() > 0)
		{
			state.dashPattern = mxUtils.parseDashPattern(value);
		}
	}

	/**
	 * 
	 */
	public void setLineCap(String value)
	{
		if (!state.lineCap.equals(value))
		{
			state.lineCap = value;
		}
	}

	/**
	 * 
	 */
	public void setLineJoin(String value)
	{
		if (!state.lineJoin.equals(value))
		{
			state.lineJoin = value;
		}
	}

	/**
	 * 
	 */
	public void setMiterLimit(double value)
	{
		if (value != state.miterLimit)
		{
			state.miterLimit = value;
		}
	}

	/**
	 * 
	 */
	public void setFontSize(double value)
	{
		if (value != state.fontSize)
		{
			state.fontSize = value;
		}
	}

	/**
	 * 
	 */
	public void setFontColor(String value)
	{
		if (state.fontColorValue == null || !state.fontColorValue.equals(value))
		{
			state.fontColorValue = value;
			state.fontColor = null;
		}
	}

	/**
	 * 
	 */
	public void setFontBackgroundColor(String value)
	{
		if (state.fontBackgroundColorValue == null
				|| !state.fontBackgroundColorValue.equals(value))
		{
			state.fontBackgroundColorValue = value;
			state.fontBackgroundColor = null;
		}
	}

	/**
	 * 
	 */
	public void setFontBorderColor(String value)
	{
		if (state.fontBorderColorValue == null
				|| !state.fontBorderColorValue.equals(value))
		{
			state.fontBorderColorValue = value;
			state.fontBorderColor = null;
		}
	}

	/**
	 * 
	 */
	public void setFontFamily(String value)
	{
		if (!state.fontFamily.equals(value))
		{
			state.fontFamily = value;
		}
	}

	/**
	 * 
	 */
	public void setFontStyle(int value)
	{
		if (value != state.fontStyle)
		{
			state.fontStyle = value;
		}
	}

	/**
	 * 
	 */
	public void setAlpha(double value)
	{
		if (state.alpha != value)
		{
			state.g.setComposite(AlphaComposite
					.getInstance(AlphaComposite.SRC_OVER, (float) (value)));
			state.alpha = value;
		}
	}

	/**
	 * 
	 */
	public void setFillAlpha(double value)
	{
		if (state.fillAlpha != value)
		{
			state.fillAlpha = value;
			state.fillColor = null;
		}
	}

	/**
	 * 
	 */
	public void setStrokeAlpha(double value)
	{
		if (state.strokeAlpha != value)
		{
			state.strokeAlpha = value;
			state.strokeColor = null;
		}
	}

	/**
	 * 
	 */
	public void setFillColor(String value)
	{
		if (state.fillColorValue == null || !state.fillColorValue.equals(value))
		{
			state.fillColorValue = value;
			state.fillColor = null;

			// Setting fill color resets gradient paint
			state.gradientPaint = null;
		}
	}

	/**
	 * 
	 */
	public void setGradient(String color1, String color2, double x, double y,
			double w, double h, String direction, double alpha1, double alpha2)
	{
		// LATER: Add lazy instantiation and check if paint already created
		float x1 = (float) ((state.dx + x) * state.scale);
		float y1 = (float) ((state.dy + y) * state.scale);
		float x2 = (float) x1;
		float y2 = (float) y1;
		h *= state.scale;
		w *= state.scale;

		if (direction == null || direction.length() == 0
				|| direction.equals(mxConstants.DIRECTION_SOUTH))
		{
			y2 = (float) (y1 + h);
		}
		else if (direction.equals(mxConstants.DIRECTION_EAST))
		{
			x2 = (float) (x1 + w);
		}
		else if (direction.equals(mxConstants.DIRECTION_NORTH))
		{
			y1 = (float) (y1 + h);
		}
		else if (direction.equals(mxConstants.DIRECTION_WEST))
		{
			x1 = (float) (x1 + w);
		}

		Color c1 = parseColor(color1);

		if (alpha1 != 1)
		{
			c1 = new Color(c1.getRed(), c1.getGreen(), c1.getBlue(),
					(int) (alpha1 * 255));
		}

		Color c2 = parseColor(color2);

		if (alpha2 != 1)
		{
			c2 = new Color(c2.getRed(), c2.getGreen(), c2.getBlue(),
					(int) (alpha2 * 255));
		}

		state.gradientPaint = new GradientPaint(x1, y1, c1, x2, y2, c2, true);

		// Resets fill color
		state.fillColorValue = null;
	}

	/**
	 * Helper method that uses {@link mxUtils#parseColor(String)}.
	 */
	protected Color parseColor(String hex)
	{
		return parseColor(hex, 1);
	};

	/**
	 * Helper method that uses {@link mxUtils#parseColor(String)}.
	 */
	protected Color parseColor(String hex, double alpha)
	{
		Color result = colorCache.get(hex);

		if (result == null)
		{
			result = mxUtils.parseColor(hex, alpha);
			colorCache.put(hex + "-" + (int) (alpha * 255), result);
		}

		return result;
	};

	/**
	 *
	 */
	public void rect(double x, double y, double w, double h)
	{
		currentPath = new GeneralPath();
		currentPath.append(new Rectangle2D.Double((state.dx + x) * state.scale,
				(state.dy + y) * state.scale, w * state.scale, h * state.scale),
				false);
	}

	/**
	 * Implements a rounded rectangle using a path.
	 */
	public void roundrect(double x, double y, double w, double h, double dx,
			double dy)
	{
		// LATER: Use arc here or quad in VML/SVG for exact match
		begin();
		moveTo(x + dx, y);
		lineTo(x + w - dx, y);
		quadTo(x + w, y, x + w, y + dy);
		lineTo(x + w, y + h - dy);
		quadTo(x + w, y + h, x + w - dx, y + h);
		lineTo(x + dx, y + h);
		quadTo(x, y + h, x, y + h - dy);
		lineTo(x, y + dy);
		quadTo(x, y, x + dx, y);
	}

	/**
	 * 
	 */
	public void ellipse(double x, double y, double w, double h)
	{
		currentPath = new GeneralPath();
		currentPath.append(new Ellipse2D.Double((state.dx + x) * state.scale,
				(state.dy + y) * state.scale, w * state.scale, h * state.scale),
				false);
	}

	/**
	 * 
	 */
	public void image(double x, double y, double w, double h, String src,
			boolean aspect, boolean flipH, boolean flipV)
	{
		if (src != null && w > 0 && h > 0)
		{
			Image img = loadImage(src);

			if (img != null)
			{
				Rectangle bounds = getImageBounds(img, x, y, w, h, aspect);
				img = scaleImage(img, bounds.width, bounds.height);

				if (img != null)
				{
					drawImage(
							createImageGraphics(bounds.x, bounds.y,
									bounds.width, bounds.height, flipH, flipV),
							img, bounds.x, bounds.y);
				}
			}
		}
	}

	/**
	 * 
	 */
	protected void drawImage(Graphics2D graphics, Image image, int x, int y)
	{
		graphics.drawImage(image, x, y, null);
	}

	/**
	 * Hook for image caching.
	 */
	protected Image loadImage(String src)
	{
		return mxUtils.loadImage(src);
	}

	/**
	 * 
	 */
	protected final Rectangle getImageBounds(Image img, double x, double y,
			double w, double h, boolean aspect)
	{
		x = (state.dx + x) * state.scale;
		y = (state.dy + y) * state.scale;
		w *= state.scale;
		h *= state.scale;

		if (aspect)
		{
			Dimension size = getImageSize(img);
			double s = Math.min(w / size.width, h / size.height);
			int sw = (int) Math.round(size.width * s);
			int sh = (int) Math.round(size.height * s);
			x += (w - sw) / 2;
			y += (h - sh) / 2;
			w = sw;
			h = sh;
		}
		else
		{
			w = Math.round(w);
			h = Math.round(h);
		}

		return new Rectangle((int) x, (int) y, (int) w, (int) h);
	}

	/**
	 * Returns the size for the given image.
	 */
	protected Dimension getImageSize(Image image)
	{
		return new Dimension(image.getWidth(null), image.getHeight(null));
	}

	/**
	 * Uses {@link #IMAGE_SCALING} to scale the given image.
	 */
	protected Image scaleImage(Image img, int w, int h)
	{
		Dimension size = getImageSize(img);

		if (w == size.width && h == size.height)
		{
			return img;
		}
		else
		{
			return img.getScaledInstance(w, h, IMAGE_SCALING);
		}
	}

	/**
	 * Creates a graphic instance for rendering an image.
	 */
	protected final Graphics2D createImageGraphics(double x, double y, double w,
			double h, boolean flipH, boolean flipV)
	{
		Graphics2D g2 = state.g;

		if (flipH || flipV)
		{
			g2 = (Graphics2D) g2.create();

			if (flipV && flipH)
			{
				g2.rotate(Math.toRadians(180), x + w / 2, y + h / 2);
			}
			else
			{
				int sx = 1;
				int sy = 1;
				int dx = 0;
				int dy = 0;

				if (flipH)
				{
					sx = -1;
					dx = (int) (-w - 2 * x);
				}

				if (flipV)
				{
					sy = -1;
					dy = (int) (-h - 2 * y);
				}

				g2.scale(sx, sy);
				g2.translate(dx, dy);
			}
		}

		return g2;
	}

	/**
	 * Creates a HTML document around the given markup.
	 */
	protected String createHtmlDocument(String text, String align,
			String valign, int w, int h, boolean wrap, String overflow,
			boolean clip)
	{
		StringBuffer css = new StringBuffer();
		css.append("display:inline;");
		css.append("font-family:" + state.fontFamily + ";");
		css.append("font-size:" + Math.round(state.fontSize) + HTML_UNIT
				+ ";");
		css.append("color:" + state.fontColorValue + ";");
		// KNOWN: Line-height ignored in JLabel
		css.append("line-height:"
				+ ((mxConstants.ABSOLUTE_LINE_HEIGHT)
						? Math.round(state.fontSize * mxConstants.LINE_HEIGHT)
								+ " " + HTML_UNIT
						: mxConstants.LINE_HEIGHT)
				+ ";");

		boolean setWidth = false;

		if ((state.fontStyle & mxConstants.FONT_BOLD) == mxConstants.FONT_BOLD)
		{
			css.append("font-weight:bold;");
		}

		if ((state.fontStyle
				& mxConstants.FONT_ITALIC) == mxConstants.FONT_ITALIC)
		{
			css.append("font-style:italic;");
		}

		String txtDecor = "";
		
		if ((state.fontStyle
				& mxConstants.FONT_UNDERLINE) == mxConstants.FONT_UNDERLINE)
	    {
			txtDecor = "underline";
	    }
	    
	    if ((state.fontStyle
				& mxConstants.FONT_STRIKETHROUGH) == mxConstants.FONT_STRIKETHROUGH)
	    {
	    	txtDecor += " line-through";
	    }

	    if (txtDecor.length() > 0)
	    {
	    	css.append("text-decoration: " + txtDecor + ";");
	    }
	    
		if (align != null)
		{
			if (align.equals(mxConstants.ALIGN_CENTER))
			{
				css.append("text-align:center;");
			}
			else if (align.equals(mxConstants.ALIGN_RIGHT))
			{
				css.append("text-align:right;");
			}
		}

		if (state.fontBackgroundColorValue != null)
		{
			css.append(
					"background-color:" + state.fontBackgroundColorValue + ";");
		}

		// KNOWN: Border ignored in JLabel
		if (state.fontBorderColorValue != null)
		{
			css.append("border:1pt solid " + state.fontBorderColorValue + ";");
		}

		// KNOWN: max-width/-height ignored in JLabel
		if (clip)
		{
			css.append("overflow:hidden;");
			setWidth = true;
		}
		else if (overflow != null)
		{
			if (overflow.equals("fill"))
			{
				css.append("height:" + Math.round(h) + HTML_UNIT + ";");
				setWidth = true;
			}
			else if (overflow.equals("width"))
			{
				setWidth = true;

				if (h > 0)
				{
					css.append(
							"height:" + Math.round(h) + HTML_UNIT + ";");
				}
			}
		}

		if (wrap)
		{
			if (!clip)
			{
				// NOTE: Max-width not available in Java
				setWidth = true;
			}

			css.append("white-space:normal;");
		}
		else
		{
			css.append("white-space:nowrap;");
		}

		if (setWidth && w > 0)
		{
			css.append("width:" + Math.round(w) + HTML_UNIT + ";");
		}

		return createHtmlDocument(text, css.toString());
	}

	/**
	 * Creates a HTML document for the given text and CSS style.
	 */
	protected String createHtmlDocument(String text, String style)
	{
		return "<html><div style=\"" + style + "\">" + text + "</div></html>";
	}

	/**
	 * Hook to return the renderer for HTML formatted text. This implementation returns
	 * the shared instance of mxLighweightLabel.
	 */
	protected JLabel getTextRenderer()
	{
		return mxLightweightLabel.getSharedInstance();
	}

	/**
	 * 
	 */
	protected Point2D getMargin(String align, String valign)
	{
		double dx = 0;
		double dy = 0;

		if (align != null)
		{
			if (align.equals(mxConstants.ALIGN_CENTER))
			{
				dx = -0.5;
			}
			else if (align.equals(mxConstants.ALIGN_RIGHT))
			{
				dx = -1;
			}
		}

		if (valign != null)
		{
			if (valign.equals(mxConstants.ALIGN_MIDDLE))
			{
				dy = -0.5;
			}
			else if (valign.equals(mxConstants.ALIGN_BOTTOM))
			{
				dy = -1;
			}
		}

		return new Point2D.Double(dx, dy);
	}

	/**
	 * Draws the given HTML text.
	 */
	protected void htmlText(double x, double y, double w, double h, String str,
			String align, String valign, boolean wrap, String format,
			String overflow, boolean clip, double rotation)
	{
		x += state.dx;
		y += state.dy;

		JLabel textRenderer = getTextRenderer();

		if (textRenderer != null && rendererPane != null)
		{
			// Use native scaling for HTML
			AffineTransform previous = state.g.getTransform();
			double rad = rotation * (Math.PI / 180);
			state.g.rotate(rad, x, y);
			state.g.scale(state.scale * HTML_SCALE, state.scale * HTML_SCALE);

			// Renders the scaled text with a correction factor
			// HTML_SCALE for the given HTML_UNIT
			boolean widthFill = false;
			boolean fill = false;

			String original = str;

			if (overflow != null)
			{
				widthFill = overflow.equals("width");
				fill = overflow.equals("fill");
			}

			str = createHtmlDocument(str, align, valign,
					(widthFill || fill) ? (int) Math.round(w) : 0,
					(fill) ? (int) Math.round(h) : 0, wrap, overflow, clip);
			textRenderer.setText(str);
			Dimension pref = textRenderer.getPreferredSize();
			int prefWidth = pref.width;
			int prefHeight = pref.height;

			// Poor man's max-width
			// TODO: Is this still needed?
			if (((clip || wrap) && prefWidth > w / HTML_SCALE && w > 0)
					|| (clip && prefHeight > h / HTML_SCALE && h > 0))
			{
				// TextWidthDelta is workaround for inconsistent word wrapping in Java
				int cw = (int) Math
						.round((w) + ((wrap) ? JAVA_TEXT_WIDTH_DELTA : 0));
				int ch = (int) Math.round(h);
				str = createHtmlDocument(original, align, valign, cw, ch, wrap,
						overflow, clip);
				textRenderer.setText(str);

				pref = textRenderer.getPreferredSize();
				prefWidth = pref.width;
				prefHeight = pref.height + 2;
			}

			// Matches HTML output
			if (clip && w > 0 && h > 0)
			{
				prefWidth = Math.min(pref.width, (int) (w / HTML_SCALE));
				prefHeight = Math.min(prefHeight, (int) (h / HTML_SCALE));
				h = prefHeight * HTML_SCALE;
			}
			else if (!clip && wrap && w > 0 && h > 0)
			{
				prefWidth = pref.width;
				w = Math.max(pref.width, (int) (w / HTML_SCALE));
				h = prefHeight * HTML_SCALE;
				prefHeight = Math.max(prefHeight, (int) (h / HTML_SCALE));
			}
			else if (!clip && !wrap)
			{
				if (w > 0 && w / HTML_SCALE < prefWidth)
				{
					w = prefWidth * HTML_SCALE;
				}

				if (h > 0 && h / HTML_SCALE < prefHeight)
				{
					h = prefHeight * HTML_SCALE;
				}
			}

			Point2D margin = getMargin(align, valign);
			x += margin.getX() * prefWidth * HTML_SCALE;
			y += margin.getY() * prefHeight * HTML_SCALE;

			if (w == 0)
			{
				w = prefWidth * HTML_SCALE;
			}

			if (h == 0)
			{
				h = prefHeight * HTML_SCALE;
			}

			rendererPane.paintComponent(state.g, textRenderer, rendererPane,
					(int) Math.round(x / HTML_SCALE),
					(int) Math.round(y / HTML_SCALE),
					(int) Math.round(w / HTML_SCALE),
					(int) Math.round(h / HTML_SCALE), true);

			state.g.setTransform(previous);
		}
	}

	/**
	 * Draws the given text.
	 */
	public void text(double x, double y, double w, double h, String str,
			String align, String valign, boolean wrap, String format,
			String overflow, boolean clip, double rotation,
			String textDirection)
	{
		// TODO: Add support for text direction
		if (format != null && format.equals("html"))
		{
			htmlText(x, y, w, h, str, align, valign, wrap, format, overflow,
					clip, rotation);
		}
		else
		{
			plainText(x, y, w, h, str, align, valign, wrap, format, overflow,
					clip, rotation);
		}
	}

	/**
	 * Draws the given text.
	 */
	public void plainText(double x, double y, double w, double h, String str,
			String align, String valign, boolean wrap, String format,
			String overflow, boolean clip, double rotation)
	{
		if (state.fontColor == null)
		{
			state.fontColor = parseColor(state.fontColorValue);
		}

		if (state.fontColor != null)
		{
			x = (state.dx + x) * state.scale;
			y = (state.dy + y) * state.scale;
			w *= state.scale;
			h *= state.scale;

			// Font-metrics needed below this line
			Graphics2D g2 = createTextGraphics(x, y, w, h, rotation, clip,
					align, valign);
			FontMetrics fm = g2.getFontMetrics();
			String[] lines = str.split("\n");

			int[] stringWidths = new int[lines.length];
			int textWidth = 0;

			for (int i = 0; i < lines.length; i++)
			{
				stringWidths[i] = fm.stringWidth(lines[i]);
				textWidth = Math.max(textWidth, stringWidths[i]);
			}

			int textHeight = (int) Math.round(lines.length
					* (fm.getFont().getSize() * mxConstants.LINE_HEIGHT));

			if (clip && textHeight > h && h > 0)
			{
				textHeight = (int) h;
			}

			Point2D margin = getMargin(align, valign);
			x += margin.getX() * textWidth;
			y += margin.getY() * textHeight;

			if (state.fontBackgroundColorValue != null)
			{
				if (state.fontBackgroundColor == null)
				{
					state.fontBackgroundColor = parseColor(
							state.fontBackgroundColorValue);
				}

				if (state.fontBackgroundColor != null)
				{
					g2.setColor(state.fontBackgroundColor);
					g2.fillRect((int) Math.round(x), (int) Math.round(y - 1),
							textWidth + 1, textHeight + 2);
				}
			}

			if (state.fontBorderColorValue != null)
			{
				if (state.fontBorderColor == null)
				{
					state.fontBorderColor = parseColor(
							state.fontBorderColorValue);
				}

				if (state.fontBorderColor != null)
				{
					g2.setColor(state.fontBorderColor);
					g2.drawRect((int) Math.round(x), (int) Math.round(y - 1),
							textWidth + 1, textHeight + 2);
				}
			}

			g2.setColor(state.fontColor);
			y += fm.getHeight() - fm.getDescent() - (margin.getY() + 0.5);

			for (int i = 0; i < lines.length; i++)
			{
				double dx = 0;

				if (align != null)
				{
					if (align.equals(mxConstants.ALIGN_CENTER))
					{
						dx = (textWidth - stringWidths[i]) / 2;
					}
					else if (align.equals(mxConstants.ALIGN_RIGHT))
					{
						dx = textWidth - stringWidths[i];
					}
				}

				// Adds support for underlined text via attributed character iterator
				if (!lines[i].isEmpty())
				{
					boolean isUnderline = (state.fontStyle
							& mxConstants.FONT_UNDERLINE) == mxConstants.FONT_UNDERLINE;
					boolean isStrikethrough = (state.fontStyle
							& mxConstants.FONT_STRIKETHROUGH) == mxConstants.FONT_STRIKETHROUGH;
					
					if (isUnderline || isStrikethrough)
					{
						AttributedString as = new AttributedString(lines[i]);
						as.addAttribute(TextAttribute.FONT, g2.getFont());
						
						if (isUnderline)
						{
							as.addAttribute(TextAttribute.UNDERLINE,
								TextAttribute.UNDERLINE_ON);
						}
						
						if (isStrikethrough)
						{
							as.addAttribute(TextAttribute.STRIKETHROUGH,
								TextAttribute.STRIKETHROUGH_ON);
						}
						
						g2.drawString(as.getIterator(),
								(int) Math.round(x + dx), (int) Math.round(y));
					}
					else
					{
						g2.drawString(lines[i], (int) Math.round(x + dx),
								(int) Math.round(y));
					}
				}

				y += (int) Math.round(
						fm.getFont().getSize() * mxConstants.LINE_HEIGHT);
			}
		}
	}

	/**
	 * Returns a new graphics instance with the correct color and font for
	 * text rendering.
	 */
	protected final Graphics2D createTextGraphics(double x, double y, double w,
			double h, double rotation, boolean clip, String align,
			String valign)
	{
		Graphics2D g2 = state.g;
		updateFont();

		if (rotation != 0)
		{
			g2 = (Graphics2D) state.g.create();

			double rad = rotation * (Math.PI / 180);
			g2.rotate(rad, x, y);
		}

		if (clip && w > 0 && h > 0)
		{
			if (g2 == state.g)
			{
				g2 = (Graphics2D) state.g.create();
			}

			Point2D margin = getMargin(align, valign);
			x += margin.getX() * w;
			y += margin.getY() * h;

			g2.clip(new Rectangle2D.Double(x, y, w, h));
		}

		return g2;
	}

	/**
	 * 
	 */
	public void begin()
	{
		currentPath = new GeneralPath();
	}

	/**
	 * 
	 */
	public void moveTo(double x, double y)
	{
		if (currentPath != null)
		{
			currentPath.moveTo((float) ((state.dx + x) * state.scale),
					(float) ((state.dy + y) * state.scale));
		}
	}

	/**
	 * 
	 */
	public void lineTo(double x, double y)
	{
		if (currentPath != null)
		{
			currentPath.lineTo((float) ((state.dx + x) * state.scale),
					(float) ((state.dy + y) * state.scale));
		}
	}

	/**
	 * 
	 */
	public void quadTo(double x1, double y1, double x2, double y2)
	{
		if (currentPath != null)
		{
			currentPath.quadTo((float) ((state.dx + x1) * state.scale),
					(float) ((state.dy + y1) * state.scale),
					(float) ((state.dx + x2) * state.scale),
					(float) ((state.dy + y2) * state.scale));
		}
	}

	/**
	 * 
	 */
	public void curveTo(double x1, double y1, double x2, double y2, double x3,
			double y3)
	{
		if (currentPath != null)
		{
			currentPath.curveTo((float) ((state.dx + x1) * state.scale),
					(float) ((state.dy + y1) * state.scale),
					(float) ((state.dx + x2) * state.scale),
					(float) ((state.dy + y2) * state.scale),
					(float) ((state.dx + x3) * state.scale),
					(float) ((state.dy + y3) * state.scale));
		}
	}

	/**
	 * Closes the current path.
	 */
	public void close()
	{
		if (currentPath != null)
		{
			currentPath.closePath();
		}
	}

	/**
	 * 
	 */
	public void stroke()
	{
		paintCurrentPath(false, true);
	}

	/**
	 * 
	 */
	public void fill()
	{
		paintCurrentPath(true, false);
	}

	/**
	 * 
	 */
	public void fillAndStroke()
	{
		paintCurrentPath(true, true);
	}

	/**
	 * 
	 */
	protected void paintCurrentPath(boolean filled, boolean stroked)
	{
		if (currentPath != null)
		{
			if (stroked)
			{
				if (state.strokeColor == null)
				{
					state.strokeColor = parseColor(state.strokeColorValue,
							state.strokeAlpha);
				}

				if (state.strokeColor != null)
				{
					updateStroke();
				}
			}

			if (filled)
			{
				if (state.gradientPaint == null && state.fillColor == null)
				{
					state.fillColor = parseColor(state.fillColorValue,
							state.fillAlpha);
				}
			}

			if (state.shadow)
			{
				paintShadow(filled, stroked);
			}

			if (filled)
			{
				if (state.gradientPaint != null)
				{
					state.g.setPaint(state.gradientPaint);
					state.g.fill(currentPath);
				}
				else
				{
					if (state.fillColor != null)
					{
						state.g.setColor(state.fillColor);
						state.g.setPaint(null);
						state.g.fill(currentPath);
					}
				}
			}

			if (stroked && state.strokeColor != null)
			{
				state.g.setColor(state.strokeColor);
				state.g.draw(currentPath);
			}
		}
	}

	/**
	 * 
	 */
	protected void paintShadow(boolean filled, boolean stroked)
	{
		if (state.shadowColor == null)
		{
			state.shadowColor = parseColor(state.shadowColorValue);
		}

		if (state.shadowColor != null)
		{
			double rad = -state.theta * (Math.PI / 180);
			double cos = Math.cos(rad);
			double sin = Math.sin(rad);

			double dx = state.shadowOffsetX * state.scale;
			double dy = state.shadowOffsetY * state.scale;

			if (state.flipH)
			{
				dx *= -1;
			}

			if (state.flipV)
			{
				dy *= -1;
			}

			double tx = dx * cos - dy * sin;
			double ty = dx * sin + dy * cos;

			state.g.setColor(state.shadowColor);
			state.g.translate(tx, ty);

			double alpha = state.alpha * state.shadowAlpha;

			Composite comp = state.g.getComposite();
			state.g.setComposite(AlphaComposite
					.getInstance(AlphaComposite.SRC_OVER, (float) (alpha)));

			if (filled
					&& (state.gradientPaint != null || state.fillColor != null))
			{
				state.g.fill(currentPath);
			}

			// FIXME: Overlaps with fill in composide mode
			if (stroked && state.strokeColor != null)
			{
				state.g.draw(currentPath);
			}

			state.g.translate(-tx, -ty);
			state.g.setComposite(comp);
		}
	}

	/**
	 * 
	 */
	public void setShadow(boolean value)
	{
		state.shadow = value;
	}

	/**
	 * 
	 */
	public void setShadowColor(String value)
	{
		state.shadowColorValue = value;
	}

	/**
	 * 
	 */
	public void setShadowAlpha(double value)
	{
		state.shadowAlpha = value;
	}

	/**
	 * 
	 */
	public void setShadowOffset(double dx, double dy)
	{
		state.shadowOffsetX = dx;
		state.shadowOffsetY = dy;
	}

	/**
	 * 
	 */
	protected void updateFont()
	{
		int size = (int) Math.round(state.fontSize * state.scale);
		int style = ((state.fontStyle
				& mxConstants.FONT_BOLD) == mxConstants.FONT_BOLD) ? Font.BOLD
						: Font.PLAIN;
		style += ((state.fontStyle
				& mxConstants.FONT_ITALIC) == mxConstants.FONT_ITALIC)
						? Font.ITALIC : Font.PLAIN;

		if (lastFont == null || !lastFontFamily.equals(state.fontFamily)
				|| size != lastFontSize || style != lastFontStyle)
		{
			lastFont = createFont(state.fontFamily, style, size);
			lastFontFamily = state.fontFamily;
			lastFontStyle = style;
			lastFontSize = size;
		}

		state.g.setFont(lastFont);
	}

	/**
	 * Hook for subclassers to implement font caching.
	 */
	protected Font createFont(String family, int style, int size)
	{
		return new Font(getFontName(family), style, size);
	}

	/**
	 * Returns a font name for the given CSS values for font-family.
	 * This implementation returns the first entry for comma-separated
	 * lists of entries.
	 */
	protected String getFontName(String family)
	{
		if (family != null)
		{
			int comma = family.indexOf(',');

			if (comma >= 0)
			{
				family = family.substring(0, comma);
			}
		}

		return family;
	}

	/**
	 * 
	 */
	protected void updateStroke()
	{
		float sw = (float) Math.max(1, state.strokeWidth * state.scale);
		int cap = BasicStroke.CAP_BUTT;

		if (state.lineCap.equals("round"))
		{
			cap = BasicStroke.CAP_ROUND;
		}
		else if (state.lineCap.equals("square"))
		{
			cap = BasicStroke.CAP_SQUARE;
		}

		int join = BasicStroke.JOIN_MITER;

		if (state.lineJoin.equals("round"))
		{
			join = BasicStroke.JOIN_ROUND;
		}
		else if (state.lineJoin.equals("bevel"))
		{
			join = BasicStroke.JOIN_BEVEL;
		}

		float miterlimit = (float) state.miterLimit;

		if (lastStroke == null || lastStrokeWidth != sw || lastCap != cap
				|| lastJoin != join || lastMiterLimit != miterlimit
				|| lastDashed != state.dashed
				|| (state.dashed && lastDashPattern != state.dashPattern))
		{
			float[] dash = null;

			if (state.dashed)
			{
				dash = new float[state.dashPattern.length];

				for (int i = 0; i < dash.length; i++)
				{
					dash[i] = (float) (state.dashPattern[i] * ((state.fixDash) ? state.scale : sw));
				}
			}

			lastStroke = new BasicStroke(sw, cap, join, miterlimit, dash, 0);
			lastStrokeWidth = sw;
			lastCap = cap;
			lastJoin = join;
			lastMiterLimit = miterlimit;
			lastDashed = state.dashed;
			lastDashPattern = state.dashPattern;
		}

		state.g.setStroke(lastStroke);
	}

	/**
	 * 
	 */
	protected class CanvasState implements Cloneable
	{
		/**
		 * 
		 */
		protected double alpha = 1;

		/**
		 * 
		 */
		protected double fillAlpha = 1;

		/**
		 * 
		 */
		protected double strokeAlpha = 1;

		/**
		 * 
		 */
		protected double scale = 1;

		/**
		 * 
		 */
		protected double dx = 0;

		/**
		 * 
		 */
		protected double dy = 0;

		/**
		 * 
		 */
		protected double theta = 0;

		/**
		 * 
		 */
		protected double rotationCx = 0;

		/**
		 * 
		 */
		protected double rotationCy = 0;

		/**
		 * 
		 */
		protected boolean flipV = false;

		/**
		 * 
		 */
		protected boolean flipH = false;

		/**
		 * 
		 */
		protected double miterLimit = 10;

		/**
		 * 
		 */
		protected int fontStyle = 0;

		/**
		 * 
		 */
		protected double fontSize = mxConstants.DEFAULT_FONTSIZE;

		/**
		 * 
		 */
		protected String fontFamily = mxConstants.DEFAULT_FONTFAMILIES;

		/**
		 * 
		 */
		protected String fontColorValue = "#000000";

		/**
		 * 
		 */
		protected Color fontColor;

		/**
		 * 
		 */
		protected String fontBackgroundColorValue;

		/**
		 * 
		 */
		protected Color fontBackgroundColor;

		/**
		 * 
		 */
		protected String fontBorderColorValue;

		/**
		 * 
		 */
		protected Color fontBorderColor;

		/**
		 * 
		 */
		protected String lineCap = "flat";

		/**
		 * 
		 */
		protected String lineJoin = "miter";

		/**
		 * 
		 */
		protected double strokeWidth = 1;

		/**
		 * 
		 */
		protected String strokeColorValue;

		/**
		 * 
		 */
		protected Color strokeColor;

		/**
		 * 
		 */
		protected String fillColorValue;

		/**
		 * 
		 */
		protected Color fillColor;

		/**
		 * 
		 */
		protected Paint gradientPaint;

		/**
		 * 
		 */
		protected boolean dashed = false;

		/**
		 * 
		 */
		protected boolean fixDash = false;

		/**
		 * 
		 */
		protected float[] dashPattern = { 3, 3 };

		/**
		 * 
		 */
		protected boolean shadow = false;

		/**
		 * 
		 */
		protected String shadowColorValue = mxConstants.W3C_SHADOWCOLOR;

		/**
		 * 
		 */
		protected Color shadowColor;

		/**
		 * 
		 */
		protected double shadowAlpha = 1;

		/**
		 * 
		 */
		protected double shadowOffsetX = mxConstants.SHADOW_OFFSETX;

		/**
		 * 
		 */
		protected double shadowOffsetY = mxConstants.SHADOW_OFFSETY;

		/**
		 * Stores the actual state.
		 */
		protected transient Graphics2D g;

		/**
		 * 
		 */
		public Object clone() throws CloneNotSupportedException
		{
			return super.clone();
		}

	}

}
