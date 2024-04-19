/**
 * Copyright (c) 2006-2015, JGraph Ltd
 * Copyright (c) 2006-2015, Gaudenz Alder
 */
/**
 * Class: mxStylesheetCodec
 *
 * Codec for <mxStylesheet>s. This class is created and registered
 * dynamically at load time and used implicitly via <mxCodec>
 * and the <mxCodecRegistry>.
 */
var mxStylesheetCodec = mxCodecRegistry.register(function()
{
	var codec = new mxObjectCodec(new mxStylesheet());

	/**
	 * Function: encode
	 *
	 * Encodes a stylesheet. See <decode> for a description of the
	 * format.
	 */
	codec.encode = function(enc, obj)
	{
		var node = enc.document.createElement(this.getName());
		
		for (var i in obj.styles)
		{
			var style = obj.styles[i];
			var styleNode = enc.document.createElement('add');
			
			if (i != null)
			{
				styleNode.setAttribute('as', i);
				
				for (var j in style)
				{
					var value = this.getStringValue(j, style[j]);
					
					if (value != null)
					{
						var entry = enc.document.createElement('add');
						entry.setAttribute('value', value);
						entry.setAttribute('as', j);
						styleNode.appendChild(entry);
					}
				}
				
				if (styleNode.childNodes.length > 0)
				{
					node.appendChild(styleNode);
				}
			}
		}
		
	    return node;
	};

	/**
	 * Function: getStringValue
	 *
	 * Returns the string for encoding the given value.
	 */
	codec.getStringValue = function(key, value)
	{
		var type = typeof(value);
		
		if (type == 'function')
		{
			value = mxStyleRegistry.getName(value);
		}
		else if (type == 'object')
		{
			value = null;
		}
		
		return value;
	};
	
	/**
	 * Function: decode
	 *
	 * Reads a sequence of the following child nodes
	 * and attributes:
	 *
	 * Child Nodes:
	 *
	 * add - Adds a new style.
	 *
	 * Attributes:
	 *
	 * as - Name of the style.
	 * extend - Name of the style to inherit from.
	 *
	 * Each node contains another sequence of add and remove nodes with the following
	 * attributes:
	 *
	 * as - Name of the style (see <mxConstants>).
	 * value - Value for the style.
	 *
	 * Instead of the value-attribute, one can put Javascript expressions into
	 * the node as follows if <mxStylesheetCodec.allowEval> is true:
	 * <add as="perimeter">mxPerimeter.RectanglePerimeter</add>
	 *
	 * A remove node will remove the entry with the name given in the as-attribute
	 * from the style.
	 * 
	 * Example:
	 *
	 * (code)
	 * <mxStylesheet as="stylesheet">
	 *   <add as="text">
	 *     <add as="fontSize" value="12"/>
	 *   </add>
	 *   <add as="defaultVertex" extend="text">
	 *     <add as="shape" value="rectangle"/>
	 *   </add>
	 * </mxStylesheet>
	 * (end)
	 */
	codec.decode = function(dec, node, into)
	{
		var obj = into || new this.template.constructor();
		var id = node.getAttribute('id');
		
		if (id != null)
		{
			dec.objects[id] = obj;
		}
		
		node = node.firstChild;
		
		while (node != null)
		{
			if (!this.processInclude(dec, node, obj) && node.nodeName == 'add')
			{
				var as = node.getAttribute('as');
				
				if (as != null)
				{
					var extend = node.getAttribute('extend');
					var style = (extend != null) ? mxUtils.clone(obj.styles[extend]) : null;
					
					if (style == null)
					{
						if (extend != null)
						{
							mxLog.warn('mxStylesheetCodec.decode: stylesheet ' +
								extend + ' not found to extend');
						}
						
						style = new Object();
					}
					
					var entry = node.firstChild;
					
					while (entry != null)
					{
						if (entry.nodeType == mxConstants.NODETYPE_ELEMENT)
						{
						 	var key = entry.getAttribute('as');
						 	
						 	if (entry.nodeName == 'add')
						 	{
							 	var text = mxUtils.getTextContent(entry);
							 	var value = null;
							 	
							 	if (text != null && text.length > 0 && mxStylesheetCodec.allowEval)
							 	{
							 		value = mxUtils.eval(text);
							 	}
							 	else
							 	{
							 		value = entry.getAttribute('value');
							 		
							 		if (mxUtils.isNumeric(value))
							 		{
										value = parseFloat(value);
									}
							 	}

							 	if (value != null)
							 	{
							 		style[key] = value;
							 	}
						 	}
						 	else if (entry.nodeName == 'remove')
						 	{
						 		delete style[key];
						 	}
						}
						
						entry = entry.nextSibling;
					}
					
					obj.putCellStyle(as, style);
				}
			}
			
			node = node.nextSibling;
		}
		
		return obj;
	};

	// Returns the codec into the registry
	return codec;

}());

/**
 * Variable: allowEval
 * 
 * Static global switch that specifies if the use of eval is allowed for
 * evaluating text content. Default is true. Set this to false if stylesheets
 * may contain user input.
 */
mxStylesheetCodec.allowEval = false;
