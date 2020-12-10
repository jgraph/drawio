/**
 * Copyright (c) 2010, Gaudenz Alder, David Benson
 */
package com.mxgraph.shape;

import java.awt.Color;
import java.awt.Font;
import java.awt.FontMetrics;
import java.awt.Graphics2D;
import java.awt.Rectangle;
import java.util.Map;

import com.mxgraph.canvas.mxGraphics2DCanvas;
import com.mxgraph.util.mxConstants;
import com.mxgraph.util.mxUtils;
import com.mxgraph.view.mxCellState;

public class mxDefaultTextShape implements mxITextShape
{

	/**
	 * 
	 */
	public void paintShape(mxGraphics2DCanvas canvas, String text,
			mxCellState state, Map<String, Object> style)
	{
		Rectangle rect = state.getLabelBounds().getRectangle();
		Graphics2D g = canvas.getGraphics();

		if (g.getClipBounds() == null || g.getClipBounds().intersects(rect))
		{
			boolean horizontal = mxUtils.isTrue(style,
					mxConstants.STYLE_HORIZONTAL, true);
			double scale = canvas.getScale();
			int x = rect.x;
			int y = rect.y;
			int w = rect.width;
			int h = rect.height;

			if (!horizontal)
			{
				g.rotate(-Math.PI / 2, x + w / 2, y + h / 2);
				g.translate(w / 2 - h / 2, h / 2 - w / 2);
			}

			Color fontColor = mxUtils.getColor(style,
					mxConstants.STYLE_FONTCOLOR, Color.black);
			g.setColor(fontColor);

			// Shifts the y-coordinate down by the ascent plus a workaround
			// for the line not starting at the exact vertical location
			Font scaledFont = mxUtils.getFont(style, scale);
			g.setFont(scaledFont);
			int fontSize = mxUtils.getInt(style, mxConstants.STYLE_FONTSIZE,
					mxConstants.DEFAULT_FONTSIZE);
			FontMetrics fm = g.getFontMetrics();
			int scaledFontSize = scaledFont.getSize();
			double fontScaleFactor = ((double) scaledFontSize)
					/ ((double) fontSize);
			// This factor is the amount by which the font is smaller/
			// larger than we expect for the given scale. 1 means it's
			// correct, 0.8 means the font is 0.8 the size we expected
			// when scaled, etc.
			double fontScaleRatio = fontScaleFactor / scale;
			// The y position has to be moved by (1 - ratio) * height / 2
			y += 2 * fm.getMaxAscent() - fm.getHeight()
					+ mxConstants.LABEL_INSET * scale;

			Object vertAlign = mxUtils.getString(style,
					mxConstants.STYLE_VERTICAL_ALIGN, mxConstants.ALIGN_MIDDLE);
			double vertAlignProportion = 0.5;

			if (vertAlign.equals(mxConstants.ALIGN_TOP))
			{
				vertAlignProportion = 0;
			}
			else if (vertAlign.equals(mxConstants.ALIGN_BOTTOM))
			{
				vertAlignProportion = 1.0;
			}

			y += (1.0 - fontScaleRatio) * h * vertAlignProportion;

			// Gets the alignment settings
			Object align = mxUtils.getString(style, mxConstants.STYLE_ALIGN,
					mxConstants.ALIGN_CENTER);

			if (align.equals(mxConstants.ALIGN_LEFT))
			{
				x += mxConstants.LABEL_INSET * scale;
			}
			else if (align.equals(mxConstants.ALIGN_RIGHT))
			{
				x -= mxConstants.LABEL_INSET * scale;
			}

			// Draws the text line by line
			String[] lines = text.split("\n");
			
			for (int i = 0; i < lines.length; i++)
			{
				int dx = 0;

				if (align.equals(mxConstants.ALIGN_CENTER))
				{
					int sw = fm.stringWidth(lines[i]);

					if (horizontal)
					{
						dx = (w - sw) / 2;
					}
					else
					{
						dx = (h - sw) / 2;
					}
				}
				else if (align.equals(mxConstants.ALIGN_RIGHT))
				{
					int sw = fm.stringWidth(lines[i]);
					dx = ((horizontal) ? w : h) - sw;
				}

				g.drawString(lines[i], x + dx, y);
				postProcessLine(text, lines[i], fm, canvas, x + dx, y);
				y += fm.getHeight() + mxConstants.LINESPACING;
			}
		}
	}

	/**
	 * Hook to add functionality after a line has been drawn
	 * @param text the entire label text
	 * @param line the line at the specified location
	 * @param fm the text font metrics
	 * @param canvas the canvas object currently being painted to
	 * @param x the x co-ord of the baseline of the text line
	 * @param y the y co-ord of the baseline of the text line
	 */
	protected void postProcessLine(String text, String line, FontMetrics fm, mxGraphics2DCanvas canvas, int x, int y){}
}
