package com.mxgraph.swing.handler;

import java.awt.Cursor;
import java.awt.Graphics;
import java.awt.Graphics2D;
import java.awt.Point;
import java.awt.Rectangle;
import java.awt.event.MouseEvent;

import javax.swing.ImageIcon;
import javax.swing.JComponent;
import javax.swing.JLabel;
import javax.swing.SwingUtilities;

import com.mxgraph.swing.mxGraphComponent;
import com.mxgraph.swing.util.mxMouseAdapter;
import com.mxgraph.util.mxConstants;
import com.mxgraph.util.mxEvent;
import com.mxgraph.util.mxEventObject;
import com.mxgraph.util.mxEventSource.mxIEventListener;
import com.mxgraph.util.mxRectangle;
import com.mxgraph.util.mxUtils;
import com.mxgraph.view.mxCellState;

/**
 * Basic example of implementing a handler for rotation. This can be used as follows:
 * 
 * new mxRotationHandler(graphComponent)
 * 
 * Note that the Java core does actually not support rotation for the selection handles,
 * perimeter points etc. Feel free to contribute a fix!
 */
public class mxRotationHandler extends mxMouseAdapter
{
	/**
	 * 
	 */
	public static ImageIcon ROTATE_ICON = null;

	/**
	 * Loads the collapse and expand icons.
	 */
	static
	{
		ROTATE_ICON = new ImageIcon(
				mxRotationHandler.class
						.getResource("/com/mxgraph/swing/images/rotate.gif"));
	}

	/**
	 * 
	 */
	private static double PI4 = Math.PI / 4;

	/**
	 * Reference to the enclosing graph component.
	 */
	protected mxGraphComponent graphComponent;

	/**
	 * Specifies if this handler is enabled. Default is true.
	 */
	protected boolean enabled = true;

	/**
	 * 
	 */
	protected JComponent handle;

	/**
	 * 
	 */
	protected mxCellState currentState;

	/**
	 * 
	 */
	protected double initialAngle;

	/**
	 * 
	 */
	protected double currentAngle;

	/**
	 * 
	 */
	protected Point first;

	/**
	 * Constructs a new rotation handler.
	 */
	public mxRotationHandler(mxGraphComponent graphComponent)
	{
		this.graphComponent = graphComponent;
		graphComponent.addMouseListener(this);
		handle = createHandle();

		// Installs the paint handler
		graphComponent.addListener(mxEvent.AFTER_PAINT, new mxIEventListener()
		{
			public void invoke(Object sender, mxEventObject evt)
			{
				Graphics g = (Graphics) evt.getProperty("g");
				paint(g);
			}
		});

		// Listens to all mouse events on the rendering control
		graphComponent.getGraphControl().addMouseListener(this);
		graphComponent.getGraphControl().addMouseMotionListener(this);

		// Needs to catch events because these are consumed
		handle.addMouseListener(this);
		handle.addMouseMotionListener(this);
	}

	/**
	 * 
	 */
	public mxGraphComponent getGraphComponent()
	{
		return graphComponent;
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
	protected JComponent createHandle()
	{
		JLabel label = new JLabel(ROTATE_ICON);
		label.setSize(ROTATE_ICON.getIconWidth(), ROTATE_ICON.getIconHeight());
		label.setOpaque(false);

		return label;
	}

	/**
	 * 
	 */
	public boolean isStateHandled(mxCellState state)
	{
		return graphComponent.getGraph().getModel().isVertex(state.getCell());
	}

	/**
	 * 
	 */
	public void mousePressed(MouseEvent e)
	{
		if (currentState != null && handle.getParent() != null
				&& e.getSource() == handle /* mouse hits handle */)
		{
			start(e);
			e.consume();
		}
	}

	/**
	 * 
	 */
	public void start(MouseEvent e)
	{
		initialAngle = mxUtils.getDouble(currentState.getStyle(),
				mxConstants.STYLE_ROTATION) * mxConstants.RAD_PER_DEG;
		currentAngle = initialAngle;
		first = SwingUtilities.convertPoint(e.getComponent(), e.getPoint(),
				graphComponent.getGraphControl());

		if (!graphComponent.getGraph().isCellSelected(currentState.getCell()))
		{
			graphComponent.selectCellForEvent(currentState.getCell(), e);
		}
	}

	/**
	 * 
	 */
	public void mouseMoved(MouseEvent e)
	{
		if (graphComponent.isEnabled() && isEnabled())
		{
			if (handle.getParent() != null && e.getSource() == handle /* mouse hits handle */)
			{
				graphComponent.getGraphControl().setCursor(
						new Cursor(Cursor.HAND_CURSOR));
				e.consume();
			}
			else if (currentState == null
					|| !currentState.getRectangle().contains(e.getPoint()))
			{
				mxCellState eventState = graphComponent
						.getGraph()
						.getView()
						.getState(
								graphComponent.getCellAt(e.getX(), e.getY(),
										false));

				mxCellState state = null;

				if (eventState != null && isStateHandled(eventState))
				{
					state = eventState;
				}

				if (currentState != state)
				{
					currentState = state;

					if (currentState == null && handle.getParent() != null)
					{
						handle.setVisible(false);
						handle.getParent().remove(handle);
					}
					else if (currentState != null)
					{
						if (handle.getParent() == null)
						{
							// Adds component for rendering the handles (preview is separate)
							graphComponent.getGraphControl().add(handle, 0);
							handle.setVisible(true);
						}

						handle.setLocation(
								(int) (currentState.getX()
										+ currentState.getWidth()
										- handle.getWidth() - 4),
								(int) (currentState.getY()
										+ currentState.getHeight()
										- handle.getWidth() - 4));
					}
				}
			}
		}
	}

	/**
	 * 
	 */
	public void mouseDragged(MouseEvent e)
	{
		if (graphComponent.isEnabled() && isEnabled() && !e.isConsumed()
				&& first != null)
		{
			mxRectangle dirty = mxUtils.getBoundingBox(currentState,
					currentAngle * mxConstants.DEG_PER_RAD);
			Point pt = SwingUtilities.convertPoint(e.getComponent(),
					e.getPoint(), graphComponent.getGraphControl());

			double cx = currentState.getCenterX();
			double cy = currentState.getCenterY();
			double dx = pt.getX() - cx;
			double dy = pt.getY() - cy;
			double c = Math.sqrt(dx * dx + dy * dy);

			currentAngle = ((pt.getX() > cx) ? -1 : 1) * Math.acos(dy / c)
					+ PI4 + initialAngle;

			dirty.add(mxUtils.getBoundingBox(currentState, currentAngle
					* mxConstants.DEG_PER_RAD));
			dirty.grow(1);

			// TODO: Compute dirty rectangle and repaint
			graphComponent.getGraphControl().repaint(dirty.getRectangle());
			e.consume();
		}
		else if (handle.getParent() != null)
		{
			handle.getParent().remove(handle);
		}
	}

	/**
	 * 
	 */
	public void mouseReleased(MouseEvent e)
	{
		if (graphComponent.isEnabled() && isEnabled() && !e.isConsumed()
				&& first != null)
		{
			double deg = 0;
			Object cell = null;

			if (currentState != null)
			{
				cell = currentState.getCell();
				/*deg = mxUtils.getDouble(currentState.getStyle(),
						mxConstants.STYLE_ROTATION);*/
			}

			deg += currentAngle * mxConstants.DEG_PER_RAD;
			boolean willExecute = cell != null && first != null;

			// TODO: Call reset before execute in all handlers that
			// offer an execute method
			reset();

			if (graphComponent.isEnabled() && isEnabled() && !e.isConsumed()
					&& willExecute)
			{
				graphComponent.getGraph().setCellStyles(
						mxConstants.STYLE_ROTATION, String.valueOf(deg),
						new Object[] { cell });

				graphComponent.getGraphControl().repaint();

				e.consume();
			}
		}

		currentState = null;
	}

	/**
	 * 
	 */
	public void reset()
	{
		if (handle.getParent() != null)
		{
			handle.getParent().remove(handle);
		}

		mxRectangle dirty = null;

		if (currentState != null && first != null)
		{
			dirty = mxUtils.getBoundingBox(currentState, currentAngle
					* mxConstants.DEG_PER_RAD);
			dirty.grow(1);
		}

		currentState = null;
		currentAngle = 0;
		first = null;

		if (dirty != null)
		{
			graphComponent.getGraphControl().repaint(dirty.getRectangle());
		}
	}

	/**
	 *
	 */
	public void paint(Graphics g)
	{
		if (currentState != null && first != null)
		{
			Rectangle rect = currentState.getRectangle();
			double deg = currentAngle * mxConstants.DEG_PER_RAD;

			if (deg != 0)
			{
				((Graphics2D) g).rotate(Math.toRadians(deg),
						currentState.getCenterX(), currentState.getCenterY());
			}

			mxUtils.setAntiAlias((Graphics2D) g, true, false);
			g.drawRect(rect.x, rect.y, rect.width, rect.height);
		}
	}

}
