package com.mxgraph.shape;

import java.util.HashMap;
import java.util.Map;

public class mxStencilRegistry
{
	/**
	 * 
	 */
	protected static Map<String, mxStencil> stencils = new HashMap<String, mxStencil>();

	/**
	 * Adds the given stencil.
	 */
	public static void addStencil(String name, mxStencil stencil)
	{
		stencils.put(name, stencil);
	}

	/**
	 * Returns the stencil for the given name.
	 */
	public static mxStencil getStencil(String name)
	{
		return stencils.get(name);
	}

}
