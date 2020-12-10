/**
 * Copyright (c) 2007-2012, JGraph Ltd
 */
package com.mxgraph.util;

import java.awt.AlphaComposite;
import java.awt.Color;
import java.awt.Dimension;
import java.awt.Font;
import java.awt.FontMetrics;
import java.awt.Graphics;
import java.awt.Graphics2D;
import java.awt.Rectangle;
import java.awt.RenderingHints;
import java.awt.font.FontRenderContext;
import java.awt.font.TextAttribute;
import java.awt.geom.Line2D;
import java.awt.geom.Rectangle2D;
import java.awt.image.BufferedImage;
import java.awt.image.ImageObserver;
import java.io.BufferedReader;
import java.io.ByteArrayInputStream;
import java.io.FileInputStream;
import java.io.FileWriter;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.URL;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collection;
import java.util.Comparator;
import java.util.Formatter;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.SortedSet;
import java.util.Stack;
import java.util.TreeSet;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.imageio.ImageIO;
import javax.swing.text.html.HTMLDocument;

import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.NamedNodeMap;
import org.w3c.dom.Node;

import com.mxgraph.io.mxCodecRegistry;
import com.mxgraph.model.mxCellPath;
import com.mxgraph.model.mxICell;
import com.mxgraph.model.mxIGraphModel;
import com.mxgraph.view.mxCellState;

/**
 * Contains various helper methods for use with mxGraph.
 */
public class mxUtils
{

	private static final Logger log = Logger.getLogger(mxUtils.class.getName());

	/**
	 * True if the machine is a Mac.
	 */
	public static boolean IS_MAC = System.getProperty("os.name").toLowerCase()
			.indexOf("mac") >= 0;

	/**
	 * True if the machine is running a linux kernel.
	 */
	public static boolean IS_LINUX = System.getProperty("os.name")
			.toLowerCase().indexOf("linux") >= 0;

	/**
	 * Static Graphics used for Font Metrics.
	 */
	protected static transient Graphics fontGraphics;

	// Creates a renderer for HTML markup (only possible in
	// non-headless environment)
	static
	{
		try
		{
			fontGraphics = new BufferedImage(1, 1, BufferedImage.TYPE_INT_RGB)
					.getGraphics();
		}
		catch (Exception e)
		{
			log.log(Level.WARNING, "Failed to initialize font graphics", e);
		}
	}

	/**
	 * Returns the size for the given label. If isHtml is true then any HTML
	 * markup in the label is computed as HTML and all newlines inside the HTML
	 * body are converted into linebreaks.
	 */
	public static mxRectangle getLabelSize(String label,
			Map<String, Object> style, boolean isHtml, double scale)
	{
		return getLabelSize(label, style, isHtml, scale, 0);
	}

	/**
	 * Returns the size for the given label. If isHtml is true then any HTML
	 * markup in the label is computed as HTML and all newlines inside the HTML
	 * body are converted into linebreaks.
	 */
	public static mxRectangle getLabelSize(String label,
			Map<String, Object> style, boolean isHtml, double scale,
			double htmlWrapWidth)
	{
		mxRectangle size;

		if (isHtml)
		{
			size = getSizeForHtml(getBodyMarkup(label, true), style, scale,
					htmlWrapWidth);
		}
		else
		{
			size = getSizeForString(label, getFont(style), scale);
		}

		return size;
	}

	/**
	 * Returns the body part of the given HTML markup.
	 */
	public static String getBodyMarkup(String markup, boolean replaceLinefeeds)
	{
		String lowerCase = markup.toLowerCase();
		int bodyStart = lowerCase.indexOf("<body>");

		if (bodyStart >= 0)
		{
			bodyStart += 7;
			int bodyEnd = lowerCase.lastIndexOf("</body>");

			if (bodyEnd > bodyStart)
			{
				markup = markup.substring(bodyStart, bodyEnd).trim();
			}
		}

		if (replaceLinefeeds)
		{
			markup = markup.replaceAll("\n", "<br>");
		}

		return markup;
	}

	/**
	 * Returns the paint bounds for the given label.
	 */
	public static mxRectangle getLabelPaintBounds(String label,
			Map<String, Object> style, boolean isHtml, mxPoint offset,
			mxRectangle vertexBounds, double scale)
	{
		return getLabelPaintBounds(label, style, isHtml, offset, vertexBounds,
				scale, false);
	}

	/**
	 * Returns the paint bounds for the given label.
	 */
	public static mxRectangle getLabelPaintBounds(String label,
			Map<String, Object> style, boolean isHtml, mxPoint offset,
			mxRectangle vertexBounds, double scale, boolean isEdge)
	{
		double wrapWidth = 0;

		if (isHtml
				&& vertexBounds != null
				&& mxUtils.getString(style, mxConstants.STYLE_WHITE_SPACE,
						"nowrap").equals("wrap"))
		{
			wrapWidth = vertexBounds.getWidth();
		}

		mxRectangle size = mxUtils.getLabelSize(label, style, isHtml, scale,
				wrapWidth);

		// Measures font with full scale and scales back
		size.setWidth(size.getWidth() / scale);
		size.setHeight(size.getHeight() / scale);

		double x = offset.getX();
		double y = offset.getY();
		double width = 0;
		double height = 0;

		if (vertexBounds != null)
		{
			x += vertexBounds.getX();
			y += vertexBounds.getY();

			if (mxUtils.getString(style, mxConstants.STYLE_SHAPE, "").equals(
					mxConstants.SHAPE_SWIMLANE))
			{
				// Limits the label to the swimlane title
				boolean horizontal = mxUtils.isTrue(style,
						mxConstants.STYLE_HORIZONTAL, true);
				double start = mxUtils.getDouble(style,
						mxConstants.STYLE_STARTSIZE,
						mxConstants.DEFAULT_STARTSIZE)
						* scale;

				if (horizontal)
				{
					width += vertexBounds.getWidth();
					height += start;
				}
				else
				{
					width += start;
					height += vertexBounds.getHeight();
				}
			}
			else
			{
				width += (isEdge) ? 0 : vertexBounds.getWidth();
				height += vertexBounds.getHeight();
			}
		}

		return mxUtils.getScaledLabelBounds(x, y, size, width, height, style,
				scale);
	}

	/**
	 * Returns the bounds for a label for the given location and size, taking
	 * into account the alignment and spacing in the specified style, as well as
	 * the width and height of the rectangle that contains the label. (For edge
	 * labels this width and height is 0.) The scale is used to scale the given
	 * size and the spacings in the specified style.
	 */
	public static mxRectangle getScaledLabelBounds(double x, double y,
			mxRectangle size, double outerWidth, double outerHeight,
			Map<String, Object> style, double scale)
	{
		double inset = mxConstants.LABEL_INSET * scale;

		// Scales the size of the label
		// FIXME: Correct rounded font size and not-rounded scale
		double width = size.getWidth() * scale + 2 * inset;
		double height = size.getHeight() * scale + 2 * inset;

		// Gets the global spacing and orientation
		boolean horizontal = isTrue(style, mxConstants.STYLE_HORIZONTAL, true);
		int spacing = (int) (getInt(style, mxConstants.STYLE_SPACING) * scale);

		// Gets the alignment settings
		Object align = getString(style, mxConstants.STYLE_ALIGN,
				mxConstants.ALIGN_CENTER);
		Object valign = getString(style, mxConstants.STYLE_VERTICAL_ALIGN,
				mxConstants.ALIGN_MIDDLE);

		// Gets the vertical spacing
		int top = (int) (getInt(style, mxConstants.STYLE_SPACING_TOP) * scale);
		int bottom = (int) (getInt(style, mxConstants.STYLE_SPACING_BOTTOM) * scale);

		// Gets the horizontal spacing
		int left = (int) (getInt(style, mxConstants.STYLE_SPACING_LEFT) * scale);
		int right = (int) (getInt(style, mxConstants.STYLE_SPACING_RIGHT) * scale);

		// Applies the orientation to the spacings and dimension
		if (!horizontal)
		{
			int tmp = top;
			top = right;
			right = bottom;
			bottom = left;
			left = tmp;

			double tmp2 = width;
			width = height;
			height = tmp2;
		}

		// Computes the position of the label for the horizontal alignment
		if ((horizontal && align.equals(mxConstants.ALIGN_CENTER))
				|| (!horizontal && valign.equals(mxConstants.ALIGN_MIDDLE)))
		{
			x += (outerWidth - width) / 2 + left - right;
		}
		else if ((horizontal && align.equals(mxConstants.ALIGN_RIGHT))
				|| (!horizontal && valign.equals(mxConstants.ALIGN_BOTTOM)))
		{
			x += outerWidth - width - spacing - right;
		}
		else
		{
			x += spacing + left;
		}

		// Computes the position of the label for the vertical alignment
		if ((!horizontal && align.equals(mxConstants.ALIGN_CENTER))
				|| (horizontal && valign.equals(mxConstants.ALIGN_MIDDLE)))
		{
			y += (outerHeight - height) / 2 + top - bottom;
		}
		else if ((!horizontal && align.equals(mxConstants.ALIGN_LEFT))
				|| (horizontal && valign.equals(mxConstants.ALIGN_BOTTOM)))
		{
			y += outerHeight - height - spacing - bottom;
		}
		else
		{
			y += spacing + top;
		}

		return new mxRectangle(x, y, width, height);
	}

	/**
	 * Returns the font metrics of the static font graphics instance
	 * @param font The font whose metrics are to be returned
	 * @return the font metrics of the specified font
	 */
	public static FontMetrics getFontMetrics(Font font)
	{
		if (fontGraphics != null)
		{
			return fontGraphics.getFontMetrics(font);
		}

		return null;
	}

	/**
	 * Returns an <mxRectangle> with the size (width and height in pixels) of
	 * the given string.
	 * 
	 * @param text
	 *            String whose size should be returned.
	 * @param font
	 *            Font to be used for the computation.
	 */
	public static mxRectangle getSizeForString(String text, Font font,
			double scale)
	{
		FontRenderContext frc = new FontRenderContext(null, false, false);
		font = font.deriveFont((float) (font.getSize2D() * scale));
		FontMetrics metrics = null;

		if (fontGraphics != null)
		{
			metrics = fontGraphics.getFontMetrics(font);
		}

		double lineHeight = mxConstants.LINESPACING;

		if (metrics != null)
		{
			lineHeight += metrics.getHeight();
		}
		else
		{
			lineHeight += font.getSize2D() * 1.27;
		}

		String[] lines = text.split("\n");

		Rectangle2D boundingBox = null;

		if (lines.length == 0)
		{
			boundingBox = font.getStringBounds("", frc);
		}
		else
		{
			for (int i = 0; i < lines.length; i++)
			{
				Rectangle2D bounds = font.getStringBounds(lines[i], frc);

				if (boundingBox == null)
				{
					boundingBox = bounds;
				}
				else
				{
					boundingBox
							.setFrame(
									0,
									0,
									Math.max(boundingBox.getWidth(),
											bounds.getWidth()),
									boundingBox.getHeight() + lineHeight);
				}
			}
		}

		return new mxRectangle(boundingBox);
	}

	/**
	 * Returns the specified text in lines that fit within the specified
	 * width when the specified font metrics are applied to the text
	 * @param text the text to wrap
	 * @param metrics the font metrics to calculate the text size for
	 * @param width the width that the text must fit within
	 * @return the input text split in lines that fit the specified width
	 */
	public static String[] wordWrap(String text, FontMetrics metrics,
			double width)
	{
		List<String> result = new ArrayList<String>();
		// First split the processing into lines already delimited by
		// newlines. We want the result to retain all newlines in position.
		String[] lines = text.split("\n");

		for (int i = 0; i < lines.length; i++)
		{
			int lineWidth = 0; // the display width of the current line
			int charCount = 0; // keeps count of current position in the line
			StringBuilder currentLine = new StringBuilder();

			// Split the words of the current line by spaces and tabs
			// The words are trimmed of tabs, space and newlines, therefore
			String[] words = lines[i].split("\\s+");

			// Need to a form a stack of the words in reverse order
			// This is because if a word is split during the process 
			// the remainder of the word is added to the front of the 
			// stack and processed next
			Stack<String> wordStack = new Stack<String>();

			for (int j = words.length - 1; j >= 0; j--)
			{
				wordStack.push(words[j]);
			}

			while (!wordStack.isEmpty())
			{
				String word = wordStack.pop();

				// Work out what whitespace exists before this word.
				// and add the width of the whitespace to the calculation
				int whitespaceCount = 0;

				if (word.length() > 0)
				{
					// Concatenate any preceding whitespace to the
					// word and calculate the number of characters of that
					// whitespace
					char firstWordLetter = word.charAt(0);
					int letterIndex = lines[i].indexOf(firstWordLetter,
							charCount);
					String whitespace = lines[i].substring(charCount,
							letterIndex);
					whitespaceCount = whitespace.length();
					word = whitespace.concat(word);
				}

				double wordLength;

				// If the line width is zero, we are at the start of a newline
				// We don't proceed preceeding whitespace in the width
				// calculation
				if (lineWidth > 0)
				{
					wordLength = metrics.stringWidth(word);
				}
				else
				{
					wordLength = metrics.stringWidth(word.trim());
				}

				// Does the width of line so far plus the width of the 
				// current word exceed the allowed width?
				if (lineWidth + wordLength > width)
				{
					if (lineWidth > 0)
					{
						// There is already at least one word on this line
						// and the current word takes the overall width over
						// the allowed width. Because there is something on
						// the line, complete the current line, reset the width
						// counter, create a new line and put the current word
						// back on the stack for processing in the next round
						result.add(currentLine.toString());
						currentLine = new StringBuilder();
						wordStack.push(word.trim());
						lineWidth = 0;
					}
					else if (mxConstants.SPLIT_WORDS)
					{
						// There are no words on the current line and the 
						// current word does not fit on it. Find the maximum
						// number of characters of this word that just fit
						// in the available width
						word = word.trim();

						for (int j = 1; j <= word.length(); j++)
						{
							wordLength = metrics.stringWidth(word.substring(0,
									j));

							if (lineWidth + wordLength > width)
							{
								// The last character took us over the allowed
								// width, deducted it unless there is only one
								// character, in which case we have to use it
								// since we can't split it...
								j = j > 1 ? j - 1 : j;
								String chars = word.substring(0, j);
								currentLine = currentLine.append(chars);
								// Return the unprocessed part of the word 
								// to the stack
								wordStack
										.push(word.substring(j, word.length()));
								result.add(currentLine.toString());
								currentLine = new StringBuilder();
								lineWidth = 0;
								// Increment char counter allowing for white 
								// space in the original word
								charCount = charCount + chars.length()
										+ whitespaceCount;
								break;
							}
						}
					}
					else
					{
						// There are no words on the current line, but
						// we are not splitting.
						word = word.trim();
						result.add(word);
						currentLine = new StringBuilder();
						lineWidth = 0;
						// Increment char counter allowing for white 
						// space in the original word
						charCount = word.length() + whitespaceCount;
					}
				}
				else
				{
					// The current word does not take the total line width
					// over the allowed width. Append the word, removing
					// preceeding whitespace if it is the first word in the
					// line.
					if (lineWidth > 0)
					{
						currentLine = currentLine.append(word);
					}
					else
					{
						currentLine = currentLine.append(word.trim());
					}

					lineWidth += wordLength;
					charCount += word.length();
				}
			}

			result.add(currentLine.toString());
		}

		return result.toArray(new String[result.size()]);
	}

	/**
	 * Returns an mxRectangle with the size (width and height in pixels) of the
	 * given HTML markup.
	 * 
	 * @param markup
	 *            HTML markup whose size should be returned.
	 */
	public static mxRectangle getSizeForHtml(String markup,
			Map<String, Object> style, double scale, double wrapWidth)
	{
		mxLightweightLabel textRenderer = mxLightweightLabel
				.getSharedInstance();

		if (textRenderer != null)
		{
			// First run measures size with no wrapping
			textRenderer.setText(createHtmlDocument(style, markup));
			Dimension size = textRenderer.getPreferredSize();

			// Second run measures size with wrapping if required.
			// Note that this is only required because max-width
			// is not supported and we can't get the width of an
			// inner HTML element (or is this possible?).
			if (wrapWidth > 0)
			{
				textRenderer.setText(createHtmlDocument(
						style,
						markup,
						1,
						(int) Math.ceil(wrapWidth - mxConstants.LABEL_INSET
								* scale)));
				Dimension size2 = textRenderer.getPreferredSize();

				// Uses wrapped text size if any text was actually wrapped
				if (size2.width < size.width)
				{
					size = size2;
				}
			}

			return new mxRectangle(0, 0, size.width * scale, size.height
					* scale);
		}
		else
		{
			return getSizeForString(markup, getFont(style), scale);
		}
	}

	/**
	 * Function: arcToCurves
	 * 
	 * Converts the given arc to a series of curves.
	 */
	public static double[] arcToCurves(double x0, double y0, double r1,
			double r2, double angle, double largeArcFlag, double sweepFlag,
			double x, double y)
	{
		x -= x0;
		y -= y0;

		if (r1 == 0 || r2 == 0)
		{
			return new double[0];
		}

		double fS = sweepFlag;
		double psai = angle;
		r1 = Math.abs(r1);
		r2 = Math.abs(r2);
		double ctx = -x / 2;
		double cty = -y / 2;
		double cpsi = Math.cos(psai * Math.PI / 180);
		double spsi = Math.sin(psai * Math.PI / 180);
		double rxd = cpsi * ctx + spsi * cty;
		double ryd = -1 * spsi * ctx + cpsi * cty;
		double rxdd = rxd * rxd;
		double rydd = ryd * ryd;
		double r1x = r1 * r1;
		double r2y = r2 * r2;
		double lamda = rxdd / r1x + rydd / r2y;
		double sds;

		if (lamda > 1)
		{
			r1 = Math.sqrt(lamda) * r1;
			r2 = Math.sqrt(lamda) * r2;
			sds = 0;
		}
		else
		{
			double seif = 1;

			if (largeArcFlag == fS)
			{
				seif = -1;
			}

			sds = seif
					* Math.sqrt((r1x * r2y - r1x * rydd - r2y * rxdd)
							/ (r1x * rydd + r2y * rxdd));
		}

		double txd = sds * r1 * ryd / r2;
		double tyd = -1 * sds * r2 * rxd / r1;
		double tx = cpsi * txd - spsi * tyd + x / 2;
		double ty = spsi * txd + cpsi * tyd + y / 2;
		double rad = Math.atan2((ryd - tyd) / r2, (rxd - txd) / r1)
				- Math.atan2(0, 1);
		double s1 = (rad >= 0) ? rad : 2 * Math.PI + rad;
		rad = Math.atan2((-ryd - tyd) / r2, (-rxd - txd) / r1)
				- Math.atan2((ryd - tyd) / r2, (rxd - txd) / r1);
		double dr = (rad >= 0) ? rad : 2 * Math.PI + rad;

		if (fS == 0 && dr > 0)
		{
			dr -= 2 * Math.PI;
		}
		else if (fS != 0 && dr < 0)
		{
			dr += 2 * Math.PI;
		}

		double sse = dr * 2 / Math.PI;
		int seg = (int) Math.ceil(sse < 0 ? -1 * sse : sse);
		double segr = dr / seg;
		double t = 8 / 3 * Math.sin(segr / 4) * Math.sin(segr / 4)
				/ Math.sin(segr / 2);
		double cpsir1 = cpsi * r1;
		double cpsir2 = cpsi * r2;
		double spsir1 = spsi * r1;
		double spsir2 = spsi * r2;
		double mc = Math.cos(s1);
		double ms = Math.sin(s1);
		double x2 = -t * (cpsir1 * ms + spsir2 * mc);
		double y2 = -t * (spsir1 * ms - cpsir2 * mc);
		double x3 = 0;
		double y3 = 0;

		double[] result = new double[seg * 6];

		for (int n = 0; n < seg; ++n)
		{
			s1 += segr;
			mc = Math.cos(s1);
			ms = Math.sin(s1);

			x3 = cpsir1 * mc - spsir2 * ms + tx;
			y3 = spsir1 * mc + cpsir2 * ms + ty;
			double dx = -t * (cpsir1 * ms + spsir2 * mc);
			double dy = -t * (spsir1 * ms - cpsir2 * mc);

			// CurveTo updates x0, y0 so need to restore it
			int index = n * 6;
			result[index] = x2 + x0;
			result[index + 1] = y2 + y0;
			result[index + 2] = x3 - dx + x0;
			result[index + 3] = y3 - dy + y0;
			result[index + 4] = x3 + x0;
			result[index + 5] = y3 + y0;

			x2 = x3 + dx;
			y2 = y3 + dy;
		}

		return result;
	}

	/**
	 * Returns the bounding box for the rotated rectangle.
	 */
	public static mxRectangle getBoundingBox(mxRectangle rect, double rotation)
	{
		mxRectangle result = null;

		if (rect != null && rotation != 0)
		{
			double rad = Math.toRadians(rotation);
			double cos = Math.cos(rad);
			double sin = Math.sin(rad);

			mxPoint cx = new mxPoint(rect.getX() + rect.getWidth() / 2,
					rect.getY() + rect.getHeight() / 2);

			mxPoint p1 = new mxPoint(rect.getX(), rect.getY());
			mxPoint p2 = new mxPoint(rect.getX() + rect.getWidth(), rect.getY());
			mxPoint p3 = new mxPoint(p2.getX(), rect.getY() + rect.getHeight());
			mxPoint p4 = new mxPoint(rect.getX(), p3.getY());

			p1 = getRotatedPoint(p1, cos, sin, cx);
			p2 = getRotatedPoint(p2, cos, sin, cx);
			p3 = getRotatedPoint(p3, cos, sin, cx);
			p4 = getRotatedPoint(p4, cos, sin, cx);

			Rectangle tmp = new Rectangle((int) p1.getX(), (int) p1.getY(), 0,
					0);
			tmp.add(p2.getPoint());
			tmp.add(p3.getPoint());
			tmp.add(p4.getPoint());

			result = new mxRectangle(tmp);
		}
		else if (rect != null)
		{
			result = (mxRectangle) rect.clone();
		}

		return result;
	}

	/**
	 * Find the first character matching the input character in the given
	 * string where the character has no letter preceding it.
	 * 
	 * @param text the string to test for the presence of the input character
	 * @param inputChar the test character
	 * @param fromIndex the index position of the string to start from
	 * @return the position of the first character matching the input character
	 * 			in the given string where the character has no letter preceding it.
	 */
	public static int firstCharAt(String text, int inputChar, int fromIndex)
	{
		int result = 0;

		while (result >= 0)
		{
			result = text.indexOf(inputChar, fromIndex);

			if (result == 0)
			{
				return result;
			}
			else if (result > 0)
			{
				// Check there is a whitespace or symbol before the hit character
				if (Character.isLetter(text.codePointAt(result - 1)))
				{
					// The pre-increment is used in if and else branches.
					if (++fromIndex >= text.length())
					{
						return -1;
					}
					else
					{
						// Test again from next candidate character
						// This isn't the first letter of this word
						result = text.indexOf(inputChar, fromIndex);
					}
				}
				else
				{
					return result;
				}
			}

		}

		return result;
	}

	/**
	 * Rotates the given point by the given cos and sin.
	 */
	public static mxPoint getRotatedPoint(mxPoint pt, double cos, double sin)
	{
		return getRotatedPoint(pt, cos, sin, new mxPoint());
	}

	/**
	 * Finds the index of the nearest segment on the given cell state for the
	 * specified coordinate pair.
	 */
	public static int findNearestSegment(mxCellState state, double x, double y)
	{
		int index = -1;

		if (state.getAbsolutePointCount() > 0)
		{
			mxPoint last = state.getAbsolutePoint(0);
			double min = Double.MAX_VALUE;

			for (int i = 1; i < state.getAbsolutePointCount(); i++)
			{
				mxPoint current = state.getAbsolutePoint(i);
				double dist = new Line2D.Double(last.x, last.y, current.x,
						current.y).ptSegDistSq(x, y);

				if (dist < min)
				{
					min = dist;
					index = i - 1;
				}

				last = current;
			}
		}

		return index;
	}

	/**
	 * Rotates the given point by the given cos and sin.
	 */
	public static mxPoint getRotatedPoint(mxPoint pt, double cos, double sin,
			mxPoint c)
	{
		double x = pt.getX() - c.getX();
		double y = pt.getY() - c.getY();

		double x1 = x * cos - y * sin;
		double y1 = y * cos + x * sin;

		return new mxPoint(x1 + c.getX(), y1 + c.getY());
	}

	/**
	 * Returns an integer mask of the port constraints of the given map
	 * @param terminal the cached cell state of the cell to determine the
	 * 			port constraints for
	 * @param edge the edge connected to the constrained terminal
	 * @param source whether or not the edge specified is connected to the
	 * 			terminal specified at its source end
	 * @return the mask of port constraint directions
	 */
	public static int getPortConstraints(mxCellState terminal,
			mxCellState edge, boolean source)
	{
		return getPortConstraints(terminal, edge, source,
				mxConstants.DIRECTION_MASK_ALL);
	}

	/**
	 * Returns an integer mask of the port constraints of the given map
	 * @param terminal the cached cell state of the cell to determine the
	 * 			port constraints for
	 * @param edge the edge connected to the constrained terminal
	 * @param source whether or not the edge specified is connected to the
	 * 			terminal specified at its source end
	 * @param defaultValue Default value to return if the key is undefined.
	 * @return the mask of port constraint directions
	 */
	public static int getPortConstraints(mxCellState terminal,
			mxCellState edge, boolean source, int defaultValue)
	{
		Object value = terminal.getStyle().get(
				mxConstants.STYLE_PORT_CONSTRAINT);

		if (value == null)
		{
			return defaultValue;
		}
		else
		{
			String directions = value.toString();
			int returnValue = mxConstants.DIRECTION_MASK_NONE;

			if (directions.indexOf(mxConstants.DIRECTION_NORTH) >= 0)
			{
				returnValue |= mxConstants.DIRECTION_MASK_NORTH;
			}
			if (directions.indexOf(mxConstants.DIRECTION_WEST) >= 0)
			{
				returnValue |= mxConstants.DIRECTION_MASK_WEST;
			}
			if (directions.indexOf(mxConstants.DIRECTION_SOUTH) >= 0)
			{
				returnValue |= mxConstants.DIRECTION_MASK_SOUTH;
			}
			if (directions.indexOf(mxConstants.DIRECTION_EAST) >= 0)
			{
				returnValue |= mxConstants.DIRECTION_MASK_EAST;
			}

			return returnValue;
		}
	}

	public static int reversePortConstraints(int constraint)
	{
		int result = 0;

		result = (constraint & mxConstants.DIRECTION_MASK_WEST) << 3;
		result |= (constraint & mxConstants.DIRECTION_MASK_NORTH) << 1;
		result |= (constraint & mxConstants.DIRECTION_MASK_SOUTH) >> 1;
		result |= (constraint & mxConstants.DIRECTION_MASK_EAST) >> 3;

		return result;
	}

	/**
	 * Draws the image inside the clip bounds to the given graphics object.
	 */
	public static void drawImageClip(Graphics g, BufferedImage image,
			ImageObserver observer)
	{
		Rectangle clip = g.getClipBounds();

		if (clip != null)
		{
			int w = image.getWidth();
			int h = image.getHeight();

			int x = Math.max(0, Math.min(clip.x, w));
			int y = Math.max(0, Math.min(clip.y, h));

			w = Math.min(clip.width, w - x);
			h = Math.min(clip.height, h - y);

			if (w > 0 && h > 0)
			{
				// TODO: Support for normal images using fast subimage copies
				g.drawImage(image.getSubimage(x, y, w, h), clip.x, clip.y,
						observer);
			}
		}
		else
		{
			g.drawImage(image, 0, 0, observer);
		}
	}

	/**
	 * 
	 */
	public static void fillClippedRect(Graphics g, int x, int y, int width,
			int height)
	{
		Rectangle bg = new Rectangle(x, y, width, height);

		try
		{
			if (g.getClipBounds() != null)
			{
				bg = bg.intersection(g.getClipBounds());
			}
		}
		catch (Exception e)
		{
			log.log(Level.SEVERE, "Failed to compute intersection", e);
			// FIXME: Getting clipbounds sometimes throws an NPE
		}

		g.fillRect(bg.x, bg.y, bg.width, bg.height);
	}

	/**
	 * Creates a new list of new points obtained by translating the points in
	 * the given list by the given vector. Elements that are not mxPoints are
	 * added to the result as-is.
	 */
	public static List<mxPoint> translatePoints(List<mxPoint> pts, double dx,
			double dy)
	{
		List<mxPoint> result = null;

		if (pts != null)
		{
			result = new ArrayList<mxPoint>(pts.size());
			Iterator<mxPoint> it = pts.iterator();

			while (it.hasNext())
			{
				mxPoint point = (mxPoint) it.next().clone();

				point.setX(point.getX() + dx);
				point.setY(point.getY() + dy);

				result.add(point);
			}
		}

		return result;
	}

	/**
	 * Returns the intersection of two lines as an mxPoint.
	 * 
	 * @param x0
	 *            X-coordinate of the first line's startpoint.
	 * @param y0
	 *            Y-coordinate of the first line's startpoint.
	 * @param x1
	 *            X-coordinate of the first line's endpoint.
	 * @param y1
	 *            Y-coordinate of the first line's endpoint.
	 * @param x2
	 *            X-coordinate of the second line's startpoint.
	 * @param y2
	 *            Y-coordinate of the second line's startpoint.
	 * @param x3
	 *            X-coordinate of the second line's endpoint.
	 * @param y3
	 *            Y-coordinate of the second line's endpoint.
	 * @return Returns the intersection between the two lines.
	 */
	public static mxPoint intersection(double x0, double y0, double x1,
			double y1, double x2, double y2, double x3, double y3)
	{
		double denom = ((y3 - y2) * (x1 - x0)) - ((x3 - x2) * (y1 - y0));
		double nume_a = ((x3 - x2) * (y0 - y2)) - ((y3 - y2) * (x0 - x2));
		double nume_b = ((x1 - x0) * (y0 - y2)) - ((y1 - y0) * (x0 - x2));

		double ua = nume_a / denom;
		double ub = nume_b / denom;

		if (ua >= 0.0 && ua <= 1.0 && ub >= 0.0 && ub <= 1.0)
		{
			// Get the intersection point
			double intersectionX = x0 + ua * (x1 - x0);
			double intersectionY = y0 + ua * (y1 - y0);

			return new mxPoint(intersectionX, intersectionY);
		}

		// No intersection
		return null;
	}

	/**
	 * Sorts the given cells according to the order in the cell hierarchy.
	 */
	public static Object[] sortCells(Object[] cells, final boolean ascending)
	{
		return sortCells(Arrays.asList(cells), ascending).toArray();
	}

	/**
	 * Sorts the given cells according to the order in the cell hierarchy.
	 */
	public static Collection<Object> sortCells(Collection<Object> cells,
			final boolean ascending)
	{
		SortedSet<Object> result = new TreeSet<Object>(new Comparator<Object>()
		{
			public int compare(Object o1, Object o2)
			{
				int comp = mxCellPath.compare(mxCellPath.create((mxICell) o1),
						mxCellPath.create((mxICell) o2));

				return (comp == 0) ? 0 : (((comp > 0) == ascending) ? 1 : -1);
			}
		});

		result.addAll(cells);

		return result;
	}

	/**
	 * Returns true if the given array contains the given object.
	 */
	public static boolean contains(Object[] array, Object obj)
	{
		return indexOf(array, obj) >= 0;
	}

	/**
	 * Returns the index of the given object in the given array of -1 if the
	 * object is not contained in the array.
	 */
	public static int indexOf(Object[] array, Object obj)
	{
		if (obj != null && array != null)
		{
			for (int i = 0; i < array.length; i++)
			{
				if (array[i] == obj)
				{
					return i;
				}
			}
		}

		return -1;
	}

	/**
	 * Returns the stylename in a style of the form stylename[;key=value] or an
	 * empty string if the given style does not contain a stylename.
	 * 
	 * @param style
	 *            String of the form stylename[;key=value].
	 * @return Returns the stylename from the given formatted string.
	 * @deprecated Use <code>mxStyleUtils.getStylename(String)</code> (Jan 2012)
	 */
	public static String getStylename(String style)
	{
		return mxStyleUtils.getStylename(style);
	}

	/**
	 * Returns the stylenames in a style of the form stylename[;key=value] or an
	 * empty array if the given style does not contain any stylenames.
	 * 
	 * @param style
	 *            String of the form stylename[;stylename][;key=value].
	 * @return Returns the stylename from the given formatted string.
	 * @deprecated Use <code>mxStyleUtils.getStylenames(String)</code> (Jan 2012)
	 */
	public static String[] getStylenames(String style)
	{
		return mxStyleUtils.getStylenames(style);
	}

	/**
	 * Returns the index of the given stylename in the given style. This returns
	 * -1 if the given stylename does not occur (as a stylename) in the given
	 * style, otherwise it returns the index of the first character.
	 * @deprecated Use <code>mxStyleUtils.indexOfStylename(String, String)</code> (Jan 2012)
	 */
	public static int indexOfStylename(String style, String stylename)
	{
		return mxStyleUtils.indexOfStylename(style, stylename);
	}

	/**
	 * Removes all stylenames from the given style and returns the updated
	 * style.
	 * @deprecated Use <code>mxStyleUtils.removeAllStylenames(String)</code> (Jan 2012)
	 */
	public static String removeAllStylenames(String style)
	{
		return mxStyleUtils.removeAllStylenames(style);
	}

	/**
	 * Assigns the value for the given key in the styles of the given cells, or
	 * removes the key from the styles if the value is null.
	 * 
	 * @param model
	 *            Model to execute the transaction in.
	 * @param cells
	 *            Array of cells to be updated.
	 * @param key
	 *            Key of the style to be changed.
	 * @param value
	 *            New value for the given key.
	 * @deprecated Use <code>mxStyleUtils.setCellStyles(mxIGraphModel, Object[], String, String)</code> (Jan 2012)
	 */
	public static void setCellStyles(mxIGraphModel model, Object[] cells,
			String key, String value)
	{
		mxStyleUtils.setCellStyles(model, cells, key, value);
	}

	/**
	 * Adds or removes the given key, value pair to the style and returns the
	 * new style. If value is null or zero length then the key is removed from
	 * the style.
	 * 
	 * @param style
	 *            String of the form <code>stylename[;key=value]</code>.
	 * @param key
	 *            Key of the style to be changed.
	 * @param value
	 *            New value for the given key.
	 * @return Returns the new style.
	 * @deprecated Use <code>mxStyleUtils.setStyle(String, String, String)</code> (Jan 2012)
	 */
	public static String setStyle(String style, String key, String value)
	{
		return mxStyleUtils.setStyle(style, key, value);
	}

	/**
	 * Sets or toggles the flag bit for the given key in the cell's styles. If
	 * value is null then the flag is toggled.
	 * 
	 * <code>
	 * mxUtils.setCellStyleFlags(graph.getModel(),
	 * 			cells,
	 * 			mxConstants.STYLE_FONTSTYLE,
	 * 			mxConstants.FONT_BOLD, null);
	 * </code>
	 * 
	 * Toggles the bold font style.
	 * 
	 * @param model
	 *            Model that contains the cells.
	 * @param cells
	 *            Array of cells to change the style for.
	 * @param key
	 *            Key of the style to be changed.
	 * @param flag
	 *            Integer for the bit to be changed.
	 * @param value
	 *            Optional boolean value for the flag.
	 * @deprecated Use <code>mxStyleUtils.setCellStyleFlags(mxIGraphModel, Object[],String, int, Boolean)</code> (Jan 2012)
	 */
	public static void setCellStyleFlags(mxIGraphModel model, Object[] cells,
			String key, int flag, Boolean value)
	{
		mxStyleUtils.setCellStyleFlags(model, cells, key, flag, value);
	}

	/**
	 * Sets or removes the given key from the specified style and returns the
	 * new style. If value is null then the flag is toggled.
	 * 
	 * @param style
	 *            String of the form stylename[;key=value].
	 * @param key
	 *            Key of the style to be changed.
	 * @param flag
	 *            Integer for the bit to be changed.
	 * @param value
	 *            Optional boolean value for the given flag.
	 * @deprecated Use <code>mxStyleUtils.setStyleFlag(String, String, int, Boolean)</code> (Jan 2012)
	 */
	public static String setStyleFlag(String style, String key, int flag,
			Boolean value)
	{
		return mxStyleUtils.setStyleFlag(style, key, flag, value);
	}

	public static boolean intersectsHotspot(mxCellState state, int x, int y,
			double hotspot)
	{
		return intersectsHotspot(state, x, y, hotspot, 0, 0);
	}

	/**
	 * Returns true if the given coordinate pair intersects the hotspot of the
	 * given state.
	 */
	public static boolean intersectsHotspot(mxCellState state, int x, int y,
			double hotspot, int min, int max)
	{
		if (hotspot > 0)
		{
			int cx = (int) Math.round(state.getCenterX());
			int cy = (int) Math.round(state.getCenterY());
			int width = (int) Math.round(state.getWidth());
			int height = (int) Math.round(state.getHeight());

			if (mxUtils
					.getString(state.getStyle(), mxConstants.STYLE_SHAPE, "")
					.equals(mxConstants.SHAPE_SWIMLANE))
			{
				int start = mxUtils.getInt(state.getStyle(),
						mxConstants.STYLE_STARTSIZE,
						mxConstants.DEFAULT_STARTSIZE);

				if (mxUtils.isTrue(state.getStyle(),
						mxConstants.STYLE_HORIZONTAL, true))
				{
					cy = (int) Math.round(state.getY() + start / 2);
					height = start;
				}
				else
				{
					cx = (int) Math.round(state.getX() + start / 2);
					width = start;
				}
			}

			int w = (int) Math.max(min, width * hotspot);
			int h = (int) Math.max(min, height * hotspot);

			if (max > 0)
			{
				w = Math.min(w, max);
				h = Math.min(h, max);
			}

			Rectangle rect = new Rectangle(Math.round(cx - w / 2),
					Math.round(cy - h / 2), w, h);

			return rect.contains(x, y);
		}

		return true;
	}

	/**
	 * Returns true if the dictionary contains true for the given key or false
	 * if no value is defined for the key.
	 * 
	 * @param dict
	 *            Dictionary that contains the key, value pairs.
	 * @param key
	 *            Key whose value should be returned.
	 * @return Returns the boolean value for key in dict.
	 */
	public static boolean isTrue(Map<String, Object> dict, String key)
	{
		return isTrue(dict, key, false);
	}

	/**
	 * Returns true if the dictionary contains true for the given key or the
	 * given default value if no value is defined for the key.
	 * 
	 * @param dict
	 *            Dictionary that contains the key, value pairs.
	 * @param key
	 *            Key whose value should be returned.
	 * @param defaultValue
	 *            Default value to return if the key is undefined.
	 * @return Returns the boolean value for key in dict.
	 */
	public static boolean isTrue(Map<String, Object> dict, String key,
			boolean defaultValue)
	{
		Object value = dict.get(key);

		if (value == null)
		{
			return defaultValue;
		}
		else
		{
			return value.equals("1")
					|| value.toString().toLowerCase().equals("true");
		}
	}

	/**
	 * Returns the value for key in dictionary as an int or 0 if no value is
	 * defined for the key.
	 * 
	 * @param dict
	 *            Dictionary that contains the key, value pairs.
	 * @param key
	 *            Key whose value should be returned.
	 * @return Returns the integer value for key in dict.
	 */
	public static int getInt(Map<String, Object> dict, String key)
	{
		return getInt(dict, key, 0);
	}

	/**
	 * Returns the value for key in dictionary as an int or the given default
	 * value if no value is defined for the key.
	 * 
	 * @param dict
	 *            Dictionary that contains the key, value pairs.
	 * @param key
	 *            Key whose value should be returned.
	 * @param defaultValue
	 *            Default value to return if the key is undefined.
	 * @return Returns the integer value for key in dict.
	 */
	public static int getInt(Map<String, Object> dict, String key,
			int defaultValue)
	{
		Object value = dict.get(key);

		if (value == null)
		{
			return defaultValue;
		}
		else
		{
			// Handles commas by casting them to an int
			return (int) Float.parseFloat(value.toString());
		}
	}

	/**
	 * Returns the value for key in dictionary as a float or 0 if no value is
	 * defined for the key.
	 * 
	 * @param dict
	 *            Dictionary that contains the key, value pairs.
	 * @param key
	 *            Key whose value should be returned.
	 * @return Returns the float value for key in dict.
	 */
	public static float getFloat(Map<String, Object> dict, String key)
	{
		return getFloat(dict, key, 0);
	}

	/**
	 * Returns the value for key in dictionary as a float or the given default
	 * value if no value is defined for the key.
	 * 
	 * @param dict
	 *            Dictionary that contains the key, value pairs.
	 * @param key
	 *            Key whose value should be returned.
	 * @param defaultValue
	 *            Default value to return if the key is undefined.
	 * @return Returns the float value for key in dict.
	 */
	public static float getFloat(Map<String, Object> dict, String key,
			float defaultValue)
	{
		Object value = dict.get(key);

		if (value == null)
		{
			return defaultValue;
		}
		else
		{
			return Float.parseFloat(value.toString());
		}
	}

	/**
	 * Returns the value for key in dictionary as a float array or the given default
	 * value if no value is defined for the key.
	 * 
	 * @param dict
	 *            Dictionary that contains the key, value pairs.
	 * @param key
	 *            Key whose value should be returned.
	 * @param defaultValue
	 *            Default value to return if the key is undefined.
	 * @return Returns the float array value for key in dict.
	 */
	public static float[] getFloatArray(Map<String, Object> dict, String key,
			float[] defaultValue)
	{
		return getFloatArray(dict, key, defaultValue, ",");
	}

	/**
	 * Returns the value for key in dictionary as a float array or the given default
	 * value if no value is defined for the key.
	 * 
	 * @param dict
	 *            Dictionary that contains the key, value pairs.
	 * @param key
	 *            Key whose value should be returned.
	 * @param defaultValue
	 *            Default value to return if the key is undefined.
	 * @return Returns the float array value for key in dict.
	 */
	public static float[] getFloatArray(Map<String, Object> dict, String key,
			float[] defaultValue, String separator)
	{
		Object value = dict.get(key);

		if (value == null)
		{
			return defaultValue;
		}
		else
		{
			String[] floatChars = value.toString().split(separator);
			float[] result = new float[floatChars.length];

			for (int i = 0; i < floatChars.length; i++)
			{
				result[i] = Float.parseFloat(floatChars[i]);
			}

			return result;
		}
	}

	/**
	 * Returns the value for key in dictionary as a double or 0 if no value is
	 * defined for the key.
	 * 
	 * @param dict
	 *            Dictionary that contains the key, value pairs.
	 * @param key
	 *            Key whose value should be returned.
	 * @return Returns the double value for key in dict.
	 */
	public static double getDouble(Map<String, Object> dict, String key)
	{
		return getDouble(dict, key, 0);
	}

	/**
	 * Returns the value for key in dictionary as a double or the given default
	 * value if no value is defined for the key.
	 * 
	 * @param dict
	 *            Dictionary that contains the key, value pairs.
	 * @param key
	 *            Key whose value should be returned.
	 * @param defaultValue
	 *            Default value to return if the key is undefined.
	 * @return Returns the double value for key in dict.
	 */
	public static double getDouble(Map<String, Object> dict, String key,
			double defaultValue)
	{
		Object value = dict.get(key);

		if (value == null)
		{
			return defaultValue;
		}
		else
		{
			return Double.parseDouble(value.toString());
		}
	}

	/**
	 * Returns the value for key in dictionary as a string or null if no value
	 * is defined for the key.
	 * 
	 * @param dict
	 *            Dictionary that contains the key, value pairs.
	 * @param key
	 *            Key whose value should be returned.
	 * @return Returns the string value for key in dict.
	 */
	public static String getString(Map<String, Object> dict, String key)
	{
		return getString(dict, key, null);
	}

	/**
	 * Returns the value for key in dictionary as a string or the given default
	 * value if no value is defined for the key.
	 * 
	 * @param dict
	 *            Dictionary that contains the key, value pairs.
	 * @param key
	 *            Key whose value should be returned.
	 * @param defaultValue
	 *            Default value to return if the key is undefined.
	 * @return Returns the string value for key in dict.
	 */
	public static String getString(Map<String, Object> dict, String key,
			String defaultValue)
	{
		Object value = dict.get(key);

		if (value == null)
		{
			return defaultValue;
		}
		else
		{
			return value.toString();
		}
	}

	/**
	 * Returns the value for key in dictionary as a color or null if no value is
	 * defined for the key.
	 * 
	 * @param dict
	 *            Dictionary that contains the key, value pairs.
	 * @param key
	 *            Key whose value should be returned.
	 * @return Returns the color value for key in dict.
	 */
	public static Color getColor(Map<String, Object> dict, String key)
	{
		return getColor(dict, key, null);
	}

	/**
	 * Returns the value for key in dictionary as a color or the given default
	 * value if no value is defined for the key.
	 * 
	 * @param dict
	 *            Dictionary that contains the key, value pairs.
	 * @param key
	 *            Key whose value should be returned.
	 * @param defaultValue
	 *            Default value to return if the key is undefined.
	 * @return Returns the color value for key in dict.
	 */
	public static Color getColor(Map<String, Object> dict, String key,
			Color defaultValue)
	{
		Object value = dict.get(key);

		if (value == null)
		{
			return defaultValue;
		}
		else
		{
			return parseColor(value.toString());
		}
	}

	/**
	 * 
	 */
	public static Font getFont(Map<String, Object> style)
	{
		return getFont(style, 1);
	}

	/**
	 * 
	 */
	public static Font getFont(Map<String, Object> style, double scale)
	{
		String fontFamily = getString(style, mxConstants.STYLE_FONTFAMILY,
				mxConstants.DEFAULT_FONTFAMILY);
		int fontSize = getInt(style, mxConstants.STYLE_FONTSIZE,
				mxConstants.DEFAULT_FONTSIZE);
		int fontStyle = getInt(style, mxConstants.STYLE_FONTSTYLE);

		int swingFontStyle = ((fontStyle & mxConstants.FONT_BOLD) == mxConstants.FONT_BOLD) ? Font.BOLD
				: Font.PLAIN;
		swingFontStyle += ((fontStyle & mxConstants.FONT_ITALIC) == mxConstants.FONT_ITALIC) ? Font.ITALIC
				: Font.PLAIN;
		
		//https://github.com/elonderin/jgraphx/commit/c1c9b0ca7dee2b1e7ace0b0e88c3c06135bf236c
		Map<TextAttribute, Object> fontAttributes = new HashMap<>();
		
	    if ((fontStyle & mxConstants.FONT_UNDERLINE) == mxConstants.FONT_UNDERLINE)
	    {
	    	fontAttributes.put(TextAttribute.UNDERLINE, TextAttribute.UNDERLINE_ON);
	    }
	    
	    if ((fontStyle & mxConstants.FONT_STRIKETHROUGH) == mxConstants.FONT_STRIKETHROUGH) 
	    {
	    	fontAttributes.put(TextAttribute.STRIKETHROUGH, TextAttribute.STRIKETHROUGH_ON);
	    }
		
		return new Font(fontFamily, swingFontStyle, (int) (fontSize * scale)).deriveFont(fontAttributes);
	}

	/**
	 * 
	 */
	public static String hexString(Color color)
	{
		return mxHtmlColor.hexString(color);
	}
	
	/**
	 * Shortcut for parseColor with no transparency.
	 */
	public static Color parseColor(String colorString)
			throws NumberFormatException
	{
		return mxHtmlColor.parseColor(colorString);
	}

	/**
	 * Convert a string representing a 24/32bit hex color value into a Color
	 * object. The following color names are also supported: white, black, red,
	 * green, blue, orange, yellow, pink, turquoise, gray and none (null).
	 * Examples of possible hex color values are: #C3D9FF, #6482B9 and #774400,
	 * but note that you do not include the "#" in the string passed in
	 * 
	 * @param colorString
	 *            the 24/32bit hex string value (ARGB)
	 * @return java.awt.Color (24bit RGB on JDK 1.1, 24/32bit ARGB on JDK1.2)
	 * @exception NumberFormatException
	 *                if the specified string cannot be interpreted as a
	 *                hexidecimal integer
	 */
	public static Color parseColor(String colorString, double alpha)
			throws NumberFormatException
	{
		return mxHtmlColor.parseColor(colorString, alpha);
	};

	/**
	 * Returns a hex representation for the given color.
	 * 
	 * @param color
	 *            Color to return the hex string for.
	 * @return Returns a hex string for the given color.
	 */
	public static String getHexColorString(Color color)
	{
		return mxHtmlColor.getHexColorString(color);
	}

	/**
	 * Convert a string representing a dash pattern into a float array.
	 * A valid dash pattern is a string of dash widths (floating point values)
	 * separated by space characters.
	 * 
	 * @param dashPatternString
	 *            the string representing the dash pattern
	 * @return float[]
	 * @exception NumberFormatException
	 *                if any of the dash widths cannot be interpreted as a
	 *                floating point number
	 */
	public static float[] parseDashPattern(String dashPatternString)
			throws NumberFormatException
	{
		if (dashPatternString != null && dashPatternString.length() > 0)
		{
			String[] tokens = dashPatternString.split(" ");
			float[] dashpattern = new float[tokens.length];
			float dashWidth;

			for (int i = 0; i < tokens.length; i++)
			{
				dashWidth = (float) (Float.parseFloat(tokens[i]));

				if (dashWidth > 0)
				{
					dashpattern[i] = dashWidth;
				}
				else
				{
					throw new NumberFormatException(
							"Dash width must be positive");
				}
			}

			return dashpattern;
		}
		return null;
	}

	/**
	 * Reads the given filename into a string.
	 * 
	 * @param filename
	 *            Name of the file to be read.
	 * @return Returns a string representing the file contents.
	 * @throws IOException
	 */
	public static String readFile(String filename) throws IOException
	{
		return readInputStream(new FileInputStream(filename));
	}

	/**
	 * Reads the given filename into a string.
	 * 
	 * @param filename
	 *            Name of the file to be read.
	 * @return Returns a string representing the file contents.
	 * @throws IOException
	 */
	public static String readInputStream(InputStream stream) throws IOException
	{
		BufferedReader reader = new BufferedReader(
				new InputStreamReader(stream));
		StringBuffer result = new StringBuffer();
		String tmp = reader.readLine();

		while (tmp != null)
		{
			result.append(tmp + "\n");
			tmp = reader.readLine();
		}

		reader.close();

		return result.toString();
	}

	/**
	 * Writes the given string into the given file.
	 * 
	 * @param contents
	 *            String representing the file contents.
	 * @param filename
	 *            Name of the file to be written.
	 * @throws IOException
	 */
	public static void writeFile(String contents, String filename)
			throws IOException
	{
		FileWriter fw = new FileWriter(filename);
		fw.write(contents);
		fw.flush();
		fw.close();
	}

	/**
	 * Returns the Md5 hash for the given text.
	 * 
	 * @param text
	 *            String whose Md5 hash should be returned.
	 * @return Returns the Md5 hash for the given text.
	 */
	public static String getMd5Hash(String text)
	{
		StringBuffer result = new StringBuffer(32);
		try
		{
			MessageDigest md5 = MessageDigest.getInstance("MD5");
			md5.update(text.getBytes());
			Formatter f = new Formatter(result);
			byte[] digest = md5.digest();

			for (int i = 0; i < digest.length; i++)
			{
				f.format("%02x", new Object[] { new Byte(digest[i]) });
			}
			
			f.close();
		}
		catch (NoSuchAlgorithmException ex)
		{
			log.log(Level.SEVERE, "Failed to compute MD5 hash", ex);
		}

		return result.toString();
	}

	/**
	 * Returns true if the user object is an XML node with the specified type
	 * and and the optional attribute has the specified value or is not
	 * specified.
	 * 
	 * @param value
	 *            Object that should be examined as a node.
	 * @param nodeName
	 *            String that specifies the node name.
	 * @return Returns true if the node name of the user object is equal to the
	 *         given type.
	 */

	public static boolean isNode(Object value, String nodeName)
	{
		return isNode(value, nodeName, null, null);
	}

	/**
	 * Returns true if the given value is an XML node with the node name and if
	 * the optional attribute has the specified value.
	 * 
	 * @param value
	 *            Object that should be examined as a node.
	 * @param nodeName
	 *            String that specifies the node name.
	 * @param attributeName
	 *            Optional attribute name to check.
	 * @param attributeValue
	 *            Optional attribute value to check.
	 * @return Returns true if the value matches the given conditions.
	 */
	public static boolean isNode(Object value, String nodeName,
			String attributeName, String attributeValue)
	{
		if (value instanceof Element)
		{
			Element element = (Element) value;

			if (nodeName == null
					|| element.getNodeName().equalsIgnoreCase(nodeName))
			{
				String tmp = (attributeName != null) ? element
						.getAttribute(attributeName) : null;

				return attributeName == null
						|| (tmp != null && tmp.equals(attributeValue));
			}
		}

		return false;
	}

	/**
	 * 
	 * @param g
	 * @param antiAlias
	 * @param textAntiAlias
	 */
	public static void setAntiAlias(Graphics2D g, boolean antiAlias,
			boolean textAntiAlias)
	{
		g.setRenderingHint(RenderingHints.KEY_RENDERING,
				(antiAlias) ? RenderingHints.VALUE_RENDER_QUALITY
						: RenderingHints.VALUE_RENDER_SPEED);
		g.setRenderingHint(RenderingHints.KEY_ANTIALIASING,
				(antiAlias) ? RenderingHints.VALUE_ANTIALIAS_ON
						: RenderingHints.VALUE_ANTIALIAS_OFF);
		g.setRenderingHint(RenderingHints.KEY_TEXT_ANTIALIASING,
				(textAntiAlias) ? RenderingHints.VALUE_TEXT_ANTIALIAS_ON
						: RenderingHints.VALUE_TEXT_ANTIALIAS_OFF);
	}

	/**
	 * Clears the given area of the specified graphics object with the given
	 * color or makes the region transparent.
	 */
	public static void clearRect(Graphics2D g, Rectangle rect, Color background)
	{
		if (background != null)
		{
			g.setColor(background);
			g.fillRect(rect.x, rect.y, rect.width, rect.height);
		}
		else
		{
			g.setComposite(AlphaComposite.getInstance(AlphaComposite.CLEAR,
					0.0f));
			g.fillRect(rect.x, rect.y, rect.width, rect.height);
			g.setComposite(AlphaComposite.SrcOver);
		}
	}
	
	/**
	 * Creates a buffered image for the given parameters. If there is not enough
	 * memory to create the image then a OutOfMemoryError is thrown.
	 */
	public static BufferedImage createBufferedImage(int w, int h,
			Color background)
	{
		return mxUtils.createBufferedImage(w, h, background, (background != null) ? BufferedImage.TYPE_INT_RGB
				: BufferedImage.TYPE_INT_ARGB);
	}
	
	/**
	 * Creates a buffered image for the given parameters. If there is not enough
	 * memory to create the image then a OutOfMemoryError is thrown.
	 */
	public static BufferedImage createBufferedImage(int w, int h,
			Color background, int type)
	{
		BufferedImage result = null;

		if (w > 0 && h > 0)
		{
			result = new BufferedImage(w, h, type);

			// Clears background
			if (background != null)
			{
				Graphics2D g2 = result.createGraphics();
				clearRect(g2, new Rectangle(w, h), background);
				g2.dispose();
			}
		}

		return result;
	}

	/**
	 * Loads an image from the local filesystem, a data URI or any other URL.
	 */
	public static BufferedImage loadImage(String url)
	{
		BufferedImage img = null;

		if (url != null)
		{
			// Parses data URIs of the form data:image/format;base64,xxx
			if (url.startsWith("data:image/"))
			{
				try
				{
					int comma = url.indexOf(',');
					byte[] data = mxBase64.decode(url.substring(comma + 1));
					ByteArrayInputStream is = new ByteArrayInputStream(data);
					img = ImageIO.read(is);
				}
				catch (Exception e)
				{
					log.log(Level.SEVERE, "Failed to load a data URI image", e);
				}
			}
			else
			{
				URL realUrl = null;

				try
				{
					realUrl = new URL(url);
				}
				catch (Exception e)
				{
					realUrl = mxUtils.class.getResource(url);
				}

				if (realUrl != null)
				{
					try
					{
						img = ImageIO.read(realUrl);
					}
					catch (Exception e1)
					{
						log.log(Level.SEVERE, "Failed to read the image from " + realUrl, e1);
					}
				}
				else
				{
					log.log(Level.SEVERE, "Failed to load image from " + url);
				}
			}
		}

		return img;
	}

	/**
	 * Creates a table for the given text using the given document to create the
	 * DOM nodes. Returns the outermost table node.
	 */
	public static Element createTable(Document document, String text, int x,
			int y, int w, int h, double scale, Map<String, Object> style)
	{
		// Does not use a textbox as this must go inside another VML shape
		Element table = document.createElement("table");

		if (text != null && text.length() > 0)
		{
			Element tr = document.createElement("tr");
			Element td = document.createElement("td");

			table.setAttribute("cellspacing", "0");
			table.setAttribute("border", "0");
			td.setAttribute("align", mxUtils.getString(style,
					mxConstants.STYLE_ALIGN, mxConstants.ALIGN_CENTER));

			String fontColor = getString(style, mxConstants.STYLE_FONTCOLOR,
					"black");
			String fontFamily = getString(style, mxConstants.STYLE_FONTFAMILY,
					mxConstants.DEFAULT_FONTFAMILIES);
			int fontSize = (int) (getInt(style, mxConstants.STYLE_FONTSIZE,
					mxConstants.DEFAULT_FONTSIZE) * scale);

			String s = "position:absolute;" + "left:" + String.valueOf(x)
					+ "px;" + "top:" + String.valueOf(y) + "px;" + "width:"
					+ String.valueOf(w) + "px;" + "height:" + String.valueOf(h)
					+ "px;" + "font-size:" + String.valueOf(fontSize) + "px;"
					+ "font-family:" + fontFamily + ";" + "color:" + fontColor
					+ ";";

			if (mxUtils.getString(style, mxConstants.STYLE_WHITE_SPACE,
					"nowrap").equals("wrap"))
			{
				s += "white-space:normal;";
			}

			// Applies the background color
			String background = getString(style,
					mxConstants.STYLE_LABEL_BACKGROUNDCOLOR);

			if (background != null)
			{
				s += "background:" + background + ";";
			}

			// Applies the border color
			String border = getString(style,
					mxConstants.STYLE_LABEL_BORDERCOLOR);

			if (border != null)
			{
				s += "border:" + border + " solid 1pt;";
			}

			// Applies the opacity
			float opacity = getFloat(style, mxConstants.STYLE_TEXT_OPACITY, 100);

			if (opacity < 100)
			{
				// Adds all rules (first for IE)
				s += "filter:alpha(opacity=" + opacity + ");";
				s += "opacity:" + (opacity / 100) + ";";
			}

			td.setAttribute("style", s);
			String[] lines = text.split("\n");

			for (int i = 0; i < lines.length; i++)
			{
				td.appendChild(document.createTextNode(lines[i]));
				td.appendChild(document.createElement("br"));
			}

			tr.appendChild(td);
			table.appendChild(tr);
		}

		return table;
	}

	/**
	 * Returns a new, empty DOM document.
	 * 
	 * @return Returns a new DOM document.
	 * @deprecated Use <code>mxDomUtils.createDocument</code> (Jan 2012)
	 */
	public static Document createDocument()
	{
		return mxDomUtils.createDocument();
	}

	/**
	 * Creates a new SVG document for the given width and height.
	 * @deprecated Use <code>mxDomUtils.createSvgDocument(int, int)</code> (Jan 2012)
	 */
	public static Document createSvgDocument(int width, int height)
	{
		return mxDomUtils.createSvgDocument(width, height);
	}

	/**
	 * 
	 * @deprecated Use <code>mxDomUtils.createVmlDocument</code> (Jan 2012)
	 */
	public static Document createVmlDocument()
	{
		return mxDomUtils.createVmlDocument();
	}

	/**
	 * Returns a document with a HTML node containing a HEAD and BODY node.
	 * @deprecated Use <code>mxDomUtils.createHtmlDocument</code> (Jan 2012)
	 */
	public static Document createHtmlDocument()
	{
		return mxDomUtils.createHtmlDocument();
	}

	/**
	 * Returns a new, empty DOM document.
	 * 
	 * @return Returns a new DOM document.
	 */
	public static String createHtmlDocument(Map<String, Object> style,
			String text)
	{
		return createHtmlDocument(style, text, 1, 0);
	}

	/**
	 * Returns a new, empty DOM document.
	 * 
	 * @return Returns a new DOM document.
	 */
	public static String createHtmlDocument(Map<String, Object> style,
			String text, double scale)
	{
		return createHtmlDocument(style, text, scale, 0);
	}

	/**
	 * Returns a new, empty DOM document.
	 * 
	 * @return Returns a new DOM document.
	 */
	public static String createHtmlDocument(Map<String, Object> style,
			String text, double scale, int width)
	{
		return createHtmlDocument(style, text, scale, width, null);
	}

	/**
	 * Returns a new, empty DOM document. The head argument can be used to
	 * provide an optional HEAD section without the HEAD tags as follows:
	 * 
	 * <pre>
	 * mxUtils.createHtmlDocument(style,  text, 1, 0, "<style type=\"text/css\">.classname { color:red; }</style>")
	 * </pre>
	 * 
	 * @return Returns a new DOM document.
	 */
	public static String createHtmlDocument(Map<String, Object> style,
			String text, double scale, int width, String head)
	{
		return createHtmlDocument(style, text, scale, width, null, null);
	};

	/**
	 * Returns a new, empty DOM document. The head argument can be used to
	 * provide an optional HEAD section without the HEAD tags as follows:
	 * 
	 * <pre>
	 * mxUtils.createHtmlDocument(style,  text, 1, 0, "<style type=\"text/css\">.classname { color:red; }</style>")
	 * </pre>
	 * 
	 * @return Returns a new DOM document.
	 */
	public static String createHtmlDocument(Map<String, Object> style,
			String text, double scale, int width, String head, String bodyCss)
	{
		StringBuffer css = (bodyCss != null) ? new StringBuffer(bodyCss)
				: new StringBuffer();
		css.append("font-family:"
				+ getString(style, mxConstants.STYLE_FONTFAMILY,
						mxConstants.DEFAULT_FONTFAMILIES) + ";");
		css.append("font-size:"
				+ (int) (getInt(style, mxConstants.STYLE_FONTSIZE,
						mxConstants.DEFAULT_FONTSIZE) * scale) + "pt;");

		String color = mxUtils.getString(style, mxConstants.STYLE_FONTCOLOR);

		if (color != null)
		{
			css.append("color:" + color + ";");
		}

		int fontStyle = mxUtils.getInt(style, mxConstants.STYLE_FONTSTYLE);

		if ((fontStyle & mxConstants.FONT_BOLD) == mxConstants.FONT_BOLD)
		{
			css.append("font-weight:bold;");
		}

		if ((fontStyle & mxConstants.FONT_ITALIC) == mxConstants.FONT_ITALIC)
		{
			css.append("font-style:italic;");
		}

		String txtDecor = "";
		
		if ((fontStyle & mxConstants.FONT_UNDERLINE) == mxConstants.FONT_UNDERLINE)
	    {
			txtDecor = "underline";
	    }
	    
	    if ((fontStyle & mxConstants.FONT_STRIKETHROUGH) == mxConstants.FONT_STRIKETHROUGH) 
	    {
	    	txtDecor += " line-through";
	    }

	    if (txtDecor.length() > 0)
	    {
	    	css.append("text-decoration: " + txtDecor + ";");
	    }
	    
		String align = getString(style, mxConstants.STYLE_ALIGN,
				mxConstants.ALIGN_LEFT);

		if (align.equals(mxConstants.ALIGN_CENTER))
		{
			css.append("text-align:center;");
		}
		else if (align.equals(mxConstants.ALIGN_RIGHT))
		{
			css.append("text-align:right;");
		}

		if (width > 0)
		{
			// LATER: With max-width support, wrapped text can be measured in 1 step
			css.append("width:" + width + "pt;");
		}

		String result = "<html>";

		if (head != null)
		{
			result += "<head>" + head + "</head>";
		}

		return result + "<body style=\"" + css.toString() + "\">" + text
				+ "</body></html>";
	}

	/**
	 * Returns a new, empty DOM document.
	 * 
	 * @return Returns a new DOM document.
	 */
	public static HTMLDocument createHtmlDocumentObject(
			Map<String, Object> style, double scale)
	{
		// Applies the font settings
		HTMLDocument document = new HTMLDocument();

		StringBuffer rule = new StringBuffer("body {");
		rule.append("font-family:"
				+ getString(style, mxConstants.STYLE_FONTFAMILY,
						mxConstants.DEFAULT_FONTFAMILIES) + ";");
		rule.append("font-size:"
				+ (int) (getInt(style, mxConstants.STYLE_FONTSIZE,
						mxConstants.DEFAULT_FONTSIZE) * scale) + "pt;");

		String color = mxUtils.getString(style, mxConstants.STYLE_FONTCOLOR);

		if (color != null)
		{
			rule.append("color:" + color + ";");
		}

		int fontStyle = mxUtils.getInt(style, mxConstants.STYLE_FONTSTYLE);

		if ((fontStyle & mxConstants.FONT_BOLD) == mxConstants.FONT_BOLD)
		{
			rule.append("font-weight:bold;");
		}

		if ((fontStyle & mxConstants.FONT_ITALIC) == mxConstants.FONT_ITALIC)
		{
			rule.append("font-style:italic;");
		}

		String txtDecor = "";
		
		if ((fontStyle & mxConstants.FONT_UNDERLINE) == mxConstants.FONT_UNDERLINE)
	    {
			txtDecor = "underline";
	    }
	    
	    if ((fontStyle & mxConstants.FONT_STRIKETHROUGH) == mxConstants.FONT_STRIKETHROUGH) 
	    {
	    	txtDecor += " line-through";
	    }

	    if (txtDecor.length() > 0)
	    {
	    	rule.append("text-decoration: " + txtDecor + ";");
	    }
	    
		String align = getString(style, mxConstants.STYLE_ALIGN,
				mxConstants.ALIGN_LEFT);

		if (align.equals(mxConstants.ALIGN_CENTER))
		{
			rule.append("text-align:center;");
		}
		else if (align.equals(mxConstants.ALIGN_RIGHT))
		{
			rule.append("text-align:right;");
		}

		rule.append("}");
		document.getStyleSheet().addRule(rule.toString());

		return document;
	}

	/**
	 * Returns a new DOM document for the given URI. External entities and DTDs are ignored.
	 * 
	 * @param uri
	 *            URI to parse into the document.
	 * @return Returns a new DOM document for the given URI.
	 */
	public static Document loadDocument(String uri)
	{
		try
		{
			return mxXmlUtils.getDocumentBuilder().parse(uri);
		}
		catch (Exception e)
		{
			log.log(Level.SEVERE, "Failed to load the document from " + uri, e);
		}
		
		return null;
	}

	/**
	 * Returns a new document for the given XML string.
	 * 
	 * @param xml
	 *            String that represents the XML data.
	 * @return Returns a new XML document.
	 * @deprecated Use <code>mxXmlUtils.parseXml</code> (Jan 2012)
	 */
	public static Document parseXml(String xml)
	{
		return mxXmlUtils.parseXml(xml);
	}

	/**
	 * Evaluates a Java expression as a class member using mxCodecRegistry. The
	 * range of supported expressions is limited to static class members such as
	 * mxEdgeStyle.ElbowConnector.
	 */
	public static Object eval(String expression)
	{
		int dot = expression.lastIndexOf(".");

		if (dot > 0)
		{
			Class<?> clazz = mxCodecRegistry.getClassForName(expression
					.substring(0, dot));

			if (clazz != null)
			{
				try
				{
					return clazz.getField(expression.substring(dot + 1)).get(
							null);
				}
				catch (Exception e)
				{
					log.log(Level.SEVERE, "Failed to eval expression: " + expression, e);
				}
			}
		}

		return expression;
	}

	/**
	 * Returns the first node where attr equals value. This implementation does
	 * not use XPath.
	 */
	public static Node findNode(Node node, String attr, String value)
	{
		String tmp = (node instanceof Element) ? ((Element) node)
				.getAttribute(attr) : null;

		if (tmp != null && tmp.equals(value))
		{
			return node;
		}

		node = node.getFirstChild();

		while (node != null)
		{
			Node result = findNode(node, attr, value);

			if (result != null)
			{
				return result;
			}

			node = node.getNextSibling();
		}

		return null;
	}

	/**
	 * Converts the ampersand, quote, prime, less-than and greater-than
	 * characters to their corresponding HTML entities in the given string.
	 */
	public static String htmlEntities(String text)
	{
		return text.replaceAll("&", "&amp;").replaceAll("\"", "&quot;")
				.replaceAll("'", "&prime;").replaceAll("<", "&lt;")
				.replaceAll(">", "&gt;");
	}

	/**
	 * Returns a string that represents the given node.
	 * 
	 * @param node
	 *            Node to return the XML for.
	 * @return Returns an XML string.
	 * @deprecated Use <code>mxXmlUtils.getXml(Node)</code> (Jan 2012)
	 */
	public static String getXml(Node node)
	{
		return mxXmlUtils.getXml(node);
	}

	/**
	 * Returns a pretty-printed XML string for the given node.
	 * 
	 * @param node
	 *            Node to return the XML for.
	 * @return Returns a formatted XML string.
	 */
	public static String getPrettyXml(Node node)
	{
		return getPrettyXml(node, "  ", "");
	}

	/**
	 * Returns a pretty-printed XML string for the given node. Note that this
	 * string should only be used for humans to read (eg. debug output) but not
	 * for further processing as it does not use built-in mechanisms.
	 * 
	 * @param node
	 *            Node to return the XML for.
	 * @param tab
	 *            String to be used for indentation of inner nodes.
	 * @param indent
	 *            Current indentation for the node.
	 * @return Returns a formatted XML string.
	 */
	public static String getPrettyXml(Node node, String tab, String indent)
	{
		StringBuffer result = new StringBuffer();

		if (node != null)
		{
			if (node.getNodeType() == Node.TEXT_NODE)
			{
				result.append(node.getNodeValue());
			}
			else
			{
				result.append(indent + "<" + node.getNodeName());
				NamedNodeMap attrs = node.getAttributes();

				if (attrs != null)
				{
					for (int i = 0; i < attrs.getLength(); i++)
					{
						String value = attrs.item(i).getNodeValue();
						value = mxUtils.htmlEntities(value);
						result.append(" " + attrs.item(i).getNodeName() + "=\""
								+ value + "\"");
					}
				}
				Node tmp = node.getFirstChild();

				if (tmp != null)
				{
					result.append(">\n");

					while (tmp != null)
					{
						result.append(getPrettyXml(tmp, tab, indent + tab));
						tmp = tmp.getNextSibling();
					}

					result.append(indent + "</" + node.getNodeName() + ">\n");
				}
				else
				{
					result.append("/>\n");
				}
			}
		}

		return result.toString();
	}

}
