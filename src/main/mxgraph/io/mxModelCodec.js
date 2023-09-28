/**
 * Copyright (c) 2006-2015, JGraph Ltd
 * Copyright (c) 2006-2015, Gaudenz Alder
 */
mxCodecRegistry.register(function()
{
	/**
	 * Class: mxModelCodec
	 *
	 * Codec for <mxGraphModel>s. This class is created and registered
	 * dynamically at load time and used implicitly via <mxCodec>
	 * and the <mxCodecRegistry>.
	 */
	var codec = new mxObjectCodec(new mxGraphModel());

	/**
	 * Function: encodeObject
	 *
	 * Encodes the given <mxGraphModel> by writing a (flat) XML sequence of
	 * cell nodes as produced by the <mxCellCodec>. The sequence is
	 * wrapped-up in a node with the name root.
	 */
	codec.encodeObject = function(enc, obj, node)
	{
		var rootNode = enc.document.createElement('root');
		enc.encodeCell(obj.getRoot(), rootNode);
		node.appendChild(rootNode);
	};

	/**
	 * Function: decodeChild
	 * 
	 * Overrides decode child to handle special child nodes.
	 */	
	codec.decodeChild = function(dec, child, obj)
	{
		if (child.nodeName == 'root')
		{
			this.decodeRoot(dec, child, obj);
		}
		else
		{
			mxObjectCodec.prototype.decodeChild.apply(this, arguments);
		}
	};

	/**
	 * Function: decodeRoot
	 *
	 * Reads the cells into the graph model. All cells
	 * are children of the root element in the node.
	 */
	codec.decodeRoot = function(dec, root, model)
	{
		var rootCell = null;
		var tmp = root.firstChild;
		
		while (tmp != null)
		{
			var cell = dec.decodeCell(tmp);
			
			if (cell != null && cell.getParent() == null)
			{
				rootCell = cell;
			}
			
			tmp = tmp.nextSibling;
		}

		// Sets the root on the model if one has been decoded
		if (rootCell != null)
		{
			model.setRoot(rootCell);
		}
	};

	// Returns the codec into the registry
	return codec;

}());
