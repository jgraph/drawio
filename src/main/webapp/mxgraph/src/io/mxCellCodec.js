/**
 * Copyright (c) 2006-2015, JGraph Holdings Ltd
 * Copyright (c) 2006-2015, draw.io AG
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
	 * Overidden to disable conversion of value and style to number. A style
	 * is always a string, eg. style="1" names a style.
	 */
	codec.isNumericAttribute = function(dec, attr, obj)
	{
		return attr.nodeName !== 'value' && attr.nodeName !== 'style' &&
			mxObjectCodec.prototype.isNumericAttribute.apply(this, arguments);
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
	 * Function: normalizeUserObject
	 *
	 * Returns the given clone of the XML node for the user object of a cell.
	 * A node in the XHTML, SVG or MathML namespace is an HTML, SVG or MathML
	 * element, which <mxUtils.isNode> does not accept, so that the user
	 * object would be lost when the cell is encoded. Such a node is moved
	 * into an element without a namespace with the same local name, the
	 * same attributes except for the default namespace declaration and the
	 * same child nodes. A local name that is the name of a codec is replaced
	 * with UserObject, as the name decides how the node is decoded when the
	 * cell is encoded and decoded again, eg. h:mxCell is a user object but
	 * mxCell is a cell.
	 */
	codec.normalizeUserObject = function(clone)
	{
		if (!mxUtils.isNode(clone))
		{
			var name = clone.localName;

			if (mxCodecRegistry.codecs[name] != null ||
				mxCodecRegistry.aliases[name] != null)
			{
				name = 'UserObject';
			}

			var elt = clone.ownerDocument.createElementNS(null, name);

			for (var i = 0; i < clone.attributes.length; i++)
			{
				var attr = clone.attributes[i];

				// The default namespace declaration would put the element
				// back into the namespace when it is encoded and decoded
				// again. Prefixed declarations are kept for the prefixes of
				// attributes and child nodes, which getPrettyXml does not add.
				if (attr.name != 'xmlns')
				{
					elt.setAttributeNS(attr.namespaceURI, attr.name, attr.value);
				}
			}

			while (clone.firstChild != null)
			{
				elt.appendChild(clone.firstChild);
			}

			clone = elt;
		}

		return clone;
	};

	/**
	 * Function: beforeDecode
	 *
	 * Decodes an <mxCell> and uses the enclosing XML node as
	 * the user object for the cell (inversion).
	 */
	codec.beforeDecode = function(dec, node, obj)
	{
		// The given node is not changed as callers may keep it, eg. to
		// decode or write it again, and as a node with a duplicate ID is
		// decoded again from the same node
		var inner = node;
		var classname = this.getName();

		if (node.nodeName != classname)
		{
			// Passes the inner graphical annotation node to the
			// object codec for further processing of the cell.
			var tmp = node.getElementsByTagName(classname)[0];
			inner = (tmp != null && tmp.parentNode == node) ? tmp : null;

			// Creates the user object out of the XML node
			obj.value = this.normalizeUserObject(
				this.cloneUserObject(node, inner));
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

		// Resolves all Id-references in order to use the correct encoder
		// (this) for the known references to cells (all). The attributes
		// are skipped in isIgnoredAttribute rather than removed from a
		// clone of the node, which is superlinear for nested cells.
		if (inner != null)
		{
			for (var i = 0; i < this.idrefs.length; i++)
			{
				var attr = this.idrefs[i];
				var ref = inner.getAttribute(attr);

				if (ref != null)
				{
					var object = dec.objects[ref] || dec.lookup(ref);
					
					if (object == null)
					{
						// Needs to decode forward reference
						var element = dec.getElementById(ref);
						
						if (element != null)
						{
							var decoder = mxCodecRegistry.codecs[element.nodeName];
							
							// Only decodes cells, ie. cell codecs or node
							// names without a codec such as object and
							// UserObject. A registered non-cell codec, eg.
							// for a geometry, is skipped as the result is
							// ignored below and decoding it can be superlinear.
							if (decoder == null || dec.isCellCodec(decoder))
							{
								object = (decoder || this).decode(dec, element);
							}
							else if (window.console != null)
							{
								console.error('mxCellCodec.beforeDecode: ' +
									this.idrefs[i] + ' ' + ref + ' is not a cell' +
									' for cell ' + obj.getId());
							}
						}
						else if (window.console != null)
						{
							console.error('mxCellCodec.beforeDecode: ' +
								this.idrefs[i] + ' ' + ref + ' not found' +
								' for cell ' + obj.getId());
						}
					}

					// Ignores references to objects that are not cells, eg.
					// the id of a geometry in malformed XML
					if (object != null && !(object instanceof mxCell))
					{
						if (window.console != null)
						{
							console.error('mxCellCodec.beforeDecode: ' +
								this.idrefs[i] + ' ' + ref + ' is not a cell' +
								' for cell ' + obj.getId());
						}

						object = null;
					}
					
					obj[attr] = object;
				}
			}
		}
		
		return inner;
	};

	/**
	 * Function: cloneUserObject
	 *
	 * Returns a deep clone of the given user object node without the given
	 * inner cell node and the whitespace text nodes around it.
	 */
	codec.cloneUserObject = function(node, inner)
	{
		if (inner == null)
		{
			return node.cloneNode(true);
		}

		// Skips the whitespace text nodes next to the inner node, ie. the
		// text nodes that mxUtils.removeWhitespace removes
		var skip = [inner];

		for (var i = 0; i < 2; i++)
		{
			var tmp = (i == 0) ? inner.previousSibling : inner.nextSibling;

			while (tmp != null && tmp.nodeType == mxConstants.NODETYPE_TEXT)
			{
				if (mxUtils.trim(mxUtils.getTextContent(tmp)).length == 0)
				{
					skip.push(tmp);
				}

				tmp = (i == 0) ? tmp.previousSibling : tmp.nextSibling;
			}
		}

		var clone = node.cloneNode(false);
		var child = node.firstChild;

		while (child != null)
		{
			if (mxUtils.indexOf(skip, child) < 0)
			{
				clone.appendChild(child.cloneNode(true));
			}

			child = child.nextSibling;
		}

		return clone;
	};

	/**
	 * Function: isIgnoredAttribute
	 *
	 * Ignores the Id-references, which are resolved in <beforeDecode>.
	 */
	codec.isIgnoredAttribute = function(dec, attr, obj)
	{
		return mxObjectCodec.prototype.isIgnoredAttribute.apply(this, arguments) ||
			mxUtils.indexOf(this.idrefs, attr.nodeName) >= 0;
	};

	/**
	 * Variable: fieldTypes
	 *
	 * Decodes a geometry of another node type, eg. <mxgeometry>, as an
	 * <mxGeometry>, and likewise the points and bounds of the geometry.
	 */
	codec.fieldTypes = Object.create(null);
	codec.fieldTypes['geometry'] = mxGeometry;

	var geometryCodec = mxCodecRegistry.getCodec(mxGeometry);
	geometryCodec.fieldTypes = Object.create(null);
	geometryCodec.fieldTypes['sourcePoint'] = mxPoint;
	geometryCodec.fieldTypes['targetPoint'] = mxPoint;
	geometryCodec.fieldTypes['offset'] = mxPoint;
	geometryCodec.fieldTypes['alternateBounds'] = mxRectangle;

	// Returns the codec into the registry
	return codec;

}());
