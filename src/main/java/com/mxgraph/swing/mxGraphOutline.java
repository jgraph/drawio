/**
 * Copyright (c) 2008, Gaudenz Alder
 */
package com.mxgraph.swing;

import java.awt.BasicStroke;
import java.awt.Color;
import java.awt.Cursor;
import java.awt.Dimension;
import java.awt.Graphics;
import java.awt.Graphics2D;
import java.awt.Point;
import java.awt.Rectangle;
import java.awt.Stroke;
import java.awt.event.AdjustmentEvent;
import java.awt.event.AdjustmentListener;
import java.awt.event.ComponentAdapter;
import java.awt.event.ComponentEvent;
import java.awt.event.ComponentListener;
import java.awt.event.MouseEvent;
import java.awt.event.MouseListener;
import java.awt.event.MouseMotionListener;
import java.awt.geom.AffineTransform;
import java.awt.image.BufferedImage;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.swing.JComponent;
import javax.swing.JScrollBar;

import com.mxgraph.util.mxEvent;
import com.mxgraph.util.mxEventObject;
import com.mxgraph.util.mxEventSource.mxIEventListener;
import com.mxgraph.util.mxPoint;
import com.mxgraph.util.mxRectangle;
import com.mxgraph.util.mxUtils;
import com.mxgraph.view.mxGraphView;

/**
 * An outline view for a specific graph component.
 */
public class mxGraphOutline extends JComponent
{

	private static final Logger log = Logger.getLogger(mxGraphOutline.class.getName());

	/**
	 * 
	 */
	private static final long serialVersionUID = -2521103946905154267L;

	/**
	 * 
	 */
	public static Color DEFAULT_ZOOMHANDLE_FILL = new Color(0, 255, 255);

	/**
	 * 
	 */
	protected mxGraphComponent graphComponent;

	/**
	 * TODO: Not yet implemented.
	 */
	protected BufferedImage tripleBuffer;

	/**
	 * Holds the graphics of the triple buffer.
	 */
	protected Graphics2D tripleBufferGraphics;

	/**
	 * True if the triple buffer needs a full repaint.
	 */
	protected boolean repaintBuffer = false;

	/**
	 * Clip of the triple buffer to be repainted.
	 */
	protected mxRectangle repaintClip = null;

	/**
	 * 
	 */
	protected boolean tripleBuffered = true;

	/**
	 * 
	 */
	protected Rectangle finderBounds = new Rectangle();

	/**
	 * 
	 */
	protected Point zoomHandleLocation = null;

	/**
	 * 
	 */
	protected boolean finderVisible = true;

	/**
	 * 
	 */
	protected boolean zoomHandleVisible = true;

	/**
	 * 
	 */
	protected boolean useScaledInstance = false;

	/**
	 * 
	 */
	protected boolean antiAlias = false;

	/**
	 * 
	 */
	protected boolean drawLabels = false;

	/**
	 * Specifies if the outline should be zoomed to the page if the graph
	 * component is in page layout mode. Default is true.
	 */
	protected boolean fitPage = true;

	/**
	 * Not yet implemented.
	 * 
	 * Border to add around the page bounds if wholePage is true.
	 * Default is 4.
	 */
	protected int outlineBorder = 10;

	/**
	 * 
	 */
	protected MouseTracker tracker = new MouseTracker();

	/**
	 * 
	 */
	protected double scale = 1;

	/**
	 * 
	 */
	protected Point translate = new Point();

	/**
	 * 
	 */
	protected transient boolean zoomGesture = false;

	/**
	 * 
	 */
	protected mxIEventListener repaintHandler = new mxIEventListener()
	{
		public void invoke(Object source, mxEventObject evt)
		{
			updateScaleAndTranslate();
			mxRectangle dirty = (mxRectangle) evt.getProperty("region");

			if (dirty != null)
			{
				repaintClip = new mxRectangle(dirty);
			}
			else
			{
				repaintBuffer = true;
			}

			if (dirty != null)
			{
				updateFinder(true);

				dirty.grow(1 / scale);

				dirty.setX(dirty.getX() * scale + translate.x);
				dirty.setY(dirty.getY() * scale + translate.y);
				dirty.setWidth(dirty.getWidth() * scale);
				dirty.setHeight(dirty.getHeight() * scale);

				repaint(dirty.getRectangle());
			}
			else
			{
				updateFinder(false);
				repaint();
			}
		}
	};

	/**
	 * 
	 */
	protected ComponentListener componentHandler = new ComponentAdapter()
	{
		public void componentResized(ComponentEvent e)
		{
			if (updateScaleAndTranslate())
			{
				repaintBuffer = true;
				updateFinder(false);
				repaint();
			}
			else
			{
				updateFinder(true);
			}
		}
	};

	/**
	 * 
	 */
	protected AdjustmentListener adjustmentHandler = new AdjustmentListener()
	{

		/**
		 * 
		 */
		public void adjustmentValueChanged(AdjustmentEvent e)
		{
			if (updateScaleAndTranslate())
			{
				repaintBuffer = true;
				updateFinder(false);
				repaint();
			}
			else
			{
				updateFinder(true);
			}
		}

	};

	/**
	 * 
	 */
	public mxGraphOutline(mxGraphComponent graphComponent)
	{
		addComponentListener(componentHandler);
		addMouseMotionListener(tracker);
		addMouseListener(tracker);
		setGraphComponent(graphComponent);
		setEnabled(true);
		setOpaque(true);
	}

	/**
	 * Fires a property change event for <code>tripleBuffered</code>.
	 * 
	 * @param tripleBuffered the tripleBuffered to set
	 */
	public void setTripleBuffered(boolean tripleBuffered)
	{
		boolean oldValue = this.tripleBuffered;
		this.tripleBuffered = tripleBuffered;

		if (!tripleBuffered)
		{
			destroyTripleBuffer();
		}

		firePropertyChange("tripleBuffered", oldValue, tripleBuffered);
	}

	/**
	 * 
	 */
	public boolean isTripleBuffered()
	{
		return tripleBuffered;
	}

	/**
	 * Fires a property change event for <code>drawLabels</code>.
	 * 
	 * @param drawLabels the drawLabels to set
	 */
	public void setDrawLabels(boolean drawLabels)
	{
		boolean oldValue = this.drawLabels;
		this.drawLabels = drawLabels;
		repaintTripleBuffer(null);

		firePropertyChange("drawLabels", oldValue, drawLabels);
	}

	/**
	 * 
	 */
	public boolean isDrawLabels()
	{
		return drawLabels;
	}

	/**
	 * Fires a property change event for <code>antiAlias</code>.
	 * 
	 * @param antiAlias the antiAlias to set
	 */
	public void setAntiAlias(boolean antiAlias)
	{
		boolean oldValue = this.antiAlias;
		this.antiAlias = antiAlias;
		repaintTripleBuffer(null);

		firePropertyChange("antiAlias", oldValue, antiAlias);
	}

	/**
	 * @return the antiAlias
	 */
	public boolean isAntiAlias()
	{
		return antiAlias;
	}

	/**
	 * 
	 */
	public void setVisible(boolean visible)
	{
		super.setVisible(visible);

		// Frees memory if the outline is hidden
		if (!visible)
		{
			destroyTripleBuffer();
		}
	}

	/**
	 * 
	 */
	public void setFinderVisible(boolean visible)
	{
		finderVisible = visible;
	}

	/**
	 * 
	 */
	public void setZoomHandleVisible(boolean visible)
	{
		zoomHandleVisible = visible;
	}

	/**
	 * Fires a property change event for <code>fitPage</code>.
	 * 
	 * @param fitPage the fitPage to set
	 */
	public void setFitPage(boolean fitPage)
	{
		boolean oldValue = this.fitPage;
		this.fitPage = fitPage;

		if (updateScaleAndTranslate())
		{
			repaintBuffer = true;
			updateFinder(false);
		}

		firePropertyChange("fitPage", oldValue, fitPage);
	}

	/**
	 * 
	 */
	public boolean isFitPage()
	{
		return fitPage;
	}

	/**
	 * 
	 */
	public mxGraphComponent getGraphComponent()
	{
		return graphComponent;
	}

	/**
	 * Fires a property change event for <code>graphComponent</code>.
	 * 
	 * @param graphComponent the graphComponent to set
	 */
	public void setGraphComponent(mxGraphComponent graphComponent)
	{
		mxGraphComponent oldValue = this.graphComponent;

		if (this.graphComponent != null)
		{
			this.graphComponent.getGraph().removeListener(repaintHandler);
			this.graphComponent.getGraphControl().removeComponentListener(
					componentHandler);
			this.graphComponent.getHorizontalScrollBar()
					.removeAdjustmentListener(adjustmentHandler);
			this.graphComponent.getVerticalScrollBar()
					.removeAdjustmentListener(adjustmentHandler);
		}

		this.graphComponent = graphComponent;

		if (this.graphComponent != null)
		{
			this.graphComponent.getGraph().addListener(mxEvent.REPAINT,
					repaintHandler);
			this.graphComponent.getGraphControl().addComponentListener(
					componentHandler);
			this.graphComponent.getHorizontalScrollBar().addAdjustmentListener(
					adjustmentHandler);
			this.graphComponent.getVerticalScrollBar().addAdjustmentListener(
					adjustmentHandler);
		}

		if (updateScaleAndTranslate())
		{
			repaintBuffer = true;
			repaint();
		}

		firePropertyChange("graphComponent", oldValue, graphComponent);
	}

	/**
	 * Checks if the triple buffer exists and creates a new one if
	 * it does not. Also compares the size of the buffer with the
	 * size of the graph and drops the buffer if it has a
	 * different size.
	 */
	public void checkTripleBuffer()
	{
		if (tripleBuffer != null)
		{
			if (tripleBuffer.getWidth() != getWidth()
					|| tripleBuffer.getHeight() != getHeight())
			{
				// Resizes the buffer (destroys existing and creates new)
				destroyTripleBuffer();
			}
		}

		if (tripleBuffer == null)
		{
			createTripleBuffer(getWidth(), getHeight());
		}
	}

	/**
	 * Creates the tripleBufferGraphics and tripleBuffer for the given
	 * dimension and draws the complete graph onto the triplebuffer.
	 * 
	 * @param width
	 * @param height
	 */
	protected void createTripleBuffer(int width, int height)
	{
		try
		{
			tripleBuffer = mxUtils.createBufferedImage(width, height, null);
			tripleBufferGraphics = tripleBuffer.createGraphics();

			// Repaints the complete buffer
			repaintTripleBuffer(null);
		}
		catch (OutOfMemoryError error)
		{
			log.log(Level.SEVERE, "Failed to create a triple buffer", error);
		}
	}

	/**
	 * Destroys the tripleBuffer and tripleBufferGraphics objects.
	 */
	public void destroyTripleBuffer()
	{
		if (tripleBuffer != null)
		{
			tripleBuffer = null;
			tripleBufferGraphics.dispose();
			tripleBufferGraphics = null;
		}
	}

	/**
	 * Clears and repaints the triple buffer at the given rectangle or repaints
	 * the complete buffer if no rectangle is specified.
	 * 
	 * @param clip
	 */
	public void repaintTripleBuffer(Rectangle clip)
	{
		if (tripleBuffered && tripleBufferGraphics != null)
		{
			if (clip == null)
			{
				clip = new Rectangle(tripleBuffer.getWidth(),
						tripleBuffer.getHeight());
			}

			// Clears and repaints the dirty rectangle using the
			// graphics canvas of the graph component as a renderer
			mxUtils.clearRect(tripleBufferGraphics, clip, null);
			tripleBufferGraphics.setClip(clip);
			paintGraph(tripleBufferGraphics);
			tripleBufferGraphics.setClip(null);

			repaintBuffer = false;
			repaintClip = null;
		}
	}

	/**
	 * 
	 */
	public void updateFinder(boolean repaint)
	{
		Rectangle rect = graphComponent.getViewport().getViewRect();

		int x = (int) Math.round(rect.x * scale);
		int y = (int) Math.round(rect.y * scale);
		int w = (int) Math.round((rect.x + rect.width) * scale) - x;
		int h = (int) Math.round((rect.y + rect.height) * scale) - y;

		updateFinderBounds(new Rectangle(x + translate.x, y + translate.y,
				w + 1, h + 1), repaint);
	}

	/**
	 * 
	 */
	public void updateFinderBounds(Rectangle bounds, boolean repaint)
	{
		if (bounds != null && !bounds.equals(finderBounds))
		{
			Rectangle old = new Rectangle(finderBounds);
			finderBounds = bounds;

			// LATER: Fix repaint region to be smaller
			if (repaint)
			{
				old = old.union(finderBounds);
				old.grow(3, 3);
				repaint(old);
			}
		}
	}

	/**
	 * 
	 */
	public void paintComponent(Graphics g)
	{
		super.paintComponent(g);
		paintBackground(g);

		if (graphComponent != null)
		{
			// Creates or destroys the triple buffer as needed
			if (tripleBuffered)
			{
				checkTripleBuffer();
			}
			else if (tripleBuffer != null)
			{
				destroyTripleBuffer();
			}

			// Updates the dirty region from the buffered graph image
			if (tripleBuffer != null)
			{
				if (repaintBuffer)
				{
					repaintTripleBuffer(null);
				}
				else if (repaintClip != null)
				{
					repaintClip.grow(1 / scale);

					repaintClip.setX(repaintClip.getX() * scale + translate.x);
					repaintClip.setY(repaintClip.getY() * scale + translate.y);
					repaintClip.setWidth(repaintClip.getWidth() * scale);
					repaintClip.setHeight(repaintClip.getHeight() * scale);

					repaintTripleBuffer(repaintClip.getRectangle());
				}

				mxUtils.drawImageClip(g, tripleBuffer, this);
			}

			// Paints the graph directly onto the graphics
			else
			{
				paintGraph(g);
			}

			paintForeground(g);
		}
	}

	/**
	 * Paints the background.
	 */
	protected void paintBackground(Graphics g)
	{
		if (graphComponent != null)
		{
			Graphics2D g2 = (Graphics2D) g;
			AffineTransform tx = g2.getTransform();

			try
			{
				// Draws the background of the outline if a graph exists 
				g.setColor(graphComponent.getPageBackgroundColor());
				mxUtils.fillClippedRect(g, 0, 0, getWidth(), getHeight());

				g2.translate(translate.x, translate.y);
				g2.scale(scale, scale);

				// Draws the scaled page background
				if (!graphComponent.isPageVisible())
				{
					Color bg = graphComponent.getBackground();

					if (graphComponent.getViewport().isOpaque())
					{
						bg = graphComponent.getViewport().getBackground();
					}

					g.setColor(bg);
					Dimension size = graphComponent.getGraphControl().getSize();

					// Paints the background of the drawing surface
					mxUtils.fillClippedRect(g, 0, 0, size.width, size.height);
					g.setColor(g.getColor().darker().darker());
					g.drawRect(0, 0, size.width, size.height);
				}
				else
				{
					// Paints the page background using the graphics scaling
					graphComponent.paintBackgroundPage(g);
				}
			}
			finally
			{
				g2.setTransform(tx);
			}
		}
		else
		{
			// Draws the background of the outline if no graph exists 
			g.setColor(getBackground());
			mxUtils.fillClippedRect(g, 0, 0, getWidth(), getHeight());
		}
	}

	/**
	 * Paints the graph outline.
	 */
	public void paintGraph(Graphics g)
	{
		if (graphComponent != null)
		{
			Graphics2D g2 = (Graphics2D) g;
			AffineTransform tx = g2.getTransform();

			try
			{
				Point tr = graphComponent.getGraphControl().getTranslate();
				g2.translate(translate.x + tr.getX() * scale,
						translate.y + tr.getY() * scale);
				g2.scale(scale, scale);

				// Draws the scaled graph
				graphComponent.getGraphControl().drawGraph(g2, drawLabels);
			}
			finally
			{
				g2.setTransform(tx);
			}
		}
	}

	/**
	 * Paints the foreground. Foreground is dynamic and should never be made
	 * part of the triple buffer. It is painted on top of the buffer.
	 */
	protected void paintForeground(Graphics g)
	{
		if (graphComponent != null)
		{
			Graphics2D g2 = (Graphics2D) g;

			Stroke stroke = g2.getStroke();
			g.setColor(Color.BLUE);
			g2.setStroke(new BasicStroke(3));
			g.drawRect(finderBounds.x, finderBounds.y, finderBounds.width,
					finderBounds.height);

			if (zoomHandleVisible)
			{
				g2.setStroke(stroke);
				g.setColor(DEFAULT_ZOOMHANDLE_FILL);
				g.fillRect(finderBounds.x + finderBounds.width - 6, finderBounds.y
						+ finderBounds.height - 6, 8, 8);
				g.setColor(Color.BLACK);
				g.drawRect(finderBounds.x + finderBounds.width - 6, finderBounds.y
						+ finderBounds.height - 6, 8, 8);
			}
		}
	}

	/**
	 * Returns true if the scale or translate has changed.
	 */
	public boolean updateScaleAndTranslate()
	{
		double newScale = 1;
		int dx = 0;
		int dy = 0;

		if (this.graphComponent != null)
		{
			Dimension graphSize = graphComponent.getGraphControl().getSize();
			Dimension outlineSize = getSize();

			int gw = (int) graphSize.getWidth();
			int gh = (int) graphSize.getHeight();

			if (gw > 0 && gh > 0)
			{
				boolean magnifyPage = graphComponent.isPageVisible()
						&& isFitPage()
						&& graphComponent.getHorizontalScrollBar().isVisible()
						&& graphComponent.getVerticalScrollBar().isVisible();
				double graphScale = graphComponent.getGraph().getView()
						.getScale();
				mxPoint trans = graphComponent.getGraph().getView()
						.getTranslate();

				int w = (int) outlineSize.getWidth() - 2 * outlineBorder;
				int h = (int) outlineSize.getHeight() - 2 * outlineBorder;

				if (magnifyPage)
				{
					gw -= 2 * Math.round(trans.getX() * graphScale);
					gh -= 2 * Math.round(trans.getY() * graphScale);
				}

				newScale = Math.min((double) w / gw, (double) h / gh);

				dx += (int) Math
						.round((outlineSize.getWidth() - gw * newScale) / 2);
				dy += (int) Math
						.round((outlineSize.getHeight() - gh * newScale) / 2);

				if (magnifyPage)
				{
					dx -= Math.round(trans.getX() * newScale * graphScale);
					dy -= Math.round(trans.getY() * newScale * graphScale);
				}
			}
		}

		if (newScale != scale || translate.x != dx || translate.y != dy)
		{
			scale = newScale;
			translate.setLocation(dx, dy);

			return true;
		}
		else
		{
			return false;
		}
	}

	/**
	 *
	 */
	public class MouseTracker implements MouseListener, MouseMotionListener
	{
		/**
		 * 
		 */
		protected Point start = null;

		/*
		 * (non-Javadoc)
		 * @see java.awt.event.MouseListener#mousePressed(java.awt.event.MouseEvent)
		 */
		public void mousePressed(MouseEvent e)
		{
			zoomGesture = hitZoomHandle(e.getX(), e.getY());

			if (graphComponent != null && !e.isConsumed()
					&& !e.isPopupTrigger()
					&& (finderBounds.contains(e.getPoint()) || zoomGesture))
			{
				start = e.getPoint();
			}
		}

		/*
		 * (non-Javadoc)
		 * @see java.awt.event.MouseMotionListener#mouseDragged(java.awt.event.MouseEvent)
		 */
		public void mouseDragged(MouseEvent e)
		{
			if (isEnabled() && start != null)
			{
				if (zoomGesture)
				{
					Rectangle bounds = graphComponent.getViewport()
							.getViewRect();
					double viewRatio = bounds.getWidth() / bounds.getHeight();

					bounds = new Rectangle(finderBounds);
					bounds.width = (int) Math
							.max(0, (e.getX() - bounds.getX()));
					bounds.height = (int) Math.max(0,
							(bounds.getWidth() / viewRatio));

					updateFinderBounds(bounds, true);
				}
				else
				{
					// TODO: To enable constrained moving, that is, moving
					// into only x- or y-direction when shift is pressed,
					// we need the location of the first mouse event, since
					// the movement can not be constrained for incremental
					// steps as used below.
					int dx = (int) ((e.getX() - start.getX()) / scale);
					int dy = (int) ((e.getY() - start.getY()) / scale);

					// Keeps current location as start for delta movement
					// of the scrollbars
					start = e.getPoint();

					graphComponent.getHorizontalScrollBar().setValue(
							graphComponent.getHorizontalScrollBar().getValue()
									+ dx);
					graphComponent.getVerticalScrollBar().setValue(
							graphComponent.getVerticalScrollBar().getValue()
									+ dy);
				}
			}
		}

		/*
		 * (non-Javadoc)
		 * @see java.awt.event.MouseListener#mouseReleased(java.awt.event.MouseEvent)
		 */
		public void mouseReleased(MouseEvent e)
		{
			if (start != null)
			{
				if (zoomGesture)
				{
					double dx = e.getX() - start.getX();
					double w = finderBounds.getWidth();

					final JScrollBar hs = graphComponent
							.getHorizontalScrollBar();
					final double sx;

					if (hs != null)
					{
						sx = (double) hs.getValue() / hs.getMaximum();
					}
					else
					{
						sx = 0;
					}

					final JScrollBar vs = graphComponent.getVerticalScrollBar();
					final double sy;

					if (vs != null)
					{
						sy = (double) vs.getValue() / vs.getMaximum();
					}
					else
					{
						sy = 0;
					}

					mxGraphView view = graphComponent.getGraph().getView();
					double scale = view.getScale();
					double newScale = scale - (dx * scale) / w;
					double factor = newScale / scale;
					view.setScale(newScale);

					if (hs != null)
					{
						hs.setValue((int) (sx * hs.getMaximum() * factor));
					}

					if (vs != null)
					{
						vs.setValue((int) (sy * vs.getMaximum() * factor));
					}
				}

				zoomGesture = false;
				start = null;
			}
		}

		/**
		 * 
		 */
		public boolean hitZoomHandle(int x, int y)
		{
			return new Rectangle(finderBounds.x + finderBounds.width - 6,
					finderBounds.y + finderBounds.height - 6, 8, 8).contains(x,
					y);
		}

		/*
		 * (non-Javadoc)
		 * @see java.awt.event.MouseMotionListener#mouseMoved(java.awt.event.MouseEvent)
		 */
		public void mouseMoved(MouseEvent e)
		{
			if (hitZoomHandle(e.getX(), e.getY()))
			{
				setCursor(new Cursor(Cursor.HAND_CURSOR));
			}
			else if (finderBounds.contains(e.getPoint()))
			{
				setCursor(new Cursor(Cursor.MOVE_CURSOR));
			}
			else
			{
				setCursor(new Cursor(Cursor.DEFAULT_CURSOR));
			}
		}

		/*
		 * (non-Javadoc)
		 * @see java.awt.event.MouseListener#mouseClicked(java.awt.event.MouseEvent)
		 */
		public void mouseClicked(MouseEvent e)
		{
			// ignore
		}

		/*
		 * (non-Javadoc)
		 * @see java.awt.event.MouseListener#mouseEntered(java.awt.event.MouseEvent)
		 */
		public void mouseEntered(MouseEvent e)
		{
			// ignore
		}

		/*
		 * (non-Javadoc)
		 * @see java.awt.event.MouseListener#mouseExited(java.awt.event.MouseEvent)
		 */
		public void mouseExited(MouseEvent e)
		{
			// ignore
		}

	}

}
