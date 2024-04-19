/**
 * Copyright (c) 2006-2015, JGraph Ltd
 * Copyright (c) 2006-2015, Gaudenz Alder
 */
mxCodecRegistry.register(function()
{
	/**
	 * Class: mxCellCodec
	 *
	 * Codec for <mxCell>s. This class is created and registered
	 * dynamically at load time and used implicitly via <mxCodec>
	 * and the <mxCodecRegistry>.
	 *
	 * Transient Fields:
	 *
	 * - children
	 * - edges
	 * - overlays
	 * - mxTransient
	 *
	 * Reference Fields:
	 *
	 * - parent
	 * - source
	 * - target
	 * 
	 * Transient fields can be added using the following code:
	 * 
	 * mxCodecRegistry.getCodec(mxCell).exclude.push('name_of_field');
	 * 
	 * To subclass <mxCell>, replace the template and add an alias as
	 * follows.
	 * 
	 * (code)
	 * function CustomCell(value, geometry, style)
	 * {
	 *   mxCell.apply(this, arguments);
	 * }
	 * 
	 * mxUtils.extend(CustomCell, mxCell);
	 * 
	 * mxCodecRegistry.getCodec(mxCell).template = new CustomCell();
	 * mxCodecRegistry.addAlias('CustomCell', 'mxCell');
	 * (end)
	 */
	var codec = new mxObjectCodec(new mxCell(),
		['children', 'edges', 'overlays', 'mxTransient'],
		['parent', 'source', 'target']);

	/**
	 * Function: isCellCodec
	 *
	 * Returns true since this is a cell codec.
	 */
	codec.isCellCodec = function()
	{
		return true;
	};

	/**
	 * Overidden to disable conversion of value to number.
	 */
	codec.isNumericAttribute = function(dec, attr, obj)
	{
		return attr.nodeName !== 'value' && mxObjectCodec.prototype.isNumericAttribute.apply(this, arguments);
	};
	
	/**
	 * Function: isExcluded
	 *
	 * Excludes user objects that are XML nodes.
	 */ 
	codec.isExcluded = function(obj, attr, value, isWrite)
	{
		return mxObjectCodec.prototype.isExcluded.apply(this, arguments) ||
			(isWrite && attr == 'value' && mxUtils.isNode(value));
	};
	
	/**
	 * Function: afterEncode
	 *
	 * Encodes an <mxCell> and wraps the XML up inside the
	 * XML of the user object (inversion).
	 */
	codec.afterEncode = function(enc, obj, node)
	{
		if (obj.value != null && mxUtils.isNode(obj.value))
		{
			// Wraps the graphical annotation up in the user object (inversion)
			// by putting the result of the default encoding into a clone of the
			// user object (node type 1) and returning this cloned user object.
			var tmp = node;
			node = mxUtils.importNode(enc.document, obj.value, true);
			node.appendChild(tmp);
			
			// Moves the id attribute to the outermost XML node, namely the
			// node which denotes the object boundaries in the file.
			var id = tmp.getAttribute('id');
			node.setAttribute('id', id);
			tmp.removeAttribute('id');
		}

		return node;
	};

	/**
	 * Function: beforeDecode
	 *
	 * Decodes an <mxCell> and uses the enclosing XML node as
	 * the user object for the cell (inversion).
	 */
	codec.beforeDecode = function(dec, node, obj)
	{
		var inner = node.cloneNode(true);
		var classname = this.getName();
		
		if (node.nodeName != classname)
		{
			// Passes the inner graphical annotation node to the
			// object codec for further processing of the cell.
			var tmp = node.getElementsByTagName(classname)[0];
			
			if (tmp != null && tmp.parentNode == node)
			{
				mxUtils.removeWhitespace(tmp, true);
				mxUtils.removeWhitespace(tmp, false);
				tmp.parentNode.removeChild(tmp);
				inner = tmp;
			}
			else
			{
				inner = null;
			}
			
			// Creates the user object out of the XML node
			obj.value = node.cloneNode(true);
			var id = obj.value.getAttribute('id');
			
			if (id != null)
			{
				obj.setId(id);
				obj.value.removeAttribute('id');
			}
		}
		else
		{
			// Uses ID from XML file as ID for cell in model
			obj.setId(node.getAttribute('id'));
		}
			
		// Preprocesses and removes all Id-references in order to use the
		// correct encoder (this) for the known references to cells (all).
		if (inner != null)
		{
			for (var i = 0; i < this.idrefs.length; i++)
			{
				var attr = this.idrefs[i];
				var ref = inner.getAttribute(attr);
				
				if (ref != null)
				{
					inner.removeAttribute(attr);
					var object = dec.objects[ref] || dec.lookup(ref);
					
					if (object == null)
					{
						// Needs to decode forward reference
						var element = dec.getElementById(ref);
						
						if (element != null)
						{
							var decoder = mxCodecRegistry.codecs[element.nodeName] || this;
							object = decoder.decode(dec, element);
						}
						else if (window.console != null)
						{
							console.error('mxCellCodec.beforeDecode: ' +
								this.idrefs[i] + ' ' + ref + ' not found' +
								' for cell ' + obj.getId());
						}
					}
					
					obj[attr] = object;
				}
			}
		}
		
		return inner;
	};

	// Returns the codec into the registry
	return codec;

}());
