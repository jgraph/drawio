package com.mxgraph.io.gliffy.model;

import java.util.List;

public class Stage
{

	private String background;

	private float width;

	private float height;

	private boolean autofit;

	private boolean gridOn;

	private boolean drawingGuidesOn;

	private List<GliffyObject> objects;

	public Stage()
	{
	}

	public String getBackgroundColor()
	{
		return background;
	}

	public void setBackground(String background)
	{
		this.background = background;
	}

	public float getWidth()
	{
		return width;
	}

	public void setWidth(float width)
	{
		this.width = width;
	}

	public float getHeight()
	{
		return height;
	}

	public void setHeight(float height)
	{
		this.height = height;
	}

	public boolean isAutofit()
	{
		return autofit;
	}

	public void setAutofit(boolean autofit)
	{
		this.autofit = autofit;
	}

	public boolean isGridOn()
	{
		return gridOn;
	}

	public void setGridOn(boolean gridOn)
	{
		this.gridOn = gridOn;
	}

	public boolean isDrawingGuidesOn()
	{
		return drawingGuidesOn;
	}

	public void setDrawingGuidesOn(boolean drawingGuidesOn)
	{
		this.drawingGuidesOn = drawingGuidesOn;
	}

	public List<GliffyObject> getObjects()
	{
		return objects;
	}

	public void setObjects(List<GliffyObject> objects)
	{
		this.objects = objects;
	}
}