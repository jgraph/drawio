package com.mxgraph.shape;

import java.awt.Rectangle;
import java.awt.Shape;
import java.awt.geom.GeneralPath;

import com.mxgraph.canvas.mxGraphics2DCanvas;
import com.mxgraph.view.mxCellState;

public class mxActorShape extends mxBasicShape
{

	/**
	 * 
	 */
	public Shape createShape(mxGraphics2DCanvas canvas, mxCellState state)
	{
		Rectangle temp = state.getRectangle();
		int x = temp.x;
		int y = temp.y;
		int w = temp.width;
		int h = temp.height;
		float width = w * 2 / 6;

		GeneralPath path = new GeneralPath();

		path.moveTo(x, y + h);
		path.curveTo(x, y + 3 * h / 5, x, y + 2 * h / 5, x + w / 2, y + 2 * h
				/ 5);
		path.curveTo(x + w / 2 - width, y + 2 * h / 5, x + w / 2 - width, y, x
				+ w / 2, y);
		path.curveTo(x + w / 2 + width, y, x + w / 2 + width, y + 2 * h / 5, x
				+ w / 2, y + 2 * h / 5);
		path.curveTo(x + w, y + 2 * h / 5, x + w, y + 3 * h / 5, x + w, y + h);
		path.closePath();

		return path;
	}

}
