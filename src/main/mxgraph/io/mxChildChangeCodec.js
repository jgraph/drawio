/**
 * Copyright (c) 2006-2015, JGraph Ltd
 * Copyright (c) 2006-2015, Gaudenz Alder
 */
mxCodecRegistry.register(function()
{
	/**
	 * Class: mxChildChangeCodec
	 *
	 * Codec for <mxChildChange>s. This class is created and registered
	 * dynamically at load time and used implicitly via <mxCodec> and
	 * the <mxCodecRegistry>.
	 *
	 * Transient Fields:
	 *
	 * - model
	 * - previous
	 * - previousIndex
	 * - child
	 *
	 * Reference Fields:
	 *
	 * - parent
	 */
	var codec = new mxObjectCodec(new mxChildChange(),
		['model', 'child', 'previousIndex'],
		['parent', 'previous']);

	/**
	 * Function: isReference
	 *
	 * Returns true for the child attribute if the child
	 * cell had a previous parent or if we're reading the
	 * child as an attribute rather than a child node, in
	 * which case it's always a reference.
	 */
	codec.isReference = function(obj, attr, value, isWrite)
	{
		if (attr == 'child' && (!isWrite || obj.model.contains(obj.previous)))
		{
			return true;
		}
		
		return mxUtils.indexOf(this.idrefs, attr) >= 0;
	};

	/**
	 * Function: isExcluded
	 *
	 * Excludes references to parent or previous if not in the model.
	 */
  	codec.isExcluded = function(obj, attr, value, write)
  	{
  		return mxObjectCodec.prototype.isExcluded.apply(this, arguments) ||
  			(write && value != null && (attr == 'previous' ||
  			attr == 'parent') && !obj.model.contains(value));
  	};
  	
	/**
	 * Function: afterEncode
	 *
	 * Encodes the child recusively and adds the result
	 * to the given node.
	 */
	codec.afterEncode = function(enc, obj, node)
	{
		if (this.isReference(obj, 'child', obj.child, true))
		{
			// Encodes as reference (id)
			node.setAttribute('child', enc.getId(obj.child));
		}
		else
		{
			// At this point, the encoder is no longer able to know which cells
			// are new, so we have to encode the complete cell hierarchy and
			// ignore the ones that are already there at decoding time. Note:
			// This can only be resolved by moving the notify event into the
			// execute of the edit.
			enc.encodeCell(obj.child, node);
		}
		
		return node;
	};

	/**
	 * Function: beforeDecode
	 *
	 * Decodes the any child nodes as using the respective
	 * codec from the registry.
	 */
	codec.beforeDecode = function(dec, node, obj)
	{
		if (node.firstChild != null &&
			node.firstChild.nodeType == mxConstants.NODETYPE_ELEMENT)
		{
			// Makes sure the original node isn't modified
			node = node.cloneNode(true);
			
			var tmp = node.firstChild;
			obj.child = dec.decodeCell(tmp, false);

			var tmp2 = tmp.nextSibling;
			tmp.parentNode.removeChild(tmp);
			tmp = tmp2;
			
			while (tmp != null)
			{
				tmp2 = tmp.nextSibling;
				
				if (tmp.nodeType == mxConstants.NODETYPE_ELEMENT)
				{
					// Ignores all existing cells because those do not need to
					// be re-inserted into the model. Since the encoded version
					// of these cells contains the new parent, this would leave
					// to an inconsistent state on the model (ie. a parent
					// change without a call to parentForCellChanged).
					var id = tmp.getAttribute('id');
					
					if (dec.lookup(id) == null)
					{
						dec.decodeCell(tmp);
					}
				}
				
				tmp.parentNode.removeChild(tmp);
				tmp = tmp2;
			}
		}
		else
		{
			var childRef = node.getAttribute('child');
			obj.child = dec.getObject(childRef);
		}
		
		return node;
	};
	
	/**
	 * Function: afterDecode
	 *
	 * Restores object state in the child change.
	 */
	codec.afterDecode = function(dec, node, obj)
	{
		// Cells are decoded here after a complete transaction so the previous
		// parent must be restored on the cell for the case where the cell was
		// added. This is needed for the local model to identify the cell as a
		// new cell and register the ID.
        if (obj.child != null)
        {
            if (obj.child.parent != null && obj.previous != null &&
                obj.child.parent != obj.previous)
            {
                obj.previous = obj.child.parent;
            }

            obj.child.parent = obj.previous;
            obj.previous = obj.parent;
            obj.previousIndex = obj.index;
        }

		return obj;
	};

	// Returns the codec into the registry
	return codec;

}());
