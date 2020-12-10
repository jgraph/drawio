package com.mxgraph.swing.util;

import com.mxgraph.util.mxRectangle;
import com.mxgraph.view.mxCellState;

public interface mxICellOverlay
{

	/**
	 * 
	 */
	mxRectangle getBounds(mxCellState state);

}
