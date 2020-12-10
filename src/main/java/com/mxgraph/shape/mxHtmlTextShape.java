/**
 * Copyright (c) 2010, Gaudenz Alder, David Benson
 */
package com.mxgraph.shape;

import java.awt.Graphics2D;
import java.awt.Rectangle;
import java.util.Map;

import javax.swing.CellRendererPane;

import com.mxgraph.canvas.mxGraphics2DCanvas;
import com.mxgraph.util.mxConstants;
import com.mxgraph.util.mxLightweightLabel;
import com.mxgraph.util.mxUtils;
import com.mxgraph.view.mxCellState;

/**
 * To set global CSS for all HTML labels, use the following code:
 * 
 * <pre>
 * mxGraphics2DCanvas.putTextShape(mxGraphics2DCanvas.TEXT_SHAPE_HTML,
 *   new mxHtmlTextShape()
 *   {
 *     protected String createHtmlDocument(Map<String, Object> style, String text)
 *     {
 *       return mxUtils.createHtmlDocument(style, text, 1, 0,
 *           "<style type=\"text/css\">.selectRef { " +
 *           "font-size:9px;font-weight:normal; }</style>");
 *     }
 *   }
 * );
 * </pre> 
 */
public class mxHtmlTextShape implements mxITextShape
{

	/**
	 * Specifies if linefeeds should be replaced with breaks in HTML markup.
	 * Default is true.
	 */
	protected boolean replaceHtmlLinefeeds = true;

	/**
	 * Returns replaceHtmlLinefeeds
	 */
	public boolean isReplaceHtmlLinefeeds()
	{
		return replaceHtmlLinefeeds;
	}

	/**
	 * Returns replaceHtmlLinefeeds
	 */
	public void setReplaceHtmlLinefeeds(boolean value)
	{
		replaceHtmlLinefeeds = value;
	}

	/**
	 * 
	 */
	protected String createHtmlDocument(Map<String, Object> style, String text,
			int w, int h)
	{
		String overflow = mxUtils.getString(style, mxConstants.STYLE_OVERFLOW, "");
		
		if (overflow.equals("fill"))
		{
			return mxUtils.createHtmlDocument(style, text, 1, w, null, "height:" + h + "pt;");
		}
		else if (overflow.equals("width"))
		{
			return mxUtils.createHtmlDocument(style, text, 1, w);
		}
		else
		{
			return mxUtils.createHtmlDocument(style, text);
		}
	}

	/**
	 * 
	 */
	public void paintShape(mxGraphics2DCanvas canvas, String text,
			mxCellState state, Map<String, Object> style)
	{
		mxLightweightLabel textRenderer = mxLightweightLabel
				.getSharedInstance();
		CellRendererPane rendererPane = canvas.getRendererPane();
		Rectangle rect = state.getLabelBounds().getRectangle();
		Graphics2D g = canvas.getGraphics();

		if (textRenderer != null
				&& rendererPane != null
				&& (g.getClipBounds() == null || g.getClipBounds().intersects(
						rect)))
		{
			double scale = canvas.getScale();
			int x = rect.x;
			int y = rect.y;
			int w = rect.width;
			int h = rect.height;

			if (!mxUtils.isTrue(style, mxConstants.STYLE_HORIZONTAL, true))
			{
				g.rotate(-Math.PI / 2, x + w / 2, y + h / 2);
				g.translate(w / 2 - h / 2, h / 2 - w / 2);

				int tmp = w;
				w = h;
				h = tmp;
			}

			// Replaces the linefeeds with BR tags
			if (isReplaceHtmlLinefeeds())
			{
				text = text.replaceAll("\n", "<br>");
			}

			// Renders the scaled text
			textRenderer.setText(createHtmlDocument(style, text,
					(int) Math.round(w / state.getView().getScale()),
					(int) Math.round(h / state.getView().getScale())));
			textRenderer.setFont(mxUtils.getFont(style, canvas.getScale()));
			g.scale(scale, scale);
			rendererPane.paintComponent(g, textRenderer, rendererPane,
					(int) (x / scale) + mxConstants.LABEL_INSET,
					(int) (y / scale) + mxConstants.LABEL_INSET,
					(int) (w / scale), (int) (h / scale), true);
		}
	}

}
