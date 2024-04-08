/**
 * Copyright (c) 2006-2015, JGraph Ltd
 * Copyright (c) 2006-2015, Gaudenz Alder
 */
/**
 * Class: mxCodec
 *
 * XML codec for JavaScript object graphs. See <mxObjectCodec> for a
 * description of the general encoding/decoding scheme. This class uses the
 * codecs registered in <mxCodecRegistry> for encoding/decoding each object.
 * 
 * References:
 * 
 * In order to resolve references, especially forward references, the mxCodec
 * constructor must be given the document that contains the referenced
 * elements.
 *
 * Examples:
 *
 * The following code is used to encode a graph model.
 *
 * (code)
 * var encoder = new mxCodec();
 * var result = encoder.encode(graph.getModel());
 * var xml = mxUtils.getXml(result);
 * (end)
 * 
 * Example:
 * 
 * Using the code below, an XML document is decoded into an existing model. The
 * document may be obtained using one of the functions in mxUtils for loading
 * an XML file, eg. <mxUtils.get>, or using <mxUtils.parseXml> for parsing an
 * XML string.
 * 
 * (code)
 * var doc = mxUtils.parseXml(xmlString);
 * var codec = new mxCodec(doc);
 * codec.decode(doc.documentElement, graph.getModel());
 * (end)
 * 
 * Example:
 * 
 * This example demonstrates parsing a list of isolated cells into an existing
 * graph model. Note that the cells do not have a parent reference so they can
 * be added anywhere in the cell hierarchy after parsing.
 * 
 * (code)
 * var xml = '<root><mxCell id="2" value="Hello," vertex="1"><mxGeometry x="20" y="20" width="80" height="30" as="geometry"/></mxCell><mxCell id="3" value="World!" vertex="1"><mxGeometry x="200" y="150" width="80" height="30" as="geometry"/></mxCell><mxCell id="4" value="" edge="1" source="2" target="3"><mxGeometry relative="1" as="geometry"/></mxCell></root>';
 * var doc = mxUtils.parseXml(xml);
 * var codec = new mxCodec(doc);
 * var elt = doc.documentElement.firstChild;
 * var cells = [];
 * 
 * while (elt != null)
 * {
 *   cells.push(codec.decode(elt));
 *   elt = elt.nextSibling;
 * }
 * 
 * graph.addCells(cells);
 * (end)
 * 
 * Example:
 * 
 * Using the following code, the selection cells of a graph are encoded and the
 * output is displayed in a dialog box.
 * 
 * (code)
 * var enc = new mxCodec();
 * var cells = graph.getSelectionCells();
 * mxUtils.alert(mxUtils.getPrettyXml(enc.encode(cells)));
 * (end)
 * 
 * Newlines in the XML can be converted to <br>, in which case a '<br>' argument
 * must be passed to <mxUtils.getXml> as the second argument.
 * 
 * Debugging:
 * 
 * For debugging I/O you can use the following code to get the sequence of
 * encoded objects:
 * 
 * (code)
 * var oldEncode = mxCodec.prototype.encode;
 * mxCodec.prototype.encode = function(obj)
 * {
 *   mxLog.show();
 *   mxLog.debug('mxCodec.encode: obj='+mxUtils.getFunctionName(obj.constructor));
 *   
 *   return oldEncode.apply(this, arguments);
 * };
 * (end)
 * 
 * Note that the I/O system adds object codecs for new object automatically. For
 * decoding those objects, the constructor should be written as follows:
 * 
 * (code)
 * var MyObj = function(name)
 * {
 *   // ...
 * };
 * (end)
 * 
 * Constructor: mxCodec
 *
 * Constructs an XML encoder/decoder for the specified
 * owner document.
 *
 * Parameters:
 *
 * document - Optional XML document that contains the data.
 * If no document is specified then a new document is created
 * using <mxUtils.createXmlDocument>.
 */
function mxCodec(document)
{
	this.document = document || mxUtils.createXmlDocument();
	this.objects = [];
};

/**
 * Variable: allowlist
 *
 * Array of strings that specifies the types to be decoded. Null means all
 * types are allowed. Default is null.
 */
mxCodec.allowlist = null;

/**
 * Variable: document
 *
 * The owner document of the codec.
 */
mxCodec.prototype.document = null;

/**
 * Variable: objects
 *
 * Maps from IDs to objects.
 */
mxCodec.prototype.objects = null;

/**
 * Variable: elements
 * 
 * Lookup table for resolving IDs to elements.
 */
mxCodec.prototype.elements = null;

/**
 * Variable: encodeDefaults
 *
 * Specifies if default values should be encoded. Default is false.
 */
mxCodec.prototype.encodeDefaults = false;


/**
 * Function: putObject
 * 
 * Assoiates the given object with the given ID and returns the given object.
 * 
 * Parameters
 * 
 * id - ID for the object to be associated with.
 * obj - Object to be associated with the ID.
 */
mxCodec.prototype.putObject = function(id, obj)
{
	this.objects[id] = obj;
	
	return obj;
};

/**
 * Function: getObject
 *
 * Returns the decoded object for the element with the specified ID in
 * <document>. If the object is not known then <lookup> is used to find an
 * object. If no object is found, then the element with the respective ID
 * from the document is parsed using <decode>.
 */
mxCodec.prototype.getObject = function(id)
{
	var obj = null;

	if (id != null)
	{
		obj = this.objects[id];
		
		if (obj == null)
		{
			obj = this.lookup(id);
			
			if (obj == null)
			{
				var node = this.getElementById(id);
				
				if (node != null)
				{
					obj = this.decode(node);
				}
			}
		}
	}
	
	return obj;
};

/**
 * Function: lookup
 *
 * Hook for subclassers to implement a custom lookup mechanism for cell IDs.
 * This implementation always returns null.
 *
 * Example:
 *
 * (code)
 * var codec = new mxCodec();
 * codec.lookup = function(id)
 * {
 *   return model.getCell(id);
 * };
 * (end)
 *
 * Parameters:
 *
 * id - ID of the object to be returned.
 */
mxCodec.prototype.lookup = function(id)
{
	return null;
};

/**
 * Function: getElementById
 *
 * Returns the element with the given ID from <document>.
 *
 * Parameters:
 *
 * id - String that contains the ID.
 */
mxCodec.prototype.getElementById = function(id)
{
	this.updateElements();
	
	return this.elements[id];
};

/**
 * Function: updateElements
 *
 * Returns the element with the given ID from <document>.
 *
 * Parameters:
 *
 * id - String that contains the ID.
 */
mxCodec.prototype.updateElements = function()
{
	if (this.elements == null)
	{
		this.elements = new Object();
		
		if (this.document.documentElement != null)
		{
			this.addElement(this.document.documentElement);
		}
	}
};

/**
 * Function: addElement
 *
 * Adds the given element to <elements> if it has an ID.
 */
mxCodec.prototype.addElement = function(node)
{
	if (node.nodeType == mxConstants.NODETYPE_ELEMENT)
	{
		var id = node.getAttribute('id');
		
		if (id != null)
		{
			if (this.elements[id] == null)
			{
				this.elements[id] = node;
			}
			else if (this.elements[id] != node)
			{
				throw new Error(id + ': Duplicate ID');
			}
		}
	}
	
	node = node.firstChild;
	
	while (node != null)
	{
		this.addElement(node);
		node = node.nextSibling;
	}
};

/**
 * Function: isObjectIgnored
 *
 * Returns true if the given object is ignored by the codec. This
 * implementation returns false if the given object is not null.
 */
mxCodec.prototype.isObjectIgnored = function(obj)
{
	return obj == null;
};

/**
 * Function: getId
 *
 * Returns the ID of the specified object. This implementation
 * calls <reference> first and if that returns null handles
 * the object as an <mxCell> by returning their IDs using
 * <mxCell.getId>. If no ID exists for the given cell, then
 * an on-the-fly ID is generated using <mxCellPath.create>.
 *
 * Parameters:
 *
 * obj - Object to return the ID for.
 */
mxCodec.prototype.getId = function(obj)
{
	var id = null;
	
	if (obj != null && !this.isObjectIgnored(obj))
	{
		id = this.reference(obj);
		
		if (id == null && obj instanceof mxCell)
		{
			id = obj.getId();
			
			if (id == null)
			{
				// Uses an on-the-fly Id
				id = mxCellPath.create(obj);
				
				if (id.length == 0)
				{
					id = 'root';
				}
			}
		}
	}
	
	return id;
};

/**
 * Function: reference
 *
 * Hook for subclassers to implement a custom method
 * for retrieving IDs from objects. This implementation
 * always returns null.
 *
 * Example:
 *
 * (code)
 * var codec = new mxCodec();
 * codec.reference = function(obj)
 * {
 *   return obj.getCustomId();
 * };
 * (end)
 *
 * Parameters:
 *
 * obj - Object whose ID should be returned.
 */
mxCodec.prototype.reference = function(obj)
{
	return null;
};

/**
 * Function: encode
 *
 * Encodes the specified object and returns the resulting
 * XML node.
 *
 * Parameters:
 *
 * obj - Object to be encoded. 
 */
mxCodec.prototype.encode = function(obj)
{
	var node = null;
	
	if (obj != null && obj.constructor != null && !this.isObjectIgnored(obj))
	{
		var enc = mxCodecRegistry.getCodec(obj.constructor);
		
		if (enc != null)
		{
			node = enc.encode(this, obj);
		}
		else
		{
			if (mxUtils.isNode(obj))
			{
				node = mxUtils.importNode(this.document, obj, true);
			}
			else
			{
	    		mxLog.warn('mxCodec.encode: No codec for ' + mxUtils.getFunctionName(obj.constructor));
			}
		}
	}
	
	return node;
};

/**
 * Function: decode
 *
 * Decodes the given XML node. The optional "into"
 * argument specifies an existing object to be
 * used. If no object is given, then a new instance
 * is created using the constructor from the codec.
 *
 * The function returns the passed in object or
 * the new instance if no object was given.
 *
 * Parameters:
 *
 * node - XML node to be decoded.
 * into - Optional object to be decodec into.
 */
mxCodec.prototype.decode = function(node, into)
{
	this.updateElements();
	var obj = null;
	
	if (node != null && node.nodeType == mxConstants.NODETYPE_ELEMENT)
	{
		var ctor = this.getConstructor(node.nodeName);
		var dec = mxCodecRegistry.getCodec(ctor);
		
		if (dec != null)
		{
			obj = dec.decode(this, node, into);
		}
		else
		{
			obj = node.cloneNode(true);
			obj.removeAttribute('as');
		}
	}
	
	return obj;
};

/**
 * Function: isConstructorAllowed
 * 
 * Returns true if the given constructor name is allowed to be
 * instantiated.
 *
 * Parameters:
 *
 * name - Name of the constructor to be checked.
 */
mxCodec.prototype.isConstructorAllowed = function(name)
{
	return mxCodec.allowlist == null || mxUtils.indexOf(
		mxCodec.allowlist, name) >= 0;
};

/**
 * Function: getConstructor
 *
 * Returns the constructor for the given object type.
 *
 * Parameters:
 *
 * name - Name of the type to be returned.
 */
mxCodec.prototype.getConstructor = function(name)
{
	var ctor = null;
	
	try
	{
		if (this.isConstructorAllowed(name))
		{
			ctor = window[name];
		}
	}
	catch (err)
	{
		// ignore
	}

	return ctor;
};

/**
 * Function: encodeCell
 *
 * Encoding of cell hierarchies is built-into the core, but
 * is a higher-level function that needs to be explicitely
 * used by the respective object encoders (eg. <mxModelCodec>,
 * <mxChildChangeCodec> and <mxRootChangeCodec>). This
 * implementation writes the given cell and its children as a
 * (flat) sequence into the given node. The children are not
 * encoded if the optional includeChildren is false. The
 * function is in charge of adding the result into the
 * given node and has no return value.
 *
 * Parameters:
 *
 * cell - <mxCell> to be encoded.
 * node - Parent XML node to add the encoded cell into.
 * includeChildren - Optional boolean indicating if the
 * function should include all descendents. Default is true. 
 */
mxCodec.prototype.encodeCell = function(cell, node, includeChildren)
{
	if (!this.isObjectIgnored(cell))
	{
		var cellNode = this.encode(cell);

		if (cellNode != null)
		{
			node.appendChild(cellNode);
		}
		
		if (includeChildren == null || includeChildren)
		{
			var childCount = cell.getChildCount();
			
			for (var i = 0; i < childCount; i++)
			{
				this.encodeCell(cell.getChildAt(i), node);
			}
		}
	}
};

/**
 * Function: isCellCodec
 * 
 * Returns true if the given codec is a cell codec. This uses
 * <mxCellCodec.isCellCodec> to check if the codec is of the
 * given type.
 */
mxCodec.prototype.isCellCodec = function(codec)
{
	if (codec != null && typeof(codec.isCellCodec) == 'function')
	{
		return codec.isCellCodec();
	}
	
	return false;
};

/**
 * Function: decodeCell
 *
 * Decodes cells that have been encoded using inversion, ie.
 * where the user object is the enclosing node in the XML,
 * and restores the group and graph structure in the cells.
 * Returns a new <mxCell> instance that represents the
 * given node.
 *
 * Parameters:
 *
 * node - XML node that contains the cell data.
 * restoreStructures - Optional boolean indicating whether
 * the graph structure should be restored by calling insert
 * and insertEdge on the parent and terminals, respectively.
 * Default is true.
 */
mxCodec.prototype.decodeCell = function(node, restoreStructures)
{
	restoreStructures = (restoreStructures != null) ? restoreStructures : true;
	var cell = null;
	
	if (node != null && node.nodeType == mxConstants.NODETYPE_ELEMENT)
	{
		// Tries to find a codec for the given node name. If that does
		// not return a codec then the node is the user object (an XML node
		// that contains the mxCell, aka inversion).
		var decoder = mxCodecRegistry.getCodec(node.nodeName);
		
		// Tries to find the codec for the cell inside the user object.
		// This assumes all node names inside the user object are either
		// not registered or they correspond to a class for cells.
		if (!this.isCellCodec(decoder))
		{
			var child = node.firstChild;
			
			while (child != null && !this.isCellCodec(decoder))
			{
				decoder = mxCodecRegistry.getCodec(child.nodeName);
				child = child.nextSibling;
			}
		}
		
		if (!this.isCellCodec(decoder))
		{
			decoder = mxCodecRegistry.getCodec(mxCell);
		}

		cell = decoder.decode(this, node);
		
		if (restoreStructures)
		{
			this.insertIntoGraph(cell);
		}
	}
	
	return cell;
};

/**
 * Function: insertIntoGraph
 *
 * Inserts the given cell into its parent and terminal cells.
 */
mxCodec.prototype.insertIntoGraph = function(cell)
{
	var parent = cell.parent;
	var source = cell.getTerminal(true);
	var target = cell.getTerminal(false);

	// Fixes possible inconsistencies during insert into graph
	cell.setTerminal(null, false);
	cell.setTerminal(null, true);
	cell.parent = null;
	
	if (parent != null)
	{
		if (parent == cell)
		{
			throw new Error(parent.id + ': Self Reference');
		}
		else
		{
			parent.insert(cell);
		}
	}

	if (source != null)
	{
		source.insertEdge(cell, true);
	}

	if (target != null)
	{
		target.insertEdge(cell, false);
	}
};

/**
 * Function: setAttribute
 *
 * Sets the attribute on the specified node to value. This is a
 * helper method that makes sure the attribute and value arguments
 * are not null.
 *
 * Parameters:
 *
 * node - XML node to set the attribute for.
 * attributes - Attributename to be set.
 * value - New value of the attribute.
 */
mxCodec.prototype.setAttribute = function(node, attribute, value)
{
	if (attribute != null && value != null)
	{
		node.setAttribute(attribute, value);
	}
};
