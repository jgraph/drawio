package com.mxgraph.io.vsdx.geometry;

import com.mxgraph.io.vsdx.Shape;
import com.mxgraph.io.vsdx.mxPoint;

public class DelRow extends Row{

	public DelRow(int index) {
		super(index, null, null);
	}

	@Override
	public String handle(mxPoint p, Shape shape)
	{
		//Nothing
		return "";
	}

}
