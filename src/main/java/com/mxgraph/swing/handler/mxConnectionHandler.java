/**
 * Copyright (c) 2008, Gaudenz Alder
 */
package com.mxgraph.swing.handler;

import java.awt.Color;
import java.awt.Cursor;
import java.awt.Graphics;
import java.awt.Point;
import java.awt.Rectangle;
import java.awt.event.MouseEvent;
import java.beans.PropertyChangeEvent;
import java.beans.PropertyChangeListener;

import javax.swing.ImageIcon;
import javax.swing.JOptionPane;

import com.mxgraph.model.mxGeometry;
import com.mxgraph.model.mxIGraphModel;
import com.mxgraph.swing.mxGraphComponent;
import com.mxgraph.swing.mxGraphComponent.mxGraphControl;
import com.mxgraph.swing.util.mxMouseAdapter;
import com.mxgraph.util.mxConstants;
import com.mxgraph.util.mxEvent;
import com.mxgraph.util.mxEventObject;
import com.mxgraph.util.mxEventSource;
import com.mxgraph.util.mxEventSource.mxIEventListener;
import com.mxgraph.util.mxPoint;
import com.mxgraph.util.mxRectangle;
import com.mxgraph.view.mxCellState;
import com.mxgraph.view.mxGraph;
import com.mxgraph.view.mxGraphView;

/**
 * Connection handler creates new connections between cells. This control is used to display the connector
 * icon, while the preview is used to draw the line.
 * 
 * mxEvent.CONNECT fires between begin- and endUpdate in mouseReleased. The <code>cell</code>
 * property contains the inserted edge, the <code>event</code> and <code>target</code> 
 * properties contain the respective arguments that were passed to mouseReleased.
 */
public class mxConnectionHandler extends mxMouseAdapter
{

	/**
	 * 
	 */
	private static final long serialVersionUID = -2543899557644889853L;

	/**
	 * 
	 */
	public static Cursor CONNECT_CURSOR = new Cursor(Cursor.HAND_CURSOR);

	/**
	 * 
	 */
	protected mxGraphComponent graphComponent;

	/**
	 * Holds the event source.
	 */
	protected mxEventSource eventSource = new mxEventSource(this);

	/**
	 * 
	 */
	protected mxConnectPreview connectPreview;

	/**
	 * Specifies the icon to be used for creating new connections. If this is
	 * specified then it is used instead of the handle. Default is null.
	 */
	protected ImageIcon connectIcon = null;

	/**
	 * Specifies the size of the handle to be used for creating new
	 * connections. Default is mxConstants.CONNECT_HANDLE_SIZE. 
	 */
	protected int handleSize = mxConstants.CONNECT_HANDLE_SIZE;

	/**
	 * Specifies if a handle should be used for creating new connections. This
	 * is only used if no connectIcon is specified. If this is false, then the
	 * source cell will be highlighted when the mouse is over the hotspot given
	 * in the marker. Default is mxConstants.CONNECT_HANDLE_ENABLED.
	 */
	protected boolean handleEnabled = mxConstants.CONNECT_HANDLE_ENABLED;

	/**
	 * 
	 */
	protected boolean select = true;

	/**
	 * Specifies if the source should be cloned and used as a target if no
	 * target was selected. Default is false.
	 */
	protected boolean createTarget = false;

	/**
	 * Appearance and event handling order wrt subhandles.
	 */
	protected boolean keepOnTop = true;

	/**
	 * 
	 */
	protected boolean enabled = true;

	/**
	 * 
	 */
	protected transient Point first;

	/**
	 * 
	 */
	protected transient boolean active = false;

	/**
	 * 
	 */
	protected transient Rectangle bounds;

	/**
	 * 
	 */
	protected transient mxCellState source;

	/**
	 * 
	 */
	protected transient mxCellMarker marker;

	/**
	 * 
	 */
	protected transient String error;

	/**
	 * 
	 */
	protected transient mxIEventListener resetHandler = new mxIEventListener()
	{
		public void invoke(Object source, mxEventObject evt)
		{
			reset();
		}
	};

	/**
	 * 
	 * @param graphComponent
	 */
	public mxConnectionHandler(mxGraphComponent graphComponent)
	{
		this.graphComponent = graphComponent;

		// Installs the paint handler
		graphComponent.addListener(mxEvent.AFTER_PAINT, new mxIEventListener()
		{
			public void invoke(Object sender, mxEventObject evt)
			{
				Graphics g = (Graphics) evt.getProperty("g");
				paint(g);
			}
		});

		connectPreview = createConnectPreview();

		mxGraphControl graphControl = graphComponent.getGraphControl();
		graphControl.addMouseListener(this);
		graphControl.addMouseMotionListener(this);

		// Installs the graph listeners and keeps them in sync
		addGraphListeners(graphComponent.getGraph());

		graphComponent.addPropertyChangeListener(new PropertyChangeListener()
		{
			public void propertyChange(PropertyChangeEvent evt)
			{
				if (evt.getPropertyName().equals("graph"))
				{
					removeGraphListeners((mxGraph) evt.getOldValue());
					addGraphListeners((mxGraph) evt.getNewValue());
				}
			}
		});

		marker = new mxCellMarker(graphComponent)
		{
			/**
			 * 
			 */
			private static final long serialVersionUID = 103433247310526381L;

			// Overrides to return cell at location only if valid (so that
			// there is no highlight for invalid cells that have no error
			// message when the mouse is released)
			protected Object getCell(MouseEvent e)
			{
				Object cell = super.getCell(e);

				if (isConnecting())
				{
					if (source != null)
					{
						error = validateConnection(source.getCell(), cell);

						if (error != null && error.length() == 0)
						{
							cell = null;

							// Enables create target inside groups
							if (createTarget)
							{
								error = null;
							}
						}
					}
				}
				else if (!isValidSource(cell))
				{
					cell = null;
				}

				return cell;
			}

			// Sets the highlight color according to isValidConnection
			protected boolean isValidState(mxCellState state)
			{
				if (isConnecting())
				{
					return error == null;
				}
				else
				{
					return super.isValidState(state);
				}
			}

			// Overrides to use marker color only in highlight mode or for
			// target selection
			protected Color getMarkerColor(MouseEvent e, mxCellState state,
					boolean isValid)
			{
				return (isHighlighting() || isConnecting()) ? super
						.getMarkerColor(e, state, isValid) : null;
			}

			// Overrides to use hotspot only for source selection otherwise
			// intersects always returns true when over a cell
			protected boolean intersects(mxCellState state, MouseEvent e)
			{
				if (!isHighlighting() || isConnecting())
				{
					return true;
				}

				return super.intersects(state, e);
			}
		};

		marker.setHotspotEnabled(true);
	}

	/**
	 * Installs the listeners to update the handles after any changes.
	 */
	protected void addGraphListeners(mxGraph graph)
	{
		// LATER: Install change listener for graph model, view
		if (graph != null)
		{
			mxGraphView view = graph.getView();
			view.addListener(mxEvent.SCALE, resetHandler);
			view.addListener(mxEvent.TRANSLATE, resetHandler);
			view.addListener(mxEvent.SCALE_AND_TRANSLATE, resetHandler);

			graph.getModel().addListener(mxEvent.CHANGE, resetHandler);
		}
	}

	/**
	 * Removes all installed listeners.
	 */
	protected void removeGraphListeners(mxGraph graph)
	{
		if (graph != null)
		{
			mxGraphView view = graph.getView();
			view.removeListener(resetHandler, mxEvent.SCALE);
			view.removeListener(resetHandler, mxEvent.TRANSLATE);
			view.removeListener(resetHandler, mxEvent.SCALE_AND_TRANSLATE);

			graph.getModel().removeListener(resetHandler, mxEvent.CHANGE);
		}
	}

	/**
	 * 
	 */
	protected mxConnectPreview createConnectPreview()
	{
		return new mxConnectPreview(graphComponent);
	}

	/**
	 * 
	 */
	public mxConnectPreview getConnectPreview()
	{
		return connectPreview;
	}

	/**
	 * 
	 */
	public void setConnectPreview(mxConnectPreview value)
	{
		connectPreview = value;
	}

	/**
	 * Returns true if the source terminal has been clicked and a new
	 * connection is currently being previewed.
	 */
	public boolean isConnecting()
	{
		return connectPreview.isActive();
	}

	/**
	 * 
	 */
	public boolean isActive()
	{
		return active;
	}
	
	/**
	 * Returns true if no connectIcon is specified and handleEnabled is false.
	 */
	public boolean isHighlighting()
	{
		return connectIcon == null && !handleEnabled;
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
	public boolean isKeepOnTop()
	{
		return keepOnTop;
	}

	/**
	 * 
	 */
	public void setKeepOnTop(boolean value)
	{
		keepOnTop = value;
	}

	/**
	 * 
	 */
	public void setConnectIcon(ImageIcon value)
	{
		connectIcon = value;
	}

	/**
	 * 
	 */
	public ImageIcon getConnecIcon()
	{
		return connectIcon;
	}

	/**
	 * 
	 */
	public void setHandleEnabled(boolean value)
	{
		handleEnabled = value;
	}

	/**
	 * 
	 */
	public boolean isHandleEnabled()
	{
		return handleEnabled;
	}

	/**
	 * 
	 */
	public void setHandleSize(int value)
	{
		handleSize = value;
	}

	/**
	 * 
	 */
	public int getHandleSize()
	{
		return handleSize;
	}

	/**
	 * 
	 */
	public mxCellMarker getMarker()
	{
		return marker;
	}

	/**
	 * 
	 */
	public void setMarker(mxCellMarker value)
	{
		marker = value;
	}

	/**
	 * 
	 */
	public void setCreateTarget(boolean value)
	{
		createTarget = value;
	}

	/**
	 * 
	 */
	public boolean isCreateTarget()
	{
		return createTarget;
	}

	/**
	 * 
	 */
	public void setSelect(boolean value)
	{
		select = value;
	}

	/**
	 * 
	 */
	public boolean isSelect()
	{
		return select;
	}

	/**
	 * 
	 */
	public void reset()
	{
		connectPreview.stop(false);
		setBounds(null);
		marker.reset();
		active = false;
		source = null;
		first = null;
		error = null;
	}

	/**
	 * 
	 */
	public Object createTargetVertex(MouseEvent e, Object source)
	{
		mxGraph graph = graphComponent.getGraph();
		Object clone = graph.cloneCells(new Object[] { source })[0];
		mxIGraphModel model = graph.getModel();
		mxGeometry geo = model.getGeometry(clone);

		if (geo != null)
		{
			mxPoint point = graphComponent.getPointForEvent(e);
			geo.setX(graph.snap(point.getX() - geo.getWidth() / 2));
			geo.setY(graph.snap(point.getY() - geo.getHeight() / 2));
		}

		return clone;
	}

	/**
	 * 
	 */
	public boolean isValidSource(Object cell)
	{
		return graphComponent.getGraph().isValidSource(cell);
	}

	/**
	 * Returns true. The call to mxGraph.isValidTarget is implicit by calling
	 * mxGraph.getEdgeValidationError in validateConnection. This is an
	 * additional hook for disabling certain targets in this specific handler.
	 */
	public boolean isValidTarget(Object cell)
	{
		return true;
	}

	/**
	 * Returns the error message or an empty string if the connection for the
	 * given source target pair is not valid. Otherwise it returns null.
	 */
	public String validateConnection(Object source, Object target)
	{
		if (target == null && createTarget)
		{
			return null;
		}

		if (!isValidTarget(target))
		{
			return "";
		}

		return graphComponent.getGraph().getEdgeValidationError(
				connectPreview.getPreviewState().getCell(), source, target);
	}

	/**
	 * 
	 */
	public void mousePressed(MouseEvent e)
	{
		if (!graphComponent.isForceMarqueeEvent(e)
				&& !graphComponent.isPanningEvent(e)
				&& !e.isPopupTrigger()
				&& graphComponent.isEnabled()
				&& isEnabled()
				&& !e.isConsumed()
				&& ((isHighlighting() && marker.hasValidState()) || (!isHighlighting()
						&& bounds != null && bounds.contains(e.getPoint()))))
		{
			start(e, marker.getValidState());
			e.consume();
		}
	}

	/**
	 * 
	 */
	public void start(MouseEvent e, mxCellState state)
	{
		first = e.getPoint();
		connectPreview.start(e, state, "");
	}

	/**
	 * 
	 */
	public void mouseMoved(MouseEvent e)
	{
		mouseDragged(e);

		if (isHighlighting() && !marker.hasValidState())
		{
			source = null;
		}

		if (!isHighlighting() && source != null)
		{
			int imgWidth = handleSize;
			int imgHeight = handleSize;

			if (connectIcon != null)
			{
				imgWidth = connectIcon.getIconWidth();
				imgHeight = connectIcon.getIconHeight();
			}

			int x = (int) source.getCenterX() - imgWidth / 2;
			int y = (int) source.getCenterY() - imgHeight / 2;

			if (graphComponent.getGraph().isSwimlane(source.getCell()))
			{
				mxRectangle size = graphComponent.getGraph().getStartSize(
						source.getCell());

				if (size.getWidth() > 0)
				{
					x = (int) (source.getX() + size.getWidth() / 2 - imgWidth / 2);
				}
				else
				{
					y = (int) (source.getY() + size.getHeight() / 2 - imgHeight / 2);
				}
			}

			setBounds(new Rectangle(x, y, imgWidth, imgHeight));
		}
		else
		{
			setBounds(null);
		}

		if (source != null && (bounds == null || bounds.contains(e.getPoint())))
		{
			graphComponent.getGraphControl().setCursor(CONNECT_CURSOR);
			e.consume();
		}
	}

	/**
	 * 
	 */
	public void mouseDragged(MouseEvent e)
	{
		if (!e.isConsumed() && graphComponent.isEnabled() && isEnabled())
		{
			// Activates the handler
			if (!active && first != null)
			{
				double dx = Math.abs(first.getX() - e.getX());
				double dy = Math.abs(first.getY() - e.getY());
				int tol = graphComponent.getTolerance();
				
				if (dx > tol || dy > tol)
				{
					active = true;
				}
			}
			
			if (e.getButton() == 0 || (isActive() && connectPreview.isActive()))
			{
				mxCellState state = marker.process(e);
	
				if (connectPreview.isActive())
				{
					connectPreview.update(e, marker.getValidState(), e.getX(),
							e.getY());
					setBounds(null);
					e.consume();
				}
				else
				{
					source = state;
				}
			}
		}
	}

	/**
	 * 
	 */
	public void mouseReleased(MouseEvent e)
	{
		if (isActive())
		{
			if (error != null)
			{
				if (error.length() > 0)
				{
					JOptionPane.showMessageDialog(graphComponent, error);
				}
			}
			else if (first != null)
			{
				mxGraph graph = graphComponent.getGraph();
				double dx = first.getX() - e.getX();
				double dy = first.getY() - e.getY();
	
				if (connectPreview.isActive()
						&& (marker.hasValidState() || isCreateTarget() || graph
								.isAllowDanglingEdges()))
				{
					graph.getModel().beginUpdate();
	
					try
					{
						Object dropTarget = null;
	
						if (!marker.hasValidState() && isCreateTarget())
						{
							Object vertex = createTargetVertex(e, source.getCell());
							dropTarget = graph.getDropTarget(
									new Object[] { vertex }, e.getPoint(),
									graphComponent.getCellAt(e.getX(), e.getY()));
	
							if (vertex != null)
							{
								// Disables edges as drop targets if the target cell was created
								if (dropTarget == null
										|| !graph.getModel().isEdge(dropTarget))
								{
									mxCellState pstate = graph.getView().getState(
											dropTarget);
	
									if (pstate != null)
									{
										mxGeometry geo = graph.getModel()
												.getGeometry(vertex);
	
										mxPoint origin = pstate.getOrigin();
										geo.setX(geo.getX() - origin.getX());
										geo.setY(geo.getY() - origin.getY());
									}
								}
								else
								{
									dropTarget = graph.getDefaultParent();
								}
	
								graph.addCells(new Object[] { vertex }, dropTarget);
							}
	
							// FIXME: Here we pre-create the state for the vertex to be
							// inserted in order to invoke update in the connectPreview.
							// This means we have a cell state which should be created
							// after the model.update, so this should be fixed.
							mxCellState targetState = graph.getView().getState(
									vertex, true);
							connectPreview.update(e, targetState, e.getX(),
									e.getY());
						}
	
						Object cell = connectPreview.stop(
								graphComponent.isSignificant(dx, dy), e);
	
						if (cell != null)
						{
							graphComponent.getGraph().setSelectionCell(cell);
							eventSource.fireEvent(new mxEventObject(
									mxEvent.CONNECT, "cell", cell, "event", e,
									"target", dropTarget));
						}
	
						e.consume();
					}
					finally
					{
						graph.getModel().endUpdate();
					}
				}
			}
		}

		reset();
	}

	/**
	 * 
	 */
	public void setBounds(Rectangle value)
	{
		if ((bounds == null && value != null)
				|| (bounds != null && value == null)
				|| (bounds != null && value != null && !bounds.equals(value)))
		{
			Rectangle tmp = bounds;

			if (tmp != null)
			{
				if (value != null)
				{
					tmp.add(value);
				}
			}
			else
			{
				tmp = value;
			}

			bounds = value;

			if (tmp != null)
			{
				graphComponent.getGraphControl().repaint(tmp);
			}
		}
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
	 * 
	 */
	public void paint(Graphics g)
	{
		if (bounds != null)
		{
			if (connectIcon != null)
			{
				g.drawImage(connectIcon.getImage(), bounds.x, bounds.y,
						bounds.width, bounds.height, null);
			}
			else if (handleEnabled)
			{
				g.setColor(Color.BLACK);
				g.draw3DRect(bounds.x, bounds.y, bounds.width - 1,
						bounds.height - 1, true);
				g.setColor(Color.GREEN);
				g.fill3DRect(bounds.x + 1, bounds.y + 1, bounds.width - 2,
						bounds.height - 2, true);
				g.setColor(Color.BLUE);
				g.drawRect(bounds.x + bounds.width / 2 - 1, bounds.y
						+ bounds.height / 2 - 1, 1, 1);
			}
		}
	}

}
