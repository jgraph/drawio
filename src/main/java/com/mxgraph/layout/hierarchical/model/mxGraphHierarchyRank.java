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
package com.mxgraph.layout.hierarchical.model;

import java.util.LinkedHashSet;

/**
 * An abstraction of a rank in the hierarchy layout. Should be ordered, perform
 * remove in constant time and contains in constant time
 */
public class mxGraphHierarchyRank extends LinkedHashSet<mxGraphAbstractHierarchyCell>
{

	/**
	 * 
	 */
	private static final long serialVersionUID = -2781491210687143878L;
}
