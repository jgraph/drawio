/**
 * Copyright (c) 2008-2012, JGraph Ltd
 */
package com.mxgraph.swing.handler;

import java.awt.Color;
import java.awt.Graphics;
import java.awt.Point;
import java.awt.Rectangle;
import java.awt.event.KeyAdapter;
import java.awt.event.KeyEvent;
import java.awt.event.MouseEvent;
import java.awt.event.MouseListener;
import java.awt.event.MouseMotionListener;

import com.mxgraph.swing.mxGraphComponent;
import com.mxgraph.swing.mxGraphComponent.mxGraphControl;
import com.mxgraph.swing.util.mxSwingConstants;
import com.mxgraph.util.mxEvent;
import com.mxgraph.util.mxEventObject;
import com.mxgraph.util.mxUtils;
import com.mxgraph.util.mxEventSource.mxIEventListener;

/**
 * Implements a rubberband selection.
 */
public class mxRubberband implements MouseListener, MouseMotionListener
{

	/**
	 * Defines the border color for drawing the rubberband selection.
	 * Default is mxConstants.RUBBERBAND_BORDERCOLOR.
	 */
	protected Color borderColor = mxSwingConstants.RUBBERBAND_BORDERCOLOR;

	/**
	 * Defines the color to be used for filling the rubberband selection.
	 * Default is mxConstants.RUBBERBAND_FILLCOLOR.
	 */
	protected Color fillColor = mxSwingConstants.RUBBERBAND_FILLCOLOR;

	/**
	 * Reference to the enclosing graph container.
	 */
	protected mxGraphComponent graphComponent;

	/**
	 * Specifies if the rubberband is enabled.
	 */
	protected boolean enabled = true;

	/**
	 * Holds the point where the selection has started.
	 */
	protected transient Point first;

	/**
	 * Holds the current rubberband bounds.
	 */
	protected transient Rectangle bounds;

	/**
	 * Constructs a new rubberband selection for the given graph component.
	 * 
	 * @param graphComponent Component that contains the rubberband.
	 */
	public mxRubberband(final mxGraphComponent graphComponent)
	{
		this.graphComponent = graphComponent;

		// Adds the required listeners
		graphComponent.getGraphControl().addMouseListener(this);
		graphComponent.getGraphControl().addMouseMotionListener(this);

		graphComponent.addListener(mxEvent.AFTER_PAINT, new mxIEventListener()
		{

			public void invoke(Object source, mxEventObject evt)
			{
				paintRubberband((Graphics) evt.getProperty("g"));
			}

		});

		// Handles escape keystrokes
		graphComponent.addKeyListener(new KeyAdapter()
		{
			/**
			 * 
			 * @param e
			 * @return
			 */
			public void keyPressed(KeyEvent e)
			{
				if (e.getKeyCode() == KeyEvent.VK_ESCAPE
						&& graphComponent.isEscapeEnabled())
				{
					reset();
				}
			}
		});

		// LATER: Add destroy method for removing above listeners
	}

	/**
	 * Returns the enabled state.
	 */
	public boolean isEnabled()
	{
		return enabled;
	}

	/**
	 * Sets the enabled state.
	 */
	public void setEnabled(boolean enabled)
	{
		this.enabled = enabled;
	}

	/**
	 * Returns the border color.
	 */
	public Color getBorderColor()
	{
		return borderColor;
	}

	/**
	 * Sets the border color.
	 */
	public void setBorderColor(Color value)
	{
		borderColor = value;
	}

	/**
	 * Returns the fill color.
	 */
	public Color getFillColor()
	{
		return fillColor;
	}

	/**
	 * Sets the fill color.
	 */
	public void setFillColor(Color value)
	{
		fillColor = value;
	}

	/**
	 * Returns true if the given event should start the rubberband selection.
	 */
	public boolean isRubberbandTrigger(MouseEvent e)
	{
		return true;
	}

	/**
	 * Starts the rubberband selection at the given point.
	 */
	public void start(Point point)
	{
		first = point;
		bounds = new Rectangle(first);
	}

	/**
	 * Resets the rubberband selection without carrying out the selection.
	 */
	public void reset()
	{
		first = null;

		if (bounds != null)
		{
			graphComponent.getGraphControl().repaint(bounds);
			bounds = null;
		}
	}

	/**
	 * 
	 * @param rect
	 * @param e
	 */
	public Object[] select(Rectangle rect, MouseEvent e)
	{
		return graphComponent.selectRegion(rect, e);
	}

	/**
	 * 
	 */
	public void paintRubberband(Graphics g)
	{
		if (first != null && bounds != null
				&& graphComponent.isSignificant(bounds.width, bounds.height))
		{
			Rectangle rect = new Rectangle(bounds);
			g.setColor(fillColor);
			mxUtils.fillClippedRect(g, rect.x, rect.y, rect.width, rect.height);
			g.setColor(borderColor);
			rect.width -= 1;
			rect.height -= 1;
			g.drawRect(rect.x, rect.y, rect.width, rect.height);
		}
	}

	/**
	 * 
	 */
	public void mousePressed(MouseEvent e)
	{
		if (!e.isConsumed() && isEnabled() && isRubberbandTrigger(e)
				&& !e.isPopupTrigger())
		{
			start(e.getPoint());
			e.consume();
		}
	}

	/**
	 * 
	 */
	public void mouseDragged(MouseEvent e)
	{
		if (!e.isConsumed() && first != null)
		{
			Rectangle oldBounds = new Rectangle(bounds);
			bounds = new Rectangle(first);
			bounds.add(e.getPoint());

			if (graphComponent.isSignificant(bounds.width, bounds.height))
			{
				mxGraphControl control = graphComponent.getGraphControl();

				// Repaints exact difference between old and new bounds
				Rectangle union = new Rectangle(oldBounds);
				union.add(bounds);

				if (bounds.x != oldBounds.x)
				{
					int maxleft = Math.max(bounds.x, oldBounds.x);
					Rectangle tmp = new Rectangle(union.x - 1, union.y, maxleft
							- union.x + 2, union.height);
					control.repaint(tmp);
				}

				if (bounds.x + bounds.width != oldBounds.x + oldBounds.width)
				{
					int minright = Math.min(bounds.x + bounds.width,
							oldBounds.x + oldBounds.width);
					Rectangle tmp = new Rectangle(minright - 1, union.y,
							union.x + union.width - minright + 1, union.height);
					control.repaint(tmp);
				}

				if (bounds.y != oldBounds.y)
				{
					int maxtop = Math.max(bounds.y, oldBounds.y);
					Rectangle tmp = new Rectangle(union.x, union.y - 1,
							union.width, maxtop - union.y + 2);
					control.repaint(tmp);
				}

				if (bounds.y + bounds.height != oldBounds.y + oldBounds.height)
				{
					int minbottom = Math.min(bounds.y + bounds.height,
							oldBounds.y + oldBounds.height);
					Rectangle tmp = new Rectangle(union.x, minbottom - 1,
							union.width, union.y + union.height - minbottom + 1);
					control.repaint(tmp);
				}

				if (!graphComponent.isToggleEvent(e)
						&& !graphComponent.getGraph().isSelectionEmpty())
				{
					graphComponent.getGraph().clearSelection();
				}
			}

			e.consume();
		}
	}

	/**
	 * 
	 */
	public void mouseReleased(MouseEvent e)
	{
		Rectangle rect = bounds;
		reset();

		if (!e.isConsumed() && rect != null
				&& graphComponent.isSignificant(rect.width, rect.height))
		{
			select(rect, e);
			e.consume();
		}

	}

	/*
	 * (non-Javadoc)
	 * @see java.awt.event.MouseListener#mouseClicked(java.awt.event.MouseEvent)
	 */
	public void mouseClicked(MouseEvent arg0)
	{
		// empty
	}

	/*
	 * (non-Javadoc)
	 * @see java.awt.event.MouseListener#mouseEntered(java.awt.event.MouseEvent)
	 */
	public void mouseEntered(MouseEvent arg0)
	{
		// empty
	}

	/*
	 * (non-Javadoc)
	 * @see java.awt.event.MouseListener#mouseExited(java.awt.event.MouseEvent)
	 */
	public void mouseExited(MouseEvent arg0)
	{
		// empty
	}

	/*
	 * (non-Javadoc)
	 * @see java.awt.event.MouseMotionListener#mouseMoved(java.awt.event.MouseEvent)
	 */
	public void mouseMoved(MouseEvent arg0)
	{
		// empty
	}

}
