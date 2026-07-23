/**
 * Copyright (c) 2006-2015, JGraph Holdings Ltd
 * Copyright (c) 2006-2015, draw.io AG
 * 
 * Code to add stencils.
 * 
 * (code)
 * var req = mxUtils.load('test/stencils.xml');
 * var root = req.getDocumentElement();
 * var shape = root.firstChild;
 * 
 * while (shape != null)
 * {
 * 	 if (shape.nodeType == mxConstants.NODETYPE_ELEMENT)
 *   {
 *     mxStencilRegistry.addStencil(shape.getAttribute('name'), new mxStencil(shape));
 *   }
 *   
 *   shape = shape.nextSibling;
 * }
 * (end)
 */
var mxStencilRegistry =
{
	/**
	 * Class: mxStencilRegistry
	 *
	 * A singleton class that provides a registry for stencils and the methods
	 * for painting those stencils onto a canvas or into a DOM. The stencils
	 * map has no prototype so that stencil names from untrusted cell styles
	 * or library files cannot resolve or overwrite inherited members of
	 * Object.prototype (eg. __proto__ or constructor).
	 */
	stencils: Object.create(null),
	
	/**
	 * Function: addStencil
	 * 
	 * Adds the given <mxStencil>.
	 */
	addStencil: function(name, stencil)
	{
		mxStencilRegistry.stencils[name] = stencil;
	},
	
	/**
	 * Function: getStencil
	 * 
	 * Returns the <mxStencil> for the given name.
	 */
	getStencil: function(name)
	{
		return mxStencilRegistry.stencils[name];
	}

};
