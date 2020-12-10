/* 
 * Copyright (c) 2005, David Benson
 * 
 * All rights reserved. 
 * 
 * This file is licensed under the JGraph software license, a copy of which
 * will have been provided to you in the file LICENSE at the root of your
 * installation directory. If you are unable to locate this file please
 * contact JGraph sales for another copy.
 */
package com.mxgraph.layout.hierarchical.stage;

/**
 * The specific layout interface for hierarchical layouts. It adds a
 * <code>run</code> method with a parameter for the hierarchical layout model
 * that is shared between the layout stages.
 */
public interface mxHierarchicalLayoutStage
{

	/**
	 * Takes the graph detail and configuration information within the facade
	 * and creates the resulting laid out graph within that facade for further
	 * use.
	 */
	public void execute(Object parent);

}
