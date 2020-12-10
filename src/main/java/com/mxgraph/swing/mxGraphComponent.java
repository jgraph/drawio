/**
 * Copyright (c) 2009-2010, Gaudenz Alder, David Benson
 */
package com.mxgraph.swing;

import java.awt.BasicStroke;
import java.awt.Color;
import java.awt.Component;
import java.awt.Cursor;
import java.awt.Dimension;
import java.awt.Graphics;
import java.awt.Graphics2D;
import java.awt.Point;
import java.awt.Rectangle;
import java.awt.RenderingHints;
import java.awt.Stroke;
import java.awt.event.ComponentAdapter;
import java.awt.event.ComponentEvent;
import java.awt.event.KeyAdapter;
import java.awt.event.KeyEvent;
import java.awt.event.MouseAdapter;
import java.awt.event.MouseEvent;
import java.awt.event.MouseListener;
import java.awt.event.MouseMotionListener;
import java.awt.image.BufferedImage;
import java.awt.print.PageFormat;
import java.awt.print.Printable;
import java.beans.PropertyChangeEvent;
import java.beans.PropertyChangeListener;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collection;
import java.util.EventObject;
import java.util.Hashtable;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.swing.BorderFactory;
import javax.swing.BoundedRangeModel;
import javax.swing.ImageIcon;
import javax.swing.JComponent;
import javax.swing.JPanel;
import javax.swing.JScrollBar;
import javax.swing.JScrollPane;
import javax.swing.RepaintManager;
import javax.swing.SwingUtilities;
import javax.swing.ToolTipManager;
import javax.swing.TransferHandler;

import com.mxgraph.canvas.mxGraphics2DCanvas;
import com.mxgraph.canvas.mxICanvas;
import com.mxgraph.model.mxGraphModel;
import com.mxgraph.model.mxGraphModel.Filter;
import com.mxgraph.model.mxIGraphModel;
import com.mxgraph.swing.handler.mxCellHandler;
import com.mxgraph.swing.handler.mxConnectionHandler;
import com.mxgraph.swing.handler.mxEdgeHandler;
import com.mxgraph.swing.handler.mxElbowEdgeHandler;
import com.mxgraph.swing.handler.mxGraphHandler;
import com.mxgraph.swing.handler.mxGraphTransferHandler;
import com.mxgraph.swing.handler.mxPanningHandler;
import com.mxgraph.swing.handler.mxSelectionCellsHandler;
import com.mxgraph.swing.handler.mxVertexHandler;
import com.mxgraph.swing.util.mxCellOverlay;
import com.mxgraph.swing.util.mxICellOverlay;
import com.mxgraph.swing.view.mxCellEditor;
import com.mxgraph.swing.view.mxICellEditor;
import com.mxgraph.swing.view.mxInteractiveCanvas;
import com.mxgraph.util.mxConstants;
import com.mxgraph.util.mxEvent;
import com.mxgraph.util.mxEventObject;
import com.mxgraph.util.mxEventSource;
import com.mxgraph.util.mxEventSource.mxIEventListener;
import com.mxgraph.util.mxPoint;
import com.mxgraph.util.mxRectangle;
import com.mxgraph.util.mxResources;
import com.mxgraph.util.mxUtils;
import com.mxgraph.view.mxCellState;
import com.mxgraph.view.mxEdgeStyle;
import com.mxgraph.view.mxEdgeStyle.mxEdgeStyleFunction;
import com.mxgraph.view.mxGraph;
import com.mxgraph.view.mxGraphView;
import com.mxgraph.view.mxTemporaryCellStates;

/**
 * For setting the preferred size of the viewport for scrolling, use
 * mxGraph.setMinimumGraphSize. This component is a combined scrollpane with an
 * inner mxGraphControl. The control contains the actual graph display.
 * 
 * To set the background color of the graph, use the following code:
 * 
 * <pre>
 * graphComponent.getViewport().setOpaque(true);
 * graphComponent.getViewport().setBackground(newColor);
 * </pre>
 * 
 * This class fires the following events:
 * 
 * mxEvent.START_EDITING fires before starting the in-place editor for an
 * existing cell in startEditingAtCell. The <code>cell</code> property contains
 * the cell that is being edit and the <code>event</code> property contains
 * optional EventObject which was passed to startEditingAtCell.
 * 
 * mxEvent.LABEL_CHANGED fires between begin- and endUpdate after the call to
 * mxGraph.cellLabelChanged in labelChanged. The <code>cell</code> property
 * contains the cell, the <code>value</code> property contains the new value for
 * the cell and the optional <code>event</code> property contains the
 * EventObject that started the edit.
 * 
 * mxEvent.ADD_OVERLAY and mxEvent.REMOVE_OVERLAY fire afer an overlay was added
 * or removed using add-/removeOverlay. The <code>cell</code> property contains
 * the cell for which the overlay was added or removed and the
 * <code>overlay</code> property contain the mxOverlay.
 * 
 * mxEvent.BEFORE_PAINT and mxEvent.AFTER_PAINT fire before and after the paint
 * method is called on the component. The <code>g</code> property contains the
 * graphics context which is used for painting.
 */
public class mxGraphComponent extends JScrollPane implements Printable
{

	private static final Logger log = Logger.getLogger(mxGraphComponent.class.getName());

	/**
	 * 
	 */
	private static final long serialVersionUID = -30203858391633447L;

	/**
	 * 
	 */
	public static final int GRID_STYLE_DOT = 0;

	/**
	 * 
	 */
	public static final int GRID_STYLE_CROSS = 1;

	/**
	 * 
	 */
	public static final int GRID_STYLE_LINE = 2;

	/**
	 * 
	 */
	public static final int GRID_STYLE_DASHED = 3;

	/**
	 * 
	 */
	public static final int ZOOM_POLICY_NONE = 0;

	/**
	 * 
	 */
	public static final int ZOOM_POLICY_PAGE = 1;

	/**
	 * 
	 */
	public static final int ZOOM_POLICY_WIDTH = 2;

	/**
	 * 
	 */
	public static ImageIcon DEFAULT_EXPANDED_ICON = null;

	/**
	 * 
	 */
	public static ImageIcon DEFAULT_COLLAPSED_ICON = null;

	/**
	 * 
	 */
	public static ImageIcon DEFAULT_WARNING_ICON = null;

	/**
	 * Specifies the default page scale. Default is 1.4
	 */
	public static final double DEFAULT_PAGESCALE = 1.4;

	/**
	 * Loads the collapse and expand icons.
	 */
	static
	{
		DEFAULT_EXPANDED_ICON = new ImageIcon(
				mxGraphComponent.class
						.getResource("/com/mxgraph/swing/images/expanded.gif"));
		DEFAULT_COLLAPSED_ICON = new ImageIcon(
				mxGraphComponent.class
						.getResource("/com/mxgraph/swing/images/collapsed.gif"));
		DEFAULT_WARNING_ICON = new ImageIcon(
				mxGraphComponent.class
						.getResource("/com/mxgraph/swing/images/warning.gif"));
	}

	/**
	 * 
	 */
	protected mxGraph graph;

	/**
	 * 
	 */
	protected mxGraphControl graphControl;

	/**
	 * 
	 */
	protected mxEventSource eventSource = new mxEventSource(this);

	/**
	 * 
	 */
	protected mxICellEditor cellEditor;

	/**
	 * 
	 */
	protected mxConnectionHandler connectionHandler;

	/**
	 * 
	 */
	protected mxPanningHandler panningHandler;

	/**
	 * 
	 */
	protected mxSelectionCellsHandler selectionCellsHandler;

	/**
	 * 
	 */
	protected mxGraphHandler graphHandler;

	/**
	 * The transparency of previewed cells from 0.0. to 0.1. 0.0 indicates
	 * transparent, 1.0 indicates opaque. Default is 1.
	 */
	protected float previewAlpha = 0.5f;

	/**
	 * Specifies the <mxImage> to be returned by <getBackgroundImage>. Default
	 * is null.
	 */
	protected ImageIcon backgroundImage;

	/**
	 * Background page format.
	 */
	protected PageFormat pageFormat = new PageFormat();

	/**
	 * 
	 */
	protected mxInteractiveCanvas canvas;

	/**
	 * 
	 */
	protected BufferedImage tripleBuffer;

	/**
	 * 
	 */
	protected Graphics2D tripleBufferGraphics;

	/**
	 * Defines the scaling for the background page metrics. Default is
	 * {@link #DEFAULT_PAGESCALE}.
	 */
	protected double pageScale = DEFAULT_PAGESCALE;

	/**
	 * Specifies if the background page should be visible. Default is false.
	 */
	protected boolean pageVisible = false;

	/**
	 * If the pageFormat should be used to determine the minimal graph bounds
	 * even if the page is not visible (see pageVisible). Default is false.
	 */
	protected boolean preferPageSize = false;

	/**
	 * Specifies if a dashed line should be drawn between multiple pages.
	 */
	protected boolean pageBreaksVisible = true;

	/**
	 * Specifies the color of page breaks
	 */
	protected Color pageBreakColor = Color.darkGray;

	/**
	 * Specifies the number of pages in the horizontal direction.
	 */
	protected int horizontalPageCount = 1;

	/**
	 * Specifies the number of pages in the vertical direction.
	 */
	protected int verticalPageCount = 1;

	/**
	 * Specifies if the background page should be centered by automatically
	 * setting the translate in the view. Default is true. This does only apply
	 * if pageVisible is true.
	 */
	protected boolean centerPage = true;

	/**
	 * Color of the background area if layout view.
	 */
	protected Color pageBackgroundColor = new Color(144, 153, 174);

	/**
	 * 
	 */
	protected Color pageShadowColor = new Color(110, 120, 140);

	/**
	 * 
	 */
	protected Color pageBorderColor = Color.black;

	/**
	 * Specifies if the grid is visible. Default is false.
	 */
	protected boolean gridVisible = false;

	/**
	 * 
	 */
	protected Color gridColor = new Color(192, 192, 192);

	/**
	 * Whether or not to scroll the scrollable container the graph exists in if
	 * a suitable handler is active and the graph bounds already exist extended
	 * in the direction of mouse travel.
	 */
	protected boolean autoScroll = true;

	/**
	 * Whether to extend the graph bounds and scroll towards the limit of those
	 * new bounds in the direction of mouse travel if a handler is active while
	 * the mouse leaves the container that the graph exists in.
	 */
	protected boolean autoExtend = true;

	/**
	 * 
	 */
	protected boolean dragEnabled = true;

	/**
	 * 
	 */
	protected boolean importEnabled = true;

	/**
	 * 
	 */
	protected boolean exportEnabled = true;

	/**
	 * Specifies if folding (collapse and expand via an image icon in the graph
	 * should be enabled). Default is true.
	 */
	protected boolean foldingEnabled = true;

	/**
	 * Specifies the tolerance for mouse clicks. Default is 4.
	 */
	protected int tolerance = 4;

	/**
	 * Specifies if swimlanes are selected when the mouse is released over the
	 * swimlanes content area. Default is true.
	 */
	protected boolean swimlaneSelectionEnabled = true;

	/**
	 * Specifies if the content area should be transparent to events. Default is
	 * true.
	 */
	protected boolean transparentSwimlaneContent = true;

	/**
	 * 
	 */
	protected int gridStyle = GRID_STYLE_DOT;

	/**
	 * 
	 */
	protected ImageIcon expandedIcon = DEFAULT_EXPANDED_ICON;

	/**
	 * 
	 */
	protected ImageIcon collapsedIcon = DEFAULT_COLLAPSED_ICON;

	/**
	 * 
	 */
	protected ImageIcon warningIcon = DEFAULT_WARNING_ICON;

	/**
	 * 
	 */
	protected boolean antiAlias = true;

	/**
	 * 
	 */
	protected boolean textAntiAlias = true;

	/**
	 * Specifies <escape> should be invoked when the escape key is pressed.
	 * Default is true.
	 */
	protected boolean escapeEnabled = true;

	/**
	 * If true, when editing is to be stopped by way of selection changing, data
	 * in diagram changing or other means stopCellEditing is invoked, and
	 * changes are saved. This is implemented in a mouse listener in this class.
	 * Default is true.
	 */
	protected boolean invokesStopCellEditing = true;

	/**
	 * If true, pressing the enter key without pressing control will stop
	 * editing and accept the new value. This is used in <mxKeyHandler> to stop
	 * cell editing. Default is false.
	 */
	protected boolean enterStopsCellEditing = false;

	/**
	 * Specifies the zoom policy. Default is ZOOM_POLICY_PAGE. The zoom policy
	 * does only apply if pageVisible is true.
	 */
	protected int zoomPolicy = ZOOM_POLICY_PAGE;

	/**
	 * Internal flag to not reset zoomPolicy when zoom was set automatically.
	 */
	private transient boolean zooming = false;

	/**
	 * Specifies the factor used for zoomIn and zoomOut. Default is 1.2 (120%).
	 */
	protected double zoomFactor = 1.2;

	/**
	 * Specifies if the viewport should automatically contain the selection
	 * cells after a zoom operation. Default is false.
	 */
	protected boolean keepSelectionVisibleOnZoom = false;

	/**
	 * Specifies if the zoom operations should go into the center of the actual
	 * diagram rather than going from top, left. Default is true.
	 */
	protected boolean centerZoom = true;

	/**
	 * Specifies if an image buffer should be used for painting the component.
	 * Default is false.
	 */
	protected boolean tripleBuffered = false;

	/**
	 * Used for debugging the dirty region.
	 */
	public boolean showDirtyRectangle = false;

	/**
	 * Maps from cells to lists of heavyweights.
	 */
	protected Hashtable<Object, Component[]> components = new Hashtable<Object, Component[]>();

	/**
	 * Maps from cells to lists of overlays.
	 */
	protected Hashtable<Object, mxICellOverlay[]> overlays = new Hashtable<Object, mxICellOverlay[]>();

	/**
	 * Boolean flag to disable centering after the first time.
	 */
	private transient boolean centerOnResize = true;

	/**
	 * Updates the heavyweight component structure after any changes.
	 */
	protected mxIEventListener updateHandler = new mxIEventListener()
	{
		public void invoke(Object sender, mxEventObject evt)
		{
			updateComponents();
			graphControl.updatePreferredSize();
		}
	};

	/**
	 * 
	 */
	protected mxIEventListener repaintHandler = new mxIEventListener()
	{
		public void invoke(Object source, mxEventObject evt)
		{
			mxRectangle dirty = (mxRectangle) evt.getProperty("region");
			Rectangle rect = (dirty != null) ? dirty.getRectangle() : null;

			if (rect != null)
			{
				rect.grow(1, 1);
			}

			// Updates the triple buffer
			repaintTripleBuffer(rect);

			// Repaints the control using the optional triple buffer
			graphControl.repaint((rect != null) ? rect : getViewport()
					.getViewRect());

			// ----------------------------------------------------------
			// Shows the dirty region as a red rectangle (for debugging)
			JPanel panel = (JPanel) getClientProperty("dirty");

			if (showDirtyRectangle)
			{
				if (panel == null)
				{
					panel = new JPanel();
					panel.setOpaque(false);
					panel.setBorder(BorderFactory.createLineBorder(Color.RED));

					putClientProperty("dirty", panel);
					graphControl.add(panel);
				}

				if (dirty != null)
				{
					panel.setBounds(dirty.getRectangle());
				}

				panel.setVisible(dirty != null);
			}
			else if (panel != null && panel.getParent() != null)
			{
				panel.getParent().remove(panel);
				putClientProperty("dirty", null);
				repaint();
			}
			// ----------------------------------------------------------
		}
	};

	/**
	 * 
	 */
	protected PropertyChangeListener viewChangeHandler = new PropertyChangeListener()
	{
		/**
		 * 
		 */
		public void propertyChange(PropertyChangeEvent evt)
		{
			if (evt.getPropertyName().equals("view"))
			{
				mxGraphView oldView = (mxGraphView) evt.getOldValue();
				mxGraphView newView = (mxGraphView) evt.getNewValue();

				if (oldView != null)
				{
					oldView.removeListener(updateHandler);
				}

				if (newView != null)
				{
					newView.addListener(mxEvent.SCALE, updateHandler);
					newView.addListener(mxEvent.TRANSLATE, updateHandler);
					newView.addListener(mxEvent.SCALE_AND_TRANSLATE,
							updateHandler);
					newView.addListener(mxEvent.UP, updateHandler);
					newView.addListener(mxEvent.DOWN, updateHandler);
				}
			}
			else if (evt.getPropertyName().equals("model"))
			{
				mxGraphModel oldModel = (mxGraphModel) evt.getOldValue();
				mxGraphModel newModel = (mxGraphModel) evt.getNewValue();

				if (oldModel != null)
				{
					oldModel.removeListener(updateHandler);
				}

				if (newModel != null)
				{
					newModel.addListener(mxEvent.CHANGE, updateHandler);
				}
			}
		}

	};

	/**
	 * Resets the zoom policy if the scale is changed manually.
	 */
	protected mxIEventListener scaleHandler = new mxIEventListener()
	{
		/**
		 * 
		 */
		public void invoke(Object sender, mxEventObject evt)
		{
			if (!zooming)
			{
				zoomPolicy = ZOOM_POLICY_NONE;
			}
		}
	};

	/**
	 * 
	 * @param graph
	 */
	public mxGraphComponent(mxGraph graph)
	{
		setCellEditor(createCellEditor());
		canvas = createCanvas();

		// Initializes the buffered view and
		graphControl = createGraphControl();
		installFocusHandler();
		installKeyHandler();
		installResizeHandler();
		setGraph(graph);

		// Adds the viewport view and initializes handlers
		setViewportView(graphControl);
		createHandlers();
		installDoubleClickHandler();
	}

	/**
	 * installs a handler to set the focus to the container.
	 */
	protected void installFocusHandler()
	{
		graphControl.addMouseListener(new MouseAdapter()
		{
			public void mousePressed(MouseEvent e)
			{
				if (!hasFocus())
				{
					requestFocus();
				}
			}
		});
	}

	/**
	 * Handles escape keystrokes.
	 */
	protected void installKeyHandler()
	{
		addKeyListener(new KeyAdapter()
		{
			public void keyPressed(KeyEvent e)
			{
				if (e.getKeyCode() == KeyEvent.VK_ESCAPE && isEscapeEnabled())
				{
					escape(e);
				}
			}
		});
	}

	/**
	 * Applies the zoom policy if the size of the component changes.
	 */
	protected void installResizeHandler()
	{
		addComponentListener(new ComponentAdapter()
		{
			public void componentResized(ComponentEvent e)
			{
				zoomAndCenter();
			}
		});
	}

	/**
	 * Adds handling of edit and stop-edit events after all other handlers have
	 * been installed.
	 */
	protected void installDoubleClickHandler()
	{
		graphControl.addMouseListener(new MouseAdapter()
		{
			public void mouseReleased(MouseEvent e)
			{
				if (isEnabled())
				{
					if (!e.isConsumed() && isEditEvent(e))
					{
						Object cell = getCellAt(e.getX(), e.getY(), false);

						if (cell != null && getGraph().isCellEditable(cell))
						{
							startEditingAtCell(cell, e);
						}
					}
					else
					{
						// Other languages use focus traversal here, in Java
						// we explicitely stop editing after a click elsewhere
						stopEditing(!invokesStopCellEditing);
					}
				}
			}

		});
	}

	/**
	 * 
	 */
	protected mxICellEditor createCellEditor()
	{
		return new mxCellEditor(this);
	}

	/**
	 * 
	 */
	public void setGraph(mxGraph value)
	{
		mxGraph oldValue = graph;

		// Uninstalls listeners for existing graph
		if (graph != null)
		{
			graph.removeListener(repaintHandler);
			graph.getModel().removeListener(updateHandler);
			graph.getView().removeListener(updateHandler);
			graph.removePropertyChangeListener(viewChangeHandler);
			graph.getView().removeListener(scaleHandler);
		}

		graph = value;

		// Updates the buffer if the model changes
		graph.addListener(mxEvent.REPAINT, repaintHandler);

		// Installs the update handler to sync the overlays and controls
		graph.getModel().addListener(mxEvent.CHANGE, updateHandler);

		// Repaint after the following events is handled via
		// mxGraph.repaint-events
		// The respective handlers are installed in mxGraph.setView
		mxGraphView view = graph.getView();

		view.addListener(mxEvent.SCALE, updateHandler);
		view.addListener(mxEvent.TRANSLATE, updateHandler);
		view.addListener(mxEvent.SCALE_AND_TRANSLATE, updateHandler);
		view.addListener(mxEvent.UP, updateHandler);
		view.addListener(mxEvent.DOWN, updateHandler);

		graph.addPropertyChangeListener(viewChangeHandler);

		// Resets the zoom policy if the scale changes
		graph.getView().addListener(mxEvent.SCALE, scaleHandler);
		graph.getView().addListener(mxEvent.SCALE_AND_TRANSLATE, scaleHandler);

		// Invoke the update handler once for initial state
		updateHandler.invoke(graph.getView(), null);

		firePropertyChange("graph", oldValue, graph);
	}

	/**
	 * 
	 * @return Returns the object that contains the graph.
	 */
	public mxGraph getGraph()
	{
		return graph;
	}

	/**
	 * Creates the inner control that handles tooltips, preferred size and can
	 * draw cells onto a canvas.
	 */
	protected mxGraphControl createGraphControl()
	{
		return new mxGraphControl();
	}

	/**
	 * 
	 * @return Returns the control that renders the graph.
	 */
	public mxGraphControl getGraphControl()
	{
		return graphControl;
	}

	/**
	 * Creates the connection-, panning and graphhandler (in this order).
	 */
	protected void createHandlers()
	{
		setTransferHandler(createTransferHandler());
		panningHandler = createPanningHandler();
		selectionCellsHandler = createSelectionCellsHandler();
		connectionHandler = createConnectionHandler();
		graphHandler = createGraphHandler();
	}

	/**
	 * 
	 */
	protected TransferHandler createTransferHandler()
	{
		return new mxGraphTransferHandler();
	}

	/**
	 *
	 */
	protected mxSelectionCellsHandler createSelectionCellsHandler()
	{
		return new mxSelectionCellsHandler(this);
	}

	/**
	 *
	 */
	protected mxGraphHandler createGraphHandler()
	{
		return new mxGraphHandler(this);
	}

	/**
	 * 
	 */
	public mxSelectionCellsHandler getSelectionCellsHandler()
	{
		return selectionCellsHandler;
	}

	/**
	 * 
	 */
	public mxGraphHandler getGraphHandler()
	{
		return graphHandler;
	}

	/**
	 *
	 */
	protected mxConnectionHandler createConnectionHandler()
	{
		return new mxConnectionHandler(this);
	}

	/**
	 * 
	 */
	public mxConnectionHandler getConnectionHandler()
	{
		return connectionHandler;
	}

	/**
	 *
	 */
	protected mxPanningHandler createPanningHandler()
	{
		return new mxPanningHandler(this);
	}

	/**
	 * 
	 */
	public mxPanningHandler getPanningHandler()
	{
		return panningHandler;
	}

	/**
	 * 
	 */
	public boolean isEditing()
	{
		return getCellEditor().getEditingCell() != null;
	}

	/**
	 * 
	 */
	public mxICellEditor getCellEditor()
	{
		return cellEditor;
	}

	/**
	 * 
	 */
	public void setCellEditor(mxICellEditor value)
	{
		mxICellEditor oldValue = cellEditor;
		cellEditor = value;

		firePropertyChange("cellEditor", oldValue, cellEditor);
	}

	/**
	 * @return the tolerance
	 */
	public int getTolerance()
	{
		return tolerance;
	}

	/**
	 * @param value
	 *            the tolerance to set
	 */
	public void setTolerance(int value)
	{
		int oldValue = tolerance;
		tolerance = value;

		firePropertyChange("tolerance", oldValue, tolerance);
	}

	/**
	 * 
	 */
	public PageFormat getPageFormat()
	{
		return pageFormat;
	}

	/**
	 * 
	 */
	public void setPageFormat(PageFormat value)
	{
		PageFormat oldValue = pageFormat;
		pageFormat = value;

		firePropertyChange("pageFormat", oldValue, pageFormat);
	}

	/**
	 * 
	 */
	public double getPageScale()
	{
		return pageScale;
	}

	/**
	 * 
	 */
	public void setPageScale(double value)
	{
		double oldValue = pageScale;
		pageScale = value;

		firePropertyChange("pageScale", oldValue, pageScale);
	}

	/**
	 * Returns the size of the area that layouts can operate in.
	 */
	public mxRectangle getLayoutAreaSize()
	{
		if (pageVisible)
		{
			Dimension d = getPreferredSizeForPage();

			return new mxRectangle(new Rectangle(d));
		}
		else
		{
			return new mxRectangle(new Rectangle(graphControl.getSize()));
		}
	}

	/**
	 * 
	 */
	public ImageIcon getBackgroundImage()
	{
		return backgroundImage;
	}

	/**
	 * 
	 */
	public void setBackgroundImage(ImageIcon value)
	{
		ImageIcon oldValue = backgroundImage;
		backgroundImage = value;

		firePropertyChange("backgroundImage", oldValue, backgroundImage);
	}

	/**
	 * @return the pageVisible
	 */
	public boolean isPageVisible()
	{
		return pageVisible;
	}

	/**
	 * Fires a property change event for <code>pageVisible</code>. zoomAndCenter
	 * should be called if this is set to true.
	 * 
	 * @param value
	 *            the pageVisible to set
	 */
	public void setPageVisible(boolean value)
	{
		boolean oldValue = pageVisible;
		pageVisible = value;

		firePropertyChange("pageVisible", oldValue, pageVisible);
	}

	/**
	 * @return the preferPageSize
	 */
	public boolean isPreferPageSize()
	{
		return preferPageSize;
	}

	/**
	 * Fires a property change event for <code>preferPageSize</code>.
	 * 
	 * @param value
	 *            the preferPageSize to set
	 */
	public void setPreferPageSize(boolean value)
	{
		boolean oldValue = preferPageSize;
		preferPageSize = value;

		firePropertyChange("preferPageSize", oldValue, preferPageSize);
	}

	/**
	 * @return the pageBreaksVisible
	 */
	public boolean isPageBreaksVisible()
	{
		return pageBreaksVisible;
	}

	/**
	 * @param value
	 *            the pageBreaksVisible to set
	 */
	public void setPageBreaksVisible(boolean value)
	{
		boolean oldValue = pageBreaksVisible;
		pageBreaksVisible = value;

		firePropertyChange("pageBreaksVisible", oldValue, pageBreaksVisible);
	}

	/**
	 * @return the pageBreakColor
	 */
	public Color getPageBreakColor()
	{
		return pageBreakColor;
	}

	/**
	 * @param pageBreakColor the pageBreakColor to set
	 */
	public void setPageBreakColor(Color pageBreakColor)
	{
		this.pageBreakColor = pageBreakColor;
	}

	/**
	 * @param value
	 *            the horizontalPageCount to set
	 */
	public void setHorizontalPageCount(int value)
	{
		int oldValue = horizontalPageCount;
		horizontalPageCount = value;

		firePropertyChange("horizontalPageCount", oldValue, horizontalPageCount);
	}

	/**
	 * 
	 */
	public int getHorizontalPageCount()
	{
		return horizontalPageCount;
	}

	/**
	 * @param value
	 *            the verticalPageCount to set
	 */
	public void setVerticalPageCount(int value)
	{
		int oldValue = verticalPageCount;
		verticalPageCount = value;

		firePropertyChange("verticalPageCount", oldValue, verticalPageCount);
	}

	/**
	 * 
	 */
	public int getVerticalPageCount()
	{
		return verticalPageCount;
	}

	/**
	 * @return the centerPage
	 */
	public boolean isCenterPage()
	{
		return centerPage;
	}

	/**
	 * zoomAndCenter should be called if this is set to true.
	 * 
	 * @param value
	 *            the centerPage to set
	 */
	public void setCenterPage(boolean value)
	{
		boolean oldValue = centerPage;
		centerPage = value;

		firePropertyChange("centerPage", oldValue, centerPage);
	}

	/**
	 * @return the pageBackgroundColor
	 */
	public Color getPageBackgroundColor()
	{
		return pageBackgroundColor;
	}

	/**
	 * Sets the color that appears behind the page.
	 * 
	 * @param value
	 *            the pageBackgroundColor to set
	 */
	public void setPageBackgroundColor(Color value)
	{
		Color oldValue = pageBackgroundColor;
		pageBackgroundColor = value;

		firePropertyChange("pageBackgroundColor", oldValue, pageBackgroundColor);
	}

	/**
	 * @return the pageShadowColor
	 */
	public Color getPageShadowColor()
	{
		return pageShadowColor;
	}

	/**
	 * @param value
	 *            the pageShadowColor to set
	 */
	public void setPageShadowColor(Color value)
	{
		Color oldValue = pageShadowColor;
		pageShadowColor = value;

		firePropertyChange("pageShadowColor", oldValue, pageShadowColor);
	}

	/**
	 * @return the pageShadowColor
	 */
	public Color getPageBorderColor()
	{
		return pageBorderColor;
	}

	/**
	 * @param value
	 *            the pageBorderColor to set
	 */
	public void setPageBorderColor(Color value)
	{
		Color oldValue = pageBorderColor;
		pageBorderColor = value;

		firePropertyChange("pageBorderColor", oldValue, pageBorderColor);
	}

	/**
	 * @return the keepSelectionVisibleOnZoom
	 */
	public boolean isKeepSelectionVisibleOnZoom()
	{
		return keepSelectionVisibleOnZoom;
	}

	/**
	 * @param value
	 *            the keepSelectionVisibleOnZoom to set
	 */
	public void setKeepSelectionVisibleOnZoom(boolean value)
	{
		boolean oldValue = keepSelectionVisibleOnZoom;
		keepSelectionVisibleOnZoom = value;

		firePropertyChange("keepSelectionVisibleOnZoom", oldValue,
				keepSelectionVisibleOnZoom);
	}

	/**
	 * @return the zoomFactor
	 */
	public double getZoomFactor()
	{
		return zoomFactor;
	}

	/**
	 * @param value
	 *            the zoomFactor to set
	 */
	public void setZoomFactor(double value)
	{
		double oldValue = zoomFactor;
		zoomFactor = value;

		firePropertyChange("zoomFactor", oldValue, zoomFactor);
	}

	/**
	 * @return the centerZoom
	 */
	public boolean isCenterZoom()
	{
		return centerZoom;
	}

	/**
	 * @param value
	 *            the centerZoom to set
	 */
	public void setCenterZoom(boolean value)
	{
		boolean oldValue = centerZoom;
		centerZoom = value;

		firePropertyChange("centerZoom", oldValue, centerZoom);
	}

	/**
	 * 
	 */
	public void setZoomPolicy(int value)
	{
		int oldValue = zoomPolicy;
		zoomPolicy = value;

		if (zoomPolicy != ZOOM_POLICY_NONE)
		{
			zoom(zoomPolicy == ZOOM_POLICY_PAGE, true);
		}

		firePropertyChange("zoomPolicy", oldValue, zoomPolicy);
	}

	/**
	 * 
	 */
	public int getZoomPolicy()
	{
		return zoomPolicy;
	}

	/**
	 * Callback to process an escape keystroke.
	 * 
	 * @param e
	 */
	public void escape(KeyEvent e)
	{
		if (selectionCellsHandler != null)
		{
			selectionCellsHandler.reset();
		}

		if (connectionHandler != null)
		{
			connectionHandler.reset();
		}

		if (graphHandler != null)
		{
			graphHandler.reset();
		}

		if (cellEditor != null)
		{
			cellEditor.stopEditing(true);
		}
	}

	/**
	 * Clones and inserts the given cells into the graph using the move method
	 * and returns the inserted cells. This shortcut is used if cells are
	 * inserted via datatransfer.
	 */
	public Object[] importCells(Object[] cells, double dx, double dy,
			Object target, Point location)
	{
		return graph.moveCells(cells, dx, dy, true, target, location);
	}

	/**
	 * Refreshes the display and handles.
	 */
	public void refresh()
	{
		graph.refresh();
		selectionCellsHandler.refresh();
	}

	/**
	 * Returns an mxPoint representing the given event in the unscaled,
	 * non-translated coordinate space and applies the grid.
	 */
	public mxPoint getPointForEvent(MouseEvent e)
	{
		return getPointForEvent(e, true);
	}

	/**
	 * Returns an mxPoint representing the given event in the unscaled,
	 * non-translated coordinate space and applies the grid.
	 */
	public mxPoint getPointForEvent(MouseEvent e, boolean addOffset)
	{
		double s = graph.getView().getScale();
		mxPoint tr = graph.getView().getTranslate();

		double off = (addOffset) ? graph.getGridSize() / 2 : 0;
		double x = graph.snap(e.getX() / s - tr.getX() - off);
		double y = graph.snap(e.getY() / s - tr.getY() - off);

		return new mxPoint(x, y);
	}

	/**
	 * 
	 */
	public void startEditing()
	{
		startEditingAtCell(null);
	}

	/**
	 * 
	 */
	public void startEditingAtCell(Object cell)
	{
		startEditingAtCell(cell, null);
	}

	/**
	 * 
	 */
	public void startEditingAtCell(Object cell, EventObject evt)
	{
		if (cell == null)
		{
			cell = graph.getSelectionCell();

			if (cell != null && !graph.isCellEditable(cell))
			{
				cell = null;
			}
		}

		if (cell != null)
		{
			eventSource.fireEvent(new mxEventObject(mxEvent.START_EDITING,
					"cell", cell, "event", evt));
			cellEditor.startEditing(cell, evt);
		}
	}

	/**
	 * 
	 */
	public String getEditingValue(Object cell, EventObject trigger)
	{
		return graph.convertValueToString(cell);
	}

	/**
	 * 
	 */
	public void stopEditing(boolean cancel)
	{
		cellEditor.stopEditing(cancel);
	}

	/**
	 * Sets the label of the specified cell to the given value using
	 * mxGraph.cellLabelChanged and fires mxEvent.LABEL_CHANGED while the
	 * transaction is in progress. Returns the cell whose label was changed.
	 * 
	 * @param cell
	 *            Cell whose label should be changed.
	 * @param value
	 *            New value of the label.
	 * @param evt
	 *            Optional event that triggered the change.
	 */
	public Object labelChanged(Object cell, Object value, EventObject evt)
	{
		mxIGraphModel model = graph.getModel();

		model.beginUpdate();
		try
		{
			graph.cellLabelChanged(cell, value, graph.isAutoSizeCell(cell));
			eventSource.fireEvent(new mxEventObject(mxEvent.LABEL_CHANGED,
					"cell", cell, "value", value, "event", evt));
		}
		finally
		{
			model.endUpdate();
		}

		return cell;
	}

	/**
	 * Returns the (unscaled) preferred size for the current page format (scaled
	 * by pageScale).
	 */
	protected Dimension getPreferredSizeForPage()
	{
		return new Dimension((int) Math.round(pageFormat.getWidth() * pageScale
				* horizontalPageCount), (int) Math.round(pageFormat.getHeight()
				* pageScale * verticalPageCount));
	}

	/**
	 * Returns the vertical border between the page and the control.
	 */
	public int getVerticalPageBorder()
	{
		return (int) Math.round(pageFormat.getWidth() * pageScale);
	}

	/**
	 * Returns the horizontal border between the page and the control.
	 */
	public int getHorizontalPageBorder()
	{
		return (int) Math.round(0.5 * pageFormat.getHeight() * pageScale);
	}

	/**
	 * Returns the scaled preferred size for the current graph.
	 */
	protected Dimension getScaledPreferredSizeForGraph()
	{
		mxRectangle bounds = graph.getGraphBounds();
		int border = graph.getBorder();

		return new Dimension(
				(int) Math.round(bounds.getX() + bounds.getWidth()) + border
						+ 1, (int) Math.round(bounds.getY()
						+ bounds.getHeight())
						+ border + 1);
	}

	/**
	 * Should be called by a hook inside mxGraphView/mxGraph
	 */
	protected mxPoint getPageTranslate(double scale)
	{
		Dimension d = getPreferredSizeForPage();
		Dimension bd = new Dimension(d);

		if (!preferPageSize)
		{
			bd.width += 2 * getHorizontalPageBorder();
			bd.height += 2 * getVerticalPageBorder();
		}

		double width = Math.max(bd.width, (getViewport().getWidth() - 8)
				/ scale);
		double height = Math.max(bd.height, (getViewport().getHeight() - 8)
				/ scale);

		double dx = Math.max(0, (width - d.width) / 2);
		double dy = Math.max(0, (height - d.height) / 2);

		return new mxPoint(dx, dy);
	}

	/**
	 * Invoked after the component was resized to update the zoom if the zoom
	 * policy is not none and/or update the translation of the diagram if
	 * pageVisible and centerPage are true.
	 */
	public void zoomAndCenter()
	{
		if (zoomPolicy != ZOOM_POLICY_NONE)
		{
			// Centers only on the initial zoom call
			zoom(zoomPolicy == ZOOM_POLICY_PAGE, centerOnResize
					|| zoomPolicy == ZOOM_POLICY_PAGE);
			centerOnResize = false;
		}
		else if (pageVisible && centerPage)
		{
			mxPoint translate = getPageTranslate(graph.getView().getScale());
			graph.getView().setTranslate(translate);
		}
		else
		{
			getGraphControl().updatePreferredSize();
		}
	}

	/**
	 * Zooms into the graph by zoomFactor.
	 */
	public void zoomIn()
	{
		zoom(zoomFactor);
	}

	/**
	 * Function: zoomOut
	 * 
	 * Zooms out of the graph by <zoomFactor>.
	 */
	public void zoomOut()
	{
		zoom(1 / zoomFactor);
	}

	/**
	 * 
	 */
	public void zoom(double factor)
	{
		mxGraphView view = graph.getView();
		double newScale = (double) ((int) (view.getScale() * 100 * factor)) / 100;

		if (newScale != view.getScale() && newScale > 0.04)
		{
			mxPoint translate = (pageVisible && centerPage) ? getPageTranslate(newScale)
					: new mxPoint();
			graph.getView().scaleAndTranslate(newScale, translate.getX(),
					translate.getY());

			if (keepSelectionVisibleOnZoom && !graph.isSelectionEmpty())
			{
				getGraphControl().scrollRectToVisible(
						view.getBoundingBox(graph.getSelectionCells())
								.getRectangle());
			}
			else
			{
				maintainScrollBar(true, factor, centerZoom);
				maintainScrollBar(false, factor, centerZoom);
			}
		}
	}

	/**
	 * 
	 */
	public void zoomTo(final double newScale, final boolean center)
	{
		mxGraphView view = graph.getView();
		final double scale = view.getScale();

		mxPoint translate = (pageVisible && centerPage) ? getPageTranslate(newScale)
				: new mxPoint();
		graph.getView().scaleAndTranslate(newScale, translate.getX(),
				translate.getY());

		// Causes two repaints on the scrollpane, namely one for the scale
		// change with the new preferred size and one for the change of
		// the scrollbar position. The latter cannot be done immediately
		// because the scrollbar keeps the value <= max - extent, and if
		// max is changed the value change will trigger a syncScrollPane
		// WithViewport in BasicScrollPaneUI, which will update the value
		// for the previous maximum (ie. it must be invoked later).
		SwingUtilities.invokeLater(new Runnable()
		{
			public void run()
			{
				maintainScrollBar(true, newScale / scale, center);
				maintainScrollBar(false, newScale / scale, center);
			}
		});
	}

	/**
	 * Function: zoomActual
	 * 
	 * Resets the zoom and panning in the view.
	 */
	public void zoomActual()
	{
		mxPoint translate = (pageVisible && centerPage) ? getPageTranslate(1)
				: new mxPoint();
		graph.getView()
				.scaleAndTranslate(1, translate.getX(), translate.getY());

		if (isPageVisible())
		{
			// Causes two repaints, see zoomTo for more details
			SwingUtilities.invokeLater(new Runnable()
			{
				public void run()
				{
					Dimension pageSize = getPreferredSizeForPage();

					if (getViewport().getWidth() > pageSize.getWidth())
					{
						scrollToCenter(true);
					}
					else
					{
						JScrollBar scrollBar = getHorizontalScrollBar();

						if (scrollBar != null)
						{
							scrollBar.setValue((scrollBar.getMaximum() / 3) - 4);
						}
					}

					if (getViewport().getHeight() > pageSize.getHeight())
					{
						scrollToCenter(false);
					}
					else
					{
						JScrollBar scrollBar = getVerticalScrollBar();

						if (scrollBar != null)
						{
							scrollBar.setValue((scrollBar.getMaximum() / 4) - 4);
						}
					}
				}
			});
		}
	}

	/**
	 * 
	 */
	public void zoom(final boolean page, final boolean center)
	{
		if (pageVisible && !zooming)
		{
			zooming = true;

			try
			{
				int off = (getPageShadowColor() != null) ? 8 : 0;
				
				// Adds some extra space for the shadow and border
				double width = getViewport().getWidth() - off;
				double height = getViewport().getHeight() - off;

				Dimension d = getPreferredSizeForPage();
				double pageWidth = d.width;
				double pageHeight = d.height;

				double scaleX = width / pageWidth;
				double scaleY = (page) ? height / pageHeight : scaleX;

				// Rounds the new scale to 5% steps
				final double newScale = (double) ((int) (Math.min(scaleX,
						scaleY) * 20)) / 20;

				if (newScale > 0)
				{
					mxGraphView graphView = graph.getView();
					final double scale = graphView.getScale();
					mxPoint translate = (centerPage) ? getPageTranslate(newScale)
							: new mxPoint();
					graphView.scaleAndTranslate(newScale, translate.getX(),
							translate.getY());

					// Causes two repaints, see zoomTo for more details
					final double factor = newScale / scale;

					SwingUtilities.invokeLater(new Runnable()
					{
						public void run()
						{
							if (center)
							{
								if (page)
								{
									scrollToCenter(true);
									scrollToCenter(false);
								}
								else
								{
									scrollToCenter(true);
									maintainScrollBar(false, factor, false);
								}
							}
							else if (factor != 1)
							{
								maintainScrollBar(true, factor, false);
								maintainScrollBar(false, factor, false);
							}
						}
					});
				}
			}
			finally
			{
				zooming = false;
			}
		}
	}

	/**
	 *
	 */
	protected void maintainScrollBar(boolean horizontal, double factor,
			boolean center)
	{
		JScrollBar scrollBar = (horizontal) ? getHorizontalScrollBar()
				: getVerticalScrollBar();

		if (scrollBar != null)
		{
			BoundedRangeModel model = scrollBar.getModel();
			int newValue = (int) Math.round(model.getValue() * factor)
					+ (int) Math.round((center) ? (model.getExtent()
							* (factor - 1) / 2) : 0);
			model.setValue(newValue);
		}
	}

	/**
	 * 
	 */
	public void scrollToCenter(boolean horizontal)
	{
		JScrollBar scrollBar = (horizontal) ? getHorizontalScrollBar()
				: getVerticalScrollBar();

		if (scrollBar != null)
		{
			final BoundedRangeModel model = scrollBar.getModel();
			final int newValue = ((model.getMaximum()) / 2) - model.getExtent()
					/ 2;
			model.setValue(newValue);
		}
	}

	/**
	 * Scrolls the graph so that it shows the given cell.
	 * 
	 * @param cell
	 */
	public void scrollCellToVisible(Object cell)
	{
		scrollCellToVisible(cell, false);
	}

	/**
	 * Scrolls the graph so that it shows the given cell.
	 * 
	 * @param cell
	 */
	public void scrollCellToVisible(Object cell, boolean center)
	{
		mxCellState state = graph.getView().getState(cell);

		if (state != null)
		{
			mxRectangle bounds = state;

			if (center)
			{
				bounds = (mxRectangle) bounds.clone();

				bounds.setX(bounds.getCenterX() - getWidth() / 2);
				bounds.setWidth(getWidth());
				bounds.setY(bounds.getCenterY() - getHeight() / 2);
				bounds.setHeight(getHeight());
			}

			getGraphControl().scrollRectToVisible(bounds.getRectangle());
		}
	}

	/**
	 * 
	 * @param x
	 * @param y
	 * @return Returns the cell at the given location.
	 */
	public Object getCellAt(int x, int y)
	{
		return getCellAt(x, y, true);
	}

	/**
	 * 
	 * @param x
	 * @param y
	 * @param hitSwimlaneContent
	 * @return Returns the cell at the given location.
	 */
	public Object getCellAt(int x, int y, boolean hitSwimlaneContent)
	{
		return getCellAt(x, y, hitSwimlaneContent, null);
	}

	/**
	 * Returns the bottom-most cell that intersects the given point (x, y) in
	 * the cell hierarchy starting at the given parent.
	 * 
	 * @param x
	 *            X-coordinate of the location to be checked.
	 * @param y
	 *            Y-coordinate of the location to be checked.
	 * @param parent
	 *            <mxCell> that should be used as the root of the recursion.
	 *            Default is <defaultParent>.
	 * @return Returns the child at the given location.
	 */
	public Object getCellAt(int x, int y, boolean hitSwimlaneContent,
			Object parent)
	{
		if (parent == null)
		{
			parent = graph.getDefaultParent();
		}

		if (parent != null)
		{
			mxPoint previousTranslate = canvas.getTranslate();
			double previousScale = canvas.getScale();

			try
			{
				canvas.setScale(graph.getView().getScale());
				canvas.setTranslate(0, 0);

				mxIGraphModel model = graph.getModel();
				mxGraphView view = graph.getView();

				Rectangle hit = new Rectangle(x, y, 1, 1);
				int childCount = model.getChildCount(parent);

				for (int i = childCount - 1; i >= 0; i--)
				{
					Object cell = model.getChildAt(parent, i);
					Object result = getCellAt(x, y, hitSwimlaneContent, cell);

					if (result != null)
					{
						return result;
					}
					else if (graph.isCellVisible(cell))
					{
						mxCellState state = view.getState(cell);

						if (state != null
								&& canvas.intersects(this, hit, state)
								&& (!graph.isSwimlane(cell)
										|| hitSwimlaneContent || (transparentSwimlaneContent && !canvas
										.hitSwimlaneContent(this, state, x, y))))
						{
							return cell;
						}
					}
				}
			}
			finally
			{
				canvas.setScale(previousScale);
				canvas.setTranslate((int) previousTranslate.getX(), (int) previousTranslate.getY());
			}
		}

		return null;
	}

	/**
	 * 
	 */
	public void setSwimlaneSelectionEnabled(boolean value)
	{
		boolean oldValue = swimlaneSelectionEnabled;
		swimlaneSelectionEnabled = value;

		firePropertyChange("swimlaneSelectionEnabled", oldValue,
				swimlaneSelectionEnabled);
	}

	/**
	 * 
	 */
	public boolean isSwimlaneSelectionEnabled()
	{
		return swimlaneSelectionEnabled;
	}

	/**
	 * 
	 */
	public Object[] selectRegion(Rectangle rect, MouseEvent e)
	{
		Object[] cells = getCells(rect);

		if (cells.length > 0)
		{
			selectCellsForEvent(cells, e);
		}
		else if (!graph.isSelectionEmpty() && !e.isConsumed())
		{
			graph.clearSelection();
		}

		return cells;
	}

	/**
	 * Returns the cells inside the given rectangle.
	 * 
	 * @return Returns the cells inside the given rectangle.
	 */
	public Object[] getCells(Rectangle rect)
	{
		return getCells(rect, null);
	}

	/**
	 * Returns the children of the given parent that are contained in the given
	 * rectangle (x, y, width, height). The result is added to the optional
	 * result array, which is returned from the function. If no result array is
	 * specified then a new array is created and returned.
	 * 
	 * @return Returns the children inside the given rectangle.
	 */
	public Object[] getCells(Rectangle rect, Object parent)
	{
		Collection<Object> result = new ArrayList<Object>();

		if (rect.width > 0 || rect.height > 0)
		{
			if (parent == null)
			{
				parent = graph.getDefaultParent();
			}

			if (parent != null)
			{
				mxPoint previousTranslate = canvas.getTranslate();
				double previousScale = canvas.getScale();

				try
				{
					canvas.setScale(graph.getView().getScale());
					canvas.setTranslate(0, 0);

					mxIGraphModel model = graph.getModel();
					mxGraphView view = graph.getView();

					int childCount = model.getChildCount(parent);

					for (int i = 0; i < childCount; i++)
					{
						Object cell = model.getChildAt(parent, i);
						mxCellState state = view.getState(cell);

						if (graph.isCellVisible(cell) && state != null)
						{
							if (canvas.contains(this, rect, state))
							{
								result.add(cell);
							}
							else
							{
								result.addAll(Arrays
										.asList(getCells(rect, cell)));
							}
						}
					}
				}
				finally
				{
					canvas.setScale(previousScale);
					canvas.setTranslate(previousTranslate.getX(),
							previousTranslate.getY());
				}
			}
		}

		return result.toArray();
	}

	/**
	 * Selects the cells for the given event.
	 */
	public void selectCellsForEvent(Object[] cells, MouseEvent event)
	{
		if (isToggleEvent(event))
		{
			graph.addSelectionCells(cells);
		}
		else
		{
			graph.setSelectionCells(cells);
		}
	}

	/**
	 * Selects the cell for the given event.
	 */
	public void selectCellForEvent(Object cell, MouseEvent e)
	{
		boolean isSelected = graph.isCellSelected(cell);

		if (isToggleEvent(e))
		{
			if (isSelected)
			{
				graph.removeSelectionCell(cell);
			}
			else
			{
				graph.addSelectionCell(cell);
			}
		}
		else if (!isSelected || graph.getSelectionCount() != 1)
		{
			graph.setSelectionCell(cell);
		}
	}

	/**
	 * Returns true if the absolute value of one of the given parameters is
	 * greater than the tolerance.
	 */
	public boolean isSignificant(double dx, double dy)
	{
		return Math.abs(dx) > tolerance || Math.abs(dy) > tolerance;
	}

	/**
	 * Returns the icon used to display the collapsed state of the specified
	 * cell state. This returns null for all edges.
	 */
	public ImageIcon getFoldingIcon(mxCellState state)
	{
		if (state != null && isFoldingEnabled()
				&& !getGraph().getModel().isEdge(state.getCell()))
		{
			Object cell = state.getCell();
			boolean tmp = graph.isCellCollapsed(cell);

			if (graph.isCellFoldable(cell, !tmp))
			{
				return (tmp) ? collapsedIcon : expandedIcon;
			}
		}

		return null;
	}

	/**
	 * 
	 */
	public Rectangle getFoldingIconBounds(mxCellState state, ImageIcon icon)
	{
		mxIGraphModel model = graph.getModel();
		boolean isEdge = model.isEdge(state.getCell());
		double scale = getGraph().getView().getScale();

		int x = (int) Math.round(state.getX() + 4 * scale);
		int y = (int) Math.round(state.getY() + 4 * scale);
		int w = (int) Math.max(8, icon.getIconWidth() * scale);
		int h = (int) Math.max(8, icon.getIconHeight() * scale);

		if (isEdge)
		{
			mxPoint pt = graph.getView().getPoint(state);

			x = (int) pt.getX() - w / 2;
			y = (int) pt.getY() - h / 2;
		}

		return new Rectangle(x, y, w, h);
	}

	/**
	 *
	 */
	public boolean hitFoldingIcon(Object cell, int x, int y)
	{
		if (cell != null)
		{
			mxIGraphModel model = graph.getModel();

			// Draws the collapse/expand icons
			boolean isEdge = model.isEdge(cell);

			if (foldingEnabled && (model.isVertex(cell) || isEdge))
			{
				mxCellState state = graph.getView().getState(cell);

				if (state != null)
				{
					ImageIcon icon = getFoldingIcon(state);

					if (icon != null)
					{
						return getFoldingIconBounds(state, icon).contains(x, y);
					}
				}
			}
		}

		return false;
	}

	/**
	 * 
	 * @param enabled
	 */
	public void setToolTips(boolean enabled)
	{
		if (enabled)
		{
			ToolTipManager.sharedInstance().registerComponent(graphControl);
		}
		else
		{
			ToolTipManager.sharedInstance().unregisterComponent(graphControl);
		}
	}

	/**
	 * 
	 */
	public boolean isConnectable()
	{
		return connectionHandler.isEnabled();
	}

	/**
	 * @param connectable
	 */
	public void setConnectable(boolean connectable)
	{
		connectionHandler.setEnabled(connectable);
	}

	/**
	 * 
	 */
	public boolean isPanning()
	{
		return panningHandler.isEnabled();
	}

	/**
	 * @param enabled
	 */
	public void setPanning(boolean enabled)
	{
		panningHandler.setEnabled(enabled);
	}

	/**
	 * @return the autoScroll
	 */
	public boolean isAutoScroll()
	{
		return autoScroll;
	}

	/**
	 * @param value
	 *            the autoScroll to set
	 */
	public void setAutoScroll(boolean value)
	{
		autoScroll = value;
	}

	/**
	 * @return the autoExtend
	 */
	public boolean isAutoExtend()
	{
		return autoExtend;
	}

	/**
	 * @param value
	 *            the autoExtend to set
	 */
	public void setAutoExtend(boolean value)
	{
		autoExtend = value;
	}

	/**
	 * @return the escapeEnabled
	 */
	public boolean isEscapeEnabled()
	{
		return escapeEnabled;
	}

	/**
	 * @param value
	 *            the escapeEnabled to set
	 */
	public void setEscapeEnabled(boolean value)
	{
		boolean oldValue = escapeEnabled;
		escapeEnabled = value;

		firePropertyChange("escapeEnabled", oldValue, escapeEnabled);
	}

	/**
	 * @return the escapeEnabled
	 */
	public boolean isInvokesStopCellEditing()
	{
		return invokesStopCellEditing;
	}

	/**
	 * @param value
	 *            the invokesStopCellEditing to set
	 */
	public void setInvokesStopCellEditing(boolean value)
	{
		boolean oldValue = invokesStopCellEditing;
		invokesStopCellEditing = value;

		firePropertyChange("invokesStopCellEditing", oldValue,
				invokesStopCellEditing);
	}

	/**
	 * @return the enterStopsCellEditing
	 */
	public boolean isEnterStopsCellEditing()
	{
		return enterStopsCellEditing;
	}

	/**
	 * @param value
	 *            the enterStopsCellEditing to set
	 */
	public void setEnterStopsCellEditing(boolean value)
	{
		boolean oldValue = enterStopsCellEditing;
		enterStopsCellEditing = value;

		firePropertyChange("enterStopsCellEditing", oldValue,
				enterStopsCellEditing);
	}

	/**
	 * @return the dragEnabled
	 */
	public boolean isDragEnabled()
	{
		return dragEnabled;
	}

	/**
	 * @param value
	 *            the dragEnabled to set
	 */
	public void setDragEnabled(boolean value)
	{
		boolean oldValue = dragEnabled;
		dragEnabled = value;

		firePropertyChange("dragEnabled", oldValue, dragEnabled);
	}

	/**
	 * @return the gridVisible
	 */
	public boolean isGridVisible()
	{
		return gridVisible;
	}

	/**
	 * Fires a property change event for <code>gridVisible</code>.
	 * 
	 * @param value
	 *            the gridVisible to set
	 */
	public void setGridVisible(boolean value)
	{
		boolean oldValue = gridVisible;
		gridVisible = value;

		firePropertyChange("gridVisible", oldValue, gridVisible);
	}

	/**
	 * @return the gridVisible
	 */
	public boolean isAntiAlias()
	{
		return antiAlias;
	}

	/**
	 * Fires a property change event for <code>antiAlias</code>.
	 * 
	 * @param value
	 *            the antiAlias to set
	 */
	public void setAntiAlias(boolean value)
	{
		boolean oldValue = antiAlias;
		antiAlias = value;

		firePropertyChange("antiAlias", oldValue, antiAlias);
	}

	/**
	 * @return the gridVisible
	 */
	public boolean isTextAntiAlias()
	{
		return antiAlias;
	}

	/**
	 * Fires a property change event for <code>textAntiAlias</code>.
	 * 
	 * @param value
	 *            the textAntiAlias to set
	 */
	public void setTextAntiAlias(boolean value)
	{
		boolean oldValue = textAntiAlias;
		textAntiAlias = value;

		firePropertyChange("textAntiAlias", oldValue, textAntiAlias);
	}

	/**
	 * 
	 */
	public float getPreviewAlpha()
	{
		return previewAlpha;
	}

	/**
	 * 
	 */
	public void setPreviewAlpha(float value)
	{
		float oldValue = previewAlpha;
		previewAlpha = value;

		firePropertyChange("previewAlpha", oldValue, previewAlpha);
	}

	/**
	 * @return the tripleBuffered
	 */
	public boolean isTripleBuffered()
	{
		return tripleBuffered;
	}

	/**
	 * Hook for dynamic triple buffering condition.
	 */
	public boolean isForceTripleBuffered()
	{
		// LATER: Dynamic condition (cell density) to use triple
		// buffering for a large number of cells on a small rect
		return false;
	}

	/**
	 * @param value
	 *            the tripleBuffered to set
	 */
	public void setTripleBuffered(boolean value)
	{
		boolean oldValue = tripleBuffered;
		tripleBuffered = value;

		firePropertyChange("tripleBuffered", oldValue, tripleBuffered);
	}

	/**
	 * @return the gridColor
	 */
	public Color getGridColor()
	{
		return gridColor;
	}

	/**
	 * Fires a property change event for <code>gridColor</code>.
	 * 
	 * @param value
	 *            the gridColor to set
	 */
	public void setGridColor(Color value)
	{
		Color oldValue = gridColor;
		gridColor = value;

		firePropertyChange("gridColor", oldValue, gridColor);
	}

	/**
	 * @return the gridStyle
	 */
	public int getGridStyle()
	{
		return gridStyle;
	}

	/**
	 * Fires a property change event for <code>gridStyle</code>.
	 * 
	 * @param value
	 *            the gridStyle to set
	 */
	public void setGridStyle(int value)
	{
		int oldValue = gridStyle;
		gridStyle = value;

		firePropertyChange("gridStyle", oldValue, gridStyle);
	}

	/**
	 * Returns importEnabled.
	 */
	public boolean isImportEnabled()
	{
		return importEnabled;
	}

	/**
	 * Sets importEnabled.
	 */
	public void setImportEnabled(boolean value)
	{
		boolean oldValue = importEnabled;
		importEnabled = value;

		firePropertyChange("importEnabled", oldValue, importEnabled);
	}

	/**
	 * Returns all cells which may be imported via datatransfer.
	 */
	public Object[] getImportableCells(Object[] cells)
	{
		return mxGraphModel.filterCells(cells, new Filter()
		{
			public boolean filter(Object cell)
			{
				return canImportCell(cell);
			}
		});
	}

	/**
	 * Returns true if the given cell can be imported via datatransfer. This
	 * returns importEnabled.
	 */
	public boolean canImportCell(Object cell)
	{
		return isImportEnabled();
	}

	/**
	 * @return the exportEnabled
	 */
	public boolean isExportEnabled()
	{
		return exportEnabled;
	}

	/**
	 * @param value
	 *            the exportEnabled to set
	 */
	public void setExportEnabled(boolean value)
	{
		boolean oldValue = exportEnabled;
		exportEnabled = value;

		firePropertyChange("exportEnabled", oldValue, exportEnabled);
	}

	/**
	 * Returns all cells which may be exported via datatransfer.
	 */
	public Object[] getExportableCells(Object[] cells)
	{
		return mxGraphModel.filterCells(cells, new Filter()
		{
			public boolean filter(Object cell)
			{
				return canExportCell(cell);
			}
		});
	}

	/**
	 * Returns true if the given cell can be exported via datatransfer.
	 */
	public boolean canExportCell(Object cell)
	{
		return isExportEnabled();
	}

	/**
	 * @return the foldingEnabled
	 */
	public boolean isFoldingEnabled()
	{
		return foldingEnabled;
	}

	/**
	 * @param value
	 *            the foldingEnabled to set
	 */
	public void setFoldingEnabled(boolean value)
	{
		boolean oldValue = foldingEnabled;
		foldingEnabled = value;

		firePropertyChange("foldingEnabled", oldValue, foldingEnabled);
	}

	/**
	 * 
	 */
	public boolean isEditEvent(MouseEvent e)
	{
		return (e != null) ? e.getClickCount() == 2 : false;
	}

	/**
	 * 
	 * @param event
	 * @return Returns true if the given event should toggle selected cells.
	 */
	public boolean isCloneEvent(MouseEvent event)
	{
		return (event != null) ? event.isControlDown() : false;
	}

	/**
	 * 
	 * @param event
	 * @return Returns true if the given event should toggle selected cells.
	 */
	public boolean isToggleEvent(MouseEvent event)
	{
		// NOTE: IsMetaDown always returns true for right-clicks on the Mac, so
		// toggle selection for left mouse buttons requires CMD key to be pressed,
		// but toggle for right mouse buttons requires CTRL to be pressed.
		return (event != null) ? ((mxUtils.IS_MAC) ? ((SwingUtilities
				.isLeftMouseButton(event) && event.isMetaDown()) || (SwingUtilities
				.isRightMouseButton(event) && event.isControlDown()))
				: event.isControlDown())
				: false;
	}

	/**
	 * 
	 * @param event
	 * @return Returns true if the given event allows the grid to be applied.
	 */
	public boolean isGridEnabledEvent(MouseEvent event)
	{
		return (event != null) ? !event.isAltDown() : false;
	}

	/**
	 * Note: This is not used during drag and drop operations due to limitations
	 * of the underlying API. To enable this for move operations set dragEnabled
	 * to false.
	 * 
	 * @param event
	 * @return Returns true if the given event is a panning event.
	 */
	public boolean isPanningEvent(MouseEvent event)
	{
		return (event != null) ? event.isShiftDown() && event.isControlDown()
				: false;
	}

	/**
	 * Note: This is not used during drag and drop operations due to limitations
	 * of the underlying API. To enable this for move operations set dragEnabled
	 * to false.
	 * 
	 * @param event
	 * @return Returns true if the given event is constrained.
	 */
	public boolean isConstrainedEvent(MouseEvent event)
	{
		return (event != null) ? event.isShiftDown() : false;
	}

	/**
	 * Note: This is not used during drag and drop operations due to limitations
	 * of the underlying API. To enable this for move operations set dragEnabled
	 * to false.
	 * 
	 * @param event
	 * @return Returns true if the given event is constrained.
	 */
	public boolean isForceMarqueeEvent(MouseEvent event)
	{
		return (event != null) ? event.isAltDown() : false;
	}

	/**
	 * 
	 */
	public mxPoint snapScaledPoint(mxPoint pt)
	{
		return snapScaledPoint(pt, 0, 0);
	}

	/**
	 * 
	 */
	public mxPoint snapScaledPoint(mxPoint pt, double dx, double dy)
	{
		if (pt != null)
		{
			double scale = graph.getView().getScale();
			mxPoint trans = graph.getView().getTranslate();

			pt.setX((graph.snap(pt.getX() / scale - trans.getX() + dx / scale) + trans
					.getX()) * scale - dx);
			pt.setY((graph.snap(pt.getY() / scale - trans.getY() + dy / scale) + trans
					.getY()) * scale - dy);
		}

		return pt;
	}

	/**
	 * Prints the specified page on the specified graphics using
	 * <code>pageFormat</code> for the page format.
	 * 
	 * @param g
	 *            The graphics to paint the graph on.
	 * @param printFormat
	 *            The page format to use for printing.
	 * @param page
	 *            The page to print
	 * @return Returns {@link Printable#PAGE_EXISTS} or
	 *         {@link Printable#NO_SUCH_PAGE}.
	 */
	public int print(Graphics g, PageFormat printFormat, int page)
	{
		int result = NO_SUCH_PAGE;

		// Disables double-buffering before printing
		RepaintManager currentManager = RepaintManager
				.currentManager(mxGraphComponent.this);
		currentManager.setDoubleBufferingEnabled(false);

		// Gets the current state of the view
		mxGraphView view = graph.getView();

		// Stores the old state of the view
		boolean eventsEnabled = view.isEventsEnabled();
		mxPoint translate = view.getTranslate();

		// Disables firing of scale events so that there is no
		// repaint or update of the original graph while pages
		// are being printed
		view.setEventsEnabled(false);

		// Uses the view to create temporary cell states for each cell
		mxTemporaryCellStates tempStates = new mxTemporaryCellStates(view,
				1 / pageScale);

		try
		{
			view.setTranslate(new mxPoint(0, 0));

			mxGraphics2DCanvas canvas = createCanvas();
			canvas.setGraphics((Graphics2D) g);
			canvas.setScale(1 / pageScale);

			view.revalidate();

			mxRectangle graphBounds = graph.getGraphBounds();
			Dimension pSize = new Dimension((int) Math.ceil(graphBounds.getX()
					+ graphBounds.getWidth()) + 1, (int) Math.ceil(graphBounds
					.getY() + graphBounds.getHeight()) + 1);

			int w = (int) (printFormat.getImageableWidth());
			int h = (int) (printFormat.getImageableHeight());
			int cols = (int) Math.max(
					Math.ceil((double) (pSize.width - 5) / (double) w), 1);
			int rows = (int) Math.max(
					Math.ceil((double) (pSize.height - 5) / (double) h), 1);

			if (page < cols * rows)
			{
				int dx = (int) ((page % cols) * printFormat.getImageableWidth());
				int dy = (int) (Math.floor(page / cols) * printFormat
						.getImageableHeight());

				g.translate(-dx + (int) printFormat.getImageableX(), -dy
						+ (int) printFormat.getImageableY());
				g.setClip(dx, dy, (int) (dx + printFormat.getWidth()),
						(int) (dy + printFormat.getHeight()));

				graph.drawGraph(canvas);

				result = PAGE_EXISTS;
			}
		}
		finally
		{
			view.setTranslate(translate);

			tempStates.destroy();
			view.setEventsEnabled(eventsEnabled);

			// Enables double-buffering after printing
			currentManager.setDoubleBufferingEnabled(true);
		}

		return result;
	}

	/**
	 * 
	 */
	public mxInteractiveCanvas getCanvas()
	{
		return canvas;
	}

	/**
	 * 
	 */
	public BufferedImage getTripleBuffer()
	{
		return tripleBuffer;
	}

	/**
	 * Hook for subclassers to replace the graphics canvas for rendering and and
	 * printing. This must be overridden to return a custom canvas if there are
	 * any custom shapes.
	 */
	public mxInteractiveCanvas createCanvas()
	{
		// NOTE: http://forum.jgraph.com/questions/3354/ reports that we should not
		// pass image observer here as it will cause JVM to enter infinite loop.
		return new mxInteractiveCanvas();
	}

	/**
	 * 
	 * @param state
	 *            Cell state for which a handler should be created.
	 * @return Returns the handler to be used for the given cell state.
	 */
	public mxCellHandler createHandler(mxCellState state)
	{
		if (graph.getModel().isVertex(state.getCell()))
		{
			return new mxVertexHandler(this, state);
		}
		else if (graph.getModel().isEdge(state.getCell()))
		{
			mxEdgeStyleFunction style = graph.getView().getEdgeStyle(state,
					null, null, null);

			if (graph.isLoop(state) || style == mxEdgeStyle.ElbowConnector
					|| style == mxEdgeStyle.SideToSide
					|| style == mxEdgeStyle.TopToBottom)
			{
				return new mxElbowEdgeHandler(this, state);
			}

			return new mxEdgeHandler(this, state);
		}

		return new mxCellHandler(this, state);
	}

	//
	// Heavyweights
	//

	/**
	 * Hook for subclassers to create the array of heavyweights for the given
	 * state.
	 */
	public Component[] createComponents(mxCellState state)
	{
		return null;
	}

	/**
	 * 
	 */
	public void insertComponent(mxCellState state, Component c)
	{
		getGraphControl().add(c, 0);
	}

	/**
	 * 
	 */
	public void removeComponent(Component c, Object cell)
	{
		if (c.getParent() != null)
		{
			c.getParent().remove(c);
		}
	}

	/**
	 * 
	 */
	public void updateComponent(mxCellState state, Component c)
	{
		int x = (int) state.getX();
		int y = (int) state.getY();
		int width = (int) state.getWidth();
		int height = (int) state.getHeight();

		Dimension s = c.getMinimumSize();

		if (s.width > width)
		{
			x -= (s.width - width) / 2;
			width = s.width;
		}

		if (s.height > height)
		{
			y -= (s.height - height) / 2;
			height = s.height;
		}

		c.setBounds(x, y, width, height);
	}

	/**
	 * 
	 */
	public void updateComponents()
	{
		Object root = graph.getModel().getRoot();
		Hashtable<Object, Component[]> result = updateComponents(root);

		// Components now contains the mappings which are no
		// longer used, the result contains the new mappings
		removeAllComponents(components);
		components = result;

		if (!overlays.isEmpty())
		{
			Hashtable<Object, mxICellOverlay[]> result2 = updateCellOverlays(root);

			// Overlays now contains the mappings from cells which
			// are no longer in the model, the result contains the
			// mappings from cells which still exists, regardless
			// from whether a state exists for a particular cell
			removeAllOverlays(overlays);
			overlays = result2;
		}
	}

	/**
	 * 
	 */
	public void removeAllComponents(Hashtable<Object, Component[]> map)
	{
		Iterator<Map.Entry<Object, Component[]>> it = map.entrySet().iterator();

		while (it.hasNext())
		{
			Map.Entry<Object, Component[]> entry = it.next();
			Component[] c = entry.getValue();

			for (int i = 0; i < c.length; i++)
			{
				removeComponent(c[i], entry.getKey());
			}
		}
	}

	/**
	 * 
	 */
	public void removeAllOverlays(Hashtable<Object, mxICellOverlay[]> map)
	{
		Iterator<Map.Entry<Object, mxICellOverlay[]>> it = map.entrySet()
				.iterator();

		while (it.hasNext())
		{
			Map.Entry<Object, mxICellOverlay[]> entry = it.next();
			mxICellOverlay[] c = entry.getValue();

			for (int i = 0; i < c.length; i++)
			{
				removeCellOverlayComponent(c[i], entry.getKey());
			}
		}
	}

	/**
	 * 
	 */
	public Hashtable<Object, Component[]> updateComponents(Object cell)
	{
		Hashtable<Object, Component[]> result = new Hashtable<Object, Component[]>();
		Component[] c = components.remove(cell);
		mxCellState state = getGraph().getView().getState(cell);

		if (state != null)
		{
			if (c == null)
			{
				c = createComponents(state);

				if (c != null)
				{
					for (int i = 0; i < c.length; i++)
					{
						insertComponent(state, c[i]);
					}
				}
			}

			if (c != null)
			{
				result.put(cell, c);

				for (int i = 0; i < c.length; i++)
				{
					updateComponent(state, c[i]);
				}
			}
		}
		// Puts the component back into the map so that it will be removed
		else if (c != null)
		{
			components.put(cell, c);
		}

		int childCount = getGraph().getModel().getChildCount(cell);

		for (int i = 0; i < childCount; i++)
		{
			result.putAll(updateComponents(getGraph().getModel().getChildAt(
					cell, i)));
		}

		return result;
	}

	//
	// Validation and overlays
	//

	/**
	 * Validates the graph by validating each descendant of the given cell or
	 * the root of the model. Context is an object that contains the validation
	 * state for the complete validation run. The validation errors are attached
	 * to their cells using <setWarning>. This function returns true if no
	 * validation errors exist in the graph.
	 */
	public String validateGraph()
	{
		return validateGraph(graph.getModel().getRoot(),
				new Hashtable<Object, Object>());
	}

	/**
	 * Validates the graph by validating each descendant of the given cell or
	 * the root of the model. Context is an object that contains the validation
	 * state for the complete validation run. The validation errors are attached
	 * to their cells using <setWarning>. This function returns true if no
	 * validation errors exist in the graph.
	 * 
	 * @param cell
	 *            Cell to start the validation recursion.
	 * @param context
	 *            Object that represents the global validation state.
	 */
	public String validateGraph(Object cell, Hashtable<Object, Object> context)
	{
		mxIGraphModel model = graph.getModel();
		mxGraphView view = graph.getView();
		boolean isValid = true;
		int childCount = model.getChildCount(cell);

		for (int i = 0; i < childCount; i++)
		{
			Object tmp = model.getChildAt(cell, i);
			Hashtable<Object, Object> ctx = context;

			if (graph.isValidRoot(tmp))
			{
				ctx = new Hashtable<Object, Object>();
			}

			String warn = validateGraph(tmp, ctx);

			if (warn != null)
			{
				String html = warn.replaceAll("\n", "<br>");
				int len = html.length();
				setCellWarning(tmp, html.substring(0, Math.max(0, len - 4)));
			}
			else
			{
				setCellWarning(tmp, null);
			}

			isValid = isValid && warn == null;
		}

		StringBuffer warning = new StringBuffer();

		// Adds error for invalid children if collapsed (children invisible)
		if (graph.isCellCollapsed(cell) && !isValid)
		{
			warning.append(mxResources.get("containsValidationErrors",
					"Contains Validation Errors") + "\n");
		}

		// Checks edges and cells using the defined multiplicities
		if (model.isEdge(cell))
		{
			String tmp = graph.getEdgeValidationError(cell,
					model.getTerminal(cell, true),
					model.getTerminal(cell, false));

			if (tmp != null)
			{
				warning.append(tmp);
			}
		}
		else
		{
			String tmp = graph.getCellValidationError(cell);

			if (tmp != null)
			{
				warning.append(tmp);
			}
		}

		// Checks custom validation rules
		String err = graph.validateCell(cell, context);

		if (err != null)
		{
			warning.append(err);
		}

		// Updates the display with the warning icons before any potential
		// alerts are displayed
		if (model.getParent(cell) == null)
		{
			view.validate();
		}

		return (warning.length() > 0 || !isValid) ? warning.toString() : null;
	}

	/**
	 * Adds an overlay for the specified cell. This method fires an addoverlay
	 * event and returns the new overlay.
	 * 
	 * @param cell
	 *            Cell to add the overlay for.
	 * @param overlay
	 *            Overlay to be added for the cell.
	 */
	public mxICellOverlay addCellOverlay(Object cell, mxICellOverlay overlay)
	{
		mxICellOverlay[] arr = getCellOverlays(cell);

		if (arr == null)
		{
			arr = new mxICellOverlay[] { overlay };
		}
		else
		{
			mxICellOverlay[] arr2 = new mxICellOverlay[arr.length + 1];
			System.arraycopy(arr, 0, arr2, 0, arr.length);
			arr2[arr.length] = overlay;
			arr = arr2;
		}

		overlays.put(cell, arr);
		mxCellState state = graph.getView().getState(cell);

		if (state != null)
		{
			updateCellOverlayComponent(state, overlay);
		}

		eventSource.fireEvent(new mxEventObject(mxEvent.ADD_OVERLAY, "cell",
				cell, "overlay", overlay));

		return overlay;
	}

	/**
	 * Returns the array of overlays for the given cell or null, if no overlays
	 * are defined.
	 * 
	 * @param cell
	 *            Cell whose overlays should be returned.
	 */
	public mxICellOverlay[] getCellOverlays(Object cell)
	{
		return overlays.get(cell);
	}

	/**
	 * Removes and returns the given overlay from the given cell. This method
	 * fires a remove overlay event. If no overlay is given, then all overlays
	 * are removed using removeOverlays.
	 * 
	 * @param cell
	 *            Cell whose overlay should be removed.
	 * @param overlay
	 *            Optional overlay to be removed.
	 */
	public mxICellOverlay removeCellOverlay(Object cell, mxICellOverlay overlay)
	{
		if (overlay == null)
		{
			removeCellOverlays(cell);
		}
		else
		{
			mxICellOverlay[] arr = getCellOverlays(cell);

			if (arr != null)
			{
				// TODO: Use arraycopy from/to same array to speed this up
				List<mxICellOverlay> list = new ArrayList<mxICellOverlay>(
						Arrays.asList(arr));

				if (list.remove(overlay))
				{
					removeCellOverlayComponent(overlay, cell);
				}

				arr = list.toArray(new mxICellOverlay[list.size()]);
				overlays.put(cell, arr);
			}
		}

		return overlay;
	}

	/**
	 * Removes all overlays from the given cell. This method fires a
	 * removeoverlay event for each removed overlay and returns the array of
	 * overlays that was removed from the cell.
	 * 
	 * @param cell
	 *            Cell whose overlays should be removed.
	 */
	public mxICellOverlay[] removeCellOverlays(Object cell)
	{
		mxICellOverlay[] ovls = overlays.remove(cell);

		if (ovls != null)
		{
			// Removes the overlays from the cell hierarchy
			for (int i = 0; i < ovls.length; i++)
			{
				removeCellOverlayComponent(ovls[i], cell);
			}
		}

		return ovls;
	}

	/**
	 * Notified when an overlay has been removed from the graph. This
	 * implementation removes the given overlay from its parent if it is a
	 * component inside a component hierarchy.
	 */
	protected void removeCellOverlayComponent(mxICellOverlay overlay,
			Object cell)
	{
		if (overlay instanceof Component)
		{
			Component comp = (Component) overlay;

			if (comp.getParent() != null)
			{
				comp.setVisible(false);
				comp.getParent().remove(comp);
				eventSource.fireEvent(new mxEventObject(mxEvent.REMOVE_OVERLAY,
						"cell", cell, "overlay", overlay));
			}
		}
	}

	/**
	 * Notified when an overlay has been removed from the graph. This
	 * implementation removes the given overlay from its parent if it is a
	 * component inside a component hierarchy.
	 */
	protected void updateCellOverlayComponent(mxCellState state,
			mxICellOverlay overlay)
	{
		if (overlay instanceof Component)
		{
			Component comp = (Component) overlay;

			if (comp.getParent() == null)
			{
				getGraphControl().add(comp, 0);
			}

			mxRectangle rect = overlay.getBounds(state);

			if (rect != null)
			{
				comp.setBounds(rect.getRectangle());
				comp.setVisible(true);
			}
			else
			{
				comp.setVisible(false);
			}
		}
	}

	/**
	 * Removes all overlays in the graph.
	 */
	public void clearCellOverlays()
	{
		clearCellOverlays(null);
	}

	/**
	 * Removes all overlays in the graph for the given cell and all its
	 * descendants. If no cell is specified then all overlays are removed from
	 * the graph. This implementation uses removeOverlays to remove the overlays
	 * from the individual cells.
	 * 
	 * @param cell
	 *            Optional cell that represents the root of the subtree to
	 *            remove the overlays from. Default is the root in the model.
	 */
	public void clearCellOverlays(Object cell)
	{
		mxIGraphModel model = graph.getModel();

		if (cell == null)
		{
			cell = model.getRoot();
		}

		removeCellOverlays(cell);

		// Recursively removes all overlays from the children
		int childCount = model.getChildCount(cell);

		for (int i = 0; i < childCount; i++)
		{
			Object child = model.getChildAt(cell, i);
			clearCellOverlays(child); // recurse
		}
	}

	/**
	 * Creates an overlay for the given cell using the warning and image or
	 * warningImage and returns the new overlay. If the warning is null or a
	 * zero length string, then all overlays are removed from the cell instead.
	 * 
	 * @param cell
	 *            Cell whose warning should be set.
	 * @param warning
	 *            String that represents the warning to be displayed.
	 */
	public mxICellOverlay setCellWarning(Object cell, String warning)
	{
		return setCellWarning(cell, warning, null, false);
	}

	/**
	 * Creates an overlay for the given cell using the warning and image or
	 * warningImage and returns the new overlay. If the warning is null or a
	 * zero length string, then all overlays are removed from the cell instead.
	 * 
	 * @param cell
	 *            Cell whose warning should be set.
	 * @param warning
	 *            String that represents the warning to be displayed.
	 * @param icon
	 *            Optional image to be used for the overlay. Default is
	 *            warningImageBasename.
	 */
	public mxICellOverlay setCellWarning(Object cell, String warning,
			ImageIcon icon)
	{
		return setCellWarning(cell, warning, icon, false);
	}

	/**
	 * Creates an overlay for the given cell using the warning and image or
	 * warningImage and returns the new overlay. If the warning is null or a
	 * zero length string, then all overlays are removed from the cell instead.
	 * 
	 * @param cell
	 *            Cell whose warning should be set.
	 * @param warning
	 *            String that represents the warning to be displayed.
	 * @param icon
	 *            Optional image to be used for the overlay. Default is
	 *            warningImageBasename.
	 * @param select
	 *            Optional boolean indicating if a click on the overlay should
	 *            select the corresponding cell. Default is false.
	 */
	public mxICellOverlay setCellWarning(final Object cell, String warning,
			ImageIcon icon, boolean select)
	{
		if (warning != null && warning.length() > 0)
		{
			icon = (icon != null) ? icon : warningIcon;

			// Creates the overlay with the image and warning
			mxCellOverlay overlay = new mxCellOverlay(icon, warning);

			// Adds a handler for single mouseclicks to select the cell
			if (select)
			{
				overlay.addMouseListener(new MouseAdapter()
				{
					/**
					 * Selects the associated cell in the graph
					 */
					public void mousePressed(MouseEvent e)
					{
						if (getGraph().isEnabled())
						{
							getGraph().setSelectionCell(cell);
						}
					}
				});

				overlay.setCursor(new Cursor(Cursor.HAND_CURSOR));
			}

			// Sets and returns the overlay in the graph
			return addCellOverlay(cell, overlay);
		}
		else
		{
			removeCellOverlays(cell);
		}

		return null;
	}

	/**
	 * Returns a hashtable with all entries from the overlays variable where a
	 * cell still exists in the model. The entries are removed from the global
	 * hashtable so that the remaining entries reflect those whose cell have
	 * been removed from the model. If no state is available for a given cell
	 * then its overlays are temporarly removed from the rendering control, but
	 * kept in the result.
	 */
	public Hashtable<Object, mxICellOverlay[]> updateCellOverlays(Object cell)
	{
		Hashtable<Object, mxICellOverlay[]> result = new Hashtable<Object, mxICellOverlay[]>();
		mxICellOverlay[] c = overlays.remove(cell);
		mxCellState state = getGraph().getView().getState(cell);

		if (c != null)
		{
			if (state != null)
			{
				for (int i = 0; i < c.length; i++)
				{
					updateCellOverlayComponent(state, c[i]);
				}
			}
			else
			{
				for (int i = 0; i < c.length; i++)
				{
					removeCellOverlayComponent(c[i], cell);
				}
			}

			result.put(cell, c);
		}

		int childCount = getGraph().getModel().getChildCount(cell);

		for (int i = 0; i < childCount; i++)
		{
			result.putAll(updateCellOverlays(getGraph().getModel().getChildAt(
					cell, i)));
		}

		return result;
	}

	/**
	 * 
	 */
	protected void paintBackground(Graphics g)
	{
		Rectangle clip = g.getClipBounds();
		Rectangle rect = paintBackgroundPage(g);

		if (isPageVisible())
		{
			g.clipRect(rect.x + 1, rect.y + 1, rect.width - 1, rect.height - 1);
		}

		// Paints the clipped background image
		paintBackgroundImage(g);

		// Paints the grid directly onto the graphics
		paintGrid(g);
		g.setClip(clip);
	}

	/**
	 * 
	 */
	protected Rectangle paintBackgroundPage(Graphics g)
	{
		mxPoint translate = graph.getView().getTranslate();
		double scale = graph.getView().getScale();

		int x0 = (int) Math.round(translate.getX() * scale) - 1;
		int y0 = (int) Math.round(translate.getY() * scale) - 1;

		Dimension d = getPreferredSizeForPage();
		int w = (int) Math.round(d.width * scale) + 2;
		int h = (int) Math.round(d.height * scale) + 2;

		if (isPageVisible())
		{
			// Draws the background behind the page
			Color c = getPageBackgroundColor();
			
			if (c != null)
			{
				g.setColor(c);
				mxUtils.fillClippedRect(g, 0, 0, getGraphControl().getWidth(),
						getGraphControl().getHeight());
			}

			// Draws the page drop shadow
			c = getPageShadowColor();
			
			if (c != null)
			{
				g.setColor(c);
				mxUtils.fillClippedRect(g, x0 + w, y0 + 6, 6, h - 6);
				mxUtils.fillClippedRect(g, x0 + 8, y0 + h, w - 2, 6);
			}

			// Draws the page
			Color bg = getBackground();

			if (getViewport().isOpaque())
			{
				bg = getViewport().getBackground();
			}

			g.setColor(bg);
			mxUtils.fillClippedRect(g, x0 + 1, y0 + 1, w, h);

			// Draws the page border
			c = getPageBorderColor();
			
			if (c != null)
			{
				g.setColor(c);
				g.drawRect(x0, y0, w, h);
			}
		}

		if (isPageBreaksVisible()
				&& (horizontalPageCount > 1 || verticalPageCount > 1))
		{
			// Draws the pagebreaks
			// TODO: Use clipping
			Graphics2D g2 = (Graphics2D) g;
			Stroke previousStroke = g2.getStroke();

			g2.setStroke(new BasicStroke(1, BasicStroke.CAP_BUTT,
					BasicStroke.JOIN_MITER, 10.0f, new float[] { 1, 2 }, 0));
			g2.setColor(pageBreakColor);

			for (int i = 1; i <= horizontalPageCount - 1; i++)
			{
				int dx = i * w / horizontalPageCount;
				g2.drawLine(x0 + dx, y0 + 1, x0 + dx, y0 + h);
			}

			for (int i = 1; i <= verticalPageCount - 1; i++)
			{
				int dy = i * h / verticalPageCount;
				g2.drawLine(x0 + 1, y0 + dy, x0 + w, y0 + dy);
			}

			// Restores the graphics
			g2.setStroke(previousStroke);
		}

		return new Rectangle(x0, y0, w, h);
	}

	/**
	 * 
	 */
	protected void paintBackgroundImage(Graphics g)
	{
		if (backgroundImage != null)
		{
			mxPoint translate = graph.getView().getTranslate();
			double scale = graph.getView().getScale();

			g.drawImage(backgroundImage.getImage(),
					(int) (translate.getX() * scale),
					(int) (translate.getY() * scale),
					(int) (backgroundImage.getIconWidth() * scale),
					(int) (backgroundImage.getIconHeight() * scale), this);
		}
	}

	/**
	 * Paints the grid onto the given graphics object.
	 */
	protected void paintGrid(Graphics g)
	{
		if (isGridVisible())
		{
			g.setColor(getGridColor());
			Rectangle clip = g.getClipBounds();

			if (clip == null)
			{
				clip = getGraphControl().getBounds();
			}

			double left = clip.getX();
			double top = clip.getY();
			double right = left + clip.getWidth();
			double bottom = top + clip.getHeight();

			// Double the grid line spacing if smaller than half the gridsize
			int style = getGridStyle();
			int gridSize = graph.getGridSize();
			int minStepping = gridSize;

			// Smaller stepping for certain styles
			if (style == GRID_STYLE_CROSS || style == GRID_STYLE_DOT)
			{
				minStepping /= 2;
			}

			// Fetches some global display state information
			mxPoint trans = graph.getView().getTranslate();
			double scale = graph.getView().getScale();
			double tx = trans.getX() * scale;
			double ty = trans.getY() * scale;

			// Sets the distance of the grid lines in pixels
			double stepping = gridSize * scale;

			if (stepping < minStepping)
			{
				int count = (int) Math
						.round(Math.ceil(minStepping / stepping) / 2) * 2;
				stepping = count * stepping;
			}

			double xs = Math.floor((left - tx) / stepping) * stepping + tx;
			double xe = Math.ceil(right / stepping) * stepping;
			double ys = Math.floor((top - ty) / stepping) * stepping + ty;
			double ye = Math.ceil(bottom / stepping) * stepping;

			switch (style)
			{
				case GRID_STYLE_CROSS:
				{
					// Sets the dot size
					int cs = (stepping > 16.0) ? 2 : 1;

					for (double x = xs; x <= xe; x += stepping)
					{
						for (double y = ys; y <= ye; y += stepping)
						{
							// FIXME: Workaround for rounding errors when adding
							// stepping to
							// xs or ys multiple times (leads to double grid lines
							// when zoom
							// is set to eg. 121%)
							x = Math.round((x - tx) / stepping) * stepping + tx;
							y = Math.round((y - ty) / stepping) * stepping + ty;

							int ix = (int) Math.round(x);
							int iy = (int) Math.round(y);
							g.drawLine(ix - cs, iy, ix + cs, iy);
							g.drawLine(ix, iy - cs, ix, iy + cs);
						}
					}

					break;
				}
				case GRID_STYLE_LINE:
				{
					xe += (int) Math.ceil(stepping);
					ye += (int) Math.ceil(stepping);

					int ixs = (int) Math.round(xs);
					int ixe = (int) Math.round(xe);
					int iys = (int) Math.round(ys);
					int iye = (int) Math.round(ye);

					for (double x = xs; x <= xe; x += stepping)
					{
						// FIXME: Workaround for rounding errors when adding
						// stepping to
						// xs or ys multiple times (leads to double grid lines when
						// zoom
						// is set to eg. 121%)
						x = Math.round((x - tx) / stepping) * stepping + tx;

						int ix = (int) Math.round(x);
						g.drawLine(ix, iys, ix, iye);
					}

					for (double y = ys; y <= ye; y += stepping)
					{

						// FIXME: Workaround for rounding errors when adding
						// stepping to
						// xs or ys multiple times (leads to double grid lines when
						// zoom
						// is set to eg. 121%)
						y = Math.round((y - ty) / stepping) * stepping + ty;

						int iy = (int) Math.round(y);
						g.drawLine(ixs, iy, ixe, iy);
					}

					break;
				}
				case GRID_STYLE_DASHED:
				{
					Graphics2D g2 = (Graphics2D) g;
					Stroke stroke = g2.getStroke();

					xe += (int) Math.ceil(stepping);
					ye += (int) Math.ceil(stepping);

					int ixs = (int) Math.round(xs);
					int ixe = (int) Math.round(xe);
					int iys = (int) Math.round(ys);
					int iye = (int) Math.round(ye);

					// Creates a set of strokes with individual dash offsets
					// for each direction
					Stroke[] strokes = new Stroke[] {
							new BasicStroke(1, BasicStroke.CAP_BUTT,
									BasicStroke.JOIN_MITER, 1, new float[] { 3,
											1 }, Math.max(0, iys) % 4),
							new BasicStroke(1, BasicStroke.CAP_BUTT,
									BasicStroke.JOIN_MITER, 1, new float[] { 2,
											2 }, Math.max(0, iys) % 4),
							new BasicStroke(1, BasicStroke.CAP_BUTT,
									BasicStroke.JOIN_MITER, 1, new float[] { 1,
											1 }, 0),
							new BasicStroke(1, BasicStroke.CAP_BUTT,
									BasicStroke.JOIN_MITER, 1, new float[] { 2,
											2 }, Math.max(0, iys) % 4) };

					for (double x = xs; x <= xe; x += stepping)
					{
						g2.setStroke(strokes[((int) (x / stepping))
								% strokes.length]);

						// FIXME: Workaround for rounding errors when adding
						// stepping to
						// xs or ys multiple times (leads to double grid lines when
						// zoom
						// is set to eg. 121%)
						double xx = Math.round((x - tx) / stepping) * stepping
								+ tx;

						int ix = (int) Math.round(xx);
						g.drawLine(ix, iys, ix, iye);
					}

					strokes = new Stroke[] {
							new BasicStroke(1, BasicStroke.CAP_BUTT,
									BasicStroke.JOIN_MITER, 1, new float[] { 3,
											1 }, Math.max(0, ixs) % 4),
							new BasicStroke(1, BasicStroke.CAP_BUTT,
									BasicStroke.JOIN_MITER, 1, new float[] { 2,
											2 }, Math.max(0, ixs) % 4),
							new BasicStroke(1, BasicStroke.CAP_BUTT,
									BasicStroke.JOIN_MITER, 1, new float[] { 1,
											1 }, 0),
							new BasicStroke(1, BasicStroke.CAP_BUTT,
									BasicStroke.JOIN_MITER, 1, new float[] { 2,
											2 }, Math.max(0, ixs) % 4) };

					for (double y = ys; y <= ye; y += stepping)
					{
						g2.setStroke(strokes[((int) (y / stepping))
								% strokes.length]);

						// FIXME: Workaround for rounding errors when adding
						// stepping to
						// xs or ys multiple times (leads to double grid lines when
						// zoom
						// is set to eg. 121%)
						double yy = Math.round((y - ty) / stepping) * stepping
								+ ty;

						int iy = (int) Math.round(yy);
						g.drawLine(ixs, iy, ixe, iy);
					}

					g2.setStroke(stroke);

					break;
				}
				default: // DOT_GRID_MODE
				{
					for (double x = xs; x <= xe; x += stepping)
					{

						for (double y = ys; y <= ye; y += stepping)
						{
							// FIXME: Workaround for rounding errors when adding
							// stepping to
							// xs or ys multiple times (leads to double grid lines
							// when zoom
							// is set to eg. 121%)
							x = Math.round((x - tx) / stepping) * stepping + tx;
							y = Math.round((y - ty) / stepping) * stepping + ty;

							int ix = (int) Math.round(x);
							int iy = (int) Math.round(y);
							g.drawLine(ix, iy, ix, iy);
						}
					}
				}
			}
		}
	}

	//
	// Triple Buffering
	//

	/**
	 * Updates the buffer (if one exists) and repaints the given cell state.
	 */
	public void redraw(mxCellState state)
	{
		if (state != null)
		{
			Rectangle dirty = state.getBoundingBox().getRectangle();
			repaintTripleBuffer(new Rectangle(dirty));
			dirty = SwingUtilities.convertRectangle(graphControl, dirty, this);
			repaint(dirty);
		}
	}

	/**
	 * Checks if the triple buffer exists and creates a new one if it does not.
	 * Also compares the size of the buffer with the size of the graph and drops
	 * the buffer if it has a different size.
	 */
	public void checkTripleBuffer()
	{
		mxRectangle bounds = graph.getGraphBounds();
		int width = (int) Math.ceil(bounds.getX() + bounds.getWidth() + 2);
		int height = (int) Math.ceil(bounds.getY() + bounds.getHeight() + 2);

		if (tripleBuffer != null)
		{
			if (tripleBuffer.getWidth() != width
					|| tripleBuffer.getHeight() != height)
			{
				// Resizes the buffer (destroys existing and creates new)
				destroyTripleBuffer();
			}
		}

		if (tripleBuffer == null)
		{
			createTripleBuffer(width, height);
		}
	}

	/**
	 * Creates the tripleBufferGraphics and tripleBuffer for the given dimension
	 * and draws the complete graph onto the triplebuffer.
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
			mxUtils.setAntiAlias(tripleBufferGraphics, antiAlias, textAntiAlias);

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
	 * @param dirty
	 */
	public void repaintTripleBuffer(Rectangle dirty)
	{
		if (tripleBuffered && tripleBufferGraphics != null)
		{
			if (dirty == null)
			{
				dirty = new Rectangle(tripleBuffer.getWidth(),
						tripleBuffer.getHeight());
			}

			// Clears and repaints the dirty rectangle using the
			// graphics canvas as a renderer
			mxUtils.clearRect(tripleBufferGraphics, dirty, null);
			tripleBufferGraphics.setClip(dirty);
			graphControl.drawGraph(tripleBufferGraphics, true);
			tripleBufferGraphics.setClip(null);
		}
	}

	//
	// Redirected to event source
	//

	/**
	 * @return Returns true if event dispatching is enabled in the event source.
	 * @see com.mxgraph.util.mxEventSource#isEventsEnabled()
	 */
	public boolean isEventsEnabled()
	{
		return eventSource.isEventsEnabled();
	}

	/**
	 * @param eventsEnabled
	 * @see com.mxgraph.util.mxEventSource#setEventsEnabled(boolean)
	 */
	public void setEventsEnabled(boolean eventsEnabled)
	{
		eventSource.setEventsEnabled(eventsEnabled);
	}

	/**
	 * @param eventName
	 * @param listener
	 * @see com.mxgraph.util.mxEventSource#addListener(java.lang.String,
	 *      com.mxgraph.util.mxEventSource.mxIEventListener)
	 */
	public void addListener(String eventName, mxIEventListener listener)
	{
		eventSource.addListener(eventName, listener);
	}

	/**
	 * @param listener
	 *            Listener instance.
	 */
	public void removeListener(mxIEventListener listener)
	{
		eventSource.removeListener(listener);
	}

	/**
	 * @param eventName
	 *            Name of the event.
	 * @param listener
	 *            Listener instance.
	 */
	public void removeListener(mxIEventListener listener, String eventName)
	{
		eventSource.removeListener(listener, eventName);
	}

	/**
	 * 
	 * @author gaudenz
	 * 
	 */
	public class mxGraphControl extends JComponent
	{

		/**
		 * 
		 */
		private static final long serialVersionUID = -8916603170766739124L;

		/**
		 * Specifies a translation for painting. This should only be used during
		 * mouse drags and must be reset after any interactive repaints. Default
		 * is (0,0). This should not be null.
		 */
		protected Point translate = new Point(0, 0);

		/**
		 * 
		 */
		public mxGraphControl()
		{
			addMouseListener(new MouseAdapter()
			{
				public void mouseReleased(MouseEvent e)
				{
					if (translate.x != 0 || translate.y != 0)
					{
						translate = new Point(0, 0);
						repaint();
					}
				}
			});
		}

		/**
		 * Returns the translate.
		 */
		public Point getTranslate()
		{
			return translate;
		}

		/**
		 * Sets the translate.
		 */
		public void setTranslate(Point value)
		{
			translate = value;
		}

		/**
		 * 
		 */
		public mxGraphComponent getGraphContainer()
		{
			return mxGraphComponent.this;
		}

		/**
		 * Overrides parent method to add extend flag for making the control
		 * larger during previews.
		 */
		public void scrollRectToVisible(Rectangle aRect, boolean extend)
		{
			super.scrollRectToVisible(aRect);

			if (extend)
			{
				extendComponent(aRect);
			}
		}

		/**
		 * Implements extension of the component in all directions. For
		 * extension below the origin (into negative space) the translate will
		 * temporaly be used and reset with the next mouse released event.
		 */
		protected void extendComponent(Rectangle rect)
		{
			int right = rect.x + rect.width;
			int bottom = rect.y + rect.height;

			Dimension d = new Dimension(getPreferredSize());
			Dimension sp = getScaledPreferredSizeForGraph();
			mxRectangle min = graph.getMinimumGraphSize();
			double scale = graph.getView().getScale();
			boolean update = false;

			if (rect.x < 0)
			{
				translate.x = Math.max(translate.x, Math.max(0, -rect.x));
				d.width = sp.width;

				if (min != null)
				{
					d.width = (int) Math.max(d.width,
							Math.round(min.getWidth() * scale));
				}

				d.width += translate.x;
				update = true;
			}
			else if (right > getWidth())
			{
				d.width = Math.max(right, getWidth());
				update = true;
			}

			if (rect.y < 0)
			{
				translate.y = Math.max(translate.y, Math.max(0, -rect.y));
				d.height = sp.height;

				if (min != null)
				{
					d.height = (int) Math.max(d.height,
							Math.round(min.getHeight() * scale));
				}

				d.height += translate.y;
				update = true;
			}
			else if (bottom > getHeight())
			{
				d.height = Math.max(bottom, getHeight());
				update = true;
			}

			if (update)
			{
				setPreferredSize(d);
				setMinimumSize(d);
				revalidate();
			}
		}

		/**
		 * 
		 */
		public String getToolTipText(MouseEvent e)
		{
			String tip = getSelectionCellsHandler().getToolTipText(e);

			if (tip == null)
			{
				Object cell = getCellAt(e.getX(), e.getY());

				if (cell != null)
				{
					if (hitFoldingIcon(cell, e.getX(), e.getY()))
					{
						tip = mxResources.get("collapse-expand");
					}
					else
					{
						tip = graph.getToolTipForCell(cell);
					}
				}
			}

			if (tip != null && tip.length() > 0)
			{
				return tip;
			}

			return super.getToolTipText(e);
		}

		/**
		 * Updates the preferred size for the given scale if the page size
		 * should be preferred or the page is visible.
		 */
		public void updatePreferredSize()
		{
			double scale = graph.getView().getScale();
			Dimension d = null;

			if (preferPageSize || pageVisible)
			{
				Dimension page = getPreferredSizeForPage();

				if (!preferPageSize)
				{
					page.width += 2 * getHorizontalPageBorder();
					page.height += 2 * getVerticalPageBorder();
				}

				d = new Dimension((int) (page.width * scale),
						(int) (page.height * scale));
			}
			else
			{
				d = getScaledPreferredSizeForGraph();
			}

			mxRectangle min = graph.getMinimumGraphSize();

			if (min != null)
			{
				d.width = (int) Math.max(d.width,
						Math.round(min.getWidth() * scale));
				d.height = (int) Math.max(d.height,
						Math.round(min.getHeight() * scale));
			}

			if (!getPreferredSize().equals(d))
			{
				setPreferredSize(d);
				setMinimumSize(d);
				revalidate();
			}
		}

		/**
		 * 
		 */
		public void paint(Graphics g)
		{
			g.translate(translate.x, translate.y);
			eventSource.fireEvent(new mxEventObject(mxEvent.BEFORE_PAINT, "g",
					g));
			super.paint(g);
			eventSource
					.fireEvent(new mxEventObject(mxEvent.AFTER_PAINT, "g", g));
			g.translate(-translate.x, -translate.y);
		}

		/**
		 * 
		 */
		public void paintComponent(Graphics g)
		{
			super.paintComponent(g);

			// Draws the background
			paintBackground(g);

			// Creates or destroys the triple buffer as needed
			if (tripleBuffered)
			{
				checkTripleBuffer();
			}
			else if (tripleBuffer != null)
			{
				destroyTripleBuffer();
			}

			// Paints the buffer in the canvas onto the dirty region
			if (tripleBuffer != null)
			{
				mxUtils.drawImageClip(g, tripleBuffer, this);
			}

			// Paints the graph directly onto the graphics
			else
			{
				Graphics2D g2 = (Graphics2D) g;
				RenderingHints tmp = g2.getRenderingHints();

				// Sets the graphics in the canvas
				try
				{
					mxUtils.setAntiAlias(g2, antiAlias, textAntiAlias);
					drawGraph(g2, true);
				}
				finally
				{
					// Restores the graphics state
					g2.setRenderingHints(tmp);
				}
			}

			eventSource.fireEvent(new mxEventObject(mxEvent.PAINT, "g", g));
		}

		/**
		 * 
		 */
		public void drawGraph(Graphics2D g, boolean drawLabels)
		{
			Graphics2D previousGraphics = canvas.getGraphics();
			boolean previousDrawLabels = canvas.isDrawLabels();
			mxPoint previousTranslate = canvas.getTranslate();
			double previousScale = canvas.getScale();

			try
			{
				canvas.setScale(graph.getView().getScale());
				canvas.setDrawLabels(drawLabels);
				canvas.setTranslate(0, 0);
				canvas.setGraphics(g);

				// Draws the graph using the graphics canvas
				drawFromRootCell();
			}
			finally
			{
				canvas.setScale(previousScale);
				canvas.setTranslate(previousTranslate.getX(), previousTranslate.getY());
				canvas.setDrawLabels(previousDrawLabels);
				canvas.setGraphics(previousGraphics);
			}
		}

		/**
		 * Hook to draw the root cell into the canvas.
		 */
		protected void drawFromRootCell()
		{
			drawCell(canvas, graph.getModel().getRoot());
		}

		/**
		 * 
		 */
		protected boolean hitClip(mxGraphics2DCanvas canvas, mxCellState state)
		{
			Rectangle rect = getExtendedCellBounds(state);

			return (rect == null || canvas.getGraphics().hitClip(rect.x,
					rect.y, rect.width, rect.height));
		}

		/**
		 * @param state the cached state of the cell whose extended bounds are to be calculated
		 * @return the bounds of the cell, including the label and shadow and allowing for rotation
		 */
		protected Rectangle getExtendedCellBounds(mxCellState state)
		{
			Rectangle rect = null;

			// Takes rotation into account
			double rotation = mxUtils.getDouble(state.getStyle(),
					mxConstants.STYLE_ROTATION);
			mxRectangle tmp = mxUtils.getBoundingBox(new mxRectangle(state),
					rotation);

			// Adds scaled stroke width
			int border = (int) Math
					.ceil(mxUtils.getDouble(state.getStyle(),
							mxConstants.STYLE_STROKEWIDTH)
							* graph.getView().getScale()) + 1;
			tmp.grow(border);

			if (mxUtils.isTrue(state.getStyle(), mxConstants.STYLE_SHADOW))
			{
				tmp.setWidth(tmp.getWidth() + mxConstants.SHADOW_OFFSETX);
				tmp.setHeight(tmp.getHeight() + mxConstants.SHADOW_OFFSETX);
			}

			// Adds the bounds of the label
			if (state.getLabelBounds() != null)
			{
				tmp.add(state.getLabelBounds());
			}

			rect = tmp.getRectangle();
			return rect;
		}

		/**
		 * Draws the given cell onto the specified canvas. This is a modified
		 * version of mxGraph.drawCell which paints the label only if the
		 * corresponding cell is not being edited and invokes the cellDrawn hook
		 * after all descendants have been painted.
		 * 
		 * @param canvas
		 *            Canvas onto which the cell should be drawn.
		 * @param cell
		 *            Cell that should be drawn onto the canvas.
		 */
		public void drawCell(mxICanvas canvas, Object cell)
		{
			mxCellState state = graph.getView().getState(cell);

			if (state != null
					&& isCellDisplayable(state.getCell())
					&& (!(canvas instanceof mxGraphics2DCanvas) || hitClip(
							(mxGraphics2DCanvas) canvas, state)))
			{
				graph.drawState(canvas, state,
						cell != cellEditor.getEditingCell());
			}

			// Handles special ordering for edges (all in foreground
			// or background) or draws all children in order
			boolean edgesFirst = graph.isKeepEdgesInBackground();
			boolean edgesLast = graph.isKeepEdgesInForeground();

			if (edgesFirst)
			{
				drawChildren(cell, true, false);
			}

			drawChildren(cell, !edgesFirst && !edgesLast, true);

			if (edgesLast)
			{
				drawChildren(cell, true, false);
			}

			if (state != null)
			{
				cellDrawn(canvas, state);
			}
		}

		/**
		 * Draws the child edges and/or all other children in the given cell
		 * depending on the boolean arguments.
		 */
		protected void drawChildren(Object cell, boolean edges, boolean others)
		{
			mxIGraphModel model = graph.getModel();
			int childCount = model.getChildCount(cell);

			for (int i = 0; i < childCount; i++)
			{
				Object child = model.getChildAt(cell, i);
				boolean isEdge = model.isEdge(child);

				if ((others && !isEdge) || (edges && isEdge))
				{
					drawCell(canvas, model.getChildAt(cell, i));
				}
			}
		}

		/**
		 * 
		 */
		protected void cellDrawn(mxICanvas canvas, mxCellState state)
		{
			if (isFoldingEnabled() && canvas instanceof mxGraphics2DCanvas)
			{
				mxIGraphModel model = graph.getModel();
				mxGraphics2DCanvas g2c = (mxGraphics2DCanvas) canvas;
				Graphics2D g2 = g2c.getGraphics();

				// Draws the collapse/expand icons
				boolean isEdge = model.isEdge(state.getCell());

				if (state.getCell() != graph.getCurrentRoot()
						&& (model.isVertex(state.getCell()) || isEdge))
				{
					ImageIcon icon = getFoldingIcon(state);

					if (icon != null)
					{
						Rectangle bounds = getFoldingIconBounds(state, icon);
						g2.drawImage(icon.getImage(), bounds.x, bounds.y,
								bounds.width, bounds.height, this);
					}
				}
			}
		}

		/**
		 * Returns true if the given cell is not the current root or the root in
		 * the model. This can be overridden to not render certain cells in the
		 * graph display.
		 */
		protected boolean isCellDisplayable(Object cell)
		{
			return cell != graph.getView().getCurrentRoot()
					&& cell != graph.getModel().getRoot();
		}

	}

	/**
	 * 
	 */
	public static class mxMouseRedirector implements MouseListener,
			MouseMotionListener
	{

		/**
		 * 
		 */
		protected mxGraphComponent graphComponent;

		/**
		 * 
		 */
		public mxMouseRedirector(mxGraphComponent graphComponent)
		{
			this.graphComponent = graphComponent;
		}

		/*
		 * (non-Javadoc)
		 * 
		 * @see
		 * java.awt.event.MouseListener#mouseClicked(java.awt.event.MouseEvent)
		 */
		public void mouseClicked(MouseEvent e)
		{
			graphComponent.getGraphControl().dispatchEvent(
					SwingUtilities.convertMouseEvent(e.getComponent(), e,
							graphComponent.getGraphControl()));
		}

		/*
		 * (non-Javadoc)
		 * 
		 * @see
		 * java.awt.event.MouseListener#mouseEntered(java.awt.event.MouseEvent)
		 */
		public void mouseEntered(MouseEvent e)
		{
			// Redirecting this would cause problems on the Mac
			// and is technically incorrect anyway
		}

		/*
		 * (non-Javadoc)
		 * 
		 * @see
		 * java.awt.event.MouseListener#mouseExited(java.awt.event.MouseEvent)
		 */
		public void mouseExited(MouseEvent e)
		{
			mouseClicked(e);
		}

		/*
		 * (non-Javadoc)
		 * 
		 * @see
		 * java.awt.event.MouseListener#mousePressed(java.awt.event.MouseEvent)
		 */
		public void mousePressed(MouseEvent e)
		{
			mouseClicked(e);
		}

		/*
		 * (non-Javadoc)
		 * 
		 * @see
		 * java.awt.event.MouseListener#mouseReleased(java.awt.event.MouseEvent)
		 */
		public void mouseReleased(MouseEvent e)
		{
			mouseClicked(e);
		}

		/*
		 * (non-Javadoc)
		 * 
		 * @see
		 * java.awt.event.MouseMotionListener#mouseDragged(java.awt.event.MouseEvent
		 * )
		 */
		public void mouseDragged(MouseEvent e)
		{
			mouseClicked(e);
		}

		/*
		 * (non-Javadoc)
		 * 
		 * @see
		 * java.awt.event.MouseMotionListener#mouseMoved(java.awt.event.MouseEvent
		 * )
		 */
		public void mouseMoved(MouseEvent e)
		{
			mouseClicked(e);
		}

	}

}
