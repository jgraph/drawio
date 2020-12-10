/**
 * Copyright (c) 2008, Gaudenz Alder
 */
package com.mxgraph.swing.handler;

import java.awt.Point;
import java.awt.Rectangle;
import java.awt.event.MouseEvent;

import com.mxgraph.swing.mxGraphComponent;
import com.mxgraph.swing.util.mxMouseAdapter;

/**
 * 
 */
public class mxPanningHandler extends mxMouseAdapter
{

	/**
	 * 
	 */
	private static final long serialVersionUID = 7969814728058376339L;

	/**
	 * 
	 */
	protected mxGraphComponent graphComponent;
	
	/**
	 * 
	 */
	protected boolean enabled = true;

	/**
	 * 
	 */
	protected transient Point start;

	/**
	 * 
	 * @param graphComponent
	 */
	public mxPanningHandler(mxGraphComponent graphComponent)
	{
		this.graphComponent = graphComponent;

		graphComponent.getGraphControl().addMouseListener(this);
		graphComponent.getGraphControl().addMouseMotionListener(this);
	}

	/**
	 * 
	 */
	public boolean isEnabled()
	{
		return enabled;
	}

	/**
	 * 
	 */
	public void setEnabled(boolean value)
	{
		enabled = value;
	}

	/**
	 * 
	 */
	public void mousePressed(MouseEvent e)
	{
		if (isEnabled() && !e.isConsumed() && graphComponent.isPanningEvent(e)
				&& !e.isPopupTrigger())
		{
			start = e.getPoint();
		}
	}

	/**
	 * 
	 */
	public void mouseDragged(MouseEvent e)
	{
		if (!e.isConsumed() && start != null)
		{
			int dx = e.getX() - start.x;
			int dy = e.getY() - start.y;

			Rectangle r = graphComponent.getViewport().getViewRect();

			int right = r.x + ((dx > 0) ? 0 : r.width) - dx;
			int bottom = r.y + ((dy > 0) ? 0 : r.height) - dy;

			graphComponent.getGraphControl().scrollRectToVisible(
					new Rectangle(right, bottom, 0, 0));

			e.consume();
		}
	}

	/**
	 * 
	 */
	public void mouseReleased(MouseEvent e)
	{
		if (!e.isConsumed() && start != null)
		{
			int dx = Math.abs(start.x - e.getX());
			int dy = Math.abs(start.y - e.getY());

			if (graphComponent.isSignificant(dx, dy))
			{
				e.consume();
			}
		}

		start = null;
	}

	/**
	 * Whether or not panning is currently active
	 * @return Whether or not panning is currently active
	 */
	public boolean isActive()
	{
		return (start != null);
	}
}
