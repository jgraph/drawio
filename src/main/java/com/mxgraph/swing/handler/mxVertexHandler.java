/**
 * Copyright (c) 2008-2012, JGraph Ltd
 */
package com.mxgraph.swing.handler;

import java.awt.Color;
import java.awt.Cursor;
import java.awt.Graphics;
import java.awt.Graphics2D;
import java.awt.Rectangle;
import java.awt.Stroke;
import java.awt.event.MouseEvent;

import javax.swing.JComponent;
import javax.swing.JPanel;

import com.mxgraph.model.mxGeometry;
import com.mxgraph.swing.mxGraphComponent;
import com.mxgraph.swing.util.mxSwingConstants;
import com.mxgraph.util.mxConstants;
import com.mxgraph.util.mxPoint;
import com.mxgraph.util.mxRectangle;
import com.mxgraph.view.mxCellState;
import com.mxgraph.view.mxGraph;

/**
 * 
 */
public class mxVertexHandler extends mxCellHandler
{

	/**
	 * 
	 */
	public static Cursor[] CURSORS = new Cursor[] {
			new Cursor(Cursor.NW_RESIZE_CURSOR),
			new Cursor(Cursor.N_RESIZE_CURSOR),
			new Cursor(Cursor.NE_RESIZE_CURSOR),
			new Cursor(Cursor.W_RESIZE_CURSOR),
			new Cursor(Cursor.E_RESIZE_CURSOR),
			new Cursor(Cursor.SW_RESIZE_CURSOR),
			new Cursor(Cursor.S_RESIZE_CURSOR),
			new Cursor(Cursor.SE_RESIZE_CURSOR), new Cursor(Cursor.MOVE_CURSOR) };

	/**
	 * Workaround for alt-key-state not correct in mouseReleased.
	 */
	protected transient boolean gridEnabledEvent = false;

	/**
	 * Workaround for shift-key-state not correct in mouseReleased.
	 */
	protected transient boolean constrainedEvent = false;

	/**
	 * 
	 * @param graphComponent
	 * @param state
	 */
	public mxVertexHandler(mxGraphComponent graphComponent, mxCellState state)
	{
		super(graphComponent, state);
	}

	/**
	 * 
	 */
	protected Rectangle[] createHandles()
	{
		Rectangle[] h = null;

		if (graphComponent.getGraph().isCellResizable(getState().getCell()))
		{
			Rectangle bounds = getState().getRectangle();
			int half = mxConstants.HANDLE_SIZE / 2;

			int left = bounds.x - half;
			int top = bounds.y - half;

			int w2 = bounds.x + (bounds.width / 2) - half;
			int h2 = bounds.y + (bounds.height / 2) - half;

			int right = bounds.x + bounds.width - half;
			int bottom = bounds.y + bounds.height - half;

			h = new Rectangle[9];

			int s = mxConstants.HANDLE_SIZE;
			h[0] = new Rectangle(left, top, s, s);
			h[1] = new Rectangle(w2, top, s, s);
			h[2] = new Rectangle(right, top, s, s);
			h[3] = new Rectangle(left, h2, s, s);
			h[4] = new Rectangle(right, h2, s, s);
			h[5] = new Rectangle(left, bottom, s, s);
			h[6] = new Rectangle(w2, bottom, s, s);
			h[7] = new Rectangle(right, bottom, s, s);
		}
		else
		{
			h = new Rectangle[1];
		}

		int s = mxConstants.LABEL_HANDLE_SIZE;
		mxRectangle bounds = state.getLabelBounds();
		h[h.length - 1] = new Rectangle((int) (bounds.getX()
				+ bounds.getWidth() / 2 - s), (int) (bounds.getY()
				+ bounds.getHeight() / 2 - s), 2 * s, 2 * s);

		return h;
	}

	/**
	 * 
	 */
	protected JComponent createPreview()
	{
		JPanel preview = new JPanel();
		preview.setBorder(mxSwingConstants.PREVIEW_BORDER);
		preview.setOpaque(false);
		preview.setVisible(false);

		return preview;
	}

	/**
	 * 
	 */
	public void mouseDragged(MouseEvent e)
	{
		if (!e.isConsumed() && first != null)
		{
			gridEnabledEvent = graphComponent.isGridEnabledEvent(e);
			constrainedEvent = graphComponent.isConstrainedEvent(e);

			double dx = e.getX() - first.x;
			double dy = e.getY() - first.y;

			if (isLabel(index))
			{
				mxPoint pt = new mxPoint(e.getPoint());

				if (gridEnabledEvent)
				{
					pt = graphComponent.snapScaledPoint(pt);
				}

				int idx = (int) Math.round(pt.getX() - first.x);
				int idy = (int) Math.round(pt.getY() - first.y);

				if (constrainedEvent)
				{
					if (Math.abs(idx) > Math.abs(idy))
					{
						idy = 0;
					}
					else
					{
						idx = 0;
					}
				}

				Rectangle rect = state.getLabelBounds().getRectangle();
				rect.translate(idx, idy);
				preview.setBounds(rect);
			}
			else
			{
				mxGraph graph = graphComponent.getGraph();
				double scale = graph.getView().getScale();

				if (gridEnabledEvent)
				{
					dx = graph.snap(dx / scale) * scale;
					dy = graph.snap(dy / scale) * scale;
				}

				mxRectangle bounds = union(getState(), dx, dy, index);
				bounds.setWidth(bounds.getWidth() + 1);
				bounds.setHeight(bounds.getHeight() + 1);
				preview.setBounds(bounds.getRectangle());
			}

			if (!preview.isVisible() && graphComponent.isSignificant(dx, dy))
			{
				preview.setVisible(true);
			}

			e.consume();
		}
	}

	/**
	 * 
	 */
	public void mouseReleased(MouseEvent e)
	{
		if (!e.isConsumed() && first != null)
		{
			if (preview != null && preview.isVisible())
			{
				if (isLabel(index))
				{
					moveLabel(e);
				}
				else
				{
					resizeCell(e);
				}
			}

			e.consume();
		}

		super.mouseReleased(e);
	}

	/**
	 * 
	 */
	protected void moveLabel(MouseEvent e)
	{
		mxGraph graph = graphComponent.getGraph();
		mxGeometry geometry = graph.getModel().getGeometry(state.getCell());

		if (geometry != null)
		{
			double scale = graph.getView().getScale();
			mxPoint pt = new mxPoint(e.getPoint());

			if (gridEnabledEvent)
			{
				pt = graphComponent.snapScaledPoint(pt);
			}

			double dx = (pt.getX() - first.x) / scale;
			double dy = (pt.getY() - first.y) / scale;

			if (constrainedEvent)
			{
				if (Math.abs(dx) > Math.abs(dy))
				{
					dy = 0;
				}
				else
				{
					dx = 0;
				}
			}

			mxPoint offset = geometry.getOffset();

			if (offset == null)
			{
				offset = new mxPoint();
			}

			dx += offset.getX();
			dy += offset.getY();

			geometry = (mxGeometry) geometry.clone();
			geometry.setOffset(new mxPoint(Math.round(dx), Math.round(dy)));
			graph.getModel().setGeometry(state.getCell(), geometry);
		}
	}

	/**
	 * 
	 * @param e
	 */
	protected void resizeCell(MouseEvent e)
	{
		mxGraph graph = graphComponent.getGraph();
		double scale = graph.getView().getScale();

		Object cell = state.getCell();
		mxGeometry geometry = graph.getModel().getGeometry(cell);

		if (geometry != null)
		{
			double dx = (e.getX() - first.x) / scale;
			double dy = (e.getY() - first.y) / scale;

			if (isLabel(index))
			{
				geometry = (mxGeometry) geometry.clone();

				if (geometry.getOffset() != null)
				{
					dx += geometry.getOffset().getX();
					dy += geometry.getOffset().getY();
				}

				if (gridEnabledEvent)
				{
					dx = graph.snap(dx);
					dy = graph.snap(dy);
				}

				geometry.setOffset(new mxPoint(dx, dy));
				graph.getModel().setGeometry(cell, geometry);
			}
			else
			{
				mxRectangle bounds = union(geometry, dx, dy, index);
				Rectangle rect = bounds.getRectangle();

				// Snaps new bounds to grid (unscaled)
				if (gridEnabledEvent)
				{
					int x = (int) graph.snap(rect.x);
					int y = (int) graph.snap(rect.y);
					rect.width = (int) graph.snap(rect.width - x + rect.x);
					rect.height = (int) graph.snap(rect.height - y + rect.y);
					rect.x = x;
					rect.y = y;
				}

				graph.resizeCell(cell, new mxRectangle(rect));
			}
		}
	}

	/**
	 * 
	 */
	protected Cursor getCursor(MouseEvent e, int index)
	{
		if (index >= 0 && index <= CURSORS.length)
		{
			return CURSORS[index];
		}

		return null;
	}

	/**
	 * 
	 * @param bounds
	 * @param dx
	 * @param dy
	 * @param index
	 */
	protected mxRectangle union(mxRectangle bounds, double dx, double dy,
			int index)
	{
		double left = bounds.getX();
		double right = left + bounds.getWidth();
		double top = bounds.getY();
		double bottom = top + bounds.getHeight();

		if (index > 4 /* Bottom Row */)
		{
			bottom = bottom + dy;
		}
		else if (index < 3 /* Top Row */)
		{
			top = top + dy;
		}

		if (index == 0 || index == 3 || index == 5 /* Left */)
		{
			left += dx;
		}
		else if (index == 2 || index == 4 || index == 7 /* Right */)
		{
			right += dx;
		}

		double width = right - left;
		double height = bottom - top;

		// Flips over left side
		if (width < 0)
		{
			left += width;
			width = Math.abs(width);
		}

		// Flips over top side
		if (height < 0)
		{
			top += height;
			height = Math.abs(height);
		}

		return new mxRectangle(left, top, width, height);
	}

	/**
	 * 
	 */
	public Color getSelectionColor()
	{
		return mxSwingConstants.VERTEX_SELECTION_COLOR;
	}

	/**
	 * 
	 */
	public Stroke getSelectionStroke()
	{
		return mxSwingConstants.VERTEX_SELECTION_STROKE;
	}

	/**
	 * 
	 */
	public void paint(Graphics g)
	{
		Rectangle bounds = getState().getRectangle();

		if (g.hitClip(bounds.x, bounds.y, bounds.width, bounds.height))
		{
			Graphics2D g2 = (Graphics2D) g;

			Stroke stroke = g2.getStroke();
			g2.setStroke(getSelectionStroke());
			g.setColor(getSelectionColor());
			g.drawRect(bounds.x, bounds.y, bounds.width, bounds.height);
			g2.setStroke(stroke);
		}

		super.paint(g);
	}

}
