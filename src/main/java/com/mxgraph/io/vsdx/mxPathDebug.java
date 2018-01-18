package com.mxgraph.io.vsdx;

import com.mxgraph.model.mxCell;
import com.mxgraph.util.mxPoint;
import com.mxgraph.view.mxGraph;

public class mxPathDebug
{
	boolean draw = false;
	double rectSize = 6;
	mxGraph graph = null;
	VsdxShape shape = null;
	double parentHeight;
	String rectStyle = "fillColor=#00ff00;strokeColor=#ff0000;gradientColor=none;verticalLabelPosition=top;labelPosition=center;align=center;verticalAlign=bottom;";
	String lineStyle = "strokeColor=#0000ff;endArrow=none;";
	
	public mxPathDebug(boolean draw, mxGraph graph, VsdxShape shape, double parentHeight)
	{
		this.draw = draw;
		this.graph = graph;
		this.shape = shape;
		this.parentHeight = parentHeight;
	}
	
	public void drawRect(double x, double y, String label)
	{
		mxPoint origin = shape.getOriginPoint(parentHeight, false);
		double x0 = origin.getX() + x - rectSize * 0.5;
		double y0 = origin.getY() + y - rectSize * 0.5;
		graph.insertVertex(null, null, label, x0, y0, rectSize, rectSize, rectStyle);
	}

	public void drawLine(double x0, double y0, double x1, double y1, String label)
	{
		mxPoint origin = shape.getOriginPoint(parentHeight, false);
		x0 = origin.getX() + x0;
		y0 = origin.getY() + y0;
		x1 = origin.getX() + x1;
		y1 = origin.getY() + y1;

		mxCell edge = (mxCell) graph.insertEdge(null, null, label, null, null, lineStyle);
		edge.getGeometry().setTerminalPoint(new mxPoint(x0, y0), true);
		edge.getGeometry().setTerminalPoint(new mxPoint(x1, y1), false);
	}
}
