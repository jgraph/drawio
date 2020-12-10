/**
 * Copyright (c) 2008-2009, JGraph Ltd
 */
package com.mxgraph.layout.orthogonal;

import com.mxgraph.layout.mxGraphLayout;
import com.mxgraph.layout.orthogonal.model.mxOrthogonalModel;
import com.mxgraph.view.mxGraph;

/**
 *
 */
/**
*
*/
public class mxOrthogonalLayout extends mxGraphLayout
{

  /**
   * 
   */
  protected mxOrthogonalModel orthModel;

  /**
   * Whether or not to route the edges along grid lines only, if the grid
   * is enabled. Default is false
   */
  protected boolean routeToGrid = false;
  
  /**
   * 
   */
  public mxOrthogonalLayout(mxGraph graph)
  {
     super(graph);
     orthModel = new mxOrthogonalModel(graph);
  }

  /**
   * 
   */
  public void execute(Object parent)
  {
     // Create the rectangulation
     
  }

}
