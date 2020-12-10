package com.mxgraph.layout;

import com.mxgraph.model.mxGeometry;
import com.mxgraph.model.mxICell;
import com.mxgraph.model.mxIGraphModel;
import com.mxgraph.util.mxRectangle;
import com.mxgraph.view.mxCellState;
import com.mxgraph.view.mxGraph;

public class mxStackLayout extends mxGraphLayout
{

	/**
	 * Specifies the orientation of the layout. Default is true.
	 */
	protected boolean horizontal;

	/**
	 * Specifies the spacing between the cells. Default is 0.
	 */
	protected int spacing;

	/**
	 * Specifies the horizontal origin of the layout. Default is 0.
	 */
	protected int x0;

	/**
	 * Specifies the vertical origin of the layout. Default is 0.
	 */
	protected int y0;
	
	/**
	 * Border to be added if fill is true. Default is 0.
	 */
	protected int border;

	/**
	 * Boolean indicating if dimension should be changed to fill out the parent
	 * cell. Default is false.
	 */
	protected boolean fill = false;

	/**
	 * If the parent should be resized to match the width/height of the
	 * stack. Default is false.
	 */
	protected boolean resizeParent = false;

	/**
	 * Value at which a new column or row should be created. Default is 0.
	 */
	protected int wrap = 0;

	/**
	 * Constructs a new stack layout layout for the specified graph,
	 * spacing, orientation and offset.
	 */
	public mxStackLayout(mxGraph graph)
	{
		this(graph, true);
	}

	/**
	 * Constructs a new stack layout layout for the specified graph,
	 * spacing, orientation and offset.
	 */
	public mxStackLayout(mxGraph graph, boolean horizontal)
	{
		this(graph, horizontal, 0);
	}

	/**
	 * Constructs a new stack layout layout for the specified graph,
	 * spacing, orientation and offset.
	 */
	public mxStackLayout(mxGraph graph, boolean horizontal, int spacing)
	{
		this(graph, horizontal, spacing, 0, 0, 0);
	}

	/**
	 * Constructs a new stack layout layout for the specified graph,
	 * spacing, orientation and offset.
	 */
	public mxStackLayout(mxGraph graph, boolean horizontal, int spacing,
			int x0, int y0, int border)
	{
		super(graph);
		this.horizontal = horizontal;
		this.spacing = spacing;
		this.x0 = x0;
		this.y0 = y0;
		this.border = border;
	}
	
	/**
	 * 
	 */
	public boolean isHorizontal()
	{
		return horizontal;
	}

	/*
	 * (non-Javadoc)
	 * @see com.mxgraph.layout.mxGraphLayout#move(java.lang.Object, double, double)
	 */
	public void moveCell(Object cell, double x, double y)
	{
		mxIGraphModel model = graph.getModel();
		Object parent = model.getParent(cell);
		boolean horizontal = isHorizontal();

		if (cell instanceof mxICell && parent instanceof mxICell)
		{
			int i = 0;
			double last = 0;
			int childCount = model.getChildCount(parent);
			double value = (horizontal) ? x : y;
			mxCellState pstate = graph.getView().getState(parent);

			if (pstate != null)
			{
				value -= (horizontal) ? pstate.getX() : pstate.getY();
			}

			for (i = 0; i < childCount; i++)
			{
				Object child = model.getChildAt(parent, i);

				if (child != cell)
				{
					mxGeometry bounds = model.getGeometry(child);

					if (bounds != null)
					{
						double tmp = (horizontal) ? bounds.getX()
								+ bounds.getWidth() / 2 : bounds.getY()
								+ bounds.getHeight() / 2;

						if (last < value && tmp > value)
						{
							break;
						}

						last = tmp;
					}
				}
			}

			// Changes child order in parent
			int idx = ((mxICell) parent).getIndex((mxICell) cell);
			idx = Math.max(0, i - ((i > idx) ? 1 : 0));

			model.add(parent, cell, idx);
		}
	}

	/**
	 * Hook for subclassers to return the container size.
	 */
	public mxRectangle getContainerSize()
	{
		return new mxRectangle();
	}

	/*
	 * (non-Javadoc)
	 * @see com.mxgraph.layout.mxIGraphLayout#execute(java.lang.Object)
	 */
	public void execute(Object parent)
	{
		if (parent != null)
		{
			boolean horizontal = isHorizontal();
			mxIGraphModel model = graph.getModel();
			mxGeometry pgeo = model.getGeometry(parent);

			// Handles special case where the parent is either a layer with no
			// geometry or the current root of the view in which case the size
			// of the graph's container will be used.
			if (pgeo == null && model.getParent(parent) == model.getRoot()
					|| parent == graph.getView().getCurrentRoot())
			{
				mxRectangle tmp = getContainerSize();
				pgeo = new mxGeometry(0, 0, tmp.getWidth(), tmp.getHeight());
			}

			double fillValue = 0;

			if (pgeo != null)
			{
				fillValue = (horizontal) ? pgeo.getHeight() : pgeo.getWidth();
			}

			fillValue -= 2 * spacing + 2 * border;

			// Handles swimlane start size
			mxRectangle size = graph.getStartSize(parent);
			fillValue -= (horizontal) ? size.getHeight() : size.getWidth();
			double x0 = this.x0 + size.getWidth() + border;
			double y0 = this.y0 + size.getHeight() + border;

			model.beginUpdate();
			try
			{
				double tmp = 0;
				mxGeometry last = null;
				int childCount = model.getChildCount(parent);

				for (int i = 0; i < childCount; i++)
				{
					Object child = model.getChildAt(parent, i);

					if (!isVertexIgnored(child) && isVertexMovable(child))
					{
						mxGeometry geo = model.getGeometry(child);

						if (geo != null)
						{
							geo = (mxGeometry) geo.clone();

							if (wrap != 0 && last != null)
							{

								if ((horizontal && last.getX()
										+ last.getWidth() + geo.getWidth() + 2
										* spacing > wrap)
										|| (!horizontal && last.getY()
												+ last.getHeight()
												+ geo.getHeight() + 2 * spacing > wrap))
								{
									last = null;

									if (horizontal)
									{
										y0 += tmp + spacing;
									}
									else
									{
										x0 += tmp + spacing;
									}

									tmp = 0;
								}
							}

							tmp = Math.max(tmp, (horizontal) ? geo
									.getHeight() : geo.getWidth());

							if (last != null)
							{
								if (horizontal)
								{
									geo.setX(last.getX() + last.getWidth()
											+ spacing);
								}
								else
								{
									geo.setY(last.getY() + last.getHeight()
											+ spacing);
								}
							}
							else
							{
								if (horizontal)
								{
									geo.setX(x0);
								}
								else
								{
									geo.setY(y0);
								}
							}

							if (horizontal)
							{
								geo.setY(y0);
							}
							else
							{
								geo.setX(x0);
							}

							if (fill && fillValue > 0)
							{
								if (horizontal)
								{
									geo.setHeight(fillValue);
								}
								else
								{
									geo.setWidth(fillValue);
								}
							}

							model.setGeometry(child, geo);
							last = geo;
						}
					}
				}

				if (resizeParent && pgeo != null && last != null
						&& !graph.isCellCollapsed(parent))
				{
					pgeo = (mxGeometry) pgeo.clone();

					if (horizontal)
					{
						pgeo.setWidth(last.getX() + last.getWidth() + spacing);
					}
					else
					{
						pgeo
								.setHeight(last.getY() + last.getHeight()
										+ spacing);
					}

					model.setGeometry(parent, pgeo);
				}
			}
			finally
			{
				model.endUpdate();
			}
		}
	}

}
