/**
 * Copyright (c) 2008-2012, JGraph Ltd
 */
package com.mxgraph.swing.handler;

import java.awt.BasicStroke;
import java.awt.Color;
import java.awt.Graphics;
import java.awt.Graphics2D;
import java.awt.Point;
import java.awt.Rectangle;
import java.awt.Stroke;
import java.awt.event.MouseEvent;

import javax.swing.JComponent;

import com.mxgraph.swing.mxGraphComponent;
import com.mxgraph.swing.util.mxSwingConstants;
import com.mxgraph.util.mxConstants;
import com.mxgraph.util.mxEvent;
import com.mxgraph.util.mxEventObject;
import com.mxgraph.util.mxEventSource;
import com.mxgraph.util.mxEventSource.mxIEventListener;
import com.mxgraph.util.mxUtils;
import com.mxgraph.view.mxCellState;
import com.mxgraph.view.mxGraphView;

/**
 * Implements a mouse tracker that marks cells under the mouse.
 * 
 * This class fires the following event:
 * 
 * mxEvent.MARK fires in mark and unmark to notify the listener of a new cell
 * under the mouse. The <code>state</code> property contains the mxCellState
 * of the respective cell or null if no cell is under the mouse.
 * 
 * To create a cell marker which highlights cells "in-place", the following
 * code can be used:
 * <code>
 * mxCellMarker highlighter = new mxCellMarker(graphComponent) {
 * 
 *   protected Map<String, Object> lastStyle;
 *   
 *   public mxCellState process(MouseEvent e)
 *   {
 *     mxCellState state = null;
 *     
 *     if (isEnabled())
 *     {
 *       state = getState(e);
 *       boolean isValid = (state != null) ? isValidState(state) : false;
 *       
 *       if (!isValid)
 *       {
 *         state = null;
 *       }
 *       
 *       highlight(state);
 *     }
 *     
 *     return state;
 *   }
 *   
 *   public void highlight(mxCellState state)
 *   {
 *     if (validState != state)
 *     {
 *       Rectangle dirty = null;
 *       
 *       if (validState != null)
 *       {
 *         validState.setStyle(lastStyle);
 *         dirty = validState.getBoundingBox().getRectangle();
 *         dirty.grow(4, 4);
 *       }
 *       
 *       if (state != null)
 *       {
 *         lastStyle = state.getStyle();
 *         state.setStyle(new Hashtable<String, Object>(state.getStyle()));
 *         state.getStyle().put("strokeColor", "#00ff00");
 *         state.getStyle().put("fontColor", "#00ff00");
 *         state.getStyle().put("strokeWidth", "3");
 *          
 *         Rectangle tmp = state.getBoundingBox().getRectangle();
 *         
 *         if (dirty != null)
 *         {
 *           dirty.add(tmp);
 *         }
 *         else
 *         {
 *           dirty = tmp;
 *         }
 *         
 *         dirty.grow(4, 4);
 *       }
 *       
 *       validState = state;
 *       graphComponent.repaint(dirty);
 *     }
 *   }
 *
 *   public void reset()
 *   {
 *     highlight(null);
 *   }
 *
 *   public void paint(Graphics g)
 *   {
 *     // do nothing
 *   }
 * };
 *  
 * graphComponent.getConnectionHandler().setMarker(highlighter);
 * </code>
 */
public class mxCellMarker extends JComponent
{

	/**
	 * 
	 */
	private static final long serialVersionUID = 614473367053597572L;

	/**
	 * Specifies if the highlights should appear on top of everything
	 * else in the overlay pane. Default is false.
	 */
	public static boolean KEEP_ON_TOP = false;

	/**
	 * Specifies the default stroke for the marker.
	 */
	public static Stroke DEFAULT_STROKE = new BasicStroke(3);

	/**
	 * Holds the event source.
	 */
	protected mxEventSource eventSource = new mxEventSource(this);

	/**
	 * Holds the enclosing graph component.
	 */
	protected mxGraphComponent graphComponent;

	/**
	 * Specifies if the marker is enabled. Default is true.
	 */
	protected boolean enabled = true;

	/**
	 * Specifies the portion of the width and height that should trigger
	 * a highlight. The area around the center of the cell to be marked is used
	 * as the hotspot. Possible values are between 0 and 1. Default is
	 * mxConstants.DEFAULT_HOTSPOT.
	 */
	protected double hotspot;

	/**
	 * Specifies if the hotspot is enabled. Default is false.
	 */
	protected boolean hotspotEnabled = false;

	/**
	 * Specifies if the the content area of swimlane should be non-transparent
	 * to mouse events. Default is false.
	 */
	protected boolean swimlaneContentEnabled = false;

	/**
	 * Specifies the valid- and invalidColor for the marker.
	 */
	protected Color validColor, invalidColor;

	/**
	 * Holds the current marker color.
	 */
	protected transient Color currentColor;

	/**
	 * Holds the marked state if it is valid.
	 */
	protected transient mxCellState validState;

	/**
	 * Holds the marked state.
	 */
	protected transient mxCellState markedState;

	/**
	 * Constructs a new marker for the given graph component.
	 * 
	 * @param graphComponent
	 */
	public mxCellMarker(mxGraphComponent graphComponent)
	{
		this(graphComponent, mxSwingConstants.DEFAULT_VALID_COLOR);
	}

	/**
	 * Constructs a new marker for the given graph component.
	 */
	public mxCellMarker(mxGraphComponent graphComponent, Color validColor)
	{
		this(graphComponent, validColor, mxSwingConstants.DEFAULT_INVALID_COLOR);
	}

	/**
	 * Constructs a new marker for the given graph component.
	 */
	public mxCellMarker(mxGraphComponent graphComponent, Color validColor,
			Color invalidColor)
	{
		this(graphComponent, validColor, invalidColor,
				mxConstants.DEFAULT_HOTSPOT);
	}

	/**
	 * Constructs a new marker for the given graph component.
	 */
	public mxCellMarker(mxGraphComponent graphComponent, Color validColor,
			Color invalidColor, double hotspot)
	{
		this.graphComponent = graphComponent;
		this.validColor = validColor;
		this.invalidColor = invalidColor;
		this.hotspot = hotspot;
	}

	/**
	 * Sets the enabled state of the marker.
	 */
	public void setEnabled(boolean enabled)
	{
		this.enabled = enabled;
	}

	/**
	 * Returns true if the marker is enabled, that is, if it processes events
	 * in process.
	 */
	public boolean isEnabled()
	{
		return enabled;
	}

	/**
	 * Sets the hotspot.
	 */
	public void setHotspot(double hotspot)
	{
		this.hotspot = hotspot;
	}

	/**
	 * Returns the hotspot.
	 */
	public double getHotspot()
	{
		return hotspot;
	}

	/**
	 * Specifies whether the hotspot should be used in intersects.
	 */
	public void setHotspotEnabled(boolean enabled)
	{
		this.hotspotEnabled = enabled;
	}

	/**
	 * Returns true if hotspot is used in intersects.
	 */
	public boolean isHotspotEnabled()
	{
		return hotspotEnabled;
	}

	/**
	 * Sets if the content area of swimlanes should not be transparent to
	 * events.
	 */
	public void setSwimlaneContentEnabled(boolean swimlaneContentEnabled)
	{
		this.swimlaneContentEnabled = swimlaneContentEnabled;
	}

	/**
	 * Returns true if the content area of swimlanes is non-transparent to
	 * events.
	 */
	public boolean isSwimlaneContentEnabled()
	{
		return swimlaneContentEnabled;
	}

	/**
	 * Sets the color used for valid highlights.
	 */
	public void setValidColor(Color value)
	{
		validColor = value;
	}

	/**
	 * Returns the color used for valid highlights.
	 */
	public Color getValidColor()
	{
		return validColor;
	}

	/**
	 * Sets the color used for invalid highlights.
	 */
	public void setInvalidColor(Color value)
	{
		invalidColor = value;
	}

	/**
	 * Returns the color used for invalid highlights.
	 */
	public Color getInvalidColor()
	{
		return invalidColor;
	}

	/**
	 * Returns true if validState is not null.
	 */
	public boolean hasValidState()
	{
		return (validState != null);
	}

	/**
	 * Returns the valid state.
	 */
	public mxCellState getValidState()
	{
		return validState;
	}

	/**
	 * Sets the current color. 
	 */
	public void setCurrentColor(Color value)
	{
		currentColor = value;
	}

	/**
	 * Returns the current color.
	 */
	public Color getCurrentColor()
	{
		return currentColor;
	}

	/**
	 * Sets the marked state. 
	 */
	public void setMarkedState(mxCellState value)
	{
		markedState = value;
	}

	/**
	 * Returns the marked state.
	 */
	public mxCellState getMarkedState()
	{
		return markedState;
	}

	/**
	 * Resets the state of the cell marker.
	 */
	public void reset()
	{
		validState = null;

		if (markedState != null)
		{
			markedState = null;
			unmark();
		}
	}

	/**
	 * Processes the given event and marks the state returned by getStateAt
	 * with the color returned by getMarkerColor. If the markerColor is not
	 * null, then the state is stored in markedState. If isValidState returns
	 * true, then the state is stored in validState regardless of the marker
	 * color. The state is returned regardless of the marker color and
	 * valid state. 
	 */
	public mxCellState process(MouseEvent e)
	{
		mxCellState state = null;

		if (isEnabled())
		{
			state = getState(e);
			boolean valid = (state != null) ? isValidState(state) : false;
			Color color = getMarkerColor(e, state, valid);
			
			highlight(state, color, valid);
		}

		return state;
	}
	
	/**
	 * 
	 */
	public void highlight(mxCellState state, Color color)
	{
		highlight(state, color, true);
	}
	
	/**
	 * 
	 */
	public void highlight(mxCellState state, Color color, boolean valid)
	{
		if (valid)
		{
			validState = state;
		}
		else
		{
			validState = null;
		}

		if (state != markedState || color != currentColor)
		{
			currentColor = color;

			if (state != null && currentColor != null)
			{
				markedState = state;
				mark();
			}
			else if (markedState != null)
			{
				markedState = null;
				unmark();
			}
		}
	}

	/**
	 * Marks the markedState and fires a mxEvent.MARK event.
	 */
	public void mark()
	{
		if (markedState != null)
		{
			Rectangle bounds = markedState.getRectangle();
			bounds.grow(3, 3);
			bounds.width += 1;
			bounds.height += 1;
			setBounds(bounds);

			if (getParent() == null)
			{
				setVisible(true);

				if (KEEP_ON_TOP)
				{
					graphComponent.getGraphControl().add(this, 0);
				}
				else
				{
					graphComponent.getGraphControl().add(this);
				}
			}

			repaint();
			eventSource.fireEvent(new mxEventObject(mxEvent.MARK, "state",
					markedState));
		}
	}

	/**
	 * Hides the marker and fires a mxEvent.MARK event.
	 */
	public void unmark()
	{
		if (getParent() != null)
		{
			setVisible(false);
			getParent().remove(this);
			eventSource.fireEvent(new mxEventObject(mxEvent.MARK));
		}
	}

	/**
	 * Returns true if the given state is a valid state. If this returns true,
	 * then the state is stored in validState. The return value of this method
	 * is used as the argument for getMarkerColor.
	 */
	protected boolean isValidState(mxCellState state)
	{
		return true;
	}

	/**
	 * Returns the valid- or invalidColor depending on the value of isValid.
	 * The given state is ignored by this implementation.
	 */
	protected Color getMarkerColor(MouseEvent e, mxCellState state,
			boolean isValid)
	{
		return (isValid) ? validColor : invalidColor;
	}

	/**
	 * Uses getCell, getMarkedState and intersects to return the state for
	 * the given event.
	 */
	protected mxCellState getState(MouseEvent e)
	{
		Object cell = getCell(e);
		mxGraphView view = graphComponent.getGraph().getView();
		mxCellState state = getStateToMark(view.getState(cell));

		return (state != null && intersects(state, e)) ? state : null;
	}

	/**
	 * Returns the state at the given location. This uses mxGraph.getCellAt.
	 */
	protected Object getCell(MouseEvent e)
	{
		return graphComponent.getCellAt(e.getX(), e.getY(),
				swimlaneContentEnabled);
	}

	/**
	 * Returns the state to be marked for the given state under the mouse. This
	 * returns the given state.
	 */
	protected mxCellState getStateToMark(mxCellState state)
	{
		return state;
	}

	/**
	 * Returns true if the given mouse event intersects the given state. This
	 * returns true if the hotspot is 0 or the event is inside the hotspot for
	 * the given cell state.
	 */
	protected boolean intersects(mxCellState state, MouseEvent e)
	{
		if (isHotspotEnabled())
		{
			return mxUtils.intersectsHotspot(state, e.getX(), e.getY(),
					hotspot, mxConstants.MIN_HOTSPOT_SIZE,
					mxConstants.MAX_HOTSPOT_SIZE);
		}

		return true;
	}

	/**
	 * Adds the given event listener.
	 */
	public void addListener(String eventName, mxIEventListener listener)
	{
		eventSource.addListener(eventName, listener);
	}

	/**
	 * Removes the given event listener.
	 */
	public void removeListener(mxIEventListener listener)
	{
		eventSource.removeListener(listener);
	}

	/**
	 * Removes the given event listener for the specified event name.
	 */
	public void removeListener(mxIEventListener listener, String eventName)
	{
		eventSource.removeListener(listener, eventName);
	}

	/**
	 * Paints the outline of the markedState with the currentColor.
	 */
	public void paint(Graphics g)
	{
		if (markedState != null && currentColor != null)
		{
			((Graphics2D) g).setStroke(DEFAULT_STROKE);
			g.setColor(currentColor);

			if (markedState.getAbsolutePointCount() > 0)
			{
				Point last = markedState.getAbsolutePoint(0).getPoint();

				for (int i = 1; i < markedState.getAbsolutePointCount(); i++)
				{
					Point current = markedState.getAbsolutePoint(i).getPoint();
					g.drawLine(last.x - getX(), last.y - getY(), current.x
							- getX(), current.y - getY());
					last = current;
				}
			}
			else
			{
				g.drawRect(1, 1, getWidth() - 3, getHeight() - 3);
			}
		}
	}

}
